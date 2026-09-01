# Lecture 02: Atlas Reasoning Engine

## Learning Objectives
- Describe the Atlas Reasoning Engine's Observe → Reason → Act → Observe planning loop in detail
- Explain how Atlas selects which Topic and Action to invoke for a given user input
- Describe the role of guardrails and the Einstein Trust Layer in the Atlas reasoning process
- Explain what happens when Atlas cannot match a Topic or when an Action fails
- Identify the factors that affect Atlas's reasoning quality: instruction clarity, action description specificity, and grounding quality

## Slides

### Slide 1: Atlas Reasoning Engine Overview
**Visual:**
```
                    ┌─────────────────────────────────────┐
                    │       ATLAS REASONING ENGINE        │
                    └─────────────────────────────────────┘
                                     │
              ┌──────────────────────▼──────────────────────┐
              │                  OBSERVE                     │
              │  (message + history + Instructions + Context)│
              └──────────────────────┬──────────────────────┘
                                     │
              ┌──────────────────────▼──────────────────────┐
              │                   REASON                     │
              │  Which Topic matches? Which Action to invoke?│
              └──────────────────────┬──────────────────────┘
                                     │
              ┌──────────────────────▼──────────────────────┐
              │                    ACT                       │
              │    Invoke Action (Flow / Apex / Prompt /     │
              │                  Knowledge)                  │
              └──────────────────────┬──────────────────────┘
                                     │
              ┌──────────────────────▼──────────────────────┐
              │                  OBSERVE                     │
              │         (read action result, update context) │
              └──────────────────────┬──────────────────────┘
                                     │
                    ┌────────────────┴─────────────────┐
                    │         Done?                    │
                    ├─── No ───▶ Loop back to REASON   │
                    └─── Yes ──▶ Respond to user       │
                                └──────────────────────┘

  Stop conditions: goal achieved · escalation needed · max iterations reached
```
**Content:**
- Atlas is a **Large Language Model (LLM) based planning engine** built into Salesforce's AI infrastructure
- It does not execute code directly — it reasons about what tool to call, calls it, observes the result, and decides what to do next
- The **planning loop** runs for each agent turn and can cycle multiple times within a single user message if multiple actions are needed
- Atlas has access to: the full conversation history, the agent's Identity and Instructions, all Topic descriptions, all Action descriptions, and any data returned from previous actions in the same turn
- The loop terminates when: the agent sends a response to the user, the agent escalates to a human, or a configured maximum number of reasoning steps is reached
**Speaker Notes:** Think of Atlas as a thoughtful colleague who has been given a job description (Instructions), a list of things they can help with (Topics), and a set of tools they can use (Actions). When a customer message arrives, Atlas reads everything it knows, reasons about what the customer needs, picks the right tool, uses it, sees what happens, and then decides whether to answer or do something else. The loop is key — in a single customer message, Atlas might invoke three actions: first look up the customer's account, then retrieve their open cases, then summarize the relevant case. The customer sees one smooth reply but Atlas did three reasoning cycles to produce it.

### Slide 2: The Observation Step
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │                    ATLAS CONTEXT WINDOW                          │
  │                                                                  │
  │  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
  │  │  ◀ User Message         │  │  Conversation History        │  │
  │  │  (current input,        │  │  (prior turns in session)    │  │
  │  │   highlighted priority) │  │                              │  │
  │  └─────────────────────────┘  └──────────────────────────────┘  │
  │                                                                  │
  │  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
  │  │  Agent Instructions     │  │  Topic Descriptions          │  │
  │  │  (system prompt,        │  │  (one per Topic — Atlas      │  │
  │  │   every turn)           │  │   reads all to match intent) │  │
  │  └─────────────────────────┘  └──────────────────────────────┘  │
  │                                                                  │
  │  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
  │  │  Action Descriptions    │  │  Prior Action Results        │  │
  │  │  (one per Action —      │  │  (from earlier steps in      │  │
  │  │   Atlas reads all)      │  │   this same turn)            │  │
  │  └─────────────────────────┘  └──────────────────────────────┘  │
  └──────────────────────────────────────────────────────────────────┘
       "All of this fits in the LLM's context window —
        clarity and conciseness matter"
