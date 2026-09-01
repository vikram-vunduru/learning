# Lecture 14: Use Cases and Business Value

## Learning Objectives
- Map a business problem to an appropriate Agentforce agent design: template type, Topics, Actions, and grounding
- Analyze four common exam use case scenarios: customer service deflection, sales lead qualification, HR employee self-service, and field service scheduling
- Identify the business value metrics used to justify Agentforce deployments (cost per interaction, deflection rate, CSAT improvement)
- Distinguish which use cases are best served by pre-built agent templates vs. custom agents
- Recognize the characteristics of a use case that makes it a good or poor fit for Agentforce

## Slides

### Slide 1: What Makes a Good Agentforce Use Case?
**Visual:**
```
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │  GOOD FIT FOR AGENTFORCE  ✓      │  │  POOR FIT  ✗                     │
  │                                  │  │                                  │
  │  ✓ High-volume, repetitive       │  │  ✗ Low-volume, complex           │
  │    inquiries (scales better      │  │    judgment calls                │
  │    than humans)                  │  │                                  │
  │                                  │  │  ✗ High regulatory               │
  │  ✓ Well-defined business         │  │    accountability (decisions     │
  │    processes (predictable        │  │    requiring named human         │
  │    workflow)                     │  │    sign-off)                     │
  │                                  │  │                                  │
  │  ✓ Data available in             │  │  ✗ Undefined processes (if       │
  │    Salesforce or integrated      │  │    humans cannot agree, agent    │
  │    systems                       │  │    will not either)              │
  │                                  │  │                                  │
  │  ✓ Defined scope (clear          │  │  ✗ Highly sensitive contexts     │
  │    Topics with limited           │  │    (legal, medical, financial    │
  │    variability)                  │  │    advice in regulated areas)    │
  └──────────────────────────────────┘  └──────────────────────────────────┘

  Four qualifying questions:
  1. High volume?   2. Well-defined process?
  3. Data available?   4. Clear scope?
  All four YES → strong Agentforce candidate
```
**Content:**
- **Strong Agentforce use cases share these characteristics:**
  - **High volume, low complexity:** the same questions/tasks repeat thousands of times — agents scale better than humans for these
  - **Well-defined business process:** the agent can follow a predictable workflow without creative improvisation
  - **Available data:** the information needed to answer/act is accessible via Salesforce or integrated systems
  - **Defined scope:** the agent can have clear Topics that cover the use case without needing to handle unlimited variability
- **Weak use cases:**
  - Low volume (ROI does not justify setup cost)
  - High regulatory accountability (decisions requiring named human sign-off)
  - Undefined processes (if humans cannot agree on the right answer, an agent will not either)
  - Highly sensitive contexts (legal decisions, medical diagnoses, financial advice in regulated contexts)
**Speaker Notes:** Use case fit analysis is one of the highest-frequency exam topic areas — the exam will describe a scenario and ask whether Agentforce is appropriate, or will ask you to design an agent for a described scenario. Use the framework on this slide: is it high volume? Is the process well-defined? Is the data available? Are there clear Topics that scope the conversation? Yes to all four → strong candidate. No to any → investigate further or consider a different approach.

### Slide 2: Use Case 1 — Customer Service Deflection
**Visual:**
```
  Customer Service Deflection — Before and After

  BEFORE AGENTFORCE:
  1,000 daily contacts
         │
         ▼
  100% Human agents
  · High cost, long wait times
  · Agents handling routine + complex equally

  AFTER AGENTFORCE:
  1,000 daily contacts
         │
         ├── 65% ──▶ Agent handles autonomously (650 routine contacts)
         │             ┌────────────────────────────────────────────┐
         │             │ "Where is my order?" → GetOrderStatus Flow │
         │             │ "What is your return policy?" → Knowledge  │
         │             │ "Update my address" → UpdateAddress Flow   │
         │             └────────────────────────────────────────────┘
         │
         └── 35% ──▶ Escalated to human agents (350 complex cases)
                       (Omni-Channel routing → service rep queue)

  ROI snapshot:
  Human handle cost: ~$4-8 per contact
  Agentforce cost:   ~$0.10-0.50 per conversation
  650 deflected/day × 365 = 237,250 contacts deflected/year
```
**Content:**
- **Business problem:** Large volume of routine service contacts (order status, account questions, policy FAQs) consuming expensive human agent time
- **Recommended template:** Service Agent
- **Key Topics:**
  - Order Status (Knowledge search + Flow to query order records)
  - Billing Inquiry (Flow to retrieve invoice data, Knowledge for policy questions)
  - Account Management (Flow for profile updates, Knowledge for account policies)
  - Technical Support FAQ (Knowledge search)
  - Escalation (always-available "connect me to a human" action)
