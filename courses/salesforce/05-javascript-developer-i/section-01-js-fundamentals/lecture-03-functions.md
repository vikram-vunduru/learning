# Lecture 03: Functions

## Learning Objectives
- Distinguish function declarations from function expressions and explain the hoisting difference
- Write arrow functions with both block-body and concise implicit-return syntax, and explain why arrow functions do not have their own `this`
- Use default parameters, rest parameters (`...args`), and the spread operator in function signatures and calls
- Explain what a closure is, identify where closures are created, and apply them in factory functions and module patterns
- Recognize the IIFE pattern and use higher-order functions (`map`, `filter`, `reduce`) fluently

## Slides

### Slide 1: Function Declarations vs Function Expressions
**Visual:** Two code blocks side by side. Left: a function declaration with a label "Hoisted — callable before definition." Right: a function expression (both regular and arrow) with a label "Not hoisted — must be defined first." Below each, a timeline diagram showing when the function becomes callable relative to the declaration line.
**Content:**
- **Function declaration** — uses the `function` keyword as the first token on the line; fully hoisted
```javascript
greet('Alice');  // works — declaration is hoisted
function greet(name) {
    return 'Hello, ' + name;
}
```
- **Function expression** — assigned to a variable; only the variable declaration is hoisted (as `undefined`)
```javascript
sayBye('Alice');  // TypeError: sayBye is not a function
const sayBye = function(name) {
    return 'Goodbye, ' + name;
};
```
- **Named function expressions** — the function name is only available inside the function body (for recursion)
- In LWC: component methods (`handleClick`, `connectedCallback`) are defined as class method syntax — similar to method shorthand in object literals
**Speaker Notes:** The hoisting difference between declarations and expressions is one of the most-tested topics in the JSI exam. A function declaration is fully available anywhere in its scope — even before the line it is written on. A function expression, because it is assigned to a variable, follows the variable's hoisting rules: `var`-based expressions hoist to `undefined` (causing a TypeError at call time), `let`/`const`-based expressions are in the Temporal Dead Zone. The practical rule: if you need to call a function before you define it in the file, use a declaration. Otherwise, expressions (especially arrow functions) are the modern preference.

### Slide 2: Arrow Functions — Syntax and Implicit Return
**Visual:** A transformation diagram showing the same function written four ways: full function declaration → function expression → arrow function with block body → arrow function with implicit return (single expression). Each step removes syntax, with annotations pointing to what was dropped. A final panel shows a one-liner arrow returning an object literal (the parenthesized `({})` trick).
**Content:**
- Full function expression → arrow function transformation:
```javascript
// Function expression
const double = function(n) { return n * 2; };

// Arrow function — block body
const double = (n) => { return n * 2; };

// Arrow function — implicit return (single expression)
const double = (n) => n * 2;

// Single parameter: parens optional
const double = n => n * 2;

// Returning an object literal: wrap in parens
const makeObj = (n) => ({ value: n });
```
- No `arguments` object in arrow functions — use rest parameters instead
- Arrow functions cannot be used as constructors (`new arrowFn()` throws)
- LWC: event handlers defined as arrow functions in a class body are the standard pattern:
  `handleClick = (event) => { this.doSomething(); }`
**Speaker Notes:** The implicit return syntax is a significant readability win for array methods — `arr.map(n => n * 2)` is far cleaner than writing a full function. The parenthesized object literal trick `(n) => ({ value: n })` is a common source of bugs and exam questions: without the outer parentheses, the curly brace is interpreted as a block body, not an object literal. Arrow functions also have no `arguments` object — the traditional `arguments` keyword that holds all passed parameters does not exist in arrows. Use rest parameters (`...args`) instead.

