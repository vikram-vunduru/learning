# Hands-On Labs, Superbadges & Architect Resources

> **Last Updated:** August 2026  
> The complete lab reference for the 12-Month Technical Architect Sprint

---

## 1. All Superbadges by Category

Access all superbadges at: `trailhead.salesforce.com/superbadges`

### Admin & Business Operations

| Superbadge | What It Tests | Est. Time |
|-----------|--------------|-----------|
| **Business Administration Specialist** | End-to-end admin: security, automation, data model, reporting | ~10 hrs |
| **Process Automation Specialist** | All Flow types: screen, record-triggered, scheduled, subflows | ~10 hrs |
| **Reports & Dashboards Specialist** | All report types, dashboard design, scheduled reports | ~6 hrs |
| **Service Cloud Specialist** | Case management, entitlements, knowledge, Omni-Channel routing | ~8 hrs |
| **Sales Cloud Specialist** | Opportunity management, forecasting, territory management | ~8 hrs |
| **Security Specialist** | Profiles, permission sets, OWD, field-level security, Shield | ~8 hrs |
| **User Engagement Specialist** | In-app guidance, prompts, walkthroughs | ~4 hrs |
| **Data Management and Analytics Strategy Specialist** | Deduplication, governance, CRM Analytics | ~6 hrs |

### Developer

| Superbadge | What It Tests | Est. Time |
|-----------|--------------|-----------|
| **Apex Specialist** | Triggers, classes, test coverage, async Apex, governor limits | ~7 hrs |
| **Lightning Web Components Specialist** | LWC architecture, wire service, events, data binding | ~6 hrs |
| **App Customization Specialist** | Custom objects, Aura, Visualforce, remote actions | ~12 hrs |
| **Developer Superset** | Combines Apex + LWC + App Customization | ~25 hrs |
| **Platform Developer II Superbadge** | Design patterns, custom metadata, platform events | ~10 hrs |

### Data & Integration

| Superbadge | What It Tests | Est. Time |
|-----------|--------------|-----------|
| **Data Integration Specialist** | Apex callouts, external objects, REST/SOAP, named credentials | ~8 hrs |
| **Salesforce Connect Specialist** | External data via OData adapters, virtual/external objects | ~6 hrs |
| **Data Management Specialist** | Import/export tools, deduplication, data quality | ~6 hrs |

### AI & Analytics

| Superbadge | What It Tests | Est. Time |
|-----------|--------------|-----------|
| **Agentforce Specialist** | Building and deploying AI agents — topics, actions, testing | ~8 hrs |
| **Prompt Builder Superbadge Unit** | Prompt templates, grounding with Flow/Apex | ~3 hrs |
| **AI Associate SBU** | AI terminology, ethical AI, Salesforce AI capabilities | ~2 hrs |
| **Einstein Prediction Builder Specialist** | Custom predictions from CRM data, model scoring | ~5 hrs |
| **CRM Analytics and Einstein Discovery Specialist** | Datasets, SAQL dashboards, Discovery models | ~10 hrs |

### Platform Architecture

| Superbadge | What It Tests | Est. Time |
|-----------|--------------|-----------|
| **Sharing and Visibility Designer** | Complex sharing rules, territory hierarchies, Apex sharing | ~8 hrs |
| **Lightning Experience Specialist** | Lightning App Builder, dynamic forms, App Manager | ~6 hrs |

---

## 2. Real-World Architect Lab Scenarios

### A. Data Architecture Labs

**Lab DA-1: LDV Performance Rescue**
- Setup: Create a custom `Transaction__c` object with 500k records (use Data Loader bulk insert)
- Challenge: Build reports that time out due to no indexes
- Solution to implement: Add custom index via Case, build skinny table simulation, compare report run times
- Exam relevance: Data Architect (LDV topic 17%)

**Lab DA-2: MDM Design and Deduplication**
- Setup: Import 1,000 accounts with intentional duplicates (same company, different formats)
- Challenge: Surface and merge duplicates
- Solution: Configure matching rule (fuzzy company name + website), duplicate rule (Alert + Block), run deduplication report
- Exam relevance: Data Architect (MDM topic 18%)

**Lab DA-3: Data Migration Sequencing**
- Setup: Export Accounts + related Contacts + Opportunities from a source org via Data Loader
- Challenge: Re-import to a clean org maintaining all relationships
- Solution: Import Accounts first (capture new IDs), use external ID to re-link Contacts, then Opportunities
- Exam relevance: Data Architect (Migration topic 12%)

---

### B. Integration Architecture Labs

**Lab IA-1: REST API Integration**
- Setup: Use Postman or Node.js to authenticate to Salesforce REST API via OAuth 2.0 (JWT Bearer flow)
- Challenge: Query 10,000 accounts and upsert back with an updated field
- Solution: Use Bulk API 2.0 for the upsert; implement retry logic on 503 errors
- Exam relevance: Integration Architect (Design 24%, Implement 16%)

