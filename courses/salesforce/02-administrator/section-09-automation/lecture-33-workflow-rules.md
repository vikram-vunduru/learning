# L33: Workflow Rules

## 🎯 Learning Objectives
- Explain what workflow rules are and their current status (legacy/retiring)
- Configure workflow rule trigger criteria (created only, edited, created and every time edited)
- Create and configure all four workflow actions (field update, email alert, task, outbound message)
- Set up time-dependent workflow actions using time triggers
- Understand workflow rule re-evaluation after field updates

## 📊 SLIDES

### Slide 1: Workflow Rules — Overview and Status
**Visual:**
```
  Salesforce Automation Timeline

  2003                  2015                    2021–present
   │                     │                           │
   ▼                     ▼                           ▼
  ┌────────────┐    ┌─────────────────┐    ┌──────────────────────┐
  │  Workflow  │    │ Process Builder │    │        Flow          │
  │   Rules    │    │                 │    │  (Current Standard)  │
  │  [LEGACY]  │    │   [LEGACY]      │    │                      │
  └────────────┘    └─────────────────┘    └──────────────────────┘
        │                   │                         ▲
        └───────────────────┴── Migrate to Flow ──────┘

  Workflow Rules: still on CRT-101 exam — learn for exam, use Flow for new builds
```
**Content:**
- **Workflow Rules** are Salesforce's original point-and-click automation tool
- They automate actions when record criteria are met
- **Current status:** Workflow rules are LEGACY and being retired by Salesforce
  - Salesforce has announced retirement; no new workflow rules in new orgs after Feb 2023
  - Existing rules continue to function in orgs that already have them
- **CRITICAL FOR EXAM:** Workflow rules are STILL on the CRT-101 exam (2024-2025)
- Salesforce recommends migrating to **Flow** (the current recommended tool)
- Study workflow rules for exam purposes; use Flow for any new automation
**Speaker Notes:** Workflow rules are officially legacy, but Salesforce has kept them in the exam blueprint because they're still running in thousands of customer orgs. Admins need to understand them for maintenance and troubleshooting even if they're not building new ones. On your exam, you will see workflow rule questions. Learn the concepts thoroughly, and know that Flow is the recommended replacement for all new automation.

### Slide 2: Workflow Rule Trigger Criteria
**Visual:**
```
  When should the rule evaluate?

  ┌─────────────────────────────────────────────────────────────────────┐
  │ ◉ created                                                           │
  │   → Fires ONCE, only when record is first created                  │
  │   → Use for: assign owner on creation, set default values          │
  ├─────────────────────────────────────────────────────────────────────┤
  │ ◉ created, and any time it's edited to subsequently meet criteria   │
  │   → Fires on creation AND when record transitions from             │
  │     NOT meeting → meeting criteria                                  │
  │   → Use for: alert when Stage changes TO Closed Won                │
  │   → Does NOT re-fire if record already met criteria                │
  ├─────────────────────────────────────────────────────────────────────┤
  │ ◉ created, and every time it's edited                               │
  │   → Fires on every single save as long as criteria are met         │
  │   → Use for: timestamp updates, running totals                     │
  │   ⚠ Cannot use time-dependent actions with this option             │
  └─────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Evaluate the rule when a record is:**
  - **Created:** Only fires once, when the record is first created (never on edits)
  - **Created, and any time it's edited to subsequently meet criteria:** Fires on creation AND on any subsequent edit where the record newly meets the criteria (changes from not meeting to meeting)
  - **Created, and every time it's edited:** Fires every single time the record is saved, as long as the rule criteria are still met
- **Choosing the right trigger:**
  - Assign account owner on creation only → "Created"
  - Send alert when Stage changes to Closed Won → "Created, and any time it's edited to subsequently meet criteria"
  - Update a timestamp every time record saves → "Created, and every time it's edited"
**Speaker Notes:** The trigger criteria is one of the most-tested aspects of workflow rules. "Created and any time edited to SUBSEQUENTLY meet criteria" is subtle — the rule only fires when the record transitions from NOT meeting the criteria TO meeting them. It won't re-fire if the record already met criteria and is saved again with no change. "Created and every time it's edited" fires unconditionally on every save (as long as criteria are met), which can cause unexpected behavior and trigger loops if field updates are involved.

### Slide 3: Workflow Rule Criteria
**Visual:**
```
  Rule Criteria Options

  ┌──────────────────────────────────┬──────────────────────────────────┐
  │   CRITERIA ARE MET               │   FORMULA EVALUATES TO TRUE      │
  │   (Filter conditions)            │   (Full formula editor)          │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │  Field        Operator  Value    │  AND(                            │
  │  Stage        equals    Closed   │    ISPICKVAL(Stage,"Closed Won"),│
  │               Won               │    ISCHANGED(Stage),             │
  │  Amount       >         10000   │    Amount > 10000                │
  │                                  │  )                               │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │  Use for: simple field           │  Use for: ISCHANGED, date math,  │
  │  comparisons (AND logic only)    │  cross-object, complex logic     │
  └──────────────────────────────────┴──────────────────────────────────┘
