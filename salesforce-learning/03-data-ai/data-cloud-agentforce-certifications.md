# Salesforce Data Cloud, Agentforce & Einstein AI Certifications

> **Last Updated:** August 2026  
> **Path Position:** Months 5–7 in the 12-Month Technical Architect Sprint  
> **Certifications:** Data Cloud Consultant · Agentforce Specialist · Advanced Administrator

---

## Quick Reference

| Cert | Questions | Time | Pass Score | Cost | Prerequisite |
|------|-----------|------|-----------|------|--------------|
| Data Cloud Consultant | 60 | 105 min | 67% | $200 | None (Admin recommended) |
| Agentforce Specialist | 60 | 105 min | 65% | $200 | None (Admin recommended) |
| Advanced Administrator | 60 | 105 min | 65% | $200 | **Admin cert required** |

**Recommended order:** Data Cloud Consultant → Agentforce Specialist → Advanced Administrator (AI section is then review)

---

## Product Overview

### Data 360 (formerly Data Cloud)

Real-time data engine that consolidates enterprise data into unified customer profiles using **Zero-Copy architecture** — no ETL, no data duplication.

| Pillar | What It Does |
|--------|-------------|
| **Connect** | 200+ connectors; Zero-Copy to Snowflake/Databricks/GCS/AWS |
| **Harmonize** | Identity Resolution, Data Prep, Unified Data Model mapping |
| **Govern** | Policy-based governance, consent enforcement, AI auto-tagging |
| **Activate** | Audience segmentation, Triggered Flows, Calculated Insights |
| **Share** | Push to Snowflake, BigQuery; activate to Google Ads, Meta |

**Key architectural concepts:**
- **Zero-Copy Integration:** Live access to data lakes without moving data
- **Identity Resolution:** Merges customer identities from multiple systems into one Unified Individual profile
- **Calculated Insights:** SQL-based metrics (LTV, churn risk, engagement scores) on unified profiles
- **Triggered Flows:** Real-time automation fired by streaming data events

### Agentforce

Autonomous AI agent platform. Agents reason, plan, and act 24/7 — escalating to humans only when needed.

**Core architecture:**
- **Atlas Reasoning Engine** — decomposes prompts into tasks, selects actions, synthesizes results
- **Trust Layer** — data masking, toxicity scoring, zero-retention (data never trains external LLMs), audit logging
- **Topics/Subagents** — domains of expertise (e.g., "Handle order status"); each contains instructions and actions
- **Agent Actions** — Apex invocable methods, Flows, MuleSoft API calls, Prompt Templates, SOQL

**Pre-built agent types:** Service Agent, SDR Agent, Sales Coach, Campaign Optimizer, Employee Agent

**Developer tools:** Agent Builder, Agent Script, Agentforce DX, Headless 360, Models API, Agent API

### Prompt Builder

Low-code workspace for creating LLM prompt templates grounded in live CRM and Data Cloud data.

| Template Type | Use Case |
|--------------|---------|
| Field Generation | Auto-populate a CRM field using AI |
| Flex Template | General-purpose; used by Flows, Apex, Agent Actions |
| Record Summary | AI-generated summaries of any Salesforce record |
| Sales Email | Personalized outreach grounded in opportunity/contact data |

---

## 1. Salesforce Certified Data Cloud Consultant

### Exam Topics

| Topic | Weight |
|-------|--------|
| Data Ingestion and Modeling | **21%** |
| Solution Overview and Value Proposition | 17% |
| Segmentation and Insights | 17% |
| Agentforce + AI Integration | 13% |
| Identity Resolution | 13% |
| Administration and Governance | 10% |
| Activation | 9% |

### Key Concepts Per Topic

**Data Ingestion & Modeling (21%):**
- Connector types: Salesforce bundles, S3/GCS, partner connectors, real-time Streaming API
- Data Streams: full vs. incremental refresh
- Data Model Objects (DMOs) vs. Data Lake Objects (DLOs)
- Mapping to the Unified Data Model; standard DMOs (Individual, Contact Point, Engagement)

**Identity Resolution (13%):**
- Matching Rules: Exact match (email, phone) vs. Fuzzy match (name, address)
- Reconciliation Rules: Most Recent, Most Frequent, Source Priority
- Unified Individual composite profile construction and refresh timing

**Segmentation & Insights (17%):**
- Segment Builder: direct and related attributes
- Calculated Insights: ANSI SQL metrics on unified profiles
- Segment refresh types: batch, fast, full
- Einstein predictive attributes in segments

**Agentforce + AI Integration (13%):**
- Configuring Data 360 as grounding source for AI agents
- Unified Profile and Calculated Insights as agent context
- RAG (Retrieval-Augmented Generation) fundamentals

### Official Trailhead Path

**Data 360 Trailhead Journey** (~28 hrs 15 min total)  
`trailhead.salesforce.com/content/learn/trailhead-journey/data-360`

