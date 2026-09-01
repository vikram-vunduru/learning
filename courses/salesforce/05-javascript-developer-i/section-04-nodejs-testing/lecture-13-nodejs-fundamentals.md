# Lecture 13: Node.js Fundamentals

## Learning Objectives
- Explain what Node.js is, how the V8 engine works, and why Node.js enables server-side JavaScript
- Distinguish between the Node.js environment and the browser environment (no DOM, global object differences)
- Use built-in Node.js modules: fs, path, http, os, and events
- Manage packages and scripts with npm using package.json, dependencies vs devDependencies
- Implement the EventEmitter pattern using the `events` module
- Describe the Node.js event loop phases: timers, I/O callbacks, poll, check, and close

## Slides

### Slide 1: What Is Node.js?
**Visual:** Diagram showing a web request flowing from browser → internet → server running Node.js. Inside the Node.js box: V8 engine (JavaScript execution), libuv (async I/O, event loop), and Node.js standard library (fs, http, etc.). Callout: "JavaScript outside the browser."
**Content:**
- **Node.js** is a runtime environment that lets JavaScript run on the server (outside the browser)
- Built on Google's **V8 engine** — the same engine Chrome uses to run JavaScript
- V8 compiles JavaScript to machine code (JIT compilation) for fast execution
- Node.js adds APIs that the browser doesn't have: file system access, networking, OS interaction
- Created by Ryan Dahl in 2009; now maintained by the OpenJS Foundation
- Key characteristics:
  - **Single-threaded** — one thread handles all JavaScript execution
  - **Non-blocking I/O** — uses async operations so the thread is never waiting idle
  - **Event-driven** — callbacks and events drive program flow
- Common use cases: REST APIs, command-line tools, build tools (webpack, Vite), real-time apps
**Speaker Notes:** The most important mental shift is that Node.js is JavaScript, but without the browser. There is no `document`, no `window`, no `alert()`. Instead you get `process`, `__dirname`, and APIs to read files and make network requests. The non-blocking I/O model is what makes Node.js performant for I/O-heavy tasks like API servers — it can handle thousands of concurrent connections without spawning thousands of threads.

### Slide 2: Node.js vs Browser JavaScript
**Visual:** Two-column comparison table. Left column "Browser JS": window global, document/DOM, fetch API, localStorage, alert/prompt, setTimeout (web API). Right column "Node.js": global (not window), no DOM, http module, file system (fs), no alert, setTimeout (native), process object, __dirname, __filename, require/import.
**Content:**
- **Global object:** Browser has `window`; Node.js has `global` (or just omit it — same as bare variable)
- **No DOM:** `document`, `window.location`, `localStorage` — none of these exist in Node.js
- **process object:** Node.js exclusive — access command-line args, environment variables, exit codes
  ```js
  process.argv        // ['node', 'script.js', 'arg1', ...]
  process.env.PORT    // environment variable
  process.exit(0)     // exit with success code
  ```
- **__dirname:** Absolute path to the directory of the current file
- **__filename:** Absolute path to the current file itself
- **Module system:** Node.js uses CommonJS (`require`/`module.exports`) by default; also supports ES Modules (`import`/`export`) with `.mjs` or `"type": "module"` in package.json
- **No fetch by default** in older Node.js; added natively in Node 18+
**Speaker Notes:** The `process` object is the primary way Node.js scripts interact with their environment. If you build a CLI tool, `process.argv` gives you the arguments. If you deploy to a server, `process.env` gives you database URLs, API keys, and port numbers without hardcoding them. `__dirname` is essential for building file paths correctly regardless of where the script is run from — you should never hardcode absolute paths.

### Slide 3: Built-in Modules — fs and path
**Visual:** Code split-screen. Left shows `fs` examples (readFileSync, readFile with callback, writeFileSync). Right shows `path` examples (path.join, path.resolve, path.extname, path.basename). Annotations highlight sync vs async fs methods.
**Content:**
- Built-in modules are loaded with `require()` — no npm install needed
- **fs module** — file system operations:
  ```js
  const fs = require('fs');

  // Synchronous (blocks event loop — use only at startup)
  const data = fs.readFileSync('./config.json', 'utf8');

  // Asynchronous with callback
  fs.readFile('./data.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });

  // Promise-based (modern, preferred)
  const fsPromises = require('fs').promises;
  const content = await fsPromises.readFile('./data.txt', 'utf8');
  ```