**Lab IA-2: Platform Events Publisher/Subscriber**
- Setup: Create a custom Platform Event `OrderEvent__e`
- Challenge: Publish events from an external Node.js app; subscribe and process in Salesforce via Trigger
- Solution: Use Pub/Sub API (gRPC) for external publisher; Apex trigger subscriber with idempotency check via Replay ID
- Exam relevance: Integration Architect (Translate Needs 27%)

**Lab IA-3: Change Data Capture**
- Setup: Enable CDC on Opportunity object
- Challenge: Build external subscriber (Node.js + jsforce library) that updates a Redis cache when opportunities change
- Solution: Subscribe to `/data/OpportunityChangeEvent`, handle gap replay, implement at-least-once delivery
- Exam relevance: Integration Architect (Design 24%)

---

### C. Security & Sharing Labs

**Lab SS-1: Complex Sharing Model**
- Setup: Create Account OWD = Private, 4-level role hierarchy, 2 sales territories
- Challenge: Rep sees their accounts + territory team accounts; manager sees direct reports' accounts; no cross-territory visibility
- Solution: Role hierarchy (manager inheritance) + territory-based sharing rules + test as each user persona
- Exam relevance: Sharing & Visibility Architect (Sharing Architecture 26%)

**Lab SS-2: Apex Managed Sharing**
- Setup: Custom `Project__c` object; `ProjectMember__c` junction linking Users to Projects
- Challenge: Share each Project with all its members — declarative sharing cannot handle dynamic membership
- Solution: Build `ProjectShare` insert logic in Apex trigger; add `rowCause` field; handle record transfer
- Exam relevance: Sharing & Visibility Architect (Programmatic Sharing 20%)

**Lab SS-3: Shield Encryption Planning**
- Setup: Identify 5 fields that need encryption (SSN, credit card, DOB, bank account, medical notes)
- Challenge: Determine deterministic vs. probabilistic for each; document what breaks (search, workflows, formula references)
- Solution: Decision matrix — deterministic for searchable fields, probabilistic for high-sensitivity non-searchable; create field encryption plan
- Exam relevance: Sharing & Visibility Architect (Platform Encryption 19%)

---

### D. Data Cloud + AI Labs

**Lab AI-1: Full Data Cloud Implementation**
- Setup: Use Coral Cloud sample app (github.com/trailheadapps/coral-cloud) deployed to scratch org
- Challenge: Configure data ingestion from the sample Salesforce org data, run identity resolution, build a segment
- Solution: Follow the Coral Cloud documentation end-to-end; extend with a custom Calculated Insight
- Exam relevance: Data Cloud Consultant (all topics)

**Lab AI-2: Agentforce Service Agent**
- Setup: Developer org with Data Cloud trial features
- Challenge: Build a Service Agent that can check order status, create a case, and escalate to human
- Solution: Configure 3 topics with Flows as actions; ground with unified customer profile; set up Testing Center validation
- Exam relevance: Agentforce Specialist (Agent Builder 23%)

**Lab AI-3: Prompt Builder Mastery**
- Setup: Any developer org
- Challenge: Build all 4 template types (Field Generation, Flex, Record Summary, Sales Email)
- Solution: Create each template, test with sample records, link Flex template to an Agentforce Action
- Exam relevance: Agentforce Specialist (Prompt Builder 37%)

---

### E. CTA Board Prep Architect Scenarios

These are whiteboard-level scenarios to practice presenting to a mock panel.

**CTA Scenario 1 — Multi-Cloud Enterprise (45 min practice)**  
Fortune 500: Sales Cloud + Service Cloud + Experience Cloud + Data Cloud + MuleSoft. 50k employees, 5M customers, GDPR across EU/US. Data residency requirements.  
*Present:* Architecture diagram, integration topology, data governance model, identity federation, sharing model, deployment strategy.

**CTA Scenario 2 — Org Consolidation Decision (45 min practice)**  
Company acquiring 3 businesses, each with Salesforce orgs. Consolidate to one org vs. retain multi-org?  
*Present:* Decision framework, data architecture impact, integration approach, identity federation, migration phasing, user adoption risks.

**CTA Scenario 3 — Scale Architecture (45 min practice)**  
Current: 500k records, 200 users. 3-year projection: 10M records, 5,000 users.  
*Present:* Current architectural risks, LDV mitigation strategy, sharing model redesign, Apex optimization, infrastructure scaling.

