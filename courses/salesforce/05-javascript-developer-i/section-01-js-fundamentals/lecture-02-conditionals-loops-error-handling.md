# Lecture 02: Conditionals, Loops & Error Handling

## Learning Objectives
- Write conditional logic using `if/else` chains and `switch` statements, and explain JavaScript's `switch` fall-through behavior
- Use all five loop types (`for`, `for...of`, `for...in`, `while`, `do...while`) and choose the right one for each scenario
- Control loop execution with `break`, `continue`, and labeled statements
- Handle errors with `try/catch/finally`, distinguish the built-in Error types, and implement re-throw patterns

## Slides

### Slide 1: if / else — Conditional Branching in JavaScript
**Visual:** A flowchart showing a diamond decision node branching into three paths: `if`, `else if`, and `else`, with a note callout comparing JavaScript's truthy/falsy evaluation to Apex's strict Boolean requirement. Color-coded: JavaScript path in blue (truthy accepted), Apex path in orange (explicit Boolean required).
**Content:**
- Standard `if/else` syntax works the same as most C-family languages
- JavaScript evaluates the condition for **truthiness** — no strict Boolean required
- Falsy values that evaluate to false in an `if`: `false`, `0`, `""`, `null`, `undefined`, `NaN`, `0n`
- Everything else is truthy — including empty arrays `[]` and empty objects `{}`
```javascript
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'F';
}
```
- Ternary: `const label = isActive ? 'Active' : 'Inactive';`
- In LWC templates, conditional rendering uses `if:true={condition}` or `lwc:if={condition}` directives — these call your getter which runs this JavaScript logic
**Speaker Notes:** The biggest difference between JavaScript conditionals and Apex conditionals is truthiness. In Apex, the condition must be a literal Boolean. In JavaScript, any expression is evaluated for its truthiness. This is why `if (myArray.length)` works — zero is falsy, any positive number is truthy. Know the falsy list cold for the exam: `false`, `0`, `""`, `null`, `undefined`, `NaN`, and `0n` (BigInt zero). Empty arrays and empty objects are truthy, which surprises many developers. `if ([])` enters the true branch.

### Slide 2: switch Statement — Fall-Through Behavior
**Visual:** Two code panels. Left panel: a switch with NO break statements — arrows show execution "falling through" from one case to the next. Right panel: the same switch WITH break statements — execution stops at each break. A red warning badge on the left panel: "Intentional or bug? Always comment fall-through."
**Content:**
- `switch` compares using **strict equality** (`===`) — no type coercion
- **Fall-through:** if no `break` (or `return`), execution continues into the next `case`
```javascript
switch (status) {
    case 'new':
    case 'pending':          // intentional fall-through: both go here
        handlePending();
        break;
    case 'active':
        handleActive();
        break;
    default:
        handleUnknown();
}
```
- `break` exits the switch; `return` inside a function also exits
- Always include `break` (or document the intentional fall-through with a comment)
- `default` can appear anywhere, but convention is at the end
- Contrast: **Apex switch uses `when` with NO fall-through** — a common PDI-to-JSI confusion point
**Speaker Notes:** Fall-through is JavaScript's switch behaving like C's switch — it is the historical behavior. In practice, intentional fall-through (multiple cases sharing one handler) is legitimate and common. Unintentional fall-through is a bug. The exam will show you a switch block without break statements and ask for the output — trace carefully. The key difference from Apex: Apex switch never falls through; JavaScript switch always does unless you break. This trips up developers who move between the two languages.

