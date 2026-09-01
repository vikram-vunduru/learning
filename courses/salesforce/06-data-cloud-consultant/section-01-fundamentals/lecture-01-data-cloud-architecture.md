# Lecture 01: Data Cloud Architecture & Platform Overview

## Learning Objectives
- Describe the core purpose of Salesforce Data Cloud and how it fits within the Salesforce ecosystem
- Explain the Unified Customer Profile and why it is the central output of Data Cloud
- Distinguish between Data Cloud data (Data Lake Objects, Data Model Objects) and standard CRM data
- Define key Data Cloud terminology: Data Stream, Data Lake Object (DLO), Data Model Object (DMO), and Unified Individual

---

## Slides

### Slide 1: What Is Salesforce Data Cloud?
**Visual:**
```
  ┌─────────────────────┐         ┌──────────────────────────┐
  │  Salesforce CRM     │────────▶│                          │
  │  Marketing Cloud    │────────▶│       DATA CLOUD         │
  │  External Databases │────────▶│   (Real-Time Data        │
  │  Mobile Apps        │────────▶│    Platform)             │
  │  Web Analytics      │────────▶│                          │
  └─────────────────────┘         └──────────────────────────┘
       Source Systems                  Central Data Hub
```

**Content:**
- Data Cloud is Salesforce's **real-time data platform** built natively on the Salesforce platform
- Formerly called **Customer Data Platform (CDP)** — you may see both terms on the exam
- Ingests data from any source, resolves identities, and creates a **Unified Customer Profile**
- Powers real-time segmentation, activation, analytics, and AI/Agentforce grounding
- Licensed separately from core Salesforce CRM; requires its own provisioning

**Speaker Notes:** Data Cloud's fundamental job is to break down data silos. A typical enterprise has customer data spread across CRM, e-commerce platforms, loyalty systems, call center tools, and web analytics. Without a unified platform, these systems each have their own fragmented view of the customer. Data Cloud acts as the connective tissue — pulling all that data in, resolving identities across sources so the same person is recognized everywhere, and making that unified data available to every Salesforce product. On the exam, questions often test whether you understand that Data Cloud is separate from the CRM and requires specific licensing and provisioning.

---

### Slide 2: Data Cloud in the Salesforce Ecosystem
**Visual:**
```
                       Sales Cloud
                           ▲
                           │
  Commerce Cloud ◀─────────┼─────────▶ Service Cloud
                           │
                ┌──────────┴──────────┐
                │      DATA CLOUD     │
                │  Customer 360 Hub   │
                │  (bidirectional)    │
                └──────────┬──────────┘
                           │
  Marketing Cloud ◀────────┼────────▶ External Apps
                           │          (MuleSoft /
                           ▼           Ingestion API)
                    Data Actions out,
                    Data Streams in
```

**Content:**
- Data Cloud sits at the **center of Customer 360** — it feeds data to other clouds
- **Salesforce Connector:** Natively pulls Sales/Service Cloud data into Data Cloud
- Data Cloud pushes unified profiles back to CRM via **Data Actions** and **Activation Targets**
- Marketing Cloud Connection: Enables sending Data Cloud segments to Marketing Cloud journeys
- External systems connect via MuleSoft, Ingestion API, or cloud storage connectors (S3, GCS)

**Speaker Notes:** One of the most common exam question patterns is testing whether you understand the directional flow of data. Data flows INTO Data Cloud from source systems. The unified, enriched data then flows OUT to activation destinations. The Salesforce Connector is unique because it can flow in both directions — you ingest Sales Cloud data into Data Cloud AND you can write Data Cloud insights back to Sales Cloud objects. Marketing Cloud is a frequent co-topic on the exam because many Data Cloud implementations are driven by marketing use cases — specifically, creating precise segments in Data Cloud and activating them through Marketing Cloud journeys.

---

