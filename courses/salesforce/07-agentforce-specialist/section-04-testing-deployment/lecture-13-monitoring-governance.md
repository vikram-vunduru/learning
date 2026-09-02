# Monitoring and Governance

## Exam Domain
Testing, Deployment & Monitoring — ~15% of exam weight

## Core Concepts

### Key Metrics to Monitor
After go-live, track these five metrics weekly (at minimum):

| Metric | What It Measures | Good Target | Warning Signal |
|--------|-----------------|-------------|----------------|
| **Resolution Rate** | % of conversations fully resolved by agent without human handoff | 60–80% | Below 40% indicates Topic/Action gaps |
| **Escalation Rate** | % of conversations transferred to human | 20–40% | Above 60% means agent isn't resolving enough |
| **Session Duration** | Average conversation length | Depends on use case | Very long = agent stuck/looping |
| **Deflection Rate** | % of potential human contacts handled by agent | > 50% for ROI positive | Low = business value question |
| **CSAT (Customer Satisfaction)** | User rating of interaction quality | > 4.0/5.0 | Below 3.5 = quality problem |

Resolution Rate + Escalation Rate should sum to approximately 100%. A high escalation rate is not always bad — for complex service cases, it may be appropriate. Context matters.

### Conversation History Records
Every Agentforce conversation is stored as a record in Salesforce. You can:
- View conversation transcripts in Setup → Agentforce → Conversation History
- Filter by date, agent, channel, resolution status
- Use reports and dashboards for aggregate metrics
- Drill into individual conversations to see the full transcript

These records are the production debugging tool. When a customer reports the agent gave wrong information, pull the specific conversation record to see exactly what was said.

### The Five Einstein Trust Layer Controls

| Control | What It Does | Direction |
|---------|-------------|-----------|
| **Data Masking** | Detects and replaces PII/PCI/PHI with tokens before sending to LLM | Outbound (prompt → LLM) |
| **Zero Data Retention** | LLM provider contractually cannot retain or train on prompt data | Both (contractual) |
| **Toxicity Detection** | Filters harmful, offensive, or inappropriate content | Inbound (LLM response → user) and outbound (user prompt → LLM) |
| **Audit Log** | Records every LLM interaction: timestamp, masked prompt, response, outcome | Both |
| **Grounding** | Constrains LLM to respond based on retrieved data rather than fabricating | Outbound (prompt assembly) |

### Data Masking Detail
Masking is **bidirectional**:
- **Before prompt sent to LLM:** PII detected in the prompt (SSNs, credit card numbers, email addresses, phone numbers) is replaced with tokens (e.g., `[MASKED_SSN_1]`)
- **In LLM response:** If the LLM references the masked token back, the response can be de-tokenized for the user

Pattern-based detection: Masking uses regex-style patterns to detect common PII formats. Free-text PII in unusual formats may not be caught.

### Zero Data Retention (ZDR) — Clarify Exactly What This Means
This is the most misunderstood Trust Layer control:

