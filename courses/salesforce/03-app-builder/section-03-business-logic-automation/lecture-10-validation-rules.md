# L10: Validation Rules

## Exam Domain
Business Logic & Process Automation — 28% of exam weight

---

## Core Concepts

### How Validation Rules Work
The key thing to understand is the logic is **inverted from what you'd expect**: a validation rule fires (shows an error) when the formula evaluates to **TRUE**. You write the condition for "this is bad data" — when that condition is true, the error message displays. Writing `ISBLANK(Email__c)` as a rule fires the error whenever Email is blank. New developers always try to write "Email is required" — the rule needs to express "Email IS blank" (the error condition).

### Order of Execution
Validation rules fire **before** DML (database insert/update). The full order for a record save: (1) System validations (required fields, field type checks), (2) Apex before triggers, (3) **Validation Rules**, (4) Duplicate Rules, (5) Before-Save Record-Triggered Flows, (6) Record saved to database, (7) After-Save Record-Triggered Flows and Apex after triggers. This means if a validation rule fails, no automation runs — the record never reaches the save step.

### Critical Functions
**ISBLANK(field)** — returns true if the field has no value (works for all types including text). **ISNULL(field)** — returns true if field is null (use for numbers/dates, not text). **ISPICKVAL(field, 'value')** — compares a picklist field to a specific value (don't use `=` for picklists). **ISCHANGED(field)** — true if the field value was modified during this save. **ISNEW()** — true only when the record is being inserted (not updated). **NOT(condition)** — reverses a boolean condition.

### Common Patterns
These three validation rule patterns come up constantly: (1) Required field based on another field's value — `AND(ISPICKVAL(Stage__c, "Closed Won"), ISBLANK(Contract_Signed__c))` (require contract when stage is Closed Won); (2) Read-only field after status change — `AND(NOT(ISNEW()), ISCHANGED(Status__c), ISPICKVAL(PRIORVALUE(Status__c), "Approved"))` (prevent changing status after approval); (3) Date range check — `Close_Date__c < TODAY()` (require future close date).

### Bypassing Validation Rules
The standard bypass mechanism is a **Custom Permission** — create a Custom Permission (e.g., "Bypass_Validations"), assign it via a Permission Set to admin users or integration users, then wrap the validation rule in `NOT($Permission.Bypass_Validations)`. This lets trusted users or APIs skip validation rules when doing migrations or admin overrides.

---

## PTA / SA Relevance

**In architecture reviews:** Validation rules are the most commonly overused automation tool. Customers sometimes have 50+ validation rules on a single object, many of which could be replaced with a better data model (required fields, picklist constraints). Review every validation rule for: (1) Can this be a required field setting instead? (2) Is this logic duplicated across multiple rules? (3) Does this rule have a bypass for API/integration users?

**Integration bypass pattern:** Integration users (API users for Data Loader, ETL tools) often need to bypass validation rules during data migrations. The Custom Permission bypass pattern is the clean way to do this — never disable validation rules in production for a migration.

**Validation rules and Flow interaction:** If a before-save Flow sets a field value and a validation rule checks that field, the validation rule fires AFTER the before-save Flow has set the value. This means the Flow-set value is what gets validated. This is intentional and allows before-save Flows to pre-populate fields that validation rules then check.

---

## Architecture / How It Works

```
Record Save Order of Execution:
┌─────────────────────────────────────────────────────────────────┐
│  1. System Validations (required fields, field type checks)     │
│         │                                                        │
│  2. Apex Before Triggers                                         │
│         │                                                        │
│  3. ► VALIDATION RULES ◄  ── if TRUE → error shown, save stops  │
│         │                                                        │
│  4. Duplicate Rules                                              │
│         │                                                        │
│  5. Before-Save Record-Triggered Flows                           │
│         │                                                        │
│  6. Record committed to database                                 │
│         │                                                        │
│  7. After-Save Record-Triggered Flows                            │
│         │                                                        │
│  8. Apex After Triggers                                          │
│         │                                                        │
│  9. Workflow Rules / Processes (legacy)                          │
└─────────────────────────────────────────────────────────────────┘
Note: If Validation Rule fires (returns TRUE), execution stops at step 3.
No save, no flows, no triggers.
```

**Limitations:**
- Validation rules cannot run conditional on a Flow outcome — they run independently
- Multiple validation rules are evaluated — if two rules both fire, both error messages show
- Validation rules cannot prevent record creation initiated by System Administrator (unless explicitly coded to include Sys Admin)

```
Validation Rule Formula Logic (Inverted):

  Formula returns TRUE  →  ERROR MESSAGE SHOWS  (save blocked)
  Formula returns FALSE →  No error            (save proceeds)

Common Mistake:
  Intent: "Require Email field"
  Wrong:  Email__c != ''          (This means "email is not empty" = TRUE only when email HAS value)
  Right:  ISBLANK(Email__c)       (This means "email is empty" = TRUE when blank = error fires)

  Intent: "Require Close Date when Stage = Closed Won"  
  Right:  AND(
            ISPICKVAL(StageName, "Closed Won"),
            ISBLANK(Close_Date__c)
          )
  (Error fires when: Stage IS Closed Won AND Close Date IS blank)
```

**Limitations:**
- The "TRUE = error" logic is non-intuitive and causes bugs when developers think about it as "validation passes when true"
- Using `=` to compare picklist values instead of `ISPICKVAL` causes runtime errors

```
Key Validation Rule Functions:
┌────────────────────────────────────────────────────────────────────┐
│ Function          │ Returns TRUE when...                           │
├───────────────────┼────────────────────────────────────────────────┤
│ ISBLANK(f)        │ Field has no value (all field types)           │
│ ISNULL(f)         │ Field is null (numbers/dates — not text)       │
│ ISPICKVAL(f, v)   │ Picklist field equals specified value          │
│ ISCHANGED(f)      │ Field value was modified in this save          │
│ ISNEW()           │ Record is being created (not updated)          │
│ NOT(ISNEW())      │ Record is being updated (not created)          │
│ PRIORVALUE(f)     │ Value of field before this save                │
│ $Profile.Name     │ Global var — current user's profile name       │
│ $Permission.Name  │ Global var — user has named custom permission  │
└────────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- `PRIORVALUE()` only works when the record is being updated — on insert it returns null
- `$Permission.Name` requires the Custom Permission to exist before the rule saves
- `$Profile.Name` is a string comparison — typos in the profile name mean the bypass silently fails

---

## Key Facts to Memorize
- Validation rule returns TRUE = error fires, save blocked
- Validation rule returns FALSE = no error, save proceeds
- Order: System Validations → Apex Before → Validation Rules → Before-Save Flows → Save → After-Save Flows
- Use ISPICKVAL() for picklist comparisons — never use `=` directly on a picklist field
- Use ISBLANK() for "is empty" checks on text fields (ISNULL is unreliable for text)
- ISCHANGED() — field modified this save; ISNEW() — record being created
- Custom Permission bypass pattern: wrap rule in `NOT($Permission.Bypass_Name)`
- Validation rules fire before DML — if the rule fires, no automation runs

---

## Exam Traps
- **TRUE = error.** This is the single most tested concept in this topic. The formula returns true when the data is BAD.
- **Use ISPICKVAL for picklists.** `StageName = "Closed Won"` will cause an error in a validation rule — you must use `ISPICKVAL(StageName, "Closed Won")`.
- **Validation rules fire before Flows.** A scenario describing a Flow that should prevent the validation from triggering is logically impossible — validation rules fire before before-save Flows, and definitely before after-save Flows.
- **ISNULL on text fields is unreliable.** Text fields can have an empty string ("") that ISNULL won't catch. Always use ISBLANK for text fields.
- **Admin bypass.** System Administrators bypass sharing rules and some platform features, but NOT validation rules by default. To give admins a bypass, use the Custom Permission pattern.

---

## Practice Questions

**Q:** An App Builder writes a validation rule with the formula: `ISBLANK(Phone)`. When will this validation rule fire (show an error)?
**A:** The rule fires when the Phone field is blank/empty — because the formula returns TRUE when Phone is blank, and a validation rule fires when its formula is TRUE.

**Q:** A validation rule needs to require a "Discount Approval" field when the Discount_Percent__c field is greater than 20. What is the correct formula?
**A:** `AND(Discount_Percent__c > 20, ISBLANK(Discount_Approval__c))` — The rule fires (returns TRUE) when BOTH conditions are true: discount is over 20 AND the approval field is blank.

**Q:** A Data Loader integration user is blocked by validation rules during a historical data migration. What is the recommended solution to allow the migration to proceed without disabling the validation rules?
**A:** Create a Custom Permission (e.g., "Bypass_Validations"), assign it to the integration user via a Permission Set, then wrap each validation rule formula with `NOT($Permission.Bypass_Validations)`. When the integration user runs the load, `$Permission.Bypass_Validations` is TRUE, so NOT(TRUE) = FALSE, and the rule does not fire.
