# Testing JavaScript

## Exam Domain
Browser & Node APIs / Testing — ~13% of exam weight

## Core Concepts

### Jest — The Standard
Jest is the testing framework used for LWC (via `@salesforce/sfdx-lwc-jest`). All JSI exam testing questions reference Jest patterns.

```javascript
// Basic test structure
describe('Calculator', () => {
    // Setup/teardown
    beforeAll(() => { /* runs once before all tests in block */ });
    afterAll(() => { /* runs once after all tests in block */ });
    beforeEach(() => { /* runs before EACH test */ });
    afterEach(() => { /* runs after EACH test */ });

    it('adds two numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    test('handles negative numbers', () => {  // test === it
        expect(add(-1, 1)).toBe(0);
    });
});
```

### Matchers — What to Memorize
```javascript
// Equality
expect(2 + 2).toBe(4);              // strict === (primitives)
expect({a: 1}).toEqual({a: 1});     // deep equality (objects/arrays)
expect({a: 1}).not.toBe({a: 1});    // objects not === (different reference)

// Truthiness
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('value').toBeDefined();
expect(0).toBeFalsy();
expect(1).toBeTruthy();

// Numbers
expect(3.14).toBeCloseTo(3.1, 1);   // floating point comparison
expect(10).toBeGreaterThan(5);
expect(5).toBeLessThanOrEqual(5);

// Strings
expect('hello world').toContain('world');
expect('test@email.com').toMatch(/^[\w.]+@/);  // regex

// Arrays
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('name', 'Alice');

// Errors
expect(() => riskyFn()).toThrow();
expect(() => riskyFn()).toThrow('specific message');
expect(() => riskyFn()).toThrow(TypeError);

// Async
await expect(asyncFn()).resolves.toBe('value');
await expect(asyncFn()).rejects.toThrow('error');
```

### Mocking — Isolate the Unit
```javascript
// jest.fn() — mock function
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Return values
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: [] });    // Promise that resolves
mockFn.mockRejectedValue(new Error('oops')); // Promise that rejects

// jest.spyOn — wrap existing method
const spy = jest.spyOn(mathModule, 'add');
spy.mockReturnValue(100);
expect(mathModule.add(2, 3)).toBe(100);  // spy intercepts
spy.mockRestore();  // restore original

// Mock entire module
jest.mock('./api-service', () => ({
    fetchData: jest.fn().mockResolvedValue({ records: [] })
}));
```

### Testing Async Code
```javascript
// Option 1: async/await (preferred)
it('loads contacts', async () => {
    const result = await loadContacts('accountId123');
    expect(result).toHaveLength(3);
});

// Option 2: return Promise
it('loads contacts', () => {
    return loadContacts('accountId123').then(result => {
        expect(result).toHaveLength(3);
    });
});

// Option 3: done callback (legacy)
it('loads contacts', (done) => {
    loadContacts('accountId123').then(result => {
        expect(result).toHaveLength(3);
        done();
    });
});
```

### Code Coverage
```
Metrics Jest reports:
├── Statements — % of statements executed
├── Branches   — % of if/else/ternary branches hit
├── Functions  — % of functions called
└── Lines      — % of lines executed

Target: 80%+ is common in enterprise; 100% is rare and often not valuable
```

### Test-Driven Development (TDD)
```
RED   → Write failing test first
GREEN → Write minimum code to pass
REFACTOR → Clean up code, tests still pass
Repeat
```

### LWC Testing with Jest
```javascript
// LWC component test with @salesforce/sfdx-lwc-jest
import { createElement } from 'lwc';
import MyComponent from 'c/myComponent';

describe('c-my-component', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the component title', () => {
        const element = createElement('c-my-component', { is: MyComponent });
        document.body.appendChild(element);

        const h1 = element.shadowRoot.querySelector('h1');
        expect(h1.textContent).toBe('My Component Title');
    });

    it('dispatches save event on button click', () => {
        const element = createElement('c-my-component', { is: MyComponent });
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('save', handler);

        const btn = element.shadowRoot.querySelector('button.save');
        btn.click();

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
```

