# Lecture 09: Omni-Channel Routing for Voice

## Learning Objectives
- Describe the Service Cloud Voice routing architecture and how voice fits into the broader Omni-Channel framework
- Configure skill-based routing, queues, and capacity models for voice channels
- Explain agent state management including Available, Busy, and After Call Work states
- Configure ACW (After Call Work) time and understand its impact on agent availability and capacity planning
- Design a voice escalation path from an autonomous Agentforce agent to a human agent with context preservation

---

## Slides

### Slide 1: Omni-Channel and Voice — The Big Picture
**Visual:** Architecture diagram showing multiple channels (Chat, Email, Voice, Social) all feeding into a central Omni-Channel routing engine, which distributes work to agent pools with skill tags

**Content:**
- Omni-Channel routes work items across all channels from a single engine
- Voice is a first-class channel in Omni-Channel — same routing rules, same agent state management
- Benefit: a single agent can handle voice + chat + email in a blended model
- Routing engine evaluates: agent availability, skills match, priority, capacity, queue depth
- Voice work items created automatically when a call arrives; treated like any other work item
- Key difference from other channels: voice is synchronous and real-time — routing must happen in seconds

**Speaker Notes:** The key insight for architects is that adding Voice to Omni-Channel does not require a parallel routing infrastructure. The same routing engine that sends chat conversations and email cases to agents also routes voice calls. This is architecturally elegant and operationally powerful — you can have agents who handle voice during peak phone hours and switch to chat and email during lower call volume periods, all managed by a single capacity model.

---

### Slide 2: Skill-Based Routing for Voice
**Visual:** Table showing agents with skill tags — Agent A: English, Billing, Tier-2; Agent B: Spanish, Sales; Agent C: English, Technical, Tier-1 — with arrows showing which queue each agent services

**Content:**
- Routing Skills defined in Setup > Omni-Channel > Skills
- Skills assigned to agents individually or via Permission Sets / profiles
- Queue configuration: each queue specifies required and preferred skills
- **Required skill:** call will not route to agent without this skill
- **Preferred skill:** routing prefers agents with this skill but will relax if no match available
- Skill relaxation: configure how long to wait before relaxing skill requirements
- Skills for voice: language, product area, escalation tier, technical specialty

**Speaker Notes:** Skill-based routing for voice is identical in configuration to skill-based routing for any other channel — that is the beauty of the unified Omni-Channel model. Define your skills once, assign them to agents, attach them to queues, and the routing engine handles the rest. The skill relaxation configuration is particularly important for voice, because unlike email where a thirty-minute wait is acceptable, a caller waiting on hold for a Spanish-speaking agent may abandon if the wait exceeds two minutes. Configure relaxation timers to match your service level targets.

---

### Slide 3: Queue Configuration for Voice
**Visual:** Setup page mockup for a Service Cloud Voice queue — showing fields: Queue Name, Routing Configuration, Skills Required, Skills Preferred, Overflow Action, Expected Wait Time Calculation

**Content:**
- Queues created in Setup > Queues; Voice-enabled queues need a Routing Configuration
- Routing Configuration types: Most Available, Least Active, Skills-Based
- **Most Available:** routes to agent with longest idle time
- **Least Active:** routes to agent with fewest open work items
- **Skills-Based:** routes to best skill match within capacity
- Overflow action: when all agents at capacity → play wait message, offer callback, or escalate to different queue
- Expected wait time: Omni-Channel calculates and can surface to caller via Voice Flow Speak element

**Speaker Notes:** Queue configuration is where voice operations get sophisticated. The routing configuration type you choose has significant implications for agent utilization and customer wait time. Most Available tends to distribute calls more evenly across agents but may route to a less skilled agent. Skills-Based delivers better first-contact resolution but can create uneven load. For most implementations, I recommend Skills-Based routing with a fallback to Most Available after a skill relaxation timeout, which balances quality and efficiency.

---

### Slide 4: Priority and Capacity Models
**Visual:** Diagram showing three queues with different priority levels (1, 2, 3) feeding into an agent capacity model — each agent bubble showing current load as a pie chart (voice=50%, chat=30%, unused=20%)

