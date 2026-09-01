# Lab 02: Building a Voice Agent with Agentforce

## Overview

In this lab you will create a complete Agentforce voice agent from scratch. Starting from the Amazon Connect infrastructure you set up in Lab 01, you will build a Service Agent in Agentforce Studio, configure it for the voice channel, create a Voice Flow action that looks up a caller's open case by phone number, and test the agent in both Autonomous and Agent Assist modes.

By the end of this lab, a caller who dials your test number will be greeted by an AI agent, asked for their needs, have their open case retrieved and read aloud, and — depending on the mode you configure — either be handled fully by the AI or have the AI assist a human agent with real-time suggestions.

## Prerequisites

- Lab 01 completed: Amazon Connect instance active, phone number claimed, Call Center configured in Salesforce, test agent user added
- Agentforce enabled in your Salesforce org (Agentforce license required; available in Developer Edition orgs with Agentforce enabled)
- At least one Contact record in your Salesforce org with a phone number that matches your test mobile number
- At least one open Case record associated with that Contact
- Service Console app accessible in your org

## Estimated Time

75 minutes

---

## Lab Steps

### Step 1: Create a Service Agent in Agentforce Studio

1. In Salesforce Setup, navigate to **Agent Studio** (use the Quick Find box to search "Agentforce" or "Agent Studio" and click the result). Alternatively, find it at **Setup > Einstein > Agentforce > Agent Studio**.
2. Click **New Agent** to start the agent creation wizard.
3. On the agent type selection screen, select **Service Agent**. Service Agents are designed for customer-facing interactions including voice.
4. Give your agent a name: `Voice Lab Service Agent`.
5. For **Description**, enter: `AI service agent for voice channel lab — handles case status inquiries and escalates to human agents.`
6. Leave **Default Language** as English.
7. Click **Next**.
8. On the **Channel** step, you will configure the voice channel association in Step 2 — for now, proceed through the wizard.
9. Review the summary and click **Create Agent**. The agent opens in Agent Studio.

**Expected Result:** A new Service Agent named "Voice Lab Service Agent" appears in Agent Studio with a status of Draft.

---

### Step 2: Configure the Voice Channel on the Agent

1. In Agent Studio with your Voice Lab Service Agent open, click the **Channels** tab.
2. Click **Add Channel**.
3. From the channel type dropdown, select **Voice**.
4. In the **Voice Call Center** dropdown, select the Call Center you created in Lab 01 (`Voice Lab Call Center` or the name you gave it).
5. In the **Phone Number** field, select the Amazon Connect phone number claimed in Lab 01.
6. **Greeting Message:** Enter a greeting that the agent will speak when a call connects:
   `Hello, thank you for calling. I'm your Salesforce AI assistant. I can help you check the status of an open case or connect you with a support agent. How can I help you today?`
7. **End Call Message:** Enter: `Thank you for calling. Have a great day. Goodbye.`
8. **Agent Assist Mode:** Leave unchecked for now — you will test Autonomous mode first and switch to Agent Assist in Step 6.
9. Click **Save**.

**Expected Result:** The Voice channel appears in the agent's Channels tab with your Amazon Connect phone number associated. The agent is now configured to handle calls from that number.

---

### Step 3: Build a Voice Flow Action — Case Status Lookup

Now you will create the Salesforce Flow that the Agentforce agent invokes to look up a caller's open case.

1. In Salesforce Setup, go to **Process Automation > Flows**.
2. Click **New Flow**.
3. Select **Autolaunched Flow (No Trigger)** and click **Create**.
4. Name the Flow: `Voice Get Case Status by ANI`.
5. Add an **Input Variable** to receive the caller's phone number:
   - Click the **Variables** panel, then **New Resource > Variable**
   - API Name: `callerPhoneNumber`
   - Data Type: Text
   - Available for Input: checked
   - Available for Output: unchecked
   - Click **Done**
6. Add an **Output Variable** for the case summary:
   - New Resource > Variable
   - API Name: `caseStatusSummary`
   - Data Type: Text
   - Available for Input: unchecked
   - Available for Output: checked
   - Click **Done**
7. On the Flow canvas, add a **Get Records** element:
   - Label: `Find Contact by Phone`
   - Object: `Contact`
   - Condition: `Phone Equals {!callerPhoneNumber}` OR `MobilePhone Equals {!callerPhoneNumber}`
   - How Many Records: First record only
   - Store Field Values in Variable: store `Id` in a new Text variable `contactId`
   - Click **Done**
8. Add a second **Get Records** element below the first:
   - Label: `Find Open Case for Contact`
   - Object: `Case`
   - Conditions: `ContactId Equals {!contactId}` AND `Status Does Not Equal Closed`
   - How Many Records: First record only
   - Sort by: `CreatedDate Descending` (get the most recent open case)
   - Store fields: `CaseNumber` → Text variable `caseNumber`; `Subject` → Text variable `caseSubject`; `Status` → Text variable `caseStatus`
   - Click **Done**
