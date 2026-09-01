# Lecture 09: Collections — Arrays, Objects, Map, and Set

## Learning Objectives
- Create and access arrays using literal syntax, destructuring, and spread/rest
- Apply core array iteration methods: map, filter, reduce, find, findIndex, some, every, flat, and flatMap
- Use Array.from() and Array.isArray() to safely work with array-like values
- Explain the default lexicographic sort and write a correct numeric custom compare function
- Create objects using literals, shorthand properties, computed keys, and the spread operator
- Choose between Map and Object based on use-case criteria
- Use Set for unique-value collections and iterate its contents
- Describe the garbage-collection semantics of WeakMap and WeakSet

## Slides

### Slide 1: Array Creation and Access
**Visual:** Three code panels side by side: literal syntax, Array constructor, and Array.from() with a NodeList, each with annotations showing the resulting index structure.
**Content:**
- Literal syntax: `const nums = [1, 2, 3];`
- Constructor (less common): `new Array(3)` creates a sparse 3-slot array, **not** `[3]`
- `Array.from('hello')` → `['h','e','l','l','o']`; accepts any iterable or array-like
- `Array.from({ length: 5 }, (_, i) => i)` → `[0, 1, 2, 3, 4]` — idiomatic range
- `Array.isArray(val)` — reliable type check; `typeof []` returns `'object'`, not `'array'`
- Access by index: `nums[0]` (0-based); `nums[nums.length - 1]` for last element
- Arrays are **objects** — `typeof []` is `'object'`; use `Array.isArray()` for checks
**Speaker Notes:** The new Array(3) pitfall shows up on exams. `new Array(3)` gives you a sparse array with three empty slots — it does not give you `[3]`. When you need to create a range of numbers, the `Array.from({ length: n }, (_, i) => i)` idiom is idiomatic modern JavaScript and much cleaner than a for loop. Always use Array.isArray() instead of typeof for arrays because typeof returns 'object' for arrays.

### Slide 2: Destructuring, Spread, and Rest
**Visual:** Side-by-side code showing array destructuring with default values and skipping elements, then spread for copying and concatenating, then rest in a function parameter, with output annotations.
**Content:**
- Destructuring — extract by position:
  ```js
  const [first, , third] = [10, 20, 30]; // skips index 1
  const [a = 0, b = 0] = [5];            // b defaults to 0
  ```
- Swap without a temp variable: `[x, y] = [y, x];`
- Spread copies and concatenates arrays:
  ```js
  const copy = [...original];
  const merged = [...arr1, ...arr2, 99];
  ```
- Spread is **shallow** — nested objects are still references
- Rest collects remaining elements into an array:
  ```js
  function sum(first, ...rest) { /* rest is an array */ }
  const [head, ...tail] = [1, 2, 3]; // tail = [2, 3]
  ```
**Speaker Notes:** The swap idiom using destructuring — `[x, y] = [y, x]` — is a practical trick that comes up in interviews and sometimes in exam questions. The shallow-copy caveat on spread is critical: if your array contains objects, the objects themselves are not copied. Modifying a nested object in the copy will also change the original. Rest parameters must always be the last parameter in a function signature.

### Slide 3: Transformation Methods — map, filter, reduce
**Visual:** Pipeline diagram showing an original array flowing through map (transforms each element), then filter (removes some), then reduce (collapses to a single value), with example values at each stage.
**Content:**
- **map:** Returns new array of same length, each element transformed
  ```js
  [1, 2, 3].map(n => n * 2); // [2, 4, 6]
  ```
- **filter:** Returns new array containing only elements where callback returns truthy
  ```js
  [1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]
  ```
- **reduce:** Accumulates array to a single value; initial value is the second argument
  ```js
  [1, 2, 3].reduce((acc, n) => acc + n, 0); // 6
  ```
- All three return new values — original array is **not mutated**
- Chainable: `arr.filter(...).map(...).reduce(...)`
- `reduceRight()` iterates right-to-left
**Speaker Notes:** Forgetting the initial value in reduce is a common bug. Without an initial value, reduce uses the first element as the initial accumulator and starts iterating from index 1 — this works for simple sums but fails silently on empty arrays or complex accumulators. Always provide the initial value. Chaining map, filter, and reduce is one of the signature patterns of functional-style JavaScript and appears frequently in exam questions about producing derived data.