### Slide 3: The Unified Customer Profile
**Visual:**
```
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  CRM Record  │   │ E-Commerce   │   │ Loyalty App  │
  │  John Smith  │   │  J. Smith    │   │  John S      │
  │ john@co.com  │   │ john@co.com  │   │ Member: LY99 │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         └──────────────────┼──────────────────┘
                            │  Identity Resolution
                            ▼
               ┌────────────────────────┐
               │   UNIFIED INDIVIDUAL   │
               │  ────────────────────  │
               │  Name: John Smith      │
               │  Email: john@co.com    │
               │  Purchase History: ✓   │
               │  Loyalty Tier: Gold    │
               │  Source Records: 3     │
               └────────────────────────┘
```

**Content:**
- The **Unified Customer Profile** (or Unified Individual) is Data Cloud's primary output
- Created by **Identity Resolution** — the process of matching records across sources
- Contains all attributes from all source systems, reconciled into one record
- Includes all associated **Contact Points** (email addresses, phone numbers, device IDs)
- Serves as the basis for segmentation, analytics, and AI grounding

**Speaker Notes:** Think of the Unified Customer Profile as the answer to "who is this customer, really?" Before Data Cloud, your CRM might know someone as John Smith with an email, your e-commerce system knows them as john.s@gmail.com with a purchase history, and your loyalty app knows them by a membership ID. Identity Resolution figures out that all three records are the same person and collapses them into one Unified Individual. That unified profile then becomes the single source of truth for every downstream use case — from personalized marketing to AI-driven recommendations. The exam tests your understanding of how this profile is created, what it contains, and how it's used.

---

### Slide 4: Key Terminology — Data Streams
**Visual:**
```
  ┌───────────────────┐                 ┌─────────────────────┐
  │   SOURCE SYSTEM   │                 │  DATA LAKE OBJECT   │
  │  (Salesforce CRM) │                 │       (DLO)         │
  │                   │───Data Stream──▶│                     │
  │  FirstName        │                 │  FirstName          │
  │  LastName         │                 │  LastName           │
  │  Email__c         │   (pipeline     │  Email__c           │
  │  AccountId        │    config)      │  AccountId          │
  └───────────────────┘                 │  (raw, unmodeled)   │
                                        └─────────────────────┘
```

**Content:**
- **Data Stream:** The configuration object that defines how data flows from a source into Data Cloud
- Specifies the source connection, the object/table to pull, the refresh schedule, and field mappings
- Each Data Stream lands data in a corresponding **Data Lake Object (DLO)**
- DLOs are the raw, unmodeled storage layer — data arrives exactly as it came from the source
- Multiple Data Streams can feed the same DLO (data consolidation)

**Speaker Notes:** A Data Stream is essentially a pipeline configuration. You define where the data comes from, how often to pull it, and which fields to bring in. Once data lands in a DLO, it's in its raw form — the structure mirrors what the source system sent. This is an important distinction: DLOs are NOT shaped to a standard model yet. They're staging areas. The exam loves to test whether candidates know the difference between a Data Stream (the pipeline configuration) and a Data Lake Object (the raw storage destination). One common wrong-answer trap is confusing a Data Stream with an Ingestion API endpoint — the Ingestion API is a specific connector type that creates a Data Stream, but the two terms are not interchangeable.

---

### Slide 5: Key Terminology — Data Model Objects
**Visual:**
```
  ┌─────────────────────┐
  │ DLO: CRM_Contact    │──┐
  │  cust_fname         │  │
  │  cust_lname         │  │  Field
  └─────────────────────┘  │  Mapping
  ┌─────────────────────┐  ├────────▶ ┌──────────────────────┐
  │ DLO: EC_Customer    │──┤          │   DMO: Individual    │
  │  fname              │  │          │  (standard schema)   │
  │  lname              │  │          │  ─────────────────   │
  └─────────────────────┘  │          │  FirstName           │
  ┌─────────────────────┐  │          │  LastName            │
  │ DLO: Loyalty_Member │──┘          │  EmailAddress        │
  │  first_name         │             └──────────────────────┘
  └─────────────────────┘
```

