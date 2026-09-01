# Lecture 02: Telephony Integration

## Learning Objectives

- Name the three primary telephony partners supported by Agentforce Voice and describe the distinguishing characteristics of each
- Explain the difference between Partner Telephony and Bring Your Own Telephony (BYOT) and identify when each model is appropriate
- Describe the Amazon Connect deep-dive architecture: Contact Lens, Lambda, and the Salesforce Voice for Amazon Connect managed package
- Trace the authentication and data flow between Salesforce and a telephony provider during a live voice call
- Define SIP trunking and explain its role in the Salesforce Voice architecture

---

## Slides

### Slide 1: The Telephony Partner Ecosystem

**Visual:**
```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│      AMAZON CONNECT       │     GENESYS CLOUD CX      │       NICE CXone          │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│                           │                           │                           │
│  AWS-native platform      │  Enterprise CCaaS         │  Compliance-first         │
│                           │  Global routing           │  Workforce management     │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│  Deepest Salesforce       │  Multi-channel, multi-    │  Financial services &     │
│  integration              │  country deployments      │  healthcare focus         │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│  Best fit:                │  Best fit:                │  Best fit:                │
│  AWS-committed orgs /     │  Large enterprise with    │  Regulated industries     │
│  new deployments          │  complex routing needs    │  with compliance req.     │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
                   All three: Partner Telephony — managed package from AppExchange
```

**Content:**
- Salesforce does not own a telephone network — all voice infrastructure is provided by certified telephony partners
- Three primary partners for Agentforce Voice: **Amazon Connect**, **Genesys Cloud CX**, and **NICE CXone**
- Each partner is a Contact Center as a Service (CCaaS) platform that handles PSTN connectivity, call routing, and audio processing
- Salesforce maintains a managed package and certified integration for each partner — this is not a generic API connection
- Partner selection typically depends on what the customer already uses, geographic requirements, compliance needs, and existing AWS/cloud commitments

**Speaker Notes:** Students often ask why Salesforce supports multiple telephony partners instead of building its own. The answer is that telephony infrastructure is highly complex, heavily regulated, and already well-served by established players. Salesforce's competitive advantage is the CRM and AI layer, not carrier infrastructure. Partner selection is a common exam scenario — a question might describe a company with an existing AWS environment and ask which partner is the most natural fit (Amazon Connect).

---

### Slide 2: Partner Telephony vs. Bring Your Own Telephony (BYOT)

**Visual:**
```
  PARTNER TELEPHONY                        BRING YOUR OWN TELEPHONY (BYOT)
  ─────────────────────────                ───────────────────────────────────
  ┌─────────────────────────┐              ┌───────────────────────────────────┐
  │  Salesforce-Certified   │              │   Customer's Existing Telephony   │
  │  Partner                │              │   (Avaya / Cisco / Custom)        │
  │  (Amazon Connect /      │              └──────────────────┬────────────────┘
  │   Genesys / NICE CXone) │                                 │
  └───────────┬─────────────┘                                 │  SIP / API connector
              │                                               │  (custom-built)
              │  Managed Package                              │
              │  (AppExchange install)                        │
              ▼                                               ▼
  ┌─────────────────────────┐              ┌───────────────────────────────────┐
  │  Salesforce Org         │              │  Salesforce Voice API             │
  └───────────┬─────────────┘              └──────────────────┬────────────────┘
              │                                               │
              └───────────────────┬───────────────────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │     Service Cloud Voice      │
                   │  (Voice Call Record, Routing,│
                   │   Transcript, Omni-Channel)  │
                   └──────────────────────────────┘

  Salesforce-supported end-to-end         Customer owns integration + support
```

