# Lecture 13: Real-World Use Cases & Exam Scenarios

## Learning Objectives
- Apply Data Cloud knowledge to realistic multi-domain exam scenario questions
- Describe how to approach and eliminate wrong answers in Data Cloud Consultant exam scenarios
- Identify industry-specific Data Cloud patterns for retail, financial services, and healthcare
- Recognize common exam traps and how to avoid them

---

## Slides

### Slide 1: Exam Scenario Strategy
**Visual:**
```
  4-STEP EXAM SCENARIO APPROACH
  ──────────────────────────────────────────────────────────
  STEP 1: IDENTIFY THE DOMAIN
  ┌──────────────────────────────────────────────────────┐
  │ "A consultant wants to..." — which domain?           │
  │  Ingestion? Modeling? Segmentation? Governance? AI?  │
  └──────────────────────────────────────────────────────┘
                         │
  STEP 2: IDENTIFY THE CONSTRAINT
  ┌──────────────────────────────────────────────────────┐
  │ What's the business rule, limitation, or requirement │
  │ in the scenario? (consent, performance, freshness)   │
  └──────────────────────────────────────────────────────┘
                         │
  STEP 3: ELIMINATE WRONG ANSWERS
  ┌──────────────────────────────────────────────────────┐
  │ Wrong: requires a feature that doesn't exist         │
  │ Wrong: violates a key Data Cloud rule                │
  │ Wrong: the right thing done in the wrong place       │
  └──────────────────────────────────────────────────────┘
                         │
  STEP 4: APPLY THE PRINCIPLE
  ┌──────────────────────────────────────────────────────┐
  │ Choose the answer that follows Data Cloud best       │
  │ practice for the identified domain + constraint      │
  └──────────────────────────────────────────────────────┘
```

**Content:**
- Exam scenario questions test application of concepts, not memorization
- **Step 1 — Identify the domain:** Is this about ingestion, data modeling, identity resolution, segmentation, activation, governance, or AI?
- **Step 2 — Identify the constraint:** What's the key requirement? Consent? Freshness? Performance? Access control?
- **Step 3 — Eliminate wrong answers:** Remove answers that violate Data Cloud rules, suggest non-existent features, or do the right thing in the wrong place
- **Step 4 — Apply the principle:** Choose the answer that reflects best practice for the specific domain and constraint
- Most wrong answers fail because they suggest using DLOs where DMOs are needed, or skipping a required step

**Speaker Notes:** This strategy framework applies to every scenario question on the exam. Most exam traps work by describing a plausible-sounding action that actually violates a core Data Cloud principle. For example: "segment directly on a DLO" — this sounds like it could work, but segmentation is built on DMO-layer data, never DLOs. Or "activate directly from a segment without an Activation Target" — this violates the architecture (AT is required). Recognizing the trap in the answer is as important as knowing the right answer.

---

### Slide 2: Retail Use Case — Customer Loyalty
**Visual:**
```
  RETAIL SCENARIO: Unified Loyalty Program
  ──────────────────────────────────────────────────────────
  SOURCES:
  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
  │ POS System  │  │  E-Commerce  │  │  Loyalty App    │
  │ (in-store)  │  │  Platform    │  │  (mobile)       │
  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘
         │                │                   │
         └────────────────┼───────────────────┘
                          ▼
                    DATA CLOUD
               Identity Resolution:
               Sarah Smith (in-store)
               ssmith@email.com (e-comm)
               LoyaltyMember#4421 (app)
                    → ONE Unified Individual
                          │
         ┌────────────────┼───────────────────┐
         ▼                ▼                   ▼
  ┌────────────┐  ┌─────────────────┐  ┌────────────────┐
  │  SEGMENT   │  │  CI: TotalSpend │  │  ACTIVATION    │
  │ High Value │  │  + ProductAffin │  │  → Marketing   │
  │ 90d Buyers │  │  + LoyaltyTier  │  │  Cloud (offers)│
  └────────────┘  └─────────────────┘  └────────────────┘
```

**Content:**
- **Retail challenge:** same customer shops in-store, online, and via app — three separate identity siloes
- **Data Cloud solution:**
  1. Ingest POS, e-commerce, and loyalty app data via appropriate connectors
  2. Map all sources to Individual and related DMOs (Sales Order, Contact Point Email, etc.)
  3. Identity Resolution unifies the three source records into one Unified Individual
  4. CIs compute TotalSpend, purchase frequency, product affinity
  5. Segments group customers by value/behavior
  6. Activation delivers personalized offers via Marketing Cloud