```
**Content:**
- **User message** — the current input from the user or customer
- **Conversation history** — prior turns in this session; Atlas maintains context across multiple exchanges
- **Agent Instructions** — the system prompt defining the agent's persona, behavior rules, and constraints
- **Topic descriptions** — natural language descriptions of every Topic the agent has; Atlas reads these to understand scope
- **Action descriptions** — natural language descriptions of every Action within every Topic; Atlas reads these to understand what each tool does
- **Previous action results** — outputs from Actions invoked earlier in this same reasoning loop
- All of the above feeds into the LLM's context window — there is a finite limit; long instructions and many actions consume more tokens
**Speaker Notes:** The observation step is why clear, concise instructions and descriptions matter so much. Every Topic description, every Action description, every line of Instructions is sent to the LLM on every reasoning cycle. Vague descriptions ("does stuff with orders") force Atlas to guess. Specific descriptions ("retrieves the status of an order given an order number; returns estimated delivery date and current fulfillment status") let Atlas route accurately. This is the key insight for the building section of the course: you are essentially writing prompts when you write descriptions.

### Slide 3: The Reasoning Step — Topic and Action Selection
**Visual:**
```
                    User message received
                            │
             ┌──────────────▼───────────────┐
             │  Does any Topic description  │
             │     match the intent?        │
             └──────────────┬───────────────┘
                      │             │
                     Yes             No
                      │             │
                      ▼             ▼
           Which Topic best    Out-of-scope response
             fits intent?      or Escalate to human
                      │
                      ▼
           Within that Topic,
           which Action best
              fits intent?
                      │
             ┌────────▼────────────────────┐
             │  Are all required inputs    │
             │  available in context?      │
             └────────┬──────────┬─────────┘
                     Yes          No
                      │           │
                      ▼           ▼
               Invoke Action   Ask clarifying
                               question → await
                               user response → retry
