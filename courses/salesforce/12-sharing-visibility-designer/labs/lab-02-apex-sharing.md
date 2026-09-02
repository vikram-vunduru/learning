# Lab 02: Implementing Apex Managed Sharing

## Objective

Implement a complete Apex Managed Sharing solution for a healthcare scenario where Case records must be shared with a dynamically-assigned Care Team modeled as a junction object. Understand why declarative sharing rules cannot solve this, how to create a custom row cause, how to write production-quality sharing logic with correct `with sharing` / `without sharing` choices, and how to rebuild shares at scale using Batch Apex.

---

## Prerequisites

- Salesforce org with Cases enabled (Service Cloud or Developer org with Cases)
- Apex development access (Execute Anonymous, Developer Console or VS Code with Salesforce extensions)
- Custom object `CareTeamMember__c` created with:
  - `Case__c` — Master-Detail or Lookup to Case
  - `TeamMember__c` — Lookup to User
  - `AccessLevel__c` — Picklist: Read Only, Edit
- A Custom Sharing Reason registered on Case (covered in Part 2)
- System Administrator profile for setup steps

---

## Business Scenario

**Company:** MeridianHealth
**Platform:** Salesforce Health Cloud / Service Cloud
**Problem:**

Cases at MeridianHealth represent patient care episodes. A "Care Team" for each Case includes nurses, physicians, and social workers assigned via a custom junction object `CareTeamMember__c`. The requirements are:

- When a user is added to a Case's Care Team, they immediately gain access to that Case
- When a user is removed from the Care Team, access is revoked
- A physician may be on hundreds of Care Teams simultaneously
- Access level is driven by the `AccessLevel__c` field on the junction record (Read Only vs. Edit)
- If the Case owner changes, Care Team access must be preserved
- The org has 500,000 CareTeamMember__c records and periodically needs to rebuild all shares from scratch (e.g., after a data migration)

**Why declarative sharing rules cannot solve this:**

Criteria-based sharing rules can share a record based on field values ON the Case itself (e.g., Case Status = Open). They cannot say "share with every User referenced in a child CareTeamMember__c record on this Case." That relationship traversal requires code. This is the canonical use case for Apex Managed Sharing.

---

## Part 1: Understand the Share Object

Every shareable standard and custom object in Salesforce has a corresponding Share object. For Case, it is `CaseShare`. Its structure:

| Field | Type | Notes |
|---|---|---|
| CaseId | ID | The Case being shared |
| UserOrGroupId | ID | The User or Group receiving access |
| CaseAccessLevel | String | `Read`, `Edit`, `All` (All = owner-level) |
| RowCause | String | Why this share exists. Standard values: `Owner`, `Rule`, `ImplicitChild`, `Manual`. Custom values must be registered. |

Key rules:
- You can only INSERT CaseShare records; you cannot update them. To change an access level, delete and re-insert.
- Rows with `RowCause = 'Owner'` are managed by the platform and cannot be deleted via DML.
- Rows with custom RowCause values can only be deleted by Apex code (the platform does not auto-clean them on ownership changes).
- A custom RowCause keeps the share alive even when ownership changes. This is both the feature (care team access survives owner changes) and the responsibility (you must clean up shares explicitly when removing team members).
- CaseShare DML requires `without sharing` on the executing class (covered in Part 3).

**CaseAccessLevel accepted values:**

| Value | Meaning |
|---|---|
| `Read` | Read-only access |
| `Edit` | Read and edit access |
| `All` | Full owner-equivalent (use sparingly) |

---

## Part 2: Create a Custom Sharing Reason (rowCause)

A custom sharing reason (RowCause) identifies why a share record exists. It serves two purposes:
1. Auditing — you can query CaseShare WHERE RowCause = 'YourCustomReason' to find all shares your code manages
2. Persistence — custom RowCause shares survive ownership changes (standard Manual shares are deleted on ownership transfer)

