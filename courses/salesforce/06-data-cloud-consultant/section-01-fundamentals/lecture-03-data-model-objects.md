# Lecture 03: Data Lake Objects vs. Data Model Objects

## Learning Objectives
- Distinguish between Data Lake Objects (DLOs) and Data Model Objects (DMOs) and explain the role of each
- List the key standard DMOs and describe what data each one holds
- Configure field mappings between a DLO and a standard DMO
- Explain the rules and constraints that govern valid field mappings

---

## Slides

### Slide 1: The Two-Layer Data Model
**Visual:**
```
  ┌──────────────────────────────────────────────────────────┐
  │              DATA MODEL OBJECTS (DMO)                    │
  │         Standardized, clean, actionable layer            │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
  │  │  Individual  │  │ ContactPoint │  │  SalesOrder  │   │
  │  │  FirstName   │  │  Email       │  │  OrderDate   │   │
  │  │  LastName    │  │  HasOptedOut │  │  TotalAmount │   │
  │  └──────────────┘  └──────────────┘  └──────────────┘   │
  └───────────────────────▲──────────────────────────────────┘
                          │  Field Mapping
  ┌──────────────────────────────────────────────────────────┐
  │              DATA LAKE OBJECTS (DLO)                     │
  │              Raw, source-system structure                │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
  │  │ cust_fname   │  │ email_addr   │  │ order_dt     │   │
  │  │ cust_lname   │  │ opt_out_flg  │  │ order_total  │   │
  │  │ acct_num     │  │ sub_key      │  │ cust_id      │   │
  │  └──────────────┘  └──────────────┘  └──────────────┘   │
  └──────────────────────────────────────────────────────────┘
```

**Content:**
- Data Cloud uses a **two-layer data model**: raw storage (DLOs) and modeled data (DMOs)
- **DLOs** preserve the exact structure of the source system — no transformation
- **DMOs** apply a standardized schema that Data Cloud understands for processing
- Field mapping is the bridge that connects DLO fields to DMO fields
- Without field mapping, ingested data is **invisible** to segmentation and identity resolution

**Speaker Notes:** The two-layer model is a deliberate design choice. By keeping raw data in DLOs intact, Data Cloud allows you to re-map or re-process data later without re-ingesting it. The DLO is your safety net — it always reflects exactly what came from the source. The DMO layer is where the real work happens: identity resolution, segmentation, and activation all operate on DMO data. This layered approach also means that if you map fields incorrectly and later discover the mistake, you can fix the mapping and re-process without re-running the entire ingestion pipeline. Understanding this architecture is critical for troubleshooting questions on the exam.

---

### Slide 2: Data Lake Objects (DLOs) In Depth
**Visual:**
```
  DLO: Salesforce_Contact__dlm  (auto-created by Data Stream)
  ─────────────────────────────────────────────────────────
  │ cust_id    │ cust_fname │ cust_lname │ email_addr      │
  ├────────────┼────────────┼────────────┼─────────────────┤
  │ C-10045    │ John       │ Smith      │ john@co.com     │
  │ C-10046    │ Jane       │ Doe        │ jane@email.com  │
  │ C-10047    │ Robert     │ Chen       │ r.chen@biz.net  │
  └────────────┴────────────┴────────────┴─────────────────┘
  Field names mirror source system exactly
  Read-only — cannot manually edit DLO records
  Visible in: Setup → Data Cloud → Data Explorer
```

**Content:**
- DLOs are created automatically when a Data Stream is configured and first runs
- DLO schema mirrors the source system's field names and data types exactly
- **Read-only for users** — you cannot manually edit DLO records
- DLO data is stored in Data Cloud's internal data lake (separate from Salesforce CRM storage)
- Each DLO corresponds to one Data Stream (though multiple streams can share a DLO)
- DLOs are visible in **Data Explorer** (Setup → Data Cloud → Data Explorer)

**Speaker Notes:** A key exam point about DLOs: you don't create them manually. They're automatically generated when you set up a Data Stream and the first ingestion runs. The schema — field names, data types — comes directly from the source. This is why field mapping is necessary: a CRM might call a field "FirstName," your e-commerce system calls it "fname," and your loyalty app calls it "first_name." They all need to map to the same standard field on the Individual DMO. DLOs are accessible in Data Explorer for troubleshooting — you can verify that data landed correctly before investigating the mapping layer.

---

