# L23: Release Management

## 🎯 Learning Objectives
- Understand Salesforce's three-release-per-year cycle and how Critical Updates, sandbox previews, and pre-release orgs support preparation
- Describe the recommended sandbox pipeline (Developer → QA → UAT → Production) and the characteristics of each sandbox type
- Apply best practices for Apex test coverage, regression testing, change freezes, and feature toggling with Custom Settings

## 📊 SLIDES

### Slide 1: Salesforce Release Cycle
**Visual:** Annual timeline showing three release windows: Spring (Jan-Feb), Summer (May-Jun), Winter (Sep-Oct) — with icons for "Preview," "Release Notes Published," and "Production Update" on each
**Content:**
- Salesforce delivers **three major releases per year** — included in every subscription at no extra charge
- Release schedule:
  - **Spring:** January – February
  - **Summer:** May – June
  - **Winter:** September – October
- Each release brings new features, enhancements, and potential breaking changes
- Release names include the year: Spring '25, Summer '25, Winter '26
- **Release Notes** are published weeks before the release — detailed documentation of every change
- Releases are automatic — Salesforce updates your org on a scheduled weekend window (you receive advance notice)
**Speaker Notes:** The three-release cadence is one of the most important structural facts about Salesforce as a platform. Unlike on-premise software, you don't choose when to upgrade — Salesforce pushes updates to all orgs on a rolling schedule. The advance notice and release notes period is when admins should evaluate impact, test customizations, and prepare for changes. This predictability allows organizations to build annual testing cycles around known release windows.

---

### Slide 2: Release Notes & Critical Updates
**Visual:** Two-panel diagram: left panel shows the Release Notes page on Salesforce Help with "New Features" and "Changed Features" sections; right panel shows the Critical Updates page in Setup with an "Activate" button
**Content:**
- **Release Notes:**
  - Published 4-6 weeks before the release goes live in production
  - Available at help.salesforce.com/releaseNotes
  - Organized by cloud: Sales Cloud, Service Cloud, Platform, Flow, etc.
  - Admins should review before each release for impact on existing customizations
- **Critical Updates:**
  - Changes that could potentially break existing behavior or integrations
  - Admins can **opt in early** to test impact in sandboxes before the enforced date
  - Eventually become **auto-activated** in a future release (Salesforce sets a retirement date)
  - Found in: Setup → Critical Updates
  - Examples: security-related changes, API version enforcement, behavior fixes
**Speaker Notes:** Critical Updates are Salesforce's way of signaling "this might break something." The opt-in window allows proactive admins to test the change in sandbox before it's forced on everyone. If a Critical Update retires (auto-activates), you have no choice — it applies to your org. Best practice is to activate Critical Updates in sandbox proactively, test thoroughly, and adjust any broken functionality well before the enforcement date.

---

### Slide 3: Sandbox Preview & Pre-Release Orgs
**Visual:** Timeline diagram showing Production release date on the right, with "Sandbox Preview Window" starting 1-2 months earlier on the left, and a "Pre-Release Org sign-up" marker even further left
**Content:**
- **Sandbox Preview:**
  - Sandbox orgs can be upgraded to the next release version **1-2 months before production**
  - Allows testing of new features and checking for regressions against existing customizations
  - Opt-in: during a sandbox refresh near the preview window, the new release is available
  - Not all sandboxes preview simultaneously — it depends on refresh timing
- **Pre-Release Orgs:**
  - Sign up for a free trial org at developer.salesforce.com or via Salesforce's pre-release program
  - Available before even the sandbox preview window
  - Useful for exploring new features and writing blog posts or training content
  - Not suitable for testing production customizations (it's a fresh org, not your org's data/config)
- **Production Update:** usually happens on a weekend, notified in advance via Trust site and email
**Speaker Notes:** Sandbox preview is the most practical early-access mechanism for most admins because it tests the real org's customizations — not a clean slate. A pre-release org lets you explore new features without waiting but lacks your org's specific configuration. The combination of pre-release exploration + sandbox preview + release notes review is the gold standard preparation approach for each Salesforce release.

---

### Slide 4: Sandbox Types
**Visual:** Comparison table with four rows (Developer, Developer Pro, Partial Copy, Full) and columns for: Data Copied, Storage, Refresh Interval, Best Use Case
**Content:**
- **Developer Sandbox:**
  - No data from production (metadata/config only)
  - 200 MB storage (data) + 200 MB file storage
  - Refresh: once per day
  - Use: code development, unit testing, individual admin work
