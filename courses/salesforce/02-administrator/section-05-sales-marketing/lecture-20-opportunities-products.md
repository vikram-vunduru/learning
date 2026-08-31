# L20: Opportunities & Products

## 🎯 Learning Objectives
- Explain Opportunity stages, forecast categories, and the probability field
- Configure Products, Price Books, and Opportunity Products (line items)
- Describe Opportunity Teams, revenue/quantity schedules, and big deal alerts

## 📊 SLIDES

### Slide 1: The Opportunity Object
**Visual:** Opportunity record showing key fields: Opportunity Name, Account Name, Stage, Close Date, Amount, Probability, Forecast Category
**Content:**
- Opportunity represents a potential revenue deal in progress
- Required fields by default: Opportunity Name, Close Date, Stage
- Stage drives Probability (auto-populated based on stage picklist configuration)
- Amount field can be entered manually or calculated from Products (Opportunity line items)
- Key related lists: Contact Roles, Opportunity Products, Stage History, Activity History
**Speaker Notes:** The Opportunity object is the heart of sales pipeline management. Admins must understand how the Stage picklist, Probability, and Forecast Category work together — they're tightly coupled and frequently tested on the Admin exam.

### Slide 2: Opportunity Stages & Probability
**Visual:** Pipeline funnel with stage names and corresponding probability percentages at each level
**Content:**
- Stages are configured in the Stage picklist: Object Manager → Opportunity → Fields → Stage
- Each stage has: Stage Name, Type (Open/Closed Won/Closed Lost), Probability (%), Forecast Category
- Probability field auto-populates when a Stage is selected (but can be manually overridden)
- Stage History related list tracks every stage change with date, previous stage, and amount
- Closed Won and Closed Lost are special types — records in these stages are excluded from the active pipeline
**Speaker Notes:** The Stage field is a picklist, but it's special: each value has metadata attached — probability and forecast category. Admins configure this in Object Manager, not just through a normal picklist edit. Remember that probability can always be manually adjusted by the rep regardless of stage.

### Slide 3: Forecast Categories
**Visual:** Table mapping Stage Types to Forecast Categories with definitions for each category
**Content:**
- Forecast Categories roll up opportunities into sales forecasts
- Standard categories: **Pipeline** (early stage), **Best Case** (possible if things go well), **Commit** (sales rep is confident), **Closed** (Won or Lost)
- A stage is assigned to exactly one forecast category
- Managers review forecasts by forecast category, not by individual stage
- Collaborative Forecasting allows reps and managers to adjust forecast amounts independently
**Speaker Notes:** The exam tests the names and meanings of forecast categories. "Commit" means the rep is highly confident the deal will close this period. "Best Case" means it might close. "Pipeline" is early-stage and uncertain. "Closed" applies to both Won and Lost opportunities.

### Slide 4: Opportunity Teams
**Visual:** Opportunity record showing Opportunity Team related list with Team Member, Role, and Opportunity Access columns
**Content:**
- Opportunity Teams allow multiple users to collaborate on a single opportunity
- Each team member has a Team Role (e.g., Account Executive, Sales Engineer, Sales Manager)
- Team members can be granted Opportunity Access: Read Only or Read/Write
- Default Opportunity Teams: each user can set up a default team that is added automatically
- Opportunity Teams are different from Account Teams (Account Teams are at the account level)
**Speaker Notes:** Opportunity Teams solve a common problem: large deals involve multiple people from the vendor side. Adding someone to an Opportunity Team grants them record access and visibility. Remember that the Team Role values are separate from Contact Roles — those are for the people on the CUSTOMER side.

### Slide 5: Products & Price Books
**Visual:** Diagram showing Product catalog → Standard Price Book → Custom Price Book → Opportunity
**Content:**
- **Product:** An item or service sold by your company (the catalog)
- **Standard Price Book:** The default system price book; every product must have a standard price
- **Custom Price Book:** Alternative pricing for specific markets, channels, or segments
- Adding a product to a Price Book creates a Price Book Entry with the price
- A product can appear in multiple price books at different prices
- Setup path: App Launcher → Products (to manage product catalog)
**Speaker Notes:** Think of Products as the catalog and Price Books as different "menus" with different prices for the same items. The Standard Price Book is automatically created in every Salesforce org. Custom Price Books let you offer partner pricing, regional pricing, or promotional pricing.