**Content:**
- **Partner Telephony:** Salesforce has pre-built, certified integrations with Amazon Connect, Genesys Cloud CX, and NICE CXone. The integration is delivered as a managed package installed from AppExchange. Salesforce supports the integration end-to-end.
- **Bring Your Own Telephony (BYOT):** Customers with existing telephony investments (e.g., Avaya, Cisco, or a custom system) can connect to Service Cloud Voice using Salesforce's published Voice APIs and event streaming. Salesforce provides the framework; the customer or a partner builds the connector.
- BYOT offers more flexibility but requires more implementation effort and custom development. There is no managed package — the customer owns the integration.
- Partner Telephony is recommended for new deployments and for customers who want a supported, upgrade-safe integration
- BYOT is appropriate when a customer has a significant existing telephony investment they cannot replace in the near term

**Speaker Notes:** The BYOT vs Partner Telephony distinction is a classic exam scenario. The key differentiator is support model and implementation complexity. Partner Telephony = managed package + Salesforce support. BYOT = custom connector + customer-owned support. If a question describes a company that has "already invested heavily in their telephony infrastructure and cannot replace it for 3 years," BYOT is the right answer. If the company is starting fresh or has AWS infrastructure, Partner Telephony with Amazon Connect is the right answer.

---

### Slide 3: Amazon Connect Deep Dive — Architecture Components

**Visual:**
```
  Phone Call (PSTN)
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                   AWS / AMAZON CONNECT                        │
│                                                               │
│  ┌─────────────────────────┐     ┌──────────────────────────┐ │
│  │  Amazon Connect         │────▶│  Amazon Connect          │ │
│  │  Instance               │     │  Contact Lens            │ │
│  │  (call routing, queuing,│     │  (real-time transcription│ │
│  │   agent desktop, audio) │     │   sentiment, PII masking)│ │
│  └─────────────────────────┘     └─────────────┬────────────┘ │
│                                                │              │
│                                                ▼              │
│                                  ┌──────────────────────────┐ │
│                                  │  AWS Lambda              │ │
│                                  │  (event bridge — fires   │ │
│                                  │   on answer / hang-up /  │ │
│                                  │   transfer events)       │ │
│                                  └─────────────┬────────────┘ │
└────────────────────────────────────────────────┼──────────────┘
                                                 │  Transcript + Events
                                                 ▼
┌───────────────────────────────────────────────────────────────┐
│                      SALESFORCE ORG                           │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Salesforce Voice for Amazon Connect (Managed Package)  │ │
│  │  (CTI adapter, streaming config, setup components)      │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                             │                                 │
│                             ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Service Cloud Voice                                     │ │
│  │  (Voice Call Record, Omni-Channel routing, transcript)   │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                             │                                 │
│                             ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Agentforce Agent (Atlas Reasoning Engine)               │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**Content:**
- **Amazon Connect Instance:** The core CCaaS platform hosted in AWS. Handles call routing, queuing, agent desktop, and audio streaming. Each customer deploys their own Amazon Connect instance in their AWS account.
- **Amazon Connect Contact Lens:** The AI/analytics layer within Amazon Connect. Provides real-time transcription, sentiment analysis, and PII/PCI data masking. Contact Lens output (the transcript) is streamed to Salesforce.
- **AWS Lambda:** Serverless functions that can be invoked at key points in the call flow (e.g., on answer, on transfer, on hang-up). Lambda functions are how Amazon Connect sends events and data to Salesforce.
- **Salesforce Voice for Amazon Connect (Managed Package):** Installed from AppExchange. Contains the CTI adapter, the streaming configuration, and the setup components that connect your Salesforce org to your Amazon Connect instance. This is the integration glue.

**Speaker Notes:** This slide covers the most commonly tested integration scenario. Students need to know that Contact Lens does the transcription (not Salesforce), Lambda handles event-based triggers, and the managed package is the install artifact. A question might ask "which component generates the real-time transcript in an Amazon Connect deployment" — the answer is Amazon Connect Contact Lens. Remind students that they do not need to know AWS Lambda syntax for the exam, but they should understand that Lambda is the mechanism for sending call events to Salesforce.

---

### Slide 4: Authentication and Data Flow

**Visual:**
```
  CALLER           AMAZON CONNECT        SERVICE CLOUD VOICE     AGENTFORCE AGENT
    │                    │                       │                       │
    │  1. Dials number   │                       │                       │
    │───────────────────▶│                       │                       │
    │                    │  2. Auth: ANI lookup  │                       │
    │                    │  (optional PIN/IVR)   │                       │
    │                    │──────────────────────▶│                       │
    │                    │                       │                       │
    │                    │  3. Transcript stream │                       │
    │                    │  (Contact Lens → STT) │                       │
    │                    │──────────────────────▶│                       │
    │                    │                       │  4. Voice Call record │
    │                    │                       │  created, Contact     │
    │                    │                       │  matched by ANI       │
    │                    │                       │──────────────────────▶│
    │                    │                       │                       │
    │                    │                       │  5. Atlas reasons on  │
    │                    │                       │  transcript, takes    │
    │                    │                       │  actions              │
    │◀──────────────────────────────────────────────────────────────────│
    │  6. AI responds (autonomous) or suggestions shown (assist mode)   │
    │                    │                       │                       │
    │  7. Hangs up       │                       │                       │
    │───────────────────▶│                       │                       │
    │                    │  Hang-up event        │                       │
    │                    │  (Lambda fires) ──────▶│                       │
    │                    │                       │  8. Post-call AI      │
    │                    │                       │  summary written to   │
    │                    │                       │  Voice Call record    │
