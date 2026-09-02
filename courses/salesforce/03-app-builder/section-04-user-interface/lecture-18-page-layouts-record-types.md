# L18: Page Layouts, Record Types & Business Processes

## Exam Domain
User Interface — 17% of exam weight

---

## Core Concepts

### Page Layouts
Page layouts control what users see when viewing or editing a record — which fields appear, where they appear, which related lists are shown, and which Quick Actions are in the action bar. Page layouts are assigned to users via **Profile + Record Type** combination. One profile can have different layouts for different record types. This is the traditional (pre-Dynamic Forms) way to differentiate the record UI per user type.

### Record Types
Record Types are the key mechanism for differentiating the Salesforce experience per business segment within the same object. A Record Type does three things: (1) Controls which **Business Process** applies (Lead, Opportunity, Case, or Solution stage/status picklist), (2) Assigns a specific **Page Layout** (users with this record type see this layout), (3) Filters **Picklist values** — you can restrict which picklist values are available for records of this type. Record Types are assigned to profiles.

### Business Processes
Business Processes can only be defined for four objects: **Opportunity** (Sales Process — controls Stage values), **Lead** (Lead Process — controls Status values), **Case** (Support Process — controls Status values), and **Solution** (Solution Process). A Business Process is a subset of the full picklist — you select which values from the master picklist apply to this process. A Record Type is then linked to a Business Process. This is how different Opportunity Stages appear for Commercial vs. Enterprise deal pipelines.

### Compact Layouts
Compact Layouts define which fields appear in the record's **Highlights Panel** (the top of the record page), **Kanban view** cards, **Lookup hover cards** (when you hover over a linked record), and **mobile app** record summaries. The first 4–7 fields on the compact layout are displayed. The default compact layout shows only the Name field — you almost always need to customize it. Assigned via Record Type and Profile, similar to page layouts.

### Page Layout Required vs. Field-Level Required
A field can be marked required in two places: (1) **Required on the Page Layout** — enforced in the UI only; API tools (Data Loader, Apex) can bypass it. (2) **Required at the field definition level** (via "Required" checkbox in field settings) — enforced everywhere including API. If compliance requires the field to be populated, set it required at the field level, not just the layout.

---

## PTA / SA Relevance

**Record Types vs. Dynamic Forms:** The traditional model was: 1 Record Type = 1 Page Layout = 1 set of picklist values. For 5 business segments, you'd have 5 record types × 5 profiles × 5 layouts = a sprawling matrix. Dynamic Forms with component visibility rules can consolidate many layouts into one, significantly reducing this matrix. Modern implementations should evaluate whether Dynamic Forms can replace multiple record-type-driven layouts.

**Business Process governance:** Opportunity Stage values are global — adding a new stage adds it to ALL Sales Processes. If one team needs a stage that others shouldn't see, use a separate Business Process + Record Type for that team. Stage governance (who can add stages, what they mean for forecasting) is one of the most common CRM architecture issues.

**Compact Layout strategy:** Compact Layouts are frequently overlooked in implementations. But in mobile-heavy organizations, the highlights panel and the mobile record summary are the primary user experience. Design compact layouts with the user's most-needed fields first — not the most "important" fields from a data model perspective.

**Profile-to-Record-Type assignment:** Every profile must have at least one Record Type assigned per object (or use the "Master" default). If you have 10 Record Types but only assign 3 to a profile, users with that profile can only see/create records of those 3 types.

---

## Architecture / How It Works

**A Record Type controls 3 things:**

1. **Business Process** — Which picklist values are valid for Stage/Status? Different teams see different pipeline stages.
2. **Page Layout Assignment** — Which layout do users see when viewing this record type? Different fields visible per segment.
3. **Picklist Value Filtering** — Which picklist values (other than Stage/Status) are available for this record type? Different option sets for different segments.

**Limitations:**
- Record Types only exist for Stage/Status picklists via Business Process — all other piclist filtering is done directly in the Record Type picklist value configuration
- Deleting a Record Type is destructive — existing records must be reassigned first
- A profile must have at least one Record Type assigned per object to create records of that object

