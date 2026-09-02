# Modern JavaScript Features (ES6+)

## Exam Domain
Variables, Types & Operators / Functions — ~10% (ES6+ syntax runs through every domain)

## Core Concepts

### Destructuring — Deep Dive
```javascript
// Array destructuring with skip
const [,second,,fourth] = [1, 2, 3, 4];  // second=2, fourth=4

// Default values
const [a = 10, b = 20] = [5];  // a=5, b=20

// Swap
let x = 1, y = 2;
[x, y] = [y, x];

// Object destructuring with rename + default
const { name: fullName, age = 18, address: { city } = {} } = person;

// Function parameter destructuring (very common)
function displayUser({ name, role = 'guest', permissions = [] }) {
    return `${name} (${role}): ${permissions.join(', ')}`;
}
```

### Spread & Rest — All Forms
```javascript
// Spread into function call
Math.max(...[1, 2, 3]);   // same as Math.max(1, 2, 3)

// Spread into array
const combined = [...arr1, ...arr2, 'extra'];

// Spread for shallow object merge (last key wins)
const merged = { ...defaults, ...overrides };
const updated = { ...existing, status: 'active' };  // update one key

// Rest in function params
function first(a, b, ...rest) {
    console.log(rest);  // array of remaining
}
first(1, 2, 3, 4, 5);  // rest = [3, 4, 5]

// Rest in destructuring
const { id, ...remaining } = record;  // remaining = record without id
const [head, ...tail] = array;
```

### Template Literals
```javascript
const name = 'Alice';
const greeting = `Hello, ${name}!`;            // basic interpolation
const multiline = `Line 1
Line 2
Line 3`;

// Expression interpolation
const price = `Total: ${(qty * unitPrice).toFixed(2)}`;
const ternary = `Status: ${isActive ? 'active' : 'inactive'}`;

// Tagged templates (advanced — appears on exam)
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<b>${values[i]}</b>` : '');
    }, '');
}
const output = highlight`Name: ${name}, Age: ${age}`;
// 'Name: <b>Alice</b>, Age: <b>30</b>'
```

### Short-Circuit Operators & Logical Assignment
```javascript
// Nullish coalescing assignment (??=) — assign only if null/undefined
config.timeout ??= 3000;      // sets to 3000 only if currently null/undefined

// Logical OR assignment (||=) — assign only if falsy
config.name ||= 'default';    // sets if '', 0, false, null, undefined

// Logical AND assignment (&&=) — assign only if truthy
config.data &&= processData(config.data);  // only processes if data exists

// Optional chaining with nullish coalescing (common LWC pattern)
const name = user?.profile?.displayName ?? 'Anonymous';
const count = response?.data?.records?.length ?? 0;
const method = obj?.method?.();  // safe method call
```

### Symbol
```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
sym1 === sym2;  // false — every Symbol is unique

// Well-known symbols
Symbol.iterator  // marks an object as iterable
Symbol.toPrimitive // customizes type coercion
Symbol.hasInstance // customizes instanceof

// As object key (not string)
const id = Symbol('id');
const obj = { [id]: 123, name: 'Alice' };
obj[id];            // 123
Object.keys(obj);   // ['name'] — Symbols excluded!
```

### Proxy & Reflect (Advanced)
```javascript
// Proxy intercepts operations on an object
const handler = {
    get(target, prop) {
        console.log(`Getting ${prop}`);
        return prop in target ? target[prop] : undefined;
    },
    set(target, prop, value) {
        if (typeof value !== 'number') throw new TypeError('Numbers only');
        target[prop] = value;
        return true;  // REQUIRED in strict mode
    }
};

const proxy = new Proxy({}, handler);
proxy.age = 30;     // set trap fires
proxy.age;          // get trap fires, returns 30
proxy.age = 'x';    // throws TypeError

