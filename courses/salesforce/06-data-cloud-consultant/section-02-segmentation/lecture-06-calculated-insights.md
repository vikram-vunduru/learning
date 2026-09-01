# Lecture 06: Calculated Insights

## Learning Objectives
- Explain what Calculated Insights are and how they differ from standard DMO attributes
- Write ANSI SQL for a Calculated Insight using aggregation functions (COUNT, SUM, AVG, MAX, MIN)
- Distinguish between CI dimensions and CI measures and how each is used in segments
- Describe the CI refresh process and the dependency on underlying DMO data

---

## Slides

### Slide 1: What Are Calculated Insights?
**Visual:** Two panels side by side. Left panel: raw Sales Order DMO with individual order rows. Right panel: a Calculated Insight named "Customer_Purchase_Stats" showing aggregate columns: TotalOrders=14, TotalRevenue=3240.00, LastPurchaseDate=2024-09-15.

**Content:**
- **Calculated Insights (CI)** are pre-computed aggregate metrics derived from DMO data using SQL
- Summarize behavioral data into analytics-ready metrics
- Examples: total spend in last 90 days, number of email opens, average order value, days since last purchase
- Stored as a separate "Calculated Insight" object — not a standard DMO
- Can be used in **segment criteria** as filter conditions
- Can be used in **activation payloads** to enrich the data sent to activation targets

**Speaker Notes:** Calculated Insights solve the problem that raw DMO data is record-level, not summary-level. You have individual Sales Order records — but your segment criteria wants to filter on "total spend over $1,000 in the last 90 days." That requires aggregating multiple order records into a single number per customer. That's exactly what a Calculated Insight does. The SQL-based approach means CIs are highly flexible — any aggregation you can express in standard SQL, you can compute as a CI. The exam tests both conceptual knowledge (what is a CI, when to use it) and practical SQL syntax (what does the query look like).

---

### Slide 2: The Calculated Insight Editor
**Visual:** A code editor mockup showing a CI SQL query with proper formatting. Surrounding the editor are metadata fields: CI Name, Description, Refresh Schedule dropdown, and a "Preview" button.

**Content:**
- Accessed from Data Cloud Setup → Calculated Insights → New
- Uses **ANSI-standard SQL** — standard SELECT, FROM, WHERE, GROUP BY syntax
- Must reference DMO objects by their API name
- Must have a **GROUP BY clause** with the dimension field (usually the Individual ID)
- Must produce output columns that become CI **measures** (numeric aggregates) and **dimensions** (grouping fields)
- **Preview** runs the query against a sample of data before saving
- All CIs are pre-computed and stored — they do NOT run at segment query time

**Speaker Notes:** The SQL editor is the core tool for CIs. The ANSI SQL requirement is important — Data Cloud's CI editor is not proprietary, it's standard SQL. This means you can write joins, WHERE clauses, GROUP BY, HAVING, and subqueries. The most important structural requirement is the GROUP BY clause — it defines the dimension (typically the Individual ID) that each row of CI output corresponds to. Without a GROUP BY, the CI would produce a single aggregate for all customers, which isn't useful for per-customer segmentation. The "pre-computed" nature is important for performance — the CI calculates once on a schedule and stores results, so segment queries run against the cached CI results rather than re-computing in real-time.

---

### Slide 3: Aggregation Functions
**Visual:** A reference table showing five aggregation functions with syntax examples and use cases. Each row: function name, example SQL, use case description.

**Content:**
- **COUNT(field)** — Count of non-null values; use for number of orders, number of sessions
- **COUNT(DISTINCT field)** — Count of unique values; use for unique products purchased
- **SUM(field)** — Sum of all values; use for total spend, total quantity
- **AVG(field)** — Average value; use for average order value, average session duration
- **MAX(field)** — Maximum value; use for most recent purchase date, highest order amount
- **MIN(field)** — Minimum value; use for first purchase date, earliest contact date
- All functions ignore NULL values (standard SQL behavior)

