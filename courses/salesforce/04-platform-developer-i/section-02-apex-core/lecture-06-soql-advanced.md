# Lecture 06: SOQL Advanced

## Learning Objectives
- Write relationship queries using child-to-parent dot notation and parent-to-child subqueries
- Use aggregate functions (COUNT, SUM, AVG, MIN, MAX) with GROUP BY and HAVING clauses
- Apply WITH SECURITY_ENFORCED and WITH USER_MODE for sharing and FLS enforcement
- Write Dynamic SOQL using Database.query() safely with String.escapeSingleQuotes()

## Slides

### Slide 1: Relationship Queries — Child-to-Parent
**Visual:** Entity diagram showing Contact linked to Account with a foreign key (AccountId), and below it a SOQL query traversing from Contact to Account using dot notation, with arrows showing how `Contact.Account.Name` traverses the relationship.
**Content:**
- Access parent record fields using dot notation: `ParentRelationshipName.Field`
- Standard relationship names for lookups: object name without "__c" (e.g., `Account`, `Owner`)
- Custom lookup fields: use the relationship name with `__r` suffix instead of `__c`
  - `My_Account__c` field → `My_Account__r.Name` for parent traversal
- Can traverse up to **5 levels** of parent relationships
```soql
SELECT Id, Name, Account.Name, Account.Owner.Name
FROM Contact
WHERE Account.Industry = 'Technology'
```
**Speaker Notes:** The dot notation traversal is how you get fields from parent records in SOQL without a JOIN. The key is knowing the relationship name — for standard objects it is typically the object name, but for custom lookup fields you replace `__c` with `__r`. You can traverse up to 5 levels deep, but anything beyond 2-3 levels becomes complex to maintain.

### Slide 2: Relationship Queries — Parent-to-Child (Subquery)
**Visual:** Diagram showing an Account record in the center with a list of related Contact records below it, and the corresponding SOQL showing the subquery in parentheses with the relationship name (Contacts) in the SELECT clause.
**Content:**
- Query related child records using a **subquery** in the SELECT clause
- Uses the **relationship plural name** (e.g., `Contacts`, `Opportunities`)
- Custom child relationships use plural `__r` name defined on the child object
- Results in parent record with a nested `List<sObject>`:
```soql
SELECT Id, Name,
    (SELECT Id, FirstName, LastName, Email FROM Contacts WHERE IsActive__c = true)
FROM Account
WHERE Industry = 'Technology'
```
- In Apex, access child records: `for (Contact c : account.Contacts)`
- Can have multiple subqueries in one parent query
**Speaker Notes:** Parent-to-child subqueries are extremely powerful — you can fetch an Account and all its related Contacts and Opportunities in a single SOQL query. The child relationship name is the plural form of the child object's relationship name. For standard objects, Contacts, Opportunities, Cases, and so on. For custom objects, you define the relationship name on the lookup field and then use its plural form with `__r`.

### Slide 3: Aggregate Functions
**Visual:** Reference table listing each aggregate function (COUNT, COUNT_DISTINCT, SUM, AVG, MIN, MAX) with a description and a SOQL example query. Below, a note showing that aggregate results come back as AggregateResult objects, not standard sObjects.
**Content:**
- **COUNT():** Total rows matching the query
- **COUNT_DISTINCT(field):** Count of unique values
- **SUM(field):** Total of numeric field values
- **AVG(field):** Average value
- **MIN(field) / MAX(field):** Minimum/maximum value
- Results returned as `List<AggregateResult>` — access with `.get('alias')`
```apex
List<AggregateResult> results = [
    SELECT StageName, COUNT(Id) cnt, SUM(Amount) totalAmt
    FROM Opportunity
    WHERE CloseDate = THIS_YEAR
    GROUP BY StageName
];
for (AggregateResult ar : results) {
    System.debug(ar.get('StageName') + ': ' + ar.get('cnt'));
}
```
**Speaker Notes:** Aggregate queries return `AggregateResult` objects, not regular sObjects. You access fields using `.get('fieldName')` or `.get('alias')`. Always alias computed fields using a name — `COUNT(Id) cnt` — because accessing via the auto-generated alias can be inconsistent across API versions. Aggregate queries still count against your 100-query governor limit but do NOT count against the 50,000 row limit.

