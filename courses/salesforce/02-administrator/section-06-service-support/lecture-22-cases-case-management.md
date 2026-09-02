# Cases & Case Management

## Exam Domain
Service & Support Apps — 11% of exam

## Core Concepts

**Case:** The central service object. Represents a customer issue, question, or request. Every customer interaction in Service Cloud starts (or ends up) as a Case.

**Key Case fields:**
- **Subject** (required): short description of the issue
- **Status**: New → In Progress → Escalated → Closed (configurable picklist)
- **Priority**: Low, Medium, High, Urgent
- **Case Origin**: how it arrived (Phone, Email, Web, Chat, etc.)
- **Account + Contact**: who the case is for
- **Case Owner**: current owner (user or queue)

**Web-to-Case:**
- HTML form that creates Cases directly from your website
- Similar to Web-to-Lead but creates Cases
- Daily limit: 5,000 cases per day (much higher than Web-to-Lead's 500)

**Email-to-Case:**
- Inbound emails sent to a specific address automatically create Case records
- Two modes:
  - **Standard Email-to-Case:** Emails route through Salesforce's servers
  - **On-Demand Email-to-Case:** Emails stay on your own mail server; Salesforce provides an email relay (keeps email behind your firewall)
- Reply-to threads update the existing case (email threading)

**Case Auto-Response Rules:**
- Automatically send an email to the customer when a Case is created
- Criteria-based: different templates for different case types
- One active auto-response rule at a time (same as assignment rules)

**Escalation Rules:**
- Automatically escalate cases that haven't been resolved/responded to within a time window
- Can change case owner, reassign to queue, or send notification email
- Time-based: after X hours without activity/status change, escalate

**Case Assignment Rules:**
- Route cases to users or queues based on criteria
- Same mechanics as Lead Assignment Rules: one active, entries in order, first match wins

## PTA / SA Relevance

Case management is where the ROI of Salesforce Service Cloud is measured. The key metrics: First Response Time, Average Handle Time, CSAT, Case Resolution Rate. Everything in case management design should optimize for these.

**Omni-Channel:** Enterprise Service Cloud implementations use Omni-Channel to route work items (cases, chats, leads) to agents based on capacity and skills. This replaces manual assignment rules with real-time intelligent routing. For the admin exam, know Assignment Rules; in customer architecture conversations, recommend Omni-Channel for anything beyond basic routing.

**Case escalation vs SLA milestones:** Escalation Rules are the basic form of SLA enforcement. Entitlements + Milestones are the full SLA framework (covered in lecture-24). Many customers start with escalation rules and graduate to Entitlements as they mature their service operations.

## Architecture / How It Works

```
Case Management Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CASE CREATION CHANNELS:
  ┌──────────────────────────────────────────┐
  │  Web-to-Case (web form) → 5,000/day      │
  │  Email-to-Case (inbound email)           │
  │  Manual (agent entry)                    │
  │  API / Integration                       │
  │  Social channels (Social Studio)         │
  └─────────────────┬────────────────────────┘
                    │ Assignment Rule
                    ▼
  CASE ASSIGNED TO USER OR QUEUE
  ┌──────────────────────────────────────────┐
  │  Status: New → Working → Escalated       │
  │  Escalation Rule runs on timer           │
  │  Auto-Response sends acknowledgment      │
  └─────────────────┬────────────────────────┘
                    │
                    ▼
  CASE CLOSED
  ┌──────────────────────────────────────────┐
  │  Status: Closed                          │
  │  CSAT survey triggered (if configured)   │
  └──────────────────────────────────────────┘
```

**Limitations:**
- Web-to-Case: 5,000 cases/day (default limit)
- Email-to-Case threading requires the case number in the email subject to match the existing case
- Only ONE auto-response rule active at a time per object
- Escalation Rules: time calculations pause when business hours are set and it's outside business hours
- Assignment rules: first-match only — order of rule entries matters

## Key Facts to Memorize

- Web-to-Case daily limit = 5,000 (vs Web-to-Lead = 500)
- Email-to-Case: Standard vs On-Demand (on-demand keeps email on your server)
- Auto-Response Rules: one active at a time; sends email on case creation
- Escalation Rules: time-based; escalate if not resolved/responded within X hours
- Assignment Rules: one active, first-match wins
- Cases can be owned by a User or a Queue
- Case Origin tracks how the case was created (Phone, Email, Web, etc.)

## Exam Traps

- **"Web-to-Case has the same daily limit as Web-to-Lead (500)"** — FALSE. Web-to-Case limit is 5,000/day.
- **"Multiple auto-response rules can be active simultaneously"** — FALSE. Only one.
- **"Email-to-Case Standard mode keeps emails on the company's mail server"** — FALSE. Standard Email-to-Case routes through Salesforce servers. On-Demand mode keeps emails on the company's server.
- **"Escalation rules delete cases if not resolved"** — FALSE. They escalate (reassign, notify, change priority) but never delete cases.

## Practice Questions

**Q:** A company wants cases submitted via their website to automatically create Salesforce Cases. Which feature should they use?
**A:** Web-to-Case. Generate the HTML form in Setup → Web-to-Case, embed it on the company website.

**Q:** A support manager wants cases that aren't responded to within 4 hours to automatically be reassigned to a senior support queue. What should the admin configure?
**A:** Escalation Rules. Set a rule entry for cases with no response within 4 hours → reassign to the senior support queue.

**Q:** What is the difference between Standard Email-to-Case and On-Demand Email-to-Case?
**A:** Standard Email-to-Case routes emails through Salesforce's servers. On-Demand Email-to-Case (via email relay) keeps emails on the company's mail server and sends a notification to Salesforce — useful for companies with strict email security requirements.