**CTA Scenario 4 — Agentforce Enterprise Deployment (45 min practice)**  
Healthcare payer: Replace contact center with Agentforce across 3M patients. HIPAA required.  
*Present:* Agent architecture, BYOM selection (HIPAA-compliant LLM), Trust Layer config, Data Cloud grounding, fallback/escalation, compliance audit trail, phased rollout.

**CTA Scenario 5 — Legacy Modernization (45 min practice)**  
20-year-old on-premise CRM → Salesforce. 50M records, 2k integrations, 18-month timeline.  
*Present:* Phased migration approach, coexistence architecture, integration freeze/cutover strategy, data quality remediation, org structure decision.

---

## 3. Practice Environment Setup

### Free Developer Org (Primary Lab Environment)

```
1. Sign up at: developer.salesforce.com/signup
2. Use any email; create a unique username (e.g., yourname.dev@practice.io)
3. Confirm email, log in at login.salesforce.com
4. Enable Dev Hub: Setup → Dev Hub → Enable
5. Install Salesforce Inspector browser extension for field inspection
```

### Trailhead Playground (For Superbadges)

```
1. Log in at trailhead.salesforce.com
2. Click avatar → Hands-On Orgs → Create Playground
3. Get credentials: Playground tab → Get Your Login Credentials
```

### Salesforce CLI + Scratch Org Setup

```bash
# Install
npm install -g @salesforce/cli

# Authenticate to Dev Hub
sf org login web --set-default-dev-hub --alias DevHub

# Create scratch org with Data Cloud enabled
sf org create scratch \
  --definition-file config/project-scratch-def.json \
  --alias ScratchOrg \
  --duration-days 30

# Open the org
sf org open --target-org ScratchOrg

# Clone and deploy a sample app
git clone https://github.com/trailheadapps/coral-cloud
cd coral-cloud
sf project deploy start --target-org ScratchOrg
```

### Recommended Browser Extensions

| Tool | Purpose |
|------|---------|
| Salesforce Inspector Reloaded | Inspect any record's fields, metadata, and API names instantly |
| Salesforce DevTools | Console for quick SOQL, metadata access |
| Workbench (web) | `workbench.developerforce.com` — REST explorer, SOQL, metadata API |

---

## 4. Key Video Resources

### YouTube Channels

| Channel | URL | Best For |
|---------|-----|---------|
| Salesforce Developers | `youtube.com/@SalesforceDevelopers` | Apex, LWC, Data Cloud, Agentforce, weekly codeLive |
| Salesforce Architects | `youtube.com/@SalesforceArchitects` | Well-Architected Framework, Office Hours, "Think Like an Architect" |
| Salesforce Admins | `youtube.com/@SalesforceAdmins` | Flow, automation, admin certs |
| Salesforce Training | `youtube.com/@SalesforceTraining` | Cert prep all roles |
| SalesforceBen | `youtube.com/@SalesforceBen` | Cert breakdowns, feature walkthroughs |
| FlowRepublic | `youtube.com/@FlowRepublic` | CTA mock scenarios, coaching |

### Salesforce+ Series to Watch

| Series | What to Search |
|--------|---------------|
| Dreamforce 2024/2025 AI+Data sessions | "Agentforce Dreamforce Keynote" |
| Agentforce Technical Deep Dives | "Agentforce Architecture Salesforce+" |
| Data Cloud Architecture | "Data Cloud Architecture Dreamforce" |
| Trust Layer Explainer | "Einstein Trust Layer Salesforce" |
| codeLive weekly developer show | "codeLive Salesforce" |
| Architect Office Hours | "Architect Office Hours Salesforce" |

Access Salesforce+: `salesforce.com/plus` (free account required)

---

## 5. Key GitHub Repositories

### Trailheadapps Org (github.com/trailheadapps)

| Repo | Best For |
|------|---------|
| **coral-cloud** | Complete Agentforce + Data Cloud reference app |
| **apex-recipes** | Apex patterns cookbook (triggers, async, integration, LWC) |
| **lwc-recipes** | 50+ LWC patterns with Jest tests |
| **agent-script-recipes** | 20+ practical Agentforce agent examples |
| **dreamhouse-lwc** | Full real-estate LWC app with architecture patterns |
| **ebikes-lwc** | E-commerce LWC + Experience Cloud reference |
| **streaming-monitor** | Platform Events + CDC demo app |

### Clone All Core Repos

```bash
git clone https://github.com/trailheadapps/apex-recipes
git clone https://github.com/trailheadapps/lwc-recipes
git clone https://github.com/trailheadapps/coral-cloud
git clone https://github.com/trailheadapps/agent-script-recipes
git clone https://github.com/trailheadapps/dreamhouse-lwc
```

---

## 6. Salesforce Architect Resources

### Architect Site: architect.salesforce.com

