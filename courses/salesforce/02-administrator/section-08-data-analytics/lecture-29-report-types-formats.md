# Report Types & Custom Report Types

## Exam Domain
Data & Analytics — 14% of exam

## Core Concepts

A Report Type defines WHICH objects and fields are available to use in a report. Before you can run a report, you need a Report Type that connects the objects you want to query.

**Standard Report Types:**
- Pre-built by Salesforce for standard objects
- Examples: "Accounts," "Accounts with Contacts," "Opportunities," "Opportunities with Products," "Cases"
- Cannot be modified

**Custom Report Types:**
- Admin-created report types that define custom object combinations
- Use when standard report types don't cover your objects or relationship combinations
- Can include up to 4 related objects in a single report type
- Define: which fields are available, labels, groupings

**The "Must Have" vs "May or May Not Have" relationship:**
This is the most tested concept in Custom Report Types.

When defining a Custom Report Type with related objects, you choose for each relationship:
- **"A must have B":** Only show parent records that have at least one related B record
  - Like an INNER JOIN in SQL
  - Use when: you want to see which accounts HAVE contacts
- **"A may or may not have B":** Show all parent records, whether or not they have related B records
  - Like a LEFT OUTER JOIN in SQL
  - Use when: you want to see all accounts, with or without contacts (blanks show for those without)

**Example:** Report Type: "Accounts with or without Cases"
- "A may or may not have B" = shows ALL Accounts, with Case data blank for those with no cases
- "A must have B" = shows only Accounts that have at least one Case

**Where to create:** Setup → Report Types → New Custom Report Type

**Categories:** When creating a custom report type, you assign it to a Category (like "Customer Support Reports"). Users see report types organized by category.

## PTA / SA Relevance

Custom Report Types are one of the most underused admin capabilities. When users say "I can't see that field in my report" or "I need to report on both X and Y together but there's no standard report type," Custom Report Types are the answer.

**The 4-object limit is real:** Custom Report Types connect up to 4 objects. If a customer needs to report across 5+ related objects in one report, it can't be done in a single report — they'll need to use multiple reports, a Joined report, or move to CRM Analytics.

**Report type = data access contract:** The fields available in a report are determined by the report type. If a field doesn't appear in the report builder, check: (1) Is it on the report type? (2) Does FLS allow the running user to see it?

## Architecture / How It Works

```
Custom Report Type Structure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CUSTOM REPORT TYPE DEFINITION:
  ┌─────────────────────────────────────────┐
  │  Primary Object: Account                │
  │                                         │
  │  Related Object 1: Contact              │
  │    Relationship: may or may not have    │
  │    (LEFT JOIN — shows all accounts)     │
  │                                         │
  │  Related Object 2: Opportunity          │
  │    Relationship: must have              │
  │    (INNER JOIN — only accounts with opps│
  │                                         │
  │  Available Fields: [choose from all     │
  │    three objects]                       │
  └─────────────────────────────────────────┘

  Result when running:
  All Accounts that have at least ONE Opportunity
  WITH zero or more Contacts shown per account

  "Must Have" vs "May or May Not Have":
  ┌────────────────┬─────────────────────────┐
  │ Must Have      │ INNER JOIN              │
  │                │ Only parents WITH child │
  ├────────────────┼─────────────────────────┤
  │ May or May Not │ LEFT OUTER JOIN         │
  │ Have           │ ALL parents; blank for  │
  │                │ those without children  │
  └────────────────┴─────────────────────────┘
```

**Limitations:**
- Custom Report Types: max 4 related objects per report type
- Standard Report Types cannot be edited or deleted
- Custom Report Types take 24 hours to become available for use after creation (in some orgs — best practice is to create in advance)
- Fields not included in the report type definition cannot be added to reports using that type
- Report Types are not metadata that can be easily version-controlled (need to use Change Sets or Metadata API for deployment)

## Key Facts to Memorize

- Report Type = defines available objects + fields for a report
- Standard Report Types = pre-built, cannot modify
- Custom Report Types = admin-created, up to 4 objects
- "A must have B" = INNER JOIN (only parent records that have related records)
- "A may or may not have B" = LEFT OUTER JOIN (all parent records)
- Custom Report Types: up to 4 objects in chain
- Deploy Report Types via Change Sets for cross-sandbox/org movement

## Exam Traps

- **"You can add any field to a report regardless of the report type"** — FALSE. Only fields defined in the report type are available.
- **"Standard Report Types can be edited to add custom relationships"** — FALSE. Standard Report Types are locked. Create Custom Report Types for custom combinations.
- **"'Must have' includes parent records without children"** — FALSE. "Must have" only includes parents that have at least one child record (INNER JOIN).
- **"Custom Report Types support unlimited related objects"** — FALSE. Maximum 4 objects.

## Practice Questions

**Q:** An admin wants to report on all Accounts regardless of whether they have any open Cases. They also want to see the case count and most recent case date. What type of report type should they use?
**A:** Custom Report Type with Account as primary and Cases as related, using "Account may or may not have Cases" relationship. This ensures ALL accounts appear, with blank case data for those without cases.

**Q:** A report builder shows a field on the object in Object Manager but it doesn't appear in the report field selector. What are two possible causes?
**A:** (1) The field is not included in the Report Type definition (fields must be explicitly added to the Custom Report Type to appear). (2) FLS prevents the running user from accessing the field.

**Q:** What does the "A must have B" setting do in a Custom Report Type?
**A:** It creates an inner join — only parent records (A) that have at least one related child record (B) appear in the report. Parent records with no related B records are excluded.

**Q:** What is the maximum number of objects that can be included in a Custom Report Type?
**A:** 4 objects (1 primary + up to 3 related objects in a chain).
