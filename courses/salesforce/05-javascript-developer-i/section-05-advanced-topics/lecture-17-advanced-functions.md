# Advanced Functions

## Exam Domain
Functions, Scope & Closures — ~11% of exam weight

## Core Concepts

### call, apply, bind — Explicit `this` Binding
```javascript
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'Alice' };

// .call(thisArg, arg1, arg2, ...) — invoke immediately, args individual
greet.call(user, 'Hello', '!');      // 'Hello, Alice!'

// .apply(thisArg, [arg1, arg2]) — invoke immediately, args as array
greet.apply(user, ['Hi', '?']);      // 'Hi, Alice?'

// .bind(thisArg, arg1, ...) — returns NEW function with bound `this`
const boundGreet = greet.bind(user, 'Hey');
boundGreet('.');  // 'Hey, Alice.' — user is locked in, '.' passed later
boundGreet('!');  // 'Hey, Alice!'
```

**Memory trick:**
- `call` → Comma-separated args
- `apply` → Array args
- `bind` → returns Bound function (doesn't call immediately)

### `this` Binding Rules (Priority Order)
```
1. new keyword          → new object
2. explicit bind/call/apply → provided thisArg
3. method call (obj.fn) → the object before the dot
4. default              → global (non-strict) or undefined (strict)
5. arrow function       → lexical this from enclosing scope (ignores all above)
```

```javascript
const obj = {
    name: 'Obj',
    regular() { return this.name; },   // this = obj when called as obj.regular()
    arrow: () => this.name,            // this = outer scope (module = undefined)
};

obj.regular();  // 'Obj'
obj.arrow();    // undefined (this is outer scope in strict module)

const fn = obj.regular;
fn();           // undefined (strict) — lost object context

fn.call(obj);   // 'Obj' — explicit binding restores context
```

### Currying
Transform a multi-argument function into a series of single-argument functions.
```javascript
// Manual curry
function multiply(a) {
    return function(b) {
        return a * b;
    };
}
const double = multiply(2);
const triple = multiply(3);
double(5); // 10
triple(5); // 15

// General curry utility
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...more) => curried(...args, ...more);
    };
}

const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3);   // 6
curriedAdd(1, 2)(3);   // 6
curriedAdd(1)(2, 3);   // 6
```

### Memoization
Cache results of expensive function calls — pure functions only (same input always produces same output).
```javascript
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

const expensiveCalc = memoize((n) => {
    // Simulated expensive computation
    return n * n;
});

expensiveCalc(5);  // computes, caches
expensiveCalc(5);  // returns cached (no recompute)
```

### Debounce & Throttle
```javascript
// Debounce — delays execution until N ms after LAST call
// Use: search input (only fire after user stops typing)
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

const onSearch = debounce((value) => fetchResults(value), 300);
// Typing rapidly: only fires 300ms after last keystroke

// Throttle — fires at most once per N ms (limits rate)
// Use: scroll handler, resize handler (at most once per 100ms)
function throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}

const onScroll = throttle(() => updatePosition(), 100);
```

### Function Composition
```javascript
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const process = pipe(
    data => data.filter(x => x.active),
    data => data.map(x => x.name),
    names => names.sort()
);
process(contacts);  // filter → map → sort
```

## Architecture / How It Works

### `this` in LWC — Summary
```
LWC component class (extends LightningElement):

Method defined as class field arrow:
  handleClick = (e) => {  ← arrow — `this` is always component instance
    this.count++;
  }
  ✓ Correct — safe as callback

Method defined as class method:
  handleClick(e) {  ← method — `this` depends on caller
    this.count++;
  }
  - Called via template onclick={handleClick} → LWC binds `this` correctly
  - Passed to addEventListener → `this` is lost (bind manually)
  - Passed to third-party library → `this` is lost (use arrow or bind)

Class field arrows consume more memory (one per instance) vs methods (shared on prototype)
```

### Debounce vs Throttle Decision
```
User is typing → debounce(fn, 300)   — run AFTER they stop
User is scrolling → throttle(fn, 100) — run at most 10x/second
Resize handler → throttle(fn, 200)   — limit reflow triggers
API rate limit → throttle(apiFn, 1000) — at most 1 call/second
```

**Limitations:**
- `bind` creates a new function — repeated `bind` in render methods causes unnecessary re-renders and GC pressure in LWC
- Memoization with `JSON.stringify(args)` key fails for object args with circular references or functions
- Debounce: the delayed call captures the `this` from when the debounced function was called — ensure correct binding
- Throttle with `Date.now()`: not accurate for very short intervals; use `requestAnimationFrame` for animation-rate throttling

## PTA / SA Relevance

**Code review flags:**
- `this.handleClick.bind(this)` in a render method or JSX — creates a new function on every render; define the bound function once in constructor or use class field arrow
- Missing debounce on search/autocomplete inputs — fires a server call on EVERY keystroke
- Missing throttle on scroll/resize handlers — fires potentially hundreds of times per second, causing jank

**Architecture guidance:**
- LWC search components should always debounce the `handleInputChange` event, typically 300ms, before calling Apex
- For LWC components that react to page scroll (sticky headers, lazy load): throttle the window scroll listener
- `call`/`apply`/`bind` appear on the exam; in practice they're mainly used for library code and testing utilities

**Customer scenario:** "Our search input makes too many server calls and users complain about lag." Fix: wrap the Apex search call in a debounce with 300-500ms delay. The component fires one call after the user pauses, not one per keystroke.

## Key Facts to Memorize
- `call` → immediate, comma args; `apply` → immediate, array args; `bind` → returns new function
- `this` priority: new > bind/call/apply > method call > default/undefined > arrow (lexical)
- Arrow functions IGNORE `call`/`apply`/`bind` for `this` — lexical `this` cannot be overridden
- Currying: multi-arg function → chain of single-arg functions
- Memoize: cache pure function results by input
- Debounce: fires after N ms of silence; Throttle: fires at most once per N ms

## Exam Traps
- Arrow function with `.bind(this)` — binding has NO effect on arrow functions
- `fn.call(null, args)` in strict mode → `this` = null; in non-strict → `this` = global
- `apply` and `call` invoke immediately; `bind` does NOT invoke
- Memoize only valid for PURE functions — functions with side effects or that depend on external state should NOT be memoized

## Practice Questions
**Q:** What does this print?
```javascript
function sayName() { return this.name; }
const alice = { name: 'Alice' };
const bob = { name: 'Bob' };
const bound = sayName.bind(alice);
console.log(bound.call(bob));
```
**A:** `'Alice'`. Once a function is bound with `.bind()`, the `this` is locked. Calling `.call(bob)` on a bound function does NOT override the binding.

**Q:** An LWC component attaches a window resize handler but causes performance issues. What pattern fixes it?
**A:** Throttle the handler. Wrap the resize logic: `this._resizeHandler = throttle(() => this.recalculateLayout(), 200)`. This limits the handler to fire at most every 200ms regardless of how fast resize events fire.

**Q:** What is the difference between debounce and throttle?
**A:** Debounce delays execution until N milliseconds after the LAST call — useful for search inputs (wait until user stops typing). Throttle ensures the function fires at most once per N milliseconds regardless of how many times it's called — useful for scroll/resize handlers (cap the rate, don't skip entirely).
