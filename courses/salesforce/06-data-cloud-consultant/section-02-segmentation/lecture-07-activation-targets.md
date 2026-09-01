# Lecture 07: Activation Targets & Engagement

## Learning Objectives
- Define an Activation Target and describe its role in the Data Cloud workflow
- Configure the three main activation target types: Salesforce CRM, Marketing Cloud, and advertising platforms
- Explain activation membership and how segment members are published to activation targets
- Describe publish schedules and how to select the appropriate contact points for activation

---

## Slides

### Slide 1: What Is an Activation Target?
**Visual:** A flow diagram: Segment (Data Cloud) → Activation Target → three destination icons: Marketing Cloud logo, Salesforce CRM logo, and a Facebook/Google Ads logo.

**Content:**
- An **Activation Target (AT)** is the configuration that defines WHERE a segment is published
- It represents the destination system that will receive segment members
- Types of activation targets: Connected Salesforce org, Marketing Cloud, Advertising platforms (Facebook, Google, LinkedIn)
- Activation sends the list of Unified Individuals (and their contact points) to the destination
- Multiple Activation Targets can receive the same segment simultaneously
- Configured in Data Cloud Setup → Activation Targets

**Speaker Notes:** Activation Targets are the "exit ramp" of Data Cloud — the point where the unified, segmented customer data leaves Data Cloud and reaches the systems that actually communicate with customers. Without Activation Targets, all your segmentation work stays inside Data Cloud and has no business impact. The exam tests both the concept (what is an AT and why does it exist) and the technical configuration (how to set up each type). The key insight is that activation is always driven from a Published segment — you can't activate a Draft segment. And you can push the same segment to multiple destinations simultaneously, which is how omnichannel campaigns work.

---

### Slide 2: Salesforce CRM Activation Target
**Visual:** Configuration panel mockup showing: AT Name, Connected Org dropdown (showing a CRM org), Target Object dropdown (showing "CampaignMember"), and field mapping panel.

**Content:**
- Activates segment members to a **Campaign** or **Campaign Member** in a connected Salesforce org
- Requires a **Connected App** between Data Cloud and the target CRM org
- For same-org activations: Data Cloud and CRM are the same org — connector already configured
- For cross-org activations: a separate org connection must be configured
- Activation creates **Campaign Member records** in the CRM for each segment member
- The Campaign can then be used for sales outreach, service prioritization, or CRM reporting

**Speaker Notes:** The Salesforce CRM Activation Target is used when you want to bring the segmentation intelligence from Data Cloud into your operational CRM workflows. For example: Data Cloud identifies a segment of customers at high churn risk, and you activate that segment to a Campaign in Sales Cloud so account executives receive a task to call each at-risk customer. The connection between Data Cloud and the target org is typically pre-configured as part of the Data Cloud setup. The exam tests the understanding that activation writes Campaign Member records — not Contact or Account records. The Campaign serves as the bridge between Data Cloud's segmentation and CRM's operational workflows.

---

### Slide 3: Marketing Cloud Activation Target
**Visual:** MC Activation configuration showing: Business Unit selection, Subscriber Key field mapping, and additional data attributes panel showing TotalRevenue90d and LoyaltyTier fields being mapped to MC data extensions.

**Content:**
- Activates segment members to **Marketing Cloud** for use in Journeys, Sends, and Automations
- Requires the **Marketing Cloud Connector** to be configured
- Members are sent as **Subscriber records** to a Data Extension in Marketing Cloud
- **Subscriber Key mapping** is required — maps the Data Cloud contact identifier to MC Subscriber Key
- Additional attributes (from DMOs or CIs) can be included in the activation payload to personalize MC content
- The Data Extension in MC is automatically created/updated with each activation

**Speaker Notes:** The Marketing Cloud activation is the most common activation type on the exam because MC is the primary channel system for most Data Cloud implementations. The critical configuration detail is the Subscriber Key mapping — in Marketing Cloud, every subscriber record is identified by a Subscriber Key, and you must map a contact identifier from Data Cloud (typically the email address or a customer ID) to that field. If this mapping is wrong, MC can't associate the activation data with existing subscriber records. Additional attributes allow you to pass Data Cloud metrics (like CI measures) alongside the segment membership — so MC can personalize email content based on the customer's loyalty tier or total spend.