### Slide 3: Data Model Objects (DMOs) In Depth
**Visual:**
```
  ┌──────────────────────────┐  ┌──────────────────────────┐
  │    DMO: Individual       │  │  DMO: ContactPointEmail  │
  │  ──────────────────────  │  │  ──────────────────────  │
  │  Category: Profile       │  │  Category: Profile       │
  │  ──────────────────────  │  │  ──────────────────────  │
  │  FirstName               │  │  EmailAddress            │
  │  LastName                │  │  HasOptedOutOfEmail      │
  │  BirthDate               │  │  EmailOptOutDateTime     │
  │  Gender                  │  │  IndividualId  (FK)      │
  └──────────────────────────┘  └──────────────────────────┘

  ┌──────────────────────────┐  ┌──────────────────────────┐
  │    DMO: SalesOrder       │  │  DMO: UnifiedIndividual  │
  │  ──────────────────────  │  │  ──────────────────────  │
  │  Category: Other         │  │  (OUTPUT of Identity     │
  │  ──────────────────────  │  │   Resolution — not an    │
  │  OrderNumber             │  │   input DMO)             │
  │  TotalAmount             │  │                          │
  │  OrderDate               │  │  Reconciled attributes   │
  │  IndividualId  (FK)      │  │  from all source records │
  └──────────────────────────┘  └──────────────────────────┘
```

**Content:**
- DMOs are **structured objects** with a defined, standardized schema
- **Standard DMOs:** Pre-built by Salesforce, cannot be deleted, schema is fixed
- **Custom DMOs:** Created by admins to represent business-specific data entities
- DMOs have defined **data categories** (Profile, Engagement, Other) that affect processing
- DMOs support **relationships** (lookup-style) to other DMOs — enabling related-attribute segmentation
- DMO records are derived from DLO data via field mapping — they are NOT separate copies of the data

**Speaker Notes:** The distinction between standard and custom DMOs is exam material. Standard DMOs are non-negotiable — they exist because Identity Resolution needs them to function. You cannot build a Unified Individual without a properly populated Individual DMO. Custom DMOs let you model data that has no standard equivalent. For example, if you're a telecom company, you might create a custom "Subscription" DMO to represent each customer's service plan. Custom DMOs work with segmentation but have limited support in Identity Resolution. The DMO data category (Profile vs. Engagement) matters because Profile data is used in Identity Resolution while Engagement data (like event records) is used in segmentation and analytics but not for matching.

---

### Slide 4: Key Standard DMOs
**Visual:**
```
  ┌──────────────────────────┬──────────────────────────────────────┐
  │ DMO Name                 │ Purpose                              │
  ├──────────────────────────┼──────────────────────────────────────┤
  │ Individual               │ Core person record; input to IR      │
  │ Contact Point Email      │ Email addresses linked to Individual │
  │ Contact Point Phone      │ Phone numbers linked to Individual   │
  │ Unified Individual       │ OUTPUT of Identity Resolution        │
  │ Sales Order              │ Purchase / transaction records       │
  │ Sales Order Product      │ Line items within a Sales Order      │
  │ Web Engagement           │ Web clickstream / behavioral events  │
  │ Email Engagement         │ Marketing email open / click events  │
  └──────────────────────────┴──────────────────────────────────────┘
  NOTE: Unified Individual is created BY Identity Resolution,
        not manually — do not confuse it with a source DMO
```

**Content:**
- **Individual** — Represents a person; core DMO for identity resolution
- **Contact Point Email** — Email addresses linked to an Individual
- **Contact Point Phone** — Phone numbers linked to an Individual
- **Unified Individual** — Output of Identity Resolution; the merged profile
- **Sales Order / Sales Order Product** — Purchase/transaction records
- **Web Engagement** — Web clickstream and behavioral events
- **Email Engagement** — Marketing email open/click events (from Marketing Cloud)

**Speaker Notes:** You should be able to answer questions about which standard DMO holds which type of data. The Individual DMO is the most important — it's the core person record that Identity Resolution works against. The Contact Point DMOs (Email, Phone) hold the specific identifiers used for matching. A common exam scenario: "You want Identity Resolution to match records by email address — which DMO must be populated?" Answer: Contact Point Email. Note that the Unified Individual is also a standard DMO but it's the OUTPUT of Identity Resolution, not an input. You don't create Unified Individual records directly — the Identity Resolution ruleset creates them from Individual records.

---

