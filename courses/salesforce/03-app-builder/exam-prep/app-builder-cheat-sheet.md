# CRT-403 App Builder — Personal Cheat Sheet

**Dense reference for exam day review. One pass through this should refresh everything.**

---

## 1. Automation Tool Decision Matrix

| Tool | Use When | Limitations / Exam Traps |
|---|---|---|
| **Formula Field** | Display/calculate read-only value on a record; cross-object references (up to 5 levels) | Read-only — users can't edit; cannot aggregate across records; `&` not `+` for string concat; ISNULL unreliable on text |
| **Roll-Up Summary** | COUNT/SUM/MIN/MAX of child records (Master-Detail only, on master object) | Master-Detail ONLY — Lookup = use Flow; cannot reference formula fields on child |
| **Validation Rule** | Prevent saving when data is bad; TRUE = error fires | TRUE = error (not "validation passes"); use ISPICKVAL not `=` for picklists; doesn't prevent API writes unless FLS also set |
| **Before-Save RTF** | Update fields on the triggering record before DB write; 0 extra DML | Cannot create/update other records; cannot send email; no $Record__Prior |
| **After-Save RTF** | Create/update/delete other records; send emails; post-save logic | DML counts against limits; $Record__Prior available; can trigger other object's flows |
| **Screen Flow** | User-driven wizard; collect input; multi-screen process | Cannot auto-trigger; must be launched by user; cannot be called by Apex with screens |
| **Approval Process** | Formal human approve/reject; record locking during review | Record locked on submit; entry criteria failure = submission fails (no step rejection) |
| **Schedule-Triggered Flow** | Time-based batch processing on a schedule | Not real-time; runs against batches of 2,000 records |
| **Platform Event RTF** | React to integration event message | Requires Platform Event to be published; no direct record trigger |
| **Auto-launched Flow** | Reusable logic called by Apex/other Flows/API | No Screen elements; no trigger |
| **Apex Trigger** | Complex logic Flow can't handle; dynamic SOQL; HTTP callouts in same transaction | Last resort; requires test coverage; harder to maintain |
| **Workflow Rules** | LEGACY/DEPRECATED | Replace with Record-Triggered Flow |
| **Process Builder** | LEGACY/DEPRECATED | Replace with Record-Triggered Flow |

---

## 2. Relationship Types

| Type | Cascade Delete? | Roll-Up? | Child Required? | Max per Object | Key Fact |
|---|---|---|---|---|---|
| **Master-Detail** | YES | YES (on master) | YES | 2 | OWD = Controlled by Parent; enables junction objects |
| **Lookup** | NO (field cleared) | NO | NO (optional) | ~40 | Can be converted to MD if no null parents exist |
| **Hierarchical** | NO | NO | NO | 1 | User object only |
| **Junction (2xMD)** | YES (both parents) | YES (on both masters) | YES | N/A | Delete either parent → all junction records deleted |

**Limitations:**
- Cannot have 3+ Master-Detail relationships on one object
- Converting Lookup to MD fails if any child records have null parent
- Roll-Up cannot reference formula fields on child records

---

## 3. Flow Types Quick Reference

| Type | Triggered By | Before/After Save | $Record__Prior? | Can have Screens? |
|---|---|---|---|---|
| RTF Before-Save | Record create/update | Before DB write | NO | NO |
| RTF After-Save | Record create/update/delete | After commit | YES | NO |
| Screen Flow | User action | N/A | N/A | YES |
| Schedule-Triggered | Time/date schedule | N/A | N/A | NO |
| Platform Event | Platform Event published | N/A | N/A | NO |
| Auto-launched | Apex / Flow / REST API | N/A | N/A | NO |

**Order of execution on record save:**
System Validations → Apex Before → Validation Rules → Duplicate Rules → **Before-Save Flows** → DB Write → **After-Save Flows** → Apex After → Workflow

**Limitations per flow type:**
- Before-Save: field updates on triggering record ONLY; no other DML; no emails
- Auto-launched: no Screen elements; no pause
- Schedule-Triggered: runs in 2,000 record batches; scheduled paths re-evaluate conditions at run time
- One active version per Flow at a time