- **Developer Pro Sandbox:**
  - No data from production (metadata/config only)
  - 1 GB storage
  - Refresh: once per day
  - Use: slightly larger development projects, QA testing
- **Partial Copy Sandbox:**
  - Includes a subset of production data (using a sandbox template)
  - Up to 5 GB storage
  - Refresh: every 5 days
  - Use: QA testing with representative data
- **Full Sandbox:**
  - Complete copy of production data + metadata
  - Same storage as production
  - Refresh: once every 29 days (slowest — can take hours/days to create)
  - Use: UAT, final pre-production testing, performance testing
**Speaker Notes:** Sandbox types are directly tested on the CRT-403 exam — expect questions about which sandbox type is appropriate for a given scenario. The key differentiators are data (Full > Partial > Developer/Developer Pro = none), storage size, and refresh interval. Full sandboxes are expensive and slow to create, which is why they're reserved for final UAT. Developer sandboxes are cheap, fast, and abundant — most orgs have several.

---

### Slide 5: Release Pipeline Best Practices
**Visual:** Horizontal pipeline diagram: Developer Sandbox → Developer Pro / QA Sandbox → Partial/Full Sandbox (UAT) → Production, with arrows showing change set or SFDX promotion between stages
**Content:**
- **Recommended Pipeline:**
  1. **Developer Sandbox** — individual development and unit testing
  2. **QA/Developer Pro Sandbox** — integrated testing, QA team validation
  3. **Partial or Full Sandbox (UAT)** — User Acceptance Testing with business stakeholders
  4. **Production** — final deployment after all approvals
- At each stage, deploy using change sets or Salesforce DX
- Each stage provides a gate: issues caught here don't reach production
- **Governance principles:**
  - No direct edits in production (all changes flow through the pipeline)
  - Document all changes — use change set descriptions and deployment logs
  - Maintain a change log or JIRA/project tracking for audit trail
  - Schedule deployments during off-peak hours to minimize user impact
**Speaker Notes:** The pipeline concept is fundamental to Salesforce governance. The exam may present a scenario asking which sandbox to use for a specific testing phase — match UAT with Full/Partial, QA with Developer Pro, individual development with Developer. "No direct edits in production" is a best practice that many small orgs violate but all should aspire to. The more complex the org, the more stages the pipeline needs.

---

### Slide 6: Apex Test Coverage & Regression Testing
**Visual:** Gauge showing 75% minimum coverage with a needle pointing at 85% labeled "Recommended," and a checklist below: All Tests Pass / Zero Failures / No Compilation Errors
**Content:**
- **Apex Test Coverage Requirement:** 75% of all Apex code must be covered by test methods to deploy to production
- Best practice: aim for 85%+ — staying above 75% by a margin prevents accidental drops below threshold
- **All tests must pass** with zero failures — a single failing test blocks the entire deployment
- **Regression Testing:** after each Salesforce release or deployment, re-run the full Apex test suite to catch any breakage
- **Test class best practices:**
  - Write tests in separate test classes annotated with `@isTest`
  - Test both positive and negative scenarios (valid data + error paths)
  - Use `System.assert`, `System.assertEquals`, `System.assertNotEquals` for verification
  - Create test data inside the test class — do not rely on org data (use `@isTest(SeeAllData=false)`)
- **Automated regression tools:** Provar, Selenium (for UI), Copado, or native Apex test runs via SF CLI
**Speaker Notes:** The 75% coverage requirement is a floor, not a goal. Teams that just barely meet 75% find themselves blocked from deploying when a new test method reveals untested code. Aiming for 85-90% provides a healthy buffer. Regression testing after each Salesforce seasonal release is a discipline many orgs skip, then scramble when a release breaks something. Building this into the release cycle calendar prevents emergency fixes.

---

### Slide 7: Feature Flags with Custom Settings
**Visual:** Hierarchy Custom Settings diagram showing three levels: Org Default (Feature X = OFF), Profile Override (Admin Profile = ON), User Override (Specific User = ON) — with a toggle icon for each level
**Content:**
- **Custom Settings** can act as **feature flags** — toggle functionality on/off without a deployment
- **Hierarchy Custom Settings** (the relevant type for feature flags):
  - Can be set at three levels: **Org Default**, **Profile**, **User** — most specific level wins
  - Apex, flows, and formulas can read custom setting values at runtime
- Feature flag pattern:
  - Create a Hierarchy Custom Setting with a checkbox field (e.g., `Enable_Beta_Feature__c`)
  - Set the org default to FALSE
  - Set the value to TRUE for specific profiles (e.g., Admins only) or specific users (pilot testers)
  - Apex/Flow checks the value at runtime and branches accordingly
