# Agentforce Voice Cheat Sheet

## Architecture Quick Reference

The Agentforce Voice stack has three distinct layers. Understanding which layer owns which capability is a frequent exam topic.

| Layer | Component | Role |
|---|---|---|
| Telephony | Amazon Connect / Genesys / NICE CXone | Carries the actual phone call; hosts IVR/contact flows |
| Integration | Service Cloud Voice (native or Partner API) | Bridges telephony to Salesforce; creates VoiceCall records |
| AI / CRM | Agentforce Agent + Einstein features | Autonomous handling, agent assist, transcription, summarization |

**Call flow (inbound):** PSTN → Telephony Provider → IVR/Contact Flow → Agentforce Bot OR Omni-Channel Queue → Agent Console (with Screen Pop + Transcript)

---

## Setup Checklist

Steps must generally occur in this order. Skipping or reordering causes common exam scenarios about "what went wrong."

1. Provision telephony: set up Amazon Connect instance (or configure Partner telephony connector)
2. Enable Service Cloud Voice in Salesforce Setup
3. Create a Contact Center — link to the telephony provider
4. Configure permissions: assign Voice User permission set to agents
5. Enable real-time transcription (if using)
6. Set up Omni-Channel: create a Service Channel for Voice, create a Queue, assign agents
7. Associate the Contact Center with the Omni-Channel queue
8. Build Voice Flows (for IVR logic, data lookup, routing)
9. Build Agentforce Agent: create Topics, add Actions, write Instructions
10. Configure Screen Pop rules
11. Configure After Call Work (ACW) state in Omni-Channel
12. Enable Einstein Call Summarization (optional)
13. Test using Agent Tester and sandbox telephony
14. Deploy and monitor via Omni-Channel Supervisor + Service Intelligence

---

## Voice vs. Chat — Key Differences

| Dimension | Voice | Chat (Messaging) |
|---|---|---|
| Real-time medium | Audio via telephony provider | Text via Messaging for In-App, Web, etc. |
| Transcription | Required intermediary step — speech → text | Native text; no transcription needed |
| Latency tolerance | Low — responses must feel conversational | Higher — typing delay is normal |
| DTMF input | Supported via Collect Digits flow element | Not applicable |
| Bot invocation | Triggered in telephony IVR/contact flow | Triggered by messaging channel routing |
| Screen Pop | Surfaced in agent's softphone/console panel | Surfaced as chat window with record sidebar |
| Call recording | Stored in telephony provider (e.g., S3) | Chat logs stored in Salesforce MessagingSession |
| Escalation | Transfer call + create work item for human | Transfer messaging session to human queue |

---

## Amazon Connect Integration

**What it is:** Native, first-party integration — no middleware needed. Amazon Connect Contact Control Panel (CCP) is embedded directly in Salesforce Agent Console.

**Key steps:**
- Create Amazon Connect instance in AWS (or use existing)
- In Salesforce Setup, navigate to Contact Centers → New → Amazon Connect
- Authenticate using AWS IAM credentials
- Map Amazon Connect queues to Omni-Channel queues in Salesforce
- Configure Contact Flows in Amazon Connect to invoke Salesforce Lambda functions (for data lookup) or route to the Salesforce-connected queue

**Gotchas:**
- One Amazon Connect instance can connect to only one Salesforce Contact Center, but one Salesforce org supports up to 5 Amazon Connect instances
- Call recordings go to Amazon S3 — Salesforce stores the link, not the file
- Real-time transcription is powered by Amazon Transcribe under the hood
- IAM user permissions must include Connect, Transcribe, and Lambda access
- Test by linking a separate Amazon Connect test instance to your Salesforce sandbox

---

## Voice Agent Configuration

| Setting | Location in Setup | Purpose |
|---|---|---|
| Agent Name & Description | Agentforce → Agents → New | Identifies the agent; description guides LLM behavior |
| Agent Type | Agent Config | Set to "Voice" for voice-specific agents |
| Topics | Agent → Topics | Defines what intents the agent handles |
| Actions | Topic → Actions | What the agent can do (lookup, transfer, end call) |
| Instructions | Topic or Agent level | Guardrails, tone, escalation guidance |
| Grounding (Knowledge) | Topic → Knowledge Sources | Links Knowledge Articles for accurate answers |
| System Prompt Override | Advanced Agent Settings | Org-specific behavioral constraints |
| Channel Assignment | Contact Center config | Binds the agent to the voice channel/Contact Center |

---

## Autonomous vs. Agent Assist

| Dimension | Autonomous Voice Agent | Agent Assist |
|---|---|---|
| Human involvement | None (unless escalated) | Human agent is always on the call |
| AI role | Conducts the full conversation | Suggests responses, articles, actions to human |
| Best for | Routine, structured inquiries (status, FAQs) | Complex calls needing human judgment |
| Escalation | Transfers to human queue when needed | Human is already handling the call |
| Configuration | Full Agentforce Agent with Topics + Actions | Agent Assist panel in console; lighter config |
| Risk if misconfigured | Customer ends up in unhandled loop | Agent ignores suggestions; low AI value |
| Monitoring metric | Bot Containment Rate | Suggestion Acceptance Rate |
| License requirement | Agentforce Voice license | Included in broader Agent Assist entitlements |

---

## Voice Flows — Element Reference

Voice Flows (built in Flow Builder) control the IVR/bot experience before and during routing. These elements are voice-specific.

