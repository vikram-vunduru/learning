# L28: Reports Basics

## 🎯 Learning Objectives
- Navigate the Report Builder interface and understand its key components
- Identify and create tabular, summary, matrix, and joined reports
- Apply groupings and summary fields (SUM, AVG, MIN, MAX) to reports
- Configure filters including standard filters, field filters, and row limits
- Schedule reports and understand the running user concept
- Manage report folders and report subscriptions

## 📊 SLIDES

### Slide 1: What Is a Salesforce Report?
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  REPORT BUILDER                    [Run] [Save] [Cancel]    │
  ├─────────────────┬────────────────────────────────────────────┤
  │  FIELDS PANEL   │  [Outline Tab]    [Filters Tab]           │
  │  ─────────────  ├────────────────────────────────────────────┤
  │  Opportunity    │                                           │
  │  ▶ Name         │          REPORT CANVAS                    │
  │  ▶ Amount       │    (drag fields here to add               │
  │  ▶ Stage        │     columns and groupings)                │
  │  ▶ Close Date   │                                           │
  │  ▶ Owner        │                                           │
  │  ▶ Account Name │                                           │
  │  ▶ Probability  ├────────────────────────────────────────────┤
  │  ...more fields │  PREVIEW PANE  (up to 2,000 rows)         │
  │                 │  Opp Name       │ Close Date │ Amount     │
  │  [Search        │  Acme Q4 Deal   │ 12/31/2024 │ $50,000   │
  │   Fields...]    │  Beta Corp      │ 11/30/2024 │ $25,000   │
  └─────────────────┴────────────────────────────────────────────┘
  
  Reports pull LIVE data — every run returns current results
  Accessed via: Reports tab in any Salesforce app
```
**Content:**
- A report is a list of records meeting criteria you define, displayed in rows and columns
- Reports pull live data from your Salesforce org
- Accessed via the Reports tab in any Salesforce app
- Reports can be saved to folders for sharing and access control
- Reports feed data into dashboards
**Speaker Notes:** Reports are one of the most-tested topics on the Admin exam. Think of a report as a saved query against your Salesforce data — every time you run it, you get fresh results. The Report Builder is the drag-and-drop interface you use to design reports.

### Slide 2: The Report Builder Interface
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  REPORT BUILDER INTERFACE — Four Key Areas                  │
  ├─────────────────────┬────────────────────────────────────────┤
  │  (1) FIELDS PANEL   │  (3) OUTLINE / FILTERS TABS           │
  │      (Left side)    │                                        │
  │  ─────────────────  │  [Outline Tab]        [Filters Tab]   │
  │  All available      │  ─────────────        ─────────────   │
  │  fields from the    │  • Column groups      • Standard filt │
  │  selected report    │  • Row groupings      • Field filters │
  │  type               │  • Summary fields     • Row limits    │
  │                     │                                        │
  │  Drag to canvas     │  (2) REPORT CANVAS (Center)           │
  │  to add columns     │  ──────────────────────────────────── │
  │  or groupings       │  Defines structure of the report      │
  ├─────────────────────┴────────────────────────────────────────┤
  │  (4) PREVIEW PANE (Bottom) — Live data, up to 2,000 rows    │
  │  ────────────────────────────────────────────────────────── │
  │  Opp Name          │ Owner     │ Stage       │ Amount       │
  │  Acme Q4 Deal      │ J. Smith  │ Proposal    │ $50,000      │
  │  Beta Corp Renewal │ S. Chen   │ Closed Won  │ $75,000      │
  │  Gamma New License │ M. Lee    │ Prospecting │ $80,000      │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Fields panel:** All available fields from the report type
- **Outline tab:** Defines groupings and columns (what appears in the report)
- **Filters tab:** Row-level and report-level filters
- **Preview pane:** Real-time preview of up to 2,000 rows
- **Run button:** Executes the full report
**Speaker Notes:** The Report Builder opens automatically when you create a new report or click Edit on an existing one. The Outline tab is where you drag fields to define what columns and groupings appear. The Filters tab controls which records are included. Always use Run Report (not just preview) to see complete data.

### Slide 3: Report Types — Tabular
**Visual:**
```
  TABULAR REPORT — Opportunities (Flat List, No Groupings)
  ┌───────────────────────────────┬──────────────┬──────────────┐
  │  Opportunity Name             │  Close Date  │  Amount      │
  ├───────────────────────────────┼──────────────┼──────────────┤
  │  Acme Q4 Deal                 │  12/31/2024  │  $50,000     │
  │  Beta Corp Renewal            │  11/30/2024  │  $25,000     │
  │  Gamma Inc New License        │  01/15/2025  │  $80,000     │
  │  Delta Systems Upgrade        │  12/15/2024  │  $45,000     │
  │  Echo Partners Contract       │  01/31/2025  │  $30,000     │
  ├───────────────────────────────┼──────────────┼──────────────┤
  │  (no subtotals — no groups)   │              │              │
  └───────────────────────────────┴──────────────┴──────────────┘
  
  Tabular report = spreadsheet-style flat list
  ┌────────────────────────────────────────────────────────────┐
  │  Best for:   Exports, mailing lists, quick lookups        │
  │  Dashboard:  Table components ONLY (cannot feed charts)   │
  │  Row Limit:  Supports top-N limit (e.g., top 10 by Amt)   │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- Simplest report format — a flat list of records
