# Agent Instructions

## Exam Domain
Building Agentforce Agents — ~25% of exam weight

## Core Concepts

### What Instructions Are
Instructions are the **global system prompt** for the agent. They are loaded into the context window on every single turn, before any Topic or Action logic runs. Think of Instructions as the "standing orders" the agent always follows, regardless of what the user says.

Instructions shape behavior that should be consistent across ALL Topics and ALL conversations. Anything that is conversation-wide goes in Instructions.

### Four Components of Instructions

**1. Persona**
Who the agent is and how it should communicate.
> "You are Aria, a friendly and professional customer service representative for Acme Corp. You communicate clearly and concisely. You are empathetic when customers have problems."

**2. Behavioral Rules**
Constraints on how the agent operates.
> "Always greet the customer by name if available. Never promise specific timeframes you cannot verify. If you provide an estimate, qualify it as an estimate. Keep responses under 150 words unless the customer requests more detail."

**3. Escalation Guidance**
When and how to hand off to a human.
> "Escalate to a human agent when: (1) the customer is visibly frustrated after two attempts to resolve their issue, (2) the issue involves a security or fraud concern, (3) the customer explicitly requests a human, or (4) you are unable to resolve the issue with available Actions."

**4. Exclusions**
What the agent should never do or discuss.
> "Do not discuss competitor pricing or products. Do not make commitments about custom pricing or SLA exceptions. Do not provide legal or financial advice. If asked, explain that these questions need to be directed to a specialist."

### What NOT to Put in Instructions
This is exam-tested. Some things look like they belong in Instructions but shouldn't be there:

| What | Why It Doesn't Belong in Instructions | Where It Belongs |
|------|---------------------------------------|-----------------|
| Topic-specific logic | Instructions run on every turn, wasting context | Topic description or Action description |
| Salesforce API names (field names, object names) | Brittle; not human-readable by Atlas | Handled in Flow/Apex logic, not prompt text |
| Complete policy documents | Context window overload; hurts performance | Knowledge Base (retrieved via Knowledge Search) |
| Frequently changing information | Updates require republishing the agent | Knowledge Base |
| Step-by-step how-to guides | Too detailed; context window cost | Knowledge Base or Action description |

### Instructions vs. Topic vs. Action Description
| Content Type | Where to Put It |
|-------------|----------------|
| Agent persona and tone | Instructions |
| Behavioral rules for all conversations | Instructions |
| Escalation triggers and procedures | Instructions |
| Hard exclusions (never do X) | Instructions |
| What a conversation domain covers | Topic description |
| When Atlas should activate this Topic | Topic description |
| What a specific operation does | Action description |
| When Atlas should call this operation | Action description |
| What inputs the operation needs | Action description |
| Product/policy factual content | Knowledge Base |
| Frequently-updated reference data | Knowledge Base |

### Instructions Length Guidance
Instructions should be **concise**. There is no hard character limit, but Instructions are loaded on every turn — every token in Instructions is a token not available for conversation history, Action results, or descriptions.

Practical guideline:
- 200–500 words for Instructions is typical
- Over 1000 words: likely has content that belongs in Knowledge Base or Topic descriptions
- The most common mistake: pasting an entire policy document into Instructions

## PTA / SA Relevance

### Instructions Review in the Discovery Phase
One of the first deliverables in an Agentforce implementation is an Instructions draft. It requires input from:
- **Legal/Compliance:** What can the agent never say? (financial advice, legal commitments, medical guidance)
- **Brand/Marketing:** What tone? What persona name? What language conventions?
- **Operations:** What are the escalation thresholds? Who does the agent escalate to?
- **Product/Service SMEs:** What topics are genuinely out of scope for this agent?

Getting this wrong is expensive: deploying an agent that gives incorrect legal or financial advice can create regulatory liability. Get sign-off before go-live.

### Common Instructions Anti-Patterns from Real Implementations

**Anti-pattern 1 — The Policy Paste:**
Customer copies their 5-page refund policy into Instructions. Result: agent is slow, context pressure pushes out conversation history, and the policy still isn't reliable because Atlas reads and summarizes it rather than retrieving specific answers.
Fix: Put policy in Knowledge, add Knowledge Search Action, remove from Instructions.

**Anti-pattern 2 — No Escalation Path:**
Instructions say "help the customer with their questions" with no escalation guidance. An angry customer asks for a manager 10 times and the agent keeps trying to solve the problem.
Fix: Always define explicit escalation triggers (number of failed attempts, explicit human request, specific keywords like "fraud", "attorney", "complaint").

**Anti-pattern 3 — Contradictory Instructions:**
Instructions say "be brief" in one sentence and "explain all options thoroughly" in another. Atlas has to reconcile these on every turn, producing inconsistent behavior.
Fix: Prioritize and be specific. "Respond in 100–150 words unless the customer requests more detail" > vague length guidance.

**Anti-pattern 4 — Persona in Instructions Only:**
Name is defined in Instructions but not in Identity. Inconsistencies occur.
Fix: Name and company go in Identity. Behavioral expression of persona (how it speaks, tone) goes in Instructions.

### Compliance Patterns for Regulated Industries
For financial services, insurance, healthcare:
- Add explicit Instructions exclusion: "Do not provide investment advice, insurance recommendations, or medical diagnoses. Inform the user that these require a licensed specialist."
- Add Instructions text about regulatory references: "If the customer references a regulatory body (FINRA, HIPAA, etc.), escalate to a compliance-trained human agent immediately."
- Instructions in regulated deployments typically require legal sign-off as a formal step before activation

## Architecture