**Steps to create the custom sharing reason:**

1. Setup > Object Manager > Case
2. In the left sidebar, click **Sharing Reasons**
3. Click **New**
4. Label: `Care Team Access`
5. Name (API name): `CareTeamAccess` (Salesforce appends `__c`, making it `CareTeamAccess__c`)
6. Click **Save**

The API value you will use in Apex is: `Schema.CaseShare.RowCause.CareTeamAccess__c`

This is a Schema token, not a String. Always use the Schema token rather than a hardcoded string to avoid typos and to benefit from compile-time checking.

---

## Part 3: Write the Apex Sharing Logic

### 3.1 The Sharing Service Class

This class performs all DML on CaseShare records. It must be declared `without sharing` for one critical reason: the user invoking the trigger may not have access to the Case being shared. If you run the insert under the calling user's sharing context, Salesforce will throw an insufficient privileges error when the code tries to insert a share on a record the trigger's running user cannot see.

`without sharing` does not bypass CRUD/FLS — it only bypasses record-level sharing checks. The class still respects field-level security and object permissions.

```apex
/**
 * CareTeamSharingService
 *
 * Manages CaseShare records for CareTeamMember__c junction records.
 * Declared WITHOUT SHARING because inserting CaseShare records requires
 * elevated record access — the running user may not own the Cases being shared.
 * This is the standard pattern for all Apex Managed Sharing classes.
 */
public without sharing class CareTeamSharingService {

    /**
     * Grants Case access to users based on a list of CareTeamMember__c records.
     * Called from trigger after insert.
     */
    public static void grantAccess(List<CareTeamMember__c> newMembers) {
        if (newMembers == null || newMembers.isEmpty()) return;

        List<CaseShare> sharesToInsert = new List<CaseShare>();

        for (CareTeamMember__c member : newMembers) {
            if (member.Case__c == null || member.TeamMember__c == null) continue;

            CaseShare cs = new CaseShare();
            cs.CaseId         = member.Case__c;
            cs.UserOrGroupId  = member.TeamMember__c;
            cs.CaseAccessLevel = mapAccessLevel(member.AccessLevel__c);
            cs.RowCause        = Schema.CaseShare.RowCause.CareTeamAccess__c;
            sharesToInsert.add(cs);
        }

        if (!sharesToInsert.isEmpty()) {
            // Use Database.insert with allOrNone = false to handle edge cases
            // where a share already exists (duplicate key) without failing the batch.
            List<Database.SaveResult> results = Database.insert(sharesToInsert, false);
            logErrors(results, sharesToInsert);
        }
    }

    /**
     * Revokes Case access for a list of deleted CareTeamMember__c records.
     * Called from trigger after delete.
     * Must delete only rows with RowCause = CareTeamAccess__c to avoid
     * accidentally removing Owner or Rule shares.
     */
    public static void revokeAccess(List<CareTeamMember__c> deletedMembers) {
        if (deletedMembers == null || deletedMembers.isEmpty()) return;

        // Collect (CaseId, UserId) pairs from deleted junction records
        Set<Id> caseIds   = new Set<Id>();
        Set<Id> userIds   = new Set<Id>();
        Map<String, CareTeamMember__c> memberKey = new Map<String, CareTeamMember__c>();

        for (CareTeamMember__c member : deletedMembers) {
            if (member.Case__c == null || member.TeamMember__c == null) continue;
            caseIds.add(member.Case__c);
            userIds.add(member.TeamMember__c);
            // Composite key: CaseId|UserId
            memberKey.put(member.Case__c + '|' + member.TeamMember__c, member);
        }

        if (caseIds.isEmpty()) return;

        // Query only the CaseShare rows this code created (RowCause filter is critical)
        List<CaseShare> sharesToDelete = [
            SELECT Id, CaseId, UserOrGroupId
            FROM CaseShare
            WHERE CaseId IN :caseIds
              AND UserOrGroupId IN :userIds
              AND RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c
        ];

        // Filter to only the exact (Case, User) pairs being removed
        List<CaseShare> filteredDeletes = new List<CaseShare>();
        for (CaseShare share : sharesToDelete) {
            String key = share.CaseId + '|' + share.UserOrGroupId;
            if (memberKey.containsKey(key)) {
                filteredDeletes.add(share);
            }
        }

        if (!filteredDeletes.isEmpty()) {
            Database.delete(filteredDeletes, false);
        }
    }

    /**
     * Maps the CareTeamMember AccessLevel picklist value to CaseShare access level string.
     */
    private static String mapAccessLevel(String accessLevel) {
        if (accessLevel == 'Edit') return 'Edit';
        return 'Read'; // Default to Read for null or 'Read Only'
    }

    /**
     * Logs any SaveResult errors without throwing an exception.
     * In production, consider publishing a Platform Event for monitoring.
     */
    private static void logErrors(List<Database.SaveResult> results, List<CaseShare> shares) {
        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                for (Database.Error err : results[i].getErrors()) {
                    // Ignore FIELD_FILTER_VALIDATION_EXCEPTION for duplicate shares
                    if (err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION) continue;
                    System.debug(LoggingLevel.ERROR,
                        'CareTeamSharingService error on CaseId=' + shares[i].CaseId +
                        ' UserId=' + shares[i].UserOrGroupId +
                        ' | Code: ' + err.getStatusCode() +
                        ' | Message: ' + err.getMessage()
                    );
                }
            }
        }
    }
}
```