**What ZDR means:** The LLM **provider** (e.g., OpenAI, Anthropic, or Salesforce's own models) is contractually required to:
- NOT store the prompt or response after processing
- NOT use the data for model training
- Delete the data immediately after generating a response

**What ZDR does NOT mean:** Salesforce does NOT delete conversation data from your org. Conversation transcripts are stored in Salesforce's database, subject to your org's data retention policies.

Memory test: "Zero Data Retention = LLM provider deletes it; Salesforce stores it."

### Toxicity Detection
Applied in both directions:
- **User prompts → LLM:** If a user sends toxic/harmful content, it can be filtered before reaching the LLM
- **LLM responses → user:** Generated responses are checked for harmful content before being delivered

Operates with severity levels — very harmful content is blocked; borderline content may be flagged but passed.
Probabilistic — can have false positives (legitimate content blocked) and false negatives (harmful content slips through).

### Audit Log Record Structure
Each Audit Log entry records:
- Timestamp of the LLM call
- Agent/template that made the call
- Masked prompt sent to LLM (PII already replaced with tokens)
- Response received from LLM
- Trust Layer controls applied and their outcomes
- User who initiated the interaction (when authenticated)

Audit logs are queryable as Salesforce records. Export for compliance reviews, security audits, or regulatory reporting.

### Four-Layer Governance Framework
1. **Trust Layer:** Technical controls (masking, ZDR, toxicity, audit)
2. **Agent Instructions:** Behavioral rules, exclusions, escalation triggers
3. **Topic scope:** Agent only handles configured Topics (can't improvise)
4. **Human escalation:** Defined conditions under which a human takes over

Defense in depth: each layer catches different failure modes. Trust Layer catches data/content issues; Instructions catch behavioral issues; Topic scope prevents unauthorized capabilities; escalation catches unresolvable situations.

## PTA / SA Relevance

### Governance Assessment in Discovery
When scoping an Agentforce implementation, assess the customer's governance requirements:
1. **Industry/regulatory framework:** FinServ (FINRA, SEC), Healthcare (HIPAA), Retail (PCI) — each has specific data handling requirements
2. **Data classification:** What data will the agent access? PII? PHI? Financial records? Map data types to Trust Layer controls needed.
3. **Audit requirements:** How long must interaction logs be retained? Who can access them? Export format for compliance reviews?
4. **Escalation governance:** Who reviews escalation patterns? Who approves changes to escalation triggers?

This assessment shapes the Instructions design, Trust Layer configuration, and determines whether additional controls are needed.

### Monitoring as an Ongoing Service
Partners can offer ongoing monitoring services:
- Weekly review of resolution rate, escalation rate, CSAT
- Monthly review of wrong-action patterns (from conversation logs)
- Quarterly review of Topics and Actions coverage gaps (based on OOS requests in logs)
- Continuous improvement: adding Topics, refining descriptions, adding Knowledge articles

This is a recurring revenue stream: "Agentforce Managed Services."

### Building an Agentforce Governance Dashboard
For enterprise customers, build a custom Salesforce dashboard:
- Report 1: Resolution Rate trend by week
- Report 2: Escalation Rate by Topic (which Topics are escalating most?)
- Report 3: Session Duration distribution (are long sessions clustered around specific Topics?)
- Report 4: OOS request volume and patterns (what are users asking that the agent can't handle?)
- Report 5: CSAT distribution

Review this dashboard in a monthly governance meeting with the customer's AI governance committee.

### Compliance Audit Readiness
For regulated industries:
- Enable audit log before go-live — retroactive logging not possible for events before enablement
- Set audit log retention period per your regulatory requirement (HIPAA: 6 years; Sarbanes-Oxley: 7 years)
- Identify who has access to audit logs — limit to security/compliance roles
- Test audit log completeness: verify that test conversations appear in the audit log
- Document that Zero Data Retention agreement is in place (via Salesforce's Data Processing Addendum)

## Architecture

### Trust Layer in Detail
```
Agent Conversation Turn:
                                    ┌──────────────────────────────┐
User Message                        │    EINSTEIN TRUST LAYER      │
      │                             │                              │
      ▼                             │  1. DATA MASKING             │
Prompt Assembly                     │     PII/PCI/PHI → tokens     │
(Instructions + Topics +            │     [SSN: 123-45-6789]       │
 Actions + History +                │     → [MASKED_SSN_1]         │
 Knowledge results)                 │                              │
      │                             │  2. ZERO DATA RETENTION      │
      ▼─────────────────────────────▶     Masked prompt sent to LLM│
                                    │     LLM contractually bound  │
                                    │     to discard after response │
                                    │                              │
                                    │  3. LLM RESPONSE received    │
                                    │                              │
                                    │  4. TOXICITY DETECTION       │
                                    │     Check response content   │
                                    │     Harmful → filtered/blocked│
                                    │                              │
                                    │  5. AUDIT LOG                │
                                    │     Record: masked prompt,   │
                                    │     response, controls, user │
                                    └──────────────────────────────┘
                                                │
                                                ▼
                                    Filtered response → Atlas → User
```

**Limitations:**
- Data masking is pattern-based — novel PII formats may not be caught
- Toxicity detection is probabilistic — false positives (blocks legitimate content) and false negatives (misses harmful content) occur
- Audit logs stored in Salesforce org — subject to org storage limits; monitor log volume
- ZDR is contractual — depends on Salesforce's agreements with LLM providers; verify current agreements in Salesforce documentation

### Four-Layer Governance Model
```
Layer 1: EINSTEIN TRUST LAYER (Salesforce platform)
    ├── Data Masking (automatic, configurable)
    ├── Zero Data Retention (contractual)
    ├── Toxicity Detection (automatic)
    └── Audit Logging (automatic when enabled)

Layer 2: AGENT INSTRUCTIONS (administrator-configured)
    ├── Persona and behavioral rules
    ├── Escalation triggers
    └── Explicit exclusions ("never discuss X")

Layer 3: TOPIC SCOPE (developer-configured)
    ├── Only Topics and Actions explicitly built are available
    ├── Agent cannot improvise new capabilities
    └── Atlas returns OOS if no Topic matches

Layer 4: HUMAN ESCALATION (process-configured)
    ├── Omni-Channel queue routing
    ├── Human review of edge cases
    └── Override capability for complex situations
```

**Limitations:**
- Layer 1 (Trust Layer) cannot be disabled — it is always active; this is both a safety feature and a fixed constraint
- Layer 2 (Instructions) only governs behavior within what the LLM can understand — extremely adversarial inputs may bypass general exclusions
- Layer 3 (Topic scope) relies on Atlas routing being correct — if a malicious user gets routed to a Topic through adversarial phrasing, they have access to that Topic's Actions
- Layer 4 (Escalation) is only as good as the human agents it routes to — escalation to an unstaffed queue is no escalation at all

### Monitoring Dashboard Components
```
Agentforce Monitoring Dashboard
────────────────────────────────
KPI Cards (current week):
    Resolution Rate:    72% ▲ (+3% from last week)
    Escalation Rate:    28% ▼ (-3% from last week)
    CSAT Average:       4.2/5.0 → (steady)
    Avg Session:        2m 47s ▲ (+12s from last week)
    Total Conversations: 1,247

Trend Charts:
    [Resolution Rate — 12-week trend line]
    [Escalation by Topic — bar chart]
    [CSAT distribution — histogram]

Problem Indicators:
    Topics with > 50% escalation rate: Order Returns (61%)
    Longest avg session Topic: Billing (4m 12s)
    OOS requests this week: 89 → [view sample phrases]
```

## Key Facts to Memorize
- Five Trust Layer controls: Data Masking, Zero Data Retention, Toxicity Detection, Audit Log, Grounding
- ZDR = **LLM provider** discards data; Salesforce DOES store conversation transcripts
- Data masking is **bidirectional** (masks prompts going out, de-tokenizes in responses)
- Toxicity detection is **bidirectional** (user inputs and LLM outputs)
- Five key metrics: Resolution Rate, Escalation Rate, Session Duration, Deflection Rate, CSAT
- Conversation history stored in Setup → Agentforce → Conversation History
- Audit log: records timestamp, masked prompt, response, controls applied
- Four-layer governance: Trust Layer → Instructions → Topic scope → Human escalation

## Customer Advisory Tips
- **Enable audit logging before launch:** You cannot retroactively log events. Enable and test audit logging in the sandbox, confirm it works, then ensure it's enabled in production before go-live.
- **Set retention policy that matches your regulatory requirements:** The default retention may not be sufficient for heavily regulated industries. Work with the customer's compliance team to set the correct retention period.
- **Resolution Rate is the north star metric:** If it's improving, the agent is getting better. If it's declining, something changed (new Topics were added and aren't working, Knowledge articles are out of date, etc.). Review weekly.
- **OOS request analysis is a goldmine:** The "out of scope" request log shows you exactly what users are asking that the agent can't handle. This is your product roadmap for the next sprint — which Topics and Actions to add.

## Exam Traps
- Confusing ZDR with "Salesforce doesn't store anything" — ZDR = LLM provider discards; Salesforce stores transcripts
- Thinking toxicity detection only applies to LLM responses — it applies to both user inputs and LLM outputs (bidirectional)
- Thinking data masking only applies outbound — masking is bidirectional
- Thinking audit logging is automatic and can't be turned off — it must be enabled; it's not retroactive
- Confusing monitoring metrics: Resolution Rate (agent resolved it) vs. Deflection Rate (avoided human contact)

## Practice Questions
**Q:** A CTO asks: "If Agentforce uses OpenAI, is our customer data being used to train their models?" What is the correct answer?
**A:** No. Zero Data Retention policy requires the LLM provider to discard the data immediately after generating a response. It is not retained and not used for training. (Note: Salesforce itself does retain conversation transcripts in your org.)

**Q:** An agent is sending customer data to an external LLM. Which Trust Layer control ensures SSNs and credit card numbers are replaced before the data leaves Salesforce?
**A:** Data Masking — automatically detects PII/PCI patterns in the assembled prompt and replaces them with tokens before the prompt is sent to the LLM.

**Q:** Where can a Salesforce admin view a transcript of a specific Agentforce conversation?
**A:** Setup → Agentforce → Conversation History. Individual conversation records include the full transcript.

**Q:** After go-live, the Resolution Rate for an Agentforce agent drops from 70% to 45% over two weeks. What should be investigated first?
**A:** Review the conversation logs for the declining period — look for new patterns in out-of-scope requests (new user questions the agent can't handle), changes to Knowledge articles (grounding quality), or recent configuration changes (new Topics or Instructions changes that affected routing).
