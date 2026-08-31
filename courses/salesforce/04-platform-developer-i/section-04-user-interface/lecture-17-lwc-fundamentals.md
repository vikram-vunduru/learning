# LWC Fundamentals

## Learning Objectives
- Identify the required and optional files in an LWC component bundle and explain each file's role
- Use the @api, @track, and @wire decorators correctly in a component's JavaScript class
- Apply template directives including lwc:if/elseif/else and for:each for conditional rendering and list iteration
- Configure a component's deployment targets and visibility using the .js-meta.xml file

## Slides

### Slide 1: What Is Lightning Web Components?
**Visual:** LWC component file bundle icon showing the five files side by side: .html, .js, .css, .js-meta.xml, and an optional .svg file
**Content:**
- LWC is Salesforce's modern UI framework, based on Web Components standards
- Runs client-side in the browser — more performant than server-rendered Visualforce
- Each component is a bundle of files in a folder with the same name as the component
- Built on open web standards: Custom Elements, Shadow DOM, ES6+ JavaScript
- Introduced in Spring '19; now the preferred framework for new Salesforce UI development
**Speaker Notes:** Lightning Web Components represents Salesforce's shift from proprietary frameworks to open web standards. Unlike Visualforce (server-rendered) and Aura (custom framework), LWC uses technologies that are becoming native to browsers. This means LWC code is more aligned with what JavaScript developers already know, and it performs better because rendering happens in the browser rather than requiring a server round-trip for every interaction.

### Slide 2: Component Bundle Files
**Visual:** Folder structure showing myComponent/ containing myComponent.html, myComponent.js, myComponent.css, and myComponent.js-meta.xml with role labels for each
**Content:**
- **myComponent.html** — the component template; must have a single `<template>` root element
- **myComponent.js** — the JavaScript controller class; imports decorators and exports the component class
- **myComponent.css** — component-scoped styles (optional); automatically applied only to this component
- **myComponent.js-meta.xml** — deployment configuration; controls where the component can be placed
- **myComponent.svg** — custom icon for App Builder (optional)
**Speaker Notes:** The file names must match the folder name exactly — this is enforced by Salesforce. The .html file must use a `<template>` root tag, not `<html>` or `<div>`. The .js file exports a class that extends LightningElement. The js-meta.xml file is required — without it, the component cannot be deployed or placed in pages. The CSS file uses Shadow DOM scoping, meaning styles defined here cannot bleed out to other components.

