# Lecture 03: Pre-built Agent Templates

## Learning Objectives
- Identify all major Salesforce pre-built agent templates and their intended use cases
- Describe how to set up and configure the Service Agent using the guided setup wizard
- Explain how to customize a pre-built agent's persona, instructions, and Topics without rebuilding from scratch
- Distinguish between the configuration options that are agent-type-specific vs. shared across all agent types
- Describe what the agent persona is, where it is configured, and how it affects agent behavior

## Slides

### Slide 1: Why Pre-built Templates?
**Visual:**
```
  Build Effort
  ◀── Low ─────────────────────────────────────── High ──▶

  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
  │  Pre-built      │   │  Customized     │   │  Custom Agent   │
  │  Agent          │   │  Pre-built  ★   │   │  (from scratch) │
  │                 │   │  (most common   │   │                 │
  │  Hours to       │   │   enterprise    │   │  Weeks to       │
  │  deploy         │   │   starting pt)  │   │  deploy         │
  └─────────────────┘   └─────────────────┘   └─────────────────┘
         │                     │                     │
    Full Identity,         Adjust persona,       Blank Identity,
    Instructions,          refine Instructions,  no default Topics,
    Topics, Actions        replace Actions for   no default Actions,
    pre-configured         your data model       full control

  ★ = recommended starting point for most enterprise deployments
```
**Content:**
- Pre-built agent templates are **starting points** — fully configured agents with default Instructions, Topics, and Actions that reflect Salesforce's best practices for each use case
- They reduce time-to-value: a Service Agent can be deployed in hours with minimal customization for standard service scenarios
- Pre-built templates include: **Service Agent**, **Sales Development Rep (SDR)**, **Sales Coach**
- Customizing a pre-built template preserves the underlying structure while letting you adjust persona, Instructions, Topics, Actions, and channel configuration
- When a pre-built template does not match the use case (e.g., HR employee service, field service dispatch), start with a **Custom Agent** template
**Speaker Notes:** The exam will test your knowledge of when to use which template type. The key principle: always start with a pre-built template when one exists for the use case — it has Salesforce's recommended configurations baked in, including default escalation handling and safety instructions. Only reach for Custom Agent when no pre-built fits. This is consistent with Salesforce's general platform philosophy of "clicks before code" — applied here as "configure pre-built before building custom."

### Slide 2: Service Agent — Overview and Setup
**Visual:**
```
  Setup → Agentforce → Agents → New Agent → Service Agent

  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
  │ STEP 1  │     │ STEP 2  │     │ STEP 3  │     │  STEP 4  │
  │         │     │         │     │         │     │          │
  │ Choose  │────▶│Configure│────▶│ Connect │────▶│Configure │
  │ Service │     │Identity │     │Knowledge│     │Deployment│
  │ Agent   │     │         │     │  Base   │     │ Channel  │
  │template │     │ · Name  │     │         │     │          │
  │         │     │ · Company│    │Einstein │     │Embedded  │
  │         │     │ · Tone  │     │Knowledge│     │ Service  │
  │         │     │ · Descr.│     │(required│     │  Chat    │
  └─────────┘     └─────────┘     │ ≥1 pub. │     └──────────┘
                                  │article) │          │
                                  └─────────┘          ▼
                                                  Preview agent
                                                  in Builder
                                                  simulator
```
**Content:**
- **Primary use case:** Inbound customer service — case deflection, FAQ, order status, account inquiries, escalation to human agent
- **Default Topics included:** General FAQ, Case Management, Order Inquiry, Authentication/Verification (configurable)
- **Setup steps:**
  1. Navigate to Setup → Agentforce → Agents → New Agent → Service Agent
  2. Complete the Identity form: Name, Company, Description, Persona tone
  3. Connect a Knowledge source (Einstein Knowledge recommended for first setup)
  4. Configure a deployment channel (Embedded Service Chat for web)
  5. Preview and test in the Agent Builder simulator
- **Minimum requirements:** Einstein Knowledge with at least one published article; Embedded Service Chat configuration; Agentforce licenses
**Speaker Notes:** The Service Agent setup wizard walks you through the minimum required configuration in roughly 30 minutes for a basic deployment. The key decisions are the Knowledge source (which articles the agent can search) and the deployment channel (where customers interact with the agent). For the lab in this course we will go through this setup end-to-end. For the exam, know the navigation path (Setup → Agentforce → Agents), the four default Topics, and the fact that at least one published Knowledge article is required for the Knowledge search action to return results.

