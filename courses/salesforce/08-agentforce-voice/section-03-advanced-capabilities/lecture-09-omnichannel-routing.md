# Omni-Channel Routing for Voice

## Exam Domain
Setup & Configuration / Architecture — Agentforce Specialist (CRT-271)

## Core Concepts

### Omni-Channel Voice Routing Architecture

```
Inbound Call (PSTN)
    ↓
Telephony Provider (Amazon Connect / Genesys / NICE)
    ↓ Routes based on: DNIS, ANI, IVR selection
Service Cloud Voice API
    ↓
Omni-Channel Routing Engine
    ├── Check: Is an Agentforce Voice Agent assigned to this channel?
    │   YES → Route to autonomous agent (bot capacity unit consumed)
    │   NO  → Route to human agent queue
    │
    └── Human Queue Routing:
        ├── Most Available (least # of conversations)
        ├── Least Active (most free capacity remaining)
        └── Skills-Based (match required skills to agent skills)
```

**Omni-Channel treats voice as a work item, just like chat or email.** The routing logic is the same Omni-Channel routing engine — Skills-Based, Most Available, Least Active — applied to voice calls. The telephony provider handles the actual call setup; Omni-Channel handles who receives the work item.

**Limitations:**
- Voice calls consume 100% of an agent's Omni-Channel capacity by default (capacity cost = 1.0)
- If an agent is on a voice call, no other work items route to them unless blended capacity is explicitly configured
- Omni-Channel routing decisions and telephony call routing must be kept in sync — if they diverge, calls can ring without an available Omni-Channel slot

### Skills-Based Routing for Voice

```
Incoming Call: Customer speaks Spanish
    ↓
ANI Lookup → Account record → Language = Spanish
    ↓
Routing Configuration: Required skills = [Spanish Language]
    ↓
Omni-Channel queries: which Available agents have Spanish skill?
    ├── Agent A: English (no match)
    ├── Agent B: English + Spanish (MATCH)
    └── Agent C: English + French (no match)
    ↓
Route to Agent B
    ↓
If no match found within SLA threshold:
Skill Relaxation → route to English-only agent after N seconds
```

**Skill Relaxation** is the fallback when no skilled agent is available. It progressively removes required skills after configurable time thresholds to prevent calls waiting indefinitely.

**Skills configuration:**
1. Setup → Omni-Channel → Skills → Create skills (e.g., Spanish, Billing, Technical)
2. Setup → Users → [Agent] → Skills → Assign skills with skill level (1–10)
3. Routing Configuration → Required Skills → add skill criteria
4. Routing Configuration → Skill Relaxation → configure thresholds

**Limitations:**
- Skills-Based routing adds routing lookup latency (~100–300ms) compared to Most Available
- Skill levels (1–10) allow routing to highest-skilled agents first, but this can create uneven load distribution
- A skill configuration mistake (agent missing a skill) results in calls waiting until skill relaxation triggers, not an obvious error

### Agent Capacity and Work Item Design

```
┌───────────────────────────────────────────────────────────────────┐
│  CAPACITY MODEL: Voice vs. Other Channels                         │
├──────────────────────────┬────────────────────────────────────────┤
│  Channel                 │  Typical Capacity Cost Configuration   │
├──────────────────────────┼────────────────────────────────────────┤
│  Voice Call (default)    │  100% capacity (no other work)         │
│  Live Chat               │  25% capacity (up to 4 concurrent)     │
│  Email / Case            │  10% capacity (up to 10 concurrent)    │
│  Blended Voice + Chat    │  Voice 80% + Chat 20% (edge case;      │
│                          │  operational challenge in practice)    │
└──────────────────────────┴────────────────────────────────────────┘

Agent capacity total: 100 units (standard default)
Voice call capacity cost: 100 units → agent fully occupied
Chat capacity cost: 25 units → 4 simultaneous chats
```

**Limitations:**
- Blended voice + chat capacity configuration is technically possible but operationally difficult — an agent cannot effectively read a chat message while speaking on a phone call
- Capacity model is set per Routing Configuration, not per queue — changes affect all queues using that Routing Config
- Bot capacity units for Agentforce autonomous agents are separate from human agent capacity units

### Omni-Channel Agent States for Voice

```
Agent State Machine (voice-specific path):

OFFLINE ←──────────────────────────────────────────
   │                                               │
   │ (manual login)                                │ (manual logout)
   ▼                                               │
AVAILABLE ──[inbound call assigned]──▶ ON CALL ──[call ends]──▶ ACW
   │                                                              │
   │                                                              │ (ACW timer)
   │ ◀────────────────────────────── [timer expires] ────────────┘
   │
   └──[manual]──▶ BREAK / LUNCH / TRAINING / OTHER (custom statuses)

ACW = After Call Work (Wrap-Up) — agent finishes notes, updates case, closes loop
ACW is timed — configurable duration per queue or routing configuration
```

