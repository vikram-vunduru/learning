# Salesforce Data Architecture & Management Designer (CRT-402)
## Practice Exam — 50 Scenario-Based Questions

**Distribution:**
- Master Data Management (25%) — Questions 1–13
- Large Data Volumes (25%) — Questions 14–26
- Data Migration (20%) — Questions 27–36
- Data Governance (15%) — Questions 37–43
- Integration & Connectivity (15%) — Questions 44–50

---

## MASTER DATA MANAGEMENT (Questions 1–13)

---

**Question 1**
A retail bank has customer records created in three systems: CRM, loan origination, and branch operations. Each system generates its own IDs. Customers appear under slightly different names ("Robert Smith" vs "Bob Smith"). What MDM pattern best addresses this?

A. Registry-style MDM using a cross-reference table to link system IDs without moving data  
B. Import all records into Salesforce and rely on Standard Duplicate Rules to merge them  
C. Consolidation-style MDM by copying all records into Salesforce and choosing a surviving record  
D. Use a formula field to concatenate first and last name and match on the result

**Answer: A**
**Explanation:** A registry/reference MDM pattern maps each source system's IDs to a master ID without requiring data migration. This lets each system of record retain ownership while Salesforce acts as the cross-reference hub — ideal when you cannot move sensitive banking data.

**Why the others are wrong:**
- B: Standard Duplicate Rules match on exact or fuzzy field values but do not resolve cross-system identity without External IDs linking the systems.
- C: Consolidation MDM requires full data migration and a survivorship decision — overkill and risky for regulated banking data owned by multiple systems.
- D: Concatenated name fields are fragile matching keys and break on nicknames, middle names, and data entry inconsistencies.

---

**Question 2**
A healthcare company wants to prevent duplicate Patient records from being created by call center agents. Patients may call in under maiden names or with slightly misspelled names. Which matching algorithm should the architect configure?

A. Exact matching on Email field only  
B. Fuzzy matching using the Standard Contact Matching Rule with first name, last name, and date of birth  
C. Exact matching on Phone plus Last Name  
D. Match on Salesforce record ID

**Answer: B**
**Explanation:** Fuzzy matching tolerates minor spelling variations and supports multi-field matching rules, making it appropriate for scenarios involving name changes and transcription errors. Adding date of birth as a tie-breaker increases confidence scores significantly.

**Why the others are wrong:**
- A: Email-only matching misses patients who call with a different email or have none on file.
- C: Exact phone matching fails if the patient uses a different number; exact last name matching fails for maiden name scenarios.
- D: Salesforce record IDs are system-generated and cannot be used as a prospective deduplication key.

---

**Question 3**
A global CPG company runs MDM externally in Informatica. They want Salesforce to always reflect the "golden record" from Informatica without agents being able to overwrite key fields. What is the recommended architectural approach?

A. Lock all fields on the record page layout  
B. Use a Salesforce Integration user with an inbound API flow that overwrites governed fields; make those fields read-only for non-integration profiles  
C. Use Validation Rules to reject updates from users on those fields  
D. Use a Duplicate Rule to block record creation when Informatica has not approved the record

**Answer: B**
**Explanation:** Making governed fields read-only for user profiles while allowing an integration user to write them preserves the golden record contract — Informatica owns those fields, and its integration process updates them via API. This is the standard "system of record" field ownership pattern.

**Why the others are wrong:**
- A: Page layout field visibility only hides fields in the UI; API and other tools can still overwrite them.
- C: Validation Rules that block all user edits on certain fields also block legitimate updates and do not distinguish integration writes cleanly.
- D: Duplicate Rules match on field values to detect duplicates; they do not gate whether a record has been MDM-approved.

---

**Question 4**
An architect is designing a Duplicate Rule for Accounts. The company has thousands of accounts with similar names (e.g., "Acme Corp", "Acme Corporation", "ACME"). What is the recommended matching rule configuration?

A. Fuzzy matching on Account Name only with a threshold of 60%  
B. Fuzzy matching on Account Name combined with exact matching on BillingPostalCode  
C. Exact matching on Account Name to avoid false positives  
D. Use a formula field combining Name and Phone as the matching key

**Answer: B**
**Explanation:** Combining fuzzy name matching with an exact postal code match reduces false positives (two legitimate "Acme Corp" entities in different cities) while still catching variations in spelling and abbreviation. This is a standard composite matching strategy for B2B account deduplication.

**Why the others are wrong:**
- A: Name-only fuzzy matching at 60% will flag unrelated companies with similar short names as duplicates.
- C: Exact matching misses "Acme Corp" vs "Acme Corporation" — the core problem the architect needs to solve.
- D: Formula fields as matching keys work only if the underlying data is already clean enough to concatenate reliably.

---

**Question 5**
A company uses a consolidation MDM approach and wants to merge two Account records. One account has 4,000 child Contacts and the other has 1,200 child Contacts. What concern should the architect raise before merging?

A. Merge operations are not supported for Account records with more than 1,000 child records  
B. The merge UI supports maximum 3 records and will fail silently after that  
C. Reparenting 5,200 child Contact records triggers governor limits and may require a batch Apex approach instead  
D. Account merge permanently deletes the losing record's ID, which may break external system references

**Answer: D**
**Explanation:** When accounts are merged, the losing record's ID is permanently deleted. Any external system storing that ID as a foreign key will have a broken reference after the merge. The architect must coordinate an External ID update across all dependent systems before or immediately after the merge.

**Why the others are wrong:**
- A: Salesforce does not enforce a hard child-record limit on account merges, though performance degrades with large volumes.
- B: The UI supports merging up to 3 records at once, but this is a UI constraint; the concern here is about child record volume, not merge count.
- C: Child records are reparented automatically by the merge operation; it does not individually trigger Apex per-record governor limits in the same way a batch DML would.

---

**Question 6**
A company is implementing MDM and must define a "golden record" survivorship rule. When two accounts match, the rule should prefer the most recently updated record for most fields but always use the oldest record's Account ID. What Salesforce feature supports this?

A. Duplicate Rules with "Auto-merge" action  
B. Custom Apex logic triggered via a Flow after the Duplicate Rule fires a "Report" alert  
C. A Matching Rule threshold set to 100% to ensure only exact duplicates are merged  
D. Einstein Data Detect automatic survivorship engine

**Answer: B**
**Explanation:** Standard Salesforce Duplicate and Matching Rules do not support field-level survivorship logic natively — they only block or alert. Custom survivorship rules require Apex or Flow to evaluate field-by-field merge decisions and execute the merge with the chosen values.

**Why the others are wrong:**
- A: "Auto-merge" as a native Duplicate Rule action does not exist in standard Salesforce configuration; merge must be explicitly executed.
- C: A 100% threshold means only truly identical records match, which would miss the fuzzy duplicates the company is trying to address.
- D: Einstein Data Detect identifies data quality issues but does not apply field-level survivorship during a merge operation.

---

**Question 7**
A manufacturing company wants to prevent sales reps from creating duplicate Lead records when the same prospect attends multiple events. The existing matching rule fires correctly but sales reps routinely click "Save Anyway." What should the architect recommend?

