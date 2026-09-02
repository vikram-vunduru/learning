# Salesforce Platform Developer II (CRT-450) — Practice Exam
## 50 Scenario-Based Questions

---

## DOMAIN 1: ASYNC APEX (Questions 1–10)

---

**Question 1**
A developer needs to process 500,000 records nightly and update related parent records. Which approach is correct?

A. A single Batch Apex job with execute() processing 200 records per batch, with try/catch in execute()
B. A scheduled Flow that runs at midnight with fault path handling
C. A Queueable Apex chain where each job processes 200 records
D. A future method called from a scheduled class, 200 records per invocation

**Answer: A**
**Explanation:** Batch Apex splits large data volumes into manageable chunks, each running in its own transaction with its own governor limits. Try/catch in execute() isolates failures per batch so a single bad batch does not abort the entire job.

**Why the others are wrong:**
- B: Flows hit CPU time limits at this scale and are not designed for bulk LDV processing.
- C: Queueable chains are capped at a maximum depth and are not designed for millions-of-records scenarios.
- D: Future methods cannot receive sObject lists, cannot be enqueued in bulk without hitting async limits, and have no built-in chunking.

---

**Question 2**
A Batch Apex job must accumulate a running total across all batches and write a summary record in the finish() method. Which interface must the class implement in addition to Database.Batchable?

A. Database.AllowsCallouts
B. Database.Stateful
C. Database.RaisesPlatformEvents
D. Schedulable

**Answer: B**
**Explanation:** Database.Stateful preserves instance variable values between execute() calls, allowing accumulators to persist across batches. Without it, instance variables reset to their initial values at the start of each execute() invocation.

**Why the others are wrong:**
- A: Database.AllowsCallouts permits HTTP/web service callouts from batch but does not preserve state.
- C: Database.RaisesPlatformEvents does not exist as a standard interface.
- D: Schedulable allows a class to be scheduled but does not address cross-batch state.

---

**Question 3**
A developer needs to make a callout to an external REST API and then perform a DML operation in the same transaction. Which Apex mechanism supports both callouts and DML in the correct order?

A. A future method annotated with @future(callout=true)
B. A Queueable class that implements Database.AllowsCallouts
C. A synchronous Apex trigger
D. A Batch Apex job without Database.AllowsCallouts

**Answer: B**
**Explanation:** Queueable Apex implementing Database.AllowsCallouts can perform a callout and then DML within the same execute() method because callouts must precede any DML in a transaction. Future methods with callout=true also allow callouts but cannot accept non-primitive parameters.

**Why the others are wrong:**
- A: Future methods with callout=true work but cannot accept sObject or collection parameters, limiting flexibility.
- C: Synchronous triggers cannot make callouts unless explicitly allowed; mixing callouts and DML in triggers requires careful ordering and is generally avoided.
- D: Batch jobs require Database.AllowsCallouts to make callouts; without it an exception is thrown.

---

**Question 4**
A Queueable job enqueues another Queueable job from within its execute() method. In a production org, what is the maximum chain depth for this pattern?

A. 5 levels deep
B. No limit; chains can run indefinitely
C. Chaining is not permitted from Queueable execute()
D. The depth limit applies only in test context; production has no limit

**Answer: A**
**Explanation:** Salesforce enforces a maximum Queueable chain depth of 5 in synchronous Apex contexts (such as tests), but in production the platform does allow deeper chains because each enqueued job counts against the org's async queue. The practical governor is the 250,000 async Apex executions per 24-hour rolling window, not an explicit depth cap — however the exam tests on the test-context limit of 1 job enqueued per test run.

**Why the others are wrong:**
- B: Production does not allow indefinite chaining; the 250k/24h limit applies.
- C: Chaining from execute() is the standard Queueable pattern and is fully supported.
- D: The test-context restriction (1 child job) is stricter than production, not the reverse.

---

**Question 5**
A scheduled Apex class must run every hour. The developer implements the Schedulable interface and calls System.schedule() from an anonymous block. What is true about this pattern?

A. A single System.schedule() call can schedule the job with an hourly cron expression
B. You must call System.schedule() 24 times to create 24 hourly jobs
C. Scheduled Apex supports a minimum interval of 15 minutes via a single schedule entry
D. System.schedule() is not valid in anonymous Apex; only in Setup

**Answer: A**
**Explanation:** A single System.schedule() call with the appropriate cron expression (e.g., '0 0 * * * ?') defines the recurrence, including hourly runs. Cron expressions in Salesforce support second, minute, hour, day, month, day-of-week, and optional year fields.

**Why the others are wrong:**
- B: Multiple System.schedule() calls are needed only when the cron expression itself cannot express the desired frequency, such as running at multiple specific minutes.
- C: There is no built-in 15-minute minimum; you can schedule at any cron-expressible interval, including every minute if needed.
- D: System.schedule() is valid in anonymous Apex, triggers, and classes.

---

**Question 6**
A developer has a future method that calls an external API and returns a result. After the method completes, another process needs to use the returned value. What is the correct approach?

A. Store the result in a custom object record inside the future method, then query it in the next process
B. Return the result directly from the @future method to the calling context
C. Use a platform event fired inside the future method to pass the result
D. Both A and C are valid

**Answer: D**
**Explanation:** Future methods are void and cannot return values to the calling context because they execute asynchronously after the calling transaction has already committed. Writing to a record or publishing a platform event from within the future method are both valid patterns to propagate results.

**Why the others are wrong:**
- B: @future methods must be declared void; attempting to return a value causes a compile error.
- A alone or C alone: Both are valid individually; the question asks what is correct, and both patterns work.

---

**Question 7**
A developer wants to chain 10 Queueable jobs in a unit test. After the first System.enqueueJob() call inside Test.startTest(), the test throws a LimitException. What is the most likely cause?

A. Queueable jobs cannot be enqueued inside Test.startTest()
B. Only one System.enqueueJob() call is allowed per test method
C. The test class is missing @isTest(SeeAllData=true)
D. Queueable jobs require a connected app to run in test context

