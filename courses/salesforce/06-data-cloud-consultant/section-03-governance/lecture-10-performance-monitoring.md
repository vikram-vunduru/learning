# Lecture 10: Performance Monitoring & Administration

## Learning Objectives
- Navigate the Data Cloud Admin UI to monitor ingestion jobs and system health
- Identify common ingestion errors and describe how to troubleshoot failed records
- Configure and interpret data quality rules in Data Cloud
- Describe the job scheduler and how to manage refresh dependencies

---

## Slides

### Slide 1: The Data Cloud Admin UI
**Visual:** A screenshot mockup of the Data Cloud Admin page in Salesforce Setup showing the main monitoring sections: Data Streams, Ingestion Jobs, Identity Resolution, Segments, and System Health.

**Content:**
- The **Data Cloud Admin UI** is the central monitoring console for all Data Cloud operations
- Accessible via: Salesforce Setup → Data Cloud → Data Cloud Admin
- Key monitoring sections:
  - **Data Streams** — view status, last run time, record counts for each Data Stream
  - **Ingestion Jobs** — detailed job history with success/failure status
  - **Identity Resolution** — ruleset run status, match counts, Unified Individual counts
  - **Segments** — segment membership counts, last refresh time, publish status
  - **Job Scheduler** — configure and monitor scheduled jobs

**Speaker Notes:** The Data Cloud Admin UI is the first place any consultant goes when something isn't working. Think of it as the operations dashboard for the entire Data Cloud pipeline. The exam tests whether you know WHERE to look for specific information. "Where would a consultant check to see if a Data Stream ran successfully yesterday?" → Data Streams or Ingestion Jobs section. "How do you check when Identity Resolution last ran and how many records were processed?" → Identity Resolution section. Familiarity with the navigation and structure of this UI, even if you haven't used it hands-on, will help you answer monitoring-related exam questions correctly.

---

### Slide 2: Monitoring Ingestion Jobs
**Visual:** An Ingestion Jobs table mockup showing columns: Job Name, Data Stream, Start Time, End Time, Status (Success/Failed/Running), Records Processed, Records Failed, and Error Count.

**Content:**
- Each Data Stream run creates an **Ingestion Job** record in the job history
- Job statuses: **Success, Failed, Running, Partially Succeeded**
- **Partially Succeeded:** Some records processed successfully, others failed
- Key metrics per job: records processed, records failed, start/end time, duration
- **Failed jobs:** Data was NOT ingested — investigate error details before re-running
- **Partially Succeeded jobs:** Some records landed, others were rejected — review failed record details
- Job history is retained for a configurable period (typically 30–90 days)

**Speaker Notes:** Monitoring ingestion jobs is fundamental operational knowledge. The status values are exam-relevant: "Partially Succeeded" is particularly tricky because it looks like success but means some records were rejected. The exam might ask "a Data Stream ran but some records are missing from the DMO — where should the consultant check?" The answer: Ingestion Jobs → find the relevant job → review the failed records. The distinction between Failed (nothing landed) and Partially Succeeded (some landed, some rejected) is commonly tested.

---

### Slide 3: Ingestion Errors — Common Causes
**Visual:** A table with two columns: "Error Type" and "Description/Resolution." Rows covering: data type mismatch, required field missing, duplicate primary key, file format error, connection timeout, and API rate limit.

**Content:**
- **Data type mismatch:** Source field value doesn't match DMO field type (e.g., text in a date field)
  - Resolution: Fix field mapping formula or correct source data
- **Required field missing:** A mapped field marked as required has null values in source
  - Resolution: Ensure source provides values for required fields; use default values if appropriate
- **Duplicate primary key:** Two source records have the same primary key value
  - Resolution: Investigate source data quality; may need to deduplicate at source
- **File format error:** CSV/JSON/Parquet file is malformed
  - Resolution: Fix the file structure and re-ingest
- **Connection timeout/authentication:** Source system connection failed
  - Resolution: Check credentials, network connectivity, and Connected App validity

