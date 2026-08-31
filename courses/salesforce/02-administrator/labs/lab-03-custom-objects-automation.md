# Lab 3: Custom Objects & Automation

## 🎯 Lab Objectives
- Create a custom object "Project__c" with multiple custom field types
- Create a page layout with sections and fields arranged logically
- Create a Record Type to differentiate Internal vs. Client projects
- Create a validation rule to enforce required data based on record type
- Build a Record-Triggered Flow that automatically creates a Task when a Project is created with Status = "Active"

## ⏱️ Estimated Time
90–120 minutes

## 🔧 Prerequisites
- Completed Labs 1 and 2
- Understanding of custom objects, fields, page layouts, validation rules, and Flow basics
- System Administrator profile access

## 📋 Step-by-Step Instructions

### Part 1: Create the Project Custom Object

1. Navigate to **Setup** → Quick Find: `Object Manager` → click **Object Manager**.
2. Click **Create** (top right) → **Custom Object**.
3. Fill in the object details:
   - **Label:** Project
   - **Plural Label:** Projects
   - **Object Name:** (auto-populated: Project)
   - **Record Name:** Project Name (Label) and Text (Data Type)
   - **Description:** "Tracks internal and client projects for the organization"
   - **Allow Reports:** Checked
   - **Allow Activities:** Checked
   - **Track Field History:** Checked
   - **Allow Sharing:** Checked
   - Launch New Custom Tab Wizard after saving: Checked
4. Click **Save**.
5. In the Tab Wizard:
   - Choose a **Tab Style** (pick any icon/color)
   - Click **Next** → **Next** → **Save**
6. The Project object and tab are now created.

### Part 2: Create Custom Fields

Still in Object Manager → Project → **Fields & Relationships**, create the following fields:

**Field 1: Status (Picklist)**
1. Click **New** → Select **Picklist** → Next
2. Field Label: `Status`
3. Values (enter each on a separate line):
   ```
   Planning
   Active
   On Hold
   Completed
   Cancelled
   ```
4. Default value: `Planning`
5. Click **Next** → **Next** → **Save & New**

**Field 2: Start Date (Date)**
1. Field Type: **Date** → Next
2. Field Label: `Start Date`
3. Click **Next** → **Next** → **Save & New**

**Field 3: End Date (Date)**
1. Field Type: **Date** → Next
2. Field Label: `End Date`
3. Click **Next** → **Next** → **Save & New**

**Field 4: Budget (Currency)**
1. Field Type: **Currency** → Next
2. Field Label: `Budget`
3. Length: 16, Decimal Places: 2
4. Click **Next** → **Next** → **Save & New**

**Field 5: Project Manager (Lookup to User)**
1. Field Type: **Lookup Relationship** → Next
2. Related To: **User**
3. Field Label: `Project Manager`
4. Click **Next** → **Next** → **Next** → **Save & New**

**Field 6: Description (Long Text Area)**
1. Field Type: **Long Text Area** → Next
2. Field Label: `Project Description`
3. Length: 32,768, Visible Lines: 5
4. Click **Next** → **Next** → **Save**

> **Checkpoint:** You should now have 6 custom fields on the Project object plus the standard Name field. Verify in Fields & Relationships.

### Part 3: Create a Page Layout

1. In Object Manager → Project → click **Page Layouts**.
2. Click **New**.
3. Base it on: (none — start from scratch) OR clone the existing Project Layout.
4. Name: `Project Layout`
5. Click **Save**.
6. In the Page Layout Editor:
   - **Section 1: Project Details** (already exists as default — rename it)
     - Drag fields into 2-column layout: Left column: Status, Start Date, Budget | Right column: Project Manager, End Date
   - **Add New Section:** Click the Section element and drag it below the first section
     - Section Name: `Additional Information`
     - Layout: 1 column
     - Drag **Project Description** into this section
   - **Related Lists section:** Ensure Activities, Open Activities, and Activity History are present
7. Click **Save**.

### Part 4: Create Record Types

Record Types allow different picklist values and page layouts for different types of records.

1. In Object Manager → Project → click **Record Types**.
2. Click **New**.
3. Configure Record Type 1:
   - **Record Type Label:** Internal Project
   - **Record Type Name:** Internal_Project
   - **Description:** "For internal improvement and IT projects"
   - **Active:** Checked
   - **Make Available to:** System Administrator (all profiles)
4. Click **Next** → Keep the **Project Layout** for all profiles → click **Save**.
5. Click **New** again to create Record Type 2:
   - **Record Type Label:** Client Project
   - **Record Type Name:** Client_Project
   - **Description:** "For client-facing delivery projects"
   - **Active:** Checked
6. Click **Next** → Keep the **Project Layout** → click **Save**.

> **Checkpoint:** You should now have two record types. When creating a new Project, users will be prompted to select Internal Project or Client Project.

### Part 5: Create a Validation Rule

Create a validation rule that requires Start Date when Status is "Active."

1. In Object Manager → Project → click **Validation Rules**.
2. Click **New**.
3. Configure:
   - **Rule Name:** Require_Start_Date_When_Active
   - **Active:** Checked
   - **Description:** "Start Date is required when Status is Active"
4. In the Error Condition Formula box, enter:
   ```
   AND(
     ISPICKVAL(Status__c, "Active"),
     ISBLANK(Start_Date__c)
   )
   ```
