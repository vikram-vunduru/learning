# Einstein Trust Layer

**Exam Domain:** Einstein Trust Layer (38% of exam — HIGHEST WEIGHT)
**Study Priority:** CRITICAL — know all 4 components, what each does, and what problems they solve

---

## Core Concepts

**Einstein Trust Layer:** Salesforce's security and safety architecture that sits between your Salesforce org and any external LLM. It ensures that generative AI can be used with enterprise-grade data protection, privacy compliance, and governance.

**Why it exists:** Enterprise customers won't adopt AI if their customer data might be:
1. Sent to an LLM provider and retained for training
2. Exposed as PII in prompts to third-party systems
3. Used to generate harmful/offensive content
4. Untraceable (no audit capability)

The Trust Layer solves all four.

---

### The 4 Components (Memorize These)

| # | Component | What It Does | Problem It Solves |
|---|-----------|-------------|-------------------|
| **1** | **Data Masking** | Detects and masks PII (names, emails, phone numbers, SSNs) in prompts BEFORE sending to external LLM | PII exposure to third-party LLM providers |
| **2** | **Zero Data Retention (ZDR)** | Contractual + technical guarantee that LLM provider cannot store, log, or train on data from your prompts | LLM provider using customer data for model training |
| **3** | **Toxicity Scoring** | Evaluates LLM response for harmful, offensive, discriminatory, or dangerous content; filters/blocks before reaching user | Harmful AI outputs harming customers or employees |
| **4** | **Audit Trail** | Logs every AI interaction: who invoked AI, what prompt was sent, what response was received, timestamp | Accountability, compliance, debugging, governance |

---

### Data Masking — Deep Dive

**How it works:**
1. Prompt is analyzed for PII before sending to LLM
2. PII entities (names, SSNs, account numbers, etc.) are replaced with tokens (e.g., `{PERSON_1}`, `{ACCOUNT_NUM_1}`)
3. Masked prompt sent to LLM
4. LLM generates response using the token
5. Salesforce detokenizes the response — replaces token with original value
6. User sees unmasked, contextually correct response

**What gets masked:** Names, email addresses, phone numbers, SSNs, credit card numbers, addresses, and other PII as defined by Salesforce's PII detection model.

**Key exam point:** Masking happens BEFORE the prompt reaches the LLM. The LLM never sees the real PII.

---

### Zero Data Retention (ZDR) — Deep Dive

**What it means:**
- The LLM API provider (e.g., OpenAI, Anthropic) is contractually bound to NOT:
  - Store the prompt content
  - Log it in server logs
  - Use it for future model training
  - Share it with third parties

**What it does NOT mean:**
- ZDR does NOT mean Salesforce doesn't log the interaction — Salesforce does log it (Audit Trail)
- ZDR does NOT affect the quality or accuracy of LLM responses
- ZDR does NOT prevent hallucinations

---

### Toxicity Scoring — Deep Dive

**How it works:**
1. LLM generates a response
2. Response is analyzed by a toxicity scoring model before being returned to the user
3. If toxicity score exceeds threshold → response is blocked, user gets a safe error message
4. If below threshold → response is delivered to user

**What "toxic" means:** Hateful, discriminatory, violent, sexually explicit, harassing, dangerous/illegal activity promotion.

**Key exam point:** Toxicity scoring filters OUTPUTS (LLM responses). It does not filter inputs (user prompts).

---

### Audit Trail — Deep Dive

**What it captures:**
- Which user invoked the AI feature
- The fully resolved prompt (with merge field values)
- The LLM's response
- Timestamp
- Which Prompt Builder template was used (if applicable)

**Where to find it:** Setup → AI Activity → AI Audit Trail (or similar path depending on Salesforce release)

**Why it matters for compliance:** Regulated industries (financial services, healthcare, government) may require logging of all AI-assisted decisions. The Audit Trail provides this.

---

## PTA / SA Relevance

**The Trust Layer is your primary answer to enterprise AI objections:**