### Slide 3: Arrow Functions — `this` Binding
**Visual:** A split diagram showing two scenarios. Left: a class with a regular function method used as an event listener — `this` is shown pointing to the DOM element (wrong). Right: the same handler as an arrow function — `this` is shown pointing to the class instance (correct). A timeline at the bottom shows when `this` is determined for each type.
**Content:**
- Regular functions: `this` is determined at **call time** — depends on how the function is invoked
- Arrow functions: `this` is determined at **definition time** — captured from the surrounding lexical scope
- In class methods: arrow function properties capture `this` as the class instance
```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }

    // Regular method: this could be wrong if passed as callback
    start() {
        setInterval(function() {
            this.seconds++;  // 'this' is NOT Timer — it's window or undefined
        }, 1000);
    }

    // Arrow function: this is always the Timer instance
    startFixed() {
        setInterval(() => {
            this.seconds++;  // 'this' IS the Timer instance
        }, 1000);
    }
}
```
- In LWC, always use arrow functions for callbacks and event handlers to preserve `this` as the component
**Speaker Notes:** This is the single most important concept about arrow functions — and one of the highest-frequency JSI exam topics. Regular functions get a new `this` every time they are called; the value depends on the call site. When you pass a regular method as a callback to `addEventListener` or `setInterval`, it gets called by the browser, not by your object, so `this` is either `window` or `undefined` in strict mode. Arrow functions capture `this` from the surrounding lexical scope at definition time — the enclosing class or function. In LWC, which uses strict mode, a regular function callback gives you `this === undefined`. An arrow function gives you the component instance. This is why LWC developers always use arrow functions for handlers.

### Slide 4: Default Parameters and Rest Parameters
**Visual:** Two code panels. Top: a function with default parameters, showing both the ES6 syntax and the old-style `var name = name || 'default'` alternative, with annotations on why the ES6 version is cleaner and handles `undefined` explicitly. Bottom: a rest parameter function with a call using three, five, and zero extra arguments to show the `args` array content in each case.
**Content:**
- **Default parameters** — evaluated at call time when the argument is `undefined`
```javascript
function createContact(name, role = 'User', active = true) {
    return { name, role, active };
}
createContact('Alice');               // { name: 'Alice', role: 'User', active: true }
createContact('Bob', 'Admin');        // { name: 'Bob', role: 'Admin', active: true }
createContact('Carol', undefined, false);  // role defaults, active is false
```
- Defaults are skipped only for `undefined`, not `null` — passing `null` uses `null`, not the default
- **Rest parameters** — collects remaining arguments into a real array
```javascript
function logAll(label, ...items) {
    items.forEach(item => console.log(label, item));
}
logAll('Account:', acc1, acc2, acc3);  // items = [acc1, acc2, acc3]
```
- Rest parameter must be **last** in the parameter list
- Unlike `arguments`, the rest array is a true Array with all array methods
**Speaker Notes:** Default parameters are evaluated each time the function is called, not once at definition time — and only when the argument is `undefined`. This matters when the default is an expression or a function call. Passing `null` explicitly does not trigger the default: `createContact('Alice', null)` gives role as `null`, not `'User'`. The rest parameter distinction from `arguments` is important for the exam: `arguments` is array-like but not an array — you cannot call `.map()` on it. The rest parameter `...items` is a real Array. Arrow functions do not have `arguments` at all; they only work with rest parameters.

### Slide 5: Spread Operator
**Visual:** Three use case panels stacked vertically: (1) spreading an array into function arguments, (2) copying and merging arrays, (3) copying and merging objects. Each shows the before (verbose alternative) and after (spread syntax), with an annotation on the object spread panel showing that later properties win when keys conflict.
**Content:**
- Same syntax as rest (`...`) but used at the **call site** or in **literals**, not in parameter lists
- **Spread into function call:**
```javascript
const numbers = [1, 2, 3];
Math.max(...numbers);     // equivalent to Math.max(1, 2, 3)
```
- **Copy and merge arrays:**
```javascript
const copy = [...original];                  // shallow copy
const merged = [...arr1, ...arr2, extra];    // merge + add element
```
- **Copy and merge objects (ES2018):**
```javascript
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { lang: 'fr', fontSize: 14 };
const config = { ...defaults, ...userPrefs };
// { theme: 'light', lang: 'fr', fontSize: 14 } — userPrefs wins
```
- Spread creates a **shallow copy** — nested objects are still shared by reference
- LWC: spread is used to create new state objects to trigger reactive property updates
**Speaker Notes:** The spread operator and rest parameters use identical syntax — the context determines which is which. In a function parameter list: rest. Everywhere else: spread. The shallow copy behavior is crucial: when you spread an object containing a nested object, the top-level properties are copied, but the nested object is still the same reference. Mutating the nested object affects both the original and the copy. In LWC's reactive system, you sometimes need to spread objects to create a new reference that triggers a re-render. For example, instead of `this.config.theme = 'dark'` (which may not trigger reactivity), you write `this.config = { ...this.config, theme: 'dark' }`.

