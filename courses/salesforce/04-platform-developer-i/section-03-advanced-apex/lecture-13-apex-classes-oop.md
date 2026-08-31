# Apex Classes and Object-Oriented Programming

## Learning Objectives
- Apply inheritance using virtual, override, and abstract keywords in Apex
- Implement standard interfaces such as Comparable and Iterable in custom classes
- Use inner classes appropriately and explain the sharing model keywords
- Annotate methods with @AuraEnabled to expose Apex to LWC and Aura components

## Slides

### Slide 1: OOP Foundations in Apex
**Visual:** Class hierarchy diagram showing a base class with arrows pointing to two subclasses, with a method override callout on one subclass
**Content:**
- Apex is an object-oriented language modeled closely on Java
- Key OOP concepts: encapsulation, inheritance, polymorphism, abstraction
- Every Apex class implicitly extends `Object` (the root of all classes)
- Classes are `public` or `private` by default in most contexts
- Access modifiers: `global`, `public`, `protected`, `private`
**Speaker Notes:** Most Salesforce developers learn OOP concepts on the job through Apex rather than in a formal CS curriculum. The PDI exam tests practical application — you need to know which keyword to use in a given scenario and what the keyword does to a method or class. Let's build up from the fundamentals.

### Slide 2: Inheritance — virtual, override, abstract
**Visual:** Code snippet showing a virtual base class with a virtual method, a subclass using extends and override, and a second subclass that provides a different override
**Content:**
- `virtual` keyword: marks a class or method as extendable/overridable
- `override` keyword: required on a subclass method that overrides a virtual method
- `abstract` class: cannot be instantiated; subclasses must implement abstract methods
- `abstract` method: declared without a body; forces subclasses to provide an implementation
- Without `virtual`, a class is effectively `final` — cannot be extended
**Speaker Notes:** In Apex, unlike Java, a class is NOT inheritable by default — you must explicitly mark it virtual or abstract to allow subclassing. This is a key difference from Java and a frequent exam question. If you see a class without either keyword, a subclass using extends will cause a compile error. Abstract methods must be implemented by every concrete subclass; virtual methods have a default implementation that subclasses may optionally override.

### Slide 3: Interfaces — Comparable and Iterable
**Visual:** Diagram showing a custom Apex class implementing Comparable with a compareTo() method, and a sortable list using List.sort() leveraging that implementation
**Content:**
- Interfaces declare a contract — implementing class must provide all method bodies
- `Comparable` interface: implement `compareTo(Object compareTo)` to enable `List.sort()`
- `Iterable<T>` interface: implement `iterator()` returning an `Iterator<T>` for custom iteration
- `Iterator<T>` interface: requires `hasNext()` and `next()` methods
- Custom interfaces use `interface` keyword; implementing class uses `implements`
**Speaker Notes:** The Comparable interface is the most commonly tested interface on the PDI exam. When you call List.sort() on a list of objects that implement Comparable, Apex uses the compareTo() method to determine order. The method returns a negative integer, zero, or positive integer — negative means "this object should come before the comparison target." The Iterable interface allows custom classes to be used in for-each loops and as the return type of Batch start() methods.

### Slide 4: Inner Classes
**Visual:** Code block showing a top-level Apex class containing an inner class declaration, with an instance of the inner class being created by the outer class
**Content:**
- Inner classes are declared inside another class using a nested class block
- Used to logically group closely related classes (e.g., request/response wrappers for JSON)
- Inner classes can be `static` — accessible without an instance of the outer class
- Non-static inner classes have access to instance members of the outer class
- Common use: wrapper class for `@AuraEnabled` return types, test data builders
**Speaker Notes:** Inner classes are frequently used in integration code to define typed representations of JSON request and response bodies. You declare a class with the exact property names that match the JSON fields, then use JSON.deserialize() to map the JSON string to instances of those classes. This is cleaner than working with untyped Maps. Inner classes are also used extensively in test classes as private data builders.

