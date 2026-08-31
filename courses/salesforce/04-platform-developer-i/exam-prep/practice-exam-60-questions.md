# Platform Developer I — 60-Question Practice Exam

## Instructions
- 60 questions, 110 minutes
- Passing score: 65% (39/60)
- Mix of single-answer and multi-select questions
- Multi-select questions are labeled "(Select all that apply)" or "(Select X)"

---

## Questions

### Section 1: Developer Fundamentals (Questions 1–14)

**1.** A developer wants to view debug logs generated during an Apex transaction. Which Developer Console tab should they use?

A) Schema Browser  
B) Query Editor  
C) Logs  
D) Source  

---

**2.** Which of the following is a valid Apex primitive data type? (Select all that apply)

A) Integer  
B) Object  
C) Blob  
D) Decimal  
E) DateTime  

---

**3.** A developer declares the following variable:

```apex
List<String> colors = new List<String>{'Red', 'Green', 'Blue'};
```

What is the result of `colors.size()`?

A) 0  
B) 2  
C) 3  
D) 4  

---

**4.** Which collection type in Apex automatically prevents duplicate values?

A) List  
B) Map  
C) Set  
D) Array  

---

**5.** A developer needs to store key-value pairs where each key is an Account Id and the value is the Account record. Which collection is best suited?

A) `List<Account>`  
B) `Set<Id>`  
C) `Map<Id, Account>`  
D) `Set<Account>`  

---

**6.** What is the output of the following Apex code?

```apex
Integer x = 10;
if (x > 5) {
    System.debug('High');
} else {
    System.debug('Low');
}
```

A) High  
B) Low  
C) Compile error  
D) null  

---

**7.** Which of the following statements about Apex classes is correct?

A) Apex classes can extend multiple parent classes  
B) Apex classes are compiled and stored as metadata  
C) Apex classes do not support interfaces  
D) Apex class names are case-sensitive  

---

**8.** A developer wants to log a message with the value of a variable for debugging. Which method is most appropriate?

A) `System.assert()`  
B) `System.debug()`  
C) `System.log()`  
D) `System.trace()`  

---

**9.** Which keyword is used to define a constant in Apex?

A) `static`  
B) `final`  
C) `const`  
D) `readonly`  

---

**10.** A developer runs a SOQL query in the Developer Console Query Editor. Where are results displayed?

A) In the Logs tab  
B) In the Query Results panel at the bottom  
C) In the Problems tab  
D) In the Source tab  

---

**11.** Which of the following loop types is supported in Apex? (Select all that apply)

A) `for` loop  
B) `while` loop  
C) `do-while` loop  
D) `foreach` loop  
E) List/Set iteration `for` loop  

---

**12.** What access modifier makes an Apex class or method visible only within its own class?

A) `public`  
B) `global`  
C) `private`  
D) `protected`  

---

**13.** A developer needs to define a blueprint that other Apex classes must implement with specific methods. Which Apex construct should they use?

A) Abstract class  
B) Virtual class  
C) Interface  
D) Static class  

---

**14.** Which statement about `static` methods in Apex is correct?

A) Static methods can access instance variables  
B) Static methods require an object instantiation to be called  
C) Static methods belong to the class, not a specific instance  
D) Static methods cannot be called from triggers  

---

### Section 2: Process Automation & Logic (Questions 15–32)

**15.** A developer writes the following query:

```apex
List<Account> accs = [SELECT Id, Name FROM Account WHERE Industry = 'Technology'];
```

How many SOQL governor limit queries does this consume?

A) 0  
B) 1  
C) 2  
D) It depends on the number of rows returned  

---

**16.** What is the maximum number of SOQL queries allowed in a single synchronous Apex transaction?

A) 50  
B) 100  
C) 150  
D) 200  

---

**17.** A developer needs to query all child Contact records related to their parent Account in a single query. Which query technique should they use?

A) Semi-join  
B) Parent-to-child relationship query (subquery)  
C) Anti-join  
D) Aggregate query  

---

**18.** Which of the following is a valid use of a SOQL date literal?

A) `WHERE CloseDate = LAST_YEAR`  
B) `WHERE CloseDate = 'LAST_YEAR'`  
C) `WHERE CloseDate EQUALS LAST_YEAR`  
D) `WHERE CloseDate LIKE LAST_YEAR`  

