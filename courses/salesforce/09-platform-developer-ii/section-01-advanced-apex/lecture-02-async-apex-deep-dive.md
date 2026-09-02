# Async Apex Deep Dive

## Exam Domain
Apex & Data Management — 27% of exam weight

## Foundations

PDI covered the four async types: @future, Batch, Queueable, Scheduled. PDII asks: *which do you choose and why*, *what are the limits of each*, *how do you chain them*, *how do you test them correctly*, and *what happens when they fail*?

The core insight: every async type creates a **new governor limit context**. That's the whole reason async exists — not to run "in the background" for UX reasons, but to escape the 10-second CPU limit and 100-query limit of a synchronous transaction. Understanding this drives every design decision.

Key starting mental model:
- `@future` = fire and forget (primitives only, no chaining)
- `Queueable` = @future with superpowers (objects, chaining, job ID)
- `Batch` = process millions of records in chunks (each chunk gets fresh limits)
- `Scheduled` = time-based kick (should delegate immediately to Batch/Queueable, not contain logic)
- `Platform Event trigger` = event-driven async (cleanest decoupling, covered in L07)

---

## Core Concepts

### Queueable Apex — The Full Pattern
Queueable is the modern replacement for @future. It supports non-primitive parameters, chaining, job IDs for monitoring, and callouts (with `Database.AllowsCallouts`).

```apex
public class ContactSyncJob implements System.Queueable, Database.AllowsCallouts {

    private List<Id> contactIds;
    private Integer batchNum;

    public ContactSyncJob(List<Id> contactIds, Integer batchNum) {
        this.contactIds = contactIds;
        this.batchNum = batchNum;
    }

    public void execute(System.QueueableContext ctx) {
        List<Contact> contacts = [
            SELECT Id, Email, FirstName, LastName
            FROM Contact
            WHERE Id IN :contactIds
            WITH SECURITY_ENFORCED
        ];

        // Make callout — requires Database.AllowsCallouts
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:MyExternalSystem/contacts');
        req.setMethod('POST');
        req.setBody(JSON.serialize(contacts));
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Process response, update Salesforce records
            List<Contact> toUpdate = new List<Contact>();
            // ... parse response, populate toUpdate
            update toUpdate;

            // Chain next batch if needed
            if (batchNum < 10) {
                System.enqueueJob(new ContactSyncJob(getNextBatch(), batchNum + 1));
            }
        } else {
            // Log error to custom object — never throw uncaught exceptions in async
            insert new Integration_Error__c(
                Error_Message__c = 'Contact sync failed: ' + res.getStatus(),
                Batch_Number__c = batchNum,
                Job_Id__c = String.valueOf(ctx.getJobId())
            );
        }
    }

    private List<Id> getNextBatch() {
        // Retrieve next batch from a queue or processing table
        return new List<Id>();
    }
}
```

**Critical Queueable limits:**
- Chain depth: **5 levels max in test context** (`Test.getEventBus().deliver()`)
- In production: unlimited chaining depth, but each enqueue counts against daily async limit
- Cannot enqueue from a Queueable `execute()` method that was triggered by Queueable in test
- `System.enqueueJob()` returns a Job ID (String) for `AsyncApexJob` monitoring

### Batch Apex — Stateful Pattern
By default, Batch Apex does not share state across `execute()` calls. Implement `Database.Stateful` to accumulate data across chunks.

```apex
public class RevenueRollupBatch
    implements Database.Batchable<sObject>, Database.Stateful {

    // Instance variables — preserved across execute() calls because of Stateful
    private Map<Id, Decimal> accountRevMap = new Map<Id, Decimal>();
    private Integer totalProcessed = 0;
    private List<String> errors = new List<String>();

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // QueryLocator allows up to 50M records; Iterable allows custom logic
        return Database.getQueryLocator([
            SELECT Id, AccountId, Amount, StageName
            FROM Opportunity
            WHERE StageName = 'Closed Won'
            AND CloseDate = THIS_YEAR
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        totalProcessed += scope.size();

        for (Opportunity opp : scope) {
            Decimal current = accountRevMap.containsKey(opp.AccountId)
                ? accountRevMap.get(opp.AccountId)
                : 0;
            accountRevMap.put(opp.AccountId, current + opp.Amount);
        }

        // Batch DML — update accounts in this execute() chunk
        // Note: updating in execute() is fine for independent updates
        // If you need all data first (rollup), accumulate and update in finish()
    }

    public void finish(Database.BatchableContext bc) {
        // All execute() calls done — now we have the full rollup map
        List<Account> toUpdate = new List<Account>();
        for (Id accId : accountRevMap.keySet()) {
            toUpdate.add(new Account(
                Id = accId,
                Annual_Closed_Revenue__c = accountRevMap.get(accId)
            ));
        }
        update toUpdate;

        // Kick follow-on job
        System.enqueueJob(new NotifyAccountOwnersJob(accountRevMap.keySet()));

        // Email summary
        AsyncApexJob job = [
            SELECT Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()
        ];
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{ 'admin@example.com' });
        mail.setSubject('Revenue Rollup Complete');
        mail.setPlainTextBody(
            'Processed: ' + totalProcessed +
            '\nErrors: ' + job.NumberOfErrors
        );
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    }
}
```

