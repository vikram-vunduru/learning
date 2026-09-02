# Hallucinations, Bias, and LLM Limitations

**Exam Domain:** Ethical Considerations (20%) + Einstein Trust Layer (38%)
**Study Priority:** HIGH — hallucinations and bias are heavily tested via real-world scenarios

---

## Core Concepts

### Hallucinations

**Definition:** When an LLM generates confident-sounding but factually incorrect or fabricated information.

**Root cause:** LLMs predict statistically likely tokens based on training data patterns. They do NOT retrieve facts from a database. If the correct answer isn't well-represented in training data — or if asked about very specific/recent information — the model generates plausible-sounding text that may be wrong.

**Types of hallucinations:**
| Type | Example |
|------|---------|
| **Factual hallucination** | Stating a wrong product price, incorrect policy detail |
| **Confabulation** | Making up citations, references, or statistics that seem plausible |
| **Context hallucination** | Misreading or ignoring context in the prompt and generating off-topic content |

**How Salesforce mitigates hallucinations:**
1. **Grounding**: Data Cloud + RAG injects relevant, current CRM data into the prompt as authoritative context
2. **Prompt instructions**: Explicitly telling the LLM "If you don't have enough information, say so. Do not fabricate."
3. **Human review**: Einstein generative features surface drafts for human review — AI output doesn't go directly to customers without a human touchpoint (by default)
4. **Einstein Trust Layer toxicity scoring**: Filters harmful content but NOT incorrect factual content — hallucinations get through the Trust Layer unless grounded context makes the right answer available

**What does NOT prevent hallucinations:**
- Toxicity scoring (handles harm, not accuracy)
- Data masking (handles PII, not accuracy)
- Zero Data Retention (handles data privacy, not accuracy)

---

### LLM Bias

Bias in LLMs originates from training data that overrepresents or underrepresents certain groups, viewpoints, or topics.

| Bias Type | Description | Example |
|-----------|------------|---------|
| **Training Data Bias** | Biased content in pre-training corpus | LLM trained on internet text absorbs societal biases |
| **Representation Bias** | Certain demographics underrepresented in training data | Worse performance on non-English languages |
| **Amplification Bias** | Model amplifies biases present in training data | Gender stereotypes in professional role descriptions |

**Important**: LLM bias is different from ML model bias (lecture-16). Both are on the exam. ML model bias (Einstein Prediction Builder) stems from biased labeled training data specific to your org. LLM bias is baked into the pre-trained model by the LLM provider.

---

### Other LLM Limitations

| Limitation | Description | Salesforce Implication |
|-----------|------------|----------------------|
| **No real-time knowledge** | LLMs have a training cutoff date | Use grounding for current product/pricing/policy information |
| **Context window limit** | Can't process text beyond a token limit | Long documents truncated; may miss important context |
| **No persistent memory** | Each conversation starts fresh | Agent conversation history must be explicitly maintained |
| **Mathematical reasoning** | LLMs are poor at precise arithmetic | Don't use for financial calculations; use Apex/Formula fields |
| **Sensitive to prompt wording** | Minor prompt changes can produce different outputs | Test templates across diverse scenarios before activating |
| **Cost per call** | Every LLM invocation costs tokens | High-volume deployments need usage monitoring |

---

## PTA / SA Relevance

**In customer architecture reviews:**
- The #1 customer concern with Agentforce in customer-facing deployments: "What if it says something wrong to a customer?" The answer: human-in-the-loop review + grounding with verified CRM data + clear prompt instructions that tell the agent what to do when uncertain.
- For regulated industries (financial services, healthcare): hallucinations are not just embarrassing — they can be compliance violations. Human review is mandatory, not optional.

**CTO/CPO framing:**
- "LLMs are probabilistic, not deterministic. The way to make them reliable in enterprise contexts is: 1) ground them with your data, 2) constrain their behavior with precise prompt instructions, 3) keep a human in the loop for consequential outputs."
- "Bias in LLMs is real — it's inherited from internet-scale training data. Salesforce publishes model cards for Einstein features that disclose known bias characteristics and mitigation approaches."

**Enterprise design patterns to reduce hallucinations:**
1. **Mandatory grounding**: All Agentforce actions should retrieve relevant CRM/Data Cloud data before generating responses — never generate from model memory alone for factual queries
2. **Escalation for uncertainty**: Prompt instructions should include "If you are uncertain or lack information to answer confidently, escalate to a human agent"
3. **Output validation**: For structured outputs (JSON, specific fields), validate format and range post-generation before writing to records
4. **Audit trail review**: Einstein audit trail logs show what prompts were sent and what was returned — enable for all production deployments to spot hallucination patterns

---

