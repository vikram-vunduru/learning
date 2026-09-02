# Lab 02: Advanced Flows

## Lab Overview

**Objective:** Build two production-quality flows demonstrating Before Save optimization, Scheduled Paths, and fault tolerance patterns.

**Estimated time:** 90–120 minutes

**Prerequisites:**
- Developer org or sandbox
- Cases, Opportunities, Accounts objects accessible
- Basic Flow Builder familiarity

**What you'll build:**
1. **Flow A:** Before Save flow that sets a "Stage Changed Date" on Opportunities
2. **Flow B:** After Save flow with a Scheduled Path for case escalation — with fault path

---

## Lab A: Opportunity Stage Change Tracker (Before Save)

### Business Requirement
When an Opportunity's Stage changes, automatically record the date of the stage change in a custom field `Stage_Changed_Date__c`. This field should be set without any extra DML.

### Step A1: Create the Custom Field

1. Setup > Object Manager > Opportunity > Fields & Relationships > New
2. Type: Date
3. Field Label: **Stage Changed Date**
4. API Name: `Stage_Changed_Date__c`
5. Save and add to the Opportunity page layout

### Step A2: Create the Flow

1. Setup > Flows > New Flow
2. Select: **Record-Triggered Flow**
3. Object: Opportunity
4. Trigger: A record is created or updated
5. **Trigger timing: Before the record is saved** (critical — this is Before Save)
6. Entry conditions: Click "Add Condition"
   - Resource: `{!$Record.StageName}`
   - Operator: Is Changed (use ISCHANGED function)
   - For "Run when," select: "A record is created or updated" AND "StageName is changed"
   - Actually in Flow Builder entry conditions, set: Condition requirements = Custom formula is true
   - Formula: `ISCHANGED({!$Record.StageName})`
7. Click Done

**Alternatively:** Set the entry conditions in the "Entry Conditions" panel:
- Condition: `StageName` `Is Changed` (some orgs support this directly in the UI)

### Step A3: Add the Assignment Element

Since this is Before Save, you can directly modify the triggering record using the `$Record` variable — no DML needed.

1. In the flow canvas, add an **Assignment** element
2. Variable to modify: `{!$Record.Stage_Changed_Date__c}`
3. Operator: Equals
4. Value: `{!$Flow.CurrentDate}` (or use formula: `TODAY()`)
5. Save

### Step A4: Connect Entry to Assignment

Connect the Start element to the Assignment element.

### Step A5: Activate

1. Click Save
2. Name: **Opp Stage Changed Date Tracker**
3. Click Activate
4. Test: Update an Opportunity's Stage. Check that `Stage_Changed_Date__c` is set to today without needing a separate DML operation.

### Lab A Verification

- [ ] Custom field `Stage_Changed_Date__c` created on Opportunity
- [ ] Flow is Before Save type
- [ ] Flow only runs when StageName is changed
- [ ] Assignment uses `{!$Record.Stage_Changed_Date__c}` — no Update Records element needed
- [ ] Stage date populates immediately when Stage changes
- [ ] Changing other fields (not Stage) does NOT update the date field (entry condition working)

---

## Lab B: Case Escalation with Scheduled Path and Fault Path (After Save)