**Database.Stateful trade-offs:**
- State is serialised between execute() calls — large state objects consume heap
- Stateful jobs run slower than non-stateful because of serialization overhead
- Heap limit applies to accumulated state — keep accumulators lean (Maps of Id to primitive, not full sObjects)

### Batch Apex — Iterable Instead of QueryLocator
When data can't come from a single SOQL query (e.g., external API pagination, complex filtering), use `Iterable<sObject>`:

```apex
public Database.QueryLocator start(Database.BatchableContext bc) {
    // NOT available for Iterable — use this method signature instead:
    // public Iterable<Account> start(...)
    return null; // replace with Iterable variant
}

// Iterable variant — use when data source is not a simple SOQL:
public class ExternalDataBatch implements Database.Batchable<DataWrapper> {

    public Iterable<DataWrapper> start(Database.BatchableContext bc) {
        // Returns custom Iterable — fetches from external source
        return new ExternalDataIterable('https://api.example.com/data');
    }

    public void execute(Database.BatchableContext bc, List<DataWrapper> scope) {
        // process scope items
    }

    public void finish(Database.BatchableContext bc) {}
}
```

**QueryLocator vs Iterable:**
| Feature | QueryLocator | Iterable |
|---------|-------------|---------|
| Max records | 50 million | 50,000 |
| Source | SOQL only | Any (API, calculation) |
| Cursor | Server-side (efficient) | In-memory |

### Scheduled Apex — Cron and Best Practices
```apex
public class DailyDataSync implements System.Schedulable {
    public void execute(System.SchedulableContext ctx) {
        // Never put heavy logic here — just kick the batch
        Integer batchSize = Integer.valueOf(
            [SELECT Value__c FROM Config__mdt WHERE DeveloperName = 'BatchSize'].Value__c
        );
        Database.executeBatch(new AccountSyncBatch(), batchSize);
    }
}

// Schedule via Apex:
String cronExp = '0 0 1 * * ?'; // 1 AM daily
System.schedule('Daily Data Sync', cronExp, new DailyDataSync());

// Schedule via Setup: Setup > Scheduled Jobs > Schedule Apex
```

CRON expression format: `Seconds Minutes Hours Day-Month Month Day-Week [Year]`
- `0 0 1 * * ?` — every day at 1:00 AM
- `0 0 8 ? * MON-FRI` — weekdays at 8:00 AM
- `0 0/4 * * * ?` — every 4 hours
- `?` means "no specific value" — required when Day-Month OR Day-Week has a value (not both)

### Monitoring Async Jobs
```apex
// Query all async jobs
List<AsyncApexJob> jobs = [
    SELECT Id, Status, JobType, ApexClass.Name,
           NumberOfErrors, JobItemsProcessed, TotalJobItems,
           CreatedDate, CompletedDate
    FROM AsyncApexJob
    WHERE Status IN ('Queued', 'Processing', 'Holding')
    ORDER BY CreatedDate DESC
    LIMIT 50
];

// Job statuses: Queued, Holding, Preparing, Processing, Aborted, Completed, Failed
// "Holding" = batch is queued but 5-job limit reached — will auto-start when a slot opens
```

### Platform Events as Async Trigger Replacement
A common PDII architecture question: use Platform Events to decouple a trigger from async processing without @future limits.