## Hallucination Prevention Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║            HALLUCINATION MITIGATION LAYERS (ENTERPRISE)              ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  LAYER 1: GROUNDING (most effective)                                 ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Data Cloud / Vector Store → retrieves relevant facts         │    ║
║  │ and injects into prompt as authoritative context             │    ║
║  │ Effect: LLM answers from real data, not model memory        │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  LAYER 2: PROMPT DESIGN                                              ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ "Only use information explicitly provided in the context.    │    ║
║  │  If unsure, say 'I don't have enough information to answer  │    ║
║  │  this accurately. Let me connect you with a specialist.'"   │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  LAYER 3: HUMAN REVIEW                                               ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ AI-generated drafts surfaced for human approval              │    ║
║  │ before delivery to customer (for high-stakes outputs)        │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  LAYER 4: MONITORING & FEEDBACK                                      ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Einstein Audit Trail → review what was generated             │    ║
║  │ User feedback mechanisms → flag inaccurate outputs           │    ║
║  │ Regular prompt template review and improvement               │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Limitations of hallucination mitigation:**
- Grounding only helps if the relevant data actually exists in Salesforce/Data Cloud. "Unknown unknowns" — questions the system has no data to answer — still risk hallucination
- Human review creates latency; not all use cases can accommodate a review step before responding
- Audit trail captures the interaction but cannot automatically flag hallucinations — requires human spot-checking or QA processes
- There is no current technical mechanism that guarantees 100% hallucination-free LLM outputs

---

## Key Facts to Memorize

- **Hallucinations** = LLM generates plausible but factually incorrect content
- Root cause: token prediction, not fact lookup
- **Grounding** = primary mitigation (inject real data into prompt)
- Toxicity scoring, ZDR, and data masking do NOT prevent hallucinations
- LLM bias comes from training data; Salesforce publishes model cards to disclose
- LLMs have no real-time knowledge — training cutoff date applies
- Context window = max tokens; long docs may be truncated
- LLMs are poor at math — use Apex/formulas for calculations

---

## Exam Traps

**Trap 1:** "The Einstein Trust Layer's toxicity scoring prevents hallucinations." WRONG. Toxicity scoring filters harmful/offensive content. Hallucinations are inaccurate content, not harmful content (though they can become harmful). Different problems, different solutions.

**Trap 2:** "Zero Data Retention prevents the LLM from generating incorrect information." WRONG. ZDR is a data privacy protection. It prevents the LLM provider from training on your data. It has no effect on hallucination rate.

**Trap 3:** "Grounding eliminates hallucinations entirely." WRONG. Grounding significantly reduces hallucinations for questions where relevant context is available. It does not eliminate hallucinations for questions outside the grounded context.

**Trap 4:** "LLM bias is the same as Einstein Prediction Builder bias." Related but different. LLM bias is in the foundation model's weights from training. Einstein Prediction Builder bias comes from biased labeled training data in your specific org.

---

## Practice Questions

**Q1: An Agentforce Service Agent occasionally generates case resolution summaries that include technical details not found anywhere in the case record or knowledge base. This is an example of which LLM limitation?**

A) Context window overflow
B) Hallucination
C) Bias amplification
D) Insufficient grounding data

**Answer: B** — The agent is generating confident-sounding content that isn't supported by the available data. This is hallucination — the LLM predicting plausible text rather than grounding its response in verified information. The correct mitigation is stronger grounding with RAG and explicit prompt instructions to only use provided context.

---

**Q2: A company is concerned that their Agentforce deployment might generate biased responses in their customer service use case. Which of the following is the most effective first step to address this concern?**

A) Enable Zero Data Retention (ZDR) to prevent bias
B) Increase prompt temperature to generate more diverse responses
C) Review Einstein model cards for known bias characteristics and test the agent's outputs across diverse customer demographic scenarios
D) Fine-tune the LLM to remove all bias

**Answer: C** — Model cards disclose known bias characteristics of Einstein AI models. Testing across diverse demographic scenarios identifies whether bias manifests in your specific use case. ZDR is a privacy protection. Temperature affects creativity, not bias. Fine-tuning to remove bias is technically very complex and doesn't guarantee success.

---

**Q3: Which combination of approaches best reduces hallucination risk for an Agentforce customer service agent handling billing inquiries?**

A) ZDR + Toxicity Scoring + Audit Trail
B) Data Cloud grounding with current billing data + Prompt instructions to escalate when uncertain + Human review of AI responses before delivery
C) Higher model temperature + Fewer merge fields in prompt templates
D) Fine-tuning the LLM with historical billing records

**Answer: B** — This is the three-layer mitigation approach: grounding with real data (reduces factual errors), instructions for uncertainty handling (prevents confident wrong answers), and human review (catches errors before customer impact). ZDR/Toxicity/Audit Trail address privacy and harmful content, not accuracy. Fine-tuning has the data staleness problem.
