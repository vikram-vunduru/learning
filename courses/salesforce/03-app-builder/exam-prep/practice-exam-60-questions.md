# CRT-403 Practice Exam: 60 Questions

**Exam Simulation — Platform App Builder (CRT-403)**
Time allowed: 105 minutes | Passing score: 65% (39/60) | Format: Multiple choice

---

## Section 1: Salesforce Fundamentals (23%) — Questions 1–14

---

**Q1.** A sales manager notices that Account records owned by reps in the Eastern region are visible to reps in the Western region. The org-wide default for Accounts is set to Private. Which feature is most likely causing this visibility?

- A) Field-level security
- B) A sharing rule that grants access based on criteria or role hierarchy
- C) A permission set with "View All" on Accounts
- D) The Account layout assignment for the Western region profile

**Answer:** B) A sharing rule that grants access based on criteria or role hierarchy. With OWD set to Private, only record owners and those above them in the role hierarchy should have access. A sharing rule (owner-based or criteria-based) is the most common mechanism that opens records beyond ownership. A) Field-level security controls field visibility, not record access. C) "View All" on a permission set would grant access to ALL accounts, not just a regional subset. D) Page layout assignment has no effect on record visibility.

---

**Q2.** A company wants to create a field on Opportunity that automatically displays the Account's Industry field value without any user input. Which is the best tool to accomplish this?

- A) Workflow Rule with a Field Update
- B) Cross-object formula field
- C) Roll-up summary field
- D) Record-Triggered Flow with a before-save update

**Answer:** B) Cross-object formula field. A formula field on Opportunity can reference the parent Account's Industry via a cross-object formula (Account.Industry) and will always display the current value without any trigger. A) Workflow Rules are legacy and cannot reference parent object fields for a simple display. C) Roll-up summary fields aggregate child records numerically/logically; they cannot display a text value from a parent. D) A flow could copy the value, but that would snapshot it at a point in time, not reflect live updates — and it introduces unnecessary complexity.

---

**Q3.** Which statement correctly describes the difference between Profiles and Permission Sets?

- A) Profiles can grant access to multiple apps; permission sets can only grant access to one app at a time
- B) Every user must be assigned exactly one profile; permission sets can be assigned to none, one, or many users
- C) Permission sets replace profiles in all modern Salesforce orgs
- D) Profiles control record-level access; permission sets control field-level access

**Answer:** B) Every user must be assigned exactly one profile; permission sets can be assigned to none, one, one, or many users. Profiles are mandatory — each user has exactly one. Permission sets are additive and optional, allowing you to grant additional permissions beyond the profile baseline. A) Both profiles and permission sets can control app visibility. C) Permission sets supplement profiles but have not replaced them (Permission Set Groups are the modern grouping mechanism but profiles still exist). D) Both profiles and permission sets can control record-level access (via "View All", "Modify All"), field-level security, and object permissions — neither is limited to one type.

---

**Q4.** An administrator wants to prevent sales reps from viewing the Salary field on the Contact object. Which tool should be used?

- A) Org-Wide Defaults
- B) Sharing Rules
- C) Field-Level Security
- D) Validation Rules

**Answer:** C) Field-Level Security. Field-Level Security (FLS), configured on profiles or permission sets, controls whether users can see, edit, or are completely denied access to a specific field. A) OWD controls record-level visibility, not individual field access. B) Sharing rules expand who can see records, not which fields within a record. D) Validation rules enforce data entry rules; they cannot hide fields.

---

**Q5.** A company uses a Private OWD for Opportunities. A sales rep owns an opportunity but needs their manager to also be able to edit it without changing ownership. The manager is directly above the rep in the role hierarchy. Which statement is true?

- A) The manager cannot access the record because OWD is Private
- B) The manager can view and edit the record because role hierarchy grants access up the chain
- C) A sharing rule must be created to give the manager access
- D) The manager needs a permission set with "Modify All" on Opportunities

**Answer:** B) The manager can view and edit the record because role hierarchy grants access up the chain. When OWD is set to Private, the role hierarchy still grants managers visibility and edit access to records owned by users below them. A) This is incorrect — Private OWD means peers cannot see each other's records, but the hierarchy still applies. C) A sharing rule is not needed because hierarchy-based access is automatic. D) "Modify All" would give the manager access to every opportunity in the org, which is over-permissioning.

---

**Q6.** A Data Loader import file contains 75,000 Account records to be inserted. Which statement about using the Data Import Wizard for this job is true?

- A) The Data Import Wizard supports up to 100,000 records, so it can handle this job
- B) The Data Import Wizard is limited to 50,000 records per import, so Data Loader should be used instead
- C) The Data Import Wizard cannot import Account records at all
- D) Both tools have the same 50,000-record limit

**Answer:** B) The Data Import Wizard is limited to 50,000 records per import, so Data Loader should be used instead. The Data Import Wizard has a hard cap of 50,000 records per run. Data Loader has no practical upper limit (it processes records in configurable batches of up to 200 per API call). A) Incorrect — the wizard caps at 50,000. C) The Data Import Wizard does support Accounts/Contacts and other standard objects. D) Data Loader does not share the 50,000 limit.

---

**Q7.** Which of the following best describes when to use the Data Import Wizard over Data Loader?

- A) When importing more than 50,000 records
- B) When importing records that require an external system integration via the API
- C) When performing a simple import of Leads, Contacts, or Accounts with fewer than 50,000 records and no command-line automation is needed
- D) When the import must run on a scheduled basis without user interaction

