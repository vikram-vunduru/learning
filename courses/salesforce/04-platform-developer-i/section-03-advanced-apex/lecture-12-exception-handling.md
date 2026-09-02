# Exception Handling in Apex

## Exam Domain
Process Automation & Logic — 30% of exam weight

## Core Concepts

### try / catch / finally
```apex
try {
    // risky code
    Account a = [SELECT Id FROM Account WHERE Name = :searchName LIMIT 1];
    insert newContact;
} catch (QueryException qe) {
    System.debug('No record found: ' + qe.getMessage());
} catch (DmlException de) {
    System.debug('DML failed: ' + de.getMessage());
} catch (Exception e) {
    // generic — catches anything not caught above
    System.debug('Unexpected: ' + e.getTypeName() + ' - ' + e.getMessage());
} finally {
    // always runs — cleanup goes here
    cleanupTempData();
}
```
- Multiple `catch` blocks: most specific type first
- `finally` always runs whether or not exception was thrown

### Common Built-In Exception Types
| Exception | Thrown When |
|-----------|-------------|
| `NullPointerException` | Dereferencing a null variable |
| `DmlException` | DML fails (validation rule, required field, duplicate) |
| `QueryException` | Single-row SOQL assignment gets 0 or 2+ rows |
| `LimitException` | Governor limit exceeded — **NOT catchable** |
| `CalloutException` | HTTP callout fails (timeout, SSL, invalid endpoint) |
| `TypeException` | Invalid type cast |
| `ListException` | List index out of bounds |
| `MathException` | Division by zero |

### Exception Methods
- `e.getMessage()` — human-readable error
- `e.getTypeName()` — fully qualified class name (e.g., `System.DmlException`)
- `e.getStackTraceString()` — full stack trace for debugging
- `e.getCause()` — wrapped original exception (for wrapped exceptions)
- `e.getLineNumber()` — line number where exception occurred
- `e.getDmlMessage(index)` — per-record error message from DmlException (for bulk DML)
- `e.getDmlId(index)` — record Id that failed in bulk DML

### LimitException — The Uncatchable Exception
`LimitException` is thrown when a governor limit is exceeded. **Cannot be caught with try/catch.** Transaction always rolls back. The ONLY defense is designing code to stay under limits. Never attempt to catch it.

### Custom Exception Classes
```apex
public class InsufficientInventoryException extends Exception {}
public class OrderProcessingException extends Exception {
    public String orderId;
}

// Throw:
throw new InsufficientInventoryException('Not enough stock for order ' + orderId);

// Catch:
try {
    processOrder(order);
} catch (InsufficientInventoryException e) {
    System.debug('Inventory error: ' + e.getMessage());
}
```
- **Must extend** `Exception` class (not implement)
- Class name **must end in "Exception"** — enforced by compiler
- Can be inner class or top-level class

### DML Statement vs Database Class — allOrNone
```apex
// All-or-nothing — any failure rolls back ALL
try {
    insert contactList;
} catch (DmlException e) {
    // ALL records rolled back when exception thrown
}

// Partial success — some can fail, others commit
List<Database.SaveResult> results = Database.insert(contactList, false);
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        for (Database.Error err : sr.getErrors()) {
            System.debug(err.getStatusCode() + ': ' + err.getMessage());
        }
    }
}
```

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Empty catch blocks: `catch (Exception e) {}` — silent failure, hides bugs, almost always wrong
- Catching generic `Exception` when a specific type is known — lose type information, harder to debug
- Raw `e.getMessage()` displayed to end users — exposes internal error details (security issue)
- LimitException listed in a catch block — it compiles but never catches (LimitException is a system exception, not catchable)
- Missing exception logging in integration code — callout failures silently swallowed are production nightmares

**Enterprise-scale considerations:**
- Build a custom error logging framework: `Error_Log__c` object with fields for exception type, message, stack trace, record ID, user, timestamp. Log in catch blocks. Expose a list view to admins.
- For integrations using `Database.insert(list, false)`, systematically iterate SaveResult[], log all failures, and provide a retry mechanism for records that failed due to transient errors.
- Platform Events are the modern way to handle integration failures asynchronously — publish an error event, subscribe to it with a separate process that logs and alerts.

**For CTO conversations:**
- "How do we know when something silently fails in Apex?" — You don't, unless you've built exception logging. Every org should have a centralized error log. Unhandled exceptions in async contexts don't surface to users at all.

## Architecture / How It Works

**Exception Class Hierarchy (relevant subset):**

