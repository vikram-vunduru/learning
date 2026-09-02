# Salesforce Certified Data Architecture & Management Designer (CRT-402)
## Course Overview & Study Guide

---

## Certification At a Glance

| Field | Detail |
|---|---|
| Exam Code | CRT-402 |
| Questions | 60 multiple choice + multiple select |
| Pass Score | 58% (~35/60 correct) |
| Time Limit | 105 minutes |
| Exam Fee | $200 USD / Retake $100 USD |
| Prerequisites | None formal — assumes Admin + PDI knowledge |
| Delivery | Online proctored or testing center |
| Credential Value | Counts toward Application Architect, System Architect, CTA |

---

## Exam Domain Breakdown

| Domain | Weight | Lectures |
|---|---|---|
| Master Data Management | 25% | Lectures 01–04 |
| Large Data Volumes | 25% | Lectures 05–08 |
| Data Migration | 20% | Lectures 09–11 |
| Data Governance | 15% | Lectures 15–17 |
| Integration & Connectivity | 15% | Lectures 12–14 |

---

## What Makes This Exam Architect-Level

This is not an admin exam. The Data Architecture Designer exam tests **design decision-making under constraint** — not feature knowledge. Expect questions framed as:

- "A company has 50 million Account records and experiences timeout errors — what is the root cause and solution?"
- "A customer needs to sync records from an external ERP in near real-time without consuming API limits — which pattern best fits?"
- "Which combination of indexing strategy and query structure will make this SOQL selective?"

### Mental Model Required

| Admin/Dev Mindset | Architect Mindset |
|---|---|
| How do I query records? | What indexes exist and will this query use them? |
| How do I import data? | What is the migration sequence, rollback plan, and quality gate? |
| What is a duplicate rule? | When does native MDM fail and require a hub? |
| How do I expose external data? | What are the latency, volume, and governance tradeoffs of each integration pattern? |
| What is Big Objects? | How do I tier data across hot/warm/cold and what is the query model for each? |

---

## PTA / SA Relevance

### Why This Certification Matters for Partner TAs

The Data Architecture Designer is the single most operationally relevant cert for enterprise customers. Every large Salesforce engagement involves at least one of: data migration complexity, LDV performance degradation, MDM strategy confusion, or governance gaps.

1. **Architecture reviews** — Customers with performance problems almost always have data architecture debt. This cert gives you the vocabulary and depth to diagnose and prescribe.
2. **Deal qualification** — LDV and MDM complexity are leading indicators of implementation risk. Knowing the patterns helps scope projects correctly.
3. **CTA path** — This cert is required for Application Architect and System Architect credentials, both of which are on the CTA path.
4. **Customer trust** — When a customer's SOQL queries are timing out or their data migration failed, they need an architect-level answer, not a documentation link.

### How to Use This Course as a PTA

- Every lecture has a **PTA / SA Relevance** section. These are the most important sections for advisory work.
- The **Common Implementation Failures** subsections are drawn from real delivery failures — know these cold before architecture reviews.
- The **Enterprise Architecture Patterns** subsections give you vocabulary for Architect Board presentations and customer whiteboarding sessions.

---

## Study Plan

### 4-Week Plan (assuming Admin + Dev Foundation)

**Week 1 — High-Weight Domains: MDM + LDV**
- Day 1–2: Lectures 01–04 (Master Data Management, 25%)
- Day 3–5: Lectures 05–08 (Large Data Volumes, 25%)
- Day 6–7: Lab 01 (Schema Design) + Lab 02 (Query Optimization)

**Week 2 — Data Migration + Integration**
- Day 1–3: Lectures 09–11 (Data Migration, 20%)
- Day 4–5: Lectures 12–14 (Integration & Connectivity, 15%)
- Day 6–7: Lab 03 (Data Migration Plan)

**Week 3 — Governance + Exam Prep Foundation**
- Day 1–2: Lectures 15–17 (Data Governance, 15%)
- Day 3–4: Cheat sheet construction
- Day 5–7: Practice exam pass 1, review wrong answers

**Week 4 — Intensive Exam Prep**
- Day 1–2: Targeted re-read of weak domains
- Day 3–4: Practice exam pass 2
- Day 5: Final cheat sheet pass
- Day 6: Exam

---

## Course File Index

```
00-course-overview.md                              ← You are here
section-01-data-modeling/
  lecture-01-data-modeling-fundamentals.md         Domain: MDM (25%)
  lecture-02-object-relationships-design.md        Domain: MDM (25%)
  lecture-03-schema-design-patterns.md             Domain: MDM (25%)
  lecture-04-master-data-management.md             Domain: MDM (25%)
section-02-large-data-volumes/
  lecture-05-ldv-architecture.md                   Domain: LDV (25%)
  lecture-06-soql-query-optimization.md            Domain: LDV (25%)
  lecture-07-skinny-tables-indexes.md              Domain: LDV (25%)
  lecture-08-archiving-strategies.md               Domain: LDV (25%)
section-03-data-migration/
  lecture-09-data-migration-planning.md            Domain: Data Migration (20%)
  lecture-10-etl-tools-patterns.md                 Domain: Data Migration (20%)
  lecture-11-data-quality-governance.md            Domain: Data Migration (20%)
section-04-integration-data/
  lecture-12-external-objects-connect.md           Domain: Integration (15%)
  lecture-13-platform-events-streaming.md          Domain: Integration (15%)
  lecture-14-change-data-capture-design.md         Domain: Integration (15%)
section-05-governance/
  lecture-15-data-governance-framework.md          Domain: Governance (15%)
  lecture-16-security-data-architecture.md         Domain: Governance (15%)
  lecture-17-compliance-privacy.md                 Domain: Governance (15%)
labs/
  lab-01-schema-design.md
  lab-02-query-optimization.md
  lab-03-data-migration-plan.md
exam-prep/
  practice-exam-60-questions.md
  data-arch-cheat-sheet.md
```

---

## Key Themes Across the Entire Exam

1. **Selectivity drives everything** — Queries must be selective. Skinny tables, indexes, and data volume all connect back to this single principle.
2. **Migration sequence matters** — Parent records before child records. Accounts before Contacts before Opportunities. Getting this wrong causes foreign key failures.
3. **Native MDM has a ceiling** — Duplicate rules and matching rules handle moderate volumes. Above that ceiling, external MDM hubs are required.
4. **Architecture decisions cascade** — A bad schema design creates LDV problems, which creates query problems, which creates integration latency, which degrades AI quality. These domains are connected.
5. **Big Objects are query-limited** — Big Objects solve the storage problem but do not support SOQL with WHERE clauses on all fields. Know the access model.
6. **Governance is operational** — Data governance is not just policy — it is stewardship roles, data dictionaries, quality rules, and consent management built into the data layer.
