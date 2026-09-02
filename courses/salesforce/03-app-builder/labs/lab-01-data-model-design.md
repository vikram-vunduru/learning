# Lab 01: Data Model Design — Job Application Tracker

## What You Need to Be Able to Do

This lab validates hands-on data modeling skills. Before the exam, you should be able to do all of the following from memory in a Dev org.

---

### Custom Object Creation
- [ ] Create a custom object `Job__c` with Auto Number name field (format: JOB-{0000})
  - Enable: Allow Reports, Allow Activities, Track Field History
  - Add fields: `Title__c` (Text 100), `Department__c` (Picklist: Engineering/Sales/Marketing/HR), `Location__c` (Text 100), `Open_Positions__c` (Number), `Status__c` (Picklist: Open/On Hold/Closed)

- [ ] Create a custom object `Candidate__c` with Text name field (candidate's full name)
  - Enable: Allow Reports, Allow Activities
  - Add fields: `Email__c` (Email, External ID), `Phone__c` (Phone), `Years_Experience__c` (Number), `Resume_Link__c` (URL)

- [ ] Create a junction object `Application__c` with Auto Number name field (format: APP-{0000})
  - Add Master-Detail field to `Job__c` (relationship name: Job, label: Job)
  - Add Master-Detail field to `Candidate__c` (relationship name: Candidate, label: Candidate)
  - Add fields: `Application_Date__c` (Date), `Status__c` (Picklist: Submitted/Under Review/Interview/Offer/Rejected), `Notes__c` (Long Text Area)

---

### Roll-Up Summary Fields
- [ ] On `Job__c`, create a Roll-Up Summary field `Total_Applications__c` (COUNT of Application__c, no filter)
- [ ] On `Job__c`, create a Roll-Up Summary field `Active_Applications__c` (COUNT of Application__c, filter: Status__c NOT EQUAL TO "Rejected")
- [ ] On `Candidate__c`, create a Roll-Up Summary field `Total_Applications__c` (COUNT of Application__c, no filter)

---

### Schema Builder Verification
- [ ] Open Schema Builder (Setup → Schema Builder)
- [ ] Select Job__c, Candidate__c, and Application__c
- [ ] Verify: two gold (Master-Detail) lines connecting Application__c to both parent objects
- [ ] Verify: all custom fields appear on each entity box

---

### Tabs and App
- [ ] Create a custom Tab for `Job__c` (choose a meaningful icon)
- [ ] Create a custom Tab for `Candidate__c`
- [ ] Create a custom Tab for `Application__c`
- [ ] Create a new Lightning App called "Talent Hub"
  - Navigation: Jobs, Candidates, Applications, Reports, Dashboards tabs
  - Assign to: System Administrator profile

---

### Validation Checks
- [ ] Create a Job__c record and an Application__c record — verify Auto Number naming works
- [ ] Verify Roll-Up Summary counts update when Applications are added/rejected
- [ ] Confirm the Talent Hub app appears in the App Launcher

---

## Key Concepts This Lab Tests

- Junction object with two Master-Detail relationships (many-to-many pattern)
- Roll-Up Summary on the master object side (Job and Candidate count their Applications)
- Auto Number field for system-generated record IDs
- Schema Builder color coding: gold lines = Master-Detail relationships
- Custom Tab creation and Lightning App wizard (5 steps)

---

## Common Mistakes to Avoid

- Creating the junction object with Lookup relationships instead of Master-Detail — Roll-Up Summaries won't work
- Forgetting to enable "Allow Reports" on objects you need in Report Builder
- Not verifying FLS after creating fields (new fields are hidden for non-Admin profiles by default)
- Creating the app without assigning it to a profile (it won't appear in App Launcher)
