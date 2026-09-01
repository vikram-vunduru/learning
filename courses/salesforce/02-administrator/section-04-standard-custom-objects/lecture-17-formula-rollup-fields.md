# L17: Formula & Roll-Up Summary Fields

## 🎯 Learning Objectives
- Build formula fields using common functions and operators, including cross-object formulas
- Configure Roll-Up Summary fields using COUNT, SUM, MIN, and MAX aggregation types
- Identify the constraints on both formula and roll-up summary fields and when each cannot be used

## 📊 SLIDES

### Slide 1: Formula Fields — The Basics
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │  NEW FORMULA FIELD: Discounted Amount                           │
  │  Return Type:  Currency                                         │
  │  Formula:      Amount * Discount__c / 100                       │
  ├──────────────────────────────────────────────────────────────────┤
  │  RECORD — Opportunity: "Acme Renewal"                           │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │  Amount:              $5,000.00                            │ │
  │  │  Discount (%):        10                                   │ │
  │  │  Discounted Amount:   $4,500.00   ← formula result         │ │
  │  │                                     (read-only)            │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                  │
  │  ⚠ Value is NEVER stored in the database                        │
  │    Recalculated every time the record is loaded or queried       │
  └──────────────────────────────────────────────────────────────────┘
```
**Content:**
- Formula fields are **read-only** fields that calculate their value dynamically at runtime
- The value is **never stored** in the database — it is computed every time the record is loaded or queried
- Can reference fields on the same record or on related parent objects (cross-object formulas)
- Return types: Text, Number, Currency, Percent, Date, Date/Time, Checkbox (Boolean)
- Created at: **Setup > Object Manager > [Object] > Fields & Relationships > New > Formula**
**Speaker Notes:** Because formula fields calculate at runtime, they always reflect current data. Change the underlying field values and the formula result updates instantly — no save required. However, this means formula fields cannot be used as the source for Roll-Up Summary filters because they are not stored values.

### Slide 2: Formula Operators and Syntax
**Visual:**
```
  ┌─────────────────┬──────────────────┬────────────────────────────────┐
  │  CATEGORY       │  OPERATOR        │  EXAMPLE                       │
  ├─────────────────┼──────────────────┼────────────────────────────────┤
  │  Arithmetic     │  +  -  *  /  ^   │  Amount * 0.9                  │
  │                 │                  │  Price ^ 2  (exponent)         │
  ├─────────────────┼──────────────────┼────────────────────────────────┤
  │  Text / Concat  │  &               │  FirstName & " " & LastName    │
  │                 │                  │  (literal space in "quotes")   │
  ├─────────────────┼──────────────────┼────────────────────────────────┤
  │  Comparison     │  =   <>          │  Stage = "Closed Won"          │
  │                 │  >   <           │  Amount > 100000               │
  │                 │  >=  <=          │  CloseDate >= TODAY()          │
  ├─────────────────┼──────────────────┼────────────────────────────────┤
  │  Logical        │  &&  (AND)       │  (Amount > 0) && (Stage="Won") │
  │                 │  ||  (OR)        │  (A = "X") || (B = "Y")        │
  ├─────────────────┼──────────────────┼────────────────────────────────┤
  │  Grouping       │  ( )             │  (A + B) * C                   │
  └─────────────────┴──────────────────┴────────────────────────────────┘
  Strings must be in "double quotes"   │   Field references use no quotes
