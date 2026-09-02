# Async JavaScript — Event Loop, Promises & async/await

## Exam Domain
Asynchronous JavaScript — ~20% of exam weight. High-priority study area.

## Core Concepts

### The Event Loop — How JS Handles Async
JavaScript is single-threaded. "Async" means: defer work, continue, pick it up later.

```
┌──────────────────────────────────────────────────────────────────┐
│                     JavaScript Engine (V8)                        │
│                                                                   │
│  ┌──────────────┐    ┌─────────────────────────────────────────┐ │
│  │  Call Stack  │    │ Web APIs / Node APIs                    │ │
│  │  (sync code) │    │ (setTimeout, fetch, I/O — run outside   │ │
│  │              │    │  the main thread)                       │ │
│  └──────┬───────┘    └───────────┬─────────────────────────────┘ │
│         │                        │ callback registered            │
│         │            ┌───────────▼─────────┐                     │
│         │            │  Microtask Queue     │  ← Promises,        │
│         │            │  (Promise callbacks, │    queueMicrotask   │
│         │            │   MutationObserver)  │    Higher priority  │
│         │            └───────────┬──────────┘                     │
│         │                        │                                 │
│         │            ┌───────────▼─────────┐                     │
│         │            │  Macrotask Queue     │  ← setTimeout,      │
│         │            │  (setTimeout,        │    setInterval,     │
│         │            │   setInterval, I/O)  │    I/O              │
│         │            └───────────┬──────────┘                     │
│         │                        │                                 │
│         ◄────── event loop ───────                                │
│     (when stack is empty,                                         │
│      drain microtask queue first, then ONE macrotask)            │
└──────────────────────────────────────────────────────────────────┘
```

**Execution order: synchronous code → all microtasks → one macrotask → repeat**

```javascript
console.log('1 sync');
setTimeout(() => console.log('4 macro'), 0);
Promise.resolve().then(() => console.log('3 micro'));
console.log('2 sync');
// Output: 1, 2, 3, 4
```

### Promises — Three States
```
┌─────────────────────────────────────────────────────┐
│                     Promise                          │
│                                                      │
│  pending ──► fulfilled  (resolve called) → .then()  │
│     │                                                │
│     └──────► rejected   (reject called)  → .catch() │
│                                                      │
│  .finally() runs regardless of fulfillment or reject │
└─────────────────────────────────────────────────────┘
```

```javascript
// Creating a Promise
const p = new Promise((resolve, reject) => {
    if (condition) resolve(value);   // fulfill
    else reject(new Error('msg'));   // reject
});

// Chaining
fetch('/api/data')
    .then(response => response.json())    // transform
    .then(data => process(data))          // use data
    .catch(err => console.error(err))     // catch ANY error in chain
    .finally(() => setLoading(false));    // always runs
```

### async/await — Synchronous-Looking Async
```javascript
async function loadContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Load failed:', err);
        throw err;  // re-throw so caller can handle
    }
}

// In LWC:
async connectedCallback() {
    this.isLoading = true;
    try {
        const result = await getContacts({ accountId: this.recordId });
        this.contacts = result;
    } catch (err) {
        this.error = err.body?.message ?? err.message;
    } finally {
        this.isLoading = false;
    }
}
```

### Promise Combinators
```javascript
// Promise.all — waits for ALL, fails fast on first rejection
const [contacts, accounts, tasks] = await Promise.all([
    getContacts(id),
    getAccounts(id),
    getTasks(id)
]);
// If any one fails → entire Promise.all rejects

// Promise.allSettled — waits for ALL, reports each outcome
const results = await Promise.allSettled([getContacts(id), getAccounts(id)]);
results.forEach(r => {
    if (r.status === 'fulfilled') use(r.value);
    else logError(r.reason);
});

// Promise.race — first to settle wins
const winner = await Promise.race([fetchFast(), fetchSlow()]);

// Promise.any — first FULFILLED wins (ignores rejections)
const first = await Promise.any([primary(), fallback(), backup()]);
```

### Async Error Propagation
```javascript
// Unhandled rejection — crashes Node.js, warning in browser
async function fail() {
    throw new Error('oops');
}
fail(); // ← No await, no .catch — unhandled rejection!

// Correct:
await fail();        // re-throws in calling async function
fail().catch(err => handle(err));  // handle inline
```

