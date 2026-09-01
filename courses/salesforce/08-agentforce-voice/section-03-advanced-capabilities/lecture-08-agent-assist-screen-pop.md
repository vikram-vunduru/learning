# Lecture 08: Agent Assist & Screen Pop

## Learning Objectives
- Differentiate between Autonomous mode and Agent Assist mode in Agentforce Voice
- Explain how Agent Assist surfaces real-time recommendations to human agents during live calls
- Understand how Einstein Conversation Mining and Next Best Action enhance agent assist suggestions
- Configure screen pop rules using ANI, DNIS, and IVR-collected data to trigger automatic record display
- Describe how real-time sentiment analysis is displayed in the Service Console during a voice interaction

---

## Slides

### Slide 1: Two Modes of Agentforce Voice
**Visual:**
```
  ┌────────────────────────────────┐    ┌────────────────────────────────┐
  │       AUTONOMOUS MODE          │    │      AGENT ASSIST MODE         │
  ├────────────────────────────────┤    ├────────────────────────────────┤
  │                                │    │                                │
  │  Caller ──▶ [AI Agent]         │    │  Caller ──▶ [Human Agent]      │
  │              │                 │    │                │               │
  │              ▼                 │    │  [AI listens continuously]     │
  │         Resolves or            │    │                │               │
  │         Escalates              │    │                ▼               │
  │                                │    │  ┌─────────────────────────┐   │
  │  No human involved             │    │  │  Agent Assist Panel     │   │
  │  Routine, automatable calls    │    │  │  • Knowledge articles   │   │
  │                                │    │  │  • Next Best Actions    │   │
  │  Use for: case status,         │    │  │  • Sentiment gauge      │   │
  │  store hours, appt confirm     │    │  │  • Suggested responses  │   │
  └────────────────────────────────┘    │  └─────────────────────────┘   │
                                        │  Use for: complex, relationship │
                                        │  sensitive conversations        │
                                        └────────────────────────────────┘
  Both modes share: Amazon Connect / Genesys / NICE CXone infrastructure
  Both modes use: real-time transcription as foundation
  Escalation path: Autonomous ──▶ Agent Assist with full context
```

**Content:**
- **Autonomous Mode:** Agentforce agent handles the entire call without a human; caller speaks to AI
- **Agent Assist Mode:** Human agent handles the call; AI listens and surfaces real-time help
- Both modes use the same voice infrastructure (Amazon Connect, Genesys, NICE CXone)
- Both leverage real-time transcription as the foundation
- Modes can be mixed: start autonomous, escalate to human with agent assist active

**Speaker Notes:** The two modes represent fundamentally different use cases. Autonomous mode replaces the human for routine, automatable calls — case status, store hours, appointment confirmation. Agent Assist mode augments the human for complex calls where empathy, judgment, or account knowledge matters. The escalation path from autonomous to agent assist with full context is one of the most powerful patterns in the entire Agentforce Voice architecture.

---

### Slide 2: How Agent Assist Works — The Technical Flow
**Visual:**
```
  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │   Caller     │───▶│ Telephony Partner │───▶│  Service Cloud   │
  │  (phone)     │    │ (audio stream)    │    │  Voice           │
  └──────────────┘    └──────────────────┘    │  (transcript)    │
                                              └────────┬─────────┘
                                                       │ live transcript
                                                       ▼
  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │  Human       │◀───│  Agent Assist    │◀───│  Agentforce      │
  │  Agent       │    │  Panel (UI)      │    │  Agent           │
  │  (desktop)   │    │  - Suggestions   │    │  (background)    │
  └──────────────┘    │  - Articles      │    └──────────────────┘
                      │  - Next Steps    │
                      └──────────────────┘

  PIPELINE LATENCY: caller utterance → suggestion appears: 1-2 seconds
  Agent accepts suggestion with one click → inserts into notes or reads aloud
```

**Content:**
- Real-time transcription converts call audio to text as the conversation happens
- Einstein NLU analyzes transcription stream for intent, entities, and sentiment
- Suggestion engine matches analysis against Knowledge articles, macros, and Next Best Actions
- Agent assist panel in Service Console updates continuously — no page refresh
- Suggested responses displayed with confidence score and source article link
- Agent can accept a suggestion with one click, inserting it into chat or reading it aloud

**Speaker Notes:** The latency of the suggestion pipeline is something architects need to understand. From the moment a caller finishes a sentence to the moment a suggestion appears on the agent's screen, the typical latency is one to two seconds. That is fast enough to be useful in a live conversation without being so fast that suggestions distract the agent. The one-click acceptance is a significant adoption driver — agents who have to retype a suggestion tend to ignore it.

