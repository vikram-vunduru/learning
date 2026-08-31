# Lecture 24: Security in Apex

## Learning Objectives
- Differentiate with sharing, without sharing, and inherited sharing keywords and when to use each
- Implement CRUD and FLS checks using Schema.DescribeSObjectResult and DescribeFieldResult
- Use stripInaccessible() and WITH SECURITY_ENFORCED to enforce field-level security in SOQL
- Prevent SOQL injection attacks using bind variables and String.escapeSingleQuotes()

## Slides

### Slide 1: Apex Security Context — The Default Behavior
**Visual:** Layered diagram showing: System Administrator at top → Apex Code Layer (runs as system by default) → Database, with a warning icon showing "sharing rules bypassed"
**Content:**
- By default, Apex runs in **system context**: it bypasses sharing rules (OWD, sharing rules, manual shares)
- This means all records are accessible regardless of the running user's sharing access
- Apex does **not** automatically enforce CRUD or FLS — you must explicitly check
- Without intentional security enforcement, Apex can expose or modify records the user cannot see in the UI
- Three keywords control sharing behavior: `with sharing`, `without sharing`, `inherited sharing`
**Speaker Notes:** This is arguably the most important security concept in Apex development. Unlike the UI, which automatically respects sharing rules and field permissions, Apex runs as system unless you tell it otherwise. Every developer must make a deliberate choice about sharing and field-level security in every class they write.

---

### Slide 2: with sharing, without sharing, inherited sharing
**Visual:** Three class declaration code blocks side-by-side with arrows showing: with sharing → respects running user's record visibility; without sharing → sees all records; inherited sharing → adopts caller's context
**Content:**
- `with sharing`: enforces **sharing rules** for the running user — SOQL returns only records the user can see
```apex
public with sharing class AccountService {
    public List<Account> getMyAccounts() {
        return [SELECT Id, Name FROM Account]; // only records user can access
    }
}
```
- `without sharing`: **bypasses sharing** — returns all records regardless of visibility
- `inherited sharing`: uses the **calling context's** sharing mode
  - If called from `with sharing` code → enforces sharing
  - If called directly from anonymous Apex or a REST endpoint → uses system context
- Omitting the keyword defaults to **system context** (no sharing enforcement) — this is a security risk
**Speaker Notes:** The inherited sharing keyword solves an important problem: utility classes and service layers that should respect whatever context they're called from. Instead of hardcoding with or without sharing into a reusable class, inherited sharing delegates that decision to whoever is calling it. Always declare a sharing keyword — never rely on the default.

---

### Slide 3: CRUD Checks — Object-Level Security
**Visual:** Code flowchart: user requests data → Apex checks isAccessible() → if false, throw NoAccessException → if true, proceed with SOQL
**Content:**
- CRUD = Create, Read, Update, Delete — object-level permissions
- Check **before** DML or SOQL using `Schema.SObjectType` describe results:
```apex
// Check before querying
if (!Schema.SObjectType.Account.isAccessible()) {
    throw new SecurityException('No access to Account');
}

// Check before insert
if (!Schema.SObjectType.Contact.isCreateable()) {
    throw new SecurityException('Cannot create Contact');
}

// Check before update
if (!Schema.SObjectType.Account.isUpdateable()) {
    throw new SecurityException('Cannot update Account');
}

// Check before delete
if (!Schema.SObjectType.Account.isDeletable()) {
    throw new SecurityException('Cannot delete Account');
}
```
**Speaker Notes:** CRUD checks tell you whether the running user has permission to perform an operation on a given object. If your Apex skips these checks and the user lacks access, the DML will succeed but from a security standpoint you've bypassed the user's intended permissions. Always check before you act.

---

### Slide 4: FLS Checks — Field-Level Security
**Visual:** Code snippet showing DescribeFieldResult.isAccessible() being called before using a field value, with a call-out showing how to get the field describe from Schema
**Content:**
- FLS = Field-Level Security — controls read/write access to individual fields
- Get field describe result then check:
```apex
Schema.DescribeFieldResult dfr =
    Schema.SObjectType.Account.fields.AnnualRevenue;

// Can the user read this field?
if (!dfr.isAccessible()) {
    throw new SecurityException('No read access to AnnualRevenue');
}

// Can the user write this field?
if (!dfr.isUpdateable()) {
    throw new SecurityException('No write access to AnnualRevenue');
}
```
- Methods: `.isAccessible()`, `.isUpdateable()`, `.isCreateable()`
- FLS checks are separate from CRUD — a user may have read access to an object but not a specific field
**Speaker Notes:** Field-level security is often forgotten because the UI handles it automatically — restricted fields simply don't appear. But in Apex, every field in a SOQL query is returned regardless of FLS unless you explicitly check or use stripInaccessible. An attacker who can trigger your Apex via an API could potentially read field values they're not supposed to see.

---

