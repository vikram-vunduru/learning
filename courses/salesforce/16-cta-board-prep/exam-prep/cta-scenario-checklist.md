# CTA Board Exam — Scenario Checklist and Practice Scenarios

## Overview

This checklist is your 30-minute scenario analysis companion and your pre-presentation quality gate. Use it during practice sessions to train the habit of systematic coverage, and use the mental version of it during your actual exam. The checklist is organized into the phases of the CTA session. After the checklist, this file contains five complete practice scenarios from diverse industries — each designed to develop different architectural muscles.

## Foundations

The CTA board exam rewards systematic, deliberate architecture thinking. The most common reason candidates fail is not lack of knowledge — it is lack of coverage. A candidate who deeply addresses 3 of 5 architecture domains and ignores the other 2 will fail, even if their answers in the 3 domains are excellent. The checklist habit is the antidote to coverage gaps.

During your 30-minute scenario review, this checklist should be running as a mental background process. You don't need to write it all down — you need to internalize it so thoroughly that the checks become automatic. The practice scenarios at the end of this document are designed to stress-test your checklist discipline against unfamiliar scenario types.

---

## Part 1: 30-Minute Scenario Analysis Checklist

### Domain Coverage — Initial Scan
Run through each domain. Mark: (1) Requirements present, (2) Requirements implied, (3) No requirements — confirm and note
- [ ] **Data Architecture**: volume numbers, migration mentions, data quality issues, number of source systems, schema mentions
- [ ] **Security & Sharing**: compliance keywords (GDPR, HIPAA, SOX, FINRA), multi-org/BU, partner/community access, sensitive fields mentioned, user role complexity
- [ ] **Integration Architecture**: external systems count, "real-time" vs "nightly" language, API mentions, legacy systems, on-premise systems behind VPN
- [ ] **Identity & Access Management**: SSO mentions, existing IDP named (Azure AD, Okta, ADFS), community/portal users, social sign-on requirements, MFA requirements
- [ ] **Application Lifecycle Management**: multiple teams, regulated industry, compliance audit requirements, multiple orgs, "monthly release" or "continuous deployment" language
- [ ] **Application Architecture**: specific cloud products implied (Service Cloud, FSC, Health Cloud, CPQ), phasing requirements, UX/accessibility requirements, mobile requirements

### Requirement Categorization
For every stated requirement:
- [ ] Is it functional or non-functional?
- [ ] Is it current-state or future-state?
- [ ] Is it explicit or implied?
- [ ] Which domain(s) does it touch?
- [ ] What architectural decision does it drive? (The "so what" test)

### Constraint Classification
For every constraint:
- [ ] Hard constraint (legal/regulatory, existing system cannot be replaced, hard budget ceiling) — must be respected, never deferred
- [ ] Soft constraint (preference, timeline aspiration, organizational preference) — can be managed through phasing or negotiation
- [ ] Does this constraint conflict with any requirement? If so, surface the conflict in your presentation.

### Red Flag Signals — Confirm if Present
- [ ] Record volumes >1M on any object → LDV strategy required
- [ ] GDPR mentioned → Hyperforce EU, data residency, consent tracking, right to erasure
- [ ] HIPAA mentioned → Shield Encryption, BAA, minimum necessary access, PHI field identification, no PHI in test environments
- [ ] SOX/FINRA mentioned → Shield Event Monitoring, Field Audit Trail (7-year retention)
- [ ] FedRAMP/Government → Salesforce Government Cloud Plus
- [ ] "Real-time" + external system → synchronous integration, latency budget, error handling
- [ ] "Concurrent users" >10K → Experience Cloud scaling, LWR, CDN
- [ ] "Multiple orgs" or "separate BUs" → multi-org strategy, Salesforce-to-Salesforce, org consolidation
- [ ] "Offline" mobile requirement → Briefcase, mobile app offline, sync strategy
- [ ] Legacy system migration → 3-phase migration, external IDs, rollback plan, data quality
- [ ] "SSO" + named IDP → SAML 2.0 / OAuth 2.0 design required
- [ ] "Distributor" or "Partner" access → Experience Cloud Partner Community, sharing isolation
- [ ] CPQ or "complex pricing" → Salesforce CPQ, price books, approval workflows

### Assumption List (State These in Your Presentation Opening)
- [ ] What's the primary Salesforce licensing in scope? (Sales Cloud, Service Cloud, FSC, Health Cloud, etc.)
- [ ] What's the integration middleware? (MuleSoft, Boomi, native, etc.)
- [ ] What's the existing IDP (if not stated)?
- [ ] What's the data center requirement (US, EU, APAC)?
- [ ] What does "current state" data quality look like (if not stated)?
- [ ] Who are the system users (internal agents, portal users, guest users)?

### Architectural Drivers — Identify the Top 3
The 2-3 requirements that determine the core architecture. Everything else flows from these.
- [ ] Architectural Driver 1: _________________ → drives _________________ domain decisions
- [ ] Architectural Driver 2: _________________ → drives _________________ domain decisions
- [ ] Architectural Driver 3: _________________ → drives _________________ domain decisions

---

## Part 2: Pre-Presentation Quality Gate (45 Minutes)

### Requirement Coverage Map
Before presenting, confirm:
- [ ] Every stated requirement maps to at least one architectural decision you will describe
- [ ] No stated requirement is left unaddressed
- [ ] Implied requirements are called out explicitly: "The scenario implies [X], which means I need to also address [Y]"
- [ ] Every constraint is respected in your solution — no constraint violations

### Domain Coverage Confirmation
- [ ] Data Architecture addressed (even briefly if low requirements) — mention schema, volume implications, migration if applicable
- [ ] Security & Sharing addressed — at minimum: OWD decision, community/portal sharing if present
- [ ] Integration Architecture addressed — every external system connection has a pattern and rationale
- [ ] Identity & Access Management addressed — every user type has an authentication path
- [ ] ALM addressed — at minimum: environment strategy mentioned, package vs org dev model position stated
- [ ] Application Architecture addressed — cloud products named, phasing stated