**Answer: B**
**Explanation:** In test context, Salesforce limits enqueuing to one Queueable job per test method to prevent runaway async chains. Attempting to enqueue a second job (even from within the first job's execute()) throws a LimitException.

**Why the others are wrong:**
- A: Queueable jobs can and should be enqueued inside Test.startTest() to allow Test.stopTest() to execute them synchronously.
- C: SeeAllData has no bearing on the async enqueue limit.
- D: No connected app is required for Queueable execution.

---

**Question 8**
A Batch Apex class has a scope (batch size) set to 2,000 in the Database.executeBatch() call. The start() method returns a QueryLocator. What happens?

A. The batch runs with a chunk size of 2,000 records per execute() call
B. Salesforce caps the scope at 200 and ignores the 2,000 value
C. The batch throws a runtime exception because 2,000 exceeds the 200-record DML limit
D. The batch runs with scope 2,000, but governor limits (e.g., SOQL) apply per execute() invocation

**Answer: D**
**Explanation:** When using Database.QueryLocator, the scope parameter can be set up to 2,000 records per execute() call. Each execute() call runs in its own transaction with its own full set of governor limits, so 150 SOQL queries and 10,000 DML rows are available per chunk.

**Why the others are wrong:**
- B: The 200-record default applies only when no scope is passed; passing 2,000 is valid with QueryLocator.
- C: The 200-record DML limit per operation is separate from batch scope; batches can process more records per execute() as long as no single DML call exceeds 10,000 rows.
- A: This is partially correct but misses the critical nuance that governor limits reset per execute() invocation.

---

**Question 9**
A developer needs to run Apex every 5 minutes. Which statement is accurate?

A. A single Schedulable job with a cron expression of '0 0/5 * * * ?' achieves this
B. You must create 12 separate scheduled jobs, each offset by 5 minutes
C. Salesforce does not support scheduling at intervals shorter than 15 minutes
D. Only Flows support sub-15-minute scheduling; Apex requires Setup UI

**Answer: B**
**Explanation:** Salesforce cron expressions do not support interval-based scheduling (e.g., every 5 minutes). To run every 5 minutes, developers must create 12 separate System.schedule() calls with different minute offsets. The org limit is 100 scheduled Apex jobs at a time.

**Why the others are wrong:**
- A: The cron expression '0 0/5 * * * ?' is not valid in Salesforce's Apex scheduler; interval expressions are not supported.
- C: There is no hard 15-minute minimum documented by Salesforce; the limitation is about interval syntax, not a floor.
- D: Flows do not have special sub-15-minute scheduling privileges; they use the same Scheduled Jobs framework.

---

**Question 10**
A Batch Apex finish() method should send an email summary only if no exceptions occurred in any execute() batch. Which implementation achieves this?

A. Wrap the entire finish() logic in try/catch and check for empty exception lists
B. Implement Database.Stateful, maintain a Boolean hasErrors instance variable set to true in execute() catch blocks, and check it in finish()
C. Query the AsyncApexJob object for JobItems with Status = 'Failed' inside finish()
D. Both B and C are valid

**Answer: D**
**Explanation:** Database.Stateful with a flag variable (Option B) is the clean Apex pattern that tracks errors within the job's own state. Querying AsyncApexJob for failed items (Option C) is also valid and provides additional metadata from the platform's job tracking. Both approaches correctly identify whether any batch chunk failed.

**Why the others are wrong:**
- A: Try/catch in finish() only catches exceptions thrown within finish() itself, not those that occurred in earlier execute() invocations.
- B alone: Valid but Option C also works, making D the most complete answer.
- C alone: Valid but relies on the platform job record and requires a SOQL query against AsyncApexJob.

---

## DOMAIN 2: SOQL/DML OPTIMIZATION, GOVERNOR LIMITS, LDV (Questions 11–18)

---

**Question 11**
A trigger on Opportunity fires on after insert. A developer writes a SOQL query inside a for loop that iterates over Trigger.new. In a bulk insert of 300 opportunities, what happens?

A. The trigger runs once for all 300 records; SOQL inside the loop fires 300 times, hitting the 101-query limit and throwing a LimitException
B. The trigger runs in batches of 200; the first batch succeeds and the second fails
C. The SOQL query is automatically bulkified by the platform and fires only once
D. The trigger fires 300 separate times, one per record

**Answer: A**
**Explanation:** DML operations on 300 records fire the trigger once (not 300 times) with all records in Trigger.new. A SOQL query inside a for loop over Trigger.new executes once per iteration, reaching 101 queries and throwing a LimitException before processing all records.

**Why the others are wrong:**
- B: Triggers fire once per DML call regardless of record count; 200 is the batch size for Batch Apex, not triggers.
- C: The platform does not automatically bulkify SOQL; the developer must move queries outside loops.
- D: Triggers fire once per DML operation, not once per record.

---

**Question 12**
A developer queries 50,000 records in a single SOQL statement within a non-batch Apex class. What exception is thrown?

A. QueryException: Too many rows
B. LimitException: Too many query rows: 50001
C. DmlException: Row count exceeded
D. No exception; Salesforce supports up to 50,000 rows synchronously

**Answer: B**
**Explanation:** Synchronous Apex enforces a governor limit of 50,000 total SOQL query rows per transaction. Querying exactly 50,000 rows stays within the limit, but a query returning 50,001 or more throws a LimitException with the message indicating the row cap was exceeded.

**Why the others are wrong:**
- A: QueryException is thrown for malformed queries or no data found, not for row limit violations.
- C: DmlException relates to DML operations, not SOQL row limits.
- D: 50,000 rows is the limit, not a safe maximum to exceed.

---

**Question 13**
A developer calls Database.insert(recordList, false) on a list of 100 Accounts. 10 records fail validation rules. What is the outcome?

A. All 100 records fail because allOrNone is false
B. The 90 valid records are inserted; Database.SaveResult[] contains error info for the 10 failures
C. A DmlException is thrown for the first failed record and execution stops
D. Salesforce rolls back the entire transaction when any record fails

**Answer: B**
**Explanation:** Passing false as the allOrNone parameter enables partial success: valid records are committed and failed records are captured in the SaveResult array without throwing an exception. Developers must iterate the SaveResult array to detect and handle individual failures.

**Why the others are wrong:**
- A: allOrNone=false means partial success is allowed; setting it to true would cause all-or-nothing behavior.
- C: Database.insert() with allOrNone=false does not throw DmlException; exceptions only surface with allOrNone=true or Database.insert(list) (defaults to true).
- D: Rollback on any failure is the allOrNone=true (default) behavior.

---

**Question 14**
An org stores 10 million Contact records. A developer writes a SOQL query: SELECT Id, LastName FROM Contact WHERE LastName = 'Smith'. The query times out. What is the most likely fix?

A. Add LIMIT 2000 to the query
B. Ensure the LastName field has a custom index or is selectively filtered
C. Use Database.getQueryLocator() instead of a direct query
D. Switch to SOSL instead of SOQL

**Answer: B**
**Explanation:** For LDV (Large Data Volume) objects, queries on non-indexed, non-selective fields perform full table scans and time out. Adding a custom index on LastName — or combining it with an indexed field in the WHERE clause — makes the query selective and avoids the timeout.

**Why the others are wrong:**
- A: LIMIT alone does not fix selectivity; the query still scans the full index before limiting results.
- C: Database.getQueryLocator() is for Batch Apex and does not fix non-selective query timeouts.
- D: SOSL searches text indexes and has different behavior; it doesn't address SOQL timeout issues.

---

**Question 15**
A developer uses FOR UPDATE in a SOQL query: SELECT Id FROM Account WHERE Name = 'Acme' FOR UPDATE. What does this accomplish?

A. It refreshes the record from the database, discarding any cached values
B. It locks the queried records so no other transaction can update them until the current transaction commits or rolls back
C. It allows the query to bypass sharing rules temporarily
D. It marks records as dirty and queues them for DML without an explicit update() call

**Answer: B**
**Explanation:** FOR UPDATE acquires a row-level lock on the returned records within the current transaction. Other transactions attempting to update those records will wait or fail with a locking exception, preventing lost-update race conditions in concurrent scenarios.

**Why the others are wrong:**
- A: FOR UPDATE does not refresh cache; use a fresh query without FOR UPDATE for that.
- C: FOR UPDATE has no effect on sharing rules; WITH SECURITY_ENFORCED or sharing keywords control access.
- D: FOR UPDATE does not stage updates; an explicit DML statement is always required.

---

**Question 16**
A developer needs to update a field on 60,000 Opportunity records in a single transaction. Which approach avoids governor limit failures?

A. Use a single Database.update() call on a list of 60,000 sObjects
B. Use Batch Apex with default scope of 200, iterating across all records
C. Use a single UPDATE SOQL statement inside anonymous Apex
D. Use a Queueable job with a loop over all 60,000 records

**Answer: B**
**Explanation:** DML operations in a single transaction are limited to 10,000 rows. 60,000 records must be processed in chunks; Batch Apex naturally breaks the work into separate transactions, each with its own 10,000-row DML limit. 200 records per batch with 300 batches safely completes the full update.

**Why the others are wrong:**
- A: A single DML call with 60,000 records throws a LimitException because it exceeds the 10,000-row DML limit.
- C: There is no UPDATE DML syntax inside SOQL; Apex requires an explicit DML statement.
- D: A single Queueable execute() still runs in one transaction; 60,000 DML rows would exceed limits.

---

**Question 17**
A developer writes: for(Account a : [SELECT Id FROM Account LIMIT 200]) { update a; }. What is the problem with this code?

A. SOQL queries cannot be used directly in for-loop headers
B. DML inside a for loop issues one DML statement per record, consuming 200 of the 150-DML-statements limit
C. The query returns 200 records but DML processes only the last one
D. Update inside a for loop is a compile error

**Answer: B**
**Explanation:** Each update a inside the loop is a separate DML statement, consuming one of the 150 DML statements allowed per transaction. On 200 records this exceeds the limit by 50 and throws a LimitException. The fix is to collect records in a list and issue a single update statement outside the loop.

**Why the others are wrong:**
- A: SOQL queries are valid in for-loop headers; this is the standard SOQL for-loop pattern.
- C: Each iteration updates one record independently; there is no "last record only" behavior.
- D: DML inside a loop is syntactically valid; the problem is a runtime governor limit, not a compile error.

---

**Question 18**
An org uses External ID fields on a custom object. A developer wants to upsert records using the external ID as the key. Which DML method is appropriate?

A. Database.update() with the external ID in the WHERE clause
B. Database.upsert(records, ExternalId__c)
C. Database.insert(records) with allowDuplicates=true
D. Database.merge(masterRecord, recordList)

**Answer: B**
**Explanation:** Database.upsert() accepts an optional external ID field as its second argument, using it to determine whether to insert (no match found) or update (match found) each record. This is the standard pattern for data integration scenarios without relying on Salesforce record IDs.

**Why the others are wrong:**
- A: Database.update() requires a valid Salesforce record ID; you cannot specify a WHERE clause in Apex DML.
- C: Database.insert() always inserts; it has no mechanism to update existing records based on external ID.
- D: Database.merge() is for deduplication, merging up to 3 records of the same object type into one master.

---

## DOMAIN 3: PLATFORM EVENTS, CDC, STREAMING API (Questions 19–24)

---

**Question 19**
A developer needs to publish a near-real-time notification when an Order is shipped, consumed by an external warehouse system. The notification must survive if the warehouse system is temporarily offline. Which technology is most appropriate?

A. Workflow email alert to the warehouse system's email
B. Platform Events with a durable subscription and replay ID support
C. Outbound Messages via SOAP (Workflow Rules)
D. A scheduled Apex job that polls for shipped orders every 5 minutes

**Answer: B**
**Explanation:** Platform Events are durable by default, retaining published events for up to 72 hours in the event bus. External subscribers can reconnect and replay missed events using a replay ID, ensuring no events are lost during downtime. This is the purpose-built pattern for reliable, durable event-driven integration.

**Why the others are wrong:**
- A: Email alerts are not machine-readable event streams and do not support replay.
- C: Outbound Messages use a SOAP-based queue and can retry, but they are workflow-rules–driven and lack the pub/sub flexibility or streaming API support of Platform Events.
- D: Polling introduces latency and wastes API calls; it is not near-real-time.

---

**Question 20**
Which of the following is a key difference between Platform Events and Change Data Capture (CDC) events?

A. CDC events are published by custom Apex code; Platform Events are published by the platform automatically
B. Platform Events are published by Apex or flows; CDC events are automatically published by the platform when records are created, updated, deleted, or undeleted
C. CDC events support up to 10 million subscribers; Platform Events support only 5
D. Platform Events can be used in Apex triggers; CDC events cannot

**Answer: B**
**Explanation:** Change Data Capture automatically generates change events when Salesforce records are modified, without requiring any custom code. Platform Events, on the other hand, must be explicitly published via Apex (EventBus.publish()), Flows, or API calls. Both can be consumed by Apex triggers.

**Why the others are wrong:**
- A: This reverses the correct relationship; Platform Events are published by developers, CDC by the platform.
- C: Subscriber limits are not differentiated by powers of millions; both share the same streaming infrastructure limits.
- D: Apex triggers can subscribe to both Platform Events (on the event object) and CDC events (on the Change Event object).

---

**Question 21**
A Platform Event trigger on Order_Shipped__e processes incoming events. The trigger fails with an unhandled exception. What happens to the event messages?

A. The platform retries event delivery indefinitely until the trigger succeeds
B. The events are permanently lost
C. Failed events are placed in a dead-letter queue visible in Setup
D. The trigger transaction is rolled back but the events remain in the bus for up to 72 hours, and a platform error event is published

**Answer: D**
**Explanation:** When a Platform Event trigger throws an unhandled exception, the DML transaction is rolled back, but the events themselves are not re-delivered automatically. The platform publishes an error to the DeadLetterQueue or logs the failure; the original events are not replayed unless the subscriber explicitly uses the replay mechanism.

**Why the others are wrong:**
- A: Platform Event triggers do not have automatic infinite retry on exception; retry logic must be explicitly implemented.
- B: Events remain in the event bus for 72 hours and can be replayed via replay ID if the subscriber is reconnected.
- C: There is no traditional dead-letter queue visible in Setup for Platform Events; error handling requires custom implementation.

---

**Question 22**
A developer is using the Streaming API with a PushTopic to notify a Lightning component when new high-value Leads are created. The PushTopic query is: SELECT Id, Name FROM Lead WHERE AnnualRevenue > 1000000. What is a limitation of this approach?

A. PushTopics only support object updates, not inserts
B. PushTopics do not support field-level filtering in the WHERE clause
C. PushTopics cannot deliver events to Lightning components; only to external systems
D. PushTopics require the queried fields to be indexed for delivery to work

**Answer: A**
**Explanation:** This is incorrect — PushTopics do support create events. The correct limitation is that PushTopics have a maximum of 50 registered PushTopics per org, events are delivered only if the CometD client is actively connected (no durability like Platform Events), and the WHERE clause is applied at delivery time, not as a database filter. However, for exam purposes, the critical known limitation is that PushTopics are considered legacy in favor of Platform Events and CDC.

> **Correction for exam context:** The most testable limitation is:

A. The Streaming API requires an active CometD connection; missed events are not replayed (no durability)
B. PushTopics do not support field-level filtering in the WHERE clause
C. PushTopics cannot deliver events to Lightning components; only to external systems
D. PushTopics require the queried fields to be indexed for delivery to work

**Answer: A**
**Explanation:** PushTopics lack the durability of Platform Events; if the subscriber disconnects, events published during the disconnection are lost. Platform Events with replay IDs are the recommended replacement precisely because they buffer events for 72 hours. PushTopics are considered legacy technology on the Salesforce platform.

**Why the others are wrong:**
- B: PushTopic WHERE clauses do support filtering; the restriction is on delivery guarantee, not filtering capability.
- C: PushTopics can be consumed by Lightning components via the empApi Lightning module.
- D: PushTopic delivery does not require field indexes; it uses the SOQL query engine.

---

**Question 23**
A CDC trigger on ContactChangeEvent fires. The developer needs to determine which fields were changed. Which approach is correct?

A. Iterate Trigger.new and check each field for null values
B. Call EventBus.getOperationType() to get the changed field list
C. Use the getChangedFields() method on the ChangeEventHeader from the event's ChangeEventHeader field
D. Query the CDC_FieldChange__c object for the related record ID

**Answer: C**
**Explanation:** Every CDC event includes a ChangeEventHeader compound field. The getChangedFields() method on this header returns the list of field API names that were modified in the change that generated the event. This is the documented, supported pattern for inspecting which fields triggered the CDC event.

**Why the others are wrong:**
- A: Null field values in CDC events typically mean the field was not changed, not that it was set to null; this approach produces incorrect results.
- B: EventBus.getOperationType() does not exist; operation type is available via the ChangeEventHeader.
- D: CDC_FieldChange__c is not a Salesforce standard object.

---

**Question 24**
An Apex after-insert trigger on Account publishes a Platform Event. Another Apex trigger subscribes to that same Platform Event. In what order do these execute relative to the originating transaction?

A. The subscriber trigger fires synchronously within the same transaction as the originating DML
B. The subscriber trigger fires asynchronously after the originating transaction commits
C. The subscriber trigger never fires; Apex-to-Apex Platform Event delivery requires a flow intermediary
D. The subscriber trigger fires before the originating transaction commits, allowing rollback coordination

**Answer: B**
**Explanation:** Platform Events published within a transaction are only delivered to subscribers after the publishing transaction successfully commits. This decouples the publisher and subscriber, meaning the subscriber trigger runs asynchronously in a separate transaction. This is by design to avoid cascading rollbacks.

**Why the others are wrong:**
- A: Platform Event delivery is explicitly asynchronous and post-commit; synchronous in-transaction delivery is not supported.
- C: Apex triggers can directly subscribe to Platform Events without a flow intermediary.
- D: Pre-commit delivery would break the decoupling guarantee and is not how Platform Events work.

---

## DOMAIN 4: REST/SOAP/API CALLOUTS, NAMED CREDENTIALS, OAUTH (Questions 25–31)

---

**Question 25**
A developer needs to make an HTTP callout from Apex to an external REST API that requires OAuth 2.0 authentication. The credentials must not be hardcoded or stored in custom settings. What is the recommended approach?

A. Store the access token in a Protected Custom Setting and retrieve it in Apex
B. Use a Named Credential with an OAuth 2.0 authentication protocol configured in Setup
C. Hardcode the token in the Apex class but encrypt it using Crypto.encrypt()
D. Use a Connected App and manually manage token refresh in Apex

**Answer: B**
**Explanation:** Named Credentials abstract authentication details from Apex code, support OAuth 2.0 flows including token refresh, and allow callout URLs to be specified as callout:CredentialName, keeping credentials out of code entirely. They are the Salesforce-recommended mechanism for managing external service authentication.

**Why the others are wrong:**
- A: Custom Settings are readable by Apex code and by users with appropriate access; they are not secure credential stores.
- C: Hardcoding credentials, even encrypted, is a security antipattern and fails code review in any regulated environment.
- D: Manual token management in Apex is error-prone and replicates functionality that Named Credentials provide out of the box.

---

**Question 26**
A developer makes an HTTP callout from a synchronous trigger. Under what condition is this allowed?

A. Only if the org has Streaming API enabled
B. Callouts from synchronous triggers are never allowed
C. Only if the callout is wrapped in a future method annotated with @future(callout=true)
D. Callouts are allowed in triggers if no DML has been performed before the callout in the same transaction

**Answer: C**
**Explanation:** Salesforce prohibits direct callouts from synchronous Apex if there are pending DML operations (uncommitted data). Triggers inherently execute within a DML transaction, so callouts must be deferred to an asynchronous context like @future(callout=true) or Queueable implementing Database.AllowsCallouts.

**Why the others are wrong:**
- A: Streaming API enablement is unrelated to HTTP callout permissions from triggers.
- B: While direct callouts in triggers are blocked, callouts can be made after all DML commits — the practical pattern is offloading to async Apex.
- D: Even if DML hasn't run yet in the trigger, the enclosing DML operation that fired the trigger is uncommitted; the platform blocks callouts.

---

**Question 27**
A developer wants to perform multiple REST API operations (query, create, update) in a single HTTP request to Salesforce. Which API supports this?

A. Bulk API 2.0
B. Metadata API
C. Composite API (Composite Requests)
D. Tooling API

**Answer: C**
**Explanation:** The Salesforce Composite API allows bundling up to 25 subrequests (queries, inserts, updates, deletes) in a single HTTP call, with each subrequest able to reference results from prior subrequests using reference IDs. This reduces round-trip latency and API call consumption.

**Why the others are wrong:**
- A: Bulk API 2.0 is designed for large-volume data operations (async), not mixed multi-operation requests.
- B: Metadata API is for deploying and retrieving org configuration, not record operations.
- D: Tooling API is for development tooling (code coverage, Apex classes, debug), not general record DML.

---

**Question 28**
An external application uses OAuth 2.0 Web Server Flow to authenticate with Salesforce. After the user authorizes the app, the authorization code is exchanged for tokens. Which token type provides long-lived access without requiring user re-authentication?

A. Access token, which never expires
B. Session ID, which lasts for the configured session timeout
C. Refresh token, which can be used to obtain new access tokens
D. Bearer token, which is valid for 24 hours

**Answer: C**
**Explanation:** In OAuth 2.0 Web Server Flow, Salesforce issues a short-lived access token (typically valid for hours) and a long-lived refresh token. The application stores the refresh token and exchanges it for a new access token when the current one expires, enabling long-lived access without prompting the user again.

**Why the others are wrong:**
- A: Access tokens do expire; they are not permanent.
- B: Session IDs are Salesforce's internal session mechanism, not the standard OAuth token model.
- D: "Bearer token" is the token type prefix in HTTP headers, not a specific token duration; access tokens are bearer tokens but are not universally valid for 24 hours.

---

**Question 29**
A developer builds an Apex REST service with @RestResource(urlMapping='/orders/*'). The service needs to handle both GET and POST requests differently. Which implementation is correct?

A. Use a single @HttpGet method that checks RestContext.request.httpMethod to branch logic
B. Annotate two separate static methods with @HttpGet and @HttpPost respectively within the same class
C. Create two separate @RestResource classes with different URL mappings for GET and POST
D. Use an if-statement on the RestContext.request.params to determine the HTTP method

**Answer: B**
**Explanation:** Salesforce Apex REST allows a single @RestResource class to define multiple handler methods, each annotated with the appropriate HTTP method annotation (@HttpGet, @HttpPost, @HttpPut, @HttpPatch, @HttpDelete). The platform routes incoming requests to the correct method based on the HTTP verb.

**Why the others are wrong:**
- A: While RestContext.request.httpMethod is accessible, using a single method for multiple verbs is not the correct pattern; separate annotated methods are the idiomatic approach.
- C: Multiple @RestResource classes with different URLs would serve different endpoints, not the same endpoint for different verbs.
- D: HTTP method is not conveyed via URL parameters; it is conveyed by the HTTP request verb itself.

---

**Question 30**
A developer defines a Named Credential with URL https://api.example.com and sets the Identity Type to "Named Principal." A callout is made as: Http h = new Http(); HttpRequest req = new HttpRequest(); req.setEndpoint('callout:MyNamedCred/v1/orders'); req.setMethod('GET'); What is the effective URL called?

A. callout:MyNamedCred/v1/orders (literal string)
B. https://api.example.com/v1/orders
C. https://api.example.com?endpoint=v1/orders
D. The callout fails because Named Credentials cannot append paths

**Answer: B**
**Explanation:** When the endpoint begins with callout:NamedCredentialName, Salesforce substitutes the Named Credential's base URL at runtime and appends the remainder of the path. The effective URL becomes https://api.example.com/v1/orders, and the authentication headers are injected automatically.

**Why the others are wrong:**
- A: Salesforce resolves the callout: prefix at runtime; it is never sent literally to the external server.
- C: Path segments are appended, not converted to query parameters.
- D: Named Credentials fully support path appending via the callout:Name/path pattern.

---

**Question 31**
A developer is consuming an external SOAP web service from Apex. The WSDL has already been imported. A callout in production throws a CalloutException: "You have uncommitted work pending." What is the most likely cause?

A. The SOAP WSDL was imported incorrectly
B. A DML operation was performed in the same transaction before the callout
C. The external service is unavailable
D. SOAP callouts require a Named Credential; REST callouts do not

**Answer: B**
**Explanation:** Salesforce enforces that callouts (both SOAP and REST) cannot be made after DML operations in the same transaction because the transaction is uncommitted. The developer must restructure code to perform all callouts before any DML, or move the callout to an asynchronous context.

**Why the others are wrong:**
- A: WSDL import issues cause compile-time or configuration errors, not "uncommitted work pending" exceptions.
- C: External service unavailability produces a network-level CalloutException or timeout, not the uncommitted-work message.
- D: Named Credentials are recommended but not required for SOAP callouts; authentication can be handled in the generated stub code.

---

## DOMAIN 5: TESTING (Questions 32–38)

---

**Question 32**
A test class uses @testSetup to create 100 Account records. Three test methods each query and modify these Accounts. What is true about the @testSetup data?

A. Each test method shares the same Account records; changes made by one method are visible to the next
B. Each test method receives a fresh copy of the @testSetup data; changes in one method do not affect other methods
C. @testSetup data is committed to the database permanently after the test class runs
D. @testSetup runs once per test method, creating 100 new Accounts for each

**Answer: B**
**Explanation:** @testSetup creates records once for the entire test class, but each test method runs in its own transaction with a savepoint set at the start. Changes made during a test method are rolled back before the next method runs, giving each method a clean starting state with the original @testSetup data.

**Why the others are wrong:**
- A: Test method isolation is guaranteed; state changes do not bleed between test methods.
- C: All test data is rolled back after the test run; no test records persist to the production database.
- D: @testSetup runs once per test class, not per method; running per method would eliminate its performance advantage.

---

**Question 33**
A test for an Apex class that makes an HTTP callout throws: "Methods defined as TestMethod do not support Web service callouts." What is the correct fix?

A. Add @isTest(SeeAllData=true) to the test class
B. Implement HttpCalloutMock and call Test.setMock(HttpCalloutMock.class, mockInstance) before the callout
C. Use StaticResourceCalloutMock with a static resource containing the expected response
D. Both B and C are valid approaches

**Answer: D**
**Explanation:** Both implementing a custom HttpCalloutMock class (Option B) and using the built-in StaticResourceCalloutMock (Option C) are valid ways to mock HTTP callouts in tests. StaticResourceCalloutMock is convenient for simple responses; a custom implementation is better for dynamic response logic or multiple endpoints.

**Why the others are wrong:**
- A: SeeAllData=true grants access to org data in tests but has no effect on callout restrictions.
- B alone: Correct but incomplete; StaticResourceCalloutMock also satisfies the requirement.
- C alone: Correct but incomplete; custom HttpCalloutMock also satisfies the requirement.

---

**Question 34**
A test method needs to verify that a trigger correctly prevents duplicate Account names. The test inserts an Account, then attempts to insert a second Account with the same name. Which assertion correctly validates the behavior?

A. System.assert(duplicateAccount.Id == null, 'Duplicate should not be inserted');
B. try { insert duplicateAccount; System.assert(false, 'Expected exception not thrown'); } catch (DmlException e) { System.assert(e.getMessage().contains('duplicate'), 'Wrong error'); }
C. System.assertEquals(1, [SELECT COUNT() FROM Account], 'Should only have one Account');
D. Both B and C are valid

**Answer: D**
**Explanation:** Option B explicitly tests that a DmlException is thrown with the expected message — the preferred pattern for testing expected exceptions. Option C queries the record count after the attempted duplicate insert (which should fail), verifying only one Account exists. Both are valid test assertions depending on what behavior is being tested.

**Why the others are wrong:**
- A: The duplicate Account's Id would be null if never inserted, but this assertion doesn't confirm why or that the prevention mechanism fired.
- B alone: Valid but Option C also verifies the outcome at the data level.
- C alone: Valid but does not verify the exception message or type.

---

**Question 35**
A test method calls Test.startTest() and then enqueues a Batch Apex job. The test then calls Test.stopTest(). What happens at Test.stopTest()?

A. Nothing; Batch Apex jobs run asynchronously and cannot be tested synchronously
B. The batch job executes synchronously within the Test.stopTest() call, allowing assertions on its results immediately after
C. Test.stopTest() schedules the batch job to run in the next available async window
D. Test.stopTest() throws an exception if async jobs are pending

**Answer: B**
**Explanation:** Test.stopTest() forces all pending asynchronous operations (Batch Apex, Queueable, future methods) enqueued within the startTest/stopTest block to execute synchronously before returning. This allows test assertions to run immediately after stopTest() with full confidence the async work has completed.

**Why the others are wrong:**
- A: Async work can be tested using the startTest/stopTest pattern; this is the standard approach.
- C: Test.stopTest() executes jobs immediately, not in a scheduled future window.
- D: Pending async jobs are exactly what triggers Test.stopTest()'s execution — it does not throw.

---

**Question 36**
A developer wants to test a class that calls a third-party REST API and returns parsed JSON data. The test must simulate a 500 Internal Server Error response. Which mock approach achieves this?

A. Use StaticResourceCalloutMock with statusCode=500
B. Implement HttpCalloutMock, return an HttpResponse with setStatusCode(500), and register it with Test.setMock()
C. Throw a CalloutException inside the mock's respond() method
D. Both A and B are valid

**Answer: D**
**Explanation:** StaticResourceCalloutMock (Option A) supports setting a custom status code, making it valid for simulating 500 errors with a static response body stored in a Static Resource. A custom HttpCalloutMock (Option B) offers the same capability with full control over the response body constructed in code. Both are valid exam-tested patterns.

**Why the others are wrong:**
- A alone: Valid but Option B is equally valid with more flexibility.
- B alone: Valid but Option A also works for static response bodies.
- C: Throwing a CalloutException simulates a network failure, not an HTTP 500 response from the server.

---

**Question 37**
A developer writes a test for a Platform Event trigger. The test publishes a Platform Event and then verifies a record was created by the subscriber trigger. What must be included to test this pattern?

A. @isTest(SeeAllData=true) to allow event publishing
B. EventBus.publish() followed by Test.getEventBus().deliver() to force synchronous event delivery
C. A Test.startTest()/Test.stopTest() block wrapping the publish call, which forces delivery
D. Platform Events cannot be tested in Apex unit tests

**Answer: C**
**Explanation:** Test.startTest()/Test.stopTest() forces pending Platform Event deliveries to subscriber triggers to execute synchronously, analogous to its behavior with other async mechanisms. After Test.stopTest(), the subscriber trigger has run and its side effects (record creation, updates) can be queried and asserted.

**Why the others are wrong:**
- A: SeeAllData=true affects data visibility, not event delivery mechanics.
- B: Test.getEventBus().deliver() is a valid alternative pattern introduced later, but Test.startTest/stopTest() is the primary exam-tested approach.
- D: Platform Event triggers can and should be tested with Apex unit tests.

---

## DOMAIN 6: LWC — WIRE, EVENTS, JEST (Questions 38–44)

---

**Question 38**
A LWC needs to display a list of Contacts from the server. The list should automatically refresh whenever the component's accountId property changes. Which approach is most appropriate?

A. Use an imperative Apex call in the connectedCallback() and call it again in a property setter for accountId
B. Use the @wire decorator with a reactive property ($accountId) passed as a parameter
C. Use setInterval() to poll the server every 5 seconds for updated data
D. Use a Platform Event subscriber component to push updates

**Answer: B**
**Explanation:** The @wire decorator with a reactive property (prefixed with $) automatically re-invokes the wired Apex method whenever the tracked property changes. This is declarative, efficient, and the recommended LWC pattern for data that depends on component properties.

**Why the others are wrong:**
- A: Imperative calls in connectedCallback() and property setters work but are more verbose and error-prone than the wire service; the reactive $ prefix exists specifically to eliminate this pattern.
- C: Polling wastes server resources and introduces latency; it is an antipattern for reactive data.
- D: Platform Events are for cross-component or cross-system real-time messaging, not standard record queries.

---

**Question 39**
A parent LWC needs to call a method defined on a child LWC. Which mechanism enables this?

A. Fire a custom event from the parent; the child listens with addEventListener
B. Use the @api decorator on the child method and call it via this.template.querySelector()
C. Import the child component's JS module and call its functions directly
D. Use a Lightning Message Channel to invoke child methods

**Answer: B**
**Explanation:** Methods exposed with @api on a child component are part of its public API. A parent component can obtain a reference to the child using this.template.querySelector('c-child-component') and call the @api-decorated method directly on that reference. This is the documented LWC parent-to-child method invocation pattern.

**Why the others are wrong:**
- A: Custom events flow from child to parent (bubbling), not parent to child; this is the reverse communication direction.
- C: LWC modules are not importable as shared JS modules for direct function calls; component encapsulation prevents this.
- D: Lightning Message Channels are for sibling or cross-DOM component communication, not for invoking child methods.

---

**Question 40**
A child LWC fires a custom event: this.dispatchEvent(new CustomEvent('statuschange', { detail: { status: 'approved' }, bubbles: true, composed: true })). Which statement about this event is correct?

A. The event propagates only within the shadow DOM of the child component
B. The event propagates across shadow DOM boundaries and can be caught by ancestor components outside the child's shadow tree
C. bubbles: true alone is sufficient for cross-shadow propagation; composed is not needed
D. Custom events with composed: true bypass all event listeners and go directly to the window

**Answer: B**
**Explanation:** Setting both bubbles: true (event propagates up the DOM tree) and composed: true (event crosses shadow DOM boundaries) allows ancestor components in different shadow trees to listen for the event. Without composed: true, the event stops at the shadow root of the dispatching component.

**Why the others are wrong:**
- A: This describes an event with neither bubbles nor composed set; composed: true specifically enables cross-shadow propagation.
- C: bubbles: true alone allows the event to bubble within the same shadow tree but not across shadow boundaries; composed: true is required for cross-shadow propagation.
- D: composed: true does not bypass listeners; it simply allows the event to cross shadow DOM boundaries normally.

---

**Question 41**
In a Jest test for a LWC, a developer needs to verify that clicking a button fires a custom event with the correct detail payload. Which approach is correct?

A. Render the component with @lwc/jest-resolver, click the button, then check the component's internal state
B. Attach an event listener to the element before clicking, then assert the event's detail in the listener callback
C. Use console.log() inside the component's event handler and capture stdout in the test
D. Import the component's JS controller and call its event handler function directly

**Answer: B**
**Explanation:** In Jest, you attach an event listener to the rendered LWC element using element.addEventListener('eventname', handler). After triggering the button click with a simulated event, the handler callback receives the CustomEvent and its detail can be asserted. This is the standard Jest event testing pattern for LWC.

**Why the others are wrong:**
- A: Internal state assertions verify behavior but do not confirm the event was dispatched with the correct detail; an event listener is needed.
- C: Console output is not a reliable assertion mechanism in Jest; use jest.fn() and expect().
- D: Calling the JS function directly bypasses the DOM event dispatch mechanism and does not test that the event is actually fired.

---

**Question 42**
A LWC uses @wire(getRecord, { recordId: '$recordId', fields: [...] }) to fetch record data. The component renders before the wire service returns data. What is the correct way to handle this?

A. Use a try/catch block around the template expression that reads wire data
B. Check for the data and error properties of the wire result in the template using conditional rendering
C. Set a default value for the wire property in the class declaration
D. Use an imperative call instead to ensure data is available before rendering

**Answer: B**
**Explanation:** The @wire decorator provides an object with data and error properties. On the initial render, both are undefined until the wire service resolves. The template should use conditional directives (if:true or lwc:if) to check for data before rendering it, preventing null reference errors and providing loading state feedback.

**Why the others are wrong:**
- A: Template expressions do not support try/catch; error handling for wire data is done through the error property or conditional rendering.
- C: Wire properties are populated by the framework; setting class-level defaults does not prevent the data property from being undefined on first render.
- D: Imperative calls have their own async handling requirements and lose the automatic reactivity of the wire service.

---

**Question 43**
A developer needs to make an imperative Apex call from a LWC when a user clicks a button, then show a toast notification on success. Which pattern is correct?

A. Call the Apex method directly as a synchronous function in the click handler
B. Import the Apex method, call it in the handler returning a Promise, use .then() for success and .catch() for errors, dispatch a ShowToastEvent in .then()
C. Use @wire with lazy evaluation triggered by the button click
D. Use window.apex.execute() to call Apex from JavaScript

**Answer: B**
**Explanation:** Apex methods imported into LWC are asynchronous and return Promises. The handler calls the imported method, chains .then() for the success path (where ShowToastEvent is dispatched via this.dispatchEvent) and .catch() for error handling. This is the canonical imperative Apex call pattern in LWC.

**Why the others are wrong:**
- A: Apex method imports are Promise-based; calling them synchronously and expecting a return value does not work.
- C: @wire is for declarative data fetching driven by property changes, not user actions like button clicks.
- D: window.apex.execute() is not a valid LWC or Salesforce API; it does not exist.

---

**Question 44**
A Jest test for a LWC imports a child component that makes a wire call to getRecord. The test fails because the wire adapter is not registered. What is the correct fix?

A. Import the real getRecord from @salesforce/apex and let Jest resolve it natively
B. Use @salesforce/wire-service-jest-util or the built-in LWC mock adapters to register and emit wire values in Jest
C. Add @isTest to the LWC Jest spec file
D. Run the Jest test with --seeAllData flag to allow real Salesforce data

**Answer: B**
**Explanation:** Jest does not have access to Salesforce wire adapters at test time. The @salesforce/wire-service-jest-util package (or the built-in mock adapters provided by @wire-service-jest-util) allows test code to register a wire adapter and emit specific data or error values, fully controlling the wire response in isolation.

**Why the others are wrong:**
- A: Real Salesforce adapters like getRecord cannot run in a Jest (Node.js) environment; they require the Salesforce runtime.
- C: @isTest is an Apex annotation and has no meaning in JavaScript Jest tests.
- D: Jest runs in Node.js; there is no --seeAllData flag and no Salesforce connection.

---

## DOMAIN 7: SECURITY (Questions 45–48)

---

**Question 45**
A developer writes: List<Account> accounts = [SELECT Id, Name, AnnualRevenue FROM Account WITH SECURITY_ENFORCED]. A running user does not have FLS read access to AnnualRevenue. What happens?

A. The query executes and returns null for AnnualRevenue for each record
B. The query throws an InvalidFieldFaultException at runtime
C. The field is silently omitted from the results; no exception is thrown
D. The query returns all records but strips AnnualRevenue values for users without access

**Answer: B**
**Explanation:** WITH SECURITY_ENFORCED enforces FLS and CRUD at query time. If the running user lacks read permission on any field in the SELECT clause (or the object itself), the query throws a System.QueryException (specifically, an invalid field exception) rather than silently omitting the data. The developer must handle this exception or use stripInaccessible instead.

**Why the others are wrong:**
- A: Returning null silently is the behavior of stripInaccessible, not WITH SECURITY_ENFORCED.
- C: Silent omission is not the WITH SECURITY_ENFORCED behavior; it always throws on access violations.
- D: Field stripping is the behavior of Security.stripInaccessible(), which is a separate mechanism.

---

**Question 46**
A developer uses Security.stripInaccessible(AccessType.READABLE, accountList) before rendering Accounts in a controller. What does this method return?

A. A filtered list excluding records the user cannot access at the object level
B. A SObject list where inaccessible fields are set to null and a DescribeFieldResult indicating which fields were stripped
C. A SObjectAccessDecision object containing the stripped records and a list of stripped fields
D. A Boolean indicating whether any fields were stripped from any record

**Answer: C**
**Explanation:** Security.stripInaccessible() returns an SObjectAccessDecision object. Calling .getRecords() on this object returns the sObject list with inaccessible fields nulled out. Calling .getRemovedFields() returns a Map<String, Set<String>> of object names to stripped field names, enabling logging or UI feedback about what was hidden.

**Why the others are wrong:**
- A: stripInaccessible operates at the field level, not the record/object level; it does not remove entire records.
- B: The return type is SObjectAccessDecision, not a Tuple or DescribeFieldResult.
- D: The return is a rich object with records and metadata, not a simple Boolean.

---

**Question 47**
A class is declared with public with sharing class OrderService {}. The class queries Orders and the running user's sharing rules grant them access to only 10 of 100 Orders. How many Orders does the query return?

A. 100 — with sharing is only enforced for Visualforce, not Apex classes
B. 10 — with sharing enforces the running user's record-level sharing rules
C. 0 — with sharing blocks all queries unless the user is a System Administrator
D. Depends on whether the query includes WITH SECURITY_ENFORCED

**Answer: B**
**Explanation:** with sharing causes the class to run in the context of the running user's sharing rules, restricting query results to records they are entitled to see. Only 10 of 100 Orders are accessible under the user's sharing settings, so only 10 are returned. This is independent of FLS or WITH SECURITY_ENFORCED.

**Why the others are wrong:**
- A: with sharing is enforced in Apex classes for all contexts, not just Visualforce.
- C: with sharing respects the user's actual sharing access, not a blanket restriction; System Administrators typically see all records but non-admins see their entitled records.
- D: WITH SECURITY_ENFORCED controls FLS; with sharing keyword controls record visibility — they are independent.

---

**Question 48**
A developer has a utility class marked without sharing that is called from a with sharing controller. The utility class queries Accounts. Which records are returned?

A. Records accessible to the running user, because the calling with sharing context propagates inward
B. All Account records regardless of sharing, because without sharing in the utility class overrides the calling context
C. No records, because sharing conflicts between classes cause a null result
D. The behavior is undefined; sharing keywords do not affect nested class calls

**Answer: B**
**Explanation:** In Salesforce, the sharing keyword on the class where the code executes takes precedence. When the utility class is declared without sharing, its queries execute without sharing enforcement — even if called from a with sharing class. The without sharing declaration on the utility class explicitly opts out of sharing rules for that class's code.

**Why the others are wrong:**
- A: Sharing context does not propagate inward from callers; the executed class's own declaration governs behavior.
- C: There is no null result or conflict; the utility class executes cleanly under its own without sharing declaration.
- D: Sharing behavior is well-defined per-class based on the class-level keyword declaration.

---

## DOMAIN 8: DEPLOYMENT (Questions 49–50)

---

**Question 49**
A developer wants to validate a deployment to production without committing the changes, then perform a quick deploy within 10 days. Which conditions must be met for quick deploy to be available?

A. The validation must have passed all test classes in the org with 100% coverage
B. The validation must have run with a test level of RunLocalTests or RunAllTests and achieved at least 75% overall coverage with no failing tests
C. The validation must have used RunSpecifiedTests and the specified tests must cover 100% of the deployed classes
D. Quick deploy is available for all successful validations regardless of test level

**Answer: B**
**Explanation:** Quick Deploy is unlocked by a successful validation that ran tests at the RunLocalTests, RunAllTestsInOrg, or RunSpecifiedTests level and met the 75% code coverage threshold with zero test failures. Validations run with NoTestRun do not qualify for Quick Deploy because they did not verify coverage.

**Why the others are wrong:**
- A: 100% coverage is not required; 75% org-wide coverage is the threshold.
- C: RunSpecifiedTests qualifies for Quick Deploy, but 100% per-class is not the global requirement; 75% overall is.
- D: Validations with NoTestRun do not qualify; a test run that validated coverage is required.

---

**Question 50**
A developer uses RunSpecifiedTests during a deployment to production and specifies TestAccountTrigger. The deployment fails with: "Average test coverage across all Apex classes and triggers is 62%, at least 75% test coverage required." What is the most likely reason?

A. The TestAccountTrigger class itself has less than 75% self-coverage
B. RunSpecifiedTests counts only the coverage generated by the specified tests against all Apex in the org; 62% is the overall org coverage from only those tests
C. The test class name was entered incorrectly in the deployment manifest
D. RunSpecifiedTests requires System Administrator profile to run successfully

**Answer: B**
**Explanation:** RunSpecifiedTests calculates the overall code coverage percentage based only on what the specified tests exercise, measured against all Apex code in the org. If the specified tests cover only a narrow area, they may not generate enough cumulative coverage to meet the 75% org-wide threshold, even if each specified test internally passes.

**Why the others are wrong:**
- A: Individual class coverage thresholds apply per-class (0% for test classes themselves, 75% for non-test classes in aggregate), but the error message references aggregate coverage, not a single class.
- C: An incorrect test class name would cause the deployment to fail with a class-not-found error, not a coverage percentage failure.
- D: RunSpecifiedTests has no profile restriction; any deploying user with deployment permissions can use it.

---

## Answer Key

| Q | A | Q | A | Q | A | Q | A | Q | A |
|---|---|---|---|---|---|---|---|---|---|
| 1 | A | 11 | A | 21 | D | 31 | B | 41 | B |
| 2 | B | 12 | B | 22 | A | 32 | B | 42 | B |
| 3 | B | 13 | B | 23 | C | 33 | D | 43 | B |
| 4 | A | 14 | B | 24 | B | 34 | D | 44 | B |
| 5 | A | 15 | B | 25 | B | 35 | B | 45 | B |
| 6 | D | 16 | B | 26 | C | 36 | D | 46 | C |
| 7 | B | 17 | B | 27 | C | 37 | C | 47 | B |
| 8 | D | 18 | B | 28 | C | 38 | B | 48 | B |
| 9 | B | 19 | B | 29 | B | 39 | B | 49 | B |
| 10 | D | 20 | B | 30 | B | 40 | B | 50 | B |

---

## Domain Coverage Summary

| Domain | Questions | Count |
|---|---|---|
| Async Apex (Batch/Queueable/Future/Scheduled) | 1–10 | 10 |
| SOQL/DML Optimization, Governor Limits, LDV | 11–18 | 8 |
| Platform Events, CDC, Streaming API | 19–24 | 6 |
| REST/SOAP/Composite API, Named Credentials, OAuth | 25–31 | 7 |
| Testing (@TestSetup, HttpCalloutMock, Isolation) | 32–37 | 6 |
| LWC (Wire, Events, Jest) | 38–44 | 7 |
| Security (SECURITY_ENFORCED, stripInaccessible, Sharing) | 45–48 | 4 |
| Deployment (Scratch Orgs, Quick Deploy, RunSpecifiedTests) | 49–50 | 2 |
| **Total** | | **50** |

---

*CRT-450 Platform Developer II — passing score is 65%. Focus extra study time on Async Apex and SOQL/DML, which together represent the largest share of exam questions.*