- Like a spreadsheet: rows and columns, no groupings
- Cannot be used as the source for most dashboard components (requires grouping)
- Best for: exporting data, mailing lists, quick record lookups
- Supports row limits (e.g., top 10 by Amount)
**Speaker Notes:** Tabular reports are quick to build but limited in analytical power. Because they have no groupings, they cannot feed charts or most dashboard components. They are ideal when you just need a simple list of records to export or review. A common exam trap: tabular reports can only be used in dashboard table components, not charts.

### Slide 4: Report Types — Summary & Matrix
**Visual:**
```
  SUMMARY REPORT                    │  MATRIX REPORT
  (Row Groupings + Subtotals)       │  (Row + Column Groupings)
                                    │
  ┌──────────────────────────────┐  │  ┌──────────────┬────────┬────────┐
  │ Stage: Prospecting           │  │  │              │  Q3    │  Q4    │
  │   Smith, J  │  $10,000       │  │  ├──────────────┼────────┼────────┤
  │   Chen, S   │  $20,000       │  │  │ Smith, J     │  $30K  │  $50K  │
  │   Subtotal: │  $30,000       │  │  ├──────────────┼────────┼────────┤
  ├──────────────────────────────┤  │  │ Chen, S      │  $45K  │  $70K  │
  │ Stage: Proposal              │  │  ├──────────────┼────────┼────────┤
  │   Smith, J  │  $50,000       │  │  │ Lee, M       │  $20K  │  $35K  │
  │   Lee, M    │  $25,000       │  │  ├──────────────┼────────┼────────┤
  │   Subtotal: │  $75,000       │  │  │  Totals:     │  $95K  │ $155K  │
  ├──────────────────────────────┤  │  └──────────────┴────────┴────────┘
  │  GRAND TOTAL:      $105,000  │  │
  └──────────────────────────────┘  │  Pivot table — 2 dimensions at once
  Groups by ROW only                │  Groups by BOTH rows AND columns
  Up to 3 row groupings             │  Up to 2 row + 2 column groupings
  Supports charts + dashboards      │  Supports charts + dashboards
```
**Content:**
- **Summary Report:** Groups records by one or more row groupings; subtotals per group
  - Example: Opportunities grouped by Stage, subtotaled by Amount
  - Can be used for charts and dashboards
- **Matrix Report:** Groups by BOTH rows AND columns (two-dimensional pivot)
  - Example: Revenue by Owner (rows) and Quarter (columns)
  - Most powerful for cross-analysis
  - Can be used for charts and dashboards
**Speaker Notes:** Summary reports are the most commonly used report type for dashboards. Matrix reports are like pivot tables in Excel — extremely powerful for comparing two dimensions simultaneously. Both summary and matrix reports can have up to three row groupings and, for matrix reports, two column groupings. These formats are heavily tested on the exam.

