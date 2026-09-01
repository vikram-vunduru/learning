# Lecture 17: Advanced Functions

## Learning Objectives
- Use `call()`, `apply()`, and `bind()` to explicitly set the `this` context of a function
- Identify what `this` refers to in different contexts: global, method call, constructor, and arrow function
- Implement currying to transform a multi-argument function into a chain of single-argument functions
- Implement partial application to pre-fill function arguments
- Write a memoization function to cache expensive computation results
- Compose functions using `compose` and `pipe` utilities
- Implement debounce and throttle patterns for rate-limiting function calls

## Slides

### Slide 1: `this` in Different Contexts
**Visual:** Four code blocks side by side, each demonstrating `this` in a different context: (1) global scope — `this` is `window`/`global`. (2) Method call — `this` is the object before the dot. (3) Constructor — `this` is the new instance. (4) Arrow function — `this` is inherited from enclosing lexical scope.
**Content:**
- `this` is a dynamic reference that depends on **how a function is called**, not where it is defined
- **Global context:** `this === window` (browser) or `this === global` (Node.js) in non-strict mode; `undefined` in strict mode
- **Method call:** `this` is the object that owns the method call:
  ```js
  const obj = {
    name: 'Alice',
    greet() { return `Hello, ${this.name}`; }
  };
  obj.greet();  // this === obj → 'Hello, Alice'

  const fn = obj.greet;
  fn();  // this === undefined (strict) or window → broken!
  ```
- **Constructor call (new):** `this` is the newly created object
- **Arrow function:** No own `this` — inherits `this` from the lexical enclosing scope:
  ```js
  class Timer {
    constructor() { this.seconds = 0; }
    start() {
      setInterval(() => {
        this.seconds++;  // 'this' is Timer instance — arrow inherits it
      }, 1000);
    }
  }
  ```
- `this` is set at call time for regular functions; at definition time for arrow functions
**Speaker Notes:** The most common `this` bug: extracting a method from an object and calling it as a standalone function. `const fn = obj.greet; fn()` loses the `this` binding. The arrow function in `setInterval` is the classic fix for callback `this` problems — before arrow functions, developers used `const self = this` or `.bind(this)`. Understanding that arrow functions capture `this` lexically is essential for LWC development where lifecycle callbacks use `this` extensively.

### Slide 2: call(), apply(), bind()
**Visual:** Three code blocks showing explicit this binding. call() with individual arguments. apply() with argument array. bind() returning a new bound function. Arrow diagram showing original function + explicit this context → execution with correct this.
**Content:**
- All three explicitly set `this` for a function call
- **`call(thisArg, arg1, arg2, ...)`** — invokes immediately with given `this` and spread args:
  ```js
  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
  const user = { name: 'Bob' };
  greet.call(user, 'Hello', '!');  // 'Hello, Bob!'
  ```
- **`apply(thisArg, [arg1, arg2, ...])`** — same as call, but arguments as array:
  ```js
  greet.apply(user, ['Hi', '?']);  // 'Hi, Bob?'
  // Classic use: spread array to Math.max
  Math.max.apply(null, [1, 5, 3, 9]);  // 9 (use Math.max(...arr) in modern JS)
  ```
- **`bind(thisArg, arg1, ...)`** — returns a NEW function with `this` permanently bound:
  ```js
  const greetBob = greet.bind(user, 'Hey');
  greetBob('.');    // 'Hey, Bob.'
  greetBob('!');    // 'Hey, Bob!'  — 'user' is always this; 'Hey' is always first arg
  ```
- **Memory aid:** Call = individual args; Apply = Array; Bind = returns Bound function
- Arrow functions ignore `call`/`apply`/`bind` for `this` — their `this` is always lexical
**Speaker Notes:** The memory aid "Call, Apply, Bind — C, A, B — Commas, Array, Bound" is a reliable exam trick. `bind` is commonly used to create event handler functions that maintain the correct `this` context — for example, `element.addEventListener('click', this.handleClick.bind(this))`. In modern JavaScript, arrow function class fields (if supported) are an alternative: `handleClick = () => { this... }` is already bound to the instance. `apply` with arrays was important before the spread operator; today `Math.max(...arr)` is preferred over `Math.max.apply(null, arr)`.

### Slide 3: Currying and Partial Application
**Visual:** Left: currying diagram transforming `add(a, b)` into `add(a)(b)` — calling with one argument returns a new function waiting for the next. Right: partial application showing `multiply(2)` returning a `double` function that pre-fills the first argument.
**Content:**
- **Currying** — transforms `f(a, b, c)` into `f(a)(b)(c)` — each call returns a function expecting the next argument:
  ```js
  // Manual curry
  const add = a => b => a + b;
  const add5 = add(5);   // returns b => 5 + b
  add5(3);               // 8
  add5(10);              // 15

  // Generic curry utility
  function curry(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...moreArgs) => curried(...args, ...moreArgs);
    };
  }

  const curriedAdd = curry((a, b, c) => a + b + c);
  curriedAdd(1)(2)(3);   // 6
  curriedAdd(1, 2)(3);   // 6
  ```
