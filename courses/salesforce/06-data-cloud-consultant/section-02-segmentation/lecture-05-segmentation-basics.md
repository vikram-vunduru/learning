# Lecture 05: Segmentation Basics

## Learning Objectives
- Define a Segment in Data Cloud and explain what it contains
- Build segment criteria using attribute filters, related attribute filters, and Calculated Insights
- Explain segment membership and how it is calculated and refreshed
- Distinguish between direct and indirect relationships when using related attributes in segment criteria

---

## Slides

### Slide 1: What Is a Segment?
**Visual:**
```
  ALL UNIFIED INDIVIDUALS
  ┌──────────────────────────────────────────────────────────┐
  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○    │
  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○    │
  │  ○ ○ ○  ┌──────────────────────────────┐  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  │  SEGMENT: High-Value         │  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  │  Customers (Last 30 Days)    │  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  │  ● ● ● ● ● ● ● ● ● ● ● ●   │  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  │  ● ● ● ● ● ● ● ● ● ● ● ●   │  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  │  12,450 members              │  ○ ○ ○ ○ ○    │
  │  ○ ○ ○  └──────────────────────────────┘  ○ ○ ○ ○ ○    │
  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○    │
  └──────────────────────────────────────────────────────────┘
  ○ = All Unified Individuals
  ● = Segment members (meet the criteria)
  Membership is DYNAMIC — updates on refresh schedule
```

**Content:**
- A **Segment** in Data Cloud is a filtered subset of Unified Individual records
- Segments answer the question: "Which customers meet these specific criteria?"
- Used as the basis for targeted marketing, service prioritization, and AI personalization
- Segment membership is dynamic — it updates when the segment runs
- Segments are built in the **Segment Builder UI** using a drag-and-drop interface
- Segments are always built on the **Unified Individual** — not on DLOs or raw DMOs directly

**Speaker Notes:** Segments are the primary delivery mechanism for Data Cloud's value in marketing and personalization. Everything before this lecture — ingestion, modeling, identity resolution — was preparation for this moment: answering "who do we target?" A segment is simply a filter on the Unified Individual pool, using whatever attributes, behaviors, and calculated metrics are available from the DMOs. The exam tests both the conceptual understanding and the technical configuration of segment criteria. A key point: segments are always on Unified Individual records. This means if Identity Resolution hasn't run, or if it hasn't correctly merged records, your segment sizes will be wrong.

---

### Slide 2: Segment Criteria Types
**Visual:**
```
  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
  │  ATTRIBUTE FILTER    │  │ RELATED ATTR FILTER  │  │ CALCULATED INSIGHT   │
  │  ──────────────────  │  │  ──────────────────  │  │  ──────────────────  │
  │  Fields directly on  │  │  Fields from a       │  │  Pre-computed        │
  │  Unified Individual  │  │  related DMO         │  │  aggregate metric    │
  │  or Individual DMO   │  │  (via relationship)  │  │  (SQL-based)         │
  │                      │  │                      │  │                      │
  │  Example:            │  │  Example:            │  │  Example:            │
  │  LoyaltyTier = "Gold"│  │  Has SalesOrder      │  │  TotalSpend_90d      │
  │  BirthDate in range  │  │  WHERE Amount > $500 │  │  >= $1,000           │
  │  City = "Chicago"    │  │  in last 30 days     │  │                      │
  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        │
                           Combined with AND / OR logic
                           + Exclusion criteria
```

**Content:**
- **Attribute Filters:** Filters on fields directly on the Unified Individual or Individual DMO
  - Examples: Gender, BirthDate, City, LoyaltyTier
- **Related Attribute Filters:** Filters on fields from a related DMO (linked via relationship)
  - Examples: "Has a Sales Order in the last 30 days with Amount > $500"
- **Calculated Insights:** Pre-computed aggregate metrics used as filter criteria
  - Examples: TotalSpendLast90Days, EmailOpenRate, NumberOfPurchases
- Criteria can be combined with **AND / OR** logic
- Exclusion criteria: Exclude Unified Individuals who meet certain conditions

