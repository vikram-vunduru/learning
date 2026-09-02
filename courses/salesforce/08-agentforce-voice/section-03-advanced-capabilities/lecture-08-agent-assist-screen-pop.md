# Agent Assist & Screen Pop

## Exam Domain
Agent Configuration / Use Cases & Business Value — Agentforce Specialist (CRT-271)

## Core Concepts

### Two Operating Modes in Service Cloud Voice

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│  AUTONOMOUS VOICE BOT               │  AGENT ASSIST MODE                  │
├─────────────────────────────────────┼─────────────────────────────────────┤
│  No human agent in the loop         │  Human agent handles the call       │
│  Agentforce agent IS the contact    │  Agentforce assists from the side   │
│                                     │                                     │
│  Call flow:                         │  Call flow:                         │
│  Customer → Agentforce → (escalate  │  Customer → Human Agent             │
│            if needed) → Human       │             ↑ AI Suggestions        │
│                                     │             ↑ Real-time transcript  │
│  Best for: high volume, predictable │             ↑ Knowledge articles    │
│  intent, self-service use cases     │                                     │
│                                     │  Best for: complex calls, empathy   │
│                                     │  required, judgment calls           │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

**The exam tests the boundary.** Autonomous mode = the AI handles the call end-to-end. Agent Assist = a human is on the call and the AI provides real-time help to that human. These are separate capabilities, separately licensed, and separately configured.

**Limitations:**
- Autonomous mode and Agent Assist mode are not mutually exclusive on a single call — a call can start as autonomous and escalate to a human agent who then receives Agent Assist suggestions
- Agent Assist requires the Agentforce for Service license, in addition to the Service Cloud Voice license
- Agent Assist suggestions are surfaced via Einstein Conversation Insights, not a separate app

### Agent Assist Components

```
WHAT AGENT ASSIST SHOWS A HUMAN AGENT (Service Console)

┌─────────────────────────────────────────────────────────────┐
│  SERVICE CONSOLE — VOICE CALL PAGE                          │
├──────────────────────────────┬──────────────────────────────┤
│  REAL-TIME TRANSCRIPT        │  AI SUGGESTIONS PANEL        │
│  ─────────────────────       │  ──────────────────────────  │
│  Customer: "I've been        │  Detected Intent:            │
│  charged twice this month"   │  Billing Dispute             │
│                              │                              │
│  Agent: "I can see that,     │  Suggested Response:         │
│  let me check your account"  │  "I can see the duplicate    │
│                              │   charge on 08/15..."        │
│  Customer: "Also my plan     │                              │
│  was supposed to renew       │  Knowledge Article:          │
│  automatically"              │  "Duplicate Charge Process"  │
│                              │                              │
│  (scrolls in real-time       │  Next Best Action:           │
│   while on the call)         │  Issue Refund (Flow action)  │
└──────────────────────────────┴──────────────────────────────┘
```

**What Agent Assist surfaces:**
1. Real-time transcript (scrolling, speaker-labeled)
2. Detected intent / topic classification
3. Suggested responses (based on agent instructions + knowledge)
4. Knowledge article recommendations
5. Next best actions (e.g., run a Flow, update a record)
6. Post-call summary (AI-generated — agent can edit before saving)

**Limitations:**
- Agent Assist suggestions are advisory — agents can ignore them
- Suggestion latency is typically 1–3 seconds behind the live conversation (NLP processing delay)
- Post-call summary generation requires transcription to be enabled for the duration of the call
- Agent Assist is available AFTER the call escalation point — it is not available during autonomous bot interaction

### Screen Pop — How It Works

```
Inbound Call Arrives
    ↓
ANI (Caller's Phone Number) captured by telephony provider
    ↓
Service Cloud Voice passes ANI to Salesforce
    ↓
Salesforce queries for ANI match:
    Priority order:
    1. Contact.Phone
    2. Contact.MobilePhone
    3. Account.Phone
    ↓
         Found? → YES → Open Contact / Account record (screen pop)
                          Case sub-tab if open case exists
         Found? → NO  → New Case / Contact creation prompt
                          (configurable: auto-create or manual)
    ↓
Human agent's Service Console opens the matched record
    ↓
Human agent sees full CRM context before speaking a word
```

