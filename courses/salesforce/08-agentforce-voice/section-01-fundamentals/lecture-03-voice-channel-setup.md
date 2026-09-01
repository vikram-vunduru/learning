# Lecture 03: Voice Channel Setup

## Learning Objectives

- Navigate to Service Cloud Voice Setup in Salesforce and create a Voice Call Center linked to a telephony partner
- Assign agents to voice queues and configure presence statuses for voice-enabled agents
- Configure Omni-Channel routing rules for voice interactions
- Describe the Call Center Lightning page layout and softphone widget configuration
- Identify required licenses, permissions, and the sequence of setup steps for a production Agentforce Voice deployment

---

## Slides

### Slide 1: Finding Service Cloud Voice in Setup

**Visual:**
```
  Salesforce Setup
  ┌─────────────────────────────────────────────────────────┐
  │  Quick Find   [ Voice                               ]   │
  ├─────────────────────────────────────────────────────────┤
  │  Search Results:                                        │
  │                                                         │
  │  ▸ Voice Settings     ← global on/off + license check  │
  │                                                         │
  │  ▸ Voice Call Centers ← START HERE: link org to        │
  │    ◀─── [Start here]     telephony partner instance    │
  │                                                         │
  │  ▸ Voice Channel      ← create Omni-Channel voice      │
  │                          channel for routing            │
  └─────────────────────────────────────────────────────────┘

  Setup order:  Voice Settings → Voice Call Centers → Voice Channel
```

**Content:**
- Service Cloud Voice configuration lives in **Salesforce Setup** — there is no separate admin portal
- Access Setup → Quick Find → type "Voice" to see all Voice-related setup nodes
- Key setup nodes: **Voice Settings** (global on/off toggle + license), **Voice Call Centers** (create and manage call centers), **Voice Channel** (create the Omni-Channel channel for voice)
- Before any Voice setup is possible, the **Service Cloud Voice license** must be assigned to the org and to each agent who will use voice features
- Salesforce also requires the **Service Cloud Voice (Partner Telephony)** permission set license on each agent's user record — this is separate from the standard Service Cloud license

**Speaker Notes:** Many students are tripped up by the license requirements. There are two license layers: the org-level feature license (Service Cloud Voice) and the per-user permission set license. If agents cannot see the softphone widget after setup, missing permission set licenses is the first thing to check. Walk students through the quick find path — in a real implementation, knowing exactly where to navigate saves a lot of time.

---

### Slide 2: Creating a Voice Call Center

**Visual:**
```
  Setup → Voice Call Centers → New
  │
  ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  STEP 1: Select Telephony Partner                                │
  │                                                                  │
  │  Telephony Partner:  [ Amazon Connect          ▼ ]              │
  │                        Amazon Connect                            │
  │                        Genesys Cloud CX                          │
  │                        NICE CXone                                │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  STEP 2: Enter Call Center Details                               │
  │                                                                  │
  │  Name:         [ My Voice Call Center                      ]     │
  │  API Name:     [ My_Voice_Call_Center                      ]     │
  │  Instance ARN: [ arn:aws:connect:us-east-1:123456:instance/xyz ] │
  │                  ↑ Retrieved from AWS Amazon Connect console     │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  STEP 3: Assign Users                                            │
  │                                                                  │
  │  [ ] Jane Smith — Service Agent                                  │
  │  [ ] Bob Jones — Senior Agent                                    │
  │  [x] Ann Lee  — Voice Queue Agent                                │
  │  (one Call Center per user — users cannot be in two at once)     │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  STEP 4: Confirm and Save                                        │
  │  Salesforce creates the Call Center and establishes API linkage  │
  └──────────────────────────────────────────────────────────────────┘
```

**Content:**
- A **Voice Call Center** is the Salesforce configuration object that links your org to a specific telephony partner instance
- Navigate to Setup → Voice Call Centers → New
- Select your telephony partner (e.g., Amazon Connect)
- Enter the **Amazon Connect Instance ARN** — the unique AWS resource identifier for your Connect instance (found in the Amazon Connect console)
- Assign users to the Call Center — only users assigned to the Call Center can receive or make voice calls through that system
- A Salesforce org can have multiple Voice Call Centers (e.g., one for Amazon Connect and one for a legacy system on BYOT) but each user can only be assigned to one Call Center at a time
- After saving, Salesforce creates the Call Center and establishes the API linkage to the telephony partner using the Named Credential configured in Lecture 2

