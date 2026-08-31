# Lecture 09: Trigger Best Practices

## Learning Objectives
- Apply the bulkification principle by writing triggers that correctly process up to 200 records per execution
- Implement the handler class pattern to separate trigger logic from trigger declaration
- Prevent recursive trigger execution using a static Boolean flag pattern
- Explain the Salesforce order of execution and identify how workflow field updates re-fire triggers

## Slides

### Slide 1: Why Trigger Best Practices Matter
**Visual:** Split screen: left side shows a poorly written trigger with SOQL in loop, small data volumes working fine in testing; right side shows production with 200 records being saved, the governor limit counter spiking to 200 SOQL queries and throwing a LimitException. Red alert icon on production side.
**Content:**
- Triggers fire for every DML operation — including data loads of thousands of records
- Salesforce fires a trigger once per 200 records maximum (Data Loader, API batch = up to 200/batch)
- A trigger that works in development with 1 record often **fails in production with 200 records**
- Best practices are not optional polish — they are required for production-ready code
- PDI exam tests whether you can identify and fix anti-patterns
- Key best practices:
  1. Bulkification (handle 200 records)
  2. Handler class pattern
  3. No SOQL/DML in loops
  4. Recursive trigger prevention
  5. Field-change detection
**Speaker Notes:** The trigger best practices are not abstract principles — they are direct responses to how the Salesforce platform works. Triggers fire in batches of up to 200 records. Governor limits are per-transaction, not per-record. A trigger that queries once per record will fail at record 101. If you understand WHY the best practices exist, you will never forget them.

### Slide 2: Bulkification — Handle All 200 Records
**Visual:** Comparison diagram with two code sections labeled "Not Bulkified" (SOQL inside for loop, fails at 101 records) and "Bulkified" (Set collection, single SOQL, Map lookup) with governor limit counters showing 200 vs 1 SOQL queries respectively.
**Content:**
- Salesforce delivers up to **200 records** per trigger execution batch
- **Never query or DML inside a loop** — collect first, operate once
- Bulkified pattern:
```apex
trigger ContactTrigger on Contact (before insert, before update) {
    // Step 1: Collect parent IDs
    Set<Id> accountIds = new Set<Id>();
    for (Contact c : Trigger.new) {
        if (c.AccountId != null) accountIds.add(c.AccountId);
    }
    // Step 2: One SOQL query for all needed data
    Map<Id, Account> accountMap = new Map<Id, Account>(
        [SELECT Id, Name, Industry FROM Account WHERE Id IN :accountIds]
    );
    // Step 3: Process records using Map lookup
    for (Contact c : Trigger.new) {
        Account acc = accountMap.get(c.AccountId);
        if (acc != null) c.Account_Industry__c = acc.Industry;
    }
}
```
**Speaker Notes:** The three-step bulkification pattern is the most important coding pattern in Salesforce development. Step 1 collects all the IDs you will need. Step 2 runs one SOQL query using the Set of IDs. Step 3 loops through the records and looks up data from the Map — no additional queries. This uses exactly 1 SOQL query regardless of whether there are 1 or 200 records in the trigger batch.

### Slide 3: Handler Class Pattern
**Visual:** Architecture diagram showing a thin AccountTrigger.trigger file on the left connected by an arrow to an AccountTriggerHandler.cls class on the right with separate methods: onBeforeInsert(), onBeforeUpdate(), onAfterInsert(), onAfterUpdate(). A separate AccountTriggerHandlerTest.cls connects to the handler class for testing.
**Content:**
- **Problem with logic in triggers:** Not unit-testable without firing DML, no organization, hard to maintain
- **Handler class pattern:** Trigger is thin — just calls handler methods
- Trigger:
```apex
trigger AccountTrigger on Account (before insert, before update, after insert) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    if (Trigger.isBefore && Trigger.isInsert)  handler.onBeforeInsert(Trigger.new);
    if (Trigger.isBefore && Trigger.isUpdate)  handler.onBeforeUpdate(Trigger.new, Trigger.oldMap);
    if (Trigger.isAfter  && Trigger.isInsert)  handler.onAfterInsert(Trigger.new);
}
```
- Handler class: pure Apex, fully testable, no trigger context required
- Test class calls handler methods directly with crafted lists
**Speaker Notes:** The handler class pattern decouples your business logic from the Salesforce trigger mechanism. This makes the code much more testable — you can instantiate the handler class in a test method and call its methods directly with a List of constructed records, without needing to insert records through DML (which fires triggers and validation rules). It also makes the trigger file easy to read: it just shows which methods are called for which events.

