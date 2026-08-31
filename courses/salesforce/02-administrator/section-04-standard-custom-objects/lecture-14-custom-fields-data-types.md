# L14: Custom Fields & Data Types

## 🎯 Learning Objectives
- Identify all major Salesforce field data types and their appropriate use cases
- Understand the key constraints and behaviors of critical field types such as Picklist, Formula, and Roll-Up Summary
- Apply best practices for choosing the right field type for a business requirement

## 📊 SLIDES

### Slide 1: Why Field Types Matter
**Visual:** A business requirement card that says "Track annual revenue in dollars" with three wrong field type choices crossed out (Text, Checkbox, Date) and the correct answer (Currency) circled
**Content:**
- Choosing the wrong field type causes data quality problems, broken reports, and failed integrations
- Field type is permanent in many cases — you cannot always change it after data is entered
- The right field type enables: proper sorting, filtering, calculations, and data validation
- Salesforce has 25+ field types — the exam tests the most important ~15
**Speaker Notes:** Picking Text for a phone number works visually, but Phone type adds click-to-dial and proper formatting. Picking Text for a dollar amount breaks currency reports. Understanding what each field type is designed for prevents long-term technical debt in your org.

### Slide 2: Text-Based Field Types
**Visual:** A comparison card showing four text types with their character limits and use case icons
**Content:**
- **Text** — up to 255 characters; single-line; searchable
- **Text Area** — up to 255 characters; multi-line; not searchable
- **Long Text Area** — up to 131,072 characters; multi-line; not searchable (configurable up to 131,072)
- **Rich Text Area** — up to 131,072 characters; supports HTML formatting, images, links
- **Email** — validates email format; click to open email client
- **Phone** — click-to-dial in Salesforce; stores as text but formats phone numbers
- **URL** — validates URL format; renders as clickable hyperlink
**Speaker Notes:** Choose the simplest type that meets the need. Text is fast and searchable. Use Long Text Area for notes and descriptions. Use Rich Text only when users genuinely need formatting — it stores HTML, which can complicate integrations. Email and Phone field types unlock mobile and CTI integrations that plain Text fields do not.

### Slide 3: Numeric Field Types
**Visual:** A table showing Number, Currency, Percent side by side with their formatting, decimal place options, and a sample value for each
**Content:**
- **Number** — stores any number; configurable decimal places; no currency symbol
- **Currency** — stores monetary values; displays with currency symbol; respects org currency settings; supports multi-currency
- **Percent** — stores a decimal value but displays as a percentage (0.5 = 50%)
- All three support: length (total digits) and decimal places configuration
- **Auto-Number** — system-generated sequential number; read-only; format is configurable (e.g., CASE-{0000})
**Speaker Notes:** Use Currency whenever the value represents money — not Number. Currency fields participate in multi-currency conversions and show the right symbol. Percent fields store the raw decimal — if you enter 50 in the UI, it stores 50 and displays as 50%, not 0.5 as you might expect from a coding perspective.

### Slide 4: Date, DateTime, and Checkbox
**Visual:** Three field type cards: Calendar icon for Date, Calendar+Clock for DateTime, Toggle/Checkbox icon for Checkbox
**Content:**
- **Date** — stores a calendar date (no time); use for birthdays, deadlines, renewal dates
- **Date/Time** — stores both date and time; automatically converts to user's time zone; use for meetings, timestamps
- **Checkbox** — true/false boolean; always has a value (true or false, never null); useful for flags and opt-ins
- Date and DateTime support default values using formulas like TODAY() and NOW()
**Speaker Notes:** A common mistake is using Date when you need DateTime or vice versa. Renewal Date → Date. Meeting Start → DateTime. Checkbox is always true or false — unlike most Salesforce fields, it cannot be blank. This matters in validation rules and formula fields where you check field values.