---

## 4. Security Model Layers (Additive Only)

```
OWD (most restrictive baseline)
  + Role Hierarchy (upward visibility, automatic)
  + Sharing Rules (horizontal expansion, ownership or criteria-based)
  + Manual Sharing (ad hoc, lost when owner changes)
= User's effective record access
```

| OWD Setting | Who Sees the Record |
|---|---|
| Public R/W | All users |
| Public Read Only | All users (edit by owner/above only) |
| Private | Owner + roles above + Sys Admin |
| Controlled by Parent | Inherits master record's OWD (MD only) |

**FLS vs. Page Layout:**
- FLS: enforced everywhere (UI, API, reports) — the real security control
- Page Layout: UI-only — removing a field from layout doesn't hide it from API
- New custom fields: hidden for all profiles by default (except Sys Admin)

---

## 5. Sandbox Types

| Type | Storage | Refresh | Data |
|---|---|---|---|
| Developer | 200MB | Daily | No prod data |
| Developer Pro | 1GB | Daily | No prod data |
| Partial Copy | 5GB | 5 days | Sample of prod |
| Full | Full copy | 29 days | Full prod copy |

**Limitations:**
- Sandbox refresh wipes all sandbox customizations
- Full sandbox = 29-day minimum between refreshes (no daily refresh possible)
- Preview instance sandboxes get Salesforce releases 4–6 weeks before production

---

## 6. Deployment

| Method | Rollback? | Version Control? | AppExchange? | Namespace? |
|---|---|---|---|---|
| Change Sets | No | No | No | No |
| Unmanaged Package | No (uninstall+reinstall) | No | No | No |
| Managed Package | Upgrade to new version | 2GP: Yes | YES | Required |
| Unlocked Package | Install prior version | Yes (DX) | No | Optional |
| Salesforce CLI (sf deploy) | Re-deploy from git | Yes | No | Optional |

**Change Set facts:**
- Outbound in source org; inbound in target org
- Deployment connection authorized in TARGET org
- Validate = dry run, no changes; passes = 10-day Quick Deploy window
- 75% Apex coverage required if ANY Apex in the change set (org-wide metric)
- Declarative-only change sets: no coverage requirement

**Package facts:**
- Managed: obfuscated Apex, upgradeable, namespace `ns__ComponentName__c`
- Unmanaged: no upgrade path (uninstall+reinstall); no namespace
- Unlocked: visible code, upgradeable, no namespace required; not AppExchange
- Uninstall any package = data in package custom objects DELETED
- AppExchange security review: mandatory for all public listings

---

## 7. Lightning App Builder

| Page Type | Record Context? | Key Components Available |
|---|---|---|
| App Page | No | Report Chart, Dashboard, Recent Items, Rich Text, Flow |
| Record Page | YES | + Related List, Chatter, Record Form, Highlights Panel |
| Home Page | No | Report Chart, Dashboard, Tasks, News, Flow |

**Activation hierarchy (most specific wins):**
Org Default → App Default → Profile → **App + Profile + Record Type** (most specific)

**Dynamic Forms:** fields become independent components with visibility rules; replaces multiple page layouts; FLS still enforces security.

**Dynamic Actions:** control button visibility in Highlights Panel by conditions; Record Pages only.

**Component visibility conditions:** Field Value / Profile / Form Factor (Desktop vs. Mobile) / Custom Permission

---

## 8. Record Types, Page Layouts, Compact Layouts

**Record Type controls 3 things:**
1. Business Process (only Opportunity/Lead/Case/Solution)
2. Page Layout Assignment (per Profile + RecordType)
3. Picklist Value Filtering

**Business Process objects (4 only):** Opportunity (Stage) / Lead (Status) / Case (Status) / Solution (Status)

**Compact Layout surfaces (4):** Highlights Panel / Kanban cards / Lookup hover cards / Mobile summaries