- **Key exam pattern:** multi-source unified identity → segmentation → personalized activation

**Speaker Notes:** The retail loyalty use case is the most common scenario template on the exam. The core problem is always the same: siloed data, duplicate identities, fragmented view of the customer. The Data Cloud solution always follows the same arc: ingest all sources → model into DMOs → resolve identities → compute CIs → segment → activate. The specific exam question will introduce a twist or constraint — maybe the retailer wants real-time in-store personalization, or they need to comply with a state privacy law. But the foundation is always this same pattern. Knowing the standard pattern lets you focus on the constraint rather than the framework.

---

### Slide 3: Retail Segmentation Patterns
**Visual:**
```
  THREE RETAIL SEGMENT TYPES (on exam)
  ──────────────────────────────────────────────────────────
  ┌──────────────────────────────────────────────────────┐
  │  SEGMENT 1: HIGH VALUE RECENT BUYERS                 │
  │  Attribute filter:   LoyaltyTier = "Gold"            │
  │  CI filter:          TotalSpend90d >= $500           │
  │  Related attribute:  hasOrder in last 30 days = true │
  └──────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────┐
  │  SEGMENT 2: LAPSED BUYERS — WIN-BACK CAMPAIGN        │
  │  CI filter:          DaysSinceLastPurchase > 90      │
  │  CI filter:          TotalHistoricSpend > $200       │
  │  Exclusion:          NOT in "Active Buyers" segment  │
  └──────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────┐
  │  SEGMENT 3: PRODUCT AFFINITY — ELECTRONICS          │
  │  CI filter:          TopCategory = "Electronics"     │
  │  Attribute filter:   ConsentEmail = true             │
  │  NOT in:             RecentlyContactedSegment        │
  └──────────────────────────────────────────────────────┘
  All segments: Dynamic — auto-refresh, count changes daily
  All segments: Unified Individual as population object
```

**Content:**
- **High Value Recent Buyers:** Loyalty tier (attribute) + spend (CI) + recent purchase (related attribute)
- **Lapsed Buyers Win-Back:** Days since purchase (CI) + historic spend (CI) + exclusion of active buyers
- **Product Affinity Targeting:** CI-based top category + consent filtering + exclusion of recently contacted
- All three patterns combine: attribute filters, CI filters, related attribute filters, and exclusions
- These are the building blocks for almost any B2C segmentation use case
- The exam will describe a business objective and ask which segment criteria approach to use

**Speaker Notes:** These three retail segment patterns illustrate the full range of segment criteria types we covered in Section 2. The exam won't say "use a CI filter" — it will say "a consultant wants to target customers who haven't purchased in 90 days but have historically spent more than $200." Your job is to recognize that "days since last purchase" and "total historic spend" are aggregate metrics — they need to be Calculated Insights, not attribute filters. Translating the business objective into the correct Data Cloud feature is the core segmentation exam skill.

---

### Slide 4: Financial Services Use Case
**Visual:**
```
  FINANCIAL SERVICES SCENARIO: Cross-Sell with Data Governance
  ──────────────────────────────────────────────────────────
  SOURCES:
  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
  │  Banking    │  │  Investments │  │  Mortgage       │
  │  CRM        │  │  Platform    │  │  System         │
  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘
         └────────────────┼───────────────────┘
                          ▼ via Data Cloud
  ┌──────────────────────────────────────────────────────┐
  │  Three Data Spaces:                                  │
  │  [Banking DS]  [Investments DS]  [Mortgage DS]       │
  │  Strict wall: Investment analysts CAN'T see banking  │
  └──────────────────────────────────────────────────────┘
                          │
            Cross-sell only where BOTH products
            are in scope for the analyst's role
                          │
  CI: RelationshipProfit (AUM + net interest – liability cost)
  Segment: "High AUM clients without investment advisory"
  Activation: Wealth Management team outreach (via CRM AT)
```

