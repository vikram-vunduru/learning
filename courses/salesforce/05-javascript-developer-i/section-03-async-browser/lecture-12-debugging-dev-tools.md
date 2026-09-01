# Lecture 12: Debugging and Browser Developer Tools

## Learning Objectives
- Navigate the Console, Sources, Network, and Performance tabs of browser DevTools
- Use the full range of console methods: log, warn, error, table, group, time/timeEnd, and assert
- Set line breakpoints, conditional breakpoints, and logpoints in the Sources panel
- Inspect the call stack and scope chain during a paused debugging session
- Explain what source maps are and why they are needed for debugging minified code
- Read the Network tab to identify XHR requests, inspect headers and payloads, and interpret the timing waterfall
- Interpret a Performance tab flame chart to identify long tasks and main-thread bottlenecks

## Slides

### Slide 1: DevTools Overview — The Four Key Tabs
**Visual:** Browser DevTools screenshot with four tabs highlighted in sequence: Console (yellow), Sources (blue), Network (green), Performance (orange). Each has a one-sentence caption describing its primary purpose.
**Content:**
- **Open DevTools:** F12 / Cmd+Option+I (Mac) / Right-click → Inspect
- **Console tab** — JavaScript REPL; view errors, warnings, logs; run arbitrary JS expressions
- **Sources tab** — view and debug JS files; set breakpoints; inspect scope and call stack; edit files temporarily
- **Network tab** — monitor all HTTP requests (XHR, fetch, images, scripts, stylesheets); inspect headers, payloads, and timing
- **Performance tab** — record and analyze runtime performance; flame charts, long tasks, main-thread blocking
- Additional tabs worth knowing: **Elements** (live DOM inspector), **Application** (localStorage, sessionStorage, cookies, service workers), **Memory** (heap snapshots, allocation profiling)
- In Salesforce: Salesforce Inspector, Chrome extensions, and the `$A.getComponent()` trick for Aura debugging; for LWC use standard DevTools
**Speaker Notes:** The exam specifically mentions developer tools as approximately 3% of the exam plus an additional 5% covering the debugging process. These tools are tested at a conceptual level — know what each tab does and what information it exposes. In Salesforce development, the Network tab is particularly valuable for debugging Apex REST calls, LWC wire service responses, and failed callouts in the browser.

### Slide 2: The Console — Beyond console.log
**Visual:** DevTools Console panel screenshot showing different log levels with color coding (log = white, warn = yellow/triangle, error = red/X), then a console.table output, and a console.group example showing nested indented output.
**Content:**
- `console.log(value, ...)` — general output; supports `%s`, `%d`, `%o` format specifiers, or template strings
- `console.warn(msg)` — yellow warning with call stack; does not throw
- `console.error(msg)` — red error with call stack; does not throw
- `console.table(arrayOrObject)` — renders data in a sortable table format; ideal for arrays of objects
- `console.group(label)` / `console.groupEnd()` — collapsible grouped output
- `console.time(label)` / `console.timeEnd(label)` — measures elapsed time between calls; uses high-resolution timer
- `console.assert(condition, msg)` — logs `msg` only if `condition` is falsy; silent when true
  ```js
  console.assert(user.id !== undefined, 'User must have an id', user);
  ```
- `console.count(label)` / `console.countReset(label)` — counts how many times a label is logged
- `console.trace()` — logs the current call stack without throwing
**Speaker Notes:** console.table is a wildly underused tool that turns arrays of objects into a readable tabular format — perfect for debugging collections of records. Console.time/timeEnd is a quick way to benchmark a code path without full Performance tab overhead. Console.assert is useful for lightweight invariant checking during development — it behaves like an assertion that doesn't break production code since it only logs and never throws. Remember: console methods in production code should be removed or replaced with a proper logging utility, as they expose data in the browser's console.

