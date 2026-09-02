# Lab 2: Async Apex — Batch Job and Scheduler

## What You Need to Be Able to Do

### Custom Field Setup
- [ ] Create a Checkbox field `Needs_Review__c` on the Contact object via Setup > Object Manager > Contact > Fields & Relationships

### Batch Apex Class
- [ ] Create `ContactReviewBatch` declared `global class ContactReviewBatch implements Database.Batchable<SObject>, Database.Stateful`
- [ ] Add a `global Integer totalUpdated = 0` instance variable (requires `Database.Stateful` to persist between execute() calls)
- [ ] Implement `global Database.QueryLocator start(Database.BatchableContext bc)`:
  - Calculate `DateTime thirtyDaysAgo = DateTime.now().addDays(-30)`
  - Return `Database.getQueryLocator(...)` with query filtering `LastModifiedDate <= :thirtyDaysAgo AND Needs_Review__c = false`
- [ ] Implement `global void execute(Database.BatchableContext bc, List<SObject> scope)`:
  - Cast each record: `Contact c = (Contact) record`
  - Set `c.Needs_Review__c = true`
  - Collect into a list and insert in ONE DML call
  - Increment `totalUpdated += contactsToUpdate.size()`
- [ ] Implement `global void finish(Database.BatchableContext bc)`:
  - Log summary with `System.debug(LoggingLevel.INFO, 'Total flagged: ' + totalUpdated)`

### Scheduler Class
- [ ] Create `ContactReviewScheduler` declared `global class ContactReviewScheduler implements Schedulable`
- [ ] Implement `global void execute(SchedulableContext sc)` that calls `Database.executeBatch(new ContactReviewBatch(), 200)`
- [ ] Know the CRON expression for 2:00 AM daily: `'0 0 2 * * ?'` (7 fields: Seconds Minutes Hours DayOfMonth Month DayOfWeek Year-optional)

### Schedule via Execute Anonymous
- [ ] Know how to schedule the job: `System.schedule('Nightly Contact Review', '0 0 2 * * ?', new ContactReviewScheduler())`
- [ ] Know how to abort existing schedule before re-scheduling: query `CronTrigger` by `CronJobDetail.Name`, call `System.abortJob(ct.Id)`

### Test Class
- [ ] Create `ContactReviewBatchTest` annotated `@isTest private class`
- [ ] Write `@testSetup` that inserts 10 Contacts with `Needs_Review__c = false`
- [ ] Write a test that calls `batch.execute(null, contacts)` directly to test execute() logic in isolation:
  - Assert all contacts have `Needs_Review__c = true` after execute
  - Assert `batch.totalUpdated == 10`
- [ ] Write a full batch run test using `Database.executeBatch(batch, 200)` inside `startTest/stopTest`
- [ ] Write a bulk test: insert 200 contacts, call `execute()` directly, assert `totalUpdated == 200`
- [ ] Write a scheduler test: call `System.schedule(...)` inside `startTest/stopTest`, assert returned job ID is not null, query `CronTrigger` to confirm the job is scheduled

### Verification
- [ ] All 4 test methods pass; 90%+ coverage on `ContactReviewBatch` and `ContactReviewScheduler`
- [ ] Navigate to Setup > Apex Jobs and verify batch execution history
- [ ] Manually fire the batch via Execute Anonymous: `Database.executeBatch(new ContactReviewBatch(), 200)`
- [ ] Check Setup > Scheduled Jobs for the nightly scheduled entry

### Challenge: Email Notification in finish()
- [ ] Add `Messaging.SingleEmailMessage` in `finish()` to send a summary to the org admin
- [ ] Include `bc.getJobId()`, `totalUpdated`, and `DateTime.now()` in the email body
- [ ] Write a test that verifies the email is sent (use `Messaging.getAnyUnsentEmail()`)

---

## Key Code Patterns to Remember

```apex
// BATCH class declaration — both interfaces required
global class ContactReviewBatch implements Database.Batchable<SObject>, Database.Stateful {
    global Integer totalUpdated = 0;  // persists across execute() calls (Stateful)

    global Database.QueryLocator start(Database.BatchableContext bc) {
        DateTime thirtyDaysAgo = DateTime.now().addDays(-30);
        return Database.getQueryLocator(
            'SELECT Id, Needs_Review__c FROM Contact ' +
            'WHERE LastModifiedDate <= :thirtyDaysAgo AND Needs_Review__c = false'
        );
    }

    global void execute(Database.BatchableContext bc, List<SObject> scope) {
        List<Contact> toUpdate = new List<Contact>();
        for (SObject s : scope) {
            Contact c = (Contact) s;
            c.Needs_Review__c = true;
            toUpdate.add(c);
        }
        if (!toUpdate.isEmpty()) {
            update toUpdate;
            totalUpdated += toUpdate.size();
        }
    }

    global void finish(Database.BatchableContext bc) {
        System.debug(LoggingLevel.INFO, 'Complete. Flagged: ' + totalUpdated);
    }
}
```

```apex
// CRON — 7 fields: Sec Min Hour DayOfMonth Month DayOfWeek [Year]
// Every day at 2:00 AM
String cronExp = '0 0 2 * * ?';

// SCHEDULER — wraps batch in execute()
global void execute(SchedulableContext sc) {
    Database.executeBatch(new ContactReviewBatch(), 200);
}
```

```apex
// ASYNC TEST PATTERN — assert AFTER stopTest
Test.startTest();
Id jobId = Database.executeBatch(new ContactReviewBatch(), 200);
Test.stopTest();
// Batch has fully completed (start/execute/finish all ran synchronously)
System.assertNotEquals(null, jobId, 'Valid job ID expected');
```
