# Lecture 01: Agentforce Voice Overview

## Learning Objectives

- Describe what Agentforce Voice is and how it extends Agentforce autonomous agents to the phone channel
- Distinguish Agentforce Voice from legacy Salesforce CTI (Open CTI) and explain why the distinction matters
- Identify the three layers of the Agentforce Voice architecture — Salesforce platform, telephony partner, and Agentforce agent
- Compare autonomous voice bot mode with real-time agent assist mode and select the appropriate mode for a given business scenario
- Define key voice AI terminology: utterance, transcription, NLP intent, and routing

---

## Slides

### Slide 1: What Is Agentforce Voice?

**Visual:**
```
┌──────────────────┐     ┌───────────────────────────┐     ┌──────────────────────┐
│    Customer      │────▶│     Telephony Partner     │────▶│     Salesforce       │
│  (Phone / PSTN)  │     │  Amazon Connect /         │     │   Service Cloud      │
└──────────────────┘     │  Genesys / NICE CXone     │     │       Voice          │
                         └───────────────────────────┘     └──────────┬───────────┘
                                                                      │
                                                                      ▼
                                                           ┌──────────────────────┐
                                                           │     Agentforce       │
                                                           │       Agent          │
                                                           │   (AI Reasoning)     │
                                                           └──────────────────────┘

          Phone call ──────────▶ Telephony Partner ──────────▶ Salesforce ──────▶ Agentforce
```

**Content:**
- Agentforce Voice is Salesforce's AI-powered voice experience for Service Cloud
- It connects phone calls — inbound or outbound — to the Agentforce autonomous agent platform
- Agents can handle calls fully autonomously OR assist human agents with real-time suggestions
- Built on top of Service Cloud Voice, which Salesforce launched in 2020 and has continued to expand
- Requires a supported telephony partner — Salesforce does not provide phone network infrastructure

**Speaker Notes:** Start by anchoring students to what they already know. If they have completed Course 7, they know what an Agentforce agent is. The key insight here is that the same agent they built for chat or email can now operate over a phone call. The telephony partner acts as the bridge — it converts voice audio into a signal Salesforce can work with. Spend time on the three-layer model because exam questions will test whether students know which layer handles which responsibility.

---

### Slide 2: How Agentforce Voice Differs from Open CTI

**Visual:**
```
┌──────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│ Attribute                │ Open CTI (Legacy)             │ Agentforce Voice (Current)   │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Intelligence             │ None — display only           │ AI-powered reasoning (Atlas) │
│ Transcription            │ None                          │ Real-time (Contact Lens)     │
│ Agent Assist             │ None                          │ Yes — live AI suggestions    │
│ Autonomous Handling      │ None                          │ Yes — full voice bot mode    │
│ Data Flow                │ Call metadata only            │ Live audio transcript + AI   │
└──────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

**Content:**
- **Open CTI** is a JavaScript API that embeds a softphone widget in the Salesforce UI — it does not process call audio or provide AI
- **Open CTI** requires the telephony provider to supply all intelligence; Salesforce is just the CRM display layer
- **Agentforce Voice** streams real-time audio transcription into Salesforce, where the Einstein AI layer can act on it
- **Agentforce Voice** can surface AI-suggested responses to human agents (agent assist) or handle the entire call autonomously
- You can still use Open CTI for basic click-to-dial and screen pop if you do not need AI capabilities — but Agentforce Voice replaces it in AI-enabled deployments

**Speaker Notes:** Many students in this course have configured Open CTI before. It is important to frame Agentforce Voice as an architectural upgrade, not a patch. Open CTI is still a valid tool for basic telephony integration, but it has no awareness of the conversation content. Agentforce Voice changes that fundamentally — the platform now "hears" the call. An exam question may describe a customer who says "we already have a softphone" and ask you to identify what would change if they added Agentforce Voice.

---

### Slide 3: Voice Channel Architecture — Three Layers

**Visual:**
```
╔═══════════════════════════════════════════════════════════════╗
║               TIER 1 — TELEPHONY NETWORK                     ║
║        SIP / PSTN  ·  Telephony Partner Cloud                ║
║   (Amazon Connect / Genesys Cloud CX / NICE CXone)           ║
╚═══════════════════════════╤═══════════════════════════════════╝
                            │
                     ◀─────▶│  Audio stream + Transcript feed
                            │
╔═══════════════════════════╧═══════════════════════════════════╗
║               TIER 2 — SERVICE CLOUD VOICE                   ║
║    Voice Call Record  ·  Real-time Transcript                ║
║                  Omni-Channel Routing                        ║
╚═══════════════════════════╤═══════════════════════════════════╝
                            │
                     ◀─────▶│  Transcript text + Context
                            │
