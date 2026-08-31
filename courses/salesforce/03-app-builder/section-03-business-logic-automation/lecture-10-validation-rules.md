# L10: Validation Rules

## 🎯 Learning Objectives
- Understand how validation rules fire and where they fit in Salesforce's order of execution
- Write accurate validation rule formulas using key functions like ISBLANK, ISPICKVAL, ISCHANGED, and REGEX
- Apply bypass techniques using Custom Permissions and recognize exam-relevant traps around ISBLANK vs. ISNULL

## 📊 SLIDES

### Slide 1: What Is a Validation Rule?
**Visual:** Diagram showing a user clicking Save → validation formula evaluated → if TRUE, error displayed; if FALSE, record saved
**Content:**
- A validation rule enforces data quality by preventing records from being saved when specific conditions are met
- The rule contains a formula that returns TRUE or FALSE
- When the formula evaluates to **TRUE**, the save is blocked and the configured error message is displayed
- When the formula evaluates to **FALSE**, the record saves normally
- Validation rules live on the object and are configured in Setup > Object Manager > [Object] > Validation Rules
**Speaker Notes:** The most important concept to lock in for the exam is that validation fires on TRUE, not FALSE. This trips up many candidates who expect a "validation passes" mindset. Think of the formula as describing the error condition, not the success condition.

---

### Slide 2: Order of Execution — Where Validation Fires
**Visual:** Vertical flowchart with numbered steps: 1) User clicks Save → 2) Required field checks → 3) Validation Rules → 4) Before Triggers (Apex) → 5) Record committed → 6) After Triggers → 7) Workflow / Process Builder (legacy)
**Content:**
- Validation rules fire **after** required field and field format checks
- Validation rules fire **before** Apex before-triggers
- All validation rules on an object are evaluated **independently** — multiple rules can fire at the same time
- If any rule returns TRUE, the entire save operation is halted
- Validation fires whether the save originates from the UI, API, Apex, or automation
**Speaker Notes:** The exam frequently tests the order of execution. Know that required-field checks come first, then validation rules, then Apex triggers. Also remember that all validation rules are evaluated — there is no short-circuiting after the first failure.

---

### Slide 3: Core Validation Functions — Part 1
**Visual:** Two-column table: Function name on the left, plain-English description and example on the right
**Content:**
- **ISBLANK(field)** — returns TRUE if a text, formula, or URL field has no value; preferred for text fields
- **ISNULL(field)** — returns TRUE if a number, date, or checkbox field has no value; do NOT use for text fields
- **ISPICKVAL(field, "value")** — returns TRUE if a picklist field equals the specified value; use instead of = operator for picklists
- **ISNEW()** — returns TRUE only on record creation (insert); use to run rules only on new records
- **ISCHANGED(field)** — returns TRUE if the field value changed during this save operation
- **PRIORVALUE(field)** — returns the field's value before the current edit; use with ISCHANGED
**Speaker Notes:** ISBLANK vs. ISNULL is one of the most tested distinctions. Text fields always use ISBLANK because an empty string is not null. Number and date fields use ISNULL. ISPICKVAL is the only correct way to compare a picklist field value in a formula — the equality operator will not work.

---

### Slide 4: Core Validation Functions — Part 2
**Visual:** Code-style blocks showing sample formula snippets for each function
**Content:**
- **NOT(condition)** — negates a boolean; useful for "must be filled in" rules: `NOT(ISBLANK(Phone))`
- **AND(cond1, cond2, ...)** — all conditions must be TRUE; equivalent to &&
- **OR(cond1, cond2, ...)** — at least one condition must be TRUE; equivalent to ||
- **LEN(text)** — returns character count; useful for enforcing minimum/maximum length
- **CONTAINS(text, substring)** — returns TRUE if substring is found within text
- **REGEX(text, regex_pattern)** — validates text against a regular expression pattern; powerful for format enforcement (SSN, ZIP, phone formats)
**Speaker Notes:** AND and OR can be written as operators (&& / ||) or as functions — both are valid. REGEX is particularly useful for enforcing specific formats like phone numbers or postal codes. LEN combined with a comparison operator is the standard way to enforce field length constraints.

---

### Slide 5: Error Message Placement
**Visual:** Screenshot mockup of a record detail page showing (A) an error banner at the top of the page and (B) an inline error message directly beneath a specific field
**Content:**
- Error location option 1: **Top of Page** — displays the message in the standard error banner at the top of the record form
- Error location option 2: **Field** — displays the message directly beneath the specified field, highlighting it in red
- The error message text should be descriptive and user-friendly
- Best practice: place the error next to the specific field whenever possible for better UX
- The error message and location are configured in the validation rule definition, not in the formula
**Speaker Notes:** For the exam, know that you choose the error location at the rule level, not in the formula itself. Placing the error on a specific field helps end users immediately identify which field caused the failure. Top-of-page errors are better when the rule spans multiple fields.

