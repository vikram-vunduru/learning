# SOQL Fundamentals

## Exam Domain
Process Automation & Logic — 30% of exam weight

## Core Concepts

### What Is SOQL?
Salesforce Object Query Language — reads data from the Salesforce database. SELECT only; no INSERT, UPDATE, DELETE (those are DML). Uses sObject API names (`Account`, `My_Custom__c`), not UI labels. Embedded directly in Apex between square brackets.

### Basic SELECT Syntax
```apex
SELECT Id, Name, AnnualRevenue, Phone
FROM Account
WHERE Industry = 'Technology'
  AND AnnualRevenue > 1000000
ORDER BY Name ASC
LIMIT 50
```
- No `SELECT *` — must list fields explicitly
- Always include `Id` when you plan to update/delete later
- Accessing a field not in SELECT returns `null` (no error, just null)
- String literals use single quotes: `WHERE Name = 'Acme'`
- Custom fields have `__c` suffix: `WHERE Custom_Field__c = 'value'`

### WHERE Clause Operators
| Operator | Use |
|----------|-----|
| `=`, `!=`, `<`, `>`, `<=`, `>=` | Standard comparison |
| `IN` / `NOT IN` | Match against list/set |
| `LIKE` | Pattern matching (see below) |
| `INCLUDES` / `EXCLUDES` | Multi-select picklist fields only |
| `= null` / `!= null` | Null checks |
| Date literals | `THIS_YEAR`, `LAST_N_DAYS:30`, `THIS_QUARTER` |

### LIKE Wildcards
- `%` matches zero or more characters: `WHERE Name LIKE 'Acme%'`
- `_` matches exactly one character: `WHERE Name LIKE 'A__e'`
- Case-insensitive in SOQL
- Date literals calculate relative to running user's time zone

### Logical Operators — Operator Precedence
`NOT → AND → OR` (AND binds before OR, just like * before +). Use parentheses to override: `WHERE (A OR B) AND C` vs `WHERE A OR (B AND C)`.

### Bind Variables — The Safe Way to Query
Use colon syntax to embed Apex variables. Type-safe. SOQL injection-proof.
```apex
String searchName = 'Acme';
List<Account> accts = [SELECT Id FROM Account WHERE Name = :searchName];

Set<Id> idSet = new Set<Id>{'001xx000001', '001xx000002'};
List<Account> specific = [SELECT Id FROM Account WHERE Id IN :idSet];

Date startDate = Date.today().addDays(-30);
List<Opportunity> recent = [SELECT Id FROM Opportunity WHERE CloseDate >= :startDate];
```
**Never** build SOQL by string concatenation with user input — that is SOQL injection (equivalent to SQL injection).

### Safe Single-Record Query Pattern
Direct sObject assignment throws `QueryException` if 0 or 2+ rows. Always use List + isEmpty() check:
```apex
// UNSAFE — throws QueryException if 0 or 2+ rows
Account a = [SELECT Id FROM Account WHERE Name = 'Acme'];

// SAFE pattern
List<Account> results = [SELECT Id, Name FROM Account WHERE Name = 'Acme' LIMIT 1];
Account acc = results.isEmpty() ? null : results[0];
```

### ORDER BY, LIMIT, OFFSET
- `ORDER BY Name ASC` / `DESC NULLS LAST`
- `LIMIT 1` for single-record queries
- `OFFSET 20` for pagination (max **2,000**)

## PTA / SA Relevance

**In partner code reviews, watch for:**
- SOQL queries inside loops — the most common performance bug; hits 100-query limit at record 101
- Missing `LIMIT 1` on single-record queries assigned to sObject variable — fails silently in dev orgs with 1 record, crashes in production
- Date literals with global user base — `WHERE CloseDate = THIS_YEAR` depends on user's time zone; may skip records for users in different time zones near year boundaries
- String-concatenated SOQL in legacy code — `Database.query('SELECT Id FROM Account WHERE Name = \'' + userInput + '\'')` — SOQL injection vulnerability

**Enterprise-scale considerations:**
- In orgs with millions of records, every WHERE clause without a selective index becomes a full table scan — performance disaster. Selective filters: Id, Name on indexed fields, RecordType, Owner. Avoid leading wildcard LIKE (`%term%`) on large objects.
- SOQL selectivity rules: Salesforce uses server-side indexes; queries need to touch <10% of total records to use an index. For huge objects (50M+ records), work with Salesforce on custom indexes.
- The 50,000-row limit per transaction is per-query and cumulative. In batch contexts with multiple queries, each eating thousands of rows, you can exhaust this mid-batch.

**For CTO conversations:**
- "Why is our org slow?" — often SOQL queries in Apex loops, combined with large data volumes. A query that runs in 200ms with 10k records can take 8 seconds with 2M records. Profiling SOQL via Setup → Query Editor and via debug logs is step 1.

## Architecture / How It Works

