# L15: When to Use Which Automation Tool

## 🎯 Learning Objectives
- Select the correct automation tool for a given business requirement using the full decision matrix (Validation Rule, Formula Field, Roll-Up Summary, Before-Save Flow, After-Save Flow, Screen Flow, Scheduled Flow, Approval Process, Platform Event-Triggered Flow, Apex Trigger)
- Identify the most common exam traps including Roll-Up on Lookup, legacy tool recommendations, and Before-Save vs After-Save distinctions
- Apply the decision framework to multi-requirement scenarios and justify the choice with technical reasoning

## 📊 SLIDES

### Slide 1: The Automation Landscape — Why This Matters
**Visual:** Pyramid diagram with layers from bottom to top: Validation Rules & Formulas (foundation) → Roll-Up Summaries → Before-Save Flows → After-Save Flows → Screen Flows → Scheduled Flows → Approval Processes → Platform Events → Apex (apex at the top as most powerful/complex)
**Content:**
- Salesforce provides a layered set of automation tools — each optimized for specific use cases
- Choosing the WRONG tool causes: performance issues, recursion bugs, data integrity problems, or maintainability nightmares
- The exam presents scenario-based questions: given a requirement, pick the right tool
- The hierarchy matters: always use the least-powerful, most-declarative tool that satisfies the requirement
- Legacy tools (Workflow Rules, Process Builder) are RETIRED / no longer recommended — always choose Flow for new automation

**Speaker Notes:** This is the most exam-weighted lecture in the entire Business Logic section. The exam does not test whether you can configure each tool in isolation — it tests whether you can look at a business requirement and choose the right tool from the full menu. The principle of least privilege applies here: always choose the simplest, most admin-maintainable tool that meets the requirement. Apex should be the last resort, not the first instinct. And importantly, if you see Workflow Rules or Process Builder mentioned in an answer choice, eliminate them immediately — Salesforce has deprecated these in favor of Flow.

---

### Slide 2: The Master Decision Matrix (Part 1 — Declarative Tools)
**Visual:** Full-width table with columns: Tool | Trigger / Timing | Operates On | Can Create/Update Related Records | Requires User Interaction | Key Constraint

| Tool | Trigger / Timing | Operates On | Related Records | User Interaction | Key Constraint |
|---|---|---|---|---|---|
| Validation Rule | Before save | Triggering record | No | No | Error only — cannot update fields |
| Formula Field | On read (dynamic) | Triggering record | No (cross-object = read only) | No | Read-only — no DB storage |
| Roll-Up Summary | After child save | Parent record | Parent only | No | Master-Detail ONLY |
| Before-Save Flow | Before record commits | Triggering record | No — same record only | No | Cannot use Get Records on same record being saved |
| After-Save Flow | After record commits | Any record | Yes | No | Counts toward DML/SOQL governor limits |

**Content:**
- Validation Rules and Formula Fields are always-on, non-transactional tools — they evaluate at different lifecycle points
- Roll-Up Summary is passive infrastructure — it automatically recalculates when child records change
- Before-Save and After-Save Flows are the workhorses — they fire automatically on record changes, but have different capabilities
- The Before/After distinction is the #1 source of exam confusion in this section

**Speaker Notes:** Read this table carefully — it's the cheat sheet for half the exam questions. The most important row is Roll-Up Summary: it ONLY works on Master-Detail relationships, never Lookup. And the Before-Save vs After-Save distinction: Before-Save is faster and more efficient for updating the SAME record, but it cannot touch related records. After-Save can update related records but costs DML operations and is slower. If a question says "update a field on the same record when it is saved," the answer is Before-Save Flow. If it says "create a child record when the parent is saved," the answer is After-Save Flow.

---

### Slide 3: The Master Decision Matrix (Part 2 — User-Initiated & Scheduled)
**Visual:** Continuation of the table:

