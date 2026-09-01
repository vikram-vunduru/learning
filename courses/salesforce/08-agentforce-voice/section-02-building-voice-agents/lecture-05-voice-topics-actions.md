# Lecture 05: Voice Topics and Actions Design

## Learning Objectives
- Write Topic descriptions optimized for spoken-language intent recognition in voice channels
- Classify Agentforce Action types by voice compatibility and explain why screen UI actions cannot function in a voice context
- Configure DTMF (touch-tone) fallback actions for scenarios where speech recognition fails
- Use voice-specific Flow elements — Pause, Speak, and Transfer — to control the caller experience
- Configure speech recognition confidence thresholds and out-of-scope handling for voice agents

## Slides

### Slide 1: Why Topics Need to Be Re-Thought for Voice
**Visual:**
```
  CHAT TOPIC DESCRIPTION                    VOICE TOPIC DESCRIPTION
  ──────────────────────────────────        ──────────────────────────────────────────
  ┌────────────────────────────────┐        ┌────────────────────────────────────────┐
  │ "This topic handles customer   │        │ "Customer asks where their order is,   │
  │  requests about order status,  │        │  when it will arrive, or wants a       │
  │  shipping updates, tracking    │        │  tracking update. Common phrases:      │
  │  numbers, and delivery ETAs."  │        │  'where's my order,' 'when does it     │
  │                                │        │  arrive,' 'track my package.'"         │
  └────────────────────────────────┘        └────────────────────────────────────────┘
         │                                               │
         ▼                                               ▼
  ┌────────────────────────────────┐        ┌────────────────────────────────────────┐
  │ More formal                    │        │ Spoken, conversational phrases         │
  │ Noun-heavy / business language │        │ Verb-phrase-led / first-person         │
  │ Comprehensive coverage         │        │ Example-driven matching                │
  └────────────────────────────────┘        └────────────────────────────────────────┘

  Caller says: "hey so where's my stuff?"

  Chat topic match:  weak  (formal language → large semantic distance)
  Voice topic match: strong (example phrases → close semantic match)
```
**Content:**
- Topics in Agentforce are natural language descriptions the LLM uses to match incoming customer utterances
- Chat inputs are typed, edited, and often grammatically structured — voice inputs are spontaneous and fragmented
- Voice topic descriptions should include example spoken phrases in the first person ("I want to…", "Can you tell me…")
- Keep voice topic descriptions concise — 2–4 sentences with concrete spoken examples
- Avoid jargon and formal business terminology that callers would never actually say
- The more your topic description sounds like a real caller, the more accurately the LLM matches voice utterances
**Speaker Notes:** The core insight here is that the LLM uses topic descriptions as a semantic matching guide. If your topic says "inquiries regarding order fulfillment status and logistics tracking," but the caller says "hey where's my stuff?", the semantic distance is large. But if the topic says "customer wants to know where their order is or when it will arrive — common phrases include 'where's my stuff' or 'track my package'," the match is immediate. Emphasize example-driven descriptions for voice.

---

### Slide 2: Voice-Compatible Action Types
**Visual:**
```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│   WORKS IN VOICE [OK]     │  LIMITED / CONDITIONAL    │  NOT COMPATIBLE [NO]      │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│                           │                           │                           │
│  Flow Action              │  Prompt Template          │  Screen Flow              │
│  (autolaunched only)      │  (text-only output;       │  (renders UI elements —   │
│                           │   no rendered format)     │   no screen on a call)    │
│  Apex Action              │                           │                           │
│  (complex business logic, │  External Service         │  Lightning Component      │
│   returns text for TTS)   │  Callout (if response     │  Actions (no browser      │
│                           │  is plain text)           │  DOM in voice channel)    │
│  Knowledge Article        │                           │                           │
│  Retrieval (summarize     │                           │  Einstein Bot Handoff     │
│  as text — avoid HTML)    │                           │  (different channel)      │
│                           │                           │                           │
│  Data Cloud Query         │                           │  Email Send Actions       │
│  (text results only)      │                           │  (output is visual)       │
│                           │                           │                           │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
  Rule of thumb: if the action produces VISUAL output, it cannot work in voice
```
**Content:**
- **Flow Actions (autolaunched only):** Fully voice-compatible; execute logic, query records, and return spoken results
- **Apex Actions:** Fully voice-compatible; handle complex business logic and return text responses the TTS engine can speak
- **Screen Flows:** Incompatible — screen flows render UI elements; there is no screen in a voice call
- **Lightning Component Actions:** Incompatible — no browser DOM exists in a voice channel
- **Knowledge Retrieval:** Compatible when results are summarized as text; avoid returning raw article HTML
- Rule of thumb: if the action produces a visual output, it cannot work in voice
**Speaker Notes:** The incompatibility of Screen Flows is a major exam topic. Developers accustomed to building chat bots often default to Screen Flows for data collection (forms, dropdowns). In voice, all data collection must happen through spoken prompts and speech recognition — implemented via autolaunched Flows with Speak and Pause elements, or Apex logic. If a candidate sees a scenario where a voice agent "can't collect a customer's account number," the answer involves an autolaunched Flow with speech collection, not a Screen Flow.

