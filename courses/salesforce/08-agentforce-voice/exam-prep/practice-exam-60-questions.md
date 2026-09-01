# Practice Exam: Agentforce Voice (60 Questions)

## Exam Information

This practice exam covers Agentforce Voice — Salesforce's AI-powered voice experience built on Service Cloud Voice. Topics include telephony integration (Amazon Connect, Genesys Cloud CX, NICE CXone), voice agent configuration, real-time transcription, agent assist, autonomous voice bots, omni-channel routing, screen pop, call summarization, VoiceCall objects, and operational monitoring. Questions are scenario-based and mirror the style of Salesforce certification exams.

**Scoring guide:** 48/60 (80%) = Exam-ready. Below 40 = Review fundamentals.

---

## Section 1: Voice Architecture & Setup (Questions 1–15)

**Q1.** A company is implementing Service Cloud Voice for the first time. Their existing telephony infrastructure is Amazon Connect. Which component acts as the bridge between Amazon Connect and Salesforce Service Cloud?

A) Einstein Voice Studio  
B) Service Cloud Voice Partner Telephony  
C) Service Cloud Voice with Amazon Connect (native integration)  
D) Salesforce CTI Adapter  

**Answer: C** — Service Cloud Voice with Amazon Connect is a native, out-of-the-box integration that embeds the Amazon Connect Contact Control Panel (CCP) directly into the Salesforce Agent Console. No additional CTI adapter is required.

---

**Q2.** A Salesforce admin is configuring Service Cloud Voice and needs to choose a telephony provider. Their company uses Genesys Cloud CX. What type of integration does Salesforce offer for this scenario?

A) Native integration identical to Amazon Connect  
B) Partner Telephony integration via the Service Cloud Voice Partner API  
C) Open CTI with manual transcription configuration  
D) Genesys is not supported; the company must migrate to Amazon Connect  

**Answer: B** — Genesys Cloud CX (along with NICE CXone) integrates with Service Cloud Voice through the Partner Telephony model, which uses the Service Cloud Voice Partner API. This differs from the Amazon Connect native integration.

---

**Q3.** During Service Cloud Voice setup, an admin enables real-time transcription. Where does the live call transcript appear for a human service agent?

A) In a separate browser tab opened by Salesforce  
B) In the Voice Call record's Related tab after the call ends  
C) Inline within the agent console softphone panel during the call  
D) In the Einstein Analytics dashboard  

**Answer: C** — Real-time transcription surfaces as a live, scrolling transcript directly in the agent's softphone panel (the embedded telephony experience) so the agent can read what the customer is saying in real time without switching views.

---

**Q4.** A company wants to allow voice agents to handle calls autonomously — without any human agent — for routine inquiries like order status. Which Agentforce capability should they configure?

A) Agent Assist with screen pop  
B) Autonomous Voice Agent  
C) Einstein Bot for Voice  
D) Interactive Voice Response (IVR) with DTMF only  

**Answer: B** — An Autonomous Voice Agent is an Agentforce agent configured to handle the full call lifecycle without a human. It uses NLP/LLM to understand customer intent, executes actions, and can escalate to a human when needed.

---

**Q5.** An admin is setting up Service Cloud Voice permissions. Which permission set is required for a service agent to use the embedded voice softphone?

A) Voice User  
B) Service Cloud User  
C) Salesforce CRM Content User  
D) Contact Center Admin  

**Answer: A** — The "Voice User" permission set (or equivalent feature license) must be assigned to anyone who will handle voice calls in the agent console. Without it, the softphone widget will not be accessible.

---

**Q6.** A company is deploying Service Cloud Voice and needs their agents to see the caller's account information before they answer. What must be configured to achieve this?

A) Einstein Next Best Action  
B) Screen Pop  
C) Auto-Answer with Timer  
D) Omni-Channel Presence  

**Answer: B** — Screen Pop is the feature that automatically opens (or navigates to) a related Salesforce record — such as a Contact or Case — when an inbound call arrives, so the agent sees customer context before or at the moment of answer.

---

**Q7.** An architect is designing a Service Cloud Voice implementation for a company that requires calls to be recorded for compliance. Where are call recordings stored by default when using the Amazon Connect native integration?

A) Salesforce Files in the VoiceCall record  
B) Amazon S3 bucket linked to the Amazon Connect instance  
C) Heroku external storage  
D) Salesforce Content Management System  

**Answer: B** — When using Amazon Connect, call recordings are stored in the Amazon S3 bucket associated with that Connect instance. Salesforce stores a reference (URL/link) to the recording in the VoiceCall record, but the audio file itself lives in S3.

