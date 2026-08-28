# Salesforce Foundation Certifications

> **Last Updated:** August 2026  
> **Path Position:** Months 1–3 in the 12-Month Technical Architect Sprint

---

## Quick Reference

| Cert | Questions | Time | Pass Score | Cost | Prerequisites |
|------|-----------|------|-----------|------|--------------|
| AI Associate | 40 | 70 min | 65% | $75 | None |
| Administrator | 60 | 105 min | 65% | $200 | None |
| Platform App Builder | 60 | 105 min | 63% | $200 | Admin recommended |

**Recommended order:** AI Associate → Administrator → Platform App Builder

---

## 1. Salesforce AI Associate

### Exam Topics

| Topic | Weight |
|-------|--------|
| Generative AI Technology and Tools | **24%** |
| AI Capabilities in Salesforce | 23% |
| Ethical Considerations of AI | 19% |
| AI Fundamentals | 17% |
| Data for AI | 17% |

### Key Concepts

- **Generative AI (24%):** LLMs, prompt engineering, hallucinations, tokens, Einstein Trust Layer, grounding
- **AI in Salesforce (23%):** Einstein Copilot, Prompt Builder, Next Best Action, Einstein Prediction Builder, AgentForce
- **Ethics (19%):** Salesforce Trusted AI principles, bias, transparency, accountability
- **Data for AI (17%):** Data quality, training data, Data Cloud's role in AI pipelines

### Official Trailhead Path

Trailmix: "Prepare for Your Salesforce AI Associate Credential"  
`trailhead.salesforce.com/users/strailhead/trailmixes/salesforce-ai-associate-cert-prep`

| Module | Time |
|--------|------|
| Artificial Intelligence Fundamentals | ~2 hrs |
| Salesforce AI Ethics | ~1 hr |
| Get Started with Generative AI | ~1 hr 30 min |
| Einstein AI Features | ~2 hrs |
| Data Cloud Basics | ~2 hrs |
| Einstein Copilot Basics | ~1 hr |

### Hands-On Labs

1. **Prompt Engineering Lab** — Use the AI Playground on Trailhead to experiment with prompt variations; observe how grounding and context affect LLM output
2. **Einstein Prediction Builder** — In a Developer org, build a binary classification prediction (e.g., will this lead convert?) and evaluate the model score
3. **Next Best Action** — Configure a recommendation strategy using Einstein NBA and surface it on a Lightning record page
4. **Prompt Builder** — Create a custom prompt template for summarizing case notes; test with sample data
5. **Data Cloud AI Pipeline** — Explore how a Data Cloud segment feeds an Einstein model (use Trailhead Playground with Data Cloud trial)

### Videos & Resources

| Resource | URL |
|----------|-----|
| Salesforce AI Associate Exam Guide | `trailhead.salesforce.com` → Credentials → AI Associate |
| Salesforce+ AI content library | `salesforce.com/plus` |
| Focus on Force practice exams | `focusonforce.com` (paid) |
| Salesforce Ben study guide | `salesforceben.com` |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| No Salesforce or AI experience | 30–50 hrs |
| Some Salesforce, new to AI | 15–25 hrs |
| Experienced Salesforce pro with AI exposure | 8–15 hrs |

---

## 2. Salesforce Administrator

### Exam Topics

| Topic | Weight |
|-------|--------|
| Configuration and Setup | **20%** |
| Object Manager and Lightning App Builder | **20%** |
| Workflow / Process Automation | 16% |
| Data and Analytics Management | 14% |
| Sales and Marketing Applications | 12% |
| Service and Support Applications | 11% |
| Productivity and Collaboration | 7% |

### Official Trailhead Path

**Admin Beginner Trail** (~7 hrs 20 min)  
`trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner`

| Module | Time |
|--------|------|
| Data Modeling | ~45 min |
| Data Management | ~35 min |
| Lightning Experience Customization | ~3 hrs |
| User Engagement | ~1 hr 10 min |
| Reports & Dashboards for Lightning Experience | ~1 hr 50 min |

