# Salesforce Integration Architecture Designer (CRT-404) — Practice Exam
### 50 Scenario-Based Questions

---

## DOMAIN 1: Integration Problem Design (26%) — Questions 1–13

---

**Question 1**
A global retailer needs to synchronize Order records to their ERP system within 5 seconds of creation in Salesforce. The ERP can consume up to 80 messages per second. Which integration pattern best meets these requirements?

A. Schedule a Bulk API batch job every 5 minutes to push new orders to the ERP
B. Use a record-triggered Flow to publish a Platform Event; a MuleSoft integration subscribes, buffers, and forwards to the ERP with rate-limiting
C. Use an Apex HTTP callout inside a before-insert trigger to call the ERP synchronously
D. Configure Outbound Messages via Workflow Rules pointing directly at the ERP endpoint

**Answer: B**
**Explanation:** Platform Events decouple the Salesforce transaction from the callout, ensuring the record saves even if the ERP is slow. MuleSoft's rate-limiting capability handles the ERP's throughput constraint, and Platform Events provide a 72-hour replay buffer for resiliency.

**Why the others are wrong:**
- A: A 5-minute batch window does not satisfy the 5-second latency requirement.
- C: A synchronous callout inside a trigger blocks the transaction, can hit callout limits, and creates a tight coupling that breaks if the ERP is slow.
- D: Outbound Messages are synchronous and cannot rate-limit; they also retry on failure but cannot buffer for throughput control.

---

**Question 2**
A healthcare company needs to migrate 120 million patient records from a legacy system to Salesforce over a weekend cutover window. The records are available as CSV files on an SFTP server. Which approach is most appropriate?

A. Use the REST API with parallel threads to insert records in real time
B. Use the Bulk API 2.0 with CSV files to process records in large parallel batches
C. Use the SOAP API with batch size set to maximum (200) records per call
D. Use Platform Events published from the legacy system to trigger Salesforce record creation

E. Use the Metadata API to load large volumes of record data

**Answer: B**
**Explanation:** Bulk API 2.0 is purpose-built for large-volume data loads, processing millions of records asynchronously in parallel batches with built-in retry and error handling. It handles CSV input natively and is the correct tool for one-time or periodic large-volume migrations.

**Why the others are wrong:**
- A: REST API has per-user daily API call limits (100k by default) and is not designed for bulk ingestion at this scale.
- C: SOAP API at 200 records/call would require 600,000 API calls — far exceeding limits and being extremely slow.
- D: Platform Events are designed for real-time event-driven patterns, not bulk migration; they have their own publish limits and add unnecessary complexity.

---

**Question 3**
A financial services firm processes loan applications. After a loan is approved in Salesforce, several downstream systems must be notified: a document management system, a credit bureau reporting system, and an email notification service. The firm wants loose coupling and the ability to add new consumers without modifying Salesforce. Which pattern is most appropriate?

A. Use three separate Apex callouts from a trigger — one to each downstream system
B. Publish a Platform Event on loan approval; each downstream system subscribes independently via CometD or MuleSoft
C. Use Outbound Messages to call each system in sequence using workflow rules
D. Create a scheduled Apex job that polls for approved loans every minute and calls each system

**Answer: B**
**Explanation:** The publish/subscribe pattern with Platform Events gives loose coupling: Salesforce publishes one event and never needs to know about subscribers. New consumers can be added without any Salesforce changes, satisfying the extensibility requirement.

**Why the others are wrong:**
- A: Three separate callouts tightly couple Salesforce to each consumer; adding a fourth requires a code change and redeployment.
- C: Outbound Messages are tightly coupled to specific endpoints; each addition requires a new Workflow Rule and is synchronous.
- D: One-minute polling is near-real-time but adds unnecessary latency and consumes API call quota with constant polling.

---

**Question 4**
A manufacturing company's ERP generates inventory updates every 2 hours in a flat file placed on an SFTP server. The integration team needs to reflect these updates in Salesforce. The file can contain up to 500,000 records. Which is the most appropriate integration approach?

A. Have the ERP call the Salesforce REST API every 2 hours via a webhook
B. Use a scheduled MuleSoft flow that picks up the file from SFTP, transforms it, and calls Salesforce Bulk API 2.0
C. Configure Salesforce to poll the SFTP server directly using a scheduled Apex job
D. Use Platform Events published by MuleSoft at a rate of one event per record

**Answer: B**
**Explanation:** A scheduled MuleSoft flow handles file-based, scheduled batch integration — the canonical batch pattern. Bulk API 2.0 is designed for high-volume upserts, making this combination ideal for 500k-record files on a 2-hour cadence.

**Why the others are wrong:**
- A: The ERP produces files, not webhooks; restructuring the ERP is out of scope and not practical.
- C: Salesforce Apex cannot directly connect to SFTP servers; file-based ingestion requires middleware or a custom callout solution.
- D: Publishing 500,000 individual Platform Events would hit publish limits and is the wrong pattern for scheduled batch file processing.

---

**Question 5**
A SaaS company wants to display live stock price data on a Salesforce Lightning page. The stock feed pushes updates every 3 seconds. Users should see price changes without refreshing the page. What is the recommended approach?

A. Use a scheduled Apex job to query the stock API every 3 seconds and update a custom object
B. Use the Salesforce Streaming API (Generic Streaming or Platform Events) combined with an external service that pushes updates into Salesforce, and subscribe the Lightning component via empApi
C. Use Apex HTTP callouts from the Lightning component to the stock API on a 3-second timer
D. Use Salesforce Connect with an External Object to query the stock API on demand

**Answer: B**
**Explanation:** Streaming API with CometD/empApi enables server-push to the browser without polling, delivering near-real-time updates to Lightning components. An external feed processor publishes events into Salesforce, and the UI component subscribes via empApi for instant updates.

**Why the others are wrong:**
- A: Scheduled Apex has a minimum 1-minute interval and cannot run every 3 seconds.
- C: Apex callouts cannot be initiated directly from a Lightning component; Lightning components call Apex methods, which cannot run on a client-side timer in a supported way.
- D: Salesforce Connect shows data on-demand when a record is viewed; it does not push live updates to the UI automatically.

---

**Question 6**
A company's integration currently takes 45 minutes to complete a nightly sync of 2 million records using the REST API. They want to reduce this to under 10 minutes. What change will have the greatest impact?

A. Increase the REST API page size from 200 to 2000 records per request
B. Switch from REST API to Bulk API 2.0, which processes records in parallel server-side batches
C. Add retry logic to the existing REST API integration to reduce failures
D. Compress the JSON payloads using gzip to reduce network transfer time

**Answer: B**
**Explanation:** Bulk API 2.0 processes jobs in parallel server-side batches optimized for large datasets, typically achieving orders-of-magnitude better throughput than serial REST API calls. Switching to Bulk API 2.0 directly addresses the throughput bottleneck.

**Why the others are wrong:**
- A: Increasing REST page size helps marginally but you still make serial calls; the API limit ceiling and serial nature prevent achieving 10-minute targets at 2M records.
- C: Retry logic improves reliability, not throughput — it would not reduce the 45-minute runtime.
- D: Gzip compression reduces bandwidth but the bottleneck is API call count and server-side processing, not network transfer size.

---

**Question 7**
A company requires that all integration messages between Salesforce and their warehouse management system (WMS) are guaranteed to be processed exactly once, even if the network fails or the WMS goes down temporarily. Which design element is most critical to satisfy this requirement?

A. Using synchronous callouts so the transaction either succeeds or fails atomically
B. Implementing idempotency keys on the WMS side and using a durable message queue (e.g., MuleSoft VM queues or an ESB) with at-least-once delivery
C. Using Outbound Messages, which automatically retry until the endpoint acknowledges
D. Storing records in a custom Salesforce object as a staging area and processing them via scheduled Apex