| Section | URL | What's There |
|---------|-----|-------------|
| Well-Architected Framework | `/well-architected` | 3 pillars: Trusted, Easy, Adaptable — with sub-principles |
| Decision Guides | `/decision-guides` | 8 trade-off guides with matrices |
| Architecture Patterns | `/design` | Integration, data, agentic, deployment patterns |
| Reference Diagrams | `/design` | Downloadable architecture diagrams |
| Events | `/events` | Office Hours, workshops, AMAs |

### 8 Decision Guides (Memorize These for CTA)

| Guide | What It Decides |
|-------|----------------|
| Agentic vs. Traditional Workflow | When to use Agentforce agents vs. deterministic automation |
| Data 360 Provisioning | Foundational Data Cloud setup decisions |
| Data 360 Interoperability | Integration strategy trade-offs (latency, cost, governance) |
| Data Integration | Tool selection: ETL vs. CDC vs. real-time vs. batch |
| Event-Driven Architecture | Platform Events vs. CDC vs. Pub/Sub API vs. MuleSoft |
| Record-Triggered Automation | Flow vs. Apex for performance and maintainability |
| Asynchronous Processing | Batch vs. Queueable vs. Future vs. Scheduled Apex |
| Building Forms | Declarative (Flow) vs. code-based (LWC) form tools |

### Well-Architected Framework (CTA Core)

```
Trusted
  ├── Secure     (org security, API security, field access)
  ├── Compliant  (data residency, GDPR, consent)
  └── Reliable   (availability, scalability, governor limits)

Easy
  ├── Intentional  (maintainability, documented decisions)
  ├── Automated    (automation efficiency, CI/CD)
  └── Engaging     (user experience, adoption)

Adaptable
  ├── Resilient    (ALM, incident response, disaster recovery)
  └── Composable   (separation of concerns, APIs, interoperability)
```

---

## 7. CTA Board Prep Resources

| Resource | Details |
|----------|---------|
| **CTA-601 Workshop (Virtual)** | Instructor-led mock board — essential; register at `trailheadacademy.salesforce.com` |
| **FlowRepublic CTA Program** | `flowrepublic.com/courses` — 12-week structured coaching with mock boards |
| **30 Days 30 Questions** | `flowrepublic.com/30-questions-in-30-days` — daily scenario questions with video answers |
| **Architect Trailblazer Community** | Practice scenarios, solution recordings, peer review |
| **Architect Office Hours (YouTube)** | Real scenario Q&A with practicing Salesforce architects |
| **SalesforceBen CTA Guide** | `salesforceben.com` — board format, domain breakdown, study strategy |

### CTA Board Domains

1. Integration Architecture
2. Data Architecture & Management
3. Security Architecture
4. Application Architecture
5. Development Lifecycle & Deployment
6. AI / Agentforce *(increasingly weighted from 2024+)*
7. Well-Architected Principles

### CTA Prep Strategy

```
Phase 1: Prerequisites (Months 1–11 of this plan)
  Complete all 8 component certifications

Phase 2: Architecture Deep Study (Month 12)
  - Master all 8 Decision Guides (articulate trade-offs verbally, not just from memory)
  - Study Well-Architected Framework in depth
  - Complete Agentforce + Data Cloud architecture patterns
  - Join Architect Trailblazer Community study group

Phase 3: Board Presentation Practice (Month 12 onward)
  - Register for CTA-601 workshop
  - Complete FlowRepublic 30 Days 30 Questions
  - Run 5+ timed mock presentations (2-hour format)
  - Record yourself; review for clarity and confidence
  - Practice drawing architecture diagrams by hand in under 10 minutes

Phase 4: Final Prep (4–6 weeks before board)
  - Review exam guide domains — close any gaps
  - Rehearse trade-off language from Decision Guides verbatim
  - Simulate 30-minute reading + 2-hour presentation under pressure
```

---

## Start-Here Checklist (Priority Order)

- [ ] Set up free Developer Edition org at `developer.salesforce.com/signup`
- [ ] Install Salesforce CLI: `npm install -g @salesforce/cli`
- [ ] Clone Coral Cloud app: `github.com/trailheadapps/coral-cloud`
- [ ] Clone apex-recipes: `github.com/trailheadapps/apex-recipes`
- [ ] Complete "Get Started with Data Cloud" Trailhead trail
- [ ] Work through Agentblazer Champion level
- [ ] Complete Apex Specialist Superbadge
- [ ] Complete Process Automation Specialist Superbadge
- [ ] Read all 8 Decision Guides at `architect.salesforce.com/decision-guides`
- [ ] Study Well-Architected Framework at `architect.salesforce.com/well-architected`
- [ ] Subscribe to Salesforce Architects + Salesforce Developers YouTube channels
- [ ] Join Architect Trailblazer Community group
- [ ] Book CTA-601 virtual workshop (register early — limited slots)
