# Lecture 15: TypeScript Basics

## Learning Objectives
- Explain what TypeScript is, why it compiles to JavaScript, and the benefits of static typing
- Declare variables using TypeScript's basic types: string, number, boolean, any, void, never, unknown
- Define object shapes using interfaces and type aliases, and explain the key differences
- Write generic functions and interfaces using the `T` type parameter
- Apply union types (`|`) and intersection types (`&`) to compose complex types
- Use optional (`?`) and `readonly` properties in interfaces
- Define enums for named constant sets
- Apply type assertions using the `as` keyword
- Configure a TypeScript project with key `tsconfig.json` compiler options

## Slides

### Slide 1: What Is TypeScript?
**Visual:** Flow diagram: TypeScript source (.ts) → TypeScript Compiler (tsc) → JavaScript output (.js) → runs in Node.js / browser. Callout showing a TypeScript error caught at compile time before the code ever runs. Statistics callout: "TypeScript catches ~15% of bugs before runtime" (Microsoft research).
**Content:**
- **TypeScript** is a superset of JavaScript developed by Microsoft (Anders Hejlsberg, 2012)
- "Superset" means all valid JavaScript is valid TypeScript — you can rename a .js file to .ts
- TypeScript adds **static type checking** — catches type errors at compile time, not runtime
- TypeScript must be compiled to JavaScript before it can run — the runtime never sees TypeScript
- Install: `npm install --save-dev typescript`; compile: `npx tsc`
- Key benefits:
  - Catch bugs early: `cannot read property 'name' of undefined` → caught before deploy
  - Better IDE support: autocomplete, refactoring, inline docs
  - Self-documenting code: function signatures describe input/output types
  - Safer refactoring: rename a property — TypeScript shows every usage that must change
- TypeScript does NOT add runtime type checks — all type info is erased after compilation
**Speaker Notes:** TypeScript is not a different language — it is JavaScript with a type layer on top. After compilation, the output is plain JavaScript. This means TypeScript has zero runtime overhead from types. The compiler's job is to analyze your code, report type errors, and strip all type annotations before outputting JavaScript. If you are already writing good JSDoc comments, TypeScript is a natural next step — it formalizes those comments into checkable types.

### Slide 2: Basic Types
**Visual:** Type annotation cheat sheet showing each type with a variable declaration example. Color coding: primitive types (string, number, boolean) in blue, special types (any, void, never, unknown) in orange, with short descriptions of each.
**Content:**
- **Type annotation syntax:** `let variableName: Type = value;`
- **Primitive types:**
  ```ts
  let name: string = 'Alice';
  let age: number = 30;         // covers integers AND floats
  let active: boolean = true;
  ```
- **Special types:**
  ```ts
  let anything: any = 42;       // opt out of type checking — avoid when possible
  anything = 'now a string';    // no error with any

  let result: void = undefined; // function returns nothing (used as return type)
  
  // never — a value that never occurs (functions that always throw or infinite loop)
  function fail(msg: string): never {
    throw new Error(msg);
  }

  let uncertain: unknown = fetchData();  // like any, but safer — must narrow before use
  if (typeof uncertain === 'string') {
    console.log(uncertain.toUpperCase()); // OK — narrowed to string
  }
  ```
- **Arrays:** `string[]` or `Array<string>`
- **Tuple:** Fixed-length typed array — `let pair: [string, number] = ['age', 30]`
- **Type inference:** TypeScript infers types from assignment — `let x = 5` infers `number`
**Speaker Notes:** The distinction between `any` and `unknown` is important for the exam. `any` completely disables type checking — you can call any method on it and TypeScript won't complain. `unknown` also accepts any value, but TypeScript forces you to narrow it with a type check before you can use it as a specific type. This makes `unknown` safe for things like API responses where you don't know the shape. The `never` type represents code paths that are unreachable — used for exhaustive checks in switch statements.

