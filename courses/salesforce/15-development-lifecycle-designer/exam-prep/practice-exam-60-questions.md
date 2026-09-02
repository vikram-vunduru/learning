# CRT-406: Development Lifecycle & Deployment Designer
## Practice Exam — 50 Scenario-Based Questions

**Exam Blueprint Distribution:**
- Application Lifecycle Management (23%) — Questions 1–12
- Environment Management (22%) — Questions 13–23
- Release Management (20%) — Questions 24–33
- Source Control (18%) — Questions 34–42
- Testing & QA (17%) — Questions 43–50

---

## Domain 1: Application Lifecycle Management (23%)

---

**Question 1**
Three development teams at a large enterprise are working on separate features simultaneously. Each team deploys changes to the shared UAT sandbox and frequently overwrites each other's work, causing deployment failures. What should the architect recommend to eliminate this contention?

A. Assign each team a dedicated Partial Copy sandbox and promote changes via change sets in sequence
B. Require all teams to work in production and use workflow rules to gate changes
C. Implement Salesforce DX with scratch orgs per feature, Git feature branches, and a CI/CD pipeline that validates before merging
D. Create one additional sandbox and rotate team access on a weekly schedule

**Answer: C**
**Explanation:** Scratch orgs provide complete, disposable isolation per feature or developer, eliminating shared-state contention entirely. Git feature branches with CI/CD enforce integration quality before changes reach any shared environment. This is the textbook org-based-to-source-driven migration that the CRT-406 exam tests heavily.

**Why the others are wrong:**
- A: Partial Copy sandboxes are still shared environments — they reduce data noise but do not eliminate metadata conflict between teams
- B: Developing directly in production is never acceptable ALM practice and violates change management fundamentals
- D: Rotating sandbox access serializes work, reducing throughput without solving the root cause of contention

---

**Question 2**
A company currently uses an org-based development model with change sets and wants to move to a source-driven model. Which prerequisite must be in place before the migration begins?

A. All sandboxes must be refreshed to Full Copy type
B. A version control system (VCS) must be adopted and all current org metadata must be retrieved and committed as a baseline
C. Managed packages must be converted to unlocked packages first
D. The production org must be on a release track that supports API version 50.0 or higher

**Answer: B**
**Explanation:** The single mandatory prerequisite for source-driven development is that source of truth moves to version control. Without a baseline commit representing the current state of production, there is no reliable starting point for tracking and deploying changes. The org-to-VCS migration begins with a full metadata retrieval committed to the repo.

**Why the others are wrong:**
- A: Sandbox type is irrelevant to adopting source-driven development; scratch orgs replace the need for many sandbox types
- C: Package type migration is independent of ALM model migration and is not a prerequisite
- D: No specific API version is a gating requirement for adopting source-driven development

---

**Question 3**
A Salesforce DX project structure is being reviewed. A developer asks where to place metadata that applies to scratch orgs used during development but should never be deployed to production. Where should this metadata reside?

A. In the `force-app/main/default` source directory
B. In the `.forceignore` file as an exclusion entry
C. In a separate source directory referenced only in the scratch org definition file or a development-only package directory, excluded from production deployment scripts
D. In a custom metadata type record flagged with an `IsDev` field

**Answer: C**
**Explanation:** A DX project can define multiple package directories in `sfdx-project.json`. Development-only metadata (seed data scripts, test configuration apps) belongs in a directory that CI/CD pipelines deliberately exclude when deploying to production. This keeps the production pipeline clean without removing the metadata from version control.

**Why the others are wrong:**
- B: `.forceignore` controls what the CLI retrieves or deploys from a specific directory; it does not organize metadata ownership semantically
- A: Placing dev-only metadata in the primary source directory creates deployment risk if pipeline scripts are not carefully maintained
- D: Custom metadata types are runtime config objects, not a mechanism for controlling deployment inclusion

---

**Question 4**
An architect is evaluating ALM methodologies. The business has quarterly release windows, strict change-approval processes, and an auditing requirement that every production change be traceable to an approved work item. Which ALM approach best fits these constraints?

A. Trunk-based development with continuous deployment to production
B. Gitflow with environment-gated promotion (Dev → QA → Staging → Prod), change sets for final deployment, and Jira/ADO linking for traceability
C. Scratch org development with daily merges directly to the main branch
D. A single sandbox with manual delta deployments performed by developers

**Answer: B**
**Explanation:** Gitflow's structured branching (feature → develop → release → main) maps naturally to gated promotion pipelines and audit trails. Linking branches and pull requests to work items in a tracker satisfies the traceability requirement, and environment-gated promotion enforces the change-approval process before each stage.

**Why the others are wrong:**
- A: Trunk-based continuous deployment prioritizes speed over gates; it conflicts with quarterly change windows and manual approval processes
- C: Daily merges to main without gates bypass the approval workflow the business requires
- D: Manual delta deployments are error-prone, non-auditable, and do not scale across teams

---

**Question 5**
A company is starting a net-new Salesforce implementation. There are five developers, two admins, a QA engineer, and a release manager. Which environment strategy aligns with Salesforce-recommended ALM best practices for a source-driven team of this size?

A. One Developer sandbox per developer, one QA sandbox, one UAT sandbox, one staging sandbox, production
B. Scratch orgs for all developers and features, one integration sandbox refreshed from production, one UAT sandbox, staging, production
C. One shared Developer Pro sandbox for all developers and one Full Copy sandbox for UAT
D. Scratch orgs for developers; no sandboxes needed beyond production

**Answer: B**
**Explanation:** Salesforce's recommended source-driven pipeline uses disposable scratch orgs for development, an integration sandbox to validate combined changes against a near-production metadata baseline, and UAT/staging sandboxes for business validation before production. This provides isolation, integration validation, and stakeholder testing without a sandbox per developer.

**Why the others are wrong:**
- A: Org-based per-developer sandboxes reintroduce shared-state promotion problems and are the legacy model the question is moving away from
- C: A single shared Developer Pro sandbox defeats isolation; a Full Copy sandbox for UAT is appropriate but the dev model is insufficient
- D: Eliminating all integration and UAT environments removes critical validation gates and is not recommended

---

**Question 6**
During a project retrospective, developers report that they are spending more time resolving merge conflicts in Apex classes than writing code. The team uses a shared Developer sandbox and exports changes via change sets. What is the most impactful recommendation?

A. Increase the number of change set outbound sets per sprint to reduce batch size
B. Adopt source-driven development with feature branches and enforce a pull-request review process before merging
C. Require all developers to lock Apex classes before editing them in the shared sandbox
D. Move all Apex development to anonymous Apex execution to avoid metadata conflicts

**Answer: B**
**Explanation:** Merge conflicts in this scenario stem from multiple developers modifying the same metadata in the same org without visibility into each other's work. Feature branches in a VCS surface conflicts at code-review time with diff tools, rather than at deployment time with no context. PRs with required reviews further reduce integration surprises.

