# Pre-built Agent Types

## Exam Domain
Agentforce Concepts & Architecture — ~20% of exam weight

## Core Concepts

### The Four Agent Templates
| Template | User-Facing | Primary Use | Key Channel |
|----------|-------------|-------------|-------------|
| **Service Agent** | External customers | Case deflection, FAQ, order lookup, escalation | Embedded Chat (web), Mobile |
| **SDR Agent** | External prospects | Inbound lead qualification, BANT, meeting booking | Email, Chat |
| **Sales Coach** | Internal sales reps | Call recording analysis, coaching feedback | Salesforce UI, Slack |
| **Custom Agent** | Either | Any other use case | Any supported channel |

Memory hook: Service = customers (help), SDR = prospects (qualify), Coach = reps (coach).

### Service Agent
A customer-facing agent for resolving service inquiries without human involvement.

**Setup wizard (4 steps):**
1. **Select Data Sources:** Choose Knowledge bases the agent can search
2. **Configure Topics:** Pick from pre-built Topic templates or create custom ones
3. **Set Escalation:** Define Omni-Channel queue to transfer to when agent can't resolve
4. **Deploy:** Select deployment channel (Embedded Chat, Mobile, API)

**Pre-built Topics available:**
- Billing inquiries
- Order status
- Product information
- Account management
- General FAQ

**Customizing after wizard:** You can add Actions to existing Topics, add new Topics, and edit the Instructions persona after the wizard completes. The wizard gives a starting point, not a locked configuration.

### SDR Agent
Autonomous inbound lead qualification. The SDR Agent interacts with web form leads via email or chat, gathers qualification data, and either books a meeting (qualified) or sends a nurture sequence (not yet qualified).

**The BANT qualification flow:**
1. Budget: Does the prospect have budget for this type of solution?
2. Authority: Are they the decision-maker, or do they need to involve others?
3. Need: Do they have a clear business need this product addresses?
4. Timeline: When are they planning to make a decision?

Qualified → books meeting on appropriate rep's calendar via Salesforce scheduling.
Not yet qualified → adds to nurture campaign, continues follow-up autonomously.

**Key SDR Agent fact:** Primarily uses the **Email channel** — it communicates with prospects through email, not embedded chat. This is different from Service Agent.

### Sales Coach Agent
Internal, rep-facing agent. It analyzes recorded sales calls (integrated with conversation intelligence tools), identifies coaching opportunities, and provides structured feedback to reps.

**What Sales Coach does:**
- Reviews call transcripts against configured sales methodology (e.g., MEDDIC, Challenger)
- Identifies missed questions, unclear next steps, competitor mentions
- Generates personalized coaching recommendations for each rep
- Tracks coaching progress over time

**What Sales Coach does NOT do:** It does not talk to customers. It does not handle inbound leads. It is purely an internal coaching tool.

**Channel:** Available in Salesforce UI and Slack (internal). Not deployed on web chat.

### Custom Agent
Blank slate. Use Custom Agent when:
- None of the pre-built templates fits the use case
- You need an internal agent (for HR, IT helpdesk, field service scheduling)
- You need very precise control over Topics, Actions, and Instructions from the start

Custom Agents require building all Topics and Actions from scratch. No wizard, no pre-built Topics.

### Agent Lifecycle
Every agent goes through three states:

| State | Behavior |
|-------|---------|
| **Draft** | Being configured; not accessible to users; no conversations |
| **Active** | Live; users can interact; billable conversations occur |
| **Deactivated** | Inactive; no new conversations; can be reactivated |

Transitions:
- Draft → Active: manual activation in Agentforce Studio
- Active → Deactivated: deactivation removes from deployed channels
- Deactivated → Active: reactivation restores to channels

### Identity and Persona Configuration
Identity applies to all agent types. Fields in Identity:
- **Name:** What the agent introduces itself as ("Hi, I'm Aria")
- **Company:** Company or brand name
- **Persona tone:** Formal, conversational, empathetic — this should reflect your brand voice

Best practice: Set persona in both Identity (name/tone) and Instructions (specific behavioral rules about how the persona should manifest). Identity sets the metadata; Instructions make it behavioral.

## PTA / SA Relevance

### Template Selection in a Discovery Call
When a customer asks "which agent type should we start with?", use this matching framework:

