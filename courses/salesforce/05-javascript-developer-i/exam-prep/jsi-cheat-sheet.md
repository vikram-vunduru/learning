# JSI Cheat Sheet — JavaScript Developer I (CRT-600)

**Exam:** 60 questions | 105 min | 65% pass (39/60)

---

## Variables & Scope

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignable | Yes | Yes | No |
| Re-declarable | Yes | No | No |

**Temporal Dead Zone (TDZ):** `let`/`const` exist from block start but throw `ReferenceError` if accessed before declaration.

**Key typeof gotchas:**
- `typeof null` → `"object"` (bug, not a feature)
- `typeof NaN` → `"number"`
- `typeof undeclaredVar` → `"undefined"` (no error)
- `typeof []` → `"object"` — use `Array.isArray()`

---

## Operators

| Operator | Triggers on |
|---|---|
| `\|\|` | falsy: `false, 0, '', null, undefined, NaN` |
| `??` | null/undefined ONLY |
| `?.` | optional chaining — short-circuits on null/undefined |
| `==` | coerces types before comparing |
| `===` | no coercion — always use this |

`value == null` → true for both `null` and `undefined` — the one approved `==` use.

---

## Functions

**Hoisting:**
- Function declarations: **fully hoisted** (callable before definition)
- Function expressions / arrow functions: only variable hoisted (as `undefined`)

**Arrow functions:**
- No own `this`, `arguments`, `super`, `new.target`
- Cannot be constructors (no `new`)
- `this` is lexically inherited from enclosing scope

**Default params:** only applied for `undefined` — NOT for `null`

**Rest vs Spread:**
- `...rest` in parameters — collects remaining args into array (must be last)
- `...spread` in calls — expands array into arguments

---

## Classes

```js
class Animal {
    #name;                              // private field
    static count = 0;                   // static property
    constructor(name) {
        this.#name = name;
        Animal.count++;
    }
    get name() { return this.#name; }   // getter
    speak() { return `${this.#name} speaks`; }
    static create(name) { return new Animal(name); } // static factory
}

class Dog extends Animal {
    constructor(name) {
        super(name);                    // must call before this
    }
    speak() { return super.speak() + ' (woof)'; }
}
```

**Private fields** (`#field`): language-enforced, inaccessible outside class body.  
**Static**: belongs to class, not instance — call as `ClassName.method()`.

---

## Prototype Chain

- Property lookup: object → [[Prototype]] → [[Prototype]] → `Object.prototype` → `null`
- `hasOwnProperty('key')`: true only if property is directly on the object
- `'key' in obj`: true if found anywhere in the chain
- `for...in`: iterates ALL enumerable string keys in chain (use with caution)
- `Object.keys()`: own enumerable string keys only

---

## Modules (ES Modules)

```js
// Named exports/imports
export function foo() {}           export const BAR = 1;
import { foo, BAR } from './m.js'; import { foo as f } from './m.js';

// Default export/import
export default class MyClass {}
import MyClass from './m.js';       // any name

// Namespace import
import * as ns from './m.js';      // ns.foo(), ns.BAR

// Re-export (barrel file)
export { foo } from './a.js';

// Dynamic import
const mod = await import('./m.js'); // returns Promise<module>
```

**ESM vs CJS:**
| | ESM | CommonJS |
|---|---|---|
| Syntax | `import/export` | `require/module.exports` |
| Loading | Static (parse-time) | Dynamic (runtime) |
| Bindings | Live | Copied snapshot |
| Tree shaking | Yes | No |

---

## Iterables & Generators

**Iterable protocol:** object with `[Symbol.iterator]()` method returning iterator `{ next() → { value, done } }`

**Built-in iterables:** Array, String, Map, Set, NodeList, arguments

**Generator:**
```js
function* range(start, end) {
    for (let i = start; i < end; i++) yield i;
}
for (const n of range(0, 5)) console.log(n); // 0,1,2,3,4
```

---

## Arrays — Key Methods