### Slide 5: Standard vs. Custom DMOs
**Visual:**
```
  ┌────────────────────────────┬────────────────────────────┐
  │      STANDARD DMO          │       CUSTOM DMO           │
  ├────────────────────────────┼────────────────────────────┤
  │ Created by Salesforce      │ Created by admin/consultant│
  │ Schema is fixed            │ Flexible schema            │
  │ Cannot be deleted          │ Can be deleted             │
  │ Full Identity Resolution   │ Limited IR support         │
  │ support                    │                            │
  │ Full segmentation support  │ Full segmentation support  │
  ├────────────────────────────┼────────────────────────────┤
  │ Use for:                   │ Use for:                   │
  │ Person records (Individual)│ Vehicle ownership          │
  │ Contact points (Email,     │ Insurance policies         │
  │ Phone)                     │ Subscription plans         │
  │ Orders, Engagements        │ Industry-specific entities │
  └────────────────────────────┴────────────────────────────┘
  RULE: Always use standard Individual DMO for person records.
        Custom "Person" DMOs break Identity Resolution.
```

**Content:**
- **Standard DMOs:** Created by Salesforce, schema is fixed, supports Identity Resolution, cannot be deleted
- **Custom DMOs:** Created by admin/consultant, flexible schema, limited Identity Resolution support, can be deleted
- When to use Custom DMOs:
  - Data doesn't fit any standard DMO category
  - Industry-specific entities (vehicle ownership, insurance policy, subscription plan)
  - Custom engagement events beyond Web/Email Engagement
- **Best practice:** Always try to use a standard DMO first before creating a custom one

**Speaker Notes:** The exam wants you to know when to use standard vs. custom DMOs. The general rule is: if Salesforce has a standard DMO that fits your data, use it. Standard DMOs get you Identity Resolution compatibility out of the box and follow Salesforce's supported patterns. Custom DMOs are for when your data truly has no standard equivalent. A frequent exam trap is a scenario where someone creates a custom "Person" DMO instead of using the standard Individual DMO — this is wrong because it breaks Identity Resolution. Always use the standard Individual DMO for person records.

---

### Slide 6: Field Mapping — The Bridge Layer
**Visual:**
```
  DATA LAKE OBJECT (DLO)              DATA MODEL OBJECT (DMO)
  ─────────────────────               ───────────────────────
  Raw ingested data                   Standardized schema
  One per Data Stream                 Shared across sources

  ┌─────────────────────┐   mapping   ┌─────────────────────┐
  │ Salesforce_Contact  │────────────▶│   Individual (std)  │
  │ - cust_id      ─────────────────▶ - PartyId            │
  │ - cust_fname   ─────────────────▶ - FirstName          │
  │ - cust_lname   ─────────────────▶ - LastName           │
  │ - email_addr        │             │ - EmailAddress      │
  └─────────────────────┘             └─────────────────────┘

  ┌─────────────────────┐   mapping   ┌─────────────────────┐
  │ MC_Subscriber       │────────────▶│  ContactPointEmail  │
  │ - EmailAddress ─────────────────▶ - EmailAddress       │
  │ - SubscriberKey─────────────────▶ - IndividualId (FK)  │
  │ - OptOutFlag   ─────────────────▶ - HasOptedOutOfEmail  │
  └─────────────────────┘             └─────────────────────┘
```

**Content:**
- Field mapping connects raw DLO fields to standard DMO fields
- Configured in the Data Stream setup or separately in the Mapping section
- Each DLO field can map to **one** DMO field; one DMO field can receive from **multiple** DLOs
- Data type compatibility is required — cannot map a text field to a date field without transformation
- **Primary Key** mapping is required — every DMO record must have a unique identifier
- Unmapped DLO fields are not lost — they remain in the DLO and can be mapped later

**Speaker Notes:** Field mapping is where much of the practical implementation work happens, and it's heavily tested on the exam. The key rules are: data types must be compatible (you can't map a text field to a number field), every DMO record needs a primary key (so mapping the source record ID to a DMO primary key field is essential), and fields don't have to be mapped immediately — you can always add mappings later without re-ingesting data. A common exam scenario tests the one-to-many direction: multiple DLOs (from different source systems) can all map to the same DMO. This is what enables identity resolution across sources — data from your CRM, your e-commerce platform, and your loyalty app all map to the Individual DMO.

---

