# Lecture 10: Async JavaScript — Promises and async/await

## Learning Objectives
- Describe the JavaScript call stack, event loop, and task queue and explain why JavaScript is non-blocking despite being single-threaded
- Explain the callback pattern and articulate why deeply nested callbacks ("callback hell") create maintenance problems
- Describe the three Promise states and chain .then(), .catch(), and .finally() handlers
- Use Promise.all(), Promise.race(), Promise.allSettled(), and Promise.any() to coordinate multiple Promises
- Write async functions and use await to pause execution while a Promise resolves
- Handle errors in async/await code using try/catch/finally blocks

## Slides

### Slide 1: The JavaScript Runtime — Call Stack and Event Loop
**Visual:** Animated-style diagram showing three components side by side: the Call Stack (a stack of frames), the Web APIs box (setTimeout, fetch, DOM events), and the Task Queue (FIFO). Arrows show: (1) async call moves from stack to Web APIs; (2) callback moves from Web APIs to Task Queue when done; (3) event loop moves it to the stack only when the stack is empty.
**Content:**
- JavaScript is **single-threaded** — one call stack, one thing executing at a time
- The **call stack** tracks the currently executing function and its chain of callers
- Synchronous code runs to completion before anything else can execute
- **Web APIs** (browser) or **libuv** (Node.js) handle async operations off the main thread: timers, fetch, DOM events
- When an async operation completes, its callback is placed in the **task queue** (macrotask queue)
- The **event loop** waits for the call stack to be empty, then moves the next item from the task queue onto the stack
- **Microtask queue** (Promises, queueMicrotask) has priority over the task queue — runs after each task, before the next macrotask
**Speaker Notes:** This model is fundamental to understanding all JavaScript async behavior. The key insight is that JavaScript can appear to do multiple things at once but actually never executes two pieces of JavaScript simultaneously. Async operations are delegated to the environment (browser or Node), and their callbacks are only ever run when the stack is empty. This is why a long synchronous loop blocks the UI — it never allows the event loop to process pending callbacks.

### Slide 2: Synchronous vs Asynchronous Execution
**Visual:** Two code panels: left shows synchronous code executing line by line with a numbered trace; right shows setTimeout(fn, 0) with the same numbered trace showing that the callback fires after the synchronous code completes even though the delay is zero.
**Content:**
- Synchronous: each line blocks until the previous completes; predictable top-to-bottom order
- Asynchronous: the operation is started and control returns immediately; result arrives later
  ```js
  console.log('start');
  setTimeout(() => console.log('timeout'), 0);
  console.log('end');
  // Output: start → end → timeout
  ```
- `setTimeout(fn, 0)` does NOT run immediately — the callback is queued as a macrotask
- File I/O, network requests, timers, user interactions — all async in the browser/Node
- **Blocking the event loop** (e.g., a long synchronous loop) freezes the UI — no events are processed while the stack is occupied
**Speaker Notes:** The `setTimeout(fn, 0)` example is one of the most classic JavaScript interview questions. Even with a delay of zero milliseconds, the callback cannot run until the current synchronous execution completes and the call stack is empty. Understanding this is the foundation for understanding why Promises and async/await exist.

### Slide 3: Callbacks and Callback Hell
**Visual:** Pyramid-shaped code block — a series of nested callback functions, each indented further right, labeled "callback hell" with an annotation showing the increasing maintenance cost. Below it, the same logic flattened with a Promise chain.
**Content:**
- Callbacks are functions passed as arguments, called when an async operation completes
- Simple callbacks work fine for a single async operation:
  ```js
  setTimeout(() => console.log('done'), 1000);
  ```
- **Callback hell** — deeply nested callbacks for sequential async operations:
  ```js
  getUser(id, (user) => {
    getOrders(user.id, (orders) => {
      getDetails(orders[0].id, (details) => {
        // ever deeper...
      });
    });
  });
  ```
- Problems: difficult to read, hard to handle errors at each level, no easy way to run in parallel, can't use try/catch for error handling
- Node.js "error-first" callback convention: `(err, result) => {}`
**Speaker Notes:** Callback hell isn't just ugly code — it's a fundamental maintenance problem. Error handling requires adding an if/err check at every level. If you forget one, errors are silently swallowed. Running two async operations in parallel requires manual tracking of a counter to know when both are done. Promises were introduced precisely to solve these problems: they provide a composable, readable way to chain async operations and handle errors in one place.

