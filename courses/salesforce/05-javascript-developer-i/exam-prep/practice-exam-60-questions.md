# JSI Practice Exam — 60 Questions

**Exam:** Salesforce Certified JavaScript Developer I (CRT-600)  
**Time Limit:** 105 minutes  
**Passing Score:** 65% (39/60)  
**Format:** Multiple choice, single best answer

---

## Section 1: Variables, Types & Operators (7 questions)

**Q1.** Which statement correctly declares a block-scoped variable that cannot be reassigned?
A) `var name = 'Alice';`
B) `let name = 'Alice';`
C) `const name = 'Alice';`
D) `static name = 'Alice';`
**Answer: C** — `const` declares a block-scoped binding that cannot be reassigned. Note: `const` for objects means the reference is constant, not the contents.

**Q2.** What does `typeof null` return?
A) `"null"`
B) `"undefined"`
C) `"object"`
D) `"boolean"`
**Answer: C** — This is a long-standing JavaScript bug. `typeof null` returns `"object"` despite null being a primitive. Always use `value === null` to check for null.

**Q3.** What is the result of `0.1 + 0.2 === 0.3`?
A) `true`
B) `false`
C) `TypeError`
D) `NaN`
**Answer: B** — Floating-point arithmetic. `0.1 + 0.2` evaluates to `0.30000000000000004`. Use `Math.abs(a - b) < Number.EPSILON` for float comparisons.

**Q4.** What does the nullish coalescing operator (`??`) return?
A) The right-hand value if the left-hand value is falsy
B) The right-hand value if the left-hand value is null or undefined
C) The right-hand value if the left-hand value is false or 0
D) Always the left-hand value
**Answer: B** — `??` only triggers on `null` or `undefined`. Unlike `||`, it does NOT trigger on `0`, `''`, or `false`.

**Q5.** What is the output of the following code?
```js
console.log(x);
var x = 5;
```
A) `5`
B) `ReferenceError`
C) `undefined`
D) `null`
**Answer: C** — `var` declarations are hoisted to the top of their scope and initialized to `undefined`. The declaration is hoisted but not the assignment.

**Q6.** Which equality check correctly handles both `null` and `undefined` without matching `0` or `''`?
A) `value == false`
B) `value == null`
C) `value === undefined`
D) `!value`
**Answer: B** — `value == null` (loose equality) is true for both `null` and `undefined` and only those two values. This is one of the approved uses of `==` over `===`.

**Q7.** What is the result of `typeof NaN`?
A) `"NaN"`
B) `"undefined"`
C) `"number"`
D) `"object"`
**Answer: C** — `NaN` (Not a Number) has type `"number"`. Use `Number.isNaN(value)` to check for NaN — the global `isNaN()` coerces its argument first, which causes bugs.

---

## Section 2: Conditionals, Loops & Error Handling (8 questions)

**Q8.** In a `switch` statement, what happens if a `case` does not have a `break` statement?
A) The switch exits immediately after the case runs
B) A SyntaxError is thrown at runtime
C) Execution falls through to the next case
D) The `default` case runs next
**Answer: C** — Without `break`, execution "falls through" to the next `case` block, running that code too. This continues until a `break`, `return`, or the end of the `switch`.

**Q9.** Which loop is guaranteed to execute its body at least once?
A) `for` loop
B) `while` loop
C) `do...while` loop
D) `for...of` loop
**Answer: C** — The `do...while` loop checks its condition AFTER executing the body, so the body always runs at least once even if the condition is initially false.

**Q10.** What does `for...in` iterate over for an object?
A) The object's values
B) The object's Symbol keys only
C) The object's enumerable string property keys, including inherited ones
D) The object's own enumerable values only
**Answer: C** — `for...in` iterates over all enumerable string keys including inherited ones from the prototype chain. Use `Object.keys()` for own keys only.

