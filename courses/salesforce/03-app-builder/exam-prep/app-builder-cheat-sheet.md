# CRT-403 App Builder Cheat Sheet

**Salesforce Certified Platform App Builder — Quick Reference**

---

## 1. Automation Tool Decision Matrix

| Tool | Use When | Cannot Do | Replaces / Notes |
|---|---|---|---|
| **Validation Rule** | Prevent saving a record when data doesn't meet criteria | Cannot update fields, send emails, or create records | Still current — not deprecated |
| **Formula Field** | Display a calculated read-only value on a record; cross-object references | Cannot write/store a value that changes independently of the formula; ISNULL on text always false | Still current — not deprecated |
| **Roll-Up Summary** | Count, sum, min, or max values from child records (Master-Detail only) | Cannot span Lookup relationships; cannot use date arithmetic as the roll-up itself | Only on Master side of Master-Detail |
| **Before-Save Flow** | Derive/update fields on the triggering record efficiently before commit (no DML cost) | Cannot create/update/delete other records; cannot send emails; no record ID for new records before insert | Fastest automation for self-field updates |
| **After-Save Flow** | Create/update/delete related records, send emails, call Apex, publish platform events | Cannot update triggering record fields without a separate DML (causes re-trigger risk) | Use "Recursion" guard if updating triggering record |
| **Screen Flow** | Collect user input through a guided wizard; multi-step forms; launched by button/action | Cannot run autonomously; requires user interaction | Launch via Quick Action, button, or embedded in App Builder |
| **Scheduled Flow** | Run batch automation at a specified time/frequency (e.g., nightly updates, reminders) | Cannot respond to real-time record events; no user interface | Replaces scheduled Apex for many use cases |
| **Approval Process** | Formal multi-step human approval workflows (Submit → Approve/Reject → Final outcome) | Cannot run without a human approver decision; limited conditional branching | No direct replacement — unique for human-in-the-loop |
| **Platform Event Flow** | React to a published platform event message (event-driven architecture) | Cannot be triggered by record changes directly; requires a platform event to be published | Enables event-driven integrations |
| **Apex Trigger** | Complex logic that Flow cannot handle; bulkified cross-object operations; callouts in transactions | Requires developer; harder to maintain | Last resort after exhausting declarative options |
| **Workflow Rules** | ~~Send email alerts, update fields, outbound messages on record save~~ | ~~Cross-object field updates only 1 level deep; no user interaction~~ | **DEPRECATED** — Replaced by Record-Triggered Flow |
| **Process Builder** | ~~Multi-criteria automation with multiple actions~~ | ~~Complex logic; performance issues at scale~~ | **DEPRECATED** — Replaced by Record-Triggered Flow |

---

## 2. Relationship Types Comparison

| Relationship | Parent Delete Behavior | Lookup Filter Supported | Roll-Up Summary Available | Is Child Required? | Max per Object |
|---|---|---|---|---|---|
| **Master-Detail** | Cascade delete — all child records deleted with parent | Yes | Yes (on master object) | Yes — child cannot exist without parent | 2 Master-Detail fields per custom object |
| **Lookup** | Parent deleted; child lookup field cleared (or blocked if "Required" + restrict delete configured) | Yes | No — use Flow instead | No — lookup field is optional by default (can be made required) | 40 total relationship fields (combined) |
| **Hierarchical** | Standard Lookup behavior (no cascade) | No | No | No | 1 — only on User object |
| **Many-to-Many (Junction)** | Cascade delete if junction object uses Master-Detail to both parents; depends on configuration | Yes (on junction) | Yes (on both parent masters via junction) | Yes for Master-Detail sides | Achieved via a junction object with 2 Master-Detail fields |

**Key facts:**
- A custom object can have **at most 2** Master-Detail relationships.
- Roll-Up Summary fields are created on the **master** and summarize **detail** records.
- Standard object relationships (e.g., Account-Case, Account-Contact) are Lookup — no native roll-up available without Flow.

---

## 3. Flow Types Reference

