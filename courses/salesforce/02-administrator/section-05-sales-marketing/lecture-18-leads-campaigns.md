# Leads & Campaigns

## Exam Domain
Sales & Marketing Apps — 12% of exam

## Core Concepts

**Leads:**
A Lead is an unqualified prospect — someone who might become a customer but hasn't been qualified yet. Once qualified, a Lead is "converted" and creates (or links to) an Account + Contact + (optionally) Opportunity.

**Lead Conversion:**
- Creates: Account (new or existing), Contact (new or existing), Opportunity (optional)
- Lead record is marked as "Converted" — it still exists but is read-only
- Cannot convert the same lead twice
- Field mapping: Lead fields map to Account/Contact/Opportunity fields (configurable via Map Lead Fields)
- Lead Source field can carry forward to converted objects

**Web-to-Lead:**
- Generates an HTML form that captures prospect info from your website directly into Salesforce as Lead records
- Setup: Setup → Web-to-Lead → Generate HTML
- Daily limit: 500 web leads per day (default; can request increase)
- If limit exceeded: leads are lost (not queued) — they're dropped
- **Default Lead Creator:** A User that "owns" incoming web leads by default (set in Web-to-Lead settings)

**Lead Assignment Rules:**
- Route newly created/updated Leads to users or queues based on criteria
- Only ONE assignment rule can be active at a time
- Rules have multiple entries evaluated in order (first match wins)
- Can assign to User or Queue
- Assignment rules run when: manual assignment requested, web-to-lead creates the lead, or lead created via API with "Assign using assignment rules" flag

**Campaigns:**
- Marketing initiatives (email blast, trade show, webinar, etc.)
- Campaign Members = Leads or Contacts added to the Campaign
- Status tracks where in the campaign each member is (Sent, Responded, etc.)
- Campaign Influence: shows which campaigns contributed to closed opportunities
- Hierarchy: Campaigns can have parent campaigns for aggregate reporting

**Campaign Member Status:**
- Each campaign has its own status values (default: Sent, Responded)
- "Responded" = positive response; used for Campaign Responses metric
- Custom status values can be added and one can be set as "default"

## PTA / SA Relevance

Campaigns and Lead management are where marketing automation integrations land. The most common architecture pattern: a Marketing Automation Platform (Pardot/Marketing Cloud, Marketo, HubSpot) creates Leads and syncs them into Salesforce Campaigns. The native Web-to-Lead is for simple scenarios; enterprise customers use the MA platform forms that write directly to Salesforce via API.

**Web-to-Lead limitations in enterprise context:** The 500/day limit and lack of spam filtering make native Web-to-Lead insufficient for high-volume lead capture. Enterprise customers need a spam filtering layer (reCAPTCHA + a middleware step) before leads hit Salesforce. This is a design conversation to have early.

**Lead deduplication:** The Duplicate Management module (Matching Rules + Duplicate Rules) is critical for Lead capture flows. Every web form creates duplicates if dedup isn't configured. Flag this in every implementation where Web-to-Lead or external lead capture is used.

## Architecture / How It Works

```
Lead-to-Opportunity Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LEAD CAPTURE
  ┌──────────────────────────────────────────┐
  │  Web-to-Lead form (website)              │
  │  Manual entry                            │
  │  Import (Data Import Wizard)             │
  │  API / Integration                       │
  └─────────────────┬────────────────────────┘
                    │ Assignment Rule
                    ▼
  LEAD RECORD (unqualified)
  ┌──────────────────────────────────────────┐
  │  Status: New → Working → Qualified/Junk  │
  │  Assigned to User or Queue               │
  └─────────────────┬────────────────────────┘
                    │ Convert (when qualified)
                    ▼
  CONVERSION CREATES:
  ┌──────────────┐  ┌──────────┐  ┌──────────────┐
  │  Account     │  │ Contact  │  │ Opportunity  │
  │  (new or     │  │ (new or  │  │ (optional)   │
  │   existing)  │  │existing) │  │              │
  └──────────────┘  └──────────┘  └──────────────┘

  CAMPAIGN → CAMPAIGN MEMBERS
  ┌──────────────────────────────────────────┐
  │  Campaign (trade show, email blast, etc) │
  │    ├── Member: Lead A (Sent)             │
  │    ├── Member: Contact B (Responded)     │
  │    └── Member: Lead C (Sent)             │
  └──────────────────────────────────────────┘
```

**Limitations:**
- Web-to-Lead: 500 leads/day default limit (leads beyond limit are dropped, not queued)
- Web-to-Lead doesn't validate data — anything submitted creates a lead
- Lead Assignment Rules: only ONE rule active at a time
- Lead conversion cannot be reversed — converted leads remain as "Converted" status
- Campaign Members can be Leads OR Contacts, but not Accounts directly
- You cannot undo a lead conversion — the converted lead record is locked

## Key Facts to Memorize

- Lead conversion creates: Account + Contact + (optional) Opportunity
- Converted Lead = still exists, marked Converted, locked/read-only
- Web-to-Lead daily limit = 500 (default); leads dropped if exceeded
- One assignment rule active at a time; entries evaluated in order (first match wins)
- Can assign leads to: User or Queue (not both simultaneously per rule entry)
- Campaign Members = Leads + Contacts (both can be members)
- Campaign Influence tracks which campaigns influenced won opportunities
- Lead Source field maps to converted objects if configured

## Exam Traps

- **"When you convert a Lead, the Lead record is deleted"** — FALSE. Lead remains, marked as Converted.
- **"Web-to-Lead leads are queued if the daily limit is exceeded"** — FALSE. Leads are dropped (lost).
- **"Multiple assignment rules can be active at the same time"** — FALSE. Only one assignment rule can be active per object.
- **"Campaign Members can include Accounts"** — FALSE. Campaign Members are Leads or Contacts, not Accounts.
- **"Lead conversion always creates an Opportunity"** — FALSE. Opportunity creation during conversion is optional.

## Practice Questions

**Q:** A company's website generates 600 lead form submissions on a busy day. What happens to the leads beyond the 500/day Web-to-Lead limit?
**A:** Leads beyond 500/day are dropped — they are not queued and are lost. The admin needs to request a limit increase or implement a different lead capture solution.

**Q:** When a Lead is converted, which records can be created?
**A:** An Account (new or link to existing), a Contact (new or link to existing), and optionally an Opportunity.

**Q:** A marketing manager wants to track which campaign members responded positively to a campaign. What feature is used?
**A:** Campaign Member Status. Members with the "Responded" status (or any status marked as "Responded") count toward the campaign's responded metric.

**Q:** Multiple assignment rules have been created for Leads. Only one is set to Active. What happens to the other rules?
**A:** They are inactive and do not evaluate. Only the one active assignment rule runs. To use a different rule, activate it and deactivate the current one.
