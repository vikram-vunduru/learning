# Lecture 18: Modern JavaScript Features

## Learning Objectives
- Use tagged template literals to process template strings with a custom function
- Explain the Proxy and Reflect objects and describe common use cases for interception
- Use Symbol to create unique property keys that avoid naming collisions
- Apply Object static methods: `Object.freeze`, `Object.seal`, `Object.assign`, `Object.entries`, `Object.keys`, `Object.values`, and `Object.fromEntries`
- Use nullish coalescing assignment (`??=`), logical OR assignment (`||=`), and logical AND assignment (`&&=`)
- Distinguish between `structuredClone()` and `JSON.parse(JSON.stringify())` for deep cloning
- Describe WeakRef and FinalizationRegistry and their relationship to garbage collection

## Slides

### Slide 1: Tagged Template Literals
**Visual:** Code showing a tagged template literal function `highlight` processing a template string. Arrow diagram showing how the function receives the `strings` array and the `...values` spread arguments separately, then reassembles them.
**Content:**
- Regular template literals: `` `Hello, ${name}!` `` — interpolation only
- **Tagged template literals** — prefix with a function to process the template:
  ```js
  function highlight(strings, ...values) {
    // strings: array of string parts between interpolations
    // values: array of interpolated expression results
    return strings.reduce((result, str, i) => {
      const val = values[i - 1];
      return result + (val !== undefined ? `<strong>${val}</strong>` : '') + str;
    });
  }

  const user = 'Alice';
  const score = 98;
  const msg = highlight`Player ${user} scored ${score} points`;
  // 'Player <strong>Alice</strong> scored <strong>98</strong> points'
  ```
- **String.raw** — built-in tag that returns raw string without processing escape sequences:
  ```js
  String.raw`C:\Users\name\file.txt`  // 'C:\\Users\\name\\file.txt' — backslashes preserved
  ```
- Real-world uses: SQL query builders, CSS-in-JS (`styled-components`), internationalization (i18n), XSS-safe HTML templating
- The tag function receives `strings.raw` property for unprocessed escape sequences
**Speaker Notes:** Tagged templates are one of those features that look unusual but unlock genuinely powerful patterns. The `styled-components` library uses them for CSS-in-JS: `` styled.div`color: ${props.color}` ``. SQL query builders use them to safely parametrize queries. The key mental model: the tag function intercepts the template before JavaScript assembles the string, giving you full control over how interpolated values are treated. `String.raw` is the most commonly encountered built-in tag.

### Slide 2: Proxy and Reflect
**Visual:** Diagram showing a target object on the right, a Proxy object in the middle intercepting operations (get, set, has), and user code on the left interacting with the Proxy. The Proxy forwards allowed operations to the target. Callout showing common use cases: validation, logging, reactive data.
**Content:**
- **Proxy** — wraps an object and intercepts operations (get, set, delete, has, etc.):
  ```js
  const handler = {
    get(target, prop) {
      console.log(`Getting: ${prop}`);
      return prop in target ? target[prop] : `Property '${prop}' not found`;
    },
    set(target, prop, value) {
      if (typeof value !== 'number') throw new TypeError('Only numbers allowed');
      target[prop] = value;
      return true;  // must return true to indicate success
    }
  };

  const target = { x: 1, y: 2 };
  const proxy = new Proxy(target, handler);

  proxy.x;         // logs "Getting: x" → 1
  proxy.z;         // logs "Getting: z" → "Property 'z' not found"
  proxy.x = 'hi'; // throws TypeError
  ```
- **Reflect** — mirrors Proxy trap names; provides default behavior for traps:
  ```js
  const loggingProxy = new Proxy(target, {
    get(target, prop, receiver) {
      console.log(`Getting: ${prop}`);
      return Reflect.get(target, prop, receiver);  // default get behavior
    }
  });
  ```
