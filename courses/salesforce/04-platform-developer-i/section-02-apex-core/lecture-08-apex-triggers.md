# Lecture 08: Apex Triggers

## Learning Objectives
- Write syntactically correct Apex triggers using the proper trigger declaration syntax
- Distinguish between before and after triggers and select the appropriate type for each use case
- Use all trigger context variables: Trigger.new, Trigger.old, Trigger.newMap, Trigger.oldMap, and the Boolean context variables
- Apply the one-trigger-per-object pattern and understand trigger execution order

## Slides

### Slide 1: What Is an Apex Trigger?
**Visual:**
```
  User Action (UI / API / Apex / Data Loader)
           │
           ▼
  ┌─────────────────────┐
  │  BEFORE TRIGGER     │  ← in-memory; modify Trigger.new directly
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Validation Rules   │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  DATABASE WRITE     │  ← record committed; Id assigned
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  AFTER TRIGGER      │  ← read-only; use DML for related records
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Workflow / Flow    │
  └──────────┬──────────┘
             │
             ▼
       Response to User
```
**Content:**
- An Apex trigger is code that **automatically executes** before or after a DML event on a Salesforce object
- Trigger events: insert, update, delete, merge, upsert (upsert fires insert/update events)
- Undelete fires its own event: `after undelete`
- Triggers execute for **every DML operation** — via UI, API, Apex code, data loader, flows
- Triggers enable **custom logic** that cannot be expressed declaratively: complex validations, cross-object updates, integrations
- Every trigger has access to the records being processed via **context variables**
**Speaker Notes:** Triggers are the primary extension point for custom logic in Salesforce. Any time a record is saved, deleted, or restored, triggers execute automatically. This is why governor limits are so important with triggers — a user saving 200 records at once fires your trigger once with all 200 records, not 200 separate times. Understanding this is the key to understanding why bulkification is critical.

### Slide 2: Trigger Syntax
**Visual:** Annotated trigger code block with callout arrows on each syntax element: `trigger` keyword, trigger name, `on` keyword, object name in parentheses with the event list, and the trigger body with context variable access.
**Content:**
- Basic syntax:
```apex
trigger TriggerName on ObjectName (event1, event2) {
    // trigger body
}
```
- Full event list available:
```apex
trigger AccountTrigger on Account (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    // handle all events here
}
```
- Trigger name convention: `ObjectNameTrigger` (e.g., `AccountTrigger`, `ContactTrigger`)
- Saved in Setup → Apex Triggers or in VS Code under `force-app/main/default/triggers/`
- File produces: `AccountTrigger.trigger` and `AccountTrigger.trigger-meta.xml`
**Speaker Notes:** The trigger declaration tells Salesforce exactly when to fire this code. You list the events in a comma-separated list inside parentheses after the object name. You can handle multiple events in one trigger — and with the one-trigger-per-object pattern, you should handle all events in a single trigger and then delegate to a handler class. The trigger body is just regular Apex code.

### Slide 3: Before Triggers
**Visual:**
```
  ┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
  │  Record in      │     │  BEFORE TRIGGER       │     │  Database       │
  │  Memory         │────►│  fires                │────►│  Write          │
  │  (Trigger.new)  │     │                       │     │                 │
  │  NOT yet saved  │     │  Modify Trigger.new   │     │  Record saved   │
  │                 │     │  directly → NO DML    │     │  with changes   │
  └─────────────────┘     │  needed               │     └─────────────────┘
                          └──────────────────────┘
  Trigger.new in before = in-memory only, no Id yet (on insert)
  Changes save automatically as part of the original DML
```
**Content:**
- **Before triggers** execute before the record is written to the database
- The records in `Trigger.new` are **in-memory only** — NOT yet saved
- You can **modify field values directly** on `Trigger.new` records without DML
  ```apex
  trigger AccountTrigger on Account (before insert) {
      for (Account acc : Trigger.new) {
          if (acc.Phone != null) {
              acc.Phone = acc.Phone.replaceAll('[^0-9]', '');
          }
      }
  }
  ```
- Modifications to `Trigger.new` are saved automatically when the platform commits the record
- **Do not call DML on `Trigger.new`** in a before trigger — the record is not yet committed
- Use case: set default values, format fields, validate data (though validation rules are preferred)
**Speaker Notes:** Before triggers are efficient for field manipulation because you modify the record directly in memory and no extra DML statement is needed. The platform saves your changes as part of the original DML operation. If you accidentally call `update acc` inside a before trigger on an Account, you will trigger the trigger again and create a recursive loop — then hit the maximum stack depth limit.

