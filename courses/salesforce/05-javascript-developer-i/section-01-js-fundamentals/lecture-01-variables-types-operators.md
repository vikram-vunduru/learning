# Lecture 01: Variables, Types & Operators

## Learning Objectives
- Declare variables using `var`, `let`, and `const` and explain the scoping and reassignment rules for each
- Name all seven primitive types and the object type, and use `typeof` to identify them at runtime
- Explain type coercion and distinguish between loose equality (`==`) and strict equality (`===`)
- Use arithmetic, comparison, logical, ternary, nullish coalescing (`??`), and optional chaining (`?.`) operators correctly

## Slides

### Slide 1: var, let, and const — Choosing the Right Declaration
**Visual:** Three vertical columns, one per keyword, each showing the keyword name, its scope (function / block / block), whether it can be reassigned (yes / yes / no), whether it is hoisted (yes, initialized to undefined / yes, TDZ / yes, TDZ), and a color-coded "use this when" recommendation. A sticky note on `var` says "Avoid in modern JavaScript."
**Content:**
- `var` — function-scoped, hoisted and initialized to `undefined`, can be re-declared and reassigned; legacy keyword
- `let` — block-scoped, hoisted but in the **Temporal Dead Zone** until the declaration line, can be reassigned but not re-declared in the same scope
- `const` — block-scoped, same TDZ behavior as `let`, **cannot be reassigned** (binding is immutable; object contents can still mutate)
```javascript
var x = 1;      // function scope — avoid
let y = 2;      // block scope — use for mutable bindings
const z = 3;    // block scope — use for everything else
```
- In LWC: component properties use `@track` or public `@api` decorators, but the underlying JS variable rules still apply — `const` is preferred for values that will not be re-bound
**Speaker Notes:** The modern JavaScript convention is to use `const` by default and `let` only when you know you need to reassign. Reach for `var` only when maintaining legacy code. This convention is especially important in LWC, where using `const` signals to other developers that a binding is stable. On the JSI exam, `var` vs `let` vs `const` scoping questions are extremely common — especially edge cases with hoisting and the temporal dead zone.

### Slide 2: The Seven Primitive Types + Object
**Visual:** A taxonomy diagram showing one root node labeled "JavaScript Values" splitting into two branches: "Primitives" (7 nodes: number, string, boolean, null, undefined, symbol, bigint) and "Object" (1 node with sub-nodes: plain object, array, function, Date, Map, Set). Each primitive node shows a sample value literal.
**Content:**
- **number** — `42`, `3.14`, `NaN`, `Infinity` — all floating point (no integer type)
- **string** — `"hello"`, `'world'`, `` `template ${literal}` ``
- **boolean** — `true` or `false`
- **null** — intentional absence of value (assigned explicitly)
- **undefined** — variable declared but not assigned; missing property; function with no return
- **symbol** — unique, immutable identifier; `Symbol('description')` — used for private-ish keys
- **bigint** — integers beyond `Number.MAX_SAFE_INTEGER`; `9007199254740991n`
- **object** — everything else: `{}`, `[]`, functions, `null` (despite `typeof null === "object"`)
- Primitives are **immutable and compared by value**; objects are **mutable and compared by reference**
**Speaker Notes:** The distinction between primitives and objects is foundational. When you assign a primitive to a new variable, you copy the value. When you assign an object, you copy the reference — both variables now point to the same object in memory. This explains why `const arr = []; arr.push(1)` works: you are mutating the array contents, not reassigning the `arr` binding. The `typeof null === "object"` quirk is a classic exam trap — it is a bug in JavaScript that exists for historical reasons.

### Slide 3: typeof Operator and Type Checking
**Visual:** A two-column table showing expression on the left and result on the right for: `typeof 42`, `typeof "hello"`, `typeof true`, `typeof undefined`, `typeof null`, `typeof {}`, `typeof []`, `typeof function(){}`, `typeof Symbol()`, `typeof 42n`. Results color-coded with surprising ones (`"object"` for null and array) in orange.
**Content:**
- `typeof value` returns a **string** describing the type
- Key results to memorize:
  | Expression | Result |
  |------------|--------|
  | `typeof null` | `"object"` (bug — not `"null"`) |
  | `typeof []` | `"object"` (arrays are objects) |
  | `typeof function(){}` | `"function"` |
  | `typeof undefined` | `"undefined"` |
  | `typeof NaN` | `"number"` (NaN is a number value) |