---

### Slide 3: Einstein Conversation Mining
**Visual:**
```
  EINSTEIN CONVERSATION MINING — TOPIC ANALYSIS
  ┌──────────────────────────────────────────────────────────┐
  │  Topic Clusters (bubble size = call volume)              │
  │                                                          │
  │    ●●●●●  Billing Dispute    (32%)  Resolution:  71%     │
  │    ●●●    Tech Support       (24%)  Resolution:  58%     │
  │    ●●     Account Cancel     (18%)  Escalation:  44%  ◀──┤ automation gap
  │    ●      New Service Req    (15%)  Resolution:  89%     │
  │    ·      Other              (11%)  Resolution:  65%     │
  │                                                          │
  │  90-Day Volume Trend (top 3 topics)                      │
  │  Billing  │▄▄▄▄▄▄▃▃▃▃▂▂                                  │
  │  Tech     │▄▄▄▃▃▃▃▄▄▄▄▄                                  │
  │  Cancel   │▂▂▂▃▃▄▄▄▄▄▄▄  ◀── rising                      │
  │           └────────────────────────▶ Time (90 days)     │
  └──────────────────────────────────────────────────────────┘
  Runs on schedule │ Re-trains as new transcripts accumulate
  Use output to: train Knowledge articles, tune agent assist, find automation gaps
```

**Content:**
- Analyzes historical call transcripts to identify recurring topics and intents
- Groups similar conversations into clusters automatically using NLP
- Surfaces: most common topics, resolution rates per topic, escalation rates per topic
- Used to: train Knowledge articles, tune agent assist suggestions, identify automation candidates
- Input to Flow and Agentforce agent design — tells you what callers actually ask
- Run on a schedule; re-runs as new calls accumulate

**Speaker Notes:** Conversation Mining is the feedback loop that makes Agentforce Voice get smarter over time. After your first month of live calls, run Conversation Mining to discover what topics you missed in your initial design. You will almost always find two or three high-volume intent clusters that were not in the original IVR and that you can now automate or build better Knowledge articles for. This is how voice operations matures from a launch to a continuously improving system.

---

### Slide 4: Next Best Action in Voice
**Visual:**
```
  SERVICE CONSOLE — NEXT BEST ACTION PANEL
  ┌──────────────────────────────────────────────────────────┐
  │  NEXT BEST ACTION                             [refresh]  │
  │  ────────────────────────────────────────────────────    │
  │  1. ★ Retention Offer          Confidence: 87%           │
  │     Caller churn risk: HIGH  │  LTV: $4,200/yr           │
  │     [ Accept — Apply $20/mo discount ]  [ Dismiss ]      │
  │  ────────────────────────────────────────────────────    │
  │  2.   Escalate to Tier 2       Confidence: 72%           │
  │     Issue: third contact for same problem                 │
  │     [ Accept — Route to Tier 2 ]        [ Dismiss ]      │
  │  ────────────────────────────────────────────────────    │
  │  3.   Offer Plan Upgrade       Confidence: 61%           │
  │     Caller mentioned competitor twice                     │
  │     [ Accept — Open Upgrade Flow ]      [ Snooze ]       │
  └──────────────────────────────────────────────────────────┘
  Powered by: Prediction Builder or Decision Tables
  Actions trigger Flows (send email, create case, update field) with one click
```

**Content:**
- Next Best Action uses Prediction Builder or Decision Tables to rank actions
- Triggered in real time based on call context + CRM record data
- Examples: offer retention discount when churn risk score is high, suggest upsell when caller mentions competitor
- NBA recommendations appear in agent assist panel alongside Knowledge suggestions
- Agents can dismiss, accept, or snooze recommendations
- NBA actions can trigger Flows (send email, create case, update field) with one click

**Speaker Notes:** Next Best Action in voice is where CRM data and call context combine to drive business outcomes, not just case resolution. An agent seeing a retention discount offer on screen when a customer says "I am thinking about canceling" can act on that opportunity in the moment. The key design principle is that NBA recommendations should be actionable with one click — if an agent has to navigate to a different screen to act on a recommendation, they will not use it.

---