```apex
// In trigger — publish event (fast, no governor limit hit on processing)
Trigger on Account (after insert) {
    List<Account_Created__e> events = new List<Account_Created__e>();
    for (Account acc : Trigger.new) {
        events.add(new Account_Created__e(
            Account_Id__c = acc.Id,
            Account_Name__c = acc.Name
        ));
    }
    EventBus.publish(events);
}

// Separate trigger on the Platform Event — fires async, fresh governor limits
trigger AccountCreatedEventTrigger on Account_Created__e (after insert) {
    List<Id> accountIds = new List<Id>();
    for (Account_Created__e evt : Trigger.new) {
        accountIds.add(evt.Account_Id__c);
    }
    // Call integration, send notifications, etc.
    AccountService.syncToExternalSystem(accountIds);
}
```

### Testing All Async Types
```apex
@isTest
static void testQueueable() {
    List<Id> ids = /* setup data */;
    Test.startTest();
    System.enqueueJob(new ContactSyncJob(ids, 1));
    Test.stopTest(); // Forces queued job to execute synchronously
    // Assert here
}

@isTest
static void testBatch() {
    insert testData;
    Test.startTest();
    RevenueRollupBatch b = new RevenueRollupBatch();
    Database.executeBatch(b, 200);
    Test.stopTest();
    // Batch executed synchronously by Test.stopTest()
    // Assert updated account values
}

@isTest
static void testScheduled() {
    Test.startTest();
    String jobId = System.schedule('Test Job', '0 0 1 * * ?', new DailyDataSync());
    Test.stopTest();
    CronTrigger ct = [SELECT Id, CronExpression, State FROM CronTrigger WHERE Id = :jobId];
    System.assertEquals('WAITING', ct.State);
}

@isTest
static void testPlatformEventPublish() {
    Test.startTest();
    insert new Account(Name = 'Test'); // trigger publishes event
    Test.stopTest(); // stopTest delivers events
    // Assert results of the event trigger
}
```

---

## PTA / SA Relevance

### When This Comes Up in Engagements
The single most common performance conversation in Salesforce engagements is "why is our async processing slow / failing / unreliable?" Almost always the answer is one of:
1. Batch Apex with batch size 1 (developer misread the meaning of the parameter)
2. @future called in a loop — hitting the 50-call limit
3. Queueable chains exceeding depth in test, causing jobs to silently not fire
4. Stateful batch with a giant Map<Id, List<sObject>> accumulating full records instead of IDs

As a PTA, being able to diagnose these in an architecture assessment conversation — not just code review — is a differentiator. The question "how are you handling your nightly data sync?" reveals the entire technical maturity of the development team.

### Common Partner Mistakes
- **Batch size of 1** — developers set batchSize=1 thinking it processes "one at a time safely." This creates 50,000 execute() calls for 50,000 records, consuming async limits and running 100x slower than batchSize=200.
- **@future in a loop** — `for (Account a : accounts) { callExternalService(a.Id); }` hits the 50-future-per-transaction limit and then throws `LimitException`.
- **Not handling Stateful heap** — accumulating full sObject lists in a Stateful batch. Should accumulate IDs or aggregated primitives only.
- **Scheduled Apex with inline business logic** — scheduled class contains 200 lines of logic instead of just kicking a batch. When the schedule fires and the logic fails, you have no retry mechanism.
- **Missing error handling in finish()** — `finish()` always runs even if all `execute()` calls failed. Partners check `bc.getJobId()` status in `finish()` but forget to send alerts when `NumberOfErrors > 0`.

### Enterprise Scale Considerations
At 10M+ records:
- Batch Apex with `Database.getQueryLocator` is the correct tool — `Iterable` hits the 50,000-row limit
- Stateful batch state is serialised to heap; accumulating just IDs (not full objects) for 10M records in chunks of 200 means ~50,000 iterations — the Map<Id, Decimal> can hold ~250,000 entries before heap pressure
- Consider splitting large batch jobs: one batch queries and partitions data, kick N parallel batches for processing
- `Database.executeBatch()` with the 5-concurrent-job limit means nightly job stacks. Use job chaining in `finish()` rather than scheduling 10 separate batch jobs that may all fire at once

---

## Architecture

