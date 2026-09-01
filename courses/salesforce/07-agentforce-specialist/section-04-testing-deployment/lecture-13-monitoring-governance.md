# Lecture 13: Monitoring, Governance, and Einstein Trust Layer

## Learning Objectives
- Access and interpret Agentforce conversation history and activity logs
- Identify key metrics to monitor for agent health: resolution rate, escalation rate, session duration
- Describe all five Einstein Trust Layer controls and their function in Agentforce deployments
- Explain data masking, zero data retention, and toxicity filtering in the context of agent conversations
- Configure compliance controls and understand what audit trail records are available

## Slides

### Slide 1: Why Monitoring Matters Post-Deployment
**Visual:**
```
  Agent Performance Over Time — Example Improvement Trajectory

  100% │
       │                                           ┌─── Resolution
   90% │                              ·············│····· Rate
       │               ┌─────────────┘
   80% │  ┌────────────┘
       │  │ 70% at launch
   70% │──┘
       │
   40% │──┐
       │  │ 35% at launch
   30% │  └──────────────────┐
       │                     │               ·······│····· Escalation
   20% │                     └──────────────────────│─── Rate
       │                                            │
   10% │                                            │
       │                                            │
    0% └──────────────────────────────────────────────────────────
            Week 1        Week 3               Week 6
                           ▲                    ▲
                    1st optimization     2nd optimization
                    cycle — improved     cycle — added
                    Action descriptions  missing Knowledge
                    from routing data    articles
```
**Content:**
- Monitoring is not optional — it is the continuous improvement mechanism that takes an agent from "deployed" to "performing well"
- **Key metrics to track:**
  - **Resolution Rate** — percentage of conversations where the customer's issue was resolved by the agent without escalation
  - **Escalation Rate** — percentage of conversations handed off to human agents
  - **Session Duration** — average length of agent conversations (unusually long = potential loop issue)
  - **Deflection Rate** — percentage of contacts handled by agent vs. human (business value metric)
  - **Customer Satisfaction (CSAT)** — if post-chat surveys are configured
- **Access:** Agentforce analytics dashboard in the Salesforce org (location varies by release)
**Speaker Notes:** The resolution rate improvement story on this slide is the narrative that business stakeholders care about. The first few weeks after deployment are the period of highest improvement opportunity — you are seeing real customer interactions for the first time and can identify patterns in failures. A 70% resolution rate in week 1 improving to 88% by week 6 represents real cost savings: fewer human agent escalations, faster customer issue resolution, and improved CSAT. This optimization loop — monitor, identify patterns, improve configurations — is the ongoing work of Agentforce operations.

