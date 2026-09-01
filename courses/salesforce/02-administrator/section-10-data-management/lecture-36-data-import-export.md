# L36: Data Import & Export

## 🎯 Learning Objectives
- Identify when to use the Data Import Wizard versus Data Loader based on object type, record volume, and scheduling needs
- Configure and run a data import with the Data Import Wizard (max 50,000 records)
- Perform an upsert using an External ID field in Data Loader
- Export data using Data Export and Salesforce reports
- Understand batch size settings and their impact on Data Loader performance

## 📊 SLIDES

### Slide 1: Salesforce Data Tools Overview
**Visual:**
```
  ┌────────────────────────────────┬────────────────────────────────┐
  │   DATA IMPORT WIZARD           │   DATA LOADER                  │
  │   (Browser-based)              │   (Desktop app)                │
  ├────────────────────────────────┼────────────────────────────────┤
  │  No installation               │  Requires install (Win/Mac)    │
  │  Supported objects only        │  ALL Salesforce objects        │
  │  Max 50,000 records            │  Up to 5,000,000 records       │
  │  Insert & Update only          │  Insert/Update/Upsert/Delete/  │
  │                                │  Hard Delete/Export            │
  │  Beginner-friendly             │  Intermediate level            │
  └────────────────────────────────┴────────────────────────────────┘

  FOR EXPORT:
  ┌────────────────────────────────┬────────────────────────────────┐
  │   DATA EXPORT (Setup)          │   REPORT EXPORT                │
  │   Full org backup as CSV zip   │   Filtered subset of records   │
  │   Manual or scheduled weekly   │   Excel or CSV format          │
  └────────────────────────────────┴────────────────────────────────┘
```
**Content:**
- Salesforce provides two primary tools for data import:
  - **Data Import Wizard:** Browser-based wizard, no installation required
  - **Data Loader:** Downloadable desktop application (Windows/Mac), more powerful
- Both tools import data from CSV (comma-separated values) files
- For **data export:**
  - **Data Export:** Scheduled or manual export of all object data
  - **Reports:** Export specific record sets in various formats
  - **Data Loader:** Export using SOQL queries
**Speaker Notes:** Choosing the right tool is a core admin skill and a frequently tested exam topic. The key decision factors are: which objects are supported, how many records you're importing, whether you need scheduling/automation, and whether you need advanced operations like upsert. Let's go through each tool in detail.

### Slide 2: Data Import Wizard — Capabilities and Limits
**Visual:**
```
  Data Import Wizard — Step-by-Step

  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ STEP 1   │──▶│ STEP 2   │──▶│ STEP 3   │──▶│ STEP 4   │──▶│ STEP 5   │
  │ Select   │   │ Upload   │   │ Map      │   │ Review   │   │ Monitor  │
  │ Object   │   │ CSV File │   │ Fields   │   │ & Start  │   │ in Queue │
  │          │   │          │   │          │   │          │   │          │
  │Accounts  │   │contacts  │   │CSV col   │   │Preview   │   │ Status:  │
  │Contacts  │   │_data.csv │   │ ──▶ SF   │   │ mapping  │   │ Running/ │
  │Leads     │   │(max 50K  │   │field     │   │ confirm  │   │ Complete │
  │Custom    │   │ records) │   │          │   │          │   │          │
  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘

  Supported objects: Accounts, Contacts, Leads, Solutions,
                     Campaign Members, Custom Objects ONLY
```
**Content:**
- **Supported objects:** Accounts, Contacts, Leads, Solutions, Campaign Members, and **custom objects**
- Does NOT support: Opportunities, Cases, Products, and most other standard objects
- **Maximum records:** 50,000 records per import
- **Operation types:** Insert (new records) and Update (existing records by matching)
- **Deduplication:** Matches on Name (for Accounts) or Email (for Leads/Contacts) to avoid duplicates
- **Launch from:** Setup → Data Import Wizard, or Data tab in Setup
- **No installation required** — runs in the browser
**Speaker Notes:** The object support limitation is critical for the exam. Data Import Wizard ONLY supports Accounts, Contacts, Leads, Solutions, Campaign Members, and custom objects. If you need to import Opportunities, Cases, or other standard objects, you must use Data Loader. The 50,000 record limit is a hard cap — for larger imports, Data Loader is required. The wizard handles basic deduplication automatically when you specify matching criteria.

