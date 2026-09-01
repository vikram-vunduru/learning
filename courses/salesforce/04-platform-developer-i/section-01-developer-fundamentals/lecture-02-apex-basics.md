# Lecture 02: Apex Basics

## Learning Objectives
- Explain how Apex differs from general-purpose languages: server-side execution, compilation at save, and governor limits
- Define Apex classes and interfaces using correct access modifiers: global, public, private, and protected
- Distinguish between static and instance methods and variables, and explain when to use each
- Describe the governor limits concept and why it exists in a multi-tenant environment

## Slides

### Slide 1: What Is Apex?
**Visual:** Diagram comparing a traditional web app stack (client → server → database) with the Salesforce stack, showing Apex running on the Force.com platform server tier alongside the Salesforce database and metadata engine.
**Content:**
- Apex is Salesforce's **proprietary, strongly typed, object-oriented** programming language
- Inspired by Java — similar syntax, class structure, and type system
- Runs **server-side** on Salesforce's multi-tenant infrastructure — not in the browser
- Compiled and stored as bytecode at **save time** (not at runtime, unlike JavaScript)
- Can be invoked by: triggers, Visualforce controllers, REST APIs, flows, scheduled jobs, and more
**Speaker Notes:** The most important thing to understand about Apex is that it runs on Salesforce's servers, in a shared environment with thousands of other customers. That shared environment is the reason governor limits exist — to ensure no single customer's code can monopolize server resources. This is fundamentally different from writing backend code for a server you own.

### Slide 2: Apex vs Java — Key Differences
**Visual:** Two-column side-by-side comparison table with rows for: compilation, execution environment, database access, collections, null handling, governor limits, and package deployment.
**Content:**
- **Similar to Java:** Classes, interfaces, inheritance, generics, exception handling, OOP concepts
- **Different from Java:** Built-in SOQL/DML, governor limits, no multithreading, no file I/O
- Apex **collections** (List, Set, Map) are simpler than Java's — no need to import `java.util`
- sObject types are **first-class citizens** — `Account a = new Account();` is valid syntax
- No `main()` method — Apex is always invoked by a Salesforce platform event or API call
- String comparison uses `==` (case-insensitive for Strings), unlike Java's `.equals()`
**Speaker Notes:** If you already know Java, Apex will feel very familiar. The critical mindset shift is that Apex is designed for the Salesforce data model. You do not import a database driver — SOQL is built right into the language. And String equality with == is case-insensitive, which trips up Java developers constantly.

### Slide 3: Apex Class Structure
**Visual:** Annotated Apex class code block with callout arrows labeling: access modifier, class keyword, class name, member variables, constructor, instance method, static method, and return type.
**Content:**
- Basic class syntax:
```apex
public class MyClass {
    // Member variable (instance)
    private String name;

    // Constructor
    public MyClass(String n) {
        this.name = n;
    }

    // Instance method
    public String getName() {
        return this.name;
    }

    // Static method
    public static Integer addNumbers(Integer a, Integer b) {
        return a + b;
    }
}
```
- Classes are saved in Setup → Apex Classes or in VS Code under `force-app/main/default/classes/`
- Each class file generates two files: `MyClass.cls` and `MyClass.cls-meta.xml`
**Speaker Notes:** The class structure is straightforward for anyone with OOP experience. Notice that the access modifier comes first, then the `class` keyword, then the name. Inside, you have variables, a constructor, and methods. The meta.xml file is required for all Salesforce metadata and contains the API version — it should never be deleted.

### Slide 4: Access Modifiers
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │  global   — all namespaces, managed packages, web services       │
  │  ┌──────────────────────────────────────────────────────────┐    │
  │  │  public   — same org / namespace                         │    │
  │  │  ┌────────────────────────────────────────────────┐      │    │
  │  │  │  protected  — class + subclasses only           │      │    │
  │  │  │  ┌────────────────────────────────────────┐     │      │    │
  │  │  │  │  private  — defining class only (default)    │      │    │
  │  │  │  └────────────────────────────────────────┘     │      │    │
  │  │  └────────────────────────────────────────────┘      │    │
  │  └──────────────────────────────────────────────────────┘    │
  └──────────────────────────────────────────────────────────────────┘
  Top-level class: must be public or global
  Methods/variables: default to private if no modifier