**Q11.** What is the output?
```js
try {
    throw new TypeError('bad type');
} catch (e) {
    console.log(e instanceof TypeError);
    console.log(e.message);
} finally {
    console.log('done');
}
```
A) `true`, `'bad type'`, `'done'`
B) `true`, `'TypeError: bad type'`, `'done'`
C) `false`, `'bad type'`, `'done'`
D) Error — cannot throw inside try
**Answer: A** — `e instanceof TypeError` is true because we threw a TypeError. `e.message` is `'bad type'`. `finally` always runs. The full string `'TypeError: bad type'` is `e.toString()`, not `e.message`.

**Q12.** A developer wants to exit a nested loop immediately when a condition is met. Which approach is correct?
A) Use `break` without a label — it exits all loops
B) Use `return` — it exits the outer function which stops all loops
C) Use a labeled `break` to exit the outer loop
D) Throw an exception to unwind the call stack
**Answer: C** — A labeled `break` with the outer loop's label (`break outerLoop`) exits that specific loop. `break` without a label only exits the innermost loop. `return` works but exits the entire function.

**Q13.** Which Error subtype is thrown when accessing a property on `null` or `undefined`?
A) `ReferenceError`
B) `TypeError`
C) `RangeError`
D) `SyntaxError`
**Answer: B** — `TypeError` is thrown when a value is not of the expected type, including null/undefined property access. `ReferenceError` is for undeclared variables. `RangeError` is for out-of-range values (like invalid array length).

**Q14.** What is the correct way to re-throw an error to a caller while adding logging?
A) `throw e.message;`
B) `console.error(e); throw e;`
C) `return e;`
D) `console.error(e.message); throw new Error(e.message);`
**Answer: B** — Log the error and re-throw the original error object. Option A throws a string, not an Error — callers checking `instanceof Error` would fail. Option D creates a new error and loses the original stack trace.

**Q15.** What happens to variables declared inside a `catch` block after the block ends?
A) They remain accessible in the enclosing function scope
B) They are only accessible within the catch block (block-scoped)
C) They throw a ReferenceError if accessed outside the catch
D) Behavior depends on whether they were declared with var or let
**Answer: D** — `var` in a catch block is hoisted to function scope (accessible outside). `let` and `const` are block-scoped (not accessible outside). The catch parameter itself is scoped to the catch block.

---

## Section 3: Functions (11 questions)

**Q16.** What is the key difference between function declarations and function expressions regarding hoisting?
A) Both are fully hoisted — there is no difference
B) Function declarations are fully hoisted; function expressions only hoist their variable declaration
C) Function expressions are fully hoisted; function declarations are not hoisted at all
D) Neither is hoisted — both throw ReferenceError if called before definition
**Answer: B** — A function declaration (`function foo() {}`) is fully hoisted and can be called before its definition in the source code. A function expression (`const foo = function() {}`) only hoists the variable declaration (to `undefined`), not the function value.

**Q17.** What does an arrow function NOT have compared to a regular function?
A) A return value
B) Parameters
C) Its own `this`, `arguments`, `super`, and `new.target` bindings
D) Access to variables in the enclosing scope
**Answer: C** — Arrow functions inherit `this` from their lexical (enclosing) scope rather than having their own `this`. This makes them ideal for callbacks and methods in classes. They also cannot be used as constructors.

**Q18.** What is the output?
```js
const greet = (name = 'World') => `Hello, ${name}!`;
console.log(greet(null));
```
A) `'Hello, World!'`
B) `'Hello, null!'`
C) `'Hello, !'`
D) `TypeError`
**Answer: B** — Default parameters only apply for `undefined`, not `null`. Passing `null` explicitly gives `null`, which interpolates as the string `'null'`.

**Q19.** What is a closure?
A) A function that calls itself recursively
B) A function that has access to variables from its enclosing scope even after that scope has returned
C) A function that prevents access to outer variables
D) A function that only takes one argument
**Answer: B** — A closure is formed when a function "closes over" variables from its lexical scope. Those variables remain alive as long as the closure function is reachable.

**Q20.** What does the rest parameter (`...args`) collect?
A) All arguments including those with explicit parameter names
B) Only the remaining arguments after all named parameters have been assigned
C) Arguments passed as an array literal
D) Arguments from the arguments object
**Answer: B** — Rest parameters collect all remaining arguments into an array. They must be the last parameter. `function(a, b, ...rest)` — `rest` gets all arguments after `a` and `b`.