- Common Proxy use cases: validation, logging, reactive data systems (Vue 3's reactivity), virtual properties, access control
**Speaker Notes:** Vue 3's entire reactivity system is built on Proxy — when you assign to a reactive property, the Proxy `set` trap notifies Vue to re-render. This replaced Vue 2's `Object.defineProperty` approach, which couldn't detect property addition or deletion. `Reflect` is useful inside Proxy traps to implement default behavior — calling `Reflect.get(target, prop, receiver)` is equivalent to `target[prop]`, but handles edge cases like prototype chains and getters correctly. Always return `true` from `set` traps to indicate success.

### Slide 3: Symbol, Object.freeze/seal/assign
**Visual:** Three panels. Left: Symbol showing unique property keys with no collision between Symbol('id') === Symbol('id') being false. Middle: Object.freeze/seal comparison table. Right: Object.assign copying properties.
**Content:**
- **Symbol** — creates a unique, immutable primitive value; always unique even if same description:
  ```js
  const id1 = Symbol('id');
  const id2 = Symbol('id');
  id1 === id2;  // false — always unique

  const user = { name: 'Alice', [id1]: 42 };  // symbol as computed property key
  user[id1];    // 42 — only accessible with the original symbol reference
  Object.keys(user);  // ['name'] — symbols are not enumerable in for...in or Object.keys
  ```
  - Well-known symbols: `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`
- **Object.freeze(obj)** — makes object **immutable**: no add, no delete, no modify (shallow):
  ```js
  const config = Object.freeze({ host: 'localhost', port: 3000 });
  config.port = 8080;  // silent failure in non-strict; error in strict mode
  ```
- **Object.seal(obj)** — **no add or delete**, but existing properties CAN be modified:
  ```js
  const obj = Object.seal({ x: 1 });
  obj.x = 2;      // OK — modify allowed
  obj.y = 3;      // silent failure — can't add
  delete obj.x;   // silent failure — can't delete
  ```
- **Object.assign(target, ...sources)** — shallow copy properties:
  ```js
  const merged = Object.assign({}, defaults, overrides);  // non-destructive merge
  ```
**Speaker Notes:** Symbols solve the "property name collision" problem in mixins and libraries. If a library adds a property `toString` to your object, it breaks your existing `toString`. With Symbol, each library uses its own unique symbol key with zero chance of collision. The distinction between `Object.freeze` and `Object.seal` is a common exam question: freeze = no changes at all; seal = no structural changes (add/delete) but values can be updated. Both are shallow — nested objects are not affected and must be frozen/sealed separately.

### Slide 4: Object Methods — entries, keys, values, fromEntries
**Visual:** Object diagram showing a `user` object, then arrows to: Object.keys() → ['name', 'age'], Object.values() → ['Alice', 30], Object.entries() → [['name','Alice'],['age',30]], Object.fromEntries() converting map/entries back to object.
**Content:**
- **Object.keys(obj)** — returns array of own enumerable string property keys
- **Object.values(obj)** — returns array of own enumerable values
- **Object.entries(obj)** — returns array of `[key, value]` pairs
- **Object.fromEntries(entries)** — creates object from iterable of `[key, value]` pairs:
  ```js
  const user = { name: 'Alice', age: 30, role: 'admin' };

  Object.keys(user);    // ['name', 'age', 'role']
  Object.values(user);  // ['Alice', 30, 'admin']
  Object.entries(user); // [['name','Alice'], ['age',30], ['role','admin']]

  // Transform object values using entries + fromEntries
  const doubled = Object.fromEntries(
    Object.entries({ a: 1, b: 2, c: 3 }).map(([k, v]) => [k, v * 2])
  );
  // { a: 2, b: 4, c: 6 }

  // Convert Map to plain object
  const map = new Map([['x', 1], ['y', 2]]);
  const obj = Object.fromEntries(map);  // { x: 1, y: 2 }
  ```
- `Object.entries()` + `Object.fromEntries()` = transform objects functionally (no mutation)
- These methods only enumerate own properties — inherited prototype properties excluded
**Speaker Notes:** The entries + fromEntries pattern is incredibly useful for object transformations. Instead of looping over an object and building a new one imperatively, you can pipeline: entries → map/filter → fromEntries. For example, filtering out null values from an object: `Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))`. Note that symbol-keyed properties are excluded from all four of these methods — symbols are intentionally non-enumerable.

### Slide 5: Logical Assignment Operators and Deep Cloning
**Visual:** Left panel: three logical assignment operators with before/after variable states. Right panel: structuredClone vs JSON.parse(JSON.stringify) comparison table showing what each handles (Dates, undefined, functions, circular refs).
**Content:**
- **Logical assignment operators** (ES2021) — combine logical operators with assignment:
  ```js
  // ??= (nullish coalescing assignment) — assign if null or undefined
  let user = null;
  user ??= 'Anonymous';  // user = 'Anonymous' (was null)
  let count = 0;
  count ??= 10;          // count stays 0 (0 is not null/undefined)

  // ||= (logical OR assignment) — assign if falsy
  let name = '';
  name ||= 'Default';   // name = 'Default' ('' is falsy)

  // &&= (logical AND assignment) — assign if truthy
  let config = { debug: false };
  config &&= { ...config, version: 2 };  // config updated (was truthy)
  ```
- **Deep cloning:**
  ```js
  // structuredClone() — built-in deep clone (Node 17+, modern browsers)
  const clone = structuredClone(original);
  // Handles: Dates, Maps, Sets, ArrayBuffers, RegExp, undefined
  // Does NOT handle: functions, DOM nodes, class instances (loses prototype)

  // JSON.parse(JSON.stringify()) — old approach
  const clone2 = JSON.parse(JSON.stringify(original));
  // Loses: Date (→ string), undefined (removed), functions (removed), circular refs → ERROR
  ```
- **structuredClone** is superior: handles Dates, Maps, Sets, RegExp; preserves undefined
- Neither handles functions — functions cannot be deep-cloned meaningfully
**Speaker Notes:** The `??=` vs `||=` distinction is a subtle but important one. `??=` only assigns when the value is null or undefined — it leaves `0`, `false`, and `''` alone. `||=` assigns for any falsy value — including `0`, `false`, and empty string. Use `??=` when you want to provide defaults for "missing" values (null/undefined) without accidentally overwriting intentional falsy values like `0` or `false`. For deep cloning, always prefer `structuredClone` in modern environments — the JSON roundtrip trick has too many gotchas.

### Slide 6: WeakRef and FinalizationRegistry
**Visual:** Memory diagram showing a strong reference holding an object alive vs a WeakRef that allows the garbage collector to collect the object. FinalizationRegistry callback firing after the object is collected.
**Content:**
- **Garbage collection** — JavaScript automatically frees memory for objects with no strong references
- **WeakRef** (ES2021) — holds a weak reference to an object; does NOT prevent garbage collection:
  ```js
  let user = { name: 'Alice', data: new Array(1000000).fill(0) };
  const weakRef = new WeakRef(user);

  user = null;  // strong reference removed — object may be GC'd

  // deref() returns the object if still alive, undefined if collected
  const obj = weakRef.deref();
  if (obj) {
    console.log(obj.name);  // only safe if still alive
  }
  ```
- **FinalizationRegistry** — register a callback that fires after an object is garbage collected:
  ```js
  const registry = new FinalizationRegistry((heldValue) => {
    console.log(`${heldValue} was collected`);
  });

  let target = { data: 'large dataset' };
  registry.register(target, 'my target');

  target = null;  // eventually → 'my target was collected' logged
  ```
- **Use cases:** caches that auto-release entries, tracking resource cleanup
- **Caution:** GC timing is non-deterministic — never rely on it for critical cleanup; prefer explicit cleanup
**Speaker Notes:** WeakRef and FinalizationRegistry are advanced features rarely needed in application code — they exist for library authors building things like caches. The timing of garbage collection is not guaranteed by the JavaScript spec — it's implementation-dependent. This means you cannot rely on FinalizationRegistry for critical cleanup logic. The key conceptual point for the exam: a WeakRef does not prevent garbage collection, unlike a regular reference. This is the same principle behind WeakMap and WeakSet.

## Recording Script

Welcome to Lecture 18: Modern JavaScript Features. This lecture covers several advanced features that represent the frontier of the language.

Tagged template literals let you process template strings before they're assembled. A tag function receives the string parts as an array and the interpolated values as separate arguments. This is how `styled-components` handles CSS-in-JS, and how SQL libraries build parametrized queries safely.

Proxy wraps any object and intercepts operations — get, set, delete, has, and more. Vue 3's reactivity system is entirely built on Proxy. The Reflect API provides default trap behaviors and should be used inside Proxy handlers for correct prototype chain behavior.

Symbol creates globally unique primitive values. Even `Symbol('id') === Symbol('id')` is false. Symbols as property keys avoid naming collisions in libraries and mixins — they're also invisible to `Object.keys` and `for...in`.

Object statics you must know: freeze makes an object fully immutable; seal prevents adding/deleting properties but allows modification; assign shallow copies properties. The entries/keys/values/fromEntries quartet lets you transform objects functionally.

The logical assignment operators from ES2021: `??=` assigns only when null or undefined — great for providing defaults without overwriting falsy values like `0`. `||=` assigns for any falsy value. `&&=` assigns only when truthy.

Deep cloning: prefer `structuredClone()` over the JSON roundtrip. `structuredClone` handles Dates, Maps, Sets, and undefined. The JSON approach loses Dates, undefined, and functions, and crashes on circular references.

WeakRef and FinalizationRegistry are advanced memory management tools. WeakRef holds a reference without preventing GC. FinalizationRegistry fires a callback when an object is collected. Use sparingly — GC timing is non-deterministic.

## Exam Tips
- **Tagged template literals:** tag function receives `(strings, ...values)` — strings is an array of literal parts
- **Proxy `set` trap** must `return true` to indicate success; otherwise the operation is treated as failed
- **Symbol uniqueness:** `Symbol('x') !== Symbol('x')` — always unique even with same description
- **Symbol property keys** are excluded from `Object.keys()`, `Object.values()`, `Object.entries()`, `for...in`
- **`Object.freeze`** = fully immutable (no add/modify/delete); **`Object.seal`** = no add/delete but CAN modify
- **Both are shallow** — nested objects are not frozen/sealed
- **`??=`** assigns if null/undefined; **`||=`** assigns if falsy — `??=` preserves `0` and `false`
- **`structuredClone`** vs JSON roundtrip: structuredClone handles Dates, Maps, Sets, undefined, circular-ref-safe
- **WeakRef** prevents nothing — the object CAN be garbage collected; use `.deref()` and check for undefined

## Lecture Summary
Tagged template literals pass template strings to a function for custom processing — used in styled-components, SQL builders, and i18n. Proxy wraps objects to intercept operations (get, set, has, delete) enabling validation, logging, and reactivity; Reflect provides default trap implementations. Symbol creates unique, non-enumerable property keys. `Object.freeze` creates fully immutable objects; `Object.seal` prevents structural changes only; both are shallow. `Object.entries`/`Object.fromEntries` enable functional object transformation. Logical assignment operators: `??=` (assign if null/undefined), `||=` (assign if falsy), `&&=` (assign if truthy). `structuredClone()` is the modern deep clone API, superior to the JSON roundtrip because it handles Dates, Maps, Sets, and undefined. WeakRef holds non-preventing references to objects, allowing GC; FinalizationRegistry fires callbacks post-collection — both are advanced and GC timing is non-deterministic.

## Mini Quiz

**Question 1:** Given `let count = 0; count ??= 5;` — what is the value of `count` after the assignment?

A) `5` — because `??=` assigns the right-hand side
B) `0` — because `0` is not null or undefined, so `??=` does not assign
C) `NaN`
D) `undefined`

