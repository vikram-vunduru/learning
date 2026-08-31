# Lecture 23: Deployment and Change Management

## Learning Objectives
- Understand the change set workflow and its role in org-to-org metadata deployments
- Use Salesforce CLI (sf) commands to deploy, retrieve, push, and pull metadata with source-tracked orgs
- Describe the scratch org development workflow from creation through package contribution
- Differentiate unlocked packages from managed packages and explain CI/CD pipeline structure with GitHub Actions

## Slides

### Slide 1: Deployment Overview — The Path from Dev to Production
**Visual:** Pipeline diagram showing three environments: Developer Sandbox → Full/Partial Sandbox (QA/UAT) → Production, with arrows labeled "Change Set" or "CLI Deploy" between each stage
**Content:**
- Salesforce follows an **environment-based deployment model**: code moves through a chain of orgs
- Common pipeline: Developer Sandbox → QA Sandbox → UAT Sandbox → Production
- Deployment methods:
  - **Change Sets** — GUI-driven, org-to-org (no version control required)
  - **Salesforce CLI** — command-line, file-system based, version-control friendly
  - **Packages (Unlocked/Managed)** — artifact-based, installable across orgs
- All deployments to production must pass the **75% Apex code coverage** requirement
**Speaker Notes:** Every Salesforce developer eventually needs to move code from a sandbox to production. The method you choose matters — change sets are fine for small orgs, but any serious team should be using CLI-based deployments with version control. This lecture covers the full spectrum from change sets through automated CI/CD.

---

### Slide 2: Change Sets — GUI-Driven Deployment
**Visual:** Two browser windows showing "Outbound Change Set" in sandbox with components listed, and "Inbound Change Set" in production with a Deploy button highlighted
**Content:**
- **Outbound Change Set** (source org): add metadata components → upload to connected target org
- **Inbound Change Set** (destination org): validate → deploy
- Requires a **Deployment Connection** configured in Setup between the two orgs
- Change sets do **not** capture data — metadata only
- Validate before Deploy to run tests without committing changes
- Limitation: no version history, no rollback, dependent components must be manually added
```
Setup > Deploy > Outbound Change Sets > New > Add Components > Upload
```
**Speaker Notes:** Change sets are the most accessible deployment method for admins and developers new to Salesforce. The major limitation is that they create no audit trail and cannot be rolled back — if a deployment causes issues, you have to manually revert. For teams of more than two or three people, the lack of version control is a serious problem.

---

### Slide 3: Salesforce CLI — Source-Format Commands
**Visual:** Terminal window showing a sequence of sf commands with output annotations
**Content:**
- Install: `npm install --global @salesforce/cli` or download the installer
- Authenticate: `sf org login web --alias myDev`
- **Retrieve** metadata from org to local: `sf project retrieve start --metadata ApexClass:MyClass`
- **Deploy** local metadata to org: `sf project deploy start --source-dir force-app`
- **Validate** (check only, no commit): `sf project deploy start --dry-run --test-level RunLocalTests`
- Deploy with test level: `sf project deploy start --test-level RunAllTestsInOrg`
- Useful flags: `--target-org <alias>`, `--source-dir`, `--metadata`, `--test-level`
**Speaker Notes:** The Salesforce CLI is the modern developer tool for deployments. It works with standard version control — your metadata lives in a local directory alongside your code, tracked in git. When you're ready to deploy, you run a single command. The --dry-run flag lets you validate without actually deploying, which is essential for CI/CD pipeline checks.

---

### Slide 4: Scratch Orgs and Source Tracking
**Visual:** Lifecycle diagram: sfdx-project.json config → sf org create scratch → develop in org → sf project deploy start (pull to local) → git commit → sf project deploy start (push to another scratch org) → test
**Content:**
- **Scratch orgs** are temporary, disposable developer environments (expire in 1-30 days)
- Configured via `config/project-scratch-def.json` — define features, settings, and edition
- **Source tracking**: CLI automatically tracks which files changed between local and org
- `sf project deploy start` — push local changes to scratch org
- `sf project retrieve start` — pull org changes back to local (e.g., after using UI to build a flow)
- Scratch orgs do **not** contain production data — must seed test data
- Enables true **package-based development**: each feature in its own branch + scratch org
**Speaker Notes:** Scratch orgs are one of the most powerful features of the Salesforce DX development model. Because they're disposable, you can create a fresh environment for every feature branch, test in isolation, and throw it away when you're done. Source tracking eliminates the need to manually track what changed — the CLI knows.