### 3.2 The Trigger

```apex
/**
 * CareTeamMemberTrigger
 *
 * Delegates all sharing logic to CareTeamSharingService.
 * Trigger itself is kept thin — no logic, just dispatch.
 */
trigger CareTeamMemberTrigger on CareTeamMember__c (after insert, after delete) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            CareTeamSharingService.grantAccess(Trigger.new);
        }
        if (Trigger.isDelete) {
            CareTeamSharingService.revokeAccess(Trigger.old);
        }
    }
}
```

**Why after insert / after delete and not before?**

Sharing DML requires the junction record to have an Id. Before insert, the Id does not exist yet. After insert guarantees the Id is assigned and the record is committed, so the share can be linked. The delete fires after the junction record is removed — we use `Trigger.old` to get the data from the deleted records before they are gone.

### 3.3 Why `without sharing` is Correct Here

The `without sharing` keyword on `CareTeamSharingService` is not a security bypass — it is a deliberate, necessary pattern for all classes that insert Share object records.

Consider the execution context: A nurse (who has access to Case A because she is already on the Care Team) is adding a physician to the Care Team. The nurse does not own Case A — the case manager does. When the trigger fires and calls `CareTeamSharingService.grantAccess()`, if that class ran `with sharing`, Salesforce would evaluate whether the running user (the nurse) can read Case A. She can — she has a CaseShare row. But inserting INTO CaseShare requires even broader implicit permissions that the platform reserves for system-context code.

More concretely: inserting a CaseShare record for a Case the running user does not OWN will fail under `with sharing` with INSUFFICIENT_ACCESS_OR_READONLY, even if the user has Read/Edit access to the record. The platform design requires `without sharing` (system context) for share object DML.

This does not mean the class ignores security. The calling trigger enforces that only valid `CareTeamMember__c` records (which the user can create via their Profile/Permission Set) flow through. The service class just does not apply a second layer of record-level security on the CaseShare DML itself.

---

## Part 4: Write Tests

