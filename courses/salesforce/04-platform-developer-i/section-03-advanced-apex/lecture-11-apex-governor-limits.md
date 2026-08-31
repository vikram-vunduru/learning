# Apex Governor Limits

## Learning Objectives
- Recall the specific numeric values for the most critical synchronous and asynchronous governor limits
- Apply bulkification patterns — collecting records in collections, placing SOQL and DML outside loops — to avoid hitting limits
- Use the Limits class to programmatically monitor consumption during a transaction
- Distinguish between synchronous and asynchronous limits and explain why async limits are higher

## Slides

### Slide 1: What Are Governor Limits?
**Visual:** Multitenant architecture diagram showing multiple orgs sharing one Salesforce server pool, with a limit "cap" over each org's transaction bubble
**Content:**
- Salesforce is a multitenant platform — orgs share compute resources
- Governor limits prevent one transaction from monopolizing shared resources
- Limits are enforced per Apex transaction (one trigger execution, one controller action, one async job, etc.)
- Exceeding a limit throws a non-catchable `LimitException` and rolls back the transaction
- Async transactions get higher limits because they run in background queues
**Speaker Notes:** Governor limits exist because Salesforce runs thousands of customer orgs on the same infrastructure. Without limits, a poorly written loop could starve other orgs of CPU or database connections. Every Apex developer must internalize the most common limits — they are a fixture on the PDI exam and a daily reality in development.

### Slide 2: Query and DML Limits (Synchronous)
**Visual:** Two-column table: left column lists limit names, right column shows sync and async values side by side highlighted in different colors
**Content:**
- SOQL queries: **100** (sync) / **200** (async)
- SOSL searches: **20** (sync) / **20** (async)
- DML statements: **150** (sync and async)
- DML rows (records): **10,000** (sync and async)
- Records retrieved by a single SOQL query: **50,000**
- Records retrieved by a Database.QueryLocator (Batch): **50,000,000**
**Speaker Notes:** These are the most-tested limits. Know them cold: 100 SOQL queries synchronously, 150 DML statements, 10,000 DML rows. The distinction between DML statements and DML rows trips up many developers — you could insert 10,000 records in a single DML statement (1 statement, 10,000 rows), or insert 10 records with 150 separate DML calls (150 statements, 10 rows). Both limits are tracked independently.

### Slide 3: Compute and Memory Limits
**Visual:** Speedometer-style gauges for CPU time and heap size, showing the sync needle at a lower limit and the async needle at a higher one
**Content:**
- CPU time: **10,000 ms** (sync) / **60,000 ms** (async)
- Heap size: **6 MB** (sync) / **12 MB** (async)
- Maximum string size: **6 MB**
- Stack depth (method calls): **1,000**
- These limits apply to code execution, not waiting for callouts
**Speaker Notes:** CPU time tracks only active execution time — time spent waiting for a SOQL query or HTTP response does not count. Heap size is the total memory your transaction uses; storing large collections of sObjects in memory can exhaust it quickly. Async contexts double both of these limits, which is why Batch and Queueable are appropriate for memory-intensive work.

### Slide 4: Callout and Future Limits
**Visual:** Sequence diagram showing a trigger invoking a @future method which makes HTTP requests, with a counter badge incrementing to the limit
**Content:**
- HTTP callouts per transaction: **100**
- @future method invocations per transaction: **50**
- Maximum callout timeout: **120 seconds**
- Total callout response size: **6 MB**
- Callouts cannot be made after uncommitted DML in the same transaction
**Speaker Notes:** The 100-callout limit and the 120-second timeout are both tested on the exam. A common misconception is that each HTTP request resets its own timeout counter — it does not; the 120 seconds is per individual callout, and Salesforce enforces it server-side. The rule about callouts after uncommitted DML is the reason @future(callout=true) exists.