```
**Content:**
- **Arithmetic:** + (add), - (subtract), * (multiply), / (divide), ^ (exponent)
- **Text:** & (concatenate strings), e.g., FirstName & " " & LastName
- **Logical:** = (equals), <> (not equals), > < >= <= (comparisons), && (AND), || (OR)
- **Parentheses:** control order of operations
- Strings must be wrapped in **"double quotes"**; field references use no quotes
**Speaker Notes:** Concatenation with & is one of the most useful formula patterns. Combining First Name and Last Name into a Full Name display field, or building a formatted address string, are classic admin use cases. Remember to add literal spaces in double quotes between tokens, like " " between first and last name.

### Slide 3: Common Formula Functions
**Visual:**
```
  ┌────────────────────────────────┬────────────────────────────┬───────────────────────────────┐
  │  FUNCTION                      │  WHAT IT DOES              │  EXAMPLE                      │
  ├────────────────────────────────┼────────────────────────────┼───────────────────────────────┤
  │  IF(cond, true_val, false_val) │  Conditional logic         │  IF(Amount>1000,"High","Low") │
  │  BLANKVALUE(field, default)    │  Returns default if blank  │  BLANKVALUE(Discount__c, 0)   │
  │  ISBLANK(field)                │  True if blank OR null     │  IF(ISBLANK(Email),"N/A",     │
  │                                │  (preferred over ISNULL)   │     Email)                    │
  │  ISNULL(field)                 │  True if null only         │  IF(ISNULL(Amount), 0, Amt)   │
  │                                │  (misses empty strings)    │                               │
  │  TEXT(value)                   │  Converts to text string   │  TEXT(Stage)                  │
  │  VALUE(text)                   │  Converts text to number   │  VALUE(Qty_Text__c)           │
  │  DATE(year, month, day)        │  Constructs a date         │  DATE(2025, 12, 31)           │
  │  TODAY()                       │  Returns today's date      │  CloseDate - TODAY()          │
  │  NOW()                         │  Returns current datetime  │  NOW() - CreatedDate          │
  │  LEN(text)                     │  Character count           │  LEN(Description__c)          │
  └────────────────────────────────┴────────────────────────────┴───────────────────────────────┘
  Prefer ISBLANK over ISNULL — handles both empty strings AND null values
```
**Content:**
- **IF(condition, true_value, false_value)** — conditional logic
- **BLANKVALUE(field, default)** — returns default if field is blank; use instead of null checks
- **ISNULL(field)** / **ISBLANK(field)** — checks for blank/null; ISBLANK handles both blank and null
- **TEXT(value)** — converts non-text value (picklist, number) to text
- **VALUE(text)** — converts text to number
- **DATE(year, month, day)** — constructs a date
- **TODAY()** / **NOW()** — returns current date or date/time
- **LEN(text)** — returns length of a text string
**Speaker Notes:** ISBLANK is preferred over ISNULL for new formula fields because ISBLANK handles both empty text strings and null values, while ISNULL only handles null. On old fields that predate this distinction, ISNULL may still appear. Know both for the exam but prefer ISBLANK in practice.

### Slide 4: Cross-Object Formulas
**Visual:**
```
  CROSS-OBJECT FORMULA on Opportunity

  Formula expression:  Account.Industry
  ──────────────────────────────────────────────────────────────────────
  Opportunity  ──(lookup)──▶  Account  ──▶  Industry (field value)
     │                           │
     │  Account.Industry         │  1 relationship hop
     └───────────────────────────┘

  CUSTOM RELATIONSHIP SYNTAX:
  ──────────────────────────────────────────────────────────────────────
  Custom_Account__c  →  the field API name (ends in __c)
  Custom_Account__r  →  use __r for traversal in formulas

  Example:  Custom_Account__r.Name

  MAXIMUM DEPTH: 5 relationship hops
  ──────────────────────────────────────────────────────────────────────
  Opportunity → Account → Parent Account → Owner → Profile → Name
       1            2           3             4        5    (field)
  ──────────────────────────────────────────────────────────────────────
  Formula syntax:  Account.Parent.Owner.Profile.Name
