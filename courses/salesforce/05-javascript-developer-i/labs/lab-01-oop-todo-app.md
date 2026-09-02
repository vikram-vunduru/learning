# Lab 01: OOP Todo App — What I Need to Be Able to Do

## Core Skills Checklist

### Classes & OOP
- [ ] Write an ES6 class with a constructor, instance properties, and instance methods
- [ ] Use `#privateField` syntax to encapsulate data that should not be accessible outside the class
- [ ] Define `static` methods (e.g., a factory method like `Todo.create(title)`)
- [ ] Add getters and setters with input validation (`get title()`, `set title(v)`)
- [ ] Extend a base class with `extends` and call `super()` in the derived constructor
- [ ] Override a parent method in a subclass and optionally call `super.method()`

### ES Modules
- [ ] Export a class as a named export from one file and import it in another
- [ ] Use default export for the main class and named exports for utility functions
- [ ] Understand that `import` of the same module returns the same cached instance (singleton behavior)

### Collections & Array Methods
- [ ] Store todos in an array; add with `push`, remove with `filter`, find with `find`
- [ ] Implement `filter()` to get active todos, completed todos, and todos by priority
- [ ] Implement `map()` to transform todo objects to display format
- [ ] Implement `sort()` with a correct comparator (not default string sort)
- [ ] Use `reduce()` to count or aggregate (e.g., count of completed todos)

### Local Storage Persistence
- [ ] `JSON.stringify(array)` before writing to localStorage
- [ ] `JSON.parse(data)` after reading from localStorage, with null check
- [ ] Reconstruct class instances from plain objects (localStorage stores POJOs, not class instances)

### Error Handling
- [ ] Validate input in class methods and throw meaningful errors
- [ ] Wrap localStorage operations in try/catch (storage can be unavailable in private browsing)

## Concepts This Lab Tests
- Class syntax, private fields, getters/setters, extends/super
- Module import/export flow
- Pure array method chaining (map/filter/reduce/sort)
- JSON serialization for persistence

## What a Passing Implementation Looks Like
```javascript
class Todo {
    #id;
    #title;
    #completed = false;
    #createdAt;

    constructor(title) {
        if (!title?.trim()) throw new TypeError('Title required');
        this.#id = crypto.randomUUID();
        this.#title = title.trim();
        this.#createdAt = new Date();
    }

    get id() { return this.#id; }
    get title() { return this.#title; }
    get completed() { return this.#completed; }

    complete() { this.#completed = true; }

    toJSON() {
        return { id: this.#id, title: this.#title,
                 completed: this.#completed, createdAt: this.#createdAt };
    }

    static fromJSON(obj) {
        const todo = new Todo(obj.title);
        // restore other fields...
        return todo;
    }
}
```
