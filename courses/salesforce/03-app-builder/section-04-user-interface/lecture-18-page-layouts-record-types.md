# L18: Page Layouts & Record Types

## 🎯 Learning Objectives
- Configure Page Layouts using the drag-and-drop editor, including fields, related lists, Quick Actions, and Compact Layouts
- Create and assign Record Types to control page layout, business process, and picklist values per profile
- Explain the relationship chain between Record Types, Page Layouts, and Business Processes, and identify when Dynamic Forms is the modern alternative

## 📊 SLIDES

### Slide 1: Page Layout Editor Overview
**Visual:** Annotated screenshot of the Page Layout Editor with labeled callout arrows pointing to the palette (top), field sections, related list section, Quick Actions section, Salesforce Mobile and Lightning Actions section, and the drag-drop canvas
**Content:**
- Page Layout Editor is a drag-and-drop tool accessed via Object Manager > [Object] > Page Layouts
- Controls what appears on the **record detail and edit views** in Lightning and Classic
- Sections of a page layout:
  - **Fields** — visible/editable fields and their arrangement in sections
  - **Related Lists** — which related lists appear and in what order
  - **Quick Actions** — actions in the Highlights Panel action bar (Lightning) and mobile
  - **Custom Links** — legacy hyperlinks (Classic)
  - **Mobile Cards** — fields shown when a record is expanded in the Salesforce mobile app list view
- Changes save immediately but are not live until the user refreshes their browser
**Speaker Notes:** The Page Layout Editor is a foundational admin skill. Every new Salesforce admin learns it early. For the exam, know what each section controls. The Quick Actions section is frequently tested — it feeds both the Lightning action bar and mobile. Also know that page layouts control the edit dialog fields, not just view-mode fields.

---

### Slide 2: Quick Actions
**Visual:** Three-column visual: (1) Quick Action types listed vertically; (2) where they appear in UI — Highlights Panel action bar with "New," "Edit," "Log a Call" buttons; (3) mobile app showing action bar at bottom
**Content:**
- Quick Actions are shortcut buttons that appear in:
  - Lightning Experience Highlights Panel action bar (top of record)
  - Salesforce mobile app action bar
- **Types of Quick Actions:**
  - **Create Record** — opens a create form for a related object (e.g., New Contact from Account)
  - **Update Record** — opens a targeted edit form for specific fields on the current record
  - **Log a Call** — creates a completed Task/Call log
  - **Send Email** — opens email compose window (available on certain objects)
  - **Custom (Visualforce)** — launches a VF page
  - **Custom (LWC)** — launches a Lightning Web Component screen
  - **Flow** — launches a screen flow
- Action order on the layout determines display order in the action bar
**Speaker Notes:** Quick Actions are different from buttons in Classic — they are the modern equivalent for Lightning and mobile. The exam tests which action types exist and where they appear. Log a Call is commonly used in service and sales orgs to track communication. Know that the order you arrange them in the Page Layout editor determines the order they appear in the Highlights Panel and mobile. Actions beyond the first 3-4 visible ones go into an overflow menu.

---

### Slide 3: Compact Layouts
**Visual:** Annotated record page showing the Highlights Panel with 5-6 fields displayed; below it, a Kanban card showing the same compact layout fields; mobile hover card showing compact layout fields
**Content:**
- **Compact Layout** defines which fields appear in:
  - **Highlights Panel** (top of Lightning record page) — shows first 7 fields
  - **Kanban card view** — compact summary on kanban boards
  - **Lookup hover card** — fields shown when hovering over a lookup field link
  - **Salesforce mobile app record summary** view
- Configured via: Object Manager > [Object] > Compact Layouts
- Every object has a **Primary Compact Layout** — the default used when no profile-specific layout is assigned
- Compact layout assignments can be set per profile (Profile Compact Layout Assignments)
- The **Name/Title field** is always the first field in the Highlights Panel regardless of compact layout order
**Speaker Notes:** Compact Layouts are a lightweight but frequently tested topic. The key thing to know is what they control — specifically that they drive the Highlights Panel (the fields at the top of every record), not the full field list. Also know the four surfaces: Highlights Panel, Kanban, lookup hover, and mobile summary. The Name/Title field always appears first; the compact layout controls the remaining fields.

---

### Slide 4: Record Types — What They Control
**Visual:** Three-way split diagram: Record Type box in center with three arrows pointing to: Business Process (left), Page Layout Assignment (top right), Picklist Values (bottom right) — each with a brief description label
**Content:**
- **Record Types** allow different subsets of an object's functionality per business group/profile
- Each Record Type controls three things:
  1. **Business Process** — which Stage/Status values are available (Opportunity Stages, Lead Statuses, Case Statuses, Solution Statuses)
  2. **Page Layout Assignment** — which page layout is shown for records of this type for each profile
  3. **Picklist Value Filtering** — which picklist values are available when creating/editing records of this type
