# Lecture 07: ES Modules and Module Systems

## Learning Objectives
- Use named exports, default exports, namespace imports, and re-exports correctly
- Explain the difference between static `import` and dynamic `import()` and when to use each
- Describe the module scope model: strict mode by default, own scope, single evaluation
- Compare CommonJS (`require`/`module.exports`) with ES Modules and identify key behavioral differences
- Explain how circular dependencies are handled differently in CJS vs ESM
- Understand why named exports are preferred for tree shaking
- Recognize that every Salesforce LWC component is an ES Module

## Slides

### Slide 1: Why Modules?
**Visual:** Two-panel illustration: left panel shows a "pre-modules" web page with five `<script>` tags, all variables colliding in a single global `window` scope — a tangle of red arrows. Right panel shows a "modules" setup where each file has its own scope box with only explicit arrows crossing the boundary labeled `import/export`. Clean and isolated.
**Content:**
- Before modules, every `<script>` tag shared the same global scope — naming collisions, load-order bugs
- **A module is a file with its own scope:** variables, functions, and classes declared inside are private by default
- Modules explicitly declare their public API with `export`
- Consumers explicitly declare their dependencies with `import`
- **Benefits:** encapsulation, reusability, tree shaking, async loading, strict mode by default
- **Two module systems in the JavaScript ecosystem:**
  - ES Modules (ESM) — the standard; used in modern browsers, Node.js, LWC
  - CommonJS (CJS) — Node.js original system; still widely used in Node tooling
**Speaker Notes:** Modules solve one of JavaScript's oldest pain points. In the early web, every script ran in the same global scope — every variable you declared on `window` was visible to every other script, creating fragile, order-dependent code. Modules flip this: everything is private by default, and sharing is explicit. The ES Module spec became part of the language in ES2015 (ES6), but full browser and Node.js support took several more years. Today, ESM is the universal standard. Salesforce LWC's module system is built on ESM — every `.js` file in a component folder is an ES Module.

### Slide 2: Named Exports and Imports
**Visual:** Two file panels side by side. Left file (`math.js`) shows `export const PI` and `export function add()`. Right file (`app.js`) shows `import { PI, add } from './math.js'` with arrows drawn from each export to its import. A second import line shows aliasing: `import { add as sum } from './math.js'`.
**Content:**
- **Named export:** export a specific binding by name
  - Inline: `export const PI = 3.14159;`
  - Export list at bottom: `export { PI, add, multiply };`
- **Named import:** `import { PI, add } from './math.js';`
- **Aliasing on import:** `import { add as sum } from './math.js';`
- **Aliasing on export:** `export { internalAdd as add };`
- A module can have any number of named exports
- Import names must exactly match export names (case-sensitive)
```js
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// app.js
import { PI, add } from './math.js';
import { multiply as times } from './math.js';

console.log(PI);          // 3.14159
console.log(add(2, 3));   // 5
console.log(times(4, 5)); // 20
```
**Speaker Notes:** Named exports are the most common export style and are generally preferred. When you import a named export, you use its exact exported name in curly braces. Aliasing with `as` lets you rename the binding locally, which is useful when two imported modules export something with the same name. The export list at the bottom of the file — `export { PI, add }` — is a useful pattern because it makes the public API of a module clearly visible in one place rather than scattered throughout the file. The case-sensitivity of import names trips up some developers — `{ Add }` will not find an export named `add`.

### Slide 3: Default Exports and Namespace Imports
**Visual:** Left file (`User.js`) shows `export default class User {}` with annotation "only one default per module." Right file shows three import forms: (1) `import User from './User.js'` (default), (2) `import { name } from './utils.js'` (named), (3) `import * as MathUtils from './math.js'` (namespace), with each form labeled.
**Content:**
- **Default export:** `export default expression;` — one per module
  - Class: `export default class User { ... }`
  - Function: `export default function() { ... }` (anonymous allowed)
  - Value: `export default { key: 'value' };`
