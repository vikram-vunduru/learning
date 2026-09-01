# Lecture 16: Design Patterns

## Learning Objectives
- Explain why design patterns exist as reusable solutions to recurring software problems
- Implement the Module pattern using IIFE and closures to encapsulate private state
- Implement the Singleton pattern to ensure a single shared instance
- Implement the Factory pattern to create objects without exposing construction logic
- Apply the Decorator and Facade structural patterns to extend and simplify interfaces
- Implement Observer/pub-sub and Strategy behavioral patterns
- Apply functional programming patterns: pure functions, immutability, and function composition
- Identify and avoid anti-patterns: global state, callback hell, magic numbers

## Slides

### Slide 1: Why Design Patterns?
**Visual:** Left column: a developer staring at a blank screen labeled "Custom solution every time — reinventing the wheel." Right column: a developer confidently selecting from a catalog labeled "Design Patterns — proven solutions." Quotes from the Gang of Four book ("Design Patterns: Elements of Reusable Object-Oriented Software") at the bottom.
**Content:**
- A **design pattern** is a named, reusable solution to a commonly occurring software design problem
- First formalized by the "Gang of Four" (GoF) — Gamma, Helm, Johnson, Vlissides — in 1994
- Patterns are **language-agnostic** — the concept applies across languages, even if syntax differs
- Benefits:
  - **Shared vocabulary:** Saying "use Observer here" communicates a full architecture instantly
  - **Proven solutions:** Patterns have been battle-tested across thousands of projects
  - **Avoids reinventing:** Common problems have well-known trade-offs documented
- Three categories:
  - **Creational** — how objects are created (Module, Singleton, Factory)
  - **Structural** — how objects are composed (Decorator, Facade)
  - **Behavioral** — how objects communicate (Observer, Strategy)
- JavaScript patterns are often adapted from classical OOP — some become simpler, some become idiomatic
**Speaker Notes:** Design patterns get a bad reputation when developers apply them rigidly or unnecessarily — this is "pattern overengineering." The right framing: patterns are a vocabulary for communicating solutions, not a checklist to impose. You identify the problem first, then reach for a pattern if it fits naturally. For the JSI exam, understand the intent and basic implementation of each pattern covered.

### Slide 2: Creational Patterns — Module and Singleton
**Visual:** Code panel (left): Module pattern using IIFE with a closure showing private `count` variable and public `increment`/`getCount` methods. Code panel (right): Singleton pattern using a class with a static `instance` property. Annotations highlight what is private vs public.
**Content:**
- **Module Pattern** — uses IIFE + closure to create private state with a public API:
  ```js
  const Counter = (() => {
    let count = 0;  // private — not accessible outside

    return {
      increment() { count++; },
      decrement() { count--; },
      getCount() { return count; }
    };
  })();

  Counter.increment();
  Counter.getCount();  // 1
  // count is inaccessible — true encapsulation
  ```
  - Modern alternative: ES Modules (import/export) provide module-level scope naturally
- **Singleton Pattern** — ensures only one instance of a class exists:
  ```js
  class Config {
    constructor() {
      if (Config.instance) return Config.instance;
      this.settings = {};
      Config.instance = this;
    }
    set(key, value) { this.settings[key] = value; }
    get(key) { return this.settings[key]; }
  }

  const c1 = new Config();
  const c2 = new Config();
  console.log(c1 === c2);  // true — same instance
  ```
  - Use for: configuration objects, connection pools, caches
  - Caution: Singletons make testing harder (global mutable state)
**Speaker Notes:** The Module pattern with IIFE was the primary way to achieve encapsulation in JavaScript before ES6 classes and ES Modules. Today, ES Modules are the preferred approach — every module file has its own scope. But you will encounter IIFE-based modules in legacy codebases and the pattern is still tested. The Singleton, while useful, is often considered an anti-pattern in testable code because it creates hidden global state — consider dependency injection as an alternative.

