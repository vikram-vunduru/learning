# Lecture 11: Browser Environment, DOM, and Events

## Learning Objectives
- Identify the key browser global objects: window, document, and navigator
- Traverse and query the DOM using getElementById, querySelector, and querySelectorAll
- Manipulate the DOM by creating elements, appending children, and safely setting content
- Attach and remove event listeners using addEventListener and removeEventListener
- Explain the difference between event bubbling and capturing and use the third argument to addEventListener
- Apply the event delegation pattern to efficiently handle events on dynamic lists
- Distinguish between DOMContentLoaded and load events and choose the right one
- Explain how DOM concepts underpin LWC's component rendering and event system

## Slides

### Slide 1: The Browser Environment — window, document, navigator
**Visual:** Layered diagram showing the global window object at the top, with document, navigator, location, history, and console as child properties. Arrows show that all global variables become properties of window. A side note shows Node.js vs browser globals comparison.
**Content:**
- **window** — the global object in browsers; all global variables are properties of `window`
- `window === globalThis` — `globalThis` is the environment-agnostic way to reference the global object
- **document** — entry point to the DOM (Document Object Model); represents the parsed HTML as a tree of nodes
- **navigator** — info about the browser/platform: `navigator.userAgent`, `navigator.onLine`, `navigator.language`
- **location** — current URL; `location.href`, `location.pathname`, `location.search`
- **history** — browser navigation stack; `history.pushState()` for SPA routing
- **console** — developer tooling API; more than just `console.log` (see Lecture 12)
- In Node.js: no `window`, no `document`; use `globalThis` for cross-environment code
**Speaker Notes:** Understanding that window is the global object explains why you can call `setTimeout()` without a prefix — it is `window.setTimeout()`. The document property of window is the entry point to everything in the DOM. Navigator is useful for feature detection and locale — avoid user-agent sniffing for browser detection, prefer feature detection instead. The globalThis keyword was introduced in ES2020 and is the safe way to reference the global object across browsers, Node.js, and Web Workers.

### Slide 2: DOM Traversal and Querying
**Visual:** An HTML tree diagram (html → head/body → various elements) with arrows showing getElementById targeting a single node, querySelector targeting the first match, and querySelectorAll returning a NodeList of all matches. A callout shows converting NodeList to Array.
**Content:**
- **getElementById(id):** Returns a single element or `null`; fastest for ID lookups
- **querySelector(selector):** Returns the **first** matching element or `null`; accepts any CSS selector
- **querySelectorAll(selector):** Returns a **static NodeList** of all matches; not live
- `querySelectorAll` returns a NodeList — not an Array. Iterate with `forEach` (it has it), or convert: `[...nodeList]` or `Array.from(nodeList)`
- Traversal properties on elements: `.parentElement`, `.children` (HTMLCollection), `.firstElementChild`, `.lastElementChild`, `.nextElementSibling`, `.previousElementSibling`
- `.closest(selector)` — walks up the DOM tree and returns the nearest ancestor matching the selector
  ```js
  const el = document.querySelector('.card');
  const container = el.closest('.container');
  ```
**Speaker Notes:** querySelector and querySelectorAll accept any valid CSS selector, which makes them extremely powerful — you can query by class, attribute, pseudo-class, and complex combinators. The static vs live NodeList distinction matters: a static NodeList (from querySelectorAll) is a snapshot at query time and does not update if the DOM changes. getElementsByClassName and getElementsByTagName return live HTMLCollections that do update, but modern code prefers querySelector/querySelectorAll for their flexibility. The `.closest()` method is very useful in event delegation.

### Slide 3: DOM Manipulation
**Visual:** Code flow diagram showing createElement → setting attributes/properties → appendChild/insertBefore, with a side note showing the innerHTML vs textContent security comparison and a red warning label on innerHTML.
**Content:**
- **createElement(tag):** Creates a new element not yet in the DOM
- **appendChild(child):** Appends a child node to the end; returns the appended node
- **insertBefore(newNode, refNode):** Inserts before a reference child
- **removeChild(child):** Removes a child; `el.remove()` (modern) removes the element itself
- **classList API:** `.add()`, `.remove()`, `.toggle()`, `.contains()`, `.replace()`
- **innerHTML vs textContent:**
  - `innerHTML` sets/gets HTML markup — allows **XSS** if content is user-supplied
  - `textContent` sets/gets plain text — always escapes HTML entities; use for user content
  - `innerText` is similar to textContent but triggers layout and respects CSS visibility
  ```js
  // SAFE
  el.textContent = userInput;
  // DANGEROUS if userInput is not sanitized
  el.innerHTML = userInput; // potential XSS
  ```
