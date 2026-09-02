# What is Agentforce

## Exam Domain
Agentforce Concepts & Architecture — ~20% of exam weight

## Core Concepts

### Agentforce vs Einstein Copilot
Agentforce (2024) replaced Einstein Copilot. The shift: from "AI helps you do things" → "AI does things on your behalf."

| | Einstein Copilot | Agentforce |
|--|--|--|
| Model | Assistant — suggest, wait for approval | Autonomous agent — complete multi-step goals |
| Human role | Confirms each action | Defines goal, reviews outcomes |
| Architecture | Reactive, one step at a time | Proactive, loops until goal complete |

Both use the Einstein Trust Layer. Neither sends unmasked customer data to external LLMs.

### The Four Agent Building Blocks (I-I-T-A)
Every configuration decision maps to one of these layers:

| Layer | What it is | Config location |
|-------|-----------|----------------|
| **Identity** | Name, company, persona tone | Identity section |
| **Instructions** | Global system prompt: persona, rules, escalation, exclusions | Instructions block |
| **Topics** | Conversation domains (what agent discusses) | Topics section |
| **Actions** | Callable operations within each Topic (what agent does) | Within each Topic |

Memory hook: **I-I-T-A** (Identity, Instructions, Topics, Actions)

### Pre-built Agent Types
| Template | Facing | Use Case |
|----------|--------|---------|
| Service Agent | External (customers) | Case deflection, FAQ, order lookup, escalation |
| SDR Agent | External (prospects) | Inbound lead qualification, meeting booking |
| Sales Coach | Internal (reps) | Call recording analysis, coaching feedback |
| Custom Agent | Either | Everything else |

### Autonomous vs Assisted Actions
- **Autonomous:** Agent executes without waiting for human confirmation — appropriate for low-risk operations (read data, create a case)
- **Assisted:** Agent prepares the action, human must confirm — appropriate for higher-risk operations (large refunds, external emails)
- Best practice: start with assisted, move to autonomous as confidence in reliability grows

### Agentforce in the Ecosystem
Agentforce is an **orchestration layer** on top of existing Salesforce assets. The Flows you already have become Actions. The Knowledge articles you already maintain become grounding sources. Agentforce Studio (Setup → Agentforce → Agents) is where agents are built and managed.

Licensing: **consumption-based** (per conversation, not per user seat). ROI framing: typical human contact cost $4–15; Agentforce per-conversation cost is a fraction of that for high-deflection scenarios.

## PTA / SA Relevance

### When a Customer Asks "Should We Use Agentforce?"
Apply the four-question fit check:
1. **High volume?** Is this 100s–1,000s of similar interactions per day? Low volume means poor ROI.
2. **Well-defined process?** If human agents can't agree on the right answer, the AI won't either.
3. **Data available in Salesforce (or integrated)?** Agentforce needs data it can retrieve via Flows, Apex, or Knowledge. No data = no grounding = hallucination risk.
4. **Clear scope?** Can you write 3–7 Topics that cover 60–70% of inbound volume? Yes → strong candidate.

All four YES → proceed. Any NO → investigate or redesign.

### Common Partner Mistakes Building Agentforce
- **Overly broad Topics:** One "Customer Service" Topic with 20 Actions causes Atlas routing ambiguity. Break into 5–7 focused Topics.
- **Missing guardrails in Instructions:** Deploying without explicit escalation triggers and exclusions leads to the agent answering questions it shouldn't.
- **Skipping grounding:** Ungrounded factual topics hallucinate confidently. Every FAQ/policy Topic needs a Knowledge Search Action.
- **Using Screen Flows:** The most common technical blocker. Screen Flows cannot be agent Actions. Must be Autolaunched.
- **Ignoring description quality:** Developers write one-line Action descriptions ("Gets order data") then wonder why routing is wrong. Descriptions are the routing engine.

### For a CTO Conversation: Agentforce vs Traditional Automation
- **Flow/Process Builder** is better when the task is fully deterministic, no natural language understanding required, no variability in user input. Example: auto-create a Case when an email arrives.
- **Agentforce** is better when the task requires understanding free-form user requests, multi-step reasoning, or synthesizing responses from multiple data sources. Example: a customer types "my order is late and I need to know if I can get a refund" — this requires understanding intent, looking up order data, looking up refund policy, and generating a contextual response.
- **The honest answer for CTOs:** Agentforce is not a replacement for well-designed automation. It is an orchestration layer for interactions that require natural language understanding and multi-step reasoning.

