# L21: Change Sets & Deployment

## Exam Domain
App Deployment — 10% of exam weight

---

## Core Concepts

### Outbound vs. Inbound Change Sets
A **change set** is a metadata container for moving configuration between related Salesforce orgs. **Outbound change sets** are created in the source org — you add components (flows, fields, layouts, validation rules, etc.) to the outbound change set and upload it. **Inbound change sets** appear in the target org after upload — the target org admin reviews and deploys the inbound change set. Key fact: the deployment connection must be authorized in the **target org**, not the source org.

### What Can (and Can't) Be in a Change Set
Change sets can contain many metadata types: custom objects/fields, page layouts, validation rules, flows, Apex classes, Apex triggers, Lightning components, profiles/permission sets, and more. What change sets **cannot** move: Data records, Reports/Dashboards stored in personal folders, Org-level settings that aren't metadata types, and some newer metadata types that require CLI deployment instead.

### Validate vs. Deploy
**Validate** runs all deployment checks — component dependencies, Apex test execution (if the change set includes Apex), field mapping — but does NOT commit any changes to the target org. It's a safe dry run. If validation passes, a **10-day Quick Deploy window** opens. **Quick Deploy** within that window deploys the same change set without re-running all Apex tests — faster and suitable for deploying during off-peak hours after validating during business hours.

### 75% Apex Test Coverage Rule
Any production deployment that includes Apex code (classes or triggers) requires: (1) At least 75% code coverage **across all Apex in the org** (not just the Apex in the change set), and (2) Every Apex trigger in the org must have at least 1 test method that covers it. This is a platform-enforced rule. Declarative-only change sets (no Apex) do NOT need 75% coverage.

### No Rollback
Change sets have no rollback mechanism. Once deployed, changes are live in the target org. If a deployment causes problems, each component must be manually reverted or re-deployed. This is one of the biggest limitations of change sets compared to version-controlled deployment tools.

---

## PTA / SA Relevance

**Change sets vs. Salesforce DX:** Change sets are the admin-friendly option — no version control, no command line, browser-based. But they scale poorly for team development. For teams with more than 2-3 developers working in parallel, Salesforce DX (SFDX + Git + CI/CD) is the right architecture. Change sets are appropriate for single-developer or small team scenarios.

**Deployment connections and security:** Deployment connections must be established between specific orgs (sandbox to production, sandbox to sandbox). These connections are configured in the target org under Setup → Deployment Settings. Not every sandbox can deploy to every other sandbox — connections must be explicitly authorized. In a multi-org environment, this can get complex.

**Quick Deploy timing strategy:** In practice, Validate during business hours to get sign-off on what will deploy. Quick Deploy in a maintenance window (off-hours, weekend). The 10-day window allows you to validate well in advance of your deployment window and then execute quickly when the window opens.

**What to add to a change set:** A common mistake is missing dependencies. If you add a Validation Rule that references a custom field, you must also add that custom field to the change set. The Validate step will fail if dependencies are missing. Order of deployment matters too — if a change set installs a Flow that references an object that doesn't exist in the target, deployment fails.

---

## Architecture / How It Works

```
Change Set Deployment Pipeline:
                                                               
  SOURCE ORG (Dev Sandbox)                                    
  ┌────────────────────────────────────────────────┐          
  │  Setup → Outbound Change Sets                  │          
  │  → Create New → Add components                 │          
  │  → Upload  ──────────────────────────────────► │          
  └────────────────────────────────────────────────┘          
                                                               
  ▼ change set travels to target org                          
                                                               
  TARGET ORG (Production)                                     
  ┌────────────────────────────────────────────────┐          
  │  Setup → Inbound Change Sets                   │          
  │  → Find the uploaded change set                │          
  │  → VALIDATE (dry run — no changes made)        │          
  │       │ If passes ──────────────────────────── │          
  │       └──► QUICK DEPLOY (within 10 days)       │          
  │       OR                                       │          
  │  → DEPLOY (validate + commit in one step)      │          
  └────────────────────────────────────────────────┘          
                                                               
  Deployment Connection: MUST be authorized in TARGET ORG     
```

**Limitations:**
- No rollback — once deployed, changes must be manually reversed
- Change sets only work between related orgs (same Salesforce environment)
- No version control — change sets are not tracked in Git
- Not all metadata types are supported by change sets
- Change sets cannot be scheduled — deployment is always manual