### Slide 4: Search and Test Methods
**Visual:** Table comparing find, findIndex, some, every, includes, and indexOf — showing the input, what it returns, and whether it short-circuits, with one example row per method.
**Content:**
- **find:** Returns the **first element** that satisfies the callback; `undefined` if none
- **findIndex:** Returns the **index** of the first match; `-1` if none
- **some:** Returns `true` if **at least one** element satisfies the callback
- **every:** Returns `true` if **all** elements satisfy the callback
- **includes(val):** Returns `true` if val is in the array (strict equality, no callback)
- **indexOf(val):** Returns first index of val; `-1` if absent (no callback)
- `find`, `findIndex`, `some`, `every` all short-circuit — they stop early when the answer is determined
  ```js
  const users = [{id:1,active:true},{id:2,active:false}];
  users.find(u => u.id === 2);     // {id:2,active:false}
  users.every(u => u.active);      // false
  ```
**Speaker Notes:** The distinction between find (element) and findIndex (index) is a frequent exam question. Some and every are conceptually like logical OR and AND across the array — some returns true the moment any element passes, every returns false the moment any element fails. This short-circuit behavior makes them efficient on large arrays.

### Slide 5: Flattening and Sorting
**Visual:** Animated-style diagram showing a nested array tree being flattened one level by flat(), then a string-sorted array of numbers with unexpected order versus the same array with a numeric compare function producing the correct order.
**Content:**
- **flat(depth):** Flattens nested arrays; default depth is 1; `Infinity` for fully deep
  ```js
  [[1,2],[3,[4]]].flat();           // [1, 2, 3, [4]]
  [[1,2],[3,[4]]].flat(Infinity);   // [1, 2, 3, 4]
  ```
- **flatMap(fn):** Equivalent to `.map(fn).flat(1)` — more efficient; useful for one-to-many transforms
  ```js
  ['hello world'].flatMap(s => s.split(' ')); // ['hello', 'world']
  ```
- **sort()** — critical gotcha: default sort converts elements to **strings** and sorts lexicographically
  ```js
  [10, 9, 2, 1, 100].sort(); // [1, 10, 100, 2, 9]  ← WRONG for numbers
  [10, 9, 2, 1, 100].sort((a, b) => a - b); // [1, 2, 9, 10, 100] ← correct
  ```
- Compare function contract: return negative (a before b), 0 (equal), positive (b before a)
- `sort()` mutates the original array in place
**Speaker Notes:** The default sort lexicographic gotcha is one of the most tested JavaScript traps. If you sort `[10, 9, 2, 1, 100]` without a compare function, JavaScript converts each number to a string and sorts them alphabetically, so "10" comes before "2" because "1" < "2" as a first character. The fix is always to provide a numeric compare function: `(a, b) => a - b` for ascending. The fact that sort mutates the original array is another exam point — if you need to preserve the original, spread first: `[...arr].sort(...)`.

### Slide 6: Objects — Creation, Destructuring, and Spread
**Visual:** Three code panels: object literal with shorthand and computed keys; destructuring with rename and default; spread for shallow merge; each with output annotations.
**Content:**
- Shorthand property names: `const obj = { x, y }` instead of `{ x: x, y: y }`
- Computed keys: `const key = 'name'; const obj = { [key]: 'Alice' }` → `{ name: 'Alice' }`
- Object destructuring with rename: `const { name: alias, age = 18 } = person;`
- Nested destructuring: `const { address: { city } } = user;`
- Object spread — shallow merge:
  ```js
  const updated = { ...original, age: 31 }; // later key wins
  ```
- `Object.keys(obj)`, `Object.values(obj)`, `Object.entries(obj)` return arrays for iteration
- `Object.assign(target, source)` — older equivalent of spread; mutates target
**Speaker Notes:** Computed property keys are powerful and appear in exam questions about dynamic object construction. The later key wins rule in spread is important: `{ ...original, age: 31 }` overrides the `age` property from `original` with 31. Object spread is also shallow — nested objects are not deep-cloned. For deep copies, use JSON.parse(JSON.stringify(obj)) as a simple fallback, though it has known limitations with functions and undefined values.

### Slide 7: Map vs Object, Set, WeakMap, WeakSet
**Visual:** Decision tree: "Do keys need to be non-strings?" → Map. "Do you need insertion-order iteration?" → Map. "Do you need JSON serialization?" → Object. Below, Set diagram showing duplicate insertion producing a single entry. Small WeakMap note box on the side.
**Content:**
- **Map:** Any key type (objects, functions, primitives); ordered by insertion; iterable directly
  ```js
  const m = new Map(); m.set('a', 1); m.get('a'); // 1
  m.size; // not .length
  ```