**Content:**
- **Priority:** numeric value on queue (lower = higher priority); voice typically set higher than async channels
- **Capacity model:** defines how much agent bandwidth a voice interaction consumes
- Default: voice consumes 100% of capacity (agent can only handle one call at a time)
- Custom capacity units: configure voice as 10 units of capacity where agent total = 10 (same effect)
- Blended capacity: some organizations allow agents to handle one call + one chat simultaneously (requires careful UX design)
- **Direct-to-agent routing:** bypass queue, route specific caller directly to a named agent (used for VIP or scheduled callbacks)

**Speaker Notes:** The capacity model for voice almost always sets voice at 100% of an agent's capacity — you simply cannot have a meaningful phone conversation while simultaneously handling another call. Where capacity modeling gets interesting is in the blended scenario: some operations allow agents to handle a voice call alongside a low-intensity asynchronous work item like an email. This can improve utilization metrics, but it risks call quality and customer satisfaction. Use blended capacity models only after pilot testing with agent feedback.

---

### Slide 5: Agent State Management
**Visual:** State machine diagram showing agent states: Offline → Available → Busy (on call) → After Call Work → Available; plus a side path to Custom Status (e.g., Break, Training)

**Content:**
- **Offline:** agent not signed into Omni-Channel; no work routed
- **Available:** agent signed in and open to receive work; subcategory per channel (Available for Voice, Available for Chat)
- **Busy:** agent currently handling a work item; new work not routed (unless blended capacity allows)
- **After Call Work (ACW):** post-call state for disposition, notes, case update; configurable duration
- **Custom statuses:** Break, Lunch, Training, Meeting — all show as unavailable for routing purposes
- State changes are tracked and reportable; used in workforce management and adherence reporting
- Supervisors can view all agent states in real time in the Supervisor Console

**Speaker Notes:** Agent state management is the operational heartbeat of a contact center. When an agent is in ACW, they are not receiving new calls — that is protected time for them to complete their post-call work. If ACW is too short, call quality and CRM data completeness suffer. If it is too long, queue depths grow and wait times increase. Finding the right ACW duration for your team is an iterative process that starts with measurement, which we cover in the Monitoring lecture.

---

### Slide 6: After Call Work Configuration
**Visual:** Setup page for ACW configuration — fields showing: ACW Time Limit (seconds), Auto-Accept Next Work After ACW, ACW Required/Optional toggle, Channels that use ACW

**Content:**
- Configure ACW duration in Setup > Omni-Channel > Service Channels > Voice
- **Fixed duration:** agent automatically exits ACW after X seconds
- **Manual:** agent manually ends ACW when done; at risk of agent extending ACW indefinitely
- **Auto-end + auto-route:** next work item pushed to agent automatically when ACW expires
- Typical ACW for voice: 30-90 seconds depending on call complexity
- Short calls (simple inquiries): 30-45 seconds ACW
- Complex calls (case creation, escalation documentation): 90-120 seconds ACW
- Recommendation: start with 60 seconds, measure actual wrap-up time, adjust quarterly

**Speaker Notes:** ACW duration is one of those configuration decisions that looks minor but has significant operational impact. Too short and agents rush their notes, creating incomplete case records that require follow-up. Too long and you are paying agents to sit idle. The right approach is to monitor actual wrap-up time through call recording review and reporting — then set your ACW limit slightly above the median actual wrap-up time to give most agents enough room while limiting outliers.

---

### Slide 7: Voice Escalation — Autonomous Agent to Human Agent
**Visual:** Sequence diagram: Agentforce autonomous agent → escalation trigger → Transfer to Agent element in Voice Flow → Omni-Channel routing → agent screen pop with full conversation history

