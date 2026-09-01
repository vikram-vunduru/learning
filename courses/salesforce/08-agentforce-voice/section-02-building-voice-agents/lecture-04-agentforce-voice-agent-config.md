# Lecture 04: Agentforce Voice Agent Configuration

## Learning Objectives
- Identify the steps required to enable an existing Agentforce agent for voice interactions in Agentforce Studio
- Distinguish the Voice channel type from other channel types in agent setup and explain its unique behavioral requirements
- Describe the behavioral differences between voice agents and chat agents, including silence handling, interruptions, and turn-taking
- Configure voice persona settings including TTS voice selection and persona name
- Explain how Omni-Channel routing connects inbound phone calls to an Agentforce Voice agent and configure the human agent fallback path

## Slides

### Slide 1: From Chat Agent to Voice Agent — What Changes
**Visual:**
```
┌───────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│ Behavior                  │ Chat Agent                   │ Voice Agent                  │
├───────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Input method              │ Typed text (keyboard)        │ Transcribed speech (STT)     │
│ Response length           │ Long-form, formatted text    │ Short, conversational spoken │
│                           │ acceptable                   │ sentences only               │
│ Latency expectation       │ Seconds acceptable           │ Near-real-time (<1s ideal)   │
│ Error recovery            │ Ask caller to rephrase text  │ Re-prompt or DTMF fallback   │
│ Channel type label        │ Messaging / Web / Email      │ Voice                        │
│ Markdown / formatting     │ Supported                    │ Not supported — all output   │
│                           │                              │ becomes spoken audio         │
└───────────────────────────┴──────────────────────────────┴──────────────────────────────┘
  Note: The underlying reasoning engine (Atlas LLM + Topics/Actions) does NOT change —
  only the input/output modality and behavioral guardrails change for voice.
```
**Content:**
- Agentforce agents built in Agentforce Studio are channel-agnostic by default
- Adding a Voice channel transforms how the agent sends and receives information
- Voice agents receive transcribed text as input instead of typed messages
- Voice agents must produce spoken-language output — short, conversational sentences rather than formatted lists
- Latency requirements are tighter: customers expect near-real-time speech responses
**Speaker Notes:** Emphasize that the agent's underlying reasoning engine (the LLM and Topics/Actions framework) does not change. What changes is the input/output modality and a set of behavioral guardrails that Salesforce enforces on voice agents. Candidates often underestimate how much the spoken medium changes the design requirements. Draw the analogy: the same person communicates very differently in a text message vs. a phone call.

---

### Slide 2: Adding the Voice Channel Type in Agentforce Studio
**Visual:**
```
  Agentforce Studio → [Agent Name] → Channels tab
  ┌─────────────────────────────────────────────────────────────────────┐
  │  CHANNELS                                           [+ Add Channel] │
  ├─────────────────────────────────────────────────────────────────────┤
  │  Add Channel Type:  [ Voice                              ▼ ]        │
  │                       Messaging                                     │
  │                       Email                                         │
  │                     ▶ Voice  ◀ (highlighted)                        │
  │                       Web                                           │
  ├─────────────────────────────────────────────────────────────────────┤
  │  VOICE CHANNEL CONFIGURATION                                        │
  │                                                                     │
  │  Connected Telephony:  [ Amazon Connect               ▼ ]          │
  │                          Amazon Connect                             │
  │                          Genesys Cloud CX                           │
  │                          NICE CXone                                 │
  │                                                                     │
  │  Omni-Channel Flow:    [ VoiceAgentFlow                      ]      │
  │                                                                     │
  │  Enable Agentforce Voice:  [ ON  ●────────── ]                      │
  │                              (must be ON for calls to route here)   │
  └─────────────────────────────────────────────────────────────────────┘
  Path: Agentforce Studio → agent → Channels → Add Channel → Voice
```
**Content:**
- Navigate to Agentforce Studio → select the agent → open the **Channels** tab
- Click **Add Channel** and select **Voice** from the channel type list
- Link the agent to the telephony integration configured in Service Cloud Voice setup
- One agent can support multiple channels, but voice-specific settings only appear on the Voice channel card
- The Voice channel must be activated (toggled ON) before calls can be routed to the agent
**Speaker Notes:** Students should know the navigation path cold — Agentforce Studio → agent → Channels → Voice. On the exam, distractors often include "Service Cloud Console" or "Contact Center Admin" as the location for this configuration; it is done in Agentforce Studio. Connecting to the telephony integration is a prerequisite step that must be completed in Service Cloud Voice before the Voice channel can be saved.

