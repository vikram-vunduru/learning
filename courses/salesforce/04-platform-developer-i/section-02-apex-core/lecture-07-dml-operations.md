# DML Operations

## Exam Domain
Process Automation & Logic — 30% of exam weight

## Core Concepts

### The Six DML Operations
| Operation | What It Does |
|-----------|-------------|
| `insert` | Creates new records; populates Id on sObject in memory after success |
| `update` | Modifies existing records; Id must be set on each sObject |
| `upsert` | Insert or update based on Id or External ID field |
| `delete` | Soft-deletes to Recycle Bin (IsDeleted=true); reversible for 15 days |
| `undelete` | Restores records from Recycle Bin |
| `merge` | Merges 2–3 duplicate records; Account/Contact/Lead/Case only |

DML triggers the full Salesforce platform event cycle: triggers, validation rules, workflow, flows, assignment rules.

### insert and update
```apex
// insert — Id populated after success
Account acc = new Account(Name = 'New Corp', Industry = 'Technology');
insert acc;
System.debug(acc.Id); // populated in memory — no re-query needed

// update — requires Id to be set
acc.AnnualRevenue = 5000000;
update acc;

// Bulk DML — always preferred; counts as 1 DML statement
insert myAccountList;
```

### upsert — Insert or Update
Matches on Salesforce Id (default) or a custom External ID field. Essential for data integration — no need to query first to check existence.
```apex
Account acc = new Account(
    External_Id__c = 'EXT-001',
    Name = 'Acme Corp'
);
upsert acc Account.External_Id__c;  // match on External_Id__c
```

### delete, undelete, Recycle Bin
Deleted records stay in Recycle Bin 15 days. Query with `ALL ROWS` and `WHERE IsDeleted = true`.
```apex
delete myAccountList;  // → Recycle Bin

List<Account> deleted = [SELECT Id FROM Account WHERE IsDeleted = true ALL ROWS];
undelete deleted;
```

### merge — Duplicate Management
Merges up to 3 records of the same object into a master. Related records are reparented to master. Duplicates are deleted. **Supported only for Account, Contact, Lead, Case** — not custom objects.
```apex
merge masterAccount new List<Account>{dup1, dup2};
```

### DML Statements vs Database Class — allOrNone
| Approach | On failure |
|----------|-----------|
| `insert myList;` | All-or-nothing — any failure rolls back ALL, throws DmlException |
| `Database.insert(myList, false)` | Partial success — failures don't roll back successes |
| `Database.insert(myList, true)` | Same as DML statement |

```apex
List<Database.SaveResult> results = Database.insert(accountList, false);
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        for (Database.Error err : sr.getErrors()) {
            System.debug(err.getStatusCode() + ': ' + err.getMessage());
        }
    }
}
```

### Result Objects
- `Database.SaveResult` — insert/update: `isSuccess()`, `getId()`, `getErrors()`
- `Database.UpsertResult` — same + `isCreated()` (true = inserted, false = updated)
- `Database.DeleteResult` — `isSuccess()`, `getId()`, `getErrors()`
- `Database.Error` — `getMessage()`, `getStatusCode()`, `getFields()`

## PTA / SA Relevance

**In partner code reviews, watch for:**
- DML inside loops — same as SOQL-in-loop but hits the 150-DML limit instead of 100-SOQL. Collect into List, DML after loop.
- Using `insert` (all-or-nothing) in integration code that processes mixed-validity records — use `Database.insert(list, false)` for bulk integrations where partial success is acceptable.
- Missing error handling after `Database.insert(list, false)` — partial failure silently swallowed is worse than crashing. Log failed records to a custom Error_Log__c object.
- Merge on custom objects — will fail at compile time. Only Account/Contact/Lead/Case.

**Enterprise-scale considerations:**
- In high-volume integrations, `Database.insert(list, false)` combined with a custom error log object is the standard pattern. Enables retry logic for failed records.
- The DML row limit (10,000 per transaction) is often more constraining than the statement limit (150). A single `insert bigList` with 10,001 records will fail with a limit exception.
- Upsert with External ID is the backbone of integration architecture — define external IDs on every object that syncs with external systems. This eliminates need for pre-query lookups.
- For Salesforce-to-Salesforce sync patterns, upsert on Salesforce record ID works across connected orgs.

**For CTO conversations:**
- "Can we avoid duplicates without querying first?" — Yes, External ID + upsert is exactly this. Define the external ID field, mark it as External ID and Unique in field settings, upsert with that field. Zero pre-queries needed.
- "What happens if our integration fails halfway through?" — With `allOrNone = false`, you get partial success. Your integration needs to log and retry failures. Platform Events or Queueable chains can add reliability.

## Architecture / How It Works