**Speaker Notes:** The three types of segment criteria map to increasing complexity. Attribute filters are the simplest — they're just filter conditions on fields that already exist on the Unified Individual. Related attribute filters require a relationship to exist between the Unified Individual and another DMO — for example, a customer who has placed a high-value order. Calculated Insights are pre-computed metrics (covered deeply in Lecture 06) that aggregate behavioral data into summary metrics. In practice, most production segments combine all three types: "customers who are Gold tier loyalty members (attribute) AND have purchased in the last 30 days (related attribute) AND have a lifetime value > $1000 (calculated insight)."

---

### Slide 3: Building an Attribute Filter
**Visual:**
```
  SEGMENT BUILDER — Criteria Panel
  ─────────────────────────────────────────────────────────
  + Add Criteria

  ┌──────────────────┬──────────────────┬──────────────────┐
  │ Individual       │ LoyaltyTier      │ equals  "Gold"   │
  └──────────────────┴──────────────────┴──────────────────┘
  AND
  ┌──────────────────┬──────────────────┬──────────────────┐
  │ Individual       │ BirthDate        │ is between       │
  └──────────────────┴──────────────────┴──────────────────┘
    1980-01-01   and   1995-12-31

  AND
  ┌──────────────────┬──────────────────┬──────────────────┐
  │ Individual       │ City             │ equals  "Chicago"│
  └──────────────────┴──────────────────┴──────────────────┘

  Structure: [ DMO ] → [ Field ] → [ Operator ] → [ Value ]
  AND = all conditions true (narrows segment)
  OR  = at least one true (widens segment)
```

**Content:**
- Attribute filters use a **DMO → Field → Operator → Value** structure
- Available DMOs: Unified Individual, Individual, and all mapped custom DMOs
- Operators: equals, not equals, contains, starts with, is null, is between, greater than, etc.
- Multiple filters combined with **AND** = all conditions must be true
- Multiple filters combined with **OR** = at least one condition must be true
- Nesting is supported: group OR conditions inside an AND block

**Speaker Notes:** The Segment Builder is drag-and-drop, but the exam doesn't ask you to navigate the UI — it asks you to understand the logic. The key concept is AND vs. OR logic and how they affect segment size. AND narrows the segment (fewer records meet ALL conditions). OR widens it (more records meet AT LEAST ONE condition). A common exam trap involves nested logic: "Customers who are in the Gold tier OR Platinum tier AND have purchased in the last 30 days" — without parentheses, this is ambiguous. The exam may test whether you understand operator precedence, and the safe answer is to explicitly group conditions. Know that null checks (is null / is not null) are important for data quality filtering.

---

### Slide 4: Related Attribute Filters — Direct Relationships
**Visual:**
```
  UNIFIED INDIVIDUAL
  ┌───────────────────────────────┐
  │  ID: 00UXXXXXXXXXXXXX         │
  │  Name: John Smith             │
  └───────────────┬───────────────┘
                  │ (direct relationship)
                  │ IndividualId links SalesOrder to Individual
                  │
                  ▼
  ┌───────────────────────────────┐
  │    SALES ORDER DMO            │
  │  OrderDate: 2024-09-01        │◀── Filter: OrderDate
  │  TotalAmount: $750            │◀── Filter: TotalAmount >= 500
  │  IndividualId: 00UXXXXX       │
  └───────────────────────────────┘

  Segment criteria: "Include customers who have AT LEAST ONE
  Sales Order WHERE OrderDate is in last 30 days
  AND TotalAmount >= 500"

  Also supports: "have NO related records" (absence filter)
  and "have AT LEAST N records" (count filter)
```

**Content:**
- A **direct relationship** exists when a DMO is directly linked to the Unified Individual or Individual
- Example: Sales Order → links to Individual via the Individual ID field
- In segment criteria: "Include customers who HAVE AT LEAST ONE Sales Order where…"
- You can also use: "Include customers who have AT LEAST N records" (count-based)
- Or: "Include customers who have NO related records" (absence filter)
- Direct relationships are configured during DMO setup via the relationship field

**Speaker Notes:** Related attribute filters on direct relationships are very common on the exam because they model the most natural marketing question: "who bought something recently?" The key is understanding the relationship direction. The Sales Order DMO points BACK to the Individual — each Sales Order has an Individual ID field that links it to an Individual. When you build a segment filter, you're saying "show me Unified Individuals who have at least one connected Sales Order meeting these conditions." The exam tests whether you understand the difference between "has AT LEAST ONE" (inclusion) and "has NO" (exclusion) related records. These are both valid segment filter types.