### Slide 4: Recursive Trigger Prevention
**Visual:** Diagram showing an infinite loop: Contact saved → ContactTrigger fires → triggers update on related Account → AccountTrigger fires → triggers update on Contact → ContactTrigger fires again → loop. Then an arrow showing the static Boolean flag breaking the loop at the second ContactTrigger invocation.
**Content:**
- **Recursive trigger:** A trigger that, as a side effect, fires the same trigger again
- Causes: trigger updates a record, workflow field update fires trigger again, or trigger update fires trigger
- Prevention: **static Boolean flag** in a utility class
```apex
public class TriggerHelper {
    public static Boolean isFirstRun = true;
}

trigger ContactTrigger on Contact (after update) {
    if (TriggerHelper.isFirstRun) {
        TriggerHelper.isFirstRun = false;
        ContactTriggerHandler.onAfterUpdate(Trigger.new, Trigger.oldMap);
    }
}
```
- Static variable persists for the **entire transaction** — second invocation sees `isFirstRun = false`
- Prevents infinite loop and stack overflow (`Maximum stack depth has been reached`)
**Speaker Notes:** The static Boolean flag works because static variables maintain their value for the entire Apex transaction. When the trigger fires the first time, it sets the flag to false and runs the handler. When the trigger fires a second time in the same transaction (due to a workflow field update, for example), the flag is already false, so the handler does not run again. This is a simple but reliable pattern for most recursion scenarios.

### Slide 5: Common Trigger Anti-Patterns
**Visual:** Code block with three highlighted anti-patterns: (1) SOQL inside for loop with red X, (2) DML inside for loop with red X, (3) hardcoded ID in trigger logic with red X. Each has a brief explanation of why it is a problem.
**Content:**
- **SOQL in loop:** Explodes query count; fails at 101 records
```apex
// BAD — runs one query per record
for (Contact c : Trigger.new) {
    Account a = [SELECT Name FROM Account WHERE Id = :c.AccountId]; // WRONG
}
```
- **DML in loop:** Exhausts 150-DML limit
```apex
// BAD — one DML per record
for (Task t : tasksToCreate) {
    insert t; // WRONG — should collect and insert in bulk
}
```
- **Hardcoded IDs:** Breaks when org is refreshed (Id values change between orgs)
- **Using Trigger.new directly for DML in before trigger:** Causes recursion
- **Logic in trigger body (not handler class):** Untestable, unmaintainable
**Speaker Notes:** These anti-patterns are what the exam asks you to identify and fix. The SOQL-in-loop and DML-in-loop patterns are by far the most common real-world bugs. Hardcoded IDs — like hardcoding a RecordTypeId — are a deployment problem because IDs are environment-specific and will be different in every org. Always query for IDs dynamically using a developer name or a custom label.

### Slide 6: Salesforce Order of Execution — Deep Dive
**Visual:** Detailed numbered flowchart of the Salesforce Order of Execution with 16 numbered steps, highlighting the positions of: before triggers (step 4), validation rules (step 5), after triggers (step 9), workflow rules (step 11), and process builder/flows (step 13). Arrows show that workflow field updates loop back to step 4.
**Content:**
- Simplified order of execution for a record save:
  1. System validation (required fields, field format)
  2. **Before triggers**
  3. Custom validation rules
  4. Duplicate rules
  5. Database save (record committed, Id assigned)
  6. **After triggers**
  7. Assignment rules
  8. Auto-response rules
  9. Workflow rules (field updates re-fire at step 2)
  10. Escalation rules
  11. Process Builder / Flows (after triggers first)
  12. Roll-up summary recalculations
  13. Criteria-based sharing
- Workflow **field updates re-fire** before and after triggers (once only)
**Speaker Notes:** The critical insight from the order of execution is that workflow field updates cause a second round of trigger execution. When a workflow rule fires and updates a field, Salesforce re-runs before and after triggers with the updated field values — but only once, not infinitely. This is distinct from recursive triggers caused by Apex code, but it can still cause problems if your trigger logic is not idempotent. This is another reason the static Boolean recursion flag is important.