### Slide 3: Service Agent — Customizing Topics and Actions
**Visual:**
```
  Agentforce Builder — Service Agent

  LEFT PANEL                CENTER                    RIGHT PANEL
  ──────────────────        ──────────────────         ─────────────────
  Topics                    Topic: Order Inquiry       Edit Action
  ┌──────────────┐          ┌──────────────────┐      ┌───────────────┐
  │ FAQ          │          │ Actions:         │      │ Action Name:  │
  │ ▶ Order      │◀─selected│                  │      │ Get Order     │
  │   Inquiry    │          │  ✎ Knowledge     │─────▶│ Status        │
  │ Case Mgmt    │          │    Search        │      │               │
  │ Account Upd. │          │                  │      │ Description:  │
  └──────────────┘          │  ✎ Create Case  │      │ [editable     │
                            │    (Flow)        │      │  text field]  │
  [+ Add Topic]             │                  │      │               │
                            │  [+ Add Action]  │      │ ✎ pencil =    │
                            └──────────────────┘      │  editable     │
                                                      └───────────────┘
```
**Content:**
- Default Topics can be **renamed, edited, or removed** based on your business needs
- New Topics can be added to extend the agent beyond defaults — each new Topic requires a label, description, and at least one Action
- Actions within Topics can be **replaced, reordered, or supplemented** — for example, replace the default order lookup Knowledge action with a custom Flow action that queries the Order object
- The **Action description** field is the most critical to customize — it tells Atlas when and how to invoke the action in your specific context
- Topic descriptions should be updated to reflect your actual business vocabulary and scope
- Out-of-box actions use Salesforce-standard data model objects (Cases, Contacts) — if you use custom objects, you need custom Flow or Apex actions
**Speaker Notes:** The most common customization need for Service Agent is replacing generic out-of-box actions with actions that query your specific data model. If you have a custom Order__c object instead of the standard Order object, the default order lookup action will not work — you need to build a Flow that queries your custom object and wire it in as a replacement. The good news is that everything else — the agent's identity, its escalation logic, its safety instructions — can be kept from the template. You are doing targeted replacement, not a full rebuild.

### Slide 4: Sales Development Rep (SDR) Agent
**Visual:**
```
  Inbound Lead (web form)
         │
         ▼
  ┌────────────────────────────────────────────────────────────┐
  │                    SDR AGENT                               │
  │                                                            │
  │  "Thanks for your interest! To understand your needs,      │
  │   I have a few quick questions..."                         │
  │                                                            │
  │  Topic: Lead Qualification                                 │
  │    · Company size? · Budget range?                        │
  │    · Timeline? · Decision maker?                          │
  └────────────────────────────────────────────────────────────┘
         │                              │
   Lead qualifies                 Lead does not qualify
         │                              │
         ▼                              ▼
  ┌──────────────────┐          ┌───────────────────┐
  │  QUALIFIED       │          │   UNQUALIFIED      │
  │  Book meeting    │          │   Nurture sequence │
  │  with AE         │          │   (email drip)     │
  │  (calendar link) │          │                   │
  └──────────────────┘          └───────────────────┘

  "No human SDR required for routine qualification"
```
**Content:**
- **Primary use case:** Autonomous inbound lead qualification — respond to web-form leads, ask qualifying questions via email/chat, determine lead quality, book meetings with Account Executives
- **Key capability:** Can send and receive emails autonomously (requires Email channel configuration)
- **Default Topics:** Lead Qualification, Meeting Scheduling, Objection Handling, Disqualification
- **What SDR Agent does NOT do:** Generate outbound prospecting lists, make cold calls, access third-party data enrichment (without additional configuration)
- **Salesforce integration:** Creates and updates Lead records, logs activity, books meetings to connected calendars
- **Distinction from Sales Coach:** SDR is external-facing (talks to prospects), Sales Coach is internal-facing (talks to reps)
**Speaker Notes:** The SDR Agent is an external-facing agent — it communicates with your prospects, not your internal team. This is a critical distinction for the exam. Sales Coach, by contrast, is internal only — it reviews recordings and provides feedback to salespeople. For the exam, when you see a scenario about "automatically responding to inbound leads," think SDR Agent. When you see "providing feedback on sales conversations," think Sales Coach. A common trap question presents both use cases together and asks which agent handles which — they are completely separate agents.