**Q21.** What is the output?
```js
function counter() {
    let count = 0;
    return () => ++count;
}
const inc = counter();
console.log(inc()); // ?
console.log(inc()); // ?
```
A) `1`, `1`
B) `1`, `2`
C) `0`, `1`
D) `undefined`, `undefined`
**Answer: B** — `counter()` returns an arrow function that closes over `count`. Each call to `inc()` increments and returns the same `count` variable. This is the classic counter closure pattern.

**Q22.** Which is the correct syntax for a rest parameter?
A) `function foo(args[])` 
B) `function foo(*args)`
C) `function foo(...args)`
D) `function foo(args...)`
**Answer: C** — The rest parameter syntax is `...args` (three dots before the parameter name), and it must be the last parameter. It collects remaining arguments into a true Array (unlike `arguments` which is array-like).

**Q23.** What does `Array.prototype.reduce` return if the initial value is omitted and the array has one element?
A) `undefined`
B) An empty array `[]`
C) The single element, without calling the callback
D) `0`
**Answer: C** — If no initial value is provided and the array has one element, `reduce` returns that element without calling the callback. If both initial value is omitted AND the array is empty, `reduce` throws a TypeError.

**Q24.** What is an IIFE and what problem does it solve?
A) Immediately Invoked Function Expression — creates a private scope to avoid polluting global scope
B) Iterative Invoked Function Expression — executes a function in a loop
C) Inline Instance Function Expression — creates a class method inline
D) Immutable Invocation Function Expression — creates a pure function
**Answer: A** — IIFE: `(function() { /* private code */ })()`. It creates a function scope that is immediately executed and then discarded, keeping variables private. ES modules largely replaced IIFEs for this purpose.

**Q25.** What is the output?
```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
const sum = doubled.reduce((acc, val) => acc + val, 0);
console.log(sum);
```
A) `6`
B) `12`
C) `[2, 4, 6]`
D) `NaN`
**Answer: B** — `map` produces `[2, 4, 6]`. `reduce` with initial value `0` sums them: `0 + 2 + 4 + 6 = 12`.

**Q26.** Which function uses `bind()` correctly?
A) `const fn = myMethod.bind();`
B) `const fn = myMethod.bind(context, arg1);`
C) `const fn = bind(myMethod, context);`
D) `const fn = myMethod.bind = context;`
**Answer: B** — `bind(thisArg, ...args)` returns a new function with `this` permanently bound to `thisArg` and optionally pre-applied arguments (partial application).

---

## Section 4: Classes & Modularity (15 questions)

**Q27.** What keyword is used to call the parent class constructor from a child class?
A) `parent()`
B) `base()`
C) `super()`
D) `this.constructor()`
**Answer: C** — In a derived class constructor, `super()` must be called before accessing `this`. It invokes the parent class constructor and establishes the prototype chain.

**Q28.** What is the output?
```js
class Animal {
    constructor(name) { this.name = name; }
    speak() { return `${this.name} makes a noise.`; }
}
class Dog extends Animal {
    speak() { return `${this.name} barks.`; }
}
const d = new Dog('Rex');
console.log(d.speak());
```
A) `'Rex makes a noise.'`
B) `'Rex barks.'`
C) `TypeError`
D) `undefined`
**Answer: B** — The `Dog` class overrides `speak()`. Method resolution starts at the instance's class, so `Dog.speak()` runs. To call the parent version, use `super.speak()`.

**Q29.** What syntax declares a private class field in JavaScript?
A) `private name;`
B) `#name;`
C) `_name;` (convention only)
D) `let name;` inside the class body
**Answer: B** — The `#` prefix creates a truly private field enforced by the language (not just a naming convention). It cannot be accessed outside the class body. `_name` is a convention with no enforcement.

**Q30.** What is the difference between a static method and an instance method?
A) Static methods can only be called on instances; instance methods can only be called on the class
B) Static methods belong to the class itself; instance methods belong to each instance and have access to `this`
C) Static methods are faster; instance methods are slower
D) There is no difference — static is just an alias for regular methods
**Answer: B** — Static methods are called on the class (`MyClass.myStaticMethod()`) and cannot access `this` as an instance. Instance methods are called on objects (`instance.myMethod()`) and `this` refers to the instance.