**Speaker Notes:** The aggregation functions are directly exam-testable. You should be able to look at a business requirement and identify which function to use. "How many purchases has this customer made?" → COUNT. "What is their total spend?" → SUM. "What is their average basket size?" → AVG. "When did they last make a purchase?" → MAX on the date field. "When did they first become a customer?" → MIN on the date field. COUNT(DISTINCT) is useful for "how many different product categories has this customer bought from?" — it counts unique values rather than total records. Note that all functions ignore NULLs, which means missing data doesn't affect the aggregate incorrectly.

---

### Slide 4: CI Structure — Dimensions vs. Measures
**Visual:** An annotated SQL query. The GROUP BY columns are highlighted in blue and labeled "Dimensions." The aggregate function columns (SUM, COUNT, MAX) are highlighted in orange and labeled "Measures."

**Content:**
- **Dimensions:** The grouping fields that define who/what each CI row represents
  - Always includes the **Individual ID** or **Unified Individual ID** for customer-level CIs
  - Can include additional categorical fields (e.g., product category, channel)
- **Measures:** The computed aggregate values
  - Numeric output of aggregation functions (COUNT, SUM, AVG, MAX, MIN)
  - Each measure becomes a filterable attribute in segment criteria
- A CI must have at least one dimension and at least one measure
- Measures with date/datetime types can also be used (e.g., MAX(OrderDate) for last purchase date)

