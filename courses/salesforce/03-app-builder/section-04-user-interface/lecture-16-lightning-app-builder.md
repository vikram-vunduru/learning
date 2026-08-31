# L16: Lightning App Builder

## 🎯 Learning Objectives
- Identify the three Lightning page types and explain when to use each
- Configure component visibility rules and understand the activation hierarchy
- Apply Dynamic Forms and Dynamic Actions to create conditional, context-aware record pages

## 📊 SLIDES

### Slide 1: What Is Lightning App Builder?
**Visual:** Screenshot of Setup > User Interface > Lightning App Builder list view showing existing pages with Type column (App Page, Record Page, Home Page)
**Content:**
- Declarative drag-and-drop tool for building Lightning pages
- Access: Setup > User Interface > Lightning App Builder
- No code required — compose pages from components
- Pages are activated and assigned to users, apps, profiles, or record types
- Replaces Classic page layouts for most UI customization
**Speaker Notes:** Lightning App Builder is the primary tool for customizing what users see in Lightning Experience without writing code. It sits entirely in Setup and lets admins drag standard and custom components onto a canvas to build purpose-built pages. Understanding when and how pages are activated is the core skill the exam tests here.

---

### Slide 2: The Three Lightning Page Types
**Visual:** Three-column comparison table with icons — App Page (star icon), Record Page (record detail icon), Home Page (house icon) — each with description and typical use case
**Content:**
- **App Page:** Custom home screen for a Lightning app; appears as a tab in the app nav bar; good for dashboards and embedded reports
- **Record Page:** Custom view for a specific object's record detail; replaces the standard record detail view; most commonly customized
- **Home Page:** The user's main "Home" tab; can include activities, assistant, news, and report charts; one per org/profile
- Each type has a different set of available components
- Page type cannot be changed after creation
**Speaker Notes:** The exam will present a scenario and ask which page type to create — nail the distinctions. App Pages are tied to a specific app nav bar tab. Record Pages override what someone sees when they open an Account, Case, or any other record. Home Pages control the Home tab, which is common in sales orgs for dashboard-style layouts.

---

### Slide 3: Page Templates
**Visual:** Grid of template thumbnail previews labeled: 1 Column, 2 Columns (wider left), 2 Columns (wider right), Header and 3 Regions, Header + Right Sidebar, 3 Columns, etc.
**Content:**
- Templates define the column and region layout of the page
- Selected at page creation; can be changed later (components rearrange)
- Common templates:
  - **1 Column:** Simple full-width layout
  - **2 Columns (wider left):** Most common for record pages — main content left, sidebar right
  - **Header + 3 Columns:** Good for App Pages with three equal sections
  - **Header and Right Sidebar:** Highlights Panel header area plus two columns
- Mobile form factor gets a separate, single-column template automatically
**Speaker Notes:** Template selection is mostly common sense but the exam occasionally tests whether you know you can change templates after creation. The Highlights Panel region at the top of record page templates is a special locked region — you cannot drag arbitrary components there; the Highlights Panel component lives there by default.

---

### Slide 4: Standard Components vs Custom Components
**Visual:** Two-column split — left: list of standard components (Highlights Panel, Related Lists, Chatter, Activities, Report Chart, Path, Flow, Rich Text, List View); right: custom components (LWC, Aura) with a small "Custom" badge icon
**Content:**
- **Standard components:** Provided by Salesforce out of the box; configured via properties panel on the right
- **Custom Lightning Web Components (LWC):** Developer-built; must be exposed to App Builder via `targetConfigs` in the component's metadata
- **AppExchange components:** Third-party; installed as managed packages
- Custom components appear in the same component panel as standard ones once deployed
- Always exhaust standard components before requesting custom development
**Speaker Notes:** On the exam, distinguish between standard components (no deployment needed) and custom LWC components (need a developer and deployment). AppExchange components bridge the gap — pre-built custom components you can install without internal development. Knowing this tier order — standard first, AppExchange second, custom last — is a tested concept.

---

### Slide 5: Component Visibility Rules
**Visual:** Rule builder UI mockup showing filter criteria rows: Field Value (Status equals Closed), Profile (Sales Rep), Form Factor (Desktop), Custom Permission (View Premium Data), Feature License (Pardot)
**Content:**
- Visibility rules control whether a component renders for a given user/context
- **Filter types:**
  - Field Value — e.g., show component only when Status = "Closed"
  - Profile — limit to specific profiles
  - Custom Permission — show only if user has a named custom permission
  - Form Factor — Desktop vs Phone (mobile)
  - Feature License — e.g., show only for Pardot users
- Multiple filters combined with AND/OR logic
- Component is hidden (not removed) if conditions are not met — no impact on data
**Speaker Notes:** Visibility rules are heavily tested. A common exam scenario: "An admin wants to show a component only on mobile for field reps" — answer is Form Factor filter. Another classic: "Show the escalation panel only when Case Status = Escalated" — answer is Field Value filter. Remember that visibility rules hide components from view but do not affect underlying data or record access.

