# JSI Cheat Sheet — CRT-600 Personal Reference

**Exam:** 60 questions | 105 min | 65% pass (39/60) | $200

---

## Types & Variables
| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | `undefined` | TDZ | TDZ |
| Reassign | Yes | Yes | No |
| Re-declare | Yes | No | No |

**7 primitives:** `number` `string` `boolean` `null` `undefined` `symbol` `bigint`
**typeof traps:** `typeof null === "object"` | `typeof NaN === "number"` | `typeof [] === "object"`
**Falsy:** `false` `0` `""` `null` `undefined` `NaN` `0n`
**Truthy traps:** `[]` `{}` `"false"` `"0"`
**NaN:** `NaN !== NaN` — use `Number.isNaN()`; `null == undefined` is `true`
**??** vs **||:** `??` replaces null/undefined ONLY; `||` replaces any falsy (0, "" too)
**?.** short-circuits on null/undefined → returns `undefined` (not null)

---

## Scope & Closures
- `var` leaks out of blocks; `let`/`const` are block-scoped
- TDZ: accessing `let`/`const` before declaration → `ReferenceError`
- Function declarations hoisted fully; `var` hoisted to `undefined`; expressions NOT hoisted
- Closure: function retains access to enclosing scope after it returns
- Loop + `var` + async callback = all callbacks see final `i` → use `let` instead
- `typeof undeclaredVar` → `"undefined"` (no TDZ error — typeof special case)

---

## Functions
| | Declaration | Expression | Arrow |
|---|---|---|---|
| Hoisted | Full | No | No |
| Own `this` | Yes | Yes | No (lexical) |
| `arguments` | Yes | Yes | No |
| `new` | Yes | Yes | No |

- Default params trigger on `undefined` only — `null` does NOT trigger default
- Rest params `...args` → real array; `arguments` → array-like object (no .map)
- IIFE: `(function(){})()` — isolated scope, single execution

---

## `this` Binding Priority
1. `new` keyword → new object
2. `call` / `apply` / `bind` → provided `thisArg`
3. Method call `obj.fn()` → the object
4. Default → `undefined` (strict) or global (non-strict)
5. Arrow → lexical (enclosing scope) — **ignores everything above**

`bind` → returns new function; `call` → invoke + comma args; `apply` → invoke + array args
Arrow functions IGNORE `.bind(thisArg)` — lexical `this` cannot be overridden

---

## Classes
- NOT hoisted — must declare before `new`
- `super()` before `this` in derived constructor (required)
- Private `#field` — class-scoped, SyntaxError from outside even subclasses
- `static` = on class object only, not instances
- `instanceof` walks prototype chain
- Getters: `get name()` | Setters: `set name(v)`

---

## Prototypes
- Every object has `[[Prototype]]` — chain ends at `Object.prototype → null`
- `Object.getPrototypeOf(obj)` — standard (not `__proto__`)
- `hasOwnProperty(key)` — own props only; `Object.keys()` — own enumerable; `for...in` — own + inherited
- `Object.create(proto)` — creates object with proto as [[Prototype]]
- Property assignment ALWAYS creates own property — doesn't walk chain

---

## ES Modules
- Named: `export const x` → `import { x } from '...'` (must match)
- Default: `export default fn` → `import anything from '...'` (no braces)
- Static imports: parse time; `import()` dynamic: runtime, returns Promise
- Live bindings: imported names track exported variable changes
- All modules: strict mode auto, executed once (cached)
- Tree shaking requires static imports + bundler

---

## Iterators & Generators
- Iterator protocol: `.next()` returns `{ value, done }`
- Iterable protocol: `[Symbol.iterator]()` returns iterator
- `for...of` requires iterable; `for...in` requires object (iterates keys)
- `function*` + `yield` → auto-creates iterator; lazy evaluation
- `yield*` delegates to another iterable
- `[...gen()]` and `for...of` stop at `done: true` — `return` value is NOT included

---

## Collections
- `sort()` without comparator = string sort → `[1,10,2,9]` not numeric
- `sort` in-place; `map/filter/reduce` return new arrays
- `find` → element; `findIndex` → index; both return `undefined`/`-1` if not found
- `reduce(fn, initialValue)` — always provide initial value
- Map: any key type, `.size`, insertion-ordered; Set: unique values
- WeakMap/WeakSet: object keys only, not iterable, GC-friendly

---

## Async / Event Loop
**Order:** Synchronous → Microtasks (Promises) → Macrotasks (setTimeout)
- `setTimeout(fn, 0)` is a macrotask — runs AFTER all microtasks
- `async` function always returns a Promise
- `await` pauses async fn until Promise settles; re-throws rejections
- `Promise.all` → fail-fast; `Promise.allSettled` → all outcomes
- `Promise.race` → first settler; `Promise.any` → first fulfilled
- Unhandled rejection in Node ≥15 crashes the process

---

## Browser DOM & Events
- Event phases: capture (down) → target → bubble (up)
- `addEventListener(event, fn)` = bubbling; third arg `true` = capturing
- `e.target` = triggered element; `e.currentTarget` = listener's element
- `stopPropagation()` = stop travel; `preventDefault()` = stop browser default
- `querySelectorAll` → NodeList (not Array) — use `Array.from()` to convert
- Event delegation: one parent listener, check `e.target` → works for dynamic elements

---

## LWC Decorators & Lifecycle
| Decorator | Purpose |
|---|---|
| `@api` | Public reactive property; parent sets it |
| `@wire` | Reactive Salesforce data; `$prop` prefix = reactive param |
| `@track` | Deep-watch (post-Spring '20: mostly not needed) |

**Lifecycle order:** `constructor` → `connectedCallback` → render → `renderedCallback`
**Cleanup:** `disconnectedCallback` — always mirror setup/teardown
**Error boundary:** `errorCallback(error, stack)` catches CHILD component errors

**LWC rules:**
- `this.template.querySelector()` — NOT `document.querySelector()`
- Wire data: use `?.` — data arrives after first render
- `renderedCallback`: add `_hasRendered` flag — fires EVERY render
- `bubbles: true, composed: true` — needed to cross shadow DOM boundaries
- LMS = Lightning Message Service = cross-tree pub/sub

---

## Testing (Jest)
- `toBe` → `===`; `toEqual` → deep equality (use for objects/arrays)
- Async tests: must `await` or `return` the Promise
- `jest.fn()` → mock function; `.mockReturnValue()` / `.mockResolvedValue()`
- `expect(() => fn()).toThrow()` — function WRAPPED in arrow for throw assertions
- `beforeEach` / `afterEach` — per-test setup/teardown
- LWC tests: `afterEach` must clean up `document.body` to prevent test contamination

---

## Performance & Security
- O(1): Map/Set lookup; O(n): array scan; O(n log n): sort; O(n²): nested loops
- Memory leaks: unreleased listeners, detached DOM refs, closures over large objects
- `innerHTML = userInput` → XSS; use `textContent` (plain text) instead
- `eval()` → CSP violation in LWC; also prevents engine optimization
- Debounce: fire after N ms silence (search inputs); Throttle: fire max once per N ms (scroll/resize)

---

## Quick Exam Decision Rules
- `typeof x === ?`: null→"object", array→"object", function→"function", NaN→"number"
- Loop over array values → `for...of`; object keys → `for...in`
- Private class state → `#field`; public child API → `@api`
- Reactive Salesforce data → `@wire`; DML operation → imperative async with try/catch
- Event to parent → `CustomEvent`; event to sibling in different tree → LMS
- Test objects with `toEqual`, not `toBe`
