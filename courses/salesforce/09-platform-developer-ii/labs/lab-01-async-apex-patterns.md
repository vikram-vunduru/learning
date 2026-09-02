# Lab 01: Async Apex Patterns

## Lab Overview

**Estimated Time:** 2–3 hours  
**Prerequisites:** Developer Edition org or Scratch Org, VS Code + Salesforce Extension Pack  
**Covers:** Queueable chaining, Stateful Batch Apex, Scheduled Apex, Platform Event async trigger

---

## Scenario

You are building the async processing backbone for a CRM integration at a B2B SaaS company. Their Salesforce org syncs with an external ERP system. Three async jobs must work together:
1. A nightly Batch Apex job that identifies Accounts with stale ERP sync status
2. A Queueable chain that syncs each Account (with callout) to the ERP
3. A Platform Event trigger that fires async processing when a new Account is created

---

## Part 1: Stateful Batch Apex

**Objective**: Write a Batch Apex job that finds all Accounts where `ERP_Sync_Status__c = 'Pending'`, syncs them to an external system (mocked), and records the count of successes and failures.

**Step 1: Create the Custom Field**

In your org or scratch org, create a custom field on Account:
- **Label**: ERP Sync Status
- **API Name**: `ERP_Sync_Status__c`
- **Type**: Picklist
- **Values**: Pending, Synced, Failed, Not Applicable

**Step 2: Write the Batch Class**

```apex
public class ERPSyncBatch
    implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {

    // Stateful — preserved between execute() calls
    private Integer successCount = 0;
    private Integer failCount = 0;
    private List<Id> failedAccounts = new List<Id>();

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Name, External_ERP_Id__c, ERP_Sync_Status__c
            FROM Account
            WHERE ERP_Sync_Status__c = 'Pending'
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        List<Account> toUpdate = new List<Account>();

        for (Account acc : scope) {
            Boolean syncSuccess = callERPSystem(acc);
            acc.ERP_Sync_Status__c = syncSuccess ? 'Synced' : 'Failed';
            toUpdate.add(acc);

            if (syncSuccess) {
                successCount++;
            } else {
                failCount++;
                failedAccounts.add(acc.Id);
            }
        }

        update toUpdate;
    }

    public void finish(Database.BatchableContext bc) {
        AsyncApexJob job = [
            SELECT Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()
        ];

        // Send summary email
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{ 'admin@company.com' });
        mail.setSubject('ERP Sync Batch Complete');
        mail.setPlainTextBody(
            'Batch Status: ' + job.Status + '\n' +
            'Total Processed: ' + job.JobItemsProcessed + '\n' +
            'Successes: ' + successCount + '\n' +
            'Failures: ' + failCount + '\n' +
            'Failed Account IDs: ' + String.join(failedAccounts, ', ')
        );
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    }

    // Simulated callout — replace with real HttpRequest in production
    private Boolean callERPSystem(Account acc) {
        // In real implementation:
        // HttpRequest req = new HttpRequest();
        // req.setEndpoint('callout:ERP_API/accounts/' + acc.External_ERP_Id__c);
        // req.setMethod('PUT');
        // req.setBody(JSON.serialize(acc));
        // HttpResponse res = new Http().send(req);
        // return res.getStatusCode() == 200;

        // For this lab: simulate 90% success rate
        return Math.random() > 0.1;
    }
}
```

**Step 3: Test the Batch**

```apex
@isTest
private class ERPSyncBatchTest {

    @TestSetup
    static void setup() {
        List<Account> accs = new List<Account>();
        for (Integer i = 0; i < 50; i++) {
            accs.add(new Account(
                Name = 'Test Account ' + i,
                ERP_Sync_Status__c = 'Pending'
            ));
        }
        insert accs;
    }

    @isTest
    static void testBatchSyncsAccounts() {
        Integer pendingCount = [SELECT COUNT() FROM Account WHERE ERP_Sync_Status__c = 'Pending'];
        System.assertEquals(50, pendingCount);

        Test.startTest();
        Database.executeBatch(new ERPSyncBatch(), 200);
        Test.stopTest();

        // After stopTest(), batch has completed
        Integer pendingAfter = [SELECT COUNT() FROM Account WHERE ERP_Sync_Status__c = 'Pending'];
        System.assertEquals(0, pendingAfter, 'No accounts should still be Pending after batch');

        Integer processedCount = [SELECT COUNT() FROM Account
            WHERE ERP_Sync_Status__c IN ('Synced', 'Failed')];
        System.assertEquals(50, processedCount, 'All 50 accounts should be Synced or Failed');
    }
}
```

**Challenge**: Modify the batch to also create an `Integration_Log__c` record for each failed Account.

---

## Part 2: Queueable Chain with Callout

**Objective**: Write a Queueable job that processes a list of Account IDs (up to 10 at a time), makes a callout to the ERP, and chains itself for remaining IDs.

