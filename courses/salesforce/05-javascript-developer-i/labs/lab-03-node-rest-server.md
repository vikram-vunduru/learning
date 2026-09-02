# Lab 03: Node.js REST Server — What I Need to Be Able to Do

## Core Skills Checklist

### Node.js Core
- [ ] Create an HTTP server with `http.createServer((req, res) => {...})`
- [ ] Set response headers: `res.writeHead(200, { 'Content-Type': 'application/json' })`
- [ ] End response with `res.end(JSON.stringify(data))`
- [ ] Route by `req.url` and `req.method` — understand the difference
- [ ] Parse incoming request body (stream): collect chunks, then `JSON.parse` on complete
- [ ] Start server on a port: `server.listen(3000, () => console.log('Running'))`
- [ ] Use `process.env.PORT` for configurable port instead of hardcoded 3000

### File System
- [ ] Read a file: `await fs.promises.readFile('path', 'utf8')`
- [ ] Write a file: `await fs.promises.writeFile('path', content)`
- [ ] Use `path.join(__dirname, 'data', 'file.json')` for cross-platform paths
- [ ] Handle ENOENT error (file not found) in try/catch

### CommonJS Modules
- [ ] `const { createServer } = require('http')` — destructuring from require
- [ ] `module.exports = { handler, routes }` — export from a module
- [ ] `const routes = require('./routes')` — import local module (relative path required)
- [ ] Understand that `require()` is synchronous and cached

### EventEmitter
- [ ] Extend `EventEmitter` to create a custom event-driven service
- [ ] `this.emit('eventName', payload)` inside a method
- [ ] `instance.on('eventName', callback)` to subscribe
- [ ] `instance.once('eventName', callback)` for single-fire subscription
- [ ] `instance.off('eventName', callback)` to unsubscribe
- [ ] Handle the `'error'` event — unhandled 'error' throws in Node.js

### Testing with Jest
- [ ] Write `describe` / `it` blocks for handler functions
- [ ] Mock `fs.promises.readFile` to avoid real file I/O in tests
- [ ] Test response status codes and body content
- [ ] Use `beforeEach` to reset mocks: `jest.clearAllMocks()`
- [ ] Test error paths: mock throws, verify error response

### TypeScript Basics (Applied)
- [ ] Add type annotations to function parameters and return types
- [ ] Create `interface` for request/response shapes
- [ ] Use `tsconfig.json` with `"strict": true`
- [ ] Understand that TS types are erased at runtime — `tsc` compiles to JS

## Concepts This Lab Tests
- Node.js http module, routing, request/response lifecycle
- fs/path module usage (async patterns)
- CommonJS module system vs ES modules
- EventEmitter pub/sub pattern
- Jest mocking of Node.js modules
- TypeScript type annotations applied to real code

## What a Passing Implementation Looks Like
```javascript
const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

async function readTodos() {
    try {
        const content = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        if (err.code === 'ENOENT') return [];  // file doesn't exist yet
        throw err;
    }
}

const server = http.createServer(async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    if (req.url === '/todos' && req.method === 'GET') {
        try {
            const todos = await readTodos();
            res.writeHead(200, headers);
            res.end(JSON.stringify(todos));
        } catch (err) {
            res.writeHead(500, headers);
            res.end(JSON.stringify({ error: err.message }));
        }
    } else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
```
