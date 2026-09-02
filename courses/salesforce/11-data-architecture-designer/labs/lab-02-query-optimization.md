# Lab 02: Query Optimization

## Lab Overview

**Domain**: Large Data Volumes  
**Estimated Time**: 60 minutes  
**Level**: Architect  
**Format**: SOQL analysis and optimization exercises — identify problems and redesign

---

## Business Scenario

**Company**: RetailMax — a retail company with:
- 8 million Customer accounts (Person Accounts)
- 45 million Order records
- 120 million Order Line Item records
- 5 million Case records
- 800 active Salesforce users (sales, service, and analytics teams)

Performance complaints:
- Customer service agents wait 30+ seconds for order history to load on Account pages
- A nightly batch job processing new orders is timing out
- Marketing reports on customer segments are not completing
- An integration that polls for changed orders is consuming 40% of daily API limits

---

## Lab Exercises

### Exercise 1: Query Analysis (25 points)

**Analyze each query and identify: (a) the problem, (b) whether a full table scan is likely, (c) the fix.**

---

**Query A** (from a Visualforce page on the Account record):
```sql
SELECT Id, Order_Number__c, Status__c, Total_Amount__c, Description__c, 
       Notes__c, Customer_Message__c, CreatedDate, LastModifiedDate
FROM Order__c 
WHERE Account__c = :accountId 
ORDER BY Total_Amount__c DESC
```

