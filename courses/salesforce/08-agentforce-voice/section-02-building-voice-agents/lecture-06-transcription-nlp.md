# Lecture 06: Real-Time Transcription and NLP in Service Cloud Voice

## Learning Objectives
- Trace the end-to-end transcription pipeline from audio input through telephony provider, speech-to-text engine, and into Salesforce
- Interpret transcription output properties including confidence scores, punctuation markers, and speaker labels
- Explain how Einstein NLP uses real-time transcripts to detect intent and trigger routing decisions
- Configure transcription enable/disable settings and apply GDPR/privacy compliance controls for voice data
- Describe post-call transcript storage, retention policies, and how transcripts appear in the Service Console

## Slides

### Slide 1: The Transcription Pipeline — End to End
**Visual:**
```
  ┌───────────────┐     ┌───────────────────────┐     ┌──────────────────────────┐
  │  Caller's     │────▶│  Telephony Provider   │────▶│  Speech-to-Text Engine   │
  │  Phone        │     │  (Amazon Connect /    │     │  (AWS Transcribe /       │
  │               │     │   Genesys / NICE)     │     │   provider-native STT)   │
  └───────────────┘     └───────────────────────┘     └────────────┬─────────────┘
     [Audio]             [Audio Stream — RTP]           [Transcript JSON payload]
                                                                    │
                                                                    ▼
                                                        ┌──────────────────────────┐
                                                        │  Salesforce              │
                                                        │  Service Cloud Voice     │
                                                        │  (Voice Call record,     │
                                                        │   real-time transcript   │
                                                        │   feed via Streaming API)│
                                                        └────────────┬─────────────┘
                                                        [Structured Utterance]
                                                                    │
                                                                    ▼
                                                        ┌──────────────────────────┐
                                                        │  Agentforce Voice Agent  │
                                                        │  + Einstein NLP          │
                                                        │  (intent detection,      │
                                                        │   entity extraction,     │
                                                        │   routing decisions)     │
                                                        └──────────────────────────┘
                                                        [Intent / Action]

  Typical end-to-end latency: 300–800ms from speech to transcript in Salesforce
```
**Content:**
- Audio travels from the caller's phone to the telephony provider as a real-time audio stream
- The telephony provider forwards audio to a speech-to-text (STT) engine — AWS Transcribe is the primary engine for Amazon Connect integrations
- AWS Transcribe returns a transcript JSON payload including text, timestamps, confidence scores, and speaker labels
- Salesforce receives the transcript via a streaming API from the telephony provider
- Einstein NLP processes the incoming transcript text to detect intent and route to Agentforce Topics or human agents
- The full pipeline operates in near real-time — typical latency is 300–800ms from speech to transcript in Salesforce
**Speaker Notes:** The pipeline is the foundational concept for this entire lecture. Students should be able to describe each stage and name the technology involved. On the exam, the most frequently tested aspect of the pipeline is the role of AWS Transcribe — it is not Salesforce's proprietary technology; it is Amazon's service, used because Service Cloud Voice natively integrates with Amazon Connect. When using Genesys or NICE, the STT engine may differ (provider-native or a third-party integration). The key principle is that transcription happens outside Salesforce and is fed in as structured data.

---