### Slide 4: GROUP BY and HAVING
**Visual:** Diagram showing raw Opportunity records grouped by StageName, with the resulting summary rows in a table, and then a HAVING clause filter removing groups with total amount below 100,000.
**Content:**
- **GROUP BY:** Groups results by field values — like a pivot table
- Must include grouped fields in SELECT
- Non-aggregate fields in SELECT must be in GROUP BY
- **HAVING:** Filters GROUP BY results — like WHERE but applied after grouping
  - WHERE filters rows before grouping; HAVING filters groups after
```soql
SELECT AccountId, SUM(Amount) totalRevenue
FROM Opportunity
WHERE StageName = 'Closed Won'
GROUP BY AccountId
HAVING SUM(Amount) > 100000
```
- **GROUP BY ROLLUP:** Adds subtotals and grand total
- **GROUP BY CUBE:** All permutations of subtotals
**Speaker Notes:** The distinction between WHERE and HAVING is a classic SQL/SOQL exam trap. WHERE filters individual rows before grouping — you cannot use aggregate functions in WHERE. HAVING filters grouped results after aggregation — you can use aggregate functions in HAVING. `WHERE SUM(Amount) > 100000` is invalid SOQL. `HAVING SUM(Amount) > 100000` is correct.

### Slide 5: WITH SECURITY_ENFORCED and WITH USER_MODE
**Visual:** Diagram comparing three scenarios: (1) standard Apex runs in system mode, ignoring FLS; (2) WITH SECURITY_ENFORCED throws exception if user lacks field access; (3) WITH USER_MODE respects CRUD, FLS, and sharing rules without exception.
**Content:**
- **System Mode (default):** Apex ignores field-level security (FLS) and object permissions — sees all fields and records
- **WITH SECURITY_ENFORCED:** Throws `System.QueryException` if running user lacks access to any queried field
  ```soql
  SELECT Id, SSN__c FROM Contact WITH SECURITY_ENFORCED
  ```
- **WITH USER_MODE (preferred, API v49+):** Enforces CRUD, FLS, and sharing rules; no exception — fields the user cannot see return null
  ```soql
  SELECT Id, Name FROM Account WITH USER_MODE
  ```
- `WITH SHARING` class keyword enforces sharing rules at the class level (different concept)
- For DML: `Database.insert(records, System.AccessLevel.USER_MODE)`
**Speaker Notes:** This is a significant security topic. By default, Apex runs in system mode — it sees all records and all fields regardless of the running user's permissions. This means a Visualforce page or trigger that uses Apex can inadvertently expose data the user should not see. WITH USER_MODE is the modern, preferred approach for user-facing operations. SECURITY_ENFORCED is older and throws an exception on any field access violation, making it harder to handle gracefully.

### Slide 6: Semi-Joins and Anti-Joins
**Visual:** Two Venn diagram pairs: semi-join shows "return Accounts that HAVE matching Contacts" (intersection), and anti-join shows "return Accounts that DO NOT HAVE matching Contacts" (set difference). Each is paired with its corresponding SOQL.
**Content:**
- **Semi-join (IN):** Return parent records that have related child records matching criteria
```soql
SELECT Id, Name FROM Account
WHERE Id IN (SELECT AccountId FROM Contact WHERE Email != null)
```
- **Anti-join (NOT IN):** Return parent records that do NOT have matching related records
```soql
SELECT Id, Name FROM Account
WHERE Id NOT IN (SELECT AccountId FROM Opportunity WHERE StageName = 'Closed Won')
```
- The subquery in semi/anti-joins must return a single Id field
- Useful for finding records with/without specific related records
- Counts as additional SOQL query work but still one query against the governor limit
**Speaker Notes:** Semi-joins and anti-joins solve problems that would otherwise require two separate queries and Apex logic to compare results. They are elegant and efficient. The subquery in a semi/anti-join can only SELECT a single field (an Id field, typically), and the outer WHERE uses IN or NOT IN with the subquery result. The exam tests whether you know the correct syntax and the constraint that the subquery must return only one Id field.