**Why the others are wrong:**
- A: Smaller change sets reduce batch risk but do not solve concurrent editing of the same file in a shared org
- C: Manually locking files is an unscalable, non-enforced convention that serializes development
- D: Anonymous Apex is for one-off data scripts, not for building production application logic

---

**Question 7**
An organization uses a managed package to deliver its product to customers. A customer requests a customization that requires modifying a class inside the managed package. What should the architect advise?

A. The customer can edit the class directly in their subscriber org using Setup
B. The customer should raise an enhancement request; managed package code cannot be modified in subscriber orgs
C. The customer should uninstall the managed package and rebuild the feature natively
D. The customer can override the class by creating an Apex class with the same name in their org

**Answer: B**
**Explanation:** Managed package code is protected — Apex classes, triggers, and most metadata components are locked from editing in subscriber orgs. The correct path is to engage the ISV/package developer for an enhancement, or use the package's published extension points (virtual classes, interfaces, custom metadata) if they exist.

**Why the others are wrong:**
- A: Managed package Apex is read-only in subscriber orgs by design; Setup does not expose an edit option
- C: Uninstalling and rebuilding natively eliminates upgrade benefits, support, and the original investment in the package
- D: Apex class names are namespaced; a class with the same local name does not override a namespaced managed class

---

**Question 8**
A team is deciding between unlocked packages and managed packages for an internal Salesforce platform shared across three business units. The platform team wants to maintain components centrally but allow individual business units to customize configurations. Which packaging approach is most appropriate?

A. Managed packages, because they protect intellectual property and enforce namespace isolation
B. Unlocked packages, because subscriber orgs can edit package components and the team can use package dependencies for modular delivery
C. Unmanaged packages, because they allow full metadata export and reimport without version tracking
D. Change sets, because they are simpler to maintain for internal audiences

**Answer: B**
**Explanation:** Unlocked packages are designed for internal platform delivery. Unlike managed packages, subscribers can edit unlocked package components directly in their org, enabling business unit customization. Package dependencies in `sfdx-project.json` model the platform's modularity, and version pinning controls upgrade cadence per business unit.

**Why the others are wrong:**
- A: Managed packages lock subscriber org editing, which directly conflicts with the requirement for business-unit customization
- C: Unmanaged packages have no version tracking, no dependency management, and no upgrade path — they are one-time snapshots
- D: Change sets have no concept of versioning, dependencies, or install/upgrade lifecycle management

---

**Question 9**
A release manager is building an ALM process for an org with a large existing metadata footprint. She discovers that a `retrieve` of all metadata from production takes 45 minutes and includes metadata that cannot be source-tracked (e.g., some standard objects). What is the recommended approach?

A. Retrieve only the metadata types the team actively develops and commit only that subset to version control
B. Retrieve everything including untrackable metadata and commit it all, refreshing weekly
C. Abandon source-driven development because the org is too complex
D. Use change sets only for metadata types that cannot be source-tracked and Git for the rest

**Answer: A**
**Explanation:** It is standard practice to scope the VCS to the metadata types the team owns and actively changes. Metadata types that cannot be meaningfully source-tracked (e.g., certain UI-generated configurations) are documented as exceptions. Attempting to version-control the entire org including untrackable types creates noise, false conflicts, and bloated repositories.

**Why the others are wrong:**
- B: Committing untrackable metadata weekly creates unreliable diffs and false merge conflicts without adding safety
- C: Org complexity does not preclude source-driven development; scoping is the standard mitigation
- D: Mixing deployment mechanisms for the same release is error-prone and undermines a single pipeline

---

**Question 10**
Which statement correctly describes the difference between org-based development and source-driven development?

A. Org-based development requires Salesforce DX, while source-driven development uses only change sets
B. In org-based development, the org is the system of record; in source-driven development, version control is the system of record and the org is a deployment target
C. Source-driven development can only be used for scratch orgs, not for sandbox or production deployments
D. Org-based and source-driven development are equivalent when change sets are replaced with the Metadata API

**Answer: B**
**Explanation:** The fundamental distinction is where truth lives. In org-based development, what is in the org defines the current state — change sets and manual configuration are the primary delivery mechanism. In source-driven development, the Git repository defines current state; the org is merely a runtime environment that should always reflect what is in VCS.

**Why the others are wrong:**
- A: This reverses the reality — DX tools support source-driven development, and change sets are the org-based mechanism
- C: Source-driven development deploys to sandboxes and production using the Metadata API or packaging, not just scratch orgs
- D: Swapping the deployment tool does not change whether the org or VCS is the system of record

---

**Question 11**
A project is in the planning phase. The architect must decide when to introduce a CI/CD pipeline. Which answer reflects the recommended timing?

A. After the project goes live, once the team has learned the codebase
B. As late as possible to avoid slowing down initial delivery velocity
C. From the very beginning of the project, so every commit is validated automatically throughout development
D. Only when the team size grows beyond ten developers

**Answer: C**
**Explanation:** Introducing CI/CD from day one means every commit is validated against a consistent baseline, defects are found immediately while context is fresh, and the pipeline becomes a standard part of developer workflow rather than a disruptive change imposed later. Retrofitting CI/CD into a mature org with technical debt is significantly more expensive.

**Why the others are wrong:**
- B: Delaying pipeline setup accumulates unchecked technical debt and makes the eventual implementation far more costly
- A: Post-go-live CI/CD introduction means months of unvalidated commits that may mask real defects
- D: Team size is not the trigger for CI/CD — code quality risk exists even with a single developer

---

**Question 12**
An organization's release process includes: development in scratch orgs, merging to `develop` branch, deploying `develop` to integration sandbox, merging to `release` branch, deploying to UAT, and finally merging to `main` for production. A critical hotfix is required. Which branching action is correct?

A. Branch from `develop`, fix, and promote through the full pipeline
B. Branch from `main`, apply the fix, deploy directly to production, then back-merge to `develop`
C. Apply the fix directly in the production org, then retrieve and commit afterward
D. Branch from the `release` branch, fix, and wait for the next scheduled release window

**Answer: B**
**Explanation:** Hotfix branches derive from `main` (or equivalent production-tagged commit) so the fix contains only the critical change without incorporating unreleased `develop` work. After deploying to production and verifying, the hotfix branch is back-merged to both `main` and `develop` to keep branches synchronized.

**Why the others are wrong:**
- A: Branching from `develop` bundles unvalidated in-progress work into the hotfix, potentially shipping incomplete features
- C: Applying changes directly to production bypasses all testing and version control, creating a state divergence between prod and VCS
- D: Waiting for the next release window is unacceptable for a critical hotfix by definition

---

## Domain 2: Environment Management (22%)

---

**Question 13**
A developer needs an environment to develop and unit-test a new Apex trigger. The trigger does not require representative production data. The developer needs the environment available for three weeks. Which sandbox type is the minimum appropriate choice?

A. Full Copy sandbox
B. Partial Copy sandbox
C. Developer sandbox
D. Developer Pro sandbox

