# Lab 01: Schema Design

## Lab Overview

**Domain**: Master Data Management / Data Modeling  
**Estimated Time**: 90 minutes  
**Level**: Architect  
**Format**: Design exercise — produce architecture decisions and justifications (no coding required)

---

## Business Scenario

**Company**: MedEquip Global — a medical device manufacturer with global operations in 45 countries.

**Current State**:
- 12 years of data in a legacy CRM (Microsoft Dynamics)
- 85,000 Accounts (mix of hospitals, clinics, distributors, and individual practitioners)
- 240,000 Contacts across those accounts
- 15 different legal entities (subsidiaries)
- Data siloed by country — US, EU, and APAC orgs operate independently
- No consistent data model — each country has built their own custom fields

**Migration Target**: One Salesforce org for all entities (single-org global strategy)

**Key Business Requirements**:
1. A Hospital can have multiple Clinics (child facilities). A Clinic can be associated with multiple Hospitals (academic medical centers work with multiple systems).
2. An individual Practitioner (doctor) works at multiple Clinics and potentially multiple Hospitals simultaneously.
3. Each Sales Rep must see only Accounts in their assigned Territory. Managers see all accounts in their territory hierarchy.
4. Some accounts are "Key Accounts" with specialized relationship management — these have additional required fields not applicable to standard accounts.
5. All data for EU-resident contacts must be stored with GDPR consent tracking.
6. The data team needs to sync Account and Contact data to a Snowflake data warehouse in near-real-time.

---

## Lab Exercises

### Exercise 1: Account Object Design (25 points)

**Task**: Design the Account object model for MedEquip Global.

**Decisions to make and justify**:

1a. **Account hierarchy design**: How should the Hospital → Clinic → Practitioner hierarchy be modeled? Consider:
- Hospital and Clinic are organizations (company-type Accounts)
- Practitioners are individuals (person-type Accounts or Contact records)
- A Clinic can belong to multiple Hospitals

What combination of standard Salesforce objects and relationships achieves this?

**Model Answer**:
Use Account for Hospitals and Clinics with the standard `ParentId` self-lookup for the primary Hospital → Clinic hierarchy. For the many-to-many Hospital-Clinic relationship (a Clinic in an academic system belongs to multiple Hospitals), create a junction object `Account_Affiliation__c` with lookup relationships to both Account records. For Practitioners:
- If the org is B2B-focused: use Contact records associated to the primary Account (Clinic), with AccountContactRelation (ACR) for the many-to-many affiliation to multiple clinics/hospitals
- If Person Accounts are appropriate (B2C-like practitioner relationships): use Person Accounts for practitioners

**Record Types**:
- Account: Hospital, Clinic, Distributor, Legal Entity
- Contact: Practitioner, Administrative, Purchasing

1b. **Key Account differentiation**: Should Key Accounts be a Record Type or a separate object?

**Model Answer**: Record Type on Account. Key Accounts share the same data model as standard Accounts but require additional fields (Account Manager lookup, Exec Sponsor lookup, QBR Date, Strategic Priority). A Record Type with a different page layout handles this without creating a parallel object model.

---

### Exercise 2: Relationship Architecture (25 points)

**Task**: Document all object relationships with relationship type, cardinality, and justification.

| Object A | Relationship | Object B | Type | Justification |
|---|---|---|---|---|
| Hospital (Account) | ParentId | Clinic (Account) | Self-lookup | Primary hierarchy |
| Account | Junction | Account | `Account_Affiliation__c` with lookups | Many-to-many for multi-system clinics |
| Contact (Practitioner) | `AccountContactRelation` | Account (Hospital/Clinic) | Standard M:M | Multi-affiliation |
| Contact | Lookup | Account (Primary) | Standard lookup | Primary association |
| Opportunity | Lookup | Account | Standard lookup | Standard SF model |
| GDPR_Consent__c | Master-Detail | Contact | M-D | Consent records owned by Contact |

**Review Questions for Exercise 2**:

2a. Why is `Account_Affiliation__c` a lookup (not master-detail) on both sides?
- Because neither Account is the "owner" of the affiliation — both are equal parties
- Deleting one Account should not cascade-delete the affiliation relationship record
- Independent sharing: the affiliation record may need independent visibility rules

2b. Why is `GDPR_Consent__c` a master-detail to Contact?
- Consent records have no meaning without the Contact — they should not exist independently
- Roll-up summary can count active consents on Contact
- Cascade delete: when a Contact is erased (GDPR), consent records are automatically deleted

---

### Exercise 3: Field Architecture (20 points)