| Flow Type | Triggered By | Common Use Case | Can Update Triggering Record? |
|---|---|---|---|
| **Record-Triggered Flow (Before-Save)** | A record being created or updated, runs before the record is written to DB | Derive field values, auto-calculate, set defaults without extra DML | Yes — directly via {!$Record} assignments (no DML needed) |
| **Record-Triggered Flow (After-Save)** | A record being created, updated, or deleted, runs after the record is committed | Create related records, send emails, update other objects, call Apex | Yes — but requires an explicit Update Records element (watch for recursion) |
| **Screen Flow** | User interaction (button click, Quick Action, embedded in App Builder) | Guided wizards, data collection forms, multi-step processes | Yes — via Update Records element |
| **Scheduled Flow** | Date/time trigger (scheduled start + optional recurrence) | Nightly batch jobs, sending reminders, archiving old records | No triggering record — operates on retrieved record collections |
| **Autolaunched Flow (No Trigger)** | Called by another flow, Apex code, REST API, or Process Builder | Sub-flow logic reuse, API-invoked automation | Depends on what records are passed into it |
| **Platform Event-Triggered Flow** | A Platform Event message being published | Event-driven integrations, real-time cross-system reactions | No — operates on event data, not a record context |

**Before-Save vs After-Save Decision Guide:**
- Use **Before-Save** when: updating fields on the same record, no other records need to change, performance matters.
- Use **After-Save** when: creating/updating/deleting related records, sending emails, calling Apex, publishing platform events.

---

## 4. Deployment Methods Comparison

| Method | Best For | Rollback | Version Control Friendly | Apex Test Requirement |
|---|---|---|---|---|
| **Change Sets** | Sandbox-to-production migrations without developer tooling; admin-driven deployments | Manual — must redeploy old version; no built-in rollback | No — metadata must be re-retrieved; not source-tracked | Yes — 75% coverage required for Apex in production; Validate before Deploy recommended |
| **Unmanaged Package** | Sharing a one-time snapshot of metadata; templates or starter configurations | No version history; reinstall or manually remove | No — no versioning mechanism | Yes — 75% if Apex is included |
| **Managed Package** | ISV/AppExchange distribution; protecting IP; multi-customer upgrades | Upgrade by deploying new package version; cannot easily remove locked components | No native VCS; ISV manages versions internally | Yes — tests must pass during package upload |
| **Unlocked Package** | Modular internal deployment; team-based development; source-controlled releases | Deploy a previous package version; package can be deleted in non-production orgs | Yes — designed for Salesforce DX source-tracked projects | Yes — 75% for production deploys |
| **Salesforce DX / CLI (sf deploy)** | Developer-driven CI/CD pipelines; source tracking; large team development | Redeploy prior commit from VCS | Yes — purpose-built for source control (Git) integration | Yes — 75% coverage; all tests must pass |

**Key deployment facts:**
- Change Sets require a **Deployment Connection** to be established between orgs.
- Always **Validate** before deploying a change set — this runs tests without committing changes.
- Managed Packages **require a namespace prefix**.
- Unlocked Packages do **not** require a namespace.

---

## 5. Sandbox Types

| Type | Production Data Included | Storage (Config/Data) | Refresh Interval | Best For |
|---|---|---|---|---|
| **Developer** | No (metadata only) | 200 MB config / 200 MB data | 1 day | Individual developer builds; unit testing; quick experiments |
| **Developer Pro** | No (metadata only) | 1 GB config / 1 GB data | 1 day | Larger developer projects; integration testing with more data volume |
| **Partial Copy** | Yes — subset (up to 10,000 records per object based on sandbox template) | 5 GB config / 5 GB data | 5 days | QA testing with realistic (but not full) data sets |
| **Full** | Yes — complete copy of all production data and metadata | Same as production | 29 days | Final UAT, performance/load testing, regression testing before major releases |

---

## 6. Lightning App Builder Quick Reference

### Page Types

