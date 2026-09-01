# Lecture 11: Data Cloud + Analytics (Tableau & CRM Analytics)

## Learning Objectives
- Explain how Tableau connects to Data Cloud to enable visual analytics on unified customer data
- Describe the CRM Analytics (Salesforce Reports & Dashboards) integration with Data Cloud
- Identify which Data Cloud objects are accessible for analytics (DMOs, CIs, Unified Individual)
- Understand how Calculated Insights serve as pre-aggregated metrics for analytics dashboards

---

## Slides

### Slide 1: Analytics Integration Overview
**Visual:**
```
                         DATA CLOUD
                     ┌──────────────────┐
                     │  DMOs + CIs      │
                     │  Unified         │
                     │  Individual      │
                     └────────┬─────────┘
                              │  (modeled layer only — not DLOs)
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
  ┌───────────────┐  ┌────────────────┐  ┌────────────────┐
  │    TABLEAU    │  │  CRM ANALYTICS │  │  SALESFORCE    │
  │  (Desktop /   │  │  (Einstein     │  │  REPORTS &     │
  │   Server)     │  │   Analytics)   │  │  DASHBOARDS    │
  └───────────────┘  └────────────────┘  └────────────────┘
              │               │
              ▼               ▼
  ┌───────────────┐  ┌────────────────┐
  │  External BI  │  │  Embedded in   │
  │  (via direct  │  │  CRM record    │
  │   connector)  │  │  pages         │
  └───────────────┘  └────────────────┘
```

**Content:**
- Data Cloud's unified customer data is valuable beyond marketing — analytics is a primary use case
- **Tableau:** Salesforce's dedicated visualization platform; connects directly to Data Cloud via Tableau Data Cloud connector
- **CRM Analytics (formerly Einstein Analytics):** Salesforce's native BI tool; deep integration with Data Cloud objects
- **Salesforce Reports:** Basic reporting on Data Cloud DMO objects surfaced in Salesforce CRM
- Analytics uses the **modeled layer** (DMOs, CIs) — not raw DLOs
- Real-time analytics are possible when paired with streaming ingestion

**Speaker Notes:** Analytics integration is tested on the exam as a Use Case topic. You don't need to be a Tableau expert — the exam tests whether you understand the connection patterns, which Data Cloud objects are queryable, and what role CIs play in enabling analytics. The key concept is that analytics consumes the DMO layer — the same layer that segmentation uses. This means the same unified, quality-controlled customer data that powers your marketing segments also powers your executive dashboards and data science workflows.

---

### Slide 2: Tableau + Data Cloud
**Visual:**
```
  TABLEAU CONNECTION TO DATA CLOUD
  ──────────────────────────────────────────────────────────
  Tableau Desktop / Server
  ┌──────────────────────────────────────────────────────┐
  │  Connect to Data  →  Salesforce Data Cloud           │
  │  ─────────────────────────────────────────────────   │
  │  Server URL:  [your-org.my.salesforce.com      ]     │
  │  Auth:        [OAuth 2.0 ▼]  [Sign In with SF  ]     │
  └──────────────────────────────────────────────────────┘
              │
              ▼
  QUERYABLE IN TABLEAU:
  ✓  Data Model Objects (DMOs)
  ✓  Calculated Insights (CIs)
  ✓  Unified Individual

  NOT QUERYABLE IN TABLEAU:
  ✗  Data Lake Objects (DLOs) — raw staging layer not exposed

  QUERY MODES:
  ┌────────────────┬─────────────────────────────────────┐
  │ Live Connection│ Queries run against Data Cloud now  │
  │                │ Freshest data; potentially slower   │
  ├────────────────┼─────────────────────────────────────┤
  │ Extract        │ Data pulled to Tableau in-memory    │
  │                │ Faster queries; as fresh as extract │
  └────────────────┴─────────────────────────────────────┘
```