```

**Content:**
- **Step 1 — Call arrives:** Caller dials the contact center number. Amazon Connect receives the call via PSTN.
- **Step 2 — Authentication:** Amazon Connect can optionally authenticate the caller using IVR-based ANI lookup or a PIN; this authentication result is passed to Salesforce as a contact attribute.
- **Step 3 — Transcript streaming:** Contact Lens begins transcribing the call in real time. Transcript segments are pushed to Salesforce via the streaming API.
- **Step 4 — Voice Call record creation:** Salesforce creates a Voice Call record, associates it with the identified Contact or Lead, and begins populating the transcript.
- **Step 5 — Agentforce reasoning:** The Agentforce agent receives transcript updates, reasons via Atlas, and either responds (autonomous mode) or pushes suggestions to the agent desktop (assist mode).
- **Step 6 — Post-call:** When the call ends, Amazon Connect sends a hang-up event via Lambda. Salesforce triggers the post-call summarization flow and writes the summary to the Voice Call record.

**Speaker Notes:** Walk through this sequence slowly — it is the mental model students need for troubleshooting questions. A common exam scenario presents a symptom (e.g., "the transcript is appearing in Salesforce but the Voice Call is not being associated with the right Contact") and asks which step in the flow is broken. In this case, the authentication/ANI lookup step (Step 2) is the likely culprit. Understanding the sequence makes these questions much easier to reason through.

---

### Slide 5: SIP Trunking Concepts

**Visual:**
```
┌────────────────────────────┐
│  PSTN                      │
│  (Public Telephone Network)│
│  Physical / carrier lines  │
└─────────────┬──────────────┘
              │
              │  SIP Trunk
              │  (Session Initiation Protocol —
              │   virtual IP-based phone connection
              │   replacing physical lines)
              │
              ▼
┌────────────────────────────────────────────────┐
│  Telephony Partner Cloud                       │
│  (Amazon Connect / Genesys / NICE CXone)       │
│                                                │
│  ┌──────────────────┐   ┌─────────────────────┐│
│  │  Media Stream    │   │  Signaling           ││
│  │  (audio RTP)     │   │  (SIP — call setup / ││
│  │                  │   │   teardown / control)││
│  └────────┬─────────┘   └──────────┬──────────┘│
└───────────┼─────────────────────── ┼───────────┘
            │                        │
            │  Contact Lens converts │
            │  audio to text         │
            ▼                        │