**Content:**
- Escalation triggers in autonomous agent: caller request ("speak to an agent"), low confidence, sentiment threshold, specific intent (complaints, legal, billing dispute)
- Transition mechanism: Agentforce agent invokes Transfer to Agent Flow element
- Context preservation: full conversation transcript, detected intent, collected data fields passed via VoiceCall record
- Agent receives: screen pop with customer record, conversation summary, reason for escalation
- Post-escalation: Agent Assist mode activates automatically on escalated calls (configurable)
- Graceful escalation: agent hears "I am connecting you to a specialist who has your conversation history" — no repetition required

**Speaker Notes:** The escalation path is where the entire voice architecture comes together. When an autonomous agent transfers a call to a human, the quality of that handoff determines whether the caller experiences a seamless upgrade or a frustrating restart. The critical piece is context preservation — the human agent must see the conversation history, the detected intent, and any data the caller provided to the autonomous agent, so they can continue the conversation rather than starting over. This requires deliberate configuration: the Agentforce agent must write context to the VoiceCall record, and the screen pop must be configured to surface that record to the receiving agent.

---

## Recording Script

Welcome to Lecture 9. We are going to cover how voice routing works in Salesforce Omni-Channel — the routing engine that handles all channels from a single control plane, including voice.

Let me start with the architectural point that is most important to understand: voice is not a separate routing system. Service Cloud Voice feeds calls into the same Omni-Channel routing engine that handles chat, email, messaging, and cases. This is a significant design decision by Salesforce, and it has major operational benefits. It means a single configuration — your queues, your skills, your capacity rules — governs how all work reaches your agents, regardless of channel. It means agents can be configured to handle voice during peak call periods and switch to asynchronous channels during quieter periods, with the routing engine managing that transition automatically.

So how does voice routing actually work? When a call arrives through your telephony provider — Amazon Connect, Genesys, or NICE CXone — Service Cloud Voice creates a Voice Call record and a work item in Omni-Channel. That work item is then subject to the same routing logic as any other work item: queue priority, skill matching, agent capacity, and agent state.

Let us walk through skill-based routing, because this is the most common configuration for voice in enterprise contact centers. You define routing skills in Setup — things like language proficiency, product specialization, or support tier. You assign those skills to agents. You configure queues to require certain skills and prefer others. When a call arrives, the routing engine finds available agents whose skills match the queue's requirements, then selects the best match based on your routing configuration — most available, least active, or skills-based.

The skill relaxation feature is particularly important for voice. Unlike an email that can wait in a queue for thirty minutes, a caller on hold will abandon if they wait too long. Skill relaxation lets you define how long to hold out for a perfectly skilled agent before expanding the match criteria. For example: require a Spanish-speaking, billing-specialized agent for the first ninety seconds; after that, relax to any Spanish-speaking agent; after another sixty seconds, route to any available agent.

Queue configuration for voice adds one important capability: overflow actions. When all agents are at capacity, your queue can play a hold message and estimate wait time — you can feed the expected wait time into a Voice Flow Speak element so callers hear "Your estimated wait time is four minutes." You can offer a callback option, which creates a scheduled callback record in Salesforce. Or you can overflow to a different queue with looser skill requirements.

Now let us talk about agent state management, which is the operational heartbeat of your call center. Agents exist in a state machine: Offline, Available, Busy, After Call Work, and custom statuses like Break or Training. When an agent is Available, the routing engine can push voice calls to them. When they are Busy on a call, they are not available for additional calls (in most configurations). When a call ends, the agent transitions to After Call Work.

After Call Work is protected time for the agent to complete post-call tasks: updating the case record, adding call notes, sending a follow-up email, or creating a task for a colleague. The duration of ACW is configurable per service channel. You can set a fixed time limit — say, sixty seconds — after which the agent automatically becomes available again. Or you can configure it as manual, where the agent ends ACW themselves when they finish. For most operations, a fixed time limit prevents ACW from becoming an extended break while still giving agents enough time to complete their wrap-up work.

I want to spend a moment on the escalation path from an autonomous Agentforce voice agent to a human agent, because this is where routing, agent state, and context preservation all converge.

