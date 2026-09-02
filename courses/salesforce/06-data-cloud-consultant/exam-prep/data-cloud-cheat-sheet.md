# Data 360 Consultant Cheat Sheet (CRT-251)
## Salesforce Certified Data 360 Consultant — Personal Study Reference

### Exam Quick Facts
- **Exam code:** CRT-251 | **Full name:** Salesforce Certified Data 360 Consultant
- **Rename history:** Customer 360 Audiences → Salesforce CDP → Salesforce Data Cloud → "Data 360 Consultant" (2024)
- **Questions:** 60 | **Time:** 105 min | **Pass:** 67% (~40/60) | **Fee:** $200
- **Highest-weight domains:** Use Cases, Data Ingestion, Data Modeling & IR — 17% each

---

## Architecture Flow — The Pipeline (Memorize This First)

```
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  SOURCE SYSTEMS                                                          ║
  ║  CRM ─── S3/GCS ─── Ingestion API ─── MC Connector ─── MuleSoft        ║
  ╚═══════════════════════════╤══════════════════════════════════════════════╝
                              │  DATA STREAM (pipeline config)
                              ▼
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  DATA LAKE OBJECTS (DLO)                                                 ║
  ║  Raw, unchanged source data. Auto-created by Data Streams.               ║
  ║  NOT visible in Segment Builder. NOT queryable by Tableau.               ║
  ╚═══════════════════════════╤══════════════════════════════════════════════╝
                              │  FIELD MAPPING (DLO field → DMO field)
                              ▼
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  DATA MODEL OBJECTS (DMO)                                                ║
  ║  Standardized schema. Individual + Contact Points + Sales Order etc.     ║
  ║  Source for IR, CI, Segmentation, Analytics.                             ║
  ╚═══════════════════════════╤══════════════════════════════════════════════╝
                              │  IDENTITY RESOLUTION
                              ▼
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  UNIFIED INDIVIDUAL                                                      ║
  ║  Merged, de-duplicated profile. Reconciled attributes + additive CPs.    ║
  ║  Grain for all segmentation and activation.                              ║
  ╚═══════════════════════════╤══════════════════════════════════════════════╝
                     ┌────────┴────────┐
                     ▼                 ▼
              CALCULATED          SEGMENT BUILDER
              INSIGHTS            (attribute / related /
              (SQL GROUP BY)       CI filters)
                     │                 │
                     └────────┬────────┘
                              ▼
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  ACTIVATION TARGET                                                       ║
  ║  CRM (Campaign Members) | MC (Data Extension) | Ads (SHA-256 hash)       ║
  ╚══════════════════════════════════════════════════════════════════════════╝
```

**Limitations:**
- Batch refresh intervals: 1h / 6h / 12h / 24h only — no sub-1h batch
- IR is scheduled, not real-time — Unified Individuals update after the next IR run
- Segment refresh: 12h or 24h — not continuous
- Activation latency: segment publish schedule + activation publish schedule stack; minimum ~1h from data change to activated audience

---

## Key Term Definitions (Dense)

| Term | Definition | Critical Fact |
|---|---|---|
| Data Stream | Pipeline config that pulls from a source into a DLO | Auto-creates the DLO |
| DLO | Raw source data; mirrors source schema exactly | NOT in Segment Builder; NOT in Tableau |
| DMO | Standardized schema object (Individual, SalesOrder, etc.) | All segmentation/IR happens on DMOs |
| Field Mapping | Maps DLO fields → DMO fields | Email MUST map to Contact Point Email DMO — not Individual |
| Identity Resolution | Matches Individual records across sources → Unified Individual | Runs on schedule; NOT real-time |
| Unified Individual | Merged, resolved profile per customer | Contact Points are additive; attributes are reconciled |
| Segment | Filtered subset of Unified Individuals | Must be PUBLISHED (not Draft) to activate |
| Calculated Insight | Pre-computed SQL aggregate per customer | GROUP BY required; CIs reference DMOs, not DLOs |
| Activation Target | Destination config (CRM / MC / Ads) | One segment → multiple ATs simultaneously |
| Data Space | Logical access partition (not physical isolation) | Each object belongs to ONE Data Space only |
| Grounding | Passing Unified Individual + CI context to LLM before generating response | As fresh as last DC ingestion cycle |
| Job Chaining | Enforces execution order in Job Scheduler | Must be configured manually |

---

## Connector Quick Reference