**Answer:** C) When performing a simple import of Leads, Contacts, or Accounts with fewer than 50,000 records and no command-line automation is needed. The Data Import Wizard is a guided, browser-based tool ideal for simpler use cases under its 50,000-record limit. A) Over 50,000 requires Data Loader. B) API integrations use Data Loader or the API directly. D) Data Loader's command-line mode supports scheduling; the wizard requires manual steps.

---

**Q8.** A system administrator creates a report to show all Open Opportunities grouped by Stage. Which report type would be most appropriate?

- A) Tabular report
- B) Summary report
- C) Matrix report
- D) Joined report

**Answer:** B) Summary report. A Summary report allows grouping of rows, making it ideal for grouping Opportunities by Stage and showing subtotals per group. A) A Tabular report is a flat list with no grouping capabilities. C) A Matrix report groups by both rows and columns, which is more complex than needed for a single grouping. D) A Joined report combines multiple report blocks — not needed for a single-object grouped view.

---

**Q9.** Which statement about Dashboards in Salesforce is accurate?

- A) Dashboard data always reflects real-time data when the dashboard is opened
- B) Dashboards are powered by reports; if a report is deleted, the dashboard component that used it will still display cached data
- C) A dynamic dashboard shows data as if the viewer is running the report as themselves
- D) Dashboards can only be created in the default dashboard folder

**Answer:** C) A dynamic dashboard shows data as if the viewer is running the report as themselves. Dynamic dashboards use the "run as logged-in user" setting so each viewer sees data filtered to their own access level. A) Dashboard data is cached — it reflects the last refresh time, not real-time. B) If the underlying report is deleted, the dashboard component will display an error, not cached data. D) Dashboards can be stored in any dashboard folder the user has access to create in.

---

**Q10.** Which permission is required for a user to create and save public list views?

- A) "Manage Public List Views" in their profile or permission set
- B) "View All Data" permission
- C) System Administrator profile only
- D) "Customize Application" permission

**Answer:** A) "Manage Public List Views" in their profile or permission set. The specific permission "Manage Public List Views" controls whether a user can create list views visible to other users. B) "View All Data" gives access to all records but is unrelated to list view management. C) Non-administrators can have this permission granted. D) "Customize Application" relates to metadata customization, not list view sharing.

---

**Q11.** An Opportunity has a Lookup relationship to a Campaign. The Campaign is deleted. What happens to the Opportunity?

- A) The Opportunity is also deleted (cascade delete)
- B) The Opportunity remains, and the Campaign lookup field becomes blank
- C) The Opportunity is locked and cannot be edited until a new Campaign is linked
- D) The delete is blocked because child records exist

**Answer:** B) The Opportunity remains, and the Campaign lookup field becomes blank. In a Lookup relationship, deleting the parent record does not delete or block child records. The lookup field on the child simply clears (or retains the ID in a "soft delete" state depending on config). A) Cascade delete is behavior of Master-Detail relationships, not Lookup. C) No locking occurs. D) Lookup relationships do not prevent parent deletion by default (unless "Don't allow deletion of the lookup record that's part of a lookup relationship" is configured).

---

**Q12.** What is the maximum number of records that can be displayed in a standard Salesforce list view without using pagination?

- A) 50
- B) 100
- C) 200
- D) 2,000

**Answer:** C) 200. A standard list view displays up to 200 records per page. A) 50 is not the limit. B) 100 is not the standard list view limit. D) 2,000 is relevant to certain API contexts but not list view display.

---

**Q13.** Which sharing model feature allows a record owner to manually share a record with a specific user or group?

- A) Criteria-based sharing rule
- B) Owner-based sharing rule
- C) Manual sharing
- D) Public group

**Answer:** C) Manual sharing. Manual sharing allows individual record owners (or admins) to share a specific record with a specific user, group, or role on a one-off basis. A) Criteria-based sharing rules automatically share records meeting certain criteria with a group — not a one-off action. B) Owner-based sharing rules share records owned by a particular group with another — also not one-off. D) A public group is a grouping mechanism used by sharing rules and manual sharing, not a sharing mechanism itself.

---

**Q14.** An administrator notices that the "Transfer Record" button appears on a Case but they want to understand which component controls which buttons appear on a record page. Which is correct?

- A) Button visibility is controlled by the Compact Layout
- B) Standard buttons are controlled by the Page Layout; custom buttons can be added there or via Quick Actions
- C) All buttons on a record page are controlled by the Lightning App Builder
- D) Buttons are controlled exclusively by the user's profile

**Answer:** B) Standard buttons are controlled by the Page Layout; custom buttons can be added there or via Quick Actions. Page Layouts have a "Buttons" section where standard and custom buttons can be shown/hidden. Quick Actions appear in the action bar. A) Compact layouts control the fields shown in the highlights panel and mobile cards. C) The Lightning App Builder controls page structure and component placement, not individual standard buttons. D) Profiles control access but not button placement on layouts.

---

## Section 2: Data Modeling & Management (22%) — Questions 15–27

---

**Q15.** A company wants to create a "Project" custom object where each Project must always belong to a Department, and deleting the Department should automatically delete all related Projects. Which relationship type should be used?

- A) Lookup relationship
- B) Master-Detail relationship with Department as the master
- C) Hierarchical relationship
- D) Many-to-Many relationship

**Answer:** B) Master-Detail relationship with Department as the master. Master-Detail enforces the ownership/deletion cascade — when the parent (Department) is deleted, all child (Project) records are also deleted. The child record also inherits the sharing model from the parent. A) A Lookup relationship does not enforce parent requirement and does not cascade deletes. C) Hierarchical relationships are only available on the User object. D) Many-to-Many requires a junction object and does not fit this simple parent-child requirement.

---

**Q16.** Which field type should be used when you need to store a unique identifier that will be used to match records during data imports from an external system?

