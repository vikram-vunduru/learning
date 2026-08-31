# PDI Cheat Sheet — Platform Developer I (CRT-450)

## Exam Quick Facts

| Field | Detail |
|-------|--------|
| Exam Code | CRT-450 |
| Questions | 60 |
| Time | 110 minutes |
| Passing Score | 65% (39/60) |
| Cost | $200 USD |
| Format | Multiple choice + multi-select |
| Delivery | Online proctored or test center |

---

## Exam Topic Weights

| Topic | Weight | Questions (of 60) |
|-------|--------|-------------------|
| Developer Fundamentals | 23% | ~14 |
| Process Automation & Logic | 30% | ~18 |
| User Interface | 25% | ~15 |
| Testing, Debugging & Deployment | 22% | ~13 |

---

## Governor Limits

### Synchronous Limits

| Resource | Limit |
|----------|-------|
| SOQL queries | 100 |
| SOQL rows returned | 50,000 |
| SOQL rows via `Database.getQueryLocator` | 10,000 |
| DML statements | 150 |
| DML rows | 10,000 |
| Heap size | 6 MB |
| CPU time | 10,000 ms |
| HTTP callouts | 100 |
| `@future` calls | 50 |
| Push notification callouts | 10 |
| Email invocations | 10 |
| SOSL queries | 20 |
| SOSL rows returned | 2,000 |

### Asynchronous Limits (Batch, Queueable, Future, Scheduled)

| Resource | Limit |
|----------|-------|
| SOQL queries | 200 |
| SOQL rows returned | 50,000 |
| DML statements | 150 |
| DML rows | 10,000 |
| Heap size | 12 MB |
| CPU time | 60,000 ms |
| HTTP callouts | 100 |

> **Memory tip:** Async doubles SOQL queries (200) and heap (12 MB) and CPU (60s). DML stays the same (150 / 10,000).

---

## Apex Syntax Quick Reference

### Collections

```apex
// List — ordered, allows duplicates
List<String> names = new List<String>{'Alice', 'Bob'};
names.add('Carol');
names.size();          // 3
names.get(0);          // 'Alice'
names.remove(1);       // removes 'Bob'

// Set — unordered, no duplicates
Set<Id> accountIds = new Set<Id>();
accountIds.add(someId);
accountIds.contains(someId);   // true

// Map — key-value pairs
Map<Id, Account> accMap = new Map<Id, Account>(
    [SELECT Id, Name FROM Account]
);
accMap.get(someId);            // Account record
accMap.keySet();               // Set<Id>
accMap.values();               // List<Account>
accMap.containsKey(someId);    // Boolean
```

### Access Modifiers

| Modifier | Scope |
|----------|-------|
| `private` | Declaring class only (default for inner class members) |
| `protected` | Declaring class + subclasses |
| `public` | All code in the same namespace |
| `global` | All code, including external packages |

### OOP Keywords

| Keyword | Purpose |
|---------|---------|
| `virtual` | Class/method can be extended/overridden |
| `abstract` | Class cannot be instantiated; may have abstract methods |
| `override` | Overrides a parent virtual or abstract method |
| `extends` | Inherits from a class |
| `implements` | Implements an interface |
| `interface` | Defines method signatures (no implementation) |
| `final` | Variable cannot be reassigned (constant) |
| `static` | Belongs to class, not instance |
| `transient` | Excluded from Visualforce view state |

---

## SOQL Cheat Sheet

### Basic Patterns

```apex
// Basic query
List<Account> accs = [SELECT Id, Name FROM Account WHERE Industry = 'Tech'];

// Parent-to-child (subquery)
List<Account> accs = [
    SELECT Id, Name, (SELECT Id, LastName FROM Contacts)
    FROM Account
    WHERE Name LIKE 'Acme%'
];
// Access child records: for (Contact c : acc.Contacts) { }

// Child-to-parent (dot notation)
List<Contact> contacts = [
    SELECT Id, LastName, Account.Name, Account.Industry
    FROM Contact
    WHERE Account.Industry = 'Technology'
];

// Aggregate functions
List<AggregateResult> results = [
    SELECT Industry, COUNT(Id) cnt
    FROM Account
    GROUP BY Industry
];
Integer cnt = (Integer) results[0].get('cnt');

// Variable binding (colon syntax)
String targetIndustry = 'Technology';
List<Account> accs = [SELECT Id FROM Account WHERE Industry = :targetIndustry];

// Limit and Offset
List<Account> accs = [SELECT Id FROM Account ORDER BY Name LIMIT 10 OFFSET 20];
```

