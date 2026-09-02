# L19: List Views & Search Layouts

## Exam Domain
User Interface — 17% of exam weight

---

## Core Concepts

### List Views
List Views are saved filters that display a subset of records for an object in a tabular or Kanban format. The key thing to understand is that list views are user-created but can be shared — the creator controls visibility: **Only I can see this** (private), **All users can see this** (public), or **Share with specific groups/roles** (targeted sharing). Admins can create list views and share them with all users.

### Inline Editing in List Views
List views support **inline editing** — users can click a field value directly in the list view and edit it without opening the full record. This requires the field to be editable via FLS and the list view must be set to support it. Inline editing saves time for bulk field updates.

### Kanban View
Any list view can be switched to **Kanban view** — a card-based visual board organized by a grouping field (typically a picklist like Stage or Status). Kanban is especially useful for pipeline management. You can drag cards between columns to update the grouping field. The fields shown on each Kanban card come from the **Compact Layout**.

### Split View
Split View shows the list view on the left and the record detail on the right — users can click a record in the list and see the details without leaving the list. This is available in Lightning Experience and is particularly useful in Sales Console navigation apps.

### Four Search Layout Types
Search Layouts control what fields appear in different search and list contexts. The four types: (1) **Search Results** — columns shown when users search and get results; (2) **Lookup Dialogs** — fields shown in the lookup dialog when searching for related records; (3) **Recent Records** — fields shown in recently accessed records; (4) **List View** (default layout for list views). Configuring Search Layouts is done per object in Object Manager → Search Layouts.

---

## PTA / SA Relevance

**List view design for adoption:** A well-designed set of list views significantly improves user adoption. Work with business teams in discovery to understand what "My Open Cases," "This Week's Deals," and "Stale Leads" look like — then create and share those list views. This is the difference between a generic Salesforce implementation and one that feels purpose-built.

**Kanban for pipeline management:** Sales teams love Kanban views for opportunity pipeline management. The key configuration: make sure the compact layout on Opportunity shows the fields reps care about (Deal Name, Amount, Close Date, Account) — these are the fields that appear on the Kanban cards.

**Search Layout governance:** Search Layouts are often overlooked but matter for usability. When users search for an Account, what columns do they see in the results? If the columns show irrelevant fields, users have a poor search experience. Configure Search Layouts during implementation, not after go-live.

**List view performance:** Very large list views (100k+ records) can be slow. Encourage users to add filter criteria to their list views. For reporting on large data sets, use Reports (which are optimized for large data) rather than list views.

---

## Architecture / How It Works

```
List View Sharing Options:
┌──────────────────────────────────────────────────────────────┐
│  WHO CAN SEE THIS LIST VIEW?                                 │
│                                                              │
│  Option 1: Only I can see this list view                     │
│  → Private list view, only the creator sees it              │
│                                                              │
│  Option 2: All users can see this list view                  │
│  → Public — all users with object read access see it        │
│                                                              │
│  Option 3: Share list view with groups of users              │
│  → Roles, Role+Subordinates, Public Groups — targeted       │
└──────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Admins can create/edit/delete any list view; non-admin users can only create/edit/delete their own
- "All users" sharing still respects record-level sharing — a user only sees records they have access to
- List views cannot filter by formula fields in complex ways (filter logic is limited to standard field comparisons)
- Maximum of 2,000 records displayed in a list view at once (use reports for larger data sets)

```
List View Options:
┌──────────────────────────────────────────────────────────────┐
│  Views available in Lightning Experience:                    │
│                                                              │
│  Table (default): Row/column display with sort              │
│                                                              │
│  Kanban: Card-based, grouped by picklist field              │
│     → Card content from Compact Layout                      │
│     → Drag card to change picklist value                    │
│                                                              │
│  Split: List on left, record detail on right                │
│     → Available for Console apps and Lightning Tabs         │
└──────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Kanban view is not available for all objects — the grouping field must be a picklist
- Kanban requires a picklist field with no more than a certain number of values to display columns
- Inline editing on list views requires FLS edit access on the specific field being edited

```
Four Search Layout Types:
┌──────────────────────────────────────────────────────────────────┐
│  1. SEARCH RESULTS LAYOUT                                        │
│     Fields shown in search results table when user searches     │
│     for records of this object                                  │
│                                                                  │
│  2. LOOKUP DIALOGS                                               │
│     Fields shown when a user opens a lookup dialog to search    │
│     for a related record (e.g., looking up an Account from a    │
│     Contact)                                                    │
│                                                                  │
│  3. RECENT RECORDS                                               │
│     Fields shown when a user opens an empty lookup field and    │
│     sees recently viewed records as suggestions                 │
│                                                                  │
│  4. LIST VIEW (default columns)                                  │
│     Default columns shown when users first create a list view   │
│     or see the default All [Objects] list view                  │
└──────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Search Layouts are configured per object in Object Manager → Search Layouts
- Lookup Dialog layout is separate from Search Results layout — configure both
- Changes to Search Layouts affect all users — there is no per-profile search layout

---

## Key Facts to Memorize
- List view sharing: Private / All Users / Groups (Roles, Public Groups)
- Inline editing: edit field values directly in the list view without opening the record
- Kanban view: card-based, drag to change grouping field value; card content from Compact Layout
- Split View: list on left, record detail on right — useful in console apps
- Four search layout types: Search Results / Lookup Dialogs / Recent Records / List View default
- List view max: 2,000 records displayed (use Reports for larger sets)
- Search Layouts: Object Manager → [Object] → Search Layouts

---

## Exam Traps
- **Kanban cards use Compact Layout.** The fields on Kanban cards come from the Compact Layout — not the page layout or list view columns.
- **"All users" still respects sharing rules.** Making a list view visible to all users doesn't give everyone access to all records — record-level sharing still applies.
- **Inline editing requires FLS edit access.** If a user can't inline-edit a field in a list view, check FLS — the field may be read-only for their profile.
- **There are 4 search layout types, not 1.** Each controls a different search/lookup context. Configuring the Search Results layout doesn't affect the Lookup Dialog layout.
- **List views are not reports.** They're quick filtered views with limited aggregation. For complex data analysis, use Reports and Dashboards.

---

## Practice Questions

**Q:** A sales manager creates a list view called "My Team's Open Deals" and wants all sales reps to see it. What sharing option should be set?
**A:** "All users can see this list view" — this makes the list view visible to all users with Opportunity read access. If the manager wants to limit it to just the sales team's role, "Share with groups of users" with the appropriate role selected is more targeted.

**Q:** A user wants to see a Kanban board of Opportunities grouped by Stage. They drag a card from "Prospecting" to "Qualification." What happens?
**A:** The Opportunity's Stage field is updated to "Qualification" — the same as if the user had opened the record and manually changed the Stage. The save respects all automation (flows, validation rules) that fire on Stage changes.

**Q:** A user searches for a Contact and sees columns "Full Name" and "Email" in the results table. An admin wants to add "Account Name" and "Phone" to the search results. Where is this configured?
**A:** Object Manager → Contact → Search Layouts → Search Results layout. Add Account Name and Phone to the search results columns. This change applies to all users searching for Contacts.