- A) Auto-Number field
- B) Text field with "Unique" checked
- C) External ID field
- D) Formula field

**Answer:** C) External ID field. External ID fields are indexed and surfaced in the Data Loader's "upsert" operation, allowing records to be matched and updated based on the external system's key. A) Auto-Number fields generate sequential IDs internally — not mappable to external system keys. B) A unique text field prevents duplicates but is not recognized by data import tools for upsert matching. D) Formula fields are read-only and cannot store imported values.

---

**Q17.** An administrator wants to create a Roll-Up Summary field on the Account object that counts all related Contacts. What is a prerequisite for this to work?

- A) The Contact-Account relationship must be a Lookup relationship
- B) The Contact-Account relationship must be a Master-Detail relationship
- C) A custom junction object must be created
- D) The field history tracking must be enabled on the Account

**Answer:** B) The Contact-Account relationship must be a Master-Detail relationship. Roll-Up Summary fields can only be created on the master side of a Master-Detail relationship, and they aggregate values from the detail records. The standard Contact-Account relationship is a Lookup (not Master-Detail), which means you cannot create a native roll-up summary for Contacts — you'd need a flow instead. A) This is incorrect — Lookup does not support roll-up summary fields. C) Not needed for a direct parent-child count. D) Field history tracking is unrelated to roll-up summary functionality.

---

**Q18.** How many Roll-Up Summary fields can be created on a single object?

- A) 10
- B) 25
- C) 40
- D) There is no limit

**Answer:** B) 25. Salesforce allows a maximum of 25 Roll-Up Summary fields per object. A) 10 is too low. C) 40 exceeds the actual limit. D) There is a hard limit of 25.

---

**Q19.** A developer is building a formula field and needs to check whether a Text field called Notes__c is empty. Which function should be used?

- A) ISNULL(Notes__c)
- B) ISBLANK(Notes__c)
- C) Notes__c = ""
- D) ISNULL(Notes__c) || ISBLANK(Notes__c)

**Answer:** B) ISBLANK(Notes__c). For Text fields, ISNULL() always returns false because text fields are never truly null — an empty text field contains an empty string (""), not a null. ISBLANK() correctly identifies both null and empty-string conditions. A) ISNULL() on a text field always returns false — a classic exam trap. C) Notes__c = "" is not valid formula syntax in Salesforce. D) Since ISNULL on text always returns false, the OR adds no value; ISBLANK alone is the correct answer.

---

**Q20.** Which of the following field types can store more than 255 characters of plain text?

- A) Text field (255 max)
- B) Text Area field
- C) Long Text Area field
- D) Rich Text Area field

**Answer:** C) Long Text Area field. Long Text Area can store up to 131,072 characters. B) Standard Text Area is limited to 255 characters. A) Text fields are also limited to 255 characters. D) Rich Text Area can store up to 131,072 characters including HTML formatting — both C and D exceed 255, but among typical exam answer sets, Long Text Area is the standard answer for plain-text large storage. Note: both C and D are valid; if D is the only option exceeding 255, D is also correct.

---

**Q21.** What is the maximum number of custom fields that can be created on a single standard or custom object?

- A) 500
- B) 800
- C) 1,000
- D) There is no limit

**Answer:** B) 800. Salesforce allows up to 800 custom fields per object (the exact limit can vary slightly by field type due to indexing, but 800 is the commonly tested figure for most field types). A) 500 is too low. C) 1,000 exceeds the limit. D) There is a documented limit.

---

**Q22.** An administrator creates a custom object called "Review__c" and wants to track all changes to the Rating__c field, recording the old value, new value, date, and user. What feature should be enabled?

- A) Roll-Up Summary field
- B) Field Audit Trail
- C) Field History Tracking
- D) Audit Trail in Setup

**Answer:** C) Field History Tracking. Field History Tracking is enabled on an object and configured for specific fields (up to 20 per object for most orgs). It stores old value, new value, changed by, and change date in the History related list. A) Roll-Up Summary aggregates child data — irrelevant here. B) Field Audit Trail is a paid add-on that extends history retention beyond the standard 18 months and supports up to 60 fields — correct functionally but the standard feature for most exam questions is Field History Tracking. D) Setup Audit Trail logs setup/configuration changes, not record field changes.

---

**Q23.** Which tool provides a visual, drag-and-drop interface for creating objects, fields, and relationships without navigating through individual setup menus?

- A) Object Manager
- B) Schema Builder
- C) Data Import Wizard
- D) Salesforce DX

**Answer:** B) Schema Builder. Schema Builder provides a canvas where you can visually see all objects and their relationships and create new objects, fields, and relationships by dragging elements onto the canvas. A) Object Manager is the newer UI for managing a single object's configuration (fields, layouts, etc.) — it is not a visual canvas. C) Data Import Wizard handles data loading, not schema design. D) Salesforce DX is a developer tool/CLI for source-based development.

---

**Q24.** A company has a custom object "Event__c" that should be related to both Contact and Lead objects. The admin needs a single object that can hold a relationship to either Contact or Lead, but not both at once on the same record. Which field type enables this?

- A) Two separate Lookup fields (one to Contact, one to Lead)
- B) Polymorphic lookup (Lookup relationship with multiple object types)
- C) A Master-Detail field to a junction object
- D) An External ID field