**Speaker Notes:** The innerHTML vs textContent security distinction is critical and appears on the exam. Never set innerHTML with user-supplied content unless it has been thoroughly sanitized — a string like `<img src=x onerror="stealCookies()">` will execute JavaScript if inserted as innerHTML. For dynamic list building with structured HTML (where you control the template), innerHTML is fine. For any content that comes from user input or external data, always use textContent. The classList API is preferred over manually manipulating the className string.

### Slide 4: addEventListener and the Event Object
**Visual:** Code example showing addEventListener with the event type, callback, and options object. Below it, a table showing common event properties: type, target, currentTarget, preventDefault(), stopPropagation(), key (for keyboard), clientX/clientY (for mouse), and data (for custom events).
**Content:**
- **addEventListener(type, listener, options)** — attaches an event handler
  ```js
  el.addEventListener('click', handleClick);
  el.removeEventListener('click', handleClick); // must be same reference
  ```
- The event object is passed to the listener automatically:
  - `event.type` — the event name ('click', 'keydown', etc.)
  - `event.target` — the element that originally dispatched the event
  - `event.currentTarget` — the element the listener is attached to
  - `event.preventDefault()` — cancels the browser's default action (e.g., form submission, link navigation)
  - `event.stopPropagation()` — stops the event from bubbling/capturing further
- **removeEventListener** requires the **exact same function reference** — anonymous functions cannot be removed
- Prefer `addEventListener` over `onclick` / `onX` properties — allows multiple listeners on one element
**Speaker Notes:** The target vs currentTarget distinction is very important. During bubbling, target stays fixed as the originating element, but currentTarget changes to whichever element's listener is currently firing. This is the key to understanding event delegation. The removeEventListener gotcha about needing the same function reference means you must store the listener in a variable or use an AbortController to remove anonymous listeners added with an AbortSignal option.

### Slide 5: Event Bubbling and Capturing
**Visual:** DOM tree diagram (document → body → div.container → button) with two animated passes: first a downward blue arrow labeled "capturing phase" from document to button, then an upward red arrow labeled "bubbling phase" from button back to document. The third argument to addEventListener is highlighted.
**Content:**
- Events propagate in three phases: **capturing** (top to bottom), **target** (the element itself), **bubbling** (bottom to top)
- By default, listeners fire in the **bubbling phase**
- Third argument to addEventListener sets the phase:
  ```js
  el.addEventListener('click', fn, true);          // capturing
  el.addEventListener('click', fn, false);         // bubbling (default)
  el.addEventListener('click', fn, { capture: true, once: true, passive: true });
  ```
- `once: true` — listener fires once then is automatically removed
- `passive: true` — signals the listener will never call preventDefault(); allows browser scroll optimizations
- `event.stopPropagation()` — stops propagation in the current direction
- `event.stopImmediatePropagation()` — also prevents other listeners on the same element from firing
- Most events bubble; `focus`, `blur`, `scroll`, `load` do **not** bubble (use `focusin`/`focusout` instead)
**Speaker Notes:** The third argument to addEventListener being a boolean (capture flag) or options object is frequently tested. Most real-world listeners use the default bubbling phase. The important exception is load — it does not bubble, which is why you listen for it directly on window or the specific element, not on a parent. The passive flag is a performance hint that matters a lot for touch scroll events on mobile — if you're adding a touchmove listener and never calling preventDefault(), mark it passive so the browser can scroll without waiting for your JavaScript.

### Slide 6: Event Delegation Pattern
**Visual:** Diagram showing a `<ul>` with 100 `<li>` items. Left side shows 100 individual listeners attached to each `<li>` labeled "costly". Right side shows one listener on the `<ul>` using event.target to identify the clicked `<li>` — labeled "efficient". Code block shows the pattern.
**Content:**
- **Event delegation:** Attach ONE listener to a parent; use `event.target` to identify which child was clicked
- Works because events bubble from the target up through ancestors
  ```js
  document.querySelector('ul').addEventListener('click', (event) => {
    const li = event.target.closest('li');
    if (!li) return; // clicked outside an li
    console.log('Clicked item:', li.dataset.id);
  });
  ```
- Benefits: works for dynamically added elements; lower memory usage; simpler code
- `event.target.closest('li')` is the robust way to handle clicks on child elements inside the `<li>`
- `event.target.matches(selector)` is an alternative for checking the target directly
**Speaker Notes:** Event delegation is a fundamental JavaScript interview and exam topic. The pattern is essential for dynamic lists where items can be added or removed — since the listener is on the parent, it automatically handles new children without re-attaching listeners. The closest() call handles the case where the user clicks on an element inside the li (like an icon or span) — without it, event.target would be the inner element, not the li itself. dataset attributes are the idiomatic way to embed identifiers in HTML for delegation to pick up.