**Speaker Notes:** These error types appear directly in exam scenario questions. The pattern is: "a consultant sees an error in the ingestion job log — describe what caused it and how to fix it." Data type mismatch is the most common real-world error — the source system changed its data format, or the initial field mapping had a type assumption that turned out to be wrong. Duplicate primary key errors indicate data quality issues at the source. Connection errors are usually credential or network issues. The resolution in all cases follows the same pattern: identify the error in the job log, fix the root cause, and re-run (or wait for the next scheduled run).

---

### Slide 4: Failed Records Investigation
**Visual:** A Data Stream job detail page mockup showing a "Failed Records" tab with sample rows, error codes, error messages, and the specific field/value that caused each failure.

**Content:**
- **Failed Records** tab in Ingestion Job detail shows each rejected record with its error
- Contains: the rejected record's values, error code, error message, and the specific field that caused the failure
- Can be **downloaded as a CSV** for bulk investigation
- Typical workflow: download failed records → identify pattern → fix root cause → re-ingest
- Failed records are NOT automatically retried — manual re-ingestion required after fixing the issue
- The Data Stream can be run manually (outside the schedule) once the issue is fixed

**Speaker Notes:** The Failed Records investigation workflow is a practical operational skill the exam tests in troubleshooting scenarios. The key operational fact: failed records are NOT automatically retried. After fixing the root cause (data quality issue, type mismatch, etc.), you must either wait for the next scheduled run or manually trigger the Data Stream to re-run. One subtle exam point: even if most records in a job succeeded, the failed records need to be addressed — their absence from the DMO could affect segment membership accuracy and Unified Individual completeness.

---

### Slide 5: Data Quality Rules
**Visual:** A Data Quality Rule configuration panel showing: Rule Name, Target DMO, Condition (e.g., EmailAddress does not contain "@"), Action (Flag, Reject, or Transform).

**Content:**
- **Data Quality Rules** allow proactive management of data quality during ingestion
- Configured at the DMO level — applied to records as they are ingested
- Rule conditions check for invalid values (missing @, invalid date range, empty required fields)
- Actions on rule violation:
  - **Flag:** Mark the record with a data quality indicator but allow ingestion
  - **Reject:** Prevent the record from being ingested (creates a failed record)
  - **Transform:** Apply a correction (e.g., trim whitespace, standardize casing)
- Data quality rules reduce downstream issues in identity resolution and segmentation

**Speaker Notes:** Data Quality Rules are a proactive governance tool that the exam tests from a design perspective. The three actions correspond to different levels of tolerance for bad data. "Flag" is permissive — bad records get in but are marked, allowing downstream investigation. "Reject" is strict — bad records are turned away at the door. "Transform" attempts to fix minor issues automatically. The exam might present a scenario about email validation: "a consultant wants to prevent records without valid email addresses from entering the Contact Point Email DMO" — the answer is a Data Quality Rule with a rejection action on the EmailAddress field where it doesn't contain "@".

---

### Slide 6: The Job Scheduler
**Visual:** A job scheduler timeline diagram showing three job types across a 24-hour period: Data Stream refresh (runs 2 AM), CI refresh (runs 4 AM, after Data Stream), and Segment refresh (runs 6 AM, after CI).

**Content:**
- The **Job Scheduler** controls when Data Streams, CIs, and Segment refreshes run
- Accessible in Data Cloud Admin UI → Job Scheduler
- Allows setting specific run times (not just intervals) for scheduled jobs
- **Job chaining:** configure a job to run AFTER another job completes (dependency management)
- Critical for ensuring correct data refresh order: Data Stream → DMO → CI → Segment
- Failed jobs do NOT automatically trigger downstream jobs — monitor the chain
- Manual job triggers available for on-demand runs outside the schedule

**Speaker Notes:** The Job Scheduler is the operational tool for managing the refresh dependency chain we've discussed throughout this section. The exam tests that you know the correct order (Data Stream → DMO → CI → Segment) and that job chaining is the feature that enforces this order. Without proper chaining, you risk running CI refresh before the underlying DMO data is updated, or segment refresh before the CI values are current. The practical exam scenario is usually: "segments aren't reflecting recent data" — and the answer involves checking the Job Scheduler to ensure jobs are properly chained and running in the correct order.

---