**Admin Intermediate Trail** (~11 hrs 45 min)  
`trailhead.salesforce.com/content/learn/trails/force_com_admin_intermediate`

| Module | Time |
|--------|------|
| Formulas and Validations | ~1 hr |
| Data Security | ~1 hr 50 min |
| Picklist Administration | ~50 min |
| Build a Suggestion Box App (project) | ~1 hr 15 min |
| Approve Records with Approval Processes | ~30 min |
| AgentExchange Basics | ~55 min |
| Salesforce Mobile App Rollout | ~2 hrs 5 min |
| Build a Space Station App (project) | ~2 hrs 5 min |

**Official Trailmix:** "Prepare for Your Salesforce Administrator Credential"  
`trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential`

### Superbadges

| Superbadge | Maps To | Est. Time |
|-----------|---------|-----------|
| **Business Administration Specialist** | Config & Setup, Object Manager | ~10 hrs |
| **Process Automation Specialist** | Automation 16% | ~10 hrs |
| **Security Specialist** | Config & Setup, sharing model | ~8 hrs |
| **Reports & Dashboards Specialist** | Data Analytics 14% | ~6 hrs |
| **Data Management Specialist** | Data Analytics 14% | ~6 hrs |

### Real-World Admin Labs

1. **Full Org Setup** — Configure company settings, fiscal year, business hours, login hours/IP restrictions, password policies; create 10 users with profiles, roles, and permission sets
2. **Sales Cloud Build** — Create a complete sales process: custom fields on Account/Contact/Opportunity, page layouts, record types, path component, kanban view
3. **Flow Automation** — Build a record-triggered flow that auto-creates a Task when an Opportunity stage changes to "Negotiation"; add a screen flow for a guided data entry process
4. **Approval Process** — Multi-level discount approval: field-based entry, parallel approvers, rejection handling, recall
5. **Service Cloud Setup** — Email-to-case, case assignment rules, escalation rules, Omni-Channel routing, Knowledge article
6. **Sharing Model** — Set Account OWD to Private, build role hierarchy with 3 levels, add criteria-based sharing rule, test access as different users
7. **Data Migration** — Use Data Import Wizard to import 500 contacts; use Data Loader to bulk update; set up duplicate rules with a matching rule
8. **Reports & Dashboards** — Build all 4 report types; create a 4-component dashboard with filters; schedule dashboard refresh

### Videos & Resources

| Resource | URL |
|----------|-----|
| Salesforce Admins YouTube | `youtube.com/salesforceadmins` |
| admin.salesforce.com | Official blog, podcast, video library |
| Focus on Force | `focusonforce.com` (practice exams — widely recommended) |
| Salesforce Ben | `salesforceben.com` |
| Trailhead Live prep sessions | `trailhead.salesforce.com/live` |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| No CRM or Salesforce experience | 150–200 hrs |
| CRM background, no Salesforce | 80–120 hrs |
| Active Salesforce user under 1 year | 60–80 hrs |
| Experienced daily Salesforce user | 30–60 hrs |

---

## 3. Salesforce Platform App Builder

### Exam Topics

| Topic | Weight |
|-------|--------|
| Business Logic and Process Automation | **28%** |
| Salesforce Fundamentals | 23% |
| Data Modeling and Management | 22% |
| User Interface | 17% |
| App Deployment | 10% |

### Key Concepts

- **Automation (28%):** All Flow types (screen, auto-launched, scheduled, record-triggered, platform-event), validation rules, formula fields, rollup summaries, approval processes — this is the biggest section
- **Data Modeling (22%):** Custom objects, fields, lookup vs. master-detail, junction objects, schema builder, external objects, custom metadata types, Big Objects
- **App Deployment (10%):** Change sets (inbound/outbound), sandbox types, Salesforce DX basics, packaging concepts

### Official Trailhead Path

**Official Trailmix:** "Prepare for Your Salesforce Platform App Builder Credential"  
`trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-app-builder-credential`

