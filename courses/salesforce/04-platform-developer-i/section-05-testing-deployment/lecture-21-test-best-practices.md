# Test Best Practices

## Exam Domain
Testing, Debugging & Deployment — 22% of exam weight

## Core Concepts

### TestDataFactory — Centralize Record Creation
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

    public static List<Contact> createContacts(Id accountId, Integer count, Boolean doInsert) {
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < count; i++) {
            contacts.add(new Contact(LastName = 'Test' + i, AccountId = accountId));
        }
        if (doInsert) insert contacts;
        return contacts;
    }
}
```
Every test class uses the factory. When a required field is added to Account, you fix one method and all test classes continue to pass. Without a factory, a single schema change can break dozens of test classes simultaneously.

### Bulk Testing — Always Test at 200 Records
Triggers fire in batches of up to 200 records per DML. A SOQL query inside a loop at 200 records immediately hits the 101-query limit. Testing with 1 record catches nothing; testing with 200 catches everything.
```apex
@isTest
static void testBulkInsert_200Accounts() {
    List<Account> accounts = new List<Account>();
    for (Integer i = 0; i < 200; i++) {
        accounts.add(new Account(Name = 'Bulk Test ' + i, AnnualRevenue = 100000 * i));
    }

    Test.startTest();
    insert accounts;
    Test.stopTest();

    // Assert on ALL 200 results, not just the first
    List<Task> tasks = [SELECT Id FROM Task WHERE WhatId IN :accounts];
    System.assertEquals(200, tasks.size(), 'One task per account — 200 total');
}
```

### Negative Tests and Exception Paths
Every validation, guard clause, and error handler you write needs a test that proves it works. The `System.assert(false)` inside the try block ensures the test fails if the exception is never thrown.
```apex
@isTest
static void testInvalidRevenue_throwsException() {
    Account a = new Account(Name = 'Bad Corp', AnnualRevenue = -1000);
    try {
        insert a;
        System.assert(false, 'Expected DmlException was not thrown');
    } catch (DmlException e) {
        System.assert(e.getMessage().contains('AnnualRevenue'),
                      'Exception message should reference the failing field');
    }
}
```

### HttpCalloutMock — Required for Any Callout Test
Tests cannot make real HTTP callouts — the platform throws a `CalloutException`. Implement `HttpCalloutMock`, register it with `Test.setMock()` BEFORE `Test.startTest()`, and the framework intercepts every `Http.send()` call.
```apex
@isTest
global class MockHttpCallout implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setBody('{"status":"ok","id":"001000000000001"}');
        res.setHeader('Content-Type', 'application/json');
        return res;
    }
}

