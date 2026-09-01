# Lecture 05: Classes and Object-Oriented Programming

## Learning Objectives
- Write ES6 class declarations with constructors and instance methods using the correct syntax
- Define and call static methods and static properties on a class without instantiating it
- Implement inheritance with `extends` and `super()` in both constructors and overridden methods
- Declare private fields using the `#field` syntax and expose controlled access with getters and setters
- Create class expressions for anonymous or named runtime-defined classes
- Explain how ES6 classes are syntactic sugar over JavaScript's prototype system

## Slides

### Slide 1: ES6 Class Declaration and Constructor
**Visual:** Split panel: left side shows old-style constructor function (`function Animal(name) { this.name = name; }`), right side shows the equivalent ES6 class. Annotations highlight the `class` keyword, `constructor` method, and `new` keyword at instantiation. A note reads: "Same prototype chain, cleaner syntax."
**Content:**
- **Class declaration:** `class ClassName { ... }`
- The `constructor` method runs automatically when `new ClassName()` is called
- Only one `constructor` per class — defining two is a SyntaxError
- `this` inside the class body refers to the new instance being created
- Classes are **not hoisted** like function declarations — you cannot use a class before its definition
- Class bodies run in **strict mode** automatically
```js
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
}
const dog = new Animal('Rex', 'woof');
console.log(dog.name); // 'Rex'
```
**Speaker Notes:** The ES6 class syntax was introduced to make object-oriented code more readable and approachable for developers coming from Java or C#. Critically, it does not introduce a new object model — JavaScript still uses prototypes under the hood. Every method defined inside the class body goes on the prototype, not on the instance itself. The constructor is the initializer: it runs once per `new` call and sets up instance properties. If you forget `new` and just call `Animal('Rex', 'woof')`, you get a TypeError in strict mode — which is actually a safety feature of classes over old-style constructor functions.

### Slide 2: Instance Methods and Static Members
**Visual:** Diagram showing two boxes: one labeled "instance (dog)" with instance properties (`name`, `sound`) and a dashed arrow pointing up to the "Animal.prototype" box containing the `speak()` method. A separate box off to the right shows `Animal.kingdom` and `Animal.create()` floating directly on the class constructor, labeled "static — not on prototype or instance."
**Content:**
- **Instance methods:** defined in the class body, placed on `ClassName.prototype`
- All instances share the same prototype method — memory-efficient
- **Static methods:** `static methodName() {}` — called on the class itself, not instances
- **Static properties:** `static propName = value` — class-level data, not per-instance
- Accessing a static on an instance returns `undefined` — exam trap
```js
class Animal {
  constructor(name) { this.name = name; }

  speak() {                             // instance method
    return `${this.name} makes a sound`;
  }

  static create(name) {                 // static factory method
    return new Animal(name);
  }

  static kingdom = 'Animalia';         // static property
}

const cat = Animal.create('Whiskers');
console.log(Animal.kingdom);   // 'Animalia'
console.log(cat.kingdom);      // undefined — not on instance
cat.speak();                   // works — found via prototype
```
**Speaker Notes:** Static methods are extremely common as factory methods, utility helpers, or configuration holders. You'll see them used in LWC utility classes all the time. The key exam distinction: `Animal.create()` works, but `cat.create()` throws a TypeError because `create` is not on the instance or its prototype chain — it lives directly on the constructor function object. Static properties declared with the `static` keyword and class fields syntax are a slightly newer addition (ES2022 class fields), but they are part of the JSI exam scope.

### Slide 3: Inheritance with extends and super
**Visual:**
```
  ┌──────────────────────────────┐
  │  Animal                      │
  │  constructor(name)           │
  │  speak()                     │
  └──────────────┬───────────────┘
                 │ extends
                 ▼
  ┌──────────────────────────────┐
  │  Dog                         │
  │  constructor(name, breed)    │
  │    super(name)  ◀── must be  │
  │                    first!    │
  │  speak()  ← overrides parent │
  │    super.speak()  ◀── calls  │
  │            Animal.speak()    │
  └──────────────────────────────┘

  new Dog() instanceof Dog    → true
  new Dog() instanceof Animal → true
```
**Content:**
- `extends` creates a subclass that inherits all methods from the parent
- Subclass **must** call `super()` before accessing `this` in its constructor — ReferenceError otherwise
- `super(args)` in constructor calls the parent constructor
- `super.method()` in an instance method calls the parent's version of that method
- Child can **override** parent methods by redefining them
- `instanceof` checks the prototype chain: `new Dog() instanceof Animal` is `true`
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);                   // must come first
    this.breed = breed;
  }
  speak() {
    return super.speak() + ' — woof!';  // calls Animal.speak
  }
}