```
**Content:**
- **Rule criteria determines when the rule fires:**
  - **Criteria are met:** Filter conditions (like list view filters) — field equals/contains/starts with value
  - **Formula evaluates to true:** Full formula editor — same power as validation rule formulas
- **When to use criteria filters:** Simple conditions (Stage = "Closed Won")
- **When to use formula:** Complex conditions involving multiple fields, ISCHANGED, ISNEW, date math
- **No-criteria option:** Select "criteria are met" and leave fields blank (or use formula TRUE) — fires on every matching trigger event
- Criteria are evaluated AFTER the record values are saved (unlike before-save flows)
**Speaker Notes:** The choice between criteria filters and formulas gives you flexibility. Criteria filters are quick to set up for simple conditions. Formula evaluation unlocks the full power of Salesforce's formula language, including ISCHANGED and cross-object references. One important note: ISCHANGED() works in workflow rule criteria formulas — unlike some other contexts. This lets you detect field-level changes to trigger actions.

### Slide 4: Workflow Actions — Field Update
**Visual:**
```
  Field Update Configuration

  ┌──────────────────────────────────────────────────────────────┐
  │  Object to Update:   [Opportunity               ▼]          │
  │  Field to Update:    [Stage                     ▼]          │
  │                                                              │
  │  New Field Value:                                            │
  │    ◉ A specific value:     [Closed Won          ▼]          │
  │    ○ Use a formula:        [formula editor]                  │
  │    ○ Blank the field                                         │
  │    ○ Use the record's existing value                         │
  │                                                              │
  │  ☐ Re-evaluate Workflow Rules after Field Change             │
  │    ⚠ Uncheck unless needed — risk of loops                  │
  └──────────────────────────────────────────────────────────────┘

  Can update: the triggering record  OR  a parent (lookup) object field
```
**Content:**
- **Field Update:** Changes the value of a field on the record (or a related record)
- Configuration:
  - Select the **object** (usually the workflow rule's object, or a parent object via lookup)
  - Select the **field** to update
  - Specify the **new value**: specific value, formula result, blank the field, or picklist option
- Can update the record that triggered the rule OR a field on a related (parent) record via lookup
- **Re-evaluation trigger:** After a field update, Salesforce can re-evaluate workflow rules (potential for loops — set carefully)
- **Immediate vs. Time-Dependent:** Can be immediate or delayed via time triggers
**Speaker Notes:** Field updates are the most commonly used workflow action. They can update the triggering record OR traverse a lookup to update a parent record field. For example, a workflow on Opportunity can update the related Account's "Last Opportunity Date" field. The "re-evaluate workflow rules" checkbox on field updates is important — if checked, saving the field update re-triggers all workflow rules, which can cause unintended loops or cascading updates.

### Slide 5: Workflow Actions — Email Alert, Task, Outbound Message
**Visual:**
```
  ┌───────────────────────┬───────────────────────┬───────────────────────┐
  │    EMAIL ALERT        │        TASK           │   OUTBOUND MESSAGE    │
  ├───────────────────────┼───────────────────────┼───────────────────────┤
  │  ✉ Uses email         │  ☑ Creates a Task     │  ⇄ Sends SOAP XML     │
  │    template           │    record             │    to external URL    │
  │                       │                       │                       │
  │  Recipients:          │  Assign to:           │  Endpoint URL:        │
  │  • Record owner       │  • Specific user      │  external system      │
  │  • Role members       │  • Role members       │  must have SOAP       │
  │  • Email field        │  • Record owner       │  listener             │
  │  • Specific address   │                       │                       │
  │                       │  Set: Subject,        │  Older integration    │
  │  Can send to          │  Due Date (relative), │  pattern — modern     │
  │  multiple recipients  │  Priority, Status     │  orgs use REST or     │
  │                       │                       │  Platform Events      │
  └───────────────────────┴───────────────────────┴───────────────────────┘
  All three can be: Immediate (fires on save)  OR  Time-Dependent (delayed)
