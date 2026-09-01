# Lecture 02: Data Streams & Ingestion Methods

## Learning Objectives
- Identify the main connector types available in Data Cloud and when to use each one
- Explain the difference between batch ingestion and streaming ingestion in Data Cloud
- Describe how to configure refresh schedules for batch Data Streams
- Explain Ingestion API authentication and when it is the appropriate connector choice

---

## Slides

### Slide 1: What Is a Data Stream?
**Visual:** A configuration panel mockup showing a Data Stream setup screen with fields for Source Connection, Object, Refresh Schedule, and Field Selection.

**Content:**
- A **Data Stream** is the configuration object that defines data ingestion into Data Cloud
- Each Data Stream connects one source object/table to one Data Lake Object
- Data Streams are the entry point for ALL data into Data Cloud — no data bypasses this layer
- Key configuration elements: source connection, source object, refresh type (batch/streaming), field selection, refresh schedule
- One Data Stream = one source object → one DLO (though multiple streams can feed one DLO)

**Speaker Notes:** Every piece of data in Data Cloud arrived through a Data Stream. Even if you use the Ingestion API to push real-time events, Data Cloud represents that connection as a Data Stream configuration object. When exam questions describe a scenario where "data isn't appearing in Data Cloud," the first troubleshooting step is always to check whether the Data Stream ran successfully, which means checking the ingestion job status. Understanding the elements that make up a Data Stream configuration is fundamental to both implementation questions and troubleshooting questions on the exam.

---

### Slide 2: Connector Types — Salesforce Connector
**Visual:** A bi-directional arrow diagram between "Salesforce CRM (Source Org)" and "Data Cloud" with the label "Salesforce Connector" on the arrow. A secondary arrow shows "Data Actions" flowing back from Data Cloud to CRM.

**Content:**
- The **Salesforce Connector** ingests standard and custom CRM objects into Data Cloud
- Available objects: Accounts, Contacts, Leads, Opportunities, Cases, custom objects, and more
- Configured directly in Data Cloud Setup — no MuleSoft or middleware required
- Supports **incremental refresh** (only changed records) and **full refresh**
- Bidirectional: also supports **Data Actions** to write Data Cloud insights back to CRM
- Can connect to **multiple Salesforce orgs** (multi-org scenarios)

**Speaker Notes:** The Salesforce Connector is the most common connector in Data Cloud implementations and therefore features heavily on the exam. The key points to know are: it's natively built (no middleware needed), it supports incremental refresh for performance efficiency, and it's the primary source for the Individual and Contact Point DMOs in most projects. One nuanced exam topic is multi-org scenarios — a large enterprise might have separate Sales Cloud orgs for different regions, and the Salesforce Connector supports bringing all of them into a single Data Cloud instance. Data Actions flowing back to CRM are tested in the governance and use cases sections, so keep that bidirectional capability in mind.

---

### Slide 3: Connector Types — Cloud Storage (S3, GCS, Azure)
**Visual:** Icons for Amazon S3, Google Cloud Storage, and Azure Blob Storage with arrows pointing into a Data Cloud box. A document icon labeled "CSV/JSON/Parquet" is shown on each arrow.

**Content:**
- Cloud storage connectors bring files from **Amazon S3, Google Cloud Storage, or Azure Blob Storage**
- Supported file formats: **CSV, JSON, and Parquet**
- Typically used for: data warehouse exports, third-party data vendors, historical data loads
- Configuration requires: bucket name, path pattern, file format, authentication credentials
- Scheduled batch ingestion — files are picked up on the configured schedule
- Best for large-volume, structured data that arrives on a regular cadence

**Speaker Notes:** Cloud storage connectors are the workhorses for enterprise data integrations where the source system can't expose a real-time API but CAN export files regularly to a cloud bucket. A common exam scenario: a retail company has nightly exports of transaction data from their ERP system dropped into an S3 bucket. You'd configure an S3 connector Data Stream to pick up those files each morning. Key things to know for the exam: what file formats are supported (CSV, JSON, Parquet — NOT Excel), and that these are always batch, never streaming. The authentication for S3 typically uses IAM credentials or a pre-configured named credential in Salesforce.