- **Object:** String/Symbol keys only; prototype chain inheritance; JSON-serializable
- Use Map when: keys are non-strings, iteration order matters explicitly, frequent adds/deletes
- **Set:** Collection of unique values; duplicates are silently ignored
  ```js
  const s = new Set([1, 2, 2, 3]); // Set {1, 2, 3}
  s.has(2); // true; s.size // 3
  [...s] // spread to array
  ```
- **WeakMap / WeakSet:** Keys must be objects; hold **weak references** — entries are garbage-collected when the key object is otherwise unreachable; not iterable; no `.size`
- Use WeakMap for private data or caches tied to object lifetime
**Speaker Notes:** The Map vs Object decision is important for exam questions. A plain object has a prototype — you can accidentally collide with inherited keys like `constructor` or `toString`. Map has none of that overhead, and Map's `.size` property is reliable unlike `Object.keys(obj).length` which only counts own enumerable properties. WeakMap and WeakSet are tested briefly — know that they require object keys and that they support garbage collection by design, making them useful for metadata that should not prevent an object from being collected.

### Slide 8: Exam Traps and Quick Reference
**Visual:** Two-column reference card: left column shows common mistakes (sort default, isArray, reduce without initial value, spread shallow copy), right column shows the correct pattern for each. Color-coded red for wrong, green for correct.
**Content:**
- `typeof [] === 'object'` — always use `Array.isArray()` for array checks
- `.sort()` without compare function is **lexicographic** — numeric sort requires `(a, b) => a - b`
- `.reduce()` without initial value fails on empty arrays — always provide the second argument
- Spread is **shallow** — `[...arr]` and `{...obj}` do not deep-clone nested references
- `Map.size` vs `Array.length` vs `Object.keys(o).length` — each collection has its own size idiom
- `new Array(3)` is NOT `[3]` — creates 3 empty slots; use `Array.from({length:3}, ...)` for filled ranges
- `find` returns the **element**; `findIndex` returns the **index**; both return falsy default (`undefined` / `-1`) on no match
- `some` = logical OR across array; `every` = logical AND across array
**Speaker Notes:** This slide is your exam cheat sheet for collections. The sort gotcha and the Array.isArray check appear on almost every practice exam. Knowing the difference between find and findIndex, and between some and every, will save you points. The shallow copy caveat is more of a runtime bug pattern but shows up in tricky questions that ask what value a property will have after modifying what appeared to be a copy.

## Recording Script
Welcome to Lecture 9 on Collections. This lecture covers the data structures you will use daily in JavaScript — arrays, objects, Map, and Set — and some of the subtler behaviors that trip developers up on the exam.

Let's start with arrays. You almost always create arrays with the literal syntax: brackets with comma-separated values. But know that `new Array(3)` does something surprising — it creates a three-slot sparse array, not an array containing the number 3. When you need to create a filled range, use `Array.from({ length: n }, (_, i) => i)` — that gives you an array from 0 to n minus 1. And when you need to check whether something is an array, always use `Array.isArray()`. `typeof` returns `'object'` for arrays, which is not helpful.

Destructuring is a concise way to extract values by position. You can skip elements with empty commas, provide defaults, and swap two variables without a temporary variable using `[x, y] = [y, x]`. The spread operator copies an array shallowly and lets you concatenate arrays inline. Rest collects remaining elements into a new array and must always come last in a parameter list.

Now the methods. Map, filter, and reduce are the three workhorses of functional JavaScript. Map transforms every element and returns a new array of the same length. Filter keeps only elements that pass a test. Reduce collapses the array to a single value — always provide the initial value as the second argument to avoid bugs on empty arrays. All three are non-mutating and chainable.

For searching, find returns the actual element, findIndex returns its position, and both return a falsy value if nothing matches. Some asks "does at least one element pass?" and every asks "do all elements pass?" — they short-circuit, which makes them efficient.

The sort gotcha is the most important thing in this lecture. JavaScript's default sort converts elements to strings and sorts them lexicographically. So `[10, 9, 2, 1, 100].sort()` gives you `[1, 10, 100, 2, 9]` — deeply counterintuitive. Fix it with `sort((a, b) => a - b)` for ascending numeric order. Also remember: sort mutates the original array in place.