### Enterprise-Scale Considerations
- **Multi-agent patterns:** Large enterprises often deploy multiple specialized agents (one for customer service, one for HR, one for field service) rather than one mega-agent. Separation improves routing accuracy and maintenance.
- **Performance at scale:** Agentforce is built on Salesforce's multi-tenant infrastructure. The consumption-based model means you can scale without re-architecting. Monitor conversation volume against purchased quota.
- **Monitoring from day 1:** Resolution rate, escalation rate, and session duration metrics should be reviewed weekly in the first month. The first 2–4 weeks produce the most improvement data.

## Architecture

### Assistant vs Agent Comparison
```
Einstein Copilot (legacy)           Agentforce (current)
─────────────────────────           ─────────────────────────────────
User asks question                  User defines goal
       │                                    │
       ▼                                    ▼
 AI suggests action                Atlas Reasoning Engine
       │                           OBSERVE → REASON → ACT → OBSERVE
       ▼                                    │
 [Approve?] → Execute              Loops autonomously until done
       │                                    │
 Wait for next prompt              Reports outcome to user

◀────── More Assisted ──────────────────────── More Autonomous ──▶
```

### Agent Anatomy
```
Agent
├── Identity (name, company, persona tone)
├── Instructions (global system prompt: persona, rules, escalation, exclusions)
├── Topics (conversation domains — Atlas matches these first)
│   └── Actions (what the agent can DO — Atlas matches these second)
│       ├── Flow Actions (Autolaunched Flow)
│       ├── Apex Actions (@InvocableMethod)
│       ├── Prompt Template Actions (Flex template)
│       └── Standard Actions (Knowledge Search, etc.)
└── Channels (Embedded Chat, Slack, API, Mobile, Email)
```

**Limitations:**
- Recommended Topics per agent: 3–7 (more causes routing ambiguity; Salesforce guidance)
- Actions per Topic: no documented hard limit, but each description consumes context window tokens — keep descriptions concise
- Max reasoning iterations per turn: configurable, default varies by release; prevents infinite loops but caps multi-step workflows
- Token limit per conversation turn: all Instructions + all Topic descriptions + all Action descriptions + conversation history must fit in the LLM's context window
- Agent scope is fixed at configuration time — Atlas cannot improvise Topics or Actions not configured

### Atlas Reasoning Engine (ReAct Loop)
```
User Input
    │
    ▼
Atlas Engine — OBSERVE
(Reads: message + history + Instructions + Topic descriptions
        + Action descriptions + prior action results in this turn)
    │
    ▼
REASON: which Topic matches? which Action? are inputs available?
    │
    ├── No Topic match → out-of-scope response or escalate
    ├── Missing params → generate clarifying question
    └── Topic + Action matched → ACT
                │
                ▼
        ACT: invoke selected Action
        (Flow / Apex / Knowledge Search / Prompt Template)
                │
                ▼
        OBSERVE: read action result, update context
                │
                ├── More steps needed? → Loop back to REASON
                └── Done → Respond to user
```

**Limitations:**
- Max iterations per turn: prevents runaway loops but means deeply multi-step workflows need careful Action sequencing
- Atlas can invoke multiple Actions sequentially in one turn, but not in parallel
- If Action throws unhandled exception, Atlas observes the error and must reason about recovery — always handle errors in Flows/Apex

### Einstein Trust Layer
```
User Prompt
    │
    ▼ Data Masking (PII/PCI masked before leaving Salesforce)
    │
    ▼ [External LLM — OpenAI / Salesforce models]
    │   (Zero Data Retention: provider discards after response)
    │
    ▼ Response Filtering
    │
    ▼ Toxicity Detection (harmful content blocked)
    │
    ▼ Audit Log (every interaction recorded in org)
    │
    ▼ Agent Response to User
```

**Limitations:**
- Zero-retention policy: the LLM *provider* does not retain or train on data. Salesforce DOES store conversation transcripts in your org.
- Data masking is pattern-based — free-text sensitive data in unusual formats may not be caught
- Toxicity detection is probabilistic — may miss novel attack patterns; may produce false positives
- Audit log retention subject to your org's data retention settings — set a retention policy appropriate for your industry

