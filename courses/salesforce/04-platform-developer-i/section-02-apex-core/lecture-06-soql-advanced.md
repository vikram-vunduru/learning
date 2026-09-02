# SOQL Advanced

## Exam Domain
Process Automation & Logic — 30% of exam weight

## Core Concepts

### Relationship Queries — Child-to-Parent (Dot Notation)
Traverse parent fields with dot notation. Standard relationship name = parent object name. Custom lookup field `Vendor__c` → traverse as `Vendor__r.Name` (replace `__c` with `__r`). Can go up to 5 levels deep.
```soql
SELECT Id, LastName, Account.Name, Account.Owner.Name
FROM Contact
WHERE Account.Industry = 'Technology'
```

### Relationship Queries — Parent-to-Child (Subquery)
Use a subquery in the SELECT clause to fetch related child records. Child relationship name is plural. Results in a nested `List<sObject>` accessible as a property on the parent record.
```soql
SELECT Id, Name,
    (SELECT Id, FirstName, LastName FROM Contacts WHERE Email != null)
FROM Account
WHERE Industry = 'Technology'
```
Access in Apex: `for (Contact c : account.Contacts) { ... }`

### Aggregate Functions
Results come back as `List<AggregateResult>` — access with `.get('alias')`. COUNT, SUM, AVG, MIN, MAX. Always alias computed fields: `COUNT(Id) cnt`.
```apex
List<AggregateResult> results = [
    SELECT StageName, COUNT(Id) cnt, SUM(Amount) totalAmt
    FROM Opportunity WHERE CloseDate = THIS_YEAR
    GROUP BY StageName
];
for (AggregateResult ar : results) {
    System.debug(ar.get('StageName') + ': ' + ar.get('cnt'));
}
```

### GROUP BY and HAVING
`GROUP BY` groups rows. `HAVING` filters grouped results (WHERE applies before grouping; HAVING applies after). You CANNOT use aggregate functions in WHERE — use HAVING.
```soql
SELECT AccountId, SUM(Amount) totalRevenue
FROM Opportunity
WHERE StageName = 'Closed Won'
GROUP BY AccountId
HAVING SUM(Amount) > 100000
```

### Semi-Joins and Anti-Joins
- **Semi-join (IN):** Return records that HAVE related records matching criteria
- **Anti-join (NOT IN):** Return records that do NOT have matching related records
```soql
-- Accounts with no Closed Won Opportunities (anti-join)
SELECT Id, Name FROM Account
WHERE Id NOT IN (SELECT AccountId FROM Opportunity WHERE StageName = 'Closed Won')
```
Subquery in semi/anti-join must return a **single Id field**.

### WITH SECURITY_ENFORCED and WITH USER_MODE
By default, Apex runs in system mode — ignores FLS and object permissions. Two options to enforce:
- `WITH SECURITY_ENFORCED` — throws `QueryException` if user lacks access to any field
- `WITH USER_MODE` (API v49+, preferred) — enforces CRUD, FLS, and sharing; inaccessible fields return null (no exception)
```soql
SELECT Id, SSN__c FROM Contact WITH USER_MODE
```
For DML: `Database.insert(records, System.AccessLevel.USER_MODE)`

### Dynamic SOQL
When field/object names aren't known at compile time. Use `Database.query(queryString)`. NOT validated at compile time — errors appear at runtime. MUST sanitize user input.
```apex
String searchTerm = String.escapeSingleQuotes(userInput);
String query = 'SELECT Id, Name FROM Account WHERE Name LIKE \'%' + searchTerm + '%\'';
List<sObject> results = Database.query(query);
```

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Missing `String.escapeSingleQuotes()` in dynamic SOQL that uses any user-controlled input — SOQL injection vulnerability. Check every call to `Database.query()`.
- Using `WITH SECURITY_ENFORCED` instead of `WITH USER_MODE` in user-facing Apex — SECURITY_ENFORCED throws exceptions, making error handling brittle; USER_MODE handles gracefully.
- Aggregate queries without aliases — `ar.get('expr0')` is fragile across Salesforce API versions; always alias computed fields.
- Parent-to-child subqueries returning 50,000+ child records — the subquery result set per relationship is also capped at 50,000 rows.

**Enterprise-scale considerations:**
- In orgs with 10M+ Account records, a non-selective parent-to-child subquery is a performance bomb. Queries need selective indexes. Custom indexes (requested via Support) can dramatically improve performance.
- Aggregate queries with GROUP BY on large datasets can be slow. Consider reporting snapshots (scheduled Apex writing aggregated data to a custom object) for dashboards that don't need real-time data.
- Dynamic SOQL is sometimes used for generic query builders in AppExchange apps — if you're reviewing an ISV partner's app, check that their dynamic query framework properly sanitizes all inputs before Salesforce security review.

**For CTO conversations:**
- "Can we query across objects like SQL JOINs?" — Answer: relationship queries handle parent-child traversal. True cross-object joins (non-parent-child related objects) require multiple SOQL queries or SOSL.

## Architecture / How It Works

```
RELATIONSHIP QUERY TYPES

  CHILD-TO-PARENT (dot notation):
  ┌────────────────────────────────────────────────────────┐
  │  SELECT Id, LastName,                                  │
  │         Account.Name,          ← standard relationship │
  │         My_Custom__r.Name      ← custom: __c → __r    │
  │  FROM   Contact                                        │
  │                                                        │
  │  Up to 5 parent traversal levels                       │
  │  Contact → Account → Owner → Role → ...                │
  └────────────────────────────────────────────────────────┘

  PARENT-TO-CHILD (subquery in SELECT):
  ┌────────────────────────────────────────────────────────┐
  │  SELECT Id, Name,                                      │
  │         (SELECT Id, Email FROM Contacts),   ← plural  │
  │         (SELECT Id, Amount FROM Opportunities)         │
  │  FROM   Account                                        │
  │                                                        │
  │  Access in Apex:  account.Contacts  → List<Contact>    │
  └────────────────────────────────────────────────────────┘
```