| Trail | Level | Duration |
|-------|-------|----------|
| Unlock the Value of Your Data | Intermediate | ~4 hrs 25 min |
| Explore Setup to Activation | Advanced | ~13 hrs 45 min |
| Develop and Build Solutions | Advanced | ~10 hrs 5 min |

**Quick Start Trailmix:**  
`trailhead.salesforce.com/users/dataclouddocs/trailmixes/data-cloud-quick-start-guide`

### Hands-On Labs

1. **Data Ingestion Lab** — Configure a data stream from S3 connector, map fields to a custom DMO, set incremental refresh schedule

2. **Identity Resolution Lab** — Configure email exact + name/address fuzzy matching rules; set Source Priority reconciliation; inspect resulting Unified Individual records and merge history

3. **Segment Builder Lab** — Build a dynamic "High LTV + Email Consent" segment using both direct attributes and related object traversal (purchase history → frequency score)

4. **Calculated Insights Lab** — Write SQL to calculate 30-day purchase frequency; publish it to Unified Individual profiles; reference it inside a Segment

5. **Activation Lab** — Activate a segment to Marketing Cloud Engagement (email) and Meta Ads (advertising) as separate activation targets with separate consent attribute filters

6. **Data 360 → Agentforce Grounding Lab** — Configure a unified profile attribute as grounding context for an Agent Action; verify the agent uses real-time profile data in its response

7. **Triggered Flow Lab** — Create a real-time Triggered Flow that fires when a streaming event (e.g., cart abandon) matches a condition; auto-creates a Service Cloud case

### Real-World Architect Scenarios

**Scenario 1 — Unified Service Experience**  
Telco with customer data siloed across SAP, Salesforce, Snowflake (network ops), and mobile app (streaming). Service agents check 4 systems per call.  
*Solution:* Ingest all sources into Data 360, configure Identity Resolution (email/phone exact match), build Calculated Insights ("Recent Outages Near Customer"), ground Service Agent on unified profiles.

**Scenario 2 — Consent-Governed Marketing Activation**  
Global retailer, 30 countries, varying GDPR consent. Need personalized email + paid social activation.  
*Solution:* Ingest consent data as a Data Stream, enforce Data Usage Policies per purpose, build "High LTV + Consent to Email" segment, configure separate activation targets with consent filters per channel.

**Scenario 3 — Zero-Copy Analytics**  
Enterprise with 10TB of transaction history in Snowflake. Business wants Salesforce segments without moving data.  
*Solution:* Configure Zero-Copy integration via Snowflake connector, create DMO mapping for transaction events, build propensity segments directly on Snowflake data from within Data 360.

### Estimated Study Time: ~54 hours

---

## 2. Salesforce Certified Agentforce Specialist

### Exam Topics

| Topic | Weight |
|-------|--------|
| **Prompt Builder** | **37%** |
| Agentforce (Agent Builder, Topics, Actions) | 23% |
| Model Builder | 23% |
| Einstein Generative AI Features | 17% |

**Prompt Builder is 37% of the exam — make it your primary focus.**

### Key Concepts Per Topic

**Prompt Builder (37%):**
- All 4 template types: Field Generation, Flex, Record Summary, Sales Email
- Building, testing, versioning, and activating templates in Setup
- Merge field syntax, dynamic data injection from CRM + Data Cloud
- Grounding strategies: record context, related objects, calculated insights
- Linking Prompt Templates to Agent Actions
- Trust Layer: masking applied before LLM, zero-retention policy
- Troubleshooting: token limits, grounding failures, unexpected outputs

**Agentforce — Agent Builder, Topics, Actions (23%):**
- Agent configuration: System Prompt, channel assignment
- Topics (Subagents): defining scope, instructions, guardrails
- Action types: Flow, Apex invocable, Prompt Template, MuleSoft
- Human escalation setup
- Testing via Agentforce Testing Center

**Model Builder (23%):**
- Einstein Studio: connect third-party LLMs (OpenAI, Anthropic, Google, Azure OpenAI)
- BYOM (Bring Your Own Model) configuration
- Model selection trade-offs: latency, cost, capability, compliance
- Activating custom models for Prompt Builder and Agent Actions

### Official Trailhead Path — Agentblazer Program

`trailhead.salesforce.com/agentblazer`

| Level | Goal | Key 2026 Content | Hands-On |
|-------|------|-----------------|---------|
| **Champion** | AI literacy + basics | Employee Agents module | Agentforce Quick Start build |
| **Innovator** | Build measurable solutions | Threat Modeling for AI Agents; Agentforce Voice Quick Look | Superbadges, scenario challenges |
| **Legend** | Advanced + exam-ready | Data 360-Powered Agentforce; RAG Best Practices | DX, Agent API, Testing Center, CI/CD |

### Hands-On Labs

1. **Prompt Builder Basics Lab** — Create a Record Summary template for Cases; ground it with Subject, Description, last 5 comments, and an Einstein Case Classification score; activate and test

2. **Flex Template for Agent Actions** — Build a Flex prompt template that accepts parameters from an Agent Action; link it to a topic; test that the agent uses the template when triggered

