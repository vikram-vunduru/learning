# Lecture 08: Iterators and Generators

## Learning Objectives
- Implement the iterable protocol using `Symbol.iterator` and an iterator object with `next()` returning `{ value, done }`
- Use `for...of` loops on any iterable, understanding why they work and how they differ from `for...in`
- Write generator functions with `function*` and `yield` to produce lazy sequences
- Use `yield*` to delegate to another iterable inside a generator
- Describe infinite sequences and lazy evaluation as generator use cases
- Explain how generators provided a model for async flow control before async/await
- Identify built-in iterables: Array, String, Map, Set, NodeList, and arguments

## Slides

### Slide 1: The Iterable Protocol
**Visual:** Diagram with two boxes connected by arrows. Box 1: "Iterable object" — has a `[Symbol.iterator]()` method. Box 2: "Iterator object" — returned by calling `[Symbol.iterator]()`, has a `next()` method that returns `{ value: any, done: boolean }`. Arrows show: `for...of` calling `[Symbol.iterator]()`, then calling `next()` in a loop until `done: true`.
**Content:**
- The **iterable protocol** defines how an object can be iterated
- An object is **iterable** if it has a method at the property key `Symbol.iterator`
- Calling `obj[Symbol.iterator]()` returns an **iterator** — an object with a `next()` method
- `next()` returns a result object: `{ value: <current>, done: <boolean> }`
  - `done: false` — more values available; `value` is the current item
  - `done: true` — iteration complete; `value` is `undefined` (or a final return value)
- `for...of` is syntactic sugar that calls `[Symbol.iterator]()` and repeatedly calls `next()` until `done: true`
```js
const arr = [10, 20, 30];
const iterator = arr[Symbol.iterator]();  // get iterator from array

iterator.next(); // { value: 10, done: false }
iterator.next(); // { value: 20, done: false }
iterator.next(); // { value: 30, done: false }
iterator.next(); // { value: undefined, done: true }

// for...of does all of this automatically:
for (const val of arr) {
  console.log(val); // 10, 20, 30
}
```
**Speaker Notes:** The iterable protocol is a contracts-based design in JavaScript. Any object that implements `[Symbol.iterator]()` correctly can be used with `for...of`, the spread operator `...`, destructuring assignment, `Array.from()`, `Promise.all()`, and any other language feature that consumes iterables. This is a very clean extensibility point: you define one method, and your object gains compatibility with all those language features automatically. Symbol.iterator is a well-known symbol — a global constant defined on the `Symbol` object — that acts as a standard property key without risk of collision with user-defined string property names.

### Slide 2: Custom Iterables
**Visual:** Code walkthrough showing a `Range` class with `[Symbol.iterator]()` defined. Step-by-step trace shows the `for...of` loop calling `Symbol.iterator()` to get the iterator, then calling `next()` producing `{value: 1, done: false}`, `{value: 2, done: false}`, `{value: 3, done: false}`, `{value: undefined, done: true}`.
**Content:**
- Any object can be made iterable by implementing `[Symbol.iterator]()`
- The method must return an iterator with `next()`
- An object can be both the iterable and the iterator (return `this` from `[Symbol.iterator]()`)
- The iterator is stateful — it remembers position between `next()` calls
```js
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const range = new Range(1, 3);
for (const n of range) console.log(n);  // 1, 2, 3
console.log([...range]);                // [1, 2, 3] — spread works too
const [first, second] = range;          // destructuring works too
```
**Speaker Notes:** Notice a few things about this implementation. The iterator's internal state (`current`) is captured in a closure — the closure created when `[Symbol.iterator]()` is called. This is important: each time you start a new `for...of` loop over a `Range`, it calls `[Symbol.iterator]()` again, creating a fresh closure with its own `current = this.start`. This means a `Range` can be iterated multiple times, which is the expected behavior for an iterable. An iterator that returns `this` from `[Symbol.iterator]()` is called "its own iterator" — it can only be iterated once because the state is on the object itself, not in a new closure each time. Arrays create a new iterator object each time; that's why you can loop over the same array multiple times.

### Slide 3: for...of vs for...in
**Visual:** Side-by-side comparison table with three example scenarios: iterating an array, iterating an object, and iterating a string. For each, the table shows what `for...of` produces, what `for...in` produces, and any gotchas (e.g., `for...in` on array gives string index keys; `for...of` on plain object throws TypeError).
**Content:**
- **`for...of`:** iterates the **values** of any iterable; uses the iterator protocol
  - Works on: Array, String, Map, Set, NodeList, generator results, any custom iterable
  - Does NOT work on plain objects `{}` — they are not iterable by default