---

### Slide 5: Related Attribute Filters — Indirect Relationships
**Visual:**
```
  UNIFIED INDIVIDUAL
  ┌──────────────────┐
  │  John Smith      │
  └────────┬─────────┘
           │  hop 1 (direct)
           ▼
  ┌──────────────────┐
  │  SALES ORDER     │
  │  Order #SO-001   │
  └────────┬─────────┘
           │  hop 2 (indirect)
           ▼
  ┌──────────────────┐
  │ SALES ORDER      │
  │ PRODUCT          │◀── Filter: ProductCategory = "Electronics"
  │  SKU: ELEC-101   │◀── Filter: Quantity > 1
  └──────────────────┘

  Segment: "Customers who purchased Electronics in last 90 days"
  → Requires traversal: Individual → SalesOrder → SalesOrderProduct
  → This is a 2-hop indirect relationship
  → Data Cloud supports up to 2 hops from Unified Individual
```

**Content:**
- An **indirect relationship** exists when you filter on a DMO that is related through an intermediate DMO
- Example: Filter on Sales Order Product attributes, where Sales Order Product links to Sales Order, which links to Individual
- Supported in Data Cloud via the relationship path configuration
- Indirect relationships can be up to **2 hops** away from the Unified Individual
- More complex to configure but enables powerful "what did they buy" type criteria
- Performance consideration: indirect relationship filters are more expensive to process

**Speaker Notes:** Indirect relationships are a more advanced topic and a frequent exam question. The classic example is product-level filtering: "show me customers who purchased a specific product in the last 90 days." The product data is on the Sales Order Product DMO, which is related to Sales Order, which is related to Individual. That's two hops. Data Cloud supports this traversal in segment criteria, allowing you to filter on Sales Order Product fields even though Unified Individual isn't directly related to it. The exam may present this as a scenario where a consultant needs to "filter by purchased product category" and ask whether this is possible — the answer is yes, via indirect relationship filtering. Knowing the 2-hop limit is exam-relevant.

---

### Slide 6: Segment Membership & Refresh
**Visual:**
```
  SEGMENT MEMBERSHIP OVER TIME
  ──────────────────────────────────────────────────────────
  T1 (Initial run)     T2 (After data refresh)    T3 (Next run)
  ┌─────────────┐      ┌─────────────┐            ┌─────────────┐
  │  12,450     │      │  13,100     │            │  12,800     │
  │  members    │ ──▶  │  members    │  ──▶       │  members    │
  │             │      │  (+650 new  │            │  (-300 aged │
  │             │      │  customers  │            │   out of    │
  │             │      │  qualified) │            │   window)   │
  └─────────────┘      └─────────────┘            └─────────────┘

  Refresh schedule: every 12 or 24 hours (configurable)
  Status: DRAFT → cannot activate
  Status: PUBLISHED → can activate to targets

  NOTE: Segment refresh ≠ Data Stream refresh
        Both schedules affect membership currency
```

**Content:**
- Segment membership is **dynamic** — it changes when the segment is recalculated
- Segment can be configured to refresh **on a schedule** or **manually**
- Refresh schedule options: **12 hours or 24 hours** (less frequent than ingestion)
- **Publish** vs. **Draft**: Segments must be published before they appear in Activation Targets
- **Segment membership count** is an estimate until the segment fully runs
- Members enter and exit segments as their data changes (e.g., falls outside the time window)

**Speaker Notes:** A key exam distinction: segment refresh is separate from data ingestion refresh. A Data Stream might refresh every hour, bringing in new purchase data. But if the segment that filters on recent purchases only refreshes every 24 hours, you won't see new customers in the segment for up to 24 hours after they made a qualifying purchase. This lag between data availability and segment membership update is a common exam scenario — the answer is to check both the data ingestion schedule AND the segment refresh schedule. Also note the difference between Draft and Published segments — only Published segments can be used in Activation Targets.

---