### Slide 3: The debugger Statement and Breakpoints
**Visual:** Sources panel screenshot showing: (1) a line breakpoint (blue dot on a line number), (2) a conditional breakpoint (orange dot with a condition expression tooltip), (3) a logpoint (pink diamond icon), and (4) the `debugger` statement in code with an annotation showing it pauses exactly like a breakpoint.
**Content:**
- `debugger;` statement — pauses execution when DevTools is open; ignored when DevTools is closed
  ```js
  function processPayment(amount) {
    debugger; // execution pauses here in DevTools
    return amount * 1.1;
  }
  ```
- **Line breakpoints:** Click a line number in the Sources panel to toggle a blue dot; execution pauses before that line
- **Conditional breakpoints:** Right-click a line number → "Add conditional breakpoint"; pauses only when the expression evaluates to truthy
  ```
  condition: userId === 'abc123' && amount > 500
  ```
- **Logpoints:** Right-click → "Add logpoint"; logs a message to console without pausing; great for production-like debugging
- Breakpoint categories in the sidebar: DOM breakpoints, XHR/Fetch breakpoints, Event listener breakpoints
- XHR breakpoints: pause execution whenever a URL matching a pattern is requested
**Speaker Notes:** The debugger statement is the most universally supported debugging technique — it works in all browsers, Node.js, and any DevTools-aware runtime. Conditional breakpoints are essential when a bug only manifests on a specific iteration of a loop or a specific user ID — you don't want to click "Resume" five hundred times. Logpoints are a newer feature that let you add console output without modifying your source code — very useful in situations where you can't or don't want to change the file.

### Slide 4: Call Stack and Scope Panel
**Visual:** Sources panel debugging screenshot with the call stack panel on the right showing 4 frames (function names and line numbers), and the scope panel below it showing Local variables with current values, with an annotation explaining the difference between Local, Closure, and Global scopes.
**Content:**
- When execution is paused (breakpoint or debugger), the right panel shows:
  - **Call Stack** — ordered list of active function calls; top = currently executing, bottom = initial entry point
  - **Scope** — variables accessible at the current pause point, organized by: Local (current function), Closure (captured from outer functions), Module, and Global
- **Step controls:**
  - **Resume (F8):** Continue execution until the next breakpoint
  - **Step Over (F10):** Execute the current line; if it's a function call, run it without entering
  - **Step Into (F11):** Enter the function called on the current line
  - **Step Out (Shift+F11):** Complete the current function and pause on return
- Hover over any variable while paused to see its current value in a tooltip
- **Watch panel:** Add expressions to monitor across steps
**Speaker Notes:** The call stack in DevTools is a live view of what you'd mentally trace through code. Learning to read it quickly — understanding that the topmost frame is where you are and the frames below are how you got there — is one of the highest-value debugging skills. The step controls are keyboard-first: F8 to resume, F10 to step over, F11 to step into. Step into is what you use when you want to follow execution into a function. Step out is what you use when you've stepped into something and realize you need to escape back to the caller.

### Slide 5: Source Maps
**Visual:** Pipeline diagram: Source TypeScript/ES6+ file → bundler (Webpack/Rollup) → minified bundle.js → browser. An arrow labeled "source map (.map file)" bridges the minified code back to the original source. DevTools panel shows readable original source while debugging the minified file.
**Content:**
- **Source maps** — files (.map extension) that map positions in minified/transpiled code back to original source
- Generated by bundlers (Webpack, Rollup, esbuild) and transpilers (Babel, TypeScript compiler)
- When DevTools finds a source map, it shows you the original source in the Sources panel — you can set breakpoints in the readable code
- Source map format: referenced at the bottom of a JS file: `//# sourceMappingURL=bundle.js.map`
- In production: typically disable source map availability to avoid exposing source code to users
- In Salesforce static resources: LWC is compiled and source maps help debug component issues in experience cloud or community pages
- Without source maps: debugging a minified one-liner is nearly impossible — all variables are renamed to `a`, `b`, etc.
**Speaker Notes:** Source maps are often invisible because they work automatically when present. The key concept to know for the exam is what they do: they allow DevTools to present readable source code to the developer while the browser runs minified code. TypeScript developers depend on source maps constantly — without them, TypeScript errors in the browser would point to line 1 of a minified file, not to the TypeScript source. In the Salesforce platform, the LWC compiler generates its own output, and for debugging Salesforce-managed components, source maps help you navigate the generated code.

