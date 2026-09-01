# Lecture 12: Advanced Use Cases

## Learning Objectives
- Configure outbound voice dialing modes (predictive and progressive) with Agentforce
- Design a blended inbound/outbound voice campaign architecture in Service Cloud Voice
- Integrate Data Cloud unified customer profiles for real-time call personalization
- Understand compliance requirements for voice — specifically PCI-DSS for payment capture and call recording laws
- Calculate ROI and model the cost implications of voice automation investment

---

## Slides

### Slide 1: Outbound Voice Dialing with Agentforce
**Visual:** Side-by-side comparison of Predictive Dialing and Progressive Dialing — each showing a dial queue, connected call rate percentage, and agent availability indicator

**Content:**
- **Progressive Dialing:** system dials one number per available agent; when agent is ready, next number is dialed; lower abandon risk
- **Predictive Dialing:** system dials multiple numbers simultaneously, predicting how many will connect; routes connected calls to available agents; higher efficiency, higher abandon risk
- Agentforce outbound: AI agent handles outbound calls autonomously (appointment reminders, collections, surveys)
- Human-assisted outbound: predictive/progressive dialer plus Agent Assist for connected calls
- Outbound campaigns: defined in Salesforce as Campaign records with associated Contact/Lead lists
- Legal requirement: TCPA compliance — prior consent required for automated outbound calls in US

**Speaker Notes:** Outbound voice with Agentforce is a significant expansion of the platform's capability beyond reactive inbound support. The autonomous outbound use case — an Agentforce agent making appointment reminder calls, collecting survey responses, or confirming delivery windows — can replace a large volume of outbound work that would otherwise require human agents. The legal landscape for outbound autodialing is complex and varies by jurisdiction; always involve Legal before launching any outbound campaign.

---

### Slide 2: Blended Inbound/Outbound Voice Campaigns
**Visual:** Architecture diagram: Campaign record with Contact list → Outbound dialer → Connected calls routed to Omni-Channel → agents handle inbound and outbound in unified queue

**Content:**
- Blended agents: same agent pool handles inbound calls and outbound campaign calls
- Omni-Channel capacity: configure outbound campaign as a work item type alongside inbound
- Campaign management: Salesforce Campaign object tracks outbound call list, disposition codes, completion status
- Prioritization: configure whether inbound calls preempt active outbound campaign work
- Wrap-up between calls: ACW applies to outbound calls too; disposition codes captured during ACW
- Performance reporting: outbound connect rate, conversion rate, campaign completion rate — all on VoiceCall records

**Speaker Notes:** Blended inbound/outbound is the operational model that maximizes agent utilization. Rather than having a pool of agents waiting for inbound calls during quiet periods, the dialer fills their capacity with outbound campaign calls. When inbound volume increases, the blender shifts agents back to inbound priority. This requires careful Omni-Channel capacity configuration and clear agent training so agents understand the workflow transition — it is a more complex operational model than purely inbound or purely outbound.

---

### Slide 3: Voice + Data Cloud Integration
**Visual:** Data flow diagram: Data Cloud Unified Profile → Real-time activation → Salesforce Voice Channel event → VoiceCall enrichment → Screen pop includes Data Cloud attributes (churn score, LTV, product ownership)

**Content:**
- Data Cloud builds a unified customer profile from multiple data sources (CRM, web behavior, purchase history, service interactions)
- Voice trigger: when a call arrives, Data Cloud profile is activated in real time and attributes surface in the call context
- Attributes available at call start: customer lifetime value, churn risk score, product ownership, recent website activity, last interaction channel
- Use cases: personalize greeting ("We see you recently visited our website about Plan Upgrades"), prioritize routing for high-LTV callers, trigger retention offer for high-churn-risk callers
- Configuration: Data Cloud connector to Service Cloud, attribute mapping to VoiceCall extended fields or screen pop context
- Latency consideration: Data Cloud lookup must complete before Flow continues — design for sub-second latency

**Speaker Notes:** The Data Cloud integration is what elevates Agentforce Voice from a contact center tool to a true customer experience platform. When the agent — or autonomous agent — knows not just who the caller is in the CRM but what they have been doing across all touchpoints in the last 30 days, the quality of the interaction changes fundamentally. A caller who looked at the upgrade page on your website three times this week probably wants to upgrade — your voice agent should be ready to have that conversation, not ask them to navigate a generic menu.

---

### Slide 4: Multi-Language Voice Support
**Visual:** Architecture diagram showing language detection flow: caller speaks → Amazon Transcribe language detection → Flow Decision routes to language-specific agent/queue → language-specific Knowledge base used for suggestions