A. Change the Duplicate Rule action from "Allow with Alert" to "Block"  
B. Add a Validation Rule to prevent Lead creation if a matching record exists  
C. Enable the "Prevent Duplicates from Being Saved" checkbox on the Duplicate Rule  
D. Train sales reps to not bypass the alert

**Answer: A**
**Explanation:** Changing the Duplicate Rule action to "Block" prevents the record from being saved when a match is found, removing the option to override. This is the direct configuration change that enforces the deduplication policy without relying on user behavior.

**Why the others are wrong:**
- B: Validation Rules cannot query for duplicate records across the org without hitting governor limits on cross-object queries at save time.
- C: There is no "Prevent Duplicates from Being Saved" checkbox on Duplicate Rules; the action type (Block vs Alert) controls this behavior.
- D: Relying on training is not an architectural control and will not reliably prevent duplicates.

---

**Question 8**
A company has 8 million Account records and wants to run an MDM cleanse initiative. The data steward wants to review potential duplicates before any merge occurs. What is the most scalable approach?

A. Run a Duplicate Job from the Duplicate Management UI on all Accounts at once  
B. Schedule a batch export to an external MDM tool, perform probabilistic matching there, and reimport match pairs for human review in Salesforce  
C. Use SOQL to query all accounts and compare them in Apex  
D. Ask users to manually review their own accounts

**Answer: B**
**Explanation:** With 8 million records, Salesforce native Duplicate Jobs have limitations on batch size and processing time. External MDM tools (Informatica, Talend, etc.) are purpose-built for probabilistic matching at scale and can return structured match groups for steward review before any merge action in Salesforce.

**Why the others are wrong:**
- A: Native Duplicate Jobs process records in batches but are not designed for 8 million records and can time out or produce incomplete results.
- C: Apex cannot perform cross-record comparison at 8 million records without hitting CPU and heap governor limits.
- D: Manual user review at 8 million records is not a scalable or consistent approach.

---

**Question 9**
A company's MDM hub assigns a Global Party ID (GPID) to every customer entity. This GPID must be stored in Salesforce and used for all future upserts from the hub. What is the correct Salesforce implementation?

A. Store the GPID in the standard Account Name field  
B. Create a custom External ID field on Account indexed as a unique External ID  
C. Store the GPID in the Description field and use it in Apex lookups  
D. Use a custom metadata type record to map GPIDs to Salesforce IDs

**Answer: B**
**Explanation:** External ID fields in Salesforce are specially indexed for upsert operations via the API, allowing the MDM hub to reference records by its own natural key without needing to store or manage Salesforce's internal 15/18-character IDs. Marking it unique prevents accidental duplicates.

**Why the others are wrong:**
- A: Overloading the Account Name field with a system ID breaks search, reporting, and user experience.
- C: Description is a long text field with no index — SOQL lookups against it will cause full table scans on large data volumes.
- D: Custom metadata types store configuration data, not per-record data; they cannot map 8 million individual GPIDs.

---

**Question 10**
An architect must design a MDM hub-and-spoke model where Salesforce is the authoritative hub for customer data and four downstream systems subscribe to changes. What Salesforce mechanism should distribute master record changes to subscribers?

A. Scheduled Data Export  
B. Platform Events published on record update, consumed by downstream integration middleware  
C. Outbound Messages from Workflow Rules  
D. Apex callouts triggered synchronously on every Account save

**Answer: B**
**Explanation:** Platform Events provide a durable, scalable event bus for broadcasting record changes. Subscribers (ESB, middleware, other apps) can consume events asynchronously at their own pace, making this pattern resilient and loosely coupled.

**Why the others are wrong:**
- A: Scheduled exports are batch and introduce latency; they are not suitable for near-real-time master data distribution.
- C: Outbound Messages are limited in payload, lack retry visibility, and do not support complex data shapes for downstream consumers.
- D: Synchronous Apex callouts on every save block the save transaction, risk timeouts, and fail if any subscriber is temporarily unavailable.

---

**Question 11**
A company's duplicate detection is generating too many false positives because "John Smith" at one company is matching "John Smith" at a completely different company. What change to the matching rule will reduce false positives most effectively?

A. Increase the fuzzy match threshold from 65% to 95%  
B. Add Company (Account Name) as an additional matching field with high weight  
C. Switch from fuzzy to exact matching on all fields  
D. Disable the matching rule and handle deduplication in a nightly batch job

**Answer: B**
**Explanation:** Adding company name as a weighted matching field ensures that "John Smith at Acme" does not match "John Smith at Globex" — the company field acts as a natural disambiguator. Adjusting individual field weights fine-tunes the overall confidence score.

**Why the others are wrong:**
- A: Raising the threshold to 95% would reduce false positives but also miss real duplicates with slight name variations — an overly blunt fix.
- C: Exact matching on all fields would miss the intended use case of catching "Jon Smith" vs "John Smith" at the same company.
- D: Disabling real-time detection creates a window where duplicates accumulate; batch jobs are a complement, not a replacement.

---

**Question 12**
A company is deciding between Salesforce's native Duplicate Management and a third-party AppExchange MDM solution. The primary requirement is cross-object deduplication — finding that a Contact and a Lead represent the same person. What should the architect recommend?

A. Native Duplicate Rules — they already support cross-object Lead-to-Contact matching  
B. A third-party MDM solution, because native Duplicate Rules cannot match across different object types  
C. Write Apex triggers on both Lead and Contact to query each other  
D. Use Einstein Lead Scoring to identify matching prospects

**Answer: B**
**Explanation:** Native Salesforce Duplicate Rules operate within a single object (e.g., Lead-to-Lead or Contact-to-Contact). Cross-object identity resolution between Leads and Contacts requires third-party MDM tools or custom Apex solutions.

**Why the others are wrong:**
- A: Native Duplicate Rules do not support matching a Lead against a Contact record out of the box.
- C: Apex triggers querying across objects on every save adds latency, risks governor limits at volume, and is difficult to maintain.
- D: Einstein Lead Scoring predicts lead conversion likelihood; it does not perform cross-object identity resolution.

---

**Question 13**
A company wants to implement a data stewardship workflow where suspected duplicates are queued for human review before any merge. Which Salesforce feature is best suited for this?

A. Approval Processes triggered by Duplicate Rule alert  
B. A custom object "Duplicate Review" queue populated by a Flow that fires when a Duplicate Rule fires, with a case assignment to data stewards  
C. Chatter notifications sent to data stewards when a duplicate is detected  
D. A scheduled report of potential duplicates emailed weekly

**Answer: B**
**Explanation:** Creating a structured Duplicate Review queue via Flow gives data stewards a trackable, actionable work item for each suspected duplicate pair. Flows can capture the matching record IDs, scores, and route to the appropriate steward group.

**Why the others are wrong:**
- A: Approval Processes operate on individual records going through a workflow; they are not designed to manage a pair of records under review.
- C: Chatter notifications are unstructured and have no built-in tracking, assignment, or completion state.
- D: Weekly email reports introduce a 7-day window where duplicates remain unresolved and accumulate.