---

### Slide 3: Voice vs. Chat Behavioral Differences
**Visual:**
```
┌──────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│ Behavior                 │ Chat Agent                   │ Voice Agent                  │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Silence Handling         │ ✗ Not applicable              │ ✓ Detects silence (~3s       │
│                          │   (customer just waits)       │   default), triggers re-     │
│                          │                               │   prompt or disconnect       │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Interruption (Barge-in)  │ ✗ Not applicable              │ ✓ Caller can speak over TTS; │
│                          │   (send button controls turn) │   agent pauses + processes   │
│                          │                               │   new input immediately      │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Turn-Taking              │ Triggered by "Send" button   │ Voice Activity Detection      │
│                          │                               │ (VAD) detects end of speech  │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Response Format          │ ✓ Markdown, bullets, lists,  │ ✗ Plain spoken language only  │
│                          │   URLs, numbered lists OK     │   No markdown, no URLs       │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Error Recovery           │ Ask to rephrase via text     │ Re-prompt + DTMF fallback     │
└──────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```
**Content:**
- **Silence handling:** Voice agents detect silence thresholds (configurable, default ~3 seconds) and prompt the caller — chat agents have no equivalent
- **Interruption handling:** Callers can speak over the agent mid-sentence (barge-in); voice agents pause TTS output and process the new input immediately
- **Turn-taking:** Voice relies on end-of-speech detection (VAD — Voice Activity Detection); chat relies on the "Send" button press
- **Response format:** Voice agents must avoid markdown, bullet points, numbered lists, URLs, and emojis — all output becomes spoken audio
- **Error recovery:** Misheard words require re-prompting strategies; chat agents can ask for clarification via text
**Speaker Notes:** The three most exam-relevant concepts on this slide are barge-in, silence threshold, and the prohibition on markdown in voice responses. Explain barge-in with a real-world analogy: if a caller hears the agent saying "I can help you with…" and immediately says "Cancel my order," the agent stops speaking and processes the new utterance. Silence threshold misconfiguration is a common troubleshooting question — setting it too low causes false triggers, too high causes awkward pauses.

---

### Slide 4: Configuring the Voice Persona
**Visual:**
```
  Voice Channel Card → Persona Settings
  ┌──────────────────────────────────────────────────────────────┐
  │  VOICE PERSONA                                               │
  ├──────────────────────────────────────────────────────────────┤
  │  Persona Name:   [ Aria                              ]       │
  │                    ↑ Must match agent LLM system prompt name │
  │                                                              │
  │  TTS Provider:   [ Amazon Polly                     ▼ ]     │
  │                    (options depend on telephony partner)     │
  │                                                              │
  │  TTS Voice:      [ Joanna (US English, Female)      ▼ ]     │
  │                    Joanna                                    │
  │                    Matthew                                   │
  │                    Ivy                                       │
  │                                                              │
  │  Speech Rate:    0.8x ──────●──────────── 1.2x              │
  │                             1.0x (default)                   │
  │                                                              │
  │  Pitch:          Low  ───────────●──────── High             │
  │                                  Normal                      │
  │                                                              │
  │                         [ Play Sample ]                      │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- The **Voice Persona** defines how the agent presents itself to callers verbally
- **Persona Name:** The name the agent uses to introduce itself ("Hi, I'm Aria…")
- **TTS Voice:** Select from voices provided by the telephony integration's TTS engine (e.g., Amazon Polly voices like Joanna, Matthew)
- **Speech Rate and Pitch:** Fine-tune naturalness and intelligibility for the customer base
- Persona configuration is per-channel — a single agent can have different personas for different voice channels (e.g., different brands)
- Persona name must align with the agent's LLM system prompt instructions to ensure consistent self-identification
**Speaker Notes:** Remind students that TTS voice availability depends on the connected telephony provider. Amazon Connect uses Amazon Polly; Genesys and NICE CXone integrate their own TTS engines. The exam may present a scenario where a customer complains the agent uses the wrong name — the fix is in Persona Name, not the LLM system prompt alone. Both must be consistent.

---

### Slide 5: Routing Voice Calls via Omni-Channel
**Visual:**
```
  Inbound Call (PSTN)
        │
        ▼
  ┌──────────────────────────────────────┐
  │  Telephony Provider                  │
  │  (Amazon Connect / Genesys / NICE)   │
  │  Contact Flow / IVR                  │
  └──────────────────────┬───────────────┘
                         │  Work item routed via streaming API
                         ▼
  ┌──────────────────────────────────────┐
  │  Salesforce Omni-Channel             │
  │  Routing type: Agent (bot)           │
  │  Bot capacity unit consumed          │
  └──────────────────────┬───────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────┐
  │  Agentforce Voice Agent              │
  │  (handles call autonomously)         │
  └──────────────────────┬───────────────┘
                         │
            ┌────────────┴─────────────┐
            │                          │
            ▼                          ▼
  Resolved — call ends       "Agent cannot resolve" /
                              customer requests human
                                       │
                                       ▼
                            ┌──────────────────────────────┐
                            │  Omni-Channel Human Queue    │
                            │  (warm transfer with         │
                            │   transcript passed through) │
                            └──────────────────────────────┘

  Config locations:
    Telephony IVR logic  → Amazon Connect Contact Flow / Genesys script
    Omni-Channel routing → Salesforce Omni-Channel Setup
    Agent selection      → Agentforce Studio → Channels → Voice