### Slide 5: Screen Pop — What It Is and Why It Matters
**Visual:**
```
  SCREEN POP FLOW
  ┌──────────┐  CTI event   ┌──────────────┐   SOQL    ┌────────────────┐
  │ Incoming │─────────────▶│  Open CTI    │──────────▶│  Salesforce    │
  │   Call   │  (ANI passed)│  Adapter     │  lookup   │  Contact /     │
  │          │              └──────────────┘           │  Account /     │
  └──────────┘                                         │  Lead          │
                                                       └───────┬────────┘
                                                               │ match found
                                                               ▼
                                                    ┌──────────────────────┐
                                                    │   SERVICE CONSOLE    │
                                                    │  ┌──────────────────┐│
                                                    │  │ Contact Record   ││
                                                    │  │ Name: Jane Doe   ││
                                                    │  │ Account: Acme    ││
                                                    │  │ Open Cases:  2   ││
                                                    │  │ Last Call:  3d   ││
                                                    │  │ Account Tier: A  ││
                                                    │  └──────────────────┘│
                                                    │  Agent sees context  │
                                                    │  before saying hello │
                                                    └──────────────────────┘
  No match ──▶ new interaction record + Create prompt
  Multiple matches ──▶ disambiguation list for agent
```

**Content:**
- Screen pop = automatic record display when a call arrives at the agent's desktop
- Eliminates manual searching — agent sees customer context before saying hello
- Triggered by: ANI (caller phone number), DNIS (number dialed), IVR-collected account number
- Lookup order: Contact → Account → Lead → Case (configurable)
- No match: opens a new interaction record with a "Create" prompt
- Multiple matches: presents a disambiguation list for agent to choose

**Speaker Notes:** Screen pop sounds simple but has a massive impact on handle time and customer experience. When an agent picks up a call already knowing who the caller is, their case history, and their account tier, they skip the first sixty to ninety seconds of every call — the "let me pull up your account" phase. At scale across hundreds of agents, that time reduction translates directly to cost savings and higher customer satisfaction scores.

---

### Slide 6: Configuring Screen Pop Rules
**Visual:**
```
  SCREEN POP RULES CONFIGURATION
  Setup > Call Centers > [Call Center] > Screen Pop Settings
  ┌──────────────────┬──────────────────┬───────────────┬─────────────────┐
  │  Match Field     │ Lookup Object    │ Lookup Field  │ Screen Pop      │
  │                  │                  │               │ Target          │
  ├──────────────────┼──────────────────┼───────────────┼─────────────────┤
  │  ANI (CallerId)  │ Contact          │ Phone /       │ Contact record  │
  │  (primary)       │                  │ MobilePhone   │ detail page     │
  ├──────────────────┼──────────────────┼───────────────┼─────────────────┤
  │  ANI (fallback)  │ Account          │ Phone         │ Account record  │
  │                  │                  │               │ detail page     │
  ├──────────────────┼──────────────────┼───────────────┼─────────────────┤
  │  IVR Account #   │ Account          │ AccountNumber │ Account record  │
  │  (VoiceCall fld) │                  │               │ detail page     │
  ├──────────────────┼──────────────────┼───────────────┼─────────────────┤
  │  No match        │  —               │  —            │ New interaction │
  │                  │                  │               │ record + Create │
  └──────────────────┴──────────────────┴───────────────┴─────────────────┘
  Requires: CTI Adapter (Open CTI) configured correctly
  IVR data path: Voice Flow Get Input ──▶ store on VoiceCall ──▶ screen pop reads field
```

**Content:**
- Configure in Setup > Call Centers > [Your Call Center] > Screen Pop Settings
- **Primary match:** ANI matched against Contact.Phone or Contact.MobilePhone
- **Secondary match:** Account matched by Account.Phone when no Contact found
- **IVR input match:** Account number collected in Voice Flow passed as a URL parameter to the pop target
- Pop target options: Visualforce page, Lightning page, record detail page, custom URL
- Passing IVR data: Voice Flow stores collected input in a VoiceCall record field; screen pop reads that field
- Configuration requires CTI Adapter (Open CTI) to be set up correctly

**Speaker Notes:** The screen pop rules configuration is where Voice Flows and Agent Assist connect. When your Voice Flow collects an account number via Get Input before transferring to an agent, that account number can be stored on the VoiceCall record and then used as a match key for the screen pop. The agent receives not just the caller's phone-based lookup but the precise account the caller identified themselves as — which matters when callers are calling from a number that doesn't match their account.

---