- `Exception` (base)
  - `System.LimitException` — NOT catchable; rolls back TX
  - `System.NullPointerException` — dereference null
  - `System.DmlException` — DML failure; use `getDmlMessage(i)`
  - `System.QueryException` — 0 or 2+ rows in single-row query
  - `System.CalloutException` — HTTP callout failure
  - `System.TypeException` — invalid cast
  - `System.ListException` — index out of bounds
  - `MyCustomException` — extends Exception (user-defined)

Key rule: `LimitException` cannot be in any catch block — it is uncatchable.

**Limitations:**
- `LimitException` is thrown by the platform and bypasses all catch blocks
- Custom exceptions must extend `Exception` — interfaces and other base classes are not allowed

| | `allOrNone = true` (`insert myList`) | `allOrNone = false` (`Database.insert(list, false)`) |
|---|---|---|
| Input | [Valid] [Valid] [**INVALID**] [Valid] | [Valid] [Valid] [**INVALID**] [Valid] |
| On failure | `DmlException` thrown; ALL records rolled back (0 committed) | No exception; 3 committed, 1 failed |
| Check errors via | `catch (DmlException e)` | `SaveResult[2].isSuccess() = false`; `SaveResult[2].getErrors()` |

**Limitations:**
- `Database.insert(list, false)` does NOT roll back successful records when others fail — successes are permanent even if some fail
- `DmlException.getDmlMessage(i)` only works with DML statement exceptions, not Database.insert() partial failures (use SaveResult for those)

**Custom Exception Pattern — Service Layer:**

```apex
public class OrderService {

    public class OrderException extends Exception {}

    public static void processOrder(Order__c o) {
        if (o.Quantity__c <= 0) {
            throw new OrderException('Qty must be > 0');
        }
        // ... process
    }
}

// Caller:
try {
    OrderService.processOrder(order);
} catch (OrderService.OrderException e) {
    // type-safe; won't catch generic exceptions
    ApexPages.addMessage(new ApexPages.Message(
        ApexPages.Severity.ERROR, e.getMessage()));
}
```

**Limitations:**
- Custom exceptions without custom fields/constructors have the same 4 constructors as the base `Exception` class (no-arg, message string, cause exception, message + cause)
- Inner exception class: referenced as `OuterClass.InnerException` from outside the outer class

## Key Facts to Memorize
- `LimitException` is the **ONLY** exception that CANNOT be caught — transaction always rolls back
- Custom exceptions: must **extend Exception** (not implement), class name **must end in "Exception"**
- `finally` always executes — whether exception thrown or not
- `Database.insert(list, false)` = partial success; no exception thrown; check SaveResult[]
- `insert myList` = all-or-nothing; throws `DmlException` on any failure
- `e.getDmlMessage(i)` for per-record DML errors in bulk DML exception
- Multiple catch blocks: **most specific type first**

## Customer Advisory Tips
- **Error logging framework:** Every enterprise org needs one. Custom `Error_Log__c` object + trigger-aware logging class. Log exception type, message, stack trace, record IDs, user ID.
- **Integration error handling:** `Database.insert(list, false)` for any bulk integration. Log failures to error log. Build a "retry failed records" admin interface.
- **User-facing errors:** Never show raw exception messages. Map exception types to user-friendly messages. Use `ApexPages.addMessage()` for Visualforce or throw/catch in @AuraEnabled methods with custom error strings.

## Exam Traps
- `LimitException` cannot be caught — even `catch (Exception e)` does NOT catch it
- Custom exception: use `extends Exception` NOT `implements Exception` — that's a compile error
- Custom exception name MUST end in "Exception" — `MyError` = compile error; `MyException` = valid
- `Database.insert(list, false)` never throws — check the SaveResult array; `insert list` throws `DmlException`
- Multiple catch blocks: if you put `catch (Exception e)` first, specific types below it are unreachable (compiler warning)

## Practice Questions

**Q:** `Account a = [SELECT Id FROM Account WHERE Name = 'Ghost Corp'];` — no matching records exist. What exception?
**A:** `QueryException` — single-row SOQL assignment requires exactly one row. 0 rows → QueryException. Fix: query into `List<Account>` and use `isEmpty()` check.

**Q:** What is wrong with `public class OrderError extends Exception {}`?
**A:** The class name must end in "Exception" — `OrderError` doesn't end in "Exception". Use `OrderErrorException` or `OrderException`.

**Q:** A developer writes `catch (LimitException e) { }`. What happens when a governor limit is exceeded?
**A:** LimitException is not catchable — the transaction rolls back regardless of the catch block. This code does nothing to prevent the rollback.
