# Lecture 04: Scope, Hoisting & Closures

## Learning Objectives
- Describe global, function, and block scope and explain how nested scopes form a scope chain
- Trace how `var` declarations are hoisted and initialized to `undefined`, and how function declarations are fully hoisted
- Explain the Temporal Dead Zone for `let` and `const` and identify code that triggers a TDZ error
- Define lexical scope and describe how the JavaScript engine resolves variable names by walking up the scope chain
- Implement closures in factory functions, the module pattern, and memoization
- Identify and fix the classic loop-var closure pitfall using `let` or an IIFE

## Slides

### Slide 1: Global, Function, and Block Scope
**Visual:** A set of three nested boxes, largest to smallest: Global Scope (outermost, light gray) → Function Scope (medium, blue) → Block Scope (innermost, orange). Each box contains sample variable declarations. Arrows from inner boxes point outward labeled "can access." A red X arrow from outer boxes pointing inward labeled "cannot access inner scope."
**Content:**
- **Global scope** — variables declared outside any function or block; accessible everywhere
  - In browsers: globals are properties of `window`
  - In Node.js: globals are properties of `global`
  - `var` at the top level becomes a global; `let`/`const` at the top level do NOT become window properties
- **Function scope** — variables declared inside a function (with `var`, `let`, or `const`) exist only within that function
- **Block scope** — variables declared with `let` or `const` inside `{}` exist only in that block
```javascript
var globalVar = 'global';     // window.globalVar in browsers
let globalLet = 'not on window';

function outer() {
    var funcVar = 'function scoped';
    if (true) {
        let blockLet = 'block scoped';
        console.log(funcVar);    // accessible
        console.log(globalVar);  // accessible
    }
    console.log(blockLet);  // ReferenceError — blockLet out of scope
}
```
**Speaker Notes:** Scope determines where a variable is accessible. The hierarchy is global → function → block, with inner scopes able to read outer scopes but not the reverse. This is lexical scope — determined by where you write the code, not by how the code runs. The key difference for `var` vs `let`/`const` at the top level: `var` becomes a property of the global object, `let`/`const` do not. This matters for avoiding accidental globals in browser environments, which is one reason `var` is discouraged.

### Slide 2: Hoisting — var Declarations
**Visual:** Two-step animation diagram. Step 1 (Compilation phase): the `var` declarations are extracted and moved to the top of their function scope, shown as ghost arrows. Step 2 (Execution phase): execution runs top to bottom — the `var` variables exist but hold `undefined` until the assignment line is reached. A timeline along the bottom marks "declared," "initialized to undefined," and "assigned."
**Content:**
- Hoisting is JavaScript's behavior of processing declarations before execution begins
- `var` declarations are hoisted to the top of their **function scope** and initialized to `undefined`
- The **assignment** is NOT hoisted — only the declaration
```javascript
console.log(x);  // undefined — hoisted, not yet assigned
var x = 5;
console.log(x);  // 5

// What the engine actually sees:
var x;           // hoisted to top
console.log(x);  // undefined
x = 5;
console.log(x);  // 5
```
- In a function, `var` hoists to the top of the function (not to the top of a nested block)
- Common bug: `var` in an `if` block hoists out of the block into the function scope
**Speaker Notes:** Hoisting is one of the most frequently tested and most commonly misunderstood JavaScript behaviors. The mental model: during a compilation pass, the JavaScript engine finds all `var` declarations and registers them at the top of their scope, initialized to `undefined`. Then, during execution, the code runs top to bottom and the assignments happen at the original lines. The declaration is moved up; the value assignment stays in place. This is why reading a `var` before its assignment gives you `undefined` instead of a ReferenceError — the variable exists, it just hasn't been assigned yet.