**Speaker Notes:** The Amazon Connect Instance ARN is a concept students need to be comfortable with even though they will not memorize it. It looks like: `arn:aws:connect:us-east-1:123456789:instance/abc123`. When students set this up in a hands-on lab, they retrieve this value from the Amazon Connect console. For the exam, the key fact is that the ARN is the identifier that links the Salesforce Call Center record to the specific AWS Connect instance — it is not a username or API key.

---

### Slide 3: Omni-Channel for Voice — Channel and Queue Configuration

**Visual:**
```
  ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
  │   1. VOICE CHANNEL     │────▶│  2. ROUTING CONFIG     │────▶│   3. VOICE QUEUE       │
  │   (Omni-Channel)       │     │                        │     │                        │
  ├────────────────────────┤     ├────────────────────────┤     ├────────────────────────┤
  │ • Type: Voice          │     │ • Routing Model:       │     │ • Assign Routing       │
  │ • Linked to: Voice     │     │   Most Available /     │     │   Configuration        │
  │   Call Center          │     │   Least Active         │     │ • Add agents or        │
  │ • Label / API Name     │     │ • Capacity units per   │     │   public groups as     │
  │                        │     │   voice call (e.g. 1)  │     │   queue members        │
  └────────────────────────┘     └────────────────────────┘     └────────────────────────┘

  ┌────────────────────────────────────────────────────────────────────────────────────┐
  │  Omni-Channel Supervisor (real-time view)                                          │
  │  ┌────────────┬─────────────────┬──────────────┬──────────────┐                   │
  │  │ Agent      │ Status          │ Call Duration │ Queue Depth  │                   │
  │  ├────────────┼─────────────────┼──────────────┼──────────────┤                   │
  │  │ Jane Smith │ On Call         │ 0:03:42       │ 2 waiting    │                   │
  │  │ Bob Jones  │ Available       │ —             │              │                   │
  │  └────────────┴─────────────────┴──────────────┴──────────────┘                   │
  └────────────────────────────────────────────────────────────────────────────────────┘
```

**Content:**
- Agentforce Voice uses **Omni-Channel** for routing — the same framework used for cases, chats, and emails
- **Step 1 — Create a Voice Channel:** Setup → Omni-Channel → Channels → New. Select "Voice" as the channel type. Link it to your Voice Call Center.
- **Step 2 — Create a Routing Configuration:** Defines how work items are prioritized and assigned. For voice, set the routing model (e.g., Most Available, Least Active) and the units of capacity a voice call consumes.
- **Step 3 — Create or Assign a Queue:** The queue holds inbound calls waiting for an agent. Assign the Routing Configuration to the queue. Assign agents (or public groups) as queue members.
- Voice calls consume Omni-Channel capacity — if an agent is set to handle 1 capacity unit and a voice call costs 1 unit, they cannot receive another work item while on a call
- Omni-Channel Supervisor shows live voice queue depth, agent presence status, and call duration in real time

**Speaker Notes:** A common implementation mistake is configuring the Omni-Channel routing for voice with the same capacity settings used for chat. Voice calls typically need a higher capacity cost because an agent cannot multitask on a call the way they can with a chat. Emphasize that capacity units are the mechanism for preventing agents from being overloaded with simultaneous voice calls and chat sessions. This is a practical implementation detail that also appears in exam scenarios about configuring workload balance.

---

### Slide 4: Configuring Presence Statuses for Voice

**Visual:**
```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ Presence Status Name     │ Channel Availability     │ Typical Use              │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Available for Voice      │ Voice channel — open      │ Agent ready to receive   │
│                          │                           │ inbound calls            │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ On Call                  │ Voice channel — busy      │ Set automatically when   │
│  (auto-set by system)    │ (no new work routed)      │ agent accepts a call     │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Wrap-Up                  │ No channels               │ After call ends — agent  │
│  (optional / timer-based)│ (no new work)             │ completes notes + review │
├──────────────────────────┼──────────────────────────┼──────────────────────────┤
│ Offline                  │ None                      │ Agent not working or     │
│                          │                           │ on break                 │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘

  Call lifecycle transitions (automatic):
  Available ──[call arrives]──▶ On Call ──[call ends]──▶ Wrap-Up ──[timer]──▶ Available
```