```
SOQL SYNTAX MAP

  SELECT   Id, Name, AnnualRevenue        ← explicit field list (no *)
  FROM     Account                        ← sObject API name
  WHERE    Industry IN ('Technology',
                        'Finance')        ← filter using API field names
           AND AnnualRevenue > 1000000    ← AND binds before OR
           AND Name LIKE 'Global%'        ← % = any chars, _ = exactly one
  ORDER BY AnnualRevenue DESC             ← sort; ASC default
           NULLS LAST                     ← null handling
  LIMIT    50                             ← max rows (50,000 hard limit)
  OFFSET   0                             ← pagination (max 2,000)
```

**Limitations:**
- No `SELECT *` — must list every field you need
- Single sObject assignment `Account a = [SELECT ...]` throws QueryException if 0 or >1 rows
- `OFFSET` maximum: 2,000 rows — can't paginate beyond that with OFFSET
- Total rows returned per transaction: 50,000
- LIKE with leading wildcard (`'%term'`) is non-selective and very slow on large objects

**Bind Variable Injection Safety:**

VULNERABLE (string concatenation — SOQL injection risk):

```apex
String name = userInput;  // could be: Acme' OR Id != null
String q = 'SELECT Id FROM Account WHERE Name = \'' + name + '\'';
List<Account> r = Database.query(q);  // SOQL INJECTION RISK
```

SAFE (bind variable — preferred, type-safe, injection-safe):

```apex
String name = userInput;
List<Account> r = [SELECT Id FROM Account WHERE Name = :name];
// colon syntax treats value as literal string
```

SAFE (Dynamic SOQL with escape — fallback when bind variable not possible):

```apex
String name = String.escapeSingleQuotes(userInput);
String q = 'SELECT Id FROM Account WHERE Name = \'' + name + '\'';
List<Account> r = Database.query(q);  // safe with escape
```

**Limitations:**
- Bind variables work in static SOQL (`[SELECT ...]`) but NOT in dynamic SOQL string bodies (use `Database.query()` with `escapeSingleQuotes()` for dynamic field names/object names)
- Collections bound to IN clause must be non-null — binding a null Set throws exception

| Limit | Synchronous | Asynchronous |
|-------|-------------|--------------|
| Total SOQL queries | 100 | 200 |
| Rows returned per query | 50,000 | 50,000 |
| Rows returned total | 50,000 | 50,000 |
| QueryLocator (Batch only) | N/A | 50,000,000 |
| SOSL searches | 20 | 20 |

Check: `System.debug(Limits.getQueries() + '/' + Limits.getLimitQueries());`

**Limitations:**
- QueryLocator's 50M limit only applies inside `start()` of Batch Apex — regular SOQL never returns more than 50,000 rows
- SOSL is a different query language for full-text search — separate 20-query limit

## Key Facts to Memorize
- SOQL = **SELECT only** — no INSERT/UPDATE/DELETE
- No `SELECT *` — list fields explicitly
- Bind variables: colon syntax `:variable` — type-safe and injection-safe
- `LIKE` wildcards: `%` (any chars) and `_` (exactly one char)
- Safe single-record pattern: `List<sObject>` + `isEmpty()` + `[0]`
- Synchronous SOQL limit: **100 queries**; asynchronous: **200 queries**
- Total rows per transaction: **50,000**
- `OFFSET` max: **2,000**
- Date literals evaluate relative to **running user's time zone**

## Customer Advisory Tips
- **SOQL optimization audit:** For orgs reporting slow performance, run SOQL Optimizer analysis via debug logs. Look for non-selective queries, LIKE with leading wildcards, and queries on non-indexed fields on large objects.
- **SOQL injection in legacy code:** Any org that has been live for 5+ years likely has some dynamic SOQL without `escapeSingleQuotes()`. Include SOQL injection scan in security assessments.

## Exam Traps
- Assigning a SOQL query directly to sObject variable (not List) throws `QueryException` if 0 or 2+ rows — always use List pattern
- `IN` bind variable with colon: `WHERE Id IN :mySet` — no quotes, no parentheses around the colon expression
- SOQL is **case-insensitive for string comparisons**: `WHERE Name = 'acme'` matches 'ACME'
- SOQL date literals (`THIS_YEAR`, `TODAY`) are relative to **running user's time zone** — not UTC
- `OFFSET` max is **2,000** — common distractor is "unlimited" or "50,000"
- `INCLUDES`/`EXCLUDES` only work on **multi-select picklist** fields

## Practice Questions

**Q:** A developer needs to query all Accounts whose names start with "Global". Which WHERE clause is correct?
**A:** `WHERE Name LIKE 'Global%'` — `%` matches any characters after "Global". `_` would match exactly one character. `CONTAINS` is not a SOQL operator.

**Q:** `Account a = [SELECT Id FROM Account WHERE Name = 'Test Corp'];` — the org has no Account with that name. What happens?
**A:** `QueryException` is thrown: "List has no rows for assignment to SObject." Direct sObject assignment requires exactly one row. Use List + isEmpty() pattern.

**Q:** Which is the correct bind variable syntax for querying Accounts from a Set of IDs?
**A:** `[SELECT Id FROM Account WHERE Id IN :idSet]` — colon prefix, no quotes, no parentheses around the variable.
