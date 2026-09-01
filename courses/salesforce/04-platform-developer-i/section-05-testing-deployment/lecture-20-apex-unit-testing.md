# Lecture 20: Apex Unit Testing

## Learning Objectives
- Understand the @isTest annotation and how to structure test classes and methods
- Use Test.startTest() and Test.stopTest() to reset governor limits and execute async code synchronously
- Apply System.assert(), assertEquals(), and assertNotEquals() to validate test outcomes
- Meet the 75% code coverage requirement required for all Apex deployments to production

## Slides

### Slide 1: Why Test in Apex?
**Visual:** Split-screen diagram — left side shows code failing silently in production with a red alert icon; right side shows a green pipeline with passing tests flowing to a safe deployment
**Content:**
- Salesforce requires **75% code coverage** before any Apex can be deployed to production
- Unit tests validate behavior — not just line execution
- Tests protect against regressions when code changes
- The Apex test framework runs in an isolated context with no access to production data by default
**Speaker Notes:** Unit testing in Apex is not optional — it is enforced by the platform. Before any class or trigger can be deployed, at least 75% of all Apex lines org-wide must be covered by tests. This slide sets the stage for why writing good tests matters beyond mere compliance.

---

### Slide 2: The @isTest Annotation
**Visual:** Side-by-side code blocks — one showing a test class with @isTest, one showing a test method with @isTest
**Content:**
- `@isTest` on a **class** marks the entire class as test-only; it does not count toward the 10 MB Apex code limit
- `@isTest` on a **method** within a test class marks it as a runnable test
- Test methods must be **static** and take **no parameters**
- Test classes cannot be called from non-test Apex
```apex
@isTest
private class AccountServiceTest {
    @isTest
    static void testCreateAccount() {
        // test logic here
    }
}
```
**Speaker Notes:** The @isTest annotation has two roles. On the class, it tells the platform this file is test infrastructure and excludes it from code size limits. On the method, it registers that method as an executable test case that can be run from Setup, the Developer Console, or the CLI.

---

### Slide 3: Test.startTest() and Test.stopTest()
**Visual:**
```
  Test method execution timeline:
  ┌──────────────────────────────────────────────────────────────┐
  │ Test data setup      │  fresh context  │ assertions          │
  │ (uses setup limits)  │                 │ (run after async)   │
  │                      │                 │                     │
  │  [existing limit     │                 │                     │
  │   bucket consumed]   │                 │                     │
  └──────────────────────┴─────────────────┴─────────────────────┘
          ↑                      ↑                    ↑
    Test.startTest()     fresh governor limit    Test.stopTest()
    resets limits        context inside          forces all async
                                                 to run sync
```
**Content:**
- `Test.startTest()` creates a **fresh governor limit context** for the code inside
- `Test.stopTest()` closes that context and **executes all queued async operations** synchronously
- Any future methods, batch jobs, or queueable chains started between start/stop will complete before stopTest returns
- Only one startTest/stopTest pair is allowed per test method
```apex
Test.startTest();
AccountService.processLargeDataset(records);
Test.stopTest();
// assert outcomes here — async jobs have completed
```
**Speaker Notes:** Test.startTest and stopTest serve two purposes: they provide an isolated governor limit bucket so your setup code does not eat into the limits you are testing, and they force asynchronous Apex to run synchronously so you can assert on its results in the same test method.

---

### Slide 4: @testSetup — Shared Test Data
**Visual:** Diagram of a test class with one @testSetup method at the top feeding data into three separate @isTest methods via arrows
**Content:**
- `@testSetup` runs **once per test class**, not once per method — but each method gets a **rollback** to the original state
- Data created in @testSetup is available to all test methods in the class
- Reduces duplicate data-creation code across methods
- Changes made by a test method are **rolled back** before the next method runs
```apex
@testSetup
static void makeData() {
    Account a = new Account(Name = 'Test Corp', AnnualRevenue = 5000000);
    insert a;
}
```
**Speaker Notes:** @testSetup is a performance optimization. Instead of inserting the same records at the start of every test method, you define them once and Salesforce handles the rollback between methods. This keeps your test class DRY and your test runs faster.

