# Opportunities & Products

## Exam Domain
Sales & Marketing Apps — 12% of exam

## Core Concepts

**Opportunity:** Represents a sales deal in progress. Tracks value, stage, close date, and probability.

**Key Opportunity fields:**
- **Stage** (required picklist): where in the sales process (Prospecting, Qualification, Proposal, Negotiation, Closed Won, Closed Lost)
- **Close Date** (required): expected or actual close date
- **Amount**: deal value
- **Probability**: auto-populated based on Stage, can be manually overridden
- **Forecast Category**: determined by Stage (Commit, Best Case, Pipeline, Omitted, Closed)

**The Stage → Probability → Forecast Category relationship:**
Each Stage value has a default Probability and a Forecast Category. You configure this mapping in: Setup → Opportunity Stages. This is what drives the forecast pipeline view.

**Products & Price Books:**
- **Product (Product2):** An item you sell. Has a standard price.
- **Price Book:** A catalog of products with specific prices. 
  - **Standard Price Book:** The default catalog; every product is added here first
  - **Custom Price Books:** Alternate pricing for different markets, regions, or customers
- **Price Book Entry:** The record linking a Product to a Price Book with a specific price
- **Opportunity Product (OpportunityLineItem):** The specific products added to an Opportunity from a Price Book

**Adding products to an Opportunity:**
1. Opportunity record → Products related list → "Add Products"
2. Select a Price Book (if org has multiple)
3. Choose products from that Price Book
4. Set quantity and adjust price if needed

**Quotes:**
- Generated from Opportunity Products
- Can be synced to the Opportunity (when Quote is "Synced," the Opportunity Amount updates from the Quote total)
- PDF generation available

## PTA / SA Relevance

Revenue Cloud (formerly CPQ + Billing) extends the basic Products model significantly. But for the admin exam, understanding the standard Products/Price Books model is the foundation.

**Price Book architecture in enterprise:** Global companies typically have: Standard Price Book (USD list price) + Regional Price Books (EUR, GBP, etc.) + Partner Price Books (discounted rates) + Customer-specific Price Books. The architecture decision: manage pricing in Salesforce vs. integrate with an ERP/CPQ system. For complex pricing (bundles, volume discounts, tiered pricing), the native Products model is too simple — that's where Revenue Cloud/CPQ comes in.

**Forecast visibility:** The Stage → Forecast Category mapping is one of the most common configuration conversations with Sales leaders. VPs want their own definition of what goes into Commit vs Best Case. This often leads to customized forecast categories and custom Stage picklist values.

## Architecture / How It Works

```
Opportunity → Products → Revenue Model
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OPPORTUNITY
  ┌───────────────────────────────────────────┐
  │  Stage ──────► Probability + Forecast Cat │
  │  Close Date                               │
  │  Amount (calculated from products or      │
  │           manual entry)                   │
  └─────────────────┬─────────────────────────┘
                    │ related list
                    ▼
  OPPORTUNITY PRODUCTS (Line Items)
  ┌───────────────────────────────────────────┐
  │  Product A  │  Qty: 5  │  Unit Price: $100│
  │  Product B  │  Qty: 2  │  Unit Price: $500│
  │  Total Amount: $1,500                     │
  └─────────────────┬─────────────────────────┘
                    │ pulled from
                    ▼
  PRICE BOOKS
  ┌─────────────────────────────────────────┐
  │  Standard Price Book (required)         │
  │    └── All products + list prices       │
  │  Custom Price Book (optional)           │
  │    └── Same products + different prices │
  └─────────────────────────────────────────┘

  Stage → Forecast Pipeline:
  Prospecting  → Pipeline    → 10%
  Qualification → Pipeline   → 20%
  Proposal     → Best Case   → 50%
  Negotiation  → Commit      → 90%
  Closed Won   → Closed      → 100%
  Closed Lost  → Omitted     → 0%
```

**Limitations:**
- An Opportunity can only use products from ONE Price Book (can switch but must remove existing products first)
- Standard Price Book cannot be deleted
- Custom Price Books are not available in Personal/Group Edition
- If an Opportunity has products, the Amount field is calculated from line items and cannot be manually edited
- Quote syncing: only ONE quote can be synced to an Opportunity at a time

## Key Facts to Memorize

- Stage, Close Date, and Name are required on Opportunity
- Stage → Probability (auto) + Forecast Category (configured)
- Forecast Categories: Pipeline, Best Case, Commit, Closed, Omitted
- Standard Price Book = default catalog (every Product added here first)
- An Opportunity uses ONE Price Book at a time
- Products on Opportunity = Opportunity Line Items (OpportunityLineItem object)
- To add products: must select a Price Book for the Opportunity first
- Quote sync = only one quote synced per Opportunity; synced quote updates Opportunity Amount

## Exam Traps

- **"You can have multiple quotes synced to one Opportunity at once"** — FALSE. Only one quote can be synced at a time.
- **"An Opportunity can have products from multiple Price Books simultaneously"** — FALSE. One Price Book per Opportunity (can change the Price Book by removing existing products first).
- **"Probability is always calculated automatically and cannot be changed"** — FALSE. The default probability comes from Stage, but sales reps can manually override it.
- **"Standard Price Book can be deleted"** — FALSE. Standard Price Book is permanent.
- **"Amount is always a manual field on Opportunity"** — FALSE. When products (line items) are added, Amount is automatically calculated from the product total.

## Practice Questions

**Q:** A sales rep adds products to an Opportunity and notices the Amount field is now grayed out and cannot be edited manually. Why?
**A:** Once products (Opportunity Line Items) are added to an Opportunity, the Amount field is automatically calculated from the sum of the product prices × quantities. It becomes read-only.

**Q:** A company wants to offer discounted prices to their partners versus list prices for direct customers. How should this be configured?
**A:** Create a Custom Price Book for partners with discounted prices. Assign the partner Price Book to Opportunities created with partner accounts. Keep Standard Price Book for direct customer Opportunities.

**Q:** What is the Forecast Category and how is it determined?
**A:** Forecast Category indicates how confident the organization is in the deal closing. It's automatically set based on the Opportunity Stage. Each Stage has a mapped Forecast Category (Pipeline, Best Case, Commit, Closed, Omitted). Configurable in Setup → Opportunity Stages.

**Q:** A manager wants Opportunities where Stage = "Negotiation" to appear in the "Commit" forecast category. Where is this configured?
**A:** Setup → Object Manager → Opportunity → Fields & Relationships → Stage → Edit each Stage value to set the Probability and Forecast Category.
