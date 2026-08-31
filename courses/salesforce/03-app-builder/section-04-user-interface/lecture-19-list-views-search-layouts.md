# L19: List Views & Search Layouts

## 🎯 Learning Objectives
- Create and configure custom list views with filter criteria and sharing options
- Understand and use Kanban, Split View, and inline editing in list views
- Configure Search Layouts to control which fields appear across search results, lookups, and list view default columns

## 📊 SLIDES

### Slide 1: What Are List Views?
**Visual:** Screenshot of a custom Account list view in Lightning Experience showing column headers, filter pills, and action buttons
**Content:**
- List views display a filtered, sorted subset of records for any object
- Every object with a tab has at least one default list view (e.g., "Recently Viewed")
- Users can create personal list views; admins can create and share them organization-wide
- Accessed via the object tab — click the list view selector dropdown
**Speaker Notes:** List views are one of the most frequently used features in Salesforce because they let users focus on exactly the records they need. Understanding how to create, filter, and share them is both a daily admin task and a CRT-403 exam topic. Every standard and custom object tab surfaces list views, so the concepts apply universally.

---

### Slide 2: Creating a Custom List View
**Visual:** Step-by-step flow diagram: Object Tab → New List View → Name → Sharing → Add Filters → Select Columns → Save
**Content:**
- From any object tab, click the gear icon → **New** (or the list view picker → New)
- Enter a list view name and API name
- Choose **Sharing**: Only I can see this list view / All users can see this list view / Share with groups of users
- Add filter criteria (up to 10 filter conditions)
- Choose columns (up to 15 fields as display columns)
- Click **Save**
**Speaker Notes:** The sharing setting made at creation time can always be changed later. "Share with groups of users" allows granular sharing to public groups or roles — useful when different teams need different default views. The API name is auto-generated but can be customized; it matters when referencing the list view programmatically.

---

### Slide 3: List View Filters & Filter Logic
**Visual:** Filter panel screenshot showing three filter rows, a Filter Logic field with "1 AND (2 OR 3)" entered, and the Owner filter dropdown
**Content:**
- **Filter Criteria:** Field | Operator | Value — supports text, picklist, date, boolean, lookup fields
- **Filter Logic:** combine conditions with AND / OR / NOT using row numbers (e.g., `1 AND (2 OR 3)`)
- Without custom filter logic, all conditions use AND by default
- **Filter by Owner:** special filter available on most objects:
  - *My [Object]* — records owned by the running user
  - *All [Object]* — all records the user can see
  - *My Team's [Object]* — records owned by the user's subordinates (role hierarchy)
**Speaker Notes:** Filter logic is a key differentiator for list views — it allows flexible combinations that simple AND-only filtering cannot achieve. The "My Team's" option requires a role hierarchy to be in use and is commonly tested on the exam. Note that filter logic cannot reference the Owner filter itself; that filter is separate.

---

### Slide 4: Inline Editing in List Views
**Visual:** List view with a cell highlighted in edit mode, pencil icon visible, and a mass update dialog showing "Update 12 records"
**Content:**
- Click a field value directly in a list view to edit it inline — no need to open the record
- Requires **Inline Editing** to be enabled in Setup (Setup > User Interface)
- **Mass Update:** check multiple record checkboxes → edit a field value → a dialog appears to apply the same value to all selected records
- Supported fields: text, picklist, date, number, checkbox — not all field types are inline-editable
- Not available in read-only fields, formula fields, or fields the user lacks edit access to
**Speaker Notes:** Inline editing dramatically speeds up bulk data updates for end users. The exam tests whether you know the permission requirements: the user must have edit access to both the object and the specific field, and the admin must have enabled inline editing globally. Mass updates apply the same value to all selected records, so users should proceed carefully.

---

### Slide 5: Kanban View & Split View
**Visual:** Side-by-side comparison — left: Kanban board with columns for Opportunity stages; right: Split View with a list on the left pane and record detail on the right
**Content:**
- **Kanban View:**
  - Displays records as cards organized by columns based on a picklist field
  - Switch via the display icon in the list view toolbar (grid → Kanban)
  - Summarize card totals by a numeric/currency field (e.g., Opportunity Amount per Stage)
  - Drag cards between columns to update the picklist value
  - Requires the list view to be set up first; picklist field must exist on the object
- **Split View:**
  - Click the Split View icon to dock the list view as a left panel
  - Click any record in the list to open its detail in the right panel without full navigation
  - Ideal for call center agents or anyone processing a queue of records
**Speaker Notes:** Kanban view is especially popular for Opportunity pipeline management because dragging a card to "Closed Won" updates the Stage field instantly. The exam often asks which view type best suits a particular workflow scenario — Kanban for pipeline/status tracking, Split View for sequential processing. Neither view requires any additional configuration beyond a standard list view.

