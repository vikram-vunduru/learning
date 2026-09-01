# Lab 01: OOP Todo App — Classes, Modules & Local Storage

## Lab Overview
Build a fully functional Todo application using ES6 classes and modules with data persistence via localStorage. This lab applies Sections 1 and 2 — classes, inheritance, modules, closures, and ES6+ syntax.

**Time Estimate:** 90 minutes  
**Difficulty:** Intermediate  
**Concepts Applied:** Classes, ES Modules, localStorage, event delegation, closures, private fields

---

## Lab Objectives
- Implement a `Todo` class with private fields, getters, and a static factory method
- Implement a `TodoList` class that manages a collection of `Todo` instances
- Create a `StorageService` module for localStorage persistence
- Wire everything together in a `TodoApp` class that handles DOM events
- Use event delegation for dynamically added list items

---

## Project Structure
```
todo-app/
├── index.html
├── styles.css
├── src/
│   ├── Todo.js           (Todo class)
│   ├── TodoList.js       (TodoList class)
│   ├── StorageService.js (persistence module)
│   └── TodoApp.js        (main app, DOM wiring)
└── main.js               (entry point)
```

---

## Part 1: The Todo Class (src/Todo.js)

### Step 1: Create the Todo class
Create `src/Todo.js` with the following requirements:
- Private fields: `#id`, `#text`, `#completed`, `#createdAt`
- Constructor takes `text` string; auto-generates id using `Date.now()` + random suffix
- Public getters: `id`, `text`, `completed`, `createdAt`
- `toggle()` method: flips `#completed` to its opposite value
- `setText(newText)` method: validates non-empty string, updates `#text`
- `toJSON()` method: returns a plain object for serialization
- `static fromJSON(obj)` factory method: reconstructs a Todo from a plain object

