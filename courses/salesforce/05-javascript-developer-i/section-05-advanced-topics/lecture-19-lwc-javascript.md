# Lecture 19: LWC JavaScript

## Learning Objectives
- Explain how LWC uses the ES module system and what restrictions LWC imposes on standard JavaScript
- Use the @api, @track, and @wire decorators correctly and explain what each one does
- Implement component lifecycle hooks (connectedCallback, disconnectedCallback, renderedCallback) for appropriate use cases
- Create and dispatch custom events using CustomEvent with bubbles and composed options
- Call Apex methods from LWC using both the @wire decorator and imperative invocation

## Slides

### Slide 1: LWC is a JavaScript Module
**Visual:** LWC component file structure diagram — myComponent.js, myComponent.html, myComponent.css, and myComponent.js-meta.xml — with annotations showing that myComponent.js is a standard ES module, the html file is the template, and the meta.xml is the Salesforce deployment manifest.
**Content:**
- Every LWC component is an ES module: `import { LightningElement } from 'lwc';`
- The component class extends `LightningElement` — LWC's base class
- LWC enforces **strict mode** automatically (module scope)
- LWC uses the **shadow DOM** — components cannot reach into each other's DOM
- `this.template` is the component's shadow root — use `this.template.querySelector()` not `document.querySelector()`
- File naming: kebab-case folder/file → PascalCase class (my-component → MyComponent)
- **No jQuery, no `window.document`, no CDN imports** — all imports go through the module system
**Speaker Notes:** LWC was designed around the web components standard and the ES module system from the ground up. This means everything you learned in Lectures 1–18 applies directly — ES modules, classes, async/await, arrow functions — all of it. The difference is that LWC adds its own layer of decorators and a shadow DOM model that keeps components isolated. If you've been writing Salesforce Visualforce or Aura, LWC will feel much more like modern JavaScript.

### Slide 2: Decorators — @api, @track, @wire
**Visual:** Three-column table with columns: Decorator, Purpose, Behavior. Row 1: @api — Public property/method, reactive on change, accessible from parent. Row 2: @track — (Legacy) Reactive object/array deep-watching — only needed pre-Spring '20, now all reactive. Row 3: @wire — Reactive wire service binding, auto-calls Apex or LDS. Below the table: code snippet showing all three in one class.
**Content:**
- `@api`: makes a property **public** — parent components can pass values in; also marks methods callable from parent
- `@api` properties are reactive: template re-renders when their value changes
- `@track`: pre-Spring '20, required for reactive objects/arrays; now all properties are reactive — `@track` still works but is rarely needed
- `@wire`: connects the property to a **wire adapter** (LDS functions like `getRecord`, or Apex methods annotated with `@AuraEnabled(cacheable=true)`)
```js
import { LightningElement, api, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
export default class MyComp extends LightningElement {
    @api recordId;
    @wire(getContacts, { accountId: '$recordId' }) contacts;
}
```
- `$recordId` — the `$` prefix makes the wire parameter **reactive** to property changes
**Speaker Notes:** The three decorators are the most-tested LWC topic in the JSI exam. The key distinction is: @api is for the component's public interface (parent can set it), @wire is for connecting to Salesforce data or services automatically, and @track is largely historical but still valid. The `$` prefix on wire parameters is how you make a wire call refresh when a property changes — without `$`, the parameter is a static value set at component mount time.

### Slide 3: Lifecycle Hooks
**Visual:** Vertical timeline diagram showing the LWC component lifecycle: constructor → connectedCallback → render → renderedCallback → [updates] → render → renderedCallback → disconnectedCallback. Arrows show the sequence with labels for when each hook fires.
**Content:**
- `constructor()` — first to run; call `super()` first; do NOT access template or child components yet
- `connectedCallback()` — fires when component is **inserted into the DOM**; safe to access `this.template`; good place for: data fetching, subscribing to events, setting up timers
- `disconnectedCallback()` — fires when component is **removed from the DOM**; clean up: remove event listeners, clear timers, unsubscribe from message channels
- `renderedCallback()` — fires after **every render**; use a flag to run code only on first render; do NOT cause state changes that trigger re-renders (infinite loop risk)
- `errorCallback(error, stack)` — catches errors from child components; implement for graceful error UI
```js
connectedCallback() {
    this.loadData();
    this._handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this._handleResize);
}
disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize);
}
```
**Speaker Notes:** The lifecycle hooks map directly to the standard web component lifecycle callbacks. `connectedCallback` is your `componentDidMount` from React, and `disconnectedCallback` is your cleanup. The most common bug I see is adding event listeners in `connectedCallback` and forgetting to remove them in `disconnectedCallback` — this causes memory leaks when the component is removed and re-added. Always mirror your setup and teardown. And never trigger re-renders from `renderedCallback` — use a `_rendered` boolean flag if you need first-render-only logic.