const d = new Dog('Rex', 'Lab');
d.speak(); // 'Rex makes a sound — woof!'
d instanceof Dog;    // true
d instanceof Animal; // true
```
**Speaker Notes:** The `super()` requirement in subclass constructors is one of the most commonly tested points on the exam. If a subclass defines a constructor and you reference `this` before calling `super()`, you get a ReferenceError at runtime: "Must call super constructor in derived class before accessing 'this'." If the subclass has no constructor at all, the parent's constructor is called implicitly — that's perfectly valid. The `super.method()` call is useful when you want to extend (not replace) the parent behavior, as shown in this speak() override.

### Slide 4: Private Fields and Getters/Setters
**Visual:** Two-panel code comparison: left shows the old underscore convention (`this._balance`) with a comment "not actually private, just convention"; right shows the `#balance` syntax with the comment "truly private — SyntaxError to access outside class." Below, a getter/setter pair is shown with annotations pointing out the `get` and `set` keywords.
**Content:**
- **Private fields** use the `#` prefix — declared at the top of the class body
- Accessing a private field from outside the class throws a SyntaxError (parse time)
- Private fields must be declared before use; cannot be added dynamically
- **Getters:** `get propName() { return ...; }` — accessed like a property, not called
- **Setters:** `set propName(value) { ... }` — assigned like a property, runs validation
- Getters/setters allow controlled read/write access to private state
```js
class BankAccount {
  #balance = 0;                  // private field declaration

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  get balance() {                // getter — read-only access
    return this.#balance;
  }

  set balance(val) {             // setter — with validation
    if (val >= 0) this.#balance = val;
  }
}

const acct = new BankAccount();
acct.deposit(100);
console.log(acct.balance);     // 100 (via getter)
acct.balance = 200;            // uses setter
console.log(acct.#balance);   // SyntaxError
```
**Speaker Notes:** Private fields with `#` are a significant improvement over the old underscore convention. The underscore was a social contract — nothing stopped another developer from reading `obj._balance`. With `#`, the JavaScript engine itself enforces privacy; there is no way to access `#balance` from outside the class, not even with bracket notation or Proxy objects. One nuance: private fields are per-class, not per-instance hierarchy. A parent's private field is not accessible in the subclass. Getters and setters without backing storage are useful for computed properties — a getter that returns a derived value rather than a stored field.

### Slide 5: Class Expressions
**Visual:** Code snippet showing three forms side by side: (1) class declaration (named, hoisted to block scope), (2) anonymous class expression assigned to a variable, (3) named class expression where the name is only visible inside the class body. Each has a "use case" label below it.
**Content:**
- Class expressions assign a class to a variable — useful for dynamic class creation
- **Anonymous:** `const MyClass = class { ... };`
- **Named:** `const MyClass = class InternalName { ... };` — `InternalName` only visible inside the class body
- Unlike class declarations, class expressions follow the same temporal dead zone rules as `let`/`const`
- Can be returned from functions, passed as arguments — classes are first-class values
- Can be used to create a class and immediately instantiate it: `new (class { ... })()`
```js
// Anonymous class expression
const Counter = class {
  #count = 0;
  increment() { this.#count++; }
  get value() { return this.#count; }
};

// Factory returning a class
function createValidator(rules) {
  return class {
    validate(data) { return rules.every(r => r(data)); }
  };
}

const NumValidator = createValidator([n => typeof n === 'number', n => n > 0]);
const v = new NumValidator();
v.validate(5);  // true
```
**Speaker Notes:** Class expressions are less common in day-to-day code but appear in advanced patterns like class factories, mixins, and decorator implementations. The key point for the exam is that class expressions are valid JavaScript — a class is just a special kind of function value. `typeof MyClass` returns `'function'` regardless of whether it was declared with a class declaration or expression. The immediately-invoked class expression pattern (`new (class { ... })()`) sometimes appears in test code and library internals to create a one-off object with class features without polluting the namespace.

