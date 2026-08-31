# L12: Record-Triggered Flows

## 🎯 Learning Objectives
- Explain the difference between before-save and after-save record-triggered flows and when to use each
- Describe the complete order of execution for record saves including where flows fit relative to Apex triggers, validation rules, and legacy automation
- Implement common use cases such as auto-populating fields, creating child records, and preventing infinite loops

## 📊 SLIDES

### Slide 1: Record-Triggered Flow Overview
**Visual:** Diagram of a record being saved with two branching arrows: one labeled "Before Save" pointing left (fast path, no DML) and one labeled "After Save" pointing right (full access, can DML other records)
**Content:**
- A Record-Triggered Flow fires automatically when a Salesforce record is **created**, **updated**, **created or updated**, or **deleted**
- No user interaction required — fires as part of the record save transaction
- Configured in the Start element: choose the object, trigger event, and entry conditions
- Two execution timing options: **Before Save** (runs before the record is written to the database) and **After Save** (runs after the record is committed)
- The choice between before-save and after-save is the most important architectural decision when building record-triggered flows
**Speaker Notes:** The before-save vs. after-save distinction is one of the most tested topics on the Platform App Builder exam. Understand not just the definitions, but the practical implications — what operations are allowed and forbidden in each timing mode.

---

### Slide 2: Before-Save Flows
**Visual:** Execution timeline graphic showing: Record Save Initiated → Validation Rules → Apex Before Triggers → [BEFORE-SAVE FLOW highlighted in yellow] → Record Written to Database
**Content:**
- Runs **before** the record is committed to the database
- **Can:** Read field values of the triggering record, update fields on the triggering record directly (using Assignment element)
- **Cannot:** Query other Salesforce records (no Get Records), create/update/delete other records (no DML), call Apex actions, send email alerts
- Field updates to the triggering record do **not** consume DML governor limits — they are applied as part of the save operation
- Use case: Auto-populating or defaulting field values at record creation or update
- Accessed via `$Record` — the current record's field values (after the triggering event)
**Speaker Notes:** Before-save flows are significantly faster and more governor-limit-friendly than after-save flows for field updates. The key restriction to know is that you cannot query or modify other records — you are strictly limited to the triggering record itself.

---

### Slide 3: After-Save Flows
**Visual:** Execution timeline graphic showing: Record Written to Database → Apex After Triggers → [AFTER-SAVE FLOW highlighted in blue] → Workflow Rules (legacy) → Process Builder (legacy)
**Content:**
- Runs **after** the record is committed to the database
- **Can:** Query other records (Get Records), create/update/delete other records (Create/Update/Delete Records elements), call Apex actions, send email alerts, call subflows
- **Cannot:** Update the triggering record's fields directly via Assignment (must use Update Records element, which costs a DML operation)
- Has access to both **$Record** (current values) and **$Record__Prior** (values before the save)
- Use cases: Create related child records, send notifications, update records on related objects
- Runs in a **new transaction** context — governor limits reset from the before-trigger transaction
**Speaker Notes:** After-save flows can do everything before-save flows cannot — but they cost more in terms of governor limits. The $Record__Prior variable is only available in after-save flows and lets you compare old vs. new values, which is useful for conditional logic like "send a notification only when Status changes to Closed."

---

### Slide 4: $Record and $Record__Prior
**Visual:** Two-column comparison table: $Record (left column) vs $Record__Prior (right column); rows for "Availability," "What it contains," and "Common use case"
**Content:**
- **$Record:** Available in both before-save and after-save flows; contains the **current** field values of the triggering record (including any changes made in the current transaction)
- **$Record__Prior:** Available **only in after-save flows**; contains the field values of the record **before** the current save operation
- Using $Record__Prior: detect field value changes by comparing $Record.FieldName to $Record__Prior.FieldName inside a Decision element
- Example: `{!$Record.Status} = "Closed" AND {!$Record__Prior.Status} != "Closed"` — detects the moment Status transitions to Closed
- Equivalent to using ISCHANGED() and PRIORVALUE() in formula fields or validation rules
**Speaker Notes:** $Record__Prior is a commonly tested variable. Remember it is only available after-save and it holds the pre-save state of the triggering record. This is how you detect specific field transitions in flows, similar to how you use ISCHANGED and PRIORVALUE in formula contexts.

