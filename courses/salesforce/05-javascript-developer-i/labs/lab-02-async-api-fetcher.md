# Lab 02: Async API Fetcher — What I Need to Be Able to Do

## Core Skills Checklist

### Promises & async/await
- [ ] Write an `async` function and use `await` to wait for a Promise to resolve
- [ ] Wrap async calls in `try/catch/finally` — never leave async code without error handling
- [ ] Understand that `async` functions always return a Promise — callers must `await` them too
- [ ] Use `Promise.all` to run multiple fetches in parallel and collect all results
- [ ] Use `Promise.allSettled` when parallel calls are independent and some may fail
- [ ] Handle Promise rejection: re-throw vs log vs return fallback value (know when to do each)

### fetch API
- [ ] Call `fetch(url)` and chain `.then(r => r.json())` or use `await response.json()`
- [ ] Check `response.ok` before parsing — HTTP 404/500 don't throw by default
- [ ] Add request headers for auth: `{ headers: { Authorization: 'Bearer ' + token } }`
- [ ] Send POST with JSON body: `{ method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }`

### Error Handling Patterns
- [ ] `err.message` for standard JS/fetch errors
- [ ] Custom error classes: `class ApiError extends Error { constructor(status, msg) { super(msg); this.status = status; } }`
- [ ] Retry logic with exponential backoff
- [ ] Timeout via `Promise.race([ fetchCall, new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), 5000)) ])`

### Event Loop Understanding
- [ ] Explain why `setTimeout(fn, 0)` runs AFTER `Promise.resolve().then(fn)`
- [ ] Trace execution order of sync + microtask + macrotask code
- [ ] Understand that `await` suspends the async function, not the entire thread

### Performance
- [ ] Debounce search input before calling fetch (avoid request-per-keystroke)
- [ ] Cache results with `Map` to avoid redundant fetches
- [ ] Use `AbortController` to cancel a fetch if component unmounts

## Concepts This Lab Tests
- async/await syntax and error handling patterns
- fetch API response handling
- Promise combinators (all, allSettled, race)
- Event loop execution order
- Real-world async patterns: retry, timeout, debounce

## What a Passing Implementation Looks Like
```javascript
const cache = new Map();

async function fetchWithCache(url) {
    if (cache.has(url)) return cache.get(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        cache.set(url, data);
        return data;
    } catch (err) {
        if (err.name === 'AbortError') throw new Error('Request timed out');
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}

// Parallel fetch
async function loadDashboard(userId) {
    const [profile, contacts, tasks] = await Promise.all([
        fetchWithCache(`/api/users/${userId}`),
        fetchWithCache(`/api/contacts?userId=${userId}`),
        fetchWithCache(`/api/tasks?userId=${userId}`)
    ]);
    return { profile, contacts, tasks };
}
```
