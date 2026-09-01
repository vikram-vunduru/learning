# Agentforce Specialist Cheat Sheet — CRT-271

**Exam:** 60 questions | 105 min | 65% pass (39/60) | $200

---

## Agent Anatomy — The Four Building Blocks

| Block | What It Is | Where Configured |
|-------|-----------|-----------------|
| Identity | Name, company, persona tone | Identity section of agent setup |
| Instructions | Global system prompt: persona, rules, escalation, exclusions | Instructions block (applies to ALL conversations) |
| Topics | Conversation domains the agent can engage with | Topics section |
| Actions | Callable operations within each Topic | Within each Topic |

**Memory hook:** I-I-T-A — Identity, Instructions, Topics, Actions

---

## Atlas Reasoning Engine Loop

```
User Message
     ↓
  OBSERVE (read: message + history + Instructions + Topic descriptions + Action descriptions + prior action results)
     ↓
  REASON (which Topic matches? which Action within Topic? are inputs available?)
     ↓
  ACT (invoke selected Action, pass extracted parameters)
     ↓
  OBSERVE (read action output, update context)
     ↓
  [loop repeats until: response ready | escalation needed | max iterations reached]
     ↓
  Respond to user
```

**Key insight:** Atlas reads Topic and Action DESCRIPTIONS to make routing decisions. Descriptions = the routing engine.

---

## Pre-Built Agent Templates

| Template | Facing | Use Case | Channel |
|----------|--------|----------|---------|
| Service Agent | External (customers) | FAQ, order status, case deflection, escalation | Embedded Chat, Mobile, API |
| SDR Agent | External (prospects) | Inbound lead qualification, meeting booking | Email, Chat |
| Sales Coach | Internal (reps) | Call recording analysis, coaching feedback | Salesforce, internal |
| Custom Agent | Either | Any other use case | Any |

**Exam trap:** SDR is external-facing to prospects. Sales Coach is internal-facing to reps. Do NOT confuse them.

---

## Action Types — When to Use Each

| Action Type | Use When | Requires |
|-------------|----------|---------|
| Flow Action | Most business logic, data retrieval, record operations | Autolaunched Flow (Active), Available for Input/Output variables |
| Apex Action | HTTP callouts, complex logic, advanced error handling | `@InvocableMethod(description='...')`, `@InvocableVariable` |
| Prompt Template Action | AI-generated text: summaries, emails, recommendations | Active Flex template |
| Knowledge Search Action | FAQ, policy questions, article-based answers | Einstein Knowledge enabled, published articles |

**Flow Action requirements checklist:**
- [ ] Autolaunched Flow (NOT Screen Flow)
- [ ] Flow is Active
- [ ] Input variables: "Available for Input" checked
- [ ] Output variables: "Available for Output" checked
- [ ] Variable descriptions filled in

---

## Effective Descriptions — The Three-Part Formula

Every Topic description and Action description should answer:
1. **WHAT** — what does this Topic/Action cover or do?
2. **WHEN** — what customer intent triggers this? (use phrases: "use when customer asks about...")
3. **INPUTS** — what information does the Action need? (for Actions)

**Topic description:** also include explicit **EXCLUSIONS** ("does NOT handle X — that uses the Y Topic")

**Weak Action description:** `"Gets order data"`  
**Strong Action description:** `"Retrieves the current status, delivery date, and tracking number for a customer order. Invoke when a customer asks where their order is, whether it shipped, or when it will arrive. Requires: orderNumber. Returns: status, estimatedDelivery, trackingNumber."`

---

## Grounding Sources — Quick Reference

| Source | Best For | Notes |
|--------|---------|-------|
| Einstein Knowledge | General policies, FAQ, how-to articles | Most common; lowest setup complexity |
| Data Cloud | Personalized, real-time customer data | High setup complexity; requires Data Cloud license |
| File Search | Document-heavy content (PDFs, Word) | Medium complexity; less structured than Knowledge |
| External Grounding | Non-Salesforce knowledge systems | Highest complexity; most flexible |

**RAG pattern:** Retrieve (semantic search) → Augment (add to prompt context) → Generate (LLM answers from content)

**Relevance Score tuning:**
- Too high (>0.8) → no articles returned → agent says "I don't know"
- Too low (<0.3) → wrong articles returned → agent hallucinates from bad content
- Start at 0.5–0.6, tune based on test results

---

## Prompt Builder Template Types

| Type | Output | Saved? | For Agentforce? |
|------|--------|--------|----------------|
| Field Generation | Record field value | Yes (saves to field) | No |
| Flex | Any (Flow, Apex, Agent, API) | Depends on usage | YES (only Flex can be Agentforce Action) |
| Record Summary | Record page UI panel | No (transient) | No |
| Sales Email | Email compose window draft | No (until sent) | No |

**Template anatomy:**
- **System Prompt** = AI role/context, applies globally (STATIC)
- **Template Body** = task instruction with merge fields (DYNAMIC per invocation)
- **Grounding** = optional knowledge retrieval before generation

**Merge field syntax:** `{!ObjectName.FieldName}` — the `!` is required

**After deployment:** Templates arrive INACTIVE in target org — must manually Activate

---

## Einstein Trust Layer — The Five Controls

