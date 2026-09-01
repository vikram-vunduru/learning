# Lecture 01: What is Agentforce

## Learning Objectives
- Explain what Agentforce is and how it differs from Einstein Copilot and earlier Einstein AI products
- Describe the Atlas Reasoning Engine and its role in enabling autonomous agent behavior
- Identify the primary agent types available in Agentforce: Service Agent, Sales Development Rep, Sales Coach, and custom agents
- Distinguish between autonomous actions (agent acts without human confirmation) and assisted actions (agent suggests, human confirms)
- Explain the core components that make up an Agentforce agent: Identity, Instructions, Topics, and Actions

## Slides

### Slide 1: From Assistant to Agent — The Shift
**Visual:**
```
  Einstein Copilot (2024)              Agentforce (2024–present)
  ─────────────────────────            ─────────────────────────
  User asks question                   User defines goal
         │                                     │
         ▼                                     ▼
   AI suggests action                  Agent observes context
         │                                     │
         ▼                                     ▼
   [Approve?] ──Yes──▶ Execute         Agent reasons: which
         │                             Topic? which Action?
         ▼                                     │
   Wait for next question              Agent acts autonomously
   (user must drive each step)                 │
                                              ▼
                                       Agent observes result
                                              │
                                       Done? ─No──▶ Loop back
                                              │
                                             Yes
                                              ▼
                                       Reports to user

  ◀────── More Assisted ──────────────────────── More Autonomous ──────▶
```
**Content:**
- **Einstein Copilot** — conversational AI assistant embedded in Salesforce; suggested actions but required human approval at each step; primarily reactive
- **Agentforce** — autonomous AI agents that can complete multi-step tasks end-to-end without prompting at each step; proactive and goal-directed
- Key shift: from "AI helps you do things" → "AI does things on your behalf"
- Agentforce is not a product upgrade — it is a different paradigm: agents have persistent identity, defined scope (Topics), and callable tools (Actions)
- Both are built on the Einstein Trust Layer — data stays in Salesforce, no customer data is used to train external models
**Speaker Notes:** The most important conceptual shift to internalize is the difference between an assistant and an agent. An assistant answers questions and waits. An agent receives a goal and works toward it autonomously, using whatever tools are available. Agentforce agents can handle an entire customer service interaction — from greeting, to understanding the issue, to looking up account data, to executing a refund flow — without a human agent ever stepping in, if the conversation fits within defined scope. This is what makes Agentforce significant: it is not a better chatbot, it is a software colleague that can be assigned to do real work.

### Slide 2: Atlas Reasoning Engine — The Brain
**Visual:**
```
            ┌─────────────────────────────────────┐
            │       ATLAS REASONING ENGINE        │
            └─────────────────────────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │              OBSERVE                 │
          │  User message + History + Context    │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │               REASON                 │
          │  Match Topic → Select Action         │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │                ACT                   │
          │  Invoke Action (Flow/Apex/Knowledge) │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │              OBSERVE                 │
          │    Read result, update context       │
          └──────────────────┬──────────────────┘
                             │
               ┌─────────────┴──────────────────┐
               │           Done?                │
               ├── No ──▶ Loop back to REASON   │
               └── Yes ──▶ Respond to user      │
               └────────────────────────────────┘

  ╔═══════════════════════════════════════════════════╗
  ║   GUARDRAILS: Einstein Trust Layer wraps loop     ║
  ╚═══════════════════════════════════════════════════╝
```
**Content:**
- **Atlas Reasoning Engine** is the LLM-based planning system that powers all Agentforce agents
- It operates in a continuous **Observe → Reason → Act → Observe** loop
- At each reasoning step, Atlas evaluates: what is the user's intent? which Topic applies? which Action should I invoke?
- Atlas uses the agent's Instructions, Topic descriptions, and Action descriptions to make routing decisions
- The loop continues until the agent determines the goal is complete, needs human escalation, or has reached an action limit
- Atlas runs entirely within Salesforce's infrastructure — calls to the LLM are mediated by the Einstein Trust Layer
**Speaker Notes:** Understanding the Atlas Reasoning Engine loop is the single most exam-relevant architectural concept in this course. Questions will describe a scenario — "the agent receives a message and needs to decide whether to look up a knowledge article or execute a flow" — and ask what happens architecturally. The answer is always: Atlas examines its available Topics and Actions, reads their descriptions, reasons about which one best matches the intent, then invokes it. The quality of your Action descriptions directly determines whether Atlas routes correctly. We will go much deeper on Atlas in Lecture 02, but establish the loop in your memory now.