- **Default import:** `import User from './User.js';` — no curly braces, any name you choose
- **Namespace import:** `import * as MathUtils from './math.js';` — all named exports as properties of an object
```js
// User.js — default export
export default class User {
  constructor(name) { this.name = name; }
}

// config.js — default + named
export default { apiUrl: 'https://api.example.com' };
export const VERSION = '1.0.0';

// app.js
import User from './User.js';                     // default import — any name
import config, { VERSION } from './config.js';    // both at once
import * as Math from './math.js';                // namespace
Math.add(1, 2);  // access named exports as properties
```
**Speaker Notes:** A common confusion: default imports don't use curly braces, and you can name them whatever you want at the import site. `import User from './User.js'` and `import MyUser from './User.js'` both work — you're just choosing the local name. This flexibility is both convenient and a source of inconsistency in large codebases. Namespace imports (`import * as X from`) give you all named exports as properties of a single object, but they prevent tree shaking because the bundler cannot know at build time which properties you'll actually use. Save namespace imports for cases where you genuinely need the whole module.

### Slide 4: Re-exports and Module Aggregation
**Visual:** Directory tree showing a `utils/` folder with `string-utils.js`, `number-utils.js`, and `date-utils.js`, all with an `index.js` at the root of the folder that re-exports from all three. A consumer file imports cleanly from `'./utils'`. This is labeled the "barrel file" pattern.
**Content:**
- **Re-export syntax:** export something from another module without importing it into the current scope
  - `export { add } from './math.js';` — re-export a named export
  - `export { default } from './User.js';` — re-export a default
  - `export * from './math.js';` — re-export all named exports
  - `export * as MathNS from './math.js';` — re-export all as a namespace
- **Barrel file pattern:** an `index.js` that aggregates and re-exports from many modules
- Consumers import from the barrel, not from individual deep files
```js
// utils/index.js — barrel file
export { add, multiply } from './math.js';
export { formatDate } from './date.js';
export { capitalize } from './string.js';
export { default as User } from './User.js';

// consumer.js
import { add, capitalize, User } from './utils/index.js';
// instead of:
// import { add } from './utils/math.js';
// import { capitalize } from './utils/string.js';
// import User from './utils/User.js';
```
**Speaker Notes:** The barrel file pattern is used extensively in Salesforce LWC projects to create a clean public API for a set of related utilities. The consumer sees one import path instead of many deep paths. One caveat: barrel files can work against tree shaking if the bundler cannot statically analyze that only some exports are used — this is a known issue with some bundlers. Tools like Rollup and esbuild handle it well; older bundlers may not. For the exam, know the re-export syntax — especially `export { default as X }` for re-exporting a default export as a named export with a new name.

### Slide 5: Static import vs Dynamic import()
**Visual:** Two code panels: left shows `import { add } from './math.js'` at the top of a file, labeled "static — hoisted, synchronous binding, always loaded." Right shows `const { add } = await import('./math.js')` inside an async function, labeled "dynamic — runtime, Promise-based, conditional/lazy." Arrows show when each resolves: static at module parse time, dynamic at `await` execution.
**Content:**
- **Static import:** must appear at the top level of a module; cannot be inside functions, conditionals, or loops
  - Resolved at parse time (before any code runs)
  - Enables static analysis, tree shaking, circular dependency detection
  - Import bindings are live — if the exported value changes, the import reflects it
- **Dynamic import():** `import(moduleSpecifier)` — returns a Promise; can appear anywhere
  - Loads the module asynchronously when the expression evaluates
  - Enables **code splitting**, **lazy loading**, and **conditional loading**
  - Returns the module namespace object (all exports accessible as properties)
```js
// Static import — at top level only
import { processData } from './data-processor.js';

// Dynamic import — anywhere, returns a Promise
async function loadCharts() {
  if (userNeedsCharts) {
    const { renderChart } = await import('./chart-lib.js');
    renderChart(data);
  }
}

// Dynamic import with .then()
import('./heavy-module.js')
  .then(module => module.default.init())
  .catch(err => console.error('Failed to load', err));
```
**Speaker Notes:** Dynamic imports are the mechanism behind code splitting in every modern bundler. When your app has a feature that only some users ever access, there is no reason to ship that code to all users on initial page load. With `import()`, you can defer loading until the user actually triggers that feature. The returned Promise resolves to the module namespace object, so for default exports you access `.default`. For named exports, you destructure from the namespace. One important nuance: dynamic `import()` still loads the module once and caches it — subsequent `import()` calls for the same specifier return the same cached module. This is the same caching behavior as static imports.