### Slide 7: Identity Resolution Monitoring
**Visual:** Identity Resolution status panel showing: Ruleset Name, Last Run Date, Status, Source Individual Records Processed, Match Groups Created, Unified Individuals Created/Updated.

**Content:**
- The **Identity Resolution** section in Admin UI shows ruleset run history
- Key metrics to monitor:
  - **Source records processed:** How many Individual DMO records were evaluated
  - **Match groups created:** How many sets of matched records were found
  - **Unified Individuals created:** New profiles resulting from this run
  - **Unified Individuals updated:** Existing profiles enriched with new source records
- **Low match counts:** may indicate Contact Point DMOs aren't populated (revisit field mapping)
- **Unusually high match counts:** may indicate match rules are too permissive (fuzzy threshold too low)
- IR monitoring helps diagnose both data quality and configuration issues

**Speaker Notes:** IR monitoring is where operational knowledge meets configuration knowledge. The metrics tell a story: if match groups created is near zero, it means either the data quality is so good that records don't overlap (unlikely at enterprise scale) or the match rules aren't finding duplicates (most likely because Contact Point DMOs are empty or match rules are misconfigured). If Unified Individuals created seems much lower than the source Individual count, it means some Individual records have no match and stand alone as their own Unified Individual — which is actually expected behavior for records with unique identifiers. The exam tests whether you can interpret these metrics and identify the appropriate response.

---

### Slide 8: Monitoring Best Practices
**Visual:** A monitoring dashboard mockup with key metrics highlighted: Last successful ingestion run, CI last refresh time, segment last refresh time, Unified Individual count trend, and error rate chart.

**Content:**
- **Set up scheduled monitoring:** Check ingestion job status daily, not just when problems are reported
- **Track record counts over time:** Sudden drops in DMO record counts signal ingestion issues
- **Monitor Unified Individual trends:** Unexpected decreases may indicate IR configuration changes
- **Alert on failed jobs:** Use Salesforce Flow or scheduled reports to notify admins of failures
- **Document normal baselines:** Know what "normal" looks like so anomalies are obvious
- **Test after configuration changes:** Manually run affected Data Streams after any mapping changes
- **Review error rates weekly:** A slow increase in failed records may indicate upstream data quality degradation

**Speaker Notes:** Monitoring best practices on the exam appear as scenario questions: "what should a Data Cloud consultant do to proactively identify ingestion issues before they affect marketing campaigns?" The answer is establishing monitoring baselines and proactive alerting. The specific recommendation to track record count trends is important — a sudden 20% drop in Sales Order DMO records might mean the source system changed its export format, causing many records to fail. Without a baseline, you wouldn't notice until a marketing team complains about inaccurate segments. Proactive monitoring is always better than reactive troubleshooting.

---

## Recording Script

Welcome to Lecture 10, the final lecture of Section 3. This lecture is about keeping Data Cloud running smoothly — monitoring, troubleshooting, and data quality.

The Data Cloud Admin UI is your operations center. When something isn't working, this is the first place you look. The two most important sections for daily monitoring are **Ingestion Jobs** and the **Job Scheduler**.

Ingestion Jobs shows the run history of every Data Stream. Each run creates a job record with a status: Success, Failed, Running, or Partially Succeeded. Partially Succeeded is the tricky one — it looks like things are fine, but some records were rejected. Always look at the failed record count. If it's non-zero, click into that job and review the Failed Records tab to understand what's getting rejected and why.

Common ingestion errors: data type mismatch (source sent a string where Data Cloud expected a date), required field missing, duplicate primary key, and connection failures. Each has a specific fix. For data type issues, you fix the field mapping or the source data. For connection failures, you check credentials and API connectivity.

Data Quality Rules let you get ahead of these problems by defining what "acceptable" data looks like and what to do when a record fails — flag it, reject it, or transform it. These are your proactive data quality guardrails.

The Job Scheduler is where you manage the timing of all scheduled operations. The most important thing to configure correctly is the dependency order: Data Streams run first, then CI refresh, then Segment refresh. Use job chaining to enforce this order — set the CI job to run after the Data Stream job completes. Without this chaining, you risk running segments against stale CI values.