// Reflect — perform default operations (use inside Proxy traps)
Reflect.get(target, prop);   // same as target[prop]
Reflect.set(target, prop, value);
```

## Architecture / How It Works

### ES2020+ Features — Quick Reference
```
ES2020:
  ??  nullish coalescing
  ?.  optional chaining
  BigInt
  Promise.allSettled
  import() dynamic

ES2021:
  ??=  ||=  &&=  logical assignment
  String.replaceAll()
  Promise.any

ES2022:
  #privateFields
  Object.hasOwn() (replaces hasOwnProperty)
  Array.at(-1) — negative indexing
  await at top level of module

ES2023:
  Array.findLast(), findLastIndex()
  Array.toSorted(), toReversed(), toSpliced() — non-mutating versions
```

**Limitations:**
- Spread is a SHALLOW clone — nested objects are still shared references
- `Symbol` keys are NOT included in `JSON.stringify()`, `Object.keys()`, or `for...in`
- Proxy traps MUST return a boolean for set — returning `undefined` (falsy) throws in strict mode
- `??=` assigns on null/undefined only; `||=` assigns on any falsy (they are different!)

## PTA / SA Relevance

**Code review flags:**
- `Object.assign({}, obj)` vs `{ ...obj }` — both shallow clone; spread is preferred modern syntax
- `||` as default operator when 0 or "" are valid values — use `??` instead
- Nested destructuring without default values on deep paths — crashes if intermediate property is undefined
- `for...of Object.entries(obj)` — correct modern pattern for iterating key-value pairs

**LWC patterns:**
- Optional chaining (`?.`) is mandatory for wire data access — first render arrives before wire resolves
- Logical assignment (`??=`) for lazy initialization of internal state
- Spread for creating updated record drafts: `this.record = { ...this.record, status: 'Active' }`

**Customer advisory:** When reviewing a partner's LWC codebase that uses ES5-style code (prototype assignment, `var`, `arguments`), it signals the code wasn't written for LWC (likely ported from elsewhere). Modern JS features in LWC improve both correctness and readability.

## Key Facts to Memorize
- Spread `...` is shallow — nested objects share references
- Template literal: backticks with `${expression}` — can be multiline, can embed ANY expression
- `Symbol()` always creates unique value — even `Symbol('x') !== Symbol('x')`
- Symbol keys are invisible to `Object.keys()`, `JSON.stringify()`, `for...in`
- `??=` null/undefined only; `||=` any falsy; `&&=` if currently truthy
- `Array.at(-1)` gets last element (ES2022)
- `Object.hasOwn(obj, key)` is the modern replacement for `obj.hasOwnProperty(key)`

## Exam Traps
- `{...obj}` is shallow — `obj.nested` and `copy.nested` are THE SAME object
- Optional chaining `a?.b?.c` evaluates to `undefined` if any part is null/undefined — not null
- `[Symbol.iterator]` (well-known symbol) vs `Symbol('iterator')` (custom unique symbol) — different!
- Tagged template literals: the tag function receives `strings` array AND value expressions — order matters

## Practice Questions
**Q:** What is the output?
```javascript
const obj = { a: 1, b: { c: 2 } };
const copy = { ...obj };
copy.b.c = 99;
console.log(obj.b.c);
```
**A:** `99`. Spread is shallow — `copy.b` and `obj.b` point to the same nested object. Modifying `copy.b.c` also changes `obj.b.c`.

**Q:** What does `??=` do, and how is it different from `||=`?
**A:** `x ??= value` assigns `value` to `x` only if `x` is null or undefined. `x ||= value` assigns `value` to `x` if `x` is any falsy value (0, "", false, null, undefined). For `x = 0`: `x ??= 5` leaves x as 0; `x ||= 5` sets x to 5.

**Q:** How do you get the last element of an array in modern JavaScript?
**A:** `array.at(-1)`. This is `Array.at()` with a negative index (ES2022). The older approach was `array[array.length - 1]`.