- Record Types are created per object (Opportunity, Lead, Case, Account, custom objects, etc.)
- Business Processes must be created first, then associated with a Record Type at creation
- Example: "Enterprise Deal" Opportunity Record Type → Enterprise Business Process (stages: Qualify, Propose, Negotiate, Close) + Enterprise Page Layout + filtered picklars
**Speaker Notes:** This slide is the conceptual heart of Record Types. The three-pronged control — Business Process, Page Layout, Picklist filtering — is what the exam tests most. Remember: you cannot have different Opportunity stages without a Business Process. Business Processes are created and managed separately under Object Manager > [Object] > Business Processes, then linked to a Record Type. Picklist value filtering is done per picklist field per Record Type.

---

### Slide 5: Record Type Assignment to Profiles
**Visual:** Flowchart: User with Profile → Profile has Record Type Assignments → Available Record Types listed with star indicating Default → User creates record → sees Default Record Type pre-selected; can change to other available types
**Content:**
- Record Types are assigned to users via **Profile settings**
  - Profile > Object Settings > [Object] > Record Type Assignments (or Record Types section in classic profile view)
- Per object, per profile you define:
  - Which Record Types are **available** to users with this profile
  - Which is the **default** (pre-selected when creating a new record)
- Users only see picklist values, page layouts, and processes for their assigned Record Types
- If only one Record Type is available for a profile, users skip the selection step entirely
- **Permission Set Group Record Type Assignments** are an advanced option for adding record type access without changing the profile
**Speaker Notes:** The exam loves profile-to-record-type assignment scenarios. Know that it's the Profile that controls which record types a user can access, not the record type itself controlling who can see it. If a user reports they're not seeing certain picklist values or fields, check both their Profile's record type assignments and the page layout assigned to that record type. The default record type is auto-selected on new record creation.

---

### Slide 6: The Full Chain — Record Type → Layout → Business Process
**Visual:** Sequential chain diagram: Record Type → (Profile-specific) Page Layout assignment → Business Process; underneath each step, example values: "Enterprise Account RT" → "Enterprise Page Layout" → "Enterprise Sales Process (stages: Qualify/Propose/Close)"
**Content:**
- The full relationship chain:
  1. **Record Type** is created and linked to a Business Process (for applicable objects)
  2. **Page Layout Assignment** maps each Record Type to a Page Layout per Profile
  3. **Business Process** filters which Stage/Status values appear for that Record Type
- Page Layout Assignment is the bridge: one layout can serve multiple record types, or each record type can have its own layout per profile
- For objects without Business Processes (e.g., Accounts, Contacts), Record Types control only page layout and picklist filtering
- Business Processes exist for: Opportunity (Sales Process), Lead (Lead Process), Case (Support Process), Solution (Solution Process)
**Speaker Notes:** Walk through the chain slowly — this is a guaranteed multi-part exam scenario. A classic question: "A sales manager needs the Proposal stage to appear for Enterprise deals but not Small Business deals." The answer requires a Business Process + two Record Types. Another classic: "An admin needs different fields for different types of accounts." The answer is Record Types + Page Layout Assignments. Know which objects support Business Processes — Opportunity, Lead, Case, Solution — and which don't (Account, Contact).

---

### Slide 7: Multiple Page Layouts vs Dynamic Forms
**Visual:** Side-by-side comparison table: "Multiple Page Layouts" vs "Dynamic Forms" — rows: Setup effort, Maintenance, Field-level conditions, Profile-based field variation, Object support, Recommended for new orgs
**Content:**
- **Traditional approach:** Create separate page layouts for each variation, assign per Record Type/Profile
  - Works everywhere; supported for all objects
  - High maintenance as conditions multiply (5 variations = 5 layouts)
  - No field-level conditional visibility — you can hide a whole section but not a single field
- **Dynamic Forms (modern):** One page layout, individual fields as components with visibility conditions
  - Field-level conditional visibility without multiple layouts
  - Only available for custom objects and select standard objects
  - Edit page directly in App Builder (not Page Layout editor)
  - "Migrate to Dynamic Forms" wizard converts existing page layout sections to Dynamic Forms components
