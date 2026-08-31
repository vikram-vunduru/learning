# Asynchronous Apex

## Learning Objectives
- Identify the four types of asynchronous Apex and the use case that best fits each
- Write @future methods with correct signature constraints
- Implement the Database.Batchable interface for mass data processing
- Chain jobs using Queueable Apex and schedule jobs with CRON expressions

## Slides

### Slide 1: Why Asynchronous Apex?
**Visual:** Diagram showing a synchronous call stack hitting a governor limit wall vs. an async job running in a separate governor context
**Content:**
- Synchronous transactions share one set of governor limits
- Long-running or resource-intensive work needs its own context
- Async Apex runs in a separate transaction with its own limits
- Four types: @future, Batch Apex, Queueable Apex, Scheduled Apex
**Speaker Notes:** Salesforce enforces per-transaction limits. When a single synchronous transaction can't finish the work — whether due to row volume, callout requirements, or timing — you move that work asynchronously. Each async job gets a fresh governor context, meaning a fresh set of limits.

### Slide 2: @future Methods
**Visual:** Code snippet showing a static void method annotated with @future(callout=true) being invoked from a trigger
**Content:**
- Must be `static` and return `void`
- Parameters must be primitive types or collections of primitives — no sObjects
- Annotate with `@future(callout=true)` to allow HTTP callouts
- Cannot call another @future from a @future method
- Limit: 50 @future calls per synchronous transaction
**Speaker Notes:** The most common use of @future in triggers is making an HTTP callout after a DML event, because Salesforce does not allow callouts after uncommitted DML in the same synchronous transaction. Pass record IDs as a Set<Id> instead of sObjects — sObject parameters are not allowed because the data may have changed by the time the job runs.

### Slide 3: Batch Apex
**Visual:** Three-step pipeline diagram: start() returns a Database.QueryLocator, execute() processes each chunk, finish() runs cleanup
**Content:**
- Implements `Database.Batchable<sObject>` interface
- Three required methods: `start()`, `execute()`, `finish()`
- `start()` returns up to 50 million records via `Database.QueryLocator`
- Default batch size: 200 records per `execute()` call; max 2,000
- Max 5 jobs queued or active at one time (via Database.executeBatch())
**Speaker Notes:** Batch Apex is the right tool when you need to process millions of records — think annual data cleanup, bulk recalculations, or org-wide field updates. Each call to execute() is its own transaction, so you get 150 DML statements and 100 SOQL queries per 200-record chunk. Use the optional scope parameter in Database.executeBatch() to override the batch size.

### Slide 4: Queueable Apex
**Visual:** Chain diagram showing QueueableJob1 calling System.enqueueJob(new QueueableJob2()) inside execute(), forming a linked chain
**Content:**
- Implements `System.Queueable` interface with one `execute(QueueableContext ctx)` method
- Accepts non-primitive parameters (sObjects, custom types)
- Can chain: call `System.enqueueJob()` inside `execute()` to queue the next job
- Supports `Database.AllowsCallouts` interface for HTTP callouts in chained jobs
- `System.enqueueJob()` returns a Job ID for monitoring
**Speaker Notes:** Queueable fills the gap between @future and Batch. Unlike @future, it accepts complex object parameters and lets you chain jobs together. Unlike Batch, the setup is simpler for jobs that don't need to iterate over millions of records. In test classes, use Test.getEventBus().deliver() or wrap enqueue calls in Test.startTest()/Test.stopTest() to execute the queue synchronously.

### Slide 5: Scheduled Apex
**Visual:** Calendar icon with a CRON expression broken down: seconds, minutes, hours, day-of-month, month, day-of-week, year
**Content:**
- Implements `System.Schedulable` interface with one `execute(SchedulableContext ctx)` method
- Schedule with `System.schedule(name, cronExpression, instance)`
- CRON format: `Seconds Minutes Hours Day-of-month Month Day-of-week [Year]`
- Example: `'0 0 2 * * ?'` = every day at 2:00 AM
- Maximum 100 scheduled jobs in the org at one time
**Speaker Notes:** Scheduled Apex is ideal for time-based operations like nightly batch kicks, daily reports, or weekly data syncs. The CRON expression follows a seven-field format similar to Unix cron but with seconds as the first field. Remember: you cannot schedule a job from a test class without using Test.startTest()/Test.stopTest(), and scheduled jobs created in tests are not actually executed unless explicitly stopped.