### Slide 5: stripInaccessible() — Automatic FLS Enforcement
**Visual:** Diagram showing an SObject list entering stripInaccessible() → field values the user can't access are stripped → clean result returned
**Content:**
- `Security.stripInaccessible(AccessType, records)` removes inaccessible fields from records
- More concise than manual FLS checks — operates on entire record sets at once
- `AccessType` enum values: `READABLE`, `CREATABLE`, `UPDATABLE`
```apex
List<Account> accounts = [SELECT Id, Name, AnnualRevenue, SSN__c FROM Account];
SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE,
    accounts
);
List<Account> safeAccounts = decision.getRecords();
// safeAccounts only contains field values the running user can read
```
- Available since API 40.0 (Summer '17)
- Does NOT throw an exception — silently strips inaccessible fields
**Speaker Notes:** stripInaccessible is the most elegant solution for enforcing FLS on query results. Instead of writing dozens of individual field checks, you pass the entire result set through stripInaccessible with READABLE, and every field the user can't see is removed. The remaining records are safe to return to the client.

---

### Slide 6: WITH SECURITY_ENFORCED in SOQL
**Visual:** SOQL statement with WITH SECURITY_ENFORCED highlighted, and a branch showing it throws InvalidFieldFaultException if FLS check fails
**Content:**
- `WITH SECURITY_ENFORCED` added to SOQL automatically enforces CRUD and FLS at query time
- If the running user lacks access to any field or object in the query, Salesforce throws `System.QueryException`
- Simple to add; no extra code needed:
```apex
List<Account> accounts = [
    SELECT Id, Name, AnnualRevenue
    FROM Account
    WITH SECURITY_ENFORCED
];
```
- Limitation: does **not** work with aggregate queries (`GROUP BY`, `HAVING`, `COUNT()`)
- Limitation: does **not** check access on relationship fields accessed via dot notation for sub-selects
- For full control, prefer `stripInaccessible()` — it handles more cases gracefully
**Speaker Notes:** WITH SECURITY_ENFORCED is the simplest way to add security to a SOQL query. The tradeoff is that it throws an exception — which you then need to catch — rather than silently stripping fields. For simple queries with predictable field access, it's clean and readable. For complex queries or when you need the records regardless of some fields being inaccessible, stripInaccessible is more appropriate.

---

### Slide 7: SOQL Injection — Prevention with Bind Variables
**Visual:** Split diagram — left shows vulnerable code with string concatenation building a dynamic SOQL query with malicious input; right shows safe code using bind variables
**Content:**
- SOQL injection occurs when user input is concatenated directly into a dynamic SOQL string
- Malicious input like `' OR Name != '` can manipulate query logic
- **Vulnerable pattern** (never do this):
```apex
String userInput = ApexPages.currentPage().getParameters().get('name');
String query = 'SELECT Id FROM Account WHERE Name = \'' + userInput + '\'';
List<Account> results = Database.query(query); // VULNERABLE
```
- **Safe — Bind Variables** (preferred):
```apex
String userInput = ApexPages.currentPage().getParameters().get('name');
List<Account> results = [SELECT Id FROM Account WHERE Name = :userInput]; // SAFE
```
- **Safe — String.escapeSingleQuotes()** (only when bind variables cannot be used):
```apex
String safeInput = String.escapeSingleQuotes(userInput);
String query = 'SELECT Id FROM Account WHERE Name = \'' + safeInput + '\'';
```
**Speaker Notes:** SOQL injection is the Apex equivalent of SQL injection in traditional databases. If user-controlled input is directly concatenated into a dynamic query string, an attacker can alter the query's WHERE clause to bypass filters or access records they shouldn't. Bind variables are the complete solution — the user input is never interpreted as SOQL syntax, only as a literal value.

---

### Slide 8: Security Best Practices Summary
**Visual:** Icon grid showing 6 best practices: lock icon (use with sharing), shield (check CRUD/FLS), filter icon (stripInaccessible), key (bind variables), no-bypass sign (never without sharing in UI controllers), test tube (test security in unit tests)
**Content:**
- Always declare a sharing keyword — never rely on implicit system context
- **Controllers and @AuraEnabled methods** should use `with sharing` by default
- Use `without sharing` only with deliberate justification (e.g., administrative background processing)
- `inherited sharing` for service/utility classes called from multiple contexts
- Always check CRUD before DML; use stripInaccessible or WITH SECURITY_ENFORCED for FLS
- Always use bind variables or escapeSingleQuotes for dynamic SOQL
- Include security scenarios in unit tests: assert that unauthorized users cannot access protected records
**Speaker Notes:** Security is not a feature you add at the end — it's a discipline you apply throughout development. Every class you write should have a deliberate sharing keyword. Every dynamic SOQL should use bind variables. Every method that returns sensitive data should run through stripInaccessible. The PDI exam tests all of these concepts, and real security incidents in Salesforce orgs almost always trace back to one of these omissions.

---

## Recording Script

Welcome to Lecture 24 — Security in Apex.

This lecture covers one of the most important and most frequently misunderstood aspects of Apex development: security. The platform's UI automatically enforces sharing rules, field-level security, and object permissions. Apex does not. When you write an Apex class, you become responsible for applying those security controls yourself.

Let's start with sharing. By default, Apex runs in system context — it sees all records regardless of the running user's sharing access. This is by design: many operations like trigger logic and scheduled jobs need to process records regardless of who owns them. But it means that Apex code in a user-facing context — a controller, an @AuraEnabled method, a trigger — can return records the user was never supposed to see unless you explicitly enforce sharing.

The `with sharing` keyword on a class declaration tells Salesforce to apply the running user's sharing access when executing SOQL queries and DML operations. `without sharing` explicitly bypasses it. `inherited sharing` delegates the decision to the calling context — this is ideal for service classes and utility methods that are called from multiple places.

The rule is simple: always declare a sharing keyword. Never write a class and leave it to the default. If you consciously decide it needs without sharing, fine — document why. But make it a deliberate choice.

Next: CRUD and FLS. Just because a user has sharing access to a record doesn't mean they have permission to read every field on it. Schema.SObjectType gives you describe methods — isAccessible, isCreateable, isUpdateable, isDeletable — to check object-level permissions before any DML. For individual fields, DescribeFieldResult.isAccessible() checks whether the running user can read that field.

stripInaccessible is the most practical FLS enforcement tool. Pass your query results through Security.stripInaccessible with AccessType.READABLE, and any fields the user can't read are silently removed from the records. WITH SECURITY_ENFORCED in your SOQL statement does a similar job but throws an exception if any field is inaccessible.

Finally, SOQL injection. If you ever build a dynamic SOQL string by concatenating user input directly — never do this. An attacker can inject SOQL operators into that input and alter your query's behavior. The solution is bind variables: use a colon before the variable name in your SOQL, and Salesforce treats the variable's value as a literal string, never as SOQL syntax. If you must use Database.query with string concatenation for some reason, run the input through String.escapeSingleQuotes first.

Security bugs in Salesforce are real, they happen, and they almost always trace back to one of these four things: missing sharing keyword, missing CRUD/FLS check, or SOQL injection. Master these patterns and you'll avoid the most serious security vulnerabilities in Apex development.

---

## Exam Tips
- Omitting the sharing keyword does NOT default to `with sharing` — it defaults to system context (no sharing enforcement), which is effectively `without sharing`
- `with sharing` enforces **sharing rules** (OWD + sharing rules + manual shares) but does NOT enforce CRUD or FLS — these are separate checks
- `WITH SECURITY_ENFORCED` throws an exception; `stripInaccessible()` silently strips fields — know when to use each
- Bind variables (`:variableName` in SOQL) are the preferred SOQL injection prevention — `String.escapeSingleQuotes()` is the fallback for dynamic queries
- `inherited sharing` defaults to **without sharing** when called from a context that has no sharing declaration (e.g., anonymous Apex, Batch Apex start/finish)

## Lecture Summary
Apex runs in system context by default, bypassing sharing rules unless `with sharing` is explicitly declared; `inherited sharing` delegates the sharing mode to the calling context. CRUD checks using Schema.SObjectType describe methods must be performed before any DML to verify object-level permissions, while FLS is enforced via DescribeFieldResult.isAccessible(), stripInaccessible(), or WITH SECURITY_ENFORCED in SOQL. SOQL injection is prevented by using bind variables (`:variable` syntax) for any dynamic query incorporating user input, with String.escapeSingleQuotes() as a fallback for truly dynamic string construction. Security controls must be explicitly coded — the Apex runtime does not apply them automatically.

## Mini Quiz
**Q1:** A developer writes a class with no sharing keyword. What sharing behavior will it have by default?
A) with sharing — enforces the running user's record visibility
B) inherited sharing — uses the calling context's sharing mode
C) System context — bypasses all sharing rules
D) The deployment fails — sharing keyword is required
**Answer:** C — Omitting the sharing keyword means the class runs in system context, which bypasses all sharing rules. This is the same as without sharing, and it is a potential security risk in user-facing code.

**Q2:** A developer needs to ensure that fields the running user cannot read are removed from SOQL results before returning them to an LWC. Which approach is most appropriate?
A) Add WITH SECURITY_ENFORCED to the SOQL query
B) Call Security.stripInaccessible(AccessType.READABLE, records) on the result
C) Check Schema.SObjectType.Account.isAccessible() before the query
D) Use @isTest(seeAllData=false) in the calling test
**Answer:** B — stripInaccessible with AccessType.READABLE removes all field values the running user cannot read, and it handles the entire record set in one call without throwing exceptions for inaccessible fields.

**Q3:** Which of the following SOQL patterns prevents SOQL injection?
A) `Database.query('SELECT Id FROM Account WHERE Name = \'' + userInput + '\'')`
B) `[SELECT Id FROM Account WHERE Name = :userInput]`
C) `Database.query('SELECT Id FROM Account WHERE Name = ' + String.valueOf(userInput))`
D) `[SELECT Id FROM Account WHERE Name = \'' + userInput + '\'']`
**Answer:** B — Bind variables (`:userInput`) pass the value as a literal parameter to the query engine, preventing user input from ever being interpreted as SOQL syntax. This is the definitive defense against SOQL injection.