```
**Content:**
- **Email Alert:**
  - Uses a pre-built **email template** (text, HTML, or custom HTML)
  - Recipients: record owner, role, email field on record, specific address
  - Can send to multiple recipients at once
- **Task Creation:**
  - Creates a new Task record assigned to a user, role, or record owner
  - Set Subject, Due Date (relative, e.g., "3 days from now"), Priority, Status
- **Outbound Message:**
  - Sends a **SOAP XML message** to an external web service endpoint
  - Used for real-time integration with external systems
  - Requires the external system to have a SOAP listener endpoint
  - Older integration pattern — modern integrations typically use Platform Events or Apex
**Speaker Notes:** Email alerts are extremely common in workflow automation — notify a manager when a deal closes, remind a service rep when a case is overdue. Tasks are useful for creating follow-up actions. Outbound messages are the oldest integration mechanism — they send a SOAP message to an external URL when conditions are met. While modern integrations have moved to REST and Platform Events, outbound messages still appear on older orgs and on the exam. All three can be either immediate actions or time-dependent (delayed).

### Slide 6: Time-Dependent Workflow Actions
**Visual:**
```
  Record saves and rule criteria are met  (Day 0)
            │
            ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  Time-Based Workflow Queue                                      │
  │                                                                 │
  │  -7 days before Close Date ──▶ Email: "Deal closing soon"      │
  │  -3 days before Close Date ──▶ Task: "Follow up with client"   │
  │   0 days (on Close Date)   ──▶ Email: "Close Date arrived"     │
  │  +2 days after Close Date  ──▶ Task: "Post-close review"       │
  └─────────────────────────────────────────────────────────────────┘
            │
            ▼
  ⚠ If record no longer meets criteria before time fires:
     → Pending actions are automatically REMOVED from queue
```
**Content:**
- **Time triggers** delay workflow actions by a relative time offset
- Time trigger options:
  - **X days/hours BEFORE a date field** (e.g., 7 days before Close Date)
  - **X days/hours AFTER a date field** (e.g., 3 days after Created Date)
  - **X days/hours AFTER the rule is triggered**
- **Workflow Queue:** Time-dependent actions are queued in the "Time-Based Workflow" queue
  - Admin can view and delete pending actions in Setup
- **Cancellation:** If the record no longer meets the rule criteria before the time trigger fires, pending actions are automatically removed from the queue
- **Limitation:** Cannot use time triggers with "created, and every time it's edited" evaluation criteria
**Speaker Notes:** Time-dependent actions are great for follow-up reminders and escalations. A classic example: if an Opportunity has been in "Proposal" stage for 7 days without moving forward, automatically create a task for the owner to follow up. The time-based workflow queue is viewable in Setup → Time-Based Workflow, where admins can see and cancel pending actions. The automatic cancellation when criteria are no longer met is a safety feature — if the opportunity closes before the 7-day follow-up task fires, the task is cancelled.

### Slide 7: Workflow Rule Re-evaluation After Field Updates
**Visual:**
```
  Record Save
       │
       ▼
  Workflow Rule A evaluates → criteria MET
       │
       ▼
  Field Update action runs (e.g., sets Status = "Active")
       │
       ▼
  "Re-evaluate Workflow Rules after Field Change" checked?
       │
       ├── YES ──▶ All workflow rules re-evaluate with new values
       │               │
       │               ├── Rule B criteria now met → fires
       │               │
       │               └── Rule A criteria still met? ──▶ ⚠ LOOP RISK
       │
       └── NO  ──▶ Process ends (recommended default)
