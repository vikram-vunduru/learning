# Lecture 10: Testing Voice Agents

## Learning Objectives
- Identify the three primary testing modes for Agentforce Voice and when to use each
- Design test cases across the five key voice test categories: happy path, mishear/low confidence, silence, DTMF, and escalation trigger
- Interpret Salesforce debug logs to diagnose voice Flow and agent routing issues
- Understand voice quality metrics including MOS score and latency thresholds
- Build a user acceptance testing checklist appropriate for a voice agent go-live

---

## Slides

### Slide 1: Why Voice Testing Is Different
**Visual:** Split diagram — on the left, a software test pyramid (unit, integration, E2E) for a standard app; on the right, a voice test matrix adding speech recognition accuracy, audio quality, latency, and human factors as new test dimensions

**Content:**
- Voice adds dimensions that do not exist in traditional software testing
- Speech recognition accuracy: does the system understand what callers say?
- Audio quality: is the voice experience clear enough for callers and agents?
- Latency: is the response time fast enough to feel conversational?
- Human factors: does the flow feel natural? Are prompts clear and concise?
- Failure modes unique to voice: silence, background noise, heavy accents, DTMF timing issues
- Testing approach: structured test cases + real call testing + load simulation

**Speaker Notes:** The addition of speech recognition as a variable is the most significant testing challenge in voice automation. A unit test for a Flow passes deterministically. A voice test depends on acoustic conditions, the speaker's accent, background noise, and the STT engine's current model performance. This means your test cases must cover the failure modes of speech recognition explicitly — it is not enough to test the happy path with a clear microphone in a quiet room.

---

### Slide 2: Three Testing Modes
**Visual:** Three-panel comparison — Panel 1: Amazon Connect test call interface; Panel 2: Salesforce Debug Log viewer with voice events highlighted; Panel 3: Agentforce Conversation Simulator interface

**Content:**
- **Amazon Connect Test Calls:** make real calls from the Connect console; tests full phone stack including CTI, routing, and Voice Flow
- **Salesforce Debug Logs:** enable for specific users or automated processes; captures Flow execution, SOQL queries, DML operations triggered by voice events
- **Agentforce Conversation Simulator:** text-based simulation of voice agent conversations; no phone required; faster iteration cycle for agent logic testing
- Each mode serves a different testing phase: Simulator for logic, Debug Logs for integration, Test Calls for full-stack
- Use Simulator first → Debug Logs for integration issues → Test Calls for final verification

**Speaker Notes:** Think of these three modes as layers. You start with the Conversation Simulator because it is fast, requires no phone equipment, and lets you iterate on agent logic quickly. When your logic looks correct but behaviors are unexpected in integration, you enable Debug Logs to see exactly what Salesforce is executing behind the scenes. And when you are ready to validate the full end-to-end experience — including audio quality, CTI behavior, and routing — you move to actual test calls through Amazon Connect.

---

### Slide 3: Test Case Categories
**Visual:** Five-column table with categories as headers: Happy Path, Mishear/Low Confidence, Silence, DTMF Input, Escalation Trigger — with two example test cases under each

**Content:**
- **Happy Path:** caller states intent clearly, system responds correctly, resolution achieved without errors
- **Mishear/Low Confidence:** caller mumbles, background noise, ambiguous utterance; system should retry gracefully
- **Silence:** caller says nothing; system should detect no-input, retry with prompt, then escalate if silence persists
- **DTMF Input:** test all expected key presses; test unexpected keys; test partial input; test timeout between digits
- **Escalation Trigger:** verify all escalation conditions fire correctly — "speak to agent," complaint language, confidence threshold, specific intents

**Speaker Notes:** The silence test case is one that many teams overlook until production. Callers go silent for many reasons: they are confused, they put the call on hold, or the line quality is bad. Your Voice Flow must handle silence gracefully — detect it, prompt the caller, retry, and escalate cleanly if silence persists across all retries. An agent receiving a silent escalated call with no context is a terrible experience and a support cost. Test every silence path explicitly.

---

### Slide 4: Verifying Transcription Quality
**Visual:** Side-by-side comparison of intended utterance vs. transcribed text for ten test phrases; some show correct transcription, some show errors with highlighted differences

