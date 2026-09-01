# L21: Quotes & Contracts

## 🎯 Learning Objectives
- Explain the Quotes object, quote syncing, and the one-active-sync limitation
- Describe Quote PDFs, quote templates, and quote line items
- Configure and manage Contracts, including activation, status lifecycle, and Orders

## 📊 SLIDES

### Slide 1: The Quotes Object
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │                      QUOTE RECORD                            │
  ├────────────────────────┬─────────────────────────────────────┤
  │ Quote Name             │ Acme Corp Q3 Proposal v2            │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Opportunity Name       │ Acme Corp – Platform License        │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Status                 │ Presented                           │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Expiration Date        │ 09/15/2025                          │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Billing Address        │ 123 Main St, San Francisco CA       │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Shipping Address       │ 456 Oak Ave, San Francisco CA       │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Discount               │ 10%                                 │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Grand Total            │ $67,500                             │
  └────────────────────────┴─────────────────────────────────────┘
  Quote is always associated with a parent Opportunity
  Multiple quotes can exist per Opportunity; only one can sync
```
**Content:**
- Quotes allow sales reps to present pricing proposals formally to customers
- A Quote is always associated with a parent Opportunity
- Key fields: Quote Name, Status, Expiration Date, Billing Address, Shipping Address, Discount, Grand Total
- Quote Status picklist: Draft, Needs Review, In Review, Approved, Rejected, Presented, Accepted, Denied
- Quote line items mirror the Opportunity's products but can be modified independently
**Speaker Notes:** Quotes are the formal pricing document within Salesforce. They sit under an Opportunity and can have their own line items, discounts, and expiration dates. Multiple quotes can exist under one Opportunity, but only one can be synced at a time.

### Slide 2: Quote Line Items
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────────┐
  │                        QUOTE LINE ITEMS                              │
  ├──────────────────────┬──────────┬────────────┬────────────┬──────────┤
  │ Product Name         │ Quantity │ Unit Price │ Discount % │ Total    │
  ├──────────────────────┼──────────┼────────────┼────────────┼──────────┤
  │ Platform License     │    5     │ $10,000    │  10%       │ $45,000  │
  ├──────────────────────┼──────────┼────────────┼────────────┼──────────┤
  │ Implementation Svc   │    1     │ $15,000    │  10%       │ $13,500  │
  ├──────────────────────┼──────────┼────────────┼────────────┼──────────┤
  │ Training Package     │    2     │  $5,000    │  10%       │  $9,000  │
  ├──────────────────────┼──────────┼────────────┼────────────┼──────────┤
  │                      │          │            │ Grand Total│ $67,500  │
  └──────────────────────┴──────────┴────────────┴────────────┴──────────┘

  Pricing comes from the Price Book on the parent Opportunity
  Can be modified independently from Opportunity Products (unless synced)
  Created from Opportunity: Opp Products are copied to Quote Line Items
```
**Content:**
- Quote Line Items are products added directly to the Quote record
- When a Quote is created from an Opportunity, the Opportunity Products are copied to Quote Line Items
- Quote Line Items can be modified without affecting the Opportunity's product list (unless synced)
- Fields: Product, Quantity, Unit Price, Discount, List Price, Total Price, Description
- Pricing comes from the Price Book attached to the parent Opportunity
**Speaker Notes:** Quote Line Items give reps flexibility to adjust pricing, quantities, or discounts on the formal proposal without immediately changing the Opportunity's values. This is especially useful during negotiation, where multiple pricing scenarios may be presented to a customer.

