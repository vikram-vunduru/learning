# Einstein Trust Layer — Deep Study Notes

**Source:** Video study notes on the highest-weight exam domain (38%)
**Why this is critical:** The Trust Layer appears in ~15 of the 40 exam questions — either directly asked or as an answer choice in ethics/AI capability scenarios

---

## The Core Problem Trust Layer Solves

Enterprise companies won't use generative AI with their customer data unless they have answers to:
1. "Will our customer PII be sent to OpenAI/Anthropic?" → **Data Masking**
2. "Can the LLM provider train on our data?" → **Zero Data Retention**
3. "What if the AI generates something offensive to a customer?" → **Toxicity Scoring**
4. "How do we audit AI decisions for compliance?" → **Audit Trail**

The Trust Layer makes enterprise AI adoption possible by addressing all four.

---

## Deep Notes: Each Component

### Data Masking

**The mechanism:**
1. Salesforce analyzes the fully resolved prompt (after merge fields are substituted with real values)
2. PII detection model identifies entities: names, email addresses, phone numbers, SSNs, account numbers, addresses
3. Each PII entity is replaced with a structured token: `{PERSON_1}`, `{EMAIL_1}`, `{PHONE_1}`
4. The token-to-value mapping is stored temporarily by Salesforce
5. Masked prompt sent to LLM
6. LLM generates response using token (e.g., "Dear {PERSON_1}, your account...")
7. Salesforce restores original values: "{PERSON_1}" → "John Smith"
8. User sees complete, personalized response

**Practical implication:** The LLM provider NEVER sees actual PII. If a breach occurred at the LLM provider level, no actual customer data would be exposed from Salesforce prompts.

**Edge cases to know:**
- Custom PII formats (employee ID numbers, custom field patterns) may not be automatically detected — admins can configure additional masking rules
- Masking is not perfect — very unusual PII formats may slip through
- Masking is NOT encryption — it's pseudonymization (replacing with tokens)

---

### Zero Data Retention (ZDR)

**What the contractual agreement covers:**
- LLM provider does NOT log prompt content in their standard server logs
- LLM provider does NOT use prompt content for future model training
- LLM provider does NOT share prompt content with third parties
- Data is used only for generating the immediate response and then discarded

**What ZDR is NOT:**
- ZDR does not mean no latency (the LLM still processes the prompt to generate a response)
- ZDR does not mean Salesforce doesn't store the interaction (Salesforce does, in the Audit Trail)
- ZDR does not prevent the LLM from generating a wrong response (accuracy ≠ data retention)
- ZDR applies to partners with whom Salesforce has executed this agreement — not every possible LLM

**The key exam trap:** "ZDR means the LLM can't be wrong because it has no stored data." WRONG. ZDR only governs data retention. Response quality is completely separate.

---

### Toxicity Scoring

**What it catches:**
- Hate speech / discriminatory language
- Violent or threatening content
- Sexually explicit content
- Promotion of illegal activities
- Harassment

**What it does NOT catch:**
- Factual inaccuracies / hallucinations (wrong but not harmful)
- Misleading statements that sound plausible
- Subtle bias in language (slight demographic differences in how groups are described)
- Off-topic responses

**The threshold question:** Toxicity scoring uses a probability threshold. Responses above the threshold are blocked; below it are delivered. This means:
- Some borderline content may get through (false negatives)
- Some borderline content may be incorrectly blocked (false positives)
- The threshold is set by Salesforce to balance safety with utility

**User experience when blocked:** The user receives a safe fallback message (e.g., "I'm unable to provide a response to that.") — they don't see the toxic content that was generated.

---

### Audit Trail

**What each log entry captures:**
- User identity (who ran the AI feature)
- The fully resolved prompt that was sent (with merge field values, before masking)
- The response received from the LLM
- Timestamp
- Which Einstein feature/template was used
- Whether the response was delivered or blocked by toxicity scoring

**Access:** Setup → Einstein → AI Activity (path may vary by Salesforce release)

**Compliance use cases:**
- Financial services: demonstrate which AI-generated communications were sent to customers
- Healthcare: audit trail for any AI-assisted clinical recommendations
- Legal: document what the AI was told and what it said for discovery purposes
- General: incident investigation if an AI response caused customer harm

**Retention policy:** Audit trail logs have a retention period — plan your compliance data retention requirements accordingly.

---

## Common Exam Question Patterns on Trust Layer

### Pattern 1: "Which component handles this problem?"
Given a scenario describing a concern, identify which Trust Layer component addresses it.
- "Concerned LLM provider will store our data" → ZDR
- "Worried customer PII will go to external LLM" → Data Masking
- "Worried AI will generate offensive content" → Toxicity Scoring
- "Need to audit who used AI and what was generated" → Audit Trail

### Pattern 2: "What does NOT prevent [X]?"
- "What does NOT prevent hallucinations?" → All 4 Trust Layer components (it's RAG/grounding that prevents hallucinations)
- "What does NOT prevent the LLM from seeing PII?" → ZDR (ZDR is about retention, not visibility; Data Masking prevents visibility)

### Pattern 3: "Put the flow in order"
The Trust Layer processes in this order:
1. Merge fields resolved (Salesforce, not Trust Layer)
2. Data Masking (PII tokenized) — INPUT
3. ZDR boundary (sent to external LLM under ZDR agreement)
4. LLM generates response
5. Toxicity Scoring (response evaluated) — OUTPUT
6. Detokenization (PII restored) — OUTPUT
7. Audit log created

---

## Trust Layer Practice Questions

**Q1: A company uses Agentforce for customer service. They want to ensure that their customers' account numbers and names in the conversation are not visible to the LLM provider's systems. Which component addresses this?**

A) Zero Data Retention
B) Audit Trail
C) Toxicity Scoring
D) Data Masking

**Answer: D** — Data Masking replaces PII (names, account numbers) with tokens BEFORE the prompt is sent to the LLM provider. The provider never sees the actual values. ZDR prevents the provider from storing what they receive, but Data Masking prevents them from receiving PII in the first place.

---

**Q2: After reviewing Einstein AI usage, a compliance officer needs to demonstrate to regulators that the company has an auditable record of every AI-generated communication with customers. What provides this?**

A) Zero Data Retention documentation
B) Toxicity Scoring reports
C) Einstein Audit Trail
D) Data Masking logs

**Answer: C** — The Audit Trail provides a logged record of every AI interaction: who invoked AI, what prompt was sent, what response was returned, and when. This is exactly what a compliance audit requires.

---

**Q3: An Agentforce agent generated a response that contained factually incorrect information about a product's warranty terms — information that wasn't harmful or offensive, just wrong. Which Trust Layer component should have caught this?**

A) Data Masking
B) Toxicity Scoring
C) None — the Trust Layer is not designed to detect factual inaccuracies (hallucinations)
D) ZDR

**Answer: C** — Factual inaccuracy is hallucination, not toxic content. Toxicity Scoring detects harmful/offensive content, not wrong facts. The Trust Layer addresses data privacy and safety, not response accuracy. Grounding with verified data (RAG) is the appropriate mitigation for factual inaccuracies.