9. Add an **Assignment** element:
   - Label: `Build Response Text`
   - Set `{!caseStatusSummary}` to: `"We found your most recent open case, number " & {!caseNumber} & ". Subject: " & {!caseSubject} & ". Current status is " & {!caseStatus} & "."`
   - Click **Done**
10. Add a **Decision** element to handle the no-match path:
    - Label: `Was Contact Found?`
    - Outcome 1: `Contact Found` — Condition: `{!contactId} Is Null = False`
    - Default Outcome: `No Contact Found`
    - Connect `Find Contact by Phone` → `Was Contact Found?`
    - Connect `Contact Found` outcome → `Find Open Case for Contact`
    - Connect `Find Open Case for Contact` → `Build Response Text`
    - Connect `No Contact Found` → Add an Assignment: `{!caseStatusSummary}` = `"I was not able to find an account associated with your phone number. Let me connect you with a support agent."`
    - Connect all paths to the **End** element
11. Click **Save** and name the Flow `Voice Get Case Status by ANI`. Click **Activate**.

**Expected Result:** The Autolaunched Flow is Active and appears in your Flows list. It accepts a phone number input and returns a case status text string.

---

### Step 4: Register the Flow as an Agent Action

1. Return to **Agent Studio > Voice Lab Service Agent**.
2. Click the **Actions** tab.
3. Click **Add Action**.
4. In the action type dropdown, select **Flow**.
5. Search for and select `Voice Get Case Status by ANI`.
6. Give the action a label: `Get Case Status`.
7. For **Description** (this is the instruction the AI uses to decide when to invoke this action): `Use this action when the caller asks about their case status, wants to know about their open issue, or mentions a support ticket. The action looks up their case using their phone number.`
8. Map the Flow input variable:
   - `callerPhoneNumber` → Map to **Caller Phone Number** (the ANI from the call context)
9. Map the Flow output variable:
   - `caseStatusSummary` → Map to a response field that the agent will speak
10. Click **Save**.

**Expected Result:** The Get Case Status action appears in the agent's Actions tab. The agent will now invoke this Flow when a caller asks about their case.

---

### Step 5: Configure the Agent Topic and Instructions

1. In Agent Studio, click the **Topics** tab.
2. Click **New Topic**.
3. Topic Name: `Case Status Inquiry`
4. Description: `Handles caller requests for the status of their open support cases.`
5. Scope: Add instructions in plain English:
   - "When a caller asks about their case or support ticket, call the Get Case Status action using their phone number."
   - "After retrieving the case status, read the result to the caller naturally."
   - "If no case is found, inform the caller politely and offer to transfer to a human agent."
   - "If the caller asks to speak to an agent at any point, transfer them to the Support queue immediately."
6. Click **Save** and return to the main agent view.
7. In the agent's **General** settings, add this System Prompt instruction: `You are a helpful voice assistant for a support center. Keep responses concise — no more than two or three sentences at a time. Always offer to connect the caller with a human agent if their issue is not resolved.`
8. Click **Save**.

---

### Step 6: Test in Autonomous Mode Using the Conversation Simulator

Before making a real call, test the agent logic using the Conversation Simulator.

1. In Agent Studio, click **Test** or **Simulate** in the top-right corner of the Voice Lab Service Agent page.
2. The Conversation Simulator opens as a text-based chat interface.
3. Type: `I want to check on my support case`
4. Observe: the agent should respond and invoke the Get Case Status action. Since the simulator does not have a real ANI, it may return the "no account found" response — this is expected.
5. Type: `Can I speak to an agent?`
6. Observe: the agent should respond that it is transferring you and invoke a Transfer to Agent action.
7. Type a few off-topic messages (e.g., `What is the weather today?`) to verify the agent stays in scope and redirects appropriately.
8. Review the Action trace panel on the right side of the simulator — this shows which actions were invoked, what inputs were sent, and what outputs were received.

**Expected Result:** The agent responds intelligently to case inquiries, invokes the Get Case Status action (even if the result is "no match" in simulator), and offers agent transfer appropriately.

---

### Step 7: Test with a Real Call in Autonomous Mode

1. Ensure your test Contact record in Salesforce has a phone number matching your mobile number. Edit the Contact if needed.
2. Ensure the open Case is associated with that Contact and has a Status that is not Closed.
3. In Salesforce, set your agent status to **Away** or **Offline** in the Omni-Channel widget — in Autonomous mode, calls should NOT route to a human agent unless explicitly escalated. (If you are Available, the call may route to you as a human agent instead.)
4. From your mobile phone, dial the Amazon Connect number.
5. Listen for the greeting message you configured in Step 2.
6. Say: `"I want to check the status of my open case"`
7. Wait for the agent to respond. If the ANI matches your Contact, the agent should invoke the Flow, retrieve your case details, and read them aloud.
8. Say: `"Can you transfer me to a human agent?"`
9. Verify the call transfers to the Omni-Channel queue. Switch yourself to **Available** in the Omni-Channel widget if needed to receive the transferred call.
10. After the test, find the VoiceCall record in Salesforce and review: Intent field, transcript (if available), linked Contact and Case records.

