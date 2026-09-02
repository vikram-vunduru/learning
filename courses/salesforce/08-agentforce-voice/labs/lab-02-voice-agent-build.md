# Lab 02 — Voice Agent Build

## What You Need to Be Able to Do

This lab tests your ability to build a working Agentforce Voice autonomous agent from scratch — including Topics, Actions, Voice Channel configuration, persona setup, and escalation handling.

**Prerequisite:** Lab 01 (Amazon Connect connected to Salesforce) must be complete.

---

### Part 1: Create the Agentforce Voice Agent

- [ ] Navigate to Agentforce Studio → New Agent
- [ ] Select agent type: Agentforce for Service
- [ ] Name the agent (e.g., "Aria — Voice Support Agent")
- [ ] Set agent role description — write in 2–3 sentences: what callers this agent helps, what it can and cannot do
- [ ] Write the system prompt (LLM instructions):
  - [ ] Include the persona name (must match Voice Channel card configuration)
  - [ ] Include tone/style guidance (conversational, concise, no markdown, no bullet lists)
  - [ ] Include what to say when escalating to a human
  - [ ] Include what NOT to say (don't mention Salesforce, don't discuss system errors in detail)
- [ ] Save the agent (draft version)

---

### Part 2: Build at Least Two Voice Topics

**Topic 1: Case Status Inquiry**
- [ ] Add Topic → Name: "Case Status"
- [ ] Write Topic Description in first-person voice: "Customer wants to check the status of an open case, asking where their request stands or when it will be resolved. Example phrases: 'what's the status of my case,' 'has my issue been resolved,' 'when will my ticket be fixed.'"
- [ ] Add instructions for what the agent should do (look up case, read status aloud, offer next step)
- [ ] Add Action: Apex or Flow action that queries open Cases by Contact (ANI lookup first, then verify with caller)

**Topic 2: Appointment Confirmation**
- [ ] Add Topic → Name: "Appointment Confirmation"
- [ ] Write Topic Description: "Customer wants to confirm, cancel, or reschedule an appointment. Example phrases: 'I need to confirm my appointment,' 'can I reschedule,' 'cancel my appointment for tomorrow.'"
- [ ] Add Action: Flow action that queries Service Appointments by Contact
- [ ] Add confirmation branch: confirm / reschedule (transfer to scheduling queue) / cancel (update record + confirm to caller)

---

### Part 3: Configure the Voice Channel

- [ ] In Agentforce Studio → [Agent] → Channels tab → Add Channel → Voice
- [ ] Connected Telephony: select the Amazon Connect integration configured in Lab 01
- [ ] Enable Agentforce Voice: toggle ON
- [ ] Configure Voice Persona:
  - [ ] Persona Name: "Aria" (must EXACTLY match the name in the system prompt)
  - [ ] TTS Voice: select an Amazon Polly voice (e.g., Joanna, US English Female)
  - [ ] Adjust speech rate and pitch as needed → play sample
- [ ] Configure Escalation settings:
  - [ ] Fallback Queue: select the Voice Human Queue created in Lab 01
  - [ ] Transfer Type: Warm
  - [ ] Max Conversation Turns: 20
  - [ ] Escalation trigger phrases: "speak to an agent," "transfer me," "human," "real person"
- [ ] Save the channel configuration

---

### Part 4: Build the Voice Call Flow (IVR Entry Point)

- [ ] Setup → Flows → New Flow → Autolaunched Flow → Voice Call Flow (subtype)
- [ ] Add Speak element: "Thank you for calling. I'm Aria, your virtual assistant. How can I help you today?"
- [ ] Add Pause element (1 second after Speak)
- [ ] Add Get Input element (speech input, max 10 seconds, 3 retries, DTMF fallback)
- [ ] Add Decision element: if no input after retries → Transfer element → Fallback Queue
- [ ] Activate the Flow
- [ ] In the Voice Channel card → Associate the Agentforce agent (flow activates at call arrival)

---

### Part 5: Test the Voice Agent

- [ ] Set Omni-Channel status to Available
- [ ] Call the Amazon Connect phone number from a mobile phone
- [ ] Verify: Aria's greeting message plays (correct TTS voice)
- [ ] Test Happy Path — Case Status:
  - [ ] Say: "What's the status of my case"
  - [ ] Verify: agent routes to Case Status Topic
  - [ ] Verify: action executes and case status is read aloud
- [ ] Test Happy Path — Appointment Confirmation:
  - [ ] Say: "I want to confirm my appointment"
  - [ ] Verify: agent routes to Appointment Confirmation Topic
- [ ] Test Escalation:
  - [ ] Say: "I need to speak to a human"
  - [ ] Verify: warm transfer to human queue with transcript context
- [ ] Test DTMF Fallback:
  - [ ] Remain silent at the Get Input prompt
  - [ ] Verify: re-prompt plays, then DTMF options are offered
- [ ] Test Barge-In:
  - [ ] Start speaking while TTS is playing
  - [ ] Verify: TTS stops and agent processes your input
- [ ] Test Out-of-Scope:
  - [ ] Say something the agent isn't built for (e.g., "I want to order a pizza")
  - [ ] Verify: agent acknowledges gracefully and offers help or escalation

---

### Part 6: Verify Post-Call Records

- [ ] Open the VoiceCall record created by the test call
- [ ] Verify:
  - [ ] Status = Completed
  - [ ] AI Disposition = populated (if configured)
  - [ ] Linked Contact = correct (if ANI matched)
- [ ] Open ConversationEntry records (Related tab on VoiceCall)
- [ ] Verify:
  - [ ] Each utterance is a separate record
  - [ ] Speaker labels show CUSTOMER and VOICE_BOT correctly
  - [ ] Confidence scores are populated
  - [ ] No PII in transcript (if PII redaction is enabled)

---

### Lab Complete Checklist

- [ ] Voice agent created with system prompt and persona name consistent with Voice Channel card
- [ ] At least two Topics with voice-optimized descriptions (first-person, example phrases)
- [ ] Voice Channel added in Agentforce Studio with warm transfer and fallback queue configured
- [ ] Voice Call Flow built as Autolaunched (Voice Call subtype) — NOT a Screen Flow
- [ ] Successful test call with correct Topic matching for both Topics
- [ ] Escalation path tested and warm transfer delivered transcript to human agent
- [ ] DTMF fallback tested and functional
- [ ] Post-call VoiceCall and ConversationEntry records verified

---

### Common Failure Points to Remember

| Symptom | Root Cause | Fix |
|---|---|---|
| Agent introduces itself with wrong name | Persona Name in Voice Channel card doesn't match system prompt name | Update both to be identical |
| Topics don't match voice utterances but work in Test tab | Topic descriptions are formal/written-style, not conversational | Rewrite Topic descriptions in first-person conversational phrases |
| Agent goes silent mid-call during action | Screen Flow used as action (incompatible with voice) | Replace Screen Flow with Autolaunched Flow |
| Warm transfer arrives with no context | Transfer configured as cold transfer | Change Transfer Type to Warm in Voice Channel escalation settings |
| No re-prompt after caller silence | Get Input retries not configured | Set retry count and timeout in Get Input element |
| Agent changes published without effect | New settings saved as Draft, not published | Publish the agent version in Agentforce Studio |