### Slide 3: Data Loader — Capabilities and Limits
**Visual:**
```
  Data Loader — Operation Buttons

  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐
  │  INSERT  │ │  UPDATE  │ │  UPSERT  │ │  DELETE  │ │ HARD DELETE │
  │          │ │          │ │          │ │          │ │             │
  │ Create   │ │ Update   │ │ Insert + │ │ Moves to │ │ Permanently │
  │ new      │ │ existing │ │ Update   │ │ Recycle  │ │ deletes —   │
  │ records  │ │ (needs   │ │ via      │ │ Bin      │ │ bypasses    │
  │          │ │ SF ID)   │ │ Ext. ID  │ │          │ │ Recycle Bin │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘

  ┌──────────┐ ┌──────────────┐
  │  EXPORT  │ │  EXPORT ALL  │
  │          │ │              │
  │ Active   │ │ Includes     │
  │ records  │ │ Recycle Bin  │
  │ only     │ │ records      │
  └──────────┘ └──────────────┘

  Supports ALL objects │ Up to 5,000,000 records │ Generates success/error CSV files
```
**Content:**
- **All Salesforce objects** (standard and custom) — no exclusions
- **Up to 5 million records** per operation (configurable batch size)
- **Operation types:**
  - **Insert:** Create new records
  - **Update:** Update existing records (requires Salesforce record ID)
  - **Upsert:** Insert new + update existing based on External ID
  - **Delete:** Soft delete (moves to Recycle Bin)
  - **Hard Delete:** Permanently delete (bypasses Recycle Bin)
  - **Export / Export All:** SOQL-based data extraction
- **Requires installation:** Windows or Mac desktop application
- **CSV-based:** Uses CSV input/output files
- **Success/Error files:** Generates output files for successful and failed records
**Speaker Notes:** Data Loader is the power tool. The upsert operation is the most exam-tested — it combines insert and update based on an External ID field. Hard Delete bypasses the Recycle Bin, permanently removing records — use with caution as this cannot be undone. The Export All operation also exports soft-deleted records from the Recycle Bin, unlike regular Export. Data Loader is essential for large migrations, integrations, and mass data maintenance.

### Slide 4: Upsert and External ID Fields
**Visual:**
```
  CSV file with External_ID__c column
  ┌──────────────────┬─────────────┬───────────┐
  │ External_ID__c   │ FirstName   │ LastName  │
  ├──────────────────┼─────────────┼───────────┤
  │ LEGACY-001       │ John        │ Smith     │
  │ LEGACY-002       │ Jane        │ Doe       │
  │ LEGACY-999       │ Bob         │ Jones     │
  └──────────────────┴─────────────┴───────────┘
                  │
                  ▼  Data Loader UPSERT operation
                  │
          For each row, check:
          Does a record with this External ID already exist?
                  │
          ┌───────┴────────┐
          ▼                ▼
     YES → UPDATE     NO → INSERT
     that record      new record

  External ID field setup: custom field → check "External ID" checkbox
  Can be: Text, Number, or Email field type
```
**Content:**
- **Upsert** = Update + Insert combined in one operation
  - Existing records are updated; new records (by ID match) are inserted
- **External ID:** A custom field marked as an "External ID" (checkbox in field setup)
  - Must be a Text, Number, or Email field type
  - Used as the matching key for upsert instead of Salesforce's internal 18-character ID
  - Can be set as Unique to prevent duplicates
- **Why External ID?** During data migration, you may not know Salesforce record IDs; use your source system's ID as External ID
- **External ID for relationship fields:** Also used to relate records during import without knowing Salesforce parent IDs
- Example: Import Contacts with Account Name as External ID to link to the right Account
**Speaker Notes:** The upsert operation with External ID is one of the most important concepts for data management. If you're migrating data from another CRM, your records have their own IDs in that system. By creating an External ID field in Salesforce and loading those source IDs, you can do upserts that intelligently insert new records and update existing ones — without needing to know Salesforce's internal record IDs. External IDs also allow cross-object relationships during import.