### Slide 7: DOMContentLoaded vs load, and LWC Context
**Visual:** Timeline diagram showing the browser loading sequence: HTML parsing → DOMContentLoaded fires → stylesheets load → images/media load → load fires. Two listener code examples are shown with annotations explaining when each is appropriate.
**Content:**
- **DOMContentLoaded** — fires when the HTML is fully parsed and the DOM tree is built; stylesheets, images, and subframes may not yet be loaded
  ```js
  document.addEventListener('DOMContentLoaded', () => {
    // safe to query DOM elements here
  });
  ```
- **load** — fires on `window` when the page AND all its resources (images, stylesheets, iframes) are fully loaded; fires on individual elements (img, script) when that resource loads
  ```js
  window.addEventListener('load', () => {
    // all resources ready
  });
  ```
- Use DOMContentLoaded for most initialization code — don't wait for images to interact with the DOM
- **Salesforce / LWC context:** LWC has its own component lifecycle (`connectedCallback`, `renderedCallback`) — the DOM API methods above are not typically used directly. However: the exam tests DOM knowledge as a JavaScript foundation; LWC event system (component events, custom events with `new CustomEvent()`) mirrors browser event patterns; `this.template.querySelector()` inside LWC is analogous to `document.querySelector()`
**Speaker Notes:** DOMContentLoaded is the event you want for almost all initialization work — by the time it fires, you can safely query and manipulate the DOM. Waiting for load means waiting for all images and external resources, which can be seconds longer on slow connections. In an LWC context, you won't use document directly in components — that would break LWC's shadow DOM encapsulation. Instead, use `this.template.querySelector()` within the component. But the underlying concepts — traversal, events, delegation — all apply, just scoped to the component's template.

