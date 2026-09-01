# Lecture 12: Deploying Agents Across Channels

## Learning Objectives
- Identify the deployment channels available for Agentforce agents: embedded service chat, Salesforce mobile, Slack, and API
- Configure an agent for embedded service chat deployment on a web property
- Explain how the same agent configuration serves multiple deployment channels
- Describe the agent lifecycle from Draft through Active deployment and version management
- Explain consumption-based Agentforce licensing and what counts as a billable conversation

## Slides

### Slide 1: Deployment Channels Overview
**Visual:**
```
  One Agent Configuration → Multiple Channels

                    ┌───────────────────────┐
                    │   AGENTFORCE AGENT    │
                    │                       │
                    │  · Topics             │
                    │  · Actions            │
                    │  · Instructions       │
                    │  · Identity           │
                    └───────────┬───────────┘
                                │
          ┌──────────┬──────────┼──────────┬──────────┐
          │          │          │          │          │
          ▼          ▼          ▼          ▼          ▼
    ┌──────────┐ ┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐
    │  Web     │ │Mobile  │ │ Slack│ │  API   │ │ Email  │
    │          │ │        │ │      │ │        │ │        │
    │ Embedded │ │  SFDC  │ │      │ │ Custom │ │  SDR   │
    │ Service  │ │ Mobile │ │      │ │  Apps  │ │ Agent  │
    │  Chat    │ │  App   │ │      │ │        │ │ only   │
    └──────────┘ └────────┘ └──────┘ └────────┘ └────────┘

    same agent configuration → consistent behavior across all touchpoints
```
**Content:**
- Agentforce agents are **channel-agnostic at the configuration level** — Topics, Actions, Instructions, and Identity are defined once and apply to all channels
- Channel configuration is handled at the **deployment layer**, not the agent configuration layer
- Available deployment channels:
  - **Embedded Service Chat** — web-based chat widget embedded on websites or in Experience Cloud
  - **Salesforce Mobile** — agent accessible via the Salesforce mobile app (internal-facing use cases)
  - **Slack** — agent deployed in a Slack workspace via the Agentforce Slack integration
  - **API** — programmatic access via the Agentforce API for custom channel implementations
  - **Email** (SDR Agent specific) — autonomous email interactions for lead qualification
- Different channels have different UX characteristics but the same underlying agent logic
**Speaker Notes:** The "configure once, deploy everywhere" model is a significant business value proposition. An agent configured for customer service can be deployed on the company website, in the mobile app, and in a Slack channel for internal testing — without rebuilding the agent logic for each channel. For the exam, this channel-agnostic architecture is the key architectural principle. If a question asks "how do you deploy the same agent to three different channels?" — configure the agent once, then add each channel as a deployment in Agentforce Builder, no duplication required.