**Required on layout vs. field definition:**
- Layout required: UI only — API (Data Loader) bypasses it
- Field definition required: everywhere including API

---

## 9. Data Management Tools

| Feature | Data Import Wizard | Data Loader |
|---|---|---|
| Max records | 50,000 | 5,000,000 |
| Interface | Browser | Desktop app |
| All objects? | No (select objects) | Yes |
| Delete/Hard Delete? | No | Yes |
| Bypass duplicate rules? | No | YES |
| Bypass validation rules? | No | No |
| Upsert (External ID)? | Yes | Yes |

**External ID:** custom field with External ID checkbox = unique key from external system; enables upsert (insert-if-new, update-if-match).

---

## 10. Formula Functions — Quick Reference

| Function | When to Use |
|---|---|
| `IF(c, t, f)` | Two-branch conditional |
| `CASE(v, v1, r1, ..., else)` | Switch on discrete values |
| `BLANKVALUE(f, default)` | Null safety — return default if blank |
| `ISBLANK(f)` | Is field empty? — ALL types including text |
| `ISNULL(f)` | Is field null? — numbers/dates ONLY (not text) |
| `ISPICKVAL(f, v)` | Picklist = value — never use `=` on picklists |
| `ISCHANGED(f)` | Did this field change? (validation rules only) |
| `ISNEW()` | Record being created (not updated)? |
| `PRIORVALUE(f)` | Value before this save (update context only) |
| `TEXT(v)` | Convert number/date/picklist to text |
| `VALUE(t)` | Convert text to number |
| `TODAY()` | Current date (Date type) |
| `NOW()` | Current date+time (DateTime type) |
| `DATEVALUE(dt)` | Strip time from DateTime → Date |
| `&` | String concatenation (NOT `+`) |
| `NOT(c)` | Negate boolean |

---

## 11. Approval Process

**5 components:** Entry Criteria / Submission Actions / Approval Steps / Recall Actions / Final Actions

**Approver types:** Assigned User / Related User (field on record) / Queue / Apex

**Step types:** Sequential (one at a time) vs. Parallel (simultaneous)

**Parallel vote:** Unanimous (all must approve) vs. First Response (first vote wins)

**Record locking:** default on submission; only Sys Admin and approver can edit locked records

**Per-step actions ≠ Final Actions:** step approval fires when that step is approved; final actions fire when the entire process completes.

---

## 20 Exam Traps (The Most Tested)

1. **TRUE = error in validation rules.** Write the bad-data condition.
2. **Roll-Up Summary = Master-Detail only.** Lookup relationship → use Flow.
3. **ISBLANK for text, ISNULL for numbers/dates.** ISNULL on text always returns false.
4. **`&` for string concat, not `+`.** Using `+` with text causes a type error.
5. **Before-Save = field updates on triggering record only.** No related records, no emails.
6. **After-Save = full DML, $Record__Prior available.**
7. **Validation rules fire before Before-Save Flows.** Flows never run if validation blocks the save.
8. **Screen Flows cannot auto-trigger.** Must be launched by user action.
9. **New fields hidden by default** for all profiles except Sys Admin.
10. **Page layout required ≠ API required.** Data Loader bypasses layout-required fields.
11. **Deployment connection in TARGET org.** Source org creates change set; target authorizes.
12. **Validate = dry run.** No changes committed; 10-day Quick Deploy window opened.
13. **75% coverage = org-wide.** Not just the code in your change set.
14. **Full sandbox = 29-day refresh.** Cannot refresh daily.
15. **Only managed packages on AppExchange.** Unmanaged and unlocked cannot be listed.
16. **Uninstall = data deleted.** All records in package custom objects are gone.
17. **Most specific activation wins.** App+Profile+RecordType beats Org Default.
18. **Dynamic Forms ≠ FLS.** Hiding a section doesn't secure the field — FLS does.
19. **Business Processes: 4 objects only.** Opp/Lead/Case/Solution. Not Account/Contact.
20. **Compact Layout = 4 surfaces.** Highlights Panel + Kanban + Hover + Mobile.
