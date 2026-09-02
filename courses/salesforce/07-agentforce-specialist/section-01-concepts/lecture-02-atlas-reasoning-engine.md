# Atlas Reasoning Engine

## Exam Domain
Agentforce Concepts & Architecture — ~20% of exam weight

## Core Concepts

### What Atlas Is
Atlas is Agentforce's built-in reasoning engine. It reads the conversation context, decides what to do next (which Topic, which Action), calls the Action, reads the result, and decides if it's done or if it needs to do more. This is called the **ReAct loop**: Reason → Act → Observe (repeat).

Atlas is not a search engine. It does not match keywords. It performs **semantic understanding** — it reads descriptions of Topics and Actions and determines which one best matches the user's intent. This is why description quality is the single most important configuration lever.

### The ReAct Loop — Step by Step

**Step 1 — OBSERVE (context assembly)**
Before Atlas can reason, it reads everything in its context window:
- The current user message
- The conversation history
- Agent Instructions (global system prompt)
- All Topic descriptions
- All Action descriptions within each matching Topic
- Results from any Actions invoked earlier in this same turn

**Step 2 — REASON (planning)**
Atlas asks itself three questions in sequence:
1. Which Topic does this message belong to? (semantic match against Topic descriptions)
2. Within that Topic, which Action should I call? (semantic match against Action descriptions)
3. Do I have all required input parameters? If no → generate a clarifying question. If yes → proceed to ACT.

If no Topic matches → out-of-scope response or escalate per Instructions.
If multiple Topics could match → Atlas picks the best match; ambiguous descriptions cause routing mistakes.

**Step 3 — ACT (execution)**
Atlas invokes the selected Action and passes it the required inputs (extracted from conversation or gathered through clarifying questions).
Action types Atlas can invoke:
- Flow Action (calls an Autolaunched Flow)
- Apex Action (calls an @InvocableMethod)
- Prompt Template Action (invokes a Flex template LLM call)
- Knowledge Search Action (retrieves Knowledge articles)

**Step 4 — OBSERVE AGAIN (result reading)**
Atlas reads the Action result and adds it to the context window. It then asks: "Is the user's goal complete?" If yes → synthesize a response. If no → loop back to REASON.

**Guardrail layers protecting each loop:**
1. **Trust Layer:** Data masking and toxicity checks on every LLM call
2. **Instructions:** Persona, behavioral rules, escalation triggers, exclusions apply globally
3. **Topic scope:** Atlas cannot invoke Actions that don't belong to the matched Topic
4. **Max iterations:** If Atlas loops more than the configured maximum, it stops and responds with what it has

### Atlas Failure Modes
| Failure | Cause | Fix |
|---------|-------|-----|
| Wrong Topic selected | Overlapping Topic descriptions | Tighten description scope, add exclusion phrasing |
| Wrong Action selected | Vague or duplicate Action descriptions | Rewrite descriptions with specific scenarios and when NOT to use |
| Missing parameter — stuck asking | Atlas can't extract param from conversation | Check Action description lists required inputs clearly |
| Max iterations hit | Multi-step workflow too deep | Break workflow into simpler steps, use Flow to handle sub-steps |
| Hallucination | Action succeeded but Atlas fabricated details in summary | Ground with Knowledge Search, verify response against source data |
| Out-of-scope response | No Topic matches, or Instructions have exclusion | Expected behavior if properly scoped; add Topics if needed |

### What Goes Into the Context Window
This is tested directly. The context window for each Atlas reasoning step contains:
- All text in Agent Instructions (why they must stay concise)
- All Topic descriptions
- All Action descriptions in Topics being considered
- The full conversation history to that point
- Prior Action results in the current turn

Token budget is finite. Long Instructions + many Actions = context pressure. Evaluate periodically.

## PTA / SA Relevance

### Designing for Atlas Routing Quality
The most common post-deployment complaint is "the agent is doing the wrong thing." This is almost always a routing issue, not a model issue. Atlas routing quality is 100% determined by description quality.

**Three-part description template for Topics:**
```
[Topic description format]
This topic handles: [what it does]
Activate when: [user situations / phrasings]
Do NOT activate for: [explicit exclusions]
```

**Three-part description template for Actions:**
```
[Action description format]
Use this action to: [what it does]
Call this when: [specific user scenarios]
Required inputs: [what Atlas needs to extract from conversation]
```