| Module | Time | Exam Section |
|--------|------|-------------|
| Data Modeling | ~45 min | Data Modeling 22% |
| Lightning App Builder | ~2 hrs | UI 17% |
| Flow Builder Basics | ~3 hrs | Automation 28% |
| Advanced Flow Building | ~3 hrs | Automation 28% |
| Custom Metadata Types | ~1 hr | Data Modeling 22% |
| Approval Processes | ~30 min | Automation 28% |
| Sandboxes and Deployment | ~1 hr | Deployment 10% |
| AppExchange Basics | ~1 hr | Fundamentals 23% |

### Superbadges

| Superbadge | Maps To | Est. Time |
|-----------|---------|-----------|
| **App Customization Specialist** | Fundamentals + Data Modeling | ~12 hrs |
| **Process Automation Specialist** | Automation 28% | ~10 hrs |
| **Business Administration Specialist** | Data Modeling, validation | ~10 hrs |
| **Lightning Experience Specialist** | UI 17% | ~6 hrs |

### Real-World App Builder Labs

1. **Custom App from Scratch** — Design a Project Management app: 5 custom objects (Project, Milestone, Task, Resource, Budget), master-detail + lookup relationships, junction object for Resource assignments
2. **All Flow Types** — Build one of each: screen flow (multi-step guided data entry), record-triggered (auto-update on stage change), scheduled (weekly summary email), auto-launched (called from another flow)
3. **Dynamic Forms** — Lightning record page with conditional field visibility: show financial fields only when Record Type = "Enterprise"; hide internal notes from Community users
4. **Custom Lightning App** — Use App Manager to build a branded app with custom navigation, utility bar (notes, recent items), and Salesforce mobile config
5. **Change Set Deployment** — Create a sandbox, build changes, deploy via outbound change set to another sandbox, verify deployment report
6. **Custom Metadata + Flow** — Store discount thresholds in Custom Metadata Type records; reference them in a Flow decision element instead of hardcoded values
7. **Schema Builder Design** — Use Schema Builder to visually map a 6-object data model and document the relationship types and cascade-delete implications

### Videos & Resources

| Resource | URL |
|----------|-----|
| Salesforce Developers YouTube | `youtube.com/salesforcedevelopers` |
| Automation Champion blog | `automationchampion.com` (Flow deep dives) |
| Focus on Force | `focusonforce.com` |
| Salesforce Ben App Builder guide | `salesforceben.com` |
| Trailhead Live prep sessions | `trailhead.salesforce.com/live` |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| No Salesforce experience | 180–250 hrs |
| Admin cert, limited hands-on | 80–120 hrs |
| Certified Admin with 1+ year experience | 50–80 hrs |
| Admin actively building apps | 30–50 hrs |

---

## Practice Environment Setup

### Get Your Free Developer Org
1. Go to `developer.salesforce.com/signup`
2. Fill in details (use a real email — this is your login)
3. Verify email and log in at `login.salesforce.com`
4. This org never expires; you can create multiple

### Get a Trailhead Playground
1. Log in at `trailhead.salesforce.com`
2. Click avatar → Hands-On Orgs → Create Playground
3. Use "Launch" to open it; get credentials via "Get Your Login Credentials"

### Install Key Tools
- **Salesforce Inspector** browser extension — inspect any record's fields/metadata instantly
- **Workbench** (`workbench.developerforce.com`) — SOQL queries, REST explorer, metadata
- **Data Loader** — `dataloader.io` (web) or Salesforce's native client for bulk operations

---

## Key Links

| Resource | URL |
|----------|-----|
| AI Associate Credential | `trailhead.salesforce.com/credentials/aiassociate` |
| Admin Credential | `trailhead.salesforce.com/credentials/administrator` |
| App Builder Credential | `trailhead.salesforce.com/credentials/platform-app-builder` |
| Admin Beginner Trail | `trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner` |
| Admin Intermediate Trail | `trailhead.salesforce.com/content/learn/trails/force_com_admin_intermediate` |
| All Superbadges | `trailhead.salesforce.com/superbadges` |
| Exam Registration | `webassessor.com/salesforce` |
| Developer Org Signup | `developer.salesforce.com/signup` |
| Salesforce Help Docs | `help.salesforce.com` |