---

### Slide 5: Unlocked Packages vs Managed Packages
**Visual:** Two-column comparison table with headers "Unlocked Package" and "Managed Package", comparing use case, source visibility, namespace, upgrade model, and AppExchange eligibility
**Content:**
| Feature | Unlocked Package | Managed Package |
|---|---|---|
| Use case | Internal org development | ISV distribution on AppExchange |
| Source code visible | Yes — open source | No — protected/obfuscated |
| Namespace required | No | Yes |
| Subscriber can modify | Yes | Limited (configuration only) |
| AppExchange listed | No | Yes |
- Create: `sf package create --name "MyPackage" --type Unlocked`
- Create version: `sf package version create --package "MyPackage" --installation-key-bypass`
- Install: `sf package install --package 04t... --target-org myProd`
**Speaker Notes:** Unlocked packages are the recommended deployment unit for internal Salesforce teams adopting Salesforce DX. Instead of deploying individual metadata files, you package a set of components and install that package in each target environment. This gives you versioning, dependency tracking, and a rollback story — if a new version breaks something, you install the previous version.

---

### Slide 6: CI/CD with GitHub Actions and SFDX
**Visual:** GitHub Actions workflow YAML diagram showing job stages: checkout → authenticate with SFDX → validate deploy → run tests → deploy if on main branch
**Content:**
- CI/CD integrates source control with automated testing and deployment
- **GitHub Actions** workflow file (`.github/workflows/deploy.yml`):
```yaml
- name: Authenticate to Org
  run: sf org login sfdx-url --sfdx-url-file ${{ secrets.SFDX_AUTH_URL }}
- name: Validate Deploy
  run: sf project deploy start --dry-run --test-level RunLocalTests
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: sf project deploy start --test-level RunAllTestsInOrg
```
- Authentication via **JWT Bearer Flow** (server-side, no browser popup) for CI environments
- Connected App required with pre-authorized certificate
**Speaker Notes:** A working CI/CD pipeline means every pull request automatically validates that the code deploys and all tests pass. Developers get fast feedback before merging. The deploy-on-merge-to-main pattern means production only gets code that has already passed every quality gate automatically.

---

### Slide 7: Test Levels for Deployment
**Visual:** Pyramid diagram showing four test levels from bottom (NoTestRun) to top (RunAllTestsInOrg) with recommended use cases beside each level
**Content:**
- `NoTestRun` — no tests run; only allowed in sandbox deployments
- `RunSpecifiedTests` — runs only listed test classes; valid if those classes cover the deployed code
- `RunLocalTests` — runs all tests **not** from installed packages; recommended for most sandbox deploys
- `RunAllTestsInOrg` — runs every test in the org; required for **production deployments** using the API
- Default for production via change set: all local tests run automatically
- `RunLocalTests` is the standard CI/CD pipeline choice for sandbox validation
**Speaker Notes:** Choosing the right test level matters for both speed and safety. RunLocalTests is the sweet spot for CI validation — it runs your team's tests without running tests from managed packages you have no control over. For production, RunAllTestsInOrg ensures nothing in the entire org is broken by your change, which is why it's required.

---

### Slide 8: Deployment Checklist and Common Failures
**Visual:** Checklist with checkboxes and red X icons on common failure reasons: missing dependencies, <75% coverage, compile errors in referenced classes, inactive flows
**Content:**
- Common deployment failures:
  - **Apex compile errors**: all Apex must compile, including classes not in the change set
  - **Coverage < 75%**: org-wide coverage drops below threshold
  - **Missing dependencies**: component in change set references something not in target org
  - **Test failures**: any test in the org fails during deployment validation
- Pre-deployment checklist:
  - Run all tests locally: `sf project deploy start --dry-run --test-level RunLocalTests`
  - Check for references to sandbox-specific configurations
  - Verify all dependencies are included or already exist in target
  - Review code coverage report in Setup before deploying
**Speaker Notes:** Most deployment failures are preventable with a solid pre-deployment checklist. The most common surprise is coverage — a developer adds a class with 0% coverage and the org-wide average dips below 75%. Always run a dry-run validation in a full-copy sandbox before deploying to production, and review the coverage report in Setup to spot at-risk classes ahead of time.