5. **Error Message:** `Start Date is required when the project status is Active. Please enter a Start Date before setting the project to Active.`
6. **Error Location:** Field — **Start Date**
7. Click **Save**.

**Test the Validation Rule:**
8. Navigate to the **Projects** tab (or App Launcher → Projects).
9. Click **New**.
10. Select the **Client Project** record type.
11. Set Status to **Active**, leave Start Date blank.
12. Click **Save**.
13. Verify that an error appears next to the Start Date field: "Start Date is required when the project status is Active."
14. Add a Start Date and click **Save** again — the record should save successfully.

> **Checkpoint:** The validation rule correctly fires when Status = Active and Start Date is blank.

### Part 6: Build a Record-Triggered Flow

Build a Flow that automatically creates a Task when a new Project is created with Status = "Active."

1. Navigate to **Setup** → Quick Find: `Flows` → click **Flows**.
2. Click **New Flow**.
3. Select **Record-Triggered Flow** → click **Create**.
4. Configure the Start element:
   - **Object:** Project (Project__c)
   - **Trigger:** A Record Is Created
   - **Entry Conditions:** Status__c Equals "Active"
   - **Optimize the Flow for:** Actions and Related Records (After-Save)
5. Click **Done**.

**Add a Create Records element:**

6. Click the **+** button below the Start element to add an element.
7. Select **Create Records**.
8. Configure:
   - **Label:** Create Follow-Up Task
   - **API Name:** Create_Follow_Up_Task
   - **How to Set the Record Fields:** Use separate resources and literal values
   - **Object:** Task
   - Set the following fields:
     - **Subject:** (Literal) `Review new Active project: ` — then add merge field {!$Record.Name} 
       - Tip: Use a formula: `"Review new Active project: " & {!$Record.Name}`
       - Or enter Subject as: `Review Project`
     - **WhatId:** {!$Record.Id} (links the task to the Project record)
     - **OwnerId:** {!$Record.OwnerId} (assign to Project owner)
     - **ActivityDate:** {!$Flow.CurrentDate} + 3 (due date = 3 days from today — use a formula resource)
     - **Status:** Not Started
     - **Priority:** Normal
     - **Description:** `A new Active project has been created. Please review project details and confirm next steps.`
9. Click **Done**.

**Create a Formula Resource for Due Date (optional but recommended):**
10. Click **New Resource** → **Formula**
    - API Name: `DueDateFormula`
    - Data Type: Date
    - Formula: `TODAY() + 3`
11. Use `{!DueDateFormula}` as the ActivityDate value in the Create Records element.

**Save and Activate:**
12. Click **Save** (toolbar) → Flow Label: `Create Task on Active Project` → API Name: auto-populated → click **Save**.
13. Click **Activate** to make the flow live.

> **IMPORTANT:** Flows must be Activated to run. A saved but inactive flow does nothing.

**Test the Flow:**
14. Navigate to the **Projects** tab → click **New**.
15. Select **Internal Project** record type.
16. Fill in: Project Name = "Website Redesign", Status = **Active**, Start Date = today's date.
17. Click **Save**.
18. On the Project record page, scroll to **Open Activities** related list.
19. Verify a Task "Review Project" (or your subject) appears, assigned to you, due 3 days from today.

> **Checkpoint:** The Flow successfully created a Task automatically when the Project was created with Status = Active.

---

## ✅ Verification Checklist

- [ ] Project__c custom object created with tab
- [ ] Custom fields created: Status (picklist), Start Date (date), End Date (date), Budget (currency), Project Manager (lookup to User), Project Description (long text area)
- [ ] Page layout created with logical field groupings (Project Details section + Additional Information section)
- [ ] Two record types created: Internal Project and Client Project
- [ ] Validation rule created: error fires when Status = Active and Start Date is blank
- [ ] Tested validation rule — error displays correctly, then clears when Start Date is provided
- [ ] Record-Triggered Flow created for Project object, trigger: Created, entry criteria: Status = Active
- [ ] Flow creates a Task linked to the Project record (WhatId) assigned to the Project owner
- [ ] Flow is Activated
- [ ] Tested flow: creating a Project with Status = Active generates a Task in the Open Activities related list
- [ ] Creating a Project with Status = Planning does NOT generate a Task (entry criteria prevents it)

## 💡 Bonus Challenges

1. **Flow Enhancement — Update Field:** Add an Assignment element to the flow that sets a custom checkbox field "Task_Created__c" to True on the Project record when the flow runs. This gives admins visibility into which projects had the flow trigger.

2. **Second Validation Rule:** Add a validation rule that ensures End Date is always after Start Date:
   ```
   AND(
     NOT(ISBLANK(End_Date__c)),
     NOT(ISBLANK(Start_Date__c)),
     End_Date__c < Start_Date__c
   )
   ```
   Error: "End Date must be on or after Start Date."

3. **Decision Element:** Modify the Flow to add a Decision element before Create Records. If Status = "Active" AND Budget > 50,000, create a High Priority task. Otherwise, create a Normal Priority task. Use the "outcomes" of the Decision to route to two different Create Records elements.

4. **Custom Report Type:** Create a custom report type with Project as the primary object and Tasks as the related object ("may or may not have"). Run a report that shows all Projects with their related tasks, enabling you to see which projects have tasks and which don't.

5. **Related List:** Navigate to the Project page layout editor and add a "Related List — Activities" that shows both open and closed activities. Verify that tasks created by the flow appear in the related list.