---

**Q8.** A Salesforce admin wants to test Service Cloud Voice without incurring telephony costs. Which option allows sandbox testing of voice features?

A) Developer Edition orgs with Voice enabled  
B) Amazon Connect test environment linked to a Salesforce sandbox  
C) Salesforce provides a built-in voice simulator in Setup  
D) Voice cannot be tested in sandbox; a full production org is required  

**Answer: B** — You can link an Amazon Connect sandbox/test instance to a Salesforce sandbox org to test voice flows and agent behavior without live telephony costs. Salesforce does not include a native voice simulator.

---

**Q9.** A company is migrating from a legacy IVR to Service Cloud Voice. Their existing IVR uses DTMF (touch-tone) menus. What Voice Flow element allows them to preserve DTMF functionality in the new system?

A) Get Transcription  
B) Collect Digits  
C) Route to Agent  
D) Start Bot Session  

**Answer: B** — The "Collect Digits" element in Voice Flows captures DTMF input from callers. This allows teams migrating legacy IVR menus to maintain touch-tone routing options while building toward NLP-based experiences.

---

**Q10.** A company has three contact centers in different regions, each with its own Amazon Connect instance. They want a unified Salesforce implementation. What is the maximum number of Amazon Connect instances that can be linked to a single Salesforce org?

A) 1  
B) 3  
C) 5  
D) Unlimited  

**Answer: C** — As of current platform limits, a single Salesforce org can be linked to up to 5 Amazon Connect instances. This supports multi-region and multi-contact-center deployments under one Salesforce org.

---

**Q11.** During a Service Cloud Voice implementation, which Salesforce object is automatically created when a call begins?

A) CallLog  
B) VoiceCall  
C) ServiceCall  
D) TelephonySession  

**Answer: B** — The VoiceCall object is Salesforce's core record for every phone interaction. It is created automatically when a call starts and stores fields like call duration, transcript ID, caller ID, agent, and related case.

---

**Q12.** A company wants Agentforce Voice to hand off a call to a human agent when the AI cannot resolve the issue. In the Agentforce agent configuration, what should the admin configure to enable this?

A) A Routing Rule in Omni-Channel  
B) A Transfer to Agent action in the agent's Topic  
C) An escalation flow connected to the IVR  
D) The "Fallback Queue" field in the Contact Center settings  

**Answer: B** — In Agentforce, escalation is handled through an action — typically a "Transfer to Agent" or "Escalate" action added to the agent's Topic. When triggered (by low confidence or customer request), this action routes the call through Omni-Channel to a human queue.

---

**Q13.** An admin needs to configure which voice calls are routed to the Agentforce autonomous bot vs. which go directly to human agents. Where is this logic primarily managed?

A) Einstein Intent Classification Setup  
B) The IVR menu in Amazon Connect or the partner telephony system  
C) Salesforce Flow Builder with a Decision element  
D) The Agentforce Topics configuration  

**Answer: B** — Initial call routing decisions (bot vs. human) are typically controlled in the telephony system's IVR or contact flow (e.g., Amazon Connect Contact Flows). The telephony layer decides whether to invoke an Agentforce bot or route directly to an Omni-Channel queue.

---

**Q14.** A Salesforce administrator is setting up the Contact Center for Service Cloud Voice. After completing the telephony configuration, what is the next critical step before agents can receive calls?

A) Enable Einstein GPT for Voice  
B) Assign the Contact Center to the relevant Omni-Channel queue  
C) Publish the Voice Flow to production  
D) Create a VoiceCall record template  

**Answer: B** — Once the Contact Center is configured, it must be associated with an Omni-Channel queue so that inbound calls can be routed to agents. Without this linkage, agents will not receive calls through Omni-Channel routing.

---

**Q15.** A company uses a third-party telephony provider (not Amazon Connect) and wants real-time transcription. What must their telephony vendor support to enable this in Service Cloud Voice?

A) The Salesforce Open CTI standard  
B) The Service Cloud Voice Partner API including the real-time transcript streaming contract  
C) WebRTC protocol for browser-based calling  
D) SOAP-based call event notifications  

**Answer: B** — Partner Telephony providers must implement the Service Cloud Voice Partner API, which includes specific contracts for streaming real-time transcript data to Salesforce. Not all Partner API implementations support transcription — it is an optional but required contract for this feature.

---

## Section 2: Building Voice Agents (Questions 16–30)

