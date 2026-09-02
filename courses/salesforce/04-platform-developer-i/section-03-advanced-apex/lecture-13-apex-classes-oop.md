# Apex Classes & Object-Oriented Programming

## Exam Domain
Developer Fundamentals — 23% of exam weight

## Core Concepts

### Classes Are NOT Inheritable by Default
Unlike Java, Apex classes are effectively `final` unless marked `virtual` or `abstract`. This is a critical difference and a common exam trap.
- `virtual` — class/method can be extended/overridden; still instantiable
- `abstract` — cannot be instantiated; subclasses MUST implement abstract methods
- `override` — required keyword when a subclass overrides a virtual method

```apex
public virtual class Animal {
    public virtual String speak() { return 'generic sound'; }
}

public class Dog extends Animal {
    public override String speak() { return 'woof'; }
}

public abstract class Shape {
    public abstract Decimal area();  // no body — subclasses must implement
}
```

### Interfaces — Contracts Without Implementation
```apex
public interface Printable {
    void print();
    String getLabel();
}

public class Invoice implements Printable {
    public void print() { /* implementation */ }
    public String getLabel() { return 'Invoice #' + number; }
}
```
- Multiple interfaces allowed: `implements Interface1, Interface2`
- `Comparable` — implement `compareTo(Object o)` to enable `List.sort()` on custom objects
- `Iterable<T>` + `Iterator<T>` — custom iteration (used in advanced Batch Apex start())
- Platform interfaces: `Database.Batchable`, `System.Queueable`, `System.Schedulable`, `HttpCalloutMock`

### Inner Classes
```apex
public class OrderService {
    // Inner class for typed JSON wrapper
    public class OrderResponse {
        public String status;
        public String orderId;
    }

    // Static inner class — accessible without outer instance
    public static class OrderException extends Exception {}
}
// Access: OrderService.OrderResponse resp = new OrderService.OrderResponse();
```
Common uses: JSON request/response wrappers, test data builders, custom exceptions, data containers.

### @AuraEnabled — Expose Apex to LWC/Aura
```apex
public class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 50];
    }

    @AuraEnabled  // no cacheable — performs DML
    public static void updateAccount(Id accountId, String name) {
        update new Account(Id = accountId, Name = name);
    }
}
```
- `cacheable=true` — required for `@wire` in LWC; method MUST be read-only (no DML)
- Without `cacheable=true` — must call imperatively from JavaScript
- All @AuraEnabled methods must be `static` and `public` or `global`

### Sharing Keywords — Record Visibility Control
```apex
public with sharing class AccountController { }     // respects user's sharing rules
public without sharing class DataMigration { }      // bypasses sharing — sees everything
public inherited sharing class AccountService { }   // adopts caller's sharing context
```
- `with sharing` — enforces record-level sharing rules of the running user
- `without sharing` — bypasses sharing; class sees all records
- `inherited sharing` — adopts the caller's sharing context (right choice for utility/service classes)
- Default (no keyword) — Apex runs in system context without sharing (similar to without sharing)
- Sharing keywords do NOT affect FLS or object-level permissions — only record visibility

### Access Modifiers — Quick Reference
| Modifier | Visible To |
|----------|-----------|
| `private` | Declaring class only |
| `protected` | Class + subclasses |
| `public` | Same org/namespace |
| `global` | All namespaces (managed packages, web services) |

## PTA / SA Relevance

**In partner code reviews, watch for:**
- No sharing keyword on Apex classes — runs without sharing by default, potentially exposing data the user shouldn't see
- `@AuraEnabled(cacheable=true)` on methods that include DML — runtime error when called from @wire; hard to debug
- `global` methods in non-managed-package orgs — no namespace benefit; locks API surface unnecessarily
- No explicit `override` on a method that shadows a virtual method — compiles in some contexts but is a logic bug

**Enterprise-scale considerations:**
- The service layer pattern (Trigger → Handler → Service → Selector) with correct sharing keywords at each layer is the standard enterprise Apex architecture. Controllers and triggers run `with sharing`; service layer runs `inherited sharing`; data migration utilities run `without sharing`.
- Abstract base class + interface is the combination for truly extensible frameworks. Abstract handles common logic, interface defines the contract. Both are used in Apex Enterprise Patterns (Callable, Service Layer, Selector).
- For ISV packages, `global` is an API contract — once released, you cannot remove `global` methods or change their signatures without a major version bump. Minimize global surface area.

**For CTO conversations:**
- "How do we ensure developers write secure Apex?" — Code review checklist that includes: explicit sharing keyword on every class, @AuraEnabled(cacheable=true) only on read-only methods, no `global` without justification.
- "Our LWC components are slow" — Check if `@AuraEnabled` methods are called imperatively when they should be via `@wire` (cacheable=true), and vice versa.

## Architecture / How It Works

