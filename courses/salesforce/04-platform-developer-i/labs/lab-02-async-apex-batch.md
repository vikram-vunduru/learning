# Lab 2: Async Apex — Batch Job and Scheduler

## Objectives
- Implement a Batchable Apex class that processes Contact records in configurable chunks
- Set a custom field `Needs_Review__c` to true on Contacts not modified in the last 30 days
- Schedule the batch to run nightly at 2:00 AM using a Schedulable class
- Write comprehensive unit tests including bulk behavior using Test.startTest() and Test.stopTest()

## Prerequisites
- A Salesforce Developer Edition org or sandbox
- The custom field `Needs_Review__c` (Checkbox) must exist on the Contact object
- Developer Console access or VS Code with Salesforce Extension Pack
- Understanding of governor limits, @isTest, and async Apex concepts from Lectures 14-17 and 20-21

## Estimated Time
40 minutes

### Pre-Lab Setup: Create the Custom Field

Before writing any Apex, you need the custom field the batch job will populate.

1. Navigate to **Setup > Object Manager > Contact > Fields & Relationships > New**.
2. Select **Checkbox** as the data type and click **Next**.
3. Set:
   - **Field Label**: `Needs Review`
   - **Field Name**: `Needs_Review__c` (auto-populated)
   - **Default Value**: Unchecked
4. Click **Next** twice, then **Save**.

---

## Step-by-Step Instructions

### Part 1: Create the Batch Apex Class

1. In the Developer Console, go to **File > New > Apex Class** and name it `ContactReviewBatch`.

2. Replace all content with:

```apex
/**
 * ContactReviewBatch
 *
 * Finds Contacts that have not been modified in 30+ days
 * and marks them as needing review (Needs_Review__c = true).
 *
 * Designed to run nightly via ContactReviewScheduler.
 */
global class ContactReviewBatch implements Database.Batchable<SObject>, Database.Stateful {

    // Track how many records were updated (Database.Stateful preserves this across execute() calls)
    global Integer totalUpdated = 0;

    // ----------------------------------------------------------------
    // start() — defines the scope of records to process
    // ----------------------------------------------------------------
    global Database.QueryLocator start(Database.BatchableContext bc) {
        DateTime thirtyDaysAgo = DateTime.now().addDays(-30);
        return Database.getQueryLocator(
            'SELECT Id, LastName, Needs_Review__c, LastModifiedDate ' +
            'FROM Contact ' +
            'WHERE LastModifiedDate <= :thirtyDaysAgo ' +
            'AND Needs_Review__c = false'
        );
    }

    // ----------------------------------------------------------------
    // execute() — called once per batch chunk (default 200 records)
    // ----------------------------------------------------------------
    global void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Contact> contactsToUpdate = new List<Contact>();

        for (SObject record : scope) {
            Contact c = (Contact) record;
            c.Needs_Review__c = true;
            contactsToUpdate.add(c);
        }

        if (!contactsToUpdate.isEmpty()) {
            update contactsToUpdate;
            totalUpdated += contactsToUpdate.size();
        }
    }

    // ----------------------------------------------------------------
    // finish() — called once after all batches complete
    // ----------------------------------------------------------------
    global void finish(Database.BatchableContext bc) {
        // Log a summary — in production you might send an email or create a Platform Event
        System.debug(LoggingLevel.INFO,
            'ContactReviewBatch complete. Total records flagged: ' + totalUpdated);
    }
}
```

3. Save the file.

**Key design notes:**
- `Database.Stateful` is implemented so `totalUpdated` persists across all execute() invocations. Without this, instance variables reset to their initial values between chunks.
- The SOQL uses a bind variable (`:thirtyDaysAgo`) inside a String passed to `Database.getQueryLocator`. Note that SOQL bind variables in dynamic queries must reference a variable in scope at the time the string is evaluated — the `:thirtyDaysAgo` variable is in scope here.
- The WHERE clause includes `Needs_Review__c = false` to skip records already flagged — this makes the job idempotent.

---

### Part 2: Create the Scheduler Class