### Slide 6: Opportunity Products (Line Items)
**Visual:** Opportunity record showing Products related list with columns: Product Name, Quantity, Unit Price, Total Price
**Content:**
- Opportunity Products (also called line items) link Products to Opportunities with quantity and price
- When products are added, the Opportunity Amount auto-calculates from line item totals
- To add products: Opportunity → Products related list → Add Products → Select Price Book
- Only one Price Book can be used per Opportunity
- Product fields on line items: Quantity, Unit Price, Total Price, Discount, Date
- Line Item Total = Quantity × Unit Price (minus any discount)
**Speaker Notes:** The relationship between Opportunities and Products is called Opportunity Product (or OpportunityLineItem in the API). When a Price Book is selected on the Opportunity and products are added, the Amount field is locked to the total of the line items — it can no longer be edited manually.

### Slide 7: Revenue & Quantity Schedules
**Visual:** Timeline diagram showing one Opportunity Product split into monthly revenue installments
**Content:**
- Schedules allow a single line item to be distributed over time
- **Revenue Schedule:** Splits revenue from a product across multiple periods (e.g., monthly SaaS fees)
- **Quantity Schedule:** Splits units shipped over time (e.g., 120 units delivered 10/month)
- Schedules are enabled per product: Product record → check "Enable Revenue Schedule" / "Enable Quantity Schedule"
- Forecast and revenue reports reflect scheduled amounts by period
- Org-wide schedule settings: Setup → Products → Revenue Schedules
**Speaker Notes:** Schedules are important for recurring revenue businesses. A single Opportunity for an annual contract might have 12 monthly revenue schedule entries so forecasting shows the right amount each month. This feature must be enabled on each product individually.

### Slide 8: Big Deal Alerts
**Visual:** Email notification mockup showing "Big Deal Alert" subject line with Opportunity details
**Content:**
- Big Deal Alerts send automatic email notifications when an Opportunity exceeds a threshold
- Configuration: Setup → Big Deal Alert
- Settings: Amount threshold, Probability threshold, notification email recipients
- An alert fires when BOTH the Amount AND Probability thresholds are met
- Useful for executive visibility into large, high-confidence deals
- Does not require workflow rules or Process Builder — it is a native feature
**Speaker Notes:** Big Deal Alerts are a simple but often forgotten native feature. Both conditions — amount AND probability — must be satisfied simultaneously. If the amount is above the threshold but probability is low, no alert fires. This is a common exam trick question.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 20 — Opportunities and Products. This is one of the most content-rich topics for the Salesforce Admin exam, so let's break it down carefully.

An Opportunity is a potential sale. It's the record where your sales team tracks a deal from first contact to close. The three required fields out of the box are Opportunity Name, Close Date, and Stage. Stage is the most important field because it drives two other values automatically: Probability and Forecast Category.

Let's talk about stages. Stages are configured as a picklist, but not a regular one. Go to Object Manager, open Opportunity, then Fields and Relationships, then click on Stage. Here you'll see that each stage value has metadata — a Type (Open, Closed Won, or Closed Lost), a default Probability percentage, and a Forecast Category. When a rep picks a stage, the probability auto-populates. Reps can override it manually, but the stage is what the system defaults to.

Forecast Categories are buckets used for sales forecasting. The standard ones are Pipeline, Best Case, Commit, and Closed. Pipeline is early-stage, uncertain deals. Best Case is deals that might close if everything goes right. Commit means the rep is highly confident this deal closes this period. Closed covers both Won and Lost. Managers review forecasts at the category level, not the individual stage level.

Now let's look at who works the deal. Opportunity Teams let multiple people collaborate on a single opportunity. Each team member gets a role — like Account Executive or Sales Engineer — and is granted Read Only or Read/Write access to the opportunity record. Users can also set default Opportunity Teams that are automatically added whenever they create a new opportunity.