**Q16.** An admin is building an Agentforce Voice agent to handle billing inquiries. They need the agent to understand when a customer asks "What's my current balance?" and "How much do I owe?" as the same intent. What Agentforce concept handles this mapping?

A) Voice Flow Recognition Node  
B) Einstein Intent API mapping  
C) Topic with natural language understanding  
D) Keyword Match Rules in the IVR  

**Answer: C** — In Agentforce, a Topic defines the domain of intent the agent handles. The underlying LLM interprets varied phrasings of the same intent naturally, without needing explicit keyword or intent mapping like traditional bots require.

---

**Q17.** A company wants their voice bot to look up a customer's account using the caller's phone number automatically when a call arrives. Which capability should the admin configure?

A) Screen Pop using ANI (Automatic Number Identification)  
B) Einstein Discovery lookup  
C) Voice Flow with a Get Records element mapped to CallerID  
D) Both A and C are valid approaches  

**Answer: D** — Both approaches are valid. Screen Pop can auto-match the caller's phone number (ANI) to a Contact and surface the record in the console for human agents. Voice Flows can also use a Get Records element to look up the account based on caller ID for bot-driven lookups or pre-population.

---

**Q18.** In Agentforce Voice, what is the difference between "Agent Assist" mode and "Autonomous" mode?

A) Agent Assist uses Amazon Connect; Autonomous uses partner telephony  
B) Agent Assist surfaces AI suggestions to a human agent during the call; Autonomous handles the call without human involvement  
C) Agent Assist is for inbound calls; Autonomous is for outbound calls only  
D) Agent Assist requires Data Cloud; Autonomous does not  

**Answer: B** — Agent Assist mode means a human agent is on the call and Agentforce provides real-time AI suggestions, recommended responses, and knowledge articles. Autonomous mode means the Agentforce agent conducts the entire conversation with no human present unless escalation occurs.

---

**Q19.** An admin is configuring an Agentforce agent's Topics for voice. They want the agent to handle password resets. What should a well-formed Topic include?

A) A list of keyword triggers and a hardcoded script  
B) A description of the intent, relevant actions the agent can take, and instructions  
C) A Voice Flow ID and a DTMF fallback  
D) An Einstein Intent model trained on call recordings  

**Answer: B** — A Topic in Agentforce includes a natural-language description of what the topic covers, the actions the agent can invoke (like Reset Password), and instructions that guide how the agent should behave. The LLM interprets customer utterances against this context.

---

**Q20.** A voice agent needs to verify caller identity before discussing account details. What is the recommended Agentforce approach for identity verification during a voice call?

A) Route to a human agent for all identity verification  
B) Configure a Verify Identity action using a knowledge-based authentication flow  
C) Use DTMF to collect a PIN and match against a custom object  
D) Use Einstein Biometrics voice print matching  

**Answer: B** — Salesforce provides identity verification actions that can be added to Agentforce Topics. These typically involve knowledge-based authentication (asking security questions or requesting info that matches Salesforce data) before the agent proceeds with sensitive account actions.

---

**Q21.** A developer wants to build a custom Action for an Agentforce Voice agent that calls an external REST API to check shipping status. What is the correct way to expose this as an Agentforce Action?

A) Create an Apex REST resource and register it as a Named Credential  
B) Build an Invocable Apex class or Flow and register it as an Agent Action  
C) Write a JavaScript function and deploy it as a Lightning Web Component action  
D) Configure an External Service in Integration Procedures  

**Answer: B** — Agentforce Actions are backed by Invocable Apex, Flows, or External Services registered in Setup. An Invocable Apex class or Flow that calls the shipping API can be registered as an action and then added to a Topic, making it available to the agent.

---

**Q22.** A company is implementing a voice bot for appointment scheduling. The agent needs to know today's date to suggest available slots. How should this be provided to the Agentforce agent?

A) Hardcode today's date in the Topic description each day  
B) Use a Flow action that retrieves the current date from Salesforce  
C) Include a system prompt override in the Agent Settings  
D) Date is automatically provided as a system variable to all Agentforce agents  

**Answer: D** — Agentforce agents receive system context including the current date/time automatically. The LLM can use this to contextualize date-relative responses without custom configuration.

---

**Q23.** An admin wants to prevent the Agentforce Voice agent from discussing competitor products. Where should this guardrail be applied?

A) As a negative keyword filter in the Voice Flow  
B) In the Agent's Instructions field or a system-level Topic instruction  
C) Using an Omni-Channel routing rule  
D) As a Record-Triggered Flow on the VoiceCall object  