---

## LARGE DATA VOLUMES (Questions 14–26)

---

**Question 14**
A company has 120 million Opportunity records. Sales reps frequently run list views filtered by OwnerId and StageName. List view load times are exceeding 30 seconds. What should the architect implement first?

A. Add a custom index on StageName  
B. Create a skinny table covering OwnerId, StageName, CloseDate, and Amount  
C. Ask Salesforce Support to increase the governor limit for SOQL rows  
D. Archive all Opportunities closed more than 5 years ago to Big Objects

**Answer: B**
**Explanation:** Skinny tables are denormalized internal tables maintained by Salesforce that contain a subset of frequently queried fields. They dramatically improve list view and report performance on large objects by avoiding joins across the main data and sharing tables.

**Why the others are wrong:**
- A: A custom index on StageName alone does not help when the query also filters on OwnerId; the index selectivity may be poor for common stages like "Closed Won."
- C: Increasing governor limits is not a performance optimization; the issue is query execution plan, not limits.
- D: Archiving is a valid long-term strategy but does not immediately resolve the list view performance problem for current records.

---

**Question 15**
A SOQL query on a 90 million row Case object is returning results slowly. The WHERE clause filters on `CreatedDate >= LAST_N_DAYS:30 AND Status = 'Open'`. The architect checks the query plan and sees "TableScan." What is the most likely fix?

A. Add `LIMIT 50000` to the query  
B. Ensure the query uses a selective filter — CreatedDate is indexed by default and should be selective on 30 days; check that the query is not negating selectivity with a non-selective Status filter combined via AND  
C. Add a custom index on Status  
D. Rewrite the query using a subquery

**Answer: B**
**Explanation:** A query can show as a TableScan if the optimizer determines that neither filter is selective enough on its own to justify an index scan. CreatedDate is standard-indexed and usually selective; however, if Status has very few values distributed across most records (e.g., 80% are "Open"), adding an index on it adds no selectivity and the optimizer chooses a full table scan.

**Why the others are wrong:**
- A: Adding LIMIT reduces row return but does not change the execution plan from TableScan to an index-based scan.
- C: A custom index on a low-cardinality field like Status (Open/Closed/Pending) is not selective and will be ignored by the query optimizer.
- D: Rewriting as a subquery does not change selectivity; the underlying table still needs a selective filter.

---

**Question 16**
An org has 200 million Account records. A nightly batch job queries all accounts owned by users in a specific role hierarchy. The query is timing out. What root cause should the architect investigate first?

A. The Account object does not support role hierarchy queries  
B. Ownership skew — a small number of users or a queue owns a disproportionate share of records, making OwnerId filters non-selective  
C. The batch job is running during peak business hours  
D. The Account object needs a custom index on the Industry field

**Answer: B**
**Explanation:** Ownership skew occurs when a single user, queue, or role owns millions of records. When a filter is on OwnerId for that entity, the resulting record set is too large for an index scan to be efficient, so the optimizer falls back to a table scan. Redistributing ownership or adding additional selective filters resolves this.

**Why the others are wrong:**
- A: Account fully supports role hierarchy queries; this is not a platform constraint.
- C: Timing is a contributing factor but not the root cause of the query execution plan problem.
- D: Adding an Industry index does not help a query filtering on OwnerId and role hierarchy.

---

**Question 17**
A company is approaching the 10 billion record limit on a custom object used to store IoT sensor readings. Records older than 2 years are accessed only for regulatory audits. What should the architect recommend?

A. Increase the object's record limit by contacting Salesforce Support  
B. Archive records older than 2 years to a Big Object and update the lookup queries to use the Big Object for historical reads  
C. Delete all records older than 2 years to free up storage  
D. Move to a custom metadata type to store sensor readings

**Answer: B**
**Explanation:** Big Objects are designed for archival of massive data volumes and support up to 1 petabyte of storage. Records older than 2 years meeting audit access patterns (high volume, infrequent, known field access) are ideal candidates. Historical queries route to the Big Object while operational queries remain on the standard object.

**Why the others are wrong:**
- A: Salesforce does not offer record limit increases for standard custom objects; the platform architecture has physical limits.
- C: Deleting records destroys data that must be retained for regulatory audits.
- D: Custom metadata types store configuration/static data and have a limit of 200 records — completely unsuitable for IoT time-series data.

---

**Question 18**
A reporting team runs a daily report on 50 million Opportunity records that joins to Account and User. The report takes 45 minutes to generate. What is the most appropriate architectural recommendation?

A. Run the report during off-peak hours using a scheduled report  
B. Enable skinny tables on Opportunity covering the fields used in the report, and confirm indexes exist on the join fields  
C. Export data to an external BI tool like Tableau or Power BI connected via Salesforce data export  
D. Reduce the number of fields displayed in the report

**Answer: C**
**Explanation:** External BI tools connected via bulk API or direct replication are purpose-built for analytical workloads over large datasets. Salesforce reports are transactional-reporting tools not optimized for 50-million-row analytical queries; moving analytical reporting outside Salesforce is the standard LDV architectural pattern.

**Why the others are wrong:**
- B: Skinny tables help with list views and simple queries; they do not eliminate join costs on 50M rows for complex analytical reports.
- A: Scheduling the report off-peak reduces user impact but does not solve the fundamental architectural mismatch.
- D: Reducing displayed fields may marginally help but does not address the core volume problem.

---

**Question 19**
A Salesforce org stores 80 million Contact records. A developer writes `SELECT Id, Name FROM Contact WHERE LastName = 'Anderson'`. The query plan shows a TableScan. What should the architect recommend?

A. Create a unique index on LastName  
B. Add LIMIT 200 to the query  
C. Use a selective filter — LastName alone on 80 million rows may not be selective enough; add a second selective filter such as AccountId or a date field  
D. Query on FirstName instead, as it has better selectivity

**Answer: C**
**Explanation:** For a standard-indexed field on an 80 million row table, Salesforce's query optimizer evaluates selectivity: if a filter would return more than approximately 10% of total records (or more than 100,000 records, whichever is lower), the optimizer may prefer a table scan. Adding a second selective filter like AccountId narrows results enough to use the index.

**Why the others are wrong:**
- A: LastName already has a standard index; creating a duplicate custom index will not change the optimizer's decision — selectivity is the issue, not the presence of an index.
- B: LIMIT does not affect the query execution plan; the table scan still runs for the filter evaluation.
- D: First name has comparable distribution; switching to FirstName does not improve selectivity for a common surname scenario.

---

**Question 20**
A company has 40 million Case records and assigns them to queues. A query filtered on OwnerId for a queue that owns 15 million of those cases returns results slowly. What is the best architectural fix?

A. Create a custom index on OwnerId  
B. Redistribute case ownership by creating multiple sub-queues so no single queue owns more than 1 million records  
C. Enable Salesforce Shield and use Field Audit Trail  
D. Add a custom index on CaseNumber