### Slide 6: The Prototype Chain — Classes as Syntactic Sugar
**Visual:**
```
  instance d          Dog.prototype       Animal.prototype    Object.prototype
  ┌────────────┐      ┌─────────────┐     ┌──────────────┐   ┌──────────────┐
  │ name: 'Rex'│      │ bark()      │     │ speak()      │   │ toString()   │
  │ breed: 'Lab│ ───► │ constructor │───► │ constructor  │──►│ hasOwnProp.. │
  └────────────┘      └─────────────┘     └──────────────┘   └──────┬───────┘
  [[Prototype]]        [[Prototype]]        [[Prototype]]            │
                                                                     ▼
                                                                    null

  Property lookup: d.speak()
  → not on d → not on Dog.prototype → found on Animal.prototype ✓

  typeof Dog === 'function'  ← classes are constructor functions
```
**Content:**
- Classes do NOT introduce a new object system — they compile to prototype-based code
- Every class is a constructor function: `typeof Animal === 'function'`
- Methods defined in a class body are placed on `ClassName.prototype`
- `extends` sets `SubClass.prototype.__proto__ = ParentClass.prototype`
- Property lookup walks up the chain: instance → its prototype → parent prototype → Object.prototype → null
- `Object.getPrototypeOf(instance)` — preferred over `__proto__` (deprecated)
- `Object.getPrototypeOf(Dog.prototype) === Animal.prototype` — verifies inheritance chain
```js
class Animal { speak() { return 'sound'; } }
class Dog extends Animal { bark() { return 'woof'; } }

const d = new Dog();
typeof Dog;                                      // 'function'
d.speak();                                       // found on Animal.prototype
Object.getPrototypeOf(d) === Dog.prototype;      // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
d.hasOwnProperty('speak');                       // false — on prototype, not instance
```
**Speaker Notes:** This slide is the conceptual bridge between ES6 class syntax and the prototype lectures that follow. Understanding that classes are syntactic sugar explains a lot of "surprising" JavaScript behavior: why methods are shared across instances (they're on the prototype, not copied), why `typeof Animal === 'function'` (because a class declaration creates a constructor function), and why `extends` can inherit from anything that has a valid prototype — including built-in constructors like `Array` and `Map`. For the exam, the key insight is: the class syntax is new, the prototype chain is old, and they are the same thing.

### Slide 7: Putting It All Together — Real-World Class Design
**Visual:** A complete class hierarchy diagram for a shape library: `Shape` base class with `#color` private field, `area()` abstract-style method, and `toString()`. `Circle` and `Rectangle` extend it. Boxes show which methods are own vs. inherited. A small call stack trace shows method resolution order for `circle.toString()`.
**Content:**
- Design principle: use classes for encapsulating state + behavior that belongs together
- Base class defines the contract; subclasses specialize behavior
- Private fields protect invariants; getters expose derived values
- Static factory methods replace multiple constructors (JS only allows one)
- Exam checklist for class design questions:
  - `constructor` initializes `this` — must call `super()` first in subclasses
  - Methods in the body → `ClassName.prototype`
  - Private fields with `#` → only accessible inside declaring class
  - `static` → lives on the class itself
  - `extends` + `super()` → prototype chain inheritance
```js
class Shape {
  #color;
  constructor(color) { this.#color = color; }
  get color() { return this.#color; }
  area() { throw new Error('area() must be overridden'); }
  toString() { return `${this.constructor.name}(color=${this.#color}, area=${this.area()})`; }
}

class Circle extends Shape {
  #radius;
  constructor(color, radius) { super(color); this.#radius = radius; }
  area() { return Math.PI * this.#radius ** 2; }
}

const c = new Circle('red', 5);
c.toString(); // 'Circle(color=red, area=78.53...)'
c instanceof Shape; // true
```
**Speaker Notes:** `this.constructor.name` in the base class `toString()` is a useful trick — it returns the name of the actual subclass being used at runtime, not the base class name. This is because `this` refers to the specific instance, and `instance.constructor` walks the prototype chain to find the constructor function that created it. Notice also how `area()` in the base class throws an error — JavaScript has no abstract methods or interfaces, so this "throw if not overridden" pattern is the idiomatic way to signal that subclasses must implement a method. This comes up occasionally on JSI exam scenario questions.

## Recording Script
Welcome to Lecture 5: Classes and Object-Oriented Programming in JavaScript. This lecture covers one of the most heavily tested sections of the JSI exam at around 15%, so invest time here.

JavaScript introduced the class syntax with ES6 in 2015. Before that, developers used constructor functions and prototype assignments directly. Classes do not change how JavaScript works internally — the prototype chain is still there — but they give us a much cleaner, more readable syntax for defining objects with shared behavior.

A class declaration starts with the `class` keyword, followed by a name and a body in curly braces. Inside, the `constructor` method runs every time you call `new ClassName()`. It receives the arguments you pass and typically uses them to initialize instance properties on `this`. One constructor per class — defining two is a syntax error.

Instance methods are just functions defined inside the class body. They live on `ClassName.prototype`, not on each instance, which is what makes them memory-efficient. Every dog object shares the same `speak` function on `Animal.prototype` rather than having its own copy.

Static methods and properties belong to the class itself, not to instances. You call them as `ClassName.method()`. Trying to call a static on an instance returns undefined for properties and throws a TypeError for methods. Static factory methods are a very common pattern when you need multiple ways to construct an object but JavaScript only allows a single constructor.

Inheritance uses `extends`. A subclass inherits all methods from its parent class. In the subclass constructor, you must call `super()` before using `this` — if you forget, you get a ReferenceError. `super()` calls the parent constructor. `super.method()` in a subclass method calls the parent's version of that method, which lets you extend rather than completely replace the parent behavior.

Private fields are declared at the top of the class body with a `#` prefix. They cannot be accessed from outside the class at all — not with dot notation, bracket notation, or any reflection trick. This is real encapsulation, not the old underscore convention. Getters and setters let you expose controlled access to private state, with the added ability to run validation in the setter.

Class expressions are just classes assigned to variables. Classes are first-class values in JavaScript — you can pass them as arguments, return them from functions, and store them in data structures. This enables powerful patterns like class factories and mixins.

The most important conceptual point of this lecture: classes are syntactic sugar over the prototype system. `typeof Animal` returns `'function'`. Methods on a class go on the prototype. `extends` sets up the prototype chain. We dig deep into the prototype chain in the next lecture, so this lecture lays the groundwork for that.

Let me recap the exam-critical rules: always `super()` before `this` in a subclass constructor; static members are on the class not the instance; private `#fields` cannot be accessed outside the declaring class; and classes are not hoisted — you cannot use them before they are defined.

Next lecture, we go under the hood and look at the prototype chain directly. See you there.

## Exam Tips
- `super()` must be called before `this` in a subclass constructor — forgetting this causes a ReferenceError at runtime. If a subclass has no constructor at all, `super()` is called implicitly.
- Static methods and properties live on the class constructor, not on instances. `instance.staticMethod()` is `undefined` for properties; a TypeError for method calls.
- Private fields (`#field`) throw a SyntaxError if accessed outside the declaring class — even from a subclass. They are declared at the top of the class body before use.
- Classes are NOT hoisted like function declarations. Using a class before its definition in the code causes a ReferenceError (temporal dead zone, same as `let`/`const`).
- `typeof SomeClass === 'function'` — classes are constructor functions. This is the "syntactic sugar" principle.
- Getters are accessed without parentheses (`obj.balance`), not called (`obj.balance()`). If exam code calls a getter with `()`, that would throw a TypeError.
- Exam weight is approximately 15% — this topic combines with Lecture 06 (Prototypes) for the "Classes" domain.

## Lecture Summary
ES6 classes provide a clean declarative syntax for object-oriented JavaScript built on the existing prototype system. A `class` body contains a single `constructor`, instance methods (placed on `ClassName.prototype`), and optionally `static` methods and properties (on the class itself). Inheritance is achieved with `extends`, requiring `super()` before `this` in subclass constructors. Private fields (`#field`) enforce true encapsulation enforced by the engine, while getters and setters control access to private state. Class expressions allow classes to be assigned to variables and used as first-class values. Under the hood, classes compile to constructor functions with prototype chains — `typeof MyClass === 'function'` confirms this.

## Mini Quiz

**Q1:** What happens when a subclass defines a constructor but does not call `super()` before using `this`?
A) `this` is set to `undefined`
B) A ReferenceError is thrown: must call super constructor before accessing `this`
C) The parent constructor is silently skipped and `this` is initialized to `{}`
D) A TypeError is thrown: `super` is not a function
**Answer:** B — The JavaScript engine enforces that `super()` must be called before `this` is accessible in a derived class constructor. Omitting it (or calling it after a `this` access) throws a ReferenceError at runtime. This is a frequent exam scenario question.

**Q2:** Given `class Foo { static count = 0; }` and `const f = new Foo();`, what does `f.count` evaluate to?
A) `0`
B) `1`
C) `undefined`
D) A TypeError is thrown
**Answer:** C — Static properties live on the class constructor (`Foo.count`), not on instances. Accessing `f.count` walks the prototype chain and does not find `count` anywhere, returning `undefined`. The correct access is `Foo.count`.

**Q3:** Which statement correctly describes ES6 private fields declared with `#`?
A) They are accessible from subclasses but not from external code
B) They are accessible using `obj['#fieldName']` bracket notation
C) They must be declared in the class body before use and are inaccessible outside the declaring class
D) They behave like the underscore convention — private by agreement only
**Answer:** C — Private fields declared with `#` are a hard language feature: they must be declared in the class body, and any attempt to access them outside the declaring class (including from subclasses) results in a SyntaxError. They cannot be accessed via bracket notation or any reflection mechanism.