**Answer: B**
**Explanation:** Exactly-once delivery requires two components: a durable queue that retries on failure (at-least-once delivery guarantee) and idempotency on the receiver so duplicate retries produce no unintended side effects. Together these achieve exactly-once processing semantics.

**Why the others are wrong:**
- A: Synchronous callouts fail if the WMS is down; they do not queue for retry, so they cannot guarantee delivery during outages.
- C: Outbound Messages provide at-least-once delivery via retry, but without idempotency keys on the WMS side, duplicate messages will cause duplicate processing.
- D: Staging in a custom object with scheduled Apex provides polling-based retry but does not address idempotency on the WMS side and introduces significant latency.

---

**Question 8**
A Salesforce org processes 15,000 Case updates per day through automation. The integration team wants to use Change Data Capture (CDC) to stream these changes to a data warehouse. During peak hours, up to 3,000 updates occur in a single hour. Which consideration is most important when designing this CDC-based integration?

A. CDC events expire after 24 hours, so the consumer must process events before they expire
B. CDC events expire after 72 hours and the consumer should track the replay ID to resume after failures; peak hourly volume must be within the CDC event daily delivery allocation
C. CDC events are delivered in guaranteed order per object, so the consumer can always trust record state
D. CDC events include full record snapshots, so the consumer does not need to query Salesforce for additional field values

**Answer: B**
**Explanation:** CDC events have a 72-hour replay window, and tracking the replay ID allows consumers to resume from exactly the point of failure. Architects must also verify the integration falls within the CDC daily event delivery allocation for the org's edition, as allocations are per object channel.

**Why the others are wrong:**
- A: CDC events have a 72-hour retention window, not 24 hours; this is a commonly confused limit.
- C: CDC does not guarantee strict ordering across independent transactions; high concurrency can cause events to arrive slightly out of sequence.
- D: CDC events include only changed fields in the delta, not full record snapshots; consumers often need to query for fields not present in the event payload.

---

**Question 9**
An e-commerce company experiences unpredictable traffic spikes during flash sales, sometimes 10x normal volume. Their Salesforce-to-inventory integration uses direct synchronous callouts. The inventory system can handle 200 requests per second maximum. What architectural change best addresses this problem?

A. Increase the inventory system's capacity to handle Salesforce peak load
B. Introduce a message queue between Salesforce and the inventory system; Salesforce publishes events to the queue, and a consumer reads from the queue at the inventory system's rate limit
C. Add a try/catch block in Apex to retry failed callouts immediately up to 3 times
D. Use the Bulk API to batch inventory updates and run them every 5 minutes

**Answer: B**
**Explanation:** A message queue acts as a buffer that absorbs traffic spikes, allowing Salesforce to publish at any rate while the consumer forwards messages to the inventory system at its safe throughput ceiling. This decouples the two systems' capacity constraints.

**Why the others are wrong:**
- A: Scaling the inventory system may not be feasible or cost-effective, and does not protect it from being overwhelmed by unpredictable spikes.
- C: Immediate retries in a catch block will compound the problem during a spike — adding more requests to an already overloaded system.
- D: Batching every 5 minutes introduces latency that may be unacceptable for inventory availability accuracy during a flash sale.

---

**Question 10**
A company is designing an integration where Salesforce must call an external system and wait for the response before completing the transaction (e.g., a real-time credit check during quote creation). The external system responds in 2–4 seconds. What is a key NFR to validate before choosing synchronous callout?

A. Whether the external system supports OAuth 2.0 authentication
B. Whether the Apex callout timeout (default 10 seconds, max 120 seconds) and the governor limit of one callout per transaction are acceptable for user experience
C. Whether the external system is in the same geographic region as the Salesforce org
D. Whether the external system supports JSON or only XML payloads

**Answer: B**
**Explanation:** Synchronous callouts block the Salesforce transaction and the user's UI thread. The architect must confirm: (1) the callout stays within the timeout limit, (2) no other callouts are needed in the same transaction (Salesforce allows multiple callouts per transaction but not after DML), and (3) 2–4 second UI blocking is acceptable to users.

**Why the others are wrong:**
- A: Authentication method affects implementation details but not the fundamental suitability of synchronous callout for this use case.
- C: Geographic proximity affects latency but the 2–4 second response time already accounts for this; it is not the primary NFR to validate.
- D: Payload format affects implementation but not the architectural choice between sync and async patterns.

---

**Question 11**
A company wants to integrate Salesforce with their SAP ERP for bidirectional sync of Account data. Which scenario would indicate that an event-driven pattern is LESS suitable than a request-response pattern?

A. Account updates in Salesforce need to be reflected in SAP within 5 minutes
B. SAP needs to query the current credit limit of an Account in real time before approving a purchase order
C. New Accounts created in Salesforce need to be synchronized to SAP for downstream billing
D. Bulk account data corrections need to be applied to both systems overnight

**Answer: B**
**Explanation:** When the external system needs to query Salesforce and act on the response in the same business transaction (e.g., approve/reject a purchase order based on current data), a synchronous request-response pattern is required. The query result must be returned immediately to the SAP process that is waiting for it.

**Why the others are wrong:**
- A: A 5-minute SLA is loose enough for an event-driven/async pattern such as scheduled jobs or CDC.
- C: New Account propagation is a fire-and-forget pattern; the Salesforce user does not need to wait for SAP confirmation.
- D: Overnight bulk corrections are a classic batch pattern, not requiring real-time response.

---

**Question 12**
A company has the following integration requirements: (1) 50,000 records updated daily, (2) updates must appear in Salesforce within 2 hours, (3) the source system can push data but cannot pull, (4) data must be transformed during transit. Which combination of patterns best fits?

A. Salesforce-initiated scheduled REST API pull every 2 hours
B. Source system pushes to a middleware layer (MuleSoft) that transforms and upserts via Salesforce Bulk API on a scheduled trigger
C. Source system publishes Platform Events consumed by Salesforce Flows
D. Salesforce Connect External Objects to query the source system on-demand

**Answer: B**
**Explanation:** The source system can push (not pull), so Salesforce cannot initiate. Middleware receives the push, applies transformation, and uses Bulk API 2.0 for efficient high-volume upsert. The 2-hour SLA is easily met with a near-continuous or triggered middleware pipeline.

**Why the others are wrong:**
- A: Salesforce initiating a pull contradicts requirement 3 (source can push but not be polled).
- C: The source system cannot publish directly to Salesforce Platform Events without a Salesforce-specific SDK; middleware is needed, and Platform Events are not designed for 50k record bulk ingestion.
- D: Salesforce Connect shows data on-demand but does not write it into Salesforce records, and it would not serve scheduled updates.

---

**Question 13**
A company is evaluating whether to use Platform Events or Change Data Capture for an integration where an external data warehouse needs to receive every field change made to Opportunity records in Salesforce. Which statement is the most important differentiator for this decision?

A. Platform Events are better because they can carry custom payloads with any business data
B. Change Data Capture is better because it automatically captures all field-level changes to Opportunity records with a delta payload, without requiring custom Apex or Flow code to publish events
C. Platform Events are better because they have a higher daily event volume allocation than CDC
D. Change Data Capture is better because it delivers events in strict chronological order per record

**Answer: B**
**Explanation:** CDC is the correct tool for this use case because it automatically tracks all field changes to a standard or custom object without requiring developers to write publishing code. It includes which fields changed, the old and new values (for some fields), and record metadata — exactly what a data warehouse sync needs.