### Slide 4: Promises — States and Basic Usage
**Visual:** State machine diagram with three nodes: Pending (initial), Fulfilled (success), Rejected (failure). Arrows labeled "resolve(value)" from Pending to Fulfilled and "reject(reason)" from Pending to Rejected. A dashed box shows that both terminal states are "settled" and immutable.
**Content:**
- A Promise is an object representing the eventual completion (or failure) of an async operation
- Three states: **pending** (initial), **fulfilled** (succeeded), **rejected** (failed)
- States are one-way — once settled, a Promise cannot change state
- Creating a Promise:
  ```js
  const p = new Promise((resolve, reject) => {
    // async work...
    if (success) resolve(value);
    else reject(new Error('something went wrong'));
  });
  ```
- `.then(onFulfilled)` — called with the resolved value
- `.catch(onRejected)` — called with the rejection reason (equivalent to `.then(null, onRejected)`)
- `.finally(fn)` — called regardless of outcome; does not receive a value; used for cleanup
**Speaker Notes:** The one-way state transition is important. Once a Promise is resolved with a value, calling reject has no effect — the Promise is immutably settled. This gives Promises a predictable, trustworthy contract. The `.catch()` method is syntactic sugar for `.then(null, handler)` — they are exactly equivalent. `.finally()` is useful for hiding loading spinners or closing connections regardless of whether the operation succeeded or failed.

### Slide 5: Promise Chaining
**Visual:** Chain diagram showing three boxes connected by arrows: `.then(A)` → `.then(B)` → `.catch(C)`. Each .then handler is labeled with its input (previous result) and output (next value). A red arrow shows that a rejection at any point skips to `.catch()`.
**Content:**
- Each `.then()` returns a **new Promise** — this enables chaining
- Return value from a `.then()` callback becomes the input to the next `.then()`
- If you return a Promise from `.then()`, the chain waits for that Promise to resolve
  ```js
  fetch('/api/user')
    .then(response => response.json())    // returns a Promise
    .then(user => user.name)              // receives parsed user
    .then(name => console.log(name))
    .catch(err => console.error(err));    // catches any rejection above
  ```
- A rejection skips all `.then()` handlers until the nearest `.catch()` — like exception propagation
- Returning a rejected Promise or throwing inside `.then()` triggers the `.catch()` handler
- Always add `.catch()` to the end of a chain to avoid unhandled Promise rejections
**Speaker Notes:** The most important thing about Promise chaining is that each `.then()` creates a brand new Promise. You are not modifying a single Promise — you are building a pipeline. The fact that returning a Promise from a `.then()` causes the chain to wait for it is what allows you to sequence async operations without nesting. This is the key advantage over callbacks. Unhandled Promise rejections (no .catch()) are a serious bug pattern — in Node.js they crash the process in newer versions.

### Slide 6: Promise Combinators
**Visual:** Four quadrant diagram, one per combinator: Promise.all (all succeed → array of results; any fail → immediately reject), Promise.race (first settled wins), Promise.allSettled (all settle → array of {status, value/reason}), Promise.any (first fulfilled wins; all reject → AggregateError).
**Content:**
- **Promise.all(iterable):** Resolves when ALL resolve; rejects immediately if ANY reject; result is array in same order as input
  ```js
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  ```
- **Promise.race(iterable):** Resolves/rejects as soon as the FIRST Promise settles (either way)
- **Promise.allSettled(iterable):** Waits for ALL to settle; never rejects; each result is `{status: 'fulfilled', value}` or `{status: 'rejected', reason}`
- **Promise.any(iterable):** Resolves when FIRST one fulfills; rejects only if ALL reject (throws AggregateError)
- Memory aid: all = AND logic; any = OR logic; allSettled = audit/report mode; race = first past the post
**Speaker Notes:** Promise.all is the most commonly used combinator — use it whenever you need to run multiple independent async operations in parallel and wait for all of them. The catch is that one rejection cancels the whole thing. If you need to run multiple operations and handle partial failures gracefully, use Promise.allSettled instead. Promise.race is useful for implementing timeouts — race a fetch against a setTimeout-wrapped rejection. Promise.any is the newest (ES2021) and is useful when you have multiple fallback sources and want the fastest successful result.