**Speaker Notes:** The dimension vs. measure distinction is fundamental to understanding how CIs work. The dimension fields tell you "this row of CI data belongs to this customer." The measure fields tell you "and here's the aggregated value for that customer." When you use a CI in segment criteria, you filter on the measure values. For example, "TotalSpend90d >= 1000" where TotalSpend90d is a measure. Dimensions are usually not used as filter criteria on their own (you'd use attribute filters for that), but they define the scope of the calculation. Including the Individual ID as a dimension is what makes the CI usable at the customer level for segmentation.

---

### Slide 5: Writing a Calculated Insight — Example
**Visual:** A complete CI SQL example shown in a formatted code block:

```sql
SELECT
    i.Id AS IndividualId,
    COUNT(so.Id) AS TotalOrders,
    SUM(so.TotalAmount) AS TotalRevenue,
    AVG(so.TotalAmount) AS AvgOrderValue,
    MAX(so.OrderDate) AS LastOrderDate
FROM Individual__dlm AS i
JOIN SalesOrder__dlm AS so
    ON so.IndividualId__c = i.Id
WHERE so.OrderDate >= DATEADD(day, -90, CURRENT_DATE)
GROUP BY i.Id
```

**Content:**
- `Individual__dlm` and `SalesOrder__dlm` are the DMO API names (note `__dlm` suffix)
- `WHERE` clause filters to last 90 days using `DATEADD` function
- `GROUP BY i.Id` groups results by Individual — one CI row per customer
- Measures: `TotalOrders`, `TotalRevenue`, `AvgOrderValue`, `LastOrderDate`
- Dimension: `IndividualId`
- This CI can then be used in segments: filter on `TotalRevenue >= 1000`

**Speaker Notes:** This example query is close to what you'd write in a real implementation. Note the `__dlm` suffix on DMO names — this is important syntax for Data Cloud. DMO API names in CI SQL always end in `__dlm`. Also notice the DATEADD function for date arithmetic — this is standard SQL and works in Data Cloud's CI editor. The JOIN connects the Individual DMO to the Sales Order DMO — the relationship that enables traversal. The exam may present a business requirement and ask you to identify the correct SQL structure. Key things they test: correct GROUP BY, appropriate aggregation function, proper DMO naming with __dlm suffix, and date filtering syntax.

---

### Slide 6: CI Refresh Schedule
**Visual:** A timeline showing: CI data becomes stale → refresh job runs at scheduled time → CI results updated → segment using CI can now use updated values.

**Content:**
- CIs are pre-computed on a **schedule** — they do not run in real-time
- CI refresh options are configured independently of Data Stream and Segment refresh
- CI refresh dependency: underlying DMO data must be current before CI refresh runs
- **Order of operations:** Data Stream refresh → DMO data updated → CI refresh → Segment refresh
- If CI refresh runs before underlying DMOs are updated, CI values will be stale
- Data Cloud's job scheduler can be configured to chain these jobs in the correct order

**Speaker Notes:** The CI refresh dependency chain is a favorite exam topic. The operations must happen in sequence: data ingestion updates the DMO data, THEN the CI refresh processes that updated DMO data to produce new aggregate values, THEN the segment refresh uses those new CI values to recalculate segment membership. If you schedule CI refresh before the data ingestion job completes, your CI will be based on yesterday's data even though today's ingestion ran. Exam questions often describe a scenario where "the segment using a CI isn't showing recent transactions" and ask what the consultant should check. The answer: verify the CI refresh schedule runs AFTER the Data Stream refresh completes.

---

### Slide 7: Using CIs in Segments
**Visual:** Segment Builder UI mockup showing a criteria row using a Calculated Insight: "Calculated Insight: Customer_Purchase_Stats" → "TotalRevenue" → "greater than or equal to" → "1000."

**Content:**
- In Segment Builder, select **Calculated Insight** as the criteria source
- Choose the CI name, then select the specific measure field
- Apply a comparison operator and value
- CIs can be combined with attribute filters and related attribute filters
- Example combined criteria: "Gold tier customers (attribute) AND TotalRevenue90d >= 1000 (CI) AND has an order in last 30 days (related attribute)"
- CI dimension fields can also be used as criteria (e.g., filter by a product category dimension)

**Speaker Notes:** Using a CI in segment criteria is straightforward once the CI is created and published. The exam tests the end-to-end scenario: given a business requirement for an aggregate metric, can you identify that a CI is needed, write the SQL, and then describe how it's used in a segment? Many exam questions won't ask you to write full SQL — they'll ask conceptual questions like "which feature would you use to filter on a customer's total spend over 90 days?" The answer is a Calculated Insight. The distinction is important: individual transaction data is a related attribute filter; an aggregate like total spend requires a CI.

---

### Slide 8: CI Limitations & Best Practices
**Visual:** Two-column card layout: "Limitations" on the left (red), "Best Practices" on the right (green).

**Content:**
- **Limitations:**
  - CIs are not real-time — they're as fresh as their last scheduled refresh
  - Complex JOINs across many DMOs can be slow to process
  - CIs can only reference DMO data, not DLO data
  - There is a limit on the number of active CIs per Data Cloud instance
- **Best Practices:**
  - Name CIs clearly: include the metric and time window (e.g., TotalSpend_90d)
  - Schedule CI refresh AFTER the dependent Data Stream refresh completes
  - Use WHERE clauses to limit data processed (filter by date range)
  - Test with Preview before publishing to validate SQL logic

**Speaker Notes:** The limitations section contains exam-relevant facts. The most important: CIs reference DMO data, not DLO data. If someone asks whether a CI can be written against raw DLO fields, the answer is no. Also important: the maximum number of active CIs is a real constraint in production implementations — you shouldn't create dozens of nearly identical CIs. Instead, use one CI with multiple measures. The best practice of naming with time windows (TotalSpend_90d vs TotalSpend_30d) is a real implementation practice that the exam may reference in a scenario about "a consultant is reviewing a client's Data Cloud instance and sees 15 different CIs for similar metrics" — the recommendation would be to consolidate.

---

## Recording Script

Welcome to Lecture 06. In this lecture, we're tackling Calculated Insights — one of the most technically interesting and exam-relevant features in Data Cloud.

Here's the problem CIs solve. You've ingested a customer's sales orders. Each order is an individual record with an order date, a total amount, and a line item. But your marketing team doesn't want to filter on individual orders — they want to target customers whose total spend over the last 90 days exceeds $1,000. That's an aggregate calculation across multiple records. Standard DMO filters can't do that. Calculated Insights can.

A Calculated Insight is a pre-computed metric stored as its own object. You write it in ANSI standard SQL, and Data Cloud runs that SQL on a schedule, storing the results. When your segment queries the CI, it's reading cached results — not running live aggregations.

The SQL structure is standard: SELECT the individual ID as your dimension, and your aggregate functions as your measures. You JOIN the Individual DMO to the Sales Order DMO using the relationship field. You filter with a WHERE clause for your time window. You GROUP BY the Individual ID. The result is one row per customer with their computed metrics.

The naming convention for DMOs in CI SQL is important: DMO API names end in `__dlm`. So the Individual DMO is `Individual__dlm` in your FROM clause.

Dimensions and measures: dimensions are your GROUP BY fields — they define what each row represents. Measures are your aggregate outputs — COUNT, SUM, AVG, MAX, MIN. When you use a CI in segment criteria, you filter on measure values.

The critical operational concept is the refresh dependency chain. Data must flow in this order: Data Stream refresh updates the DMO data. THEN the CI refresh runs against updated DMO data. THEN the segment refresh uses updated CI values. If these schedules aren't coordinated, your segment membership will be based on stale calculations. Always schedule CI refresh after the Data Stream jobs it depends on.

In Lecture 07, we complete the section with Activation Targets — how to get your segments out to the systems that actually communicate with customers. See you there.

---

## Exam Tips

- CIs use **ANSI standard SQL** — standard SELECT/FROM/WHERE/GROUP BY syntax applies
- DMO API names in CI SQL end in **`__dlm`** (e.g., `Individual__dlm`, `SalesOrder__dlm`)
- CIs can only reference **DMO data** — not DLO data
- The refresh order matters: **Data Stream → DMO → CI → Segment** — schedule in this sequence
- To filter on an **aggregate metric** (total spend, count of orders) in a segment, you need a **Calculated Insight** — not a related attribute filter

---

## Lecture Summary

Calculated Insights are pre-computed aggregate metrics written in ANSI SQL that allow Data Cloud to compute summary-level data (total spend, purchase counts, average order values) from record-level DMO data. CIs are structured with dimensions (GROUP BY fields, typically including Individual ID) and measures (aggregate function outputs). They are scheduled to refresh separately from Data Streams and segments, and the refresh must run in the correct sequence: Data Stream refresh → DMO update → CI refresh → Segment refresh. CIs are used in segment criteria to filter on aggregate metrics and in activation payloads to enrich customer data. They reference DMO data (not DLO data) and are stored as pre-computed results rather than running at segment query time.

---

## Mini Quiz

**Question 1:** A marketing team wants to segment customers by their average order value over the last 12 months. Which Data Cloud feature should the consultant use to create this metric?

A) A related attribute filter on the Sales Order DMO  
B) A formula field on the Individual DMO  
C) A Calculated Insight using the AVG() aggregation function  
D) A custom DMO with a pre-computed AverageOrderValue field  