### Trade-Off Register
For every major architectural decision, confirm you can state:
- [ ] What you chose (X)
- [ ] Why you chose it (tied to scenario constraint or requirement)
- [ ] What you rejected (Y) and specifically why
- [ ] What the trade-off is (cost, risk, or limitation of X)
- [ ] Under what condition you'd reconsider (optional but strengthens the answer)

### Constraint Compliance Check
- [ ] Every hard constraint is respected in your solution — review each one
- [ ] Compliance requirements are in Phase 1 (never deferred)
- [ ] Budget constraint reflected in technology choices (platform-native before custom, packaged before bespoke)
- [ ] Timeline constraint reflected in phasing (MVP first, advanced features later)

### Phasing Clarity
- [ ] Phase 1 is clearly scoped (what's in, what's out, why these choices)
- [ ] Phase 2 and Phase 3 are directionally described (not fully designed, but clearly positioned)
- [ ] Phase 1 architecture supports Phase 2/3 without rework (stated explicitly)
- [ ] Compliance requirements confirmed in Phase 1

### Diagram Preparation
- [ ] System context diagram ready (actors + Salesforce + external systems)
- [ ] Architecture overview diagram ready (multi-cloud + integration layer) if multi-cloud scenario
- [ ] Data flow diagram ready if migration or complex integration is a driver
- [ ] Security/sharing diagram ready if sharing complexity is a driver
- [ ] Every connection in every diagram has: protocol label, direction, frequency

---

## Part 3: 45-Minute Presentation Structure

| Segment | Duration | Content |
|---------|----------|---------|
| Opening | 3 min | Business context (2 sentences), assumptions (list), domains to cover (list) |
| Domain 1 (primary driver) | 6-8 min | Architecture decision, trade-off, diagram |
| Domain 2 | 6-8 min | Architecture decision, trade-off |
| Domain 3 | 6-8 min | Architecture decision, trade-off, diagram if relevant |
| Domain 4 | 5-6 min | Architecture decision, trade-off |
| Domain 5 (if present) | 4-5 min | Architecture decision |
| Closing summary | 3 min | Key decisions recap, phasing summary, invitation to Q&A |
| Buffer | 5 min | Do not fill — use to go deeper if time allows |

---

## Part 4: Q&A Preparation — Top 20 Questions

Prepare answers to these questions for every practice scenario:

1. Why did you choose [X] over [Y] for [specific decision]?
2. What if the data volume was 10x — does your architecture still hold?
3. Your [integration] calls [external system]. What happens if it's unavailable at 2 AM?
4. Walk me through exactly how your sharing model prevents [User Type A] from seeing [User Type B]'s data.
5. Your Phase 1 is 6 months. That's aggressive for the scope. What would you cut if forced to deliver in 4 months?
6. You mentioned [compliance requirement]. Is [Salesforce feature you recommended] sufficient on its own? What else does the customer need?
7. How does your architecture change if the customer decides to add [new cloud/capability] in Phase 3?
8. The [legacy system] you're migrating from — what's your rollback plan if Phase 3 cutover fails?
9. What does post-go-live look like? How do you monitor the architecture you've designed?
10. You assumed [specific assumption]. What if that assumption is wrong?
11. [Specific platform feature] has [limit]. How does your design stay within that limit?
12. Your budget is $4M total. Does your architecture stay within that constraint?
13. Who is accountable for [specific architectural component] post-implementation?
14. You said you'd use MuleSoft. What specifically would you use Salesforce-native for instead?
15. Walk me through the data model for [key object]. What are the key fields and relationships?
16. Your CI/CD pipeline — what happens when a deployment fails in the Full Sandbox the night before go-live?
17. How do you handle the change management impact of this architecture on the end users?
18. If the IT team has no Salesforce DevOps experience, does your ALM recommendation change?
19. GDPR right to erasure — how does your architecture support a customer requesting their data be deleted from all systems?
20. What would you have designed differently if you had more time in the scenario review?

---

## Part 5: Solution Red Flags — Panel Attack Points

Review your solution for these common vulnerabilities before presenting:

- **LDV without sharing model impact analysis:** Did you recommend Private OWD on an object with >1M records? The panel will ask about sharing recalculation.
- **Shield encryption without encrypted field limitations:** Did you recommend Shield without noting that encrypted fields can't be in WHERE clauses, formula fields, or roll-up summaries?
- **MuleSoft without cost acknowledgment:** Did you recommend MuleSoft without acknowledging the licensing cost and positioning it against the alternative?
- **Single org without GDPR data residency strategy:** Did you recommend a single global org for an EU+US scenario without explaining Hyperforce data residency?
- **Platform Events without retention/DLQ strategy:** Did you use Platform Events for critical integration without addressing the 72-hour retention window and DLQ?
- **Experience Cloud without Guest User OWD:** Did you design an Experience Cloud portal without explicitly stating the Guest User External OWD setting?
- **Migration without rollback plan:** Did you describe a data migration without stating the rollback procedure?
- **Phase 1 without compliance:** Did you defer HIPAA or GDPR requirements to Phase 2? The panel will catch this.
- **Integration without error handling:** Did you describe an integration without stating retry strategy and error handling?
- **ALM without test environment strategy:** Did you address what to build without addressing how to test and deploy it?

---

## Part 6: Five Additional Practice Scenarios

The following five scenarios are designed to supplement the main five in section-03-scenario-practice. These cover different industries and architectural profiles. Each includes a complete sample solution.

---

### Practice Scenario A: US State Government — Constituent Services Portal

**Business Background:**
A US state government agency responsible for unemployment insurance administration, managing 800,000 active unemployment claimants, 12,000 state employees, and processing $2.8B in annual benefit payments. The agency uses a 30-year-old COBOL-based mainframe for claim processing and a collection of siloed point solutions (separate systems for fraud detection, appeals, employer tax accounts). COVID-19 created a 10x spike in claim volumes that exposed system fragility. The Governor's office has mandated a modernization program with a $22M budget over 36 months.