1. In the Developer Console, go to **File > New > Apex Class** and name it `ContactReviewScheduler`.

2. Replace all content with:

```apex
/**
 * ContactReviewScheduler
 *
 * Schedulable wrapper that fires ContactReviewBatch on a cron schedule.
 * Schedule via:
 *   System.schedule('Nightly Contact Review', '0 0 2 * * ?', new ContactReviewScheduler());
 *
 * Cron expression breakdown: 0 0 2 * * ?
 *   Seconds(0) Minutes(0) Hours(2) DayOfMonth(*) Month(*) DayOfWeek(?)
 *   = Every day at 2:00 AM
 */
global class ContactReviewScheduler implements Schedulable {

    global void execute(SchedulableContext sc) {
        ContactReviewBatch batch = new ContactReviewBatch();
        Database.executeBatch(batch, 200); // process 200 Contacts per chunk
    }
}
```

3. Save the file.

---

### Part 3: Schedule the Job via Anonymous Apex

1. In the Developer Console, open the **Execute Anonymous** window: **Debug > Open Execute Anonymous Window** (or `Ctrl+E`).

2. Type and execute the following to schedule the job:

```apex
// Schedule to run every day at 2:00 AM
String cronExp = '0 0 2 * * ?';
String jobName = 'Nightly Contact Review';

// Remove any existing schedule with this name first
for (CronTrigger ct : [SELECT Id FROM CronTrigger WHERE CronJobDetail.Name = :jobName]) {
    System.abortJob(ct.Id);
}

System.schedule(jobName, cronExp, new ContactReviewScheduler());
System.debug('Job scheduled successfully');
```

3. Verify the job is scheduled: navigate to **Setup > Scheduled Jobs** and confirm "Nightly Contact Review" appears in the list.

---

### Part 4: Write the Unit Tests

1. In the Developer Console, go to **File > New > Apex Class** and name it `ContactReviewBatchTest`.

2. Replace all content with:

