# Salesforce AI Associate — Exam Day Cheat Sheet
**Last Updated:** 2026 | **Exam Time:** 70 minutes | **Passing Score:** 65% (26/40)

---

## 1. The 5 Salesforce Trusted AI Principles

| Principle | One-Line Description |
|-----------|----------------------|
| **Accuracy** | AI systems must produce reliable, correct outputs that can be trusted to reflect reality |
| **Safety** | AI must be designed to avoid causing harm to people, organizations, or society |
| **Transparency** | Salesforce discloses when and how AI is used, and explains the basis of AI decisions |
| **Fairness** | AI treats all people equitably; bias is actively identified and mitigated |
| **Accountability** | Humans remain responsible for AI decisions; oversight mechanisms are always maintained |

**Memory trick:** **A**ll **S**alesforce **T**eams **F**ocus **A**ccountably

---

## 2. Einstein Trust Layer — 4 Core Components

| Component | What It Does |
|-----------|-------------|
| **Data Masking** | Automatically detects and removes/replaces PII (names, SSNs, credit cards) before data is sent to an external LLM |
| **Data Grounding** | Connects LLM responses to verified Salesforce record data so outputs are factually anchored, not hallucinated |
| **Toxicity Detection** | Scans AI-generated outputs for harmful, offensive, or inappropriate content before returning to the user |
| **Zero Data Retention (ZDR)** | Ensures external LLM providers (e.g., OpenAI, Anthropic) do NOT store or use your prompts/data for their model training |

**Key exam point:** The Einstein Trust Layer protects data going OUT (to LLMs) and filters responses coming BACK (toxicity). It sits between Salesforce and external AI providers.

---

## 3. Prompt Builder Template Types

| Template Type | Primary Use Case |
|---------------|-----------------|
| **Sales Email** | Generate personalized outbound sales emails grounded in Opportunity/Account/Contact data |
| **Field Generation** | Auto-populate a specific Salesforce record field (e.g., auto-write a case summary field) |
| **Record Summary** | Generate a natural language narrative summarizing all key information on a Salesforce record |
| **Flex** | The most versatile type — can be invoked from any Salesforce context; used when no other template type fits the use case |

**Key exam point:** Flex is the "none of the above" template — always consider it when the use case is custom or doesn't fit the first three.

---

## 4. Predictive vs. Generative vs. Agentic AI

| Feature | Predictive AI | Generative AI | Agentic AI |
|---------|--------------|---------------|------------|
| **What it does** | Forecasts an outcome from historical patterns | Creates new content (text, images, code) | Plans and executes multi-step tasks autonomously |
| **Output type** | Score, probability, classification | Text, image, audio, code | Actions taken across systems |
| **Data type** | Primarily structured | Primarily unstructured | Both |
| **Salesforce example** | Einstein Lead Scoring, Opportunity Scoring | Copilot email drafts, Prompt Builder output | Agentforce autonomous agents |
| **Underlying tech** | Traditional ML (regression, decision trees) | Large Language Models (LLMs), transformers | LLM + tool use + reasoning + orchestration |
| **Human interaction** | Scores surface to humans; humans decide | Human provides prompt; AI generates | AI acts, humans may only review final output |

---

## 5. Key Definitions to Memorize

| Term | Exam-Ready Definition |
|------|----------------------|
| **Hallucination** | When an LLM generates confident but factually incorrect or entirely fabricated information |
| **Grounding** | Connecting AI outputs to verified, real data (e.g., CRM records, knowledge base) to prevent hallucination |
| **RAG** | Retrieval-Augmented Generation — retrieve relevant context first, then generate a grounded AI response |
| **Token** | The basic unit of text an LLM processes — roughly one word or word fragment; context windows and pricing measured in tokens |
| **Context Window** | The maximum amount of text (in tokens) an LLM can receive as input in a single interaction |
| **LLM** | Large Language Model — an AI model trained on massive text datasets to understand and generate human language |
| **Zero-shot prompting** | Asking the model to complete a task with NO examples provided |
| **Few-shot prompting** | Providing 2–5 examples of the desired output BEFORE the actual task to guide the model's response |
| **Fine-tuning** | Permanently retraining a model on new labeled data to specialize its behavior (modifies model weights) |
| **Prompt injection** | A security attack where malicious input tries to override the AI's instructions and change its behavior |
| **Vector embedding** | Converting text into a list of numbers that preserves semantic meaning — similar meanings produce similar vectors |
| **Semantic search** | Finding content based on meaning similarity, not exact word match — enabled by vector embeddings |