### Slide 7: async/await — Syntax and Error Handling
**Visual:** Side-by-side comparison: the same async operation written with .then()/.catch() chaining on the left versus async/await with try/catch on the right, identical logic, with annotations showing correspondence between the two forms.
**Content:**
- `async function` always returns a Promise — return values are automatically wrapped
- `await` pauses execution inside the async function until the awaited Promise settles
- `await` can only appear inside an `async` function — using it at the top level requires a module or top-level await (ES2022)
- Error handling with try/catch — identical semantics to synchronous errors:
  ```js
  async function loadUser(id) {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('Failed to load user:', err);
      throw err; // re-throw if caller needs to handle it
    } finally {
      hideLoadingSpinner();
    }
  }
  ```
- Parallel execution with await: `await Promise.all([a(), b()])` — NOT `await a(); await b()` (that is sequential)
**Speaker Notes:** Async/await is syntactic sugar over Promises — under the hood it's exactly the same. The key mistake developers make is writing `await a(); await b();` thinking it runs in parallel. It does not — each await pauses until the previous resolves, so the two operations are sequential. To run in parallel with async/await, create both Promises first and then await them together using Promise.all. Another important point: you cannot use await outside an async function — it is a syntax error.

### Slide 8: Common Async Pitfalls and Exam Quick Reference
**Visual:** Two-column card: left shows five common mistakes (sequential awaits instead of parallel, unhandled rejections, missing return in .then(), async in forEach, forgetting .json()), right shows the correct pattern for each.
**Content:**
- **Sequential instead of parallel:** `await Promise.all([fetchA(), fetchB()])` not `await fetchA(); await fetchB()`
- **Unhandled rejection:** Always add `.catch()` or use try/catch with async/await
- **forEach with async does not wait:** Use `Promise.all(arr.map(async item => ...))` or a for...of loop
  ```js
  // WRONG - forEach ignores the returned Promises
  items.forEach(async item => await process(item));
  // CORRECT
  await Promise.all(items.map(async item => process(item)));
  ```
- **Missing return in .then():** Without a return, the next .then() receives `undefined`
- **async functions always return a Promise** — even if you return a plain value, it is wrapped
- **await only pauses the async function**, not the entire thread — other code can still run
**Speaker Notes:** The async forEach gotcha is one of the most common real-world bugs and a popular exam question. forEach doesn't care about the return value of its callback, so the Promises returned by async callbacks are created and immediately orphaned — the forEach loop completes before any of the async work is done. Use for...of if you need sequential processing, or Promise.all with map for parallel. The missing return in .then() is a silent bug that produces undefined in the next step — always make sure your .then() callbacks explicitly return the value you want to pass forward.

## Recording Script
Welcome to Lecture 10. Today we cover what I consider the most important topic in this course for real-world development: asynchronous JavaScript.

JavaScript is single-threaded. There is exactly one call stack, and only one thing runs at a time. Yet JavaScript handles network requests, timers, and user events without freezing. How? Through the event loop.

When you make a fetch request or set a timer, the browser's Web APIs handle the actual work off the main thread. When the work finishes, the callback is placed in the task queue. The event loop monitors the call stack — when it's empty, it picks up the next item from the queue and pushes it onto the stack. Promise callbacks go into the microtask queue, which is drained completely after each task before the next macrotask runs.

This explains the classic puzzle: `setTimeout(fn, 0)` logs after `console.log('end')` even though the delay is zero. The callback is queued, the synchronous code runs to completion, the stack empties, and then the event loop delivers the callback.

For a long time, async JavaScript was done with callbacks — passing a function to be called when work completed. Callbacks work fine for a single operation. They become a maintenance nightmare when you chain multiple async operations, because each result requires another nested callback. Error handling breaks down. Testing is difficult. This is callback hell.

Promises fix this. A Promise is an object that represents an eventual value. It starts in the pending state. When the async work succeeds, the Promise is fulfilled with a value. If it fails, it is rejected with a reason. These states are permanent — a settled Promise never changes.

You attach handlers with `.then()`, `.catch()`, and `.finally()`. The power comes from chaining: each `.then()` returns a new Promise whose value is whatever you return from the callback. If you return a Promise, the chain waits for it to settle. Rejections propagate down the chain until a `.catch()` handles them — just like exceptions propagating up a call stack.