### Date Literals

| Literal | Meaning |
|---------|---------|
| `TODAY` | Current day |
| `YESTERDAY` | Previous day |
| `LAST_WEEK` | Previous Sun–Sat week |
| `THIS_MONTH` | Current calendar month |
| `LAST_MONTH` | Previous calendar month |
| `LAST_YEAR` | Previous calendar year |
| `LAST_N_DAYS:n` | Last n days (including today) |
| `NEXT_N_DAYS:n` | Next n days |

### SOQL For Loop — Heap Optimization

```apex
// Standard — loads all records into heap at once
List<Account> all = [SELECT Id FROM Account];  // risky for large data

// SOQL for loop — processes 200 records at a time (chunked)
for (List<Account> chunk : [SELECT Id FROM Account]) {
    // each chunk = up to 200 records; stays within heap
}

// Single-record iteration — still loads all into memory before iterating
for (Account a : [SELECT Id FROM Account]) { }
```

> Use the **list-based** SOQL for loop when processing large data sets to avoid heap governor violations.

---

## DML Cheat Sheet

### DML Statements vs Database Methods

| Operation | DML Statement | Database Method |
|-----------|--------------|-----------------|
| Insert | `insert records;` | `Database.insert(records, allOrNone)` |
| Update | `update records;` | `Database.update(records, allOrNone)` |
| Delete | `delete records;` | `Database.delete(records, allOrNone)` |
| Upsert | `upsert records;` | `Database.upsert(records, extIdField, allOrNone)` |
| Undelete | `undelete records;` | `Database.undelete(records, allOrNone)` |
| Merge | `merge master dupes;` | `Database.merge(master, dupes, allOrNone)` |

- **DML statements** are all-or-none by default — one failure rolls back all.
- **Database methods** with `allOrNone=false` allow partial success.

### SaveResult Pattern (Partial Success)

```apex
List<Database.SaveResult> results = Database.insert(records, false);
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        for (Database.Error err : sr.getErrors()) {
            System.debug('Error: ' + err.getMessage());
        }
    }
}
```

---

## Trigger Context Variables

| Variable | Type | Available In |
|----------|------|--------------|
| `Trigger.new` | `List<sObject>` | before/after insert, before/after update, after undelete |
| `Trigger.old` | `List<sObject>` | before/after update, before/after delete |
| `Trigger.newMap` | `Map<Id, sObject>` | before update, after insert, after update, after undelete |
| `Trigger.oldMap` | `Map<Id, sObject>` | before/after update, before/after delete |
| `Trigger.isBefore` | `Boolean` | all contexts |
| `Trigger.isAfter` | `Boolean` | all contexts |
| `Trigger.isInsert` | `Boolean` | all contexts |
| `Trigger.isUpdate` | `Boolean` | all contexts |
| `Trigger.isDelete` | `Boolean` | all contexts |
| `Trigger.isUndelete` | `Boolean` | all contexts |
| `Trigger.size` | `Integer` | all contexts |

> **Key rule:** `Trigger.new` is null in DELETE triggers. `Trigger.old` is null in INSERT triggers.

### addError() in Triggers

```apex
// Prevent a single record from being saved
trigger AccountTrigger on Account (before insert) {
    for (Account a : Trigger.new) {
        if (a.AnnualRevenue == null) {
            a.addError('Annual Revenue is required.');
        }
    }
}
```

---

## Key Annotations

| Annotation | Purpose |
|------------|---------|
| `@isTest` | Marks a test class or test method |
| `@testSetup` | Runs once before all tests; creates shared data |
| `@AuraEnabled` | Exposes method to LWC/Aura components |
| `@AuraEnabled(cacheable=true)` | Required for `@wire` service; read-only |
| `@future` | Asynchronous method (primitive params only) |
| `@future(callout=true)` | Async method that makes HTTP callouts |
| `@InvocableMethod` | Exposes method to Flow, Process Builder |
| `@InvocableVariable` | Marks a variable in an `@InvocableMethod` parameter class |
| `@RemoteAction` | Exposes static method to JavaScript in Visualforce |
| `@ReadOnly` | Allows read of up to 1M rows (no DML allowed) |
| `@deprecated` | Marks method/class as deprecated in managed packages |

