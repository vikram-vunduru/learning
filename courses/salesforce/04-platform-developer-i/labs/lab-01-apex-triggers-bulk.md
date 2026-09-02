# Lab 1: Apex Triggers and Bulkification

## What You Need to Be Able to Do

### Handler Class Pattern
- [ ] Create an Apex class named `AccountTriggerHandler` annotated with `public with sharing`
- [ ] Write a `handleBeforeInsert(List<Account> newAccounts)` static method that sets `Rating` based on `AnnualRevenue` thresholds:
  - `AnnualRevenue >= 10,000,000` → `'Hot'`
  - `AnnualRevenue >= 1,000,000` → `'Warm'`
  - `AnnualRevenue < 1,000,000` or null → `'Cold'`
- [ ] Write a `handleAfterInsert(List<Account> newAccounts)` static method that:
  - Builds a `List<Task>` inside a loop (one Task per Account)
  - Sets `WhatId = acct.Id`, `Subject = 'Follow Up'`, `ActivityDate = Date.today().addDays(7)`
  - Inserts the entire list in ONE DML call outside the loop

### Trigger
- [ ] Create an `AccountTrigger` trigger that fires on `Account` for `before insert` and `after insert`
- [ ] Keep the trigger thin — only context variable checks + handler method calls (no business logic in the trigger body)
- [ ] Use `Trigger.isBefore && Trigger.isInsert` to route to `handleBeforeInsert(Trigger.new)`
- [ ] Use `Trigger.isAfter && Trigger.isInsert` to route to `handleAfterInsert(Trigger.new)`

### Test Class
- [ ] Create `AccountTriggerHandlerTest` annotated `@isTest private class`
- [ ] Write a test for Hot rating (revenue > 10M): insert 1 Account, assert `Rating = 'Hot'` after re-query
- [ ] Write a test for Warm rating (revenue between 1M and 10M): insert 1 Account, assert `Rating = 'Warm'`
- [ ] Write a test for null revenue: insert Account with no `AnnualRevenue`, assert `Rating = 'Cold'`
- [ ] Write a test for Task creation: insert 1 Account, assert exactly 1 Task created with `Subject = 'Follow Up'`
- [ ] Write a **bulk test with 200 Accounts**: insert all 200 in one DML, assert 200 Tasks were created
- [ ] Wrap all inserts in `Test.startTest()` / `Test.stopTest()`
- [ ] Use `System.assertEquals(expected, actual, message)` — always include the message parameter

### Verification
- [ ] All 5 test methods pass with 100% coverage on `AccountTriggerHandler` and `AccountTrigger`
- [ ] Manually create an Account in the UI with `AnnualRevenue = 12,000,000` and confirm `Rating = Hot`
- [ ] Confirm a Follow Up Task appears in the Activity section with a due date 7 days from today

### Challenge: Before Update with Field Change Detection
- [ ] Add `before update` to the trigger
- [ ] Add `handleBeforeUpdate(List<Account> newAccounts, Map<Id,Account> oldMap)` to the handler
- [ ] Only recalculate `Rating` when `AnnualRevenue` actually changed: `if (acct.AnnualRevenue != oldMap.get(acct.Id).AnnualRevenue)`
- [ ] Write a test: insert Account with `AnnualRevenue = 500000` (Cold), update to `12,000,000`, assert `Rating = 'Hot'`

---

## Key Code Patterns to Remember

```apex
// BULKIFIED after insert — one DML, not one per record
public static void handleAfterInsert(List<Account> newAccounts) {
    List<Task> tasksToInsert = new List<Task>();
    for (Account acct : newAccounts) {
        tasksToInsert.add(new Task(
            Subject      = 'Follow Up',
            Status       = 'Not Started',
            WhatId       = acct.Id,
            ActivityDate = Date.today().addDays(7)
        ));
    }
    if (!tasksToInsert.isEmpty()) {
        insert tasksToInsert;  // ONE DML for all records
    }
}
```

```apex
// THIN trigger — routing only, no logic
trigger AccountTrigger on Account (before insert, after insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        AccountTriggerHandler.handleBeforeInsert(Trigger.new);
    }
    if (Trigger.isAfter && Trigger.isInsert) {
        AccountTriggerHandler.handleAfterInsert(Trigger.new);
    }
}
```

```apex
// BULK test pattern
List<Account> accounts = new List<Account>();
for (Integer i = 0; i < 200; i++) {
    accounts.add(new Account(Name = 'Bulk ' + i, AnnualRevenue = 15000000));
}
Test.startTest();
insert accounts;  // one DML — fires trigger once with 200 records
Test.stopTest();
List<Task> tasks = [SELECT Id FROM Task WHERE WhatId IN :accounts];
System.assertEquals(200, tasks.size(), '200 tasks expected');
```