### Slide 2: Transcription Output — What Salesforce Receives
**Visual:**
```
  Transcript Segment Payload (from AWS Transcribe → Salesforce)

  {
    "transcript":  "I want to cancel my subscription",  ◀── The recognized speech text
    "confidence":   0.92,                               ◀── How certain STT is (0.0–1.0)
                                                             Higher = more reliable
    "speaker":     "CUSTOMER",                          ◀── Who said this: CUSTOMER or AGENT
                                                             (from two-channel diarization)
    "start_time":  "00:01:34.220",                      ◀── Timestamp — start of utterance
    "end_time":    "00:01:36.890",                      ◀── Timestamp — end of utterance
    "is_partial":   false,                              ◀── true = streaming (incomplete)
                                                             false = finalized utterance
                                                             Agent acts on false results
    "punctuated":   true                                ◀── AWS Transcribe added punctuation
  }

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  Key fields for routing logic:                                          │
  │    confidence  → determines if re-prompt / DTMF fallback triggers       │
  │    speaker     → enables Customer vs Agent labeling in Service Console  │
  │    is_partial  → agent waits for false before committing to Topic match │
  └─────────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **transcript:** The text string of the recognized speech
- **confidence:** Float 0.0–1.0 — higher is more certain. Used to filter low-quality transcriptions
- **speaker:** Speaker label identifying who spoke — "CUSTOMER" or "AGENT" — based on telephony channel separation
- **start_time / end_time:** Timestamps for each utterance, enabling timeline reconstruction and compliance review
- **is_partial:** During real-time streaming, partial results arrive before the utterance is complete; final results have is_partial: false
- **punctuated:** Indicates whether AWS Transcribe's automatic punctuation feature added punctuation to the transcript
**Speaker Notes:** The is_partial flag is important for understanding latency behavior. Salesforce and the Agentforce agent process partial results to start working on a response before the caller has finished speaking — this reduces perceived latency. But acting on a partial result too early can cause misinterpretation. The agent typically waits for the final (is_partial: false) result before committing to a Topic match. The speaker label is what enables the Service Console to display "Customer: " vs. "Agent: " in the transcript view.

---

### Slide 3: Speaker Identification and Channel Separation
**Visual:**
```
  Service Console — Voice Call Transcript Panel
  ┌────────────────────────────────────────────────────────────────────┐
  │  CUSTOMER                    │  AGENT / VOICE BOT                 │
  │  ────────────────────────    │  ───────────────────────────────── │
  │  "Hi I need help with        │                                    │
  │   my bill"                   │                                    │
  │                              │  "Hi, I'm Aria. I can help         │
  │                              │   with billing. Can I have         │
  │                              │   your account number?"            │
  │  "Yes it's 7-8-9-0-0-1"      │                                    │
  │                              │  "Thank you. I'm pulling up        │
  │                              │   your account now..."             │
  └────────────────────────────────────────────────────────────────────┘

  Speaker Diarization Settings:
  ┌───────────────────────────────────────────────────────────────────┐
  │  Speaker Diarization:  [ ON  ●──────────── ]                      │
  │                                                                   │
  │  Channel Mode:  [ Two-Channel              ▼ ]                    │
  │                   ● Two-Channel  — telephony sends SEPARATE audio │
  │                                   streams per party → near-100%   │
  │                                   accurate speaker labels         │
  │                   ○ Single-Channel — both parties on ONE stream   │
  │                                   → diarization ML model needed   │
  │                                   → less accurate (esp. barge-in) │
  └───────────────────────────────────────────────────────────────────┘
  Recommendation: Always use Two-Channel mode for production deployments
