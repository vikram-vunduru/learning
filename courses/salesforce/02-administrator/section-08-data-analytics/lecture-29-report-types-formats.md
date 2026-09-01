# L29: Report Types & Formats

## 🎯 Learning Objectives
- Differentiate between standard and custom report types
- Understand the primary object and related objects in a report type (up to 4 objects)
- Configure the field layout within a custom report type
- Choose the correct report format (Tabular, Summary, Matrix, Joined) for a given use case
- Understand when records appear or do not appear based on relationship requirements in custom report types

## 📊 SLIDES

### Slide 1: What Is a Report Type?
**Visual:**
```
  ┌──────────────────────────────────────────────────────────┐
  │           DATABASE (Objects & Fields)                    │
  │  Accounts │ Contacts │ Opportunities │ Custom Objects   │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │           REPORT TYPE  (Template Layer)                  │
  │  ─────────────────────────────────────────────────────   │
  │  • Which objects (related records) can be included       │
  │  • Which fields from those objects are available         │
  │  • Object relationship requirements (with / without)     │
  │                                                          │
  │  Standard Report Types ──▶ provided by Salesforce        │
  │  Custom Report Types   ──▶ created by admins             │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │                    REPORT                                │
  │  Filters + Columns + Groupings                          │
  │  = Final output visible to users                        │
  │                                                          │
  │  Every report is based on exactly ONE report type        │
  │  You cannot add fields outside the chosen report type    │
  └──────────────────────────────────────────────────────────┘
```
**Content:**
- A **report type** is the template that determines:
  - Which **objects** (related records) can be included in a report
  - Which **fields** from those objects are available in the Report Builder
- Every report is based on exactly one report type
- Two categories: **Standard Report Types** (provided by Salesforce) and **Custom Report Types** (created by admins)
- Report type choice determines the universe of data available — you cannot add fields outside the report type
**Speaker Notes:** Think of a report type as the schema for your report. It defines the menu of fields you can work with. Standard report types cover common use cases like Opportunities, Cases, and Contacts. When you need to combine objects or fields not covered by standard types, you build a custom report type.

### Slide 2: Standard Report Types
**Visual:**
```
  STANDARD REPORT TYPES (Salesforce-Provided)
  ┌───────────────────────────┬──────────────────────────────────┐
  │  CATEGORY                 │  EXAMPLE REPORT TYPES            │
  ├───────────────────────────┼──────────────────────────────────┤
  │  Opportunities            │  Opportunities                   │
  │                           │  Opportunities with Products     │
  │                           │  Opportunity History             │
  │                           │  Opportunity Teams               │
  ├───────────────────────────┼──────────────────────────────────┤
  │  Accounts & Contacts      │  Accounts                        │
  │                           │  Accounts with Contacts          │
  │                           │  Contacts & Accounts             │
  ├───────────────────────────┼──────────────────────────────────┤
  │  Cases                    │  Cases                           │
  │                           │  Cases with Contact Roles        │
  │                           │  Cases with Solutions            │
  ├───────────────────────────┼──────────────────────────────────┤
  │  Activities               │  Activities with Accounts        │
  │                           │  Activities with Contacts        │
  ├───────────────────────────┼──────────────────────────────────┤
  │  Leads                    │  Leads                           │
  │                           │  Leads with Converted Lead Info  │
  └───────────────────────────┴──────────────────────────────────┘
  Cannot be edited or deleted  |  Cover most standard use cases
  Visible in Report Builder "Select Report Type" screen
```
**Content:**
- Salesforce provides standard report types for all standard objects
- Examples:
  - **Opportunities:** Opportunity fields + related owner, account
  - **Opportunities with Products:** Opportunity + Line Items
  - **Cases with Contact Roles:** Cases + Contacts involved
  - **Activities with Accounts and Contacts**
- Standard report types cannot be edited or deleted
- They already contain the most-used field combinations
- Visible in the Report Builder's "Select Report Type" screen
**Speaker Notes:** Standard report types cover the vast majority of everyday reporting needs. Salesforce pre-configures the object relationships and fields. When a user creates a new report, they first select a report type from a categorized list. Knowing which standard types exist helps you recommend the right one. If a standard type doesn't cover the exact fields or relationships needed, that's when admins build custom report types.

