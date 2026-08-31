# Lecture 21: Test Best Practices

## Learning Objectives
- Build a reusable TestDataFactory class that centralizes record creation for all test classes
- Write bulkified tests that validate behavior with 200+ records to mirror trigger context limits
- Mock HTTP callouts using HttpCalloutMock so tests never make real network requests
- Test negative scenarios, exception paths, and boundary conditions systematically

## Slides

### Slide 1: The Test Data Factory Pattern
**Visual:** Architecture diagram — multiple test classes on the left all pointing to a single TestDataFactory class in the center, which builds records and returns them
**Content:**
- A **TestDataFactory** is a dedicated @isTest class with static helper methods that create and optionally insert records
- Centralizes record construction so field changes only require one update
- Methods accept parameters to vary behavior: `createAccount(Boolean doInsert)`
- Factories can be chained: `createOpportunity()` calls `createAccount()` internally
- Keep factory methods focused — one per object type, one per complex scenario
```apex
@isTest
public class TestDataFactory {
    public static Account createAccount(Boolean doInsert) {
        Account a = new Account(
            Name = 'Test Corp',
            AnnualRevenue = 5000000,
            BillingCity = 'Chicago'
        );
        if (doInsert) insert a;
        return a;
    }
}
```
**Speaker Notes:** Without a factory pattern, every test class independently builds its own records. When a required field is added to Account, every test class breaks. With a factory, you fix one method and everything works again. This is the single most impactful structural improvement you can make to a test suite.

---

### Slide 2: Bulk Testing — Always Test at 200 Records
**Visual:** Two bar charts — left shows a test with 1 record passing; right shows the same logic with 200 records triggering a governor limit exception — visual emphasis on the difference
**Content:**
- Triggers fire in batches of up to **200 records** in a single DML operation
- Any query inside a loop at 200 records will hit the **101 SOQL query limit** immediately
- Test with **List<Account> of size 200** to expose bulkification issues before they reach production
- Use loops to build test record lists:
```apex
List<Account> accounts = new List<Account>();
for (Integer i = 0; i < 200; i++) {
    accounts.add(new Account(Name = 'Bulk Test ' + i, AnnualRevenue = 100000 * i));
}
insert accounts;
```
- Assert on all 200 results, not just the first
**Speaker Notes:** The most common Apex bug that slips through testing is a non-bulkified trigger. The developer tests with one record, it works, and it ships. The first time a data import fires it with 200 records, it throws a LimitException. Testing at scale is the only way to catch this.

---

### Slide 3: Testing Negative Scenarios and Exception Paths
**Visual:** Code snippet showing try/catch pattern in a test method with a callout arrow to the catch block labeled "assert exception type and message here"
**Content:**
- Use `try { ... } catch(Exception e) { ... }` blocks to assert that exceptions are thrown when expected
- Always assert **which exception type** was thrown and optionally the message
- Test scenarios: invalid input, missing required fields, records the user shouldn't modify
- The `DmlException` class has `.getMessage()`, `.getNumDml()`, and `.getDmlType()` methods
```apex
@isTest
static void testInvalidRevenue_throwsException() {
    Account a = new Account(Name = 'Bad Corp', AnnualRevenue = -1000);
    try {
        insert a;
        System.assert(false, 'Expected exception was not thrown');
    } catch (DmlException e) {
        System.assert(e.getMessage().contains('AnnualRevenue'),
                      'Exception should mention AnnualRevenue');
    }
}
```
**Speaker Notes:** Writing only happy-path tests is like testing your car's brakes only when the road is dry. Negative tests prove that your validations, error handlers, and guard clauses actually work. The System.assert(false) inside the try block is a pattern that ensures the test fails if the exception is never thrown.

---

### Slide 4: Mocking HTTP Callouts with HttpCalloutMock
**Visual:** Sequence diagram — test method calls business class → business class calls Http.send() → mock intercepts the call → returns fake HttpResponse → business logic processes fake response → test asserts result
**Content:**
- Tests cannot make real HTTP callouts — the platform throws a `CalloutException`
- Implement the `HttpCalloutMock` interface to return a controlled response
- Register the mock with `Test.setMock(HttpCalloutMock.class, new MyMock())`
- Must call `Test.setMock()` **before** `Test.startTest()`
```apex
@isTest
global class MockHttpCallout implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"status":"ok"}');
        return res;
    }
}

// In the test:
Test.setMock(HttpCalloutMock.class, new MockHttpCallout());
Test.startTest();
MyCalloutService.execute();
Test.stopTest();
```
**Speaker Notes:** HttpCalloutMock lets you test your HTTP integration code without actually calling external APIs. You control exactly what response the mock returns, which means you can test success scenarios, 4xx errors, 5xx errors, and malformed JSON responses all within the same test class.

