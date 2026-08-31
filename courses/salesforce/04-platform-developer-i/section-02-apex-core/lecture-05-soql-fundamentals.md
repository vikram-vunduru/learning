# Lecture 05: SOQL Fundamentals

## Learning Objectives
- Write basic SOQL queries using SELECT, FROM, and WHERE clauses with comparison and logical operators
- Use the LIKE operator with wildcard characters (% and _) for pattern matching
- Apply ORDER BY, LIMIT, and OFFSET clauses to control query results
- Use bind variables with the colon syntax to safely embed Apex variables in SOQL queries

## Slides

### Slide 1: What Is SOQL?
**Visual:** Side-by-side showing a standard SQL SELECT statement querying a relational table on the left, versus a SOQL SELECT statement querying a Salesforce sObject on the right, with annotations highlighting the differences: no JOIN syntax, no table aliases, WHERE field names use API names not labels.
**Content:**
- **SOQL = Salesforce Object Query Language** — used to retrieve records from the Salesforce database
- Similar to SQL SELECT but designed for the Salesforce object model
- SOQL can only **SELECT** — no INSERT, UPDATE, DELETE (those are DML operations)
- Queries execute against sObject API names, not UI labels (`Account` not "Accounts")
- Field names use API names: `FirstName`, `LastName`, not "First Name", "Last Name"
- Custom fields have `__c` suffix: `My_Field__c`
- Embedded in Apex: `List<Account> accts = [SELECT Id, Name FROM Account];`
**Speaker Notes:** SOQL is your primary tool for reading data from Salesforce. Unlike SQL, SOQL does not support JOIN across objects in the traditional sense — instead, it has relationship queries, which we cover in Lecture 6. Every SOQL query you write in Apex must follow the API name convention, not the field label shown in the UI. If you look up an object's API name in Setup → Object Manager, you will see whether it is standard like `Account` or custom like `Invoice__c`.

### Slide 2: Basic SELECT Syntax
**Visual:** Anatomy diagram of a complete SOQL query with labeled sections: SELECT clause (field list), FROM clause (object), WHERE clause (filter), ORDER BY clause, and LIMIT clause. Color-coded sections match a legend below.
**Content:**
- Full syntax: `SELECT field1, field2 FROM ObjectName WHERE condition ORDER BY field LIMIT n`
- Select specific fields: `SELECT Id, Name, Phone FROM Account`
- **Always include Id** when you intend to update or delete records later
- Select all standard fields: Not supported in Apex — must name fields explicitly (no SELECT *)
- Query all records with no filter: `SELECT Id, Name FROM Account`
- `Id` field is always available even if not listed in SELECT — but best practice is to include it
- String literals in WHERE use single quotes: `WHERE Name = 'Acme'`
**Speaker Notes:** A critical difference from SQL: SOQL does not support SELECT star (SELECT *). You must explicitly list every field you want to retrieve. This is by design — it prevents accidental transfer of sensitive data and forces developers to be intentional about what data they access. Only queried fields are accessible on the returned records; accessing unqueried fields returns null in Apex.

### Slide 3: WHERE Clause — Comparison Operators
**Visual:** Table showing each comparison operator (=, !=, <, >, <=, >=, LIKE, IN, NOT IN, INCLUDES, EXCLUDES) with a description column and a SOQL example column.
**Content:**
- Standard comparisons: `=`, `!=`, `<`, `>`, `<=`, `>=`
- **IN / NOT IN:** Match against a list of values
  ```
  WHERE Industry IN ('Technology', 'Finance', 'Healthcare')
  ```
- **LIKE:** Pattern matching with wildcards (see next slide)
- **INCLUDES / EXCLUDES:** For multi-select picklist fields only
- Null checks: `WHERE Description = null` or `WHERE Description != null`
- Date literals: `WHERE CloseDate = THIS_YEAR`, `WHERE CreatedDate = LAST_N_DAYS:30`
**Speaker Notes:** The IN operator is particularly important in Apex because you can bind a Set or List of Ids directly: `WHERE Id IN :myIdSet`. Date literals like `THIS_YEAR`, `LAST_MONTH`, and `LAST_N_DAYS:n` are unique to SOQL and very useful for time-based reporting queries. They always calculate relative to the running user's time zone, which is a common source of bugs in orgs with global users.