### Slide 3: The JavaScript Class — Decorators
**Visual:** JS class code showing three decorated properties: @api publicProp, @track reactivePrivate (crossed out with note about Spring '20), and @wire(getRecord) wiredData
**Content:**
- `@api` — marks a property or method as publicly accessible from parent components
- `@track` — was required for deep reactivity before Spring '20; now largely unnecessary (all properties are reactive by default)
- `@wire` — declaratively connects a property to a wire adapter (Salesforce data or Apex method)
- Properties without a decorator are private and reactive (re-renders on change) by default
- `@api` properties define the component's public interface — they can be set by a parent
**Speaker Notes:** The most important distinction for the exam is @api vs. private properties. @api makes a property part of the component's public interface — a parent can pass data into it. Private properties (no decorator) are reactive by default in all recent API versions, meaning changes trigger re-renders. @track is still valid but is now only needed for deep object/array mutation reactivity in specific edge cases. @wire is covered in detail in Lecture 19.

### Slide 4: Template Directives — Conditional Rendering
**Visual:** Two code panels: left shows the old `if:true={property}` syntax with a deprecation note; right shows the modern `lwc:if`, `lwc:elseif`, and `lwc:else` directives
**Content:**
- **Old syntax** (deprecated but may appear on exams): `<template if:true={isVisible}>` / `<template if:false={isVisible}>`
- **New syntax** (Spring '23+): `lwc:if={condition}`, `lwc:elseif={otherCondition}`, `lwc:else`
- `lwc:if` replaces both `if:true` and `if:false` — use a negated expression for false conditions
- Elements with lwc:if/lwc:else must be siblings at the same level in the DOM
- The `<template>` tag with a directive renders no DOM element itself — just its children
**Speaker Notes:** The exam may still reference the older if:true/if:false syntax since it has been available for longer. Know both. The new lwc:if/lwc:elseif/lwc:else syntax is the recommended approach going forward and allows true if/else-if/else chains without nesting. Negation for the equivalent of if:false is done with a getter in JavaScript that returns !this.originalProperty.

### Slide 5: Template Directives — List Rendering
**Visual:** Code showing for:each={contacts} and iterator:contacts={contacts} template directives, with the key={contact.Id} attribute requirement highlighted
**Content:**
- `for:each={array}` — iterates over an array; current item available as `for:item="item"`, index as `for:index="i"`
- `key={uniqueValue}` — required on the first child element inside for:each; must be a unique string/ID
- `iterator:varName={array}` — advanced iteration; item has `.value`, `.first`, `.last` properties for conditional styling
- The `<template>` wrapper with for:each renders no DOM element of its own
- Both require the `key` attribute — omitting it causes a runtime warning
**Speaker Notes:** The key attribute on for:each is critical for LWC's virtual DOM diffing algorithm — it uses the key to identify which items in the list changed, were added, or were removed. Without a unique key, LWC cannot efficiently update the DOM and may produce incorrect rendering. Best practice is to use a unique ID field (like the Salesforce record Id) as the key. Using the array index as a key is allowed but not recommended because it breaks diffing when items are reordered.

### Slide 6: Shadow DOM and CSS Scoping
**Visual:** Diagram showing the Shadow DOM boundary around a component, with styles from the parent component unable to penetrate the boundary and affect child component elements
**Content:**
- LWC uses Shadow DOM to encapsulate component internals
- CSS styles in a component's .css file apply only to elements in that component's template
- Styles from parent components cannot reach inside a child component's shadow root
- `:host` selector styles the component's root element from inside the component
- Global styles in `staticresources` can be injected but should be used sparingly
**Speaker Notes:** Shadow DOM encapsulation is one of the biggest behavioral differences between LWC and Visualforce. In VF, a CSS class defined on a parent page could style a child component. In LWC, the shadow boundary prevents this — each component manages its own styles. This is good for component isolation and reusability. When you need shared styling, use Lightning Design System (SLDS) utility classes which are available inside all shadow roots, or define styles in a shared CSS resource.

### Slide 7: The js-meta.xml Configuration File
**Visual:** XML file content showing apiVersion, isExposed, and targets tags with lightning__RecordPage, lightning__AppPage, and lightning__HomePage listed
**Content:**
- `<apiVersion>` — the Salesforce API version the component targets
- `<isExposed>true</isExposed>` — makes the component available in Experience Builder and App Builder
- `<targets>` — specifies where the component can be dragged in App Builder:
  - `lightning__RecordPage` — record pages
  - `lightning__AppPage` — app pages
  - `lightning__HomePage` — home pages
  - `lightning__FlowScreen` — Flow screens
- `<targetConfigs>` — define editable properties in App Builder property panel
**Speaker Notes:** The js-meta.xml file is the deployment manifest for an LWC component. If isExposed is false or missing, the component can still be used programmatically by other components but won't appear in App Builder or Experience Builder drag-and-drop interfaces. The targets list controls which types of pages the component can be added to. Adding targetConfigs with property elements allows admins to configure the component's @api properties through the App Builder UI without writing code.

### Slide 8: Lifecycle Hooks
**Visual:** Lifecycle flowchart showing constructor → connectedCallback → renderedCallback → disconnectedCallback, with notes on what to do in each
**Content:**
- `constructor()` — called when component instance is created; call super() first; cannot access DOM
- `connectedCallback()` — called when component is inserted into the DOM; safe for initialization, event listeners
- `renderedCallback()` — called after every render; use carefully to avoid infinite loops
- `disconnectedCallback()` — called when component is removed from DOM; clean up event listeners
- `errorCallback(error, stack)` — catches errors from child components
**Speaker Notes:** Lifecycle hooks allow you to run code at specific points in a component's life. The most common is connectedCallback, used for initialization logic like loading data or registering event listeners. Avoid heavy logic in renderedCallback because it runs after every render — any state change inside it that triggers another render creates an infinite loop. The constructor cannot access the DOM or child components because they don't exist yet at construction time.

## Recording Script

Welcome to Lecture 17 on LWC Fundamentals. Lightning Web Components is the current Salesforce UI framework and a growing presence on the PDI exam. Let's build your foundation.

An LWC component is a folder containing files that all share the same name as the folder. The four files you'll always have are: the HTML template file with a .html extension, the JavaScript class file with .js, the optional CSS stylesheet with .css, and the deployment configuration with .js-meta.xml. The HTML template must have a single root `<template>` tag. The JS file exports a class that extends LightningElement. The CSS file is automatically scoped to the component — styles here don't leak out to other components. The js-meta.xml file controls where the component can be placed.

In the JavaScript class, you use decorators to annotate properties. @api makes a property public — parents can set it. Private properties with no decorator are reactive by default, meaning changing them triggers a re-render. @track is still valid but rarely needed now that all properties are reactive by default. @wire connects a property to a Salesforce data source — we cover that in detail in Lecture 19.

For conditional rendering in the template, know both syntaxes. The older if:true={prop} and if:false={prop} may appear on the exam. The modern syntax is lwc:if={condition}, lwc:elseif={otherCondition}, and lwc:else. Use the modern syntax for new development.

For list rendering, for:each={array} iterates over an array. You must provide a key attribute on the first element inside the loop — use a unique ID. The iterator directive gives you access to first and last flags for conditional styling of the first and last items in a list.

Shadow DOM means each component's CSS is encapsulated — styles from outside cannot penetrate the shadow boundary. Use Lightning Design System (SLDS) utility classes for consistent styling that works inside shadow roots.

The js-meta.xml file must set isExposed to true and list the appropriate targets for the component to appear in App Builder. Targets include lightning__RecordPage, lightning__AppPage, lightning__HomePage, and lightning__FlowScreen.

Lifecycle hooks — constructor, connectedCallback, renderedCallback, disconnectedCallback — let you run code at specific points in the component's life. Use connectedCallback for initialization. Be careful in renderedCallback to avoid infinite render loops.

## Exam Tips
- All four files must have the same name as their containing folder — the component name determines all file names
- `@api` properties must not start with `on` (reserved for event handlers) and must not be `class` or `slot` (reserved words)
- The `key` attribute is **required** on the first child element inside a `for:each` directive — omitting it produces a runtime error/warning
- `isExposed: true` in js-meta.xml is required for a component to appear in App Builder; without it, the component can only be used programmatically by other components
- Know both the old `if:true`/`if:false` and new `lwc:if`/`lwc:elseif`/`lwc:else` conditional directive syntaxes — the exam may reference either

## Lecture Summary
An LWC component is a folder bundle containing a template (.html), JavaScript class (.js), optional stylesheet (.css), and deployment configuration (.js-meta.xml), all sharing the same name. JavaScript decorators control property access: @api for public interface, private reactive properties for internal state, and @wire for declarative data binding. Template directives provide conditional rendering with lwc:if/lwc:elseif/lwc:else and list iteration with for:each (requiring a unique key attribute). Shadow DOM encapsulates component styles, preventing style bleed between components, and the js-meta.xml targets configuration determines where the component can be placed in App Builder.

## Mini Quiz

**Q1:** A developer needs a property in an LWC component to be settable by its parent component. Which decorator is required?
A) `@track`
B) `@wire`
C) `@api`
D) No decorator — all properties are accessible from parent by default

