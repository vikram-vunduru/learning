# Data Architecture & Management Designer — Cheat Sheet

## Exam Quick Reference: CRT-402
- **60 questions** | **58% pass** (~35 correct) | **105 minutes** | **$200**
- Domains: MDM 25%, LDV 25%, Data Migration 20%, Governance 15%, Integration 15%

---

## DOMAIN 1: Master Data Management (25%)

### Matching & Duplicate Rules
| Feature | Limit | Notes |
|---|---|---|
| Active Matching Rules / org | 5 | Object-specific |
| Active Duplicate Rules / object | 5 | Separate from matching |
| Fields per Matching Rule | 10 | |
| Records merged at once | 3 | Account, Contact, Lead |
| Custom object merge UI | NOT available | Requires Apex |

**Matching algorithms**: First Name (nicknames), Last Name, Email (exact only), Address (abbreviations), Phone (format normalization), Company Name (Inc/LLC suffixes)

**Duplicate Rule actions**: Block | Allow with Alert | Report Only

**Duplicate Jobs** = scan existing data → create Duplicate Record Sets  
**Duplicate Rules** = prevent new duplicates at record save

### MDM Patterns
| Volume | Approach |
|---|---|
| < 1M records | Native Salesforce Duplicate Rules |
| 1M–10M | Native + ETL-side dedup at migration |
| 10M+ | External MDM Hub (Informatica MDM, Semarchy) |
| Data Cloud orgs | Data Cloud Identity Resolution |

### MDM Hub Patterns
- **Registry**: Cross-reference index; each system keeps its data; GID links records
- **Consolidation**: Sources feed hub; hub creates golden record
- **Centralized**: All creates go through hub; Salesforce is subscriber
- **Coexistence**: Hub and Salesforce co-manage

### Object Model Critical Facts
- Master-Detail: max **2 per child**; cascade delete; OWD inherited from parent; roll-ups supported
- Lookup: max **40 per object**; no cascade delete; no roll-ups; independent OWD
- Junction object OWD: inherits **most restrictive** parent OWD
- Roll-up summaries: max **25 per master object**
- Cross-object formula: max **5 levels** up lookup chain
- External ID fields: max **3 per object** (auto-indexed)
- Formula fields: NOT stored; NOT indexable; **calculated at read time**
- Long Text Area: NOT indexable; NOT selectively filterable

---

## DOMAIN 2: Large Data Volumes (25%)

### Selectivity Rules
- Query is selective when result < **10% of total records**
- At 1M+ records: < 10% OR < 333,333 records, whichever is lower
- Non-selective query = full table scan = likely timeout
- Index exists but query still slow = index bypassed due to non-selectivity

### Standard Indexed Fields (automatic — no request needed)
- Id, Name, OwnerId, CreatedDate, SystemModstamp, RecordTypeId
- All Master-Detail and Lookup FK fields

### Custom Indexes
- **Must request from Salesforce Support** (not self-service)
- Available on: text, number, date, datetime, picklist, checkbox, email, phone
- NOT available on: **formula, long text area, multi-select picklist, encrypted fields**
- Two-column compound index: best for queries that always filter on same two fields
- More indexes = slower writes (update index on every write)

### Skinny Tables
- Created and managed by **Salesforce Support only** — not self-service
- Not available in sandbox by default; reset on full sandbox refresh
- Contain 10–30 most-queried fields; no long text, no formulas
- Best for: objects with 10M+ records, consistently queried same small field set

### SOQL Limits
| Limit | Sync | Async (Batch) |
|---|---|---|
| Rows returned | 50,000 | 50,000,000 |
| Query timeout | 10 seconds | 10 sec/chunk |
| Total SOQL per transaction | 100 | 200 |

### SOQL Optimization Rules
- `LIKE '%keyword%'` = always full table scan (no index)
- `LIKE 'prefix%'` = can use index
- `NOT IN` / `!=` = non-selective — avoid on LDV
- `ORDER BY` non-indexed field at LDV scale = expensive sort in memory
- Semi-join inner query: effective when inner result < **2,000 records**
- SOQL in loops = **always a bug** — use Maps for lookups

### Big Objects
- Designed for **billions of records**
- Records are **immutable** — no update, no individual delete
- Insert method: `insertImmediate()` — NOT standard DML
- Compound index: defined at creation, **cannot be changed**
- Query rule: **left-most prefix** of index fields must be present in WHERE clause
- No: triggers, automation, reports, aggregate SOQL, standard UI

### Data Tiers
| Tier | Store | Access |
|---|---|---|
| Hot | Standard Salesforce Objects | Full SOQL, reports, UI |
| Warm | Big Objects or Salesforce Connect | Limited query, custom LWC |
| Cold | External Storage (S3, Snowflake) | External BI tools only |

### Archiving Key Facts
- Recycle Bin: records retained **15 days** before permanent deletion
- Hard delete via Bulk API: `hardDelete` bypasses Recycle Bin
- Field History Tracking: **18 months** native; Field History Archive add-on for longer
- Archive children BEFORE parents (parent deletion orphans children)

---

## DOMAIN 3: Data Migration (20%)

### Migration Sequence (always parent before child)
```
1. Users → 2. Accounts → 3. Contacts & Leads → 4. Opportunities
→ 5. Opp Contact Roles → 6. Cases → 7. Custom Objects
→ 8. Activities → 9. Files/Notes
```

### ETL Tools Comparison
| Tool | Volume | Transform | Cost |
|---|---|---|---|
| Data Import Wizard | < 50,000 | None | Free |
| Data Loader | Up to ~5M/job | None | Free |
| MuleSoft | Unlimited | Yes | Paid |
| Informatica Cloud | Unlimited | Yes (advanced) | Paid |

