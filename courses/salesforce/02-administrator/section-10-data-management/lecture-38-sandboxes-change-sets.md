# L38: Sandboxes & Change Sets

## 🎯 Learning Objectives
- Identify the four sandbox types and their storage, data, and refresh characteristics
- Understand sandbox refresh intervals and the impact of refreshing
- Create and deploy a change set (outbound and inbound)
- Identify which metadata components can be included in change sets
- Understand change set limitations (dependencies, no automatic inclusion)
- Describe a basic release management workflow using sandboxes and change sets

## 📊 SLIDES

### Slide 1: What Are Sandboxes?
**Visual:**
```
                    ┌─────────────────────────┐
                    │      PRODUCTION         │
                    │   (live org — users)    │
                    └────────────┬────────────┘
             Refresh ◀───────────┤───────────▶ Refresh
           (copy from prod)      │           (copy from prod)
       ┌────────────────┬────────┴────────┬────────────────┐
       ▼                ▼                 ▼                ▼
  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐
  │Developer │  │Developer Pro │  │   Partial    │  │   Full   │
  │ Sandbox  │  │   Sandbox    │  │   Sandbox    │  │ Sandbox  │
  │  200 MB  │  │    1 GB      │  │    5 GB      │  │ = Prod   │
  │ No data  │  │   No data    │  │ Sample data  │  │ All data │
  └──────────┘  └──────────────┘  └──────────────┘  └──────────┘

  All sandboxes: isolated from Production
  URL format: https://[sandbox-name].sandbox.my.salesforce.com
```
**Content:**
- A **sandbox** is a copy of your Salesforce org used for development, testing, and training
- Sandboxes are isolated from Production — changes in sandbox don't affect live users
- **Types of sandboxes:** Developer, Developer Pro, Partial, Full
- All sandboxes include a copy of the org's **metadata** (configuration: objects, fields, page layouts, etc.)
- Sandboxes differ in how much **data** (records) they include and storage capacity
- **Sandbox URL:** `https://[sandbox-name].sandbox.my.salesforce.com`
- Access: Setup → Sandboxes
**Speaker Notes:** Sandboxes are fundamental to professional Salesforce development. No admin should make significant changes directly in Production — always test in a sandbox first. The key differentiator between sandbox types is data: Developer sandboxes have no data, Full sandboxes have all your production data. This affects both the testing fidelity you can achieve and the cost/size of the sandbox.

### Slide 2: Developer and Developer Pro Sandboxes
**Visual:**
```
  ┌────────────────────────────────┬────────────────────────────────┐
  │  DEVELOPER SANDBOX             │  DEVELOPER PRO SANDBOX         │
  ├────────────────────────────────┼────────────────────────────────┤
  │  Storage:   200 MB             │  Storage:   1 GB               │
  │  Data:      None (metadata     │  Data:      None (metadata     │
  │             only)              │             only)              │
  │  Refresh:   Every 1 day        │  Refresh:   Every 1 day        │
  │  Quantity:  Multiple per org   │  Quantity:  Multiple per org   │
  ├────────────────────────────────┼────────────────────────────────┤
  │  Use for:                      │  Use for:                      │
  │  • Individual feature dev      │  • Larger dev projects         │
  │  • Admin config testing        │  • More test data storage      │
  │  • Unit testing                │  • Functionally same as Dev    │
  │  • Day-to-day admin work       │    but more space              │
  └────────────────────────────────┴────────────────────────────────┘
  Both: no sensitive production data — safe for developer access
        daily refresh keeps metadata fresh from production
```
**Content:**
- **Developer Sandbox:**
  - **Storage:** 200 MB total (data + files)
  - **Data:** No production data — empty records (only metadata copied)
  - **Refresh interval:** Can be refreshed every **1 day**
  - **Use case:** Individual developer/admin building and testing new features
  - **Quantity:** Varies by edition; Enterprise gets several; Unlimited gets more
- **Developer Pro Sandbox:**
  - **Storage:** 1 GB total
  - **Data:** No production data
  - **Refresh interval:** Every **1 day**
  - **Use case:** Larger development projects needing more storage; or storing more test data
  - Functionally similar to Developer sandbox; just more space
**Speaker Notes:** Developer sandboxes are the most commonly used sandbox type. Every Salesforce org comes with at least one (Enterprise edition includes more). Because they have no production data, they're safe to use without concerns about exposing sensitive customer information. The daily refresh means you can refresh quickly to get a fresh copy of production metadata. The small storage means they can't hold much data, but admins typically create sample data manually or via Data Loader for testing.