### Slide 5: Sales Coach Agent
**Visual:**
```
  Sales Rep completes call
         │
         ▼
  ┌─────────────────────────────────────────────────────┐
  │              SALES COACH AGENT                      │
  │                                                     │
  │  Inputs analyzed:                                   │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
  │  │ Call         │  │ CRM Data     │  │Opportunity│ │
  │  │ Recording    │  │ (Account,    │  │ Details  │  │
  │  │ (audio wave) │  │  Contact)    │  │ (stage,  │  │
  │  └──────────────┘  └──────────────┘  │  amount) │  │
  │                                      └──────────┘  │
  │  Generates coaching feedback                        │
  └─────────────────────────────────────────────────────┘
         │
         ▼
  Coaching report in Salesforce UI (rep + manager view):
  ┌─────────────────────────────────────────────────────┐
  │  • Strength: Good discovery questions in first 5min │
  │  • Improve: Did not address pricing objection       │
  │  • Suggestion: Reference case study earlier         │
  └─────────────────────────────────────────────────────┘
         │
         ▼
  Output goes to REP — NOT to customer
```
**Content:**
- **Primary use case:** Automated sales coaching — analyze sales call recordings and CRM data, generate coaching feedback for sales reps
- **Who sees the output:** The sales rep and their manager — this is an internal tool, not customer-facing
- **Required integrations:** Sales call recording tool (Einstein Conversation Insights or integrated third-party), Opportunity/Account data
- **Actions included:** Analyze call recording, retrieve opportunity context, generate coaching feedback (Prompt Template action)
- **Assisted model:** Sales Coach generates suggestions — a manager or the rep reviews and acts on them; it does not autonomously change deal strategy
- **Licensing note:** Requires Sales Cloud + Agentforce licenses; may require Einstein Conversation Insights license for call analysis
**Speaker Notes:** Sales Coach is different from Service Agent and SDR in one important way: it is primarily a generation/summarization agent, not an action-execution agent. Its core output is generated text (coaching feedback) rather than executed operations (creating records, sending messages). This makes it more analogous to a Prompt Template action than to a flow-execution agent. For the exam, Sales Coach questions often focus on use case identification rather than technical configuration, since its setup is more opinionated than Service Agent.

### Slide 6: Customizing Agent Persona and Identity
**Visual:**
```
  Identity Configuration Panel
  ┌────────────────────────────────────────────────────────────┐
  │  Agent Name:        [ Aria                              ]  │
  │                                                            │
  │  Agent Description: [ Aria is Acme's friendly digital      │
  │                       service assistant who helps          │
  │                       customers resolve service issues      │
  │                       quickly                           ]  │
  │                                                            │
  │  Company Name:      [ Acme Corp                         ]  │
  │                                                            │
  │  Persona Tone:      [ Friendly ▼ ]                         │
  │                       · Professional                       │
  │                       · Friendly     ◀ selected            │
  │                       · Formal                             │
  │                       · Empathetic                         │
  └────────────────────────────────────────────────────────────┘
  Preview: "Hi! I'm Aria, your Acme service assistant.
            How can I help you today?"

  Identity sets base persona → Instructions extend and refine it
```
**Content:**
- **Agent Name** — the name customers see; use a persona name rather than "Chatbot" or "AI Assistant" for better engagement
- **Agent Description** — used internally to describe the agent's purpose; also feeds into the system prompt to establish the persona
- **Company Name** — used in the agent's self-introduction (e.g., "I'm Aria, your Acme service assistant")
- **Persona Tone** — shapes how the agent phrases responses: Friendly is warmer and uses shorter sentences, Formal is more precise and structured, Professional balances both
- **Custom Instructions can extend persona** — use the Instructions block to add specific personality traits, vocabulary to use or avoid, and domain-specific knowledge
- Persona configuration is cosmetic AND functional: it genuinely changes how Atlas phrases responses
**Speaker Notes:** Persona configuration is one of the highest-visibility customizations for business stakeholders — it is usually the first thing an end-client asks about. For the exam, know that persona is configured in the Identity section (name, company, tone) and refined in the Instructions section (behavioral detail). A question might ask "where would you configure the agent to always respond in a formal, professional tone?" — the answer is both Identity (Formal tone setting) and Instructions (explicit tone guidance). These two work together.