| Tool | Trigger / Timing | Operates On | Related Records | User Interaction | Key Constraint |
|---|---|---|---|---|---|
| Screen Flow | User-initiated | Any records | Yes | Yes — required | Cannot run without user; no background execution |
| Schedule-Triggered Flow | Time-based (nightly/hourly) | Collection of records | Yes | No | Processes records in batches; runs on a schedule |
| Approval Process | User-submitted; human decision | Submitted record | Via actions (field update, email) | Yes — human approver | Cannot be triggered from Flow natively |
| Platform Event-Triggered Flow | Published platform event | Platform event payload | Yes | No | Requires event to be published; async processing |
| Apex Trigger | Before/After DML | Any records | Yes (full) | No | Requires developer; highest complexity and flexibility |

**Content:**
- Screen Flows require a live user — they cannot run in the background on their own
- Schedule-Triggered Flows are the replacement for batch Apex jobs in many scenarios
- Approval Processes require a human approver — they are not purely automated
- Platform Event-Triggered Flows enable real-time integration reactions (e.g., ERP publishes an event, Salesforce reacts)
- Apex is the escape hatch for everything impossible in declarative tools

**Speaker Notes:** The Schedule-Triggered Flow is often confused with a time-based workflow. The key difference: a Schedule-Triggered Flow runs on a defined schedule — like every night at 2 AM — and processes a COLLECTION of records matching criteria. It is not triggered by a record save; it queries for records and acts on each one. Platform Event-Triggered Flows are for integration architects — an external system publishes a Platform Event message to Salesforce's event bus, and the flow reacts. For the exam, Platform Event-Triggered Flows are mentioned in architect-level scenarios involving system integration.

---

### Slide 4: Deep Dive — Before-Save vs After-Save Flow
**Visual:** Two-column comparison card with a vertical dividing line. Left: "Before-Save Flow" with a blue header. Right: "After-Save Flow" with a green header. Each column has bullet points and icons.
**Content:**
**Before-Save Flow:**
- Fires BEFORE the record is committed to the database
- Can only update fields on the SAME record being saved
- Changes are made via Assignment element — NO DML operation consumed
- Faster, more efficient — preferred for same-record field updates
- Cannot: create related records, call subflows that do DML, send emails
- Trigger: Record Created, Record Updated, or both

**After-Save Flow:**
- Fires AFTER the record is committed to the database
- Can create, update, or delete ANY related records
- Can send emails, call external services, publish platform events
- Each DML action counts against governor limits
- Risk of recursion if updating the same object type (add a recursion guard)
- Trigger: Record Created, Record Updated, or both

**Speaker Notes:** This slide is the single most tested comparison in the entire Business Logic section. Memorize the rule: if you need to update a field on the record that triggered the flow, use Before-Save. If you need to do anything beyond that — create a related record, send an email, update a different object — use After-Save. Before-Save updates are essentially free from a governor limit perspective because they are field assignments on a record that hasn't saved yet. After-Save operations each consume a DML statement. If you accidentally use After-Save to update the triggering record, you're consuming a DML and risking recursion. If you use Before-Save trying to create a related Contact, the flow will error — Before-Save cannot do that.

---

### Slide 5: The Exam Trap Table
**Visual:** High-contrast table with two columns: "Exam Scenario / Question Pattern" and "Correct Answer + Why." Each row is color-coded — red for the trap (wrong choice) and green for the correct answer.

