import type { Resource } from "./resources";

export const JSI_RESOURCES: Record<string, Resource[]> = {
  // ── Course Overview ────────────────────────────────────────────────────────
  "jsi-overview": [
    { type: "trailhead", title: "JavaScript Developer I Exam Guide", url: "https://trailhead.salesforce.com/credentials/javascriptdeveloperi", description: "Official exam guide — topic weights, registration, and recommended Trailhead modules", level: "Beginner" },
    { type: "docs", title: "LWC Developer Guide", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc", description: "The foundational docs for LWC — JSI JavaScript knowledge maps directly to LWC component development", level: "Intermediate" },
    { type: "trailhead", title: "JavaScript Skills for Salesforce Developers — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Trailhead trail covering the JavaScript skills needed for Salesforce development", level: "Beginner" },
    { type: "youtube", title: "JavaScript Full Course — freeCodeCamp", url: "https://www.youtube.com/watch?v=jS4aFq5-91M", description: "12-hour comprehensive JavaScript course — use as reference for specific topics", duration: "12 hr" },
    { type: "udemy", title: "Salesforce JavaScript Developer I Certification", url: "https://www.udemy.com/courses/search/?q=salesforce+javascript+developer+1+certification&sort=highest-rated", description: "Find JSI prep courses on Udemy — compare coverage against your course", level: "Beginner" },
    { type: "blog", title: "MDN Web Docs — JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", description: "The authoritative JavaScript reference — bookmark for all lectures", level: "Beginner" },
  ],

  // ── L01: Variables, Types & Operators ─────────────────────────────────────
  "jsi-l01": [
    { type: "docs", title: "MDN: var, let, const", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types", description: "MDN reference on variable declarations, hoisting, and scope", level: "Beginner" },
    { type: "docs", title: "MDN: JavaScript Data Types", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures", description: "Complete reference for all JS primitive types and the object type", level: "Beginner" },
    { type: "youtube", title: "JavaScript Variables — Fireship", url: "https://www.youtube.com/watch?v=9emXNzqCKyg", description: "Fireship's concise explainer on var/let/const and temporal dead zone", duration: "10 min" },
    { type: "blog", title: "Nullish Coalescing vs OR Operator — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing", description: "MDN docs on ?? vs || — a common exam topic", level: "Beginner" },
  ],

  // ── L02: Conditionals, Loops & Error Handling ─────────────────────────────
  "jsi-l02": [
    { type: "docs", title: "MDN: Control Flow", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling", description: "MDN guide on if/else, switch, try/catch/finally", level: "Beginner" },
    { type: "docs", title: "MDN: Loops and Iteration", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration", description: "All loop types including for...in vs for...of distinction", level: "Beginner" },
    { type: "docs", title: "MDN: Error Types Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error", description: "All built-in Error subtypes: TypeError, RangeError, ReferenceError, SyntaxError", level: "Intermediate" },
    { type: "youtube", title: "JavaScript Error Handling — Fireship", url: "https://www.youtube.com/watch?v=cFTFtuEQ-10", description: "try/catch patterns, custom errors, and async error handling", duration: "12 min" },
  ],

  // ── L03: Functions ─────────────────────────────────────────────────────────
  "jsi-l03": [
    { type: "docs", title: "MDN: Functions Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", description: "Comprehensive MDN guide — declarations, expressions, arrow functions, closures", level: "Beginner" },
    { type: "docs", title: "MDN: Arrow Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions", description: "Arrow function syntax, implicit return, and the key this-binding difference", level: "Beginner" },
    { type: "youtube", title: "JavaScript Functions — All You Need to Know", url: "https://www.youtube.com/watch?v=gigtS_5KOqo", description: "Covers declarations, expressions, arrow functions, higher-order functions, and closures", duration: "25 min" },
    { type: "docs", title: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "The definitive MDN article on closures — essential for the exam", level: "Intermediate" },
  ],

  // ── L04: Scope, Hoisting & Closures ───────────────────────────────────────
  "jsi-l04": [
    { type: "docs", title: "MDN: JavaScript Scoping", url: "https://developer.mozilla.org/en-US/docs/Glossary/Scope", description: "Global, function, and block scope reference", level: "Beginner" },
    { type: "docs", title: "MDN: Hoisting", url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting", description: "How var declarations and function declarations are hoisted", level: "Intermediate" },
    { type: "youtube", title: "JavaScript Closures Explained — Traversy Media", url: "https://www.youtube.com/watch?v=3a0I8ICR1Vg", description: "Visual walkthrough of closures, factory functions, and the module pattern", duration: "20 min" },
    { type: "docs", title: "MDN: Temporal Dead Zone", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz", description: "TDZ explanation for let and const — common exam trap", level: "Intermediate" },
  ],

  // ── L05: Classes & OOP ────────────────────────────────────────────────────
  "jsi-l05": [
    { type: "docs", title: "MDN: JavaScript Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "Full MDN reference — constructor, methods, static, extends, private fields", level: "Intermediate" },
    { type: "docs", title: "MDN: Private Class Features", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields", description: "#field syntax, private methods, static private — high exam weight", level: "Intermediate" },
    { type: "youtube", title: "JavaScript OOP — The Complete Guide", url: "https://www.youtube.com/watch?v=PFmuCDHHpwk", description: "Classes, inheritance, encapsulation, and polymorphism in JavaScript", duration: "40 min" },
    { type: "docs", title: "MDN: Getters and Setters", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get", description: "get/set accessor syntax in classes and objects", level: "Beginner" },
  ],

  // ── L06: Prototypes & Inheritance ─────────────────────────────────────────
  "jsi-l06": [
    { type: "docs", title: "MDN: Inheritance and the Prototype Chain", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain", description: "The definitive MDN article on prototype chains — required reading", level: "Intermediate" },
    { type: "docs", title: "MDN: Object.create()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create", description: "Prototype-based inheritance without class syntax", level: "Intermediate" },
    { type: "youtube", title: "Prototypes in JavaScript — Fireship", url: "https://www.youtube.com/watch?v=wstwjQ1yqWQ", description: "Visual prototype chain walkthrough — clear and concise", duration: "8 min" },
  ],

  // ── L07: ES Modules ───────────────────────────────────────────────────────
  "jsi-l07": [
    { type: "docs", title: "MDN: JavaScript Modules", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", description: "Complete guide to ES modules — import/export syntax, dynamic import, module scope", level: "Intermediate" },
    { type: "docs", title: "MDN: import statement", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import", description: "All import syntax forms — named, default, namespace, dynamic", level: "Beginner" },
    { type: "youtube", title: "ES Modules Explained — Fireship", url: "https://www.youtube.com/watch?v=cRHQNNcYf6s", description: "ESM vs CommonJS, dynamic imports, and tree shaking explained concisely", duration: "10 min" },
    { type: "docs", title: "LWC: Module System", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.js_modules", description: "How LWC's ES module-based architecture works — direct application of L07 concepts", level: "Intermediate" },
  ],

  // ── L08: Iterators & Generators ───────────────────────────────────────────
  "jsi-l08": [
    { type: "docs", title: "MDN: Iterators and Generators", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators", description: "MDN's comprehensive guide to the iteration protocol and generator functions", level: "Advanced" },
    { type: "docs", title: "MDN: function* (Generator Function)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*", description: "Generator function syntax, yield, and generator object methods", level: "Advanced" },
    { type: "youtube", title: "JavaScript Generators — Fireship", url: "https://www.youtube.com/watch?v=IJ6EgdiI_wU", description: "Generators, Symbol.iterator, and lazy evaluation explained with examples", duration: "12 min" },
  ],

  // ── L09: Collections — Arrays, Map & Set ──────────────────────────────────
  "jsi-l09": [
    { type: "docs", title: "MDN: Array Methods Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", description: "Complete Array API reference — every method with examples", level: "Beginner" },
    { type: "docs", title: "MDN: Map", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", description: "Map reference — when to use Map vs Object", level: "Intermediate" },
    { type: "docs", title: "MDN: Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", description: "Set reference — unique values, O(1) lookup, iteration", level: "Intermediate" },
    { type: "youtube", title: "Array Methods in JavaScript — Traversy Media", url: "https://www.youtube.com/watch?v=R8rmfD9Y5-c", description: "map, filter, reduce, find, sort with practical examples", duration: "25 min" },
  ],

  // ── L10: Async JavaScript & Promises ──────────────────────────────────────
  "jsi-l10": [
    { type: "docs", title: "MDN: Promises", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise", description: "Complete Promise API reference — all combinators and methods", level: "Intermediate" },
    { type: "docs", title: "MDN: async function", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function", description: "async/await syntax, error handling, and common pitfalls", level: "Intermediate" },
    { type: "youtube", title: "JavaScript Promises In 10 Minutes — Web Dev Simplified", url: "https://www.youtube.com/watch?v=DHvZLI7Db8E", description: "Promises, .then/.catch chaining, and async/await explained clearly", duration: "10 min" },
    { type: "youtube", title: "Event Loop — JSConf EU (Philip Roberts)", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ", description: "The best visualized explanation of the JavaScript event loop — required viewing", duration: "26 min" },
  ],

  // ── L11: Browser, DOM & Events ────────────────────────────────────────────
  "jsi-l11": [
    { type: "docs", title: "MDN: DOM Introduction", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction", description: "DOM structure, node types, and traversal methods", level: "Beginner" },
    { type: "docs", title: "MDN: addEventListener", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener", description: "Event listener options, bubbling vs capturing, once option", level: "Beginner" },
    { type: "docs", title: "MDN: Event Bubbling and Capture", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling", description: "Bubbling, capturing, stopPropagation, and event delegation explained", level: "Intermediate" },
    { type: "docs", title: "LWC: Events", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.events", description: "How LWC uses standard DOM events + CustomEvent with bubbles/composed options", level: "Intermediate" },
  ],

  // ── L12: Debugging & Dev Tools ────────────────────────────────────────────
  "jsi-l12": [
    { type: "docs", title: "Chrome DevTools Documentation", url: "https://developer.chrome.com/docs/devtools/", description: "Official Chrome DevTools docs — Sources, Console, Network, Performance panels", level: "Beginner" },
    { type: "docs", title: "MDN: console API", url: "https://developer.mozilla.org/en-US/docs/Web/API/console", description: "All console methods: log, warn, error, table, group, time, assert, trace", level: "Beginner" },
    { type: "youtube", title: "Chrome DevTools Crash Course — Traversy Media", url: "https://www.youtube.com/watch?v=x4q86IjJFag", description: "Complete DevTools walkthrough — debugging, breakpoints, network, performance", duration: "40 min" },
  ],

  // ── L13: Node.js Fundamentals ─────────────────────────────────────────────
  "jsi-l13": [
    { type: "docs", title: "Node.js Documentation", url: "https://nodejs.org/en/docs", description: "Official Node.js API docs — fs, http, path, events modules", level: "Intermediate" },
    { type: "youtube", title: "Node.js Crash Course — Traversy Media", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", description: "Node.js fundamentals including modules, EventEmitter, and http server", duration: "90 min" },
    { type: "docs", title: "npm Documentation", url: "https://docs.npmjs.com/", description: "npm CLI reference — install, scripts, package.json fields", level: "Beginner" },
    { type: "blog", title: "Node.js Event Loop — Official Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", description: "Official Node.js event loop phases guide — timers, poll, check, close callbacks", level: "Advanced" },
  ],

  // ── L14: Testing with Jest ────────────────────────────────────────────────
  "jsi-l14": [
    { type: "docs", title: "Jest Documentation", url: "https://jestjs.io/docs/getting-started", description: "Official Jest docs — getting started, matchers, mocking, async testing", level: "Intermediate" },
    { type: "docs", title: "Jest Expect API", url: "https://jestjs.io/docs/expect", description: "Complete matcher reference — toBe, toEqual, toThrow, toHaveBeenCalledWith, etc.", level: "Beginner" },
    { type: "youtube", title: "Jest Crash Course — Traversy Media", url: "https://www.youtube.com/watch?v=7r4xVDI2vho", description: "Unit testing with Jest — describe, test, expect, mocks, async tests", duration: "45 min" },
    { type: "docs", title: "Jest Mock Functions", url: "https://jestjs.io/docs/mock-functions", description: "jest.fn(), mockReturnValue, mockResolvedValue, and module mocking", level: "Intermediate" },
  ],

  // ── L15: TypeScript Basics ────────────────────────────────────────────────
  "jsi-l15": [
    { type: "docs", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", description: "Official TypeScript handbook — types, interfaces, generics, utility types", level: "Intermediate" },
    { type: "docs", title: "TypeScript Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", description: "Partial, Required, Readonly, Pick, Omit, Record — high exam relevance", level: "Intermediate" },
    { type: "youtube", title: "TypeScript Crash Course — Traversy Media", url: "https://www.youtube.com/watch?v=BCg4U1FzODs", description: "TypeScript basics in 90 minutes — types, interfaces, classes, generics", duration: "90 min" },
    { type: "udemy", title: "TypeScript — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=typescript+complete+course&sort=highest-rated", description: "Top-rated TypeScript courses on Udemy for deeper TypeScript preparation", level: "Intermediate" },
  ],

  // ── L16: Design Patterns ──────────────────────────────────────────────────
  "jsi-l16": [
    { type: "docs", title: "JavaScript Design Patterns — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises", description: "MDN section on common JavaScript patterns including Promise patterns", level: "Intermediate" },
    { type: "youtube", title: "JavaScript Design Patterns — Fireship", url: "https://www.youtube.com/watch?v=tv-_1er1mWI", description: "10 design patterns every JavaScript developer should know", duration: "14 min" },
    { type: "blog", title: "Learning JavaScript Design Patterns — Addy Osmani", url: "https://www.patterns.dev/vanilla", description: "Free online book on JavaScript design patterns — Module, Observer, Factory, Singleton, etc.", level: "Advanced" },
  ],

  // ── L17: Advanced Functions ───────────────────────────────────────────────
  "jsi-l17": [
    { type: "docs", title: "MDN: Function.prototype.bind()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind", description: "bind(), call(), apply() — explicit this binding reference", level: "Intermediate" },
    { type: "docs", title: "MDN: this keyword", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this", description: "this in different contexts — global, method, constructor, arrow function", level: "Intermediate" },
    { type: "youtube", title: "call, apply, bind — JavaScript — Techsith", url: "https://www.youtube.com/watch?v=c0mLRpw-9rI", description: "Clear visual explanation of call/apply/bind with practical examples", duration: "15 min" },
  ],

  // ── L18: Modern JS Features ───────────────────────────────────────────────
  "jsi-l18": [
    { type: "docs", title: "MDN: Proxy", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy", description: "Proxy and Reflect objects — intercept object operations", level: "Advanced" },
    { type: "docs", title: "MDN: Symbol", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol", description: "Symbol as unique keys, well-known symbols (Symbol.iterator, Symbol.toPrimitive)", level: "Intermediate" },
    { type: "docs", title: "TC39 Proposals — JavaScript Features", url: "https://github.com/tc39/proposals", description: "Active JavaScript language proposals — see what's coming to the language", level: "Advanced" },
  ],

  // ── L19: LWC JavaScript ───────────────────────────────────────────────────
  "jsi-l19": [
    { type: "docs", title: "LWC Developer Guide", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc", description: "Complete LWC developer reference — all decorators, lifecycle, events, wire service", level: "Intermediate" },
    { type: "docs", title: "LWC: Decorators (@api, @wire, @track)", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reactivity_decorators", description: "Official docs on all three LWC decorators — exam-critical topic", level: "Intermediate" },
    { type: "docs", title: "LWC: Lifecycle Hooks", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_lifecycle_hooks", description: "connectedCallback, disconnectedCallback, renderedCallback, errorCallback reference", level: "Intermediate" },
    { type: "trailhead", title: "Lightning Web Components Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics", description: "Official LWC Trailhead module — complete this before recording L19", duration: "~3 hr", level: "Beginner" },
    { type: "docs", title: "LWC: Custom Events", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.events_custom", description: "CustomEvent creation, dispatch, bubbles, composed — parent-child communication", level: "Intermediate" },
    { type: "blog", title: "LWC GitHub Recipes — Salesforce", url: "https://github.com/trailheadapps/lwc-recipes", description: "Official Salesforce LWC code examples — browse for wire service and event patterns", level: "Intermediate" },
  ],

  // ── L20: Performance & Security ───────────────────────────────────────────
  "jsi-l20": [
    { type: "docs", title: "MDN: Content Security Policy", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP", description: "CSP directives, script-src, unsafe-eval, nonce — web security fundamentals", level: "Intermediate" },
    { type: "docs", title: "MDN: Performance API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Performance", description: "performance.now(), mark/measure User Timing API reference", level: "Intermediate" },
    { type: "docs", title: "OWASP XSS Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", description: "XSS prevention guide — innerHTML vs textContent, sanitization, CSP", level: "Intermediate" },
    { type: "youtube", title: "JavaScript Security — Web Dev Simplified", url: "https://www.youtube.com/watch?v=1_2kO2xyqps", description: "XSS, eval risks, and Content Security Policy explained for developers", duration: "15 min" },
  ],

  // ── Labs ───────────────────────────────────────────────────────────────────
  "jsi-lab01": [
    { type: "docs", title: "MDN: localStorage", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage", description: "localStorage API reference — getItem, setItem, removeItem", level: "Beginner" },
    { type: "docs", title: "MDN: Private Class Fields", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields", description: "Reference for # private field syntax used in the Todo class", level: "Intermediate" },
  ],
  "jsi-lab02": [
    { type: "docs", title: "MDN: Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", description: "fetch() usage, response.ok, error handling — Lab 02 foundation", level: "Beginner" },
    { type: "docs", title: "JSONPlaceholder API", url: "https://jsonplaceholder.typicode.com/", description: "Free fake REST API used in Lab 02 — no auth required, good for testing", level: "Beginner" },
    { type: "docs", title: "MDN: AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController", description: "Abort fetch requests with timeout — Lab 02 stretch challenge", level: "Intermediate" },
  ],
  "jsi-lab03": [
    { type: "docs", title: "Node.js http Module", url: "https://nodejs.org/api/http.html", description: "Built-in http module reference used in Lab 03 server", level: "Intermediate" },
    { type: "docs", title: "Jest — Getting Started", url: "https://jestjs.io/docs/getting-started", description: "Jest setup and test file structure — Lab 03 test foundation", level: "Beginner" },
    { type: "docs", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", description: "TypeScript reference for Lab 03 stretch challenge", level: "Intermediate" },
  ],

  // ── Exam Prep ──────────────────────────────────────────────────────────────
  "jsi-exam": [
    { type: "trailhead", title: "JavaScript Developer I Exam Guide", url: "https://trailhead.salesforce.com/credentials/javascriptdeveloperi", description: "Official exam guide — topic weights, sample questions, registration link", level: "Beginner" },
    { type: "udemy", title: "JSI Practice Tests — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+javascript+developer+1+certification&sort=highest-rated", description: "Find JSI practice exam courses on Udemy — drill weak areas before exam day", level: "Beginner" },
    { type: "docs", title: "MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference", description: "The complete JavaScript language reference — verify any concept you're unsure about", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — JSI Exam Tips", url: "https://www.youtube.com/@salesforceben", description: "Check Salesforce Ben's YouTube for JSI-specific exam tips and walkthroughs", duration: "Various" },
  ],
  "jsi-cheatsheet": [
    { type: "trailhead", title: "JavaScript Developer I Exam Guide", url: "https://trailhead.salesforce.com/credentials/javascriptdeveloperi", description: "Official exam objectives — the source of truth for your cheat sheet", level: "Beginner" },
    { type: "docs", title: "MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference", description: "Quick lookup for any syntax or API mentioned in the cheat sheet", level: "Beginner" },
    { type: "udemy", title: "JSI Certification Prep — Search on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+javascript+developer+1+certification&sort=highest-rated", description: "Practice tests to verify cheat sheet coverage before exam day", level: "Beginner" },
  ],
};
