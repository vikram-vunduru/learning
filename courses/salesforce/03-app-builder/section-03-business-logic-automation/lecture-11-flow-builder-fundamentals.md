# L11: Flow Builder Fundamentals

## 🎯 Learning Objectives
- Identify and describe each of the 5 flow types and when to use each one
- Navigate the Flow Builder UI including the canvas, toolbox, and debug mode
- Distinguish between flow elements, resources, and variables, and understand how they work together

## 📊 SLIDES

### Slide 1: What Is Flow Builder?
**Visual:** Screenshot mockup of the Flow Builder canvas with labeled callouts for the toolbox panel, canvas area, toolbar (Save/Debug/Activate buttons), and element palette
**Content:**
- Flow Builder is Salesforce's declarative automation tool for building complex, multi-step logic without code
- Flows can interact with Salesforce data, call Apex, send emails, display screens to users, and integrate with external systems
- Accessed via Setup > Process Automation > Flows
- Replaces the legacy tools: Workflow Rules and Process Builder (both being retired)
- Flows are versioned — each save creates a new version; only one version can be active at a time
**Speaker Notes:** Flow Builder is the centerpiece of declarative automation on the Salesforce platform and accounts for a significant portion of Platform App Builder exam questions. Every admin-level automation use case that previously required Workflow Rules or Process Builder should now be built in Flow Builder.

---

### Slide 2: Flow Builder UI Overview
**Visual:** Annotated screenshot with four labeled zones: (1) Toolbox panel on the left, (2) Canvas in the center, (3) Properties panel on the right when an element is selected, (4) Toolbar at the top with Save, Debug, and Activate buttons
**Content:**
- **Toolbox Panel (left):** Contains the Elements tab (drag-and-drop elements onto canvas) and the Manager tab (manage variables, constants, formulas, text templates, choices)
- **Canvas (center):** The workspace where you build your flow by placing and connecting elements; supports Auto-Layout (organized grid) and Freeform (free placement) modes
- **Auto-Layout vs. Freeform:** Auto-Layout automatically arranges connectors and keeps the flow visually clean; Freeform gives full placement control but requires manual connector management
- **Properties Panel (right):** Appears when you click an element; configure element settings, labels, API names, and conditions
- **Toolbar (top):** Save (saves current version), Debug (opens the debug panel to test the flow), Activate (sets the current version as active)
**Speaker Notes:** The exam may ask about the difference between Auto-Layout and Freeform canvas modes. Auto-Layout is the default for new flows and is recommended because it keeps connectors tidy automatically. The Manager tab in the Toolbox is where you find and create all resources, not just elements.

---

### Slide 3: The 5 Flow Types
**Visual:** Icon grid with one icon per flow type, each with a two-line description below it; color-coded by trigger type (user-initiated, record-triggered, time-triggered, event-triggered, called)
**Content:**
- **Screen Flow:** Displays a user interface (screens with input components); launched from Lightning pages, Experience Cloud, Quick Actions, or Utility Bars; requires user interaction
- **Record-Triggered Flow:** Fires automatically when a record is created, updated, or deleted; no user interaction; two subtypes — before-save and after-save
- **Schedule-Triggered Flow:** Runs on a defined schedule (daily, weekly) against a batch of records; replaces scheduled Apex for simple use cases
- **Platform Event-Triggered Flow:** Fires when a platform event message is published; enables event-driven architecture
- **Auto-launched Flow (No Trigger):** Has no built-in trigger; must be called from Apex, REST API, another flow (Subflow element), or a Process Builder step
**Speaker Notes:** Knowing all five flow types and their triggers is a guaranteed exam topic. The most commonly confused pair is Record-Triggered Flow (fires on record save) and Auto-launched Flow (has no trigger of its own — must be invoked). Schedule-Triggered replaces the old time-based workflow actions for batch processing scenarios.

---