### Slide 3: Partial and Full Sandboxes
**Visual:**
```
  ┌────────────────────────────────┬────────────────────────────────┐
  │  PARTIAL COPY SANDBOX          │  FULL SANDBOX                  │
  ├────────────────────────────────┼────────────────────────────────┤
  │  Storage:   5 GB               │  Storage:   Same as Production │
  │  Data:      Sample data        │  Data:      Complete copy of   │
  │             (template-based    │             ALL production data │
  │              selected objects) │                                │
  │  Refresh:   Every 5 days       │  Refresh:   Every 29 days      │
  ├────────────────────────────────┼────────────────────────────────┤
  │  Use for:                      │  Use for:                      │
  │  • Integration testing         │  • Performance testing         │
  │  • UAT with realistic data     │  • Final pre-release testing   │
  │  • QA testing                  │  • Exact production replica    │
  │                                │  • Data integrity validation   │
  ├────────────────────────────────┼────────────────────────────────┤
  │  Requires Sandbox Template     │  Most expensive sandbox type   │
  │  defining objects to copy      │  Slowest to refresh (29 days)  │
  └────────────────────────────────┴────────────────────────────────┘
```
**Content:**
- **Partial Copy Sandbox:**
  - **Storage:** 5 GB
  - **Data:** A template-based sample of production data (you define which objects and how many records)
  - **Refresh interval:** Every **5 days**
  - **Use case:** Integration testing, UAT (user acceptance testing) with realistic data
  - **Sandbox Template:** Required — defines which objects and record sample to copy
- **Full Sandbox:**
  - **Storage:** Same as Production
  - **Data:** Complete copy of ALL production data
  - **Refresh interval:** Every **29 days**
  - **Use case:** Performance testing, final pre-release testing, exact replication of production
  - Most expensive sandbox type; slowest to refresh
**Speaker Notes:** Full sandboxes are the closest you can get to a production environment for testing. Because they contain all production data, they're subject to strict access controls — you should mask sensitive data in a Full sandbox before giving developers access. The 29-day refresh interval means you can't refresh frequently; plan your testing windows carefully. Partial sandboxes are the sweet spot: enough real data for meaningful testing, faster refresh, and less storage required.

### Slide 4: Sandbox Refresh Process
**Visual:**
```
  Admin clicks "Refresh" on sandbox

          │
          ▼
  ┌───────────────────────────────────────┐
  │  Sandbox enters maintenance mode      │
  │  (temporarily unavailable)           │
  └───────────────────────────────────────┘
          │
          ▼
  ┌───────────────────────────────────────┐
  │  Salesforce copies from Production    │
  │  Metadata (always) + Data (by type)  │
  └───────────────────────────────────────┘
          │
          ▼
  ┌───────────────────────────────────────┐
  │  Sandbox restored — fresh copy        │
  │  Users re-login with sandbox creds    │
  └───────────────────────────────────────┘

  ⚠ ALL existing sandbox content is DELETED — no recovery
  ⚠ Any work done since last refresh is permanently lost
  ✓ Sandbox URL and ID remain the same
  ✓ Refresh intervals: Dev=1 day │ Dev Pro=1 day │ Partial=5 days │ Full=29 days
```
**Content:**
- **Refreshing** a sandbox creates a new copy from Production (metadata and data based on type)
- **Impact of refreshing:**
  - All existing sandbox data and configuration is **DELETED** — replaced by the new copy
  - Any changes made in the sandbox since last refresh are **lost**
  - Sandbox URL and sandbox ID remain the same
- **Before refreshing:** Export/backup any sandbox-specific work you want to keep
- **Refresh waiting period:** Must wait the full interval before refreshing again
  - Developer: 1 day, Developer Pro: 1 day, Partial: 5 days, Full: 29 days
- **Post-refresh:** Sandbox is a fresh copy; users may need to re-login with sandbox credentials
**Speaker Notes:** Refresh is both powerful and potentially destructive. If you've been building in a sandbox for months and refresh it, you lose all that work. Always commit your work to a version control system or a change set before refreshing. The refresh interval is a minimum wait — you can refresh anytime after the interval, not just exactly at the interval. After a full sandbox refresh, the sandbox URL changes from sandbox.my.salesforce.com to reflect the new version.

