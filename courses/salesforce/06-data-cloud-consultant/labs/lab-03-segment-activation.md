# Lab 03: Build a Segment with Calculated Insight and Create an Activation Target

## Lab Overview

**Objective:** Create a Calculated Insight that computes customer purchase metrics, build a segment that uses the CI in its criteria, and configure an Activation Target to publish the segment.

**Estimated Time:** 60–75 minutes

**Prerequisites:**
- Labs 01 and 02 completed (Unified Individual profiles exist)
- Sales Order DMO populated (either from a Data Stream or test data)
- Data Cloud Admin or Data Aware Specialist permission set
- If activating to Marketing Cloud: Marketing Cloud Connector configured

**Exam relevance:** This lab covers Segmentation & Insights (13%) and Activation & Engagement (10%) — combined 23% of the exam.

---

## Learning Goals

After completing this lab, you will be able to:
- Create a Calculated Insight using ANSI SQL with aggregation functions
- Use a Calculated Insight as a segment criteria source
- Combine CI criteria with attribute and related attribute filters in a segment
- Add a consent exclusion to a segment
- Configure a Salesforce CRM Activation Target
- Publish a segment to an Activation Target and verify activation

---

## Lab Steps

### Part 1: Verify Sales Order DMO Data

Before creating the CI, verify that Sales Order DMO has records to aggregate.

1. Navigate to **Data Cloud** → **Data Explorer**.
2. Select **Sales Order** from the Object dropdown.
3. Confirm records exist with `IndividualId`, `TotalAmount`, and `OrderDate` fields populated.

**If Sales Order DMO has no records:**
Create a simple CSV with columns: `SalesOrderId, IndividualId, TotalAmount, OrderDate, Status`
Include `IndividualId` values that match existing Individual DMO primary keys.
Upload to S3 and create a Data Stream (or use the Ingestion API) to populate Sales Order DMO.

---

### Part 2: Create a Calculated Insight

1. Navigate to **Data Cloud** → **Calculated Insights** (or Setup → Data Cloud → Calculated Insights).
2. Click **New Calculated Insight**.
3. Enter the following metadata:
   - **Name:** `Customer_Purchase_90d`
   - **Description:** Computes total orders, total revenue, and last purchase date for each customer in the last 90 days

4. In the SQL editor, enter the following query:

```sql
SELECT
    i.Id AS IndividualId,
    COUNT(so.Id) AS TotalOrders_90d,
    SUM(so.TotalAmount) AS TotalRevenue_90d,
    AVG(so.TotalAmount) AS AvgOrderValue_90d,
    MAX(so.OrderDate) AS LastOrderDate_90d
FROM Individual__dlm AS i
JOIN SalesOrder__dlm AS so
    ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
    AND so.Status = 'Completed'
GROUP BY i.Id
```

**Note:** Replace `SalesOrder__dlm` and field names with the actual API names for your Sales Order DMO. The `__dlm` suffix is required for all DMOs in CI SQL.

5. Click **Preview** to validate the SQL against a sample of data.
6. Verify the preview shows columns: `IndividualId`, `TotalOrders_90d`, `TotalRevenue_90d`, `AvgOrderValue_90d`, `LastOrderDate_90d`.
7. Set **Refresh Schedule**: after the Data Stream refresh (e.g., if Data Stream runs at 2 AM, set CI to 4 AM).
8. Click **Save and Publish**.

**Checkpoint:** The CI should show a status of "Active." If the preview shows an error, check: correct DMO API names, proper `__dlm` suffix, and that the JOIN field name matches the actual IndividualId field name in your Sales Order DMO.

---

### Part 3: Build a Segment Using the Calculated Insight

1. Navigate to **Data Cloud** → **Segments**.
2. Click **New Segment**.
3. Enter segment details:
   - **Name:** `High_Value_Customers_90d`
   - **Description:** Customers with total revenue > $500 in the last 90 days
   - **Segment On:** Unified Individual

4. **Add Inclusion Criteria — Calculated Insight filter:**
   - Click **Add Criteria**.
   - Select **Calculated Insight** as the criteria source.
   - Select **Customer_Purchase_90d** as the CI.
   - Select measure: **TotalRevenue_90d**.
   - Set operator: **greater than or equal to**.
   - Set value: **500**.

5. **Add Inclusion Criteria — Attribute filter:**
   - Click **Add Criteria** (with AND logic).
   - Select **Unified Individual** → **Individual** → **MailingCountry**.
   - Set operator: **equals**.
   - Set value: **US** (or leave this out if your dataset is small).

6. **Add Exclusion Criteria — Consent:**
   - Click **Add Exclusion**.
   - Navigate to **Contact Point Email** → **HasOptedOutOfEmail**.
   - Set operator: **equals**.
   - Set value: **true**.
   - This excludes anyone who has opted out of email from this segment.

7. Review the **Estimated Membership Count** — it should show a preview count.
8. Click **Save** to save as Draft.

---

### Part 4: Preview and Publish the Segment