- **Key Actions per Topic:** Knowledge Search (for FAQ), Flow Actions (for data retrieval), Escalation Action
- **Grounding:** Einstein Knowledge for policy/FAQ topics; Data Cloud or record-based for personalized account data
- **Success metrics:** Deflection rate, CSAT, average handle time, cost per contact
**Speaker Notes:** Customer service deflection is the canonical Agentforce use case and will appear on the exam. The Service Agent template is pre-configured for this. The exam typically tests: the right template (Service Agent), the need for both Knowledge grounding (for policy FAQs) and Flow Actions (for account/order data retrieval), and the escalation path to human agents via Omni-Channel. Know the Topics, the Action types for each, and the business metrics. The deflection rate (% of contacts resolved by agent without human involvement) is the primary business value metric.

### Slide 3: Use Case 2 — Sales Lead Qualification
**Visual:**
```
  SDR Agent — Lead Qualification Workflow

  Inbound lead submits web form
         │
         ▼
  Lead record created in Salesforce
         │
         ▼  (SDR Agent trigger)
  SDR Agent sends qualifying email
  "Thank you for your interest, {FirstName}. I have a few
   questions to understand your needs..."
         │
         ▼  (Lead responds)
  Qualifying conversation (async email, 24-48 hrs):
  ┌──────────────────────────────────────────────────────┐
  │  Agent asks BANT qualification questions:            │
  │  · Budget: "What is your approximate budget range?"  │
  │  · Authority: "Who else is involved in this          │
  │    decision?"                                        │
  │  · Need: "What is the primary problem you want to    │
  │    solve?"                                           │
  │  · Timeline: "When are you looking to implement?"    │
  └──────────────────────────────────────────────────────┘
         │
         ├── QUALIFIED ──▶ Book meeting with AE
         │                 (calendar booking flow)
         │
         └── UNQUALIFIED ──▶ Add to nurture sequence
                             (Marketing Cloud journey)
```
**Content:**
- **Business problem:** Large volume of inbound leads from marketing; SDRs are spending disproportionate time on routine lead qualification for low-quality leads
- **Recommended template:** Sales Development Rep (SDR) Agent
- **Key Topics:**
  - Lead Qualification (ask qualifying questions based on BANT — Budget, Authority, Need, Timeline)
  - Meeting Scheduling (for qualified leads — connect to calendar booking tool)
  - Disqualification (politely decline and route to nurture for unqualified leads)
- **Key Actions:** Flow to update Lead qualification fields, Email channel for async communication, Calendar integration for booking
- **Grounding:** Not typically needed (qualification is a conversation flow, not a knowledge retrieval task)
- **Success metrics:** Lead Response Time, Qualification Rate, Meeting Booking Rate, SDR Time Freed
**Speaker Notes:** SDR Agent use case questions focus on identifying this as an external-facing, async email channel use case. Two common exam traps: (1) confusing SDR Agent with Sales Coach (SDR is external to prospects; Sales Coach is internal to reps) and (2) not recognizing that the SDR Agent can operate via email channel over hours/days, not just real-time chat. The qualification workflow (BANT questions) is the core logic, and the meeting booking capability is the key output for qualified leads. For the exam, if the scenario involves "automatically responding to web form submissions and qualifying leads," the answer is SDR Agent.