---

### Slide 5: Entry Conditions and Trigger Options
**Visual:** Start element configuration mockup showing Object = Opportunity, Trigger = "A record is updated," Entry Conditions = "Run only when conditions are met," condition rows showing StageName equals "Closed Won"
**Content:**
- **Trigger Events:** Created; Updated; Created or Updated; Deleted
- **Entry Conditions (Run When):**
  - *Run always* — flow fires for every record that matches the trigger event, regardless of field values
  - *Only when conditions are met* — flow fires only when specified field conditions are true at trigger time; reduces unnecessary executions
- Entry conditions evaluated at the Start element before any other flow element runs
- **Optimize For:** Two modes in the Start element — "Actions and Related Records" (after-save full capabilities) and "Fast Field Updates" (before-save, field updates only, faster performance)
- Use "Only when conditions are met" whenever possible to limit flow executions and avoid infinite loops
**Speaker Notes:** The "Optimize For" setting in the Start element is how you choose between before-save and after-save. "Fast Field Updates" = before-save; "Actions and Related Records" = after-save. This terminology appears in the exam and can be confusing if you haven't seen the actual UI.

---

### Slide 6: Complete Order of Execution
**Visual:** Numbered vertical flowchart with 8 steps, each step in a separate box with an arrow pointing down; steps 3 and 5 are highlighted (before-save and after-save flows)
**Content:**
1. System validation (required fields, field formats)
2. **Validation Rules** (all fire independently)
3. Apex Before Triggers
4. **Before-Save Flows** (Record-Triggered, optimized for Fast Field Updates)
5. Record is written to the database (committed)
6. Apex After Triggers
7. **After-Save Flows** (Record-Triggered, optimized for Actions and Related Records)
8. Workflow Rules (legacy — being retired)
9. Process Builder (legacy — being retired)
**Speaker Notes:** This order of execution is the single most important diagram for the Platform App Builder exam on the automation topic. Memorize the sequence: Validation Rules → Apex Before → Before-Save Flow → Commit → Apex After → After-Save Flow → Legacy tools. The exam regularly presents scenarios asking "which fires first" or "why is a field not updated when the flow reads it."

---

### Slide 7: Infinite Loop Prevention
**Visual:** Two diagrams side by side: (A) a circular arrow labeled "Infinite Loop" between a flow updating a record and the same flow re-triggering on the update; (B) a Decision element checking a condition before executing the update, breaking the loop
**Content:**
- **The risk:** An after-save flow updates Record B → Record B's update triggers another flow → that flow updates Record A → Record A's update re-triggers the original flow → infinite loop
- **Self-triggering risk:** A flow that updates the triggering record in an after-save context (using Update Records) can re-trigger itself
- **Prevention strategy 1:** Use entry conditions ("Only when conditions are met") to ensure the flow only fires when a relevant field has a specific value or has changed
- **Prevention strategy 2:** Use a checkbox or text field as a "processed" flag — set it in the flow and check it in entry conditions
- **Prevention strategy 3:** Use before-save flows for field updates (no DML, no re-trigger risk)
- Salesforce has a built-in recursion guard: a record-triggered flow can only fire once per record per transaction by default (as of recent releases)
**Speaker Notes:** Infinite loops are a real risk in complex automation environments. The best defense is precise entry conditions. If a flow should fire "only when Status changes to Closed," use $Record.Status = "Closed" AND $Record__Prior.Status != "Closed" as your entry condition so the flow does not re-fire after it runs.

---