- To check for arrays: `Array.isArray(value)`
- To check for null: `value === null`
- `instanceof` checks prototype chain: `myArr instanceof Array` → `true`
**Speaker Notes:** `typeof` is a unary prefix operator, not a function — no parentheses required, though they are legal. The JSI exam loves `typeof null` and `typeof NaN` because both return counterintuitive results. `NaN` stands for "Not a Number" but `typeof NaN` is `"number"` because `NaN` is a numeric value (IEEE 754 says so). The only reliable way to check for `NaN` is `Number.isNaN(value)` — do not use `isNaN()` (the global one), which coerces non-numbers first and produces incorrect results for strings.

### Slide 4: Type Coercion — == vs ===
**Visual:** A split diagram showing `==` on the left surrounded by swirling arrows representing type conversion, with a warning badge labeled "coercion happens here." On the right, `===` with a rigid wall labeled "no conversion — type must match." Below each side, a truth table showing 6 common comparisons and their result under each operator.
**Content:**
- `==` (loose equality) — performs **type coercion** before comparing
- `===` (strict equality) — compares **both type and value**, no coercion
- Always prefer `===` in production and LWC code
- Coercion surprises:
  | Expression | Result | Why |
  |------------|--------|-----|
  | `0 == false` | `true` | false coerces to 0 |
  | `"" == false` | `true` | both coerce to 0 |
  | `null == undefined` | `true` | special rule |
  | `null === undefined` | `false` | different types |
  | `NaN == NaN` | `false` | NaN is not equal to anything |
  | `[] == false` | `true` | array coerces to "" coerces to 0 |
- Falsy values: `0`, `""`, `null`, `undefined`, `NaN`, `false`, `0n`
- Everything else is truthy (including `[]`, `{}`, `"false"`)
**Speaker Notes:** The coercion rules for `==` follow a complex algorithm in the ECMAScript spec. Rather than memorizing all cases, internalize one rule: always use `===` unless you specifically want null/undefined equivalence (the one case where `== null` is a readable and common idiom: `if (value == null)` catches both null and undefined). The JSI exam will present tricky `==` expressions and ask for the result — the answer is almost always "use === to avoid this."

### Slide 5: Arithmetic, Comparison & Logical Operators
**Visual:** Three side-by-side panels titled Arithmetic, Comparison, and Logical. Each panel shows a quick-reference card of operators with a one-line example. The logical panel highlights short-circuit evaluation with a chain diagram: `A && B` stops at A if A is falsy.
**Content:**
- **Arithmetic:** `+`, `-`, `*`, `/`, `%` (modulo), `**` (exponentiation), `++`, `--`
  - `+` with a string operand triggers concatenation: `1 + "2"` → `"12"`
  - Unary `+` converts to number: `+"3"` → `3`, `+true` → `1`, `+null` → `0`
- **Comparison:** `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`
- **Logical:**
  - `&&` (AND) — returns first falsy value or last value: `0 && "hello"` → `0`
  - `||` (OR) — returns first truthy value or last value: `null || "default"` → `"default"`
  - `!` (NOT) — converts to boolean and inverts
  - Short-circuit: right side evaluated only if needed
- Logical assignment: `a ||= b` (assign b if a is falsy), `a &&= b`, `a ??= b`
**Speaker Notes:** The `+` operator's dual role as arithmetic addition and string concatenation is a notorious source of bugs. When you add a number and a string, JavaScript converts the number to a string and concatenates. Unary `+` is a clean idiom for converting a value to a number — you will see it in LWC when processing string data from wire adapters. Short-circuit evaluation is not just an optimization: it is used deliberately as a conditional, especially in JSX-style rendering patterns.

### Slide 6: Ternary, Nullish Coalescing (??) and Optional Chaining (?.)
**Visual:** Three code blocks, each showing a "before" (verbose if/else or nested if null check) and "after" (using the operator) side by side, with arrows showing the transformation. Each block has color-coded annotations.
**Content:**
- **Ternary operator:** `condition ? valueIfTrue : valueIfFalse`
```javascript
const label = isActive ? 'Active' : 'Inactive';
```
- **Nullish coalescing `??`:** Returns right side only if left side is `null` or `undefined` — not for other falsy values
```javascript
const name = user.name ?? 'Anonymous';  // '' and 0 are NOT replaced
const count = itemCount ?? 0;           // only null/undefined replaced
```
- **`||` vs `??`:** Use `??` when `0` or `""` are valid values you want to preserve
- **Optional chaining `?.`:** Safely access nested properties — returns `undefined` instead of throwing if any link in the chain is null/undefined
```javascript
const city = user?.address?.city;           // undefined if any step is null
const first = arr?.[0];                     // safe array access
const result = obj?.method?.();             // safe method call
```
- LWC usage: `this.record?.fields?.Name?.value` — deeply nested wire adapter data
**Speaker Notes:** Before `??` and `?.` (introduced in ES2020), developers used verbose null checks or the `||` operator with a caveat: `||` would incorrectly replace `0` and empty string with the default. `??` was introduced specifically to fix this. In LWC, optional chaining is indispensable when working with wire adapter data — the `@wire` decorator may return data gradually as the record loads, so a property might be undefined on the first render. `?.` lets you write safe access chains that gracefully handle incomplete data without a cascade of `if` checks.

