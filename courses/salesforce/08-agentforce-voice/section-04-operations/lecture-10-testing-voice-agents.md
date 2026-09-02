# Testing Voice Agents

## Exam Domain
Deployment / Quality Assurance — Agentforce Specialist (CRT-271)

## Core Concepts

### Testing Challenges Unique to Voice

| | Chat Agent Testing | Voice Agent Testing |
|---|---|---|
| **Input method** | Type text in a console | Must call a phone number |
| **Response visibility** | Immediately see responses | Responses depend on TTS + STT |
| **Test replay** | Replay test cases easily | Cannot replay without re-calling |
| **Acoustic factors** | None | Audio quality, background noise affect test results |
| **Formatting** | Markdown visible during test | ALL output is audio — no visual check |
| **Barge-in / DTMF** | No barge-in to test | Must test barge-in, silence handling, DTMF fallback as separate scenarios |

Voice testing requires both functional testing (does the agent handle intents correctly?) and audio/experience testing (does it SOUND right? does barge-in work?). These are distinct test phases.

### Testing Layers

```
LAYER 1: Unit Testing (Topics and Actions)
    Agentforce Studio → Test tab → provide text utterances → observe routing
    Goal: confirm Topic matching accuracy before adding voice channel
    No telephony involved yet

LAYER 2: Voice Channel Integration Testing
    Actual phone call to the Amazon Connect number
    Goal: confirm STT → Salesforce transcript pipeline works
    Check: transcript appears in real-time on VoiceCall record

LAYER 3: Functional Voice Testing (Script-Based)
    Pre-written test call scenarios → tester reads scripted inputs
    Goal: verify intent → action → response for each Topic
    Check: correct action executes, TTS response is intelligible

LAYER 4: Edge Case Testing
    Low confidence utterances (mumble, speak over TTS, background noise)
    DTMF fallback (test numeric input at each DTMF prompt)
    Escalation (trigger all escalation paths)
    Max turns (verify fallback fires at configured turn limit)

LAYER 5: Load Testing
    Multiple concurrent calls (test capacity and latency under load)
    Requires Amazon Connect test environment or scripted call generation
```

**Limitations:**
- There is no Salesforce-native voice call simulator — you must make real phone calls to test voice agents
- Load testing requires telephony infrastructure capable of generating concurrent inbound calls
- STT accuracy testing depends on tester voice characteristics — test with multiple voices and accents for production

### Agentforce Studio Test Tab — Pre-Voice Testing

**Path:** Agentforce Studio → [Agent] → Test tab

The Test tab provides a chat-style simulation interface where you type utterances and inspect routing decisions:
- Type an utterance → agent responds with matched Topic + Action + response text
- "Inspect" panel shows: Topic matched, Action invoked, confidence score, response text

**The Test tab DOES test:** Topic matching accuracy, action execution logic.

**The Test tab DOES NOT test:** STT accuracy, TTS quality, barge-in, DTMF fallback, latency.

**Always test Topics in text form first.** If Topics aren't matching correctly in text, they won't match in voice either (STT adds additional error on top of any topic matching issues).

**Limitations:**
- Test tab shows confidence scores and routing decisions — use these to debug misrouting before involving telephony
- Test tab does not support multi-turn conversation replay — each test is a fresh session
- Markdown in responses is visible in test tab but will sound wrong when spoken via TTS — deliberately test TTS output via phone call

### Test Script Structure

