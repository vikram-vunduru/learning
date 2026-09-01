# Lecture 14: Testing JavaScript

## Learning Objectives
- Articulate why automated testing prevents regressions and serves as living documentation
- Distinguish between unit, integration, and end-to-end tests and know when to use each
- Write Jest tests using `describe()`, `it()`/`test()`, and `expect()` with matchers including `toBe`, `toEqual`, `toContain`, `toThrow`, and `toBeCalledWith`
- Use `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` lifecycle hooks appropriately
- Create mocks with `jest.fn()`, `jest.mock()`, `mockReturnValue`, and `mockResolvedValue`
- Interpret code coverage reports across statements, branches, functions, and lines
- Apply the TDD red-green-refactor cycle to write test-driven code

## Slides

### Slide 1: Why Testing?
**Visual:** Two paths diverge: "Path A — No Tests" shows a developer confidently making a change, then a cascade of bug icons breaking features silently. "Path B — With Tests" shows the same change triggering a red test immediately, catching the regression. Below: a Jest test file displayed as "specification / documentation."
**Content:**
- **Regression prevention:** Tests catch when a new change breaks existing behavior automatically
- **Documentation:** A well-written test suite describes exactly what the code is supposed to do
- **Confidence:** Developers can refactor or add features without fear of silent breakage
- **Design pressure:** Writing tests forces smaller, more composable functions (testability = good design)
- Real cost of bugs by phase:
  - Bug found during development: 1x cost
  - Bug found during QA: 10x cost
  - Bug found in production: 100x cost
- Types of testing tools: **unit test frameworks** (Jest, Mocha, Jasmine), **assertion libraries** (Chai), **E2E** (Playwright, Cypress)
- Jest is the dominant JavaScript testing framework — used by Facebook/Meta for React
**Speaker Notes:** Teams that skip testing often rationalize it as "moving faster." The data consistently shows the opposite — untested codebases accumulate technical debt so fast that velocity collapses within months. The documentation angle is underappreciated: a test that says `it('should return null when user is not found')` is unambiguous specification. Comments lie; passing tests don't.

### Slide 2: The Testing Pyramid
**Visual:** Triangle/pyramid diagram with three layers. Bottom (wide, most tests): Unit Tests — fast, isolated, cheap. Middle: Integration Tests — test multiple units together, moderate cost. Top (narrow, fewest): End-to-End Tests — simulate real user flow, slow, expensive. Arrows on the side show "faster ↑ slower" and "cheaper ↑ more expensive." Percentages: 70% unit, 20% integration, 10% E2E.
**Content:**
- **Unit tests:** Test a single function or class in isolation; all dependencies mocked
  - Fast (milliseconds), deterministic, easy to write
  - Example: test that `calculateTax(100, 0.08)` returns `108`
- **Integration tests:** Test how multiple units work together
  - May involve real databases, file system, or network (or test doubles for them)
  - Example: test that `createUser` saves to the database and returns the created record
- **End-to-end (E2E) tests:** Simulate a real user interacting with the full application
  - Slow, flaky, expensive to maintain — reserve for critical user journeys
  - Example: test that a user can log in, add a product to cart, and check out
- **Test pyramid rule:** Have many unit tests, fewer integration tests, minimal E2E tests
- Inverting the pyramid (too many E2E tests) = slow CI, flaky test suite, high maintenance cost
**Speaker Notes:** The pyramid is a heuristic, not a law. Some teams run mostly integration tests because their "units" are so small they provide little value in isolation. The key principle is that tests should run fast enough to give developers immediate feedback. If your entire test suite takes 30 minutes, developers stop running it locally and only find out on CI — which defeats the purpose.

### Slide 3: Jest Basics — describe, it/test, expect
**Visual:** Annotated Jest test file showing: `describe` block wrapping multiple `it` blocks, `expect(value).matcher()` syntax highlighted. Test results output shown on the right: green checkmarks for passing tests, red X for failing.
**Content:**
- Install Jest: `npm install --save-dev jest`; add `"test": "jest"` to scripts
- **describe()** — groups related tests; creates a named test suite (nestable)
- **it()** / **test()** — defines a single test case (they are identical)
- **expect()** — wraps the value under test; chained with matchers
  ```js
  // math.js
  function add(a, b) { return a + b; }
  module.exports = { add };

  // math.test.js
  const { add } = require('./math');

  describe('add()', () => {
    it('returns the sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('handles negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });
  });
  ```