```
**Content:**
- When a **Field Update** action includes "Re-evaluate Workflow Rules after Field Change": checked
- Salesforce runs all workflow rules again with the updated field values
- **Risk:** Can create **infinite loops** if Rule A updates Field X, which causes Rule A to fire again
- **Safeguard:** Salesforce detects obvious loops and stops after a finite number of re-evaluations
- **Best practice:** Leave "Re-evaluate" unchecked unless specifically needed for rule chaining
- **Rule chaining:** Sometimes intentional — Rule A sets Status = "Active," Rule B checks Status = "Active" and sends an email
- Avoid circular re-evaluations at all costs
**Speaker Notes:** Re-evaluation is a double-edged feature. It enables sophisticated automation chains where one rule's field update triggers the next rule's criteria. But it's easy to accidentally create loops. Salesforce caps re-evaluations to prevent true infinite loops, but you can still cause many unintended actions. Always map out your workflow logic before enabling re-evaluation, and test thoroughly in a sandbox.

### Slide 8: Workflow Rules vs. Flow — Migration Considerations
**Visual:**
```
  ┌─────────────────────┬─────────────────────┬──────────────────────────┐
  │ Feature             │ Workflow Rules       │ Record-Triggered Flow    │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Status              │ Legacy (retiring)    │ Current standard         │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Trigger types       │ Created / Edited     │ Created / Updated /      │
  │                     │                      │ Deleted                  │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Action types        │ 4 fixed types        │ Unlimited                │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Before-save         │ No                   │ Yes (optimized)          │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Cross-object        │ Parent only          │ Any related object       │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Time-based          │ Time Triggers        │ Scheduled Paths          │
  ├─────────────────────┼─────────────────────┼──────────────────────────┤
  │ Loop prevention     │ Limited              │ Better control           │
  └─────────────────────┴─────────────────────┴──────────────────────────┘
  Exam strategy: know workflow rules for recognition; know Flow for new builds
