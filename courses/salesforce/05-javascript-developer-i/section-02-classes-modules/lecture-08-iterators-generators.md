# Iterators & Generators

## Exam Domain
Objects, Arrays & Iterators — ~25% of exam weight

## Core Concepts

### The Iterator Protocol
An iterator is any object with a `next()` method that returns `{ value, done }`.
```javascript
// Manual iterator
function makeRangeIterator(start, end) {
    let current = start;
    return {
        next() {
            if (current <= end) {
                return { value: current++, done: false };
            }
            return { value: undefined, done: true };
        }
    };
}

const iter = makeRangeIterator(1, 3);
iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }
```

### The Iterable Protocol
An iterable object has a `[Symbol.iterator]()` method that returns an iterator. This is what `for...of` uses.
```javascript
const range = {
    from: 1, to: 3,
    [Symbol.iterator]() {           // ← required for for...of
        let current = this.from;
        const end = this.to;
        return {
            next() {
                return current <= end
                    ? { value: current++, done: false }
                    : { value: undefined, done: true };
            }
        };
    }
};

for (const n of range) {
    console.log(n); // 1, 2, 3
}
[...range]; // [1, 2, 3]  — spread works on iterables too
```

**Built-in iterables:** Arrays, Strings, Map, Set, NodeList, arguments

### Generators — `function*` and `yield`
Generators return an iterator automatically. `yield` pauses execution and resumes on next `.next()`.

```javascript
function* count(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;         // pauses here, returns { value: i, done: false }
    }
    // implicit: return undefined (done: true)
}

const gen = count(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

for (const n of count(1, 3)) console.log(n); // 1, 2, 3
[...count(1, 3)]; // [1, 2, 3]
```

**Infinite generator — lazy evaluation:**
```javascript
function* naturals() {
    let n = 1;
    while (true) {
        yield n++;     // safe — only evaluates on demand
    }
}

const gen = naturals();
gen.next().value; // 1
gen.next().value; // 2
// Never exhausts memory — values computed lazily
```

### yield* — Delegating to Another Generator
```javascript
function* letters() { yield 'a'; yield 'b'; }
function* digits() { yield 1; yield 2; }

function* combined() {
    yield* letters();  // delegates to letters generator
    yield* digits();   // delegates to digits generator
    yield 'end';
}

[...combined()]; // ['a', 'b', 1, 2, 'end']
```

### Passing Values INTO a Generator
```javascript
function* calculator() {
    const x = yield 'Enter x:';    // yields prompt, receives input
    const y = yield 'Enter y:';
    return x + y;
}

const calc = calculator();
calc.next();          // { value: 'Enter x:', done: false }
calc.next(10);        // { value: 'Enter y:', done: false }  ← passes 10 as x
calc.next(20);        // { value: 30, done: true }          ← passes 20 as y, returns sum
```

## Architecture / How It Works

### Generator Execution Model
```
function* gen() {
  yield 1;    ← checkpoint A
  yield 2;    ← checkpoint B
  return 3;   ← done
}

.next()  → runs to checkpoint A, pauses → returns { value: 1, done: false }
.next()  → resumes at A, runs to checkpoint B → returns { value: 2, done: false }
.next()  → resumes at B, runs to return → returns { value: 3, done: true }
.next()  → already done → returns { value: undefined, done: true }
```

### Practical LWC Use — Lazy Data Processing
```javascript
// Process large record arrays lazily (avoid building huge intermediate arrays)
function* filterAndTransform(records) {
    for (const record of records) {
        if (record.IsActive) {
            yield { id: record.Id, name: record.Name };
        }
    }
}

// Only processes records as consumed
for (const contact of filterAndTransform(this.contacts)) {
    this.displayList.push(contact);
    if (this.displayList.length >= 50) break;  // stop early safely
}
```

**Limitations:**
- Generators are stateful — they cannot be reused (restarted) after exhaustion; must create a new instance
- Generator functions are NOT async by default — use `async function*` for async generators
- Passing a value to the first `.next()` is ignored — the first call runs code until the first `yield`
- `for...of` and spread `[...gen]` only forward-iterate — no random access, no length property
- Memory: generators themselves are lightweight; consuming large generators into arrays negates the benefit

## PTA / SA Relevance

**Code review flags:**
- Building intermediate arrays for every transformation step on large datasets — a generator pipeline avoids intermediate memory
- Using generators in LWC for async state machines (advanced but valid pattern)
- Confusion between generator function and generator object — `gen()` returns the iterator, `gen` is the function

**Architecture guidance:**
- For processing large Salesforce data exports or ETL-like operations in Node.js scripts, generators provide lazy evaluation that avoids loading 100K records into memory at once
- In LWC, iterators/generators are less common in component code but appear in utility data processing modules used by LWC

**Customer advisory:** Generators are a niche feature for most Salesforce developers. Their primary exam value is understanding the `{ value, done }` protocol and `Symbol.iterator`. In practice, they appear in data pipeline scripts and custom data adapters.

## Key Facts to Memorize
- Iterator protocol: object with `.next()` returning `{ value, done }`
- Iterable protocol: object with `[Symbol.iterator]()` returning an iterator
- `for...of` requires an iterable (checks for `[Symbol.iterator]`)
- Generator function: `function*` with `yield`; returns an iterator automatically
- `yield` pauses execution; `.next()` resumes
- `yield*` delegates to another iterable/generator
- Generators are lazy — values computed only when requested
- Built-in iterables: Array, String, Map, Set, NodeList, arguments, generators

## Exam Traps
- Regular objects `{}` are NOT iterable — `for...of { a: 1 }` throws TypeError
- `for...in` works on objects (keys); `for...of` requires Symbol.iterator
- Generator is not re-runnable — calling `.next()` after done always returns `{ value: undefined, done: true }`
- Value passed to first `.next(value)` call is discarded — first yield runs immediately
- `yield` without `*` yields a single value; `yield*` iterates another iterable

## Practice Questions
**Q:** What is the output?
```javascript
function* gen() {
    yield 1;
    yield 2;
    return 3;
}
const g = gen();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
```
**A:**
```
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: true }
{ value: undefined, done: true }
```
Note: `for...of` and spread STOP at done:true and do NOT include the `return` value.

**Q:** Why is `for...of` suitable for arrays but not plain objects?
**A:** Arrays implement `[Symbol.iterator]()` (they are iterables). Plain objects `{}` do not have `Symbol.iterator` by default. Using `for...of` on a plain object throws `TypeError: obj is not iterable`. Use `Object.keys()`, `Object.values()`, or `Object.entries()` with `for...of` to iterate object data.

**Q:** What is lazy evaluation in generators and why does it matter?
**A:** Lazy evaluation means values are computed only when requested (on each `.next()` call), not all at once upfront. An infinite generator `function* naturals()` is safe because it never pre-computes all values. This matters for large datasets — you can process millions of records one at a time without loading them all into memory.