### Slide 6: Module Scope, Strict Mode, and CommonJS vs ESM
**Visual:** Comparison table with two columns: CommonJS and ESM. Rows: syntax, evaluation timing (runtime vs compile-time), strict mode (opt-in vs default), exports (mutable copy vs live binding), `this` at top level (module.exports vs undefined), dynamic imports (require() vs import()), file extension (.js/.cjs vs .mjs or "type":"module").
**Content:**
- **ES Module scope rules:**
  - Top-level `this` is `undefined` (not `window` or `global`)
  - Strict mode is on by default — no need for `'use strict';`
  - Module code runs exactly once — even if imported by multiple files
  - Variables declared at the top level are module-scoped, not global
- **CommonJS (CJS) differences:**
  - `require()` is synchronous, dynamic — can be called anywhere with a variable
  - `module.exports` / `exports` — a mutable object that is copied on require
  - ESM named imports are **live bindings** — the import reflects later changes to the export
  - CJS exports are a value snapshot at require time
```js
// CommonJS
const path = require('path');                          // synchronous
const { readFile } = require('fs');
module.exports = { myFunction, anotherFunction };      // export

// ESM equivalent
import path from 'path';
import { readFile } from 'fs';
export { myFunction, anotherFunction };

// Live binding demo (ESM only)
// counter.js: export let count = 0; export function inc() { count++; }
// main.js: import { count, inc } from './counter.js';
// inc(); console.log(count); // 1 — live binding reflects mutation
```
**Speaker Notes:** The live binding behavior of ESM is subtle and worth memorizing for the exam. In CommonJS, `const { count } = require('./counter.js')` gives you a copy of the value at the moment of the call. If the module later changes its internal `count`, your copy does not update. In ESM, `import { count } from './counter.js'` creates a live binding — it is always the current value of `count` in the exporting module. This makes ESM exports behave more like references than copies. The `this === undefined` at the top level of an ESM file versus `this === module.exports` in CJS is another exam-worth distinction.

### Slide 7: Circular Dependencies
**Visual:** Diagram showing a circular dependency: `a.js` imports from `b.js`, and `b.js` imports from `a.js`. Two scenarios shown: CJS (partial exports object shown at require time, possibly undefined properties) vs ESM (live bindings — ESM can handle the cycle but binding may be uninitialized at first access if TDZ applies).
**Content:**
- **Circular dependency:** Module A imports from Module B, and Module B imports from Module A
- Both CJS and ESM support circular dependencies but handle them differently
- **CJS:** When A requires B and B requires A mid-execution, B receives A's `module.exports` object as it exists at that moment — possibly incomplete. This causes `undefined` function references if B is loaded before A finishes exporting.
- **ESM:** Uses live bindings. When the cycle is evaluated, the importing binding exists but may be in the TDZ (temporal dead zone) at first access. Functions work fine if they are called after initialization; variable imports may throw if accessed before their module finishes.
- **Best practice:** Avoid circular dependencies — they indicate a design smell. Restructure to a shared third module.
```js
// Circular dep example (CJS — problematic)
// a.js
const { b } = require('./b.js');
exports.a = function() { return 'a calls ' + b(); };

// b.js
const { a } = require('./a.js');   // gets incomplete a.js exports!
exports.b = function() { return 'b'; };

// At the time b.js runs, a.js hasn't finished, so `a` is undefined.
// This leads to `TypeError: a is not a function` when b() tries to call a().

// ESM handles this better with live bindings, but still requires
// care — access bindings only after both modules finish evaluation.
```
**Speaker Notes:** Circular dependencies are a real problem in large applications. The CJS behavior is particularly tricky: you get a partially-constructed exports object, and if your code calls a function from that object during module initialization, you get `undefined`. ESM's live bindings help, but only if the binding is accessed after module evaluation completes. In practice, the right fix is always to break the cycle by extracting shared logic into a third module that both A and B import from. For the exam, know the difference in how CJS and ESM handle circular imports.