3. **Service Agent Build** — Configure from scratch: system prompt, 3 topics (case resolution, order status, FAQ), Flow-based actions, escalation to human queue, deploy to messaging channel

4. **SDR Agent Lab** — Build qualification agent with topics: Initial Qualification, Objection Handling, Meeting Scheduling; ground with lead/company data; configure meeting booking Flow action

5. **BYOM Lab** — Connect Azure OpenAI or Anthropic Claude in Model Builder; assign it as the default model for a specific Prompt Template; verify output routes through the custom model

6. **Agentforce Testing Center** — Simulate 20 agent conversations across all topics; analyze topic routing accuracy; iterate on System Prompt and topic instructions to improve classification

7. **RAG Grounding Lab** — Connect Data Cloud attribute (unified profile + calculated insight) to a Prompt Template; verify agent response includes real-time customer profile data

8. **Agentforce DX Lab** — Deploy agent configuration via Salesforce CLI (no Agent Builder UI); push agent metadata to scratch org; verify deployment

### Real-World Architect Scenarios

**Scenario 1 — AI Lead Qualification**  
B2B SaaS: 5,000 inbound leads/month, 60% of rep time on unqualified calls.  
*Solution:* Agentforce SDR Agent with qualification/objection/booking topics, Prompt Builder grounded in Data Cloud lead engagement scores, OpenAI GPT-4o via BYOM, Flow action to create qualified opportunity.

**Scenario 2 — Case Summarization at Scale**  
Financial firm: 2,000 cases/day, supervisors spend 45 min/day reading case histories.  
*Solution:* Record Summary Prompt Template for Case object, grounded on case history + account-level calculated insights from Data Cloud, surfaced via LWC on record page. Same template as Agent Action for messaging channel.

**Scenario 3 — BYOM for Regulated Industry**  
Healthcare company: must use only HIPAA-compliant, BAA-covered LLMs.  
*Solution:* BYOM via Azure OpenAI with BAA; Trust Layer masking for PHI fields (name, DOB, diagnosis); Agentforce Observability audit logs confirming all calls route to Azure endpoint.

### Estimated Study Time: ~55–60 hours

---

## 3. Advanced Administrator (Bonus)

### Exam Topics

| Topic | Weight |
|-------|--------|
| Security and Access | **20%** |
| Process Automation | **20%** |
| Objects and Applications | 20% |
| Auditing and Monitoring | 10% |
| Einstein and AI Features | 10% |
| Data and Analytics Management | 10% |
| Cloud Applications | 10% |

**Note:** The Einstein and AI Features (10%) directly overlaps with Agentforce Specialist content — study both simultaneously.

### Real-World Labs

1. **Advanced Security** — Configure restriction rules to limit record visibility beyond OWDs; implement scoping rules; test with multiple user profiles
2. **Advanced Flow** — Build a subflow called from both a screen flow and a record-triggered flow; add fault paths with error logging to a custom object
3. **Custom Metadata in Automation** — Store business rules in Custom Metadata Type records; build a Flow that reads them dynamically; update rules without changing the Flow
4. **Territory Management** — Configure Enterprise Territory Management with 3-level territory hierarchy; assign accounts via filter rules; test territory-based report access
5. **Change Data Capture** — Subscribe to Account CDC events using a Flow; update a related custom object when the account is modified externally

### Estimated Study Time: ~45 hours

---

## Combined Study Efficiency

Studying all 3 together:
- Data Cloud first → builds foundation for Agentforce AI grounding (13% of Data Cloud exam)
- Agentforce Specialist second → Data Cloud knowledge reused in Prompt Builder grounding labs
- Advanced Admin last → Einstein section (10%) is now review material

**Total unique study time:** ~120–130 hours  
**Recommended timeline:** 4–5 months at 25–30 hrs/month

---

## Key Documentation Links

| Resource | URL |
|----------|-----|
| Data 360 Product Overview | `salesforce.com/products/data-cloud/overview/` |
| Data Cloud API Docs | `developer.salesforce.com/docs/atlas.en-us.c360a_api` |
| Agentforce Developer Overview | `developer.salesforce.com/docs/ai/agentforce/overview` |
| Agentforce Get Started | `developer.salesforce.com/docs/ai/agentforce/guide/get-started.html` |
| Einstein Studio Developer Center | `developer.salesforce.com/developer-centers/einstein-1-studio` |
| Agentforce Help Docs | `help.salesforce.com` → search "Agentforce" |
| Data 360 Trailhead Journey | `trailhead.salesforce.com/content/learn/trailhead-journey/data-360` |
| Agentblazer Program | `trailhead.salesforce.com/agentblazer` |
| Coral Cloud Sample App (GitHub) | `github.com/trailheadapps/coral-cloud` |
| Data Cloud Consultant Exam Guide | `trailheadacademy.salesforce.com` → Data Cloud Consultant |
| Agentforce Specialist Exam Guide | `trailheadacademy.salesforce.com` → Agentforce Specialist |
| Salesforce Developers YouTube | `youtube.com/@SalesforceDevelopers` |