┌────────────────────────────────────────────────┐
│  Salesforce                                    │
│  (receives TEXT transcript — never raw audio)  │
└────────────────────────────────────────────────┘

  Legend: SIP = Session Initiation Protocol
          Salesforce admins do NOT configure SIP — it is the telephony partner's responsibility
```

**Content:**
- **SIP (Session Initiation Protocol):** The industry-standard protocol for initiating, maintaining, and terminating real-time communication sessions over IP networks. SIP is how phone calls travel over the internet.
- **SIP Trunk:** A virtual connection between the telephony partner's cloud and the PSTN. It replaces physical phone lines with IP-based connections. Amazon Connect and other CCaaS platforms use SIP trunks to receive inbound calls and place outbound calls.
- In a Salesforce Voice deployment, the SIP trunk is managed entirely by the telephony partner — Salesforce administrators do not configure SIP directly
- Understanding SIP trunking is important for troubleshooting: if a call connects but audio quality is poor, the issue is likely in the SIP/media layer at the telephony partner, not in Salesforce
- Salesforce receives transcribed text, not raw audio — the conversion from SIP audio to text is handled by Contact Lens (or equivalent) before data reaches Salesforce

**Speaker Notes:** Students with no telephony background sometimes get anxious about SIP. Reassure them that they do not need to configure SIP for the exam or for most Salesforce Voice implementations — the telephony partner handles it. The important thing to know is that SIP is the call transport layer, Contact Lens is the transcription layer, and Salesforce never processes raw audio. If a question asks whether a Salesforce admin needs to configure SIP trunking, the answer is no — that is the telephony partner's responsibility.

---

### Slide 6: Genesys Cloud CX and NICE CXone Integration Overview

**Visual:**
```
  GENESYS CLOUD CX                            NICE CXone
  ─────────────────────────────               ─────────────────────────────────
  ┌─────────────────────────┐                 ┌─────────────────────────────┐
  │  Genesys Cloud CX       │                 │  NICE CXone                 │
  │  (CCaaS platform)       │                 │  (CCaaS platform)           │
  └────────────┬────────────┘                 └───────────────┬─────────────┘
               │                                              │
               │  Genesys AppFoundry                          │  NICE CXone for
               │  Connector (Managed Pkg)                     │  Salesforce Connector
               │                                              │
               ▼                                              ▼
  ┌─────────────────────────┐                 ┌─────────────────────────────┐
  │  Salesforce Org         │                 │  Salesforce Org             │
  └────────────┬────────────┘                 └───────────────┬─────────────┘
               │                                              │
               ▼                                              ▼
       Transcript API                                 Transcript API
       Omni-Channel handoff                           Omni-Channel handoff

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  Both follow the same pattern: Managed Package + Transcript Streaming   │
  │  + Omni-Channel Handoff — identical Salesforce-side architecture        │
  └─────────────────────────────────────────────────────────────────────────┘
