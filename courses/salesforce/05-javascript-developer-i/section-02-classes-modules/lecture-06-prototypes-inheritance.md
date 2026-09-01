# Lecture 06: Prototypes and Prototype-Based Inheritance

## Learning Objectives
- Explain the prototype chain: what `[[Prototype]]`, `__proto__`, and `Object.getPrototypeOf()` mean and how they differ
- Use `Object.create()` to set up prototype-based inheritance without class syntax
- Distinguish between own properties and inherited properties using `hasOwnProperty()`
- Trace the prototype chain lookup sequence step-by-step for any property access
- Implement the mixins pattern to simulate multiple inheritance in JavaScript
- Identify `Function.prototype` and `Object.prototype` as the top-level anchors of every prototype chain

## Slides

### Slide 1: What Is a Prototype?
**Visual:** Memory diagram showing three connected boxes: an object instance `dog` with own properties (`name: 'Rex'`, `breed: 'Lab'`), an arrow labeled `[[Prototype]]` pointing to `Dog.prototype` (containing `speak()`), and another arrow from `Dog.prototype` pointing to `Object.prototype` (containing `toString()`, `hasOwnProperty()`, etc.). A final arrow from `Object.prototype` points to `null`.
**Content:**
- Every JavaScript object has an internal `[[Prototype]]` slot — a reference to another object or `null`
- When a property is not found on an object, the engine looks at `[[Prototype]]`, then its `[[Prototype]]`, and so on — this chain is called the **prototype chain**
- The chain ends at `Object.prototype`, whose `[[Prototype]]` is `null`
- **Three ways to access/inspect `[[Prototype]]`:**
  1. `Object.getPrototypeOf(obj)` — standard, recommended
  2. `obj.__proto__` — legacy, deprecated but widely supported
  3. `Object.prototype.isPrototypeOf(obj)` — checks membership in chain
- `null` as a prototype creates a "bare" object: `Object.create(null)` — no inherited methods
**Speaker Notes:** The prototype chain is the single most important concept for understanding how JavaScript objects actually work. When you write `dog.speak()`, the engine first looks on the `dog` object itself — no `speak` found. It then follows the `[[Prototype]]` link to `Dog.prototype` — `speak` found, execute it. If it weren't there either, the engine would continue to `Object.prototype`, then reach `null` and throw a TypeError. This lookup is automatic, transparent, and happens on every single property access in JavaScript. Understanding it deeply will help you reason about class inheritance, mixins, and any "why does this work?" question you encounter.

### Slide 2: __proto__, Object.getPrototypeOf(), and the Standard API
**Visual:** Two code panels side by side: left shows `obj.__proto__` with a red "deprecated" badge; right shows `Object.getPrototypeOf(obj)` with a green "use this" badge. Below, a table lists three prototype-related APIs: `Object.getPrototypeOf()`, `Object.setPrototypeOf()`, and `Object.create()` with a one-line description of each.
**Content:**
- `__proto__` is a legacy accessor property defined on `Object.prototype` — works everywhere but is deprecated
- `Object.getPrototypeOf(obj)` — returns `[[Prototype]]` of `obj`, or `null` if no prototype
- `Object.setPrototypeOf(obj, proto)` — mutates the prototype chain at runtime; avoid in performance-critical code
- `Object.create(proto)` — creates a new object with `proto` as its `[[Prototype]]`; the right tool for prototype-based inheritance
```js
const animal = { type: 'Animal', describe() { return this.type; } };
const dog = Object.create(animal);
dog.breed = 'Labrador';

Object.getPrototypeOf(dog) === animal;   // true
dog.describe();                          // 'Animal' — found on animal via prototype chain
dog.hasOwnProperty('breed');             // true
dog.hasOwnProperty('describe');          // false — inherited, not own
```
**Speaker Notes:** The exam tests `Object.getPrototypeOf()` vs `__proto__` awareness. Always prefer `Object.getPrototypeOf()` in written code. For the exam, know that `__proto__` and `Object.getPrototypeOf()` return the same thing, but `__proto__` is an instance-level accessor while `getPrototypeOf` is a clean static method. `Object.setPrototypeOf()` is explicitly called out in MDN and specs as a performance hazard because changing the prototype of an existing object can deoptimize the engine's hidden class system. In practice, set up the prototype chain at object creation time with `Object.create()` or classes.