### Slide 5: Picklist Field Types
**Visual:** A dropdown showing a picklist and a multi-select box showing a multi-select picklist, with a callout showing "Restricted" vs "Unrestricted" toggle
**Content:**
- **Picklist** — single-value dropdown list; enforces a defined set of values
- **Multi-Select Picklist** — allows selecting multiple values; stores values separated by semicolons
- **Global Picklist Value Sets** — shared picklist values reused across multiple fields and objects
- **Restricted picklist** — prevents values outside the defined list (even via API); default behavior for new picklists
- Picklist values are managed at Setup > Object Manager > [Object] > Fields > [Field] > Edit
**Speaker Notes:** Multi-Select Picklists are convenient but have limitations — you cannot use them in certain formula functions, and reports cannot easily group by multi-select values. Use them only when a user genuinely needs to select more than one value simultaneously, like selecting multiple skills or product categories.

### Slide 6: Relationship Field Types
**Visual:** A diagram showing two objects connected by a Lookup arrow (dashed, optional) and two objects connected by a Master-Detail arrow (solid, required, with cascade delete symbol)
**Content:**
- **Lookup** — creates a loosely coupled relationship; parent record is optional; no cascade delete; no roll-up summaries
- **Master-Detail** — creates a tightly coupled relationship; parent (master) is required; cascade delete; enables roll-up summary fields on the master; sharing follows master
- **Hierarchy** — special lookup to the same object; used only on User object for manager chains
- Lookup fields end in **Id** in the API (e.g., AccountId); relationship accessor ends in **__r** (e.g., Account__r.Name)
**Speaker Notes:** The choice between Lookup and Master-Detail is one of the most tested topics in the entire exam. If the child record should not exist without a parent and you want roll-up summaries, use Master-Detail. If the relationship is optional or you want the child to survive if the parent is deleted, use Lookup.

### Slide 7: Formula, Roll-Up Summary, and Special Types
**Visual:** Three cards: Formula (calculator icon, "calculated at runtime"), Roll-Up Summary (sigma icon, "aggregates child records"), Geolocation (map pin icon)
**Content:**
- **Formula** — read-only; calculated at runtime; can reference fields on the same object or related objects; does not store a value
- **Roll-Up Summary** — COUNT, SUM, MIN, MAX of child records; only available on the master side of master-detail; stores the result
- **Geolocation** — stores latitude/longitude; used with Salesforce Maps and distance formulas
- **Text (Encrypted)** — stores masked data; limited filtering and searching (legacy feature; Shield Platform Encryption is preferred)
**Speaker Notes:** Formula and Roll-Up Summary fields are read-only — users cannot directly edit them. Formula fields recalculate every time the record is viewed or queried; Roll-Up Summary fields recalculate when a child record changes. Both are covered in depth in Lecture 17.

### Slide 8: Field Limits Per Object
**Visual:** A reference table showing field type limits: total custom fields per object, text field max length, Long Text Area max length, multi-select picklist max values, etc.
**Content:**
- Standard and Enterprise orgs: **500 custom fields per object** (varies slightly by field type)
- Maximum **25 Roll-Up Summary fields** per object
- Maximum **2 Master-Detail relationships** per object
- Maximum **40 Lookup relationships** per object
- Long Text Area: up to **131,072 characters** (configurable, starts at 32,768)
- Multi-Select Picklist: up to **500 values** in the value set; up to **4,096 characters** stored
**Speaker Notes:** The 500 custom field limit sounds generous, but complex orgs hit it. When that happens, admins must archive or consolidate fields. The 25 Roll-Up Summary limit and the 2 Master-Detail limit are frequently tested. If you need a third master-detail relationship, that requirement cannot be met with standard Salesforce objects — you would use a lookup instead.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 14. We are going deep on field data types — all the types Salesforce offers, what they do, and when to use each one.

Let me organize these into categories. First, text-based types. Text holds up to 255 characters on a single line and is searchable. Text Area is multi-line but capped at 255 characters and not searchable. Long Text Area goes up to over 131,000 characters — use this for notes, descriptions, and comments. Rich Text Area is the same but supports formatting, images, and links. Then there are the specialized text types: Email validates the email format and enables click-to-email, Phone enables click-to-dial and formats phone numbers, and URL validates links and renders them as clickable hyperlinks. Always use the specialized type when it matches — the extra behavior is worth it.