### Slide 8: Tree Shaking and LWC Modules
**Visual:** Two diagrams: (1) tree shaking — a module tree where only `add` and `multiply` are imported from `math.js` which also exports `divide` and `power`. The bundler output shows only `add` and `multiply` included, with `divide` and `power` crossed out. (2) An LWC component folder showing `myComponent.js` as an ES Module with `import { LightningElement } from 'lwc'` at the top.
**Content:**
- **Tree shaking:** bundler removes exported code that is never imported anywhere in the app
- Requires **static analysis** — only possible with ESM (static imports)
- Named exports enable tree shaking; `export default` of an object is harder to shake
- CJS `require()` is dynamic — bundlers cannot statically determine which exports are used
- **In Salesforce LWC:**
  - Every `.js` file in a component folder is an ES Module
  - LWC imports use special module specifiers: `import { LightningElement } from 'lwc';`
  - Wire adapters, component imports, and utility imports all use ESM syntax
  - `@salesforce/` scoped imports (labels, schema, user, etc.) are also ESM modules resolved by the LWC build system
```js
// LWC component — ES Module in Salesforce
import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';

export default class AccountViewer extends LightningElement {
  @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_NAME] })
  account;
}
```
**Speaker Notes:** The Salesforce LWC connection is important for the JSI exam because it grounds the abstract module concepts in a real platform context. When you write `import { LightningElement } from 'lwc'`, you are writing standard ESM syntax — LWC just provides the `lwc` module as part of its runtime. The `@salesforce/` scoped imports are resolved by the Salesforce build system at deploy time, not at runtime in the browser. This is a form of build-time module resolution, similar to webpack aliases. Tree shaking matters for LWC app performance — using named exports from your utility modules allows the Salesforce bundler to eliminate unused code from the deployed bundle.

## Recording Script
Welcome to Lecture 7: ES Modules and Module Systems. Modules are how modern JavaScript organizes code across files, and at 12% exam weight they are a significant topic for JSI.

Before modules, every JavaScript file loaded by a browser shared the same global scope. Every variable you declared was visible to every other script. Managing load order, avoiding name collisions, and understanding dependencies was a constant battle. Modules solve all of this: each file gets its own scope, declares what it exports, and explicitly lists what it imports.

The ES Module system has two primary export styles. Named exports use the `export` keyword before a declaration or a list at the bottom of the file. You import them by the exact exported name in curly braces. Default exports — one per module — are imported without curly braces, and you choose the local name at the import site. You can mix both styles in the same module. Re-exports let you pass a module's exports through to another module without importing them into local scope — this enables the barrel file pattern where an `index.js` aggregates multiple modules into a single clean import path.

Static imports must be at the top level of your file — you cannot put them inside a function, a loop, or an if statement. They are resolved at parse time, before any code executes, which is what enables tree shaking and circular dependency detection. Dynamic imports — `import()` with parentheses — return a Promise and can appear anywhere in your code. This is the mechanism for code splitting and lazy loading: defer loading heavy modules until they are actually needed.

Every ES Module runs in strict mode automatically — you do not need `'use strict'` at the top. The top-level `this` inside a module is `undefined`, not `window`. And each module is evaluated exactly once, regardless of how many files import it.

CommonJS — Node.js's original module system — uses `require()` and `module.exports`. The key differences: `require()` is synchronous and dynamic, so it can be called anywhere with a variable as the path. ESM static imports are resolved at parse time. CommonJS exports are a value copy at require time. ESM named imports are live bindings — they reflect later changes to the exported value.

Circular dependencies — where A imports B and B imports A — are technically supported by both systems, but CJS handles them poorly: you get a partially-constructed exports object that may have `undefined` for functions not yet exported. ESM handles them better with live bindings, but the safest approach is to avoid circular dependencies altogether.