## Architecture / How It Works

### Test Isolation Chain
```
SUT (Subject Under Test)
    │ depends on
    ▼
External dependency (API, DB, Apex)
    │ replaced by
    ▼
Mock/Stub
    │ allows
    ▼
Controlled test behavior
```

**Limitations:**
- `toBe` uses `===` — use `toEqual` for object/array comparison; failing this is a common beginner error
- Async test without `return`/`await` — test passes vacuously before Promise resolves
- `jest.mock` is hoisted to top of file — cannot be in `beforeEach`; module mock applies to entire file
- LWC test cleanup: always remove created elements in `afterEach` — test contamination is common without this
- Coverage percentage does not equal test quality — you can have 100% statement coverage with tests that don't assert anything

## PTA / SA Relevance

**Code review flags:**
- Tests that don't assert anything (`expect()` calls missing) — Jest doesn't fail on empty expectations
- No `afterEach` cleanup in LWC tests — DOM contamination across tests causes non-deterministic failures
- Async test without `await` or `return` — always passes, never actually tests
- Mocking everything — over-mocking hides integration issues; mock at the boundary (Apex call level), not internal methods

**Architecture guidance for Salesforce delivery:**
- JSI certification does NOT require knowing the full LWC Jest setup. It requires understanding Jest's `describe/it/expect` patterns and mock patterns.
- For partner technical audits: check if LWC component library has tests at all (many ISVs don't). A component without tests is a maintenance risk, especially for LWC data processing logic.
- Recommend `@salesforce/sfdx-lwc-jest` for LWC unit tests and Apex test classes (separate — not Jest) for server-side logic.

**Customer advisory:** When customers ask about testing strategy: unit test the JavaScript logic with Jest (pure functions, data transformations, business rules). Integration test the Apex side in Apex test classes. Don't try to test the full stack in one test — separate concerns.

## Key Facts to Memorize
- `describe` = group; `it`/`test` = individual test; `beforeEach`/`afterEach` = setup/teardown
- `toBe` = strict equality (`===`); `toEqual` = deep equality
- `jest.fn()` creates a mock function; track calls with `.toHaveBeenCalled()`
- `jest.mock('./module')` replaces entire module; `jest.spyOn(obj, 'method')` wraps specific method
- Async tests: must `await` or `return` the Promise — otherwise test passes before assertion runs
- TDD: Red → Green → Refactor

## Exam Traps
- `expect({a:1}).toBe({a:1})` FAILS — object references differ; use `toEqual` for object comparison
- Async test that forgets `await`: always passes, never catches failures
- `jest.mock()` is hoisted — you cannot have different mocks in different tests in the same file without `mockImplementation`
- `toThrow()` requires a function wrapper: `expect(() => riskyFn()).toThrow()` NOT `expect(riskyFn()).toThrow()`

## Practice Questions
**Q:** What is the difference between `toBe` and `toEqual`?
**A:** `toBe` uses strict equality (`===`) — correct for primitives. `toEqual` performs deep recursive equality — correct for objects and arrays. `expect({a:1}).toBe({a:1})` FAILS because two object literals are different references. `expect({a:1}).toEqual({a:1})` PASSES.

**Q:** An async test always passes even when the Apex mock returns the wrong data. Why?
```javascript
it('loads contacts', () => {
    loadContacts().then(contacts => {
        expect(contacts).toHaveLength(3);
    });
});
```
**A:** The test function doesn't return the Promise, so Jest considers the test done immediately (synchronously), before the `.then()` runs. Fix: `return loadContacts().then(...)` or `async/await`: `const contacts = await loadContacts(); expect(...);`.

**Q:** How do you test that a function throws an error?
**A:** Wrap the function call in an arrow function inside `expect()`:
```javascript
expect(() => parseInput('invalid')).toThrow('Invalid input format');
```
Without the wrapper, `parseInput('invalid')` throws before Jest can catch it, and the test crashes rather than failing.