### Slide 3: Custom Report Types — Setup
**Visual:**
```
  Setup → Report Types → New Custom Report Type
  
  ┌──────────────┐   ┌──────────────────────┐   ┌──────────────────┐
  │   STEP 1     │   │      STEP 2          │   │     STEP 3       │
  │              │   │                      │   │                  │
  │  Primary     │──▶│  Related Objects     │──▶│  Relationship    │
  │  Object      │   │  (up to 3 more)      │   │  Requirement     │
  │              │   │                      │   │                  │
  │  e.g.        │   │  e.g.                │   │  "Must Have"     │
  │  Accounts    │   │  + Opportunities     │   │      or          │
  │              │   │  + Cases             │   │  "May or May     │
  │              │   │  + Contacts          │   │   Not Have"      │
  └──────────────┘   └──────────────────────┘   └────────┬─────────┘
                                                          │
              ┌───────────────────────────────────────────▼─────────┐
              │  STEP 4: Field Layout                               │
              │  Choose which fields appear in Report Builder       │
              │  Organize by object section, rename if needed       │
              └──────────────────────────────────────┬──────────────┘
                                                     │
                                   ┌─────────────────▼──────────────┐
                                   │  STEP 5: Deployment Status     │
                                   │  In Development ──▶ Deployed   │
                                   │  (users cannot see it until    │
                                   │   status = Deployed)           │
                                   └────────────────────────────────┘
  Total objects: up to 4  (1 primary + 3 related)
```
**Content:**
- Created in **Setup > Report Types > New Custom Report Type**
- Steps:
  1. **Primary Object:** The main object (e.g., Accounts)
  2. **Related Objects:** Add up to 3 additional related objects (total = 4 objects)
  3. **Relationship requirement:** For each related object, choose: records "must have" or "may or may not have" related records
  4. **Field Layout:** Choose which fields appear in the Report Builder for each object
  5. **Deployment Status:** In Development (hidden) vs. Deployed (visible to users)
**Speaker Notes:** The relationship requirement setting is a critical exam topic. If you set a related object to "must have related records," only parent records that HAVE at least one related child record will appear in the report. If you set it to "may or may not have," all parent records appear regardless of whether they have children. This controls your report's row inclusion logic.

### Slide 4: The "With/Without" Relationship in Custom Report Types
**Visual:**
```
  ┌────────────────────────────────┬─────────────────────────────────┐
  │  "MUST HAVE" (A with B)        │  "MAY OR MAY NOT HAVE"          │
  │  Accounts WITH Opportunities   │  All Accounts (with or without) │
  ├────────────────────────────────┼─────────────────────────────────┤
  │  Account    │ Opp Name  │ Amt  │  Account    │ Opp Name  │ Amt   │
  │  ─────────────────────────     │  ─────────────────────────────  │
  │  Acme Corp  │ Q4 Deal   │ $50K │  Acme Corp  │ Q4 Deal   │ $50K  │
  │  Beta Inc   │ Renewal   │ $25K │  Beta Inc   │ Renewal   │ $25K  │
  │  Gamma Ltd  │ New Lic.  │ $80K │  Gamma Ltd  │ New Lic.  │ $80K  │
  │             │           │      │  Delta Co   │           │       │
  │  Delta Co   │  ← EXCLUDED      │  Echo Corp  │           │       │
  │  (has 0 opps, not shown)│      │  (all accounts appear,  │       │
  │             │           │      │   blank opp columns)    │       │
  └────────────────────────────────┴─────────────────────────────────┘
  
  ┌─────────────────────────────────────────────────────────────────┐
  │  KEY EXAM POINT:                                               │
  │  Use "May or may not have" to find accounts with NO children   │
  │  Combine with a cross-filter: Accounts WITHOUT Opportunities   │
  └─────────────────────────────────────────────────────────────────┘
```
**Content:**
- **"Must have" (A with B):** Only primary records WITH at least one related child record appear
  - Example: Accounts WITH Opportunities — accounts with zero opportunities are excluded
- **"May or may not have" (A with or without B):** ALL primary records appear, child columns are blank if no related records
  - Example: All Accounts, showing opportunity data where it exists
- This setting is configured per-relationship when building the custom report type
- Critical for deciding: "Do I want to see records even if they have no children?"
**Speaker Notes:** This is one of the most commonly tested facts about custom report types. The exam will present scenarios like "Which report type setting shows ALL accounts, including those with no opportunities?" — the answer is "may or may not have." If a client wants to find accounts that have NEVER had an opportunity, they'd use a "may or may not have" report type combined with a cross-filter. Knowing this distinction is essential.