**Limitations:**
- Screen pop matches on phone number format — ANI arrives in E.164 (+1XXXXXXXXXX), Salesforce Contact.Phone field may store in national format (XXXXXXXXXX). Format mismatch = no pop.
- If multiple Contacts share the same phone number, screen pop shows a disambiguation list
- Screen pop only fires for inbound calls; outbound calls can use click-to-dial (which also opens the record)
- Screen pop does NOT create a new Contact automatically unless configured — default is to show "no match" to the agent

### Screen Pop — Configuration

```
Setup → Voice Call Centers → [Call Center] → Screen Pop Settings
┌─────────────────────────────────────────────────────┐
│  Match Priority:    Contact > Account > Lead         │
│  On No Match:       [ Show New Contact Form  ▼ ]     │
│  On Multiple Match: [ Show Match List        ▼ ]     │
│  Default Screen Pop: Contact Record                  │
│  Open Sub-Tab: Open Cases                            │
│                                                      │
│  Additionally:                                       │
│  Record Page: configure which Lightning page         │
│  layout opens — design Agent Voice Call page         │
│  layout with Transcript + AI Suggestions components  │
└─────────────────────────────────────────────────────┘
```

**Limitations:**
- Screen pop configuration is at the Call Center level, not per-queue — all calls through that Call Center use the same pop behavior
- Custom screen pop logic (e.g., look up by custom field) requires a Salesforce Flow triggered on VoiceCall creation

### Einstein Conversation Insights for Agent Assist

```
REAL-TIME                          POST-CALL
──────────────────────────         ──────────────────────────────────
  Intent detection                   Conversation summary
  Keyword alerts (product mentions,  Topic classification
  escalation language, competitor    Sentiment trend (whole call)
  names)                             Coaching flags (missed steps,
  Suggested responses                non-compliance phrases)
  Knowledge article links            Talk ratio (agent vs. customer)
  Next best action prompts

SUPERVISOR VIEW (real-time monitoring):
  Listen (silent monitor) + Barge (join) + Whisper (coach agent only)
```

**Limitations:**
- Einstein Conversation Insights (ECI) is a separate license feature — not included with base Service Cloud Voice
- Real-time keyword alerting requires pre-configuring tracked keywords/phrases in ECI settings
- Supervisor listen/barge/whisper requires Amazon Connect's supervisor monitoring capabilities to be enabled
- Post-call summary accuracy depends on transcription quality — low-quality transcripts produce poor summaries

### Agent Assist vs. Autonomous — Feature Comparison

```
┌──────────────────────────────────┬────────────────────┬────────────────────┐
│ Feature                          │ Autonomous Mode    │ Agent Assist Mode  │
├──────────────────────────────────┼────────────────────┼────────────────────┤
│ Handles call without human       │ YES                │ NO                 │
│ Real-time transcript visible     │ N/A (no human)     │ YES                │
│ AI suggested responses           │ N/A                │ YES                │
│ Knowledge article suggestions    │ N/A                │ YES                │
│ Post-call summary                │ YES (for records)  │ YES (for agent)    │
│ Escalate to human with context   │ YES                │ N/A (already human)│
│ Works with Screen Flow           │ NO                 │ YES (screen pop    │
│                                  │                    │ is screen, not bot)│
└──────────────────────────────────┴────────────────────┴────────────────────┘
```

**Key distinction:** Screen Flows are incompatible with autonomous voice bots (no screen on a phone call), but Screen Flows ARE usable in Agent Assist workflows where the human agent has a screen. The screen pop IS a screen pop — it opens a Lightning page, not a Screen Flow interaction for the caller.

**Limitations:**
- Blending both modes on the same call (bot starts, human takes over, AI assists) requires both Autonomous and Agent Assist licenses
- A post-call summary generated during autonomous mode still requires a human agent to review/save it to the case record

## PTA / SA Relevance

**Agent Assist is the highest-ROI Agentforce Voice capability for complex contact centers where full automation isn't viable.** For regulated industries (healthcare, financial services, legal) where a human must be in the loop, Agent Assist is the right starting point — it delivers AI value without removing human judgment.

**The "crawl-walk-run" framing for voice AI:**
- Crawl: screen pop only — agent gets CRM context on answer (zero AI, just integration)
- Walk: Agent Assist — AI surfaces suggestions, knowledge, summaries
- Run: Autonomous agent — AI handles the call, escalates only when needed

Most successful implementations start at "crawl" to prove value and build agent trust in AI, then progress to "walk" and "run" over 12–24 months.