- Use Dynamic Forms when: object is supported, you need field-level conditions, you want to reduce layout proliferation
**Speaker Notes:** The comparison between multiple page layouts and Dynamic Forms is a live exam topic. Know when Dynamic Forms is the better answer (field-level visibility, fewer layouts to maintain) and when it isn't available (unsupported standard objects — you fall back to multiple layouts). The exam may describe a pain point and ask for the "most efficient" solution — Dynamic Forms will be the right answer for supported objects.

---

### Slide 8: Required Fields — Layout vs Field-Level
**Visual:** Two-column comparison: "Page Layout Required" (UI only — shows red asterisk on page) vs "Field-Level Required" (enforced everywhere — UI, API, import, Apex); each with scenario examples
**Content:**
- **Page Layout Required (UI Required):**
  - Red asterisk shown in the browser form
  - Only enforced when a user fills in a form through the Lightning/Classic UI
  - Bypassed by: API, Data Loader, Apex inserts, integrations, workflow field updates
  - Set in the Page Layout Editor by marking a field as "Required" in the layout
- **Field-Level Required (Schema-Level):**
  - Enforced universally — UI, API, Apex, integrations, all channels
  - Set in Object Manager > Fields & Relationships > [Field] > Field Definition (check "Required")
  - Cannot be bypassed programmatically without a system context workaround
- A field can be required on the layout but not at the field level (UI-only enforcement)
- A field required at the field level will also show as required on the layout
**Speaker Notes:** This distinction is a classic exam trap. A scenario will say "an admin set a field as required on the page layout, but Data Loader imports are still succeeding without that field populated." The answer is that page layout required is UI-only — Data Loader bypasses it. To enforce universally, use field-level required. On the flip side, if you need a field required only during a specific record type's UI workflow but not via API, use layout required.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 18. We're covering Page Layouts and Record Types — two of the most foundational concepts in Salesforce administration, and two of the most heavily tested areas on the Platform App Builder exam.

Let's start with the **Page Layout Editor**. Access it through Object Manager, select your object, then click Page Layouts. The editor is a drag-and-drop canvas. At the top is a palette of available fields and components; below is the canvas where you arrange them into sections. You can add sections, rename them, set them to 1 or 2 columns, and control whether they're collapsed by default.

The Page Layout controls several things: which fields appear in the record detail and edit views, what **Quick Actions** show up in the Highlights Panel action bar, which **Related Lists** appear at the bottom of the record, and what appears on **Mobile Cards** — those are the fields shown when a user expands a record in the Salesforce mobile app list view.

Let's zoom in on **Quick Actions** for a moment. These are the buttons you see in that top action bar on every record — New Contact, Edit, Log a Call, and so on. Quick Actions have types: Create Record creates a related record, Update Record opens a targeted edit form for specific fields, Log a Call records a call as a completed task, and you can also have Flow actions, custom LWC actions, or Visualforce actions. The order you arrange them on the layout is the order they appear in the bar.

Now, **Compact Layouts**. These are separate from the main page layout but equally important. A Compact Layout defines which fields appear in the Highlights Panel at the top of the record page — that band of key fields above the tabs. It also controls Kanban card displays, lookup hover cards, and the mobile app's record summary view. You configure Compact Layouts separately under Object Manager > [Object] > Compact Layouts, and you set one as the Primary per object.

Now let's talk about **Record Types** — a major topic. A Record Type lets you define sub-types of an object to serve different business processes. Each Record Type controls three things: the **Business Process** (which stage or status values are available), the **Page Layout assignment** (which layout users see for that record type), and **picklist value filtering** (which picklist options are available).

Business Processes exist for four objects: Opportunity (called Sales Process), Lead (Lead Process), Case (Support Process), and Solution (Solution Process). If you need different Opportunity stages for different sales teams, you create two Business Processes — one per team — then create two Record Types, one per team, linking each to its Business Process.

Record Types are assigned to users via their **Profile**. In the profile, under Object Settings for the relevant object, you specify which record types are available to users with that profile and which is their default. The default is pre-selected when they create a new record.

Here's the full chain to memorize: **Record Type → Business Process + Page Layout Assignment + Picklist Filtering**. A common exam scenario walks through a requirement and asks which combination you'd configure — practice mapping requirements to this chain.

Now, the modern alternative: **Dynamic Forms**. Instead of creating multiple page layouts to show different fields in different situations, Dynamic Forms lets you put individual fields directly on the Lightning page as components with visibility conditions. One page layout, conditional field visibility. It's cleaner, easier to maintain, and the direction Salesforce is heading. But it's only available for custom objects and select standard objects, so you still need multiple page layouts for unsupported objects.