### Slide 5: Data Loader Batch Size Settings
**Visual:**
```
  Data Loader Settings — Batch Size

  ┌────────────────────────────────────────────────────────────┐
  │  Batch Size: [ 200      ]  records per API call            │
  └────────────────────────────────────────────────────────────┘

  Smaller batch (e.g., 50)          Larger batch (e.g., 2,000)
  ─────────────────────────         ──────────────────────────
  ✓ Better error isolation          ✓ Fewer API calls
    (failure affects 50 records)      (faster for large volumes)
  ✓ Easier to identify bad rows     ✗ One bad batch = 2,000 failures
  ✗ More API calls                  ✗ Counts more against API limits
  ✗ Slower

  Default: 200 │ Standard API max: 200 per call
  Bulk API:    up to 10,000 per batch (asynchronous)

  API limits: ~15,000 calls/day (most editions)
  For millions of records: enable Bulk API in Data Loader settings
```
**Content:**
- **Batch size:** Number of records per API call (configurable 1–200 for standard, up to 10,000 for Bulk API)
- **Default batch size:** 200 records per batch
- **Smaller batch size (e.g., 50):**
  - More API calls but fewer records affected per failed batch
  - Better for error isolation
- **Larger batch size (e.g., 2,000 with Bulk API):**
  - Fewer API calls, faster processing for large volumes
  - One batch failure affects all records in that batch
- **Bulk API:** For very large volumes (millions of records); asynchronous processing
  - Enable in Data Loader settings
  - Processes data in bulk batches asynchronously
- **API limits:** Count against your org's daily API call limit (15,000/day for most editions)
**Speaker Notes:** Batch size is a balancing act between speed and error isolation. The default of 200 is a good starting point. For very large imports (hundreds of thousands of records), enable the Bulk API and increase batch size to 10,000. The Bulk API uses asynchronous processing — Data Loader submits the batch, Salesforce processes it in the background, and you check the results later. This is much more efficient for large volumes than synchronous REST API calls.

### Slide 6: Data Export — Scheduled and Manual
**Visual:**
```
  Setup → Data Management → Data Export

  ┌─────────────────────────────────────────────────────────────┐
  │  [ Export Now ]           [ Schedule Export ]               │
  │                                                             │
  │  Generates immediately    Runs automatically:               │
  │                           • Weekly (every 7 days)           │
  │                           • Monthly                         │
  │                           Email sent when ready             │
  └──────────────────────┬──────────────────────────────────────┘
                         │
                         ▼
  Exported zip file contains one CSV per object:
  ┌─────────────────────────────────────────┐
  │  WE_00000000_1.ZIP                      │
  │  ├── Account.csv                        │
  │  ├── Contact.csv                        │
  │  ├── Opportunity.csv                    │
  │  ├── Case.csv                           │
  │  └── ... (all selected objects)         │
  └─────────────────────────────────────────┘

  ⚠ Download link expires after 48 hours
  Requires "Weekly Data Export" permission
```
**Content:**
- **Data Export** exports all data from your Salesforce org as a set of CSV files
- **Manual Export (Export Now):**
  - Available immediately; generates zip file with CSVs for selected objects
  - Can include or exclude archived activities, documents
- **Scheduled Export:**
  - **Professional/Enterprise/Unlimited:** Weekly (every 7 days) or monthly exports
  - Exports run automatically on schedule; link emailed to admin when ready
  - Export file available for download for 48 hours
- **Scope:** Entire org data; all records including archived
- **Limitation:** Does not export metadata (page layouts, fields, etc.) — use Change Sets for that
- **Access:** Requires "Weekly Data Export" permission
**Speaker Notes:** Data Export is your backup and compliance tool. Every Salesforce admin should have scheduled weekly exports configured to protect against accidental data loss. The exported zip file contains one CSV per object with all fields and all records. Note the 48-hour download window — if you miss it, you need to re-run the export. Data Export is for DATA backup only — it doesn't capture your org's configuration. For configuration backup, use change sets or version control with the Salesforce CLI.

### Slide 7: Reports for Data Export
**Visual:**
```
  Salesforce Report → Export Options

  ┌──────────────────────────────────────────────────────┐
  │  My Opportunities Report                             │
  │                              [ Export ▼ ]           │
  └────────────────────────────────────┬─────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
           Formatted Report (.xlsx)          Details Only (.csv)
           ──────────────────────            ─────────────────────
           ✓ Excel with groupings            ✓ Raw CSV, machine-
             and subtotals                    readable
           ✓ Best for stakeholders           ✓ Best for downstream
             and offline review               processing / re-import
           ✗ Not easily machine-            ✗ No formatting or
             parseable                        groupings

  Limitations:
  • Limited to records visible to the running user (sharing applies)
  • Max ~100,000 rows
  • Only fields in report columns are exported
  • Requires "Export Reports" permission
```
**Content:**
- **Report Export:** Export the results of any Salesforce report
- **Export formats:**
  - **Formatted Report (.xlsx):** Excel format with report formatting, groupings, subtotals
  - **Details Only (.csv):** Raw CSV with just the field values, no formatting