### Slide 4: Custom Events — Communicating Up
**Visual:** Parent-to-child communication shown with @api (arrow pointing down), child-to-parent with CustomEvent/addEventListener (arrow pointing up), sibling-to-sibling via Lightning Message Service (arrows crossing through a message channel in the middle).
**Content:**
- LWC uses a **unidirectional data flow**: data flows down via @api, events bubble up
- Create and dispatch custom events:
```js
// Child: dispatch event
const evt = new CustomEvent('statuschange', {
    detail: { status: 'active' },
    bubbles: true,    // event crosses shadow boundary up to parent
    composed: false   // does NOT cross shadow DOM boundary (preferred for inter-component)
});
this.dispatchEvent(evt);
```
- Parent: listen with event handler in template
```html
<c-child onstatuschange={handleStatusChange}></c-child>
```
```js
handleStatusChange(event) {
    console.log(event.detail.status); // 'active'
}
```
- **Event naming convention**: lowercase, no hyphens (use camelCase in detail but lowercase for event name)
- `bubbles: true, composed: true` — crosses shadow DOM and DOM tree upward
**Speaker Notes:** The CustomEvent API is standard browser JavaScript — nothing LWC-specific except the shadow DOM visibility rules around `bubbles` and `composed`. For parent-child events within the same component hierarchy, `bubbles: false` and `composed: false` are safest — the parent explicitly listens on the child element. Use `bubbles: true, composed: true` when you need an event to propagate up through multiple shadow boundaries. The `detail` property is the payload — put any data you want to pass in there as an object.

### Slide 5: @wire — Reactive Data from Apex and LDS
**Visual:** Two code panels side by side — left shows @wire with an Apex method (cacheable=true), right shows @wire with a Lightning Data Service function (getRecord from lightning/uiRecordApi). Below, a third panel shows the wired data structure: `{ data: [...], error: undefined }`.
**Content:**
- @wire connects to either **Lightning Data Service (LDS)** or **Apex methods** (must be `cacheable=true`)
- Wire result structure: `{ data, error }` — always check both
```js
import { wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';

@wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD] })
wiredAccount({ data, error }) {
    if (data) this.accountName = getFieldValue(data, NAME_FIELD);
    if (error) console.error(error);
}
```
- **Wire functions** (LDS): `getRecord`, `getRelatedListRecords`, `getObjectInfo` — cached, auto-refresh
- **Wire Apex**: method must have `@AuraEnabled(cacheable=true)` — read-only operations only
- For DML operations (create/update/delete): use **imperative Apex** (regular function call in async method)
**Speaker Notes:** The distinction between @wire and imperative Apex is a common exam question. Wire is for reactive data fetching — when the recordId changes, the wire automatically re-fetches. Imperative is for mutations and any situations where you need to control exactly when the call fires, like in a button handler. If you use @wire for an Apex method that does DML, you'll get a runtime error because cacheable methods cannot perform data modification.

