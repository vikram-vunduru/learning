# LWC Data Binding and Events

## Learning Objectives
- Distinguish one-way and two-way data binding patterns in LWC and implement each correctly
- Pass data from parent to child using @api properties and @api methods
- Dispatch custom events from child to parent using CustomEvent and dispatchEvent()
- Implement sibling component communication using the Lightning Message Service

## Slides

### Slide 1: Data Binding in LWC
**Visual:** Diagram showing a component class property on the left connected to a template expression {property} on the right with a one-directional arrow labeled "one-way binding"
**Content:**
- LWC uses **one-way data binding** by default — data flows from JS property to template
- Template syntax: `{propertyName}` renders the current value of a JS class property
- When the property changes in JS, the template re-renders automatically (reactivity)
- There is no two-way binding like ngModel in Angular — LWC requires explicit event handlers for input changes
- HTML attribute binding uses `{property}` notation inside attribute values
**Speaker Notes:** One-way binding means the template reflects the JavaScript property value, but user input in the template does not automatically update the property. To handle user input, you must wire up an event handler that reads the event value and explicitly sets the property. This intentional design makes data flow predictable and traceable — you always know that a property was changed by explicit code, not by framework magic.

### Slide 2: Handling User Input — Two-Way Pattern
**Visual:** Code showing an input element with value={searchTerm} and onchange={handleSearchChange}, with the handleSearchChange method setting this.searchTerm = event.target.value
**Content:**
- HTML inputs: bind display with `value={property}`, handle changes with `onchange={handler}`
- In the event handler: `this.property = event.target.value` updates the property
- This creates an effective two-way pattern: display reflects property; input updates property
- For checkboxes: use `checked={boolProp}` and `event.target.checked` in handler
- Lightning base components like `lightning-input` fire change events similarly
**Speaker Notes:** The two-way pattern in LWC is verbose by design — you explicitly handle the change event and update the property. This makes debugging easy: put a console.log in the handler and you can trace every data change. When working with Lightning base components (lightning-input, lightning-combobox, etc.), the event is still an onchange event, and you still read event.target.value or event.detail.value depending on the component.

### Slide 3: Parent-to-Child Communication — @api
**Visual:** Two code panels: parent template passing data as HTML attribute `<c-child record-id={selectedId}>`, and child component class with `@api recordId` property
**Content:**
- Parent passes data to child via HTML attribute in parent's template
- Child must declare the property with `@api` to receive it
- Attribute naming: HTML uses kebab-case (`record-id`), JS uses camelCase (`recordId`) — automatically converted
- `@api` properties must not begin with `on` and cannot be `class` or `slot`
- When the parent's bound value changes, the child's @api property updates automatically
**Speaker Notes:** The kebab-case to camelCase conversion is important and often tested. In the parent's template, you write record-id={someValue}. In the child's JS, you declare @api recordId. Salesforce handles the conversion automatically. Any attribute name with uppercase letters must be written in the template as hyphenated lowercase. Forgetting this convention is a common source of bugs — the @api property receives undefined because the template attribute name doesn't match.

### Slide 4: Parent-to-Child Communication — @api Methods
**Visual:** Parent component template with a button calling handleReset, parent JS calling this.template.querySelector('c-child').reset(), and child class with @api reset() { ... } method
**Content:**
- A child can expose public methods with `@api` to allow parents to call them
- Parent gets a reference to the child: `this.template.querySelector('c-child')`
- Parent calls the method directly: `childRef.methodName(args)`
- @api methods are useful for imperative actions: reset form, focus an input, trigger animation
- Use sparingly — prefer property changes and reactive rendering over imperative method calls
**Speaker Notes:** Exposing methods via @api is less common than using @api properties, but it's the right pattern for imperative actions that don't fit a reactive data model. A parent might call child.reset() after a successful save to clear the child form. Getting the child reference with querySelector uses the component's HTML tag name (c-child for a component named child in the c namespace). The parent can also use querySelectorAll() to get all instances of a component type.

