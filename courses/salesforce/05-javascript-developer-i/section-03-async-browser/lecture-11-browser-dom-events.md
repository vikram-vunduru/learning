# Browser Environment, DOM & Events

## Exam Domain
Browser & Node APIs — ~13% of exam weight

## Core Concepts

### Browser Global Objects
```javascript
// window — global object in browser (not available in LWC strict context)
window.innerWidth;           // viewport width
window.localStorage;         // persistent storage
window.sessionStorage;       // session-scoped storage
window.setTimeout/Interval;  // timer APIs (available in LWC)

// document — entry point to DOM
document.querySelector('#main');          // first match by CSS selector
document.querySelectorAll('.items');      // NodeList of all matches
document.getElementById('header');       // by ID (fastest lookup)
document.createElement('div');           // create element
document.body.appendChild(element);      // add to DOM

// navigator — browser/user info
navigator.userAgent;    // browser string
navigator.onLine;       // network status

// location — URL manipulation
location.href;          // current URL
location.reload();      // refresh page
```

### DOM Manipulation
```javascript
const el = document.querySelector('.container');

// Content
el.textContent = 'Safe text';      // plain text — safe
el.innerHTML = '<b>HTML</b>';      // parses HTML — XSS risk!

// Attributes
el.setAttribute('data-id', '123');
el.getAttribute('data-id');        // '123'
el.dataset.id;                     // shortcut for data-* attributes

// Style
el.style.color = 'red';
el.classList.add('active');
el.classList.remove('inactive');
el.classList.toggle('highlighted');
el.classList.contains('active');   // true/false

// DOM traversal
el.parentElement;
el.children;           // HTMLCollection of child elements
el.firstElementChild;
el.nextElementSibling;
```

### Events — Bubbling, Capturing & Delegation

**Event phases:**
```
1. CAPTURING phase — event travels DOWN from window to target
2. TARGET phase — event at the target element
3. BUBBLING phase — event travels UP from target to window

window
  └── document
        └── body
              └── div.container      (capturing: window→document→body→div)
                    └── button ◄───── click event TARGET
                          ↑  (bubbling: button→div→body→document→window)
```

```javascript
// Bubbling (default — third param false or omitted)
el.addEventListener('click', handler);
el.addEventListener('click', handler, false);

// Capturing (third param true)
el.addEventListener('click', handler, true);

// Stop propagation
el.addEventListener('click', e => {
    e.stopPropagation();  // stop bubbling/capturing
    e.preventDefault();   // prevent default browser action (e.g., form submit)
});
```

**Event delegation — attach one listener to parent:**
```javascript
// Instead of one handler per button (bad for 100 buttons):
document.querySelector('#list').addEventListener('click', (e) => {
    const btn = e.target.closest('button');  // find clicked button
    if (!btn) return;
    console.log('Clicked:', btn.dataset.id);
});
// One listener handles all current AND future buttons — dynamic content works
```

### Event Object Properties
```javascript
element.addEventListener('click', (event) => {
    event.target;        // element that triggered event (deepest)
    event.currentTarget; // element with the listener attached (could differ in bubbling)
    event.type;          // 'click', 'keydown', etc.
    event.preventDefault();  // block browser default
    event.stopPropagation(); // stop bubbling/capturing
    event.stopImmediatePropagation(); // stop + prevent other listeners on same element
    event.key;           // 'Enter', 'Escape' (keyboard events)
    event.clientX/Y;     // mouse position
    event.detail;        // CustomEvent payload
});
```

### Custom Events
```javascript
// Dispatch
const evt = new CustomEvent('contactselected', {
    detail: { id: '003xxx', name: 'Alice' },
    bubbles: true,      // propagates up DOM
    composed: true      // crosses shadow DOM boundaries
});
element.dispatchEvent(evt);

// Listen
element.addEventListener('contactselected', (e) => {
    console.log(e.detail.id);
});
```

## Architecture / How It Works

