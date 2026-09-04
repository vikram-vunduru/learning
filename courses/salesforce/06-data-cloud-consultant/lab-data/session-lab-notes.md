# Data Cloud Hands-On Lab Session Notes
> Personal study log — interactive lab walkthroughs with screenshot observations, Q&A, and key insights
> Org: trailsignup-d363a27438b76b.lightning.force.com (Trailhead/Demo org with Data Cloud provisioned)

---

## LAB 1 — Data Cloud Environment Setup & Orientation
**Status: ✅ COMPLETE**

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

### 📸 Screenshot 1 — New Data Stream Source Selection

**What was shown:**
- Screen title: "New Data Stream"
- **Connected Sources** section at top — Salesforce CRM tile with a blue checkmark/border, subtitle: "Import objects from Salesforce CRM" — confirming the CRM connector is already authenticated and ready
- **Other Sources** section — two tiles: "File Upload" (upload file from local drive) and "Installed Data Kits & Packages" (import data streams from preconfigured data kits)
- **Explore Other Connectors** section at bottom with a search/filter bar, checkboxes for "Generally Available" and "Beta" — showing third-party connectors: Act! CRM (Beta), Act-On (Beta), ActiveCampaign (Beta), Acumatica (Beta) — with many more below
- Blue "Next" button bottom-right, "Previous" button bottom-left

**Key insight from this screen:** The Salesforce CRM connector being pre-authenticated (blue checkmark) means data from CRM objects is already available to stream into Data Cloud without any OAuth setup. The demo org is already wired up.

---

### 📸 Screenshot 2 — Data Model Objects List

**What was shown:**
- Screen heading: "Data Model Objects — Mapped" (dropdown showing filter = Mapped)
- **38 items** total
- Columns: Object Label, Object API Name, Category, Data Streams, Data Lake Objects, Data Space, Type, Status
- All 38 DMOs show Status: **Ready** and Type: **Standard** and Data Space: **default**
- API names all use `ssot__` prefix (Single Source of Truth namespace)
- Notable rows visible:
  - Row 1: **Account** — `ssot__Account__dlm` — Category: Profile — Data Streams: Account_Home
  - Row 2: **Account Contact** — `ssot__AccountContact__dlm` — Category: Profile — Data Streams: Contact_Home
  - Row 3: **Agent Service Presence** — `ssot__AgentServicePresence__...` — Category: Other — Data Streams: UserServicePresence_Home
  - Row 4: **Agent Work** — `ssot__AgentWork__dlm` — Category: **Engagement** — Data Streams: AgentWork_Home
  - Row 5: **Agent Work Skill** — `ssot__AgentWorkSkill__dlm` — Category: Other
  - Row 6: **Case** — `ssot__Case__dlm` — Category: **Engagement** — Data Streams: Case_Home
  - Row 7: **Case Update** — `ssot__CaseUpdate__dlm` — Category: Other — Data Streams: CaseHistory2_Home
  - Row 8: **Category** — `ssot__Category__dlm` — Category: Other
  - Row 9: **Contact Point Address** — `ssot__ContactPointAddress__d...` — Category: Other — Data Streams: Contact_Home, Account_Home, L...
  - Row 10: **Contact Point Email** — `ssot__ContactPointEmail__dlm` — Category: Other — Data Streams: Contact_Home, Lead_Home
  - Row 11: **Contact Point Phone** — `ssot__ContactPointPhone__dlm` — Category: Other — Data Streams: Contact_Home, Account_Home, L...
  - Row 12: **Email Message** — `ssot__EmailMessage__dlm` — Category: **Engagement** — Data Streams: EmailMessage_Home

**Key insights from this screen:**
- Categories in action: Account = Profile (who), Agent Work = Engagement (what happened), Agent Work Skill = Other (reference)
- Contact Point Email and Contact Point Phone both come from Contact_Home and Lead_Home — Salesforce automatically splits contact details into separate DMOs
- The CRM connector auto-created DLOs and mapped them to all 38 standard DMOs — nothing needed to be built manually

---

### Individual DMO — Field Details (seen in session)

Navigated to Individual DMO and observed:
- **Object Label:** Individual
- **Type:** Standard | **Data Space:** default | **Object Status:** Ready
- **Mapped data streams:** 2 (Contact_Home, Lead_Home)
- **Mapped data lake objects:** 2 (Contact_Home, Lead_Home)
- **Object API Name:** `ssot__Individual__dlm`
- **Category:** PROFILE
- **Fields count:** 105 total

