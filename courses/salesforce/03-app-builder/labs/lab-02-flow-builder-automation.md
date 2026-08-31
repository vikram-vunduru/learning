# Lab 2: Flow Builder Automation

## 🎯 Lab Objectives
- Build a Before-Save Record-Triggered Flow to auto-populate fields on new Application__c records
- Create a multi-screen Screen Flow to guide users through a "New Application" wizard
- Use Flow elements: Assignment, Get Records, Create Records, and Display Text
- Embed the Screen Flow as a Quick Action on the Job__c record page
- Test both flows end-to-end in the org

## ⏱️ Estimated Time
60 minutes

## 🔧 Prerequisites
- Lab 1 completed (Job__c, Candidate__c, Application__c objects exist)
- System Administrator profile
- At least one Job__c record created (needed for testing)

## 📋 Step-by-Step Instructions

---

### Part 1: Before-Save Record-Triggered Flow

This flow runs before an Application__c record is saved to the database, allowing you to set default field values without a DML operation — making it faster than after-save flows.

**Step 1:** In Setup, type `Flows` in the Quick Find box and click **Flows**.

**Step 2:** Click **New Flow**.

**Step 3:** On the "New Flow" dialog, select **Record-Triggered Flow** and click **Create**.

**Step 4:** The flow canvas opens. In the **Configure Trigger** panel on the right:
- **Object:** `Application` (type "Application" and select `Application__c`)
- **Trigger:** `A record is created`
- **Optimize the Flow for:** `Fast Field Updates` — this is the Before-Save option. It tells Salesforce to run the flow before writing to the database.
- Click **Done**.

**Step 5:** You should see a **Start** element on the canvas connected to a trigger node. Click the **+** (Add Element) icon below the trigger to add the first element.

**Step 6:** Select **Assignment** from the element panel.

**Step 7:** Configure the Assignment element:
- **Label:** `Set Default Status and Date`
- **API Name:** auto-fills to `Set_Default_Status_and_Date`
- Under **Set Variable Values**, add the first row:
  - **Variable:** `{!$Record.Status__c}` — click inside the field, then type or select `Status__c` from the Application object
  - **Operator:** `Equals`
  - **Value:** Type `Applied` (the literal string value)
- Click **Add Assignment** to add a second row:
  - **Variable:** `{!$Record.Application_Date__c}`
  - **Operator:** `Equals`
  - **Value:** Click the toggle to **Formula**, then type `TODAY()`
- Click **Done**.

> **Why no Decision element?** Before-Save flows using `$Record` automatically respect fields already set — however, to be safe and avoid overwriting user-entered values, add a Decision element in the next steps.

**Step 8:** Click on the **Start** element to edit the trigger. Between the trigger and the Assignment, we will insert a **Decision** element to check if fields are blank first.

Click the **+** between the trigger node and the Assignment element, then select **Decision**.

**Step 9:** Configure the Decision element:
- **Label:** `Are Fields Blank?`
- **API Name:** `Are_Fields_Blank`
- Under **Outcomes**, configure the default outcome label as `Fields Not Blank`
- Click **New Outcome**:
  - **Label:** `Status is Blank`
  - **API Name:** `Status_is_Blank`
  - **Condition Requirements:** `All Conditions Are Met (AND)`
  - Add Condition 1:
    - **Resource:** `{!$Record.Status__c}`
    - **Operator:** `Is Null`
    - **Value:** `{!$GlobalConstant.True}`
  - Add Condition 2 (click **Add Condition**):
    - **Resource:** `{!$Record.Application_Date__c}`
    - **Operator:** `Is Null`
    - **Value:** `{!$GlobalConstant.True}`
- Click **Done**.

**Step 10:** Connect the **"Status is Blank"** outcome path from the Decision to the **Assignment** element you created earlier. The "Fields Not Blank" path leads to the End element (no action).

**Step 11:** Click the **Save** button (top-right).
- **Flow Label:** `Application Defaults - Before Save`
- **Flow API Name:** `Application_Defaults_Before_Save`
- **Description:** `Sets default Status to Applied and Application Date to today when a new Application record is created`
- Click **Save**.

**Step 12:** Click **Activate** (top-right) to make the flow live.

> **Confirm:** A banner should appear stating "Your flow is now active."

---

### Part 2: Screen Flow — Building the Screens

This Screen Flow walks users through a 3-screen wizard to create a new application from a Job record page.