| Element | What It Does | Common Use |
|---|---|---|
| Play Message | Plays TTS or audio file to caller | Greetings, hold music, announcements |
| Collect Digits | Captures keypad (DTMF) input | Legacy IVR menus, PIN entry |
| Ask Question | Prompts caller for spoken response; captures transcription | Collecting name, account number, reason for call |
| Get Records | Queries Salesforce data | Account lookup, case check, contract status |
| Decision | Branches flow based on conditions | Route by account tier, case status, intent |
| Transfer to Queue | Routes caller to Omni-Channel queue | Escalation to human, specialty routing |
| End Call | Terminates the call | Resolution, after self-service completes |
| Start Bot Session | Invokes an Agentforce autonomous agent | Handing off from IVR to AI agent |
| Set Variable | Stores data for downstream steps | Capture intent, account number for screen pop |
| Send SMS | Sends text to caller's number | Confirmation numbers, article links post-call |

---

## Omni-Channel for Voice

**Key concepts:**

- **Service Channel**: A Voice-type Service Channel must exist — this tells Omni-Channel that voice calls are a workable channel type
- **Queue**: Calls waiting for a human agent sit in an Omni-Channel queue. Each queue has a priority (lower number = higher priority)
- **Routing Configuration**: Sets capacity (how many simultaneous calls an agent can take — typically 1 for voice) and routing model (Most Available, Least Active)
- **Presence Status**: Agents must be in an "Available for Voice" presence status to receive calls. After-call Work (ACW) temporarily removes them from routing
- **Supervisor Tab**: Real-time view of queue depth, agent status, and active calls — critical for operations questions on the exam

**Routing priority exam tip:** If a question asks why voice calls aren't being delivered before chats, check the queue priority number — voice queue should have a lower number (higher urgency).

---

## Monitoring Metrics

| Metric | Where to Find It | What It Measures |
|---|---|---|
| Bot Containment Rate | Service Intelligence / Voice Analytics | % of calls resolved by bot without human escalation |
| Average Handle Time (AHT) | Service Intelligence, Omni-Channel Report | Total time per call (talk + hold + ACW) |
| Escalation Rate | Custom VoiceCall Report / Service Intelligence | % of bot calls transferred to human |
| Queue Wait Time | Omni-Channel Supervisor (real-time), Analytics | Time callers wait before agent answers |
| Agent Utilization | Omni-Channel Supervisor / Analytics | % of time agents are handling work vs. available |
| Suggestion Acceptance Rate | Agent Assist Analytics | % of AI suggestions the human agent acted on |
| First Call Resolution (FCR) | Custom report on VoiceCall + Case | % of calls that resolve the issue without callback |
| Transcription Accuracy | Spot-check via VoiceCall records | Quality of STT output — affects bot and summarization |
| Call Volume by Topic | Einstein Conversation Mining | Breakdown of call reasons across periods |
| Sentiment Score | Einstein Conversation Insights | Positive/negative tone signals in transcript |

---

## Common Exam Traps

1. **Recording storage location**: Call recordings are NOT stored in Salesforce. They live in the telephony provider's storage (S3 for Amazon Connect). Salesforce holds a reference URL only.

2. **IVR routing controls bot invocation**: Whether a call goes to the Agentforce bot is decided in the telephony IVR/contact flow, not in Salesforce Omni-Channel or Agent configuration.

3. **Queue priority is inverse**: A queue with priority "1" is higher priority than a queue with priority "10." Questions about why voice isn't prioritized over chat often hinge on this.

4. **Partner Telephony vs. Native**: Amazon Connect = native integration. Genesys and NICE CXone = Partner Telephony via the Partner API. Setup steps, feature support, and limitations differ between them.

5. **Agent Tester ≠ telephony test**: The Agentforce Agent Tester lets you test conversation logic but doesn't simulate real phone calls. For end-to-end testing, you need a telephony sandbox.

6. **VoiceCall is auto-created, not manually created**: A VoiceCall record is created automatically when a call begins. Admins don't create them; they configure what gets written to them.

7. **DTMF and NLP are not mutually exclusive**: Voice Flows support both DTMF (Collect Digits) and natural language (Ask Question). A well-designed flow often includes DTMF fallback for NLP failures.

8. **After Call Work is an Omni-Channel presence state**: ACW is configured in Omni-Channel, not in the telephony provider. It's a Salesforce routing state, not a telephony hold or mute feature.

9. **Einstein Conversation Mining is retrospective**: It analyzes historical transcripts to guide future bot design — it does not influence real-time call handling.

10. **"Service Cloud Voice" vs "Agentforce Voice" are layered, not competing**: Service Cloud Voice is the integration foundation. Agentforce Voice is the AI layer on top. You need both for autonomous call handling; Service Cloud Voice alone provides CTI + transcript but no AI agent.

---

## Key Object Reference

### VoiceCall Object — Core Fields

| Field | Type | Description |
|---|---|---|
| CallDurationInSeconds | Number | Total call length |
| CallType | Picklist | Inbound, Outbound, Internal |
| Status | Picklist | In Progress, Completed, Transferred, Missed |
| FromPhoneNumber | Phone | Caller's number (ANI) |
| ToPhoneNumber | Phone | Dialed number (DNIS) |
| OwnerId | Lookup (User) | Assigned agent |
| ContactId | Lookup (Contact) | Linked Contact record |
| CaseId | Lookup (Case) | Linked Case record |
| CallCenterId | Lookup (CallCenter) | Associated Contact Center |
| CallDisposition | Text | Outcome/disposition code (often custom) |
| RecordingUrl | URL | Link to recording in telephony storage |
| ConversationId | Text | Links to ConversationEntry for transcripts |

### Related Objects

| Object | Relationship | Purpose |
|---|---|---|
| VoiceCallRecording | Child of VoiceCall | Metadata about the recording |
| ConversationEntry | Related via ConversationId | Individual transcript utterances |
| MessagingSession | Separate (chat) | Do not confuse with VoiceCall |
| AgentWork (Omni-Channel) | Related | Tracks routing assignment to agent |
| ServiceChannel | Config object | Defines voice as a channel type |