Key fields observed with **Is Mapped: True** (actively receiving data):
- `ssot__FirstName__c` — Text
- `ssot__LastName__c` — Text
- `ssot__BirthDate__c` — DateTime
- `ssot__CreatedDate__c` — DateTime
- `ssot__DataSourceId__c` — Text
- `ssot__DataSourceObjectId__c` — Text
- `ssot__DeathDate__c` — DateTime
- `ssot__ExternalRecordId__c` — Text ← original CRM record ID
- `ssot__ExternalSourceId__c` — Text
- `ssot__Gender__c` — Text
- `ssot__GenderIdentity__c` — Text
- `ssot__Id__c` — Text ← Data Cloud's own Individual ID (primary key)
- `ssot__LastModifiedDate__c` — DateTime

Key Qualifier fields (for Identity Resolution):
- `KQ_Id__c` — "Individual Id" Key Qualifier
- `KQ_PartyId__c` — "Party" Key Qualifier
- `KQ_PrimaryAccountId__c` — "Primary Account" Key Qualifier

---

### Lab 1 Checkpoint — Q&A

**Q1: Why does the Individual DMO have 105 fields but only ~10 are mapped?**

The Individual DMO is Salesforce's universal person schema — designed for any industry. Fields for education level, military status, marital status, FERPA disclosures exist because some company somewhere needs each one. A demo org only has CRM Contacts/Leads, so only basic fields (name, email, dates) get populated. The other 95 sit empty, waiting for richer sources (data warehouse, healthcare system, financial data). Empty fields don't break anything.

**Q2: Why are both CRM Contact AND CRM Lead mapped to the SAME Individual DMO?**

Both represent a real-world person at different CRM lifecycle stages. In CRM they're separate objects with different IDs. In reality, Marcus Williams at Global Bank is one human being — whether stored as a Lead, a Contact, or both. By mapping both to Individual, you normalize them to the same schema so Identity Resolution can detect that they're the same person. This cross-object unification is impossible in CRM alone.

**Q3: What is `ssot__ExternalRecordId__c` storing?**

The original CRM record ID — the 18-character Salesforce `Id` (e.g., `003...` for a Contact, `00Q...` for a Lead). Data Cloud generates its own `ssot__Id__c` as its primary key when mapping to the Individual DMO. But `ExternalRecordId` stores the breadcrumb back to the source record. **Exam scenario:** "Which field do you use to update the correct CRM record when activating back?" → `ExternalRecordId`.

---

---

## LAB 2 — CSV Data Stream Ingestion
**Status: 🔄 IN PROGRESS**

---

### Core Concept: Data Streams & Data Categories

**A Data Stream** = a configured pipeline. One end connects to a source, the other writes into a DLO. Copies data faithfully — no transformation at this layer.

**The 4 Source Types:**

| Type | Use Case | Refresh |
|---|---|---|
| **Salesforce CRM Connector** | Pull CRM objects (Contact, Lead, Account, Case etc.) | Full or Incremental |
| **Cloud Storage** | S3/Azure/GCS — batch files, nightly drops from legacy systems | Incremental by file timestamp |
| **Ingestion API** | Real-time events — website clicks, mobile, IoT | Push (source POSTs to DC) |
| **File Upload** | One-time CSV upload — testing, POC, manual loads | Manual only — no schedule |

**Exam tip on File Upload vs Cloud Storage:** "Best for nightly batch from legacy system" = Cloud Storage (S3), NOT File Upload. File Upload has no automated refresh.

**The 3 Data Categories — EXAM CRITICAL:**

| Category | What it means | Example |
|---|---|---|
| **Profile** | Who a person IS — semi-static identity data | Contact, Lead, customer record |
| **Engagement** | What a person DID — events, behavioral, time-stamped | Email open, page view, purchase |
| **Other** | Reference data — not about individuals | Product catalog, store locations |

**Why category matters (2 critical reasons):**
1. **Identity Resolution only runs on Profile data.** Miscategorize as Engagement → IR ignores it → no Unified Individuals from that source
2. **Storage and processing differ** — Engagement is high-volume, different query planning
3. **Category is PERMANENT** — cannot be changed after saving. Warning shown on screen: *"You can't change the Category after saving the data stream."* Delete and re-create if wrong.

---

### The Lab Dataset — contacts.csv