**Answer: B** — Agent-level instructions (set in the Agentforce agent configuration) or Topic-level instructions can include explicit guardrails like "Do not discuss competitor products." The LLM respects these instructions when generating responses.

---

**Q24.** A voice agent successfully resolves a call. What happens to the conversation data immediately after the call ends?

A) Data is deleted to comply with GDPR by default  
B) A VoiceCall record is updated with duration, transcript link, and resolution status  
C) Data is archived to Amazon S3 and removed from Salesforce  
D) A new Case record is automatically created for every completed call  

**Answer: B** — After a call ends, Salesforce updates the VoiceCall record with final metadata: call duration, agent ID, transcript reference, and any linked records (Case, Contact). Case creation is configurable but not automatic by default.

---

**Q25.** An Agentforce Voice agent should only be invoked for callers who press "1" in the IVR menu. Where is this routing decision best controlled?

A) In the Agentforce Topic configuration  
B) In the telephony provider's contact/IVR flow (e.g., Amazon Connect Contact Flow)  
C) Via an Omni-Channel routing rule triggered by DTMF  
D) Using an Einstein Classification model  

**Answer: B** — The IVR or contact flow in the telephony layer (Amazon Connect, Genesys, etc.) controls which path invokes the Agentforce bot. This is handled before Salesforce is involved — the telephony system routes "press 1" callers to the bot endpoint.

---

**Q26.** A developer notices that the Agentforce voice agent occasionally gives incorrect information about product return policies. What is the most targeted fix?

A) Retrain the underlying LLM with new data  
B) Update or add a Knowledge Article and link it to the relevant Topic  
C) Change the agent's NLP confidence threshold  
D) Add a DTMF confirmation step after every agent response  

**Answer: B** — Agentforce agents use Knowledge Articles as grounding sources. Adding accurate, up-to-date Knowledge Articles linked to the Topic ensures the agent draws from correct information, reducing hallucinations or outdated responses.

---

**Q27.** A company wants the voice agent to collect a customer's date of birth as part of identity verification. Which Voice Flow element is designed for collecting spoken input from callers?

A) Collect Digits  
B) Get Transcription Input  
C) Speech Recognition Node  
D) Ask Question  

**Answer: D** — "Ask Question" (or its equivalent in voice flows) is the element designed to prompt a caller for a spoken response and capture the transcription of their answer. "Collect Digits" handles DTMF/keypad input only.

---

**Q28.** An admin is configuring an Agentforce agent for voice and needs the agent to end the call politely when the interaction is resolved. What should they configure?

A) A "Disconnect Call" system action added to the agent's resolution flow  
B) The agent will automatically hang up when confidence drops below threshold  
C) Configure an Omni-Channel status change that triggers call disconnect  
D) Add a Voice Flow node that listens for the caller to hang up  

**Answer: A** — A "Disconnect Call" (or "End Call") action should be added as a step the agent can take when it determines the issue is resolved. This must be explicitly configured — the agent does not auto-hang-up without an action that terminates the call.

---

**Q29.** A Salesforce consultant is reviewing a voice agent configuration and notices the agent lacks a "General" topic. What risk does this introduce?

A) The agent cannot process DTMF input  
B) Calls that don't match any specific topic will fail with an error rather than gracefully redirecting  
C) The agent cannot escalate to a human agent  
D) Real-time transcription will not function  

**Answer: B** — A "General" or fallback topic is a best practice. Without it, utterances that don't match any configured topic may result in unhandled errors or awkward failures rather than a graceful "I can't help with that, let me connect you" response.

---

**Q30.** An admin wants to test their Agentforce Voice agent's responses without placing real phone calls. Which tool supports this?

A) Einstein Bot Debugger  
B) Agentforce Agent Tester in Setup  
C) Service Cloud Voice Simulator  
D) Amazon Connect Test Panel  

**Answer: B** — The Agentforce Agent Tester (available in Setup under the agent configuration) lets admins simulate conversations in text form, test intent matching, action invocation, and responses without needing telephony infrastructure.

---

## Section 3: Advanced Capabilities (Questions 31–45)

**Q31.** A service center uses Omni-Channel routing. Voice calls should be prioritized over chat interactions for agents who can handle both. How is this configured?

A) Set a higher numeric priority value on the voice queue  
B) Set a lower numeric priority value on the voice queue (lower = higher priority)  
C) Enable "Voice First" mode in Omni-Channel Settings  
D) Assign voice-only agents and chat-only agents separately  

