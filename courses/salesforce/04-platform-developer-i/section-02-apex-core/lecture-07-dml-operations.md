# Lecture 07: DML Operations

## Learning Objectives
- Use all six DML statements: insert, update, upsert, delete, undelete, and merge
- Compare DML statement syntax versus Database class methods and explain the allOrNone parameter
- Interpret SaveResult, UpsertResult, and DeleteResult objects for partial-success error handling
- Identify external ID fields and use them with upsert operations

## Slides

### Slide 1: DML — Writing Data to Salesforce
**Visual:** Overview diagram showing the six DML verbs (insert, update, upsert, delete, undelete, merge) with arrows indicating which operations write new records, modify existing, or change record state, arranged in a circular lifecycle.
**Content:**
- DML = Data Manipulation Language — how Apex writes data to the Salesforce database
- Six DML operations: **insert, update, upsert, delete, undelete, merge**
- Can operate on a **single sObject** or a **List<sObject>** (bulk DML — preferred)
- Always operate on the **same object type** in one DML call
- After a successful `insert`, the `Id` field is populated on the sObject in memory
- DML triggers **triggers, workflow rules, validation rules, flows** — full platform event cycle
**Speaker Notes:** DML operations are the write counterpart to SOQL queries. Every time you insert, update, or delete a record through Apex, you use a DML statement. A critical point: DML calls fire the full Salesforce platform event cycle — triggers, workflow rules, process builder, flows, and validation rules all execute. This is different from the Bulk API's bypass modes and can be a source of unexpected behavior.

### Slide 2: insert and update
**Visual:** Two code panels showing: (1) insert of a new Account with fields set before the insert, then Id accessed after; (2) update of an Account queried from the database with a field modified, then updated in bulk.
**Content:**
- **insert:** Creates new records; populates `Id` on the sObject after success
```apex
Account acc = new Account(Name = 'New Corp', Industry = 'Technology');
insert acc;
System.debug('New Id: ' + acc.Id); // Id is now populated
```
- **update:** Modifies existing records; **requires Id to be set** on each sObject
```apex
acc.AnnualRevenue = 5000000;
update acc;
```
- **Bulk insert/update:** Pass a `List<sObject>` — single DML statement, counts as 1 toward the 150 limit
```apex
insert myAccountList; // inserts all accounts in one DML statement
```
- Can only update records you have queried or that have Ids assigned
**Speaker Notes:** For update, the Id field must be set on the record. If you create a new Account in memory (without querying it), set all the fields you want, and then call update without setting an Id, you will get a DML exception. Always query existing records before updating them, or construct them with the Id field explicitly set. Bulk DML is always preferred — one DML statement for 200 records counts as just one statement against the 150-DML limit.

### Slide 3: upsert — Insert or Update
**Visual:** Flowchart showing upsert decision logic: "Does a record with this Id/External Id already exist?" → Yes: UPDATE the existing record → No: INSERT a new record. Below, an example showing upsert with an external ID field.
**Content:**
- **upsert:** Inserts if no matching record exists; updates if a match is found
- Match determined by: `Id` field (default), or a designated **External ID field**
- External ID: a custom field marked as "External ID" in field settings
```apex
Account acc = new Account(
    External_Id__c = 'EXT-001',
    Name = 'Acme Corp'
);
upsert acc Account.External_Id__c; // match on External_Id__c field
```
- Without specifying a field: `upsert acc;` matches on Salesforce `Id`
- **UpsertResult** object reports whether a record was inserted or updated
- Maximum 200 records per upsert call in one DML statement
**Speaker Notes:** Upsert is most valuable in data integration scenarios. When you receive records from an external system, you often do not know if the record already exists in Salesforce. Rather than querying first (using up a SOQL query), then deciding to insert or update, you use upsert with an External ID — a field you define on the object that holds the external system's unique identifier. Salesforce matches on that field and automatically decides whether to create or update.

### Slide 4: delete and undelete
**Visual:** Diagram showing the Salesforce record lifecycle: Active record → delete → Recycle Bin (15 days, ISDELETED=true) → undelete (restore) or permanent deletion after 15 days. Shows the SOQL filter `ALL ROWS` to query deleted records.
**Content:**
- **delete:** Moves records to the Recycle Bin (soft delete); does not permanently delete
```apex
delete myAccountList; // records go to Recycle Bin
```
- Deleted records are queryable with `ALL ROWS` in SOQL:
  ```soql
  SELECT Id FROM Account WHERE IsDeleted = true ALL ROWS
  ```
- **undelete:** Restores records from the Recycle Bin
```apex
List<Account> deleted = [SELECT Id FROM Account WHERE IsDeleted = true ALL ROWS];
undelete deleted;
```
- Records stay in Recycle Bin for **15 days** before permanent deletion
- Cascade delete: deleting a parent also deletes child records on cascade-delete relationships
**Speaker Notes:** The distinction between soft delete and hard delete is important for the exam. When you call `delete`, the record goes to the Recycle Bin — it still exists, it just has IsDeleted set to true. You can query deleted records using the `ALL ROWS` qualifier, and you can restore them with `undelete`. After 15 days in the Recycle Bin (or if manually emptied), the deletion is permanent and undelete is no longer possible.

