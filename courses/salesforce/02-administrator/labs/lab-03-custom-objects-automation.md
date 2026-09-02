# Lab 03 — Custom Objects & Automation

## What You Need to Be Able to Do

This lab builds a custom object with relationships, validation, and a Record-Triggered Flow. This tests Object Manager + Automation skills which together are 36% of the exam.

### Create a Custom Object
- [ ] Navigate to Setup → Object Manager → Create → Custom Object
- [ ] Configure:
  - Label: `Project`
  - Plural Label: `Projects`
  - API Name: `Project__c` (auto-generated)
  - Record Name: `Project Name` (Text, auto-generated)
  - Allow Reports: checked
  - Allow Activities: checked
  - Track Field History: checked
  - Allow Search: checked
- [ ] Save the object
- [ ] Verify the API name ends in `__c`

### Add Custom Fields to Project__c
Create the following fields on Project__c:

- [ ] **Status** (Picklist)
  - Values: Not Started, In Progress, On Hold, Completed, Cancelled
  - Default: Not Started
  
- [ ] **Budget** (Currency)
  - Length: 16 decimal places: 2
  
- [ ] **Start Date** (Date)
  - Required: Yes

- [ ] **End Date** (Date)

- [ ] **Account** (Lookup to Account)
  - Related list label: "Projects"

- [ ] **Total Tasks** (Number)
  - Read-only, will be populated by Flow later

- [ ] **Project Description** (Long Text Area)
  - Length: 32,768

### Set Up Page Layout
- [ ] Navigate to Object Manager → Project__c → Page Layouts
- [ ] Open the default layout
- [ ] Arrange fields in sections:
  - Section 1 "Project Info": Project Name, Status, Account
  - Section 2 "Dates & Budget": Start Date, End Date, Budget
  - Section 3 "Details": Project Description
- [ ] Add the "Tasks" related list (should be available since you enabled Activities)
- [ ] Save the layout

### Create a Record Type
- [ ] Navigate to Object Manager → Project__c → Record Types
- [ ] Create Record Type: "Internal Project"
  - Available for: System Administrator profile
  - Page Layout: use the layout you just configured
- [ ] Create Record Type: "Client Project"
  - Available for: Sales Rep Profile and System Administrator
  - Page Layout: use the same layout

### Create a Validation Rule
- [ ] Navigate to Object Manager → Project__c → Validation Rules → New
- [ ] Name: `End_Date_After_Start_Date`
- [ ] Formula:
  ```
  AND(
    NOT(ISBLANK(End_Date__c)),
    NOT(ISBLANK(Start_Date__c)),
    End_Date__c < Start_Date__c
  )
  ```
- [ ] Error message: "End Date must be after Start Date"
- [ ] Error location: End Date field
- [ ] Save and test: create a Project with End Date before Start Date — verify it blocks

### Create a Second Validation Rule
- [ ] Name: `Budget_Required_For_Client_Project`
- [ ] Formula:
  ```
  AND(
    ISBLANK(Budget__c),
    ISPICKVAL(RecordType.DeveloperName, "Client_Project")
  )
  ```
  Note: Use `RecordType.DeveloperName` for record type checks in formulas
- [ ] Error message: "Budget is required for Client Projects"
- [ ] Test: create a Client Project without budget — verify it blocks

### Create a Formula Field
- [ ] Navigate to Fields & Relationships → New → Formula
- [ ] Label: `Days Remaining`
- [ ] Formula Return Type: Number
- [ ] Formula:
  ```
  IF(
    ISBLANK(End_Date__c),
    NULL,
    End_Date__c - TODAY()
  )
  ```
- [ ] Save and verify it calculates correctly on records

### Create a Record-Triggered Flow
- [ ] Navigate to Setup → Flows → New Flow → Record-Triggered Flow
- [ ] Object: Project__c
- [ ] Trigger: A record is created or updated
- [ ] Entry Conditions: Status EQUALS "Completed"
- [ ] Optimize for: After Save (because we'll update a field on the Account)
- [ ] Add a Get Records element to find the related Account
- [ ] Add an Update Records element to stamp today's date on a field
- [ ] Alternatively (simpler): add an email alert action sending a "Project Complete" notification
- [ ] Activate the flow
- [ ] Test: change a Project's status to "Completed" and verify the flow action fired

### Configure a List View
- [ ] Navigate to Projects tab (add to App nav if needed)
- [ ] Create a new List View: "My Active Projects"
- [ ] Filter: Status NOT EQUAL TO "Completed, Cancelled"
- [ ] Filter: Status NOT EQUAL TO "Cancelled"
- [ ] Share with: All Users
- [ ] Select columns: Project Name, Status, Account, Start Date, End Date
- [ ] Try Kanban view: group by Status

## Key Validation Points

After completing this lab, verify you can answer:
- What is the API name format for a custom object? For a custom field?
- What does TRUE return in a validation rule formula?
- What is the difference between Before Save and After Save in a Record-Triggered Flow?
- What can you NOT do in a Before Save flow?
- Can you use a Roll-Up Summary field between Project__c and Account? Why or why not?
  (Answer: No — Account-Project is a Lookup relationship, not Master-Detail)