**Content:**
- **Financial services challenge:** regulatory requirement to keep product lines data-separate; identify cross-sell opportunities without violating Chinese walls
- **Data Cloud solution:** multiple Data Spaces with strict access control by role
- Banking, Investment, and Mortgage product data in separate Data Spaces
- Analysts only access Data Spaces for their product lines
- Cross-product CIs computed only where cross-product analysis is permitted
- Segment: "High AUM customers without investment advisory" → activate to wealth management
- **Key exam pattern:** Data Spaces for regulatory separation + segment-to-CRM activation

**Speaker Notes:** Financial services is the most governance-heavy use case on the exam. When you see a scenario involving financial data and words like "regulatory compliance," "Chinese wall," or "data isolation," the answer almost always involves Data Spaces to separate access by product line or role. The cross-sell use case is interesting because it requires combining data ACROSS product lines — which requires careful governance design. The exam might ask: "a wealth management analyst needs to see banking account balances but should NOT see investment holdings. How should Data Spaces be configured?" The answer: banking in one Data Space, investment holdings in another, with the analyst having only the banking Data Space in their access.

---

### Slide 5: Compliance and Privacy Use Case
**Visual:**
```
  GDPR RIGHT TO ERASURE — Implementation Pattern
  ──────────────────────────────────────────────────────────
  CUSTOMER REQUEST: "Delete all my data"
                          │
  STEP 1: Identify the Unified Individual
  ┌──────────────────────────────────────────────────────┐
  │ Query: find Unified Individual where email matches   │
  │ customer's email in ContactPointEmail DMO            │
  └──────────────────────────────────────────────────────┘
                          │
  STEP 2: Set privacy flags on Individual DMO
  ┌──────────────────────────────────────────────────────┐
  │ DoNotProcess = true                                  │
  │ → Data Cloud stops processing this individual's data │
  └──────────────────────────────────────────────────────┘
                          │
  STEP 3: Execute deletion request
  ┌──────────────────────────────────────────────────────┐
  │ Data Cloud Consent API: submit deletion request      │
  │ → removes from DMOs + prevents re-ingestion          │
  └──────────────────────────────────────────────────────┘
                          │
  STEP 4: Verify removal
  ┌──────────────────────────────────────────────────────┐
  │ Confirm customer no longer in any segment            │
  │ No pending activations for this Unified Individual   │
  └──────────────────────────────────────────────────────┘
  Timeline: GDPR requires response within 30 days
```

**Content:**
- **Compliance challenge:** GDPR Right to Erasure requires deletion from all marketing systems
- **Data Cloud solution:**
  1. Identify Unified Individual via ContactPointEmail DMO
  2. Set `DoNotProcess = true` on Individual DMO to immediately stop processing
  3. Submit deletion request via Data Cloud Consent API
  4. Verify the customer is removed from all DMO data and future activations
- `DoNotProcess = true` is the immediate stop; full deletion may take time to process through all objects
- Customers who are deleted should NOT be re-ingested from source systems — source systems must also honor the deletion

**Speaker Notes:** The GDPR right to erasure use case is very testable because it requires knowing several consent/privacy features together. The exam might ask "what is the first action a Data Cloud administrator should take when receiving a GDPR deletion request?" The immediate step is setting DoNotProcess = true — this stops the customer's data from being used in any further processing while the full deletion proceeds. Then the deletion API handles the actual removal. The exam also tests: what happens if the source system re-sends this customer's record on the next Data Stream run? The answer: without source-system-level deletion, the record will be re-ingested — so proper erasure requires coordinating the deletion at the source as well.

---

### Slide 6: Healthcare Engagement Use Case
**Visual:**
```
  HEALTHCARE USE CASE: Care Gap Outreach Program
  ──────────────────────────────────────────────────────────
  SOURCES (de-identified per HIPAA):
  ┌───────────────┐  ┌────────────────┐  ┌────────────────┐
  │ EHR System    │  │  Patient Portal│  │  Claims Data   │
  │ (diagnoses,   │  │  (login,       │  │  (procedures,  │
  │  prescriptions│  │   engagement)  │  │   lab results) │
  └───────┬───────┘  └───────┬────────┘  └───────┬────────┘
          └──────────────────┼──────────────────-─┘
                             ▼ Requires BAA with Salesforce
                       DATA CLOUD
                  Unified Patient Profile
                             │
  CI: DaysSinceLastScreening    CI: CareGapRiskScore
                             │
  Segment: "Due for Annual Screening"
  (DaysSinceScreening > 365 AND ConsentOutreach = true)
                             │
                    Outreach via:
  ┌───────────────────────────────────────────────────────┐
  │  Patient's preferred contact (SMS or portal message)  │
  │  Content: "Schedule your annual wellness exam"        │
  └───────────────────────────────────────────────────────┘
  KEY GOVERNANCE REQUIREMENT: BAA + Data Space isolation
```