```apex
public class ERPAccountSyncJob implements System.Queueable, Database.AllowsCallouts {

    private List<Id> accountIds;
    private static final Integer CHUNK_SIZE = 10;

    public ERPAccountSyncJob(List<Id> accountIds) {
        this.accountIds = accountIds;
    }

    public void execute(System.QueueableContext ctx) {
        // Process current chunk
        List<Id> chunk = new List<Id>();
        List<Id> remaining = new List<Id>();

        for (Integer i = 0; i < accountIds.size(); i++) {
            if (i < CHUNK_SIZE) {
                chunk.add(accountIds[i]);
            } else {
                remaining.add(accountIds[i]);
            }
        }

        // Re-query for fresh data
        List<Account> accounts = [
            SELECT Id, Name, External_ERP_Id__c
            FROM Account
            WHERE Id IN :chunk
            WITH SECURITY_ENFORCED
        ];

        List<Account> toUpdate = new List<Account>();
        for (Account acc : accounts) {
            // TODO: Replace with real callout using Named Credential
            // Boolean success = makeCallout(acc);
            Boolean success = true; // simulated
            acc.ERP_Sync_Status__c = success ? 'Synced' : 'Failed';
            toUpdate.add(acc);
        }
        update toUpdate;

        // Chain for remaining IDs
        if (!remaining.isEmpty()) {
            System.enqueueJob(new ERPAccountSyncJob(remaining));
        }
    }
}
```

**Test the Queueable:**
```apex
@isTest
static void testQueueableChain() {
    List<Account> accs = new List<Account>();
    for (Integer i = 0; i < 25; i++) {
        accs.add(new Account(Name = 'Queue Test ' + i, ERP_Sync_Status__c = 'Pending'));
    }
    insert accs;

    List<Id> ids = new List<Id>(new Map<Id, Account>(accs).keySet());

    Test.startTest();
    System.enqueueJob(new ERPAccountSyncJob(ids));
    Test.stopTest();

    // In test context, only first enqueue executes synchronously
    // Assert first CHUNK_SIZE were processed
    Integer synced = [SELECT COUNT() FROM Account WHERE ERP_Sync_Status__c = 'Synced'];
    System.assert(synced >= 10, 'At least first chunk should be synced');
}
```

---

## Part 3: Scheduled Apex

**Objective**: Schedule the `ERPSyncBatch` to run every night at 2 AM.

```apex
public class ERPSyncScheduler implements System.Schedulable {
    public void execute(System.SchedulableContext ctx) {
        // Lookup batch size from Custom Metadata (not hardcoded)
        Integer batchSize = 200; // replace with Custom Metadata lookup
        Database.executeBatch(new ERPSyncBatch(), batchSize);
    }
}

// Schedule in Execute Anonymous:
String cron = '0 0 2 * * ?'; // 2 AM every day
System.schedule('Nightly ERP Sync', cron, new ERPSyncScheduler());

// Verify:
CronTrigger ct = [SELECT Id, CronExpression, State, NextFireTime
                  FROM CronTrigger WHERE CronJobDetail.Name = 'Nightly ERP Sync'];
System.debug('Next run: ' + ct.NextFireTime);
```

---

## Part 4: Platform Event Async Trigger (Bonus)

**Objective**: Instead of calling the ERP synchronously in the Account trigger, publish a Platform Event and process it asynchronously.

**Create Platform Event**: `Account_ERP_Sync__e` with field `Account_Id__c` (Text, External ID).

```apex
// Account trigger — just publish event
trigger AccountTrigger on Account (after insert) {
    List<Account_ERP_Sync__e> events = new List<Account_ERP_Sync__e>();
    for (Account acc : Trigger.new) {
        events.add(new Account_ERP_Sync__e(Account_Id__c = acc.Id));
    }
    EventBus.publish(events);
}

// Platform Event trigger — handles async processing with fresh limits
trigger AccountERPSyncTrigger on Account_ERP_Sync__e (after insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Account_ERP_Sync__e evt : Trigger.new) {
        accountIds.add(evt.Account_Id__c);
    }
    // Enqueue the sync job — Platform Event trigger can enqueue Queueable
    System.enqueueJob(new ERPAccountSyncJob(new List<Id>(accountIds)));
}
```

---

## Lab Completion Checklist

- [ ] ERPSyncBatch class created with `Database.Stateful`
- [ ] Batch processes Accounts with `ERP_Sync_Status__c = 'Pending'`
- [ ] Batch accumulates success/failure counts across execute() calls
- [ ] Batch sends summary email in finish()
- [ ] Test class covers batch execution and asserts status changes
- [ ] ERPAccountSyncJob processes in chunks of 10 with chaining
- [ ] ERPSyncScheduler kicks the batch from a scheduled job
- [ ] Platform Event trigger decouples Account creation from ERP sync

---

## PTA/SA Reflection

After completing this lab, you should be able to answer in a customer engagement:
- "How does your batch job handle partial failures?" → Stateful accumulation + finish() reporting
- "What happens if the ERP is down during the sync?" → Failed status + retry mechanism in Queueable
- "Can we disable the ERP sync for a data migration?" → Bypass mechanism via Custom Metadata checked in event trigger
- "How do we monitor the sync?" → AsyncApexJob query, ERP_Sync_Status__c field, Integration_Log__c object