**After Call Work (ACW) is critical for call center operations.** Without it, agents would have to take another call immediately before finishing the previous one. ACW gives them time to update the case record, write call notes, and set disposition codes.

**Limitations:**
- ACW duration must be configured — if set to 0 or not configured, agents immediately return to Available after a call
- If ACW time runs out before the agent finishes work, they return to Available and may receive a new call — this is a design decision, not a bug
- Custom presence statuses (Break, Lunch, Training) must be created, then assigned to agent permission profiles before agents can select them

### Queue Overflow and Callback

```
Queue State:
    All agents BUSY → Call enters Queue
        ↓
    Position in queue: 1, 2, 3...
        ↓
    Max Queue Size: [configurable] (calls after max → overflow action)
        ↓
    Overflow Actions (must be configured; none by default):
    ├── Play Message + Disconnect
    ├── Transfer to External Number (backup IVR or overflow center)
    ├── Offer Callback: "We'll call you back when an agent is free"
    └── Transfer to Another Queue

Callback Feature (Salesforce Service Cloud Voice):
    Customer agrees to callback
        ↓
    Salesforce creates a Scheduled Callback record
        ↓
    When agent becomes Available → automatic outbound call placed
        ↓
    Agent receives callback work item in Omni-Channel
```

**Limitations:**
- Queue overflow actions must be explicitly configured — if not set, calls may simply ring with no answer behavior
- Callback feature requires additional configuration: outbound dial plan, phone number to call from, business hours
- Amazon Connect queue overflow handling can also be configured in the Amazon Connect Contact Flow — be careful not to create conflicting overflow logic in both systems

### Omni-Channel Supervisor Features

```
SUPERVISOR CONSOLE REAL-TIME VIEW:

┌────────────────────────────────────────────────────────────────┐
│  QUEUE STATUS                                                  │
│  Queue: Voice Technical Support                                │
│  Calls in Queue: 3   Longest Wait: 1:47   Avg Wait: 0:52       │
│                                                                │
│  AGENT STATUS                                                  │
│  ┌────────────────┬──────────────┬─────────────────────────┐  │
│  │ Agent          │ Status       │ Current Work Item       │  │
│  ├────────────────┼──────────────┼─────────────────────────┤  │
│  │ J. Smith       │ On Call      │ Call: Jane Doe 2:31     │  │
│  │ M. Johnson     │ ACW          │ Wrap-up: 0:45 remaining │  │
│  │ T. Williams    │ Available    │ (idle)                  │  │
│  │ A. Kumar       │ Break        │                         │  │
│  └────────────────┴──────────────┴─────────────────────────┘  │
│                                                                │
│  [Listen] [Barge] [Whisper]  ← voice monitoring controls      │
└────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Supervisor console real-time data refreshes on a polling interval — not true instantaneous display
- Listen/Barge/Whisper are telephony capabilities enabled by the telephony provider — Salesforce surfaces the controls but the feature depends on Amazon Connect (or partner) support
- Historical reports (Omni-Channel reports in CRM Analytics) have reporting lag — not the same as real-time supervisor console

### Routing Priority Between Bot and Human Queue

```
Typical Routing Hierarchy:
    ┌─────────────────────────────────────────────────────┐
    │  Inbound Call (via DNIS / IVR selection)            │
    │      ↓                                              │
    │  Business Hours Check (Routing Config)              │
    │      ├── Business Hours: Route to Agent Queue       │
    │      │   Agentforce Voice Agent (autonomous)        │
    │      │       → escalates to Human Queue if needed   │
    │      │                                              │
    │      └── After Hours: Route directly to Human Queue │
    │          (all calls queued for next business day    │
    │           or overflow to voicemail/external number) │
    └─────────────────────────────────────────────────────┘

For VIP callers (Skills-Based):
    ├── VIP Account: route to Priority Queue (shorter SLA)
    └── Standard Account: route to Standard Queue