**Content:**
- **Healthcare challenge:** improve preventive care outcomes by identifying patients due for screenings
- **Requirements:** HIPAA compliance (Business Associate Agreement with Salesforce), strict data access controls
- **Data Cloud solution:**
  - Ingest EHR, portal, and claims data
  - Map to Individual and Encounter/Procedure DMOs
  - CI: compute DaysSinceLastScreening, CareGapRiskScore
  - Segment: patients due for screening who have consented to outreach
  - Activate to preferred channel (SMS, portal, or call center)
- **Key governance requirement:** Salesforce BAA required before health data enters Data Cloud
- Data Spaces must isolate health data from any non-clinical uses

**Speaker Notes:** Healthcare is increasingly exam-relevant as health systems adopt Salesforce for patient engagement. The HIPAA angle introduces governance constraints that change the implementation approach. Unlike retail where you can be fairly permissive with data access, healthcare requires BAA documentation, PHI minimization, and strict Data Space isolation. The exam might ask about a healthcare scenario where a consultant is setting up Data Cloud — the first governance consideration is always: "has the Salesforce BAA been executed?" Without that legal framework, no PHI should enter Data Cloud. The consent requirement — "ConsentOutreach = true" as a segment filter — is also critical: outreach to patients who haven't consented is both a HIPAA violation and an ethical violation.

---

### Slide 7: Common Exam Traps
**Visual:**
```
  COMMON EXAM TRAPS — Know These Patterns
  ──────────────────────────────────────────────────────────
  TRAP 1: "Segment directly on DLO data"
  ✗ Wrong: Segmentation only works on DMO-layer data
  ✓ Fix:   Map DLO to DMO, then segment on DMO

  TRAP 2: "Real-time segment that instantly activates"
  ✗ Wrong: Segments refresh on schedule (not real-time by default)
  ✓ Fix:   Use streaming segmentation OR near-real-time activation
            (check activation target capabilities)

  TRAP 3: "Create a custom DMO to hold all data"
  ✗ Wrong: Use standard DMOs wherever possible; custom = last resort
  ✓ Fix:   Map to standard DMOs first; custom only for unique data types

  TRAP 4: "Build segment without consent filter"
  ✗ Wrong: Consent filtering should be included in activation-ready segs
  ✓ Fix:   Add consent filter (HasOptedOutOfEmail = false) before activate

  TRAP 5: "Run CI refresh before Data Stream completes"
  ✗ Wrong: CI operates on DMO data; DMO must be current first
  ✓ Fix:   Job chaining — CI refresh runs AFTER Data Stream refresh

  TRAP 6: "Use fuzzy match for email"
  ✗ Wrong: Fuzzy match on email allows wrong matches (similar addresses)
  ✓ Fix:   Email match uses exact or normalized — never fuzzy
```

**Content:**
- **Trap 1 — DLO segmentation:** segmentation only works on DMO-layer data, never raw DLOs
- **Trap 2 — Real-time assumption:** segments refresh on schedule by default, not in real time
- **Trap 3 — Custom DMO over-use:** use standard DMOs when possible; custom only for truly unique data
- **Trap 4 — Missing consent filter:** activation-ready segments should always filter out opted-out customers
- **Trap 5 — CI before DMO:** CIs must run AFTER Data Stream + DMO refresh — enforce with job chaining
- **Trap 6 — Fuzzy email match:** email should use exact or normalized match — fuzzy is for names, not emails

**Speaker Notes:** Memorize these six traps. Each one corresponds to a fundamental Data Cloud rule that the exam will test by presenting the WRONG answer as a plausible-sounding option. The DLO segmentation trap is particularly common because candidates think "the data is in Data Cloud, so I can segment on it" — but the answer requires knowing that DLOs are the raw layer and segmentation needs the modeled DMO layer. The fuzzy email trap is subtle — fuzzy matching sounds thorough, but email addresses are exact identifiers. A fuzzy match on email would potentially match "john.smith@example.com" with "jane.smith@example.com" — which would merge two different people into one Unified Individual. That's a catastrophic identity resolution error.