---

### Slide 4: Advertising Platform Activation Targets
**Visual:** Three platform logos (Facebook Custom Audiences, Google Customer Match, LinkedIn Matched Audiences) with arrows from Data Cloud. A panel shows email hashing configuration (SHA-256).

**Content:**
- Data Cloud supports native activation to **Facebook, Google, and LinkedIn** ad platforms
- Uses **Customer Match / Custom Audiences** — match Data Cloud customers to ad platform users
- Activation sends **hashed email addresses or phone numbers** (SHA-256 hash for privacy)
- Match rates vary by platform (typically 40-70%) — not all customers are identifiable on ad platforms
- Useful for: ad suppression (don't advertise to existing customers), lookalike audiences, retargeting
- Requires OAuth connection to each ad platform account

**Speaker Notes:** Advertising activations are tested on the exam primarily from a conceptual and privacy standpoint. The key exam facts: data is sent as hashed PII (SHA-256 hashed emails or phones) — Data Cloud does NOT send raw email addresses to ad platforms. The ad platforms then try to match those hashes against their user databases to identify the same customers. Match rates aren't 100% — this is expected and normal. The common use cases are suppression (tell Facebook "don't show ads to these existing customers"), lookalike audiences (tell Facebook "find users similar to these customers"), and retargeting (show ads to customers who browsed but didn't purchase).

---

### Slide 5: Activation Membership
**Visual:** A Venn-style diagram showing: outer circle "Segment Members (12,450)" → inner circle "Activation-Eligible Members (those with a valid contact point for this channel) (11,200)" → published to Activation Target.

**Content:**
- **Activation membership** ≠ Segment membership — only members with valid contact points are activated
- For email channel activation: member must have a valid, non-opted-out email address
- For phone channel activation: member must have a valid phone number
- For CRM activation: member must have a matching record in the target CRM org
- **Contact Point selection:** for customers with multiple email addresses, specify which to use
  - Options: most recently used, specific Contact Point Type, or all contact points
- Activation membership count = segment members who pass the contact point filter

**Speaker Notes:** The distinction between segment membership count and activation membership count is a frequently tested exam point. Not all segment members can be activated — you can only activate customers for whom you have the required contact information for that channel. A customer might be in your "High Value Customers" segment but have no email address on file — that customer won't be activated to an email campaign. The contact point selection is also exam-relevant: when a customer has 3 email addresses in Data Cloud, which one gets sent to Marketing Cloud? The configuration determines this — you can choose most recently used, a specific contact point type (e.g., "work email"), or all contact points.

---

### Slide 6: Publish Schedules
**Visual:** A calendar/schedule graphic showing an activation target configured to publish every 12 hours. A timeline shows the first publish at Monday 6 AM, second at 6 PM, third at Tuesday 6 AM, each adding/removing members as segment membership changes.

**Content:**
- Activation targets have their own **publish schedule** — independent of segment refresh schedule
- Publish schedule options: **Continuous, 12 hours, 24 hours, or manually triggered**
- **Continuous publishing:** activates changes as soon as the segment refreshes (fastest)
- **Full vs. Incremental publish:**
  - **Full publish:** sends ALL current segment members on each run
  - **Incremental publish:** sends only NEW members added since last publish (where supported)
- The publish schedule determines how quickly new segment members reach the destination
- Dependency: segment must refresh before publish can include new members

**Speaker Notes:** Publish schedules are another place where the exam tests operational understanding. The cascade is: Data Stream refresh → DMO update → CI refresh → Segment refresh → Activation publish. If the segment refreshes every 24 hours and the activation publishes every 12 hours, a publish might run before the segment has refreshed with new members. This is fine operationally — the activation just sends the same members again. But if the question asks "how quickly will a new customer who just met the segment criteria appear in Marketing Cloud?" the answer depends on the entire chain of refresh schedules. Full vs. incremental publish is relevant for performance — incremental is more efficient for large segments where most members don't change between runs.

---

### Slide 7: Activation Data Configuration
**Visual:** Activation setup panel showing two sections: "Contact Point" (Email Address selected, with Contact Point Type = "Personal Email") and "Activation Attributes" panel showing additional fields being added to the activation payload (LoyaltyTier, TotalSpend90d, LastPurchaseDate).

**Content:**
- **Contact Point configuration:** select which contact point type to use for the channel
- **Activation Attributes:** additional data fields to include alongside segment membership
  - Can include Individual/Unified Individual field values
  - Can include Calculated Insight measure values
  - Can include related DMO field values
- Attributes are delivered alongside segment membership to enrich destination system records
- Example: send TotalSpend90d and LoyaltyTier to MC so Journey Builder can personalize email content
- Attribute selection is configured per Activation Target

**Speaker Notes:** Activation Attributes are the mechanism for making activations more than just "here's a list of email addresses." By including additional data fields, you're passing intelligence from Data Cloud to the destination system. Marketing Cloud can then use those attributes in dynamic content, personalization strings, and Journey decision splits. For example, a Journey might route customers to different email paths based on the LoyaltyTier attribute received from Data Cloud. The exam tests that activation attributes can include CI measures — this is important because CI measures (like TotalSpend90d) are computed metrics that don't exist as simple DMO fields.

---

### Slide 8: Activation Troubleshooting
**Visual:** A troubleshooting flowchart with three branches: Branch 1 "Activation shows 0 members" → check segment is Published, check contact points exist. Branch 2 "Activation members less than expected" → check contact point filter, check consent exclusions. Branch 3 "Activation target not receiving data" → check connection configuration, check publish schedule.

**Content:**
- **0 members activated:** segment is in Draft state, or no members have valid contact points
- **Fewer members than expected:** contact point filter too restrictive, or consent exclusions removing members
- **Activation target not receiving data:** connection to destination system is broken, or publish schedule hasn't run
- **Duplicate records in MC:** Subscriber Key mapping is incorrect — multiple contact points creating duplicate MC subscribers
- **Stale data in MC:** segment refresh schedule and publish schedule are misaligned
- **Check the Activation Log** in Data Cloud for error messages and last publish details

**Speaker Notes:** Troubleshooting activation is a common exam scenario type. The most important troubleshooting path: if nothing is being activated, the first check is whether the segment is Published. Draft segments cannot be activated. If some members are missing, check the contact point filter and consent exclusions. If the destination system isn't receiving data at all, check the connection (Connected App credentials, MC connector authorization) and the publish schedule. The Activation Log is the go-to diagnostic tool — it shows the last publish timestamp, the member count, and any error messages. Knowing to check the Activation Log is itself an exam answer.

---

## Recording Script

Welcome to Lecture 07, the final lecture of Section 2. We've built segments — now let's get them out to the systems that actually reach customers. That's what Activation Targets do.

An Activation Target defines the destination for your segment. Data Cloud currently supports three main AT types: the connected Salesforce CRM (for Campaign Member records), Marketing Cloud (for subscriber-based outreach), and advertising platforms like Facebook, Google, and LinkedIn (for paid media targeting).

Let's walk through the Marketing Cloud activation, which is the most commonly tested. When you activate a segment to MC, Data Cloud sends a list of customers — their email addresses or phone numbers — to a Data Extension in MC. Those customers then appear in MC's Journey Builder as a target audience, or they can be used directly in an email send. You can also include activation attributes — extra data fields like loyalty tier or a Calculated Insight metric — that travel with the segment membership and can personalize the MC content.

Here's a critical distinction: **segment membership** is not the same as **activation membership**. Your segment might have 12,000 members, but if 800 of them have no email address on file — or have opted out — they won't appear in the MC activation. The activation count is always equal to or less than the segment count.

For advertising platforms, Data Cloud sends hashed email addresses using SHA-256 — never raw PII. The ad platforms use those hashes to find matching users in their systems. Match rates are typically 40-70%, so don't be surprised if only half your segment appears as a Custom Audience in Facebook.

Publish schedules work independently of segment refresh schedules. The entire chain matters: Data Stream → DMO → CI → Segment refresh → Activation publish. Every step has its own schedule, and you need them coordinated to ensure timely delivery of fresh audiences to your destinations.

For troubleshooting: if zero members are being activated, check whether the segment is Published. If you're seeing fewer than expected, check consent exclusions and contact point configuration. If the destination isn't receiving data, check the connection and the publish schedule log.

That wraps up Section 2. In Section 3, we move into governance, consent, and administration. See you there.

---

## Exam Tips

- Segments must be **Published** (not Draft) before they can be used in an Activation Target
- **Activation membership** can be less than segment membership — only members with valid, non-opted-out contact points are activated
- Advertising platform activations use **SHA-256 hashed** email/phone — never raw PII
- Marketing Cloud activation requires proper **Subscriber Key mapping** — incorrect mapping causes duplicate MC subscriber records
- Activation attributes can include **Calculated Insight measures**, enabling enriched personalization in the destination system

---

## Lecture Summary

Activation Targets are the configured destinations where Data Cloud segment members are published — including Salesforce CRM, Marketing Cloud, and advertising platforms (Facebook, Google, LinkedIn). Activation membership differs from segment membership because only members with valid, non-opted-out contact points are activated. Marketing Cloud activation requires Subscriber Key mapping and supports activation attributes (including CI measures) for personalization. Advertising platform activations use SHA-256 hashed identifiers for privacy compliance. Publish schedules operate independently of segment refresh schedules and the entire refresh chain (Data Stream → DMO → CI → Segment → Activation) must be coordinated for timely delivery. Troubleshooting activation starts with verifying segment publish status, checking contact point configuration, and reviewing the Activation Log.

---

## Mini Quiz

**Question 1:** A segment has 15,000 members in Data Cloud. After activation to a Marketing Cloud Activation Target, the resulting Data Extension only has 13,200 records. No error messages appear in the Activation Log. What is the most likely reason for the discrepancy?

A) The activation job encountered errors that weren't logged  
B) The segment is in Draft status  
C) 1,800 members do not have a valid email contact point or have opted out of email  
D) Marketing Cloud has a limit of 13,200 subscriber records  