### Slide 3: Agent Types — Pre-built Templates
**Visual:**
```
  ┌──────────────────────────┬──────────────────────────┐
  │      SERVICE AGENT       │   SALES DEV REP (SDR)    │
  │   ☁  Service Cloud       │   ☁  Sales Cloud         │
  │                          │                          │
  │  Inbound customer        │  Qualifies inbound       │
  │  service: case           │  leads via email/chat;   │
  │  deflection, FAQ,        │  books meetings with     │
  │  order lookups,          │  AEs for qualified       │
  │  escalation              │  leads autonomously      │
  ├──────────────────────────┼──────────────────────────┤
  │      SALES COACH         │      CUSTOM AGENT        │
  │   ☁  Sales Cloud         │   ⚙  Any Cloud           │
  │                          │                          │
  │  Analyzes call           │  Blank canvas — define   │
  │  recordings; generates   │  your own Identity,      │
  │  coaching feedback for   │  Instructions, Topics,   │
  │  sales reps (internal,   │  and Actions from        │
  │  not customer-facing)    │  scratch                 │
  └──────────────────────────┴──────────────────────────┘
```
**Content:**
- **Service Agent** — handles inbound customer service: case deflection, FAQ, order lookups, escalation to human agent; deploys via embedded chat, mobile, API
- **Sales Development Rep (SDR)** — autonomously qualifies inbound leads: responds to web form submissions, asks qualifying questions, books meetings; reduces SDR workload for low-touch leads
- **Sales Coach** — reviews sales call recordings and CRM data, provides coaching feedback to sales reps; assisted (not autonomous) — feedback goes to rep, not to customer
- **Custom Agent** — built from a blank template with custom Identity, Instructions, Topics, and Actions; maximum flexibility
- All agent types share the same underlying platform — they differ in their out-of-box instructions and pre-configured actions
**Speaker Notes:** For the exam, know the use case for each pre-built agent type. The common trap is confusing Sales Coach (internal, coaching reps) with SDR (external-facing, qualifying leads). Service Agent is by far the most commonly deployed agent type and will appear most often in exam scenarios. Custom agents are used when pre-built templates do not match the use case — for example, an HR employee self-service agent or a field service scheduling agent. The underlying mechanics — Topics, Actions, Atlas reasoning — are identical regardless of agent type.

### Slide 4: Autonomous vs Assisted Actions
**Visual:**
```
  AUTONOMOUS ACTIONS                  ASSISTED ACTIONS
  ──────────────────                  ────────────────
  Agent receives request              Agent receives request
         │                                   │
         ▼                                   ▼
    Lookup data ✓                       Lookup data ✓
         │                                   │
         ▼                                   ▼
    Update record ✓                     Update record ✓
         │                                   │
         ▼                                   ▼
    Send message ✓                    ┌──[Human Review]──┐
         │                            │  "Approve this   │
         ▼                            │   action?"       │
    Done — no human step              └──────┬───────────┘
                                            Yes          No
                                             │            │
                                             ▼            ▼
                                          Execute      Cancelled

  ◀── Lower Risk/Consequence ────────────── Higher Risk/Consequence ──▶
  ◀── Start here ────────────────────────── Move here over time ──────▶
```
**Content:**
- **Autonomous actions** — agent executes without waiting for human confirmation; appropriate for low-risk, well-defined operations (lookup data, send a standard message, create a case)
- **Assisted actions** — agent prepares the action but surfaces it to a human for review before execution; used for higher-risk operations (update financial data, send external communications on behalf of a person)
- The distinction is configured at the Action level in Agentforce Builder
- **Escalation to human** is a special case: the agent recognizes it cannot handle the request and routes to a live agent via Omni-Channel
- Best practice: start with assisted, move to autonomous as you build confidence in agent reliability and test coverage
**Speaker Notes:** The exam will ask you to identify which action type is appropriate for a given scenario. The governing principle is risk: the higher the consequence of a wrong action, the more you want a human in the loop. A lookup action (retrieving order status) is naturally autonomous — there is no risk in reading data. A credit refund action should probably be assisted until you have tested the agent extensively. For the exam, look for keywords like "automatically," "without human intervention," or "requires approval" to signal which type is being tested.