| Page Type | When to Use | Notes |
|---|---|---|
| **App Page** | Custom landing/home page within a Lightning App; tabs showing dashboards, reports, or custom components | Added as a tab in App Manager |
| **Record Page** | Customizing the layout for a specific object's record detail view | Can be activated for org, app, profile, or record type |
| **Home Page** | Customizing the standard Home tab for users | Can be activated org-wide or per profile |

### Activation Priority (lowest → highest)
1. **Org Default** — applies to all users with no more-specific override
2. **App Default** — applies to users of a specific app
3. **App + Profile** — applies to users of a specific app who have a specific profile
4. **Profile-Specific** — applies to all users with a specific profile regardless of app
5. **Record-Type-Specific** (for Record Pages) — applies to records of a specific record type

A more specific activation always overrides a less specific one. Profile-specific beats Org Default.

### Dynamic Forms
- **What it does:** Migrates field sections from the traditional page layout canvas into the Lightning App Builder, giving each field and section its own visibility rules.
- **When to use:** When you have multiple page layouts that exist solely to show/hide different fields for different users or conditions. Dynamic Forms consolidates them into one page with conditional visibility.
- **Limitation:** Currently supported on custom objects and select standard objects (Account, Contact, Opportunity, Lead, Case). Not available on all standard objects.

### Dynamic Actions
- **What it does:** Moves action buttons from the page layout into the Lightning App Builder, allowing visibility rules on each individual action button (show/hide based on field values, profile, etc.).
- **When to use:** When you want to show different action buttons to different users or under different record conditions without creating multiple page layouts.

---

## 7. Record Types vs Page Layouts vs Dynamic Forms

| Feature | Record Types | Multiple Page Layouts | Dynamic Forms |
|---|---|---|---|
| **Primary purpose** | Segment records into categories with different picklist values and layout assignments | Show different field arrangements, sections, and buttons to different users/roles | Show/hide individual fields and sections based on conditions without separate layouts |
| **When to use** | When different categories of the same object need different business processes, picklist values, or entirely different forms (e.g., Customer vs. Partner Accounts) | When different user profiles need a fundamentally different set of fields (combined with Record Types for segmentation) | When the only reason you have multiple layouts is to conditionally show/hide fields — Dynamic Forms replaces that complexity with one layout + visibility rules |
| **Requires Record Type?** | Record Types drive layout assignment per record category | Layouts are assigned via Record Type + Profile matrix | No — Dynamic Forms visibility rules work at the field/section level, independent of record types |
| **Picklist value control** | Yes — each Record Type defines its own active picklist values | No — layouts don't control picklist values | No |
| **Replaces other feature?** | No | Dynamic Forms can reduce the number of layouts needed | Reduces need for multiple page layouts for field visibility |

**Rule of thumb:** If different record categories need different picklist values → use Record Types. If the only goal is to show/hide fields based on data → use Dynamic Forms.

---

## 8. Key Salesforce Limits to Know

| Limit | Value | Notes |
|---|---|---|
| Custom objects per org (Enterprise Edition) | 200 custom objects (standard metadata limit for Enterprise) | Increases with add-ons; Unlimited Edition = 2,000 |
| Custom fields per object | 800 custom fields | Varies slightly by field type and indexing rules |
| Roll-Up Summary fields per object | 25 | Only on master side of Master-Detail relationships |
| Master-Detail relationships per custom object | 2 | Enables junction objects for many-to-many |
| Lookup relationships per object | 25 | Combined with other relationship fields |
| Field History Tracking fields per object | 20 (standard); up to 60 with Field Audit Trail add-on | Tracks old/new value, user, date |
| Validation rules per object | 500 | Practical limits are much lower for performance |
| Approval process steps | No hard limit | Each step can have multiple approvers |
| Flows per org | No hard limit | Governor limits apply at runtime (CPU time, queries, DML) |
| Apex code coverage for production deploy | 75% overall | Every test method must pass; no single class requirement (but best practice = 75% per class) |
| Sandbox refresh — Developer | 1 day | Requires re-configuration of features that don't copy |
| Sandbox refresh — Full | 29 days | Most restrictive; costly to refresh frequently |
| Data Import Wizard record limit | 50,000 records per import | Use Data Loader for larger volumes |
| Data Loader batch size | Up to 200 records per API call | Configurable; Default = 200 |
| List view records per page | 200 | Standard pagination limit |

