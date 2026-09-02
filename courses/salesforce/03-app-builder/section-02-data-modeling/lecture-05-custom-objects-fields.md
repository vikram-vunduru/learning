# L05: Custom Objects & Fields

## Exam Domain
Data Modeling & Management — 22% of exam weight

---

## Core Concepts

### Custom Object Settings
When creating a custom object, three settings matter most for the exam: (1) **Allow Reports** — whether records on this object appear in the report builder; (2) **Allow Activities** — whether Tasks and Events can be related to records on this object; (3) **Track Field History** — whether field changes are logged (up to 20 fields per object). These can be changed after creation.

### The Name Field
Every custom object automatically gets a Name field. You choose the data type: **Auto Number** (Salesforce generates sequential IDs like "JOB-0001") or **Text** (users type a name). A third option is **Record Name = Text** and then separately enable auto-numbering — but in practice the exam tests Auto Number vs Text. Choose Auto Number when records need system-generated IDs; choose Text when users provide meaningful names.

### Field Types and When to Use Each
The most commonly tested field types: **Text** (free-form, up to 255 chars), **Text Area (Long)** (up to 131,072 chars, no HTML), **Rich Text Area** (HTML + images, up to 131,072 chars), **Number/Currency/Percent** (numeric), **Checkbox** (boolean true/false), **Date/Date Time** (calendar picker), **Picklist** (single select from defined values), **Multi-Select Picklist** (multiple selections), **Lookup** (link to another object), **Master-Detail** (tight parent-child relationship), **Formula** (read-only, calculated), **Roll-Up Summary** (aggregate from MD children).

### Field-Level Security Defaults
New custom fields are **hidden by default** for all profiles except System Administrator. This is the most common new-field "why can't I see it" issue. After creating a field, always go to Field Accessibility (or Profile FLS settings) to make it visible to other profiles.

### Field History Tracking
Tracks the old value, new value, date/time, and user for field changes. Up to **20 fields per object**. History records are stored in a related list and kept for **18 months** (older records are purged). This is for audit purposes only — you cannot use field history in formulas or flows.

---

## PTA / SA Relevance

**In architecture:** Field type decisions matter for integrations. Text fields accept any string — great for flexibility, bad for data quality. Picklists enforce a controlled vocabulary but need governance (who can add values?). For fields that external systems will use as matching keys, always use External ID checkboxes.

**Data quality:** Multi-Select Picklists are a data modeling anti-pattern at scale — they cannot be used in roll-up summaries, and SOQL querying them requires `INCLUDES` operator, which is less performant. If a customer asks "can I select multiple stages?", the real question is whether they need a junction object instead.

**Field history limitations:** 18-month retention is often not enough for compliance needs. Healthcare and financial services customers frequently need longer audit trails — they'll need a custom solution (Flow writing to a custom history object) or a third-party archiving tool.

---

## Architecture / How It Works

```
Custom Object Field Type Decision Tree:
                                                               
Is the value user-typed text?                                 
  ├─ Short (≤255 chars) ──────────────────► Text              
  ├─ Long prose (no formatting) ──────────► Text Area (Long)  
  └─ Long prose with formatting/images ──► Rich Text Area     
                                                               
Is the value a number?                                        
  ├─ Dollar amount ────────────────────────► Currency         
  ├─ Percentage ───────────────────────────► Percent          
  └─ Plain number ─────────────────────────► Number           
                                                               
Is the value constrained to a set of options?                 
  ├─ One selection allowed ────────────────► Picklist         
  └─ Multiple selections allowed ─────────► Multi-Select Picklist
                                                               
Is the value a date or time?                                  
  ├─ Date only ────────────────────────────► Date             
  └─ Date + Time ──────────────────────────► Date/Time        
                                                               
Is the value true/false?
  └─ ─────────────────────────────────────► Checkbox         
                                                               
Is it a relationship to another object?                       
  ├─ Loose link (both objects independent) ► Lookup           
  └─ Tight parent-child (child depends on parent)             
                                     ────► Master-Detail      
                                                               
Is it calculated from other fields?
  └─ ─────────────────────────────────────► Formula           
```