When an autonomous agent decides to escalate — because the caller asked to speak to a human, because the agent's confidence is too low, or because a configured trigger fired — it invokes the Transfer to Agent element. That element routes the call to the appropriate Omni-Channel queue based on the escalation reason. But before handing off, the agent writes context to the VoiceCall record: the conversation transcript, the detected intent, the reason for escalation, and any data fields the caller provided.

When the human agent accepts the call, their screen pops with the customer record and the VoiceCall record — including all that context. Agent Assist mode activates automatically on escalated calls (configurable), so the AI immediately begins surfacing suggestions based on the conversation history. The caller hears something like "I am connecting you now to a specialist who has your information" — and when the agent answers, they do not need to ask the caller to repeat themselves because everything is already on their screen.

That handoff experience — seamless, context-preserving, AI-assisted — is the gold standard for voice escalation, and it is achievable with proper configuration of these three components: Voice Flows, VoiceCall record field population, and screen pop rules.

---

## Exam Tips
- Voice is a first-class Omni-Channel channel — the same routing engine, queues, and skills model applies to voice as to chat and email
- Skill relaxation for voice is critical because callers abandon queues faster than async channel users
- After Call Work duration should be configured based on measured actual wrap-up time, not guesswork
- Direct-to-agent routing bypasses the queue and is used for VIP callers or scheduled callbacks
- Context preservation during escalation requires the Agentforce agent to write to the VoiceCall record before invoking Transfer to Agent
- Agent Assist mode can be configured to activate automatically when an autonomous agent escalates to a human

---

## Lecture Summary
- Voice integrates into Omni-Channel as a first-class channel, using the same routing engine, queues, and skill assignments as chat and email
- Skill-based routing with configurable relaxation timers balances skill match quality against acceptable wait time for voice
- Queue overflow actions for voice include hold with wait time estimate, callback scheduling, and overflow to alternate queue
- Agent state machine (Offline → Available → Busy → After Call Work) governs when calls are routed; ACW provides protected post-call wrap-up time
- ACW duration should be set based on measured actual wrap-up time; typical range is 30-90 seconds for voice
- Voice escalation from autonomous agent to human requires context written to VoiceCall record, with screen pop and optional auto-enabled Agent Assist on the receiving end

---

## Mini Quiz

**Q1:** A Spanish-speaking, billing-specialized agent is on a call. A new Spanish-speaking caller enters the billing queue, but no other agents with both skills are available. Which configuration ensures the caller is routed within 90 seconds rather than waiting indefinitely?

A) Set queue priority to highest  
B) Configure skill relaxation to drop the billing skill requirement after 90 seconds  
C) Configure ACW to 0 seconds so the current agent becomes available sooner  
D) Set the routing type to Most Available  

**Answer:** B — Skill relaxation allows you to define a wait threshold after which one or more required skills are dropped from the routing match criteria, enabling the call to route to any Spanish-speaking available agent rather than waiting indefinitely for the full skill match.

---

**Q2:** An autonomous Agentforce voice agent has just determined a caller's issue requires human intervention. What must the agent do before invoking the Transfer to Agent element to ensure a seamless handoff?

A) End the call and send the caller a case number via SMS  
B) Write conversation transcript, detected intent, and escalation reason to the VoiceCall record  
C) Create a new Case record and assign it to the receiving agent  
D) Play a hold message while the routing engine searches for agents  

**Answer:** B — Context preservation requires that the autonomous agent populate the VoiceCall record with the conversation history and escalation context before the transfer. The receiving agent's screen pop reads this record, enabling them to continue the conversation without asking the caller to repeat information.

---

**Q3:** A contact center manager notices agents are extending After Call Work indefinitely, causing queue depths to increase. What is the recommended configuration change?

A) Remove After Call Work from the voice channel entirely  
B) Set a fixed ACW time limit in the Voice Service Channel settings  
C) Reduce agent capacity to force faster call acceptance  
D) Increase queue priority to override ACW  

**Answer:** B — Setting a fixed ACW time limit in the Voice Service Channel configuration causes the agent to automatically transition to Available status when the timer expires, preventing indefinite extension of wrap-up time while still giving agents protected time for post-call tasks.
