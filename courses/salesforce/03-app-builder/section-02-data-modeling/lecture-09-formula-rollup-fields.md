# L09: Formula & Roll-Up Summary Fields

## 🎯 Learning Objectives
- Build formula fields using key functions and operators to solve business calculation requirements
- Explain cross-object formulas and their depth limits
- Configure roll-up summary fields on Master-Detail parent objects
- Debug common formula field errors involving null values and type mismatches

---

## 📊 SLIDES

### Slide 1: Formula Fields — What They Are
**Visual:** Side-by-side comparison. Left: "Regular Field — user types value, stored in database." Right: "Formula Field — no user input, value calculated at runtime from formula definition. Read-only icon shown." Callout: "Formula fields update dynamically whenever the record is viewed — no manual update needed."
**Content:**
- **Formula field:** A read-only field whose value is calculated by a formula expression at runtime
- The formula can reference: other fields on the same record, fields on related records (cross-object), global variables (current user, today's date)
- **Read-only:** Users cannot edit a formula field — there is no edit mode for formula values
- Formula recalculates every time the record is loaded or when a dependency changes
- Available output types: Text, Number, Currency, Percent, Date, Date/Time, Checkbox
- **Maximum formula length:** 3,900 characters (though keep them as concise as possible)
**Speaker Notes:** Formula fields are one of the most powerful declarative tools in Salesforce. They turn data from static values that users type into dynamic, calculated insights. Instead of asking users to manually calculate a deal margin, a formula field does it automatically from the Opportunity Amount and Cost fields. The key rule — and it's on the exam — is that formula fields are read-only. Always. If your business requirement says users should be able to override a calculated value, a formula field is the wrong tool.

### Slide 2: Key Formula Functions
**Visual:** Reference card showing eight functions with syntax: IF(logical, true_val, false_val), CASE(field, val1, result1, else), BLANKVALUE(field, default), ISBLANK(field), ISNULL(field), TEXT(value), VALUE(text), AND(cond1, cond2).
**Content:**
- **IF(condition, true_value, false_value):** Returns one of two values based on a condition. The most-used formula function.
- **CASE(expression, val1, result1, val2, result2, ..., else):** Switch-style logic — matches a value and returns corresponding result.
- **BLANKVALUE(field, default):** Returns the field value, or the default if the field is blank/null.
- **ISBLANK(field):** Returns TRUE if the field is blank (works for all field types, including text).
- **ISNULL(field):** Returns TRUE if the field is null — **only reliable for number/currency/date fields** (not text fields).
- **TEXT(value):** Converts a non-text value to text (used when mixing types in a formula).
- **VALUE(text):** Converts a text value to a number.
**Speaker Notes:** These eight functions will cover the vast majority of formulas you'll ever write. IF is the workhorse — almost every conditional formula uses IF or nests IFs for multiple conditions. A common interview question is: "What's the difference between ISBLANK and ISNULL?" ISNULL returns true only for null numeric or date fields. ISBLANK returns true for both null and empty text — it's the better choice for text fields. For the exam, when you see a formula involving text fields checking for empty values, ISBLANK is the correct function.

### Slide 3: Date and Text Formula Functions
**Visual:** Function reference card showing: TODAY() (returns today's date), NOW() (returns current date/time), DATEVALUE(datetime) (converts DateTime to Date), DATE(year, month, day) (creates a date value), TEXT(picklist_field) (converts picklist to text for comparisons), MONTH(date), YEAR(date), DAY(date).
**Content:**
- **TODAY():** Returns today's date (Date type). Use for date-based calculations.
- **NOW():** Returns current date and time (Date/Time type). Includes the time component.
- **DATEVALUE(date_time):** Converts a Date/Time field to a Date — strips the time component.
- **DATE(year, month, day):** Constructs a specific date value from year, month, day numbers.
- **TEXT(picklist_field):** Converts a picklist value to text — required when using picklist values in string operations.
- Formula with dates: `TODAY() - CloseDate` returns the number of days between today and the close date (a Number).
**Speaker Notes:** Date arithmetic in Salesforce formulas is straightforward — subtract two date values and you get the number of days as a number. TODAY() minus CloseDate gives you deal age in days. But watch the type: TODAY() returns a Date, NOW() returns a Date/Time. You can't subtract a Date/Time from a Date directly without converting. DATEVALUE() is how you strip the time component off a Date/Time field to make it compatible with Date calculations. These type compatibility issues are where most formula errors come from.

### Slide 4: Cross-Object Formulas
**Visual:** Three-level hierarchy diagram. Level 1: Opportunity record. Level 2: Account record (parent via AccountId). Level 3: Parent Account record (parent of Account via ParentId). Arrow chain labeled "2 levels deep." Label: "Formulas can traverse up to 5 levels of relationships."
**Content:**
- Cross-object formulas **reference fields on related objects** using the `__r` relationship notation
- Syntax: `RelationshipName__r.FieldName` (for custom relationships) or `RelationshipName.FieldName` (for standard)
- **Maximum depth: 5 levels** of relationships traversable in a single formula
- Example on Opportunity: `Account.BillingCity` (1 level — standard Lookup)
- Example on a child custom object: `Project__r.Account__r.BillingCity` (2 levels — custom lookups)
- Cross-object formulas are read-only — you're reading parent data, not writing it
**Speaker Notes:** Cross-object formulas let child records display information from their parents without any automation or code. A Contact can show the Account's industry. An Opportunity line item can show the parent Opportunity's close date. You traverse the relationship using the relationship name with `__r` appended. The 5-level depth limit is generous enough for most use cases, but it exists because deep traversals can impact performance. In practice, if you're going more than 3 levels deep, consider whether a Roll-Up Summary or Flow-populated field would be cleaner.

### Slide 5: Formula Field Debugging Tips
**Visual:** Four-panel "common errors" guide. Panel 1: "Type mismatch — mixing Text + Number → wrap in TEXT() or VALUE()." Panel 2: "Null error — Number field could be blank → wrap in BLANKVALUE(field, 0)." Panel 3: "Division by zero — divide formula → check divisor with IF(denominator = 0, 0, numerator/denominator)." Panel 4: "Circular reference — Field A references Field B which references Field A → not allowed."
**Content:**
- **Type mismatch:** A formula that concatenates Text + Number will fail — use TEXT() to convert the number
- **Null/blank handling:** If a number field could be empty, the formula may error — use BLANKVALUE(field, 0) to default to zero
- **Division by zero:** Always guard division operations with an IF check on the denominator
- **Circular reference:** Formulas cannot reference each other in a loop — Salesforce will reject this
- **Syntax errors:** The formula editor shows inline errors — check for unclosed parentheses and missing commas
**Speaker Notes:** Formula debugging is mostly about type mismatches and null handling. The two most common errors in real-world formulas: mixing a number and text in a concatenation without TEXT(), and a number field being blank when the formula tries to do arithmetic on it, causing an error on those specific records. BLANKVALUE is your null safety net. Wrap any number or currency field in BLANKVALUE(field, 0) if there's any chance it might be empty. For the exam, recognize each of these error patterns from the description and know the fix.

### Slide 6: Roll-Up Summary Fields — Overview
**Visual:** Diagram showing Master Object "Project__c" with a Roll-Up Summary field "Total_Hours__c = SUM." Below it, Detail Object "Time_Entry__c" records: 4 hours, 6 hours, 8 hours. Arrow pointing up to Total_Hours__c showing "18 hours — calculated automatically."
**Content:**
- **Roll-Up Summary fields** aggregate data from child records in a Master-Detail relationship onto the parent
- **Only available on the master object** in a Master-Detail relationship — not on Lookups, not on the child
- Four aggregate functions: **COUNT** (count of child records), **SUM** (sum of a numeric field), **MIN** (minimum value), **MAX** (maximum value)
- Optional **filter criteria:** Only include child records that match specific conditions in the roll-up calculation
- Updates automatically when child records are created, updated, or deleted
**Speaker Notes:** Roll-Up Summary fields are the automated aggregation tool that every app builder relies on. No Flow, no Apex — just configure the field and Salesforce handles the rest. The COUNT function counts how many child records exist — great for showing "Number of Open Cases" on an Account. SUM adds up a numeric field across all children — perfect for total invoice amounts or total hours logged. MIN and MAX find the earliest/latest date or lowest/highest number. The filter criteria option is powerful — you can SUM only records where Status = Closed, for example.

### Slide 7: Roll-Up Summary Filter Criteria
**Visual:** Screenshot-style mockup of the Roll-Up Summary field configuration showing Filter Criteria section. Example: "Include only child records where Status__c equals Closed." Shows how this creates a "Count of Closed Records" roll-up rather than counting all child records.
**Content:**
- Filter criteria on a Roll-Up Summary limits which child records are included in the calculation
- Example: COUNT of child records WHERE Status = 'Active' — only counts active child records
- Example: SUM of Amount WHERE CloseDate < TODAY() — sums amounts from past-due records
- Filter criteria uses the same field-operator-value structure as other Salesforce filters
- Without filter criteria, the roll-up includes ALL child records
- Filter criteria makes roll-ups much more flexible — multiple roll-up fields can look at the same child object with different filters
**Speaker Notes:** Filter criteria transforms Roll-Up Summary from a simple "total all children" calculation into a targeted metric. You can have a "Total Revenue" roll-up (SUM all amounts) AND a "Total Overdue Revenue" roll-up (SUM amounts where Due Date is before today) on the same parent object, looking at the same child records. This is how you build meaningful KPI fields on parent records without any code. Think of filter criteria as a WHERE clause for your roll-up.

### Slide 8: Formulas vs. Roll-Up Summary — Choosing the Right Tool
**Visual:** Decision flowchart. "Do you need to aggregate data from child records?" → Yes → "Is the relationship Master-Detail?" → Yes → "Use Roll-Up Summary." → No (Lookup relationship) → "Use Flow to populate a field, or a formula cannot aggregate — different approach needed." → No (not aggregating, just calculating) → "Is the data on the same record or parent record?" → "Same record or parent" → "Use Formula Field."
**Content:**
- **Use Formula when:** Calculating from fields on the same record, accessing parent fields via cross-object formula, conditional logic on a single record
- **Use Roll-Up Summary when:** Aggregating (count, sum, min, max) from child records in a Master-Detail
- **Lookup relationship aggregation:** Neither formula nor roll-up summary works — use a Flow to update a field on the parent
- Formula fields recalculate at runtime — no stored value (except text formulas cache under some conditions)
- Roll-Up Summary fields recalculate when child records change — near-real-time updates
**Speaker Notes:** The key design question is: am I working with one record, or am I aggregating across multiple records? Single record = formula field. Multiple records = roll-up summary (if Master-Detail) or Flow (if Lookup). This decision tree is testable in the exam in several ways. A scenario might describe a Lookup relationship and ask how to total child record values — the answer is NOT a roll-up summary (that requires Master-Detail). It's a Flow. Conversely, if the scenario describes a Master-Detail and you need an aggregate, the declarative answer is always a Roll-Up Summary field, not a Flow — it's cleaner, automatic, and requires no code or automation.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 09 — Formula and Roll-Up Summary Fields. These two field types are the computational workhorses of Salesforce declarative development. Together they let you do powerful calculations and aggregations without any code.

Slide 1 lays the foundation: formula fields are read-only, runtime-calculated fields. Every time you view a record, the formula recalculates. There's no stored value that gets stale — it's always current. And there is no way for a user to edit a formula field value. It's calculated. Always.

Slide 2 covers the key formula functions. IF and CASE are your conditional tools. BLANKVALUE is your null-safety net. ISBLANK versus ISNULL — know the difference. ISBLANK works for all types including text; ISNULL only works reliably for numbers and dates. When in doubt on text fields, use ISBLANK. TEXT() and VALUE() are your type conversion tools when you need to mix field types.

Slide 3 is the date function slide. TODAY() returns a Date — use it for "days since" calculations. NOW() returns a Date/Time — use it when you need the current time. DATEVALUE() strips the time off a Date/Time field so you can do date-only math. And TEXT() converts picklist values to strings when you need to compare or concatenate them.

Slide 4 is cross-object formulas. Up to 5 levels deep. You traverse relationships using the relationship name plus `__r`. For standard relationships, just use the object name — Account.BillingCity from a Contact formula. For custom relationships, use the custom field's relationship name with `__r`.

Slide 5 is debugging. Type mismatches, null handling, division by zero, circular references. These are the four categories of formula errors. Know the pattern and know the fix for each.

Slide 6 introduces Roll-Up Summary fields. Master-Detail only — always, without exception. Four functions: COUNT, SUM, MIN, MAX. Automatic updates when child records change. No Flow or code required.

Slide 7 shows you the filter criteria option on Roll-Up Summaries — use it to count or sum only child records matching specific conditions. This is what lets you have multiple different roll-ups on the same master object looking at the same children with different filters.

Slide 8 is your decision guide: formula for single-record calculations, Roll-Up Summary for aggregating Master-Detail children, Flow for aggregating Lookup children. This decision is directly testable on the exam.

---

## 🔔 EXAM TIPS
- **Roll-Up Summary is Master-Detail only:** Every exam scenario involving aggregating child values will either have Master-Detail (use Roll-Up Summary) or Lookup (need a different approach — Flow). Know which is which before answering.
- **Formula fields are always read-only:** Users cannot edit them. If the scenario requires users to override a calculated value, a formula field is the wrong choice.
- **ISBLANK vs. ISNULL:** Use ISBLANK for text fields checking if empty. ISNULL works for Number/Currency/Date but is unreliable for text. When in doubt, ISBLANK is safer.
- **Cross-object formula depth:** Up to 5 levels of relationships. The `__r` notation traverses a custom relationship; standard relationships use the relationship name directly.
- **Roll-Up Summary with filter criteria:** The filter limits which child records are included. This makes one master object able to carry multiple distinct aggregate metrics from the same child object.
- **Aggregating Lookup children:** Roll-Up Summary cannot be used on Lookup relationships. If a scenario describes a Lookup and asks how to sum child values, the declarative answer is a Flow that updates a field on the parent.

---

## ✅ LECTURE SUMMARY
- Formula fields are read-only, runtime-calculated fields — users cannot edit them; they recalculate when a record is viewed
- Key functions: IF/CASE for conditional logic, BLANKVALUE for null safety, ISBLANK for text null checking, TEXT/VALUE for type conversion, TODAY/NOW for dates
- Cross-object formulas traverse relationships using `__r` notation, up to 5 levels deep
- Roll-Up Summary fields aggregate child record data (COUNT, SUM, MIN, MAX) on the master object — only available in Master-Detail relationships
- Use formula fields for single-record calculations; use Roll-Up Summary for Master-Detail child aggregation; use Flow for Lookup relationship aggregation

---

## ❓ MINI QUIZ

**Q1:** An App Builder needs to display the total dollar amount of all closed Invoice records on the parent Account. The Invoice__c object has a Master-Detail relationship to Account, and there is an Amount__c currency field on Invoice__c. What is the best way to create this total on the Account?
- A) Create a formula field on Account using a cross-object formula to sum Invoice amounts
- B) Create a Roll-Up Summary field on Account using SUM of Invoice__c.Amount__c
- C) Create a Flow that runs nightly and updates a custom Number field on Account
- D) Create a Roll-Up Summary field on Invoice__c using SUM aggregation

