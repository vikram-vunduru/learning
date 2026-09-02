# Manual Sharing & Teams

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Manual Sharing is the last layer of the sharing model — record-by-record grants made by users (not automated rules). Teams are a structured version of this for specific objects.

**Manual Sharing:**
- Any user who has at least Read access to a record can manually share it with other users, groups, or roles
- Access can be granted as Read Only or Read/Write
- Available on: Accounts, Contacts, Opportunities, Cases, and custom objects
- The "Share" button appears on the record (visible when OWD is Private or Public Read Only)
- Manual shares are NOT removed when ownership changes — they persist until explicitly removed

**Account Teams:**
- A team of users who work together on an Account
- Each team member can have a different role (Account Manager, Sales Rep, Exec Sponsor)
- Each team member gets a specified access level (Read Only, Read/Write) on the Account AND its related Contacts, Opportunities, and Cases
- Default Account Team: a user can define their default team to auto-add when they own a new Account

**Opportunity Teams:**
- Similar structure for Opportunities
- Team members get access to the Opportunity record specifically
- Does NOT automatically cascade access to Account (unlike Account Teams)

**Case Teams:**
- Team on Cases for service scenarios
- Includes team roles you define (Support Engineer, Tier 2, etc.)
- Case Team Templates: pre-configured teams you can add to cases with one click

**Salesforce Territory Management (separate feature):**
- Account assignment to geographic/segment territories
- Users in a territory get access to Accounts assigned to that territory
- More advanced than role hierarchy — supports many-to-many assignment (one account in multiple territories, one user in multiple territories)

## PTA / SA Relevance

Teams are a middle ground between pure OWD/sharing rules and full Manual Sharing. In enterprise deals, the Opportunity Team is the right tool for tracking who worked a deal — useful for compensation, forecasting, and collaboration.

**A common pattern:** Many customers use Opportunity Teams as a reporting device for split credit (splits are tracked as team member contributions). If a customer mentions "team selling" or "split commission" in a requirements conversation, Opportunity Teams (or a Revenue Splits module with a managed package) is the answer.

**Manual Sharing at scale is an anti-pattern:** If users are manually sharing thousands of records, that's a sign the sharing model design is wrong. Sharing Rules should handle systematic patterns. Manual Sharing is for exceptions — a one-off grant when someone needs temporary access to a specific record.

## Architecture / How It Works

```
Manual Sharing & Teams in the Sharing Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OWD → Role Hierarchy → Sharing Rules → MANUAL SHARING/TEAMS

  Manual Share:
  ┌──────────────────────────────────────────┐
  │  Record Owner (or user with R/W access)  │
  │     │                                    │
  │     └── Share with: User / Role / Group  │
  │         Access: Read Only | Read/Write   │
  │                                          │
  │  Persists even after ownership change    │
  └──────────────────────────────────────────┘

  Account Team:
  ┌──────────────────────────────────────────┐
  │  Account                                 │
  │  ├── Team Member 1 (Exec Sponsor, R/W)   │
  │  ├── Team Member 2 (Sales Rep, RO)       │
  │  └── Access cascades to:                 │
  │       - Related Contacts                 │
  │       - Related Opportunities            │
  │       - Related Cases                    │
  └──────────────────────────────────────────┘

  Opportunity Team:
  ┌──────────────────────────────────────────┐
  │  Opportunity                             │
  │  ├── Team Member 1 (Deal Lead, R/W)      │
  │  ├── Team Member 2 (SE, Read Only)       │
  │  Does NOT auto-cascade to Account        │
  └──────────────────────────────────────────┘
```

**Limitations:**
- Manual Sharing requires the user sharing to have at least Read access (can't share what you can't see)
- Manual Sharing doesn't auto-remove when ownership changes
- Account Teams cascade access to Contacts, Opportunities, and Cases — but only for the related records on that specific Account
- No Opportunity Team template feature (Account Teams have default templates, Case Teams have pre-built templates)
- Territory Management is a licensed add-on feature (Enterprise Territory Management) — not available in all editions

## Key Facts to Memorize

- Manual Sharing = record-by-record grants by users with at least Read access
- Manual shares persist after ownership changes
- Account Team = cascades access to related Contacts, Opps, Cases
- Opportunity Team = access to that Opportunity only (no cascade to Account)
- Case Team Templates = pre-configured teams for fast case assignment
- Default Account Team = auto-added to Accounts when a user becomes the owner
- Manual sharing can grant: Read Only or Read/Write
- Available on: Accounts, Contacts, Opportunities, Cases, custom objects

## Exam Traps

- **"Manual sharing is automatically removed when record ownership changes"** — FALSE. Manual shares persist until explicitly deleted.
- **"Opportunity Teams automatically give access to the parent Account"** — FALSE. Only Account Teams cascade to related records. Opportunity Teams grant Opportunity-level access only.
- **"Any user can manually share a record they can read"** — TRUE (this is the correct behavior — users need at least Read access to share).
- **"Case Team Templates are permanent teams that can't be changed"** — FALSE. They're templates — you can add/change members per case.

## Practice Questions

**Q:** A sales rep shares an Opportunity with an external consultant temporarily. The Account is then transferred to a new owner. Can the consultant still access the Opportunity?
**A:** Yes. Manual shares persist after ownership changes. The consultant retains access until the manual share is explicitly removed.

**Q:** An Account Executive wants a solution engineer to automatically have access to all their Accounts when they become the account owner. What feature supports this?
**A:** Default Account Team. The AE sets up their default team to include the SE, and that team is automatically added when they own a new Account.

**Q:** What is the difference between an Account Team and an Opportunity Team in terms of access scope?
**A:** Account Team access cascades to the Account plus all related Contacts, Opportunities, and Cases. Opportunity Team access is limited to that specific Opportunity — it does not grant access to the parent Account.
