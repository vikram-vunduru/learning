# L12: Record-Triggered Flows

## Exam Domain
Business Logic & Process Automation — 28% of exam weight

---

## Core Concepts

### Before-Save vs. After-Save — The Critical Distinction
This is one of the highest-priority exam topics. **Before-Save flows** run before the record is written to the database. They are used for **field updates on the triggering record only** — no DML operations, no creating/updating/deleting other records. The advantage: field updates in Before-Save flows are applied directly to the triggering record without an extra DML save, making them faster and not counting against DML limits. **After-Save flows** run after the record is committed. They have full DML capabilities — can create, update, or delete other records, send emails, call actions.

### $Record and $Record__Prior Variables
In a Record-Triggered Flow, the triggering record is always available as `$Record` — this gives you the current (post-edit) values of all fields. `$Record__Prior` is available **only in After-Save flows** (not Before-Save) and contains the field values **before the edit was made**. Use `$Record__Prior` to detect what changed — e.g., if `$Record.Stage != $Record__Prior.Stage`, the Stage was just changed.

### Entry Conditions and Optimization
Entry conditions (the "Run When" / "Condition Requirements" setting in the flow) determine whether the flow body executes on a given save. Good entry conditions dramatically improve performance — without them, the flow runs on every save of every record of that object. Example: set entry condition to "StageName is changed" so the flow only runs when Stage changes, not on every Opportunity save.

### Infinite Loop Prevention
A Before-Save flow that updates a field on the triggering record does NOT re-trigger the flow — the update is applied as part of the same save, not as a new DML operation. An After-Save flow that updates a DIFFERENT record (via Update Records element) could trigger another After-Save flow on that target object if one exists. Salesforce has loop prevention: a record-triggered flow will not re-enter itself due to its own updates, but it can trigger flows on other objects.

### Scheduled Paths
Record-Triggered Flows can include **Scheduled Paths** (time-delayed execution). Example: send a follow-up email 7 days after an Opportunity is set to Closed Won. The main flow path executes at save time; the scheduled path executes at the scheduled time. Scheduled paths only run if the record still meets the entry conditions at the scheduled time.

---

## PTA / SA Relevance

**Before-Save is your performance win:** Every before-save flow update replaces what would have been a separate Apex after-trigger DML update. For orgs with many field-defaulting rules on insert/update, migrating from Apex after-triggers that do field updates to Before-Save Flows significantly reduces DML consumption per transaction.

**$Record__Prior for change detection:** A common architecture pattern is using `$Record__Prior` to detect state transitions — e.g., "Status just changed from Pending to Approved." This is cleaner and more reliable than checking the current state alone, which could be triggered on any save where Status happens to be Approved (including re-saves with no status change).

**Infinite loop risk at enterprise scale:** In large orgs with many RTFs across many objects, it's possible to create an accidental automation chain: RTF on Opportunity updates Account → RTF on Account updates Contact → RTF on Contact sends an email. These chains can be hard to debug. Architecture reviews should document all RTF chains and verify there are no unintended loops or cascading updates.

**Transaction limits:** All After-Save flows in the same transaction share the same governor limits. If 5 After-Save flows each run Get Records queries on the same Opportunity save, they collectively share the 100 SOQL query budget. This is why high-volume orgs need to audit their total automation footprint, not just individual flows.

---

## Architecture / How It Works

```
Before-Save vs. After-Save Comparison:
┌──────────────────────────┬───────────────────┬───────────────────────┐
│ Capability               │ Before-Save       │ After-Save            │
├──────────────────────────┼───────────────────┼───────────────────────┤
│ When does it run?        │ Before DB write   │ After DB commit       │
│ Can update trigger rec.? │ YES (direct, 0DML)│ YES (via Update Rec.) │
│ Can update other records?│ NO                │ YES                   │
│ Can create records?      │ NO                │ YES                   │
│ Can delete records?      │ NO                │ YES                   │
│ Can send emails?         │ NO                │ YES                   │
│ $Record__Prior available?│ NO                │ YES                   │
│ DML consumed?            │ 0 (for field upd.)│ Yes (counts against   │
│                          │                   │ governor limit)        │
│ Best for:                │ Fast field         │ Related record       │
│                          │ defaulting         │ updates, side effects│
└──────────────────────────┴───────────────────┴───────────────────────┘
```

**Limitations:**
- Before-Save flows cannot send emails, make HTTP callouts, or invoke most actions
- After-Save flows cannot use `$Record__Prior` to detect what changed BEFORE the save that already happened (use it to compare before vs after the triggering event)
- Scheduled paths are only available in After-Save flows (not Before-Save)