### Slide 7: Bitwise Operators & typeof in Practice
**Visual:** A reference card showing all bitwise operators (&, |, ^, ~, <<, >>, >>>) with a one-line use case note. Below it, a code example showing a real-world permission flag bit mask pattern, then a second panel showing a flowchart of "which type check to use?" decision tree.
**Content:**
- **Bitwise operators** work on 32-bit integer representations of numbers:
  - `&` (AND), `|` (OR), `^` (XOR), `~` (NOT/complement)
  - `<<` (left shift), `>>` (right shift), `>>>` (unsigned right shift)
  - Practical use: bit-flag permissions, low-level encoding, performance-sensitive set membership
```javascript
const READ  = 0b001;  // 1
const WRITE = 0b010;  // 2
const EXEC  = 0b100;  // 4
const userPerms = READ | WRITE;  // 3
const canRead = (userPerms & READ) !== 0;  // true
```
- **typeof decision tree:**
  - Check for null: `value === null`
  - Check for array: `Array.isArray(value)`
  - Check for NaN: `Number.isNaN(value)`
  - General type: `typeof value`
  - Instance check: `value instanceof ClassName`
**Speaker Notes:** Bitwise operators appear occasionally on the JSI exam and in real low-level JavaScript. The most common real-world use is permission bit flags, like the example shown. The `>>>` unsigned right shift is unique because it always fills with zeros from the left, unlike `>>` which preserves the sign bit. For the exam, know that bitwise operations convert operands to 32-bit signed integers, which means `~0` is `-1` (all bits flipped) — another classic exam trap. For type checking, use the decision tree: never rely solely on `typeof` for null or array checks.

### Slide 8: Putting It All Together — LWC Context
**Visual:** A realistic LWC JavaScript class snippet (roughly 20 lines) with annotations. Arrow labels point to: a `const` declaration (block scope), a `??` usage for default wire data, a `?.` chain for safe property access, a `===` comparison, and a `typeof` guard. The component is a simple Account detail viewer.
**Content:**
```javascript
import { LightningElement, wire } from 'lwc';
import getAccount from '@salesforce/apex/AccountController.getAccount';

export default class AccountDetail extends LightningElement {
    @api recordId;

    @wire(getAccount, { accountId: '$recordId' })
    account;

    get accountName() {
        // Optional chaining + nullish coalescing together
        return this.account?.data?.Name ?? 'Loading...';
    }

    get isLoaded() {
        return typeof this.account?.data !== 'undefined';
    }

    handleSave(event) {
        const newName = event.target.value;
        // Strict equality — no coercion surprises
        if (newName === '' || newName === null) return;
        // ...
    }
}
```
- Every operator from this lecture appears in real LWC components
- `typeof` guards protect against undefined wire data during initial render
**Speaker Notes:** This slide shows that variables, types, and operators are not abstract exam topics — they are the daily vocabulary of LWC development. The `?.` and `??` operators in particular solve real LWC problems: wire data arrives asynchronously, so properties are undefined on the first render cycle. Using `?.` to navigate the chain and `??` to provide a fallback lets you write safe, declarative getters without verbose null-check if chains. Notice the `typeof` guard in `isLoaded`: we check for `'undefined'` as a string because `typeof` always returns a string.

## Recording Script
Welcome to the first lecture in the JavaScript Developer I course. Today we lay the foundation: variables, types, and operators. These topics represent about 7% of the exam, but more importantly, they are the vocabulary of everything that follows. If you are fuzzy on `const` vs `let` or on what `??` actually does, every later topic will feel harder than it needs to.

Let's start with variable declarations. You have three choices in modern JavaScript: `var`, `let`, and `const`. Here is the short version: use `const` for everything, use `let` when you need to reassign, and treat `var` as legacy code. `var` is function-scoped and hoisted — it can lead to bugs that are genuinely hard to track down. `let` and `const` are block-scoped, which means they only exist inside the curly braces where they are declared. We will go deeper on hoisting in Lecture 4, but for now: `const` by default, `let` when you must reassign.

Next, types. JavaScript has seven primitive types: number, string, boolean, null, undefined, symbol, and bigint. Everything else — objects, arrays, functions, dates — is an object. The key insight is that primitives are compared by value, while objects are compared by reference. Two separate `{}` objects are never strictly equal to each other even if they have identical contents, because they are different objects in memory.