### Slide 3: Hoisting — Function Declarations
**Visual:** Two code examples. Left: a function declaration being called before the definition — works. Right: a function expression assigned to `const` being called before definition — throws ReferenceError. Below each, the "hoisted view" showing what the engine sees before execution begins.
**Content:**
- **Function declarations are fully hoisted** — both the declaration AND the function body
- Available anywhere in their scope, including before the written definition
```javascript
// Works — declaration fully hoisted
sayHello();
function sayHello() { console.log('Hello!'); }

// Fails — const expression is in TDZ
greet();   // ReferenceError
const greet = () => console.log('Hi!');
```
- Functions and variables with the same name: function wins
```javascript
console.log(typeof foo);  // "function" — function declaration wins over var
var foo = 'string value';
function foo() {}
```
- Inner function declarations (declared inside another function) hoist to the top of that function
**Speaker Notes:** Function declarations are special: the entire function — name and body — is hoisted. This is why calling a function before its definition is valid JavaScript and not a bug. Function expressions assigned to variables follow the variable's hoisting rules. The name collision rule (function declaration wins over `var` when both have the same name) is a classic exam trap — and another reason to avoid `var`. In modern JavaScript, mixing `var` and function declarations with the same name should never happen in real code.

### Slide 4: Temporal Dead Zone (TDZ) — let and const
**Visual:** A vertical timeline for a block of code. A `let` variable's lifecycle is shown in three phases: TDZ (top of block to declaration line — red zone, accessing throws ReferenceError), Declared-and-initialized (at the declaration line), and Accessible (after). The TDZ zone is highlighted in red with a "ReferenceError if accessed" label.
**Content:**
- `let` and `const` are hoisted (the engine knows they exist), but NOT initialized until the declaration line
- Accessing them in the TDZ (between the start of their block and the declaration) throws a **ReferenceError**
- This is by design — it prevents the confusing `undefined` behavior of `var`
```javascript
{
    console.log(name);  // ReferenceError: Cannot access 'name' before initialization
    let name = 'Alice';
    console.log(name);  // 'Alice'
}
```
- TDZ also applies to function parameters with default values referencing earlier parameters:
```javascript
function f(a = b, b = 1) { }  // ReferenceError: b used before initialized
```
- `typeof` in the TDZ also throws (unlike with undeclared variables, where typeof returns `"undefined"`)
**Speaker Notes:** The Temporal Dead Zone is a safety net. With `var`, accessing a variable before assignment silently gives you `undefined` — a bug that can be very hard to track. With `let` and `const`, you get an immediate, clear error. The name "temporal dead zone" refers to the time between when the block is entered and when the declaration is executed — the variable exists in the engine's knowledge but is in a dead, inaccessible state. The `typeof` behavior in the TDZ is a subtle exam trap: `typeof undeclaredVariable` returns `"undefined"` without throwing, but `typeof` a `let` variable in its TDZ throws a ReferenceError.

### Slide 5: Lexical Scope and the Scope Chain
**Visual:** Three nested boxes representing three scope levels: global, `outerFn`, `innerFn`. Each box shows its local variables. Arrows from `innerFn` walk up the chain: first checks own scope, then `outerFn` scope, then global scope. A lookup for each variable is traced with colored arrows showing at which level it is resolved.
**Content:**
- **Lexical scope** — scope is determined by where the code is written, not where it is executed
- When the engine looks up a variable, it checks the current scope, then walks up through parent scopes until it finds the variable or reaches global scope
- This chain of scopes is the **scope chain**
```javascript
const globalMsg = 'global';

function outer() {
    const outerMsg = 'outer';

    function inner() {
        const innerMsg = 'inner';
        console.log(innerMsg);   // found in own scope
        console.log(outerMsg);   // not found locally — found in outer
        console.log(globalMsg);  // not found in outer — found in global
    }
    inner();
}
```
- Shadowing: declaring a variable in an inner scope with the same name as an outer scope variable hides the outer one in that inner scope
- LWC: component class properties are in the class instance scope; `this.propName` explicitly accesses the instance scope
**Speaker Notes:** Lexical scope is the rule that lets closures work. When a function is defined inside another function, the inner function's scope chain includes the outer function's scope. When the inner function is called — even after the outer function returns — the engine walks up the scope chain and finds the variables in the captured outer scope. This is not magic; it is a direct consequence of lexical scoping. Shadowing is a related concept: if you declare `let x = 5` inside a function that already has `x = 10` in outer scope, the inner `x` shadows the outer one — within that inner scope, `x` is `5`.