### Slide 3: Quote Syncing — The One-Sync Rule
**Visual:**
```
  ┌───────────────────────────────────────────────────────────────┐
  │           OPPORTUNITY: Acme Corp – Platform License           │
  └───────────────────────────────────────────────────────────────┘
          │                     │                     │
          ▼                     ▼                     ▼
  ┌───────────────┐   ┌──────────────────┐   ┌───────────────┐
  │   Quote A     │   │    Quote B       │   │   Quote C     │
  │ (Scenario 1)  │   │  (Scenario 2)   │   │ (Scenario 3)  │
  │ Status: Sent  │   │                  │   │ Status: Draft │
  │               │   │ ◀══ SYNCED ══▶  │   │               │
  │               │   │  [Stop Sync]    │   │               │
  └───────────────┘   └──────────────────┘   └───────────────┘
                             ↕ bidirectional
                      Quote B changes → Opp Products update
                      Opp Products change → Quote B updates

  ─────────────────────────────────────────────────────────────
  ⚠ Only ONE quote can be synced at a time — KEY EXAM RULE
  To switch: [Stop Sync] on Quote B → [Start Sync] on Quote C
  Stopping sync does NOT delete or invalidate Quote B
```
**Content:**
- **Quote Sync:** Keeps one Quote and its parent Opportunity in sync (bidirectional updates)
- Only ONE quote can be synced to an Opportunity at any time
- Syncing: Quote record → Start Sync button
- When synced, changes to Quote Line Items update Opportunity Products, and vice versa
- To sync a different quote: Stop Sync on the current synced quote → Start Sync on the new quote
- Stopping a sync does not delete the quote — it just breaks the live connection
**Speaker Notes:** Quote Sync is a high-frequency exam topic. Remember that only one quote can be synced at a time. When synced, the quote and opportunity stay in lockstep. If a manager presents two different pricing scenarios, only one can be the "live" version synced to the opportunity pipeline.

### Slide 4: Quote PDFs & Quote Templates
**Visual:**
```
  ┌─────────────────────────────────────────────────────────────┐
  │  [COMPANY LOGO]                       Quote #: Q-00042      │
  │  Your Company Name                    Date:  08/15/2025      │
  │  123 Business Blvd                    Expires: 09/15/2025    │
  ├─────────────────────────────────────────────────────────────┤
  │  Prepared for: Acme Corporation                             │
  │  Contact: Jane Doe, VP of Operations                        │
  ├──────────────────────────┬──────────┬──────────┬────────────┤
  │ Product                  │ Qty      │ Unit     │ Total      │
  ├──────────────────────────┼──────────┼──────────┼────────────┤
  │ Platform License         │ 5        │ $10,000  │ $50,000    │
  │ Implementation Services  │ 1        │ $15,000  │ $15,000    │
  │ Training Package         │ 2        │  $5,000  │ $10,000    │
  ├──────────────────────────┴──────────┼──────────┼────────────┤
  │                          Subtotal   │          │ $75,000    │
  │                          Discount   │   10%    │  -$7,500   │
  │                          TOTAL      │          │ $67,500    │
  ├─────────────────────────────────────────────────────────────┤
  │  Signature: _______________________  Date: _____________    │
  └─────────────────────────────────────────────────────────────┘
  Quote record → Generate PDF → Select Template → Save to Quote
  Setup: Setup → Quote Templates (admins create/manage templates)
```
**Content:**
- Quote PDF allows generating a polished document to send to customers
- Quote Templates define the layout and content of the PDF (header, body, footer, line item columns)
- Setup path: Setup → Quote Templates → New
- Content can include static text, merge fields, line items table, signature block
- Quote PDFs are generated from the Quote record → Generate PDF → Save to Quote
- Saved PDFs appear in the Quote PDFs related list and can be emailed directly
**Speaker Notes:** Quote Templates are the design layer for customer-facing proposals. Admins create and manage templates; sales reps select the template when generating a PDF. You can have multiple templates for different use cases — standard proposals, executive summaries, or partner quotes.

