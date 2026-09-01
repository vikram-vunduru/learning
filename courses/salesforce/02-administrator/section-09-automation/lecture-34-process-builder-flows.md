# L34: Process Builder & Flows

## 🎯 Learning Objectives
- Understand Process Builder's current legacy status and relationship to Flow
- Identify all Salesforce Flow types and their trigger mechanisms
- Describe the key Flow elements (Start, Decision, Assignment, Get/Create/Update/Delete Records, Loop, Action, Subflow)
- Explain the difference between before-save and after-save record-triggered flows
- Navigate the Flow Builder interface and debug flows

## 📊 SLIDES

### Slide 1: Process Builder — Legacy Status
**Visual:**
```
  ┌──────────────────────────────────────────────────────┐
  │           PROCESS BUILDER                            │
  │                                                      │
  │   ██████████████████████████████████████            │
  │   █                                    █            │
  │   █          L E G A C Y              █            │
  │   █                                    █            │
  │   ██████████████████████████████████████            │
  │                                                      │
  │   Salesforce no longer adding features here         │
  └──────────────────────────────────────────────────────┘
                        │
                        │  Migrate Here
                        ▼
  ┌──────────────────────────────────────────────────────┐
  │           FLOW BUILDER  ✓                           │
  │   Record-Triggered Flows replace Process Builder    │
  │   Migration tool available in Setup                 │
  └──────────────────────────────────────────────────────┘
```
**Content:**
- **Process Builder** was Salesforce's primary automation tool (2015-2021)
- It allowed point-and-click automation with multiple criteria branches and actions
- **Current status:** Process Builder is LEGACY and being retired
  - Salesforce stopped creating new Process Builder features
  - Existing processes continue to work in orgs that have them
- **EXAM NOTE:** Process Builder still appears on the CRT-101 exam
- The replacement is **Flow** (specifically Record-Triggered Flows)
- Salesforce provides a migration tool to convert Process Builder → Flow
- **Key advantage of Flow over PB:** Flow supports before-save records, loops, better error handling, subflows
**Speaker Notes:** Similar to workflow rules, Process Builder is deprecated but still exam-relevant. The key difference between Process Builder and Workflow Rules: Process Builder supported complex multi-criteria branching, multiple action groups, and could do things like post to Chatter, create child records, and launch other processes. Flow supersedes all of this with even more capability. For the exam, know Process Builder's capabilities relative to workflow rules; for real-world work, build everything in Flow.

### Slide 2: Salesforce Flow — The Modern Automation Platform
**Visual:**
```
                         ┌───────────┐
                         │   FLOW    │
                         └─────┬─────┘
           ┌─────────┬─────────┼──────────┬────────────┐
           ▼         ▼         ▼          ▼            ▼
  ┌──────────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
  │ Screen Flow  │ │Auto- │ │Schedule- │ │ Record-  │ │Platform Event-   │
  │              │ │launch│ │Triggered │ │Triggered │ │Triggered         │
  │ Has UI       │ │ed    │ │          │ │          │ │                  │
  │ User-facing  │ │No UI │ │Calendar/ │ │On Create/│ │Fires on Platform │
  │ wizard-style │ │Called│ │schedule  │ │Update/   │ │Event message     │
  │              │ │by    │ │batch     │ │Delete    │ │received          │
  │              │ │others│ │          │ │          │ │                  │
  └──────────────┘ └──────┘ └──────────┘ └──────────┘ └──────────────────┘
```
**Content:**
- **Flow** is Salesforce's current, recommended automation and UI tool
- Five Flow Types:
  1. **Screen Flow:** Has a user interface; guides users through a series of screens
  2. **Auto-launched Flow:** No UI; called by another process (Apex, Process Builder, another Flow)
  3. **Schedule-Triggered Flow:** Runs on a set schedule on a batch of records
  4. **Record-Triggered Flow:** Fires automatically when a record is created, updated, or deleted
  5. **Platform Event-Triggered Flow:** Fires when a Platform Event message is received
**Speaker Notes:** Flows replaced both Workflow Rules and Process Builder. The five flow types cover every automation scenario. Screen Flows are like wizards that guide users through data entry. Record-Triggered Flows are the direct replacement for workflow rules and process builder. Schedule-Triggered Flows run in batch — perfect for time-based processing. Platform Event-Triggered Flows support event-driven architectures. Auto-launched Flows are utility flows called by other automation.

