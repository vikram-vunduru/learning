# L21: Change Sets & Deployment

## 🎯 Learning Objectives
- Understand the outbound/inbound change set workflow and how deployment connections between orgs are established
- Know what metadata can and cannot be included in a change set, and the difference between Validate and Deploy
- Explain change set limitations and when Salesforce DX is a better alternative

## 📊 SLIDES

### Slide 1: What Are Change Sets?
**Visual:** Diagram showing Source Org → Outbound Change Set → Upload → Inbound Change Set → Target Org, with a two-way deployment connection arrow between the orgs
**Content:**
- **Change Sets** are a point-and-click tool for moving metadata (configuration and code) between Salesforce orgs
- No coding required — entirely managed through Setup UI
- Common use case: move customizations from **Sandbox** to **Production** after testing
- Two types:
  - **Outbound Change Set** — created in the *source* org; you add components and upload
  - **Inbound Change Set** — appears in the *target* org after upload; you validate and deploy
- Before any change sets can be sent, a **Deployment Connection** must be authorized between the two orgs
**Speaker Notes:** Change sets are the primary deployment tool for Salesforce admins who don't use the Salesforce CLI or Salesforce DX. Understanding the direction of flow — outbound creates, inbound receives — is a key exam concept. It's a one-way push: you push from source to target; you cannot pull from target into source using change sets.

---

### Slide 2: Deployment Connections
**Visual:** Setup > Deployment Settings page showing two org entries with "Allow Inbound Changes" checkboxes — one checked (authorized), one not
**Content:**
- **Setup > Deployment Settings** — manage connections between your org and related orgs (sandboxes, other connected orgs)
- By default, no connections are authorized
- To send a change set from Org A to Org B:
  1. In **Org B** (the target), go to Deployment Settings
  2. Find Org A in the list and click **Edit**
  3. Check **Allow Inbound Changes** from Org A
- This is a **unidirectional authorization** — Org B is saying "I will accept change sets from Org A"
- For change sets to flow in both directions, each org must authorize the other
- Connections appear based on org hierarchy (production + its sandboxes are automatically listed)
**Speaker Notes:** A common exam trick is presenting the question as "what must be done before a change set can be uploaded?" The answer is authorizing the deployment connection in the target org — not in the source org. This surprises many people who expect to configure it from the sending side. Sandbox orgs appear in production's Deployment Settings automatically; unrelated orgs require a separate setup.

---

### Slide 3: Creating & Uploading an Outbound Change Set
**Visual:** Outbound Change Set detail page showing a Description field, a Component list with rows for custom fields and a Flow, and the Upload button
**Content:**
- **Setup → Outbound Change Sets → New**
- Add a name and description (description is important for documentation)
- **Add Components:** click Add to select metadata types and specific components
  - You can add one component at a time or use the component type picker
- **Add Profiles/Permission Sets (optional):** add profile settings related to the components
- **Add Dependencies:** Salesforce can suggest related components you may have missed (e.g., if you add a custom field, it suggests the parent object, picklist values, validation rules)
- Click **Upload** → select the target org → confirm upload
- The change set is then transmitted to the target org
**Speaker Notes:** The "Add Dependencies" step is highly recommended before uploading — it scans for metadata that your components depend on and prompts you to include them. If you skip this and deploy a component that references a missing dependency in the target, the deployment will fail. The component list must be built manually; there's no "add all changes since last deployment" feature in change sets.

---

### Slide 4: What Can (and Cannot) Be in a Change Set
**Visual:** Two-column table: CAN Include vs CANNOT Include — with icons to distinguish the lists
**Content:**
- **CAN Include:**
  - Custom Objects and custom fields
  - Page Layouts, Compact Layouts, Record Types
  - Validation Rules, Workflow Rules, Process Builder, Flows
  - Apex Classes, Apex Triggers, Visualforce Pages/Components
  - Custom Apps, Tabs, Custom Labels, Custom Settings (metadata)
  - Reports, Dashboards, Report Types
  - Profiles (partial — only settings for components in the change set)
  - Permission Sets, Assignment Rules, Queues
- **CANNOT Include:**
  - Standard objects themselves (but their custom fields and configurations can be included)
  - Users and data records (change sets are metadata only)
  - Some certificate types and certain metadata types
  - Documents stored in Files/Content (binary content)
**Speaker Notes:** The key distinction is that change sets carry *metadata* (configuration and code), not *data records*. You can deploy a custom object definition, but not the records stored in that object. Standard objects exist in every org by default, so there's no need to deploy them — only their customizations (fields, layouts, etc.) need to be deployed. Profiles are partially deployable — only the settings for components in the change set are carried over.

---

### Slide 5: Validate vs. Deploy
**Visual:** Flow diagram showing Inbound Change Set with two branches: Validate (dry run → shows errors, no changes committed) and Deploy (commits all changes to org)
**Content:**
- **Validate:**
  - A "dry run" — checks whether the change set *could* deploy successfully
  - Checks: dependencies exist, no conflicts, Apex tests run and pass
  - Does **not** commit any changes to the org
  - If validation passes, you can click **Quick Deploy** within 10 days (skips re-running tests)