### Slide 2: Conversation History and Audit Trail
**Visual:**
```
  Salesforce Record — Agent Conversation

  ┌──────────────────────────────────────────────────────────────────┐
  │  Agent Conversation                                              │
  │  ──────────────────────────────────────────────────────────────  │
  │  Session ID:    ABC-12345-XYZ                                    │
  │  Start Time:    2025-03-15  10:32:07 AM                          │
  │  End Time:      2025-03-15  10:38:44 AM                          │
  │  Duration:      6 min 37 sec                                     │
  │  Channel:       Embedded Chat                                    │
  │  Agent:         Acme Service Agent                               │
  │  Outcome:       Resolved  ✓                                      │
  │                                                                  │
  │  CONVERSATION TRANSCRIPT              ◀── Full transcript stored │
  │  ─────────────────────────                 for compliance review │
  │  Customer: "What is my order status?"                            │
  │  Agent:    "I can help with that. What is your order number?"    │
  │  Customer: "Order 55443"                                         │
  │  Agent:    "Order 55443 shipped on March 14 and is scheduled..." │
  │                                                                  │
  │  ACTIONS INVOKED                      ◀── Actions logged for     │
  │  ─────────────────────────                 audit                 │
  │  1. GetOrderStatus — orderId: 55443 → status: Shipped            │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
- Agentforce stores **conversation records** in Salesforce for each agent session
- Conversation records include:
  - Full **conversation transcript** — every message from customer and agent
  - **Session metadata** — start/end time, channel, duration, agent identity
  - **Actions invoked** — which Actions were called, with what parameters
  - **Outcome** — Resolved, Escalated to Human, Abandoned (customer left without resolution)
- Conversation records are accessible via standard Salesforce object queries (SOQL) and reports
- **Retention policy:** Conversation records are retained per your org's data retention settings; apply appropriate retention policies for compliance
- **Access controls:** Use standard Salesforce OWD, Profiles, and Permission Sets to control who can access conversation transcripts
**Speaker Notes:** Conversation transcript storage is one of the most important governance features for enterprise deployments. Legal, compliance, and quality assurance teams need access to what the agent said to customers. The ability to query conversation records via SOQL means you can build Salesforce reports to identify patterns: which Topics have the highest escalation rates? Which Topics have the highest average session duration? What percentage of conversations end in abandonment? These reports drive the optimization work.

### Slide 3: Einstein Trust Layer — The Five Controls
**Visual:**
```
  Einstein Trust Layer — Five Pillars

  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
  │    DATA    │ │   ZERO     │ │ TOXICITY   │ │   AUDIT    │ │ GROUNDING  │
  │  MASKING   │ │   DATA     │ │ DETECTION  │ │    LOG     │ │            │
  │            │ │ RETENTION  │ │            │ │            │ │            │
  │ PII masked │ │ LLM provider│ │ Harmful   │ │ Every LLM  │ │ Responses  │
  │ before     │ │ does not   │ │ input/     │ │ interaction│ │ anchored   │
  │ leaving    │ │ retain     │ │ output     │ │ logged for │ │ to verified│
  │ Salesforce │ │ data after │ │ blocked    │ │ compliance │ │ sources    │
  │            │ │ processing │ │            │ │ review     │ │ (RAG)      │
  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
  ═══════════════════════════════════════════════════════════════════════════
                         EINSTEIN TRUST LAYER
  ═══════════════════════════════════════════════════════════════════════════
```
**Content:**
- The **Einstein Trust Layer** is Salesforce's AI governance framework — it applies to ALL Salesforce AI features including Agentforce, Prompt Builder, and Einstein features
- The five controls:
  1. **Data Masking** — detects and masks Personally Identifiable Information (PII) and sensitive data (SSNs, credit card numbers, health data) before prompts are sent to the LLM
  2. **Zero Data Retention** — by default, the LLM provider (e.g., OpenAI) does not retain prompt or completion data after the request is processed; data is not used to train external models
  3. **Toxicity Detection** — scans both input (customer messages) and output (agent responses) for harmful content; blocks or flags detected toxicity
  4. **Audit Log** — records every LLM interaction (prompt, completion, model, timestamp) for compliance review
  5. **Grounding** — the RAG pattern anchors responses to verified source content rather than training data (reduces hallucination, supports auditability)
**Speaker Notes:** These five controls are the most exam-critical content in the entire governance section — they appear in multiple sections of the exam, not just testing/deployment. Memorize the five controls and what each one does. The most commonly tested are data masking, zero data retention, and audit logging. For a scenario question about "ensuring that customer SSNs are not sent to an external AI provider," the answer is Data Masking. For "ensuring that conversation data is not used to train the AI model," the answer is Zero Data Retention. For "providing a compliance audit trail of all AI interactions," the answer is Audit Log.

### Slide 4: Data Masking in Detail
**Visual:**
```
  Data Masking — Prompt Flow

  ORIGINAL PROMPT (inside Salesforce, before masking):
  ┌──────────────────────────────────────────────────────────────┐
  │ "The customer's SSN is 123-45-6789 and their credit card is  │
  │  4111-1111-1111-1111. What options do they have?"            │
  └────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼  EINSTEIN TRUST LAYER — Data Masking
                               │  (detects PII patterns, replaces values)
                               │
  MASKED PROMPT (sent to external LLM):
  ┌──────────────────────────────────────────────────────────────┐
  │ "The customer's SSN is [MASKED] and their credit card is     │
  │  [MASKED]. What options do they have?"                       │
  └────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼  LLM processes masked prompt
                               │
  LLM RESPONSE (returned to Salesforce):
  ┌──────────────────────────────────────────────────────────────┐
  │ "The customer can set up a payment plan, request a           │
  │  hardship waiver, or speak with a specialist..."             │
  └──────────────────────────────────────────────────────────────┘
                               │
                               ▼  (Trust Layer checks response for leakage)
                               │
  Final response delivered to agent — sensitive values never left Salesforce