**Content:**
- **Presence statuses** control whether an agent can receive new work through Omni-Channel
- For voice, you need at least two statuses: an "Available" status linked to the Voice channel, and a "Busy" status (or use the built-in "On Call" status) that is set automatically when a call is active
- Navigate to Setup → Omni-Channel → Presence Statuses → New to create custom statuses
- Each status is linked to one or more service channels — a "Voice Available" status should be linked to the Voice channel only, so that agents in this status only receive voice calls
- When an agent accepts a voice call through the softphone, their status automatically transitions to "On Call" — this prevents new work items from being routed to them
- After a call ends, the agent typically enters a "Wrap-Up" status to complete after-call work (updating the case, reviewing the AI-generated summary). Wrap-Up time can be configured to auto-expire.
- Agents use the Omni-Channel widget in the utility bar to manually change their availability status

**Speaker Notes:** Presence status configuration is a topic where exam questions often present a scenario and ask which setup change would fix an observed problem. For example: "Agents are receiving new chat work items while on voice calls — how do you fix this?" The answer is to adjust the capacity cost of voice calls or ensure the "On Call" status is not linked to the chat channel. Students should understand that statuses and capacity costs work together to control agent workload.

---

### Slide 5: Call Center Lightning Page Layout

**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │  LIGHTNING APP — VOICE CALL RECORD PAGE                                      │
  ├───────────────────────────────────────────┬──────────────────────────────────┤
  │  (1) CALL INFORMATION                     │  (4) RELATED RECORDS             │
  │  ┌───────────────────────────────────┐    │  ┌──────────────────────────────┐│
  │  │ Duration:  0:04:22                │    │  │ Contact: Jane Smith          ││
  │  │ Direction: Inbound                │    │  │ Case:    #00123456           ││
  │  │ Status:    On Call                │    │  │ Account: Acme Corp           ││
  │  │ Caller:    +1-555-867-5309        │    │  └──────────────────────────────┘│
  │  └───────────────────────────────────┘    │  (screen pop auto-opens Contact) │
  │                                           │                                  │
  │  (2) REAL-TIME TRANSCRIPT                 │  (3) AGENTFORCE SUGGESTIONS      │
  │  ┌───────────────────────────────────┐    │  ┌──────────────────────────────┐│
  │  │ Customer: Hi I want to cancel     │    │  │ Suggested response:          ││
  │  │           my subscription...      │    │  │ "I can help with that.       ││
  │  │ Agent:    I can help with that,   │    │  │  Let me pull up your         ││
  │  │           let me look that up...  │    │  │  account..."                 ││
  │  │ Customer: It's account 12345...   │    │  │                              ││
  │  └───────────────────────────────────┘    │  │ Knowledge: Cancellation      ││
  │  (live scrolling — requires Contact Lens) │  │ Policy Article               ││
  │                                           │  └──────────────────────────────┘│
  │                                           │  (requires Agentforce license)   │
  ├───────────────────────────────────────────┴──────────────────────────────────┤
  │  UTILITY BAR                                                                  │
  │  [ (5) Softphone Widget ▲ ] [ Other utility items... ]                        │
  └──────────────────────────────────────────────────────────────────────────────┘
```

**Content:**
- The **Voice Call record** in Salesforce is the central object for a voice interaction — it stores call metadata, the full transcript, the AI summary, and links to related records
- The **Lightning page layout** for the Voice Call record is configured using Lightning App Builder, like any other Salesforce record page
- Key components to include on the agent desktop layout:
  - **Voice Call Record** component: shows caller ID, call duration, direction (inbound/outbound), and call status
  - **Transcript** component: displays the real-time transcript as the call progresses
  - **Einstein Agent Assist** component: shows Agentforce-generated suggestions (requires Agentforce Voice license)
  - **Related Records** panel: shows the matched Contact or Case — populated via the screen pop
- **Screen pop** automatically opens the matched Contact or Case record when a call is answered, based on caller phone number lookup

**Speaker Notes:** Students who have done Open CTI implementations will find this familiar — the layout concepts are similar. The key difference is the real-time Transcript component and the Einstein Agent Assist component, which are new to Agentforce Voice. For the exam, know that screen pop is driven by the phone number matching a Contact's Phone field — if there is no match, the agent sees an unmatched call record and must manually associate it. This is a common scenario in exam questions about call handling.

---

### Slide 6: Softphone Widget Configuration

**Visual:**
```
  Lightning App — Utility Bar (bottom of screen)
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │  UTILITY BAR                                                                  │
  │  ┌──────────────────────────────────────────────┐  [ Other Utility Items ]   │
  │  │  SOFTPHONE WIDGET (expanded)                 │                            │
  │  ├──────────────────────────────────────────────┤                            │
  │  │  Status: [ Available          ▼ ]            │                            │
  │  │                                              │  Configured via:           │
  │  │  Active Call:                                │  Setup → App Manager       │
  │  │    Jane Smith  +1-555-867-5309               │  → [App Name]              │
  │  │    Duration: 0:02:14                         │  → Utility Items           │
  │  │                                              │  → Add Utility Item        │
  │  │  [  Mute  ]  [  Hold  ]  [  Transfer  ]      │  → Voice Softphone         │
  │  │                                              │                            │
  │  │  [  Dialpad  ]   Wrap-Up: 0:00:45 remaining  │                            │
  │  └──────────────────────────────────────────────┘                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  (Widget provided by Amazon Connect managed package — not a custom build)