### Slide 3: Object.create() for Prototype-Based Inheritance
**Visual:** Step-by-step diagram: step 1 creates an `animal` object with a `speak()` method. Step 2 shows `Object.create(animal)` creating `dog` with `animal` as `[[Prototype]]`. Step 3 shows adding `dog.name = 'Rex'` as an own property. Final state: `dog` object with its own `name` property, linked to `animal`'s `speak()` via the prototype chain.
**Content:**
- `Object.create(proto)` creates a new object with `proto` as its `[[Prototype]]`
- The new object has no own properties initially — purely inherits from `proto`
- Pass a property descriptor map as the second argument to add own properties at creation time
- `Object.create(null)` — creates a prototype-less object (pure hash map, no inherited methods)
- This is the pre-ES6 way to implement inheritance; class syntax compiles to the same structure
```js
const vehicleProto = {
  describe() {
    return `${this.make} ${this.model} (${this.year})`;
  },
  start() { return `${this.make} engine starts`; }
};

const car = Object.create(vehicleProto);
car.make = 'Toyota';
car.model = 'Camry';
car.year = 2023;

car.describe();  // 'Toyota Camry (2023)'
Object.getPrototypeOf(car) === vehicleProto;  // true

// With property descriptors:
const truck = Object.create(vehicleProto, {
  make: { value: 'Ford', writable: true, enumerable: true, configurable: true }
});
```
**Speaker Notes:** `Object.create()` is the foundational primitive that `class extends` uses internally. Knowing it proves you understand the prototype system at a deeper level than just the class syntax. The `null` prototype case — `Object.create(null)` — is particularly important in security-sensitive code. A plain object `{}` inherits from `Object.prototype`, which means it has `toString`, `valueOf`, `hasOwnProperty`, etc. If you are using an object as a dictionary and a user could provide keys, they could potentially shadow these inherited methods. `Object.create(null)` eliminates that risk.

### Slide 4: hasOwnProperty() vs Inherited Properties
**Visual:** Table with three columns: property name, `in` operator result, `hasOwnProperty()` result, and "where it lives." Rows show: own data property (true/true/own), inherited method (true/false/prototype), non-existent property (false/false/—). A code snippet below demonstrates each case with a concrete object.
**Content:**
- **`obj.hasOwnProperty(key)`** — returns `true` only if the property exists directly on `obj`, not in the chain
- **`key in obj`** — returns `true` if the property exists anywhere in the chain (own or inherited)
- **`for...in` loop** — iterates all enumerable properties, including inherited ones
- Use `Object.keys(obj)` for only own enumerable string-keyed properties
- Use `Object.getOwnPropertyNames(obj)` for own properties including non-enumerable ones
```js
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = new Person('Alice');

alice.hasOwnProperty('name');    // true  — own property
alice.hasOwnProperty('greet');   // false — on prototype
'greet' in alice;                // true  — found in chain
'toString' in alice;             // true  — from Object.prototype

Object.keys(alice);              // ['name'] — own enumerable only
for (let k in alice) console.log(k); // 'name', 'greet' — includes inherited enumerable
```
**Speaker Notes:** The distinction between `hasOwnProperty()` and the `in` operator is a classic interview and exam question. The for...in iteration including inherited enumerable properties is a historical source of bugs — if someone adds an enumerable property to `Object.prototype` (a terrible practice called "prototype pollution"), it shows up in every for...in loop across your codebase. That is one reason why `Object.keys()` is preferred over for...in for iterating objects, and why the `hasOwnProperty()` check is sometimes added inside for...in loops as a guard. Modern JavaScript also provides `Object.hasOwn(obj, key)` as a static alternative that is not vulnerable to overriding `hasOwnProperty` on the object itself.

