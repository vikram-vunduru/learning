# L13: Object Manager & Fields

## 🎯 Learning Objectives
- Navigate the Object Manager in Salesforce Setup and identify its key components
- Distinguish between standard objects and custom objects, including naming conventions and API names
- Identify the most important standard objects and their relationships in the Salesforce data model

## 📊 SLIDES

### Slide 1: What Is the Object Manager?
**Visual:** Screenshot-style mockup of the Setup home page with Object Manager tab highlighted in the top navigation, showing a list of objects in the main panel
**Content:**
- Object Manager is the central hub in Setup for managing all Salesforce objects — standard and custom
- Access via: **Setup > Object Manager** (or directly from the Setup home tab navigation)
- Replaced the older "Customize" menu in Classic; available in all Lightning editions
- Shows all objects, their API names, custom/standard indicator, and status
**Speaker Notes:** Before Object Manager existed, admins had to navigate to each object type individually through deeply nested menus. Object Manager consolidates everything — fields, page layouts, record types, validation rules, and more — into a single searchable list. It is where you will spend a significant portion of your admin time.

### Slide 2: Object Manager Navigation
**Visual:** A labeled diagram of the Object Manager detail page for the Account object, highlighting the left sidebar tabs: Fields & Relationships, Page Layouts, Lightning Record Pages, Record Types, Validation Rules, Buttons Links and Actions, Search Layouts, Related Lookup Filters
**Content:**
- Click any object in Object Manager to open its detail page
- Left sidebar tabs include: **Fields & Relationships**, **Page Layouts**, **Lightning Record Pages**, **Record Types**, **Validation Rules**, **Buttons, Links and Actions**, **Search Layouts**
- All object-level customization happens from this single page
- The header shows the object's label, API name, and object type (Standard/Custom)
**Speaker Notes:** Knowing the Object Manager sidebar is practical for the exam. Questions will ask you where to go to add a custom field, create a record type, or add a validation rule — the answer is always Object Manager, then the appropriate tab in the left sidebar.

### Slide 3: Standard Objects — The Core CRM Objects
**Visual:** A grid of icon cards for the main standard objects: Account, Contact, Lead, Opportunity, Case, Campaign, Product (Pricebook Entry), Task, Event, with brief descriptions
**Content:**
- **Account** — companies or individuals you do business with
- **Contact** — people associated with Accounts
- **Lead** — unqualified prospects (convert to Account + Contact + Opportunity)
- **Opportunity** — potential revenue-generating deals
- **Case** — customer service issues and support requests
- **Campaign** — marketing initiatives and programs
- **Task/Event** — activities related to any record
**Speaker Notes:** These seven objects are the backbone of Salesforce CRM. The exam assumes you understand their purpose and basic relationships. An Account can have many Contacts and Opportunities. Leads are separate until converted. Cases belong to Accounts and Contacts. Know these cold before exam day.

### Slide 4: Standard Object Relationships
**Visual:** An entity-relationship diagram showing: Campaign → Lead → [Convert] → Account + Contact + Opportunity; Account → Contact (one-to-many); Account → Opportunity (one-to-many); Account/Contact → Case (one-to-many)
**Content:**
- **Account → Contact:** one Account to many Contacts (Contact has a lookup to Account)
- **Account → Opportunity:** one Account to many Opportunities
- **Contact → Account:** Contact's Account field is a lookup, not master-detail (Account is not required)
- **Lead Conversion:** converts Lead into Account, Contact, and Opportunity in one step
- **Case:** can be related to both Account and Contact
**Speaker Notes:** The Lead-to-Opportunity conversion flow trips up many exam takers. A Lead does not become an Opportunity directly — it converts into three separate records: Account, Contact, and Opportunity. The original Lead record is then marked as Converted and closed off from normal user views.

### Slide 5: Custom Objects — Naming Conventions
**Visual:** A before/after card showing a business concept "Expense Report" and its resulting Salesforce API name "Expense_Report__c" with each part labeled (underscores, double underscore, lowercase c suffix)
**Content:**
- Custom objects are created by admins to store business-specific data not covered by standard objects
- API name format: **Object_Name__c** (spaces replaced by underscores, suffix is double underscore + lowercase c)
- Label: human-readable name (e.g., "Expense Report")
- API name: used in code, formulas, integrations (e.g., "Expense_Report__c")
- Custom object records have a unique 15- or 18-character Salesforce ID like all other records
**Speaker Notes:** The __c suffix is critical. It tells you immediately that something is custom — whether it is an object, a field, or a relationship. Any time you see __c in Salesforce, it means a developer or admin created it. Standard objects and fields never have __c in their API names.

### Slide 6: API Names vs. Labels
**Visual:** A two-column table showing Label on the left and API Name on the right for several examples: "Account" / "Account", "Annual Revenue" / "AnnualRevenue", "My Custom Field" / "My_Custom_Field__c", "Support Case" / "Support_Case__c"
**Content:**
- **Label** — the user-facing display name; can contain spaces and special characters; can be changed freely
- **API Name** — used in code, formulas, reports, integrations; no spaces; cannot be changed after data is in the field without impact
- Standard objects and fields: no __c suffix (e.g., "AccountId", "AnnualRevenue")
- Custom objects and fields: always have __c suffix
- Relationship fields: end in **__r** for the relationship name (e.g., "Account__r.Name")
**Speaker Notes:** Changing a label is always safe — it only affects what users see on screen. Changing an API name is dangerous — it breaks any formulas, Apex code, integrations, or reports that reference the old API name. Treat API names as permanent once the org is in production.