```
**Content:**
- **Data Masking** automatically detects and replaces sensitive data in prompts before they are sent to external LLM providers
- Data masked by default:
  - Social Security Numbers (SSNs)
  - Credit card numbers (PAN)
  - Health/medical information
  - Other PII as configured
- Masking is **bidirectional** — also checks LLM responses for leaked sensitive data before they reach the agent
- Configuration: Setup → Einstein → Einstein Trust Layer → Data Masking
- Custom masking rules can be added for domain-specific sensitive data patterns
- **Limitation:** Masking works on text patterns — it cannot mask sensitive data embedded in unstructured free text in ways that do not match known patterns
**Speaker Notes:** Data masking is the answer to the most common enterprise security concern about LLM-based AI: "Will our customer's sensitive data be sent to OpenAI?" The answer is: no, because data masking intercepts it before it leaves Salesforce infrastructure. For the exam, know what types of data are masked by default (SSN, credit card) and that masking is configurable for additional patterns. Also know the limitation: masking is pattern-based — if a customer types "my social is five five five four four..." spelled out as words rather than digits, the pattern matcher may miss it. This is why Instructions should also include guidance about not repeating sensitive data verbatim in responses.

### Slide 5: Zero Data Retention
**Visual:**
```
  ┌────────────────────────────────┐  ┌────────────────────────────────┐
  │  WITHOUT Zero Data Retention ✗ │  │  WITH Zero Data Retention  ✓   │
  │                                │  │                                │
  │  Prompt sent to LLM provider   │  │  Prompt sent to LLM provider   │
  │         │                      │  │         │                      │
  │         ▼                      │  │         ▼                      │
  │  LLM processes prompt          │  │  LLM processes prompt          │
  │         │                      │  │         │                      │
  │         ▼                      │  │         │ ZDR flag: discard    │
  │  Data stored in LLM provider   │  │         ▼ after response       │
  │  systems for model training    │  │  LLM responds                  │
  │         │                      │  │         │                      │
  │         ▼                      │  │         ▼                      │
  │  RISK: data leakage, training  │  │  Data DISCARDED immediately    │
  │  on customer data, foreign     │  │  No retention, no training,    │
  │  jurisdiction exposure         │  │  no leakage risk               │
  └────────────────────────────────┘  └────────────────────────────────┘

  ZDR is enforced via contractual agreement between Salesforce
  and its LLM provider partners — not a toggle in Setup
```
**Content:**
- **Zero Data Retention (ZDR)** ensures that the LLM provider (e.g., OpenAI, Anthropic models, Salesforce AI) does not store prompt or completion data after processing
- With ZDR: Salesforce sends the prompt, the LLM processes and responds, no data is retained by the provider
- ZDR is enabled by **contractual agreement** between Salesforce and its LLM providers — it is not a technical setting you configure yourself; it is part of Salesforce's agreements
- **What ZDR protects against:** Using customer data to train external LLM models; data breaches at the LLM provider layer; discovery of customer data in foreign jurisdictions
- **What ZDR does NOT protect against:** Data processed within Salesforce's own infrastructure; conversation transcripts stored in your Salesforce org; SOQL-accessible conversation history
- ZDR applies to **all AI requests** made through the Einstein Trust Layer, not just Agentforce
**Speaker Notes:** Zero Data Retention is often misunderstood by non-technical stakeholders who think it means "AI does not use any of our data." What it specifically means is that the LLM provider (the model hosting company) does not retain the prompt and completion data after responding. Salesforce's own platform does store conversation history — that is in your org and subject to your org's data governance policies. For the exam, distinguish between what ZDR covers (LLM provider retention) and what it does not cover (Salesforce org storage).

### Slide 6: Toxicity Detection and Content Filtering
**Visual:**
```
  Toxicity Detection — Bidirectional Filter

  INPUT PATH:
  Customer message → ┌────────────────────────┐ → blocked/flagged
                     │  TOXICITY SCANNER      │
                     │  · Hate speech         │
                     │  · Violence/threats    │
                     │  · Sexual content      │ → passes through → Atlas
                     │  · Self-harm refs      │
                     │  · Prompt injection    │
                     └────────────────────────┘

  OUTPUT PATH:
  Agent response ←── ┌────────────────────────┐ ←── LLM output
  (safe)             │  TOXICITY SCANNER      │
                     │                        │
  fallback response ←│  If harmful content    │
  generated          │  detected in response: │
                     │  BLOCK, use fallback   │
                     └────────────────────────┘

  Severity levels:
  Informational → logged only
  Warning       → logged + flagged for human review
  Critical      → blocked immediately, fallback response sent