**Answer: C**
When activation membership is less than segment membership without errors, the most likely cause is that some segment members don't have valid contact points for the activation channel (no email address on file) or have opted out (HasOptedOutOfEmail = true). If the segment were in Draft status, zero records would be activated.

---

**Question 2:** A Data Cloud implementation sends customer segments to a Facebook Custom Audience for ad targeting. Which method does Data Cloud use to transmit customer identity to Facebook?

A) Raw email addresses transmitted via HTTPS  
B) Salesforce-encrypted customer IDs unique to the org  
C) SHA-256 hashed email addresses or phone numbers  
D) Facebook Pixel tracking codes linked to customer sessions  

**Answer: C**
Data Cloud sends SHA-256 hashed email addresses or phone numbers to advertising platforms. Hashing is a one-way transformation that protects raw PII while still allowing the ad platform to match users within their own systems. Raw PII is never transmitted.

---

**Question 3:** A consultant configures an Activation Target for Marketing Cloud and adds TotalSpend90d (a Calculated Insight measure) as an Activation Attribute. What is the purpose of including this attribute in the activation?

A) To determine which customers qualify for segment membership  
B) To enrich Marketing Cloud subscriber records with the computed metric, enabling personalization in email content  
C) To trigger the CI to refresh before the activation publish runs  
D) To replace the contact point selection for MC routing  

**Answer: B**
Activation Attributes are extra data fields included alongside segment membership to enrich the destination system's records. Including TotalSpend90d allows Marketing Cloud to use that metric in personalization strings, Journey decision splits, or dynamic content — for example, showing different email offers to customers with different spend levels. Activation attributes do not determine segment membership (that's criteria filters) and do not control CI refresh scheduling.
