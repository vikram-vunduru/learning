# L32: Validation Rules

## 🎯 Learning Objectives
- Explain how validation rules work and when they fire
- Write validation rule formulas using ISBLANK, ISNULL, LEN, CONTAINS, ISPICKVAL, and ISCHANGED
- Configure error message text and error message location (top of page vs. specific field)
- Understand when validation rules fire in the order of execution
- Implement profile-based bypass patterns for validation rules

## 📊 SLIDES

### Slide 1: What Is a Validation Rule?
**Visual:**
```
  User saves record
        │
        ▼
  Salesforce evaluates ALL Validation Rules
        │
        ├── All rules PASS ──▶ Record saves ✓
        │
        └── Any rule FAILS ──▶ Error message shown
                                Record NOT saved ✗

  Rule structure:
  ┌─────────────────────────────────────────────────────┐
  │ IF (error condition formula is TRUE)                │
  │   THEN show error message                           │
  │                                                     │
  │ Example: AND(ISPICKVAL(Stage,"Closed Won"),          │
  │              ISBLANK(CloseDate))                    │
  │ → "Close Date required for Closed Won"              │
  └─────────────────────────────────────────────────────┘
```
**Content:**
- A **validation rule** checks that data entered by users meets specific requirements before saving
- Validation rules contain a **formula** that evaluates to TRUE or FALSE
- **CRITICAL:** If the formula evaluates to **TRUE**, Salesforce **BLOCKS the save** and displays an error message
- If the formula evaluates to **FALSE**, the save proceeds normally
- Think of it as: TRUE = something is WRONG, FALSE = everything is OK
- Located: Object Manager → [Object] → Validation Rules
**Speaker Notes:** The most important thing to remember about validation rules — and the most common source of exam confusion — is that TRUE means error. This is counterintuitive. You're writing a formula that identifies BAD data, not good data. So if you want to require that the Phone field is filled in, you write "ISBLANK(Phone)" — this returns TRUE (error) when Phone is blank. When Phone has a value, the formula returns FALSE and the save proceeds.

### Slide 2: Common Validation Rule Functions
**Visual:**
```
  ┌────────────────┬───────────────────────────────────┬──────────────────────────────────┐
  │ Function       │ Syntax / Notes                     │ Example                          │
  ├────────────────┼───────────────────────────────────┼──────────────────────────────────┤
  │ ISBLANK        │ ISBLANK(field) — for text fields   │ ISBLANK(Phone)                   │
  │ ISNULL         │ ISNULL(field) — number/date fields │ ISNULL(Amount)                   │
  │ LEN            │ LEN(text) → character count        │ LEN(Description) < 10            │
  │ CONTAINS       │ CONTAINS(text, "string")           │ CONTAINS(Name, "Test")           │
  │ ISPICKVAL      │ ISPICKVAL(field, "value")          │ ISPICKVAL(Stage, "Closed Won")   │
  │ ISCHANGED      │ TRUE if field changed this save    │ ISCHANGED(CloseDate)             │
  │ ISNEW          │ TRUE only on record creation       │ ISNEW()                          │
  │ NOT            │ NOT(condition) — reverses result   │ NOT(ISBLANK(Phone))              │
  │ AND            │ AND(c1, c2) — both must be TRUE    │ AND(ISNEW(), ISBLANK(Phone))     │
  │ OR             │ OR(c1, c2) — either must be TRUE   │ OR(ISBLANK(Phone), ISBLANK(Email))│
  └────────────────┴───────────────────────────────────┴──────────────────────────────────┘
```
**Content:**
- **ISBLANK(field):** TRUE if the field is blank (empty); works for text fields; replaces ISNULL for text
- **ISNULL(field):** TRUE if the field is null; best for number/date fields (use ISBLANK for text)
- **LEN(text):** Returns the character count of a text field
- **CONTAINS(text, search_string):** TRUE if the text contains the search string
- **ISPICKVAL(picklist_field, "value"):** TRUE if the picklist equals the specified value
- **ISCHANGED(field):** TRUE if the field value was changed during the current save
- **ISNEW():** TRUE if the record is being inserted (new record, not an edit)
- **NOT(condition):** Reverses TRUE/FALSE
- **AND(cond1, cond2):** TRUE if both conditions are TRUE
- **OR(cond1, cond2):** TRUE if either condition is TRUE
**Speaker Notes:** These functions are the building blocks of virtually all validation rule formulas. ISBLANK vs. ISNULL is a classic exam trap — use ISBLANK for text fields (it handles empty strings too), and ISNULL for number and date fields. ISPICKVAL is essential for picklist validation. ISCHANGED and ISNEW are powerful for conditional rules — you can write rules that only fire when a field changes, or only when a new record is created, not on edits.