### Slide 3: Interfaces vs Type Aliases
**Visual:** Side-by-side code comparison. Left: interface definition and usage with `extends`. Right: type alias with `&` intersection. Callout box highlighting key difference: "interfaces are open (extendable with declaration merging); type aliases are closed."
**Content:**
- **Interface** — describes the shape of an object; named and reusable:
  ```ts
  interface User {
    id: number;
    name: string;
    email?: string;      // optional property
    readonly createdAt: Date;  // cannot be reassigned after creation
  }

  // Interfaces can extend other interfaces
  interface Admin extends User {
    role: 'admin' | 'superadmin';
  }
  ```
- **Type alias** — creates a named type for any type expression:
  ```ts
  type ID = string | number;     // union type alias
  type Point = { x: number; y: number };

  // Type aliases can use & to combine (intersection)
  type AdminUser = User & { role: string };
  ```
- **Key differences:**
  | | Interface | Type Alias |
  |-|-----------|------------|
  | Object shapes | Yes | Yes |
  | Extends/inherits | `extends` keyword | `&` intersection |
  | Declaration merging | Yes (re-declare to add props) | No (error) |
  | Primitive/union aliases | No | Yes |
- **Guideline:** Use `interface` for object shapes (especially public API); use `type` for unions, primitives, and complex compositions
**Speaker Notes:** In practice, you can often use either for object shapes and the code works identically. The most important functional difference is declaration merging: if you declare the same interface name twice, TypeScript merges them — this is how library type definitions add to built-in types. Type aliases cannot be re-declared. For the exam, know that both exist, know the extends vs & syntax, and know that type aliases can alias union types while interfaces cannot.

### Slide 4: Generics
**Visual:** Diagram showing a generic `identity<T>` function. Arrow showing T being substituted with `string` for one call and `number` for another call. Below: generic Array<T> example showing the mental model of "T is a placeholder filled in at usage time."
**Content:**
- **Generics** — write code that works with any type while preserving type safety
- Without generics you'd need `any`, losing type information:
  ```ts
  // Not generic — loses type info
  function identity(arg: any): any { return arg; }
  
  // Generic — T is a type parameter filled at call time
  function identity<T>(arg: T): T { return arg; }

  const str = identity<string>('hello');  // T = string
  const num = identity(42);              // T inferred as number
  ```
- **Generic interfaces:**
  ```ts
  interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
  }

  const userResponse: ApiResponse<User> = {
    data: { id: 1, name: 'Alice' },
    status: 200,
    message: 'OK'
  };
  ```
- **Generic constraints** — restrict T to types with certain properties:
  ```ts
  function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;  // safe — T is guaranteed to have length
  }
  getLength('hello');   // OK — string has length
  getLength([1, 2, 3]); // OK — array has length
  ```
**Speaker Notes:** Generics are what make TypeScript's built-in types like `Array<T>`, `Promise<T>`, and `Map<K, V>` work. When you write `Array<string>`, TypeScript substitutes T with string, so `push(42)` becomes a type error. The constraint syntax `T extends SomeType` is common in practice — it lets you write generic code that accesses properties of T without resorting to `any`. A common exam scenario: reading a generic function signature and identifying what TypeScript infers for T from a given call.

### Slide 5: Union Types, Intersection Types, Optional, and Readonly
**Visual:** Three code panels. Top: union type variable that can be string OR number. Middle: intersection type combining two interfaces. Bottom: interface with optional (?) and readonly properties, showing compile errors when violated.
**Content:**
- **Union types (`|`)** — value can be one of several types:
  ```ts
  type StringOrNumber = string | number;
  let id: StringOrNumber = 'abc';
  id = 42;  // also valid

  // Discriminated union (common pattern)
  type Shape =
    | { kind: 'circle'; radius: number }
    | { kind: 'square'; side: number };

  function area(shape: Shape): number {
    if (shape.kind === 'circle') return Math.PI * shape.radius ** 2;
    return shape.side ** 2;  // TypeScript knows this is square here
  }
  ```
- **Intersection types (`&`)** — value must satisfy ALL types:
  ```ts
  type Named = { name: string };
  type Aged = { age: number };
  type Person = Named & Aged;  // must have both name AND age
  ```