---

## Async Apex Comparison

| Type | Use Case | Parameters | Key Limit | Chaining |
|------|----------|------------|-----------|---------|
| `@future` | Simple async, callouts from triggers, mixed DML avoidance | Primitives/collections of primitives only | 50 per transaction | No |
| `Queueable` | Complex objects, chaining jobs | Any type | 50 enqueued per transaction | Yes (1 child) |
| `Batch Apex` | Mass data (millions of records) | Any type | 5 concurrent batch jobs | Via `finish()` |
| `Scheduled Apex` | Time-based, recurring execution | Any type | 100 scheduled jobs | Via `System.scheduleBatch()` |

### Batch Apex Skeleton

```apex
global class MyBatch implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM Account');
    }
    global void execute(Database.BatchableContext bc, List<Account> scope) {
        // process scope (default 200, max 2000 records)
    }
    global void finish(Database.BatchableContext bc) {
        // called once after all batches complete
    }
}
// Execute: Database.executeBatch(new MyBatch(), 200);
```

### Queueable Skeleton

```apex
public class MyQueueable implements Queueable {
    public void execute(QueueableContext ctx) {
        // work here
        // chain: System.enqueueJob(new AnotherQueueable());
    }
}
// Enqueue: System.enqueueJob(new MyQueueable());
```

### Scheduled Apex Skeleton

```apex
global class MySchedulable implements Schedulable {
    global void execute(SchedulableContext ctx) {
        // work here
    }
}
// Schedule: System.schedule('Job Name', '0 0 2 * * ?', new MySchedulable());
// Cron: Seconds Minutes Hours Day_of_Month Month Day_of_Week (optional Year)
```

---

## Exception Handling

```apex
try {
    insert accounts;
} catch (DmlException e) {
    System.debug('DML Error: ' + e.getMessage());
    System.debug('Fields: ' + e.getDmlFields(0));
} catch (QueryException e) {
    System.debug('Query Error: ' + e.getMessage());
} catch (Exception e) {
    System.debug('General Error: ' + e.getMessage());
    System.debug('Stack: ' + e.getStackTraceString());
} finally {
    // always runs
}
```

### Common Exception Types

| Exception | When Thrown |
|-----------|------------|
| `DmlException` | DML operation fails |
| `QueryException` | SOQL returns 0 rows for single-record assignment |
| `ListException` | List index out of bounds |
| `NullPointerException` | Dereferencing a null variable |
| `LimitException` | Governor limit exceeded |
| `CalloutException` | HTTP callout fails |
| `JSONException` | JSON parsing error |

---

## Sharing Keywords

| Keyword | Behavior |
|---------|----------|
| `with sharing` | Enforces the running user's sharing rules (record-level access) |
| `without sharing` | Bypasses sharing rules; all records accessible |
| `inherited sharing` | Uses the sharing context of the calling class |
| _(no keyword)_ | Defaults to `without sharing` for most Apex; use explicit declarations |

> **Note:** Sharing keywords do NOT enforce field-level security (FLS) or CRUD permissions. Use `Schema.DescribeFieldResult` or `Security.stripInaccessible()` for FLS enforcement.

---

## SOSL Cheat Sheet

```apex
List<List<SObject>> results = [FIND 'Acme*' IN ALL FIELDS
    RETURNING Account(Id, Name), Contact(Id, LastName)];
List<Account> accounts = (List<Account>) results[0];
List<Contact> contacts = (List<Contact>) results[1];
```

| Clause | Options |
|--------|---------|
| `IN` | `ALL FIELDS`, `NAME FIELDS`, `EMAIL FIELDS`, `PHONE FIELDS` |
| `RETURNING` | Comma-separated object lists with optional field lists |
| Max rows returned | 2,000 total |

---

## Visualforce Quick Reference

### Key Components