### Enterprise Agentforce Deployment (Multi-Agent)
```
                    ┌─────────────────────────┐
                    │   Einstein Trust Layer  │
                    └─────────────┬───────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
   │  Service    │        │  HR Self-   │        │  SDR        │
   │  Agent      │        │  Service    │        │  Agent      │
   │ (customers) │        │  Agent      │        │ (prospects) │
   └──────┬──────┘        │ (employees) │        └──────┬──────┘
          │               └──────┬──────┘               │
    Embedded Chat                │                  Email channel
    Mobile / API              Slack                     │
          │               (internal)               Lead records
          ▼                       ▼                       ▼
   ┌──────────────────────────────────────────────────────┐
   │   Salesforce Platform: Flows, Apex, Knowledge,       │
   │   Data Cloud, Omni-Channel, Field Service, etc.      │
   └──────────────────────────────────────────────────────┘
```

## Key Facts to Memorize
- Agentforce replaced Einstein Copilot in 2024 — Agentforce = autonomous; Copilot = assistant
- Four building blocks: Identity, Instructions, Topics, Actions (I-I-T-A)
- Service Agent = external customers; SDR Agent = external prospects; Sales Coach = internal reps
- SDR and Sales Coach are opposites: SDR talks to prospects, Sales Coach talks to reps
- Einstein Trust Layer applies to ALL Agentforce LLM calls
- Three Trust Layer controls most tested: Data Masking, Zero Data Retention, Audit Logging
- Licensing: consumption-based (per conversation, not per seat)
- Simulator testing does NOT count as a billable conversation
- Agentforce Studio: Setup → Agentforce → Agents

## Customer Advisory Tips
- **ROI framing:** Deflection rate × (human cost per contact - agent cost per contact) = annual savings. Human contact typically $4–15; Agentforce typically $0.10–0.50 for routine interactions.
- **Start narrow:** First deployment should cover 1–3 high-volume, well-defined Topics. Prove ROI, then expand scope.
- **Governance first:** Before go-live, involve legal and compliance to review Instructions (especially exclusions and escalation triggers). This is much cheaper than post-incident remediation.
- **Human oversight posture:** For regulated industries (financial services, healthcare, insurance), start with assisted actions and human review for any action that changes data. Move to autonomous only after testing and compliance sign-off.
- **Knowledge base is the foundation:** A grounded agent is only as good as the Knowledge articles behind it. Assess Knowledge article quality and coverage before sizing the Agentforce project.

## Exam Traps
- Confusing SDR Agent (external, autonomous lead qualification) with Sales Coach (internal, rep coaching)
- Thinking Agentforce is just a better chatbot — it is a different paradigm (autonomous vs assistant)
- Thinking Zero Data Retention means Salesforce stores nothing — it means the LLM *provider* doesn't retain data
- Placing tone/persona in Topics instead of Identity + Instructions
- Confusing autonomous actions (no human needed) with assisted actions (human confirms before execution)
- Service Agent is NOT for internal users — it's customer-facing. Use Custom Agent + Slack for internal HR/IT.

## Practice Questions
**Q:** A company wants an AI agent that automatically responds to inbound web form leads, asks qualifying questions, and books meetings without human SDR involvement. Which agent type?
**A:** Sales Development Rep (SDR) Agent — designed for autonomous inbound lead qualification via email/chat and meeting booking. Service Agent is for customer service. Sales Coach is internal.

**Q:** When Atlas evaluates a customer message to decide which Action to invoke, what does it primarily rely on?
**A:** The natural language descriptions of Topics and Actions (semantic matching). Not a hard-coded routing table, not the customer's profile data, not keywords.

**Q:** An architect needs SSNs never sent to an external LLM when an Agentforce agent processes customer data. Which feature provides this?
**A:** Einstein Trust Layer data masking — automatically detects and masks sensitive data before the prompt leaves Salesforce.

**Q:** A CTO asks: "Will Salesforce or OpenAI use our customer data to train their AI models?" What is the correct answer?
**A:** No. The Zero Data Retention policy (contractual agreement between Salesforce and its LLM partners) requires providers to discard prompt and completion data after processing. Data is not used for model training.
