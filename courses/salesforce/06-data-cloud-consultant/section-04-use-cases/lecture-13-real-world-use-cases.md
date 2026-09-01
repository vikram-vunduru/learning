# Lecture 13: Real-World Use Cases & Scenario Questions

## Learning Objectives
- Apply Data Cloud knowledge to real-world industry scenarios in retail, financial services, and healthcare
- Identify the correct Data Cloud features for common business requirements presented in scenario format
- Recognize common exam scenario patterns and apply a structured decision framework
- Avoid common traps in scenario questions on the Data Cloud Consultant exam

---

## Slides

### Slide 1: Exam Scenario Question Strategy
**Visual:** A four-step decision flowchart: (1) Identify the business requirement. (2) Map to a Data Cloud layer (ingestion/modeling/IR/segmentation/activation/governance). (3) Identify the correct feature for that layer. (4) Eliminate wrong answers using known constraints.

**Content:**
- 17% of the exam = Use Cases & Business Value domain
- Scenario questions describe a business situation and ask what to implement
- **Step 1:** Extract the core requirement — what outcome does the business need?
- **Step 2:** Map to the Data Cloud pipeline layer where this would be solved
- **Step 3:** Identify the specific feature that addresses it
- **Step 4:** Use constraints (e.g., "DLOs can't be segmented") to eliminate wrong answers
- **Red herrings:** scenario details that sound relevant but aren't (e.g., company size, industry)

**Speaker Notes:** Use case questions are the most business-context-heavy part of the exam. The candidates who struggle with these questions usually try to answer them with intuition rather than a systematic approach. The four-step framework cuts through the narrative to find the technical requirement hidden in the scenario. The key skill is extraction: "A retail company wants to send personalized abandoned cart emails based on the customer's browsing history across all channels" → the core requirement is cross-channel behavioral data unified to power personalized email. Map that to: streaming ingestion (behavioral data), Unified Individual (cross-channel unification), CI (cart abandonment metric), segment (high-value abandoners), MC activation (email). Then the answer becomes choosing the right piece from that chain.

---

### Slide 2: Retail Use Case — Unified Customer Profile
**Visual:** A retail company scenario card: "RetailCo operates 500 stores, a website, and a mobile app. Customer data is fragmented across a POS system, e-commerce platform, and loyalty program. Customer service reps have incomplete customer views."

**Content:**
- **Business problem:** Fragmented customer data; CSRs can't see full purchase history; marketing sends irrelevant campaigns
- **Data Cloud solution architecture:**
  - POS exports → S3 Connector Data Stream → Transaction DMO
  - E-commerce events → Ingestion API → Web Engagement DMO
  - Loyalty data → Salesforce Connector (if loyalty is in CRM) → Individual DMO
  - Identity Resolution → matches records by email/loyalty ID → Unified Individual
  - CRM Analytics → embed unified profile in Service Cloud case page
- **Key exam question type:** "Which connector should RetailCo use for nightly POS transaction exports in CSV format?" → S3 Cloud Storage Connector

**Speaker Notes:** The retail unified profile scenario is the most common use case on the exam. Know the typical data sources (POS, e-commerce, loyalty, web) and their corresponding connector types. The scenario will test you on connector selection, DMO mapping choices, and how the Unified Individual is used. A key scenario variant: "RetailCo wants to identify high-value customers who haven't purchased in 60 days" — this requires a CI for days-since-last-purchase and a segment filtering on that CI. Another variant: "RetailCo wants to send personalized email campaigns based on product affinity" — this requires product category data from transaction DMO, a CI for product affinity by category, and a Marketing Cloud Activation Target.

---

### Slide 3: Retail Use Case — Segment Scenarios
**Visual:** Three segment scenario cards: (1) "Re-engagement: No purchase in 60 days." (2) "High-value: TotalSpend90d > $1000 AND LoyaltyTier = Gold." (3) "Abandoned cart: Has web session event with product view but no purchase in last 24 hours."

**Content:**
- **Re-engagement segment:**
  - CI: DaysSinceLastPurchase (MAX of OrderDate subtracted from today)
  - Segment filter: DaysSinceLastPurchase between 60 and 90 days
- **High-value loyalty segment:**
  - CI: TotalSpend90d (SUM of orders in last 90 days)
  - Attribute filter: LoyaltyTier = "Gold"
  - Combined: TotalSpend90d > $1000 AND LoyaltyTier = Gold
- **Abandoned cart segment:**
  - Related attribute filter: Has Web Engagement event (type=ProductView) in last 24 hours
  - Exclusion: Has Sales Order in last 24 hours (completed purchase)