**Content:**
- Amazon Connect supports multiple languages for STT — configure in the Contact Flow
- Language detection: automatic (Amazon Transcribe detects language) or prompted (caller selects language)
- Voice prompts: pre-record or TTS prompts in each supported language; reference language variable in Speak elements
- Language-specific routing: route Spanish callers to Spanish-skilled agents; use skill relaxation with language skills
- Knowledge articles: language-tagged articles surface correctly in Agent Assist for language-specific queries
- Multi-language agent assist: Einstein suggestions include language as a filter for Knowledge article recommendations
- Supported languages: follow Amazon Transcribe language support — English, Spanish, French, German, Japanese, and others

**Speaker Notes:** Multi-language support is architecturally more complex than it appears because language affects every layer: the TTS prompts, the STT engine configuration, the routing skills, and the Knowledge articles. Build a language-first architecture from day one if you plan to support multiple languages — retrofitting it into a single-language design is much more difficult. The Amazon Transcribe automatic language detection feature can identify the caller's language without prompting them, which creates a significantly better caller experience.

---

### Slide 5: Voice for Field Service
**Visual:** Process diagram: Field service mobile worker → check-in call → Agentforce autonomous agent → work order status lookup → next job assignment → ETA notification to customer

**Content:**
- Use case: field service technicians use voice (hands-free) to check in, complete, or report on work orders while in the field
- Agentforce autonomous agent handles: work order status queries, job completion confirmation, next job lookup, parts availability check
- Hands-free operation: technicians driving cannot type; voice is the only safe input modality
- Integration: Field Service Lightning (FSL) objects (Work Order, Service Appointment) accessible in Voice Flow via SOQL
- Customer notification trigger: when technician checks in via voice, Flow triggers SMS/email to customer with ETA
- Safety benefit: reduces screen interaction while driving; voice-enabled check-in replaces manual app navigation

**Speaker Notes:** Field service voice is one of the most compelling use cases for autonomous Agentforce voice precisely because it solves a real safety problem. A technician driving between jobs should not be tapping through a mobile app to confirm job completion or look up their next assignment. A thirty-second voice interaction while hands remain on the wheel is both safer and faster. The integration with Field Service Lightning objects is straightforward — the same SOQL-based Record Lookup elements used in other Voice Flows work for FSL objects.

---

### Slide 6: PCI-DSS Compliance for Voice Payment Capture
**Visual:** Compliance architecture diagram showing the recording pause/resume mechanism with a timeline: Call starts → Recording on → Payment section begins → Recording pauses → Tone detection confirms DTMF entry → Recording resumes → Call ends

**content:**
- PCI-DSS: Payment Card Industry Data Security Standard — applies when voice interactions involve cardholder data
- Key requirement: cardholder data (card number, CVV, expiry) must not be stored in call recordings or transcripts
- **Recording pause:** Amazon Connect Contact Flow pauses recording before DTMF payment entry; resumes after
- **Transcript redaction:** Amazon Transcribe supports automatic redaction of financial data in transcripts
- **DTMF-only payment capture:** require callers to enter card data via keypad only (no speech) to prevent speech-to-text capture of card numbers
- **Tokenization:** card numbers should be tokenized immediately; raw PAN should never be stored in Salesforce
- Compliance scope: if any voice system touches cardholder data, the entire system (servers, storage, network paths) may be in PCI scope

**Speaker Notes:** PCI-DSS compliance for voice is a specialized topic that your security and compliance teams must be involved in from the start. The core technical implementation — recording pause and DTMF-only payment capture — is straightforward to configure in Amazon Connect. What is more complex is the organizational scope: once your voice system touches cardholder data, PCI DSS assessors may require the entire Salesforce environment, Amazon Connect instance, and network path to be in scope for assessment. Work with a Qualified Security Assessor before deploying payment capture in voice.

---

### Slide 7: Cost Modeling and ROI for Voice Automation
**Visual:** ROI waterfall chart: Baseline cost (cost per call × annual volume) → Autonomous containment savings → Reduced AHT savings → Reduced training cost → Infrastructure cost → Net annual benefit → Payback period