- **`for...in`:** iterates the **enumerable property keys** of an object (including inherited)
  - Works on any object; gives string keys
  - On arrays: gives string indices `'0'`, `'1'`, `'2'` — usually not what you want
  - Includes inherited enumerable properties — use `hasOwnProperty()` guard
```js
const arr = ['a', 'b', 'c'];
for (const val of arr)   console.log(val);  // 'a', 'b', 'c'   ← values
for (const key in arr)   console.log(key);  // '0', '1', '2'   ← string keys

const str = 'hi';
for (const char of str) console.log(char); // 'h', 'i'  ← char by char

const map = new Map([['x', 1], ['y', 2]]);
for (const [key, val] of map) console.log(key, val); // 'x' 1, 'y' 2

// Plain object — NOT iterable:
const obj = { a: 1 };
for (const val of obj) {} // TypeError: obj is not iterable
```
**Speaker Notes:** The `for...of` vs `for...in` distinction is one of the highest-frequency exam questions in the collections and iteration domains. The rule to remember: `for...of` is for **values** of **iterables**; `for...in` is for **keys** of **objects**. Arrays are objects, so `for...in` technically works on them — but it gives you string keys, iterates inherited properties if any exist on `Array.prototype`, and the order is not guaranteed for non-integer keys. Never use `for...in` to iterate arrays. For iterating object keys, `for...in` with a `hasOwnProperty()` guard works, but `Object.keys()` followed by a `forEach` or `for...of` is cleaner.

### Slide 4: Generator Functions — function* and yield
**Visual:** Annotated code diagram of a generator function: the `function*` keyword is circled and labeled "marks this as a generator." Inside, `yield 1` and `yield 2` are circled and labeled "pause and produce a value." A separate box shows the generator object returned by calling the function, with three `next()` calls and their `{value, done}` results, with a play/pause metaphor alongside.
**Content:**
- `function*` declares a generator function — calling it returns a generator object, does not run the body
- A generator object is both an iterator AND an iterable
- `yield expression` pauses execution and produces a value; control returns to the caller
- `next()` resumes execution from the last `yield` until the next `yield` or `return`
- `return value` in a generator produces `{ value: returnValue, done: true }` and ends iteration
- `yield` can also receive a value: `const x = yield 'prompt';` — the argument passed to the next `next(call)` becomes the result of the `yield` expression
```js
function* counter() {
  console.log('start');
  yield 1;
  console.log('after 1');
  yield 2;
  console.log('after 2');
  return 3;
}

const gen = counter();          // does NOT run any code yet
gen.next(); // logs 'start', returns { value: 1, done: false }
gen.next(); // logs 'after 1', returns { value: 2, done: false }
gen.next(); // logs 'after 2', returns { value: 3, done: true }
gen.next(); // returns { value: undefined, done: true }

for (const n of counter()) console.log(n); // 1, 2  (return value skipped by for...of)
```
**Speaker Notes:** The key mental model for generators is a function that can be paused and resumed. Every `yield` statement is a pause point. Control literally leaves the function and returns to the caller. When `next()` is called again, execution resumes right after the last `yield`. This is dramatically different from any other function in JavaScript, which must run to completion once started. Notice that `for...of` skips the final return value when `done` is `true` — it only yields values where `done` is `false`. This means `return 3` in the counter above is not logged by the for...of loop, only `1` and `2` are. This surprises many developers the first time they see it.

### Slide 5: Infinite Sequences and Lazy Evaluation
**Visual:** Two diagrams side by side. Left: an eager array `[0,1,2,...,9999999]` being fully created in memory, labeled "eager — all values in memory at once." Right: a generator with `yield n++` in an infinite while loop, labeled "lazy — computes one value at a time, on demand." Arrows show a `take(5)` operation that pulls only 5 values.
**Content:**
- Generators enable **lazy evaluation**: values are produced only when requested
- An infinite sequence with a generator uses O(1) memory — no array needed
- Combine with `take()`, `map()`, `filter()` iterator helpers for pipeline processing
- `while (true)` inside a generator is safe — the loop pauses at each `yield`
```js
function* naturals(start = 0) {
  let n = start;
  while (true) {
    yield n++;        // infinite — but safe; pauses at each yield
  }
}

function* take(n, iterable) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) return;
    yield item;
  }
}

function* map(fn, iterable) {
  for (const item of iterable) yield fn(item);
}

// Compose a lazy pipeline:
const first5Squares = take(5, map(x => x * x, naturals()));
console.log([...first5Squares]); // [0, 1, 4, 9, 16]
// Only 5 values computed, never allocated a large array
```
**Speaker Notes:** Lazy evaluation is one of the most powerful features generators unlock. When processing a large or infinite data set, you often only need the first N items that match some condition. With arrays, you'd have to generate all the data first, filter it, then take N — using memory and CPU for all of it. With generators, values are computed one by one on demand. The moment you have enough, you stop. This is the core principle behind reactive programming and many data pipeline tools. For the JSI exam, the key concepts are: infinite while-true loops are valid in generators, each yield pauses not crashes, and lazy pipelines are a natural fit.