### Slide 3: Creational — Factory Pattern
**Visual:** Factory diagram showing `ShapeFactory.create('circle')` and `ShapeFactory.create('square')` calling different constructors internally, but both returning a shape with a common `draw()` method. The caller never uses `new Circle()` or `new Square()` directly.
**Content:**
- **Factory Pattern** — a function or method that creates objects without exposing the constructor:
  ```js
  class Circle {
    constructor(r) { this.radius = r; }
    area() { return Math.PI * this.radius ** 2; }
    toString() { return `Circle(r=${this.radius})`; }
  }

  class Square {
    constructor(s) { this.side = s; }
    area() { return this.side ** 2; }
    toString() { return `Square(s=${this.side})`; }
  }

  // Factory function — caller doesn't need to know which class to use
  function createShape(type, size) {
    switch (type) {
      case 'circle': return new Circle(size);
      case 'square': return new Square(size);
      default: throw new Error(`Unknown shape: ${type}`);
    }
  }

  const shapes = ['circle', 'square'].map(type => createShape(type, 5));
  shapes.forEach(s => console.log(s.area()));
  ```
- Benefits: decouples creation logic from usage; easy to add new types without changing callers
- **Factory Method** vs **Abstract Factory:** Factory Method is a single factory function; Abstract Factory produces families of related objects
- Common in Node.js: `http.createServer()`, `fs.createReadStream()` are factory functions
**Speaker Notes:** The Factory pattern is everywhere in JavaScript — you just don't always recognize it. `document.createElement('div')` is a factory. Any time a function creates and returns an object without the caller using `new`, that's a factory function. The power is in decoupling: the caller asks for "a circle" and gets one, without knowing the implementation class. This makes it easy to swap implementations (e.g., mock objects in tests) or add caching (return an existing object if one was already created).

### Slide 4: Structural Patterns — Decorator and Facade
**Visual:** Left: Decorator diagram showing a base `Logger` class wrapped in a `TimestampLogger` decorator that adds timestamps before delegating to the original logger. Right: Facade diagram showing multiple complex subsystems (AudioEngine, VideoEngine, NetworkManager) hidden behind a single `MediaPlayer` facade class.
**Content:**
- **Decorator Pattern** — wraps an object to add behavior without modifying the original:
  ```js
  class TextLogger {
    log(msg) { console.log(msg); }
  }

  class TimestampLogger {
    constructor(logger) { this._logger = logger; }
    log(msg) {
      this._logger.log(`[${new Date().toISOString()}] ${msg}`);
    }
  }

  class PrefixLogger {
    constructor(logger, prefix) {
      this._logger = logger;
      this._prefix = prefix;
    }
    log(msg) { this._logger.log(`${this._prefix}: ${msg}`); }
  }

  const logger = new PrefixLogger(new TimestampLogger(new TextLogger()), 'INFO');
  logger.log('Server started');
  // INFO: [2024-01-01T00:00:00.000Z] Server started
  ```
  - Composable: wrap decorators in any order/combination
  - TypeScript uses `@decorator` syntax (experimental feature) built on this concept
- **Facade Pattern** — provides a simple interface over a complex subsystem:
  ```js
  class EmailFacade {
    send(to, subject, body) {
      const validated = this._validate(to);
      const formatted = this._formatHtml(body);
      return this._smtpClient.send({ to: validated, subject, body: formatted });
    }
    _validate(email) { /* complex validation */ return email; }
    _formatHtml(text) { /* complex formatting */ return text; }
  }
  ```
**Speaker Notes:** The Decorator pattern is the runtime version of what TypeScript's `@decorator` syntax does at a syntactic level. LWC's `@api`, `@track`, and `@wire` decorators follow this pattern — they wrap a property or method to add framework behavior. The Facade is one of the most pragmatic patterns: when you integrate a complex third-party library, wrapping it in a Facade class gives you a simpler API tailored to your needs, makes testing easier (mock the facade, not the library), and protects your code from the library's API changes.