- All three activate to Marketing Cloud for triggered email campaigns

**Speaker Notes:** These three segment patterns are the most commonly tested in retail scenarios. The exam will give you the business requirement and ask which type of segment criteria to use. Re-engagement → CI (DaysSinceLastPurchase). High-value → CI (TotalSpend) + attribute filter. Abandoned cart → related attribute filter (Web Engagement) + exclusion (Sales Order). The abandoned cart scenario is often tested because it combines an inclusion filter (Web Engagement events) with an exclusion (Sales Order) — the "no purchase" part requires the exclusion. Understanding the difference between a related attribute inclusion filter and an exclusion is key.

---

### Slide 4: Financial Services Use Case — 360-Degree View
**Visual:** A financial services scenario card: "BankCo has retail banking, investment accounts, and mortgage products in three separate systems. Relationship managers have no cross-product view. A customer might be a high-value investment client and a high-default-risk mortgage client simultaneously."

**Content:**
- **Business problem:** Cross-product relationship visibility; risk assessment requires complete customer picture; personalized product recommendations
- **Data Cloud solution:**
  - Three source systems → three Salesforce Connectors (or custom connectors)
  - Custom DMOs: BankAccount, InvestmentAccount, MortgageApplication
  - Identity Resolution: match records across systems by SSN (exact match), name+address (normalized match)
  - CIs: TotalAUM, TotalLiabilities, RelationshipProfitability
  - Tableau/CRM Analytics: Relationship Manager dashboard embedded in Account record
- **Governance consideration:** strict Data Space isolation — Investment data visible only to Investment advisors

**Speaker Notes:** Financial services use cases are common on the exam because they illustrate the governance requirements that come with sensitive financial data. The key exam points: custom DMOs are needed because Salesforce doesn't have standard DMOs for financial products like investment accounts or mortgages. Identity Resolution in financial services typically uses SSN (exact match — high confidence identifier) combined with normalized name/address matching. The governance requirement of restricting investment data to authorized advisors uses Data Spaces. An exam scenario might ask: "How should the consultant ensure loan officers can't see investment account data?" → Create a separate Data Space for investment data and only grant Investment advisor permission sets access to it.

---

### Slide 5: Financial Services — Consent & Compliance
**Visual:** A compliance-focused scenario card showing: a customer's data flowing through Data Cloud with consent checks at each stage — ingestion consent filter, segment consent exclusion, activation consent verification.

**Content:**
- **Regulatory requirements for financial services:**
  - GDPR (EU customers): lawful basis required; consent for marketing
  - CCPA (US-California customers): opt-out of data sharing
  - FINRA/SEC: data retention and audit trail requirements
  - GLBA: data security and notice requirements
- **Data Cloud consent configuration:**
  - HasOptedOutOfSharing = true for CCPA opt-out customers → exclude from third-party activations
  - DoNotProcess = true for GDPR erasure requests
  - Data Use Purpose objects documenting lawful basis
  - Audit-ready job logs in Admin UI

**Speaker Notes:** Financial services consent questions often test the intersection of regulatory requirements and specific Data Cloud fields. The CCPA opt-out → HasOptedOutOfSharing mapping is the most commonly tested. A scenario: "A California customer submitted a CCPA opt-out request. Which Data Cloud action is required?" → Set HasOptedOutOfSharing = true on the Individual DMO AND exclude them from any activation targets that share data with third parties. GDPR erasure is more comprehensive: DoNotProcess flag PLUS eventual data deletion from the DLO/DMO. The exam doesn't require you to know financial regulations in detail — just the Data Cloud field mappings.

---

### Slide 6: Healthcare Use Case — Consent-Driven Data Usage
**Visual:** A healthcare scenario card: "HealthCo needs to identify patients missing preventive care screenings. Patient records exist in EHR, claims system, and appointment scheduling. Must comply with HIPAA."

**Content:**
- **Business problem:** Care gap identification; fragmented patient records; need to reach patients for care coordination
- **Data Cloud considerations:**
  - HIPAA compliance requires contractual BAA with Salesforce (available for Healthcare org)
  - Patient records → Individual DMO (mapped from EHR and claims system via Ingestion API)
  - Consent: must have patient consent for communication — mapped from consent management system
  - CI: DaysSinceLastScreening (per screening type), CaregapScore
  - Segment: Patients with DaysSinceLastScreening > 365 AND HasConsentForCommunication = true
  - Activation: Salesforce Health Cloud or Marketing Cloud for outreach