**Answer:** B) Polymorphic lookup (Lookup relationship with multiple object types). In Salesforce, certain standard fields (like WhoId on Activity) are polymorphic — they can relate to either Contact or Lead. However, on custom objects, the typical practical answer is to create a relationship with the "Who" field type or, for custom builds, two separate lookups. For the exam, the scenario described (relate to Contact OR Lead) is commonly answered as B — Salesforce supports polymorphic lookups on custom objects in newer API versions, but the traditional exam answer may be A (two separate lookup fields). A) Two separate Lookup fields is the traditional approach, but a record could have both populated. B) Polymorphic lookup is the architecture that allows one field to point to multiple object types. On the actual exam, if "two separate lookups" is the option, that is often the practical answer.

---

**Q25.** How many Master-Detail relationship fields can a custom object have at maximum?

- A) 1
- B) 2
- C) 5
- D) There is no limit

**Answer:** B) 2. A custom object can have a maximum of 2 Master-Detail relationship fields. This is a key exam fact. A) 1 is too few — Salesforce does allow a second master-detail (this is how many-to-many junction objects work). C) 5 exceeds the limit. D) There is a hard limit of 2.

---

**Q26.** An administrator wants to ensure that when a record's Phone field is saved, it must follow the format (XXX) XXX-XXXX. No other format should be accepted. Which tool best enforces this?

- A) Formula field with a REGEX function
- B) Validation rule using the REGEX function
- C) Flow with a Decision element
- D) Data Import Wizard field mapping

**Answer:** B) Validation rule using the REGEX function. A validation rule with `NOT(REGEX(Phone, "\\(\\d{3}\\) \\d{3}-\\d{4}"))` will show an error and prevent saving when the format doesn't match. A) Formula fields display values but cannot prevent saving. C) A flow could check the format, but a validation rule is simpler and fires at the platform level regardless of how the save is triggered. D) The Data Import Wizard handles imports, not on-save enforcement in the UI.

---

**Q27.** Which statement about the Hierarchical relationship type is true?

- A) It can be used on any standard or custom object
- B) It is only available on the User object and is used for user reporting chains
- C) It supports Roll-Up Summary fields like Master-Detail
- D) It allows up to 10 levels of hierarchy

**Answer:** B) It is only available on the User object and is used for user reporting chains. The Hierarchical relationship is a special lookup-style relationship exclusively available on the User object, used to model management/reporting chains (e.g., the "Manager" field). A) It is not available on custom objects. C) It does not support roll-up summaries. D) There is no documented 10-level limit specific to hierarchical relationships in this context.

---

## Section 3: Business Logic & Process Automation (28%) — Questions 28–44

---

**Q28.** A validation rule contains the formula: `ISBLANK(Reason__c) && ISPICKVAL(Stage__c, "Closed Lost")`. When does this validation rule trigger an error?

- A) When Stage is "Closed Lost" OR Reason is blank
- B) When Stage is "Closed Lost" AND Reason is blank
- C) When Stage is NOT "Closed Lost" and Reason is blank
- D) This formula is invalid and will not save

**Answer:** B) When Stage is "Closed Lost" AND Reason is blank. A validation rule fires (shows the error) when the formula evaluates to TRUE. This formula uses && (AND), so both conditions must be true: Stage equals "Closed Lost" AND Reason is blank. A) OR behavior would require ||, not &&. C) This would require a NOT() wrapper around ISPICKVAL. D) The formula is valid syntax.

---

**Q29.** An administrator needs to create a validation rule that prevents saving an Opportunity if the Close Date is in the past. Which formula correctly implements this?

- A) CloseDate < TODAY()
- B) CloseDate > TODAY()
- C) NOT(CloseDate >= TODAY())
- D) Both A and C are equivalent and correct

**Answer:** D) Both A and C are equivalent and correct. Both `CloseDate < TODAY()` and `NOT(CloseDate >= TODAY())` evaluate to TRUE when the Close Date is before today, triggering the error. B) This would error when Close Date is in the future (the opposite of what's needed). The key is that validation rules trigger the error when the formula is TRUE.

---

**Q30.** Which of the following correctly distinguishes a Before-Save Flow from an After-Save Flow?

- A) Before-Save Flows can send emails; After-Save Flows cannot
- B) Before-Save Flows can update the triggering record's fields without a DML operation and cannot access record IDs for new records; After-Save Flows can query related records and perform DML on other objects
- C) After-Save Flows run before the record is written to the database
- D) Before-Save Flows can create related records on other objects

**Answer:** B) Before-Save Flows can update the triggering record's fields without a DML operation and cannot access record IDs for new records; After-Save Flows can query related records and perform DML on other objects. Before-save flows are faster (no DML for self-updates), run before the record is committed, and are ideal for deriving field values. After-save flows run after the record is committed, can create/update other records, and can send emails. A) Email actions are available in After-Save flows. C) This describes Before-Save (they run before write). D) Before-Save flows cannot perform DML on other objects.

---

**Q31.** A company uses Workflow Rules to send email alerts when a Case is created. The Salesforce admin has been told Workflow Rules are being deprecated. Which is the recommended replacement?

- A) Process Builder
- B) Record-Triggered Flow (After-Save)
- C) Apex Trigger
- D) Assignment Rules

**Answer:** B) Record-Triggered Flow (After-Save). Salesforce has deprecated both Workflow Rules and Process Builder in favor of Flow. An After-Save Record-Triggered Flow is the direct replacement for Workflow Rule actions like email alerts, field updates, and outbound messages. A) Process Builder is also deprecated. C) Apex Triggers are code-based and should only be used when Flow cannot meet the requirement. D) Assignment Rules handle automatic record assignment, not email alerts.

---

**Q32.** An administrator needs to build an automation that collects input from a user (such as a reason for status change), updates multiple related records, and sends a confirmation email — all initiated from a button on the record page. Which automation tool should be used?