```
**Content:**
- **Speaker diarization:** The process of separating and labeling who said what in an audio recording
- **Two-channel mode:** The telephony provider sends separate audio streams for the caller and the agent — produces the most accurate speaker labels at near-100% accuracy
- **Single-channel mode:** Both parties are on the same audio stream; AWS Transcribe uses a diarization ML model to separate speakers — less accurate, especially when voices are similar
- Service Cloud Voice with Amazon Connect uses two-channel mode by default — each party has a dedicated audio channel
- Speaker identification enables accurate billing tracking, compliance review, and agent performance analytics
- Incorrect speaker labels can cause Einstein NLP to misattribute intent — always verify channel mode is set correctly
**Speaker Notes:** The distinction between two-channel and single-channel matters for both accuracy and compliance. In two-channel mode, the customer's audio stream and the Agentforce Voice agent's TTS output are on separate channels, so there is zero ambiguity about who said what. In single-channel mode, if the agent and customer speak simultaneously (barge-in), the diarization model can confuse the two. For enterprise deployments, always recommend two-channel mode. The exam may present a scenario where speaker labels are inaccurate — the fix is verifying or switching to two-channel mode.

---

### Slide 4: Einstein NLP Intent Detection on Transcripts
**Visual:**
```
  Transcript utterance (finalized):
  "I want to cancel my subscription"
        │
        ▼
  ╔═══════════════════════════════════════════════════════════════╗
  ║              EINSTEIN NLP ENGINE                             ║
  ║                                                               ║
  ║  ┌───────────────────────────────────────────────────────┐   ║
  ║  │  Named Entity Recognition (NER)                       │   ║
  ║  │  Extracts: "cancel" (action), "subscription" (object) │   ║
  ║  └───────────────────────────────────────────────────────┘   ║
  ║                                                               ║
  ║  ┌───────────────────────────────────────────────────────┐   ║
  ║  │  Intent Classification                                │   ║
  ║  │  Maps utterance → Topic: "Subscription Cancellation"  │   ║
  ║  │  Confidence: 0.87                                     │   ║
  ║  └───────────────────────────────────────────────────────┘   ║
  ║                                                               ║
  ║  ┌───────────────────────────────────────────────────────┐   ║
  ║  │  Sentiment Analysis                                   │   ║
  ║  │  Detected: Negative tone                              │   ║
  ║  └───────────────────────────────────────────────────────┘   ║
  ╚═════════════════════════════╤═════════════════════════════════╝
                                │
              ┌─────────────────┴──────────────────┐
              ▼                                     ▼
  ┌───────────────────────────┐       ┌──────────────────────────────┐
  │  Matched Topic:           │       │  Sentiment: Negative         │
  │  Subscription Cancellation│       │  → Flag for supervisor       │
  │  → Agentforce agent       │       │  → Can trigger escalation    │
  │    routes to Topic        │       │    workflow or priority       │
  │    actions                │       │    routing to human agent    │
  └───────────────────────────┘       └──────────────────────────────┘

  Cascade failure pattern:
  Bad audio → low transcription confidence → poor NLP → wrong Topic → bad experience
```
**Content:**
- Einstein NLP processes each finalized transcript utterance to extract intent, entities, and sentiment
- **Intent classification** maps the utterance to the closest matching Agentforce Topic
- **Named Entity Recognition (NER):** Extracts specific values — account numbers, product names, dates, phone numbers — from the transcript
- **Sentiment analysis:** Detects positive, neutral, or negative tone; negative sentiment can trigger escalation workflows
- Einstein NLP operates on the text transcript, not the raw audio — transcription quality directly impacts NLP accuracy
- Low transcription confidence → poor NLP accuracy → incorrect routing; this is the cascading failure pattern to understand
**Speaker Notes:** This is a cascade chain that appears frequently on the exam: bad audio quality → low transcription confidence → inaccurate NLP → wrong Topic matched → wrong Action executed → bad customer experience. Students need to understand that Einstein NLP is only as good as the transcription it receives. The fix for poor intent detection is not always rewriting Topics — often it is addressing transcription quality issues upstream (microphone quality, background noise, telephony configuration). The sentiment analysis output is also testable — it can trigger Omni-Channel routing rules to prioritize angry callers for human escalation.

---

### Slide 5: Enabling and Disabling Transcription
**Visual:**
```
  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
  │  PANEL 1: Org-Level Setting     │  │  PANEL 2: Supervisor View       │  │  PANEL 3: Per-Call Override     │
  │  Service Cloud Voice Setup      │  │  (when transcription ON)        │  │  (PCI-DSS compliance)           │
  ├─────────────────────────────────┤  ├─────────────────────────────────┤  ├─────────────────────────────────┤
  │  Real-Time Transcription:       │  │  Omni-Channel Supervisor        │  │  Flow / Contact Flow signal:    │
  │  [ ON  ●──────────── ]          │  │                                 │  │                                 │
  │                                 │  │  Jane Smith — On Call           │  │  Card number collection step:   │
  │  Transcription Provider:        │  │  "I want to cancel my..."       │  │                                 │
  │  [ Amazon Transcribe   ▼ ]      │  │  "Sure, can I get your..."      │  │  ┌──────────────────────────┐  │
  │    Amazon Transcribe            │  │  "My account is 12345..."       │  │  │  Stop Transcription      │  │
  │    Provider Native              │  │  ↑ Live updates in real-time    │  │  │  (telephony Contact Flow)│  │
  │    Custom (multilingual)        │  │                                 │  │  └───────────┬──────────────┘  │
  │                                 │  │  Supervisor can read along      │  │               │ Caller enters  │
  │  Disabling also disables        │  │  and intervene if needed        │  │               │ card number    │
  │  Einstein NLP intent detection  │  │                                 │  │  ┌────────────▼─────────────┐  │
  │  for that call                  │  │                                 │  │  │  Resume Transcription    │  │
  │                                 │  │                                 │  │  │  (after card collected)  │  │
  └─────────────────────────────────┘  └─────────────────────────────────┘  └──────────────────────────────┘