### Slide 4: After Triggers
**Visual:**
```
  ┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
  │  Record         │     │  AFTER TRIGGER        │     │  Related        │
  │  committed to   │────►│  fires                │────►│  Records        │
  │  Database       │     │                       │     │  written via    │
  │  (Id assigned)  │     │  Trigger.new = read   │     │  DML            │
  │                 │     │  only; has Id now     │     │                 │
  └─────────────────┘     │  Use DML for related  │     └─────────────────┘
                          └──────────────────────┘
  Use after triggers to: create child records, update related objects,
  send callouts (via @future), anything needing the new record's Id
```
**Content:**
- **After triggers** execute after the record has been committed to the database
- The records in `Trigger.new` are **read-only** — they have been saved and cannot be modified directly
- The record's `Id` field is populated (important for new records inserted)
- Use case: update **related records** (different objects), create child records, send callouts (via async)
  ```apex
  trigger ContactTrigger on Contact (after insert) {
      // Contacts were just inserted; their Ids are now available
      AccountUpdater.updateAccountCount(Trigger.new);
  }
  ```
- Must use DML to modify related records (different sObject type)
- Calling DML on `Trigger.new` records in after triggers causes **recursive trigger firing**
**Speaker Notes:** The key rule: use before triggers to modify the record being saved (no DML needed, just direct field assignment); use after triggers to update other records or create related records (DML required). In after insert triggers, the new records have Ids — you need those Ids to create child records or set up relationships. In before insert, the Id field is null because the record has not been saved yet.

### Slide 5: Trigger Context Variables
**Visual:**
```
  TRIGGER CONTEXT VARIABLES
  ┌─────────────────┬──────────────────────────────┬──────────────────────────────────┐
  │ Variable        │ Available In                  │ Description                      │
  ├─────────────────┼──────────────────────────────┼──────────────────────────────────┤
  │ Trigger.new     │ insert, update, undelete       │ List<sObj> of new versions       │
  │ Trigger.old     │ update, delete                 │ List<sObj> of old versions       │
  │ Trigger.newMap  │ after insert, update           │ Map<Id,sObj> of new versions     │
  │ Trigger.oldMap  │ update, delete                 │ Map<Id,sObj> of old versions     │
  │ Trigger.isInsert│ all insert events              │ true if current event is insert  │
  │ Trigger.isUpdate│ all update events              │ true if current event is update  │
  │ Trigger.isDelete│ all delete events              │ true if current event is delete  │
  │ Trigger.isBefore│ all before events              │ true if before context           │
  │ Trigger.isAfter │ all after events               │ true if after context            │
  │ Trigger.size    │ all events                     │ Number of records in batch       │
  └─────────────────┴──────────────────────────────┴──────────────────────────────────┘
```
**Content:**
- **Trigger.new:** `List<sObject>` of new record versions; available in insert, update, undelete
- **Trigger.old:** `List<sObject>` of old record versions; available in update, delete
- **Trigger.newMap:** `Map<Id, sObject>` of new versions; available in update, after insert
- **Trigger.oldMap:** `Map<Id, sObject>` of old versions; available in update, delete
- **Boolean flags:**
  - `Trigger.isInsert`, `Trigger.isUpdate`, `Trigger.isDelete`, `Trigger.isUndelete`
  - `Trigger.isBefore`, `Trigger.isAfter`
- **Trigger.size:** Number of records in the current batch (max 200)
**Speaker Notes:** The Maps are particularly useful because you often need to look up a specific record by its ID. In an update trigger, `Trigger.oldMap.get(someId)` gives you the old version of a specific record, and `Trigger.newMap.get(someId)` gives you the new version. This lets you detect which field changed by comparing old and new values. Always use the Maps for random access by Id rather than looping through the lists searching for a record.

### Slide 6: Detecting Field Changes in Update Triggers
**Visual:** Code snippet showing a before update trigger that accesses both Trigger.newMap and Trigger.oldMap to compare field values, with an annotation showing the pattern `if (newRecord.FieldName != oldRecord.FieldName)`.
**Content:**
- Only run expensive logic (SOQL, DML) when the relevant field actually changed
- Access old value: `Trigger.oldMap.get(record.Id).FieldName__c`
- Compare old and new values to determine if a field changed:
```apex
trigger OpportunityTrigger on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);
        if (opp.StageName != oldOpp.StageName) {
            // Stage changed — run stage-change logic
            opp.Stage_Changed_Date__c = Date.today();
        }
    }
}
```
- This pattern prevents unnecessary processing when unrelated fields are saved
- Critical for performance with frequently updated objects
**Speaker Notes:** The field-changed check pattern is essential for trigger performance. Without it, your trigger runs its full logic every time a record is saved — even if only the Description was changed and your logic only cares about the Stage. On high-volume objects like Cases or Opportunities, this can make the difference between a trigger that performs well and one that hits CPU time limits. Only do the expensive work when the relevant fields actually changed.

