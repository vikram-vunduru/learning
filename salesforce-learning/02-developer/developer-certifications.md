# Salesforce Developer Certifications

> **Last Updated:** August 2026  
> **Path Position:** Months 4–5 in the 12-Month Technical Architect Sprint

---

## Quick Overview

| Cert | Code | Cost | Passing Score | Prerequisite |
|------|------|------|--------------|--------------|
| Platform Developer I (PDI) | CRT-450 | $200 | 65% | None |
| JavaScript Developer I | CRT-600 | $200 | 65% | None |
| Platform Developer II (PDII) | CRT-401 | $400 | 65% | **PDI required** |

**Recommended order:** PDI → JavaScript Dev I → PDII

---

## 1. Platform Developer I (PDI)

### Exam Details

| Field | Value |
|-------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 110 minutes |
| Passing Score | 65% |
| Cost | $200 (retake $100) |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Logic and Process Automation | **27%** |
| User Interface | **25%** |
| Testing, Debugging, and Deployment | 17% |
| Data Modeling and Management | 12% |
| Integration | 8% |
| Salesforce Fundamentals | 7% |
| Performance | 4% |

### Official Trailhead Path

**Trail 1 — Developer Beginner** (~14 hrs 10 mins)
`trailhead.salesforce.com/content/learn/trails/force_com_dev_beginner`

| Module | Duration |
|--------|----------|
| Get Started with Salesforce Development | ~2 hr 5 min |
| Data Modeling | ~45 min |
| Lightning Experience Customization | ~3 hr |
| Formulas and Validations | ~1 hr |
| Flow Builder Basics | ~40 min |
| Apex Basics & Database | ~2 hr 45 min |
| Apex Triggers | ~1 hr 30 min |
| Lightning Web Components Basics | ~1 hr 10 min |

**Trail 2 — Developer Intermediate** (~14 hrs 35 mins)
`trailhead.salesforce.com/content/learn/trails/force_com_dev_intermediate`

| Module | Duration |
|--------|----------|
| Screen Flows | ~2 hr 5 min |
| Record-Triggered Flows | ~1 hr 5 min |
| Autolaunched and Scheduled Flows | ~1 hr 30 min |
| Platform API Basics | ~1 hr 35 min |
| Apex Testing | ~2 hr 15 min |
| Find and Fix Bugs with Apex Replay Debugger | ~1 hr |
| LWC and Salesforce Data | ~1 hr 10 min |

### Superbadges (Hands-On Labs)

| Superbadge | Maps To | Est. Time |
|-----------|---------|-----------|
| **Apex Specialist** | Logic/Automation 27% | ~7 hrs |
| **Process Automation Specialist** | Automation 27% | ~8 hrs |
| **Lightning Web Components Specialist** | UI 25% | ~6 hrs |

### Real-World Lab Projects

1. **Trigger Framework Lab** — Build a trigger handler pattern (TriggerHandler base class) for an Account/Opportunity use case with bulkification, recursion prevention, and 100% test coverage
2. **LWC CRUD App** — Build a contact management LWC with list view, create/edit modal, delete with toast notifications — no page refresh
3. **Flow Automation Lab** — Replace a trigger with a Record-Triggered Flow + Invocable Apex combo for a business approval process
4. **Deployment Lab** — Use SFDX CLI to deploy to scratch org, run tests, validate in sandbox, promote to production

### GitHub Sample Apps

| Repo | Purpose |
|------|---------|
| `github.com/trailheadapps/lwc-recipes` | 50+ LWC patterns with examples |
| `github.com/trailheadapps/dreamhouse-lwc` | Full real-estate app in LWC |
| `github.com/trailheadapps/ebikes-lwc` | E-commerce LWC reference app |

### Video Resources

| Resource | URL |
|----------|-----|
| Salesforce Developers YouTube | `youtube.com/@SalesforceDevelopers` |
| Salesforce+ Cert Days: PDI | `salesforce.com/plus` → search "Platform Developer I Cert Day" |
| Apex Hours (community) | YouTube — free live coding sessions |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| No prior Salesforce experience | 150–200 hrs |
| Admin/App Builder certified | 80–120 hrs |
| 1–2 years Salesforce dev | 40–60 hrs |

---

## 2. JavaScript Developer I

### Exam Details

| Field | Value |
|-------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 105 minutes |
| Passing Score | 65% |
| Cost | $200 (retake $100) |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Variables, Data Types, and Collections | 23% |
| Objects, Functions, and Classes | **25%** |
| Browser and Events | 17% |
| Asynchronous Programming | 13% |
| Server-Side JavaScript | 8% |
| Testing | 7% |
| Debugging and Error Handling | 7% |

### Official Trailhead Path

| Module | Duration |
|--------|----------|
| Lightning Web Components Basics | ~1 hr 10 min |
| Lightning Web Components Tests | ~1 hr 35 min |
| LWC Troubleshooting | ~45 min |
| Platform API Basics | ~1 hr 35 min |

**Critical external resources (exam tests raw JS, not just Salesforce):**
- MDN Web Docs: `developer.mozilla.org` — definitive JS reference
- javascript.info — comprehensive ES6+ tutorial
- You Don't Know JS (free): `github.com/getify/You-Dont-Know-JS`

### Superbadges

| Superbadge | Maps To | Est. Time |
|-----------|---------|-----------|
| **LWC Specialist** | Shadow DOM, events, wire | ~6 hrs |

### Real-World Lab Projects

1. **Shadow DOM Deep Dive** — Build LWC components that communicate via CustomEvents up/down the component tree, test with Jest
2. **Async Patterns Lab** — Refactor callback-based code to Promises, then to async/await; handle errors with try/catch
3. **Node.js Microservice** — Build a simple Express REST endpoint that calls the Salesforce REST API via Connected App OAuth
4. **LWC Jest Suite** — Write full Jest test coverage for an existing LWC component including mocked wire adapters

