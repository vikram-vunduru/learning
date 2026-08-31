# L15: Page Layouts & Record Types

## 🎯 Learning Objectives
- Configure page layouts to control field order, required fields, and related lists on record detail pages
- Explain record types and how they control page layouts, picklist values, and business processes per user profile
- Map the full relationship: Record Type → Page Layout + Picklist Values + Business Process

## 📊 SLIDES

### Slide 1: What Is a Page Layout?
**Visual:** A wireframe of a Salesforce record detail page with labeled zones: Header, Fields section, Related Lists section, Highlights Panel, and Buttons/Actions bar
**Content:**
- A page layout controls the **presentation** of a record's detail and edit pages
- Determines: which fields appear, field order, which fields are required or read-only on the layout, and which related lists show at the bottom
- Also controls: buttons, links, actions in the Chatter feed, and quick action placement
- Page layouts are assigned to users via **Profile + Record Type** combinations
**Speaker Notes:** Page layouts are about user experience, not security. A field hidden on a page layout can still be accessed via reports or the API if Field-Level Security allows it. If you need to truly hide a field, use FLS — not page layouts. This distinction is frequently tested.

### Slide 2: Page Layout Editor
**Visual:** Mockup of the Page Layout Editor showing the palette at the top with draggable fields, and the layout canvas below with sections and field slots
**Content:**
- Access: **Setup > Object Manager > [Object] > Page Layouts > [Layout Name]**
- The palette at the top shows available fields, related lists, buttons, and actions
- Drag fields from the palette to the layout canvas to add them
- Double-click a field on the canvas to mark it as **Required** or **Read-Only** on the layout
- Sections can be added, renamed, removed, and set to 1 or 2-column format
**Speaker Notes:** Making a field required on a page layout is different from making it required at the field level. A page layout required field only enforces the requirement via the Salesforce UI — API inserts and bulk data loads can bypass page layout requirements. For true data integrity, use Validation Rules.

### Slide 3: Related Lists on Page Layouts
**Visual:** The bottom section of a page layout editor showing the Related Lists zone with items like Contacts, Opportunities, Cases, and Activities with drag-and-drop handles
**Content:**
- Related lists appear at the bottom of record pages and show child records from related objects
- Add, remove, and order related lists from the page layout editor
- Each related list can be customized to show specific columns
- Related lists are controlled per page layout — different profiles can see different sets of related lists
**Speaker Notes:** If a user says "I cannot see the Contacts section on an Account," the first thing to check is their page layout. The related list might not be on the layout assigned to their profile. This is a common admin troubleshooting scenario that appears in exam questions.

### Slide 4: What Are Record Types?
**Visual:** A business scenario diagram: Company sells to both B2B Customers and B2C Consumers; two record type cards labeled "Business Account" and "Consumer Account" each pointing to different page layouts and picklist value sets
**Content:**
- Record types allow different **page layouts**, **picklist values**, and **business processes** for different user profiles on the same object
- Each record has exactly one record type assigned
- Users with multiple record types are prompted to choose one when creating a new record
- Record types do not control field-level security — that is still handled by FLS
**Speaker Notes:** Record types solve the "same object, different workflows" problem. A single Opportunity object can serve both a standard B2B Sales process and a specialized Renewal process, each with its own layout, stages, and required fields. Without record types, you would need two separate objects.

### Slide 5: The Record Type → Layout → Picklist Relationship
**Visual:** A three-node relationship diagram: Record Type in the center, with arrows to Page Layout on the left ("controls presentation"), Picklist Values on the right ("controls available choices"), and Business Process below ("controls stage/status options")
**Content:**
- **Record Type → Page Layout:** Each profile-record type combination maps to one page layout
- **Record Type → Picklist Values:** Each record type specifies which values from the master picklist are available
- **Record Type → Business Process:** Each record type references a business process that controls the Stage (Opportunity), Status (Case/Lead), or value (Solution)
- The record type is the connector — it does not store picklist values or layouts itself, but links them together
**Speaker Notes:** This three-way relationship is the heart of record type functionality and a major exam topic. Picture the record type as a hub. It does not contain picklist values or layouts — it points to them. A single page layout can be used by multiple record types. A single business process can be shared across record types too.

### Slide 6: Business Processes
**Visual:** Four business process type cards: Sales Process (Opportunity Stages), Support Process (Case Statuses), Lead Process (Lead Statuses), Solution Process (Solution Statuses)
**Content:**
- **Sales Process** — defines which Opportunity Stage values are available for a given record type
- **Support Process** — defines which Case Status values are available
- **Lead Process** — defines which Lead Status values are available
- **Solution Process** — defines which Solution Status values are available (less common)
- Business processes are created at: **Setup > Process section in App Manager** — or by object in Object Manager
**Speaker Notes:** Business processes are created at Setup under each respective object. You create the process, select the stage/status values to include, name it, then assign it to a record type. This is how you get an "Enterprise Sales" record type with stages for large deals and a "SMB Sales" record type with a simpler, faster stage sequence.

### Slide 7: Assigning Record Types to Profiles
**Visual:** A profile detail page showing the Record Type Settings section with a table of objects and their default + available record types per profile
**Content:**
- Navigate to **Setup > Users > Profiles > [Profile Name] > Record Type Settings**
- For each object, assign which record types the profile can use
- Set a **Default Record Type** for each object — this is pre-selected when the user creates a new record
- Users with only one available record type do not see the selection prompt
- Can also be assigned via Permission Sets (Setup > Permission Sets > [Set] > Object Settings)
**Speaker Notes:** If a user is not seeing a record type option they should have, check their profile's Record Type Settings. If a user is being prompted to choose a record type when they should just get one by default, check that the default is set correctly on the profile. These are classic admin troubleshooting questions.