**Why the others are wrong:**
- A: Custom payloads are an advantage for Platform Events in business process scenarios, but CDC's automatic field-level delta tracking is more valuable when the goal is capturing all data changes.
- C: CDC and Platform Events both have daily delivery allocations that vary by edition; neither is universally higher; this is not the key differentiator for field-change capture.
- D: CDC provides reasonable ordering but does not guarantee strict chronological order across concurrent transactions; this is not a reliable differentiator.

---

## DOMAIN 2: Salesforce API Use (22%) — Questions 14–24

---

**Question 14**
A developer needs to create 1 parent Account and 3 related Contacts in a single atomic transaction via the API. If any record fails, all should be rolled back. Which API and approach should be used?

A. Make four separate REST API calls in sequence and handle rollback manually if any fails
B. Use the Composite API with `allOrNone: true`, referencing the Account's `referenceId` in the Contact payloads
C. Use the Bulk API 2.0 with a single CSV file containing all four records
D. Use the SOAP API `create()` call with a list of four sObjects

**Answer: B**
**Explanation:** The Composite API with `allOrNone: true` executes up to 25 subrequests in a single HTTP call and rolls back all operations if any subrequest fails. Reference IDs allow you to use the newly created Account's ID in the Contact records within the same request.

**Why the others are wrong:**
- A: Sequential REST calls cannot be rolled back atomically; you must implement complex compensation logic manually.
- C: Bulk API 2.0 processes records asynchronously in batches — it cannot guarantee atomicity across parent and child records in the same batch.
- D: SOAP API's `create()` method processes records independently; it does not support atomic all-or-none across parent-child relationships in a single call.

---

**Question 15**
An integration sends 5,000 REST API requests per day to a Salesforce org using a single integration user. The team notices they are hitting the API call limit. What is the DEFAULT per-user daily REST API limit that is most commonly cited for Salesforce?

A. 100 requests per day per user
B. 1,000 requests per day per user (the "per-user" allocation that contributes to the org-wide pool)
C. 15,000 requests per day per user
D. There is no per-user limit; only an org-wide total limit applies

**Answer: B**
**Explanation:** Each Salesforce user license contributes 1,000 API calls per day to the org's pooled total (with various license types contributing different amounts). The org-wide total is the sum of all user contributions. Using a single integration user does not eliminate this pool, and the exam commonly tests this 1,000 calls/user/day figure.

**Why the others are wrong:**
- A: 100 requests/day is far too low and not a documented Salesforce limit.
- C: 15,000 is an older Enterprise Edition org-wide baseline number, not the per-user contribution figure.
- D: There is an org-wide limit that is calculated based on user count; while individual users share a pool, the pool is ultimately bounded by user-based allocation.

---

**Question 16**
An integration team needs to query Salesforce and receive real-time notifications when an Account's Status field changes to "Churned" — without polling. The external system uses a Java client. Which API should they use?

A. REST API with a scheduled polling loop every 30 seconds
B. Salesforce Streaming API (PushTopic or Change Data Capture) with a CometD client subscription
C. Bulk API 2.0 query mode with results checked every minute
D. SOAP API `query()` called on a schedule

**Answer: B**
**Explanation:** The Streaming API with CometD provides server-push notifications to subscribed clients without polling. The external Java client subscribes to a PushTopic (filtered SOQL) or a CDC channel and receives a notification the moment the Account Status changes, fulfilling the real-time no-polling requirement.

**Why the others are wrong:**
- A: Polling every 30 seconds is not real-time, consumes API quota, and adds latency.
- C: Bulk API query mode is for large-volume data extraction, not event-driven notifications; it requires client-side polling for job completion.
- D: Scheduled SOAP API calls are polling and do not provide the real-time push capability requested.

---

**Question 17**
A developer needs to call the Salesforce API to perform: (1) a SOQL query, (2) update 3 records returned from the query, and (3) call an Apex REST endpoint — all in a single HTTP request to minimize round trips. Which API supports this?

A. SOAP API — it supports multiple operations in one envelope
B. Composite API — it executes up to 25 subrequests including queries, DML, and Apex REST calls in one HTTP call
C. REST API Batch resource — it executes multiple requests but does not support cross-referencing results
D. Bulk API 2.0 — it supports mixed operation types in a single job

**Answer: B**
**Explanation:** The Composite API supports up to 25 subrequests in a single HTTP call and allows reference IDs to pass results from one subrequest into the next. It natively supports query, update, and Apex REST subrequest types, making it the correct choice for chained operations.

**Why the others are wrong:**
- A: SOAP API does not natively batch multiple different operation types (query + update + Apex REST) in one envelope; each operation type is a separate call.
- C: The REST Batch resource (sObject Collections) sends multiple DML operations but does not support SOQL queries or Apex REST calls as subrequests.
- D: Bulk API 2.0 only supports a single operation type per job (insert, update, upsert, delete, query) — not mixed types.

---

**Question 18**
An external application needs to call a Salesforce REST API endpoint. The application is a server-side service with no user involved. Which OAuth 2.0 flow should be used?

A. User-Agent flow, because it is the simplest to implement
B. Web Server flow (Authorization Code), because it provides a refresh token
C. JWT Bearer Token flow, because it enables server-to-server authentication without user interaction or storing passwords
D. Username-Password flow, because it is the most direct way to use service account credentials

**Answer: C**
**Explanation:** The JWT Bearer Token flow is designed for server-to-server (daemon/service) integrations. It uses a digital certificate (no user password stored in the integration), requires no user interaction, and produces short-lived access tokens — the recommended secure pattern for headless integrations.

**Why the others are wrong:**
- A: The User-Agent flow is designed for browser-based apps where the user is present; it is not appropriate for server-side services.
- B: The Web Server flow requires a user to authorize via a browser redirect; it is for user-delegated access, not service-to-service.
- D: The Username-Password flow is deprecated and considered insecure because it transmits credentials directly; Salesforce recommends against it for new integrations.

---

**Question 19**
A Salesforce integration is using the Composite API and the developer adds a 26th subrequest to the payload. What will happen?

A. Salesforce will process the first 25 subrequests and silently ignore the 26th
B. Salesforce will return an error because the Composite API has a hard limit of 25 subrequests per call
C. Salesforce will split the request into two batches and process them sequentially
D. Salesforce will process all 26 subrequests if the total payload size is under 1 MB

**Answer: B**
**Explanation:** The Composite API enforces a hard limit of 25 subrequests per call. Submitting a request with 26 or more subrequests results in a 400 Bad Request error. Developers must split large batches into multiple Composite API calls.

**Why the others are wrong:**
- A: Salesforce does not silently truncate; it rejects the entire request with an error.
- C: Salesforce does not automatically split Composite requests; the client is responsible for batching.
- D: The 25-subrequest limit is independent of payload size; there is no exception based on payload size.

---

**Question 20**
An integration team is choosing between REST API and SOAP API for a new enterprise integration with an on-premise .NET system. The .NET team has existing WSDL-based tooling. The Salesforce side needs to support complex queries and CRUD operations. Which recommendation is most appropriate?

A. Use REST API because it is always better than SOAP API for enterprise integrations
B. Use SOAP API if the .NET team's existing infrastructure is WSDL-based, as it integrates natively with WCF/Visual Studio tooling, reducing implementation effort
C. Use Bulk API 2.0 because .NET handles CSV files well
D. Use Platform Events because they are more modern than both REST and SOAP

**Answer: B**
**Explanation:** When the consuming team has mature WSDL/WCF tooling, the SOAP API's WSDL-based contract reduces integration effort significantly — Salesforce's Enterprise WSDL generates strongly typed proxy classes. The architect should factor in existing team capability and tooling, not just abstract API modernity.