---

### Slide 6: Search Layouts Overview
**Visual:** Diagram showing four Search Layout types with arrows pointing to where each one appears in the UI: Search Results page, Lookup Dialog, List View (default columns), Recently Viewed Records
**Content:**
- **Search Layouts** control which fields are displayed in search-related contexts for an object
- Four types per object (configured in Object Manager):
  1. **Search Results** — columns shown on the global search results page
  2. **Lookup Dialogs** — columns shown when a user clicks a lookup field magnifying glass
  3. **List View** — default columns for newly created list views (does NOT affect existing views)
  4. **Recently Viewed** — fields shown in the recently viewed drop-down
- In Lightning Experience: Setup → Object Manager → [Object] → Search Layouts for Salesforce Classic (also affects Lightning for most contexts)
- Lightning Experience has a separate **Search Layouts for Lightning Experience** section when available
**Speaker Notes:** Search Layouts are purely an admin configuration — end users cannot change them. Many admins overlook the "List View" search layout, which only sets default columns for brand-new list views; users can always adjust columns on individual list views afterward. The exam distinguishes between the four layout types and where each appears.

---

### Slide 7: Configuring Search Layouts
**Visual:** Object Manager > Accounts > Search Layouts page showing editable layout rows with Available Fields and Selected Fields columns
**Content:**
- Navigate: **Setup → Object Manager → [Object] → Search Layouts**
- Click **Edit** next to the layout type you want to change
- Move fields between **Available Fields** and **Selected Fields** using arrows
- Order matters — first field = leftmost column
- Maximum fields vary by layout type (e.g., 10 for Search Results)
- Changes take effect immediately — no deployment needed
- **Classic vs Lightning:** Search Layouts for Salesforce Classic apply to most Lightning contexts; some objects have a dedicated Lightning Experience section
**Speaker Notes:** A common exam scenario presents a user complaint that certain fields don't appear in search results or lookup dialogs, and the answer is always to update the Search Layout for that object. Remember that Search Layouts are object-specific — you must configure them separately for each object. The change is metadata only, so there's no need for a change set in a sandbox-to-production workflow if you configure it directly in production.

---

### Slide 8: Einstein Search & Global Search
**Visual:** Global search bar at the top of Lightning Experience with a drop-down showing "Top Results," scoped object filters, and AI-personalized suggestions
**Content:**
- **Global Search:** search bar at the top of every Lightning page — searches across all searchable objects the user has access to
- Results page shows **Top Results** (most relevant across objects) and per-object tabs
- **Scoped Search:** click the object name in the search bar to restrict results to one object
- **Einstein Search** (requires permission set/license in some editions):
  - Personalizes results based on user's recent activity and role
  - Natural language search: type "my open opportunities closing this quarter" and it interprets intent
  - Instant results appear as you type (typeahead)
- Searchable fields are controlled by **Field-Level Security** — users only see fields they can read
- **Search Index:** not all fields are indexed by default; custom fields can be enabled for search
**Speaker Notes:** Einstein Search is an increasingly common exam topic as it rolls out more broadly. The key distinction is that Einstein Search personalizes and interprets natural language, whereas standard global search does simple keyword matching. Both respect field-level security, so if a user can't see a field, it won't appear in search results even if it's in the search layout.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 19, where we cover List Views and Search Layouts — two features that directly shape how users find and interact with records every day.

Let's start with list views. A list view is simply a saved filter and column configuration on an object. Every object tab shows a list view, and Salesforce ships each object with a few defaults like "Recently Viewed" and "All Accounts." But the real power comes from building your own.

Creating a list view takes about 30 seconds. On any object tab, click the gear or the list view picker and choose New. You give it a name, decide who can see it — just you, everyone, or specific groups — add your filter conditions, pick your columns, and save. That's it. The sharing option is worth remembering for the exam: you have three choices — private, public to all users, or shared with specific groups or roles.

Filters are where list views get interesting. You can add up to ten filter conditions and combine them with filter logic. Instead of all-AND logic, you can write something like "1 AND (2 OR 3)" to get exactly the records you need. There's also a special "Filter by Owner" that lets users toggle between their own records, all records they can see, or their team's records via the role hierarchy.

Once you have a list view, you have three powerful ways to work with it. First, inline editing — just click a cell to edit it directly. No opening records, no navigating away. If you select multiple records first and then edit a cell, Salesforce offers to apply that change to all selected records at once. That's a huge time-saver for bulk updates.