---

## 6. AI Fundamentals Quick Reference

### Learning Types

| Type | How it learns | Label required? | Salesforce example |
|------|--------------|-----------------|-------------------|
| **Supervised** | From labeled historical examples with known outcomes | Yes | Einstein Lead Scoring, Opportunity Scoring |
| **Unsupervised** | Finds its own patterns in unlabeled data | No | Customer segmentation, anomaly detection |
| **Reinforcement** | From reward/penalty signals through trial and error | No (uses reward) | RLHF alignment of LLMs |

### Model Performance Concepts

| Concept | Pattern | Cause | Fix |
|---------|---------|-------|-----|
| **Overfitting** | High training accuracy, low test accuracy | Memorized data; model too complex | More data, simpler model, regularization |
| **Underfitting** | Low accuracy on both | Model too simple; too little data | More features, more complex model |
| **Good fit** | Similar accuracy on training and test | Learned generalizable patterns | — |
| **Model drift** | Accuracy degrades over time | Real-world patterns changed | Retrain on current data |

### Data Split (Training Pipeline)

```
All labeled data
     |
     ├── Training Set (~70%)  →  Model LEARNS from this
     ├── Validation Set (~15%) →  Used to TUNE the model (practice exam)
     └── Test Set (~15%)      →  Final HONEST evaluation (real exam)
```

**Rule:** Test set must NEVER be seen during training or tuning.

---

## 7. Data Quality Dimensions — 6 Dimensions

| Dimension | Definition | Bad Example | AI Impact |
|-----------|-----------|-------------|-----------|
| **Accuracy** | Data correctly represents reality | Phone: "555-1234" (placeholder) | Model learns wrong patterns |
| **Completeness** | All required fields have values | Annual Revenue blank on 70% of leads | AI has no signal for missing fields |
| **Consistency** | Data agrees across systems and over time | "Technology" spelled 34 different ways | Unified profiles are incoherent |
| **Timeliness** | Data is current | Job title from 5 years ago | AI recommends based on stale context |
| **Validity** | Data conforms to rules/formats | Close date = 1/1/1900 | Numerical models distorted |
| **Uniqueness** | Each entity appears once | Same customer as 3 lead records | Conflicting signals; inflated counts |

**Memory trick:** **A**ll **C**ompanies **C**onsistently **T**rack **V**alid **U**nique data

---

## 8. Data Cloud Quick Reference

| Concept | What it is |
|---------|-----------|
| **Data Cloud** | Salesforce's Customer Data Platform — unifies data from all sources into a single customer view |
| **Data Streams** | Connectors that ingest data from external systems into Data Cloud |
| **Identity Resolution** | Cross-system record matching and merging into a Unified Individual |
| **Unified Individual** | The merged, de-duplicated profile representing one real customer |
| **Calculated Insights** | Custom computed metrics (LTV, churn risk, propensity) stored on Unified Profiles |
| **Einstein Vector Store** | Data Cloud's vector database for storing embeddings; enables semantic search by Agentforce |
| **Segments** | Groups of Unified Profiles meeting defined criteria — used for marketing and AI targeting |

**The Data Cloud AI flow:** Data Streams → Identity Resolution → Unified Profile → Calculated Insights → Ground Agentforce via RAG

---

## 9. Agentforce Architecture Reference

| Component | Purpose |
|-----------|---------|
| **Agent** | The AI entity that handles customer or employee interactions |
| **Topics** | Defines what subjects/tasks the agent is authorized to handle |
| **Actions** | The specific operations an agent can perform (look up a record, create a case, send an email) |
| **Agent Builder** | The no-code/low-code tool (formerly Copilot Studio) for configuring agents |
| **Data Cloud grounding** | Provides real-time customer context to the agent before response generation |
| **Einstein Trust Layer** | Security layer that protects data in transit to/from external LLMs |

---

## 10. Top 10 Exam Traps

**Trap 1: "Einstein Scoring uses pre-built models"**
Wrong. Einstein Lead/Opportunity Scoring trains personalized models on YOUR org's data. Enough historical outcomes are required.

**Trap 2: "Transparency means publishing source code"**
Wrong. Transparency means explaining how and when AI is used and the basis for decisions — not open-sourcing models.

**Trap 3: "High overall accuracy = fair AI"**
Wrong. A model can have high average accuracy but systematically fail for specific demographic groups (disparate impact). Fairness requires equal performance across groups.