---

### Slide 4: Connector Types — Ingestion API
**Visual:** A code snippet showing a POST request to a Data Cloud Ingestion API endpoint with a JSON payload. An arrow shows it flowing into a Data Cloud "Streaming DLO."

**Content:**
- The **Ingestion API** enables real-time, event-driven data ingestion into Data Cloud
- Ideal for: website clickstream data, mobile app events, IoT sensor data, real-time transactions
- Data is pushed TO Data Cloud (not pulled) — the source system initiates the POST
- Authentication: **OAuth 2.0 (Connected App)** — requires a Connected App in the Data Cloud org
- Two modes: **Streaming** (near-real-time, individual records) and **Bulk** (high-volume batch via API)
- Schema must be defined as a DLO schema before data can be sent

**Speaker Notes:** The Ingestion API is a high-value exam topic because it's the only way to get true real-time streaming data into Data Cloud. The authentication mechanism is a common exam question — it uses OAuth 2.0 via a Connected App, the same pattern used across the Salesforce platform. The pre-defined schema requirement is important: you can't just start sending arbitrary JSON. You must first create the DLO schema in Data Cloud that matches your payload structure. The exam also distinguishes between the Streaming mode (individual events, near-real-time) and the Bulk mode (high-volume historical loads via the same API infrastructure). Don't confuse Ingestion API Bulk mode with the Salesforce Bulk API — they're different things.

---

### Slide 5: Connector Types — MuleSoft & Marketing Cloud
**Visual:** Two side-by-side panels. Left panel shows MuleSoft logo with "Any Source" pointing through MuleSoft into Data Cloud. Right panel shows Marketing Cloud logo with an arrow pointing into Data Cloud labeled "MC Connector."

**Content:**
- **MuleSoft Connector:** Enables any MuleSoft-connected system to push data into Data Cloud
  - Use when source system has no native connector and MuleSoft is already in the environment
  - Supports complex data transformations before ingestion
- **Marketing Cloud Connector:**
  - Ingests MC data (subscribers, engagement events) into Data Cloud
  - Also enables activation FROM Data Cloud back to MC journeys and sends
  - Requires a connected Business Unit configuration
  - Used for cross-channel unified profiles (email + CRM + web behavior)

**Speaker Notes:** The MuleSoft and Marketing Cloud connectors fill different gaps. MuleSoft is the "anything goes" option — if you have a legacy ERP, a custom database, or a third-party SaaS that has no native Data Cloud connector, MuleSoft can bridge the gap. Marketing Cloud is a specialized connector that's particularly important because so many Data Cloud implementations are driven by marketing use cases. The MC Connector is bidirectional in a sense: it pulls MC engagement data in and also serves as the activation pathway to push segments out to MC. The exam will frequently test you on when to use the MC Connector versus the Ingestion API for marketing events — use MC Connector for structured MC engagement data, use Ingestion API for real-time web/app events.

---

### Slide 6: Batch vs. Streaming Ingestion
**Visual:** Two parallel timelines. Top timeline labeled "Batch" shows data arriving in large blocks at scheduled intervals (6h, 12h, 24h). Bottom timeline labeled "Streaming" shows a continuous flow of small data points arriving in near-real-time.

**Content:**
- **Batch Ingestion:** Data is pulled on a schedule; options are 1, 6, 12, or 24 hours (or manual)
  - Higher volume, lower frequency
  - Sources: S3/GCS, Salesforce Connector, Marketing Cloud
  - Records in Data Cloud may be up to 24 hours old
- **Streaming Ingestion:** Data is pushed as events occur; typically seconds to minutes of latency
  - Lower volume per event, continuous frequency
  - Sources: Ingestion API (streaming mode), some connectors
  - Enables real-time personalization and segmentation

**Speaker Notes:** Batch versus streaming is a foundational concept tested directly on the exam. The key distinction is directionality and latency: batch is Salesforce PULLING data on a schedule; streaming is the source system PUSHING data in near-real-time. When a client requirement says "we need customer segments to reflect purchases made within the last 5 minutes," that's a streaming requirement. When a client says "we load nightly transaction data from our data warehouse," that's batch. The refresh schedule options for batch (1h, 6h, 12h, 24h) are specific numbers the exam may test. Also note: you cannot set arbitrary refresh intervals — you choose from the preset options.