| Component | Purpose |
|-----------|---------|
| `<apex:page>` | Root component; sets controller |
| `<apex:form>` | Required for POST actions (save, buttons) |
| `<apex:pageBlock>` | Styled section container |
| `<apex:pageBlockSection>` | Two-column section within pageBlock |
| `<apex:inputField>` | Editable field (respects field metadata) |
| `<apex:outputField>` | Read-only field |
| `<apex:commandButton>` | Button that submits form / calls action |
| `<apex:commandLink>` | Link that calls an action |
| `<apex:actionFunction>` | Exposes controller method to JavaScript |
| `<apex:repeat>` | Iterates over a collection |
| `<apex:outputPanel>` | Group of components (can be re-rendered) |
| `<apex:detail>` | Standard record detail view |
| `<apex:messages>` | Displays all page-level messages |
| `<apex:message>` | Displays field-level message |

### Controller Types

| Type | Use Case |
|------|----------|
| Standard Controller | Single-record CRUD with built-in actions |
| Standard List Controller | List views, mass actions |
| Custom Controller | Full custom logic, no standard actions |
| Controller Extension | Adds methods to standard or custom controller |

### View State

- **Limit:** 170 KB
- **Reduce by:** marking non-essential fields `transient`, avoiding large collections, using `<apex:outputPanel rendered="false">` to defer rendering
- Only applies to `<apex:form>` pages; read-only pages have no view state

---

## LWC Quick Reference

### Decorators

| Decorator | Purpose |
|-----------|---------|
| `@api` | Public property/method — settable by parent; required for `@wire` targets |
| `@track` | Deep reactivity for nested object/array mutations |
| `@wire` | Reactive data fetching from Salesforce data service or Apex |

### Template Directives

```html
<!-- Conditional rendering (API v55+) -->
<template lwc:if={isVisible}>
    <p>Visible content</p>
</template>
<template lwc:elseif={isOther}>...</template>
<template lwc:else>...</template>

<!-- List rendering -->
<template for:each={items} for:item="item" for:index="i">
    <p key={item.id}>{item.name}</p>
</template>

<!-- Iterator (access first/last) -->
<template iterator:it={items}>
    <li key={it.value.id}
        class={it.first ? 'first' : ''}>{it.value.name}</li>
</template>
```

### Wire Service

```javascript
import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { refreshApex } from '@salesforce/apex';

export default class MyComponent extends LightningElement {
    @wire(getAccounts, { industry: '$selectedIndustry' })
    wiredAccounts;  // { data, error }

    refresh() {
        // Refresh wired data after a DML operation
        refreshApex(this.wiredAccounts);
    }
}
```

> `$selectedIndustry` — prefixing a property with `$` makes it reactive; the wire is re-called when it changes.

### Event Pattern

```javascript
// Child: dispatch event
this.dispatchEvent(new CustomEvent('select', {
    detail: { id: this.recordId },
    bubbles: true,    // optional: propagate up DOM
    composed: true    // optional: cross shadow boundary
}));
```

```html
<!-- Parent: listen for event -->
<c-child onselect={handleSelect}></c-child>
```

```javascript
// Parent: handler
handleSelect(event) {
    const selectedId = event.detail.id;
}
```

### LWC Communication Patterns

| Direction | Mechanism |
|-----------|-----------|
| Parent → Child | `@api` property binding in parent template |
| Child → Parent | `CustomEvent` + `dispatchEvent()` |
| Unrelated components | Lightning Message Service (LMS) |
| Any component → Apex | `@wire` (reactive) or imperative import + call |

### LWC Component Bundle Files

| File | Required | Purpose |
|------|----------|---------|
| `name.html` | Yes | Template markup |
| `name.js` | Yes | JavaScript controller |
| `name.js-meta.xml` | Yes | Component configuration/targets |
| `name.css` | No | Scoped component styles |
| `name.svg` | No | Custom icon |
| `__tests__/name.test.js` | No | Jest unit tests |

---

## Testing Checklist

