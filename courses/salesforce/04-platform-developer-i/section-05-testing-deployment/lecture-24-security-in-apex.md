# Security in Apex

## Exam Domain
Testing, Debugging & Deployment — 22% of exam weight

## Core Concepts

### Apex Security Context — The Default Is Dangerous
By default, Apex runs in **system context**: it bypasses sharing rules (OWD, sharing rules, manual shares), CRUD permissions, and FLS. Unlike the UI, which automatically enforces all these, Apex code that omits security keywords can expose or modify records the running user was never supposed to see.
```apex
// DANGEROUS — runs in system context, sees ALL records
public class AccountService {
    public List<Account> getAllAccounts() {
        return [SELECT Id, Name FROM Account];  // returns every Account in the org
    }
}

// SAFE — enforces running user's sharing access
public with sharing class AccountService {
    public List<Account> getAllAccounts() {
        return [SELECT Id, Name FROM Account];  // only records user can see
    }
}
```

### Sharing Keywords — Three Choices, One Rule
Always declare a sharing keyword. Never rely on the implicit default.

| Keyword | Behavior |
|---------|---------|
| `with sharing` | Enforces running user's sharing access (OWD + sharing rules + manual shares) |
| `without sharing` | Bypasses ALL sharing rules — sees all records |
| `inherited sharing` | Uses the calling context's sharing mode |
| (none) | System context — equivalent to `without sharing` — security risk |

```apex
// Service layer — use inherited sharing for reusable utility classes
public inherited sharing class ContactService {
    public List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name FROM Contact WHERE AccountId = :accountId];
    }
}
// Called from with sharing code → enforces sharing
// Called from without sharing code → bypasses sharing
// Called from anonymous Apex / Batch start/finish → system context (no sharing)
```

### CRUD Checks — Object-Level Permissions
Apex does not automatically check whether the user has Create/Read/Update/Delete permissions on an object. Check explicitly before DML.
```apex
// Check before querying
if (!Schema.SObjectType.Account.isAccessible()) {
    throw new AuraHandledException('No read access to Account');
}
List<Account> accounts = [SELECT Id, Name FROM Account];

// Check before insert
if (!Schema.SObjectType.Contact.isCreateable()) {
    throw new AuraHandledException('Cannot create Contact');
}
insert newContact;

// Check before update
if (!Schema.SObjectType.Account.isUpdateable()) {
    throw new AuraHandledException('Cannot update Account');
}
update account;

// Check before delete
if (!Schema.SObjectType.Account.isDeletable()) {
    throw new AuraHandledException('Cannot delete Account');
}
delete account;
```

### FLS Checks — Field-Level Security
Field-level security is independent from CRUD. A user may have read access to Contact but not to a sensitive field like `SSN__c`. Check individual fields before using them.
```apex
Schema.DescribeFieldResult dfr = Schema.SObjectType.Account.fields.AnnualRevenue;

// Can user read this field?
if (!dfr.isAccessible()) {
    throw new SecurityException('No read access to AnnualRevenue');
}

// Can user write this field?
if (!dfr.isUpdateable()) {
    throw new SecurityException('No write access to AnnualRevenue');
}
```
Methods: `.isAccessible()` (read), `.isUpdateable()` (update), `.isCreateable()` (create).

### stripInaccessible() — Automatic FLS Enforcement
The most practical tool for FLS enforcement — pass query results through it and inaccessible fields are silently stripped.
```apex
List<Account> accounts = [SELECT Id, Name, AnnualRevenue, SSN__c FROM Account];

SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE,
    accounts
);
List<Account> safeAccounts = decision.getRecords();
// Fields the user cannot read are removed; no exception thrown
```
`AccessType` values: `READABLE`, `CREATABLE`, `UPDATABLE`.

### WITH SECURITY_ENFORCED in SOQL
Add to SOQL to enforce CRUD and FLS at query time. Throws `System.QueryException` if any field is inaccessible.
```apex
List<Account> accounts = [
    SELECT Id, Name, AnnualRevenue
    FROM Account
    WITH SECURITY_ENFORCED
];
// Throws if user lacks read access to Account OR AnnualRevenue
```
Limitation: does NOT work with aggregate queries (`GROUP BY`, `HAVING`, `COUNT()`). For complex scenarios, prefer `stripInaccessible()`.

