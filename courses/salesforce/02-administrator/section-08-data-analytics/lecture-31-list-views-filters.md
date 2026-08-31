# L31: List Views & Filters

## 🎯 Learning Objectives
- Distinguish between standard and custom list views and configure each
- Set list view sharing options (visible to all, groups, or only me)
- Use inline editing within list views to mass-update records
- Navigate Kanban view and Split view for different work styles
- Pin a list view as the default and manage related list views
- Apply search filters with AND/OR/custom filter logic

## 📊 SLIDES

### Slide 1: What Are List Views?
**Visual:** Screenshot of the Opportunities list view in Lightning Experience showing the list view selector (dropdown), the current view "My Opportunities," column headers, and individual record rows
**Content:**
- A **list view** is a filtered, sorted list of records for a specific object
- Displayed on the object's main tab (Accounts, Contacts, Opportunities, etc.)
- Two categories: **Standard list views** (provided by Salesforce) and **Custom list views** (created by users/admins)
- Standard examples: "All Accounts," "My Accounts," "Recently Viewed"
- Custom list views: defined filters, specific columns, sharing options
- Users can **pin** a list view as their default for that object tab
**Speaker Notes:** List views are the primary way most users interact with records on a day-to-day basis. They're essentially a pre-filtered, pre-sorted window into your data. Every object tab has at least one standard list view. The real power comes from creating custom list views with specific filters and columns tailored to a user's workflow. Unlike reports, list views are interactive — you can click directly into records and edit them inline.

### Slide 2: Creating Custom List Views
**Visual:** "New List View" dialog showing fields: List View Name, Unique Name (API), Sharing, Filter Criteria section, Column Selection
**Content:**
- Create from any object tab: click the List View selector → "New"
- Configure:
  - **Name and API name**
  - **Sharing settings** (who can see this list view)
  - **Filters** (which records to include)
  - **Columns** (which fields to display as columns)
- Columns can be reordered by drag-and-drop
- Column widths are adjustable per user (not saved globally)
- Up to **15 filters** per list view
- Supports standard fields, custom fields, and formula fields in columns
**Speaker Notes:** Creating a custom list view is straightforward and gives users tremendous control. The key settings are sharing (who sees it), filters (which records appear), and columns (what information is displayed). Remember that up to 15 filter criteria are supported per list view. Unlike reports, list views do not support aggregate calculations like SUM or AVG — they're designed for quick record access, not analytics.

### Slide 3: List View Sharing Options
**Visual:** Three icons side by side: (1) Single person icon labeled "Only I can see this list view," (2) Group of people icon labeled "Share with groups/roles," (3) Everyone icon labeled "All users can see this list view"
**Content:**
- **Visible to all users:** Any user with access to the object can see this list view
  - Best for: Standard team views ("All Open Opportunities," "High Priority Cases")
- **Visible to certain groups of users:** Share with specific Public Groups or Roles
  - Best for: Team-specific views ("Support Team Open Cases," "West Region Accounts")
- **Only I can see this list view:** Private — only the creator sees it
  - Best for: Personal working views ("My Priority Contacts This Week")
- Sharing is set at creation time but can be edited later
- Admins can edit or delete any list view regardless of creator
**Speaker Notes:** List view sharing is a commonly tested concept. The three options are: all users (public), selected groups/roles (shared), or only me (private). Note that "groups" here means Salesforce Public Groups — not Chatter groups. Admins have override access to all list views regardless of sharing setting, which is important for maintenance. When you share a list view with a role, users in that role AND any roles above it in the hierarchy can see it — this follows the standard role hierarchy visibility rules.

### Slide 4: Inline Editing in List Views
**Visual:** List view with one cell highlighted in edit mode (yellow border) showing a dropdown or text input, with a checkmark to save, and a "Mass update" banner at the top showing "5 records selected"
**Content:**
- **Inline editing:** Edit individual field values directly in the list view without opening the record
- Click any editable cell to enter edit mode; press Enter or click the checkmark to save
- **Mass inline editing:** Select multiple records (checkbox) → edit one cell → apply to all selected
  - "Do you want to update all X selected records?" confirmation prompt
- Works for most standard fields; some fields (lookups, complex fields) open a modal
- Requires "Edit" permission on the object and the field must be editable
- **Limitation:** Some field types (multi-select picklists, encrypted fields) are not inline editable in list views
**Speaker Notes:** Inline editing is a huge productivity feature. Instead of opening 20 records one by one to update the Stage field, a sales rep can select all 20 records in a list view and bulk-update the Stage in one action. The mass inline edit feature is powerful — just be careful, as changes are immediate and affect all selected records. Not all fields support inline editing; calculated formula fields are read-only by definition, and certain field types require the full record page.