**Content:**
- **Data Model Object (DMO):** A structured, modeled object that maps raw DLO data to a standard schema
- **Standard DMOs:** Pre-built by Salesforce (Individual, Contact Point Email, Contact Point Phone, Unified Individual, etc.)
- **Custom DMOs:** Created by admins/consultants to represent business-specific entities
- **Field Mapping:** The process of mapping raw DLO fields to corresponding DMO fields
- DMOs are used for segmentation, identity resolution, and activation — DLOs are not

**Speaker Notes:** If DLOs are the raw warehouse, DMOs are the clean, organized shelves. The transformation step between DLO and DMO is where you do your field mapping — telling Data Cloud that the "FirstName" field in your e-commerce DLO corresponds to the "FirstName" field on the Individual DMO. Standard DMOs follow Salesforce's data model and are designed to work with Identity Resolution out of the box. The exam will test you on which DMOs are standard versus custom, which DMOs are required for identity resolution, and what happens if field mapping is incomplete or incorrect. Custom DMOs are useful when your data doesn't fit any standard category — for example, a loyalty program's tier structure or a vehicle ownership record for automotive clients.

---

### Slide 6: Data Cloud vs. CRM Data
**Visual:**
```
  ┌──────────────────────────┐  Salesforce  ┌──────────────────────────┐
  │     SALESFORCE CRM       │  Connector   │      DATA CLOUD          │
  │  ──────────────────────  │ ───────────▶ │  ──────────────────────  │
  │  Transactional /         │              │  Analytical / Unified    │
  │  Operational             │              │                          │
  │  ──────────────────────  │              │  ──────────────────────  │
  │  • Account               │              │  • Data Lake Objects     │
  │  • Contact               │              │    (raw ingested data)   │
  │  • Lead                  │              │  • Data Model Objects    │
  │  • Opportunity           │              │    (standardized schema) │
  │  • Case                  │              │  • Unified Individual    │
  │                          │ ◀─Data Acts─ │                          │
  └──────────────────────────┘              └──────────────────────────┘
```

**Content:**
- CRM data (Accounts, Contacts, Leads) is **transactional and operational**
- Data Cloud data (DLOs, DMOs, Unified Individual) is **analytical and unified**
- CRM records are updated by users/automation; Data Cloud records are updated by ingestion jobs
- **Data Cloud does NOT replace the CRM** — it complements it
- Data Cloud segments and insights can be surfaced back in CRM via related lists and Data Actions

**Speaker Notes:** A common misconception — and a common exam trap — is thinking that Data Cloud replaces the CRM or that you should migrate CRM data out of Salesforce into Data Cloud. That is not the design. CRM is your system of record for operational processes like sales pipelines and service cases. Data Cloud is your system of insight for understanding customers holistically. They work together. The Salesforce Connector lets you bring CRM data into Data Cloud to enrich the Unified Profile, and Data Actions let you write insights back to CRM records. Neither system is a replacement for the other. Exam questions will often present scenarios and ask which system should store which type of data.

---

### Slide 7: Data Cloud Terminology Quick Reference
**Visual:**
```
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │ DATA STREAM                      │  │ DATA LAKE OBJECT (DLO)           │
  │ Pipeline config that brings      │  │ Raw storage layer; data lands    │
  │ source data into Data Cloud      │  │ here first, exact source form    │
  └──────────────────────────────────┘  └──────────────────────────────────┘
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │ DATA MODEL OBJECT (DMO)          │  │ UNIFIED INDIVIDUAL               │
  │ Structured, modeled layer used   │  │ The resolved, single customer    │
  │ for segmentation & activation    │  │ profile across all sources       │
  └──────────────────────────────────┘  └──────────────────────────────────┘
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │ IDENTITY RESOLUTION              │  │ ACTIVATION TARGET                │
  │ Process of matching & merging    │  │ Destination where segments are   │
  │ records into Unified Individual  │  │ published (MC, CRM, Ad Platf.)   │
  └──────────────────────────────────┘  └──────────────────────────────────┘
```