### Slide 5: The Limits Class
**Visual:** Code editor showing Limits.getQueries(), Limits.getLimitQueries(), and a conditional check that logs a warning before throwing a custom exception
**Content:**
- `Limits.getQueries()` — SOQL queries used so far
- `Limits.getLimitQueries()` — SOQL query limit for this context
- `Limits.getDMLStatements()` / `Limits.getLimitDMLStatements()`
- `Limits.getDMLRows()` / `Limits.getLimitDMLRows()`
- `Limits.getCpuTime()` / `Limits.getLimitCpuTime()`
- `Limits.getHeapSize()` / `Limits.getLimitHeapSize()`
**Speaker Notes:** The Limits class lets you write defensive code that checks how close you are to a limit before performing an operation. The pattern is: if (Limits.getQueries() < Limits.getLimitQueries()) — proceed; otherwise, short-circuit or log and bail. On the exam, questions about the Limits class focus on method names; note that every limit has a getLimitX() counterpart that returns the ceiling for the current transaction context.

### Slide 6: Bulkification — Queries Outside Loops
**Visual:** Side-by-side code: "BAD" shows a for loop with a SOQL inside it hitting 101 records and throwing LimitException; "GOOD" shows a single SOQL before the loop populating a Map
**Content:**
- **Never** put a SOQL query inside a for loop
- Collect all IDs into a Set, run one query before the loop
- Use a `Map<Id, sObject>` to look up records by ID inside the loop
- Same principle applies to SOSL searches
- Trigger context automatically receives up to 200 records in Trigger.new — always bulkify
**Speaker Notes:** Bulkification is the single most important Apex best practice and the most common source of LimitException errors in production. A trigger that queries inside a loop will work fine in developer testing with one record but will explode on a data import of 200 records. The fix is always the same: collect IDs before the loop, query once, put results in a Map, look up by ID inside the loop.

### Slide 7: Bulkification — DML Outside Loops
**Visual:** Side-by-side code: "BAD" shows insert inside a for loop incrementing DML statements; "GOOD" shows a List built inside the loop with a single insert list after the loop
**Content:**
- **Never** execute a DML statement inside a for loop
- Build a `List<sObject>` inside the loop, insert/update the list once after
- Each insert list( ) counts as 1 DML statement regardless of list size
- Applies to: insert, update, delete, upsert, undelete, merge
- Same pattern for `Database.insert()`, `Database.update()`, etc.
**Speaker Notes:** Just as with SOQL, DML inside a loop multiplies statements by the number of iterations. One hundred iterations equals 100 DML statements — half your synchronous limit gone in a single loop. Collect your changes in a list, apply business logic inside the loop, then execute one DML call on the full list after the loop exits. This pattern handles 200 records as efficiently as 1.

### Slide 8: Debugging and Avoiding Limit Exceptions
**Visual:** Developer Console log view with a Limits table section showing consumed vs. limit values for each governor metric
**Content:**
- Developer Console: Debug menu → "Enable Limits" to see limit consumption in log
- Apex PMD and Salesforce Code Analyzer flag SOQL/DML in loops statically
- `System.debug(Limits.getQueries() + ' of ' + Limits.getLimitQueries());` for runtime checks
- LimitException is NOT catchable — the transaction rolls back entirely
- Design with limits in mind from the start; retrofitting bulkification is expensive
**Speaker Notes:** LimitException is unique among Apex exceptions in that it cannot be caught with a try/catch block. Once you hit a limit, the transaction is over. The Developer Console's Limits panel is invaluable during development. For code review, run Salesforce Code Analyzer or Apex PMD which can detect SOQL and DML inside loops statically before you ever deploy.

## Recording Script

Welcome to Lecture 11 on Apex Governor Limits. Understanding governor limits is not optional for a Salesforce developer — it is foundational. The PDI exam tests specific numeric values, and production systems break when developers ignore limits. Let's make sure you know both.

Salesforce is a multitenant platform. Your org shares the same servers, database connections, and CPU with thousands of other customer orgs. Governor limits are the mechanism Salesforce uses to ensure no single transaction can monopolize shared resources. When you exceed a limit, Salesforce throws a LimitException — which, crucially, cannot be caught — and rolls back your entire transaction.

Let's go through the key numbers. For synchronous transactions: you get 100 SOQL queries, 150 DML statements, 10,000 DML rows, 6 MB of heap size, and 10,000 milliseconds of CPU time. For asynchronous transactions: SOQL goes up to 200, heap goes to 12 MB, and CPU goes to 60,000 ms. DML statements and rows stay the same. HTTP callouts are limited to 100 per transaction in both contexts, with a 120-second timeout per individual callout.

Now, knowing the numbers is necessary but not sufficient. You also have to write code that stays under those limits even when processing large volumes of records. This is called bulkification, and it has two rules.