### Slide 8: Common Use Cases and Best Practices
**Visual:** Three-column table: Use Case | Before-Save or After-Save | Key Elements Used
**Content:**
- **Auto-populate a field on creation** → Before-Save; Assignment element sets field value; zero DML governor impact
- **Default a field based on another field's value** → Before-Save; Decision + Assignment; fires before the user's record is saved
- **Create a related Task when an Opportunity reaches Closed Won** → After-Save; Get Records (optional) + Create Records; fires after Opportunity is committed
- **Send an email alert when a Case is escalated** → After-Save; Decision (check $Record__Prior.Status) + Action (email alert)
- **Update a parent record when a child record is updated** → After-Save; Get Records (parent) + Update Records (parent)
- **Best Practices:** Prefer before-save for simple field updates; use entry conditions to narrow trigger scope; always add fault paths; test thoroughly in sandbox with Debug mode before activating
**Speaker Notes:** For the exam, map each use case to before-save or after-save with confidence. The rule of thumb is simple: if you only need to set fields on the triggering record, use before-save. If you need to touch any other record, call an action, or send a notification, use after-save.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 12 on Record-Triggered Flows. This is arguably the most exam-dense lecture in the entire automation section. The before-save vs. after-save distinction, the order of execution, and infinite loop prevention are all topics that the Platform App Builder exam tests directly and repeatedly. Let's make sure you own them.

A Record-Triggered Flow fires when a record is created, updated, created or updated, or deleted. You configure this in the Start element. The most important configuration decision you make in the Start element — besides the object and trigger event — is the "Optimize For" setting. "Fast Field Updates" means before-save. "Actions and Related Records" means after-save. Those terms are what you'll see in the actual UI, so learn them.

Let's break down before-save. A before-save flow runs before the record is written to the database. In this context, you can read and update fields on the triggering record using Assignment elements. Those field updates are free — they don't cost a DML operation because the record hasn't been saved yet. You're just modifying the in-memory record before it gets committed. What you absolutely cannot do in a before-save flow: query other records, create or update other records, call Apex, or send emails. You are isolated to the triggering record only. But for that use case — auto-populating fields, setting defaults, deriving calculated values before save — before-save is faster and cheaper than any alternative.

After-save flows run after the record is committed. Now you have full power: you can query related records, create child records, update parent records, call Apex actions, and send notifications. You also get access to $Record__Prior, which contains the record's field values from before the save. This is how you detect specific transitions — like "Status just changed from Open to Closed" — by comparing $Record.Status to $Record__Prior.Status inside a Decision element. That pattern replaces what ISCHANGED and PRIORVALUE do in formulas.

The order of execution is critical. Here is the sequence for a record save: first, system validation runs — required fields, formats. Then, validation rules fire. Then, Apex before-triggers run. Then, before-save flows run. Then, the record is committed to the database. After the commit: Apex after-triggers run. Then, after-save flows run. Then, legacy Workflow Rules and Process Builder fire — but those are on their way out.

For the exam, the key ordering facts are: validation rules fire before any triggers or flows, before-save flows fire after Apex before-triggers but before the commit, and after-save flows fire after the commit and after Apex after-triggers. If an exam question asks why a flow can't see an Apex trigger's field update, the answer is usually ordering — check whether the Apex trigger is a before-trigger or after-trigger and where the flow sits relative to it.

Now, infinite loops. After-save flows can trigger themselves if they update a record that re-triggers the flow. The primary defense is precise entry conditions. If your flow should only fire when a specific field changes to a specific value, express that as your entry condition. Using $Record.Status = "Closed Won" AND $Record__Prior.Status != "Closed Won" ensures the flow fires exactly once — the moment Status transitions to Closed Won — and not on every subsequent update to the Opportunity.

Let me give you a quick use-case map for the exam. Auto-populate fields on creation? Before-save. Set a field based on another field's value? Before-save. Create a child record when a parent reaches a specific stage? After-save. Send an email when a case is escalated? After-save. Update a parent account's field when an opportunity closes? After-save. These mappings are exam-ready.

In the next section, we move beyond automation into app configuration topics. But the automation knowledge from Lectures 10, 11, and 12 will account for a significant portion of your exam score, so review these thoroughly before test day. Good luck.

---