The agency must comply with federal DOL regulations, state data security standards, and FedRAMP requirements (since federal funding flows through this system). Salesforce Government Cloud Plus is the only approved cloud platform under the state's master service agreement.

**Current State:**
- COBOL mainframe: 800K active claimants, 5M historical claims (30 years of data), all claim calculations run here — cannot be replaced in this program (too risky, separate multi-year effort)
- Legacy CRM (Siebel, 15 years old): 12,000 state employees use it to manage claimant inquiries; 2M case records
- Fraud detection: third-party SaaS (Equifax Workforce Solutions) — batch file exchange via SFTP, no API
- Employer tax accounts: separate Oracle database, 250,000 employer records
- Constituent portal: none — claimants call the agency (1.2M calls/month) or visit field offices

**Requirements:**
1. **Constituent Self-Service Portal:** Claimants can file initial claims online, check payment status (real-time from mainframe), upload documents, submit appeals, and communicate with case workers through secure messaging. Must handle 100,000 concurrent users during weekly payment processing days. Section 508 accessibility compliance required (federal mandate).
2. **Agent Desktop Modernization:** Replace Siebel with Service Cloud. All 12,000 state employees need unified view of claimant: claim history (from mainframe), payment history, document library, case history. Omnichannel: phone (existing call center), email, web chat, and secure portal messaging.
3. **Fraud Detection Integration:** Integrate Equifax Workforce Solutions. Current SFTP batch process causes 3-day fraud delay. Target: near-real-time fraud scoring for new claims within 4 hours of submission. Equifax is rolling out a REST API in 6 months.
4. **Employer Self-Service Portal:** 250,000 employers can file quarterly wage reports (feeds mainframe calculations), pay unemployment taxes, and view their account status. EDI integration with large employers (>500 employees) must be maintained.
5. **Analytics:** State legislators need monthly dashboards: claim volume by county, average processing time, fraud rate, benefit payment accuracy. Agency leadership needs operational dashboards: real-time call volume, open appeals aging, agent performance.

**Constraints:**
- FedRAMP Moderate authorization required → Salesforce Government Cloud Plus only
- COBOL mainframe cannot be replaced — all integrations with mainframe must be asynchronous (mainframe cannot handle synchronous API calls from web-scale traffic)
- Claimant data is PII under state law and federal FERPA/Privacy Act — encryption at rest required
- No real-time write to mainframe — mainframe processes nightly batch; all claim submissions must queue for nightly processing
- Budget: $22M over 36 months (includes licensing)
- Equifax API not available for 6 months

**Sample Solution Architecture:**

*Data Architecture:*
- Service Cloud with custom Claimant object (Person Account for B2C constituents) — not standard Account/Contact, given government-specific data model requirements
- 800K active claimants → manageable, not LDV territory for Person Account
- External IDs: Claimant SSN (encrypted) as external ID for mainframe sync — never store raw SSN in searchable fields (Shield deterministic encryption for SSN lookup)
- 5M historical claims → load historical active period (last 3 years) into Salesforce Big Objects for compliance access, leave older records in mainframe archive
- Migration from Siebel: 2M case records → migrate via Bulk API 2.0 with external ID (Siebel Case ID)

*Security Architecture:*
- Shield Platform Encryption: SSN, DOB, bank account numbers, PII fields — required by state law and FedRAMP
- Shield Event Monitoring: all data access logged — state audit requirements, fraud investigation use case
- Employee sharing: Private OWD on Claimant → role hierarchy (case worker sees assigned claimants, supervisor sees team, director sees agency)
- Guest User (portal unauthenticated): NO — all constituent portal access requires authentication. Pre-registration via SSN + DOB identity verification.
- FedRAMP: Government Cloud Plus satisfies FedRAMP Moderate inherently — candidate must know this distinction

*Integration Architecture:*
- Mainframe integration: async queue pattern — claim submission in Salesforce creates Platform Event → MuleSoft API picks up, transforms, queues for nightly mainframe batch → mainframe processes overnight → result file returned → updates Salesforce claim status
- Payment status (real-time from mainframe): mainframe exposes read-only REST endpoint (designed separately) → Salesforce callout via Named Credential → real-time display in portal
- Equifax (current): scheduled MuleSoft job generates request file, transfers via SFTP, receives response file, updates fraud score on Claim record — runs every 4 hours
- Equifax (6-month future state): when REST API available, replace SFTP with synchronous REST callout triggered by claim submission — reduces fraud delay from 4 hours to real-time
- Employer EDI: MuleSoft EDI connector handles X12 file exchange — transforms to Salesforce objects

*Identity Architecture:*
- State employees: state Active Directory → SAML 2.0 SP-initiated → Salesforce internal user — JIT provisioning from AD attributes
- Constituents (portal): NO social sign-on — government services require verified identity. Self-registration with identity proofing (SSN + DOB match against mainframe records). Salesforce Experience Cloud handles session.
- Employers: separate Experience Cloud portal, employer EIN + secretary of state registration number for identity proofing
- MFA: required for all state employees (state security policy), optional recommendation for constituent and employer portal

*ALM:*
- Salesforce Government Cloud Plus is separate infrastructure — deployment pipeline must use GovernmentCloud-compatible tooling
- Unlocked packages for Service Cloud configuration, Experience Cloud themes, integration layer
- Test data: cannot use real SSNs in sandbox — synthetic data generation required; Full Sandbox masked before developer access