### Slide 5: Report Types — Joined Reports
**Visual:**
```
  JOINED REPORT — Multiple Blocks Side by Side
  ┌────────────────────────────────────────────────────────────┐
  │  Shared Standard Filters: Account Name, Close Date Range  │
  ├─────────────────────────────┬──────────────────────────────┤
  │  BLOCK A: Opportunities     │  BLOCK B: Cases              │
  │  (Report Type A)            │  (Report Type B)             │
  ├──────────────────┬──────────┼──────────┬────────┬──────────┤
  │  Opp Name        │ Amount   │  Case #  │ Status │ Priority │
  │  Acme Q4 Deal    │ $50,000  │  00123   │ Open   │ High     │
  │  Beta Corp       │ $25,000  │  00124   │ Open   │ Medium   │
  │  Gamma Inc       │ $80,000  │  00125   │ Closed │ Low      │
  └──────────────────┴──────────┴──────────┴────────┴──────────┘
  
  ┌────────────────────────────────────────────────────────────┐
  │  Up to 5 blocks   │  Each block = own report type         │
  │  Shared std filt  │  Each block = own field filters        │
  │  Cross-block formulas supported                           │
  │  Dashboard: table components only (limited support)       │
  └────────────────────────────────────────────────────────────┘
  Use: "Which report type compares two different data sets?" → Joined
```
**Content:**
- Combines up to **5 report blocks**, each from a different report type
- Each block can have its own filters and columns
- All blocks share the same standard filters (date range, etc.)
- Useful for: comparing pipeline vs. support tickets for the same accounts
- Can create cross-block formulas (calculate across blocks)
- Limited dashboard support (only table components)
**Speaker Notes:** Joined reports are the most complex format and typically appear once or twice on the exam. The key facts to remember: up to 5 blocks, each block is a separate report type, they share common filters, and they have limited dashboard usage. If a question asks "which report type lets you compare data from two different report types side by side," the answer is Joined.

### Slide 6: Summary Fields and Groupings
**Visual:**
```
  SUMMARY REPORT — Opportunities by Stage
  ┌──────────────────────────────────────────────────────────┐
  │  Stage: Closed Won  (12 records)                         │
  ├─────────────────────────┬────────────────────────────────┤
  │  Acme Corp Enterprise   │  $120,000                     │
  │  Beta Corp Renewal      │   $75,000                     │
  │  Gamma Inc New License  │   $45,000                     │
  │  Delta Systems Upgrade  │  $210,000                     │
  │  ...                    │  ...                          │
  ├─────────────────────────┴────────────────────────────────┤
  │  STAGE SUBTOTALS — Amount Field                          │
  ├──────────────────────────────────────────────────────────┤
  │  SUM:     $450,000   │  AVG:  $ 45,000                  │
  │  MIN:     $  5,000   │  MAX:  $120,000                  │
  │  COUNT:          12  │                                  │
  ├──────────────────────────────────────────────────────────┤
  │  Summary fields work on: Numeric / Currency / Percent   │
  │  COUNT is always available on ANY field type            │
  │  Added in the Outline tab (not the Filters tab)         │
  └──────────────────────────────────────────────────────────┘
```
**Content:**
- **Groupings** organize records into categories (rows for Summary, rows+columns for Matrix)
- **Summary fields** perform calculations on numeric/currency/percent fields:
  - **SUM:** Total of all values in the group
  - **AVG:** Average value
  - **MIN:** Lowest value in the group
  - **MAX:** Highest value in the group
  - **COUNT:** Number of records (always available)
- Groupings also support record counts per group
**Speaker Notes:** Summary fields only work on numeric, currency, and percent field types. You cannot SUM a text field. Groupings are what enable subtotals and grand totals in reports. The COUNT is always available regardless of field type. On the exam, remember that summary fields are added in the "Outline" tab, not the "Filters" tab.