---

### Slide 6: Activating Pages — The Specificity Hierarchy
**Visual:** Pyramid diagram with four levels from bottom to top: Org Default → App Default → Profile-Specific → Record-Type-Specific (labeled "Most Specific Wins" at top)
**Content:**
- A page must be **activated** to be seen by users
- Activation levels (most specific overrides less specific):
  1. **Org Default** — applies to all users across all apps
  2. **App Default** — applies to users of a specific Lightning app
  3. **Profile-Specific** — applies to users with a specific profile in a specific app
  4. **Record-Type-Specific** — applies to records of a specific record type (Record Pages only)
- Multiple activation assignments can coexist; most specific wins
- A page can be activated for multiple profiles or apps simultaneously
**Speaker Notes:** The "most specific wins" hierarchy is a guaranteed exam question. Memorize the four levels in order. If a Sales Rep profile user opens a Hot Lead record, Salesforce will first check for a record-type assignment, then profile, then app default, then org default — whichever match is most specific is what they see. Deactivating a page does not delete it.

---

### Slide 7: Dynamic Forms
**Visual:** Side-by-side comparison — left: traditional record page with Fields Section component referencing a Page Layout; right: Dynamic Forms record page with individual Field components and visibility conditions on each field
**Content:**
- **Dynamic Forms** removes fields from Page Layout and places them as individual Field components directly on the Lightning page
- Benefits:
  - Conditional field visibility without creating multiple page layouts
  - Show/hide individual fields based on field values, profile, or record type
  - Migrate existing page layout field sections into Lightning components with one click
- Configured per field: set visibility condition on each field or field section
- Only available for **custom objects** and select standard objects (Accounts, Contacts, Leads, Opportunities, Cases)
- Does NOT replace related lists or action buttons — only fields
**Speaker Notes:** Dynamic Forms is one of the most important modern features for App Builder exams. The traditional alternative was creating separate page layouts for each combination of visible fields — Dynamic Forms eliminates that complexity. Know that it is enabled per object and that it moves field control from the Page Layout editor into Lightning App Builder. The exam often contrasts "when would you use Dynamic Forms vs multiple page layouts."

---

### Slide 8: Dynamic Actions & Mobile Considerations
**Visual:** Left panel: Dynamic Actions filter showing action buttons with condition rules (Profile = Sales, Status != Closed); Right panel: mobile phone wireframe showing single-column layout
**Content:**
- **Dynamic Actions:** Show or hide action buttons (Quick Actions) based on:
  - Field values (e.g., hide "Close Case" when Status = Closed)
  - Record type
  - Profile
  - Custom permissions
- Replaces the need for multiple page layouts just to differ action bars
- Currently available for custom objects and select standard objects
- **Mobile layout:**
  - App Builder has a phone form factor tab (separate canvas)
  - Components can be shown/hidden per form factor via visibility rules
  - Not all components are available on mobile (e.g., Report Chart not supported on phone)
  - Single-column layout enforced on mobile
**Speaker Notes:** Dynamic Actions and Dynamic Forms together replace the most common reason admins needed multiple page layouts. Know that Dynamic Actions requires the page to have Dynamic Actions enabled (a toggle in activation), and that mobile layouts are a separate canvas in App Builder — you design desktop and phone views independently. On the exam, if a scenario asks about hiding a button for a specific profile, Dynamic Actions is the modern answer.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 16 on Lightning App Builder — the single most important tool in an admin's declarative toolkit for customizing the Lightning Experience UI.

Let's start with where to find it. Go to Setup, type "Lightning App Builder" in the Quick Find box, and you'll land on a list of all the Lightning pages in your org. From here you can create new pages, edit existing ones, clone them, or delete them.

When you create a new page, the first decision is the **page type** — and this comes up on the exam constantly. You have three choices. An **App Page** is essentially a custom tab you add to a Lightning app's navigation bar. Think of it as a dashboard home screen for that app. A **Record Page** customizes what users see when they open any individual record — an Account, a Case, an Opportunity. This is the most frequently customized page type in real orgs. And a **Home Page** is what users see on the Home tab, typically used for activity summaries, report charts, and the Sales Assistant widget.

After choosing your type, you select a **template** — this sets the column structure of the page. The "Header and Right Sidebar" template is extremely popular for record pages because it gives you a main content area on the left and a narrow sidebar on the right. You can change the template later, though components will rearrange.

Now the canvas opens and you drag **components** from the left panel onto your page. Standard components are provided by Salesforce — things like Related Lists, Chatter Feed, Activities Timeline, Highlights Panel, and Path. Custom components are LWC or Aura components your developers have built and deployed with the right metadata to appear in this panel. AppExchange components work the same way after installation.