- **Optional properties (`?`):**
  ```ts
  interface Config { host: string; port?: number; }
  // port may be undefined — must check before use
  ```
- **Readonly properties:**
  ```ts
  interface Point { readonly x: number; readonly y: number; }
  const p: Point = { x: 0, y: 0 };
  p.x = 5;  // ERROR: Cannot assign to 'x' because it is a read-only property
  ```
**Speaker Notes:** Union types are extremely common in real TypeScript. API responses often return `User | null` (found or not found) or `string | Error` (success or failure). The discriminated union pattern — where each variant has a literal `kind` property — is particularly powerful because TypeScript can narrow the type automatically in an `if` or `switch` statement. Intersection types are used for mixins and role-based permissions where an object must satisfy multiple contracts simultaneously.

### Slide 6: Enums, Type Assertions, and tsconfig.json
**Visual:** Three code blocks. (1) Enum definition and usage with numeric and string enums. (2) Type assertion with `as` keyword showing unsafe cast and safe narrowing use cases. (3) Annotated tsconfig.json with key options highlighted.
**Content:**
- **Enums** — named set of constants:
  ```ts
  enum Direction { Up, Down, Left, Right }  // numeric: Up=0, Down=1...
  enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }  // string enum

  let dir: Direction = Direction.Up;
  console.log(Direction.Up);   // 0
  console.log(Status.Active);  // 'ACTIVE'
  ```
- **Type assertions (`as`)** — tell TypeScript "trust me, I know the type":
  ```ts
  const input = document.getElementById('email') as HTMLInputElement;
  input.value;  // OK — TypeScript knows it's HTMLInputElement

  // Double assertion for unsafe casts (rare)
  const x = someValue as unknown as SpecificType;
  ```
  - Type assertions are compile-time only — no runtime conversion
  - Use sparingly; overuse defeats the purpose of TypeScript