### Slide 5: Agent Anatomy — The Four Building Blocks
**Visual:**
```
  ┌────────────────────────────────────────────────────────────────┐
  │                      AGENTFORCE AGENT                         │
  ├─────────┬──────────────────────────────────────────────────────┤
  │ Floor 4 │  ACTIONS                                            │
  │         │  Get Order Status (Flow) · Cancel Order (Flow)      │
  │         │  Knowledge Search · Create Case (Flow)              │
  ├─────────┼──────────────────────────────────────────────────────┤
  │ Floor 3 │  TOPICS                                             │
  │         │  Order Management · Billing Inquiries               │
  │         │  Account Updates · Technical Support                │
  ├─────────┼──────────────────────────────────────────────────────┤
  │ Floor 2 │  INSTRUCTIONS                                       │
  │         │  Tone · Behavior Rules · Escalation Triggers        │
  │         │  Exclusions ("Never discuss competitors")           │
  ├─────────┼──────────────────────────────────────────────────────┤
  │ Floor 1 │  IDENTITY                                           │
  │         │  Name: "Aria" · Company: Acme Corp                  │
  │         │  Persona: friendly service assistant                │
  └─────────┴──────────────────────────────────────────────────────┘
       │              │               │               │
  Sets persona   Instructions    Topics scope    Actions deliver
                shape behavior   conversations    outcomes
```
**Content:**
- **Identity** — the agent's name, persona description, and role. Example: "Aria, your friendly service assistant for Acme Corp."
- **Instructions** — the system-level prompt that governs the agent's overall behavior: tone, what it should and should not do, escalation rules, compliance constraints
- **Topics** — domains of conversation the agent can engage with. Each Topic has a label, description, and a set of Actions. Example Topic: "Order Management"
- **Actions** — callable operations within a Topic. Example Actions under Order Management: Get Order Status (Flow), Update Shipping Address (Flow), Cancel Order (Flow with confirmation)
- The LLM uses Topic descriptions and Action descriptions to decide what to invoke — these descriptions are part of the agent's effective prompt
**Speaker Notes:** This anatomy is foundational — every configuration decision in Agentforce maps to one of these four layers. When you are asked on the exam "where would you configure the agent's tone of voice?" the answer is Instructions. "Where would you add a new capability?" — add a Topic with Actions. "How does the agent know it can look up orders?" — the Topic description tells Atlas this is within scope. Memorize these four layers and you will be able to answer most scenario-based questions by mapping the scenario to the right layer.

### Slide 6: Einstein Trust Layer — Safety Net
**Visual:**
```
  User Message
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                  EINSTEIN TRUST LAYER                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │Data Masking │  │  Toxicity    │  │  Zero Retention │ │
│  │(PII/PCI)    │  │  Detection   │  │   (no training) │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
│                       Audit Log                          │
└──────────────────────────────────────────────────────────┘
       │
       ▼
  External LLM
  (OpenAI / Salesforce Model)
       │
       ▼
  Response ──▶ Trust Layer ──▶ Agent ──▶ User
```
**Content:**
- All LLM calls from Agentforce pass through the **Einstein Trust Layer**
- Key Trust Layer functions:
  - **Data masking** — sensitive fields (SSN, credit card, etc.) are masked before leaving Salesforce
  - **Toxicity detection** — harmful inputs/outputs are flagged and blocked
  - **Zero data retention** — by default, prompts and completions are not retained by the LLM provider
  - **Audit log** — all LLM interactions are logged in Salesforce for compliance review
- The Trust Layer is not an Agentforce-specific feature — it applies to all Einstein AI features
- Configured in Setup → Einstein → Einstein Trust Layer
**Speaker Notes:** The Einstein Trust Layer is a high-frequency exam topic across all AI certifications. For Agentforce specifically, emphasize that the Trust Layer sits between your Salesforce org and any external LLM — whether that is OpenAI's model or Salesforce's own models. No customer data is used to train the LLM. Data masking happens before the prompt leaves the org. These are the talking points that matter for the exam, and for real customer conversations when they ask "is my data safe with Agentforce?"

