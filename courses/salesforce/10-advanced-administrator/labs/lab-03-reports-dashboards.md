# Lab 03: Advanced Reports & Dashboards

## Lab Overview

**Objective:** Build a Joined Report, a Summary Formula, and a Dynamic Dashboard. These are the three most-tested report features on the Advanced Admin exam.

**Estimated time:** 60–90 minutes

**Prerequisites:**
- Developer org or sandbox with some Opportunity and Case sample data
- At least 5 Accounts with Opportunities
- Collaborative Forecasting or basic reporting enabled

---

## Lab A: Joined Report — Account Health Overview

### Business Requirement
Create a single report showing each Account with:
- Their open Opportunities (count and total amount)
- Their open Cases (count)
Side by side in one report grouped by Account.

### Step A1: Create the Joined Report

1. Navigate to Reports > New Report
2. Select report type: **Opportunities**
3. Before running, click the dropdown on "Report Format" (or look for "Add Report Type" in modern Lightning UI)
4. Select **Joined** format (some orgs require: click the Format dropdown at the top of Report Builder)
5. The first block is now Block 1: Opportunities

### Step A2: Configure Block 1 (Opportunities)

1. In Block 1, select the **Opportunities** report type
2. Add columns:
   - Account Name
   - Opportunity Name
   - Amount
   - Close Date
   - Stage
3. Add filters:
   - Stage not equal to "Closed Won," "Closed Lost" (open opportunities only)
4. Group by: **Account Name**

### Step A3: Add Block 2 (Cases)

1. Click "Add Report Type" or "+" to add Block 2
2. Select: **Cases** report type
3. Add columns:
   - Account Name
   - Case Number
   - Status
   - Priority
4. Add filters:
   - Status not equal to "Closed"
