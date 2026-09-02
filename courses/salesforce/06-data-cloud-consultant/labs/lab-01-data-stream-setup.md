# Lab 01: Data Stream Setup

## Lab Domain
Data Ingestion & Configuration — hands-on for exam scenario questions

## What You Need to Be Able to Do

### Salesforce Connector Setup
- [ ] Navigate to Data Cloud Setup → Connectors → New Salesforce CRM Connector
- [ ] Select the Salesforce Org to connect (sandbox or production)
- [ ] Choose which standard and custom objects to ingest (Contact, Lead, Opportunity, Account, etc.)
- [ ] Confirm the resulting Data Stream(s) are created in Data Cloud
- [ ] Verify the auto-created DLOs appear with correct field counts

### Cloud Storage (S3/GCS/Azure) Connector
- [ ] Set up a Cloud Storage Connector pointing to an S3 bucket (or GCS/Azure equivalent)
- [ ] Specify the file format: CSV, JSON, or Parquet
- [ ] Configure the file path/prefix pattern that Data Cloud polls for new files
- [ ] Confirm the Data Stream picks up an initial file and the DLO is populated
- [ ] Understand what happens when a malformed file is dropped in the bucket

### Ingestion API Data Stream
- [ ] Create a Connected App in Salesforce Setup (not Data Cloud) with OAuth 2.0 Client Credentials enabled
- [ ] Enable the `cdp_ingest_api` OAuth scope on the Connected App
- [ ] Note the Consumer Key and Consumer Secret
- [ ] Create the Ingestion API-type Data Stream in Data Cloud → choose schema (define fields + data types)
- [ ] Send a test POST request to the Ingestion API endpoint using the OAuth access token
- [ ] Confirm records appear in the target DLO

### Data Stream Configuration Details
- [ ] Set the refresh schedule (options: 1h, 6h, 12h, 24h — understand that sub-1h is not supported)
- [ ] Understand the difference between Full Refresh (replaces all records) and Upsert (updates/inserts based on PK)
- [ ] Configure the Primary Key field — understand that missing or misconfigured PK causes ingestion failures
- [ ] Run the Data Stream manually and observe the Job History
- [ ] Interpret job statuses: Success, Failed, Partially Succeeded, Running
- [ ] For Partially Succeeded: navigate to failed records detail, download error report, identify root cause

### Data Quality Rules (Bonus)
- [ ] Add a Flag rule on a required field (e.g., flag if email is null)
- [ ] Add a Reject rule on the Primary Key (reject records with null PK)
- [ ] Observe how Reject rules affect the job completion status and record count in DLO

---

## Key Checks After Lab Completion

Before moving on, verify:
- DLOs are visible in Data Cloud under Data Lake Objects
- DLO record count matches expected source record count
- At least one Data Stream shows "Success" status in Job History
- You can identify the Primary Key field on the DLO
- You know where to find and read failed record error messages

---

## Common Lab Mistakes to Avoid

- Using username/password OAuth flow for Ingestion API — must use Client Credentials (no username/password)
- Forgetting to add `cdp_ingest_api` scope to the Connected App — requests will fail with 401
- Choosing Full Refresh for an incremental source — this wipes and replaces all records on each run (only use Full Refresh when the source always sends the complete dataset)
- Setting a 1h refresh on a large S3 file — this causes overlap/contention if the file hasn't changed
- Not checking Job History after running — assuming success without verification