```
INHERITANCE HIERARCHY IN APEX

  Object (implicit root of all classes)
       │
       ├── Animal (virtual class)
       │       │
       │       ├── Dog (extends Animal, overrides speak())
       │       └── Cat (extends Animal, overrides speak())
       │
       ├── Shape (abstract class)
       │       │
       │       ├── Circle (concrete, implements area())
       │       └── Rectangle (concrete, implements area())
       │
       └── MyException (extends Exception)
               ← name MUST end in Exception

  Rules:
  - Cannot extend a non-virtual, non-abstract class
  - Must use override keyword when overriding virtual methods
  - All abstract methods must be implemented by concrete subclass
  - Single inheritance only (one extends); multiple implements allowed
```

**Limitations:**
- Apex only supports single class inheritance — `extends` can only reference one class
- Interfaces: multiple `implements` are allowed; `interface extends interface` is allowed
- `abstract` class cannot be instantiated — `new Shape()` → compile error

```
@AuraEnabled USAGE GUIDE

  Read-only (list/fetch data):
  ┌────────────────────────────────────────────────────────┐
  │  @AuraEnabled(cacheable=true)                          │
  │  public static List<Account> getAccounts() {           │
  │      return [SELECT Id, Name FROM Account LIMIT 50];   │
  │  }                                                     │
  │                                                        │
  │  LWC: @wire(getAccounts)  ← wire works with cacheable  │
  └────────────────────────────────────────────────────────┘

  Write/DML:
  ┌────────────────────────────────────────────────────────┐
  │  @AuraEnabled   ← no cacheable!                        │
  │  public static void saveAccount(Account a) {           │
  │      update a;                                         │
  │  }                                                     │
  │                                                        │
  │  LWC: import saveAccount from '@salesforce/apex/...'   │
  │  Call imperatively: await saveAccount({a: account});   │
  └────────────────────────────────────────────────────────┘
```

**Limitations:**
- `@AuraEnabled(cacheable=true)` with DML → runtime error: "System.AuraHandledException: Read access to sObject not permitted"
- `@wire` only works with `cacheable=true` — trying to wire a non-cacheable method doesn't work

```
SHARING KEYWORD SCOPE

  ╔═══════════════════════════════════════════════════════════╗
  ║  ALL RECORDS (system mode)                                ║
  ║  without sharing — sees everything regardless of user     ║
  ║  ┌─────────────────────────────────────────────────────┐  ║
  ║  │  USER'S RECORDS ONLY (sharing mode)                 │  ║
  ║  │  with sharing — respects OWD + sharing rules        │  ║
  ║  └─────────────────────────────────────────────────────┘  ║
  ║  inherited sharing — delegates decision to caller         ║
  ╚═══════════════════════════════════════════════════════════╝
  Note: All three modes always enforce CRUD + FLS.
  Sharing only controls RECORD visibility, not field/object access.
```

**Limitations:**
- `with sharing` does NOT automatically enforce FLS — you still need `WITH USER_MODE` in SOQL or `Security.stripInaccessible()`
- `inherited sharing` on a class called from an unspecified-sharing caller runs without sharing (inherits system context)

## Key Facts to Memorize
- Apex classes NOT inheritable by default — must be `virtual` or `abstract`
- `abstract` class cannot be instantiated
- `override` keyword required when overriding a virtual method
- `@AuraEnabled(cacheable=true)` required for `@wire`; NO DML allowed
- `@AuraEnabled` without cacheable: DML methods, called imperatively from JS
- `with sharing` enforces record-level rules only (not FLS, not object permissions)
- `inherited sharing` — right choice for service/utility classes
- `Comparable.compareTo()` returns negative/zero/positive for List.sort()

## Customer Advisory Tips
- **Sharing enforcement audit:** In security reviews, check every Apex class for explicit sharing keyword. Any class with implicit `without sharing` in user-facing operations is a data exposure risk.
- **LWC + Apex pattern:** `@AuraEnabled(cacheable=true)` for all read operations wired with `@wire`; `@AuraEnabled` (no cacheable) for all write operations called imperatively. This distinction is the foundation of proper LWC+Apex architecture.

## Exam Traps
- Apex classes default to NOT inheritable — adding `extends` to a non-virtual class = **compile error**
- `@AuraEnabled(cacheable=true)` with DML = **runtime error** (not compile error)
- `with sharing` does NOT enforce FLS — use `WITH USER_MODE` in SOQL for FLS
- `override` keyword is required — missing it on a method shadowing a virtual method = compile error
- Abstract class: cannot use `new AbstractClassName()` — compile error
- `Comparable.compareTo()` returns int: negative = this comes before, positive = this comes after

## Practice Questions

**Q:** A developer declares `public class Shape { public Decimal area() { return 0; } }`. Another developer tries `public class Circle extends Shape { }`. What happens?
**A:** Compile error — `Shape` is not marked `virtual` or `abstract`, so it cannot be extended. Add `virtual` to `Shape` to allow extension.

**Q:** An LWC needs to use `@wire` to call an Apex method. What annotation is required?
**A:** `@AuraEnabled(cacheable=true)` — the `cacheable=true` parameter is mandatory for `@wire` usage. The method must not perform any DML.

**Q:** A service class should run with the same sharing context as its caller. Which keyword?
**A:** `inherited sharing` — the class adopts the sharing mode of whatever called it. This is the correct pattern for reusable service classes that can be called from both with-sharing and without-sharing callers.
