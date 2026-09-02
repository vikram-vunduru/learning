# LWC Data Binding & Events

## Exam Domain
User Interface — 25% of exam weight

## Core Concepts

### One-Way Data Binding
LWC is one-way: JS property → template. Template does NOT automatically update properties. For user input, wire up event handlers explicitly.
```html
<!-- Template -->
<input value={searchTerm} onchange={handleChange} />
<p>{searchTerm}</p>
```
```javascript
// JS
searchTerm = '';
handleChange(event) {
    this.searchTerm = event.target.value;  // explicitly update the property
}
```

### Parent-to-Child Communication — @api Properties
Parent passes data via HTML attribute (kebab-case). Child receives via `@api` property (camelCase). Framework converts automatically.
```html
<!-- Parent template -->
<c-account-card record-id={selectedId} is-active={isSelected}></c-account-card>
```
```javascript
// Child: accountCard.js
import { LightningElement, api } from 'lwc';
export default class AccountCard extends LightningElement {
    @api recordId;    // receives record-id from parent
    @api isActive;    // receives is-active from parent
}
```
`account-id` → `@api accountId` | `is-active` → `@api isActive` (kebab → camelCase)

### Parent-to-Child Communication — @api Methods
Parent can call a method on child using `querySelector`.
```javascript
// Parent JS
resetChildForm() {
    this.template.querySelector('c-my-form').reset();
}
```
```javascript
// Child JS
@api reset() {
    this.formData = {};  // method is public via @api
}
```

### Child-to-Parent Communication — CustomEvent
Child dispatches event; parent listens with `on` + event name on the child tag.
```javascript
// Child JS — dispatch event with payload
handleSave() {
    const event = new CustomEvent('recordsaved', {
        detail: { id: this.account.Id, name: this.account.Name }
    });
    this.dispatchEvent(event);
}
```
```html
<!-- Parent template — listen with on + eventname -->
<c-my-form onrecordsaved={handleRecordSaved}></c-my-form>
```
```javascript
// Parent JS — access payload
handleRecordSaved(event) {
    const savedId = event.detail.id;
    const savedName = event.detail.name;
}
```
Event naming: all lowercase, no spaces, no `on-` prefix.

