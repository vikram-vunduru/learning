# Lecture 11: Monitoring & Analytics

## Learning Objectives
- Use Einstein Conversation Mining to analyze voice call topics, resolution rates, and containment rates
- Describe the VoiceCall object schema and the data it captures for analytics and reporting
- Configure call recording storage, access controls, and playback in Service Cloud Voice
- Set up Flow-based SLA breach alerts and CRM Analytics dashboards for voice operations
- Define and apply governance policies for recording and transcript retention

---

## Slides

### Slide 1: The Voice Analytics Ecosystem
**Visual:** Ecosystem diagram with VoiceCall object at the center, arrows pointing to: Einstein Conversation Mining, CRM Analytics Dashboards, Agentforce Analytics, Post-Call Surveys, Call Recording Storage, and SLA Alert Flows

**Content:**
- Every call generates a VoiceCall record — the anchor for all voice analytics
- Multiple analytics layers operate on that data
- Operational metrics: queue wait time, handle time, ACW, abandonment rate
- Quality metrics: first-contact resolution, customer satisfaction, escalation rate
- AI metrics: containment rate, intent accuracy, autonomous resolution rate
- Voice analytics is not a single dashboard — it is a layered analytics architecture

**Speaker Notes:** When clients ask "how do we measure the success of Agentforce Voice?" the answer requires distinguishing between three layers: operational metrics that tell you if the system is running efficiently, quality metrics that tell you if customers are satisfied, and AI metrics that tell you if the Agentforce automation is working. Each layer requires different data sources and different analytical tools. Understanding all three is what separates a voice architect from a voice technician.

---

### Slide 2: The VoiceCall Object
**Visual:** Object schema diagram showing VoiceCall standard fields: Id, CallerId (ANI), CalledNumber (DNIS), Status, Duration, TranscriptAvailable, RecordingUrl, Intent, SentimentScore, AgentId, QueueId, StartTime, EndTime

**Content:**
- VoiceCall is a standard Salesforce object created for every inbound and outbound call
- Key fields: `CallerId` (ANI), `CalledNumber` (DNIS), `Duration`, `Status` (Completed, Transferred, Abandoned)
- AI fields: `Intent` (detected by Agentforce agent), `SentimentScore` (from real-time analysis)
- Recording fields: `RecordingUrl`, `TranscriptAvailable`, `TranscriptBody`
- Related records: linked to Contact, Account, Case via lookup fields (populated by screen pop match)
- Custom fields: add custom fields to capture IVR-collected data, escalation reason, disposition codes
- Reportable: use in Salesforce Reports, CRM Analytics, and Tableau

**Speaker Notes:** The VoiceCall object is the foundation of every voice analytics initiative. Get familiar with its schema — particularly the distinction between standard fields populated automatically by the platform versus fields you must populate manually via Flow (like escalation reason or custom disposition codes). In the exam, questions about reporting on voice data will reference the VoiceCall object, so knowing what it contains is directly tested.

---

### Slide 3: Einstein Conversation Mining for Voice
**Visual:** Conversation Mining dashboard showing: topic cluster bubble chart, resolution rate bar chart per topic, escalation rate per topic heatmap, trend lines for top 5 topics over 90 days

**Content:**
- Analyzes call transcripts stored on VoiceCall records
- Groups similar conversations into topic clusters using NLP
- Reports per topic: call volume, average handle time, resolution rate, containment rate, escalation rate
- Containment rate: percentage of calls resolved by autonomous agent without human transfer — key ROI metric
- Resolution rate: percentage of calls resulting in caller's issue being resolved (autonomous + agent)
- Use Conversation Mining to: find automation gaps, train Knowledge articles, identify agent training needs
- Runs on a configurable schedule; re-trains as new transcripts accumulate

**Speaker Notes:** Containment rate is the headline ROI metric for autonomous voice deployments. Every call contained by the autonomous agent represents a call that did not require an agent's time. At fifty cents to two dollars per live agent interaction (depending on your contact center model), a ten-percentage-point improvement in containment rate on a million calls per year represents hundreds of thousands of dollars in operating cost reduction. Conversation Mining is how you track containment rate over time and identify the next set of calls to automate.

