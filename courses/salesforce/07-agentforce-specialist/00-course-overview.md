# Agentforce Specialist — CRT-271

## Exam Facts
| Detail | Value |
|--------|-------|
| Exam Code | CRT-271 |
| Questions | 60 |
| Time | 105 minutes |
| Pass Score | 65% (39/60) |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## What This Course Covers
This course prepares you for the Salesforce Certified Agentforce Specialist exam. Agentforce is Salesforce's autonomous AI agent platform — it lets you build, deploy, and monitor AI agents that can autonomously take actions on behalf of users and customers without constant human prompting. Unlike Einstein Copilot (which was assistant-first and required human confirmation for most actions), Agentforce agents can reason through multi-step problems, invoke tools, search knowledge, and complete goals end-to-end. This exam tests whether you can design and build Agentforce solutions: configuring agents with Topics and Actions, writing effective agent instructions, building Prompt Templates in Prompt Builder, grounding agents with knowledge and data, and deploying and monitoring agents in production. The exam is scenario-heavy — expect questions that describe a business problem and ask you to identify the correct agent design, the right action type, or the appropriate grounding source.

## Who This Exam Is For
- Salesforce Administrators and Developers building AI solutions on the Salesforce platform
- Solution Architects designing AI-powered customer service, sales, or employee experience solutions
- Consultants working on Agentforce implementations who need to validate their knowledge
- Anyone who has completed AI Associate and wants to advance into hands-on Agentforce building

## Prerequisite Knowledge
- **Salesforce AI Associate** (or equivalent) — you should understand Salesforce's AI ethics principles, Einstein Trust Layer, and basic AI terminology
- **Data Cloud basics** — familiarity with Data Model Objects (DMOs) and how Data Cloud stores unified profile data is helpful for grounding topics
- **Salesforce fundamentals** — comfort with Flows, Apex basics, and the standard object model
- **Basic Prompt Engineering awareness** — understanding what a prompt is, what a system prompt does, and what hallucination means

## Course Structure
This course is organized into 4 sections covering 14 lectures, 3 hands-on labs, and a final exam prep section.

### Section 1 — Agentforce Concepts & Architecture (L01–L03)
The foundation: what Agentforce is, how the Atlas Reasoning Engine works, and which pre-built agent templates Salesforce provides. Exam weight: ~20%.

### Section 2 — Building Agents: Topics, Actions & Instructions (L04–L07)
The core building skills: defining Topics (what an agent can discuss), wiring Actions (what an agent can DO), writing effective agent instructions, and grounding agents with knowledge. Exam weight: ~25%.

### Section 3 — Prompt Builder & Templates (L08–L10)
Prompt Builder's four template types, merge fields and grounding sources, testing templates, and using Prompt Templates as Agentforce actions. Exam weight: ~20%.

### Section 4 — Testing, Deployment, Monitoring & Use Cases (L11–L14)
Testing agents in Builder, deploying across channels, monitoring agent conversations, Einstein Trust Layer governance, and mapping real business scenarios to agent designs. Exam weight: ~35% (Testing/Deployment 15% + Use Cases 20%).

### Labs
- **Lab 1:** Build a basic Service Agent with a Knowledge-grounded Topic and one Flow action
- **Lab 2:** Create a Record Summary Prompt Template and wire it as an agent action
- **Lab 3:** Write test cases, run agent simulation, deploy to embedded service chat

### Exam Prep
- Full 60-question timed practice exam covering all five topic areas proportionally
- Agentforce cheat sheet: agent anatomy, Atlas reasoning loop, Prompt Builder quick reference, common exam traps

## Exam Weight Breakdown
| Domain | Weight |
|--------|--------|
| Agentforce Concepts & Architecture | ~20% |
| Building Agents — Topics & Actions | ~25% |
| Prompt Builder & Templates | ~20% |
| Testing, Deployment & Monitoring | ~15% |
| Use Cases & Business Value | ~20% |

## 4-Week Study Timeline

**Week 1 — Agentforce Concepts & Architecture (L01–L03)**
- Days 1-2: Set up a Salesforce Developer Edition org with Agentforce enabled (check the Agentforce free trial org offer on Trailhead). Work through L01 — navigate to the Agentforce Studio and explore the default Service Agent.
- Days 3-4: Study L02 (Atlas Reasoning Engine). The planning loop is the most tested architectural concept on the exam. Draw it from memory.
- Days 5-7: Complete L03 (Pre-built Agent Templates). Configure the out-of-box Service Agent in your org, change its persona, and see how instructions affect behavior.

**Week 2 — Building Agents (L04–L07)**
- Days 1-2: Study L04 (Topics and Actions) — this is the most heavily weighted section. Understand the difference between a Topic and an Action, and the four action types.
- Days 3-4: Work through L05 (Agent Instructions) and L06 (Flows and Apex Actions). Build a simple Autolaunched Flow and wire it as an action.
- Days 5-7: Complete L07 (Knowledge Grounding) and Lab 1 (Build a Service Agent). Getting grounding working in a live org is the best exam prep possible.

**Week 3 — Prompt Builder (L08–L10)**
- Days 1-2: Study L08 (Prompt Templates). Use Prompt Builder in your org to create a simple Field Generation template.
- Days 3-4: Work through L09 (Advanced Prompts) — merge fields and grounding sources. Create a Record Summary template.
- Days 5-7: Complete L10 (Prompt Actions) and Lab 2 (Record Summary Template). Understanding how a Prompt Template becomes an agent action is consistently tested.

**Week 4 — Testing, Deployment & Full Review (L11–L14)**
- Days 1-2: Study L11 (Testing Agents) and L12 (Deployment Channels). Run the conversation simulator in your org.
- Days 3-4: Work through L13 (Monitoring & Governance) — the Einstein Trust Layer section is high-yield for the exam.
- Days 5-6: Complete Lab 3, then take 2 full 60-question practice exams under timed conditions. Review every wrong answer.
- Day 7: Light review of Atlas reasoning loop, Topic vs Action definitions, and Trust Layer controls.

## Mini Quiz

**Q1:** Which Salesforce feature replaced Einstein Copilot and provides fully autonomous AI agents that can take actions without human confirmation at each step?
A) Einstein GPT
B) Agentforce
C) MuleSoft RPA
D) Einstein Next Best Action
**Answer:** B — Agentforce is Salesforce's autonomous AI agent platform, launched in 2024, which replaced Einstein Copilot. Agentforce agents use the Atlas Reasoning Engine to plan and execute multi-step actions autonomously.

**Q2:** An Agentforce agent needs to look up a customer's order status by calling a Salesforce Flow that queries the Order object. What type of action should the developer configure?
A) Prompt Template action
B) Knowledge search action
C) Flow action
D) Apex action
**Answer:** C — Autolaunched Flows can be exposed as agent actions. The Flow handles the business logic (querying the Order object) and the agent invokes it via a Flow action, passing parameters that the LLM extracts from the conversation.

**Q3:** What is the minimum passing score for the Salesforce Agentforce Specialist exam?
A) 60% (36/60)
B) 65% (39/60)
C) 70% (42/60)
D) 75% (45/60)
**Answer:** B — The Agentforce Specialist exam requires a 65% passing score, which means answering at least 39 of 60 questions correctly. This matches the passing threshold for most other Salesforce certification exams.
