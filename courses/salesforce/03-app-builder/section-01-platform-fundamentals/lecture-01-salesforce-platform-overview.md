# L01: Salesforce Platform Overview

## Exam Domain
Salesforce Fundamentals — 23% of exam weight

---

## Core Concepts

### PaaS and Multi-Tenancy
Salesforce is a Platform as a Service, not just CRM software. The key thing to understand is that thousands of companies share the same infrastructure — your org is logically isolated, but you share compute resources with everyone else. This is why governor limits exist: to prevent one tenant from consuming all shared resources and degrading performance for others.

### Metadata vs. Data
This distinction is foundational to everything in the exam. **Metadata** is the configuration of your org — object definitions, field definitions, flows, page layouts, validation rules. **Data** is the actual records users enter. When you create a custom field, you're creating metadata. When a user fills in that field on a record, they're creating data. Change sets and deployment tools move **metadata**, not data.

### Declarative vs. Programmatic Development
The platform has an explicit preference hierarchy: use standard features first, then declarative tools (Flow, formulas, validation rules, Lightning App Builder), then code (Apex, LWC) only when declarative tools can't solve the problem. As an App Builder, your toolbox is almost entirely declarative. The exam tests when to hand off to a developer, not how to write code.

### Governor Limits
Because Salesforce is multi-tenant, every transaction has runtime limits to protect shared resources. The two most relevant for declarative builders: **100 SOQL queries per transaction** and **150 DML operations per transaction**. A Flow that queries a record inside a loop will hit the SOQL limit. Well-designed automation avoids loop-query patterns.

### Releases
Salesforce delivers three major updates per year: **Spring** (Jan–Feb), **Summer** (May–Jun), **Winter** (Sep–Oct). These are automatic — your org is updated whether you're ready or not. Use sandbox preview (available 4–6 weeks before production) to test upcoming releases against your configuration before they hit production.

---

## PTA / SA Relevance

**In architecture reviews:** The most common partner mistake is jumping straight to Apex when a Flow would do the job. In a review, challenge every Apex trigger with "can this be a before-save Flow?" — because Flows are admin-maintainable and Apex isn't.

**For CTO conversations:** Frame the declarative-vs-code choice in terms of total cost of ownership. Declarative customizations survive Salesforce releases without code changes; Apex can break when API behavior changes. For a customer asking "should we hire a developer or an admin?", the answer depends on whether their requirements can be met declaratively.

**At enterprise scale:** Multi-tenancy means your customers share infrastructure. Governor limits that feel abstract in a Dev org become real at scale — a Fortune 500 running 50 flows on the same record save will hit CPU time limits. Architecture reviews at scale must include a governor limit impact assessment.

**Integration pattern tip:** Metadata (not data) moves between orgs via change sets or SFDX. Customers often confuse "deploying data" with "deploying configuration" — make sure data migration plans use Data Loader or ETL tools, never change sets.

---

## Architecture / How It Works

```
┌─────────────────────────────────────────────┐
│           YOUR APPS & APPEXCHANGE           │  ← You build here
├─────────────────────────────────────────────┤
│   PLATFORM: Metadata Engine · APIs · Runtime │  ← Customization layer
├─────────────────────────────────────────────┤
│ INFRASTRUCTURE: Servers · DB · Security Patches │  ← Salesforce manages
└─────────────────────────────────────────────┘
```

**Limitations:**
- You cannot change platform-level behavior — only configure via metadata
- You cannot opt out of Salesforce's three annual releases
- Governor limits are non-negotiable — design around them

```
Multi-Tenant Model:
┌──────────────────────────────────────────────┐
│        Shared Infrastructure (Salesforce)     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Org A  │  │  Org B  │  │  Org C  │  ...  │
│  │ Metadata│  │ Metadata│  │ Metadata│       │
│  └─────────┘  └─────────┘  └─────────┘       │
└──────────────────────────────────────────────┘
Each org is logically isolated. Metadata makes each org behave differently.
```

**Limitations:**
- Changes in one org never affect another org
- One org cannot hog shared resources — governor limits enforce fairness

```
Declarative-First Decision Flow:
Does standard functionality cover the need?
  │
  ├─ YES → Use it as-is
  │
  └─ NO → Can a declarative tool solve it?
            │
            ├─ YES → Flow / Formula / Validation Rule / App Builder
            │
            └─ NO → Apex / LWC / API  (last resort)
```

**Limitations:**
- Declarative tools cannot handle: complex multi-object transactions, dynamic SOQL, HTTP callouts in same-transaction logic
- Formula fields cannot store values independently; they recalculate on every read

---

## Key Facts to Memorize
- Salesforce = PaaS (Platform as a Service), not just CRM
- Multi-tenancy = shared infrastructure, logical isolation per org
- Customizations are stored as **metadata**, not code changes
- Three releases per year: Spring · Summer · Winter (automatic, cannot opt out)
- Governor limits: 100 SOQL queries / 150 DML operations per transaction
- Change sets and deployment tools move **metadata only** — not data records
- Sandbox preview available 4–6 weeks before production gets the release
- App Builder certification requires annual maintenance

---

## Exam Traps
- **Deployment moves metadata, not data.** If asked what change sets deploy between environments, the answer is metadata (configuration). Data migration requires separate tools (Data Loader).
- **Declarative first — always.** "What is the best approach?" questions almost always prefer Flow/formula over Apex unless the scenario explicitly requires something declarative tools cannot do.
- **3 releases per year, not annually.** If asked about update frequency, the answer is three times per year.
- **Querying in a loop hits governor limits.** A Flow that runs Get Records inside a Loop on 200 records will throw a governor limit error on SOQL queries.

---

## Practice Questions

**Q:** A company builds a record-triggered Flow that queries a related Account inside a loop processing 200 Opportunity records. What problem occurs?
**A:** The Flow exceeds the 100 SOQL queries per transaction governor limit and fails with a runtime error. Querying inside a loop generates one SOQL query per iteration.

**Q:** An App Builder creates a custom object and adds 10 custom fields to it. What has actually been created in Salesforce?
**A:** Metadata — the app builder created configuration that tells the platform how to structure and behave. No new database tables or code were written.

**Q:** A Flow is being built to update related records when an Opportunity is marked Closed Won. Should this use Apex or Flow?
**A:** Flow (Record-Triggered, After-Save). Declarative-first applies — Flow can update related records and send emails without code. Apex is only justified when Flow genuinely cannot meet the requirement.
