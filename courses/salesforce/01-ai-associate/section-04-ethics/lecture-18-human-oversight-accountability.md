# Human Oversight and Accountability

**Exam Domain:** Ethical Considerations of AI (20%)
**Study Priority:** HIGH — scenarios about when human oversight is required are heavily tested

---

## Core Concepts

### The Human-in-the-Loop Spectrum

AI deployments exist on a spectrum from fully automated to fully human-controlled:

```
FULLY AUTOMATED ◄──────────────────────────────────► FULLY HUMAN
        │                                                   │
   AI decides,               AI recommends,            Human decides,
   acts, reports            human approves             AI just informs
        │                         │                         │
  [Risk: AI wrong         [Best for most         [Low AI value add
   with no check]          Salesforce            for routine tasks]
                           use cases]
```

**Salesforce's position:** For consequential decisions, humans must remain in the loop. AI augments — it does not replace — human judgment for high-stakes outcomes.

---

### When Human Oversight is MANDATORY

The following domains require human oversight for consequential AI-influenced decisions:

| Domain | Why Mandatory | Example |
|--------|--------------|---------|
| **Medical/Clinical** | Patient safety; life/death decisions | AI diagnosis assistance — human physician must confirm |
| **Legal decisions** | Due process rights; judicial accountability | AI sentencing recommendations — judge must decide |
| **Financial decisions** | Fair lending law; fiduciary duty | AI loan scoring — human underwriter must approve/deny |
| **Employment decisions** | Anti-discrimination law; EEOC requirements | AI resume screening — HR human must make hiring decision |
| **Safety-critical systems** | Physical safety; reliability requirements | AI in aviation, medical devices, autonomous vehicles |

**Key principle:** The higher the stakes + the more the decision affects an individual's rights or life outcomes → the stronger the requirement for human oversight.

---

### Agentforce Escalation Design

**Mandatory escalation rule:** Every Agentforce deployment for customer-facing interactions MUST have a configured escalation path to a human agent.

**What good escalation includes:**
- Trigger conditions: specific scenarios that always escalate (user requests a human, agent expresses uncertainty, issue is outside configured Topics)
- Context transfer: full conversation history + all data retrieved + actions attempted passed to the human agent
- Graceful handoff: the transition from AI to human should be seamless from the customer's perspective

**Bad escalation design:**
- No escalation path ("the agent handles everything")
- Escalation without context (human agent starts fresh)
- Escalation only when the AI fails completely (better: proactive escalation when confidence is low)

---

### AI Acceptable Use Policy — Prohibited Uses

Salesforce's AI Acceptable Use Policy prohibits using Einstein/Agentforce for:

1. **Harm and violence**: Any application that could facilitate physical harm, violence, or endangerment
2. **Discrimination**: Applications that discriminate based on protected characteristics (race, gender, religion, national origin, etc.)
3. **Unauthorized surveillance**: Privacy invasion, unauthorized monitoring of individuals
4. **Deception**: Generating disinformation, impersonating people, creating deepfakes
5. **Psychological manipulation**: Exploiting psychological vulnerabilities to manipulate behavior against users' own interests
6. **Weapons development**: Supporting development of illegal weapons or weapons of mass destruction
7. **Illegal activities**: Any use that violates applicable law

**Exam focus:** If a scenario describes a use that fits any of these categories, the answer is that it VIOLATES the Acceptable Use Policy.

---

### Accountability Chain

When AI-assisted decisions cause harm, who is accountable?

```
ACCOUNTABILITY CHAIN:

Salesforce (LLM Provider Contracts, Trust Layer, Acceptable Use Policy)
    │
    └──▶ Organization deploying Einstein (AI governance, use case design)
              │
              └──▶ Salesforce Admin (configuration, template design, testing)
                        │
                        └──▶ End User (final action/decision)
```

**Key principle:** Salesforce provides the platform and safeguards. The customer organization is accountable for how they deploy AI. Admins are accountable for configurations. Users are accountable for actions they take based on AI recommendations.

**AI is never accountable.** It is a tool. The humans and organizations using it bear responsibility.

---

## PTA / SA Relevance

**The human oversight conversation in enterprise AI:**
- "If Agentforce makes a mistake, who's liable?" → The organization that deployed and configured it. Salesforce provides the platform; the customer owns the deployment.
- This is why governance documentation, testing, and human oversight mechanisms are not optional extras — they're risk management for the deploying organization.

**Design principles for high-stakes Agentforce deployments:**
1. Identify every action in the agent's Actions library that could affect a customer's rights or create financial/legal liability
2. For those actions: require human approval before execution (approval step in the Action Flow)
3. Test escalation paths for every possible failure mode
4. Document which actions were AI-automated vs. human-approved in the Audit Trail

**The "fully autonomous" customer request:**
- You will encounter customers who want to automate 100% of certain processes with Agentforce (no human review at all)
- For low-stakes routine processes (reset a password, look up an order status): fully autonomous is acceptable
- For anything affecting customer rights, finances, compliance, or safety: push back; human-in-the-loop is non-negotiable
- Use the GDPR Article 22 and EU AI Act requirements as leverage if the customer is in a regulated industry

**Enterprise risk classification:**
```
LOW RISK (autonomous OK):
  Password resets, order status lookups, FAQ answers,
  appointment scheduling, basic troubleshooting

MEDIUM RISK (human review recommended):
  Refund processing, service escalation, personalized offers,
  account modifications

HIGH RISK (human approval mandatory):
  Loan/credit decisions, hiring screening, medical recommendations,
  legal advice, large financial transactions, benefit eligibility
```