---

### Slide 5: Testing Asynchronous Apex
**Visual:** Timeline showing code flow: test sets up data → startTest() → enqueue job / call @future → stopTest() executes the async code synchronously → assertions run
**Content:**
- **@future methods**: call the method between startTest/stopTest — it runs synchronously at stopTest
- **Queueable**: enqueue between startTest/stopTest — executes synchronously at stopTest
- **Batch Apex**: call `Database.executeBatch()` between startTest/stopTest — execute() runs synchronously
- **Scheduled Apex**: use `System.schedule()` between startTest/stopTest
- After stopTest(), query to verify what the async code changed
```apex
Test.startTest();
System.enqueueJob(new ContactReviewQueueable());
Test.stopTest();
// Queueable has run — assert results now
List<Contact> reviewed = [SELECT Needs_Review__c FROM Contact LIMIT 1];
System.assertEquals(true, reviewed[0].Needs_Review__c);
```
**Speaker Notes:** Without startTest/stopTest, async code is merely queued — it never runs during the test transaction. StopTest is the trigger that drains the queue. This is why all async assertions must come after stopTest, never before.

---

### Slide 6: Avoid seeAllData=true — Isolation Principles
**Visual:** Two environment icons (Dev Sandbox and Full Sandbox) with a venn diagram showing overlapping real data that causes test failures when seeAllData=true
**Content:**
- `seeAllData=true` makes tests **non-portable** — they pass where data exists, fail where it doesn't
- Tests relying on org data break when records are modified, deleted, or never seeded in a new org
- **Legitimate uses of seeAllData=true**: tests requiring the standard Pricebook (use `Test.getStandardPricebookId()` instead)
- **Always prefer**: creating all records in @testSetup or within the test method itself
- Custom metadata types and custom settings with `seeAllData=false` **are** accessible — they are configuration, not transactional data
**Speaker Notes:** seeAllData=true is a flag that says "I can't be bothered to create my own test data." Every time you use it, you create a test that will silently fail in a fresh org, a new sandbox, or after a data cleanup. The only acceptable use case is when the platform truly forces you to — and those cases are increasingly rare.

---

### Slide 7: StaticResourceCalloutMock and MultiStaticResourceCalloutMock
**Visual:** Folder tree showing staticresources/ directory with JSON response files, connected by arrows to test class
**Content:**
- `StaticResourceCalloutMock` returns a static resource file as the HTTP response body
- Useful for large or complex JSON payloads you don't want to hard-code in the mock class
- `MultiStaticResourceCalloutMock` maps multiple endpoints to different static resource responses
```apex
StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
mock.setStaticResource('MockWeatherResponse');
mock.setStatusCode(200);
mock.setHeader('Content-Type', 'application/json');
Test.setMock(HttpCalloutMock.class, mock);
```
- Static resource must be in the same org (deployable alongside the test class)
**Speaker Notes:** For complex integrations with large payloads — think Salesforce-to-SAP or Salesforce-to-ERP — hard-coding the JSON response in a mock class becomes unmanageable. Storing it in a static resource and referencing it by name keeps your mock class clean and makes the payload easy to update.

---

### Slide 8: Test Code Quality — What Good Tests Look Like
**Visual:** Checklist with green checkmarks: One assertion per concept, descriptive method names, no logic in tests, independent methods, fast execution
**Content:**
- **One concept per test**: each method tests one behavior, not a workflow
- **Descriptive names**: `testRatingIsHighWhenRevenueExceedsMillion()` not `test1()`
- **Arrange-Act-Assert (AAA)** pattern: setup → execute → verify in every method
- **No test logic**: avoid if/else in test methods — that hides conditional failures
- **Independent tests**: never depend on execution order or data from another test method
- **Fast tests**: avoid unnecessary DML; use `doInsert=false` in factories when you only need an object reference
**Speaker Notes:** Test code is production code. It lives in your repo, it runs in CI, and its quality directly determines how trustworthy your deployments are. Tests with unclear names and tangled logic are almost as bad as no tests — when they fail, nobody knows what broke or why.

---

## Recording Script