| Scenario | Connector | Auth |
|---|---|---|
| Salesforce CRM objects (Contact, Account, etc.) | Salesforce Connector | Salesforce OAuth |
| Files: CSV / JSON / Parquet on S3 / GCS / Azure | Cloud Storage Connector | Bucket credentials |
| Real-time streaming events (web, app) | Ingestion API — streaming mode | OAuth 2.0 Client Credentials (Connected App) |
| Batch file API or bulk loads | Ingestion API — bulk mode | OAuth 2.0 Client Credentials (Connected App) |
| Marketing Cloud subscriber + engagement data | Marketing Cloud Connector | MC OAuth |
| Legacy/complex systems via MuleSoft | MuleSoft Connector | Depends on MuleSoft config |

**Ingestion API non-negotiables:** OAuth 2.0 Client Credentials via Connected App. Never username/password. Never named credentials.

**Supported file formats:** CSV, JSON, Parquet — NOT Excel (.xlsx)

**Batch schedule options:** 1h, 6h, 12h, 24h — no custom interval, no sub-1h

---

## Standard DMOs — Critical List

| DMO | Contains | Used For | Exam Trap |
|---|---|---|---|
| Individual | Person profile: Name, DOB, Address, DoNotProcess, HasOptedOutOfSharing | IR input; person data | Do NOT create a custom "Person" DMO — breaks IR |
| Contact Point Email | EmailAddress + HasOptedOutOfEmail + IndividualId FK | IR matching by email | Map email HERE — not to Individual.Email |
| Contact Point Phone | TelephoneNumber + HasSmsOptedOut + IndividualId FK | IR matching by phone | IndividualId FK is required for linkage |
| Unified Individual | Reconciled + merged profile | Segmentation, Activation, Analytics grain | Output of IR — do not manually edit |
| Sales Order | Order header: Amount, Date, Status, IndividualId | Purchase segments | Check IndividualId FK is mapped |
| Sales Order Product | Line items, Product Category | Product-level filters (indirect 2-hop) | 2 hops from Individual max |
| Web Engagement | Clickstream events, page views | Behavioral segments | |
| Email Engagement | MC open/click events | Campaign engagement segments | |

---

## Identity Resolution Quick Reference

### Match Rule Types
| Type | Mechanism | Use When | Risk |
|---|---|---|---|
| Exact Match | Byte-for-byte field equality | Email, loyalty ID, phone (normalized), SSN | Very low — high confidence |
| Fuzzy Match | Levenshtein similarity + threshold | Name fields with variations/typos | False positives if threshold too low |
| Normalized Match | Standardizes format before comparing | Phone (strip non-digits), names (remove salutation) | Lower than fuzzy |

### Fuzzy Threshold Guide
- **85–90%** = recommended starting point for name matching
- **Higher** = fewer false positives; more missed real duplicates
- **Lower** = more matches; higher false merge risk
- **Financial services**: Exact match ONLY — no fuzzy (false merges are catastrophic)

### Reconciliation Strategies (Individual attributes only — NOT Contact Points)
| Strategy | Meaning | Use For |
|---|---|---|
| Source Priority | Manual trust ranking — source #1 wins | Name, address when CRM is most authoritative |
| Most Occurred | Majority wins — value appearing in most sources | Less volatile, consensus data |
| Most Recent | Latest update wins | Address, preferences (frequently changes) |

### Critical IR Facts
- **Contact Points are additive** — ALL emails/phones from ALL sources appear on Unified Individual; reconciliation does NOT apply
- IR INPUT = Individual DMO + Contact Point DMOs (NOT DLOs, NOT Unified Individual as input)
- **Contact Point Email DMO must have IndividualId FK** — without it, emails can't link to a person and IR won't match on email
- Unified Individual count < Individual DMO count = deduplication is working correctly
- Unified Individual count = Individual DMO count = no matches found (check CPEmail population)

**Limitations:**
- Max match rules per ruleset: check current Salesforce limits documentation (typically 5)
- IR is NOT real-time — Unified Individuals update on IR run schedule
- A super-matcher (shared email like info@company.com) can cause mass false merges — use qualifying conditions to exclude

---

## Calculated Insights — SQL Syntax

```sql
SELECT
    i.Id AS IndividualId,              -- DIMENSION (required in GROUP BY)
    COUNT(so.Id) AS TotalOrders,       -- MEASURE
    SUM(so.TotalAmount) AS TotalRev,   -- MEASURE
    MAX(so.OrderDate) AS LastOrder,    -- MEASURE (date)
    AVG(so.TotalAmount) AS AvgOrderVal -- MEASURE
FROM Individual__dlm AS i              -- __dlm suffix REQUIRED
JOIN SalesOrder__dlm AS so
    ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
GROUP BY i.Id                          -- GROUP BY REQUIRED — no exceptions
```

**CI Rules (non-negotiable):**
- `__dlm` suffix on ALL DMO API names in SQL
- `GROUP BY` is required — always — no GROUP BY = CI won't save
- CIs can only reference **DMOs** — never DLOs
- Dimensions = GROUP BY fields; Measures = aggregated values
- **Refresh order:** Data Stream → DMO → CI → Segment → Activation (Job Scheduler chaining enforces this)