File path: `courses/salesforce/06-data-cloud-consultant/lab-data/contacts.csv`

8 rows, 8 columns. Intentional duplicates for Lab 5 (Identity Resolution):
- **Sarah Johnson** rows 1 & 5 — same phone + account_name, different emails (work vs Gmail)
- **Marcus Williams** rows 2 & 8 — same phone + account_name, different emails (work vs Gmail)
- Priya, Jordan, David, Aisha — unique, no duplicates

**After IR runs in Lab 5: 8 source rows → 6 Unified Individuals** (Sarah unified, Marcus unified)

---

### Auto-Generated System Fields (Lineage Fields)

Data Cloud automatically adds these to every DLO row:

| System Field | Purpose |
|---|---|
| `__dc_id` | DC's internal unique row ID — guaranteed unique across ALL DLOs |
| `__source_sequence` | Ordering field for multiple updates to same primary key |
| `__source_object` | Name of the Data Stream that produced this row |
| `__created_date` | When row was written to DLO (not source record's date) |
| `__updated_date` | When row was last updated in DLO |

**Key distinction — Primary Key vs `__dc_id`:**
- **Primary Key (email)** = used at ingest time to detect new vs update record
- **`__dc_id`** = DC's internal row handle, used for DLO→DMO linkage in field mapping

---

### 📸 Screenshot 3 — New Data Stream Configuration (CSV Parsed)

**What was shown:**
- Screen title: "New Data Stream"
- Top fields:
  - Data Lake Object: "+ New Data Lake Object" (auto-creating a new DLO)
  - Data Lake Object Label: `contacts.csv`
  - Data Lake Object API Name: `contactscsv`
- **Left panel — Properties tab:**
  - Category: **Profile** selected (blue radio button) ✓
  - Warning text: *"You can't change the Category after saving the data stream. Consider billing and functional implications when making this decision."*
  - Primary Key: "Select an Option" dropdown (not yet set)
  - Record Modified Field: "Select an Option" dropdown
  - Organization Unit Identifier: "Select an Option"
- **Right panel — Sample Data tab selected:**
  - Header: `contacts.csv (11)` — 8 data rows + header + 3 system fields
  - 4 sub-tabs: Sample Data | Supported Fields (8) | Unsupported Fields (0) | Lineage Fields (3) | Formula Fields (0)
  - All 8 rows visible in preview grid:
    - Row 1: Sarah, Johnson, sarah.j@techcorp.c..., 415-555-0101, San Francisco, TechCorp Inc, Sales Cloud, 2025-11-15
    - Row 2: Marcus, Williams, marcus.w@globalba..., 312-555-0202, Chicago, Global Bank, Service Cloud, 2025-12-01
    - Row 3: Priya, Patel, priya.p@healthsys.c..., 212-555-0303, New York, Health Systems, Data Cloud, 2026-01-10
    - Row 4: Jordan, Lee, jordan.l@retailco.com, 512-555-0404, Austin, RetailCo, Agentforce, 2026-02-28
    - Row 5: Sarah, Johnson, s.johnson@gmail.com, 415-555-0101, San Francisco, TechCorp Inc, Marketing Cloud, 2026-03-15
    - Row 6: David, Chen, d.chen@manufact.c..., 206-555-0505, Seattle, Manufacturing Co, MuleSoft, 2025-10-20
    - Row 7: Aisha, Brown, a.brown@fintech.com, 617-555-0606, Boston, FinTech Ltd, Revenue Cloud, 2026-01-25
    - Row 8: Marcus, Williams, mwilliams@gmail.com, 312-555-0202, Chicago, Global Bank, Einstein Analytics, 2026-04-01
- Progress bar at bottom showing step 2 of 3
- "Previous" and "Next" buttons

**Key insight:** Category is already defaulted to Profile — this is the correct choice since this is person/identity data. The warning confirms category cannot be changed after save.

---

### Steps Checklist

- [x] Created `contacts.csv` with 8 rows including intentional duplicates
- [x] Started New Data Stream → File Upload
- [x] File parsed successfully — 8 rows, 8 columns visible
- [x] Category confirmed as Profile
- [ ] Set Primary Key = email
- [ ] Set Record Modified Field = last_purchase_date
- [ ] Check field types (last_purchase_date = Date, email = Email type)
- [ ] Click Next → Deploy
- [ ] Verify DLO created with 8 rows
- [ ] View data in DLO, confirm system fields visible

---

> **Session continues below as labs progress...**