### Slide 7: Agentforce in the Salesforce Ecosystem
**Visual:**
```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                     EINSTEIN TRUST LAYER                        ║
  ║  ┌────────────────────────────────────────────────────────────┐  ║
  ║  │                   AGENTFORCE STUDIO                        │  ║
  ║  │          (Build · Configure · Manage Agents)               │  ║
  ║  └──────┬──────────┬──────────┬──────────┬────────────────────┘  ║
  ║         │          │          │          │                        ║
  ║   ┌─────▼──┐  ┌────▼───┐  ┌──▼──────┐  ┌▼────────┐  ┌────────┐  ║
  ║   │ Flows  │  │  Apex  │  │ Prompt  │  │Einstein │  │  Data  │  ║
  ║   │(Auto-  │  │(@Invoc │  │ Builder │  │Knowledge│  │ Cloud  │  ║
  ║   │launched│  │ able)  │  │Templates│  │Articles │  │Unified │  ║
  ║   └────────┘  └────────┘  └─────────┘  └─────────┘  └────────┘  ║
  ║                                                                   ║
  ║           Deployment Channels                                     ║
  ║   ┌──────────┐  ┌────────┐  ┌──────┐  ┌─────┐                   ║
  ║   │Embedded  │  │Salesfor│  │Slack │  │ API │                   ║
  ║   │  Chat    │  │ce Mobile│  │      │  │     │                   ║
  ║   └──────────┘  └────────┘  └──────┘  └─────┘                   ║
  ╚══════════════════════════════════════════════════════════════════╝
  Licensing: consumption-based (per conversation, not per seat)
```
**Content:**
- **Agentforce Studio** is the primary UI for building and managing agents (Setup → Agentforce → Agents)
- Agents are built FROM existing Salesforce assets: they invoke Flows you already have, Apex you already wrote, Knowledge articles your team already maintains
- **Prompt Builder** is the separate tool for creating AI prompt templates — these can be connected to agents as actions
- **Data Cloud** integration provides grounding with real-time unified customer data — agents can answer questions based on the most current customer profile
- Agents deploy to **multiple channels** from a single configuration: no need to rebuild per channel
- Licensing: Agentforce is consumption-based (per conversation, not per seat)
**Speaker Notes:** The key architectural insight is that Agentforce is not a standalone AI system — it is a orchestration layer that connects to the Salesforce platform capabilities you already use. The flows are the same flows you use for automation. The knowledge is the same Salesforce Knowledge you use for case management. This is why an experienced Salesforce developer can get productive with Agentforce quickly: most of the "actions" are things that already exist in their org. The exam will test this understanding — you will see questions that describe a Flow that exists in org and ask how to wire it to an agent.

### Slide 8: Key Terminology Recap
**Visual:**
```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                    AGENTFORCE QUICK REFERENCE                       │
  ├──────────────────────────┬──────────────────────────────────────────┤
  │ Agentforce               │ Salesforce's autonomous AI agent platform │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Atlas Reasoning Engine   │ LLM-based planning engine powering all   │
  │                          │ Agentforce agents                        │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Topic                    │ A domain of conversation an agent is     │
  │                          │ configured to handle                     │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Action                   │ A callable operation (Flow, Apex, Prompt │
  │                          │ Template, Knowledge) within a Topic      │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Agent Instructions       │ System-level prompt defining overall     │
  │                          │ behavior and constraints                 │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Autonomous Action        │ Agent executes without human confirmation│
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Assisted Action          │ Human must confirm before execution      │
  ├──────────────────────────┼──────────────────────────────────────────┤
  │ Einstein Trust Layer     │ Safety/governance layer mediating all    │
  │                          │ LLM calls from Salesforce                │
  └──────────────────────────┴──────────────────────────────────────────┘
```
**Content:**
| Term | Definition |
|------|-----------|
| Agentforce | Salesforce's autonomous AI agent platform |
| Atlas Reasoning Engine | The LLM-based planning engine that powers all Agentforce agents |
| Topic | A domain of conversation an agent is configured to handle |
| Action | A callable operation (Flow, Apex, Prompt Template, Knowledge search) within a Topic |
| Agent Instructions | System-level prompt defining the agent's overall behavior and constraints |
| Autonomous Action | Agent executes without human confirmation |
| Assisted Action | Agent prepares action; human must confirm before execution |
| Einstein Trust Layer | Safety and governance layer mediating all LLM calls from Salesforce |
**Speaker Notes:** This glossary covers the eight terms that appear most frequently in exam questions. When the exam describes a scenario, translate it into these terms before answering. "The agent can help customers with billing questions" — that is a Topic. "The agent runs a refund when asked" — that is an Action. "The agent never reveals internal system details" — that is part of Agent Instructions. This translation habit will make scenario questions much more tractable.

## Recording Script
Welcome to the Agentforce Specialist course. This first lecture establishes the conceptual foundation everything else builds on — what Agentforce actually is, how it differs from what came before, and what an agent is made of.

Let's start with the most important conceptual shift. For most of its history, Salesforce AI was assistant-based: Einstein would suggest something, you would approve it, then it would execute. Einstein Copilot, launched in early 2024, was the clearest expression of this model — a conversational assistant embedded in Salesforce that could answer questions and suggest actions, but required human confirmation at every step. Agentforce, launched in late 2024, changes this fundamentally. Agentforce agents are autonomous. They receive a goal — "help this customer resolve their billing issue" — and they work toward it independently, invoking tools, retrieving data, and taking actions without waiting for a human at each step.