### SOQL Injection — Bind Variables Are the Fix
User input concatenated directly into dynamic SOQL is exploitable. An attacker inputs `' OR Name != '` to manipulate the WHERE clause.
```apex
// VULNERABLE — never do this
String userInput = ApexPages.currentPage().getParameters().get('name');
String query = 'SELECT Id FROM Account WHERE Name = \'' + userInput + '\'';
List<Account> results = Database.query(query);

// SAFE — bind variable (preferred)
List<Account> results = [SELECT Id FROM Account WHERE Name = :userInput];

// SAFE — escapeSingleQuotes (fallback for truly dynamic queries)
String safeInput = String.escapeSingleQuotes(userInput);
String query = 'SELECT Id FROM Account WHERE Name = \'' + safeInput + '\'';
List<Account> results = Database.query(query);
```
Bind variables (`:variableName`) treat the value as a literal string — it cannot be interpreted as SOQL syntax.

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Classes with no sharing keyword — the silent default is system context; every class needs an explicit declaration
- `@AuraEnabled` methods returning data without `stripInaccessible()` or `with sharing` — LWC components backed by these methods leak records to users who shouldn't see them
- Dynamic SOQL with string concatenation — any user-controlled input in a dynamic query is a SOQL injection vector
- Utility classes using `without sharing` "because they're shared" — wrong rationale; use `inherited sharing` for shared utilities
- Missing CRUD checks before DML in `@AuraEnabled` methods — Apex running in system context can insert/update records even when the user lacks object permissions

**Enterprise-scale considerations:**
- Security in Apex is defense in depth. The platform enforces permissions in the UI; Apex is the bypass layer. Any org that allows direct API access or has custom Apex exposed via REST/SOAP must treat Apex security as critical.
- For ISV/AppExchange packages: AppExchange security review requires explicit CRUD and FLS checks or use of `with sharing` / `stripInaccessible()`. Managed packages failing security review is a common ISV partner issue.
- In highly regulated industries (healthcare, financial services), FLS enforcement in every `@AuraEnabled` method is a compliance requirement, not just a best practice.
- The Shield Platform Encryption feature adds another layer — fields encrypted at rest may still be accessible in Apex even without FLS. Encryption + FLS + sharing must all be evaluated together.

**For CTO conversations:**
- "We passed AppExchange Security Review but our customer's security team has concerns." — Security Review checks for obvious vulnerabilities (SOQL injection, missing sharing keywords). A thorough review also checks field-level sensitivity exposure, admin-accessible data in public components, and API-accessible endpoints.
- "How do we prevent a misconfigured profile from seeing sensitive data through our managed package?" — `with sharing` on all user-facing classes + `stripInaccessible()` on all query results + `WITH SECURITY_ENFORCED` on SOQL where applicable.

## Architecture / How It Works

```
APEX SECURITY ENFORCEMENT LAYERS

  Running User (Sales Rep — private OWD, no AnnualRevenue FLS)
           │
           ▼  calls Apex method
  ┌──────────────────────────────────────────────────────────┐
  │  Apex Class (with sharing)                               │
  │                                                          │
  │  Layer 1: SHARING RULES                                  │
  │  with sharing → SOQL returns ONLY user-accessible records │
  │                                                          │
  │  Layer 2: FLS (must be explicit)                         │
  │  stripInaccessible(READABLE, results) →                  │
  │  removes AnnualRevenue from results                      │
  │                                                          │
  │  Layer 3: CRUD (must be explicit)                        │
  │  Schema.SObjectType.Account.isAccessible() check         │
  └──────────────────────────────────────────────────────────┘
           │
           ▼  data returned to LWC
  User sees: only their accounts, without AnnualRevenue field
```

**Limitations:**
- `with sharing` enforces sharing rules (record visibility) — it does NOT enforce CRUD or FLS
- FLS and CRUD checks must be explicitly coded — no automatic enforcement in Apex
- `inherited sharing` defaults to system context when called from a context with no sharing declaration (e.g., Batch start/finish, anonymous Apex)

```
SHARING KEYWORD DECISION MATRIX

  Who calls this class?           Recommended keyword
  ────────────────────────────    ────────────────────────────
  LWC / VF user-facing UI         with sharing
  @AuraEnabled REST endpoint      with sharing
  Administrative batch job        without sharing (explicit, documented)
  Reusable service / utility      inherited sharing
  Background scheduled job        without sharing (explicit)
  Trigger handler                 with sharing (usually)

  RULE: Default to with sharing.
        Use without sharing only with written justification.
        Use inherited sharing for utility classes.
```

**Limitations:**
- A class declared `without sharing` called from `with sharing` code still bypasses sharing — the keyword is per-class, not inherited unless `inherited sharing` is used
- `with sharing` only enforces record-level security; field-level security is always a separate check

```
SOQL INJECTION ATTACK vs DEFENSE

  ATTACK (vulnerable code):
  ─────────────────────────
  userInput = "' OR Name != '"   ← malicious input

  query = "SELECT Id FROM Account WHERE Name = '" + userInput + "'"

  Executed: SELECT Id FROM Account WHERE Name = '' OR Name != ''
            └── returns ALL Accounts (WHERE is always true)

  DEFENSE (bind variable):
  ─────────────────────────
  [SELECT Id FROM Account WHERE Name = :userInput]

  Executed with userInput as literal string value:
  WHERE Name = ''' OR Name != '''    ← the single quotes are part of the value
  └── returns 0 results (no Account named that literal string)
  └── injection attempt completely neutralized
```

