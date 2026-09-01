# Lecture 20: Performance & Security

## Learning Objectives
- Identify common JavaScript memory leak patterns and explain how to prevent them
- Apply secure coding practices to prevent XSS vulnerabilities in JavaScript applications
- Use the Performance API to measure code execution time with performance.now() and performance marks
- Explain the basics of Content Security Policy (CSP) and why eval() is prohibited in secure environments
- Identify time complexity (Big-O) for common JavaScript operations (Array vs Map/Set lookup)

## Slides

### Slide 1: Time Complexity for JavaScript Developers
**Visual:** Table with operations: Array.includes() O(n) vs Set.has() O(1), object property access O(1) vs Array.find() O(n), sorting O(n log n). Color-coded: green for O(1), yellow for O(log n), orange for O(n), red for O(n²).
**Content:**
- **O(1) — constant time**: property access `obj.key`, Map.get(), Set.has(), Array index `arr[i]`
- **O(n) — linear**: `Array.includes()`, `Array.find()`, `Array.filter()`, `for` loop
- **O(n log n)**: `Array.sort()`
- **O(n²)**: nested loops — avoid for large datasets
- **Practical rule**: use `Set` or `Map` when you need fast membership checks or keyed lookups on large data
- When processing large arrays, avoid calling `Array.includes()` inside a loop — use a `Set` built beforehand
```js
// O(n²) — bad
const ids = largeArray.map(item => item.id);
items.forEach(i => { if (ids.includes(i.id)) ... }); // includes inside loop

// O(n) — good
const idSet = new Set(largeArray.map(item => item.id));
items.forEach(i => { if (idSet.has(i.id)) ... }); // O(1) lookup
```
**Speaker Notes:** JSI doesn't require deep algorithm knowledge, but understanding why Set/Map lookups are O(1) while array searches are O(n) is directly applicable to writing performant JavaScript — especially in LWC components that process Salesforce record collections.

### Slide 2: Memory Leaks — Common Patterns
**Visual:** Four panels each showing a memory leak pattern with a before (leaked) vs after (fixed) code comparison. Patterns: forgotten event listener, closure holding large object, detached DOM node, timer not cleared.
**Content:**
- **Forgotten event listener**: adding to `window`/`document` without removing on component teardown
```js
// Leak — handler keeps closure alive, preventing GC
window.addEventListener('resize', this.handleResize);
// Fix — remove in cleanup
window.removeEventListener('resize', this.handleResize);
```
- **Detached DOM nodes**: removing a DOM element from the document but keeping a reference to it in JS — the subtree stays in memory
- **Closures over large objects**: a closure in a long-lived callback keeps the entire captured scope alive
- **Uncleaned timers**: `setInterval` that is never `clearInterval`-ed — also fires callback forever
- **Global variables**: variables on `window` never garbage collected
- **Maps/Sets keeping stale entries**: use `WeakMap`/`WeakSet` if the key lifetime should match the object's
**Speaker Notes:** Memory leaks in JavaScript are invisible until the browser tab starts slowing down. The browser's DevTools Memory tab lets you take heap snapshots and compare them — retained object sizes and detached DOM trees are the biggest flags. In LWC, the `disconnectedCallback` lifecycle hook is your cleanup gate: remove all event listeners, clear all timers, unsubscribe from message channels.

### Slide 3: XSS — Cross-Site Scripting
**Visual:** Attack diagram: attacker submits `<script>alert('xss')</script>` as a form input → stored in database → page renders innerHTML with stored value → script executes in victim's browser. Below: fix diagram showing textContent used instead, rendering the script tag as literal text.
**Content:**
- **XSS**: attacker injects malicious scripts that execute in other users' browsers
- **Root cause**: using `innerHTML` with user-controlled data
```js
// VULNERABLE — user input rendered as HTML
div.innerHTML = userInput;

// SAFE — rendered as text, tags are escaped
div.textContent = userInput;
```
- **Sanitization libraries**: DOMPurify, sanitize-html — strip dangerous tags before innerHTML use
- **When innerHTML is safe**: only with hardcoded strings or trusted, server-sanitized content
- **Template literals in innerHTML**: `div.innerHTML = \`Hello ${userName}\`` — still vulnerable if `userName` contains `<script>`
- **In LWC**: `{expression}` in templates is auto-escaped; `lwc:inner-html` directive requires explicit trust
**Speaker Notes:** XSS is one of the most common web vulnerabilities and a direct consequence of trusting user input without sanitization. The golden rule: never pass untrusted data to innerHTML. textContent sets the text directly without interpreting HTML entities, so even `<script>alert(1)</script>` becomes the literal text string. In the JSI exam, any question about "what is wrong with this code" that shows innerHTML with a variable is asking you to identify the XSS vulnerability.

