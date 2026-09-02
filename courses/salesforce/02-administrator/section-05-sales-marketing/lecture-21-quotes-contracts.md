# Quotes & Contracts

## Exam Domain
Sales & Marketing Apps — 12% of exam

## Core Concepts

**Quotes:**
- Formal price proposals generated from Opportunity Products
- Created from: Opportunity → Quotes related list → New Quote
- Pulls in products from the Opportunity's selected Price Book
- Can generate a PDF quote document
- **Quote Sync:** When a Quote is synced to its Opportunity, changes to the Quote's line items automatically update the Opportunity's Amount
- Only **one Quote can be synced per Opportunity** at a time
- To sync a different Quote, you must "Un-sync" the current one first

**Quote Templates:** Pre-built templates for PDF quote generation with company branding/layout

**Contracts:**
- Formal agreements with customers (typically Account-based)
- Linked to Account (and can be linked to Opportunity)
- Key fields: Contract Start Date, Contract Term (months), Contract End Date (auto-calculated)
- Status: Draft → In Approval Process → Activated
- **Activated contracts cannot be edited** — they're locked for legal integrity
- Contract Management is typically the bridge between Sales (Opportunity) and Service (Account renewals)

**Orders:**
- Created from Contracts or directly from Accounts
- Represent the customer's purchase order or confirmed order
- Order Products = items ordered (similar to Opportunity Line Items)
- Order Status: Draft → Activated

## PTA / SA Relevance

Quotes and Contracts are the boundary between CRM and the order management/ERP world. For enterprise customers:

**Quote → Contract → Order flow is not always in Salesforce:** Many enterprises use DocuSign, Apttus/Conga CPQ, or Revenue Cloud for complex quoting and contracting. Native Salesforce Quotes are simple by enterprise standards — no advanced pricing rules, no complex bundling, no automated renewal logic.

**Contract lifecycle management:** The Activated contract lock is important for compliance — once signed, a contract should be immutable. When customers ask "how do we handle contract amendments?", the answer is usually: create a new Contract (Amendment) linked to the original, not edit the activated one.

## Architecture / How It Works

```
Quote-Contract-Order Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OPPORTUNITY
  │ (with products)
  ▼
  QUOTE (proposal)
  ├── Generate PDF
  ├── Sync to Opportunity (one at a time)
  └── ✓ Customer agrees
       ↓
  CONTRACT (signed agreement)
  ├── Draft → Activated (locked)
  └── Linked to Account
       ↓
  ORDER (fulfillment)
  ├── Draft → Activated
  └── Order Products

  Quote Sync Detail:
  ┌───────────────────────────────────────┐
  │  Quote A (SYNCED) ────► Opportunity   │
  │    Changes to Quote A line items      │
  │    automatically update Opp Amount    │
  │                                       │
  │  Quote B (unsynced) — separate        │
  │  Only ONE synced quote per Opp        │
  └───────────────────────────────────────┘
```

**Limitations:**
- Activated Contracts cannot be edited — they're locked
- Only one Quote can be synced to an Opportunity at a time
- Standard Quotes are basic — no advanced CPQ (bundling, volume pricing, approval thresholds) without Revenue Cloud/CPQ
- Contract End Date = Start Date + Term (in months) — auto-calculated when both start date and term are set

## Key Facts to Memorize

- Quotes = formal proposals created from Opportunity products
- Quote Sync = synced quote updates Opportunity Amount automatically
- Only ONE quote synced per Opportunity at a time
- Contracts = signed agreements, linked to Account
- Activated Contract = locked (cannot edit)
- Contract status flow: Draft → In Approval → Activated
- Orders created from Contracts or Accounts; Order status: Draft → Activated

## Exam Traps

- **"Multiple quotes can be synced to one Opportunity simultaneously"** — FALSE. Only one.
- **"An Activated Contract can be modified to fix an error"** — FALSE. Activated contracts are locked. You'd need to create an amendment or work with legal/support.
- **"Quotes are automatically created when products are added to an Opportunity"** — FALSE. Quotes must be manually created from the Opportunity.

## Practice Questions

**Q:** A sales rep has two quotes for an Opportunity — Quote A (synced) and Quote B. They want to sync Quote B instead. What must they do first?
**A:** Un-sync Quote A. Then sync Quote B. Only one quote can be synced at a time.

**Q:** An admin activates a Contract but then realizes there's a typo in the Contract Terms field. Can they fix it?
**A:** No. Activated contracts are locked and cannot be edited. They would need to create a new contract or work through a workaround (void and recreate if applicable).

**Q:** What happens to the Opportunity Amount when a synced Quote's line items are modified?
**A:** The Opportunity Amount is automatically updated to match the synced Quote's total.