```

**Content:**
- **Genesys Cloud CX:** Enterprise-grade CCaaS platform. Strong global routing, workforce management, and multi-channel capabilities. The Salesforce integration is delivered via the Genesys AppFoundry and a managed package. Transcription is handled by Genesys Cloud's built-in speech recognition.
- **NICE CXone:** Market leader in compliance-focused deployments (financial services, healthcare). Strong workforce management and quality monitoring features. Integration with Salesforce is via the NICE CXone for Salesforce connector.
- Both integrations follow the same fundamental pattern as Amazon Connect: managed package + transcript streaming + Omni-Channel handoff
- The key differences are in the underlying CCaaS features (routing algorithms, workforce management depth, geographic availability) rather than the Salesforce integration architecture
- For the exam, know that all three partners are **Partner Telephony** options (not BYOT), and that each requires its own managed package

**Speaker Notes:** Exam questions rarely test deep Genesys or NICE-specific configurations — they focus on the Salesforce side. What students need to know is that all three partners follow the same architectural pattern and are all "Partner Telephony" (not BYOT). If a question describes a "financial services company with strict call recording compliance requirements," NICE CXone is a reasonable fit based on its compliance-first reputation, but the Salesforce configuration steps are the same regardless of which partner is used.

---

### Slide 7: Provisioning Requirements and Pre-Flight Checklist

**Visual:**
```
┌──────────────────────────────────────────┬──────────────────────────────────────────┐
│  TELEPHONY PARTNER SIDE (Amazon Connect) │  SALESFORCE SIDE                         │
├──────────────────────────────────────────┼──────────────────────────────────────────┤
│  [ ] AWS account with Amazon Connect     │  [ ] Service Cloud Voice license         │
│      instance provisioned                │      assigned to the org                 │
│                                          │                                          │
│  [ ] Contact Lens enabled on the         │  [ ] Salesforce Voice for Amazon         │
│      Connect instance                    │      Connect managed package installed   │
│                                          │                                          │
│  [ ] Phone number claimed                │  [ ] Named Credential configured for     │
│      (inbound DID or toll-free)          │      Amazon Connect API connection       │
│                                          │                                          │
│  [ ] Contact flow configured to          │  [ ] Voice Call Center created and       │
│      route to Salesforce queue           │      linked to Connect instance          │
│                                          │                                          │
│  [ ] IAM role with permissions for       │  [ ] Omni-Channel enabled with Voice     │
│      managed package (Lambda + STT)      │      channel created and queue assigned  │
└──────────────────────────────────────────┴──────────────────────────────────────────┘
            Both sides must be fully configured before a test call can succeed