### Slide 4: eval() and Why It's Dangerous
**Visual:** Flow diagram showing eval('string') → JS engine parses and executes the string → if string comes from user input: code injection. Second panel: eval alternatives — JSON.parse() for JSON, Function constructor caveat, template literals for dynamic text.
**Content:**
- `eval(code)` executes a **string as JavaScript** — powerful and dangerous
- Security risks:
  - If `code` contains user input → arbitrary code execution
  - `eval` has access to the local scope — can read/write local variables
- Performance: code passed to `eval` cannot be optimized by JS engines
- **CSP `script-src 'unsafe-eval'`** must be explicitly allowed — most security policies block it by default
- Salesforce Lightning Web Security **blocks `eval` completely**
- `new Function(args, body)` has the same security risk — executes arbitrary string as function body
- **Safe alternatives**:
  - `JSON.parse()` for parsing JSON data (not `eval('(' + json + ')')`)
  - Map/switch for conditional logic instead of dynamic function building
  - Template literals for dynamic text output
**Speaker Notes:** The `eval()` function is almost never needed in modern JavaScript. Any pattern that uses it can be rewritten more safely. The reason Salesforce's LWS blocks it is exactly right — a platform where hundreds of thousands of organizations run code side-by-side cannot allow arbitrary string execution. If you find yourself needing eval, stop and rethink the design.

### Slide 5: Content Security Policy (CSP)
**Visual:** HTTP response header diagram showing `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'`. Annotations explain each directive. Second section: LWC Lightning Locker / LWS CSP restrictions.
**Content:**
- **CSP**: HTTP response header that controls what resources the browser may load
- Key directives:
  - `default-src`: fallback for all resource types
  - `script-src`: controls JavaScript sources — `'self'` = same origin only
  - `'unsafe-inline'`: allows inline `<script>` tags — avoid
  - `'unsafe-eval'`: allows eval() — avoid
  - `nonce-{value}`: allows specific inline scripts with a matching nonce attribute
- **Why it matters for JSI**: Salesforce enforces strict CSP on Lightning pages; no inline scripts, no eval
- **Practical impact**: all JavaScript must be in `.js` files (static resources or LWC modules), not inline in HTML
- CSP violations are reported in the browser console as "Refused to execute..."
**Speaker Notes:** Content Security Policy is a defense-in-depth mechanism — even if an attacker manages to inject malicious HTML (like an `<img>` tag with an onerror handler), a strict CSP prevents the browser from loading or executing unauthorized scripts. In the Salesforce context, this is why you can't use `<script>` tags in Visualforce without explicitly whitelisting them, and why eval is blocked in LWC components.

### Slide 6: Performance API — Measuring Code
**Visual:** Code block showing performance.now() timing, performance.mark/measure API, and the browser Performance tab timeline showing User Timing marks as orange flags on the waterfall.
**Content:**
- `performance.now()` — high-resolution timestamp in milliseconds (fractional)
```js
const t0 = performance.now();
doExpensiveOperation();
const t1 = performance.now();
console.log(`Took ${(t1 - t0).toFixed(2)}ms`);
```
- `performance.mark(name)` — place a named timestamp marker
- `performance.measure(name, startMark, endMark)` — create a named duration measurement
- `performance.getEntriesByType('measure')` — retrieve all measurements
- `console.time('label')` / `console.timeEnd('label')` — simpler alternative for quick timing
- **Long Tasks**: any task blocking the main thread for >50ms is a "Long Task" — visible in DevTools Performance tab
- Avoid synchronous operations in the critical rendering path (between user input and paint)
**Speaker Notes:** Performance measurement should be data-driven, not guesswork. Before optimizing any code path, measure it. `performance.now()` gives you sub-millisecond precision. In production, the User Timing API (mark/measure) integrates with Real User Monitoring (RUM) tools to track real-world performance from actual users' browsers. A rule of thumb: anything over 100ms feels sluggish to users; over 300ms feels slow; over 1 second, users start abandoning.