```
**Content:**
- Atlas first identifies the **best-matching Topic** by comparing user intent to Topic descriptions using semantic similarity
- Within the matched Topic, Atlas identifies the **best-matching Action** by comparing the intent to Action descriptions
- Atlas then checks whether all **required input parameters** for that Action are available from the conversation context
- If inputs are missing, Atlas generates a clarifying question to collect them — this is a built-in capability, not custom code
- If no Topic matches the user's intent, the agent responds with an out-of-scope message (configured in Instructions) or escalates to a human
- Atlas can match multiple Topics in sequence within a single conversation turn if the user's message addresses multiple needs
**Speaker Notes:** The key exam concept here is that Topic and Action selection is semantic, not keyword-based. Atlas does not look for the word "order" — it understands the meaning of "I need to know where my package is" and maps that to the Order Status topic because the description says "handles customer inquiries about shipment status and delivery timing." This semantic matching means your descriptions should focus on what the action DOES and WHEN to use it, written in natural language, not technical jargon or system names. Poor description: "Invokes SF_ORDER_LOOKUP_API_V2." Good description: "Retrieves the current status and estimated delivery date for a customer's order given an order number."

### Slide 4: The Act Step — Invoking Actions
**Visual:**
```
  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
  │   FLOW ACTION    │ │   APEX ACTION    │ │ PROMPT TEMPLATE  │ │ KNOWLEDGE ACTION │
  │                  │ │                  │ │     ACTION       │ │                  │
  │ Atlas extracts   │ │ Atlas extracts   │ │ Atlas populates  │ │ Atlas passes     │
  │ params from      │ │ params from      │ │ template merge   │ │ search query     │
  │ conversation     │ │ conversation     │ │ fields           │ │                  │
  │        │         │ │        │         │ │        │         │ │        │         │
  │        ▼         │ │        ▼         │ │        ▼         │ │        ▼         │
  │ Autolaunched     │ │ @InvocableMethod │ │ Prompt Builder   │ │ Einstein         │
  │   Flow runs      │ │   Apex runs      │ │ template + LLM   │ │ semantic search  │
  │        │         │ │        │         │ │        │         │ │        │         │
  │        ▼         │ │        ▼         │ │        ▼         │ │        ▼         │
  │ Output variables │ │ Result object    │ │ Generated text   │ │ Top-N article    │
  │ returned to Atlas│ │ returned to Atlas│ │ returned to Atlas│ │ content to Atlas │
  └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```
**Content:**
- **Flow Action** — invokes an Autolaunched Flow; Atlas maps conversation context to Flow input variables; Flow handles the Salesforce logic; output variables return to Atlas
- **Apex Action** — invokes a method annotated with `@InvocableMethod`; same parameter passing mechanism as Flow
- **Prompt Template Action** — calls a Prompt Builder template; Atlas populates template merge fields; the template's LLM call produces generated text
- **Knowledge / Search Action** — performs a semantic search over Einstein Knowledge articles or other configured sources; returns ranked article content
- **External API Action** — calls an external HTTP endpoint (configured via Named Credentials); enables integration with non-Salesforce systems
- Atlas passes extracted **parameter values** to actions — it reads the conversation to extract values like order numbers, names, and dates
**Speaker Notes:** For the exam, know the four primary action types and when to use each. Flow actions are the most common — they leverage existing automation and require no new code for most Salesforce orgs. Apex actions are used when you need logic that Flow cannot handle — complex calculations, callouts, or operations that require procedural code. Prompt Template actions are used when you need AI-generated content as part of the workflow — generating a case summary, drafting an email, producing a recommendation. Knowledge actions are used for FAQ and deflection scenarios where the answer lives in an article. You will be given a business requirement and asked which action type is most appropriate.

### Slide 5: The Second Observation — Processing Results
**Visual:**
```
  BEFORE (Action just invoked)          AFTER (Result received)
  ─────────────────────────────         ──────────────────────────────────────
  Atlas invoked:                        Action returned:
  Get_Order_Status Flow                   {
    input: orderId = "ORD-5678"             orderStatus:      "Shipped"
                                            estimatedDelivery: "Dec 15"
                                            carrier:          "FedEx"
                                            trackingNumber:   "123456"
                                          }
                                                    │
                                                    ▼
                                          Atlas adds to context,
                                          reasons again:

                                          "I have: status (Shipped),
                                           delivery date (Dec 15),
                                           carrier (FedEx), tracking
                                           (123456). I can compose
                                           a complete response."
                                                    │
                                                    ▼
                                          "Your order has shipped and
                                           is expected Dec 15 via FedEx.
                                           Track it at: 123456"
```
**Content:**
- After an Action executes, its **output variables are added to Atlas's context**
- Atlas then reasons again: "Do I have enough information to respond? Do I need to invoke another Action?"
- If multiple Actions are needed, Atlas will invoke them sequentially — each result builds the context for the next reasoning step
- The final response is composed by Atlas from all collected information — it is not simply returned raw from the action
- Atlas can **synthesize data from multiple actions** into a single coherent response
- This multi-step reasoning is what distinguishes agents from simple automation: the agent adapts its path based on what it discovers
**Speaker Notes:** The second observation step is where the agent's intelligence really shows. A simple Flow would just format the order status data and return it. Atlas receives the data, thinks about what the user actually asked, considers whether there is anything else they might need, and crafts a natural-language response that addresses the complete need. This is also where things can go wrong — if an action returns an error or unexpected format, Atlas observes that and must decide what to do: retry, ask the user for different information, escalate. We will look at error handling more in the Testing lecture.

### Slide 6: Guardrails and Trust Layer Integration
**Visual:**
```
  ╔═══════════════════════════════════════════════════════════════════╗
  ║            EINSTEIN TRUST LAYER  (outermost layer)               ║
  ║  Data Masking · Zero Data Retention · Toxicity · Audit Log       ║
  ║  ┌───────────────────────────────────────────────────────────┐   ║
  ║  │        AGENT INSTRUCTIONS GUARDRAILS                      │   ║
  ║  │  "Never discuss competitors" · Escalation rules           │   ║
  ║  │  Behavioral constraints · Exclusion list                  │   ║
  ║  │  ┌─────────────────────────────────────────────────────┐  │   ║
  ║  │  │              TOPIC SCOPE                            │  │   ║
  ║  │  │  Only configured Topics engaged;                    │  │   ║
  ║  │  │  Atlas does not improvise new Topics                │  │   ║
  ║  │  │  ┌───────────────────────────────────────────────┐  │  │   ║
  ║  │  │  │          ATLAS REASONING ENGINE               │  │  │   ║
  ║  │  │  │  Max iterations · Action-level confirmation   │  │  │   ║
  ║  │  │  └───────────────────────────────────────────────┘  │  │   ║
  ║  │  └─────────────────────────────────────────────────────┘  │   ║
  ║  └───────────────────────────────────────────────────────────┘   ║
  ╚═══════════════════════════════════════════════════════════════════╝
  All LLM input/output passes through all three layers
