# Agentforce Specialist (CRT-271) — Study Overview

## Exam Facts
| Detail | Value |
|--------|-------|
| Exam Code | CRT-271 |
| Questions | 60 |
| Time | 105 minutes |
| Pass Score | 65% (39/60) |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## What This Exam Tests
Agentforce is Salesforce's autonomous AI agent platform — agents that reason through multi-step problems, invoke tools, search knowledge, and complete goals end-to-end without constant human prompting. This is a hands-on builder exam: it tests whether I can design and configure Agentforce solutions. Questions are scenario-heavy — a business problem is described, and I need to identify the correct agent design, right action type, or appropriate grounding source.

Note: "Einstein Copilot" was renamed to "Agentforce" in 2024. Agentforce = autonomous. Copilot = assistant (required human confirmation at each step).

## Exam Weight Breakdown
| Domain | Weight | Lectures |
|--------|--------|---------|
| Agentforce Concepts & Architecture | ~20% | L01–L03 |
| Building Agents — Topics & Actions | ~25% | L04–L07 |
| Prompt Builder & Templates | ~20% | L08–L10 |
| Testing, Deployment & Monitoring | ~15% | L11–L13 |
| Use Cases & Business Value | ~20% | L14 |

## What I Need to Know Cold

### The Non-Negotiables (high-frequency exam topics)
1. **Agent anatomy:** Identity → Instructions → Topics → Actions (I-I-T-A)
2. **Atlas loop:** Observe → Reason → Act → Observe (ReAct pattern)
3. **Atlas routes by semantic matching of descriptions** — not keywords, not tables
4. **Four Action types:** Flow, Apex, Prompt Template, Knowledge Search — when to use each
5. **Five Trust Layer controls:** Data Masking, Zero Data Retention, Toxicity Detection, Audit Log, Grounding
6. **Four Prompt Template types:** Field Generation, Flex, Record Summary, Sales Email — Flex is the only one usable as an Agentforce Action
7. **Three pre-built templates:** Service Agent (customer service), SDR Agent (lead qualification), Sales Coach (internal rep coaching)
8. **RAG pattern:** Retrieve → Augment → Generate
9. **Flow Action requirements:** Autolaunched (NOT Screen), Active, Available for Input/Output checked
10. **Deployment channels:** Embedded Chat (customer-facing web), Slack (internal), API (custom apps)
11. **Licensing:** Consumption-based (per conversation, not per seat)
12. **Prompt Template deployment:** Arrives INACTIVE after change set deploy — must Activate manually

## 4-Week Study Plan

**Week 1 — Concepts & Architecture (L01–L03)**
- Set up a Salesforce Developer Edition org with Agentforce enabled
- Memorize the Atlas reasoning loop — draw it from memory
- Configure the out-of-box Service Agent, change its persona

**Week 2 — Building Agents (L04–L07)**
- L04 is the most heavily weighted section — understand Topic vs Action deeply
- Build a simple Autolaunched Flow and wire it as an action
- Get Knowledge grounding working in a live org

**Week 3 — Prompt Builder (L08–L10)**
- Create a Field Generation template and a Flex template in the org
- Understand how a Flex template becomes an agent action (this is consistently tested)

**Week 4 — Testing, Deployment & Full Review (L11–L14)**
- Run the conversation simulator, check the Reasoning Trace
- Complete 2 full timed practice exams
- Final review: Atlas loop, Topic vs Action, Trust Layer controls

## Practice Questions
**Q:** Which feature replaced Einstein Copilot and provides fully autonomous AI agents?
**A:** Agentforce (2024). Key difference: agents act without human confirmation at each step. Copilot required approval at each step.

**Q:** An agent needs to look up order status by calling a Flow that queries the Order object. What action type?
**A:** Flow Action — an Autolaunched Flow exposed as an agent action, with input/output variables available.

**Q:** Minimum passing score?
**A:** 65% = 39 out of 60 questions.