- A) Record-Triggered Flow (Before-Save)
- B) Approval Process
- C) Screen Flow launched via a Quick Action
- D) Scheduled Flow

**Answer:** C) Screen Flow launched via a Quick Action. A Screen Flow is the only flow type that presents a UI to the user for input collection. It can update records and send emails, and is launched via a custom button or Quick Action on the record page. A) Before-Save flows have no user interface. B) Approval processes handle multi-step approvals, not general user input. D) Scheduled flows run at specified times without user interaction.

---

**Q33.** In a Record-Triggered Flow set to run "when a record is created or updated," how can you ensure the automation only runs when a specific field (Status__c) changes — not on every save?

- A) Add a condition in the Entry Conditions that checks ISCHANGED(Status__c)
- B) Use a Decision element at the start of the flow to check if Status__c is different from its prior value
- C) Set the flow trigger to "On Field Change" and select Status__c
- D) Both A and C achieve this, but ISCHANGED is the formula-based method in entry conditions

**Answer:** D) Both A and C achieve this, but ISCHANGED is the formula-based method in entry conditions. Modern Record-Triggered Flows support both Entry Conditions (where ISCHANGED is a valid condition formula) and a dedicated "Field Changes" trigger option. Using ISCHANGED() in Entry Conditions or setting the flow to trigger only when specific fields change are both valid methods. B) While a Decision element can check values, it doesn't prevent the flow from being entered on every save — it just changes the path taken. The correct approach is at the Entry Conditions level.

---

**Q34.** An Approval Process is configured with two approvers assigned "sequentially." The first approver approves the record. What happens next?

- A) The record is approved and moves to the next stage
- B) The record is sent to the second approver for review
- C) The record is automatically approved if no response is received within 24 hours
- D) Both approvers must have approved before approval is complete

**Answer:** B) The record is sent to the second approver for review. In a sequential approval process, approvers are presented the record one at a time in order. Only after all sequential approvers approve does the record reach final approval. A) Approval is not complete until all sequential approvers have approved. C) No auto-approval occurs unless an escalation action is configured. D) This describes the correct behavior but option B is the immediate "what happens next" answer.

---

**Q35.** Which statement about Approval Processes is correct?

- A) Only the System Administrator can be assigned as an approver
- B) A record can only be submitted for approval once in its lifetime
- C) Approver types include: specific users, the record owner's manager (via hierarchy), a related user field, or a queue
- D) Approval processes can only have one approval step

**Answer:** C) Approver types include: specific users, the record owner's manager (via hierarchy), a related user field, or a queue. Salesforce supports multiple approver assignment types for flexibility. A) Any active user can be an approver. B) Records can be recalled and resubmitted for approval. D) Approval processes can have multiple sequential steps.

---

**Q36.** A Scheduled Flow needs to update all Opportunity records where the Close Date is 30 days in the past and Stage is "Open." What elements are required in this flow?

- A) A Screen element to select records, then an Update Records element
- B) A Get Records element to retrieve the matching opportunities, a Loop element to iterate through them, and an Update Records element inside the loop
- C) A Schedule trigger, a Get Records element to retrieve matching opportunities, and an Update Records element that can update a collection of records at once
- D) A Record-Triggered Flow set to fire 30 days after close date

**Answer:** C) A Schedule trigger, a Get Records element to retrieve matching opportunities, and an Update Records element that can update a collection of records at once. Scheduled flows use a Schedule trigger, Get Records to retrieve the relevant data set, and can pass a record collection directly to an Update Records element (bulk-safe approach). B) A loop with individual updates is inefficient and hits governor limits faster; collection-based Update Records is preferred. A) Screen elements are not available in scheduled flows. D) Record-Triggered Flows fire based on record events, not scheduled time.

---

**Q37.** A company wants to create a Roll-Up Summary to count the number of open Cases on an Account. The Account-Case relationship is a standard Lookup relationship. What should the administrator do?

- A) Create a Roll-Up Summary field on the Account object
- B) Change the Account-Case relationship to Master-Detail first
- C) Use an After-Save Record-Triggered Flow to maintain a counter field on the Account
- D) Use a formula field on Account with a COUNTIF function

**Answer:** C) Use an After-Save Record-Triggered Flow to maintain a counter field on the Account. Because the Account-Case relationship is a Lookup (not Master-Detail), native Roll-Up Summary fields are not available. The recommended approach is a Record-Triggered Flow on the Case object (After-Save) that updates a Number field on the related Account. A) Roll-Up Summary requires Master-Detail. B) Changing standard relationships from Lookup to Master-Detail is not possible for Account-Case. D) Formula fields cannot aggregate child records.

---

**Q38.** Which of the following correctly describes a "before-save" flow's limitation versus an "after-save" flow?

- A) Before-save flows cannot use Decision elements
- B) Before-save flows cannot create, update, or delete records other than the triggering record
- C) Before-save flows cannot reference the triggering record's fields
- D) Before-save flows cannot use Assignment elements

**Answer:** B) Before-save flows cannot create, update, or delete records other than the triggering record. Before-save flows are restricted from performing DML on other objects — they can only assign values to the triggering record's fields (using Assignment elements with {!$Record} variables). A) Decision elements are available in before-save flows. C) Before-save flows can absolutely reference triggering record fields. D) Assignment elements are the primary mechanism for setting field values in before-save flows.

---

**Q39.** An administrator wants to ensure that when a high-value Opportunity (Amount > $500,000) is closed-won, a notification is automatically sent to the VP of Sales. There is no coding team available. Which tool is most appropriate?

- A) Apex Trigger
- B) Record-Triggered Flow (After-Save) with an Email Alert or Custom Notification action
- C) Workflow Rule with Email Alert (legacy)
- D) Process Builder with Email Alert (legacy)