**Key Trade-offs:**
1. **Mainframe async vs sync:** Mainframe can't handle synchronous API calls at web scale → async queue pattern required. Trade-off: claim status is T+1 (next day), not real-time. Mitigated by real-time status read from mainframe for payment status display.
2. **Equifax SFTP now vs API later:** Design architecture to work with SFTP today (available) with a planned migration to REST API in 6 months. Trade-off: two-version integration logic in MuleSoft, but avoids delaying the project.
3. **Big Objects for historical claims vs full migration:** 5M records × 30 years is too large to migrate fully. Big Objects for last 3 years preserves operational access; older records remain in mainframe. Trade-off: historical claim lookup requires mainframe query for records >3 years old.
4. **Government Cloud Plus vs standard cloud:** FedRAMP requirement mandates GovernmentCloud Plus — no trade-off available, this is a hard constraint.
5. **Identity proofing vs social sign-on:** Government services require verified identity — SSN/DOB proofing appropriate. Social sign-on (Google, Facebook) insufficient for PII access. Trade-off: higher registration friction for constituents.

**Panel Q&A:**
- *"The mainframe cannot handle synchronous API calls. But your constituent portal shows real-time payment status. How is that possible?"* → There are two separate flows: claim submission is async (queue for nightly batch), but payment status display is a read-only GET request to a mainframe reporting endpoint that was specifically designed for read queries. The mainframe can handle read queries — it cannot handle high-volume write transactions at web scale.
- *"Your fraud integration batches every 4 hours but a fraudulent claim can be paid in less than 4 hours. How do you handle this?"* → The current state is 3-day delay, so 4 hours is a dramatic improvement. However, you're right this is still a risk. For high-risk claims (flagged by rule-based pre-screening in Salesforce), I'd hold payment pending fraud score return. The Equifax REST API in 6 months enables real-time scoring — that's the target state.
- *"FedRAMP compliance — what specific Salesforce configuration do you need beyond just using Government Cloud Plus?"* → Government Cloud Plus provides the FedRAMP-authorized infrastructure boundary. Within the implementation: all data classification must map to FedRAMP data categories, audit logging must be enabled (Shield Event Monitoring), access controls must follow NIST 800-53, and annual penetration testing with Salesforce Trust approval is required.
- *"Your Section 508 requirement — which Experience Cloud site type supports WCAG 2.1 AA and how do you validate compliance?"* → LWR (Lightning Web Runtime) sites have stronger accessibility support than Aura. Salesforce base components are tested for WCAG 2.1 AA. Custom components require automated (axe-core) and manual testing. We'd include an accessibility audit in UAT with disabled user representation.
- *"You're migrating 12,000 state employees off Siebel to Service Cloud. What's your training and change management strategy?"* → Phased rollout by agency division, online training via myTrailhead, super-user network (one per office), parallel run period (4 weeks with dual-entry before Siebel decommission). Change management is not an architecture domain but impacts deployment strategy — I'd phase by region to reduce simultaneous change impact.

**Common Mistakes:**
1. Recommending standard Salesforce cloud instead of Government Cloud Plus — instant fail if FedRAMP requirement is stated
2. Designing synchronous mainframe integration — misses the "cannot handle synchronous API calls" constraint
3. Recommending social sign-on for constituent identity — inappropriate for government PII access
4. Not addressing Section 508/WCAG accessibility requirement
5. Proposing full 30-year historical data migration without addressing the volume implications

---

### Practice Scenario B: Media & Entertainment — Streaming Platform

**Business Background:**
StreamVault — a global streaming media company with 85M subscribers in 45 countries, $6B annual revenue (subscription + advertising). The company produces original content (studio arm) and licenses third-party content. Business model: 3 tiers (Free/ad-supported, Standard $9.99/mo, Premium $14.99/mo). High subscriber churn is a critical business problem: 4% monthly churn on the Standard tier = $34M MRR at risk each month.

Currently: subscription management in a custom-built platform (5 years old), customer support in Zendesk, marketing in a combination of Marketo and in-house tools. No single view of subscriber — support agents can't see subscription tier or viewing history; marketing campaigns can't be targeted based on viewing behavior.

**Current State:**
- Custom subscription platform: 85M subscriber records, subscription tier, payment method, 3 years of payment history
- Zendesk: 3M support tickets/year from 85M subscribers — 2,500 support agents globally
- Adobe Analytics: viewing behavior data (what content was watched, when, how long), content ratings
- Content catalog system (in-house): 50,000 content titles, metadata, rights management
- Churn prediction model: data science team has a model running in Python/Databricks, outputs subscriber churn risk score daily — currently not accessible to marketing or support teams
- No CRM — customer data siloed across all these systems

**Requirements:**
1. **Subscriber 360 View (Service Cloud):** Migrate from Zendesk to Salesforce Service Cloud. Support agents see: subscription tier and history, payment status, viewing history summary (last 10 titles watched), current churn risk score, and all prior support tickets. Case deflection via Knowledge Base required — target 30% case deflection rate.
2. **Churn Prediction-Driven Outreach (Marketing Cloud):** Integrate Databricks churn model output into Marketing Cloud. High-risk subscribers (churn score >0.7) receive personalized retention journeys: recommended content based on viewing history, tier upgrade offer, proactive support outreach. Target: 15% churn reduction for high-risk segment.
3. **Subscription Management Integration:** When an agent processes a downgrade, cancellation, or billing dispute, the change must write back to the custom subscription platform in real-time. Subscription platform is the system of record for subscription state — Salesforce is the engagement layer.
4. **Advertiser CRM (Sales Cloud):** Separate from subscriber management, StreamVault's ad sales team manages relationships with 5,000 advertising accounts. Needs standard Sales Cloud CRM functionality (Opportunities, Forecasting, Contacts). Must be integrated with subscription platform for audience targeting data (aggregate, anonymized — advertisers see segments, not individual subscriber data).
5. **Content Performance Insights (CRM Analytics):** Content editorial team needs dashboards: viewership by title and genre, subscriber engagement cohorts, correlation between content viewing and churn risk. These insights should inform content acquisition decisions.

**Constraints:**
- GDPR: EU subscribers (~35M) — consent tracking, right to erasure, data residency in EU
- CCPA: California subscribers — data deletion rights
- Advertiser audience data: advertisers CANNOT see individual subscriber data — only aggregated segment data (minimum 5,000 subscribers per segment to prevent re-identification)
- Viewing history: extremely sensitive — subscribers are privacy-conscious; minimum necessary access principle applies (support agents see summary, not full history)
- Custom subscription platform cannot be replaced in this program (it handles billing integration with payment processors — too complex for this scope)
- 85M subscriber records → significant data volume in Salesforce