### Slide 4: Flow Elements — Screen and Data Elements
**Visual:** Two-panel diagram: left panel shows Screen flow element icons (Screen, Decision); right panel shows data operation icons (Get Records, Create Records, Update Records, Delete Records) with arrows showing data flowing in and out
**Content:**
- **Start:** The entry point of every flow; contains trigger configuration for record-triggered and scheduled flows
- **Screen:** Displays a form to users; contains screen components (text input, picklist, radio buttons, data table, etc.); only available in Screen Flows
- **Get Records:** Queries Salesforce records using filter criteria; stores results in a Record variable or Collection variable
- **Create Records:** Inserts one or more new records; uses variable values to populate fields
- **Update Records:** Updates existing records; can update the triggering record or other records
- **Delete Records:** Deletes records that match specified criteria
**Speaker Notes:** Get Records is the flow equivalent of a SOQL query. Always store the output in a variable so downstream elements can use the retrieved data. For performance, use "Only the first record" when you expect and need only one result, and use a collection variable when you need multiple records.

---

### Slide 5: Flow Elements — Logic and Action Elements
**Visual:** Flowchart snippet showing a Decision element branching into three outcomes, leading into an Assignment element and then an Action element
**Content:**
- **Decision:** Evaluates conditions and routes the flow down different paths (outcomes); the Default Outcome path fires when no other condition matches
- **Assignment:** Sets or modifies variable values; supports Set, Add, Add at Start, Remove, Remove First, Remove All operations on variables and collections
- **Loop:** Iterates over a collection variable, executing a set of elements for each item; has two connector exits — "For Each Item" and "After Last Item"
- **Action:** Calls an Apex action, sends an email alert, posts to Chatter, invokes a quick action, or calls an external system via named credential
- **Subflow:** Calls another flow as a reusable component; supports passing variables in and out
- **Transform:** Converts data between collection types or maps fields between records (newer element)
**Speaker Notes:** The Decision element is the primary branching mechanism in flows — know it well. The Loop element is essential for processing collections returned by Get Records. The Subflow element enables modular flow design, which is a best practice for reusability and maintainability.

---

### Slide 6: Flow Resources — Variables and Constants
**Visual:** Table with three columns: Resource Type, Description, Example Use Case; rows for Variable, Constant, Formula, Text Template, Choice, Record Choice Set
**Content:**
- **Variable:** Holds a single value or a collection; data types include Text, Number, Currency, Date, DateTime, Boolean, Record (SObject), and Collection variants; can be marked Input (passed in), Output (passed out), or both
- **Constant:** A fixed value that does not change during the flow run; useful for threshold values or configuration strings
- **Formula:** A calculated value using formula syntax (same as field formula editor); evaluated at runtime each time the formula resource is referenced
- **Text Template:** Rich or plain text with embedded merge fields (variables); used to build dynamic email bodies, screen text, or field values
- **Choice / Record Choice Set / Collection Choice Set:** Provide options for Screen Flow components like radio buttons and picklists; Record Choice Set dynamically populates choices from Salesforce records
**Speaker Notes:** Understanding the difference between Variable and Formula resources is important. Variables store data you set or retrieve; Formulas are computed dynamically each time they are used. Text Templates are the flow equivalent of email merge fields and are heavily used when flows send notifications or update multi-line text fields.

---

### Slide 7: Flow Versioning and Activation
**Visual:** Timeline graphic showing Flow Version 1 (Inactive), Version 2 (Inactive), Version 3 (Active — highlighted in green), Version 4 (Inactive — being tested in sandbox)
**Content:**
- Every time you save a flow, Salesforce creates a new numbered version
- Only one version can be **Active** at a time; activating a new version automatically deactivates the previous active version
- Inactive versions are preserved for audit and rollback purposes
- To roll back, deactivate the current version and activate a prior version
- Flows can be exported/imported as metadata (via Change Sets or Salesforce DX) for deployment between orgs
- A flow cannot be deleted if it has been activated (you must deactivate all versions first)
**Speaker Notes:** The exam may ask about versioning behavior. The key facts: only one active version at a time, activating a new version automatically deactivates the old one, and old versions are retained. This is different from Apex classes, which have a single definition that you overwrite.