### Slide 7: Custom Object Limits per Edition
**Visual:** A table showing Salesforce editions (Essentials, Professional, Enterprise, Unlimited, Developer) and the maximum number of custom objects allowed in each
**Content:**
- **Essentials:** 5 custom objects
- **Professional:** 50 custom objects
- **Enterprise:** 200 custom objects
- **Unlimited:** 2,000 custom objects
- **Developer:** 400 custom objects
- Deleted custom objects count toward the limit until permanently erased from the Recycle Bin
**Speaker Notes:** The Enterprise limit of 200 custom objects is the most commonly cited on the exam — that is the edition most large companies use. Know that deleting an object does not immediately free up the count — you must purge it from the Recycle Bin for the limit to decrease.

### Slide 8: Finding and Searching in Object Manager
**Visual:** The Object Manager list view with the search box highlighted, showing a filtered result for "Case"
**Content:**
- Use the **search box** at the top of Object Manager to filter objects by label or API name
- Toggle between **Standard Objects** and **Custom Objects** using filter buttons
- Sort by Label, API Name, Object Type, or Status
- Deleted objects go to the **Deleted Objects** section — restore or permanently delete them from there
- From Object Manager, click an object and use **Edit** to modify object-level settings like label, description, and record name format
**Speaker Notes:** In a large org with dozens of custom objects, search is your best friend. Rather than scrolling through hundreds of objects, type the first few characters of the object name. The Deleted Objects section is important during cleanup — objects sitting in that state still consume your org's custom object limit.

## 🎙️ RECORDING SCRIPT

Welcome to Section 4. We are shifting from security to the building blocks of data in Salesforce — objects, fields, and the tools you use to manage them. Lecture 13 starts with Object Manager.

Object Manager, found in Setup, is the single place where you manage everything about any object in your org. Standard objects, custom objects, fields, page layouts, record types, validation rules — all of it is accessible from one organized interface. Before Object Manager, admins had to navigate through dozens of separate menus. Now it is all in one place.

Navigate to Setup and click Object Manager in the top navigation. You will see a list of every object in your org. Click any object and you get a detail page with a left sidebar containing tabs for Fields and Relationships, Page Layouts, Record Types, Validation Rules, and more. That sidebar is your roadmap for customizing any object.

Now let's talk about the objects themselves. Standard objects come with Salesforce out of the box. The core CRM objects you absolutely must know are Account, Contact, Lead, Opportunity, Case, and Campaign. Account is companies you do business with. Contact is the people at those companies. Lead is an unqualified prospect — someone you are not sure you want to do business with yet. When a Lead becomes qualified, you convert it — which creates an Account, a Contact, and an Opportunity in one step. Opportunity is a deal in progress. Case is a customer service issue. Campaign is a marketing program.

Custom objects are objects you create yourself. Maybe you need to track Project Milestones, or Expense Reports, or Equipment Inventory — things Salesforce does not have standard objects for. When you create a custom object, Salesforce generates an API name using your label with spaces replaced by underscores, plus the double underscore lowercase c suffix. So "Expense Report" becomes "Expense_Report__c."

That __c suffix is a universal signal. Any time you see __c in Salesforce — on an object, a field, a relationship — it means custom, user-created. Standard Salesforce components never have __c.

One important distinction: labels are for humans, API names are for machines. You can rename a label any time without breaking anything. Renaming an API name in production breaks every formula, code reference, and integration that uses the old name. Treat API names as permanent once you go live.

Finally, know your limits. Enterprise Edition — which most large orgs use — supports 200 custom objects. Unlimited Edition goes up to 2,000. Deleted objects still count until you empty the Recycle Bin.

## 🔔 EXAM TIPS
- **Object Manager location:** Setup > Object Manager is the correct navigation for any object customization question. Not App Manager, not Schema Builder — Object Manager.
- **__c suffix:** Any custom object or field ends in __c. Standard objects and fields do not. The relationship accessor ends in __r. These distinctions appear frequently in scenario questions.
- **Lead conversion output:** A converted Lead creates an Account, Contact, and Opportunity — three records, not just one. The original Lead record is marked Converted.
- **Enterprise = 200 custom objects:** This specific limit appears on the exam. Know it along with Unlimited = 2,000.
- **API name vs. label:** Labels can be changed freely. API names should be treated as permanent in production because changing them breaks code, formulas, and integrations.

## ✅ LECTURE SUMMARY
- Object Manager (Setup > Object Manager) is the central hub for managing all object-level customization in Salesforce Lightning
- Standard objects like Account, Contact, Lead, Opportunity, and Case come pre-built; custom objects are admin-created and end in __c
- API names use underscores instead of spaces and have __c for custom components; labels are user-facing and can be changed freely
- Key standard object relationship: Account → Contact (lookup), Account → Opportunity (lookup), Lead converts into Account + Contact + Opportunity
- Custom object limits by edition: Essentials = 5, Professional = 50, Enterprise = 200, Unlimited = 2,000

## ❓ MINI QUIZ

**Q1:** An admin creates a custom object called "Project Milestone." What will the API name be?
- A) ProjectMilestone
- B) Project_Milestone__c
- C) ProjectMilestone__c
- D) project_milestone__c

**Answer:** B — Custom object API names replace spaces with underscores and append __c. "Project Milestone" becomes "Project_Milestone__c."

**Q2:** A sales rep converts a Lead record in Salesforce. Which records are created as a result of Lead conversion?
- A) Opportunity only
- B) Account and Contact only
- C) Account, Contact, and Opportunity
- D) Contact and Opportunity only

**Answer:** C — Lead conversion creates three records: an Account, a Contact, and an Opportunity. The original Lead is marked as Converted.

**Q3:** An organization is on Enterprise Edition. How many custom objects can they create?
- A) 50
- B) 100
- C) 200
- D) 2,000

**Answer:** C — Enterprise Edition allows up to 200 custom objects. Unlimited Edition allows up to 2,000.