| Exam Scenario | Correct Answer | Common Wrong Answer |
|---|---|---|
| "Aggregate child records into parent (on Lookup)" | After-Save Flow with Get/Update Records | Roll-Up Summary (WRONG — only works on Master-Detail) |
| "Update triggering record field on save" | Before-Save Flow | After-Save Flow (works but inefficient; consumes DML) |
| "Run logic automatically every night on all records" | Schedule-Triggered Flow | Scheduled Action in Flow (different concept) |
| "Prevent a record from saving if value is invalid" | Validation Rule | Before-Save Flow with custom error message |
| "Display a calculated read-only value on a field" | Formula Field | Before-Save Flow (unnecessarily complex) |
| "Automate a business process (new requirement)" | Flow | Workflow Rule / Process Builder (LEGACY — deprecated) |
| "Need user to fill out a form before saving" | Screen Flow | Record-Triggered Flow (no user interaction) |
| "Send email when Opportunity stage = Closed Won" | After-Save Flow with Email Alert | Before-Save Flow (cannot send email) |
| "Human approval required with audit trail" | Approval Process | Flow with email action (no formal trail/delegation) |
| "React to external system publishing a message" | Platform Event-Triggered Flow | Schedule-Triggered Flow (not event-driven) |

**Content:**
- Roll-Up Summary on Lookup is the #1 exam trick — always ask "is this Master-Detail?"
- Before-Save cannot send emails, cannot create related records — any DML = use After-Save
- Legacy tools (Workflow, Process Builder) are never the right answer on a current exam
- Validation Rules cannot update fields — they only block saves with error messages

**Speaker Notes:** This table represents the most frequently tested decision points on the CRT-403 exam. Drill these until they are instinctive. The Roll-Up on Lookup trap catches a large percentage of test-takers — the distractor answer "Roll-Up Summary Field" sounds reasonable, but Roll-Up Summary fields are only available when there is a Master-Detail relationship. The legacy tool trap is simpler: if the question says "recommend an automation tool," Workflow Rules and Process Builder are never the correct answer post-2023. Always default to Flow.

---

### Slide 6: The Decision Framework — How to Approach Any Scenario
**Visual:** Decision flowchart with yes/no branch questions leading to tool recommendations. Flow: "Does it require user input?" → Yes → Screen Flow. "Does it need a human to approve?" → Yes → Approval Process. "Does it run on a schedule?" → Yes → Schedule-Triggered Flow. "Does it fire on record save — same record?" → Yes → Before-Save Flow. "Does it fire on record save — related records?" → Yes → After-Save Flow. "Is it reacting to an integration event?" → Yes → Platform Event-Triggered Flow. "Is it preventing bad data at save?" → Yes → Validation Rule. "Is it a calculated read-only value?" → Yes → Formula Field. "Is it aggregating children on Master-Detail?" → Yes → Roll-Up Summary. "None of the above / too complex?" → Apex.
**Content:**
**Ask these questions in order:**
1. Does it require user interaction or input? → Screen Flow
2. Does it require a human decision with audit trail? → Approval Process
3. Does it run on a time schedule (nightly batch)? → Schedule-Triggered Flow
4. Does it react to an integration event? → Platform Event-Triggered Flow
5. Does it fire on record save AND update only the same record? → Before-Save Flow
6. Does it fire on record save AND touch other records/send emails? → After-Save Flow
7. Does it prevent invalid data from saving? → Validation Rule
8. Does it calculate a read-only derived value? → Formula Field
9. Does it aggregate child records (Master-Detail only)? → Roll-Up Summary
10. Is it too complex for any of the above? → Apex Trigger

**Speaker Notes:** Use this decision tree as your mental algorithm during the exam. Read the scenario carefully, identify the key requirement keywords — "user fills out," "manager approves," "nightly," "event from ERP," "update same record," "create related record," "prevent save," "calculate," "aggregate children" — and map each keyword to a tool. Most exam questions are testing a single key distinction: Before vs After Save, Roll-Up vs Flow aggregate, Validation Rule vs Flow error. Very few questions test Apex — the exam expects you to know when to reach for it, not how to write it.

---

### Slide 7: Full Automation Tool Reference Card
**Visual:** Single dense reference card (intended for study/printing) with all 10 tools in a compact table showing: Tool Name | When to Use | Key Limitation | Replaces (Legacy)
**Content:**