The engine behind this autonomy is the Atlas Reasoning Engine. Atlas operates in a loop: observe the input, reason about what to do, act by invoking an available tool, then observe the result. This loop continues until the task is done, the agent needs help, or it hits a configured limit. What makes Atlas powerful is that it reasons based on natural language descriptions — the agent's instructions, the Topic descriptions, and the Action descriptions all feed into Atlas's decision about what to do next. This means how you write those descriptions directly determines how well your agent behaves.

Agentforce comes with several pre-built agent types. The Service Agent handles customer service scenarios. The Sales Development Rep agent qualifies inbound leads. The Sales Coach reviews sales calls and provides feedback to reps. You can also build custom agents from scratch for any use case. All of these share the same four building blocks: Identity (who the agent is), Instructions (how the agent behaves), Topics (what the agent can talk about), and Actions (what the agent can do).

Everything the agent does passes through the Einstein Trust Layer, which ensures customer data is never exposed to external LLM providers unmasked, all interactions are logged for compliance, and harmful content is filtered.

In the next lecture, we will go deep on the Atlas Reasoning Engine — the planning loop that makes autonomous behavior possible.

## Exam Tips
- Agentforce replaced Einstein Copilot — know the key difference: Agentforce agents are autonomous (act without human confirmation at each step) while Copilot was assistant-based (waited for human approval)
- The four agent building blocks are Identity, Instructions, Topics, and Actions — every exam scenario maps to one of these; identify which layer is being asked about
- Atlas Reasoning Engine operates in an Observe → Reason → Act → Observe loop — Action descriptions and Topic descriptions directly influence Atlas's routing decisions
- Service Agent (customer-facing, service), SDR Agent (external, lead qualification), Sales Coach (internal, rep coaching) — know which is customer-facing vs internal
- The Einstein Trust Layer applies to all Agentforce LLM calls — data masking, zero data retention, and audit logging are the three Trust Layer controls most frequently tested

## Lecture Summary
Agentforce is Salesforce's autonomous AI agent platform that replaced Einstein Copilot in 2024. Unlike Copilot's assistant model (suggest and wait for approval), Agentforce agents autonomously complete multi-step tasks using the Atlas Reasoning Engine — an LLM-based planning system that cycles through Observe → Reason → Act loops until a goal is complete. Pre-built agent types include Service Agent (customer service), Sales Development Rep (lead qualification), and Sales Coach (internal rep coaching). Every agent is built from four components: Identity (persona), Instructions (behavior rules), Topics (conversation domains), and Actions (callable tools). Actions can be autonomous (no human confirmation) or assisted (human approves before execution). All LLM calls pass through the Einstein Trust Layer, ensuring data masking, zero data retention, and audit logging.

## Mini Quiz

**Q1:** A company wants to deploy an AI agent that automatically responds to inbound web form leads, asks qualifying questions, and books meetings — without human SDR involvement for routine leads. Which Agentforce agent type is the best fit?
A) Service Agent
B) Sales Coach
C) Sales Development Rep Agent
D) Custom Agent with manual configuration
**Answer:** C — The Sales Development Rep (SDR) Agent is designed exactly for this scenario: handling inbound leads autonomously, qualifying them through conversation, and booking meetings. Service Agent is for customer service, not lead qualification. Sales Coach is internal-facing for rep coaching.

**Q2:** When the Atlas Reasoning Engine evaluates a customer message to decide which Action to invoke, what does it primarily rely on to make its routing decision?
A) The agent's Identity (name and persona)
B) The natural language descriptions of Topics and Actions
C) A hard-coded routing table configured in Agentforce Studio
D) The customer's profile data from Data Cloud
**Answer:** B — Atlas uses the natural language descriptions of Topics and Actions to reason about which tool to invoke for a given input. This is why writing clear, specific Action descriptions is critical — Atlas reads them to determine fit. Identity provides persona context but does not drive routing. There is no hard-coded routing table; routing is LLM-based.

**Q3:** An architect needs to ensure that Social Security Numbers stored in Salesforce are never sent to an external LLM when an Agentforce agent processes customer data. Which platform feature provides this protection?
A) Agentforce Topic Instructions
B) Field-Level Security settings
C) Einstein Trust Layer data masking
D) Agentforce Agent Instructions
**Answer:** C — The Einstein Trust Layer's data masking feature automatically detects and masks sensitive data (including PII like SSNs and credit card numbers) before the prompt leaves Salesforce and reaches the LLM. Field-Level Security controls access within Salesforce but does not protect data in transit to an LLM. Agent Instructions define behavior, not data protection.