---

### Slide 6: Bypass Techniques
**Visual:** Two-path diagram: Path A (Custom Permission check in formula — green checkmark) vs. Path B ($Profile.Name check in formula — yellow warning triangle)
**Content:**
- **Custom Permission bypass (recommended):** Add `$Permission.Bypass_Validation_Rules` (a Custom Permission API name) to the formula using `NOT($Permission.Bypass_Validation_Rules)`. Users assigned a permission set with that custom permission skip the rule.
- **Profile bypass (not recommended for production):** `$Profile.Name = "System Administrator"` — hardcodes a profile name, brittle, does not scale, and profile-based access is being phased out in favor of permission sets
- **ISNEW/ISCHANGED conditions:** Narrow the rule to fire only in specific scenarios (e.g., insert only, or only when a particular field changes) — reduces unintended triggers during data migrations
- Always test bypass logic before deploying to production
**Speaker Notes:** The exam will test that you know Custom Permissions are the recommended, scalable bypass approach. Profile name checks are considered an anti-pattern for production because renaming a profile breaks the formula silently. Custom Permissions can be granted via permission sets, making them flexible.

---

### Slide 7: Troubleshooting Validation Rules
**Visual:** Checklist graphic with five items, each with a checkbox icon
**Content:**
- **Syntax errors:** Use the "Check Syntax" button in the formula editor before saving; it catches typos and mismatched parentheses
- **Wrong function for field type:** Verify ISBLANK vs. ISNULL based on the field's data type
- **Picklist comparison:** Always use ISPICKVAL, never `=` for picklist fields
- **Testing:** Use a test record and walk through the formula manually; the formula editor's error messages indicate the line and column of the issue
- **Multiple rules firing:** Activate rules one at a time in a sandbox to isolate which rule is causing unexpected behavior
- **API vs. UI behavior:** Validation rules fire from the API by default; add bypass logic for integrations and data loads if needed
**Speaker Notes:** The formula editor's built-in syntax checker is your first line of defense. When rules fire unexpectedly during data migrations, a common fix is to use a Custom Permission to bypass validation during the load window, then revoke the permission afterward.

---

### Slide 8: Common Exam Scenarios
**Visual:** Table with three columns: Scenario, Correct Approach, Common Mistake
**Content:**
- Scenario 1: "Require Phone only if Account Type is Customer" → `AND(ISPICKVAL(Type, "Customer"), ISBLANK(Phone))` — Mistake: using `Type = "Customer"` instead of ISPICKVAL
- Scenario 2: "Prevent changing Close Date after Closed Won" → `AND(ISPICKVAL(StageName, "Closed Won"), ISCHANGED(CloseDate))` — Mistake: forgetting ISCHANGED, so rule fires even when date is not touched
- Scenario 3: "Enforce 10-digit phone format" → `NOT(REGEX(Phone, "[0-9]{10}"))` — Mistake: using CONTAINS when an exact format match is needed
- Scenario 4: "Run rule only on new records" → wrap the condition with `AND(ISNEW(), ...)` — Mistake: not using ISNEW, causing rule to fire on edits too
**Speaker Notes:** These four patterns cover the most commonly tested validation rule scenarios. Mastering the ISPICKVAL, ISBLANK, ISCHANGED, and ISNEW functions will answer the majority of validation rule exam questions.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 10 on Validation Rules. By the end of this lecture, you'll be able to build, troubleshoot, and bypass validation rules confidently — and more importantly, you'll be prepared for the specific scenarios the Platform App Builder exam loves to test.

Let's start with the fundamental concept. A validation rule is a formula that describes an error condition. When that formula evaluates to TRUE, Salesforce blocks the save and displays your error message. When it evaluates to FALSE, everything is fine and the record saves normally. This is the number-one thing candidates get backwards — the formula describes when something is *wrong*, not when something is *right*.

Now, where does validation fit in the order of execution? After the user clicks Save, Salesforce first checks for required fields and field format issues. Then it evaluates all validation rules. Then Apex before-triggers run. One critical detail: all validation rules on an object are evaluated independently and simultaneously — there is no short-circuiting. If three rules fire at once, the user sees three error messages.

Let's talk about functions, because the exam is heavy on formula syntax. The distinction between ISBLANK and ISNULL is tested almost every time. Use ISBLANK for text, URL, email, and formula fields — an empty text field contains an empty string, which is not null. Use ISNULL for number, date, currency, and checkbox fields. Getting this backwards is one of the most common exam mistakes.

For picklist fields, always use ISPICKVAL. You cannot compare a picklist with the equals operator in a validation formula. So instead of `StageName = "Closed Won"`, you write `ISPICKVAL(StageName, "Closed Won")`. Every time. No exceptions.