For objects, shorthand syntax lets you write `{ x, y }` instead of `{ x: x, y: y }`. Computed keys use square brackets: `{ [dynamicKey]: value }`. Object spread is the cleanest way to merge objects — later properties win. Use `Object.keys`, `Object.values`, and `Object.entries` for iteration.

Map and Object are both key-value stores but have important differences. Map accepts any key type, guarantees insertion order, has a reliable `.size` property, and has no prototype baggage. Object is better when you need JSON serialization or a simple string-keyed configuration bag. Set stores unique values only — duplicate insertions are silently dropped. Both Map and Set are directly iterable.

WeakMap and WeakSet hold object keys by weak reference, meaning entries can be garbage-collected when the key is no longer reachable. You cannot iterate them and they have no `.size`. They are useful for caches and metadata that should not prevent garbage collection.

That covers the collections toolkit. In Lecture 10 we move to async JavaScript and the event loop.

## Exam Tips
- `typeof [] === 'object'` is always true — use `Array.isArray(val)` for array type checks, never typeof.
- `.sort()` with no argument sorts **lexicographically** (string conversion). Numeric sort always requires a compare function: `(a, b) => a - b`.
- `.sort()` **mutates** the original array. If you need an unsorted original, spread first: `[...arr].sort(fn)`.
- `.reduce()` without an initial value throws on an empty array. Always provide the second argument.
- Spread and destructuring are **shallow** — nested objects share the same reference in the copy.
- `Map.size`, not `Map.length`. `Array.length`, not `Array.size`. `Object.keys(obj).length` for objects.
- `find` → element or `undefined`. `findIndex` → index or `-1`. `some` → boolean (short-circuit OR). `every` → boolean (short-circuit AND).
- `new Array(3)` creates 3 empty slots, not `[3]`. Use `Array.from({length:3}, (_, i) => i)` for a range.
- WeakMap/WeakSet require object keys, are not iterable, and have no `.size` — entries are garbage-collected when keys become unreachable.

## Lecture Summary
Arrays support creation via literals and Array.from(), safe type-checking with Array.isArray(), and a rich method surface including map/filter/reduce for transformation, find/findIndex/some/every for searching, and flat/flatMap for nested structures. The default sort is lexicographic — numeric sorting always requires a custom compare function — and sort mutates in place. Objects support shorthand properties, computed keys, destructuring, and shallow spread merging. Map is preferred over Object when keys are non-strings or frequent iteration is needed; Set enforces uniqueness; WeakMap and WeakSet provide garbage-collection-friendly weak references.

## Mini Quiz

**Q1:** What does `[10, 9, 2, 1, 100].sort()` return?
A) `[1, 2, 9, 10, 100]`
B) `[1, 10, 100, 2, 9]`
C) `[100, 10, 9, 2, 1]`
D) `[1, 9, 2, 10, 100]`
**Answer:** B — Without a compare function, sort converts each element to a string and sorts lexicographically. "1" < "10" < "100" < "2" < "9" because string comparison is character by character. To sort numerically use `.sort((a, b) => a - b)`, which returns `[1, 2, 9, 10, 100]`.

**Q2:** A developer calls `const copy = [...original]` where `original` is `[{id:1}]`. They then run `copy[0].id = 99`. What is `original[0].id`?
A) 1 — the spread created a deep clone
B) 99 — the spread is shallow, so the nested object is shared
C) undefined — the original was detached when spread was used
D) A TypeError is thrown
**Answer:** B — Array spread creates a shallow copy. The array itself is a new array, but the objects inside it are the same references. Modifying a nested object's property through the copy also modifies the original because they point to the same object in memory.

**Q3:** Which statement about Map versus a plain Object is correct?
A) Object supports keys of any type; Map is limited to string keys
B) Map supports keys of any type; Object is limited to string and Symbol keys
C) Both Map and Object are iterable with for...of by default
D) `Map.length` gives the number of entries; `Object.size` gives the number of keys
**Answer:** B — Map accepts any value as a key, including objects and functions. Plain Objects are limited to string and Symbol keys (numeric keys are coerced to strings). Plain Objects are NOT directly iterable with for...of; you must use `Object.entries()`. Map uses `.size`, not `.length`; plain objects have no `.size` property.
