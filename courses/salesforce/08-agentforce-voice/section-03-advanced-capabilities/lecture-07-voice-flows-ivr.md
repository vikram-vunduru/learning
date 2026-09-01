# Lecture 07: Voice Flows & IVR Modernization

## Learning Objectives
- Understand which Flow types are compatible with Salesforce Voice and why only Autolaunched Flows work in voice contexts
- Learn the core elements of a Voice Call Flow: Speak, Get Input, Transfer to Agent, and DTMF handling
- Design branching voice logic using caller data such as account lookups and case history
- Distinguish when to use Salesforce Flow versus an Agentforce autonomous agent for voice automation
- Replace legacy IVR trees with intelligent, data-driven voice flows

---

## Slides

### Slide 1: Why Voice Flows?
**Visual:**
```
  LEGACY IVR (12+ nodes, 4 levels)       VOICE FLOW (5 nodes, CRM-driven)
  ┌─────────────────────────────┐         ┌──────────────────────────────┐
  │  "Press 1 for Sales"        │         │  ANI → Record Lookup         │
  │       │                     │         │       │                      │
  │  ┌────┴─────────────┐       │         │  ┌────▼──────────────────┐   │
  │  ▼         ▼        ▼       │         │  │  Decision (CRM data)  │   │
  │ Sales   Support  Billing    │         │  └───┬──────┬────────┬───┘   │
  │  │         │        │       │         │      │      │        │       │
  │  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  │         │     VIP    Case   New       │
  │  │ │ │ │ │ │ │ │ │ │ │ │  │         │  Caller  Exists  Caller      │
  │  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘  │         │      │      │        │       │
  │  (4 more sub-levels...)     │         │   Skip   Status  Route      │
  └─────────────────────────────┘         │   menus  update  general    │
  No CRM context                          └──────────────────────────────┘
  High abandonment                        CRM-driven, fewer menus
  "Enter your account number..."          "We see your open case #12345"
```

**Content:**
- Legacy IVR: static menus, no CRM context, high abandonment
- Voice Flows: dynamic, data-driven, Salesforce-native
- Triggered automatically when a call arrives on a Voice Channel
- Access to caller's full Salesforce record in real time
- Reduces menu depth and improves containment rate

**Speaker Notes:** Legacy IVR systems were built around the premise that callers must self-identify and navigate menus. Salesforce Voice Flows flip that model — the system already knows who is calling the moment the call arrives. That single shift eliminates entire branches from your IVR tree and delivers a fundamentally better caller experience.

---

### Slide 2: Flow Types — What Works and What Doesn't
**Visual:**
```
  ┌────────────────────────────┬────────────────────┬──────────────────────────────┐
  │  Flow Type                 │ Voice Context?     │ Why / Why Not                │
  ├────────────────────────────┼────────────────────┼──────────────────────────────┤
  │  Screen Flow               │ NO                 │ Requires UI surface to render│
  │  Autolaunched Flow         │ YES                │ Headless, no UI dependency   │
  │  Scheduled Flow            │ NO                 │ Not triggered by real-time   │
  │                            │                    │ events                       │
  │  Record-Triggered Flow     │ LIMITED            │ Can react to VoiceCall       │
  │                            │                    │ creation, not direct voice   │
  │  Voice Call Flow (subtype) │ YES                │ Purpose-built for voice;     │
  │                            │                    │ has Speak, Get Input,        │
  │                            │                    │ Transfer to Agent elements   │
  └────────────────────────────┴────────────────────┴──────────────────────────────┘
```

**Content:**
- Screen Flows — NO — require a UI surface to render
- Autolaunched Flows — YES — headless, no UI dependency
- Scheduled Flows — NO — not triggered by real-time events
- Record-Triggered Flows — limited — can react to VoiceCall creation, not direct voice interaction
- Voice Call Flow subtype — YES — purpose-built for voice, has voice-specific elements

**Speaker Notes:** This is a favorite exam topic. The critical distinction is that any Flow requiring a screen to render will not work in a voice context — there is no screen on a phone call. Autolaunched Flows are headless by design, and Salesforce has built a Voice Call Flow subtype on top of Autolaunched Flows that exposes the voice-specific elements you need.