---

## 9. Common Formula Functions Reference

| Function | Description | Example Usage |
|---|---|---|
| `ISBLANK(field)` | Returns TRUE if field is null or empty string. Works correctly on Text fields. | `ISBLANK(Description)` → TRUE if Description is empty |
| `ISNULL(field)` | Returns TRUE if field is null. **Does NOT work correctly on Text fields** (always returns false for text). Use for number, date, checkbox fields. | `ISNULL(Amount)` → TRUE if Amount has no value |
| `ISPICKVAL(field, "value")` | Returns TRUE if a picklist field equals the specified value | `ISPICKVAL(Stage, "Closed Won")` |
| `ISCHANGED(field)` | Returns TRUE if the field value has changed during the current save. **Only available in validation rules, workflow criteria, and flow conditions — NOT in standard formula fields.** | `ISCHANGED(Owner)` |
| `ISNEW()` | Returns TRUE if the record is being created for the first time (insert context) | Used in validation rules to skip checks on updates |
| `PRIORVALUE(field)` | Returns the value of a field before the current save. Same context restriction as ISCHANGED. | `PRIORVALUE(Status__c)` |
| `NOT(logical)` | Negates a boolean expression | `NOT(ISBLANK(Phone))` → TRUE if Phone has a value |
| `AND(cond1, cond2)` | Returns TRUE only if all conditions are true. Equivalent to `&&` operator. | `AND(ISBLANK(Email), ISPICKVAL(Status,"Active"))` |
| `OR(cond1, cond2)` | Returns TRUE if any condition is true. Equivalent to `\|\|` operator. | `OR(ISBLANK(Phone), ISBLANK(Email))` |
| `LEN(text)` | Returns the number of characters in a text string | `LEN(Description) > 500` |
| `CONTAINS(text, search)` | Returns TRUE if the text contains the search string (case-sensitive) | `CONTAINS(Name, "Test")` |
| `REGEX(text, pattern)` | Returns TRUE if text matches the regular expression pattern | `NOT(REGEX(Phone,"\\(\\d{3}\\) \\d{3}-\\d{4}"))` |
| `TODAY()` | Returns today's date (Date type) | `CloseDate < TODAY()` |
| `NOW()` | Returns current date and time (DateTime type) | `NOW() - CreatedDate > 2` (days old) |
| `DATEVALUE(datetime)` | Converts a DateTime to a Date | `DATEVALUE(CreatedDate)` |
| `TEXT(value)` | Converts a number, date, or picklist value to text | `TEXT(AnnualRevenue)` or `TEXT(Stage)` |
| `VALUE(text)` | Converts a text string to a number | `VALUE(ZipCode__c)` |
| `IF(condition, true_result, false_result)` | Returns one value if condition is true, another if false | `IF(Amount > 100000, "High Value", "Standard")` |
| `CASE(field, val1, result1, val2, result2, ..., else)` | Returns a different result based on the field's value — like a switch statement | `CASE(Rating, "Hot","High","Warm","Medium","Low")` |

---

## 10. Quick Action Types

### Object-Specific Quick Actions
- Created on a **specific object** (e.g., Account, Opportunity)
- Appear in the action bar on that object's **record pages**
- Automatically pre-populate related fields (e.g., creating a Contact from an Account pre-fills the Account lookup)

### Global Quick Actions
- Created at the org level (not tied to an object)
- Appear in the **global action bar** (available from any page, including Home)
- Cannot pre-populate parent record fields (no context record)

### Action Types