- **tsconfig.json** — TypeScript compiler configuration:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",          // output JS version
      "module": "commonjs",        // module system
      "strict": true,              // enables all strict checks
      "outDir": "./dist",          // compiled output directory
      "rootDir": "./src",          // source directory
      "noImplicitAny": true,       // error on implicit any
      "strictNullChecks": true,    // null/undefined are not valid for other types
      "esModuleInterop": true,     // cleaner default imports
      "declaration": true          // generate .d.ts files
    }
  }
  ```
- **`strict: true`** enables: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and more
**Speaker Notes:** The `strict` flag in tsconfig is the single most impactful setting. With `strictNullChecks` enabled, TypeScript treats `null` and `undefined` as separate types that cannot be assigned to `string` or `number` without explicit handling. This eliminates an entire class of "cannot read property of null" runtime errors. String enums are generally preferred over numeric enums in modern TypeScript because their values are meaningful and readable when logged or serialized, whereas numeric enum values are just integers that tell you nothing without context.

## Recording Script

Welcome to Lecture 15: TypeScript Basics. TypeScript carries about six percent of the JSI exam and is increasingly expected knowledge for any JavaScript developer role, including Salesforce developers.

TypeScript is JavaScript with a type layer. Microsoft created it to tame large JavaScript codebases. You write TypeScript, the compiler checks your types and emits plain JavaScript. The runtime never sees TypeScript — all type information is erased. This means zero runtime overhead from types.

Basic types follow the pattern `let name: Type = value`. The primitives are string, number, and boolean. The special types to know: `any` opts out of type checking entirely — avoid it. `unknown` accepts any value but forces you to narrow before use — safer than any. `void` is for functions that return nothing. `never` is for code paths that never return, like functions that always throw.

Interfaces and type aliases both describe object shapes. Interfaces support `extends` and declaration merging. Type aliases support union and intersection compositions. Use interfaces for object shapes in public APIs; use `type` for unions, primitives, and complex compositions.

Generics write code once and use it with any type. The `T` is a placeholder filled in at the call site. `function identity<T>(arg: T): T` is the simplest example. Generics with constraints — `T extends SomeInterface` — let you access known properties of T without losing type safety.

Union types with `|` mean "one or the other." Intersection types with `&` mean "both at once." Optional properties with `?` may be undefined. Readonly properties cannot be reassigned.

Enums create named constants. String enums are preferred because their values are readable. Type assertions with `as` tell the compiler to treat a value as a specific type — use sparingly.

Finally, tsconfig.json controls compilation. Always enable `strict: true` — it activates strictNullChecks and noImplicitAny, which catch the most bugs.

## Exam Tips
- **TypeScript compiles to JavaScript** — all type annotations are erased; no runtime types
- **`any` vs `unknown`:** `any` disables checking; `unknown` requires narrowing before use — `unknown` is safer
- **`interface` vs `type`:** interfaces support declaration merging and `extends`; type aliases support union/intersection and can alias primitives
- **Generic syntax:** `function fn<T>(arg: T): T` — T is the type parameter; inferred or explicit at call site
- **`|` is union** (either/or); **`&` is intersection** (both/and)
- **`?` makes a property optional**; **`readonly` prevents reassignment after creation**
- **String enums** preferred over numeric enums for readability
- **`as` keyword** is a compile-time assertion, not a runtime cast
- **`strict: true` in tsconfig** is best practice — enables strictNullChecks, noImplicitAny, etc.
- `void` = function returns nothing; `never` = function never returns (throws or infinite loops)

## Lecture Summary
TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. It catches type errors at compile time and is erased entirely at runtime. Basic types include string, number, boolean, `any` (unchecked), `unknown` (checked), `void` (no return), and `never` (unreachable). Interfaces describe reusable object shapes with `extends` inheritance and declaration merging; type aliases (`type`) alias any type expression including unions and intersections. Generics use a `T` type parameter to write reusable, type-safe code. Union types (`|`) allow multiple type options; intersection types (`&`) require all types simultaneously. Optional (`?`) and `readonly` modifiers control property requirement and mutability. Enums define named constant sets, with string enums preferred for readability. Type assertions (`as`) are compile-time only. `tsconfig.json` with `strict: true` is the recommended baseline configuration.

## Mini Quiz

**Question 1:** What is the key behavioral difference between `any` and `unknown` in TypeScript?

A) `any` works only for primitives; `unknown` works for objects
B) `unknown` requires a type narrowing check before the value can be used as a specific type; `any` does not
C) `any` causes a compile error; `unknown` suppresses errors
D) They are identical — `unknown` is just an alias for `any`

**Answer: B — `unknown` requires narrowing**
Both `any` and `unknown` can hold any value. The difference: with `any`, TypeScript allows any operation on the value without checking. With `unknown`, you must narrow (check) the type first — e.g., `if (typeof x === 'string')` — before TypeScript allows string operations. This makes `unknown` the safer choice for values of truly unknown shape, like data from external APIs.

---

**Question 2:** A developer writes a generic function: `function wrap<T>(value: T): T[] { return [value]; }`. What does TypeScript infer for T when called as `wrap('hello')`?

A) `any`
B) `unknown`
C) `string`
D) `object`

**Answer: C — `string`**
TypeScript infers the type argument from the argument passed. `wrap('hello')` passes a string literal, so TypeScript infers T as `string`. The return type is therefore `string[]`. TypeScript's type inference is usually accurate enough that explicit type arguments like `wrap<string>('hello')` are unnecessary.

---

**Question 3:** Which tsconfig.json option, when set to `true`, prevents TypeScript from implicitly assigning the `any` type when a variable's type cannot be inferred?

A) `strict`
B) `noImplicitAny`
C) `strictNullChecks`
D) Both A and B (since `strict` enables `noImplicitAny`)

**Answer: D — both A and B**
`noImplicitAny: true` directly prevents implicit `any`. `strict: true` is a meta-flag that enables a group of strict checks including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and others. Setting `strict: true` implies `noImplicitAny: true`. The exam may present either option — know that `strict: true` is the recommended way to enable all strict checks at once.