---

### Slide 3: The Voice Call Flow — Key Elements
**Visual:**
```
  VOICE CALL FLOW ELEMENTS
  ┌──────────────────────────────────────────────────────────┐
  │  Element          │ Purpose                              │
  ├───────────────────┼──────────────────────────────────────┤
  │  Speak            │ TTS: play message to caller          │
  │  Get Input        │ Capture DTMF or speech input         │
  │  Transfer         │ Route to agent, queue, or number     │
  │  Pause            │ Wait N seconds (hold music via tel.) │
  │  Decision         │ Branch on variable value             │
  │  Get Record       │ SOQL lookup (ANI → Account)          │
  │  Update Record    │ DML on VoiceCall or related record   │
  │  Subflow          │ Call another Flow                    │
  └──────────────────────────────────────────────────────────┘

  IVR REPLACEMENT PATTERN:
  Caller speaks ──▶ Get Input (speech) ──▶ NLP intent
        │
        ├──▶ "billing"   ──▶ BillingTopic flow
        ├──▶ "support"   ──▶ TechSupportTopic flow
        └──▶ no match    ──▶ "Sorry, let me transfer you" ──▶ Transfer
```

**Content:**
- **Speak:** Converts text to speech using Amazon Polly or Genesys TTS; supports SSML for pause/tone control
- **Get Input:** Prompts caller for voice response or DTMF key press; configurable confidence threshold
- **Transfer to Agent:** Routes call to a human agent or Omni-Channel queue with context payload
- **Decision:** Branches flow logic based on caller data, input results, or record field values
- **Record Lookup:** Queries Salesforce objects (Account, Case, Contact) mid-call using ANI or other inputs

**Speaker Notes:** Think of these five elements as your voice toolkit. In practice, most Voice Flows chain them in a cycle: Speak to greet, Get Input to understand intent, Record Lookup to pull context, Decision to branch, then either another Speak/Get Input loop or Transfer to Agent. The SSML support in the Speak element is worth mastering — small pauses and emphasis changes can dramatically improve how natural the voice sounds.

---

### Slide 4: DTMF Input Handling
**Visual:**
```
  DTMF INPUT HANDLING
  ┌──────────────────────────────────────────────────────────┐
  │     Phone Keypad              Flow Branches              │
  │  ┌───┬───┬───┐                                          │
  │  │ 1 │ 2 │ 3 │──── "1" ──▶ Billing queue               │
  │  ├───┼───┼───┤                                          │
  │  │ 4 │ 5 │ 6 │──── "2" ──▶ Tech Support queue          │
  │  ├───┼───┼───┤                                          │
  │  │ 7 │ 8 │ 9 │──── "3" ──▶ Sales queue                 │
  │  ├───┼───┼───┤                                          │
  │  │ * │ 0 │ # │──── no input / timeout ──▶ Retry (×3)   │
  │  └───┴───┴───┘                      └──▶ Transfer Agent │
  └──────────────────────────────────────────────────────────┘
  Max Digits: configurable  │  Timeout between digits: configurable
  Retry count: configurable │  PCI: pause recording during payment DTMF
```

**Content:**
- DTMF = Dual-Tone Multi-Frequency (the tones when you press keys)
- Get Input element can accept DTMF, speech, or both
- Set `Input Type` to DTMF for payment capture, PIN entry, or simple menu choices
- `Max Digits` parameter controls expected input length
- Timeout and no-input handling: configure retry count and fallback branch
- PCI compliance note: DTMF tone capture for payment card data can pause recording

**Speaker Notes:** DTMF remains important even in AI-driven flows because some callers prefer key presses, and certain use cases — PIN verification, payment digits, account number entry — are more reliable with DTMF than speech recognition. The Get Input element handles both in the same element, so you can offer callers the choice. PCI-DSS compliance requires that audio recording be paused when capturing sensitive DTMF input — we cover this in detail in Lecture 12.

---

