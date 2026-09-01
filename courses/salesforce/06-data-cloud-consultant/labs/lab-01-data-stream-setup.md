# Lab 01: Set Up a Salesforce CRM Data Stream

## Lab Overview

**Objective:** Configure a Salesforce CRM Data Stream that ingests Contact records from Salesforce CRM into Data Cloud, and map the fields to the standard Individual and Contact Point Email DMOs.

**Estimated Time:** 45–60 minutes

**Prerequisites:**
- Access to a Salesforce org with Data Cloud provisioned
- Data Cloud Admin or Data Aware Specialist permission set assigned
- Sample Contact records in the org (at least 10–20 for testing)

**Exam relevance:** This lab covers Data Ingestion (17%) and Data Modeling & Identity Resolution (17%) — combined 34% of the exam.

---

## Learning Goals

After completing this lab, you will be able to:
- Navigate to the Data Cloud setup and locate Data Streams
- Configure a Salesforce CRM connector Data Stream for the Contact object
- Select appropriate fields for ingestion
- Map DLO fields to the Individual standard DMO
- Map DLO fields to the Contact Point Email standard DMO
- Verify that data has landed in the DLO and DMO

---

## Lab Steps

### Part 1: Access Data Cloud Setup

1. Log in to your Salesforce org.
2. Click the **App Launcher** (grid icon) and search for **Data Cloud**.
3. Open the **Data Cloud** app.
4. Navigate to **Setup** (gear icon) → **Data Cloud** → **Data Streams**.
5. You will see the Data Streams list page. Note any existing Data Streams.

**Checkpoint:** You should see the Data Streams list page. If you see a permission error, verify that the Data Cloud Admin permission set is assigned to your user.

---

### Part 2: Create a New Salesforce CRM Data Stream

1. Click **New** to create a new Data Stream.
2. In the connector selection screen, choose **Salesforce CRM**.
3. Click **Next**.
4. In the **Connected Org** dropdown, select your Salesforce org (it may already be selected if you're in the same org).
5. In the **Object** dropdown, select **Contact**.
6. Click **Next**.

**Field Selection:**
7. On the field selection screen, select the following fields:
   - `Id` (required — will serve as Primary Key)
   - `FirstName`
   - `LastName`
   - `Email`
   - `Phone`
   - `MailingCity`
   - `MailingState`
   - `MailingCountry`
   - `Birthdate`
   - `HasOptedOutOfEmail`
   - `CreatedDate`
   - `LastModifiedDate`
8. Click **Next**.

**Refresh Configuration:**
9. Set **Refresh Type** to **Incremental** (syncs only changed records after the first full load).
10. Set **Refresh Schedule** to **12 Hours**.
11. Enter a **Name** for the Data Stream: `CRM_Contact_Stream`.
12. Click **Save & Run** to save and trigger the first ingestion immediately.

**Checkpoint:** The Data Stream should show a status of "Running" and then "Success." If it shows "Failed," check the connection configuration.

---

### Part 3: Verify Data Landed in the DLO

1. Navigate to **Data Cloud** → **Data Explorer** (or Setup → Data Cloud → Data Explorer).
2. In the Object dropdown, look for a DLO named `CRM_Contact_Stream` or similar.
3. Click on the DLO to preview its data.
4. Verify that Contact records have populated the DLO with the fields you selected.
5. Note the raw field names — they match exactly what Salesforce CRM uses (`FirstName`, `Email`, etc.).

**Key Observation:** The DLO contains data exactly as it came from the source. No transformation has occurred yet.

---

### Part 4: Map Fields to the Individual DMO

1. Navigate to **Data Cloud** → **Data Streams** → open `CRM_Contact_Stream`.
2. Click the **Map** button (or navigate to the Mapping section).
3. Click **New Mapping**.
4. In the **Target DMO** dropdown, select **Individual**.
5. Map the following fields:

| DLO Field | Individual DMO Field | Notes |
|---|---|---|
| Id | PartyId | Primary Key |
| FirstName | FirstName | |
| LastName | LastName | |
| Birthdate | Birthdate | |
| MailingCity | AddressCity | |
| MailingState | AddressStateProvince | |
| MailingCountry | AddressCountry | |

6. Ensure the **Primary Key** field (PartyId) is marked correctly.
7. Click **Save**.

**Checkpoint:** After saving, the mapping should show all fields mapped without errors. A red error indicator means a data type mismatch — check the source and target field types.

---

### Part 5: Map Fields to the Contact Point Email DMO

1. In the same Data Stream mapping screen, click **New Mapping** again.
2. This time, select **Contact Point Email** as the **Target DMO**.
3. Map the following fields:

| DLO Field | Contact Point Email DMO Field | Notes |
|---|---|---|
| Id | ContactPointEmailId | Primary Key (or use a formula to derive a unique ID) |
| Email | EmailAddress | Required for Identity Resolution |
| HasOptedOutOfEmail | HasOptedOutOfEmail | Consent field |
| Id | IndividualId | Links the Contact Point to the Individual record |

**Note on IndividualId:** The `Id` field from the DLO maps to both the Individual DMO's `PartyId` (as the person's ID) AND to the Contact Point Email's `IndividualId` (as the foreign key linking the email address to the person). This is normal and correct.