**Sample Solution Architecture:**

*Data Architecture:*
- 85M subscribers → Person Account at full volume = LDV. Strategy: selective indexes on Subscriber ID (external ID), Email, subscription tier fields. Custom skinny table on Account for commonly queried fields (tier, churn score, last payment status) to accelerate agent view load.
- Don't load ALL 85M into Salesforce agent view immediately — Phase 1: load active subscribers with recent support history (30M active, high-engagement). Phase 2: full population.
- Viewing history: NOT stored in Salesforce — remains in Adobe Analytics. Only summary (last 10 titles) surfaced via Salesforce Connect External Object or callout from case record → Privacy principle: minimum necessary data in CRM.
- Churn score: daily sync from Databricks → custom field on Account (ChurnScore__c, ChurnRiskTier__c). Simple, low-volume update.
- GDPR/CCPA: subscriber consent tracking object, right to erasure workflow → triggers deletion of personal fields while retaining anonymized analytics

*Security:*
- Support agents: Private OWD → agent sees assigned cases and linked subscriber. Tier access: all agents can see subscription tier (required for support). Viewing history summary: restricted to Tier 2 agents and above (permission sets).
- Advertiser Sales Cloud: separate user base, no access to subscriber records. Audience segment data in CRM Analytics with strict anonymization (5,000 minimum segment size enforced at report layer).
- GDPR EU data: Hyperforce EU for EU subscriber records OR separate EU org → recommend Hyperforce multi-tenant approach for single reporting layer

*Integration Architecture:*
- Zendesk migration: bulk historical case migration (3M tickets) → Bulk API 2.0 with Case external ID from Zendesk
- Subscription platform → Salesforce: nightly bulk sync for subscription state, real-time Platform Event for cancellations and upgrades (immediate agent visibility)
- Salesforce → subscription platform: synchronous REST callout for agent-initiated changes (downgrade, cancel, billing dispute resolution) — response time requirement: <3 seconds
- Databricks churn model: daily export of churn scores → Bulk API upsert to Account.ChurnScore__c
- Adobe Analytics (viewing summary): on-demand callout when agent opens case — External Services / Named Credential → Adobe Analytics API → returns last 10 titles, displayed in LWC component on Case record

*Identity Architecture:*
- Internal employees (support agents + ad sales): corporate IdP (Okta) → SAML 2.0 SP-initiated → two separate Salesforce user profiles (Service Cloud for agents, Sales Cloud for ad sales team)
- No subscriber portal authentication in Salesforce — subscribers authenticate to StreamVault native apps; Salesforce is back-office only

*Marketing Cloud:*
- MC Connect for subscriber data sync → Salesforce Account data flows to MC Contact Builder
- Churn risk journey: trigger = ChurnScore__c > 0.7 + tier = Standard → Journey Builder → Day 1: personalized email with content recommendations (using Adobe Analytics viewing data via API call in MC Journey) → Day 3: if no engagement, SMS → Day 7: retention offer (free month) → Day 14: if still no engagement, route to proactive support case

*ALM:*
- Two separate user bases and somewhat separate use cases suggest evaluating separate Sales Cloud org for advertiser team vs adding to same org. Recommendation: same org with strict data segregation via profiles — simpler licensing and unified identity.

**Key Trade-offs:**
1. **Load all 85M subscribers vs active subset:** Full load is technically possible but Phase 1 value comes from active support users. Phase in the rest.
2. **Viewing history in Salesforce vs external callout:** Storing 85M × full viewing history in Salesforce is impractical and a privacy risk. External callout for summary is cleaner but introduces latency dependency.
3. **Single org (Service + Sales) vs two orgs:** Same org simpler for identity and reporting; strict profiles ensure advertiser team can't access subscriber PII.
4. **Hyperforce EU vs separate EU org:** Hyperforce allows single-org reporting; separate EU org gives cleaner data boundary but splits reporting.

**Panel Q&A:**
- *"Your churn journey uses Adobe Analytics viewing data inside Marketing Cloud. Adobe Analytics is not a Salesforce product — how does that integration work technically?"* → MC Journey Builder supports custom REST API activities. At the personalization step, a custom Journey Activity makes a callout to Adobe Analytics API (authenticated via connected app) to retrieve viewing recommendations for that specific subscriber ID. The response is used to populate dynamic content blocks in the email.
- *"85M Person Accounts — what specific LDV mitigations are you implementing, and have you validated that Salesforce supports this volume with Person Account specifically?"* → Person Account at 85M is at the high end of production deployments. Mitigations: selective SOQL queries using indexed fields only, skinny table on Account, avoid broad queries in triggers, Bulk API only for DML. I'd want to validate with Salesforce Customer Success that this volume is supported in our contracted edition.

---

### Practice Scenario C: Higher Education — University Student Success Platform

**Business Background:**
StateUniversity — a large public research university, 45,000 students, 8,000 faculty and staff, operating in 12 academic colleges. The university is implementing Salesforce Education Cloud (formerly EDA — Education Data Architecture) to address a student success crisis: 6-year graduation rate of 54% (below peer institutions), early alert system nonexistent, advisor caseloads of 600+ students per advisor making proactive outreach impossible.

The university already uses Banner (Ellucian) as the Student Information System (SIS) — this is the authoritative source for enrollment, grades, financial aid, and degree audit. Salesforce is being positioned as the student engagement layer, NOT a replacement for Banner.

**Current State:**
- Banner SIS: 45,000 student records, 15-year history of enrollment and academic records — highly regulated (FERPA protected)
- No CRM — advising done in spreadsheets, email, and ad-hoc contact
- Degree Works (Degree Audit): integrated with Banner, advisors use web UI — no API available
- Campus email: Microsoft Exchange/Outlook
- Learning Management: Canvas LMS — student course activity data available via Canvas Data (nightly file export)
- Disability Services: separate Accommodate platform (SOAP API available)

