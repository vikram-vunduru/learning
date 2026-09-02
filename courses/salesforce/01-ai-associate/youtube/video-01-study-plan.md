# AI Associate Exam — Study Plan and Strategy Notes

**Source:** Study plan reference (originally video format, converted to study notes)

---

## The Optimal Study Sequence

**Don't study in section order. Study by exam weight.**

| Priority | Section | Exam Weight | Recommended Study Time |
|---------|---------|------------|----------------------|
| 1 | Einstein Trust Layer | 38% | 3+ hours — know all 4 components cold |
| 2 | Ethical Considerations | 20% | 2 hours — RATEI principles + 4 bias types |
| 3 | AI Fundamentals | 17% | 2 hours — ML types, predictive vs. generative |
| 4 | Data for AI | 17% | 2 hours — 6 data quality dimensions, GIGO, Data Cloud |
| 5 | AI Capabilities of CRM | 8% | 1 hour — feature awareness, Prompt Builder, NBA, Prediction Builder |

**Total recommended prep time:** 10-15 hours for someone with some Salesforce background

---

## 2-Week Study Plan

**Week 1: Content Mastery**

| Day | Focus |
|-----|-------|
| Day 1 | Trust Layer: all 4 components, how they work, what problems they solve |
| Day 2 | Trust Layer practice questions + RAG/grounding (how Trust Layer + grounding work together) |
| Day 3 | Ethics: RATEI principles + AI Acceptable Use Policy |
| Day 4 | Ethics: 4 bias types + transparency/explainability |
| Day 5 | AI Fundamentals: ML types, supervised subtypes, neural network concepts |
| Day 6 | AI Fundamentals: predictive vs. generative vs. agentic; LLM basics; hallucinations |
| Day 7 | Data for AI: 6 quality dimensions, GIGO, training/validation/test split, overfitting |

**Week 2: Application and Practice**

| Day | Focus |
|-----|-------|
| Day 8 | Data for AI: Data Cloud, vector embeddings, structured vs. unstructured |
| Day 9 | AI Capabilities: Prompt Builder (4 templates, merge fields), Prediction Builder |
| Day 10 | AI Capabilities: Agentforce (Topics/Actions/Atlas), NBA (3 components) |
| Day 11 | Full 40-question practice exam (timed, 70 minutes) |
| Day 12 | Review practice exam — focus on wrong answers, understand why |
| Day 13 | Cheat sheet review + targeted review of weakest areas |
| Day 14 | Light review of cheat sheet only — don't cram day before |

---

## How This Exam Differs from Other Salesforce Certs

**This is NOT a memorization exam.** Unlike Admin or App Builder certs where you memorize where settings live, AI Associate tests conceptual understanding applied to scenarios.

**Question format:** Every question is a scenario paragraph ("A company wants to...") followed by 4 options. You need to understand the concept well enough to recognize which scenario maps to which principle/feature.

**The #1 mistake:** Memorizing flashcard definitions without understanding application. You will see the concepts in disguise.

**Fastest way to fail:** Only reading bullet point summaries without working through scenario-based practice questions.

---

## Study Strategies That Work

### The "3 Whys" for Every Concept
For each concept, know:
1. **What is it?** (definition)
2. **Why does it exist?** (problem it solves)
3. **How do you recognize it in a scenario?** (exam application)

Example for ZDR:
- What: LLM provider cannot retain or train on your Salesforce prompt data
- Why: Prevents your confidential business data from being used to train third-party AI models
- Recognize: Any scenario about "can the LLM provider learn from our data?" → answer is ZDR

### Error Analysis on Practice Questions
When you get a practice question wrong:
1. Identify WHICH concept you misunderstood (not just "I didn't know this")
2. Go back to that lecture and find the exact distinction you missed
3. Write it in your own words in the cheat sheet
4. Generate a variation of the same question to confirm you now understand it

### The "Contrast Pairs" Method
The exam loves to test on easily confused concepts. Study these contrasts explicitly:

| Concept A | vs. | Concept B | Key Distinction |
|-----------|-----|-----------|----------------|
| Data Masking | ZDR | Masking = what's sent; ZDR = what provider does with it |
| Toxicity Scoring | Hallucination prevention | Different problems: harmful vs. inaccurate |
| Fine-tuning | RAG | Weight changes vs. context injection |
| Overfitting | Underfitting | High train/low test vs. low train AND test |
| Training Data Bias | Representation Bias | Historical discrimination vs. missing groups |
| Copilot | Agentforce | Responds vs. acts autonomously |
| Recommendation | Strategy | What to recommend vs. when/who |

---

## High-Value Study Materials (This Course)

| Resource | Use It For |
|---------|-----------|
| Lecture 08 (Trust Layer) | The 38% domain — re-read this the day before exam |
| Lecture 15 (RATEI Principles) | The mnemonic; ethics scenarios |
| Lecture 16 (Bias Types) | Scenario identification for bias type |
| Full Practice Exam (40 questions) | Time yourself — 70 min, no notes |
| Cheat Sheet | Day-before review only |

---

## What the Exam Rarely Tests (Don't Waste Time On)

- Specific navigation paths in Salesforce Setup (this isn't an Admin cert)
- Exact API names of Einstein features
- Pricing or licensing details
- Which exact Salesforce edition includes which features
- Implementation step-by-step procedures (that's what labs are for)

---

## Day-of Exam Checklist

- [ ] Review cheat sheet once in the morning (don't re-read all lectures)
- [ ] Know the 4 Trust Layer components and what each does
- [ ] Know the RATEI mnemonic and what each principle means
- [ ] Know the 4 bias types and how to identify them from scenarios
- [ ] Know the 6 data quality dimensions
- [ ] Remember: 40 questions, 70 min = ~105 sec/question; don't get stuck
- [ ] Strategy: if uncertain, eliminate obviously wrong answers, select best remaining, mark for review and continue
- [ ] 65% to pass = 26/40 minimum correct