### Slide 3: Writing Validation Rule Formulas — Examples
**Visual:**
```
  ┌── Example 1: Require Phone when Type = Customer ──────────────────┐
  │  AND(                                                              │
  │    ISPICKVAL(Type, "Customer"),   ← checks picklist value         │
  │    ISBLANK(Phone)                 ← TRUE when Phone is empty      │
  │  )                                                                 │
  │  → Error when BOTH conditions are TRUE                            │
  └────────────────────────────────────────────────────────────────────┘

  ┌── Example 2: Prevent Close Date in the past ──────────────────────┐
  │  CloseDate < TODAY()                                               │
  │  → Error when Close Date is before today's date                   │
  └────────────────────────────────────────────────────────────────────┘

  ┌── Example 3: Require Description when Stage = Closed Lost ────────┐
  │  AND(                                                              │
  │    ISPICKVAL(StageName, "Closed Lost"),  ← stage check            │
  │    ISBLANK(Description)                  ← empty description?     │
  │  )                                                                 │
  │  → Error: requires loss reason when closing as lost               │
  └────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **Require Phone when Account Type = Customer:**
  ```
  AND(
    ISPICKVAL(Type, "Customer"),
    ISBLANK(Phone)
  )
  ```
  → Error when Type is "Customer" AND Phone is blank
- **Prevent Close Date in the past:**
  ```
  CloseDate < TODAY()
  ```
  → Error when Close Date is before today
- **Require Reason when Stage changes to Closed Lost:**
  ```
  AND(
    ISPICKVAL(StageName, "Closed Lost"),
    ISBLANK(Description)
  )
  ```
**Speaker Notes:** Let's decode these examples. The first rule fires only when the Account Type is Customer AND the Phone is blank — if either condition is false, the whole AND is false and the save proceeds. The second rule is elegant — dates can be compared directly with TODAY(). The third rule requires a Description when Stage is Closed Lost — a common business requirement to capture loss reasons. Notice each formula returns TRUE only when there's a problem.

### Slide 4: Error Message and Error Location
**Visual:**
```
  Error Location: TOP OF PAGE              Error Location: SPECIFIC FIELD
  ┌──────────────────────────────┐         ┌──────────────────────────────┐
  │ ⚠ Error                      │         │ Account Name  [Acme Corp   ] │
  │ Phone number is required     │         │                               │
  │ for Customer accounts.       │         │ Phone         [           ]  │
  └──────────────────────────────┘         │ ▲ Phone is required for      │
  │ Account Name  [Acme Corp   ] │         │   Customer accounts.         │
  │ Phone         [           ] │         │                               │
  │ Type          [Customer    ] │         │ Type          [Customer    ] │
  └──────────────────────────────┘         └──────────────────────────────┘
    Use for: multi-field / complex errors    Use for: single-field errors
                                             (best user experience)
