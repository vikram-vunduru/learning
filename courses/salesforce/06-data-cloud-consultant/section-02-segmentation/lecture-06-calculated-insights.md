# Calculated Insights

## Exam Domain
Segmentation & Insights — 13% of exam weight

## Core Concepts

### What Calculated Insights Are
Calculated Insights (CIs) are pre-computed aggregate metrics derived from DMO data using ANSI SQL. They transform record-level DMO data (individual Sales Order rows) into summary-level metrics per customer (TotalSpend90d, TotalOrders, AvgOrderValue). CIs are computed on a schedule and cached — they do NOT run live at segment query time. This makes them fast to query and consistent across segmentation and analytics.

### Structure: Dimensions and Measures
Every CI has dimensions (the GROUP BY fields — usually IndividualId — that define what each row represents) and measures (the aggregate function outputs: COUNT, SUM, AVG, MAX, MIN). When you use a CI in segment criteria, you filter on measure values. The IndividualId dimension is what links each CI row back to the correct Unified Individual.

### The Refresh Dependency Chain
This is the most exam-tested CI operational concept. The correct order is: Data Stream refresh updates DMO data → CI refresh computes from updated DMO data → Segment refresh uses updated CI values. If CI refresh runs before the Data Stream completes, the CI computes against yesterday's data even if today's ingestion ran. Always schedule CI refresh AFTER the Data Stream refresh completes. Use Job Scheduler job chaining to enforce this.

---

## PTA / SA Relevance

### When This Comes Up in Engagements
CIs are the primary way Data Cloud surfaces derived intelligence to both marketing (segment criteria) and analytics (Tableau/CRM Analytics). In a CDO/CMO conversation: "Your marketing team can filter on 'customers with total spend over $1,000 in the last 90 days' directly in the segment builder — no SQL, no BI team involvement." For an architecture review: the CI layer is the equivalent of a pre-aggregated materialized view in a traditional data warehouse.

### Common Partner Mistakes
- Scheduling CI refresh before the dependent Data Stream completes — the most common root cause of "segments aren't reflecting recent data" tickets
- Creating dozens of nearly identical CIs (TotalSpend30d, TotalSpend60d, TotalSpend90d, TotalSpend180d as separate CIs) — consolidate into a single CI with multiple measures or parameterized logic
- Referencing DLO data in CI SQL — CIs can only query DMO-layer data (objects with __dlm suffix that represent modeled data, not raw DLO tables)
- Not previewing before publishing — a SQL error in production CI causes no data for dependent segments

### Enterprise Scale Considerations
At scale, poorly written CIs can be slow. Optimization patterns: use WHERE clauses to limit data processed (filter to the time window you care about, not all historical data); minimize multi-table JOINs; use pre-filtered or indexed DMO fields in WHERE conditions. For the largest implementations, understand that CI refresh competes with Data Stream refresh for compute resources — stagger schedules and monitor Job Scheduler for queuing.

### Customer Advisory: Business Case
CIs eliminate the need for a separate data warehouse or ETL pipeline just to get customer-level summary metrics into a marketing tool. A retail client previously required a 3-day data engineering cycle to produce a "top spending customers" list; with Data Cloud CIs, marketing can build the same list in minutes and refresh it daily. This is a compelling ROI story for the business case.

---

## Architecture

### What CIs Do: Raw Data to Summary

```
  SALES ORDER DMO (record level)           CI OUTPUT (summary per customer)
  ═══════════════════════════              ════════════════════════════════════
  OrderId  │ IndivId │ Amount              Customer_Purchase_Stats CI
  ─────────┼─────────┼───────              ──────────────────────────────────────
  SO-001   │ 00U-001 │ $120                IndividualId │ TotalOrders │ TotalRev
  SO-002   │ 00U-001 │ $340   ──SQL──▶     00U-001      │     14      │ $3,240
  SO-003   │ 00U-001 │ $85    GROUP BY     ──────────────────────────────────────
  SO-004   │ 00U-001 │ $210                One row per customer
  ...
  SO-101   │ 00U-002 │ $500   ──SQL──▶     00U-002      │      3      │ $1,100
  SO-102   │ 00U-002 │ $300
  SO-103   │ 00U-002 │ $300

  Many rows per customer                   One summary row per customer
  Cannot filter in Segment Builder         Can filter: TotalRev >= 1000
```

**Limitations:**
- CIs are NOT real-time — they're as fresh as the last scheduled refresh
- CIs can only reference DMO data (objects with __dlm suffix) — not raw DLO tables
- GROUP BY is required — missing it produces a single aggregate for all customers, useless for per-customer segmentation
- A limit exists on active CIs per Data Cloud instance (check current Salesforce limits documentation)

---

### CI SQL Structure

```sql
SELECT
    i.Id AS IndividualId,          -- DIMENSION (GROUP BY key)
    COUNT(so.Id) AS TotalOrders,   -- MEASURE
    SUM(so.TotalAmount) AS TotalRevenue,  -- MEASURE
    AVG(so.TotalAmount) AS AvgOrderValue, -- MEASURE
    MAX(so.OrderDate) AS LastOrderDate    -- MEASURE (date type)
FROM Individual__dlm AS i           -- ★ Note: __dlm suffix required
JOIN SalesOrder__dlm AS so
    ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
GROUP BY i.Id                       -- ★ Required — defines dimension
```

