# Real-Time Transcription and NLP in Service Cloud Voice

## Exam Domain
Use Cases & Business Value / Setup & Configuration — Agentforce Specialist (CRT-271)

## Core Concepts

### The Transcription Pipeline — End to End

```
┌─────────────┐   ┌─────────────────────┐   ┌────────────────────────┐
│ Caller's    │──▶│ Telephony Provider  │──▶│ Speech-to-Text Engine  │
│ Phone       │   │ (Amazon Connect /   │   │ (AWS Transcribe /      │
│             │   │  Genesys / NICE)    │   │  provider-native STT)  │
└─────────────┘   └─────────────────────┘   └────────────┬───────────┘
   [Audio]         [Audio Stream — RTP]         [Transcript JSON]
                                                          │
                                                          ▼
                                               ┌─────────────────────┐
                                               │ Salesforce          │
                                               │ Service Cloud Voice │
                                               │ (VoiceCall record,  │
                                               │  real-time feed via │
                                               │  Streaming API)     │
                                               └─────────┬───────────┘
                                              [Structured utterance]
                                                         │
                                                         ▼
                                               ┌─────────────────────┐
                                               │ Agentforce Voice    │
                                               │ Agent + Einstein NLP│
                                               │ (intent, entity,    │
                                               │  sentiment, routing)│
                                               └─────────────────────┘
Typical end-to-end latency: 300–800ms from speech to transcript in Salesforce
```

**Key architectural point:** Transcription does NOT happen inside Salesforce. Salesforce is a consumer of the transcript, not the producer. Transcription quality is determined by factors outside Salesforce control — audio clarity, STT model quality, telephony provider configuration.

**Limitations:**
- Amazon Transcribe currently supports English, Spanish, French, German, Japanese, Korean, and more — check current language support list for specific deployments
- Transcription accuracy degrades for: heavy accents, background noise, domain-specific terminology, overlapping speech (barge-in)
- AWS Transcribe has service quotas on concurrent transcription streams — request quota increases before high-volume go-lives
- Latency of 300–800ms is typical but can spike to 1–2 seconds under high load or poor network conditions

### Transcription Output — What Salesforce Receives

```javascript
// Transcript Segment Payload (from AWS Transcribe → Salesforce)
{
  "transcript":  "I want to cancel my subscription",
  "confidence":   0.92,         // How certain STT is (0.0–1.0)
  "speaker":     "CUSTOMER",    // CUSTOMER or AGENT (from channel separation)
  "start_time":  "00:01:34.220",
  "end_time":    "00:01:36.890",
  "is_partial":   false,        // true = streaming (incomplete), false = finalized
                                // Agent acts on is_partial:false results
  "punctuated":   true          // AWS Transcribe added punctuation
}

// Key fields for routing logic:
//   confidence  → triggers re-prompt / DTMF fallback if below threshold
//   speaker     → enables Customer vs Agent labeling in Service Console
//   is_partial  → agent waits for false before committing to Topic match
```

**Limitations:**
- is_partial:true results can be used to start preparing a response (reducing perceived latency) but must not trigger irreversible actions
- Speaker labels require proper two-channel mode configuration — single-channel mode is less reliable (see below)
- Punctuation is auto-added by AWS Transcribe but may be inaccurate for fragmented speech

### Speaker Identification and Channel Separation

```
┌────────────────────────────────────────────────────────────┐
│  Service Console — Voice Call Transcript Panel             │
├──────────────────────────┬─────────────────────────────────┤
│  CUSTOMER                │  AGENT / VOICE BOT              │
│  ──────────────────────  │  ────────────────────────────── │
│  "Hi I need help with    │                                 │
│   my bill"               │                                 │
│                          │  "Hi, I'm Aria. I can help      │
│                          │   with billing..."              │
│  "Yes it's 7-8-9-0-0-1"  │                                 │
│                          │  "Thank you, pulling up         │
│                          │   your account now..."          │
└──────────────────────────┴─────────────────────────────────┘

Channel Mode Comparison:
┌───────────────────┬──────────────────────────┬───────────────────────────┐
│ Mode              │ How Speaker Labels Work  │ Accuracy                  │
├───────────────────┼──────────────────────────┼───────────────────────────┤
│ Two-Channel ✓     │ Separate audio streams   │ Near-100% — best practice │
│ (Amazon Connect   │ per party, labeled        │ for production            │
│  default)         │ definitively             │                           │
│ Single-Channel ✗  │ Diarization ML model     │ Lower — fails on barge-in │
│                   │ separates speakers       │ and similar voices        │
└───────────────────┴──────────────────────────┴───────────────────────────┘
```

**Limitations:**
- Incorrect speaker labels cause Einstein NLP to misattribute intent — customer complaint labeled as agent speech breaks routing logic
- Two-channel mode is NOT available with all telephony configurations — verify before design
- Single-channel diarization accuracy varies by telephony provider and STT model version