### Slide 5: merge
**Visual:** Diagram showing three duplicate Account records merging into one master record, with related Contact records reattached to the master, and the two duplicate records deleted.
**Content:**
- **merge:** Merges up to **3 records** of the same type into a master record; deletes duplicates
- Supported only for: **Account, Contact, Lead, Case** (standard objects only)
- Related records are reparented to the master record
```apex
Account master = [SELECT Id FROM Account WHERE Name = 'Acme Corp' LIMIT 1];
Account dup1 = [SELECT Id FROM Account WHERE Name = 'Acme' LIMIT 1];
Account dup2 = [SELECT Id FROM Account WHERE Name = 'ACME Corp' LIMIT 1];
merge master new List<Account>{dup1, dup2};
```
- Merged (duplicate) records are deleted and moved to Recycle Bin
- **Cannot be undone easily** — merged records lose unique field values on duplicates
**Speaker Notes:** Merge is a specialized operation for deduplication. The exam tests whether you know it is limited to Account, Contact, Lead, and Case objects only. You specify one master record and up to two duplicate records. The master keeps its fields; the duplicates are deleted. All related records (Contacts, Opportunities under an Account) are automatically reparented to the master. This is powerful but irreversible without careful audit logging.

### Slide 6: Database Class Methods — allOrNone
**Visual:** Side-by-side code showing DML statement `insert myList` (throws exception on any failure) vs `Database.insert(myList, false)` (processes all records, returns SaveResult array with per-record success/failure indicators).
**Content:**
- **DML statement:** All-or-nothing — any failure rolls back the entire operation and throws `DmlException`
- **Database class methods:** `Database.insert()`, `Database.update()`, `Database.upsert()`, `Database.delete()`
- **`allOrNone` parameter:**
  - `Database.insert(records, true)` — same as DML statement (throws on failure)
  - `Database.insert(records, false)` — partial success allowed; failures reported per record
- Returns `Database.SaveResult[]` (insert/update), `Database.UpsertResult[]`, `Database.DeleteResult[]`
```apex
List<Database.SaveResult> results = Database.insert(accountList, false);
for (Database.SaveResult sr : results) {
    if (!sr.isSuccess()) {
        for (Database.Error err : sr.getErrors()) {
            System.debug('Error: ' + err.getMessage());
        }
    }
}
```
**Speaker Notes:** The allOrNone parameter is the critical difference between DML statements and Database class methods. When allOrNone is false, Salesforce processes each record independently — some can succeed while others fail. The failed records do not cause a rollback; you simply check the result objects and handle errors per record. This is essential when loading large data sets where you want to save as many records as possible and log the failures rather than rolling back everything.

### Slide 7: SaveResult, UpsertResult, and DeleteResult
**Visual:** UML-style diagram showing the SaveResult class with its methods: isSuccess(), getId(), getErrors() → Database.Error with getMessage() and getStatusCode(). Below, UpsertResult adds isCreated() method. DeleteResult mirrors SaveResult structure.
**Content:**
- **Database.SaveResult** (insert / update):
  - `isSuccess()` → Boolean
  - `getId()` → Id of saved record
  - `getErrors()` → `List<Database.Error>`
- **Database.UpsertResult** (upsert):
  - Same as SaveResult plus `isCreated()` → true if inserted, false if updated
- **Database.DeleteResult** (delete):
  - `isSuccess()`, `getId()`, `getErrors()`
- **Database.Error** object:
  - `getMessage()` → human-readable error string
  - `getStatusCode()` → `System.StatusCode` enum (e.g., `FIELD_CUSTOM_VALIDATION_EXCEPTION`)
  - `getFields()` → `List<String>` of field API names involved in the error
**Speaker Notes:** The StatusCode enum on Database.Error is important for programmatic error handling. If the status code is FIELD_CUSTOM_VALIDATION_EXCEPTION, you know the record failed a validation rule. DUPLICATE_VALUE means a unique field constraint was violated. In error handling code, you often log these to a custom error log object so administrators can see exactly which records failed and why, and then fix and re-import them.

### Slide 8: DML Governor Limits and Best Practices
**Visual:** Limit meter showing 150 DML statements consumed by an anti-pattern (DML inside loop) vs the same operations consolidated into one bulk DML statement showing 1 DML used.
**Content:**
- **150 DML statements** per transaction (synchronous and asynchronous)
- **10,000 records** processed across all DML operations per transaction
- **NEVER put DML inside a loop** — collect changes in a List, bulk DML after the loop
- Use `Database.insert(list, false)` when partial success is acceptable
- Always handle `DmlException` when using DML statements:
```apex
try {
    insert newAccount;
} catch (DmlException e) {
    System.debug('DML failed: ' + e.getMessage());
}
```
- Set required fields before DML or catch the REQUIRED_FIELD_MISSING status code
**Speaker Notes:** Just as SOQL in loops burns the 100-query limit, DML in loops burns the 150-DML limit. The fix is identical: collect all records that need modification in a List during the loop, then call bulk DML once after the loop ends. For insert, this means building a list of new records and calling `insert myList`. For update, query first, modify in a loop, then update outside the loop.