### Slide 4: Logical Operators and LIKE
**Visual:** Truth table for AND, OR, NOT operators with examples, and below it a pattern matching reference for LIKE showing %, _, and combination examples with matching/non-matching sample strings.
**Content:**
- **AND:** Both conditions must be true
  ```
  WHERE Industry = 'Technology' AND AnnualRevenue > 1000000
  ```
- **OR:** At least one condition must be true
- **NOT:** Negates a condition; `WHERE NOT (Industry = 'Technology')`
- Operator precedence: NOT → AND → OR (use parentheses to override)
- **LIKE operator:**
  - `%` matches zero or more characters: `WHERE Name LIKE 'Acme%'` — starts with Acme
  - `_` matches exactly one character: `WHERE Name LIKE 'A__e'` — A, any two chars, e
  - Case-insensitive in SOQL
  - `WHERE Email LIKE '%@salesforce.com'` — ends with @salesforce.com
**Speaker Notes:** Operator precedence is a classic exam trap. The expression `WHERE A OR B AND C` evaluates as `WHERE A OR (B AND C)` because AND binds more tightly than OR. If you want `(A OR B) AND C`, you must use parentheses explicitly. The same rule applies in almost every programming language and query language. The LIKE wildcards are simpler than regular expressions — just % for any sequence and _ for exactly one character.

### Slide 5: ORDER BY, LIMIT, and OFFSET
**Visual:** Diagram showing a database of 1,000 Account records, with LIMIT and OFFSET applied to return a "page" of records, illustrated as slicing a bookshelf with bookmarks showing page 1, page 2, page 3.
**Content:**
- **ORDER BY:** Sorts results; default is ASC (ascending)
  ```
  SELECT Id, Name FROM Account ORDER BY Name ASC
  SELECT Id, Name FROM Account ORDER BY AnnualRevenue DESC NULLS LAST
  ```
- `NULLS FIRST` / `NULLS LAST` controls where null values appear
- **LIMIT:** Maximum number of records to return; `LIMIT 1` for single-record queries
- **OFFSET:** Skips the first n records; used for pagination
  ```
  SELECT Id, Name FROM Account ORDER BY Name LIMIT 10 OFFSET 20
  ```
- `OFFSET` maximum value: **2,000**
- **Governor limit:** 50,000 rows returned per transaction total
**Speaker Notes:** `LIMIT 1` is extremely common in Apex when you expect exactly one record — for example, querying for a custom setting or a specific configuration record. Always use it when you only need one record, both for efficiency and to prevent a `QueryException` (List has more than 1 row for assignment) if the query returns multiple records and you assigned it to a single sObject variable instead of a List.

### Slide 6: Binding Apex Variables in SOQL
**Visual:** Two code panels — the left shows concatenated string-built SOQL (labeled "vulnerable to injection" in red), the right shows the bind variable syntax with `:variableName` (labeled "safe" in green). An arrow points to the colon as the key differentiator.
**Content:**
- Use colon syntax to embed Apex variables in SOQL queries
- Variable is evaluated at query execution time — type-safe and SOQL-injection safe
- Can bind: primitives, Ids, Strings, Dates, Collections (for IN clauses)
```apex
String searchName = 'Acme';
List<Account> accts = [SELECT Id FROM Account WHERE Name = :searchName];

Set<Id> idSet = new Set<Id>{'001xx000001', '001xx000002'};
List<Account> specific = [SELECT Id FROM Account WHERE Id IN :idSet];

Date startDate = Date.today().addDays(-30);
List<Opportunity> recent = [SELECT Id FROM Opportunity WHERE CloseDate >= :startDate];
```
- Collections (List, Set) can be bound directly to IN clauses
**Speaker Notes:** The bind variable colon syntax is one of the most important patterns in Apex SOQL. It keeps your queries safe from SOQL injection attacks — the same class of vulnerability as SQL injection. Never build SOQL by concatenating strings with user input. Always use bind variables or Dynamic SOQL with `String.escapeSingleQuotes()`. On the exam, if you see a question about security in SOQL queries, bind variables are the correct answer.