### Instructions in the Agent Context
```
Every Atlas reasoning turn:

┌────────────────────────────────────────────────────┐
│  CONTEXT WINDOW (loaded for every turn)            │
│                                                    │
│  ┌─────────────────────────────────┐               │
│  │ Agent Instructions (global)     │               │
│  │ • Persona: "You are Aria..."    │ ← Always here │
│  │ • Rules: "Keep under 150 words" │               │
│  │ • Escalation: "Transfer when..."│               │
│  │ • Exclusions: "Never discuss..."│               │
│  └─────────────────────────────────┘               │
│  ┌─────────────────────────────────┐               │
│  │ Topic Descriptions              │               │
│  │ (all Topics listed)             │               │
│  └─────────────────────────────────┘               │
│  ┌─────────────────────────────────┐               │
│  │ Action Descriptions             │               │
│  │ (all Actions in matched Topic)  │               │
│  └─────────────────────────────────┘               │
│  ┌─────────────────────────────────┐               │
│  │ Conversation History            │               │
│  │ + Prior Action Results          │               │
│  └─────────────────────────────────┘               │
└────────────────────────────────────────────────────┘
                     │
                     ▼
              Atlas REASON step
```

**Limitations:**
- Instructions load on EVERY turn — short Instructions preserve context budget for conversation history and Action results
- Context window budget is shared: longer Instructions = less room for history = shorter effective conversation memory
- Contradictions in Instructions produce non-deterministic behavior — test edge cases
- Instructions cannot reference specific Salesforce field API names meaningfully — Atlas reads natural language

### Instructions Components Breakdown
```
Agent Instructions = 4 sections

1. PERSONA
   ┌─────────────────────────────────────────┐
   │ Who: name, company                      │
   │ Tone: professional/casual/empathetic    │
   │ Voice: concise/thorough/warm            │
   └─────────────────────────────────────────┘

2. BEHAVIORAL RULES
   ┌─────────────────────────────────────────┐
   │ Greeting conventions                    │
   │ Response length guidance                │
   │ Language/formatting requirements        │
   │ Things to always confirm before acting  │
   └─────────────────────────────────────────┘

3. ESCALATION GUIDANCE
   ┌─────────────────────────────────────────┐
   │ When to transfer to human               │
   │ Which queue to transfer to              │
   │ How to notify the user of transfer      │
   │ What context to pass to human agent     │
   └─────────────────────────────────────────┘

4. EXCLUSIONS
   ┌─────────────────────────────────────────┐
   │ Topics/questions agent won't handle     │
   │ Commitments agent won't make            │
   │ Advice agent won't give                 │
   └─────────────────────────────────────────┘
```

**Limitations:**
- Only natural language — no code, no variables, no conditionals
- Applied globally — cannot have Topic-specific Instructions (use Topic/Action descriptions for that)
- Cannot override Trust Layer controls — cannot instruct agent to skip data masking or toxicity detection

## Key Facts to Memorize
- Instructions = global system prompt, loaded on every single turn
- Four components: Persona, Behavioral Rules, Escalation Guidance, Exclusions
- Instructions apply to ALL Topics — they are not scoped to one conversation type
- What NOT to put in Instructions: topic-specific rules, Salesforce API names, complete policy docs, frequently-changing data
- Policy content → Knowledge Base (retrieved via Knowledge Search), not Instructions
- Frequently-changing info → Knowledge Base, not Instructions
- Instructions must be concise — every token counts against the context window budget
- Instructions cannot override Trust Layer controls

## Customer Advisory Tips
- **Get Instructions signed off by legal BEFORE go-live:** In my experience, the most expensive post-deployment fixes involve agents that made commitments or gave advice they shouldn't have. Three hours with legal reviewing the exclusions before launch saves weeks of incident management.
- **Persona should sound like your best agent, not a robot:** Ask the customer to record a 2-minute video of their best customer service rep handling a typical interaction. Use that as the persona reference.
- **Test the escalation path in UAT:** Many customers build escalation guidance in Instructions but never test it. Test: trigger each escalation condition in the simulator. Verify the agent actually escalates.
- **Version control Instructions text:** Keep Instructions text in a document with version history outside the org. When an Instructions change causes a behavior change, you need to be able to roll back quickly.

## Exam Traps
- Putting product/policy content in Instructions instead of Knowledge Base — this is specifically tested
- Putting topic-specific logic in Instructions instead of Topic or Action descriptions
- Thinking Instructions can override Trust Layer (data masking, toxicity detection) — they cannot
- Confusing Identity (name/company/tone metadata) with Instructions (behavioral rules text)
- Thinking Instructions only load for certain Topics — they load for EVERY turn regardless of Topic

## Practice Questions
**Q:** A developer puts the company's full 50-page return policy into the Agent Instructions. What problem will this likely cause?
**A:** Context window pressure — the Instructions consume a large portion of the available token budget, reducing room for conversation history and Action results. The policy should be in a Knowledge article, retrieved via Knowledge Search Action.

**Q:** What belongs in Agent Instructions vs. a Topic description?
**A:** Instructions: global persona, behavioral rules, escalation triggers, and exclusions that apply to ALL conversations. Topic description: what this specific conversation domain covers and when Atlas should activate it.

**Q:** An agent needs to always greet users by first name and always end conversations by asking for a satisfaction rating. Where should these rules be defined?
**A:** Agent Instructions — these are behavioral rules that apply to every conversation, regardless of Topic.

**Q:** A compliance-regulated company needs the agent to never give investment advice. Where should this restriction be placed?
**A:** Agent Instructions — specifically in the Exclusions section: "Do not provide investment advice or stock recommendations. Inform the user these require a licensed financial advisor."