**Answer: B**
**Explanation:** Queue ownership skew — where one queue holds 15 of 40 million records (37.5% of the object) — makes the OwnerId filter non-selective. Splitting the queue into multiple sub-queues so each owns a smaller share restores selectivity and allows the index to be used efficiently.

**Why the others are wrong:**
- A: OwnerId already has a standard index; adding a custom one does not help when selectivity is the underlying problem.
- C: Shield and Field Audit Trail are compliance features with no bearing on query performance.
- D: Indexing CaseNumber does not help a query filtering on OwnerId.

---

**Question 21**
An architect is asked to optimize a Salesforce report that filters on a custom picklist field "Region__c" across 60 million records. The field has 5 possible values. What should the architect recommend?

A. Request a custom index on Region__c from Salesforce Support  
B. Since Region__c has only 5 values, it is low-cardinality and a custom index will not improve performance; add a more selective filter like a date range or account ID  
C. Change the field type from picklist to text for better indexing  
D. Use a formula field to convert Region__c to a numeric value for faster filtering

**Answer: B**
**Explanation:** Low-cardinality fields (few distinct values) produce poor index selectivity — each index entry points to millions of rows, so the optimizer skips the index and does a table scan anyway. Combining Region__c with a highly selective field (date range, account ID) gives the optimizer a usable access path.

**Why the others are wrong:**
- A: Salesforce Support can create a custom index, but the optimizer will ignore it due to poor selectivity on a 5-value picklist over 60M records.
- C: Changing field type to text does not improve cardinality — the distribution of values is identical.
- D: Converting to numeric via formula does not change the underlying data distribution or selectivity.

---

**Question 22**
A company runs nightly batch Apex to update 5 million records. The batch is timing out after 10 minutes. What should the architect investigate first?

A. Increase the batch scope size from 200 to 2,000 to process fewer batches  
B. Check for triggers, workflow rules, and process builders firing per record during the batch, and disable or optimize them  
C. Rewrite the batch as a future method  
D. Use Data Loader instead of batch Apex

**Answer: B**
**Explanation:** The most common cause of batch Apex timeouts at scale is per-record automation (triggers, Process Builder, Flow) firing on every record in the batch scope. Each automation layer adds execution time multiplied by batch size. Auditing and optimizing the automation stack is the first step.

**Why the others are wrong:**
- A: Increasing scope size processes fewer batches but each batch takes longer — this can make timeout issues worse, not better.
- C: Future methods have a 60-second CPU limit and are not designed for bulk processing of 5 million records.
- D: Data Loader still triggers automation; switching the tool does not address the automation overhead.

---

**Question 23**
A company's SOQL query uses `WHERE CreatedDate = TODAY` on a 100 million record object. Performance is acceptable. After adding `AND RecordTypeId = '012...'`, performance degrades significantly. What does this indicate?

A. RecordTypeId is not indexed by default  
B. The specific RecordTypeId filter returns too many records, making it non-selective; the compound filter is now less selective than CreatedDate alone  
C. TODAY is a dynamic date literal that cannot be combined with other filters  
D. RecordTypeId values change frequently, causing index fragmentation

**Answer: B**
**Explanation:** Adding RecordTypeId to the WHERE clause changes the optimizer's evaluation. If that record type accounts for a large percentage of records, the compound condition is less selective than CreatedDate alone, and the optimizer may switch plans. The fix is to ensure the RecordTypeId filter is actually selective (the record type covers a small fraction of total records).

**Why the others are wrong:**
- A: RecordTypeId is indexed by default in Salesforce; the issue is selectivity, not the absence of an index.
- C: TODAY is a valid dynamic date literal that combines correctly with other filter predicates.
- D: RecordTypeId values are stable; index fragmentation is not the cause of this behavior.

---

**Question 24**
An architect is designing a data model for a utility company that will store 500 million monthly meter readings per year indefinitely. Historical reads are needed for billing disputes (infrequent, by meter ID and date range). What is the recommended storage approach?

A. Store all readings in a custom Salesforce object with an External ID  
B. Store recent readings (last 13 months) in a standard custom object and archive older readings to a Big Object with a composite index on MeterId and ReadingDate  
C. Store all readings in a custom object and add a skinny table  
D. Use Salesforce Files to store monthly CSV exports of meter readings

**Answer: B**
**Explanation:** Big Objects support petabyte-scale storage and are ideal for immutable time-series data accessed by known key patterns. A composite index on MeterId + ReadingDate aligns exactly with billing dispute query patterns. Keeping 13 months in the operational object supports current billing cycle needs.

**Why the others are wrong:**
- A: Custom Salesforce objects are subject to record storage limits and are not designed for 500M+ records per year.
- C: Skinny tables only help query performance on existing data; they do not solve the storage volume problem.
- D: Files are unstructured binary storage — querying inside CSV files for billing disputes is not feasible.

---

**Question 25**
A company migrated 50 million records to Salesforce and now finds that list views load slowly for all users. The architect suspects sharing recalculation is the cause. What should be checked?

A. Whether Record-Level Sharing rules are using criteria-based sharing on a large non-indexed field  
B. Whether the picklist field on the list view filter has too many values  
C. Whether too many users are logged in simultaneously  
D. Whether list views are using standard filters instead of custom filters

**Answer: A**
**Explanation:** Criteria-based sharing rules that evaluate non-indexed fields trigger full table scans across the entire object to recalculate sharing after each record insert or update. With 50 million records, this process can create a sharing recalculation backlog that delays all record access.

**Why the others are wrong:**
- B: Picklist field value count does not affect sharing recalculation performance.
- C: Concurrent user count affects overall system resources but is not the root cause of sharing recalculation delays.
- D: Custom vs standard list view filters affect the query, not the sharing computation layer.

---

**Question 26**
A company is planning to store 2 billion event log records in Salesforce. The records are write-once and are read infrequently by event ID and timestamp. What data architecture is most appropriate?

A. A standard custom object with an External ID and custom indexes  
B. Big Objects with a composite index on EventId and Timestamp  
C. Salesforce Shield Platform Encryption with a standard object  
D. An External Object backed by Amazon S3

**Answer: B**
**Explanation:** Big Objects handle billions of records natively, are optimized for append-only workloads, and support indexed queries via composite index keys. Write-once, query-by-key access patterns are precisely what Big Objects are designed for.

**Why the others are wrong:**
- A: Custom objects are limited in total record count and are not designed for 2 billion rows; query performance would be severely impacted at that scale.
- C: Platform Encryption is a security feature, not a storage architecture — it does not help with volume.
- D: External Objects via Salesforce Connect enable real-time passthrough queries to external systems; they require a Salesforce Connect license and the S3 backend would still need to be optimally designed for the query pattern.

---

## DATA MIGRATION (Questions 27–36)

---

**Question 27**
A company is migrating 50 million Contact records from a legacy CRM. The migration team must be able to re-run the load without creating duplicates if a batch fails halfway through. What is the recommended approach?