### Slide 5: Behavioral Patterns — Observer and Strategy
**Visual:** Left: Observer/pub-sub diagram showing Publisher emitting 'price-change' event → multiple Subscriber objects (PriceDisplay, AlertSystem, Logger) all notified. Right: Strategy diagram showing a Sorter class that holds a `sortingStrategy` reference and delegates sorting to it, with BubbleSort and QuickSort as interchangeable strategies.
**Content:**
- **Observer Pattern** (pub-sub) — objects subscribe to events; publisher notifies all subscribers:
  ```js
  class EventBus {
    constructor() { this._listeners = {}; }

    subscribe(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
    }

    publish(event, data) {
      (this._listeners[event] || []).forEach(cb => cb(data));
    }
  }

  const bus = new EventBus();
  bus.subscribe('userCreated', user => console.log('Welcome email:', user.email));
  bus.subscribe('userCreated', user => console.log('Analytics:', user.id));
  bus.publish('userCreated', { id: 1, email: 'alice@example.com' });
  ```
  - Node.js `EventEmitter` is the built-in Observer implementation
  - DOM `addEventListener` / `dispatchEvent` is Observer in the browser
- **Strategy Pattern** — encapsulate interchangeable algorithms behind a common interface:
  ```js
  class Sorter {
    constructor(strategy) { this.strategy = strategy; }
    sort(data) { return this.strategy(data); }
  }

  const bubbleSort = data => [...data].sort((a, b) => a - b);  // simplified
  const sorter = new Sorter(bubbleSort);
  sorter.sort([3, 1, 2]);  // swap strategy at runtime without changing Sorter
  ```
**Speaker Notes:** Observer is arguably the most important pattern in JavaScript because the entire event system — DOM events, Node.js EventEmitter, React's synthetic events — is Observer. The key principle: the publisher doesn't know who the subscribers are, and subscribers don't know about each other. This decoupling allows you to add new subscribers without changing the publisher. The Strategy pattern solves a different problem: you want to choose an algorithm at runtime. If/else chains that switch between algorithms are a code smell — Strategy extracts each algorithm into its own function or class.

### Slide 6: Functional Patterns and Anti-Patterns
**Visual:** Left panel: pure function vs impure function comparison. Middle: function composition diagram showing f(g(x)) = compose(f, g)(x). Right: anti-patterns panel with red X labels on global state, callback hell pyramid, and magic number examples.
**Content:**
- **Pure functions** — same input always produces same output; no side effects:
  ```js
  // Pure — deterministic, no side effects
  const add = (a, b) => a + b;
  const double = arr => arr.map(x => x * 2);  // returns new array

  // Impure — modifies external state
  let total = 0;
  const addToTotal = n => { total += n; };  // side effect!
  ```
- **Immutability** — never mutate; return new values:
  ```js
  const original = { x: 1, y: 2 };
  const updated = { ...original, y: 3 };  // spread — original unchanged
  const newArr = [...arr, newItem];        // spread append
  ```
- **Function composition:**
  ```js
  const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
  const pipe    = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

  const process = pipe(trim, lowercase, removeSpaces);
  process('  Hello World  ');  // 'helloworld'
  ```
- **Anti-patterns to avoid:**
  - **Global state:** `window.myGlobalVar = ...` — causes hidden coupling and testing nightmares
  - **Callback hell (Pyramid of Doom):** deeply nested callbacks → use Promises/async-await
  - **Magic numbers:** `if (score > 42)` — use named constants: `const PASSING_SCORE = 42`
  - **Mutating function arguments:** modifying input objects/arrays causes unpredictable bugs
**Speaker Notes:** Pure functions are the foundation of functional programming. The exam won't test deep FP theory, but knowing the definition of a pure function and why immutability matters is fair game. The practical benefit: pure functions are trivially testable — no setup, no mocking, no cleanup. Callback hell is historically JavaScript's most notorious problem, solved by Promises and async/await, but understanding why it's bad reinforces why those features were added. Magic numbers make code unreadable six months later — always name your constants.

## Recording Script

Welcome to Lecture 16: Design Patterns. This section carries the highest exam weight in Section 4 at about seven percent, so it's worth our full attention.

Design patterns are named, reusable solutions to recurring software problems. They give us shared vocabulary — saying "use Observer" communicates a full architecture. They're organized into three categories: creational (how objects are created), structural (how objects are composed), and behavioral (how objects communicate).

Starting with creational patterns. The Module pattern uses an IIFE and closure to hide private state — the returned object is the public API, and private variables live in the closure. Today ES Modules often replace this, but you'll encounter IIFE-based modules in legacy code. The Singleton ensures one shared instance — useful for configuration objects. The Factory function creates objects without exposing constructors — decouples creation from usage.