### Slide 5: Prototype Chain Lookup Sequence
**Visual:** Animated-style flow diagram showing property lookup steps: (1) Check the object itself → found? return. Not found? (2) Follow `[[Prototype]]` to next object → found? return. Not found? (3) Continue up chain. (4) Reach `Object.prototype` → found? return. Not found? (5) `[[Prototype]]` is `null` → return `undefined`. A concrete example traces `dog.toString()` through each step.
**Content:**
- Property access `obj.prop` triggers this lookup sequence every time:
  1. Does `obj` have an own property `prop`? If yes, return it.
  2. Follow `[[Prototype]]` to the next object in the chain
  3. Repeat until the property is found or `null` is reached
  4. If `null` reached without finding the property, return `undefined` (for reads) or throw a TypeError (for method calls)
- **Shadowing:** If an object has an own property with the same name as an inherited one, the own property shadows the prototype's property
- Method calls follow the same chain — `this` is always the original object, not the prototype
```js
class A { foo() { return 'A.foo'; } }
class B extends A { bar() { return 'B.bar'; } }
class C extends B { foo() { return 'C.foo (shadows A.foo)'; } }

const c = new C();
c.foo();  // 'C.foo (shadows A.foo)' — found on C.prototype, A.foo shadowed
c.bar();  // 'B.bar' — not on C.prototype, found on B.prototype
c.toString(); // '[object Object]' — found on Object.prototype
```
**Speaker Notes:** The shadowing concept is subtle but important. When `C` defines its own `foo()`, it does not delete or modify `A.foo()` — `A.foo()` still exists on `A.prototype`. It's just that the lookup finds `C.prototype.foo` first and stops there. You can still call `A.foo()` explicitly with `super.foo()` from within `C`. The `this` binding rule is critical here: when you call `c.bar()`, JavaScript finds `bar` on `B.prototype`, but `this` inside `bar` still refers to `c`, not to some instance of `B`. This is what allows inherited methods to work with the actual instance's data.

### Slide 6: Mixins — Simulating Multiple Inheritance
**Visual:** Diagram showing the problem: a `Dog` class cannot extend both `Animal` and `Pet` in JavaScript (single inheritance only). Solution shown: two mixin functions `Swimmable` and `Runnable` that copy methods onto a class's prototype. Arrow shows the resulting class having methods from all three sources.
**Content:**
- JavaScript supports **single prototype chain** only — a class can only `extends` one parent
- **Mixin pattern:** copy methods from multiple source objects onto a target prototype
- Common implementation: a factory function that takes a superclass and returns a new class
- `Object.assign(Target.prototype, MixinA, MixinB)` — simple property-copying approach
- Mixins do not create a prototype relationship — `instanceof` tests against mixin sources return `false`
```js
// Simple mixin objects
const Serializable = {
  serialize() { return JSON.stringify(this); },
  deserialize(json) { return Object.assign(this, JSON.parse(json)); }
};

const Validatable = {
  validate() { return Object.keys(this).every(k => this[k] !== null); }
};

class User {
  constructor(name, email) { this.name = name; this.email = email; }
}

// Mix in methods from both objects
Object.assign(User.prototype, Serializable, Validatable);

const u = new User('Alice', 'alice@example.com');
u.serialize();  // '{"name":"Alice","email":"alice@example.com"}'
u.validate();   // true

u instanceof User; // true
// but: 'Serializable' instanceof check — not possible; mixin is a plain object
```
**Speaker Notes:** Mixins are the idiomatic JavaScript solution to the "diamond problem" that multiple inheritance creates in other languages. Because JavaScript has no multiple inheritance, you sidestep the entire conflict-resolution problem. The tradeoff is that mixins via `Object.assign` are flat copies — they land directly on the target prototype rather than creating a chain. This means if a mixin method calls `this.someOtherMixinMethod()`, you have to be careful that both mixins are applied. A more powerful pattern uses higher-order class expressions — `const Serializable = (Base) => class extends Base { serialize() { ... } }` — which preserves the prototype chain and allows mixins to call `super`. That pattern appears in some LWC utility code and is fair game for JSI exam questions.

