# Prompt Template Actions in Agentforce

## Exam Domain
Prompt Builder & Templates — ~20% of exam weight

## Core Concepts

### Connecting a Flex Template to Agentforce
Only **Active Flex templates** appear in the Agentforce Action picker when you add a Prompt Template Action to a Topic. Other template types (Field Generation, Record Summary, Sales Email) do not appear.

Steps to connect:
1. Build and activate a Flex template in Prompt Builder
2. In Agentforce Studio → Topics → select Topic → Add Action
3. Select "Prompt Template" as Action type
4. The picker shows only Active Flex templates — select yours
5. Configure Action details (label + description — critical for routing)
6. Map input parameters: specify where Atlas gets each template parameter from
7. Save Action

### When to Use Prompt Template Action vs Flow vs Apex
| Need | Use |
|------|-----|
| Generate AI text — analysis, synthesis, summary, response | Prompt Template Action (Flex) |
| Look up/write structured data in Salesforce | Flow Action |
| Complex business logic, external callouts | Apex Action |
| Search factual content from Knowledge | Knowledge Search Action |
| Deterministic text transformation (no LLM needed) | Flow Formula/Apex |

Rule: **Prompt Template Action when the output is generative (variable, natural language).** Flow or Apex when the output is deterministic (the same input always produces the same output).

### Writing Action Descriptions for Prompt Template Actions
Same three-part format applies:

**What it does:**
> "Generates a concise, empathetic summary of an open support case in natural language."

**When to call it:**
> "Call this when the customer asks for an update on their case, what's happening with their issue, or a summary of the current status."

**Required inputs:**
> "Requires the case number. Confirm with the customer if not provided."

Atlas reads this description to decide when to invoke the template — the description determines routing, just like any other Action type.

### Parameter Mapping for Template Actions
When you add a Prompt Template Action, you map each template input parameter to a source:
- **Conversation Context:** Atlas extracts from what the user said
- **Prior Action Output:** Value produced by another Action in the same turn (most common — Flow runs first, results passed to template)
- **Session/Agent Context:** Current user session data

The "prior Action output" source is what makes the multi-action pattern work: Flow gets data → output variables → template receives them as input parameters.

### The Multi-Action Pattern
This is the most powerful pattern in Agentforce and is consistently tested:

```
Flow Action → [get data] → output variables
Prompt Template Action → [synthesize with LLM] → receives Flow outputs as inputs
```

Step by step:
1. User asks a complex question requiring data + AI synthesis
2. Atlas invokes Flow Action to retrieve structured data (order details, account info, case status)
3. Atlas observes Flow output (stored in context window)
4. Atlas invokes Prompt Template Action, passing Flow output values as template input parameters
5. Template synthesizes a natural language response from the data
6. Atlas observes the generated response and delivers it to the user

This pattern separates deterministic data retrieval (Flow) from AI text generation (Prompt Template) — each does what it does best.

## PTA / SA Relevance

### Prompt Template Actions as a Business Value Multiplier
The reason Prompt Template Actions matter to customers:
- **Quality:** AI-generated responses are more nuanced, empathetic, and natural than templated text responses
- **Personalization:** A Flex template receiving customer-specific data (account history, issue context) generates responses that feel personalized, not canned
- **Reuse:** The same Flex template can be called from multiple agents, multiple Topics, or even from Flows — write once, use everywhere

In a customer conversation: "Instead of your agent always giving the same boilerplate response, we can build a Flex template that reads the customer's specific case details and generates a response that feels like it was written specifically for them."

### Common Enterprise Pattern: Data Flow → Prompt Template
For a large e-commerce company customer:
```
Customer asks: "Can you give me a full summary of my recent orders and flag anything I should be concerned about?"
    │
    Atlas → Order Summary Topic
    │
    ├── Action 1: Get Recent Orders (Flow)
    │       Input: accountId (from session)
    │       Output: ordersText (concatenated order summary string)
    │
    └── Action 2: Order Analysis Template (Flex)
            Input: {!ordersText} (from prior Flow Action)
            System Prompt: "Analyze this order data. Highlight any delayed, cancelled, or pending items."
            Output: Natural language analysis with flagged concerns
```

This is a pattern that traditional chatbots cannot do — they can retrieve data, but they can't intelligently analyze and synthesize it with natural language.

### When NOT to Use a Prompt Template Action
- **Performance-critical operations:** Each Prompt Template Action call adds 1–3 seconds latency
- **High-frequency, simple responses:** If the response is always the same regardless of data, a Flow formula element is faster and cheaper
- **Compliance-restricted text generation:** Some regulated industries restrict automated AI-generated communications to customers — verify with compliance before using Prompt Template Actions for customer-facing output
- **Data must be exactly accurate:** LLMs can occasionally paraphrase data in ways that subtly alter meaning. For financial figures, legal language, or safety-critical content, prefer deterministic output over AI-generated synthesis

## Architecture

### Prompt Template Action in the Agent Flow
```
User Request
    │
    ▼
Atlas: Topic matched → Action selected (Prompt Template Action)
    │
    ▼
Does template need input data from another Action first?
    │
    ├── Yes → Atlas invokes preceding Action(s) first
    │          [Flow/Apex Action results stored in context]
    │
    └── No → Proceed directly
    │
    ▼
Atlas invokes Prompt Template Action
    Passes input parameters:
    • From conversation context (extracted by Atlas)
    • From prior Action outputs (from context window)
    • From session context (user/account data)
    │
    ▼
Flex Template assembled
    System Prompt + Template Body (with resolved params) + Grounding results
    │
    ▼
Einstein Trust Layer:
    Masking → LLM Call → Toxicity Filter → Audit Log
    │
    ▼
Generated text returned to Atlas
    │
    ▼
Atlas observes result → Delivers to user
```