### Slide 4: Use Case 3 — HR Employee Self-Service
**Visual:**
```
  HR Self-Service Agent — Employee Interaction (Slack)

  Employee (in Slack, DM to HR Agent):

  Employee: "How many vacation days do I have left this year?"
         │
         ▼  Agent invokes: Get Leave Balance Flow (HR system integration)
  Agent: "Hi Alex! Based on your employee record, you have
          8 vacation days remaining for 2025."
         │
  Employee: "What is the policy on carrying days over?"
         │
         ▼  Agent invokes: Knowledge Search (HR Policy articles)
  Agent: "Per our policy, up to 5 days can be carried over to
          the following year if requested by December 15."
         │
  Employee: "Can you submit a vacation request for Dec 15-20?"
         │
         ▼  Agent invokes: Create PTO Request Flow
  Agent: "Done! PTO request submitted for Dec 15-20 (4 days).
          Your manager will receive an approval request."

  Template: Custom Agent (no pre-built HR template)
  Channel:  Slack  ◀── employees are already there
```
**Content:**
- **Business problem:** HR team spending significant time answering repetitive policy questions and processing routine requests (PTO, benefits lookup, payroll queries) that take attention from strategic HR work
- **Recommended template:** Custom Agent (no pre-built HR template — this is a common exam trap)
- **Key Topics:**
  - Leave Management (check balance, submit requests, policy questions)
  - Benefits Inquiries (health, dental, 401k — Knowledge grounded)
  - Payroll Questions (paycheck schedule, deductions — Knowledge + Apex for payroll system integration)
  - Policy Questions (general HR policy — Knowledge grounded)
- **Key Actions:** Flow Actions for record lookups/creation, Knowledge Search for policies, possibly Apex for HR system integrations (ADP, Workday)
- **Deployment:** Slack (internal-facing — employees are already there)
- **Success metrics:** HR ticket deflection, response time, employee satisfaction score
**Speaker Notes:** The HR self-service use case is valuable for the exam because it tests multiple concepts: correct template choice (Custom Agent, not a pre-built one), correct deployment channel (Slack for internal users), and the mix of Knowledge grounding (for policy questions) and Flow/Apex Actions (for personalized data like leave balances). A common exam mistake is selecting Service Agent for an internal HR use case — Service Agent is designed for customer-facing service, not internal employee service. The custom agent template is appropriate here, deployed via Slack.

### Slide 5: Use Case 4 — Field Service Scheduling
**Visual:**
```
  Field Service Agent — Scheduling Workflow

  Customer: "My refrigerator is making a loud noise."
         │
         ▼  Agent: Knowledge Search — any known self-fixes?
  Agent: "There are a few quick things you can try first..."
         │
  Customer: "I tried those — still noisy."
         │
         ▼  Agent invokes: GetAvailableSlots Flow (FSM API)
  Agent: "I can schedule a technician visit. Here are the
          next available slots:
          · Thursday March 20, 10am-2pm
          · Friday March 21, 8am-12pm
          Which works best for you?"
         │
  Customer: "Thursday works."
         │
         ▼  Agent invokes: CreateWorkOrder Flow (FSM record)
  Agent: "Confirmed! Technician visit scheduled for Thursday
          March 20, 10am-2pm. Job # WO-88742.
          You'll receive a text reminder the day before."

  Template: Custom Agent
  Channel:  Embedded Service Chat + API (for phone/IVR)
  Integration: Salesforce Field Service Management
```
**Content:**
- **Business problem:** High volume of inbound service scheduling calls, requiring dispatchers to manually create work orders and match technicians to jobs — time-consuming and error-prone
- **Recommended template:** Custom Agent (Salesforce Field Service use case)
- **Key Topics:**
  - Appointment Scheduling (capture issue, present available slots, confirm booking)
  - Appointment Management (reschedule, cancel, check existing appointment status)
  - Pre-Visit Preparation (collect additional information, send technician arrival instructions)