```
**Content:**
- **private:** Accessible only within the defining class — default for inner classes and methods if omitted
- **protected:** Accessible within the class and all subclasses (used with virtual/abstract classes)
- **public:** Accessible anywhere within the same Salesforce application/namespace
- **global:** Accessible from any Apex code in any namespace — required for managed package APIs, REST/SOAP web services
- Apex classes at the top level must be either `public` or `global`
- Methods and variables default to `private` if no modifier is specified
**Speaker Notes:** The key distinction that appears on the exam is `public` versus `global`. Public classes are visible across your org, but if you are building a managed package that other orgs will install, any method you want to expose to package consumers must be declared `global`. Changing a global method's signature after it is installed in packages breaks those packages — Salesforce enforces this.

### Slide 5: Static vs Instance Members
**Visual:**
```
  INSTANCE (per object)            STATIC (per transaction, shared)
  ┌──────────┐  ┌──────────┐       ┌─────────────────────────────┐
  │ Counter  │  │ Counter  │       │     Counter (class)          │
  │ obj1     │  │ obj2     │       │  callCount = 3  ← one value  │
  │ id = 1   │  │ id = 2   │       │  shared by ALL instances     │
  └──────────┘  └──────────┘       └─────────────────────────────┘

  MyClass obj = new MyClass();     MyClass.staticMethod();
  obj.instanceMethod();            ← called on class, not object

  Static variable use case:
  public class TriggerHelper {
      public static Boolean hasRun = false;  ← stays true for
  }                                           entire transaction
                                             → prevents recursion