### Slide 6: Choosing the Right Async Type
**Visual:** Decision tree: "Need to make a callout from a trigger?" → @future; "Processing millions of records?" → Batch; "Need object params or chaining?" → Queueable; "Time-based execution?" → Scheduled
**Content:**
- **@future**: HTTP callout triggered by DML; simplest async option
- **Batch Apex**: Mass data processing (thousands to millions of records)
- **Queueable**: Complex async logic, object parameters, job chaining
- **Scheduled**: Time-based jobs (nightly, weekly, monthly)
- Batch and Scheduled often work together: schedule a class that kicks off a batch job
**Speaker Notes:** On the PDI exam, scenario-based questions often describe a business need and ask which async mechanism to use. Memorize these pairings. The key differentiators are: callouts-from-trigger requires @future with callout=true; bulk record volume requires Batch; object parameters or chaining requires Queueable; calendar/time triggers require Scheduled.

### Slide 7: Monitoring and Testing Async Jobs
**Visual:** Setup menu path to Apex Jobs page, with a table showing Job Type, Status, Batches Processed, and Failures columns
**Content:**
- Monitor jobs at Setup → Apex Jobs (all types) and Setup → Scheduled Jobs
- `AsyncApexJob` object stores job status, errors, and metrics
- In tests: `Test.startTest()` / `Test.stopTest()` forces async execution synchronously
- `Database.executeBatch()` in tests runs with batch size of 1 by default unless overridden
- Always assert after `Test.stopTest()` — that is when async work completes
**Speaker Notes:** Exam questions occasionally ask how to verify that async Apex ran in a test. The answer is always to call Test.stopTest() before your assertions — this is what flushes the async queue. Querying AsyncApexJob in your test assertions is also valid for verifying that a batch job completed without errors.

### Slide 8: Key Constraints and Common Pitfalls
**Visual:** Warning-sign icons next to each constraint: no sObjects in @future, 5 concurrent batches, 100 scheduled jobs, no @future-from-@future
**Content:**
- @future: no sObject params, no calling @future from @future, max 50/transaction
- Batch: max 5 queued/active; scope > 2000 is ignored (silently set to 2000)
- Queueable: can only enqueue 1 child job per execute() in production; unlimited in tests
- Scheduled: CRON expression must match a future time; past times throw an exception
- All async types: governor limits reset per transaction, but callout limits still apply
**Speaker Notes:** These constraints are prime exam bait. The most commonly tested pitfall is passing an sObject parameter to a @future method — this causes a compile error, not a runtime error. The 5-concurrent-batch limit can be a real operational problem in orgs that run many nightly jobs; organizations often stagger batch start times via Scheduled Apex to stay under this limit.

## Recording Script

Welcome to Lecture 10 on Asynchronous Apex. In this lecture we cover one of the most heavily tested topics on the Platform Developer I exam and one of the most practically important patterns you will use in real Salesforce development.

Let's start with the "why." Salesforce enforces governor limits per transaction to ensure fair resource sharing across its multitenant platform. Some tasks — making an HTTP callout, processing a million records, or running something on a schedule — can't or shouldn't happen in a synchronous context. Asynchronous Apex solves this by running your code in a separate transaction with its own fresh set of limits.

There are four types you need to master.

First: @future methods. These are the simplest form of async Apex. You annotate a static void method with @future, and Salesforce queues it to run later. The critical constraint is that parameters must be primitives — no sObjects allowed, because the data might have changed by execution time. Pass IDs instead and re-query inside the method. The main use case is making HTTP callouts triggered by a DML event, since you can't make a callout after uncommitted DML in the same transaction. You add callout=true inside the annotation: @future(callout=true).

