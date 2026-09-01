# Lab 02: Configure Identity Resolution

## Lab Overview

**Objective:** Configure an Identity Resolution ruleset with match rules and reconciliation rules. Run the ruleset and review the resulting Unified Individual profiles.

**Estimated Time:** 45–60 minutes

**Prerequisites:**
- Lab 01 completed (Individual and Contact Point Email DMOs populated)
- Ideally, 2+ Data Streams providing Individual records from different sources (for seeing actual merges)
- Data Cloud Admin permission set

**Exam relevance:** This lab covers Data Modeling & Identity Resolution (17%) — the second-largest content domain.

---

## Learning Goals

After completing this lab, you will be able to:
- Navigate to the Identity Resolution section in Data Cloud
- Create an Identity Resolution Ruleset
- Configure exact match and normalized match rules
- Configure reconciliation rules using Source Priority strategy
- Run the ruleset and interpret the resulting metrics
- Inspect a Unified Individual profile in the Data Cloud UI

---

## Lab Steps

### Part 1: Navigate to Identity Resolution

1. Open the **Data Cloud** app.
2. Navigate to **Identity Resolution** (in the left navigation or via Setup → Data Cloud → Identity Resolution).
3. You will see the Identity Resolution overview page showing any existing rulesets.
4. Note the two main sections: **Rulesets** (where you configure rules) and **Unified Individuals** (where you review results).

**Checkpoint:** You should see the Identity Resolution page. If Individual DMO records don't exist (from Lab 01), Identity Resolution will have nothing to process.

---

### Part 2: Create a New Identity Resolution Ruleset

1. Click **New Ruleset**.
2. Enter a **Name** for the ruleset: `Standard_Identity_Resolution`.
3. Enter a **Description**: `Matches Individual records by email and name using CRM as primary source`.
4. Click **Save** (or **Next** to proceed to rule configuration).

---

### Part 3: Configure Match Rules

You will configure two match rules: one for email (exact match on Contact Point Email) and one for name + city (fuzzy + normalized match for backup matching).

**Match Rule 1: Email Address (Exact Match)**

1. In the ruleset, click **Add Match Rule**.
2. Select **Match Type**: **Exact Match**.
3. Select **DMO**: **Contact Point Email**.
4. Select **Field**: **EmailAddress**.
5. Leave the configuration as default (case-insensitive comparison is applied automatically for email).
6. **Match Rule Priority**: set to 1 (highest priority).
7. Click **Save Match Rule**.

**Explanation:** This rule says: if two Individual records have Contact Point Email records with the same email address, they are the same person. This is your highest-confidence matching rule.

**Match Rule 2: Name + Phone (Normalized Match)**

1. Click **Add Match Rule** again.
2. Select **Match Type**: **Normalized Match**.
3. Select **DMO**: **Individual**.
4. Select **Field**: **FirstName** with normalization: **Name normalization** (removes salutations, lowercases).
5. Add a second field condition: **LastName** with same name normalization.
6. Add a third field condition: **Phone** from Contact Point Phone with Phone normalization.
7. Match logic: ALL three conditions must match (AND).
8. **Match Rule Priority**: set to 2.
9. Click **Save Match Rule**.

**Explanation:** This backup rule matches on normalized first name + last name + phone number. Catches cases where two sources have the same person but with slightly different name formats.

---

### Part 4: Configure Reconciliation Rules

Reconciliation rules determine which source's values appear on the Unified Individual when sources disagree.

1. Click **Add Reconciliation Rule** (or navigate to the Reconciliation Rules section of the ruleset).
2. Configure the following:

**Rule 1: Source Priority for Name Fields**
- Field: **FirstName** on Unified Individual
- Strategy: **Source Priority**
- Source ranking: (1) Salesforce CRM — rank CRM as highest trust for name data
- If you have additional sources: rank them below CRM

**Rule 2: Most Recent for Address**
- Field: **MailingCity** (or AddressCity on Unified Individual)
- Strategy: **Most Recent**
- Rationale: Address data changes — trust the most recently updated record

**Rule 3: Most Occurred for Loyalty Tier (if applicable)**
- Field: **LoyaltyTier** (custom field, if available)
- Strategy: **Most Occurred**
- Rationale: Trust the value that appears most consistently across sources

3. Click **Save Reconciliation Rules**.

---

### Part 5: Run the Ruleset