```
**Content:**
- **Instance variables/methods:** Belong to a specific object instance; require `new MyClass()` to access
- **Static variables/methods:** Belong to the class itself; accessed as `MyClass.methodName()`
- Static variables maintain their value **for the entire transaction** (not across transactions)
- Common exam pattern: static Boolean flag for **recursive trigger prevention**
- Static methods cannot reference instance variables (`this` is not available)
- Example:
```apex
public class Counter {
    public static Integer callCount = 0; // shared across transaction
    public Integer instanceId;           // per-object
}
```
**Speaker Notes:** Static variables in Apex are transaction-scoped, which is a critical concept. If a static variable is set to true in a trigger, it stays true for the entire transaction — meaning any subsequent trigger invocations within the same transaction will see that value. This is exactly how developers prevent infinite trigger recursion, and it is a guaranteed exam topic.

### Slide 6: Governor Limits — The Multi-Tenant Contract
**Visual:** Infographic showing a Salesforce server shared by Company A, Company B, and Company C, with a resource pie chart divided equally, and a warning icon when one company's code tries to take too large a slice.
**Content:**
- Salesforce runs thousands of customers on **shared infrastructure**
- Governor limits enforce **fair resource usage** per transaction
- Key synchronous limits (per transaction):
  - SOQL queries: **100**
  - DML statements: **150**
  - CPU time: **10,000 ms**
  - Heap size: **6 MB**
  - Callouts: **100**
- Violating a limit throws a `LimitException` — **cannot be caught** in code
- Check current usage: `Limits.getQueries()` / `Limits.getLimitQueries()`
**Speaker Notes:** Governor limits are not a bug or a constraint to work around — they are the fundamental design of the Salesforce platform. Every architectural decision in Apex development — bulkification, handler patterns, async processing — exists because of governor limits. If you understand why limits exist, the best practices follow naturally.

### Slide 7: Compilation at Save Time
**Visual:** Flowchart showing: Developer saves Apex class → Salesforce compiler validates syntax and type safety → Bytecode stored on platform → At runtime, bytecode executes on app server. Contrast arrow shows JavaScript: save → deploy → runtime parse/execute.
**Content:**
- Apex is compiled when you **save or deploy** the class, not when it executes
- Compilation catches: syntax errors, type mismatches, missing methods, invalid SOQL
- Invalid Apex cannot be saved — the save/deploy fails with a compile error
- This provides **earlier error detection** compared to dynamically typed languages
- Consequence: all referenced classes must exist and be valid at compile time
- Anonymous Apex is compiled and executed in one step (not stored)
**Speaker Notes:** Compilation at save time is a significant advantage of Apex over JavaScript in terms of catching errors early. If you reference a class that does not exist, or call a method with the wrong parameter types, you find out immediately when you try to save — not when a user triggers the code at 3 AM. This also means you cannot deploy code that references other code that does not exist in the target org.

### Slide 8: Interfaces and Inheritance in Apex
**Visual:** Class hierarchy diagram showing an abstract base class `Shape` with a virtual method `getArea()`, two concrete classes `Circle` and `Rectangle` extending it, and an interface `Drawable` being implemented by both.
**Content:**
- **Interfaces:** Define method signatures without implementation; use `implements` keyword
- **Abstract classes:** Can have abstract methods (no body) and concrete methods; use `extends`
- **Virtual classes:** Can be subclassed; methods must be marked `virtual` to be overridden
- Key interfaces used by the platform: `Database.Batchable`, `Schedulable`, `Queueable`, `HttpCalloutMock`
- `override` keyword required when overriding a virtual method
- Apex supports **single inheritance** only (one `extends`); multiple interfaces allowed
**Speaker Notes:** Salesforce's own framework is built on interfaces and abstract classes. When you write a batch class, you implement `Database.Batchable`. When you write a schedulable class, you implement `Schedulable`. The exam tests whether you know which interface to implement for which async pattern, and what methods each interface requires.

## Recording Script
Welcome to Lecture 2. By the end of this lecture, you will have a solid foundation in what Apex is, how it is structured, and the most important conceptual shift you need to make when writing code on the Salesforce platform: thinking within governor limits.

Let's start with the basics. Apex is Salesforce's proprietary programming language. If you have written Java before, Apex will look extremely familiar — the syntax, class structure, and type system are very similar. But there are important differences. Apex runs on Salesforce's servers, not on your machine or a server you control. This means every piece of Apex code you write executes inside Salesforce's multi-tenant infrastructure, shared with thousands of other companies.

That shared infrastructure is the reason governor limits exist. Salesforce sets hard caps on how many SOQL queries you can run, how many DML operations you can perform, and how much CPU time and memory you can consume — all per transaction. If your code exceeds any of these limits, Salesforce throws a `LimitException` that cannot be caught in a try-catch block. The transaction is rolled back, and the user sees an error. Understanding this changes how you write every piece of Apex.

Now let's look at class structure. An Apex class starts with an access modifier — either `public` or `global` for top-level classes. Then the `class` keyword and the name. Inside, you can declare member variables, a constructor, and methods. The access modifier on methods and variables controls who can call them.

Let's focus on access modifiers for a moment because the exam loves this topic. Private means accessible only within the class — this is the default. Protected means the class and any subclasses. Public means accessible anywhere within your Salesforce org — any other Apex class in your application can call it. And global means accessible from anywhere, including other namespaces and managed packages. The rule of thumb is: always use the most restrictive modifier that still allows the code to work.

Static versus instance members is another key concept. Instance variables and methods belong to a specific object — you create an instance with `new MyClass()` and then call methods on that instance. Static variables and methods belong to the class itself. You call them as `MyClass.methodName()` without creating an instance first.

Here is the part that catches developers: static variables in Apex maintain their value for the entire transaction. If a static variable is set to `true` in the first invocation of a trigger, it is still `true` if the trigger fires again within the same transaction. This is exactly how recursive trigger prevention works, and we will cover that in detail in Lecture 9.

One more thing: Apex is compiled at save time, not at runtime. When you save an Apex class, Salesforce compiles it immediately and rejects it if there are any errors. This is different from JavaScript, which is parsed at runtime. The advantage is that you catch type errors, missing methods, and invalid syntax before your code ever runs in production.

In the next lecture, we will go deeper into variables, data types, and collections in Apex. See you there.

## Exam Tips
- Top-level Apex classes must be declared `public` or `global` — you cannot save a top-level class with no access modifier or `private`.
- The `global` modifier is required for classes and methods exposed through the Apex REST or SOAP web service annotations (`@RestResource`, `webservice` keyword).
- A `LimitException` thrown when a governor limit is exceeded **cannot be caught** with a try-catch block — the transaction always rolls back.
- Static variables persist for the **entire transaction** but are **reset between transactions** — they do not persist across requests or across different user sessions.
- Apex uses `==` for String comparison, and it is **case-insensitive** for Strings — `'Hello' == 'hello'` evaluates to `true`.

## Lecture Summary
Apex is a strongly typed, server-side language compiled at save time, designed specifically for the Salesforce multi-tenant platform. The four access modifiers (private, protected, public, global) control visibility from the most restrictive to the most permissive, with `global` required for managed package APIs. Static members are transaction-scoped, making them essential for patterns like recursive trigger prevention, while governor limits enforce fair resource use across thousands of shared-platform customers.

## Mini Quiz

**Q1:** A developer saves an Apex class that references a method that does not exist on a related class. What happens?
A) The class saves successfully and the error appears at runtime
B) The class saves but generates a warning in the debug log
C) The save fails with a compile-time error
D) The class saves and Salesforce automatically creates the missing method as a stub
**Answer:** C — Apex compiles at save time. Referencing a non-existent method causes a compile error, and the save is rejected. This is one of Apex's key safety features compared to dynamically typed languages.

**Q2:** A developer is building a managed package and needs an Apex class method to be callable by code in the installing subscriber org. Which access modifier must the method have?
A) public
B) private
C) protected
D) global
**Answer:** D — The `global` modifier is required for code that must be accessible across namespace boundaries, including from subscriber orgs that install a managed package. `public` is only accessible within the same namespace.

**Q3:** A trigger on the Opportunity object sets a static Boolean variable to `true` during its first execution. The trigger fires again on the same set of records during the same transaction (due to a workflow field update). What is the value of that static Boolean in the second execution?
A) false — static variables are reset between trigger invocations
B) true — static variables persist for the entire transaction
C) null — static variables are cleared between trigger contexts
D) It depends on whether the variable was declared in the trigger or a handler class
**Answer:** B — Static variables in Apex maintain their values for the duration of the entire transaction, regardless of how many times a trigger fires. This behavior is deliberately used to prevent infinite recursion.