### Slide 5: Kanban View
**Visual:** Kanban board showing opportunity cards organized in columns by Stage: "Prospecting" | "Qualification" | "Proposal" | "Negotiation" — with drag-and-drop arrow showing a card being moved between columns
**Content:**
- **Kanban view** displays records as cards organized in columns by a grouping field (usually a picklist)
- Available on most objects that have a relevant picklist field (Stage, Status, Priority, etc.)
- **Features:**
  - Drag-and-drop cards between columns to update the field value
  - Color-coded cards based on criteria
  - Summary fields per column (e.g., total Amount per Stage column)
  - Quick filter to show specific records
- Toggle between List/Kanban/Split view using the view selector icons
- **Best for:** Pipeline management, case queues, project task tracking
**Speaker Notes:** Kanban view is available in Lightning Experience only — not in Salesforce Classic. It's particularly popular with sales teams for pipeline management because dragging an opportunity from "Proposal" to "Negotiation" actually updates the Stage field on the record. The column summary (e.g., total Amount per column) gives a quick aggregate view. Admins can set which field is used for column groupings in the Kanban settings for that object.

### Slide 6: Split View
**Visual:** Split-screen showing list view on the left (30% width) with a record highlighted, and the record detail on the right (70% width), updating as different list items are clicked
**Content:**
- **Split view** shows the list on the left and the record detail on the right — simultaneously
- Click any record in the list to see its details on the right without a full page navigation
- The list stays visible, making it easy to work through records sequentially
- **Best for:** Customer service agents reviewing cases one by one, sales reps making follow-up calls
- Toggle from the view selector icons (same as Kanban)
- Maintains all the same filters and columns as the standard list view
- Available in Lightning Experience only
**Speaker Notes:** Split view is a workflow efficiency feature. Instead of clicking a record, going to the detail page, clicking back, clicking the next record — split view lets you quickly scan through records in the list and immediately see full details on the right. Think of it like an email client's inbox-preview layout. It's especially useful for high-volume workflows like outbound calling or case triaging.

### Slide 7: Pinning List Views & Related List Views
**Visual:** List view selector with a pin icon highlighted next to "My Open Opportunities," and below that a "Related Lists" tab on an Account record showing related Opportunities as a list
**Content:**
- **Pinning a list view:** Sets it as the default view that loads when you visit the object tab
  - Click the pushpin icon next to the list view name
  - Each user pins their own default — it's a personal setting per user per object
- **Related list views** (on record pages):
  - The related lists (Opportunities, Cases, Contacts on an Account) are also list views
  - Users can create custom related list views for specific related list panels
  - Filter and column choices apply to that related list for that user
- **Recently Viewed:** Always available as a default list view — shows last 10 records accessed
**Speaker Notes:** Pinning is a personal productivity feature — each user sets their own pinned view. The admin cannot force a pinned view for all users. For related list views on record pages, users can customize their view of related records — for example, an account manager might filter the Opportunities related list to show only open opportunities. This personalization enhances the user experience without requiring admin configuration.

### Slide 8: Filter Logic — AND/OR/Custom
**Visual:** Filter logic editor showing three filter conditions: (1) Stage = Prospecting, (2) Amount > 50000, (3) Close Date = This Quarter — with logic "1 AND (2 OR 3)" highlighted
**Content:**
- **Default logic:** All filter conditions use AND (record must match ALL criteria)
- **Custom filter logic:** Override the default AND behavior
  - Format: "1 AND 2 AND 3" or "1 AND (2 OR 3)" or "1 OR 2"
  - Use parentheses for grouping
  - Numbers correspond to filter row numbers
- **Use cases:**
  - "Show records where Status = Open OR Status = In Progress" (2 filters with OR)
  - "Stage = Proposal AND (Amount > 100K OR Priority = High)"
- Filter logic field appears below the filter rows in the list view editor
- Same logic syntax applies in both list views AND in reports
**Speaker Notes:** Custom filter logic gives you SQL-like WHERE clause control over which records appear. The default is AND — the record must match every single filter. Using OR logic lets you cast a wider net. Parentheses control evaluation order, just like in math. A common exam scenario: "A list view should show records that are either High Priority OR have an Amount over $100,000 — which filter logic accomplishes this?" The answer is "1 OR 2" where filter 1 is Priority = High and filter 2 is Amount > 100,000.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 31 — List Views and Filters. While reports are powerful for analysis, list views are where most Salesforce users spend their daily working time. Let's master them.

A list view is a filtered, sorted list of records on any object tab. Every object tab comes with standard list views like "All Accounts," "My Accounts," and "Recently Viewed." These cannot be deleted. Custom list views are where the real power lies — you can define exactly which records appear, which columns are shown, and who can see the view.