```
**Content:**
- **Error Message:** The text displayed to the user when the rule fires
  - Write clear, user-friendly messages: "Phone number is required for Customer accounts"
  - Avoid technical formula language in the message
- **Error Location:**
  - **Top of Page:** Error banner appears at the top — use when the error involves multiple fields or a complex condition
  - **Specific Field:** Error appears next to that field — best user experience when the error relates directly to one field
- Both options are in the validation rule setup screen
- A single validation rule can only have ONE error location
**Speaker Notes:** The error message is what your users will see, so make it helpful and actionable. Instead of "Validation Rule 1 Failed," write "Please enter a phone number for accounts of type Customer." For error location, placing the error next to the specific field gives users better visual guidance. Use "Top of Page" for complex multi-field validations where it's not clear which specific field to highlight.

### Slide 5: Order of Execution & When Validation Rules Fire
**Visual:**
```
  Order of Execution (Save Operation)

  1. ┌────────────────────────────────────┐
     │ System Validation                  │
     │ (data type checks, required fields │
     │  via page layout)                  │
     └────────────────┬───────────────────┘
                      │
  2.                  ▼
     ┌────────────────────────────────────┐
     │ Custom Validation Rules            │  ◀── fires here
     └────────────────┬───────────────────┘
                      │
  3.                  ▼
     ┌────────────────────────────────────┐
     │ Duplicate Rules                    │
     └────────────────┬───────────────────┘
                      │
  4.                  ▼
     ┌────────────────────────────────────┐
     │ Record Saved to Database  ✓        │
     └────────────────┬───────────────────┘
                      │
  5.                  ▼
     ┌────────────────────────────────────┐
     │ After-Save Triggers / Workflows    │
     └────────────────────────────────────┘

  Fires on: UI save │ API calls │ Data Loader │ Flow DML
```
**Content:**
- Validation rules fire during the **save operation** (DML)
- **Order of execution in the admin context** (no Apex code):
  1. System validation (data type checks, required fields via page layout)
  2. Custom validation rules
  3. Duplicate rules
  4. Record is saved to the database
- **In Apex context:** Before-triggers fire BEFORE validation rules; validation rules run during DML
- Validation rules fire on:
  - Manual record save by a user
  - API updates
  - Data Loader imports
  - Flow record creates/updates (after-save flows may bypass in some configurations)
**Speaker Notes:** The order of execution is tested in the context of Apex development, but admins should understand the basics. Validation rules fire on any data save operation, including API and Data Loader — they're not just for UI saves. This means a Data Loader import will fail if imported records violate validation rules. To import data that doesn't yet meet validation requirements (e.g., loading historical data), you may need to temporarily deactivate rules or use a bypass pattern.

### Slide 6: ISCHANGED and ISNEW — Conditional Validation
**Visual:**
```
  ┌── ISCHANGED: Only fires when a field is modified ─────────────────┐
  │                                                                    │
  │  AND(ISCHANGED(CloseDate), CloseDate < TODAY())                   │
  │                                                                    │
  │  ✓ Fires: user edits CloseDate to a past date                     │
  │  ✗ Skips: record saves but CloseDate is unchanged                 │
  │  ✗ Skips: CloseDate was already in past before this edit          │
  └────────────────────────────────────────────────────────────────────┘

  ┌── ISNEW / NOT(ISNEW): Control when rules apply ───────────────────┐
  │                                                                    │
  │  ISNEW()           → TRUE only on record creation (insert)        │
  │  NOT(ISNEW())      → TRUE only on record edit (not create)        │
  │                                                                    │
  │  NOT(ISNEW()) && ISBLANK(Phone)                                   │
  │  → Fires only on edits when Phone is blank                        │
  │  → Does NOT fire when a brand-new record is created               │
  └────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **ISCHANGED(field):** TRUE only if the field was modified in the current save
  - Useful to avoid blocking saves of records that already have the "bad" value (historical data)
  - Example: Only validate new entries, not existing data
- **ISNEW():** TRUE only when saving a brand-new record
  - Use to apply rules only on record creation, not edits
- **NOT(ISNEW()):** TRUE only on edits (not new records)
- **Combining:** `AND(ISCHANGED(StageName), ISPICKVAL(StageName, "Closed Lost"), ISBLANK(Description))`
  - Only fires when Stage is being changed TO Closed Lost AND Description is blank
**Speaker Notes:** ISCHANGED and ISNEW are powerful tools for controlling when validation fires. A classic use case: you have existing records where Phone is blank (legacy data). If you add a "Phone required" validation rule, ALL saves of those old records will fail. By adding ISNEW() to the rule, you only enforce it on new records. Or use AND(ISCHANGED(Phone), ISBLANK(Phone)) to only fire when someone explicitly clears the phone field.

