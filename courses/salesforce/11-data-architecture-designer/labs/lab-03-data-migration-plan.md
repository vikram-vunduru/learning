# Lab 03: Data Migration Plan

## Lab Overview

**Domain**: Data Migration  
**Estimated Time**: 90 minutes  
**Level**: Architect  
**Format**: Migration architecture design exercise — produce a migration plan document

---

## Business Scenario

**Company**: GlobalBank Corp — a mid-size financial services company migrating from Salesforce Classic (legacy org, 8 years old) to a new Salesforce Lightning org with a redesigned data model.

**Migration Scope**:
- 350,000 Account records (mix of Corporate and Individual banking customers)
- 1,200,000 Contact records
- 4,500,000 Opportunity records (loan applications, investment products)
- 8,000,000 Activity records (calls, meetings, emails)
- 2,500,000 Case records
- 600,000 Documents/Files
- Custom objects: 12 objects with 1.5M total records

**Data Quality Assessment** (already profiled):
- Accounts: 12% have duplicate records across the legacy org
- Contacts: 23% have no primary Account association (orphaned contacts)
- Opportunities: 8% have invalid Stage values (legacy stages not in new data model)
- Activities: 35% are older than 7 years (archival candidates)
- Contacts/Accounts: 18% have GDPR consent status unknown (no explicit consent record)

**Timeline**:
- Go-live: 16 weeks from project start
- Migration cutover window: one weekend (48 hours maximum)

---

## Lab Exercises

### Exercise 1: Pre-Migration Design (20 points)

**Task**: Design the pre-migration workstream (Weeks 1–8).

**1a. Data Cleansing Scope**

Based on the profiling data above, what must be cleansed BEFORE migration? Prioritize.

| Issue | Volume | Priority | Approach |
|---|---|---|---|
| Duplicate Accounts (12%) | ~42,000 duplicates | HIGH | Merge in source using ETL deduplication + MDM matching; load golden records only |
| Orphaned Contacts (23%) | ~276,000 contacts | HIGH | Assign to a "Unassigned Account" master record or link to correct Account via name/email matching |
| Invalid Opportunity Stages (8%) | ~360,000 opps | HIGH | Map legacy stages to new stage values; any unmappable stages → "Unknown" or "Closed Lost" |
| Stale Activities (35% > 7 years) | ~2,800,000 activities | MEDIUM | Archive to Big Object or external storage instead of migrating to active tier |
| GDPR consent unknown (18%) | ~270,000 contacts | MEDIUM | Flag with `Consent_Status__c = 'Unknown'` for post-migration stewardship review |

**1b. External ID Strategy**

Define the External ID fields needed for this migration:

| Object | External ID Field | Source Value | Justification |
|---|---|---|---|
| Account | `Legacy_Account_ID__c` | Source CRM Account ID | Required for upsert; resolves Contact → Account relationship |
| Contact | `Legacy_Contact_ID__c` | Source CRM Contact ID | Required for upsert; resolves Opportunity Contact Role |
| Opportunity | `Legacy_Opp_ID__c` | Source CRM Opp ID | Required for delta loads during parallel run period |
| Custom Objects | `Legacy_Record_ID__c` | Source Record ID | Required for relationship resolution |

**1c. Automation Bypass Design**

List automations that MUST be disabled during migration and the bypass mechanism:

| Automation | Type | Action During Migration | Bypass Method |
|---|---|---|---|
| Welcome email to new Contacts | Flow | Disable | Migration Custom Setting flag check in Flow |
| Auto-create Tasks on Opportunity stage change | Flow | Disable | Migration flag check |
| Account enrichment call to Dun & Bradstreet | Apex Trigger | Disable | `Is_Migration__c` check in trigger before callout |
| GDPR consent check on Contact save | Validation Rule | Bypass for unknown consent contacts | Temporary deactivation with re-activation plan |
| Duplicate Rules for Account and Contact | Duplicate Rule | KEEP ACTIVE | Catch migration-created duplicates; log to Duplicate Record Sets for review |

---

### Exercise 2: Migration Sequence Design (20 points)

**Task**: Define the complete migration sequence in the correct order.