**Answer:** C — `@api` marks a property as part of the component's public interface. Only `@api` properties can be set by a parent component. Properties without a decorator are private to the component. `@track` is for enhanced deep reactivity (rarely needed). `@wire` connects to data sources.

**Q2:** Which template directive correctly iterates over a list called `accountList` and requires a unique key on each item?
A) `<template for:each={accountList} for:item="acc" key={acc.Id}>`
B) `<template for:each={accountList} for:item="acc">` with `key={acc.Id}` on the first child element
C) `<template iterator:acc={accountList}>`
D) `<template lwc:for={accountList}>`

**Answer:** B — The `key` attribute in a `for:each` directive goes on the **first child element inside the loop**, not on the `<template>` tag itself. The `for:item` attribute names the loop variable. Option A incorrectly places the key on the template tag. Option C is the iterator directive syntax (also valid but different). Option D is not valid LWC syntax.

**Q3:** A component should appear in the App Builder when editing a Lightning Record Page. Which js-meta.xml configuration is required?
A) `<isExposed>false</isExposed>` with `<targets><target>lightning__RecordPage</target></targets>`
B) `<isExposed>true</isExposed>` with `<targets><target>lightning__RecordPage</target></targets>`
C) `<isExposed>true</isExposed>` with no targets element
D) Only the `<apiVersion>` element is needed — targets are optional

**Answer:** B — Both `isExposed` set to `true` AND `lightning__RecordPage` listed in `<targets>` are required. `isExposed` makes the component visible in App Builder at all; the target specifies which page types it can be added to. `isExposed: true` with no targets means the component is exposed but has nowhere to be placed.
