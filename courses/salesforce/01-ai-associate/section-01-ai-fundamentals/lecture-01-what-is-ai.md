# What Is AI?

**Exam Domain:** AI Fundamentals (17%)
**Study Priority:** Foundation — understand concepts for all other sections

---

## Core Concepts

**Artificial Intelligence (AI):** Computer systems that perform tasks requiring human-like intelligence — reasoning, learning, pattern recognition, language understanding.

**The critical distinction the exam tests:**

| Type | Definition | Exam Key |
|------|-----------|----------|
| **Narrow AI** | AI designed for ONE specific task. All commercial AI today. | This IS what Einstein, ChatGPT, and every AI product is |
| **General AI (AGI)** | AI that thinks and reasons across ANY domain like a human. Does NOT commercially exist. | The exam will try to trick you into thinking some AI is "general" |

**Einstein is Narrow AI.** Every Einstein feature does one specific thing: score leads, generate text, classify cases, etc.

**Core vocabulary:**

| Term | Definition |
|------|-----------|
| **Algorithm** | A set of rules or steps for solving a problem |
| **Model** | The trained output of running an algorithm on data — captures learned patterns |
| **Training data** | Historical examples the algorithm learns from |
| **Inference** | Using a trained model to make predictions on new data |
| **Feature** | An input variable the model uses to make predictions (e.g., Industry, Annual Revenue) |
| **Label** | The known output in training data that the model learns to predict (e.g., Converted = True) |

---

## PTA / SA Relevance

**In customer architecture reviews:**
- Customers frequently confuse "AI" with "AGI/Skynet-level intelligence." Frame Einstein as narrow, task-specific AI — this manages expectations and prevents disappointment.
- Common customer question: "Can Agentforce make judgment calls we haven't anticipated?" The answer is no — it operates within defined Topics and guardrails.

**For CTO conversations:**
- Frame AI as a pattern-matching and automation layer on top of your CRM data, not a thinking system. This is accurate and reduces AI anxiety.
- "Einstein Lead Scoring doesn't decide anything — it gives your reps better information to decide with."

**Anti-pattern to warn customers about:**
- Orgs that expect AI to "figure things out" from messy data. AI learns patterns from the data you give it. Clean data and well-structured Salesforce objects are prerequisites, not nice-to-haves.

---

## Salesforce AI Architecture (Where Einstein Fits)

```
╔══════════════════════════════════════════════════════════════════╗
║                    SALESFORCE AI STACK                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐    ║
║  │          BUSINESS APPLICATIONS (CRM Layer)               │    ║
║  │  Sales Cloud · Service Cloud · Marketing Cloud           │    ║
║  └──────────────────────────┬───────────────────────────────┘    ║
║                             │                                    ║
║  ┌──────────────────────────▼───────────────────────────────┐    ║
║  │              EINSTEIN AI LAYER                           │    ║
║  │  Predictive: Lead Scoring, Opportunity Scoring           │    ║
║  │  Generative: Prompt Builder, Copilot                     │    ║
║  │  Agentic:    Agentforce                                   │    ║
║  └──────────────────────────┬───────────────────────────────┘    ║
║                             │                                    ║
║  ┌──────────────────────────▼───────────────────────────────┐    ║
║  │            EINSTEIN TRUST LAYER                          │    ║
║  │  Data Masking · ZDR · Toxicity Scoring · Audit Trail     │    ║
║  └──────────────────────────┬───────────────────────────────┘    ║
║                             │                                    ║
║  ┌──────────────────────────▼───────────────────────────────┐    ║
║  │              DATA FOUNDATION                             │    ║
║  │  Salesforce CRM Data · Data Cloud Unified Profiles       │    ║
║  │  External Data Sources · Vector Store                    │    ║
║  └──────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════╝
```

**Limitations of this architecture:**
- Einstein AI features are org-specific: a new org with minimal historical data gets poor or no personalized model
- Generative AI features require the Einstein Trust Layer to be enabled — it is NOT on by default in all editions
- Data Cloud integration is an additional SKU — the unified profile grounding requires a Data Cloud license
- Each Einstein feature has its own minimum data threshold before activating (e.g., Lead Scoring requires sufficient converted leads)
- Einstein AI is NOT general purpose — each feature has a defined scope and will not reason outside it

---

## Key Facts to Memorize

- All commercial AI today = **Narrow AI** (task-specific)
- AGI (General AI) = **does not commercially exist**
- Einstein = Narrow AI applied to Salesforce CRM use cases
- A **model** is the trained artifact; **training data** is what it learned from; **inference** is using it
- **Features** are inputs; **labels** are the known outputs the model learns to predict
- Einstein learns from YOUR org's historical data for personalized features (Lead Scoring, Opportunity Scoring)

---

## Exam Traps

**Trap 1:** "Einstein can handle any type of question or task" — WRONG. Einstein is narrow AI. Each feature does one thing.

**Trap 2:** Confusing a "model" with an "algorithm." The algorithm is the process; the model is the output. You deploy a model, not an algorithm.

**Trap 3:** Thinking AGI exists commercially. It does not. Any answer choice that implies an AI "thinks like a human" across domains is wrong.

**Trap 4:** "Einstein uses the same model for all Salesforce customers." WRONG. Einstein Lead Scoring, for example, trains a PERSONALIZED model on each org's own data.

---

## Practice Questions

**Q1: A company activates Einstein Lead Scoring. The feature trains on their historical lead conversion data and creates a model specific to their business. Which type of AI does this represent?**

A) General AI (AGI)
B) Narrow AI
C) Reinforcement Learning
D) Unsupervised Learning

**Answer: B** — Narrow AI. Einstein Lead Scoring is designed for one specific task (predicting lead conversion likelihood). It does not generalize to other tasks. All commercial AI products are narrow AI.

---

**Q2: A Salesforce admin wants Einstein Lead Scoring to predict which leads will convert. The admin reviews the historical lead data and identifies the fields Einstein will use to find patterns. What are these fields called in machine learning terminology?**

A) Labels
B) Algorithms
C) Features
D) Inferences

**Answer: C** — Features are the input variables (fields) the model uses to make predictions. Labels are the known outputs (e.g., Converted = True). Algorithms are the learning process. Inferences are predictions made after training.

---

**Q3: Which of the following correctly describes the difference between Narrow AI and General AI?**

A) Narrow AI requires more computing power than General AI
B) Narrow AI is designed for specific tasks; General AI can reason across any domain like a human and does not exist commercially
C) General AI is used in Salesforce Einstein; Narrow AI is used in research labs
D) Narrow AI is older technology; General AI has replaced it in enterprise applications

**Answer: B** — Narrow AI handles one type of task. AGI would handle any cognitive task — it does not exist in commercial products. Einstein is narrow AI, not AGI.