**Answer:** B) Record-Triggered Flow (After-Save) with an Email Alert or Custom Notification action. Salesforce Flow is the current recommended automation tool. An After-Save Record-Triggered Flow can check the criteria (Amount > 500,000 AND StageName = "Closed Won") and send an email alert or in-app notification without code. A) Apex is code-based and the question specifies no coding team. C) Workflow Rules are deprecated/legacy. D) Process Builder is deprecated/legacy.

---

**Q40.** A formula field uses the function ISCHANGED(). In which context does ISCHANGED() return a valid result?

- A) In formula fields on any object
- B) Only in validation rules and workflow rule criteria (where a "prior value" context exists during a save operation)
- C) In all formula fields, including those on reports
- D) Only in Apex code, not declarative formulas

**Answer:** B) Only in validation rules and workflow rule criteria (and Flow conditions) where a "prior value" context exists during a save operation. ISCHANGED() only works in the context of a record save, where both the old and new values are available. It is not available in standard formula fields (which are always read-only display formulas without a "change" context). A) ISCHANGED is not available in standard formula fields. C) Report formulas do not have a change context. D) It is available in declarative validation rules and flow conditions.

---

**Q41.** A company wants to automatically re-assign an Opportunity to a different owner based on a territory when the Account's Region field changes. The logic requires checking multiple conditions and potentially calling external services. Which tool is most appropriate?

- A) Assignment Rules
- B) Record-Triggered Flow
- C) Workflow Rule
- D) Validation Rule

**Answer:** B) Record-Triggered Flow. A Record-Triggered Flow can handle complex conditional logic (multiple Decision elements), update the Opportunity owner, and invoke external services via HTTP callouts (through Apex actions). A) Assignment Rules apply to new records or re-queuing — not triggered by field changes on a related object. C) Workflow Rules are deprecated and have limited cross-object capabilities. D) Validation rules prevent saving but cannot perform updates.

---

**Q42.** What is the correct behavior when a Validation Rule formula returns TRUE?

- A) The record is saved and the validation passes
- B) The record save is blocked and the error message is displayed
- C) A workflow rule is triggered
- D) The field is cleared and the user must re-enter it

**Answer:** B) The record save is blocked and the error message is displayed. This is a foundational and commonly tested concept: a validation rule fires the error (blocks save) when the formula evaluates to TRUE. A) When the formula is FALSE, the record saves successfully. C) Validation rules do not trigger workflow rules. D) Fields are not automatically cleared.

---

**Q43.** An administrator wants to create a flow that fires when a Contact is created and automatically creates a related Task. To avoid creating duplicate Tasks if the flow triggers multiple times, which best practice should be followed?

- A) Use a before-save flow so the flow only runs once
- B) Add Entry Conditions to ensure the flow only triggers on creation (not updates), and use fault connectors for error handling
- C) Use a Scheduled Flow to create tasks nightly instead
- D) Use Process Builder instead

**Answer:** B) Add Entry Conditions to ensure the flow only triggers on creation (not updates), and use fault connectors for error handling. Setting Entry Conditions to trigger only when a record is created (not on every update) prevents duplicate task creation. Fault connectors handle unexpected errors gracefully. A) Before-save flows cannot create related records (Tasks) — only after-save flows can perform DML on other objects. C) A scheduled flow would delay task creation. D) Process Builder is deprecated.

---

**Q44.** Which of the following best describes when to use an Approval Process versus a Record-Triggered Flow?

- A) Use Approval Process when you need users to actively approve or reject a record through a formal review workflow; use Record-Triggered Flow for automated actions that don't require human decisions
- B) Use Record-Triggered Flow when you need multi-step human approvals; use Approval Process for automated field updates
- C) They are functionally identical; the choice is purely based on admin preference
- D) Approval Processes support email notifications; Record-Triggered Flows do not

**Answer:** A) Use Approval Process when you need users to actively approve or reject a record through a formal review workflow; use Record-Triggered Flow for automated actions that don't require human decisions. Approval Processes are designed for human-in-the-loop workflows (Submit, Approve, Reject, Recall). Record-Triggered Flows are for automated, system-driven logic. B) This is reversed. C) They have very different capabilities. D) Record-Triggered Flows do support email alerts.

---

## Section 4: User Interface (17%) — Questions 45–54

---

**Q45.** A Lightning App Builder page has been customized for the Opportunity object. The admin activates the page as the "Org Default." A profile-specific activation also exists for the Sales Manager profile pointing to a different page. Which page will Sales Managers see?

- A) The Org Default page, since it overrides everything
- B) The profile-specific page, because profile-specific activation has higher priority than the org default
- C) The page will be randomly selected between the two
- D) Sales Managers will see both pages in a split view

**Answer:** B) The profile-specific page, because profile-specific activation has higher priority than the org default. Lightning App Builder activation priority (lowest to highest): Org Default → App Default → App-and-Profile Specific → Profile Specific. A more specific activation always overrides a less specific one. A) Org Default is the lowest priority. C) There is no random selection. D) Only one page is rendered at a time.

---

**Q46.** Which Lightning App Builder page type should be used to build a page that serves as the home screen for a custom Salesforce app, showing a welcome message, key reports, and quick links?

- A) Record Page
- B) App Page
- C) Home Page
- D) Utility Bar Page

**Answer:** B) App Page. An App Page is a custom page that serves as a tab within a Lightning App — ideal for dashboards, landing pages, and custom home screens for an app. A) Record Pages display a specific record's details. C) Home Pages replace the standard home tab for the org or a specific app/profile. D) The Utility Bar is a tray at the bottom of the app — not a full page type.

