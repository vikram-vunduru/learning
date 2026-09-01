# Data 360 Consultant Cheat Sheet (CRT-251)

## Exam Quick Facts
- **Exam code:** CRT-251
- **Questions:** 60 | **Time:** 105 min | **Pass:** 67% (~40/60) | **Fee:** $200

---

## Architecture Flow (Memorize This)

```
Source Systems
    ↓ [Data Stream = pipeline config]
Data Lake Objects (DLO) — raw, unchanged source data
    ↓ [Field Mapping = translate DLO fields → DMO fields]
Data Model Objects (DMO) — standardized, modeled data
    ↓ [Identity Resolution = match + merge]
Unified Individual — single resolved profile per customer
    ↓ [Segment Builder]
Segments — filtered subsets of Unified Individuals
    ↓ [Activation Target]
Destinations (CRM, MC, Facebook, Google)
```

**Calculated Insights** plug in between DMO and Segment — they aggregate DMO data and the results are used as segment criteria.

---

## Key Term Definitions

| Term | One-Line Definition |
|---|---|
| Data Stream | Pipeline config object that ingests data from a source into a DLO |
| DLO (Data Lake Object) | Raw storage; mirrors source structure exactly; auto-created by Data Stream |
| DMO (Data Model Object) | Standardized schema object; used for IR, segmentation, activation |
| Field Mapping | Configuration connecting DLO fields to DMO fields |
| Identity Resolution | Process matching Individual records across sources → Unified Individual |
| Unified Individual | Merged, resolved customer profile; output of Identity Resolution |
| Segment | Filtered subset of Unified Individuals matching specific criteria |
| Calculated Insight | SQL-based pre-computed aggregate metric (per customer) |
| Activation Target | Configured destination for publishing segments (CRM, MC, Ad platforms) |
| Data Space | Logical partition in Data Cloud for data access isolation |
| Grounding | Providing Agentforce with unified customer context from Data Cloud to personalize responses |

---

## Connector Quick Reference

| Scenario | Connector |
|---|---|
| Salesforce CRM objects (Contacts, Accounts) | Salesforce Connector |
| Files in Amazon S3 / GCS / Azure Blob | Cloud Storage Connector |
| Real-time web/app events (streaming) | Ingestion API (OAuth 2.0 / Connected App) |
| Marketing Cloud subscriber/engagement data | Marketing Cloud Connector |
| Any system connected via MuleSoft | MuleSoft Connector |

**Key:** Ingestion API uses **OAuth 2.0 Client Credentials via Connected App** — not username/password.

**Supported file formats:** CSV, JSON, Parquet — **NOT** Excel (.xlsx)

**Batch schedule options:** 1h, 6h, 12h, 24h (no custom intervals)

---

## Standard DMOs — Critical List

| DMO | Contains | Key for |
|---|---|---|
| Individual | Person profile (Name, DOB, Address) | Identity Resolution INPUT |
| Contact Point Email | Email addresses + HasOptedOutOfEmail | Identity Resolution MATCHING |
| Contact Point Phone | Phone numbers + SMS opt-out | Identity Resolution MATCHING |
| Unified Individual | Merged profile — all sources | Segmentation, Activation |
| Sales Order | Transaction header | Purchase segments |
| Sales Order Product | Line items/products | Product-level segments |
| Web Engagement | Clickstream/behavioral events | Behavior segments |
| Email Engagement | MC email open/click events | Campaign engagement |

**Never create a custom "Person" DMO** — always use standard Individual. Custom person DMOs break Identity Resolution.

---

## Identity Resolution Rules

### Match Rule Types
| Type | Use When |
|---|---|
| Exact Match | High-confidence IDs (email, phone, loyalty ID) |
| Fuzzy Match | Name fields with variations/typos |
| Normalized Match | Same data, different formatting (phone formats, name salutations) |

### Fuzzy Match Threshold
- **Higher threshold** = fewer false positives, more false negatives (misses real duplicates)
- **Lower threshold** = more matches, higher false positive risk (wrong merges)

### Reconciliation Strategies
| Strategy | When to Use |
|---|---|
| Source Priority | You trust one source more than others for a field |
| Most Occurred | Trust the majority — value that appears in most sources |
| Most Recent | Trust the latest update — use for frequently changing data |

### Critical IR Fact
**Identity Resolution uses Contact Point DMOs for matching** — NOT the email field on Individual. If Contact Point Email isn't populated, email matching won't work.

---

## Calculated Insights — SQL Syntax

```sql
SELECT
    i.Id AS IndividualId,           -- DIMENSION (GROUP BY field)
    COUNT(so.Id) AS TotalOrders,    -- MEASURE
    SUM(so.TotalAmount) AS TotalRev, -- MEASURE
    MAX(so.OrderDate) AS LastOrder  -- MEASURE (date)
FROM Individual__dlm AS i           -- Note: __dlm suffix required
JOIN SalesOrder__dlm AS so
    ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
GROUP BY i.Id
```

**Rules:**
- DMO API names use `__dlm` suffix
- Must have GROUP BY (defines dimension — usually IndividualId)
- CIs can only reference **DMO data** (not DLOs)
- Refresh order: **Data Stream → DMO → CI → Segment**

---

## Segment Criteria Decision Tree

