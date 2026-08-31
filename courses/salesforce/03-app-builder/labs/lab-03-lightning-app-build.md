# Lab 3: Lightning App Build — Talent Hub

## 🎯 Lab Objectives
- Create a branded Lightning App using App Manager
- Build a custom Lightning App Page (Home Page) with report charts, list views, and recent items
- Customize a Job__c Record Page using Lightning App Builder and Dynamic Forms
- Apply component visibility rules using Dynamic Forms conditions
- Configure a compact layout to control how Job records appear in highlights panels and related lists
- Assign the app and its pages to the System Administrator profile

## ⏱️ Estimated Time
60 minutes

## 🔧 Prerequisites
- Labs 1 and 2 completed (Job__c, Candidate__c, Application__c objects and the "New Application Wizard" flow exist)
- At least 2–3 Job__c records created with varying Status values (needed for the report)
- System Administrator profile

## 📋 Step-by-Step Instructions

---

### Part 1: Create the Talent Hub App in App Manager

**Step 1:** In Setup, type `App Manager` in the Quick Find box and click **App Manager**.

**Step 2:** Click **New Lightning App** in the top-right corner.

**Step 3 — App Details:**
- **App Name:** `Talent Hub`
- **Developer Name:** auto-fills to `Talent_Hub`
- **Description:** `Centralized Lightning App for managing job postings, candidates, and applications`
- **Image:** (Optional) Upload a logo PNG. If skipping, leave blank.
- Click **Next**.

**Step 4 — App Branding:**
- Click the **color swatch** next to "Primary Color" and enter a hex code. Suggested options:
  - Teal: `#00796B`
  - Indigo: `#3F51B5`
  - Salesforce Blue: `#0070D2`
- Click **Next**.

**Step 5 — App Options:**
- **Navigation Style:** `Standard navigation` (tabbed navigation)
- **Form Factor:** keep both **Desktop** and **Phone** checked
- Click **Next**.

**Step 6 — Utility Items (skip for now):**
- Leave empty. (You will configure this in the Bonus section.)
- Click **Next**.

**Step 7 — Navigation Items:**
- In the **Search** box, find and move the following items to the **Selected Items** list using the **Add** button (in order):
  1. `Jobs`
  2. `Candidates`
  3. `Applications`
  4. `Reports`
  5. `Dashboards`
- Use the up/down arrows on the right to confirm this order.
- Click **Next**.

**Step 8 — User Profiles:**
- In the **Search** box, type `System Administrator` and click **Add**.
- Confirm `System Administrator` appears in the **Selected Profiles** list.
- Click **Save & Finish**.

**Step 9:** Click **Launch** to confirm the Talent Hub app opens and shows the correct navigation tabs.

---

### Part 2: Build the "Talent Hub Home" App Page

You will create a custom Lightning App Page that acts as the home screen for the Talent Hub app.

**Step 1 — Create a Report for the Chart:**

Before building the page, create a simple report to use in the Report Chart component.

- In the App Launcher, open **Reports** (or navigate to the Reports tab in Talent Hub).
- Click **New Report**.
- In the "Choose Report Type" dialog, search for and select **Jobs** (under "Job Application Tracker" or the object group you built). Click **Continue**.
- The Report Builder opens. Set:
  - **Report Format:** `Summary`
  - **Group Rows By:** `Status` (drag the `Status` field from the Fields panel to the "Group Rows" area)
  - **Columns:** keep `Job Name` (or add `Count`)
- Click **Save & Run**.
  - **Report Name:** `Jobs by Status`
  - **Report Unique Name:** auto-fills
  - **Report Folder:** `Public Reports` (or create a new folder called "Talent Hub Reports")
  - Click **Save**.
- The report runs and shows a summary grouped by Status. Click the **chart icon** on the report (bar chart) to enable a chart. Choose **Donut** or **Bar** and save.

**Step 2 — Open Lightning App Builder:**
- In Setup, type `Lightning App Builder` in Quick Find and click **Lightning App Builder**.
- Click **New**.

**Step 3 — Choose Page Type:**
- Select **App Page** and click **Next**.

**Step 4 — Page Name:**
- **Page Name:** `Talent Hub Home`
- Click **Next**.

**Step 5 — Choose Layout:**
- Select **Header and Two Equal Columns** (or "Header and Right Sidebar" for a wider main column).
- Click **Done**.

The App Builder canvas opens with a header region and two-column body.

**Step 6 — Add the Report Chart Component:**
- In the **Components** panel (left), search for `Report Chart`.
- Drag the **Report Chart** component into the **left column** of the page body.
- In the right panel, configure the component:
  - **Report:** click the lookup and select `Jobs by Status`
  - **Chart Size:** `Medium`
  - Check **Show chart title**
