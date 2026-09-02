# Platform Developer I (PDI) — Study Guide

## Exam Facts

| Detail | Value |
|--------|-------|
| Exam Code | CRT-450 |
| Questions | 60 |
| Time | 110 minutes |
| Pass Score | 65% (39/60) |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## Exam Weight Breakdown

| Domain | Weight | ~Questions |
|--------|--------|-----------|
| Developer Fundamentals | 23% | ~14 |
| Process Automation & Logic | 30% | ~18 |
| User Interface | 25% | ~15 |
| Testing, Debugging & Deployment | 22% | ~13 |

## Architecture / How It Works

```
PDI STUDY PATH

Section 1: Developer Fundamentals (L01–L04)
  └── Tools, Apex basics, variables/collections, control flow

Section 2: Apex Core (L05–L09)
  └── SOQL, SOSL, DML, Triggers, Trigger best practices

Section 3: Advanced Apex (L10–L14)
  └── Async Apex, Governor limits, Exceptions, OOP, Callouts

Section 4: User Interface (L15–L19)
  └── Visualforce, VF Controllers, LWC basics, events, wire service

Section 5: Testing & Deployment (L20–L24)
  └── Unit testing, Test best practices, Debugging, Deployment, Security
```

**Limitations:**
- Process Automation & Logic (30%) is the heaviest domain — triggers, SOQL, DML, and async Apex live here
- User Interface (25%) covers both legacy Visualforce and modern LWC — know both

## 4-Week Study Plan

**Week 1 — Developer Fundamentals + Apex Core (L01–L07)**
- Days 1–2: Set up VS Code, Salesforce CLI, and a Developer Edition org. Work through L01 hands-on.
- Days 3–4: Study L02 (Apex Basics) and L03 (Variables, Types & Collections). Write Apex in Execute Anonymous.
- Days 5–7: Complete L04 (Control Flow), L05 (SOQL Fundamentals), L06 (SOQL Advanced). Practice queries in the Query Editor.

**Week 2 — Apex Core + Advanced Apex (L07–L14)**
- Days 1–2: Study L07 (DML Operations) and L08 (Apex Triggers). Create a trigger on Account in your org.
- Days 3–4: Complete L09 (Trigger Best Practices). Refactor trigger to use handler class pattern.
- Days 5–7: Work through L10–L14: async Apex (Future, Batch, Queueable, Scheduled), exception handling, and integration.

**Week 3 — User Interface (L15–L19)**
- Days 1–3: Study LWC basics, component communication, and lifecycle hooks.
- Days 4–5: Learn Visualforce and controllers for exam context.
- Days 6–7: Study Wire Service and @AuraEnabled patterns.

**Week 4 — Testing, Debugging & Review (L20–L24)**
- Days 1–2: Complete L20–L21 on Apex testing: test classes, @TestSetup, assertions, bulk testing.
- Days 3–4: Study deployment: change sets, Salesforce CLI, sandboxes vs scratch orgs.
- Days 5–6: Take 2–3 full practice exams (60 questions, 110 minutes each). Review every wrong answer.
- Day 7: Light review of weak areas only. Rest before exam day.

## Key Facts to Memorize
- Process Automation & Logic = 30% — spend the most time here
- Both Visualforce AND LWC are tested — don't skip either
- 75% code coverage required for production deployment (org-wide)
- Async limits are double sync for SOQL (200 vs 100) and heap (12 MB vs 6 MB)
- One trigger per object is best practice — multiple triggers = unpredictable order

## Practice Questions

**Q:** Which governor limit applies to total SOQL queries in a single synchronous transaction?
**A:** 100 queries. Asynchronous contexts allow 200.

**Q:** A developer needs to process 10 million records overnight. Which Apex feature?
**A:** Batch Apex — designed for large data volumes, each execute() chunk gets its own governor limit context.

**Q:** Which access modifier makes an Apex class accessible across all namespaces including managed packages?
**A:** `global` — `public` is only within the same namespace.