### Slide 5: The Contract Object
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │                    CONTRACT RECORD                           │
  ├────────────────────────┬─────────────────────────────────────┤
  │ Account Name           │ Acme Corporation                    │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Status                 │ Activated                           │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Contract Start Date    │ 10/01/2025                          │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Contract Term (months) │ 24                                  │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Contract End Date      │ 09/30/2027  (auto-calculated)       │
  │                        │  = Start Date + Term months         │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Contract Number        │ 00000042                            │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Owner                  │ Alice Johnson                       │
  └────────────────────────┴─────────────────────────────────────┘
  Contract is linked to an Account (not directly to an Opportunity)
```
**Content:**
- Contracts are formal agreements between your company and a customer (Account)
- Related to an Account (not directly to an Opportunity)
- Key fields: Status, Contract Start Date, Contract Term (in months), Contract End Date (auto-calculated), Contract Number, Billing Address
- Contract Status lifecycle: Draft → In Approval Process → Activated
- Only Activated contracts can have Orders created against them
- Contract End Date is calculated: Start Date + Contract Term months
**Speaker Notes:** The Contract object is simpler than it sounds. Admins need to know the status lifecycle and the rules around activation. A contract must be manually activated — it does not happen automatically. Once activated, the contract cannot be deleted.

### Slide 6: Contract Activation Rules
**Visual:**
```
  ┌──────────┐                            ┌──────────────────────────┐
  │  DRAFT   │──── manual activation ────▶│       ACTIVATED          │
  │          │    (or approval process)   │                          │
  └──────────┘                            │  🔒 CANNOT BE DELETED    │
       │                                  │  Orders can now be       │
       ▼                                  │  created against it      │
  [Can be deleted                         └──────────────────────────┘
   in Draft status]
  
  With Approval Process:
  ┌──────────┐    Submit      ┌──────────────────┐   Approved    ┌───────────┐
  │  DRAFT   │──────────────▶│ IN APPROVAL      │─────────────▶ │ ACTIVATED │
  │          │               │ PROCESS          │               │           │
  └──────────┘               └──────────────────┘               └───────────┘
                                      │ Rejected
                                      ▼
                                  Back to Draft

  ⚠ Activated Contracts CANNOT be deleted (exam key fact)
  Contract Owner CAN be changed even after activation
```
**Content:**
- Contract Status must be changed to "Activated" manually or through an approval process
- Once Activated: the contract cannot be deleted (only deactivated by changing status — but standard Salesforce doesn't allow reverting from Activated)
- Activated contracts can have Orders associated with them
- Contracts can have an approval process for legal/management sign-off before activation
- Contract Owner can be changed even after activation
**Speaker Notes:** The no-delete rule on Activated contracts is specifically tested on the exam. The logic is: an activated contract is a legally binding record — you don't delete legal agreements. Reps and admins must be trained accordingly.

### Slide 7: Orders
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │                      ORDER RECORD                            │
  ├────────────────────────┬─────────────────────────────────────┤
  │ Account                │ Acme Corporation                    │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Contract               │ 00000042  [Lookup →]                │
  │                        │ ⚠ Must be an ACTIVATED contract     │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Status                 │ Draft  ──▶  Activated               │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Order Start Date       │ 10/01/2025                          │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Order End Date         │ 09/30/2026                          │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Price Book             │ Enterprise Price Book               │
  ├────────────────────────┼─────────────────────────────────────┤
  │ Type                   │ Standard  (or Reduction)            │
  └────────────────────────┴─────────────────────────────────────┘

  Standard Order  = new purchase agreement
  Reduction Order = decrease or cancel units from a Standard Order
  ─────────────────────────────────────────────────────────────────
  Draft Orders:     CAN be deleted
  Activated Orders: CANNOT be deleted  (same rule as Contracts)
```
**Content:**
- Orders represent agreed-upon purchases or reductions related to a Contract
- Order Types: **Standard Order** (a purchase), **Reduction Order** (a decrease/cancellation of a standard order)
- Orders can be created only against Activated contracts
- Order Status: Draft → Activated
- **Activated Orders cannot be deleted** (same rule as Contracts)
- Reduction Orders must reference the standard order they are reducing
**Speaker Notes:** Orders are often paired with Contracts in CPQ (Configure, Price, Quote) workflows. The key exam facts: orders require an activated contract, reduction orders cancel or reduce standard orders, and activated orders cannot be deleted. Draft orders CAN be deleted.

