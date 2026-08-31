# L04: Environment Strategy

## 🎯 Learning Objectives
- Identify the four sandbox types and select the right sandbox for each stage of development
- Describe the standard development lifecycle for a Salesforce app build
- Explain the purpose of scratch orgs and Salesforce DX in the development workflow
- Outline how change sets move metadata between environments

---

## 📊 SLIDES

### Slide 1: Why Environment Strategy Matters
**Visual:** Single-environment danger diagram: a developer making changes directly in Production, with a red warning overlay showing "Users impacted immediately," "No rollback," "No testing." Arrow pointing right to proper lifecycle: Dev Sandbox → QA Sandbox → Production.
**Content:**
- **Never build directly in Production** — this is the cardinal rule of Salesforce development
- Production is your live environment — real users, real data, real business impact
- Changes made in Production without testing can break existing automation, reports, and integrations
- Sandboxes are copies of your Production org used for development and testing
- A proper environment strategy protects users, data, and business operations
**Speaker Notes:** I want to start with the rule before we talk about anything else: never build directly in production. I know it's tempting. It's faster. There's no deployment step. But one bad validation rule or a misconfigured Flow can start throwing errors for every user the moment you save. Sandboxes exist precisely to prevent this. Think of sandboxes as your lab — experiment there, break things there, fix them there, and only move to production when you're confident the solution works.

### Slide 2: Sandbox Types — Overview
**Visual:** Four-column comparison table with headers: Developer | Developer Pro | Partial Copy | Full Copy. Rows: Storage (200 MB | 1 GB | 5 GB | Same as prod), Refresh (daily | daily | 5 days | 29 days), Data (none | none | sample | full copy), Cost (included | extra | extra | extra).
**Content:**
- **Developer Sandbox:** Metadata only, no production data, 200 MB storage, refreshes daily — for individual development
- **Developer Pro Sandbox:** Same as Developer but 1 GB storage — for teams needing slightly more space
- **Partial Copy Sandbox:** 5 GB, includes a sample of production data (via sandbox template) — for QA testing
- **Full Copy Sandbox:** Exact replica of production, including all data — for load testing and final UAT
- All sandbox types get a refresh period — after refreshing, the sandbox is reset to a fresh copy of production metadata
**Speaker Notes:** Choose your sandbox type based on what you're doing in it, not just what's cheapest. For day-to-day development and configuration, a Developer sandbox is almost always sufficient — you're working with metadata, not data. When your QA testers need realistic data to test with, a Partial Copy sandbox gives them a representative sample without exposing all production data. Full Copy sandboxes are expensive and slow to provision — use them only for performance testing or final user acceptance testing before major releases.

### Slide 3: When to Use Each Sandbox Type
**Visual:** Decision flowchart. "What are you doing?" → "Writing/testing configuration (no data needed)" → Developer Sandbox. → "QA testing with real-ish data" → Partial Copy Sandbox. → "Performance/load testing" or "Final UAT before go-live" → Full Copy Sandbox. → "Multiple developers working independently" → Multiple Developer Sandboxes (one per developer).
**Content:**
- **Developer Sandbox use cases:** Building new objects, creating Flows, testing automation logic, exploring new features
- **Partial Copy use cases:** QA testing with realistic data, validating reports, testing data-dependent processes
- **Full Copy use cases:** Load and performance testing, parallel testing with exact production data, regulatory compliance testing
- One Developer Sandbox per developer is the recommended practice for independent work streams
- Consider sandbox naming conventions: DEV-FEAT-ProjectName, QA-Sprint12, UAT-Release2025
**Speaker Notes:** A pattern that works well for most teams: every developer gets their own Developer sandbox for their current work. Changes that are ready for testing move to a shared QA or Partial Copy sandbox. Once QA signs off, changes move to a Full sandbox or directly to production via change set. This three-stage flow — dev, QA, production — is the minimum viable lifecycle. Larger organizations add stages for regression testing, performance testing, and staged rollouts.