### Slide 3: for, for...of, and for...in Loops
**Visual:**
```
  ┌─────────────────────────────────────────────────────────────┐
  │ Loop Type    │ Iterates Over      │ Best For                │
  ├─────────────────────────────────────────────────────────────┤
  │ for(;;)      │ counter / index    │ need index; fine control│
  │ for...of     │ VALUES of iterable │ arrays, strings, Map,   │
  │              │                    │ Set, NodeList           │
  │ for...in     │ KEYS of object     │ plain object keys only  │
  │              │                    │ ⚠ AVOID on arrays       │
  │ while        │ condition-based    │ unknown iteration count │
  │ do...while   │ condition-based    │ body runs at least once │
  └─────────────────────────────────────────────────────────────┘

  for...of vs for...in key distinction:
  const arr = ['a','b','c'];
  for (const v of arr)  → 'a', 'b', 'c'   (values)
  for (const k in arr)  → '0', '1', '2'   (string keys!)
```
**Content:**
- **Traditional `for`:** Best when you need the index; most control
```javascript
for (let i = 0; i < arr.length; i++) { /* use i */ }
```
- **`for...of`:** Iterates **values** of any iterable (array, string, Map, Set, NodeList)
```javascript
for (const account of accounts) {
    console.log(account.Name);
}
```
- **`for...in`:** Iterates **enumerable property keys** (string keys) of an object
```javascript
const obj = { a: 1, b: 2 };
for (const key in obj) {
    console.log(key, obj[key]);  // 'a' 1, 'b' 2
}
```
- **Critical warning:** Do NOT use `for...in` on arrays — it iterates indices as strings and also picks up inherited properties; use `for...of` or `forEach` instead
- In LWC wire data (arrays of records): always `for...of` or array methods
**Speaker Notes:** The `for...in` vs `for...of` distinction is one of the most commonly tested topics on the JSI exam. `for...in` was designed for plain objects — iterating their enumerable keys. `for...of` was introduced in ES6 for iterables — it works on anything that implements the iterable protocol: arrays, strings, Map, Set, and generator outputs. The dangerous trap is using `for...in` on an array: it works, but the "indices" are strings (`"0"`, `"1"`, not `0`, `1`), and if anything has been added to `Array.prototype`, those keys show up too. Always use `for...of` for arrays.

### Slide 4: while, do...while, break, and continue
**Visual:** Two loop flow diagrams (while checks condition before body; do-while executes body first then checks). Below, two loop diagrams showing `break` exiting the loop and `continue` jumping to the next iteration. A "Labeled statement" example shows breaking out of an outer loop with a label.
**Content:**
- **`while`:** Condition checked first; body may never execute
```javascript
while (queue.length > 0) {
    process(queue.shift());
}
```
- **`do...while`:** Body executes at least once
```javascript
do {
    userInput = prompt('Enter a number:');
} while (isNaN(userInput));
```
- **`break`:** Exits the **innermost** loop (or switch) immediately
- **`continue`:** Skips remaining body; jumps to next iteration (or condition check)
- **Labeled statements:** Break/continue to an outer loop by name
```javascript
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) break outer;  // exits outer loop
    }
}
```
- Labels are rare in production code but appear on JSI exam "what is the output" questions
**Speaker Notes:** The labeled break is rarely seen in production JavaScript — most developers find it confusing and refactor to a function with a return instead. But it absolutely shows up on the JSI exam. Know that a label is just an identifier followed by a colon, placed before the loop statement. `break labelName` exits the labeled loop entirely. `continue labelName` skips to the next iteration of the labeled loop. Without a label, break and continue only affect the innermost loop, just like in Apex.

### Slide 5: try / catch / finally — Basic Structure
**Visual:** A flowchart of try/catch/finally execution: normal path flows through `try` then `finally`. Error path shows execution jumping from the throw point to `catch`, then continuing to `finally`. An annotation reads: "`finally` always runs — even if `catch` re-throws."
**Content:**
- `try` block contains code that might throw
- `catch (err)` receives the thrown value — can be any value, but is usually an Error object
- `finally` block always executes — whether the try succeeded, threw, or the catch re-threw
```javascript
function fetchData(url) {
    try {
        const response = getData(url);
        return response;
    } catch (err) {
        console.error('Fetch failed:', err.message);
        return null;
    } finally {
        console.log('Cleanup done');  // always runs
    }
}
```
- `err.message` — human-readable description
- `err.name` — type of error: `"TypeError"`, `"RangeError"`, etc.
- `err.stack` — full stack trace string
- `try/catch` is mandatory in LWC `@wire`-adjacent imperative Apex calls:
  `const result = await getAccount({ accountId: this.recordId });`
