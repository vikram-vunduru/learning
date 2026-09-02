# Collections — Arrays, Objects, Map & Set

## Exam Domain
Objects, Arrays & Iterators — ~25% of exam weight

## Core Concepts

### Array Methods — The Essential Eight
```javascript
const nums = [1, 2, 3, 4, 5];

// map — transform every element, returns new array of same length
nums.map(x => x * 2);           // [2, 4, 6, 8, 10]

// filter — keep elements matching predicate
nums.filter(x => x % 2 === 0);  // [2, 4]

// reduce — accumulate to single value
nums.reduce((acc, x) => acc + x, 0);  // 15  ← always provide initial value!

// find — first element matching predicate (or undefined)
nums.find(x => x > 3);   // 4

// findIndex — index of first match (or -1)
nums.findIndex(x => x > 3);  // 3

// some — true if any element matches
nums.some(x => x > 4);  // true

// every — true if ALL elements match
nums.every(x => x > 0); // true

// flat / flatMap — flatten nested arrays
[[1, 2], [3, 4]].flat();          // [1, 2, 3, 4]
[1, 2, 3].flatMap(x => [x, x*2]); // [1, 2, 2, 4, 3, 6]
```

### sort() — The Trap
```javascript
// WRONG — default sort converts to strings (lexicographic)
[10, 9, 2, 1, 100].sort();  // [1, 10, 100, 2, 9] ← wrong!

// CORRECT — provide comparator function
[10, 9, 2, 1, 100].sort((a, b) => a - b);   // [1, 2, 9, 10, 100] ascending
[10, 9, 2, 1, 100].sort((a, b) => b - a);   // [100, 10, 9, 2, 1] descending

// sort is IN-PLACE — mutates original array!
const original = [3, 1, 2];
const sorted = [...original].sort((a, b) => a - b); // safe copy first
```

### Destructuring & Spread
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// Object destructuring
const { name, age, city = 'Unknown' } = person;  // default value
const { name: personName } = person;              // rename

// Nested destructuring
const { address: { street, zip } } = contact;

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];  // a=2, b=1

// Function parameter destructuring (very common in LWC wire handlers)
@wire(getRecord, { recordId: '$recordId' })
wiredRecord({ data, error }) { ... }  // destructures wire result
```

### Map — Key-Value with Any Key Type
```javascript
const map = new Map();

// Any type as key (including objects)
map.set('string key', 'value1');
map.set(42, 'value2');
map.set({ id: 1 }, 'value3');  // object as key

map.get('string key');  // 'value1'
map.has(42);            // true
map.size;               // 3
map.delete(42);

// Iteration order is INSERTION ORDER (guaranteed)
for (const [key, value] of map) { ... }
map.keys();    // MapIterator
map.values();  // MapIterator
map.entries(); // MapIterator of [key, value] pairs

// Convert to/from array
new Map([['a', 1], ['b', 2]]);   // from entries array
[...map.entries()];               // to array
```

**Map vs Object:**
```
┌──────────────┬──────────────────────┬────────────────────────┐
│ Feature      │ Map                  │ Object                 │
├──────────────┼──────────────────────┼────────────────────────┤
│ Key types    │ Any type             │ String or Symbol only  │
│ Order        │ Insertion order      │ Insertion (mostly)     │
│ Size         │ map.size             │ Object.keys(obj).length│
│ Default keys │ None                 │ Inherits from prototype│
│ Performance  │ Better for frequent  │ Better for simple data │
│              │ add/delete           │ structures             │
└──────────────┴──────────────────────┴────────────────────────┘
```

### Set — Unique Values
```javascript
const set = new Set([1, 2, 3, 2, 1]);  // duplicates removed
set.size;           // 3

set.add(4);
set.has(2);         // true
set.delete(2);

for (const v of set) { ... }  // insertion order