╔═══════════════════════════╧═══════════════════════════════════╗
║               TIER 3 — AGENTFORCE PLATFORM                   ║
║     Agentforce Agent  ·  Atlas Reasoning Engine              ║
║                  Einstein Trust Layer                        ║
╚═══════════════════════════════════════════════════════════════╝
```

**Content:**
- **Tier 1 — Telephony Network:** The phone call originates here. The telephony partner (e.g., Amazon Connect) receives the call, handles PSTN connectivity, and streams audio to Salesforce via an API
- **Tier 2 — Service Cloud Voice:** Salesforce creates a Voice Call record, generates a real-time transcript, and routes the interaction through Omni-Channel to the correct queue or agent
- **Tier 3 — Agentforce Platform:** The Agentforce agent receives the transcript, reasons via the Atlas Reasoning Engine, takes actions (look up records, update cases, search knowledge), and either responds autonomously or surfaces suggestions to a human agent
- Data flows both ways: Salesforce sends context to the telephony layer (e.g., customer authentication result), and the telephony layer streams audio back to Salesforce

**Speaker Notes:** This three-layer model is the most architecturally important concept in the course. When exam questions ask "where does transcription happen" the answer is Service Cloud Voice (Tier 2), not the telephony partner and not Agentforce. When questions ask "where does AI reasoning happen" the answer is the Agentforce platform (Tier 3). Encourage students to draw this diagram from memory — it underpins every configuration decision in the rest of the course.

---

### Slide 4: Autonomous Voice Bot vs. Agent Assist Mode

**Visual:**
```
┌───────────────────────────────────┬───────────────────────────────────┐
│       AUTONOMOUS VOICE BOT        │           AGENT ASSIST            │
│         [ AI handles all ]        │       [ Human + AI together ]     │
├───────────────────────────────────┼───────────────────────────────────┤
│                                   │                                   │
│  Caller speaks                    │  Call arrives                     │
│       │                           │       │                           │
│       ▼                           │       ▼                           │
│  AI understands intent            │  Human agent answers              │
│       │                           │       │                           │
│       ▼                           │       ▼                           │
│  AI takes action + responds       │  AI listens to live transcript    │
│       │                           │  and surfaces suggestions         │
│       ▼                           │       │                           │
│  Resolve or escalate to human     │       ▼                           │
│                                   │  Human acts on AI suggestions     │
├───────────────────────────────────┼───────────────────────────────────┤
│  Best for: high-volume,           │  Best for: complex, sensitive,    │
│  repetitive, well-defined tasks   │  or high-stakes interactions      │
│  (order status, password reset,   │  where human judgment is          │
│  appointment scheduling)          │  required                         │
└───────────────────────────────────┴───────────────────────────────────┘
```

**Content:**
- **Autonomous Voice Bot:** The Agentforce agent handles the entire call without a human agent. The caller speaks to an AI that understands natural language, executes actions (e.g., look up order status, reset password, file a complaint), and resolves the call or escalates to a human only when needed
- **Agent Assist:** A human agent takes the call. The Agentforce agent operates in the background, listening to the live transcript and proactively suggesting responses, surfacing relevant knowledge articles, or updating fields on the case record
- Both modes use the same underlying Agentforce agent configuration — the difference is deployment mode (autonomous channel vs assist overlay)
- Autonomous mode is best for high-volume, repetitive inquiries (order status, account balance, appointment scheduling)
- Agent Assist mode is best for complex or sensitive calls where a human must remain in control

**Speaker Notes:** Students often ask whether you need two separate agents for these two modes. The answer is generally no — the same agent can be configured for different deployment contexts. However, the Topics and Actions you expose in autonomous mode should be scoped more carefully because the agent will act without human oversight. This is a good opportunity to preview the Einstein Trust Layer discussion later in the lecture — autonomous voice calls must have appropriate data-access guardrails in place.

---

### Slide 5: Voice Use Cases

**Visual:**
```
┌──────────────────────────────────┬──────────────────────────────────┐
│  1. Inbound Customer Service     │  2. Outbound Follow-Up           │
│                                  │                                  │
│  Caller → AI resolves or routes  │  AI places outbound calls for    │
│  instead of waiting in queue     │  reminders, alerts, surveys      │
├──────────────────────────────────┼──────────────────────────────────┤
│  3. IVR Replacement              │  4. Appointment Reminders        │
│                                  │                                  │
│  "Say what you need" replaces    │  AI calls patient/customer,      │
│  "Press 1 for Billing"           │  confirms or reschedules         │
├──────────────────────────────────┼──────────────────────────────────┤
│  5. Self-Service: Balance /      │  6. Post-Call Summarization      │
│     Order Status                 │                                  │
│  AI looks up + speaks account    │  AI auto-generates call summary  │
│  data — no human needed          │  to Voice Call record            │
└──────────────────────────────────┴──────────────────────────────────┘
```

**Content:**
- **Inbound customer service:** The most common use case — callers reach Agentforce Voice instead of waiting for a human agent; the AI resolves or routes
- **Outbound follow-up:** Agentforce Voice places outbound calls (e.g., appointment reminders, payment alerts, survey calls) and handles customer responses autonomously
- **IVR replacement:** Traditional IVRs use press-1/press-2 menus; Agentforce Voice replaces these with natural language understanding — callers say what they want
- **Agent Assist on live calls:** Human agents receive real-time suggestions, reducing handle time and improving first-call resolution
- **Post-call summarization:** After every call, the Einstein AI layer generates a call summary and populates the Voice Call record — no manual wrap-up notes required
- **Einstein Conversation Mining:** Analyzes aggregated call transcripts to identify trending topics, complaint patterns, and automation opportunities

**Speaker Notes:** When students see "IVR replacement" they should immediately think "NLP intent classification" — that is the mechanism that makes it work. The caller's spoken words are transcribed and run through intent detection to determine what they want. Exam scenarios often describe a company replacing a 5-year-old IVR with Agentforce Voice and ask what capability makes that possible. The answer is natural language understanding / NLP intent detection, not just transcription.

---

### Slide 6: Einstein Trust Layer in the Voice Context

**Visual:**
```
  Phone Call
      │
      ▼