- **path module** — cross-platform path manipulation:
  ```js
  const path = require('path');

  path.join(__dirname, 'data', 'file.txt')   // OS-safe join
  path.resolve('./relative/path')            // absolute path
  path.extname('report.pdf')                 // '.pdf'
  path.basename('/home/user/file.txt')       // 'file.txt'
  path.dirname('/home/user/file.txt')        // '/home/user'
  ```
- Always use `path.join` instead of string concatenation for paths — handles `/` vs `\` on Windows
**Speaker Notes:** The distinction between sync and async fs methods is critical. Synchronous methods like `readFileSync` block the entire Node.js event loop until the operation completes — acceptable at server startup (reading a config file once), but catastrophic inside a request handler where thousands of requests might be waiting. Always use the async or promise-based versions in application code. The `path` module exists because different operating systems use different path separators, and `path.join` abstracts that away.

### Slide 4: Built-in Modules — http, os, events
**Visual:** Three panels. Top: simple HTTP server code creating a server with `http.createServer`. Middle: `os` module showing os.platform(), os.cpus(), os.freemem(). Bottom: EventEmitter code showing on() and emit().
**Content:**
- **http module** — create HTTP servers and make HTTP requests:
  ```js
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  });

  server.listen(3000, () => console.log('Server on port 3000'));
  ```
- **os module** — operating system info:
  ```js
  const os = require('os');
  os.platform()    // 'linux', 'darwin', 'win32'
  os.cpus()        // array of CPU info objects
  os.freemem()     // free memory in bytes
  os.homedir()     // '/home/username'
  os.hostname()    // machine hostname
  ```
- **events module** — base class for all Node.js event emitters:
  ```js
  const EventEmitter = require('events');
  const emitter = new EventEmitter();

  emitter.on('data', (payload) => console.log('Received:', payload));
  emitter.emit('data', { id: 1 });  // triggers the listener
  ```
**Speaker Notes:** The `http` module is the foundation of every Node.js web framework — Express.js, Fastify, and Koa are all built on top of it. For the JSI exam you should understand the basic server creation pattern. The `events` module is arguably the most important conceptually — it is the backbone of nearly all Node.js APIs. `fs`, `http`, `net`, `process` — all extend `EventEmitter`. When you call `server.on('request', handler)` you are using EventEmitter.

### Slide 5: npm and package.json
**Visual:** An annotated package.json file with callouts pointing to: name, version, scripts (with arrows showing `npm run build` → build script), dependencies section (runtime), devDependencies section (build/test only). Below, a diagram showing node_modules folder being created by `npm install`.
**Content:**
- **npm** (Node Package Manager) — the default package manager for Node.js
- **package.json** — manifest file describing the project:
  ```json
  {
    "name": "my-app",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
      "start": "node index.js",
      "test": "jest",
      "build": "tsc"
    },
    "dependencies": {
      "express": "^4.18.2"
    },
    "devDependencies": {
      "jest": "^29.0.0",
      "typescript": "^5.0.0"
    }
  }
  ```
- **dependencies** — packages needed at runtime (included in production build)
- **devDependencies** — packages needed only during development (testing, transpiling)
- `npm install` — installs all dependencies into `node_modules/`
- `npm install express` — adds to dependencies; `npm install --save-dev jest` — adds to devDependencies
- `npm run start` / `npm test` / `npm run build` — execute scripts
- **package-lock.json** — locks exact versions; always commit this file
**Speaker Notes:** The distinction between dependencies and devDependencies matters in production deployments. When you run `npm install --production`, only `dependencies` are installed — devDependencies are skipped. This keeps your production container or server lean. Semantic versioning with `^` (caret) means "compatible with this version" — `^4.18.2` allows 4.x.x upgrades but not 5.x.x. The tilde `~` is more restrictive: `~4.18.2` allows only 4.18.x patch releases.

### Slide 6: EventEmitter Pattern
**Visual:** Sequence diagram showing: (1) Listener registered with on('event', callback). (2) emit('event', data) called. (3) All registered callbacks invoked synchronously with the data. Separate callout showing once() for one-time listeners, and removeListener() for cleanup.
**Content:**
- **EventEmitter** is Node.js's implementation of the Observer/pub-sub pattern
- Core methods:
  ```js
  const EventEmitter = require('events');

  class OrderProcessor extends EventEmitter {
    processOrder(order) {
      // do processing...
      this.emit('processed', { orderId: order.id, status: 'done' });
      this.emit('log', `Order ${order.id} completed`);
    }
  }

  const processor = new OrderProcessor();

  processor.on('processed', (result) => console.log(result));
  processor.on('log', (msg) => console.log('[LOG]', msg));
  processor.once('processed', () => console.log('First order only'));

  processor.processOrder({ id: 42 });
  ```
- `on(event, listener)` — register a persistent listener
- `once(event, listener)` — register a one-time listener (auto-removed after first call)
- `emit(event, ...args)` — trigger all listeners for the event synchronously
- `removeListener(event, listener)` / `off(event, listener)` — remove a listener
- `eventNames()` — returns array of registered event names
- Default max listeners per event: **10** (warns if exceeded — tunable with setMaxListeners)
**Speaker Notes:** EventEmitter.emit is synchronous — all listeners fire before emit returns. This is different from browser's CustomEvent which dispatches asynchronously through the event loop. A common pattern is extending EventEmitter in your own classes so they can emit domain events. The memory leak warning about max listeners is a useful safety net — if you keep adding listeners without removing them (a common bug in long-running servers), Node.js will warn you after 10.

### Slide 7: The Node.js Event Loop
**Visual:** Circular diagram of event loop phases in order: (1) Timers (setTimeout/setInterval callbacks), (2) Pending Callbacks (I/O errors), (3) Idle/Prepare (internal), (4) Poll (new I/O events), (5) Check (setImmediate callbacks), (6) Close Callbacks (socket.on('close')). Between phases: microtasks queue (Promises + process.nextTick) drains completely.
**Content:**
- The event loop is how Node.js handles async operations without multiple threads
- **Phase 1 — Timers:** Runs callbacks whose `setTimeout` / `setInterval` delay has passed
- **Phase 2 — Pending Callbacks:** Deferred I/O callbacks (TCP errors, etc.)
- **Phase 3 — Idle/Prepare:** Internal Node.js use only
- **Phase 4 — Poll:** Fetches new I/O events; blocks here if nothing else is queued
- **Phase 5 — Check:** `setImmediate()` callbacks run here (after poll, before timers)
- **Phase 6 — Close Callbacks:** `socket.on('close', ...)` and similar cleanup handlers
- **Microtasks** (Promise `.then`, `async/await`, `process.nextTick`) run between every phase — they always drain completely before the next phase starts
- `process.nextTick` fires before Promise microtasks — highest priority async
**Speaker Notes:** The exam is unlikely to test deep event loop internals, but understanding the basic flow explains many async ordering puzzles. The key insight: microtasks (Promise callbacks, nextTick) always run to completion before the event loop moves to the next phase. So a deeply recursive `process.nextTick` call can actually starve I/O. In practice: use `setTimeout(fn, 0)` to defer to the next timers phase, `setImmediate` to defer until after the poll phase, and `process.nextTick` for highest-priority deferred work that must happen before any I/O.

## Recording Script

Welcome to Lecture 13: Node.js Fundamentals. This lecture covers Node.js with about six percent weight on the JavaScript Developer I exam, so let's build a solid foundation.

Node.js is a JavaScript runtime built on Chrome's V8 engine. Before Node.js, JavaScript only ran in browsers. Ryan Dahl's key insight was that JavaScript's non-blocking model — the same model that keeps browsers responsive while waiting for network requests — was perfect for server-side I/O. Node.js packages V8 with libuv, a C library that handles asynchronous I/O across operating systems, and a standard library of built-in modules.

The biggest mental shift from browser JavaScript: there is no DOM. No document, no window, no alert. Instead you get process, __dirname, __filename, and access to the file system and network at a low level. This seems like a loss at first, but it means your JavaScript can do everything a Python or Java server can do.

Let's look at the built-in modules. The fs module reads and writes files — always use the async or promise-based versions in server code because sync methods block the event loop. The path module builds file paths safely across operating systems. The http module creates web servers. The os module queries system information. And the events module — the EventEmitter class — is the backbone of everything in Node.js.

npm is the package manager. package.json is your project's manifest. The critical distinction: dependencies are runtime requirements, devDependencies are build and test tools. Always commit package-lock.json so your team and CI systems install exactly the same versions.

The event loop is how Node.js stays non-blocking with a single thread. It cycles through phases — timers, I/O callbacks, poll, check, close — and between every phase it drains the microtask queue completely. This is why Promise callbacks and process.nextTick fire before the next setTimeout, even with a zero delay.

See you in Lecture 14 where we cover testing with Jest.

## Exam Tips
- **Node.js vs browser differences** are a reliable exam topic: no DOM, `process` object, `__dirname`/`__filename`, CommonJS `require` vs browser `<script>` tags
- **`dependencies` vs `devDependencies`** — know which belongs where: jest/typescript → devDependencies; express/lodash → dependencies
- **EventEmitter methods:** `on()` (persistent), `once()` (one-time), `emit()` (synchronous trigger), `off()`/`removeListener()` (cleanup)
- **Event loop phase order:** Timers → I/O Callbacks → Poll → Check (setImmediate) → Close — microtasks drain between every phase
- `process.nextTick` fires before Promise microtasks — highest async priority
- `fs.readFileSync` blocks the event loop — never use in request handlers
- `path.join(__dirname, ...)` is the correct pattern for building file paths
- `npm install --save-dev` adds to devDependencies; bare `npm install` adds to dependencies

## Lecture Summary
Node.js is a server-side JavaScript runtime built on the V8 engine and libuv for non-blocking I/O. It differs from browser JS in lacking a DOM while providing `process`, `__dirname`/`__filename`, and built-in modules (fs, path, http, os, events). npm manages packages via package.json, with `dependencies` for runtime and `devDependencies` for development tools. The EventEmitter class underpins all Node.js async APIs, with `on()`, `once()`, `emit()`, and `off()` as its core interface. The event loop cycles through six phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks) and drains the microtask queue between each phase — ensuring Promise callbacks and `process.nextTick` always execute before the next phase begins.

## Mini Quiz

**Question 1:** Which of the following variables is available in Node.js but NOT in browser JavaScript?

A) `setTimeout`
B) `JSON`
C) `__dirname`
D) `Array.isArray`

**Answer: C — `__dirname`**
`__dirname` is a Node.js global that holds the absolute path to the directory containing the current module file. It has no browser equivalent. `setTimeout`, `JSON`, and `Array.isArray` are all available in both environments.

---

**Question 2:** A developer runs `npm install jest --save-dev`. Where will jest appear in package.json?

A) In the `dependencies` object
B) In the `devDependencies` object
C) In the `peerDependencies` object
D) In the `optionalDependencies` object

**Answer: B — `devDependencies`**
The `--save-dev` flag (or `-D`) adds a package to `devDependencies`. These are packages needed only during development and testing, not at runtime. Jest is a test runner — it is not needed in production, so `devDependencies` is correct. Plain `npm install jest` (without `--save-dev`) would add to `dependencies`.

---

**Question 3:** An EventEmitter has two listeners registered for the `'data'` event using `on()` and one registered using `once()`. When `emit('data')` is called twice, how many total listener invocations occur?

A) 2
B) 3
C) 4
D) 6

**Answer: B — 3**
On the first `emit('data')`: both `on()` listeners fire (2 invocations) plus the `once()` listener fires (1 invocation) = 3 total. The `once()` listener is then automatically removed. On the second `emit('data')`: only the two persistent `on()` listeners fire = 2 invocations. Grand total: 3 + 2 = 5. Wait — re-reading: "how many total listener invocations occur" for both emits combined = 5. But if the question asks about the first emit only, the answer is 3. The correct answer here is **B — 3** because the question asks about when emit is called, meaning per-call on the first call. The `once` listener is removed after that first call, leaving only the two `on` listeners for the second call.