- **Key Actions:**
  - Flow Actions: Get Available Slots (query FSM availability), Create Work Order (write to FSM), Update Appointment (modify existing record)
  - Knowledge Search: Troubleshooting guides (agent may try self-service fix before dispatching)
- **Deployment:** Embedded Service Chat for web, IVR integration via API for phone channel
- **Success metrics:** Call deflection, scheduling time, first-time fix rate, customer wait time
**Speaker Notes:** The field service scheduling use case tests the ability to design a Custom Agent that integrates with Salesforce Field Service Management. The key exam concepts: Custom Agent template (not Service Agent), Flow Actions connecting to FSM, possibly an API integration for phone/IVR channel deployment, and the pre-deflection pattern (try to resolve with Knowledge before scheduling a visit). The "try self-service before dispatching" pattern is good practice for field service: if a customer reports an issue that has a known self-fix (e.g., reset a router, clean a filter), the agent should offer that before scheduling a technician, saving both the customer and the company time.

### Slide 6: Use Case Anti-Patterns — What Not to Build
**Visual:**
```
  Four Agentforce Anti-Patterns  ⚠

  ┌──────────────────────┐  ┌──────────────────────┐
  │  THE ORACLE  ✗       │  │  DATA ENTRY CLERK  ✗ │
  │                      │  │                      │
  │  One agent, 50+      │  │  Agent used for      │
  │  Topics, handles     │  │  simple form filling │
  │  everything          │  │  with no intelligence│
  │                      │  │                      │
  │  Result: unreliable  │  │  Result: unnecessary │
  │  routing, maintenance│  │  AI complexity over  │
  │  nightmare           │  │  a simple Flow       │
  │                      │  │                      │
  │  Fix: multiple       │  │  Fix: use Flow or    │
  │  focused agents      │  │  Process Builder for │
  │                      │  │  deterministic tasks │
  └──────────────────────┘  └──────────────────────┘
  ┌──────────────────────┐  ┌──────────────────────┐
  │  LEGAL ADVISOR  ✗    │  │  ALL-KNOWING FAQ  ✗  │
  │                      │  │                      │
  │  Agent makes binding │  │  Ungrounded agent    │
  │  legal or financial  │  │  answers any         │
  │  decisions without   │  │  question using LLM  │
  │  human oversight     │  │  training data       │
  │                      │  │                      │
  │  Result: legal       │  │  Result: hallucinated│
  │  liability, incorrect│  │  answers, brand risk │
  │  commitments         │  │                      │
  │                      │  │                      │
  │  Fix: assisted mode  │  │  Fix: ground all     │
  │  with human confirm  │  │  factual topics with │
  │  for high-stakes     │  │  Knowledge articles  │
  │  decisions           │  │                      │
  └──────────────────────┘  └──────────────────────┘
```
**Content:**
- **Anti-pattern 1 — The Oracle:** Trying to put all use cases into one agent with 50+ Topics causes Atlas routing to become unreliable; creates a maintenance nightmare; violates the principle of focused, well-scoped agents
  - Fix: Build multiple focused agents for distinct use cases; separate customer service from internal HR
- **Anti-pattern 2 — Simple Automation Wrapper:** Using an Agentforce agent for a task that a simple Flow or process automation would handle better — no LLM reasoning required
  - Fix: Use Flow or Process Builder for deterministic automation; reserve Agentforce for tasks that benefit from natural language understanding
- **Anti-pattern 3 — High-Stakes Autonomous Decisions:** Configuring an agent to autonomously make irreversible decisions with significant consequences (large refunds, legal commitments, medical recommendations)
  - Fix: Use assisted actions with human confirmation for high-stakes decisions
- **Anti-pattern 4 — Ungrounded Oracle:** Deploying an agent to answer factual questions without grounding, relying on LLM training data for accuracy
  - Fix: Ground all factual Topics with Knowledge articles or Data Cloud
**Speaker Notes:** Anti-pattern awareness is exam-relevant because exam questions sometimes describe a problematic agent design and ask you to identify the issue or the fix. Know these four anti-patterns: too many Topics (scope too broad), unnecessary AI complexity (simple automation would do), autonomous high-stakes decisions (should be assisted), and ungrounded factual answers (hallucination risk). The fix for each is clear and maps to content we have covered in the course.