5. Group by: **Account Name** (must match Block 1's grouping for the join to work)

### Step A4: Configure the Common Grouping

For the joined report to align by Account, both blocks must group by Account Name. Salesforce will align rows where Account Name matches across blocks.

### Step A5: Add a Summary Formula Across Blocks

1. In the Summary section, look for "Add Cross-Block Summary Formula"
2. Name: **Total Open Pipeline**
3. Formula: `OPEN_OPPS:SUM(Amount)` (block-specific reference to Block 1's Amount SUM)
4. Format: Currency

### Step A6: Run and Review

1. Save the report as **Account Health — Joined View**
2. Run the report
3. Verify: Accounts appear as rows, with Opportunity data in Block 1 columns and Case data in Block 2 columns
4. Accounts with no open opportunities show blank in Block 1 columns (not missing rows)

### Lab A Verification

- [ ] Report format is Joined (not Summary or Matrix)
- [ ] Block 1: Opportunities with filters and Account Name grouping
- [ ] Block 2: Cases with filters and Account Name grouping
- [ ] Both blocks grouped by Account Name (the "join" column)
- [ ] Report runs and shows Account-level alignment across both blocks
- [ ] Note: You CANNOT add this to a dashboard — verify by trying to add it to a dashboard component

---

## Lab B: Summary Formula Report — Opportunity Win Rate

### Business Requirement
Create a report showing each Sales Rep's win rate (Closed Won / Total Closed opportunities) for the last 90 days.

### Step B1: Create the Report

1. New Report
2. Report Type: **Opportunities**
3. Format: **Summary**

### Step B2: Configure Columns and Filters

Columns:
- Opportunity Name
- Stage
- Amount
- Close Date
- Owner Full Name

Filters:
- Close Date: Last 90 Days
- Stage: equals "Closed Won" OR "Closed Lost" (only completed deals)

Group By:
- Drag "Owner Full Name" to the grouping area

### Step B3: Add a Summary Formula — Win Rate

1. In the Fields panel, click "Summary Formulas" > "New Summary Formula"
2. Name: **Win Rate %**
3. Output Type: Percent (or Number with decimal)
4. Formula:
```
DIVNULL(
  COUNT_DISTINCT(IF(StageName = "Closed Won", Id, null)),
  RECORD_COUNT,
  0
) * 100
```

Actually, since Summary Formula fields work differently than row formulas, use:
```
DIVNULL(SUM(IsWon), COUNT(ROWS), 0) * 100
```

Where `IsWon` is a checkbox on Opportunity (TRUE = 1 for sum purposes).

4. Select: Display at all summary levels
5. Save the formula

### Step B4: Alternative Simpler Approach (If the Above Formula Doesn't Work)

Some formula approaches depend on org configuration. A reliable alternative:

1. Create a custom formula field on Opportunity:
   - Name: `Won_Flag__c`
   - Formula: `IF(IsWon, 1, 0)`
   - Output: Number (0 decimal places)

2. In the report's summary formula:
   ```
   DIVNULL(SUM(Won_Flag__c), COUNT(ROWS), 0) * 100
   ```

### Step B5: Run and Observe

1. Run the report
2. The Win Rate % column appears only at the grouping (per rep) and grand total rows — NOT on individual opportunity rows
3. This is the key behavior of Summary Formulas

### Lab B Verification

- [ ] Report grouped by Owner Full Name
- [ ] Summary Formula shows at group subtotal and grand total rows only
- [ ] DIVNULL prevents divide-by-zero for reps with no opportunities
- [ ] Win Rate calculates correctly (verify manually for one rep)
- [ ] Individual opportunity rows do NOT show a win rate value

---

## Lab C: Dynamic Dashboard

### Business Requirement
Sales reps want to see their own personal pipeline dashboard. Managers want to see their team's pipeline.

### Step C1: Create the Source Reports

Create two reports:
1. **My Open Pipeline** — Opportunities filtered by "My team's opportunities," grouped by Stage
2. **My Cases** — Cases owned by current user or their team, grouped by Priority

(Note: For a Dynamic Dashboard to work, source reports must be able to return different data based on the running user.)

### Step C2: Create the Dashboard

1. Navigate to Dashboards > New Dashboard
2. Name: **Personal Pipeline Dashboard**
3. Click "Edit" to enter edit mode

### Step C3: Add Dashboard Components

Add two chart components:
1. **Component 1:** Bar chart from "My Open Pipeline" report
   - Chart: Horizontal Bar
   - X-axis: Count of Opportunities or Sum of Amount
   - Y-axis: Stage
2. **Component 2:** Donut chart from "My Cases" report
   - Segment by Priority

### Step C4: Configure Dynamic Dashboard

1. In the Dashboard editor, look for "View Dashboard As" settings
2. Select: **The logged-in user** (this makes it a Dynamic Dashboard)
3. Save the dashboard

### Step C5: Test Dynamic Behavior

1. Log in as a sales rep user
2. View the dashboard
3. Note the data shown (only their own records)
4. Log in as a different rep
5. Verify they see THEIR own data, not the first rep's data

**Note:** Dynamic Dashboards have an org limit (5 for Enterprise, 10 for Unlimited). If the option to set "The logged-in user" is grayed out, you may have hit the limit.

### Lab C Verification

- [ ] Dashboard created with at least 2 components
- [ ] "View Dashboard As: The logged-in user" configured (Dynamic mode)
- [ ] Each rep sees only their own data when logged in
- [ ] Attempted to schedule the dynamic dashboard for email — verify this is blocked (Dynamic Dashboards cannot be scheduled)

---

## Lab D: Reporting Snapshot (Extension Lab)

### Business Requirement
Capture a weekly snapshot of the pipeline total for trend analysis.

### Step D1: Create the Custom Object

1. Setup > Object Manager > Create > Custom Object
2. Label: **Pipeline Snapshot**
3. API Name: `Pipeline_Snapshot__c`
4. Add fields:
   - `Snapshot_Date__c` (Date)
   - `Total_Pipeline__c` (Currency)
   - `Open_Opp_Count__c` (Number)

### Step D2: Create the Source Report

1. New Report > Opportunities
2. Filter: Stage not equal to Closed Won, Closed Lost
3. Format: Summary
4. Summary fields: Sum of Amount, Count of Rows (record count)

### Step D3: Create the Reporting Snapshot

1. Setup > Reporting Snapshots > New Reporting Snapshot
2. Name: Weekly Pipeline Snapshot
3. Running User: select an admin user (they must have access to all opportunities)
4. Source Report: select the report created in D2
5. Target Object: `Pipeline_Snapshot__c`
6. Field Mapping:
   - Report's Total Amount → `Total_Pipeline__c`
   - Report's Record Count → `Open_Opp_Count__c`
7. Schedule: Weekly, every Monday at 6am
8. Save

### Lab D Verification

- [ ] Custom object `Pipeline_Snapshot__c` created
- [ ] Reporting Snapshot configured with field mapping
- [ ] Schedule set to weekly
- [ ] (To test immediately: use "Run Now" if available, or manually trigger)

---

## Summary: Key Concepts from These Labs

| Feature | Lab | Key Learning |
|---|---|---|
| Joined Reports | Lab A | Multi-block reports; cannot be used as dashboard sources |
| Summary Formulas | Lab B | Display at group/total levels only; DIVNULL prevents errors |
| Dynamic Dashboards | Lab C | Each viewer sees their own data; cannot be scheduled |
| Reporting Snapshots | Lab D | Long-term trend data stored in custom objects; periodic capture |

---

## PTA Notes

**During architecture reviews, ask about reporting requirements early:**
- "Do executives need to see different data than reps?" → Dynamic vs. Standard dashboard
- "Do you need pipeline trend data over 6+ months?" → Reporting Snapshots (Historical Trending only covers 90 days)
- "Do you need a single report showing multiple related datasets?" → Joined Report (but warn about dashboard limitation)
- "Do you need win rate or conversion metrics?" → Summary Formulas

A good dashboard architecture conversation with a customer covers: who the audience is, what decisions the dashboard enables, and how often the data needs to be refreshed.
