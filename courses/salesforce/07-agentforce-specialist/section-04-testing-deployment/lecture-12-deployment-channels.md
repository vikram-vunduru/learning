# Deployment Channels

## Exam Domain
Testing, Deployment & Monitoring — ~15% of exam weight

## Core Concepts

### One Agent, Multiple Channels
You build one agent and deploy it to multiple channels. The agent's Topics, Actions, and Instructions remain the same — the channel is just the delivery mechanism. This is the "configure once, deploy many" model.

Supported deployment channels:
- **Embedded Service Chat** (web, customer-facing)
- **Salesforce Mobile App** (customer or employee)
- **Slack** (internal employees)
- **API** (custom apps, any platform)
- **Email** (SDR Agent only)

### Embedded Service Chat
The most common customer-facing deployment. Adds a chat widget to a web page.

**Setup steps:**
1. Setup → Embedded Service → Embedded Service Deployments → New
2. Choose "Embedded Chat"
3. Configure: site, branding, agent selection
4. Set escalation: select Omni-Channel queue for human handoff
5. Save → Salesforce generates an HTML/JavaScript code snippet
6. Developer embeds code snippet in external website or Experience Cloud page
7. Live immediately (users see the chat widget)

**Requirements:**
- Omni-Channel must be configured
- An Omni-Channel queue must exist for escalation routing
- The agent must be Active

### Slack Deployment (Internal)
For internal use cases (HR self-service, IT helpdesk, internal knowledge search).

**Setup:**
- Requires Salesforce for Slack app installed in the customer's Slack workspace
- Agent selected in Slack configuration
- Users interact with the agent via @mention or direct message in Slack

**Key Slack constraint:** Slack deployment is for **internal users** only. Do not deploy a customer-facing Service Agent on Slack. This is a common misunderstanding.

### API Deployment
For custom app integrations — the agent is exposed via API and any platform can connect.

**Authentication:** OAuth 2.0 (standard Salesforce connected app flow)
**Session management:** Calling app creates a session, maintains session ID across conversation turns
**Use cases:** Mobile apps, embedded in third-party portals, custom internal tools

API deployment gives the most flexibility but requires development work on the calling app side.

### Email Channel (SDR Agent)
The SDR Agent's primary channel. The agent communicates with prospects via email — responding to inbound emails, asking qualification questions, sending follow-ups.

**Key fact:** Email channel is almost exclusively for the SDR Agent. Service Agents are not typically deployed on email.

### Agent Lifecycle Management
| State | Behavior |
|-------|---------|
| **Draft** | Configuration only; no user access; no billing |
| **Active** | Live in deployed channels; user conversations enabled; billing starts |
| **Deactivated** | No new conversations; removed from channels; can be reactivated |

**Critical:** You must activate an agent before it appears in any deployed channel. Deactivation immediately stops new conversations — use when a defect is found in production or an agent needs to be taken offline.

### Consumption-Based Licensing
Agentforce charges per **conversation**, not per user seat. A conversation is one complete interaction session.

Key billing facts:
- Simulator testing: NOT billed
- Preview in Prompt Builder: NOT billed
- Real user conversations through deployed channels: BILLED
- One conversation = entire interaction session, regardless of number of turns
- Negotiate conversation volume as a block purchase

Implication: ROI analysis should compare agent cost per conversation (typically much lower than human agent cost per contact) against the deflection rate.

### Channel Feature Comparison
| Channel | User Type | Session Persistence | Requires Dev Work |
|---------|-----------|--------------------|--------------------|
| Embedded Chat | External customers | Per session | Snippet embed only |
| Slack | Internal employees | Slack thread | App install only |
| API | Any (custom app) | Custom managed | Full API integration |
| Mobile | Customer or employee | Per session | None (native app) |
| Email | External prospects (SDR) | Thread-based | Email config |

## PTA / SA Relevance

### Channel Strategy Conversation with Customers
A common discovery question is "where do you want to deploy this?" Guide customers with these questions:
1. **Who is the end user?** External customers → Embedded Chat. Internal employees → Slack. Custom app users → API.
2. **What's the existing interaction channel?** If customers already use your website chat, Embedded Chat is the natural fit. If employees live in Slack, Slack deployment has highest adoption.
3. **Do you need session persistence across days?** Email channel allows multi-day conversation threads. Chat is typically per-session.
4. **How much development effort is acceptable?** Embedded Chat requires a snippet; Slack requires app installation; API requires full integration development.

### Embedded Service Chat in a Partner Delivery
The Embedded Service Chat setup is typically a 2–4 hour configuration task. Key considerations:
- **Branding:** Match the chat widget to the customer's website design (colors, logo, welcome message)
- **Site domain:** The embedding domain must be added to the Salesforce site/CSP configuration
- **Escalation queue:** Omni-Channel queue must be set up before Embedded Service deployment. Confirm queue routing rules (round-robin, least active, etc.)
- **Working hours:** Configure agent availability by working hours — what happens when no human agent is available for escalation?

### Multi-Channel Deployment in Enterprise
Large enterprises often deploy the same agent across multiple channels with channel-specific customizations:
- Same agent logic, different welcome messages per channel
- Different escalation queues for web vs. mobile (web → contact center; mobile → priority support)
- API deployment for mobile app + Embedded Chat for web — same agent, two channels

**Governance consideration:** Each channel is a separate deployment. If you find a bug in the agent, you deactivate the agent — this takes it offline on ALL channels simultaneously. Plan deactivation windows for maintenance.

### Common Production Issues with Channel Deployment

**Issue: Chat widget doesn't appear on website**
- Cause: Script snippet not added to correct pages; CSP header blocking Salesforce domain
- Fix: Verify snippet placement; add Salesforce domains to CSP whitelist