**Why the others are wrong:**
- A: REST API is more common for new integrations, but "always better" ignores valid use cases where SOAP is the pragmatic choice.
- C: Bulk API 2.0 is for high-volume data operations, not general CRUD and complex query operations.
- D: Platform Events are for event-driven publish/subscribe patterns, not request-response CRUD operations.

---

**Question 21**
A company uses Salesforce and wants an external application to subscribe to Account record changes using Change Data Capture. The external app missed 6 hours of events due to a server outage. How can the app recover the missed events?

A. Query Salesforce using SOQL to find all Accounts modified in the last 6 hours
B. Use the replay ID from the last successfully processed CDC event to resubscribe and receive all events from that point forward, up to the 72-hour retention window
C. Request Salesforce Support to resend the missed CDC events
D. Use Bulk API 2.0 to query the CDC event object for the missed time range

**Answer: B**
**Explanation:** CDC events are stored for 72 hours. A subscriber stores the replay ID of the last processed event and, on reconnection, provides that replay ID to the CometD subscription to receive all events from that point. This is a core design pattern for resilient CDC consumers.

**Why the others are wrong:**
- A: Querying modified records via SOQL retrieves current state but loses the detailed field-level change history and event ordering that CDC provides.
- C: Salesforce Support cannot replay individual CDC event streams; the replay mechanism is built into the Streaming API protocol.
- D: CDC events are not queryable via Bulk API 2.0; they are retrieved via the CometD streaming protocol only.

---

**Question 22**
A company needs to load 10 million records into Salesforce from an external database. They are using Bulk API 2.0. The operation takes 4 hours. The team wants to monitor job progress. Which approach is correct for monitoring Bulk API 2.0 jobs?

A. Subscribe to a Platform Event that Bulk API publishes when jobs complete
B. Poll the Bulk API job status endpoint (`GET /jobs/ingest/{jobId}`) at intervals until the state is `JobComplete` or `Failed`
C. Check the Salesforce Setup > Apex Jobs screen for Bulk API job status
D. Use the REST API to query the `AsyncApexJob` object for Bulk API job records

**Answer: B**
**Explanation:** Bulk API 2.0 jobs are monitored by polling the job status endpoint. The job transitions through states (UploadComplete, InProgress, JobComplete, Failed, Aborted). Polling this endpoint at reasonable intervals (e.g., every 30–60 seconds) is the supported monitoring approach.

**Why the others are wrong:**
- A: Bulk API 2.0 does not publish Platform Events for job completion; there is no push notification mechanism for bulk job status.
- C: Apex Jobs in Setup shows AsyncApexJob records (Apex Batch/Queueable); Bulk API jobs appear in a separate "Bulk Data Load Jobs" section under Setup.
- D: `AsyncApexJob` tracks Apex-submitted batch jobs, not Bulk API jobs submitted via the REST-based Bulk API.

---

**Question 23**
An architect is comparing REST API and Bulk API 2.0 for an integration that processes 500 records every 15 minutes. The records require a transformation and conditional field mapping. Which API is most appropriate?

A. Bulk API 2.0 — because 500 records is too many for REST API
B. REST API (sObject Collections or Composite) — because 500 records every 15 minutes is a moderate volume well-suited to REST, and Bulk API adds unnecessary overhead and latency for this volume
C. SOAP API — because it has stronger type safety for transformation logic
D. Streaming API — because updates should be pushed, not pulled

**Answer: B**
**Explanation:** Bulk API 2.0 is optimized for millions of records and introduces overhead from the job creation/upload/monitoring lifecycle, adding minutes of latency. For 500 records every 15 minutes, REST API sObject Collections (which handle up to 200 records per call) or Composite API is faster, simpler, and more appropriate.

**Why the others are wrong:**
- A: 500 records is not "too many for REST"; sObject Collections handles up to 200 records per call, needing only 3 REST calls for 500 records.
- C: Type safety is a characteristic of SOAP, but transformation logic lives in the middleware, not the API protocol; SOAP does not offer a meaningful advantage here.
- D: Streaming API is for server-push events; this is a regular batch-scheduled push from middleware to Salesforce, not an event subscription scenario.

---

**Question 24**
A developer discovers that their integration is hitting Salesforce's concurrent API request limit rather than the daily limit. What is the most effective architectural change to address this?

A. Upgrade the Salesforce org to a higher edition to get more daily API calls
B. Implement request queuing and throttling on the integration middleware side so that only N concurrent requests are active at any time
C. Switch from REST API to SOAP API, which has higher concurrency limits
D. Add more integration users to the Salesforce org to increase the concurrent limit pool

**Answer: B**
**Explanation:** Concurrent API request limits (e.g., max 25 long-running requests simultaneously) are independent of daily limits. The fix is on the integration side: implement a semaphore or queue in the middleware to cap concurrent outbound calls to Salesforce, ensuring the concurrent limit is never exceeded.

**Why the others are wrong:**
- A: Edition upgrades affect daily call limits, not the concurrent request limit specifically; this is not the root fix.
- C: SOAP and REST API share the same concurrent request limits in Salesforce; switching protocols does not help.
- D: The concurrent request limit is an org-level cap, not calculated per user; adding users does not increase this limit.

---

## DOMAIN 3: Integration Architecture Patterns (22%) — Questions 25–35

---

**Question 25**
A startup with 3 systems — Salesforce, an ERP, and a support ticketing tool — connects them directly. Six months later, they add 4 more systems. An architect reviews the design and finds 21 point-to-point connections. What is the primary risk of this architecture?

A. The number of connections is fine; point-to-point scales linearly
B. With N systems, point-to-point creates N*(N-1)/2 connections; the architecture becomes exponentially complex, brittle, and expensive to maintain or change
C. Point-to-point is only a risk when connections cross security zones
D. The risk is limited to increased network latency from direct connections

**Answer: B**
**Explanation:** Point-to-point integration scales as N*(N-1)/2, meaning 7 systems requires up to 21 connections. Each change to one system potentially requires updating multiple integrations. This creates a fragile "spaghetti" architecture that is extremely difficult to maintain and evolve.

**Why the others are wrong:**
- A: Point-to-point does NOT scale linearly — it scales quadratically (N squared), which is exactly the problem.
- C: Security zone crossings are a separate concern; the exponential connection growth is the primary architectural risk regardless of security zones.
- D: Latency is not the primary risk; complexity, maintenance cost, and brittleness are the defining characteristics of this anti-pattern.

---

**Question 26**
A company is designing a hub-and-spoke integration architecture with MuleSoft as the hub. Which statement best describes the primary advantage of this pattern over point-to-point?

A. Hub-and-spoke always has lower latency than point-to-point
B. All systems connect only to the hub (N connections instead of N*(N-1)/2), centralizing routing, transformation, and monitoring
C. Hub-and-spoke eliminates the need for security between spoke systems
D. The hub can process messages faster than direct connections between systems

**Answer: B**
**Explanation:** Hub-and-spoke reduces integration connections from N*(N-1)/2 to N by routing all messages through a central hub. This centralizes transformation, monitoring, security policy enforcement, and routing logic — dramatically simplifying maintenance.

**Why the others are wrong:**
- A: Hub-and-spoke adds a hop through the middleware, which can increase latency compared to a direct connection; lower latency is not the primary advantage.
- C: Hub-and-spoke centralizes security policy, but spoke systems still need their own security; the hub does not eliminate the need for security.
- D: Processing speed depends on implementation; the advantage is architectural simplicity and centralization, not raw throughput.

---

**Question 27**
A company uses MuleSoft API-led connectivity. A new mobile application needs to access Customer data currently exposed by an existing Experience API used by the web portal. The data model is identical. What should the architect recommend?