**Answer: C**
An average order value requires aggregating (averaging) multiple Sales Order records per customer. This is exactly the use case for a Calculated Insight with an AVG() measure. Related attribute filters can check whether orders exist meeting certain conditions but cannot compute averages across orders. Formula fields on DMOs cannot aggregate related records.

---

**Question 2:** A consultant writes a Calculated Insight but after publishing, the segment using this CI is not reflecting recent transactions. The Data Stream refresh runs at 2 AM and completes by 3 AM. What is the most likely configuration issue?

A) The CI is referencing DLO data instead of DMO data  
B) The CI refresh is scheduled to run at 1 AM, before the Data Stream refresh completes  
C) The segment refresh schedule is shorter than the CI refresh schedule  
D) The SQL query is missing a HAVING clause  

**Answer: B**
The CI refresh must run AFTER the Data Stream refresh updates the underlying DMO data. If the CI is scheduled to run at 1 AM and the Data Stream runs at 2 AM, the CI will be processing yesterday's DMO data. The fix is to schedule the CI refresh after 3 AM (after the Data Stream completes).

---

**Question 3:** In a Calculated Insight SQL query that computes per-customer purchase metrics, which SQL clause determines which DMO field creates the "dimension" output?

A) SELECT  
B) WHERE  
C) GROUP BY  
D) HAVING  

**Answer: C**
The GROUP BY clause defines the dimension fields — the fields that determine the granularity of each output row (typically the Individual ID for per-customer CIs). The SELECT clause specifies all output columns (both dimensions and measures), but it's the GROUP BY that identifies which columns are dimensions (grouping keys) versus measures (aggregates).