---

### Slide 3: DTMF Fallback Actions
**Visual:**
```
  Agent asks question (TTS plays to caller)
        │
        ▼
  Speech Recognition attempts to capture response
        │
        ▼
  ┌─────────────────────────┐
  │  Confidence ≥ threshold?│
  └────────────┬────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼ YES           ▼ NO (low confidence or no speech detected)
                       │
  Process response     ▼
  via matched     DTMF Fallback Prompt (TTS plays):
  Topic           "I didn't catch that.
                   Press 1 for Yes
                   Press 2 for No
                   Press 0 to speak with an agent"
                       │
                       ▼
                  Caller presses key on keypad
                       │
                       ▼
  ┌────────────────────────────────────────────────┐
  │  Telephony Provider captures DTMF tone         │
  │  (Amazon Connect / Genesys / NICE CXone)       │
  └────────────────────┬───────────────────────────┘
                       │  Digit value sent to Salesforce
                       ▼
                  Salesforce processes digit → routes accordingly

  Max 3 DTMF retries recommended before escalating to human agent
```
**Content:**
- **DTMF (Dual-Tone Multi-Frequency):** Touch-tone keypad input — the beep tones generated when pressing phone number keys
- DTMF fallback provides an alternative input method when speech recognition fails or caller has background noise
- Configure DTMF actions in the Flow backing the voice agent — use telephony provider-specific Flow elements to capture keypad input
- Common DTMF patterns: Press 1 for Yes / 2 for No, Press 0 for operator/human
- DTMF is especially critical for accessibility — callers with speech impairments or heavy accents benefit from keypad alternatives
- Maximum 3 DTMF fallback retries recommended before escalating to a human agent
**Speaker Notes:** DTMF is often overlooked by developers focused purely on NLP. Frame it as a safety net: no matter how good your speech recognition is, there will always be callers whose input the system cannot process — background noise, accents, speech impediments, bad phone connections. DTMF ensures those callers aren't stuck in an endless loop of failed recognition. On the exam, DTMF questions usually appear in accessibility or error-handling scenarios.

---