**Answer: C**
**Explanation:** A Developer sandbox provides a full metadata copy of production (no data) and supports Apex development and unit testing completely. For a single developer on a self-contained trigger with no data dependency, the 200MB storage limit of a Developer sandbox is sufficient. Using a larger sandbox type wastes capacity unnecessarily.

**Why the others are wrong:**
- A: A Full Copy sandbox copies all production data and has a 29-day minimum refresh cycle; it is disproportionate for unit testing with no data requirement
- B: A Partial Copy sandbox copies a subset of data and has a 5-day refresh cycle; it is more than needed for a data-independent unit test scenario
- D: Developer Pro (1GB storage) is appropriate when more storage is needed, but is not the minimum choice for this scenario

---

**Question 14**
A QA team needs an environment that contains a representative sample of production records for integration testing. They do not need all production data, just enough to exercise realistic data volumes and relationships. Which sandbox type should be provisioned?

A. Developer sandbox
B. Developer Pro sandbox
C. Partial Copy sandbox
D. Full Copy sandbox

**Answer: C**
**Explanation:** Partial Copy sandboxes include a template-driven sample of production data — Salesforce copies approximately 5–10% of each selected object's records. This provides realistic relational data for integration testing without the storage cost and 29-day refresh cycle of a Full Copy sandbox.

**Why the others are wrong:**
- A: Developer sandboxes contain no production data at all, making them unsuitable for data-dependent integration testing
- B: Developer Pro sandboxes also contain no production data; the larger storage is for metadata-heavy development, not data sampling
- D: A Full Copy sandbox is correct for full data volume performance testing but is disproportionate for representative sampling

---

**Question 15**
A team is planning its sandbox refresh schedule. They have a Full Copy sandbox used for UAT. Production was updated with a critical configuration change. When is the earliest the Full Copy sandbox can be refreshed to include this change?

A. Immediately, because sandboxes can be refreshed at any time
B. After 29 days from the last refresh
C. After 7 days from the last refresh
D. After 5 days from the last refresh

**Answer: B**
**Explanation:** Full Copy sandboxes have a mandatory 29-day refresh interval enforced by Salesforce. If a Full Copy sandbox was refreshed recently, teams must wait for this cooling period before refreshing again, regardless of urgency. This is a key constraint that ALM architects must plan around.

**Why the others are wrong:**
- A: Salesforce enforces minimum refresh intervals for all sandbox types; Full Copy cannot be refreshed at will
- C: The 7-day interval applies to Partial Copy sandboxes, not Full Copy
- D: The 5-day interval applies to Partial Copy sandboxes as well (some sources cite both 5 and 7 days depending on context)

---

**Question 16**
A company discovers that their Partial Copy sandbox, refreshed two days ago, is missing critical records needed for a demonstration tomorrow. What is the correct action?

A. Refresh the Partial Copy sandbox again immediately
B. Manually enter the missing records directly into the Partial Copy sandbox
C. Request a Full Copy sandbox refresh to get all production data
D. Refresh a Developer sandbox and promote the Partial Copy to Full Copy

**Answer: B**
**Explanation:** Partial Copy sandboxes have a refresh interval of approximately 5–7 days. Since the sandbox was refreshed two days ago, a refresh is not yet available. The appropriate workaround is to manually create or import the missing records into the existing sandbox for the demonstration.

**Why the others are wrong:**
- A: Salesforce enforces the refresh interval; attempting to refresh before the minimum period will be blocked
- C: A Full Copy sandbox refresh is a separate licensed resource and has its own 29-day cycle; it cannot be triggered on demand for another sandbox type
- D: Developer sandboxes have no data; "promoting" sandbox types is not a Salesforce capability

---

**Question 17**
What is the maximum lifespan of a scratch org created without specifying a duration?

A. 7 days (default) with a maximum of 30 days
B. 1 day (default) with a maximum of 7 days
C. 30 days with no configurable extension
D. 90 days, matching the Developer Edition trial period

**Answer: A**
**Explanation:** Scratch orgs default to 7 days when no `--duration-days` value is specified. The absolute maximum lifespan is 30 days, set with `--duration-days 30`. Scratch orgs cannot be extended beyond 30 days — a new scratch org must be created after expiry.

**Why the others are wrong:**
- B: The default is 7 days, not 1 day; the maximum is 30 days, not 7
- C: 30 days is the maximum, but scratch orgs do default to 7 days — not 30 — when no duration is specified
- D: 90 days is not a valid scratch org duration; that duration applies to some trial org types, not scratch orgs

---

**Question 18**
A developer has a scratch org that was created 28 days ago and is expiring in 2 days. She has uncommitted work in the scratch org. What should she do to avoid losing her work?

A. Request Salesforce Support to extend the scratch org lifespan
B. Push all work to version control using `sf project deploy start` then create a new scratch org and pull the changes
C. Clone the scratch org to a new scratch org using the Salesforce CLI
D. Convert the scratch org to a Developer sandbox to preserve the state

**Answer: B**
**Explanation:** Scratch orgs cannot be extended beyond 30 days, and there is no clone command that copies a live scratch org to a new one. The correct practice — and why source-driven development requires disciplined commit habits — is to push all local metadata to VCS, then spin up a new scratch org and pull the work back down.

**Why the others are wrong:**
- A: Salesforce Support cannot extend scratch org lifespans beyond 30 days; this is a platform limitation, not an administrative setting
- C: There is no Salesforce CLI command to clone a scratch org to another scratch org
- D: Scratch orgs cannot be converted to sandboxes; they are entirely different environment types

---

**Question 19**
An architect is comparing sandbox types for a performance testing requirement. The test must exercise Apex code under production-equivalent data volumes and indexes. Which sandbox type is required?

A. Partial Copy sandbox
B. Developer Pro sandbox
C. Full Copy sandbox
D. Scratch org with seed data loaded via data loader

**Answer: C**
**Explanation:** Performance testing requires production-equivalent data volumes because query plan execution, index behavior, and Apex governor limit thresholds are all data-volume-dependent. Only a Full Copy sandbox replicates the full production dataset, making it the only valid option for true performance testing.

**Why the others are wrong:**
- A: Partial Copy captures only 5–10% of production records; performance at that volume will not represent production behavior at scale
- B: Developer Pro has no production data at all; loading synthetic data cannot replicate production index cardinality and distribution
- D: Scratch orgs with seeded data share the same fundamental limitation as Developer Pro — synthetic data cannot replicate production query performance characteristics

---

**Question 20**
A company has five Developer sandboxes, two Partial Copy sandboxes, one Full Copy sandbox, and is considering adding scratch orgs to their pipeline. Which is an accurate statement about scratch org limits?

A. Scratch org limits are org-wide and shared across all Salesforce licenses in the production org
B. Scratch org daily create limits and maximum active limits are determined by the Dev Hub org's edition and active Salesforce DX licenses
C. Scratch orgs count against the sandbox allocation in the production org license
D. There is no limit on scratch orgs; developers can create as many as needed

**Answer: B**
**Explanation:** Scratch org limits (both daily creation limits and maximum active scratch orgs) are governed by the Dev Hub org's Salesforce edition and the number of active Salesforce DX-enabled licenses. Different editions provide different allocations (e.g., Enterprise Edition Dev Hub provides more daily creates than Professional Edition).