### Slide 5: What Are Change Sets?
**Visual:**
```
  SANDBOX (Development)              PRODUCTION
  ─────────────────────              ──────────
  Build & configure                  Live org
        │
        │ 1. Create Change Set
        │    (add components)
        ▼
  CHANGE SET (outbound)
        │
        │ 2. Upload to target
        │    via Deployment Connection
        ▼
  CHANGE SET (inbound)  ──▶  3. Validate & Deploy
        │
        ▼
  PRODUCTION (deployed)

  OR: Salesforce CLI (sf project deploy) for DevOps pipelines

  Change sets move METADATA only — never data records
```
**Content:**
- **Change Sets** are a mechanism to deploy metadata (configuration) between Salesforce orgs
- Deploy: Sandbox → Production, Sandbox → Sandbox, or Production → Sandbox
- Two components:
  - **Outbound Change Set:** Built in the SOURCE org; contains the metadata components you want to deploy
  - **Inbound Change Set:** What appears in the TARGET org; received from the source; must be deployed
- **Deployment Connections:** Must be configured between orgs to allow change set deployments
  - Setup → Deployment Settings → configure which orgs can deploy to/from each other
- Change sets move METADATA — not data (records)
**Speaker Notes:** Change sets are the point-and-click deployment mechanism for Salesforce admins. Unlike the Salesforce CLI which requires code knowledge, change sets work in the Setup UI. The outbound change set is like packing a box in the source org. The deployment connection is like the shipping lane between orgs. The inbound change set is the received package in the target org. You still need to "open the box" by running the deployment. Change sets only carry metadata — they never move actual data records.

### Slide 6: Building an Outbound Change Set
**Visual:**
```
  Setup → Outbound Change Sets → New

  ┌──────────────────────────────────────────────────────────────┐
  │  Change Set Name: [Q3 Release — Discount Fields            ] │
  │  Description:     [Adds Discount_Rate__c field + validation] │
  ├──────────────────────────────────────────────────────────────┤
  │  Components Added:                                           │
  │  ┌────────────────────┬────────────────┬────────────────┐   │
  │  │ Type               │ Name           │ Object         │   │
  │  ├────────────────────┼────────────────┼────────────────┤   │
  │  │ Custom Object      │ Opportunity    │                │   │
  │  │ Custom Field       │ Discount_Rate__c│ Opportunity   │   │
  │  │ Page Layout        │ Opp Layout     │ Opportunity    │   │
  │  │ Validation Rule    │ Require Disc.  │ Opportunity    │   │
  │  └────────────────────┴────────────────┴────────────────┘   │
  │                                                              │
  │  [ Add Components ]  [ View/Add Dependencies ]  [ Upload ]  │
  └──────────────────────────────────────────────────────────────┘
  ⚠ Click "View/Add Dependencies" — Salesforce does NOT auto-add them
```
**Content:**
- **Create outbound change set:** Setup → Outbound Change Sets → New
- Add components:
  - **Add:** Select individual components (Custom Object, Field, Page Layout, Workflow, Flow, etc.)
  - **View/Add Dependencies:** Shows required related components; add them with one click
  - **Add Profiles:** Add profile and permission set changes to include in the deployment
