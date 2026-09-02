# Apex Basics

## Exam Domain
Developer Fundamentals — 23% of exam weight

## Core Concepts

### What Is Apex?
Salesforce's proprietary, strongly typed, server-side OOP language. Inspired by Java — similar syntax, class structure, type system. Compiled and stored as bytecode at **save time** (not runtime). Runs on Salesforce's multi-tenant infrastructure, not in the browser.

### Apex vs Java: Key Differences
- Built-in SOQL/DML — no database driver needed
- Governor limits enforced per transaction
- No multithreading, no file I/O
- sObject types are first-class: `Account a = new Account();` is valid
- String `==` is **case-insensitive** (unlike Java's `.equals()`)
- No `main()` method — Apex is always invoked by a platform event

### Compilation at Save Time
Salesforce compiles Apex when you save/deploy — not at runtime. Catches syntax errors, type mismatches, missing methods. Invalid Apex cannot be saved. If a referenced class doesn't exist, the save fails. This is early error detection.

### Access Modifiers

| Modifier | Scope |
|----------|-------|
| `private` | Declaring class only (default for methods/variables if omitted) |
| `protected` | Class + subclasses |
| `public` | Same org/namespace |
| `global` | All namespaces, managed packages, web services |

Top-level classes must be `public` or `global`. Inner class members default to `private`.

### Static vs Instance Members
- **Instance**: belong to a specific object; require `new MyClass()` to access
- **Static**: belong to the class itself; called as `MyClass.methodName()`
- Static variables maintain their value **for the entire transaction** — reset between transactions
- Key pattern: static Boolean flag for **recursive trigger prevention**

### Governor Limits — The Multi-Tenant Contract
Salesforce runs thousands of customers on shared infrastructure. Limits enforce fair resource use per transaction. Violating a limit throws a `LimitException` — **cannot be caught** — transaction rolls back. Check usage: `Limits.getQueries()` / `Limits.getLimitQueries()`.

### Interfaces and Inheritance
Apex supports single inheritance only (one `extends`); multiple interfaces allowed. Classes are NOT inheritable by default — must mark `virtual` or `abstract`. Key platform interfaces: `Database.Batchable`, `Schedulable`, `Queueable`, `HttpCalloutMock`.

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Classes with no access modifier — defaults to `private` for inner classes but system context for top-level, leading to confusing scope bugs
- Methods marked `global` unnecessarily — `global` is only needed for managed package APIs or web services; overuse makes it harder to change API signatures later
- Static variables used as configuration caches without reset logic — if the transaction spans multiple contexts (e.g., batch), stale static state can cause bugs
- Missing governor limit awareness: developers coming from traditional web app backgrounds often write loops inside loops without thinking about transaction boundaries

**Enterprise-scale considerations:**
- In large orgs, Apex is compiled across ALL classes at deploy time — a deploy fails if ANY class has a compile error, even unrelated ones. This is why CI/CD pipelines run a full validation before every deployment.
- The `global` keyword locks you in: once a method is `global` and distributed in a managed package, you cannot remove or change its signature without breaking subscriber orgs. Minimize `global` surface area.
- LimitException being uncatchable means you must design for safety margins, not rely on exception handling. Build in checks using the `Limits` class at critical points.

**For CTO conversations:**
- Apex is intentionally constrained: no file I/O, no threads, no arbitrary memory allocation. These constraints exist to protect the shared platform. Building with these constraints in mind from the start is cheaper than retrofitting.
- When a customer asks "can't we just increase the limits?" — the answer is no, but async Apex (Batch, Queueable) provides escape valves for high-volume work.

## Architecture / How It Works

```
ACCESS MODIFIER SCOPE (nested rings)

  ╔══════════════════════════════════════════════════════════════════╗
  ║  global  — all namespaces, managed packages, web services        ║
  ║  ╔════════════════════════════════════════════════════════╗      ║
  ║  ║  public  — same org / namespace                        ║      ║
  ║  ║  ╔══════════════════════════════════════════════╗      ║      ║
  ║  ║  ║  protected  — class + subclasses only        ║      ║      ║
  ║  ║  ║  ╔════════════════════════════════════╗      ║      ║      ║
  ║  ║  ║  ║  private  — defining class only    ║      ║      ║      ║
  ║  ║  ║  ╚════════════════════════════════════╝      ║      ║      ║
  ║  ║  ╚══════════════════════════════════════════════╝      ║      ║
  ║  ╚════════════════════════════════════════════════════════╝      ║
  ╚══════════════════════════════════════════════════════════════════╝

  Top-level class: must be public or global
  Methods/variables: default to private if no modifier
```

**Limitations:**
- `global` methods in managed packages cannot have their signature changed after distribution
- Top-level Apex classes CANNOT be `private` or `protected`

```
STATIC VARIABLE TRANSACTION SCOPE

  INSTANCE (per object)             STATIC (per transaction, shared)
  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────┐
  │  Counter     │  │  Counter     │  │  Counter (class level)     │
  │  obj1        │  │  obj2        │  │  callCount = 3 ◄── shared  │
  │  id = 1      │  │  id = 2      │  │  by ALL instances in this  │
  └──────────────┘  └──────────────┘  │  transaction               │
                                      └────────────────────────────┘

  Recursive trigger prevention pattern:
  ┌─────────────────────────────────────────────────┐
  │  public class TriggerHelper {                   │
  │      public static Boolean isFirstRun = true;  │
  │  }                                              │
  │                                                 │
  │  Trigger fires (1st time) → isFirstRun = true  │
  │  → set isFirstRun = false → run logic          │
  │  Trigger fires (2nd time) → isFirstRun = false │
  │  → SKIP logic → prevents infinite loop         │
  └─────────────────────────────────────────────────┘
```

**Limitations:**
- Static variables reset between transactions — cannot persist data across requests
- Static variables DO persist across multiple trigger invocations within the SAME transaction (this is the feature used for recursion prevention)

```
GOVERNOR LIMITS — SYNCHRONOUS vs ASYNCHRONOUS

  ┌────────────────────┬──────────────┬───────────────┐
  │  Resource          │  Synchronous │  Asynchronous │
  ├────────────────────┼──────────────┼───────────────┤
  │  SOQL queries      │     100      │      200      │
  │  DML statements    │     150      │      150      │
  │  DML rows          │   10,000     │    10,000     │
  │  CPU time          │  10,000 ms   │   60,000 ms   │
  │  Heap size         │    6 MB      │     12 MB     │
  │  HTTP callouts     │     100      │      100      │
  │  SOSL queries      │      20      │       20      │
  └────────────────────┴──────────────┴───────────────┘
  LimitException: NOT catchable — always rolls back the transaction
```

**Limitations:**
- `LimitException` cannot be caught with try/catch — the only defense is staying under limits by design
- Async contexts (Batch, Future, Queueable) get higher SOQL and heap limits — main reason to use async for volume work

## Key Facts to Memorize
- Apex compiles at **save time** — invalid Apex cannot be saved
- `global` required for: managed package APIs, `@RestResource`, `webservice` keyword
- `LimitException` is **NOT catchable** — transaction always rolls back
- Static variables persist for the **entire transaction**, reset between transactions
- Apex `==` on Strings is **case-insensitive** — `'Hello' == 'hello'` is true
- Top-level classes must be `public` or `global` — cannot be `private`
- Apex supports only single inheritance (`extends`); multiple `implements` allowed

## Customer Advisory Tips
- **Custom code vs Flow?** Flow should be the default for automations. Apex is appropriate when: complex logic exceeds Flow's expression capabilities, bulk data volumes exceed Flow's limits, or external integrations need Apex callout patterns.
- **When to use `global`?** Only for managed package APIs and REST/SOAP web service classes. For ISV partners, be conservative — every `global` surface is a long-term API contract.
- **Multi-tenant limits in customer conversations?** Frame governor limits as "platform contracts, not bugs." They ensure fair resource sharing across thousands of orgs. Async Apex (Batch, Queueable) is the platform's answer for work that exceeds synchronous limits.

## Exam Traps
- Top-level Apex classes CANNOT be `private` — they must be `public` or `global`
- `global` is required for REST API annotations (`@RestResource`) and SOAP web service keyword — `public` alone is not enough
- `LimitException` is the ONE exception type that CANNOT be caught with try/catch
- Static variables persist for the ENTIRE transaction but reset between transactions — they do NOT persist across requests or user sessions
- Apex `==` is case-insensitive for Strings — `'Hello' == 'hello'` evaluates to `true`

## Practice Questions

**Q:** A developer saves an Apex class that references a method that doesn't exist on another class. What happens?
**A:** The save fails with a compile-time error. Apex compiles at save time — referencing a non-existent method is caught immediately.

**Q:** A managed package needs an Apex method callable from subscriber orgs. Which access modifier?
**A:** `global` — required for code accessible across namespace boundaries. `public` is only within the same namespace.

**Q:** A trigger sets a static Boolean to `true` on first execution. The trigger fires again in the same transaction. What is the value?
**A:** Still `true` — static variables persist for the entire transaction regardless of how many times a trigger fires. This is the recursion prevention pattern.