---

### Slide 8: Fault Paths and Debug Mode
**Visual:** Side-by-side: (A) An Action element with both a regular connector (green arrow) and a Fault Path connector (red arrow labeled "Fault") going to a Screen element displaying an error message. (B) The Debug panel UI with a "Run" button and a record ID input field.
**Content:**
- **Fault Path:** An optional connector on Action, Get Records, Create Records, Update Records, and Delete Records elements; fires when the element encounters an error at runtime
- Without a fault path, an unhandled error terminates the flow and surfaces a generic error message to the user
- Best practice: always add a fault path that logs the error (e.g., creates a custom log record) or displays a meaningful message on a Screen element
- **{!$Flow.FaultMessage}** — a system variable that holds the error message from a failed element; use it in fault path notifications
- **Debug Mode:** Launched from the Flow Builder toolbar; lets you run the flow with a specific record ID or manually set variable values; shows a step-by-step trace of which elements executed and the values of variables at each step
**Speaker Notes:** The exam is very likely to ask about fault paths — specifically that you should always handle them and that {!$Flow.FaultMessage} gives you the error detail. Debug mode is essential for testing flows before activation and is far more informative than the generic runtime error a user would see.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 11 on Flow Builder Fundamentals. Flows are the future of Salesforce declarative automation — Workflow Rules and Process Builder are both on the path to retirement, and everything is moving to Flow Builder. This lecture gives you the foundation you need to understand how Flow Builder works and sets you up for the more detailed content in the next lecture on Record-Triggered Flows.

Let's start with the UI. When you open Flow Builder, you see three main areas. On the left is the Toolbox, which has two tabs: Elements and Manager. Elements is where you drag things onto your canvas. Manager is where you create and manage your resources — variables, formulas, constants, and text templates. In the center is the Canvas, your working area. In the top-right toolbar are your three key buttons: Save, Debug, and Activate. Know these areas — the exam has been known to ask about where specific functionality lives.

The canvas has two layout modes. Auto-Layout arranges connectors automatically and keeps things visually neat — it's the default and recommended for most flows. Freeform gives you full manual control but requires you to draw and manage connectors yourself.

Now let's talk about the five flow types. Screen Flows display a UI to users — think of them as wizards or guided forms. They're launched from Lightning pages, Quick Actions, or utility bars. Record-Triggered Flows fire automatically when a record is created, updated, or deleted — no user clicks required. Schedule-Triggered Flows run on a time schedule against a batch of records — useful for nightly or weekly processing jobs. Platform Event-Triggered Flows respond when a platform event message is published on the event bus. And Auto-launched Flows have no trigger of their own — they must be called by Apex, the REST API, another flow, or Process Builder.

For the exam, the most important distinction is between Record-Triggered Flows (fires on record save) and Auto-launched Flows (has no built-in trigger, must be explicitly called). Don't mix those up.

Moving on to elements. The Data elements — Get Records, Create Records, Update Records, Delete Records — are your DML and query operations. Get Records is essentially a SOQL query. Always check whether you need one record or a collection. The Logic elements — Decision, Assignment, Loop — control the flow's execution path. Decision is your if-else branching. Loop iterates over collections. Assignment sets variable values. The Action element lets you call Apex, send email alerts, or invoke external systems.

Resources are what you use to store and compute data. Variables hold values. Constants hold fixed values that don't change. Formulas are computed dynamically using formula syntax. Text Templates are like merge-field templates for building dynamic strings. Choices and Record Choice Sets populate picklist options in Screen Flows.

A few operational details you must know. Flows are versioned. Every save creates a new version. Only one version can be active at a time. Activating a new version automatically deactivates the previous one. Old versions are retained for rollback.