---

**Q47.** An administrator wants to show or hide individual sections and fields on a Record Page based on the record's field values — for example, showing the "Denial Reason" section only when Status = "Denied." Without creating multiple page layouts, which feature enables this?

- A) Record Types
- B) Component Visibility Rules in Lightning App Builder
- C) Compact Layouts
- D) Field-Level Security

**Answer:** B) Component Visibility Rules in Lightning App Builder. Component visibility rules allow you to set conditions on any Lightning component (including field sections) so they show or hide based on field values, user profile, device type, or other criteria — without needing multiple page layouts. A) Record Types control which picklist values and page layouts are used, but require separate layouts for different views. C) Compact Layouts control the highlights panel, not section visibility. D) Field-Level Security hides fields entirely from a profile, not conditionally based on record values.

---

**Q48.** What does the Dynamic Forms feature in Lightning App Builder allow administrators to do?

- A) Create dynamic reports that refresh automatically
- B) Move individual fields and field sections from the page layout into the Lightning App Builder, enabling field-level visibility rules and conditional display
- C) Automatically populate form fields based on other field values
- D) Generate form-based screen flows directly from page layouts

**Answer:** B) Move individual fields and field sections from the page layout into the Lightning App Builder, enabling field-level visibility rules and conditional display. Dynamic Forms "migrates" field sections out of the traditional page layout canvas into the App Builder, where each field or section can have its own visibility rule. This eliminates the need for multiple page layouts to show different fields to different users. A) That describes dashboard refreshing. C) Auto-populating fields is done by flows or formula fields. D) Screen flows are built in Flow Builder.

---

**Q49.** A company has three types of Accounts: "Customer," "Partner," and "Competitor." Each type needs different picklist values for an Account Type field and a different page layout. Which feature enables this differentiation?

- A) Permission Sets
- B) Profiles
- C) Record Types
- D) Compact Layouts

**Answer:** C) Record Types. Record Types allow you to define different picklist values and assign different page layouts for different categories of the same object. Users see only the picklist values associated with their record type, and the assigned page layout can be different per record type. A) Permission sets control access, not record categorization or layout differentiation. B) Profiles can be assigned different layouts, but without record types you cannot segment records themselves. D) Compact layouts control the highlights panel fields, not picklist values or full layouts.

---

**Q50.** An administrator needs to create a button on the Account record page that, when clicked, opens a form allowing the user to quickly create a related Contact without navigating away. Which is the most appropriate approach?

- A) Create a custom button with a URL redirect to the new Contact page
- B) Create a Quick Action of type "Create Record" on the Account object targeting the Contact object
- C) Build a custom Lightning Web Component and embed it in the page
- D) Create a Visualforce page and add it as a related list

**Answer:** B) Create a Quick Action of type "Create Record" on the Account object targeting the Contact object. Object-specific Quick Actions of type "Create Record" allow users to create a pre-associated related record in a modal without leaving the current page, and they automatically pre-populate the parent lookup. A) A URL redirect navigates the user away from the page. C) An LWC would work but is far more complex for this standard use case. D) Visualforce adds unnecessary complexity.

---

**Q51.** Which fields appear in the "highlights panel" at the top of a record page in Lightning Experience?

- A) The first 5 fields on the page layout
- B) Fields configured in the Compact Layout assigned to the object
- C) Fields flagged as "Required" on the page layout
- D) Fields included in the List View for that object

**Answer:** B) Fields configured in the Compact Layout assigned to the object. The Compact Layout defines which fields appear in the record highlights panel (the top banner on a record detail page) and in mobile list cards. A) The page layout does not directly determine the highlights panel fields. C) Required status does not affect the highlights panel. D) List Views are separate from record detail views.

---

**Q52.** An administrator is setting up a Lightning App. Which of the following is NOT something you configure in the Lightning App Manager when creating a Lightning App?

- A) Utility items (utility bar components)
- B) Navigation items (tabs shown in the app)
- C) Assigned profiles (which users see the app)
- D) Page layouts for each object in the app

**Answer:** D) Page layouts for each object in the app. Page layouts are configured in Object Manager per object, not in the Lightning App Manager. The App Manager is used to configure the app's navigation tabs, utility bar, branding (logo, colors), and which profiles can see the app. A) Utility items are configured in App Manager. B) Navigation items are configured in App Manager. C) Profile assignment is configured in App Manager.

---

**Q53.** A company wants to display a custom Lightning component only to users on the "Sales Rep" profile when they are viewing an Opportunity Record Page. How should this be configured?

- A) Edit the page in Lightning App Builder, select the component, and set a Visibility Rule with Filter Type = "Profile" = "Sales Rep"
- B) Create a separate page layout for Sales Reps
- C) Use Field-Level Security to restrict the component
- D) Create a permission set that grants access to the component

**Answer:** A) Edit the page in Lightning App Builder, select the component, and set a Visibility Rule with Filter Type = "Profile" = "Sales Rep". Component Visibility Rules in the Lightning App Builder support filtering by user profile, device type, custom permissions, and field values. B) Page layouts control field placement, not component visibility. C) Field-Level Security applies to fields, not components. D) Permission sets control access rights, not component display rules.

---

**Q54.** What is the key difference between an "Object-Specific Quick Action" and a "Global Quick Action"?

- A) Object-specific quick actions appear in the global search bar; global quick actions appear on records
- B) Object-specific quick actions are created on a specific object and are available on that object's record pages; global quick actions are available from any page, including the home page and global action bar
- C) Global quick actions require Apex code; object-specific actions are declarative
- D) Object-specific quick actions are only available in Salesforce Classic