**Speaker Notes:** The `finally` block is the most important part of try/catch for the exam. It always runs — it is the cleanup guarantee. Even if the catch block throws a new error, even if the try block has a return statement, finally still executes. This makes finally the right place for cleanup: closing connections, clearing loading spinners, resetting state. In LWC, you will often see a loading property toggled in finally so that the UI spinner stops regardless of whether the Apex call succeeded or failed.

### Slide 6: Built-in Error Types and the Error Hierarchy
**Visual:** A class hierarchy diagram rooted at `Error` with five child nodes: `TypeError`, `RangeError`, `ReferenceError`, `SyntaxError`, `URIError`. Each node has a one-line description and a code example that triggers it.
**Content:**
- All Error types inherit from `Error` and have `.name`, `.message`, `.stack`
- **TypeError** — operation on wrong type: calling a non-function, accessing property of null/undefined
```javascript
null.toString();  // TypeError: Cannot read properties of null
```
- **RangeError** — value outside allowed range
```javascript
new Array(-1);  // RangeError: Invalid array length
```
- **ReferenceError** — accessing an undeclared variable (or TDZ violation)
```javascript
console.log(notDeclared);  // ReferenceError: notDeclared is not defined
```
- **SyntaxError** — invalid JavaScript syntax; caught at parse time, not runtime
- **URIError** — malformed URI in `decodeURI()` or `encodeURI()`
- Create custom errors: `throw new Error('message')` or subclass Error
**Speaker Notes:** The JSI exam will give you a code snippet and ask which error type is thrown. The trick is knowing the distinction: TypeError is about type (null access, non-function call), ReferenceError is about scope (variable doesn't exist), and RangeError is about value bounds. SyntaxError is special — it is caught at parse time, before any code runs, so a try/catch cannot catch a SyntaxError in the same script. It can, however, catch a SyntaxError from dynamically evaluated code like `eval('invalid {')`. For the LWC exam context, TypeError from null access is by far the most common real-world error.

### Slide 7: throw, Re-throwing, and Error Patterns
**Visual:** Three code panels showing the three main error handling patterns: (1) catch-and-handle (log and continue), (2) catch-and-re-throw (add context, then throw), (3) catch-and-transform (convert to a domain error). Arrows show the propagation path for each pattern.
**Content:**
- `throw` can throw any value, but best practice is always an Error object
```javascript
throw new Error('Record ID is required');
throw new TypeError('Expected a string, got ' + typeof value);
```
- **Re-throw pattern** — catch, add context, re-throw for the caller to handle:
```javascript
async function loadRecord(id) {
    try {
        return await getRecord({ recordId: id });
    } catch (err) {
        console.error('loadRecord failed for id:', id);
        throw err;  // re-throw so the caller knows it failed
    }
}
```
- **Catch-specific types:** Check `err.name` or use `instanceof`:
```javascript
catch (err) {
    if (err instanceof TypeError) { /* handle type error */ }
    else throw err;  // re-throw unexpected errors
}
```
- In LWC: always handle `error` property from wire adapters; always try/catch imperative Apex calls
**Speaker Notes:** Re-throwing is a critical pattern that separates competent error handling from the anti-pattern of swallowing errors. The common mistake is catching every error, logging it, and returning null — so the caller has no way to know whether the operation succeeded or failed. The re-throw pattern catches the error to add context (like logging the record ID), but then re-throws so the failure propagates to whoever can meaningfully handle it. In LWC, this often means showing a user-friendly error message in the component's error display area. The exam tests whether you understand that `throw err` inside a catch block re-throws the original error.

### Slide 8: Error Handling in LWC — Practical Patterns
**Visual:** An LWC component class with a handleSave method making an imperative Apex call, wrapped in try/catch/finally. Annotations point to: the async/await syntax (covered in Section 4), the catch block setting `this.error`, the finally block clearing `this.isLoading`, and the template binding showing an error message display.
**Content:**
```javascript
export default class ContactEditor extends LightningElement {
    isLoading = false;
    error = null;

    async handleSave() {
        this.isLoading = true;
        this.error = null;
        try {
            await saveContact({ contactData: this.contactData });
            this.dispatchEvent(new CustomEvent('save'));
        } catch (err) {
            this.error = err.body?.message ?? err.message ?? 'Unknown error';
        } finally {
            this.isLoading = false;  // always clears the spinner
        }
    }
}
```
- `err.body.message` — Apex exceptions wrapped by LWC framework have a `.body` property
- `err.message` — plain JavaScript errors
- `?? 'Unknown error'` — nullish coalescing fallback from Lecture 1
- `finally` guarantees the spinner clears even if an unexpected error occurs in `catch`
**Speaker Notes:** This is the canonical LWC error handling pattern every Salesforce developer should know. When an Apex method throws a handled or unhandled exception, the LWC framework wraps it in an object with a `body` property. For `AuraHandledException` thrown from Apex, the message lives in `err.body.message`. For network errors or JavaScript errors, the message is in `err.message` directly. The `?.` and `??` chain handles both cases safely. The `finally` block is non-negotiable — if you omit it, an error in the catch block itself (such as another network failure when logging) will leave `isLoading` as `true` and the spinner will spin forever.

## Recording Script
Welcome to Lecture 2. Today we cover conditionals, loops, and error handling — the control structures that give your JavaScript programs their logic and resilience. If Lecture 1 was vocabulary, this lecture is grammar.

Let's start with conditionals. `if/else` in JavaScript is familiar — but remember that JavaScript evaluates conditions for truthiness, not strict Boolean. The falsy list is your exam friend: `false`, `0`, empty string `""`, `null`, `undefined`, `NaN`, and `0n`. Everything else is truthy — including empty arrays and empty objects. `if ([])` evaluates to true. That surprises people.

The switch statement: JavaScript's switch falls through between cases unless you break. That is the critical difference from Apex's `when` clauses. Fall-through is sometimes intentional — you group multiple case values to share one handler by stacking them without a break. But unintentional fall-through is a bug. The exam will show you switch blocks and ask for the output — trace each case and watch for missing break statements. Also note that switch uses strict equality for comparison, so type matters.

For loops: you have five options. Traditional `for` when you need the index. `for...of` for iterating values of any iterable — arrays, strings, Maps, Sets. `for...in` for enumerating the keys of a plain object. `while` when iteration count is unknown. `do...while` when you need at least one execution. The biggest trap: `for...in` on an array. Do not do it — use `for...of` instead. `for...in` iterates string keys and picks up inherited properties from the prototype chain.

`break` and `continue` work as expected inside any loop, but remember they only affect the innermost loop. Labeled statements let you break or continue an outer loop by name — rare in production but it shows up on the exam.

Now error handling, and this section matters deeply for LWC development. The `try/catch/finally` structure: the try block is where risky code lives. If anything throws, execution jumps immediately to the catch block. The `finally` block always runs — always — even if you have a return inside try, even if catch re-throws. This is your cleanup guarantee: clear spinners, close connections, reset state.

Know the built-in Error types. TypeError happens when you operate on the wrong type — most commonly, accessing a property of null or undefined. ReferenceError happens when you use a variable that does not exist. RangeError happens when a value is out of allowed range. SyntaxError is caught at parse time, before execution.

The re-throw pattern is important: catch an error to add context, then re-throw it. Do not silently swallow errors. In LWC, the standard pattern is: try the Apex call, catch to set an error property for display, finally to clear the loading spinner. Know the `err.body.message` vs `err.message` distinction for Apex versus JavaScript errors.

## Exam Tips
- JavaScript switch **falls through** by default — `break` is required to stop execution after each case. Apex's `when` clauses do NOT fall through. This distinction is commonly tested.
- `for...in` iterates **enumerable keys** (strings) — never use it on arrays. `for...of` iterates **values** of any iterable. Know which to use for objects vs arrays.
- `finally` runs **regardless of outcome** — even if try has a `return` statement, even if catch re-throws. It is the cleanup guarantee.
- Empty array `[]` and empty object `{}` are **truthy** in JavaScript — `if ([])` takes the true branch.
- Labeled `break outerLoop` exits the labeled loop entirely; labeled `continue outerLoop` skips to the next iteration of the labeled loop.
- TypeError is thrown when accessing a property of `null` or `undefined` — the most common runtime error in LWC. Optional chaining `?.` prevents most of these.

## Lecture Summary
JavaScript conditionals support truthy/falsy evaluation (unlike Apex's strict Boolean requirement), and the `switch` statement falls through between cases unless broken — a key contrast with Apex's fall-through-free `when` clauses. The five loop types serve distinct purposes: `for` (indexed), `for...of` (iterable values), `for...in` (object keys — avoid on arrays), `while` (unknown iterations), and `do...while` (minimum one execution). Error handling uses `try/catch/finally`, where `finally` is the unconditional cleanup guarantee. The built-in Error hierarchy (TypeError, RangeError, ReferenceError, SyntaxError) maps to distinct failure scenarios, and the re-throw pattern — catching to add context then re-throwing — is the correct approach for errors that cannot be fully handled at the catch site. In LWC, imperative Apex calls always warrant try/catch/finally with `err.body?.message` as the error extraction path.

## Mini Quiz

**Q1:** What is the output of the following code?
```javascript
let result = '';
switch (2) {
    case 1:
        result += 'one';
    case 2:
        result += 'two';
    case 3:
        result += 'three';
        break;
    case 4:
        result += 'four';
}
console.log(result);
```
A) `"two"`
B) `"twothree"`
C) `"onetwothree"`
D) `"twothreefour"`
**Answer:** B — Execution matches `case 2` and appends `'two'`. Because there is no `break` after case 2, execution falls through to case 3 and appends `'three'`. The `break` in case 3 exits the switch before case 4. Result is `"twothree"`.