```

**Content:**
- **Telephony Partner Side (Amazon Connect example):**
  - AWS account with Amazon Connect instance provisioned in the correct region
  - Contact Lens enabled on the Amazon Connect instance
  - Phone number claimed in Amazon Connect (inbound DID or toll-free)
  - Contact flow configured to route to the Salesforce integration queue
  - IAM role with permissions for the Salesforce managed package to invoke Lambda and read transcripts

- **Salesforce Side:**
  - Service Cloud Voice license assigned to the org
  - Salesforce Voice for Amazon Connect managed package installed from AppExchange
  - Named Credential configured for the Amazon Connect API connection
  - Service Cloud Voice Call Center created and linked to the Amazon Connect instance
  - Omni-Channel enabled with a Voice channel created and assigned to a queue

**Speaker Notes:** This checklist is directly actionable for real implementations. For exam purposes, students should remember that both sides must be configured before any test call can succeed. A common question presents a scenario where test calls are failing and asks what is missing — running through this mental checklist (is the phone number claimed? is Contact Lens enabled? is the Named Credential configured?) is the right approach. Lecture 3 will cover the Salesforce-side steps in detail; this slide sets the stage.

---

## Recording Script

Welcome back. In Lecture 1 we established what Agentforce Voice is and how its three-layer architecture works. In this lecture, we are going to zoom in on the middle layer — the telephony partner — and understand how Salesforce connects to the external phone infrastructure that makes voice calls possible.

Let me start with a foundational point: Salesforce does not own a telephone network. This is by design. Running PSTN infrastructure — the physical and virtual connections that make phone calls work — is a highly specialized, heavily regulated business. Salesforce's competitive advantage is the CRM and AI layer, not carrier infrastructure. So Salesforce partners with established Contact Center as a Service platforms that have already solved the telephony problem. The three primary partners for Agentforce Voice are Amazon Connect, Genesys Cloud CX, and NICE CXone.

When you are choosing between these partners, you are typically not choosing based on Salesforce integration quality — all three have certified, managed-package integrations. You are choosing based on what the customer already has, what their geographic requirements are, and what their compliance needs look like. A customer already deep in the AWS ecosystem will gravitate toward Amazon Connect. A large enterprise with complex multi-channel routing across many countries might prefer Genesys. A financial services firm with strict call recording and workforce management requirements might choose NICE CXone.

Now, before we go deeper on Amazon Connect specifically, I want to clarify a choice that every Salesforce Voice implementation must make: Partner Telephony or Bring Your Own Telephony. Partner Telephony means you are using one of those three certified partners, and the integration arrives as a managed package from AppExchange. Salesforce supports it end-to-end. Bring Your Own Telephony — BYOT — is for customers who have an existing telephony system they cannot or will not replace. Salesforce publishes a Voice API and streaming framework that a developer can use to connect almost any telephony system to Service Cloud Voice. But it requires custom development, the customer owns the integration, and Salesforce does not provide managed-package support for it. For new deployments, Partner Telephony is almost always the right recommendation. For customers with a major existing telephony investment, BYOT preserves that investment while still bringing AI capabilities to the Salesforce layer.

Let's go deep on Amazon Connect, because it is the most commonly deployed partner and the one most likely to appear in exam scenarios. An Amazon Connect deployment for Salesforce Voice has four key components. First, the Amazon Connect instance itself — this is the core CCaaS platform in AWS, which handles call routing, queuing, and the agent desktop. Each customer deploys their own Amazon Connect instance in their AWS account. Second, Contact Lens — this is the AI layer within Amazon Connect. Contact Lens does the real-time speech-to-text transcription, runs sentiment analysis, and handles PCI data masking (replacing spoken credit card numbers with asterisks before the transcript is sent anywhere). Third, AWS Lambda — serverless functions that fire at key points in the call lifecycle, such as when a call is answered, transferred, or hung up. Lambda is how Amazon Connect sends structured event data and transcript content to Salesforce. Fourth, the Salesforce Voice for Amazon Connect managed package — this is installed from AppExchange into your Salesforce org and contains the CTI adapter, the streaming configuration, and all the setup components that link your org to your Amazon Connect instance.

Let me now walk you through the data flow during a live call. A customer dials your contact center number. Amazon Connect receives the call through a SIP trunk — a virtual IP-based connection to the public telephone network. Contact Lens starts transcribing immediately. Those transcript segments are pushed in near real time to Salesforce through the streaming API. Salesforce creates a Voice Call record, tries to match the caller's phone number to an existing Contact or Lead, and starts the Omni-Channel routing process. If you are using agent assist mode, a human agent receives the call through the softphone widget, and the Agentforce agent starts surfacing suggestions on their screen. If you are using autonomous mode, the Agentforce agent is responding directly. When the call ends, Amazon Connect fires a hang-up event via Lambda, and Salesforce triggers the post-call summarization — an AI-generated summary is written to the Voice Call record automatically.

A quick word on SIP trunking, because it comes up in discussions with customers who have a network background. SIP — Session Initiation Protocol — is the standard protocol for setting up and tearing down voice calls over IP networks. A SIP trunk is the virtual equivalent of a physical phone line. In a Salesforce Voice deployment, the SIP trunk is managed entirely by the telephony partner. Salesforce administrators do not configure SIP. Salesforce never processes raw audio — by the time audio-derived data reaches Salesforce, it is already a text transcript. So if a customer asks "do I need to open SIP ports to Salesforce?" the answer is no — the SIP layer stays between the PSTN and the telephony partner cloud.

We close this lecture with the provisioning checklist — the pre-flight items that must be in place on both the telephony side and the Salesforce side before you can run your first test call. On the telephony side: AWS account with Amazon Connect instance, Contact Lens enabled, phone number claimed, contact flow configured, and IAM role permissions in place. On the Salesforce side: Service Cloud Voice license, managed package installed, Named Credential configured, Voice Call Center created, and Omni-Channel set up with a voice channel. Lecture 3 will walk through the Salesforce side of this checklist step by step.

---

## Exam Tips

- **Partner Telephony vs BYOT** is a very common exam scenario. The key differentiator is: Partner Telephony = managed package + Salesforce support. BYOT = custom development + customer-owned integration. If the scenario says "existing telephony they cannot replace," lean toward BYOT.
- **Amazon Connect Contact Lens** is the component that generates transcription — not Salesforce. This distinction appears in questions about where transcription is configured and where PCI masking happens.
- **AWS Lambda** is the mechanism for sending call events from Amazon Connect to Salesforce. You do not need to write Lambda code for the exam, but know that it is the event bridge between the two systems.
- When a question lists Amazon Connect, Genesys Cloud CX, and NICE CXone as answer options and asks which is "best for a company with strict compliance and workforce management requirements," **NICE CXone** is typically the intended answer.
- **BYOT requires custom development** — if an exam question asks what a company must build themselves (vs. install from AppExchange), BYOT is the answer. Partner Telephony integration comes as a managed package.

---

## Lecture Summary

- Three primary Partner Telephony options for Agentforce Voice: Amazon Connect (AWS-native, deepest Salesforce integration), Genesys Cloud CX (enterprise multi-channel), and NICE CXone (compliance-focused)
- Partner Telephony uses a Salesforce-certified managed package; BYOT uses Salesforce's published Voice APIs and requires custom development
- Amazon Connect integration involves four components: the Connect instance, Contact Lens (transcription + masking), AWS Lambda (event bridge), and the Salesforce Voice for Amazon Connect managed package
- During a call, transcript segments flow from Contact Lens → Lambda → Salesforce streaming API → Voice Call record → Agentforce agent
- SIP trunking connects the telephony partner to the PSTN; Salesforce administrators do not configure SIP directly
- Both telephony-side and Salesforce-side provisioning steps must be completed before a test call can succeed

---

## Mini Quiz

**Q1:** A company has an existing Avaya contact center platform and significant remaining contract time. They want to bring Agentforce Voice capabilities to their Salesforce org without replacing Avaya. Which integration model should they use?

A) Install the Salesforce Voice for Amazon Connect managed package
B) Bring Your Own Telephony (BYOT) using the Salesforce Voice API
C) Use Genesys Cloud CX as a PSTN bridge for Avaya
D) Upgrade to Open CTI Extended Edition

**Answer:** B — When a customer cannot replace their existing telephony platform, BYOT allows them to connect their system to Service Cloud Voice using the published Salesforce Voice API. Managed packages (A) are only for certified Partner Telephony providers. There is no "Open CTI Extended Edition" (D).

---

**Q2:** In an Amazon Connect + Agentforce Voice deployment, which component is responsible for converting spoken audio into the text transcript that appears in the Salesforce Voice Call record?

A) Salesforce Einstein Speech Services
B) AWS Lambda
C) Amazon Connect Contact Lens
D) Agentforce Atlas Reasoning Engine

**Answer:** C — Amazon Connect Contact Lens handles real-time speech-to-text transcription. Lambda (B) is the event bridge that sends data to Salesforce. The Atlas Reasoning Engine (D) processes the transcript after it arrives in Salesforce — it does not generate it. There is no "Einstein Speech Services" product (A).

---

**Q3:** A Salesforce administrator is setting up Agentforce Voice with Amazon Connect for the first time. They have installed the managed package and configured Named Credentials in Salesforce. A test call fails to connect. Which provisioning step is most likely missing?

A) Agentforce agent Topics have not been configured
B) The Amazon Connect instance does not have a phone number claimed or Contact Lens enabled
C) Service Cloud Voice requires a separate sandbox license
D) The Omni-Channel routing configuration is missing from Agentforce Studio

**Answer:** B — Before a test call can succeed, the Amazon Connect instance must have a phone number claimed (so inbound calls have somewhere to land) and Contact Lens enabled (so transcription can begin). Agentforce agent Topics (A) are needed for AI functionality but not for a basic call connection. Sandbox licensing (C) is not the issue described.