| Method | Returns | Mutates? |
|---|---|---|
| `map(fn)` | New array (same length) | No |
| `filter(fn)` | New array (shorter/same) | No |
| `reduce(fn, init)` | Single value | No |
| `find(fn)` | First matching element or `undefined` | No |
| `findIndex(fn)` | Index or `-1` | No |
| `some(fn)` | `true` if any match | No |
| `every(fn)` | `true` if all match | No |
| `flat(depth)` | Flattened new array | No |
| `flatMap(fn)` | map + flat(1) | No |
| `sort(fn)` | Sorted (in place!) | **Yes** |
| `splice(i,n)` | Removed elements | **Yes** |
| `push/pop/shift/unshift` | Length/element | **Yes** |

**Sort gotcha:** Default sort is **lexicographic**. Always pass comparator for numbers: `.sort((a,b) => a-b)`.

---

## Map & Set

**Map** (ordered, any key type):
```js
const m = new Map(); m.set(key, val); m.get(key); m.has(key); m.size;
for (const [k, v] of m) ...
```

**Set** (unique values, O(1) lookup):
```js
const s = new Set([1,2,2,3]); // {1,2,3}
s.add(4); s.has(3); s.delete(2); s.size;
```

**Use Map/Set when:** fast membership checks, any type as key, need .size, ordered iteration.  
**Use WeakMap/WeakSet when:** keys are objects and should not prevent garbage collection.

---

## Async JavaScript

**Event loop order (same tick):**
1. Synchronous code (call stack)
2. Microtasks: Promise callbacks, `queueMicrotask()`
3. Macrotasks: `setTimeout`, `setInterval`, I/O

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Output: A, D, C, B
```

**Promise combinators:**
| Method | Behavior |
|---|---|
| `Promise.all([...])` | Waits for all; rejects on first failure |
| `Promise.allSettled([...])` | Waits for all; never rejects; returns `{status, value\|reason}[]` |
| `Promise.race([...])` | First to settle (fulfill OR reject) wins |
| `Promise.any([...])` | First to FULFILL wins; rejects only if all reject |

**async/await traps:**
- `async forEach` doesn't await — use `for...of` or `Promise.all(arr.map(async...))`
- `await` in a non-async function is a SyntaxError
- `await` only pauses the current async function, not the whole program

---

## Error Handling

```js
try { ... }
catch (e) {
    e instanceof TypeError   // for type errors
    e.message                // error message string
    throw e;                 // re-throw to propagate
}
finally { /* always runs */ }
```

**Error types:**
- `TypeError`: wrong type (accessing prop on null)
- `ReferenceError`: undeclared variable
- `RangeError`: out of range (stack overflow, invalid array length)
- `SyntaxError`: parse-time error

---

## DOM & Events

```js
// Querying
document.getElementById('id')           // single element
document.querySelector('.class')        // first match (static)
document.querySelectorAll('div.item')   // NodeList (static)

// Safe content (no XSS)
el.textContent = userInput;  // SAFE
el.innerHTML = userInput;    // DANGEROUS — XSS

// Events
el.addEventListener('click', handler, { once: true });
el.removeEventListener('click', handler);  // same ref required

// Event delegation
list.addEventListener('click', e => {
    const item = e.target.closest('li[data-id]');
    if (item) handleClick(item.dataset.id);
});
```

**Bubbling vs Capturing:**
- Bubbling (default): event travels from target UP to document
- Capturing: event travels DOWN from document to target
- `addEventListener(event, fn, true)` — third arg `true` = capturing

---

## Node.js

**Key globals (not in browser):**
- `process`, `process.env`, `process.argv`, `process.exit()`
- `__dirname`, `__filename` (CommonJS only — use `import.meta.url` in ESM)

**EventEmitter pattern:**
```js
import { EventEmitter } from 'events';
const ee = new EventEmitter();
ee.on('data', (d) => console.log(d));
ee.emit('data', 'hello');
```

**npm:**
- `dependencies` — runtime
- `devDependencies` — dev/test only
- `npm install --save-dev jest` → devDependencies

---

## Jest Testing

```js
describe('MyModule', () => {
    beforeEach(() => { /* reset state */ });
    afterAll(() => { /* one-time teardown */ });

    test('does the thing', () => {
        expect(fn(arg)).toBe(expected);        // ===
        expect(fn(arg)).toEqual(expected);     // deep equality
        expect(fn(arg)).toContain(item);
        expect(fn()).toThrow('message');
        expect(mockFn).toHaveBeenCalledWith(x);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });
});