Second, Kanban view. Click the display icon and switch to Kanban to see records as cards organized by any picklist field. Opportunity Stage is the classic use case — your pipeline becomes a drag-and-drop board. Third, Split View — pin the list to the left side of the screen and click through records on the right without losing your place in the list. Perfect for working through a queue.

Now let's shift to Search Layouts. These control which fields appear in four specific places: the global search results page, lookup dialog windows, the default columns when someone creates a new list view, and the recently viewed records dropdown. You configure them per object in Setup under Object Manager.

The most important thing to remember: Search Layouts for the "List View" type only affect the default columns for brand-new list views. Existing list views are untouched. And if a user complains they can't see a certain field in search results or a lookup dialog, the fix is always the Search Layout for that object — not field-level security, not page layout.

Speaking of search, the global search bar at the top of every Lightning page searches everything the user can access. Einstein Search takes this further by personalizing results based on your activity and supporting natural language queries. Both respect field-level security completely.

For the CRT-403 exam, know the three list view sharing options, how filter logic works, what inline editing requires, the difference between Kanban and Split View, and the four types of search layouts and where each one appears. Those are the high-frequency topics in this area.

## 🔔 EXAM TIPS
- **List View Sharing Options:** There are exactly three: visible to me only, visible to all users, visible to groups/roles. Know when to use each.
- **Filter Logic Requirement:** Custom filter logic (AND/OR combinations) is only available when you have at least two filter conditions. You must type the logic string manually (e.g., `1 AND (2 OR 3)`).
- **Inline Editing Prerequisites:** Must be enabled globally in Setup > User Interface AND the user must have field-level edit access to the specific field being edited.
- **Kanban Requirement:** Requires a picklist field on the object to group cards by — it cannot use a text or number field for column grouping.
- **Search Layout Types:** Memorize all four types (Search Results, Lookup Dialogs, List View defaults, Recently Viewed) and where each appears in the UI.
- **List View Search Layout Scope:** The "List View" search layout only sets default columns for NEW list views — it does not retroactively change existing list views.
- **Einstein Search:** Requires appropriate license/edition and permission sets; provides natural language and personalized search beyond standard keyword matching.
- **My Team's Filter:** The "My Team's [Object]" owner filter relies on the role hierarchy — only works if a role hierarchy is configured and the user has subordinates.

## ✅ LECTURE SUMMARY
- List views are saved filter + column configurations on any object tab, with three sharing options: private, all users, or specific groups/roles
- Filter logic lets you combine conditions with AND/OR/NOT for precise record filtering beyond simple all-AND criteria
- Inline editing allows direct cell editing in list views; mass updates apply one value to multiple selected records simultaneously
- Kanban view organizes records as cards by a picklist field; Split View pins the list left and opens record details on the right
- Search Layouts control fields displayed in four contexts: Search Results, Lookup Dialogs, List View defaults (new views only), and Recently Viewed
- Search Layouts are configured per object in Setup > Object Manager and take effect immediately with no deployment required
- Einstein Search adds AI-personalized and natural language search capabilities on top of standard global search

## ❓ MINI QUIZ

**Q1:** A sales manager wants a list view showing open opportunities where either the amount is over $50,000 OR the close date is this month. Which feature makes this possible?
- A) A second list view filtered by each condition separately
- B) Filter Logic using AND/OR combinations on list view filters
- C) A report filtered by two cross-filter criteria
- D) Einstein Search with a natural language query

**Answer:** B — List view Filter Logic lets you write a condition string like "1 OR 2" to combine filters with OR logic, which is exactly what's needed here. A single list view with filter logic "1 OR 2" would capture both conditions without needing two separate views.

---

**Q2:** An admin wants the Account Name, Phone, and Annual Revenue fields to appear as columns every time a user creates a new list view on the Account object. Where should the admin configure this?
- A) Setup > User Interface > List View Defaults
- B) Object Manager > Account > Search Layouts > List View
- C) Object Manager > Account > Page Layouts > List View Section
- D) Setup > Search > Global Search Configuration

**Answer:** B — The "List View" type under Search Layouts in Object Manager controls the default columns for newly created list views on that object. Changes here only affect new list views, not existing ones.

---

**Q3:** A user complains that when they open a lookup field on a Case record to search for a Contact, the lookup dialog only shows the Contact Name and no other fields. How should the admin fix this?
- A) Edit the Case page layout and add the Contact fields to the lookup section
- B) Update the Contact object's Search Layouts > Lookup Dialogs to include additional fields
- C) Enable the Contact fields in the Case's related list columns
- D) Grant the user the "View All Data" permission

**Answer:** B — The Lookup Dialog search layout on the Contact object controls which fields appear when any lookup to Contact is used. The admin should add the desired fields (e.g., Email, Account Name) to the Contact's Lookup Dialogs search layout in Object Manager.