```apex
@IsTest
private class CareTeamSharingServiceTest {

    /**
     * Test setup: create a Case owner, a care team member user, and a Case.
     * OWD for Case should be Private in your org for these tests to be meaningful.
     */
    @TestSetup
    static void makeData() {
        // Create a profile for care team users (use standard profile for simplicity in test)
        Profile stdProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];

        User caseOwner = new User(
            LastName       = 'CaseOwner',
            Email          = 'caseowner@meridiantest.invalid',
            Username       = 'caseowner@meridiantest.invalid.' + UserInfo.getOrganizationId(),
            Alias          = 'cowner',
            ProfileId      = stdProfile.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey   = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );

        User teamMember = new User(
            LastName       = 'TeamMember',
            Email          = 'teammember@meridiantest.invalid',
            Username       = 'teammember@meridiantest.invalid.' + UserInfo.getOrganizationId(),
            Alias          = 'tmember',
            ProfileId      = stdProfile.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey   = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );

        insert new List<User>{ caseOwner, teamMember };

        // Create Case as caseOwner
        System.runAs(caseOwner) {
            Case c = new Case(Subject = 'Test Care Case', Status = 'New', Origin = 'Phone');
            insert c;
        }
    }

    /**
     * Test 1: Insert CareTeamMember__c → user gains access to Case
     */
    @IsTest
    static void testGrantAccess() {
        User caseOwner  = [SELECT Id FROM User WHERE LastName = 'CaseOwner' LIMIT 1];
        User teamMember = [SELECT Id FROM User WHERE LastName = 'TeamMember' LIMIT 1];
        Case testCase   = [SELECT Id FROM Case WHERE Subject = 'Test Care Case' LIMIT 1];

        // Verify team member cannot see Case before sharing
        System.runAs(teamMember) {
            List<Case> visible = [SELECT Id FROM Case WHERE Id = :testCase.Id];
            System.assertEquals(0, visible.size(),
                'TeamMember should not see Case before being added to Care Team');
        }

        // Add team member to Care Team
        Test.startTest();
        CareTeamMember__c ctm = new CareTeamMember__c(
            Case__c        = testCase.Id,
            TeamMember__c  = teamMember.Id,
            AccessLevel__c = 'Read Only'
        );
        insert ctm;
        Test.stopTest();

        // Verify team member can now see Case
        System.runAs(teamMember) {
            List<Case> visible = [SELECT Id FROM Case WHERE Id = :testCase.Id];
            System.assertEquals(1, visible.size(),
                'TeamMember should see Case after being added to Care Team');
        }

        // Verify the CaseShare row exists with correct RowCause
        List<CaseShare> shares = [
            SELECT Id, CaseAccessLevel, RowCause
            FROM CaseShare
            WHERE CaseId = :testCase.Id
              AND UserOrGroupId = :teamMember.Id
              AND RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c
        ];
        System.assertEquals(1, shares.size(), 'One CareTeamAccess share row should exist');
        System.assertEquals('Read', shares[0].CaseAccessLevel, 'Access level should be Read');
    }

    /**
     * Test 2: Delete CareTeamMember__c → user loses access to Case
     */
    @IsTest
    static void testRevokeAccess() {
        User teamMember = [SELECT Id FROM User WHERE LastName = 'TeamMember' LIMIT 1];
        Case testCase   = [SELECT Id FROM Case WHERE Subject = 'Test Care Case' LIMIT 1];

        // Insert membership first
        CareTeamMember__c ctm = new CareTeamMember__c(
            Case__c        = testCase.Id,
            TeamMember__c  = teamMember.Id,
            AccessLevel__c = 'Read Only'
        );
        insert ctm;

        // Confirm access was granted
        System.runAs(teamMember) {
            System.assertEquals(1,
                [SELECT Id FROM Case WHERE Id = :testCase.Id].size(),
                'Access should exist after insert');
        }

        // Remove from Care Team
        Test.startTest();
        delete ctm;
        Test.stopTest();

        // Confirm access was revoked
        System.runAs(teamMember) {
            System.assertEquals(0,
                [SELECT Id FROM Case WHERE Id = :testCase.Id].size(),
                'Access should be revoked after delete');
        }

        // Confirm share row is gone
        List<CaseShare> shares = [
            SELECT Id FROM CaseShare
            WHERE CaseId = :testCase.Id
              AND UserOrGroupId = :teamMember.Id
              AND RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c
        ];
        System.assertEquals(0, shares.size(), 'CareTeamAccess share row should be deleted');
    }

    /**
     * Test 3: Ownership change → custom RowCause share survives
     *
     * This is the key differentiator between Manual sharing (RowCause = 'Manual')
     * and custom RowCause sharing. Manual shares are deleted on ownership transfer.
     * Custom RowCause shares persist.
     */
    @IsTest
    static void testCustomRowCauseSurvivesOwnershipChange() {
        User caseOwner  = [SELECT Id FROM User WHERE LastName = 'CaseOwner' LIMIT 1];
        User teamMember = [SELECT Id FROM User WHERE LastName = 'TeamMember' LIMIT 1];
        Case testCase   = [SELECT Id FROM Case WHERE Subject = 'Test Care Case' LIMIT 1];

        // Add to care team
        insert new CareTeamMember__c(
            Case__c        = testCase.Id,
            TeamMember__c  = teamMember.Id,
            AccessLevel__c = 'Read Only'
        );

        Test.startTest();
        // Transfer Case ownership to a third user (use admin running the test)
        Case caseToUpdate = new Case(Id = testCase.Id, OwnerId = UserInfo.getUserId());
        update caseToUpdate;
        Test.stopTest();

        // Verify the CareTeamAccess share row still exists after ownership change
        List<CaseShare> shares = [
            SELECT Id FROM CaseShare
            WHERE CaseId = :testCase.Id
              AND UserOrGroupId = :teamMember.Id
              AND RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c
        ];
        System.assertEquals(1, shares.size(),
            'Custom RowCause share should survive ownership transfer');

        // Verify team member can still see the Case
        System.runAs(teamMember) {
            System.assertEquals(1,
                [SELECT Id FROM Case WHERE Id = :testCase.Id].size(),
                'TeamMember access should be preserved after ownership change');
        }
    }
}
```