| Customer Objection | Trust Layer Answer |
|-------------------|-------------------|
| "We can't send customer data to OpenAI" | Data Masking + ZDR: PII is masked before leaving your org, and the provider can't retain or train on it |
| "How do we know the AI isn't storing our data?" | ZDR: contractual and technical guarantee with our LLM partners |
| "What if the AI generates offensive content to our customers?" | Toxicity Scoring filters harmful outputs before they reach users |
| "How can we audit AI decisions for compliance?" | Audit Trail logs every AI interaction with full detail |
| "What about GDPR/data residency?" | Data Masking + ZDR together address the core GDPR concerns for AI |

**CTO-level framing:**
- "Einstein Trust Layer is the reason Salesforce can offer enterprise AI without enterprises having to choose between AI capability and data governance. It's not a feature you configure — it's the foundational architecture that all Einstein generative AI runs on top of."
- The Trust Layer is what differentiates Salesforce's AI offering from wiring up ChatGPT directly to your CRM via API.

**Architecture consideration at scale:**
- Data Masking adds ~100-200ms latency per LLM call (detection + tokenization + detokenization)
- Audit Trail storage grows proportionally with AI usage — plan for data retention policies
- ZDR agreements vary by LLM provider; verify coverage for any non-standard LLM configuration

---

## Trust Layer Architecture (Enterprise View)

```
╔════════════════════════════════════════════════════════════════════════╗
║              EINSTEIN TRUST LAYER — COMPLETE FLOW                      ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  SALESFORCE ORG                                                        ║
║  ┌──────────────────────────────────────────────────────────────────┐  ║
║  │ User invokes AI (Prompt Builder / Agentforce / Copilot)          │  ║
║  │ Prompt template + merge fields → fully resolved prompt           │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  ═══════════════ TRUST LAYER ══════════════════════════════════════   ║
║                                     │                                  ║
║  STEP 1: DATA MASKING (INPUT)        │                                  ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ PII Scanner: "Contact is John Smith, email: j@acme.com"        │  ║
║  │             → "Contact is {PERSON_1}, email: {EMAIL_1}"        │  ║
║  │ Masked prompt proceeds; mapping stored for detokenization       │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  STEP 2: ZDR BOUNDARY                │                                  ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ Masked prompt sent to LLM provider (OpenAI / Anthropic / etc.) │  ║
║  │ ZDR contract: provider cannot retain, log, or train on this    │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  EXTERNAL LLM (outside Salesforce boundary)                            ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ Generates response: "Here is a summary for {PERSON_1}..."       │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  STEP 3: TOXICITY SCORING (OUTPUT)   │                                  ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ Toxicity model evaluates response                              │  ║
║  │ If score < threshold: proceed                                  │  ║
║  │ If score ≥ threshold: BLOCK response, return safe error        │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  STEP 4: DETOKENIZE + AUDIT LOG      │                                  ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ {PERSON_1} → John Smith (original value restored)              │  ║
║  │ Full interaction logged to Audit Trail                         │  ║
║  └──────────────────────────────────┬─────────────────────────────┘  ║
║                                     │                                  ║
║  ══════════════════════════════════════════════════════════════════   ║
║                                     │                                  ║
║  ┌──────────────────────────────────▼─────────────────────────────┐  ║
║  │ User sees: "Here is a summary for John Smith..."               │  ║
║  └────────────────────────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════════════════════════╝
```

**Limitations of the Einstein Trust Layer:**
- Data Masking can produce false positives (masking non-PII data) or false negatives (missing custom PII formats) — review masking accuracy for your specific data types
- ZDR applies to LLM providers that have signed Salesforce's ZDR agreement — not all potential LLM providers have this agreement; BYOM scenarios require verification
- Toxicity Scoring filters explicit harmful content; subtle bias or misleading (but non-toxic) outputs are not caught by toxicity scoring
- Audit Trail records full prompt content — this itself may create data retention/compliance considerations (the audit trail stores what you sent to the LLM, which may include customer data)
- The Trust Layer does not prevent hallucinations — accuracy of LLM output is a separate concern from data safety

---

## Key Facts to Memorize

