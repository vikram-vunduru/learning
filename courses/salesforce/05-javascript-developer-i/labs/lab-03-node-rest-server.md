# Lab 03: Node.js REST Server — http Module, Testing & TypeScript

## Lab Overview
Build a simple in-memory REST API using Node.js's built-in `http` module (no Express), then write Jest tests for the route handlers, and finally add TypeScript types for the data model. This lab applies Sections 4 and 5 — Node.js, testing, and TypeScript.

**Time Estimate:** 90 minutes  
**Difficulty:** Intermediate–Advanced  
**Concepts Applied:** Node.js http module, routing, JSON parsing, Jest unit tests, TypeScript interfaces

---

## Lab Objectives
- Build a REST API using only Node.js built-ins (no Express or other frameworks)
- Implement GET, POST, PUT, DELETE routes for a `/users` resource
- Write Jest unit tests for the route handler functions (pure logic, no HTTP)
- Add TypeScript interfaces and type annotations to the data model
- Understand the difference between the http module and higher-level frameworks

---

## Project Structure
```
node-rest-server/
├── package.json
├── tsconfig.json (optional — for TypeScript stretch)
├── src/
│   ├── server.js      (http server entry point)
│   ├── router.js      (request routing)
│   ├── handlers.js    (route handler functions)
│   ├── db.js          (in-memory data store)
│   └── types.ts       (TypeScript interfaces — stretch)
└── tests/
    ├── handlers.test.js
    └── db.test.js
```

---

## Part 1: In-Memory Data Store (src/db.js)

```js
// src/db.js
let users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
];
let nextId = 3;

export const db = {
    getAll() { return [...users]; },
    getById(id) { return users.find(u => u.id === id) ?? null; },
    create(data) {
        const user = { ...data, id: nextId++ };
        users.push(user);
        return user;
    },
    update(id, data) {
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...data, id }; // id is immutable
        return users[idx];
    },
    delete(id) {
        const before = users.length;
        users = users.filter(u => u.id !== id);
        return users.length < before;
    },
    // Test helper — reset state between tests
    _reset(data = []) { users = data; nextId = data.length + 1; }
};
```

---

## Part 2: Route Handlers (src/handlers.js)

Route handlers are pure functions that take `(body, params)` and return `{ status, data }`. This separation makes them easy to test without spinning up an HTTP server.

```js
// src/handlers.js
import { db } from './db.js';

export function getUsers() {
    return { status: 200, data: db.getAll() };
}

export function getUser(params) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return { status: 400, data: { error: 'Invalid ID' } };
    const user = db.getById(id);
    if (!user) return { status: 404, data: { error: 'User not found' } };
    return { status: 200, data: user };
}

export function createUser(body) {
    const { name, email, role = 'user' } = body ?? {};
    if (!name?.trim() || !email?.trim()) {
        return { status: 400, data: { error: 'name and email are required' } };
    }
    if (!email.includes('@')) {
        return { status: 400, data: { error: 'Invalid email format' } };
    }
    const user = db.create({ name: name.trim(), email: email.trim(), role });
    return { status: 201, data: user };
}

export function updateUser(body, params) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return { status: 400, data: { error: 'Invalid ID' } };
    const user = db.update(id, body ?? {});
    if (!user) return { status: 404, data: { error: 'User not found' } };
    return { status: 200, data: user };
}

export function deleteUser(params) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return { status: 400, data: { error: 'Invalid ID' } };
    const deleted = db.delete(id);
    if (!deleted) return { status: 404, data: { error: 'User not found' } };
    return { status: 204, data: null };
}
```

---

## Part 3: Router (src/router.js)

```js
// src/router.js
import { getUsers, getUser, createUser, updateUser, deleteUser } from './handlers.js';

const routes = [
    { method: 'GET',    pattern: /^\/users$/, handler: (_body, _params) => getUsers() },
    { method: 'GET',    pattern: /^\/users\/(\d+)$/, handler: (_body, params) => getUser(params) },
    { method: 'POST',   pattern: /^\/users$/, handler: (body, _params) => createUser(body) },
    { method: 'PUT',    pattern: /^\/users\/(\d+)$/, handler: (body, params) => updateUser(body, params) },
    { method: 'DELETE', pattern: /^\/users\/(\d+)$/, handler: (_body, params) => deleteUser(params) },
];

export function route(method, path, body) {
    for (const r of routes) {
        if (r.method !== method) continue;
        const match = path.match(r.pattern);
        if (match) {
            const params = { id: match[1] };
            return r.handler(body, params);
        }
    }
    return { status: 404, data: { error: `Cannot ${method} ${path}` } };
}
```

---

## Part 4: HTTP Server (src/server.js)