**Key syntax rules:**
- DMO API names end in **`__dlm`** — always
- Standard ANSI SQL: SELECT, FROM, WHERE, GROUP BY, HAVING, JOINs all work
- DATEADD and CURRENT_DATE are supported for date arithmetic
- Preview the query in the CI editor before publishing to validate

**Limitations:**
- No real-time computation — runs on schedule only
- Complex multi-DMO JOINs can be slow to process for large datasets
- HAVING clause is supported but the GROUP BY result set must still be grouped by IndividualId for use in segmentation

---

### Aggregation Functions Reference

```
  ┌────────────────────┬───────────────────────────────┬───────────────────────────┐
  │ Function           │ Example                       │ Use For                   │
  ├────────────────────┼───────────────────────────────┼───────────────────────────┤
  │ COUNT(field)       │ COUNT(so.Id) AS Orders        │ # of orders, sessions     │
  │ COUNT(DISTINCT f)  │ COUNT(DISTINCT ProductCat)    │ Unique product categories │
  │ SUM(field)         │ SUM(TotalAmount) AS Revenue   │ Total spend, quantity     │
  │ AVG(field)         │ AVG(TotalAmount) AS AvgOrder  │ Average order value       │
  │ MAX(field)         │ MAX(OrderDate) AS LastPurchase│ Most recent purchase date │
  │ MIN(field)         │ MIN(OrderDate) AS FirstPurchas│ First purchase date       │
  └────────────────────┴───────────────────────────────┴───────────────────────────┘
  All functions IGNORE NULL values (standard SQL behavior)

  Business need → Function mapping:
  "How many purchases?" → COUNT
  "Total spent?" → SUM
  "Average basket size?" → AVG
  "When did they last buy?" → MAX on date field
  "When did they first buy?" → MIN on date field
  "How many different categories?" → COUNT(DISTINCT)
```

---

### CI Refresh Dependency Chain

```
  CORRECT ORDER (must run in this sequence):
  ════════════════════════════════════════════════════════
  2:00 AM ── Data Stream refresh ──▶ DLO + DMO updated
                     │
                     │ (job chaining — waits for completion)
                     ▼
  4:00 AM ── CI refresh ───────────▶ CI values computed from
                     │               fresh DMO data
                     │ (job chaining)
                     ▼
  6:00 AM ── Segment refresh ──────▶ Segment membership updated
                     │               using fresh CI values
                     │ (job chaining)
                     ▼
  7:00 AM ── Activation publish ───▶ Destinations updated

  WITHOUT chaining: CI runs at 1 AM before Data Stream finishes
  → CI computes yesterday's data
  → Segments reflect stale metrics
  → Marketing activates wrong audience
```

**Limitations:**
- No dependency enforcement by default — you must configure job chaining in the Job Scheduler manually
- If a Data Stream fails, downstream CI and Segment jobs may run against incomplete DMO data
- CI refresh cannot be triggered by a Data Stream completion event (no event-driven chaining) — only time-based scheduling

---

## Key Facts to Memorize

- CIs use **ANSI standard SQL** — standard SELECT/FROM/WHERE/GROUP BY syntax
- DMO API names in CI SQL always end in **`__dlm`** (e.g., `Individual__dlm`, `SalesOrder__dlm`)
- CIs can only reference **DMO data** — not DLO data
- **GROUP BY is required** — it defines the dimension (usually IndividualId)
- Correct refresh order: **Data Stream → DMO → CI → Segment**
- Use a CI (not a related attribute filter) when you need an **aggregate** (total spend, count of orders, average value)
- CIs serve **dual purpose**: segment criteria AND analytics source (Tableau, CRM Analytics) — one definition, used consistently

---

## Exam Traps

- "A related attribute filter can compute a customer's total spend across all orders" — wrong; that requires a CI (aggregation across multiple records)
- "CIs run in real time at segment query time" — wrong; CIs are pre-computed and cached
- "CIs can reference DLO data directly" — wrong; CIs only query DMO-layer data
- "If the CI refresh runs before the Data Stream, the CI will wait for it" — wrong; without job chaining, CI runs against whatever DMO data exists at that moment
- "GROUP BY is optional in CI SQL if you only want one measure" — wrong; GROUP BY is always required

---

## Practice Questions

**Q:** A marketing team wants to segment customers by their average order value over the last 12 months. Which feature creates this metric?
**A:** A Calculated Insight using the AVG() aggregation function. Average order value requires aggregating (averaging) multiple Sales Order records per customer — this is exactly what CIs are for. Related attribute filters can check whether orders exist but cannot compute averages across orders.

**Q:** A consultant writes a CI but after publishing, the segment using it isn't reflecting yesterday's purchases. The Data Stream refresh runs at 2 AM and finishes by 3 AM. What is the most likely issue?
**A:** The CI refresh is scheduled to run at 1 AM — before the Data Stream completes. The CI is computing against yesterday's DMO data. The fix is to schedule the CI refresh after 3 AM (after the Data Stream finishes) and use job chaining in the Job Scheduler.

**Q:** In a CI SQL query, which clause determines what makes each output row a "dimension" rather than a "measure"?
**A:** The GROUP BY clause. Fields in the GROUP BY clause are dimensions — they determine the granularity of each output row (typically IndividualId for per-customer CIs). Fields in the SELECT clause that use aggregation functions (COUNT, SUM, AVG) are measures.
