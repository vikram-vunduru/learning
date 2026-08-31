# Lab 1: Apex Triggers and Bulkification

## Objectives
- Write a bulkified Account trigger using the handler class pattern
- Implement before insert logic to auto-populate the Rating field based on AnnualRevenue
- Implement after insert logic to create a Follow Up Task for every new Account
- Validate bulkified behavior by testing with 200 records in a unit test

## Prerequisites
- A Salesforce Developer Edition org or sandbox
- Setup > Developer Console access OR VS Code with Salesforce Extension Pack installed
- Understanding of trigger context variables (Trigger.new, Trigger.newMap) from Lecture 8
- Familiarity with @isTest and governor limits from Lectures 20-21

## Estimated Time
45 minutes

## Step-by-Step Instructions

### Part 1: Create the Trigger Handler Class

The handler class pattern separates trigger logic from the trigger itself. The trigger stays thin and delegates all processing to the handler.

1. Open the **Developer Console**: click the gear icon in the top-right corner of any Salesforce page and select **Developer Console**.

2. Navigate to **File > New > Apex Class**.

3. Name the class `AccountTriggerHandler` and click **OK**.

4. Replace all content with the following code:

```apex
public with sharing class AccountTriggerHandler {

    /**
     * Before Insert: Set Rating based on AnnualRevenue
     * Revenue >= 10,000,000  → 'Hot'
     * Revenue >= 1,000,000   → 'Warm'
     * Revenue < 1,000,000    → 'Cold'
     */
    public static void handleBeforeInsert(List<Account> newAccounts) {
        for (Account acct : newAccounts) {
            if (acct.AnnualRevenue == null) {
                acct.Rating = 'Cold';
            } else if (acct.AnnualRevenue >= 10000000) {
                acct.Rating = 'Hot';
            } else if (acct.AnnualRevenue >= 1000000) {
                acct.Rating = 'Warm';
            } else {
                acct.Rating = 'Cold';
            }
        }
    }

    /**
     * After Insert: Create a Follow Up Task for each new Account
     * Uses a single DML insert for all tasks (bulkified)
     */
    public static void handleAfterInsert(List<Account> newAccounts) {
        List<Task> tasksToInsert = new List<Task>();

        for (Account acct : newAccounts) {
            Task t = new Task(
                Subject      = 'Follow Up',
                Status       = 'Not Started',
                Priority     = 'Normal',
                WhatId       = acct.Id,
                ActivityDate = Date.today().addDays(7),
                OwnerId      = acct.OwnerId
            );
            tasksToInsert.add(t);
        }

        if (!tasksToInsert.isEmpty()) {
            insert tasksToInsert;
        }
    }
}
```

5. Click **File > Save** (or press `Ctrl+S` / `Cmd+S`).

**Why this design?** Notice that `handleAfterInsert` builds a list of Tasks and inserts the entire list in a single DML call. If instead we had called `insert t` inside the loop, we would consume one DML statement per record — at 200 records that exceeds the 150 DML limit.

---

### Part 2: Create the Trigger

1. In the Developer Console, navigate to **File > New > Apex Trigger**.

2. In the dialog:
   - **Name**: `AccountTrigger`
   - **sObject**: `Account`
   - Click **Submit**.

3. Replace all content with:

```apex
trigger AccountTrigger on Account (before insert, after insert) {

    if (Trigger.isBefore && Trigger.isInsert) {
        AccountTriggerHandler.handleBeforeInsert(Trigger.new);
    }

    if (Trigger.isAfter && Trigger.isInsert) {
        AccountTriggerHandler.handleAfterInsert(Trigger.new);
    }
}
```

4. Save the file.

**Why so thin?** A trigger with only routing logic — checking context variables and calling handler methods — is easy to read, easy to extend, and easy to test. All testable logic lives in the handler class where it can be called directly without always going through a DML operation.

---

### Part 3: Write the Unit Tests

1. In the Developer Console, navigate to **File > New > Apex Class**.

2. Name the class `AccountTriggerHandlerTest` and click **OK**.

3. Replace all content with:

```apex
@isTest
private class AccountTriggerHandlerTest {

    // ----------------------------------------------------------------
    // TEST 1: Single record — Hot rating
    // ----------------------------------------------------------------
    @isTest
    static void testBeforeInsert_hotRatingWhenRevenueOver10M() {
        Account acct = new Account(
            Name          = 'BigCorp',
            AnnualRevenue = 15000000
        );

        Test.startTest();
        insert acct;
        Test.stopTest();

        Account result = [SELECT Rating FROM Account WHERE Id = :acct.Id];
        System.assertEquals('Hot', result.Rating,
            'Rating should be Hot when AnnualRevenue >= 10,000,000');
    }

    // ----------------------------------------------------------------
    // TEST 2: Single record — Warm rating
    // ----------------------------------------------------------------
    @isTest
    static void testBeforeInsert_warmRatingWhenRevenueBetween1MAnd10M() {
        Account acct = new Account(
            Name          = 'MidCorp',
            AnnualRevenue = 3000000
        );

        Test.startTest();
        insert acct;
        Test.stopTest();

        Account result = [SELECT Rating FROM Account WHERE Id = :acct.Id];
        System.assertEquals('Warm', result.Rating,
            'Rating should be Warm when AnnualRevenue is between 1M and 10M');
    }

    // ----------------------------------------------------------------
    // TEST 3: Single record — Cold rating (null revenue)
    // ----------------------------------------------------------------
    @isTest
    static void testBeforeInsert_coldRatingWhenRevenueIsNull() {
        Account acct = new Account(Name = 'SmallCorp');

        Test.startTest();
        insert acct;
        Test.stopTest();

        Account result = [SELECT Rating FROM Account WHERE Id = :acct.Id];
        System.assertEquals('Cold', result.Rating,
            'Rating should be Cold when AnnualRevenue is null');
    }

    // ----------------------------------------------------------------
    // TEST 4: Single record — Task created after insert
    // ----------------------------------------------------------------
    @isTest
    static void testAfterInsert_taskCreatedForNewAccount() {
        Account acct = new Account(
            Name          = 'TaskCorp',
            AnnualRevenue = 5000000
        );

        Test.startTest();
        insert acct;
        Test.stopTest();

        List<Task> tasks = [SELECT Subject, WhatId FROM Task WHERE WhatId = :acct.Id];
        System.assertEquals(1, tasks.size(),
            'Exactly one Follow Up task should be created for a new Account');
        System.assertEquals('Follow Up', tasks[0].Subject,
            'Task subject should be Follow Up');
    }

    // ----------------------------------------------------------------
    // TEST 5: BULK — 200 records — ratings and tasks
    // ----------------------------------------------------------------
    @isTest
    static void testBulkInsert_200Accounts_ratingsAndTasksCreated() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            Decimal revenue = (i < 67)  ? 15000000 :   // Hot
                              (i < 134) ? 3000000  :   // Warm
                                          500000;       // Cold
            accounts.add(new Account(
                Name          = 'Bulk Account ' + i,
                AnnualRevenue = revenue
            ));
        }

        Test.startTest();
        insert accounts;
        Test.stopTest();

        // Verify all 200 tasks were created in one DML
        List<Task> tasks = [SELECT Id FROM Task WHERE WhatId IN :accounts];
        System.assertEquals(200, tasks.size(),
            '200 Follow Up tasks should be created for 200 new Accounts');

        // Spot-check: first 67 should be Hot
        List<Account> hotAccounts = [
            SELECT Rating FROM Account
            WHERE Name LIKE 'Bulk Account %' AND AnnualRevenue = 15000000
        ];
        for (Account a : hotAccounts) {
            System.assertEquals('Hot', a.Rating, 'Expected Hot rating for high revenue');
        }
    }
}
```

4. Save the file.

5. Run the tests: in the Developer Console, click **Test > Run All** or right-click the test class and select **Run Tests**.

---

## Verification

After all tests pass:

1. In the Developer Console, click **Test > Code Coverage** to verify that `AccountTriggerHandler` and `AccountTrigger` show 100% coverage.

2. Manually verify the trigger works in the UI:
   - Navigate to the **Accounts** tab and click **New**.
   - Enter a name and set **Annual Revenue** to `12000000`.
   - Save the record.
   - Confirm the **Rating** field shows **Hot**.
   - Navigate to the **Activity** section of the record and confirm a **Follow Up** task exists with a due date 7 days from today.

3. Check the trigger handles null revenue gracefully:
   - Create another Account with no Annual Revenue.
   - Confirm Rating is **Cold** and a Follow Up task still exists.

## Challenge Extension

Extend the handler to support **before update** in addition to before insert:

1. Modify `AccountTrigger` to also fire on `before update`.

2. In `AccountTriggerHandler`, add a `handleBeforeUpdate(List<Account> newAccounts, Map<Id,Account> oldMap)` method.

3. Only re-calculate Rating if `AnnualRevenue` has actually changed on the record (compare `newAccounts` to `oldMap`).

4. Write a unit test that:
   - Inserts an Account with `AnnualRevenue = 500000` (Cold)
   - Updates it to `AnnualRevenue = 12000000`
   - Asserts the Rating is now **Hot**

**Hint:** Use `Trigger.oldMap` in the trigger and pass it to the handler method to compare old vs. new values.
