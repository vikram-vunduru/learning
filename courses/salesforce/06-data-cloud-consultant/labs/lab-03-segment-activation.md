# Lab 03: Segment with Calculated Insight + Activation Target

## Lab Domain
Segmentation & Insights (13%) + Activation & Engagement (10%) — combined 23% of exam

## PTA / SA Relevance

This lab covers the most business-visible part of Data Cloud — the part that produces tangible output (campaign audiences, email sends, ad suppression). In client engagements, the "does it work?" moment is always the first activation: did the right customers show up in Marketing Cloud? Did the Campaign Members appear in CRM? Knowing how to build, troubleshoot, and validate this end-to-end is what separates a credible implementation from a stalled pilot.

**Common enterprise failure patterns this lab prevents:**
- Publishing segments without verifying CI refresh order (stale data activates)
- Forgetting consent exclusions (compliance incident waiting to happen)
- Mapping Subscriber Key incorrectly in MC activation (all records rejected)
- Not checking the activation log, then investigating the wrong layer of the stack

---

## What You Need to Be Able to Do

### Verify DMO Data Before Building CI
- [ ] Navigate to Data Cloud → Data Explorer, select the Sales Order DMO
- [ ] Confirm records exist with IndividualId, TotalAmount, and OrderDate fields populated
- [ ] Spot-check that IndividualId values in Sales Order DMO match Individual DMO primary keys — mismatched FKs mean CI will produce 0 results even if both DMOs have records

### Create a Calculated Insight
- [ ] Navigate to Data Cloud → Calculated Insights → New Calculated Insight
- [ ] Write valid ANSI SQL with:
  - [ ] `__dlm` suffix on every DMO API name in the query
  - [ ] `GROUP BY` clause present (required — CI won't save without it)
  - [ ] At least one aggregate function (COUNT, SUM, MAX, AVG)
  - [ ] Correct JOIN condition using the IndividualId FK between DMOs
- [ ] Click Preview — verify output columns match expected dimensions and measures
- [ ] Set refresh schedule AFTER the Data Stream runs (not before — this is a job dependency trap)
- [ ] Save and Publish the CI — confirm status shows Active (not Draft)

**Example CI structure to know:**
```sql
SELECT i.Id AS IndividualId,
       COUNT(so.Id) AS TotalOrders_90d,
       SUM(so.TotalAmount) AS TotalRevenue_90d,
       MAX(so.OrderDate) AS LastOrderDate_90d
FROM Individual__dlm AS i
JOIN SalesOrder__dlm AS so ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
GROUP BY i.Id
```

### Build a Segment Using the CI
- [ ] Navigate to Data Cloud → Segments → New Segment, set Segment On = Unified Individual
- [ ] Add a Calculated Insight filter:
  - [ ] Select the published CI → choose the measure field → set threshold (e.g., TotalRevenue_90d >= 500)
- [ ] Add an Attribute Filter (direct on Unified Individual, e.g., MailingCountry = "US")
- [ ] Add an Exclusion criteria: Contact Point Email → HasOptedOutOfEmail = true
  - [ ] This is non-negotiable for any email-targeted segment
- [ ] Review Estimated Membership Count — if 0, CI may not have refreshed yet
- [ ] Save as Draft first, review, then click Publish
- [ ] Confirm segment status changes to Published

### Configure a Salesforce CRM Activation Target
- [ ] Navigate to Data Cloud → Activation Targets → New → select Salesforce CRM
- [ ] Configure: Connected Org, target Campaign name
- [ ] Map Unified Individual ID → Campaign Member ContactId (or LeadId)
- [ ] Save the Activation Target

### Configure a Marketing Cloud Activation Target (know the steps even if not running it)
- [ ] Select Marketing Cloud as target type
- [ ] Requires MC Connector already configured
- [ ] Configure Subscriber Key mapping — this is the critical step: maps Data Cloud's contact identifier to MC's Subscriber Key field
  - [ ] If Subscriber Key is not mapped correctly, all activation records are rejected by MC
- [ ] Select or name the target Data Extension

### Add Segment to Activation Target and Publish
- [ ] Open the Activation Target → Add Segment → select the Published segment
- [ ] Configure Contact Point (e.g., Email Address)
- [ ] Add Activation Attributes — additional CI or DMO fields to include in the payload:
  - [ ] e.g., TotalRevenue_90d, LastOrderDate_90d (sent alongside membership for personalization)
- [ ] Set Publish Schedule (24h recommended)
- [ ] Click Publish Now for an immediate run

### Verify Activation Results
- [ ] Check the Activation Log for status: Completed (not Failed / Running)
- [ ] Navigate to CRM → Campaigns → find the Campaign → check Campaign Members related list
- [ ] Verify: activation membership count ≤ segment membership count
  - [ ] Difference = members with no valid email OR HasOptedOutOfEmail = true — this is expected behavior

---

## Troubleshooting Checklist

| Symptom | Check |
|---|---|
| CI Preview = no results | Sales Order DMO has 0 records, or JOIN field name is wrong |
| CI Preview = SQL error | Check `__dlm` suffix on DMO names; check GROUP BY present |
| Segment estimated count = 0 | CI refresh hasn't run yet; CI may still be in Draft (not Published) |
| Segment can't be added to AT | Segment is in Draft — must be Published first |
| Activation run = 0 members | All members excluded by consent, OR no members have a Contact Point Email |
| Campaign Members missing in CRM | Activation completed but check Activation Log for correct org; check Campaign was created in right CRM org |
| MC activation = all records rejected | Subscriber Key mapping is missing or maps to wrong identifier |

---

## End-to-End Pipeline Validation

After completing all three labs, trace the complete flow:

1. **Lab 01:** Data Stream ingests CRM Contacts → DLO created → Field Mapping → Individual DMO + Contact Point Email DMO populated
2. **Lab 02:** IR ruleset runs → matches Individual records by email → Unified Individuals created
3. **Lab 03:** CI computes TotalRevenue_90d per Unified Individual → Segment filters on CI + consent exclusion → Activation Target publishes Unified Individual members as CRM Campaign Members

**The segment membership count will be ≤ the Unified Individual count. The activation count will be ≤ the segment count. Both reductions are correct behavior — not errors.**

---

## Exam Connections from This Lab

- CI SQL requires `GROUP BY` and `__dlm` suffix — both are tested in scenario questions
- Segment must be Published before activation — Draft segments cannot be activated (tested repeatedly)
- HasOptedOutOfEmail exclusion is the correct consent pattern for email-targeted segments
- Activation membership < Segment membership is expected, not a bug
- Subscriber Key mapping is the critical MC activation configuration — wrong mapping = 0 delivered records
- Job dependency order: Data Stream → CI → Segment → Activation; CI scheduled before Data Stream = stale segment