### Slide 7: Matching Business Problems to Agent Design
**Visual:**
```
  Business Problem → Agent Design Matching

  Problem                                    Design
  ──────────────────────────────────         ─────────────────────────────────
  1,000 daily order status calls  ─────────▶ Service Agent
                                             + Flow Action (order lookup)
                                             + Knowledge (policy FAQ)
                                             + Omni-Channel escalation

  Sales reps need coaching        ─────────▶ Sales Coach Agent
  after calls

  200 daily inbound demo requests ─────────▶ SDR Agent
                                             + email channel
                                             + BANT qualification flow
                                             + calendar booking

  Employees asking benefits       ─────────▶ Custom Agent
  questions via Slack                        + Knowledge (policies)
                                             + Flow/Apex (personalized data)
                                             + Slack deployment

  Technician dispatch for repairs ─────────▶ Custom Agent
                                             + FSM Flow Actions
                                             + Embedded Chat / API

  Three questions to apply to every scenario:
  ┌────────────────────────────────────────────────────────────────┐
  │  1. WHO IS THE USER?                                           │
  │     External customer → Service Agent or Custom               │
  │     Internal employee → Custom + Slack/Mobile                 │
  │     Prospect          → SDR Agent                             │
  ├────────────────────────────────────────────────────────────────┤
  │  2. WHAT KIND OF INTERACTION?                                  │
  │     FAQ/policy → Knowledge  |  Data lookup → Flow             │
  │     Content generation → Prompt Template  |  Record ops → Flow│
  ├────────────────────────────────────────────────────────────────┤
  │  3. IS THERE A PRE-BUILT TEMPLATE?                             │
  │     Customer service → Service Agent                          │
  │     Lead qualification → SDR Agent                            │
  │     Sales coaching → Sales Coach                              │
  │     Everything else → Custom Agent                            │
  └────────────────────────────────────────────────────────────────┘
```
**Content:**
- The matching framework — ask three questions for every business problem:
  1. **Who is the user?** — Customer (external) → Service Agent or Custom. Employee (internal) → Custom + Slack/Mobile. Prospect → SDR Agent.
  2. **What kind of interaction?** — FAQ/policy questions → Knowledge grounding. Data lookup → Flow Action. Content generation → Prompt Template Action. Record creation/update → Flow Action.
  3. **Is there a pre-built template?** — Customer service → Service Agent. Lead qualification → SDR Agent. Sales coaching → Sales Coach. Everything else → Custom Agent.
- Apply this framework to every use case question on the exam
- Spend time on the "why" as much as the "what" — the exam may ask you to justify your choice, not just name it
**Speaker Notes:** This matching framework is the exam synthesis tool for the entire course. Every use case question ultimately asks you to apply some combination of: right template type, right Topics, right Action types, right grounding sources, right deployment channel. Practice working through 5-10 scenarios and applying the framework until it is automatic. The three questions (who is the user? what kind of interaction? is there a pre-built template?) generate the right answers for the vast majority of use case questions.