**Q31.** What is the prototype chain?
A) The order in which constructors are called during inheritance
B) A linked list of objects where each object's [[Prototype]] points to its parent, used for property lookup
C) The chain of Promises in async code
D) The list of methods defined on a class
**Answer: B** — When a property is not found on an object, JavaScript walks the prototype chain looking for it. `Object.prototype` is at the top — the chain's end. Classes create this chain automatically.

**Q32.** What is the output?
```js
const obj = { a: 1 };
const child = Object.create(obj);
child.b = 2;
console.log(child.a); // ?
console.log(child.hasOwnProperty('a')); // ?
```
A) `1`, `true`
B) `1`, `false`
C) `undefined`, `false`
D) `undefined`, `true`
**Answer: B** — `child.a` is `1` because `child`'s prototype is `obj`, so property lookup finds `a` on the prototype. But `hasOwnProperty('a')` returns `false` because `a` is not on `child` directly — only `b` is.

**Q33.** What does the `export default` syntax do in an ES module?
A) Creates a named export called "default"
B) Exports a single unnamed binding — imported with any name the importer chooses
C) Makes all module exports available as a namespace
D) Exports a class or function as the module's entire content, replacing all named exports
**Answer: B** — `export default` creates a default export that can be imported with any identifier: `import MyName from './module.js'`. A module can have only one default export but multiple named exports.

**Q34.** What is the difference between CommonJS `require()` and ES Module `import`?
A) `require` is synchronous and returns the whole module; `import` is asynchronous by default and supports live bindings
B) They are identical — `import` is just newer syntax for `require`
C) `require` only works in Node.js; `import` only works in browsers
D) `require` supports tree shaking; `import` does not
**Answer: A** — `require` is synchronous (blocks while loading), evaluated at runtime. `import` is static (analyzed at parse time), enables live bindings (imported values reflect changes to the export), and supports tree shaking. Dynamic `import()` is the async version.

**Q35.** What does `Symbol.iterator` enable?
A) A way to compare two objects by value
B) A method to make an object iterable with `for...of` and the spread operator
C) A unique symbol for use as an object key
D) A way to define custom equality for `===`
**Answer: B** — An object with a `[Symbol.iterator]()` method that returns an iterator is "iterable." `for...of`, spread (`[...obj]`), destructuring, and `Array.from()` all rely on this protocol.

**Q36.** A generator function using `function*` and `yield` is best described as:
A) A function that runs all at once and returns an array of values
B) A function that returns a Promise for each yielded value
C) A function that can be paused and resumed, yielding values lazily on demand
D) A function that runs in a separate thread
**Answer: C** — Generators are functions that can be paused at `yield` points. Calling `.next()` on the generator object resumes execution until the next `yield` (or `return`). This enables lazy sequences and infinite iterators.

**Q37.** What is tree shaking in the context of ES modules?
A) Removing deeply nested objects from data structures
B) Deleting unused branches from a decision tree algorithm
C) A bundler optimization that removes unused exports from the final bundle
D) A DOM operation that removes detached nodes
**Answer: C** — Tree shaking is performed by bundlers (webpack, Rollup, esbuild) by analyzing static `import` statements and removing exports that are never imported anywhere. Named exports are more tree-shakeable than default exports.

**Q38.** What is `dynamic import()` used for?
A) Importing a module at parse time for faster startup
B) Conditionally loading a module at runtime — returns a Promise
C) Importing multiple modules simultaneously with Promise.all
D) Bypassing the module system to load scripts via XHR
**Answer: B** — `import('./module.js')` is the dynamic import syntax. It returns a Promise that resolves to the module namespace. Used for code splitting, conditional loading based on feature flags, and lazy-loading routes.