┌─────────────────────────┐
│    Telephony Partner    │◀── PCI masking applied HERE (Contact Lens)
│    (Amazon Connect)     │    before transcript leaves telephony layer
└────────────┬────────────┘
             │  Transcript (sensitive data already masked)
             ▼
┌────────────────────────────────────────────────────────┐
│                  SALESFORCE PLATFORM                   │
│                                                        │
│  ╔══════════════════════════════════════════════════╗  │
│  ║            EINSTEIN TRUST LAYER                 ║  │
│  ╠══════════════════════════════════════════════════╣  │
│  ║  ▸ Data Masking        — PCI / credit card #s   ║  │
│  ║  ▸ Zero Data Retention — no model training      ║  │
│  ║  ▸ Audit Trail         — every AI action logged ║  │
│  ║  ▸ No Training on      — contractual guarantee  ║  │
│  ║    Customer Data                                ║  │
│  ╚══════════════════════════════════════════════════╝  │
│                                                        │
│              Service Cloud Voice / Agentforce          │
└────────────────────────────────────────────────────────┘
```

**Content:**
- The Einstein Trust Layer applies to voice interactions exactly as it does to text-based AI interactions
- **Data masking:** Sensitive data spoken during a call (credit card numbers, SSNs) can be masked in the transcript before the AI processes it or before it is stored
- **Zero data retention:** Salesforce does not use customer conversation data to train AI models — this is a contractual and architectural guarantee
- **Audit trail:** Every AI action taken during or after a call is logged, including which model was invoked and what data was accessed
- PCI-DSS compliance scenarios require that credit card digits never appear in the transcript — masking must be configured at the telephony layer (e.g., Amazon Connect Contact Lens) before audio reaches Salesforce

**Speaker Notes:** The Trust Layer is consistently tested on the Agentforce Specialist exam. For voice scenarios specifically, students should remember that masking happens at the telephony layer — by the time the transcript arrives in Salesforce, sensitive data should already be redacted. If a question asks where to configure credit card masking in an Amazon Connect + Salesforce Voice deployment, the answer is Amazon Connect Contact Lens, not Salesforce Setup.

---

### Slide 7: Key Voice AI Terminology

**Visual:**
```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│ UTTERANCE                           │ TRANSCRIPTION                       │
│                                     │                                     │
│ A single speech turn from one       │ Real-time audio-to-text conversion  │
│ party — what is said in one         │ generated by the telephony partner  │
│ conversational turn                 │ (e.g., Amazon Connect Contact Lens) │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ NLP INTENT                          │ ROUTING                             │
│                                     │                                     │
│ Classification of what a caller is  │ Directing a call to the correct     │
│ trying to accomplish, derived from  │ agent, queue, or bot based on       │
│ analyzing the utterance text        │ intent and Omni-Channel rules       │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ CALL SUMMARY                        │ TRANSCRIPT SEGMENT                  │
│                                     │                                     │
│ AI-generated text summary of the    │ Time-stamped block of transcribed   │
│ full call, auto-written to the      │ text for one speaker turn — stored  │
│ Voice Call record after call ends   │ as a child record under Voice Call  │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