```
Validate vs. Deploy vs. Quick Deploy:
┌──────────────────┬───────────────────────────────────────────┐
│ Action           │ What Happens                              │
├──────────────────┼───────────────────────────────────────────┤
│ Validate         │ Checks all components; runs Apex tests    │
│                  │ if Apex included; NO changes committed    │
│                  │ → Opens 10-day Quick Deploy window        │
├──────────────────┼───────────────────────────────────────────┤
│ Quick Deploy     │ Deploys same set without re-running tests │
│                  │ → Available within 10 days of validation  │
│                  │ → Faster than full deploy                 │
├──────────────────┼───────────────────────────────────────────┤
│ Deploy           │ Validates + commits in one step           │
│                  │ → Full test run if Apex included          │
│                  │ → Slower but simpler                      │
└──────────────────┴───────────────────────────────────────────┘
```

**Limitations:**
- Quick Deploy window is exactly 10 days — missing it requires re-validation
- Quick Deploy may be invalidated if new code has been added to the org since validation
- Validation failures report all errors at once — all must be fixed before re-validation

```
75% Apex Coverage Rule:
┌─────────────────────────────────────────────────────────────────┐
│  Change set contains Apex code?                                 │
│      │                                                          │
│      ├─ YES → Must have 75%+ coverage across ALL org Apex      │
│      │        + at least 1 test per trigger in the org         │
│      │        (Not just the Apex in the change set)            │
│      │                                                          │
│      └─ NO  → No Apex coverage requirement                     │
│               (Flow-only, config-only deploys don't need 75%) │
└─────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- The 75% is calculated against the org's entire Apex code base — adding new Apex that isn't covered can fail even if your change set's code is 100% covered
- You cannot selectively test only the Apex in the change set — all org Apex tests run
- Test execution during deployment counts against governor limits

---

## Key Facts to Memorize
- Outbound = created in source org; Inbound = deployed in target org
- Deployment connection: authorized in TARGET org (not source)
- Validate = dry run, no changes; opens 10-day Quick Deploy window
- Quick Deploy = deploy without re-running tests, within 10-day window
- 75% Apex coverage: required if ANY Apex in the change set; applies org-wide, not just change-set Apex
- Every Apex trigger must have at least 1 test method
- No rollback after deployment — manual reversal required
- Declarative-only change sets: no 75% coverage requirement

---

## Exam Traps
- **Connection authorized in TARGET.** The target org admin authorizes who can deploy into their org. The source org just creates the change set and uploads it.
- **Validate does NOT deploy.** If a question asks what clicking "Validate" does, the answer is: it checks everything and runs Apex tests but makes NO changes to the org.
- **75% is org-wide, not change-set-specific.** Adding poorly-covered Apex to a change set can fail deployment even if all the code in the change set itself has 100% coverage.
- **Quick Deploy window = 10 days exactly.** If the scenario says "the validation passed 11 days ago," Quick Deploy is no longer available — must re-validate.
- **No rollback.** Salesforce change sets have no rollback button. The only way to "undo" is manual reversal of each component.

---

## Practice Questions

**Q:** A developer creates an outbound change set in the Dev sandbox and attempts to deploy to production. The deployment connection shows "Not Authorized." Where must the connection be authorized, and by whom?
**A:** The deployment connection must be authorized in the production org (the target) by an administrator in the production org. Navigate to Setup → Deployment Settings in production and authorize the connection from the Dev sandbox.

**Q:** An admin clicks "Validate" on an inbound change set in production. The change set contains only Flows and Custom Fields (no Apex). What is required for validation to pass?
**A:** No Apex test coverage is required because the change set contains no Apex. Validation will check that all components are compatible with the production org and that all dependencies (referenced fields, objects, etc.) exist in production. No test execution occurs.

**Q:** An App Builder validates a change set on Monday and validation passes. They plan to Quick Deploy on Friday. On Thursday, a developer deploys a new Apex trigger to production that has no test coverage. What happens when the App Builder tries to Quick Deploy on Friday?
**A:** Quick Deploy may fail or be invalidated. The new Apex trigger with no test coverage reduces the org's overall Apex test coverage below 75% — even though the App Builder's change set doesn't include Apex, the Quick Deploy window may no longer be valid because the org's overall coverage has changed since validation.
