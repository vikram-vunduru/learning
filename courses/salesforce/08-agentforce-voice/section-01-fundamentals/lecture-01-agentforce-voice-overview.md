# Agentforce Voice Overview

## Exam Domain
Use Cases & Business Value — Agentforce Specialist (CRT-271)

## Core Concepts

### What Agentforce Voice Is
Agentforce Voice = Agentforce autonomous agent platform extended to the phone channel. Same Topics, Actions, and Atlas Reasoning Engine as a chat agent — different input/output modality (spoken audio instead of typed text). Built on top of Service Cloud Voice.

Requires a supported telephony partner — Salesforce does not operate phone network infrastructure. The telephony partner converts voice audio into structured transcript data that Salesforce and the Agentforce agent can process.

### Open CTI vs. Agentforce Voice — Know This Distinction

```
┌─────────────────────┬────────────────────────────┬────────────────────────────┐
│ Attribute           │ Open CTI (Legacy)           │ Agentforce Voice (Current) │
├─────────────────────┼────────────────────────────┼────────────────────────────┤
│ Intelligence        │ None — display only         │ Atlas Reasoning Engine     │
│ Transcription       │ None                        │ Real-time (Contact Lens)   │
│ Agent Assist        │ None                        │ Yes — live AI suggestions  │
│ Autonomous Handling │ None                        │ Yes — full voice bot mode  │
│ Data flow           │ Call metadata only          │ Live transcript + AI       │
│ What it is          │ JavaScript API, softphone   │ Full AI voice platform     │
└─────────────────────┴────────────────────────────┴────────────────────────────┘
```

**Limitations:**
- Open CTI is still valid for basic click-to-dial if no AI is needed — don't over-engineer
- Agentforce Voice requires Service Cloud Voice license on top of Service Cloud
- Agent Assist requires additional Agentforce license beyond standard Service Cloud Voice

### Full Voice Call Flow Architecture

```
Customer (Phone/PSTN)
    │
    ▼
Telephony Partner (Amazon Connect / Genesys Cloud CX / NICE CXone)
    │  [handles SIP, audio, STT transcription via Contact Lens / provider-native]
    ▼
Salesforce Service Cloud Voice
    │  [creates VoiceCall record, real-time transcript feed, Omni-Channel routing]
    ▼
Agentforce Voice Agent (Atlas Reasoning Engine)
    │  [intent classification, entity extraction, action invocation]
    ├──[resolved]──▶ Ends call / posts summary to VoiceCall record
    └──[escalate]──▶ Human Agent (with screen pop + Agent Assist panel active)
```

**Limitations:**
- Telephony partner latency adds 300–800ms before transcript reaches Salesforce
- Transcription accuracy degrades with background noise, heavy accents, low audio quality
- Language support varies by STT engine — Amazon Transcribe supports English, Spanish, French, German, Japanese, and more; check current docs for full list
- Escalation warm transfer passes context, but only if VoiceCall record is populated before transfer

### Autonomous Voice Bot vs. Agent Assist

```
┌──────────────────────────────────┬──────────────────────────────────┐
│       AUTONOMOUS VOICE BOT       │          AGENT ASSIST             │
│    [ AI handles the full call ]  │    [ Human + AI in parallel ]    │
├──────────────────────────────────┼──────────────────────────────────┤
│ Caller speaks                    │ Call routes to human agent        │
│    ↓                             │    ↓                              │
│ AI classifies intent             │ Human agent speaks with caller    │
│    ↓                             │    ↓                              │
│ AI executes actions              │ AI listens to live transcript     │
│    ↓                             │    ↓                              │
│ AI responds or escalates         │ AI surfaces suggestions on screen │
├──────────────────────────────────┼──────────────────────────────────┤
│ Best for: high-volume, routine,  │ Best for: complex, sensitive,    │
│ well-defined tasks               │ relationship-driven calls         │
│ (order status, appt confirm,     │ (complaints, account retention,  │
│  password reset, store hours)    │  medical inquiries, legal topics) │
└──────────────────────────────────┴──────────────────────────────────┘
```

**Limitations:**
- Autonomous mode requires well-scoped Topics — every unhandled intent causes escalation or poor experience
- Agent Assist accuracy depends on transcription speed — suggestions arrive 1–2 seconds after utterance
- Both modes run on the same telephony infrastructure; the routing decision (bot vs. human) is made in the telephony IVR, not in Salesforce

### Einstein Trust Layer in Voice

PCI data masking must happen at the **telephony layer** (Amazon Connect Contact Lens), before the transcript reaches Salesforce. Salesforce receives a pre-masked transcript. Zero data retention applies — call content is never used for model training.

```
Phone Call
    ↓
Telephony Layer (Amazon Connect)
    │  ← PCI masking applied HERE (Contact Lens)
    │     before transcript leaves telephony
    ↓
Salesforce Platform
    ┌─────────────────────────────────────────┐
    │  EINSTEIN TRUST LAYER                   │
    │  ▸ Data Masking (PCI / SSN)             │
    │  ▸ Zero Data Retention (no training)    │
    │  ▸ Audit Trail (every AI action logged) │
    └─────────────────────────────────────────┘
    ↓
Agentforce Agent (processes pre-masked transcript)
```

**Limitations:**
- Salesforce Trust Layer does not provide real-time audio masking — only the telephony partner can intercept audio
- If Contact Lens PCI masking is misconfigured, raw card numbers enter the transcript before any Salesforce control can act
- Audit logs are stored per-org; retention of audit records follows org data retention settings