### Slide 7: Real-Time Sentiment Analysis
**Visual:**
```
  REAL-TIME SENTIMENT GAUGE — SERVICE CONSOLE SIDEBAR
  ┌──────────────────────────────────────────────────────────┐
  │  CALL SENTIMENT                            Live ● 03:47  │
  │                                                          │
  │  Negative ◀──────────────────────────────▶ Positive     │
  │           ████████████████░░░░░░░░░░░░░░               │
  │                           ▲                              │
  │                     Current: Neutral                     │
  │                                                          │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │ Live Transcript                                    │  │
  │  │ Caller: "I've been trying to get this fixed for    │  │
  │  │          two weeks now..."                         │  │
  │  │ Agent:  "I understand, let me pull up your         │  │
  │  │          account right now."                       │  │
  │  │ Caller: "This is the third time I've called"       │  │
  │  └────────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────┘
  Color coding: green = positive/neutral  yellow = mild frustration
                red = high frustration / churn risk
  Supervisor view: all active calls simultaneously
  Red threshold ──▶ Flow alert fires to supervisor (configurable)
  Post-call: SentimentScore stored on VoiceCall record for analytics
```

**Content:**
- Sentiment analysis runs on the live transcription stream using Amazon Comprehend or Einstein NLP
- Displayed as a real-time gauge in the agent's console sidebar
- Color coding: green = positive/neutral, yellow = mild frustration, red = high frustration/churn risk
- Supervisor view: see sentiment across all active calls simultaneously in a monitoring dashboard
- Triggers: when sentiment crosses a threshold, can fire a Flow alert to supervisor
- Post-call: sentiment score stored on VoiceCall record for analytics

**Speaker Notes:** Real-time sentiment is most valuable for supervisors, not agents. An agent who is deep in a conversation may not notice the sentiment gauge at all — but a supervisor monitoring thirty calls simultaneously can instantly spot the one call where sentiment has turned red and intervene by whispering a coaching note to the agent or barge-monitoring the call. Configure your sentiment threshold alerts carefully — too sensitive and supervisors will be overwhelmed; too lenient and you will miss calls that need intervention.

---

## Recording Script

In this lecture, we are going to explore the two modes of Agentforce Voice — Autonomous and Agent Assist — and then dive deep into how Agent Assist works in practice, including screen pop configuration and real-time AI suggestions.

Let me start with the fundamental distinction. Autonomous mode means the Agentforce AI agent handles the call from start to finish without a human. The caller speaks, the AI understands, responds, and resolves — or escalates. Agent Assist mode means a human agent is on the call, doing the talking, but Agentforce is listening to every word and surfacing help in real time on the agent's screen. These are not competing approaches — they are complementary. Most mature voice deployments use both: autonomous for simple, high-volume calls and agent assist for complex, relationship-sensitive conversations.

Now let us look at how Agent Assist actually works under the hood, because understanding the technical flow helps you design it correctly.

The moment a call connects to an agent in Agent Assist mode, real-time transcription begins. Depending on your telephony provider, this is Amazon Transcribe for Amazon Connect deployments, or an equivalent service for Genesys and NICE CXone. The transcription stream — text appearing as the caller and agent speak — feeds into Einstein's NLU engine. Einstein analyzes that text stream continuously, looking for intent signals, named entities, and sentiment markers.

When Einstein detects an intent — say, the caller asking about a billing charge — the suggestion engine searches Knowledge articles, macros, and configured Next Best Actions for the most relevant matches. Those matches appear in the Agent Assist panel on the agent's Service Console within one to two seconds. The agent sees the top three or four suggestions, each with a confidence score and a link to the source. If one looks right, the agent clicks Accept and the response text populates in a notes field or is read aloud — depending on how you have configured the workflow.

One component that deserves its own focus is Einstein Conversation Mining. This is a retrospective analysis tool that runs on historical call transcripts. It uses natural language processing to cluster similar conversations together and tells you what topics your callers are actually discussing — which may be quite different from what your IVR menu assumes they are calling about. Conversation Mining is how you discover automation gaps: the topics that come up frequently but are not yet handled by your Voice Flows or Agentforce agents.

Now let us talk about screen pop, which is one of the most immediately visible improvements voice automation delivers.