```js
// src/server.js
import { createServer } from 'http';
import { route } from './router.js';

const PORT = process.env.PORT ?? 3000;

const server = createServer((req, res) => {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
        let parsedBody = null;
        if (body) {
            try { parsedBody = JSON.parse(body); }
            catch { /* invalid JSON — parsedBody stays null */ }
        }

        const url = new URL(req.url, `http://localhost:${PORT}`);
        const { status, data } = route(req.method, url.pathname, parsedBody);

        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(data !== null ? JSON.stringify(data) : '');
    });

    req.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { server }; // export for graceful shutdown in tests
```

---

## Part 5: Jest Tests (tests/handlers.test.js)

```js
// tests/handlers.test.js
import { db } from '../src/db.js';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../src/handlers.js';

beforeEach(() => {
    db._reset([
        { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin' },
        { id: 2, name: 'Bob', email: 'bob@test.com', role: 'user' },
    ]);
});

describe('getUsers', () => {
    test('returns all users with status 200', () => {
        const { status, data } = getUsers();
        expect(status).toBe(200);
        expect(data).toHaveLength(2);
        expect(data[0].name).toBe('Alice');
    });
});

describe('getUser', () => {
    test('returns user by id', () => {
        const { status, data } = getUser({ id: '1' });
        expect(status).toBe(200);
        expect(data.name).toBe('Alice');
    });

    test('returns 404 for unknown id', () => {
        const { status, data } = getUser({ id: '999' });
        expect(status).toBe(404);
        expect(data.error).toContain('not found');
    });

    test('returns 400 for non-numeric id', () => {
        const { status } = getUser({ id: 'abc' });
        expect(status).toBe(400);
    });
});

describe('createUser', () => {
    test('creates a user and returns 201', () => {
        const { status, data } = createUser({ name: 'Carol', email: 'carol@test.com' });
        expect(status).toBe(201);
        expect(data.id).toBeDefined();
        expect(data.name).toBe('Carol');
    });

    test('returns 400 when name is missing', () => {
        const { status } = createUser({ email: 'test@test.com' });
        expect(status).toBe(400);
    });

    test('returns 400 for invalid email', () => {
        const { status } = createUser({ name: 'Dan', email: 'notanemail' });
        expect(status).toBe(400);
    });

    test('defaults role to user', () => {
        const { data } = createUser({ name: 'Eve', email: 'eve@test.com' });
        expect(data.role).toBe('user');
    });
});

describe('deleteUser', () => {
    test('deletes existing user and returns 204', () => {
        const { status } = deleteUser({ id: '1' });
        expect(status).toBe(204);
        expect(getUsers().data).toHaveLength(1);
    });

    test('returns 404 for non-existent user', () => {
        const { status } = deleteUser({ id: '999' });
        expect(status).toBe(404);
    });
});
```

**package.json scripts:**
```json
{
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "test:watch": "node --experimental-vm-modules node_modules/.bin/jest --watch"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

---

## Stretch: TypeScript Types (src/types.ts)

```typescript
// src/types.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
}

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<Omit<User, 'id'>>;

export interface RouteResult<T = unknown> {
    status: number;
    data: T | null;
}

export interface RouteParams {
    id?: string;
    [key: string]: string | undefined;
}

// Generic type for handler functions
export type RouteHandler<T = unknown> = (
    body: Partial<User> | null,
    params: RouteParams
) => RouteResult<T>;
```

**Convert handlers.js to handlers.ts:**
```typescript
import { db } from './db.js';
import type { User, CreateUserInput, RouteResult, RouteParams } from './types.js';

export function getUsers(): RouteResult<User[]> {
    return { status: 200, data: db.getAll() };
}

export function createUser(body: Partial<CreateUserInput> | null): RouteResult<User> {
    const { name, email, role = 'user' } = body ?? {};
    if (!name?.trim() || !email?.trim()) {
        return { status: 400, data: null };
    }
    const user = db.create({ name: name.trim(), email: email.trim(), role });
    return { status: 201, data: user };
}
```

---

## Manual Testing with curl
```bash
# Get all users
curl http://localhost:3000/users

# Get single user
curl http://localhost:3000/users/1

# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Carol","email":"carol@test.com"}'

# Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/users/2
```

## Key Concepts Applied
- **Node.js http module**: raw server without framework — shows exactly how HTTP parsing works
- **Separation of concerns**: pure handler functions tested independently of the HTTP layer
- **Jest**: `describe/test/expect`, `beforeEach` for state reset, matchers (toBe, toHaveLength, toContain, toBeDefined)
- **TypeScript**: interfaces, union types, utility types (`Omit<>`, `Partial<>`), generic return types
- **RESTful design**: proper status codes (200 GET, 201 POST, 204 DELETE, 400 validation, 404 not found)