**Requirements:**
1. **Student 360 for Advisors:** Advisors see: enrolled courses, GPA trend (current and historical), financial aid status, early alert flags, advising appointment history, and communication history. Must sync from Banner (read-only — no writes to Banner from Salesforce).
2. **Early Alert System:** Faculty can submit alerts for at-risk students (missed assignments, declining participation) via a simple form. Alert routes to student's advisor. Advisors manage intervention workflow in Salesforce. Automated escalation if advisor doesn't act within 5 business days.
3. **Appointment Scheduling:** Students can schedule advising appointments via a self-service portal (authenticated). Appointments sync with advisor Outlook calendars. Reminder emails/SMS to students.
4. **Enrollment Funnel (Recruitment):** Admissions office uses Salesforce for prospective student management — application funnel from inquiry → application → admit → enrolled. Integration with Banner for application status. This is a separate user base from advising.
5. **Retention Analytics:** Institutional Research needs a dashboard: graduation rate by cohort/major/first-generation status, early alert resolution rates, advisor caseload analysis. FERPA-compliant — only authorized personnel see individual student data.

**Constraints:**
- FERPA: student academic records are protected — access strictly on "legitimate educational interest" basis; audit trail required for who accessed what student record
- Banner write-back not permitted — Salesforce cannot update Banner records
- Canvas Data is nightly file export only — no real-time Canvas integration
- Disability Services Accommodate SOAP API — legacy, slow, must be used carefully to avoid overloading
- 8,000 staff/faculty users need some Salesforce access (early alert only for most faculty — minimal license cost is important)
- Budget conscious: public university, must optimize licensing

**Sample Solution Architecture:**

*Data Architecture:*
- Education Cloud (EDA/Salesforce Education Cloud): standard data model — Contact (student), Account (institution/department), Course Connection, Program Enrollment, Term
- Banner sync: nightly bulk import via MuleSoft or Boomi → enrollment data, GPA, financial aid status → Education Cloud objects. External ID: Banner student ID (PIDM)
- Canvas Data: nightly file → Salesforce Data Import → custom object (CourseActivity__c) for Canvas engagement data
- Alert history and communication: native Salesforce Case/Activity objects — no Banner sync needed
- 45,000 students → well within comfortable Salesforce volume, no LDV concern

*Security:*
- FERPA compliance: Private OWD on Contact → advisor sees only their advisee students. Faculty sees only students in their courses (Sharing Rule: Course Connection.Instructor = current user).
- Shield Event Monitoring: FERPA requires logging who accessed student records — log all Contact and Course Connection record views
- Early alert form for faculty: no need for full Salesforce license — Experience Cloud customer community (Education Cloud supports this pattern) with limited profile, can see/create alerts for their students only
- FERPA audit trail: custom FERPA_Access_Log__c object populated by Apex trigger on Contact view (or Event Monitoring API)

*Integration:*
- Banner: nightly Bulk API import (student records updated nightly sufficient for advising use case)
- Outlook calendar: Salesforce for Outlook or AppExchange scheduling tool (Calendly, Chili Piper, or native Salesforce Scheduler) with Outlook integration for appointment sync
- Canvas: nightly file processing → custom scheduled Flow or Apex batch job processes Canvas Data export into CourseActivity__c
- Accommodate (Disability Services): bi-daily Apex callout to SOAP API for active accommodation records → display in Student 360. Rate-limited to avoid overloading legacy SOAP endpoint.

*Licensing optimization:*
- 45,000 students: Experience Cloud customer license for self-service portal (lowest cost)
- 600 advisors: full Education Cloud user licenses (full functionality)
- 8,000 faculty for early alerts: Experience Cloud with limited Early Alert community access (significantly cheaper than internal licenses)
- Institutional Research: CRM Analytics license for 5-10 users

**Key Trade-offs:**
1. **Nightly Banner sync vs real-time:** Banner cannot support real-time Salesforce integration without significant Banner customization. Nightly sync is appropriate for advising data (GPA, enrollment) — real-time is not required.
2. **Education Cloud EDA vs standard Sales/Service Cloud:** EDA provides the right data model for higher education (Term, Course Connection, Program Enrollment) — using Sales Cloud objects would require significant custom development to get the same functionality.
3. **Faculty Experience Cloud vs full Salesforce licenses:** 8,000 faculty × full license = prohibitive cost for a public university. Experience Cloud with limited early alert functionality = same outcome at fraction of cost.

**Panel Q&A:**
- *"FERPA — you're logging record views with Event Monitoring. But 45,000 students × 600 advisors creates millions of access records. How do you manage the retention and access to that audit log?"* → Event Monitoring retains 30 days natively. For FERPA compliance, we'd export Event Monitoring data nightly via the API to an institutional data lake (S3 or Azure Blob) with 7-year retention — FERPA requires records be retained while the student is enrolled and for a reasonable period after. The audit log itself is access-restricted to FERPA compliance officer only.

---

### Practice Scenario D: Telecommunications — Enterprise B2B Sales Transformation

**Business Background:**
TelecomCo — a tier-2 US telecommunications provider, $4.5B annual revenue, serving enterprise and SMB customers with connectivity (fiber, SD-WAN), managed services (cloud, security), and unified communications (UCaaS). 2,500 enterprise sales reps and 800 account managers. Average enterprise deal size: $180K ARR, average sales cycle: 9 months.

Current state: Salesforce Sales Cloud with heavy customization, but a CPQ process that's broken (quotes in Word documents, 4-week turnaround), a churn problem in account management (6% annual churn in enterprise = $27M ARR lost annually), and no 360 view of customer health.