```

**Content:**
- The softphone widget is the agent's in-browser interface for making and receiving calls — it replaces a physical desk phone
- The widget is added to a Lightning App as a **Utility Item** via Setup → App Manager → select the app → Utility Items → Add Utility Item → Open CTI Softphone (or Voice Softphone for Partner Telephony apps)
- The widget communicates with the telephony partner in real time — clicking "Answer" in the widget accepts the call in Amazon Connect and updates the agent's presence status simultaneously
- Key softphone widget capabilities: answer/decline incoming calls, mute, hold, transfer, conference, manual dial
- Widget configuration includes: default height/width of the expanded panel, label displayed in the utility bar, and whether it opens automatically on incoming call
- For Amazon Connect deployments, the softphone widget is provided by the managed package — it is not a custom build

**Speaker Notes:** One practical gotcha: if the softphone widget is not appearing for an agent, the most common causes are (1) the agent is not assigned to a Voice Call Center, (2) the app they are using does not have the softphone utility item configured, or (3) they are missing the permission set license. Walk students through this troubleshooting checklist because it appears frequently in real implementations and occasionally in exam scenario questions.

---

### Slide 7: Running a Test Call and Required Permissions Summary

**Visual:**
```
  TEST CALL STEPS                            REQUIRED PERMISSIONS / LICENSES
  ───────────────────────────────            ───────────────────────────────────────────────
  1. Set agent status → Available            ┌─────────────────────────┬───────────────────────┐
        │                                    │ License / Permission    │ Where Assigned        │
        ▼                                    ├─────────────────────────┼───────────────────────┤
  2. Dial claimed phone number               │ Service Cloud Voice     │ Org-level (Setup →    │
     from a mobile phone                    │ feature license         │ Company Information)  │
        │                                    ├─────────────────────────┼───────────────────────┤
        ▼                                    │ SCV (Partner Telephony) │ Per user (Setup →     │
  3. Verify call appears in                 │ permission set license  │ Users → Manage Lic.)  │
     softphone widget                       ├─────────────────────────┼───────────────────────┤
        │                                    │ Service Cloud User      │ Per user profile      │
        ▼                                    │ feature license         │                       │
  4. Accept call; verify real-time          ├─────────────────────────┼───────────────────────┤
     transcript populates                   │ Omni-Channel permission │ Profile or perm set   │
        │                                    ├─────────────────────────┼───────────────────────┤
        ▼                                    │ Einstein Agent Assist   │ Add-on license for    │
  5. End call; verify Voice Call            │ add-on                  │ AI suggestions panel  │
     record shows: Completed,               └─────────────────────────┴───────────────────────┘
     full transcript, AI summary