A. Delete all partially loaded records and re-run the full load from the beginning  
B. Use an External ID field on Contact mapped to the legacy CRM's unique ID, and use the upsert operation in Data Loader  
C. Use the insert operation with a SOQL pre-check for duplicates  
D. Rely on Duplicate Rules to prevent re-insertion of already-loaded records

**Answer: B**
**Explanation:** Upsert with an External ID is idempotent — if the record already exists, it updates it; if not, it inserts it. This makes failed batch re-runs safe and eliminates duplicate creation without manual cleanup or pre-checks.

**Why the others are wrong:**
- A: Deleting partially loaded records and re-running wastes the completed work and risks data integrity issues during the delete step.
- C: SOQL pre-checks in code are fragile, slow at scale, and cannot handle concurrent loads; they also require custom tooling.
- D: Duplicate Rules fire on insert but do not prevent an identical record from being inserted if the matching rule doesn't catch the exact combination of fields.

---

**Question 28**
A migration architect must load 10 million Account records followed by 30 million Contact records where each Contact must link to its parent Account. What is the correct migration sequence?

A. Load Contacts first, then Accounts, and update the AccountId lookup afterward  
B. Load Accounts first with their External ID, then load Contacts using the Account External ID as the relationship reference in the CSV  
C. Load Accounts and Contacts simultaneously using parallel Data Loader jobs  
D. Load everything in a single file with a VLOOKUP formula linking them

**Answer: B**
**Explanation:** Parent records must exist before child records can reference them. Data Loader allows specifying a relationship by External ID (e.g., Account__r:LegacyId__c) in the CSV, so Contacts can reference their parent Account by the source system's ID rather than the Salesforce ID, which is not known until after Account load.

**Why the others are wrong:**
- A: Loading Contacts first leaves the AccountId field null; a subsequent update step adds complexity and doubles the API calls needed.
- C: Parallel loading will cause random failures when Contact records attempt to reference Account IDs that do not yet exist.
- D: Data Loader does not execute Excel formulas; VLOOKUP is an Excel-side transformation, and the final CSV would still require correct sequencing.

---

**Question 29**
A data migration team is profiling a source system with 8 million Lead records before migration. They discover that 22% of records have null Email, 40% have non-standard phone formats, and 15% are older than 10 years with no activity. What should the architect recommend?

A. Migrate all records as-is and let Salesforce validation rules reject bad records  
B. Profile the data, define transformation rules to standardize phone formats, exclude leads older than 10 years with no activity per business rules, and enrich null emails where possible before migration  
C. Map null Email fields to a placeholder value like "noemail@company.com"  
D. Import only records created in the last 5 years and discard the rest

**Answer: B**
**Explanation:** Data profiling drives the cleansing and transformation plan. Each data quality issue (null fields, format inconsistencies, stale records) requires a specific business decision and transformation rule — this is the purpose of the profiling phase. Migrating dirty data recreates data quality problems in the new system.

**Why the others are wrong:**
- A: Letting Salesforce validation rules reject records mid-migration creates partial loads and requires a reprocessing workflow for rejected records.
- C: Placeholder email values create their own data quality problem and will flood email tools with undeliverable addresses.
- D: An arbitrary 5-year cutoff is not a data-driven decision and may exclude legally required or valuable records without business input.

---

**Question 30**
A migration from SAP to Salesforce involves 15 million Opportunity records with complex currency conversion requirements. The architect must choose a migration tool. Which option is most appropriate?

A. Salesforce Data Loader (GUI mode)  
B. A full ETL tool such as Informatica PowerCenter or Talend that can handle complex transformations, currency lookups, and error logging at scale  
C. Manual data entry by a dedicated team  
D. Salesforce Dataloader CLI with a pre-built field mapping CSV

**Answer: B**
**Explanation:** Enterprise ETL tools support complex multi-step transformations (currency lookups, conditional logic, data enrichment), parallel processing at scale, full error logging with rejected record files, and restartable job design — all required for a complex 15M record migration from an ERP source.

**Why the others are wrong:**
- A: Data Loader GUI lacks transformation capability and is impractical for 15 million records without automation.
- C: Manual entry is not feasible for 15 million records and introduces human error.
- D: Data Loader CLI can automate the load process but still lacks native transformation logic; pre-built CSV mapping does not handle currency conversion.

---

**Question 31**
A migration team has loaded 5 million records into a Salesforce sandbox and discovered that 800,000 records have incorrect data due to a transformation bug. The migration is scheduled to go live in 72 hours. What is the recommended rollback strategy?

A. Delete all 5 million records and restart the migration  
B. Use the External ID to run a mass upsert with corrected data for only the 800,000 affected records  
C. Accept the incorrect data and fix it post-go-live  
D. Contact Salesforce Support to roll back the sandbox

**Answer: B**
**Explanation:** If the External ID is mapped correctly, the architect can re-run the ETL for only the affected 800,000 records with the corrected transformation logic, and upsert will overwrite only those records. This preserves the 4.2 million correctly loaded records and minimizes rework.

**Why the others are wrong:**
- A: Deleting all 5 million records wastes the correctly loaded data and extends the timeline.
- C: Migrating known incorrect data sets up a post-go-live cleanup project that will be harder to execute on live data.
- D: Salesforce Support cannot "roll back" sandbox data to a prior state; that is not a supported operation.

---

**Question 32**
An architect is planning the cutover for a migration involving 20 million records. The business requires no more than 4 hours of downtime. The initial load takes 18 hours. How should the architect structure the migration?

A. Run the full 18-hour load during the 4-hour cutover window by using multiple parallel Data Loader jobs  
B. Perform the bulk of the migration as a pre-load days before cutover, then use delta loads (changes since the pre-load) during the 4-hour cutover window  
C. Accept 18 hours of downtime and negotiate with the business  
D. Use Salesforce Connect to avoid migrating data at all

**Answer: B**
**Explanation:** Pre-loading the bulk data before the maintenance window significantly reduces what must be loaded during cutover. Delta loads (records created or updated since the pre-load snapshot) are a fraction of the total volume and can complete within the 4-hour window.

**Why the others are wrong:**
- A: Parallelizing Data Loader jobs may improve throughput but will not compress an 18-hour load into 4 hours for 20 million records.
- C: Accepting 18 hours of downtime violates the business requirement and is not an architectural solution.
- D: Salesforce Connect is for real-time external system access, not for replacing a data migration; it adds latency and licensing costs.

---

**Question 33**
A migration requires loading custom object records that have a self-referential lookup (a hierarchy where each record has a Parent lookup to another record of the same object). How should the architect handle this?

A. Load all records in a single pass; Salesforce will resolve the self-referential links automatically  
B. Load records in two passes: first load all records without the parent field, then update the parent field once all records exist  
C. Use a formula field instead of a lookup to simulate the hierarchy  
D. This use case is not supported in Salesforce

**Answer: B**
**Explanation:** Self-referential lookups require the parent record to exist before the child can reference it. In a single pass, parent records may not yet be inserted when child records try to reference them. A two-pass approach inserts all records first, then updates the parent lookup using External IDs.

