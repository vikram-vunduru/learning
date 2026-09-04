# Data Cloud Hands-On Lab Session Notes
> Personal study log — interactive lab walkthroughs with screenshots, Q&A, and key insights

---

## LAB 1 — Data Cloud Environment Setup & Orientation
**Status: COMPLETE**

---

### Core Concept: Data Cloud vs Salesforce CRM

The #1 source of confusion — these are fundamentally different systems.

| | Salesforce CRM | Data Cloud |
|---|---|---|
| **What it is** | Transactional system of record | Customer Data Platform (CDP) |
| **Stores** | Accounts, Contacts, Opportunities | Raw events, behavioral data, unified profiles |
| **Scale** | Millions of records | Billions of events |
| **Purpose** | "What's the status of this deal?" | "Who is this person across ALL our systems?" |
| **Data flow direction** | Source | CRM feeds INTO Data Cloud |

**Mental model:** CRM → Data Cloud (ingestion). Data Cloud → CRM only for activation write-backs.

---

### The 5-Layer Architecture

```
[1] INGEST    → Data Streams (CSV, CRM, API, S3)
[2] LAKE      → Data Lake Objects (DLOs) — raw, untouched copy
[3] MODEL     → Data Model Objects (DMOs) — standardized schema
[4] UNIFY     → Identity Resolution → Unified Individual profile
[5] ACTIVATE  → Segments pushed to Marketing Cloud, CRM, Google Ads
```

Every lab follows this pipeline top to bottom.

---

### Key Terminology

| Term | Definition |
|---|---|
| **Data Stream** | Configured connection to a source that feeds data into Data Cloud |
| **DLO** | Data Lake Object — raw table, stores data exactly as received from source |
| **DMO** | Data Model Object — standardized schema (Individual, Contact Point Email, etc.) |
| **Unified Individual** | The merged profile created by Identity Resolution — one record per real person |
| **Segment** | Saved filter on Unified Individual profiles = an audience |
| **Activation Target** | Destination system where segment members are pushed |
| **Calculated Insight** | ANSI SQL query that creates new computed attributes on profiles |

---

### What We Saw in the Org

**Demo org already had Salesforce CRM connector running.** Data Model showed 38 standard DMOs pre-populated including Account, Contact Point Email, Contact Point Phone, Individual — all with Status: Ready.

**The Individual DMO had:**
- 105 fields total
- API names all prefixed with `ssot__` (Single Source of Truth namespace)
- Mapped data streams: `Contact_Home` and `Lead_Home` — both CRM Contact AND Lead objects mapped to same Individual DMO
- Key fields with `Is Mapped: True`: FirstName, LastName, ExternalRecordId, DataSourceId, Id

**Important observation on the New Data Stream screen:**
- Connected Sources showed Salesforce CRM with a blue checkmark — already authenticated
- Other Sources: File Upload, Installed Data Kits & Packages
- Explore Other Connectors section — 50+ third-party connectors (most Beta): Act! CRM, ActiveCampaign, etc.

---

### Lab 1 Checkpoint — Q&A

**Q: Why does the Individual DMO have 105 fields but only ~10 are mapped?**

The Individual DMO is Salesforce's universal person schema — designed to accommodate any industry. Fields for education level, military status, marital status, FERPA disclosures — because some company somewhere needs each one. A demo org only has CRM Contacts/Leads, so only basic fields (name, email, dates) get populated. The other 95 sit empty, waiting for richer sources. Empty fields don't break anything.

**Q: Why are both CRM Contact AND CRM Lead mapped to the SAME Individual DMO?**

Because a Contact and a Lead both represent a real-world person — just at different CRM lifecycle stages. In CRM they're separate objects with different IDs. In the real world Marcus Williams at Global Bank is one human being. By mapping both to Individual, you tell Data Cloud: normalize them to the same schema so Identity Resolution can detect duplicates across them. This is something CRM alone can never do.

**Q: What is `ssot__ExternalRecordId__c` storing?**

The original CRM record ID — the 18-character Salesforce `Id` (e.g., `003...` for a Contact, `00Q...` for a Lead). When Data Cloud copies a record into a DLO and maps it to the Individual DMO, it generates a new `ssot__Id__c` as its own primary key. But you need a breadcrumb back to the source. `ExternalRecordId` stores that original CRM ID. Exam use case: "Which field tells you which CRM record to update when activating back?" — answer is ExternalRecordId.

---

---

## LAB 2 — CSV Data Stream Ingestion
**Status: IN PROGRESS**

---

### Core Concept: Data Streams & Data Categories

**A Data Stream** = a configured pipeline. One end connects to a source, the other writes into a DLO. It copies data faithfully — no transformation at this layer.

**The 4 Source Types:**