### Slide 3: Record-Triggered Flows — Core Concepts
**Visual:**
```
  START (Trigger: Record Created / Updated / Deleted)
        │
        ▼
  Entry Criteria met?
        │
        ├── NO  ──▶ Flow exits (does nothing)
        │
        └── YES ──▶ Which run mode?
                          │
              ┌───────────┴────────────┐
              ▼                        ▼
     BEFORE-SAVE                  AFTER-SAVE
     ──────────────                ──────────────
     Runs BEFORE DB write          Runs AFTER DB write
                                   
     ✓ Update triggering           ✓ Create/update other
       record's own fields           records
     ✓ No extra DML needed         ✓ Send emails
     ✓ Faster performance          ✓ Call external services
     ✗ Cannot create/update        ✗ Extra DML for same
       other records                 record update
     ✗ Cannot call external        
       services                    
```
**Content:**
- **Trigger:** Record Create, Update, Delete (choose which)
- **Entry criteria:** Filter conditions; flow only runs when criteria are met (like workflow criteria)
- **Two run modes:**
  - **Before-Save (Optimized):** Runs BEFORE the record is written to the database
    - Can update fields on the triggering record without a separate DML operation
    - Cannot create/update other records, send emails, or call external services
    - Faster performance; uses $Record to access record values
  - **After-Save:** Runs AFTER the record is saved
    - Full capabilities: create/update related records, send emails, call flows/actions
    - Must use a Get Records element to query the triggering record's current values
- **Scheduled Paths:** Time-based actions (like workflow time triggers) within a record-triggered flow
**Speaker Notes:** Before-save vs. after-save is a critical distinction that the exam tests. Before-save flows are like Apex before-triggers — they run before the database write, making them more efficient for updating the triggering record's own fields. No DML is required because the record hasn't been saved yet. After-save flows are more powerful but use an extra DML operation when updating the triggering record. Use before-save for field updates on the same record; use after-save for everything else.

### Slide 4: Flow Builder Interface — Key Elements
**Visual:**
```
  ┌──────────────── FLOW BUILDER CANVAS ──────────────────────────┐
  │                                                                │
  │  ┌───────────┐                                                │
  │  │   START   │  ← defines trigger type and entry criteria    │
  │  └─────┬─────┘                                                │
  │        │                                                      │
  │        ▼                                                      │
  │  ◇ DECISION   ← branches flow (IF condition THEN path A/B)   │
  │   /        \                                                  │
  │  ▼          ▼                                                 │
  │ [ASSIGNMENT] [GET RECORDS]  ← set variables / query data      │
  │      │            │                                           │
  │      ▼            ▼                                           │
  │ [UPDATE      [CREATE        ← data operations                 │
  │  RECORDS]    RECORDS]                                         │
  │      │                                                        │
  │      ▼                                                        │
  │  ↺ LOOP      ← iterate over a collection of records          │
  │      │                                                        │
  │      ▼                                                        │
  │  [ACTION]    ← email alert / Apex / subflow invocation        │
  └────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Start:** Defines the trigger type and entry criteria
- **Decision:** Branches the flow based on conditions (like an IF-THEN-ELSE); multiple outcome paths
- **Assignment:** Sets or changes variable values within the flow
- **Get Records:** Queries Salesforce data (SELECT equivalent); stores results in variables
- **Create Records:** Creates new Salesforce records within the flow
- **Update Records:** Updates existing records
- **Delete Records:** Deletes records
- **Loop:** Iterates over a collection of records; process each item individually
- **Action:** Calls an external action (email alert, Apex, quick action, subflow invocation)
- **Subflow:** Calls another flow as a reusable component
**Speaker Notes:** The flow canvas uses visual elements connected by arrows. Decision elements create multiple paths based on conditions. Assignment elements set variables — think of them as the equivalent of variable assignment in code. The Data elements (Get/Create/Update/Delete Records) are how flows interact with Salesforce data. Loops enable iterating over collections — for example, processing all Opportunity line items in a list. Actions allow calling external services, sending emails, and triggering other automation.

### Slide 5: Screen Flows
**Visual:**
```
  Screen Flow — Multi-Step Wizard

  ┌─────────────────────┐     ┌─────────────────────┐     ┌────────────────────┐
  │  STEP 1             │     │  STEP 2             │     │  STEP 3            │
  │  Enter Details      │     │  Confirm            │     │  Success!          │
  │                     │     │                     │     │                    │
  │  Name: [__________] │     │  Name: John Smith   │     │  ✓ Account,        │
  │  Email:[__________] │     │  Email: j@co.com    │     │    Contact, and    │
  │  Phone:[__________] │     │  Phone: 555-1234    │     │    Opportunity     │
  │                     │     │                     │     │    created.        │
  │  [    Next   ▶ ]    │     │  [◀ Back] [Submit▶] │     │  [  Done  ]        │
  └─────────────────────┘     └─────────────────────┘     └────────────────────┘

  Launch from: Quick Action │ Lightning Page Component │ Utility Bar │ Experience Cloud