**Q39.** What is a mixin in JavaScript class patterns?
A) A class that can only be instantiated once (singleton)
B) A pattern for sharing methods across multiple classes without inheritance using Object.assign
C) A private method that mixes its result with the parent class result
D) A TypeScript-specific feature for combining interfaces
**Answer: B** — Since JavaScript has single prototype inheritance, mixins copy methods from one or more source objects into a class prototype using `Object.assign(Target.prototype, SourceMixin)`. This simulates multiple inheritance.

**Q40.** What is the output?
```js
import { useState } from 'lwc';
```
A) Valid ES module import — imports `useState` from the LWC framework
B) SyntaxError — LWC does not use named exports
C) This is not valid LWC syntax — LWC uses `import { LightningElement } from 'lwc'`
D) Valid — but `useState` would be `undefined` since LWC doesn't export it
**Answer: C/D** — LWC exports `LightningElement`, `api`, `track`, `wire` from `'lwc'`. `useState` is from React, not LWC. In an interview/exam context, this tests whether candidates conflate LWC with React patterns.

**Q41.** In LWC, what does the `$` prefix on a `@wire` parameter mean?
```js
@wire(getRecord, { recordId: '$recordId' })
```
A) It marks the parameter as required
B) It makes the parameter reactive — the wire re-runs when `recordId` changes
C) It passes `recordId` as a string literal rather than a property reference
D) It prevents the wire from caching the result
**Answer: B** — The `$` prefix makes a wire parameter reactive. Without `$`, the value is read once at mount time. With `$`, the wire service re-runs the wire function whenever the referenced property changes.

---

## Section 5: Collections & Arrays (7 questions)

**Q42.** What is the output of the following sort?
```js
console.log([10, 9, 2, 1, 100].sort());
```
A) `[1, 2, 9, 10, 100]`
B) `[100, 10, 9, 2, 1]`
C) `[1, 10, 100, 2, 9]`
D) `TypeError — cannot sort numbers`
**Answer: C** — The default sort converts elements to strings and sorts lexicographically. `'10' < '2'` because `'1' < '2'`. For numeric sort, use `.sort((a, b) => a - b)`.

**Q43.** What does `Array.from({ length: 5 }, (_, i) => i * 2)` return?
A) `[0, 1, 2, 3, 4]`
B) `[0, 2, 4, 6, 8]`
C) `[2, 4, 6, 8, 10]`
D) `[undefined, undefined, undefined, undefined, undefined]`
**Answer: B** — `Array.from` with a mapFn creates an array. The mapFn receives `(value, index)`. Since the object has no actual values, `_` is `undefined` and `i` is `0..4`. So: `0*2, 1*2, 2*2, 3*2, 4*2 = [0, 2, 4, 6, 8]`.

**Q44.** What is the key difference between `Map` and a plain Object for storing key-value data?
A) Map only stores string keys; Object stores any type
B) Map maintains insertion order and allows any type as key; Object keys are always coerced to strings
C) Object is iterable with for...of; Map requires Object.entries()
D) Map is immutable; Object is mutable
**Answer: B** — Map allows any value as a key (objects, numbers, etc.) and maintains insertion order. Object keys are always strings or symbols. Map also has `.size` and is directly iterable.

**Q45.** Which statement about `Set` is correct?
A) A Set stores key-value pairs like a Map
B) A Set only stores unique values and uses `===` equality for primitives
C) A Set is ordered by value, not by insertion
D) A Set can contain duplicate primitive values if they are equal with `==`
**Answer: B** — A `Set` stores unique values. Duplicate attempts are silently ignored. Values are compared by `===` (reference equality for objects), so two objects with the same content are NOT duplicates unless they are the same reference.

**Q46.** What does `[1, [2, [3, [4]]]].flat(Infinity)` return?
A) `[1, [2, [3, [4]]]]` — flat without an argument does nothing
B) `[1, 2, [3, [4]]]`
C) `[1, 2, 3, 4]`
D) `TypeError — Infinity is not a valid depth`
**Answer: C** — `.flat(depth)` flattens nested arrays to the specified depth. `Infinity` fully flattens all nesting levels, producing a completely flat array. The default depth is `1`.