**Step 1:** In Setup > **Flows**, click **New Flow**.

**Step 2:** Select **Screen Flow** and click **Create**.

**Step 3:** The canvas opens showing a **Start** node. Click the **+** below Start and select **Screen**.

**Step 4 — Configure Screen 1 ("Select Job"):**
- **Label:** `Select Job`
- **API Name:** `Select_Job`
- In the **Screen** editor (right panel), click the **Components** tab and search for **Lookup**.
- Drag a **Lookup** component onto the screen canvas.
  - **Label:** `Select a Job`
  - **API Name:** `jobLookup`
  - **Object:** `Job`
  - **Field:** `Name` (the record name field)
  - Check **Required**
- Click **Done**.

**Step 5:** Click the **+** after Screen 1 and select **Screen**.

**Step 6 — Configure Screen 2 ("Candidate Info"):**
- **Label:** `Candidate Info`
- **API Name:** `Candidate_Info`
- Add the following components to the screen (search in Components tab and drag each one):

  - **Text** component:
    - Label: `First Name`
    - API Name: `firstName`
    - Check **Required**

  - **Text** component:
    - Label: `Last Name`
    - API Name: `lastName`
    - Check **Required**

  - **Text** component:
    - Label: `Email`
    - API Name: `email`
    - Check **Required**
    - Input Validation: select **Email** from the Validate Input dropdown (if available)

  - **Text** component:
    - Label: `Phone`
    - API Name: `phone`
    - (Not required)

- Click **Done**.

**Step 7:** Click the **+** after Screen 2 and select **Screen**.

**Step 8 — Configure Screen 3 ("Confirm"):**
- **Label:** `Confirm`
- **API Name:** `Confirm`
- Add a **Display Text** component:
  - **API Name:** `confirmationText`
  - In the text editor, click **Insert a resource** and compose the message. Type the following, inserting merge fields using the "Insert a resource" button (the `{! }` icon):
    ```
    Please review your application details:

    Job: {!jobLookup}
    Name: {!firstName} {!lastName}
    Email: {!email}
    Phone: {!phone}

    Click Finish to submit your application.
    ```
- Check **Pause** is unchecked (this screen is informational only).
- Click **Done**.

---

### Part 3: Screen Flow — Create Records After Finish

After the user clicks Finish on Screen 3, the flow must create a Candidate__c record and an Application__c record.

**Step 1:** Click the **+** after Screen 3 ("Confirm") and select **Create Records**.

**Step 2 — Configure Create Candidate:**
- **Label:** `Create Candidate`
- **API Name:** `Create_Candidate`
- **How to Set the Record Fields:** `Use separate resources, and literal values`
- **Object:** `Candidate`
- Map fields:
  - `First_Name__c` = `{!firstName}`
  - `Last_Name__c` = `{!lastName}`
  - `Email__c` = `{!email}`
  - `Phone__c` = `{!phone}`
- **Store Record ID:** check this option
  - **Variable to store the ID:** click **New Resource**
    - Resource Type: `Variable`
    - API Name: `newCandidateId`
    - Data Type: `Text`
    - Click **Done**
- Click **Done**.

**Step 3:** Click the **+** after Create Candidate and select **Create Records**.

