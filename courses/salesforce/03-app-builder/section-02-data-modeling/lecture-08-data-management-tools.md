# L08: Data Management Tools

## 🎯 Learning Objectives
- Compare Data Import Wizard and Data Loader to select the right tool for each scenario
- Explain how external IDs enable upsert operations for data loading
- Describe how to schedule and perform data exports from Salesforce
- Apply best practices for data backup before making significant org changes

---

## 📊 SLIDES

### Slide 1: Why Data Management Tools Matter for App Builders
**Visual:** Three scenarios illustrated. Left: "New App Launch — load initial data from legacy system." Center: "Ongoing Integration — daily sync from ERP." Right: "Maintenance — bulk update field values after picklist change." Arrow pointing to common solution: "Data Management Tools."
**Content:**
- Every Salesforce implementation requires moving data: initial loads, ongoing syncs, bulk updates
- **Data management tools** handle the import, export, and maintenance of data records
- As an App Builder, you don't always run these tools yourself — but you must design for them
- Key tools: **Data Import Wizard** (built into Salesforce) and **Data Loader** (downloadable application)
- Understanding when each tool applies is a direct exam topic
**Speaker Notes:** Data migration is often the most underestimated part of any Salesforce implementation. App builders focus on building the model and the automation, then realize there's an existing system with years of data that needs to come over. Knowing your data management tools — their limits, their strengths, their quirks — is part of being a complete app builder. This lecture gives you what you need for the exam and for real-world work.

### Slide 2: Data Import Wizard — Overview
**Visual:** Annotated screenshot of the Data Import Wizard interface inside Salesforce Setup. Key callouts: "Access from: Setup > Data Import Wizard," "Supports: Leads, Contacts, Accounts, Campaign Members, Custom Objects," "Record limit: up to 50,000 per import," "Interface: browser-based wizard — no installation required."
**Content:**
- Built directly into Salesforce — access from **Setup > Data Import Wizard**
- **No download or installation required** — runs in the browser
- Supports: Leads, Contacts, Accounts, Campaign Members, Opportunities (with limits), and custom objects
- Maximum **50,000 records per import file**
- Operations: insert (new records), update (existing records), upsert (insert + update combined)
- Maps CSV columns to Salesforce fields visually — user-friendly for non-technical users
**Speaker Notes:** The Data Import Wizard is the friendly, accessible option. If someone on your team is handling a one-time import of contact records from an Excel spreadsheet, Data Import Wizard is what you'd point them to. It's browser-based, it walks you through the process step by step, it shows you a mapping screen so you can visually connect your spreadsheet columns to Salesforce fields, and it gives you a clear summary after the import completes. For small to medium imports of supported objects, it's the right tool.

### Slide 3: Data Loader — Overview
**Visual:** Graphic showing Data Loader as a desktop application icon with feature callouts: "Downloadable from Salesforce" (download link in Setup), "All objects supported," "Up to 5 million records," "Operations: Insert, Update, Upsert, Delete, Hard Delete, Export, Export All," "CSV files in and out," "Schedulable via command line."
**Content:**
- Downloadable desktop application — Java-based, available for Windows and Mac
- Supports **all Salesforce objects** — standard and custom
- Maximum **5 million records per operation**
- Operations include **Delete** and **Hard Delete** — not available in Data Import Wizard
- **Upsert** uses an external ID field to match and update existing records or insert new ones
- Can be automated via command line for scheduled, unattended operations
- Generates success and error log files for every operation
**Speaker Notes:** Data Loader is the power tool. When volumes exceed 50,000 records, when you need to work with objects Data Import Wizard doesn't support, when you need to schedule automated daily loads, or when you need to delete records in bulk — that's when you use Data Loader. The delete and hard delete operations deserve special mention. A regular delete moves records to the Salesforce Recycle Bin for 15 days. Hard Delete bypasses the Recycle Bin entirely — the records are gone immediately and cannot be recovered. Use hard delete with extreme caution and always export a backup first.