**Why the others are wrong:**
- A: Salesforce does not automatically defer and re-resolve lookup references in a single load pass; unresolved lookups result in errors.
- C: Formula fields cannot store or enforce relational hierarchy; they are calculated, not stored references.
- D: Self-referential lookups are fully supported in Salesforce; the challenge is load ordering, not platform capability.

---

**Question 34**
A company needs to migrate encrypted sensitive data (SSNs) from a legacy system. The migration architect must ensure data is not exposed in ETL logs or staging environments. What should the architect recommend?

A. Store SSNs in a formula field on the target object  
B. Use Salesforce Shield Platform Encryption on the target field, tokenize SSNs in the ETL pipeline before loading, and ensure staging environments use masked or anonymized data  
C. Encrypt the CSV migration files with a password and email them to the Salesforce admin  
D. Store SSNs in a custom text field and restrict access using field-level security

**Answer: B**
**Explanation:** Shield Platform Encryption protects data at rest in Salesforce. Tokenizing (or masking) in the ETL pipeline ensures raw SSNs never appear in transformation logs, error files, or staging DB tables. Sandbox/staging environments should contain masked data to prevent unauthorized exposure.

**Why the others are wrong:**
- A: Formula fields are calculated and derived — they cannot store independently encrypted sensitive values.
- C: Password-protected CSVs are not enterprise-grade security for PII; they are unencrypted at rest and insecure in transit.
- D: FLS restricts UI visibility but does not encrypt data at the database layer; a DBA or compromised admin can still see plaintext values.

---

**Question 35**
A migration team is doing a UAT migration to a sandbox. After the load, users report that related lists on Account show no records even though child records were loaded. What is the most likely cause?

A. Sandbox does not support related lists  
B. The child record's lookup field to Account was not populated during the migration load  
C. The sandbox is a Developer Edition and only supports 5,000 records  
D. Related lists require a report to be built before they display data

**Answer: B**
**Explanation:** If the lookup field (e.g., AccountId on Contact) is null or points to an invalid Salesforce ID, the related list appears empty even though the child records exist in the org. This is typically caused by a mapping error in the ETL or a failure to use External ID upsert to resolve parent-child relationships.

**Why the others are wrong:**
- A: Sandboxes fully support related lists and all standard UI features.
- C: Developer sandboxes have storage limits but do not block related list display if records are within limits.
- D: Related lists display automatically based on the data model and field population; no report configuration is needed.

---

**Question 36**
A company's migration plan includes a go/no-go checkpoint. Which set of success criteria should the architect include for a data migration go/no-go decision?

A. All records loaded, record count matches source, referential integrity verified, business validation sample passed  
B. No Apex test failures in the target org  
C. User acceptance sign-off and stakeholder approval emails received  
D. The ETL tool completed without any timeout errors

**Answer: A**
**Explanation:** A data migration go/no-go must include data completeness (record count match), structural integrity (lookups resolve correctly), and business validation (a representative sample confirmed by the business as correct). These are objective, measurable data quality gates.

**Why the others are wrong:**
- B: Apex test health is important for deployment, not specific to data migration validation; it doesn't confirm the data is correct.
- C: Stakeholder approval is necessary but not sufficient — it cannot substitute for objective data quality checks.
- D: ETL completion without timeouts validates process execution, not data correctness; a job can complete and still load wrong data.

---

## DATA GOVERNANCE (Questions 37–43)

---

**Question 37**
A company is implementing a data dictionary in Salesforce. Business users need to understand the purpose, owner, and valid values for each field across 15 objects. What is the recommended approach?

A. Embed field descriptions in every field's Help Text and document the rest in a SharePoint wiki  
B. Maintain a formal data dictionary as a custom object in Salesforce with records for each field including definition, data owner, data classification, and valid values  
C. Use the field label to communicate the field's purpose  
D. Store field metadata in a spreadsheet owned by the IT team

**Answer: B**
**Explanation:** A custom Data Dictionary object in Salesforce is accessible to all stakeholders, queryable, and can be linked to the governed fields via relationship. It supports workflow for owner approval, field classification updates, and automated alerts when fields are modified — capabilities not possible in external documents.

**Why the others are wrong:**
- A: Help Text is limited in length and not searchable as a dataset; a SharePoint wiki is siloed from the Salesforce context where business users work.
- C: Field labels are UI display names limited to ~40 characters; they cannot carry governance metadata.
- D: Spreadsheets become stale, are not self-service for business users, and require manual updates when fields change.

---

**Question 38**
A European retailer must comply with GDPR. A customer submits a "Right to Erasure" request. The company stores customer PII across Contact, Lead, Order, and a custom Loyalty__c object. What is the recommended Salesforce architecture for handling this?

A. Delete the Contact record and rely on cascade delete to remove related records  
B. Design a Privacy Request workflow: use a custom Privacy_Request__c object to track the request, trigger an automated process to anonymize PII fields across all four objects (replacing with pseudonymous tokens), retain legally required financial records with PII removed  
C. Archive the Contact to a Big Object instead of deleting it  
D. Use Salesforce Shield to encrypt the records so they cannot be read

**Answer: B**
**Explanation:** GDPR erasure does not always mean hard deletion — data required for legal obligations (e.g., financial transactions) must be retained but anonymized. A structured Privacy Request workflow ensures auditability, covers all objects with PII, and handles the tension between erasure rights and legal retention obligations.

**Why the others are wrong:**
- A: Cascade delete may not reach all related objects (especially custom objects without cascade delete enabled), and deletes records that must be legally retained.
- C: Archiving PII to a Big Object does not erase it — the data is still stored and linked to the individual.
- D: Encryption protects against unauthorized access but does not fulfill an erasure request; the data still exists.

---

**Question 39**
A financial services company classifies data into Public, Internal, Confidential, and Restricted. An architect must enforce that Restricted fields (e.g., account balances) can only be viewed by licensed financial advisors. What Salesforce mechanism enforces this most directly?

A. Validation Rules that check the running user's profile  
B. Field-Level Security configured per profile/permission set, restricting Restricted fields to the Financial Advisor permission set  
C. Sharing rules that limit record access  
D. A page layout that hides the fields for non-advisors

**Answer: B**
**Explanation:** Field-Level Security controls whether a field is visible and editable for a given profile or permission set regardless of how the record is accessed (UI, API, reports). This is the authoritative field access control mechanism in Salesforce.

**Why the others are wrong:**
- A: Validation Rules fire on record save; they cannot prevent a user from viewing a field value.
- C: Sharing rules govern which records a user can see, not which fields within a visible record they can access.
- D: Page layouts hide fields in the standard UI but do not restrict API access, report access, or custom component access.

---

**Question 40**
A company is implementing consent management for marketing emails in compliance with GDPR and CAN-SPAM. Where should the consent record be stored in Salesforce?

A. In a custom Consent__c object linked to the Contact, capturing consent type, channel, timestamp, version of consent text given, and withdrawal timestamp  
B. In a checkbox field "HasOptedOutOfEmail" on the Contact record  
C. In a custom text field "ConsentNotes" on the Lead record  
D. In a Salesforce File attached to the Contact record