**Why the others are wrong:**
- A: Scratch org limits are tied to the Dev Hub, not evenly distributed across all org licenses
- C: Scratch orgs are entirely separate from sandbox allocations; they are tracked under the Dev Hub's scratch org quota
- D: Scratch orgs have enforced daily creation limits and maximum active limits; exceeding them results in CLI errors

---

**Question 21**
A Partial Copy sandbox template has not been updated in six months. New custom objects were added to production during that period. What will happen when the Partial Copy sandbox is refreshed using the outdated template?

A. The refresh will fail with a metadata mismatch error
B. The new custom objects' metadata will be copied but no data for those objects will be included since the template does not reference them
C. The template will automatically update to include all new objects added since the last refresh
D. Only the template-defined objects will have metadata; new objects will be excluded entirely

**Answer: B**
**Explanation:** All metadata (including new custom objects) is always copied during a Partial Copy sandbox refresh — the template controls only which objects contribute data records. New objects not in the template will have their schema present but zero records, which is often acceptable for metadata-focused testing.

**Why the others are wrong:**
- A: Metadata mismatches do not cause refresh failures; metadata is always fully copied regardless of template content
- C: Templates are not auto-updated; they must be manually maintained by an administrator as the data model evolves
- D: Metadata and data copying are handled separately; all metadata types are copied, only data follows the template

---

**Question 22**
A release manager needs to validate that a deployment to production will succeed before the actual deployment window. She wants to run all Apex tests without committing changes to production. Which capability should she use?

A. Run a deployment with `--checkonly` flag (Validate-Only deployment) using the Metadata API or CLI
B. Deploy to a Developer sandbox and infer production compatibility
C. Use Quick Deploy to pre-validate the deployment package
D. Run `sf apex run test` against the production org directly

**Answer: A**
**Explanation:** A validate-only (check-only) deployment runs all pre-deployment validations including Apex test execution against the target org without making any actual changes. This is the purpose-built mechanism for pre-validating production deployments. Successful validation also unlocks Quick Deploy for 10 days.

**Why the others are wrong:**
- B: Developer sandbox infrastructure and metadata state may differ from production, making sandbox results indicative but not conclusive
- C: Quick Deploy uses a previously validated package — it is the follow-on step after validation, not the validation mechanism itself
- D: Running tests directly against production without a deployment package validates test coverage but not deployment compatibility

---

**Question 23**
When should an architect recommend using a Developer Pro sandbox over a standard Developer sandbox?

A. When the developer requires production data for testing
B. When the developer's work involves large metadata footprints — many custom objects, extensive Apex, or large static resources — that exceed the Developer sandbox's 200MB storage limit
C. When the developer needs a longer refresh interval
D. When the team wants to run automated UI tests that require a persistent URL

**Answer: B**
**Explanation:** The Developer Pro sandbox provides 1GB of storage (versus 200MB for Developer) and is otherwise functionally identical — no production data in either type. The correct trigger for Developer Pro is storage-constrained development work such as large Apex codebases, extensive Lightning components, or significant static resource files.

**Why the others are wrong:**
- A: Neither Developer nor Developer Pro sandboxes include production data; Partial Copy or Full Copy is required for data-dependent testing
- C: Both sandbox types share the same refresh interval (1 day); the refresh interval is not a differentiator
- D: Both sandbox types provide persistent URLs; URL persistence is not a factor in choosing between them

---

## Domain 3: Release Management (20%)

---

**Question 24**
A release manager needs to deploy a change set that includes the deletion of two obsolete Apex classes from production. After uploading the change set from the staging org, she notices the classes cannot be added to the outbound set. What is the reason?

A. Apex classes can only be deleted using the Metadata API's `destructiveChanges.xml`, not via change sets
B. Change sets do not support deletion of any metadata components; deletions must be performed manually or via the Metadata API
C. The classes are locked because they are referenced by a managed package
D. Deletion via change sets requires a special administrator permission not enabled on her profile

**Answer: B**
**Explanation:** Change sets fundamentally cannot delete metadata components. They are an additive-only deployment mechanism — they can add and modify components but have no mechanism to remove them. Deletions require either manual removal via Setup in the target org, or a Metadata API deployment using `destructiveChanges.xml`.

**Why the others are wrong:**
- A: While `destructiveChanges.xml` is indeed the right Metadata API mechanism, the statement implies change sets can delete Apex — they cannot delete any metadata type
- C: Managed package references would prevent deletion anywhere, not just in change sets, but this is not the root cause of the limitation described
- D: No special permission enables deletion via change sets because the feature does not exist, not because it is permission-gated

---

**Question 25**
After a successful validate-only deployment that ran all Apex tests, a release manager wants to use Quick Deploy to execute the actual deployment during the maintenance window. The validate-only deployment completed 12 days ago. What will happen when she attempts Quick Deploy?

A. Quick Deploy will succeed because validation results are stored indefinitely
B. Quick Deploy will fail because the validation window has expired; she must run a new validate-only deployment
C. Quick Deploy will succeed but will re-run all Apex tests during the deployment
D. Quick Deploy will prompt her to select which tests to run from the previous validation run

**Answer: B**
**Explanation:** Quick Deploy is valid for exactly 10 days following a successful validate-only deployment. After 10 days, the validation result expires and a new validate-only deployment must be performed before Quick Deploy can be used. This is a commonly tested fact on the CRT-406 exam.

**Why the others are wrong:**
- A: Validation results are not stored indefinitely; the 10-day expiration is a hard platform limit
- C: The entire premise of Quick Deploy is skipping test re-execution because tests already passed validation — it does not re-run tests
- D: Quick Deploy does not prompt for test selection; it uses the previously validated result set

---

**Question 26**
A deployment of 200 Apex classes must run in a tight maintenance window. The team wants to skip test execution to reduce deployment time. Under which circumstance is this permissible in a production org?

A. When the deploying user holds the "Modify All Data" permission
B. When the org has fewer than 10 Apex classes total
C. When the deployment is a validate-only deployment
D. Never — production deployments always require at least 75% code coverage

**Answer: B**
**Explanation:** Salesforce waives the Apex test execution requirement for production deployments only when the production org contains fewer than 10 Apex classes (or triggers) total. For any org with 10 or more Apex classes, at least 75% org-wide code coverage and all tests passing is mandatory.

**Why the others are wrong:**
- A: Profile permissions do not override the platform's Apex test execution requirements
- C: A validate-only deployment must still run all required tests — it cannot skip them; the difference is that changes are not committed to the org
- D: While D correctly states tests are normally required, the question asks for the exception — option B is the narrow exception Salesforce defines

---

**Question 27**
The Salesforce org-wide Apex code coverage is currently 73%. A deployment of three new Apex classes (with their tests) is ready. The new classes each have 85% coverage in the test run. Will the deployment to production succeed?

