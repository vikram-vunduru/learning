# Asynchronous Apex

## Exam Domain
Process Automation & Logic — 30% of exam weight

## Core Concepts

### Why Async? — Fresh Governor Contexts
Synchronous transactions share one set of governor limits. Async Apex runs in a separate transaction with fresh limits. Use async when: volume exceeds sync limits, callouts needed from a trigger, work needs to run on a schedule, or jobs need to chain.

### @future Methods
```apex
@future(callout=true)
public static void callExternalService(Set<Id> accountIds) {
    // Re-query inside — data may change before execution
    List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
    Http h = new Http();
    // ... make callout
}
```
- Must be **static** and return **void**
- Parameters: **primitives only** — no sObjects (data may change before execution)
- `callout=true` required for HTTP callouts
- Cannot call @future from @future
- Limit: 50 @future invocations per synchronous transaction

### Batch Apex — Mass Data Processing
```apex
public class AccountReviewBatch implements Database.Batchable<sObject> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Name FROM Account]);
    }
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // process 200 records — fresh governor limits per execute()
    }
    public void finish(Database.BatchableContext bc) {
        // runs once after all batches complete
    }
}
// Start: Database.executeBatch(new AccountReviewBatch(), 200);
```
- `start()`: returns up to **50 million** records via QueryLocator
- `execute()`: called per chunk; default size 200; max 2,000
- `finish()`: runs once; use for summary emails, kick next job
- Max **5 concurrent** batch jobs org-wide

### Queueable Apex — Flexible Async with Chaining
```apex
public class AccountSyncJob implements System.Queueable, Database.AllowsCallouts {
    private List<Account> accounts;
    public AccountSyncJob(List<Account> accounts) { this.accounts = accounts; }
    public void execute(System.QueueableContext ctx) {
        // process accounts — can chain another job
        System.enqueueJob(new NextStep(accounts));
    }
}
// Invoke: System.enqueueJob(new AccountSyncJob(myList));
```
- Implements `System.Queueable`; single `execute(QueueableContext ctx)` method
- Accepts **non-primitive parameters** (sObjects, custom types) — unlike @future
- Can chain: `System.enqueueJob(new NextJob())` inside execute()
- Returns a Job ID for monitoring
- Implement `Database.AllowsCallouts` for HTTP callouts

### Scheduled Apex — Time-Based Jobs
```apex
public class NightlyCleanup implements System.Schedulable {
    public void execute(System.SchedulableContext ctx) {
        Database.executeBatch(new AccountReviewBatch());
    }
}
// Schedule: System.schedule('Nightly Cleanup', '0 0 2 * * ?', new NightlyCleanup());
```
CRON format: `Seconds Minutes Hours Day-of-Month Month Day-of-Week [Year]`
- `'0 0 2 * * ?'` = every day at 2:00 AM
- Max **100 scheduled jobs** in org

### Choosing the Right Type
| Need | Use |
|------|-----|
| HTTP callout from trigger context | `@future(callout=true)` |
| Millions of records | Batch Apex |
| Object params, chaining | Queueable |
| Time-based schedule | Scheduled Apex |
| Simple async (no constraints) | @future or Queueable |

### Testing Async Apex
`Test.stopTest()` forces queued async jobs to execute synchronously. Always assert AFTER `Test.stopTest()`.
```apex
@isTest
static void testBatch() {
    insert testAccounts;
    Test.startTest();
    Database.executeBatch(new AccountReviewBatch(), 200);
    Test.stopTest();
    // stopTest flushes the batch — assert here
    System.assertEquals(expected, [SELECT COUNT() FROM Account WHERE ...]);
}
```

## PTA / SA Relevance

**In partner code reviews, watch for:**
- `@future` with sObject parameters — compile error, not runtime. Always pass IDs instead and re-query inside.
- More than 5 batch jobs scheduled to run concurrently — silent queue backup. Stagger scheduled start times.
- Queueable chains without depth limits — chaining can theoretically go forever, exhausting async job quotas. Add a depth counter and stop condition.
- `Database.executeBatch()` called from a trigger — each record save enqueues a batch. With 200 trigger records, that's 200 batch job enqueue attempts → you'll hit the 5-concurrent limit immediately.

**Enterprise-scale considerations:**
- Batch Apex for nightly jobs is the standard enterprise pattern. Design: Scheduled Apex kicks off the batch at off-peak hours. Batch processes data in 200-record chunks. finish() sends a summary email or enqueues the next batch in a pipeline.
- For real-time streaming patterns, Platform Events + Apex triggers consuming them is often better than @future chains — more observable, more scalable.
- Queueable chaining is powerful for multi-step async workflows (fetch from external, process, upsert, notify) — but each step adds latency. For anything performance-critical, consider a single @future or batch.

**For CTO conversations:**
- "We have a nightly job that processes 2 million records — it keeps timing out." — Move to Batch Apex. QueryLocator handles 50M records, each execute() chunk gets fresh limits. Tune batch size (smaller chunks = more transactions but less risk of timeout).
- "Can we call an external API when a record is saved?" — Yes, via @future(callout=true) or Queueable with AllowsCallouts. Callout cannot happen in the same synchronous transaction as DML that hasn't committed.

## Architecture / How It Works