```
**Content:**
- Screen Flows display interactive screens to users during execution
- **Screen elements:** Text, number, checkbox, lookup, picklist, and more input components
- **Navigation:** Next/Back buttons; conditional navigation based on user input
- **Use cases:**
  - Guided data entry wizards
  - Service console quick processes (update case + create task in one flow)
  - Onboarding wizards
  - Self-service portals
- **Launch methods:** Quick Action, Lightning Page component, Utility Bar, Experience Cloud
- **Variables:** Collect user input via screen components; pass values to other flow elements
**Speaker Notes:** Screen Flows are the UI-building part of Flow. Instead of building custom Apex+Visualforce pages for complex data entry, admins can build screen flows visually. They're launched from quick actions on page layouts, as Lightning page components, or embedded in Experience Cloud sites. The key is that screen flows interact with users in real time — they're not background processes.

### Slide 6: Schedule-Triggered Flows and Auto-launched Flows
**Visual:**
```
  SCHEDULE-TRIGGERED FLOW               AUTO-LAUNCHED FLOW
  ─────────────────────────             ─────────────────────────
  ┌──────────────────────┐              ┌─────────────────────────┐
  │  🗓 Schedule:          │              │  Called by:             │
  │  Daily at 9:00 AM     │              │  ┌──────────────────┐   │
  └──────────┬───────────┘              │  │ Apex code        │   │
             │                          │  │ REST API call    │   │
             ▼                          │  │ Another Flow     │   │
  Batch of records meeting              │  │  (Subflow)       │   │
  criteria (up to 2,000)                │  │ Process Builder  │   │
             │                          │  └────────┬─────────┘   │
             ▼                          │           │             │
  Flow logic processes                  │           ▼             │
  each record                           │  Auto-launched Flow     │
                                        │  executes actions       │
  Use for: nightly cleanup,             └─────────────────────────┘
  weekly digests, stale                 Use for: reusable utility
  record updates                        logic, shared subroutines
```
**Content:**
- **Schedule-Triggered Flows:**
  - Run on a defined schedule (hourly, daily, weekly, specific date/time)
  - Process a batch of records meeting specified criteria
  - Great for time-based operations: send weekly digest, update stale records, archive old cases
  - Uses the same flow elements as other types
  - Has limits on batch size (2,000 records per batch by default)
- **Auto-launched Flows:**
  - No trigger of their own — called by something else
  - Callers: Apex code, REST API, another Flow (Subflow element), Process Builder, buttons
  - Use as reusable utility flows (e.g., "Calculate Discount" flow called from multiple other flows)
  - Can have input and output variables to pass data to/from the caller
**Speaker Notes:** Schedule-triggered flows replaced the old "batch Apex" pattern for simple time-based operations. An admin can now build a flow that runs every Monday morning to find all Accounts with no Activity in 30 days and create a follow-up task — no Apex required. Auto-launched flows are the building blocks of reusable automation. Build common logic once as an auto-launched flow, then call it as a subflow from multiple record-triggered flows.

### Slide 7: Flow Debugging and Testing
**Visual:**
```
  Flow Builder Debug Interface

  ┌──────────────────────────────────────────────────────────────┐
  │  [Run]  [Debug ▼]  [Save]  [Activate]                       │
  └──────────────────────────────────────────────────────────────┘
  ┌──────────────────────────┐  ┌───────────────────────────────┐
  │  FLOW CANVAS             │  │  DEBUG PANEL                  │
  │                          │  │                               │
  │  ▶ START          ✓      │  │  Variables at this step:      │
  │    │                     │  │  recordId = 001xx0000001      │
  │  ▶ DECISION       ✓      │  │  stageName = "Closed Won"     │
  │    │ → Path: Closed Won  │  │  discountAmt = 15.0           │
  │  ▶ UPDATE RECORDS ✓      │  │                               │
  │    │                     │  │  Decision outcome:            │
  │  ▶ ACTION         ✗      │  │  → "High Discount" path       │
  │    │                     │  │                               │
  │    └── FAULT PATH ──▶    │  │  ERROR at ACTION:             │
  │        Log error &       │  │  Timeout calling REST service │
  │        notify admin      │  └───────────────────────────────┘
  └──────────────────────────┘
  Always add Fault Paths to production flows — without one, errors crash the flow