- **Partial application** — pre-fill some arguments using `bind`:
  ```js
  function multiply(factor, number) { return factor * number; }
  const double = multiply.bind(null, 2);   // factor = 2 pre-filled
  const triple = multiply.bind(null, 3);
  double(5);   // 10
  triple(5);   // 15
  ```
- Partial application differs from currying: partial fills some args and returns a function; currying always returns unary (one-arg) functions until all args are provided
**Speaker Notes:** Currying is powerful in functional pipelines where you build specialized functions by partially applying configuration. For example, a curried `filter(predicate)(array)` lets you create `filterActive = filter(x => x.active)` that you can reuse with any array. In practice, libraries like Ramda and lodash/fp provide curried versions of their utilities. The JSI exam tests conceptual understanding — know what currying produces (chain of unary functions) and how partial application works.

### Slide 4: Memoization and Function Composition
**Visual:** Left: memoization diagram showing first call with expensive computation going to cache, subsequent calls with same arguments returning from cache instantly. Right: compose/pipe diagram showing data flowing through f→g→h functions in sequence.
**Content:**
- **Memoization** — cache function results by input arguments to avoid redundant computation:
  ```js
  function memoize(fn) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  function expensiveCalc(n) {
    console.log('Computing...');
    return n * n * Math.random();  // simplified expensive operation
  }

  const memoized = memoize(expensiveCalc);
  memoized(5);   // Computing... → result cached
  memoized(5);   // Cache hit — no "Computing..."
  memoized(10);  // Computing... → new arg, computed fresh
  ```
- **Function composition:** chaining functions where output of one is input of next:
  ```js
  // compose: right-to-left (mathematical convention)
  const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

  // pipe: left-to-right (more readable for most developers)
  const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

  const process = pipe(
    str => str.trim(),
    str => str.toLowerCase(),
    str => str.replace(/\s+/g, '-')
  );
  process('  Hello World  ');  // 'hello-world'
  ```
- Memoization is a space-time trade-off — trading memory for speed
- Only valid for pure functions (same input must always yield same output)
**Speaker Notes:** Memoization is classic dynamic programming in disguise. It's valid only for pure functions — if the function has side effects or its output depends on external state, caching produces wrong results. The JSON.stringify key approach works for serializable arguments; for functions or complex objects you'd need a Weaker key strategy. Compose vs pipe is a readability choice: pipe is more intuitive because it reads left-to-right in the order operations are applied. React's middleware pattern (like Redux middleware) is essentially function composition.

### Slide 5: Debounce and Throttle
**Visual:** Timeline diagram. Top: rapid event firing (scroll/keypress) shown as many vertical bars close together. Middle: Debounce — only the last event after a quiet period fires (one bar at the end). Bottom: Throttle — events fire at most once per interval (evenly spaced bars regardless of input rate).
**Content:**
- Both patterns rate-limit function calls from high-frequency event sources (scroll, resize, keypress)
- **Debounce** — delays execution until a quiet period has elapsed; cancels if called again too soon:
  ```js
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const searchHandler = debounce(query => fetchSearchResults(query), 300);
  // User types fast → only fires 300ms after they stop typing
  ```
- **Throttle** — ensures at most one execution per time window; fires on leading or trailing edge:
  ```js
  function throttle(fn, interval) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= interval) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  const scrollHandler = throttle(() => updateScrollPosition(), 100);
  // Fires at most every 100ms regardless of scroll speed
  ```
- **Exam distinction:**
  - **Debounce** = fire ONCE after activity stops (search input, form auto-save)
  - **Throttle** = fire at REGULAR intervals during activity (scroll position, resize, game loop)
**Speaker Notes:** Debounce and throttle are among the most exam-tested function patterns in the JSI certification. The key mental model: debounce collapses a burst of calls into one call that fires after the burst ends. Throttle spaces out calls so they never exceed a rate. Both use closures to maintain state (timer ID for debounce, last-call timestamp for throttle) across invocations. Lodash provides polished implementations of both — in production you'd use lodash's versions which handle edge cases the simplified versions miss.

## Recording Script

Welcome to Lecture 17: Advanced Functions. Let's go deep on some of JavaScript's most powerful and exam-relevant function features.