```
VOICE AGENT TEST SCENARIO (template)

Scenario ID: VS-001
Topic Under Test: Subscription Cancellation
Preconditions: Test Contact exists with matching phone number
Test Method: Call Amazon Connect number, speak test utterances

Step 1 - Happy Path:
  Input: "I want to cancel my subscription"
  Expected: Agent routes to SubscriptionCancellation Topic
  Expected response: asks for account verification
  Verify: transcript shows correct utterance + correct TTS response

Step 2 - Variant Phrasing:
  Input: "cancel my account" / "end my plan" / "stop my service"
  Expected: same topic match as Step 1
  Verify: all variants match without re-prompt

Step 3 - Low Confidence Simulation:
  Input: [mumble, background noise, non-native accent]
  Expected: confidence below threshold → re-prompt or DTMF fallback
  Verify: agent doesn't act on low-confidence input

Step 4 - Escalation Path:
  Input: "speak to a human"
  Expected: warm transfer to fallback queue
  Verify: human agent receives VoiceCall with transcript context

Step 5 - Post-Call Verification:
  Check VoiceCall record: Status = Completed
  Check ConversationEntry records: transcript accuracy
  Check linked records: Case / Contact association correct
```

### Measuring STT Accuracy — Word Error Rate

```
Word Error Rate (WER):
WER = (Substitutions + Deletions + Insertions) / Total Words in Reference

Reference:  "I want to cancel my subscription"          → 6 words
Transcript: "I want to cancel my subscription"          → 0 errors → WER = 0%
Transcript: "I want to cancel my script"                → 1 substitution → WER = 17%
Transcript: "I wanna cancel subscription"               → 1 del, 1 sub → WER = 33%

Target WER for production voice agents: < 10%

WER Assessment Method:
1. Record 50+ test calls across different speakers
2. Compare AWS Transcribe output to manual transcriptions
3. WER > 15%: add Custom Vocabulary (product names, industry terms)
WER 10-15%: tune confidence threshold, add example phrases to Topics
WER < 10%: production-ready transcription baseline
```

**Limitations:**
- WER is an average — a WER of 8% might hide 40% error rate on a specific product name that is common in your calls
- WER testing with a single tester is misleading — must test across multiple speakers, accents, and acoustic environments

### Confidence Score Distribution Analysis

```
After running test calls, analyze confidence score distribution:

Confidence    # of utterances    Interpretation
0.0 - 0.50         15           Critical: likely misheard / poor audio
0.50 - 0.70        22           Risky: approaching threshold edge
0.70 - 0.80        31           Near-threshold: examine each case
0.80 - 0.90        88           Good: mostly reliable
0.90 - 1.00       144           Excellent: reliable STT

Action: utterances in 0.50-0.75 range → listen to recording → is it a
vocabulary gap? → add to Custom Vocabulary
                → is it an accent issue? → add more training examples
                → is it background noise? → customer-side audio quality
```

### VoiceCall Record Post-Test Checklist

```
After every test call, verify the VoiceCall record:

VoiceCall:
  ☐ Status = Completed (not Abandoned / Error)
  ☐ Duration = reasonable (matches actual call length)
  ☐ Direction = Inbound
  ☐ AI Summary generated (if post-call summary is configured)
  ☐ Linked Contact/Account = correct match (screen pop worked)

ConversationEntry:
  ☐ # of records = # of transcript segments
  ☐ Speaker labels = CUSTOMER vs AGENT (or VOICE_BOT) correct
  ☐ Confidence scores are visible
  ☐ No PII visible in transcript if PII redaction is enabled

VoiceCallRecording:
  ☐ Recording URL populated (if recording is enabled)
  ☐ Recording accessible (test the URL — confirms S3 permission)
```

**Limitations:**
- VoiceCall record may take 30–60 seconds to fully populate after call ends — don't check immediately after hanging up
- If ConversationEntry records are missing: check if transcription is enabled in Setup → Service Cloud Voice Settings
- If VoiceCall shows "Error" status: check Named Credential validity and Amazon Connect Contact Flow configuration

## PTA / SA Relevance

**Testing voice agents is fundamentally different from testing chat agents — partners who skip real phone call testing until late in the project almost always discover STT accuracy issues that require rework.** The right approach: test with real phone calls starting in Sprint 1, not Sprint 5.

**Common partner mistakes:**
- Assuming text-based Test tab results translate directly to voice — they do not; STT adds a layer of variability
- Not testing with representative speakers — a tester who speaks perfect standard American English will see much better STT accuracy than the actual customer population
- Not verifying post-call record integrity (VoiceCall, ConversationEntry) — this is the data foundation for all analytics and reporting