```
**Content:**
- Calls arrive at the telephony provider and pass through an IVR/Contact Flow before reaching Salesforce
- In Salesforce, **Omni-Channel** receives the work item and routes it based on routing configuration
- To route to an Agentforce agent, set the Omni-Channel routing type to **Agent** and select the Agentforce agent
- Agentforce Voice agents occupy a **bot queue** capacity unit in Omni-Channel — not a human agent slot
- Routing rules can be conditional (e.g., route to agent during business hours, queue to human after hours)
**Speaker Notes:** Many candidates confuse where the routing configuration lives. The telephony provider handles the initial IVR logic; Salesforce Omni-Channel handles the queue and assignment logic. Agentforce Voice agents consume Omni-Channel capacity, which means they count against Omni-Channel presence capacity limits. On the exam, watch for questions asking whether a voice agent "takes up a human agent license" — the answer is no; they use a distinct bot capacity unit.

---

### Slide 6: Configuring Human Agent Fallback
**Visual:**
```
  ┌──────────────────────────────────────────┐
  │         Agentforce Voice Agent           │
  │         (handling call)                  │
  └──────────────────────────────────────────┘
      │               │                  │
      ▼               ▼                  ▼
  (1) Customer    (2) Max turns      (3) Out-of-scope
  says "speak     limit exceeded         intent
  to an agent"    (default: 20)     (unresolvable)
      │               │                  │
      └───────────────┴──────────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │  Omni-Channel Human Queue  │
          │  (Fallback Queue)          │
          │                            │
          │  Warm transfer: transcript │
          │  passed to human agent     │
          │                            │
          │  Cold transfer: no context │
          │  passed (not recommended)  │
          └────────────────────────────┘

  Configuration (Voice Channel card — Agentforce Studio):
  ┌─────────────────────────────────────────────────────┐
  │  Max Conversation Turns:   [ 20         ]           │
  │  Fallback Queue:           [ Voice Human Queue  ]   │
  │  Transfer Type:            [ Warm       ▼ ]         │
  │  Escalation Trigger Phrases:                        │
  │  [ "speak to an agent", "transfer me", "human" ]    │
  └─────────────────────────────────────────────────────┘
