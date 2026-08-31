# L05: Custom Objects & Fields

## 🎯 Learning Objectives
- Determine when to create a custom object versus extending a standard object
- Configure key custom object settings and explain the purpose of each
- Identify the available custom field types and their constraints for the CRT-403 exam
- Set up field-level security and field history tracking for custom fields

---

## 📊 SLIDES

### Slide 1: When to Create a Custom Object
**Visual:** Decision tree. "Does a standard Salesforce object already represent this entity?" → Yes → "Can you extend it with custom fields?" → Yes → "Use the standard object." → No (no standard object) → "Create a custom object."
**Content:**
- Create a custom object when: **no standard object represents the business entity**
- Examples of valid custom objects: Inspection, Property, Loan Application, Patient, Work Order, Franchise Location
- Avoid creating custom objects for things that are really just categories or sub-types (use record types or picklists)
- Custom objects have all the same platform capabilities as standard objects: layouts, flows, reports, sharing
- Custom object API names always end in `__c` — e.g., `Inspection__c`, `Property__c`
**Speaker Notes:** The decision to create a custom object is significant — once users start creating records on it, changing its fundamental structure becomes increasingly difficult. Before you create, ask these questions: Is there a standard object that already represents this entity, even imperfectly? Can you extend a standard object with custom fields to meet the need? If yes to either, extend rather than create. Custom objects are for genuinely distinct business entities that have no standard equivalent.

### Slide 2: Custom Object Settings — What They Mean
**Visual:** Screenshot-style mockup of the custom object creation screen, with callout boxes highlighting key settings: Allow Reports, Allow Activities, Track Field History, Allow Sharing, Search, Bulk API, Streaming API.
**Content:**
- **Allow Reports:** Include records of this object in reports and dashboards (almost always enable)
- **Allow Activities:** Allow users to log Calls, Tasks, and Emails against this object's records
- **Track Field History:** Enable tracking of field value changes (up to 20 fields, stored for 18 months)
- **Allow Sharing:** Enables the sharing model (OWD, rules, manual sharing) for this object
- **Search:** Make records searchable via the global search bar
- **Bulk API:** Allow this object's records to be processed via the Bulk API (for data integrations)
- **Streaming API:** Push notifications for record changes via Streaming API
**Speaker Notes:** Most of these settings you'll want to leave enabled. The one that catches people is Track Field History — you have to decide at object creation whether you want it, and then you configure which specific fields to track. There's a hard limit of 20 fields tracked per object. Field history data is great for compliance and audit purposes — it lets you see who changed what and when. But remember, it's stored for only 18 months natively, so if you need longer retention you'll need a third-party archiving solution.

### Slide 3: The Name Field — Auto Number vs. Text
**Visual:** Side-by-side comparison. Left "Auto Number Name": "INS-0001, INS-0002, INS-0003" — sequential, unique, no user input required. Right "Text Name": "Annual Fire Inspection - Building A" — descriptive, user-defined, requires user input.
**Content:**
- Every custom object requires a **Name field** — the primary field that identifies records
- **Text Name:** User enters a name for each record — good when records have meaningful names
- **Auto Number:** System assigns a sequential, formatted number — good when records are identified by number (tickets, invoices, case numbers)
- Auto Number format: define a prefix (e.g., "INS-"), start number, and display digits
- You choose Text or Auto Number when creating the object — **this choice cannot be easily changed later**
- The Name field is the field that appears in lookup searches and list views by default
**Speaker Notes:** Choosing between Auto Number and Text for the Name field is a decision that affects usability significantly. Auto Number is clean and guarantees uniqueness without requiring user input — great for transactional records like inspections, invoices, or tickets. Text is better for records where the name is meaningful: a Project that people will refer to by name, a Product Variant that has a real-world name. Ask the business: "How will users refer to these records? By a number or by a description?" Their answer tells you which to choose.

### Slide 4: Custom Field Types — Part 1 (Core Types)
**Visual:** Two-column grid listing field types with icons. Left column: Text, Text Area, Text Area (Long), Text Area (Rich), Number, Currency, Percent. Right column: Date, Date/Time, Time, Checkbox, Email, Phone, URL.
**Content:**
- **Text:** Up to 255 characters. Used for names, codes, short identifiers.
- **Text Area (Long):** Up to 131,072 characters. For notes and descriptions.
- **Number:** Stores numeric values. Specify decimal places (0–18).
- **Currency:** Like Number but formatted as currency. Uses org's default currency (or multi-currency if enabled).
- **Date/Date/Time:** Date-only or date + time values. Date/Time stores in UTC, displays in user's time zone.
- **Checkbox:** True/False. Cannot be left blank — it's always checked or unchecked.
- **Email/Phone/URL:** Formatted text with special handling (email becomes clickable, phone is formatted, URL opens in browser)
**Speaker Notes:** Most of these field types are intuitive. A few things worth noting: Currency fields are affected by multi-currency settings — if your org has multiple currencies enabled, a Currency field stores the value in the record's currency, not the user's currency. Date/Time fields are stored in UTC — this is important when building automation that fires "at a specific time" because the time displayed to users shifts based on their time zone setting. Checkbox fields are special — they're never null, they're always true or false. This matters for formula fields and validation rules.