```
**Content:**
- **Flow Builder Debug Tool:** Built into Flow Builder (toolbar → Debug button)
  - Run the flow step by step; see which elements execute and which are skipped
  - Inspect variable values at each step
  - Provide input variable values for testing
  - Shows decision outcomes and error details
- **Run in Debug Mode:** From the Run button dropdown → "Run in Debug Mode"
- **Fault Path:** Add a Fault connector to any element to handle errors gracefully
  - Without fault path: flow fails with a generic error to the user
  - With fault path: custom error handling, logging, or user message
- **Flow Error Email:** If a background flow fails without a fault path, Salesforce emails the admin
- **Best practices:** Test all Decision outcomes; use fault paths for production flows
**Speaker Notes:** Debugging is a critical skill for Flow. The built-in debugger lets you step through your flow and inspect every variable value at each step — far more powerful than trying to debug by running the flow repeatedly in a sandbox. Fault paths are essential for production flows that update records or call external services. Without a fault path, any unhandled error shows a cryptic message to users or fails silently in background flows. Always add fault paths to critical flow elements.

### Slide 8: Flow Best Practices and Exam Summary
**Visual:**
```
  ┌──────────────────┬────────────────────┬────────────────────┐
  │  Screen Flow     │  Autolaunched Flow  │  Schedule-Triggered│
  ├──────────────────┼────────────────────┼────────────────────┤
  │  Has UI screens  │  No UI             │  No UI             │
  │  User-triggered  │  Code/Process-     │  Time-based        │
  │  Quick Actions,  │  triggered         │  Runs on schedule  │
  │  Lightning pages,│  Invocable from    │  Bulk processing   │
  │  Experience Cloud│  Apex, Flow,       │  (2,000 rec/batch) │
  │                  │  Agentforce        │                    │
  └──────────────────┴────────────────────┴────────────────────┘

  ┌──────────────────────────┬─────────────────────────────────┐
  │  Record-Triggered        │  Platform Event-Triggered       │
  │  (Before-Save)           ├─────────────────────────────────┤
  │  Update triggering       │  Fires on Platform Event msg    │
  │  record fields — no DML  │  Event-driven architecture      │
  ├──────────────────────────┤                                 │
  │  Record-Triggered        │                                 │
  │  (After-Save)            │                                 │
  │  Full capabilities:      │                                 │
  │  related records, email, │                                 │
  │  external services       │                                 │
  └──────────────────────────┴─────────────────────────────────┘