| Tool | Primary Use Case | Key Limitation | Legacy Equivalent |
|---|---|---|---|
| Validation Rule | Block saves with invalid data | Cannot update fields; error message only | Same (still current) |
| Formula Field | Display calculated read-only value | No DB storage; recalculates on read | Same (still current) |
| Roll-Up Summary | Aggregate child totals on parent | Master-Detail ONLY; limited to COUNT/SUM/MIN/MAX | Same (still current) |
| Before-Save Flow | Update fields on triggering record efficiently | Cannot DML — no related record creation | Workflow Field Update |
| After-Save Flow | Create/update/delete related records; send emails | Consumes DML limits; recursion risk | Process Builder, Workflow |
| Screen Flow | Guided wizard with user input | Requires user — no background execution | Visualforce Wizard (custom) |
| Schedule-Triggered Flow | Batch-process records on a schedule | Cannot fire on record save | Scheduled Apex (batch) |
| Approval Process | Human sign-off with audit trail | Cannot auto-submit from Flow natively | Same (still current) |
| Platform Event-Triggered Flow | React to integration events on event bus | Requires published event | Streaming API consumers |
| Apex Trigger | Complex multi-object logic, custom error handling | Requires developer; hardest to maintain | Same (still current) |

**Speaker Notes:** This reference card synthesizes the entire lecture into a single view. Notice the Legacy Equivalent column — Before-Save Flow replaces Workflow Field Updates; After-Save Flow replaces both Process Builder and Workflow Actions; Schedule-Triggered Flow replaces Scheduled Apex in many batch scenarios. The tools that have no legacy equivalent — Validation Rules, Formula Fields, Roll-Up Summaries, Approval Processes — remain unchanged and continue to be the right choice for their specific use cases.

---

### Slide 8: Practice Scenarios — Applying the Matrix
**Visual:** Six scenario boxes, each with the scenario text, the correct tool highlighted in green, and a one-sentence justification
**Content:**
- **Scenario 1:** "When a new Lead is created, auto-populate the Lead Source Description field based on the Lead Source value." → **Before-Save Flow** (update field on same triggering record; no DML needed)
- **Scenario 2:** "When an Opportunity closes as Won, create a follow-up Task for the Account Manager." → **After-Save Flow** (create a related record after save)
- **Scenario 3:** "Every night, find all Accounts with no activity in 90 days and update their Status to 'At Risk'." → **Schedule-Triggered Flow** (time-based, processes a collection)
- **Scenario 4:** "A Contact's Total Purchases field should always reflect the sum of all related Order amounts." → **Roll-Up Summary Field** — only if Orders are in a Master-Detail with Contact; otherwise **After-Save Flow**
- **Scenario 5:** "Managers must formally approve any discount over 20% before the Opportunity can be closed." → **Approval Process** (human decision, audit trail, record lock)
- **Scenario 6:** "A service rep needs to walk a customer through a multi-step case creation form on the phone." → **Screen Flow** (guided wizard requiring user input)

**Speaker Notes:** Walk through each scenario using the decision framework from Slide 6. Scenario 1: "auto-populate field on same record on create" → Before-Save. Scenario 2: "create related record after save" → After-Save. Scenario 3: "every night" is the keyword → Schedule-Triggered. Scenario 4 is the Roll-Up trap — always verify Master-Detail before recommending Roll-Up Summary. Scenario 5: "formally approve," "managers," "discount" → Approval Process. Scenario 6: "walk through," "multi-step," "form" → Screen Flow. These six scenarios cover the majority of exam question patterns in this topic area.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 15 — the most important lecture in this entire section. This is where everything comes together. The exam doesn't just test whether you know what each tool does in isolation. It tests whether you can look at a business requirement and confidently pick the RIGHT tool from the full menu. This lecture is your decision framework.

Let me start with the most important principle: use the simplest tool that meets the requirement. Salesforce has a full spectrum from the dead-simple — Validation Rules and Formula Fields — all the way up to Apex Triggers. The exam rewards you for choosing the most appropriate level, not the most powerful one. Apex is not extra credit; it's an indicator that you couldn't solve the problem declaratively.