### Slide 6: Network Tab — XHR, Headers, and Timing
**Visual:** Network tab screenshot with annotations: (1) filter bar showing XHR/Fetch filter active, (2) a row in the request list with status code, size, and time columns, (3) expanded request showing Headers sub-tab and Response sub-tab side by side.
**Content:**
- **Filter by type:** All, Fetch/XHR, JS, CSS, Img, Media, WS (WebSocket) — click to filter the request list
- **Request row columns:** Name, Status (HTTP code), Type, Initiator (which code triggered it), Size (bytes), Time (total duration)
- **Clicking a request opens detail panels:**
  - **Headers:** Request/response headers; URL; request method; status code
  - **Payload:** Request body (POST data, JSON)
  - **Response:** Response body — raw or parsed JSON
  - **Timing:** Waterfall breakdown: DNS Lookup, TCP Connection, SSL/TLS, TTFB (Time to First Byte), Content Download
- Preserve log: checkbox to keep requests across page navigations — essential for debugging redirects
- Disable cache: checkbox forces fresh requests — always check this when debugging cache-related issues
- **Throttling:** Simulate Slow 3G or Fast 4G to test performance on poor connections
**Speaker Notes:** The Network tab is your window into what your app is actually doing on the wire. For Salesforce developers, this is where you verify that Apex REST endpoints are receiving the correct payload, check response JSON structure, and diagnose 401/403 authentication errors. TTFB (Time to First Byte) is the metric that tells you how long the server took to start responding — high TTFB indicates a server-side performance problem, while high Content Download indicates a payload size problem.

### Slide 7: Performance Tab — Flame Charts and Long Tasks
**Visual:** Performance tab screenshot with three labeled sections: the timeline bar at the top (showing FPS and CPU activity), the Main thread flame chart below (showing stacked function call bars), and a Bottom-Up tab showing total time per function. A red block labeled "Long Task" is highlighted.
**Content:**
- **Record a performance profile:** Click Record, interact with the page, click Stop
- **Flame chart** — visual representation of the call stack over time; wider = more time; height = call depth
  - Read it: each bar is a function; bars stacked above are the callers above it in the call stack
  - Hover over a bar to see function name, file, duration
- **Long Tasks** — blocks of main-thread work exceeding 50ms; marked in red; blocks rendering and user interaction
- **Main thread sections:** Tasks, Scripting (JS execution), Rendering (style/layout/paint), Painting, Idle
- **Key metrics visible:** Frames per second (FPS drops indicate jank), Total Blocking Time (TBT), main-thread activity
- **Bottom-Up / Call Tree tabs:** Sort by self time or total time to find the most expensive function
- For Salesforce: Performance profiling of LWC renderedCallback loops and wired data processing overhead
**Speaker Notes:** You don't need to be a performance expert for the exam, but know the basics: what a flame chart shows, what a Long Task is (anything over 50ms that blocks the main thread), and why that matters (the browser can't respond to user input during a Long Task). The FPS chart at the top of the Performance recording tells you at a glance where animations or interactions were janky. For real Salesforce development, the Performance tab is invaluable for diagnosing why a complex LWC page feels sluggish.

### Slide 8: Debugging Workflow and Exam Quick Reference
**Visual:** Decision flowchart: "Bug observed?" → "Check Console for errors" → "Network tab: is the data arriving correctly?" → "Sources: set breakpoint, inspect scope" → "Performance: is a function taking too long?". Quick reference card lists all tools with one-line descriptions.
**Content:**
- **Systematic debugging workflow:**
  1. Console — check for thrown errors and warnings
  2. Network — verify requests are being made, payloads are correct, responses are as expected
  3. Sources — pause execution with breakpoints, inspect call stack and scope
  4. Performance — identify slow functions and long tasks