- **Upload:** Send the change set to the target org via the deployment connection
- **What CAN be included:** Most metadata types — objects, fields, page layouts, validation rules, flows, profiles, etc.
- **What CANNOT be included:** Some components like Standard Fields (can't move them), Record Types with certain settings
**Speaker Notes:** Building a change set is straightforward, but the Dependencies button is crucial. Salesforce does NOT automatically include dependent components. If you add a custom field to a change set, you must also manually add the custom object it belongs to, the page layout it's on, and any validation rules that reference it. Forgetting dependencies is the most common cause of change set deployment failures. Always click "View/Add Dependencies" and review the list carefully before uploading.

### Slide 7: Change Set Limitations
**Visual:**
```
  Change Set Limitations

  ┌────┬──────────────────────────────────────────────────────────┐
  │ ✗  │ No automatic dependency inclusion                        │
  │    │ → Must manually add ALL dependent components             │
  │    │   or deployment will fail                                │
  ├────┼──────────────────────────────────────────────────────────┤
  │ ✗  │ No rollback                                              │
  │    │ → Once deployed, must manually reverse changes           │
  ├────┼──────────────────────────────────────────────────────────┤
  │ ✗  │ No version control                                       │
  │    │ → Does not integrate with Git or source control          │
  ├────┼──────────────────────────────────────────────────────────┤
  │ ✗  │ Limited component types                                  │
  │    │ → Some components require Salesforce CLI / scratch orgs  │
  ├────┼──────────────────────────────────────────────────────────┤
  │ ✗  │ Sequential only                                          │
  │    │ → Cannot run multiple deployments simultaneously         │
  ├────┼──────────────────────────────────────────────────────────┤
  │ ✗  │ No automated CI/CD pipeline                              │
  │    │ → Use Salesforce CLI or DevOps Center for automation     │
  └────┴──────────────────────────────────────────────────────────┘
  Appropriate for: small orgs, config-only deployments
  Consider Salesforce CLI/DevOps Center for: large teams, CI/CD
```
**Content:**
- **No automatic dependency inclusion:** You must manually add ALL dependent components
  - Missing a dependency = deployment failure in target org
- **No rollback:** Once deployed, you cannot "un-deploy" a change set; must manually reverse changes
- **No version control:** Change sets don't integrate with Git or other version control systems
- **Limited component types:** Some components cannot be moved via change sets (e.g., some Lightning components require scratch orgs/Salesforce CLI)
- **Sequential only:** Cannot run multiple change set deployments simultaneously in the same target org
- **Manual process:** No automated CI/CD pipeline integration (use Salesforce CLI/DevOps Center for that)
- **Performance:** Large change sets with many components can take significant time to validate and deploy
**Speaker Notes:** Change sets are appropriate for smaller organizations or for admins doing configuration-only deployments. For large development teams, CI/CD pipelines, or complex projects with many developers, Salesforce recommends the Salesforce CLI with metadata API or the Salesforce DevOps Center. But for the admin exam, change sets are the expected deployment mechanism to know. Understanding their limitations helps you advise clients on when to consider more advanced deployment tools.

### Slide 8: Release Management Workflow
**Visual:**
```
  DEVELOPER         PARTIAL / UAT         PRODUCTION
  SANDBOX           SANDBOX               ──────────
  ──────────        ───────────────
  Build &           Business users test   Live org
  unit test         with realistic data
      │                   │                   │
      │  1. Change Set     │  2. Change Set    │
      │  ─────────────▶    │  ────────────▶    │
      │                   │                   │
      │  Validate first    │  Validate first   │
      │  then deploy       │  then deploy      │

  Best Practices:
  ┌──────────────────────────────────────────────────────────────┐
  │  ✓ Never build directly in Production                        │
  │  ✓ Validate change set BEFORE deploying (catches errors)     │
  │  ✓ Deploy during low-traffic windows (weekends / off-hours)  │
  │  ✓ Maintain a deployment checklist                           │
  │  ✓ Refresh sandboxes regularly to stay in sync with Prod     │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Typical Release Pipeline:**
  1. **Developer Sandbox:** Build and unit test new features
  2. **Partial Sandbox (UAT):** Deploy to UAT environment; business users test with realistic data
  3. **Production:** Final deployment after UAT sign-off
- **Best practices:**
  - Never build directly in Production
  - Always test in a sandbox before deploying to Production
  - Maintain a deployment checklist
  - Deploy during low-traffic periods (weekends, maintenance windows)
  - Validate change set BEFORE deploying (validate without deploying to check for errors)
- **Change Set Validation:** "Validate" option runs all deployment checks without actually deploying — catch errors first
**Speaker Notes:** The validate-before-deploy workflow is critical. Always validate your change set in the target org before actually deploying. Validation runs all the same checks as deployment (dependency checks, compilation, etc.) but doesn't apply the changes. This lets you catch errors on a Tuesday afternoon rather than during a Friday evening production deployment. If validation passes, you know the actual deployment will succeed. Many admins schedule production deployments during off-hours and pre-validate during business hours to minimize risk.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 38 — Sandboxes and Change Sets. These are the core tools for safe development and deployment in Salesforce, and they're essential knowledge for any admin.

A sandbox is a copy of your Salesforce org used for development and testing. It's isolated from Production — you can break things in a sandbox without affecting your live users. There are four sandbox types, and the key differentiator is how much data they include and how often you can refresh them.

Developer sandboxes have 200MB of storage, no production data, and can be refreshed every day. Developer Pro sandboxes are the same but with 1GB of storage. These are your everyday development and testing environments. Partial Copy sandboxes include a sample of production data (you define the template), have 5GB of storage, and refresh every 5 days. Full sandboxes are a complete copy of Production — same data volume, same everything — but they can only be refreshed every 29 days and are the most expensive sandbox type.

Refreshing a sandbox replaces all existing sandbox content with a fresh copy from Production. All sandbox-specific work is lost. So always commit your work to a change set or version control before refreshing.

Now for change sets. Change sets are Salesforce's point-and-click deployment tool for moving metadata — configuration like objects, fields, page layouts, flows, and validation rules — between orgs. They're NOT for moving data.

There are two sides to a change set. The Outbound Change Set is built in the source org — you add the components you want to deploy. You then upload it through a deployment connection to the target org, where it becomes an Inbound Change Set. In the target org, you validate and then deploy the inbound change set.

The single most important thing to know about change sets: Salesforce does NOT automatically include dependent components. If you add a custom field, you must also manually add the object it belongs to, the page layout it's on, and any other related metadata. Missing dependencies cause deployment failures.

Always validate a change set before deploying. The Validate button runs all deployment checks without actually applying the changes. This catches errors safely so you're not surprised during a production deployment.

For the exam: know the four sandbox types and their refresh intervals, what change sets move (metadata, not data), that dependencies must be added manually, and the basic sandbox-to-production deployment workflow.

## 🔔 EXAM TIPS
- **Four Sandbox Types + Refresh Intervals:** Developer = 200MB, 1 day. Developer Pro = 1GB, 1 day. Partial = 5GB, sample data, 5 days. Full = Production size, all data, 29 days.
- **Refresh Destroys Sandbox Data:** Refreshing replaces ALL existing sandbox content with a fresh production copy. No recovery.
- **Change Sets Move Metadata Only:** Change sets cannot move data records. Use Data Loader or Data Import Wizard for data.
- **Dependencies Not Auto-included:** You must manually add all dependent components or the deployment will fail.
- **Validate Before Deploy:** Always use the Validate option first to check for errors without applying changes.
- **Outbound vs. Inbound:** Outbound = built in source. Inbound = received in target. You deploy the inbound change set.
- **Deployment Connections:** Must be configured in Setup → Deployment Settings before change sets can be sent between orgs.

## ✅ LECTURE SUMMARY
- Four sandbox types: Developer (200MB, no data, refresh 1 day), Developer Pro (1GB, no data, 1 day), Partial (5GB, sample data, 5 days), Full (Production size, all data, 29 days)
- Sandbox refresh creates a fresh copy from Production and deletes all existing sandbox content
- Change sets are the point-and-click deployment tool; they move metadata (configuration), not data
- Outbound Change Set: built in source org. Inbound Change Set: received and deployed in target org
- Dependencies must be manually added to change sets — they are NOT automatically included
- Deployment connections must be configured in Setup before orgs can exchange change sets
- Always validate a change set before deploying to catch errors without applying changes
- Best practice: Developer Sandbox → Partial/UAT Sandbox → Production

## ❓ MINI QUIZ

**Q1:** A developer has been building and testing a new feature in a Developer sandbox for 3 weeks. The admin needs to refresh the sandbox to get the latest Production configuration. What happens to the developer's work?
- A) The developer's changes are merged with the Production copy during refresh
- B) The developer's changes are preserved in a separate branch and can be merged after refresh
- C) All changes made in the sandbox since the last refresh are permanently deleted when the sandbox is refreshed
- D) The developer can export the sandbox configuration as a backup that can be re-applied after refresh

**Answer:** C — Refreshing a sandbox completely replaces all existing sandbox content with a fresh copy of Production. Any work done in the sandbox since the last refresh is permanently lost. Before refreshing, developers should use change sets or the Salesforce CLI to capture and save any work they want to preserve.

**Q2:** An admin builds an outbound change set that includes a new custom field "Discount_Rate__c" on the Opportunity object, and uploads it to Production. The deployment fails with an error: "Custom object Opportunity not found in change set." What is the most likely cause?
- A) Custom standard object Opportunity cannot be included in change sets
- B) The change set was uploaded to the wrong target org
- C) The admin forgot to add the Opportunity object as a dependent component to the change set
- D) The custom field requires Apex code to deploy and cannot be moved via change sets

**Answer:** C — Change sets do NOT automatically include dependent components. When adding a custom field, the admin must also explicitly add the parent custom object (in this case, the Opportunity standard object layout). Salesforce provides a "View/Add Dependencies" button to help identify and add required dependent metadata. This is the most common cause of change set deployment failures.

**Q3:** A company wants to perform final pre-release testing of a new feature using a complete copy of all production data to validate performance and data integrity. Which sandbox type should they use?
- A) Developer Sandbox
- B) Developer Pro Sandbox
- C) Partial Copy Sandbox
- D) Full Sandbox

**Answer:** D — A Full Sandbox is the only sandbox type that contains a complete copy of ALL production data. It's specifically designed for performance testing, full data integrity validation, and final pre-release testing that requires an exact production replica. The trade-off is that it can only be refreshed every 29 days and is the most expensive sandbox type.