---

**19.** A developer uses `Database.insert(records, false)`. One record in the list fails due to a validation rule. What happens?

A) All records are rolled back  
B) The entire transaction throws an exception  
C) Only the failing record is not inserted; others succeed  
D) The operation is skipped entirely  

---

**20.** Which DML statement is used to insert or update a record based on an external ID field?

A) `Database.save()`  
B) `Database.merge()`  
C) `Database.upsert()`  
D) `Database.publish()`  

---

**21.** Which trigger context variable contains records in their state BEFORE the current operation for an update trigger?

A) `Trigger.new`  
B) `Trigger.old`  
C) `Trigger.newMap`  
D) `Trigger.isUpdate`  

---

**22.** Which Trigger context variables are available in a BEFORE DELETE trigger? (Select all that apply)

A) `Trigger.new`  
B) `Trigger.old`  
C) `Trigger.newMap`  
D) `Trigger.oldMap`  
E) `Trigger.isBefore`  

---

**23.** A developer is writing a trigger on the Account object. To prevent a record from being saved, which approach should they use in a before trigger?

A) `throw new DmlException('Error');`  
B) `Trigger.new[0].addError('Error message');`  
C) `Database.rollback(sp);`  
D) `return false;`  

---

**24.** Which Trigger context variable is NOT available in an AFTER DELETE trigger?

A) `Trigger.old`  
B) `Trigger.oldMap`  
C) `Trigger.new`  
D) `Trigger.isAfter`  

---

**25.** When should a developer use `@future` methods over synchronous Apex? (Select all that apply)

A) When making a callout from a trigger  
B) When needing to process millions of records in batches  
C) When you need to avoid mixed DML errors  
D) When you need to chain multiple asynchronous operations  

---

**26.** Which of the following is a key limitation of `@future` methods?

A) They cannot perform DML  
B) They can only accept primitive data types or collections of primitives as parameters  
C) They cannot be called from triggers  
D) They run in the same transaction as the caller  

---

**27.** A developer needs to process 2 million Account records and update a field on each. Which asynchronous Apex type is most appropriate?

A) `@future`  
B) Queueable Apex  
C) Batch Apex  
D) Scheduled Apex  

---

**28.** What is the default batch size for Batch Apex if not specified in the `execute` method?

A) 50  
B) 100  
C) 200  
D) 2000  

---

**29.** What is the maximum batch size a developer can specify in `Database.executeBatch()`?

A) 200  
B) 1000  
C) 2000  
D) 10000  

---

**30.** A developer needs to handle a situation where a SOQL query returns no records and the code tries to access the first element of the result list. Which exception should they guard against?

A) `NullPointerException`  
B) `ListException`  
C) `DmlException`  
D) `QueryException`  

---

**31.** What is the correct way to use a SOQL for loop to avoid heap size governor limits when processing large data sets?

A) `for (Account a : [SELECT Id FROM Account]) { }`  
B) `for (List<Account> accs : [SELECT Id FROM Account]) { }`  
C) `List<Account> accs = [SELECT Id FROM Account]; for(Account a : accs) { }`  
D) `SOQL for loops do not help with heap size`  

---

**32.** Which of the following is true about the difference between `with sharing` and `without sharing` in Apex?

A) `with sharing` enforces field-level security but not sharing rules  
B) `without sharing` enforces CRUD permissions but ignores sharing rules  
C) `with sharing` enforces the sharing rules of the running user  
D) `without sharing` is the default behavior for all Apex classes  

---

### Section 3: User Interface (Questions 33–47)

**33.** Which Visualforce component is used to display a standard or custom object's detail view?

A) `<apex:form>`  
B) `<apex:pageBlock>`  
C) `<apex:detail>`  
D) `<apex:outputField>`  

---

**34.** A developer creates a Visualforce page with a standard controller for the Account object. Which statement is correct?

A) The developer must write a custom Apex controller to use the Account object  
B) The standard controller provides built-in save, edit, and delete actions  
C) Standard controllers cannot be used with `<apex:form>`  
D) Standard controllers do not support the `recordId` attribute  

---

**35.** What is the maximum view state size for a Visualforce page?