**Answer: B** — In Omni-Channel, queue priority is set numerically where a lower number means higher priority. To ensure voice calls take precedence over chats, assign the voice queue a lower priority number than the chat queue.

---

**Q32.** An admin wants to ensure that when a customer calls back within 24 hours of a previous call, the agent sees the prior call transcript automatically. What should they configure?

A) Einstein Conversation Mining to link related calls  
B) A Screen Pop rule that queries VoiceCall records by caller ANI within 24 hours  
C) Case auto-association in the Contact Center settings  
D) An After-Call Work flow that pins the transcript to the caller's Contact  

**Answer: B** — Screen Pop rules can be configured to search for recent VoiceCall records associated with the caller's phone number (ANI). A query filtering calls within 24 hours would surface the prior call context when the agent's console loads.

---

**Q33.** A company wants real-time AI suggestions to appear for agents while they're on a call — things like recommended knowledge articles or next-best-action prompts. What feature enables this?

A) Autonomous Voice Agent  
B) Einstein Conversation Mining  
C) Agent Assist  
D) Service Intelligence Dashboards  

**Answer: C** — Agent Assist is the Agentforce feature that surfaces real-time AI suggestions to human agents during a live call. Suggestions can include knowledge articles, macros, recommended responses, and next-best-action recommendations.

---

**Q34.** An architect is designing a voice flow for a utility company. After the customer selects "Report an outage," the flow should check Salesforce for existing outage cases in the customer's area before routing. What is the correct Voice Flow element sequence?

A) Start → Collect Digits → Route to Queue  
B) Start → Identify Caller → Get Records → Decision → Route or Inform  
C) Start → Ask Question → Einstein Intent → Transfer  
D) Start → Screen Pop → Get Records → End  

**Answer: B** — The flow should identify the caller, then use a Get Records element to query existing outage cases, then a Decision element to branch (if outage exists, inform caller; otherwise route to agent). Screen Pop is a console feature, not a flow element.

---

**Q35.** A company has enabled Einstein Conversation Mining. What is the primary purpose of this feature in a voice context?

A) To transcribe calls in real time for agent viewing  
B) To analyze patterns across call transcripts to identify common topics and intents for bot training  
C) To automatically create Knowledge Articles from call content  
D) To monitor agent compliance with scripts during calls  

**Answer: B** — Einstein Conversation Mining analyzes historical call (and chat) transcripts at scale to surface the most common customer intents, topics, and phrases. Contact center managers use it to inform what Topics to build in Agentforce and to identify automation opportunities.

---

**Q36.** A voice flow needs to play a custom audio message to callers while they wait for an agent. Which Voice Flow element handles audio playback?

A) Text-to-Speech Node  
B) Play Message  
C) Audio Prompt  
D) Both A and B are valid  

**Answer: D** — Voice Flows support both pre-recorded audio files (Play Message / Audio Prompt) and dynamically generated text-to-speech (TTS) messages. Both approaches can be used for hold messages or informational prompts.

---

**Q37.** A contact center manager wants to see which Agentforce Voice agents are handling the most calls and which are escalating most frequently to humans. Where should they look?

A) VoiceCall object list view with custom report  
B) Service Intelligence (formerly Einstein Analytics) Voice dashboards  
C) Omni-Channel Supervisor tab  
D) Both A and B provide this information  

**Answer: D** — Both are valid. The Omni-Channel Supervisor tab shows real-time queue and agent activity. Service Intelligence/Einstein Analytics Voice dashboards provide historical trend data on call volume, escalation rates, and bot containment. Custom reports on VoiceCall can supplement both.

---

**Q38.** A company wants to implement "whisper coaching" where a supervisor can speak to an agent during a call without the customer hearing. Is this supported in Service Cloud Voice?

A) Yes, natively through the Service Cloud Voice Supervisor Console  
B) It depends on the telephony provider's capabilities, not Salesforce  
C) No, Service Cloud Voice does not support any form of supervisor monitoring  
D) Yes, but only with Amazon Connect  

**Answer: B** — Whisper coaching, call barging, and silent monitoring are telephony-layer features. Whether they're available depends on the partner's telephony platform (e.g., Amazon Connect Supervisor features). Salesforce surfaces these through the telephony integration but doesn't provide them natively independent of the provider.

---

**Q39.** An admin wants to automatically generate a call summary after every voice interaction and populate it in the VoiceCall record. Which Einstein feature handles this?

A) Einstein Copilot  
B) Einstein Call Summarization (part of Einstein Conversation Insights / Agentforce)  
C) Einstein Article Recommendations  
D) Einstein GPT for Flows  