### Slide 7: Garbage Collection and WeakRef
**Visual:** Memory diagram showing a strong reference preventing GC (red arrow from variable to object) vs a WeakRef allowing GC (dashed arrow, object can be collected). Below: WeakMap and WeakSet use cases with DOM nodes as keys.
**Content:**
- JavaScript uses **mark-and-sweep** garbage collection — objects with no reachable references are collected
- Strong references prevent GC: `let cache = {}; cache[key] = bigObject;` — bigObject stays alive as long as cache
- **WeakMap**: keys are **weakly held** — if the key object is GC'd, the entry is removed automatically
  - Use case: metadata associated with DOM elements without preventing element GC
- **WeakSet**: weakly held object membership — no size, not iterable
- **WeakRef**: a reference that does NOT prevent GC
```js
const weakRef = new WeakRef(expensiveObject);
const obj = weakRef.deref(); // returns obj if alive, undefined if GC'd
if (obj) { obj.doWork(); }
```
- `FinalizationRegistry`: register a callback to run when an object is GC'd — for cleanup
**Speaker Notes:** WeakMap, WeakSet, and WeakRef are the advanced memory management tools in JavaScript. You'll rarely write them directly, but you'll encounter them in library code and frameworks. The key concept is: weak references don't prevent garbage collection. This is perfect for caches where you want entries to naturally expire when the referenced object is no longer needed elsewhere, rather than manually tracking and removing cache entries.

### Slide 8: JSI Exam — Performance & Security Summary
**Visual:** A "red flags" checklist for code review: innerHTML with variable (XSS), eval() call (security + performance), Array.includes() inside a loop (O(n²)), event listener without removal (memory leak), setInterval without clearInterval (timer leak), synchronous fetch blocking UI (performance).
**Content:**
- **XSS red flag**: `element.innerHTML = userVariable` — use `textContent` or sanitize
- **eval red flag**: `eval(userString)` — rewrite with Map/switch or JSON.parse
- **O(n²) red flag**: `arr.includes()` or `arr.find()` inside a `forEach`/`for` loop — build a Set first
- **Memory leak red flags**: event listener without cleanup, setInterval without clearInterval, DOM reference held after element removal
- **CSP violation**: inline `<script>` tags, inline event handlers — move to .js files
- **Performance**: synchronous blocking code in event handlers, large synchronous loops, unthrottled scroll/resize handlers
- These patterns appear as "what is wrong with this code?" questions in the JSI exam

## Recording Script
Welcome to Lecture 20 — Performance and Security. This is the final lecture of the course, and it ties together some of the most important concepts that separate good JavaScript from production-quality JavaScript.

Let's start with performance. Time complexity is the study of how code scales with data size. For JavaScript developers, the practical lesson is simple: use Set and Map when you need fast lookups. A Set.has() call is O(1) — it takes the same time whether your set has 10 or 100,000 elements. Array.includes() is O(n) — it scans every element. When you put Array.includes() inside a forEach loop, you've created an O(n²) algorithm that will grind to a halt on large datasets. Build a Set once, then use it.

Memory leaks are the silent killers of JavaScript applications. The most common patterns are: forgetting to remove event listeners, especially ones added to window or document; holding references to DOM elements after they've been removed from the page; and intervals that run forever because clearInterval was never called. In LWC, disconnectedCallback is your cleanup gate — anything you set up in connectedCallback, clean up there.

Security. XSS is the most common web vulnerability, and the most common cause is innerHTML with user-controlled data. The fix is a single word: textContent. If you must render HTML, use a sanitization library like DOMPurify. eval() is another class of danger — it executes a string as code, and if that string contains user input, you have arbitrary code execution. eval is blocked in Salesforce LWC, and it should be blocked everywhere.