### Slide 4: Voice-Specific Flow Elements
**Visual:**
```
┌────────────────────────────┐  ┌────────────────────────────┐  ┌────────────────────────────┐
│  SPEAK element             │  │  PAUSE element             │  │  TRANSFER element          │
│  [audio wave icon]         │  │  [pause button icon]       │  │  [phone + arrow icon]      │
├────────────────────────────┤  ├────────────────────────────┤  ├────────────────────────────┤
│  Message:                  │  │  Duration (seconds):       │  │  Transfer Type:            │
│  [ "Let me look that       │  │  [ 1.0              ]      │  │  [ Warm       ▼ ]          │
│    up for you..."   ]      │  │                            │  │    Warm (transcript sent)  │
│                            │  │  Purpose:                  │  │    Cold (no context)       │
│  Voice (TTS override):     │  │  [ Processing  ▼ ]         │  │                            │
│  [ Joanna          ▼ ]     │  │    Processing              │  │  Target Queue:             │
│                            │  │    Emphasis                │  │  [ Voice Human Queue  ]    │
│  SSML Enabled:             │  │    Breathing               │  │                            │
│  [ ON  ●──────── ]         │  │                            │  │  Transfer Message:         │
│                            │  │  Use after questions to    │  │  [ "Transferring you       │
│  Use for wait messages     │  │  let VAD recognize end     │  │    now..."           ]     │
│  before long queries —     │  │  of speech before          │  │                            │
│  prevents dead silence     │  │  recording begins          │  │  Must be autolaunched      │
│  on the call               │  │                            │  │  Flow type                 │
└────────────────────────────┘  └────────────────────────────┘  └────────────────────────────┘
```
**Content:**
- **Speak element:** Injects a specific TTS message at a point in the Flow, bypassing the LLM response generation for that step
- **Pause element:** Inserts a timed silence (useful after asking a question, giving callers time to think before VAD fires)
- **Transfer element:** Initiates a warm or cold transfer to an Omni-Channel queue or external number
- **Hold Music:** Configured in the telephony provider's Contact Flow, not in Salesforce Flows — it plays while Salesforce processes requests
- **Wait Messages:** Brief Speak elements ("Let me look that up for you…") that play during record queries to prevent awkward silence
- Voice Flows must be autolaunched type — triggered by the voice agent, not by user navigation
**Speaker Notes:** The Speak element is particularly important for wait messages. If your Flow does a SOQL query that takes 2 seconds, that's 2 seconds of dead silence to the caller — an eternity on a phone call. Best practice is to add a Speak element immediately before long-running operations that says something like "Bear with me for just a moment." The Pause element is subtler — it adds natural rhythm, especially after the agent asks a question, preventing the VAD from triggering before the caller has a chance to respond.

---

### Slide 5: Speech Recognition Confidence Threshold
**Visual:**
```
  Transcription Confidence Score Distribution (0.0 → 1.0)

        Low Confidence                          High Confidence
  ◀── Re-prompt / DTMF Fallback ──┤──────── Process Input ──────────▶

  0.0       0.25       0.50       0.75       1.0
  ├──────────┼──────────┼────────── ┼──────────┤
             [         ]          [           ]
              \       /            \         /
               \     /     0.75    /         \
                \   /     ───┬─── /           \
                 \_/         │    \_____________/
                             │
                    Confidence Threshold
                    (default ~0.75)

  ┌────────────────────────────────────────────────────────────────────┐
  │  Threshold Setting  │ Effect on Callers    │ Effect on Accuracy    │
  ├─────────────────────┼──────────────────────┼───────────────────────┤
  │  Too HIGH (e.g.0.90)│ Frequent re-prompts  │ High — rare misheard  │
  │                     │ Frustrated callers   │ inputs processed      │
  ├─────────────────────┼──────────────────────┼───────────────────────┤
  │  Default (~0.75)    │ Balanced experience  │ Balanced accuracy     │
  ├─────────────────────┼──────────────────────┼───────────────────────┤
  │  Too LOW (e.g. 0.50)│ Fewer re-prompts     │ Low — misheard input  │
  │                     │ Smoother experience  │ processed incorrectly │
  └─────────────────────┴──────────────────────┴───────────────────────┘
  Best practice: start at 0.75, analyze call recordings, tune in 0.05 increments
```
**Content:**
- **Confidence score:** A numerical value (0.0–1.0) returned by the speech-to-text engine indicating how certain it is of the transcription
- Default threshold in Salesforce/Amazon Connect integrations is approximately **0.75**
- Inputs below the threshold trigger the configured re-prompt or DTMF fallback action
- Threshold is configurable per-agent in the Voice channel settings or in the backing Flow logic
- Higher threshold = more accuracy but more re-prompts for difficult speakers
- Lower threshold = fewer re-prompts but higher risk of acting on misheard input
- Best practice: start at 0.75, analyze call recordings for false triggers, adjust in 0.05 increments
**Speaker Notes:** The confidence threshold is a tuning dial that requires real-world calibration. On the exam, you won't be asked to name the exact default value (it varies by implementation), but you will be asked about the trade-off: higher threshold increases accuracy at the cost of caller friction; lower threshold reduces friction at the cost of accuracy. Scenarios about "the agent is acting on the wrong information" usually point to a threshold that's too low, while "callers are constantly being asked to repeat themselves" points to a threshold that's too high.