- Enables: **phased rollouts, A/B testing, emergency kill switches** — no deployment needed to change behavior
**Speaker Notes:** Feature flags via Custom Settings are a powerful pattern for controlling risk during releases. Instead of deploying new code and hoping it works, you deploy the code with the feature flag defaulted to off, then flip it on for a small user group first. If something breaks, you flip it back off — no emergency deployment needed. The hierarchy in Hierarchy Custom Settings means a user-level override wins over profile, which wins over org default — very granular control.

---

### Slide 8: Change Freeze Windows & Release Communication
**Visual:** Calendar view showing a production deployment window blocked off (red zone), Salesforce's own release weekend blocked (gray zone), and a green zone labeled "Safe Deployment Window"
**Content:**
- **Change Freeze Windows:**
  - Organizations often enforce a freeze period around peak business times (e.g., end of quarter, fiscal year close, holiday season)
  - No deployments to production during freeze — reduces risk during high-stakes periods
  - Salesforce itself has a **release freeze** period close to the major release weekend — changes to the platform infrastructure are limited
- **Communication best practices:**
  - Notify users **in advance** of upcoming changes to their experience (page layout changes, new fields, new processes)
  - Use Salesforce in-app guidance (prompts, walkthroughs) to help users adopt new features
  - Publish an internal release notes document for your org's specific changes
- **Trust site:** status.salesforce.com — monitor for platform incidents and planned maintenance
- **Rollback planning:** since change sets have no rollback, document what changes were made and have a manual revert plan ready
**Speaker Notes:** Change freeze windows are a risk management tool that many mature Salesforce orgs use but beginners overlook. The concept is simple: when your business is at its most critical juncture, that's not the time to deploy potentially destabilizing changes. Salesforce's own freeze windows near release weekends are a secondary consideration — check the release schedule and the Trust site. The Trust site is also important for monitoring real-time platform health, which can affect deployment timing decisions.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 23, our final lecture in the deployment section — Release Management. This topic ties together everything we've learned about sandboxes, deployment, and how Salesforce as a platform evolves over time.

Let's start with the Salesforce release cycle. Unlike traditional software you install and upgrade on your own schedule, Salesforce pushes three major updates to every org every year — Spring, Summer, and Winter. These are included in your subscription. You don't pay extra, and you can't opt out. Your production org will be updated on Salesforce's schedule, typically on a weekend, with advance notice.

This means your admin discipline needs to match that cadence. Every release brings new features, and some changes could affect your existing customizations. Salesforce publishes detailed release notes 4-6 weeks before each release. Reading them — or at least the sections relevant to your implementation — is essential.

For changes that could break existing behavior, Salesforce uses the Critical Updates mechanism. These are opt-in first, then eventually auto-activated. The smart move is to activate Critical Updates in your sandbox proactively, test them, and adjust your customizations before they're forced on your production org.

For testing new releases against your real configuration, sandboxes are your safety net. Sandbox orgs can preview the upcoming release one to two months before production. If you refresh a sandbox during the preview window, you'll get the new release version, letting you test everything before it hits production. Pre-release orgs — free fresh orgs available even earlier — are great for exploring features but don't have your org's specific setup.

Speaking of sandboxes — know your four types cold for the exam. Developer sandboxes are the workhorses: no production data, refreshable daily, cheap. Developer Pro is similar but more storage. Partial Copy includes a sample of your production data — great for QA testing with realistic records. Full sandbox is a complete copy of production — same data, same storage — and you can only refresh it once every 29 days. Use Full sandboxes for UAT.

The best practice pipeline flows from Developer sandbox to QA to UAT (using a Partial or Full sandbox) and then to Production. Each stage catches issues before they reach the next. The golden rule: no direct edits in production. Everything should flow through the pipeline.

On Apex: 75% code coverage is the minimum for production deployments. Aim for 85% or higher to give yourself a buffer. All tests must pass — zero failures. Run your full Apex test suite after every Salesforce release as part of your regression testing cycle.

Two more practical tools: Custom Settings as feature flags let you turn features on and off at runtime without a deployment. Hierarchy Custom Settings let you control this at the org, profile, or user level. This is how you do phased rollouts and emergency kill switches. And change freeze windows — block deployments during your most critical business periods, like quarter-end or the holiday rush.

That covers Release Management and wraps up Section 5. With deployment tools, packages, and release practices under your belt, you're ready for a production-grade Salesforce implementation.

