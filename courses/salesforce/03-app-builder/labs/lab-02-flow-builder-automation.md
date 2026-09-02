# Lab 02: Flow Builder Automation

## What You Need to Be Able to Do

This lab validates Flow Builder skills across two Flow types. Complete Lab 01 first (Job__c, Candidate__c, Application__c must exist).

---

### Before-Save Record-Triggered Flow

- [ ] Create a new Flow in Flow Builder: type = **Record-Triggered Flow**
  - Object: `Application__c`
  - Trigger: A record is created (entry condition: flow runs on every new Application)
  - Timing: **Before the record is saved**

- [ ] Add an **Assignment** element that sets:
  - `$Record.Status__c` = "Submitted" (default status on creation)
  - `$Record.Application_Date__c` = `{!$Flow.CurrentDate}` (today's date as default)

- [ ] Save as "Auto-Populate Application Defaults", activate it

- [ ] Test: Create a new Application__c record manually and verify Status = "Submitted" and Application Date = today, without the user having entered those values

---

### Multi-Screen Screen Flow ("New Application Wizard")

- [ ] Create a new Flow: type = **Screen Flow**
- [ ] Add **Screen 1 — Select Job**:
  - Add a Record Lookup component or a Picklist showing Job records
  - Store the selected Job's ID in a variable `varJobId` (Text)

- [ ] Add a **Get Records** element:
  - Object: `Job__c`
  - Filter: `Id = {!varJobId}`
  - Store first record: variable `varJob` (Job__c)

- [ ] Add **Screen 2 — Candidate Details**:
  - Text input: `inputFirstName` (First Name)
  - Text input: `inputLastName` (Last Name)
  - Email input: `inputEmail` (Email)
  - Number input: `inputExperience` (Years of Experience)
  - Display Text showing: "Applying for: {!varJob.Title__c}"

- [ ] Add **Screen 3 — Review**:
  - Display Text: Review all entered values before submission
  - Show: Name, Email, Job Title, Application Date

- [ ] Add **Create Records** elements:
  - First: Create a `Candidate__c` record from input values; store new record ID in `varCandidateId`
  - Second: Create an `Application__c` record with `Job__c = {!varJobId}` and `Candidate__c = {!varCandidateId}`

- [ ] Add a **Fault Path** on each Create Records element:
  - Route to a Screen with Display Text: "An error occurred. Contact your administrator."

- [ ] Save as "New Application Wizard", activate it

---

### Embed as Quick Action

- [ ] Create a Quick Action on `Job__c`:
  - Action Type: Flow
  - Flow: New Application Wizard
  - Label: "Add Application"

- [ ] Add the Quick Action to the Job__c page layout (in the "Salesforce Mobile and Lightning Actions" section)

- [ ] Verify: Open a Job__c record, click "Add Application" button, walk through the 3-screen wizard, verify Candidate and Application records are created

---

## Key Concepts This Lab Tests

- Before-Save RTF: updates triggering record fields directly (0 extra DML)
- `{!$Flow.CurrentDate}` global variable for today's date in flows
- Screen Flow with 3 screens: data collection → review → action
- Get Records element: query a record, store as a variable for use in later screens
- Create Records: sequential creation (Candidate first, then Application using Candidate ID)
- Fault paths: handling Create Records failures gracefully
- Quick Action (Flow type): embeds a Screen Flow as a button on a record page

---

## Common Mistakes to Avoid

- Using After-Save instead of Before-Save for field defaulting (works but uses extra DML unnecessarily)
- Forgetting to add the Quick Action to the page layout (the button won't appear even if the action exists)
- Not handling the case where the user exits the Screen Flow early (no Candidate or Application created)
- Creating Application without a Candidate ID — the Master-Detail relationship requires Candidate__c to have a value