- [ ] All test classes annotated with `@isTest`
- [ ] All test methods annotated with `@isTest` (or `testMethod` keyword)
- [ ] 75% code coverage across all Apex classes/triggers (org-wide, not per-class)
- [ ] Use `@testSetup` for shared test data setup (runs once; rolled back per test)
- [ ] No `@isTest(SeeAllData=true)` — create all test data explicitly
- [ ] Wrap async calls (`@future`, Queueable, Batch) in `Test.startTest()` / `Test.stopTest()`
- [ ] Use `Test.setMock(HttpCalloutMock.class, mock)` for callout tests
- [ ] Bulk test with 200+ records (test trigger and class bulk safety)
- [ ] Test negative paths (invalid data, missing required fields, exception scenarios)
- [ ] Use `System.assert()`, `System.assertEquals()`, `System.assertNotEquals()` — never test without assertions
- [ ] Test both positive and governor-limit-safe scenarios

### Assert Methods

```apex
System.assert(condition);                    // passes if condition is true
System.assert(condition, 'message');         // with custom failure message
System.assertEquals(expected, actual);       // passes if equal
System.assertEquals(expected, actual, 'msg');
System.assertNotEquals(val1, val2);          // passes if NOT equal
```

---

## Deployment Quick Reference

### Tools Comparison

| Tool | Approach | Package.xml |
|------|----------|------------|
| Change Sets | UI-based, org-to-org | No |
| Salesforce CLI (`sf`) | Command-line, source-tracked | Yes (or source format) |
| Metadata API (Ant Tool) | XML-based, scriptable | Yes |
| VS Code + SFDX | IDE-integrated, source format | Yes |

### CLI Deploy Commands

```bash
# Deploy to org
sf project deploy start --source-dir force-app --target-org myOrg

# Retrieve from org
sf project retrieve start --source-dir force-app --target-org myOrg

# Run tests during deploy
sf project deploy start --source-dir force-app --test-level RunLocalTests
```

### Test Level Options

| `--test-level` | Behavior |
|----------------|---------|
| `NoTestRun` | No tests (sandbox only; not allowed in production) |
| `RunSpecifiedTests` | Only listed tests |
| `RunLocalTests` | All tests NOT from managed packages (default for production) |
| `RunAllTestsInOrg` | All tests including managed packages |

---

## Security Model

### Record-Level Security (Sharing)

| Level | Controls |
|-------|---------|
| OWD (Org-Wide Defaults) | Baseline access (Private, Public Read Only, Public Read/Write) |
| Sharing Rules | Extend access beyond OWD to groups/roles |
| Manual Sharing | User manually shares a record |
| Apex Managed Sharing | Code-driven sharing via `Share` objects |

### Object & Field Security

| Level | Setup Location |
|-------|---------------|
| Object CRUD | Permission Sets / Profiles |
| Field-Level Security (FLS) | Permission Sets / Profiles |
| Record access | OWD + Sharing Rules + Roles |

> Apex does NOT automatically enforce FLS. Use `WITH SECURITY_ENFORCED` in SOQL or `Security.stripInaccessible()` to enforce FLS in code.

```apex
// Enforce FLS in SOQL
List<Account> accs = [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED];

// Strip inaccessible fields
SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE, records
);
List<Account> safeRecords = (List<Account>) decision.getRecords();
```

---

## Common Exam Traps

| Topic | Trap |
|-------|------|
| `Trigger.new` in delete | NOT available — use `Trigger.old` |
| `Trigger.newMap` in before insert | NOT available before insert (no Id yet) — only available after insert |
| `@future` parameters | Must be primitives — cannot pass sObjects |
| `@AuraEnabled` vs `@AuraEnabled(cacheable=true)` | `cacheable=true` is required for `@wire`; regular `@AuraEnabled` for imperative calls with DML |
| `Database.insert(records, false)` | Does NOT throw exception on partial failure — check `SaveResult` |
| `allOrNone=true` vs DML statement | Both behave the same (all-or-none, throws on failure) |
| View state limit | 170 KB (not 15 KB or 100 KB) |
| 75% coverage | Measured org-wide, not per-class; but each class individually must have >= 1% to deploy |
| `Test.stopTest()` | Forces async to run synchronously — assert AFTER this call |
| `@testSetup` data | Is rolled back between each test method (fresh for each test) |
| `inherited sharing` | Takes sharing context from the caller — safest default when uncertain |
| Batch max size | 2,000 (not 200; 200 is the default) |
| Scheduled jobs limit | 100 concurrent scheduled jobs |
| `refreshApex()` | Only works with wired properties, not imperative calls |
| `with sharing` and FLS | `with sharing` does NOT enforce FLS — they are separate mechanisms |