### Slide 5: Custom Report Type Field Layout
**Visual:**
```
  CUSTOM REPORT TYPE — Field Layout Editor
  ┌───────────────────────────────┬─────────────────────────────────┐
  │  FIELDS AVAILABLE             │  FIELDS IN REPORT BUILDER       │
  │  (not yet added)              │  (visible to report creators)   │
  ├───────────────────────────────┼─────────────────────────────────┤
  │  ACCOUNT FIELDS:              │  ACCOUNT FIELDS SECTION:        │
  │  • Billing City               │  ≡ Account Name                 │
  │  • Phone                      │  ≡ Account Owner                │
  │  • Created Date               │  ≡ Industry                     │
  │  • ...                        │  ≡ Annual Revenue               │
  │                               │                                 │
  │  OPPORTUNITY FIELDS:          │  OPPORTUNITY FIELDS SECTION:    │
  │  • Expected Revenue           │  ≡ Opportunity Name             │
  │  • Competitor                 │  ≡ Stage                        │
  │  • Next Step                  │  ≡ Amount                       │
  │  • ...                        │  ≡ Close Date                   │
  │                               │  ≡ Probability                  │
  └───────────────────────────────┴─────────────────────────────────┘
  ≡ = drag handle (reorder fields within sections)
  Fields can be renamed — only affects the Report Builder label
  Does NOT affect the actual field data or record page layout
```
**Content:**
- After defining objects, configure which fields appear in the Report Builder
- Fields are organized by object (Account fields section, Opportunity fields section, etc.)
- You can:
  - Add or remove fields per section
  - Rename fields (the label users see in Report Builder)
  - Reorganize fields within each section
- Fields you add here become available as columns and filter options in reports
- Does not affect the actual field data — only affects Report Builder availability
**Speaker Notes:** The field layout editor is how you customize the "menu" of fields that report creators see. If your users frequently need a specific formula field or custom field, add it to the report type's field layout. If you have sensitive fields you don't want in reports, remove them from the layout. Remember: this only affects report availability, not the field itself on the record page.

### Slide 6: Tabular vs. Summary vs. Matrix — When to Use Each
**Visual:**
```
  CHOOSE A REPORT FORMAT — Decision Tree
  
  ┌──────────────────────────────────────────────────┐
  │          Do you need groupings?                  │
  └──────────────────────┬───────────────────────────┘
                ┌────────┴────────┐
                │ NO              │ YES
                ▼                 ▼
  ┌──────────────────┐  ┌──────────────────────────────────┐
  │    TABULAR       │  │  Do you need column groupings?   │
  │  Flat list only  │  └────────────────┬─────────────────┘
  │  Export / lookup │          ┌────────┴────────┐
  │  Dashboard:      │          │ NO              │ YES
  │  table only      │          ▼                 ▼
  └──────────────────┘ ┌─────────────────┐ ┌─────────────────┐
                       │    SUMMARY      │ │     MATRIX      │
                       │  Row groupings  │ │  Row + Column   │
                       │  + subtotals    │ │  (pivot table)  │
                       │  Dashboard:     │ │  Dashboard:     │
                       │  full support   │ │  full support   │
                       └─────────────────┘ └─────────────────┘
  
  Need to combine multiple report types side by side?
  ┌──────────────────────────────────────────────────────┐
  │    JOINED  (up to 5 blocks, own report type each)    │
  │    Dashboard: limited (table components only)        │
  └──────────────────────────────────────────────────────┘
```
**Content:**
| Format | Groupings | Use Case | Dashboard Ready |
|--------|-----------|----------|-----------------|
| Tabular | None | Flat list, export, mailing list | Table only |
| Summary | Row groupings | Pipeline by stage, cases by owner | Full support |
| Matrix | Row + Column | Revenue by rep × quarter | Full support |
| Joined | Multiple blocks | Compare two unrelated data sets | Limited (table) |
- Tabular: "I just need a list"
- Summary: "I need subtotals by a field"
- Matrix: "I need a pivot table comparing two dimensions"
- Joined: "I need to compare two completely different data sets side by side"
**Speaker Notes:** Memorize this decision tree — it directly maps to exam questions. The most common mistake is using Tabular when a dashboard component is needed. Tabular reports cannot source chart-type dashboard components. If someone needs a bar chart showing cases by status, they need a Summary report. The format you choose after selecting the report type is changed via the report toolbar (the format is not locked by the report type).