### Key Voice AI Terminology

| Term | Definition | Exam Relevance |
|------|-----------|----------------|
| Utterance | Single speech turn from one party | Utterance ≠ transcript segment (utterance is conceptual, segment is the data record) |
| Transcription | Real-time audio → text (generated at telephony layer) | Transcription quality drives everything downstream |
| NLP Intent | Classification of what a caller wants | What enables IVR replacement — "I want to cancel" → CancelOrder intent |
| Routing | Directing call to agent/queue/bot based on intent | Routing is the output of intent detection |
| Call Summary | AI-generated text written to VoiceCall after call ends | Post-call, not real-time |
| Transcript Segment | Data record storing one utterance with timestamp + speaker | Child record under VoiceCall (ConversationEntry) |

## PTA / SA Relevance

**When a customer asks about AI on voice calls:**
The architecture decision is: which tier does the AI live in, and how does data flow between tiers? Most customers imagine AI as a Salesforce-only feature, but the telephony partner owns the audio — if their STT accuracy is poor, no amount of Agentforce configuration fixes it.

**Common partner mistakes:**
- Promising natural language IVR replacement without validating STT accuracy for the customer's product vocabulary
- Deploying autonomous mode on complex, ambiguous call types (complaints, medical, legal) — those need Agent Assist
- Not explaining that credit card masking must be configured in the telephony layer, not Salesforce Setup

**Enterprise-scale consideration:** At 10,000+ concurrent calls, the bottleneck is often the STT engine throughput at the telephony layer, not Salesforce. Amazon Connect scales horizontally, but custom Amazon Transcribe vocabulary and Contact Lens configuration must be validated under load.

**For a retail customer:** "Your order status calls are the fastest win — the Agentforce agent can handle those autonomously in 60 seconds with zero agent involvement. Billing disputes and complaints stay with human agents who get AI suggestions."

**For a financial services customer:** "Every word on this call might be regulated. The architecture must ensure card numbers never touch the Salesforce transcript, consent is captured before transcription starts, and retention policies are enforced on VoiceCall records."

## Customer Advisory Tips

**Telephony partner selection criteria:**
- Already on AWS? → Amazon Connect is the path of least resistance (deepest native integration)
- Already on Genesys or NICE? → Partner Telephony maintains existing investment
- 5-year-old Avaya contract? → BYOT buys time but requires custom development

**Business case framing:**
- Autonomous containment rate = % of calls handled without a human. At 1M calls/year at $8/call, each 10% containment improvement = ~$800K gross savings
- Agent Assist → measure AHT (average handle time) reduction; 2 minutes/call at $0.50/minute × 800K calls = $800K/year

**When NOT to use Agentforce Voice autonomous mode:**
- Call types requiring human empathy (bereavement, medical crisis, major complaints)
- Topics where the agent might take irreversible actions without human review
- Geographies where automated calling requires consent not yet obtained
- Early-stage deployments with low transcription accuracy baselines

## Key Facts to Memorize
- Agentforce Voice is built ON TOP OF Service Cloud Voice — both are required for autonomous AI
- Open CTI = display only, no AI capability — always wrong answer for AI questions
- Three tiers: Telephony (audio + STT) → Service Cloud Voice (record + routing) → Agentforce (reasoning + actions)
- PCI masking is configured at the telephony layer (Amazon Connect Contact Lens), NOT in Salesforce Setup
- Autonomous = AI handles full call; Agent Assist = human handles call with AI suggestions in background
- IVR replacement capability = NLP intent detection, not just transcription alone
- Same Agentforce agent can serve both autonomous and assist deployment modes

## Exam Traps
- "Where does real-time transcription happen?" → Amazon Connect (Contact Lens) — NOT Salesforce
- "What enables natural language IVR replacement?" → NLP intent detection — not transcription alone (transcription is a prerequisite but not sufficient)
- "Open CTI extensions provide AI suggestions" → False — Open CTI is display-only, no AI capability
- "Where to configure credit card masking for voice?" → Amazon Connect Contact Lens — NOT Salesforce Setup
- "Autonomous vs. Agent Assist requires two separate agents?" → Generally no — same agent, different deployment context

## Practice Questions

**Q:** A company uses Open CTI for their softphone widget and wants to add real-time AI-suggested responses based on live call transcripts. What must they implement?
**A:** Upgrade to Agentforce Voice with a supported telephony partner. Open CTI has no awareness of call audio or transcript content — Agentforce Voice (built on Service Cloud Voice) is the architecture that enables real-time transcription and AI suggestions.

**Q:** During an autonomous Agentforce Voice call, a caller speaks their credit card number. Which component is responsible for masking this data before it appears in the Salesforce transcript?
**A:** Amazon Connect Contact Lens (or equivalent telephony-layer masking). Sensitive data masking in voice is configured at the telephony layer. By the time the transcript arrives in Salesforce, the card number should already be replaced with a placeholder.

**Q:** A company wants to replace their legacy IVR (press 1 for Billing, press 2 for Support) with a system where callers say what they need in their own words. Which capability makes this possible?
**A:** NLP intent detection. Transcription is a prerequisite but not sufficient — intent detection classifies the caller's spoken request into a structured intent (e.g., "I want to pay my bill" → BillingPayment). Omni-Channel handles routing after intent is known.