### Slide 4: Data Import Wizard vs. Data Loader — Side-by-Side
**Visual:** Comparison table. Headers: Feature | Data Import Wizard | Data Loader. Rows: Access (browser / download required), Max records (50K / 5M), Supported objects (limited / all), Delete capability (no / yes), Hard Delete (no / yes), Scheduling (no / command line), Technical level (beginner-friendly / intermediate).
**Content:**
| Feature | Data Import Wizard | Data Loader |
|---|---|---|
| Access | Browser (no install) | Downloadable app |
| Max records | 50,000 | 5,000,000 |
| Supported objects | Leads, Contacts, Accounts, Custom | All objects |
| Delete records | No | Yes |
| Hard Delete | No | Yes |
| Schedule/automate | No | Yes (command line) |
| Technical level | Beginner-friendly | Intermediate |

**Speaker Notes:** This comparison table is exactly what the exam tests. Every detail in this table is fair game for a question: "A company needs to import 200,000 lead records. Which tool should be used?" (Data Loader — exceeds Data Import Wizard's 50,000 limit.) "An admin needs to delete records from a custom object in bulk. Which tool is required?" (Data Loader — only tool with delete capability.) Memorize these distinctions. Exam questions in this space are almost always asking you to choose the right tool for a given scenario.

### Slide 5: External IDs and Upsert Operations
**Visual:** Three-part diagram. Left: Source system with a column "LegacyID" (1001, 1002, 1003). Center arrow: "Upsert operation using ExternalID__c." Right: Salesforce records. Row 1001 exists → gets updated. Row 1002 is new → gets inserted. Row 1003 exists → gets updated. Label: "One operation, two outcomes."
**Content:**
- **Upsert** = Update + Insert in one operation. Matches existing records and updates them; creates new records that don't exist.
- Matching key: an **External ID field** on the Salesforce object — a custom field marked "External ID"
- External ID fields are indexed — fast lookup performance for large upserts
- External IDs can also be marked "Unique" to enforce no duplicates
- Without an external ID, upsert falls back to using the Salesforce record ID
- **Key use case:** Loading records from a legacy system where each record has a unique ID from the old system
**Speaker Notes:** Upsert is the most common data loading pattern in enterprise Salesforce implementations. Here's why: you rarely know definitively whether a record already exists in Salesforce. Maybe you're doing a partial migration, or running a nightly sync from an ERP. With upsert, you just provide the external ID value — Salesforce checks if a record with that external ID already exists. If it does, update it. If it doesn't, create it. You don't have to pre-sort your load file into "inserts" and "updates." External IDs are what make this work — always create one when you're building an object that will receive data from external systems.

### Slide 6: Data Export — Getting Data Out of Salesforce
**Visual:** Two export options shown. Left: "Data Export (Setup)" — showing the menu path Setup > Data Export, with options for weekly export and monthly export, and file format showing .zip with CSV files. Right: "Data Loader Export" — showing an SOQL query screen with a CSV output file.
**Content:**
- **Setup > Data Export:** Scheduled export of your entire org's data as CSV files in a zip archive
- Frequency options: **weekly** or **monthly** export. First export requires 48-hour wait.
- Exported files available to download for **48 hours** — must download promptly
- **Data Loader Export operation:** Run a SOQL query and export results to CSV — flexible, ad hoc
- **Data Loader Export All:** Includes records in the Recycle Bin (soft-deleted records)
- Best practice: schedule monthly exports as a backup baseline, use Data Loader for targeted exports
**Speaker Notes:** Data export is often overlooked until the day something goes wrong and you need to restore data. Don't be that person. Set up a scheduled monthly export from Setup > Data Export — it's free, it's automated, and it's your safety net. The weekly option exists if you have a low risk tolerance for data loss. Remember the 48-hour window to download the files. Some admins set a recurring calendar reminder to download the export file on the same day each month. Also know the Export All operation in Data Loader — it's useful when you need to see deleted records, which the standard Export operation doesn't include.

### Slide 7: Data Quality — Deduplication and Validation
**Visual:** Four-quadrant graphic. Quadrant 1: "Duplicate Rules — prevent duplicate records on save." Quadrant 2: "Matching Rules — define what makes two records 'the same'." Quadrant 3: "Validation Rules — enforce data quality on all record saves." Quadrant 4: "Data Import Wizard Duplicate Handling — check for existing matches during import."
**Content:**
- **Duplicate Rules:** Alert or block users from creating duplicate records (Leads, Contacts, Accounts, custom objects)
- **Matching Rules:** Define the logic for what constitutes a "duplicate" — fuzzy matching on name, email, phone
- Duplicate and Matching Rules apply to Data Import Wizard imports — enforce data quality at import time
- **Data Loader bypasses duplicate rules by default** — duplicates can be created
- Validation rules do apply to Data Loader imports — records that fail validation will error
- Always validate data quality in your import file before loading (spreadsheet cleanup first)
**Speaker Notes:** Data quality is where the best data models fail in practice — bad data in, bad data out. Duplicate records are the bane of Salesforce orgs. Duplicate and Matching Rules are your automated defense, but they're not foolproof. When you're doing a large data load, deduplicate your source data before it hits Salesforce. Spreadsheet tools like Excel or Python scripts can find and merge duplicates before they land in your org. And remember: Data Loader bypasses duplicate rules. If you're loading 100,000 records with Data Loader and your source data has duplicates, they will all get created. This is tested on the exam — know that Data Loader bypasses duplicate rules.

### Slide 8: Data Backup Best Practices
**Visual:** "Before any major change" checklist with clock icon: (1) Export all affected objects via Data Export or Data Loader. (2) Store exports in a secure location (not just on your laptop). (3) Document the change you're about to make. (4) Test the change in sandbox first. (5) Make the change. (6) Validate in production. (7) Keep the backup for at least 30 days.
**Content:**
- **Always back up before:** Deleting a custom object or field, running a bulk update, deploying a change set, changing picklist values in use
- Salesforce Recycle Bin holds deleted records for **15 days** — but doesn't help with field deletions or data changes
- Deleting a custom field **permanently deletes all data in that field** — there is no recycle bin for field data
- Backup options: Setup > Data Export (scheduled), Data Loader Export (ad hoc), third-party backup tools
- Store backups **externally** — not only within Salesforce
**Speaker Notes:** The most painful lesson in Salesforce administration is learning that deleting a custom field permanently destroys all the data in that field. There is no recycle bin. There is no undo. If you delete a field that had 50,000 records with data in it, that data is gone. Period. This is why you always export data for affected objects before any significant change. Fifteen seconds of export time versus potentially unrecoverable data loss — it's not even close. Make backup-before-change a reflex. It's one of those habits that defines professional Salesforce practitioners.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 08 — Data Management Tools. This lecture is about moving data in and out of Salesforce. As an app builder, you'll encounter data migration on every significant project: loading initial data when a new app goes live, doing bulk updates when requirements change, and maintaining backups before anything potentially destructive.

Let's start with the two main tools. Slide 2 covers Data Import Wizard. It's browser-based — no installation required. It supports the most common objects: Leads, Contacts, Accounts, Campaign Members, and custom objects. The hard limit is 50,000 records per import. It's wizard-driven, user-friendly, and suitable for non-technical users doing one-time imports.

Slide 3 covers Data Loader. This is the power tool — download it from Salesforce, install it, and you get support for ALL objects, up to 5 million records, and operations that Data Import Wizard doesn't have: Delete, Hard Delete, and automated scheduling via command line. The tradeoff is complexity — it requires more technical knowledge to operate.

Slide 4 is the comparison table. This is exam material, full stop. Know the differences by heart: 50K vs 5M records. Browser vs downloadable. Limited objects vs all objects. No delete capability vs delete and hard delete. Every cell in that table could be an exam question. "Which tool would you use to delete records from a custom object in bulk?" Data Loader. "Which tool is appropriate for a non-technical admin to import 20,000 Contact records?" Data Import Wizard.

Slide 5 is about external IDs and upsert. External IDs are custom fields you mark as "External ID" — they act as the matching key for upsert operations. Upsert is the operation that says: "if a record with this external ID already exists, update it; if not, create it." This is the core pattern for enterprise data migrations and ongoing synchronizations from external systems. When you're building a custom object that will receive data from another system, always create an External ID field on it from day one.

Slide 6 covers data export. Setup > Data Export gives you scheduled full-org exports. Weekly or monthly. Files are available for 48 hours. Data Loader's Export operation lets you run targeted SOQL queries and export results to CSV. Data Loader's Export All operation includes records in the Recycle Bin.

Slide 7 is about data quality — deduplication specifically. Data Import Wizard respects your duplicate rules. Data Loader does NOT. If you load 10,000 records with duplicates using Data Loader, you'll get 10,000 records, duplicates and all. Clean your source data before loading.

And Slide 8 — the backup sermon. Deleting a custom field permanently deletes all its data. No recycle bin. No undo. Back up before every significant change. It's not optional; it's professional responsibility.

---

## 🔔 EXAM TIPS
- **50,000 vs 5,000,000:** Data Import Wizard max is 50,000 records. Data Loader max is 5,000,000. If a scenario has more than 50,000 records, the answer is Data Loader.
- **Delete operations:** Only Data Loader can delete records. Data Import Wizard has no delete functionality.
- **Hard Delete:** Bypasses the Recycle Bin — records are immediately and permanently deleted. Only available in Data Loader.
- **Data Loader bypasses duplicate rules:** Data Import Wizard respects duplicate rules; Data Loader does not. If duplicate prevention is required for an import, use Data Import Wizard or deduplicate before using Data Loader.
- **Deleting a custom field deletes its data permanently:** The Recycle Bin does not apply to field data. Always export before deleting fields.
- **External ID for upsert:** A custom field marked as External ID is the matching key for upsert operations. If an exam scenario involves loading records from a legacy system with unique IDs, the answer involves creating an External ID field.

---

## ✅ LECTURE SUMMARY
- Data Import Wizard: browser-based, 50,000 records max, limited objects, no delete capability — ideal for simple imports by non-technical users
- Data Loader: downloadable application, 5,000,000 records, all objects, includes delete and hard delete — required for high-volume or automated data operations
- External ID fields enable upsert operations — Salesforce matches incoming records by external ID and either updates or inserts accordingly
- Data Loader bypasses duplicate rules; Data Import Wizard respects them
- Deleting a custom field permanently destroys all data in that field — always export a backup before significant changes

---

## ❓ MINI QUIZ

**Q1:** A company needs to import 75,000 Lead records from a CSV file into Salesforce. Which tool should be used?
- A) Data Import Wizard — it supports Lead imports up to 75,000 records
- B) Data Loader — it supports all objects and volumes up to 5 million records
- C) Either tool works — they have the same record limits
- D) Setup > Data Export — used for large imports