**Dependency Analysis**:
```
Users (no dependencies)
↓
Accounts (no Salesforce dependencies; depend on Users for OwnerId)
↓
Contacts (depend on Accounts for AccountId lookup)
↓
Leads (no Salesforce dependencies; may reference Contacts via conversion)
↓
Opportunities (depend on Accounts for AccountId)
↓
OpportunityContactRoles (depend on both Opportunities and Contacts)
↓
Campaigns (no Salesforce dependencies)
↓
CampaignMembers (depend on Campaigns, and Contacts/Leads)
↓
Cases (depend on Accounts and Contacts)
↓
Custom Objects (depend on their parent objects)
↓
Activities / Tasks / Events (depend on WhoId targets [Contact/Lead] and WhatId targets [Account/Opp/Case/Custom])
↓
Notes and Attachments (depend on parent record existence)
↓
ContentDocumentLinks (depend on parent records and ContentDocuments)
```

**Migration Wave Design** (for parallel load optimization):

| Wave | Objects | Can Run in Parallel? | Estimated Duration |
|---|---|---|---|
| Wave 0 | Users (ownership lookups) | N/A | 1 hour |
| Wave 1 | Accounts | With Leads (independent) | 4 hours (350k records) |
| Wave 1 | Leads | With Accounts | 2 hours |
| Wave 1 | Campaigns | With Accounts and Leads | 1 hour |
| Wave 2 | Contacts | After Wave 1 complete | 8 hours (1.2M records) |
| Wave 2 | CampaignMembers | After Campaigns and Contacts | 2 hours |
| Wave 3 | Opportunities | After Contacts and Accounts | 12 hours (4.5M records) |
| Wave 3 | Custom Objects (no Opp deps) | With Opportunities | 4 hours |
| Wave 4 | OpportunityContactRoles | After Opps and Contacts | 3 hours |
| Wave 4 | Cases | After Accounts and Contacts | 8 hours (2.5M records) |
| Wave 5 | Activities | After all WhoId/WhatId targets exist | 20 hours (8M records, only <7yr old) |
| Wave 6 | Files/Attachments | After parent records exist | 10 hours (600k files) |
| **Total** | | | **~74 hours sequential** |

**Problem**: Total sequential load = ~74 hours. Cutover window = 48 hours. 

**Solution**:
1. **Pre-migration load of static data**: Load Accounts, Leads, Campaigns, Contacts, and Opportunities in the WEEK BEFORE cutover (legacy org goes read-only during the final parallel run period)
2. **Delta load at cutover**: At cutover, only load records modified in the last 24–48 hours (delta using LastModifiedDate filter)
3. **Files during live transition**: Files/Attachments can be loaded in the background after go-live (not critical path)
4. **Parallel streams**: Activities run in parallel with Cases in Wave 5

Revised cutover window with pre-migration strategy: **< 12 hours** (only delta records + files)

---

### Exercise 3: ETL Tool Selection (20 points)

**Task**: Recommend the ETL tool(s) for this migration and justify.

**Decision Matrix**:

| Criterion | Data Loader | MuleSoft | Informatica Cloud |
|---|---|---|---|
| Volume (8M+ activities) | Marginal (single-threaded) | Good (parallel batch) | Excellent (enterprise scale) |
| Transformation complexity (stage mapping, contact de-orphaning) | None (needs pre-processing) | Good (built-in transforms) | Excellent (data quality built-in) |
| Error handling | Basic (CSV error log) | Good (retry, dead-letter) | Excellent (automated retry, quarantine) |
| Scheduling and orchestration | Manual/OS scheduler | Native batch scheduling | Enterprise orchestration |
| Parallel load streams | Manual (multiple CLI instances) | Native | Native |
| Team familiarity | High | Medium | Low (specialized) |
| Cost | Free | Already licensed | Additional license |

**Recommendation for GlobalBank**:

**Phase 1 (Low-complexity objects, Weeks 10–12)**: Use **Data Loader CLI** for Accounts, Contacts, and Opportunities. These are high-volume but the transformations are well-defined (stage mapping in a lookup CSV). Run parallel CLI instances for different object streams.

**Phase 2 (Complex objects, Week 13–14)**: Use **MuleSoft** (already licensed for integration) for: OpportunityContactRoles (complex relationship resolution), Activities (WhoId/WhatId polymorphic mapping), and GDPR consent record creation.

