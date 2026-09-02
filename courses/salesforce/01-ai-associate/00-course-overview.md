# Salesforce AI Associate — Personal Study Guide

## Exam Facts

| Field | Detail |
|-------|--------|
| Exam name | Salesforce Certified AI Associate |
| Questions | 40 multiple choice |
| Time limit | 70 minutes (~105 seconds/question) |
| Passing score | 65% (26/40 correct) |
| Cost | $75 USD (retake: $75) |
| Delivery | Webassessor — online proctored or testing center |
| Recommended for | Salesforce admins, consultants, architects, developers who work with Einstein AI |

---

## Topic Weights

| Domain | % of Exam | Questions | Priority |
|--------|-----------|-----------|----------|
| Einstein Trust Layer | 38% | ~15 | CRITICAL — study this first |
| Ethical Considerations of AI | 20% | ~8 | HIGH — scenario-heavy |
| AI Fundamentals | 17% | ~7 | MEDIUM — foundational |
| Data for AI | 17% | ~7 | MEDIUM — data quality + training |
| AI Capabilities of CRM | 8% | ~3 | LOWER — feature awareness |
| **TOTAL** | **100%** | **40** | |

---

## What This Exam Actually Tests

This is a **comprehension and application exam**, not a memorization exam. Every question is scenario-based — you read a paragraph about a business situation and select the best response. Flashcard-only study will not work.

You need to:
- Understand WHY things work, not just what they are
- Map business problems to Salesforce AI features and principles
- Recognize bias type, ethics violation, or Trust Layer component from a description
- Distinguish predictive vs. generative vs. agentic AI in a real-world context

---

## Sections in This Study Guide

| Section | Lectures | Focus |
|---------|----------|-------|
| Section 1: AI Fundamentals | 01–04 | ML types, neural networks, predictive vs. generative |
| Section 2: Generative AI | 05–09 | LLMs, prompting, hallucinations, Trust Layer, RAG |
| Section 3: AI in Salesforce | 10–14 | Einstein platform, Agentforce, Prompt Builder, Prediction Builder, NBA |
| Section 4: AI Ethics | 15–18 | Trusted AI Principles, bias types, transparency, human oversight |
| Section 5: Data for AI | 19–22 | Data quality, training data, Data Cloud, structured vs. unstructured |

---

## PTA / SA Relevance — Why This Certification Matters for Partner Architects

As a Partner Technical Architect or Solution Architect:

- **Customer trust conversations**: Every enterprise customer asking about Einstein/Agentforce will raise data privacy questions. The Trust Layer is your answer. Know it cold.
- **Architecture reviews**: Data Cloud grounding patterns, RAG architecture, and the difference between fine-tuning vs. prompting come up in every enterprise AI design session.
- **Governance and compliance**: Customers in regulated industries (healthcare, financial services, government) need you to articulate the Trust Layer's ZDR, masking, and audit capabilities in CTO/CPO language.
- **Anti-patterns**: The most common implementation mistake is enabling Einstein on dirty Salesforce data. Know the 6 data quality dimensions and how to assess org readiness.
- **Positioning Agentforce**: PTA conversations routinely involve distinguishing Agentforce (autonomous, multi-step) from Einstein Copilot (assistant) from NBA (recommendations). Be precise.

---

## Quick-Reference: Key Principles to Memorize

### Salesforce Trusted AI Principles (RATEI)
- **R**esponsible — prevent harm, safe by design
- **A**ccountable — humans own AI outcomes, audit trails
- **T**ransparent — disclose AI use, explain decisions
- **E**mpowering — augment humans, preserve human agency
- **I**nclusive — fair across all demographic groups

### Einstein Trust Layer (4 Components)
1. **Data Masking** — PII masked before going to external LLM
2. **Zero Data Retention (ZDR)** — LLM provider cannot store or train on your data
3. **Toxicity Scoring** — harmful output filtered before reaching user
4. **Audit Trail** — every AI interaction logged

### ML Types
- **Supervised** = labeled data, known outcomes (Einstein Lead Scoring)
- **Unsupervised** = unlabeled data, finds patterns (customer segmentation)
- **Reinforcement** = trial-and-error with reward signals (RLHF for LLM alignment)

### 6 Data Quality Dimensions
Accuracy · Completeness · Consistency · Timeliness · Validity · Uniqueness

---

## Study Sequence

1. Start with **Section 2** (Generative AI / Trust Layer) — it's 38% of the exam
2. Move to **Section 4** (Ethics) — it's 20%
3. Study **Section 1** (AI Fundamentals) — 17%
4. Study **Section 5** (Data for AI) — 17%
5. Finish with **Section 3** (Salesforce AI capabilities) — 8%
6. Take the **full 40-question practice exam**
7. Review the **cheat sheet** in the 24 hours before your exam