### Slide 5: @AuraEnabled Annotation
**Visual:** Apex method with @AuraEnabled(cacheable=true) annotation and a Lightning Web Component JavaScript file calling getAccountList via @wire
**Content:**
- `@AuraEnabled` exposes an Apex method to LWC and Aura components
- `@AuraEnabled(cacheable=true)` — required for `@wire` adapter calls from LWC
- Methods without `cacheable=true` must be called imperatively (not via @wire)
- `@AuraEnabled` methods must be `static` and `public` or `global`
- DML operations (insert/update/delete) must NOT be cacheable — use imperative calls
**Speaker Notes:** The cacheable=true distinction is critical for the exam and for practical LWC development. A method marked cacheable=true tells Salesforce it's safe to cache the result in the client-side cache — this means it must not perform DML. If you try to put DML in a cacheable=true method, Salesforce throws a runtime error. Use cacheable=true for read-only data fetching via @wire, and leave it off for any method that writes data, which must be called imperatively.

### Slide 6: Sharing Rules — with sharing, without sharing, inherited sharing
**Visual:** Three boxes labeled with the three keywords, each showing which records an Apex class running in that mode can see, with arrows indicating the org-wide defaults and sharing rules applied or bypassed
**Content:**
- `with sharing`: enforces record-level sharing rules of the running user
- `without sharing`: bypasses sharing rules — class sees all records regardless of user
- `inherited sharing`: adopts the sharing context of the calling class
- Default when no keyword is specified: unspecified sharing (similar to without sharing in most contexts)
- Best practice: always explicitly declare sharing; `inherited sharing` for utility classes
**Speaker Notes:** The sharing keyword is about record visibility — it does not affect field-level security or object-level security, which are always enforced. without sharing is sometimes necessary for system-level operations (like a managed package performing maintenance), but should be used sparingly and with intention. The inherited sharing keyword was introduced to make service classes that can be called from both with-sharing and without-sharing callers behave correctly based on the calling context.

### Slide 7: Access Modifiers and Class Design
**Visual:** Visibility matrix showing which modifier — global, public, protected, private — is visible from different scopes: same class, subclass, same namespace, different namespace
**Content:**
- `global`: visible to all Apex code in all namespaces (use for managed package APIs)
- `public`: visible within the same namespace and Apex code in the org
- `protected`: visible to the class and any subclasses (used with virtual/abstract)
- `private`: visible only within the declaring class (default for inner classes)
- Variables: best practice is `private` with `public` getter/setter properties
**Speaker Notes:** The distinction between `public` and `global` matters most in managed packages. For custom development in a standard org, `public` is almost always the right choice for methods you intend to expose. Protected is specifically designed for OOP inheritance scenarios — a method or property marked protected in a virtual class is visible to subclasses but not to external callers.

### Slide 8: Practical OOP Patterns
**Visual:** Service Layer pattern diagram: Controller class calls a Service class marked with sharing keyword, which calls a Repository/Selector class for SOQL
**Content:**
- **Service Layer pattern**: separate business logic from trigger handlers and controllers
- Triggers should be thin — delegate to trigger handler class
- Use interfaces for testability: swap real implementation for test mock
- Use abstract base class when multiple subclasses share common logic
- Inner wrapper classes for complex return types from @AuraEnabled methods
**Speaker Notes:** The most important practical OOP pattern in Salesforce development is the service layer: your trigger calls a trigger handler class, which calls a service class for business logic, which calls a selector/repository class for SOQL. This separation makes code testable, readable, and maintainable. On the exam, questions about class design often test whether you know which OOP feature — virtual, abstract, interface — best fits a described scenario.

## Recording Script

Welcome to Lecture 13 on Apex Classes and Object-Oriented Programming. Whether you're new to OOP concepts or coming from another language, this lecture covers the Apex-specific nuances that show up on the PDI exam.

Let's start with inheritance. In Apex — unlike Java — a class is not inheritable by default. To allow a class to be extended, you must explicitly mark it as virtual or abstract. Virtual classes can be extended and their methods can be overridden. Abstract classes must be extended; they cannot be instantiated directly, and abstract methods must be implemented by every subclass. When a subclass overrides a virtual method, it must use the override keyword — omitting it causes a compile error.