---

### Slide 8: Exam Decision Framework
**Visual:**
```
  CONNECTOR SELECTION DECISION TREE:
  ──────────────────────────────────────────────────────────
  Source: Salesforce CRM? ──YES──▶ Salesforce Connector (native, bidirectional)
                │
               NO
                │
  Source: Marketing Cloud? ──YES──▶ Marketing Cloud Connector (subscriber data)
                │
               NO
                │
  Source: Cloud file storage? ──YES──▶ Cloud Storage Connector (S3/GCS/Azure CSV)
  (S3, GCS, Azure Blob)
                │
               NO
                │
  Source: Custom API / event stream? ──YES──▶ Ingestion API (REST POST)
                │
               NO
                │
  Source: Other enterprise systems?──YES──▶ MuleSoft Connector

  SEGMENT CRITERIA DECISION:
  ┌───────────────────────────────────────────────────────┐
  │ Single DMO field value? → Attribute Filter            │
  │ Field on related DMO?   → Related Attribute Filter    │
  │ Computed metric (sum,   → Calculated Insight Filter   │
  │  count, avg)?                                         │
  └───────────────────────────────────────────────────────┘
```

**Content:**
- **Connector decision:** Salesforce native → Salesforce Connector; Marketing Cloud → MC Connector; Cloud file storage → Cloud Storage Connector; REST API / streaming → Ingestion API; enterprise ETL → MuleSoft
- **Segment criteria decision:**
  - Single DMO field value → attribute filter
  - Related DMO field → related attribute filter
  - Aggregated/computed metric → Calculated Insight filter
- **Identity Resolution match type decision:**
  - Email/ID → exact match (never fuzzy)
  - Phone → normalized match (removes formatting)
  - Name → fuzzy match (handles spelling variations)
- **Activation Target decision:** Salesforce CRM → Salesforce CRM AT; email → Marketing Cloud AT; advertising → Meta/Google AT (with hashing)

**Speaker Notes:** This decision framework is a quick-reference for the most common "which feature should be used" questions on the exam. Treat it as a flowchart: given a source system, which connector? Given a segment criteria need, which criteria type? Given a field to match, which match rule? Given an activation channel, which activation target? These decision trees encode the patterns from across the entire course. For the exam, you won't see these questions in isolation — they'll be embedded in a scenario. But the decision logic is the same: identify the context, apply the rule, pick the feature.

---

## Recording Script

Welcome to Lecture 13 and the final lecture of the course. This is where we tie everything together for the exam.

The Salesforce Data Cloud Consultant exam is heavily scenario-based. You won't be asked "what does a DMO stand for?" — you'll be asked "a consultant is designing a data model for a retailer with three data sources and needs to merge customer records across systems. What should the consultant configure?" Your job is to apply knowledge, not recite it.

The four-step approach I outlined works consistently: identify the domain, identify the constraint, eliminate wrong answers, apply the principle. Most wrong answers fail because they suggest doing something that violates a core Data Cloud rule — using DLOs where DMOs are needed, running CI refresh before the Data Stream completes, using fuzzy matching on email identifiers.

The six exam traps are worth memorizing as a checklist you mentally run through when an answer sounds right but something feels off. DLO segmentation, missing consent filters, wrong match rule types — these are the patterns that trip up otherwise well-prepared candidates.

For each industry use case we covered, remember the pattern:
- Retail: multi-source identity unification → loyalty segment → personalized offer activation
- Financial Services: Data Spaces for regulatory isolation → relationship profitability CI → CRM activation
- Healthcare: BAA required → consent-gated segments → preferred channel outreach
- Compliance: DoNotProcess flag → Consent API deletion → source-system coordination

The connector and criteria decision trees give you quick answers for the most frequently tested "which feature" questions.

You've now covered all 13 lectures in this course. The architecture, ingestion, data modeling, identity resolution, segmentation, activation, governance, monitoring, analytics, AI, and use case applications of Salesforce Data Cloud Consultant. That's the complete picture.

Good luck on the exam. You're ready.

---