- **When to use report export:**
  - Export a specific subset of data (filtered by date, owner, etc.)
  - Share data with stakeholders in Excel format
  - Extract data for offline analysis
- **Limitations:**
  - Limited to records visible to the running user
  - Maximum ~100,000 rows (varies by export type)
  - Does not include all fields — only fields in the report columns
- **Permission required:** "Export Reports" in profile/permission set
**Speaker Notes:** Report export is ideal when you need a specific subset of data, not the full org export. The "Details Only" CSV format is machine-readable and works well for downstream processing. The "Formatted" Excel format is better for sharing with business stakeholders. Remember that report exports are limited by the running user's data access — they won't see records beyond their sharing permissions. Also, you need the "Export Reports" permission explicitly; it's not automatically included in all profiles.

### Slide 8: Tool Selection Guide — Exam Summary
**Visual:**
```
  Which tool should I use?

  ┌─────────────────────┬───────────────────┬──────────────────────┐
  │ Criteria            │ Data Import Wizard │ Data Loader          │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Objects             │ Accounts, Contacts │ ALL objects          │
  │                     │ Leads, Custom only │                      │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Max Records         │ 50,000             │ 5,000,000            │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Upsert              │ No                 │ Yes                  │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Schedule/Automate   │ No                 │ Yes (CLI/batch)      │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Installation        │ None (browser)     │ Required             │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Hard Delete         │ No                 │ Yes                  │
  ├─────────────────────┼───────────────────┼──────────────────────┤
  │ Skill level         │ Beginner           │ Intermediate         │
  └─────────────────────┴───────────────────┴──────────────────────┘

  Export tools:  Data Export → full org backup │ Report → filtered subset
```

| Criteria | Data Import Wizard | Data Loader |
|----------|-------------------|-------------|
| Objects | Accounts, Contacts, Leads, Custom | All objects |
| Max Records | 50,000 | 5,000,000 |
| Upsert | No | Yes |
| Schedule/Automate | No | Yes (CLI/batch) |
| Installation | None (browser) | Required |
| Hard Delete | No | Yes |
| Skill level | Beginner | Intermediate |

**Content:**
- **Choose Data Import Wizard when:** Object is supported, under 50K records, simple insert/update, no scheduling needed
- **Choose Data Loader when:** Unsupported object, over 50K records, need upsert, need automation, need hard delete
- **Choose Data Export when:** Need backup of all org data
- **Choose Report Export when:** Need a specific filtered subset of data
**Speaker Notes:** Memorize this comparison table for the exam. The most common exam question format: "A company needs to import 200,000 Opportunity records from their old CRM. Which tool should they use?" Answer: Data Loader — because Data Import Wizard doesn't support Opportunities AND the volume exceeds 50,000. Another common scenario: "An admin needs to import records that may already exist in the system, matching on an external ID." Answer: Data Loader with Upsert operation using External ID.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 36 — Data Import and Export. Data management is a core admin responsibility, and the exam tests whether you can choose the right tool for different scenarios. Let's make sure you can answer those questions confidently.

Salesforce has two main import tools: the Data Import Wizard and Data Loader. The Wizard runs in the browser — no installation. Data Loader is a desktop application you install on Windows or Mac.

Data Import Wizard supports only specific objects: Accounts, Contacts, Leads, Solutions, Campaign Members, and custom objects. It maxes out at 50,000 records. Operations are limited to insert and update. It's the right tool for simple, smaller imports of supported objects.

Data Loader supports ALL Salesforce objects with no exceptions. It handles up to 5 million records. It adds three critical operations: Upsert, Delete, and Hard Delete. Use Data Loader when: the object isn't supported by the Wizard, you have more than 50,000 records, you need upsert, or you need to schedule automated imports.