// In the test method:
Test.setMock(HttpCalloutMock.class, new MockHttpCallout());
Test.startTest();
MyCalloutService.execute();
Test.stopTest();
// Assert on processed result here
```

### Testing Asynchronous Apex
Everything async goes between `Test.startTest()` and `Test.stopTest()`. At `stopTest()`, the platform runs all queued async jobs synchronously. Assert AFTER stopTest.
```apex
@isTest
static void testQueueable_contactsFlagged() {
    List<Contact> contacts = TestDataFactory.createContacts(null, 10, true);

    Test.startTest();
    System.enqueueJob(new ContactReviewQueueable());
    Test.stopTest();
    // Queueable has FULLY executed — assert results now

    List<Contact> reviewed = [SELECT Needs_Review__c FROM Contact];
    for (Contact c : reviewed) {
        System.assertEquals(true, c.Needs_Review__c, 'Should be flagged');
    }
}
```

### StaticResourceCalloutMock — Large Payloads
For complex integration responses (SAP, ERP, partner APIs), hard-coding JSON in mock class bodies becomes unmanageable. Store the response body in a static resource.
```apex
StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
mock.setStaticResource('MockSAPResponse');
mock.setStatusCode(200);
mock.setHeader('Content-Type', 'application/json');
Test.setMock(HttpCalloutMock.class, mock);
```
`MultiStaticResourceCalloutMock` maps multiple endpoints to different static resources — use this for tests that make callouts to several different services.

### Test Code Quality — Arrange/Act/Assert
Each test method should test one behavior. Method names should be descriptive: `testRatingIsHotWhenRevenueExceeds10Million`, not `test1`. Avoid if/else logic inside test methods — conditional failures hide bugs.

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Tests with zero assertions — they have coverage but no validation; completely useless
- `seeAllData=true` everywhere — tests that depend on org data fail in fresh orgs, new sandboxes, and CI environments
- No bulk testing (always inserting 1 record) — the most common way triggers pass dev testing and fail in production with a data import
- `Test.isRunningTest()` scattered throughout production code — signals the code was designed around tests rather than using proper mocking; architecture smell
- Tests that depend on execution order — Apex test methods can run in any order; each method must be self-contained

**Enterprise-scale considerations:**
- Test suite execution time is a deployment blocker in CI/CD. Test classes with expensive data setup that could use `@testSetup` instead bloat run times. Large orgs with 10+ minute test runs often trace back to redundant DML in every test method.
- `TestDataFactory` is mandatory in any org with more than 2 developers. Without it, a schema change requiring a new required field cascades into broken tests across every class — sometimes 50+ failures from one field addition.
- Coverage gaps cluster in exception handling branches. These are exactly where production bugs hide. Investing in negative test cases pays off in prod stability, not just coverage numbers.
- Test parallelism: add `@isTest(isParallel=true)` to test classes with no shared static state to cut CI build times significantly.

**For CTO conversations:**
- "Our deployments are taking 45 minutes because of test runs." — Audit for tests doing redundant DML (fix with `@testSetup`), tests not using `@isTest(isParallel=true)`, and tests running with `RunAllTestsInOrg` when `RunLocalTests` suffices.
- "Our tests pass locally but fail in CI." — Usually `seeAllData=true` dependencies, hardcoded record IDs from sandbox, or timezone-sensitive date comparisons. Fix: enforce `seeAllData=false` as a code review standard.

## Architecture / How It Works

```
TEST DATA FACTORY PATTERN

  ┌─────────────────────┐     ┌─────────────────────────────┐
  │  AccountTriggerTest  │     │  ContactServiceTest          │
  │  ─────────────────  │     │  ───────────────────────     │
  │  TestDataFactory     │     │  TestDataFactory             │
  │  .createAccount(true)│     │  .createAccount(false)       │
  └──────────┬──────────┘     └───────────────┬─────────────┘
             │                                 │
             ▼                                 ▼
  ┌──────────────────────────────────────────────┐
  │              TestDataFactory                  │
  │  ─────────────────────────────────────────   │
  │  createAccount(Boolean doInsert)              │
  │  createContact(Id accountId, Integer count)   │
  │  createOpportunity(Id accountId)              │
  │                                               │
  │  ONE change here → ALL test classes updated   │
  └──────────────────────────────────────────────┘
```

**Limitations:**
- TestDataFactory must be annotated `@isTest` — it cannot be called from production code
- Factory methods cannot make callouts — use mock patterns for integration setup
- `@testSetup` and TestDataFactory are complementary: factory creates the records, `@testSetup` calls the factory once per class

```
ASYNC TEST EXECUTION TIMELINE

  Test method:
  ┌──────────────────────────────────────────────────────────┐
  │  @testSetup data inserted                                 │
  │                                                          │
  │  Test.startTest()  ←── governor limits RESET here        │
  │  ─────────────────────────────────────────────────────   │
  │  Database.executeBatch(new MyBatch()) ← queued, NOT run   │
  │  System.enqueueJob(new MyQueueable()) ← queued, NOT run   │
  │                                                          │
  │  Test.stopTest()   ←── ALL queued async runs NOW          │
  │  ─────────────────────────────────────────────────────   │
  │  Batch start/execute/finish have COMPLETED                │
  │  Queueable has COMPLETED                                  │
  │                                                          │
  │  ← assert results here (after stopTest)                  │
  └──────────────────────────────────────────────────────────┘