**Answer: B** — Einstein Call Summarization (part of Conversation Insights / Agentforce capabilities) automatically generates a structured summary of call content after the interaction ends and writes it to the VoiceCall record, saving agents time on after-call work.

---

**Q40.** A developer is building a voice flow and wants to pass call data (like intent detected and customer account number) to the Omni-Channel work item so the receiving agent has context. How is this achieved?

A) Via the VoiceCall record fields which agents can see in the console  
B) Using Flow Variables mapped to the Omni-Channel work item attributes  
C) Through Amazon Connect Contact Attributes passed to a Screen Pop  
D) All of the above are valid mechanisms  

**Answer: D** — Multiple mechanisms exist: VoiceCall fields are auto-surfaced in the agent console; Flow Variables can carry data to downstream steps; and telephony-layer attributes (like Amazon Connect Contact Attributes) can drive Screen Pop to surface custom data. Using them together gives agents the richest context.

---

**Q41.** A company wants to implement outbound voice calls from Salesforce — for example, a service agent clicking a phone number in a Contact record to place a call. What must be configured?

A) Outbound Dialer in Amazon Connect and corresponding setup in the Contact Center  
B) Outbound calling is not supported in Service Cloud Voice  
C) A Flows-based trigger on the Contact record  
D) Einstein Autodialer in Service Setup  

**Answer: A** — Outbound calling ("click-to-dial") requires outbound dialer configuration in the telephony provider (e.g., Amazon Connect outbound campaign or ad-hoc outbound) and corresponding outbound call settings in the Salesforce Contact Center configuration.

---

**Q42.** A company is configuring NICE CXone as their telephony partner for Service Cloud Voice. What is a key difference they should be aware of compared to Amazon Connect?

A) NICE CXone does not support real-time transcription at all  
B) NICE CXone uses the Partner Telephony API so setup is partner-managed and may differ from native Amazon Connect steps  
C) NICE CXone cannot integrate with Omni-Channel  
D) NICE CXone requires Heroku to function with Salesforce  

**Answer: B** — NICE CXone is a Partner Telephony provider, meaning the integration is managed through the partner's Salesforce-certified connector and the Partner API. Setup steps, feature availability (like transcription), and troubleshooting differ from the native Amazon Connect integration.

---

**Q43.** A voice flow needs to branch based on whether the caller has an open Case in Salesforce. What combination of elements achieves this?

A) Ask Question → Decision  
B) Get Records → Decision  
C) Screen Pop → Route  
D) Identify Caller → Transfer  

**Answer: B** — Get Records retrieves Case data from Salesforce based on the caller's information. A Decision element then evaluates the query result (record found vs. not found) to branch the flow appropriately.

---

**Q44.** An admin enables "After Call Work" (ACW) in Omni-Channel for voice. What does this do for agents?

A) Automatically creates a Case and closes it after every call  
B) Puts the agent in a non-routable state after a call ends, allowing time to complete notes before the next call is delivered  
C) Triggers an AI-generated summary that the agent must approve  
D) Sends a CSAT survey to the customer automatically  

**Answer: B** — After Call Work (ACW) is an Omni-Channel presence state that automatically activates after a call ends. Agents are temporarily unavailable for new work, giving them dedicated time to update records, write notes, and wrap up without receiving the next call immediately.

---

**Q45.** A company wants to use voice data to improve their Agentforce bot Topics over time. What is the recommended Salesforce-native approach?

A) Export transcripts to a third-party NLP platform and import new intents  
B) Use Einstein Conversation Mining to analyze transcripts and identify gaps in bot coverage  
C) Manually review VoiceCall records and update Topic descriptions  
D) Schedule a nightly Apex job to retrain the LLM  

**Answer: B** — Einstein Conversation Mining is specifically designed for this use case. It analyzes call transcripts, surfaces common intents that the bot is missing or mishandling, and provides data to guide Topic creation and refinement in Agentforce.

---

## Section 4: Operations & Use Cases (Questions 46–60)

**Q46.** A supervisor wants to see a real-time view of how many calls are waiting in queue and which agents are currently on calls. Which Salesforce feature provides this?

A) Service Intelligence Dashboards  
B) Omni-Channel Supervisor  
C) VoiceCall Report  
D) Amazon Connect Real-Time Metrics  

**Answer: B** — The Omni-Channel Supervisor tab in Salesforce provides a real-time view of agent availability, current work items (including calls), queue depths, and agent presence status — all within Salesforce without switching to the telephony console.

---