```
**Content:**
- Cross-object formulas reference fields on **parent objects** by traversing lookup or master-detail relationships
- Syntax: use dot notation — **RelationshipFieldName.FieldName** (e.g., Account.Industry, Owner.Name)
- For custom relationships: use **__r** instead of **Id** (e.g., Custom_Account__r.Name)
- Maximum **5 levels** of relationship traversal (e.g., Opportunity → Account → Parent Account → Owner → Profile → Name)
- Cross-object formulas count toward the formula field limit on the source object
**Speaker Notes:** Cross-object formulas are powerful but have a depth limit of 5 hops. Each hop is one relationship traversal. In practice, going beyond 3 levels is rare. The __r notation for custom relationships trips up many admins — remember that the lookup field's API name ends in __c but the relationship traversal uses __r instead.

### Slide 5: Roll-Up Summary Fields
**Visual:** An Account record showing a "Total Opportunity Amount" field with the value $250,000, below which is a small related list showing 5 Opportunity records each with their Amount values that sum to $250,000
**Content:**
- Roll-Up Summary fields aggregate values from **child records** onto the **master object** in a master-detail relationship
- Four aggregation types: **COUNT**, **SUM**, **MIN**, **MAX**
- **COUNT** — counts all child records (or matching records with a filter)
- **SUM** — sums a numeric field across all child records
- **MIN / MAX** — finds the minimum or maximum value of a field across child records
- Created at: **Setup > Object Manager > [Master Object] > Fields & Relationships > New > Roll-Up Summary**
**Speaker Notes:** Roll-Up Summary fields must be created on the master object — not the child. The data lives on child records but the summary is surfaced on the master. You can apply a filter to count or sum only specific child records — for example, only count Opportunities where Stage = "Closed Won."

### Slide 6: Roll-Up Summary Constraints
**Visual:** A "Cannot Use Roll-Up Summary" warning card listing prohibited scenarios with X marks
**Content:**
- **Requires Master-Detail:** Roll-Up Summary fields are NOT available for Lookup relationships
- **Cannot reference formula fields** in the roll-up field value (because formulas are not stored)
- **Cannot reference cross-object formula fields** in filter criteria
- **Limit of 25** Roll-Up Summary fields per object
- **Not available** on the detail side of a master-detail (only on the master)
- Changes to child records trigger a **recalculation** — in large orgs this may be asynchronous
**Speaker Notes:** The most common exam trap is asking whether you can create a Roll-Up Summary in a Lookup relationship — the answer is always no. If a question describes a scenario that needs a roll-up but the relationship is a Lookup, the solution involves either changing it to a Master-Detail (if appropriate) or using a workaround like a scheduled Apex or Flow.

### Slide 7: When to Use Formula vs. Roll-Up Summary
**Visual:** A decision flowchart: "Does the calculation reference child records?" → Yes → Roll-Up Summary / No → "Does it reference fields on the same or parent record?" → Yes → Formula Field
**Content:**
- **Use Formula Field when:** calculating from fields on the same record or parent records, displaying conditional text, transforming data types, building dynamic URLs or links
- **Use Roll-Up Summary when:** aggregating data from child records in a master-detail relationship (count of Opportunities, total contract value, latest close date)
- Neither can be directly edited by users (both are read-only)
- Both can be used in reports, list views, and validation rules
**Speaker Notes:** A common admin design mistake is trying to create a Roll-Up Summary on a record that has a Lookup relationship. Always check the relationship type first. If roll-up is needed and the relationship is a Lookup, you may need to convert it to Master-Detail — but weigh the trade-offs of cascade delete and the 2 master-detail limit.

### Slide 8: Advanced Formula Patterns
**Visual:** Three formula example cards showing: (1) Age calculation with TODAY()-BirthDate__c, (2) Discount percentage display using TEXT(Discount__c * 100) & "%", (3) Days until close using CloseDate - TODAY()
**Content:**
- **Age/Duration:** TODAY() - Date_Field__c returns a number of days
- **Days until close:** CloseDate - TODAY() → returns days remaining as a number
- **Conditional display:** IF(Amount > 100000, "High Value", "Standard") → returns text based on a threshold
- **Null handling:** BLANKVALUE(Commission__c, 0) → prevents formula errors when a field is blank
- **Text from picklist:** TEXT(Stage) → converts picklist value to text for use in concatenation
**Speaker Notes:** The TODAY() subtraction pattern is one of the most useful formula patterns in Salesforce. Days Until Close, Days Since Last Activity, Days Overdue on a Case — all are simple Date arithmetic formulas. Just remember that subtracting two dates returns a number (not a date), so set your formula return type to Number.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 17 — the final lecture in Section 4. We are covering two of the most powerful declarative tools in Salesforce: Formula Fields and Roll-Up Summary Fields.

Let me start with formula fields. A formula field calculates its value at runtime and is completely read-only — users cannot edit it, and Salesforce does not store the result in the database. Every time the record is loaded or queried, the formula runs and returns the current value. This means formula fields are always up to date automatically.

The return type matters: your formula must produce a value of the correct type — Text, Number, Currency, Percent, Date, DateTime, or Checkbox. You pick the return type when creating the field, then write your formula expression.

Common operators: arithmetic uses standard symbols. Text concatenation uses the ampersand. Logical comparisons use equals, not-equals, and comparison operators. Parentheses control order of operations just like math.

The functions you need to know for the exam: IF is your conditional — if this condition is true, return this, otherwise return that. BLANKVALUE handles fields that might be empty — return a default value instead of an error. ISBLANK checks whether a field is blank. TEXT converts picklists and numbers to text strings. TODAY returns today's date; NOW returns the current datetime. These five get you through 80% of formula challenges.

Cross-object formulas let your formula reference fields on parent objects through the relationship. Account.Industry on an Opportunity formula gives you the Industry from the related Account. For custom relationships, use __r instead of __c in the relationship name. You can traverse up to 5 levels deep.

Now for Roll-Up Summary fields. These are different from formula fields in a fundamental way — they aggregate data from child records and actually store the result on the master object. You can COUNT records, SUM a field, or find the MIN or MAX value across all child records. You can also filter the aggregation — count only Closed Won Opportunities, or sum only line items with Quantity greater than 10.

The critical constraint: Roll-Up Summary fields are ONLY available on the master side of a master-detail relationship. They do not work with Lookup relationships. This is one of the most tested exam facts. If you need aggregation on a Lookup relationship, you need a Flow or Apex to maintain it — it is not declarative.

Other constraints to know: you cannot reference formula fields in the roll-up calculation (because formula values are not stored), the limit is 25 Roll-Up Summary fields per object, and recalculation is triggered by changes to child records.

Decision rule: if the calculation involves child records, use Roll-Up Summary. If it involves the same record or parent records, use Formula. Both are read-only. Both are powerful. Master them both.

## 🔔 EXAM TIPS
- **Formula fields are not stored:** Formula field values are calculated at runtime and never persisted to the database. This is why they cannot be referenced in Roll-Up Summary field calculations.
- **Roll-Up Summary requires Master-Detail:** This is the single most tested fact about Roll-Up Summary fields. Lookup relationships do not support Roll-Up Summary — only master-detail does.
- **25 Roll-Up Summary limit:** Maximum 25 Roll-Up Summary fields per object. Know this number.
- **ISBLANK vs. ISNULL:** ISBLANK handles both truly null fields and text fields that contain empty strings. Prefer ISBLANK over ISNULL for new formulas. Old formulas may still use ISNULL.
- **Cross-object formula depth:** Cross-object formulas can traverse up to 5 relationship levels. Custom relationship traversal uses __r (not __c) in the formula path.
- **5 levels cross-object:** The maximum number of relationship traversals in a cross-object formula is 5. This limit may appear on the exam in context of formula complexity questions.

## ✅ LECTURE SUMMARY
- Formula fields calculate a value at runtime using operators and functions; they are read-only, never stored, and always current
- Common formula functions: IF, BLANKVALUE, ISBLANK, TEXT, VALUE, TODAY, NOW — these cover the majority of exam and real-world use cases
- Cross-object formulas traverse lookup/master-detail relationships using dot notation, up to 5 levels deep; custom relationships use __r in the path
- Roll-Up Summary fields aggregate child record data (COUNT/SUM/MIN/MAX) onto the master object in a master-detail relationship; they store the result
- Roll-Up Summary fields cannot be used with Lookup relationships, cannot reference formula fields in the calculation, and are limited to 25 per object

## ❓ MINI QUIZ

**Q1:** An admin wants to create a field on the Account object that automatically counts the number of related Opportunity records where Stage = "Closed Won." What type of field should be created?
- A) Formula field with a COUNTIF expression
- B) Roll-Up Summary field on Account, with a filter for Stage = "Closed Won"
- C) Formula field on Account using a cross-object reference to Opportunity
- D) A Roll-Up Summary field on the Opportunity object

**Answer:** B — Roll-Up Summary fields are created on the master object (Account) in a master-detail relationship to aggregate child record data. The filter option allows counting only Opportunities where Stage = "Closed Won." Note: the standard Account-Opportunity relationship is a lookup, not master-detail, so this would require a custom master-detail relationship or a Flow in practice — but the field type answer is Roll-Up Summary.

**Q2:** A formula field on Opportunity uses the expression: IF(Amount > 50000, "Tier 1", "Tier 2"). What is the correct return type for this formula field?
- A) Number
- B) Checkbox
- C) Text
- D) Currency

**Answer:** C — The formula returns a text string ("Tier 1" or "Tier 2"), so the return type must be set to Text.

**Q3:** Which of the following correctly describes the difference between ISNULL and ISBLANK in Salesforce formula fields?
- A) ISNULL works only on number fields; ISBLANK works only on text fields
- B) ISBLANK handles both null values and empty text strings; ISNULL only handles null values
- C) They are identical and interchangeable in all formula contexts
- D) ISNULL is for formula fields; ISBLANK is for validation rules only

**Answer:** B — ISBLANK handles both null values and empty text strings (a text field that has been cleared but not deleted), making it the preferred choice for blank checks. ISNULL only evaluates whether the field value is truly null, which can miss empty strings in text fields.