## 🔔 EXAM TIPS
- **Before-save = Fast Field Updates:** The UI label "Optimize for Fast Field Updates" in the Start element means before-save execution timing.
- **After-save = Actions and Related Records:** "Optimize for Actions and Related Records" means after-save timing with full DML capabilities.
- **$Record__Prior is after-save only:** This variable does not exist in before-save flows; it contains the pre-save field values and is used to detect transitions.
- **Order of execution sequence:** Validation Rules → Apex Before Triggers → Before-Save Flows → Commit → Apex After Triggers → After-Save Flows → Workflow/Process Builder (legacy).
- **Before-save field updates are DML-free:** Updating the triggering record's fields in a before-save flow does not count as a DML operation.
- **Before-save flows cannot query or DML other records:** Only the triggering record can be read or modified in a before-save flow.
- **Entry conditions prevent infinite loops:** Always use "Only when conditions are met" and reference $Record__Prior to detect specific transitions rather than running on every update.
- **After-save needs Update Records to modify the triggering record:** In after-save, you cannot use an Assignment element to update the triggering record — you must use an Update Records element, which costs DML.

---

## ✅ LECTURE SUMMARY
- Record-Triggered Flows fire on record Created, Updated, Created or Updated, or Deleted events; configured in the Start element
- Before-save flows ("Fast Field Updates") run before the record is committed; can only update the triggering record's fields via Assignment; no DML governor cost for those updates; no access to other records
- After-save flows ("Actions and Related Records") run after the record is committed; can query and modify other records, call Apex, and send emails; has access to $Record__Prior
- $Record holds current values (both timing modes); $Record__Prior holds pre-save values (after-save only) — used to detect field transitions
- Order of execution: Validation Rules → Apex Before Triggers → Before-Save Flows → Commit → Apex After Triggers → After-Save Flows → Legacy tools
- Prevent infinite loops with precise entry conditions, especially by comparing $Record to $Record__Prior for transition detection

---

## ❓ MINI QUIZ

**Q1:** A before-save record-triggered flow uses an Assignment element to populate a Description field on the triggering Opportunity. How does this affect governor limits?
- A) It consumes one DML operation from the transaction's DML limit
- B) It consumes one SOQL query from the transaction's query limit
- C) It does not consume any DML operations because the record has not yet been committed
- D) It consumes one DML operation but is exempt from limits because it is a flow

**Answer:** C — Before-save field updates are applied to the in-memory record before it is committed to the database. No DML statement is issued, so no DML governor limit is consumed. This is one of the primary performance advantages of before-save flows over after-save flows for field update use cases.

---

**Q2:** An after-save record-triggered flow on the Case object should send an email only when the Status field changes from "New" to "Escalated." Which entry condition correctly implements this transition check?
- A) `{!$Record.Status} = "Escalated"`
- B) `{!$Record.Status} = "Escalated" AND {!$Record__Prior.Status} = "New"`
- C) `{!$Record.Status} = "Escalated" AND {!$Record__Prior.Status} != "Escalated"`
- D) `ISCHANGED({!$Record.Status})`

**Answer:** C — Checking that the current value equals "Escalated" AND the prior value was not "Escalated" ensures the flow fires only the moment the status transitions to "Escalated," regardless of what the prior value was. Option B is too narrow (only fires if prior was specifically "New"). Option A fires on every save when Status is Escalated, not just at the moment of transition. ISCHANGED is a formula function, not valid Flow syntax.

---

**Q3:** During a record save on a Contact, in which order do the following automation tools execute?
1. After-Save Record-Triggered Flow
2. Validation Rules
3. Apex Before Trigger
4. Before-Save Record-Triggered Flow
- A) 2 → 3 → 4 → 1
- B) 3 → 2 → 4 → 1
- C) 2 → 4 → 3 → 1
- D) 4 → 2 → 3 → 1

**Answer:** A — The correct order is: Validation Rules (2) → Apex Before Trigger (3) → Before-Save Flow (4) → [record committed] → After-Save Flow (1). Validation rules always fire before any triggers or flows. Apex before-triggers fire before before-save flows. After-save flows are last among the listed options. This sequence is a guaranteed exam topic.