## Recording Script
Welcome to Lecture 7 — DML Operations. If SOQL is how you read data, DML is how you write it. Today we cover all six DML operations and the important choice between DML statements and the Database class.

Let me start with the basics. You have six DML operations: insert, update, upsert, delete, undelete, and merge. Insert creates new records. After a successful insert, Salesforce populates the Id field on your sObject variable in memory — you do not need to re-query the record to get its Id. Update modifies existing records, but you must have the Id set on the record first.

Let's talk about upsert, because it is particularly powerful. Upsert means "insert or update" — if a matching record exists, update it; if not, create a new one. By default, the match is done on the record's Salesforce Id. But the real power is upsert with an External ID field. You define a custom field on your object and mark it as an External ID in the field settings. Then you can upsert records using that external field as the match criterion. This is essential for data integrations — when you receive records from an external system, you upsert using the external system's ID, and Salesforce figures out whether to create or update each record.

Delete moves records to the Recycle Bin — it is a soft delete. The records are still there, just marked with IsDeleted = true. You can query them with `ALL ROWS` in SOQL, and you can restore them with undelete. After 15 days, the Recycle Bin is automatically emptied and the records are permanently gone. Merge is specialized — it merges duplicate records and is only supported for Account, Contact, Lead, and Case.

Now the critical choice: DML statements versus Database class methods. When you write `insert myList`, Salesforce uses all-or-none semantics — if any record in the list fails, the entire operation is rolled back and a DmlException is thrown. This is safe but rigid.

When you use `Database.insert(myList, false)`, the `false` for `allOrNone` allows partial success. Records that fail are not inserted, but records that succeed are committed. No exception is thrown. Instead, you get back a List of SaveResult objects — one per record — that tell you which succeeded and which failed. You iterate the results, check `isSuccess()`, and handle failures individually. This is the right approach when you are loading data in bulk and want to save as many records as possible.

The governor limit is 150 DML statements per transaction. The same rule applies as with SOQL: never put DML inside a loop. Build your list of changes during the loop, then call bulk DML once after.

In the next lecture, we start combining everything we have learned — SOQL, DML, and Apex logic — inside Apex Triggers. See you there.

## Exam Tips
- After a successful `insert`, the **Id field is populated** on the sObject variable in memory — you can use it immediately without re-querying.
- `Database.insert(records, false)` allows **partial success** — some records can fail without rolling back the rest. The return value is `List<Database.SaveResult>`.
- The DML governor limit is **150 statements per transaction** — one bulk DML call on a List of 200 records counts as **one statement**.
- `merge` is supported only for **Account, Contact, Lead, and Case** — not for custom objects or other standard objects.
- `undelete` works only within **15 days** of deletion — after that, the Recycle Bin is automatically emptied and records are permanently deleted.

## Lecture Summary
Apex provides six DML operations — insert, update, upsert, delete, undelete, and merge — each with distinct semantics for record lifecycle management. DML statements use all-or-nothing semantics (any failure rolls back all), while Database class methods with `allOrNone = false` allow partial success with per-record SaveResult/UpsertResult/DeleteResult objects. Upsert with External ID fields enables efficient data integration without prior SOQL lookups, and bulk DML on Lists keeps DML statement count within the 150-statement governor limit.

## Mini Quiz

**Q1:** A developer calls `Database.insert(contactList, false)` where contactList contains 50 records. 3 records fail due to validation rule errors. What happens?
A) All 50 records are rolled back because 3 failed
B) A DmlException is thrown and nothing is inserted
C) 47 records are inserted successfully; 3 fail; the method returns a List<Database.SaveResult> with status for each record
D) The failed records are automatically retried after fixing validation errors
**Answer:** C — With `allOrNone = false`, Database.insert processes each record independently. Records that pass validation are committed; those that fail are not. No exception is thrown. The List<Database.SaveResult> contains one result per record, with `isSuccess() = false` for the 3 failed records.

**Q2:** A developer needs to synchronize Account records from an external CRM that uses its own ID system. Each Account has an `External_CRM_Id__c` custom field marked as External ID. Which DML operation most efficiently handles records that may or may not already exist in Salesforce?
A) Delete existing records and re-insert all records
B) Query all existing records first, then decide whether to insert or update each one
C) Use `upsert accountList Account.External_CRM_Id__c;`
D) Use `merge` to combine the external records with existing Salesforce records
**Answer:** C — Upsert with an External ID field is exactly designed for this use case. Salesforce matches each record against the external ID field and automatically inserts or updates as needed. This eliminates the need for a preliminary SOQL query to check existence.

**Q3:** What is the governor limit for DML statements per synchronous Apex transaction?
A) 100 statements
B) 150 statements
C) 200 statements
D) 10,000 statements
**Answer:** B — The DML statement limit is 150 per transaction for both synchronous and asynchronous contexts. Note that one bulk DML call on a List of 200 records still counts as just one statement. The 10,000 limit is for total records processed across all DML operations, not the number of statements.