**Q47.** A company's compliance team requires that all calls be recorded and that recordings be retained for 7 years. What Salesforce configuration is responsible for managing retention of call recordings?

A) Salesforce Data Retention Policies in Setup  
B) The S3 bucket lifecycle policies (for Amazon Connect) or the partner telephony platform's storage settings  
C) VoiceCall record archiving rules in Salesforce  
D) Einstein Compliance Manager  

**Answer: B** — Call recording files are stored in the telephony platform (e.g., Amazon S3 for Amazon Connect). Retention duration is governed by storage policies configured in that system, not by Salesforce. Salesforce only stores metadata and a reference link.

---

**Q48.** A healthcare company using Service Cloud Voice needs to ensure HIPAA compliance for calls involving patient data. What is the most critical configuration consideration?

A) Enable field-level security on VoiceCall records  
B) Ensure call recordings and transcripts are stored in HIPAA-eligible AWS regions and that a BAA is in place  
C) Disable real-time transcription for all calls  
D) Use only DTMF for data collection to avoid storing spoken PHI  

**Answer: B** — HIPAA compliance requires storing PHI (including voice recordings and transcripts) in HIPAA-eligible environments. For Amazon Connect, this means using HIPAA-eligible AWS regions and ensuring a Business Associate Agreement (BAA) is signed with both AWS and Salesforce.

---

**Q49.** A Salesforce admin reviews a VoiceCall record and notices the Status field shows "Transferred." What does this indicate?

A) The call was transferred from the bot to a human agent  
B) The call was transferred from one human agent to another, or from a bot to a human  
C) The call ended because the customer hung up  
D) The call was placed on hold and then ended  

**Answer: B** — A "Transferred" status on the VoiceCall record indicates the call was transferred — this can mean bot-to-human escalation or agent-to-agent transfer. The specific transfer path may be visible in related records or audit fields.

---

**Q50.** A company wants to track how often the Agentforce Voice bot fully resolves a call without human escalation. What metric should they monitor?

A) Average Handle Time  
B) Bot Containment Rate  
C) First Call Resolution  
D) Agent Utilization Rate  

**Answer: B** — Bot Containment Rate measures the percentage of calls that the bot handles from start to finish without escalating to a human. A high containment rate indicates effective bot configuration.

---

**Q51.** An agent is on a call and the customer asks a question the agent isn't sure about. The Agent Assist panel recommends a Knowledge Article. What does the agent need to do to send this article to the customer?

A) Nothing — Agent Assist automatically sends articles to customers  
B) Click "Share with Customer" to send via SMS or email during or after the call  
C) Email the article link manually from the record  
D) Agent Assist does not surface Knowledge Articles on voice calls  

**Answer: B** — Agent Assist surfaces Knowledge Article recommendations during calls, but the agent must take an explicit action to share the content. Sharing typically happens via email or SMS (since the customer is on a voice call and cannot receive hyperlinks verbally in real time).

---

**Q52.** A company wants to proactively call customers whose service contracts are expiring in 30 days. Which Salesforce capability best supports this outbound voice campaign?

A) Manual click-to-dial from a filtered Contact list  
B) An Outbound Dialer campaign configured in the telephony provider and triggered by a Salesforce Flow  
C) Einstein Autodialer with predictive lead scoring  
D) This use case requires a third-party dialer platform  

**Answer: B** — Proactive outbound campaigns are best handled using the telephony provider's outbound dialer (e.g., Amazon Connect outbound campaigns) triggered by automation in Salesforce (e.g., a Scheduled Flow that flags expiring contracts and initiates calls via the telephony API).

---

**Q53.** A contact center is analyzing why certain calls have higher handle times. They want to see what topics are taking the longest. Which Salesforce feature enables this analysis?

A) Omni-Channel Supervisor Filter by Duration  
B) Service Intelligence Voice analytics with topic-level handle time breakdown  
C) VoiceCall Report grouped by Agent and Topic  
D) Both B and C  

**Answer: D** — Both are valid approaches. Service Intelligence provides rich pre-built analytics on voice interactions including topic-based handle time. Custom CRM Analytics/reports on VoiceCall can also be grouped by topic and agent to support ad hoc analysis.

---

**Q54.** A company uses Data Cloud and wants to enrich Agentforce Voice interactions with unified customer profile data (e.g., purchase history, loyalty tier). How is this achieved?

A) Data Cloud connects to Amazon Connect via a direct API  
B) Data Cloud is connected to Salesforce CRM and the Agentforce agent can query unified profiles via actions  
C) Data Cloud can only be used for post-call analysis, not during the call  
D) Data Cloud enrichment requires a custom integration using MuleSoft  