**Q47.** What is the output?
```js
const map = new Map();
const key = { id: 1 };
map.set(key, 'value');
console.log(map.get({ id: 1 }));
```
A) `'value'`
B) `undefined`
C) `null`
D) `TypeError`
**Answer: B** — Map uses reference equality for object keys. `{ id: 1 }` in `map.get()` is a NEW object, different from the `key` reference stored in the map. `map.get(key)` (same reference) would return `'value'`.

**Q48.** What does `Array.prototype.flatMap` do?
A) Flattens the array, then maps over it
B) Maps each element through a function, then flattens the result by exactly one level
C) Maps and flattens to any specified depth
D) The same as `flat().map()` applied to nested arrays of any depth
**Answer: B** — `flatMap` is equivalent to `map(...).flat(1)`. The mapping function returns an array for each element, and those arrays are flattened one level. Useful for one-to-many transformations.

---

## Section 6: Async JavaScript (5 questions)

**Q49.** What is the output order?
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
A) A, B, C, D
B) A, D, B, C
C) A, D, C, B
D) A, C, D, B
**Answer: C** — Synchronous code runs first: A, D. Microtasks (Promise callbacks) run before macrotasks (setTimeout). So C (Promise) runs before B (setTimeout), even though setTimeout delay is 0.

**Q50.** What does `Promise.allSettled` return compared to `Promise.all`?
A) `allSettled` is faster because it doesn't wait for rejections
B) `allSettled` rejects as soon as one Promise rejects; `all` waits for all
C) `allSettled` waits for all Promises and returns all results (fulfilled or rejected); `all` rejects on the first failure
D) They are identical — `allSettled` is an alias for `all`
**Answer: C** — `Promise.all` rejects immediately when any Promise rejects (fail-fast). `Promise.allSettled` waits for all to settle and returns an array of `{ status: 'fulfilled'|'rejected', value|reason }` objects — no early rejection.

**Q51.** What is wrong with this code?
```js
async function loadAll(ids) {
    const results = [];
    ids.forEach(async id => {
        const data = await fetchData(id);
        results.push(data);
    });
    return results;
}
```
A) `async` cannot be used in arrow functions
B) `forEach` does not await the async callbacks — `results` will be empty when returned
C) `results.push` is not valid inside an async function
D) Nothing is wrong — this code works correctly
**Answer: B** — `forEach` ignores the Promise returned by the async callback. All fetches start but none are awaited before `return results`. Fix: `return Promise.all(ids.map(async id => fetchData(id)))`.

**Q52.** What does `await Promise.race([p1, p2, p3])` return?
A) An array of all results in the order they settled
B) The result of whichever Promise settles first (fulfills OR rejects)
C) The result of the first Promise that fulfills, ignoring rejections
D) An error if any of the Promises rejects
**Answer: B** — `Promise.race` returns the result of whichever Promise settles first, regardless of whether it fulfills or rejects. `Promise.any` (ES2021) is the version that ignores rejections and resolves with the first fulfillment.

**Q53.** How do you correctly handle errors from `async/await`?
A) `.catch()` must be called on every `await` expression
B) Wrap `await` calls in `try/catch` — rejected Promises throw in async functions
C) Use a global `window.onerror` handler — async errors are always caught there
D) Async functions never throw — they always return undefined on error
**Answer: B** — In an `async` function, a rejected `await` expression throws an exception that can be caught with `try/catch`. Uncaught async errors result in unhandled Promise rejection warnings.

---

## Section 7: Browser, DOM & Debugging (5 questions)

**Q54.** What is the difference between `innerHTML` and `textContent`?
A) `innerHTML` sets text; `textContent` sets HTML markup
B) `innerHTML` parses the string as HTML and renders it; `textContent` sets the raw text without HTML parsing
C) `textContent` triggers a re-render; `innerHTML` does not
D) They are identical — `textContent` is an alias for `innerHTML`
**Answer: B** — `innerHTML` parses and renders HTML tags, which enables XSS attacks. `textContent` treats the entire string as text, escaping any HTML characters, making it safe for user-provided content.