### Slide 6: Closures in Depth — Factory Functions and Module Pattern
**Visual:** Two code panels. Left: a counter factory function returning an object with increment/decrement/value methods, with an annotation showing the `count` variable living in memory because the methods reference it. Right: the Module Pattern — an IIFE returning a public API while keeping private state hidden. An analogy caption: "Closures = private variables before ES6 classes existed."
**Content:**
- **Factory function:** Returns a new object with methods that close over shared private state
```javascript
function makeCounter(initial = 0) {
    let count = initial;       // private — not accessible from outside
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        reset()     { count = initial; },
        value()     { return count; }
    };
}
const c1 = makeCounter();
const c2 = makeCounter(10);  // independent state
c1.increment(); c1.increment();  // c1.value() = 2
// c2 is unchanged: c2.value() = 10
```
- **Module pattern** — IIFE with public API returned:
```javascript
const AccountUtils = (() => {
    const cache = new Map();  // private cache
    return {
        getAccount(id) { return cache.get(id); },
        setAccount(id, data) { cache.set(id, data); }
    };
})();
```
**Speaker Notes:** Factory functions and the module pattern are the two most important closure applications. Each call to `makeCounter` creates a brand-new `count` variable in a brand-new closure — so `c1` and `c2` have completely independent state. This is the closure-as-private-state pattern. The module pattern uses an IIFE to create a singleton with truly private internals — the cache in the example is completely inaccessible except through the two methods. ES6 classes now provide a cleaner syntax for this, but the closure mechanism underneath is identical.

### Slide 7: Memoization and the Classic Loop-var Closure Pitfall
**Visual:** Top half: a memoize function with a cache Map, showing how repeated calls with the same argument skip the calculation. Bottom half: the classic loop bug — three panels. Panel 1: broken code with `var i` in a loop creating click handlers. Panel 2: the output (all handlers log `3`). Panel 3: two fixes side-by-side — `let i` (new binding per iteration) and IIFE solution (captures `i` explicitly).
**Content:**
- **Memoization** — cache function results to avoid redundant computation:
```javascript
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}
const memoFib = memoize(fibonacci);
```
- **Classic loop-var bug:**
```javascript
// BROKEN — all handlers capture the same `i` reference
const handlers = [];
for (var i = 0; i < 3; i++) {
    handlers.push(function() { console.log(i); });
}
handlers[0]();  // 3 — not 0!
handlers[1]();  // 3
handlers[2]();  // 3
```
- `var` is function-scoped — there is ONE `i` shared by all closures; by the time handlers run, the loop is done and `i === 3`
- **Fix with `let`** — `let` creates a new binding per iteration:
```javascript
for (let i = 0; i < 3; i++) {
    handlers.push(() => console.log(i));  // 0, 1, 2 ✓
}
```
- **Fix with IIFE** — captures `i` by value in a new scope:
```javascript
for (var i = 0; i < 3; i++) {
    handlers.push((function(j) { return () => console.log(j); })(i));
}
```
**Speaker Notes:** The loop-var bug is the most famous closure pitfall in JavaScript and appears on virtually every JSI practice exam. The explanation: with `var`, there is only one `i` variable shared across all iterations — they all close over the same binding. By the time any handler is called, the loop has completed and `i` is `3`. With `let`, each iteration creates a fresh binding that the closure captures independently. The IIFE solution pre-dates `let` and works by passing `i` as an argument (creating a copy by value) to the IIFE. Understanding why this bug occurs — not just how to fix it — is what the exam tests.

