# Lab 1: Data Model Design — Job Application Tracker

## 🎯 Lab Objectives
- Create custom objects with appropriate fields, data types, and field-level properties
- Build a many-to-many relationship using a junction object (Application__c)
- Configure Roll-Up Summary fields to aggregate child record data
- Use Schema Builder to visualize and verify the complete data model
- Create custom Tabs and a Lightning App to surface the new objects

## ⏱️ Estimated Time
60 minutes

## 🔧 Prerequisites
- Access to a Salesforce Developer Edition org or Trailhead Playground
- System Administrator profile
- Familiarity with Salesforce Setup navigation

## 📋 Step-by-Step Instructions

---

### Part 1: Create the Job__c Object

**Step 1:** Log in to your Salesforce org and click the **gear icon** (⚙️) in the top-right corner, then select **Setup**.

**Step 2:** In the Quick Find box (left sidebar), type `Object Manager` and click **Object Manager**.

**Step 3:** Click **Create** (top-right dropdown) > **Custom Object**.

**Step 4:** Fill in the object definition:
- **Label:** `Job`
- **Plural Label:** `Jobs`
- **Object Name (API Name):** `Job` (Salesforce auto-fills this; the full API name becomes `Job__c`)
- **Record Name:** `Job Name` (leave as Text type)
- **Description:** `Tracks open and closed job postings`

**Step 5:** Under **Optional Features**, check the following:
- Allow Reports
- Allow Activities
- Track Field History
- Allow in Chatter

**Step 6:** Under **Search Status**, check **Allow Search**.

**Step 7:** Click **Save**.

---

Now add all required fields to Job__c. From the Job object detail page, click the **Fields & Relationships** tab, then **New** for each field below.

**Step 8 — Add Job_Title__c (Text):**
- Field Type: `Text`
- Click **Next**
- Field Label: `Job Title`
- Length: `255`
- Check **Required**
- Click **Next** > **Next** > **Save & New**

**Step 9 — Add Company__c (Text):**
- Field Type: `Text`
- Click **Next**
- Field Label: `Company`
- Length: `255`
- Check **Required**
- Click **Next** > **Next** > **Save & New**

**Step 10 — Add Status__c (Picklist):**
- Field Type: `Picklist`
- Click **Next**
- Field Label: `Status`
- Under "Enter values, with each value on its own row", type:
  ```
  Open
  Closed
  On Hold
  ```
- Check **Use first value as default**
- Click **Next** > **Next** > **Save & New**

**Step 11 — Add Location__c (Text):**
- Field Type: `Text`
- Click **Next**
- Field Label: `Location`
- Length: `100`
- Click **Next** > **Next** > **Save & New**

**Step 12 — Add Salary_Min__c (Currency):**
- Field Type: `Currency`
- Click **Next**
- Field Label: `Salary Min`
- Length: `16`, Decimal Places: `2`
- Click **Next** > **Next** > **Save & New**

**Step 13 — Add Salary_Max__c (Currency):**
- Field Type: `Currency`
- Click **Next**
- Field Label: `Salary Max`
- Length: `16`, Decimal Places: `2`
- Click **Next** > **Next** > **Save & New**

**Step 14 — Add Posting_Date__c (Date):**
- Field Type: `Date`
- Click **Next**
- Field Label: `Posting Date`
- Click **Next** > **Next** > **Save & New**

**Step 15 — Add Job_Description__c (Long Text Area):**
- Field Type: `Long Text Area`
- Click **Next**
- Field Label: `Job Description`
- Length: `32768`, Visible Lines: `5`
- Click **Next** > **Next** > **Save**

---

### Part 2: Create the Candidate__c Object

**Step 1:** In **Object Manager**, click **Create** > **Custom Object**.

**Step 2:** Fill in the object definition:
- **Label:** `Candidate`
- **Plural Label:** `Candidates`
- **Object Name:** `Candidate`
- **Record Name:** `Candidate Name` (Text type)
- **Description:** `Stores information about job applicants`

**Step 3:** Check the same Optional Features as the Job object (Reports, Activities, Track Field History, Allow in Chatter, Allow Search).

**Step 4:** Click **Save**.

---

Add fields to Candidate__c (click **Fields & Relationships** > **New** for each):

**Step 5 — Add First_Name__c (Text):**
- Field Type: `Text`
- Field Label: `First Name`
- Length: `50`
- Check **Required**
- Click **Next** > **Next** > **Save & New**

**Step 6 — Add Last_Name__c (Text):**
- Field Type: `Text`
- Field Label: `Last Name`
- Length: `50`
- Check **Required**
- Click **Next** > **Next** > **Save & New**

