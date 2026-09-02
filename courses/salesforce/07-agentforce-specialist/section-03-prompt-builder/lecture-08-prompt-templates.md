# Prompt Templates

## Exam Domain
Prompt Builder & Templates — ~20% of exam weight

## Core Concepts

### What Prompt Builder Is
Prompt Builder is a Salesforce tool for creating, testing, and managing **Prompt Templates** — structured prompts that call an LLM and return AI-generated content. Templates standardize how your org uses generative AI by defining the prompt structure once and reusing it across multiple contexts.

Prompt Builder ≠ Agentforce. Prompt Templates are a building block that can be used within Agentforce (as Prompt Template Actions) but also outside Agentforce (in Page Layouts, Flows, Apex). This distinction matters for the exam.

### Prompt Template Anatomy
Every template has three parts:
1. **System Prompt:** Instructions for the LLM about its role, tone, and task. Equivalent to a system message in the LLM API.
2. **Template Body:** The actual prompt text, including merge fields that pull in dynamic data.
3. **Grounding (optional):** A query that retrieves relevant context (Knowledge articles, Data Cloud data) before the LLM generates a response.

### The Four Template Types
| Type | Purpose | Saves output? | Usable as Agentforce Action? |
|------|---------|--------------|------------------------------|
| **Field Generation** | AI-generated value for a specific Salesforce field | Yes — to record field | No |
| **Flex** | Any context, any purpose — flexible | No — returns text to caller | **Yes** |
| **Record Summary** | Summarize a specific record on-screen | No — transient display | No |
| **Sales Email** | Draft an email in the email compose window | No — email draft | No |

**The critical exam fact:** Only **Flex** templates can be used as Agentforce Actions. All other template types have specific UI contexts they're tied to.

### Field Generation Template
- Creates AI-generated values for a specific Salesforce field on a record
- Example: Generate a one-paragraph account summary for the "AI_Summary__c" field on Account
- The generated text **is saved to the record field**
- Triggered from a button on a Lightning Page or record detail page
- Cannot be called from Agentforce

### Flex Template
- Most flexible — no fixed output destination, no fixed record context
- Can accept custom input parameters (defined as variables in the template)
- Returns text to whatever called it (agent, Flow, Apex)
- **Only type that works as an Agentforce Prompt Template Action**
- Use case: generate a case summary, generate a personalized response, analyze text, classify input

### Record Summary Template
- Designed to generate a summary of a specific record type (Case, Opportunity, Contact, etc.)
- The summary appears in a Lightning component on the record page (transient — not saved)
- Bound to a specific object — can only summarize that object type
- Cannot be called from Agentforce

### Sales Email Template
- Appears in the email compose area within Salesforce
- AI generates a drafted email based on the contact/opportunity/case context
- Output is a draft email — not saved to a record field
- Cannot be called from Agentforce

### Testing in Prompt Builder
Prompt Builder has a built-in testing interface:
1. Select a test record (the record provides the merge field values)
2. Click "Generate" / "Preview"
3. Review the generated output
4. Adjust the system prompt or template body and test again

Testing in Prompt Builder is distinct from testing in the Agentforce simulator. Test the template in Prompt Builder first, then test the Action in the simulator.

## PTA / SA Relevance

### When to Recommend Prompt Templates vs Flows for Text Generation
| Need | Recommendation |
|------|---------------|
| Generate structured text from record data | Prompt Template (Field Generation or Flex) |
| Deterministic data transformation (no LLM needed) | Flow Formula element |
| Generate a flexible, conversational response based on data | Flex Template as Agent Action |
| Summarize a record for a user on the record page | Record Summary Template |
| Draft outbound emails | Sales Email Template |
| Any AI text generation that needs to be reusable | Prompt Template |

Prompt Templates should be recommended any time the output is variable (depends on LLM generation), context-dependent (varies per record), or requires natural language quality.

### Partner Design Patterns Using Prompt Templates

**Pattern 1 — AI Field Population:**
Use Field Generation templates to populate custom AI summary fields on Cases, Accounts, or Opportunities. This gives users a one-click way to get an AI-generated summary without leaving the record.

**Pattern 2 — Agent + Prompt Template Combination:**
Build a Flex template that synthesizes data from multiple sources into a personalized response. Build a Flow Action that queries the data. Wire the Flow Action first, then the Flex Prompt Template Action, in the same Topic. Atlas calls Flow first (gets data), then Prompt Template (synthesizes response). This is a clean pattern for "look up data, then generate a natural-language summary."

**Pattern 3 — Standardize AI Usage Org-Wide:**
Rather than letting different teams write ad-hoc prompts, create a library of Prompt Templates for common use cases. Publish them through Prompt Builder with version control. This is the enterprise governance approach to AI usage.

### Template Governance in Enterprise Deployments
- Templates should be version-controlled and reviewed before activation
- System prompts should go through the same legal/compliance review as Agent Instructions
- Test suites for templates should be maintained (similar to Apex test classes for code)
- Templates arriving from Change Sets land as **INACTIVE** — this is a significant deployment gotcha (covered more in lecture-09)

## Architecture