Let's walk the spectrum.

Validation Rules and Formula Fields are the foundation. Validation Rules prevent bad data from saving — they block the save with an error message. They cannot update fields. Formula Fields calculate a read-only derived value and recalculate every time the record loads — nothing is stored in the database. These two are always-on, passive, and require no configuration triggers.

Roll-Up Summary Fields aggregate child records onto a parent — COUNT, SUM, MIN, MAX. Here's the trap the exam loves: Roll-Up Summary ONLY works on Master-Detail relationships. If the relationship is a Lookup, Roll-Up Summary is not available. In that case, you need an After-Save Flow on the child object to update the parent.

Before-Save Flow and After-Save Flow are the workhorses of automation. They both fire on record save, but at different points and with different capabilities. Before-Save fires before the record commits — you can update fields on the same record via Assignment elements, and it costs zero DML operations. But you cannot create related records, send emails, or do any DML from a Before-Save Flow. After-Save fires after the record commits. You can create, update, or delete any related records, send emails, call services. But each DML action counts against governor limits and you need to guard against recursion.

The rule is simple: updating the triggering record? Before-Save. Doing anything else? After-Save.

Screen Flows are for when a human needs to interact. They present screens, collect input, and guide the user through a process. They cannot run in the background — they require a live user.

Schedule-Triggered Flows run on a time schedule — nightly, hourly, weekly. They query for a collection of records matching criteria and process each one. Think of them as the declarative replacement for batch Apex jobs.

Approval Processes are for formal human decisions with an audit trail. If you need a manager to click Approve or Reject, with delegation, record locking, and a permanent history of who decided what and when — that's an Approval Process.

Platform Event-Triggered Flows react to messages published on Salesforce's event bus. An external system — an ERP, a legacy system — publishes an event, and the flow responds. This is an integration pattern.

And Apex Triggers are the escape hatch for requirements that are genuinely too complex for declarative tools: multi-object transactions, custom exception handling, complex SOQL queries with dynamic conditions.

Now for the traps. First: Roll-Up on Lookup — never works, use After-Save Flow. Second: updating the triggering record — always Before-Save, never After-Save (it works but costs DML and risks recursion). Third: if you see Workflow Rules or Process Builder in an answer, eliminate them — they are legacy and retired. Fourth: if the requirement says "prevent" saving, the answer is Validation Rule, not Flow. Fifth: if the requirement says "display a calculated value" with no editing, the answer is Formula Field.

Use the decision tree I gave you. Memorize those ten questions in sequence. Read the scenario, identify the keywords, map them to the tool. You've got this.

---

## 🔔 EXAM TIPS
- **Roll-Up Summary — Master-Detail ONLY:** This is the #1 trap. If the relationship is a Lookup, Roll-Up Summary is unavailable. Use After-Save Flow to update the parent instead.
- **Before-Save vs After-Save:** Before-Save = same record, no DML, efficient. After-Save = related records, DML, emails, services. "Update a field on the record being saved" = Before-Save every time.
- **Validation Rule vs Before-Save Flow error:** Validation Rules are the correct tool to prevent a bad save with an error message — not Before-Save Flows with fault connectors.
- **Formula Field = no DB storage:** Formula fields recalculate dynamically and cannot be written to. They are read-only. Do not confuse with Before-Save Flow assignments.
- **Legacy tools = wrong answer:** Workflow Rules and Process Builder are retired. Any exam question asking you to "recommend" or "build" automation should never result in these tools as answers.
- **Schedule-Triggered Flow = batch-style:** Runs on a schedule, processes a collection of records. NOT triggered by record save. Key keyword: "nightly," "every hour," "periodically."
- **Screen Flow requires user:** Screen Flows cannot run headlessly. If the scenario describes a background process, the answer is never Screen Flow.
- **Approval Process = human decision + audit trail:** If the scenario says "manager must approve" or "formal sign-off required" or "audit trail of decisions," the answer is Approval Process.
- **After-Save Flow — recursion risk:** Updating the same object type in an After-Save Flow can cause recursion. Add a formula/variable check to prevent re-entering the flow on an update you just made.
- **Platform Event-Triggered Flow:** For integration scenarios where an external system publishes an event. Keywords: "event bus," "integration," "ERP publishes," "streaming."
- **Cannot submit for Approval from Flow natively:** Triggering an approval process submission from within a Flow requires Apex — there is no standard Flow action for this.
- **Formula Field cross-object:** Formula fields can reference parent record fields via relationship lookups (e.g., Account.Industry on Contact) — these are read-only cross-object references, NOT the same as Roll-Up Summary.