**Answer: B — `0`**
The `??=` (nullish coalescing assignment) only assigns when the left-hand side is `null` or `undefined`. Zero (`0`) is a valid number, not nullish, so the assignment is skipped and `count` stays `0`. This contrasts with `||=` which would assign because `0` is falsy: `count ||= 5` would set count to `5`.

---

**Question 2:** Which of the following is a correct statement about `Object.freeze()`?

A) It recursively freezes all nested objects
B) It prevents property modification, addition, and deletion on the target object, but nested objects remain mutable
C) It prevents property addition but allows modification of existing properties
D) It is equivalent to `Object.seal()` — both prevent all changes

**Answer: B — shallow freeze only, nested objects remain mutable**
`Object.freeze` makes the direct properties of the target object immutable — you cannot add, delete, or modify them. However, it is shallow: if a property holds a reference to another object, that nested object is not frozen and can be mutated. `Object.seal` (option C description) prevents addition and deletion but allows modification — it is not equivalent to freeze (eliminating D).

---

**Question 3:** What is the key advantage of `structuredClone()` over `JSON.parse(JSON.stringify(obj))`?

A) structuredClone is synchronous; JSON methods are asynchronous
B) structuredClone handles circular references, Date objects, Maps, Sets, and undefined values correctly; the JSON approach does not
C) structuredClone creates a shallow copy; JSON creates a deep copy
D) structuredClone preserves function references; JSON does not

**Answer: B — circular references, Dates, Maps, Sets, undefined**
`structuredClone` correctly clones Dates (as Date objects, not strings), Maps, Sets, RegExp, ArrayBuffers, undefined values, and circular references. The JSON roundtrip converts Dates to strings, removes undefined properties and array holes, drops function properties, and throws a `TypeError` on circular references. Neither handles functions — option D is false. Both create deep copies — option C is false.