### Slide 7: Governor Limits for SOQL
**Visual:** Limit meter graphic showing synchronous (100 queries) vs asynchronous (200 queries) limits side by side, with a transaction-scope label, and a second meter for total rows (50,000). Below, a code snippet showing Limits.getQueries() usage.
**Content:**
- **100 SOQL queries** per synchronous transaction
- **200 SOQL queries** per asynchronous transaction (Batch, Future, Queueable, Scheduled)
- **50,000 rows** returned across all queries in a single transaction
- Check usage at runtime: `System.debug(Limits.getQueries() + ' / ' + Limits.getLimitQueries());`
- Aggregate queries (COUNT, SUM, etc.) count against the SOQL query limit but differently against the row limit
- SOQL for loop (covered in L04) processes results in 200-row chunks to reduce heap pressure
**Speaker Notes:** The 100 vs 200 SOQL query limit is a frequent exam question. Synchronous contexts — trigger execution, Visualforce controller actions, REST API calls — have 100. Asynchronous contexts — Batch Apex execute method, Future methods, Queueable execute method — have 200. This higher limit is one of the main reasons to move long-running processes to async Apex.

### Slide 8: Common SOQL Patterns in Apex
**Visual:** Three code snippets side by side: (1) single record query with LIMIT 1 and isEmpty() check, (2) collection query with Set bind variable, (3) date literal filter. Each snippet is labeled with its use case.
**Content:**
- **Single record query — safe pattern:**
```apex
List<Account> results = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];
Account acc = results.isEmpty() ? null : results[0];
```
- **Bulk query with Set bind variable:**
```apex
Set<Id> contactAccountIds = new Set<Id>();
for (Contact c : Trigger.new) contactAccountIds.add(c.AccountId);
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :contactAccountIds];
```
- **Filter with date literal:**
```apex
List<Opportunity> closing = [SELECT Id, Name FROM Opportunity
    WHERE CloseDate = THIS_QUARTER AND StageName != 'Closed Won'];
```
**Speaker Notes:** The single-record query pattern using a List with LIMIT 1 and then checking isEmpty() is considered best practice over assigning a query directly to an sObject variable. Direct assignment — `Account a = [SELECT Id FROM Account WHERE Name = 'Acme'];` — will throw a QueryException if the query returns zero records or more than one record. The List pattern handles both edge cases gracefully.

## Recording Script
Welcome to Lecture 5 — our first lecture in the Apex Core section. Today we cover SOQL, Salesforce Object Query Language, your primary tool for reading data from the Salesforce database.

If you know SQL, SOQL will feel very familiar. The basic structure is: SELECT a list of fields FROM an object WHERE some condition. But there are important differences. SOQL cannot modify data — there is no INSERT, UPDATE, or DELETE in SOQL. Those are separate DML operations we cover in Lecture 7. SOQL also does not support traditional JOINs — instead, it has relationship queries, which we cover in Lecture 6.

Let's start writing queries. The most basic form is `SELECT Id, Name FROM Account`. This returns all Account records with their Id and Name fields. Notice I said the object's API name — Account, not Accounts. And field API names — Name, AnnualRevenue — not the UI labels.

For filtering, the WHERE clause works just like SQL. You have all your comparison operators: equals, not equals, greater than, less than. You have IN and NOT IN for matching against lists of values. And you have LIKE for pattern matching, where percent (%) matches any sequence of characters and underscore (_) matches exactly one character. So `WHERE Name LIKE 'Acme%'` matches any name starting with Acme.

Logical operators AND, OR, and NOT work as expected. The key thing to remember is operator precedence: AND binds before OR, just like multiplication before addition in math. Always use parentheses when combining AND and OR to make your intent explicit.

ORDER BY sorts your results. Ascending is the default. LIMIT caps the number of records returned. And OFFSET skips records for pagination — though OFFSET has a maximum value of 2,000.