- Common matchers:
  - `toBe(value)` — strict equality (`===`); use for primitives
  - `toEqual(value)` — deep equality; use for objects and arrays
  - `toContain(item)` — array or string contains item
  - `toThrow(error)` — function throws when called (wrap in `() =>`)
  - `toBeTruthy()` / `toBeFalsy()` — truthy/falsy check
  - `toBeNull()`, `toBeUndefined()`, `toBeDefined()`
  - `toBeGreaterThan(n)`, `toBeLessThan(n)`
**Speaker Notes:** The most common mistake with `toThrow` is calling the function directly instead of wrapping it: `expect(throwingFn()).toThrow()` will crash the test, because the function throws before Jest can catch it. Always write `expect(() => throwingFn()).toThrow()` — the arrow function lets Jest invoke it in a try/catch internally. The distinction between `toBe` and `toEqual` is important: `toBe` uses `===` so `expect({a:1}).toBe({a:1})` fails (different object references), while `expect({a:1}).toEqual({a:1})` passes (same deep structure).

### Slide 4: Lifecycle Hooks and Test Organization
**Visual:** Execution order diagram showing: beforeAll → [beforeEach → test1 → afterEach] → [beforeEach → test2 → afterEach] → [beforeEach → test3 → afterEach] → afterAll. Each phase color-coded. Note: nested describe blocks have their own beforeEach that runs after parent's.
**Content:**
- **beforeEach(fn)** — runs before every `it` block in the current `describe`
- **afterEach(fn)** — runs after every `it` block; use for cleanup (clear mocks, reset state)
- **beforeAll(fn)** — runs once before all tests in the `describe`; use for expensive setup (DB connect)
- **afterAll(fn)** — runs once after all tests; use for teardown (DB disconnect)
  ```js
  describe('UserService', () => {
    let db;

    beforeAll(async () => {
      db = await createTestDatabase();  // expensive — run once
    });

    afterAll(async () => {
      await db.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();  // reset mock state between tests
    });

    it('creates a user', async () => {
      const user = await UserService.create({ name: 'Alice' });
      expect(user.id).toBeDefined();
    });
  });
  ```
- **jest.clearAllMocks()** — resets mock call counts and return values (use in beforeEach)
- **jest.resetAllMocks()** — also removes mock implementations
- **jest.restoreAllMocks()** — restores original implementations of `jest.spyOn` mocks
**Speaker Notes:** The execution order is a classic exam question. `beforeAll` runs once at the top; `beforeEach` runs before every individual test. If you have nested `describe` blocks, the outer `beforeEach` runs first, then the inner `beforeEach`, for every test in the inner block. Test isolation is a core principle — each test should start from a known clean state, which is why clearing mocks in `beforeEach` is standard practice. Tests that depend on the execution order of other tests are fragile and hard to debug.

### Slide 5: Mocking with Jest
**Visual:** Diagram showing a "real" dependency chain (function → database) on the left vs mocked chain on the right (function → jest.fn() returning controlled value). Code snippet below showing jest.fn(), mockReturnValue, and toBeCalledWith.
**Content:**
- **Why mock?** Isolate the code under test from external dependencies (database, network, filesystem)
- **jest.fn()** — creates a mock function that tracks calls:
  ```js
  const mockFn = jest.fn();
  mockFn('hello');
  mockFn('world');

  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenLastCalledWith('world');
  ```
- **mockReturnValue / mockReturnValueOnce** — control what the mock returns:
  ```js
  const getUser = jest.fn().mockReturnValue({ id: 1, name: 'Alice' });
  const getUserOnce = jest.fn()
    .mockReturnValueOnce({ id: 1 })   // first call
    .mockReturnValue(null);            // subsequent calls
  ```
- **mockResolvedValue** — for async functions returning Promises:
  ```js
  const fetchData = jest.fn().mockResolvedValue({ data: 'result' });
  const result = await fetchData();  // resolves to { data: 'result' }
  ```
- **jest.mock(modulePath)** — auto-mocks an entire module:
  ```js
  jest.mock('./database');          // all exports become jest.fn()
  const db = require('./database');
  db.findUser.mockReturnValue({ id: 1 });
  ```
- **jest.spyOn(object, methodName)** — wraps a real method to track calls while keeping implementation
**Speaker Notes:** The distinction between `mockReturnValue` (synchronous) and `mockResolvedValue` (returns a resolved Promise) catches people. If you use `mockReturnValue` on a function that is awaited, the test will await a plain object, not a Promise, which usually results in undefined or surprising behavior. For rejected Promises (simulating errors), use `mockRejectedValue(new Error('Network error'))`. The `jest.mock()` call is hoisted to the top of the file by Babel/Jest, so you can reference it before the require statement.