```
Full Order of Execution (Record Save):
┌─────────────────────────────────────────────────────────────────────┐
│  1. Record enters save processing                                   │
│  2. System validations (required fields, field types)               │
│  3. Apex before triggers                                            │
│  4. Validation Rules                                                │
│  5. Duplicate Rules                                                 │
│  6. ► Before-Save Record-Triggered Flows ◄                          │
│  7. Record written to database (committed)                          │
│  8. ► After-Save Record-Triggered Flows ◄                           │
│  9. Apex after triggers                                             │
│ 10. Assignment Rules (Leads/Cases)                                  │
│ 11. Auto-response Rules (Cases)                                     │
│ 12. Workflow Rules (legacy, still runs)                             │
│ 13. Escalation Rules (Cases)                                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- If a Validation Rule fires (step 4), execution stops — no Flows run
- Workflow Rules still run (step 12) even in fully-flow orgs — they run last
- If Apex before triggers or Before-Save Flows set contradictory values on the same field, the last one wins (Flows run after Apex before triggers)

```
Record-Triggered Flow Internals:
                                                                      
  TRIGGER OBJECT: Opportunity                                         
  TRIGGER EVENT:  Created or Updated                                  
  ENTRY CONDITION: StageName = "Closed Won"                           
                                                                      
  ┌─────────────────────────────────────────────────────────────┐     
  │  ON EVERY Opportunity save...                               │     
  │  Does $Record.StageName = "Closed Won"?                     │     
  │      │                                                      │     
  │      ├─ YES → Enter flow, execute elements                  │     
  │      └─ NO  → Skip flow entirely (no execution)            │     
  └─────────────────────────────────────────────────────────────┘     
                                                                      
  SCHEDULED PATH (in After-Save flows):                               
  ┌─────────────────────────────────────────────────────────────┐     
  │  After 7 days from CloseDate:                               │     
  │  Is record STILL Closed Won?                                │     
  │      ├─ YES → Execute scheduled path elements              │     
  │      └─ NO  → Scheduled path does NOT run (conditions no   │     
  │               longer met at scheduled time)                 │     
  └─────────────────────────────────────────────────────────────┘     
```

**Limitations:**
- Scheduled paths only run if the record still meets the original entry conditions at execution time
- Scheduled paths are deleted if the record that triggered them is deleted before the scheduled time
- A Before-Save flow cannot have scheduled paths

---

## Key Facts to Memorize
- Before-Save: runs before DB write; field updates on triggering record only; 0 DML; no $Record__Prior
- After-Save: runs after commit; full DML; can touch related records; $Record__Prior available
- `$Record` = current (post-edit) values; `$Record__Prior` = values before the edit (After-Save only)
- Entry conditions = when the flow body executes; without them, flow runs on every save of every record
- Scheduled Paths: time-delayed execution in After-Save flows; only fires if record still meets conditions
- Infinite loop: RTF won't re-trigger itself, but CAN trigger RTFs on other objects it updates
- All automation in a transaction shares governor limits (SOQL, DML budgets are shared)

---

## Exam Traps
- **Before-Save cannot touch related records.** Any scenario where the flow needs to create a related record, send an email, or update a record on another object must be After-Save.
- **$Record__Prior is After-Save only.** Before-Save flows can't use `$Record__Prior`. If a question asks how to detect "what the field was before this save" in a Before-Save flow, that's not possible — move to After-Save.
- **Before-Save field updates are DML-free.** This is a performance advantage that the exam tests — before-save updates don't consume DML operations because they happen before the initial write.
- **Scheduled path ≠ guaranteed execution.** If the record's conditions change before the scheduled time (e.g., Stage changes back from Closed Won), the scheduled path does NOT run.
- **Entry conditions improve performance.** A record-triggered flow without entry conditions runs on every save — this can cause performance issues in high-volume orgs. The exam tests knowing when and why to use entry conditions.

---

## Practice Questions

**Q:** A Record-Triggered Flow is configured on Opportunity (Before Save). It needs to set the "Approval_Date__c" field when the Opportunity's Status changes to "Approved." Can this be done in a Before-Save flow, and what variable provides the previous Status value?
**A:** This can be done in a Before-Save flow — setting a field on the triggering record is exactly what Before-Save flows are for. However, `$Record__Prior` is NOT available in Before-Save flows. To detect the previous Status, the flow can check if `$Record.Status = "Approved"` (and use entry conditions to run only when Status changes), but it cannot access the prior value. If comparing old vs. new values is required, the flow must be After-Save.

**Q:** An App Builder creates an After-Save Record-Triggered Flow on Contact that updates the related Account's "Last_Contact_Activity__c" date field. The flow uses an Update Records element to update the Account. Is this valid, and does it trigger Account flows?
**A:** Yes, this is valid — After-Save flows can update related records. The Update Records element will trigger Account Record-Triggered Flows if any are configured on the Account object that match the update. This is expected behavior, not an infinite loop (the Contact flow doesn't re-trigger itself).

**Q:** A Record-Triggered Flow has a Scheduled Path configured to send a "follow-up" email 30 days after Stage = "Closed Won." Three days after the Opportunity is set to Closed Won, the rep changes the Stage to "Closed Lost." What happens to the scheduled path?
**A:** The scheduled path does NOT execute. Scheduled paths check whether the record still meets the original entry conditions at the scheduled execution time. Since the Stage is no longer "Closed Won," the scheduled path is canceled (or evaluated as not meeting conditions and skipped).