**Limitations:**
- No real-time CI — runs on schedule
- CI data is as fresh as the last CI refresh run
- CI refresh depends on DMO being up-to-date — stale DMO = stale CI
- `GROUP BY` is mandatory even for single-row-per-customer aggregations

---

## Segment Criteria Types

```
  Business Need                          → Criteria Type
  ─────────────────────────────────────────────────────────────────
  Profile attr on Unified Individual      → Attribute Filter (direct)
  Attr on related DMO (1 hop)             → Related Attribute Filter
  Attr on 2-hop related DMO               → Related Attribute Filter (indirect) — MAX
  Aggregated metric (total spend, count)  → Calculated Insight filter
  3+ hop data                             → Use CI instead
```

**Segment refresh schedule:** 12h or 24h
**MUST be Published** before it can be added to an Activation Target
**Always include** HasOptedOutOfEmail exclusion in email-targeted segments

---

## Activation Quick Reference

| Target Type | Config Requirement | Data Sent | Key Trap |
|---|---|---|---|
| Salesforce CRM | Connected Org + Campaign | Campaign Member records | Segment must be Published |
| Marketing Cloud | MC Connector + **Subscriber Key mapping** | Data Extension rows | Subscriber Key required for MC match |
| Facebook / Google / LinkedIn | OAuth to Ad Account | **SHA-256 hashed** emails/phones only | Raw PII never leaves Data Cloud |

**Activation membership < Segment membership** = expected — consent exclusions and missing contact points reduce count

**Activation Attributes:** Additional DMO/CI fields included in the activation payload alongside membership — used to personalize at destination (e.g., send TotalRevenue_90d to MC for email personalization)

**Limitations:**
- Activation frequency: 12h or 24h publish schedule (no sub-hourly)
- MC activation: only via Data Extension with Subscriber Key — not direct Journey entry without additional Journey configuration
- Advertising activation: hashing is client-side before transmission — platform match rates vary (typically 40–60% for cold audiences)

---

## Permission Sets — Minimum Required

| Permission Set | Access Level | Assign To |
|---|---|---|
| Data Cloud Admin | Full — connectors, streams, DMOs, IR, segments, ATs, CI | Implementation consultant, system admin |
| Data Cloud Data Aware Specialist | Data model, field mapping, segments, CI, view analytics | Data/marketing analyst |
| Data Cloud Marketing Specialist | Build/publish segments, run existing activations | Campaign manager |
| Data Cloud for Marketing Cloud | MC Connector config specifically | MC integration user |

**Least privilege:** Campaign manager → Marketing Specialist, NOT Admin. Wrong answer on every exam question that says "assign Data Cloud Admin to the marketing team."

---

## Data Spaces Reference

- **Logical** partitions — NOT physical database isolation
- Each object belongs to exactly **one** Data Space
- Default Data Space objects visible to ALL Data Cloud Admin users
- Use for: brand isolation, department isolation, dev/prod separation
- Objects in a custom Data Space: only visible to users with that Data Space membership

**Limitations:**
- Not a substitute for separate org-level data isolation in strict regulatory contexts
- No per-Data-Space encryption — encryption is at org level
- Adding a user to a Data Space does NOT automatically grant them a Data Cloud permission set

---

## Job Refresh Order (Critical for Exam)

```
  1. Data Stream refresh   → DLO updated → DMO updated
        │ (must complete first)
  2. CI refresh            → computes new metrics from DMO
        │ (must complete after step 1)
  3. Segment refresh       → applies new CI values, updates membership
        │ (must complete after step 2)
  4. Activation publish    → sends updated members to destinations
```

Use **Job Scheduler job chaining** to enforce this order. Without chaining, CI can run before DMO is updated — segment reflects stale data.

---

## Consent Fields Quick Reference

| Field | Object | Regulation | Meaning |
|---|---|---|---|
| HasOptedOutOfEmail | Contact Point Email | CAN-SPAM / CASL | Email unsubscribe |
| HasSmsOptedOut | Contact Point Phone | TCPA | SMS unsubscribe |
| DoNotProcess | Individual | **GDPR** | Right to erasure / stop all processing |
| HasOptedOutOfSharing | Individual | **CCPA** | Do not sell / share data with third parties |
| DoNotTrack | Individual | CCPA / ePrivacy | Behavioral tracking opt-out |

**Streaming consent best practice:** Use Ingestion API streaming to minimize opt-out lag. Batch (24h S3) = up to 24-hour window where an opted-out customer could still receive communications.

**GDPR erasure requires:** (1) Set DoNotProcess = true, (2) Delete Unified Individual, (3) Delete Individual DMO records, (4) Delete Contact Point DMO records, (5) Suppress DLO data to prevent re-ingestion. Missing step 5 = record reappears on next Data Stream run.

