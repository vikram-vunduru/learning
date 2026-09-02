# Salesforce Certified Data 360 Consultant (CRT-251) — Personal Study Guide

## What This Cert Is

**Salesforce Certified Data 360 Consultant** (CRT-251) validates your ability to design, implement, and manage Salesforce Data Cloud solutions. It tests hands-on knowledge of data ingestion, identity resolution, segmentation, activation, governance, and AI integrations.

**Product rename history you need to know:**
Customer 360 Audiences → Salesforce CDP → Salesforce Data Cloud → exam renamed to "Data 360 Consultant" in 2024. Old names appear in documentation and possibly in exam question distractors.

---

## Exam At a Glance

| Item | Detail |
|---|---|
| Exam Code | CRT-251 |
| Questions | 60 |
| Passing Score | 67% (~40 correct) |
| Time | 105 minutes |
| Fee | $200 / Retake $100 |
| Format | Multiple choice + multiple select |

---

## Domain Weights — Where to Focus

| Domain | Weight | ~Questions | My Priority |
|---|---|---|---|
| Data Ingestion | 17% | ~10 | HIGH |
| Data Modeling & Identity Resolution | 17% | ~10 | HIGH |
| Use Cases & Business Value | 17% | ~10 | HIGH |
| Data Cloud Fundamentals | 13% | ~8 | HIGH |
| Administration & Governance | 13% | ~8 | MED |
| Segmentation & Insights | 13% | ~8 | MED |
| Activation & Engagement | 10% | ~6 | MED |

The top three domains are 51% of the exam. Master ingestion, data modeling/IR, and use cases first.

---

## The Pipeline — Memorize This First

Everything in Data Cloud follows this left-to-right flow. Every exam question fits somewhere on it.

```
Source Systems
    ║
    ▼  [Data Stream = pipeline config object]
Data Lake Objects (DLO) — raw, unchanged source data
    ║
    ▼  [Field Mapping = translate DLO fields → DMO standard schema]
Data Model Objects (DMO) — standardized, modeled data
    ║
    ▼  [Identity Resolution = match + merge across sources]
Unified Individual — single resolved profile per real customer
    ║
    ▼  [Segment Builder]
Segments — filtered subsets of Unified Individuals
    ║
    ▼  [Activation Target config]
Destinations (Salesforce CRM, Marketing Cloud, Ad Platforms)
```

**Calculated Insights** plug in between DMO and Segment — they pre-compute aggregate metrics (total spend, purchase count) from DMO data. CI results feed segment criteria.

---

## What Each Section Covers

### Section 1 — Fundamentals (Lectures 01–04)
- Platform architecture and product positioning
- Five connector types and when to use each
- DLO vs. DMO — the two-layer data model
- Identity Resolution match rules and reconciliation strategies

### Section 2 — Segmentation & Insights (Lectures 05–07)
- Segment criteria types: attribute, related attribute, and Calculated Insight
- Writing CI SQL (ANSI standard, GROUP BY required, __dlm suffix)
- Activation Targets: CRM, Marketing Cloud, ad platforms

### Section 3 — Governance (Lectures 08–10)
- Consent fields (HasOptedOutOfEmail, DoNotProcess, HasOptedOutOfSharing)
- Data Spaces — logical access isolation
- Permission sets and the job refresh dependency chain

### Section 4 — Use Cases (Lectures 11–13)
- Tableau + CRM Analytics integration patterns
- AI grounding, Agentforce, vector database, Model Builder
- Retail, financial services, healthcare scenario patterns

---

## Labs — What I Need to Be Able to Do

- **Lab 01:** Configure a Salesforce CRM Data Stream; map DLO fields to Individual and Contact Point Email DMOs
- **Lab 02:** Create an Identity Resolution ruleset with exact and normalized match rules; configure Source Priority reconciliation; inspect a Unified Individual
- **Lab 03:** Write a Calculated Insight in SQL; build a segment using a CI filter + consent exclusion; publish to a Salesforce CRM Activation Target

---

## Study Plan

| Week | Focus | Labs |
|---|---|---|
| 1–2 | Sections 1–2 | Labs 01–02 |
| 3–4 | Sections 3–4 | Lab 03 |
| 5 | Practice exam + weak areas | Review cheat sheet |
| Day before | Cheat sheet + any missed practice questions | — |

**Target time:** 30–40 hours if you have prior Salesforce experience.

---

## Non-Negotiable Facts (Learn These Before Anything Else)

1. Segmentation runs on **DMOs**, never on raw DLOs
2. Identity Resolution uses **Contact Point DMOs** for matching — not the email field on Individual
3. A **Data Stream** is the pipeline config; a **DLO** is the raw storage — two different objects
4. **Unified Individual** is the OUTPUT of Identity Resolution — you do not create it manually
5. Batch refresh schedules are preset: **1h, 6h, 12h, 24h** — no custom intervals
6. Ingestion API auth = **OAuth 2.0 via Connected App** — never username/password
7. Job refresh order: **Data Stream → DMO → CI → Segment → Activation**
8. **Data Spaces** are logical partitions, not physical database isolation
9. Advertising platform activation sends **SHA-256 hashed** emails/phones — never raw PII
10. **Contact Points are additive** — all emails/phones from all sources appear on the Unified Individual; reconciliation rules do NOT apply to Contact Points