**Expected Result:** The Agentforce autonomous agent greets the caller, retrieves and reads case status, and transfers to the human queue on request. A VoiceCall record exists with intent data.

---

### Step 8: Switch to Agent Assist Mode and Test

1. Return to **Agent Studio > Voice Lab Service Agent > Channels > Voice**.
2. Edit the Voice channel configuration and check the **Agent Assist Mode** checkbox. Click **Save**.
3. In Salesforce, set your Omni-Channel status to **Available** so calls route to you immediately.
4. Dial the Amazon Connect number from your mobile phone.
5. In the Salesforce Service Console, the call should ring your CTI widget. Accept the call.
6. After accepting, look for the **Agent Assist** panel in the Service Console — this may appear as a sidebar panel or a utility bar component depending on your console layout.
7. Speak as the caller: say something like `"I'd like to know about my open case"`.
8. Observe the Agent Assist panel: within 1-2 seconds of your utterance, AI suggestions should appear. These may include:
   - A suggested Knowledge article
   - The result of the Get Case Status action (if auto-triggered in assist mode)
   - A Next Best Action if configured
9. As the agent, click one of the suggestions to accept it. Observe how the suggestion populates in the call notes or a recommended response field.
10. End the call and review the VoiceCall record — the transcript should include the full conversation, and the Agent Assist interactions may be captured in related records.

**Expected Result:** In Agent Assist mode, you receive the call as a human agent, the AI Assist panel activates, and suggestions appear in real time as the conversation progresses.

---

## Verification

Confirm all of the following before considering this lab complete:

- [ ] A Service Agent named "Voice Lab Service Agent" exists in Agent Studio with Draft or Active status
- [ ] The Voice channel is configured on the agent with the Amazon Connect phone number from Lab 01
- [ ] The `Voice Get Case Status by ANI` Flow is Active in Salesforce
- [ ] The Flow is registered as an Agent Action with correct input/output mappings
- [ ] Conversation Simulator testing shows the agent invokes the correct action for case status queries
- [ ] A real test call in Autonomous mode results in the agent speaking a response (even if case lookup returns no match)
- [ ] A VoiceCall record is created with the test call data after each real call
- [ ] Agent Assist mode is successfully switched on and the assist panel appears during a live call

---

## Troubleshooting

**Agent does not invoke the Get Case Status action in Conversation Simulator:** Review the action description — the AI uses this to decide when to invoke the action. Make sure it explicitly mentions "case status," "open case," and "support ticket." Also verify the Flow is Active (a Draft Flow cannot be invoked).

**Real call connects but agent does not speak:** Verify the Voice channel Greeting Message is saved. Also check Amazon Connect CloudWatch logs for the Contact Flow execution — the speech synthesis may be failing if the text contains unsupported characters.

**ANI does not match Contact phone number:** Amazon Connect delivers the ANI in E.164 format (+1XXXXXXXXXX for US numbers). Your Salesforce Contact's Phone field may be stored in a different format (e.g., (XXX) XXX-XXXX). Update your Contact's phone to E.164 format for lab testing, or add phone normalization logic to the Flow.

**Agent Assist panel does not appear after accepting call:** The Agent Assist UI component must be added to your Service Console layout. In Setup > App Manager > Service Console > Edit, add the **Agent Assist** utility component to the utility bar, or check with your admin that the Agentforce Agent Assist component is included in the console page layout.

**Transfer to human agent does not work in Autonomous mode:** Verify the `Voice Support Queue` from Lab 01 is Active and that at least one agent (you) is a member of the queue with Available status. In Setup > Queues, confirm the queue has VoiceCall as a supported object.

**VoiceCall record not showing intent:** The Intent field is populated by the Agentforce agent during the call. If the Intent field is empty after an autonomous call, check the Agentforce agent's deployment status (must be Active, not Draft) and the agent's topic configuration.

---

## Lab Summary

In this lab you built a complete Agentforce voice agent and validated it in two operating modes:

- Created a Service Agent in Agentforce Studio with voice channel configuration, greeting/end messages, and system prompt instructions
- Built an Autolaunched Flow to look up open cases by caller ANI, with both successful match and no-match paths
- Registered the Flow as an Agent Action with descriptive instructions so the AI knows when to invoke it
- Configured a Topic with plain-English instructions governing how the agent handles case status inquiries
- Validated agent logic using the text-based Conversation Simulator before making real calls
- Tested the agent in Autonomous mode — AI handles the full call — and verified case lookup, response, and escalation behavior
- Switched to Agent Assist mode — human agent handles the call with AI suggestions in the assist panel — and verified real-time suggestions appeared during a live call

The pattern established in this lab — Voice Flow for structured automation, Agentforce agent for conversational NLU, Agent Assist for human augmentation — is the core architecture pattern for all Agentforce Voice production deployments.