---

## Human Oversight Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║             HUMAN OVERSIGHT DESIGN PATTERNS                            ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  PATTERN 1: AI DRAFT → HUMAN REVIEW → SEND (for content generation)  ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Prompt Builder generates email draft                         │    ║
║  │         → Rep reviews and edits if needed                    │    ║
║  │         → Rep clicks Send (human action required)            │    ║
║  │ No email ever goes to customer without human touchpoint      │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                                                                       ║
║  PATTERN 2: AI SCORES → HUMAN DECIDES (for predictive AI)            ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Einstein Prediction Builder scores account churn risk: 84    │    ║
║  │ NBA surfaces "At Risk — Schedule Executive Review" rec       │    ║
║  │         → CSM reviews score + driving factors                │    ║
║  │         → CSM decides to accept or dismiss recommendation    │    ║
║  │ AI informs; human decides                                    │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                                                                       ║
║  PATTERN 3: AGENTFORCE → ESCALATION (for autonomous agents)          ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Agentforce handles: order status, standard returns           │    ║
║  │ Escalation triggers: customer requests human, billing         │    ║
║  │ dispute > $1000, complaint about AI itself, sensitive topic  │    ║
║  │ Escalation: Omni-Channel routing to human agent              │    ║
║  │ Context transfer: full conversation + data retrieved         │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
╚═══════════════════════════════════════════════════════════════════════╝
```

**Limitations:**
- Human review adds latency — for real-time customer interactions, the review step may not be practical for all responses
- As AI confidence increases and error rates decrease, the appropriate level of oversight may change over time — governance policies should be reviewed periodically
- Human reviewers can introduce their own biases when reviewing AI outputs — the oversight mechanism itself must be governed
- Escalation paths require human agents to be available — if human agent capacity is insufficient, escalation becomes a bottleneck

---

## Key Facts to Memorize

- **Human-in-the-loop is mandatory** for: medical, legal, financial, employment, and safety-critical decisions
- **Agentforce escalation** is mandatory and must include context transfer
- **AI Acceptable Use Policy** prohibits: harm, discrimination, unauthorized surveillance, deception, psychological manipulation, weapons development, illegal activities
- **Accountability chain**: Salesforce → Customer Org → Admin → User; AI is NEVER accountable
- The Empowering principle = AI augments humans, never eliminates human agency for consequential decisions
- The higher the stakes → the stronger the human oversight requirement

---

## Exam Traps

**Trap 1:** "Agentforce can handle all customer interactions autonomously if it's working correctly." WRONG. Even a perfectly functioning Agentforce deployment must have an escalation path to human agents. No customer-facing AI deployment should be designed without escalation.

**Trap 2:** "If a customer consents to AI decision-making, human oversight is no longer required." WRONG. In regulated domains (credit, employment, healthcare), legal requirements for human oversight may apply regardless of customer consent.

**Trap 3:** "Using Einstein to screen job applications based on predicted hire quality is acceptable as long as it's disclosed." WRONG if the AI discriminates based on protected characteristics — disclosure does not make discriminatory AI acceptable. It violates both the Acceptable Use Policy (discrimination prohibition) and employment discrimination law.

**Trap 4:** "Escalation means the AI failed." WRONG. Well-designed escalation is a feature, not a failure mode. Proactive escalation when confidence is low is BETTER design than attempting to resolve everything autonomously.

---

## Practice Questions

**Q1: A company wants to deploy an Agentforce agent for customer service. The project manager suggests that to maximize efficiency, no escalation path should be built — the agent should handle all conversations autonomously. Why is this approach problematic?**

A) Autonomous agents are not supported by Salesforce
B) Every customer-facing Agentforce deployment must have a tested escalation path to human agents; removing this violates both Salesforce best practices and potentially the Empowering principle
C) Agentforce agents cannot function without a human in the loop for every interaction
D) The agent will refuse to work without an escalation path configured

**Answer: B** — Mandatory escalation is a core Agentforce design requirement. Complex issues, sensitive situations, and customer requests for a human must have a resolution path. Removing escalation violates the Empowering principle (AI should augment, not eliminate human access) and creates customer experience and liability risks.

---

**Q2: A company wants to use an Einstein Prediction Builder model to automatically deny credit applications that score below 30, with no human review. Which of the following is the primary concern with this approach?**

A) Prediction Builder does not support credit application use cases
B) Automated credit denials without human review may violate fair lending regulations and the Accountable principle, which requires human oversight for consequential financial decisions
C) The ZDR setting must be enabled before using Prediction Builder for financial decisions
D) Credit scores generated by Prediction Builder are not accurate enough for financial decisions

**Answer: B** — Fully automated credit denial without human review violates the Accountable principle (humans must remain accountable for consequential decisions) and may violate fair lending laws (Equal Credit Opportunity Act, Fair Housing Act) that require human judgment in credit decisioning.

---

**Q3: A manager reviews an AI Acceptable Use Policy question: "Can Salesforce Einstein be used to monitor employee keystrokes and email content to predict who is likely to leave the company, without disclosing this to employees?" Which category of the Acceptable Use Policy does this violate?**

A) Harm and violence
B) Weapons development
C) Unauthorized surveillance and privacy invasion
D) Discrimination

**Answer: C** — Monitoring employee behavior without disclosure or consent is unauthorized surveillance — explicitly prohibited by the AI Acceptable Use Policy. It may also violate applicable privacy laws (GDPR, CCPA, state labor laws) that require disclosure of employee monitoring.
