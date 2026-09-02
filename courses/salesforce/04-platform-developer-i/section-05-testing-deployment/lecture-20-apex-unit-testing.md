# Apex Unit Testing

## Exam Domain
Testing, Debugging & Deployment — 22% of exam weight

## Core Concepts

### The @isTest Annotation
```apex
@isTest
private class AccountServiceTest {

    @testSetup
    static void makeData() {
        Account a = new Account(Name = 'Test Corp', AnnualRevenue = 5000000);
        insert a;
        // Data available to all test methods; rolled back between methods
    }

    @isTest
    static void testCreateAccount() {
        // test logic here
    }
}
```
- `@isTest` on class: excludes from 10 MB Apex storage limit; can't be called from non-test code
- `@isTest` on method: marks it as a runnable test case
- Test methods must be **static** and take **no parameters**

### Test.startTest() and Test.stopTest()
```apex
@isTest
static void testBatchJob() {
    // setup data (consumes governor limits from setup budget)
    List<Account> testAccounts = /* ... */;
    insert testAccounts;

    Test.startTest();
    // Fresh governor limits from here
    Database.executeBatch(new AccountReviewBatch());
    Test.stopTest();
    // stopTest FLUSHES async jobs — they run synchronously before continuing

    // Assert here — batch has fully completed
    Integer count = [SELECT COUNT() FROM Account WHERE Status__c = 'Reviewed'];
    System.assertEquals(200, count, 'All accounts should be reviewed');
}
```
- `startTest()` resets governor limits; `stopTest()` executes all queued async jobs synchronously
- Only **one** startTest/stopTest pair allowed per test method
- **Assert AFTER stopTest** for async Apex results

### @testSetup — Shared Test Data
```apex
@testSetup
static void makeData() {
    // Runs ONCE for the class; each test method gets a clean copy (rolled back after each)
    Account a = new Account(Name = 'Test Corp');
    insert a;
    Contact c = new Contact(LastName = 'Smith', AccountId = a.Id);
    insert c;
}
```
Each test method sees the @testSetup data. Changes made during a test are rolled back before the next test runs.

### Assertions
```apex
// Classic assertions
System.assertEquals('High', acct.Rating, 'Rating should be High for >1M revenue');
System.assertNotEquals(null, acct.Id, 'Account should have been inserted');
System.assert(tasks.size() > 0, 'Follow-up task should have been created');

// Modern assertions (API v57+)
Assert.isTrue(tasks.size() > 0, 'Task should exist');
Assert.areEqual('High', acct.Rating);
Assert.isNotNull(acct.Id, 'Id should be set after insert');
```
**Always include the message parameter** — appears in failure output so you know what broke.

### seeAllData — Isolation by Default
```apex
@isTest  // seeAllData=false is the default — no need to write it
private class MyTest { ... }

// Use seeAllData=true only when you need real org data (e.g., Standard Pricebook)
@isTest(seeAllData=true)
private class PricebookTest { ... }
```
- Default `seeAllData=false` — tests cannot see real org data; all test data must be created
- Tests must be deterministic — same result regardless of what's in the org
- Exception: `Test.getStandardPricebookId()` works without seeAllData=true

### Code Coverage — 75% Org-Wide Threshold
- **75% of all Apex lines** must be covered org-wide before production deployment
- Comments, blank lines, and braces do NOT count
- Triggers need coverage too — tests must insert/update records to fire them
- Best practice: aim for 90%+ per class; 75% is the floor, not the target
- Find gaps: Setup → Apex Classes → Run All Tests → see coverage column