### Slide 6: Imperative Apex and Error Handling
**Visual:** Code snippet showing a save button handler using async/await to call an Apex method imperatively, with try/catch and an LWC toast notification on success or error.
**Content:**
- Import Apex method same way as for @wire:
```js
import saveAccount from '@salesforce/apex/AccountController.saveAccount';
```
- Call imperatively in an async event handler:
```js
async handleSave() {
    try {
        await saveAccount({ accountData: this.accountRecord });
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success', message: 'Account saved', variant: 'success'
        }));
    } catch (error) {
        const msg = error.body?.message ?? error.message ?? 'Unknown error';
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error', message: msg, variant: 'error'
        }));
    }
}
```
- `error.body.message` — Apex exceptions surface here in LWC
- `ShowToastEvent` imported from `lightning/platformShowToastEvent`
- Always handle both success and error paths for user feedback
**Speaker Notes:** The `error.body.message` pattern is specific to LWC — when Apex throws an exception, the error object in the catch block has a `body` property with the exception details. Standard JavaScript errors use `error.message` directly. The optional chaining `error.body?.message` handles cases where body might be undefined — a mix of LWC-specific and standard JS error handling. This is exactly the kind of Salesforce-in-JavaScript context the JSI exam tests.

### Slide 7: LWC-Specific Restrictions
**Visual:** Two-column table: "Allowed in LWC" vs "Not Allowed / Restricted". Allowed: ES modules, ES6+ features, fetch API (with CSP), async/await, third-party static resources. Not Allowed: document.querySelector, jQuery, inline scripts in HTML template, eval(), direct DOM manipulation outside shadow root.
**Content:**
- **No `document.querySelector`** — use `this.template.querySelector()` or `this.refs.refName` (new)
- **No inline event handlers** in HTML — use `onclick={handlerName}` (no `onclick="..."`)
- **No eval()** — strict mode + CSP violation
- **No `<script>` tags** in the .html template — logic goes in .js file
- CSP restricts external scripts — use Static Resources for third-party libraries
- **Locker Service** (legacy) and **Lightning Web Security** (current): sandbox the component's JS context
- Template directives: `lwc:if`, `for:each`, `iterator:it` — not standard HTML
- `@salesforce/*` imports: schema, labels, user info, permissions — compile-time resolved
**Speaker Notes:** These restrictions exist because LWC components run inside Salesforce's security model. Lightning Web Security replaced Locker Service and provides a more modern approach to component sandboxing. The practical impact: you can't reach into another component's DOM, you can't call browser APIs that would allow cross-component data leakage, and all external scripts must go through the static resource mechanism. These are all security-motivated restrictions, not arbitrary limitations.

### Slide 8: JSI Exam — LWC JavaScript Questions
**Visual:** Sample JSI exam question cards (3 cards) covering: (1) which decorator makes a property accessible from a parent component, (2) which lifecycle hook is best for fetching data when the component loads, (3) which options on CustomEvent allow an event to cross shadow DOM boundaries.
**Content:**
- **@api vs @wire**: @api = public property set by parent; @wire = reactive Salesforce data binding
- **Lifecycle hook choice**: `connectedCallback` for data loading, setup; `renderedCallback` for post-render DOM work (with flag); `disconnectedCallback` for cleanup
- **CustomEvent bubbles/composed**: `bubbles: true` propagates up the DOM tree; `composed: true` crosses shadow DOM; both needed to reach a distant ancestor
- **Wire vs imperative**: wire for cacheable reads (reactive), imperative for DML and triggered fetches
- **this.template.querySelector** vs `document.querySelector`: always use template-scoped query in LWC
- Exam weight: LWC JavaScript topics appear throughout the JSI exam implicitly in all sections

## Recording Script
Welcome to Lecture 19 — LWC JavaScript. This lecture is where everything in this course comes together with Salesforce's Lightning Web Components framework.

LWC is built on modern JavaScript standards. Every component is an ES module, every class uses the ES6 class syntax, and async/await, arrow functions, destructuring — all of it is first-class. The difference is that LWC adds a layer of Salesforce-specific decorators and a shadow DOM model on top of standard JavaScript.

Let's start with the three decorators. @api makes a property public — the parent component can read it and set it, and the template re-renders when it changes. @wire connects a property to a reactive data source — either a Lightning Data Service function like getRecord, or an Apex method marked cacheable=true. When the reactive parameters change, the wire automatically re-fetches. @track is largely historical — since Spring '20, all properties trigger re-renders when changed; you don't need @track anymore except to mark old code as intentionally reactive.

Lifecycle hooks are called in a predictable sequence: constructor, connectedCallback, render, renderedCallback, and disconnectedCallback when the component leaves the DOM. Rule of thumb: do your data loading in connectedCallback. Clean up event listeners and subscriptions in disconnectedCallback. Use renderedCallback sparingly and always with a first-render flag to avoid infinite loops.