**Common partner mistakes:**
- Trying to deploy autonomous mode before resolving phone number format mismatches (the screen pop doesn't fire = agents have no context = failed autonomous escalation handling)
- Not including post-call summary quality in the acceptance criteria — agents often resist the feature if summaries are inaccurate
- Not configuring the Lightning page layout for the Voice Call record — agents see the transcript in a tiny component instead of a well-designed working surface

**Enterprise considerations:**
- For 500+ agent deployments, the post-call summary feature can save 30–60 seconds of wrap-up time per call — at scale this is a measurable FTE cost reduction
- Supervisor monitoring (listen/barge/whisper) requires Amazon Connect supervisor configuration — Salesforce does not manage the underlying audio stream
- Einstein Conversation Insights keyword alerting can flag compliance keywords in real-time — surfaced to supervisors, not just agents. For heavily regulated call centers, this is a compliance evidence feature.

**For a financial services customer:** "Agent Assist doesn't remove human judgment — it makes your agents faster and more consistent. The AI surfaces the right knowledge article and suggests the right next action, but your agent makes the final call. Compliance is intact."

## Customer Advisory Tips

**Phone number format standardization is a prerequisite — not an assumption.** Run a data quality check on Contact and Account phone fields before promising screen pop accuracy. Common issues: national vs. E.164 format, extension numbers appended, spaces/dashes inconsistency.

**Post-call summary quality threshold:** Before rolling out AI summaries broadly, test on 50–100 call recordings and have agents rate accuracy. If accuracy is below ~85% on your call types, investigate transcription accuracy first (not the summary model). Summaries are downstream of transcription.

**Agent adoption strategy:** Agents resist AI suggestions when they feel "monitored" or "replaced." Frame Agent Assist as "co-pilot" — the AI is doing the research lookup while you're listening, so you don't have to. Adoption is highest when agents actively experience time savings in the first week.

**Screen pop no-match rate as a diagnostic:** If >30% of incoming calls produce no screen pop match, this indicates a phone number data quality problem in the CRM, not a Salesforce configuration problem.

## Key Facts to Memorize
- Autonomous mode = AI handles the call; Agent Assist = AI helps a human handling the call
- Screen pop fires on ANI match to Contact.Phone or Account.Phone (E.164 format required for match)
- Agent Assist surfaces: transcript, intent, suggested responses, knowledge articles, next best actions, post-call summary
- Post-call summary requires transcription to be enabled for the call duration
- Screen Flows ARE usable in Agent Assist (human has a screen); NOT in autonomous bot (caller has no screen)
- Einstein Conversation Insights: real-time keyword alerting + post-call coaching flags + supervisor listen/barge/whisper

## Exam Traps
- "Screen pop is configured in Agentforce Studio" → False — Screen pop is configured in Setup → Voice Call Centers → Screen Pop Settings
- "Agent Assist works during the autonomous bot interaction" → False — Agent Assist kicks in after a human agent receives the escalated call
- "Screen Flows are incompatible with ALL voice scenarios" → Nuanced — incompatible with autonomous voice bots; compatible with the human agent's console in Agent Assist mode
- "A screen pop fires for every inbound call" → False — screen pop only fires when the ANI matches a record in Salesforce
- "Post-call summary is generated by transcription" → Partially — post-call summary is generated by LLM inference over the transcript; transcription is the prerequisite input

## Practice Questions

**Q:** A Salesforce administrator has configured an Agent Assist workflow. Agents report that screen pop never fires when callers call in. Investigation shows all phone numbers are stored in Salesforce in format "555-867-5309" but ANI arrives as "+15558675309". What is the fix?
**A:** Standardize the Contact and Account phone fields to E.164 format (+1XXXXXXXXXX), or add a formula/trigger to normalize the incoming ANI to match the stored format. The phone number format mismatch between ANI (E.164) and stored format (national) prevents screen pop from matching.

**Q:** An autonomous voice agent handles calls, and callers who escalate to a human agent report that the agent has no context about their issue. What configuration is needed?
**A:** Configure warm transfer (not cold transfer) in the voice agent's escalation settings. Warm transfer passes the VoiceCall record context — including the transcript and any intent data — to the receiving human agent's Service Console screen.

**Q:** A contact center manager wants to see real-time keyword alerts when callers use competitor names during live calls. Which feature enables this?
**A:** Einstein Conversation Insights (ECI), configured with tracked keywords/phrases. ECI provides real-time keyword alerting to supervisors during live calls when configured competitor names are detected in the real-time transcript.