| Control | What It Does | Exam Scenario |
|---------|-------------|---------------|
| Data Masking | Masks PII (SSN, credit card, etc.) before prompt leaves Salesforce | "Prevent SSN from going to external LLM" |
| Zero Data Retention | LLM provider discards data after processing (contractual) | "LLM provider won't use our data for training" |
| Toxicity Detection | Blocks harmful input/output content | "Filter abusive customer messages" |
| Audit Log | Records every LLM interaction for compliance review | "Audit trail for what AI said to customers" |
| Grounding | RAG anchors responses to verified sources | "Reduce hallucination" |

**Key distinction:** Zero Data Retention = LLM provider doesn't store. Salesforce DOES store conversation transcripts in your org.

---

## Testing — The Eight Test Case Categories

1. **Happy Path** — clear, typical requests for each Topic
2. **Alternate Phrasings** — same intent, different words (tests semantic matching)
3. **Missing Parameters** — should ask clarifying question, not fail
4. **Out-of-Scope** — should decline and redirect, not hallucinate
5. **Ambiguous Intent** — should ask clarifying question or pick best match
6. **Multi-Intent** — one message, multiple Topics (advanced routing)
7. **Emotional Inputs** — frustrated/upset customers (tone handling)
8. **Adversarial Inputs** — prompt injection attempts (should refuse)

---

## Four Agent Failure Modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| Hallucination | Agent confidently states wrong facts | Add Knowledge grounding; add grounding-focused Instructions |
| Wrong Action | Correct Topic but wrong Action invoked | Improve Action descriptions; add explicit differentiation |
| Stuck in Loop | Agent asks same question repeatedly | Add alternate lookup paths; Instructions: escalate after N attempts |
| Out-of-Scope | Agent answers questions it shouldn't | Add explicit out-of-scope Instructions |

**Routing failures → fix descriptions first, restructure second**

---

## Deployment Channels

| Channel | Use Case Type | Key Config |
|---------|--------------|------------|
| Embedded Service Chat | Customer-facing (web) | Embedded Service + Omni-Channel escalation queue + code snippet |
| Salesforce Mobile | Internal reps | Mobile app configuration |
| Slack | Internal employees | Salesforce for Slack app installed |
| API | Custom apps, third-party | OAuth 2.0, session management |
| Email | SDR Agent | Email channel in agent settings |

**One agent → multiple channels** (configure once, deploy to many)  
**Licensing:** Per conversation (not per seat) | Simulator testing doesn't count

---

## Agent Lifecycle

```
Draft → Active → Deactivated
         ↑              ↓
    (reactivate)   (edit/update)
```

- **Draft:** Configuration only; simulator testing available
- **Active:** Live conversations; changes take effect immediately (dangerous!)
- **Deactivated:** Offline; edit safely

**Safe update pattern:** Deactivate → Edit → Test in simulator → Reactivate  
**Major update pattern:** Clone agent → Build/test clone → Swap (deactivate original, activate clone)

---

## Use Case Decision Framework

**Ask three questions:**
1. Who is the user? (customer → Service or Custom; prospect → SDR; internal employee → Custom + Slack)
2. What kind of interaction? (FAQ → Knowledge; data lookup → Flow; content generation → Prompt Template; record write → Flow)
3. Is there a pre-built template? (customer service → Service Agent; lead qualification → SDR Agent; rep coaching → Sales Coach; everything else → Custom Agent)

**Good use case fit indicators:** High volume ✓ | Well-defined process ✓ | Data available ✓ | Clear scope ✓  
**Poor fit indicators:** Low volume ✗ | Regulatory accountability required ✗ | Undefined process ✗ | High-stakes decisions ✗

---

## Most Common Exam Traps

1. **SDR vs Service Agent:** SDR = external prospects + email. Service = customers + real-time chat. Never swap these.
2. **SDR vs Sales Coach:** SDR = external, autonomous lead qualification. Sales Coach = internal, rep coaching. Opposite directions.
3. **Record Summary vs Field Generation:** Record Summary = transient display, not saved. Field Generation = saved to field. Storage behavior is the differentiator.
4. **Active Flex only:** Only Active Flex templates can be Agentforce Actions. Other types and inactive templates do not appear.
5. **Deployed templates are Inactive:** After change set or SF DX deploy, templates must be manually Activated.
6. **Screen Flow won't work:** Agentforce requires Autolaunched Flow. Screen Flow always fails.
7. **Zero Data Retention ≠ no Salesforce storage:** ZDR is about LLM provider retention. Salesforce stores conversation transcripts.
8. **Custom Agent for non-standard:** HR, field service, IT helpdesk, internal tools → always Custom Agent, no pre-built template.
9. **Routing failures → descriptions, not code:** If Atlas routes to the wrong Topic or Action, fix the descriptions first.
10. **Instructions = global only:** Never put topic-specific rules in Instructions. Frequently-updated content goes in Knowledge, not Instructions.

---

## Key Numbers

| Item | Value |
|------|-------|
| Exam questions | 60 |
| Pass score | 65% = 39/60 |
| Time limit | 105 minutes |
| Cost | $200 |
| Recommended Topics per agent | 3–7 |
| Recommended starting relevance score | 0.5–0.6 |
| Recommended max articles per Knowledge Search | 3 |
| Max related object traversal in merge fields | 5 levels |
