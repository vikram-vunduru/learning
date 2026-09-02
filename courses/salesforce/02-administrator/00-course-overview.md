# Salesforce Certified Administrator (CRT-101) — Exam Reference

## Exam Facts

- **Exam:** Salesforce Certified Administrator (CRT-101)
- **Questions:** 60 scored + up to 5 unscored pilot questions = 65 total
- **Time:** 105 minutes
- **Passing Score:** 65% (39 of 60 scored questions)
- **Cost:** $200 USD (retake: $100)
- **Format:** Multiple choice and multiple select (no drag-and-drop)
- **Delivery:** Online proctored or testing center

## Exam Domain Weights

| Domain | Weight | What It Covers |
|--------|--------|----------------|
| Configuration & Setup | 20% | Org setup, users, profiles, My Domain, AppExchange |
| Object Manager & Lightning App Builder | 20% | Custom objects, fields, page layouts, record types, App Builder |
| Sales & Marketing Apps | 12% | Leads, accounts, contacts, opportunities, products, quotes |
| Service & Support Apps | 11% | Cases, queues, entitlements, knowledge, escalation |
| Productivity & Collaboration | 7% | Activities, tasks, events, Chatter, Einstein Activity Capture |
| Data & Analytics | 14% | Reports, dashboards, list views, data tools |
| Workflow/Process Automation | 16% | Validation rules, flows, workflow rules, approval processes |

**Where to spend your time:** Configuration & Setup (20%) + Automation (16%) + Object Manager (20%) = 56% of the exam. Master these three.

## PTA / SA Relevance

As a Partner Technical Architect, you won't be taking this exam every day — but the concepts here are the foundation every customer conversation is built on. When a customer says "we can't report on X" or "users are seeing data they shouldn't," it comes back to this material.

**In customer architecture reviews:** The most common finding is overly permissive OWD combined with profiles that haven't been cleaned up in years. The security model (OWD → Role Hierarchy → Sharing Rules) is the framework for every data access conversation.

**For CTO conversations:** Frame the exam domains as the Salesforce operating model: Configuration = "how we configure the platform," Automation = "how we enforce business rules without code," Analytics = "how we surface insights." Every enterprise Salesforce implementation touches all seven domains.

**When a partner asks you about CRT-101:** It's the baseline cert that proves someone can operate a Salesforce org. For customers evaluating Salesforce partners, look for this cert on every admin-role engagement. It doesn't certify architecture skills — for that you want Application Architect or System Architect certs.

## Topic Weight by Section (Your Study Plan)

```
Priority 1 — High Weight + Complex Material:
  Configuration & Setup     (20%)  ← sections 1–2
  Object Manager & App Builder (20%)  ← sections 4
  Automation                (16%)  ← section 9

Priority 2 — Medium Weight:
  Data & Analytics          (14%)  ← section 8
  Sales & Marketing Apps    (12%)  ← section 5

Priority 3 — Lower Weight (but don't skip):
  Service & Support         (11%)  ← section 6
  Productivity              (7%)   ← section 7
```

## The Security Model at a Glance

```
┌─────────────────────────────────────────────────────────┐
│  OBJECT-LEVEL: Profile/Permission Set (what you CAN DO) │
│  CRUD on each object + FLS on each field                │
├─────────────────────────────────────────────────────────┤
│  RECORD-LEVEL: (what you CAN SEE)                       │
│  1. OWD → sets the FLOOR (most restrictive baseline)    │
│  2. Role Hierarchy → opens UP based on manager position │
│  3. Sharing Rules → open to groups/roles/criteria       │
│  4. Manual Sharing → record-by-record grants            │
└─────────────────────────────────────────────────────────┘
```

## Automation Decision Tree

```
Does a HUMAN need to approve/reject?
  YES → Approval Process
  NO  → Which trigger?
         Save (create/update) → Record-Triggered Flow (Before or After Save)
         Schedule/batch       → Schedule-Triggered Flow
         User-facing UI       → Screen Flow
         Legacy org (exam)    → Workflow Rule / Process Builder
```

## Data Tool Decision

```
Object supported + under 50K records? → Data Import Wizard
Otherwise (Opportunities, Cases, over 50K, need upsert) → Data Loader
Full org backup → Data Export
Specific filtered export → Report Export
```

## Key Numbers to Memorize

| Number | What It Is |
|--------|-----------|
| 65% | Passing score |
| 60 | Scored questions |
| 105 min | Exam time |
| 50,000 | Data Import Wizard max records |
| 5,000,000 | Data Loader max records |
| 500 | Custom fields per object |
| 2 | Max Master-Detail per object |
| 25 | Max Roll-Up Summary fields per object |
| 300 | Max sharing rules per object |
| 200 | Custom objects in Enterprise Edition |
| 2,000 | Custom objects in Unlimited Edition |
| 20 | Max dashboard components |
| 3 | Max dashboard filters |
| 10 | Max dynamic dashboards (Enterprise/Unlimited) |
| 1 day | Developer sandbox refresh interval |
| 5 days | Partial Copy sandbox refresh |
| 29 days | Full sandbox refresh |
| 3 | Max records per merge operation |
| 4 | Max objects in custom report type |

## Study Strategy

1. Work through each section's lectures in order
2. After each lecture: write out the Key Facts section from memory
3. After each section: review the Exam Traps — these are exactly what wrong answers look like
4. Two days before exam: work through the full Practice Exam (60 questions, 105 minutes, timed)
5. Day before: read only this overview page + the cheat sheet

## What Changed in Spring/Summer 2024+

- **Profiles being replaced by Permission Sets:** Salesforce roadmap moves all permission management to Permission Sets/Groups; Profiles become a thin shell. Know both models for the exam, emphasize Permission Sets in architecture conversations.
- **Workflow Rules retired:** No new workflow rules in new orgs after Feb 2023. Still on exam for maintenance/recognition. All new automation = Flow.
- **Process Builder retired:** Same retirement path as Workflow Rules. Know for exam, build in Flow.
- **Enhanced Profile UI:** The profile UI has been redesigned in recent releases; the underlying model is the same.
