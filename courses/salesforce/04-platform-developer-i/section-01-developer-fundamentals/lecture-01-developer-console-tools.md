# Developer Console & Tools

## Exam Domain
Developer Fundamentals — 23% of exam weight

## Core Concepts

### Developer Console
Browser-based IDE in every org — no install required. Access via gear icon > Developer Console. Use for ad-hoc SOQL, Anonymous Apex, and reading debug logs. Not for production development (no version control).

### Execute Anonymous Window
Run Apex immediately without saving. Access: Debug > Open Execute Anonymous Window (Ctrl+E). Runs as the currently logged-in user — sharing and security rules apply. Output in Logs tab; filter USER_DEBUG.

### Log Inspector
Structured debug log view. Panels: Execution Log (chronological events), Stack Tree (call hierarchy), Source (highlights current line), Variables/View State. Logs capped at 20 MB; truncates oldest entries if exceeded.

### Salesforce CLI
The backbone of modern development. Installs as `sf`. Enables source-driven development, scratch org management, and CI/CD. All professional Salesforce work uses CLI + VS Code.

### VS Code + Salesforce Extension Pack
Standard IDE. Features: Apex IntelliSense, Org Browser, SFDX command palette, and the **Apex Replay Debugger** — step through debug logs as if in a real debugger.

### Org Types

| Type | Purpose | Duration | Data |
|------|---------|----------|------|
| Developer Edition | Learning, free | Permanent | 5 MB |
| Developer Sandbox | Production config copy | Permanent | 200 MB |
| Partial Sandbox | Config + sample data | Permanent | 5 GB |
| Full Sandbox | Complete production copy | Permanent | Full |
| Scratch Org | Disposable, source-driven, CI/CD | 1–30 days | None |

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Developers using Developer Console as their primary IDE — no version control means no audit trail and no safe rollback. Flag this as a process gap, not just a tooling preference.
- Hardcoded IDs in scripts or classes that were tested via Execute Anonymous and then copy-pasted into production classes.
- Teams skipping scratch orgs and using shared developer sandboxes — this creates merge conflicts and makes CI/CD impossible.

**In CTO conversations:**
- The shift to Salesforce DX (scratch orgs + CLI + packages) is foundational for any team moving toward DevOps. If a customer is still on change sets only, that's a maturity gap to address.
- Sandbox refresh cycles become a bottleneck for teams doing frequent releases. Scratch orgs eliminate this — each feature branch gets a fresh, disposable environment.

**Enterprise-scale considerations:**
- Large orgs often have 5+ sandbox environments (Dev → Integration → QA → UAT → Pre-prod → Prod). The CLI's `--target-org` flag makes targeting the right environment explicit and scriptable.
- Org-wide debug log limits (1,000 logs) become a real problem in busy production orgs. Advise customers to use targeted log filters with short durations and to download logs before the 24-hour expiry.

## Architecture / How It Works

```
DEVELOPMENT ECOSYSTEM — ENTERPRISE VIEW

  Developer Machine          CI/CD Pipeline (GitHub Actions)
  ┌────────────────┐         ┌──────────────────────────────────┐
  │  VS Code       │         │  on: push to feature branch      │
  │  + SFDX Ext.   │         │  ┌─────────────────────────────┐ │
  │  + sf CLI      │ ──git── │  │ 1. Checkout code             │ │
  └───────┬────────┘  push   │  │ 2. sf org login (JWT)        │ │
          │                  │  │ 3. sf project deploy --dry   │ │
    sf project               │  │    --test-level RunLocalTests│ │
    deploy start             │  │ 4. Report pass/fail to PR    │ │
          │                  │  └─────────────────────────────┘ │
          ▼                  └──────────────────────────────────┘
  ┌───────────────┐
  │  Scratch Org  │  ← feature development (disposable)
  │  (Dev Hub)    │
  └───────────────┘

  Promotion path:
  Scratch Org → Integration Sandbox → QA Sandbox → UAT → Production
                      via sf deploy         via change set or CLI
```

**Limitations:**
- Debug logs: 20 MB max per log, 24-hour retention, 1,000-log org limit
- Scratch orgs require Dev Hub; max 30 days duration; no production data
- Execute Anonymous runs under normal governor limits — no relaxation
- The Apex Replay Debugger requires a SAVED debug log — it does not connect live to a running process

```
SFDX PROJECT STRUCTURE

  MyProject/
  ├── sfdx-project.json           ← package directories + sourceApiVersion
  ├── .forceignore                ← like .gitignore for Salesforce
  ├── .github/workflows/          ← CI/CD pipeline YAML files
  └── force-app/main/default/
      ├── classes/                ← Apex (.cls + .cls-meta.xml pairs)
      ├── triggers/               ← Apex triggers (.trigger + meta.xml)
      ├── lwc/                    ← Lightning Web Components
      ├── aura/                   ← Aura components (legacy)
      ├── objects/                ← Custom objects + field metadata
      └── permissionsets/         ← Permission set definitions
```

**Limitations:**
- Every metadata file needs a `-meta.xml` companion — never delete it
- `sourceApiVersion` in sfdx-project.json must match the target org's API version or higher
- The `sf` command (Salesforce CLI v2) replaced `sfdx` — both name forms appear in exam questions

## Key Facts to Memorize
- Debug logs: **20 MB** max, **24-hour** retention, **1,000-log** org limit
- Scratch orgs require **Dev Hub**; max **30 days**
- `sf org login web --alias myOrg` — authenticate
- `sf project deploy start --source-dir force-app` — deploy local to org
- `sf project retrieve start` — pull org changes to local
- `sf apex run` — Execute Anonymous via CLI
- Execute Anonymous runs as the currently logged-in user — FLS and sharing apply
- `sf` (new) replaced `sfdx` (legacy) — exam questions may reference either

## Customer Advisory Tips
- **Change sets only?** → Recommend Salesforce CLI + Git as the first DevOps maturity step. Change sets have no version history and no rollback.
- **Shared developer sandboxes?** → Move to scratch orgs per feature branch. Eliminates "who broke it?" moments.
- **Developer Console as primary IDE?** → No version control = no audit trail. VS Code + SFDX should be the standard.
- **One sandbox environment?** → For any team with 3+ developers, recommend at minimum: Dev → QA → UAT → Prod.

## Exam Traps
- Execute Anonymous does NOT save code to the org — purely ephemeral
- Debug log truncation removes the OLDEST entries (not newest) — you keep recent events
- The Apex Replay Debugger replays a SAVED log — it does not attach to a live process
- Scratch orgs need Dev Hub enabled BEFORE you can create them
- `sf project retrieve start` pulls FROM the org TO local (not the reverse)

## Practice Questions

**Q:** A developer wants to test a snippet quickly without creating a permanent class. Which tool?
**A:** Execute Anonymous window in the Developer Console. Code runs immediately and is not saved to the org.

**Q:** A debug log shows "Log truncated." What is the most likely cause?
**A:** The log exceeded the 20 MB per-log limit. Oldest entries are trimmed. Fix: reduce log verbosity levels (e.g., APEX_CODE from FINEST to DEBUG).

**Q:** A developer needs a temporary, source-driven org for a managed package feature in CI/CD. Which org type?
**A:** Scratch Org — disposable (up to 30 days), source-driven, created from a config file. Requires Dev Hub.