```js
// src/Todo.js
export class Todo {
    #id;
    #text;
    #completed;
    #createdAt;

    constructor(text) {
        if (!text?.trim()) throw new Error('Todo text cannot be empty');
        this.#id = `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        this.#text = text.trim();
        this.#completed = false;
        this.#createdAt = new Date();
    }

    get id() { return this.#id; }
    get text() { return this.#text; }
    get completed() { return this.#completed; }
    get createdAt() { return this.#createdAt; }

    toggle() { this.#completed = !this.#completed; }

    setText(newText) {
        if (!newText?.trim()) throw new Error('Todo text cannot be empty');
        this.#text = newText.trim();
    }

    toJSON() {
        return {
            id: this.#id,
            text: this.#text,
            completed: this.#completed,
            createdAt: this.#createdAt.toISOString()
        };
    }

    static fromJSON({ id, text, completed, createdAt }) {
        const todo = new Todo(text);
        todo.#id = id;
        todo.#completed = completed;
        todo.#createdAt = new Date(createdAt);
        return todo;
    }
}
```

> **Challenge**: Notice that `static fromJSON` accesses private fields of a different instance. In JavaScript, private fields are accessible to any code within the class body — static methods are part of the class body. This is the intended behavior.

---

## Part 2: The TodoList Class (src/TodoList.js)

### Step 2: Create the TodoList class
```js
// src/TodoList.js
import { Todo } from './Todo.js';

export class TodoList {
    #todos = [];
    #listeners = [];

    add(text) {
        const todo = new Todo(text);
        this.#todos.push(todo);
        this.#notify();
        return todo;
    }

    remove(id) {
        const before = this.#todos.length;
        this.#todos = this.#todos.filter(t => t.id !== id);
        if (this.#todos.length !== before) this.#notify();
    }

    toggle(id) {
        const todo = this.#todos.find(t => t.id === id);
        if (todo) { todo.toggle(); this.#notify(); }
    }

    get all() { return [...this.#todos]; }
    get active() { return this.#todos.filter(t => !t.completed); }
    get completed() { return this.#todos.filter(t => t.completed); }

    clearCompleted() {
        this.#todos = this.#todos.filter(t => !t.completed);
        this.#notify();
    }

    onChange(listener) {
        this.#listeners.push(listener);
        return () => { this.#listeners = this.#listeners.filter(l => l !== listener); };
    }

    #notify() {
        this.#listeners.forEach(l => l(this.all));
    }

    toJSON() { return this.#todos.map(t => t.toJSON()); }

    static fromJSON(arr) {
        const list = new TodoList();
        list.#todos = arr.map(obj => Todo.fromJSON(obj));
        return list;
    }
}
```

> **Note**: `onChange` returns an **unsubscribe function** — a closure pattern. Calling the returned function removes that listener. This is the same pattern used in React's `useEffect` cleanup and LWC's `MessageContext` unsubscribe.

---

## Part 3: StorageService Module (src/StorageService.js)

### Step 3: Persistence module
```js
// src/StorageService.js
const KEY = 'jsi-todos';

export const StorageService = {
    save(todoList) {
        try {
            localStorage.setItem(KEY, JSON.stringify(todoList.toJSON()));
        } catch (e) {
            console.error('Failed to save todos:', e);
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to load todos:', e);
            return [];
        }
    },

    clear() {
        localStorage.removeItem(KEY);
    }
};
```

---

## Part 4: TodoApp — DOM Wiring (src/TodoApp.js)

### Step 4: Wire up the DOM with event delegation
```js
// src/TodoApp.js
import { TodoList } from './TodoList.js';
import { StorageService } from './StorageService.js';

export class TodoApp {
    #list;
    #form;
    #input;
    #todoContainer;
    #filterButtons;
    #currentFilter = 'all';

    constructor(rootSelector) {
        const root = document.querySelector(rootSelector);
        this.#form = root.querySelector('#todo-form');
        this.#input = root.querySelector('#todo-input');
        this.#todoContainer = root.querySelector('#todo-list');
        this.#filterButtons = root.querySelectorAll('[data-filter]');

        const saved = StorageService.load();
        this.#list = saved.length > 0 ? TodoList.fromJSON(saved) : new TodoList();

        this.#list.onChange(() => {
            StorageService.save(this.#list);
            this.#render();
        });

        this.#form.addEventListener('submit', this.#handleAdd.bind(this));
        // Event delegation — one listener for all todos
        this.#todoContainer.addEventListener('click', this.#handleTodoClick.bind(this));
        this.#filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.#currentFilter = btn.dataset.filter;
                this.#render();
            });
        });

        this.#render();
    }

    #handleAdd(e) {
        e.preventDefault();
        const text = this.#input.value.trim();
        if (!text) return;
        this.#list.add(text);
        this.#input.value = '';
    }

    #handleTodoClick(e) {
        const item = e.target.closest('[data-id]');
        if (!item) return;
        const id = item.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            this.#list.remove(id);
        } else if (e.target.classList.contains('toggle-btn')) {
            this.#list.toggle(id);
        }
    }

    #getFilteredTodos() {
        switch (this.#currentFilter) {
            case 'active': return this.#list.active;
            case 'completed': return this.#list.completed;
            default: return this.#list.all;
        }
    }

    #render() {
        const todos = this.#getFilteredTodos();
        this.#todoContainer.innerHTML = todos.length === 0
            ? '<li class="empty">No todos yet. Add one above!</li>'
            : todos.map(todo => `
                <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
                    <button class="toggle-btn">${todo.completed ? '✓' : '○'}</button>
                    <span class="todo-text">${todo.text}</span>
                    <span class="date">${todo.createdAt.toLocaleDateString()}</span>
                    <button class="delete-btn">✕</button>
                </li>`).join('');
    }
}
```

---

## Part 5: Entry Point and HTML

### main.js
```js
import { TodoApp } from './src/TodoApp.js';
new TodoApp('#app');
```

### index.html (minimal structure)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JSI Todo App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Todo List</h1>
        <form id="todo-form">
            <input id="todo-input" type="text" placeholder="Add a todo..." required>
            <button type="submit">Add</button>
        </form>
        <div>
            <button data-filter="all">All</button>
            <button data-filter="active">Active</button>
            <button data-filter="completed">Completed</button>
        </div>
        <ul id="todo-list"></ul>
    </div>
    <script type="module" src="main.js"></script>
</body>
</html>
```

---

## Stretch Challenges
1. **Edit in place**: double-click a todo text to make it editable inline — use `contenteditable` or replace with `<input>`
2. **Drag to reorder**: implement drag-and-drop reordering of todos using the Drag and Drop API
3. **Categories**: extend `Todo` with a `#category` private field and add a `CategoryTodoList` subclass using `extends`
4. **Unit tests**: write Jest tests for `Todo.toggle()`, `TodoList.add()`, and `StorageService` (mocking localStorage)

## Key Concepts Applied
- **Private fields** (`#field`): encapsulation enforced by the language, not convention
- **Event delegation**: one listener on the container, routing via `closest('[data-id]')` and `classList.contains`
- **Observer pattern**: `onChange` listener list with unsubscribe function return
- **Module pattern**: each class in its own file, imported where needed
- **Error handling**: try/catch in localStorage read/write for graceful degradation
- **Closures**: the unsubscribe function closes over the `#listeners` array
