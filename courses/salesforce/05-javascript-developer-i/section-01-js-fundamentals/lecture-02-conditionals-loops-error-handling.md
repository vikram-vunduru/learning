# Conditionals, Loops & Error Handling

## Exam Domain
Conditionals, Loops & Error Handling — ~8% of exam weight

## Core Concepts

### if/else — Truthy/Falsy Evaluation
JavaScript evaluates conditions for *truthiness*, not strict Boolean.

**Falsy values (memorize this list):** `false`, `0`, `""`, `null`, `undefined`, `NaN`, `0n`
**Truthy traps:** `[]`, `{}`, `"false"`, `"0"`, any non-zero number, any non-empty string

```javascript
if ([])  // true — empty array is truthy!
if ({})  // true — empty object is truthy!
if ("")  // false
if ("0") // true
```

### switch — Fall-Through Behavior
JavaScript switch **falls through** by default. Apex `when` does NOT. This is a top exam trap.

```javascript
switch (status) {
    case 'new':
    case 'pending':          // intentional fall-through — both cases run handlePending
        handlePending();
        break;               // ← break REQUIRED to stop here
    case 'active':
        handleActive();
        break;
    default:
        handleUnknown();
}
```
- Uses **strict equality** (`===`) for comparison — type matters
- Without `break`, execution falls into the next case regardless of the case value
- `default` can appear anywhere but convention puts it at the end

### Loop Types — When to Use Each
```
┌────────────────┬─────────────────────┬──────────────────────────────┐
│ Loop           │ Iterates            │ Use When                     │
├────────────────┼─────────────────────┼──────────────────────────────┤
│ for(;;)        │ counter / index     │ need index, fine control     │
│ for...of       │ VALUES of iterable  │ arrays, strings, Map, Set    │
│ for...in       │ KEYS of object      │ plain object keys only       │
│                │                     │ ⚠ NEVER use on arrays        │
│ while          │ condition-based     │ unknown iteration count      │
│ do...while     │ condition-based     │ body must run at least once  │
└────────────────┴─────────────────────┴──────────────────────────────┘
```

**for...of vs for...in (most common exam question):**
```javascript
const arr = ['a', 'b', 'c'];
for (const v of arr)  → 'a', 'b', 'c'   // values ✓ use this for arrays
for (const k in arr)  → '0', '1', '2'   // string keys ← WRONG for arrays
```

**Labeled break — rare in production, appears on exam:**
```javascript
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) break outer;  // exits the outer loop entirely
    }
}
```

### try / catch / finally
```
try block executes
    ├── no error → finally runs → continue
    └── error thrown → catch runs → finally runs → continue
                           └── catch re-throws → finally still runs → propagates up
```

`finally` always runs. Even if try has a `return`. Even if catch re-throws. This is the cleanup guarantee.

```javascript
async handleSave() {
    this.isLoading = true;
    this.error = null;
    try {
        await saveContact({ contactData: this.contactData });
        this.dispatchEvent(new CustomEvent('save'));
    } catch (err) {
        this.error = err.body?.message ?? err.message ?? 'Unknown error';
    } finally {
        this.isLoading = false;  // guaranteed — spinner ALWAYS stops
    }
}
```

**LWC error shape:** Apex exceptions have `err.body.message`. Pure JS errors have `err.message` directly. Use `err.body?.message ?? err.message` to handle both.

### Built-in Error Types
| Type | Triggered by | Example |
|------|-------------|---------|
| `TypeError` | Wrong type operation | `null.toString()` — most common in LWC |
| `ReferenceError` | Undeclared variable / TDZ | `console.log(notDeclared)` |
| `RangeError` | Out of bounds | `new Array(-1)` |
| `SyntaxError` | Invalid JS — **parse time** | Caught before runtime |

**Re-throw pattern — catch to add context, then re-throw:**
```javascript
async function loadRecord(id) {
    try {
        return await getRecord({ recordId: id });
    } catch (err) {
        console.error('loadRecord failed for id:', id);
        throw err;  // propagate — don't silently swallow
    }
}
```