### Slide 7: Dynamic SOQL
**Visual:** Code panel showing a dynamic SOQL string being built with string concatenation on the left (labeled dangerous, with a hacker icon), then the same query using String.escapeSingleQuotes() (labeled safe), then executed with Database.query().
**Content:**
- Static SOQL: query is written inline, validated at compile time
- **Dynamic SOQL:** Query string built at runtime, executed with `Database.query()`
- Use case: when field names or object names are not known until runtime
```apex
String objName = 'Account';
String fieldName = 'Name';
String searchTerm = String.escapeSingleQuotes(userInput);
String query = 'SELECT Id, ' + fieldName + ' FROM ' + objName
    + ' WHERE Name LIKE \'%' + searchTerm + '%\'';
List<sObject> results = Database.query(query);
```
- `String.escapeSingleQuotes()` escapes single quotes in user input — prevents SOQL injection
- Dynamic SOQL is NOT validated at compile time — errors appear at runtime
**Speaker Notes:** Dynamic SOQL is powerful but dangerous if misused. The most important rule: any string that comes from user input — a URL parameter, a form field, anything the user controls — must be passed through `String.escapeSingleQuotes()` before being embedded in a dynamic query string. Without this, a malicious user can craft input that breaks out of the string context and manipulates the query — a SOQL injection attack. The exam will test this pattern specifically.

### Slide 8: SOQL Best Practices Summary
**Visual:** A numbered checklist with icons for each best practice: (1) query only needed fields, (2) always use WHERE to filter, (3) use bind variables for safety, (4) use WITH USER_MODE for user-facing code, (5) use relationship queries to minimize query count, (6) avoid SOQL in loops.
**Content:**
- **Query only required fields:** Reduces data transfer and heap usage
- **Filter early with WHERE:** Smaller result sets are faster and safer for limits
- **Use bind variables** (`:variable`) instead of string concatenation in static SOQL
- **Use `String.escapeSingleQuotes()`** for any user-controlled input in dynamic SOQL
- **Leverage relationship queries** to fetch parent/child data in one query
- **Use `WITH USER_MODE`** for any query that might expose sensitive user data
- **SOQL for loop** for large result sets to avoid heap limit violations
- **Avoid SOQL in loops** — collect IDs, query once
**Speaker Notes:** These best practices are both exam material and real-world requirements. The exam often presents anti-patterns and asks you to identify the problem — knowing these rules makes those questions straightforward. In professional development, code reviews will specifically check for SOQL in loops, missing WITH USER_MODE on sensitive queries, and missing escapeSingleQuotes on dynamic SOQL.

## Recording Script
Welcome to Lecture 6. We are going deeper into SOQL today — relationship queries, aggregate functions, and the security clauses that protect your users' data.

Let's start with relationship queries. The most common need is to get a field from a parent record at the same time you are querying child records. For example, you are querying Contacts but you also need each Contact's Account Name. In traditional SQL, you would do a JOIN. In SOQL, you use dot notation: `SELECT Id, Name, Account.Name FROM Contact`. The relationship name for a standard lookup is typically the parent object's name. For a custom lookup field called `My_Account__c`, you replace `__c` with `__r`: `My_Account__r.Name`.

Going the other direction — from parent to child — you use a subquery inside parentheses in the SELECT clause. `SELECT Id, Name, (SELECT Id, FirstName FROM Contacts) FROM Account`. The `Contacts` here is the child relationship name, which is the plural of the child object's name for standard objects. This gives you an Account record with all its related Contacts embedded, in a single SOQL query.

Now let's talk aggregate functions. COUNT, SUM, AVG, MIN, and MAX work just like SQL. The key difference: aggregate results come back as `List<AggregateResult>`, not as Account or Contact records. You access fields using `.get('fieldName')` or `.get('alias')`. Always alias your aggregate expressions — `COUNT(Id) cnt` — so you have a predictable name to use in `.get()`.

GROUP BY groups your results by field values, and HAVING filters those groups. The critical distinction — and this is an exam classic — is that WHERE filters individual rows before grouping, while HAVING filters groups after aggregation. You cannot use `WHERE COUNT(Id) > 5` — that is invalid. You must use `HAVING COUNT(Id) > 5`.

The WITH SECURITY_ENFORCED and WITH USER_MODE clauses are about protecting users. By default, Apex runs in system mode — it sees everything, ignoring field-level security. This can be dangerous in user-facing code. WITH USER_MODE is the modern solution: it enforces CRUD permissions, field-level security, and sharing rules, all without throwing exceptions when a field is inaccessible.