- **Deploy:**
  - Commits all components to the org permanently
  - Runs Apex tests if Apex classes or triggers are included
  - Cannot be rolled back automatically — must manually revert
- **Best Practice:** Always Validate before Deploying in production
- **Apex Test Requirements for Production:** all tests must pass + 75% overall code coverage
**Speaker Notes:** Quick Deploy is a significant time-saver for large orgs where Apex test execution can take hours. Once a validation passes, you have a 10-day window to Quick Deploy without re-running tests. This is especially useful for deployments during business hours when you want to minimize the deployment window. The exam tests whether Validate commits changes — it does not.

---

### Slide 6: Deployment Dependencies & Common Failures
**Visual:** Dependency tree diagram showing a Flow referencing a Custom Field referencing a Custom Object — all three must exist in the target org
**Content:**
- **Dependency Rule:** all components that a deployed item *references* must already exist in the target org OR be in the same change set
- **Common failure scenarios:**
  - Deploying a custom field without the custom object already existing in the target
  - Deploying a Flow that references a custom field not yet in the target
  - Deploying a Page Layout that references a custom field not in the change set
  - Deploying Apex that references a class or trigger not included
- **Resolution:** use "Add Dependencies" when building the change set, or manually add missing components
- **Component conflicts:** if a component was modified directly in the target org after the change set was built, deployment may overwrite those changes — test in sandbox first
**Speaker Notes:** Dependency errors are the most common reason change set deployments fail. The "Add Dependencies" button in the outbound change set builder scans for these automatically, but it only suggests — it doesn't guarantee completeness. Always validate against the target org before deploying to production to catch dependency issues early. This is why the Sandbox → Production pipeline exists.

---

### Slide 7: Change Set Limitations
**Visual:** Warning icon list of limitations alongside a small Salesforce DX logo with "Better for Teams" caption
**Content:**
- **No rollback:** once deployed, there's no automatic undo — you must manually revert changes
- **No version control:** change sets are not tracked in Git; no history of what was deployed
- **Manual component-by-component:** you must add each component individually — no "deploy everything changed since last time"
- **No diff view:** no built-in comparison between source and target before deployment
- **Not suitable for large teams:** concurrent development in sandboxes leads to merge conflicts with no tooling support
- **Alternative: Salesforce DX (SFDX):**
  - Source-driven development with Git version control
  - CLI-based (`sf` command)
  - Scratch orgs for isolated development
  - Better for teams, CI/CD pipelines, and large projects
**Speaker Notes:** Change sets are appropriate for small teams and simple deployments, but they scale poorly. The lack of rollback is particularly risky for production — the best mitigation is thorough testing in a sandbox and using Validate before Deploy. Salesforce DX has become the preferred approach for development teams, but change sets remain relevant for admins who don't code and for point-in-time deployments. The exam acknowledges both but focuses more on change sets for the admin-level certification.

---

### Slide 8: Apex Test Requirements & Deployment to Production
**Visual:** Pie chart showing 75% code coverage requirement with sections for "Covered lines" and "Uncovered lines," plus a checklist: All tests pass, 75% coverage, No compilation errors
**Content:**
- **Deploying Apex to Production requires:**
  - At least **75% code coverage** across all Apex classes and triggers in the org (not just the deployed code)
  - **All Apex tests must pass** (0 failures allowed)
  - No compilation errors in any Apex code
- Test classes are automatically included in the deployment when their tested classes are included
- If a change set includes no Apex, tests still run if the target org has existing Apex (on production deployments)
- **Test Levels available in change sets:** Run Local Tests, Run All Tests, Run Specified Tests
- **Sandbox deployments:** do not have the 75% test requirement enforced (but tests still run)
- Apex test execution is the primary reason production deployments can take a long time
**Speaker Notes:** The 75% coverage requirement is one of the most commonly tested facts about Salesforce deployment. Note that it's 75% of the *entire org's* Apex code, not just the code being deployed — so a large org with legacy code can be a deployment bottleneck if coverage has slipped. Always maintain test coverage as you develop, not as an afterthought before deployment. Production deployments also run tests even if no Apex is in the change set.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 21 on Change Sets and Deployment. This is one of the most practical topics for an admin, and it's tested directly on the CRT-403 exam.

Let's start with the big picture. Change sets are Salesforce's built-in tool for moving customizations — metadata — from one org to another. Think of the typical workflow: you build and test something in a sandbox, and when it's ready, you use a change set to push it to production. No coding required.

The workflow has two sides. In the source org — usually your sandbox — you create an Outbound Change Set. You add the components you want to move: custom fields, page layouts, flows, validation rules, whatever you've built. Then you upload it. In the target org — usually production — that upload appears as an Inbound Change Set. You then validate it first as a dry run, and when you're confident, you deploy it.