---

### Slide 4: Call Recording — Storage, Access, and Playback
**Visual:** Architecture diagram: Call audio → Amazon S3 (for Amazon Connect) → Salesforce Call Recording object → Service Console Recording tab with playback controls

**Content:**
- Amazon Connect stores call recordings in Amazon S3 by default
- Salesforce surfaces recordings via a URL stored in VoiceCall.RecordingUrl
- Playback available in Service Console's Call Recording tab — no download required
- Access control: Recording playback controlled by Salesforce permissions (profile/permission set)
- Recommended: restrict recording playback to supervisors and QA roles, not all agents
- Recording pause/resume: for PCI-DSS compliance, configure Amazon Connect to pause recording during DTMF payment capture
- Genesys and NICE CXone: recordings stored in provider storage; URL still surfaced in VoiceCall record

**Speaker Notes:** Call recording access control is a compliance topic that often surfaces in audits. The principle of least privilege applies here: only roles that have a legitimate business need — supervisors, QA analysts, compliance officers — should have access to call recordings. Front-line agents should generally not have playback access to their own or others' calls. This both protects privacy and prevents gaming of quality scores. Configure this through permission sets before go-live.

---

### Slide 5: Post-Call Surveys and Satisfaction Metrics
**Visual:** Flow diagram: Call ends → VoiceCall status = Completed → Flow trigger → Initiate IVR survey call → Survey responses stored on VoiceCall custom fields → CSAT score aggregated in CRM Analytics

**Content:**
- Post-call surveys: initiated automatically via a triggered Flow when call status = Completed
- Survey delivery: IVR callback (most common), SMS link, email link
- Common questions: overall satisfaction (1-5), resolution achieved (yes/no), agent rating (1-5)
- Data storage: survey responses stored as custom fields on VoiceCall or related Survey object
- CSAT by channel: compare voice CSAT to chat/email CSAT in unified CRM Analytics dashboard
- Survey fatigue: configure sampling rate (e.g., survey 30% of calls, not all) to reduce abandonment

**Speaker Notes:** Post-call surveys are valuable but must be designed carefully. Survey fatigue is real — if callers receive a survey request after every single call, response rates drop and the data becomes biased toward callers with strong emotions (very happy or very unhappy). A sampling rate of 20 to 30 percent of calls, combined with a single-question initial survey with optional follow-up, tends to produce representative data with reasonable response rates.

---

### Slide 6: SLA Breach Alerts and Agentforce Voice Dashboards
**Visual:** Two panels — left: Flow Builder canvas showing a trigger on VoiceCall with a Decision checking wait time > SLA threshold and a Notification action; right: CRM Analytics dashboard with voice metrics tiles

**Content:**
- **SLA alert Flow:** triggered on VoiceCall creation; monitors queue wait time field; fires notification when threshold exceeded
- Alert channels: Salesforce Notification, Chatter post to supervisor group, Email, SMS via External Credential
- **Agentforce Analytics Dashboard:** native voice metrics dashboard — containment rate, average handle time, intent distribution, escalation rate
- **CRM Analytics (Tableau CRM) voice dashboards:** deeper analysis — trend over time, cohort analysis, agent performance benchmarking
- **Key KPIs to dashboard:** containment rate, AHT (average handle time), FCR (first contact resolution), CSAT, escalation rate, queue abandonment rate
- Dashboard refresh: CRM Analytics datasets refresh on a schedule (hourly is common for operational monitoring)

**Speaker Notes:** Flow-based SLA alerts are a practical, no-code solution for operational monitoring. Instead of waiting for a supervisor to check a dashboard, you push an alert to them the moment a queue threshold is breached. The key is to set thresholds that are actionable — an alert that fires every five minutes because the threshold is too aggressive creates alert fatigue. Set thresholds to match your service level agreement: if your SLA is that 80% of calls are answered within 20 seconds, your alert threshold might be when queue depth reaches a level that will cause a breach.

---

### Slide 7: Governance — Retention Policies for Recordings and Transcripts
**Visual:** Governance matrix table: Data Type | Typical Retention Period | Legal Hold Capability | Access Control | Deletion Method