| Object | Business Process Type | Controls |
|---|---|---|
| Opportunity | Sales Process | Stage values |
| Lead | Lead Process | Status values |
| Case | Support Process | Status values |
| Solution | Solution Process | Status values |

No other objects support Business Processes. Account, Contact, Campaign, etc. use Record Types with picklist value filtering only (no Business Process).

**Limitations:**
- You cannot create a Business Process for any object other than these four
- A Business Process must be linked to a Record Type — it cannot exist independently

| Setting | Where Enforced | API Bypass? |
|---|---|---|
| Required on Layout | UI only (Lightning edit page) | YES — Data Loader and Apex can skip |
| Required on Field Definition | Everywhere: UI, API, Data Loader, Apex | NO — enforced in all contexts |

**Limitations:**
- Setting a field required at the field definition level is a one-way risk — existing records with null values in that field will violate the constraint and fail to save
- Making a field required on a field definition is permanent until you remove the checkbox — test thoroughly in a sandbox first

**4 Surfaces Where Compact Layout Fields Appear**

1. **Highlights Panel** (top of Record page) — first ~5 fields from the compact layout
2. **Kanban View cards** — fields shown on each card in a Kanban board
3. **Lookup Hover Cards** — fields shown when a user hovers over a related record link
4. **Mobile App record summaries** — fields shown in mobile list views and record headers

**Limitations:**
- Compact Layout fields cannot include formula fields that reference other records (cross-object)
- Maximum recommended fields in a Compact Layout: 10 (some surfaces only show first 4–7)
- Compact Layouts must be assigned to a Record Type or set as the default to take effect

---

## Key Facts to Memorize
- Record Type controls: Business Process + Page Layout Assignment + Picklist Value Filtering
- Business Processes: ONLY for Opportunity (Stage) / Lead (Status) / Case (Status) / Solution (Status)
- Compact Layout appears on: Highlights Panel / Kanban cards / Hover cards / Mobile summaries
- Page Layout required = UI only (API can bypass); Field definition required = enforced everywhere
- Page Layouts assigned via Profile + Record Type combination
- Default compact layout = Name field only; customize for real usability
- Profile must have at least one Record Type assigned per object

---

## Exam Traps
- **Business Processes are only for 4 objects.** Any exam question asking about Business Processes on Account, Contact, or other objects — the answer is "not possible." Only Opportunity, Lead, Case, Solution.
- **Required on layout ≠ truly required.** If the business says "this field must always have a value no matter how it's entered," layout-required is not enough — use field-level required.
- **Compact Layout affects 4 surfaces.** Questions often test knowledge that compact layouts are not just the Highlights Panel — they also affect Kanban, hover cards, and mobile.
- **Page Layout is a UI concept.** Page layouts control the edit/view form. They don't control FLS (security) or field-level required validation.
- **Record Types filter picklists.** If different departments need different picklist options, Record Types with picklist value assignments are the mechanism — not separate objects.

---

## Practice Questions

**Q:** A company has two Opportunity pipelines: "Enterprise" with 8 stages and "SMB" with 4 stages. The stages are different for each. How should this be implemented?
**A:** Create two Sales Processes: one for Enterprise (with 8 stages) and one for SMB (with 4 stages). Create two Record Types on Opportunity: "Enterprise" (linked to Enterprise Sales Process) and "SMB" (linked to SMB Sales Process). Assign appropriate Record Types to the relevant profiles.

**Q:** A field is added to the page layout as "required." An integration via Data Loader fails to populate the field. The load completes successfully with the field blank. Why?
**A:** Page Layout "required" is enforced in the UI only — it is not enforced via the API. Data Loader bypasses page layout requirements. To enforce the field via API, the field must be marked "Required" in the field's definition settings (in Object Manager → Fields → Edit field → check "Required").

**Q:** A manager hovers over an Account name in a Contact's related list and wants to see Industry, Phone, and Annual Revenue in the hover card. Where is this configured?
**A:** The Compact Layout for the Account object controls hover card fields. Navigate to Setup → Object Manager → Account → Compact Layouts, create or edit a compact layout that includes Industry, Phone, and Annual Revenue, and set it as the primary compact layout.