---

## Part 5: Test the Behavior (rowCause Persistence)

### 5.1 Manual Verification in a Sandbox

After deploying the trigger and service class, run these tests in Execute Anonymous to observe RowCause behavior:

```apex
// Step 1: Create a test case and a care team member
User testUser = [SELECT Id FROM User WHERE Name = 'Jane Nurse' LIMIT 1];
Case c = new Case(Subject = 'Sharing Test', Status = 'New', Origin = 'Phone');
insert c;

CareTeamMember__c ctm = new CareTeamMember__c(
    Case__c       = c.Id,
    TeamMember__c = testUser.Id,
    AccessLevel__c = 'Edit'
);
insert ctm;

// Step 2: Query the share row
List<CaseShare> shares = [
    SELECT Id, CaseAccessLevel, RowCause, UserOrGroupId
    FROM CaseShare
    WHERE CaseId = :c.Id
];
for (CaseShare s : shares) {
    System.debug('UserOrGroup: ' + s.UserOrGroupId +
                 ' | Level: ' + s.CaseAccessLevel +
                 ' | Cause: ' + s.RowCause);
}

// Step 3: Transfer ownership and recheck shares
c.OwnerId = [SELECT Id FROM User WHERE Name = 'Dr. Smith' LIMIT 1].Id;
update c;

shares = [SELECT Id, CaseAccessLevel, RowCause FROM CaseShare WHERE CaseId = :c.Id];
System.debug('Shares after ownership transfer: ' + shares.size());
// The CareTeamAccess__c row should still be present
// The old Owner row will be replaced by a new one for Dr. Smith
```

### 5.2 Observed RowCause Values

After the operations above, you should see:

```
Before ownership transfer:
  UserOrGroup: [original owner]   | Level: All  | Cause: Owner
  UserOrGroup: [Jane Nurse Id]     | Level: Edit | Cause: CareTeamAccess__c

After ownership transfer to Dr. Smith:
  UserOrGroup: [Dr. Smith Id]      | Level: All  | Cause: Owner
  UserOrGroup: [Jane Nurse Id]     | Level: Edit | Cause: CareTeamAccess__c   <-- PERSISTED
  (Original owner's row is gone -- the platform manages Owner rows)
```

If you had used `RowCause = 'Manual'` instead of the custom RowCause, Jane Nurse's share would have been deleted during the ownership transfer. Custom RowCause is the mechanism that makes Care Team access durable across ownership changes.

---

## Part 6: Batch Sharing at Scale

### 6.1 The Problem

After a data migration, all CaseShare rows with `RowCause = CareTeamAccess__c` may need to be rebuilt from the 500,000 CareTeamMember__c records. Running this synchronously would exceed governor limits (10,000 DML rows per transaction). You need a Batch Apex job that:

1. Deletes all existing CareTeamAccess shares
2. Re-inserts shares from all active CareTeamMember__c records
3. Uses `System.setAllSharingCalculationDisabled(true)` to defer sharing recalculation during the bulk operation
4. Re-enables sharing calculation and triggers a final recalculation at the end

### 6.2 The Batch Implementation

```apex
/**
 * RebuildCareTeamSharesBatch
 *
 * Rebuilds all CaseShare records for the CareTeamAccess__c RowCause.
 * Run this after a data migration or when shares become out of sync.
 *
 * Execution: Database.executeBatch(new RebuildCareTeamSharesBatch(), 200);
 * Scope of 200 is a safe default — each scope processes 200 CareTeamMember__c records.
 */
public without sharing class RebuildCareTeamSharesBatch
    implements Database.Batchable<SObject>, Database.Stateful {

    // Track total shares created for post-run reporting
    private Integer totalSharesCreated = 0;
    private Integer totalErrors        = 0;
    private Boolean isFirstBatch       = true;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // Query all CareTeamMember__c records ordered by CaseId for efficient chunking
        return Database.getQueryLocator([
            SELECT Id, Case__c, TeamMember__c, AccessLevel__c
            FROM CareTeamMember__c
            WHERE Case__c != null
              AND TeamMember__c != null
            ORDER BY Case__c
        ]);
    }

    public void execute(Database.BatchableContext bc, List<CareTeamMember__c> scope) {

        // On the first batch, delete ALL existing CareTeamAccess shares to start clean.
        // This is done in the first execute() rather than in start() because start()
        // runs in its own transaction — deleting here ensures atomicity with the first insert.
        if (isFirstBatch) {
            isFirstBatch = false;
            deleteAllCareTeamShares();
        }

        // Defer platform sharing recalculation during bulk DML.
        // This prevents the platform from running expensive share recalc after every batch.
        // Must be re-enabled (it auto-resets per transaction, but deferral is per-transaction anyway).
        System.setAllSharingCalculationDisabled(true);

        try {
            List<CaseShare> sharesToInsert = new List<CaseShare>();

            for (CareTeamMember__c member : scope) {
                CaseShare cs = new CaseShare();
                cs.CaseId          = member.Case__c;
                cs.UserOrGroupId   = member.TeamMember__c;
                cs.CaseAccessLevel = member.AccessLevel__c == 'Edit' ? 'Edit' : 'Read';
                cs.RowCause        = Schema.CaseShare.RowCause.CareTeamAccess__c;
                sharesToInsert.add(cs);
            }

            List<Database.SaveResult> results = Database.insert(sharesToInsert, false);

            for (Integer i = 0; i < results.size(); i++) {
                if (results[i].isSuccess()) {
                    totalSharesCreated++;
                } else {
                    totalErrors++;
                    // Log first 10 errors to avoid log flooding
                    if (totalErrors <= 10) {
                        System.debug(LoggingLevel.WARN,
                            'Share insert failed: CaseId=' + sharesToInsert[i].CaseId +
                            ' | ' + results[i].getErrors()[0].getMessage()
                        );
                    }
                }
            }

        } finally {
            // Re-enable sharing calculation at end of each execute() transaction.
            // setAllSharingCalculationDisabled is scoped to the current transaction,
            // so this is technically redundant, but is included for clarity.
            System.setAllSharingCalculationDisabled(false);
        }
    }

    public void finish(Database.BatchableContext bc) {
        // Log summary
        System.debug(LoggingLevel.INFO,
            'RebuildCareTeamSharesBatch complete. ' +
            'Shares created: ' + totalSharesCreated + ' | ' +
            'Errors: ' + totalErrors
        );

        // Optionally: send an email or publish a Platform Event with the results
        // Optionally: kick off a Salesforce sharing recalculation if needed
    }

    /**
     * Deletes all existing CaseShare rows with the CareTeamAccess__c RowCause.
     * Uses chunked deletion to handle large volumes without hitting DML limits.
     */
    private static void deleteAllCareTeamShares() {
        // SOQL query inside a loop is acceptable here because we're using
        // a while-loop with LIMIT to chunk, not a for-each trigger pattern.
        Integer deletedTotal = 0;
        List<CaseShare> chunk;

        do {
            chunk = [
                SELECT Id
                FROM CaseShare
                WHERE RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c
                LIMIT 10000
            ];
            if (!chunk.isEmpty()) {
                Database.delete(chunk, false);
                deletedTotal += chunk.size();
            }
        } while (chunk.size() == 10000);

        System.debug('Deleted ' + deletedTotal + ' existing CareTeamAccess share rows');
    }
}
```