- **4 components**: Data Masking, Zero Data Retention (ZDR), Toxicity Scoring, Audit Trail
- **Data Masking**: PII removed from prompt BEFORE reaching LLM; detokenized after LLM responds
- **ZDR**: LLM provider cannot retain or train on your data; contractual guarantee
- **Toxicity Scoring**: Filters LLM OUTPUT before it reaches the user
- **Audit Trail**: Every AI interaction logged — who, what prompt, what response, when
- Trust Layer is NOT optional — it is the architecture all Einstein generative AI runs on
- Trust Layer handles data PRIVACY and OUTPUT SAFETY — it does NOT improve accuracy or prevent hallucinations

---

## Exam Traps

**Trap 1:** "The Audit Trail prevents data from being sent to the LLM." WRONG. Audit Trail is a logging mechanism — it records what happened after the fact. Data Masking controls what gets sent to the LLM.

**Trap 2:** "Zero Data Retention means Salesforce doesn't store any AI interaction data." WRONG. ZDR applies to the external LLM provider. Salesforce itself does store AI interactions in the Audit Trail.

**Trap 3:** "Toxicity Scoring filters user prompts for harmful content." WRONG. Toxicity Scoring evaluates LLM responses (outputs). User prompts go through Data Masking (for PII), not toxicity scoring.

**Trap 4:** "Enabling the Trust Layer prevents hallucinations." WRONG. The Trust Layer handles data privacy (masking), data retention (ZDR), harmful content (toxicity), and accountability (audit). Hallucination is an accuracy problem, not a safety problem — grounding (Data Cloud/RAG) is the hallucination mitigation.

**Trap 5:** "Data Masking encrypts PII." WRONG. Masking replaces PII with tokens (pseudonymization). It is not encryption. The original values are stored in a mapping and restored after the LLM responds.

---

## Practice Questions

**Q1: A financial services company wants to use Einstein Copilot but is concerned that confidential client names and account numbers included in prompts could be exposed to the LLM provider. Which Trust Layer component directly addresses this concern?**

A) Zero Data Retention
B) Toxicity Scoring
C) Data Masking
D) Audit Trail

**Answer: C** — Data Masking detects and replaces PII (names, account numbers) with tokens BEFORE the prompt leaves Salesforce and reaches the LLM provider. The LLM never sees the actual PII. ZDR prevents the provider from storing the data, but masking prevents the PII from being exposed in the first place.

---

**Q2: An Agentforce Service Agent occasionally generates responses that could be considered inappropriate for a professional customer service context. Which Trust Layer component is designed to prevent these responses from reaching customers?**

A) Data Masking
B) Zero Data Retention
C) Audit Trail
D) Toxicity Scoring

**Answer: D** — Toxicity Scoring evaluates LLM responses before they are returned to the user. If the response exceeds the toxicity threshold, it is blocked. Data Masking handles PII in prompts. ZDR is about data retention. Audit Trail is logging.

---

**Q3: A compliance team needs to review every AI interaction that occurred over the past 30 days — specifically who invoked AI, what data was included in the prompt, and what the LLM returned — to satisfy a regulatory audit. Which Trust Layer capability provides this?**

A) Zero Data Retention
B) Data Masking
C) Toxicity Scoring
D) Audit Trail

**Answer: D** — The Audit Trail logs every AI interaction, including user identity, the full resolved prompt, and the LLM response, with timestamps. This is exactly what a regulatory audit requires.

---

**Q4: A Trust Layer question in a different format: An LLM response contains subtle but incorrect legal information. The Trust Layer's Toxicity Scoring did not flag or block it. Which of the following BEST explains this outcome?**

A) Toxicity Scoring was not configured correctly
B) Zero Data Retention caused the LLM to not have enough context
C) Toxicity Scoring detects harmful/offensive content, not factual inaccuracies — hallucinations are not caught by this mechanism
D) The Trust Layer needs to be re-enabled to catch legal inaccuracies

**Answer: C** — Toxicity Scoring identifies harmful, offensive, or dangerous content. Factual inaccuracies (hallucinations) are a separate category that toxicity models are not designed to detect. The solution for factual accuracy is grounding with verified data sources, not Trust Layer components.
