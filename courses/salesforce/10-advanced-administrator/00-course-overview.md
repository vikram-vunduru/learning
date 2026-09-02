# Salesforce Certified Advanced Administrator (CRT-211)
## Course Overview & Study Guide

---

## Certification At a Glance

| Field | Detail |
|---|---|
| Exam Code | CRT-211 |
| Questions | 65 multiple choice + multiple select |
| Pass Score | 65% (~43/65 correct) |
| Time Limit | 120 minutes |
| Exam Fee | $200 USD / Retake $100 USD |
| Prerequisite | Active Salesforce Administrator certification |
| Delivery | Online proctored or testing center |
| Validity | Requires maintenance each release cycle |

---

## Exam Domain Breakdown

| Domain | Weight | Key Lecture(s) |
|---|---|---|
| Security & Access | 20% | Lectures 01–03 |
| Extending Custom Objects & Applications | 8% | Lectures 14–15 |
| Auditing & Monitoring | 6% | Lecture 12 |
| Sales Cloud | 10% | Lectures 07 |
| Service Cloud | 10% | Lectures 08–10 |
| Data Management | 10% | Lectures 12–13 |
| Content Management | 5% | Lecture 10 |
| Change Management & Analytics | 7% | Lecture 16 |
| Process Automation | 17% | Lectures 04–06 |
| Reports, Dashboards & Analytics | 7% | Lecture 11 |

---

## Prerequisite Knowledge Check

Before starting this course, confirm you understand:
- Object model: standard vs custom objects, relationships (lookup, M-D, hierarchical)
- OWD (Org-Wide Defaults), profiles, permission sets, roles & role hierarchy
- Standard automation: workflow rules (legacy), Process Builder (legacy), basic Flows
- Reports (tabular/summary/matrix), dashboards
- Data tools: Data Loader, Import Wizard, Data Export
- Sandboxes: developer, developer pro, partial, full

If any of these feel shaky, revisit the Admin cert material first. This course assumes mastery at that level.

---

## What Makes Advanced Admin Different from Admin

The Advanced Admin exam pushes on **edge cases, configuration depth, and decision-making** rather than "what does this feature do." Expect questions framed as:

- "A company needs X requirement — which combination of features achieves this?"
- "A customer reports Y unexpected behavior — what is the root cause?"
- "Which feature best fits scenario Z and why?" (often two options look correct)

### Mental Model Shift

| Admin Exam Focus | Advanced Admin Focus |
|---|---|
| What is a sharing rule? | Criteria-based vs owner-based tradeoffs at 500k records |
| What is Flow? | Record-triggered before vs after save; fault paths |
| What are entitlements? | Milestone actions, escalation, SLA breach automation |
| What is Territory Management? | Territory hierarchy design, opportunity assignment rules |
| What is a report? | Joined reports, summary formulas, cross-object in reports |

---

## PTA / SA Relevance

### Why This Certification Matters for Partner TAs

The Advanced Admin cert closes gaps that come up constantly in customer engagements:

1. **Architecture review conversations** — customers ask "should we use Territory Management or sharing rules?" You need both the exam-level knowledge and practical tradeoff intuition.
2. **Debugging escalations** — Advanced sharing and automation interactions produce subtle bugs. This cert trains you to reason through them systematically.
3. **Pre-sales discovery** — Understanding entitlements, milestones, and Knowledge deeply means you can identify implementation complexity early.
4. **Customer advisory credibility** — Advanced Admin cert signals that you understand operational complexity, not just the high-level architecture.

### How to Use This Course as a PTA

- Each lecture has a **PTA / SA Relevance** section — read these carefully, they connect exam content to real engagement patterns.
- The **Common Partner Mistakes** subsections are drawn from actual delivery failures. Know these cold.
- The **Enterprise Scale Considerations** subsections address the gap between "works in a dev org" and "works at 10M records."

---

## Study Plan

### 4-Week Accelerated Plan (assuming Admin cert holder)

**Week 1 — Security & Automation (High-weight domains)**
- Day 1–2: Lectures 01–03 (Security & Access, 20%)
- Day 3–5: Lectures 04–06 (Process Automation, 17%)
- Day 6–7: Lab 01 + Lab 02

**Week 2 — Sales, Service, Data**
- Day 1–2: Lectures 07–09 (Sales Cloud 10%, Service Cloud 10%)
- Day 3–4: Lectures 10–12 (Knowledge + Data Mgmt 10%)
- Day 5–7: Lecture 13 + Lab 03

**Week 3 — Platform & Change Management**
- Day 1–2: Lectures 14–16 (Custom Metadata, Formulas, Deployment 8%+7%)
- Day 3–5: Lecture 11 (Reports & Dashboards 7%)
- Day 6–7: Cheat sheet review, domain gaps

**Week 4 — Exam Prep**
- Day 1–3: Practice exam (65 questions), review wrong answers
- Day 4–5: Targeted re-read of weak domains
- Day 6: Final cheat sheet pass
- Day 7: Exam

---

## Course File Index

```
00-course-overview.md                          ← You are here
section-01-security-access/
  lecture-01-advanced-sharing-rules.md         Domain: Security & Access (20%)
  lecture-02-territory-management.md           Domain: Security & Access (20%)
  lecture-03-delegated-administration.md       Domain: Security & Access (20%)
section-02-automation/
  lecture-04-advanced-flows.md                 Domain: Process Automation (17%)
  lecture-05-approval-processes-advanced.md    Domain: Process Automation (17%)
  lecture-06-flow-testing-debugging.md         Domain: Process Automation (17%)
section-03-sales-service/
  lecture-07-advanced-sales-cloud.md           Domain: Sales Cloud (10%)
  lecture-08-advanced-service-cloud.md         Domain: Service Cloud (10%)
  lecture-09-entitlements-milestones.md        Domain: Service Cloud (10%)
  lecture-10-knowledge-advanced.md             Domain: Content Management (5%)
section-04-data-analytics/
  lecture-11-reports-dashboards-advanced.md    Domain: Reports & Dashboards (7%)
  lecture-12-data-management-advanced.md       Domain: Data Management (10%)
  lecture-13-change-data-capture.md            Domain: Data Management / Auditing (6%)
section-05-platform/
  lecture-14-custom-metadata-types.md          Domain: Extending Custom Objects (8%)
  lecture-15-advanced-formula-fields.md        Domain: Extending Custom Objects (8%)
  lecture-16-sandboxes-deployment.md           Domain: Change Management (7%)
labs/
  lab-01-territory-management.md
  lab-02-advanced-flows.md
  lab-03-reports-dashboards.md
exam-prep/
  practice-exam-65-questions.md
  advanced-admin-cheat-sheet.md
```

---

## Key Themes Across the Entire Exam

1. **Declarative first** — The exam almost always prefers the declarative solution if it exists. Know the ceiling of declarative tools.
2. **Least privilege** — Security questions almost always prefer the most restrictive option that still meets requirements.
3. **Scalability** — At >10k records, some features break or degrade. Know which ones.
4. **Governor limits** — Flows have their own limits; know them vs Apex limits.
5. **Deployment behavior** — What moves with changesets? What doesn't? Custom metadata vs custom settings answer appears every exam.