`this` is one of JavaScript's most misunderstood features. The key insight: `this` depends on how a function is called, not where it is defined. In a method call, `this` is the owning object. In a constructor, `this` is the new instance. In a standalone function call, `this` is the global object or undefined in strict mode. Arrow functions are different — they inherit `this` from the surrounding scope at definition time. This is why arrow functions are perfect for callbacks inside methods.

`call()`, `apply()`, and `bind()` give you explicit control over `this`. Memory aid: Call takes individual Arguments, Apply takes an Array, Bind returns a Bound function. Arrow functions ignore all three for `this` purposes.

Currying transforms a multi-argument function into a chain of single-argument functions. `add(a)(b)` instead of `add(a, b)`. This enables partial application — pre-filling some arguments to create specialized functions. `multiply.bind(null, 2)` creates a `double` function. Bind is JavaScript's built-in partial application tool.

Memoization caches function results by argument. Wrap a pure function in a memoize utility, and repeated calls with the same arguments return the cached result instantly. Only valid for pure functions.

Function composition chains functions together. `pipe` applies them left to right; `compose` applies right to left. Use these to build data transformation pipelines from small pure functions.

Finally, debounce and throttle — these appear on the exam. Debounce fires once after activity stops — perfect for search-as-you-type. Throttle fires at most once per interval during continuous activity — perfect for scroll handlers. Know the difference.

## Exam Tips
- **`call` vs `apply`:** call takes individual args; apply takes an array — "Apply takes an Array"
- **`bind`** returns a new function, does not invoke — useful for event handlers and partial application
- **Arrow functions** cannot be rebound — `bind`, `call`, `apply` do not change their `this`
- **`this` in method extracted to variable:** loses binding — `const fn = obj.method; fn()` → `this` is wrong
- **Debounce** = fire once AFTER activity stops (search input); **Throttle** = fire at MAX RATE during activity (scroll)
- **Memoization** only valid for pure functions — impure functions produce cached stale results
- **Currying** = chain of unary functions; **partial application** = pre-filling some args (bind is built-in partial application)
- `compose` applies functions right-to-left; `pipe` applies left-to-right — pipe is more readable

## Lecture Summary
`this` is dynamically bound at call time for regular functions (global in standalone calls, owning object in method calls, new instance in constructors) and lexically fixed for arrow functions. `call(thisArg, ...args)` and `apply(thisArg, argsArray)` invoke immediately with explicit `this`; `bind(thisArg, ...partialArgs)` returns a permanently bound new function. Currying transforms multi-argument functions into chains of unary functions; partial application pre-fills arguments using `bind`. Memoization caches results by arguments using a Map, valid only for pure functions. Function composition chains pure functions — `pipe` left-to-right, `compose` right-to-left. Debounce delays execution until activity stops (search input); throttle limits execution rate during continuous activity (scroll handlers). Both use closures to maintain timer/timestamp state across invocations.

## Mini Quiz

**Question 1:** What is the output of the following code?
```js
const obj = { name: 'Alice' };
function greet() { return this.name; }
const bound = greet.bind(obj);
bound.call({ name: 'Bob' });
```

A) `'Alice'`
B) `'Bob'`
C) `undefined`
D) A TypeError is thrown

**Answer: A — `'Alice'`**
`bind()` creates a new function with `this` permanently set to `obj`. Once bound, `call`, `apply`, and even another `bind` cannot override the `this` context. The `call({ name: 'Bob' })` attempt to rebind is ignored, and `this.name` resolves to `obj.name` which is `'Alice'`.

---

**Question 2:** A developer wants to prevent a search API call from firing on every keystroke. The call should only fire 500ms after the user stops typing. Which pattern should they implement?

A) Throttle — limit to one call per 500ms during typing
B) Debounce — delay execution until 500ms after the last keystroke
C) Memoization — cache the previous search result
D) Partial application — pre-fill the API endpoint

**Answer: B — Debounce**
Debounce resets a timer on every call and only executes after the timer expires without another call. This is exactly the behavior described: fire once, 500ms after the user stops typing. Throttle would fire during typing at regular intervals, not wait for a quiet period. Memoization caches results but does not rate-limit calls. Partial application pre-fills arguments but does not control timing.

---

**Question 3:** A curried function `const add = a => b => a + b` is called as `const add3 = add(3)`. What is `add3`?

A) `6` — the result of adding 3 + 3
B) `NaN` — because b is undefined
C) A function that takes one argument `b` and returns `3 + b`
D) A function that takes two arguments and ignores the pre-filled 3

**Answer: C — a function waiting for `b`**
Currying works by returning a new function for each argument. `add(3)` executes the outer arrow function with `a = 3`, returning the inner arrow function `b => 3 + b`. The value `3` is captured in the closure. Calling `add3(5)` would return `8`. This is the core mechanic of currying and partial application.