| Type | Use Case | Pull or Push |
|---|---|---|
| **Salesforce CRM Connector** | Pull CRM objects (Contact, Lead, Account etc.) | Pull |
| **Cloud Storage** | S3/Azure/GCS — batch files, nightly drops from legacy systems | Pull |
| **Ingestion API** | Real-time events — website clicks, mobile, IoT | Push (source POSTs to DC) |
| **File Upload** | One-time CSV upload — testing, POC, manual loads | Manual |

**The 3 Data Categories — EXAM CRITICAL:**

| Category | What it means | Example |
|---|---|---|
| **Profile** | Who a person IS — semi-static identity data | Contact, Lead, customer record |
| **Engagement** | What a person DID — events, behavioral, time-stamped | Email open, page view, purchase |
| **Other** | Reference data — not about individuals | Product catalog, store locations |

**Why category matters:**
1. **Identity Resolution only runs on Profile data.** Miscategorize as Engagement → IR ignores it → no Unified Individuals from that source
2. **Storage and processing differ** — Engagement data is high-volume, handled differently in query planning
3. **Category is PERMANENT** — cannot be changed after saving the Data Stream. Delete and re-create if wrong.

---

### The Lab Dataset — contacts.csv

File location: `courses/salesforce/06-data-cloud-consultant/lab-data/contacts.csv`

```
first_name,last_name,email,phone,city,account_name,product_interest,last_purchase_date
Sarah,Johnson,sarah.j@techcorp.com,415-555-0101,San Francisco,TechCorp Inc,Sales Cloud,2025-11-15
Marcus,Williams,marcus.w@globalbank.com,312-555-0202,Chicago,Global Bank,Service Cloud,2025-12-01
Priya,Patel,priya.p@healthsys.com,212-555-0303,New York,Health Systems,Data Cloud,2026-01-10
Jordan,Lee,jordan.l@retailco.com,512-555-0404,Austin,RetailCo,Agentforce,2026-02-28
Sarah,Johnson,s.johnson@gmail.com,415-555-0101,San Francisco,TechCorp Inc,Marketing Cloud,2026-03-15
David,Chen,d.chen@manufact.com,206-555-0505,Seattle,Manufacturing Co,MuleSoft,2025-10-20
Aisha,Brown,a.brown@fintech.com,617-555-0606,Boston,FinTech Ltd,Revenue Cloud,2026-01-25
Marcus,Williams,mwilliams@gmail.com,312-555-0202,Chicago,Global Bank,Einstein Analytics,2026-04-01
```

**Intentional duplicates planted for Lab 5 (Identity Resolution):**
- **Sarah Johnson** rows 1 & 5 — same phone (415-555-0101) and account_name, different emails (work vs Gmail). Simulates work+personal email for same person.
- **Marcus Williams** rows 2 & 8 — same phone (312-555-0202) and account_name, different emails. Same pattern.
- Priya, Jordan, David, Aisha are unique — no duplicates.

**After IR runs in Lab 5: 8 source rows → 6 Unified Individuals**

---

### What We Saw on the New Data Stream Screen

The file parsed successfully showing:
- All 8 rows visible in Sample Data preview
- `contacts.csv (11)` — 8 rows + header + 3 lineage/system fields
- **Supported Fields (8)** — all columns came through cleanly
- **Unsupported Fields (0)** — no issues
- **Lineage Fields (3)** — auto-generated system fields Data Cloud adds (`__dc_id`, `__source_sequence`, etc.)
- **Category: Profile** already selected by default ✓
- Warning visible: *"You can't change the Category after saving the data stream"* — confirms permanent

**Configuration set:**
- Category: **Profile** (correct — person identity data)
- Primary Key: **email** (each email is unique per row; Sarah/Marcus different emails = separate rows = IR will unify later)
- Record Modified Field: **last_purchase_date**

---

### Auto-Generated System Fields (Lineage Fields)

Data Cloud automatically adds these to every DLO row — you never fill them in:

| System Field | Purpose |
|---|---|
| `__dc_id` | DC's internal unique row ID — guaranteed unique across all DLOs |
| `__source_sequence` | Ordering field for when multiple updates arrive for the same primary key |
| `__source_object` | Name of the Data Stream that produced this row |
| `__created_date` | When this row was written to the DLO (not the source record's date) |
| `__updated_date` | When this row was last updated in the DLO |

**`__dc_id` vs Primary Key distinction:**
- **Primary Key (email)** = used at ingest time to detect if an incoming row is new or an update
- **`__dc_id`** = Data Cloud's internal row identifier, used for DLO→DMO linkage in mapping

---

### Steps Completed So Far

- [x] Created `contacts.csv` with 8 rows including intentional duplicates
- [x] Started New Data Stream → File Upload
- [x] File parsed successfully — 8 rows, 8 columns visible
- [x] Category set to Profile
- [x] Primary Key set to email
- [x] Record Modified Field set to last_purchase_date
- [ ] Check field types (last_purchase_date = Date, email = Email type)
- [ ] Deploy the Data Stream
- [ ] Verify DLO created with 8 rows
- [ ] View data in DLO and confirm system fields

---

> **Session continues below as labs progress...**