| Action Type | What It Does |
|---|---|
| **Create Record** | Opens a form to create a new record of a specified object type |
| **Update Record** | Opens a form to update fields on the current record |
| **Log a Call** | Creates a completed Task (call log) associated with the current record |
| **Custom (LWC)** | Launches a custom Lightning Web Component in a modal |
| **Custom (Visualforce)** | Launches a Visualforce page in a modal |
| **Send Email** | Opens the email composer to send an email from the record |
| **Flow** | Launches a Screen Flow from the action button |

**Where to add Quick Actions to a page:** Quick Actions must be added to the **Page Layout** (in the "Quick Actions in the Salesforce Mobile and Lightning Experience Actions" section) OR controlled via **Dynamic Actions** in the Lightning App Builder.

---

## 11. Key Exam Tips Summary

1. **Roll-Up Summary on Lookup = IMPOSSIBLE.** If a relationship is Lookup (not Master-Detail), you cannot create a Roll-Up Summary field. The answer is always: use a Record-Triggered Flow (After-Save) to maintain a counter/sum field instead.

2. **ISNULL on Text fields always returns FALSE.** For any Text, Text Area, or Long Text Area field, use `ISBLANK()`. ISNULL only works correctly on Date, Number, Checkbox, and Picklist fields.

3. **Validation rule fires when formula = TRUE.** Write the formula to represent the BAD condition. If you want to require a field, write `ISBLANK(Field__c)` — this is TRUE (= error) when the field is empty.

4. **Before-Save flows cannot perform DML on other objects.** Before-save flows are limited to updating the triggering record's fields. Any creation or update of other records requires an After-Save flow.

5. **Workflow Rules are LEGACY (deprecated).** Never recommend them as a new solution on the exam. The correct replacement is Record-Triggered Flow.

6. **Process Builder is LEGACY (deprecated).** Never recommend it as a new solution. The correct replacement is Record-Triggered Flow.

7. **Validate a change set before deploying.** Validation runs tests and checks without committing — best practice before any production deployment.

8. **Managed Packages require a namespace prefix.** Unmanaged and Unlocked Packages do not require a namespace.

9. **75% Apex coverage for production deployments.** This is the org-wide threshold. Individual classes don't each need 75%, but overall coverage must be at or above 75%.

10. **Dynamic Forms = field-level visibility without multiple page layouts.** If the question describes showing different fields to different users, Dynamic Forms (with component visibility rules) is the modern answer that avoids layout proliferation.

11. **Component Visibility in App Builder is NOT the same as Field-Level Security.** Component visibility rules conditionally show/hide components based on field values or user attributes. FLS completely removes access to a field at the profile level.

12. **Profile-specific App Builder activation overrides Org Default.** Activation priority: Org Default → App Default → App+Profile → Profile-Specific (highest wins).

13. **Change Sets need a Deployment Connection.** You cannot deploy a change set between two orgs that don't have an established deployment connection in Setup.

14. **Master-Detail cascade delete.** If a parent in a Master-Detail relationship is deleted, ALL child records are also deleted — automatically. Lookup relationships do NOT cascade delete.

15. **Full Sandbox refresh = 29 days.** Developer Sandbox refresh = 1 day. This is a common exam question about sandbox planning.

16. **Data Import Wizard limit = 50,000 records.** For anything larger, use Data Loader. Also, Data Loader supports upsert operations using External ID fields; the Wizard does not have native upsert.

17. **Hierarchical relationship is User-only.** No other standard or custom object can use a Hierarchical relationship type.

18. **A custom object can have max 2 Master-Detail relationships.** This limit enables the junction object pattern for many-to-many.

19. **ISCHANGED() and PRIORVALUE() require a save context.** These functions are only valid in validation rules, workflow criteria, and flow entry conditions — not in standard formula fields.

20. **Screen Flows require user interaction and cannot run automatically.** If the business process needs to run autonomously (without a user clicking something), use a Record-Triggered Flow or Scheduled Flow — not a Screen Flow.

---

*Last updated for CRT-403 exam objectives. Always verify against the latest Salesforce Exam Guide at trailhead.salesforce.com/credentials/platformappbuilder.*