---

## Recording Script

Welcome to Lecture 23 — Deployment and Change Management.

Deployments are where development meets reality. Code that works in your sandbox needs to successfully move to production without breaking anything that's already there. This lecture covers the full spectrum of how that happens in Salesforce.

The most accessible deployment method is change sets. You define an outbound change set in your sandbox, add the metadata components you want to move, and upload it to your production org. Production receives an inbound change set that you can validate and then deploy. Change sets are perfectly adequate for small teams and occasional deployments, but they have real limitations: no version history, no rollback capability, and dependent components must be manually hunted down and added.

The Salesforce CLI is the developer's tool of choice. Your metadata lives in a local directory structure, tracked in git like any other code. When you want to move changes, you run sf project deploy start with the appropriate flags. The --dry-run flag is essential — it validates the deployment without committing any changes, running all your tests and checking for compile errors.

Scratch orgs take this further. They're temporary development environments that you spin up from a configuration file, do your work in, then discard. Source tracking means the CLI automatically knows what changed between your local files and the scratch org, so you can sync bidirectionally with simple commands.

For teams that want artifact-based deployments, unlocked packages are the answer. Instead of deploying individual files, you define a package containing a set of components, create a versioned package artifact, and install that artifact in each target org. This gives you the versioning and rollback capabilities that change sets lack.

CI/CD puts this all together. A GitHub Actions workflow checks out your code on every pull request, authenticates to a sandbox using a JWT Bearer Flow, runs a validate deployment, and reports back whether the code compiles and all tests pass. On merge to main, it deploys automatically. This is how serious Salesforce development teams operate.

Remember: production deployments require 75% code coverage and all tests must pass. This is enforced by the platform — you cannot override it with flags or workarounds. Build your test suite to exceed 90% per class, and coverage failures will never be a deployment blocker.

---

## Exam Tips
- `NoTestRun` is ONLY valid for sandbox deployments — never for production
- **Change set validation** runs tests without deploying — this is the safe practice before committing to deploy
- JWT Bearer Flow (not Web OAuth) is required for CI/CD environments because there's no browser for interactive authentication
- The 75% coverage requirement applies to the org-wide aggregate, but any class with 0% coverage that is part of the change set can block deployment
- Unlocked packages can be modified by subscribers (they see and can change the code); managed packages cannot

## Lecture Summary
Change sets provide GUI-driven, org-to-org metadata deployments but lack version control and rollback capabilities, making them unsuitable for large or automated team workflows. The Salesforce CLI enables source-format deployments with test level control, and scratch orgs combined with source tracking provide the foundation for package-based development where each feature lives in an isolated environment. Unlocked packages give internal teams versioned, installable deployment artifacts while managed packages serve ISV distribution on AppExchange. CI/CD pipelines using GitHub Actions and JWT authentication automate the validate-and-deploy cycle, enforcing the 75% coverage and zero test-failure requirements on every change.

## Mini Quiz
**Q1:** Which CLI command validates a deployment against a target org without committing any changes?
A) sf project deploy start --source-dir force-app
B) sf project deploy start --dry-run --test-level RunLocalTests
C) sf project retrieve start --metadata ApexClass
D) sf org create scratch --definition-file scratch-def.json
**Answer:** B — The --dry-run flag (formerly --check-only) runs the deployment validation including test execution but does not commit any metadata to the org.

**Q2:** A team needs CI/CD pipelines that authenticate to Salesforce without a browser popup. Which OAuth flow should they use?
A) Web Server OAuth Flow
B) User-Agent Flow
C) JWT Bearer Token Flow
D) Device Authorization Flow
**Answer:** C — JWT Bearer Token Flow is designed for server-to-server authentication without user interaction. It uses a pre-authorized Connected App with a certificate, making it appropriate for CI/CD pipelines that run headlessly.

**Q3:** Which test level runs all tests in the org except those from installed managed packages?
A) RunAllTestsInOrg
B) RunSpecifiedTests
C) NoTestRun
D) RunLocalTests
**Answer:** D — RunLocalTests executes all tests defined in the org that are not part of installed packages. It is the recommended test level for most sandbox and CI deployments.