### Slide 7: Agent Lifecycle — Draft, Active, Deactivated
**Visual:**
```
  ┌──────────────────┐   Activate    ┌──────────────────┐
  │                  │ ─────────────▶│                  │
  │     DRAFT        │               │     ACTIVE       │
  │                  │◀─────────────-│                  │
  │  · Configuring   │   Deactivate  │  · Live          │
  │  · Simulator     │               │  · Receiving     │
  │    testing only  │               │    conversations │
  │  · No live convs │               │  · Production    │
  └──────────────────┘               └────────┬─────────┘
           ▲                                  │
           │                           Deactivate
     Edit / Reactivate                        │
           │                                  ▼
           └──────────────────────   ┌──────────────────┐
                                     │                  │
                                     │   DEACTIVATED    │
                                     │                  │
                                     │  · Offline       │
                                     │  · Channels stop │
                                     │    routing       │
                                     └──────────────────┘

  Best practice: develop in Sandbox → test → promote to Production
```
**Content:**
- **Draft state** — the agent is being configured; only accessible in Agentforce Builder; test conversations in Builder simulator do not count as production conversations
- **Active state** — the agent is published and live; new configurations require deactivation or versioning before publish
- **Deactivated state** — agent is turned off; configured channels stop routing new conversations to it; existing open conversations may be handled differently based on channel settings
- **Version control** — Agentforce does not have native version control in the same way as code; use change sets or Salesforce DX for promoting agent configurations between sandboxes and production
- **Sandbox testing** is strongly recommended before activating in production — always test with the simulator and real users in a sandbox first
**Speaker Notes:** For the exam, the agent lifecycle state question usually appears in the deployment or testing section. Know that Draft agents can be tested in the Builder simulator but cannot take live conversations. The exam may ask what state an agent must be in before it can receive customer messages — the answer is Active. Also note that when you make changes to an Active agent, best practice is to deactivate it, make changes, test in the simulator, then reactivate. In practice, Salesforce allows some in-place edits, but deactivating is the recommended approach for significant changes.