**Content:**
- Call recordings: typical retention 1-3 years; financial services may require 7 years; healthcare may require longer under HIPAA
- Call transcripts: often retained longer than recordings as text is cheaper to store and more searchable
- Legal hold: suspend normal retention deletion for calls related to active litigation; requires a Legal Hold flag on VoiceCall
- PII in transcripts: transcripts may contain SSNs, DOBs, payment info — apply data masking or redaction before archiving
- Deletion: S3 lifecycle rules for Amazon Connect recordings; custom Flow for deleting Salesforce VoiceCall transcript fields
- Regulatory considerations: GDPR right to erasure applies to voice recordings containing personal data
- Annual governance review: recommended to re-evaluate retention schedules with Legal and Compliance annually

**Speaker Notes:** Retention governance for voice is one of those topics that seems administrative until you have a legal hold request or a regulatory audit, at which point it becomes urgent. Build your retention policies before go-live, document them in a data dictionary, and configure the technical enforcement mechanisms — S3 lifecycle rules, Salesforce data retention policies — at the same time you configure the recording itself. Retrofitting governance after the fact, when you have months of recordings in storage, is far more complex than getting it right from day one.

---

## Recording Script

In this lecture, we are looking at monitoring and analytics for Agentforce Voice — how you measure what is happening, how you identify what is going wrong, and how you govern the data your voice system generates.

Let me start with the VoiceCall object, because it is the anchor for everything else. Every call — inbound or outbound — generates a VoiceCall record in Salesforce. This record stores the ANI (caller phone number), the DNIS (number dialed), call duration, status, and links to related records like the Contact, Account, or Case that was matched by screen pop. It also stores AI-generated fields: the detected intent from the Agentforce agent and the sentiment score from real-time analysis. And it stores recording and transcript data — or at least the URL pointer to where those are stored.

If you want to report on voice performance, you start with the VoiceCall object. Build reports on VoiceCall to see call volume by day, average duration, escalation rates, and intent distribution. Use custom fields on VoiceCall to capture data that the platform does not populate automatically — like disposition codes the agent selects at the end of a call, or the escalation reason written by the Agentforce agent before transferring.

Now let us talk about Einstein Conversation Mining, which is the retrospective analytics engine for voice transcripts. Conversation Mining reads through your historical call transcripts and uses NLP to cluster them by topic. It then reports on each topic cluster: how many calls, what is the average handle time, what percentage were resolved, what percentage escalated.

The containment rate metric from Conversation Mining is the headline KPI for autonomous voice deployments. Containment rate measures the percentage of calls that were handled entirely by the autonomous Agentforce agent without any human agent involvement. This is the metric that translates directly to operational cost savings. Track it weekly after launch, and use Conversation Mining to identify which topics are failing containment — meaning the autonomous agent is frequently escalating on those topics. That is your roadmap for improvement.

Call recording storage and access is a topic that interacts with both operations and compliance. For Amazon Connect deployments, call recordings are stored in Amazon S3. Salesforce surfaces the recording URL in the VoiceCall record, and the recording is playable directly in the Service Console's Call Recording tab. Access to recordings is controlled by Salesforce permissions — configure this carefully. Supervisors and QA analysts need playback access; front-line agents typically should not.

For compliance, specifically PCI-DSS, you must configure recording pause when the call enters a DTMF payment capture segment. Amazon Connect has native pause and resume recording capabilities that you invoke from the Contact Flow at the point where payment digits are being entered. This is non-negotiable if your voice system captures any payment card information.

For SLA monitoring, the practical tool is a Flow-based alert. Create a Flow triggered on VoiceCall creation that monitors queue wait time, and when wait time exceeds your SLA threshold, fires a notification to the supervisor group. This is more actionable than a dashboard — instead of a supervisor discovering a breach after the fact, they receive a real-time alert and can take action: pull in additional agents, redirect to a different queue, or reach out to callers in the queue.

The CRM Analytics voice dashboards are where you do deeper operational analysis. The key metrics to build into your voice dashboard are: average handle time (AHT), first contact resolution rate (FCR), containment rate, CSAT from post-call surveys, escalation rate broken out by escalation reason, and queue abandonment rate. These five or six metrics tell you almost everything you need to know about whether your voice operation is performing well.