1. Open the `High_Value_Customers_90d` segment.
2. Click **Preview** to see a sample of the customer records in the segment.
3. Verify the members shown have `TotalRevenue_90d >= 500` in their CI values (you can spot-check via Data Explorer).
4. When satisfied with the segment logic, click **Publish** to change the status from Draft to Published.

**Checkpoint:** The segment status should now show **Published**. Only published segments can be added to Activation Targets.

---

### Part 5: Create a Salesforce CRM Activation Target

1. Navigate to **Data Cloud** → **Activation Targets**.
2. Click **New Activation Target**.
3. Select **Salesforce CRM** as the target type.
4. Click **Next**.
5. Configure the Activation Target:
   - **Name:** `CRM_High_Value_Campaign`
   - **Connected Org:** Select your CRM org
   - **Target Object:** Select **Campaign** (you'll be creating a new Campaign or using an existing one)
   - **Campaign Name:** `Data Cloud High Value Segment 90d`

6. Configure field mappings for Campaign Member:
   - Map **Unified Individual ID** to Campaign Member's `ContactId` (or `LeadId` depending on your data)

7. Click **Save**.

---

### Part 6: Add the Segment to the Activation Target

1. Open the `CRM_High_Value_Campaign` Activation Target.
2. Click **Add Segment**.
3. Select **High_Value_Customers_90d** from the segment list.
4. Configure:
   - **Contact Point:** Email Address (select the contact point type)
   - **Activation Attributes:** Add `TotalRevenue_90d` and `LastOrderDate_90d` from the CI to send alongside membership
5. Set **Publish Schedule**: every 24 hours.
6. Click **Publish Now** to trigger an immediate activation run.

**Checkpoint:** After a few minutes, the activation should complete. Check the Activation Log for status.

---

### Part 7: Verify Activation in CRM

1. Navigate to your Salesforce CRM (or switch to CRM view if in the same org).
2. Go to **Campaigns** and find the `Data Cloud High Value Segment 90d` Campaign.
3. Open the Campaign and click on the **Campaign Members** related list.
4. Verify that Contact or Lead records appear as Campaign Members corresponding to the customers in your segment.

**Expected outcome:** The number of Campaign Members should match the activation membership count (which may be slightly less than segment count if some members lack email addresses or have opted out).

---

### Part 8: Review the Full Pipeline

Take a moment to trace the complete pipeline you've built across all three labs:

1. **Lab 01:** Data Stream ingests CRM Contacts → lands in DLO → mapped to Individual and Contact Point Email DMOs
2. **Lab 02:** Identity Resolution runs → matches Individual records → creates Unified Individual profiles
3. **Lab 03:**
   - Calculated Insight computes TotalRevenue_90d per Unified Individual from Sales Order DMO
   - Segment filters Unified Individuals where TotalRevenue_90d >= $500 AND not opted out
   - Activation Target publishes segment members as Campaign Members in Salesforce CRM

This is the complete Data Cloud workflow from raw source data to activated customer audience.

---

## Troubleshooting Guide

| Problem | What to Check |
|---|---|
| CI preview shows no results | Sales Order DMO has no records, or the JOIN field name is incorrect |
| CI preview shows SQL error | Check DMO API names have `__dlm` suffix; verify JOIN field exists |
| Segment shows 0 estimated members | CI refresh may not have run; check CI status in Data Cloud Admin |
| Segment can't be added to Activation Target | Segment is still in Draft status — click Publish first |
| Activation run shows 0 activated members | Segment has consent exclusions removing all members, OR no members have a valid email contact point |
| Campaign Members not appearing in CRM | Activation completed but check whether the Campaign record was created in the right org |

---

## Lab Reflection Questions

1. You set the CI refresh schedule to 4 AM (after the 2 AM Data Stream). The segment refresh is set to 6 AM. Why is this ordering important, and what would happen if the segment refreshed at 3 AM instead?

2. The activation membership count (50) is lower than the segment membership count (75). What are the two most likely reasons for this discrepancy?

3. You added TotalRevenue_90d as an Activation Attribute. In the Salesforce CRM Campaign Member, where would this value appear? How could the sales team use it?

4. If you wanted to activate this same segment to Marketing Cloud for email outreach AND to Facebook Custom Audiences for ad targeting simultaneously, what would you need to configure?

5. A new customer made a qualifying purchase yesterday (exceeding $500 in the last 90 days). At what point would they appear in the activated Campaign? Walk through each step with the schedule timings from this lab.

---

## Exam Connection

This lab directly reinforces the following exam topics:
- **Segmentation & Insights (13%):** Creating a Calculated Insight with SQL, using CI in segment criteria, segment publish workflow, consent exclusions
- **Activation & Engagement (10%):** Configuring a Salesforce CRM Activation Target, activation membership vs. segment membership, publish schedules, activation attributes
- **Data Cloud Fundamentals (13%):** The end-to-end pipeline from data ingestion through to segment activation
- **Administration & Governance (13%):** Monitoring activation job status, troubleshooting activation discrepancies
