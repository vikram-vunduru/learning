# Sandboxes & Change Sets

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Sandboxes are test/dev environments; Change Sets are the tool for moving configuration (metadata) between orgs. Together they form the deployment pipeline for Salesforce configuration changes.

**Sandbox Types (review from Lecture 01, with deeper context here):**

| Type | Refresh Interval | Data Copied | Storage | Use Case |
|---|---|---|---|---|
| Developer | 1 day | Metadata only | 200MB / 10MB files | Individual dev |
| Developer Pro | 1 day | Metadata only | 1GB / 10MB files | Larger dev projects |
| Partial Copy | 5 days | Metadata + sample data | 5GB | Integration testing |
| Full | 29 days | Metadata + ALL data | Same as Production | UAT, load testing |

**Sandbox refresh:**
- A refresh copies fresh metadata (and data, for Partial/Full) from Production
- **Destroys all existing sandbox data and configuration** — there is no selective refresh
- After refresh, the sandbox is a fresh copy of Production at that point in time

**Sandbox usernames:**
- After refresh, usernames are modified to prevent conflicts with Production
- Format: `username@company.com` → `username@company.com.sandbox-name`
- This means users can't log in with their Production username in the sandbox

**Change Sets:**
- Move **metadata** (configuration) from one org to another
- Types: **Outbound Change Set** (what you're sending) and **Inbound Change Set** (what you receive)
- Can contain: custom objects, fields, validation rules, flows, page layouts, profiles, etc.
- **Metadata only — NO data is moved via Change Sets**
- Deployment connections must be pre-configured between orgs (Setup → Deployment Settings)
- Change Sets must be uploaded before they can be deployed

**Change Set process:**
1. In source org: create Outbound Change Set, add components
2. Upload to connected org (click Upload)
3. In target org: view Inbound Change Set, Validate (test without deploying), Deploy

**Validate vs Deploy:**
- **Validate:** Runs all tests as if deploying but doesn't actually apply changes
- **Deploy:** Applies all changes to the org
- Best practice: always Validate before Deploy, especially in Production

**Dependencies:**
- Change Sets do NOT automatically include dependent components
- Example: deploy a custom field → must also include the custom object it belongs to, or it already exists in the target
- Missing dependencies cause deployment failures
- Must manually add all required components

## PTA / SA Relevance

Change Sets are the "Phase 1" deployment tool in Salesforce. They work for small teams but have serious scalability problems:

**Change Set limitations at enterprise scale:**
1. No version control — you can't see what changed between versions
2. No rollback — if a deployment fails, there's no undo
3. Manual dependency tracking — engineers miss dependencies and deployments fail
4. No CI/CD support — can't automate in a pipeline

**The professional alternative: Salesforce DX + Metadata API or SFDX CLI:**
- Metadata stored in Git
- Changes deployed via SFDX CLI or CI/CD pipeline (GitHub Actions, Bitbucket, Jenkins)
- Automated testing before deployment
- This is the architecture recommendation for any team with more than 2-3 developers

**For the admin exam:** Change Sets are the expected answer for "how do you move metadata between sandboxes and Production." In reality, you should be recommending a source-control-based deployment strategy in any enterprise engagement.

## Architecture / How It Works

```
Change Set Deployment Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SANDBOX (source)                PRODUCTION (target)
  ┌────────────────┐              ┌────────────────┐
  │  Outbound      │              │  Inbound       │
  │  Change Set    │   Upload     │  Change Set    │
  │                │ ──────────► │                │
  │  Components:   │              │  Validate →    │
  │  - Custom Obj  │              │  (no changes,  │
  │  - Field A     │              │  just testing) │
  │  - Flow B      │              │                │
  │  - Profile C   │              │  Deploy →      │
  └────────────────┘              │  (applies all) │
                                  └────────────────┘

  Deployment Connection must be configured:
  Production ←──── authorized ────► Sandbox
  Sandbox    ←──── authorized ────► Sandbox

  What CANNOT be moved in a Change Set:
  ✗ Data (records)
  ✗ Users
  ✗ Schedules / automation logs
  ✗ Some metadata types (not all metadata types supported)
```

**Limitations:**
- Change Sets move metadata ONLY — no data
- Dependencies are NOT automatically included — must be added manually
- No version history or rollback capability
- Connections between orgs must be pre-authorized by an admin
- Deployment to Production: runs all unit tests by default (in orgs with Apex code, 75% code coverage required)
- Not available in all editions (requires Developer, Enterprise, Unlimited, or Performance edition)
- Some metadata types are not supported in Change Sets (must use Metadata API or SFDX for those)

## Key Facts to Memorize

- Change Sets = metadata only (NO data)
- Outbound = you're sending; Inbound = you're receiving
- Dependencies NOT auto-included — must add manually
- Validate = test without applying; Deploy = apply changes
- Sandbox refresh = destroys all sandbox data, copies fresh from Production
- Full sandbox refresh = 29-day minimum interval
- Developer sandbox = metadata only copy; 1-day refresh interval
- Sandbox username format: `original@domain.com.sandboxname`

## Exam Traps

- **"Change Sets can be used to move records from sandbox to Production"** — FALSE. Change Sets move metadata only. Data requires Data Loader.
- **"Change Sets automatically include all dependencies"** — FALSE. Dependencies must be manually added to the Change Set or they'll cause deployment failures.
- **"You can roll back a Change Set deployment"** — FALSE. There is no rollback. You'd need to manually undo or deploy a corrective change set.
- **"A sandbox refresh preserves existing sandbox data and just adds Production changes"** — FALSE. Refresh destroys ALL existing sandbox data and replaces with a fresh copy from Production.
- **"All metadata types can be deployed via Change Sets"** — FALSE. Some metadata types are not supported in Change Sets and require Metadata API or SFDX CLI.

## Practice Questions

**Q:** An admin creates a custom validation rule in a Developer Sandbox and wants to deploy it to Production. What is the standard process using Change Sets?
**A:** 1. In the Sandbox, create an Outbound Change Set and add the Validation Rule component (plus any dependencies like the custom object). 2. Upload the Change Set. 3. In Production, open the Inbound Change Set. 4. Validate (test). 5. Deploy.

**Q:** A Change Set deployment to Production fails with "Missing Dependency" error. What is the most likely cause?
**A:** The Change Set includes a component that references another component not included in the Change Set and not yet in the target org. Example: a field references a picklist not included, or a flow references an object not in the target.

**Q:** A company refreshes their Full Sandbox. A developer had been working in that sandbox for 2 months. What happens to their work?
**A:** All sandbox data and configuration changes are destroyed. The refresh creates a fresh copy from Production. The developer's 2 months of work in the sandbox is gone. Best practice: deploy or document all sandbox changes before refreshing.

**Q:** What is the difference between Validating and Deploying a Change Set?
**A:** Validate runs all deployment tests and checks (including unit tests) without actually applying any changes to the org. Deploy applies all changes. Validate lets you confirm there are no errors before committing to the deployment.