```
**Content:**
- **Toxicity Detection** scans both inbound (customer messages) and outbound (agent responses) for harmful content
- Types of detected content:
  - Hate speech, discriminatory language
  - Violence or threat content
  - Sexual content
  - Self-harm references
  - Prompt injection attempts (attempts to override agent Instructions)
- **Actions on detection:**
  - **Block** — content is not passed through; a safe fallback response is generated
  - **Flag** — content is logged for human review but may be passed through based on severity configuration
- Toxicity thresholds are configurable in Einstein Trust Layer settings
- **Limitation:** Toxicity detection is probabilistic — it may miss novel attack patterns or generate false positives for legitimate content
**Speaker Notes:** Toxicity detection is particularly important for customer-facing agents because you cannot control what customers say. A service agent deployed on a public website will inevitably encounter customers who use offensive language, attempt to manipulate the agent with unusual inputs, or (in worst cases) attempt prompt injection attacks. The toxicity filter is the first line of defense. For the exam, know that toxicity detection applies to both input and output — the filter protects against both harmful customer messages reaching the agent and harmful agent responses reaching customers.

### Slide 7: Audit Log and Compliance
**Visual:**
```
  Einstein Trust Layer — Audit Log Record

  ┌──────────────────────────────────────────────────────────────────┐
  │  LLM Interaction Audit Record                                    │
  │  ──────────────────────────────────────────────────────────────  │
  │  Timestamp:      2025-03-15 10:33:42 UTC                         │
  │  Duration:       1,240ms                                         │
  │  LLM Provider:   Salesforce AI                                   │
  │  Model:          sfdc-llm-v2                                     │
  │  Feature:        Agentforce — Acme Service Agent                 │
  │  Session ID:     ABC-12345-XYZ                                   │
  │                                                                  │
  │  Prompt:         [view full] "Customer: What is my order..."     │
  │  Completion:     [view full] "I can help with that. What is..."  │
  │                                                                  │
  │  Masking Applied:  YES (1 value masked)                          │
  │  Toxicity Score:   0.02 (below threshold — passed)              │
  │                                                                  │
  │  Access: restricted to Compliance team via Permission Set        │
  └──────────────────────────────────────────────────────────────────┘

  Use cases:
  · AI audit for regulatory compliance
  · Security forensics
  · eDiscovery / legal requests
  · Quality assurance review
```
**Content:**
- The **Einstein Trust Layer Audit Log** records every LLM interaction made from the Salesforce org
- Each audit record captures:
  - Timestamp and duration
  - LLM provider and model used
  - Prompt sent (full text, subject to masking) and completion received
  - Masking actions applied
  - Toxicity detection results
  - Feature that made the request (e.g., Agentforce agent name)
  - User context or session ID
- Audit records are stored in Salesforce as queryable records (specific object name varies by release)
- **Compliance use cases:** AI audit for regulatory requirements, security forensics, discovery requests
- **Retention:** Audit records are subject to your org's data retention policies; establish a retention schedule appropriate for your industry
- Access should be restricted to compliance/security team — use Permission Sets to control audit log access
**Speaker Notes:** The audit log is the compliance team's best friend for Agentforce deployments. Regulated industries (financial services, healthcare, insurance) often require the ability to prove what the AI said to a customer on a specific date and time. The audit log provides exactly that. For the exam, know that the audit log captures prompts and completions (with masking applied), is stored in Salesforce (not only in the LLM provider's systems), and is queryable via SOQL for reporting purposes. Also know that access should be restricted — not every user should be able to read full conversation transcripts and raw prompts.

### Slide 8: Governance Best Practices Summary
**Visual:**
```
  Four-Layer Governance Framework

  ┌──────────────────────────────────────────────────────────────────┐
  │  LAYER 4 — ORGANIZATIONAL (People & Process)                     │
  │  · AI Acceptable Use Policy                                      │
  │  · Human review process for flagged conversations                │
  │  · Quarterly compliance attestation                              │
  │  · Stakeholder reporting                                         │
  ├──────────────────────────────────────────────────────────────────┤
  │  LAYER 3 — OPERATIONAL (Monitoring & Response)                   │
  │  · Conversation analytics monitoring                             │
  │  · Escalation pattern review                                     │
  │  · Anomaly detection                                             │
  │  · Optimization cycles                                           │
  ├──────────────────────────────────────────────────────────────────┤
  │  LAYER 2 — AGENT CONFIGURATION (Behavioral Governance)           │
  │  · Instructions exclusions (what agent will not do)              │
  │  · Topic scope definitions                                       │
  │  · Confirmation requirements for high-risk actions               │
  ├──────────────────────────────────────────────────────────────────┤
  │  LAYER 1 — PLATFORM (Einstein Trust Layer — Automated)           │
  │  · Data masking   · Zero data retention                          │
  │  · Toxicity detection   · Audit log   · Grounding               │
  └──────────────────────────────────────────────────────────────────┘
  Platform controls are necessary but NOT sufficient for enterprise governance