### Slide 7: Function.prototype and Object.prototype
**Visual:** Full prototype chain diagram from a function object: `myFn` → `Function.prototype` (contains `call`, `apply`, `bind`, `toString`) → `Object.prototype` (contains `hasOwnProperty`, `toString`, `valueOf`, `isPrototypeOf`) → `null`. A separate chain shows an array object: `[]` → `Array.prototype` → `Object.prototype` → `null`. Both chains converge at `Object.prototype`.
**Content:**
- **`Object.prototype`** is at the top of every object's prototype chain (unless `Object.create(null)` was used)
- Provides universal methods: `hasOwnProperty()`, `toString()`, `valueOf()`, `isPrototypeOf()`, `propertyIsEnumerable()`
- **`Function.prototype`** is the prototype of every function — provides `call()`, `apply()`, `bind()`
- Every function is also an object → function's chain: function → `Function.prototype` → `Object.prototype` → `null`
- **`Array.prototype`** provides array methods (`map`, `filter`, `forEach`) — all arrays inherit these
- `Object.prototype.toString.call(value)` — reliable type tag: `'[object Array]'`, `'[object Null]'`, etc.
```js
function greet() { return 'hello'; }

Object.getPrototypeOf(greet) === Function.prototype;     // true
Object.getPrototypeOf(Function.prototype) === Object.prototype; // true

// Function.prototype methods on every function:
greet.call(null);    // 'hello'
greet.apply(null);   // 'hello'
const bound = greet.bind(null);

// Type checking via Object.prototype.toString:
Object.prototype.toString.call([]);     // '[object Array]'
Object.prototype.toString.call(null);   // '[object Null]'
Object.prototype.toString.call(/re/);   // '[object RegExp]'
```
**Speaker Notes:** `Object.prototype` being at the top of every chain is why all objects "magically" have `toString()`, `valueOf()`, and `hasOwnProperty()` — they inherited them. Understanding `Function.prototype` explains why `call`, `apply`, and `bind` are available on every function — they are inherited methods. The `Object.prototype.toString.call(value)` trick is the most reliable type-checking mechanism in JavaScript, more accurate than `typeof` (which returns `'object'` for `null`, arrays, and regex). This precise type checking is used internally by many libraries and is worth knowing for the exam.

## Recording Script
Welcome to Lecture 6: Prototypes and Prototype-Based Inheritance. This lecture takes you under the hood of JavaScript's object system — the foundation that ES6 classes are built on top of.

Every object in JavaScript has a hidden internal slot called `[[Prototype]]`. It is a reference to another object, or null. When you access a property on an object, JavaScript first looks on the object itself. If not found, it follows the `[[Prototype]]` reference to the next object and looks there. It keeps climbing until it either finds the property or reaches null at the end of the chain. That chain of linked objects is the prototype chain.

You can read an object's `[[Prototype]]` with `Object.getPrototypeOf(obj)`. The legacy `__proto__` property does the same thing but is deprecated — use `Object.getPrototypeOf` in your code. You can create an object with a specific prototype using `Object.create(proto)` — this gives you explicit control over the chain without using class syntax.

Let's talk about own versus inherited properties. `obj.hasOwnProperty(key)` returns true only if the property is directly on the object — not if it came from a prototype. The `in` operator returns true for properties anywhere in the chain. This distinction matters in for...in loops, which iterate all enumerable properties including inherited ones. For iterating only own properties, use `Object.keys()`.

Property lookup follows a strict sequence. Look on the object. Not found — follow `[[Prototype]]`. Not found — keep going. Reach `Object.prototype`. Not found — reach null — return undefined. If you called it as a method, you get a TypeError instead. Shadowing happens when an object has an own property with the same name as an inherited one — the own property wins, and the inherited one is hidden, though not deleted.

JavaScript only supports single prototype inheritance — a class can only extend one parent. For combining behavior from multiple sources, we use the mixin pattern: copying methods from plain objects onto a class's prototype using `Object.assign(Target.prototype, MixinA, MixinB)`. This is not a real prototype relationship — instanceof checks against the mixin sources fail — but it puts the methods on the prototype where they can be called on instances.

At the top of every prototype chain sits `Object.prototype`, which is why every object has `toString()`, `hasOwnProperty()`, and `valueOf()`. Functions also inherit from `Function.prototype`, which is where `call()`, `apply()`, and `bind()` come from. Both `Function.prototype` and all other prototypes eventually link up to `Object.prototype` before ending at null.