**Data Loader batch size**: default 200, max **10,000** records  
**Bulk API v2**: max **150MB** per upload; automatic batching; preferred for new dev  
**Bulk API v1**: max **100MB** per batch; manual batch management; legacy

### Migration Critical Rules
- Always use **UPSERT** (not INSERT) — idempotent, safe for re-runs
- External ID fields: max **3 per object**; automatically indexed
- Never hard-code Salesforce record IDs in ETL — IDs differ between orgs
- Automations to disable: email-sending, creation-triggered Flows, historical-data validation rules
- Duplicate Rules: **keep active** during migration — catches duplicates
- Migration bypass pattern: `Is_Migration__c` Custom Setting flag checked by automation

### Rollback Options
1. Full org backup/restore (most comprehensive, slowest)
2. Hard Delete of migrated records (requires complete ID tracking, reverse sequence)
3. Parallel run — source still operational (safest, most expensive)

---

## DOMAIN 4: Data Governance (15%)

### Governance Roles
- **Data Owner**: Business executive; sets requirements; approves policy
- **Data Steward**: Day-to-day quality management; reviews exceptions
- **Data Custodian**: Technical role; implements controls

### Data Classification Tiers
Public → Internal → Confidential → **Restricted/PII** → Regulated

### Salesforce Shield
| Feature | Function |
|---|---|
| Platform Encryption | AES-256 field-level encryption |
| Event Monitoring | Audit log of all activity |
| Transaction Security | Real-time policy enforcement |

**Encrypted fields**: NOT indexable, NOT usable in standard SOQL WHERE  
**Deterministic encryption**: allows SOQL filtering; slightly less secure  
**Event Monitoring retention**: 1 day free; 30 days with Shield  
**View Encrypted Data**: separate permission needed to read encrypted values

### Privacy Compliance Key Facts
| Regulation | Key Requirement | SLA |
|---|---|---|
| GDPR | DSAR, Right to Erasure, Consent | 30 days |
| CCPA | Opt-out, DSAR, No sale | 45 days |
| HIPAA | PHI + BAA + 6yr retention | 60 days breach notification |

- BAA must be signed **before** any PHI is processed in Salesforce
- Privacy Center: handles DSAR, Right to Erasure — **licensed add-on**
- Right to Erasure: handle ALL related objects, not just Contact record
- Anonymization: replace PII fields with null — record stays, PII removed

---

## DOMAIN 5: Integration & Connectivity (15%)

### Salesforce Connect
- External Objects: API name ends in **`__x`**
- Data stored in **external system** (not Salesforce storage)
- Row limit: **100 per page load** by default
- Adapters: OData 2.0, OData 4.0, **Apex Custom**, Cross-Org
- **External Lookup**: External Object → External Object (using External ID)
- **Indirect Lookup**: External Object → Salesforce Object (using External ID on SF object)
- NOT supported: Apex triggers, standard reports, roll-up summaries, sharing rules
- Salesforce Connect: **licensed add-on** — not included in base

### Platform Events vs. CDC vs. PushTopics
| Feature | Platform Events | CDC | PushTopics (legacy) |
|---|---|---|---|
| Replay window | 72 hours | 72 hours | 24 hours |
| Published by | Apex, Flow, REST API | Salesforce automatically | Salesforce automatically |
| Delivery guarantee | At-least-once | At-least-once | At-least-once |
| Custom payload | Yes | No (change event schema) | SOQL-based |

**CDC UPDATE events**: contain only **changed fields** (not full record)  
**CDC changeTypes**: CREATE, UPDATE, DELETE, UNDELETE, **MERGE**  
**CDC daily limit**: **5 million events** per 24 hours  
**CDC MERGE event**: contains master record ID + absorbed record IDs  
**Platform Event max payload**: **1 MB**  
**Idempotent consumer design**: required for at-least-once delivery systems

### Integration Architecture Decision Guide
| Need | Pattern |
|---|---|
| Real-time external data in SF UI, no storage | Salesforce Connect (External Objects) |
| React to Salesforce record changes in real-time | CDC + CometD subscriber |
| Custom business event from Salesforce to external | Platform Events |
| Async processing decoupling within Salesforce | Platform Events |
| Near-real-time data sync to data warehouse | CDC → MuleSoft → Snowflake/etc. |
| Legacy polling integration | Replace with CDC |

---

## Common Exam Traps

1. **Formula fields** cannot be indexed and cannot be used in selective WHERE clauses
2. **Skinny tables** are created by Salesforce Support — not by customers
3. **Custom indexes** are requested from Salesforce Support — not self-service
4. **Index exists ≠ index used** — non-selective queries bypass indexes
5. **CDC UPDATE events** = changed fields only, not the full record
6. **PushTopics** replay window = 24 hours (not 72)
7. **Junction object OWD** = most restrictive parent OWD
8. **UPSERT** requires an External ID field as the key
9. **BAA** must be signed before PHI enters Salesforce
10. **Big Object records are immutable** — no update, no individual delete
11. **`insertImmediate()`** is required for Big Object inserts, not standard DML
12. **Long text area** fields cannot be indexed or used in selective SOQL WHERE
13. **Not all standard fields are indexed** — BillingCity, Phone, Email are NOT indexed by default
14. **Sandbox skinny tables** reset on full sandbox refresh — must re-request
15. **GDPR Right to Erasure** must handle ALL related objects, not just the Contact
