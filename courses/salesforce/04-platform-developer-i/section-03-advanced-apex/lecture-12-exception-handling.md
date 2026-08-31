# Exception Handling in Apex

## Learning Objectives
- Write try/catch/finally blocks to handle and recover from Apex exceptions
- Identify the most common built-in exception types and the scenarios that trigger each
- Create custom exception classes using Salesforce naming conventions
- Compare Database.insert() allOrNone behavior to the DML statement equivalent and handle partial success

## Slides

### Slide 1: Why Exception Handling Matters
**Visual:** Split screen — left shows an unhandled NullPointerException error page visible to an end user; right shows a friendly custom error message displayed via a catch block
**Content:**
- Unhandled exceptions surface raw stack traces to users — poor experience and security risk
- Proper exception handling allows recovery, logging, and graceful degradation
- Some exceptions are expected business conditions (record not found, validation failure)
- Others indicate programming bugs (null pointer, type mismatch)
- Exception handling is the difference between a fragile and a production-ready system
**Speaker Notes:** On the exam, exception handling questions test syntax knowledge and exception type recognition. In practice, poor exception handling is one of the top causes of user-facing errors in Salesforce orgs. Well-written Apex handles expected exceptions gracefully and lets unexpected ones surface clearly in logs for debugging.

### Slide 2: try / catch / finally Syntax
**Visual:** Code block color-coded in three sections: try block in blue, catch block in orange, finally block in green, with annotations pointing to each
**Content:**
- `try` block: code that might throw an exception
- `catch(ExceptionType e)` block: handles a specific exception type
- Multiple `catch` blocks allowed — most specific type first
- `finally` block: always executes whether or not an exception was thrown
- `finally` is used for resource cleanup (closing connections, clearing state)
**Speaker Notes:** The structure is: try the risky operation, catch specific exceptions and handle them, and use finally for cleanup that must always run. You can stack multiple catch blocks for different exception types — Apex checks them in order and executes only the first matching one. The finally block runs even if you re-throw an exception inside catch, making it reliable for cleanup like clearing temporary lists or logging transaction boundaries.

### Slide 3: Common Built-In Exception Types
**Visual:** Table with two columns — Exception Type and Trigger Scenario — listing five common exceptions with real-world examples
**Content:**
- `NullPointerException`: dereferencing a null variable (`account.Name` when account is null)
- `DmlException`: DML operation fails (required field missing, validation rule, duplicate rule)
- `QueryException`: SOQL returns wrong number of rows (0 or 2+ rows in a single-row query)
- `LimitException`: governor limit exceeded — NOT catchable, transaction always rolls back
- `CalloutException`: HTTP callout fails (connection timeout, SSL error, invalid endpoint)
**Speaker Notes:** QueryException is one of the most common runtime errors: a SOQL statement using assignment (Account a = [SELECT Id FROM Account WHERE Name = 'Acme']) throws QueryException if it returns 0 rows or more than 1 row. The safe pattern is to query into a List and check the list size before accessing elements. LimitException is the one you cannot catch — memorize that distinction.

### Slide 4: Exception Methods
**Visual:** Code snippet showing a catch block calling e.getMessage(), e.getTypeName(), e.getStackTraceString(), and e.getCause() with sample output for each
**Content:**
- `e.getMessage()` — human-readable error description
- `e.getTypeName()` — fully qualified exception class name (e.g., "System.DmlException")
- `e.getStackTraceString()` — full stack trace for debugging
- `e.getCause()` — the wrapped original exception, if any
- `e.getLineNumber()` — line number where the exception occurred
- For DmlException: `e.getDmlMessage(index)`, `e.getDmlId(index)` for per-row details
**Speaker Notes:** The getMessage() and getStackTraceString() methods are the most useful for logging. When you have a DmlException from a bulk DML call that partially failed, getDmlMessage(i) gives you the specific error for each failed record at index i, and getDmlId(i) gives you the record ID. This is essential for building meaningful error logs and user feedback.