### Slide 6: yield* — Delegating to Another Iterable
**Visual:** Code diagram showing `yield*` inside a generator delegating to another generator. The caller's trace shows values flowing: first all values from the inner generator, then the outer generator continues. An analogy caption reads: "yield* is like saying 'insert everything from this iterable here.'"
**Content:**
- `yield*` delegates iteration to another iterable (generator, array, string, any iterable)
- The delegated iterable's values are passed through to the caller as if they were yielded directly
- Equivalent to: `for (const v of iterable) yield v;` but more concise
- The final return value of a delegated generator becomes the result of the `yield*` expression
```js
function* inner() {
  yield 'a';
  yield 'b';
  return 'inner done';  // return value of inner becomes result of yield*
}

function* outer() {
  yield 1;
  const result = yield* inner();  // delegates to inner; result = 'inner done'
  console.log('inner returned:', result);
  yield 2;
}

console.log([...outer()]); // [1, 'a', 'b', 2]
// Note: 'inner done' is NOT in the output array; it was the return value

// yield* with arrays and strings:
function* concat(...iterables) {
  for (const it of iterables) yield* it;
}
console.log([...concat([1, 2], 'ab', [3])]); // [1, 2, 'a', 'b', 3]
```
**Speaker Notes:** `yield*` is what makes recursive generator structures possible. Imagine implementing a tree traversal: each node can `yield*` its children's generators, and the whole tree is traversed lazily without having to flatten it into an array first. The return value of the delegated generator — which only appears on the final `{ value: x, done: true }` result — is captured by `yield*` and assigned as the expression result. This is a subtle but occasionally tested nuance: `for...of` and spread never see the return value (they stop at `done: true`), but the outer generator can capture it via `const result = yield* inner()`.

### Slide 7: Generators as Async Flow Control Predecessors
**Visual:** Side-by-side timeline: left shows a generator with `yield fetch(url)` — the generator pauses, an external "runner" receives the Promise, waits for it to resolve, then calls `next(result)` to resume. Right side shows the equivalent `async/await` version — same visual structure but with built-in Promise support. Arrow between them labeled "async/await is a generator runner built into the language."
**Content:**
- Before `async/await` (ES2017), libraries used generators + Promises to write async code synchronously
- A "generator runner" (like `co` library or Koa v1) would:
  1. Call `next()` to run the generator until a `yield`
  2. Receive the yielded Promise, `.then()` it
  3. Call `next(resolvedValue)` to resume the generator with the result
- `async/await` is essentially this pattern promoted to a language feature
- `async function` is syntactic sugar for a generator + Promise runner
- Understanding this explains why `async` functions "look synchronous" — same pause/resume model
```js
// Generator-based async (pre-async/await, using a hypothetical runner)
function* fetchUser(id) {
  const response = yield fetch(`/api/users/${id}`);  // yield the Promise
  const user = yield response.json();                 // yield another Promise
  return user;
}

// Equivalent modern async/await:
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);  // await = yield + runner
  const user = await response.json();
  return user;
}

// The mental model is the same:
// pause here, give control back, resume with the resolved value
// yield/await: pause;  runner/runtime: resolve Promise, call next(value)
```
**Speaker Notes:** This slide bridges the iterator/generator lecture with the async programming topic coming up. Understanding that `async/await` is built on the same pause/resume mechanism as generators helps demystify how it works. When you `await` a Promise, JavaScript pauses your async function (just like a generator pauses at `yield`), returns control to the event loop, and later resumes the function with the resolved value. The `await` keyword is the yield, and the JavaScript runtime is the runner. For JSI exam purposes, you won't be asked to implement a generator runner — but you may see questions that test whether you understand that generators introduced the ability to pause function execution, which is the conceptual foundation for async/await.