When creating a custom list view, you set three key things. First, sharing: visible to all users, shared with specific groups or roles, or private to yourself. Second, filters: up to 15 criteria that determine which records appear. Third, columns: which fields display as column headers.

Let's talk about inline editing. Instead of opening every record to make a change, you can click directly on a cell in the list view and edit it in place. Even better is mass inline editing: select 10 records with the checkbox, edit one cell, and Salesforce asks if you want to apply that change to all 10 selected records. This is a huge time saver for bulk updates.

Beyond the standard list view, there are two additional view modes. Kanban view organizes records as cards in columns, grouped by a picklist field. You drag cards between columns to update the field. For opportunities, the default grouping is Stage. For cases, it might be Status. Kanban is Lightning Experience only.

Split view is the third mode — it shows the list on the left and the record detail on the right. Click a row in the list, and the record appears on the right without a full page navigation. Perfect for workflows where you need to move through many records efficiently.

Users can pin a list view as their default — clicking the pushpin icon makes that view load automatically whenever they visit that object's tab. This is a personal setting per user.

Finally, filter logic. By default, all your filter conditions are combined with AND — the record must match every condition. Custom filter logic lets you use OR and parentheses for complex conditions. For example, filter logic "1 AND (2 OR 3)" means the record must match filter 1, and must also match either filter 2 or filter 3. This same syntax works in both list views and reports.

## 🔔 EXAM TIPS
- **List View Sharing:** Three options: All Users, Certain Groups (Public Groups or Roles), Only Me. Admins can edit any list view regardless of sharing.
- **Inline Editing in List Views:** Requires "Edit" object permission. Mass inline editing applies one change to all selected records.
- **Kanban and Split View:** Both are Lightning Experience only — not available in Salesforce Classic.
- **Pinning:** Each user individually pins their default list view — the admin cannot force a pinned view for all users.
- **Filter Logic:** Default is AND. Custom logic allows OR and parentheses. Syntax: "1 AND (2 OR 3)" where numbers correspond to filter row numbers.
- **List View Limits:** Up to 15 filter criteria per list view.
- **Related List Views:** Users can customize columns and filters on related lists on record pages — this is a personal user preference.

## ✅ LECTURE SUMMARY
- List views are filtered, sorted lists of records; standard views are provided by Salesforce, custom views are user/admin created
- Sharing options: All Users, Certain Groups/Roles, Only Me
- Inline editing allows direct cell editing; mass inline editing updates multiple selected records simultaneously
- Kanban view displays records as columns by picklist field; drag-and-drop updates the field value
- Split view shows list + record detail simultaneously; ideal for sequential record workflows
- Users pin their own default list view (personal per-user setting)
- Filter logic defaults to AND; custom logic supports OR and parentheses up to 15 conditions

## ❓ MINI QUIZ

**Q1:** A sales rep creates a custom list view for "My Open Opportunities" and sets it to "Only I can see this list view." His manager wants to see the same list view. What should happen?
- A) The manager can automatically see it because they are higher in the role hierarchy
- B) The rep should change the sharing to "All Users" or share with a group that includes the manager
- C) The admin must copy the list view and share it with the manager's role
- D) The manager can find it under "Shared With Me" in the list view selector

**Answer:** B — "Only I" means only the creator can see it, regardless of role hierarchy. To share it with the manager, the rep should edit the list view and change the sharing to "All Users" or to a specific group/role that includes the manager. Role hierarchy does not override list view privacy settings.

**Q2:** A user selects 15 case records in a list view and wants to bulk-update the Status field to "In Progress" for all of them. Which feature should she use?
- A) Data Loader
- B) Mass inline editing in the list view
- C) A Flow that runs on a schedule
- D) A Workflow Rule

**Answer:** B — Mass inline editing in list views allows a user to select multiple records, edit one field value, and apply that change to all selected records at once. This is the simplest and most direct approach for a user-initiated bulk update of a small number of records.

**Q3:** A list view is configured with three filters: (1) Status = "Open", (2) Priority = "High", (3) Created Date = "Last 7 Days." The filter logic is set to "1 AND (2 OR 3)." Which records appear in this list view?
- A) Records that match all three filters
- B) Records where Status is Open AND either Priority is High OR Created in Last 7 Days
- C) Records where Status is Open OR Priority is High OR Created in Last 7 Days
- D) Records where Priority is High AND Created in Last 7 Days, regardless of Status

**Answer:** B — The filter logic "1 AND (2 OR 3)" means: filter 1 must be true (Status = Open) AND at least one of filter 2 or filter 3 must also be true (Priority = High OR Created in Last 7 Days). So only Open records appear, and among those, only the ones that are High Priority or recently created.