### Slide 4: Scratch Orgs and Salesforce DX
**Visual:** Comparison diagram. Left: "Traditional Sandboxes" — persistent, long-lived, manual refresh. Right: "Scratch Orgs (Salesforce DX)" — temporary (1–30 days), created from source code, version-controlled, disposable.
**Content:**
- **Scratch Orgs:** Temporary Salesforce environments created and destroyed via command-line tools
- Part of the **Salesforce DX** (Developer Experience) platform — modern development tooling
- Defined by a **scratch org definition file** (JSON) — specifies enabled features, edition, etc.
- All configuration is stored in source control (Git) — changes are tracked and reviewable
- Primarily used by developers writing Apex and LWC — less common for pure declarative work
- **Why app builders care:** Some teams use Salesforce DX for all development; understanding scratch orgs is testable
**Speaker Notes:** Scratch orgs represent the modern Salesforce development paradigm. Instead of a long-lived sandbox that accumulates changes over months, you create a fresh org from source code, do your work, commit your changes to Git, and destroy the org. The source code is the source of truth, not the org itself. If you're working on a team that uses Salesforce DX, your declarative configuration — objects, fields, flows — gets exported as metadata XML and stored in source control alongside Apex code. For the App Builder exam, you need to know what scratch orgs are and that they're part of Salesforce DX, but you won't be tested on command-line syntax.

### Slide 5: The Development Lifecycle
**Visual:** Left-to-right pipeline diagram with five stages: (1) Requirements → (2) Dev Sandbox (Build) → (3) QA/UAT Sandbox (Test) → (4) Staging/Full Sandbox (Final validation) → (5) Production (Deploy). Arrows between each stage labeled with the deployment method.
**Content:**
- **Stage 1 — Requirements:** Define what needs to be built. Document data model, security, automation, UI requirements.
- **Stage 2 — Dev Sandbox:** Build and unit test in isolation. One developer = one sandbox.
- **Stage 3 — QA/UAT Sandbox:** Integration and user acceptance testing. QA team validates against requirements.
- **Stage 4 — Staging (optional):** Final pre-production validation. Change set or Salesforce DX deployment.
- **Stage 5 — Production:** Scheduled deployment, usually during low-traffic window. Communication to users.
**Speaker Notes:** The lifecycle sounds obvious, but in practice it gets skipped under deadline pressure. Teams cut corners — they skip QA, they deploy straight from dev, they test in production. Every time they do this, they risk user-visible errors, data corruption, or broken integrations. Build the discipline of following the lifecycle from the start of your career. When leadership pushes back and says "just put it in production now," explain the risk in business terms: "If this breaks, it will affect all users and we may not be able to roll it back quickly."

### Slide 6: Change Sets — Moving Metadata Between Orgs
**Visual:** Diagram showing Production org at top, two connected sandbox orgs below. Arrows labeled "Outbound Change Set" pointing from sandbox to production, and "Inbound Change Set" on the production side receiving it. Callout: "Change sets can only travel between orgs in the same Salesforce account (related orgs)."
**Content:**
- **Change Set:** A container of metadata components selected for deployment from one org to another
- **Outbound Change Set:** Created in the source org (sandbox), specifying which components to send
- **Inbound Change Set:** Received by the target org (production), validated and deployed by an admin
- Change sets require orgs to be **connected** (same Salesforce account, set up via Deployment Connections)
- Change sets are one-directional — you cannot use a change set to pull changes from another org
- Limitation: Cannot deploy data (records), only metadata (configuration)
**Speaker Notes:** Change sets are the most common deployment mechanism for small to medium Salesforce orgs that aren't using Salesforce DX. They're graphical and don't require command-line knowledge, which makes them accessible to app builders and admins. But they have real limitations: you have to manually select every component you want to include, dependencies aren't always automatically resolved, and if you forget to include a dependent component, the deployment will fail. The validation step — running the change set through "Validate" before actually deploying — is critical. Always validate first, especially for production deployments.