### Event Propagation — bubbles and composed
```javascript
new CustomEvent('myevent', {
    detail: { data: value },
    bubbles: true,    // event propagates up DOM tree (default: false)
    composed: true    // event crosses shadow DOM boundaries (default: false)
})
```
- Default (false/false): only direct parent can catch it via child tag attribute
- `bubbles: true`: ancestor components can listen (they won't see it by default due to shadow boundary)
- `composed: true`: crosses shadow DOM boundary — needed to bubble out of a component

### Sibling Communication — Lightning Message Service (LMS)
Siblings cannot communicate via events (no shared parent). Use LMS pub-sub bus.
```javascript
// Publisher component
import { LightningElement, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import ACCOUNT_SELECTED_CHANNEL from '@salesforce/messageChannel/AccountSelected__c';

export default class AccountList extends LightningElement {
    @wire(MessageContext) messageContext;

    handleAccountClick(accountId) {
        publish(this.messageContext, ACCOUNT_SELECTED_CHANNEL, { accountId });
    }
}
```
```javascript
// Subscriber component
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_SELECTED_CHANNEL from '@salesforce/messageChannel/AccountSelected__c';

export default class AccountDetail extends LightningElement {
    @wire(MessageContext) messageContext;
    subscription = null;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext, ACCOUNT_SELECTED_CHANNEL,
            (msg) => { this.selectedAccountId = msg.accountId; }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);  // always unsubscribe!
    }
}
```

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Kebab-case / camelCase mismatch — `account-id` in parent HTML but `@api accountId` misspelled in child — results in `undefined` @api value, silent data loss
- Missing `unsubscribe()` in `disconnectedCallback()` — LMS subscriptions leak memory; critical in complex apps where users navigate between pages
- Custom events with `composed: true` when bubbling to grandparent is all that's needed — `composed: true` lets events escape the component completely, which can cause unintended listeners to fire

**Enterprise-scale considerations:**
- For large apps with many sibling components, LMS channels become part of the component contract. Document your channels in the architecture: what data they carry, which components publish, which subscribe.
- Over-relying on LMS for everything creates hidden coupling. Parent-child @api is explicit and auditable. LMS is a black-box channel — hard to trace.
- `@api` property mutations in child = anti-pattern but common in junior code. If a child needs to update a value it received from the parent, dispatch an event and let the parent decide whether to update.

**For CTO conversations:**
- "How do our LWC components talk to each other?" — Three patterns: @api (parent-child), CustomEvent (child-to-parent), LMS (siblings/unrelated). Each has a clear use case. Design should document which pattern each component uses.

## Architecture / How It Works

```
COMPONENT COMMUNICATION PATTERNS

  PARENT → CHILD:
  ┌─────────────────────────────────────────────────────────┐
  │  Parent template: <c-child record-id={myId}>            │
  │                                                         │
  │  Child JS: @api recordId;  ← receives myId              │
  │                                                         │
  │  Parent can also call: child.reset()                    │
  │  Child must have: @api reset() { ... }                  │
  └─────────────────────────────────────────────────────────┘

  CHILD → PARENT:
  ┌─────────────────────────────────────────────────────────┐
  │  Child JS: this.dispatchEvent(                          │
  │                new CustomEvent('valuechange',           │
  │                    { detail: { value: 42 } }))          │
  │                                                         │
  │  Parent template: <c-child onvaluechange={handler}>     │
  │  Parent JS: handler(event) { event.detail.value }       │
  └─────────────────────────────────────────────────────────┘

  SIBLING → SIBLING (LMS):
  ┌─────────────────────────────────────────────────────────┐
  │  Component A (publisher):                               │
  │    publish(ctx, MY_CHANNEL, { data: value });           │
  │                                                         │
  │        [MY_CHANNEL]  ← LightningMessageChannel metadata │
  │                                                         │
  │  Component B (subscriber):                              │
  │    subscribe(ctx, MY_CHANNEL, msg => { ... });          │
  │    // Always unsubscribe in disconnectedCallback!       │
  └─────────────────────────────────────────────────────────┘
```

**Limitations:**
- `@api` properties are read-only from within the child — child cannot mutate its own @api properties
- LMS requires a LightningMessageChannel custom metadata type to be deployed first
- CustomEvent with `bubbles: false` (default) can only be caught by a direct parent via child tag attribute

```
ATTRIBUTE NAMING CONVENTION (CRITICAL)

  Parent template HTML          Child JS property
  ─────────────────────         ─────────────────────────
  record-id={...}        →      @api recordId
  account-name={...}     →      @api accountName
  is-active={...}        →      @api isActive
  my-custom-prop={...}   →      @api myCustomProp

  Rule: HTML uses kebab-case; JS uses camelCase.
  Framework converts automatically — but you must follow the convention.

  WRONG (won't receive value):
  Parent: <c-child accountId={...}>   ← should be account-id
  Child:  @api account-id            ← invalid JS (hyphen in identifier)
```

**Limitations:**
- @api property names cannot start with `on` (reserved for event handlers)
- @api property names cannot be `class` or `slot` (reserved HTML attributes)
- Hyphenated JS property names are invalid — always use camelCase

## Key Facts to Memorize
- LWC = **one-way binding** — template reflects JS, input requires explicit handler
- @api: kebab-case HTML → camelCase JS (`record-id` → `@api recordId`)
- Custom event: dispatch with `new CustomEvent('name', { detail: { ... } })`
- Parent listens: `<c-child onname={handler}>` — `on` + event name (lowercase)
- `event.detail.property` — access event payload
- LMS for siblings: publish/subscribe on shared LightningMessageChannel
- Always `unsubscribe()` in `disconnectedCallback()`
- `bubbles: false, composed: false` are defaults — event stays close to dispatch point

## Customer Advisory Tips
- **Communication architecture doc:** For any app with 10+ LWC components, document the event/LMS topology. Which components own which data? Which events flow in which direction?
- **@api immutability:** Educate teams that @api properties received from parent are immutable inside the child. Child dispatches events to request changes; parent decides.

## Exam Traps
- HTML attribute: `record-id` vs JS property: `@api recordId` — must match via conversion, NOT same string
- Custom event name has NO `on` prefix when dispatching, but parent adds `on` when listening
- `event.detail` vs `event.target.value` — for CustomEvents use `event.detail`; for DOM input events use `event.target.value`
- LMS subscribers must `unsubscribe()` in `disconnectedCallback()` or memory leaks
- `bubbles: true` alone doesn't cross shadow DOM boundaries — need `composed: true` for that

## Practice Questions

**Q:** A parent passes `<c-child is-loading={loading}>`. How does the child receive it?
**A:** `@api isLoading;` — HTML `is-loading` converts to camelCase `isLoading`. The `@api` decorator makes it receivable from parent.

**Q:** A child component dispatches `new CustomEvent('formsubmit', { detail: { formData } })`. How does the parent listen and access the data?
**A:** Parent template: `<c-form onformsubmit={handleSubmit}>`. Parent JS: `handleSubmit(event) { const data = event.detail.formData; }`.

**Q:** Component A and Component B are siblings on the same record page. A needs to notify B when a record is selected. What's the correct approach?
**A:** Lightning Message Service. Create a `LightningMessageChannel` metadata record. A publishes with `publish(ctx, CHANNEL, payload)`. B subscribes in `connectedCallback()` and unsubscribes in `disconnectedCallback()`.