### Slide 6: Closures — What They Are and Why They Matter
**Visual:** A diagram showing two nested boxes representing scope: outer function scope contains a variable `count`, inner function scope contains the increment logic. An arrow from the inner function to `count` is labeled "closure — inner function holds a reference to outer scope." Below, a timeline showing that the outer function has returned but `count` still exists because the inner function references it.
**Content:**
- A **closure** is a function that retains access to its **lexical scope** even after the outer function has returned
- Created every time a function is defined inside another function
- The inner function closes over the variables it references — those variables stay alive as long as the inner function exists
```javascript
function makeCounter() {
    let count = 0;              // private — not accessible from outside
    return {
        increment() { count++; },
        decrement() { count--; },
        value()     { return count; }
    };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value());  // 2
// count is not accessible directly — it is private to the closure
```
- `count` lives on in memory because the returned object's methods still reference it
- Closures enable **data encapsulation** — private state without classes
**Speaker Notes:** A closure is not a special syntax; it is a consequence of lexical scoping. Whenever you define a function inside another function, the inner function has access to the outer function's variables — even after the outer function has finished executing. The garbage collector knows not to clean up `count` because the three methods still hold references to it. This is the mechanism behind counter factories, memoization, and the module pattern. For the exam, be able to trace which variables a closure captures and what value they hold at any given call time.

### Slide 7: IIFE Pattern and Higher-Order Functions
**Visual:** Left panel: an IIFE (Immediately Invoked Function Expression) with annotations showing the wrapping parentheses and the invoking parentheses. Arrow labels show what creates a new scope and why variables inside do not pollute global scope. Right panel: a `map`/`filter`/`reduce` chain working on an array of account objects, with a callout showing that each takes a function as an argument (higher-order function).
**Content:**
- **IIFE** — executes immediately, creates a private scope, discards the function reference
```javascript
(function() {
    const privateVar = 'not global';
    console.log('IIFE ran');
})();
// privateVar is not accessible here

// Arrow IIFE
(() => {
    // private block
})();
```
- Modern alternative: block scoping with `let`/`const` mostly replaces IIFE for scope isolation
- IIFE is still used for module bootstrapping and SDK init code
- **Higher-order functions** — functions that take or return other functions:
  - `Array.prototype.map(fn)` — transforms each element, returns new array
  - `Array.prototype.filter(fn)` — keeps elements where fn returns truthy
  - `Array.prototype.reduce(fn, init)` — folds array to single value
```javascript
const accounts = [{name:'Acme',revenue:50000},{name:'Initech',revenue:20000}];
const names = accounts.map(a => a.name);               // ['Acme', 'Initech']
const large = accounts.filter(a => a.revenue > 30000); // [{name:'Acme',...}]
const total = accounts.reduce((sum, a) => sum + a.revenue, 0); // 70000
```
**Speaker Notes:** The IIFE pattern was the pre-ES6 way to create private scope — before `let`, `const`, and modules. You still encounter it in legacy code and SDK init scripts. For the exam, recognize the two pairs of parentheses: the first wraps the function expression (making it callable), the second invokes it immediately. Higher-order functions are the backbone of functional programming in JavaScript and appear extensively in LWC data processing. `map`, `filter`, and `reduce` are the three you must know deeply — their callback signatures, what they return, and whether they mutate the original array (they do not — they return new arrays).