## Architecture / How It Works

### Error Propagation in LWC Async
```
User clicks Save
        │
  handleSave() [async]
        │
   await saveRecord()
        │
   ┌────┴─────┐
   │ SUCCESS  │ FAILURE (Apex throws AuraHandledException)
   │          │
   │          └── err.body.message = "Record validation failed"
   │          └── catch block sets this.error
   │
   └── dispatchEvent('save')
        │
   finally ← runs regardless
   └── this.isLoading = false
```

**Limitations:**
- `finally` with a `return` statement overrides the try's return — avoid returning from finally
- Async functions: `try/catch` only catches errors from `await`ed Promises; unhandled promise rejections in non-await paths are missed
- `SyntaxError` cannot be caught at runtime — it's a parse-time failure (unless inside `eval()`)
- `for...in` on arrays picks up prototype properties — never use it on arrays

## PTA / SA Relevance

**In code reviews, flag:**
- Missing `finally` block when `isLoading` is set in `try` — spinner will stick on error
- Swallowing errors with empty `catch (err) {}` — makes debugging impossible in production
- Using `err.message` only on LWC error handlers — misses the Apex error shape (`err.body.message`)
- `for...in` on arrays — indicates unfamiliarity with modern JS

**Architecture reviews:**
- `Promise.all` without `allSettled` in batch operations — one failure kills all results. For bulk Apex calls (e.g., updating 50 records), `allSettled` is almost always the right choice.
- Missing global error handling at the app level — LWC's `errorCallback` lifecycle hook for graceful degradation in child components.

**Customer advisory:** When customers report "the spinner spins forever when there's an error," the fix is always `finally`. When customers report silent data loss, the fix is always re-throw over swallow.

## Key Facts to Memorize
- JavaScript `switch` falls through; Apex `when` does NOT — exam distinguishes these
- `finally` runs regardless of try/catch outcome — even after a `return` in try
- Empty array `[]` and empty object `{}` are **truthy** in JavaScript
- `for...of` iterates VALUES of iterables; `for...in` iterates KEYS of objects
- `TypeError` = wrong type (null access); `ReferenceError` = undeclared variable; `RangeError` = out of range
- `err.body?.message ?? err.message` handles both Apex and JS error shapes in LWC

## Exam Traps
- switch fall-through: `case 2:` with no `break` continues into `case 3:` — trace carefully on exam code
- `for...in` on arrays gives string indices (`"0"`, `"1"`) not numbers, and includes prototype properties
- `finally` runs even when `catch` re-throws — it is unconditional
- Empty array `if ([])` → true branch (truthy), but `[] == false` → true (loose equality coercion)
- Labeled `break outerLoop` exits the named loop; `continue outerLoop` skips to the next iteration of the named loop

## Practice Questions
**Q:** What is the output?
```javascript
let result = '';
switch (2) {
    case 1: result += 'one';
    case 2: result += 'two';
    case 3: result += 'three'; break;
    case 4: result += 'four';
}
console.log(result);
```
**A:** `"twothree"`. Matches case 2, falls through to case 3 (no break after 'two'), hits break after 'three'. case 4 is not reached.

**Q:** For iterating object keys and array values respectively, which loops are correct?
**A:** `for...in` for object keys; `for...of` for array values. Using `for...in` on arrays gives string keys and includes inherited properties.

**Q:** A developer's LWC spinner gets stuck when an error occurs in the catch block itself. Fix it.
```javascript
async handleSave() {
    this.isLoading = true;
    try {
        await saveRecord({ data: this.formData });
        this.isLoading = false;
    } catch (err) {
        this.error = err.body?.message ?? err.message;
        this.isLoading = false;
    }
}
```
**A:** Move `this.isLoading = false` into a `finally` block and remove it from both try and catch. If the catch block itself throws, neither cleanup line runs without `finally`.