```apex
@isTest
private class ContactReviewBatchTest {

    // ----------------------------------------------------------------
    // Setup: create test Contacts with old LastModifiedDate
    // We can't directly set LastModifiedDate (read-only), so we create
    // Contacts and use Test.startTest()/stopTest() to control execution.
    // For date simulation, use a workaround: set a custom earlier date
    // via the batch's own query logic.
    //
    // NOTE: In the real org, LastModifiedDate updates automatically.
    // For testing, we confirm the batch processes records by temporarily
    // adjusting the query window or inserting records and confirming
    // the execute() path runs correctly.
    // ----------------------------------------------------------------

    @testSetup
    static void makeData() {
        // Create 10 contacts — in test context these are new records.
        // We will set Needs_Review__c = false and verify the batch sets it true.
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 10; i++) {
            contacts.add(new Contact(
                LastName       = 'TestContact ' + i,
                Needs_Review__c = false
            ));
        }
        insert contacts;
    }

    // ----------------------------------------------------------------
    // TEST 1: Batch sets Needs_Review__c = true for eligible contacts
    // We simulate "old" records by directly calling execute() with a
    // hand-built list (unit-testing the execute method in isolation).
    // ----------------------------------------------------------------
    @isTest
    static void testExecute_setsNeedsReviewTrue() {
        List<Contact> contacts = [SELECT Id, Needs_Review__c FROM Contact];
        System.assertEquals(10, contacts.size(), 'Should have 10 test contacts');

        // Directly invoke execute with the list (bypasses query in start())
        ContactReviewBatch batch = new ContactReviewBatch();

        Test.startTest();
        // Simulate what execute() does with this scope
        batch.execute(null, contacts);
        Test.stopTest();

        List<Contact> updated = [SELECT Needs_Review__c FROM Contact];
        for (Contact c : updated) {
            System.assertEquals(true, c.Needs_Review__c,
                'Needs_Review__c should be true after batch execute');
        }
        System.assertEquals(10, batch.totalUpdated,
            'totalUpdated counter should reflect 10 processed records');
    }

    // ----------------------------------------------------------------
    // TEST 2: Full batch execution via Database.executeBatch
    // Uses a modified approach: insert contacts, then run batch which
    // processes only contacts where LastModifiedDate <= 30 days ago.
    // Since test contacts were just created, the standard query will
    // return 0 records. We test the scheduler and wiring instead.
    // ----------------------------------------------------------------
    @isTest
    static void testFullBatchRun_schedulerWiring() {
        Test.startTest();
        // Run via executeBatch — tests the full lifecycle (start/execute/finish)
        ContactReviewBatch batch = new ContactReviewBatch();
        Id jobId = Database.executeBatch(batch, 200);
        Test.stopTest();
        // Batch completed synchronously — no exception means start/execute/finish ran
        System.assertNotEquals(null, jobId, 'executeBatch should return a valid AsyncApexJob Id');
    }

    // ----------------------------------------------------------------
    // TEST 3: Bulk — verify execute handles 200 records without hitting limits
    // ----------------------------------------------------------------
    @isTest
    static void testBulkExecute_200Records() {
        // Build 200 contacts in memory (not inserted yet — we pass them directly to execute)
        List<Contact> bulkContacts = new List<Contact>();
        for (Integer i = 0; i < 200; i++) {
            bulkContacts.add(new Contact(
                LastName        = 'BulkContact ' + i,
                Needs_Review__c = false
            ));
        }
        insert bulkContacts;

        ContactReviewBatch batch = new ContactReviewBatch();

        Test.startTest();
        batch.execute(null, bulkContacts);
        Test.stopTest();

        System.assertEquals(200, batch.totalUpdated,
            'Should update all 200 records without hitting governor limits');

        List<Contact> verified = [SELECT Needs_Review__c FROM Contact
                                  WHERE LastName LIKE 'BulkContact %'];
        for (Contact c : verified) {
            System.assertEquals(true, c.Needs_Review__c,
                'All bulk contacts should have Needs_Review__c = true');
        }
    }

    // ----------------------------------------------------------------
    // TEST 4: Scheduler — System.schedule runs without exception
    // ----------------------------------------------------------------
    @isTest
    static void testScheduler_schedulesSuccessfully() {
        Test.startTest();
        String jobId = System.schedule(
            'Test Contact Review Job',
            '0 0 2 * * ?',
            new ContactReviewScheduler()
        );
        Test.stopTest();

        System.assertNotEquals(null, jobId,
            'System.schedule should return a valid CronTrigger Id');
        List<CronTrigger> ct = [SELECT Id, CronExpression FROM CronTrigger
                                WHERE Id = :jobId];
        System.assertEquals(1, ct.size(), 'Scheduled job should appear in CronTrigger');
    }
}
```

3. Save the file.

4. Run all tests: **Test > Run All** in the Developer Console.

---

## Verification

1. All 4 test methods should pass with green checkmarks.

2. Check code coverage: Developer Console > **Tests > Code Coverage** — `ContactReviewBatch` and `ContactReviewScheduler` should show 90%+ coverage.

3. Navigate to **Setup > Apex Jobs** (or Setup > Monitor > Apex Jobs) and verify the batch job history shows completed runs from the test execution.

4. Manually trigger the batch to run now via Execute Anonymous:
```apex
Database.executeBatch(new ContactReviewBatch(), 200);
```
After it completes, spot-check a Contact record with a `LastModifiedDate` older than 30 days and confirm `Needs_Review__c` is now checked.

## Challenge Extension

Enhance the batch to send a summary email when it finishes:

1. In the `finish()` method, use `Messaging.SingleEmailMessage` to send an email to the org administrator.

2. The email body should include the count of records flagged (`totalUpdated`), the batch job Id from `bc.getJobId()`, and the completion timestamp.

3. Write a test that:
   - Calls `finish()` with a mock `BatchableContext`
   - Verifies that `Messaging.getAnyUnsentEmail()` returns one email (use `Messaging.reserveSingleEmailCapacity(1)` in the test setup)

**Hint:** To get a mock `BatchableContext`, use `Database.executeBatch()` inside startTest/stopTest — the `bc` passed to `finish()` will have a real `getJobId()`.