### Slide 8: Business Value — Making the ROI Case
**Visual:**
```
  Agentforce ROI Dashboard — Four Value Levers

  ┌──────────────────────┐  ┌──────────────────────┐
  │  LEVER 1             │  │  LEVER 2             │
  │  Cost per contact    │  │  Scale without       │
  │  reduction           │  │  headcount           │
  │                      │  │                      │
  │  Human: $4-15/contact│  │  Human: 1 convo at   │
  │  Agent: $0.10-0.50   │  │  a time              │
  │                      │  │  Agent: 1,000+       │
  │  80-95% reduction    │  │  simultaneous        │
  │  for routine tasks   │  │  conversations       │
  └──────────────────────┘  └──────────────────────┘
  ┌──────────────────────┐  ┌──────────────────────┐
  │  LEVER 3             │  │  LEVER 4             │
  │  24/7 availability   │  │  Consistency         │
  │                      │  │                      │
  │  No shifts, no       │  │  Same accurate answer│
  │  overtime, no sick   │  │  every time          │
  │  days, always on     │  │  No agent variability│
  │                      │  │  No "bad day" answers│
  └──────────────────────┘  └──────────────────────┘

  ROI Formula:
  [(Cost per human contact - Cost per agent contact)
   × Volume of deflected contacts]
  - Implementation cost
  = NET VALUE
```
**Content:**
- **Cost per contact comparison:** Human service agents typically cost $4-15 per interaction (fully loaded); Agentforce per-conversation pricing is significantly lower for routine interactions
- **Scale:** An Agentforce agent can handle hundreds or thousands of simultaneous conversations; a human can handle one
- **Availability:** 24/7 without shift premiums, holidays, or sick days
- **Consistency:** The agent gives the same accurate answer every time; human agents vary in knowledge and approach
- **Employee experience:** Human agents freed from routine work can focus on complex, high-value interactions — often improving job satisfaction
- **ROI calculation inputs:** current contact volume, % of contacts in scope for automation, current cost per contact, projected deflection rate, Agentforce license cost
**Speaker Notes:** The business value framing is important for exam questions about why an organization should deploy Agentforce, and for real-world stakeholder conversations. Cost reduction is the most common primary driver, but the scale and consistency arguments are often the more compelling ones for growth-oriented businesses: "we can handle twice the contact volume without hiring twice the agents." For the exam, the business value questions usually ask about which metric best demonstrates agent ROI — the answer is typically deflection rate (what percentage of contacts the agent handles without human involvement) combined with cost per contact comparison.

## Recording Script
The final lecture in this course brings everything together through four real use cases that will appear — in some form — on the Agentforce Specialist exam. Learning to map a business problem to an agent design is the synthesis skill that this exam tests most heavily in its scenario-based questions.

Use case one: customer service deflection. High volume of routine service contacts — order status, billing questions, policy FAQ. The right template is Service Agent. Topics map to service domains. Actions are a mix of Knowledge Search for policy questions and Flow Actions for personalized data lookup. Grounding is critical. Escalation to human agents via Omni-Channel for complex cases. The business metric is deflection rate.

Use case two: sales lead qualification. High volume of inbound web form leads; SDR team needs relief from routine qualification. SDR Agent template. Email channel. BANT qualification questions in conversation flow. Meeting booking for qualified leads. This agent is external-facing, autonomous, and operates asynchronously via email — not real-time chat.

Use case three: HR employee self-service. Employees asking repetitive benefits and policy questions. Custom Agent template (no pre-built HR template). Deployed via Slack — that's where employees are. Topics cover leave, benefits, payroll, and general policy. Knowledge grounding for policies; Flow or Apex Actions for personalized balance lookups from HR systems.

Use case four: field service scheduling. Customer service scheduling that currently requires dispatcher involvement. Custom Agent. Flow Actions integrated with Salesforce Field Service Management. Try-self-service-first pattern before booking a technician. Deployed via Embedded Chat for web, potentially API for phone/IVR.

The use case matching framework: who is the user (external vs internal), what kind of interaction (FAQ, data lookup, content generation), and is there a pre-built template? Apply these three questions to every scenario on the exam.

## Exam Tips
- Customer service deflection → Service Agent + Knowledge Search + Flow Actions + Omni-Channel escalation
- SDR lead qualification → SDR Agent + email channel + qualification conversation flow + meeting booking — this is external-facing, NOT Sales Coach
- HR employee self-service → Custom Agent + Slack deployment + Knowledge (policies) + Flow/Apex (personalized data) — there is no pre-built HR template
- Field service scheduling → Custom Agent + Salesforce FSM Flow Actions + Embedded Chat/API — try-self-service-first pattern reduces unnecessary dispatches
- Good use case fit: high volume, well-defined process, data available, clear scope. Poor fit: low volume, high regulatory accountability, undefined process, legally sensitive decisions