---

### Slide 6: Hold Music and Wait Message Configuration
**Visual:**
```
  ╔═══════════════════════════════════════════════════════════════════╗
  ║  TELEPHONY PROVIDER LAYER (Amazon Connect Contact Flow)          ║
  ║                                                                   ║
  ║  ┌─────────────────────┐     ┌───────────────────────────────┐   ║
  ║  │  Hold (explicit)    │────▶│  Play Music block             │   ║
  ║  │  caller placed      │     │  (loops hold music)           │   ║
  ║  │  on hold            │     │  CONFIGURED HERE — not in SF  │   ║
  ║  └─────────────────────┘     └───────────────────────────────┘   ║
  ╚═════════════════════════════════════╤═════════════════════════════╝
                                        │
                           Audio heard  │  by caller
                                        │
  ╔═════════════════════════════════════╧═════════════════════════════╗
  ║  SALESFORCE FLOW LAYER (Autolaunched Flow)                       ║
  ║                                                                   ║
  ║  ┌──────────────────────────────┐     ┌────────────────────────┐  ║
  ║  │  Speak element               │────▶│  Get Records (SOQL)    │  ║
  ║  │  "Let me pull up your        │     │  (2-second query —     │  ║
  ║  │   account..."                │     │   prevent silence gap) │  ║
  ║  │  WAIT MESSAGE — configured   │     └────────────────────────┘  ║
  ║  │  in Salesforce Flow          │                                  ║
  ║  └──────────────────────────────┘                                  ║
  ╚═══════════════════════════════════════════════════════════════════╝

  Hold music (telephony) ≠ Wait messages (Salesforce Flow) — different systems
```
**Content:**
- **Hold music:** Configured in the telephony provider's IVR/Contact Flow — plays when the call is placed on explicit hold
- **Wait messages:** Configured in Salesforce autolaunched Flows using Speak elements — bridge processing gaps within agent responses
- Hold music cannot be managed from Salesforce Flows; it is a telephony provider responsibility
- Wait messages should be conversational: "Just a moment…" / "Let me check on that for you…"
- Avoid silence gaps longer than 2 seconds during Flow execution — always insert a Speak wait message before queries
- Hold music loops are controlled at the telephony layer; Salesforce signals the telephony provider to resume audio when processing is complete
**Speaker Notes:** The most common misconception is that wait messages and hold music are the same thing or configured in the same place. They're different: hold music is the telephony provider's responsibility and plays during explicit hold states; wait messages are Salesforce-controlled Speak elements that play during active agent processing. An exam scenario that asks "how to configure hold music for an Amazon Connect integration" requires going to the Amazon Connect Contact Flow, not the Salesforce Flow or Agentforce Studio.

---

### Slide 7: Out-of-Scope Handling in Voice Context
**Visual:**
```
  Caller Utterance
        │
        ▼
  ┌────────────────────────────────────────────────┐
  │  Einstein NLP: attempt Topic match             │
  └──────────┬─────────────────┬──────────────────┘
             │                 │
             ▼ YES             ▼ NO match
  ┌──────────────────┐         │
  │  Matched Topic   │    ┌────┴────────────────────┐
  │  → Process via   │    │  Confidence score?       │
  │    Topic Actions │    └────┬──────────────┬──────┘
  └──────────────────┘         │              │
                               ▼              ▼
                         < threshold    ≥ threshold
                         (misheard)     (truly out-of-scope —
                               │         understood but unsupported)
                               ▼               │
                     Re-prompt (max 2x)        ▼
                               │        ┌─────────────────────────────────┐
                               ▼        │  Out-of-Scope Handler           │
                     DTMF Fallback      │  Speak: "I'm not set up for     │
                               │        │  that, but here's what I can do"│
                               ▼        └────────────────┬────────────────┘
                     Escalate if still               ┌────┴────┐
                     unresolved                      ▼         ▼
                                               Transfer   Speak & Re-menu
                                               to Queue   (list options)

  Out-of-Scope Action options (Voice channel config):
  [ Speak & Transfer ▼ ]  |  Speak & Disconnect  |  Speak & Re-menu
```
**Content:**
- Out-of-scope in voice occurs when the caller's intent does not match any configured Topic AND the transcription is high-confidence
- Distinguish out-of-scope from low-confidence: out-of-scope = understood but unsupported; low-confidence = not understood
- Configure an explicit out-of-scope handler in the Voice channel settings — do not rely on the LLM to improvise
- Best practice: acknowledge the limitation verbally, then offer a clear next step (transfer, callback, or re-menu)
- Do NOT have the voice agent say "I don't understand" for out-of-scope — say "I'm not set up for that, but here's what I can do"
- Out-of-scope Topics can be monitored via Einstein Conversation Insights to identify gaps in agent coverage
**Speaker Notes:** Out-of-scope handling in voice is especially important because silence or an unhelpful response is far more painful on a phone call than in chat. In chat, a caller can try rephrasing. On a phone call, an unhelpful response with no next step often results in the caller hanging up. The distinction between "low confidence = didn't understand" and "out of scope = understood but can't help" is an exam favorite — the remediation is completely different: low confidence gets re-prompt/DTMF, out-of-scope gets a graceful acknowledgment and transfer.