### Slide 5: Child-to-Parent Communication — Custom Events
**Visual:** Child component code showing new CustomEvent('myevent', { detail: { value: this.inputValue }, bubbles: false }), dispatchEvent call, and parent template showing onmyevent={handleMyEvent}
**Content:**
- Child dispatches events with `this.dispatchEvent(new CustomEvent('eventname', options))`
- Event name convention: lowercase, no spaces, no on- prefix (e.g., 'valuechange', 'save')
- `detail` property carries the event payload: `{ detail: { value: someData } }`
- Parent listens with `on` prefix on the child tag: `<c-child oneventname={handler}>`
- In the parent handler: `event.detail.value` accesses the payload
**Speaker Notes:** The event name convention is important for correctness and for the exam. Use all lowercase, no spaces, and no on- prefix in the event name. When the parent listens, it always adds on- to the front: if you dispatched 'valuechange', the parent listens with onvaluechange. The detail property can carry any value — a primitive, an object, an array. Avoid passing complex object references in detail — instead pass a copy of the data to prevent parent from accidentally mutating child state.

### Slide 6: Event Propagation — bubbles and composed
**Visual:** DOM tree diagram showing a custom event with bubbles:true rising from a child through a parent, and a second event with composed:true crossing the shadow DOM boundary
**Content:**
- `bubbles: true` — event bubbles up through the DOM tree; ancestors can listen
- `bubbles: false` (default) — event only fires on the dispatching element; parent must listen directly on child tag
- `composed: true` — event crosses the Shadow DOM boundary (propagates out of the component's shadow root)
- `composed: false` (default) — event stops at the shadow root boundary
- Most component communication uses `bubbles: false` — explicit parent-to-child tag binding
**Speaker Notes:** The bubbles and composed options affect where an event can be heard. By default, a custom event stays within the shadow DOM and does not bubble — only a direct parent listening on the child tag with the on-event-name attribute can catch it. If you need the event to cross shadow boundaries or be caught by a grandparent, you add bubbles: true and/or composed: true. However, bubbling events are harder to reason about — prefer explicit direct communication where possible.

### Slide 7: Sibling Communication — Lightning Message Service
**Visual:** Architecture diagram showing two sibling LWC components both connected to a message channel in the center, with publish arrow from one and subscribe arrow from the other
**Content:**
- Siblings cannot communicate directly — no shared parent to mediate
- **Lightning Message Service (LMS)**: a pub-sub bus for components that aren't in a parent-child relationship
- Steps: create a `LightningMessageChannel` metadata file, import in publisher and subscriber components
- Publish: `publish(messageContext, MESSAGE_CHANNEL, payload)`
- Subscribe: `subscribe(messageContext, MESSAGE_CHANNEL, handler)` in `connectedCallback`; unsubscribe in `disconnectedCallback`
**Speaker Notes:** Lightning Message Service is the sanctioned Salesforce mechanism for cross-component communication that doesn't fit the parent-child model. The message channel is a metadata type (LightningMessageChannel__c suffix) deployed like other metadata. Both the publisher and subscriber import the same channel. The @wire(MessageContext) decorator provides the messageContext needed for publish and subscribe calls. Always unsubscribe in disconnectedCallback to prevent memory leaks from stale subscriptions.

### Slide 8: Event Handling Best Practices
**Visual:** Checklist with green checks next to best practices and red marks next to anti-patterns, including specific naming and architecture examples
**Content:**
- Use descriptive event names: 'accountselected', 'formsubmitted' — not 'click', 'change'
- Pass data copies in detail — avoid passing mutable references
- Prefer `@api` properties over method calls for reactive data updates
- For grandparent or cross-tree communication: use LMS, not deep bubbling events
- Unsubscribe LMS subscriptions in `disconnectedCallback` to avoid memory leaks
- Do not access DOM elements in constructor — use connectedCallback or renderedCallback
**Speaker Notes:** Well-designed event architecture follows the single responsibility principle: each component publishes what happened (e.g., 'accountselected') without dictating what should happen in response. The listener decides how to respond. This makes components reusable — the same child component can be used in different parent contexts that respond to the same event differently. Keep event payloads minimal and use primitive values when possible.

## Recording Script

Welcome to Lecture 18 on LWC Data Binding and Events. This lecture covers how data moves between a component and its template, and how components communicate with each other. These patterns are tested on the PDI exam and are the foundation of every real LWC application.

LWC uses one-way binding. The syntax {propertyName} in the template renders the current value of that JavaScript property. When the property changes, the template re-renders. But the reverse doesn't happen automatically — user input doesn't update the property by itself. To handle input, you bind an event handler: value={searchTerm} for display, onchange={handleChange} for updates, and inside handleChange you write this.searchTerm = event.target.value. That's the LWC two-way pattern — explicit but predictable.

For parent-to-child communication, the parent passes data as an HTML attribute on the child's tag, and the child declares the receiving property with @api. The naming rule: HTML attributes are kebab-case, JavaScript properties are camelCase. So record-id in the template becomes @api recordId in JS. Salesforce converts automatically, but you must use the right naming convention in each location.

Parents can also call methods on children. The child declares @api methodName() { }. The parent gets a reference with this.template.querySelector('c-child') and calls childRef.methodName(). Use this for imperative actions like resetting a form.

Child-to-parent communication goes the other way: the child dispatches a CustomEvent, the parent listens. The child calls this.dispatchEvent(new CustomEvent('valueupdated', { detail: { value: this.data } })). The parent listens with onvalueupdated={handleValueUpdated} on the child's tag. In the handler, event.detail.value accesses the payload.

Custom event options: bubbles and composed. By default both are false — the event only fires for a direct listener on the child tag. Set bubbles: true to let the event propagate up the DOM tree. Set composed: true to let it cross shadow DOM boundaries.

For siblings: use Lightning Message Service. Create a LightningMessageChannel metadata file. The publisher calls publish(). The subscriber calls subscribe() in connectedCallback and unsubscribe() in disconnectedCallback.

## Exam Tips
- HTML attribute names use kebab-case (`record-id`), while the corresponding `@api` property in JavaScript uses camelCase (`recordId`) — Salesforce converts automatically but you must use both correctly in their respective files
- Custom event names must be all lowercase with no spaces; the parent listens with the `on` prefix added — if you dispatch `'valuechange'`, the parent listens with `onvaluechange`
- LMS (Lightning Message Service) is the correct approach for sibling component communication — do not use bubbling events to communicate across unrelated components
- The `detail` property in a CustomEvent carries the event payload; access it in the parent handler with `event.detail.propertyName`
- Always unsubscribe from LMS message channels in `disconnectedCallback` to prevent memory leaks

## Lecture Summary
LWC data binding is one-way by default: template expressions {property} render JS property values, and input events must be explicitly handled to update properties. Parent-to-child communication uses @api properties (passed as HTML attributes with kebab-to-camelCase conversion) and @api methods (called via querySelector). Child-to-parent communication uses CustomEvent dispatched from the child and listened to on the parent's template with an on-prefixed event name. Sibling communication that bypasses the parent-child hierarchy uses Lightning Message Service with a shared LightningMessageChannel metadata record, requiring subscribe/unsubscribe lifecycle management.

## Mini Quiz

**Q1:** A parent LWC template passes a value to a child component using `<c-my-child account-id={selectedAccountId}>`. How must the child component declare this property to receive it?
A) `accountId = '';`
B) `@track accountId;`
C) `@api accountId;`
D) `@api account-id;`