Structural patterns. The Decorator wraps an object to add behavior — you compose wrappers in any order. This is exactly what TypeScript's `@decorator` syntax and LWC's `@api`, `@track`, `@wire` do. The Facade provides a simple interface over a complex subsystem — think `document.createElement` hiding browser internals.

Behavioral patterns. Observer — publisher emits events, subscribers react — is the foundation of every JavaScript event system. Node.js EventEmitter, DOM addEventListener, they're all Observer. Strategy encapsulates interchangeable algorithms — swap sorting strategies at runtime without changing the container.

Functional patterns: pure functions have no side effects and always produce the same output for the same input. Immutability returns new values instead of mutating. Function composition chains functions together.

Anti-patterns: avoid global state, callback hell, and magic numbers. These make code unpredictable, untestable, and unmaintainable.

## Exam Tips
- **Module pattern = IIFE + closure** for private state, returning a public API object
- **Singleton** = single instance enforced by checking `ClassName.instance`; caution: global state makes testing hard
- **Factory** = function that creates objects, caller uses no `new`; decouples creation from usage
- **Decorator** = wrapper that delegates to original and adds behavior; composable; relates to `@decorator` syntax in TS/LWC
- **Facade** = simple interface over complex subsystem; improves usability and testability
- **Observer** = publisher/subscriber; EventEmitter and DOM addEventListener are Observer implementations
- **Strategy** = interchangeable algorithms behind a common interface; eliminates if/else chains over algorithms
- **Pure function** = same input → same output, no side effects
- **Immutability** = use spread operator/Object.assign to return new objects/arrays instead of mutating
- **Anti-patterns:** global state, callback hell (solved by async/await), magic numbers (use named constants)

## Lecture Summary
Design patterns are reusable named solutions to recurring software design problems, organized as creational, structural, and behavioral. The Module pattern (IIFE + closure) encapsulates private state; the Singleton ensures one shared instance; the Factory decouples object creation. The Decorator wraps objects to add composable behavior (the basis of TypeScript and LWC decorators); the Facade simplifies complex subsystem APIs. Observer (pub-sub) — implemented by EventEmitter and DOM events — decouples publishers from subscribers. Strategy externalizes interchangeable algorithms. Functional patterns — pure functions, immutability, and composition — produce predictable, testable code. Anti-patterns to avoid include global state, callback hell (solved by Promises/async-await), and magic numbers (replaced by named constants).

## Mini Quiz

**Question 1:** A developer creates a `Logger` class and then creates a `TimestampLogger` that wraps it, adding a timestamp before calling the original logger's `log()` method. Which design pattern does this implement?

A) Factory
B) Facade
C) Decorator
D) Singleton

**Answer: C — Decorator**
The Decorator pattern wraps an existing object (the base logger) to add new behavior (timestamp prepending) without modifying the original class. The wrapped object is stored as a dependency, and the decorator's method delegates to it after performing the added behavior. The Facade would hide complexity; Factory would create objects; Singleton would ensure one instance.

---

**Question 2:** Which of the following best describes a pure function?

A) A function declared with the `function` keyword (not an arrow function)
B) A function that returns a new value without modifying any external state or its arguments
C) A function that uses only primitive parameter types
D) A function that contains no loops

**Answer: B — no side effects, returns new value**
A pure function satisfies two rules: (1) given the same inputs it always returns the same output, and (2) it produces no side effects — it does not modify external variables, mutate arguments, call APIs, write to files, or log to the console. The function declaration syntax and parameter types are irrelevant to purity.

---

**Question 3:** Node.js's `EventEmitter` with `on()` and `emit()`, and the DOM's `addEventListener()` and `dispatchEvent()`, are both implementations of which design pattern?

A) Strategy
B) Decorator
C) Observer (pub-sub)
D) Facade

**Answer: C — Observer (pub-sub)**
The Observer pattern defines a one-to-many dependency: when a subject (publisher) changes state or emits an event, all registered observers (subscribers/listeners) are notified automatically. Both EventEmitter and DOM events implement exactly this: multiple listeners can subscribe to an event, and all are called when the event is emitted/dispatched. The publisher does not know who is listening.