A) 15 KB  
B) 100 KB  
C) 170 KB  
D) 512 KB  

---

**36.** Which of the following can a developer do to reduce Visualforce view state size? (Select all that apply)

A) Mark controller variables with `transient` keyword  
B) Use `<apex:outputPanel>` with `layout="none"`  
C) Avoid storing large collections in controller variables  
D) Increase the heap size limit  

---

**37.** A Visualforce page uses a custom controller. Which method signature is required for the controller to work with `<apex:actionFunction>`?

A) A method returning `void`  
B) A method returning `PageReference`  
C) A method returning `String`  
D) Both A and B are valid  

---

**38.** In LWC, which decorator is used to declare a public property that a parent component can set?

A) `@track`  
B) `@api`  
C) `@wire`  
D) `@public`  

---

**39.** Which LWC template directive is used to render a list of items?

A) `lwc:for`  
B) `for:each`  
C) `iterate:each`  
D) `template:repeat`  

---

**40.** A developer wants to call an Apex method from LWC and have it automatically called whenever a component property changes. Which approach should they use?

A) `import` the method and call it in `connectedCallback()`  
B) Use `@wire` with the Apex method decorated with `@AuraEnabled(cacheable=true)`  
C) Use `@wire` with the Apex method decorated with `@AuraEnabled` only  
D) Use `@track` to watch for changes and call the method manually  

---

**41.** Which decorator must be applied to an Apex method to make it available via the `@wire` service in LWC?

A) `@AuraEnabled`  
B) `@AuraEnabled(cacheable=true)`  
C) `@InvocableMethod`  
D) `@RemoteAction`  

---

**42.** A developer has a wired property in an LWC component that displays data from Apex. The user performs an action that changes the underlying data. What must the developer do to refresh the wired data?

A) Call `this.refresh()`  
B) Call `refreshApex()` with the wired property  
C) Re-import the Apex method  
D) Toggle the `@track` decorator  

---

**43.** Which LWC template directive conditionally renders a block of HTML?

A) `lwc:show`  
B) `lwc:if`  
C) `if:true`  
D) `template:if`  

---

**44.** How does a child LWC component communicate an event to its parent component?

A) By directly modifying the parent's `@api` property  
B) By dispatching a `CustomEvent` using `this.dispatchEvent()`  
C) By calling the parent's method via a public `@api` method  
D) By using `LightningMessageService`  

---

**45.** Which statement about `@track` in LWC is correct in the current (post-Spring '20) model?

A) All component properties must be decorated with `@track` to be reactive  
B) `@track` is required for primitive values to be reactive  
C) `@track` is only needed to make object properties and array elements reactive (deep reactivity)  
D) `@track` has been completely removed and is no longer valid  

---

**46.** A developer needs to pass data from a parent LWC to a child LWC component. Which mechanism should they use?

A) Dispatch a `CustomEvent` from the parent  
B) Declare a public `@api` property in the child and set it from the parent template  
C) Use `@wire` in the parent to push data down  
D) Use `LightningMessageService` for parent-to-child communication  

---

**47.** Which file is NOT a required part of a standard LWC component bundle?

A) `componentName.html`  
B) `componentName.js`  
C) `componentName.css`  
D) `componentName.js-meta.xml`  

---

### Section 4: Testing, Debugging & Deployment (Questions 48–60)

**48.** What is the minimum code coverage percentage required to deploy Apex code to a production org?

A) 50%  
B) 65%  
C) 75%  
D) 80%  

---

**49.** A developer has a class with 100 executable lines. What is the minimum number of lines that must be covered by tests to meet the deployment requirement?

A) 50  
B) 65  
C) 75  
D) 80  

---

**50.** Which annotation marks a method that runs once before all test methods in a test class and creates shared test data?

A) `@isTest(SeeAllData=true)`  
B) `@testSetup`  
C) `@testInitialize`  
D) `@beforeAll`  

---

**51.** Why should developers avoid using `@isTest(SeeAllData=true)` in test classes?

A) It causes test methods to run in parallel, introducing race conditions  
B) It allows tests to see production data, making tests non-deterministic and fragile  
C) It prevents the use of `Test.startTest()` and `Test.stopTest()`  
D) It is deprecated and no longer supported  

---