Let's focus on Upsert because it's heavily tested. Upsert combines insert and update. You define a matching key — an External ID field on the Salesforce object. For each record in your CSV, Data Loader checks: does a Salesforce record already exist with this External ID value? If yes, it updates that record. If no, it inserts a new record. External IDs are custom fields you mark with the "External ID" checkbox in field setup. They're typically your source system's unique identifier.

Batch size in Data Loader determines how many records are sent per API call. The default is 200. Smaller batches are safer (one bad record fails only that batch's 200 records, not thousands). Larger batches are faster. For millions of records, enable the Bulk API for asynchronous processing.

For exports, you have two tools. Data Export in Setup exports your entire org's data as a zip of CSV files. You can run it manually or schedule it weekly. The download link is only available for 48 hours, so act quickly. Report Export lets you export the results of any specific report — filtered, formatted, just what you need.

For the exam: know the object support difference (Wizard = limited objects, Loader = all objects), the record count difference (Wizard = 50K max, Loader = 5M), that only Loader supports upsert and hard delete, and what External IDs are used for.

## 🔔 EXAM TIPS
- **Wizard Object Support:** Accounts, Contacts, Leads, Solutions, Campaign Members, Custom Objects ONLY. Opportunities, Cases, and most standard objects require Data Loader.
- **50,000 Record Limit:** Data Import Wizard hard limit. Above this, use Data Loader.
- **Upsert + External ID:** Upsert is Data Loader only. External ID field must be created as a custom field with the External ID checkbox checked.
- **Hard Delete:** Data Loader only; permanently deletes records without going to Recycle Bin.
- **Data Export Download Window:** Export files are available for 48 hours after generation.
- **Batch Size:** Data Loader default is 200 records per batch. Bulk API increases this significantly for large volumes.
- **Export All:** Data Loader's Export All operation includes records in the Recycle Bin; regular Export does not.

## ✅ LECTURE SUMMARY
- Data Import Wizard: browser-based, supports Accounts/Contacts/Leads/Custom objects, max 50,000 records, insert and update only
- Data Loader: desktop app, all objects, up to 5 million records, supports insert/update/upsert/delete/hard delete/export
- Upsert: inserts new records and updates existing ones, matching on an External ID custom field
- External ID: custom field marked as External ID, used as a matching key during upsert operations
- Data Loader batch size: default 200 per batch; Bulk API available for high-volume asynchronous processing
- Data Export: full org backup as CSV files; manual or scheduled (weekly/monthly); download window = 48 hours
- Report Export: filtered data subset; formats: Formatted (.xlsx) or Details Only (.csv)

## ❓ MINI QUIZ

**Q1:** A company needs to import 75,000 Case records from a legacy CRM. Which tool should the admin use?
- A) Data Import Wizard, with records split into two batches of 37,500
- B) Data Loader, since Cases are not supported by Data Import Wizard and the volume exceeds 50,000
- C) Data Import Wizard, since custom objects are supported
- D) Salesforce Report import feature

**Answer:** B — Data Loader is required here for two reasons: (1) Cases are not one of the objects supported by Data Import Wizard (only Accounts, Contacts, Leads, Solutions, Campaign Members, and custom objects are), and (2) the volume of 75,000 records exceeds the Data Import Wizard's 50,000 record limit.

**Q2:** An admin is migrating Contact records from an external system into Salesforce. Some Contacts already exist in Salesforce (from a previous partial migration). The admin wants to update existing Contacts and insert new ones in a single operation. What must be configured in Salesforce BEFORE running this operation?
- A) A validation rule that checks for duplicate contacts
- B) A custom field on Contact marked as an External ID, populated with the source system's unique identifier
- C) A duplicate rule on the Contact object
- D) A Process Builder that detects and merges duplicate contacts

**Answer:** B — For a Data Loader Upsert operation, a custom field must exist on the Contact object that is marked as an External ID. This field will contain the source system's unique identifier (e.g., the legacy CRM's Contact ID), which Data Loader uses to match incoming records to existing Salesforce records for updates.

**Q3:** An admin schedules a weekly Data Export. After the export runs on Monday morning, when does the download link expire?
- A) 24 hours after generation
- B) 48 hours after generation
- C) 7 days after generation
- D) It does not expire — the file is stored permanently

**Answer:** B — Data Export download links are available for 48 hours after the export is generated. After this window, the link expires and the export must be run again to get a new download. Admins should download the export files promptly after receiving the email notification.