**Issue: Escalation fails (customer gets no response after escalation request)**
- Cause: Omni-Channel queue is empty or not staffed
- Fix: Verify queue routing configuration; confirm agents are online and accepting work; set out-of-hours message

**Issue: API integration returns authentication errors**
- Cause: OAuth token expired; connected app permissions not set correctly
- Fix: Verify token refresh logic in calling app; review connected app OAuth scopes

## Architecture

### Embedded Service Chat Setup Flow
```
Setup → Embedded Service Deployments → New Deployment
    │
    ▼ Configure Deployment
    │   Site: [select Community/Experience site]
    │   Chat Channel: [select agent]
    │   Branding: color, logo, welcome message
    │   Escalation Queue: [select Omni-Channel queue]
    │
    ▼ Save → Code Snippet Generated
    │
    │  <script src="https://[orgname].my.salesforce.com/
    │       embeddedservice/5.0/esw.min.js"></script>
    │  <script> var initESW = function(...) { ... }; </script>
    │
    ▼ Developer embeds snippet in website
    │
    ▼ Chat widget appears on website
    │
    ▼ User starts conversation → Agentforce handles
    │
    ▼ [If escalation triggered]
    │   → Omni-Channel routes to available human agent
    │   → Agent sees full conversation history
    │   → Human takes over
```

**Limitations:**
- Snippet must be on every page where chat should appear — if missing from a page, no widget shows
- Omni-Channel setup is a prerequisite — without it, escalation will fail silently or error
- Salesforce domains must be whitelisted in the site's Content Security Policy
- Chat widget requires browser JavaScript support — doesn't work in no-JS environments

### Multi-Channel Agent Architecture
```
         ┌─────────────────────────────────────┐
         │         Single Agentforce Agent     │
         │  (same Topics, Actions, Instructions)│
         └────────────────┬────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   Embedded Chat       Slack           API
   (customer web)   (internal)     (custom app)
          │               │               │
   External users    Employees       Mobile app
                                       users
```

**Limitations:**
- Agent must be Active before any channel shows the agent live
- Deactivating agent removes it from ALL channels simultaneously — no channel-selective deactivation
- Some channel-specific features (e.g., typing indicators in chat) may not apply to all channels
- API channel requires maintaining OAuth tokens — calling app must handle token refresh

### Agentforce Licensing Model
```
Traditional model: Per user seat
    $X/user/month × N users

Agentforce model: Per conversation
    $X/conversation × conversation volume

ROI formula:
    Human contact cost: $4–15 per interaction
    Agentforce cost:    $0.10–0.50 per conversation
    Deflection rate:    60–80% for well-scoped agents

Annual savings = (conversations/year × deflection rate)
               × (human cost - agent cost per conversation)
```

**Limitations:**
- Consumption volume must be estimated for budget planning; difficult to predict without historical data
- Overage charges apply if purchased conversation volume is exceeded — build in buffer
- Conversations metered at session level, not turn level — long complex sessions count same as short ones

## Key Facts to Memorize
- One agent → multiple channels
- Five channel types: Embedded Chat, Mobile, Slack (internal), API (custom apps), Email (SDR only)
- Embedded Chat: requires Omni-Channel queue setup; produces HTML/JS code snippet
- Slack: **internal employees only** — not customer-facing
- API: OAuth 2.0 authentication; calling app manages session
- Email channel: primary channel for SDR Agent
- Lifecycle: Draft → Active → Deactivated; Active = live + billable
- Licensing: **consumption-based** (per conversation, not per seat)
- Simulator: NOT billable

## Customer Advisory Tips
- **Set up Omni-Channel before Embedded Chat:** This is the most common blocker for customers rushing to go live. Escalation setup needs a queue configured, staffed, and routing rules defined before the agent is deployed.
- **Staffing model for Omni-Channel:** If the agent deflects 60–70% of contacts, the remaining 30–40% need to be handled by humans. Re-assess the human agent staffing model before go-live — you may need fewer people, or re-skill them toward higher-complexity cases.
- **Consumption forecast:** Help the customer estimate conversation volume for the first 3 months. Build in a 20–30% buffer above the estimate to avoid overage surprises. Review actuals monthly in the first quarter.
- **Deactivation runbook:** Every deployment should have a written runbook for emergency deactivation. Who has permission? What's the process? Where are the steps written? This is critical for incident response.

## Exam Traps
- Slack deployment is for **internal employees**, not external customers
- Email channel is primarily for SDR Agent, not Service Agent
- Embedded Chat requires Omni-Channel queue — this is a prerequisite, not optional
- Simulator use does NOT count as a billable conversation
- Deactivating an agent removes it from ALL channels — there's no channel-selective deactivation

## Practice Questions
**Q:** A company wants to deploy an Agentforce Service Agent on their company website. What is the deployment mechanism and what prerequisite must be in place?
**A:** Embedded Service Chat deployment (generates a HTML/JS code snippet embedded in the website). Prerequisite: Omni-Channel must be configured with a queue for escalation routing.

**Q:** A Slack user tries to interact with an Agentforce agent in Slack and gets no response. The agent is Active. What is the most likely cause?
**A:** The Salesforce for Slack app isn't installed in the workspace, or the agent isn't configured in the Slack deployment settings.

**Q:** Which Agentforce channel is primarily associated with the SDR Agent for lead qualification?
**A:** Email channel — the SDR Agent communicates with prospects via email for BANT qualification and meeting booking.

**Q:** A production Agentforce agent is giving incorrect responses. The team needs to take it offline immediately. What action should be taken?
**A:** Deactivate the agent in Agentforce Studio. This immediately stops new conversations on all deployed channels. The agent can be reactivated after the issue is fixed.