### Slide 5: Caller Data Branching — The Power of CRM Context
**Visual:**
```
  Incoming Call (ANI: +1-555-234-5678)
          │
          ▼
  ┌───────────────────────────────────┐
  │  Record Lookup (Phone → Account)  │
  │  SOQL: SELECT Id, Name, Tier__c,  │
  │  (SELECT Id FROM Cases WHERE      │
  │   Status != 'Closed') FROM Account│
  │  WHERE Phone = :ANI               │
  └──────────────┬────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────┐
  │  Decision Node (CRM Context)     │
  └──┬───────────────┬───────────────┘
     │               │               │
     ▼               ▼               ▼
  VIP Account   Open Case Exists   New Caller
  │              │                  │
  ▼              ▼                  ▼
  Skip menus    "We see open case  General routing /
  Priority queue #12345. Press 1   account creation
                for status or 2
                to speak to agent"
```

**Content:**
- ANI (Automatic Number Identification) = caller's phone number, available as `{!$Record.CallerId}`
- Lookup Contact or Account by phone number at flow start
- Branch on: Account tier, open cases, recent order status, entitlement level
- VIP branch: skip menus entirely, offer callback or priority queue
- Open Case branch: read case number aloud, offer status update without agent
- New Caller branch: offer account creation or general routing

**Speaker Notes:** This branching pattern is the single biggest value proposition of Voice Flows over legacy IVR. A traditional IVR asks "Press 1 for order status" — the caller then has to give their account number, wait for a lookup, and navigate sub-menus. With a Voice Flow, you already have the account, you already have the open case — you can simply say "We see you have an open case number 12345. Press 1 for a status update, or press 2 to speak with an agent." That single change reduces average handle time significantly.

---

### Slide 6: Flow vs. Agentforce Agent — Decision Guide
**Visual:**
```
  VOICE AUTOMATION DECISION GUIDE

  Is caller intent structured and predictable?
                    │
          ┌─────────┴─────────┐
         YES                  NO
          │                   │
          ▼                   ▼
       USE FLOW         USE AGENTFORCE AGENT
       ─────────        ─────────────────────
       Structured       Open-ended NLU
       DTMF menus       Multi-turn dialogue
       Known fields     Unpredictable intents
       Deterministic    LLM reasoning
       Low latency      Rich comprehension
       Audit-friendly   Flexible responses
       Lower cost       Higher capability

            RECOMMENDED: HYBRID PATTERN
  ┌──────────────────────────────────────────┐
  │  Flow: greeting + ANI lookup             │
  │             │                            │
  │             ▼                            │
  │  Agentforce Agent: intent resolution     │
  │  + natural language conversation         │
  │             │                            │
  │             ▼                            │
  │  Flow action: Transfer / Record Update   │
  │  / Subflow for structured steps          │
  └──────────────────────────────────────────┘
```

**Content:**
- Use **Flow** when: interaction is structured (menu choices, data collection with known fields), compliance requires deterministic behavior, latency is critical
- Use **Agentforce Agent** when: caller intent is unpredictable, natural conversation is required, multi-turn reasoning is needed
- **Hybrid pattern:** Flow handles greeting and caller ID; hands off to Agentforce agent for intent resolution; agent can invoke Flow-based actions
- Cost consideration: Flow execution is cheaper per interaction than LLM inference
- Audit/compliance: Flows produce deterministic, auditable logs; agent responses involve LLM variability

**Speaker Notes:** This is the architectural decision you will face on every voice implementation. The answer is almost always a hybrid: use Flow for the entry point (greeting, ANI lookup, known self-service paths) and Agentforce agents for the open-ended conversational portion. Flows are deterministic and fast; agents are intelligent and flexible. Knowing when to use each is a mark of a mature Salesforce Voice architect.

---