### Slide 8: Built-in Iterables and Practical Patterns
**Visual:** Table listing built-in iterables: Array (values), String (Unicode code points / characters), Map (key-value pairs), Set (values), NodeList (DOM nodes), arguments object, TypedArray. Beside each, a short code snippet shows a for...of loop. A second visual shows destructuring and spread using iterables.
**Content:**
- **Built-in iterables** (implement `[Symbol.iterator]`):
  - `Array` — yields values in order
  - `String` — yields Unicode characters (handles emoji/multi-byte correctly)
  - `Map` — yields `[key, value]` pairs
  - `Set` — yields values in insertion order
  - `NodeList` / `HTMLCollection` — DOM node collections
  - `arguments` object — in non-arrow functions
  - `TypedArray` — `Int8Array`, `Float32Array`, etc.
- Language features that consume iterables: `for...of`, spread `...`, destructuring, `Array.from()`, `Promise.all()`, `Promise.race()`, `new Map()`, `new Set()`
```js
// String iteration — Unicode-aware
for (const char of 'hello') console.log(char); // h, e, l, l, o
[...'hello']; // ['h','e','l','l','o']

// Map iteration
const map = new Map([['a', 1], ['b', 2]]);
for (const [k, v] of map) console.log(k, v);   // 'a' 1, 'b' 2

// Set — no duplicates, insertion order
const set = new Set([1, 1, 2, 3, 3]);
[...set]; // [1, 2, 3]

// Array.from accepts any iterable
Array.from(new Set([1, 2, 3]));                // [1, 2, 3]
Array.from('abc');                             // ['a', 'b', 'c']
Array.from({ length: 3 }, (_, i) => i);       // [0, 1, 2] — from array-like
```
**Speaker Notes:** Strings being iterable is significant and often tested. When you spread a string — `[...'hello']` — you get an array of characters. When you use a for...of on a string, you get each character. Importantly, this is Unicode-aware: a string that contains an emoji (which is multiple UTF-16 code units) will yield the full emoji character as a single iteration item, whereas `for (let i = 0; i < str.length; i++)` would split the emoji across two iterations. `Array.from()` is particularly useful because it accepts both iterables and array-like objects (objects with `length` and indexed properties). `NodeList` — the result of `querySelectorAll()` — is iterable, which means you can use `for...of` on DOM query results and spread them into arrays directly.

## Recording Script
Welcome to Lecture 8: Iterators and Generators. These are among the most conceptually interesting features in modern JavaScript, and they show up on the JSI exam as part of the collections domain.

Let's start with the iterable protocol. An iterable is any object that has a method named with the key `Symbol.iterator`. Calling that method returns an iterator — an object with a `next()` method. Each call to `next()` returns a result object with two properties: `value`, the current item, and `done`, a boolean that is `false` while items remain and `true` when iteration is complete. The `for...of` loop is syntactic sugar that automates this entire process: get the iterator, call next, use the value, repeat until done is true.

You can make any custom object iterable by implementing `[Symbol.iterator]()`. The method returns an iterator object with its own `next()` implementation that tracks state internally. Once you've done this, your object works with for...of, the spread operator, destructuring assignment, Array.from, and anything else that consumes the iterable protocol.

The for...of versus for...in distinction is one of the most tested topics. `for...of` iterates the **values** of iterables — arrays, strings, Maps, Sets. `for...in` iterates the **enumerable property keys** of an object, including inherited ones. Never use `for...in` to loop over an array — you'll get string indices and potentially inherited properties. Use `for...of` for iterables, `Object.keys()` or `Object.entries()` for plain objects.

Generator functions use the `function*` syntax with an asterisk. Calling a generator function does NOT execute its body — it returns a generator object. The generator object is both an iterator and an iterable. When you call `next()`, the body runs until it hits a `yield` statement, which pauses execution and sends the yielded value back to the caller. The next call to `next()` resumes from exactly where it left off. This pause-and-resume capability is fundamentally different from any other JavaScript function.

This pause-resume model enables infinite sequences. A generator with `while (true)` and `yield` inside is perfectly safe — the loop pauses at each yield rather than running forever. This is lazy evaluation: you only compute values when they are actually requested. For processing large data pipelines, this is enormously efficient.

`yield*` delegates iteration to another iterable — it essentially inserts all the values of that iterable at that point in the generator's output. It works with arrays, strings, other generators, any iterable.