```
Business Need → Criteria Type
───────────────────────────────────────────
Profile attribute (tier, city, age)  → Attribute Filter
Related transaction/event            → Related Attribute Filter
Aggregate metric (total spend)       → Calculated Insight
2-hop data (product in order)        → Indirect Relationship Filter (max 2 hops)
```

**Segment refresh:** 12h or 24h schedule options  
**Segments must be PUBLISHED** (not Draft) before activation  
**Always include** HasOptedOutOfEmail exclusion in email-targeted segments

---

## Activation Quick Reference

| Target Type | Key Config | Data Sent |
|---|---|---|
| Salesforce CRM | Connected Org, Campaign | Campaign Member records |
| Marketing Cloud | MC Connector, Subscriber Key mapping | Data Extension rows |
| Facebook / Google / LinkedIn | OAuth to ad account | SHA-256 hashed emails/phones |

**Activation membership < Segment membership** = some members have no valid contact point or have opted out. This is expected behavior, not an error.

**One segment → multiple Activation Targets** simultaneously. No need for separate segments.

---

## Permission Sets

| Permission Set | Who Uses It |
|---|---|
| Data Cloud Admin | Implementation consultant, system admin — full access |
| Data Cloud Data Aware Specialist | Marketing analyst — creates segments, CIs, activation targets |
| Data Cloud Marketing Specialist | Read-only marketing reporting |
| Data Cloud for Marketing Cloud | MC integration user |

**Least privilege principle:** Don't give everyone Data Cloud Admin.

---

## Data Spaces

- **Logical** partitions (not physical database isolation)
- Users can only see objects in Data Spaces they have access to
- Use for: department isolation (Marketing vs. Finance), dev vs. prod separation
- Activation Target creation is Admin-only (governance safeguard)

---

## Job Refresh Order (Critical)

```
1. Data Stream refresh → updates DLO + DMO
2. CI refresh → computes metrics from DMO (must run AFTER step 1)
3. Segment refresh → applies CI values to filter Unified Individuals
4. Activation publish → sends segment members to destination
```

Use **Job Scheduler job chaining** to enforce this order.

---

## Consent Fields Quick Reference

| Field | DMO | Regulation | Meaning |
|---|---|---|---|
| HasOptedOutOfEmail | Contact Point Email | CAN-SPAM / GDPR | Email opt-out |
| HasSmsOptedOut | Contact Point Phone | TCPA | SMS opt-out |
| DoNotProcess | Individual | GDPR | Right to erasure |
| HasOptedOutOfSharing | Individual | CCPA | Opt out of data sharing/sale |
| DoNotTrack | Individual | CCPA/ePrivacy | Behavioral tracking opt-out |

**Consent ingestion best practice:** Use Ingestion API **streaming** to minimize opt-out processing lag.

---

## Analytics Integration

| Tool | Connection | Data Available |
|---|---|---|
| Tableau | Tableau Data Cloud Connector, OAuth 2.0 | DMOs, CIs (NOT DLOs) |
| CRM Analytics | Analytics Studio connector | DMOs, CIs, Segment membership |

**Performance tip:** Use Calculated Insights (pre-aggregated) as analytics source instead of live queries on large transaction DMOs.

---

## AI / Agentforce Integration

- **Grounding** = AI retrieving customer context from Data Cloud before generating a response
- **Vector database** = enables semantic search over unstructured content (not keyword-based)
- **Model Builder** = trains custom ML models on DMO/CI data; predictions stored back in Data Cloud
- AI quality depends directly on IR quality — poor Unified Profiles → poor AI personalization
- Always respect consent when using customer data for AI grounding

---

## Most Common Exam Traps

1. **"Segment by email" → must map to Contact Point Email DMO**, not Individual email field
2. **Custom person DMO instead of Individual DMO** → breaks Identity Resolution
3. **DLOs accessible in Segment Builder** → FALSE — only DMOs/CIs
4. **Segment Draft instead of Published** → Draft segments cannot be activated
5. **CI refresh before Data Stream** → CI computes against stale data
6. **"Real-time" → Ingestion API**, not 1-hour batch
7. **Segment size = Activation size** → FALSE — consent/contact point filtering reduces activation count
8. **One Activation Target per segment** → FALSE — one segment can activate to multiple targets
9. **Data Spaces = physical isolation** → FALSE — logical access boundary only
10. **Reconciliation rules apply to Contact Points** → FALSE — Contact Points are additive; reconciliation applies to Individual attributes

---

## Scenario Question Formula

```
1. Extract the CORE technical requirement from the business narrative
2. Map to the pipeline layer: Ingestion / Modeling / IR / Segment / Activation / Governance
3. Match to the correct feature for that layer
4. Use known constraints to eliminate wrong answers
```

**When in doubt:** Remember that Data Cloud follows the left-to-right flow from Sources → Activation, and every problem is a failure at one specific step in that pipeline.

---

## Topic Weight Reminder

| Domain | Weight | Questions |
|---|---|---|
| Use Cases & Business Value | 17% | ~10 |
| Data Ingestion | 17% | ~10 |
| Data Modeling & Identity Resolution | 17% | ~10 |
| Data Cloud Fundamentals | 13% | ~8 |
| Administration & Governance | 13% | ~8 |
| Segmentation & Insights | 13% | ~8 |
| Activation & Engagement | 10% | ~6 |