Rule one: never put a SOQL query inside a for loop. Every iteration of the loop fires another query. With 200 records in a trigger, that's 200 queries — twice the synchronous limit. The fix: collect your IDs into a Set before the loop, run one query to get all the records you need, store results in a Map<Id, sObject>, and look up by ID inside the loop.

Rule two: never execute a DML statement inside a for loop. Same problem, same fix. Build a List<sObject> while iterating, then call insert or update on the whole list after the loop exits. One DML call, one statement consumed, regardless of list size.

The Limits class lets you monitor consumption at runtime. Limits.getQueries() returns how many SOQL queries you've used so far in this transaction. Limits.getLimitQueries() returns the ceiling. Every governor resource has a matching pair of methods. Use them in defensive checks, especially in utility classes that might be called from multiple places in the same transaction.

The Developer Console's Limits panel shows you exactly what each transaction consumed — check it during development. For static analysis, Salesforce Code Analyzer and Apex PMD both detect SOQL and DML in loops before you deploy.

One last point: LimitException cannot be caught. Design your code to stay under limits by default. Retrofitting bulkification into spaghetti code is painful and error-prone.

## Exam Tips
- Memorize these exact values: 100 SOQL (sync), 200 SOQL (async), 150 DML statements, 10,000 DML rows, 6 MB heap (sync), 12 MB heap (async), 10,000 ms CPU (sync), 60,000 ms CPU (async)
- `LimitException` is NOT catchable with try/catch — a transaction that hits a governor limit always rolls back entirely
- DML statements and DML rows are separate limits — inserting one list of 10,000 records costs 1 DML statement but 10,000 DML rows
- The Limits class method pattern is always a pair: `Limits.getX()` for used, `Limits.getLimitX()` for ceiling
- Batch Apex's `Database.QueryLocator` can return up to 50 million records; a regular SOQL query in a non-batch context caps at 50,000 rows returned

## Lecture Summary
Governor limits are per-transaction resource ceilings enforced by Salesforce to protect the multitenant platform; key synchronous limits are 100 SOQL queries, 150 DML statements, 10,000 DML rows, 6 MB heap, and 10,000 ms CPU, all of which are higher in async contexts. Exceeding any limit throws an uncatchable LimitException that rolls back the transaction. The primary mitigation strategy is bulkification: collecting IDs or records in collections, executing SOQL and DML outside loops, and using Map<Id, sObject> for in-loop lookups. The Limits class provides runtime introspection so code can check consumption before attempting operations that might breach the ceiling.

## Mini Quiz

**Q1:** A developer writes a trigger that queries the database inside a for loop iterating over 150 Opportunity records. What will happen?
A) The trigger will succeed because 150 is under the 200-record trigger batch size
B) A LimitException will be thrown when the 101st SOQL query executes
C) Salesforce will automatically batch the queries and avoid the limit
D) The trigger will fail with a compile error

**Answer:** B — 150 iterations × 1 query per iteration = 150 SOQL queries, exceeding the synchronous limit of 100. A LimitException is thrown at query 101. This is a runtime error, not a compile error, and it is not catchable.

**Q2:** Which Limits class expression correctly checks how many DML statements have been used versus the limit?
A) `Limits.getDML()` and `Limits.getMaxDML()`
B) `Limits.getDMLStatements()` and `Limits.getLimitDMLStatements()`
C) `Limits.checkDML()` and `Limits.getDMLLimit()`
D) `Limits.usedDML()` and `Limits.totalDML()`

**Answer:** B — The Limits class follows a consistent naming pattern: getX() for consumption and getLimitX() for the ceiling. getDMLStatements() and getLimitDMLStatements() are the correct method names.

**Q3:** A synchronous Apex transaction inserts a list of 10,000 Account records and a list of 10,000 Contact records using two separate DML statements. Which limit(s) does this approach risk exceeding?
A) DML statements limit only (300 statements used)
B) DML rows limit only (20,000 rows across both operations)
C) Both DML statements and DML rows limits
D) Neither — 2 DML statements and 20,000 rows are both within limits

**Answer:** B — Two DML statements are well within the 150-statement limit. However, 10,000 Accounts plus 10,000 Contacts equals 20,000 DML rows, which exceeds the 10,000-row limit. The transaction will fail with a LimitException on the second insert.