**Answer:** C — The child must declare `@api accountId` using camelCase. The HTML attribute `account-id` is automatically converted to camelCase `accountId` by the LWC framework. Option D is incorrect because JavaScript property names cannot contain hyphens. Option A (no decorator) is a private property that cannot be set by a parent. Option B uses @track, which is not for public interface properties.

**Q2:** A child component dispatches `new CustomEvent('recordsaved', { detail: { id: this.savedId } })`. How does the parent component listen for this event and access the payload?
A) Add `onrecordsaved={handleSave}` to the child's tag; access `event.detail.id` in handleSave
B) Add `recordsaved={handleSave}` to the child's tag; access `event.target.id`
C) Add `on:recordsaved={handleSave}` to the child's tag; access `event.id`
D) Register `addEventListener('recordsaved', handler)` in parent's connectedCallback

**Answer:** A — The parent adds `onrecordsaved={handleSave}` to the child component tag (on + event name). The payload is accessed via `event.detail.id` in the handler. Option B is missing the `on` prefix. Option C uses an invalid `on:` syntax. Option D using addEventListener is valid JavaScript but not the LWC declarative pattern expected on the exam.

**Q3:** Two LWC components are siblings — both are on the same record page but neither is a parent of the other. A user action in Component A should trigger a data refresh in Component B. Which approach is correct?
A) Component A dispatches a bubbling custom event; Component B listens on its own template
B) Component A calls a method on Component B using querySelector from the page layout
C) Use Lightning Message Service with a shared LightningMessageChannel
D) Use @api properties — both components can share the same @api property

**Answer:** C — Lightning Message Service (LMS) is the correct Salesforce-sanctioned approach for communication between components that are not in a parent-child relationship. Components on the same page can publish and subscribe to the same message channel regardless of their DOM hierarchy. Option A doesn't work because sibling components don't share a parent component that could catch the bubbling event. Options B and D are not valid for sibling communication.