When you need multiple async operations to run concurrently, the Promise combinators are your tools. `Promise.all` runs them all and gives you all results in order — but one rejection cancels everything. `Promise.allSettled` runs them all and gives you each outcome regardless of success or failure. `Promise.race` gives you the first result, success or failure. `Promise.any` gives you the first success, and only rejects if everything fails.

Then came async/await. An async function always returns a Promise. Inside it, `await` pauses execution of that function until a Promise resolves — but the rest of the JavaScript runtime is still running. The resulting code looks and reads like synchronous code, and error handling uses familiar try/catch blocks.

The biggest async/await trap: writing `await a(); await b()` makes them sequential — b doesn't start until a finishes. For parallel execution, you must write `await Promise.all([a(), b()])`. Similarly, async callbacks inside forEach are ignored — use `Promise.all(arr.map(async ...))` or a for...of loop instead.

In Lecture 11, we move to the browser environment and the DOM.

## Exam Tips
- JavaScript is **single-threaded** — the event loop processes one task at a time from the task queue. Promises use the **microtask queue**, which drains completely before the next macrotask.
- `setTimeout(fn, 0)` runs AFTER synchronous code in the same block, even with zero delay.
- Promise states: **pending → fulfilled** (via resolve) or **pending → rejected** (via reject). States are **immutable** once settled.
- `.catch(fn)` is exactly equivalent to `.then(null, fn)`.
- `Promise.all` rejects immediately if any Promise rejects. `Promise.allSettled` never rejects — always use it when you need results for all operations regardless of failure.
- `async function` always returns a Promise, even when returning a plain value.
- `await` can only appear inside an `async` function (or at module top level in ES2022).
- `await a(); await b()` is **sequential**. For parallel: `await Promise.all([a(), b()])`.
- `async` inside `forEach` does NOT await the callbacks — use `Promise.all(arr.map(async ...))` or `for...of`.

## Lecture Summary
JavaScript's single-threaded execution model uses the event loop, call stack, and task/microtask queues to handle non-blocking async operations. Callbacks were the original async pattern but suffer from nesting and error-handling problems. Promises represent eventual values with three immutable states, support readable chaining via .then()/.catch()/.finally(), and compose with four combinators (all, race, allSettled, any) for concurrent operations. Async/await is syntactic sugar over Promises that enables synchronous-style code with try/catch error handling; key pitfalls include sequential awaits instead of parallel, async in forEach, and missing returns in .then() chains.

## Mini Quiz

**Q1:** Consider this code:
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
What is the output order?
A) A, B, C, D
B) A, D, B, C
C) A, D, C, B
D) A, C, D, B
**Answer:** C — Synchronous code runs first: A then D. Promise callbacks go into the microtask queue, which drains before the next macrotask. So C (microtask) runs before B (setTimeout macrotask). Output: A → D → C → B.

**Q2:** A developer writes the following:
```js
async function fetchAll(ids) {
  const results = [];
  for (const id of ids) {
    results.push(await fetchOne(id));
  }
  return results;
}
```
What is the behavior, and how could it be improved?
A) The code runs all fetches in parallel — it is already optimal
B) The code runs fetches sequentially; `Promise.all(ids.map(fetchOne))` would run them in parallel
C) The code throws a SyntaxError because await cannot appear in a for...of loop
D) The code is equivalent to `Promise.allSettled(ids.map(fetchOne))`
**Answer:** B — Each `await fetchOne(id)` pauses the loop until that fetch completes before starting the next one — sequential, not parallel. For parallel execution, replace the loop with `return Promise.all(ids.map(fetchOne))`, which starts all fetches simultaneously and resolves when all complete.

**Q3:** Which Promise combinator should a developer use when running three independent API calls and needing to process the result of each one individually, even if some of them fail?
A) `Promise.all()` — resolves with all results
B) `Promise.race()` — resolves with the first result
C) `Promise.allSettled()` — resolves with an array of outcome objects for every Promise
D) `Promise.any()` — resolves with the first successful result
**Answer:** C — `Promise.allSettled()` always resolves (never rejects) and returns an array where each element is either `{status: 'fulfilled', value: ...}` or `{status: 'rejected', reason: ...}`. This lets you inspect and handle each outcome individually. `Promise.all()` would reject immediately on the first failure, discarding the other results.