- The chart preview should appear in the canvas.

**Step 7 — Add the List View Component:**
- In the Components panel, search for `List View`.
- Drag the **List View** component into the **right column**.
- Configure:
  - **Object:** `Job`
  - **List View:** `Recently Viewed` (or `All Jobs` if it exists — you can create a new list view later)
  - **Number of Records:** `5`

**Step 8 — Add Recent Items Component:**
- In the Components panel, search for `Recent Items`.
- Drag the **Recent Items** component into the **header** region (or below the two columns — add a new row by clicking the bottom + icon).
- Configure:
  - **Title:** `Recently Viewed`
  - **Number of Records:** `5`

**Step 9 — Save the Page:**
- Click **Save** (top-right).

**Step 10 — Activate the Page:**
- Click **Activation...** (top-right, next to Save).
- On the **App Default** tab, click **Assign as App Default**.
- Select **Talent Hub** from the list and click **Save**.
- Click the **Back** arrow or **Done** to return to Setup.

**Step 11:** Open the **Talent Hub** app from the App Launcher. The first tab (or the home icon) should show your custom "Talent Hub Home" page with the report chart, list view, and recent items.

---

### Part 3: Customize the Job__c Record Page with Dynamic Forms

Dynamic Forms allow you to migrate fields off the page layout and onto the record page directly, with per-field visibility conditions.

**Step 1:** Navigate to the **Talent Hub** app and open any **Job** record.

**Step 2:** Click the **gear icon** (⚙️) at the top-right of the record page (the settings cog, NOT the global setup gear) and select **Edit Page**. This opens Lightning App Builder for the Job record page.

> **Alternatively:** In Setup > Lightning App Builder > look for an existing Job Record Page and click Edit.

**Step 3 — Enable Dynamic Forms:**
- On the canvas, click the **Details** tab section (or the fields component, typically labeled "Details").
- In the right panel, a banner should appear: **"Upgrade to Dynamic Forms"** or there may be a button labeled **"Migrate to Dynamic Forms"**.
- Click **Migrate to Dynamic Forms** (or **Upgrade**).
- A dialog appears summarizing the migration. Review it and click **Migrate**.

> **What this does:** Dynamic Forms moves the fields from the page layout into the record page as individual field components, giving you per-field control over layout and visibility.

**Step 4 — Add a Visibility Rule to Salary Fields:**

After migration, the individual fields appear as separate components on the canvas. Locate `Salary Min` and `Salary Max` on the canvas.

- Click on the **Salary Min (Salary_Min__c)** field component on the canvas.
- In the right panel, find the **Filters** section (or "Set Component Visibility").
- Click **Add Filter** (or the filter icon).
- Configure the condition:
  - **Filter Type:** `Field`
  - **Field:** `Status`
  - **Operator:** `Equal`
  - **Value:** `Offer Extended`
- Click **Done**.

- Repeat the same visibility condition for **Salary Max (Salary_Max__c)**:
  - Click the Salary Max field component on the canvas.
  - Click **Add Filter** > same condition: Status Equal "Offer Extended".
  - Click **Done**.

> **Result:** These two salary fields will only be visible on the record page when the Job's Status is "Offer Extended." This keeps the record page clean for most views.

**Step 5 — Add the Flow Component:**

- In the **Components** panel (left), search for `Flow`.
- Drag the **Flow** component to a desired location on the page (e.g., below the Details section or in a right sidebar column).
- In the right panel, configure:
  - **Flow:** select `New Application Wizard`
  - Check **Pass record ID into this variable** if prompted:
    - Variable: leave blank unless your flow has an input variable for the record ID (it does not in Lab 2, so leave unchecked)
- The flow will appear as an embedded wizard on the record page.

> **Tip:** For a cleaner UI, consider placing the flow in a tab or a collapsible section by adjusting the page layout in App Builder.

**Step 6 — Save and Activate for Talent Hub:**
- Click **Save** (top-right).
- Click **Activation...**.
- On the **App Default** tab, click **Assign as App Default**.
- Select **Talent Hub** and click **Save**.
- Click **Done** to exit App Builder.

**Step 7:** Return to the Talent Hub app and open a Job record. Confirm:
- Fields appear as configured (Salary Min/Max hidden unless Status = "Offer Extended")
- The New Application Wizard flow is embedded on the page

**Step 8 — Test Visibility Rule:**
- On a Job record, change Status to `Offer Extended` and save.
- Return to the record — Salary Min and Salary Max fields should now be visible.
- Change Status back to `Open` — the salary fields should disappear.