**Current State:**
- Salesforce Sales Cloud: 5M Opportunity records (8 years), heavy custom code (200+ Apex classes), many unused — technical debt
- BSS/OSS stack (Amdocs): billing, order management, provisioning — all customer service data lives here; REST API available
- Commvault/ServiceNow for managed services ticketing — no integration with Salesforce
- Customer portal: old, rarely used (built 2015, non-mobile)
- No CPQ: quotes manually assembled in Word/PDF
- Churn prediction: none — account managers only learn of churn when cancellation notice arrives

**Requirements:**
1. **Revenue Cloud CPQ:** Quote products from a catalog of 2,000 telecom services (connectivity tiers, managed service bundles, UCaaS seats). Pricing: tiered volume discounts, multi-year term pricing (1/2/3-year contracts with different rates), customer-specific discounts. Approval workflows for deals with >15% discount. Generate MSA/SOW documents from template.
2. **Customer Health Score (Account Management):** Build a health score for each enterprise account using: contract renewal date (from BSS), ticket volume and resolution time (from ServiceNow), product utilization (from BSS provisioning API), NPS score (from quarterly survey). Automatically flag at-risk accounts (health score <40) for account manager intervention. Target: predict churn 90 days before renewal.
3. **Customer Portal Modernization:** Self-service portal for enterprise customers: view invoices and pay online, submit service tickets, check order status, view bandwidth utilization dashboards, manage contacts and billing addresses. Target: 50% of routine inquiries resolved without agent involvement.
4. **BSS Integration:** Real-time product availability and pricing from Amdocs BSS. Order write-back: when CPQ order is signed, create order in Amdocs automatically. Customer account sync: Amdocs is master for billing accounts — sync changes to Salesforce.
5. **Territory Realignment:** Sales territory realignment in progress — 2,500 reps being redistributed. Need to implement Salesforce Territory Management to manage geographic territories, align Accounts and Opportunities to territories, calculate quota attainment by territory.

**Constraints:**
- Amdocs BSS is on-premise, behind enterprise network — requires VPN/ExpressRoute connectivity for API access
- 200+ custom Apex classes — technical debt assessment required before adding new customization; some functionality may need to be refactored
- Customer portal must support IE11 (some enterprise customers have locked-down browsers) AND modern browsers — this is a constraint on LWR (LWR does not support IE11)
- CPQ catalog of 2,000 products + complex multi-year pricing — CPQ product model design is architecture-critical
- Territory Management during active sales cycle — must minimize disruption to in-flight Opportunities

**Sample Solution Architecture:**

*CPQ Architecture:*
- Revenue Cloud CPQ: 2,000 products organized into Product Families (Connectivity, Managed Services, UCaaS), Product Lines within each family
- Multi-year term pricing: Price Books × Term (12-month, 24-month, 36-month) — separate price books for each term, with discounted rates for longer terms
- Volume discount: CPQ Discount Schedules — tiered discount by quantity within the quote
- Customer-specific discounts: Customer-specific Price Book or Contract Pricing records
- Document generation: Salesforce CPQ Document Templates → PDF output (MSA, SOW sections generated from template fields)
- Approval workflow: >15% discount → CPQ Approval Process → manager → VP if >25%

*Health Score:*
- Custom HealthScore__c object on Account
- Data sources feeding health score (batch calculation nightly):
  * BSS renewal date proximity → date score (days to renewal)
  * ServiceNow ticket volume/resolution → ticket health score
  * BSS product utilization → utilization score
  * NPS survey score (Salesforce native survey or Survey Monkey integration) → satisfaction score
- Weighted composite score → triggers alert if <40
- Health score trend (7-day, 30-day rolling average) → visible in Account record

*Portal:*
- Experience Cloud: cannot use LWR due to IE11 constraint → must use Aura-based community OR recommend discussing IE11 constraint with customer (Aura is sunset-track)
- Realistic recommendation: "I'd recommend engaging the customer to agree on browser modernization — IE11 is end-of-life. If truly immovable, Aura Community with limited functionality. The technical trade-off of maintaining IE11 support is significant and the customer should understand the cost."
- Functionality: invoice/payment (BSS integration), ticket management (ServiceNow integration), order status (BSS), bandwidth dashboards (BSS API visualized in LWC)

*BSS Integration (Amdocs):*
- MuleSoft: on-premise Amdocs behind VPN → MuleSoft on-premise runtime in DMZ → cloud MuleSoft control plane → Salesforce
- Patterns: CPQ price lookup (sync, <2 sec), order write-back (async Platform Event → MuleSoft → Amdocs → confirmation PE back), customer sync (nightly bulk)

**Key Trade-offs:**
1. **LWR vs Aura for IE11:** LWR is the future, IE11 is dead. Architect should recommend browser modernization rather than accepting IE11 as a technical constraint that limits architecture choices.
2. **Territory Management disruption:** Territory Management in mid-sales-cycle requires Opportunity re-assignment plan. Phase: implement TM first with current territory structure, then realign in Phase 2 after current quarter closes.
3. **Technical debt (200 Apex classes):** Don't ignore — refactor 10-20 most problematic classes as part of CPQ implementation, since CPQ will trigger many of the same processes.

**Panel Q&A:**
- *"Your health score depends on ServiceNow data. ServiceNow is not integrated with Salesforce — walk me through that integration."* → ServiceNow provides a REST API. I'd implement a nightly MuleSoft batch job: query ServiceNow tickets by account (linked via Account external ID), aggregate ticket volume and MTTR for the trailing 30 days, update HealthScore__c fields via Bulk API upsert on Account.
- *"IE11 constraint — you said you'd recommend browser modernization. But the customer said it's a hard constraint. What's your architecture if you can't get them to change?"* → If truly immovable: Aura Experience Cloud Community (not LWR). This means the portal won't benefit from LWR's performance and accessibility improvements, and Aura is a sunset-track technology. I'd build the portal with a clear architecture note that IE11 deprecation triggers a portal rebuild — design it modularly to minimize that rework.

---

### Practice Scenario E: Logistics & Supply Chain — Last-Mile Delivery Operations