**Speaker Notes:** Healthcare is a specialized vertical that introduces HIPAA as an additional compliance consideration. The exam won't test detailed HIPAA knowledge, but it does test that: (1) Salesforce Data Cloud can be used for healthcare with a BAA (Business Associate Agreement) in place, (2) patient consent is mandatory for any outreach, and (3) the segment must include consent validation. The care gap use case is commonly mentioned in Salesforce's own Data Cloud marketing materials — identifying patients missing preventive screenings is a high-value healthcare use case that improves patient outcomes. The exam might ask: "What must the consultant verify before activating the care gap segment to a communication platform?" → Verify consent status for each patient is captured and the segment excludes patients without communication consent.

---

### Slide 7: Common Exam Scenario Traps
**Visual:** A "Warning" card with six trap scenarios listed as "If you see X, don't do Y."

**Content:**
- **Trap 1:** "Real-time" → Don't choose a 24-hour batch connector; use Ingestion API streaming
- **Trap 2:** "Segment isn't showing recent data" → Check the CI refresh schedule, not just the Data Stream
- **Trap 3:** "Identity Resolution not merging records" → Check Contact Point DMO mapping, not just match rules
- **Trap 4:** "Segment size is smaller than expected after activation" → Check contact point filters and consent exclusions, not the segment criteria itself
- **Trap 5:** "Need to store a person record" → Use Individual DMO, not a custom person DMO
- **Trap 6:** "Access to all Data Cloud" → Don't assign Data Cloud Admin to everyone; use least-privilege permission sets

**Speaker Notes:** These six traps are worth memorizing. They represent the most common patterns where the "obvious" answer is wrong. Real-time always points to streaming/Ingestion API. Stale segments after a CI refresh issue point to the scheduling dependency chain. IR not merging often isn't a match rule problem but a DMO population problem. Segment size discrepancies at activation are almost always contact points or consent, not segment logic. Custom person DMOs break IR. Admin permissions for everyone is a governance anti-pattern. For each of these, the wrong answer is plausible but incorrect — they're designed to catch candidates who understand the concept partially but not fully.

---

### Slide 8: Exam Scenario Decision Framework
**Visual:** A two-page reference guide layout with two sections: "Connector Selection Guide" (left) and "Segment Criteria Selection Guide" (right).

**Content:**
- **Connector Selection:**
  - CRM data → Salesforce Connector
  - Files in S3/GCS/Azure → Cloud Storage Connector
  - Real-time events → Ingestion API
  - Marketing Cloud → MC Connector
  - Legacy system with MuleSoft → MuleSoft Connector
- **Segment Criteria Selection:**
  - Profile attribute → Attribute Filter
  - Related transaction/event → Related Attribute Filter
  - Aggregate metric → Calculated Insight
  - Multi-hop product/category → Indirect Relationship Filter
- **Access Control Decision:**
  - Different data for different teams → Data Spaces
  - Feature-level access → Permission Sets

**Speaker Notes:** This framework summarizes the decision trees that appear in almost every Use Cases scenario question. The exam isn't asking you to be creative — it's testing whether you can match a business requirement to the correct Data Cloud feature. When you see a scenario, extract the data flow requirements and apply this framework. Connector Selection and Segment Criteria Selection are tested in the highest volume of questions. The Access Control decision (Data Spaces vs. Permission Sets) appears in governance scenarios. Printing this framework on a mental notecard and applying it to every scenario question will improve your score significantly.

---

## Recording Script

Welcome to Lecture 13, the final lecture of Section 4 and the last content lecture in this course. This lecture is different — instead of introducing new features, we're focusing on how to apply everything you've learned to the scenario questions that make up 17% of the exam.

Use case scenario questions work like this: Salesforce describes a business situation — a retail company, a bank, a healthcare provider — and asks which Data Cloud feature or configuration addresses it. The challenge is that the scenarios are often long and full of business context, and you need to extract the technical requirement buried inside all that narrative.

Let's practice the framework. Scenario: "A luxury retailer wants to send personalized anniversary messages to customers on the one-year anniversary of their first purchase." Let's extract the requirement: we need to know each customer's first purchase date. That's a CI using MIN(OrderDate). The segment filter would be "DaysSinceFirstPurchase equals 365" — derived from that CI. The activation goes to Marketing Cloud for the personalized email. The framework gives us CI → Segment → MC Activation.

Another scenario: "A bank needs to ensure that customers who have opted out of data sharing under CCPA are excluded from any third-party advertising activation." Extract: CCPA opt-out should block third-party activation. The specific field is HasOptedOutOfSharing = true on Individual. The segment exclusion filters on this field. The activation target for advertising platforms includes this exclusion.