### Slide 7: Changing Report Format and Format Limits
**Visual:**
```
  REPORT BUILDER — Format Selection & Switching Rules
  ┌──────────────────────────────────────────────────────────┐
  │  Report Builder Toolbar                                  │
  │  ┌───────────────────────────────────────────────────┐   │
  │  │  Format: [ Tabular ▼ ]  ← change format here     │   │
  │  │          ┌──────────────────┐                    │   │
  │  │          │ ● Tabular        │                    │   │
  │  │          │ ○ Summary        │                    │   │
  │  │          │ ○ Matrix         │                    │   │
  │  │          │ ○ Joined         │                    │   │
  │  │          └──────────────────┘                    │   │
  │  └───────────────────────────────────────────────────┘   │
  ├──────────────────────────────────────────────────────────┤
  │  FORMAT SWITCHING RULES:                                 │
  │  Tabular  ↔  Summary:  Supported (add/remove grouping)  │
  │  Summary  ↔  Matrix:   Supported (add column groupings) │
  │  To / from Joined:     Requires rebuild (separate mode) │
  ├──────────────────────────────────────────────────────────┤
  │  FORMAT LIMITS:                                          │
  │  ┌─────────────┬────────────────────────────────────┐   │
  │  │  Summary    │  up to 3 row groupings             │   │
  │  │  Matrix     │  up to 2 row + 2 column groupings  │   │
  │  │  Joined     │  up to 5 blocks                    │   │
  │  │  Row Limit  │  Tabular only, max 2,000 rows      │   │
  │  └─────────────┴────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────────┘
```
**Content:**
- Report format can be changed within Report Builder via the toolbar
- **Switching format rules:**
  - Tabular ↔ Summary: Supported; switching to Summary requires adding a grouping
  - Summary ↔ Matrix: Supported; Matrix adds column groupings on top of row groupings
  - To/from Joined: Requires rebuilding — Joined is a separate mode
- **Limits:**
  - Summary: Up to **3 row groupings**
  - Matrix: Up to **2 row groupings** + **2 column groupings**
  - Joined: Up to **5 blocks**
- **Row limit:** Only available in Tabular reports (max 2,000 records with sort)
**Speaker Notes:** The format limits are testable. Summary supports three row groupings — for example, Owner, Stage, and Close Month. Matrix supports two of each: two row groupings and two column groupings. These limits exist for performance reasons. The Joined report format is essentially a separate editor — once you switch to Joined, you rebuild the blocks rather than converting existing groupings.

### Slide 8: Choosing the Right Report Type — Summary
**Visual:**
```
  CHOOSING: Standard vs. Custom Report Type
  
  ┌──────────────────────────────────────────────────────────┐
  │                      SCENARIO                            │
  └──────────────────────────┬───────────────────────────────┘
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Reporting on a CUSTOM OBJECT?                           │
  └──────────────────┬───────────────────────────────────────┘
           │ YES     │                         │ NO
           ▼         │                         ▼
  ┌────────────────┐ │   ┌────────────────────────────────────┐
  │  Must use      │ │   │  Does a standard report type       │
  │  CUSTOM        │ │   │  already cover your fields?        │
  │  Report Type   │ │   └──────────────┬─────────────────────┘
  └────────────────┘ │          │ YES   │           │ NO
                     │          ▼       │           ▼
                     │  ┌──────────────┐│  ┌────────────────────┐
                     │  │  Use STANDARD││  │  Build CUSTOM      │
                     │  │  Report Type ││  │  Report Type       │
                     │  └──────────────┘│  └────────────────────┘
                     │
                     │  Also use CUSTOM when:
                     │  • Need specific "with/without" behavior
                     │  • Need lookup relationships not in standard types
                     │  • Need 3-4 objects in non-standard combinations
  ───────────────────────────────────────────────────────────────
  REMEMBER: Custom report types must be DEPLOYED (not "In Development")
            before users can see them in the Report Builder
```
**Content:**
- Use a **standard report type** when:
  - Working with standard objects covered by Salesforce defaults
  - The needed fields are already included
  - No need for custom relationships
- Use a **custom report type** when:
  - Reporting on custom objects
  - Need fields from a combination not covered by standard types
  - Need to control the "with/without" relationship behavior
  - Need to include lookup relationships not in standard types
- **Best practice:** Check standard types first — build custom only when needed
- Deployment status: Keep "In Development" until the layout is finalized
**Speaker Notes:** One important note about custom report types and custom objects: if you create a custom object and want to report on it, you must create a custom report type for it. Salesforce does NOT automatically create standard report types for custom objects. Also remember: custom report types are only available to users once you change the Deployment Status from "In Development" to "Deployed." This is a common gotcha where an admin builds a report type but forgets to deploy it.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 29 — Report Types and Formats. This lecture builds on the previous one by going deeper into how report types work and how to choose the right report format for different scenarios.

Every report in Salesforce is based on a report type. The report type is a template that defines two things: which objects and their related data can be included, and which fields from those objects are available in the Report Builder. Think of it as the schema for your report.