### Slide 8: Closures in LWC — Factory Functions and Real Patterns
**Visual:** An LWC snippet showing a component that creates event handler functions using a factory function — generating a specific handler for each item in a list. Annotations connect the factory pattern to the closure concept: the generated handler "closes over" the item's ID.
**Content:**
```javascript
// Factory function — generates a specific handler per record
function makeDeleteHandler(recordId) {
    return () => {
        // This function closes over recordId
        this.deleteRecord(recordId);
    };
}

// In LWC context:
export default class RecordList extends LightningElement {
    @api records;

    get recordHandlers() {
        return this.records.map(record => ({
            ...record,
            onDelete: () => this.handleDelete(record.Id)  // closure over record.Id
        }));
    }

    handleDelete(id) {
        // id is captured from the map callback's closure
        deleteRecord(id);
    }
}
```
- Each arrow function in the `map` callback closes over its own `record` object
- Closures power event delegation, memoization, and debounce utilities in LWC
- Common in LWC: wrapping an Apex call in a closure to retry with captured parameters
**Speaker Notes:** This slide ties the abstract closure concept to real LWC code. When you generate handlers in a `map` call, each handler function closes over the `record` variable from that iteration — so when the user clicks delete on row 3, the handler for row 3 fires with row 3's ID. This works correctly because `const` and `let` inside a loop create a new binding per iteration. We will cover the classic closure-in-a-loop bug extensively in the next lecture — where using `var` instead of `let` causes all handlers to capture the same final value.

## Recording Script
Welcome to Lecture 3. Functions are the most important topic in the entire JSI exam — they appear in every other domain, and understanding them deeply is what separates a solid exam performance from a guess-based one.

Let us start with the declaration-versus-expression split. A function declaration — where the `function` keyword is first on the line — is fully hoisted. You can call it before the line where it is defined, and it works. A function expression assigns a function to a variable, and like any variable, only the declaration is hoisted — not the assignment. So calling a `const`-declared arrow function before its definition throws a ReferenceError in the Temporal Dead Zone. Know this cold.

Arrow functions are the modern syntax for function expressions, and they come with two transformative features. First, the concise implicit-return syntax: `n => n * 2` is a complete function with no braces and no `return` keyword. When the body is a single expression, the result is implicitly returned. When returning an object literal, wrap it in parentheses: `n => ({ value: n })` — the outer parens tell the parser this is a parenthesized expression, not a block body.

Second — and this is crucial for LWC — arrow functions do not have their own `this`. They inherit `this` from the enclosing lexical scope. In a class method, an arrow function captures `this` as the class instance. A regular function callback passed to `setTimeout` or an event listener gets called by the browser, and in strict mode, `this` is `undefined`. This is why every LWC developer writes arrow functions for event handlers. The exam will absolutely test this.

Default parameters are evaluated when the argument is `undefined`. Passing `null` does not trigger the default. Rest parameters collect remaining arguments into a real array — unlike the legacy `arguments` object, you get `.map()`, `.filter()`, and all array methods. Spread goes the other direction — it unpacks an array or object into individual elements. Same three dots, opposite direction: rest collects, spread expands.

Closures: a function that retains access to variables from its outer scope even after the outer function has returned. The garbage collector keeps those variables alive because the inner function still holds references to them. This powers private state, factory functions, memoization, and the module pattern. Every time you write a function inside another function, you have created a closure.

The IIFE — immediately invoked function expression — executes once and creates a private scope. Two pairs of parentheses: one wraps the function, one calls it. Still used in SDK initialization code, though mostly replaced by modules and block scoping.

Higher-order functions: `map` transforms, `filter` selects, `reduce` folds. None of them mutate the original array. They are essential for processing wire adapter data in LWC and they show up constantly on the exam. Know the callback signatures: `map((element, index, array) => ...)`, `filter((element) => boolean)`, `reduce((accumulator, current) => ..., initialValue)`.