One of the most powerful features is **component visibility rules**. Each component has a "Set Component Visibility" option in its properties panel. You can say "only show this component when the Opportunity Stage equals Closed Won" — that's a field value filter. Or "only show this on mobile" — that's a form factor filter. Or "only show this to users with the Service Rep profile." Multiple conditions stack with AND or OR logic. This is huge for building smart, context-aware pages without code.

Once your page is built, you have to **activate** it — otherwise it just sits in App Builder unused. The activation hierarchy has four levels: org default, app default, profile-specific, and record-type-specific. The most specific assignment wins. So if you assign a record page as the org default AND also assign a different page as the profile-specific version for Sales Reps, Sales Reps will see the profile-specific one.

Now let's talk about two modern superpowers: **Dynamic Forms** and **Dynamic Actions**. Dynamic Forms lets you take individual fields off your page layout and put them directly on the Lightning page as components — and then apply visibility conditions to each field or field section. This means you can have one page layout but show different fields to different users or in different situations. No more creating five page layouts for five variations of field visibility.

Dynamic Actions does the same thing for buttons. Instead of needing multiple page layouts just because the Sales team needs a different action bar than the Service team, you define conditions on each action button right in App Builder.

Finally, keep in mind that **mobile layout** is a separate canvas. You click the Phone tab in App Builder to design the mobile experience independently. Not all components work on mobile, and some visibility rules can target form factor. Always design both views intentionally.

## 🔔 EXAM TIPS
- **Page Type Selection:** Scenarios describe a need — match it to App Page (custom app tab/dashboard), Record Page (record detail view), or Home Page (the Home tab). Page type cannot be changed after creation.
- **Activation Hierarchy:** Memorize the four levels — Org Default, App Default, Profile-Specific, Record-Type-Specific. Most specific always wins. This is a high-frequency exam topic.
- **Visibility Rules vs Dynamic Forms:** Visibility rules hide/show entire components. Dynamic Forms hides/shows individual fields. Both avoid multiple page layouts but solve different problems.
- **Dynamic Forms Availability:** Only available for custom objects and select standard objects. Not available for every object — the exam may test this boundary.
- **Component Visibility — Form Factor:** "Show component only on mobile" = Form Factor filter, not a separate page. There is a separate phone canvas but form factor filters control per-component behavior.
- **Activating Pages:** A page that is not activated is never seen by users — building it is not enough. Deactivating restores the previous assigned page for those users.
- **Mobile Canvas:** The phone layout in App Builder is a separate canvas from desktop. Design them independently. Not all components are available on the phone canvas.
- **Clone vs Edit:** You can clone a Lightning page to create a copy you can modify — useful for creating profile-specific variants from a base template.

## ✅ LECTURE SUMMARY
- Lightning App Builder is accessed via Setup > User Interface > Lightning App Builder
- Three page types: App Page (app nav tab), Record Page (record detail), Home Page (Home tab)
- Pages are assembled from standard components, custom LWC, and AppExchange components
- Component visibility rules filter display by field value, profile, form factor, custom permission, or feature license
- Activation hierarchy — Org Default < App Default < Profile-Specific < Record-Type-Specific — most specific wins
- Dynamic Forms places individual fields as components with conditional visibility, replacing need for multiple page layouts
- Dynamic Actions controls button visibility by conditions, also replacing layout proliferation
- Mobile (phone) layout is a separate canvas designed independently from desktop

## ❓ MINI QUIZ

**Q1:** An admin wants to show a custom component only when an Opportunity's Stage field equals "Closed Won." Which component visibility filter type should they use?
- A) Profile  B) Form Factor  C) Field Value  D) Custom Permission
**Answer:** C — Field Value filters allow you to specify that a component only renders when a specific field on the record meets a defined condition, such as Stage = Closed Won.

**Q2:** A company has four Lightning pages for the Account Record Page — one set as Org Default, one as App Default for the Sales app, one as Profile-Specific for the Sales Rep profile, and one as Record-Type-Specific for Enterprise Accounts. A Sales Rep opens an Enterprise Account record. Which page do they see?
- A) Org Default  B) App Default  C) Profile-Specific  D) Record-Type-Specific
**Answer:** D — The activation hierarchy gives Record-Type-Specific the highest priority. Since the record is an Enterprise Account and there is a Record-Type-Specific assignment, that page wins regardless of the other assignments.

**Q3:** An admin wants to show different fields to users based on the value of the Status field without creating multiple page layouts. Which feature should they use?
- A) Compact Layouts  B) Dynamic Actions  C) Dynamic Forms  D) Page Layout sections
**Answer:** C — Dynamic Forms moves individual fields from the Page Layout onto the Lightning page as components, allowing field-level visibility conditions (e.g., show this field only when Status = Active). This eliminates the need for multiple page layouts to achieve field-level conditional visibility.