For numbers, you have three options. Number is a generic number with configurable decimal places and no formatting. Currency adds the currency symbol and participates in multi-currency conversions. Percent stores a number and displays it with a percent sign. Auto-Number is read-only — the system assigns the next value in sequence, like a case number.

Date and DateTime are distinct. Date stores just the calendar date. DateTime stores date and time together, converting automatically to the user's time zone. Use the right one for the right context. Checkbox is always true or false — it is never blank, which matters for logic in formulas and validation rules.

Picklist is your dropdown list. Single-select Picklist lets users pick one value. Multi-Select Picklist lets them pick several — the values are stored separated by semicolons. Use Multi-Select only when truly needed; it has limitations in formulas and reports.

Relationship fields are critical. Lookup creates an optional relationship — the child can exist without a parent, and deleting the parent does not delete the child. Master-Detail creates a required, tightly coupled relationship — the child cannot exist without the master, cascade delete applies, and roll-up summaries are enabled on the master.

Formula fields are calculated at runtime — they always show a current value but never store it. Roll-Up Summary fields aggregate child records on a master-detail and do store the result.

Key limits to memorize: 500 custom fields per object, 2 Master-Detail relationships per object, 40 Lookups per object, and 25 Roll-Up Summary fields per object. These limits appear on the exam.

## 🔔 EXAM TIPS
- **Currency vs. Number:** Always use Currency for monetary values — not Number. Currency participates in multi-currency and displays the correct symbol. This is tested in scenario questions.
- **Multi-Select Picklist limitations:** Multi-Select Picklist values cannot be used as grouping criteria in standard reports and have limited support in formula fields. Know these limitations.
- **2 Master-Detail limit:** Each object can have at most 2 master-detail relationships. If a scenario requires a third, the answer is a Lookup, not a third master-detail.
- **Roll-Up Summary requires Master-Detail:** Roll-Up Summary fields are ONLY available on the master object in a master-detail relationship. They cannot be created on the child side or in a lookup relationship.
- **Auto-Number is read-only:** Auto-Number fields are system-generated and cannot be edited by users. They are useful for creating unique, sequential identifiers like case numbers or invoice IDs.

## ✅ LECTURE SUMMARY
- Salesforce offers 25+ field types covering text, numbers, dates, booleans, relationships, formulas, and more — choosing the right type prevents data quality and reporting issues
- Key text types: Text (255 chars, searchable), Long Text Area (131K chars), Rich Text Area (formatted); specialized types: Email, Phone, URL add click functionality
- Numeric types: Number (generic), Currency (monetary with symbol), Percent (displays as %, stores as number), Auto-Number (read-only sequential)
- Relationship types: Lookup (optional, no cascade delete), Master-Detail (required, cascade delete, enables Roll-Up Summary fields)
- Key limits: 500 custom fields per object, 2 Master-Detail relationships per object, 25 Roll-Up Summary fields per object, 40 Lookup relationships per object

## ❓ MINI QUIZ

**Q1:** An admin needs to create a field to store contract values in dollars, which must work correctly in multi-currency reports. Which field type should be used?
- A) Number
- B) Text
- C) Currency
- D) Percent

**Answer:** C — Currency fields store monetary values, display the correct currency symbol, and participate in multi-currency conversions — all of which are required for this scenario. Number fields do not provide currency handling.

**Q2:** An admin wants to create a Roll-Up Summary field on the Account object to count all related Opportunities. What is required for this to be possible?
- A) Opportunity must have a Lookup relationship to Account
- B) Opportunity must have a Master-Detail relationship to Account
- C) Account must have a Formula field referencing Opportunity
- D) The admin must write Apex code to calculate the count

**Answer:** B — Roll-Up Summary fields are only available on the master side of a master-detail relationship. The standard Account-Opportunity relationship is a lookup, not master-detail, so Roll-Up Summary is not natively available on that standard relationship.

**Q3:** A user selects multiple values from a field on a Salesforce record. When the record is saved, those values are stored separated by semicolons. Which field type is being used?
- A) Picklist
- B) Multi-Select Picklist
- C) Text Area
- D) Long Text Area

**Answer:** B — Multi-Select Picklist allows users to select multiple values simultaneously, and those values are stored in the database as a semicolon-separated string.