### Einstein NLP Intent Detection on Transcripts

```
Transcript utterance (finalized, is_partial=false):
"I want to cancel my subscription"
    ↓
╔══════════════════════════════════════════════════════════════╗
║              EINSTEIN NLP ENGINE                            ║
║                                                              ║
║  Named Entity Recognition (NER):                            ║
║  → "cancel" (action), "subscription" (object)               ║
║                                                              ║
║  Intent Classification:                                      ║
║  → Maps utterance → Topic: "Subscription Cancellation"      ║
║  → Confidence: 0.87                                         ║
║                                                              ║
║  Sentiment Analysis:                                         ║
║  → Detected: Negative tone                                  ║
╚═══════════════════════════════╤══════════════════════════════╝
                                │
              ┌─────────────────┴────────────────┐
              ▼                                   ▼
  Matched Topic → Agentforce           Negative sentiment →
  agent routes to Topic actions        Flag for supervisor /
                                       can trigger escalation

CASCADE FAILURE PATTERN (critical to understand):
Bad audio → low transcription confidence → poor NLP → wrong Topic → bad experience
```

**Limitations:**
- Einstein NLP operates on text transcript — it cannot compensate for transcription errors
- Sentiment detection false positives occur with sarcasm or culturally-specific speech patterns
- Entity extraction (account numbers, dates, product names) is only as accurate as the transcription

### Enabling and Disabling Transcription

```
Org-Level: Setup → Service Cloud Voice Settings → Real-Time Transcription: [ON/OFF]
    ↓ Disabling also disables Einstein NLP intent detection for all calls

Per-Call Override (PCI compliance):
Card number collection step:
    ↓
Stop Transcription (telephony Contact Flow block)
    ↓ Caller enters card number via DTMF
Payment complete
    ↓
Resume Transcription (telephony Contact Flow block)
    ↓ Transcript resumes — card number never captured in Salesforce

Transcription providers (configurable in Setup):
  • Amazon Transcribe (default for Amazon Connect)
  • Provider Native (for Genesys / NICE)
  • Custom (for multilingual or specialized requirements)
```

**Limitations:**
- Per-call transcription pause is configured at the telephony layer (Amazon Connect Contact Flow) — NOT in Salesforce Flow
- Disabling transcription at org level disables ALL voice AI capabilities (NLP, agent assist, intent routing) for that call segment
- Custom transcription providers require additional integration work

### VoiceCall Object — Post-Call Storage

```
VoiceCall (parent record)
├── VoiceCallRecording (media file link in S3 / provider storage)
├── ConversationEntry (individual utterances — speaker, text, timestamp, confidence)
└── related Case / Contact (via screen pop match)

SOQL to retrieve transcript:
SELECT Id, Body, Speaker, Timestamp FROM ConversationEntry WHERE VoiceCallId = '...'
```

**Limitations:**
- Recordings are stored in S3 (Amazon Connect) — Salesforce stores only the URL reference, not the audio file
- ConversationEntry records are auto-created; the number of entries = number of transcript segments
- VoiceCall retention policies default to org settings — configure explicitly for compliance