A. Yes, because the new classes individually exceed 75% coverage
B. No, because the 75% threshold applies to the entire org's Apex codebase combined, not per-class
C. Yes, because coverage above 70% is acceptable for incremental deployments
D. No, because coverage must be 80% when deploying more than one class at a time

**Answer: B**
**Explanation:** The 75% Apex code coverage threshold is calculated across the entire org's Apex codebase, not per individual class. Even if the classes being deployed have high individual coverage, if the combined org-wide coverage falls below 75% after the deployment, the deployment will fail. With an org-wide coverage of 73%, the deployment would fail.

**Why the others are wrong:**
- A: Per-class coverage does not satisfy the requirement; org-wide aggregate coverage is the enforced metric
- C: There is no 70% threshold for any deployment scenario; 75% is the minimum for all production deployments
- D: There is no elevated threshold based on deployment size; 75% org-wide is the single threshold regardless of how many classes are deployed

---

**Question 28**
A team is deploying to production using the Metadata API with `sf project deploy start`. They want to run only the tests specifically written for the components being deployed, rather than all local tests. Which test level should they specify?

A. `RunLocalTests`
B. `RunAllTestsInOrg`
C. `RunSpecifiedTests`
D. `NoTestRun`

**Answer: C**
**Explanation:** `RunSpecifiedTests` allows the deployer to name exactly which test classes to execute during the deployment. This is the appropriate choice when deploying a well-scoped change with known, targeted test coverage. The deployment will still verify that the specified tests provide at least 75% coverage for the classes being deployed.

**Why the others are wrong:**
- A: `RunLocalTests` executes all tests in the org that are not part of installed managed packages — this is broader than the deployer needs and takes longer
- B: `RunAllTestsInOrg` runs every test including managed package tests, which is the slowest option and unnecessary for a scoped deployment
- D: `NoTestRun` is only permitted in sandbox environments; it will be rejected for a production deployment that contains Apex

---

**Question 29**
A change set deployment fails at 60% completion with a duplicate value error on a custom field. The release manager wants to roll back the changes already applied. What is the correct behavior?

A. Salesforce automatically rolls back all changes when a deployment fails
B. The release manager must manually identify and revert the changes that were applied before the failure
C. The deployment can be resumed from the point of failure after fixing the error
D. A rollback script is automatically generated and must be executed via the CLI

**Answer: A**
**Explanation:** Salesforce deployment transactions are atomic — either the entire deployment succeeds or the entire deployment is rolled back. No partial deployments are committed to the org. When a deployment fails at 60%, all changes that were processed are automatically reverted, leaving the org in its pre-deployment state.

**Why the others are wrong:**
- B: Manual identification and reversion is not necessary because Salesforce's atomic deployment model handles rollback automatically
- C: Deployments cannot be resumed from a midpoint; each deployment attempt starts fresh
- D: There is no rollback script; atomicity is built into the Salesforce deployment engine

---

**Question 30**
A team needs to deploy metadata to a production org but does not want to use the Salesforce UI. They want to script the deployment in a CI/CD pipeline. Which tools are appropriate? (Select the best single answer.)

A. Change sets, because they can be triggered via the Salesforce REST API
B. The Metadata API directly or Salesforce CLI (`sf project deploy start`), which wraps the Metadata API
C. The Tooling API, which is designed for bulk metadata deployments
D. Data Loader, which supports metadata deployment as well as data operations

**Answer: B**
**Explanation:** The Metadata API is the programmatic interface for all metadata deployments and is fully scriptable. The Salesforce CLI's `sf project deploy start` command wraps the Metadata API and is the standard tool for CI/CD pipeline integrations. Both are appropriate and the CLI is the preferred modern approach.

**Why the others are wrong:**
- A: Change sets are a UI-based feature in Setup; there is no public API to trigger change set deployments programmatically
- C: The Tooling API is designed for development tooling (code execution, test running, small-scale metadata queries) not bulk production deployments
- D: Data Loader is strictly a data (records) import/export tool; it has no metadata deployment capability

---

**Question 31**
Which metadata type CANNOT be deployed using change sets and requires an alternative deployment method?

A. Custom fields on standard objects
B. Report types
C. Territories (Territory Management 2.0 configurations)
D. All of the above can be deployed via change sets

**Answer: C**
**Explanation:** Territory Management 2.0 configuration metadata cannot be deployed via change sets and requires the Metadata API or Salesforce CLI for automated deployment. There are several metadata types with change set limitations or restrictions that the exam tests; Territory Management is a well-known example.

**Why the others are wrong:**
- A: Custom fields on standard objects are fully supported in change sets
- B: Report types can be included in change sets
- D: Not all metadata types are change-set-compatible; C is a valid example of a restricted type

---

**Question 32**
A production deployment completed successfully, but users immediately report that a Lightning Web Component is displaying incorrectly. The release manager decides to roll back by redeploying the previous version from source control. What must she ensure is included in the redeployment?

A. Only the LWC bundle files need to be redeployed
B. All metadata that was part of the original deployment must be reverted together to maintain consistency, including any configuration changes or Apex that the LWC depends on
C. She must create a new sandbox, reproduce the issue, and fix forward — rollback is not supported
D. The LWC can be reverted via the "Undo Deployment" button in Setup

**Answer: B**
**Explanation:** Deployments often include interdependent components. Rolling back only the LWC while leaving dependent Apex, custom metadata, or configuration changes in their new state can create a worse inconsistency than the original bug. A rollback deployment should include all components from the original deployment, reverted to their prior state.

**Why the others are wrong:**
- A: Deploying only the LWC risks broken dependencies with other components that were updated in the same release
- C: Rolling back via redeployment is entirely supported; it is the standard mechanism when fix-forward is not feasible in the timeframe
- D: There is no "Undo Deployment" button in Salesforce Setup; rollback is a manual process using source control and the deployment toolchain

---

**Question 33**
A company is evaluating whether to use unlocked packages or change sets for their release pipeline. They need repeatable, versioned, installable units with dependency tracking. Which option meets all three requirements?

A. Change sets, because they can be saved as templates and reused
B. Unlocked packages, because they support semantic versioning, dependency declarations in `sfdx-project.json`, and are installable via package version ID
C. Both options are equivalent for versioning and dependency tracking
D. Managed packages only, because unlocked packages lack version tracking

**Answer: B**
**Explanation:** Unlocked packages provide all three capabilities: version numbers (major.minor.patch.build), declared dependencies between packages in `sfdx-project.json`, and installation via a package version ID that can be promoted and pinned. This makes them suitable for modular, auditable, repeatable delivery pipelines.

**Why the others are wrong:**
- A: Change sets have no versioning, no dependency tracking, and cannot be saved as reusable templates for future deployments
- C: Change sets have none of the three required capabilities; they are not equivalent to packages for this use case
- D: Unlocked packages fully support versioning and dependency management; managed packages add namespace protection but are not required for these three features

---

## Domain 4: Source Control (18%)

---

**Question 34**
A team is using Gitflow for their Salesforce project. A developer commits directly to the `main` branch to fix a typo in a field label. Two weeks later, the team discovers that the main branch is now ahead of production but cannot be deployed cleanly because unrelated `develop` branch changes were inadvertently merged. What practice would have prevented this?

