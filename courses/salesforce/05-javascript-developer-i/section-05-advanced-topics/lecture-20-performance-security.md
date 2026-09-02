# Performance & Security

## Exam Domain
Performance & Security — ~8% of exam weight

## Core Concepts

### Big-O Complexity — Know These
```
O(1)   — Constant:    Array index access, Map.get(), Set.has()
O(log n) — Logarithmic: Binary search
O(n)   — Linear:      Linear scan, Array.forEach/map/filter
O(n log n) — Quasilinear: Array.sort (typically)
O(n²)  — Quadratic:   Nested loops, naive duplicate check
O(2ⁿ)  — Exponential: Recursive fib without memo

Lookup comparison:
  Array.includes()   → O(n) scan
  Object key lookup  → O(1) hash
  Map.get()          → O(1) hash
  Set.has()          → O(1) hash
```

Replace `array.includes()` in hot loops with a `Set` for O(1) lookup:
```javascript
// SLOW: O(n) per check → O(n²) total for 1000 contacts
const isValid = validIds.includes(contactId);

// FAST: O(1) per check → O(n) total
const validSet = new Set(validIds);
const isValid = validSet.has(contactId);
```

### Memory Leaks — Common Sources
```javascript
// 1. Event listeners not removed
function setupListener() {
    window.addEventListener('resize', this.handler);
    // Fix: window.removeEventListener in cleanup
}

// 2. Closures holding large objects
function cache() {
    const bigData = new Array(1000000).fill('x');
    return () => bigData[0];  // bigData stays in memory
    // Fix: nullify references when no longer needed
}

// 3. Detached DOM nodes still referenced
const el = document.createElement('div');
document.body.appendChild(el);
const elements = [el];
document.body.removeChild(el);
// el still in `elements` — not garbage collected
// Fix: elements = null; or elements.pop();

// 4. Circular references (engines handle most, but watch with WeakMap)
const a = {}, b = {};
a.ref = b; b.ref = a;  // modern GC handles this, but avoid in hot paths
```

### XSS — Cross-Site Scripting
```javascript
// VULNERABLE — attacker injects script via user input
element.innerHTML = userInput;
// If userInput = '<script>stealCookies()</script>' → executed!

// SAFE options
element.textContent = userInput;     // treats as plain text — safe
element.setAttribute('data-x', userInput);  // attribute encoding
DOMPurify.sanitize(userInput);      // if HTML rendering required

// LWC: template bindings are auto-escaped
// {userInput} in template → XSS safe (LWC sanitizes)
// HTML.unsafeHTML — EXPLICIT opt-in to raw HTML (use only for trusted content)
```

### eval() — Why Never
```javascript
eval(userInput);          // CRITICAL vulnerability
new Function(userInput)(); // same risk

// Risks:
// 1. Executes arbitrary code — XSS if userInput comes from user
// 2. Disabled by CSP (Content Security Policy) in Salesforce
// 3. Prevents JavaScript engine optimization
// 4. Strict mode + LWC → throws error

// Alternatives:
// JSON.parse for data — safe parser
// Function lookup map instead of eval('fn' + name + '()')
const actions = { save: saveRecord, delete: deleteRecord };
actions[actionName]?.();  // safe dynamic dispatch
```

### Content Security Policy (CSP)
```
CSP restricts what scripts can execute on a page.
Salesforce enforces CSP in LWC:
  - No inline scripts: <script>...</script> in HTML
  - No eval() or new Function()
  - External scripts: must come from Static Resources (org-controlled)
  - Inline event handlers (onclick="...") not allowed in LWC templates

CSP response headers:
  Content-Security-Policy: script-src 'self'; object-src 'none'
```

### Performance Patterns in LWC
```javascript
// 1. Debounce inputs (see Lecture 17)
handleSearch = debounce(() => this.executeSearch(), 300);

// 2. Avoid DOM queries in loops
// BAD: queries DOM on every iteration
items.forEach(item => {
    this.template.querySelector('.container').appendChild(createEl(item));
});

// GOOD: query once
const container = this.template.querySelector('.container');
items.forEach(item => container.appendChild(createEl(item)));

// 3. Use getter for computed values (cached between renders if dependencies unchanged)
get sortedContacts() {
    return [...this.contacts].sort((a, b) => a.name.localeCompare(b.name));
}

// 4. Avoid large arrays in reactive state — triggers full re-render
// Use pagination instead of loading all records

// 5. requestAnimationFrame for visual updates
requestAnimationFrame(() => {
    element.style.transform = `translateX(${pos}px)`;
});
```