### 6.3 Running the Batch Job

```apex
// In Execute Anonymous or a scheduled Apex class:

// Standard run — scope of 200 is a safe default
Id jobId = Database.executeBatch(new RebuildCareTeamSharesBatch(), 200);
System.debug('Batch job started: ' + jobId);

// Monitor via SOQL:
AsyncApexJob job = [
    SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
    FROM AsyncApexJob
    WHERE Id = :jobId
];
System.debug('Status: ' + job.Status +
             ' | Processed: ' + job.JobItemsProcessed +
             '/' + job.TotalJobItems +
             ' | Errors: ' + job.NumberOfErrors);
```

### 6.4 Scope Size Considerations

| CareTeamMember__c Volume | Recommended Scope | Reasoning |
|---|---|---|
| < 50,000 | 200 | Default; safe for most orgs |
| 50,000 – 200,000 | 200 | Keep the same; the batch framework will create more batches |
| 200,000 – 500,000 | 100–150 | Reduce scope if you see CPU timeout errors in individual batches |
| > 500,000 | 100 + separate delete job | Run a separate batch just for deletion first, then a separate one for insertion |

The platform limit is 50 million records processed per rolling 24-hour period across all Batch Apex jobs in the org. At 500,000 CareTeamMember__c records with scope 200, you have 2,500 batches, each processing 200 records — well within limits.

### 6.5 Why `System.setAllSharingCalculationDisabled(true)` Matters at Scale

Without this flag, each `Database.insert` of CaseShare rows triggers an internal sharing recalculation job for every affected Case. At 500,000 shares, this generates enormous background processing. The flag defers this recalculation to the end of the transaction (or until re-enabled), allowing the DML to complete before the platform fans out the recalculation. This reduces total processing time by orders of magnitude on large orgs.

Important constraints:
- `setAllSharingCalculationDisabled` is scoped to the current Apex transaction. It resets automatically when the transaction ends.
- It affects ALL sharing calculations for the duration of the transaction, not just your Share object inserts. Use it only in controlled batch contexts, not in triggers that process mixed business logic.
- It is not available in anonymous Apex running in Lightning Experience debug mode — run via scheduled Apex or Developer Console Execute Anonymous.

---

## Common Mistakes

**Mistake 1: Declaring the sharing class `with sharing`.**