### Slide 7: One Trigger Per Object Pattern
**Visual:**
```
  ANTI-PATTERN (avoid)              BEST PRACTICE
  ┌──────────────────────┐          ┌────────────────────────────────┐
  │  AccountTrigger1     │          │        AccountTrigger          │
  │  AccountTrigger2     │ ← order  │   (one trigger, all events)    │
  │  AccountTrigger3     │ unknown  └────────────────┬───────────────┘
  └──────────────────────┘                           │ delegates to
                                                     ▼
                                  ┌────────────────────────────────┐
                                  │    AccountTriggerHandler       │
                                  │  onBeforeInsert(Trigger.new)   │
                                  │  onBeforeUpdate(new, oldMap)   │
                                  │  onAfterInsert(Trigger.new)    │
                                  │  onAfterUpdate(new, oldMap)    │
                                  │  onAfterDelete(Trigger.old)    │
                                  └────────────────────────────────┘
```
**Content:**
- **Anti-pattern:** Multiple triggers on the same object — execution order is unpredictable
- **Best practice:** One trigger per object that delegates to a handler class
```apex
trigger AccountTrigger on Account (before insert, before update,
    after insert, after update, after delete) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    if (Trigger.isBefore) {
        if (Trigger.isInsert) handler.onBeforeInsert(Trigger.new);
        if (Trigger.isUpdate) handler.onBeforeUpdate(Trigger.new, Trigger.oldMap);
    }
    if (Trigger.isAfter) {
        if (Trigger.isInsert) handler.onAfterInsert(Trigger.new);
        if (Trigger.isUpdate) handler.onAfterUpdate(Trigger.new, Trigger.oldMap);
    }
}
```
- Handler class: testable, reusable, organized by event
**Speaker Notes:** Multiple triggers on the same object in the same event context fire in an indeterminate order — Salesforce does not guarantee which one runs first. This creates fragile code that can break when triggers interact. The one-trigger-per-object pattern solves this: one thin trigger calls a handler class, and the handler class contains all the actual logic organized by event. The handler class can be unit tested directly without firing DML events.

### Slide 8: Order of Execution
**Visual:**
```
  DML Statement (insert/update/delete)
           │
           ▼
  ┌─────────────────────────────────────────────┐
  │           TRIGGER EXECUTION ORDER           │
  ├─────────────────────────────────────────────┤
  │  1. System Validation Rules                 │
  │  2. Before Triggers                         │
  │  3. Custom Validation Rules                 │
  │  4. Duplicate Rules                         │
  │  5. After Triggers                          │
  │  6. Assignment Rules                        │
  │  7. Auto-Response Rules                     │
  │  8. Workflow Rules                          │
  │  9. Processes (Flow Builder)                │
  │ 10. Escalation Rules                        │
  │ 11. Post-commit logic (emails, async)       │
  └─────────────────────────────────────────────┘
```
**Content:**
- Before triggers fire **before validation rules** for insert
- Validation rules run **after** before triggers
- After triggers fire after database commit
- After triggers come **before** workflow rules, process builder, and flows
- Full order (simplified):
  1. Before triggers
  2. System & custom validation rules
  3. Database save
  4. After triggers
  5. Workflow field updates (which can re-fire triggers)
  6. Process Builder / Flows
  7. Commit
**Speaker Notes:** The order of execution is a frequently tested exam topic. The key points: before triggers run before validation rules, which means if your trigger creates invalid data, the validation rule will still catch it. Workflow field updates that fire after the trigger can actually re-trigger the before and after triggers — this is a common cause of recursive trigger execution. That is why the static Boolean flag for recursion prevention is so important, which we cover in Lecture 9.

## Recording Script
Welcome to Lecture 8 — Apex Triggers. Triggers are one of the most powerful and most tested topics in the entire PDI exam. By the end of this lecture, you will understand exactly when triggers fire, which context variables are available, and how to write triggers that handle data correctly.

Let's start with the big picture. An Apex trigger is code that Salesforce automatically runs when records are created, modified, or deleted. You declare a trigger on a specific object and list the events you want to respond to. Triggers execute regardless of how the DML happened — whether a user saved a record through the UI, an API call from an external system, a data loader import, or another Apex class. If DML touches that object, your trigger runs.

