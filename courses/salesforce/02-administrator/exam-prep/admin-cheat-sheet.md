# Salesforce Administrator Exam Cheat Sheet (CRT-101)

> Quick-reference tables and key facts. Use during final review, not as a substitute for studying the lectures.

---

## 1. Security Model — The Stack

```
┌─────────────────────────────────────────────────────────────┐
│                  OBJECT-LEVEL SECURITY                       │
│  Profile / Permission Set: CRUD on each object               │
├─────────────────────────────────────────────────────────────┤
│                  FIELD-LEVEL SECURITY                        │
│  Profile / Permission Set: Read/Edit per field               │
├─────────────────────────────────────────────────────────────┤
│                RECORD-LEVEL ACCESS                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. OWD (Organization-Wide Defaults) — FLOOR          │   │
│  │ 2. Role Hierarchy — opens up ABOVE OWD               │   │
│  │ 3. Sharing Rules — grant access to groups/roles      │   │
│  │ 4. Manual Sharing — record-by-record access grant    │   │
│  │ 5. Teams (Account/Opportunity Teams)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Rule:** Record-level security only opens access UP from OWD. It NEVER restricts below OWD.

---

## 2. Organization-Wide Defaults (OWD) Settings

| OWD Setting | What It Means |
|-------------|---------------|
| **Private** | Only record owner + their managers in role hierarchy can see/edit. Most restrictive. |
| **Public Read Only** | All users can view; only owner + managers can edit. |
| **Public Read/Write** | All users can view and edit. |
| **Public Read/Write/Transfer** | All users can view, edit, and change owner (Leads/Cases only). |
| **Controlled by Parent** | Child record access follows parent record's access (Master-Detail). |

**Default OWDs for standard objects:**
- Leads: Public Read/Write
- Accounts: Public Read/Write
- Contacts: Controlled by Parent (if related to Account) or Public Read/Write
- Opportunities: Public Read/Write (but often changed to Private)
- Cases: Public Read/Write

---

## 3. Profile vs. Permission Set vs. Role

| Concept | Purpose | Grants | Restricts |
|---------|---------|--------|-----------|
| **Profile** | Baseline permissions; every user has exactly one | Object CRUD, FLS, app access, login hours | Can restrict (e.g., no Create on Accounts) |
| **Permission Set** | Supplemental permissions; user can have many | Adds to profile permissions | Never restricts — only adds |
| **Role** | Controls record visibility (who sees whose records) | Record access up the hierarchy | N/A — roles are about visibility, not permissions |

---

## 4. Sharing Rules — Types

| Type | Description |
|------|-------------|
| **Owner-Based Sharing Rule** | Share records owned by a group/role with another group/role |
| **Criteria-Based Sharing Rule** | Share records that meet field criteria (e.g., Region = "West") with a group/role |
| **Guest User Sharing Rule** | Share records with unauthenticated (guest) users on Experience Cloud sites |

**Sharing rules can only GRANT access — they cannot restrict access below OWD.**

Access levels available in sharing rules: Read Only or Read/Write (never Full Access).

---

## 5. Automation Tools Comparison

| Feature | Validation Rule | Workflow Rule | Process Builder | Record-Triggered Flow | Approval Process |
|---------|----------------|---------------|-----------------|----------------------|-----------------|
| **Status** | Current | Legacy | Legacy | Current | Current |
| **Trigger** | On Save | On Save | On Save | Create/Update/Delete | Manual Submit |
| **Before Save** | Yes (blocks save) | No | No | Yes (optimized) | N/A |
| **Field Updates** | N/A (blocks save) | Yes | Yes | Yes | Yes |
| **Email Alerts** | No | Yes | Yes | Yes | Yes |
| **Create Records** | No | No | Yes | Yes | No |
| **Human Decision** | No | No | No | No | Yes (required) |
| **Time-Based** | No | Yes (Time Triggers) | Yes | Yes (Scheduled Paths) | No |
| **Cross-Object Update** | No | Parent only | Yes | Yes | Yes |
| **Loop/Iterate** | No | No | No | Yes | No |
| **User Interface** | Error message | No | No | Yes (Screen Flow) | Approval email |
| **When to Use** | Data validation | Simple legacy automation | Simple legacy automation | All new automation | Human review required |

---

## 6. Data Tools Comparison

| Feature | Data Import Wizard | Data Loader | Data Export | Report Export |
|---------|-------------------|-------------|-------------|---------------|
| **Max Records** | 50,000 | 5,000,000 | All records | ~100,000 |
| **Supported Objects** | Accounts, Contacts, Leads, Solutions, Campaign Members, Custom Objects | All objects | All objects | Report's objects |
| **Insert** | Yes | Yes | N/A | N/A |
| **Update** | Yes | Yes | N/A | N/A |
| **Upsert** | No | Yes (with External ID) | N/A | N/A |
| **Delete** | No | Yes | N/A | N/A |
| **Hard Delete** | No | Yes | N/A | N/A |
| **Export** | No | Yes (SOQL) | Yes (all data) | Yes (filtered) |
| **Schedule/Automate** | No | Via CLI | Yes (weekly/monthly) | Yes (subscribe) |
| **Installation** | None (browser) | Required (desktop app) | None (Setup) | None (browser) |
| **Batch Size** | Automatic | Configurable (default 200) | N/A | N/A |
| **External ID Support** | Partial | Full | N/A | N/A |

**Key Decision Rule:**
- Object not supported by Wizard OR volume > 50K → Data Loader
- Need upsert or hard delete → Data Loader
- Full org backup → Data Export
- Specific filtered subset → Report Export

---

## 7. Sandbox Types

| Sandbox Type | Storage | Data Copy | Refresh Interval | Use Case |
|-------------|---------|-----------|-----------------|----------|
| **Developer** | 200 MB | None | 1 day | Development, unit testing |
| **Developer Pro** | 1 GB | None | 1 day | Larger development projects |
| **Partial Copy** | 5 GB | Sample (template-based) | 5 days | Integration testing, UAT |
| **Full** | Same as Production | Complete copy | 29 days | Performance testing, final pre-release |

**Refresh destroys all existing sandbox data — back up work before refreshing.**

---

## 8. Report Types Comparison

| Format | Groupings | Dashboard Support | Best For |
|--------|-----------|------------------|----------|
| **Tabular** | None | Table component only | Flat lists, exports, mailing lists |
| **Summary** | Row groupings (up to 3) | Full (all component types) | Subtotals, pipeline by stage, cases by owner |
| **Matrix** | Row + Column (up to 2 each) | Full | Pivot tables, cross-dimensional analysis |
| **Joined** | Multiple blocks (up to 5) | Limited (table only) | Compare two unrelated datasets |

**Critical:** Tabular reports cannot be used for chart/gauge/metric dashboard components.

---

## 9. Custom Report Types

| Setting | Detail |
|---------|--------|
| Max objects | 4 (1 primary + 3 related) |
| "Must have" | Only primary records WITH related children appear |
| "May or may not have" | All primary records appear (children blank if absent) |
| Deployment Status | Must be "Deployed" for users to see it ("In Development" = hidden) |
| Custom objects | NO auto-creation — admin must build custom report type |

---

## 10. Dashboard Quick Reference

| Feature | Key Fact |
|---------|---------|
| Max components per dashboard | 20 |
| Max dashboard filters | 3 |
| Dynamic dashboard limit: Professional | 5 |
| Dynamic dashboard limit: Enterprise/Unlimited | 10 |
| Static running user | All viewers see running user's data |
| Dynamic dashboard | Each viewer sees their own data |
| Data freshness | Cached from last refresh (up to 24 hrs) — NOT real-time |
| Permission to view | "Run Reports" + Dashboard folder Viewer access |
| Component needing groupings | Charts, Gauges, Metrics (require Summary/Matrix report) |

---

## 11. All Salesforce Field Types

| Category | Field Types |
|----------|-------------|
| **Text** | Text, Text Area, Long Text Area, Rich Text Area, Email, Phone, URL |
| **Number** | Number, Currency, Percent |
| **Date/Time** | Date, Date/Time, Time |
| **Selection** | Picklist, Multi-Select Picklist |
| **Boolean** | Checkbox |
| **Relationship** | Lookup Relationship, Master-Detail Relationship, External Lookup, Indirect Lookup |
| **Calculated** | Formula, Roll-Up Summary |
| **Auto** | Auto Number |
| **Special** | Geolocation, Encrypted Text (Shield), External ID (attribute, not a type) |

**External ID:** Not a field type — it's a checkbox attribute on Text, Number, Email, or Auto Number fields.

---

## 12. Object Relationship Quick Reference

| Relationship Type | Parent Deleted | Roll-Up Summary | OWD | Notes |
|------------------|---------------|-----------------|-----|-------|
| **Master-Detail** | Cascade deletes child | Yes (on master) | Child follows parent | Tight coupling; required field |
| **Lookup** | Child remains (lookup goes blank) | No | Independent | Loose coupling; optional or required |
| **Many-to-Many** | Depends on each M-D leg | On each master | Per relationship | Uses junction object with two M-D |
| **Self-Relationship** | N/A | N/A | N/A | Object related to itself (e.g., Account hierarchy) |

---

## 13. Validation Rules — Key Functions

| Function | Syntax | Use For |
|----------|--------|---------|
| ISBLANK | `ISBLANK(Field)` | Text fields — TRUE if empty |
| ISNULL | `ISNULL(Field)` | Number/Date — TRUE if null |
| ISPICKVAL | `ISPICKVAL(Field, "Value")` | Picklist comparison |
| ISCHANGED | `ISCHANGED(Field)` | TRUE if field was modified |
| ISNEW | `ISNEW()` | TRUE on record creation only |
| LEN | `LEN(Field)` | Character count |
| CONTAINS | `CONTAINS(Field, "text")` | TRUE if field contains string |
| NOT | `NOT(condition)` | Reverses TRUE/FALSE |
| AND | `AND(cond1, cond2)` | Both must be TRUE |
| OR | `OR(cond1, cond2)` | Either must be TRUE |
| TODAY | `TODAY()` | Current date |
| NOW | `NOW()` | Current date + time |

**Remember:** Validation rule formula returning TRUE = ERROR (blocks save).

---

## 14. Approval Process Action Sets

| Action Set | When It Fires | Common Actions |
|-----------|---------------|----------------|
| **Initial Submission** | When record is submitted for approval | Lock record, email approver |
| **Approval** | When all required approvers approve | Update status to Approved, email submitter |
| **Rejection** | When an approver rejects | Update status to Rejected, email submitter, unlock record |
| **Recall** | When submitter recalls the record | Unlock record, reset fields |

**Approver Options:** Manager of submitter, specific user, queue, or let submitter choose.

**Delegated Approver:** Set by each user in their personal settings as backup when unavailable.

---

## 15. Flow Types — Quick Reference

| Flow Type | Trigger | UI? | Use Case |
|-----------|---------|-----|----------|
| **Screen Flow** | User-initiated | Yes (screens) | Guided wizards, data entry, self-service |
| **Record-Triggered (Before-Save)** | Record Create/Update/Delete | No | Update triggering record's own fields |
| **Record-Triggered (After-Save)** | Record Create/Update/Delete | No | Create/update related records, call services |
| **Schedule-Triggered** | Time schedule | No | Batch processing, nightly cleanup, time-based actions |
| **Auto-launched** | Called by Apex/Flow/REST | No | Reusable utility logic |
| **Platform Event-Triggered** | Platform Event message | No | Event-driven integrations |

---

## 16. Change Set Key Facts

| Fact | Detail |
|------|--------|
| What it moves | Metadata (configuration) only — NOT data |
| Direction | Sandbox → Production, Sandbox → Sandbox |
| Dependency management | MANUAL — must add all dependencies yourself |
| Rollback | NOT supported — manual reversal required |
| Outbound Change Set | Built in source org; uploaded to target |
| Inbound Change Set | Received in target org; must be validated + deployed |
| Validate button | Runs all checks WITHOUT deploying — catches errors safely |
| Deployment Connections | Must be configured in Setup → Deployment Settings |

---

## 17. Exam-Day Tips

1. **TRUE = Error in Validation Rules** — The most commonly missed concept. If the formula returns TRUE, the save is blocked.
2. **Standard Rules are Inactive** — Standard duplicate rules for Leads/Contacts/Accounts must be ACTIVATED.
3. **Custom Report Types not auto-created** — You must build them manually for custom objects.
4. **Before-Save vs. After-Save** — Before-Save: update triggering record's fields only. After-Save: everything else.
5. **Tabular reports can't source chart dashboard components** — Use Summary or Matrix for charts.
6. **Data Import Wizard object limitations** — Accounts, Contacts, Leads, Solutions, Campaign Members, Custom only.
7. **50K record limit** — Data Import Wizard max is 50,000. Above that: Data Loader.
8. **Refresh destroys sandbox** — All sandbox-specific work is lost on refresh.
9. **Change sets don't auto-include dependencies** — Always click View/Add Dependencies.
10. **Role hierarchy = visibility, Profile = permissions** — Roles don't grant object CRUD. Profiles/Permission Sets do.
11. **Dynamic dashboard limit** — Professional: 5, Enterprise/Unlimited: 10.
12. **Merge: 3 records max** — Standard merge tool handles up to 3 records at a time for Accounts/Contacts/Leads.
13. **Workflow is legacy** — Know it for the exam; build new automation in Flow.
14. **ISCHANGED in workflow criteria** — Works in workflow formula criteria; does NOT work in standard formula fields.
15. **Sandbox refresh intervals** — Developer: 1 day, Partial: 5 days, Full: 29 days.