### Slide 2: Embedded Service Chat Deployment
**Visual:**
```
  Embedded Service Chat — Setup Flow

  ┌──────────────────────────────────────────────────────────────────┐
  │  STEP 1   Setup → Embedded Service → New Embedded Service Chat   │
  │           ────────────────────────────────────────────────────── │
  │  STEP 2   Chat Bot / Agent Settings → Select Agentforce Agent    │
  │           ────────────────────────────────────────────────────── │
  │  STEP 3   Pre-chat form (optional)                               │
  │           Collect: Name, Email, Question                         │
  │           → pre-populates agent context before conversation      │
  │           ────────────────────────────────────────────────────── │
  │  STEP 4   Escalation routing                                     │
  │           → Omni-Channel queue for live agents (REQUIRED)        │
  │           ────────────────────────────────────────────────────── │
  │  STEP 5   Configure widget appearance                            │
  │           Colors, header text, position (bottom-right)           │
  │           ────────────────────────────────────────────────────── │
  │  STEP 6   Copy deploy code snippet                               │
  │           Paste into website HTML  ◀── web team deploys this     │
  └──────────────────────────────────────────────────────────────────┘

  Customer sees:                  Website
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │  [website content...]                     ┌────────────────┐   │
  │                                           │  Hi! How can   │   │
  │                                           │  I help you?   │   │
  │                                           │                │   │
  │                                           │  [Type here..] │   │
  │                                           └────────────────┘   │
  └─────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Embedded Service Chat** is the most common Agentforce deployment channel for B2C scenarios
- Configuration in Setup → Embedded Service → New Embedded Service Chat
- Steps:
  1. Create a new Embedded Service Chat (or edit an existing one)
  2. In the Chat Bot / Agent settings, select your Agentforce agent
  3. Configure pre-chat fields (optional: name, email, question — can pre-populate agent context)
  4. Configure escalation routing queue (Omni-Channel queue for live agents)
  5. Configure the chat widget appearance (colors, header text, position)
  6. Deploy the generated code snippet to the website
- **Escalation integration:** Escalation from the Agentforce agent to a live agent requires an Omni-Channel routing configuration pointing to a live agent queue
**Speaker Notes:** The Embedded Service Chat setup is the most hands-on deployment task and appears in Lab 3. For the exam, know the key steps: create or configure Embedded Service Chat, select the Agentforce agent, configure escalation routing, deploy the code snippet. The escalation integration is worth emphasizing: if escalation is not configured, when the agent decides to hand off to a human, there is no live agent to hand off to and the customer experience degrades. Always set up the Omni-Channel routing queue as part of the Service Agent deployment.

### Slide 3: Slack Deployment
**Visual:**
```
  Slack Deployment — Internal Agent Access

  Slack Workspace
  ┌────────────────────────────────────────────────────────────────┐
  │  # general  # engineering  # sales    DIRECT MESSAGES          │
  │                                                                │
  │  ┌────────────────────────────────────────────────────────┐   │
  │  │  HR Assistant  🤖                                      │   │
  │  │  ─────────────────────────────────────────────────     │   │
  │  │  Employee: How many vacation days do I have left?      │   │
  │  │                                                        │   │
  │  │  HR Assistant: Hi Alex! Based on your employee         │   │
  │  │  record, you have 8 vacation days remaining for        │   │
  │  │  this year.                                            │   │
  │  │                                                        │   │
  │  │  Employee: What is the policy on rolling over days?    │   │
  │  └────────────────────────────────────────────────────────┘   │
  └────────────────────────────────────────────────────────────────┘

  Setup flow:
  Setup → Slack Integration → Agentforce for Slack
       → select agent → configure workspace & channel access
       → Salesforce for Slack app must be installed in workspace
```
**Content:**
- **Slack deployment** is ideal for **internal-facing use cases**: employee self-service, HR inquiries, IT helpdesk, sales coaching
- Configuration: Setup → Slack Integration → Agentforce for Slack → select agent → configure workspace and channel access
- Requires the **Salesforce for Slack app** installed in the Slack workspace
- Users interact with the agent via **Direct Messages** or by @mentioning the agent in a configured channel
- The Slack channel provides a natural, asynchronous interaction model — the agent responds when available, users can continue other work
- **User context:** Slack-deployed agents can use the user's Salesforce identity (if SSO is configured) for personalized responses
- Use case example: an employee messages the HR agent "how many vacation days do I have?" → agent looks up their Employee record and responds
**Speaker Notes:** Slack deployment is particularly powerful for internal agents because employees are already in Slack all day — the agent meets them where they work rather than requiring them to open Salesforce. For the exam, Slack deployment appears most commonly in use case questions involving employee-facing agents. When you see a scenario about "an HR agent that employees can access from their team collaboration tool," the deployment channel is Slack. The key configuration requirements: Salesforce for Slack app installed, agent selected for the workspace, user identity federation for personalized responses.

### Slide 4: API Deployment
**Visual:**
```
  API Deployment — Programmatic Channel Access

  Custom Mobile App / External System
         │
         │  HTTPS POST /agentforce/sessions/{sessionId}/messages
         │  Headers: Authorization: Bearer {token}
         │  Body: { "message": "What is my order status?" }
         │
         ▼
  ┌──────────────────────────────────────────────────┐
  │         SALESFORCE AGENTFORCE API                │
  │                                                  │
  │  1. Validate Bearer token (OAuth 2.0)            │
  │  2. Resolve session (conversation continuity)    │
  │  3. Pass message to Atlas                        │
  │  4. Atlas processes → invokes Actions            │
  │  5. Return response                              │
  └──────────────────────────────────────────────────┘
         │
         │  Response: { "reply": "Your order #12345 is..." }
         │
         ▼
  App displays response to user

  Key concepts:
  · Session ID — maintain across calls for conversation continuity
  · Bearer token — OAuth 2.0 authentication required
  · Connected App — required with Agentforce API scopes
