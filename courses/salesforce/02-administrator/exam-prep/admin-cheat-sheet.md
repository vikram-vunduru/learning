# Salesforce Admin Exam — Cheat Sheet

This is the everything-in-one-place reference. Read this the day before the exam.

---

## 1. Security Stack (The Floor-to-Ceiling Model)

```
WHAT YOU CAN DO (object/field access):
  Profile (1 per user, required) → Permission Sets (0+, additive only)
  Controls: Object CRUD, FLS, Apps, Login Hours, IP Ranges

WHAT YOU CAN SEE (record access):
  1. OWD (floor — most restrictive baseline)
  2. Role Hierarchy (managers see subordinates' records)
  3. Sharing Rules (criteria/owner-based groups, max 300/object)
  4. Manual Sharing (per-record grants by users)
  
  These only OPEN access, never RESTRICT below OWD.
```

**Limitations:** Permission Sets = additive only (can't remove Profile grants). Role hierarchy visibility = upward only. Manual shares persist after ownership changes.

---

## 2. OWD Settings

| Setting | Non-Owner Access |
|---|---|
| Private | None |
| Public Read Only | Read only |
| Public Read/Write | Read + Edit |
| Controlled by Parent | Follows parent record's access |

**Key:** OWD = floor; everything else opens it up. Setting OWD = Private + no role hierarchy = users only see their own records.

**Limitations:** Changing OWD triggers recalculation (can be slow on large orgs). External OWD (for Community users) is separate from internal OWD.

---

## 3. Profiles vs Permission Sets

| | Profile | Permission Set |
|---|---|---|
| Required? | Yes (1) | No (0+) |
| Can restrict? | Yes | No (additive only) |
| Login hours? | Yes | No |
| Login IP ranges? | Yes | No |
| Page layouts? | Yes | No |
| FLS? | Yes | Yes (additive) |
| Object CRUD? | Yes | Yes (additive) |

**Limitations:** Profiles going away (Salesforce roadmap); future = Minimum Access Profile + Permission Set Groups.

---

## 4. Org Types Summary

| Type | Sandbox? | Parent? | Refresh? | Use |
|---|---|---|---|---|
| Developer Edition | No | None | No | Personal learning |
| Scratch Org | No | None | Expires | CI/CD, DX |
| Developer Sandbox | Yes | Production | 1 day | Individual dev |
| Developer Pro Sandbox | Yes | Production | 1 day | Larger dev |
| Partial Copy Sandbox | Yes | Production | 5 days | Integration test |
| Full Sandbox | Yes | Production | 29 days | UAT, load test |

**Limitations:** Sandbox refresh destroys all sandbox data. Developer/Dev Pro = metadata only. Partial = sample data. Full = all data.

---

## 5. Automation Comparison

| Tool | Status | Can Branch? | Can Create Records? | Can Call Apex? |
|---|---|---|---|---|
| Workflow Rule | LEGACY | No | No (Task only) | No |
| Process Builder | LEGACY | Yes | Yes | Yes |
| Flow (Before Save) | Current | Yes | No | Limited |
| Flow (After Save) | Current | Yes | Yes | Yes |
| Flow (Screen) | Current | Yes | Yes | Yes |
| Approval Process | Current | N/A | No | No |

**Flow types:** Screen, Auto-launched, Record-Triggered, Scheduled, Platform Event-Triggered

**Workflow Rule actions (4):** Field Update, Email Alert, Task, Outbound Message

**Approval Process action sets (4):** Initial Submission, Approval, Rejection, Recall

**Limitations:** Before Save Flow = only update triggering record. After Save = extra DML cost. Workflow Rules = deprecated (no new rules in new orgs post Feb 2023).

---

## 6. Data Tools

| Tool | Objects | Max Records | Delete? | Hard Delete? | Browser? |
|---|---|---|---|---|---|
| Data Import Wizard | Accounts, Contacts, Leads, Solutions, Campaign Members, Custom | 50,000 | No | No | Yes |
| Data Loader | All | 5,000,000 | Yes | Yes | No (install) |
| Data Export | All (backup) | All | No | No | Yes |

**Upsert** = Insert OR Update based on External ID match

**Hard Delete** = permanent (bypasses Recycle Bin)

**Data Export download window = 48 hours**

**Limitations:** Import Wizard doesn't support Opportunities or Cases. Data Loader requires API access. Standard Matching Rules are inactive by default.

---

## 7. Sandbox Refresh Intervals

| Sandbox | Refresh Interval | Data? |
|---|---|---|
| Developer | 1 day | Metadata only |
| Developer Pro | 1 day | Metadata only |
| Partial Copy | 5 days | Metadata + sample |
| Full | 29 days | All data |

---

## 8. Report Types & Dashboard Rules

| Report Type | Groups | Charts | Dashboard |
|---|---|---|---|
| Tabular | None | None | Table only |
| Summary | Up to 3 row groups | Yes | All component types |
| Matrix | Up to 2 rows + 2 cols | Yes | All component types |
| Joined | Up to 5 blocks | Limited | Limited |

**Dashboard limits:** Max 20 components, max 3 filters
**Dynamic dashboards:** 10 (Enterprise/Unlimited), 5 (Professional)
**Running user:** Static = fixed user; Dynamic = each viewer's own data
**Dashboards don't refresh automatically** — manual or scheduled

**Limitations:** Tabular = no charts in dashboards (table component only). Dynamic dashboards have hard org-wide quantity limits.

---

## 9. Field Types Quick Reference

| Field | Stored? | Formula? | Roll-Up? | Key Note |
|---|---|---|---|---|
| Text | Yes | No | No | Max 255 chars |
| Long Text Area | Yes | No | No | Max 131,072 chars |
| Formula | No | Yes | No | Read-only, runtime calc |
| Roll-Up Summary | Yes | No | Yes (M-D only) | Max 25/object |
| Lookup | Yes | No | No | Optional, no cascade |
| Master-Detail | Yes | No | No | Required, cascade delete |
| Auto Number | Yes | No | No | Sequential, read-only |
| Checkbox | Yes | No | No | Always True/False, never blank |

---

## 10. Relationship Comparison

| | Lookup | Master-Detail |
|---|---|---|
| Required? | No | Yes |
| Cascade delete? | No (nulls field) | Yes |
| Roll-Up Summary? | No | On parent only |
| Child OWD | Independent | Controlled by Parent |
| Max per object | Many | 2 |

**Junction Object:** Two M-D relationships to create M:M

**Limitations:** Max 2 M-D per object. Max 25 Roll-Up Summary per M-D parent. Converting Lookup → M-D requires no null values in the field.

---

## 11. Validation Rule Logic

```
TRUE = BLOCK the save (error shown)
FALSE = ALLOW the save (proceed)

ISBLANK(field)      — works for all field types including text
ISNULL(field)       — legacy; use ISBLANK for text fields
ISPICKVAL(p, "v")  — checks if picklist equals value
ISCHANGED(field)   — true if field changed on THIS save
ISNEW()            — true if this is a new record insert
TODAY()            — current date
```

---

## 12. Formula Functions

```
IF(condition, true_val, false_val)
AND(a, b) / OR(a, b) / NOT(a)
TEXT(picklist)      — convert picklist to text
DATEVALUE(datetime) — extract date from datetime
LEN(text)          — length of text
LEFT/RIGHT(text,n) — substring
HYPERLINK(url, label)  — clickable link
CEILING/FLOOR(n)   — rounding

Cross-object formula:
  Standard: Account.Name
  Custom:   Account__r.Custom_Field__c
  (__r = relationship traversal, custom lookups)
```

---

## 13. Approval Process Key Facts

- 4 action sets: Initial Submission, Approval, Rejection, Recall
- Record is LOCKED while pending approval
- Recall = submitter withdraws; runs Recall Actions; unlocks record
- Rejection runs Rejection Actions and ENDS the process (no further steps)
- Approval Actions run only when ALL steps are approved (final approval)
- Delegated Approver = backup approver set in User record

---

## 14. Change Sets

- Metadata ONLY — no data
- Outbound = sending; Inbound = receiving
- Dependencies NOT auto-included (must add manually)
- Validate = test without applying; Deploy = apply changes
- No rollback once deployed
- Connection between orgs must be pre-authorized

---

## 15. Duplicate Management

- Matching Rules = HOW to detect duplicates
- Duplicate Rules = WHAT to do (Allow/Block/Report)
- Standard Matching Rules = INACTIVE by default (must activate)
- Merge: Accounts, Contacts, Leads only; max 3 at once
- Master record keeps its Salesforce ID; others go to Recycle Bin

---

## 16. Knowledge Articles

- Article lifecycle: Draft → In Review → Published → Archived
- API suffix: `__kav` (not `__c`)
- 4 channels: Internal App, Customer, Partner, Public Knowledge Base
- Data Categories: organize + control visibility (two purposes)
- Lightning Knowledge = 1 object + Record Types
- Classic Knowledge = separate objects per type (legacy)
- Archived ≠ deleted (record persists, just hidden from channels)

---

## 17. Key Numbers to Remember

| Number | What |
|---|---|
| 65% | Passing score (Admin exam) |
| 60 | Scored questions on exam |
| 105 min | Exam time |
| 200 | Enterprise Edition custom object limit |
| 2,000 | Unlimited Edition custom object limit |
| 500 | Custom fields per object |
| 2 | Max Master-Detail per object |
| 25 | Max Roll-Up Summary per M-D parent |
| 300 | Max sharing rules per object |
| 50,000 | Data Import Wizard max records |
| 5,000,000 | Data Loader max records |
| 500 | Web-to-Lead daily limit |
| 5,000 | Web-to-Case daily limit |
| 48 hours | Data Export download window |
| 3 | Max records per merge |
| 20 | Max dashboard components |
| 3 | Max dashboard filters |
| 10 | Max dynamic dashboards (Enterprise/Unlimited) |
| 5 | Max dynamic dashboards (Professional) |
| 29 days | Full sandbox minimum refresh interval |
| 1 day | Developer sandbox minimum refresh interval |
| 131,072 | Long Text Area max characters |
| 255 | Text field max characters |
| 4 | Max objects in Custom Report Type |

---

## 18. Exam Day Traps (The Most-Tested Wrong Answers)

1. **Developer Edition = sandbox** — FALSE; no parent org, can't refresh
2. **Permission Sets can restrict access** — FALSE; additive only
3. **Tabular reports work for dashboard charts** — FALSE; table only
4. **Roll-Up Summary on Lookup relationships** — FALSE; M-D parent only
5. **ISNULL works for text fields** — FALSE; use ISBLANK
6. **Validation rule TRUE = allow** — FALSE; TRUE = block
7. **Standard Matching Rules active by default** — FALSE; must activate
8. **Change Sets include data** — FALSE; metadata only
9. **Sandbox refresh preserves sandbox data** — FALSE; destroys it
10. **Profile login hours in Permission Set** — FALSE; Profile only
11. **Role hierarchy visibility flows downward** — FALSE; upward only
12. **Formula fields are stored in the database** — FALSE; runtime calculation
13. **Page layout removal = security** — FALSE; FLS = Not Visible for true security
14. **Person Accounts can be disabled** — FALSE; irreversible
15. **Multiple active assignment rules per object** — FALSE; one at a time