### Slide 7: Filters — Standard, Field, and Row Limit
**Visual:**
```
  FILTERS PANEL
  ┌──────────────────────────────────────────────────────────────┐
  │  STANDARD FILTERS (pre-built for each object type)          │
  ├──────────────────────────────────────────────────────────────┤
  │  Show Me:   [ All Opportunities            ▼ ]              │
  │  Date:      [ Close Date                   ▼ ]              │
  │  Range:     [ This Quarter                 ▼ ]              │
  ├──────────────────────────────────────────────────────────────┤
  │  FIELD FILTERS (custom conditions you define)               │
  ├──────────────────────────────────────────────────────────────┤
  │  1.  Amount     │  greater than  │  10,000       [remove]   │
  │  2.  Stage      │  equals        │  Prospecting  [remove]   │
  │  3.  Owner Role │  equals        │  West Region  [remove]   │
  │  [+ Add Filter Condition]                                    │
  │  Filter Logic:   1 AND (2 OR 3)                             │
  ├──────────────────────────────────────────────────────────────┤
  │  ROW LIMIT FILTER (Tabular reports only)                    │
  ├──────────────────────────────────────────────────────────────┤
  │  Limit rows to: [ 10 ▼ ]   Sort by: [ Amount ▼ ] [ Desc ▼ ]│
  │  Maximum: 2,000 rows  |  Requires a sort field              │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Standard Filters:** Applied to all reports of that object type
  - "Show Me": All records, My records, My team's records
  - Date field and date range (e.g., "Close Date = This Quarter")
- **Field Filters:** Custom conditions on any field (e.g., Amount > 10,000, Stage = "Prospecting")
  - Supports AND/OR logic with filter logic
- **Row Limit Filter:** Limits tabular reports to top N records (max 2,000); requires sorting
- **Cross-Filter:** Filter parent by related child records (e.g., Accounts WITH Opportunities)
**Speaker Notes:** The three filter types appear in the Filters tab. Standard filters vary by object — Opportunity reports always have "Show Me" and "Close Date" standard filters. Field filters are your custom conditions and support complex logic. Row limits only apply to tabular reports and are often used in dashboards for "Top 10" lists. Cross-filters are powerful for finding records with or without related child records.

### Slide 8: Report Folders, Scheduling & Running User
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  REPORT FOLDERS — Access Control                            │
  │  ┌────────────────────────────────────────────────────────┐ │
  │  │  Sales Reports Folder                                  │ │
  │  │  Shared with: VP Sales Role, West Region Group         │ │
  │  │  ┌──────────────────┐  ┌────────────────────────────┐  │ │
  │  │  │  Q4 Pipeline Rpt │  │  Team Performance YTD Rpt  │  │ │
  │  │  └──────────────────┘  └────────────────────────────┘  │ │
  │  └────────────────────────────────────────────────────────┘ │
  ├──────────────────────────────────────────────────────────────┤
  │  SCHEDULE REPORT              RUNNING USER                  │
  │  ┌────────────────────────┐  ┌──────────────────────────┐   │
  │  │  Every Monday  8:00 AM │  │  [User]  Sarah (VP Sales)│   │
  │  │  Send to: Sales Team   │  │                          │   │
  │  │  Format: Excel / CSV   │  │  Report shows data that  │   │
  │  └────────────────────────┘  │  Sarah can access        │   │
  │                              └──────────────────────────┘   │
  ├──────────────────────────────────────────────────────────────┤
  │  REPORT SUBSCRIPTIONS:                                      │
  │  Notify user when report result meets a condition           │
  │  Example: Alert when open pipeline drops below $1M          │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Report Folders:** Control access — Public, Hidden, or shared with roles/profiles/groups
  - Users need "View Reports in Public Folders" permission to see public folders
  - Manage Reports in Public Folders = edit/delete others' reports
- **Scheduling Reports:** Run automatically on a schedule (daily/weekly/monthly)
  - Send results via email; export as Excel, CSV, or formatted report
- **Running User:** The user whose permissions determine which records appear in the report
  - Default: person running the report
  - Scheduled reports: the user who scheduled it
- **Report Subscriptions:** Users subscribe to receive report results on a schedule; fires when defined conditions are met
**Speaker Notes:** Report folders work exactly like file folders with sharing permissions. The "running user" concept is critical for dashboards — whoever runs the report determines the data visible. When you schedule a report, the data is filtered based on the scheduler's access. Report subscriptions (sometimes called conditional subscriptions) let users receive an email when a report result meets a threshold, like when pipeline drops below $1M.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 28 — Reports Basics. Reports are one of the most heavily tested areas on the Salesforce Administrator exam, so let's make sure you have a solid foundation.

A Salesforce report is a list of records that meet criteria you define. Every time you run a report, Salesforce queries your live data, so you always see current information. Reports are created and managed in the Reports tab.

Let's start with the Report Builder interface. When you create or edit a report, the Report Builder opens. On the left side you'll see the Fields panel — this lists every field available from your report type. The center area is your report canvas. At the top, you'll see the Outline tab and the Filters tab. The Outline tab is where you drag fields to define columns and groupings. The Filters tab is where you control which records get included. At the bottom is a live preview showing up to two thousand records.

Now let's cover the four report types. First is Tabular — think of this as a flat spreadsheet. No groupings, no subtotals, just a list of records. Tabular reports are great for exports but have limited dashboard use because they lack groupings.

Second is Summary reports — these add row groupings. For example, you can group opportunities by Stage and see a subtotal of the Amount for each stage. Summary reports can have up to three row groupings and support all dashboard components.

Third is Matrix reports — these are like pivot tables. You group by both rows AND columns. For example, you could see revenue grouped by Sales Rep down the rows and Quarter across the columns. Very powerful for two-dimensional analysis.

Fourth is Joined reports — these combine up to five separate report blocks, each from a different report type, side by side. This lets you compare, say, opportunities and cases for the same accounts in one view.

Next, summary fields. On numeric, currency, and percent fields, you can add aggregate calculations: SUM, AVG, MIN, MAX, and COUNT. These show up as subtotals within your groupings.

For filters, you have three types. Standard filters are pre-built for the object — like "Show Me my records" or "Close Date this quarter." Field filters are custom conditions you define. Row limit filters let you cap tabular reports at a specific number of records, perfect for "Top 10" dashboard tables.

Finally, report folders control who can access your reports. You can share folders with roles, public groups, or profiles. When you schedule a report to run automatically, it runs as the user who scheduled it — those are the records and fields that user has access to. Report subscriptions take this further, letting you receive a notification only when results meet a specific condition you set.

Remember: tabular for flat lists, summary for row groupings, matrix for row and column groupings, and joined for combining multiple report types. These distinctions are guaranteed to appear on your exam.

## 🔔 EXAM TIPS
- **Tabular vs. Dashboard:** Tabular reports cannot be used as the source for chart-type dashboard components — only for table components. Always choose Summary or Matrix for charts.
- **Joined Reports:** Up to 5 report blocks, each can have its own report type and filters. They share standard filters across all blocks.
- **Running User:** The running user's record-level access determines which records appear. This is different from field-level security, which is always enforced regardless of running user.
- **Row Limit:** Only available on tabular reports; requires a sort field; maximum is 2,000 rows.
- **Summary Fields:** Only numeric, currency, and percent fields support SUM/AVG/MIN/MAX. COUNT is always available on any field.
- **Scheduling:** Scheduled reports run as the user who scheduled them, not who receives them.
- **Filter Logic:** You can use custom logic like "1 AND (2 OR 3)" in the Filters tab to combine field filters with AND/OR logic.

## ✅ LECTURE SUMMARY
- Reports are real-time queries against Salesforce data, built in the Report Builder
- Four report types: Tabular (flat list), Summary (row groupings), Matrix (row + column groupings), Joined (multiple report types)
- Summary fields (SUM/AVG/MIN/MAX/COUNT) work on numeric/currency/percent fields within groupings
- Three filter types: Standard (object-level), Field (custom conditions), Row Limit (tabular only)
- Report folders control access; share with roles, profiles, or groups
- The running user's permissions determine which records appear in report results
- Report subscriptions deliver results on a schedule when conditions are met

## ❓ MINI QUIZ

**Q1:** A sales manager wants a report showing total Opportunity Amount grouped by Sales Rep and then by Stage, with subtotals for each group. Which report type should she use?
- A) Tabular
- B) Summary
- C) Matrix
- D) Joined

**Answer:** B — Summary reports support row groupings with subtotals. The manager needs to group by two fields (Rep and Stage), which is supported by Summary reports with up to three row groupings. Matrix would be used if she also needed column groupings.

**Q2:** Which of the following statements about Joined reports is TRUE?
- A) Joined reports can include up to 10 report blocks
- B) Each block in a joined report must use the same report type
- C) Joined reports can combine up to 5 blocks, each with a different report type
- D) Joined reports fully support all dashboard component types

**Answer:** C — Joined reports support up to 5 blocks, each of which can use a different report type. They have limited dashboard support (mainly table components), not full support.

**Q3:** A user runs a scheduled report every Monday morning. The report is supposed to show all open opportunities in the org, but the user only sees their own opportunities. What is the most likely cause?
- A) The report type does not include all objects
- B) The running user (the scheduler) only has access to their own records due to their profile/OWD settings
- C) The report filter is set to "My Opportunities"
- D) Both B and C are possible causes

**Answer:** D — Both are valid causes. The "Show Me" standard filter might be set to "My Opportunities," and even if it says "All Opportunities," the running user's record-level access (determined by OWD, role hierarchy, and sharing rules) limits which records they can see. The admin should check both the filter setting and the running user's data access.