### Slide 8: Admin Configuration for Quotes & Contracts
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │          QUOTES & CONTRACTS ADMIN SETUP CHECKLIST               │
  ├───┬──────────────────────────────────────────────────────────────┤
  │ 1 │ Enable Quotes                                                │
  │   │ Setup → Quote Settings → Enable Quotes                       │
  ├───┼──────────────────────────────────────────────────────────────┤
  │ 2 │ Add Quotes Related List to Opportunity Page Layout           │
  │   │ Object Manager → Opportunity → Page Layouts → Add "Quotes"   │
  │   │ ⚠ Reps won't see Quotes tab on Opps without this step       │
  ├───┼──────────────────────────────────────────────────────────────┤
  │ 3 │ Create Quote Templates                                       │
  │   │ Setup → Quote Templates → New                                │
  ├───┼──────────────────────────────────────────────────────────────┤
  │ 4 │ Enable Orders                                                │
  │   │ Setup → Order Settings → Enable Orders                       │
  ├───┼──────────────────────────────────────────────────────────────┤
  │ 5 │ Enable Reduction Orders (optional)                           │
  │   │ Setup → Order Settings → Enable Reduction Orders             │
  ├───┼──────────────────────────────────────────────────────────────┤
  │ 6 │ Manage Contract & Order Fields                               │
  │   │ Object Manager → Contract / Order → Fields & Relationships   │
  └───┴──────────────────────────────────────────────────────────────┘