```

**Limitations:**
- Only ONE `startTest/stopTest` pair per test method
- Batch `start()` in test context uses `Database.getQueryLocator` normally, but the execute chunk size may differ
- `@future` methods queued outside `startTest/stopTest` may not run before assertions

```
HTTPCALLOUTMOCK INTERCEPTION FLOW

  Test method                  Platform
  ─────────────                ────────────────────────────────
  Test.setMock(...)     ──►   Mock registered in test context
  Test.startTest()
  MyService.execute()
    → Http.send(req)   ──►   Platform checks: mock registered?
                              └── YES → call mock.respond(req)
                                      → return mock HttpResponse
                              └── NO  → throw CalloutException
  Test.stopTest()
  assert result
```

**Limitations:**
- `Test.setMock()` must be called before `Test.startTest()` — registering after startTest is too late
- One mock instance handles ALL callouts in that test — use `MultiStaticResourceCalloutMock` if different endpoints need different responses
- The mock `respond()` method name is fixed — it cannot be renamed

## Key Facts to Memorize
- `TestDataFactory` must be annotated `@isTest` — excluded from storage limits
- Bulk test at **200 records** — this is the maximum DML batch size
- `System.assert(false)` inside try block — ensures test fails if exception never thrown
- `HttpCalloutMock` interface: implement `respond(HttpRequest req)` — method name is required
- `Test.setMock()` must be called **before** `Test.startTest()`
- Async assertions go **after** `Test.stopTest()` — not before
- `seeAllData=false` is the default — `seeAllData=true` is the exception, not the rule
- `StaticResourceCalloutMock` for large JSON payloads; `MultiStaticResourceCalloutMock` for multiple endpoints

## Customer Advisory Tips
- **Make TestDataFactory non-negotiable:** For any ISV partner or enterprise org with multiple developers, TestDataFactory should be a code review requirement. The ROI of one fix vs. one hundred fixes when a field changes is enormous.
- **Set 90% as the internal bar:** The platform minimum is 75%. Set 90% as your internal standard. The gap between 75% and 90% is almost entirely uncovered error handling — where production bugs live.
- **Bulk tests as a gate:** Include a 200-record test for every trigger handler in every code review. If the pull request doesn't include it, send it back. This single practice prevents the most common production Apex failures.
- **CI/CD test level:** In GitHub Actions pipelines, use `RunLocalTests` for PR validation (fast, catches your changes) and `RunAllTestsInOrg` only for production deployments.

## Exam Traps
- `HttpCalloutMock.respond()` is the required method name — not `execute`, `handle`, or `process`
- `Test.setMock()` must be called **before** `Test.startTest()` — order matters
- Asserting BEFORE `Test.stopTest()` for async code tests stale state — async hasn't run yet
- `seeAllData=false` is the DEFAULT — you never have to write it; only `seeAllData=true` needs to be explicit
- Testing batch: `Database.executeBatch()` inside `startTest/stopTest` runs all three methods (start, execute, finish) synchronously

## Practice Questions

**Q:** A developer needs to test a class that makes an HTTP callout. Which approach makes the test run without a real network request?
**A:** Implement `HttpCalloutMock` and register it with `Test.setMock(HttpCalloutMock.class, new MyMock())` before `Test.startTest()`. The platform intercepts `Http.send()` calls and returns the mock response instead.

**Q:** A test inserts 200 Accounts and the trigger throws a LimitException for too many SOQL queries. What is the most likely cause?
**A:** A SOQL query inside a for loop in the trigger handler. At 200 records, it fires 200 SOQL queries and hits the 101-query limit. Fix: move the query outside the loop, put results in a Map, look up in the loop.

**Q:** Which of the following is true about the `@testSetup` method?
**A:** It runs once per class, and data is rolled back to that state between methods. Each test method sees the original @testSetup data — changes from one method do not bleed into the next.

**Q:** A callout test registers the mock after `Test.startTest()`. What happens?
**A:** The callout throws a `CalloutException` — `Test.setMock()` must be registered before `Test.startTest()`. The mock is only active for the test context in which it's registered.