## 🔔 EXAM TIPS
- **Release Cadence:** Three major releases per year — Spring (Jan-Feb), Summer (May-Jun), Winter (Sep-Oct). Included in all subscriptions, automatic updates.
- **Critical Updates:** Found in Setup > Critical Updates. Admins can opt in early to test. Eventually auto-activate — do not ignore them.
- **Sandbox Preview:** Sandboxes can receive the upcoming release 1-2 months before production. Triggered by refreshing during the preview window.
- **Sandbox Types (memorize all four):** Developer (no data, daily refresh), Developer Pro (no data, daily refresh, more storage), Partial Copy (subset of data, 5-day refresh), Full (all data, 29-day refresh).
- **Pipeline Order:** Developer Sandbox → QA Sandbox → Partial/Full Sandbox (UAT) → Production.
- **75% Apex Coverage:** Required for production Apex deployments. Org-wide coverage — not just the code being deployed.
- **Hierarchy Custom Settings as Feature Flags:** Org Default → Profile Override → User Override (most specific wins). No deployment needed to change values.
- **Change Freeze Windows:** No deployments during peak business periods. Salesforce also has a pre-release freeze near release weekends.
- **No Rollback in Change Sets:** Plan a manual revert strategy before deploying to production — document every change.

## ✅ LECTURE SUMMARY
- Salesforce delivers three automatic major releases per year: Spring, Summer, and Winter — release notes published 4-6 weeks in advance
- Critical Updates are potentially breaking changes that admins can test early by opting in; they eventually auto-activate in a future release
- Sandbox orgs can preview the next Salesforce release 1-2 months before production by refreshing during the preview window
- Four sandbox types: Developer (no data, daily refresh), Developer Pro (more storage), Partial Copy (subset of data, 5-day refresh), Full (complete copy, 29-day refresh)
- Best practice pipeline: Developer Sandbox → QA Sandbox → UAT Sandbox → Production with no direct edits in production
- Apex deployments to production require 75% org-wide code coverage and all tests must pass with zero failures
- Hierarchy Custom Settings act as feature flags — control feature behavior per org/profile/user at runtime without deployment
- Change freeze windows block deployments during peak business periods to minimize risk during critical times

## ❓ MINI QUIZ

**Q1:** A Salesforce admin wants to test the impact of an upcoming Winter release on existing customizations before it reaches production. Which approach gives them access to the new release version against their actual org's configuration?
- A) Sign up for a free pre-release Developer Edition org
- B) Refresh a sandbox during the sandbox preview window to get the upcoming release version
- C) Enable the Winter release on Production immediately via Setup > Release Management
- D) Request an early upgrade from Salesforce Support

**Answer:** B — Refreshing a sandbox during the sandbox preview window delivers the upcoming release to that sandbox, allowing the admin to test against their real org's metadata and configuration. A pre-release Developer Edition org is a clean org (no your customizations), and Production cannot be upgraded early — it's on Salesforce's release schedule.

---

**Q2:** An organization's UAT team needs to perform end-to-end testing with a representative set of real production data. The team needs 3 GB of data storage and expects to run multiple test cycles each month. Which sandbox type is most appropriate?
- A) Developer Sandbox — daily refresh, lightweight
- B) Developer Pro Sandbox — 1 GB storage, daily refresh
- C) Partial Copy Sandbox — up to 5 GB with a subset of production data, refreshable every 5 days
- D) Full Sandbox — complete copy of production data

**Answer:** C — Partial Copy sandboxes include a subset of production data (configurable via sandbox template), provide up to 5 GB of storage, and can be refreshed every 5 days — matching the need for realistic data, sufficient storage, and regular refresh cycles. A Full sandbox would provide more data but is limited to a 29-day refresh interval, which may not support multiple monthly test cycles.

---

**Q3:** A developer wants to deploy a new feature to production users gradually — starting with only internal admins — without creating separate code deployments for each phase. Which Salesforce feature best supports this approach?
- A) Managed Package with a beta version for admin users
- B) A Hierarchy Custom Setting used as a feature flag, with the org default set to OFF and the Admin profile override set to ON
- C) A separate Lightning App visible only to admins with the new feature's components
- D) A Change Set deployed only to admin users via profile-specific deployment

**Answer:** B — Hierarchy Custom Settings with a feature flag pattern is exactly designed for this use case. Set the org default to OFF (feature disabled for everyone), then set a profile-level override to ON for the Admin profile. Apex or Flow reads the custom setting value at runtime and shows or hides the feature accordingly. No additional deployment is needed to later extend access to more users or profiles.
