# ES Modules & Module Systems

## Exam Domain
Classes & Modules — ~16% of exam weight

## Core Concepts

### Named vs Default Exports
```javascript
// ── utils.js ──────────────────────────────────────────
// Named exports — multiple per file, imported by exact name
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { ... }

// Default export — one per file, imported with any name
export default function multiply(a, b) { return a * b; }

// Export at bottom (alternative style)
export { PI, add, Calculator };


// ── consumer.js ───────────────────────────────────────
// Named import — must match exported name (or alias with `as`)
import { PI, add } from './utils.js';
import { add as sum } from './utils.js';  // alias

// Default import — any name works
import multiply from './utils.js';
import myMultiply from './utils.js';  // same thing, different local name

// Import everything as namespace
import * as MathUtils from './utils.js';
MathUtils.PI;       // 3.14159
MathUtils.add(2,3); // 5
MathUtils.default;  // multiply function (default is named 'default')

// Combined: default + named in one import
import multiply, { PI, add } from './utils.js';
```

### Module Key Behaviors
- **Static imports** (`import ... from`) are evaluated at parse time — ALL imports resolve before any code runs
- **Live bindings**: named imports are read-only live views of the exported binding — if the exporter changes the value, the importer sees the update
- **Strict mode automatic** — all ES modules run in strict mode, no `'use strict'` needed
- **Executed once**: module code runs ONCE regardless of how many times it's imported — singleton behavior
- **Top-level `await`** — allowed in ES module files (supported in modern Node.js)

### Dynamic Import — Lazy Loading
```javascript
// Static import — always loaded, even if code path never runs
import heavyLib from './heavy-library.js';  // loaded at startup

// Dynamic import — load on demand, returns a Promise
async function loadFeature() {
    const { FeatureModule } = await import('./feature-module.js');
    return new FeatureModule();
}

// Conditional loading
if (userHasPermission) {
    const { AdminPanel } = await import('./admin-panel.js');
    AdminPanel.init();
}
```

### Tree Shaking
Static imports enable bundlers (webpack, Rollup) to eliminate dead code:
```javascript
// If only `add` is imported, bundler can remove `multiply` and `PI` from bundle
import { add } from './utils.js';
// At build time: everything else in utils.js is "shaken out"
```
Dynamic imports and CommonJS (`require()`) cannot be tree-shaken — the bundler can't know at compile time which exports will be used.

### CommonJS vs ES Modules
```
┌───────────────────┬──────────────────────────┬──────────────────────────┐
│ Feature           │ CommonJS (CJS)           │ ES Modules (ESM)         │
├───────────────────┼──────────────────────────┼──────────────────────────┤
│ Syntax            │ require() / module.exports│ import / export          │
│ Evaluation        │ synchronous / runtime    │ static / parse time      │
│ Live bindings     │ No (value copies)        │ Yes (live view)          │
│ Tree shaking      │ No                       │ Yes                      │
│ Strict mode       │ No (opt-in)              │ Yes (automatic)          │
│ Used in           │ Node.js (legacy/default) │ Browsers + modern Node   │
│ File extension    │ .js / .cjs               │ .js / .mjs               │
└───────────────────┴──────────────────────────┴──────────────────────────┘
```

### LWC Module System
LWC uses ES modules with Salesforce-specific import paths:
```javascript
// LWC platform imports — resolved at build time by Salesforce tooling
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import userId from '@salesforce/user/Id';

// These are NOT npm packages — they're Salesforce module namespaces
// Cannot use npm packages directly; must use Static Resources
```

## Architecture / How It Works

### Module Loading Sequence
```
Browser parses HTML / Salesforce compiles LWC:
  1. Parse: find all static import statements
  2. Fetch: download each module file
  3. Link: wire up live bindings between modules
  4. Evaluate: run module code (ONCE per module, cached)

Import graph (acyclic):
  app.js
    ├── import utils.js     (evaluated first)
    ├── import service.js
    │     └── import utils.js  (already cached — NOT re-evaluated)
    └── (rest of app.js evaluates)
```

### LWC Module Resolution
```
'lwc'                          → Salesforce core framework
'lightning/uiRecordApi'        → Lightning Data Service
'@salesforce/apex/...'         → Apex method (server call)
'@salesforce/schema/...'       → Field/object API names
'@salesforce/label/...'        → Custom Labels
'@salesforce/user/...'         → Current user info
'c/myComponent'                → Custom LWC component
```

**Limitations:**
- Live bindings are READ-ONLY in the importer — you cannot reassign an imported binding
- Circular dependencies are technically supported but evaluated in undefined order — avoid
- `import()` dynamic returns a Promise — must await or `.then()`; errors propagate as rejected Promise
- Static imports cannot be inside if/else or functions — must be at module top level
- CJS `require()` is synchronous; ESM `import()` is always async — matters in Node.js migration

## PTA / SA Relevance

**Code review flags:**
- Importing an entire namespace (`import * as`) when only one function is needed — defeats tree shaking
- Using `require()` syntax in LWC code (should use `import`)
- Circular module dependencies — sign of architectural coupling that needs refactoring

**Architecture guidance for Salesforce:**
- LWC's module system is static ES modules — all `@salesforce/*` imports are resolved at compile time. This means missing metadata (missing field, deleted Apex class) fails at deployment, not at runtime — which is a good thing.
- Dynamic import in LWC (`await import()`) is supported for lazy-loading large utility modules; useful for features used only occasionally (e.g., a PDF generator utility)
- When customers ask about code splitting in LWC: Salesforce's LWC bundler handles module splitting automatically; manual dynamic import is for explicit lazy loading

**Customer advisory:** When a customer's org has slow LWC load times, check for large monolithic utility modules being imported statically in every component. Splitting into smaller modules (or using dynamic import for rarely-used features) reduces bundle size per component.

## Key Facts to Memorize
- Named exports: imported by exact name (or alias with `as`)
- Default exports: one per module, imported with any local name
- ES module imports are LIVE bindings (read-only)
- Static imports evaluated at parse time; dynamic `import()` at runtime → returns Promise
- Tree shaking requires static imports and a bundler
- All ES modules: strict mode automatic, evaluated once, cached
- LWC imports: `'lwc'`, `'lightning/...'`, `'@salesforce/...'` are platform module namespaces

## Exam Traps
- Named import must match exact exported name — `import { PI }` only works if `export const PI` (not `export default PI`)
- `export default` → imported WITHOUT curly braces; `export const` → imported WITH curly braces
- Live binding means: exporting module changes a variable → importing module sees the new value immediately
- Static `import` at top of file → parse-time; `import()` inside function → runtime Promise
- `import * as ns from '...'` → `ns.default` is the default export, `ns.PI` is a named export

## Practice Questions
**Q:** What is wrong with this code?
```javascript
import { multiply } from './math.js';
// math.js: export default function multiply() {...}
```
**A:** Mismatch. `multiply` is a default export, so it must be imported without curly braces: `import multiply from './math.js'`. Curly braces are for named exports.

**Q:** How does tree shaking work and what enables it?
**A:** Tree shaking is dead code elimination by bundlers. It works by statically analyzing which exports are actually imported. It requires static ES module syntax (`import { foo }`) — dynamic `require()` or `import()` cannot be analyzed at build time, so they prevent tree shaking.

**Q:** What is a live binding in ES modules?
**A:** An imported named export is a live read-only view of the original binding. If `utils.js` exports `let count = 0` and later runs `count++`, any module that imported `{ count }` sees the updated value. This is different from CommonJS which copies values at `require()` time.