### Slide 7: Testing Triggers
**Visual:** Split screen showing a test class with a @TestSetup method inserting test data, and a test method verifying trigger behavior by querying records after DML and asserting expected field values. Annotations call out the absence of any direct trigger call — the trigger fires automatically when DML executes.
**Content:**
- Triggers fire automatically when test DML executes — no special invocation needed
- Test methods must use `@isTest` annotation; test class uses `@isTest` at class level
- **@TestSetup:** Runs once per test class; all data shared across test methods (read-only after setup)
- Use `Test.startTest()` and `Test.stopTest()` to reset governor limits and run async code
- Assert the expected outcome by querying after the DML:
```apex
@isTest
static void testPhoneFormatting() {
    Account acc = new Account(Name = 'Test', Phone = '(415) 555-1234');
    insert acc;
    acc = [SELECT Phone FROM Account WHERE Id = :acc.Id];
    System.assertEquals('4155551234', acc.Phone, 'Phone should be formatted');
}
```
- Minimum **75% code coverage** required to deploy Apex to production
**Speaker Notes:** Trigger tests are structurally identical to any other Apex test: create test data, perform DML, query the results, and assert the expected state. The trigger fires automatically when you call `insert acc` in the test. Always query the record back from the database after DML to get the trigger-modified values — the in-memory object will not reflect changes made by the trigger in after-trigger processing.

### Slide 8: Trigger Best Practices Checklist
**Visual:** A visual checklist card with 8 items, each with an icon: bulkification check, handler class check, no SOQL in loop check, no DML in loop check, recursion prevention check, field change detection check, proper test coverage check, and order of execution awareness check. Formatted as a "code review" card.
**Content:**
- ✓ **Bulkify:** Loop over `Trigger.new`; never query or DML inside the loop
- ✓ **Handler class:** Thin trigger delegates to handler; logic lives in handler class
- ✓ **No SOQL in loops:** Collect IDs → one query → Map → lookup in loop
- ✓ **No DML in loops:** Collect records → one bulk DML after loop
- ✓ **Recursion prevention:** Static Boolean flag in utility class
- ✓ **Field change detection:** Compare `Trigger.new` and `Trigger.oldMap` values
- ✓ **Test coverage:** ≥ 75%; test bulk scenario with 200 records; test all event types
- ✓ **Order of execution awareness:** Workflows and flows fire after triggers; may re-invoke
**Speaker Notes:** Use this checklist as your code review guide. Before you declare a trigger "done," run through each item. The most common trigger bugs in real-world codebases are SOQL/DML in loops and missing recursion prevention. On the exam, these are the most common scenarios presented in answer choices — know how to spot them and how to fix them.

## Recording Script
Welcome to Lecture 9 — Trigger Best Practices. This is the lecture that takes everything you have learned about triggers, governor limits, and collections, and brings it together into production-quality code.

Let's start with the most fundamental principle: bulkification. Salesforce delivers records to your trigger in batches of up to 200. The trigger fires once for the entire batch, not once per record. So if a developer imports 1,000 records using the Data Loader, your trigger fires 5 times — once per 200-record batch — and each invocation receives up to 200 records in Trigger.new.

This means any code that issues a SOQL query or DML statement per record will fail. With 200 records and one SOQL per record, that is 200 SOQL queries — and the limit is 100. The fix is the three-step bulkification pattern. Step one: loop over Trigger.new and collect the IDs you will need into a Set. Step two: one SOQL query using the Set as a bind variable in a WHERE IN clause. Step three: put the results in a Map, then loop over Trigger.new again and use the Map for constant-time lookups. Three steps, one SOQL query, works for any number of records up to the governor limits.

Next: the handler class pattern. Your trigger file should be thin — it does nothing except check which event is firing and call the appropriate method on a handler class. The handler class is regular Apex, fully testable without needing to fire DML events. In your test class, you can instantiate the handler directly and call its methods with a crafted List. This is much cleaner than having to insert records and then query to see if the trigger worked.

Recursive triggers are one of the most confusing bugs a Salesforce developer encounters. When your after trigger updates a record, it fires DML — which can fire the trigger again. A workflow rule that runs a field update after your trigger also re-fires your trigger. Without prevention, you get an infinite loop until Salesforce hits the maximum stack depth and throws a fatal error.