A. Enabling branch protection rules on `main` to require pull requests with at least one approval
B. Using a single developer branch instead of Gitflow
C. Running `git rebase` on main daily
D. Requiring all commits to include Jira ticket numbers

**Answer: A**
**Explanation:** Branch protection rules on the `main` branch prevent direct commits and require all changes to flow through reviewed pull requests. This is the technical control that enforces the Gitflow discipline. Even experienced developers making "small" changes should go through a PR — which in this case would have caught the inadvertent merge.

**Why the others are wrong:**
- B: Reducing branching complexity does not prevent unauthorized direct commits; the missing control is protection, not simplicity
- C: Rebasing main does not prevent direct commits; it reorganizes history but the unauthorized commits are still there
- D: Commit message conventions are documentation controls, not enforcement controls — they do not prevent out-of-process commits

---

**Question 35**
A team's `.forceignore` file is supposed to exclude profiles from deployment since profiles are managed separately. However, after a `sf project deploy start`, profiles from the repository are being deployed to the org and overwriting manually configured settings. What is the most likely cause?

A. `.forceignore` only works with `sf project retrieve start`, not deployments
B. The profile file path in `.forceignore` does not match the actual directory structure — the pattern is incorrect or using the wrong metadata type prefix
C. Profiles cannot be excluded from deployments; they must always be included
D. The `.forceignore` file must be in the `force-app` subdirectory to affect deployments

**Answer: B**
**Explanation:** `.forceignore` uses glob patterns. If the pattern does not precisely match the file path structure (e.g., missing `**` wildcards, wrong directory name, or incorrect extension), the files will not be excluded. The `.forceignore` file must be at the project root and patterns must accurately reflect the file locations.

**Why the others are wrong:**
- A: `.forceignore` affects both retrieve and deploy operations; it controls what the CLI includes when scanning the source directory
- C: Profiles can absolutely be excluded from deployments via `.forceignore`; partial profile deployment or profile exclusion is a common ALM pattern
- D: `.forceignore` must be at the project root (same level as `sfdx-project.json`), not inside a subdirectory

---

**Question 36**
Two developers have both modified the same Apex class in separate feature branches. Developer A changed a method signature; Developer B added a new method. When Developer B's PR is merged first and Developer A's PR is reviewed, a merge conflict is reported. What is the correct resolution approach?

A. Reject Developer A's branch entirely and require them to redo the work on the new base
B. Developer A rebases their branch onto the latest `develop` branch, resolves the conflict locally (typically by incorporating both changes), runs tests, and then the PR can be merged
C. Accept both PRs simultaneously and let the deployment pipeline determine which change wins
D. Escalate to the release manager to manually merge the two versions in production

**Answer: B**
**Explanation:** The standard conflict resolution process is: rebase the feature branch onto the updated target branch, resolve conflicts locally in the developer's IDE (in this case, keeping both the signature change and the new method), run the full test suite to confirm no regressions, and push the rebased branch for re-review. This is the core value of feature branch workflows.

**Why the others are wrong:**
- A: Rejecting and redoing work is wasteful when the conflict is small and resolvable; it is the last resort, not the first response
- C: Accepting conflicting PRs simultaneously will result in a merge conflict that must still be resolved — deferring the problem does not solve it
- D: Resolving Apex code conflicts in a production org without testing is dangerous and violates all ALM principles

---

**Question 37**
A team is choosing between Gitflow and trunk-based development for their Salesforce CI/CD pipeline. The organization does frequent small releases (multiple per week) with a small team of four developers. Which strategy is more appropriate?

A. Gitflow, because its structured branching provides more deployment safety for any team size
B. Trunk-based development, because short-lived branches and frequent merges to main reduce integration debt and suit the small team's release cadence
C. Gitflow, because it provides a release branch that is mandatory for Salesforce deployments
D. Neither — Salesforce teams should use a custom branching model not described by standard patterns

**Answer: B**
**Explanation:** Trunk-based development — with short-lived feature branches (1–2 days max) and frequent integration to the main branch — aligns with high-frequency release cadences and small teams. Gitflow's overhead (long-lived branches, multiple merge steps) is more appropriate for teams with less frequent, larger releases or strict environment-gating requirements.

**Why the others are wrong:**
- A: Gitflow's structure adds overhead that can slow small, high-cadence teams without proportional safety benefit
- C: Salesforce deployments do not require any specific Git branching model; the release branch is a Gitflow convention, not a platform requirement
- D: Gitflow and trunk-based are both well-established, appropriate patterns for Salesforce development; neither is incompatible with the platform

---

**Question 38**
A developer runs `sf project retrieve start` and notices that retrieved profiles include permission sets, field-level security, and object permissions that differ from what the team committed to Git six weeks ago. The team did not intentionally change these. What is the most likely cause?

A. Git has corrupted the profile files due to a binary format incompatibility
B. Another developer made declarative changes to the profile in the org, which were not reflected back to VCS — the org drifted from source control
C. The `sf project retrieve start` command always retrieves a fresh version from Salesforce servers, ignoring local cache
D. Profile metadata changes automatically on every login due to platform maintenance

**Answer: B**
**Explanation:** Org drift — the divergence between what is in version control and what is actually in the org — is one of the primary problems that source-driven development aims to prevent. In this scenario, someone made changes to the profile in the org (possibly through Setup) without following the source-driven process of committing the change to VCS first.

**Why the others are wrong:**
- A: Git does not corrupt metadata files; profile XML is a standard text format
- C: `sf project retrieve start` does retrieve current org state, but the issue described is not a tool behavior problem — it is a process problem
- D: Profile metadata does not automatically change on login; platform maintenance does not alter customer-controlled profile settings

---

**Question 39**
A team wants to prevent Apex classes with less than 75% code coverage from being merged to the `develop` branch. How should this be enforced?

A. Add a comment convention requiring developers to state coverage percentage in their PR description
B. Configure a CI/CD pipeline job triggered on pull requests that runs `sf apex run test` and fails the pipeline if coverage drops below 75%
C. Use Salesforce's built-in branch protection settings in the org
D. Rely on developers to self-certify coverage before submitting PRs

**Answer: B**
**Explanation:** Automated enforcement via CI/CD is the only reliable way to gate merges on code quality metrics. A PR-triggered pipeline job that runs tests and checks coverage programmatically fails the PR check, preventing the merge until coverage is achieved. This makes coverage a hard gate rather than a soft guideline.

**Why the others are wrong:**
- A: Comment conventions are unenforced documentation; they are trivially bypassed and do not create a technical gate
- C: Salesforce orgs do not have Git branch protection settings; branch protection is configured in the Git host (GitHub, GitLab, Bitbucket)
- D: Developer self-certification is an honor system with no technical enforcement; under deadline pressure, it will be bypassed

---

**Question 40**
A team merges a feature branch to `develop`. The CI/CD pipeline deploys to the integration sandbox but the deployment fails because a custom object referenced in the feature was deleted in another recent merge. This failure was not caught earlier. What process improvement would catch this earlier?