```
**Content:**
- **Use before-save for:** Updating fields on the triggering record (no DML needed, faster)
- **Use after-save for:** Creating/updating related records, sending emails, calling external services
- **Use scheduled flows for:** Batch time-based processing (nightly cleanup, weekly reports)
- **Use screen flows for:** User-facing wizards and guided processes
- **One flow per trigger:** Best practice is one record-triggered flow per object per trigger event (reduce conflicts)
- **Bulkification:** Flows automatically bulkify — design them to handle collections, not single records
- **Migrate from:** Workflow Rules → Record-Triggered Flow; Process Builder → Record-Triggered Flow
- **Flow limits:** 2,000 elements per flow, governor limits apply (DML, SOQL)
**Speaker Notes:** The "one flow per trigger" best practice is important for maintainability. Instead of multiple record-triggered flows on the same object for the same trigger, consolidate them into one flow with Decision elements branching to different paths. This gives you a clear picture of all automation on that object. Flow is Salesforce's investment area — every new automation release adds Flow features, not workflow or process builder features. Master Flow for a long admin career.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 34 — Process Builder and Flows. Flow is the most important automation tool in Salesforce today, and it's replacing everything that came before it. Let's understand why and how it all fits together.

Process Builder was Salesforce's automation tool from 2015 through about 2021. It was an improvement over workflow rules because it supported branching logic, multiple action groups, and could do things like create child records and post to Chatter. But it had limitations — no looping, limited error handling, and no before-save capability. Process Builder is now legacy, being retired. But it's still on the exam.

Flow is the current standard. It comes in five types. Screen Flows show users an interface — think of them as wizard-style guided processes. Auto-launched Flows run in the background when called by something else. Schedule-Triggered Flows run on a schedule, processing batches of records. Record-Triggered Flows fire automatically when records are created, updated, or deleted. Platform Event-Triggered Flows fire when a Platform Event message arrives.

Record-Triggered Flows are the most important type for the admin exam. They have two run modes: before-save and after-save. Before-save runs before the record is committed to the database. You can update the triggering record's own fields super efficiently because no separate DML is needed. But you can't create other records or call external services. After-save runs after the record is saved and can do anything — create child records, send emails, call REST services — but it's slightly less efficient for updating the triggering record.

The Flow Builder canvas has several key elements: Start (defines the trigger), Decision (branches your logic like an if-then), Assignment (sets variables), Get/Create/Update/Delete Records (interact with data), Loop (iterate over collections), and Action (call emails, Apex, subflows). Screen Flows add Screen elements for user interfaces.

To debug your flow, use the Debug button in Flow Builder. You can step through each element, inspect variable values, and see exactly what happened at each decision point. Always add Fault paths to critical elements — without them, errors surface as cryptic messages to users.

For the exam: know the five flow types, the before-save vs. after-save distinction, the key flow elements, and how flows compare to legacy tools.

## 🔔 EXAM TIPS
- **Before-Save vs. After-Save:** Before-save = update the triggering record's own fields (no extra DML, faster). After-save = everything else (creating related records, external calls).
- **Five Flow Types:** Screen, Auto-launched, Record-Triggered, Schedule-Triggered, Platform Event-Triggered. Know each trigger mechanism.
- **Process Builder Legacy:** Still on exam; key distinguishing features vs. Workflow Rules: multiple criteria, create child records, post to Chatter.
- **Flow Elements:** Decision (branching), Assignment (set variables), Loop (iterate collections), Get/Create/Update/Delete Records (data operations).
- **Fault Path:** Without a fault path on an element, unhandled errors crash the flow. Add fault paths to production flows.
- **One Flow Per Object Per Trigger:** Best practice to consolidate automation; avoid multiple conflicting flows on the same trigger.
- **Schedule-Triggered Flow:** Replaced batch Apex for simple time-based operations; processes 2,000 records per batch.

## ✅ LECTURE SUMMARY
- Process Builder is legacy (retiring) but still tested on CRT-101; replaced by Record-Triggered Flows
- Five Flow types: Screen, Auto-launched, Record-Triggered, Schedule-Triggered, Platform Event-Triggered
- Record-Triggered Flow: before-save = update triggering record's fields; after-save = full capabilities
- Key Flow elements: Start, Decision, Assignment, Get/Create/Update/Delete Records, Loop, Action, Subflow
- Screen Flows provide user interfaces; launched via Quick Actions, Lightning pages, or Experience Cloud
- Schedule-Triggered Flows run batches on a time schedule; replace simple time-based Apex
- Debug flows using the built-in debugger; always add Fault paths for production resilience

## ❓ MINI QUIZ

**Q1:** An admin wants to automatically update a custom field "Days_Open__c" on a Case record every time the case is saved, calculating how many days have passed since the case was created. Which flow configuration is MOST efficient?
- A) After-save Record-Triggered Flow that uses Get Records to query the case, then Update Records to save the field
- B) Before-save Record-Triggered Flow that assigns the calculated value to the $Record.Days_Open__c field
- C) Schedule-Triggered Flow that runs hourly to update all open cases
- D) Auto-launched Flow called by an Apex trigger

**Answer:** B — A before-save record-triggered flow is most efficient for updating a field on the triggering record. The value can be directly assigned to $Record.Days_Open__c without any additional DML operation, since the record hasn't been saved yet. After-save would work but requires an additional DML update operation.

**Q2:** Which type of Salesforce Flow would you use to build a multi-step onboarding wizard that collects information from a user across several screens and creates an Account, Contact, and Opportunity at the end?
- A) Record-Triggered Flow (After-Save)
- B) Schedule-Triggered Flow
- C) Screen Flow
- D) Auto-launched Flow

**Answer:** C — Screen Flows display interactive screens to users. A multi-step wizard with several data collection screens is exactly what Screen Flows are designed for. The wizard can collect data across screens and then use Create Records elements to create multiple records (Account, Contact, Opportunity) at the end.

**Q3:** A Record-Triggered Flow fires after a Case is updated. The flow calls an external REST service that occasionally times out, causing the flow to fail with an unhandled error. What is the BEST solution to handle this gracefully?
- A) Set the flow's trigger to "Before Save" to prevent the error from reaching users
- B) Add a Fault path connector to the external service Call element to handle timeout errors
- C) Remove the external service call from the flow and use a Workflow Rule instead
- D) Schedule the flow to run nightly instead of on record update

**Answer:** B — Adding a Fault path to the external service call element allows the flow to handle errors gracefully. When the service times out, instead of crashing the entire flow (and potentially failing the record save for after-save flows, or surfacing an error to the user), the fault path can send a notification to the admin, log the error, or display a user-friendly message.