---

## Recording Script

Welcome back. In this lecture, we move beyond the infrastructure of connecting your voice agent and get into the design of its intelligence — specifically, how to write Topics and build Actions that actually work well in a spoken conversation.

Here is the starting challenge: the Topics and Actions you wrote for a chat agent are probably not going to perform well in a voice channel without modification. Let me explain why.

When you write a Topic description, you're essentially writing a semantic description that the LLM uses to decide whether an incoming utterance matches that Topic. In chat, customers type things like "I would like to know the status of order number 12345." That's structured, formal, searchable. In voice, the same customer says "hey, so I placed an order last week and I'm just wondering where it is." Same intent — completely different language. If your Topic description is written in formal, business-style language, the LLM match will be weaker.

The fix is simple: write your Topic descriptions in the first person, the way a caller would actually say it. Include example phrases. "Customer wants to know where their order is or when it arrives. Common phrases: 'where's my order,' 'when does it ship,' 'I need a tracking update.'" This description is more casual, more fragmented, more human — and it will match voice utterances much more reliably.

Now let's talk about Actions. This is where voice compatibility becomes a hard constraint, not just a best practice.

Some action types simply do not work in a voice channel, and understanding why is important. Screen Flows are the biggest example. Screen Flows render visual UI elements — input fields, dropdowns, buttons. There's no screen in a phone call. There's no browser DOM, no Lightning page, nothing to render into. If you configure a Screen Flow action for a voice agent, it will either fail silently or produce an error. All data collection in voice must happen through spoken prompts and speech recognition, implemented in autolaunched Flows.

Autolaunched Flows are your workhorse for voice. They execute server-side logic, query records, call external services, and return text results that the TTS engine can speak. Two Flow elements are especially important for voice that you won't use as often in other channels: Speak and Pause.

The Speak element lets you inject a specific TTS message at any point in your Flow, bypassing the LLM's response generation. Use this for wait messages — those little phrases like "Let me pull that up for you" that you play before a record query. Without wait messages, callers hear dead silence during processing, which feels broken. A two-second silence on a phone call is an eternity.

The Pause element adds a brief timed silence. This sounds counterintuitive, but it's useful after asking the caller a question. You want to give the Voice Activity Detection system a moment to recognize that the agent has stopped talking before it starts listening for the response. A half-second pause after the agent's question prevents false VAD triggers.

Let's talk about DTMF. That stands for Dual-Tone Multi-Frequency — the technical name for touch-tone keypad input. When speech recognition fails — and it will fail sometimes, due to background noise, accents, or bad connections — DTMF gives callers a keyboard fallback. "Press 1 for yes, press 2 for no, press 0 for a representative." Configure DTMF fallback in your autolaunched Flows, triggered when the speech recognition confidence score falls below your configured threshold.

Speaking of confidence thresholds — the speech recognition engine returns a confidence score from 0.0 to 1.0 with every transcription. If the score is below your threshold, the system knows it probably misheard the caller and triggers a re-prompt or DTMF fallback. The default threshold is around 0.75. Too high and you'll frustrate callers with constant re-prompts. Too low and you'll act on misheard input. Start at 0.75 and tune based on call recording analysis.