**Limitations:**
- Text fields cannot be used as aggregate targets (SUM, MIN, MAX) in Roll-Up Summary
- Multi-Select Picklist fields cannot be in Roll-Up Summary filter criteria
- Formula fields are read-only — users cannot edit them
- Checkbox fields cannot be blank/null — they are always true or false

```
Field-Level Security Flow for New Custom Fields:
┌──────────────────────────────────────────────────────────────────┐
│  Field Created ──► Default State: Hidden for all profiles        │
│                    EXCEPT System Administrator                   │
│                                                                  │
│  To make visible:                                                │
│  Setup → Object Manager → [Object] → Fields → [Field]           │
│       → Set Field-Level Security → Edit = ✓ or Read-Only = ✓    │
│                                                                  │
│  OR: Setup → Profiles → [Profile] → Field-Level Security        │
│       → Find field → Set to Visible or Read-Only                │
└──────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- FLS must be set per profile — there is no "apply to all profiles" button for a new field
- Permission Sets can also grant FLS access on top of a profile's FLS settings
- System Administrators bypass FLS — they always see all fields

---

## Key Facts to Memorize
- Auto Number Name field: system-generates IDs (e.g., JOB-0001); Text Name field: user provides name
- New custom fields hidden by default for all profiles except Sys Admin
- Field history tracking: up to 20 fields per object, 18-month retention
- Rich Text Area supports HTML and images; Text Area (Long) is plain text only
- Text field max = 255 characters; Text Area (Long) and Rich Text Area max = 131,072 characters
- Multi-Select Picklist: cannot use in Roll-Up Summary, SOQL uses `INCLUDES` operator
- External ID checkbox: marks a field as the external system's key; enables upsert via API
- Checkbox field = boolean only (true/false); cannot be null

---

## Exam Traps
- **New fields are hidden by default.** If a user can't see a new field, the first check is FLS — not the page layout.
- **"Allow Reports" is an object-level setting.** If an object doesn't appear in report builder, check whether "Allow Reports" is enabled on the object, not the user's permissions.
- **Auto Number vs. Text Name.** Auto Number is ideal for records where the name has no meaning to users (case numbers, order IDs). Text is for records where users provide a meaningful name.
- **Field history tracking is capped at 20 fields.** If you need to track a 21st field, you must untrack an existing one.
- **Multi-Select Picklist has SOQL limitations.** If a scenario describes reporting or roll-up on a multi-select field, the answer involves limitations — this field type doesn't participate in standard roll-ups.

---

## Practice Questions

**Q:** A company creates a new custom field "Annual Budget__c" (Currency) on the Account object. A finance manager reports they can see the field in reports but cannot see it when editing an Account record. What are the two possible causes?
**A:** (1) Field-Level Security — the field may be set to Read-Only for their profile (explains seeing it in reports but not being able to edit). (2) Page Layout — the field may not be on the edit page layout for their profile/record type (explains not seeing it at all on the record). FLS read-only would show the field but prevent editing; layout exclusion would hide it from the page entirely.

**Q:** An App Builder needs to track job requisition IDs (auto-generated sequential numbers like "REQ-00001") on a custom Requisition__c object. What field configuration achieves this?
**A:** Set the Name field data type to "Auto Number" when creating the object. Configure the display format (e.g., "REQ-{0000}") and starting number. Salesforce will generate sequential IDs automatically for each new record.

**Q:** A company needs to track up to 5 skills selected from a list on a Contact record. Which field type should be used, and what is a key limitation?
**A:** Multi-Select Picklist. Key limitation: Multi-Select Picklist fields cannot be used in Roll-Up Summary fields and querying them in SOQL requires the `INCLUDES` or `EXCLUDES` operators, not the standard `=` operator.