**Content:**
- **Utterance:** A single unit of speech from one party in a call — what the caller or agent says in one turn of the conversation
- **Transcription:** The real-time conversion of spoken audio into text; generated by the telephony partner (e.g., Amazon Connect Contact Lens) and streamed into the Salesforce Voice Call record
- **NLP Intent:** The classification of what a caller is trying to accomplish, derived from analyzing the utterance text (e.g., "cancel my order" → Intent: CancelOrder)
- **Routing:** The process of directing a call to the correct agent, queue, or bot based on intent, customer attributes, or Omni-Channel rules
- **Call Summary:** An AI-generated text summary of the full call, automatically written to the Voice Call record after the call ends
- **Transcript Segment:** A time-stamped block of transcribed text associated with one speaker turn, stored as a child record under the Voice Call

**Speaker Notes:** These terms appear in exam answer choices — students who know the definitions can eliminate wrong answers quickly. The trickiest distinction is utterance vs transcript segment: an utterance is the conceptual unit (what someone said), while a transcript segment is the data record that stores it. They are related but not the same. Also note that NLP intent classification is what enables IVR replacement — understanding this link helps students answer scenario questions about natural language self-service.

---

## Recording Script

Welcome to Lecture 1 of Course 8: Agentforce Voice. If you have worked through Course 7 on Agentforce Specialist, you already understand how to build agents with Topics and Actions, how the Atlas Reasoning Engine reasons through problems, and how the Einstein Trust Layer keeps your AI interactions safe and compliant. In this lecture, we are going to extend all of that knowledge into a new channel: the phone.

Let's start with a simple question — what is Agentforce Voice? At its core, it is the extension of the Agentforce autonomous agent platform to voice calls. The same agent you might deploy in a chat window or on a web portal can now pick up the phone, listen to what a customer says, reason about it, take actions in Salesforce, and respond — all in real time. This is a significant shift in what "contact center AI" means in the Salesforce ecosystem.

To understand why this matters, let's compare it briefly to what came before. Many of you will have worked with Open CTI — Salesforce's JavaScript API for embedding a softphone widget in the Salesforce UI. Open CTI is a display layer. It puts a dialpad in your browser and captures basic call metadata like phone number and call duration. But Open CTI has no awareness of what is being said during the call. It cannot read the conversation, cannot suggest anything to the agent, and cannot automate anything based on call content. Agentforce Voice changes all three of those things.

Now let me walk you through the architecture, because understanding the three-layer model will make every configuration topic in this course easier. The first layer is the telephony network — this is where the actual phone infrastructure lives. Salesforce partners with providers like Amazon Connect, Genesys Cloud CX, and NICE CXone. These partners handle the physical connectivity: receiving calls from the public telephone network, streaming audio, and in many cases generating the initial transcription. Salesforce does not run its own phone network — it relies on these partners for the carrier-level piece.

The second layer is Service Cloud Voice. This is the Salesforce layer that creates structure around the call. When a call comes in, Service Cloud Voice creates a Voice Call record in Salesforce, starts populating it with a real-time transcript, and routes the interaction through Omni-Channel — the same routing engine you use for cases, chats, and emails. This layer is where the call becomes a first-class Salesforce object.

The third layer is the Agentforce platform — and this is where the intelligence lives. The Agentforce agent receives the live transcript from Service Cloud Voice and processes it through the Atlas Reasoning Engine. It can look up records, invoke Flows, search knowledge articles, update the case, and either respond directly to the caller or surface suggestions to a human agent in real time.

Speaking of those two modes — let's talk about autonomous voice bots versus agent assist. An autonomous voice bot is exactly what it sounds like: the Agentforce agent handles the entire call without a human agent involved. The caller speaks, the AI understands, the AI acts, the AI responds. This is appropriate for high-volume, well-defined scenarios: checking an order status, scheduling an appointment, resetting a password. Agent assist is different — a human agent is on the call, but the Agentforce agent is running in the background, listening to the live transcript and proactively surfacing relevant information. Think of it as an AI co-pilot for your human agents.

The use cases for Agentforce Voice span inbound customer service, outbound follow-up campaigns, full IVR replacement using natural language understanding, post-call summarization, and long-term trend analysis through Einstein Conversation Mining. The IVR replacement use case is worth pausing on, because it is one of the most impactful. Traditional IVRs force callers through rigid menus — press 1 for billing, press 2 for technical support. Agentforce Voice replaces that with natural language: the caller just says what they need, the NLP intent engine classifies the request, and routing or automation happens based on intent. That is a fundamentally better experience.