**Limitations:**
- Bind variables can only be used in static SOQL — not in strings passed to `Database.query()`
- For `Database.query()` (dynamic SOQL), `String.escapeSingleQuotes()` must be used
- `String.escapeSingleQuotes()` only escapes single quotes — does not protect against all injection patterns; bind variables are always preferred

```
FLS ENFORCEMENT: WITH SECURITY_ENFORCED vs stripInaccessible()

  WITH SECURITY_ENFORCED                stripInaccessible()
  ──────────────────────────────        ─────────────────────────────────
  Throws QueryException if              Silently removes inaccessible fields
  any field is inaccessible             Records still returned (minus fields)

  Simple syntax, inline in SOQL         Requires additional code (two lines)

  Does NOT work with:                   Works with all query types including
  - GROUP BY / HAVING                   aggregates (on the result set)
  - COUNT() aggregates

  Best for: simple read queries         Best for: complex queries, partial
  where you want hard failure           field access, returning safe records
  on any FLS violation
```

**Limitations:**
- Neither approach covers sharing rule enforcement — that requires `with sharing`
- `stripInaccessible()` does not strip fields from records before they are written — use CREATABLE/UPDATABLE `AccessType` for write operations

## Key Facts to Memorize
- No sharing keyword = **system context** (equivalent to `without sharing`) — security risk
- `with sharing` = sharing rules enforced; CRUD/FLS still need explicit checks
- `inherited sharing` = delegates to calling context; defaults to system if no declaration in call chain
- CRUD check: `Schema.SObjectType.Account.isAccessible()` / `.isCreateable()` / `.isUpdateable()` / `.isDeletable()`
- FLS check: `Schema.SObjectType.Account.fields.AnnualRevenue.isAccessible()`
- `Security.stripInaccessible(AccessType.READABLE, records)` — silently strips inaccessible fields
- `WITH SECURITY_ENFORCED` — throws `QueryException` on FLS violation; does NOT work with GROUP BY
- Bind variable (`:varName`) = SOQL injection prevention; `escapeSingleQuotes()` = fallback for dynamic queries

## Customer Advisory Tips
- **Security by default:** Every new class should start with `with sharing`. Changing to `without sharing` should require a comment explaining why. This code review standard prevents the most common Salesforce security vulnerabilities.
- **AppExchange Security Review prep:** ISV partners should run the Salesforce Security Source Scanner (`sf scanner`) in CI to catch missing sharing keywords, hardcoded credentials, and SOQL injection before the review.
- **stripInaccessible in all @AuraEnabled methods:** For any `@AuraEnabled` method that returns records to a component, `stripInaccessible(AccessType.READABLE, results)` before returning is non-negotiable. Users accessing the component API directly (via dev tools) can see everything the method returns.
- **Apex vs Flow security model:** Flows run in system context unless the flow is user-launched (which runs as the running user). This mirrors the `without sharing` default for Apex — the same deliberateness is required.

## Exam Traps
- Omitting sharing keyword does NOT default to `with sharing` — it defaults to **system context** (no sharing enforcement)
- `with sharing` enforces sharing rules (record visibility) but does NOT check CRUD or FLS — these are always separate explicit checks
- `WITH SECURITY_ENFORCED` throws an exception; `stripInaccessible()` silently strips — the question will test whether you know which behavior is which
- `inherited sharing` called from anonymous Apex or Batch start/finish → system context (no sharing declaration in that context)
- Bind variables (`:var`) prevent SOQL injection; `String.escapeSingleQuotes()` is the fallback — NOT the primary defense

## Practice Questions

**Q:** A class has no sharing keyword. What sharing behavior does it have?
**A:** System context — equivalent to `without sharing`. All records are accessible regardless of the running user's sharing access. This is the dangerous default that should always be overridden with an explicit keyword.

**Q:** A developer calls `stripInaccessible(AccessType.READABLE, accounts)`. What does it return?
**A:** An `SObjectAccessDecision` object. Call `.getRecords()` to get the list with inaccessible field values removed. Records are still returned — only the field values the user cannot read are stripped.

**Q:** `WITH SECURITY_ENFORCED` is added to a SOQL query using `GROUP BY`. What happens?
**A:** A `QueryException` is thrown at query time because `WITH SECURITY_ENFORCED` does not support aggregate queries. Use `stripInaccessible()` on the AggregateResult instead.

**Q:** A user inputs `' OR Name != '` into a search field. The Apex uses `Database.query('SELECT Id FROM Account WHERE Name = \'' + userInput + '\''`). What is the impact?
**A:** SOQL injection — the query becomes `WHERE Name = '' OR Name != ''` which is always true and returns all Account records. Fix: use `String.escapeSingleQuotes(userInput)` or redesign to use a static SOQL with a bind variable.