Finally, governance. Every call recording and transcript contains personal information, and you are legally obligated to manage that information responsibly. Define a retention policy before you go live — how long do you keep recordings? How long do you keep transcripts? For most industries, one to three years for recordings is appropriate. Financial services and healthcare have longer requirements. Configure S3 lifecycle rules to enforce automated deletion at the end of the retention period. And build a legal hold mechanism — a flag on the VoiceCall record that pauses deletion for calls involved in active litigation.

I will leave you with one principle for voice governance: what you do not think about before go-live, you will have to think about under pressure after go-live. Build the governance framework alongside the technical implementation.

---

## Exam Tips
- The VoiceCall object is the standard Salesforce object that anchors all voice reporting — know its key fields including Intent, SentimentScore, RecordingUrl, and TranscriptAvailable
- Containment rate = percentage of calls handled by autonomous agent without human transfer — this is the primary ROI metric for autonomous voice
- Einstein Conversation Mining is retrospective (analyzes historical transcripts), not real-time — do not confuse with real-time sentiment analysis
- PCI-DSS compliance for voice requires recording pause during DTMF payment capture — this is configured in Amazon Connect Contact Flow, not in Salesforce Flow
- Retention policies for recordings and transcripts should be configured at go-live, not added later; S3 lifecycle rules enforce automated deletion for Amazon Connect recordings
- Post-call survey sampling rates of 20-30% are recommended to avoid survey fatigue while maintaining representative data

---

## Lecture Summary
- The VoiceCall object is created for every call and stores ANI, DNIS, duration, status, intent, sentiment score, recording URL, and related record links
- Einstein Conversation Mining analyzes historical transcripts to cluster topics and report containment rate, resolution rate, and escalation rate
- Call recordings are stored in Amazon S3 (for Connect), surfaced via VoiceCall.RecordingUrl, and played back in Service Console; access is controlled by permission set
- Flow-based SLA alerts provide real-time breach notifications to supervisors when queue thresholds are exceeded
- CRM Analytics dashboards surface key KPIs: AHT, FCR, containment rate, CSAT, escalation rate, and abandonment rate
- Retention governance policies for recordings (1-3 years typical) and transcripts must be defined at go-live; S3 lifecycle rules automate enforcement

---

## Mini Quiz

**Q1:** A Salesforce admin wants to report on how many calls were resolved without involving a human agent. Which metric and data source should they use?

A) Average Handle Time from the Agent Console  
B) Containment Rate from Einstein Conversation Mining  
C) Resolution Rate from the Case object  
D) Escalation Rate from Omni-Channel Queue reports  

**Answer:** B — Containment rate, derived from Einstein Conversation Mining analysis of VoiceCall transcripts, measures the percentage of calls handled entirely by the autonomous agent without human transfer. This is the correct metric for measuring autonomous resolution.

---

**Q2:** A compliance officer requires that call recordings for payment-related interactions have DTMF digits redacted. Where is this configured?

A) Salesforce Voice Flow Speak element settings  
B) Amazon Connect Contact Flow pause/resume recording configuration  
C) VoiceCall object field-level security settings  
D) CRM Analytics dataset schema  

**Answer:** B — Recording pause for PCI-DSS DTMF payment capture is configured in the Amazon Connect Contact Flow using the native pause and resume recording capabilities. This is a telephony-layer control, not a Salesforce Flow configuration.

---

**Q3:** An operations manager wants to receive an immediate notification when call queue wait times exceed 3 minutes. What is the recommended implementation approach?

A) Schedule a daily CRM Analytics report refresh  
B) Configure Einstein Conversation Mining to flag long-wait calls  
C) Create a Flow triggered on VoiceCall creation that monitors wait time and fires a Salesforce notification when the threshold is exceeded  
D) Enable the Amazon Connect real-time metrics dashboard  

**Answer:** C — A Flow triggered on VoiceCall creation, with a Decision element checking queue wait time against the SLA threshold and a Notification action, provides real-time alerting within Salesforce. This is more actionable than a dashboard because it pushes the alert rather than requiring the supervisor to pull it.