Content Security Policy is the browser's enforcement mechanism for these rules. A properly configured CSP prevents the browser from executing inline scripts, loading from untrusted domains, and running eval — even if an attacker manages to inject malicious content into your page. Salesforce enforces strict CSP on Lightning pages, which is why you can't use inline scripts.

Finally, the Performance API gives you precise measurement tools. performance.now() for timing, mark and measure for named spans, console.time for quick checks. Measure before you optimize — premature optimization based on guesswork wastes time and often makes code worse.

Congratulations — you've completed the course. You now have the JavaScript foundation needed for both the JSI certification and professional LWC development.

## Exam Tips
- **XSS**: `innerHTML` with a variable = security vulnerability; fix with `textContent` or DOMPurify
- **eval()** is prohibited in Salesforce LWC (Lightning Web Security) and in any strict CSP environment
- **O(1) vs O(n)**: Map/Set lookups are O(1); Array.find/includes/filter are O(n) — use a Set for fast membership checks in loops
- **Memory leaks**: always mirror setup/teardown — if you add an event listener in `connectedCallback`, remove it in `disconnectedCallback`
- **Performance.now()** returns a DOMHighResTimeStamp — a float in milliseconds with sub-millisecond precision; `Date.now()` is an integer in milliseconds and less precise

## Lecture Summary
Performance and security are two sides of the same quality coin in production JavaScript. O(1) lookups with Map and Set replace O(n) array scans when datasets are large. Memory leaks — from lingering event listeners, uncleaned timers, and detached DOM references — are prevented by mirroring setup with teardown in lifecycle hooks. XSS is prevented by using textContent over innerHTML and never trusting user-controlled data in HTML rendering contexts. eval() is dangerous (and blocked in LWC) because it executes arbitrary strings as code. The Performance API provides precise measurement with performance.now() and the mark/measure User Timing API, while Content Security Policy enforces these restrictions at the browser level.

## Mini Quiz

**Q1:** A developer writes the following code inside a component. What is the security vulnerability?
```js
const userComment = document.getElementById('comment').value;
document.getElementById('output').innerHTML = userComment;
```
A) The code will throw a TypeError because getElementById returns null
B) The code is vulnerable to XSS — user-controlled HTML is rendered into the DOM
C) The code has a memory leak because the DOM reference is not cleaned up
D) The code is O(n²) because getElementById scans the entire DOM twice
**Answer:** B — Setting `innerHTML` from user-controlled input allows an attacker to inject `<script>` tags or event handler attributes (like `<img onerror="...">`) that execute JavaScript in other users' browsers. Fix: use `textContent = userComment` instead. The other options describe real problems but not the one this specific code has.

**Q2:** A developer needs to check if a user ID exists in a list of 50,000 allowed IDs, 10,000 times during a data processing operation. What is the most efficient approach?
A) Use `allowedIds.includes(userId)` in a loop — simple and readable
B) Sort `allowedIds` first and use binary search for O(log n) lookups
C) Build a `Set` from `allowedIds` once, then use `allowedIdSet.has(userId)` in the loop
D) Use `allowedIds.find(id => id === userId)` — it short-circuits on the first match
**Answer:** C — Building a Set once (O(n)) and then calling Set.has() for each of the 10,000 lookups (O(1) each) results in O(n + m) total time. Array.includes() and Array.find() are both O(n) per call, resulting in O(n × m) = O(500,000,000) operations. Binary search would be O(n log n + m log n) — better than linear but still slower than a hash-based Set.

**Q3:** What does the `Content-Security-Policy: script-src 'self'` header instruct the browser to do?
A) Only execute JavaScript that comes from the same origin as the page; block inline scripts and eval
B) Require all scripts to use HTTPS, even on the same origin
C) Allow all scripts except those from third-party CDNs
D) Block all JavaScript execution — only CSS and HTML are allowed
**Answer:** A — `script-src 'self'` tells the browser to only execute JavaScript files served from the same origin. Inline `<script>` tags are blocked (would need `'unsafe-inline'`) and eval() is blocked (would need `'unsafe-eval'`). This directly prevents XSS attacks that rely on injecting inline script tags. HTTPS enforcement is handled by `upgrade-insecure-requests` or HSTS, not script-src.