A. Require developers to manually review all recent merges before submitting their own PR
B. Add a CI job that validates the PR branch against the current `develop` branch head before merge, running a check-only deployment to the integration sandbox
C. Run all deployments on Friday afternoons to consolidate conflict detection
D. Require all developers to work in the same scratch org to eliminate branch divergence

**Answer: B**
**Explanation:** A pre-merge validation job that deploys the PR branch (or its merge with the current target) to a scratch org or integration sandbox as a check-only deployment will catch referential integrity failures before they reach the shared `develop` branch. This is a CI best practice that moves failure detection left in the pipeline.

**Why the others are wrong:**
- A: Manual cross-branch review is unscalable and error-prone; it cannot reliably catch transitive metadata dependencies
- C: Consolidating deployments to Friday afternoons delays feedback and amplifies the blast radius of any failure
- D: A shared scratch org reintroduces the same contention problems that feature branches were designed to solve

---

**Question 41**
Which entry in `.forceignore` would correctly exclude all profiles from both retrieve and deploy operations?

A. `profiles/`
B. `**/*.profile`
C. `force-app/main/default/profiles/**`
D. `!profiles`

**Answer: B**
**Explanation:** The `.forceignore` syntax uses glob patterns similar to `.gitignore`. `**/*.profile` matches any file with a `.profile` extension anywhere in the project directory tree, regardless of the containing directory path. This reliably excludes all profiles from both retrieve and deploy operations.

**Why the others are wrong:**
- A: `profiles/` matches only a top-level directory named `profiles`; if profiles are nested under `force-app/main/default/profiles/`, this pattern will not match
- C: This absolute path pattern works only for the exact directory structure shown; if the project has multiple package directories, profiles in other locations will not be excluded
- D: The `!` prefix in `.forceignore` is a negation that re-includes previously excluded files; it would not exclude profiles

---

**Question 42**
A team is setting up Git for a new Salesforce DX project. A developer asks which files should NOT be committed to the repository. Which answer is correct?

A. `sfdx-project.json`, because it contains environment-specific settings
B. `.forceignore`, because it is generated dynamically by the CLI
C. Files in `.sf/` and `node_modules/`, along with any files containing credentials or API tokens
D. The `force-app/` directory, because metadata should be retrieved fresh each time

**Answer: C**
**Explanation:** The `.sf/` directory contains local CLI state and cached authentication tokens specific to the developer's machine. `node_modules/` contains installed npm dependencies that should be restored via `npm install`. Credentials and API tokens must never be committed to VCS. The project source, `sfdx-project.json`, and `.forceignore` should all be committed.

**Why the others are wrong:**
- A: `sfdx-project.json` is a project definition file that should absolutely be committed — it defines package directories, API version, and dependencies
- B: `.forceignore` is a manually maintained project file, not auto-generated; it should be committed so all developers share the same exclusion rules
- D: The `force-app/` source directory is the entire point of source-driven development; all source metadata must be in version control

---

## Domain 5: Testing & QA (17%)

---

**Question 43**
A large Salesforce org has 500 Apex classes. A developer writes a new Apex class with 100% coverage in its dedicated test class. The deployment to production fails with a coverage error. What is the most likely explanation?

A. 100% coverage on a single class does not meet the per-class minimum requirement
B. The production org's aggregate code coverage across all 500 classes is below 75%, and the new class, despite high individual coverage, does not raise the org-wide average enough
C. Coverage must be validated in a Full Copy sandbox before production deployment
D. The test class must be named exactly `<ClassName>Test` to be counted by the coverage tool

**Answer: B**
**Explanation:** Apex code coverage is measured org-wide. If the existing 500 classes have low aggregate coverage (say, 60%), adding one class with 100% coverage may not push the org-wide total above 75%. The developer's next step is to investigate which existing classes lack coverage and write or improve tests for them.

**Why the others are wrong:**
- A: There is no per-class coverage minimum for deployment; the requirement is 75% aggregate org-wide
- C: Full Copy sandbox validation is a good practice but is not a platform requirement for production deployment
- D: Test class naming conventions are developer best practices but have no effect on whether a test class is recognized or coverage is counted

---

**Question 44**
A test class is running slowly because each test method creates the same set of 50 Account records before executing. A developer wants to optimize the test class. What is the recommended approach?

A. Use `@isTest(SeeAllData=true)` to read records from the org instead of creating them
B. Use `@TestSetup` to create the shared test records once for all test methods in the class, reducing DML operations
C. Reduce the number of test methods so fewer records need to be created
D. Create the records in a `@future` method to run them asynchronously

**Answer: B**
**Explanation:** `@TestSetup` runs a setup method once before any test method in the class executes, and Salesforce rolls the data back between each test method automatically. This means 50 records are inserted once instead of once per test method, dramatically reducing test execution time and DML statement counts.

**Why the others are wrong:**
- A: `@isTest(SeeAllData=true)` creates test dependency on live org data, which is unreliable, non-isolated, and a known exam anti-pattern
- C: Reducing test methods reduces test coverage and confidence; the goal is test optimization, not test reduction
- D: `@future` methods inside test classes complicate test execution control and do not solve the root cause of per-method DML repetition

---

**Question 45**
A developer is writing tests for a class that makes callouts to an external REST API. Running the test in the sandbox produces an error: "You have uncommitted work pending. Please commit or rollback before calling out." What is the correct approach?

A. Use `Test.startTest()` and `Test.stopTest()` to isolate the callout
B. Implement a `HttpCalloutMock` interface and register it with `Test.setMock()` to simulate callout responses without making real HTTP calls
C. Change the test to use `@isTest(SeeAllData=true)` so it can access live callout endpoints
D. Deploy the code to production first; callouts are only restricted in sandboxes

**Answer: B**
**Explanation:** Apex tests cannot make real HTTP callouts. The platform requires developers to mock callout responses using the `HttpCalloutMock` interface registered via `Test.setMock(HttpCalloutMock.class, mockInstance)`. This returns a simulated response, allowing the test to exercise the callout-handling logic without network access.

**Why the others are wrong:**
- A: `Test.startTest()` / `Test.stopTest()` govern governor limit resets and asynchronous execution; they do not enable real callouts or substitute for mocking
- C: `@isTest(SeeAllData=true)` provides access to org data, not network callout permissions; live callouts are blocked in all test contexts
- D: Callouts are blocked in test contexts in all environments including production; this is a platform behavior, not a sandbox restriction

---

**Question 46**
An architect is designing a test data strategy for a large Salesforce implementation. Multiple test classes need the same set of complex Account, Contact, and Opportunity hierarchies. What is the recommended pattern?

A. Use `@isTest(SeeAllData=true)` on each test class to share production data
B. Create a Test Data Factory — an `@isTest` Apex class with static methods that return populated sObjects — and call it from each test class
C. Export production data to CSV and import it via Data Loader before each test run
D. Duplicate the record creation code in each test class for independence