The key takeaway for the exam: JavaScript objects do not copy behavior — they link to it. That linking is the prototype chain. Classes use it automatically via `extends`. `Object.create()` sets it up manually. And every property lookup in the entire language goes through this chain.

In the next lecture, we move on to ES Modules — how JavaScript manages code organization across files. See you there.

## Exam Tips
- `Object.getPrototypeOf(obj)` is the standard API; `__proto__` is deprecated but may appear in exam code — they return the same value.
- `hasOwnProperty()` returns `true` only for own properties; the `in` operator includes inherited properties. For...in also includes inherited enumerable properties — use `Object.keys()` to get only own enumerable properties.
- `Object.create(null)` creates an object with no prototype — no `toString()`, no `hasOwnProperty()`, no inherited methods at all. Used for pure hash maps.
- Shadowing: an own property always wins over a same-named prototype property. `super.method()` is the only way to reach a shadowed prototype method.
- Mixins via `Object.assign(Target.prototype, Mixin)` copy methods to the prototype but do NOT create an instanceof relationship with the mixin source.
- `typeof SomeClass === 'function'` — classes are constructor functions with `.prototype` set up. `Object.getPrototypeOf(Dog.prototype) === Animal.prototype` is `true` for `class Dog extends Animal`.
- Exam weight: part of the Classes domain at approximately 15%.

## Lecture Summary
JavaScript's prototype chain is the core mechanism for property lookup and inheritance: every object has a `[[Prototype]]` slot pointing to another object or `null`, and property access walks this chain until the property is found or `null` is reached. `Object.getPrototypeOf()` reads the prototype; `Object.create(proto)` creates an object with a specific prototype. Own properties (visible via `hasOwnProperty()`) shadow inherited ones; the `in` operator and for...in include inherited properties while `Object.keys()` does not. The mixin pattern uses `Object.assign` to copy methods onto a prototype, enabling multi-source composition without multiple prototype chains. All chains converge at `Object.prototype`, whose own prototype is `null`, providing universal methods like `toString()` and `hasOwnProperty()`.

## Mini Quiz

**Q1:** What does `Object.create(null)` return, and how does it differ from `{}`?
A) It returns `null`
B) It returns an empty object identical to `{}`
C) It returns an object with no `[[Prototype]]` — it has no inherited methods like `toString()` or `hasOwnProperty()`
D) It returns an object whose prototype is `Function.prototype`
**Answer:** C — `Object.create(null)` creates an object whose `[[Prototype]]` is explicitly `null`, meaning it has no prototype chain at all. Unlike `{}`, which inherits from `Object.prototype`, this object has no `toString`, `hasOwnProperty`, or any other inherited methods. It is used as a safe dictionary when you cannot risk inherited property names interfering with keys.

**Q2:** Given `const b = Object.create(a)` where `a = { x: 1 }`, what does `b.hasOwnProperty('x')` return?
A) `true`, because `x` is accessible on `b`
B) `false`, because `x` is on `a` (the prototype of `b`), not on `b` itself
C) A TypeError, because `b` has no prototype
D) `undefined`
**Answer:** B — `x` lives on `a`, which is `b`'s prototype. `b` itself has no own properties after `Object.create(a)`. `b.hasOwnProperty('x')` returns `false` because `hasOwnProperty` only counts own properties. However, `'x' in b` would return `true` because the `in` operator searches the prototype chain.

**Q3:** Which of the following is true about `Function.prototype`?
A) It is the prototype of all objects
B) It is the prototype of all functions, and it inherits from `Object.prototype`
C) It is the prototype only of arrow functions
D) It is `null` for functions created with the `function` keyword
**Answer:** B — Every function in JavaScript (function declarations, function expressions, arrow functions, class constructors) has `Function.prototype` as its `[[Prototype]]`. `Function.prototype` itself inherits from `Object.prototype`, which is why functions also have methods like `toString()`. `Function.prototype` is where `call()`, `apply()`, and `bind()` live, making them available on every function.