```
**Content:**
- **Fallback Queue:** A mandatory configuration — specifies the Omni-Channel queue to transfer to when escalation is triggered
- **Escalation triggers:** Customer phrases ("speak to an agent", "transfer me"), max turn limit exceeded, unresolvable out-of-scope intents
- **Warm transfer vs. cold transfer:** Warm transfer passes the conversation transcript to the human agent; cold transfer drops context
- Best practice: Always enable warm transfer so the human agent sees what the voice agent already discussed
- Voice agents must have at least one fallback path configured — Salesforce will warn if the Fallback Queue is empty
**Speaker Notes:** Warm transfer is a critical exam concept. When a warm transfer occurs, the post-call transcript and Einstein conversation summary are made available to the accepting human agent in the Service Console. Cold transfer means the human agent starts blind. The exam frequently presents scenarios where a human agent reports "not knowing what the customer already told the bot" — the fix is enabling warm transfer, not adding more Topics to the voice agent.

---

### Slide 7: Agent-Level Voice Settings Summary
**Visual:**
```
┌────────────────────────────────────┬────────────────────────────────────────────────┐
│ Setting                            │ Where Configured                               │
├────────────────────────────────────┼────────────────────────────────────────────────┤
│ Voice Channel (add channel type)   │ Agentforce Studio → agent → Channels tab       │
│ Telephony Integration link         │ Service Cloud Voice Setup (prerequisite)        │
│ TTS Persona (name + voice)         │ Voice Channel card → Persona Settings           │
│ Omni-Channel Routing               │ Omni-Channel Setup → Routing Configuration      │
│ Fallback Queue                     │ Voice Channel card → Escalation section         │
│ Max Conversation Turns             │ Voice Channel card → Escalation section         │
│ Barge-in Enabled                   │ Voice Channel card → Behavioral Settings        │
│ Silence Timeout (default 3s)       │ Voice Channel card → Behavioral Settings        │
└────────────────────────────────────┴────────────────────────────────────────────────┘
  Note: All settings are agent-version-specific — changes create a new draft version
  that must be published before taking effect.