**Content:**
- **Data Stream** — Pipeline config that brings source data into Data Cloud
- **Data Lake Object (DLO)** — Raw storage layer; data lands here first
- **Data Model Object (DMO)** — Structured, modeled layer used for segmentation/activation
- **Unified Individual** — The resolved, single customer profile across all sources
- **Identity Resolution** — The process of matching and merging records into a Unified Individual
- **Activation Target** — The destination where segments are published (MC, CRM, ad platforms)

**Speaker Notes:** These six terms are the foundation of every Data Cloud conversation and will appear on the exam repeatedly. If you only memorize one thing from this lecture, memorize the DLO-to-DMO pipeline flow: data comes in via a Data Stream, lands in a DLO in raw form, gets mapped to a DMO through field mapping, and then Identity Resolution processes those DMO records to create the Unified Individual. Everything downstream — segmentation, activation, analytics — works off the Unified Individual and DMOs. Activation Targets we'll cover in detail in Lecture 07, but know that they're the "exit ramp" for your unified data to reach the systems that actually engage customers.

---

### Slide 8: Architecture Summary Flow
**Visual:**
```
  External Sources                    Data Cloud
  ────────────────              ┌──────────────────────────────────┐
  Salesforce CRM  ──Data Stream▶│  Data Lake Objects (DLO)        │
  Marketing Cloud ──Data Stream▶│  (raw ingested data)            │
  Web Analytics   ──Data Stream▶│            │                    │
  Custom API      ──Data Stream▶│            ▼ Field Mapping      │
                                │  Data Model Objects (DMO)       │
                                │  (standardized schema)          │
                                │            │                    │
                                │            ▼                    │
                                │  Identity Resolution            │
                                │  (Unified Individual Profile)   │
                                │            │                    │
                                │    ┌───────┴────────┐          │
                                │    ▼                ▼           │
                                │ Segments      Calculated       │
                                │               Insights          │
                                │    │                │           │
                                └────┼────────────────┼───────────┘
                                     ▼                ▼
                              Activation         Analytics
                              Targets            (Tableau)
```

**Content:**
- **Left to right:** Sources → Data Streams → DLOs → DMOs → Identity Resolution → Unified Individual → Segments/Activation
- Each stage transforms data from raw to refined to actionable
- **Key exam point:** Segmentation is always done on DMOs and Unified Individual — never on DLOs
- DLOs are only accessible during field mapping configuration — not in segment builder
- The full pipeline can take minutes (streaming) to hours (large batch loads)

**Speaker Notes:** This architecture diagram is the mental model you need for the entire exam. Every question about Data Cloud fits somewhere on this left-to-right flow. When a question says "a customer's CRM records aren't appearing in segments," you mentally walk through the pipeline: Did the Data Stream run? Did data land in the DLO? Was field mapping configured? Did Identity Resolution run? Each step is a potential failure point. The exam often presents troubleshooting scenarios that require you to identify which stage has the problem. Internalize this architecture, and every scenario question becomes a process of elimination along this flow.

---

## Recording Script

Welcome to Lecture 01 of the Salesforce Data Cloud Consultant course. In this lecture, we're building the mental model that will anchor everything else you learn — the Data Cloud architecture.

Let's start with the big question: what problem does Data Cloud solve? Most enterprises have customer data scattered across dozens of systems. Your CRM has sales history and account info. Your marketing platform has email engagement data. Your e-commerce system has purchase records. Your mobile app has behavioral data. Each system has its own ID for the same customer, and none of them talk to each other. As a result, every team has a different, incomplete picture of the customer.

Data Cloud's job is to fix this. It ingests data from all of those systems, recognizes that all those different records belong to the same person, and creates a single Unified Customer Profile that reflects everything you know about that customer across every touchpoint.

The flow goes like this: data enters Data Cloud through a **Data Stream** — think of it as a pipeline configuration that defines where to pull data from and how often. That data lands in a **Data Lake Object**, or DLO, which is raw storage. DLOs look a lot like the source system they came from — no transformation has happened yet.