### Slide 7: Field Mapping Rules & Constraints
**Visual:**
```
  FIELD MAPPING RULES
  ───────────────────
  ALLOWED:
  ✅  Multiple DLOs → same DMO         (data consolidation across sources)
  ✅  One DLO → multiple DMOs          (if data covers multiple entities)
  ✅  Partial mapping                  (not all DLO fields need mapping)
  ✅  Formula transformation           (for type conversion at mapping time)

  NOT ALLOWED:
  ✗   One DLO field → two different fields on the same DMO
  ✗   Incompatible data types without a formula transformation
  ✗   Mapping to calculated/formula fields on the DMO

  REQUIRED:
  ★   Primary Key field MUST always be mapped
```

**Content:**
- ✅ Multiple DLOs can map to the same DMO (data consolidation)
- ✅ One DLO can map to multiple DMOs (if data covers multiple entities)
- ✅ Partial mapping is allowed — not all DLO fields need to be mapped
- ❌ Cannot map a DLO field to two different fields on the same DMO
- ❌ Cannot map incompatible data types without applying a formula transformation
- ❌ Calculated fields on DMOs (formulas) cannot receive direct DLO mappings
- **Primary Key field** must always be mapped

**Speaker Notes:** The exam is particularly fond of testing the constraint rules. "Can multiple DLOs map to the same DMO?" — Yes, this is fundamental to consolidating data from multiple sources. "Can one DLO field map to two different DMO fields?" — No. "Is it required to map every DLO field?" — No, partial mapping is fine. The data type constraint often shows up in troubleshooting scenarios: "Field mapping was configured but records aren't appearing in the DMO — what's the most likely cause?" A data type mismatch (e.g., source sends date as a string but DMO field is type Date) is a common answer. Formulas can handle some type conversions, but the exam usually tests whether you know that a type mismatch is a valid error condition.

---

### Slide 8: Field Mapping Best Practices
**Visual:**
```
  ┌──────────────────────────────────┬──────────────────────────────────┐
  │              DO                  │             DON'T                │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Map source ID → DMO Primary Key  │ Create custom "Person" DMO when  │
  │ for traceability                 │ standard Individual DMO fits     │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Map Contact Point Email fields   │ Map email only to Individual;    │
  │ for email-based IR matching      │ forget Contact Point Email DMO   │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Document each DLO→DMO mapping    │ Map test/staging fields to       │
  │ per Data Stream                  │ production DMOs                  │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Map all fields used in           │ Leave segmentation-needed fields │
  │ segmentation or activation       │ unmapped and expect them to work │
  └──────────────────────────────────┴──────────────────────────────────┘
```

**Content:**
- **Do:** Map the source system's unique ID to the DMO Primary Key field for traceability
- **Do:** Map all fields that will be used in segmentation, identity resolution, or activation
- **Do:** Document your field mappings (source field → DMO field) for each Data Stream
- **Don't:** Create a custom DMO when a standard DMO fits — it complicates identity resolution
- **Don't:** Leave Contact Point DMO fields unmapped if identity resolution by email/phone is needed
- **Don't:** Map test/staging fields to production DMOs — use separate orgs or Data Spaces

**Speaker Notes:** These best practices show up in scenario questions that ask "what should the consultant do?" The most exam-relevant best practice is the Contact Point one: if you want identity resolution to match customers by email address, you MUST have the email field mapped to the Contact Point Email DMO. A surprisingly common implementation mistake — and exam trick — is when consultants map the email field only to the Individual DMO but forget to create the Contact Point Email records. Identity Resolution uses Contact Point DMOs specifically for matching, not the Individual DMO email field. Similarly, using separate Data Spaces for testing versus production is a governance best practice covered in the governance section.

---

## Recording Script

Welcome to Lecture 03. In this lecture, we're diving deep into the data model — specifically the two-layer architecture of Data Lake Objects and Data Model Objects, and how field mapping connects them.

Let me use an analogy. Imagine you run a warehouse that receives shipments from dozens of different vendors. Each vendor uses their own labeling system — different box sizes, different item codes, different languages. When goods arrive, you put them in a staging area exactly as they came — that's your DLO layer. Then your team goes through the staging area, identifies each item, and places it on the right shelf in the right section of your organized warehouse — that's your DMO layer. Field mapping is the process of identifying "this vendor's box labeled 'cust_fname' belongs on the 'FirstName' shelf in the Individual section."

Without that translation step, your warehouse is full of goods you can't find or use efficiently.