### Slide 7: Segment Exclusions
**Visual:**
```
  BUILDING THE FINAL SEGMENT
  ──────────────────────────────────────────────────────────
  STEP 1 — INCLUDE:              STEP 2 — EXCLUDE:
  All Gold Tier Customers        Customers who received
  ┌─────────────────────┐        email in last 7 days
  │  ● ● ● ● ● ● ● ●   │        ┌──────────────┐
  │  ● ● ● ● ● ● ● ●   │  minus │ ● ● ● ● ●    │
  │  ● ● ● ● ● ● ● ●   │        └──────────────┘
  │  ● ● ● ● ● ● ● ●   │
  └─────────────────────┘
           │
           ▼  Apply Exclusion
  ┌────────────────────────────────────┐
  │  FINAL SEGMENT FOR CAMPAIGN        │
  │  Gold Tier, NOT recently emailed   │
  │  ● ● ● ● ● ● ● ● ● ● ● ●         │
  └────────────────────────────────────┘
  KEY: Exclude HasOptedOutOfEmail = true for all email campaigns
```

**Content:**
- **Exclusion criteria** remove matching Unified Individuals from a segment
- Use cases: suppress recently contacted customers, exclude opted-out individuals, remove internal/test accounts
- Exclusion filters use the same DMO field structure as inclusion filters
- **Consent exclusion** is a best practice: always exclude individuals with email opt-out for email campaigns
- Exclusions can reference related DMOs (e.g., "exclude customers who received an email in the last 7 days")
- Exclusions are evaluated AFTER inclusion criteria — include first, then exclude

**Speaker Notes:** Segment exclusions are an important operational concept and appear in exam scenarios about consent management and campaign hygiene. The most important exclusion in practice is the consent exclusion — before activating any email-based segment, you should be excluding anyone who has opted out of email communication. The Contact Point Email's HasOptedOutOfEmail field is what you'd filter on. The exam may present a scenario where a customer complaints about receiving emails after opting out, and ask what the consultant should check — the answer includes verifying that the segment has a consent exclusion filter.

---

### Slide 8: Segment Best Practices
**Visual:**
```
  ┌──────────────────────────────────┬──────────────────────────────────┐
  │                DO                │              DON'T               │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Publish segments before          │ Try to activate a Draft segment  │
  │ activation (not Draft)           │ — it will not appear in ATs      │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Include HasOptedOutOfEmail=false  │ Send email campaigns without     │
  │ exclusion in email segments       │ consent exclusion filters        │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Test with simple criteria first, │ Build deeply nested OR logic     │
  │ add complexity incrementally     │ that makes intent unreadable     │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Monitor segment counts for       │ Assume real-time membership —    │
  │ unexpected spikes or drops       │ check refresh schedules first    │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Build segments on DMOs via       │ Try to build segments on DLO     │
  │ Segment Builder                  │ raw data — not supported         │
  └──────────────────────────────────┴──────────────────────────────────┘
```

**Content:**
- **Do:** Use Published segments for activation — Draft segments cannot be activated
- **Do:** Include consent exclusions in all outbound marketing segments
- **Do:** Test segment logic with small criteria sets before adding complexity
- **Do:** Monitor segment membership counts for unexpected spikes or drops
- **Don't:** Build segments on DLO data — always use DMOs via the Segment Builder
- **Don't:** Rely on real-time segment membership for time-sensitive campaigns without verifying refresh schedules
- **Don't:** Create deeply nested OR conditions that make the segment logic unreadable

**Speaker Notes:** These best practices appear in "what should the consultant do?" exam scenarios. The Published vs. Draft distinction is frequently tested — if an activation target isn't receiving segment data, check whether the segment is Published. The consent exclusion recommendation is tested in the governance domain. The segment refresh schedule note is important for setting customer expectations — if a client says "why hasn't our new segment update appeared in the activation target yet?" the answer often involves checking whether the segment has refreshed since the underlying data changed.

---

## Recording Script

Welcome to Section 2 and Lecture 05. We've built the foundation — data ingested, modeled, and identity-resolved. Now we're going to use that foundation for what clients actually care about: segmentation.

A segment in Data Cloud is a dynamic subset of your Unified Individual records. It answers the question "who meets this criteria right now?" The power is in "right now" — because segments refresh on a schedule, and as customer data changes, membership changes too. A customer who made a qualifying purchase enters the segment. A customer whose qualifying purchase ages out of the time window exits.

Segments are built in the Segment Builder using three types of criteria. **Attribute filters** are the simplest — filter on a field directly on the Unified Individual, like loyalty tier or geographic region. **Related attribute filters** filter on data from a linked DMO — for example, "has at least one Sales Order in the last 30 days with a value over $500." These require a DMO relationship to exist. **Calculated Insights** bring in pre-computed metrics — we'll cover those in Lecture 06.