## Exam Tips

- **Domain identification is the first step** — before answering, decide which Data Cloud domain the scenario is about
- Always eliminate answers that suggest **segmentation on DLOs** — this is not supported; only DMOs are segmentable
- **Fuzzy match is only for names** — email and ID fields should use exact or normalized match
- **Consent filtering** should be included in any segment intended for activation — look for answers that include opt-out exclusion
- **Job chaining** is the correct answer when scenarios involve stale CI or segment data from processing order issues

---

## Course Summary

This 13-lecture course covered the complete Data Cloud Consultant certification exam domain. The architecture (Lecture 1) establishes the foundation: Data Streams bring in raw data to DLOs, field mapping creates DMOs, Identity Resolution produces Unified Individuals. Ingestion (Lecture 2) covers the five connector types and their use cases. Data modeling (Lecture 3) explains the DLO-to-DMO transformation and standard DMO types. Identity Resolution (Lecture 4) explains match and reconciliation rules. Segmentation (Lecture 5) and Calculated Insights (Lecture 6) cover the segment builder and CI computation. Activation Targets (Lecture 7) explains how segments reach external systems. Consent and Privacy (Lecture 8) and Governance (Lecture 9) cover compliance and access control. Performance Monitoring (Lecture 10) covers the Admin UI and job management. Analytics (Lecture 11) covers Tableau and CRM Analytics integration. AI and Personalization (Lecture 12) explains grounding, vector databases, and Agentforce. This final lecture (Lecture 13) integrates everything into exam-ready scenario frameworks.

---

## Mini Quiz

**Question 1:** A consultant is designing a segment to target customers who have been inactive for 90 days, have a lifetime spend of over $500, and have opted in to email marketing. Which combination of criteria is correct?

A) Three attribute filters on the Individual DMO for inactivity, lifetime spend, and email opt-in  
B) One Calculated Insight filter for DaysSinceLastPurchase, one CI filter for TotalLifetimeSpend, and one attribute filter for HasOptedOutOfEmail = false  
C) One related attribute filter joining to Sales Order DMO for all three criteria  
D) A single SOQL query in the Segment Builder advanced mode  

**Answer: B**
DaysSinceLastPurchase and TotalLifetimeSpend are aggregate metrics (count/sum/days) that must be pre-computed as Calculated Insights — they cannot be expressed as simple attribute filters. The email opt-in status (HasOptedOutOfEmail) is a field on the Individual or ContactPointEmail DMO and is an attribute filter. SOQL is not used in Data Cloud's segment builder; SAQL is CRM Analytics-specific.

---

**Question 2:** A retail company's customers shop in-store, online, and through a mobile app. Identity resolution is showing a very low match rate — most customers appear as separate Unified Individuals for each channel. What is the most likely root cause?

A) The match rules are configured as fuzzy instead of exact  
B) The ContactPointEmail and ContactPointPhone DMOs are empty because the source-to-DMO field mappings for contact point objects are incomplete  
C) The Individual DMO has too many records causing processing delays  
D) The fuzzy match threshold is set too high, rejecting valid matches  

**Answer: B**
Identity Resolution uses email, phone, and other contact points to match Individual records across sources. If the ContactPointEmail and ContactPointPhone DMOs are empty (because field mappings weren't configured to populate these objects), the IR process has no basis for matching records — each source Individual stands alone as its own Unified Individual. This is the most common cause of low IR match rates.

---

**Question 3:** A financial services firm wants to use Data Cloud to identify clients who hold only savings accounts but not investment products, for a cross-sell campaign. The firm has regulatory requirements to keep banking and investment data strictly separated. Which Data Cloud feature should the consultant configure first?

A) Two separate Activation Targets — one for banking and one for investments  
B) A single Calculated Insight joining banking and investment DMOs  
C) Two separate Data Spaces with access controls, then a cross-product segment where cross-sell analysis is permitted  
D) Two separate Connected Apps with different permission sets for each product line  

**Answer: C**
Data Spaces provide the regulatory separation required — banking data and investment data are isolated in separate Data Spaces with access controls by role. Cross-product analysis (identifying clients who have one product but not another) requires a segment that spans appropriate Data Spaces, which can be permitted for analysts who have cross-product access. Data Spaces are the correct governance feature for this regulatory requirement.
