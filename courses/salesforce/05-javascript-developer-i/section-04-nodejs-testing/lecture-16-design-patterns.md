# Design Patterns

## Exam Domain
Objects, Arrays & Classes — ~5% of exam weight on CRT-600

## Core Concepts

### Module Pattern
Encapsulate private state via closure; expose a public API.
```javascript
const counterModule = (() => {
    let _count = 0;     // private
    return {
        increment() { return ++_count; },
        decrement() { return --_count; },
        getCount() { return _count; },
        reset() { _count = 0; }
    };
})();

counterModule.increment();  // 1
counterModule._count;       // undefined — truly private
```
**In ES modules:** module-level variables are already private. IIFE module pattern is mostly obsolete with ES6 modules.

### Singleton Pattern
Ensures only one instance of a class exists in the application.
```javascript
class EventBus {
    static #instance = null;
    #listeners = new Map();

    static getInstance() {
        if (!EventBus.#instance) {
            EventBus.#instance = new EventBus();
        }
        return EventBus.#instance;
    }

    on(event, cb) { ... }
    emit(event, data) { ... }
}

const bus1 = EventBus.getInstance();
const bus2 = EventBus.getInstance();
bus1 === bus2; // true — same instance
```
**ES module singleton:** a module file is cached and executed once — any exported object is naturally a singleton.

### Factory Pattern
Create objects without exposing instantiation logic.
```javascript
class AnimalFactory {
    static create(type, name) {
        switch (type) {
            case 'dog': return new Dog(name);
            case 'cat': return new Cat(name);
            case 'bird': return new Bird(name);
            default: throw new Error(`Unknown animal: ${type}`);
        }
    }
}

const animal = AnimalFactory.create('dog', 'Rex');

// LWC pattern: service factory for different Apex endpoints
const service = ServiceFactory.create(this.objectApiName);
service.getData(this.recordId);
```

### Observer Pattern
Objects subscribe to events from a subject; subject notifies all subscribers.
```javascript
class EventEmitter {
    #events = {};

    on(event, listener) {
        (this.#events[event] ??= []).push(listener);
        return this;
    }

    off(event, listener) {
        this.#events[event] = this.#events[event]?.filter(l => l !== listener) ?? [];
    }

    emit(event, ...args) {
        this.#events[event]?.forEach(l => l(...args));
    }
}

// LWC equivalent: Lightning Message Service (publish/subscribe)
```

### Decorator Pattern
Wrap an object to add behavior dynamically without modifying it.
```javascript
// Function decorator
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with`, args);
        const result = fn.apply(this, args);
        console.log(`${fn.name} returned`, result);
        return result;
    };
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3);  // logs call + result, returns 5

// Class method decorator (TypeScript/ES proposal syntax)
class Component {
    @readonly  // decorator — prevents overwrites
    version = '1.0';
}
```

### Strategy Pattern
Define a family of algorithms; make them interchangeable.
```javascript
const sortStrategies = {
    ascending: (a, b) => a - b,
    descending: (a, b) => b - a,
    random: () => Math.random() - 0.5
};

class Sorter {
    constructor(strategy = 'ascending') {
        this.strategy = sortStrategies[strategy];
    }
    sort(arr) { return [...arr].sort(this.strategy); }
    setStrategy(strategy) { this.strategy = sortStrategies[strategy]; }
}

const sorter = new Sorter();
sorter.sort([3, 1, 2]);          // [1, 2, 3]
sorter.setStrategy('descending');
sorter.sort([3, 1, 2]);          // [3, 2, 1]
```

### Facade Pattern
Simplify a complex subsystem behind a clean interface.
```javascript
// Complex subsystem
class AuthService { ... }
class ProfileService { ... }
class PreferencesService { ... }

// Facade — simple interface to multiple services
class UserFacade {
    constructor() {
        this._auth = new AuthService();
        this._profile = new ProfileService();
        this._prefs = new PreferencesService();
    }

    async login(credentials) {
        const user = await this._auth.authenticate(credentials);
        const profile = await this._profile.load(user.id);
        const prefs = await this._prefs.load(user.id);
        return { user, profile, prefs };
    }
}

// LWC version: LWC service component that wraps multiple wire adapters
```

## Architecture / How It Works

### Pattern Applicability in LWC/Salesforce

| Pattern | LWC / Salesforce Context |
|---------|--------------------------|
| Module | ES modules are already modules — IIFE obsolete |
| Singleton | Module-level service state; LMS message channel |
| Factory | Creating components/services by type |
| Observer | Lightning Message Service (pub/sub) |
| Decorator | `@api`, `@wire`, `@track` LWC decorators |
| Strategy | Swappable data processing / sort algorithms |
| Facade | LWC service component wrapping multiple APIs |

**Limitations:**
- Singleton creates tight coupling — hard to test because shared state bleeds across tests; use `getInstance().reset()` in test teardown
- Observer with many subscribers can create performance issues — remove listeners when no longer needed
- Over-applying patterns adds complexity — use only when they solve a real problem

## PTA / SA Relevance

**Architecture reviews:**
- Singleton for LWC message channel subscriptions — ensure subscribers unsubscribe in `disconnectedCallback`
- Factory pattern for partner ISVs who need to support multiple Salesforce objects (Contact, Lead, Person Account) with one LWC component — factory creates the right service class
- Observer/pub-sub: Lightning Message Service is the Salesforce-approved cross-component pub-sub — flag direct DOM event abuse across unrelated components

**Customer advisory:** When customers ask about sharing state across LWC components in different parts of the page (different slots, different containers), Lightning Message Service (LMS) is the answer — it's the Observer pattern built into the platform. Avoid custom event buses for cross-hierarchy communication.

## Key Facts to Memorize
- Module: private state via closure; expose public API (IIFE or ES module)
- Singleton: one instance only — ES module files are naturally singletons
- Factory: create objects without `new` in the caller
- Observer: subscribe/publish — LWC equivalent = Lightning Message Service
- Decorator: wraps function/class to add behavior — LWC has `@api`, `@wire`, `@track` as built-in decorators
- Strategy: algorithm family, swappable — passed as comparator, handler, or strategy object
- Facade: simplifies complex subsystem behind clean interface

## Exam Traps
- ES module singleton vs class singleton: both work; exam may test that `import` of the same module returns the cached instance
- Observer = pub/sub — "subscribe" to events; Decorator = wrap an object/function to add behavior (different!)
- Factory doesn't necessarily use a `class Factory` — any function that returns an object is a factory
- Decorator pattern is different from TypeScript/JavaScript decorator SYNTAX (the `@decorator` annotation) — the pattern predates the syntax

## Practice Questions
**Q:** How does an ES module naturally implement the Singleton pattern?
**A:** ES module code executes once and the result is cached. Every `import` of the same module gets the same exported object reference. A module that exports `const state = { count: 0 }` gives every importer the same `state` object — mutations are shared.

**Q:** What is the Observer pattern and how does LWC implement it for cross-component communication?
**A:** Observer: a subject maintains a list of observers (subscribers); when state changes, all observers are notified. LWC implements this for cross-component communication via Lightning Message Service (LMS): components publish messages to a named channel; components in any part of the page that subscribe to that channel receive the message.

**Q:** When would you use a Factory over direct `new ClassName()`?
**A:** When the type of object to create depends on runtime conditions, when you want to hide construction complexity, or when you might need to swap implementations. Example: `ServiceFactory.create(objectApiName)` returns a `ContactService` or `AccountService` based on the object type — the caller doesn't need to know which one.