### Slide 5: Custom Field Types — Part 2 (Special Types)
**Visual:** Grid with callout annotations for four special field types: Picklist (dropdown values), Multi-Select Picklist (multiple selections), Lookup Relationship (link to another object), Formula (calculated, read-only), Roll-Up Summary (aggregate from child records — MD only).
**Content:**
- **Picklist:** Single-select dropdown. Define the list of values. Can use global value sets for consistency across objects.
- **Multi-Select Picklist:** User can select multiple values. Stores as semicolon-delimited text. Hard to report on — use sparingly.
- **Formula:** Read-only calculated field. Computed at runtime from other fields. Cannot be edited by users.
- **Roll-Up Summary:** **Only available on Master-Detail parent objects.** Aggregates child record values (COUNT, SUM, MIN, MAX).
- **Lookup Relationship field:** Creates a relationship to another object. Covered in depth in L06.
**Speaker Notes:** Two critical exam points from this slide. First: Roll-Up Summary fields are ONLY available on the master object in a Master-Detail relationship. Not on Lookup relationships, not on the child side — only on the master side of a Master-Detail. This is one of the most tested facts in the data modeling domain. Second: Formula fields are read-only. They are calculated at runtime. Users cannot type a value into a formula field. If an exam scenario says a user needs to edit a formula field value, the answer is "formula fields cannot be edited — a different field type is needed."

### Slide 6: Field-Level Security for Custom Fields
**Visual:** Grid showing Profile/Permission Set rows vs. Field columns. Cells show "Visible," "Read-Only," or "Hidden" (blank). Callout: "New custom fields default to Hidden for all profiles except System Administrator."
**Content:**
- When you create a custom field, it is **hidden by default** for all profiles except System Administrator
- You must explicitly configure FLS for each profile/permission set that needs to see the field
- FLS options: **Visible** (can see and edit), **Read-Only** (can see but not edit), **Hidden** (cannot see at all)
- Configure FLS from: Field definition > Set Field-Level Security, OR from the Profile/Permission Set > Field Permissions
- Adding a field to a page layout does NOT grant FLS — both must be configured
**Speaker Notes:** This is the single most common support ticket from Salesforce admins: "I created a new field and added it to the page layout, but users can't see it." The answer is always FLS. New custom fields default to hidden for all profiles. You have to explicitly grant visibility. You can set FLS from the field setup page when you create it — Salesforce actually prompts you with a FLS configuration screen right after saving the field. Use that opportunity to configure it correctly from the start, not as an afterthought.

### Slide 7: Field History Tracking
**Visual:** Screenshot-style mockup of a record's Field History related list showing: Date/Time, Field, User, Original Value, New Value columns. Example rows showing "Status" changed from "Open" to "In Review" by "Jane Smith" on a specific date.
**Content:**
- Tracks changes to specific field values: who changed it, when, from what value, to what value
- Enable at the object level first (Track Field History setting), then select up to **20 fields** to track
- History displays in the **Field History related list** on the record
- Data retained for **18 months** natively
- Tracked for both standard and custom fields (some standard fields are always tracked, e.g., Opportunity Stage)
- Common use cases: compliance tracking, audit trails, dispute resolution
**Speaker Notes:** Field history tracking is your audit trail. Once you enable it on a field, every value change is logged automatically — no Flow or Apex needed. The 20-field limit per object requires you to choose carefully. Track fields that are important for compliance, that are frequently disputed, or that drive significant process decisions. Things like Status, Stage, Owner, and monetary amounts are usually the right candidates. And remember the 18-month retention window — if your compliance requirements mandate longer retention, plan for an archiving solution.

### Slide 8: Custom Field Best Practices
**Visual:** Checklist of best practices with explanations: (1) Name fields clearly with business terminology. (2) Use global value sets for picklists shared across objects. (3) Set FLS immediately when creating a field. (4) Mark fields required only when truly required. (5) Use help text and field descriptions. (6) Plan field history tracking before go-live.
**Content:**
- **Naming:** Use clear business names (not technical codes). API name must be unique within the object.
- **Global Value Sets:** Reuse picklist value lists across multiple objects for consistency
- **FLS first:** Configure field-level security when you create the field, not after users complain
- **Required fields:** Required fields must have a value on every save — don't over-require
- **Help text:** Appears as a tooltip — guide users on what to enter in the field
- **Field description:** Internal documentation for admins — note what the field is for and when it was created
**Speaker Notes:** The field description is one of the most underused features in Salesforce. It's an internal note visible only in Setup — not to end users. Use it to document why a field was created, what the intended values are, and any logic that depends on it. Six months from now, when a different admin looks at your org and wonders why there's a field called "Legacy_Sync_Status__c," your description will be the only context they have. Also: global value sets are a game-changer for orgs with many objects that share common picklist values. Create the value set once, use it everywhere, and update it in one place.

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 05 — Custom Objects and Fields. This is where the hands-on building begins. Everything we've talked about in Section 1 — data modeling concepts, security design, environment strategy — now turns into something you'll actually click through in Salesforce.