**Answer:** B — Roll-Up Summary fields are available on the master object (Account) in a Master-Detail relationship. A SUM Roll-Up on Account aggregating Invoice__c.Amount__c is the cleanest declarative solution. Roll-Up Summaries cannot be created on the detail object (Invoice__c), and cross-object formulas cannot aggregate multiple records.

**Q2:** A formula field on Contact uses the expression: `Account.Industry + " - " + TEXT(AnnualRevenue)`. When viewing a Contact record, the formula displays an error. What is the most likely cause?
- A) Formula fields cannot reference the Account object from a Contact record
- B) The AnnualRevenue field is a Number type and cannot be concatenated with text without the VALUE() function
- C) The AnnualRevenue field is a Currency type; TEXT() correctly converts it, but Account.Industry may be blank, causing an error
- D) The "+" operator is not valid for string concatenation in Salesforce — use "&" instead

**Answer:** D — Salesforce uses the "&" operator for string concatenation in formulas, not "+". The correct formula would be: `Account.Industry & " - " & TEXT(AnnualRevenue)`. Using "+" with text fields causes a type error because "+" is reserved for numeric addition.

**Q3:** An App Builder needs a formula that shows the word "Overdue" if the Due_Date__c field on a custom object is in the past, "Due Today" if it equals today, and "On Track" for all other cases. Which formula function is most appropriate for this multi-condition logic?
- A) IF function with nested IFs
- B) CASE function with multiple value matches
- C) BLANKVALUE function to handle null dates
- D) ISNULL function to check for empty dates

**Answer:** A — Nested IF functions handle multi-branch conditional logic based on different conditions (not matching values). CASE matches discrete values, not ranges or comparisons like "in the past" or "equals today." The formula would be: `IF(Due_Date__c < TODAY(), "Overdue", IF(Due_Date__c = TODAY(), "Due Today", "On Track"))`.