### Business Requirement
When a new Case is created with Priority = "High," and the case remains open after 2 hours, automatically:
1. Set Priority to "Critical" (if it's still High/Open)
2. Send an escalation notification email to the case owner's manager
3. Add a fault path to handle DML errors gracefully

### Step B1: Create the Email Alert (for escalation notification)

1. Setup > Email Alerts > New Email Alert
2. Object: Case
3. Email Template: Create a simple template first if needed
4. To: Case Owner's Manager
5. From: Default org-wide email
6. Save and note the name

*(Alternatively, use a "Send Email" action in the flow)*

### Step B2: Create the Flow

1. Setup > Flows > New Flow
2. Select: **Record-Triggered Flow**
3. Object: Case
4. Trigger: A record is created
5. Trigger timing: **After the record is saved** (After Save — we'll use Scheduled Path)
6. Entry Conditions:
   - Priority equals "High"
   - Status not equals "Closed"
7. Click Done

### Step B3: Add a Scheduled Path

In the Flow builder, you should see the "Start" block on the canvas. Below "Immediate Actions" area, there should be an option to "Add Scheduled Paths."

1. Click **"Add Scheduled Paths (Optional)"**
2. Click the new Scheduled Path and configure it:
   - Path Name: **2 Hour Escalation**
   - Time Source: `Case: Created Date`
   - Offset Number: **2**
   - Offset Options: **Hours After**
3. Configure Entry Condition (re-evaluation at scheduled time):
   - Priority equals "High" (if priority was already changed to Critical, skip)
   - Status not equals "Closed" (if case was resolved, skip)

### Step B4: Add Actions to the Scheduled Path

On the Scheduled Path (2 Hour Escalation):

**Action 1: Update Case Priority**
1. Add **Update Records** element
2. Update: `{!$Record}` (the triggering record)
3. Set field: Priority = "Critical"

**Action 2: Send Email Notification**
1. After the Update Records element, add a **Send Email** action (or Email Alert element)
2. Configure to send to Case Owner's Manager

### Step B5: Add Fault Path to the Update Records Element

1. On the **Update Records** element, look for the **Fault** connector option
2. Add a Fault Path
3. On the fault path, add a **Create Records** element to log the error:
   - Object: Task (or a custom error log object)
   - Subject: "Flow Error: Case Escalation Failed"
   - Description: `{!$Flow.FaultMessage}` (the error message from the failed element)
   - OwnerId: Case owner or a dedicated admin user
4. Connect the fault path

### Step B6: Save and Activate

1. Save the flow as **Case High Priority Escalation**
2. Click Activate

### Step B7: Test the Flow

**Immediate test:**
1. Create a new Case with Priority = "High"
2. Verify the flow ran (no immediate actions in this flow — the scheduled path is what matters)
3. Check Setup > Apex Jobs — look for the scheduled flow interview

**Simulating the scheduled path (tricky in developer orgs):**
- Option A: Change the scheduled path offset to 2 minutes and use a near-future time trigger for testing
- Option B: Use Debug mode in Flow Builder (but scheduled paths don't execute in debug mode)
- Option C: Query `FlowInterview` object in Developer Console to see pending interviews

**Test fault path:**
- Temporarily create a validation rule on Case that prevents the Priority update
- Create a High priority case
- Wait for the scheduled path to fire
- Verify: a Task was created (from the fault path) instead of crashing silently

### Lab B Verification

- [ ] Flow is After Save type
- [ ] Flow only triggers on CREATE of High priority cases
- [ ] Scheduled Path configured for 2 hours after Created Date
- [ ] Scheduled Path has re-entry condition: Priority = High AND Status != Closed
- [ ] Update Records element on Scheduled Path changes Priority to Critical
- [ ] Fault Path on Update Records creates a Task with `{!$Flow.FaultMessage}`
- [ ] Flow activated successfully
- [ ] Pending scheduled interview visible in Apex Jobs after creating a High priority case

---

## Lab C: Extension — Bulkification Test

### Objective
Deliberately create the anti-pattern (DML inside a loop) and observe the failure.

### Setup
1. Create a simple Flow: Get 200 Accounts, loop through them, create a Task for each Account INSIDE the loop
2. Create 200 test accounts
3. Trigger the flow

### Expected Result
The flow will fail after creating approximately 150 Tasks (hitting the DML limit).

### Fix
Move the Task creation outside the loop using a Task collection:
1. Inside loop: Add Task record to a collection variable using Assignment element
2. Outside loop: Single Create Records element using the collection
3. Re-run — all 200 Tasks created in one DML operation

---

## Summary: Key Patterns from These Labs

| Pattern | Lab | Key Learning |
|---|---|---|
| Before Save = no extra DML | Lab A | Modifying `{!$Record}` in Before Save requires no Update Records element |
| Scheduled Paths re-evaluate | Lab B | Entry conditions re-check at scheduled time; closed/changed cases skip the path |
| Fault Paths catch DML errors | Lab B | Without fault path, DML failure = silent crash. With fault path = graceful handling |
| DML outside loops | Lab C | Always build collection inside loop; single DML outside loop |

---

## PTA Notes

When reviewing customer flows in an architecture assessment:
1. Check Flow Trigger Explorer — how many flows per object?
2. Scan for DML inside loops — look for Create/Update Records elements that are children of Loop elements
3. Check fault paths — production flows without fault paths are technical debt
4. Check for active legacy automation (Process Builder, Workflow) that conflicts with new flows