**52.** Which pair of methods is used to reset governor limits and test asynchronous Apex behavior in tests?

A) `Test.start()` / `Test.end()`  
B) `Test.beginTest()` / `Test.commitTest()`  
C) `Test.startTest()` / `Test.stopTest()`  
D) `Test.run()` / `Test.verify()`  

---

**53.** A test method calls a `@future` method. To ensure the future method has executed before making assertions, what must the developer do?

A) Add `Thread.sleep(1000)` after the call  
B) Call the future method assertions immediately after dispatching  
C) Wrap the `@future` call between `Test.startTest()` and `Test.stopTest()`  
D) Use `Database.setSavepoint()` before the future call  

---

**54.** Which of the following is a best practice for writing Apex unit tests? (Select all that apply)

A) Test bulk operations with 200 or more records  
B) Test negative scenarios and exception paths  
C) Use `@isTest(SeeAllData=true)` for all data access  
D) Use `Test.createStub()` or mock interfaces for callouts  
E) Always use `System.assert()` statements to verify outcomes  

---

**55.** A developer needs to test an Apex class that makes an HTTP callout. What must be done to allow the test to succeed without making a real HTTP request?

A) Annotate the test class with `@isTest(AllowCallouts=true)`  
B) Implement `HttpCalloutMock` and register it with `Test.setMock()`  
C) Use `@future(callout=true)` in the test method  
D) Set the mock endpoint in the class before running the test  

---

**56.** A developer is troubleshooting a production issue and needs to enable debug logging for a specific user. Where in Setup should they go?

A) Debug Logs under Apex  
B) Apex Test Execution  
C) Debug > Logs in Developer Console  
D) Monitor > Logs in Setup  

---

**57.** Which deployment tool uses metadata XML files and allows developers to retrieve and deploy components using a package.xml manifest?

A) Change Sets  
B) Salesforce CLI (`sf` / `sfdx`)  
C) Ant Migration Tool  
D) Both B and C  

---

**58.** A developer completes a feature in a sandbox and needs to deploy Apex classes and a custom object to production. Which deployment methods are available? (Select all that apply)

A) Change Sets  
B) Salesforce CLI with source deploy  
C) Metadata API  
D) Direct inline editing in production  
E) AppExchange package  

---

**59.** Which of the following correctly describes the behavior of `System.assert()`, `System.assertEquals()`, and `System.assertNotEquals()`?

A) `System.assert(condition)` passes if `condition` is true  
B) `System.assertEquals(expected, actual)` passes if the values are not equal  
C) `System.assertNotEquals(val1, val2)` passes if `val1 == val2`  
D) All assert methods continue test execution after failure  

---

**60.** A developer deploys code to production using Salesforce CLI. Which of the following is true about the test execution during deployment?

A) Tests are never run when deploying to production  
B) All local tests run by default when deploying to production, and 75% coverage is required  
C) Only tests in the package being deployed run by default  
D) Test execution is optional and can always be skipped  

---

## Answer Key