**Trap 4: "Duplicate Rules handle cross-system duplicates"**
Wrong. Salesforce Duplicate Rules only work within a single Salesforce org. Cross-system duplicate resolution is Identity Resolution in Data Cloud.

**Trap 5: "Fine-tuning and few-shot prompting are the same"**
Wrong. Fine-tuning permanently updates model weights through retraining. Few-shot prompting guides the model with examples in the prompt — no model modification, no training cost.

**Trap 6: "Data Cloud is just a marketing tool"**
Wrong. Data Cloud is the AI data foundation for ALL Salesforce AI features — Sales, Service, Agentforce — not just marketing campaigns.

**Trap 7: "Einstein Trust Layer prevents unauthorized logins"**
Wrong. The Trust Layer protects data sent to external AI providers. User authentication and login security are handled by Salesforce Identity/MFA features.

**Trap 8: "LLMs update their knowledge in real time from the internet"**
Wrong. Standard LLMs have a fixed training cutoff. They don't browse the internet by default. Real-time knowledge requires grounding via RAG or explicit search tool integrations.

**Trap 9: "An overfitting model should be deployed — it has 98% accuracy!"**
Wrong. 98% training accuracy paired with low test accuracy means the model memorized training data and will perform poorly in production. High training accuracy alone is not a deployment green light.

**Trap 10: "RAG = fine-tuning"**
Wrong. RAG retrieves external knowledge at inference time and adds it to the prompt — the model itself is unchanged. Fine-tuning modifies the model. RAG is cheaper, faster, and more flexible for keeping AI responses grounded in current, specific data.

---

## 11. Last 24 Hours Checklist

### Knowledge Check (Can you answer these cold?)
- [ ] Name all 5 Salesforce Trusted AI Principles
- [ ] Name all 4 Einstein Trust Layer components and their functions
- [ ] Name all 4 Prompt Builder template types and their use cases
- [ ] Define: hallucination, grounding, RAG, token, context window
- [ ] Explain overfitting vs. underfitting — pattern + cause + fix
- [ ] Name all 6 data quality dimensions with one example each
- [ ] Explain Identity Resolution and what it solves
- [ ] Explain Calculated Insights and give two examples
- [ ] Distinguish supervised vs. unsupervised vs. reinforcement learning
- [ ] Distinguish predictive vs. generative vs. agentic AI with a Salesforce example of each

### Exam Day Logistics
- [ ] Register via webassessor.com (Salesforce's testing partner)
- [ ] Confirm exam format: 40 questions, 70 minutes, multiple choice
- [ ] Have valid government-issued photo ID ready
- [ ] Test your internet and webcam (if proctored online)
- [ ] Find a quiet, well-lit space with a clean desk
- [ ] Close all unnecessary tabs and applications before starting

### Strategy During the Exam
- [ ] Read ALL four answer choices before selecting — wrong answers are designed to look right
- [ ] Eliminate obviously wrong answers first (usually 1–2 per question)
- [ ] On scenario questions: identify what the scenario is asking (feature? concept? cause? fix?)
- [ ] Flag uncertain questions and return — don't get stuck
- [ ] Watch for absolute words: "always," "never," "only" — these are often wrong
- [ ] Watch for Salesforce-specific terminology — if a concept has a Salesforce name, use it
- [ ] You have 105 seconds per question — don't rush, don't linger

---

## QUICK REFERENCE: Einstein AI Feature Taxonomy

| Category | Feature | Type | What it does |
|----------|---------|------|-------------|
| Scoring | Lead Scoring | Predictive | Ranks leads by conversion probability |
| Scoring | Opportunity Scoring | Predictive | Ranks deals by close probability |
| Insights | Opportunity Insights | Predictive | Surfaces signals about deal health |
| Service | Case Classification | Predictive | Auto-assigns case fields |
| Service | Article Recommendations | Predictive | Suggests KB articles for cases |
| Service | Case Summarization | Generative | Writes narrative case summaries |
| Sales | Email Generation | Generative | Drafts personalized sales emails |
| Platform | Prompt Builder | Generative | Admin-configured reusable AI prompts |
| Platform | Agentforce | Agentic | Autonomous multi-step AI agents |
| Platform | Next Best Action | Predictive+Rule | Recommends contextual actions |
| Data | Data Cloud | Foundation | Unifies data for all AI features |
| Security | Einstein Trust Layer | Protection | Secures AI data flow |