## Architecture / How It Works

### Promise Chain vs async/await (Equivalent Patterns)
```
Promise chain:                    async/await:
─────────────────                 ──────────────────────
fetch(url)                        const response = await fetch(url);
  .then(r => r.json())            const data = await response.json();
  .then(data => process(data))    process(data);
  .catch(err => handle(err))      try/catch wraps the above
  .finally(() => cleanup())       finally { cleanup(); }
```

Both patterns are equivalent. `async/await` is syntactic sugar over Promises. Every `async` function returns a Promise implicitly.

### Microtask Queue Draining
```
Call stack empties → event loop checks:
  1. Microtask queue empty? No → drain ALL microtasks (including any added during draining)
  2. Now macrotask? Yes → run ONE macrotask
  3. Repeat

This means: a while(true) loop inside .then() callback blocks everything — microtasks can starve macrotasks
```

**Limitations:**
- Async functions always return a Promise — `return 42` from async function gives `Promise<42>`
- `await` can only be used inside `async` function (or top-level module)
- `Promise.all` fails fast — one rejection fails the group; use `allSettled` for independent parallel calls
- Long microtask queues (deeply nested `.then()` chains) can delay UI rendering — break into macrotasks with `setTimeout` if needed
- Error thrown in `.then()` callback is caught by the NEXT `.catch()`, not the surrounding sync try/catch

## PTA / SA Relevance

**Code review flags:**
- Missing `await` before Apex imperative calls — returns a Promise instead of the data
- `Promise.all` for independent Apex calls where a single failure shouldn't kill all results — should be `allSettled`
- `async function` with no `try/catch` and no `.catch()` — unhandled rejection will crash or silently fail
- Calling an async function and not awaiting it inside another async function — fire-and-forget (sometimes intentional, always needs a comment)

**Architecture guidance:**
- For parallel Apex calls in LWC (e.g., loading multiple related lists), `Promise.all` is ~50% faster than sequential `await` calls
- For bulk operations (update 50 records), `Promise.allSettled` gives individual success/failure per record
- LWC doesn't support top-level await in component JS — wrap in `connectedCallback()` or event handlers

**Customer scenario:** Customer reports "our LWC sometimes loses data silently." Code review finds `const result = saveRecord(data)` without `await`. The call fires and Promise is ignored. Fix: `const result = await saveRecord(data)` inside an async handler with try/catch.

## Key Facts to Memorize
- JavaScript is single-threaded; async code deferred via microtask/macrotask queues
- Microtask queue (Promises) drains before macrotask queue (setTimeout)
- `async` function always returns a Promise
- `await` pauses async function until Promise settles; returns the resolved value or throws rejected value
- `Promise.all` → all succeed or first failure fails group
- `Promise.allSettled` → all settle, reports each status/value/reason
- `Promise.race` → first to settle (resolved or rejected) wins
- `Promise.any` → first FULFILLED wins (ignores rejections)

## Exam Traps
- `setTimeout(..., 0)` does NOT execute synchronously — it's a macrotask, runs after current sync AND microtasks
- `async function` returns a Promise even if you `return 5` — caller gets `Promise<5>`, must await to get `5`
- Error inside `.then()` callback is caught by `.catch()` in the same chain — NOT by outer try/catch unless the chain is awaited
- Promise.all: if ALL resolve, returns array in INPUT order, not settlement order
- `await Promise.all([...])` — still need try/catch; if any promise rejects, the await throws

## Practice Questions
**Q:** What is the output?
```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
**A:** `A`, `D`, `C`, `B`. Synchronous first: A, D. Then microtask (Promise): C. Then macrotask (setTimeout): B.

**Q:** What is wrong with this LWC code?
```javascript
async handleSave() {
    const result = saveAccount({ accountData: this.account });
    this.showSuccess(result.id);
}
```
**A:** Missing `await` before `saveAccount`. Without `await`, `result` is a Promise object, not the resolved data. `result.id` is `undefined`. Fix: `const result = await saveAccount({ accountData: this.account });` and wrap in try/catch.

**Q:** When should you use `Promise.allSettled` instead of `Promise.all`?
**A:** When the parallel operations are INDEPENDENT and you want to handle each result individually, even if some fail. `Promise.all` fails fast on the first rejection, losing all other results. `allSettled` always resolves with an array of `{status, value/reason}` for each promise.