Now the most important concept in this lecture: bind variables. When you want to use an Apex variable in your SOQL query, use the colon syntax. `WHERE Name = :myVariable`. This is safe, type-checked, and prevents SOQL injection attacks. Never build SOQL by string concatenation when you have user-controlled input — that is the SOQL equivalent of SQL injection.

Governor limits: synchronous transactions can run 100 SOQL queries. Async transactions can run 200. And across all queries in a transaction, you can return at most 50,000 rows. If you are querying large data sets, use the SOQL for loop we covered in Lecture 4 — it processes records in batches of 200, keeping your heap usage in check.

The pattern I want you to practice is the bulk query pattern: collect IDs into a Set, then use `WHERE Id IN :myIdSet` in your SOQL. One query returns all the records you need at once, no matter how large the set. This is the foundation of all bulkified Apex.

In the next lecture, we go deeper into SOQL: relationship queries, aggregate functions, and dynamic SOQL. See you there.

## Exam Tips
- SOQL only reads data — SELECT is the only operation. Data modification uses DML statements (insert, update, upsert, delete, undelete, merge).
- The `%` wildcard matches **zero or more** characters; `_` matches **exactly one** character. LIKE is case-insensitive in SOQL.
- Synchronous SOQL limit: **100 queries**; asynchronous: **200 queries**; total rows per transaction: **50,000**.
- Assigning a SOQL query to a single sObject variable (not a List) throws `QueryException` if the query returns 0 or more than 1 row — always use `List<sObject>` with LIMIT 1 and `isEmpty()` check for safe single-record queries.
- Date literals (`THIS_YEAR`, `LAST_N_DAYS:n`, `TODAY`, `THIS_QUARTER`) are SOQL-specific and are evaluated relative to the **running user's time zone**.

## Lecture Summary
SOQL is the read-only query language for Salesforce data, using SELECT/FROM/WHERE syntax similar to SQL but without JOIN or DML capabilities. Comparison operators, LIKE wildcards (% and _), and logical operators (AND, OR, NOT) form the WHERE clause, while ORDER BY, LIMIT, and OFFSET control result sets. Bind variables with the colon syntax (`:variable`) are the safe, injection-proof way to embed Apex values in queries, and the 100-query synchronous governor limit makes bulk querying with Set bind variables and the IN operator essential.

## Mini Quiz

**Q1:** A developer needs to query all Accounts whose names start with "Global". Which SOQL WHERE clause is correct?
A) `WHERE Name = 'Global*'`
B) `WHERE Name LIKE 'Global%'`
C) `WHERE Name LIKE 'Global_'`
D) `WHERE Name CONTAINS 'Global'`
**Answer:** B — The LIKE operator uses `%` as a wildcard for zero or more characters. `'Global%'` matches any name starting with "Global" followed by any characters. `_` only matches a single character. CONTAINS is not a valid SOQL operator.

**Q2:** A developer writes `Account a = [SELECT Id FROM Account WHERE Name = 'Test Corp'];`. The org has no Account with that name. What happens?
A) a is set to null
B) a is set to an empty Account object with no Id
C) A QueryException is thrown: List has no rows for assignment
D) The query returns the first Account in the database as a default
**Answer:** C — Assigning a SOQL query directly to an sObject variable requires exactly one row. If zero rows are returned, a QueryException is thrown. The safe pattern is: `List<Account> results = [SELECT Id FROM Account WHERE Name = 'Test Corp' LIMIT 1]; Account a = results.isEmpty() ? null : results[0];`

**Q3:** Which bind variable usage is correct for querying Accounts by a dynamically built set of IDs in Apex?
A) `[SELECT Id FROM Account WHERE Id IN (idSet)]`
B) `[SELECT Id FROM Account WHERE Id IN :idSet]`
C) `[SELECT Id FROM Account WHERE Id = :idSet]`
D) `[SELECT Id FROM Account WHERE Id IN '" + idSet + "'"]`
**Answer:** B — Colon syntax `:idSet` is the correct way to bind an Apex Set or List to an IN clause in SOQL. No quotes around the colon variable. Option D is string concatenation, which is vulnerable to SOQL injection. Option C would try to compare a single Id to a Set, which is invalid.