### Slide 7: What Can (and Cannot) Be Deployed
**Visual:** Two-column table. Left "Can deploy with change sets": Custom Objects, Custom Fields, Flows, Validation Rules, Apex Classes, Lightning Pages, Permission Sets, Profiles (partial). Right "Cannot deploy with change sets": Records/Data, User assignments, Active/Inactive status of some components, Sandbox-specific settings.
**Content:**
- Change sets deploy **metadata** — configuration components — not actual data records
- Most declarative app builder components are deployable: objects, fields, flows, page layouts, apps, permission sets
- Flows deploy in **inactive** state — you must activate them manually in the target org
- Cannot deploy specific record types' assignment to profiles via change set
- Data migration requires separate tools: Data Loader or Data Import Wizard
**Speaker Notes:** Here's the most important thing to remember about deploying Flows: they arrive in the target org as inactive. Every time. It's a deliberate safety measure. Before you announce that a feature is live, log into production, find your Flow in Flow Builder, and activate it. I've seen this trip up developers at every experience level — they deploy, everything looks fine, but users report the automation isn't working because the Flow is sitting there inactive. Make activating Flows part of your deployment checklist.

### Slide 8: Testing in Sandbox — Best Practices
**Visual:** Checklist graphic: (1) Test as a non-admin user. (2) Test with realistic data volumes. (3) Test all automation triggers. (4) Validate security model with each user persona. (5) Run Apex test classes (if any code is deployed). (6) Document test results.
**Content:**
- Testing is the entire point of having a sandbox — actually use it
- Test as the **end user persona**, not as an admin (admins bypass security)
- For automation: manually trigger every path — happy path AND error paths
- Volume testing: run automation on 200+ records to check for governor limit issues
- Get sign-off from **business stakeholders** in UAT sandbox before production deployment
- Document testing outcomes for audit trail and future reference
**Speaker Notes:** Testing is where app builders cut corners most often, and it's the most costly place to do so. A bug found in sandbox takes 30 minutes to fix. The same bug found in production after go-live might take days to remediate, with user frustration, data cleanup, and executive visibility along the way. Test thoroughly, test as end users, test edge cases — what happens if the field is blank? What happens if 500 records trigger this Flow at once? These aren't hypothetical questions; they're the scenarios your users will create on day one.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 04 — Environment Strategy. This lecture is about how professional app builders manage the build-to-production lifecycle. The exam tests this in the App Deployment domain, but the habits you form here will define the quality of every app you ever build.

The absolute foundation, on Slide 1, is this: never build in production. I'll say it once and we'll move on, but remember it every day. Production is where your users work, where your business operates, and where bad changes cause real damage. Everything else in this lecture is infrastructure that supports keeping production safe.

Slide 2 gives you the four sandbox types. Know these for the exam — not just the names, but the characteristics. Developer sandbox: metadata only, daily refresh, 200 MB — this is your workhorse for building. Developer Pro: same but 1 GB. Partial Copy: includes a sample of production data, 5 GB, refresh every 5 days — use this for QA. Full Copy: identical to production including all data, refresh every 29 days, expensive — use this for load testing or final UAT on major projects.

The decision chart on Slide 3 helps you pick the right sandbox. For most app building work, a Developer sandbox is fine. You're working with metadata — creating objects, building Flows. You don't need real customer data to test a Flow logic path. Partial Copy comes in when your QA team needs realistic data to validate the user experience. Full Copy is rare and expensive — reserve it for high-stakes deployments.

Slide 4 introduces Scratch Orgs and Salesforce DX. You don't need deep knowledge of this for the App Builder exam, but you need to know what it is: a modern development approach where temporary orgs are created from source code, all configuration lives in version control, and orgs are disposable. Some enterprises run all their Salesforce development through Salesforce DX. If you join one of those teams, you'll want to understand this model.