**Q55.** What does `event.stopPropagation()` do?
A) Prevents the default browser action (like form submit)
B) Stops the event from bubbling up (or capturing down) to parent elements
C) Removes all event listeners from the current element
D) Cancels the event entirely — it is never processed
**Answer: B** — `stopPropagation()` stops the event from propagating further (either bubbling up or capturing down). `preventDefault()` prevents the browser's default action. They are independent — you may need to call both.

**Q56.** What is event delegation?
A) Delegating event handling to a web worker
B) Using a single listener on a parent element to handle events from multiple child elements via `event.target`
C) Forwarding events from one component to another using CustomEvent
D) Removing event listeners and recreating them on DOM updates
**Answer: B** — Event delegation uses event bubbling to handle events at a higher-level parent instead of attaching listeners to each child. When a child fires an event, it bubbles to the parent, which checks `event.target` to determine the source.

**Q57.** A developer sets a breakpoint in the Sources tab. Which DevTools step control moves execution one line forward WITHOUT entering function calls?
A) Step Into (F11)
B) Step Out (Shift+F11)
C) Step Over (F10)
D) Continue (F8)
**Answer: C** — Step Over (F10) executes the current line and moves to the next, treating function calls as a single step. Step Into (F11) enters function calls. Step Out (Shift+F11) runs the rest of the current function and returns to the caller.

**Q58.** What is a source map and why is it used?
A) A file that maps CSS class names to DOM elements
B) A file that maps compiled/minified JavaScript back to original source code for debugging
C) A configuration file that tells the browser where to find JavaScript modules
D) A type of import map that resolves module specifiers
**Answer: B** — Source maps (`.map` files) are generated by bundlers/transpilers. They map positions in minified/compiled output back to original source locations. DevTools uses them to show original code in breakpoints and stack traces.

---

## Section 8: Node.js & Testing (5 questions)

**Q59.** What is the difference between `dependencies` and `devDependencies` in `package.json`?
A) `dependencies` are loaded synchronously; `devDependencies` are loaded asynchronously
B) `dependencies` are needed at runtime (production); `devDependencies` are only needed during development/testing
C) `devDependencies` are installed globally; `dependencies` are local
D) There is no functional difference — the distinction is just organizational
**Answer: B** — `dependencies` are required for the application to run (frameworks, utilities). `devDependencies` are only needed during development: testing frameworks, linters, bundlers, TypeScript compiler. `npm install --production` omits devDependencies.

**Q60.** What is the purpose of `jest.fn()` in Jest tests?
A) Creates a copy of a real module for isolation testing
B) Creates a mock function that records calls, arguments, and return values for assertions
C) Creates a fake HTTP server for testing fetch calls
D) Replaces an entire module with an empty module
**Answer: B** — `jest.fn()` creates a mock function. You can assert on how many times it was called (`toHaveBeenCalledTimes`), with what arguments (`toHaveBeenCalledWith`), and control its return value (`mockReturnValue`, `mockResolvedValue`). Use `jest.mock('./module')` to mock entire modules.

---

## Answer Key

| Q | A | Q | A | Q | A | Q | A |
|---|---|---|---|---|---|---|---|
| 1 | C | 16 | B | 31 | B | 46 | C |
| 2 | C | 17 | C | 32 | B | 47 | B |
| 3 | B | 18 | B | 33 | B | 48 | B |
| 4 | B | 19 | B | 34 | A | 49 | C |
| 5 | C | 20 | B | 35 | B | 50 | C |
| 6 | B | 21 | B | 36 | C | 51 | B |
| 7 | C | 22 | C | 37 | C | 52 | B |
| 8 | C | 23 | C | 38 | B | 53 | B |
| 9 | C | 24 | A | 39 | B | 54 | B |
| 10 | C | 25 | B | 40 | C | 55 | B |
| 11 | A | 26 | B | 41 | B | 56 | B |
| 12 | C | 27 | C | 42 | C | 57 | C |
| 13 | B | 28 | B | 43 | B | 58 | B |
| 14 | B | 29 | B | 44 | B | 59 | B |
| 15 | D | 30 | B | 45 | B | 60 | B |

**Score: __ / 60 — Pass: 39+ (65%)**