A. Create a new Experience API for the mobile app with its own connection to the System API
B. Reuse the existing Experience API; if mobile-specific adaptations are needed, create a new Experience API that calls the same Process API underneath
C. Have the mobile app call the System API directly to avoid adding a layer
D. Create a new Process API dedicated to the mobile app that duplicates the existing logic

**Answer: B**
**Explanation:** API-led connectivity's key benefit is reuse. The mobile app should consume the existing Experience API if the contract matches. If mobile requires a different payload structure (e.g., lighter responses), a mobile-specific Experience API is created — but it reuses the existing Process and System APIs, not duplicating them.

**Why the others are wrong:**
- A: Creating a new Experience API that bypasses the Process API defeats the reuse principle; you still want it to call the Process API.
- C: Having the mobile app call the System API directly bypasses the Process layer, tightly coupling the mobile app to backend system specifics and breaking the API-led separation of concerns.
- D: Duplicating Process API logic violates the DRY principle and creates maintenance overhead; the existing Process API should be reused.

---

**Question 28**
In MuleSoft's API-led connectivity model, which layer is responsible for orchestrating data from multiple System APIs to deliver a complete business object (e.g., a 360-degree Customer view composed of CRM, ERP, and Support data)?

A. Experience API layer — it aggregates data for each consuming channel
B. Process API layer — it orchestrates calls to multiple System APIs and applies business logic to compose the response
C. System API layer — it joins data from multiple backend systems
D. External API layer — this is a separate MuleSoft concept for data orchestration

**Answer: B**
**Explanation:** The Process API layer is the orchestration layer in API-led connectivity. It calls multiple System APIs (CRM, ERP, Support), applies business rules, and assembles a composite response. Experience APIs then consume the Process API and adapt the response for specific channels.

**Why the others are wrong:**
- A: Experience APIs adapt data for a channel (web, mobile, partner) but should not contain orchestration or business logic; they call Process APIs.
- C: System APIs wrap a single backend system with a stable API contract; they do not join data across systems — that is the Process layer's job.
- D: There is no "External API layer" in the standard MuleSoft API-led connectivity model; the three layers are System, Process, and Experience.

---

**Question 29**
A company is migrating from a legacy ESB to MuleSoft. Currently, the ESB handles complex canonical data model transformations. Where in MuleSoft API-led connectivity should these transformations be placed?

A. Experience API layer, so each channel gets a pre-transformed response
B. System API layer, where data is translated from the backend system's native format into the canonical model
C. A shared utility API (Process API layer), so all consumers benefit from a single canonical transformation
D. Transformations should be embedded in each integration point and not centralized

**Answer: B**
**Explanation:** System APIs are responsible for abstracting backend system complexity, including translating native system data formats into the organization's canonical data model. This ensures any consumer of the System API receives consistently structured data without needing to know the backend's native format.

**Why the others are wrong:**
- A: Experience APIs should receive already-normalized data from Process/System APIs; placing canonical transformations here creates duplication across all channel-specific APIs.
- C: A shared Process API for canonical transformation is a valid pattern but is typically used for orchestration; canonical model translation is most naturally done at the System API boundary where the native format is introduced.
- D: Distributing transformations without centralization recreates the inconsistency and duplication problems that a canonical model solves.

---

**Question 30**
A company wants to use an event-driven architecture where Salesforce publishes business events and multiple downstream systems subscribe independently. The company uses MuleSoft Anypoint Platform. Which pattern best describes this architecture?

A. Request-reply with MuleSoft as the synchronous broker
B. Publish/Subscribe (pub/sub) with Salesforce publishing Platform Events or CDC events, MuleSoft acting as an event broker or relay, and downstream systems as independent subscribers
C. Polling-based integration where MuleSoft queries Salesforce on a schedule
D. Saga pattern where each system acknowledges before the next step begins

**Answer: B**
**Explanation:** The pub/sub pattern decouples publishers from subscribers. Salesforce publishes events (Platform Events or CDC) on a channel. MuleSoft subscribes to that channel and can relay events to further downstream systems or act as an event broker for systems that cannot natively consume CometD streams.

**Why the others are wrong:**
- A: Request-reply is synchronous and tightly coupled; it contradicts the goal of independent subscription and loose coupling.
- C: Polling defeats the event-driven goal; it introduces latency and wastes resources querying for changes.
- D: The Saga pattern manages distributed transactions across microservices; it is not a publish/subscribe architecture pattern.

---

**Question 31**
A company has Salesforce, SAP, and Workday, all integrated point-to-point. They are adding Salesforce Marketing Cloud and a new analytics platform. The architect recommends an ESB. Which benefit most directly justifies this recommendation?

A. An ESB will make all integrations faster
B. An ESB centralizes routing, transformation, and protocol mediation, reducing the number of integration connections from N*(N-1)/2 to N and providing a single point of governance
C. An ESB eliminates the need for API design
D. An ESB provides a database for storing integration messages permanently

**Answer: B**
**Explanation:** The primary ESB value proposition is reducing integration complexity as the system count grows. Adding 2 more systems to a 3-system point-to-point mesh (already 3 connections) would require up to 10 connections for 5 systems. An ESB reduces this to 5 connections while adding routing, transformation, and governance capabilities.

**Why the others are wrong:**
- A: ESBs add processing hops; they do not necessarily make integrations faster — the benefit is manageability.
- C: ESBs still require API contracts between connected systems; the ESB mediates between them but does not eliminate the need for API design.
- D: ESBs may provide message persistence for retry and audit, but they are not databases; persistent storage is a feature, not the primary justification.

---

**Question 32**
A company's integration team is choosing between a synchronous API call pattern and an event-driven pattern for a workflow that requires 5 sequential system updates after a Salesforce opportunity is closed-won. The entire workflow must complete within 30 seconds. Which consideration most favors the synchronous pattern here?

A. Synchronous calls are always more reliable than event-driven
B. The 30-second SLA and the sequential dependency between steps (each step depends on the prior result) favor a synchronous orchestration that can enforce order and return errors immediately
C. Synchronous calls are simpler to monitor than event-driven
D. Synchronous calls do not require middleware

**Answer: B**
**Explanation:** When steps are sequentially dependent and the total workflow must complete within a strict SLA (30 seconds), synchronous orchestration ensures each step completes before the next begins, errors are caught immediately, and compensating actions can be taken within the same transaction flow.

**Why the others are wrong:**
- A: Event-driven architectures can be highly reliable with durable queues; synchronous is not inherently more reliable.
- C: Monitoring complexity depends on implementation; distributed tracing can make event-driven systems equally observable.
- D: Event-driven systems also require middleware for reliable delivery; synchronous systems may also use middleware for routing.

---

**Question 33**
A company has implemented a direct integration between their Salesforce org and their on-premise Oracle database using a custom Apex callout. The Oracle team wants to change the database schema. What is the primary integration architectural risk of the current design?

A. Salesforce may not support the new Oracle data types
B. The tight coupling means any Oracle schema change requires a corresponding Apex code change, deployment, and testing — creating a fragile, high-maintenance integration
C. The Apex callout will run slower after the schema change
D. Oracle schema changes invalidate the Salesforce Named Credentials

**Answer: B**
**Explanation:** Point-to-point direct coupling means both systems must change in lockstep. Without an abstraction layer (like a stable API contract exposed by Oracle), every internal Oracle schema change bleeds through to the Salesforce integration code. This is the anti-pattern that middleware and API-led architectures are designed to solve.

**Why the others are wrong:**
- A: Data type compatibility may be a technical concern but is not the primary architectural risk — the coupling issue affects all changes, not just type changes.
- C: Performance is not directly affected by schema changes; this is not an architectural risk.
- D: Named Credentials store connection details (URL, auth), not schema-specific information; they would not be invalidated by a schema change.