```
DML OPERATION DECISION TREE

  Need to write data?
        │
  ┌─────┴──────┐
  New record?  Existing?  Don't know?
       │            │           │
    insert       update       upsert
    (Id auto-    (Id must    (External ID
     populated)   be set)    or Salesforce Id)
        │            │           │
        └────────────┴───────────┘
                     │
           All-or-nothing needed?
           ┌─────────┴──────────┐
          Yes                   No
     DML statement         Database.insert(list, false)
    insert myList          → partial success allowed
    (throws DmlException)  → returns SaveResult[]
```

**Limitations:**
- DML statements: 150 per transaction (sync and async)
- DML rows: 10,000 per transaction (sync and async)
- One bulk DML call counts as 1 statement regardless of list size
- Upsert external ID field must be marked as External ID in field settings

```
allOrNone BEHAVIOR

  allOrNone = true (default DML statement):
  ┌──────────────────────────────────────────────────┐
  │  Records: [Valid, Valid, INVALID, Valid, Valid]   │
  │                           ↑                      │
  │  Result: ALL ROLLED BACK ─┘                      │
  │          DmlException thrown                     │
  │          0 records committed                     │
  └──────────────────────────────────────────────────┘

  allOrNone = false (Database.insert with false):
  ┌──────────────────────────────────────────────────┐
  │  Records: [Valid, Valid, INVALID, Valid, Valid]   │
  │                           ↑                      │
  │  Result: 4 committed      │  1 failed             │
  │          No exception thrown                     │
  │          SaveResult[2].isSuccess() = false        │
  └──────────────────────────────────────────────────┘
```

**Limitations:**
- With `allOrNone = false`, failed records are NOT rolled back — they simply aren't committed; successful records ARE saved even if others fail
- `merge` only: no Database.merge() method — always all-or-nothing

```
POST-INSERT Id POPULATION

  Before insert:
  ┌──────────────────────────────────────┐
  │  Account a = new Account();          │
  │  a.Name = 'Acme';                    │
  │  System.debug(a.Id);  // → null      │
  └──────────────────────────────────────┘
        │
        ▼ insert a;
  ┌──────────────────────────────────────┐
  │  System.debug(a.Id);  // → 001xx...  │
  │  ← Id populated in memory by DML     │
  │  ← No re-query required              │
  └──────────────────────────────────────┘
```

**Limitations:**
- Only insert populates Id in memory — upsert does not update non-Id fields on the in-memory object after upsert
- UpsertResult.isCreated() is the only way to know if upsert did an insert vs update

## Key Facts to Memorize
- After `insert`, Id is **populated in memory** — no re-query needed
- `update` requires Id to be set on the sObject first
- `upsert` with External ID: `upsert myList ObjectName.External_Field__c`
- `merge` supported only for **Account, Contact, Lead, Case**
- Deleted records in Recycle Bin for **15 days**; query with `ALL ROWS`
- `Database.insert(list, false)` → partial success; returns `List<Database.SaveResult>`
- DML limit: **150 statements**, **10,000 rows** per transaction
- One bulk DML call on a List = **1 statement** regardless of list size

## Customer Advisory Tips
- **Integration architecture:** Always define External ID fields on objects that sync with external systems. Enables upsert without pre-query.
- **Data migration:** Use `Database.insert(list, false)` for large migrations. Log failures to a custom error object. Retry failed records after fixing data issues.
- **When to use Flow vs Apex DML?** Flow is better for simple record creation/updates driven by user actions. Apex DML is needed for complex bulk processing, integration payloads, cross-object logic that exceeds Flow's expression capabilities, or when you need `allOrNone = false` semantics.

## Exam Traps
- After `insert acc`, the `Id` field is populated on the in-memory sObject — exam may ask if a re-query is needed
- `merge` does NOT work on custom objects — compile error or runtime error
- DML statement limit is **150** (not 100 — that's SOQL)
- `allOrNone = false` does NOT mean "rollback only failures" — it means successful records ARE committed even when some fail
- `undelete` requires records to still be in Recycle Bin (within 15 days)
- `Database.UpsertResult.isCreated()` — only this tells you if upsert did an insert vs update

## Practice Questions

**Q:** A developer calls `Database.insert(contactList, false)` with 50 records; 3 fail validation. What happens?
**A:** 47 records are inserted. 3 fail. No exception is thrown. The returned `List<Database.SaveResult>` has `isSuccess() = false` for the 3 failed records. Iterate the results to log errors.

**Q:** An integration syncs Account records from an external system. Each Account has an `ERP_Id__c` External ID field. Which DML operation avoids the need to query first?
**A:** `upsert accountList Account.ERP_Id__c;` — Salesforce matches on ERP_Id__c and inserts or updates accordingly.

**Q:** What is the DML governor limit for statements per synchronous transaction?
**A:** 150 DML statements. One bulk call `insert myList` counts as 1 statement regardless of list size. The row limit is separate: 10,000 records total.