Last — and this is a common exam trap — understand the difference between **page layout required** and **field-level required**. If you mark a field as required in the Page Layout Editor, that red asterisk only enforces when a user fills in the form through the browser UI. It does nothing to stop API calls, Data Loader imports, or Apex code from creating records without that field. If you need universal enforcement — everywhere, every channel — you need to mark the field as required at the field definition level in Object Manager. Know this distinction cold.

## 🔔 EXAM TIPS
- **Quick Action Types:** Memorize — Create Record, Update Record, Log a Call, Send Email, Custom (VF/LWC), Flow. These appear on layout and in the Highlights Panel action bar and mobile.
- **Compact Layout Surfaces:** Highlights Panel, Kanban card, lookup hover card, mobile summary. All four powered by Compact Layout — not Page Layout.
- **Record Type Three Controls:** Business Process, Page Layout Assignment, Picklist Value Filtering. Any exam scenario requiring different stages OR different layouts OR different picklists per user group = Record Types.
- **Business Process Objects:** Only Opportunity (Sales Process), Lead (Lead Process), Case (Support Process), Solution (Solution Process). Account, Contact, etc. do not have Business Processes — their Record Types control only layout and picklists.
- **Profile → Record Type:** Record Types are assigned through the Profile. Users only see record types their profile is assigned. Default record type = pre-selected on new record creation.
- **Layout Required vs Field-Level Required:** Layout required = UI only. Field-level required = enforced everywhere including API and integrations. Classic exam trap: "Data Loader skips the required field" = page layout required only.
- **Dynamic Forms vs Multiple Layouts:** Dynamic Forms is the modern answer for field-level conditional visibility on supported objects. Multiple page layouts = traditional approach, still required for unsupported objects.
- **Page Layout Assignment Matrix:** One layout can serve multiple Record Type + Profile combinations, OR each combination can have a unique layout. The assignment grid in Setup maps every combo.

## ✅ LECTURE SUMMARY
- Page Layout Editor controls fields, related lists, Quick Actions, custom links, and mobile cards via drag-and-drop
- Quick Action types: Create Record, Update Record, Log a Call, Send Email, Custom (VF/LWC), Flow
- Compact Layouts control the Highlights Panel, Kanban cards, lookup hover cards, and mobile summary — configured separately from Page Layout
- Record Types control three things per object: Business Process, Page Layout Assignment, and Picklist Value Filtering
- Business Processes exist only for Opportunity, Lead, Case, and Solution objects
- Record Types are assigned to profiles — each profile gets available record types and a default
- The chain: Record Type → Business Process + Page Layout (per Profile) + Picklist filtering
- Dynamic Forms is the modern replacement for multiple page layouts for field-level conditional visibility (supported objects only)
- Page Layout required = UI-only enforcement; Field-Level required = enforced everywhere including API

## ❓ MINI QUIZ

**Q1:** An admin sets a field as "Required" on the Account page layout. A developer runs a Data Loader import that leaves that field blank. The records import successfully. Why?
- A) Data Loader ignores all field validation  B) Page layout required is UI-only and does not enforce through the API  C) The field must be in a required section for API enforcement  D) Required fields must be marked in Compact Layout to be enforced via API
**Answer:** B — Page layout required fields show a red asterisk in the browser UI and block save through the form, but this enforcement does not apply to API calls, Data Loader, Apex, or integrations. For universal enforcement across all channels, the field must be set as required at the field definition level in Object Manager.

**Q2:** A company has two sales teams — Enterprise and SMB — that use different Opportunity stages. What is the correct configuration to support this?
- A) Create two Compact Layouts, one per team  B) Create two Sales Processes, two Record Types, and assign each Record Type to the appropriate team's profile  C) Create two Page Layouts with different Stage field sections  D) Use Dynamic Forms to filter Stage values by profile
**Answer:** B — Different Opportunity stages require different Sales Processes (the Business Process for Opportunities). You create a Sales Process per team, then create a Record Type for each team linked to its Sales Process, then assign each Record Type to the appropriate profile. Page layouts and Dynamic Forms cannot filter which picklist values (stages) are available.

**Q3:** Which of the following best describes what a Compact Layout controls?
- A) The fields and related lists shown on the full record detail page  B) The fields displayed in the Highlights Panel, Kanban cards, lookup hover cards, and mobile record summary  C) The actions shown in the Highlights Panel action bar  D) The page template columns used in Lightning App Builder
**Answer:** B — Compact Layouts define the small set of key fields that appear in the Highlights Panel at the top of the record page, on Kanban cards, in lookup hover cards, and in the mobile app's record summary view. Page layouts control the full record detail fields and related lists. Quick Actions on the page layout control the Highlights Panel action buttons.