**Content:**
- Test transcription quality by comparing spoken phrases to Amazon Transcribe output in Call Recordings/Transcripts
- Focus areas: product names, account numbers, proper nouns, industry jargon, accented speech
- Transcription accuracy metric: Word Error Rate (WER) — lower is better; target WER under 15% for English
- Customize transcription vocabulary: Amazon Transcribe Custom Vocabulary for domain-specific terms
- Test with diverse speaker profiles: different accents, genders, ages, speech rates
- When WER is high for specific terms: add those terms to Custom Vocabulary with phonetic hints

**Speaker Notes:** Product names and industry jargon are the most common sources of transcription errors. If your company sells a product called "KloudSync" or uses an acronym like "BCMS," Amazon Transcribe will not know how to spell those correctly until you add them to a Custom Vocabulary list. Building and testing this vocabulary list is a critical pre-launch step that many implementations skip, only to discover post-launch that the intent engine is failing because transcriptions contain garbled versions of key terms.

---

### Slide 5: Debugging Misrouted Intents
**Visual:** Flow chart showing the debug path: incorrect routing observed → check VoiceCall record intent field → check Debug Log for Flow execution → check Agentforce agent conversation log → identify failure point

**Content:**
- Symptom: caller routed to wrong queue or agent fails to understand intent correctly
- Step 1: Check the VoiceCall record — review the `Intent` field populated by the Agentforce agent
- Step 2: Enable Debug Logs at FINE level for the Voice integration user; reproduce the call
- Step 3: Review Debug Log for: Flow element execution order, SOQL query results, any unhandled exceptions
- Step 4: Review Agentforce conversation log in Agent Studio > Conversation History for the call
- Step 5: Review Amazon Connect Contact Trace Record (CTR) for telephony-layer events
- Common causes: intent name mismatch, missing entity extraction, Flow Decision criteria error

**Speaker Notes:** Intent misrouting is the most common issue in voice deployments and also one of the most methodical to diagnose. The key is to narrow down which layer the failure occurred at. If the VoiceCall intent field shows the correct intent but routing still failed, the problem is in the Flow's Decision element or the queue assignment logic. If the intent field is wrong or missing, the problem is in the Agentforce agent's NLU configuration. If the intent field is empty, the problem is in the transcription or the integration between telephony and Salesforce.

---

### Slide 6: Voice Quality Metrics
**Visual:** Dashboard with four metric tiles: MOS Score (current: 4.1/5.0, target: ≥4.0), Round-Trip Latency (current: 285ms, target: <400ms), Packet Loss (current: 0.3%, target: <1%), Jitter (current: 12ms, target: <30ms)

**Content:**
- **MOS Score (Mean Opinion Score):** 1-5 scale for perceived voice quality; 4.0+ = acceptable, 3.6+ = minimum for business use
- **Round-Trip Latency:** time for voice packet to travel to server and back; target <400ms for conversational feel; >600ms causes talk-over issues
- **Packet Loss:** percentage of audio data lost in transmission; >1% causes audible artifacts
- **Jitter:** variation in packet arrival time; causes choppy audio; >30ms noticeable to callers
- Amazon Connect provides real-time quality metrics in CloudWatch
- Quality issues are often network-related: VPN, poor Wi-Fi, throttled bandwidth

**Speaker Notes:** MOS score is the headline metric for voice quality, but it is derived from the other three. If MOS is below 4.0 in your tests, look at latency, packet loss, and jitter individually to find the root cause. In contact center environments, poor Wi-Fi on the agent side is one of the most common quality culprits — agents on wireless connections in a busy office environment may see intermittent jitter spikes that callers experience as choppy audio. Wired connections for voice agents are still the best practice.

---

### Slide 7: User Acceptance Testing Checklist
**Visual:** UAT checklist table with columns: Test Area, Test Description, Pass Criteria, Result, Notes — with fifteen rows covering key test scenarios