---

**Question 34**
A company is designing a microservices-based integration where a single business process (create customer account) spans 3 services: CRM (Salesforce), billing (SAP), and identity (Okta). Each service has its own transaction. If the SAP billing step fails after the Salesforce record is created, how should the architecture handle this?

A. Roll back all three services using a two-phase commit (2PC) protocol
B. Implement a Saga pattern: use compensating transactions (delete the Salesforce Account if SAP fails) and potentially Okta identity rollback, driven by an orchestrator or choreography
C. Use the Composite API to make all three calls atomic in Salesforce
D. Use a database-level distributed transaction across all three systems

**Answer: B**
**Explanation:** The Saga pattern is the standard approach for distributed transactions across microservices with independent datastores. Each step has a corresponding compensating transaction; on failure, the compensating transactions undo completed steps. This avoids the impracticality of distributed 2PC across heterogeneous systems.

**Why the others are wrong:**
- A: Two-phase commit requires all systems to support the 2PC protocol and a coordinator; it is impractical across heterogeneous cloud/on-premise systems like Salesforce, SAP, and Okta.
- C: The Composite API only controls atomicity within Salesforce; it cannot extend atomicity to SAP or Okta.
- D: Database-level distributed transactions across Salesforce, SAP, and Okta are not technically feasible; these systems do not share a database.

---

**Question 35**
When should an architect choose Platform Events over Change Data Capture (CDC) for outbound integration from Salesforce?

A. When capturing all field-level changes to a record is the primary requirement
B. When the integration is triggered by a business event that may or may not be tied to a specific record change (e.g., "order approved" event that includes enriched business data not present on the record)
C. When the consumer needs the previous field values (before-image) alongside the new values
D. When the integration must capture changes made by data loader imports

**Answer: B**
**Explanation:** Platform Events are ideal for business-defined events where the payload is custom-designed, potentially enriched with data from multiple sources, and the trigger is a business milestone rather than a raw record change. CDC is better for data replication where all field deltas must be captured automatically.

**Why the others are wrong:**
- A: Automatic field-level change capture is CDC's strength, not Platform Events — Platform Events require developers to explicitly define and populate every field.
- C: CDC provides before-image values for some fields (in the `ChangeEventHeader`); Platform Events contain only the data the developer explicitly publishes.
- D: CDC captures changes from any source including data loader, integrations, and UI; Platform Events only fire when Apex, Flow, or Process Builder explicitly publishes them — data loader changes would not trigger Platform Events.

---

## DOMAIN 4: Security (17%) — Questions 36–44

---

**Question 36**
An external web application needs to allow individual Salesforce users to log in and access their own Salesforce data via an API. The application acts on behalf of the logged-in user. Which OAuth 2.0 flow is correct?

A. JWT Bearer Token flow — it is designed for user-delegated access
B. Web Server flow (Authorization Code Grant) — the user authenticates with Salesforce, grants consent, and the app receives an access token scoped to that user
C. Client Credentials flow — the app uses its own credentials to access user data
D. Device flow — the user must authenticate on a separate screen

**Answer: B**
**Explanation:** The Web Server (Authorization Code) flow is designed for web applications that act on behalf of a specific user. The user logs in to Salesforce, grants the application permission, and receives an access token. Refresh tokens allow long-lived access without re-prompting the user.

**Why the others are wrong:**
- A: JWT Bearer Token flow is for server-to-server (daemon/service account) access, not user-delegated access; it does not involve a user login flow.
- C: Client Credentials flow authenticates the application as itself (not a user), making it unsuitable when data must be accessed in the context of a specific user.
- D: The Device flow is for constrained input devices (smart TVs, CLIs); it is not appropriate for standard web application user authentication.

---

**Question 37**
A company's integration currently stores the Salesforce API username, password, and security token in plain text in a configuration file on the MuleSoft server. An architect is reviewing this and recommends a change. What is the most appropriate improvement?

A. Encrypt the configuration file using AES-256
B. Use Salesforce Named Credentials combined with OAuth JWT Bearer Token flow; store the private key in MuleSoft Anypoint Secrets Manager instead of plain text
C. Store the credentials in a Salesforce Custom Setting instead of the configuration file
D. Use IP whitelisting to restrict access to the configuration file

**Answer: B**
**Explanation:** Named Credentials store endpoint URLs and authentication details securely in Salesforce, while the JWT Bearer flow eliminates the need to store passwords entirely (using a certificate/private key pair). The private key should be stored in a secrets management vault, not a flat file — this is the recommended secure integration credential pattern.

**Why the others are wrong:**
- A: Encrypting the config file is an improvement but still has key management problems; if the encryption key is on the same server, the security gain is minimal.
- C: Storing credentials in a Salesforce Custom Setting is insecure as Custom Settings are accessible to Apex code and potentially visible to admins in the UI.
- D: IP whitelisting is a network control and does not address the fundamental problem of plaintext credentials — if the server is compromised, the credentials are exposed.

---

**Question 38**
An architect is designing a Salesforce-to-external system integration using Named Credentials. What is the primary security advantage of using Named Credentials over hardcoding the endpoint URL and credentials in Apex code?

A. Named Credentials automatically rotate credentials on a schedule
B. Named Credentials store endpoint URLs and authentication tokens in Salesforce's encrypted storage, preventing credentials from appearing in Apex code, source control, or debug logs
C. Named Credentials allow higher API rate limits on the external system
D. Named Credentials automatically apply OAuth 2.0 to any endpoint, regardless of what the endpoint supports

**Answer: B**
**Explanation:** Named Credentials prevent the #1 integration security antipattern: credentials in code. They are stored in Salesforce's encrypted infrastructure, excluded from Apex debug logs, and not accessible via SOQL — they are only usable in `Http.send()` calls via `callout:NamedCredentialName` references.

**Why the others are wrong:**
- A: Named Credentials do not automatically rotate credentials; rotation must be managed separately (though OAuth flows with refresh tokens handle token refresh automatically).
- C: Named Credentials have no effect on the external system's rate limits; those are controlled by the external system.
- D: Named Credentials support multiple auth protocols (OAuth, Basic Auth, etc.) but only for protocols the external system actually supports; they do not magically apply OAuth to non-OAuth endpoints.

---

**Question 39**
A company wants to use the OAuth 2.0 Client Credentials flow for a server-to-server integration. What is a key security consideration the architect must address?

A. The flow requires user consent on first connection, which must be provisioned in advance
B. Client Credentials flow grants access at the application level, not user level; a system administrator must pre-authorize the Connected App, and the integration should be scoped to the minimum necessary permissions
C. Client Credentials tokens expire after exactly 1 hour and cannot be refreshed
D. Client Credentials flow requires a certificate rather than a client secret

**Answer: B**
**Explanation:** Client Credentials tokens represent the application's identity, not a specific user. A system admin must pre-authorize ("pre-approve") the Connected App in Salesforce. The architect must enforce least-privilege scoping, since the token has broad application-level access — there is no user-level boundary.

**Why the others are wrong:**
- A: Client Credentials flow does not involve user consent; that is the characteristic of Authorization Code flow. The pre-authorization by an admin is a separate step.
- C: Token expiration depends on the org's configuration; Salesforce tokens can be configured for various lifetimes, and Client Credentials tokens can be refreshed by re-requesting a token using the client secret.
- D: Client Credentials can use either a client secret or a certificate (PKCE/mTLS); requiring a certificate is not specific to this flow.

---

**Question 40**
A company is implementing the JWT Bearer Token flow for a Salesforce integration. During testing, the developer receives an error: "invalid_grant." What is the MOST LIKELY cause?