```
**Content:**
- **Governance is four-layer, not just technical**
- Platform layer (automated, Salesforce-managed): data masking, ZDR, toxicity, audit logging
- Agent configuration layer (intentional design choices): Instructions exclusions, scope boundaries, confirmation requirements for high-risk actions
- Operational layer (ongoing monitoring): review escalation patterns, monitor resolution rates, flag anomalous conversations for human review
- Organizational layer (people and process): define an AI usage policy, establish a human review process for flagged conversations, conduct quarterly compliance attestation
- **Key governance document:** Create and maintain an AI Acceptable Use Policy that describes what the agent is authorized to do, what data it can access, and what human oversight exists
- For regulated industries: involve legal and compliance early in the agent design process, not just at deployment sign-off
**Speaker Notes:** The four-layer governance model is the professional framing for enterprise Agentforce deployments. Platform controls (Trust Layer) are necessary but not sufficient — they handle technical safety but do not address organizational accountability. For the exam, governance questions often present scenarios about where a specific control lives: data privacy → Trust Layer; behavioral rules → Agent Instructions; ongoing monitoring → operational practices. The layered model helps you map scenarios to the right layer. In real deployments, starting legal and compliance conversations early (during agent design) prevents last-minute blockers at deployment approval time.

## Recording Script
Deploying an agent is the beginning, not the end. Monitoring and governance are what keep the agent trustworthy and continuously improving over time.

Start with your key metrics. Resolution rate tells you what percentage of conversations the agent resolved without escalating — this is your primary effectiveness metric. Escalation rate is the inverse. Session duration can indicate loop issues — if average sessions are much longer than expected, some conversations may be stuck. Review these weekly in the first month, then monthly as the agent matures.

Conversation history is stored in Salesforce. Every session has a transcript, a record of which actions were invoked, and an outcome label. Use this data to identify patterns: which Topics have the highest escalation rates? Which customer questions consistently lead to abandonment? These patterns tell you exactly where to optimize.

The Einstein Trust Layer is the governance backbone. Its five controls are: data masking (sensitive data like SSNs masked before leaving Salesforce), zero data retention (LLM provider does not store prompts or completions after responding), toxicity detection (harmful input/output blocked), audit log (every LLM interaction recorded), and grounding (responses anchored to verified sources). Memorize all five for the exam.

Data masking is the answer to "will customer PII go to OpenAI?" — no, because it is masked before the prompt leaves Salesforce infrastructure. Zero data retention is the answer to "will the AI company use our data to train their model?" — no, by contractual agreement. Audit logging is the answer to "how do we prove what the AI said to a customer in a legal dispute?" — the audit log has the full record.

Governance does not stop at the platform layer. Write explicit Instructions exclusions, monitor agent behavior operationally, and create an AI acceptable use policy document. Regulated industries should involve legal and compliance in the design process, not just at deployment sign-off.

## Exam Tips
- The five Einstein Trust Layer controls: Data Masking (PII masked before leaving Salesforce), Zero Data Retention (LLM provider does not store data), Toxicity Detection (harmful content blocked), Audit Log (LLM interactions recorded), Grounding (RAG anchors responses to verified sources)
- Zero Data Retention means the LLM provider does not retain data — NOT that Salesforce does not store conversation transcripts (those are stored in your org)
- Data Masking applies before the prompt leaves Salesforce infrastructure — it is the answer to "how do you prevent SSNs from going to the external LLM"
- Key monitoring metrics: Resolution Rate (resolved without escalation), Escalation Rate (transferred to human), Session Duration (long sessions may indicate loop issues)
- Audit Log provides the compliance evidence trail for what the AI said to customers — stored in Salesforce, queryable via SOQL, subject to org retention policies

## Lecture Summary
Agentforce monitoring tracks three primary metrics: Resolution Rate (conversations resolved by agent without escalation), Escalation Rate (conversations handed to human agents), and Session Duration (indicator of loop issues). Conversation transcripts and action audit trails are stored in Salesforce as queryable records. The Einstein Trust Layer provides five governance controls: Data Masking (PII masked before prompts leave Salesforce), Zero Data Retention (LLM provider discards data after processing, by contract), Toxicity Detection (harmful input/output blocked), Audit Log (every LLM interaction recorded and queryable), and Grounding (RAG pattern reduces hallucination). Data masking applies before prompts exit Salesforce infrastructure; Zero Data Retention applies at the LLM provider layer — these are distinct controls addressing different risks. Governance requires four layers: platform (Trust Layer), agent configuration (Instructions exclusions, scope), operational monitoring (ongoing analytics review), and organizational process (AI usage policy, compliance attestation).

## Mini Quiz

**Q1:** A compliance officer at a financial institution asks: "How can we ensure that customer account numbers and SSNs sent to the Agentforce agent are never transmitted to the external LLM provider?" Which Einstein Trust Layer control addresses this requirement?
A) Zero Data Retention
B) Audit Log
C) Data Masking
D) Toxicity Detection
**Answer:** C — Data Masking detects and replaces sensitive data (SSNs, credit card numbers, account numbers) in the prompt before it is sent to the external LLM provider. The prompt goes to the LLM with placeholders in place of the actual sensitive values. Zero Data Retention addresses whether data is stored after processing, not whether it is transmitted. The Audit Log records the interaction but does not prevent transmission.

**Q2:** An Agentforce administrator wants to prove to auditors that the external LLM provider (e.g., OpenAI) does not store or use customer conversation data to train its AI models. Which Einstein Trust Layer capability supports this claim?
A) Data Masking — all customer data is masked so even stored data is unintelligible
B) Audit Log — the log shows that no data was stored by the provider
C) Zero Data Retention — a contractual agreement between Salesforce and its LLM providers requiring providers to discard prompt and completion data after processing
D) Toxicity Detection — toxic content is blocked so sensitive information is never generated
**Answer:** C — Zero Data Retention is the specific Trust Layer control that addresses whether LLM providers retain or use customer data. It is enforced via contractual agreement: Salesforce's agreements with its LLM providers include a provision that prompt and completion data is not retained or used for training. Data Masking reduces what is transmitted but does not prevent storage of what is transmitted. The Audit Log records from Salesforce's side, not from the provider's side.

**Q3:** An Agentforce agent's analytics show that the "Returns and Refunds" Topic has a 78% escalation rate (significantly higher than other Topics at 15-20%). What is the most useful first investigation step?
A) Disable the Returns and Refunds Topic and handle all refunds via human agents
B) Review the conversation transcripts for escalated Returns and Refunds conversations to identify common patterns — are customers being escalated for the same issue type? Is an Action failing? Are parameters not being collected?
C) Increase the minimum relevance score for the Knowledge Search Action in the Returns Topic
D) Add more agents to the Omni-Channel routing queue to handle the increased escalations
**Answer:** B — When a Topic has an abnormally high escalation rate, the first step is pattern analysis: read a sample of the escalated conversations and look for common failure points. Are customers asking for something the agent cannot do (a missing Action)? Is an Action failing for a specific data condition? Is the agent unable to collect a required parameter? The root cause determines the fix — you cannot apply the right solution without diagnosing the specific failure pattern first. Disabling the Topic removes capability. Adjusting the relevance score affects Knowledge search, not the escalation behavior. Adding human agents manages the symptom, not the cause.