Before async/await arrived in ES2017, developers used generators with Promise-handling "runners" to write asynchronous code that looked synchronous. You'd yield a Promise, the runner would await it, then call next with the resolved value to resume. `async/await` is this exact pattern built into the language — async functions are essentially generators where the runtime is the runner. Understanding this link deepens your intuition for how async/await works.

Finally, know your built-in iterables: Array, String, Map, Set, NodeList, TypedArray, and the arguments object. These all implement `[Symbol.iterator]` and work with all the language features that consume iterables.

See you in the next section.

## Exam Tips
- The iterator protocol: `Symbol.iterator` returns an iterator whose `next()` returns `{ value, done }`. Done is `false` while values remain and `true` when exhausted.
- `for...of` iterates **values** of iterables; `for...in` iterates **enumerable keys** of objects (including inherited). Never use `for...in` on arrays.
- A `return` value in a generator produces `{ done: true, value: returnValue }` — this is NOT yielded to `for...of` or spread. Only `yield`ed values appear in for...of output.
- `yield*` delegates to another iterable and its final return value becomes the result of the `yield*` expression in the outer generator.
- Plain objects `{}` are NOT iterable — `for...of` on a plain object throws a TypeError. Arrays, Strings, Maps, Sets, NodeLists are iterable.
- Generators are lazy: infinite sequences with `while(true) { yield n++; }` are valid and safe — the loop pauses, not runs, at each yield.
- `async/await` is conceptually a generator + Promise runner built into the language — both use the same pause/resume mental model.
- Exam weight: part of the Collections domain at approximately 7%.

## Lecture Summary
The iterable protocol enables any object to participate in `for...of`, spread, and destructuring by implementing `[Symbol.iterator]()` to return an iterator with `next()` producing `{ value, done }` objects. Built-in iterables include Array, String, Map, Set, and NodeList. Generator functions (`function*`) use `yield` to pause execution and produce values lazily, enabling infinite sequences with O(1) memory; `yield*` delegates to another iterable. `for...of` consumes iterables by value while `for...in` traverses object keys including inherited ones. Generators were the historical foundation for async/await — an async function is semantically equivalent to a generator with an automatic Promise-resolving runner. Understanding the protocol also explains why `for...of` cannot iterate plain objects: they lack `[Symbol.iterator]`.

## Mini Quiz

**Q1:** What does the following code print?
```js
function* gen() {
  yield 1;
  yield 2;
  return 3;
}
console.log([...gen()]);
```
A) `[1, 2, 3]`
B) `[1, 2]`
C) `[3]`
D) A TypeError is thrown
**Answer:** B — The spread operator (and `for...of`) only collects values where `done` is `false`. The `return 3` statement produces `{ value: 3, done: true }`, which signals the end of iteration. The spread operator stops collecting when it sees `done: true` and does not include the return value. Only the two `yield`ed values — 1 and 2 — end up in the array.

**Q2:** Which of the following is NOT iterable by default?
A) `new Map([['a', 1]])`
B) `'hello'`
C) `{ a: 1, b: 2 }`
D) `new Set([1, 2, 3])`
**Answer:** C — Plain objects do not implement the iterable protocol (`Symbol.iterator`) by default. Using `for...of` on a plain object throws a `TypeError: object is not iterable`. Map, Set, String, Array, and other built-ins all implement `Symbol.iterator`. To iterate a plain object's entries, use `Object.entries(obj)` (which returns an iterable array) and then `for...of`.

**Q3:** What is the correct output of the following code?
```js
function* letters() {
  yield* ['a', 'b'];
  yield 'c';
}
const it = letters();
console.log(it.next()); // ?
console.log(it.next()); // ?
console.log(it.next()); // ?
```
A) `{value: 'a', done: false}`, `{value: 'b', done: false}`, `{value: 'c', done: false}`
B) `{value: ['a','b'], done: false}`, `{value: 'c', done: false}`, `{value: undefined, done: true}`
C) `{value: 'a', done: false}`, `{value: 'b', done: true}`, `{value: 'c', done: false}`
D) A TypeError because `yield*` cannot delegate to an array
**Answer:** A — `yield*` delegates to the array `['a', 'b']`, yielding its values one at a time as if they had been individually yielded. So the first `next()` gets `{value: 'a', done: false}`, the second gets `{value: 'b', done: false}` (delegation continues, not done), and the third gets `{value: 'c', done: false}` from the explicit `yield 'c'`. A fourth call would return `{value: undefined, done: true}`.