**Answer:** B — Data Import Wizard has a maximum of 50,000 records per import. Since the import requires 75,000 records, Data Loader must be used. Data Export is for exporting data, not importing.

**Q2:** An App Builder creates a custom object called Purchase_Order__c and marks a text field called PO_Number__c as "External ID." Data will be loaded nightly from an ERP system. Each record has a unique PO number. Which Data Loader operation should be used to ensure existing records are updated and new records are created without creating duplicates?
- A) Insert — to add all records as new
- B) Update — to update only existing records
- C) Upsert — to update existing records matched on PO_Number__c and insert new records
- D) Hard Delete — to remove old records before inserting new ones

**Answer:** C — Upsert is the correct operation. It uses the External ID field (PO_Number__c) to match incoming records. Records that already exist in Salesforce are updated; records that don't exist yet are inserted. This prevents duplicates without requiring pre-sorted load files.

**Q3:** An admin is about to delete a custom field that was used for three years and currently contains data in 40,000 records. Before deleting, what should the admin do?
- A) Nothing — deleted fields are stored in the Recycle Bin for 15 days
- B) Export the data in that field using Data Loader or Data Export before deleting
- C) Move the field data to a backup object using a Flow before deleting
- D) Archive the field in Schema Builder before deleting

**Answer:** B — Deleting a custom field permanently destroys all data stored in that field. The Recycle Bin only applies to record deletions, not field data. The admin must export the field data to an external file before deleting the field to ensure recovery is possible if needed.