Second: Batch Apex. This is your tool for mass data processing. You implement Database.Batchable and provide three methods. The start() method runs once and returns a Database.QueryLocator that can point at up to 50 million records. The execute() method processes records in chunks — 200 at a time by default, and each chunk is its own transaction. The finish() method runs once after all chunks complete, perfect for sending a summary email. The hard limit is 5 batch jobs queued or active at any one time in the org.

Third: Queueable Apex. Think of it as an upgraded @future. It accepts object parameters, not just primitives. It can chain — inside execute() you can enqueue another Queueable job. And it returns a Job ID so you can monitor it programmatically. Implement System.Queueable and write a single execute(QueueableContext ctx) method.

Fourth: Scheduled Apex. Implement System.Schedulable, write an execute(SchedulableContext ctx) method, and call System.schedule() with a name, a CRON expression, and an instance of your class. The CRON format has seven fields: seconds, minutes, hours, day-of-month, month, day-of-week, and optionally year. The org limit is 100 scheduled jobs at once.

For testing all async types: wrap your job invocation in Test.startTest() and Test.stopTest(). The stopTest() call forces all queued async work to execute synchronously before your test proceeds to assertions.

The exam loves scenario questions: read the scenario, pick the type. Callout from a trigger? @future. Millions of records? Batch. Complex chaining with object params? Queueable. Nightly schedule? Scheduled.

## Exam Tips
- @future method parameters must be primitives or collections of primitives — sObject parameters cause a compile error, not a runtime error
- The default batch size in Database.executeBatch() is 200; the maximum allowed scope value is 2,000
- Maximum concurrent and queued Batch Apex jobs is 5; maximum Scheduled Apex jobs is 100
- To allow HTTP callouts in a @future method, the annotation must be `@future(callout=true)` — omitting callout=true will throw a runtime exception when the callout is attempted
- In test methods, place Test.stopTest() before assertions when testing async Apex — this is what forces the async job to run synchronously

## Lecture Summary
Asynchronous Apex allows Salesforce developers to run resource-intensive work in separate governor contexts using four mechanisms: @future for simple async and trigger-based callouts, Batch Apex for processing millions of records in chunked transactions, Queueable Apex for complex chaining with non-primitive parameters, and Scheduled Apex for time-based recurring jobs. Each type has specific interface requirements, parameter constraints, and org-level concurrency limits that are heavily tested on the PDI exam. Testing async Apex always requires Test.startTest() and Test.stopTest() to force synchronous execution of queued jobs within a test context.

## Mini Quiz

**Q1:** A developer needs to make an HTTP callout to an external system every time a new Account is inserted. Which is the correct approach?
A) Call the HTTP class directly in the trigger
B) Create a @future(callout=true) method and invoke it from the trigger
C) Create a Queueable class that implements Database.AllowsCallouts and call it from the trigger
D) Both B and C are correct

**Answer:** D — Both @future(callout=true) and a Queueable that implements Database.AllowsCallouts can make callouts from a trigger context. Either is acceptable; the exam may specify one or test whether you recognize both.

**Q2:** Which statement about Batch Apex is correct?
A) The execute() method can process up to 50 million records at once
B) A maximum of 10 batch jobs can be active or queued at the same time
C) Each call to execute() runs in its own transaction with its own governor limits
D) The batch size can be set to a maximum of 500 records

**Answer:** C — Each execute() call is its own transaction, which is the core value of Batch Apex. The 50 million limit applies to the total records returned by start(), not execute(). The concurrent job limit is 5, not 10. The maximum batch size is 2,000, not 500.

**Q3:** A Queueable Apex class needs to pass a list of custom Apex objects to the next chained job. Which statement is true?
A) This is not possible; Queueable only supports primitive parameters
B) This is possible because Queueable accepts non-primitive parameters, unlike @future
C) The custom objects must be serialized to JSON strings before passing
D) Queueable classes cannot be chained in a production org

**Answer:** B — One of Queueable's key advantages over @future is the ability to accept non-primitive parameters, including sObjects and custom Apex objects. Chaining is supported in production (one child job per execute() call).