`typeof` is how you check types at runtime — but it has two famous gotchas. `typeof null` returns `"object"`, not `"null"`. That is a decades-old bug in JavaScript. And `typeof []` also returns `"object"` because arrays are objects. To check for arrays, use `Array.isArray()`. To check for null, use `=== null`.

On equality: always use triple equals. Loose equality with `==` triggers type coercion, which follows rules that most developers do not have memorized. `0 == false` is `true`. `"" == false` is `true`. `null == undefined` is `true`. The only case where `== null` is idiomatic is when you want to catch both null and undefined in one check.

Finally, the two operators that transformed LWC code: optional chaining `?.` and nullish coalescing `??`. In LWC, wire adapter data arrives asynchronously. On the first render, `this.account.data` throws because `data` is undefined. With `this.account?.data?.Name`, you get `undefined` instead of an error. And `?? 'Loading...'` replaces that `undefined` with a sensible fallback — without accidentally replacing `0` or empty string the way `||` would. Learn these two operators thoroughly.

## Exam Tips
- `typeof null` returns `"object"` — a JavaScript bug. Always check for null explicitly with `=== null`, never rely on `typeof`.
- `NaN !== NaN` is `true` — NaN is the only value in JavaScript not equal to itself. Use `Number.isNaN(value)` to check for NaN, not the global `isNaN()`.
- `const` prevents re-assignment of the binding, not mutation of the value. `const arr = []; arr.push(1)` is legal.
- `??` returns the right side only when the left side is `null` or `undefined` — not for `0`, `""`, or `false`. Use `||` if you want to replace any falsy value; use `??` if `0` and `""` are valid values you want to keep.
- `null == undefined` is `true` (loose equality), but `null === undefined` is `false` (strict). The `== null` pattern is an accepted idiom to check for both at once.
- `typeof` always returns a string — so the comparison is `typeof x === "number"`, not `typeof x === number`.

## Lecture Summary
JavaScript variables are declared with `var` (function-scoped, legacy), `let` (block-scoped, reassignable), or `const` (block-scoped, non-reassignable binding) — prefer `const` by default. The language has seven primitive types (number, string, boolean, null, undefined, symbol, bigint) plus object, with primitives compared by value and objects by reference. `typeof` reveals most types at runtime but has two key bugs: `typeof null === "object"` and `typeof [] === "object"`. Strict equality (`===`) avoids the unpredictable coercion rules of loose equality (`==`). The modern operators `??` (nullish coalescing) and `?.` (optional chaining) are essential in LWC for safely navigating wire adapter data that arrives asynchronously.

## Mini Quiz

**Q1:** What does the following expression evaluate to?
```javascript
console.log(typeof null === 'object');
console.log(0 == false);
console.log(0 === false);
```
A) `true`, `true`, `true`
B) `true`, `true`, `false`
C) `false`, `true`, `false`
D) `false`, `false`, `false`
**Answer:** B — `typeof null` is `"object"` (the historic JavaScript bug), so `typeof null === 'object'` is `true`. `0 == false` is `true` because loose equality coerces `false` to `0`. `0 === false` is `false` because strict equality requires the same type — number is not boolean.

**Q2:** An LWC developer writes the following getter in a component that receives data from a `@wire` call:
```javascript
get displayName() {
    return this.account.data.Name || 'Anonymous';
}
```
The component throws an error on first render. Which rewrite correctly fixes this AND preserves the empty string `""` as a valid name?
A) `return this.account && this.account.data && this.account.data.Name || 'Anonymous';`
B) `return this.account?.data?.Name ?? 'Anonymous';`
C) `return this.account?.data?.Name || 'Anonymous';`
D) `return (this.account !== null) ? this.account.data.Name : 'Anonymous';`
**Answer:** B — Option B uses optional chaining `?.` to safely traverse the chain (returning `undefined` instead of throwing if any step is null/undefined) and nullish coalescing `??` to provide the fallback only when the result is null or undefined. Option C would work for the crash but would replace an empty string name with 'Anonymous' because `||` replaces all falsy values. Option A is verbose and would still replace `""`. Option D does not protect against `account.data` being undefined.

**Q3:** What is the output of this code?
```javascript
const a = 5;
let b = '5';
console.log(a == b);
console.log(a === b);
console.log(typeof a);
console.log(typeof b);
```
A) `true`, `false`, `"number"`, `"string"`
B) `false`, `false`, `"number"`, `"string"`
C) `true`, `true`, `"number"`, `"number"`
D) `true`, `false`, `"int"`, `"string"`
**Answer:** A — `a == b` is `true` because loose equality coerces the string `'5'` to the number `5` before comparing. `a === b` is `false` because strict equality requires identical types — number and string are different. `typeof 5` is `"number"` and `typeof '5'` is `"string"`. JavaScript has no `"int"` type.