### Atlas vs Hard-Coded Routing (for customer discussions)
Atlas is fundamentally different from traditional IVR, rule-based chatbot routing, or Flow decision nodes. The routing decisions are made by an LLM reading natural language descriptions. This means:
- **Advantage:** Much more flexible than keyword matching — handles paraphrases, slang, incomplete sentences
- **Risk:** Depends on well-written descriptions; poorly written descriptions produce non-deterministic behavior
- **Implication for partners:** Description quality is a professional services skill, not a technical configuration skill. Time spent writing and iterating on descriptions is time well spent.

### Multi-Step Workflows and Atlas Loop Limits
Customers sometimes try to solve complex 8–10 step processes with a single Atlas reasoning loop. This creates risk of hitting the max iteration limit mid-task. Better pattern:
- Use a single Autolaunched Flow to handle multi-step data operations (the Flow can have 10+ steps internally)
- Let Atlas call the Flow once with the required inputs
- The Flow handles the complexity and returns a result
- Atlas observes one clean result rather than reasoning through each sub-step

This is the "Flow as orchestrator" pattern: simpler for Atlas, more reliable for the customer.

### When Atlas Is Not the Right Tool
- Fully deterministic processes with no natural language input: use Flow alone
- Sub-second latency requirements: Atlas + LLM adds latency; pure Flow is faster
- Processes requiring parallel execution: Atlas invokes Actions sequentially
- Processes that must be 100% auditable step-by-step: conversation logs exist, but Atlas reasoning trace is internal

## Architecture

### Atlas ReAct Loop (Full Detail)
```
┌─────────────────────────────────────────────────────┐
│                  CONTEXT WINDOW                     │
│  Instructions + Topics + Actions + History          │
│  + Prior Action results in this turn               │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
          ┌────────▶│ OBSERVE │◀────── Action Result
          │         └────┬────┘
          │              │
          │              ▼
          │         ┌─────────┐
          │         │ REASON  │
          │         └────┬────┘
          │              │
          │    ┌─────────┼─────────────┐
          │    │         │             │
          │    ▼         ▼             ▼
          │  No Topic  Missing      Topic +
          │  match     params       Action
          │    │         │          matched
          │    │         ▼             │
          │  OOS      Clarify          ▼
          │  resp.    question      ┌──────┐
          │                        │  ACT │
          │                        └──┬───┘
          │                           │
          │                     ┌─────┴──────┐
          │                     │            │
          │                     ▼            ▼
          │                  More          Done
          │                  steps          │
          └──────────────────┘            Respond
```

**Limitations:**
- Max iterations per turn: prevents infinite loops but caps complex multi-step execution; exact limit is configurable in agent settings
- Single-threaded: Atlas invokes one Action per iteration, not parallel Actions
- Context window pressure: every new Action result appended to context — very long conversations may push older context out, affecting reasoning quality
- Semantic matching accuracy depends on description quality — LLM-based, not rule-based; test every routing path
- Atlas cannot create new Topics or Actions at runtime — scope is fixed at agent build time

### Topic and Action Two-Stage Routing
```
User Message
    │
    ▼
Stage 1: Topic Routing
    Atlas reads ALL Topic descriptions
    ─────────────────────────────────
    Topic A: "Handles billing questions..."    ← weak match
    Topic B: "Handles order status..."         ← strong match  ◀── selected
    Topic C: "Handles product returns..."      ← weak match
    │
    ▼
Stage 2: Action Routing (within selected Topic)
    Atlas reads all Actions in selected Topic
    ─────────────────────────────────────────
    Action 1: "Gets order tracking number"     ← weak match
    Action 2: "Gets order status and ETA"      ← strong match  ◀── selected
    Action 3: "Gets order line items"          ← weak match
    │
    ▼
Parameter Check
    Required: orderNumber
    Source: conversation? ("my order is #12345") → extract
           conversation? (no number given) → clarify
    │
    ▼
ACT: invoke Action 2 with orderNumber="12345"
```

**Limitations:**
- If two Topic descriptions are semantically similar, Atlas picks one non-deterministically — you may see routing inconsistency in testing
- Action routing within a Topic assumes all Actions are equally candidates; the more Actions per Topic, the harder it is for Atlas to differentiate
- Parameter extraction relies on Atlas reading the conversation — if the parameter was mentioned many turns ago, it may be lost if context window is full