### Test.isRunningTest() and TestDataFactory
```apex
// In production Apex — skip real callout in test context
if (!Test.isRunningTest()) {
    Http http = new Http();
    http.send(req);
}

// TestDataFactory — centralize test data creation
@isTest
public class TestDataFactory {
    public static Account createAccount(Boolean doInsert) {
        Account a = new Account(Name = 'Factory Account', AnnualRevenue = 1000000);
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

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Tests with zero assertions — only have coverage, zero validation; useless
- Tests that depend on org data (`seeAllData=true`) or hardcoded IDs — will fail in other environments
- Not testing bulk (200 records) — triggers pass in dev with 1 record, fail in production with 200
- Missing `Test.startTest()/stopTest()` for async code — async jobs run at unpredictable times, assertions may check stale state
- `Test.isRunningTest()` scattered throughout production code — indicates architecture problem; use proper mocking instead

**Enterprise-scale considerations:**
- Test suite execution time matters in CI/CD. Long test runs (>10 min) slow down deployments. Identify and optimize slow tests. `@testSetup` data sharing helps.
- `TestDataFactory` is not optional in enterprise orgs — it's mandatory. Shared factory means one change in data structure is fixed in one place.
- Coverage gaps often cluster in error handling paths and edge cases. These are the exact places where production bugs occur. Invest in negative test cases.

**For CTO conversations:**
- "Our deployments take forever because of test run times." — Fix: run only `RunLocalTests` (not all tests) for component deployments. Add test parallelism via `@isTest(isParallel=true)` on safe test classes.

## Architecture / How It Works

```
TEST EXECUTION FLOW

  test class loaded
         │
         ▼
  @testSetup runs ONCE
  (data inserted, available to all methods)
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
  testMethod1()                             testMethod2()
  ─────────────                             ─────────────
  sees @testSetup data                      sees @testSetup data
  makes changes                             sees ORIGINAL @testSetup data
  (rolled back after)                       (prev method changes rolled back)
  asserts                                   asserts
```

**Limitations:**
- `@testSetup` runs once per class; rollback between methods — not re-runs of setup
- Data created in `@testSetup` is only accessible via SOQL queries in test methods — in-memory references are reset
- `@testSetup` cannot make callouts

```
GOVERNOR LIMIT RESET WITH startTest/stopTest

  Test method execution:
  ┌────────────────────────────────────────────────────────────┐
  │  [Before startTest]                                        │
  │  Setup code runs — consumes limits from "setup pool"       │
  │  insert 200 accounts (DML, SOQL)                           │
  │                                                            │
  │  Test.startTest();  ← FRESH governor limits from here      │
  │  ─────────────────────────────────────────────────────     │
  │  Your business logic runs with full fresh limits           │
  │  SOQL count resets to 0                                    │
  │  DML count resets to 0                                     │
  │  CPU time resets                                           │
  │                                                            │
  │  Test.stopTest();   ← Async queue flushes synchronously    │
  │  ─────────────────────────────────────────────────────     │
  │  [After stopTest]                                          │
  │  All @future, Batch, Queueable have completed              │
  │  Assert results here                                       │
  └────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Only ONE startTest/stopTest pair per test method
- Governor limits before startTest come from the test's own budget (not the same pool as post-startTest)
- `stopTest()` runs async synchronously — exceptions thrown in async code propagate back to the test

## Key Facts to Memorize
- `@isTest` on class: excluded from storage limit; can't be called from non-test code
- `@isTest` on method: static, no parameters
- `Test.startTest()` resets governor limits; `Test.stopTest()` flushes async synchronously
- Assert **AFTER** `Test.stopTest()` for async results
- `@testSetup` runs once; changes rolled back between methods
- `seeAllData=false` is the default — tests cannot see real org data
- **75% org-wide coverage** required for production deployment
- `Test.getStandardPricebookId()` works without seeAllData=true

## Customer Advisory Tips
- **Coverage target:** Set internal standard at 90%. 75% is required but insufficient for confidence. All error handling branches should have negative test cases.
- **TestDataFactory:** Non-negotiable for orgs with 5+ developers. Centralized data creation prevents test brittleness.
- **CI/CD integration:** Use `sf apex run test --test-level RunLocalTests --wait 10` in pipeline. Fail the build if coverage drops below 80%.

## Exam Traps
- Governor limits reset at **Test.startTest()**, NOT at the start of the test method
- Assert after `Test.stopTest()` — before stopTest, async jobs haven't run yet
- Only ONE `startTest/stopTest` pair per test method
- `seeAllData=false` is the **default** — don't need to write it; write `seeAllData=true` only when needed
- 75% threshold is **org-wide** — one class at 20% is fine if org average is above 75%

## Practice Questions

**Q:** A test method calls `Test.stopTest()` after executing a batch job. Where should assertions go?
**A:** AFTER `Test.stopTest()` — stopTest forces the batch to run synchronously, so results are available immediately after. Assertions before stopTest would test before the batch has executed.

**Q:** Two test methods use the same Account record. The first method updates the Account's Rating field. Does the second method see the updated Rating?
**A:** No — changes made in one test method are rolled back before the next test method runs. Each method sees the original @testSetup state.

**Q:** What is the minimum code coverage percentage needed to deploy Apex to production?
**A:** 75% org-wide. This is the platform minimum — best practice is 90%+ per class. Individual classes can be below 75% as long as the org-wide average meets the threshold.