The syntax is: `trigger TriggerName on ObjectName (event list)`. The event list includes before insert, before update, before delete, after insert, after update, after delete, and after undelete. You can handle all of these in one trigger or just the ones you need.

Now the most important concept: before versus after. Before triggers fire before the record is written to the database. The records in `Trigger.new` are in memory — they have not been saved yet. This means you can modify field values directly on `Trigger.new` records and those changes will be saved automatically as part of the original DML. No extra DML statement needed. Use before triggers to format fields, set defaults, or enforce custom validation.

After triggers fire after the record has been committed. The records are read-only at this point, but the big advantage is that new records now have their Ids. You must use DML to update related records in an after trigger. Use after triggers when you need to create or update related records on other objects.

The context variables are your connection to the data being processed. `Trigger.new` is the List of records being saved. `Trigger.old` is the List of their previous values (available in update and delete). `Trigger.newMap` and `Trigger.oldMap` are the same data as Maps keyed by record Id — use these for random access by Id and for detecting field changes.

The Boolean flags — `Trigger.isInsert`, `Trigger.isUpdate`, `Trigger.isBefore`, `Trigger.isAfter` — let you write one trigger that handles multiple events correctly. Check these flags to route your logic appropriately.

The one-trigger-per-object pattern is best practice and is frequently tested. Multiple triggers on the same object fire in unpredictable order. Instead, write one trigger that delegates to a handler class. The handler class organizes logic by event, is fully testable, and ensures execution order is always clear.

Finally, the order of execution. Before triggers fire first, then validation rules, then the database save, then after triggers, then workflow rules and flows. Workflow field updates can re-fire triggers, which is the primary cause of recursive trigger execution — more on that in the next lecture.

## Exam Tips
- `Trigger.new` is **read-only in after triggers** — you cannot directly modify `Trigger.new` fields after the record has been committed. Use DML to update related records.
- In **before insert** triggers, `Trigger.new` records have **no Id** yet (not saved) — `Trigger.oldMap` and `Trigger.old` are also not available.
- `Trigger.old` and `Trigger.oldMap` are available only in **update** and **delete** events — not in insert or undelete.
- `Trigger.newMap` is available in **after insert** (because Ids now exist) and in **update** events, but NOT in before insert.
- The Salesforce order of execution places **before triggers before validation rules** — a before trigger can set field values that are then checked by validation rules.

## Lecture Summary
Apex triggers execute automatically on DML events with before triggers modifying records in-memory before database write and after triggers acting on committed records with populated Ids. The six context variables — Trigger.new, Trigger.old, Trigger.newMap, Trigger.oldMap, and the Boolean context flags — provide full access to old and new record states. The one-trigger-per-object pattern with a handler class ensures predictable execution order and clean, testable code, while the Salesforce order of execution — before triggers, then validation rules, then after triggers, then workflow/flows — governs when each automation layer runs.

## Mini Quiz

**Q1:** A developer wants to automatically format a phone number field on Account records (remove non-numeric characters) whenever accounts are created or updated. Which trigger event and approach is correct?
A) After insert, after update — query the records and use DML to update them
B) Before insert, before update — modify `Trigger.new` records directly without DML
C) Before insert, before update — use DML to update `Trigger.new` records
D) After insert, after update — modify `Trigger.new` records directly
**Answer:** B — Before triggers allow direct modification of `Trigger.new` records without DML. The changes are saved as part of the original DML operation. After triggers cannot directly modify `Trigger.new` records (they are read-only), and using DML on `Trigger.new` in a before trigger would cause recursion.

**Q2:** A trigger is executing on an after insert event for Contact records. Which of the following context variables is NOT available?
A) Trigger.new
B) Trigger.newMap
C) Trigger.old
D) Trigger.isInsert
**Answer:** C — `Trigger.old` (and `Trigger.oldMap`) are only available in update and delete events — there is no "old version" of a record during an insert because the record did not exist before. `Trigger.new`, `Trigger.newMap`, and all Boolean flags are available in after insert.

**Q3:** A Salesforce org has two triggers on the Account object for the before update event: `AccountTrigger1` and `AccountTrigger2`. What can the developer rely on regarding execution order?
A) They execute in alphabetical order by trigger name
B) They execute in the order they were created (oldest first)
C) The execution order is indeterminate — Salesforce does not guarantee which fires first
D) They execute in parallel
**Answer:** C — When multiple triggers exist on the same object for the same event, Salesforce does not guarantee execution order. This is why the one-trigger-per-object pattern is a best practice — it eliminates this ambiguity entirely.