## ✅ LECTURE SUMMARY
- Salesforce automation tools exist on a spectrum from passive/declarative (Validation Rules, Formula Fields) to complex/programmatic (Apex Triggers) — always use the least complex tool that satisfies the requirement
- Validation Rule: blocks saves with error messages; cannot update fields
- Formula Field: dynamic read-only calculated value; no database storage
- Roll-Up Summary: aggregates child records (COUNT/SUM/MIN/MAX) on parent — MASTER-DETAIL ONLY, never Lookup
- Before-Save Flow: updates fields on the same triggering record with no DML cost; cannot create related records or send emails
- After-Save Flow: creates/updates/deletes related records, sends emails, calls services; consumes DML; risk of recursion
- Screen Flow: guided wizard requiring live user interaction; cannot run in background
- Schedule-Triggered Flow: time-based batch processing of a collection of records
- Approval Process: human decision with formal audit trail, delegation, record locking
- Platform Event-Triggered Flow: reacts to messages published to Salesforce event bus (integration scenarios)
- Apex Trigger: maximum flexibility for logic that is genuinely impossible in declarative tools
- Legacy tools (Workflow Rules, Process Builder) are retired — always choose Flow for new automation

## ❓ MINI QUIZ

**Q1:** A business analyst wants to display the total amount of all related Opportunity line items on the parent Opportunity record. The Line Items are related via a Lookup relationship. Which automation tool should be used?
- A) Roll-Up Summary Field on the Opportunity  B) Formula Field on the Opportunity  C) After-Save Flow on the Line Item object  D) Before-Save Flow on the Opportunity

**Answer:** C — Roll-Up Summary Fields only work on Master-Detail relationships, not Lookup relationships. Since the Line Items are related via Lookup, an After-Save Flow on the Line Item object that queries and updates the parent Opportunity is the correct approach.

---

**Q2:** When a new Account is created, the "Account Tier" field should be automatically set to "Bronze" if the Annual Revenue is less than $100,000. The field update must be as efficient as possible. Which tool is the best choice?
- A) After-Save Flow with an Update Records element  B) Workflow Rule with a Field Update action  C) Before-Save Flow with an Assignment element  D) Validation Rule with a default value

**Answer:** C — A Before-Save Flow fires before the record is committed and uses an Assignment element to update fields on the same record without consuming any DML operations. This is the most efficient approach. After-Save Flow works but is less efficient (consumes DML). Workflow Rules are legacy and deprecated. Validation Rules cannot update fields.

---

**Q3:** Every Sunday night, Salesforce needs to find all Leads that have not been contacted in more than 30 days and update their Status to "Stale." Which automation tool is designed for this use case?
- A) After-Save Flow with a scheduled action  B) Schedule-Triggered Flow  C) Before-Save Flow with a time-based trigger  D) Approval Process with a time-based action

**Answer:** B — A Schedule-Triggered Flow runs on a defined time schedule (such as every Sunday night) and processes a collection of records matching specified criteria. It is specifically designed for this type of periodic batch-processing requirement. An After-Save Flow fires on record save events, not on a calendar schedule.