---

### Slide 7: Ingestion API — Authentication Deep Dive
**Visual:** A step-by-step flow diagram: (1) Create Connected App in Salesforce org → (2) Get Consumer Key + Secret → (3) Exchange for OAuth 2.0 token → (4) POST to Ingestion API endpoint with Bearer token in header.

**Content:**
- Ingestion API uses **OAuth 2.0 Client Credentials** flow (server-to-server)
- **Step 1:** Create a Connected App in the Data Cloud org with the Ingestion API scope
- **Step 2:** Retrieve the Consumer Key and Consumer Secret
- **Step 3:** Exchange credentials for a Bearer token at the Salesforce token endpoint
- **Step 4:** Include the Bearer token in all Ingestion API calls (`Authorization: Bearer {token}`)
- Tokens expire — the calling application must handle token refresh

**Speaker Notes:** The Ingestion API authentication flow is a specific exam topic, especially in scenario questions asking "how would you configure a web application to send real-time events to Data Cloud?" The answer always starts with "create a Connected App." The key detail is that this uses the **Client Credentials** OAuth flow — meaning it's machine-to-machine with no user interaction, using a Client ID and Client Secret. This is different from the standard Salesforce OAuth web flow that redirects users to a login page. Exam traps often suggest using username/password auth or named credentials directly — neither is the correct approach for the Ingestion API. Always: Connected App → OAuth 2.0 → Bearer token.

---

### Slide 8: Choosing the Right Connector
**Visual:** A decision flowchart. Start → "Is the source a Salesforce CRM org?" → Yes: Salesforce Connector. No → "Does it deliver files to cloud storage?" → Yes: S3/GCS/Azure. No → "Is MuleSoft in the environment?" → Yes: MuleSoft. No → "Does it need real-time streaming?" → Yes: Ingestion API. No → "Is it Marketing Cloud?" → Yes: MC Connector.

**Content:**
- **Salesforce CRM data** → Salesforce Connector (native, no middleware)
- **Files in S3/GCS/Azure** → Cloud Storage Connector (CSV, JSON, Parquet)
- **Real-time web/app events** → Ingestion API (OAuth 2.0 Connected App)
- **Marketing Cloud data/activation** → Marketing Cloud Connector
- **Legacy/non-standard systems with MuleSoft** → MuleSoft Connector
- Combinations are common — most implementations use 3+ connector types

**Speaker Notes:** Real exam questions will almost always describe a scenario and ask which connector to use. Run through the decision flowchart mentally: Is it CRM data? Salesforce Connector. Is it files? Cloud storage. Real-time events? Ingestion API. Marketing Cloud? MC Connector. The tricky scenarios are when a question mentions that a legacy ERP system exists — if MuleSoft is mentioned in the scenario, that's your answer. If no integration platform is mentioned, the Ingestion API (with a custom integration layer) is usually the answer. Remember that most real implementations use multiple connectors simultaneously — that's expected and normal.

---

## Recording Script

Welcome back. In this lecture, we're going deep on Data Streams and the various ways data gets into Data Cloud.

Think of Data Streams as the front door to Data Cloud. No matter where your data comes from — your CRM, a cloud data warehouse, real-time mobile events — it all enters Data Cloud through a Data Stream. The Data Stream is the configuration that says: go to this source, pull this data, on this schedule, and put it here.

Let's walk through the major connector types. The **Salesforce Connector** is the most common. It natively connects to any Salesforce org and can pull standard and custom objects. No middleware required. This is what you use to get your Accounts, Contacts, and Opportunities into Data Cloud. It supports incremental refresh, so after the first full load, only changed records are synced — keeping things efficient.

For data that lives in cloud storage — like nightly exports dropped into an Amazon S3 bucket — you use the **Cloud Storage connectors**. These support CSV, JSON, and Parquet files. They run on a batch schedule, so they're perfect for regular data dumps from external systems.