| # | Answer | Topic |
|---|--------|-------|
| 1 | C | Developer Fundamentals — Developer Console |
| 2 | A, C, D, E | Developer Fundamentals — Data Types |
| 3 | C | Developer Fundamentals — Collections |
| 4 | C | Developer Fundamentals — Collections |
| 5 | C | Developer Fundamentals — Collections |
| 6 | A | Developer Fundamentals — Control Flow |
| 7 | B | Developer Fundamentals — Apex Basics |
| 8 | B | Developer Fundamentals — Debugging |
| 9 | B | Developer Fundamentals — Variables |
| 10 | B | Developer Fundamentals — Developer Console |
| 11 | A, B, C, E | Developer Fundamentals — Control Flow |
| 12 | C | Developer Fundamentals — Access Modifiers |
| 13 | C | Developer Fundamentals — OOP |
| 14 | C | Developer Fundamentals — OOP |
| 15 | B | Process Automation — SOQL |
| 16 | B | Process Automation — Governor Limits |
| 17 | B | Process Automation — SOQL |
| 18 | A | Process Automation — SOQL |
| 19 | C | Process Automation — DML |
| 20 | C | Process Automation — DML |
| 21 | B | Process Automation — Triggers |
| 22 | B, D, E | Process Automation — Triggers |
| 23 | B | Process Automation — Triggers |
| 24 | C | Process Automation — Triggers |
| 25 | A, C | Process Automation — Async Apex |
| 26 | B | Process Automation — Async Apex |
| 27 | C | Process Automation — Async Apex |
| 28 | C | Process Automation — Async Apex |
| 29 | C | Process Automation — Async Apex |
| 30 | B | Process Automation — Exception Handling |
| 31 | B | Process Automation — SOQL |
| 32 | C | Process Automation — Sharing |
| 33 | C | User Interface — Visualforce |
| 34 | B | User Interface — Visualforce Controllers |
| 35 | C | User Interface — Visualforce |
| 36 | A, C | User Interface — Visualforce |
| 37 | D | User Interface — Visualforce Controllers |
| 38 | B | User Interface — LWC |
| 39 | B | User Interface — LWC |
| 40 | B | User Interface — LWC Wire |
| 41 | B | User Interface — LWC Wire |
| 42 | B | User Interface — LWC Wire |
| 43 | B | User Interface — LWC |
| 44 | B | User Interface — LWC Events |
| 45 | C | User Interface — LWC |
| 46 | B | User Interface — LWC Events |
| 47 | C | User Interface — LWC |
| 48 | C | Testing — Code Coverage |
| 49 | C | Testing — Code Coverage |
| 50 | B | Testing — Test Best Practices |
| 51 | B | Testing — Test Best Practices |
| 52 | C | Testing — Async Testing |
| 53 | C | Testing — Async Testing |
| 54 | A, B, D, E | Testing — Test Best Practices |
| 55 | B | Testing — Callout Mocking |
| 56 | A | Debugging — Debug Logs |
| 57 | D | Deployment — Tools |
| 58 | A, B, C | Deployment — Methods |
| 59 | A | Testing — Assert Methods |
| 60 | B | Deployment — Production |

---

## Explanations

**1.** C — The **Logs** tab in Developer Console displays debug logs from Apex transactions. Schema Browser is for object metadata, Query Editor runs SOQL, and Source is for code editing.

**2.** A, C, D, E — Apex primitive types include `Integer`, `Long`, `Double`, `Decimal`, `String`, `Boolean`, `Date`, `DateTime`, `Time`, `Blob`, and `ID`. `Object` is a root data type but not a primitive; it holds any value.

**3.** C — The list is initialized with three string literals: `'Red'`, `'Green'`, `'Blue'`. `size()` returns `3`.

**4.** C — A **Set** does not allow duplicate values and has no defined order. A List allows duplicates. A Map allows duplicate values (but not duplicate keys).

**5.** C — `Map<Id, Account>` maps each Account's Id key to its Account record, enabling O(1) lookup by Id. This is the idiomatic Apex pattern for keying records by Id.

**6.** A — `x = 10` is greater than `5`, so the condition is true and `'High'` is logged.

**7.** B — Apex classes are compiled at save time and stored as metadata in the org. Apex does not support multiple inheritance (A is wrong), Apex supports interfaces (C is wrong), and Apex identifiers are NOT case-sensitive (D is wrong).

**8.** B — `System.debug()` writes a message to the debug log. `System.assert()` is for test assertions, and `System.log()` / `System.trace()` do not exist.

**9.** B — The `final` keyword makes a variable a constant; its value cannot be changed after assignment. Apex does not have a `const` or `readonly` keyword.

**10.** B — In Developer Console, SOQL query results appear in the **Query Results** panel at the bottom of the screen.

**11.** A, B, C, E — Apex supports traditional `for`, `while`, `do-while`, and the list/set/map iteration `for` loop (`for (Type item : collection)`). There is no `foreach` keyword in Apex.

**12.** C — `private` restricts visibility to the declaring class only. `protected` is accessible to the class and its subclasses. `public` is accessible within the same namespace. `global` is accessible from anywhere.

**13.** C — An **interface** defines method signatures that implementing classes must provide. Abstract classes can have both implemented and abstract methods but cannot define a pure contract like an interface.

**14.** C — Static methods belong to the class itself and can be called without instantiating an object. They cannot access instance (non-static) variables directly.

**15.** B — Each SOQL query statement counts as **1** against the 100 synchronous query limit, regardless of how many rows it returns.