### Slide 6: Code Coverage
**Visual:** Jest coverage report table showing four columns: Statements (87%), Branches (72%), Functions (100%), Lines (89%). Below, an HTML coverage report showing source code with green (covered) and red (uncovered) highlighting on specific lines and branches.
**Content:**
- Code coverage measures how much of your source code is exercised by tests
- Run with: `jest --coverage` or add `"collectCoverage": true` to jest.config.js
- **Four coverage metrics:**
  - **Statements** — each executable statement covered at least once
  - **Branches** — each branch of if/else/ternary/switch covered (both true and false paths)
  - **Functions** — each function called at least once
  - **Lines** — each line executed at least once
- Example coverage thresholds in jest.config.js:
  ```js
  module.exports = {
    coverageThreshold: {
      global: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      }
    }
  };
  ```
- **Branch coverage** is the most revealing metric — uncovered branches often hide bugs
- 100% coverage does not mean bug-free — it means every line ran, not that every behavior is correct
- Coverage reports generate HTML output in `./coverage/` folder for visual inspection
**Speaker Notes:** Teams often set coverage gates in CI — if coverage drops below a threshold, the build fails. This prevents coverage from eroding over time as new code is added without tests. Branch coverage below 70% is a red flag: it means large portions of conditional logic are untested. The HTML report is invaluable — it shows exactly which lines and branches are red. A common gotcha: if you mock a module, coverage of that module won't be collected from tests that use the mock. You need direct tests of that module for its coverage to register.

### Slide 7: Test-Driven Development (TDD)
**Visual:** Circular diagram of the TDD cycle: RED (write failing test) → GREEN (write minimum code to pass) → REFACTOR (clean up code, tests still pass) → RED again. Each phase has an icon: red X, green check, wrench. Callout: "Write the test first — let failing tests drive implementation."
**Content:**
- **TDD** = write tests before writing implementation code
- **Red-Green-Refactor cycle:**
  1. **RED** — Write a test for the behavior you want; run it; it must fail (because code doesn't exist yet)
  2. **GREEN** — Write the minimum code necessary to make the test pass
  3. **REFACTOR** — Clean up the implementation (remove duplication, improve names) while keeping tests green
  4. Repeat for the next behavior
- Example TDD session for a `Stack` class:
  ```js
  // Step 1 - RED: write failing test
  it('starts empty', () => {
    const stack = new Stack();
    expect(stack.size()).toBe(0);  // Stack doesn't exist yet — FAILS
  });

  // Step 2 - GREEN: minimal implementation
  class Stack {
    constructor() { this._items = []; }
    size() { return this._items.length; }
  }

  // Step 3 - REFACTOR: nothing to clean up yet — move on
  ```
- Benefits: forces you to think about API before implementation, ensures 100% test coverage by definition
- Not always practical for exploratory/prototype code, but essential for business logic
**Speaker Notes:** The "minimum code to pass" rule in the green phase is strict — you should not implement anything beyond what the current failing test requires. This seems tedious, but it prevents over-engineering. You will often find that following TDD strictly reveals ambiguities in requirements before you write production code, which is far cheaper than finding them in QA. The refactor phase is equally important — if you skip it, TDD produces messy code just as fast as test-last development.

## Recording Script

Welcome to Lecture 14: Testing JavaScript with Jest. Testing carries about five percent of the JSI exam, but more importantly it's a skill you'll use every day as a JavaScript developer.

Let's start with why. Automated tests prevent regressions — when you change one part of the code, tests immediately flag if something else broke. Tests also serve as documentation: a test that says "returns empty array when no users exist" is an unambiguous spec. And tests give you the confidence to refactor without fear.

The testing pyramid tells us to have many unit tests, fewer integration tests, and very few end-to-end tests. Unit tests are fast and isolated — they test one function with all dependencies mocked. Integration tests check that multiple units work together. E2E tests simulate a real user — they're the most valuable per test, but also the slowest and most fragile.

Jest is the dominant JavaScript test framework. describe() groups tests, it() or test() defines a single test case, and expect() plus a matcher asserts the outcome. The matchers you must know: toBe for strict equality on primitives, toEqual for deep object comparison, toContain for arrays and strings, toThrow for exception testing (remember to wrap the call in an arrow function), and toBeCalledWith for checking mock invocations.

Lifecycle hooks control setup and teardown: beforeAll runs once before the suite, beforeEach runs before each test — use it to reset mock state with jest.clearAllMocks(). afterEach and afterAll mirror these for cleanup.

Mocking is essential for unit test isolation. jest.fn() creates a mock function that tracks calls. mockReturnValue controls what it returns synchronously; mockResolvedValue returns a Promise that resolves — use this for async functions. jest.mock() auto-mocks an entire module.

Code coverage measures four things: statements, branches, functions, and lines. Branch coverage is the most revealing — an uncovered branch is often where bugs hide.

Finally, TDD: red-green-refactor. Write a failing test first, write minimum code to pass it, then refactor. This cycle ensures every line of code has a test driving it.

## Exam Tips
- **`toBe` vs `toEqual`:** `toBe` uses `===` (fails for objects with same structure but different reference); `toEqual` does deep equality (use for objects/arrays)
- **`toThrow` gotcha:** must wrap the call — `expect(() => fn()).toThrow()`, never `expect(fn()).toThrow()`
- **`mockReturnValue` vs `mockResolvedValue`:** sync return vs Promise resolve — don't mix them up
- **`beforeAll` vs `beforeEach`:** once for the suite vs once per test
- **`jest.clearAllMocks()`** resets call counts/history; `jest.resetAllMocks()` also clears implementations; `jest.restoreAllMocks()` restores spies to original
- **Code coverage metrics:** statements, branches, functions, lines — branch coverage is most useful for finding untested logic
- **TDD cycle order:** RED → GREEN → REFACTOR — always write the failing test first
- `jest.mock()` is hoisted to the top of the file automatically — it can appear after `require` statements in source order

## Lecture Summary
Automated testing prevents regressions, documents intended behavior, and enables confident refactoring. The testing pyramid prescribes many unit tests, fewer integration tests, and minimal E2E tests. Jest provides `describe()` for grouping, `it()`/`test()` for individual cases, and `expect()` with matchers (`toBe`, `toEqual`, `toContain`, `toThrow`, `toBeCalledWith`) for assertions. Lifecycle hooks (`beforeAll`, `afterAll`, `beforeEach`, `afterEach`) manage setup and cleanup, with `jest.clearAllMocks()` typically called in `beforeEach`. `jest.fn()` creates trackable mocks; `mockReturnValue` and `mockResolvedValue` control return values; `jest.mock()` mocks entire modules. Code coverage reports four metrics (statements, branches, functions, lines) and branch coverage is the most revealing. The TDD red-green-refactor cycle ensures every behavior is driven by a test.

## Mini Quiz

**Question 1:** A developer writes `expect(myFn()).toThrow(Error)`. The test never catches the error. What is the mistake?

A) `toThrow` only works with strings, not Error constructors
B) `myFn` must be called in a try/catch before passing to `expect`
C) The function must be wrapped in an arrow function: `expect(() => myFn()).toThrow(Error)`
D) `toThrow` is not a valid Jest matcher