But before any of this can happen, the two orgs need to be connected. Go to Setup in the target org — the one that will receive the change set — and navigate to Deployment Settings. Find the source org in the list and check "Allow Inbound Changes." This is a unidirectional authorization. The target org is giving permission to receive from the source. This is a common exam gotcha: the connection is authorized in the target, not the source.

Now, what can you actually put in a change set? Custom objects, fields, page layouts, validation rules, flows, Apex classes, reports, dashboards, permission sets — the list is long. What you cannot include: data records, users, and standard object definitions. Change sets are metadata only. You're moving the configuration, not the data.

The Validate versus Deploy distinction is critical. Validation is a dry run. It checks dependencies, compiles Apex code, runs your test classes, and reports any failures — but it commits nothing to the org. If validation passes, you have ten days to Quick Deploy, which skips re-running all the tests. This is a huge time saver in production orgs with thousands of test methods.

Speaking of tests — deploying Apex to production requires 75% code coverage across the entire org and all tests must pass. No exceptions. This is one of the most frequently tested facts in the entire exam. Sandbox deployments don't enforce the 75% threshold, but the tests still run.

Change sets have real limitations. No rollback — once you deploy, you're committed. No version control. You add components one by one, so it's easy to miss dependencies. If you deploy a custom field without the parent object also being in the change set or already existing in the target, the deployment fails. Always use the "Add Dependencies" option to catch these gaps.

For large development teams, Salesforce DX — source-driven development with Git and the CLI — is a much better solution. But for administrators doing point-and-click work, change sets remain the practical standard. Know both for the exam, but expect most change set questions at the admin/app builder level.

## 🔔 EXAM TIPS
- **Deployment Connection Direction:** Connections are authorized in the TARGET org (the receiver), not the source org. This is the most common trick question in this area.
- **Outbound = Source, Inbound = Target:** The outbound change set is created and uploaded from the source; the inbound change set appears in and is deployed from the target.
- **Validate = No Changes Committed:** Validation is purely a dry run. It runs Apex tests and checks dependencies but does not modify the org.
- **Quick Deploy:** After a successful validation, you have 10 days to Quick Deploy without re-running tests. Only available if validation passed.
- **75% Apex Coverage:** Required for ANY deployment to production that includes Apex code. Applies to overall org coverage, not just the deployed code.
- **No Rollback:** Change sets have no rollback mechanism. The mitigation is thorough testing in sandboxes and validating before deploying.
- **Cannot Deploy Data Records:** Change sets are metadata only. You cannot deploy users, records, or standard object definitions.
- **Profiles in Change Sets:** Profiles are partially deployable — only the profile settings relevant to the components in the change set are carried over.

## ✅ LECTURE SUMMARY
- Change sets are the point-and-click deployment tool for moving metadata between Salesforce orgs — no coding required
- Deployment connections must be authorized in the TARGET org (Setup > Deployment Settings) before any change sets can be received
- Outbound Change Sets are created in the source org; Inbound Change Sets appear in the target org after upload
- Validate = dry run (no changes committed); Deploy = permanent commit; Quick Deploy skips re-running tests for 10 days after a passing validation
- Change sets can include custom objects/fields, flows, Apex, page layouts, reports — but NOT data records, users, or standard object definitions
- Deploying Apex to production requires 75% code coverage org-wide and all Apex tests must pass
- Change set limitations: no rollback, no version control, manual component addition — Salesforce DX is the modern alternative for development teams

## ❓ MINI QUIZ

**Q1:** Before a developer can upload an outbound change set from the Development sandbox to Production, what must first be configured?
- A) An outbound change set must be created in Production
- B) The deployment connection must be authorized in Production to allow inbound changes from the sandbox
- C) The developer must install the Salesforce CLI on their machine
- D) The sandbox must be refreshed to ensure it matches Production

**Answer:** B — Deployment connections are authorized in the target org (Production, in this case). In Production's Deployment Settings, the admin must allow inbound changes from the Development sandbox. The outbound change set itself is created in the sandbox, not in Production.

---

**Q2:** An admin clicks "Validate" on an inbound change set in Production and all checks pass. What has changed in Production as a result?
- A) All components in the change set have been deployed to Production
- B) The change set has been archived and can no longer be deployed
- C) Nothing has been committed — Validate is a dry run only
- D) Apex tests have been permanently added to the org's test suite

**Answer:** C — Validate is a dry run. It checks dependencies, compiles Apex, and runs tests, but commits nothing to the org. After a passing validation, the admin can perform a Quick Deploy within 10 days to commit the changes without re-running tests.

---

**Q3:** A developer is deploying Apex classes to Production via a change set. The deployment fails with an error about insufficient code coverage. What is the minimum coverage threshold required?
- A) 50% of the deployed Apex classes
- B) 75% of all Apex code in the target org
- C) 80% of the Apex code in the change set
- D) 100% of triggers included in the change set

**Answer:** B — Salesforce requires at least 75% code coverage across all Apex classes and triggers in the entire Production org (not just the code being deployed). All Apex tests in the org must also pass with zero failures.