- **console cheatsheet:** log (info), warn (caution), error (failure), table (arrays of objects), time/timeEnd (benchmark), assert (guard), trace (stack dump)
- **Breakpoint cheatsheet:** Line (click gutter), Conditional (right-click → condition), Logpoint (right-click → logpoint), `debugger` keyword, XHR break on URL pattern
- **Source maps:** .map files bridge minified code to readable source; generated by bundlers/transpilers
- **Network key columns:** Status (HTTP code), TTFB (server latency), Size (payload), Initiator (which script)
- **Performance key concepts:** Flame chart = call stack over time; Long Task = >50ms main-thread block; use Bottom-Up for hot functions
**Speaker Notes:** This workflow is how experienced developers approach any unknown bug. Start with the Console to see if there's already an error message. Move to the Network tab if the issue seems data-related. Use the Sources debugger if the data looks right but the behavior is wrong — step through the code to watch what's happening. The Performance tab is for when everything works correctly but feels slow. Each tool answers a specific class of question, and knowing which tool to reach for first saves enormous debugging time.

## Recording Script
Welcome to Lecture 12, our final lecture in Section 3. Today we cover browser developer tools — the professional's toolkit for understanding and debugging JavaScript.

Every modern browser ships with DevTools. Open them with F12 or Cmd+Option+I on a Mac. There are four tabs you need to know deeply: Console, Sources, Network, and Performance.

The Console tab is a full JavaScript REPL and logging output panel. You already know console.log, but there's a lot more. console.warn prints a yellow warning with a stack trace. console.error prints a red error. Neither throws an exception — they just log. console.table takes an array of objects and renders it as a sortable table, which is fantastic for visualizing arrays of records. console.time and console.timeEnd let you measure how long a block of code takes. console.assert logs a message only when a condition is false — useful for lightweight invariant checks. console.group and groupEnd let you create collapsible sections.

The Sources tab is your debugger. You can set a breakpoint by clicking a line number — a blue dot appears and execution pauses before that line. Right-click to add a conditional breakpoint that only pauses when an expression is truthy — critical for loops with hundreds of iterations. You can also add a logpoint, which prints to the console without pausing. In code, you can write the `debugger;` statement and it has the same effect as a breakpoint — when DevTools is open, execution stops there.

When paused, look at the right panel. The call stack shows you exactly how execution got to this point — every active function frame. The scope panel shows you the variables available in the current scope: local, closure, module, and global. Use the step controls to move through code one line at a time, step into functions, or step out back to the caller.

Source maps deserve a mention. When you build for production, JavaScript is minified — variable names are mangled to single letters and everything is on one line. Source maps are files that map positions in the minified code back to the original source. When DevTools finds a source map, it presents your original readable code and lets you debug that instead of the minified version. They work automatically and transparently.

The Network tab shows every HTTP request the browser makes. Filter by XHR/Fetch to see only your API calls. Click a request to inspect its headers, request payload, and response body. The timing waterfall inside each request shows DNS lookup, TCP connection, SSL handshake, time to first byte, and content download — each phase is a diagnostic signal about where a request is slow.

The Performance tab is for when things feel slow. Record a session, interact with the page, stop recording. You get a flame chart — a stacked visualization of the call stack over time. The width of each bar is proportional to how long that function ran. Long Tasks are highlighted in red: any block of main-thread work over 50ms prevents the browser from handling user input, which causes the page to feel unresponsive. Use the Bottom-Up tab to sort by total time and find the most expensive functions.

The exam weights this topic at around 8 percent combined — 3 percent for developer tools knowledge and 5 percent for the debugging process. Know what each tab does, know the console methods, know what source maps are, and understand what a Long Task means in the Performance panel.

