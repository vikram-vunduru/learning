# Process Builder (Legacy) & Flow (Current)

## Exam Domain
Workflow/Process Automation — 16% of exam

## Core Concepts

**Process Builder = LEGACY** (same retirement path as Workflow Rules). Know it for the exam; use Flow for everything new.

**Flow = CURRENT STANDARD** for all Salesforce automation. Every new automation should be built in Flow Builder.

**The 5 Flow Types:**

| Flow Type | Triggered By | User Interaction? |
|---|---|---|
| Screen Flow | User manually launches (button, component) | YES — shows screens |
| Auto-launched Flow | Process Builder, Apex, API, another Flow | NO — runs in background |
| Record-Triggered Flow | Record save (create/update/delete) | NO — runs in background |
| Scheduled Flow | Time-based schedule (cron) | NO — runs in background |
| Platform Event-Triggered Flow | Platform Event message received | NO — runs in background |

**Record-Triggered Flow — the most tested type:**
Two modes with very different behavior:

| | Before Save | After Save |
|---|---|---|
| When it runs | Before record is committed | After record is committed |
| Can update triggering record? | YES (no extra DML) | YES (via separate DML — costs a governor limit) |
| Can update OTHER records? | NO | YES |
| Can create records? | NO | YES |
| Can call Apex? | Limited | YES |
| Performance | Faster (no extra DML) | Standard |

**Before Save Flow:** 
- Use this when you only need to update fields on the same record being saved
- Replaces formula fields for complex calculated values
- Does NOT require an extra DML operation (the field update is part of the original save)
- Cannot create related records, call apex actions, or update other records

**After Save Flow:**
- Use when you need to do anything beyond updating the triggering record
- Can create/update other records, send emails, call Apex, launch subflows
- Costs an extra DML operation for the triggering record update

**Flow Actions:**
- Create Records
- Update Records
- Delete Records
- Get Records (query)
- Send Email
- Call Apex
- Invoke another Flow (Subflow)
- HTTP Callout (platform feature)
- Post to Chatter

**Flow elements:**
- **Assignment:** Sets variable values
- **Decision:** Branch on conditions (like an IF statement)
- **Loop:** Iterates over a collection
- **Subflow:** Calls another Flow
- **Screen:** Shows UI to user (Screen Flows only)

## PTA / SA Relevance

Flow is the no-code automation platform. In enterprise implementations, Flow replaces:
- Workflow Rules (simple field updates, email alerts)
- Process Builder (multi-step record-triggered logic)
- Some Apex triggers (simple record updates, validation, notification)

**When Flow is NOT sufficient (need Apex):**
- Complex SOQL with aggregate queries
- Bulk processing of 10,000+ records (flow loops hit governor limits)
- Cross-object lookups in complex queries
- Real-time integrations with error handling
- Complex business logic requiring programming constructs

**The Flow governance discussion:** One of the most common enterprise issues is "we have 200 flows and no one knows what they all do." Flow governance requires: naming conventions, documentation, deactivating unused flows, and a deployment process. An org with flows checked into version control (DX) is architecturally mature.

**Before-save vs After-save architecture:** This decision matters for performance. For field calculations and simple updates on the same record, Before Save is always the right choice — it's faster and uses fewer governor limits. After Save is for side effects.

## Architecture / How It Works

```
Flow Types Decision Tree
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What triggers the automation?
  │
  ├── User clicks a button/component
  │   → Screen Flow (with UI) or
  │     Auto-launched Flow (no UI)
  │
  ├── Record is created or updated
  │   → Record-Triggered Flow
  │       ├── Only updating this record?
  │       │   → Before Save (faster)
  │       └── Creating/updating other records?
  │           → After Save
  │
  ├── Scheduled time (daily at midnight, etc.)
  │   → Scheduled Flow
  │
  └── External event (Platform Event)
      → Platform Event-Triggered Flow

  Before Save vs After Save:
  ┌────────────────────────────────────────────┐
  │  BEFORE SAVE:                              │
  │  Triggering Record fields → UPDATE ✓       │
  │  Other records → NOT ALLOWED ✗             │
  │  Create records → NOT ALLOWED ✗            │
  │  Governor limit DML → NOT consumed         │
  │                                            │
  │  AFTER SAVE:                               │
  │  Triggering Record → UPDATE ✓ (DML cost)   │
  │  Other records → UPDATE ✓                  │
  │  Create records → ✓                        │
  │  Apex actions → ✓                          │
  └────────────────────────────────────────────┘
```

**Limitations:**
- Before Save flows: cannot create or update related records, cannot call most Apex actions
- After Save flows: each update to the triggering record costs an extra DML (governor limit)
- Screen Flows require user interaction — cannot run in background automation
- Scheduled Flows have batch size limits per run
- Flow loops processing large collections can hit governor limits (150 DML statements per transaction)
- Process Builder: cannot create new instances in new orgs (legacy, same as Workflow Rules)

## Key Facts to Memorize

- Process Builder = LEGACY; Flow = CURRENT standard
- 5 Flow types: Screen, Auto-launched, Record-Triggered, Scheduled, Platform Event-Triggered
- Before Save: update triggering record fields only; no extra DML; faster
- After Save: can create/update/delete any records; costs extra DML
- Screen Flow = user-facing; must be invoked by user action
- Auto-launched Flow = background; called by another process
- Record-Triggered Flow = fires on record save (create/update/delete configurable)
- Scheduled Flow = time-based batch; runs at scheduled intervals

## Exam Traps

- **"Before Save flows can create new records"** — FALSE. Before Save flows can only update the triggering record's fields.
- **"Process Builder is the recommended tool for new automation"** — FALSE. Flow is. Process Builder is legacy.
- **"Screen flows run automatically when a record is saved"** — FALSE. Screen Flows require user interaction (a button click, a component load with user action).
- **"Record-Triggered Flows can only run Before Save"** — FALSE. They can run Before Save, After Save, or both.
- **"Auto-launched flows can show screens to users"** — FALSE. Screens are only in Screen Flows.

## Practice Questions

**Q:** An admin needs to automatically create a follow-up Task when an Opportunity stage changes to "Closed Won." Which flow type and mode should they use?
**A:** Record-Triggered Flow, After Save (because creating a Task record requires creating a new record — not just updating the triggering Opportunity).

**Q:** An admin needs to calculate a complex field value on the Opportunity record every time it's saved (not creating any other records). Which flow type and mode is most efficient?
**A:** Record-Triggered Flow, Before Save. This updates the triggering record's field without an extra DML operation, making it more efficient.

**Q:** A user needs to walk through a step-by-step questionnaire to create a new Account and related Contact. Which flow type should be used?
**A:** Screen Flow — it provides a user interface with multiple screens. It can be invoked via a button on a page.

**Q:** What is the difference between Before Save and After Save in a Record-Triggered Flow?
**A:** Before Save: runs before the record is committed to the database; can only update fields on the triggering record; no extra DML cost. After Save: runs after the record is committed; can create/update/delete any records and call Apex; updating the triggering record costs an extra DML operation.
