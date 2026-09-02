# Reports — Basics

## Exam Domain
Data & Analytics — 14% of exam

## Core Concepts

Reports pull live data from Salesforce records and display it in structured formats. They're the primary self-service analytics tool for business users.

**Four Report Types (Formats):**

| Format | Structure | Can Group? | Has Charts? | Dashboard? |
|---|---|---|---|---|
| Tabular | Flat list of rows | No | No | Table only |
| Summary | Rows grouped by field | Yes (up to 3 row groups) | Yes | Full chart types |
| Matrix | Rows + Columns | Yes (up to 2 each) | Yes | Full chart types |
| Joined | Multiple report blocks side-by-side | Yes (within each block) | Yes (limited) | Limited |

**Tabular reports:**
- Simplest format — a list with columns
- Cannot group, subtotal, or create bar/pie charts
- In dashboards: can ONLY be used as a "Table" dashboard component (not as a chart)
- Good for: export to Excel, displaying a filtered record list

**Summary reports:**
- Most common format for sales/service reporting
- Groups rows by up to 3 fields (e.g., Region → Industry → Stage)
- Can show subtotals and grand totals
- Can create charts (bar, pie, donut, line, etc.)
- Good for: pipeline by stage, cases by status, revenue by region

**Matrix reports:**
- Two-dimensional grouping: rows AND columns
- Up to 2 groupings per dimension (2 row groups + 2 column groups)
- Great for: comparison tables (e.g., revenue by region by quarter)
- Can have charts

**Joined reports:**
- Combines up to 5 separate report "blocks" in one view
- Each block uses a different primary object (or same object with different filters)
- Can show data from unrelated objects side-by-side
- Use case: side-by-side comparison of new leads vs new opportunities in the same time period
- Most complex format; limited charting

**Running User:**
- Reports run as a specific user — they show data that user can see
- Default: current logged-in user ("Run as User")
- Embedded in dashboards: the Dashboard Running User setting applies
- This is critical for controlling what data shows in dashboards

## PTA / SA Relevance

Reports are the front line of analytics in every Salesforce org. Every business stakeholder will eventually want a report. The key skills for enterprise implementations:

**Custom Report Types:** When standard reports don't show the right combination of objects/fields, you need Custom Report Types (covered in lecture-29). Understanding what native report types exist vs when you need custom ones is a daily admin decision.

**Report limitations and CRM Analytics:** For complex analytics (cross-cloud data, AI predictions, multi-org reporting), standard Reports are insufficient — that's the CRM Analytics (Tableau CRM / Einstein Analytics) conversation. Know the boundary: standard reports are for operational CRM reporting; CRM Analytics is for complex analysis and AI-powered insights.

**Folder sharing:** Reports live in folders. Folder visibility controls who can run and edit reports. This is a governance consideration — especially for finance or executive reports that shouldn't be editable by general users.

## Architecture / How It Works

```
Report Format Comparison
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  TABULAR (flat list):
  Name         | Stage      | Amount
  Acme Deal    | Proposal   | $50,000
  Beta Corp    | Closed Won | $120,000

  SUMMARY (grouped):
  Stage: Proposal ───────────────── [subtotal]
    Acme Deal       $50,000
    Delta Inc       $30,000
  Stage: Closed Won ─────────────── [subtotal]
    Beta Corp       $120,000
  TOTAL: $200,000

  MATRIX (rows + columns):
               Q1        Q2        Q3
  East Region  $150K     $200K     $180K
  West Region  $130K     $160K     $175K
  TOTAL        $280K     $360K     $355K

  JOINED (multiple blocks):
  ┌───────────────┬────────────────────────┐
  │ Block 1:      │ Block 2:               │
  │ New Leads     │ New Opportunities      │
  │ (this month)  │ (this month)           │
  └───────────────┴────────────────────────┘
```

**Limitations:**
- Tabular reports: no grouping, no charts, dashboard component limited to table type only
- Summary: max 3 row groupings
- Matrix: max 2 row groupings + 2 column groupings
- Joined: max 5 blocks; limited charting; slowest performance
- Reports only show data the Running User can access (respects sharing model)
- Maximum 2,000 rows displayed in report preview (full export removes this limit)
- Reports cannot join unrelated objects in a single query (use Joined reports for multi-object, or Custom Report Types with relationships)

## Key Facts to Memorize

- 4 formats: Tabular, Summary, Matrix, Joined
- Tabular = flat list; NO charts; dashboard = table component ONLY
- Summary = row groupings (max 3); can have charts
- Matrix = row + column groupings (max 2 each); can have charts
- Joined = up to 5 blocks; can show unrelated objects side-by-side
- Running User = whose data the report shows
- Reports run as the current user by default
- Max 2,000 rows in UI preview (export gets all rows)

## Exam Traps

- **"Tabular reports can be used for any type of dashboard component"** — FALSE. Tabular reports can only be used for Table dashboard components (not charts).
- **"Summary reports can have up to 5 row groupings"** — FALSE. Maximum 3 row groupings for Summary reports.
- **"Matrix reports can only be used for one row grouping"** — FALSE. Matrix supports up to 2 row groups AND 2 column groups.
- **"Joined reports can combine objects with no shared relationship"** — TRUE. This is specifically what Joined reports are for — blocks can use completely different objects.
- **"Reports show all data regardless of the running user's access"** — FALSE. Reports respect the sharing model; users only see data they have access to.

## Practice Questions

**Q:** A sales manager wants to see total Opportunity amount by Stage and then by Region within each Stage. Which report type should they use?
**A:** Summary report with two row groupings: Stage (first), then Region (second).

**Q:** A CFO wants a dashboard component that shows a bar chart of revenue by product category. The report must support charts. Which report formats are appropriate?
**A:** Summary, Matrix, or Joined. (NOT Tabular — Tabular reports don't support charts.)

**Q:** An admin builds a Tabular report of top accounts by revenue and tries to add it to a dashboard as a bar chart. Why does the chart option not appear?
**A:** Tabular reports cannot be used as chart components in dashboards. They can only be used as Table components. The admin should convert the report to Summary format and add a grouping.

**Q:** What is the maximum number of row groupings in a Summary report?
**A:** 3 row groupings.