### Slide 8: Putting It All Together — Scope in LWC Components
**Visual:** An LWC component class annotated with scope layers: class body scope (instance properties), method scopes, and a closure inside a lifecycle hook. Colored brackets show each scope boundary. An annotation points out where the TDZ would apply and where closures are formed in the lifecycle hook.
**Content:**
```javascript
// --- Global module scope ---
const MAX_RETRIES = 3;  // block/module scope — not window property

export default class DataLoader extends LightningElement {
    // --- Class instance scope (accessed via `this`) ---
    @api recordId;
    retryCount = 0;
    _data = null;

    connectedCallback() {
        // --- Method scope ---
        const onSuccess = (data) => {  // closure over `this`
            this._data = data;         // `this` is instance — arrow captures it
        };
        const onError = (err) => {     // another closure
            if (this.retryCount < MAX_RETRIES) {  // walks scope chain to module scope
                this.retryCount++;
                this.loadData();
            }
        };
        this.loadData(onSuccess, onError);
    }
}
```
- `MAX_RETRIES` is in module scope, not global scope — good practice
- Arrow functions in the lifecycle hook capture `this` (the component instance) via closure
- `onError` walks the scope chain: own scope → method scope → module scope → finds `MAX_RETRIES`
**Speaker Notes:** This slide synthesizes scope, closures, TDZ, and the LWC context into one coherent picture. Module-level constants like `MAX_RETRIES` are in module scope — they are not global variables, they are not `this` properties, but they are accessible throughout the file. Inside the lifecycle hook, the arrow function callbacks close over `this` from the method's lexical context. When `onError` references `MAX_RETRIES`, the engine walks up: not in `onError`'s scope, not in `connectedCallback`'s scope, found in module scope. This scope chain walk is invisible but fundamental to how every piece of JavaScript you write works.

## Recording Script
Welcome to Lecture 4 — the lecture that ties the last three together. Scope, hoisting, and closures are not separate topics; they are one integrated system. Understand this system, and every JavaScript behavior you encounter will make sense. Miss it, and you will spend your career confused by subtle bugs.

Let us start with scope. You have three layers. Global scope — variables declared outside any function or block. Function scope — variables declared inside a function. Block scope — variables declared with `let` or `const` inside any set of curly braces. The key rule: inner scopes can read from outer scopes, but not the reverse.

Hoisting. The JavaScript engine runs in two phases: a compilation phase where it scans for declarations, and an execution phase where it runs code top to bottom. During compilation, `var` declarations are moved to the top of their function scope and initialized to `undefined`. Function declarations are fully moved — name and body — so they are callable anywhere in their scope. `let` and `const` declarations are noted but left in the Temporal Dead Zone. If you access a `let` or `const` variable before its declaration line, you get a ReferenceError. This is a safety net, not a gotcha.

The TDZ is important: it exists because `var`'s silent `undefined` hoisting leads to bugs that are genuinely hard to find. The TDZ says "you declared it but you tried to use it too early — that is a mistake, here is your error." `typeof` on a TDZ variable also throws — different from an undeclared variable where `typeof` returns `"undefined"` without throwing.

Lexical scope and the scope chain. When the engine resolves a variable, it checks the current scope first, then walks up to the parent scope, and keeps going until it reaches global scope or throws a ReferenceError. This walk happens at runtime but is determined by where you wrote the code — that is what "lexical" means. Closures exist because functions carry their scope chain with them. When an inner function is returned from an outer function, the inner function keeps a reference to the outer function's scope. The outer function's local variables stay alive as long as the inner function exists.

The loop-var bug. This is the exam question you will definitely see. When you create a function inside a `var`-based loop — as a closure — all those functions close over the same `var` variable. By the time any of those functions runs, the loop has finished and the variable holds its final value. With `let`, each iteration creates a fresh binding. Each closure gets its own copy. The fix is simple: use `let` in the loop. But understanding WHY it is a bug — the shared binding — is what earns you the exam point.

