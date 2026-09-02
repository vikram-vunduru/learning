# Salesforce Org Setup

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

The key thing to understand is that a Salesforce "org" is an isolated instance of Salesforce — it has its own data, configuration, users, and metadata. Everything you configure lives inside an org. There are different org types for different purposes, and knowing which is which is a frequent exam topic.

**Production org:** The live org your business runs on. Real data, real users, real consequences. You cannot experiment here.

**Sandbox orgs:** Copies of your Production org (or fresh orgs) used for development, testing, and training. They are *linked* to a Production org — they aren't standalone. There are four types:

| Sandbox Type | Storage | Refresh | What It Copies |
|---|---|---|---|
| Developer | 200 MB data / 10 MB files | 1 day | Metadata only |
| Developer Pro | 1 GB data / 10 MB files | 1 day | Metadata only |
| Partial Copy | 5 GB | 5 days | Metadata + sample of data (configurable) |
| Full | Same as Production | 29 days | Metadata + ALL data |

**Developer Edition (DE):** This is NOT a sandbox. It's a standalone free org created at developer.salesforce.com. It has no Production parent — you can't refresh it. It exists for personal learning and development. The exam loves to test whether you know DE is not a sandbox.

**Scratch Org:** Used with Salesforce DX / CLI. Source-driven, version-controlled, expires in 1–30 days. Not a sandbox either. Primarily for CI/CD pipelines.

## PTA / SA Relevance

In customer conversations, org strategy questions come up constantly: "How many sandboxes do we need?" The answer depends on the team size, release cadence, and budget (Full sandboxes cost money — they're not free like Developer sandboxes). 

For enterprise customers: the standard recommendation is Developer sandboxes for individual developers, a Partial or Full for UAT, and a staging Full sandbox for release validation. Scratch orgs belong in CI/CD pipelines, not in user acceptance testing.

**When a customer asks about environment strategy**, the key architectural principle is: never do configuration or code changes directly in Production. Every change should flow: Developer/Scratch → Integration/QA → Staging/UAT → Production.

## Architecture / How It Works

```
Salesforce Org Landscape
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PRODUCTION ORG (live, real data)
  ┌─────────────────────────────────────────┐
  │  Company Info, Users, All Config        │
  │  Data + Metadata                        │
  └──────────┬──────────────────────────────┘
             │ Refresh (creates a copy)
             ▼
  ┌─────────────────────────────────────────┐
  │           SANDBOX TYPES                 │
  │  ┌──────────┐  ┌──────────────────┐     │
  │  │Developer │  │  Developer Pro   │     │
  │  │(1 day)   │  │  (1 day)         │     │
  │  └──────────┘  └──────────────────┘     │
  │  ┌──────────┐  ┌──────────────────┐     │
  │  │ Partial  │  │  Full            │     │
  │  │ Copy     │  │  (29 days)       │     │
  │  │ (5 days) │  │  Same size as    │     │
  │  └──────────┘  │  Production      │     │
  │                └──────────────────┘     │
  └─────────────────────────────────────────┘

  STANDALONE (no Production parent):
  ┌──────────────┐  ┌──────────────────┐
  │ Developer    │  │  Scratch Org     │
  │ Edition      │  │  (DX/CLI,        │
  │ (free,       │  │   expires)       │
  │  learning)   │  │                  │
  └──────────────┘  └──────────────────┘
```

**Limitations:**
- Sandbox refresh **destroys all existing sandbox data** — you cannot recover it
- Partial Copy: you define a sandbox template to specify which records to copy — max 10,000 records per object
- Full sandbox: 29-day refresh means you can be up to a month out of sync with Production data
- Scratch orgs expire (max 30 days) and must be rebuilt from source — not suitable for user testing
- Developer Edition has a 5 MB data storage limit — not for production use

## Setup Navigation

**Setup** is the admin control center. Access: gear icon (⚙️) → Setup.

Key Setup areas to know:
- **Company Information:** Org name, namespace, default locale/timezone, licenses used/remaining
- **My Domain:** Custom Salesforce URL (required for Lightning components, OAuth SSO)
- **Users:** Create/manage users, assign profiles/roles
- **Object Manager:** All standard and custom objects
- **Security Center:** Health check, session settings
- **AppExchange:** Marketplace for apps/components (accessed from Setup or appexchange.salesforce.com)

## Key Facts to Memorize

- Developer Edition = NOT a sandbox; has no Production parent; created at developer.salesforce.com
- Sandbox refresh interval = minimum time between refreshes (not how often Salesforce refreshes automatically)
- Refresh DESTROYS all sandbox data and creates a fresh copy from Production
- Full sandbox = most expensive, same storage as Production, 29-day minimum refresh
- Partial Copy uses a "Sandbox Template" to select which object records to include
- Scratch orgs = source-driven, expire, for CI/CD, NOT for user testing
- **Company Information** is where you find your Org ID, licenses used, and default timezone
- My Domain is required before you can: install Lightning components, set up SSO, use certain AppExchange packages

## Exam Traps

- **"Developer Edition is a type of sandbox"** — FALSE. It's standalone, no Production parent, cannot be refreshed from Production.
- **"You should test config changes in Production"** — FALSE. Always sandbox first.
- **"Sandbox refresh copies all Production data into any sandbox type"** — FALSE. Developer/Developer Pro copy metadata only. Partial Copy copies a subset. Only Full copies everything.
- **"Scratch orgs are good for UAT testing with business users"** — FALSE. They expire and require CLI tooling to rebuild. UAT = Partial or Full sandbox.
- **"You can refresh a Full sandbox every day"** — FALSE. Minimum 29 days.

## Practice Questions

**Q:** A company's QA team needs an environment that mirrors Production data for user acceptance testing. Which sandbox type is most appropriate?
**A:** Full sandbox — it copies all metadata and all data from Production. Partial Copy could work if the team only needs a subset, but Full is the most complete option for UAT.

**Q:** A developer wants a free, standalone Salesforce environment to learn new features without affecting Production. What should they use?
**A:** Developer Edition org (developer.salesforce.com). NOT a sandbox — it has no Production parent.

**Q:** How often can you refresh a Developer sandbox at minimum?
**A:** Every 1 day (24 hours).

**Q:** What happens to existing data in a sandbox when you refresh it?
**A:** All existing sandbox data is permanently destroyed. The refresh creates a fresh copy from Production.

**Q:** Which org type is specifically designed for Salesforce DX source-driven development and CI/CD pipelines?
**A:** Scratch Org.