**Content:**
- Tableau connects to Data Cloud via the **Tableau Data Cloud connector** (built-in, no additional install)
- Connection requires: Data Cloud org URL, OAuth 2.0 authentication
- Queryable objects in Tableau: **DMOs, Calculated Insights, Unified Individual**
- DLOs are NOT queryable from Tableau — only the modeled layer is exposed
- Tableau can join multiple DMOs for cross-object analysis
- Live connection (queries run against Data Cloud in real time) vs. Extracts (scheduled data pulls to Tableau's in-memory store)

**Speaker Notes:** The Tableau connection details are tested in the exam. The OAuth authentication requirement is consistent across all external connections to Salesforce. The most important limitation: only the modeled layer (DMOs and CIs) is available in Tableau — DLOs are not exposed. This is by design — the raw, unstructured data in DLOs isn't useful for analytics without the standardization that DMOs provide. The Live vs. Extract distinction is relevant for performance and freshness: Live connections show the most current data but can be slower for complex queries; Extracts are faster but only as fresh as the last extract refresh.

---

### Slide 3: CRM Analytics Integration
**Visual:**
```
  CRM ANALYTICS DASHBOARD — Data Cloud sourced
  ──────────────────────────────────────────────────────────
  ┌──────────────────────────────────────────────────────┐
  │ Customer Segment Size Over Time                      │
  │  ████████████████████████████████████               │
  │  ██████████████████████████████████████████         │
  │  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep         │
  ├──────────────────────────────────────────────────────┤
  │ Top Product Categories by Customer Count             │
  │  Electronics  ████████████████  42,800               │
  │  Apparel      ████████████       31,200               │
  │  Home & Garden████████           24,100               │
  ├──────────────────────────────────────────────────────┤
  │ Avg Lifetime Value by Loyalty Tier                   │
  │  Platinum  $4,280  │  Gold  $2,150  │  Silver  $890  │
  └──────────────────────────────────────────────────────┘
  Data source: Data Cloud DMOs + CIs
  Embedded in: CRM record pages (Account, Contact, etc.)
  Access: Analytics Studio → Salesforce Data Cloud connector
```

**Content:**
- **CRM Analytics** (formerly Einstein Analytics) is Salesforce's native BI platform embedded in the CRM
- Data Cloud data is available in CRM Analytics via the **Salesforce Data Cloud connector** in Analytics Studio
- Supports querying DMOs, CIs, and Segment membership
- **SAQL (Salesforce Analytics Query Language)** can be used for custom analysis
- CRM Analytics dashboards can be embedded in CRM record pages (Account, Contact, etc.)
- Enables use cases like: customer health score dashboards, segment performance analytics, CI trend monitoring

**Speaker Notes:** CRM Analytics integration is particularly valuable for use cases where salespeople and service agents need to see data-enriched customer views within their normal CRM workflow. Imagine a Sales Cloud opportunity page that shows an embedded CRM Analytics chart of the customer's purchase history and loyalty tier — powered by Data Cloud DMOs. The exam tests awareness of this integration at a conceptual level: you need to know CRM Analytics can consume Data Cloud objects and that this is a native Salesforce integration, not a third-party connection.

---

### Slide 4: Using Calculated Insights in Analytics
**Visual:**
```
  CALCULATED INSIGHT: Customer_Purchase_Stats
  ──────────────────────────────────────────────────────────
  DUAL-PURPOSE — same CI serves both segmentation AND analytics

  IN SEGMENT CRITERIA:              IN TABLEAU ANALYTICS:
  ┌──────────────────────┐          ┌──────────────────────┐
  │ Calculated Insight   │          │  Bar Chart:          │
  │ TotalRevenue >= 1000 │          │  Avg TotalSpend90d   │
  │  ↓                   │          │  by Customer Segment │
  │ Filters who is in    │          │   Gold:  $2,400      │
  │ the segment          │          │   Silver: $890       │
  └──────────────────────┘          │   Bronze: $320       │
                                    └──────────────────────┘

  ONE DEFINITION — used consistently across all use cases
  No divergence between marketing metrics and analytics metrics

  Common analytics uses for CIs:
  • Trend: avg order value change over time
  • Distribution: TotalSpend90d across tiers
  • Correlation: high CI score → higher retention?
```

**Content:**
- **Calculated Insights are dual-purpose:** they power both segmentation AND analytics
- In analytics, CI measures appear as columns in the queryable CI object
- Common analytics use cases for CIs:
  - Trend analysis: how has average order value changed over time?
  - Distribution analysis: what's the distribution of TotalSpend90d across customer tiers?
  - Correlation analysis: do high-CI-score customers have higher retention rates?
- CI data in analytics reflects the last scheduled refresh — not real-time
- CIs with date dimensions enable time-series analysis in Tableau

**Speaker Notes:** The dual-purpose nature of Calculated Insights is worth emphasizing because it illustrates the efficiency of the Data Cloud model. You write a CI once — to compute customer metrics — and it serves both operational segmentation AND analytical reporting. This is a key architectural advantage: the same metric definition is used consistently across all use cases, preventing divergence between "what the marketing team's segments use" and "what the analytics team's dashboards show." The exam may test this as a design question: "how would you ensure the customer lifetime value metric used in segments is the same as what's displayed in analytics dashboards?" The answer is: use a Calculated Insight as the source for both.

---

### Slide 5: Unified Individual in Analytics
**Visual:**
```
  TABLEAU SCATTERPLOT — Customer Analytics
  ──────────────────────────────────────────────────────────
  Y-axis: DaysSinceLastPurchase (CI measure)
  X-axis: TotalSpend90d (CI measure)
  Color:  LoyaltyTier (attribute)
  Grain:  One dot = One UNIFIED INDIVIDUAL (deduplicated)

    High │   ●Bronze  ●Bronze
    Days │  ●Silver
  Since  │      ●Silver ●Gold●Gold
  Last   │         ●Gold  ●Platinum
  Purch  │              ●Platinum
    Low  └──────────────────────────
         Low      TotalSpend90d     High

  KEY: Unified Individual as analytics grain eliminates
       double-counting customers who appear in 3 source systems.
       Without IR, the same customer = 3 dots, skewing analysis.

  Enables: RFM analysis, cohort analysis, customer journey mapping
```

**Content:**
- The **Unified Individual** is the analytics foundation — one row per customer
- Unified Individual attributes (reconciled profile fields) available as analytics dimensions
- Contact Point data linked to Unified Individual enables channel analysis (email vs. SMS vs. in-store)
- All linked source DMOs accessible via Unified Individual relationships in analytics tools
- Enables cohort analysis, RFM (Recency, Frequency, Monetary) modeling, and customer journey mapping
- Unified Individual count = total unique resolved customers — important KPI for data health reporting

**Speaker Notes:** Using the Unified Individual as the analytics grain is powerful because it gives you a single deduplicated row per customer — avoiding the double-counting that would happen if you analyzed raw source records directly. A customer with records in three source systems would appear as three rows if you query at the source level. The Unified Individual collapses that to one row. For RFM analysis (a common retail analytics pattern), you'd use the Unified Individual as the row grain and CI measures for the Recency, Frequency, and Monetary values. The exam may reference this pattern in use case questions.

---

### Slide 6: Analytics Architecture Considerations
**Visual:**
```
  TWO QUERY PATHS — Performance vs. Freshness

  PATH 1: LIVE QUERY
  ──────────────────────────────────────────────────────────
  Tableau ──query──▶ Data Cloud ──scan DMO──▶ Results
                                              Latency: seconds to minutes
                                              Data: freshest available
                                              Best for: small DMOs, ad-hoc

  PATH 2: SCHEDULED EXTRACT (Recommended for large scale)
  ──────────────────────────────────────────────────────────
  Data Cloud ──scheduled pull──▶ Tableau in-memory store
                                  Latency: <1 second (in-memory)
                                  Freshness: as of last extract
                                  Best for: large DMOs, dashboards

  PERFORMANCE PRINCIPLE:
  For aggregate metrics → use CIs (pre-computed = fast)
  NOT live GROUP BY queries against millions of transactions

  PUSHDOWN SQL: Tableau pushes filter logic to Data Cloud
                for server-side execution (helps but has limits)
```

**Content:**
- **Live queries** run against Data Cloud in real time — freshest data, potentially slower
- **Scheduled extracts** load data into Tableau's fast in-memory storage — faster, but dated
- For large DMOs (millions of records), Calculated Insights are better than live queries
- CI pre-computation reduces analytics query complexity and improves performance
- **Pushdown SQL:** Tableau pushes query logic to Data Cloud for server-side execution
- Data volumes in Data Cloud can be much larger than CRM analytics is designed for — plan for performance

**Speaker Notes:** Architecture considerations for analytics are tested at a conceptual level. The key performance pattern is: for high-volume, complex aggregate analytics, pre-compute using Calculated Insights rather than running live complex queries. CIs are already aggregated, so Tableau queries against them are fast. Live queries against raw transaction DMOs with millions of records can be slow. The pushdown SQL concept means Tableau is smart enough to send filtering conditions to Data Cloud rather than downloading all records first — but this optimization only helps so much with very large datasets. For the exam: when performance is the concern, use CIs as the analytics source.

---

### Slide 7: Data Cloud Analytics Use Cases
**Visual:**
```
  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
  │     RETAIL           │  │  FINANCIAL SERVICES  │  │     HEALTHCARE       │
  │  ──────────────────  │  │  ──────────────────  │  │  ──────────────────  │
  │  Customer LTV        │  │  Relationship        │  │  Care Gap            │
  │  Dashboard           │  │  Profitability       │  │  Analytics           │
  │                      │  │  Analysis            │  │                      │
  │  Metrics:            │  │  Metrics:            │  │  Metrics:            │
  │  • TotalSpend (CI)   │  │  • TotalAUM (CI)     │  │  • DaysSince         │
  │  • PurchaseFreq (CI) │  │  • TotalLiabilities  │  │    Screening (CI)    │
  │  • ProductAffinity   │  │  • RelationshipProfit│  │  • CaregapScore (CI) │
  │    (CI)              │  │    (CI)              │  │                      │
  │                      │  │  Data Spaces:        │  │  Requires:           │
  │  By loyalty tier,    │  │  Strict isolation    │  │  BAA + consent       │
  │  region, channel     │  │  per product team    │  │  validation          │
  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
  All follow: Ingest → Model into DMOs → Compute CIs → Visualize in Tableau/CRM Analytics
```

**Content:**
- **Retail:** Unified Customer LTV dashboard — visualize TotalSpend, purchase frequency, and product affinity by customer segment
- **Financial Services:** Relationship profitability analysis — cross-product revenue by unified customer profile
- **Healthcare:** Care gap analysis — identify patients missing preventive care using engagement and clinical DMO joins
- **Telecom:** Churn prediction dashboard — visualize churn risk scores alongside usage metrics
- All use cases follow the same pattern: ingest data, model into DMOs, compute CIs, visualize in Tableau or CRM Analytics
- Data Cloud analytics reduces time-to-insight by eliminating ETL to a separate data warehouse

**Speaker Notes:** Use case questions are 17% of the exam — the largest single domain. These use cases aren't just examples — they represent the types of scenarios the exam will present as scenario questions. Knowing the industry pattern (retail, financial services, healthcare) and the corresponding Data Cloud capability (CLV dashboards, relationship profitability, care gap analysis) gives you the vocabulary to answer scenario questions confidently. The common thread in all use cases: Data Cloud eliminates the need for a separate analytics ETL pipeline by making the unified customer data directly queryable from analytics tools.

---

### Slide 8: Analytics Best Practices
**Visual:**
```
  ANALYTICS DESIGN PRINCIPLES
  ──────────────────────────────────────────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │ 1. Use CIs as primary source for aggregate metrics      │
  │    (not live queries against raw transaction DMOs)      │
  ├─────────────────────────────────────────────────────────┤
  │ 2. Align CI naming between analytics and segmentation   │
  │    teams — one definition, used consistently            │
  ├─────────────────────────────────────────────────────────┤
  │ 3. Schedule analytics extracts AFTER CI refresh         │
  │    completes (same dependency chain as segments)        │
  ├─────────────────────────────────────────────────────────┤
  │ 4. Use Unified Individual as analytics grain            │
  │    (avoid double-counting from raw source records)      │
  ├─────────────────────────────────────────────────────────┤
  │ 5. Monitor analytics query performance                  │
  │    (slow = missing CI, over-large live query)           │
  ├─────────────────────────────────────────────────────────┤
  │ 6. Analytics access follows Data Space model            │
  │    (Finance data restricted = restricted in Tableau too)│
  └─────────────────────────────────────────────────────────┘
```

**Content:**
- Use **Calculated Insights** as the primary analytics source for aggregate metrics — not live DMO queries
- Align **CI naming conventions** between the analytics and segmentation teams to ensure shared metric definitions
- Schedule **analytics extracts** (Tableau) to run AFTER CI refresh completes to ensure fresh data
- Use **Unified Individual** as the analytics grain to avoid customer double-counting
- Monitor **analytics query performance** — slow queries may indicate missing CIs or over-large live queries
- Work with the **data governance team** to ensure analytics access follows the Data Space access model

**Speaker Notes:** The best practices in this slide bridge the analytics and governance sections. The scheduling recommendation echoes what we covered in Lecture 10 — analytics data is only as fresh as the underlying CI refresh, which is only as fresh as the Data Stream refresh. The governance note about analytics access following the Data Space model is important: if a Finance Data Space restricts who can see financial DMO data, that restriction should also apply to analytics tools connecting to those DMOs. The double-counting risk from not using Unified Individual is a real-world data quality issue that the exam may present in scenario form.

---

## Recording Script

Welcome to Lecture 11. In this lecture, we're looking at how Data Cloud's unified data powers analytics — specifically through Tableau and CRM Analytics.

The core insight is that the same rich, unified customer data that powers marketing segments is also a goldmine for analytics. Instead of building separate data warehouse pipelines to get customer data into your BI tools, Data Cloud makes it directly queryable.

Tableau connects to Data Cloud through a native connector. Authentication uses OAuth 2.0 — the same pattern we've seen throughout this course. Once connected, Tableau can query your DMOs and Calculated Insights. Two important limitations: DLOs are not exposed to Tableau — only the modeled DMO layer. And analytics reflects data as of the last ingestion and CI refresh — it's not a truly live stream of events.

Calculated Insights are particularly valuable for analytics because they're already aggregated — your TotalSpend90d or AverageOrderValue metrics are pre-computed per customer. Instead of Tableau running a complex GROUP BY query against millions of transaction records, it's reading a single pre-computed value per customer row. Much faster, and consistent with what's used in segments.

For CRM Analytics users, the integration is native to Salesforce. Analytics Studio can connect to Data Cloud objects and surface unified customer metrics in dashboards embedded directly in CRM record pages. Your sales reps can see a customer's purchase history, loyalty tier, and spending trends right inside the Account record.

The Unified Individual is the right grain for most customer analytics. It gives you one deduplicated row per customer — avoiding the inflation that comes from querying raw source records where the same customer might appear three times across three source systems.

Performance tip: for large-scale analytics, favor Calculated Insights over live queries against raw transaction DMOs. CIs are pre-computed, making Tableau queries against them much faster.

In Lecture 12, we look at the AI and Agentforce integrations — where Data Cloud becomes the grounding source for AI-powered customer experiences. See you there.

---

## Exam Tips

- Tableau connects to Data Cloud via OAuth 2.0 — DLOs are **not** exposed, only DMOs and CIs
- **Calculated Insights** serve double duty: they power both segment criteria AND analytics metrics
- For performance, use **Calculated Insights** as the Tableau source for aggregate metrics rather than live queries against raw transaction DMOs
- Use **Unified Individual** as the analytics grain to avoid double-counting customers who have records in multiple source systems
- CRM Analytics dashboards can be **embedded in Salesforce CRM record pages**, enabling data-enriched views for sales and service reps

---

## Lecture Summary

Data Cloud integrates with Tableau via a native connector using OAuth 2.0 authentication, exposing DMOs and Calculated Insights (not DLOs) for analytics. CRM Analytics integrates natively within Salesforce, enabling Data Cloud-powered dashboards embedded in CRM record pages. Calculated Insights serve both segmentation and analytics, providing consistent metric definitions across both use cases and improving analytics performance through pre-aggregation. The Unified Individual provides a deduplicated customer grain for analytics, eliminating double-counting across source systems. Analytics data is as current as the last ingestion and CI refresh cycle, making proper job scheduling essential. Use case patterns include retail CLV dashboards, financial services relationship profitability analysis, and healthcare care gap identification.

---

## Mini Quiz

**Question 1:** A data analyst connects Tableau to Data Cloud but cannot find the raw event data from the Web Engagement DLO. Why is this data unavailable in Tableau?

A) Tableau requires a special license to access event data from Data Cloud  
B) DLOs are raw staging data and are not exposed through the Data Cloud analytics layer  
C) The Web Engagement DLO has not been configured for external access  
D) Real-time streaming data cannot be queried from Tableau  