Now let's talk standard DMOs. Salesforce provides a set of pre-built DMOs that cover the most common data entities. The most important ones for the exam are: **Individual** — the person record, **Contact Point Email** and **Contact Point Phone** — the identifiers used for matching, and **Unified Individual** — the output of Identity Resolution.

Here's a critical point that many candidates miss: Identity Resolution uses the **Contact Point** DMOs for matching, not the email field on Individual. So if you want to match records by email address, you must map your email fields to the Contact Point Email DMO. Mapping email only to the Individual DMO won't enable email-based matching.

For field mapping rules: multiple DLOs can map to the same DMO — this is how you consolidate data from multiple sources into one model. But one DLO field cannot map to two different fields on the same DMO. Data types must be compatible. And every DMO record must have a primary key — map your source system's unique ID to that primary key field.

Custom DMOs are available when your data doesn't fit any standard DMO. Use them for industry-specific entities. But never create a custom "Person" DMO — always use the standard Individual. Deviation from standard DMOs breaks Identity Resolution.

In Lecture 04, we'll see how Identity Resolution takes those properly mapped DMOs and produces the Unified Individual. See you there.

---

## Exam Tips

- **Contact Point Email** DMO (not the Individual email field) must be populated for email-based identity resolution matching
- Multiple DLOs **can** map to the same DMO — this enables consolidation from multiple sources
- **Custom DMOs** work with segmentation but have **limited Identity Resolution support** — always use standard DMOs for person records
- The **Unified Individual** DMO is the **output** of Identity Resolution — you do not create its records manually
- Leaving the **Primary Key** field unmapped will cause field mapping to fail — this is a required mapping

---

## Lecture Summary

Data Cloud uses a two-layer data model: Data Lake Objects store raw, untransformed source data, while Data Model Objects provide a standardized schema for processing. Field mapping connects DLO fields to DMO fields, enabling identity resolution, segmentation, and activation. Salesforce provides standard DMOs including Individual, Contact Point Email, Contact Point Phone, and Unified Individual. The Contact Point DMOs are critical for identity resolution matching — email-based matching requires the Contact Point Email DMO to be populated, not just the Individual email field. Custom DMOs extend the model for business-specific entities but should never replace standard DMOs for person records. Field mapping rules require data type compatibility, a mapped primary key, and allow multiple DLOs to map to the same DMO.

---

## Mini Quiz

**Question 1:** A consultant has configured a Data Stream that ingests customer records from an e-commerce platform, including email addresses. However, Identity Resolution is not matching these records with CRM Individual records, even though the same customers exist in both systems with the same email addresses. What is the most likely cause?

A) The Individual DMO is not mapped  
B) The email field is mapped to Individual but the Contact Point Email DMO has not been configured  
C) The Data Stream refresh schedule is set to 24 hours  
D) The Unified Individual DMO is not a standard DMO  

**Answer: B**
Identity Resolution uses the Contact Point Email DMO for email-based matching, not the email field on the Individual DMO. Even if the email field is present on Individual records, it won't drive matching unless those email addresses exist as Contact Point Email records linked to the Individual.

---

**Question 2:** Which statement about custom Data Model Objects is correct?

A) Custom DMOs fully support Identity Resolution and can replace the standard Individual DMO  
B) Custom DMOs can be used for segmentation but have limited Identity Resolution support  
C) Custom DMOs are automatically created when a new Data Stream is configured  
D) Custom DMOs cannot be related to standard DMOs  

**Answer: B**
Custom DMOs support segmentation (you can build segment criteria against custom DMO fields) but they have limited Identity Resolution support. You should never replace the standard Individual DMO with a custom person DMO — Identity Resolution requires the standard Individual. Custom DMOs are created manually by admins, not automatically.

---

**Question 3:** A Data Lake Object has a field "order_date" stored as a text string (e.g., "2024-03-15"). The target Sales Order DMO expects the "OrderDate" field as a Date data type. What should the consultant do?

A) Change the source system to output dates in a different format  
B) Create a custom DMO with a text OrderDate field  
C) Apply a formula transformation in the field mapping to convert the text to a Date type  
D) Map the text field directly — Data Cloud will auto-convert data types  

**Answer: C**
When a DLO field and DMO field have incompatible data types, a formula transformation can be applied during field mapping to convert the data type. Data Cloud does not auto-convert incompatible types. Creating a custom DMO just to accommodate a text date field is poor practice. Changing the source system is often not within the consultant's control and is not the preferred solution.