```
**Content:**
- **API deployment** allows any external application to interact with an Agentforce agent programmatically
- Use cases: custom mobile apps, third-party chat platforms, voice assistants, kiosk applications
- API access requires: a connected app with appropriate OAuth scopes, Agentforce API permissions
- Key API concepts:
  - **Session management** — each conversation has a Session ID; use the same ID across multiple API calls to maintain conversation context
  - **Message format** — API accepts text messages; responses include the agent's text reply and may include action results
  - **Authentication** — uses Salesforce OAuth 2.0; bearer tokens required
- API deployment is the most flexible channel: any system that can make HTTPS calls can use it
- Developers should manage session lifecycle (create session, maintain session ID, close/timeout session)
**Speaker Notes:** API deployment is most relevant for organizations building custom applications that need embedded AI agent capabilities. For the exam, the API deployment is tested conceptually rather than requiring detailed API knowledge. Know: it uses Salesforce OAuth, sessions have IDs that must be maintained across calls, and it is the channel for non-Salesforce applications to access the agent. If an exam question describes "a custom iOS app that needs to use an Agentforce agent for customer service," the answer is API deployment.

### Slide 5: Agent Lifecycle Management
**Visual:**
```
  Agent Lifecycle States

  ┌────────────┐    Activate     ┌────────────┐   Deactivate   ┌─────────────┐
  │            │ ─────────────▶ │            │ ────────────▶  │             │
  │   DRAFT    │                │   ACTIVE   │                │ DEACTIVATED │
  │            │ ◀───────────── │            │ ◀──────────────│             │
  └────────────┘   Edit / Test  └────────────┘  Reactivate/   └─────────────┘
       │                                         Edit
       │ (Conversation Simulator available)
       │ (No live conversations)

  Version Management Pattern for Major Updates:

  Current Production                 New Version
  ┌─────────────┐                   ┌─────────────┐
  │  ACTIVE     │                   │  DRAFT      │
  │  Agent v1   │ ── clone ──────▶  │  Agent v2   │
  │  (live)     │                   │  (editing)  │
  └─────────────┘                   └──────┬──────┘
                                           │ test in simulator
                                           ▼
  ┌─────────────┐                   ┌─────────────┐
  │ DEACTIVATED │                   │   ACTIVE    │
  │  Agent v1   │ ◀── deactivate    │  Agent v2   │
  │  (offline)  │       swap ──────▶│  (live)     │
  └─────────────┘                   └─────────────┘
```
**Content:**
- **Draft** — agent is being configured; simulator testing available; no live conversations
- **Active** — agent is live; channels are accepting conversations; configuration changes require deactivation first (or versioning)
- **Deactivated** — agent is offline; channels stop routing; conversations in progress may be affected
- **Version management best practices:**
  - Never make major configuration changes to a live Active agent — the changes affect live conversations immediately
  - For significant updates: clone the agent, make changes, test the clone, deactivate the original, activate the clone
  - For minor updates (description changes, Instruction wording): deactivate, make changes, reactivate quickly
- **Sandbox promotion:** major updates should be developed and tested in sandbox → promoted via change set or SF CLI → activated in production
**Speaker Notes:** Version management for agents does not have the same native tooling as code version control (no Git, no branches). The recommended pattern for major updates is the clone-and-swap approach: keep the original running, build and test the new version as a clone, then perform the swap. This minimizes downtime. For exam purposes, know the three lifecycle states and understand that changes to an Active agent affect live conversations — the safe approach is always to deactivate before making significant changes. If a question asks "how should a developer make a major update to a production Agentforce agent?" — clone, update clone, test, deactivate original, activate clone.

### Slide 6: Consumption-Based Licensing
**Visual:**
```
  Agentforce Licensing Model

  Traditional Salesforce          Agentforce
  (Seat-Based)                    (Consumption-Based)
  ┌──────────────────────┐        ┌──────────────────────┐
  │  200 users           │        │  Conversations used  │
  │  × $X per seat       │        │  ÷ Conversations     │
  │  = Annual cost       │        │    purchased         │
  │  (fixed)             │        │  = Consumption meter │
  └──────────────────────┘        └──────────────────────┘

  COUNTS as a conversation:        DOES NOT count:
  ┌─────────────────────────┐      ┌─────────────────────────┐
  │  · Customer-initiated   │      │  · Simulator testing in │
  │    session (1 session   │      │    Agentforce Builder   │
  │    = 1 conversation)    │      │  · Admin config use     │
  │  · Each distinct        │      │                         │
  │    channel session      │      │                         │
  └─────────────────────────┘      └─────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │  Conversations Used:  [███████████░░░░░░░░░] 14,820 / 25k  │
  │  Remaining:  10,180   Alert threshold: 20,000              │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- **Agentforce licensing is consumption-based** — you pay per conversation, not per user seat
