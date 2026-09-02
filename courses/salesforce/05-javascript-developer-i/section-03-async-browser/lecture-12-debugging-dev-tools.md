# Debugging & Browser Developer Tools

## Exam Domain
Browser & Node APIs — ~13% of exam weight

## Core Concepts

### console API — Beyond console.log
```javascript
console.log('basic output');
console.error('error — red in console');
console.warn('warning — yellow');
console.info('informational');

// Structured logging
console.table([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
// Renders as table in DevTools

// Grouping
console.group('User Data');
  console.log('name:', user.name);
  console.log('role:', user.role);
console.groupEnd();

// Timing
console.time('fetch');
await fetchData();
console.timeEnd('fetch');  // "fetch: 142ms"

// Assert — logs only if condition is false
console.assert(array.length > 0, 'Array should not be empty');
```

### debugger Statement
```javascript
function processData(data) {
    debugger;  // pauses execution in DevTools if debugger is open
    return data.map(x => x * 2);
}
```
- Only pauses when DevTools is open AND "Pause on breakpoints" is active
- Remove before committing to production

### Breakpoints in DevTools
- **Line breakpoints** — click line number in Sources panel
- **Conditional breakpoints** — right-click line → "Add conditional breakpoint" → only pauses when expression is true
- **Logpoints** — like breakpoints but log a message instead of pausing (no code change needed)
- **XHR/fetch breakpoints** — pause when a URL is fetched (good for debugging Apex call timing)
- **Event listener breakpoints** — pause on click, submit, etc. (event source panel)

### Call Stack, Scope & Watch
```
When paused at breakpoint:
  Call Stack panel → shows current execution stack (function call chain)
  Scope panel      → shows local, closure, and global variables at that frame
  Watch panel      → evaluate expressions while paused
  Console          → run arbitrary code in current scope context
```

### Source Maps
Source maps allow debugging transpiled/minified code by mapping it back to original source.
- LWC: Salesforce tooling generates source maps for deployed components
- In DevTools: "Enable JavaScript source maps" setting
- Without source maps: you debug minified `function a(b){return b*c}` instead of readable code

### Common Debugging Patterns
```javascript
// 1. Trace unexpected values
const result = processData(input);
console.log('processData input:', input, 'output:', result);

// 2. Check for null early (prevent cascade errors)
if (!data) { console.error('data is null/undefined'); return; }

// 3. Verify async timing
console.log('before await');
const res = await someCall();
console.log('after await, res:', res);

// 4. Measure performance
performance.mark('start');
expensiveOperation();
performance.mark('end');
performance.measure('duration', 'start', 'end');
console.log(performance.getEntriesByName('duration')[0].duration + 'ms');
```

### Network Panel — Debugging Apex Calls in LWC
```
Network panel in Chrome DevTools:
  - Filter by XHR/Fetch to see Apex wire calls and imperative calls
  - Click request → Payload: see parameters sent to Apex
  - Response: see data returned (or error message from Apex exception)
  - Timing: see TTFB, download time — useful for diagnosing slow wire adapters
```

## Architecture / How It Works

### LWC Debugging in DevTools
```
Chrome DevTools for Salesforce:
  1. Enable Debug Mode in Setup > User Interface > LWC Debug Mode
     - Without: minified LWC code (hard to read)
     - With: readable LWC framework code + source-mapped component code

  2. Sources panel → find your component:
     - Scratch org: c/myComponent.js
     - Production org: use source maps

  3. Common LWC debugging flow:
     a. Network panel: verify Apex call fires with correct parameters
     b. Console: check for TypeError/ReferenceError from wire data
     c. Breakpoint in connectedCallback or wire handler
     d. Watch: monitor `this.record?.data` as wire resolves
```

**Limitations:**
- Debug mode adds significant overhead — only enable for developers, never for end users
- `console.log` in LWC components is visible in browser console in sandbox; in production, consider removing or gating behind a debug flag
- Source maps can be absent in managed packages — you may only see transpiled code
- `debugger` statement in production code blocks all users if someone opens DevTools — always remove

## PTA / SA Relevance

**Code review flags:**
- Committed `debugger` statements — block execution for anyone with DevTools open
- `console.log` with sensitive data (PII, session tokens) left in production code
- Missing error logging for Apex call failures — silent failures are impossible to debug in production

**Architecture guidance:**
- For LWC debugging at a partner/ISV: always enable LWC Debug Mode in the scratch org. Add it to the project's `sfdx-project.json` default settings.
- For production issue diagnosis: use browser HAR exports from the Network panel to analyze Apex call timing without touching production org code
- Recommend Salesforce's "jsforce" debugger for batch Apex debugging during data migration scripts

**Customer advisory:** When customers report intermittent LWC issues, ask them to reproduce with DevTools Network panel open and capture a HAR file. This shows all Apex calls, parameters, responses, and timing — enough to diagnose 90% of reported issues without code changes.

## Key Facts to Memorize
- `console.error/warn/log/info/table/time/timeEnd/assert` — know each purpose
- `debugger` pauses execution only when DevTools is open
- Breakpoints: line, conditional, logpoint, XHR, event listener
- Call Stack panel shows the full execution path to the paused line
- Source maps: map transpiled code back to readable source for debugging
- LWC: enable Debug Mode in Salesforce Setup for readable component code

## Exam Traps
- `console.log` vs `console.error` — exam may ask which method produces red output in console (error)
- `debugger` without DevTools open does NOTHING — it's not visible to users
- `console.assert(false, 'msg')` — logs the message; `console.assert(true, 'msg')` — does nothing
- Performance API: `performance.now()` returns milliseconds since page load; `Date.now()` returns Unix timestamp

## Practice Questions
**Q:** How do you pause code execution at a specific line in Chrome DevTools without modifying source files?
**A:** Set a breakpoint by clicking the line number in the Sources panel. Or add a conditional breakpoint by right-clicking the line number and specifying a condition. Logpoints can be added the same way to log without pausing.

**Q:** A developer in a production LWC org is seeing 500ms load times on a component that shows account data. Which DevTools panel helps diagnose if it's a slow Apex call?
**A:** The Network panel. Filter by XHR/Fetch, find the Apex calls, and check the Timing tab for each request. High TTFB (Time To First Byte) indicates a slow Apex query; high download time indicates large payload.

**Q:** What is the difference between a breakpoint and a logpoint?
**A:** A breakpoint pauses code execution at the specified line, allowing inspection of variables and the call stack. A logpoint logs a message to the console when the line is reached without pausing execution. Logpoints are useful for debugging production code behavior without stopping execution.