1. "Who is the agent interacting with?"
   - Customers (external) → Service Agent or SDR Agent
   - Prospects (external, inbound) → SDR Agent
   - Employees (internal) → Custom Agent (use Slack channel)
   - Sales reps (internal coaching) → Sales Coach

2. "What's the primary goal?"
   - Resolve issues / answer questions → Service Agent
   - Qualify and convert → SDR Agent
   - Coach and develop → Sales Coach
   - Everything else → Custom Agent

3. "Is there an existing pre-built template?"
   - If use case maps cleanly to one of the three templates, start there and customize
   - If customization requirements are so significant that the template adds no value, start Custom

### Real Customer Scenarios

**Large B2C e-commerce company:**
- 80% of their contact center volume is order status, returns, billing questions
- Service Agent is the obvious fit — high volume, well-defined, existing Knowledge base
- Start with wizard, add Topics for returns and billing, wire to Knowledge + Flows for order lookup

**SaaS company with high inbound web form volume:**
- 200+ inbound leads/day from marketing campaigns, SDR team can only call 30% before they go cold
- SDR Agent handles the other 70% immediately upon form submission
- Result: 3× faster follow-up, 40–50% of leads qualified without human SDR time

**Enterprise financial services company:**
- Compliance requires human review before any customer-facing agent goes live
- Build all agent Types in Custom, not Service Agent template — gives more precise control
- Deploy as Assisted actions first; move to Autonomous after 30-day supervised pilot

### Multi-Agent Enterprise Architecture
For large enterprises, it's often better to run multiple specialized agents:
- **Service Agent:** Customer service for post-sales support
- **SDR Agent:** Pre-sales inbound qualification
- **HR Agent (Custom):** Employee self-service (benefits, PTO, payroll questions) — deployed on Slack
- **Field Service Agent (Custom):** Work order status, technician scheduling — deployed on Mobile

Each agent is scoped tightly. Better routing accuracy. Simpler Topics. Easier to maintain and update independently.

### The Customization vs Starting-Fresh Decision
- Service, SDR, and Sales Coach templates give pre-built Topics and Actions — good starting point for standard use cases
- If the customer has unusual process requirements, the wizard-generated Topics may add maintenance overhead
- Rule of thumb: if you'd need to delete more than 50% of the wizard-generated Topics/Actions, start Custom

## Architecture

### Agent Template Decision Tree
```
Who is the target user?
        │
        ├── External customer ──────────────────────────────────────────┐
        │                                                                │
        ├── External prospect (inbound lead)                            │
        │           │                                                   │
        │           ▼                                                   ▼
        │     SDR Agent                                        Primary goal?
        │     • BANT qualification                                      │
        │     • Meeting booking                          ┌──────────────┼───────────────┐
        │     • Email channel                            │              │               │
        │                                         Resolve           Qualify        Custom need
        │                                         service issue     prospects
        │                                                │              │
        │                                               ▼              (use SDR Agent)
        │                                          Service Agent
        │                                          • Case deflection
        │                                          • Order lookup
        │                                          • Knowledge search
        │                                          • Escalation
        │
        ├── Internal rep (coaching) ──▶ Sales Coach Agent
        │                               • Call analysis
        │                               • Coaching feedback
        │
        └── Internal employee ──────▶ Custom Agent
                                       • HR, IT, Field Service
                                       • Slack channel
                                       • Build Topics from scratch
```

**Limitations:**
- Service Agent wizard generates pre-built Topics for common service scenarios only; industry-specific Topics must be added manually
- SDR Agent is primarily email-first; web chat support has feature parity constraints to verify by release
- Sales Coach requires a supported conversation intelligence integration — not standalone
- Custom Agent has no guardrails or defaults — full responsibility on builder for Instructions quality

### Service Agent Setup Flow
```
Agentforce Studio → New Agent → Service Agent
         │
         ▼
[Wizard Step 1] Select Data Sources
    • Link Einstein Knowledge bases
    • (optional) Connect Data Cloud data
         │
         ▼
[Wizard Step 2] Configure Topics
    • Choose from pre-built Topic templates
    • Enabled topics: Billing, Order Status, Product Info, etc.
    • Each template comes with default Actions
         │
         ▼
[Wizard Step 3] Set Escalation
    • Select Omni-Channel queue for human handoff
    • Configure escalation trigger conditions
         │
         ▼
[Wizard Step 4] Deploy
    • Choose channel: Embedded Chat / API / Mobile
    • Test in simulator
    • Activate
         │
         ▼
    Service Agent LIVE
         │
    Post-launch customization:
    • Add Actions to Topics
    • Edit Instructions for persona
    • Add additional Topics
    • Adjust Knowledge relevance thresholds
```

