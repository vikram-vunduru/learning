# JavaScript Developer I (JSI) — CRT-600

## Exam Facts
| Detail | Value |
|--------|-------|
| Exam Code | CRT-600 |
| Questions | 60 |
| Time | ~105 minutes |
| Pass Score | 65% |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## What This Course Covers
This course prepares you for the Salesforce Certified JavaScript Developer I exam (CRT-600). Unlike the Platform Developer I exam which focuses on Apex, JSI tests your mastery of core JavaScript — the language that powers every Lightning Web Component (LWC) you will ever build on Salesforce. The exam evaluates whether you understand JavaScript at the language level: how scope and closures work, how the event loop handles asynchronous code, how ES6+ class syntax maps to prototype chains, and how the browser and Node.js environments differ. Salesforce chose this certification to establish a JavaScript baseline for developers building LWC solutions, because a shaky understanding of closures, `this` binding, and promises leads directly to subtle bugs in production components. This course covers all six exam domains — from primitive types and functions through classes, asynchronous patterns, and browser/Node APIs — and ties every concept back to how it manifests in real LWC development.

## Who This Exam Is For
- Developers who build Lightning Web Components and want formal recognition of their JavaScript skills
- Platform Developer I certificate holders who want to round out the full Salesforce developer credential stack
- Front-end engineers joining Salesforce consulting teams who already know JavaScript but need exam-specific preparation
- Developers who passed PDI and now want to deepen their LWC knowledge at the language level

## Prerequisite Knowledge
- Completed **Platform Developer I** (or equivalent experience) — you should be comfortable with Salesforce orgs, VS Code + Salesforce CLI, and basic LWC structure
- **Basic web development** — you have written HTML and CSS before
- **Some JavaScript exposure** — you do not need to be an expert, but you should have written at least simple functions and worked with arrays. Absolute beginners to programming should complete a JavaScript fundamentals course first.

## Course Structure
This course is organized into 5 sections covering 20 lectures, 3 hands-on labs, and a final exam prep section.

### Section 1 — JavaScript Fundamentals (L01–L04)
Core language building blocks: variables, types, operators, conditionals, loops, error handling, functions, scope, hoisting, and closures. Exam weight: ~26%.

### Section 2 — Objects, Arrays & Iterators (L05–L08)
Object literals, destructuring, spread/rest, prototype chain, arrays and array methods, iterators and generators, Map and Set collections. Exam weight: ~25%.

### Section 3 — Classes & Modules (L09–L11)
ES6 class syntax, inheritance, `this` binding pitfalls, static methods and properties, ES modules (`import`/`export`), module patterns, and how LWC uses modules. Exam weight: ~16%.

### Section 4 — Asynchronous JavaScript (L12–L16)
Event loop model, callbacks and callback hell, Promises (creation, chaining, error handling), `async`/`await`, `Promise.all` / `Promise.race`, and the `@wire` service pattern in LWC context. Exam weight: ~20%.

### Section 5 — Browser & Node Environments (L17–L20)
The DOM and event model, `fetch` API, Web Storage (localStorage/sessionStorage), Node.js module system, npm basics, and testing fundamentals (Jest, describe/it/expect). Exam weight: ~13%.

### Labs
- **Lab 1:** Build a closures and higher-order functions exercise set (pure JavaScript, Node.js)
- **Lab 2:** Implement a Promise-based data service and consume it with async/await
- **Lab 3:** Build an LWC component that wires together classes, modules, and wire adapter patterns

### Exam Prep
- Full 60-question timed practice exam
- JSI cheat sheet covering syntax traps and exam patterns
- Weak-area drill sets for closures, `this` binding, and Promise chaining

## Exam Weight Breakdown
| Domain | Weight |
|--------|--------|
| Variables, Types & Operators | ~7% |
| Conditionals, Loops & Error Handling | ~8% |
| Functions, Scope & Closures | ~11% |
| Objects, Arrays & Iterators | ~25% |
| Classes & Modules | ~16% |
| Asynchronous JavaScript | ~20% |
| Browser & Node APIs | ~13% |