**Business Background:**
QuickDeliver — a last-mile delivery logistics company, $1.2B revenue, operating in 30 US metros with 8,000 delivery drivers (gig economy + employed), 500 corporate accounts (retailers, e-commerce companies), and a network of 200 distribution centers. The company routes 250,000 deliveries daily, with real-time GPS tracking and customer delivery notifications critical to the business model.

Currently running a home-built operations platform that handles routing, driver management, and customer notifications — but no CRM, no field service management, and customer account management done in spreadsheets.

**Current State:**
- Home-built operations platform (Node.js/MongoDB): routing algorithms, driver app, real-time GPS, delivery status API — cannot be replaced; this is core IP
- No Salesforce footprint — greenfield implementation
- 500 corporate accounts managed in spreadsheets by 50 account managers
- Customer notifications (email, SMS): currently done by operations platform — not personalized, no marketing use
- Driver management: onboarding, pay, compliance (vehicle inspections, background checks) managed in HR system (Workday)
- Data volume: 250,000 deliveries/day = 90M deliveries/year in history (4 years = 360M delivery records)

**Requirements:**
1. **Account Management (Sales Cloud):** 50 account managers manage 500 corporate accounts — standard CRM: contacts, opportunities (new contract expansions), cases for SLA disputes, delivery performance reporting per account.
2. **Delivery SLA Monitoring:** Service Cloud cases automatically created when SLA breach detected (delivery >2 hours late, package damaged, missed delivery). SLA thresholds configured per customer account. Real-time SLA monitoring dashboard for operations team.
3. **Driver Field Service:** Implement Salesforce Field Service for scheduling and managing the 8,000 drivers. Work orders for each delivery route. Mobile app for drivers (currently using company-built app — evaluate replacing or integrating FSL mobile with existing app).
4. **Customer Notification Campaigns (Marketing Cloud):** Corporate account contacts receive quarterly business reviews, SLA performance summaries, and expansion opportunity campaigns. Not consumer-facing — this is B2B relationship marketing.
5. **Operations Analytics (CRM Analytics):** 360M historical delivery records → analytics for corporate accounts (their delivery performance), operations management (driver performance, SLA breach patterns, route efficiency by metro).

**Constraints:**
- Operations platform cannot be replaced — routing algorithms are proprietary IP
- 360M delivery records cannot all be loaded into Salesforce — cost and volume prohibitive
- 8,000 drivers: many are gig workers, not employees — Field Service Contractor license vs FSL standard license
- Driver mobile app: company has invested significantly in existing app — FSL mobile must integrate with or replace carefully
- Real-time GPS tracking: extremely high-frequency data (GPS ping every 30 seconds per driver × 8,000 drivers = 16,000 events/minute at peak) — cannot use Salesforce Platform Events at this volume

**Sample Solution Architecture:**

*Data Architecture:*
- Salesforce stores: Account, Contact, Opportunity, Case, Work Order — operational data for CRM and case management
- 360M delivery records: do NOT load into Salesforce. Store in cloud data warehouse (Snowflake, Databricks). CRM Analytics connects directly to Snowflake via Data Cloud or direct connector.
- Daily summary aggregation: operations platform generates daily delivery summary per account (total deliveries, SLA breach count, damage rate) → small summary record in Salesforce for account view → keeps Salesforce clean
- Real-time SLA breach detection: operations platform detects SLA breach → webhook call to Salesforce Platform Events (case creation event) → Flow creates Case with SLA breach details

*Field Service:*
- FSL with 8,000 drivers: contractor worker record type (gig workers get Contractor license, employed drivers get FSL license)
- Driver app: recommend evaluating FSL mobile capabilities vs existing app. If existing app provides routing value FSL can't replicate → Integration pattern: existing app for routing/navigation, FSL mobile for check-in/status updates via FSL Connected App API
- Work Orders: one work order per route (not per delivery — that's 250K/day which is too many for FSL)

*Real-time GPS:*
- 16,000 GPS events/minute: cannot use Platform Events (limit: 2,000 events/hour per type)
- Pattern: GPS data stays in operations platform, NOT Salesforce. Real-time driver location displayed in FSL dispatcher map via operations platform API (External Service callout in dispatcher view, not stored in SF)

*Integration:*
- Operations platform → Salesforce: SLA breach webhook (Platform Event), daily delivery summary (Bulk API), driver status updates (real-time for active routes via External Service)
- Salesforce → Workday: driver onboarding worker data sync (bidirectional, daily)

**Key Trade-offs:**
1. **360M records in Salesforce vs external data warehouse:** Salesforce is not the right system for this volume of operational transaction data. CRM Analytics with external data source connection provides the analytics requirement without loading records into Salesforce.
2. **Platform Events for GPS vs external handling:** Platform Event volume limits make this impossible for GPS. GPS tracking must remain in the operations platform — Salesforce only needs the SLA breach events.
3. **FSL mobile vs existing app:** don't replace company IP (routing algorithm) — integrate FSL dispatch with existing driver app via API.

**Panel Q&A:**
- *"You said 360M delivery records can't go in Salesforce. But your corporate account view needs delivery performance data. Where does that data come from in real-time when an account manager opens an Account record?"* → Two data sources: (1) The daily summary record (pre-aggregated) loaded by Batch API provides the 30-day rolling summary without real-time lookup. (2) For drill-down, a custom LWC component on the Account record page makes an on-demand callout to the operations platform API to retrieve detailed delivery records for that account — results are displayed but not stored in Salesforce. This is a display callout, not a data migration.
- *"Platform Events limit at 16,000 GPS pings per minute. What if I told you the SLA breach detection also needs to be real-time? How does the operations platform notify Salesforce?"* → The SLA breach notification (one event per breach, not per GPS ping) is well within Platform Event limits. A 2% SLA breach rate on 250,000 daily deliveries = 5,000 breach events/day = ~3.5/minute average. Even at peak, this is manageable. Platform Events are appropriate for SLA breach notification precisely because the volume is orders of magnitude lower than GPS pings.