Finally, out-of-scope handling. This is different from low-confidence handling. Low confidence means the system didn't understand what was said. Out-of-scope means the system understood perfectly — but the intent doesn't match any of your configured Topics. When that happens, don't leave the caller hanging with a vague "I can't help with that." Give them a verbal acknowledgment and a clear path forward: a transfer, a callback number, or a re-menu of available options. Monitor out-of-scope utterances using Einstein Conversation Insights — they're your roadmap for expanding agent coverage over time.

---

## Exam Tips
- **Screen Flows are incompatible with voice agents** — any scenario where data collection fails in a voice agent should be resolved by replacing the Screen Flow with an autolaunched Flow using voice-specific elements
- Distinguish **DTMF fallback** (for low speech recognition confidence / failed input) from **out-of-scope handling** (for recognized but unsupported intents) — they are configured differently and solve different problems
- Voice topic descriptions should be written in **conversational, first-person language** with example spoken phrases — not formal business terminology
- **Hold music** is configured at the telephony provider layer (Amazon Connect Contact Flow, Genesys script); **wait messages** are configured via Speak elements in Salesforce autolaunched Flows
- A confidence threshold that is **too low** causes the agent to act on misheard input; **too high** causes excessive re-prompts — the exam may present either as a symptom and ask for the fix

---

## Lecture Summary
- Voice Topic descriptions must use conversational, example-driven language to match fragmented spoken utterances accurately
- Only autolaunched Flows, Apex Actions, and data retrieval Actions are compatible with voice; Screen Flows and component-rendering Actions are incompatible
- DTMF fallback Actions provide a touch-tone alternative when speech recognition confidence falls below the configured threshold
- Voice-specific Flow elements include Speak (TTS injection), Pause (timed silence), and Transfer (warm/cold escalation)
- Speech recognition confidence thresholds balance accuracy against caller friction — default is approximately 0.75; tune in 0.05 increments
- Out-of-scope handling should provide a verbal acknowledgment and a clear next step; out-of-scope gaps can be identified using Einstein Conversation Insights

---

## Mini Quiz

**Q1:** A voice agent is configured with a Flow that uses a Screen Flow subflow to collect a caller's account number. Callers report that the agent goes silent and eventually disconnects during this step. What is the correct fix?
A) Increase the silence timeout threshold in the Voice channel settings
B) Replace the Screen Flow subflow with an autolaunched Flow that uses voice prompts to collect the account number
C) Add a DTMF fallback action to the Screen Flow
D) Enable barge-in so callers can speak their account number over the silence

**Answer:** B — Screen Flows render visual UI elements and are incompatible with voice channels. The correct replacement is an autolaunched Flow that uses Speak elements to prompt the caller and captures their spoken response via speech recognition.

---

**Q2:** A voice agent frequently processes incorrect information because it mishears callers. Call recordings show that the speech recognition engine is returning confidence scores around 0.55 for these inputs. What is the appropriate configuration change?
A) Lower the confidence threshold to 0.40 to accept more inputs
B) Raise the confidence threshold to 0.80 so inputs below that level trigger re-prompts or DTMF fallback
C) Disable speech recognition and rely exclusively on DTMF input
D) Add more Topic descriptions to cover the misheard variants

**Answer:** B — A confidence score of 0.55 is below the typical threshold of 0.75, meaning these low-quality inputs are being processed when they should trigger re-prompts or DTMF fallback. Raising the threshold to 0.80 will ensure unreliable transcriptions are rejected and re-prompted.

---

**Q3:** Where should hold music for an Agentforce Voice agent on Amazon Connect be configured?
A) In the Agentforce Studio Voice channel card under "Hold Music"
B) In the Salesforce autolaunched Flow using a Speak element
C) In the Amazon Connect Contact Flow using a "Play Prompt" or media block
D) In the Omni-Channel routing configuration under Queue Settings

**Answer:** C — Hold music is a telephony provider responsibility and must be configured in Amazon Connect's Contact Flow (or equivalent in Genesys/NICE). It is not configurable from within Salesforce Flows or Agentforce Studio.