Dynamic SOQL is for when you do not know the query structure at compile time — the object name or field names vary based on user selection or configuration. You build the query as a String and execute it with `Database.query()`. The security rule is absolute: any user-controlled input must be sanitized with `String.escapeSingleQuotes()` before being embedded in the query string. Skipping this opens you to SOQL injection attacks.

In the next lecture, we move from reading data to writing data — DML operations. See you there.

## Exam Tips
- For custom lookup fields, traverse with `__r` not `__c` in relationship dot notation: a field `Vendor__c` is traversed as `Vendor__r.Name`.
- Aggregate query results are returned as `List<AggregateResult>` — access values with `.get('alias')`, not with dot notation field access.
- **WHERE** filters rows before grouping; **HAVING** filters groups after aggregation. Aggregate functions are not valid in WHERE clauses.
- `String.escapeSingleQuotes()` is required for any user-controlled string embedded in a Dynamic SOQL query — this prevents SOQL injection.
- WITH USER_MODE (API v49+) is preferred over WITH SECURITY_ENFORCED because it handles inaccessible fields gracefully (returns null) rather than throwing a QueryException.

## Lecture Summary
SOQL relationship queries use dot notation (child-to-parent) and subqueries (parent-to-child) to retrieve related data in a single query, minimizing SOQL query governor usage. Aggregate functions with GROUP BY/HAVING enable summary reporting, returning AggregateResult objects rather than sObjects. Security enforcement via WITH USER_MODE is the modern best practice for user-facing queries, respecting CRUD, FLS, and sharing without exception throwing. Dynamic SOQL with Database.query() requires String.escapeSingleQuotes() on all user input to prevent SOQL injection attacks.

## Mini Quiz

**Q1:** A developer queries `SELECT Id, Name, (SELECT Id, Email FROM Contacts) FROM Account`. After the query, how does the developer access the related Contacts in Apex?
A) `account.Contacts` — returns a `List<Contact>`
B) `account.getContacts()` — returns a `List<Contact>`
C) `account.ContactList` — returns a `Contact[]`
D) `Database.getRelatedRecords(account, Contact.class)`
**Answer:** A — After a parent-to-child subquery, child records are accessible via the relationship name as a property: `account.Contacts`. This returns a `List<Contact>` (or more precisely a subquery result that can be iterated as a list). You can iterate it with `for (Contact c : account.Contacts)`.

**Q2:** A developer wants to find all Accounts that have NO related Opportunities with StageName 'Closed Won'. Which SOQL query correctly retrieves these Accounts?
A) `SELECT Id FROM Account WHERE Opportunities.StageName != 'Closed Won'`
B) `SELECT Id FROM Account WHERE Id NOT IN (SELECT AccountId FROM Opportunity WHERE StageName = 'Closed Won')`
C) `SELECT Id FROM Account WHERE (SELECT COUNT() FROM Opportunity WHERE StageName = 'Closed Won') = 0`
D) `SELECT Id FROM Account WHERE StageName__c != 'Closed Won'`
**Answer:** B — This is an anti-join. NOT IN with a subquery that returns AccountIds of Opportunities with 'Closed Won' returns Accounts that do NOT appear in that set. The subquery in a semi/anti-join must select a single Id field.

**Q3:** A developer builds a Dynamic SOQL query and embeds a user-entered search term: `String q = 'SELECT Id FROM Account WHERE Name LIKE \'%' + userInput + '%\''; List<sObject> r = Database.query(q);`. The userInput variable comes from a URL parameter. What security risk exists, and what is the fix?
A) The query may return too many rows — add LIMIT 100
B) SOQL injection: a malicious user could manipulate the query string — use `String.escapeSingleQuotes(userInput)` before embedding
C) Dynamic SOQL is never allowed with user input — use a static query instead
D) The single quotes must be escaped with backslash in static SOQL — no change needed for dynamic
**Answer:** B — Embedding unescaped user input in a Dynamic SOQL string enables SOQL injection. The fix is `String.escapeSingleQuotes(userInput)` which escapes single quotes in the input so a user cannot break out of the string context and modify the query structure.