**Step 4 — Configure Create Application:**
- **Label:** `Create Application`
- **API Name:** `Create_Application`
- **How to Set the Record Fields:** `Use separate resources, and literal values`
- **Object:** `Application`
- Map fields:
  - `Job__c` = `{!jobLookup}` (the record ID from the Lookup component)
  - `Candidate__c` = `{!newCandidateId}` (the ID stored from the previous step)
  - `Status__c` = `Applied` (literal value)
  - `Application_Date__c` = `{!$Flow.CurrentDate}` (system variable for today's date)
- Click **Done**.

**Step 5:** Confirm the canvas flow order is: Start → Screen 1 → Screen 2 → Screen 3 → Create Candidate → Create Application → End.

**Step 6:** Click **Save**.
- **Flow Label:** `New Application Wizard`
- **Flow API Name:** `New_Application_Wizard`
- **Description:** `Screen flow to create a Candidate and Application from a Job record page`
- Click **Save**.

**Step 7:** Click **Activate**.

---

### Part 4: Embed the Screen Flow as a Quick Action

To make the flow accessible from a Job record page, you must: (1) Create a Quick Action that launches the flow, and (2) add the action to the Job page layout.

**Step 1 — Create the Quick Action:**
- In Setup > **Object Manager**, search for and click on the **Job** object.
- Click the **Buttons, Links, and Actions** tab.
- Click **New Action**.
- **Action Type:** `Flow`
- **Flow:** select `New Application Wizard`
- **Label:** `New Application`
- **Name:** auto-fills to `New_Application`
- **Description:** `Launch the New Application Wizard screen flow`
- Click **Save**.

**Step 2 — Add the Action to the Job Page Layout:**
- Still on the Job object, click the **Page Layouts** tab.
- Click the **Job Layout** (or your existing layout name).
- In the palette at the top, click **Mobile & Lightning Actions**.
- Scroll or search for the **New Application** action you just created.
- Drag it into the **Salesforce Mobile and Lightning Experience Actions** section on the layout.
- Click **Save**.

> **Note:** If you see "Override the predefined actions?" — click **Yes, override** to see your action in the section.

---

### Part 5: Test Both Flows

**Test the Before-Save Flow:**

**Step 1:** Open the **Job Application Tracker** app (or any app with the Applications tab) from the App Launcher.

**Step 2:** Navigate to the **Applications** tab and click **New**.

**Step 3:** Fill in the required Master-Detail fields (Job and Candidate — you may need to create test records for these first):
- **Job:** link to any existing Job record
- **Candidate:** link to any existing Candidate record
- Leave **Status** and **Application Date** blank intentionally.
- Click **Save**.

**Step 4:** Open the newly created Application record. Verify:
- **Status** = `Applied` (set by the flow)
- **Application Date** = today's date (set by the flow)

**Test the Screen Flow Quick Action:**

**Step 5:** Navigate to the **Jobs** tab and open an existing Job record (or create one: Job Title = "Software Engineer", Company = "Test Corp", Status = "Open").

**Step 6:** On the Job record page, look for the **New Application** button in the **Highlights Panel** or the **Actions** dropdown (the down arrow next to "Edit"). Click **New Application**.

**Step 7:** Screen 1 appears — the Job lookup should already be populated (or select one manually). Click **Next**.

**Step 8:** Screen 2 — enter:
- First Name: `Jane`
- Last Name: `Smith`
- Email: `jane.smith@example.com`
- Phone: `555-1234`
- Click **Next**.

**Step 9:** Screen 3 — verify the confirmation text shows the correct values. Click **Finish**.

**Step 10:** Navigate to the **Candidates** tab — confirm a new Candidate record was created for Jane Smith.

**Step 11:** Navigate to the **Applications** tab — confirm a new Application record was created linking the Job and the new Candidate.

---

## ✅ Verification Checklist
- [ ] Before-Save Record-Triggered Flow created targeting Application__c on record creation
- [ ] Flow uses a Decision element to check if Status and Application Date are blank
- [ ] Assignment element sets Status__c = "Applied" and Application_Date__c = TODAY()
- [ ] Before-Save flow is Active
- [ ] Screen Flow has exactly 3 screens: Select Job, Candidate Info, Confirm
- [ ] Confirm screen uses Display Text with merge fields from earlier screen inputs
- [ ] Screen Flow creates a Candidate__c record using input data
- [ ] Screen Flow creates an Application__c record linking Job and Candidate
- [ ] Screen Flow is Active
- [ ] Quick Action "New Application" created on the Job__c object and linked to the Screen Flow
- [ ] Quick Action appears on the Job record page
- [ ] Before-Save flow test: Application saved without Status still defaults to "Applied"
- [ ] Screen Flow test: Running from a Job record creates both Candidate and Application records

## 💡 Bonus Challenges
- Add an **Email Alert** after the Create Application step in the Screen Flow. Use the **Send Email** action to notify a hiring manager email address with the applicant's name and the job title. You will need to reference `{!jobLookup}` to get the Job Name via a **Get Records** element first.
- Insert a **Decision** element before the Create Candidate step that checks whether a Candidate with the same email already exists (use a **Get Records** element to query `Candidate__c WHERE Email__c = {!email}`). If a match is found, skip creating a new Candidate and use the existing record's ID for the Application instead.
- Add **input validation** to the Email field on Screen 2 using a **Regex** formula validation: `NOT(REGEX({!email}, "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"))` with error message "Please enter a valid email address."