### Slide 7: Replacing a Legacy IVR — Migration Approach
**Visual:**
```
  BEFORE (Legacy IVR — 12 nodes, 4 levels deep)
  ┌──────────────────────────────────────────────────────────┐
  │  Main Menu: "Press 1 for Sales, 2 for Support, 3 for     │
  │  Billing, 4 for Hours..."                                │
  │       │              │              │              │     │
  │  Sales Sub      Support Sub    Billing Sub    Hours Sub  │
  │  "Press 1 New   "Press 1 Tech  "Press 1 Bal   (recorded) │
  │   2 Renewal"     2 Existing"    2 Dispute"               │
  │    │   │          │    │         │    │                  │
  │   (enter ID)    (enter ID)     (enter ID)                │
  └──────────────────────────────────────────────────────────┘
  Avg menu depth: 3-4 presses │ Abandonment: HIGH

  AFTER (Voice Flow — 5 nodes, CRM-driven branching)
  ┌──────────────────────────────────────────────────────────┐
  │  ANI Lookup ──▶ Account Found?                          │
  │                      │                                  │
  │           ┌──────────┴──────────┐                       │
  │        VIP / Known           New Caller                  │
  │           │                     │                        │
  │    Open Case? ──Yes──▶ Self-serve status                 │
  │           │                     │                        │
  │          No               Agentforce Agent               │
  │           │               handles intent                 │
  │    Agentforce Agent ──▶ routes to right queue            │
  └──────────────────────────────────────────────────────────┘
  Avg menu depth: 0-1 press │ Containment lift: 20-40%
```

**Content:**
- Step 1: Audit current IVR — map all menu paths and call volumes per path
- Step 2: Identify which paths can be eliminated with CRM data (ANI lookup, account tier)
- Step 3: Identify containable use cases (case status, store hours, appointment confirmation)
- Step 4: Build Voice Flows for self-service paths; escalation paths go to Transfer to Agent
- Step 5: A/B test — run old IVR and new Voice Flow in parallel on a subset of calls
- Key metric: containment rate improvement (target 20-40% lift is common)

**Speaker Notes:** Most legacy IVR migrations fail because they try to recreate the old menu tree in a new tool. The correct approach is to discard the menu tree and redesign from the perspective of what the caller wants. When you layer in CRM context — who they are, why they might be calling, what's currently open — you often find that 40 to 60 percent of inbound calls can be handled or at least triaged without any menu navigation at all.

---

## Recording Script

Welcome back to Course 8: Agentforce Voice. In this lecture, we are going to get hands-on with Voice Flows — the mechanism that lets you replace your legacy IVR trees with intelligent, CRM-connected voice automation.

Let me start with what is probably the most important fact for the exam and for your implementation work: not all Flow types work in a voice context. If you take nothing else from this lecture, take this — Screen Flows will never work for voice. Screen Flows require a user interface to render their screens, and a phone call has no screen. The Flow types you can use for voice are Autolaunched Flows and the Voice Call Flow subtype, which is built on top of Autolaunched Flows specifically for this purpose.

So what is a Voice Call Flow? It is an Autolaunched Flow that Salesforce activates automatically when a call arrives on a configured Voice Channel. It has access to a special set of elements that are only available in this context: the Speak element, the Get Input element, and the Transfer to Agent element.

Let me walk you through each of these.

The Speak element converts text to speech. You can write static text — "Thank you for calling Acme Corp" — or you can reference Flow variables to make it dynamic: "Thank you for calling, {!AccountName}. We have your account on file." The element uses Amazon Polly or your telephony provider's text-to-speech engine. If you want more control over how the speech sounds, you can use SSML — that is Speech Synthesis Markup Language — to add pauses, change emphasis, or control speech rate.

The Get Input element is where the conversation becomes interactive. You present a prompt to the caller and wait for a response. You can configure it to accept voice input, DTMF keypad input, or both. For voice input, you set a confidence threshold — if the caller's response does not meet that confidence level, the element can retry or fall back to a DTMF prompt. For DTMF, you set the maximum number of digits you expect. You also configure timeouts: what happens if the caller says nothing? How many times do you retry before escalating?

The Transfer to Agent element routes the call to a human agent or an Omni-Channel queue. Critically, it can pass a context payload — the account record, case record, or any data collected during the flow — so the agent's screen pops with the full customer context when they accept the call.

Now here is where Voice Flows get really powerful: branching on CRM data. The moment a call arrives, you have access to the caller's phone number, which is the ANI. You use a Record Lookup element to find the matching Contact or Account in Salesforce. Then you use a Decision element to branch based on what you find. Is this a VIP account? Route them to a priority queue and skip all menus. Do they have an open case? Read the case number aloud and offer a status update without involving any agent. Is this a new caller? Offer them account creation or general routing.