```
**Content:**
| Feature | Workflow Rules | Record-Triggered Flow |
|---------|---------------|----------------------|
| Status | Legacy (retiring) | Current standard |
| Trigger types | Created / Edited | Created / Updated / Deleted |
| Actions | 4 types (limited) | Unlimited (all Salesforce actions) |
| Before-save | No | Yes (optimized) |
| Cross-object | Parent only | Any related object |
| Loop prevention | Limited | Better control |
| Time-based | Yes (Time Triggers) | Scheduled Paths |
- Salesforce provides migration tools in Setup to convert workflow rules to flows
- **Exam strategy:** Know workflow rules for recognition; know Flow for new builds
**Speaker Notes:** For the exam, you need to know workflow rules well enough to answer scenario questions. In practice, for any new automation, build a Record-Triggered Flow instead. Salesforce has provided a migration tool in Setup called the "Workflow Rule Migration Tool" that can convert basic workflow rules to flows automatically. Always test migrated flows in a sandbox before deploying to production.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 33 — Workflow Rules. I need to say this upfront: workflow rules are legacy technology that Salesforce is retiring. They've recommended migrating to Flow for all new automation since 2021. However — and this is critical — workflow rules ARE still on the CRT-101 exam. So you need to know them well enough to answer exam questions, even though you shouldn't be building new ones.

Workflow rules are point-and-click automation that fires when record criteria are met. You define: when to evaluate (created, edited, or both), what criteria to check, and what actions to take.

The trigger criteria has three options. "Created only" fires once when the record is first saved as new — perfect for creation-time actions. "Created, and any time it's edited to subsequently meet criteria" fires on creation AND on any subsequent edit where the record crosses over from NOT meeting the criteria TO meeting them. "Created, and every time it's edited" fires on every single save as long as criteria are met.

Workflow rules have four action types. Field Update changes a field value on the record or a related parent record. Email Alert sends a notification using an email template to recipients you specify. Task Creation creates a new Task and assigns it to a user or role. Outbound Message sends a SOAP XML payload to an external web service endpoint — this is the oldest integration mechanism.

All four action types can be immediate (fire right when the record saves) or time-dependent. Time-dependent actions are scheduled to fire at an offset from a date field — for example, 7 days before Close Date, or 3 days after Created Date. Pending time-dependent actions are stored in the Time-Based Workflow queue. If the record no longer meets the criteria before the time trigger fires, the pending action is automatically cancelled.

One important nuance: field update actions have a checkbox to "Re-evaluate Workflow Rules after Field Change." If checked, Salesforce runs all workflow rules again with the new field values. This enables rule chaining but can cause loops if not carefully designed.

For the exam: know all four action types, the three evaluation trigger options, how time triggers work, and what re-evaluation after field update means. In real life: use Flow for everything new.

## 🔔 EXAM TIPS
- **Legacy but Tested:** Workflow rules are still on the CRT-101 exam despite being deprecated. Know them for the exam.
- **Four Action Types:** Field Update, Email Alert, Task, Outbound Message. These are fixed — workflow rules cannot do anything else.
- **Time Triggers:** Can only be used with "Created" or "Created, and any time it's edited to subsequently meet criteria" evaluation settings — NOT with "Created, and every time it's edited."
- **Re-evaluation:** "Re-evaluate Workflow Rules after Field Change" on a Field Update can trigger other rules; watch for infinite loops.
- **Cancellation:** Time-dependent actions are automatically removed from the queue if the record no longer meets criteria before the time fires.
- **Email Alert uses Templates:** You must have a pre-built email template — workflow email alerts cannot have inline custom text.
- **Cross-Object Field Updates:** Workflow can update a field on a parent (lookup) object but NOT on a child object.

## ✅ LECTURE SUMMARY
- Workflow rules are legacy automation (being retired) but still appear on the CRT-101 exam
- Three trigger options: Created only, Created and subsequently meets criteria, Created and every time edited
- Four action types: Field Update, Email Alert, Task, Outbound Message
- Time-dependent actions are queued and fired at a date offset; automatically cancelled if criteria no longer met
- Field Update actions can re-trigger workflow rule evaluation (risk of loops)
- Field updates can apply to the triggering record or a parent (lookup) object
- Salesforce recommends migrating all workflow rules to Record-Triggered Flows

## ❓ MINI QUIZ

**Q1:** A workflow rule is configured to fire "Created, and every time it's edited." A field update action is associated with this rule, with "Re-evaluate Workflow Rules after Field Change" checked. What is the primary risk of this configuration?
- A) The workflow will never fire because the two settings are incompatible
- B) The workflow could create an infinite loop by continuously re-triggering itself
- C) Time-dependent actions cannot be used with this trigger setting
- D) Email alerts will be sent multiple times per save

**Answer:** B — When a workflow fires on "every time it's edited" and its field update triggers re-evaluation, the updated field value may cause the same workflow rule criteria to remain met, causing the rule to fire again, which updates the field again, potentially creating a loop. Salesforce has safeguards but this is a known risk.

**Q2:** A workflow rule should send an email to the Opportunity owner 5 days before the Close Date if the Opportunity is still in "Negotiation" stage. Which action type and timing configuration achieves this?
- A) Immediate Email Alert action, criteria checks for 5 days before Close Date
- B) Time-Dependent Email Alert action with trigger "5 days before Close Date"
- C) Immediate Task action with due date set to 5 days before Close Date
- D) Time-Dependent Field Update, 5 days before Close Date, updating a notification field

**Answer:** B — Time-dependent actions are exactly for this use case. Configure a time trigger of "-5 days relative to Close Date" and attach an Email Alert action. The action will fire 5 days before Close Date, as long as the record still meets the workflow criteria (Stage = Negotiation).

**Q3:** Which of the following is NOT one of the four workflow rule action types?
- A) Field Update
- B) Email Alert
- C) Approval Request
- D) Outbound Message

**Answer:** C — The four workflow rule action types are Field Update, Email Alert, Task, and Outbound Message. Approval Requests (submitting records for approval) are not a workflow action type — approval processes are a separate automation tool.