Interfaces define a contract without providing any implementation. The two standard interfaces you'll encounter most are Comparable and Iterable. Comparable lets you implement a compareTo() method so that List.sort() can sort instances of your class. Iterable lets you implement a custom iterator so your class can be used in for-each loops or as the return type of a Batch Apex start() method.

Inner classes are classes declared inside another class. They're useful for grouping closely related types — the most common use case is defining typed wrapper classes for JSON serialization and deserialization in integration code. They're also used in test classes for helper and builder patterns.

The @AuraEnabled annotation is what exposes an Apex method to Lightning Web Components and Aura components. For a method to be used with the @wire decorator in an LWC, it must be marked @AuraEnabled(cacheable=true). This tells Salesforce the method is read-only and safe to cache. Any method that performs DML must not have cacheable=true — it must be called imperatively from JavaScript. All @AuraEnabled methods must be static and public or global.

Sharing keywords control whether an Apex class respects the running user's record-level sharing rules. With sharing enforces those rules — the class sees only the records the user has access to. Without sharing bypasses them. Inherited sharing adopts the context of whatever called it. Always declare sharing explicitly; never leave it unspecified.

Finally, access modifiers: global is for managed package APIs visible across namespaces, public is the standard visibility modifier, protected is for members that should be accessible in subclasses but not externally, and private is for internal class members.

## Exam Tips
- In Apex, classes are NOT inheritable by default — you must explicitly mark them as `virtual` or `abstract` to allow subclassing; this is unlike Java
- `@AuraEnabled(cacheable=true)` is required for methods called via `@wire` in LWC; methods with `cacheable=true` must not perform DML
- `with sharing` enforces the running user's record-level sharing rules; it does NOT affect field-level security or object-level permissions
- The `Comparable` interface requires implementing `compareTo(Object compareTo)` which returns a negative integer (less than), zero (equal), or positive integer (greater than)
- `inherited sharing` makes a class adopt the sharing context of its caller — use it for utility/service classes that can be called from both with-sharing and without-sharing contexts

## Lecture Summary
Apex OOP builds on Java-like concepts but with Salesforce-specific rules: classes must be explicitly marked virtual or abstract to allow inheritance, and subclass method overrides require the override keyword. Interfaces such as Comparable and Iterable define contracts that enable framework features like List.sort() and for-each iteration. The @AuraEnabled annotation exposes Apex methods to Lightning components, with the cacheable=true variant required for @wire usage in LWC but prohibited for methods performing DML. Sharing keywords — with sharing, without sharing, and inherited sharing — control whether a class respects or bypasses the running user's record-level security, and should always be explicitly declared.

## Mini Quiz

**Q1:** A developer wants to create an Apex class that can be extended by subclasses but cannot itself be instantiated. Which declaration is correct?
A) `public class BaseProcessor { }`
B) `public virtual class BaseProcessor { }`
C) `public abstract class BaseProcessor { }`
D) `public interface BaseProcessor { }`

**Answer:** C — An abstract class cannot be instantiated but can be extended. A virtual class CAN be instantiated and extended. An interface is not a class. A class with no keyword can be instantiated but NOT extended — it's final by default in Apex.

**Q2:** An LWC needs to display a list of Accounts fetched from Apex using the @wire decorator. What annotation must the Apex method have?
A) `@AuraEnabled`
B) `@AuraEnabled(cacheable=true)`
C) `@AuraEnabled(callout=true)`
D) `@RemoteAction`

**Answer:** B — The `@wire` decorator in LWC requires the Apex method to be annotated with `@AuraEnabled(cacheable=true)`. Without `cacheable=true`, the wire adapter will not work. `@RemoteAction` is for Visualforce Remote Objects, not LWC.

**Q3:** A utility class makes SOQL queries that should return different results depending on whether the calling class uses `with sharing` or `without sharing`. Which keyword should the utility class use?
A) `with sharing`
B) `without sharing`
C) `inherited sharing`
D) No keyword — leave it unspecified

**Answer:** C — `inherited sharing` causes the class to adopt the sharing context of its caller. If the caller uses with sharing, the utility class also runs with sharing. If the caller uses without sharing, the utility class follows suit. This is the correct pattern for reusable service and utility classes.