### Slide 5: Custom Exceptions
**Visual:** Class definition showing `public class InsufficientInventoryException extends Exception {}` with a calling method throwing it and a caller catching it by type
**Content:**
- Custom exceptions extend the built-in `Exception` class
- Naming convention: class name must end with "Exception"
- Can be inner classes or top-level classes
- Declare as `public class MyCustomException extends Exception {}`
- Throw with: `throw new MyCustomException('Custom error message')`
- Can add custom fields and constructors to carry extra context
**Speaker Notes:** Custom exceptions allow you to represent business-specific error conditions in a typed, catchable way. By ending the class name with "Exception", Salesforce allows you to throw and catch it like a built-in exception. Inner custom exceptions are useful when the exception is tightly scoped to one class — for example, a service class might declare its own ServiceException. Top-level custom exceptions are better when multiple classes need to catch the same exception type.

### Slide 6: throw and Re-throw
**Visual:** Three-level call stack diagram: Controller calls Service, Service calls Repository; Repository catches and re-throws a typed exception that Controller catches
**Content:**
- `throw new ExceptionType('message')` — throw a new exception
- `throw e` inside a catch block — re-throw the caught exception (preserves stack trace)
- Re-throwing is used to add logging at one layer and handle at a higher layer
- Avoid swallowing exceptions (empty catch blocks) — they hide bugs
- Pattern: catch at the lowest level to log, re-throw for the caller to handle
**Speaker Notes:** Re-throwing preserves the original stack trace, which is critical for debugging. Wrapping is different — you catch one exception type and throw a new, more specific type with the original as the cause (using the Exception(String, Exception) constructor). This is useful in service layers that want to convert low-level database exceptions into domain-specific exceptions without losing the root cause.

### Slide 7: Database.insert() vs. insert — allOrNone
**Visual:** Comparison table showing insert statement (all-or-none, throws DmlException on any failure) vs. Database.insert(list, false) (partial success, returns SaveResult array)
**Content:**
- `insert myList` — all-or-none by default; any failure rolls back all records
- `Database.insert(myList, false)` — partial success allowed; failures don't roll back successes
- Returns `Database.SaveResult[]` — one result per record
- `result.isSuccess()` — true if record saved; `result.getErrors()` for failures
- Same pattern for: `Database.update()`, `Database.delete()`, `Database.upsert()`
**Speaker Notes:** The allOrNone distinction is a favorite exam topic. The DML statement equivalent to Database.insert(list, true) is just insert list. The exam will give you a scenario where some records are valid and some are not and ask which approach allows partial success — the answer is Database.insert() with the second parameter set to false. Always iterate over the SaveResult array and log or collect errors for the records that failed.

### Slide 8: Best Practices and Anti-Patterns
**Visual:** Two-column checklist: green checkmarks on the left for best practices, red X marks on the right for anti-patterns
**Content:**
- DO: catch specific exception types rather than the generic `Exception`
- DO: log exceptions with `System.debug()` or custom logging objects
- DO: use `Database.insert(list, false)` when partial success is acceptable
- DON'T: use empty catch blocks (`catch(Exception e) {}`) — they hide bugs silently
- DON'T: expose raw exception messages to end users — wrap in user-friendly feedback
- DON'T: catch LimitException — it is not catchable; prevent it by design
**Speaker Notes:** The most dangerous anti-pattern is the empty catch block — it makes your code appear to work while hiding real failures. Always log at minimum, and usually re-throw or surface an error to the user. When writing DML operations in a loop context or integration layer, prefer Database.insert() with allOrNone=false to handle partial success gracefully and log specific failures per record.

## Recording Script

Welcome to Lecture 12 on Exception Handling in Apex. This is a topic that separates code that works in demo from code that's ready for production. Let's walk through everything you need to know for the exam and for real development.

Every piece of code that interacts with the database, calls an external service, or processes user-provided data can fail. Exception handling is how you respond to those failures in a controlled way rather than surfacing cryptic stack traces to your users.

The syntax is try/catch/finally. In the try block, you write the code that might fail. In the catch block, you handle a specific type of exception. You can have multiple catch blocks stacked up — Apex checks them in order and runs the first one that matches. The finally block always runs, whether the try succeeded or threw an exception. Use finally for cleanup that must always happen.