ISCHANGED and PRIORVALUE are your tools for detecting edits. ISCHANGED returns TRUE if the field value changed during the current save. PRIORVALUE gives you the field's previous value. Use these together to write rules like "once a contract is activated, the start date cannot be changed."

ISNEW is equally important. If your rule should only fire on record creation — not on edits — wrap your conditions inside AND(ISNEW(), ...). This prevents the rule from blocking legitimate edits to existing records.

For bypassing validation rules, the recommended approach is Custom Permissions. You create a custom permission, add it to a permission set, and reference it in your formula using $Permission.YourPermissionApiName. Users with that permission set skip the rule. This is clean, scalable, and permission-set-based — which is where Salesforce is headed. Avoid the profile name approach in production; it's brittle and won't scale.

Finally, let's talk about error placement. When you configure a validation rule, you choose whether the error appears at the top of the page or directly under a specific field. Field-level errors give users a better experience because they immediately see which input is wrong. For rules that span multiple fields, top-of-page errors make more sense.

For troubleshooting: always use the Check Syntax button, verify you're using the right blank-check function for the field type, and test your rules in a sandbox with a real record before deploying. Remember that validation fires from the API as well as the UI — so if you're doing a data migration, plan your bypass strategy in advance.

In the next lecture, we move into Flow Builder, where you'll see how automation can react to the records that pass validation. See you there.

---

## 🔔 EXAM TIPS
- **ISBLANK vs. ISNULL:** Text fields always use ISBLANK; number and date fields use ISNULL. This is tested heavily.
- **ISPICKVAL required for picklists:** The = operator does not work for picklist field comparisons in formulas. Always use ISPICKVAL.
- **TRUE = error fires:** The formula describes the *bad* condition. If the formula is TRUE, the record is blocked.
- **All rules evaluate independently:** Multiple validation rules on one object all fire and can all display errors simultaneously — there is no short-circuit evaluation.
- **Bypass best practice:** Custom Permissions ($Permission.ApiName) are the recommended bypass method; $Profile.Name is an anti-pattern.
- **Order of execution:** Required field checks → Validation Rules → Apex Before Triggers. Validation is NOT the first thing that runs.
- **ISNEW for insert-only rules:** Use AND(ISNEW(), your_condition) to prevent a rule from firing during edits.
- **ISCHANGED for edit detection:** Use to prevent changes to specific fields once a certain status is reached.

---

## ✅ LECTURE SUMMARY
- Validation rules fire when the formula evaluates to TRUE, blocking the save and displaying an error message
- Key functions: ISBLANK (text fields), ISNULL (number/date fields), ISPICKVAL (picklist comparisons), ISCHANGED, ISNEW, PRIORVALUE, NOT, AND, OR, LEN, CONTAINS, REGEX
- All validation rules on an object are evaluated independently — multiple rules can fire simultaneously
- Order of execution: required field checks come first, then validation rules, then Apex before-triggers
- Error messages can be placed at the top of the page or next to a specific field
- Custom Permissions are the recommended bypass technique; avoid hardcoding $Profile.Name in formulas

---

## ❓ MINI QUIZ

**Q1:** A validation rule formula is configured on the Account object. When does the rule prevent the record from saving?
- A) When the formula evaluates to FALSE
- B) When the formula evaluates to TRUE
- C) When the formula evaluates to NULL
- D) When the record is first inserted only

**Answer:** B — Validation rules block the save when the formula returns TRUE. The formula describes the error condition, not the success condition.

---

**Q2:** You need to require the Phone field only when the Account Type picklist equals "Customer." Which formula correctly implements this?
- A) `Type = "Customer" && ISBLANK(Phone)`
- B) `AND(ISPICKVAL(Type, "Customer"), ISBLANK(Phone))`
- C) `AND(ISPICKVAL(Type, "Customer"), ISNULL(Phone))`
- D) `ISPICKVAL(Type, "Customer") || ISBLANK(Phone)`

**Answer:** B — ISPICKVAL is required for picklist comparisons (not the = operator), and ISBLANK is correct for a text Phone field. ISNULL in option C is wrong for a text field. Option D uses OR, which would block any Customer record regardless of phone.

---

**Q3:** A System Administrator wants to bypass all validation rules during a data migration without hardcoding a profile name. What is the recommended approach?
- A) Deactivate all validation rules before the migration and reactivate after
- B) Use `$Profile.Name = "System Administrator"` in every validation formula
- C) Create a Custom Permission and reference it as `NOT($Permission.Bypass_Validation)` in each formula
- D) Set a custom field flag on each record and check it in the formula

**Answer:** C — Custom Permissions are the recommended, scalable approach. They can be granted via a permission set to specific users for the migration window and revoked afterward. Deactivating rules (option A) is risky and error-prone; $Profile.Name (option B) is fragile and an anti-pattern.