1. Return to the Ruleset overview page.
2. Click **Run Now** (or the play button next to the ruleset name).
3. Wait for the run to complete (for small datasets, 1–5 minutes; larger datasets may take longer).
4. Monitor status: the ruleset status will show **Running** then **Success** (or **Failed**).

**Checkpoint:** If the run fails, check:
- Are there Individual DMO records? (Check Data Explorer → Individual)
- Are there Contact Point Email records? (Check Data Explorer → Contact Point Email)
- Is the EmailAddress field populated on Contact Point Email records?

---

### Part 6: Review Identity Resolution Metrics

After the run completes, review the metrics displayed on the Ruleset run result:

- **Source Individual Records Processed:** How many Individual DMO records were evaluated
- **Match Groups Created:** How many groups of matched records were found
- **Unified Individuals Created:** New Unified Individual records created
- **Unified Individuals Updated:** Existing Unified Individuals updated with new source records

**Expected outcome (for a single-source dataset from Lab 01):**
- Match Groups Created: likely 0 or very few (no cross-source duplicates if only one source)
- Unified Individuals Created: should equal the number of Individual records (each unmatched Individual becomes its own Unified Individual)

**If you have two sources:** You should see some match groups created where email addresses overlap between sources.

---

### Part 7: Inspect a Unified Individual Profile

1. Navigate to **Identity Resolution** → **Unified Individuals** (or **Data Cloud** → **Unified Profiles**).
2. Search for a specific customer by name or email.
3. Open a Unified Individual record.
4. Review the following sections:
   - **Profile Attributes:** The reconciled attribute values (from your reconciliation rules)
   - **Source Records:** The list of Individual DMO records merged into this Unified Individual
   - **Contact Points:** All email addresses and phone numbers linked to this individual

**Key Observations:**
- For a customer with records from 2 sources: you should see 2 source records listed and potentially 2 different email addresses in Contact Points
- The Profile Attributes show the "winning" values per your reconciliation rules (e.g., CRM name wins for FirstName)

---

### Part 8: Simulate a Multi-Source Merge (Optional — if only one source available)

If you only have one data source, simulate a second source by creating a few test Individual records manually via the Ingestion API or by creating a second Data Stream from a CSV file in S3.

Scenario: Create 3–5 test records in a CSV with the same email addresses as existing CRM Contacts but with slightly different name formats (e.g., "Robert" instead of "Bob"). Upload to S3 and ingest.

After ingestion and re-running the Identity Resolution ruleset, these should merge with the existing CRM Contact Unified Individuals.

---

## Troubleshooting Guide

| Problem | What to Check |
|---|---|
| Ruleset shows 0 Source Individual Records Processed | Individual DMO has no records — go back and verify Lab 01 field mapping saved and Data Stream ran |
| Ruleset shows 0 Match Groups despite having duplicate customers | Contact Point Email DMO is empty or EmailAddress field is unmapped — fix mapping and re-run |
| Ruleset run status: Failed | Check the Identity Resolution error log in Data Cloud Admin for specific error messages |
| Unified Individual shows blank fields | Reconciliation rules may not cover the field — check if a reconciliation rule is configured for that attribute |
| Contact Points section on Unified Individual is empty | Contact Point Email records exist but are not linked to Individual via IndividualId — verify IndividualId mapping from Lab 01 |

---

## Lab Reflection Questions

1. If your Identity Resolution run produced 0 match groups even though you have 500 Individual records, what are the two most likely root causes?

2. You configured Source Priority reconciliation for FirstName with CRM ranked first. A customer has "Elizabeth" in CRM and "Liz" in the e-commerce system. What name appears on the Unified Individual? Why?

3. You want to add a third match rule: match on phone number only (exact match). What risk does this introduce, and how would you mitigate it?

4. A marketing analyst says the segment she built is returning unexpected customers. She suspects Identity Resolution merged records incorrectly. Where in the Data Cloud UI would you investigate the merge quality?

---

## Exam Connection

This lab directly reinforces the following exam topics:
- **Data Modeling & Identity Resolution (17%):** Match rule types (exact, normalized, fuzzy), reconciliation strategies (Source Priority, Most Recent, Most Occurred), Unified Individual creation and inspection
- **Data Cloud Fundamentals (13%):** Understanding the difference between Individual DMO records (source records) and Unified Individual records (resolved profile)
- **Administration & Governance (13%):** Using Data Cloud Admin UI to monitor Identity Resolution job runs and interpret metrics