The lifecycle on Slide 5 is the standard flow: Requirements → Dev Sandbox → QA Sandbox → Production. This is the minimum. Larger organizations add stages. The key is that each stage validates the work before it advances to the next environment.

Slides 6 and 7 cover change sets — the most common deployment mechanism for app builders. An outbound change set packages up your metadata components in the source sandbox. An inbound change set receives and deploys them in the target org. The critical limitation: change sets only move metadata, never data. And Flows arrive inactive — never forget to activate them.

Slide 8 is your testing checklist. Test as an end user, not as admin. Test with realistic data. Test all automation paths. Get stakeholder sign-off. Document results. Follow these steps, and your production deployments will be smooth. Skip them, and you'll spend your evenings rolling back changes and apologizing to users.

---

## 🔔 EXAM TIPS
- **Sandbox types and their characteristics:** Know the storage limits, refresh frequencies, and data copy behavior for each type. This is directly tested: "Which sandbox type includes a sample of production data?" (Partial Copy)
- **Change sets move metadata, not data:** Exam scenarios about moving records between orgs require data tools (Data Loader), not change sets.
- **Flows deploy as inactive:** If an exam question asks what an admin must do after deploying a change set containing a Flow, the answer includes activating the Flow in the target org.
- **Connected orgs required for change sets:** Change sets can only be used between orgs that are connected (same Salesforce account). You cannot use a change set to deploy to a completely unrelated org.
- **Scratch org basics:** Know that scratch orgs are temporary environments used in Salesforce DX development, created from source code, and typically used for developer workflows involving Apex and LWCs.

---

## ✅ LECTURE SUMMARY
- Never build directly in Production — always develop and test in a sandbox first
- The four sandbox types (Developer, Developer Pro, Partial Copy, Full Copy) serve different stages of the development lifecycle based on data needs and storage requirements
- The standard development lifecycle flows: Dev Sandbox → QA/UAT Sandbox → Production
- Change sets are metadata containers that move configuration between connected orgs — they cannot move data records, and Flows arrive inactive after deployment
- Scratch orgs are temporary environments used in Salesforce DX development workflows, created from source code and stored in version control

---

## ❓ MINI QUIZ

**Q1:** A QA team needs a Salesforce sandbox that contains a representative sample of production customer data to validate a new custom app before go-live. Which sandbox type should be used?
- A) Developer Sandbox
- B) Developer Pro Sandbox
- C) Partial Copy Sandbox
- D) Full Copy Sandbox

**Answer:** C — Partial Copy sandboxes include a sample of production data (defined by a sandbox template), making them ideal for QA testing that requires realistic data. Developer sandboxes contain no production data, and Full Copy sandboxes are expensive and typically reserved for load testing.

**Q2:** An App Builder deploys a change set from a Developer sandbox to Production. The change set includes a new record-triggered Flow. After deployment, users report the Flow automation is not running. What is the most likely cause?
- A) The Flow was not included in the change set properly
- B) Record-triggered Flows cannot be deployed using change sets
- C) Flows are deployed in Inactive status and must be manually activated in the target org
- D) The Flow requires a Developer sandbox to run and cannot work in Production

**Answer:** C — Flows are always deployed in Inactive status when moved via change set. An admin must navigate to Flow Builder in the production org and activate the Flow after deployment.

**Q3:** An App Builder is working on a new custom app and needs to build and unit test configuration changes independently, without production data and without affecting other team members' work. Which environment is most appropriate?
- A) A Full Copy sandbox shared with the QA team
- B) The production org, using a separate profile for testing
- C) A Partial Copy sandbox
- D) A dedicated Developer sandbox

**Answer:** D — Developer sandboxes are designed for individual development work. They refresh daily, contain no production data, and are inexpensive enough to give one to each developer. A shared Full Copy or Partial Copy sandbox would mix development work from multiple team members and waste expensive sandbox resources.