The **Ingestion API** is your real-time option. When a website visitor clicks on a product, you want that event in Data Cloud immediately to trigger personalized recommendations. The Ingestion API lets the source system push data directly to Data Cloud in near-real-time. Authentication uses OAuth 2.0 via a Connected App — your source system exchanges credentials for a Bearer token and includes that token in every API call.

The **Marketing Cloud Connector** is specialized for the MC-to-Data Cloud integration. It brings subscriber and engagement data in, and it also serves as the pathway to activate Data Cloud segments back into MC journeys.

Finally, **MuleSoft** fills the gap when you have a legacy or non-standard source system that doesn't have a native Data Cloud connector but is already connected to MuleSoft.

The key exam distinction is batch versus streaming. Batch connectors pull data on a schedule — every 1, 6, 12, or 24 hours. Streaming connectors receive data pushed in near-real-time. When a client needs "same-minute" data freshness, streaming and the Ingestion API is the answer. When nightly updates are fine, batch and cloud storage connectors do the job.

In the next lecture, we'll look at what happens after data lands — the DLO-to-DMO field mapping process. See you there.

---

## Exam Tips

- The **Ingestion API** uses **OAuth 2.0 via a Connected App** — not username/password, not named credentials
- **Batch refresh schedules** are preset options: 1, 6, 12, or 24 hours — you cannot set arbitrary intervals
- **Salesforce Connector** supports incremental refresh; always prefer incremental over full refresh for large datasets
- The **Marketing Cloud Connector** is both an ingestion source AND an activation destination — it works in both directions
- When a scenario mentions "real-time events from a website or mobile app," the answer is almost always the **Ingestion API**

---

## Lecture Summary

Data Streams are the entry point for all data into Data Cloud, and each Data Stream uses a specific connector type suited to the source system. The five main connector types — Salesforce Connector, Cloud Storage (S3/GCS/Azure), Ingestion API, Marketing Cloud Connector, and MuleSoft — each serve different integration patterns. Batch ingestion runs on a preset schedule (1, 6, 12, or 24 hours) while streaming ingestion via the Ingestion API provides near-real-time data delivery. The Ingestion API requires OAuth 2.0 authentication through a Connected App. Choosing the right connector depends on the data source type, latency requirements, and whether the organization already uses middleware like MuleSoft.

---

## Mini Quiz

**Question 1:** A retail company wants to stream real-time web clickstream events into Data Cloud to power same-session personalization. Which connector type should they use?

A) Salesforce Connector with 1-hour refresh  
B) Amazon S3 Cloud Storage Connector  
C) Ingestion API in streaming mode  
D) Marketing Cloud Connector  

**Answer: C**
Real-time, event-driven data pushed by a web application is the exact use case for the Ingestion API in streaming mode. The Salesforce Connector and S3 connector are batch only. The Marketing Cloud Connector is for MC-specific data, not web events.

---

**Question 2:** A developer is building a server-to-server integration to push IoT sensor data into Data Cloud using the Ingestion API. What authentication mechanism is required?

A) Salesforce username and password  
B) OAuth 2.0 Client Credentials flow using a Connected App  
C) API key passed as a query parameter  
D) Named Credential stored in Setup  

**Answer: B**
The Ingestion API requires OAuth 2.0 using a Connected App. The client application exchanges the Consumer Key and Consumer Secret for a Bearer token, which is then included in all API requests. Username/password, API keys, and Named Credentials are not supported authentication mechanisms for the Ingestion API.

---

**Question 3:** A consultant needs to configure a Data Stream to ingest nightly transaction exports from a data warehouse. The exports are delivered as CSV files to an Amazon S3 bucket. The data must be in Data Cloud by 6 AM each day. Which configuration is most appropriate?

A) Ingestion API with Bulk mode, triggered by a nightly cron job  
B) Salesforce Connector with a 1-hour refresh schedule  
C) Amazon S3 Cloud Storage Connector with a 24-hour refresh schedule  
D) MuleSoft Connector with a scheduled flow  

**Answer: C**
CSV files in an S3 bucket are the exact use case for the Amazon S3 Cloud Storage Connector. A 24-hour refresh schedule will pick up the nightly export. The Ingestion API Bulk mode could work technically but would require additional development; the S3 connector is the correct native solution when files are already landing in S3.