---

### Slide 5: Assertions — assert, assertEquals, assertNotEquals
**Visual:** Code snippet showing all three assertion types with callout arrows pointing to their parameters
**Content:**
- `System.assert(condition, message)` — passes if condition is true
- `System.assertEquals(expected, actual, message)` — passes if values are equal
- `System.assertNotEquals(expected, actual, message)` — passes if values differ
- The optional message string appears in the failure report — always include it
- Apex 57.0+ introduces `Assert.isTrue()`, `Assert.areEqual()` etc. as a modern alternative
```apex
System.assertEquals('High', acct.Rating, 'Rating should be High for >1M revenue');
System.assertNotEquals(null, acct.Id, 'Account should have been inserted');
System.assert(tasks.size() > 0, 'Follow-up task should have been created');
```
**Speaker Notes:** Assertions are what turn test methods into real tests. Without assertions, a method can pass even if the code produced the wrong output. Always write your assertions first — this is called test-driven development — and make sure each assertion tests one specific, meaningful outcome.

---

### Slide 6: seeAllData — Isolation by Default
**Visual:** Two containers: "Test Sandbox" with only test-created records vs "Production Org" with live data — a wall separates them with a locked door labeled seeAllData=false
**Content:**
- By default, test methods run with `seeAllData=false` — they **cannot see real org data**
- This ensures tests are deterministic and portable across environments
- Set `@isTest(seeAllData=true)` **only** for tests that genuinely need existing metadata (e.g., custom metadata types, pricebooks)
- Tests must create all data they need — use factories and @testSetup
- Special exception: **Standard Pricebooks** can be accessed via `Test.getStandardPricebookId()`
```apex
@isTest(seeAllData=false) // default — you rarely need to write this explicitly
private class OpportunityTest { ... }
```
**Speaker Notes:** Test isolation is one of the most important principles in Apex testing. When tests depend on real org data, they pass in one sandbox and fail in another. Keeping seeAllData false forces you to own your test data and makes your test suite reliable everywhere.

---

### Slide 7: Code Coverage — What Counts and What Doesn't
**Visual:** Annotated code screenshot with highlighted lines (covered) vs gray lines (not covered) and a coverage percentage meter
**Content:**
- Coverage is measured at the **org level**: total executable lines covered / total executable lines
- The **75% threshold** applies org-wide, not per class (though Salesforce best practice is 90%+ per class)
- Comments, blank lines, and `{` / `}` do **not** count as executable lines
- To find coverage: **Setup > Apex Classes > "Code Coverage" dropdown** or Developer Console
- Trigger files must also be covered — a trigger with no test that fires it has 0% coverage
- `Database.insert()` in test methods triggers all registered triggers
**Speaker Notes:** A common misconception is that every class needs 75% coverage independently. In reality it is an org-wide aggregate. However, if you deploy a change set or package, every class in that set must have sufficient coverage. Aim for full coverage, not the minimum.

---

### Slide 8: Test.isRunningTest() and Test Data Patterns
**Visual:** Flowchart: production code calls external service → isRunningTest check branches → test branch returns mock response → production branch makes real callout
**Content:**
- `Test.isRunningTest()` returns true when code is executing inside a test context
- Use it to bypass callouts, skip scheduled jobs, or inject test behavior — sparingly
- Preferred alternative: **HttpCalloutMock** for callout testing (covered in L21)
- **Test data factories** centralize record creation logic in a reusable class
```apex
if (!Test.isRunningTest()) {
    // fire real integration
}
```
```apex
// TestDataFactory.cls
@isTest
public class TestDataFactory {
    public static Account createAccount(Boolean doInsert) {
        Account a = new Account(Name = 'Factory Account', AnnualRevenue = 1000000);
        if (doInsert) insert a;
        return a;
    }
}
```
**Speaker Notes:** Test.isRunningTest is a useful escape hatch but can mask design problems. If you find yourself adding this check in many places, it often means the code needs to be refactored to use dependency injection or mockable interfaces instead. Use it sparingly and prefer proper mocking patterns.

---

## Recording Script

