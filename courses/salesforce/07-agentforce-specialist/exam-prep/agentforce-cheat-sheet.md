# Agentforce Specialist Cheat Sheet — CRT-271

**Exam:** 60 questions | 105 min | 65% pass (39/60) | $200

---

## Exam Weight Snapshot
| Domain | Weight | Key Files |
|--------|--------|---------|
| Concepts & Architecture | 20% | L01–L03 |
| Building Agents | 25% | L04–L07 |
| Prompt Builder | 20% | L08–L10 |
| Testing & Deployment | 15% | L11–L13 |
| Use Cases | 20% | L14 |

---

## Agent Anatomy (I-I-T-A)
```
Agent
├── Identity: name, company, persona tone
├── Instructions: persona + behavioral rules + escalation + exclusions
├── Topics: conversation domains (3–7 recommended)
│   └── Actions: operations within Topics
│       ├── Flow Action (Autolaunched Flow only, Active, vars checked)
│       ├── Apex Action (@InvocableMethod + @InvocableVariable)
│       ├── Prompt Template Action (Active Flex only)
│       └── Knowledge Search Action
└── Channels: Embedded Chat / Slack / API / Mobile / Email
```

**Limitations:**
- 3–7 Topics recommended; more causes routing ambiguity
- Every Topic + Action description loads in context window each turn
- Instructions apply globally to ALL Topics

---

## Atlas ReAct Loop
```
OBSERVE (context: Instructions + Topics + Actions + history + prior results)
  → REASON (Topic match? Action match? Inputs available?)
      → No Topic: OOS response
      → No inputs: clarifying question
      → Matched: ACT (Flow / Apex / Prompt Template / Knowledge Search)
          → OBSERVE result
              → Done? → Respond
              → More? → Loop (REASON again)
```

**Atlas routing = semantic matching of natural language descriptions. NOT keywords.**

**Limitations:**
- Max iterations per turn (prevents infinite loops; caps deep workflows)
- Sequential only — cannot invoke Actions in parallel
- Context window finite — long Instructions + many Actions = pressure

---

## Pre-Built Agent Templates
| Template | Facing | Channel | Use Case |
|----------|--------|---------|---------|
| Service Agent | External customers | Embedded Chat | Case deflection, FAQ, order lookup |
| SDR Agent | External prospects | **Email** | BANT qualification, meeting booking |
| Sales Coach | **Internal reps** | SF UI / Slack | Call analysis, coaching feedback |
| Custom Agent | Either | Any | Everything else |

**SDR = email channel. Sales Coach = internal only. Service Agent = NOT internal.**

---

## Action Type Requirements
| Action Type | Requirements | Common Mistake |
|-------------|-------------|---------------|
| Flow Action | Autolaunched (NOT Screen), Active, Available for Input/Output checked | Using Screen Flow |
| Apex Action | @InvocableMethod, @InvocableVariable for each param | Missing annotations |
| Prompt Template Action | Active Flex template only | Using inactive or wrong type |
| Knowledge Search | Knowledge enabled, relevance 0.5–0.6 | Threshold too high (no results) |

---

## Topic and Action Description Formula
```
Topic description:
  "This handles: [what]
   Activate when: [user scenarios]
   Do NOT activate for: [exclusions]"

Action description:
  "Use this to: [what it does]
   Call when: [specific scenarios]
   Required inputs: [what Atlas needs]"
```

**Exclusions are the most commonly missing and most commonly exam-tested element.**

---

## Prompt Template Types
| Type | Saves Output? | Agent Action? | Use Case |
|------|-------------|--------------|---------|
| Field Generation | Yes → record field | No | AI value for a field |
| **Flex** | No → returns text | **Yes** | Any flexible context |
| Record Summary | No → transient | No | On-screen record summary |
| Sales Email | No → email draft | No | Email compose draft |

**Only Flex works as an Agentforce Action.**

**Merge field syntax: `{!ObjectName.FieldName}` — exclamation point required.**

**Limitations:**
- Related lists cannot be directly merged — use Flow pre-processing
- Templates arrive INACTIVE after Change Set deploy — must activate manually
- Only 2 levels of relationship traversal in merge fields

---

## Einstein Trust Layer — Five Controls
| Control | Direction | Key Fact |
|---------|-----------|---------|
| Data Masking | Outbound | Bidirectional; pattern-based; PII replaced with tokens |
| Zero Data Retention | Contractual | LLM provider discards; Salesforce STILL stores transcripts |
| Toxicity Detection | Both | Bidirectional; probabilistic (false positives/negatives) |
| Audit Log | Both | Every interaction; must be enabled; NOT retroactive |
| Grounding | Outbound | RAG: Retrieve → Augment → Generate |

**ZDR ≠ Salesforce stores nothing. ZDR = LLM provider discards.**

---