```

**Content:**
- **Required Licenses and Permissions:**
  - Service Cloud Voice license: org-level, enables the feature
  - Service Cloud Voice (Partner Telephony) permission set license: per user, assigned in Setup → Users → Manage Licenses
  - Service Cloud User feature license: standard Service Cloud access
  - Omni-Channel permission: included in the Service Cloud profile or granted via permission set
  - Einstein Agent Assist add-on: required to use the Agentforce suggestion panel (autonomous agent functionality requires Agentforce licenses)

- **Test Call Verification Checklist:**
  - Agent status shows "Available" in the Omni-Channel widget
  - Inbound call triggers a screen pop with the correct Contact record
  - Real-time transcript populates during the call
  - After the call, the Voice Call record shows status = Completed, transcript is complete, AI summary is populated
  - Agentforce suggestions appeared during the call (if agent assist is configured)

**Speaker Notes:** The test call is the moment of truth for any Salesforce Voice implementation. Walk students through the verification checklist as a mental model for both real implementations and exam troubleshooting questions. If a question says "the transcript is not appearing during the call," the issue is likely in Contact Lens configuration or the Named Credential. If the screen pop is not working, the Contact's phone number field does not match the caller's ANI. If the AI summary is not generating, the post-call summarization flow may not be configured.

---

## Recording Script

Welcome to Lecture 3. Over the past two lectures we have established what Agentforce Voice is and how it integrates with telephony partners. Now we get to the hands-on part — walking through the actual Salesforce Setup steps that bring a voice channel to life. By the end of this lecture you should be able to set up a working voice channel from scratch.

Let's start in Salesforce Setup. Open your org, go to Setup, and in the Quick Find box type "Voice." You will see a handful of results: Voice Settings, Voice Call Centers, and Voice Channel. These three nodes are your primary setup locations. Voice Settings is where you can verify the feature is enabled and check your license status. Voice Call Centers is where you create the link between Salesforce and your telephony partner. Voice Channel is where you create the Omni-Channel channel for voice. Before you touch any of these, make sure two things are true: the Service Cloud Voice org feature license is active, and each agent who will use voice has the "Service Cloud Voice (Partner Telephony)" permission set license assigned to their user record. Missing either of these will cause problems that look like configuration errors but are actually licensing gaps.

Now let's create a Voice Call Center. Go to Setup → Voice Call Centers → New. You will see a wizard that asks you to select your telephony partner. Select Amazon Connect, or whichever partner you are using. Then you will be prompted for the Call Center name and — critically — the Amazon Connect Instance ARN. The ARN is the unique AWS identifier for your Connect instance, and it looks something like "arn:aws:connect:us-east-1:123456789:instance/abc123". You get this value from the Amazon Connect console in AWS. Enter it accurately — a typo here will break the entire integration. After you save the Call Center, assign your agents to it. Remember that a user can only belong to one Call Center at a time.

With the Call Center created, you now need to wire up Omni-Channel so that inbound voice calls are routed to agents. There are three objects to create: a Voice Channel, a Routing Configuration, and a Queue. Start with the Voice Channel — go to Setup → Omni-Channel → Channels → New, select Voice as the type, and link it to your Call Center. Then create a Routing Configuration that defines how calls are distributed: which routing model (Most Available is common for voice), and how many capacity units a voice call consumes. Then create or use an existing Queue, assign the Routing Configuration to it, and add your agents as queue members. After this, inbound calls to your Amazon Connect number will route through Omni-Channel to available agents in that queue.

Next, set up your Presence Statuses. At minimum, create an "Available for Voice" status linked to the Voice channel, and confirm that an "On Call" or "Busy" status exists for when agents are active on calls. When an agent accepts a call, their status automatically transitions to the active-call status, preventing other work items from being routed to them. When the call ends, they can manually transition to a Wrap-Up status to complete after-call tasks, or you can configure auto-wrap-up with a timer.

Now let's talk about the agent desktop — specifically, the Lightning page layout for the Voice Call record. Using Lightning App Builder, add the key components: the Voice Call Record component for call metadata, the Transcript component for the real-time transcription feed, the Einstein Agent Assist component for Agentforce suggestions, and a Related Records panel for the screen-popped Contact or Case. The screen pop is automatic when the caller's phone number matches a Contact's phone field in Salesforce — no extra configuration is needed beyond having the phone number data in your org.

The softphone widget lives in the utility bar at the bottom of the Lightning app. Go to Setup → App Manager, select the Lightning app your agents use, click Utility Items, and add the Voice Softphone utility item. Configure the default height and width, and optionally set it to auto-open on incoming calls. For Amazon Connect deployments, this widget is provided by the managed package you installed in the previous lecture.

Finally, let's run a test call. Set your agent status to Available in the Omni-Channel widget. Dial the phone number you claimed in Amazon Connect from a mobile phone. You should see the call appear in the softphone widget. Accept it. Verify that the real-time transcript starts populating — if Contact Lens is enabled and the Named Credential is correct, this will happen within seconds. End the call and check the Voice Call record: the status should be Completed, the transcript should be fully populated, and the AI-generated call summary should appear in the summary field. If any of these steps fail, the troubleshooting sequence is: check Named Credential validity, check Contact Lens is enabled in Amazon Connect, check the agent's permission set license, and check that the softphone widget is added to the correct app.

That is the end of Section 1. You now understand what Agentforce Voice is, how it integrates with telephony partners, and how to configure it from the ground up in Salesforce Setup. In Section 2 we will go deeper on the AI capabilities — real-time transcription, agent assist, autonomous voice bots, and Einstein Conversation Mining.

---

## Exam Tips

- The sequence of setup steps is testable: **Voice Call Center** must be created before a **Voice Channel** can be linked to it; the **Voice Channel** must exist before it can be assigned to an **Omni-Channel queue**. Know the order.
- **Two license layers** are required for each voice agent: the org-level Service Cloud Voice feature license AND the per-user "Service Cloud Voice (Partner Telephony)" permission set license. A missing permission set license is the most common cause of agents not seeing the softphone widget.
- **Screen pop** works by matching the caller's ANI (phone number) to a Contact's phone field. If a question asks why screen pop is not working for new customers, the answer is that no Contact record exists with that phone number — the agent must manually create or associate one.
- When an exam question describes agents receiving chat or case work while on a voice call, the fix is in **Omni-Channel capacity configuration** — increase the capacity cost of a voice call so it fills the agent's available capacity.
- The **Amazon Connect Instance ARN** is required when creating the Voice Call Center in Salesforce. It is retrieved from the Amazon Connect AWS console — it is not a Salesforce-generated value.

---

## Lecture Summary

- Service Cloud Voice is configured in Salesforce Setup under Voice Settings, Voice Call Centers, and Voice Channel nodes; a Service Cloud Voice license must be active before any configuration is possible
- A Voice Call Center links the Salesforce org to a specific telephony partner instance using the partner's instance identifier (e.g., Amazon Connect Instance ARN)
- Omni-Channel routing for voice requires three objects: a Voice Channel, a Routing Configuration (capacity + routing model), and a Queue with assigned agents
- Presence statuses control agent availability for voice; the "On Call" status fires automatically when a call is active, preventing additional work from being routed to the agent
- The agent desktop includes the Voice Call record layout (transcript, AI suggestions, related records) and the softphone widget added as a Lightning app utility item
- Before going live, run a test call that validates: softphone widget display, inbound call routing, real-time transcript population, screen pop, and post-call AI summary generation

---

## Mini Quiz

**Q1:** A Salesforce administrator has set up a Voice Call Center and created a Voice Channel, but agents are reporting that the softphone widget is not visible in their Lightning app. What is the most likely cause?

A) The Voice Call Center is not linked to an Omni-Channel queue
B) The softphone widget has not been added as a Utility Item in App Manager for the agents' Lightning app
C) The Amazon Connect Contact Lens feature is not enabled
D) Agents need to enable "Voice" in their personal Omni-Channel settings

**Answer:** B — The softphone widget must be explicitly added as a Utility Item via Setup → App Manager for the Lightning app the agents are using. It does not appear automatically after Call Center creation. Contact Lens (C) affects transcription, not widget visibility.

---

**Q2:** An agent is Available in Omni-Channel and accepts an inbound voice call. During the call, they also receive a new inbound chat work item. How should the administrator prevent this from happening?

A) Set the agent's profile to "Voice Only" 
B) Create a separate Presence Status for voice that does not include the chat channel
C) Increase the capacity cost of voice calls in the Routing Configuration so it fills the agent's total capacity
D) Configure the chat queue to exclude agents who are members of the voice queue

**Answer:** C — Increasing the capacity cost of a voice call so it equals the agent's total capacity prevents other work items from being routed to them while on a call. Option B (separate presence status) could also work if the agent manually switches to a voice-only status, but the more reliable solution is capacity configuration. Option D would exclude agents from chat entirely, not just when on a call.

---

**Q3:** After completing all Voice Call Center and Omni-Channel configuration, an administrator runs a test call. The softphone widget shows the inbound call, the agent accepts it, but no real-time transcript appears in the Voice Call record. What is the most likely cause?

A) The Voice Call record page layout does not include the Transcript component
B) The Agentforce agent has no Topics configured
C) Amazon Connect Contact Lens is not enabled on the Amazon Connect instance
D) The agent's presence status transitioned to "On Call" before the transcript could initialize

**Answer:** C — Real-time transcription in an Amazon Connect deployment is generated by Contact Lens. If Contact Lens is not enabled on the Amazon Connect instance, no transcript data is sent to Salesforce. Option A (missing Transcript component on the page layout) would mean the transcript is generated but not visible — a different symptom. Option D describes normal behavior, not a failure.