- A **conversation** begins when a user sends their first message and ends when the session closes (customer leaves, agent escalates, timeout)
- **What counts toward consumption:**
  - Customer-initiated conversations with the agent
  - Each distinct session (not each message within a session)
- **What typically does NOT count:**
  - Simulator testing in Agentforce Builder
  - Internal admin use during configuration
- **Cost management:**
  - Monitor consumption in the Agentforce analytics dashboard
  - Set usage alerts to prevent unexpected consumption
  - Escalation to human agents may reduce agent conversation consumption depending on configuration
- **License pools:** Organizations typically purchase a block of conversations per year; unused conversations may or may not roll over (check current agreement)
**Speaker Notes:** The consumption-based model is a significant departure from Salesforce's traditional seat-based licensing, and it is consistently tested on the exam. Know the model: you buy conversations, not seats. Know what counts and what doesn't (simulator testing doesn't count). Know that cost management involves monitoring conversation volume and understanding which interactions consume quota. For real implementations, the ROI calculation is: cost per Agentforce conversation vs. cost per human agent conversation — for large volumes of routine interactions, Agentforce conversations are significantly cheaper.

### Slide 7: Channel-Specific Considerations
**Visual:**
```
  Channel Feature Comparison

  ┌─────────────────┬───────────┬─────────┬──────────┬─────────┬─────────┐
  │  Feature        │ Embedded  │ Mobile  │  Slack   │   API   │  Email  │
  │                 │  Chat     │         │          │         │         │
  ├─────────────────┼───────────┼─────────┼──────────┼─────────┼─────────┤
  │  Real-time vs   │ Real-time │Real-time│  Async   │Real-time│  Async  │
  │  Async          │           │         │          │         │         │
  ├─────────────────┼───────────┼─────────┼──────────┼─────────┼─────────┤
  │  Rich media     │ Limited   │ Limited │  Full    │ Varies  │ Limited │
  ├─────────────────┼───────────┼─────────┼──────────┼─────────┼─────────┤
  │  Session        │ Config    │ Config  │  None    │ Config  │   N/A   │
  │  timeout        │           │         │          │         │         │
  ├─────────────────┼───────────┼─────────┼──────────┼─────────┼─────────┤
  │  Identity       │ Pre-chat  │   SSO   │  Slack   │  Token  │  From   │
  │  context        │ form      │         │ identity │         │  email  │
  ├─────────────────┼───────────┼─────────┼──────────┼─────────┼─────────┤
  │  Typing         │    ✓      │    ✓    │    ✗     │ Varies  │   N/A   │
  │  indicators     │           │         │          │         │         │
  └─────────────────┴───────────┴─────────┴──────────┴─────────┴─────────┘
```
**Content:**
| Feature | Embedded Chat | Mobile | Slack | API | Email |
|---------|---------------|--------|-------|-----|-------|
| Real-time | ✓ | ✓ | Async | ✓ | Async |
| Rich media | Limited | Limited | Full | Varies | Limited |
| Session timeout | Config | Config | None | Config | N/A |
| Identity context | Pre-chat | SSO | Slack identity | Token | From email |
| Typing indicators | ✓ | ✓ | ✗ | Varies | N/A |

- Channel-specific testing is required even after agent-level testing — the same agent can behave slightly differently across channels due to formatting, session handling, and identity resolution differences
- **Response formatting:** Some channels support markdown (Slack, API); others render plain text only — test that AI-generated responses render correctly
- **Session timeout:** Define session timeout settings per channel — if a customer walks away and comes back 30 minutes later, should the session continue or restart?
- **Identity resolution:** Pre-chat forms (Embedded Chat), SSO (Mobile), Slack identity, or API token determine who the agent "knows" the user is
**Speaker Notes:** Channel-specific testing is a step that implementation teams often skip, assuming that if the agent works in the simulator it will work everywhere. Common channel-specific issues: markdown formatting that renders as asterisks in embedded chat instead of bold text; session timeouts that restart conversations inappropriately; identity context not passing correctly from pre-chat forms. Always allocate time for channel-specific testing even after agent unit and integration testing is complete.

### Slide 8: Deployment Checklist
**Visual:**
```
  Deployment Readiness Checklist

  ┌──────────────────────────────────────────────────────────────────┐
  │  PRE-DEPLOYMENT                                                  │
  │  ─────────────────────────────────────────────────────────────  │
  │  ☐ All test cases passing (unit, integration, UAT)              │
  │  ☐ Escalation routing configured (Omni-Channel queue)           │
  │  ☐ All deployment channels configured and tested                │
  │  ☐ Knowledge articles published and verified                    │
  │  ☐ Instructions reviewed by legal/compliance                    │
  │  ☐ Stakeholder sign-off obtained                                │
  └──────────────────────────────────────────────────────────────────┘
  ☐ Pre-deployment complete
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  GO-LIVE                                                         │
  │  ─────────────────────────────────────────────────────────────  │
  │  ☐ Activate agent in production org                             │
  │  ☐ Deploy channel configurations (code snippet, app installs)   │
  │  ☐ Monitor initial conversations (first 24-48 hours)            │
  │  ☐ Brief support team on escalation behavior                    │
  └──────────────────────────────────────────────────────────────────┘
  ☐ Go-live complete
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  POST-DEPLOYMENT                                                 │
  │  ─────────────────────────────────────────────────────────────  │
  │  ☐ Review conversation analytics within first week              │
  │  ☐ Identify Topics with poor resolution rates                   │
  │  ☐ Plan first optimization cycle (2-4 weeks post go-live)       │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Pre-deployment checklist:**
  - All test cases passing (unit, integration, UAT)
  - Escalation routing configured (Omni-Channel)
  - All deployment channels configured and tested
  - Knowledge base reviewed and published
  - Instructions reviewed by legal/compliance
  - Stakeholder sign-off obtained
- **Go-live steps:**
  - Activate agent in production org
  - Deploy channel configurations (code snippet, app installs)
  - Monitor initial conversations (first 24-48 hours) closely
  - Brief support team on escalation behavior
- **Post-deployment:**
  - Review conversation analytics within first week
  - Identify Topics with poor resolution rates
  - Plan first optimization cycle (typically 2-4 weeks after go-live)
**Speaker Notes:** The post-deployment monitoring period is where most real-world agent improvements happen. The first 2-4 weeks of live data will reveal Topics that need better descriptions, Actions that fail for edge cases not caught in testing, and customer intents you did not anticipate during planning. Build in an explicit "optimization cycle" after go-live rather than treating deployment as the end of the project. For the exam, deployment checklist questions typically focus on what must happen before activation — all of the pre-deployment items above.

## Recording Script
Once you have built and tested your agent, the next question is: where does it live? Agentforce agents are channel-agnostic — you configure the agent once and deploy it to as many channels as needed. The agent's Topics, Actions, and Instructions stay the same; what changes is the user interface where customers or employees interact with it.

The most common deployment channel is Embedded Service Chat — the web widget you see in the bottom corner of company websites. Configuration involves setting up the Embedded Service Chat in Salesforce Setup, selecting your Agentforce agent as the chatbot/agent, configuring escalation routing to a live agent queue, and deploying the generated code snippet to your website. The escalation routing step is critical — if customers need to reach a human and there is no queue configured, the handoff fails.

Slack deployment is ideal for internal use cases: HR self-service, IT helpdesk, sales coaching. Employees are already in Slack; the agent meets them there. The Salesforce for Slack app connects the workspace to your org's agent configuration. The API channel is the most flexible — any external application can interact with the agent via HTTPS calls using Salesforce OAuth, making it suitable for custom mobile apps, voice assistants, or kiosk systems.

Agentforce uses consumption-based licensing: you buy conversations, not seats. Each customer session counts as one conversation. Simulator testing does not count toward consumption. Monitor your conversation usage and set alerts — this is a new mental model for Salesforce orgs used to seat-based licensing.

After deploying, monitor closely for the first 72 hours. Real customer conversations will reveal edge cases your testing did not cover. Plan an optimization cycle within the first two weeks.

## Exam Tips
- Agentforce is channel-agnostic: configure agent once, deploy to multiple channels (Embedded Chat, Mobile, Slack, API, Email for SDR) without rebuilding the agent
- Embedded Service Chat deployment requires: configured Embedded Service Chat, agent selected, escalation Omni-Channel queue configured, code snippet deployed to website
- Agentforce licensing is consumption-based (per conversation), not seat-based — simulator testing does not count as a billable conversation
- To update an Active agent safely: deactivate, make changes, test in simulator, reactivate — or for major updates, clone-and-swap approach
- Slack is the appropriate deployment channel for internal-facing agents (HR, IT helpdesk, employee self-service)

## Lecture Summary
Agentforce agents are configured once and deployed to multiple channels: Embedded Service Chat (web widget, most common for customer-facing B2C), Salesforce Mobile (internal use), Slack (internal use cases, employee self-service), API (custom applications via HTTPS/OAuth), and Email (SDR Agent lead qualification). Channel configuration is separate from agent configuration — Topics, Actions, and Instructions apply across all channels. Embedded Service Chat deployment requires a configured chat widget, an Agentforce agent selection, an Omni-Channel queue for escalation routing, and a deployed code snippet. Agentforce licensing is consumption-based: you purchase conversation blocks, not user seats; simulator testing does not consume quota. Agent lifecycle states are Draft, Active, and Deactivated; the safe update process for Active agents is to deactivate, make changes, test, and reactivate. Post-deployment monitoring in the first 72 hours and a planned optimization cycle within two weeks are deployment best practices.

## Mini Quiz

**Q1:** A company has configured an Agentforce Service Agent and wants to deploy it to their public website and also make it available to internal support reps in their Salesforce org via Slack. How many separate agent configurations are needed?
A) Two — one for the website and one for Slack
B) Three — one per channel plus one master configuration
C) One — configure the agent once and add both Embedded Service Chat and Slack as deployment channels
D) One for the agent logic, but the agent's Topics and Actions must be duplicated for each channel
**Answer:** C — Agentforce agents are channel-agnostic. One agent configuration supports multiple deployment channels. The developer adds Embedded Service Chat as one channel and Slack as another, both pointing to the same agent. Topics, Actions, and Instructions remain a single shared configuration. There is no need to duplicate agent logic per channel.

**Q2:** An administrator activates an Agentforce agent and deploys it to Embedded Service Chat. After 48 hours of live operation, they want to update the Instructions to improve escalation behavior. What is the recommended approach?
A) Edit the Instructions directly in the Active agent — changes take effect immediately
B) Deactivate the agent, update the Instructions, test the change in the simulator, then reactivate
C) Create a new Agent from scratch with the updated Instructions
D) Changes to Instructions require a Salesforce Support case and cannot be made by administrators
**Answer:** B — Best practice is to deactivate the agent before making configuration changes, even relatively minor ones like Instructions updates. This prevents the change from affecting live conversations mid-session during editing. After making and testing the change in the simulator, reactivate. For minor wording changes with low risk, some teams edit in place on Active agents — but the exam-safe answer is always deactivate first, following the recommended lifecycle management approach.

**Q3:** An Agentforce deployment runs 50,000 customer service conversations per month using the agent. The company also has 200 service reps. Under Agentforce's licensing model, which factor primarily determines the Agentforce cost?
A) The number of service reps (200 seats) who have access to the Agentforce Builder
B) The number of customer-facing agent conversations (50,000 per month)
C) The number of Salesforce objects the agent queries across all conversations
D) A flat annual platform fee regardless of usage
**Answer:** B — Agentforce uses consumption-based licensing measured in conversations. The 50,000 monthly customer conversations are the primary billing metric, not the number of Salesforce users or seats. This is a fundamentally different model from traditional Salesforce licensing, which is seat-based. The consumption model means costs scale with agent usage/volume rather than with the size of the internal team.