The fix is a static Boolean flag. In a separate utility class, declare a public static Boolean — `isFirstRun = true`. At the beginning of your trigger, check the flag. If it is true, set it to false and run your logic. If it is false, do nothing. Since static variables persist for the entire transaction, the second invocation sees the flag already set to false and skips the logic. Simple, reliable, and the standard industry pattern.

Field change detection goes hand in hand with performance. Do not run expensive logic on every save — only run it when the relevant field actually changed. Compare `Trigger.new`'s value to `Trigger.oldMap`'s value. If they are the same, skip the logic. If they differ, run it.

Finally, always test your triggers with bulk data — 200 records. A trigger that works with 1 record in testing and fails with 200 records in production is not tested, it is a time bomb. Use Test.startTest() and Test.stopTest() to get fresh governor limit counts, and always assert the results by querying after DML.

These practices are your professional standard. Master them and the exam questions about trigger anti-patterns become easy. They are also the right thing to do for every production org you build on.

## Exam Tips
- A trigger that works with 1 record but fails with 200 records is **not bulkified** — the most common trigger anti-pattern the exam tests.
- The static Boolean recursion flag must be declared in a **separate class** (not inside the trigger file itself) and must be `static` — instance variables would not prevent recursion.
- Workflow field updates cause **one additional round** of trigger execution (before + after) — this is not the same as infinite recursion; it fires at most once more.
- Minimum Apex code coverage for deployment to production is **75% across all Apex** — not per individual class; individual classes can be below 75% as long as the org average is met (though best practice is 100% per class).
- `Trigger.old` and `Trigger.oldMap` are only available in **update and delete** events. Testing for field changes in an insert trigger will cause a NullPointerException when accessing Trigger.old.

## Lecture Summary
Trigger best practices exist because triggers fire in batches of up to 200 records and governor limits apply per transaction. The bulkification pattern — collect IDs into a Set, query once with IN, use a Map for lookups — reduces any number of per-record queries to a single SOQL statement. The handler class pattern separates testable logic from trigger machinery, while a static Boolean flag in a utility class prevents recursive execution caused by trigger-initiated DML or workflow field updates. The Salesforce order of execution — before triggers, validation rules, after triggers, workflows, flows — governs all automation, with workflow field updates able to re-invoke triggers once.

## Mini Quiz

**Q1:** A trigger on the Opportunity object queries related Account data inside the for loop over `Trigger.new`. During a data migration, 500 records are imported at once. What happens?
A) The trigger runs once for all 500 records and performs 500 SOQL queries, which succeeds
B) The trigger runs in batches of 200; after 100 records in the first batch the SOQL limit is hit and a LimitException is thrown
C) The data loader automatically breaks the import into smaller batches to avoid governor limits
D) Triggers do not fire during data loader imports
**Answer:** B — Data Loader sends records in batches of 200 per API call, so the trigger fires with up to 200 records at a time. SOQL inside the loop issues one query per record. After 100 records in a 200-record batch, the 100-SOQL limit is hit and a LimitException is thrown, rolling back the entire batch.

**Q2:** After a Contact after-update trigger fires, a workflow rule on Contact triggers a field update. Which of the following correctly describes what happens next?
A) The trigger does not fire again — workflow updates bypass triggers
B) The before and after triggers fire one additional time with the workflow-updated field values
C) The trigger fires recursively until the maximum stack depth is reached
D) The after trigger fires one additional time but the before trigger does not
**Answer:** B — Workflow field updates cause one additional round of before and after trigger execution with the updated values. This is by design and only fires once — it does not cause infinite recursion by itself. However, if the trigger also performs DML that fires the workflow again, a recursive loop can develop, which is why the static Boolean flag is used.

**Q3:** A developer is implementing the handler class pattern. Where should the recursive trigger prevention Boolean flag be declared?
A) As an instance variable in the trigger handler class
B) As a static variable in the trigger file itself
C) As a static variable in a separate utility/helper class
D) As a custom setting record that is queried at the start of each trigger execution
**Answer:** C — The flag must be `static` to persist across trigger invocations within the same transaction, and it should be in a separate utility class (not in the trigger file, which cannot have class-level declarations). An instance variable would not work because a new handler class instance is created each time the trigger fires.