### Prompt Template Decision Tree
```
What do you need to generate?
            │
            ├── Value for a specific record field
            │       │
            │       └──▶ Field Generation Template
            │               (saves to field, Lightning Page button)
            │
            ├── Summary of a specific record (read-only, on-screen)
            │       │
            │       └──▶ Record Summary Template
            │               (transient, Lightning component)
            │
            ├── Draft an outbound email
            │       │
            │       └──▶ Sales Email Template
            │               (email compose area)
            │
            └── Flexible AI output (agent action, Flow, custom context)
                    │
                    └──▶ Flex Template
                            (callable from Agentforce Actions)
                            (callable from Flow)
                            (callable from Apex)
                            (callable from API)
```

**Limitations:**
- Field Generation templates are bound to a single field on a single object — not reusable across objects
- Record Summary templates are display-only — output is not persisted
- Sales Email templates require the email compose UI context — not headless callable
- Only Flex templates can be called programmatically (from agent, Flow, Apex)
- All templates pass through Trust Layer (data masking, toxicity detection)

### Prompt Template Anatomy Diagram
```
Prompt Template: "Case Summary for Agent Response"
┌────────────────────────────────────────────────────────────┐
│ SYSTEM PROMPT                                              │
│ ─────────────────────────────────────────────────────────  │
│ You are a helpful customer service AI. Generate a concise  │
│ 2-3 sentence summary of this support case for a customer.  │
│ Be empathetic. Focus on what is being done to resolve it.  │
│                                                            │
│ TEMPLATE BODY                                              │
│ ─────────────────────────────────────────────────────────  │
│ Case Details:                                              │
│ Subject: {!Case.Subject}                                   │
│ Description: {!Case.Description}                           │
│ Status: {!Case.Status}                                     │
│ Last Update: {!Case.LastModifiedDate}                      │
│                                                            │
│ Additional Context (from agent conversation):              │
│ {!additionalContext}    ← custom input parameter          │
│                                                            │
│ GROUNDING (optional)                                       │
│ ─────────────────────────────────────────────────────────  │
│ Search Knowledge for: {!Case.Subject}                      │
│ (retrieves relevant articles, adds to context)             │
└────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Merge field syntax is `{!ObjectName.FieldName}` — exclamation point is required; wrong syntax silently fails
- Custom input parameters (like `additionalContext`) must be declared as template variables
- Related list data (e.g., list of related contacts) cannot be directly merged — workaround: use Flow to query and pass as text parameter
- System Prompt is shared across all invocations — personalization must be in Template Body via merge fields

### Trust Layer Integration for Prompt Templates
```
Template invoked (by agent, Flow, Apex, or user)
    │
    ▼ Merge fields resolved (record data inserted)
    │
    ▼ Data Masking (PII/PCI masked in assembled prompt)
    │
    ▼ [LLM API call] — Zero Data Retention applies
    │
    ▼ Response received
    │
    ▼ Toxicity Detection (output filtered)
    │
    ▼ Audit Log entry written
    │
    ▼ Output returned to caller (agent / Flow / UI)
```

## Key Facts to Memorize
- Four template types: Field Generation, Flex, Record Summary, Sales Email
- **Only Flex** templates can be used as Agentforce Actions
- Field Generation = saves to record field; Flex = returns text to caller; Record Summary = transient display; Sales Email = email draft
- Template anatomy: System Prompt + Template Body (with merge fields) + optional Grounding
- Merge field syntax: `{!ObjectName.FieldName}` — exclamation point required
- Custom input parameters can be added to Flex templates
- All templates pass through Einstein Trust Layer
- Test in Prompt Builder → test in agent simulator

## Customer Advisory Tips
- **Flex templates are the Swiss army knife:** Recommend Flex for any AI generation need that isn't obviously field population or a record summary. The flexibility to call from anywhere (agent, Flow, Apex) makes Flex the most reusable and governable choice.
- **System Prompt quality matters:** Poor system prompts produce inconsistent output even with good data. Invest time writing clear, specific instructions. Test with 10+ different records before finalizing.
- **Template library governance:** Establish a Prompt Template naming convention and approval process. Templates are organizational assets — treat them with the same rigor as Apex code.
- **Field Generation for AI augmentation:** A quick win for customers: add AI Summary fields to Account, Case, and Opportunity, and wire up Field Generation templates. Gives users a one-click AI summary with minimal complexity.

## Exam Traps
- Thinking Record Summary saves to a field — it's transient (display only)
- Thinking Field Generation works as an Agentforce Action — it does NOT
- Using wrong merge field syntax (e.g., `{Case.Subject}` without `!`) — valid merge fields require `{!ObjectName.FieldName}`
- Thinking Sales Email templates are callable from Agentforce — they're not; they're UI-context-bound
- Confusing template testing in Prompt Builder with agent testing in the simulator — they test different things

## Practice Questions
**Q:** A developer needs to build a prompt template that can be called by an Agentforce agent to generate a personalized response based on a customer's case data. Which template type should they create?
**A:** Flex template — the only type callable as an Agentforce Prompt Template Action.

**Q:** Which Prompt Template type automatically saves the AI-generated output to a Salesforce record field?
**A:** Field Generation template — it writes the output directly to a specified field on a record.

**Q:** A developer creates a Flex template and adds merge field `{Case.Subject}` in the template body. During testing, the field is blank. What is the problem?
**A:** Wrong merge field syntax. The correct syntax is `{!Case.Subject}` with an exclamation point. Without it, the merge field doesn't resolve.

**Q:** A user wants to see an AI-generated summary of a Case record on the record page without saving it to a field. Which template type?
**A:** Record Summary template — generates a transient display summary on the record page without writing to any field.