```

**Limitations:**
- Business hours routing is configured in the Routing Configuration or Omni-Channel Flow — not in Agentforce Studio
- After-hours voicemail requires a telephony-layer action (e.g., Amazon Connect Contact Flow "Play Prompt + Record" block) — Salesforce Omni-Channel does not natively provide voicemail
- Priority queues require separate Routing Configurations with higher priority values — just putting high-tier calls in a separate queue doesn't give them priority without setting priority values

## PTA / SA Relevance

**Omni-Channel routing for voice is an operations design problem as much as a technical one.** Getting routing right requires understanding the customer's workforce management model, their SLA targets, and their agent skill structure. This is a common gap in partner implementations — voice gets configured as "just another work item" without the operational nuance that telephony routing requires.

**Common partner mistakes:**
- Not configuring ACW timers, resulting in agents returning to Available before finishing case updates — this produces data quality issues in post-call records
- Using Most Available routing for voice without considering skill specialization — results in generalists receiving specialist calls
- Configuring queue overflow actions as "Transfer to another queue" without realizing the second queue is also at capacity — creating a circular overflow problem
- Not aligning Omni-Channel routing with the telephony provider's queue configuration — a call can be routed to an Omni-Channel queue but the telephony still rings the wrong agents if the provider's routing is different

**Enterprise-scale considerations:**
- At 50+ queues and 500+ agents, routing configuration becomes a management challenge — use Routing Configuration templates and document the skill taxonomy before building
- Skills-Based routing with 20+ skills creates a combinatorial problem — simplify skill categories before implementation (broad skills route faster; highly granular skills cause more wait time from skill relaxation events)
- ACW time standards should come from the workforce management team — they have historical data on actual wrap-up times per call type

**For a customer with a legacy ACD (Automatic Call Distributor):** "We're not replacing your ACD's routing logic — we're bringing that logic into Salesforce so it can use CRM context. Today your routing is: caller selects 1, 2, or 3. After this project: caller says 'billing' and the routing already knows they're a VIP with an open case and routes directly to your billing specialists."

## Customer Advisory Tips

**ACW timer calibration is a workforce management decision, not a technical one.** Too short: agents feel rushed, case notes are incomplete. Too long: agents game the system by staying in ACW. Get the WFM team's input on the right duration for each call type.

**Skills-Based routing skill taxonomy best practice:**
- Start with 5–10 broad skills (language, product line, specialization)
- Add skill levels only if you have agents with measurably different capability levels
- Document which skills can be relaxed and after how many seconds — this becomes part of your SLA design

**Queue overflow design:** Every queue must have an overflow action. "No overflow configured" means calls ring unanswered when all agents are busy. Common enterprise standard: offer callback after 3 minutes in queue, then message + disconnect after 10 minutes.

**When Skills-Based routing is overkill:**
- Fewer than 30 agents
- Agents are generalists (same skill set)
- Call types are not meaningfully different
In these cases, Most Available is simpler and has less configuration overhead.

## Key Facts to Memorize
- Omni-Channel treats voice calls as work items — same routing engine as chat and email
- Voice capacity cost default = 100% (no other work items while on a call)
- ACW (After Call Work) = timed wrap-up period; must be configured with duration
- Skills-Based routing uses skill relaxation to prevent indefinite wait when no skilled agent available
- Supervisor Listen/Barge/Whisper = telephony provider capability; Salesforce surfaces the controls
- Bot capacity units (autonomous agent) are separate from human agent capacity units
- Queue overflow actions must be explicitly configured — no default behavior

## Exam Traps
- "Voice calls are routed by Agentforce Studio" → False — routing is handled by Omni-Channel routing engine and telephony provider
- "ACW automatically gives agents unlimited time to finish notes" → False — ACW has a configurable timer; when it expires, agent returns to Available
- "Skills-Based routing always routes faster than Most Available" → False — Skills-Based adds routing lookup time; if no skilled agent is available, skill relaxation adds wait time
- "Supervisor listen/barge/whisper is configured in Salesforce Setup" → Partially — controls appear in Salesforce, but the underlying feature requires telephony provider support (Amazon Connect supervisor monitoring)
- "Queue overflow is handled automatically by Omni-Channel" → False — overflow actions must be explicitly configured; no default overflow behavior exists

## Practice Questions

**Q:** An Omni-Channel routing configuration is set to Skills-Based routing for voice. A Spanish-speaking caller is waiting, but no Spanish-skilled agent is available. After 3 minutes, the call is routed to an English-only agent. What configuration caused this behavior?
**A:** Skill relaxation is configured with a 3-minute threshold. After 3 minutes with no matching skilled agent, Omni-Channel removes the Spanish language skill requirement and routes to any available agent. This is expected and correct behavior if designed that way.

**Q:** An administrator needs to ensure that when all agents are busy, callers have the option to receive a callback rather than waiting indefinitely. Which feature and where is it configured?
**A:** Configure queue overflow in the Routing Configuration or Omni-Channel Flow. Set the overflow action to "Offer Callback" after a defined queue wait time threshold. Salesforce creates a Scheduled Callback record, and the outbound call is placed automatically when an agent becomes available.

**Q:** An Agentforce Voice agent handles 80% of calls autonomously. When it escalates to a human agent, the human receives the call but sees no context from the automated conversation. What is the most likely cause?
**A:** The Transfer action in the voice agent (or autolaunched Flow) is configured for cold transfer instead of warm transfer. Warm transfer must be selected in the Voice Channel card's escalation settings to pass the VoiceCall record context and transcript to the receiving human agent.