On the product side, Salesforce has a three-level structure. Products are your catalog items. Price Books are collections of products with their prices. The Standard Price Book is automatically available in every org and every product must have a standard price before it can be added to a custom Price Book. Custom Price Books let you define alternative prices for specific customer segments, partners, or regions.

When you add products to an Opportunity — through the Products related list — those line items are called Opportunity Products or line items. Each line item stores the quantity, unit price, and any discount. Once products are added, the Opportunity's Amount field is automatically calculated from the line item totals. Only one Price Book can be applied to a single Opportunity.

For businesses with recurring revenue, Salesforce supports Revenue and Quantity Schedules. A Revenue Schedule spreads a product's revenue across multiple time periods — perfect for annual subscriptions billed monthly. A Quantity Schedule spreads units delivered over time. Schedules are enabled per product in the product record settings.

Finally, Big Deal Alerts. This is a native Salesforce feature that emails a list of recipients whenever an Opportunity crosses both a dollar amount threshold AND a probability threshold simultaneously. You configure it in Setup under Big Deal Alert. Note that BOTH conditions must be true at the same time — this is a common exam question.

That covers Opportunities and Products. Next, we'll look at Quotes and Contracts.

## 🔔 EXAM TIPS
- **Stage drives Probability AND Forecast Category:** Both values are configured on the Stage picklist in Object Manager → Opportunity → Stage field.
- **Amount is calculated from Products:** Once products (line items) are added to an Opportunity, the Amount field becomes read-only and calculated.
- **Only one Price Book per Opportunity:** You cannot mix Price Books on a single opportunity.
- **Big Deal Alert requires BOTH thresholds:** Amount threshold AND probability threshold must both be met to trigger the alert.
- **Opportunity Teams vs Account Teams:** Opportunity Teams are deal-specific; Account Teams persist at the account level across all deals.
- **Schedules must be enabled per product:** Revenue/Quantity Schedules are enabled on the Product record, not org-wide.

## ✅ LECTURE SUMMARY
- Opportunity Stage, Probability, and Forecast Category are linked — Stage configuration drives the other two values
- Stage History tracks every stage change with timestamp and amount
- Forecast Categories: Pipeline, Best Case, Commit, Closed (Won + Lost)
- Opportunity Teams give multiple users collaborative access to a deal with defined roles
- Products exist in Price Books; Standard Price Book is the default; Custom Price Books allow alternate pricing
- Opportunity Products (line items) tie Products to Opportunities; Amount auto-calculates from line items
- Revenue/Quantity Schedules distribute a line item's value or units across time periods; must be enabled per product
- Big Deal Alerts fire when both Amount AND Probability exceed configured thresholds

## ❓ MINI QUIZ

**Q1:** A sales rep changes the Stage on an Opportunity from "Proposal" to "Negotiation/Review." Which field values are automatically updated as a result?
- A) Close Date and Amount
- B) Probability and Forecast Category
- C) Probability only
- D) Forecast Category only
**Answer:** B — Changing the Stage auto-populates both the Probability percentage and the Forecast Category based on the metadata configured for that Stage value in Object Manager.

**Q2:** A sales manager reports that the Amount field on an Opportunity cannot be edited. What is the most likely reason?
- A) The manager only has Read Only access to the Opportunity
- B) A validation rule is preventing the edit
- C) Products (line items) have been added to the Opportunity, making Amount a calculated field
- D) The Opportunity is in Closed Won stage
**Answer:** C — When Opportunity Products are added, the Amount field becomes a read-only calculated field equal to the sum of all line item totals. To change the Amount, you must modify the quantity or price of individual line items.

**Q3:** An administrator wants to notify the CEO and CFO by email whenever an Opportunity exceeds $500,000 with a probability above 70%. Which feature should they configure?
- A) Workflow Rule with Email Alert
- B) Process Builder with Email Action
- C) Big Deal Alert in Setup
- D) Opportunity Assignment Rule
**Answer:** C — Big Deal Alert is a native Salesforce feature configured in Setup that fires email notifications when an Opportunity meets both an Amount threshold and a Probability threshold simultaneously. No automation tool is needed.