**Answer: A**
**Explanation:** GDPR consent must be granular (by channel and purpose), timestamped, versioned (capturing which consent language was shown), and auditable. A consent object as a child of Contact provides a full consent history log and supports withdrawal tracking — far beyond what a single checkbox field can represent.

**Why the others are wrong:**
- B: A checkbox provides a current state snapshot but no history, no channel granularity, no version of consent text, and no timestamp — insufficient for GDPR audit requirements.
- C: Free-text notes are not queryable, auditable, or structured enough for regulatory compliance.
- D: Files are unstructured and not usable by marketing automation tools or consent management integrations.

---

**Question 41**
A data governance team wants to track when sensitive fields (SSN, Date of Birth) are accessed by users. What Salesforce feature provides field-level access audit logging?

A. Debug Logs  
B. Salesforce Shield Field Audit Trail  
C. Setup Audit Trail  
D. Salesforce Inspector browser extension

**Answer: B**
**Explanation:** Shield Field Audit Trail captures a historical log of when field values were read or changed, by whom, and what the before/after values were. It retains this data for up to 10 years and is designed for regulatory compliance use cases requiring field-level access auditing.

**Why the others are wrong:**
- A: Debug Logs capture Apex execution details and SOQL; they are developer tools, not long-term compliance audit logs, and are overwritten frequently.
- C: Setup Audit Trail logs configuration changes (who changed settings, who created fields) — not data access events.
- D: Salesforce Inspector is a third-party browser extension with no audit logging or regulatory standing.

---

**Question 42**
A company wants to ensure that no Account record is saved without a valid Industry and Annual Revenue value. These are required for downstream revenue attribution reports. What is the correct enforcement mechanism?

A. Make both fields required on the page layout  
B. Create a Validation Rule that prevents saving if Industry is null or Annual Revenue is blank, apply it across all record types  
C. Use a workflow rule to default both fields if blank  
D. Add a help text message asking users to fill in the fields

**Answer: B**
**Explanation:** Validation Rules enforce data quality at the platform level — they fire regardless of how the record is created (UI, API, data loader, integration). Page layout required fields and help text only enforce input through the standard UI.

**Why the others are wrong:**
- A: Page layout required fields are only enforced in the UI; API inserts and integrations bypass page layout requirements.
- C: Workflow rules can default values but cannot enforce that valid meaningful values are provided — they would just mask the problem with a default.
- D: Help text is advisory only; it does not prevent record save.

---

**Question 43**
A company has a regulatory requirement to retain all customer interaction records for 7 years but cannot store them in Salesforce indefinitely due to storage costs. What architecture satisfies both retention and cost requirements?

A. Delete records older than 2 years from Salesforce  
B. Archive records older than 2 years to a Big Object (for Salesforce-native access) or to an external archival system, with a documented retention policy and the ability to retrieve records on regulatory request  
C. Export records to CSV annually and store in SharePoint  
D. Use Salesforce Shield to compress old records

**Answer: B**
**Explanation:** Big Objects support large-scale archival within Salesforce with structured query access. Alternatively, external archival (S3, data warehouse) with a retrieval process satisfies retention requirements while removing storage cost from Salesforce. The key is documented retention policy, retrieval capability, and data integrity.

**Why the others are wrong:**
- A: Deleting records violates the 7-year retention requirement regardless of storage cost.
- C: SharePoint CSVs are not structured for reliable retrieval, lack access controls, and are difficult to maintain for regulatory production.
- D: Shield provides encryption and audit — it does not compress or reduce storage costs.

---

## INTEGRATION & CONNECTIVITY (Questions 44–50)

---

**Question 44**
A company wants to give Salesforce users a read-only view of customer orders stored in an external SAP system. Orders are queried in real time — no copy should exist in Salesforce. Which Salesforce feature is designed for this?

A. Heroku Connect  
B. External Objects via Salesforce Connect with an OData 4.0 adapter  
C. Salesforce bulk API pulling order data nightly  
D. A custom Apex callout on every page load

**Answer: B**
**Explanation:** External Objects via Salesforce Connect provide a native Salesforce object experience (related lists, SOQL, global search) backed by real-time passthrough queries to external systems via OData or custom adapters. No data is stored in Salesforce, satisfying the "no copy" requirement.

**Why the others are wrong:**
- A: Heroku Connect replicates data bidirectionally between Heroku Postgres and Salesforce — it creates a copy, which violates the requirement.
- C: Nightly bulk API pulls create a copy in Salesforce that is stale and violates the real-time requirement.
- D: Custom Apex callouts on every page load are fragile, impose synchronous latency, and bypass SOQL relationships and standard Salesforce UI features.

---

**Question 45**
A company uses Change Data Capture (CDC) to stream record changes from Salesforce to a downstream data warehouse. After enabling CDC on the Account object, the data warehouse team reports that they are not receiving delete events. What is the cause?

A. CDC does not support Account  
B. CDC publishes a "delete" change event when records are deleted, but if records are hard-deleted they must be included in the CDC subscription — soft-deleted records go to the Recycle Bin and do not fire CDC until the Recycle Bin is emptied  
C. CDC only fires for insert and update operations, not deletes  
D. The downstream subscriber must enable "Include Deletes" in their Salesforce Connected App settings

**Answer: B**
**Explanation:** CDC fires delete events when records are deleted, including when Recycle Bin records are permanently deleted. However, records moved to the Recycle Bin (soft-deleted) fire a delete CDC event immediately. The warehouse team likely needs to verify their subscriber is handling the delete event payload correctly and check Recycle Bin vs hard delete behavior.

**Why the others are wrong:**
- A: CDC supports Account along with most standard and custom objects.
- C: CDC supports all four DML event types: create, update, delete, and undelete.
- D: There is no "Include Deletes" toggle in Connected App settings; delete event delivery is controlled by the CDC object subscription configuration.

---

**Question 46**
An order management system must publish "OrderPlaced" events to Salesforce and trigger a fulfillment process. The order management system cannot receive synchronous API responses. Which integration pattern is most appropriate?

A. Salesforce Outbound Messages  
B. An external system publishing to a Platform Event channel; Salesforce subscribes via a Process or Flow trigger  
C. A polling Apex scheduled job that queries the external system every 5 minutes  
D. REST API callout from Salesforce to the order system on a timer

**Answer: B**
**Explanation:** Platform Events support a pub/sub pattern where external systems publish events and Salesforce subscribes to them. This is fully asynchronous, decoupled, and does not require the publisher to receive or handle synchronous API responses.

**Why the others are wrong:**
- A: Outbound Messages are sent by Salesforce to external systems, not the reverse; this inverts the required flow.
- C: Polling every 5 minutes introduces latency and is inefficient; it also requires the external system to expose a query API.
- D: Salesforce initiating REST callouts is outbound and does not align with an event-driven pattern where the external system drives the trigger.

---

**Question 47**
A company stores 5 billion historical transaction records needed for customer-facing account history queries in a Salesforce Community portal. Transactions are append-only and queried by CustomerId and DateRange. What is the recommended architecture?