Any class that performs DML on Share objects (CaseShare, AccountShare, etc.) must be `without sharing`. The class that calls it (the trigger handler) should be `with sharing` or inherit context — but the service class doing the actual share DML must be `without sharing`. Failing to do this produces `INSUFFICIENT_ACCESS_OR_READONLY` errors on insert.

**Mistake 2: Hardcoding the RowCause string instead of using the Schema token.**

Using `'CareTeamAccess__c'` as a string literal will compile and may even insert the row, but the API name is case-sensitive and includes the `__c` suffix. If you misspell it, you get an `INVALID_FIELD` error at runtime. Always use `Schema.CaseShare.RowCause.CareTeamAccess__c`. This is checked at compile time.

**Mistake 3: Not filtering by RowCause when deleting shares.**

If you delete ALL CaseShare rows for a given Case and User without filtering by RowCause, you will destroy platform-managed shares (Owner, Rule) and manual shares that the user may have created independently. Always scope your deletes to `RowCause = :Schema.CaseShare.RowCause.CareTeamAccess__c`.

**Mistake 4: Using `insert` with `allOrNone = true` in bulk operations.**

A duplicate key exception on one share (e.g., user already has access through another mechanism) will roll back the entire batch. Use `Database.insert(list, false)` and inspect SaveResults. Filter out `FIELD_FILTER_VALIDATION_EXCEPTION` status codes, which typically indicate a duplicate share that is benign.

**Mistake 5: Running the batch with scope > 200 without profiling.**

Higher scope means more records in a single execute() call, which means more CPU time per batch. With complex sharing logic, scope 200 is a safe starting point. Only increase after profiling CPU time in a sandbox with production-volume data.

**Mistake 6: Not testing with `System.runAs()`.**

Testing sharing logic without `System.runAs()` gives you false confidence. The test runs as the admin user (who can see everything) unless you explicitly switch context. Every assertion about record visibility must be inside a `System.runAs(limitedUser)` block.

**Mistake 7: Forgetting that test methods run with SeeAllData = false.**

In Apex tests, the sharing rules DO apply to test-created data. Set your org's Case OWD to Private and run the tests — if you see more records than expected, your org OWD is not Private and the tests are not validating real isolation.

---

## Exam Connections

| CRT-403 Topic | This Lab Covers |
|---|---|
| Apex Managed Sharing use cases | Junction-object-based sharing that declarative rules cannot model |
| `with sharing` vs `without sharing` on sharing classes | Service class requires `without sharing`; trigger handler should use `with sharing` |
| Custom RowCause (sharing reason) | Creation steps, Schema token reference, persistence across ownership changes |
| Share object structure | CaseShare fields: CaseId, UserOrGroupId, CaseAccessLevel, RowCause |
| RowCause values | Owner, Rule, Manual, custom — and which ones survive ownership transfer |
| Batch Apex for share recalculation | Batchable pattern, scope sizing, `setAllSharingCalculationDisabled` |
| `Database.insert` with allOrNone = false | Fault-tolerant bulk DML for Share objects |
| `System.runAs()` in tests | Mandatory for any sharing logic test |

**High-frequency exam scenarios for Apex sharing:**

- "A user should get access to a record based on their relationship to a custom object." → Apex sharing required; criteria-based sharing rules cannot traverse object relationships.
- "Access should be granted for 7 days then revoked." → Apex sharing with a scheduled job for revocation; no declarative time-based sharing exists.
- "After an ownership change, the share is gone." → The share used `RowCause = 'Manual'`. Custom RowCause shares survive; Manual shares do not.
- "The insert of CaseShare fails with insufficient privileges." → The class running the DML is declared `with sharing`. Change to `without sharing`.
- "Share recalculation is timing out on 300,000 records." → Use `System.setAllSharingCalculationDisabled(true)` in the batch execute, or split into a delete job + insert job with deferred calculation.