## RAG (Grounding) Pattern
```
Retrieve: Knowledge Search / Data Cloud vector search / File Search
Augment: Add retrieved content to assembled prompt
Generate: LLM generates response grounded in retrieved facts (not hallucinated)
```

**Grounding sources:**
- Einstein Knowledge → FAQ, policies, documentation
- Data Cloud → personalized customer 360° profile
- File Search → uploaded PDFs/documents
- External → custom Apex callout

**Limitations (Knowledge Search):**
- Must add Knowledge Search Action explicitly to each Topic — not automatic
- Relevance 0.5–0.6 recommended; too high = no results; too low = low-quality results
- Max 3–5 articles per search; more increases context pressure

---

## Multi-Action Pattern (Flow + Prompt Template)
```
User request
  → Flow Action (deterministic data retrieval)
  → Prompt Template Action (AI synthesis of retrieved data)
  → Personalized natural language response
```
Flow = gets data. Prompt Template = synthesizes text. Keep them separate.

---

## Eight Test Categories
1. Happy path (standard flow, all inputs available)
2. Alternate phrasings (same intent, different words)
3. Missing parameters (required input not in message)
4. Out of scope (agent should not handle)
5. Ambiguous intent (could match multiple Topics)
6. Multi-intent (one message, two requests)
7. Emotional / escalation (frustrated user)
8. Adversarial (manipulation, jailbreak attempts)

---

## Four Failure Modes
| Failure | Root Cause | Fix |
|---------|-----------|-----|
| Hallucination | No grounding / insufficient Knowledge | Add Knowledge Search Action; improve articles |
| Wrong Action | Vague/duplicate descriptions | Rewrite with specificity + exclusions |
| Stuck in Loop | Missing unresolvable parameter; Action always errors | Fix param extraction; fix error handling |
| Out-of-Scope | Topic scope too narrow; Instructions exclusion too broad | Broaden Topic description; review Instructions |

---

## Deployment Channels
| Channel | User | Key Requirement |
|---------|------|----------------|
| Embedded Chat | External customers | Omni-Channel queue required; JS snippet embedded |
| Slack | **Internal only** | SF for Slack app installed in workspace |
| API | Custom app users | OAuth 2.0; caller manages session |
| Mobile | Customer or employee | No extra setup (native app) |
| Email | SDR prospects | SDR Agent primarily |

---

## Agent Lifecycle
```
Draft → Active → Deactivated
                ↗ (reactivate)
```
- Simulator testing: NOT billable (any state)
- Billing starts: Active only
- Deactivation removes from ALL channels simultaneously

---

## Key Numbers
| Fact | Value |
|------|-------|
| Pass score | 65% = 39/60 |
| Exam time | 105 minutes |
| Exam cost | $200 |
| Topics per agent (recommended) | 3–7 |
| Knowledge relevance threshold | 0.5–0.6 |
| Max Knowledge articles per search | 3–5 |
| Human contact cost | $4–15 typical |
| Agent cost per conversation | $0.10–0.50 typical |

---

## Critical Deployment Facts
- Prompt Templates arrive **INACTIVE** after Change Set deploy → must activate manually
- Screen Flows **cannot** be agent Actions → Autolaunched only
- Draft Flows **don't appear** in Action picker → must be Active
- Input/Output variables need **"Available for Input/Output" checked** in Flow Builder
- Audit log must be **enabled before go-live** — not retroactive
- ZDR = LLM provider discards; **Salesforce stores** conversation transcripts

---

## Use Case Fit Checklist
All four YES = good fit:
- [ ] High volume (100s–1,000s/day)
- [ ] Well-defined process (clear right answers)
- [ ] Data accessible in Salesforce
- [ ] Bounded scope (3–7 Topics cover 60–70% of volume)

**Anti-patterns:** Oracle (too broad), Data Entry Clerk (deterministic work), Legal Advisor (regulatory liability), All-Knowing FAQ (unbounded scope)

---

## Exam Traps (Top 15)
1. SDR Agent = **email channel**, not Embedded Chat
2. Sales Coach = **internal reps**, NOT customer-facing
3. Screen Flow → **cannot** be agent Action
4. Only **Flex** template works as Agentforce Action
5. **ZDR** = LLM provider discards; Salesforce stores transcripts
6. Data masking is **bidirectional** (outbound AND inbound)
7. Toxicity detection is **bidirectional** (both directions)
8. Topic descriptions **must have exclusions** (not just what it does)
9. Merge field: **`{!Object.Field}`** — exclamation required
10. Templates arrive **INACTIVE** after Change Set deploy
11. Simulator testing: **NOT billable**
12. Atlas routing = **semantic matching**, NOT keywords
13. Instructions apply **globally** (not per Topic)
14. **Audit log** must be enabled before launch (not automatic/retroactive)
15. Knowledge Search Action must be **explicitly added** to each Topic