**Content:**
- ANI lookup and screen pop fires correctly for known caller
- ANI lookup returns no match — new caller flow works correctly
- DTMF input accepted and stored correctly on VoiceCall record
- Speech recognition acceptable for all required utterances in testing vocabulary
- Happy path call resolved in autonomous mode without agent involvement
- Silence handling: three-retry logic works, escalation fires on third silence
- Escalation phrase "speak to an agent" routes to correct queue
- Escalated call: agent receives screen pop with conversation history
- Agent Assist mode: suggestions appear within 3 seconds of caller utterance
- Call recording starts and stops correctly; accessible in Call Recording tab
- Post-call survey fires after call disconnects (if configured)
- ACW timer starts automatically; agent transitions to Available when expired
- Supervisor can monitor active calls and see sentiment gauge
- Call reporting populates VoiceCall object correctly
- Load test: 20 concurrent calls handled without degradation

**Speaker Notes:** User acceptance testing for a voice system needs to involve actual users — both agents and a sample of callers. Agent UAT is often overlooked in favor of technical testing, but agents are the users of the Agent Assist panel, the screen pop, and the ACW workflow. If agents find the screen pop confusing, if suggestions appear too slowly, or if ACW time is too short, they will work around the system. UAT is your opportunity to find those usability issues before they become training problems and performance metrics problems.

---

## Recording Script

In this lecture we are covering testing for Agentforce Voice — which is a significantly different discipline from testing a standard Salesforce application. Let me walk you through the three testing modes, the test case categories you need to cover, how to diagnose the most common issues, and what your go-live UAT checklist should include.

The first thing to understand is that voice testing has dimensions that do not exist in standard software testing. Speech recognition accuracy is variable — it depends on the speaker, the acoustic environment, the microphone quality, and the current state of the STT model. Latency matters for conversational feel in a way it never does for a form submission. And failure modes like silence, background noise, and DTMF timing issues simply do not exist in a traditional web application.

Let us start with the three testing modes and when to use each.

The Agentforce Conversation Simulator is your fastest iteration tool. It lets you simulate a conversation with your voice agent entirely in text — no phone call required. You type what a caller would say, and the agent responds as it would on a real call. This is perfect for testing your agent's NLU, intent routing, and conversational logic without the overhead of making actual calls. Use the Simulator during the build phase to iterate quickly on agent behavior.

Salesforce Debug Logs are your integration diagnostic tool. When something works in the Simulator but behaves unexpectedly in a real call context, you enable Debug Logs at FINE level for the Voice integration user and reproduce the issue with a test call. The logs show you exactly which Flow elements executed, what SOQL queries ran, what DML operations fired, and where any exceptions occurred. Debug Logs are not a testing mode per se — they are a diagnostic tool you use when something is not working.

Amazon Connect Test Calls are your full-stack validation mode. From the Amazon Connect console, you can place actual test calls to your configured contact flow, which exercises the complete telephone stack: PSTN → Amazon Connect → CTI adapter → Salesforce Voice Flow → Omni-Channel routing → agent desktop. This is the only mode that validates audio quality, ring time, CTI behavior, and the agent experience end to end.

Now let me walk through the five test case categories that every voice implementation should cover.

Happy path tests verify that the system works when everything goes right. A caller states their intent clearly, the transcription is accurate, the agent or Flow understands correctly, and the resolution is achieved. Happy path tests are necessary but not sufficient.

Mishear and low confidence tests are where voice testing gets interesting. Simulate callers who mumble, who have background noise on their line, who say something ambiguous or off-topic. Your Get Input element should handle these with graceful retries — "I didn't catch that, could you repeat?" — and your Agentforce agent should have a fallback path when confidence is below threshold. Test that the retry logic works and that the escalation path fires when retries are exhausted.

Silence tests cover what happens when the caller says nothing. This can happen because the caller is confused, because they put you on hold, or because of an audio problem. Your Voice Flow should detect silence — the Get Input element's no-input timeout — retry with a prompt, and escalate to a human agent after a configured number of failed attempts. Test every step of this path.

DTMF tests exercise your keypad input logic. Test each expected key, unexpected keys, partial inputs (caller stops dialing mid-number), and timeout between digits. Also test the PCI-DSS payment capture path if your implementation includes it — verify that recording pauses when the DTMF payment capture begins.

Escalation trigger tests verify every configured escalation path. The caller says "speak to an agent" — does routing fire correctly? The caller mentions "legal action" — does the configured keyword trigger fire? The autonomous agent exceeds its confidence threshold retry count — does it escalate? Each of these escalation paths needs its own test case.