---

## Analytics Integration

| Tool | Connection | Accessible Data | NOT Accessible |
|---|---|---|---|
| Tableau | Tableau Data Cloud Connector, OAuth 2.0, `cdp_query_api` scope | DMOs, CIs, Unified Individual | DLOs |
| CRM Analytics | Analytics Studio connector | DMOs, CIs, Segment membership | DLOs |

**CI as analytics single source of truth:** Same CI definition used in Segment Builder AND in Tableau = no metric discrepancy between marketing and analytics teams.

---

## AI / Agentforce Integration

- **Grounding** = retrieves Unified Individual + relevant CIs → passes as LLM context before response generation
- **Vector database** = semantic search (meaning-based, not keyword-based) over unstructured content
- **Model Builder** = trains custom ML models on DMO/CI data; predictions written back to Data Cloud as DMO fields
- **Copilot mode** = human reviews before sending; **Autonomous** = acts without per-action approval
- AI quality directly tied to IR quality — fragmented Unified Profiles → poor personalization
- DoNotProcess = true customers must be excluded from AI grounding workflows (consent)

---

## PTA / SA Field Notes

### Common Customer Objections and Answers
| Objection | Answer |
|---|---|
| "We need real-time personalization" | Data Cloud supports near-real-time (Ingestion API streaming), but segment refresh + activation adds 30min–24h latency. For sub-second personalization, architect a separate real-time decisioning layer (e.g., Interaction Studio / Personalization). |
| "How is Data Cloud different from a CDW?" | Data Cloud adds identity resolution, native segmentation, activation connectors, and Agentforce grounding on top of the data lake. It's not a replacement for Snowflake/BigQuery — it's complementary. |
| "Our brands can't share customer data" | Data Spaces provide logical isolation. For full physical isolation with separate legal entities, separate Data Cloud instances may be required. |
| "Can we delete a customer completely?" | Yes, but it's a multi-step process (5 steps including DLO suppression). There is no single-click GDPR erasure — build a documented deletion workflow. |

### High-Value Architecture Patterns
- **Multi-brand:** One instance + Data Spaces + shared Unified Individual across brands = enables cross-brand insight while isolating team access
- **Service Intelligence:** Data Cloud + Agentforce grounding = service agents see full unified customer context without CRM screen-popping complexity
- **Marketing + Sales alignment:** Activate same segment simultaneously to MC (email) + CRM Campaign (sales follow-up) via two ATs on one segment

---

## Most Common Exam Traps (10 Non-Negotiables)

```
  1. Email for IR → Contact Point Email DMO (NOT Individual.Email)
  2. Custom person DMO instead of Individual DMO → breaks IR entirely
  3. DLOs accessible in Segment Builder → FALSE (only DMOs/CIs)
  4. DLOs accessible in Tableau → FALSE (only DMOs/CIs)
  5. Draft segment can be activated → FALSE (must Publish first)
  6. CI refresh before Data Stream → CI computes stale data
  7. Segment size = Activation size → FALSE (consent/contact filters reduce it)
  8. One segment needs multiple ATs → FALSE (one segment → many ATs)
  9. Data Spaces = physical isolation → FALSE (logical access boundary)
  10. Reconciliation applies to Contact Points → FALSE (Contact Points are additive)
```

---

## Scenario Question Formula

```
  Step 1: Identify the pipeline layer
          Ingestion? Modeling? IR? Segment? Activation? Governance?

  Step 2: Identify the constraint
          Streaming vs batch? Consent? Hop count? Permission level?

  Step 3: Eliminate wrong answers
          See any of the 10 traps above in an answer choice? Cross it out.

  Step 4: Match to Data Cloud architecture exactly
          Left-to-right pipeline: Sources → DLO → DMO → IR → Segment → Activation
```

---

## Domain Weights (Exam Prioritization)

| Domain | Weight | ~Questions | Priority |
|---|---|---|---|
| Use Cases & Business Value | 17% | ~10 | HIGH — scenario questions; covers all domains |
| Data Ingestion | 17% | ~10 | HIGH — connector choice, OAuth, batch vs streaming |
| Data Modeling & Identity Resolution | 17% | ~10 | HIGH — field mapping, match rules, reconciliation |
| Data Cloud Fundamentals | 13% | ~8 | MEDIUM — pipeline, permissions, Data Spaces |
| Administration & Governance | 13% | ~8 | MEDIUM — consent, job statuses, Data Quality Rules |
| Segmentation & Insights | 13% | ~8 | MEDIUM — CI SQL, criteria types, hop count |
| Activation & Engagement | 10% | ~6 | MEDIUM — AT types, Subscriber Key, SHA-256 |
