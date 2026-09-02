# Accounts & Contacts

## Exam Domain
Sales & Marketing Apps — 12% of exam

## Core Concepts

**Account:** Represents an organization (company) your business has a relationship with — customers, partners, competitors. The central object in the CRM data model.

**Contact:** An individual person associated with an Account. Contacts should be linked to an Account (though the relationship is a Lookup, so it's optional — "private contacts" exist without an account).

**Account Hierarchy:**
- Accounts can have Parent Accounts
- Creates a hierarchy for large corporations with subsidiaries
- Rollup: Revenue can be viewed hierarchically (total revenue across an account family)
- View: Account record → View Hierarchy button

**Person Accounts:**
- Merges Account + Contact into a single record for B2C (business-to-consumer) use cases
- Enabled once — **irreversible** (cannot disable Person Accounts once enabled)
- Requires a record type: "Business Account" for companies, "Person Account" for individuals
- Person Account has both Account and Contact fields on one record
- **Not available by default** — must be enabled by Salesforce Support

**Contact Hierarchy:**
- Contacts have a "Reports To" field (Lookup to Contact) for org chart modeling
- No native roll-up summary (it's a Lookup, not M-D)
- Used for enterprise sales to track influencers, decision makers, champions

**Key Account fields to know:**
- Account Name (required)
- Account Type (picklist: Prospect, Customer, Partner, etc.)
- Industry, Annual Revenue, Number of Employees
- Parent Account (self-referential Lookup)
- Account Owner

## PTA / SA Relevance

The Account model decision is fundamental: B2B (Account + Contact model) vs B2C (Person Account model). Getting this wrong means either:
1. Enabling Person Accounts when you don't need it (irreversible contamination of the data model)
2. Not having Person Accounts when you do need it (B2C company manually creating "dummy" account records for every consumer — terrible UX)

**Enterprise Account hierarchies:** Global companies with parent/subsidiary structures need thoughtful hierarchy design. Opportunities roll up to the account that owns them, not automatically to parent accounts. If the customer needs consolidated pipeline reporting across a parent account family, they need either Roll-Up Summary fields (requires M-D, which Account hierarchy isn't) or reports with account hierarchy filters.

**Private contacts (no Account):** Some implementations accidentally create thousands of contacts with no account association. These "orphaned contacts" are a data quality problem. Validation rules to require Account on Contact creation are often needed.

## Architecture / How It Works

```
Account-Contact Model
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  B2B MODEL (Standard):
  ┌─────────────────┐
  │ Account         │ ← Organization
  │ (ACME Corp)     │
  └────────┬────────┘
           │ (Lookup, optional)
    ┌──────┴──────────┐
    │                 │
  ┌─┴───────┐   ┌─────┴──────┐
  │ Contact │   │ Contact    │
  │ (Alice) │   │ (Bob)      │
  └─────────┘   └────────────┘

  B2C MODEL (Person Accounts):
  ┌─────────────────────────────────┐
  │ Person Account                  │
  │ (combines Account + Contact)    │
  │ Name: John Smith                │
  │ Email, Phone (Contact fields)   │
  │ Annual Revenue (Account fields) │
  └─────────────────────────────────┘

  Account Hierarchy:
  ┌─────────────────────┐
  │ Alphabet Inc (top)  │
  └──────────┬──────────┘
             │ Parent Account
    ┌─────────┴──────────┐
    │                    │
  ┌─┴───────┐    ┌───────┴───┐
  │ Google  │    │ Waymo     │
  │ LLC     │    │ LLC       │
  └─────────┘    └───────────┘
```

**Limitations:**
- Person Accounts: irreversible once enabled; affects many integrations (Person Account IDs appear in both Account and Contact SOQL queries)
- Account hierarchy: no automatic roll-up of revenue/pipeline to parent accounts natively
- Contacts with no Account = "private contacts" — reduced visibility and reporting capability
- Account-Contact relationship is a Lookup (not M-D) — no cascade delete, no roll-up summary
- Maximum Account hierarchy depth: no hard limit, but deep hierarchies impact report performance

## Key Facts to Memorize

- Account = organization; Contact = individual person at an organization
- Account-Contact = Lookup relationship (optional — contacts can exist without accounts)
- Person Accounts = B2C model, merges Account+Contact; **irreversible once enabled**
- Account hierarchy: Parent Account field (self-referential Lookup)
- Contact "Reports To" field = Contact-to-Contact hierarchy (Lookup)
- Enabling Person Accounts requires Salesforce Support activation
- Deleting an Account with related Contacts does NOT automatically delete Contacts (Lookup, not M-D)

## Exam Traps

- **"Person Accounts can be disabled after enabling"** — FALSE. Enabling Person Accounts is irreversible.
- **"Contacts must always be linked to an Account"** — FALSE. The Account lookup on Contact is optional — "private contacts" can exist.
- **"Deleting an Account automatically deletes all related Contacts"** — FALSE. Account-Contact is a Lookup. Contacts stay, their Account field is nulled.
- **"Account hierarchy automatically rolls up Opportunity amounts to parent accounts"** — FALSE. No native roll-up for Lookup hierarchy. Requires custom reporting with hierarchy filters.
- **"Person Accounts are available in all editions by default"** — FALSE. Must be specifically enabled by Salesforce Support.

## Practice Questions

**Q:** A retail company sells directly to individual consumers. They find it awkward to create a dummy "company" account for every customer just to have a contact. What Salesforce feature addresses this?
**A:** Person Accounts — merges Account and Contact into a single record for B2C scenarios.

**Q:** An admin accidentally enables Person Accounts in Production. Can they reverse this?
**A:** No. Enabling Person Accounts is irreversible. This is a critical point — always test this kind of configuration in Sandbox first.

**Q:** A company wants to see all Opportunities for "ACME Corp" including all subsidiaries in the Account hierarchy. What is the best approach?
**A:** Use account hierarchy filters in Reports (with hierarchy enabled) or enable the Opportunity roll-up to parent accounts via a third-party app or custom solution. Native reports support "View Hierarchy" but roll-up amounts require additional configuration.

**Q:** What is the relationship type between Account and Contact in standard Salesforce?
**A:** Lookup relationship. Not Master-Detail — Contacts are not automatically deleted when the Account is deleted, and there's no roll-up summary capability.