**16.** B — The synchronous SOQL query limit per transaction is **100**. Asynchronous transactions allow 200.

**17.** B — A **parent-to-child relationship subquery** (e.g., `SELECT Id, (SELECT Id FROM Contacts) FROM Account`) retrieves child records in a single query.

**18.** A — SOQL date literals like `LAST_YEAR`, `THIS_MONTH`, `LAST_N_DAYS:n` are used without quotes in the `WHERE` clause: `WHERE CloseDate = LAST_YEAR`.

**19.** C — When `allOrNone=false` (the second parameter of `Database.insert()`), partial success is allowed. Records that fail validation are skipped, and successful records are committed. No exception is thrown; check `SaveResult` for failures.

**20.** C — `Database.upsert()` performs an insert if no match is found on the external ID, or an update if a match exists. `merge()` combines duplicate records.

**21.** B — `Trigger.old` is a list of records in their state **before** the current DML operation. Available in update and delete triggers. `Trigger.new` has the new/modified values.

**22.** B, D, E — In a BEFORE DELETE trigger, `Trigger.old` (list) and `Trigger.oldMap` (map by Id) contain the records being deleted. `Trigger.new` and `Trigger.newMap` do not exist for delete triggers. `Trigger.isBefore` is a Boolean available in all trigger contexts.

**23.** B — Calling `addError()` on a record in a before trigger prevents the DML operation for that record and surfaces the message to the user. `throw new DmlException` aborts the entire transaction but is less user-friendly.

**24.** C — `Trigger.new` is NOT available in an AFTER DELETE trigger. Only `Trigger.old` and `Trigger.oldMap` are available in delete triggers (both before and after).

**25.** A, C — `@future` is commonly used to make callouts from triggers (since callouts are not allowed in synchronous trigger execution) and to perform operations on different object types to avoid mixed DML errors. For chaining, use Queueable. For mass data, use Batch.

**26.** B — `@future` methods only accept **primitive data types** (String, Integer, Boolean, etc.) or collections of primitives. You cannot pass sObject records or complex objects as parameters.

**27.** C — **Batch Apex** (`Database.Batchable`) is designed for processing large volumes of records in chunks. It is the correct choice for millions of records. `@future` and Queueable have much smaller scopes.

**28.** C — If no batch size is specified, Batch Apex defaults to **200** records per `execute()` call.

**29.** C — The maximum batch size you can pass to `Database.executeBatch(job, batchSize)` is **2000**. The default is 200.

**30.** B — Accessing an index beyond the list's bounds throws a `System.ListException`. A single-record query that returns no rows with a direct assignment (e.g., `Account a = [SELECT...]`) throws a `QueryException`. Guarding with `isEmpty()` is best practice.

**31.** B — The **chunked SOQL for loop** (`for (List<Account> chunk : [SELECT...])`) processes records in batches of 200, passing chunks to the runtime. This avoids loading all records into heap at once. Option A loads all records but iterates one at a time — it does help somewhat with the standard for loop, but the list-based form (B) is specifically optimized.

**32.** C — `with sharing` enforces the **sharing rules** of the running user, meaning records the user cannot see are excluded from queries. It does not enforce field-level security (FLS) — that must be handled separately.

**33.** C — `<apex:detail>` renders the standard detail view of a record. `<apex:pageBlock>` is a generic page section, `<apex:outputField>` renders a single field, and `<apex:form>` is a form wrapper.

**34.** B — Standard controllers provide built-in actions like `save()`, `edit()`, `delete()`, `cancel()`, and navigation methods out of the box.

**35.** C — The Visualforce view state limit is **170 KB**. Exceeding this causes a "Maximum view state size limit exceeded" error.

**36.** A, C — Marking variables `transient` excludes them from view state serialization. Avoiding large collections in controller properties reduces data stored in view state. `<apex:outputPanel>` affects rendering but does not directly reduce view state. Heap size is a separate governor limit.

**37.** D — `<apex:actionFunction>` can invoke controller methods returning either `void` (stays on page) or `PageReference` (navigates to new page). Both are valid return types.

**38.** B — `@api` declares a **public property** that a parent component can read and set. `@track` is for deep reactivity. `@wire` fetches data.