### Trusted vs Untrusted Data
```
Trusted: data from Apex (server validated, field-level security applied)
Untrusted: user input, URL parameters, localStorage, postMessage

Rule: NEVER directly render untrusted data as HTML
      ALWAYS sanitize or use textContent
      ALWAYS validate on server (Apex) even if validated on client
```

## Architecture / How It Works

### LWC Performance Model
```
State change (property assignment or @wire update)
    │
    ▼
LWC Reactivity Engine
    ├── Schedules a render (batches multiple changes)
    │
    ▼
Virtual DOM diff
    │
    ▼
Minimal DOM update (only changed nodes)

Performance considerations:
  - Avoid updating large arrays element-by-element (triggers re-render per update)
  - Use spread to create new array reference: this.records = [...this.records, newRecord]
  - Avoid deeply nested reactive state — keep flat
```

### Security Layers in Salesforce LWC
```
Page Request
    │
    ▼
Salesforce Server (HTTPS, authentication, CRUD FLS)
    │
    ▼
LWC Compiler (validates module imports, no eval)
    │
    ▼
Lightning Web Security (LWS) — sandboxes component execution
    │
    ▼
Browser CSP — restricts script sources and inline execution
    │
    ▼
Shadow DOM — isolates component DOM trees
```

**Limitations:**
- Shadow DOM CSS isolation means performance CSS tricks that relied on global selectors don't work
- Excessive reactive state updates cause cascade re-renders — profile with Salesforce Inspector
- LWS (Lightning Web Security) adds overhead vs native browser — most users don't notice, but ISV heavy DOM manipulation will
- `requestAnimationFrame` is not available in LWC templates (server-side rendering context) — only in lifecycle hooks

## PTA / SA Relevance

**Code review flags:**
- `element.innerHTML = userInput` — XSS vulnerability (critical finding)
- `eval()` in LWC or any Salesforce JavaScript — CSP violation, security risk
- O(n²) algorithms processing large Salesforce datasets (nested loops over all records × all lookup values)
- Missing debounce on search inputs — performance and SOQL limit issue
- Event listeners added without cleanup — memory leak over component re-mount cycles

**Architecture guidance:**
- For data-heavy LWC components (lists, tables): paginate at Apex layer; never pull 10K records to client
- For real-time updates: Lightning Streaming API + EMP API (not polling with setInterval)
- For ISV packages: CSP is stricter; external scripts must be whitelisted Static Resources; document this for customers

**Customer advisory:** When customers report LWC performance issues, triage in this order:
1. Network: slow Apex queries (check query plan in Developer Console)
2. Data volume: too many records rendered at once
3. Re-render thrash: too many rapid state changes (debounce, batch updates)
4. Memory: listener leaks causing degradation over session time

## Key Facts to Memorize
- O(1) = constant: Map.get, Set.has, object property; O(n) = linear: array scan; O(n²) = nested loops
- Memory leaks: unreleased event listeners, detached DOM references, closure over large objects
- XSS: `innerHTML = userInput` is vulnerable; `textContent` is safe
- `eval()` = forbidden in LWC (CSP + security + optimization killer)
- CSP: no inline scripts, no eval, external scripts via Static Resources only
- LWC: template bindings `{value}` auto-escape HTML — safe; `lwc:dom="manual"` + innerHTML = NOT safe

## Exam Traps
- `textContent` vs `innerHTML`: textContent is always safe (treats as text); innerHTML parses HTML — dangerous with user input
- CSP doesn't prevent all XSS — it prevents script execution from injected `<script>` tags, but DOM-based XSS via innerHTML still works
- Set/Map lookups O(1) vs Array.includes O(n) — know when to trade memory for lookup speed
- `removeEventListener` without stored reference — anonymous functions CANNOT be removed

## Practice Questions
**Q:** What is the XSS vulnerability and how do you fix it?
```javascript
element.innerHTML = `<b>Welcome, ${user.displayName}!</b>`;
```
**A:** If `user.displayName` contains `</b><script>maliciousCode()</script>`, it executes. Fix: `element.textContent = user.displayName` then format separately, or sanitize with DOMPurify if HTML is needed. In LWC templates, use `{user.displayName}` (auto-escaped).

**Q:** A search lookup checks a 1000-element array 100 times per search. What is the complexity and how do you fix it?
**A:** Current: O(n) per check × 100 checks = O(100n) ≈ O(n²) behavior. Fix: convert the array to a `Set` once (O(n)), then use `Set.has()` O(1) per check → O(n + 100) ≈ O(n) total.

**Q:** What are two ways memory leaks occur in LWC components?
**A:** (1) Adding a window event listener in `connectedCallback` without removing it in `disconnectedCallback` — the listener and its closure remain in memory after the component is removed. (2) Storing a reference to a DOM element that was removed from the DOM — the element cannot be garbage collected while referenced.