That wraps up Section 3. Section 4 moves into JavaScript patterns, classes, modules, and how these concepts map to Salesforce LWC development in depth.

## Exam Tips
- **Console methods tested:** `log`, `warn`, `error`, `table` (arrays of objects), `time`/`timeEnd` (benchmark), `assert` (logs only when condition is falsy), `trace` (call stack dump).
- `debugger;` statement pauses execution only when DevTools is open; it is silently ignored otherwise.
- **Conditional breakpoints** pause only when a specified expression is truthy — no need to step through hundreds of loop iterations.
- **Source maps** bridge minified/transpiled output back to readable original source; generated by bundlers (Webpack, esbuild) and transpilers (TypeScript, Babel).
- Network tab: TTFB (Time to First Byte) = server latency. "Disable cache" forces fresh requests during debugging. "Preserve log" keeps requests visible across navigation.
- Performance tab: **flame chart** = call stack over time (width = duration, height = call depth). **Long Task** = main-thread work >50ms; blocks rendering and user input.
- Exam weight: ~3% developer tools + ~5% debugging process = ~8% combined.
- For Salesforce LWC debugging: use `this.template.querySelector()`, standard DevTools, and the Network tab for wire service / Apex callout inspection.

## Lecture Summary
Browser DevTools provides four core panels: Console (logging and REPL), Sources (breakpoints, call stack, scope inspection), Network (request/response inspection, timing waterfall), and Performance (flame chart, Long Task identification). The full console API goes well beyond log — warn, error, table, time/timeEnd, assert, and group each serve distinct diagnostic purposes. Breakpoints can be line-based, conditional, or logpoint-based; the `debugger` statement provides the same pause in code. Source maps are generated by bundlers and transpilers to make minified code debuggable in its original form. The Network tab's timing waterfall exposes per-phase HTTP latency, while the Performance tab's flame chart reveals main-thread bottlenecks exceeding the 50ms Long Task threshold.

## Mini Quiz

**Q1:** A developer wants to measure how long a specific function takes to run. Which console API is most appropriate?
A) `console.log(Date.now())` before and after, then calculate the difference manually
B) `console.time('label')` before the function call and `console.timeEnd('label')` after
C) `console.assert()` with a time-based condition
D) `console.trace()` to see the call stack duration
**Answer:** B — `console.time('label')` starts a named high-resolution timer, and `console.timeEnd('label')` stops it and logs the elapsed time automatically. It's the built-in benchmarking API. Option A works but is manual and less precise. `console.assert` and `console.trace` serve different purposes.

**Q2:** A developer pauses execution at a breakpoint in a loop that runs 1,000 times. The bug only occurs when the loop variable `i` equals 500. What is the most efficient debugging approach?
A) Click Resume 499 times to reach iteration 500
B) Add a conditional breakpoint with the condition `i === 500`
C) Add `if (i === 500) { console.log('here'); }` to the source code
D) Use the Performance tab to profile which iteration is slowest
**Answer:** B — A conditional breakpoint pauses execution only when the specified expression evaluates to truthy (`i === 500`), skipping all other iterations automatically. Option A is impractical. Option C requires modifying source code and is harder to remove. Option D is for performance analysis, not conditional stopping.

**Q3:** What does a "Long Task" indicate in the browser Performance tab?
A) A network request that took more than 50 milliseconds to complete
B) A JavaScript function that took more than 50 milliseconds on the main thread, blocking rendering and input
C) A CSS animation that ran for more than one second
D) A memory allocation that exceeded the heap threshold
**Answer:** B — A Long Task is a block of main-thread JavaScript (or other scripting/rendering work) that takes longer than 50 milliseconds. During this time, the browser cannot process user interactions or render new frames, causing perceived jank or unresponsiveness. It is not related to network requests, CSS animations, or memory allocation directly.