We start on Slide 1 with the decision of when to create a custom object. The rule is simple: when no standard object represents your business entity. Don't create custom objects for things that are really just classifications or sub-types. If you have a "Gold Customer" and a "Silver Customer," that's a picklist on the Account object, not two custom objects. Custom objects are for genuinely distinct entities — things that have their own lifecycle, their own relationships, their own reporting needs.

Slide 2 walks through the custom object settings. Most of them are checkboxes you'll want to enable. The important one for exam purposes is Track Field History — you need to turn this on at the object level, then select which fields to track, and you're limited to 20 fields. That limit is tested. The history data lives for 18 months natively. Both numbers matter for the exam.

Slide 3 is about the Name field. Every custom object needs one. Choose Auto Number when records are identified by a system-generated number — think tickets, invoices, inspection reports. Choose Text when users will name records themselves with meaningful descriptive names. And make this decision carefully — it's easier to change your mind before records exist than after.

Slides 4 and 5 cover field types. I've split them across two slides because there are a lot of them. The ones you need to know deeply for the exam are on Slide 5: Formula fields are read-only. Roll-Up Summary fields are ONLY available on the master side of a Master-Detail relationship. These two facts generate more exam questions than all the other field types combined.

Multi-Select Picklist gets a special mention: it works, but it's notoriously hard to use in reports and formula logic because the values are stored as semicolon-delimited text. Use it sparingly, and only when users genuinely need to select multiple values.

Slide 6 — FLS defaults. New custom fields are hidden for everyone except system admins. This trips people up constantly. When you create a field, Salesforce gives you a chance to configure FLS right on the next screen. Use it. Don't skip it.

Slide 7 covers field history tracking — your compliance and audit tool. Twenty fields maximum, 18 months of retention, displayed in the Field History related list. Enable it for Status, Stage, Owner, and key financial fields from day one.

Slide 8 is your best practices checklist. Name fields clearly, use global value sets for shared picklists, set FLS immediately, document fields with descriptions. These habits distinguish professional app builders from amateurs.

---

## 🔔 EXAM TIPS
- **Roll-Up Summary is Master-Detail only:** This is the most tested fact in this lecture. If an exam scenario asks how to aggregate child record values onto a parent, and the relationship is a Lookup, the answer is NOT Roll-Up Summary — you'd need to use a Flow or formula instead.
- **Formula fields are read-only:** Users cannot edit formula field values. If a scenario requires users to update a field that currently uses a formula, the formula must be replaced with a different field type.
- **FLS defaults to hidden:** New custom fields are not visible to users until FLS is explicitly configured. Adding a field to a page layout alone does NOT make it visible if FLS is hidden.
- **Field history tracking limits:** 20 fields per object, 18 months retention. Both numbers are directly testable.
- **Name field choice:** Auto Number = system-generated sequential IDs. Text = user-entered names. This choice is permanent in practice — hard to change after records exist.

---

## ✅ LECTURE SUMMARY
- Create custom objects when no standard object represents the business entity; extend standard objects first when possible
- Key custom object settings include Allow Reports, Track Field History (20 fields max, 18 months), and Allow Activities
- Roll-Up Summary fields are only available on the master side of Master-Detail relationships
- Formula fields are read-only and calculated at runtime — users cannot edit them
- New custom fields default to hidden for all profiles; FLS must be explicitly configured for each profile or permission set

---

## ❓ MINI QUIZ

**Q1:** An App Builder creates a custom object called Invoice__c in a Master-Detail relationship with Account. The App Builder wants to display the total of all Invoice__c Amount fields on the parent Account record. Which field type should be used on the Account object?
- A) Formula field using a cross-object formula
- B) Roll-Up Summary field
- C) Number field updated by a Flow
- D) Lookup field to Invoice__c

**Answer:** B — Roll-Up Summary fields are available on the master object in a Master-Detail relationship. They can SUM child record values automatically without any Flow or code.

**Q2:** After creating a new custom field on the Account object, users report that the field is not visible on the Account record page even though the App Builder added it to the page layout. What is the most likely cause?
- A) The field must be published before it appears on record pages
- B) The field's Field-Level Security is set to Hidden for the users' profile
- C) The App Builder forgot to activate the field in Field Manager
- D) New fields only appear after the next Salesforce release

**Answer:** B — New custom fields default to Hidden for all profiles except System Administrator. Even if the field is on the page layout, FLS must be set to Visible for the field to appear to users. Page layout and FLS are separate configurations.

**Q3:** A company wants to ensure that whenever a custom field called "Contract Status" changes on a custom object, the system records who changed it, when, and what the old and new values were. What should the App Builder configure?
- A) A before-save Flow that writes to a separate audit object
- B) Enable Track Field History on the object and select Contract Status as a tracked field
- C) Create a validation rule that prevents unauthorized changes
- D) Enable Streaming API on the custom object

**Answer:** B — Field History Tracking is the built-in Salesforce mechanism for this use case. Enable it at the object level, then select up to 20 fields to track (including Contract Status). Changes are automatically logged to the Field History related list.