**Content:**
- **Baseline cost:** fully loaded cost per agent-handled call (typically $5–$15 depending on geography and complexity)
- **Autonomous containment value:** (calls contained) × (cost per agent call) — subtract Agentforce Voice licensing
- **AHT reduction value:** (AHT reduction in minutes) × (agent cost per minute) × (annual call volume)
- **Infrastructure cost:** Salesforce Voice licenses + Amazon Connect per-minute charges + implementation cost
- **Typical payback period:** 12-24 months for mid-size contact centers; shorter for high-volume simple call types
- **ROI calculation inputs:** annual call volume, current cost per call, current AHT, target containment rate, target AHT reduction, implementation and licensing costs
- **Quick rule of thumb:** 10% containment improvement on 1M calls/year at $8/call = $800K gross savings

**Speaker Notes:** ROI modeling for voice automation is both an architectural tool and a business case tool. As an architect, you use it to prioritize which call types to automate first — focus on the intersection of high volume, low complexity, and high current cost. As a business case presenter, you use it to justify the investment to leadership. The numbers are usually compelling because voice automation addresses such high-volume, repetitive work. But be conservative in your projections — containment rates in production are almost always lower than what testing suggests, and implementation costs almost always exceed initial estimates.

---

## Recording Script

Welcome to Lecture 12, the final lecture in the Advanced Use Cases section. We are going to cover the sophisticated applications of Agentforce Voice: outbound dialing, campaign blending, Data Cloud integration, multi-language support, field service, PCI compliance, and ROI modeling.

Let me start with outbound voice, because it represents a significant expansion of what most people think of when they hear "call center AI."

Agentforce Voice can operate autonomously on outbound calls. An AI agent can call a customer to confirm an appointment, collect a survey response, notify them of a delivery window, or follow up on an open case. This is not a human agent making calls with AI assistance — this is the AI making the calls entirely on its own. The use cases that work best are structured, predictable interactions where the outcome is binary: the customer confirms or cancels, the survey is collected or not, the notification is delivered or the call goes to voicemail.

For outbound dialing modes, you have two main options: progressive and predictive. Progressive dialing dials one number at a time per available agent — or, for autonomous mode, one call at a time per configured concurrent session. It is lower efficiency but lower risk of abandoned calls when a call connects before an agent or agent session is ready. Predictive dialing dials more numbers than available agents, using algorithms to predict connection rates and match connected calls to ready agents. It is more efficient but requires careful tuning to avoid regulatory compliance issues with abandoned call rates.

Now let us talk about Data Cloud integration, which is one of the most transformative capabilities in the Agentforce Voice stack. Data Cloud builds a unified customer profile that aggregates data from your CRM, your website, your mobile app, your purchase history systems, and anywhere else your customer data lives. When a call arrives, you can query that unified profile and surface attributes in the call context before the first word is spoken.

The practical impact is significant. Instead of treating every call as a fresh start, your voice system — or your human agent's screen pop — can incorporate context like: this customer's churn risk score is high, they recently browsed upgrade plans on your website, their lifetime value puts them in the top 20% of your customer base, and their last three service interactions were all about the same issue. With that context, your Voice Flow can skip irrelevant menu options, your Agentforce agent can proactively address the likely reason for the call, and your human agent can engage at a much higher level from the opening seconds.

Let me spend a moment on PCI-DSS compliance for voice, because this is a topic where getting it wrong has serious consequences.

If your voice system handles credit card numbers, expiry dates, or CVV codes at any point, you are subject to PCI-DSS requirements. The core technical requirements are: do not record cardholder data in call recordings, do not capture cardholder data in call transcripts, and do not store raw card numbers in Salesforce.

The technical implementation involves three things. First, configure Amazon Connect to pause recording when the payment capture segment of the call begins and resume it after. Second, use DTMF-only payment capture — require callers to enter card digits via keypad, not speech, to prevent the STT engine from capturing card numbers in the transcript. Third, use Amazon Transcribe's automatic redaction feature to ensure that even if any financial data appears in the transcript, it is masked before storage.

But the most important PCI consideration is scope. The moment your voice system touches cardholder data, your PCI assessor may determine that your entire Salesforce environment, your Amazon Connect instance, your network paths between them, and the workstations of anyone who accesses that data are in PCI scope. That dramatically expands the compliance burden. Engage a Qualified Security Assessor before you design a payment capture feature for voice.

Finally, let us do a quick ROI calculation framework, because this is what you will use to make the business case for Agentforce Voice investments.

Start with your baseline: total annual inbound call volume multiplied by your fully loaded cost per call. In a mid-size US contact center, that might be one million calls per year at eight dollars per call, giving you eight million dollars of annual operating cost.