A. The JWT is using RS256 algorithm instead of HS256
B. The certificate used to sign the JWT does not match the certificate uploaded to the Salesforce Connected App, or the Connected App has not been pre-authorized for the integration user
C. The JWT payload is missing the `iss` claim
D. The client is using HTTP instead of HTTPS

**Answer: B**
**Explanation:** `invalid_grant` in the JWT flow almost always indicates a certificate mismatch (the signing key does not correspond to the certificate in the Connected App) or that the Connected App has not been pre-authorized for the specific user being asserted in the `sub` claim. These are the two most common causes.

**Why the others are wrong:**
- A: Salesforce requires RS256 for JWT Bearer; using HS256 would cause a different error about the signing algorithm.
- C: A missing `iss` claim would cause a validation error, but typically returns a more specific error about the JWT structure rather than `invalid_grant`.
- D: HTTP vs HTTPS affects the transport but Salesforce's token endpoint always requires HTTPS; the error would typically be a connection error, not `invalid_grant`.

---

**Question 41**
An architect is reviewing a Salesforce integration that calls an external payment processor. The payment processor requires mutual TLS (mTLS). How should this be configured in Salesforce?

A. Use a Named Credential with Basic Auth and add the certificate in the external system's firewall
B. Upload the client certificate to Salesforce Certificate and Key Management, reference it in a Named Credential configured for certificate-based authentication, and ensure the payment processor's server certificate is trusted via the CA certificate in Salesforce
C. Use the JWT Bearer Token flow — it uses certificates and is equivalent to mTLS
D. mTLS is not supported in Salesforce callouts; a middleware layer must handle the mTLS handshake

**Answer: B**
**Explanation:** Salesforce supports mTLS for outbound callouts. The client certificate (with private key) is uploaded to Salesforce's Certificate and Key Management, referenced in the Named Credential or directly in the Apex HTTPRequest. The payment processor's CA certificate must be trusted in Salesforce's Remote Site Settings or trusted certificates store.

**Why the others are wrong:**
- A: Basic Auth is a different authentication mechanism; simply adding a certificate to a firewall does not configure mTLS at the TLS layer.
- C: JWT Bearer Token is an OAuth flow for Salesforce authentication; it does not configure mTLS for outbound callouts to third-party systems.
- D: Salesforce does support client certificate-based mTLS for outbound callouts; a middleware layer is not required for this capability.

---

**Question 42**
A company's Connected App in Salesforce is configured with the OAuth scopes `api` and `refresh_token`. A developer wants the integration to also manage Salesforce content (Files). Which action is required?

A. No action needed; `api` scope covers all Salesforce resources including content
B. Add the `content` OAuth scope to the Connected App and have users or admins re-authorize the application with the updated scope
C. Create a second Connected App dedicated to content access
D. Use the `full` scope instead of `api` to enable all resource access

**Answer: B**
**Explanation:** Salesforce OAuth scopes are additive and specific. The `api` scope covers standard REST API access but not Salesforce Files/Content APIs. The `content` scope must be explicitly added, and because scope changes affect the access token's permissions, the Connected App must be re-authorized.

**Why the others are wrong:**
- A: The `api` scope does not cover all Salesforce resources; specific capabilities like Content, Chatter, and Wave have separate scopes.
- C: A second Connected App is unnecessary; scopes can be added to the existing Connected App.
- D: The `full` scope is broad and violates the principle of least privilege; it is not recommended for production integrations.

---

**Question 43**
A company exposes a Salesforce Experience Cloud API to external partners. Partners must authenticate, but the company does not want partners to have individual Salesforce user licenses. What is the recommended authentication pattern?

A. Share a single Salesforce username and password with all partners
B. Use a Connected App with the Client Credentials flow; each partner gets their own Connected App (or a unique consumer key/secret pair) and the integration runs as a designated system user
C. Use the User-Agent flow so partners can authenticate via their browser
D. Issue each partner a Salesforce Community (Partner) license so they can use standard OAuth

**Answer: B**
**Explanation:** Client Credentials flow (or JWT Bearer) with a Connected App per partner allows each partner to authenticate using their own credentials (consumer key/secret or certificate) without a Salesforce user license. The integration runs in the context of a single system/integration user, and per-partner Connected Apps enable individual tracking, revocation, and rate limiting.

**Why the others are wrong:**
- A: Sharing credentials is a serious security violation; there is no audit trail, and revoking access for one partner revokes access for all.
- C: User-Agent flow requires a browser and user interaction; it is not appropriate for system-to-system partner API access.
- D: Partner licenses provide UI access to Community; they are a licensing cost and are designed for user access, not API-only service account patterns.

---

**Question 44**
A company notices that their Salesforce integration's access tokens are being logged in plain text in their integration middleware's debug logs. What is the most important security remediation?

A. Shorten the token expiration time to reduce the exposure window
B. Implement log masking/redaction for tokens in the middleware logging framework, use Named Credentials to keep tokens out of code, and audit log access controls
C. Switch from OAuth to Basic Auth since passwords are easier to rotate than tokens
D. Disable debug logging in the middleware to prevent token exposure

**Answer: B**
**Explanation:** Log masking ensures tokens never appear in logs regardless of log level. Named Credentials keep tokens in Salesforce's encrypted store, preventing them from ever appearing in callout code. Access controls on log files limit who can read exposed tokens. This is a defense-in-depth approach to credential exposure in logs.

**Why the others are wrong:**
- A: Shorter token expiration reduces the window of vulnerability but does not eliminate the root cause — tokens are still logged and accessible to anyone with log access.
- C: Switching to Basic Auth makes the situation worse: passwords are less easily rotated than OAuth tokens, and Basic Auth credentials in logs are equally or more sensitive.
- D: Disabling debug logging removes valuable diagnostic capability; the correct fix is to mask sensitive data, not eliminate logging entirely.

---

## DOMAIN 5: Problem-Solving (13%) — Questions 45–50

---

**Question 45**
A Salesforce-to-ERP integration has been working for months. It suddenly starts failing with "UNABLE_TO_LOCK_ROW" errors during peak business hours. The integration uses a trigger that fires on Opportunity updates and makes callouts. What is the MOST LIKELY root cause and recommended fix?

A. The ERP API endpoint has changed; update the Named Credential URL
B. Multiple concurrent Opportunity updates are creating row-lock contention; restructure to use Platform Events or queueable Apex to process asynchronously and reduce lock duration
C. The integration user's password has expired; reset the password
D. The daily API limit has been reached; wait until midnight for the counter to reset

**Answer: B**
**Explanation:** "UNABLE_TO_LOCK_ROW" occurs when multiple transactions try to update the same records concurrently. Synchronous callouts inside triggers extend transaction duration (holding locks while waiting for the ERP response), increasing contention. The fix is to decouple the callout from the trigger using Platform Events or Queueable Apex, releasing the row lock immediately after the DML.

**Why the others are wrong:**
- A: A URL change would produce a connection error or 404, not a row-lock error.
- C: An expired password would produce an authentication error, not a row-lock error.
- D: API limit exhaustion produces "REQUEST_LIMIT_EXCEEDED" errors, not row-lock errors.

---

**Question 46**
An integration sends an Order to the warehouse management system (WMS). Due to a network blip, the WMS returns a timeout, but the Order was actually created. The integration retries and creates a duplicate Order in the WMS. How should idempotency be implemented to prevent this?

A. Use Salesforce transactions — if the callout times out, the Order record in Salesforce will also be rolled back
B. Include a unique idempotency key (e.g., Salesforce Order ID) in every request header; configure the WMS to check for the key and return the existing result if the same key has already been processed
C. Add a unique constraint on the Order Number field in Salesforce to prevent duplicates
D. Set the callout timeout to 60 seconds to eliminate timeouts