A. Store all 5 billion records in a custom Salesforce object  
B. Store records in a Big Object with a composite index on CustomerId and TransactionDate; query via SOQL in the Community portal  
C. Use an External Object backed by an external database  
D. Export data to Salesforce Files as PDF statements

**Answer: B**
**Explanation:** Big Objects are designed for exactly this scenario: billions of immutable records, accessed by known key patterns, with a composite index on the query dimensions. SOQL against Big Objects is supported in Apex and Community/Experience Cloud contexts.

**Why the others are wrong:**
- A: 5 billion records far exceed practical limits for custom Salesforce objects; query performance would be unusable.
- C: External Objects require real-time query passthrough to an external database on every page load — this introduces latency and dependency on the external system's availability.
- D: PDF files are not queryable; customers cannot search or filter their transaction history from a file attachment.

---

**Question 48**
A company's Salesforce org must stay synchronized with a downstream inventory system. When a Product record changes in Salesforce, the inventory system must be notified within 30 seconds. The inventory system is an HTTP REST endpoint. What is the recommended pattern?

A. Scheduled Apex that runs every minute and queries for recently updated Products  
B. A Platform Event published when a Product record is updated (via Flow or Trigger), with an external process subscribed to the event bus via Streaming API to relay the payload to the inventory system  
C. Heroku Connect replication of the Product table  
D. A nightly Data Export emailed to the inventory team

**Answer: B**
**Explanation:** Platform Events with a Streaming API subscriber provide near-real-time (seconds) event delivery. An integration middleware or microservice subscribes to the event channel and relays the change payload to the inventory REST endpoint, satisfying the 30-second SLA.

**Why the others are wrong:**
- A: Scheduled Apex minimum interval is 1 minute, introduces polling overhead, and risks missing changes between poll cycles under load.
- C: Heroku Connect replicates data to Heroku Postgres — it does not push real-time notifications to an arbitrary REST endpoint.
- D: Nightly exports have a latency of up to 24 hours — completely incompatible with a 30-second requirement.

---

**Question 49**
An architect is evaluating External Objects for a reporting use case. Business users want to run Salesforce reports combining Salesforce Account data with external ERP revenue data. What limitation of External Objects must the architect communicate?

A. External Objects cannot be related to standard Salesforce objects  
B. External Objects do not support Salesforce reports — they cannot be added as report types or joined with standard objects in standard report builder  
C. External Objects cannot store more than 10,000 records  
D. External Objects require a separate Salesforce license per user

**Answer: B**
**Explanation:** External Objects are not supported as report object types in Salesforce Report Builder. They support SOQL, related lists, and global search, but the standard reporting framework cannot use them as a data source. If reporting is required, the data must be replicated into Salesforce or accessed via a BI tool that queries both systems.

**Why the others are wrong:**
- A: External Objects can have lookup relationships to standard objects like Account via External Lookup or Indirect Lookup relationships.
- C: External Objects have no record count limit — they are passthrough to the external system.
- D: Salesforce Connect licenses are per-org, not per user; however, the license model depends on the adapter type.

---

**Question 50**
A company runs a high-volume order processing system that generates 500,000 order status change events per day. These events must be delivered to Salesforce for customer service reps to see order status in near real time. What is the most scalable integration approach?

A. Create an Apex REST endpoint in Salesforce and have the order system POST each event directly  
B. Use Platform Events with a high-volume event definition; the order system publishes events via the Salesforce Bulk API for Platform Events, and CSRs see updates via a subscribed Flow or LWC  
C. Load order status changes via Data Loader every hour  
D. Use Salesforce Connect External Objects to query order status on demand

**Answer: B**
**Explanation:** High-volume Platform Events (HVPE) are specifically designed for 500,000+ daily events. The Bulk API for Platform Events supports efficient batch publishing from external systems. LWC components and Flows can subscribe to the event channel and update the UI in near real time without SOQL polling.

**Why the others are wrong:**
- A: Posting 500,000 individual REST API calls per day is inefficient and risks API call limit exhaustion (default 1,000,000/day, but bursty synchronous loads degrade shared resources).
- C: Hourly Data Loader batches introduce up to 60 minutes of latency — not near real time.
- D: External Objects are read-only passthrough and do not support event delivery or push notifications to the Salesforce UI.

---

## Answer Key

| Q | A | Topic |
|---|---|-------|
| 1 | A | MDM — Hub Patterns |
| 2 | B | MDM — Matching Algorithms |
| 3 | B | MDM — Golden Record |
| 4 | B | MDM — Matching Algorithms |
| 5 | D | MDM — Duplicate Rules |
| 6 | B | MDM — Golden Record / Survivorship |
| 7 | A | MDM — Duplicate Rules |
| 8 | B | MDM — MDM at Scale |
| 9 | B | MDM — External IDs / MDM Hub |
| 10 | B | MDM — MDM Hub Patterns |
| 11 | B | MDM — Matching Algorithms |
| 12 | B | MDM — Duplicate Rules / Cross-Object |
| 13 | B | MDM — Stewardship Workflow |
| 14 | B | LDV — Skinny Tables |
| 15 | B | LDV — Selective Queries / Index Types |
| 16 | B | LDV — Ownership Skew |
| 17 | B | LDV — Big Objects |
| 18 | C | LDV — SOQL Optimization / External BI |
| 19 | C | LDV — SOQL Optimization |
| 20 | B | LDV — Ownership Skew |
| 21 | B | LDV — Index Types / Selectivity |
| 22 | B | LDV — Batch Apex Optimization |
| 23 | B | LDV — Query Plan Analysis |
| 24 | B | LDV — Big Objects / Data Architecture |
| 25 | A | LDV — Sharing Recalculation |
| 26 | B | LDV — Big Objects |
| 27 | B | Migration — External IDs / Upsert |
| 28 | B | Migration — Migration Sequencing |
| 29 | B | Migration — Data Profiling |
| 30 | B | Migration — ETL Tool Selection |
| 31 | B | Migration — Rollback / Delta Load |
| 32 | B | Migration — Cutover Strategy |
| 33 | B | Migration — Self-Referential Loads |
| 34 | B | Migration — Sensitive Data |
| 35 | B | Migration — Referential Integrity |
| 36 | A | Migration — Go/No-Go Criteria |
| 37 | B | Governance — Data Dictionary |
| 38 | B | Governance — GDPR at Data Layer |
| 39 | B | Governance — Quality Rules / FLS |
| 40 | A | Governance — Consent Management |
| 41 | B | Governance — Field Audit Trail |
| 42 | B | Governance — Quality Rules |
| 43 | B | Governance — GDPR / Retention |
| 44 | B | Integration — External Objects |
| 45 | B | Integration — CDC |
| 46 | B | Integration — Platform Events |
| 47 | B | Integration — Big Objects |
| 48 | B | Integration — Platform Events / Sync |
| 49 | B | Integration — External Objects |
| 50 | B | Integration — Platform Events HVPE |

---

*CRT-402 exam prep — 50 questions covering all five domains proportionally.*