### Slide 8: Exam Summary — DOM and Events
**Visual:** Quick-reference grid with four sections: Query Methods (getElementById/querySelector/querySelectorAll with return types), Manipulation (createElement/appendChild/textContent vs innerHTML), Event Propagation (capture/bubble phase toggle), and Common Pitfalls (live vs static NodeList, removeEventListener reference, focus doesn't bubble).
**Content:**
- `getElementById` → single element; `querySelector` → first match; `querySelectorAll` → static NodeList
- `textContent` for user-supplied text (XSS-safe); `innerHTML` for trusted HTML templates
- `event.target` = originating element; `event.currentTarget` = element with listener attached
- Bubbling: default (third arg `false` or omit); Capturing: third arg `true` or `{capture:true}`
- Events that do NOT bubble: `focus`, `blur`, `load`, `scroll`
- `removeEventListener` requires the **same function reference** — store named functions or use AbortController
- DOMContentLoaded (DOM ready) fires before `load` (all resources ready)
- Event delegation: one parent listener + `event.target.closest()` = handles dynamic children
**Speaker Notes:** This slide wraps up the key testable points for the DOM and events section. The exam weight for this topic is approximately 8%, making it one of the higher-weighted sections. Expect questions on the difference between target and currentTarget, the bubbling vs capturing toggle, the textContent vs innerHTML security distinction, and event delegation logic. In the Salesforce context, questions may connect these concepts to LWC template querying and custom event patterns.

## Recording Script
Welcome to Lecture 11. This lecture covers the browser environment — the global objects, the DOM, and the event system that forms the foundation of all browser-side JavaScript.

Let's start with the global environment. In a browser, the global object is window. Everything you use without a namespace — setTimeout, fetch, console — is a property of window. The document property on window is your entry point to the DOM, the Document Object Model. When the browser parses your HTML, it builds a tree of node objects representing the structure. JavaScript manipulates this tree to make pages dynamic. The navigator object gives you information about the browser and platform.

To find elements in the DOM, you have three main methods. getElementById finds a single element by its id attribute — fastest, but only works for IDs. querySelector accepts a CSS selector string and returns the first match. querySelectorAll returns all matches as a static NodeList. Important: querySelectorAll returns a NodeList, not an Array. You can use forEach on it, but for other array methods you need to convert it first with spread or Array.from.

To manipulate the DOM, you create elements with createElement, set their content, and attach them with appendChild. The most important thing to remember: use textContent to set text content, especially for user-supplied data. textContent treats everything as plain text and automatically escapes HTML. innerHTML parses its value as HTML — if you put user input in innerHTML without sanitization, you have a cross-site scripting vulnerability. This is a security question that appears on the exam.

Events. You attach listeners with addEventListener. The event object that's passed to your handler has two important properties: target — the element that was actually clicked — and currentTarget — the element your listener is attached to. These are different during bubbling. preventDefault() cancels the browser's default behavior. stopPropagation() stops the event from traveling further.

Events propagate in two phases. Capturing goes from the document down to the target. Bubbling goes back up. By default, your listeners fire in the bubbling phase. To use the capturing phase, pass true as the third argument to addEventListener. Most events bubble, but focus, blur, load, and scroll do not.

Event delegation is a key pattern. Instead of attaching listeners to every item in a list, attach one listener to the parent and use event.target to figure out which child was interacted with. Use closest() to handle clicks on nested child elements. This pattern is memory-efficient and automatically handles dynamically added elements.

DOMContentLoaded fires when the HTML is parsed and the DOM is ready, before images and other resources load. The window load event fires when everything on the page is fully loaded. Use DOMContentLoaded for initialization — don't wait for images if you just need the DOM.

In Salesforce LWC, you won't use document.querySelector directly in components. You use this.template.querySelector, scoped to the component's shadow DOM. LWC events use the standard CustomEvent constructor. The bubbling and capturing concepts apply to LWC's event system. The exam tests DOM knowledge as JavaScript fundamentals — these concepts underpin everything LWC does at the platform level.

In the next lecture, we cover the browser developer tools that let you debug all of this.

## Exam Tips
- `querySelector` returns the **first** matching element or `null`. `querySelectorAll` returns a **static NodeList** (not live, not an Array).
- `event.target` = element that **fired** the event. `event.currentTarget` = element **with the listener**. During bubbling, target is fixed; currentTarget changes.
- Third arg to `addEventListener`: `true` or `{capture:true}` = capturing phase; `false` or omit = bubbling (default).
- Events that do **NOT** bubble: `focus`, `blur`, `load`, `scroll`. Use `focusin`/`focusout` if you need bubbling equivalents.
- `textContent` = plain text (XSS-safe). `innerHTML` = parsed HTML (XSS risk with user input).
- `removeEventListener` requires the **exact same function reference** as was passed to `addEventListener` — anonymous functions cannot be removed this way.
- Event delegation: one listener on parent + `event.target.closest(selector)` handles dynamic children efficiently.
- DOMContentLoaded fires when HTML is parsed (DOM ready). `window` `load` fires when all resources (images, CSS) are fully loaded.
- In LWC: use `this.template.querySelector()` not `document.querySelector()`. LWC events use `new CustomEvent()`.

## Lecture Summary
The browser environment exposes window as the global object, with document (DOM entry point) and navigator as key child properties. DOM querying uses getElementById, querySelector, and querySelectorAll; manipulation uses createElement, appendChild, and safe content APIs (textContent over innerHTML for user data). The event system uses addEventListener with a bubbling (default) or capturing (third-arg true) propagation model; event.target is the originating element while currentTarget is the listener's element. Event delegation uses a single parent listener with closest() to handle dynamic children efficiently. DOMContentLoaded signals a ready DOM tree while window load waits for all resources. In Salesforce LWC, these concepts manifest as this.template.querySelector(), connectedCallback lifecycle hooks, and CustomEvent-based component events.

## Mini Quiz

**Q1:** A developer attaches a listener to a `<ul>` element and clicks on a `<li>` inside it. Inside the listener, what does `event.target` refer to?
A) The `<ul>` element the listener is attached to
B) The `<li>` element that was clicked
C) The `document` object
D) `undefined` — target is only set on the originating element's listener
**Answer:** B — `event.target` always refers to the element that originally dispatched the event (the `<li>` that was clicked). `event.currentTarget` refers to the element the listener is attached to (the `<ul>`). This distinction is the foundation of the event delegation pattern.

**Q2:** Why should `textContent` be used instead of `innerHTML` when displaying user-submitted comments on a page?
A) `textContent` supports HTML formatting; `innerHTML` does not
B) `textContent` treats the value as plain text, preventing XSS; `innerHTML` parses it as HTML markup
C) `innerHTML` is deprecated in modern browsers; `textContent` is the replacement
D) `textContent` is faster than `innerHTML` for all DOM operations
**Answer:** B — `innerHTML` parses its value as HTML, which means a malicious user could inject a script tag or event handler attribute that executes JavaScript. `textContent` treats everything as a plain text string and automatically escapes angle brackets and other HTML characters, preventing cross-site scripting attacks. Neither A nor C is accurate.

**Q3:** A developer wants to add a click listener that fires only once and then removes itself. Which approach is correct?
A) `el.addEventListener('click', fn); el.removeEventListener('click', fn);`
B) `el.addEventListener('click', fn, { once: true });`
C) `el.addEventListener('click', fn, true);`
D) `el.onclick = fn; fn = null;`
**Answer:** B — The `once: true` option in the addEventListener options object causes the listener to automatically remove itself after firing for the first time. Option A would remove the listener immediately before it ever fires. Option C uses the capturing phase, not a one-time listener. Option D is fragile and does not work as described.