The next step is **field mapping**, where you take the raw fields from your DLO and map them to a **Data Model Object**, or DMO. DMOs follow Salesforce's standard data model. The most important standard DMO for the exam is the **Individual** — this is the person record. Once your DLOs are mapped to DMOs, **Identity Resolution** can run, comparing records across all sources and merging them into a **Unified Individual** profile.

That Unified Individual is the goldmine. It's what powers your segments, your analytics, your AI use cases. Everything in Data Cloud builds toward creating and using that unified profile.

Here's a critical distinction the exam tests repeatedly: segmentation, activation, and analytics all happen on **DMOs and the Unified Individual** — not on DLOs. DLOs are just the raw staging layer. You configure field mapping using DLOs, but you build segments using DMOs. If you remember nothing else from this lecture, remember that distinction.

In the next lecture, we'll go deep on Data Streams — the many different connector types and how batch versus streaming ingestion differ. See you there.

---

## Exam Tips

- Data Cloud was previously called **Customer Data Platform (CDP)** — both terms may appear on the exam
- Segmentation and activation are done on **DMOs and Unified Individual**, never on raw DLOs
- A **Data Stream** is the pipeline configuration; a **DLO** is the raw storage destination — these are two different objects
- The **Unified Individual** is the output of Identity Resolution, not a DMO you create manually
- Data Cloud does **not** replace the Salesforce CRM — it complements it via the Salesforce Connector and Data Actions

---

## Lecture Summary

Data Cloud is Salesforce's real-time data platform that ingests data from multiple sources, models it against a standard schema, and resolves customer identities into a Unified Customer Profile. The core architecture flows from source systems through Data Streams into raw Data Lake Objects, then through field mapping into structured Data Model Objects, and finally through Identity Resolution to create the Unified Individual. This Unified Individual powers all downstream use cases including segmentation, activation, analytics, and AI grounding. Understanding the distinction between DLOs (raw staging) and DMOs (modeled, actionable data) is foundational to every other topic in the exam.

---

## Mini Quiz

**Question 1:** A customer's data has been ingested from Salesforce CRM via the Salesforce Connector and has landed in Data Cloud. A consultant tries to use this data to build a segment but cannot find the fields. What is the most likely cause?

A) The Data Stream was not enabled  
B) The raw DLO fields have not been mapped to a DMO  
C) The Unified Individual has not been activated  
D) The Salesforce Connector requires a Marketing Cloud license  

**Answer: B**
Segmentation uses DMO fields, not raw DLO fields. If field mapping from the DLO to a DMO has not been configured, the data will not appear in the segment builder. The data has landed (the Data Stream ran successfully), but it hasn't been modeled yet.

---

**Question 2:** Which of the following best describes the relationship between a Data Stream and a Data Lake Object?

A) A DLO is the configuration that defines the pipeline; a Data Stream stores the raw data  
B) A Data Stream is the pipeline configuration that lands data into a DLO as raw storage  
C) They are two names for the same object  
D) A Data Stream transforms raw DLO data into a Data Model Object  

**Answer: B**
A Data Stream is the configuration object (where to pull from, how often, which fields). Data lands in the corresponding DLO in raw form. They are distinct objects with distinct roles. Transformation from DLO to DMO happens through field mapping, not the Data Stream itself.

---

**Question 3:** A Salesforce Data Cloud consultant is explaining the Unified Individual to a client. Which statement is accurate?

A) The Unified Individual is a custom DMO the consultant must create from scratch  
B) The Unified Individual is created automatically by the Salesforce Connector without any additional configuration  
C) The Unified Individual is the output of Identity Resolution and represents a single resolved customer profile across all sources  
D) The Unified Individual replaces the Contact record in Salesforce CRM  

**Answer: C**
The Unified Individual is a standard DMO produced by the Identity Resolution process, which matches and merges records from multiple source DMOs into a single resolved profile. It is not manually created, not produced solely by the Salesforce Connector, and does not replace the CRM Contact object.