### GitHub Labs

| Repo | Purpose |
|------|---------|
| `github.com/trailheadapps/lwc-recipes` | LWC with Jest tests built-in |
| `github.com/getify/You-Dont-Know-JS` | Deep JS fundamentals |
| `javascript30.com` | 30 vanilla JS browser projects (no frameworks) |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| No JavaScript background | 150–200 hrs |
| General JS developer (non-Salesforce) | 30–50 hrs |
| LWC developer | 20–35 hrs |

---

## 3. Platform Developer II (PDII)

### Exam Details

| Field | Value |
|-------|-------|
| Questions | 60 multiple-choice / multi-select |
| Time Limit | 120 minutes |
| Passing Score | 65% |
| Cost | $400 (retake $200) |
| **Prerequisite** | **PDI required** |

### Topic Weights

| Topic | Weight |
|-------|--------|
| Logic and Application Design | **28%** |
| User Interface | 20% |
| Process Automation and Logic | 20% |
| Integration Patterns | 12% |
| Salesforce Data | 7% |
| Testing | 7% |
| Performance | 6% |

### Critical Topics to Master

- **Design Patterns (28%):** Strategy, Decorator, Factory, Singleton in Apex; trigger frameworks; dynamic Apex (`Schema`, `describe`)
- **Integration (12%):** REST/SOAP callouts, named credentials, Platform Events, Change Data Capture, Streaming API
- **Async Apex:** Batch, Queueable, Scheduled, Future — chaining, limits, error handling

### Official Trailhead Path

**Trail — Developer Advanced** (~10 hrs 55 mins)
`trailhead.salesforce.com/content/learn/trails/force_com_dev_advanced`

| Module | Duration |
|--------|----------|
| Asynchronous Apex | ~3 hr 30 min |
| Apex Integration Services | ~2 hr |
| Platform Events Basics | ~50 min |
| Lightning Web Component Troubleshooting | ~45 min |
| Lightning Web Components Tests | ~1 hr 35 min |
| Platform Cache Basics | ~45 min |

### Superbadges

| Superbadge | Maps To | Est. Time |
|-----------|---------|-----------|
| **Apex Specialist** | Design patterns, triggers, async | ~7 hrs |
| **LWC Specialist** | Advanced LWC, UI domain 20% | ~6 hrs |
| **Process Automation Specialist** | Invocable Apex, automation | ~8 hrs |

### Real-World Lab Projects

1. **Trigger Framework** — Implement a full TriggerHandler framework with bypass logic, recursion control, and unit tests at 90%+ coverage
2. **Async Batch Job** — Build a Batchable + Schedulable Apex job to process 100k+ records nightly with error logging
3. **Platform Events Integration** — Publish/subscribe Platform Events between two Salesforce orgs or an external Node.js app
4. **REST API Callout** — Apex HTTP callout with named credentials, mock callout in tests, retry logic, error handling
5. **LWC Architecture** — Multi-component app with a LWC service component pattern (shared state without framework)

### GitHub Labs

| Repo | Purpose |
|------|---------|
| `github.com/trailheadapps/apex-recipes` | Canonical Apex patterns cookbook |
| `github.com/trailheadapps/streaming-monitor` | Platform Events demo app |
| `github.com/forcedotcom/sfdx-simple` | SFDX project templates |

### Estimated Study Time

| Background | Hours |
|-----------|-------|
| Recently passed PDI, limited advanced dev | 100–150 hrs |
| 2–3 years Salesforce dev experience | 60–90 hrs |
| Senior Salesforce developer | 30–50 hrs |

---

## Developer Environment Setup

### Step 1: Install Tools
```bash
# Salesforce CLI
npm install -g @salesforce/cli

# VS Code Extensions
# Install: Salesforce Extension Pack (Expanded) from VS Code marketplace

# Verify
sf --version
```

### Step 2: Create a Trailhead Playground
1. Go to `trailhead.salesforce.com`
2. Click your avatar → Hands-On Orgs → Create Playground
3. Get login credentials from the playground

### Step 3: Create a Scratch Org (for serious dev)
```bash
sf org create scratch --set-default --definition-file config/project-scratch-def.json --alias my-scratch-org --duration-days 30
sf org open --target-org my-scratch-org
```

### Step 4: Clone Reference Apps
```bash
git clone https://github.com/trailheadapps/lwc-recipes
git clone https://github.com/trailheadapps/apex-recipes
git clone https://github.com/trailheadapps/dreamhouse-lwc
```

---

## Key Links

| Resource | URL |
|----------|-----|
| PDI Credential Page | `trailhead.salesforce.com/credentials/platformdeveloperi` |
| PDII Credential Page | `trailhead.salesforce.com/credentials/platformdeveloperiI` |
| JS Dev I Credential Page | `trailhead.salesforce.com/credentials/javascriptdeveloperi` |
| Exam Registration | `webassessor.com/salesforce` |
| Developer Beginner Trail | `trailhead.salesforce.com/content/learn/trails/force_com_dev_beginner` |
| Developer Intermediate Trail | `trailhead.salesforce.com/content/learn/trails/force_com_dev_intermediate` |
| Developer Advanced Trail | `trailhead.salesforce.com/content/learn/trails/force_com_dev_advanced` |
| LWC Developer Docs | `developer.salesforce.com/docs/component-library/documentation/en/lwc` |
| apex-recipes | `github.com/trailheadapps/apex-recipes` |
| lwc-recipes | `github.com/trailheadapps/lwc-recipes` |
| Salesforce Developers YouTube | `youtube.com/@SalesforceDevelopers` |
| All Superbadges | `trailhead.salesforce.com/superbadges` |