## 4-Week Study Timeline

**Week 1 — JavaScript Fundamentals (L01–L04)**
- Days 1-2: Set up Node.js locally and run all code examples in the Node REPL or a scratch file. Work through L01 (Variables, Types, Operators) hands-on — experiment with `typeof`, coercion traps, and `??`.
- Days 3-4: Study L02 (Conditionals, Loops, Error Handling). Write try/catch/finally examples that re-throw errors and verify behavior in Node.
- Days 5-7: Complete L03 (Functions) and L04 (Scope, Hoisting, Closures). These two lectures have the highest exam cross-coverage — spend extra time on the loop-var closure pitfall and the factory function pattern.

**Week 2 — Objects, Arrays & Iterators (L05–L08)**
- Days 1-3: Study L05–L06 (Objects and Arrays). Practice destructuring, spread syntax, and all array methods (map/filter/reduce/find/some/every) on real data sets.
- Days 4-5: Work through L07 (Prototype Chain and ES6 Classes) to preview Section 3.
- Days 6-7: Study L08 (Iterators, Generators, Map, Set). These appear less frequently on the exam but generators specifically can trip you up if skipped.

**Week 3 — Classes, Modules & Async (L09–L16)**
- Days 1-2: Study L09–L11 (Classes and Modules). Focus on `this` binding: regular functions vs arrow functions, explicit binding with `call`/`apply`/`bind`.
- Days 3-5: Work through L12–L16 (Async JavaScript). This domain has the highest per-question complexity. Run every Promise chain example by hand before reading the answer.
- Days 6-7: Complete Lab 2 (Promise-based data service). Seeing async patterns in a real implementation cements the mental model.

**Week 4 — Browser/Node & Full Review (L17–L24)**
- Days 1-2: Complete L17–L20 (Browser and Node). Focus on the event model (`addEventListener`, `removeEventListener`, event bubbling) and Jest test structure.
- Days 3-4: Complete Lab 3 (LWC component). Seeing JS concepts in LWC context is the best exam review possible.
- Days 5-6: Take 2 full 60-question timed practice exams. Review every wrong answer with reference to the specific lecture.
- Day 7: Light review of `this` binding and Promise chaining only — your two highest-risk areas.

## Mini Quiz

**Q1:** Which keyword creates a variable with block scope that cannot be reassigned after declaration?
A) `var`
B) `let`
C) `const`
D) `static`
**Answer:** C — `const` creates a block-scoped binding that cannot be reassigned. Note that for objects and arrays declared with `const`, the binding itself cannot be reassigned, but the contents (properties, elements) can still be mutated.

**Q2:** A developer writes an LWC component and notices that an arrow function used as an event handler correctly accesses `this.someProperty`, while a regular function expression used in the same position logs `undefined` for `this`. What explains this behavior?
A) Arrow functions are automatically bound to the component by the LWC framework
B) Arrow functions do not have their own `this` — they capture `this` from the surrounding lexical scope at definition time
C) Regular functions in LWC are always called with `this` set to `undefined` due to strict mode
D) Both A and B are correct
**Answer:** B — Arrow functions inherit `this` from the lexical context where they are defined, not from how they are called. In an LWC class method, an arrow function captures `this` as the component instance. A regular function expression gets its own `this` based on the call site, which in strict mode (which LWC uses) is `undefined` if not explicitly bound.

**Q3:** What is the output of the following code?
```javascript
console.log(typeof null);
console.log(typeof undefined);
console.log(null === undefined);
console.log(null == undefined);
```
A) `"null"`, `"undefined"`, `false`, `false`
B) `"object"`, `"undefined"`, `false`, `true`
C) `"null"`, `"undefined"`, `true`, `true`
D) `"object"`, `"undefined"`, `true`, `true`
**Answer:** B — `typeof null` returns `"object"` — a long-standing bug in JavaScript that will never be fixed for backward compatibility. `typeof undefined` returns `"undefined"`. `null === undefined` is `false` because strict equality checks type, and null and undefined are different types. `null == undefined` is `true` because loose equality treats null and undefined as equal to each other (and only to each other).