## Exam Tips
- `var` hoisting means the variable exists from the top of its function but holds `undefined` until the assignment line. Accessing it early gives `undefined`, not a ReferenceError.
- `let` and `const` in the TDZ throw a ReferenceError if accessed before the declaration line — not `undefined`.
- `typeof` on an undeclared variable returns `"undefined"` without throwing. `typeof` on a TDZ `let`/`const` variable **does throw** a ReferenceError.
- The classic loop-var closure bug: `var` creates one shared binding across all loop iterations; all closures see the final value. Fix with `let` (new binding per iteration) or IIFE (captures current value by argument).
- Function declarations are fully hoisted (name + body); function expressions are not — they follow their variable's hoisting rules.
- Shadowing: a variable in an inner scope with the same name as an outer scope variable hides the outer variable within that inner scope only.

## Lecture Summary
JavaScript scope has three levels — global, function, and block — with inner scopes reading outer ones via the scope chain. Hoisting processes declarations before execution: `var` hoists to its function scope initialized as `undefined`; function declarations hoist entirely (callable before their definition); `let` and `const` hoist but remain in the Temporal Dead Zone until the declaration line, throwing a ReferenceError if accessed early. Lexical scope — scope determined by code location, not execution — is what makes closures possible: inner functions carry a reference to their enclosing scope chain, keeping outer variables alive as long as the inner function exists. The classic loop-var closure pitfall arises because `var` creates one binding shared by all iterations; using `let` creates a fresh binding per iteration, fixing the bug. Memoization and the module pattern are practical applications of closure-based private state.

## Mini Quiz

**Q1:** What does the following code output, and why?
```javascript
function test() {
    console.log(a);
    console.log(b);
    var a = 1;
    let b = 2;
}
test();
```
A) `undefined`, `undefined`
B) `undefined`, ReferenceError
C) `1`, `2`
D) ReferenceError, ReferenceError
**Answer:** B — `var a` is hoisted to the top of `test()` and initialized to `undefined`, so the first `console.log` prints `undefined`. `let b` is hoisted but is in the Temporal Dead Zone, so accessing it before the declaration line throws a ReferenceError. The second `console.log` is never reached.

**Q2:** What does the following code output?
```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
    funcs.push(() => console.log(i));
}
funcs[0]();
funcs[1]();
funcs[2]();
```
A) `0`, `1`, `2`
B) `0`, `0`, `0`
C) `3`, `3`, `3`
D) `undefined`, `undefined`, `undefined`
**Answer:** C — Because `var` is used, there is only one `i` variable in the function scope shared by all three closures. When the loop finishes, `i` is `3`. All three arrow functions close over the same `i` binding, so all three log `3`. If `let` were used instead of `var`, each iteration would create a new binding and the output would be `0`, `1`, `2`.

**Q3:** A developer writes the following module. Is the `cache` variable accessible from outside the module? What pattern is this, and what concept makes it work?
```javascript
const DataService = (() => {
    const cache = new Map();
    function fetchFromCache(key) { return cache.get(key); }
    function storeInCache(key, val) { cache.set(key, val); }
    return { fetchFromCache, storeInCache };
})();
```
A) Yes — `cache` is accessible as `DataService.cache` because IIFE return objects expose all local variables
B) No — `cache` is inaccessible from outside; this is the Module Pattern powered by closure; `cache` lives in the IIFE's scope which only the returned methods can access
C) No — `cache` is destroyed when the IIFE finishes executing because all local variables are garbage collected
D) Yes — `const` declarations inside IIFEs are automatically added to the returned object
**Answer:** B — `cache` is private. The IIFE executes once and its local scope (containing `cache`) is only accessible to the two methods returned in the object. The returned methods are closures: they hold references to the IIFE's scope, keeping `cache` alive in memory. But nothing outside the IIFE can reach `cache` directly — `DataService.cache` is `undefined`. This is the Module Pattern, and it works because of closure: inner functions retain access to the scope they were defined in.