For Identity Resolution monitoring, watch the match count metrics. Low match counts often signal that Contact Point DMOs aren't fully populated. High match counts might mean your fuzzy match threshold is too permissive.

The operational mindset is: establish baselines for what's normal, monitor for deviations, and have a resolution playbook for common error types. That's the consultant approach to Data Cloud administration.

That wraps up Section 3. In Section 4, we cover the exciting use cases — analytics integrations, AI, and real-world industry scenarios. See you there.

---

## Exam Tips

- **Partially Succeeded** ingestion jobs mean some records were rejected — always check the Failed Records tab
- Failed records are **NOT automatically retried** — fix the root cause and manually re-run or wait for the next scheduled run
- Data Quality Rules have three actions: **Flag** (allow but mark), **Reject** (block), and **Transform** (auto-fix)
- Job chaining in the **Job Scheduler** enforces the correct processing order: Data Stream → CI refresh → Segment refresh
- "Low Unified Individual count" relative to source Individual records most often means Contact Point DMO field mapping is incomplete

---

## Lecture Summary

Data Cloud performance monitoring centers on the Admin UI, which provides visibility into ingestion jobs, Identity Resolution runs, segment refreshes, and job scheduling. Ingestion jobs have four possible statuses (Success, Failed, Running, Partially Succeeded) and failed records can be investigated per-job through the Failed Records tab. Common ingestion errors include data type mismatch, missing required fields, duplicate primary keys, and connection failures — each requiring specific remediation. Data Quality Rules proactively enforce data standards at ingestion time with Flag, Reject, or Transform actions. The Job Scheduler manages refresh timing and supports job chaining to enforce the correct Data Stream → CI → Segment processing order. Identity Resolution monitoring metrics (match groups, Unified Individual counts) help diagnose both data quality and ruleset configuration issues.

---

## Mini Quiz

**Question 1:** An ingestion job for a Data Stream shows a status of "Partially Succeeded" with 950 records processed successfully and 50 records failed. What should the consultant do first?

A) Re-run the Data Stream immediately to retry the failed records  
B) Delete the Data Stream and recreate it with corrected configuration  
C) Review the Failed Records tab of the ingestion job to identify the error cause  
D) Increase the connection timeout setting for the Data Stream  

**Answer: C**
The first step is always to investigate the failed records to understand WHY they failed. The Failed Records tab shows each rejected record with its specific error. Only after identifying the root cause can the consultant determine the correct fix. Failed records are not automatically retried, so re-running without fixing the root cause will produce the same failures.

---

**Question 2:** A consultant wants to ensure that all Contact Point Email records ingested into Data Cloud have valid email addresses (containing an "@" symbol). Records with invalid email addresses should be rejected and not enter the DMO. Which feature should the consultant configure?

A) A formula transformation in the field mapping configuration  
B) A Data Quality Rule on the Contact Point Email DMO with a Reject action  
C) A segment exclusion filter on the email format  
D) A validation rule on the source Salesforce object  

**Answer: B**
A Data Quality Rule on the Contact Point Email DMO with a condition (EmailAddress does not contain "@") and a Reject action will prevent records with invalid email formats from entering the DMO. Segment exclusions and source validation rules would be additional safeguards but don't prevent bad records from entering Data Cloud. Formula transformations can clean data but can't reject records.

---

**Question 3:** A Data Cloud consultant notices that the Calculated Insight for "TotalSpend90d" is showing values that don't reflect yesterday's purchases, even though the related Data Stream ran successfully. What is the most likely configuration issue?

A) The Calculated Insight SQL query has an error in the WHERE clause  
B) The CI refresh job is scheduled to run BEFORE the Data Stream refresh job completes  
C) The segment membership has not been recalculated  
D) The Data Stream needs to be set to streaming mode instead of batch  

**Answer: B**
The CI refresh must run AFTER the Data Stream has completed its refresh and the DMO data has been updated. If the CI job is scheduled before the Data Stream job completes, the CI will be computing against the previous day's DMO data. The fix is to use job chaining in the Job Scheduler to ensure the CI refresh triggers only after the Data Stream refresh successfully completes.
