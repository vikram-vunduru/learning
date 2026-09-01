# Lab 02: Async API Fetcher — Promises, async/await & Error Handling

## Lab Overview
Build a multi-source data fetching utility that calls public REST APIs using async/await, handles errors gracefully, combines results with Promise.all, and implements a retry mechanism with exponential backoff. This lab applies Section 3 — async JavaScript, Promises, and error handling.

**Time Estimate:** 75 minutes  
**Difficulty:** Intermediate  
**APIs Used:** [JSONPlaceholder](https://jsonplaceholder.typicode.com) (free, no key needed)  
**Concepts Applied:** async/await, Promise.all, Promise.allSettled, error handling, closures, retry logic

---

## Lab Objectives
- Write async functions that fetch data and handle HTTP errors correctly
- Use `Promise.all` for parallel fetching and `Promise.allSettled` for fault-tolerant gathering
- Implement a retry function with exponential backoff using recursion and closures
- Build a simple in-memory cache using a Map and closures
- Display results in the DOM with proper loading/error states

---

## Project Structure
```
api-fetcher/
├── index.html
├── src/
│   ├── api.js         (fetch utilities)
│   ├── cache.js       (in-memory cache)
│   ├── retry.js       (retry with backoff)
│   └── app.js         (main app logic)
└── main.js
```

---

## Part 1: Core Fetch Utility (src/api.js)

### Step 1: HTTP error handling
`fetch()` does NOT throw on non-200 status codes — you must check `response.ok` manually.

```js
// src/api.js
export async function fetchJSON(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function fetchUser(userId) {
    return fetchJSON(`https://jsonplaceholder.typicode.com/users/${userId}`);
}

export async function fetchUserPosts(userId) {
    return fetchJSON(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
}

export async function fetchPost(postId) {
    return fetchJSON(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

export async function fetchComments(postId) {
    return fetchJSON(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
}
```

> **Key point**: `await fetch(url)` only rejects on network failure, not on 404 or 500 responses. Always check `response.ok`.

---

## Part 2: In-Memory Cache (src/cache.js)

### Step 2: Memoized fetch cache
```js
// src/cache.js
export function createCache(ttlMs = 60_000) {
    const store = new Map();

    return {
        async get(key, fetcher) {
            const entry = store.get(key);
            if (entry && Date.now() - entry.timestamp < ttlMs) {
                console.log(`[cache hit] ${key}`);
                return entry.data;
            }
            console.log(`[cache miss] ${key}`);
            const data = await fetcher();
            store.set(key, { data, timestamp: Date.now() });
            return data;
        },
        invalidate(key) { store.delete(key); },
        clear() { store.clear(); },
        get size() { return store.size; }
    };
}

// Shared cache instance — singleton via module scope
export const apiCache = createCache(30_000);
```

> **Concepts**: factory function returning an object with closure over `store` (private state). The exported `apiCache` is a module-scope singleton — imported everywhere in the app, one instance.

---

## Part 3: Retry with Exponential Backoff (src/retry.js)

### Step 3: Retry logic
```js
// src/retry.js

// sleep utility — returns a Promise that resolves after ms milliseconds
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function withRetry(fn, { maxAttempts = 3, baseDelayMs = 500 } = {}) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            // Don't retry on 4xx client errors — only on 5xx or network failures
            if (err.status && err.status >= 400 && err.status < 500) throw err;
            if (attempt < maxAttempts) {
                const delay = baseDelayMs * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, err.message);
                await sleep(delay);
            }
        }
    }
    throw lastError;
}
```

**Usage:**
```js
const data = await withRetry(() => fetchUser(1), { maxAttempts: 3 });
```

---

## Part 4: Main App Logic (src/app.js)

### Step 4: Parallel fetching and fault tolerance

```js
// src/app.js
import { fetchUser, fetchUserPosts } from './api.js';
import { apiCache } from './cache.js';
import { withRetry } from './retry.js';