```
**Content:**
- Enable Quotes: Setup → Quotes Settings → Enable Quotes
- Add Quotes related list to Opportunity page layout
- Create Quote Templates: Setup → Quote Templates
- Enable Orders: Setup → Order Settings → Enable Orders
- Enable Reduction Orders: Setup → Order Settings → Enable Reduction Orders
- Contract and Order fields are managed in Object Manager → Contract / Order
**Speaker Notes:** Quotes and Orders are not enabled by default in all orgs — admins must explicitly enable them. For the exam, know the Setup paths and remember to add the Quotes related list to the Opportunity layout after enabling — otherwise reps won't see it even though Quotes are enabled.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 21 — Quotes and Contracts. These two objects are part of the later stages of the sales cycle — once a deal is moving toward close, you're presenting formal quotes and eventually signing contracts. Let's dig in.

Quotes live under Opportunities. When a sales rep is ready to present pricing to a customer, they create a Quote from the Opportunity. The Quote has its own fields — status, expiration date, billing and shipping addresses — and its own line items. Those line items start as a copy of the Opportunity's Products, but the rep can adjust them independently: change quantities, apply discounts, add or remove items.

Here's the key feature and the key limitation: Quote Sync. When you sync a Quote to its parent Opportunity, any change on the Quote Line Items automatically updates the Opportunity's Products, and vice versa. This keeps the pipeline data accurate. But only ONE quote can be synced at a time per Opportunity. If you need to switch to a different quote — say, because the customer requested a revised proposal — you stop sync on the current quote and start sync on the new one. Stopping sync doesn't delete or change the old quote; it just breaks the live connection.

Quote PDFs are the customer-facing document. From the Quote record, you click Generate PDF, choose a template, and Salesforce creates a professional-looking PDF with your company's branding, the line items table, and pricing details. Quote Templates control this layout — admins create them in Setup under Quote Templates. You can have multiple templates for different purposes.

Now let's move to Contracts. A Contract is a formal agreement associated with an Account. It has a start date, a term in months, and an end date that Salesforce auto-calculates for you. The key lifecycle is: Draft → Activated. Moving to Activated is a manual step — or it can go through an approval process if legal review is required. Once a Contract is Activated, it cannot be deleted. That's an important rule for the exam.

Activated contracts unlock Orders. Orders represent the actual purchases made under a contract. There are two types: Standard Orders for new purchases, and Reduction Orders to decrease or cancel quantities from a Standard Order. Just like Contracts, once an Order is Activated, it cannot be deleted. Draft orders, however, can still be deleted.

From an admin configuration standpoint, Quotes are not automatically enabled — you go to Setup → Quote Settings to turn them on. You also need to add the Quotes related list to the Opportunity page layout, or reps won't see it even after enabling. Orders have their own Setting in Setup too, and Reduction Orders must be enabled separately.

The exam will test you on the one-sync-at-a-time rule for Quotes, the no-delete rule for Activated Contracts and Orders, and the requirement that Orders need an Activated Contract as their parent. Keep those three rules in mind and you'll handle the Quotes and Contracts questions confidently.

That wraps up Quotes and Contracts. Coming up next, we move into the Service and Support section starting with Cases and Case Management.

## 🔔 EXAM TIPS
- **Only one Quote can be synced per Opportunity:** Switching to a new synced quote requires stopping sync on the current one first.
- **Activated Contracts cannot be deleted:** Once activated, the record is permanent. Draft contracts can be deleted.
- **Activated Orders cannot be deleted:** Same rule — only Draft Orders are deletable.
- **Orders require an Activated Contract:** You cannot create an Order against a Draft contract.
- **Quote sync is bidirectional:** Changes on the Quote update the Opportunity Products AND vice versa.
- **Enable Quotes in Setup first, then add related list:** Enabling Quotes without updating page layouts means reps won't see the related list.

## ✅ LECTURE SUMMARY
- Quotes are formal pricing proposals under an Opportunity with their own line items, status, and expiration date
- Quote Sync links one Quote bidirectionally to its Opportunity; only one sync is active at a time
- Quote PDFs are generated using Quote Templates configured in Setup
- Contracts are agreements associated with Accounts; lifecycle is Draft → Activated
- Activated Contracts cannot be deleted
- Orders represent purchases under an Activated Contract; Standard Orders for new buys, Reduction Orders to cancel/reduce
- Activated Orders cannot be deleted; Draft Orders can
- Enable Quotes: Setup → Quote Settings; Enable Orders: Setup → Order Settings

## ❓ MINI QUIZ

**Q1:** A sales rep has three quotes on an Opportunity. Quote A is currently synced. The customer selects Quote B. What must the rep do to sync Quote B?
- A) Delete Quote A, then sync Quote B
- B) Click "Stop Sync" on Quote A, then click "Start Sync" on Quote B
- C) Mark Quote A as Rejected, which automatically makes Quote B the synced quote
- D) Only one quote can ever exist per Opportunity — the rep must edit Quote A
**Answer:** B — Only one Quote can be synced at a time. The rep must stop the sync on Quote A first, then start sync on Quote B. Stopping sync does not delete or invalidate Quote A.

**Q2:** An administrator is asked to allow the sales team to create Orders in Salesforce. The team reports they can see the Orders tab but cannot create an Order against a Contract. What is the most likely cause?
- A) The Contract is in Draft status and has not been Activated yet
- B) The user does not have the "Create Orders" permission
- C) Orders can only be created by System Administrators
- D) The Contract must be associated with an Opportunity before Orders can be created
**Answer:** A — Orders can only be created against Activated Contracts. If the Contract is still in Draft status, the system will not allow an Order to be associated with it. The Contract must be Activated first.

**Q3:** Which statement about Activated Contracts is TRUE?
- A) Activated Contracts can be deleted by System Administrators
- B) Activated Contracts automatically create a related Opportunity when activated
- C) Activated Contracts cannot be deleted
- D) Activated Contracts can be reverted to Draft status by editing the Status field
**Answer:** C — Once a Contract is moved to Activated status, it cannot be deleted by any user, including System Administrators. This protects the integrity of legally binding agreements in the system.