Now let's talk about the built-in exception types you need to recognize. NullPointerException is what you get when you dereference a null variable — the classic "variable name is null" error. DmlException fires when a DML operation fails because of a validation rule, a required field, a duplicate rule, or a sharing violation. QueryException fires when a single-row SOQL query (using direct assignment) returns zero or more than one row — this is extremely common and easily avoided by querying into a List and checking its size first. CalloutException fires when an HTTP callout fails. And LimitException fires when you exceed a governor limit — the critical distinction is that LimitException is not catchable. You cannot recover from it.

The Exception class provides several useful methods. getMessage() gives a readable description. getTypeName() gives the fully-qualified class name. getStackTraceString() gives you the full trace for debugging. For DmlException specifically, getDmlMessage(i) and getDmlId(i) give you per-record error details when a bulk DML call fails on some records.

Custom exceptions are straightforward. Extend the built-in Exception class and end your class name with "Exception" — that is a required naming convention, not optional. Declare it as a public class, optionally add fields or constructors, and throw it with the new keyword.

The allOrNone question is a PDI favorite. The plain insert statement is all-or-none: if any record in the list fails, all are rolled back. Database.insert(list, false) allows partial success: good records commit, bad ones don't, and you get back a SaveResult array. Check isSuccess() on each result and collect errors with getErrors() for the failures.

Avoid these anti-patterns: empty catch blocks, catching the generic Exception type when you know the specific type, and exposing raw getMessage() output directly to users.

## Exam Tips
- `LimitException` is the only standard exception type that cannot be caught with a try/catch block — the transaction always rolls back when a governor limit is exceeded
- Custom exception class names must end with the word "Exception" (e.g., `AccountValidationException extends Exception`) — this is enforced by the Apex compiler
- `Database.insert(list, false)` allows partial success; `Database.insert(list, true)` and the plain `insert` statement are both all-or-none
- `QueryException` is thrown when a single-row SOQL query (using `Account a = [SELECT ...]`) returns 0 rows or more than 1 row — always prefer querying into a List
- `e.getDmlMessage(index)` and `e.getDmlId(index)` on a DmlException allow you to identify which specific records failed in a bulk DML operation

## Lecture Summary
Apex exception handling uses try/catch/finally blocks to intercept and respond to runtime errors, with multiple catch blocks allowing different responses to different exception types and finally ensuring cleanup always runs. The most common built-in exceptions are NullPointerException, DmlException, QueryException, CalloutException, and LimitException — the last of which is uncatchable and always rolls back the transaction. Custom exceptions extend the Exception base class and must end in "Exception" by naming convention. The Database.insert()/update()/delete() methods with allOrNone=false enable partial-success DML and return SaveResult arrays for per-record error inspection, which is preferred over the plain DML statement when handling large volumes of records with potential individual failures.

## Mini Quiz

**Q1:** A developer executes `Account a = [SELECT Id, Name FROM Account WHERE Name = 'NonExistent'];`. No matching records exist. What happens?
A) The variable `a` is set to null
B) A `NullPointerException` is thrown
C) A `QueryException` is thrown
D) The query returns an empty list

**Answer:** C — A single-row SOQL assignment throws a QueryException when it returns 0 rows (or more than 1 row). To safely handle this, query into a `List<Account>` and check `list.size() > 0` before accessing the first element.

**Q2:** Which of the following is a valid custom exception class declaration in Apex?
A) `public class MyError { }`
B) `public class MyException implements Exception { }`
C) `public class OrderProcessingException extends Exception { }`
D) `public exception class OrderException { }`

**Answer:** C — Custom exceptions must extend the `Exception` class (not implement it), and the class name must end with "Exception". Option A is a regular class, B uses `implements` incorrectly, and D uses invalid syntax.

**Q3:** A developer needs to insert a list of 1,000 Contacts, some of which may violate validation rules. Failed records should be logged, but successful records must still be committed. Which code pattern achieves this?
A) `insert contactList;` wrapped in try/catch
B) `Database.insert(contactList, true);`
C) `Database.insert(contactList, false);` followed by iterating SaveResult array
D) Use a for loop with individual `insert contact;` statements in separate try/catch blocks

**Answer:** C — `Database.insert(list, false)` sets allOrNone to false, allowing partial success. The returned `Database.SaveResult[]` array contains one entry per record; iterating it and checking `result.isSuccess()` allows you to identify and log each failure while the successful records remain committed. Options A and B are all-or-none. Option D would work but uses 1,000 DML statements, risking the 150-statement governor limit.