Welcome to Lecture 20 — Apex Unit Testing.

Testing is one of those topics that developers sometimes treat as a tax — something to write just to hit the 75% coverage threshold. By the end of this lecture, I want you to see it differently. A good test suite is the safety net that lets you refactor confidently, ship frequently, and sleep at night when a deployment goes out.

Let's start with the mechanics. Every test class needs the @isTest annotation at the class level. This tells the platform two things: first, this code should be excluded from your 10 MB Apex storage limit; second, the public/private visibility rules don't apply — you can make the class private and still run it. Your individual test methods also get @isTest, must be static, and must take no parameters.

When you run a test, the platform spins up an isolated execution context. By default — this is the seeAllData=false default — your test cannot see any records in the org. It lives in a clean sandbox. This is a feature, not a limitation. It means your test will produce the same result whether it runs in your developer sandbox, a CI/CD pipeline, or production.

Now let's talk about Test.startTest and Test.stopTest — probably the most important pair of methods in the testing framework. Everything between these two calls gets its own fresh governor limit bucket. So your setup code — inserting records, configuring mocks — doesn't eat into the limits that your actual business logic will consume. Just as importantly, stopTest forces any asynchronous operations to complete. If your code fires a future method or enqueues a batch job between startTest and stopTest, those operations will run to completion before stopTest returns. That means you can assert on their results in the same test method.

Assertions are how you transform test methods from "code that ran" into "code that proved something." System.assertEquals takes an expected value and an actual value. If they don't match, the test fails and prints both values so you can see exactly what went wrong. Always write the expected value first — that's a convention the framework follows and it makes failure messages readable.

For shared data, use @testSetup. Mark a static void method with @testSetup and it will run once before any test method in the class. After each test method runs, Salesforce rolls the data back to the @testSetup state before running the next method. This gives you the best of both worlds — shared creation cost with isolated execution.

Finally, the 75% coverage rule. It applies at the org level across all Apex. Every line you don't cover is a line that could be broken without anyone knowing. The real goal isn't 75% — it's 100% meaningful coverage where every assertion tests real behavior.

---

## Exam Tips
- Governor limits reset at Test.startTest(), NOT at the start of the test method — setup code before startTest shares limits with the current transaction
- The 75% threshold applies **org-wide** for production deployments, but each class in a change set must individually meet thresholds
- @testSetup data is rolled back between each test method but NOT re-run — the same data state is restored
- `seeAllData=false` is the default — you do NOT need to write it explicitly; only write `seeAllData=true` when absolutely necessary
- `Test.isRunningTest()` is a valid answer on the exam for "how do you skip callout logic in tests" but `HttpCalloutMock` is the preferred pattern

## Lecture Summary
Apex unit tests require the @isTest annotation on the class and each test method, and must be static with no parameters. Test.startTest() resets governor limits and Test.stopTest() flushes async operations synchronously, enabling testing of @future and batch code. The @testSetup annotation creates shared test data once per class with automatic rollback between methods, while seeAllData=false enforces data isolation by default. A 75% org-wide code coverage threshold must be met before any Apex deploys to production.

## Mini Quiz
**Q1:** Which method call forces asynchronous Apex to execute synchronously so you can assert on its result?
A) Test.setMock()
B) Test.stopTest()
C) System.assert()
D) Test.isRunningTest()
**Answer:** B — Test.stopTest() flushes the async queue and runs queued future methods, batch jobs, and queueable chains before returning control to the test method.

**Q2:** What is the minimum Apex code coverage percentage required to deploy Apex to a production org?
A) 50%
B) 100%
C) 75%
D) 80%
**Answer:** C — Salesforce enforces 75% code coverage org-wide before any Apex can be deployed to production. The recommended best practice is 90% or higher per class.

**Q3:** A developer wants test data created once and shared across all test methods in a class, with rollback between each method. Which annotation enables this?
A) @isTest(seeAllData=true)
B) @testSetup
C) @AuraEnabled
D) @future
**Answer:** B — @testSetup creates data once before all tests run, and Salesforce automatically restores that data state after each individual test method so later tests start from the same baseline.