```
**Content:**
- **Einstein Trust Layer** — operates at the infrastructure level; applies before prompts leave Salesforce and after responses arrive; handles data masking, toxicity filtering, audit logging, and zero data retention
- **Agent Instructions guardrails** — natural language rules in the Instructions block: "Never discuss competitor products," "Always escalate billing disputes over $500," "Only assist with topics listed below"
- **Topic scope guardrails** — the agent only engages with Topics it has been given; Atlas will not improvise a new Topic
- **Max reasoning steps** — configurable limit on the number of Act cycles per turn; prevents infinite loops
- **Action-level confirmation** — assisted actions require human confirmation; this is a guardrail against high-risk autonomous execution
**Speaker Notes:** Guardrails work at multiple levels and this is tested on the exam. If someone asks about an agent safety question, identify which layer applies. A data privacy concern (SSNs going to an LLM) → Einstein Trust Layer. A policy concern (agent discussing competitor prices) → Agent Instructions. A capability concern (agent can't book flights because we didn't configure that Topic) → Topic scope. The exam will describe a scenario and ask which configuration change would address the concern — map it to the correct guardrail layer.

### Slide 7: When Atlas Gets Stuck — Failure Modes
**Visual:**
```
  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  ⚠  NO TOPIC MATCH       │  │  ⚠  MISSING PARAMETERS   │
  │                          │  │                          │
  │  User asks out of scope  │  │  Required input not in   │
  │  → agent returns scoped  │  │  context → Atlas auto-   │
  │  response or escalates   │  │  generates clarifying    │
  │  to a human agent        │  │  question; no code needed│
  └──────────────────────────┘  └──────────────────────────┘

  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  ✗  ACTION ERROR         │  │  ⏱  MAX ITERATIONS       │
  │                          │  │                          │
  │  Flow/Apex throws        │  │  Reasoning loop hits     │
  │  exception → Atlas       │  │  configured limit →      │
  │  observes error, may     │  │  agent returns partial   │
  │  retry, ask user for     │  │  answer or escalates     │
  │  new info, or escalate   │  │  to human                │
  └──────────────────────────┘  └──────────────────────────┘

  Hallucination risk: Atlas may generate plausible-but-wrong
  responses → mitigated by grounding with verified sources