**Analysis A**:
- `Account__c` is a lookup field — it is automatically indexed. The WHERE clause is selective (one account's orders out of 8M accounts with 45M orders = likely < 1% of orders per account). **Index will be used.**
- `ORDER BY Total_Amount__c DESC`: If `Total_Amount__c` is not indexed, the sort is performed in memory on the result set. For an account with thousands of orders, this in-memory sort is expensive.
- `Description__c`, `Notes__c`, `Customer_Message__c` are likely Long Text Area fields. **Problem**: selecting long text area fields requires joins to additional database tables, increasing query cost.
- **Fix**: 
  1. Remove long text area fields from the query if not needed for the display
  2. Request a custom index on `Total_Amount__c` if ORDER BY on this field is a common pattern
  3. Alternatively, sort by `CreatedDate DESC` (already indexed) to show most recent orders first

---

**Query B** (from a marketing segmentation report):
```sql
SELECT Id, Name, BillingState, AnnualRevenue, Customer_Segment__c
FROM Account
WHERE Customer_Segment__c = 'High Value'
AND IsActive__c = true
```

**Analysis B**:
- `Customer_Segment__c` and `IsActive__c` are custom fields. Without custom indexes, both require a full table scan at 8M accounts. 
- **Selectivity problem**: Even with indexes, if 30% of accounts are "High Value" and 80% are active, the result set is non-selective (30% * 80% = 24% of all accounts = 1.92M records returned). The query optimizer may bypass indexes.
- `Customer_Segment__c = 'High Value'` is a low-cardinality picklist filter — poorly selective alone.
- **Full table scan**: Very likely on 8M records without both indexes AND selectivity.
- **Fix**:
  1. Add a custom index on `Customer_Segment__c` 
  2. If `Customer_Segment__c` is a formula field — **cannot be indexed**; must store as a physical field
  3. For the report: use CRM Analytics (Einstein Analytics) which extracts data to a separate store for analytical queries — avoids LDV report timeout entirely
  4. If the SOQL is used in code (not reports), add a `CreatedDate >= LAST_N_DAYS:365` filter to narrow the scope

---

**Query C** (from a nightly batch Apex job):
```sql
SELECT Id, Status__c, Total_Amount__c, (SELECT Id, Product__c, Quantity__c FROM Order_Line_Items__r)
FROM Order__c
WHERE Status__c != 'Completed'
AND CreatedDate >= :startDate
```

**Analysis C**:
- `Status__c != 'Completed'`: **NOT/!=** is non-selective — it returns everything that is NOT Completed. If 70% of orders are active (not completed), this filter returns 70% of 45M orders = 31.5M records. **Non-selective**.
- Sub-query for Order Line Items with 120M records: each main query record retrieves its line items. This is N+1 at the query level — for each matched Order, a sub-query runs against 120M line items.
- **Full table scan**: Highly likely for `Status__c != 'Completed'`.
- **Fix**:
  1. Replace `Status__c != 'Completed'` with positive filter: `Status__c IN ('New', 'Processing', 'Pending')` — positive filters are more selective
  2. Combine with `CreatedDate` filter: this is already there — ensure the date range is narrow enough to be selective (last 7 days for a nightly job, not last year)
  3. Move sub-query to a separate bulk query: `SELECT Id FROM Order_Line_Item__c WHERE Order__c IN :orderIds` — process line items in bulk after main query completes

---

**Query D** (from an integration polling for changed orders):
```sql
SELECT Id, Status__c, Total_Amount__c, LastModifiedDate
FROM Order__c
WHERE LastModifiedDate >= :lastPollTimestamp
ORDER BY LastModifiedDate ASC
```

**Analysis D**:
- `LastModifiedDate` (SystemModstamp equivalent) is a standard indexed field. Date range queries on this field are generally selective.
- For the polling problem (40% API limit consumption): this query runs every 5 minutes regardless of whether anything changed. 12 times/hour * 24 hours = 288 API calls/day just for polling.
- **Problem is architecture, not the query**: The query itself is reasonably optimized. The problem is that polling is the wrong pattern.
- **Fix**: Replace polling with **Change Data Capture** on the Order object. CDC publishes events only when changes occur. The integration subscribes to OrderChangeEvent. Zero API calls when nothing changes.

---

### Exercise 2: Index Strategy Design (25 points)

**Task**: For the RetailMax org, design the index strategy for the Order__c object (45 million records).

**Approach**: 
1. List the top 5 query patterns for Order__c (based on the business scenario)
2. Identify which fields in each query pattern need indexes
3. Determine which indexes already exist (standard) and which need to be requested
4. Recommend one two-column compound index

**Top 5 Query Patterns for Order__c**:

| # | Query Pattern | Fields Used in WHERE/ORDER BY |
|---|---|---|
| 1 | Orders for a specific Account | `Account__c` (FK — already indexed) |
| 2 | Orders by status for batch processing | `Status__c`, `CreatedDate` |
| 3 | Orders in date range for reporting | `CreatedDate` (standard index), `Status__c` |
| 4 | Orders by assigned rep + status | `OwnerId` (standard), `Status__c` |
| 5 | High-value orders for alerts | `Total_Amount__c`, `Status__c` |

**Index Recommendations**:

1. `Status__c` — custom index (not automatically indexed — must request from Salesforce Support)
2. `Total_Amount__c` — custom index (if range queries like `Total_Amount__c > 10000` are common)
3. Two-column compound index: **(OwnerId, Status__c)** — for query pattern 4 (rep's open orders), the combination is more selective than either alone
4. No additional index needed on `CreatedDate` or `Account__c` — already standard indexed

**Request to Salesforce Support**: 
- Custom index on `Status__c`
- Custom index on `Total_Amount__c` (if range queries confirmed)
- Two-column compound index on (OwnerId, Status__c)

---

### Exercise 3: Batch Architecture Design (25 points)

**Task**: A nightly Apex batch job must process all Orders created in the last 24 hours and calculate a summary metric on the Account. Currently it is timing out. Redesign the architecture.

**Current (broken) architecture**:
```apex
// Runs at midnight, processes yesterday's orders
Database.QueryLocator locator = Database.getQueryLocator(
    'SELECT Id, Account__c, Total_Amount__c FROM Order__c ' +
    'WHERE CreatedDate = YESTERDAY'
);
// Batch size: 200 (default)
// For each batch, queries Account and updates it
```

**Problems**:
1. `WHERE CreatedDate = YESTERDAY` — is CreatedDate indexed? Yes — standard index. This should be selective. But if yesterday had 200,000 new orders (high retail volume), the batch processes 200,000 records / 200 per batch = 1,000 batches. At 30 seconds per batch, that's 500 minutes — way more than the nightly window.

2. Account update in each batch: if 10 orders for the same Account appear in the same batch, the Account is queried and updated 10 times (SOQL in a loop — worst case). Lock contention on Account records.

**Redesigned architecture**:

```apex
// Step 1: Aggregate in SOQL — one query instead of per-record processing
SELECT Account__c, SUM(Total_Amount__c) totalAmount, COUNT(Id) orderCount
FROM Order__c
WHERE CreatedDate = YESTERDAY
GROUP BY Account__c
// Returns one row per Account — maximum 2,000 rows in aggregate query

// Step 2: If more than 2,000 Accounts had orders yesterday, use a different approach:
// Batch the Orders but aggregate per Account within each batch using a Map
// Then update Accounts in bulk (one update per Account, not per Order)
```

**Key architecture improvements**:
1. Increase Batch Apex chunk size to 2,000 (from 200) — reduce batch count from 1,000 to 100
2. Use a Map in the batch execute method: `Map<Id, Decimal> accountTotals = new Map<Id, Decimal>()`
3. Aggregate per Account within each batch chunk — update each Account only once per batch chunk
4. Consider moving to a Chain of Queueable Apex for better error handling and monitoring
5. Long-term: Use a roll-up summary field on Account if the relationship is master-detail (no batch needed at all)

---

### Exercise 4: Report and Reporting Architecture (25 points)

**Task**: A marketing manager needs a weekly report showing: all High Value customers (customer_segment = 'High Value'), their total orders in the last 90 days, and their last contact date. The report must include 50,000+ records and currently times out.

**Root causes**:
1. `Customer_Segment__c` — is it a formula or stored field? If formula → not indexable → full table scan on 8M accounts
2. Joining to Order__c (45M records) for 90-day totals — sub-query or report join — expensive
3. 50,000+ rows in a standard report — standard reports display max 2,000 rows; export max 500,000 rows but at 50k records with joins, this will timeout

**Architectural solutions**:

**Option A: CRM Analytics (Einstein Analytics)**
- Extract Account, Order, and Activity data to CRM Analytics
- Build the analysis in a CRM Analytics dataset and lens
- Queries run against the CRM Analytics store (separate from transactional Salesforce)
- No governor limits on analytical queries
- **Recommended for recurring, complex analytical reporting at LDV scale**

**Option B: Materialized Summary Fields**
- Create stored fields on Account: `Orders_Last_90_Days__c` (number), `Total_Order_Value_Last_90_Days__c` (currency)
- A scheduled nightly batch Apex updates these fields for all active accounts
- The report filters and displays stored fields — no join to Order__c needed
- Report runs fast; data is 24 hours stale (acceptable for weekly marketing report)

**Option C: External BI (Tableau, Power BI)**
- Connect to Salesforce via Analytics API or direct Connect
- Run analytical queries outside Salesforce's governor limits
- Best for enterprises with existing BI investments

**PTA Recommendation for RetailMax**: CRM Analytics (Option A) if budget allows — it scales indefinitely and supports advanced segmentation use cases. Materialized summary fields (Option B) as a short-term fix while CRM Analytics is implemented.

---

## Lab Summary: Key Takeaways

1. **NOT and != operators** produce non-selective queries — rewrite as positive IN/= filters
2. **Long text area fields** in SELECT cause expensive table joins — select only needed fields  
3. **Formula fields** as WHERE filters always cause full table scans — materialize to stored fields
4. **ORDER BY on non-indexed fields** at LDV scale is expensive — ensure ORDER BY fields are indexed
5. **Polling integrations** should be replaced with CDC for event-driven, API-efficient sync
6. **Aggregate queries** (GROUP BY) can replace per-record processing in batch — dramatically reduces batch count
7. **CRM Analytics** is the correct architectural solution for complex analytical reports on LDV objects

---

## PTA Advisory Note

In performance remediation engagements, always start with the query (not the infrastructure). A customer asking for more server capacity or Salesforce storage upgrades often actually needs query redesign. The conversation should be:
1. Identify the slowest queries (Event Monitoring, Query Analyzer)
2. Run Query Plan tool on each — identify table scan candidates
3. Fix selectivity issues first (compound filters, avoid NOT/!= where possible)
4. Request custom indexes where needed
5. Only after query optimization: evaluate skinny tables, batch redesign, or analytical platform