**Answer: B** — Data Cloud unifies customer data from multiple sources into a single profile accessible from Salesforce CRM. Agentforce agents can retrieve and act on Data Cloud profile data via actions during a call, enabling hyper-personalized voice interactions.

---

**Q55.** A VoiceCall record shows the field "Call Result" is blank after an autonomous agent call. What is the most likely cause?

A) The call recording failed  
B) No disposition action was configured in the agent's resolution flow  
C) The VoiceCall object is not mapped to the Contact Center  
D) Transcription was disabled for this call  

**Answer: B** — "Call Result" (or similar disposition fields) must be explicitly set by an action in the voice flow or agent configuration. If no disposition action was built into the flow, the field remains blank after the call ends.

---

**Q56.** A company wants to measure customer satisfaction for voice calls without a post-call IVR survey. What Salesforce-native approach can they use?

A) Einstein Sentiment Analysis on call transcripts  
B) Automatic CSAT from the VoiceCall record  
C) Embedding a survey link in the call summary email  
D) Both A and C  

**Answer: D** — Einstein Conversation Insights can analyze call transcripts for sentiment signals (positive/negative). Post-call surveys can be delivered via SMS or email (leveraging Salesforce Surveys) after the call ends — both are valid alternatives to IVR-based surveys.

---

**Q57.** An admin notices that calls are not routing to the Agentforce Voice bot as expected — they go directly to the human queue. Where should they investigate first?

A) Agentforce Topic configuration  
B) The telephony provider's IVR/contact flow routing logic  
C) The Omni-Channel queue priority settings  
D) The VoiceCall trigger conditions  

**Answer: B** — If calls bypass the bot entirely, the most likely cause is in the telephony layer (IVR/contact flow) rather than Salesforce. The decision to invoke the bot happens before Salesforce routing, so this is where to start troubleshooting.

---

**Q58.** A company needs agents to manually wrap up each call by selecting a disposition code (e.g., "Issue Resolved," "Escalated," "Callback Required"). How should this be implemented?

A) Add a custom picklist field to the VoiceCall object and configure an agent console component to capture it during ACW  
B) Create a custom Case status that agents update  
C) Use an Einstein classification model to auto-select disposition codes  
D) Configure DTMF options for agents to press after calls  

**Answer: A** — A custom picklist field on VoiceCall capturing disposition can be surfaced in the agent console as an editable field during After Call Work. This is a common configuration pattern for wrap-up coding in contact centers.

---

**Q59.** A Salesforce partner is implementing Service Cloud Voice for a large enterprise. The customer asks about the difference between "Service Cloud Voice" and "Agentforce Voice." How should the consultant respond?

A) They are the same product with different marketing names  
B) Service Cloud Voice is the underlying telephony/CRM integration platform; Agentforce Voice adds AI-powered autonomous and assisted agent capabilities on top of that foundation  
C) Agentforce Voice replaces Service Cloud Voice in all new implementations  
D) Service Cloud Voice handles inbound calls; Agentforce Voice handles outbound calls  

**Answer: B** — Service Cloud Voice is the foundational product that integrates telephony with Salesforce CRM, enables transcription, and provides the VoiceCall object. Agentforce Voice is the AI layer on top — adding autonomous agents, agent assist, and LLM-driven capabilities. Both are complementary.

---

**Q60.** A company recently launched an Agentforce Voice bot. Two weeks later, call center managers report the bot is mishandling refund requests that weren't in scope at launch. What is the most appropriate response?

A) Roll back the bot to the pre-launch configuration  
B) Create a new Refund Request Topic in Agentforce with appropriate actions, test it in the Agent Tester, then deploy  
C) Add "refund" as a keyword in the IVR to route to a human immediately  
D) Increase the LLM confidence threshold so uncertain calls escalate faster  

**Answer: B** — The correct approach is to extend the bot's capabilities by adding a new Topic that covers refund requests, defining the relevant actions (e.g., lookup order, process refund), testing with the Agent Tester, and deploying. Adding a keyword bypass in the IVR is a short-term workaround, not a long-term solution.

---

*End of Practice Exam — 60 Questions*

---

**Score Interpretation**

| Score | Interpretation |
|-------|----------------|
| 54–60 (90%+) | Excellent — ready to certify |
| 48–53 (80–89%) | Strong — review any missed sections |
| 40–47 (67–79%) | Moderate — revisit Section 2 and 3 |
| Below 40 | Needs study — review all sections before exam |