Welcome to Lecture 21 — Test Best Practices.

In the last lecture we covered the mechanics of how Apex tests work. In this lecture we go deeper — we're talking about the difference between a test suite that merely satisfies the coverage requirement and one that genuinely protects your codebase.

The single highest-ROI practice I can share is the Test Data Factory pattern. Create a class called TestDataFactory, annotate it with @isTest so it doesn't count against your code size, and put all your record-building logic there. Every test class uses it. When Account adds a required field, you fix the factory and everything continues to work.

Next: bulk testing. I cannot stress this enough. Triggers fire in batches of up to 200 records. Every DML operation from an import, a mass update, or a data loader batch can send 200 records through your trigger at once. If you only test with one record, you are testing approximately half a percent of the realistic load. Build a list of 200 accounts, insert them all at once, and watch what happens. This is where SOQL queries inside loops show up as LimitExceptions.

Negative testing is another area where developers underinvest. Your code has guard clauses, validations, and error handlers. Do any of those actually work? The only way to know is to test them. The pattern is: try the bad operation, catch the exception, and assert on the exception type and message. Include a System.assert(false) inside the try block before the expected exception line — this ensures your test actually fails if the exception is never thrown.

For HTTP callouts, the platform simply does not allow real network calls from test context. Full stop. You must implement the HttpCalloutMock interface, override the respond() method to return a controlled HttpResponse, and register it with Test.setMock before your test calls the code. This is actually a superpower — you can simulate 500 errors, timeouts, and malformed JSON without any external dependency.

For async testing: everything goes between startTest and stopTest. Future methods, queueable jobs, batch jobs, scheduled jobs — queue them all inside that block, and stopTest will drain the queue synchronously. Your assertions after stopTest can rely on the async work being completely finished.

Finally, treat seeAllData=true as a code smell. If you're reaching for it, ask yourself: why can't I create this data myself? Nine times out of ten, you can, and your test will be more reliable for it.

---

## Exam Tips
- HttpCalloutMock.respond() must be called `respond`, not `execute` or `handle` — this is a common distractor in exam questions
- Test.setMock() must be called **before** Test.startTest() — the order matters
- Batch Apex tests with Database.executeBatch() inside startTest/stopTest only execute the execute() method; finish() also runs but start() behavior differs
- When testing 200-record scenarios, the exam often asks what governor limit is most at risk — the answer is usually SOQL queries (101 query limit)
- seeAllData=false is the DEFAULT — you do not write it; only seeAllData=true needs to be explicitly specified

## Lecture Summary
The TestDataFactory pattern centralizes record creation, making tests maintainable and resilient to schema changes. Bulk testing with 200 records is essential because DML operations batch at that limit and any non-bulkified code will fail silently in single-record tests. HTTP callouts must be mocked using HttpCalloutMock and Test.setMock() because real callouts are prohibited in test context. Asynchronous Apex executes synchronously when called between Test.startTest() and Test.stopTest(), enabling reliable assertions on the results.

## Mini Quiz
**Q1:** A developer needs to test a class that makes an HTTP callout. Which approach allows the test to run without a real network request?
A) Use @isTest(seeAllData=true) to access the cached response
B) Implement HttpCalloutMock and register it with Test.setMock()
C) Call Test.startTest() before the callout to suppress the exception
D) Add a try/catch around the callout code in the production class
**Answer:** B — HttpCalloutMock is the interface provided specifically for mocking callouts in test context. Test.setMock() registers the mock so the platform intercepts Http.send() calls and returns the mock's respond() output instead.

**Q2:** A developer inserts 200 Accounts in a test and the trigger that fires throws a LimitException for too many SOQL queries. What is the most likely cause?
A) The test used seeAllData=true
B) A SOQL query exists inside a for loop in the trigger handler
C) Test.startTest() was not called before the insert
D) The test class exceeded the 10 MB code limit
**Answer:** B — A SOQL query inside a loop fires once per record. At 200 records, that reaches the 101-query limit and throws a LimitException. The fix is to move the query outside the loop and use a Map for lookups.

**Q3:** Which of the following is true about the @testSetup method?
A) It runs before each individual test method
B) It runs once per class and data is rolled back to that state between methods
C) It can call non-test Apex methods directly
D) It is only available when seeAllData=true is set
**Answer:** B — @testSetup executes once for the entire test class. After each test method, Salesforce automatically restores the database to the state it was in after @testSetup ran, so each method starts from the same known state.