```
**Content:**
- Transcription is enabled/disabled at the **org level** in Service Cloud Voice Setup
- Transcription can also be **paused per-call** — critical for PCI-DSS compliance when callers provide card numbers
- Per-call pause is implemented via a Flow element or an Amazon Connect Contact Flow "Stop Transcription" block
- Disabling transcription also disables Einstein NLP intent detection for that call segment — Agentforce Voice cannot process input it cannot read
- Supervisors can view live transcripts in the Omni-Channel Supervisor panel in real-time when transcription is enabled
- Transcription provider can be swapped (e.g., from Amazon Transcribe to a custom engine) in Setup — useful for multilingual requirements
**Speaker Notes:** The per-call transcription pause for PCI-DSS compliance is a common exam scenario. Imagine a caller reads their 16-digit credit card number aloud. That card number must not be stored in the transcript. The solution is a "Stop Transcription" signal at the point in the IVR/Flow where card input is requested, followed by a "Resume Transcription" signal after the input is complete. This is handled at the telephony provider layer (Amazon Connect Contact Flow) and must be coordinated with the Salesforce Flow. On the exam, look for questions about "preventing sensitive data from appearing in transcripts" — the answer is per-call transcription pause, not just encryption.

---

### Slide 6: GDPR and Privacy Considerations for Voice Transcription
**Visual:**
```
┌──────────────────────────────────────────┬──────────────────────────────────────────┐
│  Q1: DATA MINIMIZATION                   │  Q2: CONSENT                             │
│                                          │                                          │
│  • Configure AWS Transcribe PII          │  • IVR MUST play consent notice          │
│    redaction — auto-removes SSNs,        │    before transcription begins           │
│    card numbers, DOBs from text          │    ("This call may be recorded and       │
│  • Prevents sensitive data from          │     transcribed...")                     │
│    ever reaching Salesforce              │                                          │
│  • Required for GDPR + PCI-DSS           │  • Required by GDPR and many             │
│    compliance                            │    regional privacy laws                 │
├──────────────────────────────────────────┼──────────────────────────────────────────┤
│  Q3: RIGHT TO ERASURE                    │  Q4: ACCESS CONTROLS                     │
│                                          │                                          │
│  • Transcripts stored as VoiceCall       │  • Field-Level Security on the           │
│    records in Salesforce                 │    VoiceCall object restricts who        │
│  • Implement retention policy in         │    can view transcript fields            │
│    Salesforce Data Management            │                                          │
│  • Deletion workflow for compliance      │  • Restrict transcript access to         │
│    requests (delete VoiceCall +          │    supervisors and compliance roles      │
│    related ConversationEntry records)    │    only                                  │
│  • API or automated retention rules      │                                          │
└──────────────────────────────────────────┴──────────────────────────────────────────┘
  GDPR-compliant voice deployment requires ALL FOUR quadrants configured correctly.
  Multi-system coordination: telephony provider + AWS Transcribe + Salesforce + AWS region
```
**Content:**
- **Consent requirement:** GDPR and many regional privacy laws require caller consent before recording or transcribing — the telephony IVR must play a consent prompt
- **Data minimization:** AWS Transcribe offers PII redaction — automatically redacts SSNs, card numbers, dates of birth from transcripts before they reach Salesforce
- **Right to erasure:** Transcripts stored as VoiceCall records in Salesforce can be deleted; implement a retention policy and a deletion workflow for compliance requests
- **Access controls:** Use Field-Level Security on the VoiceCall object to restrict transcript visibility to authorized roles
- **Data residency:** If required, AWS Transcribe regional settings must align with data residency requirements (e.g., EU data must not leave EU AWS regions)
- GDPR violations related to voice transcription can result in regulatory fines — compliance configuration is not optional
**Speaker Notes:** Privacy and compliance questions appear regularly on certification exams because they require multi-system thinking. A GDPR-compliant voice deployment requires coordination across: telephony provider (consent prompt and PII redaction), Salesforce (access controls and retention policy), and AWS (data residency region selection). The most testable compliance concept is PII redaction — AWS Transcribe's built-in PII redaction feature removes sensitive data from the transcript text before it ever reaches Salesforce. This is the preferred approach over hoping agents won't ask for sensitive information.

---

### Slide 7: Post-Call Transcript Storage and Retention
**Visual:**
```
  SALESFORCE OBJECT MODEL — POST-CALL TRANSCRIPT STORAGE

                        ┌──────────────────────────────────────────┐
                        │  VoiceCall (parent record)               │
                        │  ─────────────────────────               │
                        │  Status:          Completed              │
                        │  Duration:        00:04:22               │
                        │  CallType:        Inbound                │
                        │  TranscriptStatus: Complete              │
                        │  AgentId:         [linked agent]         │
                        └──────┬──────────────────┬───────────────┘
                               │                  │
              ┌────────────────┤                  ├──────────────────┐
              ▼                ▼                  ▼                  ▼
  ┌───────────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
  │ VoiceCallRecording│  │ VoiceCall    │  │ Conversation │  │ (related Case /  │
  │                   │  │ Participant  │  │ Entry        │  │  Contact via     │
  │ Media file link   │  │              │  │              │  │  screen pop)     │
  │ (recording URL)   │  │ Speaker label│  │ Utterance    │  │                  │
  │                   │  │ Participant  │  │ text         │  │ Contact: J. Smith│
  │                   │  │ metadata     │  │ Timestamp    │  │ Case: #00123456  │
  │                   │  │             │  │ Speaker label│  │                  │
  └───────────────────┘  └──────────────┘  │ Confidence   │  └──────────────────┘
                                           └──────────────┘

  Service Console view:
  ┌────────────────────────────────────────────────────────┐
  │  Case #00123456 — Acme Corp                            │
  │  ┌──────────────────────────────────────────────────┐  │
  │  │  Related Voice Call                              │  │
  │  │  Duration: 4:22  |  Date: 2026-09-01             │  │
  │  │  [  View Full Transcript  ]                      │  │
  │  └──────────────────────────────────────────────────┘  │
  └────────────────────────────────────────────────────────┘

  Retention policy: configurable in Salesforce Data Management Settings
  SOQL access: SELECT Id, Body FROM ConversationEntry WHERE VoiceCallId = '...'
```
**Content:**
- Post-call transcripts are stored in Salesforce as **VoiceCall** records linked to the associated Case or Contact
- **ConversationEntry** records store individual utterances with speaker labels, timestamps, and confidence metadata
- The **VoiceCall** object is the parent record; related objects store participants, recording links, and transcript entries
- Transcripts are viewable in the Service Console via the Voice Call widget on Case and Contact records
- Einstein Conversation Insights analyzes post-call transcripts to surface trends, coaching opportunities, and agent performance metrics
- **Retention policy:** Configurable in Salesforce Data Management settings — default retention is org-specific; align with legal hold and GDPR requirements
**Speaker Notes:** The VoiceCall object model is worth memorizing for the exam. VoiceCall is the parent. VoiceCallParticipant identifies who was on the call. ConversationEntry stores the actual transcript utterances. VoiceCallRecording stores the media file reference. A common exam scenario: "A compliance officer needs to review what a customer said during a specific call from last month — where do they look?" The answer is the VoiceCall record related to the Case, specifically the ConversationEntry child records. Supervisors and compliance teams access these through the Service Console; developers access them via SOQL on the VoiceCall and ConversationEntry objects.

---

## Recording Script

Welcome to Lecture 6. In this lecture, we open the hood on one of the most technically sophisticated parts of Agentforce Voice — the transcription and NLP pipeline. By the end of this lecture, you'll understand exactly how a caller's spoken words become structured data that Salesforce can act on, and the compliance obligations that come with storing that data.

Let's start with the pipeline. When a caller speaks, their voice travels as an audio stream through the telephone network to the telephony provider — Amazon Connect, Genesys, or NICE CXone. The telephony provider does not transcribe the audio itself. Instead, it forwards the audio stream to a speech-to-text engine. For Amazon Connect, that engine is AWS Transcribe. For other providers, it may be a provider-native STT system or a third-party integration.

AWS Transcribe processes the audio stream in near real-time and returns a transcript payload — a JSON object containing the text, confidence scores, speaker labels, timestamps, and a flag indicating whether the result is partial or final. This transcript is then streamed back to Salesforce via the Service Cloud Voice integration API.

Here's what matters architecturally: the transcription is NOT happening inside Salesforce. Salesforce is a consumer of the transcript, not the producer. This means transcription quality is determined by factors outside Salesforce control — audio clarity, the STT model quality, the telephony provider's audio processing. When transcription goes wrong, the fix is often upstream of Salesforce.

Once the transcript arrives in Salesforce, Einstein NLP takes over. It reads the finalized utterance text and runs it through intent classification, named entity recognition, and sentiment analysis.

Intent classification is what connects the transcript to Agentforce Topics. Einstein NLP looks at the transcript — "I want to cancel my subscription" — and maps it to the Topic with the highest semantic similarity. Named entity recognition pulls out specific values: the word "cancel" and "subscription" become structured data the agent can use to query records and take actions. Sentiment analysis assigns a tone — positive, neutral, or negative — to the utterance, which can feed escalation rules.

There's an important cascade to understand here: transcription quality directly impacts NLP accuracy. If AWS Transcribe returns "I want to cancel my description" with a confidence of 0.62 because the audio was unclear, Einstein NLP is now working with the wrong words. It might match a completely different Topic, take the wrong action, and frustrate the caller. The cascading failure is: bad audio → low transcription confidence → poor NLP → wrong routing.

This is why you cannot debug voice agent behavior by only looking at the agent's Topics and Actions. You must also look at the transcription logs to see what text the NLP actually received.

Let's talk about speaker identification. In a voice call, two people are speaking — the caller and the agent. How does Salesforce know which transcript utterances came from whom? The answer depends on whether you're using two-channel or single-channel mode.

Two-channel mode, which is the default for Amazon Connect integrations, sends separate audio streams for the caller and the agent on separate channels. AWS Transcribe then labels each utterance with the correct speaker with near-perfect accuracy. Single-channel mode combines both audio streams — AWS Transcribe uses a diarization model to guess who's speaking. Diarization is less accurate, especially when barge-in occurs. For production deployments, always use two-channel mode.

Now let's talk about compliance. Voice transcription creates real data that needs to be governed carefully.

The most important compliance concept is per-call transcription pause for PCI-DSS. When a caller reads their credit card number, that 16-digit sequence must not appear in the transcript. The solution is a "Stop Transcription" signal at the telephony layer before card input is requested, followed by a "Resume Transcription" signal afterward. AWS Transcribe also offers built-in PII redaction — it automatically detects and redacts sensitive values like Social Security numbers, card numbers, and dates of birth before the transcript reaches Salesforce. PII redaction is the recommended first line of defense; per-call pause is the backup for high-stakes scenarios.

For GDPR, your telephony IVR must play a consent notice before transcription begins. Transcripts are stored as VoiceCall records in Salesforce, with ConversationEntry child records for each utterance. To support the right to erasure, you need a deletion workflow for VoiceCall records and a configurable retention policy. Field-Level Security on the VoiceCall object restricts who can view transcripts.

Post-call, transcripts are accessible in the Service Console via the Voice Call widget on Case and Contact records. Supervisors can review full conversation timelines, and Einstein Conversation Insights analyzes transcript patterns to identify coaching opportunities, common complaint themes, and agent performance trends.

To summarize: real-time transcription is a multi-system pipeline, and your job as an architect or admin is to understand each stage — not just the Salesforce parts. Quality at every stage determines accuracy at the next. Compliance must be designed in from the start, not bolted on. And post-call transcripts are a rich data asset, but only if you've stored, secured, and retained them correctly.

---

## Exam Tips
- The transcription pipeline flows: Audio → Telephony Provider → AWS Transcribe (or provider STT) → Salesforce → Einstein NLP — memorize this sequence and the role of each stage
- **Transcription quality cascades into NLP accuracy** — when the agent routes to the wrong Topic, check transcription confidence before assuming Topic configuration is wrong
- **PII redaction** in AWS Transcribe removes sensitive data before it reaches Salesforce; **per-call transcription pause** stops transcription entirely during card collection — both are valid exam answers for different PCI-DSS scenarios
- Post-call transcripts are stored in Salesforce as **VoiceCall** (parent) → **ConversationEntry** (utterances) — know this object model for data access questions
- GDPR compliance for voice requires: IVR consent prompt, AWS Transcribe PII redaction, VoiceCall retention policy, and Field-Level Security on the VoiceCall object — exam scenarios may test any of these independently

---

## Lecture Summary
- The transcription pipeline converts caller audio to structured transcript data through the telephony provider's STT engine (AWS Transcribe for Amazon Connect) before reaching Salesforce
- Transcript payloads include text, confidence scores, speaker labels, and partial/final flags; Einstein NLP uses these for intent classification, entity extraction, and sentiment analysis
- Two-channel mode provides accurate speaker diarization; single-channel mode relies on a diarization ML model and is less reliable
- Transcription can be paused per-call for PCI-DSS compliance; AWS Transcribe's PII redaction feature removes sensitive values before transcripts reach Salesforce
- GDPR compliance requires telephony-layer consent prompts, data minimization via PII redaction, retention policies on VoiceCall records, and Field-Level Security for access control
- Post-call transcripts are stored as VoiceCall records with ConversationEntry child objects, viewable in the Service Console and analyzed by Einstein Conversation Insights

---

## Mini Quiz

**Q1:** A voice agent is consistently routing calls about "billing problems" to the wrong Topic. Reviewing the call logs shows AWS Transcribe is returning the phrase "billing process" with a confidence score of 0.58. What is the most likely root cause and the correct fix?
A) The "Billing Problems" Topic description is too short; add more keywords
B) The confidence score is below the threshold; the transcription is unreliable and triggering a re-prompt loop rather than a Topic match
C) AWS Transcribe does not support the word "billing"; switch to a custom STT provider
D) Einstein NLP requires a minimum of three Topics to perform accurate classification

**Answer:** B — A confidence score of 0.58 for "billing process" instead of "billing problems" indicates transcription inaccuracy. The fix involves investigating audio quality and potentially adjusting the confidence threshold, not rewriting the Topic. The transcription issue is upstream of NLP and must be resolved there.

---

**Q2:** A financial services company deploys Agentforce Voice and needs to ensure that credit card numbers spoken by callers never appear in Salesforce transcripts. Which two approaches should be implemented? (Choose 2)
A) Enable AWS Transcribe's PII redaction to automatically remove card numbers before the transcript reaches Salesforce
B) Delete VoiceCall records immediately after each call ends using a Flow trigger
C) Configure a per-call transcription pause in the telephony Contact Flow before the card number collection step
D) Set Field-Level Security on the VoiceCall object to hide the transcript field from all profiles
E) Disable transcription entirely at the org level during business hours

**Answer:** A and C — PII redaction removes card numbers from the transcript text automatically. A per-call transcription pause stops transcription entirely during the card number collection step. Both methods prevent card numbers from appearing in Salesforce records. FLS (D) only controls who can view existing data — it does not prevent storage. Deleting records (B) or disabling transcription entirely (E) are too broad and break other functionality.

---

**Q3:** A compliance officer requests a full transcript of a specific customer call from 30 days ago, including which party said each line. Which Salesforce objects should be queried to retrieve this information?
A) Case and CaseComment — call notes are stored in CaseComments
B) VoiceCall and ConversationEntry — the parent VoiceCall record links to ConversationEntry child records with speaker labels and utterance text
C) MessagingSession and MessagingEndUser — voice calls are stored as Messaging sessions
D) Task and ActivityHistory — voice calls are logged as completed Tasks with transcripts in the Description field

**Answer:** B — Post-call transcripts are stored in VoiceCall records (parent) with individual utterances in ConversationEntry child records. ConversationEntry includes speaker labels, timestamps, and the text of each utterance. This is the correct object model for transcript retrieval and compliance review.