## Exam Tips
- Function **declarations** are fully hoisted; function **expressions** are not — calling an expression before its `const`/`let` declaration throws a ReferenceError (TDZ).
- Arrow functions have **no own `this`** — they inherit `this` lexically. Regular function callbacks lose `this` when passed as event handlers or to `setTimeout`. This is one of the highest-frequency JSI exam topics.
- Arrow functions also have **no `arguments` object** — use rest parameters (`...args`) instead.
- Passing `null` to a parameter with a default value does **not** trigger the default. Only `undefined` triggers defaults.
- Spread creates a **shallow copy** — nested objects are shared by reference. Mutating a nested object in the copy also mutates the original.
- `map`, `filter`, and `reduce` do **not mutate** the original array — they return new arrays (or a single reduced value for `reduce`).

## Lecture Summary
Function declarations are fully hoisted; function expressions follow their variable's hoisting rules — a critical behavioral difference. Arrow functions offer concise syntax (including implicit return for single expressions) and lexically capture `this` from the defining scope, making them essential for LWC event handlers where `this` must refer to the component instance. Default parameters handle `undefined` arguments at call time; rest parameters collect extra arguments into a real Array (unlike `arguments`); and the spread operator expands iterables or objects at the call site or in literals. Closures — inner functions retaining access to outer scope variables — power data encapsulation, factory functions, and memoization patterns. The IIFE pattern creates an immediately executed private scope, and higher-order functions (`map`, `filter`, `reduce`) accept functions as arguments to transform arrays without mutation.

## Mini Quiz

**Q1:** What is the output of the following code?
```javascript
console.log(add(2, 3));
console.log(multiply(2, 3));

function add(a, b) { return a + b; }
const multiply = (a, b) => a * b;
```
A) `5`, `6`
B) `5`, ReferenceError
C) TypeError, `6`
D) ReferenceError, ReferenceError
**Answer:** B — `add` is a function declaration and is fully hoisted, so calling it before the declaration works and returns `5`. `multiply` is an arrow function expression assigned to a `const` variable. Accessing a `const` before its declaration throws a ReferenceError because the variable is in the Temporal Dead Zone.

**Q2:** What does the following code log, and why?
```javascript
function makeAdder(x) {
    return (y) => x + y;
}
const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(3));
console.log(add10(3));
console.log(add5(7));
```
A) `8`, `13`, `12`
B) `8`, `8`, `8`
C) `3`, `3`, `3`
D) `15`, `15`, `15`
**Answer:** A — `makeAdder` is a factory function. Each call creates a new closure capturing the specific value of `x`. `add5` closes over `x = 5`: `add5(3)` returns `5 + 3 = 8`. `add10` closes over `x = 10`: `add10(3)` returns `10 + 3 = 13`. `add5` still has its own `x = 5`, so `add5(7)` returns `5 + 7 = 12`. The two closures are independent.

**Q3:** An LWC component has the following code. What happens when a user clicks the button after 2 seconds, and why?
```javascript
export default class Demo extends LightningElement {
    name = 'Salesforce';

    handleClick() {
        setTimeout(function() {
            console.log('Hello', this.name);
        }, 2000);
    }
}
```
A) Logs `"Hello Salesforce"` after 2 seconds
B) Logs `"Hello undefined"` after 2 seconds because `this.name` is undefined in strict mode
C) Throws a TypeError after 2 seconds because `this` is `undefined` in a regular function callback in strict mode (LWC uses strict mode)
D) Logs `"Hello "` with an empty string because `name` is not yet set
**Answer:** C — LWC components run in strict mode. When `setTimeout` calls the regular function callback, `this` is `undefined` (strict mode; in non-strict it would be `window`). Accessing `.name` on `undefined` throws a TypeError. The fix is to use an arrow function: `setTimeout(() => { console.log('Hello', this.name); }, 2000)` — the arrow function captures `this` from `handleClick`'s lexical context, which is the component instance.