## Lecture Summary
Strong Agentforce use cases share four characteristics: high volume, well-defined process, available data, and clear scope. The four canonical exam use cases are: customer service deflection (Service Agent template, Knowledge + Flow, Omni-Channel escalation, deflection rate metric), sales lead qualification (SDR Agent template, email channel, BANT qualification, meeting booking), HR employee self-service (Custom Agent, Slack deployment, Knowledge for policies + Flow/Apex for personalized data), and field service scheduling (Custom Agent, FSM Flow integration, try-self-service before dispatch). Use the three-question matching framework: Who is the user? What kind of interaction? Is there a pre-built template? Anti-patterns to avoid: too many Topics in one agent, unnecessary AI complexity over simple automation, autonomous execution of high-stakes irreversible actions, and ungrounded agents answering factual questions. Business value is measured via deflection rate, cost per contact comparison, scale (simultaneous conversations), and 24/7 availability.

## Mini Quiz

**Q1:** A telecommunications company receives 8,000 calls per day. Analysis shows 55% are for routine inquiries: balance checks, plan details, troubleshooting guides, and payment confirmations. The other 45% require human account specialists. Which Agentforce design approach should be recommended?
A) Deploy an SDR Agent to qualify the inbound contacts before routing them to human agents
B) Deploy a Service Agent with Topics covering balance inquiry, plan details, troubleshooting FAQ (Knowledge grounded), and payment (Flow actions), deployed via IVR API or Embedded Chat, with Omni-Channel escalation for the remaining 45%
C) Deploy a Sales Coach agent to help human agents handle calls faster
D) Build a Custom Agent with a single Topic covering all inquiry types to simplify configuration
**Answer:** B — This is a classic customer service deflection use case. Service Agent is the right template. The 55% of routine inquiries map to well-defined Topics: balance checks (Flow Action to query billing records), plan details (Knowledge Search), troubleshooting (Knowledge Search), payment (Flow Action). Omni-Channel escalation handles the complex 45%. SDR Agent is for external prospect qualification, not service calls. Sales Coach is for rep coaching. A single Topic for all inquiry types (Option D) would create routing ambiguity.

**Q2:** A marketing team generates 500 inbound demo request form submissions per week. The inside sales team cannot respond quickly enough, causing lead interest to cool. The company wants to automatically engage each lead within minutes, qualify them with 3-4 questions over email, and book demos for qualified leads. Which agent type and channel combination is most appropriate?
A) Service Agent deployed via Embedded Service Chat
B) Custom Agent deployed via API with a custom email integration
C) Sales Development Rep Agent configured with an email channel
D) Sales Coach Agent configured to review lead qualification calls
**Answer:** C — SDR Agent with email channel is exactly the right fit. It engages inbound leads immediately via email, asks qualifying questions asynchronously, and books meetings for qualified leads. Service Agent is for customer service, not lead qualification. A Custom Agent with custom email integration would work but adds unnecessary complexity when the SDR Agent template already includes the qualification workflow. Sales Coach analyzes sales rep calls, not inbound lead qualification.

**Q3:** A developer is designing an HR self-service agent for employees. The agent should answer questions about vacation policy and submit PTO requests on behalf of employees. The developer is deciding between Service Agent and Custom Agent templates. Which should they choose and why?
A) Service Agent — it is the most full-featured template and can be customized for HR use
B) Custom Agent — there is no pre-built HR template; Service Agent is designed for external customer-facing service, not internal employee service
C) SDR Agent — it handles form-like qualification conversations similar to PTO request collection
D) Sales Coach — it has templates for manager-employee interaction workflows
**Answer:** B — Service Agent is designed for external customer-facing service scenarios and includes default Topics (case management, order inquiry) that are not relevant to HR. Using it would require removing all default Topics and effectively rebuilding from scratch — better to start with the clean Custom Agent template. Custom Agent is the correct starting point for all use cases not covered by the three pre-built templates (Service, SDR, Sales Coach). HR self-service is a clear Custom Agent use case.