Before we close, a word on the Einstein Trust Layer. Everything we discussed in Course 7 about AI safety applies here. Sensitive data spoken during a call — credit card numbers, social security numbers — must be masked before the transcript is processed by AI or stored. In an Amazon Connect deployment, this masking happens through a feature called Contact Lens, at the telephony layer, before the transcript ever reaches Salesforce. Salesforce also guarantees zero data retention — your customers' call content is never used to train AI models.

In the next lecture, we will go deep on the telephony integration options — Amazon Connect, Genesys, and NICE CXone — and explain exactly how data flows between Salesforce and your telephony partner. See you there.

---

## Exam Tips

- When an exam question asks where real-time transcription is generated in an Amazon Connect + Agentforce Voice deployment, the answer is **Amazon Connect (Contact Lens)** — not Salesforce itself. Transcription happens at the telephony layer.
- If a scenario describes replacing a touch-tone IVR with a natural language system, the key Agentforce Voice capability being tested is **NLP intent detection / natural language understanding** — not transcription alone.
- The distinction between **autonomous voice bot** and **agent assist** is frequently tested. Autonomous = AI handles the full call. Agent Assist = human agent + AI suggestions in real time. Know which mode fits which business scenario.
- **Open CTI** is a distractor answer in voice AI questions. If the question involves any AI capability (transcription, suggestions, summarization, autonomous handling), Open CTI is never the right answer — it is a display-only API.
- For **PCI-DSS compliance** scenarios in voice, data masking is configured at the **telephony layer** (Amazon Connect Contact Lens or equivalent), not in Salesforce Setup. This is a common exam trap.

---

## Lecture Summary

- Agentforce Voice extends the Agentforce autonomous agent platform to phone calls, using a supported telephony partner as the audio bridge between the PSTN and Salesforce
- The architecture has three layers: telephony network (audio + initial transcription), Service Cloud Voice (Voice Call record, routing), and Agentforce platform (AI reasoning and action)
- Open CTI is a legacy display-only API with no AI capabilities; Agentforce Voice replaces it in AI-enabled deployments
- Two deployment modes exist: autonomous voice bot (AI handles the full call) and agent assist (AI supports a human agent in real time)
- Key use cases include inbound self-service, IVR replacement, outbound follow-up, post-call summarization, and Einstein Conversation Mining
- The Einstein Trust Layer applies to voice interactions, with data masking for sensitive speech content configured at the telephony layer

---

## Mini Quiz

**Q1:** A Salesforce customer currently uses Open CTI to embed a softphone in their agent desktop. They want to add real-time AI-suggested responses based on the live call transcript. What must they implement?

A) Configure a new Open CTI adapter with AI extensions
B) Upgrade to Agentforce Voice with a supported telephony partner
C) Enable Einstein Next Best Action on the softphone record
D) Add a Flow that reads the call log after the call ends

**Answer:** B — Open CTI has no awareness of call audio or transcript content. Agentforce Voice, built on Service Cloud Voice, is the architecture that enables real-time transcription and AI-suggested responses. Open CTI extensions (A) do not provide these capabilities.

---

**Q2:** During an autonomous Agentforce Voice call, a caller speaks their credit card number. Which component is responsible for masking this sensitive data before it is stored in the Salesforce transcript?

A) Einstein Trust Layer data masking rule in Salesforce Setup
B) Agentforce agent instruction that filters PCI data
C) Amazon Connect Contact Lens (or equivalent telephony-layer masking)
D) Service Cloud Voice privacy filter on the Voice Call record

**Answer:** C — Sensitive data masking in a voice deployment is configured at the telephony layer — in Amazon Connect, this is done through Contact Lens. By the time the transcript arrives in Salesforce, the card number should already be replaced with a placeholder. Salesforce Setup does not offer a real-time audio masking control.

---

**Q3:** A company wants to replace their legacy IVR (press 1 for billing, press 2 for support) with a system where callers can say what they need in their own words. Which Agentforce Voice capability makes this possible?

A) Real-time transcription
B) NLP intent detection
C) Post-call summarization
D) Omni-Channel routing

**Answer:** B — Natural language IVR replacement requires **NLP intent detection** — the ability to classify the caller's spoken request into a structured intent (e.g., "I want to pay my bill" → BillingPayment intent). Transcription (A) is a prerequisite but not sufficient on its own; summarization (C) is post-call; Omni-Channel (D) handles routing after intent is known.
