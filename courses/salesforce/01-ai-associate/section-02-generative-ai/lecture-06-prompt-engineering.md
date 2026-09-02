# Prompt Engineering

**Exam Domain:** Einstein Trust Layer (38%) + AI Capabilities of CRM (8%)
**Study Priority:** HIGH — Prompt Builder is tested on architecture AND practical application

---

## Core Concepts

**Prompt:** The input text sent to a large language model. The quality of the prompt directly determines the quality of the output.

**Prompt Engineering:** The discipline of crafting, structuring, and optimizing prompts to reliably produce desired LLM outputs.

**Why prompt engineering matters for Salesforce:**
- Salesforce's primary interface for customizing generative AI behavior is Prompt Builder (admin tool)
- Prompts are crafted ONCE and reused as templates — bad template design = consistently bad outputs at scale
- Merge fields in Prompt Builder inject CRM data into the prompt before it goes to the LLM

---

### Prompt Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **System instruction** | Sets the LLM's role and behavioral guidelines | "You are a professional sales assistant. Be concise and factual." |
| **Context** | Background data injected via merge fields | `{!$Record.Account.Name}`, `{!$Record.Description}` |
| **Task** | The specific instruction | "Write a 3-sentence follow-up email." |
| **Format instruction** | How to structure output | "Use bullet points. Keep under 100 words." |
| **Examples (few-shot)** | Sample inputs/outputs to guide the model | "Input: [example] Output: [example]" |

---

### Prompt Templates in Salesforce Prompt Builder

**4 Template Types (must know for exam):**

| Template Type | Use Case | Where Rendered |
|--------------|---------|----------------|
| **Field Generation** | Populates a specific Salesforce field with AI-generated content | Record detail page, field |
| **Record Summary** | Generates a narrative summary of a full record | Record detail page, panel |
| **Sales Email** | Drafts personalized outreach emails | Email composer panel |
| **Flex** | Flexible, multi-purpose template for any generative task | Programmatic, Agentforce |

**Merge field syntax:**
- Standard: `{!$Record.FieldName}` — resolves to the field value BEFORE the prompt goes to the LLM
- Relationship: `{!$Record.Account.BillingCity}` — traverses object relationships
- Key point: Merge fields are resolved by Salesforce BEFORE the prompt is sent to the LLM. The LLM never sees the merge field syntax — it sees the resolved value.

---

### Prompt Engineering Techniques

| Technique | What It Is | When to Use |
|-----------|-----------|------------|
| **Zero-shot** | Ask the model without examples | Simple tasks where intent is clear |
| **Few-shot** | Include 2-5 examples in the prompt | Complex formatting or tone requirements |
| **Chain-of-thought** | Ask the model to "think step by step" | Multi-step reasoning tasks |
| **Role prompting** | Assign the model a role/persona | Tone control (e.g., "You are a legal advisor") |
| **Constrained output** | Specify output format explicitly | JSON extraction, structured summaries |

---

## PTA / SA Relevance

**In Prompt Builder implementation projects:**
- Prompt templates are stored as metadata — they're deployable via Change Sets or SFDX. Build and test in sandbox, deploy to production.
- Grounding vs. merge fields: Merge fields inject CRM field values (strings). Data Cloud grounding injects semantically relevant documents/records from a vector store. Both expand the context window with customer data.
- Token budgets matter at scale: each Prompt Builder invocation consumes tokens. High-traffic pages (10K reps calling case summary daily) can generate significant Einstein AI add-on usage.

**CTO framing for prompt engineering:**
- "We control what the AI is allowed to know and do via the prompt template. We can constrain it to only discuss case-related topics, prevent it from speculating about data it doesn't have, and require structured outputs your downstream systems can process."
- This is the governance story — prompts are the policy layer for AI behavior.

**Anti-patterns to warn customers about:**
- Overly permissive prompts with no format constraints → inconsistent outputs that downstream systems can't process
- Prompts that include PII directly in the template body (not via merge fields) → PII not masked by the Trust Layer
- Templates that ask the AI to make commitments ("Promise the customer we will resolve this by...") → liability exposure

**Enterprise scale considerations:**
- Prompt Builder templates need testing across diverse data profiles — a template that works for accounts with full data may fail or hallucinate for sparse records with blank fields
- Use conditional logic in merge fields or template instructions to handle null/blank field values gracefully

---