```
**Content:**
- Voice-specific settings are consolidated in the **Voice channel card** within Agentforce Studio
- Telephony integration is a Service Cloud Voice prerequisite — not configured in Agentforce Studio
- Barge-in is enabled by default; disabling it can cause callers to feel unheard
- Silence timeout (default 3s) triggers a re-prompt action before the agent disconnects
- Max turns limits prevent runaway conversations from consuming telephony resources indefinitely
- All settings are agent-version-specific — changing them creates a new draft version, not a live change
**Speaker Notes:** Wrap up the slide by emphasizing that voice agent configuration is a checklist — the exam may present an incomplete configuration scenario and ask which setting is missing. The most commonly missed setting in exam scenarios is the Fallback Queue, followed by the TTS Persona Name. Also note that changes to voice settings require republishing the agent version, just like changes to Topics or Actions.

---

## Recording Script

Welcome to Lecture 4, where we take an Agentforce agent you've already built and configure it to handle real phone calls.

Let's start with the fundamental question: if an Agentforce agent already works in a chat channel, what does it take to make it work on the phone? The short answer is — more than you'd expect. While the reasoning engine underneath stays the same, the way customers communicate over a phone call is fundamentally different from typing in a chat window. Customers speak in fragments, they interrupt themselves, they expect instant responses, and they can't see anything you'd normally put in a nicely formatted message.

So the first thing to understand is that enabling voice isn't just flipping a switch. It's a configuration effort that touches channel setup, routing, persona, escalation, and behavioral tuning.

Let's walk through it step by step.

You start in Agentforce Studio. Find your agent, click into it, and go to the **Channels** tab. You'll see a button to add a new channel. Select **Voice**. Immediately, you'll notice the Voice channel has a different set of fields than a Messaging or Email channel. The first critical field is the connected telephony integration — this links your agent to the Service Cloud Voice setup your admin already completed. Without this link, your agent has no way to receive audio.

Once the telephony integration is connected, you'll see the persona settings. This is where you name your agent — the name it uses when it picks up and says "Hi, I'm Aria, how can I help you today?" You also select a TTS voice from your telephony provider's library. Amazon Connect, for example, uses Amazon Polly voices. You can hear samples and choose one that fits your brand. The speech rate and pitch sliders let you fine-tune so the voice sounds natural, not robotic.

Now here's something that trips up a lot of developers: the persona name in the voice channel card must match what you put in the agent's LLM instructions. If the persona card says "Aria" but the system prompt says "I am Max, a Salesforce assistant," your caller will hear "Hi, I'm Max" from the LLM but the channel config calls it Aria. Keep them in sync.

Next, let's talk about behavioral differences between voice and chat. The biggest one is barge-in. In a chat window, if the agent is "typing" a response, the customer patiently waits. On a phone call? If a customer has something to say, they're going to say it — right in the middle of your agent's sentence. Barge-in support means the TTS output stops immediately and the agent processes what the customer just said. This is enabled by default, and you should leave it on unless you have a very specific reason to disable it.

Second behavioral difference: silence handling. After the customer stops talking, the agent uses Voice Activity Detection to determine when they're done. But what if the customer goes quiet because they're thinking, or because they got distracted? By default, after about three seconds of silence, the agent plays a re-prompt — something like "I'm still here, take your time." If the silence continues, the agent eventually offers to transfer to a human or end the call. You can tune this timeout in the Voice channel settings.

Third: response format. This one is critical. Voice agents absolutely cannot use markdown. No bullet points, no asterisks, no numbered lists, no URLs. Everything the agent says becomes spoken audio. A response like "Here are your options:\n1. Billing\n2. Technical Support" sounds terrible when spoken aloud. Your agent's instructions and Topics need to explicitly tell it to respond in natural, conversational spoken language.

Now let's look at routing. Once the Voice channel is configured, you need to wire it into Omni-Channel. In Omni-Channel Setup, you create a routing configuration that points to your Agentforce agent rather than a human agent queue. Voice agents consume what's called a bot capacity unit — not a human agent license. This is an important distinction. Your voice agents can handle hundreds of simultaneous calls without occupying human agent slots.

Finally, let's cover fallback. Every voice agent must have a fallback queue configured. This is the Omni-Channel queue where the call transfers if the agent can't resolve the issue, the customer asks for a human, or the conversation exceeds the max turns limit. Best practice is to configure warm transfer so that when the human agent picks up, they see a full transcript of everything the voice agent already discussed. This prevents the frustrating experience of customers having to repeat themselves.

To recap: enabling voice requires channel setup in Agentforce Studio, telephony integration linking, persona configuration, Omni-Channel routing setup, and fallback queue configuration. Every one of these is required for a production-ready voice agent. Miss one and you'll have calls failing, misrouting, or landing on human agents without context.

---

## Exam Tips
- The Voice channel type is configured in **Agentforce Studio** under the agent's Channels tab — not in Service Cloud Voice Setup or Omni-Channel directly
- Warm transfer (not cold transfer) is the best-practice escalation method because it passes the conversation transcript to the accepting human agent
- Barge-in is **enabled by default** — exam scenarios about callers being unable to interrupt the agent point to barge-in being disabled, not a Topic configuration issue
- TTS voice selection options depend on the **connected telephony provider** — Amazon Connect uses Amazon Polly; Genesys and NICE use their own TTS engines
- Changing any voice agent setting creates a new **draft version** that must be published — changes are not immediately live

---

## Lecture Summary
- An existing Agentforce agent is enabled for voice by adding a Voice channel type in the Channels tab of Agentforce Studio
- Voice agents differ from chat agents in four key areas: silence handling, barge-in (interruption), turn-taking via VAD, and the requirement for spoken-language-only output
- The Voice Persona configures the agent's spoken name and TTS voice selection; persona name must be consistent with the LLM system prompt
- Inbound calls are routed to the voice agent through Omni-Channel, where the agent consumes a bot capacity unit (not a human agent license)
- A mandatory Fallback Queue must be configured; warm transfer ensures the human agent receives the conversation transcript
- All voice settings are version-specific and require agent republication to take effect

---

## Mini Quiz

**Q1:** A developer configures a new Voice channel in Agentforce Studio but the agent's persona keeps introducing itself with a different name than the Persona Name field shows. What is the most likely cause?
A) The TTS voice provider does not support custom names
B) The agent's LLM system prompt instructions contain a conflicting name
C) The Omni-Channel routing configuration overrides the persona name
D) Barge-in is disabled, preventing name updates from taking effect

**Answer:** B — The Persona Name in the Voice channel card and the agent's LLM instructions must both be consistent. If the system prompt says "I am Max" but the Persona card says "Aria," the LLM-generated greeting will say "Max."

---

**Q2:** Which Omni-Channel resource does an Agentforce Voice agent consume when it handles a call?
A) A standard human agent license
B) A Service Cloud Voice license for each concurrent call
C) A bot capacity unit, separate from human agent slots
D) No Omni-Channel resource — voice agents bypass Omni-Channel entirely

**Answer:** C — Agentforce Voice agents consume bot capacity units in Omni-Channel, not human agent slots. This allows high-volume simultaneous call handling without using human agent licenses.

---

**Q3:** A caller reports that every time they try to interrupt the agent mid-sentence, the agent continues speaking and does not respond to what the caller said. What configuration change resolves this?
A) Increase the silence timeout threshold
B) Reduce the max conversation turns limit
C) Enable barge-in on the Voice channel settings
D) Add an escalation trigger phrase for the caller's words

**Answer:** C — Barge-in support allows callers to speak over the TTS output and have the agent immediately process the new input. If callers cannot interrupt, barge-in has been disabled and needs to be re-enabled.