**Answer: B**
DLOs are the raw storage layer and are intentionally not exposed through Data Cloud's analytics interface. Only the modeled layer — DMOs and Calculated Insights — is queryable from Tableau and other analytics tools. If the analyst needs web engagement data, it must first be mapped to the Web Engagement DMO through field mapping.

---

**Question 2:** A marketing analytics team and a segmentation team both need to use "Total Revenue Last 90 Days" as a metric. The marketing team uses it in Tableau dashboards and the segmentation team uses it in segment criteria. What is the best approach to ensure both teams use the same calculation?

A) Create separate SQL-based views in Tableau and in the segment criteria editor  
B) Create one Calculated Insight with TotalRevenue90d as a measure, and use it in both segments and Tableau analytics  
C) Create a custom DMO field on Individual that stores the pre-calculated value  
D) Use related attribute filters in segments and live Tableau queries against Sales Order DMO  

**Answer: B**
A single Calculated Insight defines the metric once and makes it available both as a segment criteria source and as a Tableau-queryable column. This ensures both teams are using the same calculation, defined in one place. Creating separate implementations risks divergence between the metric definitions over time.

---

**Question 3:** A Tableau dashboard showing customer analytics from Data Cloud is performing slowly for large enterprise customer counts. The dashboard primarily shows per-customer aggregate metrics like total spend and purchase frequency. What is the recommended optimization?

A) Switch to a live Data Cloud connection instead of an extract  
B) Query the Sales Order DLO directly instead of the DMO for faster raw access  
C) Pre-compute the aggregate metrics as Calculated Insights and query the CI in Tableau  
D) Reduce the Unified Individual count by increasing Identity Resolution thresholds  

**Answer: C**
Pre-computing aggregate metrics as Calculated Insights moves the heavy aggregation work to Data Cloud's scheduled CI refresh, rather than running live GROUP BY queries at dashboard load time. Tableau querying pre-computed CI rows is significantly faster than running real-time aggregation against millions of transaction records. DLOs are not exposed to Tableau, so option B is not possible.