The relationship concept is important for the exam. A **direct relationship** is when the related DMO links directly to the Individual. An **indirect relationship** is when you need to traverse through an intermediate DMO — like filtering on Sales Order Product data, where Sales Order Product links to Sales Order, which links to Individual. Data Cloud supports up to 2-hop indirect relationships in segment criteria.

Two things to know about segment membership: First, membership is dynamic — it's recalculated when the segment refreshes. Second, segments must be **Published** before they can be used in an Activation Target. A Draft segment can be built and previewed but not activated.

Always include consent exclusions in outbound marketing segments. Filter out individuals with HasOptedOutOfEmail = true before activating to email channels. This is both a best practice and an exam topic in the governance domain.

In Lecture 06, we go deep on Calculated Insights — the SQL-powered metrics that power advanced segmentation. See you there.

---

## Exam Tips

- Segments are always built on **Unified Individual** records — not on DLOs or individual DMO records
- Segments must be **Published** (not Draft) before they can be added to an Activation Target
- **Indirect relationships** in segment criteria support up to **2 hops** from Unified Individual
- Segment refresh is separate from data ingestion refresh — both schedules affect how current segment membership is
- Always include **consent exclusions** (HasOptedOutOfEmail) in outbound email marketing segments

---

## Lecture Summary

Segments in Data Cloud are dynamic, filtered subsets of Unified Individual records used to identify target audiences for marketing, service, and AI personalization. Segment criteria come in three types: attribute filters on Unified Individual/DMO fields, related attribute filters on linked DMO data (supporting direct and indirect relationships up to 2 hops), and Calculated Insights for aggregate metrics. Segment membership is recalculated on a refresh schedule and changes dynamically as underlying customer data changes. Segments must be published before they can be activated, and exclusion criteria — including consent opt-out filters — should be included in all outbound marketing segments. Understanding the relationship between ingestion refresh schedules and segment refresh schedules is key to troubleshooting membership latency issues.

---

## Mini Quiz

**Question 1:** A marketing team wants to create a segment of customers who have purchased a specific product category in the last 60 days. Product data is stored in a Sales Order Product DMO, which relates to the Sales Order DMO, which relates to the Individual DMO. Can this be done in Data Cloud, and if so, how?

A) No — Data Cloud segments can only filter on fields directly on the Unified Individual  
B) Yes — using a direct relationship filter on Sales Order Product  
C) Yes — using an indirect relationship filter traversing Sales Order → Sales Order Product  
D) No — filtering on product category requires a Calculated Insight  

**Answer: C**
Data Cloud segment criteria support indirect relationships, allowing filters on DMOs that are up to 2 hops away from the Unified Individual. Sales Order Product is 2 hops away (Individual → Sales Order → Sales Order Product), which is within the supported limit.

---

**Question 2:** A consultant publishes a segment and activates it to a Marketing Cloud Activation Target. The marketing team reports that the segment size in the activation target is much smaller than expected. What should the consultant check first?

A) Verify the segment is Published, not in Draft status  
B) Check whether the segment includes an exclusion for opted-out individuals that is too broad  
C) Verify the segment refresh schedule and check the last run date  
D) Confirm that the Activation Target is connected to the correct Business Unit  

**Answer: B**
If the segment has been published and activated successfully but the size is unexpectedly small, the most likely cause is an over-broad exclusion — for example, excluding anyone who received ANY email in the last 90 days, which might inadvertently remove a large portion of the audience. Check the exclusion criteria first. The other options (publish status, refresh schedule, Business Unit) would typically cause the activation to fail entirely or show zero records, not a smaller-than-expected count.

---

**Question 3:** Which statement about segment membership refresh is correct?

A) Segment membership updates in real time as soon as new data is ingested  
B) Segment membership is static once a segment is published  
C) Segment membership is recalculated on the segment's configured refresh schedule (12 or 24 hours)  
D) Segment membership only updates when an activation is manually triggered  

**Answer: C**
Segment membership is recalculated on a configured refresh schedule, with options of 12 or 24 hours. It is not real-time (even if data is ingested in real-time via streaming), it is not static after publishing, and it is not tied to manual activation triggers.