**Step 7 — Add Email__c (Email):**
- Field Type: `Email`
- Field Label: `Email`
- Check **Required**
- Check **Unique** (case-insensitive)
- Click **Next** > **Next** > **Save & New**

**Step 8 — Add Phone__c (Phone):**
- Field Type: `Phone`
- Field Label: `Phone`
- Click **Next** > **Next** > **Save & New**

**Step 9 — Add Resume_Summary__c (Long Text Area):**
- Field Type: `Long Text Area`
- Field Label: `Resume Summary`
- Length: `32768`, Visible Lines: `5`
- Click **Next** > **Next** > **Save**

---

### Part 3: Create the Application__c Junction Object

A junction object requires **two Master-Detail** relationships. You must create the object first, then add both relationship fields.

**Step 1:** In **Object Manager**, click **Create** > **Custom Object**.

**Step 2:** Fill in the object definition:
- **Label:** `Application`
- **Plural Label:** `Applications`
- **Object Name:** `Application`
- **Record Name:** `Application Name` — change the **Data Type** to `Auto Number`
  - Display Format: `APP-{0000}`
  - Starting Number: `1`
- **Description:** `Junction object linking Jobs and Candidates`

**Step 3:** Check Allow Reports, Allow Activities, Allow in Chatter, Allow Search.

**Step 4:** Click **Save**.

---

Add fields to Application__c:

**Step 5 — Add Job__c (Master-Detail to Job__c):**
- Click **Fields & Relationships** > **New**
- Field Type: `Master-Detail Relationship`
- Click **Next**
- **Related To:** `Job` (select from the dropdown)
- Click **Next**
- Field Label: `Job`
- Child Relationship Name: `Applications`
- Click **Next** > **Next** > **Save & New**

> **Important:** Salesforce requires the first Master-Detail on a junction object to be set as the primary (it controls sharing and deletion). Accept the default.

**Step 6 — Add Candidate__c (Master-Detail to Candidate__c):**
- Field Type: `Master-Detail Relationship`
- Click **Next**
- **Related To:** `Candidate`
- Click **Next**
- Field Label: `Candidate`
- Child Relationship Name: `Applications`
- Click **Next** > **Next** > **Save & New**

**Step 7 — Add Application_Date__c (Date):**
- Field Type: `Date`
- Field Label: `Application Date`
- **Default Value:** Click **Insert** > select **Today** (or type `TODAY()` in the formula field)
- Click **Next** > **Next** > **Save & New**

**Step 8 — Add Status__c (Picklist):**
- Field Type: `Picklist`
- Field Label: `Status`
- Enter values (one per line):
  ```
  Applied
  Under Review
  Interview Scheduled
  Offer Extended
  Rejected
  Withdrawn
  ```
- Check **Use first value as default** (defaults to "Applied")
- Click **Next** > **Next** > **Save & New**

**Step 9 — Add Notes__c (Long Text Area):**
- Field Type: `Long Text Area`
- Field Label: `Notes`
- Length: `32768`, Visible Lines: `4`
- Click **Next** > **Next** > **Save & New**

**Step 10 — Add Salary_Expectation__c (Currency):**
- Field Type: `Currency`
- Field Label: `Salary Expectation`
- Length: `16`, Decimal Places: `2`
- Click **Next** > **Next** > **Save**

---

### Part 4: Add Roll-Up Summary Fields to Job__c

Roll-Up Summary fields on Job__c will count how many Application__c records are related to each Job.

**Step 1:** In **Object Manager**, search for and click on the **Job** object.

**Step 2:** Click **Fields & Relationships** > **New**.

**Step 3 — Add Total_Applications__c (Roll-Up Summary — COUNT all):**
- Field Type: `Roll-Up Summary`
- Click **Next**
- Field Label: `Total Applications`
- **Summarized Object:** `Applications` (the Application__c relationship)
- **Roll-Up Type:** `COUNT`
- **Filter Criteria:** None (count all records)
- Click **Next** > **Next** > **Save & New**

**Step 4 — Add Applications_Under_Review__c (Roll-Up Summary — COUNT filtered):**
- Field Type: `Roll-Up Summary`
- Click **Next**
- Field Label: `Applications Under Review`
- **Summarized Object:** `Applications`
- **Roll-Up Type:** `COUNT`
- **Filter Criteria:** Check **Only records meeting certain criteria should be included in the calculation**
  - Field: `Status`
  - Operator: `equals`
  - Value: `Under Review`
- Click **Next** > **Next** > **Save**

> **Note:** Roll-Up Summary fields are read-only and recalculate automatically when child records change.

---

### Part 5: Schema Builder Verification

Schema Builder gives you a visual, drag-and-drop canvas of your object relationships.

**Step 1:** In Setup, type `Schema Builder` in the Quick Find box and click **Schema Builder**.

