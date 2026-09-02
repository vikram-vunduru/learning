# Salesforce Platform App Builder — CRT-403 Study Guide

## Exam Facts

| Detail | Value |
|---|---|
| Exam Name | Salesforce Platform App Builder |
| Exam Code | CRT-403 |
| Questions | 60 scored questions |
| Time | 105 minutes |
| Passing Score | 63% (~38/60 correct) |
| Cost | $200 USD (retake: $100) |
| Delivery | Online proctored or testing center |
| Maintenance | Annual — must pass maintenance module each release cycle |

---

## Domain Weights — Where to Focus

| Domain | Weight | My Weakness Rating |
|---|---|---|
| **Business Logic & Process Automation** | **28%** | |
| Salesforce Fundamentals | 23% | |
| Data Modeling & Management | 22% | |
| User Interface | 17% | |
| App Deployment | 10% | |

The Automation domain is the biggest. Master Flow (before-save vs after-save, all 5 types, when to use each tool) before anything else.

---

## What This Exam Actually Tests

This is a **design judgment** exam, not a memorization exam. Every scenario-based question is asking: given this requirement, which is the *right* tool / relationship type / security approach? The "almost right" distractors are always present.

Key differences from the Admin exam:

| Dimension | Admin (CRT-101) | App Builder (CRT-403) |
|---|---|---|
| Data focus | Using standard objects | Designing custom data models |
| Automation depth | Basic Flow | Complex Flow, tool selection judgment |
| UI emphasis | Managing page layouts | Building Lightning pages, Dynamic Forms |
| Deployment | Minimal | Change sets, sandbox pipeline, packages |
| Mindset | "How do I manage this?" | "How do I build this?" |

---

## Topic Map by Section

| Section | Lectures | Domain |
|---|---|---|
| 01 — Platform Fundamentals | L01–L04 | Salesforce Fundamentals (23%) |
| 02 — Data Modeling | L05–L09 | Data Modeling & Management (22%) |
| 03 — Business Logic & Automation | L10–L15 | Business Logic & Automation (28%) |
| 04 — User Interface | L16–L20 | User Interface (17%) |
| 05 — App Deployment | L21–L23 | App Deployment (10%) |

---

## 4-Week Study Plan

**Week 1 — Foundations + Data Modeling**
- Days 1–2: Section 01 (L01–L04)
- Days 3–5: Section 02 (L05–L09)
- Weekend: Build a data model in a Dev org — custom objects, Master-Detail + Lookup, Schema Builder

**Week 2 — Automation (highest weight)**
- Days 1–5: Section 03 (L10–L15)
- Weekend: Build a before-save flow + an after-save flow that creates a child record

**Week 3 — UI + Deployment**
- Days 1–3: Section 04 (L16–L20)
- Days 4–5: Section 05 (L21–L23)
- Weekend: Lightning App with custom page, activate with visibility rule, practice change set

**Week 4 — Exam Prep**
- Days 1–2: Review all "Exam Traps" sections
- Days 3–4: Full practice exams in exam-prep folder
- Day 5: Re-read weak areas
- Target: Schedule exam end of Week 4

---

## Practice Questions

**Q:** Which exam domain carries the highest weight on CRT-403?
**A:** Business Logic & Process Automation — 28%.

**Q:** How many questions are on the CRT-403 and what is the passing score?
**A:** 60 questions, 63% passing (~38 correct).

**Q:** What's the biggest mindset shift from the Admin cert to the App Builder cert?
**A:** App Builder tests design judgment — choosing the *right* tool for a requirement, not just knowing what each tool does.