### LWC Shadow DOM vs Browser DOM
```
Standard Browser DOM:
  document
    └── body
          └── my-component  ← can be reached with document.querySelector

LWC Shadow DOM:
  document
    └── body
          └── c-my-component
                └── #shadow-root  ← boundary
                      └── div.inner  ← NOT reachable from outside
                            └── c-child-component
                                  └── #shadow-root
                                        └── button  ← deeply nested

  this.template.querySelector('.inner')  ← correct: search within own shadow
  document.querySelector('.inner')       ← WRONG: cannot cross shadow boundary
```

**Event bubbling in LWC shadow DOM:**
```
CustomEvent options:
  bubbles: true, composed: false → stays in shadow root, parent LWC listens ✓
  bubbles: true, composed: true  → crosses ALL shadow boundaries upward
  bubbles: false (default)       → stays at dispatching component only
```

**Limitations:**
- `innerHTML` is XSS-vulnerable; use `textContent` for user input
- Event delegation with shadow DOM: `e.target` inside a shadow root appears as the HOST element from outside — retargeting
- `removeEventListener` requires the EXACT SAME function reference as `addEventListener` — anonymous functions cannot be removed
- `NodeList` from `querySelectorAll` is NOT an array — no `.map()` etc.; convert with `Array.from()`

## PTA / SA Relevance

**Code review flags:**
- `document.querySelector` in LWC JavaScript — wrong; will not find elements inside shadow roots
- `element.innerHTML = userInput` — XSS vulnerability; should be `textContent`
- Adding event listeners in `connectedCallback` without removing them in `disconnectedCallback` — memory leak
- Anonymous function passed to `addEventListener` — cannot be removed later

**Architecture guidance:**
- LWC shadow DOM isolation is a feature for Salesforce multi-tenant security, but it requires developers to understand why `document.querySelector` fails and why events don't always propagate as expected
- For parent-child component communication within LWC hierarchy: use `CustomEvent` with `bubbles:true, composed:false`. For global events: Lightning Message Service (LMS)

**Customer advisory:** When customers ask "why can't I style the inside of a standard Lightning component," the answer is shadow DOM isolation. Salesforce deliberately prevents CSS from crossing shadow boundaries. The workaround is CSS Custom Properties (design tokens) which can cross shadow boundaries.

## Key Facts to Memorize
- `querySelector` returns first match or null; `querySelectorAll` returns NodeList (not Array)
- Event phases: capture (down) → target → bubble (up)
- Default: `addEventListener` = bubbling; pass `true` as third arg for capturing
- `e.target` = element that triggered; `e.currentTarget` = element with the listener
- `stopPropagation()` stops event travel; `preventDefault()` stops browser default action
- LWC: use `this.template.querySelector()`, not `document.querySelector()`
- Shadow DOM: events retarget when crossing boundaries; `composed:true` needed to escape

## Exam Traps
- `e.target` vs `e.currentTarget`: in event delegation, `target` is the actual clicked element, `currentTarget` is the delegating ancestor
- Capturing listener fires BEFORE bubbling listener for the same element
- `NodeList` is not an Array — `querySelectorAll(...)` result has no `.map()` method
- Removing an event listener: `removeEventListener` requires exact same function reference — won't work with inline anonymous functions
- `stopPropagation` does NOT prevent other listeners on the SAME element for the same event; use `stopImmediatePropagation` for that

## Practice Questions
**Q:** What is the difference between `e.target` and `e.currentTarget`?
**A:** `e.target` is the element that originally triggered the event (deepest element in the DOM at the click point). `e.currentTarget` is the element whose listener is currently executing. In event delegation, `currentTarget` is the parent with the listener; `target` is the actual child that was clicked.

**Q:** A developer registers this in LWC: `document.querySelector('.submit-btn').addEventListener(...)`. Why doesn't it work?
**A:** In LWC, the component's template lives inside a shadow root. `document.querySelector` searches the main document DOM and cannot see inside shadow roots. Use `this.template.querySelector('.submit-btn')` to search within the component's own shadow tree.

**Q:** When should you use event delegation instead of attaching listeners to individual elements?
**A:** When you have many elements (buttons in a large list) or dynamically created elements (added after initial render). Event delegation attaches one listener to the parent and uses `e.target` to identify which child was clicked. It's more memory-efficient and works with dynamic content.