For events, LWC uses a unidirectional data flow: data flows down via @api, events bubble up via CustomEvent. The `bubbles` and `composed` options control how far an event travels through the shadow DOM hierarchy. For most parent-child communication, you don't need either option — just dispatch and let the parent listen on the child element.

The wire versus imperative distinction is a common exam topic. Wire is for reactive reads — use it when you want data to automatically refresh. Imperative is for mutations — button handlers, form submissions, anything where you control when the call fires. Wire methods must have @AuraEnabled(cacheable=true) in Apex; imperative methods do not need cacheable.

And finally: LWC runs inside Salesforce's security sandbox. No document.querySelector, no eval, no inline scripts. Use this.template.querySelector for your own shadow tree. This keeps components isolated and secure — which is the right model for a platform that runs thousands of organizations' code side by side.

## Exam Tips
- `@api` = public (parent sets it); `@wire` = reactive Salesforce data; `@track` = legacy reactive deep-watch (rarely needed today)
- `connectedCallback` fires when the component is **inserted into the DOM** — the right place for data loading; `renderedCallback` fires after **every render** — use a `_rendered` flag for first-render-only logic
- `CustomEvent` with `bubbles: true, composed: true` is required for events to cross shadow DOM boundaries up through multiple component levels
- `this.template.querySelector()` is the correct DOM query in LWC; `document.querySelector()` cannot see inside a shadow root
- Wire Apex requires `@AuraEnabled(cacheable=true)` — if the method does DML, use imperative call in a try/catch async handler instead

## Lecture Summary
LWC is built on ES modules and ES6+ JavaScript with three LWC-specific decorators: @api for public reactive properties, @wire for reactive Salesforce data binding, and @track (largely superseded) for deep-watching. Lifecycle hooks — connectedCallback for setup, renderedCallback for post-render work, disconnectedCallback for cleanup — map directly to the web component standard. Custom events follow the browser's CustomEvent API with `bubbles` and `composed` controlling shadow DOM traversal. The wire-vs-imperative distinction (cacheable reads vs mutations) and the shadow DOM scoping of `this.template.querySelector` are the most exam-relevant LWC JavaScript concepts.

## Mini Quiz

**Q1:** A developer has a parent component that needs to pass a `recordId` down to a child component. Which decorator should the child use to receive this value?
A) `@wire`
B) `@track`
C) `@api`
D) `@bound`
**Answer:** C — `@api` makes a property public so that a parent component can set it via the component's HTML attribute. `@wire` is for reactive Salesforce data bindings, not parent-to-child property passing. `@track` was for deep-watching internal properties. `@bound` does not exist in LWC.

**Q2:** A developer needs to fetch data when a component first loads and clean up a message service subscription when the component is removed. Which lifecycle hooks should be used?
A) `constructor` for data fetch; `renderedCallback` for cleanup
B) `connectedCallback` for data fetch; `disconnectedCallback` for cleanup
C) `renderedCallback` for data fetch; `connectedCallback` for cleanup
D) `constructor` for both — it runs first and can set up and clean up
**Answer:** B — `connectedCallback` fires when the component is inserted into the DOM and is the correct place for data loading and subscriptions. `disconnectedCallback` fires when the component is removed and is the correct place for cleanup. `constructor` runs before the component is in the DOM and cannot access the template. Using `renderedCallback` for data fetch risks an infinite render loop.

**Q3:** A developer dispatches a `CustomEvent` from a deeply nested child component and needs the event to be handled by a grandparent component that is outside the child's shadow DOM. Which CustomEvent options are needed?
A) `{ bubbles: true }`
B) `{ composed: true }`
C) `{ bubbles: true, composed: true }`
D) No special options — events always propagate through all shadow boundaries
**Answer:** C — Both options are required. `bubbles: true` allows the event to propagate up the DOM tree (otherwise it stays at the dispatch target). `composed: true` allows the event to cross shadow DOM boundaries. Without both, the event stops at the shadow root and the grandparent never sees it. Events do NOT automatically cross shadow boundaries — that is a deliberate isolation feature of the shadow DOM.