### Slide 7: Profile-Based Bypass Patterns
**Visual:**
```
  ┌── Profile-Based Bypass ───────────────────────────────────────────┐
  │                                                                    │
  │  AND(                                                              │
  │    $Profile.Name != "System Administrator",  ← bypass admins      │
  │    ISBLANK(Phone)                                                  │
  │  )                                                                 │
  │                                                                    │
  │  ⚠ Fragile: silently breaks if profile is renamed                 │
  └────────────────────────────────────────────────────────────────────┘

  ┌── Custom Permission Bypass (Best Practice) ───────────────────────┐
  │                                                                    │
  │  AND(                                                              │
  │    NOT($Permission.Bypass_Validation_Rules),  ← permission check  │
  │    ISBLANK(Phone)                                                  │
  │  )                                                                 │
  │                                                                    │
  │  ✓ Assign permission to migration users or admin permission sets  │
  │  ✓ Works across profiles; more flexible and maintainable          │
  └────────────────────────────────────────────────────────────────────┘
```
**Content:**
- Sometimes certain users (admins, data migration users) need to bypass validation rules
- **Profile-based bypass:** Include a profile check in the formula
  ```
  AND(
    $Profile.Name != "System Administrator",
    ISBLANK(Phone)
  )
  ```
  → Rule fires for all profiles EXCEPT System Administrator
- **Custom Permission bypass (best practice):**
  ```
  AND(
    NOT($Permission.Bypass_Validation_Rules),
    ISBLANK(Phone)
  )
  ```
  → Grant the custom permission to bypass; more flexible than hardcoding profile names
- **Important:** Using profile name strings is brittle (breaks if profile is renamed); prefer Custom Permissions
**Speaker Notes:** Profile-based bypasses are necessary for data migration, admin overrides, and integration user exceptions. The $Profile.Name approach works but is fragile — if someone renames the profile, the bypass silently breaks. The best practice is to create a Custom Permission (e.g., "Bypass_Validation_Rules"), then reference it in the formula using $Permission. Assign the custom permission to profiles or permission sets that need the bypass. This approach is more maintainable and flexible.