**Limitations:**
- Wizard is a starting point — expect post-wizard customization for any production deployment
- Pre-built Topics are generic; most real deployments need custom Actions wired to org-specific Flows
- Omni-Channel must be configured and a queue must exist before wizard deployment step
- Embedded Chat requires a Site/Experience Cloud or external web page to embed the code snippet

### Agent Lifecycle State Transitions
```
       Configure
          │
          ▼
       ┌─────┐
       │Draft│ ◀── Default state for new agents
       └──┬──┘
          │  Activate (manual in Studio)
          ▼
       ┌──────┐
       │Active│ ◀── Live, billable, visible to users
       └──┬───┘
          │  Deactivate
          ▼
    ┌────────────┐
    │Deactivated │ ◀── No new conversations; can reactivate
    └────────────┘
          │  Reactivate
          ▼
       ┌──────┐
       │Active│
       └──────┘
```

**Limitations:**
- No automatic reactivation — must be manual
- Active agents incur conversation charges — confirm billing before activating in production
- Deactivating immediately stops new conversations; in-progress conversations may be interrupted (verify channel behavior)
- No soft "pause" state — it's Active or not

## Key Facts to Memorize
- Three pre-built templates: Service Agent (customers), SDR Agent (prospects), Sales Coach (reps)
- Service Agent = external, customer service, Embedded Chat primary channel
- SDR Agent = external, lead qualification, BANT methodology, **email channel**
- Sales Coach = **internal**, rep coaching, NOT customer-facing
- Custom Agent = blank slate, any use case, any channel
- Agent lifecycle: Draft → Active → Deactivated
- Lifecycle transitions are all **manual** — no automation
- Simulator testing in Draft state = NOT billable
- Identity = name + company + tone; Instructions = behavioral rules

## Customer Advisory Tips
- **Pilot with Service Agent template:** It's the most commonly deployed, has the most pre-built content, and the quickest path to a proof-of-value demo. A working demo on real org data within 1–2 weeks is achievable.
- **SDR Agent business case:** Frame the ROI as "speed to first meaningful response." Studies show leads contacted within 5 minutes convert 9× better than those contacted within 30 minutes. SDR Agent enables instant follow-up at scale.
- **Sales Coach governance:** Clarify up front that Sales Coach analyzes recordings of internal calls. HR and legal should confirm call recording consent process is compliant before deploying.
- **Custom Agent for internal use:** Many customers underestimate the value of an internal HR/IT self-service agent. Ticket deflection for HR (PTO policy, benefits questions) can reduce HR ticket volume 20–40%. Build the ROI case before the project scope discussion.
- **Lifecycle management in production:** Build a runbook for Activation and Deactivation so the team knows the process before an urgent deactivation is needed (due to incorrect behavior in production).

## Exam Traps
- SDR Agent uses Email channel primarily, not Embedded Chat — don't assume all agents use the same channel
- Sales Coach is internal (reps) — it is NOT a customer-facing support agent
- Service Agent requires Omni-Channel to be set up for escalation to work — this is a prerequisite, not automatic
- Wizard-generated configuration is a starting point — pre-built Topics need customization for real deployments
- Custom Agent doesn't mean "custom code" — it means a blank-slate Agentforce agent, still configured in Agentforce Studio

## Practice Questions
**Q:** A company wants an agent to handle inbound email leads from a website form, qualify them with BANT questions, and automatically schedule a demo with a sales rep if qualified. Which template?
**A:** SDR Agent — designed for autonomous inbound lead qualification via email, BANT methodology, and meeting booking.

**Q:** An internal HR team wants a Slack-based agent that answers employee questions about benefits, PTO, and payroll. Which agent type?
**A:** Custom Agent deployed on the Slack channel. Service Agent is customer-facing. Sales Coach is for rep coaching. Only Custom Agent is appropriate for internal HR self-service.

**Q:** Which state must an agent be in for users to interact with it?
**A:** Active. Draft = configuration only; Deactivated = off. Only Active agents accept conversations.

**Q:** A Service Agent is configured but when the user's issue can't be resolved, it just says it can't help. What needs to be configured?
**A:** Escalation to an Omni-Channel queue. Escalation must be explicitly configured (queue selection + escalation trigger conditions) — it does not happen automatically.