**Answer: B**
**Explanation:** Idempotency keys solve the retry-on-timeout problem: the client includes a stable unique identifier (e.g., Salesforce Record ID) with every request. The server uses this key to detect duplicate requests and return the result of the first successful processing without executing the operation again.

**Why the others are wrong:**
- A: Salesforce transactions only control Salesforce DML; an Apex callout timeout does NOT roll back a Salesforce record — the record is committed, and the exception is caught in the calling code.
- C: A Salesforce-side unique constraint prevents Salesforce duplicates; it does nothing to prevent WMS-side duplicates caused by network retries.
- D: Longer timeouts reduce (but do not eliminate) the chance of timeout errors; they do not address what happens when the duplicate request still reaches the WMS.

---

**Question 47**
An integration team reports that their MuleSoft-to-Salesforce integration intermittently fails with "System.LimitException: Too many SOQL queries: 101" in Salesforce. The MuleSoft flow sends records in batches of 50 using the REST API. What is the most likely cause?

A. MuleSoft is sending too many HTTP requests per second
B. Salesforce Apex triggers or automation on the object fire per record and each fires SOQL queries, consuming the 100-SOQL-per-transaction governor limit when processing a batch via sObject Collections
C. The REST API has a limit of 100 records per request
D. MuleSoft is not sending the correct Content-Type header

**Answer: B**
**Explanation:** When MuleSoft sends 50 records via sObject Collections, Salesforce processes them in a single transaction. If a trigger fires per record and executes even 3 SOQL queries per record, 50 records × 3 = 150 SOQL queries — exceeding the 100-SOQL-per-transaction limit. The fix is to bulkify the trigger to use one SOQL query per trigger context, not per record.

**Why the others are wrong:**
- A: MuleSoft request rate affects Salesforce's concurrent/daily API limits, not Apex governor limits within a single transaction.
- C: REST API can handle more than 100 records per call via sObject Collections (up to 200); the limit here is Apex governor limits inside the transaction.
- D: A missing Content-Type header would cause a 415 or 400 HTTP error, not an Apex LimitException.

---

**Question 48**
After a Salesforce release, an integration that previously worked starts returning unexpected null values in the response payload. The Salesforce admin confirms no custom code was changed. What should the integration architect investigate FIRST?

A. Check whether the Salesforce release introduced a change to the API version the integration is targeting, or whether field-level security settings were changed on the integration user's profile
B. Restart the middleware server to clear cached tokens
C. Upgrade the integration to the latest Salesforce API version
D. Assume the issue is on the Salesforce side and open a support case

**Answer: A**
**Explanation:** Salesforce releases can change field-level security, introduce new validation rules, or alter object metadata. If the integration user's profile no longer has read access to specific fields (due to a permission change in the release), those fields return null rather than throwing an error. Checking field-level security on the integration user's profile is the correct first diagnostic step.

**Why the others are wrong:**
- B: Cached tokens are connection/authentication artifacts; they do not affect which field values are returned in a response.
- C: Upgrading API versions changes the schema and behavior; it should be done deliberately after investigation, not as a first diagnostic step.
- D: Opening a support case without investigation wastes time; many post-release integration issues are caused by configuration changes (permissions, profiles, sharing rules) that admins can diagnose directly.

---

**Question 49**
An integration that uses Platform Events starts losing events during a high-volume period. Subscribers report that some events were never received. The team is using CometD subscription with `replayId: -1`. What is the problem, and how should it be fixed?

A. `-1` is an invalid replay ID; it should be set to `0`
B. `replayId: -1` means "subscribe to new events only" — events published before the subscription was established are missed. The team should persist the last processed replay ID and use it to resubscribe after reconnection
C. The Platform Event channel has a maximum of 100 concurrent subscribers; the consumer pool is too large
D. CometD does not support high-volume scenarios; switch to REST polling

**Answer: B**
**Explanation:** `replayId: -1` subscribes to events published after the connection is established. During a reconnect (e.g., after a failure), the subscriber misses all events published while it was disconnected. The correct pattern is to store the last successfully processed replay ID durably and use it (`replayId: <lastId>`) to catch up on missed events within the 72-hour retention window.

**Why the others are wrong:**
- A: `-1` is a valid Salesforce replay ID meaning "new events only"; `0` means "all events from the beginning of the retention window" — neither is inherently correct; the persisted replay ID approach is correct.
- C: There is no documented Salesforce limit of 100 concurrent CometD subscribers per channel; this is not the root cause.
- D: CometD/Streaming API is designed for high-volume scenarios; the problem is a configuration issue, not a platform limitation.

---

**Question 50**
A company's batch integration fails every Tuesday night with a "QUERY_TIMEOUT" error when trying to extract 8 million records from Salesforce using a SOQL query in the Bulk API 2.0. The query uses multiple joined objects and a date range filter. What are the two most likely fixes?

A. Switch to REST API and increase the page size to 2000 records
B. (1) Add a selective index or custom index on the date filter field to make the SOQL query selective, and (2) consider breaking the query into smaller date range chunks to reduce per-query result set size
C. Change the batch job from Tuesday to Wednesday when Salesforce has less load
D. Use Salesforce Reports instead of SOQL queries for large data extractions

**Answer: B**
**Explanation:** QUERY_TIMEOUT errors in Bulk API occur when the SOQL query is non-selective (full table scans on large objects) or returns too many records in one scan. Adding a selective index on the date field allows Salesforce to use an index rather than scanning 8M records. Chunking by date range reduces each query's scope, preventing timeouts.

**Why the others are wrong:**
- A: REST API has much lower limits than Bulk API for large extractions and would make the performance worse, not better.
- C: Changing the day may reduce contention slightly but does not fix the non-selective query — the timeout will recur whenever the data volume is high.
- D: Salesforce Reports cannot extract 8 million records via API; they have row limits and are not designed for large-volume data extraction integrations.

---

*End of Practice Exam — 50 Questions*

---

## Quick Reference: Key Numbers to Memorize

| Limit | Value |
|---|---|
| REST API calls per user/day (default) | 1,000 (contributes to org pool) |
| Composite API subrequests per call | 25 max |
| sObject Collections records per call | 200 max |
| Platform Events / CDC retention window | 72 hours |
| Apex SOQL queries per transaction | 100 |
| Apex callout timeout (default / max) | 10s default, 120s max |
| Bulk API 2.0 max file size | 150 MB |
| Scheduled Apex minimum interval | 1 minute (1-hour recommended) |
| Apex callouts per transaction | 100 max callouts, no DML before callout |
| Named Credential callout reference | `callout:MyNamedCredential/path` |

## OAuth Flow Quick Reference

| Flow | Use Case |
|---|---|
| Web Server (Auth Code) | Web app acting on behalf of a logged-in user |
| JWT Bearer Token | Server-to-server / daemon / no user present |
| Client Credentials | App-level access, pre-authorized by admin |
| User-Agent | Browser/SPA app (legacy; not recommended) |
| Username-Password | Legacy only; deprecated / not recommended |
| Device Flow | Limited-input device (TV, CLI) |

## API Selection Quick Reference

| Scenario | API |
|---|---|
| < 2,000 records, CRUD + query | REST API |
| > 100k records, batch insert/update | Bulk API 2.0 |
| Atomic multi-step operations | Composite API |
| Real-time server-push to client | Streaming API (CometD) |
| Automatic field-change capture | Change Data Capture |
| Custom business event publishing | Platform Events |
| .NET/WCF legacy integration | SOAP API |
| Metadata deployment | Metadata API |
