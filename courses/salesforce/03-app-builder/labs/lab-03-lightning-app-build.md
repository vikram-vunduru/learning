# Lab 03: Lightning App Build — Talent Hub

## What You Need to Be Able to Do

This lab validates Lightning App Builder skills. Complete Labs 01 and 02 first.

---

### Talent Hub Lightning App

- [ ] Open Setup → App Manager → New Lightning App
  - Step 1: Name = "Talent Hub", Developer Name = Talent_Hub
  - Step 2: Upload a logo (optional), set a primary color
  - Step 3: Add utility item — none required (or add History)
  - Step 4: Navigation items: Jobs (Job__c tab), Candidates (Candidate__c tab), Applications (Application__c tab), Reports, Dashboards
  - Step 5: Assign to System Administrator profile

- [ ] Verify: Talent Hub appears in App Launcher; navigation shows the 5 tabs

---

### Custom App Page (Talent Hub Home)

- [ ] In Lightning App Builder, create a new **App Page**
  - Template: Header and Three Columns (or similar multi-column layout)
  - Name: "Talent Hub Home"

- [ ] Add components to the page:
  - Left column: **Recent Items** component (object: Job__c)
  - Center column: **Report Chart** component (select a Jobs by Status report — create the report first if needed)
  - Right column: **Rich Text** component with a welcome message

- [ ] Activate the page:
  - App: Talent Hub
  - Set as the default page for Talent Hub

- [ ] Verify: Navigate to the Talent Hub app; the custom home page is displayed

---

### Job__c Record Page with Dynamic Forms

- [ ] In Lightning App Builder, open or create a new **Record Page** for Job__c
  - Template: Header, Left Sidebar (or similar)

- [ ] Enable **Dynamic Forms** on the page (Edit Page → Upgrade Now if prompted)

- [ ] Add Field Sections:
  - Section 1: "Job Details" — Title__c, Department__c, Location__c, Status__c, Open_Positions__c
  - Section 2: "Metrics" — Total_Applications__c, Active_Applications__c
    - Set visibility rule: SHOW WHEN `Total_Applications__c > 0`
    - (The Metrics section only appears once applications exist)

- [ ] Add the **Related List** component for `Application__c` in the right column

- [ ] Add the **"Add Application"** Quick Action to the page (via Highlights Panel settings if not already on layout)

- [ ] Activate the page:
  - App: Talent Hub
  - Profile: System Administrator
  - (Or set as Org Default for Job__c if you want all users to see it)

---

### Compact Layout Configuration

- [ ] Navigate to Setup → Object Manager → Job__c → Compact Layouts
- [ ] Create a new Compact Layout named "Job Compact"
  - Include fields: Title__c, Status__c, Department__c, Location__c
- [ ] Set "Job Compact" as the Primary Compact Layout

- [ ] Verify: Open a Job__c record — the Highlights Panel at the top shows Title, Status, Department, Location
- [ ] Verify: Hover over a Job link from another record — the hover card shows the compact layout fields

---

## Key Concepts This Lab Tests

- Lightning App Manager 5-step wizard (Name → Branding → Utility → Navigation → Profiles)
- App Page: no record context, uses Report Chart + Rich Text + Recent Items
- Record Page with Dynamic Forms: field sections with visibility rules
- Component visibility rule: show a section only when a condition is met (metrics only when >0 applications)
- Compact Layout: controls Highlights Panel, Kanban cards, hover cards, mobile summaries
- Page activation: App + Profile assignment
- Dynamic Forms require the page to be migrated from standard layout to Dynamic Forms mode

---

## Common Mistakes to Avoid

- Creating an App Page and trying to add a Related List (Related List requires record context — App Pages don't have it)
- Forgetting to activate the page — it exists in App Builder but doesn't show to users until activated
- Compact Layout changes don't take effect until the compact layout is set as Primary
- Dynamic Forms visibility rules hide a section but don't enforce security — FLS still controls actual field access
- Not assigning the app to a profile in Step 5 — the app won't appear in App Launcher