Tree shaking is a bundler optimization that removes exported code that is never actually imported anywhere. It only works with ESM's static analysis. Named exports from focused modules enable aggressive tree shaking. A default export of a large object is much harder to shake because the bundler cannot tell which properties of the object you'll use.

In Salesforce LWC, every component's JavaScript file is an ES Module. The `import { LightningElement } from 'lwc'` line is standard ESM syntax — LWC provides the `lwc` module as part of its runtime. All the `@salesforce/` scoped imports are resolved by the platform build system. Understanding ESM is not just theory for Salesforce developers — it is the daily syntax of LWC development.

See you in the next lecture where we explore iterators and generators.

## Exam Tips
- Named exports use curly braces on import: `import { add }`. Default exports do not: `import add`. Mixing these up is the most common module syntax error.
- A module can have at most **one** default export but any number of named exports.
- Static imports must be at the **top level** of a module — not inside functions, loops, or conditionals. Dynamic `import()` can appear anywhere.
- ESM named imports are **live bindings** — they reflect mutations to the export. CJS exports are value copies at require time.
- Tree shaking requires static analysis — only ESM (not CJS `require()`) enables it. Named exports are more tree-shakeable than a default-exported object.
- `this` at the top level of an ES Module is `undefined`. In CJS, `this === module.exports`.
- In Salesforce LWC context: every component is an ES Module; `import { LightningElement } from 'lwc'` is standard ESM syntax.
- Exam weight: approximately 12%.

## Lecture Summary
ES Modules give JavaScript files their own private scope, with strict mode enabled by default. Public APIs are exposed via named exports (multiple per module, imported with curly braces) or a single default export (imported without curly braces). Re-exports aggregate modules into barrel files. Static `import` statements are resolved at parse time enabling tree shaking and static analysis, while dynamic `import()` returns a Promise for lazy/conditional loading. Compared to CommonJS's runtime `require()`, ESM live bindings and static analysis provide better optimization and more predictable circular dependency handling. In Salesforce LWC, every component `.js` file is an ES Module, using standard ESM `import` syntax to reference LWC runtime, wire adapters, and Salesforce platform resources.

## Mini Quiz

**Q1:** A developer writes the following in the middle of a function body: `import { helper } from './utils.js';`. What happens?
A) The import is valid and runs when the function is called
B) A SyntaxError is thrown because static imports must be at the top level of a module
C) The import runs asynchronously when the function is called
D) The import is ignored silently
**Answer:** B — Static `import` declarations must appear at the top level of an ES Module file. Placing one inside a function, loop, or conditional is a SyntaxError caught at parse time. If dynamic loading inside a function is needed, use `const mod = await import('./utils.js')` instead.

**Q2:** Which statement accurately describes the difference between ESM named imports and CommonJS exports?
A) Both create live bindings to the exported value
B) ESM named imports are live bindings that reflect mutations to the export; CJS exports are copied at require time
C) CJS exports are live bindings; ESM named imports are value copies
D) There is no difference — they behave identically at runtime
**Answer:** B — ESM named imports are live bindings: if the exporting module changes the value of an exported variable, the import in other modules automatically sees the updated value. CommonJS `require()` returns a snapshot of `module.exports` at the time of the call; subsequent mutations to the exporting module's internal variables are not visible to the requirer.

**Q3:** A developer wants to import only the `formatDate` function from a large `dateUtils.js` module to keep the bundle small. Which import style best supports tree shaking?
A) `import dateUtils from './dateUtils.js'; dateUtils.formatDate()`
B) `import * as dateUtils from './dateUtils.js'; dateUtils.formatDate()`
C) `import { formatDate } from './dateUtils.js';`
D) `const { formatDate } = require('./dateUtils.js');`
**Answer:** C — Named imports with static `import { formatDate }` give the bundler the clearest signal that only `formatDate` is needed, enabling tree shaking of all other exports. Option A imports a default-exported object — the bundler cannot tell which properties will be used. Option B (namespace import) also prevents effective tree shaking. Option D uses CommonJS `require()`, which is dynamic and cannot be statically analyzed for tree shaking.