**Rationale**: Avoid procuring new Informatica licenses for a one-time migration when existing tools (Data Loader + MuleSoft) are sufficient with proper design. If Informatica were already licensed, it would be the preferred choice for all phases.

---

### Exercise 4: Rollback Plan (20 points)

**Task**: Design the rollback plan for the production migration.

**Rollback Scenarios**:

**Scenario A: Rollback within 24 hours of go-live (data quality failure discovered)**

Strategy: Hard Delete all migrated records in reverse sequence.

Process:
1. Immediately pause all delta loads and user activity
2. Export error log: all records inserted during migration have `CreatedDate = [migration window]`
3. Delete in reverse Wave order: Files → Activities → Cases → OCRs → Opportunities → Custom Objects → Contacts → Accounts → Leads → Campaigns (use `CreatedDate >= :migrationStartTime` to identify migrated records)
4. Use Bulk API `hardDelete` (bypasses Recycle Bin — essential since Recycle Bin has a 15-day retention limit but we want immediate cleanup)
5. Restore automations and duplicate rules to pre-migration state
6. Switch users back to legacy org (legacy org must remain in read-only state, not decommissioned, for the rollback window)
7. Total rollback estimated time: 8–12 hours

**Scenario B: Rollback 1–2 weeks post go-live (fundamental data model problem)**

This is too late for a clean hard-delete rollback. Only options:
1. Fix-forward: identify and remediate the specific data issues without full rollback
2. Re-migration: re-export from legacy, apply fixes, reload specific objects
3. Emergency re-migration: full org restoration from a sandbox copy taken at go-live (time-consuming — 24–48 hours for full sandbox copy restore)

**Rollback decision gate criteria**: Proceed to rollback if:
- Error rate in Wave 1 > 5% (Accounts or Contacts failing)
- > 10,000 orphaned child records detected post-load
- Business-critical custom object load failure > 0%
- Duplicate rate in production > 1% of loaded records

**Rollback go/no-go decision authority**: Named executive sponsor + Salesforce project manager must both approve rollback decision. Not a unilateral decision by the technical team.

---

### Exercise 5: Post-Migration Validation Design (20 points)

**Task**: Design the validation checklist for the 48-hour post-migration stabilization period.

**Quantitative Gates** (must pass before go-live announcement):

| Check | Method | Pass Criteria |
|---|---|---|
| Record count reconciliation | SOQL COUNT vs. source system count | < 0.1% variance |
| Relationship integrity | SOQL: `WHERE AccountId = null` on Contact | 0 orphaned Contacts |
| Duplicate detection | Duplicate Job on Account and Contact | < 0.5% duplicate rate |
| Stage value validity | SOQL on Opportunity WHERE StageName NOT IN (...) | 0 invalid stage values |
| Activity WhoId/WhatId integrity | SOQL: Activities with null WhoId and WhatId | 0% null (for loaded activities) |
| GDPR consent records | COUNT of Consent__c records vs. expected | Match expected count |
| File/Attachment count | ContentDocument count vs. source | < 0.5% variance |

**Qualitative Spot Checks**:
1. Manually verify 20 random Account records — check field values match source
2. Manually verify 10 specific high-profile customer records (CEO will check these on Day 1)
3. Open 5 Opportunity records — verify related Contacts, Activities, and custom object records are correct
4. Run 3 key business reports and verify output matches expected values from legacy system

**User Acceptance Testing**:
- 5 business users per department (sales, service, marketing) validate their workflows in production
- 2-hour validation window before go-live announcement
- Sign-off required from each business owner before announcement

---

## PTA Advisory Note

The most important thing to tell a customer about data migration is: **the migration itself is the easiest part of a migration project — getting ready for the migration is where projects fail.**

80% of migration effort should be in:
- Data profiling and quality assessment
- Transformation and cleansing design
- Test migration iterations in sandbox (run the migration 3 times in sandbox before production)
- Rollback planning and validation design

A team that invests properly in pre-migration work will have a boring, uneventful cutover. A team that skips these steps will have a memorable disaster.

When advising customers on migration risk: the top 3 risk questions to ask are:
1. "What is your rollback plan if the migration fails?" (If they don't have one, that's Risk #1)
2. "Have you run a test migration in sandbox at production data volumes?" (If no, that's Risk #2)
3. "What automations will fire on migrated records and who has tested them?" (If unknown, that's Risk #3)