Your autonomous containment improvement represents the biggest savings lever. If Agentforce Voice contains 20% of calls that previously required a human agent, that is two hundred thousand calls times eight dollars minus the Agentforce Voice platform cost. Even at a conservative four dollars per call fully loaded cost for the AI (licensing plus infrastructure), you are saving four dollars per contained call. Two hundred thousand calls times four dollars is eight hundred thousand dollars in annual savings.

On top of that, add the AHT reduction benefit for calls that do still involve a human agent. If Agent Assist reduces average handle time by two minutes per call and you have eight hundred thousand remaining calls at an agent cost of fifty cents per minute, that is another eight hundred thousand dollars.

Subtract your implementation cost — typically two hundred thousand to five hundred thousand dollars for a first deployment — and your ongoing licensing costs, and you are looking at a payback period of twelve to eighteen months for a deployment of this scale.

This is the framework. The inputs will vary significantly by industry, geography, call complexity, and existing contact center maturity. But the structure — baseline cost, containment savings, AHT savings, infrastructure and implementation costs, payback period — is the right way to build the business case.

---

## Exam Tips
- Predictive dialing dials more numbers than available agents; progressive dialing matches one call to one available agent — know the distinction and its compliance implications
- TCPA compliance is the US regulatory framework for outbound autodialed calls; prior consent is required
- Data Cloud integration enriches call context at the moment of call arrival; latency of profile lookup must be designed for
- PCI-DSS requires recording pause during DTMF payment capture AND DTMF-only (not speech) input for card data
- Multi-language routing uses Language as a Routing Skill; Amazon Transcribe automatic language detection eliminates the need for language-selection menus
- ROI calculation for voice automation: (calls contained × cost per call) + (AHT reduction × cost per minute × volume) − (licensing + implementation)

---

## Lecture Summary
- Outbound voice with Agentforce supports autonomous and human-assisted modes; predictive dialing maximizes efficiency while progressive dialing reduces abandoned call risk
- Blended inbound/outbound campaigns use the same agent pool and Omni-Channel capacity model; inbound priority configuration determines when agents shift between modes
- Data Cloud integration enriches VoiceCall context at call arrival with unified customer profile attributes including churn score, LTV, and cross-channel behavior
- Multi-language voice requires language-specific TTS prompts, STT language configuration, routing skills, and Knowledge article tagging
- PCI-DSS compliance for voice requires recording pause during payment capture, DTMF-only card entry, transcript redaction, and engagement of a Qualified Security Assessor
- ROI modeling for voice automation uses containment rate improvement and AHT reduction as the primary value drivers against licensing and implementation costs

---

## Mini Quiz

**Q1:** A company wants Agentforce Voice to automatically call customers with appointment reminders and allow them to confirm or cancel by pressing 1 or 2. Which dialing mode is most appropriate for this low-volume, structured use case?

A) Predictive dialing with AI abandon rate management  
B) Progressive dialing with Agentforce autonomous agent  
C) Inbound queue with DTMF menu  
D) Blended inbound/outbound with human agents  

**Answer:** B — Progressive dialing (one call per session) combined with an Agentforce autonomous agent is appropriate for structured outbound interactions like appointment reminders. The autonomous agent handles the scripted interaction, and DTMF responses (press 1/press 2) collect the confirmation. Predictive dialing's higher efficiency is unnecessary for low-volume campaigns and adds compliance risk.

---

**Q2:** A financial services company wants to capture credit card numbers via voice for phone payments. What is the required configuration to maintain PCI-DSS compliance?

A) Store card numbers in an encrypted custom field on the VoiceCall object  
B) Use speech recognition to capture card numbers with sentiment-based masking  
C) Pause call recording, require DTMF-only card entry, and enable transcript redaction  
D) Restrict access to VoiceCall recording playback to compliance officers only  

**Answer:** C — PCI-DSS requires that cardholder data not be stored in recordings or transcripts. The correct technical implementation is: pause recording during the payment segment, require DTMF-only entry (no speech capture of card numbers), and enable Amazon Transcribe automatic redaction as a defense-in-depth measure.

---

**Q3:** A voice architect is building the business case for Agentforce Voice. The contact center handles 500,000 calls/year at $10/call. The projected autonomous containment rate is 25%. Agentforce Voice fully loaded cost is $3/contained call. What is the approximate annual gross savings from containment?

A) $500,000  
B) $875,000  
C) $1,250,000  
D) $375,000  

**Answer:** B — 25% of 500,000 calls = 125,000 contained calls. Savings per contained call = $10 (avoided agent cost) − $3 (AI cost) = $7 net savings per call. 125,000 × $7 = $875,000 annual gross containment savings.