### Slide 8: Choosing the Right Starting Point
**Visual:**
```
  What is your use case?
         │
    ┌────┴──────────────────────────────────────────┐
    │                                               │
    ▼                                               ▼
  Customer service,          Sales rep coaching,    Inbound lead
  FAQ, case deflection       call analysis          qualification,
         │                        │                 meeting booking
         ▼                        ▼                      │
  SERVICE AGENT             SALES COACH              SDR AGENT
         │                  (internal only)               │
         └─────────────────────────┴───────────────────────┘
                                   │
                         None of the above?
                    (HR, field service, IT helpdesk,
                     internal ops, custom use case)
                                   │
                                   ▼
                           CUSTOM AGENT
                    (blank canvas — full control)

  ┌──────────────────────────────────────────────────────────────────┐
  │  Use Case               │ Template     │ Facing  │ Channel       │
  ├─────────────────────────┼──────────────┼─────────┼───────────────┤
  │  Customer service/FAQ   │ Service      │ External│ Embedded Chat │
  │  Lead qualification     │ SDR          │ External│ Email/Chat    │
  │  Rep coaching           │ Sales Coach  │ Internal│ CRM UI        │
  │  HR / Field Svc / Other │ Custom       │ Either  │ Slack / API   │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
| Use Case | Recommended Template |
|----------|---------------------|
| Customer service, case deflection, FAQ | Service Agent |
| Inbound lead qualification, meeting booking | SDR Agent |
| Sales rep coaching, call analysis feedback | Sales Coach |
| HR employee self-service, field service scheduling, custom business process | Custom Agent |

- **Custom Agent** starting point: blank Identity, blank Instructions, no default Topics — full control, more configuration required
- Pre-built templates include more default configurations but may include default Topics/Actions you need to remove or replace
- You cannot convert a pre-built template to a Custom Agent or vice versa — choose the starting point before creating the agent
- Multiple agents can coexist in one org — for example, one Service Agent for customers and one Custom HR Agent for employees
**Speaker Notes:** The selection table is your exam cheat code for use case questions. If the scenario involves customers asking questions about their accounts, orders, or cases — Service Agent. If it involves prospects filling out web forms and being contacted for qualification — SDR Agent. If it involves sales managers wanting automated coaching on their team's calls — Sales Coach. Everything else — HR, field service, IT helpdesk, internal operations — is Custom Agent. Remember that you cannot mix templates: pick the right starting point for each use case and build separate agents rather than trying to cram everything into one.

## Recording Script
In this lecture we look at the pre-built agent templates that Salesforce provides in Agentforce — the three purpose-built starting points that let you deploy a working agent in hours rather than building from scratch.

The Service Agent is the flagship template. It is designed for customer-facing service scenarios: deflecting cases by answering questions from Knowledge, handling order inquiries, creating cases for issues that need human follow-up, and escalating to a live agent when needed. Setting up a basic Service Agent takes roughly 30 minutes if you have published Knowledge articles and an Embedded Service Chat configuration. The setup wizard walks you through Identity (name, company, persona tone), connecting a Knowledge source, and selecting a deployment channel.

The Sales Development Rep, or SDR Agent, is for inbound lead qualification. It receives leads from web forms, engages them via email or chat with qualifying questions, determines whether the lead meets your criteria, and books meetings with account executives for qualified leads. The SDR Agent is external-facing — it talks to your prospects, not your team.

The Sales Coach is the opposite — entirely internal. It analyzes sales call recordings and CRM data to generate coaching feedback for sales reps. A rep or manager reviews the feedback; the agent does not make autonomous changes to deals or send messages to customers.

When none of these templates fit — HR employee service, field service dispatch, IT helpdesk — you start from the Custom Agent template. It's a blank canvas: no default Topics, no default Actions, no pre-written Instructions. More work, but maximum control.

Regardless of which template you start with, the customization approach is the same: update the Identity with your company's persona, refine the Instructions to match your policies, and replace generic default Actions with Actions that target your specific data model. A Service Agent's default order lookup Action probably queries standard objects; if you have a custom Order__c object, you wire in your own Flow.

In Section 2, we will build Topics and Actions from scratch — which is exactly what you need to customize any pre-built template.

## Exam Tips
- Service Agent = customer-facing service and case deflection; SDR Agent = external-facing lead qualification; Sales Coach = internal rep coaching — do not confuse SDR (external) with Sales Coach (internal)
- Pre-built templates cannot be converted to Custom Agent type — choose the correct template before creating the agent
- Agent persona is configured in Identity (name, tone setting) AND refined in Instructions (specific behavioral guidance) — both work together
- Agent must be in Active state to receive live conversations; Draft agents can only be tested in the Builder simulator
- Use Custom Agent template for use cases not covered by pre-built templates: HR self-service, field service, IT helpdesk, internal operations tools

## Lecture Summary
Salesforce provides three pre-built agent templates as starting points: Service Agent (customer-facing service, FAQ, case deflection), Sales Development Rep Agent (external-facing inbound lead qualification), and Sales Coach (internal sales rep coaching with call analysis). Each template includes default Identity, Instructions, Topics, and Actions configured for its use case. Customization involves updating the Identity (name, company, persona tone), refining the Instructions to match company policies, and replacing generic default Actions with Actions that target your org's specific data model. Agent persona is configured in Identity (name and tone dropdown) and extended in Instructions. Agents exist in three lifecycle states: Draft (configuration only), Active (live, receiving conversations), and Deactivated (offline). Use the Custom Agent template for use cases not covered by the three pre-built templates.

## Mini Quiz

**Q1:** A company wants to deploy an agent that automatically responds to inbound contact form submissions, engages prospects with qualifying questions over email, and books calendar slots for qualified leads. Which Agentforce agent template should they start with?
A) Service Agent
B) Custom Agent
C) Sales Coach
D) Sales Development Rep Agent
**Answer:** D — The SDR Agent is designed for inbound lead qualification workflows: it engages inbound leads via email or chat, qualifies them with targeted questions, and books meetings. Service Agent handles customer service, not lead qualification. Sales Coach is internal-facing for rep coaching.

**Q2:** An administrator has deployed a Service Agent and wants to change its response tone from "Friendly" to "Professional" and add a rule that it never discusses competitor pricing. Where should these two changes be configured?
A) Both changes in the Agent's Topic descriptions
B) Tone change in Identity; competitor rule in Agent Instructions
C) Both changes in Agent Instructions
D) Tone change in the deployment channel settings; competitor rule in the Einstein Trust Layer
**Answer:** B — Persona tone (Friendly, Professional, Formal, Empathetic) is configured in the Identity section of the agent configuration. Behavioral rules like "never discuss competitor pricing" are written into the Agent Instructions as explicit guidance. These two layers work together — Identity sets the base tone, Instructions refine and add specific behavioral constraints.

**Q3:** A developer is modifying an active Service Agent to add a new Topic. After saving the changes, users report the agent is behaving unexpectedly. What is the recommended lifecycle practice the developer should have followed?
A) Make changes in production and rely on the Trust Layer to catch errors
B) Deactivate the agent, make and test changes in the Builder simulator, then reactivate
C) Clone the agent to a new agent, make changes, then delete the original
D) Use the Refresh Agent button to reload the agent configuration
**Answer:** B — Best practice is to deactivate the agent before making significant configuration changes, test the changes using the Builder simulator (which does not affect live conversations), and reactivate once testing passes. This prevents configuration changes from affecting live customer conversations during editing. Cloning is an option but creates a separate agent with a different name/channel configuration — deactivate and edit in place for minor changes.