```
**Content:**
- **No Topic Match** — if no Topic description semantically matches the input, Atlas responds with the "out of scope" message from Instructions, or escalates to a human if configured
- **Missing required parameters** — Atlas generates a natural-language clarifying question; this loop continues until parameters are available or the user abandons
- **Action execution error** — if a Flow or Apex action throws an exception, Atlas observes the error and applies reasoning: retry? ask user for different info? escalate?
- **Max iterations reached** — the maximum reasoning step count (configurable, default varies) prevents runaway loops; agent escalates or provides a partial answer
- **Hallucination risk** — Atlas can generate plausible-sounding but incorrect responses; mitigated by grounding with verified knowledge sources and constrained Instructions
**Speaker Notes:** Understanding failure modes is important for both the exam and for building reliable agents. The most dangerous failure mode from a business perspective is hallucination — the agent confidently providing wrong information. The mitigation is grounding: instead of asking Atlas to answer from its parametric knowledge, you provide verified Knowledge articles or Data Cloud records that Atlas uses as the source of truth. We will cover grounding strategies in detail in Lecture 07. For the exam, know that hallucination is addressed with grounding, and that missing parameters trigger clarifying questions automatically — you do not need to write custom code for that behavior.

### Slide 8: Optimizing Atlas Reasoning Quality
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │                    ATLAS QUALITY TUNING                          │
  ├──────────────────────┬───────────────────────────────────────────┤
  │  Instruction         │  Vague ◀─────────────────▶ Specific       │
  │  Clarity             │  ░░░░░░░░░░░░░████████████████████        │
  ├──────────────────────┼───────────────────────────────────────────┤
  │  Action Description  │  Jargon ◀────────────────▶ Natural Lang.  │
  │  Quality             │  ░░░░░░░░░░░░░████████████████████        │
  │  (highest impact)    │                                           │
  ├──────────────────────┼───────────────────────────────────────────┤
  │  Grounding           │  None ◀──────────────────▶ Knowledge+Cloud│
  │  Coverage            │  ░░░░░░░░░░░████████████████████          │
  ├──────────────────────┼───────────────────────────────────────────┤
  │  Topic Scope         │  Broad catch-all ◀────────▶ Tightly scoped│
  │  Discipline          │  ░░░░░░░░░░░░░████████████████████        │
  ├──────────────────────┼───────────────────────────────────────────┤
  │  AGENT               │  Unreliable ◀───────────────▶ Reliable    │
  │  RELIABILITY         │  ░░░░░░░░░░░████████████████████████████  │
  └──────────────────────┴───────────────────────────────────────────┘
  Use Agent Testing simulator to inspect Atlas reasoning trace
  and identify where wrong routing decisions occur
```
**Content:**
- **Instruction quality** — clear, specific Instructions reduce ambiguity; vague Instructions lead to inconsistent behavior
- **Action description quality** — the most impactful tuning factor; Atlas uses descriptions for routing; write them like a colleague explaining what a function does and when to call it
- **Grounding coverage** — more verified, accurate knowledge sources reduce hallucination risk and improve answer accuracy
- **Topic scope discipline** — narrowly scoped Topics reduce false positive matches; better to have five precise Topics than one broad "General" Topic
- **Test and iterate** — use the Agent Testing simulator to observe Atlas's reasoning trace and identify where it makes wrong routing decisions
- There is no single configuration setting for "Atlas quality" — it is a function of all the inputs you provide to the reasoning engine
**Speaker Notes:** The practical takeaway for exam and real-world building: writing good descriptions is the highest-leverage skill in Agentforce. You can have perfect Flows and flawless Apex, but if your Action descriptions are vague, Atlas will mis-route and the agent will seem broken. Treat every Topic description and Action description as a mini-prompt — write it as if you are explaining to a smart colleague, who has never heard of your system, exactly what this option is for and when they should use it. Include the key trigger conditions, the expected inputs, and what the tool returns. This is the difference between a frustrating agent and a reliable one.

## Recording Script
In this lecture we go deep on the Atlas Reasoning Engine — the system that makes Agentforce agents actually autonomous. If you understand Atlas, you understand why agents behave the way they do and how to make them better.

Atlas operates in a four-step loop: Observe, Reason, Act, Observe again. When a customer message arrives, Atlas first observes everything available to it — the message, the conversation history, the agent's instructions, every Topic description, every Action description, and any results from actions it has already taken in this turn. It then reasons about that full context: what does this user need? Which Topic applies? Which Action should I invoke? It acts by invoking the selected Action, then observes the result and decides whether to respond or do another reasoning cycle.

The observation step is where the quality of your configurations pays off. Atlas reads your Topic and Action descriptions as part of its reasoning input. If your Action description says "invokes the order API" — Atlas has very little signal. If it says "retrieves the current shipment status and estimated delivery date for a customer's order given an order number" — Atlas has clear, specific signal for when to call this action. Writing these descriptions is not just documentation; it is prompt engineering.

The reasoning step uses semantic matching — not keywords. Atlas understands meaning. A customer message saying "my package hasn't shown up" will match an Order Status Topic even if it never uses the word "order." This is powerful, but it means you need to test with realistic, varied user inputs rather than assuming the customer will phrase things perfectly.

The Act step invokes the selected Action — Flow, Apex, Prompt Template, or Knowledge Search — passing parameters it has extracted from the conversation. If required parameters are missing, Atlas automatically asks a clarifying question; you don't write code for that.