**Limitations:**
- Only Active Flex templates appear in Action picker — inactive or wrong-type templates won't show
- Each Prompt Template Action call = one LLM call = billing event (separate from agent conversation billing)
- Template input parameters must have values at call time — if a required input is null (Flow returned nothing), template may generate a poor response
- Template Action cannot be invoked in parallel with other Actions — Atlas is sequential

### Multi-Action Flow-to-Template Pattern
```
Topic: Case Management
│
├── Action 1: "Get Case Details" (Flow)
│   ┌─────────────────────────────────────────┐
│   │ Inputs: caseNumber                       │
│   │ Outputs: subject, status, description,  │
│   │          lastUpdate, assignee           │
│   └─────────────────────────────────────────┘
│   Atlas invokes this first.
│   Results stored in context window.
│
└── Action 2: "Summarize Case for Customer" (Prompt Template)
    ┌─────────────────────────────────────────┐
    │ Inputs: {!subject}, {!status},           │
    │         {!description}, {!lastUpdate}   │
    │ (Atlas passes from Action 1 outputs)    │
    │ System Prompt: "Empathetic case update" │
    │ Output: natural language summary        │
    └─────────────────────────────────────────┘
    Atlas invokes this second.
    Template generates personalized summary.
    Atlas delivers to user.
```

**Limitations:**
- Atlas decides order of Actions based on reasoning — cannot guarantee Action 1 always runs before Action 2 without careful description design
- Action descriptions should indicate sequencing: "Call this after retrieving case details" in Action 2's description
- If Action 1 fails (error output), Action 2 receives null/error inputs → poor template output

### Active Flex Template Picker
```
Agentforce Studio: Add Action → Prompt Template

Template picker shows:
┌────────────────────────────────────────────────┐
│  Available Flex Templates (Active only)         │
│                                                │
│  ✓ Case Summary for Customer (v2) [Active]     │
│  ✓ Order Analysis Template [Active]            │
│  ✓ Product Recommendation Template [Active]    │
│                                                │
│  [NOT shown — inactive templates]              │
│  [NOT shown — Field Generation templates]      │
│  [NOT shown — Record Summary templates]        │
│  [NOT shown — Sales Email templates]           │
└────────────────────────────────────────────────┘
```

## Key Facts to Memorize
- Only **Active Flex templates** appear in the Agentforce Action picker
- Other template types (Field Gen, Record Summary, Sales Email) cannot be agent Actions
- Prompt Template Action = generative output; Flow/Apex Action = deterministic data retrieval
- Multi-action pattern: Flow gets data → Prompt Template synthesizes → Atlas delivers
- Parameter sources for template inputs: Conversation Context, Prior Action Output, Session Context
- Prior Action Output source = how Flow results are passed to a template
- Action description for Prompt Template Actions follows same 3-part formula as all other Actions
- Each Prompt Template Action invocation is one LLM call

## Customer Advisory Tips
- **Start with the Flow-to-Template pattern:** It's the right architecture for 80% of complex response generation needs. It separates concerns cleanly, makes testing easier, and allows each piece to be improved independently.
- **Monitor LLM call volume:** Each Prompt Template Action call is a billable LLM call in addition to the conversation charge. Track template invocation frequency in audit logs to understand cost implications.
- **Template reuse across agents:** The same Flex template can be added as an Action to multiple agents or multiple Topics. Design templates to be reusable (use generic param names, write system prompts that work in multiple contexts). This reduces maintenance overhead.
- **Explain the quality difference to customers:** Show a side-by-side comparison: the same customer scenario answered by a templated chatbot response vs. a Prompt Template Action response. The natural language quality difference is usually immediately compelling.

## Exam Traps
- Non-Flex templates (Field Gen, Record Summary, Sales Email) cannot be Agentforce Actions
- An **inactive** Flex template will NOT appear in the Action picker — must activate first
- Prompt Template Actions are for generative text — not for data retrieval (that's Flow/Apex)
- The multi-action pattern (Flow → Template) requires Atlas to invoke them sequentially — they don't run in parallel
- Action description for Prompt Template Actions is still required for routing — even though the Action "just" calls a template, Atlas needs the description to know when to use it

## Practice Questions
**Q:** A developer creates a Flex template and wants to add it as an Agentforce Action. The template doesn't appear in the Action picker. What is the most likely cause?
**A:** The template is INACTIVE. Only Active Flex templates appear in the Agentforce Action picker. Activate the template in Prompt Builder first.

**Q:** An agent Action needs to retrieve an account's last 3 cases and generate a natural language summary of them. What is the recommended architecture?
**A:** Two Actions in the Topic: (1) Flow Action that queries the last 3 Cases and formats the data as text output variables; (2) Flex Prompt Template Action that receives the formatted case data as input parameters and generates a natural language summary. Atlas invokes them in sequence.

**Q:** What is the difference between a Prompt Template Action and a Knowledge Search Action in terms of what they return?
**A:** Knowledge Search Action returns articles (retrieved content for grounding); Prompt Template Action calls an LLM with a structured prompt and returns AI-generated text. Knowledge Search retrieves; Prompt Template generates.

**Q:** A Prompt Template Action requires a customer's account tier as input. The tier is stored in a custom field on the Account object. How should the input be provided?
**A:** Add a Flow Action to the Topic that queries the Account record and returns the account tier. Atlas invokes the Flow first, stores the result in context, then invokes the Prompt Template Action passing the tier from the prior Action output.