// Mock function
const mock = jest.fn().mockReturnValue(42);
// Async mock
const asyncMock = jest.fn().mockResolvedValue({ data: [] });
```

**Coverage targets:** statements, branches, functions, lines — 75%+ is typical.

---

## TypeScript Quick Reference

```typescript
// Basic types
let n: number; let s: string; let b: boolean;
let a: unknown; let x: any; // unknown is safer

// Interfaces vs Types
interface User { id: number; name: string; email?: string; } // optional
type ID = number | string;  // union type

// Generics
function identity<T>(arg: T): T { return arg; }

// Utility types
type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type UserName = Pick<User, 'name'>;
type NoId = Omit<User, 'id'>;

// Type assertion
const el = document.getElementById('app') as HTMLDivElement;
```

---

## LWC JavaScript Essentials

| Decorator | Purpose |
|---|---|
| `@api` | Public property — parent can set it; re-renders on change |
| `@wire` | Reactive Salesforce data binding (LDS or cacheable Apex) |
| `@track` | (Legacy) Deep-watch objects/arrays — rarely needed today |

**Lifecycle hooks:**
- `constructor()` → initialize (no DOM access)
- `connectedCallback()` → DOM ready, fetch data, subscribe
- `renderedCallback()` → post-render DOM work (use `_rendered` flag)
- `disconnectedCallback()` → clean up listeners, subscriptions, timers

**Custom events:**
```js
this.dispatchEvent(new CustomEvent('myevent', {
    detail: { payload },
    bubbles: true,    // propagates up DOM tree
    composed: true    // crosses shadow DOM boundary
}));
```

**DOM in LWC:**
- `this.template.querySelector()` — NOT `document.querySelector()`
- `eval()` is blocked by Lightning Web Security
- No inline scripts; no jQuery; no `window.document` manipulation

---

## Security & Performance

**XSS prevention:**
- `textContent` for user data (safe)  
- `innerHTML` for user data = XSS vulnerability
- Sanitize with DOMPurify if HTML is needed

**eval() = NEVER:**
- Executes strings as code
- Cannot be optimized by JS engine
- Blocked by CSP and LWC/LWS

**Big-O quick reference:**
- `Array.includes()` / `.find()` / `.filter()` → O(n)
- `Set.has()` / `Map.get()` → O(1)
- `Array.sort()` → O(n log n)
- Nested loops → O(n²) — replace with Map/Set for lookups

**Memory leak prevention:**
- Remove event listeners in `disconnectedCallback`
- `clearInterval` / `clearTimeout` when done
- Use `WeakMap`/`WeakSet` for object-keyed caches

---

## Exam Day Tips
1. **`typeof null === "object"`** — always a trap question
2. **Default sort is lexicographic** — always a trap with numbers
3. **`==` vs `??`**: `||` catches all falsy; `??` catches only null/undefined
4. **`forEach` ignores async** — use `for...of` or `Promise.all(arr.map(async...))` 
5. **`Promise.all` fails fast; `allSettled` never rejects**
6. **Arrow functions have no `this`** — they inherit from lexical scope
7. **`Promise.race` resolves/rejects on first settlement; `Promise.any` resolves on first fulfillment**
8. **LWC: `this.template.querySelector` not `document.querySelector`**
9. **Module live bindings** — ESM exports reflect changes; CJS copies the value at require time
10. **`hasOwnProperty` vs `in`** — own vs inherited