**Answer:** B) Object-specific quick actions are created on a specific object and are available on that object's record pages; global quick actions are available from any page, including the home page and global action bar. This is the fundamental distinction tested on the exam. A) This is reversed. C) Neither type requires Apex — both can be fully declarative. D) Both are available in Lightning Experience.

---

## Section 5: App Deployment (10%) — Questions 55–60

---

**Q55.** An administrator has built several custom objects, fields, and a Flow in a sandbox. They want to move these changes to production. They are not using Salesforce DX. What is the most appropriate deployment method?

- A) Manually recreate every change in production
- B) Use an Outbound Change Set from the sandbox and an Inbound Change Set in production
- C) Export data from the sandbox and import it to production
- D) Use the Data Loader to transfer metadata

**Answer:** B) Use an Outbound Change Set from the sandbox and an Inbound Change Set in production. Change Sets are the declarative, no-code method for moving metadata (custom objects, fields, flows, layouts, etc.) between connected Salesforce orgs (sandbox to production). A) Manual recreation is error-prone and not scalable. C) Data export/import moves data records, not metadata (configuration). D) Data Loader handles data, not metadata.

---

**Q56.** Before deploying an Inbound Change Set to production, what is the recommended best practice?

- A) Delete all existing customizations in production first
- B) Run "Validate" on the change set to check for errors and run Apex tests without committing the changes
- C) Deploy directly during peak business hours to ensure maximum user feedback
- D) Manually add all referenced components before clicking Deploy

**Answer:** B) Run "Validate" on the change set to check for errors and run Apex tests without committing the changes. Validation runs all the checks of a real deployment — including Apex test execution — but does NOT commit any changes to production. This lets you confirm the deployment will succeed before going live. A) Deleting existing customizations is destructive and unnecessary. C) Deploying during peak hours is risky and against best practice. D) The change set tracks dependencies; Validate will surface any missing components.

---

**Q57.** A company wants to share their custom Salesforce application with other Salesforce customers on the AppExchange. The package must prevent customers from viewing the underlying code and configuration. Which package type should be used?

- A) Unmanaged Package
- B) Managed Package
- C) Unlocked Package
- D) Change Set

**Answer:** B) Managed Package. Managed Packages are the AppExchange distribution format. They require a namespace prefix, protect intellectual property (code is obfuscated from subscribers), support versioning and upgrades, and can be listed on AppExchange. A) Unmanaged Packages expose all code and configuration to the recipient. C) Unlocked Packages are a Salesforce DX construct for internal modular deployment — not for AppExchange distribution. D) Change Sets cannot be distributed on AppExchange.

---

**Q58.** Which sandbox type provides a full copy of production data and is typically used for final user acceptance testing before a major release?

- A) Developer Sandbox
- B) Developer Pro Sandbox
- C) Partial Copy Sandbox
- D) Full Sandbox

**Answer:** D) Full Sandbox. A Full Sandbox copies all production metadata AND all production data. It is the most expensive sandbox type and is typically used for performance testing, load testing, and final UAT. A) Developer Sandbox has no production data and limited storage. B) Developer Pro Sandbox has no production data but more storage than Developer. C) Partial Copy Sandbox copies all metadata and a sample of data (up to 10,000 records per object) — suitable for some testing but not a complete production data replica.

---

**Q59.** An administrator is deploying a change set that includes Apex classes. What is required for the deployment to succeed in a production org?

- A) All Apex classes must have 100% code coverage
- B) At least 75% overall Apex code coverage across the org, and all tests must pass
- C) Apex tests must be run in the sandbox before deployment, but not in production
- D) No code coverage is required if the change set only modifies declarative components alongside the Apex

**Answer:** B) At least 75% overall Apex code coverage across the org, and all tests must pass. Salesforce requires a minimum of 75% overall code coverage across all Apex in the production org, and every individual test method must pass. A) 100% is not required (75% is the threshold). C) Tests are run as part of the production deployment, not just the sandbox. D) If any Apex is included, coverage requirements apply.

---

**Q60.** What is the key difference between an Unmanaged Package and an Unlocked Package?

- A) Unmanaged Packages support versioning and upgrades; Unlocked Packages do not
- B) Unlocked Packages support versioning, dependency management, and source control integration via Salesforce DX; Unmanaged Packages are a simpler one-time deployment tool with no versioning
- C) Unmanaged Packages require a namespace; Unlocked Packages do not
- D) They are functionally identical — the name is just a branding difference

**Answer:** B) Unlocked Packages support versioning, dependency management, and source control integration via Salesforce DX; Unmanaged Packages are a simpler one-time deployment tool with no versioning. Unlocked Packages are the modern alternative — built around the Salesforce DX model, they track package versions, support dependency declarations, and integrate with CI/CD pipelines. Unmanaged Packages deliver a snapshot of metadata with no future upgrade path. A) This is reversed. C) Managed Packages require a namespace; Unlocked Packages can optionally use one, but it is not required. D) They are fundamentally different architectures.

---

*End of Practice Exam — Review answers and focus on any sections where you scored below 70%.*

---

**Score Tracker:**

| Section | Questions | Your Score | % |
|---|---|---|---|
| Salesforce Fundamentals | Q1–Q14 (14 Qs) | /14 | % |
| Data Modeling & Management | Q15–Q27 (13 Qs) | /13 | % |
| Business Logic & Process Automation | Q28–Q44 (17 Qs) | /17 | % |
| User Interface | Q45–Q54 (10 Qs) | /10 | % |
| App Deployment | Q55–Q60 (6 Qs) | /6 | % |
| **Total** | **60 Questions** | **/60** | **%** |

Passing score: 39/60 (65%)