**Answer: C — wrap in arrow function**
Jest's `toThrow` matcher invokes the function you pass to `expect` in an internal try/catch. If you call `myFn()` directly, it throws before Jest can catch it, crashing the test. Wrapping it as `() => myFn()` gives Jest a callable that it can invoke safely inside its try/catch mechanism.

---

**Question 2:** Which Jest hook runs exactly once before all tests in a `describe` block, regardless of how many tests are in the suite?

A) `beforeEach`
B) `afterEach`
C) `beforeAll`
D) `setup`

**Answer: C — `beforeAll`**
`beforeAll` runs once before the entire test suite within its `describe` scope. It is appropriate for expensive one-time setup like establishing a database connection. `beforeEach` would run before every individual test. `setup` is not a Jest API.

---

**Question 3:** A developer has an async function `fetchUser()` that returns a Promise. To mock it to return `{ id: 1 }` they write: `mockFn.mockReturnValue({ id: 1 })`. The test fails because the returned value is unexpected. What should they use instead?

A) `mockFn.mockResolvedValue({ id: 1 })`
B) `mockFn.mockSyncValue({ id: 1 })`
C) `mockFn.mockAwaitedValue({ id: 1 })`
D) `mockFn.mockReturnValue(Promise.resolve({ id: 1 }))`

**Answer: A — `mockResolvedValue`**
`mockResolvedValue({ id: 1 })` is equivalent to `mockReturnValue(Promise.resolve({ id: 1 }))` — option D would technically work but is verbose. `mockResolvedValue` is the idiomatic Jest API for mocking async functions. The test failed because `await mockFn()` awaited a plain object `{ id: 1 }` rather than a Promise, producing unexpected behavior.