**Task**: Design the field strategy for the Account "Hospital" Record Type.

**Required fields**: Account Name, Account Type, Primary Country, Primary Language, Legal Entity (lookup to a custom `Legal_Entity__c` object), Tier Classification

**Design Decisions**:

3a. **Tier Classification**: Should this be a custom formula field, a custom picklist field, or a custom metadata-driven calculated field?

**Model Answer**: A stored custom picklist field (Global Picklist if "Tier" is also used on Opportunities and Contacts). NOT a formula field — formula fields cannot be indexed, and Tier will be a primary filter in reports and queries at high volume. A Flow trigger populates the Tier field based on business rules when key attributes change.

3b. **Primary Country**: Should this be a text field or a picklist?

**Model Answer**: Global Picklist using ISO 3166 country codes. Standardized vocabulary enables consistent reporting, integration mapping, and data residency policy enforcement. Free text fields for country are a known data quality failure point.

3c. **Legal Entity Lookup**: What are the indexing implications?

**Model Answer**: Lookup relationships are automatically indexed. No custom index needed. However, queries that filter by Legal_Entity__c will be selective if each legal entity has < 10% of total records. For 15 legal entities across 85,000 accounts, average = ~5,600 per entity — well below selectivity threshold. The index will be used effectively.

---

### Exercise 4: Security and Sharing Design (20 points)

**Task**: Design the sharing model for the Account object.

**Requirements**:
- Sales reps see only accounts in their assigned territory
- Managers see all accounts in their territory hierarchy
- Account executives (key account managers) must be able to collaborate with colleagues on key accounts
- Integration users must have read access to all accounts for the Snowflake sync

**Design Answer**:

**OWD for Account**: Private (reps cannot see accounts outside their territory by default)

**Territory Management**: Enable Salesforce Territory Management (Enterprise Territory Management for Enterprise/Unlimited editions). Create a territory hierarchy mirroring MedEquip's sales org. Assign Accounts to territories. Assign Users to territories with access levels (Read/Read-Write).

**Key Account sharing**: Use Account Teams on Key Accounts. The account manager adds team members with appropriate access levels. This is record-by-record sharing — appropriate for a small population of Key Accounts.

**Integration user access**: Grant "View All" on Account ONLY to the dedicated integration user profile. This is the only acceptable use case for View All — a dedicated system user that needs to read all records for synchronization purposes.

4a. **Why not use Public Read/Write OWD?**
With Private OWD, only territory-assigned users see accounts. Public Read/Write would allow every rep to see every account globally — which violates the territory-based visibility requirement.

4b. **Why Territory Management over sharing rules?**
Territory Management provides a maintainable, hierarchical assignment model that scales with the sales organization. Criteria-based sharing rules (e.g., share all US accounts with US reps) do not scale to 45-country complexity and have a 50-rule-per-object limit.

---

### Exercise 5: Data Warehouse Integration Design (10 points)

**Task**: Design the real-time sync of Account and Contact to Snowflake.

**Decision**: CDC (Change Data Capture) or polling?

**Model Answer**: CDC.
- Enable CDC on Account and Contact objects
- MuleSoft subscribes to AccountChangeEvent and ContactChangeEvent via CometD
- MuleSoft transforms CDC events to Snowflake schema
- Snowflake upserts records using the Salesforce Account/Contact ID as the primary key

**Why not polling?**
- Polling every 5 minutes consumes 12 API calls per hour per object = 24 API calls/hour for 2 objects. At 24 * 24 = 576 API calls/day just for polling, even when nothing changed
- CDC is near-real-time (seconds vs. minutes)
- CDC captures deletes; polling cannot detect deleted records
- CDC replay window provides resilience for MuleSoft downtime up to 72 hours

---

## Deliverables

Produce a one-page Architecture Decision Record (ADR) for this engagement documenting:

1. Account object design choice and justification
2. Relationship architecture diagram (draw in Mermaid or ASCII)
3. Field architecture decisions for Tier, Country, and Legal Entity
4. Sharing model design and rationale
5. Data warehouse integration pattern and rationale

---

## PTA Advisory Note

When presenting a schema design like this in a real engagement, structure the conversation as:
- **What I decided and why** (not just what I decided)
- **What I considered but ruled out** (shows rigor)
- **What constraints drove the decision** (performance, limits, scale)
- **What risks remain** (nothing is perfect — acknowledge tradeoffs)

Customers with sophisticated IT teams respond well to architects who acknowledge limitations and explain tradeoffs explicitly. "This is the best available option given X, Y, Z constraints" is more credible than "this is the right way."