```mermaid
flowchart TD
    TRIGGER["DML Event (Trigger)"] --> Q1{"Volume > 50 or<br/>needs callout?"}
    Q1 -->|No| SYNC["Synchronous Apex"]
    Q1 -->|Yes| Q2{"Millions of<br/>records?"}
    Q2 -->|Yes| BATCH["Batch Apex<br/>Database.Batchable"]
    Q2 -->|No| Q3{"Need object<br/>params or chaining?"}
    Q3 -->|Yes| QUEUE["Queueable<br/>System.Queueable"]
    Q3 -->|No| FUTURE["@future method"]
    BATCH -->|finish()| CHAIN_BATCH["Chain: executeBatch()"]
    QUEUE -->|execute()| CHAIN_Q["Chain: enqueueJob()"]
    TRIGGER -->|Decouple| PE["Platform Event publish"]
    PE --> PE_TRIGGER["Platform Event Trigger<br/>(fresh limits)"]
    PE_TRIGGER --> QUEUE

    style BATCH fill:#e8f4e8
    style QUEUE fill:#e8f4f8
    style FUTURE fill:#f9f9e8
    style PE fill:#f4e8f8
```

**Limitations:**
- `@future` cannot be called from a Queueable or Batch context
- Queueable cannot be enqueued from within a Batch `execute()` — use Batch `finish()` instead, or a Platform Event
- Batch jobs started from `finish()` count toward the 5-concurrent limit
- Test context Queueable chains have a max depth of 1 enqueue — you cannot chain two levels deep in tests
- `Database.Stateful` increases execution time; for very large jobs, consider a staging custom object instead

---

## Key Facts to Memorize

- `@future` methods must be `static`, return `void`, and accept only primitives (no sObjects)
- `@future(callout=true)` is required to make HTTP callouts from a @future method
- Queueable: single `execute(QueueableContext ctx)` method; returns a Job ID
- `Database.AllowsCallouts` interface required on Queueable to make callouts
- Batch `start()` returns `Database.QueryLocator` (up to 50M) or `Iterable` (up to 50,000)
- Batch default chunk size: 200; max chunk size: 2,000
- `Database.Stateful` preserves instance variable values between `execute()` calls
- Without `Database.Stateful`, all instance variables are reset to null/0/empty between calls
- Max 5 concurrent active Batch Apex jobs per org (status = Queued or Processing)
- Scheduled Apex CRON: `Seconds Minutes Hours Day-Month Month Day-Week [Year]`
- `?` in CRON must be used in either Day-Month or Day-Week (not both, not neither)
- `Test.stopTest()` synchronously executes all enqueued async jobs AND delivers platform events
- `System.schedule()` returns a `CronTriggerId`; query `CronTrigger` to inspect state
- Queueable job depth limit: 5 within a single chain in test context; effectively unlimited in production

---

## Exam Traps

- "You can call @future from another @future method" — False. @future cannot call @future. Use Queueable chaining instead.
- "Batch Apex with batchSize=1 is safer for complex processing" — False. Size 1 maximizes execute() calls and async limit consumption. Prefer 200 (default) or tune based on complexity.
- "Database.Stateful variables are reset between execute() calls" — False. That's the default (non-Stateful) behavior. Stateful *preserves* them.
- "QueryLocator and Iterable both support 50 million records" — False. Iterable is capped at 50,000 rows; QueryLocator supports up to 50 million.
- "You can enqueue a Queueable from inside a Batch execute() method" — False. Enqueue only from `finish()` in Batch context.
- "Test.stopTest() only flushes @future methods, not Batch or Queueable" — False. stopTest() synchronously executes ALL async types.
- "A Scheduled Apex class can have any method name" — False. Must implement `System.Schedulable` and the method signature must be exactly `public void execute(System.SchedulableContext ctx)`.

---

## Practice Questions

**Q:** A developer needs to chain processing: first sync 10,000 accounts to an external system, then after all accounts are synced, send a summary report. What is the correct architecture?

**A:** Use Batch Apex with `Database.Batchable` to process the 10,000 accounts (handles governor limits with chunked execution). In the `finish()` method, send the summary report or enqueue a Queueable/Schedulable for the reporting step. Do NOT use @future (primitive-only params, no chaining, 50-call limit), and do not put the summary in each `execute()` call (it would fire once per chunk, not once overall).

---

**Q:** A Queueable job that makes a callout fails with `System.CalloutException: You have uncommitted work pending. Please commit or rollback before calling out.` What is wrong?

**A:** The Queueable class is performing a DML operation (insert/update/delete) before the callout. In Salesforce, you cannot make a callout after uncommitted DML in the same transaction. Fix: perform the callout first, then do DML based on the response. If both DML and callout are required before and after, split into two separate Queueable jobs chained together.