// Most common use: deduplicate array
const unique = [...new Set([1, 2, 2, 3, 3, 3])]; // [1, 2, 3]
```

### WeakMap / WeakSet
- Keys must be objects (not primitives)
- Keys are WEAKLY held — if object has no other reference, it gets garbage collected
- NOT iterable, no `.size`, no `.keys()`
- Use case: private metadata attached to objects without preventing garbage collection

```javascript
const cache = new WeakMap();
function processElement(element) {
    if (cache.has(element)) return cache.get(element);
    const result = expensiveOperation(element);
    cache.set(element, result);  // when element is removed from DOM, cache auto-clears
    return result;
}
```

## Architecture / How It Works

### Method Chaining — Data Pipeline Pattern
```
const contacts = [
    { name: 'Alice', active: true, score: 90 },
    { name: 'Bob',   active: false, score: 85 },
    { name: 'Carol', active: true, score: 70 },
];

contacts
  .filter(c => c.active)         // [Alice, Carol]
  .map(c => ({ ...c, label: c.name.toUpperCase() }))  // transform
  .sort((a, b) => b.score - a.score)  // descending by score
  .slice(0, 10)                  // top 10
  → result without mutation of original array
```

**Limitations:**
- `sort()` is in-place — always clone first with spread if you need to preserve original
- `reduce()` without initial value — empty array throws TypeError; always provide initial value
- `map/filter/reduce` all iterate the full array — for very large datasets, consider generator-based pipeline
- `WeakMap` keys cannot be primitives — only objects; using a string key throws TypeError

## PTA / SA Relevance

**Code review flags:**
- `array.sort()` without comparator on numeric data — silent sort order bug
- `reduce()` without initial value on potentially empty arrays — crashes in production
- Using Object as cache/lookup when Map would be more appropriate (especially when keys aren't always strings)
- Modifying arrays in-place inside map/filter callbacks — pure functions only inside array methods

**LWC patterns:**
- Wire handler destructuring: `wiredRecord({ data, error })` — this is the standard pattern; understand that it uses object destructuring on the wire result object
- Transforming wire data for display: `get recordOptions() { return this.records?.data?.map(...) ?? []; }`
- Deduplication before passing to combobox: `[...new Set(values)]`

**Customer advisory:** When customers ask about handling large data in LWC, the answer is pagination + server-side filtering. Never pull 10K records into the browser. When reviewing code that does `Array.from({ length: 10000 })`, that's a problem.

## Key Facts to Memorize
- `map/filter` return NEW arrays; `sort/splice/reverse` mutate IN-PLACE
- `sort()` default is string (lexicographic) — provide `(a, b) => a - b` for numbers
- `find` returns the element; `findIndex` returns the index; both return `undefined`/`-1` if not found
- `reduce(fn, initialValue)` — always provide initial value
- Map: any key type, insertion-ordered, `.size`; Object: string/symbol keys, prototype baggage
- Set: unique values, iterable, `new Set(array)` deduplicates
- WeakMap/WeakSet: object keys only, not iterable, garbage-collectable keys

## Exam Traps
- `[3,1,10].sort()` → `[1, 10, 3]` (string sort) not `[1, 3, 10]`
- `reduce` on empty array without initial value → TypeError
- `sort` is in-place — the original array is changed
- `map` returns a NEW array — the original is unchanged
- `find` returns the VALUE; `findIndex` returns the INDEX
- `Object.keys()` vs `for...in`: `.keys()` = own enumerable only; `for...in` = own + inherited enumerable

## Practice Questions
**Q:** What does this print?
```javascript
const result = [3, 1, 2, 10, 20].sort();
console.log(result);
```
**A:** `[1, 10, 2, 20, 3]`. Default sort converts to strings: "1" < "10" < "2" < "20" < "3" lexicographically.

**Q:** Transform this array to extract only active contacts, sorted by name:
```javascript
const contacts = [
    { name: 'Carol', active: true },
    { name: 'Alice', active: true },
    { name: 'Bob', active: false }
];
```
**A:** `contacts.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name))`

**Q:** What is the difference between Map and a plain object for a key-value store?
**A:** Map accepts any type as key (including objects), preserves insertion order, has `.size`, has no prototype-inherited keys, and performs better for frequent additions/deletions. Plain objects only support string/symbol keys and inherit properties from `Object.prototype` (which can cause `'constructor'`, `'toString'` key collisions).