There are two categories of report types. Standard report types are provided by Salesforce out of the box for all standard objects. You'll find types like Opportunities, Accounts with Contacts, Cases, Activities, and many more. Standard types cannot be modified.

Custom report types are created by admins in Setup. You start by selecting a primary object — for example, Accounts. Then you can add up to three additional related objects, for a total of four objects. For each related object, you make a critical choice: should parent records appear only if they HAVE related child records ("must have"), or should ALL parent records appear regardless ("may or may not have")? This single setting determines whether your report includes records with no children.

After defining the object relationships, you configure the field layout — which fields from each object are available in the Report Builder. Remember: custom report types are not visible to users until you change the deployment status from "In Development" to "Deployed."

Now let's talk about report formats. The format controls how data is structured in the report, and it's separate from the report type. Tabular is the simplest — a flat list, no groupings. Great for exports, but it can only feed table-type dashboard components, not charts.

Summary format adds row groupings. You can group by up to three fields, and each group gets subtotals. This is the most commonly used format for dashboards. If someone needs a bar chart of cases by owner, they need a Summary report.

Matrix format adds both row groupings AND column groupings — up to two of each. This creates a pivot table view, perfect for comparing two dimensions like sales rep performance by quarter.

Joined format is the most complex. It lets you combine up to five separate report blocks, each with its own report type and filters. You'd use this to compare, say, a list of open opportunities alongside a list of open cases for the same accounts. However, joined reports have limited dashboard support.

The key exam traps to remember: tabular reports cannot source chart dashboard components. Custom objects need custom report types — Salesforce doesn't auto-create them. And don't forget to deploy your custom report types before expecting users to see them.

## 🔔 EXAM TIPS
- **Custom Objects:** Salesforce does NOT automatically create standard report types for custom objects. You must create a custom report type manually.
- **"Must have" vs. "May or may not have":** "Must have" = only records with related children appear. "May or may not have" = all records appear (children columns are blank where absent). This is frequently tested.
- **Deployment Status:** A custom report type must be in "Deployed" status for users to see it. "In Development" hides it from all non-admin users.
- **Max Objects:** Custom report types support up to 4 objects total (1 primary + 3 related).
- **Format Limits:** Summary = 3 row groupings. Matrix = 2 row + 2 column groupings. Joined = 5 blocks.
- **Tabular + Dashboard:** Tabular reports can ONLY be used for table-type dashboard components (not charts/gauges/metrics).
- **Format Switching:** You can switch between Tabular/Summary/Matrix in Report Builder. Switching to/from Joined requires rebuilding.

## ✅ LECTURE SUMMARY
- Every report is built on a report type that defines available objects and fields
- Standard report types cover standard objects; custom report types are built by admins for custom objects or specific needs
- Custom report types support up to 4 objects; "must have" vs. "may or may not have" controls record inclusion
- Field layout in a custom report type determines which fields appear in Report Builder
- Custom report types must be Deployed (not "In Development") to be visible to users
- Tabular = flat list, Summary = row groupings (up to 3), Matrix = row + column groupings, Joined = multiple blocks
- Tabular reports cannot source chart-type dashboard components

## ❓ MINI QUIZ

**Q1:** An admin creates a custom report type with Accounts as the primary object and Opportunities as the related object, setting the relationship to "must have related records." What will this report show?
- A) All accounts, with opportunity columns blank for accounts without opportunities
- B) Only accounts that have at least one related opportunity record
- C) All opportunities, grouped by account
- D) All accounts and all opportunities, including unrelated records

**Answer:** B — "Must have related records" means only the primary object records that HAVE at least one related child record will appear. Accounts with zero opportunities are excluded from the report.

**Q2:** A user wants to create a report on a custom object called "Projects." When she goes to create a new report, she cannot find a report type for Projects. What is the most likely cause?
- A) Custom objects cannot be included in reports
- B) The user does not have the "Run Reports" permission
- C) No custom report type has been created for the Projects object, or the existing one is still "In Development"
- D) Reports require at least two objects, and Projects is only one object

**Answer:** C — Salesforce does not automatically create report types for custom objects. An admin must create a custom report type with the Projects object as the primary object, then change the deployment status to "Deployed" before users can see it.

**Q3:** Which report format supports both row groupings AND column groupings for cross-dimensional analysis?
- A) Tabular
- B) Summary
- C) Matrix
- D) Joined

**Answer:** C — Matrix report format supports groupings on both rows and columns (up to 2 row groupings and 2 column groupings), creating a pivot table-style view perfect for cross-dimensional analysis like revenue by rep and by quarter.