For diagnosing misrouted intents — one of the most common post-launch issues — follow this debugging sequence: first, check the VoiceCall record and look at the Intent field. If the intent is correctly identified but routing failed, the problem is in your Flow Decision logic or queue assignment. If the intent field is wrong, the problem is in the NLU configuration. If the intent field is empty, the problem is in the transcription-to-Salesforce integration layer.

For voice quality metrics, your primary target is a MOS score of 4.0 or above. This corresponds to round-trip latency below 400 milliseconds, packet loss below 1%, and jitter below 30 milliseconds. These metrics are available in Amazon CloudWatch for Connect deployments. If you are seeing quality issues, check agent network connections first — poor Wi-Fi is by far the most common quality issue in contact center deployments.

For UAT, my strong recommendation is to involve actual agents in the testing process at least two weeks before go-live. Agents will find usability issues that technical testers miss: screen pop that is hard to read, agent assist suggestions that appear too slowly, ACW timer that is too short for complex call types. Fix those issues in UAT, not after launch.

---

## Exam Tips
- The Agentforce Conversation Simulator tests agent logic in text mode — no phone call required; use it during the build phase
- Debug Logs should be enabled at FINE level for the Voice integration user when diagnosing integration issues
- Amazon Connect Contact Trace Records (CTRs) provide telephony-layer event data independent of Salesforce logs
- MOS score target for business voice: 4.0 or above; below 3.6 is unacceptable for most contact center use cases
- Silence handling in the Get Input element requires explicit configuration of no-input timeout, retry count, and escalation branch
- Custom Vocabulary in Amazon Transcribe should be populated with product names, acronyms, and industry jargon before go-live

---

## Lecture Summary
- Voice testing requires additional dimensions beyond standard software testing: speech recognition accuracy, audio quality, latency, and human factors
- Three testing modes serve different phases: Conversation Simulator for logic, Debug Logs for integration diagnostics, Amazon Connect Test Calls for full-stack validation
- Five test case categories — happy path, mishear/low confidence, silence, DTMF, escalation trigger — must all be covered before go-live
- Transcription quality testing should use Word Error Rate (WER) and custom vocabulary configuration for domain-specific terms
- MOS score (target ≥4.0), latency (<400ms), packet loss (<1%), and jitter (<30ms) are the core voice quality metrics
- UAT must include actual agent users to surface usability issues with screen pop, agent assist, and ACW workflow

---

## Mini Quiz

**Q1:** A developer is iterating on Agentforce voice agent intent logic and wants to test quickly without making phone calls. Which testing mode is most appropriate?

A) Amazon Connect Test Calls  
B) Salesforce Debug Logs  
C) Agentforce Conversation Simulator  
D) Amazon CloudWatch monitoring  

**Answer:** C — The Agentforce Conversation Simulator allows text-based conversation testing with no phone call required. It is ideal for rapid iteration on agent intent logic during the build phase before moving to full-stack test call validation.

---

**Q2:** A voice agent is routing callers to the wrong queue. The first debugging step is to check which Salesforce record?

A) The Contact record's Activity History  
B) The VoiceCall record's Intent field  
C) The Omni-Channel Queue configuration  
D) The Amazon Connect Contact Flow logs  

**Answer:** B — Checking the VoiceCall record's Intent field immediately tells you whether the NLU correctly identified the intent. If the intent field shows the correct value but routing still failed, the problem is in the Flow logic. If the intent field is wrong or empty, the problem is upstream in NLU or transcription.

---

**Q3:** During load testing, agents report choppy audio on calls. Network monitoring shows 2.5% packet loss. What is the recommended immediate action?

A) Increase ACW time to reduce agent call volume  
B) Reduce the number of concurrent voice channels in Omni-Channel  
C) Investigate and remediate network quality — 2.5% packet loss exceeds the 1% threshold  
D) Upgrade Amazon Connect to a higher service tier  

**Answer:** C — A packet loss rate of 2.5% exceeds the acceptable threshold of 1% and will cause audible audio artifacts and choppy voice quality. The correct action is to investigate the network path (Wi-Fi quality, VPN bottlenecks, ISP issues) and remediate the packet loss rather than adjusting application configuration.