**39.** B — `for:each={list}` is the LWC directive for iterating over a list. It requires a `key` attribute. Note: `lwc:if` is for conditionals, not iteration.

**40.** B — The `@wire` service automatically calls an Apex method decorated with `@AuraEnabled(cacheable=true)` and re-invokes it when reactive properties (those prefixed with `$`) change. Without `cacheable=true`, `@wire` will fail.

**41.** B — `@AuraEnabled(cacheable=true)` is required to use an Apex method with `@wire`. `cacheable=true` tells the platform the method has no side effects and can be cached and called reactively.

**42.** B — `refreshApex(wiredProperty)` from the `lightning/refresh` module re-invokes the wired Apex method and refreshes the cached data. Without it, stale data is displayed after mutations.

**43.** B — `lwc:if` is the modern (API v55+) conditional rendering directive. The older `if:true` and `if:false` directives are deprecated but may still appear on the exam.

**44.** B — Child-to-parent communication in LWC uses `CustomEvent` dispatched via `this.dispatchEvent(new CustomEvent('eventname', { detail: data }))`. The parent listens with `oneventname` in its template.

**45.** C — Since Spring '20, all reactive properties are tracked by default. `@track` is only needed for **deep reactivity** — when you want the component to re-render in response to changes in nested object properties or array element mutations, not just reassignment of the top-level reference.

**46.** B — Parent-to-child data passing uses public `@api` properties in the child. The parent binds a value to the child property in the template: `<c-child my-prop={parentData}></c-child>`.

**47.** C — The `.css` file is **optional** in an LWC bundle. The required files are: `.html` (template), `.js` (controller), and `.js-meta.xml` (configuration/metadata).

**48.** C — Salesforce requires **75%** code coverage across all non-test Apex classes and triggers to deploy to production.

**49.** C — 75% of 100 lines = **75 lines** minimum must be covered. Note: coverage is measured at the org level for all classes, not per-class, but per-class coverage is a good practice.

**50.** B — `@testSetup` marks a method that runs once before any test methods in the class, creates shared test data in the database, and each test method rolls back changes afterward (data is reset).

**51.** B — `@isTest(SeeAllData=true)` gives the test access to real org data. This makes tests dependent on live data that can change, causing tests to pass in some orgs and fail in others — violating test isolation and determinism.

**52.** C — `Test.startTest()` and `Test.stopTest()` reset governor limits within the test and force asynchronous operations (like `@future` and queueable jobs) to execute before `stopTest()` returns.

**53.** C — Wrapping the `@future` call in `Test.startTest()` / `Test.stopTest()` forces the future method to run synchronously before `stopTest()` returns. Assertions placed after `stopTest()` can then verify the future method's work.

**54.** A, B, D, E — Best practices include bulk testing (200 records), testing negative/failure paths, mocking callouts with `HttpCalloutMock`, and always asserting outcomes. Using `SeeAllData=true` (option C) is an anti-pattern.

**55.** B — To test classes that make HTTP callouts, implement the `HttpCalloutMock` interface (or `StaticResourceCalloutMock`) and register it with `Test.setMock(HttpCalloutMock.class, mockInstance)`. This intercepts the outbound HTTP call.

**56.** A — **Debug Logs** under Setup > Environments > Logs > Debug Logs allows you to set up logging for specific users, including log level and duration. Developer Console also shows logs but Setup is where you configure them for other users.

**57.** D — Both **Salesforce CLI** (`sf project deploy`) and the **Ant Migration Tool** use metadata XML and `package.xml`. Change Sets use a UI-based approach without XML manifests.

**58.** A, B, C — Valid deployment methods include Change Sets (UI-based), Salesforce CLI with source/metadata deploy, and Metadata API. Direct editing in production is blocked for Apex (D). AppExchange packages are for distributing apps, not direct deployments (E).

**59.** A — `System.assert(condition)` passes when `condition` evaluates to `true`. `assertEquals(expected, actual)` passes when they ARE equal (B is wrong). `assertNotEquals` passes when they are NOT equal (C is wrong). All assert methods **stop** the test immediately on failure (D is wrong).

**60.** B — When deploying Apex to production, Salesforce runs all local tests (tests in your org) by default, and the overall code coverage must be at least 75%. You cannot skip test execution when deploying to production.