### Slide 8: Validation Rule Best Practices
**Visual:**
```
  Validation Rule Best Practices Checklist

  ┌────┬──────────────────────────────────────────────────────────────┐
  │ ✓  │ Write clear error messages — tell users what to fix and why  │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Test all scenarios before activating                         │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Check impact on Data Loader and API integrations             │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Use Custom Permissions for bypasses (not $Profile.Name)      │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Use ISCHANGED/ISNEW to avoid blocking legacy data saves      │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Don't over-validate — too many rules slow saves              │
  ├────┼──────────────────────────────────────────────────────────────┤
  │ ✓  │ Document the business requirement in the Description field   │
  └────┴──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Write clear error messages** — tell users exactly what to fix and why
- **Test extensively** before activation — consider all record scenarios
- **Check impact on integrations and Data Loader** — rules fire on API calls too
- **Deactivate before bulk data operations** — or use a bypass pattern
- **Use ISCHANGED/ISNEW** to avoid blocking saves of existing records with legacy data
- **Prefer Custom Permissions over $Profile.Name** for bypass logic
- **Don't over-validate** — too many rules slow down saves and frustrate users
- **Document rules** — add description text explaining the business requirement
**Speaker Notes:** Governance is important for validation rules. In large orgs, dozens of validation rules across many objects can create complex interactions that are hard to debug. Always document the business requirement in the Description field of the rule. Test with multiple profiles and scenarios. Be especially careful with rules on frequently-used objects like Leads and Contacts — a poorly written rule can block all data imports or integration updates.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 32 — Validation Rules. Validation rules are one of the most powerful data quality tools in Salesforce, and they appear frequently on the Admin exam. Let's make sure you understand them inside and out.

A validation rule contains a formula that evaluates when a record is saved. Here's the critical thing to memorize: if the formula returns TRUE, Salesforce blocks the save and shows an error message. If the formula returns FALSE, the save proceeds normally. TRUE equals error, FALSE equals success. This is backwards from how many people think about it — you're writing a formula that identifies BAD data.

Let's look at the key functions. ISBLANK checks if a text field is empty — use this instead of ISNULL for text fields. ISNULL is better for number and date fields. LEN returns character count, useful for enforcing minimum or maximum lengths. ISPICKVAL checks if a picklist field equals a specific value. CONTAINS checks if text includes a specific string.

Two very powerful functions for conditional validation: ISCHANGED and ISNEW. ISCHANGED returns TRUE only if the field was modified in this save operation. ISNEW returns TRUE only when a record is being created for the first time. These let you write rules like "only require the Description when Stage is being CHANGED to Closed Lost" — so existing records aren't affected.

For error configuration, you write an error message that users will see, and you choose where it appears: at the top of the page as a banner, or next to a specific field. Field-specific errors give users better guidance.

Validation rules fire on all save operations: user saves, API calls, Data Loader imports, and Flow record operations. This means they apply universally — a Data Loader import will fail if records violate your rules. For data migration, temporarily deactivate rules or use a bypass pattern.

The cleanest bypass approach uses Custom Permissions. Create a permission like "Bypass_Validation_Rules" and reference it in your formula with $Permission.Bypass_Validation_Rules. Assign this to your data migration user or system admin permission set, and the rule skips for them. This is more robust than checking $Profile.Name.

## 🔔 EXAM TIPS
- **TRUE = Error:** The formula must return TRUE to trigger the error. FALSE allows the save. Never forget this.
- **ISBLANK vs. ISNULL:** Use ISBLANK for text fields, ISNULL for number/date fields. ISNULL on a text field misses empty strings.
- **ISPICKVAL:** Required for picklist field comparisons — you cannot use == for picklists in validation formulas.
- **Data Loader:** Validation rules fire on API calls and Data Loader imports, not just UI saves.
- **ISCHANGED/ISNEW:** Only available in validation rule formulas (not everywhere); ISCHANGED cannot be used in workflow rule criteria.
- **Error Location:** Can only have one error location per validation rule — either top of page or one specific field.
- **Profile Bypass:** $Profile.Name != "System Administrator" bypasses for admins; better to use $Permission for custom permission-based bypasses.

## ✅ LECTURE SUMMARY
- Validation rules fire during save; formula returning TRUE = error, FALSE = save proceeds
- Key functions: ISBLANK (text), ISNULL (numbers/dates), ISPICKVAL (picklists), ISCHANGED (field changed?), ISNEW (new record?)
- Error message should be user-friendly; error location can be top of page or next to a specific field
- Validation rules fire on ALL saves: UI, API, Data Loader, Flows
- Profile-based and Custom Permission-based bypass patterns let privileged users skip validation
- Use ISCHANGED/ISNEW to avoid blocking saves of existing records with legacy data
- Document rules in the Description field; test all scenarios before activating

## ❓ MINI QUIZ

**Q1:** An admin writes the following validation rule formula on the Opportunity object: `ISPICKVAL(StageName, "Closed Won") && ISBLANK(CloseDate)`. When does this rule trigger an error?
- A) When Stage is Closed Won and Close Date has a value
- B) When Stage is Closed Won and Close Date is blank
- C) When Stage is NOT Closed Won and Close Date is blank
- D) When Close Date is blank, regardless of Stage

**Answer:** B — AND (&&) requires both conditions to be TRUE for the rule to fire. The rule triggers when Stage equals "Closed Won" AND Close Date is blank. If either condition is FALSE, the save proceeds.

**Q2:** A company is doing a one-time data migration using Data Loader to import 10,000 Contact records. Some records do not have phone numbers, but a validation rule requires phone numbers for all contacts. What is the BEST approach?
- A) Set error location to "Top of Page" instead of the field
- B) Temporarily deactivate the validation rule, perform the import, then reactivate it
- C) Use a different import tool that bypasses validation rules
- D) The data cannot be imported if it violates validation rules

**Answer:** B — Temporarily deactivating the validation rule is the standard approach for data migrations. Since validation rules fire on all DML operations including Data Loader, the import will fail for records that violate the rule. After the migration is complete, reactivate the rule for ongoing enforcement. Alternatively, a Custom Permission bypass could be assigned to the migration user.

**Q3:** An admin wants to write a validation rule that ONLY fires when a new record is being created (not on edits to existing records). Which function should be included in the formula?
- A) ISCHANGED(Id)
- B) ISNEW()
- C) NOT(ISCHANGED(CreatedDate))
- D) $User.Id != null

**Answer:** B — ISNEW() returns TRUE only when a brand-new record is being created (an insert operation), not on updates to existing records. Including ISNEW() in the formula makes the rule apply only during record creation.