**Step 2:** When the canvas opens, click **Clear All** on the left panel to start with a clean view.

**Step 3:** In the **Objects** panel on the left, check the boxes for:
- `Job`
- `Candidate`
- `Application`

**Step 4:** The three objects should appear on the canvas connected by relationship lines. Verify:
- A line connects **Application** to **Job** (labeled with the Master-Detail icon)
- A line connects **Application** to **Candidate** (labeled with the Master-Detail icon)
- The **Application** object shows in the center as the junction

**Step 5:** Click on any object node to see its fields listed inside the canvas block. Confirm all fields you created appear.

**Step 6:** Hover over a relationship line to see the relationship name and cardinality (many-to-one from Application to each parent).

**Step 7:** Click **Auto-Layout** (top-right of canvas) to arrange the objects neatly. Take a screenshot or note the layout for your records.

**Step 8:** Click **Save** if prompted (Schema Builder does not require saving unless you create fields here).

---

### Part 6: Create Tabs and a Custom App

**Step 1 — Create a Tab for Job__c:**
- In Setup, type `Tabs` in Quick Find and click **Tabs**.
- Under **Custom Object Tabs**, click **New**.
- **Object:** `Job`
- **Tab Style:** Choose any icon (e.g., the briefcase icon)
- Click **Next** > **Next** > **Save**

**Step 2 — Create a Tab for Candidate__c:**
- Still on the Tabs page, under Custom Object Tabs, click **New**.
- **Object:** `Candidate`
- **Tab Style:** Choose any icon (e.g., the person/contact icon)
- Click **Next** > **Next** > **Save**

**Step 3 — Create a Tab for Application__c:**
- Under Custom Object Tabs, click **New**.
- **Object:** `Application`
- **Tab Style:** Choose any icon (e.g., the document icon)
- Click **Next** > **Next** > **Save**

**Step 4 — Create a Lightning App:**
- In Setup, type `App Manager` in Quick Find and click **App Manager**.
- Click **New Lightning App** (top-right).
- **App Name:** `Job Application Tracker`
- **Developer Name:** auto-fills to `Job_Application_Tracker`
- **Description:** `App for tracking job postings and applications`
- Click **Next**.

**Step 5:** On the **App Branding** page, choose a primary color (e.g., `#0070d2` for Salesforce blue) and optionally upload a logo image. Click **Next**.

**Step 6:** On the **App Options** page, leave defaults (Standard navigation, no utility bar for now). Click **Next**.

**Step 7:** On the **Utility Items** page, skip for now. Click **Next**.

**Step 8:** On the **Navigation Items** page:
- Search for and add: `Jobs`, `Candidates`, `Applications`, `Reports`, `Dashboards`
- Use the up/down arrows to order them as listed above.
- Click **Next**.

**Step 9:** On the **User Profiles** page, add **System Administrator**. Click **Save & Finish**.

**Step 10:** Click **Launch** (or navigate via the App Launcher) to verify the new app appears with all tabs.

---

## ✅ Verification Checklist
- [ ] Job__c object created with all 8 fields (Job_Title__c, Company__c, Status__c, Location__c, Salary_Min__c, Salary_Max__c, Posting_Date__c, Job_Description__c)
- [ ] Candidate__c object created with all 5 fields (First_Name__c, Last_Name__c, Email__c, Phone__c, Resume_Summary__c)
- [ ] Application__c object created with 2 Master-Detail fields pointing to Job__c and Candidate__c
- [ ] Application__c has all 5 additional fields (Application_Date__c, Status__c, Notes__c, Salary_Expectation__c)
- [ ] Total_Applications__c Roll-Up Summary field exists on Job__c and counts ALL Application__c records
- [ ] Applications_Under_Review__c Roll-Up Summary field exists on Job__c and filters to Status = "Under Review"
- [ ] Schema Builder shows all 3 objects with correct relationship lines
- [ ] Custom Tabs created for Job, Candidate, and Application objects
- [ ] "Job Application Tracker" Lightning App created with all 5 navigation items
- [ ] App is visible and accessible via the App Launcher

## 💡 Bonus Challenges
- On Job__c, add a **Formula** field named `Salary_Range__c` (Text formula) that displays the salary range as a readable string, e.g., `"$" & TEXT(Salary_Min__c) & " – $" & TEXT(Salary_Max__c)`.
- Add a **Validation Rule** on Application__c named `Salary_Expectation_In_Range` that prevents saving if `Salary_Expectation__c` is less than the related Job's `Salary_Min__c` or greater than `Salary_Max__c`. Use cross-object formula syntax: `Job__r.Salary_Min__c` and `Job__r.Salary_Max__c`.
- Explore **Field History Tracking** on Application__c: enable tracking for the Status__c field, create a test record, change the status, and view the history in the related History list.