### GDPR / Privacy Compliance Checklist for Voice

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│  CONSENT (before transcription)      │  DATA MINIMIZATION                   │
│  • IVR must play consent notice      │  • AWS Transcribe PII redaction       │
│    before transcription begins       │    (auto-removes SSNs, card #s, DOBs) │
│  • Required by GDPR + regional laws  │  • Prevents sensitive data reaching   │
│                                      │    Salesforce                         │
├──────────────────────────────────────┼──────────────────────────────────────┤
│  RIGHT TO ERASURE                    │  ACCESS CONTROLS                     │
│  • VoiceCall records = personal data │  • Field-Level Security on VoiceCall │
│  • Implement retention policy         │    restricts transcript visibility   │
│  • Deletion workflow: VoiceCall +    │  • Restrict to supervisors and       │
│    ConversationEntry records         │    compliance roles only             │
│  • S3 lifecycle rules for recordings│                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
All four quadrants required for GDPR-compliant voice deployment.
```

**Limitations:**
- GDPR right to erasure applies to audio recordings containing personal data — S3 lifecycle rules and Salesforce data retention policies must be coordinated
- Data residency: if required, AWS Transcribe regional settings must align with data residency requirements (EU data cannot leave EU AWS regions)
- PII redaction in AWS Transcribe is a best-effort feature — sensitive data in unusual formats may not be caught

## PTA / SA Relevance

**Transcription quality is the single most important technical prerequisite for voice AI.** No amount of agent configuration compensates for poor transcription. Before promising AI routing accuracy to a customer, establish a transcription quality baseline with their actual call audio.

**The cascade failure pattern is critical for troubleshooting and customer conversations:**
Bad audio quality → low transcription confidence → inaccurate NLP → wrong topic matched → wrong action executed → bad experience. When a customer says "the AI doesn't understand our callers," the real question is: "what is our transcription accuracy?" Check the transcript records first, not the agent Topics.

**Common partner mistakes:**
- Skipping transcription accuracy testing before building agent Topics — discovering product name transcription failures post-launch
- Not configuring per-call transcription pause for PCI — non-compliance risk discovered in first security review
- Treating consent IVR prompt as a nice-to-have — in GDPR-regulated regions, it is legally mandatory
- Forgetting that deleting a VoiceCall record doesn't delete the S3 recording — coordinated deletion strategy needed

**Enterprise-scale considerations:**
- At 10,000+ concurrent calls, AWS Transcribe stream throughput must be pre-provisioned — contact AWS for quota increase SLAs
- Multilingual transcription: AWS Transcribe can auto-detect language, but accuracy for auto-detection is lower than explicitly configured language settings. For known multi-language deployments, route to language-specific endpoints with language pre-set.
- Long calls (>30 minutes) can produce hundreds of ConversationEntry records — ensure Salesforce storage and any downstream analytics pipelines can handle the volume

**For a financial services customer:** "There are four layers of voice compliance: consent capture, PCI transcription pause, PII redaction, and retention policy. All four must be configured before go-live, not as follow-up items. A regulatory audit will check all four."

## Customer Advisory Tips

**PCI compliance for voice requires coordination across three systems:**
1. Amazon Connect Contact Flow: configure recording pause/resume around payment capture
2. AWS Transcribe: enable PII redaction (auto-removes card numbers, SSNs from transcript text)
3. Salesforce: configure VoiceCall retention policy and Field-Level Security on transcript fields

**HIPAA considerations for healthcare customers:**
- AWS and Salesforce both offer BAA (Business Associate Agreement) for HIPAA-eligible environments
- Recordings and transcripts containing PHI must be stored in HIPAA-eligible AWS regions
- Disable recording for calls where callers provide protected health information verbally (or configure transcription pause)

**Right to erasure implementation approach:**
- Create a scheduled Salesforce Flow to delete VoiceCall + related ConversationEntry records past retention date
- Use S3 lifecycle policies to automatically delete recordings after the retention period
- Legal hold flag on VoiceCall record suspends deletion during active litigation

## Key Facts to Memorize
- Transcription pipeline: Audio → Telephony Provider → AWS Transcribe → Salesforce → Einstein NLP
- Salesforce is a CONSUMER of the transcript, not the PRODUCER
- is_partial:false = finalized utterance — agent acts on this
- Two-channel mode = near-100% speaker accuracy; single-channel = less reliable diarization
- PII redaction = AWS Transcribe removes sensitive data before transcript reaches Salesforce
- Per-call transcription pause = configured in Amazon Connect Contact Flow, NOT Salesforce Flow
- VoiceCall (parent) → ConversationEntry (individual utterances with speaker, timestamp, confidence)
- GDPR: consent prompt + PII redaction + retention policy + FLS on VoiceCall = four required elements

## Exam Traps
- "Transcription quality cascades into NLP accuracy" → True — bad audio → wrong topic match; fix upstream, not in Topics
- "Per-call transcription pause is configured in Salesforce Setup" → False — it's in Amazon Connect Contact Flow
- "PII redaction prevents all sensitive data from reaching Salesforce" → Partial credit — AWS Transcribe redaction is best-effort; configure DTMF-only for highest-risk data
- "ConversationEntry stores the call recording" → False — ConversationEntry stores individual utterance TEXT; VoiceCallRecording stores the media file URL
- "Two-channel and single-channel mode both provide the same speaker accuracy" → False — two-channel is near-100% accurate; single-channel uses an imperfect ML diarization model

## Practice Questions

**Q:** A voice agent routes calls about "billing problems" to the wrong Topic. Reviewing call logs shows AWS Transcribe is returning "billing process" with a confidence score of 0.58. What is the most likely root cause and the correct fix?
**A:** The confidence score of 0.58 indicates unreliable transcription ("billing process" instead of "billing problems"). The fix is to investigate audio quality and potentially add "billing problems" to the Amazon Transcribe Custom Vocabulary list, then verify the confidence threshold is set correctly. The issue is upstream of NLP — do not rewrite the Topic first.

**Q:** A financial services company needs to ensure credit card numbers spoken by callers never appear in Salesforce transcripts. Which two approaches should be implemented?
**A:** (1) Enable AWS Transcribe PII redaction to automatically remove card numbers from the transcript text before it reaches Salesforce. (2) Configure a per-call transcription pause in the telephony Contact Flow before the card number collection step. Both provide defense-in-depth for PCI compliance.

**Q:** A compliance officer requests a full transcript of a specific call from 30 days ago, including which party said each line. Which Salesforce objects should be queried?
**A:** VoiceCall (parent record) and ConversationEntry (child records with speaker labels, timestamps, and utterance text). Each ConversationEntry record stores one utterance with the speaker field indicating CUSTOMER or AGENT.