4. Click **Save**.

---

### Part 6: Trigger a Data Processing Run

1. Navigate to **Data Cloud Admin** → **Job Scheduler**.
2. Find or create a job to run Identity Resolution after the Data Stream completes.
3. Alternatively, navigate to **Identity Resolution** → **Rulesets** and run any existing ruleset manually (we'll configure a proper ruleset in Lab 02).
4. Return to **Data Streams** and trigger a manual run of `CRM_Contact_Stream` if the initial run was more than 30 minutes ago.

---

### Part 7: Verify DMO Data

1. Navigate to **Data Explorer**.
2. In the Object dropdown, select **Individual**.
3. Verify that Individual records now exist, populated with the mapped Contact data.
4. In the Object dropdown, select **Contact Point Email**.
5. Verify that Contact Point Email records exist with `EmailAddress` populated.

**Key Observation:** Compare the DLO record count with the Individual and Contact Point Email record counts. They should be roughly equal (one Individual and one Contact Point Email per Contact record).

---

## Troubleshooting Guide

| Problem | What to Check |
|---|---|
| Data Stream shows "Failed" status | Check the Salesforce Connector connection; verify org credentials |
| DLO has no records | Wait 2–3 minutes and refresh; check ingestion job status in Data Cloud Admin |
| Field mapping shows type mismatch error | Compare source field type in CRM with target DMO field type; use formula transformation if needed |
| Individual DMO shows no records after mapping | Ensure the Primary Key (PartyId) is mapped; check that the Data Stream ran AFTER the mapping was saved |
| Contact Point Email records exist but IndividualId is blank | Verify the DLO `Id` field is mapped to both PartyId on Individual AND IndividualId on Contact Point Email |

---

## Lab Reflection Questions

Answer these questions after completing the lab:

1. What is the difference between the DLO record you saw in Data Explorer and the Individual DMO record? How did field mapping transform the data?

2. Why did you map the Contact `Id` field to both the Individual `PartyId` AND the Contact Point Email `IndividualId`? What would break if the `IndividualId` mapping were missing?

3. The `HasOptedOutOfEmail` field was mapped to the Contact Point Email DMO. In what scenario would this field affect Data Cloud operations downstream?

4. If you now added a second Data Stream from an e-commerce system with email addresses — what would need to happen for Identity Resolution to link those e-commerce customers with the CRM Contacts you just ingested?

---

## Exam Connection

This lab directly reinforces the following exam topics:
- **Data Ingestion (17%):** Configuring a Salesforce Connector Data Stream, selecting incremental refresh, field selection
- **Data Modeling & Identity Resolution (17%):** Mapping DLO fields to standard DMOs (Individual, Contact Point Email), understanding the Primary Key requirement and the IndividualId foreign key
- **Administration & Governance (13%):** Navigating the Data Cloud Admin UI, checking job status, using Data Explorer for verification