### Slide 8: Page Layout Assignment
**Visual:** The Page Layout Assignment screen for an object showing a matrix with profiles as rows and record types as columns, and a page layout in each cell
**Content:**
- Navigate to **Setup > Object Manager > [Object] > Page Layouts > Page Layout Assignment**
- This matrix shows every profile-record type combination and which page layout each receives
- Click a cell to change the page layout for that profile + record type combination
- One layout can serve multiple profile-record type combinations
- Use **Edit Assignment** button to bulk-update the matrix
**Speaker Notes:** The Page Layout Assignment matrix is the most efficient way to see your entire layout strategy at a glance. Rather than clicking into each profile separately, you see all assignments in one view. This is also where admins go when a user says "the page looks wrong" — find the profile-record type row and check which layout is assigned.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 15. We are covering two deeply interconnected concepts: Page Layouts and Record Types. Understanding how they work together is essential for both the exam and real-world Salesforce administration.

Let's start with page layouts. A page layout controls the presentation of a record's detail and edit pages. You use it to decide which fields appear, in what order, whether any are required or read-only on that layout, and which related lists show up at the bottom. You configure page layouts in Object Manager — find the object, click Page Layouts, and open the layout editor. The editor is a drag-and-drop interface: fields are in the palette at the top, and you drag them onto the canvas.

One critical point: making a field required on a page layout is a UI-only enforcement. The API and bulk data imports can bypass it. For real data integrity requirements, you need a Validation Rule, not a page layout required setting.

Now, record types. Record types solve the problem of having different workflows, different fields visible, and different picklist values for different types of records — all on the same object. For example, you might have Opportunity record types for Standard Sales, Renewal, and Partner-Led, each with different stages and different page layouts.

Here is the key relationship to memorize. A record type connects three things: a page layout (which controls what users see), picklist values (which controls what options are available in dropdown fields), and a business process (which controls the available stages or statuses). The record type is the hub — it does not contain these things, it points to them.

Business processes come in four flavors tied to specific objects: Sales Process for Opportunities, Support Process for Cases, Lead Process for Leads, and Solution Process for Solutions. You create the business process first, selecting which stage or status values to include, then assign it to a record type.

To assign record types to profiles, go to the profile's Record Type Settings. You choose which record types that profile can use and set a default. If a user has only one available record type, Salesforce skips the selection prompt entirely.

To see which page layout any profile-record type combination uses, go to Object Manager, open the object's Page Layouts section, and click Page Layout Assignment. You get a matrix view of every combination at once — a huge time-saver for auditing and troubleshooting.

Remember: page layout controls presentation, FLS controls security. Both matter, but they serve different purposes.

## 🔔 EXAM TIPS
- **Page layout vs. FLS:** Page layouts control presentation on the record page UI. FLS controls access everywhere (UI, API, reports). FLS always wins — a field hidden via FLS will not show on a page layout even if placed there.
- **Page layout required ≠ truly required:** A field marked required on a page layout can be bypassed via API and data imports. Only Validation Rules enforce true data integrity at all layers.
- **Record type = hub:** Record types link together a page layout, a set of picklist values, and a business process. The record type itself does not store these — it references them.
- **Business process types:** Know the four: Sales Process (Opportunity Stage), Support Process (Case Status), Lead Process (Lead Status), Solution Process (Solution Status). These are configured separately from record types and then assigned to them.
- **Profile assignment matrix:** Page Layout Assignment (Object Manager > Page Layouts > Page Layout Assignment) shows the profile-record type-layout matrix in one view. Know this path for troubleshooting questions.

## ✅ LECTURE SUMMARY
- Page layouts control field order, required/read-only settings, related lists, and action placements on record detail and edit pages — they are about presentation, not security
- Record types enable different page layouts, picklist values, and business processes for different profiles on the same object
- The record type is the connector between a page layout, picklist value selections, and a business process
- Business processes control available Stage or Status values per record type: Sales Process (Opportunity), Support Process (Case), Lead Process (Lead)
- Page layout assignment is managed through a profile-record type matrix at Object Manager > [Object] > Page Layouts > Page Layout Assignment

## ❓ MINI QUIZ

**Q1:** A Salesforce Admin needs different Opportunity Stage values to appear for the Enterprise Sales team than for the SMB Sales team. What is the correct combination of Salesforce features to achieve this?
- A) Two different page layouts with different Stage field configurations
- B) Two record types, each referencing a different Sales Process
- C) Two profiles, each with different picklist values configured in FLS
- D) Two custom picklist fields replacing the standard Stage field

**Answer:** B — Record types reference Sales Processes, which define the available Stage values. Creating two record types (Enterprise and SMB), each pointing to a different Sales Process, allows each team to see different Stage options on the same Opportunity object.

**Q2:** A user's page layout includes the "Annual_Revenue__c" field. However, the user's profile has the field set to Hidden in Field-Level Security. What does the user see?
- A) The field appears but displays a blank value
- B) The field is visible and editable
- C) The field does not appear on the record page
- D) The field appears with a lock icon indicating it is restricted

**Answer:** C — FLS takes precedence over page layout. A field hidden via FLS will not appear to the user regardless of whether it is included on the page layout.

**Q3:** Where does an admin go to change which page layout is presented to users of a specific profile when they view a record with a certain record type?
- A) Setup > Users > Profiles > [Profile] > Object Settings
- B) Setup > Object Manager > [Object] > Page Layouts > Page Layout Assignment
- C) Setup > Object Manager > [Object] > Record Types > [Record Type] > Edit
- D) Setup > Security > Sharing Settings

**Answer:** B — The Page Layout Assignment matrix (Object Manager > [Object] > Page Layouts > Page Layout Assignment) shows all profile-record type combinations and allows the admin to assign a specific page layout to each combination.