### Trust Layer Integration with Atlas Loop
```
Each Atlas LLM call:

[Assembled Prompt]
       │
       ▼ ── Data Masking ───────────── PII/PCI/PHI replaced with tokens
       │
       ▼ ── LLM API call ────────────── Prompt sent to model
       │       (Zero Data Retention)
       │
       ▼ ── Response received
       │
       ▼ ── Toxicity filter ─────────── Check output for harmful content
       │
       ▼ ── Audit log entry ─────────── Record: timestamp, masked prompt, outcome
       │
Atlas uses the filtered response to update context
and decide next step
```

**Limitations:**
- Every Atlas reasoning step is a full Trust Layer pipeline pass — adds latency vs. direct LLM call
- Data masking is bidirectional (masks input going out, unmasks tokens in response) — imperfect on unusual PII formats
- Audit logs stored in org — subject to your org's storage limits and data retention configuration

## Key Facts to Memorize
- Atlas uses **ReAct** pattern: Reason → Act → Observe (loops)
- **Semantic matching** of natural language descriptions — NOT keyword matching
- Context window contains: Instructions + Topic descriptions + Action descriptions + history + prior Action results
- **Two-stage routing:** Topic first, then Action within that Topic
- Atlas stops if no Topic matches → out-of-scope response
- Atlas asks clarifying question if required Action input not in conversation
- **Max iterations** prevents infinite loops — set appropriately for your workflow depth
- Failure modes to know: hallucination, wrong action invoked, stuck in loop, out-of-scope response
- Every Atlas LLM reasoning call passes through the Trust Layer

## Customer Advisory Tips
- **Description writing is the highest-leverage work** in an Agentforce implementation. Budget 30–40% of build time for writing, testing, and refining Topic and Action descriptions.
- **Build a routing test matrix:** For each Topic, write 10–15 test user phrases (including slang, incomplete sentences, typos). Run them in the simulator and verify routing. This matrix becomes your regression test suite.
- **Monitor wrong-action invocations:** In the conversation logs, identify cases where Atlas invoked the wrong Action. Almost always a description problem. Fix description, retest.
- **Context window budgeting:** Count approximate tokens in Instructions + all descriptions. A dense 500-token Instructions block + 10 Topics with 5 Actions each can consume significant context budget. Trim liberally.
- **Escalation triggers must be explicit:** Without explicit escalation conditions in Instructions or Topics, Atlas may attempt to handle requests it shouldn't. Define "escalate to human when: [X, Y, Z]" explicitly.

## Exam Traps
- Thinking Atlas routes by keywords or regex — it uses semantic (LLM-based) matching of descriptions
- Confusing the ReAct loop with a simple "if-then" decision tree — Atlas may loop multiple times per turn
- Thinking Atlas can improvise Actions not configured — it can only invoke Actions explicitly added to Topics
- Thinking the context window is unlimited — everything (Instructions, descriptions, history) must fit; long Instructions cause problems at scale
- Confusing "max iterations" with "max conversations" — max iterations is the loop limit within a single turn

## Practice Questions
**Q:** A developer writes one-sentence Action descriptions. During testing, Atlas frequently invokes the wrong Action. What is the most likely cause?
**A:** Vague or ambiguous Action descriptions. Atlas uses semantic matching against descriptions to choose Actions. One-sentence descriptions don't give enough signal to differentiate between similar Actions.

**Q:** A user sends a message. Atlas invokes Action A, reads the result, then invokes Action B, then responds. How many full ReAct loops occurred?
**A:** Two. Each Act → Observe → Reason → Act cycle is one ReAct loop iteration. The initial Observe bringing in the user message is the setup; two actions = two full iterations.

**Q:** What happens in Agentforce when the user asks a question that matches no configured Topic?
**A:** Atlas returns an out-of-scope response (or escalates per Instructions). It cannot improvise — if no Topic matches, it has no Actions to invoke and must decline or escalate.

**Q:** An enterprise customer wants Agentforce to handle a 15-step sequential data processing workflow. What is the recommended architecture?
**A:** Package all 15 steps inside a single Autolaunched Flow. Add the Flow as one Action. Atlas calls the Flow once, the Flow handles the complexity internally, and Atlas observes a single result. This avoids multi-iteration risk and keeps the Atlas loop simple.