**Limitations:**
- Maximum 5 levels deep for child-to-parent traversal
- Maximum 1 parent-to-child subquery level (cannot nest subqueries inside subqueries)
- Subquery result cap: 50,000 child rows per relationship in total result set
- Custom relationship traversal: `__c` field → use `__r` for relationship navigation

```
WHERE vs HAVING — FILTER TIMING

  Raw Opportunity records:
  ┌──────────────────────────────────────────────────────────────┐
  │  All Opps in database                                        │
  │        │                                                     │
  │        ▼  WHERE (before grouping)                            │
  │  Filter: StageName = 'Closed Won'  ← removes non-CW records │
  │        │                                                     │
  │        ▼  GROUP BY AccountId                                 │
  │  Group: Account A = $500k, Account B = $80k, Account C = $1M │
  │        │                                                     │
  │        ▼  HAVING (after grouping)                            │
  │  Filter: SUM(Amount) > $100k → removes Account B            │
  │        │                                                     │
  │        ▼  Result: Account A, Account C                       │
  └──────────────────────────────────────────────────────────────┘

  KEY RULE: aggregate functions in WHERE clause = INVALID SOQL
  Must use: HAVING COUNT(Id) > 5   (not: WHERE COUNT(Id) > 5)
```

**Limitations:**
- Aggregate functions cannot appear in WHERE clause — SOQL syntax error
- All non-aggregate fields in SELECT must appear in GROUP BY
- AggregateResult rows DO count against the 50,000 row limit

```
DYNAMIC SOQL SECURITY

  WITH USER_MODE:                       WITH SECURITY_ENFORCED:
  ┌──────────────────────────────┐      ┌──────────────────────────────┐
  │ [SELECT Id, SSN__c            │      │ [SELECT Id, SSN__c            │
  │  FROM Contact                 │      │  FROM Contact                 │
  │  WITH USER_MODE]              │      │  WITH SECURITY_ENFORCED]      │
  │                               │      │                               │
  │ If user lacks SSN__c access:  │      │ If user lacks SSN__c access:  │
  │ → Field returns null          │      │ → QueryException thrown       │
  │ → No exception                │      │                               │
  │ → Preferred for user-facing   │      │ → Harder to handle gracefully │
  └──────────────────────────────┘      └──────────────────────────────┘
```

**Limitations:**
- `WITH USER_MODE` respects the running user's sharing rules — may return fewer records than system mode
- `WITH SECURITY_ENFORCED` throws if ANY field in the SELECT is inaccessible — even standard fields user lacks FLS for
- Neither applies to trigger context (triggers run in system mode by design for record maintenance operations)

## Key Facts to Memorize
- Custom lookup traversal: `Vendor__c` field → `Vendor__r.Name` (replace `__c` with `__r`)
- Aggregate queries return `List<AggregateResult>` — use `.get('alias')` to access fields
- WHERE filters before grouping; HAVING filters after grouping — aggregate functions in HAVING, not WHERE
- `WITH USER_MODE` (v49+) is preferred over `WITH SECURITY_ENFORCED` — no exception on inaccessible fields
- Dynamic SOQL: `Database.query(string)` — user input must pass through `String.escapeSingleQuotes()`
- Semi-join uses IN, anti-join uses NOT IN — subquery must select one Id field

## Customer Advisory Tips
- **Security review prep:** For ISV partners going through security review, ALL Apex using `Database.query()` must be audited for `escapeSingleQuotes()` compliance. Missing this is a common security review failure.
- **Performance review:** For large orgs, relationship queries should target selective fields. Work with the customer's Salesforce account team to request custom indexes on high-volume objects.

## Exam Traps
- Custom lookup `My_Field__c` → traversal is `My_Field__r.Name` (replace `__c` with `__r`, not add `__r`)
- `AggregateResult` is accessed with `.get('alias')` — dot notation field access does NOT work
- `WHERE SUM(Amount) > 1000` is invalid SOQL — aggregate functions must go in HAVING
- `WITH SECURITY_ENFORCED` throws exception on any inaccessible field; `WITH USER_MODE` returns null instead
- Dynamic SOQL via `Database.query()` is NOT validated at compile time — errors appear at runtime
- Anti-join subquery: `WHERE Id NOT IN (SELECT AccountId FROM ...)` — subquery must return ONE Id field

## Practice Questions

**Q:** A developer queries `SELECT Id, Name, (SELECT Id, Email FROM Contacts) FROM Account`. How are the child records accessed in Apex?
**A:** `account.Contacts` — returns an iterable list. Use `for (Contact c : account.Contacts) { }`.

**Q:** Which is valid: `WHERE COUNT(Id) > 5` or `HAVING COUNT(Id) > 5`?
**A:** `HAVING COUNT(Id) > 5` — aggregate functions cannot appear in WHERE. WHERE filters before grouping; HAVING filters after.

**Q:** A custom object has a lookup field `Partner_Account__c` to Account. How do you query the Account Name in SOQL from the custom object?
**A:** `SELECT Id, Partner_Account__r.Name FROM My_Object__c` — replace `__c` with `__r` for relationship traversal.
