# L08: Data Management Tools

## Exam Domain
Data Modeling & Management — 22% of exam weight

---

## Core Concepts

### Data Import Wizard vs. Data Loader — Know the Difference
These two tools are heavily tested in the exam. The key distinction: **Data Import Wizard** is browser-based, limited to 50,000 records, and supports only specific standard objects plus custom objects. **Data Loader** is a desktop application, handles up to 5 million records, supports ALL objects (including objects Data Import Wizard doesn't), and can delete or hard-delete records. If the scenario involves more than 50,000 records, deleting data, or using objects DIW doesn't support — the answer is Data Loader.

### External ID Fields
An External ID is a custom field with the "External ID" checkbox enabled. It marks a field as the unique identifier from an external system (like a CRM or ERP ID). External IDs enable **upsert** operations — insert if the external ID doesn't exist, update if it does — without needing to know Salesforce's internal record ID. Always design your integration data model with External ID fields when syncing with external systems.

### Upsert Operation
Upsert = Insert + Update in one operation. You provide a matching field (the External ID), and Salesforce: (1) creates a new record if no match exists, (2) updates the existing record if a match is found. Data Loader supports upsert using External ID fields. This is the standard pattern for keeping Salesforce in sync with external systems without duplicating records.

### Data Export and Backup
Salesforce provides **Data Export** (Setup → Data → Data Export) to schedule regular CSV exports of all org data. Available weekly or monthly based on org edition. Best practice: set up a weekly export and store the files externally. For complete backup-and-restore, third-party tools (Odaseva, Spanning, etc.) are more reliable than manual exports.

### Duplicate Management
Salesforce has built-in duplicate management using **Matching Rules** (how to identify duplicates) and **Duplicate Rules** (what to do when a duplicate is detected — alert, block, or allow with warning). Data Loader bypasses duplicate rules by default — this is a commonly tested fact.

---

## PTA / SA Relevance

**For data migration projects:** Large data migrations (>50,000 records) always require Data Loader or a third-party ETL tool. Plan for 3 phases: (1) migrate with Data Loader, (2) validate record counts and spot-check data, (3) delta migration for any changes since the initial load. Never try to do a multi-million record migration with Data Import Wizard.

**Integration architecture:** External ID fields are your friend. Design every object that will be touched by an external integration with an External ID field for that system's primary key. This makes upserts safe and idempotent — running the same load twice won't duplicate data.

**Data Loader limitation for triggers/flows:** Data Loader fires triggers and flows by default. If you need to load data without triggering automation (e.g., historical data load), you need to either disable the automation temporarily or use a tool with a bypass mechanism (Apex Data Loader API with trigger bypass permission). This is a real-world migration concern.

**Duplicate rules bypass:** Data Loader bypasses duplicate rules. This means bulk loads can introduce duplicates that the UI would have caught. Always run a deduplication pass after large data loads.

---

## Architecture / How It Works

```
Data Import Wizard vs. Data Loader Comparison:
┌──────────────────────────┬──────────────────┬──────────────────────┐
│ Feature                  │ Data Import Wiz. │ Data Loader          │
├──────────────────────────┼──────────────────┼──────────────────────┤
│ Interface                │ Browser (UI)     │ Desktop app          │
│ Max Records              │ 50,000           │ 5,000,000            │
│ Supported Objects        │ Select standard  │ ALL objects          │
│                          │ + custom objects │                      │
│ Delete Records?          │ No               │ Yes (+ hard delete)  │
│ Bypass Duplicate Rules?  │ No               │ Yes                  │
│ Upsert via External ID?  │ Yes              │ Yes                  │
│ Schedule Imports?        │ No               │ With CLI/script      │
│ Field Mapping            │ Auto + manual    │ Manual CSV column map│
│ Export Records?          │ No               │ Yes                  │
└──────────────────────────┴──────────────────┴──────────────────────┘
```

**Limitations:**
- Data Import Wizard does not support: Products, Events, Tasks, Opportunity Product — use Data Loader for these
- Data Loader requires Java installation and can be complex to configure for non-technical users
- Neither tool bypasses validation rules — validation rules always fire on all inserts/updates

```
Upsert Operation Flow (External ID):
┌────────────────────────────────────────────────────────────────────┐
│  Incoming Record (from external system):                           │
│  ExternalCRM_ID__c = "EXT-001"                                     │
│                                                                    │
│  Upsert checks: Does a Salesforce record exist                     │
│  where ExternalCRM_ID__c = "EXT-001"?                              │
│                                                                    │
│  ├─ NO  ──► INSERT new record (creates new Salesforce record)      │
│  └─ YES ──► UPDATE existing record (updates matched record)        │
│                                                                    │
│  Result: Safe to run the same load twice — no duplicate creation   │
└────────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Upsert via External ID only works with fields that have the "External ID" checkbox enabled
- If multiple Salesforce records match the same External ID value, upsert throws a duplicate key error
- External IDs are case-insensitive by default for matching purposes

```
Data Export Schedule Options:
┌────────────────────────────────────────────────────┐
│  Setup → Data → Data Export                        │
│                                                    │
│  Export Now: immediate one-time export             │
│  Schedule Export: Weekly or Monthly (by edition)  │
│                                                    │
│  Output: ZIP file containing CSV files            │
│          One CSV per object                        │
│          Available for download for 48 hours       │
└────────────────────────────────────────────────────┘
```

**Limitations:**
- Scheduled export does not back up document/file attachments (separate Salesforce Files export needed)
- Export files are only available for download for 48 hours after generation
- Data Export is not a real-time backup — it's a point-in-time snapshot

---

## Key Facts to Memorize
- Data Import Wizard: 50,000 max, browser-based, no delete, select objects only
- Data Loader: 5M max, desktop app, all objects, supports delete and hard delete
- Data Loader bypasses duplicate rules (DIW respects them)
- Neither tool bypasses validation rules — they always fire
- External ID field: custom field with External ID checkbox = enables upsert, marks external system key
- Upsert: insert-if-new, update-if-match — uses External ID as matching key
- Hard delete: bypasses Recycle Bin, cannot be recovered — Data Loader only
- Data Export: Setup path, weekly or monthly schedule, 48-hour download window

---

## Exam Traps
- **"50,000 record limit" = Data Import Wizard.** Any scenario mentioning 50,001+ records means you need Data Loader.
- **Data Loader can DELETE.** Data Import Wizard cannot. If a scenario involves deleting or hard-deleting records, Data Loader is the tool.
- **Data Loader bypasses duplicate rules.** If a scenario says duplicate rules should be enforced during a bulk load, Data Import Wizard is the safer choice (but it's limited to 50K records).
- **Neither tool bypasses validation rules.** This is the opposite of duplicate rules — validation rules always fire during API inserts/updates from both tools.
- **External ID is a field configuration, not a field type.** You enable it via a checkbox on an existing field (Text, Number, Email, etc.). Any of those field types can be made an External ID.

---

## Practice Questions

**Q:** An admin needs to load 200,000 Contact records from an external HR system into Salesforce. The load should match on an employee ID field to avoid duplicates. Which tool and feature should be used?
**A:** Data Loader with an External ID upsert. The employee ID field on Contact should have the "External ID" checkbox enabled. Data Loader handles 200,000 records well above the 50,000 limit of Data Import Wizard, and the upsert operation will update existing matches and insert new ones without creating duplicates.

**Q:** A company uses Data Import Wizard to load 10,000 new Lead records. After the import, users report duplicates are being created even though duplicate rules are configured. Why?
**A:** This is incorrect — Data Import Wizard respects duplicate rules (unlike Data Loader). The more likely cause is that the duplicate rules weren't correctly configured or the matching rule isn't matching on the right field. If Data Loader was used instead, that would bypass duplicate rules.

**Q:** An admin accidentally imported 5,000 records with incorrect data and needs to delete them all immediately to clean up. The records don't need to go to the Recycle Bin. Which action in Data Loader achieves this?
**A:** Hard Delete. Data Loader's Hard Delete action removes records permanently without placing them in the Recycle Bin. (This requires the "Bulk API Hard Delete" permission.)