## Prompt Builder Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                  PROMPT BUILDER FLOW                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ADMIN DESIGN TIME                                                   ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Prompt Builder (Setup → Einstein → Prompt Builder)           │    ║
║  │                                                              │    ║
║  │ Template: "Write a case summary for {!$Record.Subject}       │    ║
║  │  Customer is {!$Record.Contact.Name}.                        │    ║
║  │  Account tier: {!$Record.Account.Customer_Tier__c}.          │    ║
║  │  Recent comments: {!$Record.Description}                     │    ║
║  │  Be concise, professional, under 150 words."                 │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  USER INVOCATION (Run Time)                                          ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ 1. User opens Case record, clicks "Generate Summary"         │    ║
║  │ 2. Salesforce resolves merge fields → actual field values    │    ║
║  │    (e.g., Subject = "Network outage - Priority 1")           │    ║
║  │ 3. Resolved prompt sent to Einstein Trust Layer              │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  EINSTEIN TRUST LAYER                                                ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ • PII detected and masked (Contact.Name → [MASKED_NAME])     │    ║
║  │ • ZDR: LLM provider cannot retain this prompt                │    ║
║  │ • Resolved prompt sent to external LLM                       │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                          │                                           ║
║  LLM RESPONSE + OUTPUT                                               ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ • Toxicity scoring: response evaluated for harmful content   │    ║
║  │ • Audit log entry created                                    │    ║
║  │ • Unmasked response returned to Salesforce UI                │    ║
║  │ • Human reviews and accepts/edits/rejects the draft          │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Limitations:**
- Prompt Builder templates are in-org metadata — they don't automatically stay current if Salesforce adds new features; someone must maintain them
- Context window caps mean very long field values may be truncated; prompt total must stay within LLM token limits (roughly 4K-32K tokens depending on model)
- Merge fields cannot execute Apex logic — they surface field values only. Dynamic business logic must be handled via Flows or Apex before exposing in a field that gets merged
- No branching logic within Prompt Builder templates — you can't say "if Account type = Enterprise, then include X"
- Human review is the current UX model — templates don't autonomously push AI-generated content to fields without user action (unless specifically configured via Flow)

---

## Key Facts to Memorize

- 4 Prompt Builder template types: **Field Generation, Record Summary, Sales Email, Flex**
- Merge field syntax: `{!$Record.FieldName}` — resolved BEFORE the prompt reaches the LLM
- The LLM never sees `{!$Record...}` syntax — only the resolved values
- Prompt templates are deployed metadata — sandbox → production via change set
- Zero-shot = no examples; Few-shot = 2-5 examples in prompt
- Format instructions are critical for structured outputs (JSON, bullet lists)

---

## Exam Traps

**Trap 1:** "The LLM processes the merge field syntax `{!$Record.Name}` directly." WRONG. Salesforce resolves merge fields to actual values BEFORE sending the prompt to the LLM. The LLM sees the value, not the syntax.

**Trap 2:** Confusing Prompt Builder template types. Field Generation = populates a specific field. Record Summary = narrative overview. Sales Email = email drafting. Flex = anything else.

**Trap 3:** "Prompt Builder generates content autonomously without human review." NOT by default. Prompt Builder surfaces AI-generated content for human review in the UI. Autonomous writing directly to fields requires additional Flow configuration.

**Trap 4:** "Fine-tuning is how Prompt Builder customizes LLM behavior." WRONG. Prompt Builder customizes behavior through prompt instructions, not model retraining.

---

## Practice Questions

**Q1: In Salesforce Prompt Builder, what is the purpose of merge field syntax such as `{!$Record.Account.Name}`?**

A) It instructs the LLM to search for Account information online
B) It defines a conditional logic branch based on the Account name value
C) It is replaced with the actual field value before the prompt is sent to the LLM
D) It prevents the LLM from accessing sensitive Account data

**Answer: C** — Merge fields are resolved by Salesforce before the prompt reaches the LLM. The LLM sees the actual field value (e.g., "Acme Corp"), not the merge field syntax. This is how Prompt Builder grounds prompts in CRM data.

---

**Q2: A sales operations admin wants to create a Prompt Builder template that drafts a personalized outreach email based on an Opportunity's details, including the Stage, Amount, and primary Contact's role. Which Prompt Builder template type should they use?**

A) Field Generation
B) Record Summary
C) Sales Email
D) Flex

**Answer: C** — Sales Email templates are specifically designed for generating email drafts grounded in CRM record data. Field Generation populates a single field. Record Summary creates a narrative overview. Flex is general purpose.

---

**Q3: A Prompt Builder template for case summaries is invoked 5,000 times daily across a large service organization. The admin notices that summaries for cases where the Description field is blank are generating hallucinated content. What is the most appropriate remediation?**

A) Increase the temperature setting to reduce randomness
B) Add format instructions to the prompt template that handle the case where Description is blank (e.g., "If no description is available, state: No description provided")
C) Disable the template and switch to a rules-based summary
D) Fine-tune the LLM to recognize blank fields

**Answer: B** — Adding explicit handling instructions for missing data (null/blank fields) is the proper prompt engineering approach. Telling the model what to do when data is absent prevents it from generating filler content. Temperature doesn't help with missing data. Rules-based systems lose the AI capability. Fine-tuning is expensive and impractical for this scenario.