// Fetch user + their posts in parallel
export async function loadUserDashboard(userId) {
    const [user, posts] = await Promise.all([
        apiCache.get(`user-${userId}`, () => fetchUser(userId)),
        apiCache.get(`posts-${userId}`, () => fetchUserPosts(userId))
    ]);
    return { user, posts };
}

// Fetch multiple users — don't fail if one user fetch fails
export async function loadMultipleUsers(userIds) {
    const results = await Promise.allSettled(
        userIds.map(id =>
            apiCache.get(`user-${id}`, () => withRetry(() => fetchUser(id)))
        )
    );

    const users = [];
    const errors = [];
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            users.push(result.value);
        } else {
            errors.push({ userId: userIds[index], error: result.reason.message });
        }
    });

    return { users, errors };
}

// Sequential with early termination — stops on first error
export async function loadPostWithComments(postId) {
    const post = await withRetry(() => apiCache.get(
        `post-${postId}`,
        () => import('./api.js').then(m => m.fetchPost(postId))
    ));
    const comments = await import('./api.js').then(m => m.fetchComments(postId));
    return { post, comments };
}
```

---

## Part 5: DOM Integration (src/app-ui.js)

### Step 5: Loading, success, and error states

```js
// src/app-ui.js
import { loadUserDashboard, loadMultipleUsers } from './app.js';

function setLoading(el, isLoading) {
    el.innerHTML = isLoading ? '<p class="loading">Loading...</p>' : '';
}

function renderUser(container, { user, posts }) {
    container.innerHTML = `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>${user.email} | ${user.company.name}</p>
            <h3>${posts.length} Posts</h3>
            <ul>${posts.slice(0, 5).map(p => `<li>${p.title}</li>`).join('')}</ul>
        </div>`;
}

function renderError(container, message) {
    container.innerHTML = `<p class="error">Error: ${message}</p>`;
}

export async function handleLoadUser(userId, container) {
    setLoading(container, true);
    try {
        const data = await loadUserDashboard(userId);
        renderUser(container, data);
    } catch (err) {
        renderError(container, err.message);
    }
}

export async function handleLoadMultiple(ids, container) {
    setLoading(container, true);
    const { users, errors } = await loadMultipleUsers(ids);
    container.innerHTML = `
        <h3>Loaded ${users.length} users</h3>
        ${users.map(u => `<div class="chip">${u.name}</div>`).join('')}
        ${errors.length ? `<p class="warn">Failed: ${errors.map(e => e.userId).join(', ')}</p>` : ''}
    `;
}
```

---

## Exercises

### Exercise 1 — Sequential vs Parallel timing
Time the difference between:
```js
// Sequential — waits for each before starting next
const user = await fetchUser(1);
const posts = await fetchUserPosts(1);
// total = user_time + posts_time

// Parallel — starts both at once
const [user, posts] = await Promise.all([fetchUser(1), fetchUserPosts(1)]);
// total = max(user_time, posts_time)
```
Use `performance.now()` before and after each approach and log the difference.

### Exercise 2 — Abort Controller
Add timeout support using `AbortController`:
```js
export async function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetchJSON(url, { signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
    }
}
```

### Exercise 3 — Promise.race for first-response
Fetch from two mirror servers simultaneously and use whichever responds first:
```js
const data = await Promise.race([
    fetchJSON('https://api1.example.com/data'),
    fetchJSON('https://api2.example.com/data')
]);
```

## Key Concepts Applied
- **async/await**: sequential-looking code that is actually non-blocking
- **Promise.all**: parallel execution, fails fast on first rejection
- **Promise.allSettled**: parallel execution, returns all results regardless of failures — use for bulk operations where partial success is acceptable
- **Error handling**: fetch's non-throwing behavior on HTTP errors; error.status for smart retry decisions
- **Closures**: the `createCache` factory closes over `store` — each cache instance has its own private Map
- **Module singleton**: `export const apiCache = createCache()` — module scope creates one shared instance