**Enterprise delivery considerations:**
- For 50+ Topic voice agents, create a test matrix (Topics × phrasings × edge cases) early — this becomes the acceptance test criteria
- Regression testing after Topic updates requires re-running affected test calls — maintain call recordings from initial testing for comparison
- Performance testing under load (100+ concurrent calls) should be a formal gate before production launch for large contact centers

**For a customer in UAT:** "The acceptance criteria for voice isn't just 'does it work' — it's 'what is the STT accuracy baseline, what is the containment rate target, and what is the maximum acceptable escalation rate.' Define those numbers now, measure them in UAT, and confirm before go-live."

## Customer Advisory Tips

**Custom Vocabulary for Amazon Transcribe is almost always needed in B2B environments.** Company names, product names, internal terminology, and industry acronyms routinely transcribe incorrectly. Add these to Amazon Transcribe Custom Vocabulary before STT accuracy testing — otherwise the baseline WER is artificially inflated.

**Test call realism matters.** Test from mobile phones in real-world acoustic conditions (car, open-plan office, home). Tests from a quiet conference room via a desk phone will show better STT accuracy than production calls.

**Define a "go/no-go" STT accuracy threshold** before UAT starts. Typical enterprise standard: WER < 10% overall, WER < 15% for domain-specific terms with Custom Vocabulary. Get customer sign-off on this standard before testing — don't let accuracy be judged subjectively at UAT sign-off.

## Key Facts to Memorize
- No native Salesforce voice call simulator — must make real phone calls to test
- Test order: Topics in text (Test tab) → voice channel integration → functional → edge cases → load
- WER (Word Error Rate) = measure of STT accuracy; target < 10% for production
- Custom Vocabulary in Amazon Transcribe reduces WER for domain-specific terms
- VoiceCall record populates 30–60 seconds after call ends — don't check immediately
- Test barge-in, DTMF fallback, silence handling, and escalation as separate explicit test scenarios
- ConversationEntry records = post-call transcript storage; verify count = transcript segment count

## Exam Traps
- "Agentforce Studio Test tab validates voice agent behavior completely" → False — it tests text-based Topic matching only; does not test STT, TTS, barge-in, or DTMF
- "Word Error Rate is measured in Salesforce" → False — WER is calculated by comparing AWS Transcribe output to reference transcripts (manual comparison)
- "Low confidence utterances in testing mean the Topic descriptions are wrong" → Not necessarily — low confidence often means STT quality issue (Custom Vocabulary gap), not Topic design problem
- "VoiceCall record shows all test data immediately after the call" → False — there is a 30–60 second delay for record population

## Practice Questions

**Q:** During voice agent testing, the Test tab in Agentforce Studio shows the correct Topic matching for all utterances, but during actual phone call testing, the agent frequently asks callers to repeat themselves. What is the most likely cause?
**A:** The Test tab uses typed text input, bypassing Speech-to-Text transcription. During real phone calls, STT adds variability — low confidence scores trigger re-prompts. The STT accuracy needs to be assessed (WER calculation), and Amazon Transcribe Custom Vocabulary should be configured for domain-specific terms.

**Q:** A tester completes 50 test calls. Post-call review shows VoiceCall records are created but ConversationEntry records are missing for all calls. What is the most likely cause?
**A:** Transcription is not enabled. Go to Setup → Service Cloud Voice Settings and verify Real-Time Transcription is turned on. ConversationEntry records are only created when transcription is active.

**Q:** An administrator needs to verify that the voice agent correctly handles callers who try to interrupt (barge-in) the TTS output. Which test layer addresses this?
**A:** Layer 4 — Edge Case Testing. The tester must make a real phone call and deliberately speak over the TTS output while the agent is responding, then verify the agent stops its output and processes the new input. This cannot be tested in the Agentforce Studio Test tab.