Compare this to legacy IVR. A traditional IVR has to ask callers to identify themselves because it has no data. Press 1 for English, press 2 for account balance, enter your account number, press pound. Every one of those steps is friction. With a Voice Flow, you can eliminate most of that friction entirely because you already know who is calling.

I want to address a question that always comes up: when should you use a Voice Flow versus an Agentforce autonomous voice agent? Here is the way I think about it. Use a Flow when the interaction is structured and predictable — when you know the exact questions you want to ask and the exact branches you want to take. Use an Agentforce agent when the caller's intent is open-ended and you need natural language understanding to figure out what they want. The best real-world implementations use both: a Flow for the entry point — greeting, ANI lookup, known self-service paths — and then hand off to an Agentforce agent for the conversational portion.

Finally, let us talk about migration. If you are replacing a legacy IVR, resist the temptation to recreate the old menu tree. Instead, audit your current call volumes by path, identify which paths can be eliminated with CRM data, and redesign from the caller's perspective. A well-designed Voice Flow can often reduce a twelve-node IVR tree to five nodes while simultaneously improving containment rate by twenty to forty percent.

In the next lecture, we will look at Agent Assist mode — where Agentforce works alongside a human agent to provide real-time suggestions — and how screen pop configuration brings caller context to the agent's screen automatically.

---

## Exam Tips
- Screen Flows cannot be used in voice contexts — this distinction appears frequently in scenario questions
- The Voice Call Flow subtype is built on Autolaunched Flows, not a separate Flow type
- ANI is available as `{!$Record.CallerId}` within the Voice Call Flow context
- The Transfer to Agent element can pass a context payload to the receiving agent's screen pop
- When a question asks whether to use Flow or Agentforce agent, a hybrid approach (Flow entry + agent handoff) is almost always the best answer for complex, open-ended call scenarios

---

## Lecture Summary
- Only Autolaunched Flows and the Voice Call Flow subtype work in voice contexts; Screen Flows require a UI surface
- The Voice Call Flow provides Speak, Get Input, and Transfer to Agent elements specifically for telephony interactions
- DTMF input handling is configured in the Get Input element with Max Digits, timeout, and retry settings
- ANI-based Record Lookup enables CRM-driven branching at call start, dramatically reducing menu depth
- Use Flow for structured, deterministic paths; use Agentforce agents for open-ended natural language interactions
- Legacy IVR migration should redesign from the caller's perspective, not recreate the old menu tree

---

## Mini Quiz

**Q1:** A developer wants to build an interactive voice menu that reads a caller's open case number aloud and offers them options. Which Flow type should they use?

A) Screen Flow with Voice component  
B) Autolaunched Flow with Voice Call Flow subtype  
C) Scheduled Flow triggered on VoiceCall creation  
D) Record-Triggered Flow on the Contact object  

**Answer:** B — Screen Flows require a UI surface to render and cannot be used in voice contexts. The Voice Call Flow subtype, built on Autolaunched Flows, is the correct choice and provides voice-specific elements like Speak and Get Input.

---

**Q2:** A caller's spoken response to a Get Input prompt scores below the configured confidence threshold. What is the recommended configuration to handle this gracefully?

A) Terminate the call and send an SMS  
B) Immediately transfer to an agent with no context  
C) Configure retry count and a DTMF fallback branch in the Get Input element  
D) Use a Screen Flow to display a keypad  

**Answer:** C — The Get Input element supports retry count configuration and can fall back to a DTMF prompt when voice recognition confidence is too low, providing a graceful degradation path without immediately escalating to a human agent.

---

**Q3:** An architect is designing a voice system for a telecom company. Callers may ask billing questions, request plan changes, or report outages — the intent is unpredictable. What is the recommended approach?

A) Build a deep DTMF menu covering all scenarios in a Voice Flow  
B) Use only an Agentforce autonomous voice agent with no Flow  
C) Use a Voice Flow for entry/ANI lookup, then hand off to an Agentforce autonomous agent  
D) Use a Screen Flow with an IVR component  

**Answer:** C — The hybrid approach is best for unpredictable intents. The Voice Flow handles the structured entry point (greeting, caller identification), and the Agentforce agent handles open-ended natural language understanding for diverse caller intents.