```
ASYNC APEX COMPARISON

  ┌────────────────┬──────────────┬─────────────────┬────────────────┐
  │                │   @future    │   Batch Apex    │  Queueable     │
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Parameters    │  Primitives  │  QueryLocator   │  Anything      │
  │                │  only        │  + scope List   │  (sObj, etc.)  │
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Callouts      │  callout=true│  Yes (execute)  │  AllowsCallouts│
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Chaining      │  No          │  In finish()    │  Yes           │
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Volume        │  Low         │  50M records    │  Low-Medium    │
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Job ID        │  No          │  Yes            │  Yes           │
  ├────────────────┼──────────────┼─────────────────┼────────────────┤
  │  Org limit     │  50/tx       │  5 concurrent   │  No hard limit │
  └────────────────┴──────────────┴─────────────────┴────────────────┘
```

**Limitations:**
- @future: max 50 invocations per synchronous transaction; cannot call @future from @future
- Batch: max 5 active/queued; max scope 2,000; QueryLocator max 50M records
- Queueable: 1 child enqueue per execute() in production; unlimited in test context
- Scheduled: max 100 jobs in org; CRON must be a future time

```
BATCH APEX LIFECYCLE

  Database.executeBatch(new MyBatch(), 200)
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │  start() — runs ONCE                                     │
  │  Returns Database.QueryLocator                           │
  │  SELECT Id, Name FROM Account  ← up to 50M records      │
  └──────────────────────┬───────────────────────────────────┘
                         │ Salesforce chunks by scope (200)
           ┌─────────────┴──────────────┐
           ▼                            ▼
  ┌──────────────┐             ┌──────────────┐
  │ execute()    │             │ execute()    │   ... (per chunk)
  │ chunk 1      │             │ chunk 2      │
  │ Own limits   │             │ Own limits   │
  └──────────────┘             └──────────────┘
           │
           ▼ (after all chunks)
  ┌──────────────────────────────────────────────────────────┐
  │  finish() — runs ONCE                                    │
  │  Send summary email, kick next batch, etc.               │
  └──────────────────────────────────────────────────────────┘
```

**Limitations:**
- Each execute() is its own transaction — if one chunk fails, other chunks are NOT rolled back
- If execute() fails, Salesforce retries — code must be idempotent (safe to run twice)
- finish() runs even if some execute() chunks failed

```
CRON EXPRESSION — 7 FIELDS

  '0   0   2   *   *   ?'
   │   │   │   │   │   └── Day-of-week  (? = unspecified, SUN-SAT, 1-7)
   │   │   │   │   └─────── Month        (* = every, 1-12 or JAN-DEC)
   │   │   │   └─────────── Day-of-month (* = every day, 1-31)
   │   │   └─────────────── Hours        (0-23)
   │   └─────────────────── Minutes      (0-59)
   └─────────────────────── Seconds      (0-59)

  Examples:
  '0 0 2 * * ?'       every day at 2:00 AM
  '0 0 8 ? * MON'     every Monday at 8:00 AM
  '0 0 0 1 * ? *'     first day of every month at midnight
  
  Note: Either Day-of-month OR Day-of-week must be '?' (not both '*')
```

**Limitations:**
- Max 100 scheduled jobs in org — includes all org-wide scheduled jobs, not just yours
- CRON past times throw an exception — must be a future time
- Cannot schedule from anonymous Apex in tests without Test.startTest()/stopTest()

## Key Facts to Memorize
- @future: **static void**, **primitives only**, `callout=true` for callouts, max **50/tx**
- Batch: **50M** QueryLocator, **200** default chunk size, **5** concurrent max
- Queueable: **non-primitives ok**, **chainable**, `Database.AllowsCallouts` for callouts
- Scheduled: `System.schedule(name, cron, instance)`, max **100 jobs**, CRON 7 fields
- Test async: `Test.startTest()` then `Test.stopTest()` → forces sync execution; assert AFTER stopTest
- Cannot call @future from @future; cannot make callout after uncommitted DML without @future

## Customer Advisory Tips
- **Nightly bulk processing:** Scheduled Apex (kicks off Batch) is the standard pattern. Batch handles volume, Scheduled handles timing. The combo handles anything from 10k to 50M records.
- **Real-time integration:** @future for simple cases, Queueable for complex multi-step. For enterprise reliability, consider Platform Events for decoupled async messaging.
- **When to use AppExchange vs custom Async?** If you're building nightly cleanup, data quality, or bulk update processes — check AppExchange first. Many exist. Custom async is appropriate when the logic is org-specific enough that a generic tool won't fit.

## Exam Traps
- @future parameter must be **primitives** — sObject parameter = **compile error**
- `@future` without `callout=true` cannot make HTTP callouts — adding `callout=true` is required
- Batch max scope is **2,000** (not 200 — that's the default, not the max)
- Testing batch: assert AFTER `Test.stopTest()` — that's when the batch executes
- Cannot call @future from another @future — Queueable chaining is the solution
- `System.enqueueJob()` inside a Queueable can only enqueue **1 child** in production

## Practice Questions

**Q:** A trigger needs to make an HTTP callout to an external system after a Contact is inserted. Which approach is correct?
**A:** `@future(callout=true)` static void method, passing Contact Ids (Set<Id>) as parameters. The @future method re-queries the Contacts and makes the callout in a separate async transaction.

**Q:** What is the maximum number of records that Database.QueryLocator can return in Batch Apex's start() method?
**A:** 50 million records.

**Q:** Why can't you pass an sObject as a parameter to a @future method?
**A:** The sObject data might change between when the @future is enqueued and when it executes. Salesforce enforces primitives-only to prevent stale data bugs. Always pass IDs and re-query inside the @future method.