The traps: Know that "real-time" means Ingestion API, not a 1-hour batch. Know that Identity Resolution not working usually means Contact Point DMOs aren't mapped, not that match rules are wrong. Know that segment membership smaller than expected at activation usually means contact point or consent filtering, not segment criteria.

Healthcare adds HIPAA — know that a BAA must be in place and patient consent is mandatory before any outreach.

Financial services adds strict governance — Data Spaces for cross-product data isolation, SSN for high-confidence IR matching.

You've now covered all 13 lectures and every exam domain. Next up: the 60-question practice exam and the cheat sheet. Good luck.

---

## Exam Tips

- Use a decision framework for scenario questions: identify the requirement → map to Data Cloud layer → identify the feature → eliminate wrong answers
- "Real-time" in a scenario almost always means **Ingestion API streaming**, not a scheduled batch connector
- Segment size discrepancy at activation = check **contact points** and **consent exclusions**, not segment criteria
- Identity Resolution not producing Unified Individuals = check **Contact Point DMO mapping** before reviewing match rules
- In healthcare scenarios: always verify **patient consent** is captured AND included as a segment filter before activation

---

## Lecture Summary

Use case scenario questions require a structured decision framework: extract the business requirement, map it to the correct Data Cloud pipeline layer, identify the specific feature, and eliminate wrong answers using known constraints. Retail scenarios typically involve unified profiles from POS/e-commerce/loyalty sources, re-engagement and high-value segments using CIs, and Marketing Cloud activation. Financial services scenarios emphasize cross-product identity resolution using high-confidence identifiers (SSN), custom DMOs for financial products, Data Space governance, and CCPA/GDPR consent compliance. Healthcare scenarios require patient consent validation before any activation and HIPAA-compliant Data Cloud configuration. Common exam traps include confusing batch connectors for real-time requirements, treating activation membership discrepancies as segment logic issues, and creating custom person DMOs instead of using the standard Individual DMO.

---

## Mini Quiz

**Question 1:** A national insurance company wants to identify customers who have both an active homeowners policy AND an active auto policy, and have never received a bundle discount offer. The policy data is stored in two separate custom DMOs: HomePolicy and AutoPolicy. Which segment criteria approach should the consultant use?

A) Two separate attribute filters on Unified Individual  
B) Two related attribute filters (one for HomePolicy, one for AutoPolicy) combined with an exclusion filter for prior bundle offers  
C) A Calculated Insight that counts active policies  
D) An indirect relationship filter traversing from HomePolicy through AutoPolicy  

**Answer: B**
HomePolicy and AutoPolicy are separate DMOs related to the Individual, not fields on the Individual itself. Two related attribute filters — one checking "has at least one active HomePolicy" and one checking "has at least one active AutoPolicy" — with an exclusion for prior bundle offer contacts gives the correct segment. A CI counting policies could also work but would require additional design; the related attribute filter approach is more direct.

---

**Question 2:** A healthcare organization's care coordinator wants to reach out to patients who haven't had a flu vaccination in over a year. Which of the following segment configurations is REQUIRED for HIPAA-compliant outreach activation?

A) Include only patients whose vaccination record is in the EHR Data Stream  
B) Include only patients who have given explicit consent for care coordination communications  
C) Include only patients currently enrolled in an insurance plan  
D) Include only patients whose physician has been notified  

**Answer: B**
For HIPAA-compliant patient outreach, explicit patient consent for communications is mandatory. The segment must include a consent filter — only including patients who have consented to care coordination communications (captured via the consent management system and ingested into Data Cloud). Without this consent filter, reaching out to patients would violate HIPAA communication requirements.

---

**Question 3:** An e-commerce company needs to activate a segment of high-value customers to three destinations simultaneously: a Facebook Custom Audience (for ad suppression), a Marketing Cloud journey (for email), and a Salesforce CRM Campaign (for account manager follow-up). What is the correct Data Cloud configuration?

A) Create three separate segments, one for each destination  
B) Create one segment and configure three separate Activation Targets, each pointing to a different destination  
C) Create one Activation Target with three connected systems  
D) Activate to Marketing Cloud only, then use MC to trigger CRM and Facebook  

**Answer: B**
In Data Cloud, one Published segment can be connected to multiple Activation Targets simultaneously. Configure three Activation Targets (Facebook Ads, Marketing Cloud, Salesforce CRM) and add the single segment to all three. Each activation target handles its own channel-specific configuration (hashed emails for Facebook, Subscriber Key mapping for MC, Campaign Member creation for CRM).