Screen pop is the automatic display of a customer's Salesforce record when an inbound call arrives at an agent's desktop. Before the agent even says hello, they can see who is calling, what cases they have open, their account tier, and recent interaction history. The mechanism works through your CTI adapter — specifically, Open CTI — which receives the call event from your telephony provider, extracts the ANI (the caller's phone number), and uses it to query Salesforce for matching records.

You configure the lookup logic in Setup under Call Centers. The typical priority order is: first look for a Contact whose phone number matches the ANI; if no Contact is found, look for an Account; if no Account is found, look for a Lead. You can customize this order and add additional match fields.

Here is where Voice Flows and screen pop integrate beautifully. If your Voice Flow collects an account number from the caller before transferring to an agent — using a Get Input element — it can store that account number on the VoiceCall record. When the screen pop fires, it uses that stored value as a lookup key in addition to the ANI. This means that even if the caller is calling from an unrecognized phone number, the agent still gets the right record on screen because the caller confirmed their account number in the IVR portion.

For cases where the screen pop finds multiple potential matches — for example, a caller whose phone number matches three different accounts — the agent sees a disambiguation list and selects the right one. For no-match scenarios, the console opens a new interaction record with prompts to create a new contact or case.

Finally, let us cover real-time sentiment analysis. As the call progresses, Einstein's sentiment engine processes the transcription stream and produces a running sentiment score that appears as a color-coded gauge in the agent's console sidebar. This is most powerful in the supervisor monitoring view, where a supervisor can see all active calls simultaneously and their current sentiment status. When a call's sentiment drops into the negative range, you can configure a Flow-based alert to notify the supervisor, enabling intervention before the customer hangs up angry.

The combination of these capabilities — real-time suggestions, Next Best Action, screen pop, and sentiment monitoring — is what transforms a traditional call center from a reactive operation to a proactive, AI-augmented service organization.

---

## Exam Tips
- Autonomous mode = AI handles entire call; Agent Assist mode = human handles call with AI providing suggestions — do not confuse them
- Screen pop fires based on ANI (caller's phone number) matched against Contact, Account, or Lead records
- IVR-collected data (account number from Get Input) can be stored on the VoiceCall record and used as a secondary screen pop key
- Einstein Conversation Mining analyzes historical transcripts — it is retrospective, not real-time
- Next Best Action recommendations in Agent Assist panels require prior configuration in Prediction Builder or Decision Tables
- Real-time sentiment analysis uses the live transcription stream; the sentiment score is stored on the VoiceCall record post-call for reporting

---

## Lecture Summary
- Agentforce Voice operates in two modes: Autonomous (AI handles entire call) and Agent Assist (AI supports human agent in real time)
- Agent Assist works through real-time transcription → Einstein NLU analysis → suggestion engine → agent console panel updates
- Einstein Conversation Mining retrospectively clusters call transcripts to identify topics and automation opportunities
- Screen pop configuration in Call Center settings uses ANI and IVR-collected data to trigger automatic record display
- Next Best Action surfaces ranked, one-click business actions based on call context and CRM data
- Real-time sentiment analysis provides agents and supervisors with live emotional tone indicators, with Flow-based alerting available

---

## Mini Quiz

**Q1:** An agent is on a live call. The Agentforce Agent Assist panel suddenly shows a "Retention Offer" recommendation with a one-click action. What powered this recommendation?

A) A Scheduled Flow that ran at midnight  
B) Next Best Action using real-time call context and CRM data  
C) Einstein Conversation Mining retrospective analysis  
D) The Voice Call Flow's Decision element  

**Answer:** B — Next Best Action uses real-time call context combined with CRM data (like churn risk score from Prediction Builder) to surface relevant, timely recommendations to the agent during the live call.

---

**Q2:** A caller dials in from a mobile number not in Salesforce, but during the Voice Flow they enter their account number via DTMF. When the call transfers to an agent, what should happen with the screen pop?

A) No screen pop fires because ANI lookup failed  
B) The agent sees a disambiguation list of all accounts  
C) The account number stored on the VoiceCall record is used as a lookup key and the correct account pops  
D) The agent must manually search for the account  

**Answer:** C — When Voice Flow stores collected DTMF input (account number) on the VoiceCall record, screen pop configuration can use that field as a secondary lookup key, ensuring the correct account displays even when ANI matching fails.

---

**Q3:** A contact center director wants to understand which topics callers are discussing most frequently to identify knowledge gaps. Which Agentforce Voice feature should they use?

A) Real-time sentiment analysis dashboard  
B) Next Best Action Prediction Builder  
C) Einstein Conversation Mining  
D) Voice Call Flow Decision element logic  

**Answer:** C — Einstein Conversation Mining analyzes historical call transcripts and clusters them by topic, revealing the actual distribution of caller intents. This is the correct tool for understanding call topic patterns and identifying knowledge or automation gaps.