And always build fault paths. Any element that interacts with data can fail. Without a fault path, an error terminates the flow ungracefully. Connect a fault path to a Screen element with a meaningful message, and use {!$Flow.FaultMessage} to surface the actual error detail for troubleshooting.

Finally, Debug mode is your best friend. Before activating any flow, run it through the debugger. You can supply a record ID, step through each element, and inspect variable values at every stage. It's much more efficient than activating and testing in the UI repeatedly.

Next lecture, we go deep on Record-Triggered Flows — including the critical difference between before-save and after-save execution, which is one of the most tested topics on the entire exam. Don't miss it.

---

## 🔔 EXAM TIPS
- **5 flow types:** Know all five by name, trigger mechanism, and primary use case — this is heavily tested.
- **Auto-launched Flow has no trigger:** It must be called by Apex, API, another flow, or Process Builder — it does not fire on its own.
- **One active version at a time:** Activating a new version automatically deactivates the previous active version.
- **Screen element is only for Screen Flows:** You cannot put a Screen element in a Record-Triggered Flow.
- **Fault paths are best practice:** Always handle fault paths on data elements; use {!$Flow.FaultMessage} to capture the error detail.
- **Manager tab for resources:** Variables, formulas, constants, and text templates are created in the Manager tab of the Toolbox, not the Elements tab.
- **Get Records returns a Record or Collection:** Choose "Only the first record" for single-record queries and a Collection variable for multiple records.
- **Debug mode tests before activation:** Run the debugger with a real record ID to trace execution and inspect variable values step by step.

---

## ✅ LECTURE SUMMARY
- Flow Builder replaces Workflow Rules and Process Builder as Salesforce's primary declarative automation tool
- The UI consists of the Toolbox (Elements + Manager tabs), Canvas (Auto-Layout or Freeform), and Toolbar (Save, Debug, Activate)
- The 5 flow types are: Screen Flow, Record-Triggered Flow, Schedule-Triggered Flow, Platform Event-Triggered Flow, and Auto-launched Flow
- Elements perform actions (Get Records, Create Records, Decision, Loop, Action, Screen, Subflow); resources store and compute data (Variables, Constants, Formulas, Text Templates, Choices)
- Only one version of a flow can be active at a time; activating a new version deactivates the previous one
- Always add fault paths to data elements and use {!$Flow.FaultMessage} for error visibility; use Debug mode to test flows before activation

---

## ❓ MINI QUIZ

**Q1:** A flow needs to automatically update related child records whenever a parent Account is updated. Which flow type should be used?
- A) Screen Flow
- B) Auto-launched Flow
- C) Record-Triggered Flow
- D) Schedule-Triggered Flow

**Answer:** C — Record-Triggered Flows fire automatically when a record is created, updated, or deleted without any user interaction. An Auto-launched Flow (B) would require something else to call it. A Screen Flow (A) requires user interaction.

---

**Q2:** In Flow Builder, where do you create and manage variables, formulas, and text templates?
- A) The Elements tab of the Toolbox
- B) The Manager tab of the Toolbox
- C) The Properties panel on the right side of the canvas
- D) The Debug panel in the toolbar

**Answer:** B — Resources such as variables, constants, formulas, and text templates are created and managed in the Manager tab of the Toolbox panel. The Elements tab is for dragging flow elements onto the canvas.

---

**Q3:** A flow's Action element fails at runtime because an external system is unavailable. No fault path is configured. What happens?
- A) The flow pauses and retries the action in 30 minutes
- B) The flow skips the failed element and continues
- C) The flow terminates with a generic error message displayed to the user
- D) The flow automatically rolls back any records created earlier in the same flow

**Answer:** C — Without a fault path, an unhandled error terminates the flow and displays a generic error message. Flows do not automatically retry or skip failed elements. Always connect a fault path to display a meaningful message and/or log the error using {!$Flow.FaultMessage}.