---

### Part 4: Configure a Custom Compact Layout for Job__c

Compact layouts control the fields shown in the highlights panel (top of a record page), Salesforce mobile cards, and list view hover cards.

**Step 1:** In Setup > **Object Manager**, search for and click **Job**.

**Step 2:** Click **Compact Layouts** in the left navigation.

**Step 3:** Click **New** to create a custom compact layout.

**Step 4:** Configure the compact layout:
- **Name:** `Job Compact Layout`
- **Label:** `Job Compact Layout`
- Under **Select Fields**, find and add the following fields in this order:
  1. `Job Title` (Job_Title__c)
  2. `Company` (Company__c)
  3. `Status` (Status__c)
  4. `Total Applications` (Total_Applications__c)
- Use the up/down arrows to ensure they appear in the order listed above.
- The compact layout supports up to 10 fields, but best practice is 4–5.
- Click **Save**.

**Step 5 — Set as Primary Compact Layout:**
- Back on the Compact Layouts page, click **Compact Layout Assignment**.
- Click **Edit Assignment**.
- Under **Primary Compact Layout**, select `Job Compact Layout` from the dropdown.
- Click **Save**.

**Step 6:** Navigate to a Job record in the Talent Hub app. The **Highlights Panel** at the top of the record should now display: Job Title, Company, Status, and Total Applications.

---

### Part 5: Assign the App to Profiles

The app was assigned to System Administrator during creation (Part 1), but you can verify or add more profiles here.

**Step 1:** In Setup > **App Manager**, find **Talent Hub** in the list and click **Edit** (click the dropdown arrow on the right side of the row).

**Step 2:** In the App Manager wizard, click through until you reach the **User Profiles** step (or look for a "Profiles" tab in the edit view).

**Step 3:** Confirm **System Administrator** is in the **Selected Profiles** list.

**Step 4 (Optional):** Add additional profiles if needed:
- Search for `Standard User` or `Sales User`
- Click **Add** to move them to Selected Profiles
- Click **Save**.

**Step 5:** Ask a colleague (or log in as a Standard User via the Check My Org feature in Trailhead) to confirm they can access Talent Hub from the App Launcher.

---

## ✅ Verification Checklist
- [ ] "Talent Hub" Lightning App created with custom branding color
- [ ] App navigation includes: Jobs, Candidates, Applications, Reports, Dashboards (in this order)
- [ ] System Administrator profile assigned to the Talent Hub app
- [ ] "Jobs by Status" report created with Summary format grouped by Status and a chart enabled
- [ ] "Talent Hub Home" App Page created with: Report Chart (Jobs by Status), List View (Job__c), Recent Items
- [ ] Talent Hub Home page activated as the default for the Talent Hub app
- [ ] Job__c record page migrated to Dynamic Forms
- [ ] Salary_Min__c and Salary_Max__c have visibility conditions: Status = "Offer Extended"
- [ ] New Application Wizard flow embedded as a component on the Job record page
- [ ] Job record page activated as the default for the Talent Hub app
- [ ] Custom compact layout created with fields: Job_Title__c, Company__c, Status__c, Total_Applications__c
- [ ] Custom compact layout set as the Primary compact layout for Job__c
- [ ] Highlights panel on Job records shows the 4 fields from the compact layout
- [ ] Visibility rule tested: Salary fields appear only when Status = "Offer Extended"

## 💡 Bonus Challenges
- **Utility Bar:** Edit the Talent Hub app in App Manager and add Utility Items:
  - Add **Recent Items** (shows recently viewed records)
  - Add **Notes** (quick note-taking without leaving the page)
  - Set the utility bar panel width and height, then verify it appears at the bottom of the Talent Hub app.

- **Einstein Analytics / CRM Analytics Home Page:** If your org has CRM Analytics (formerly Einstein Analytics) enabled, create a new Lightning App Page of type **Home Page**, add an **Analytics Dashboard** component, assign it to the Talent Hub app, and activate it. This gives executives a visual summary dashboard right on the home screen.

- **Custom Related List:** On the Job__c record page in Lightning App Builder, replace the standard related list component for Applications with a **Related List — Single** component. Configure it to show columns: Candidate Name, Status, Application Date, Salary Expectation. This gives recruiters a cleaner, focused view of applicants per job.

- **Page Variation with Audience:** In Lightning App Builder for the Job record page, create a **page variation** for users with a custom "Recruiter" profile: show a simplified layout with fewer fields and a prominent New Application button. Use the **Assign to Users** feature in Activation to control who sees each variation.