**Q2:** A developer needs to iterate over a plain object and log each key-value pair, and also separately iterate over an array of records. Which loop types are correct for each task?
A) `for...in` for the object; `for...in` for the array
B) `for...of` for the object; `for...of` for the array
C) `for...in` for the object; `for...of` for the array
D) `for...of` for the object; `for...in` for the array
**Answer:** C — `for...in` iterates enumerable property keys of an object (correct for plain objects). `for...of` iterates values of an iterable (correct for arrays, and safe because it does not pick up prototype properties). Using `for...in` on an array is dangerous because it iterates string keys and inherits any properties added to `Array.prototype`.

**Q3:** A developer writes the following LWC method and notices that the loading spinner sometimes gets stuck even when an error occurs. What is the fix?
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
A) Move `this.isLoading = false` inside the `try` block only
B) Add a `finally` block containing `this.isLoading = false` and remove it from try and catch
C) Set `this.isLoading = false` at the start of the method
D) Wrap the entire method in a second try/catch
**Answer:** B — If the `catch` block itself throws (for example, if `err.body` access fails), neither cleanup line runs and `isLoading` stays `true`. The `finally` block always runs regardless of what happens in `try` or `catch`, making it the correct location for cleanup code. Moving `isLoading = false` into `finally` and removing it from both `try` and `catch` guarantees the spinner always stops.