Guardrails operate at multiple levels: the Einstein Trust Layer handles data privacy, Agent Instructions define behavioral rules, and Topic scope controls what subjects the agent engages with. When Atlas cannot find a matching Topic, it responds with an out-of-scope message rather than hallucinating an answer.

In the next lecture we will look at the pre-built agent templates and how to customize them.

## Exam Tips
- The Atlas loop is Observe → Reason → Act → Observe — the loop can run multiple times within a single user message if the agent needs to invoke multiple actions
- Atlas uses natural language descriptions (Topic descriptions, Action descriptions) for routing — not keywords, not configuration tables — semantic matching based on meaning
- When required Action parameters are missing from the conversation, Atlas automatically generates a clarifying question — no custom code required
- Hallucination is mitigated by grounding (Knowledge articles, Data Cloud records) — not by Instructions alone; grounding provides verified source material Atlas uses as truth
- Guardrails operate at three levels: Einstein Trust Layer (data/privacy), Agent Instructions (behavioral rules), Topic scope (subject boundaries) — know which layer addresses which type of concern

## Lecture Summary
The Atlas Reasoning Engine is Salesforce's LLM-based planning system that runs all Agentforce agents. It operates in an Observe → Reason → Act → Observe loop: Atlas reads the full context (user message, conversation history, Instructions, Topic descriptions, Action descriptions, and prior action results), reasons about which Action to invoke, invokes it, observes the result, and cycles again until the goal is achieved or a stop condition is met. Topic and Action selection uses semantic matching — Atlas reads natural language descriptions to determine fit, making description quality the most critical configuration factor. When required parameters are missing, Atlas automatically asks clarifying questions. Guardrails apply at three levels: the Einstein Trust Layer (data masking, zero retention, audit logs), Agent Instructions (behavioral rules), and Topic scope boundaries. Hallucination risk is reduced through grounding with verified knowledge sources.

## Mini Quiz

**Q1:** A developer notices that their Agentforce agent sometimes invokes the wrong Action for certain customer messages. The agent has five Actions with similar purposes. What is the most likely root cause and best fix?
A) The Einstein Trust Layer is blocking some action invocations
B) The Action descriptions are too similar or too vague, causing Atlas to misroute; rewrite descriptions to be more specific and distinct
C) The agent's Instructions are too long, causing Atlas to ignore them
D) The Flow actions have errors in their input parameter mapping
**Answer:** B — Action routing in Atlas is based on semantic matching of Action descriptions. If descriptions are vague or too similar to each other, Atlas cannot reliably distinguish between them and will misroute. The fix is to rewrite descriptions to be specific, distinct, and clear about the trigger conditions and expected inputs for each action. Trust Layer blocking would prevent execution, not cause wrong routing. Instruction length has minimal impact on action routing.

**Q2:** In the Atlas Reasoning Engine loop, what happens if a customer message requires information from two different Actions — for example, the current account balance AND the last payment date?
A) The agent returns an error because only one Action can be invoked per turn
B) Atlas invokes both Actions simultaneously in parallel
C) Atlas invokes the first Action, observes the result, then invokes the second Action, and composes a unified response
D) The agent asks the customer two separate questions before invoking any Actions
**Answer:** C — Atlas can invoke multiple Actions sequentially within a single reasoning loop. It invokes the first Action, observes the result (which becomes part of its context), then reasons again and invokes the second Action if needed. It then composes a unified response from all collected information. Parallel action invocation is not the default behavior. There is no error for multi-action turns.

**Q3:** Which Atlas Reasoning Engine behavior handles the situation where a user's message does not match any of the agent's configured Topics?
A) Atlas generates a best-effort response using its general knowledge, regardless of Topic configuration
B) Atlas returns an error to the Salesforce platform
C) Atlas responds using the out-of-scope message defined in Agent Instructions, or escalates to a human
D) Atlas waits for the user to rephrase the message
**Answer:** C — When no Topic matches the user's input, Atlas responds with the out-of-scope message configured in the Agent Instructions, or escalates to a human agent if escalation is configured. Atlas does not respond from general knowledge outside of configured scope — this is a key safety behavior that prevents the agent from answering questions it has not been configured and tested to handle.