**Answer: B**
**Explanation:** A Test Data Factory is the Salesforce-recommended pattern for reusable test data. It centralizes record construction logic in a single `@isTest` utility class, reducing duplication and ensuring consistent test data structure. When the data model changes, only the factory needs updating, not every test class.

**Why the others are wrong:**
- A: `@isTest(SeeAllData=true)` creates fragile tests that depend on specific production data existing; the pattern is explicitly discouraged in the Salesforce Testing Trailhead and exam content
- C: External data loading before test runs is operationally complex, not compatible with CI/CD test execution, and creates environment-specific dependencies
- D: Duplicating record creation in each test class creates maintenance burden; a single field rename requires updating dozens of test classes

---

**Question 47**
A team's CI pipeline runs `sf apex run test --code-coverage` on every PR. On a specific PR the pipeline passes with 78% coverage, but the deployment to production the next day fails with a coverage error. What is the most likely explanation?

A. The `--code-coverage` flag reports incorrect results in CI environments
B. Coverage was calculated against the sandbox org's baseline, which had different existing tests than production; in production, the aggregate org-wide coverage is below 75%
C. Code coverage results are only valid for 24 hours after the test run
D. The Metadata API uses a different coverage calculation method than the CLI

**Answer: B**
**Explanation:** Coverage calculations depend on all the Apex code in the target org. The sandbox and production orgs may have different Apex class inventories or different existing test coverage. A sandbox showing 78% does not guarantee production will also show 78% — their baselines may differ significantly. Architects should validate coverage against production-equivalent environments.

**Why the others are wrong:**
- A: The `--code-coverage` flag reports the actual coverage from the test run accurately; it is not an environmental bug
- C: Code coverage results do not have an expiry time for reporting purposes; only Quick Deploy validation results expire (after 10 days)
- D: The Metadata API and CLI use the same underlying coverage calculation engine; there is no methodological difference

---

**Question 48**
A QA engineer wants to test a scheduled Apex job without waiting for the scheduled time. How should the test invoke the scheduled job?

A. Manually trigger the job via Setup → Scheduled Jobs and observe results in the test sandbox
B. In the test class, use `Test.startTest()`, call `System.schedule()` to schedule the job, then call `Test.stopTest()` to force the scheduled job to execute synchronously within the test context
C. Deploy the scheduled class and wait for the real scheduler to fire in the sandbox
D. Use `@isTest(SeeAllData=true)` to access the job queue and force execution

**Answer: B**
**Explanation:** Salesforce's test framework processes asynchronous and scheduled work when `Test.stopTest()` is called. The pattern is: call `Test.startTest()`, use `System.schedule()` to enqueue the job, then call `Test.stopTest()` — at which point the platform synchronously executes all pending asynchronous work, allowing assertions immediately after.

**Why the others are wrong:**
- A: Manual job triggering via Setup is not automated, not repeatable, and cannot be part of a CI/CD test suite
- C: Waiting for the scheduler to fire in a sandbox is not a testing technique — it is unpredictable and cannot generate assertions
- D: `@isTest(SeeAllData=true)` accesses org data records; it has no effect on asynchronous job execution control

---

**Question 49**
A team is implementing automated UI testing for their Salesforce app. Which tool is specifically designed for Salesforce and integrates with the platform's test architecture?

A. Selenium WebDriver with generic CSS selectors
B. Salesforce Testing Service (deprecated) in the Spring release
C. UTAM (UI Test Automation Model) with WebDriver, developed specifically for Lightning Web Components
D. Cypress with a Salesforce-specific npm plugin

**Answer: C**
**Explanation:** UTAM (UI Test Automation Model) is Salesforce's purpose-built UI testing framework for Lightning components. It generates Page Objects from component models, works with standard WebDriver, and integrates with LWC component boundaries — making it significantly more resilient to DOM structure changes than raw CSS/XPath selectors.

**Why the others are wrong:**
- A: Generic Selenium with CSS selectors can test Salesforce UIs but is brittle against Lightning's shadow DOM and requires constant maintenance as selectors break with upgrades
- B: There is no deprecated Salesforce Testing Service of that description relevant to current exam content
- D: Cypress can be used with Salesforce but is a general-purpose tool; it lacks native LWC component model integration and shadow DOM traversal that UTAM provides

---

**Question 50**
A developer receives a complaint that a specific Apex test is intermittently failing in CI with a "Too many SOQL queries: 101" error, but always passes when run individually in the Developer Console. What is the most likely cause?

A. The Developer Console uses a different governor limit calculation than the Metadata API
B. Another test in the same test run is not properly isolating its data, causing records to leak into subsequent tests and multiplying SOQL queries in the failing test
C. The CI environment runs tests in parallel, causing governor limits to be shared across concurrent test executions
D. The 101-query limit only applies in production, not in sandbox test runs

**Answer: B**
**Explanation:** Tests should be fully isolated, but if a preceding test class uses `@isTest(SeeAllData=true)` or leaves uncommitted data in an unexpected state, a subsequent test may encounter additional records that drive extra SOQL queries into it. Running in isolation passes because no contaminating test precedes it. The fix is to identify and isolate the leaking test and ensure the failing test's queries are bounded regardless of ambient data.

**Why the others are wrong:**
- A: The Governor limit calculation is identical in all execution contexts; the Developer Console is not a privileged environment
- C: In Apex test execution, governor limits are per-test-class transaction, not shared across parallel threads; parallel execution affects time, not per-class limits
- D: Governor limits apply uniformly in all Salesforce environments including all sandbox types and production; there is no environment-specific limit relaxation

---

## Quick Reference: Key Facts for Exam Day

| Topic | Critical Number / Rule |
|---|---|
| Apex code coverage threshold | 75% **org-wide** aggregate (not per class) |
| Quick Deploy validity window | 10 days from successful validate-only deployment |
| Scratch org default lifespan | 7 days (max: 30 days, non-extendable) |
| Full Copy sandbox refresh interval | 29 days minimum |
| Partial Copy sandbox data sample | ~5–10% of production records (template-driven, not user-selectable %) |
| Partial Copy sandbox refresh interval | 5–7 days minimum |
| Developer sandbox storage | 200 MB |
| Developer Pro sandbox storage | 1 GB |
| Change sets — deletions | NOT supported; use `destructiveChanges.xml` via Metadata API |
| Unlocked packages in subscriber org | Components CAN be edited (unlike managed packages) |
| Managed packages in subscriber org | Apex and most components are READ-ONLY |
| Production deployment — skip tests | Only allowed if org has fewer than 10 Apex classes total |
| `@isTest(SeeAllData=true)` | Anti-pattern; only acceptable for legacy data that cannot be created in tests |
| `@TestSetup` | Runs once before all test methods; data is rolled back between each method |
| `Test.stopTest()` | Forces synchronous execution of all pending async/scheduled work |
| `HttpCalloutMock` | Required for testing classes that make HTTP callouts |
| `.forceignore` location | Project root (same level as `sfdx-project.json`) |
| Org-based vs source-driven | Org = system of record vs VCS = system of record |
