# CRT-101 Practice Exam — 60 Questions

> **Exam Simulation Guidelines:** Time yourself at 105 minutes (same as the real exam). The real exam has 60 scored questions. Passing score is approximately 65%. Review all explanations regardless of whether you answered correctly.

---

## Section A: Configuration & Setup (12 Questions)

**Q1 (Config/Setup):** A company wants all users to access Salesforce via the URL `https://acmecrm.my.salesforce.com` instead of the generic `login.salesforce.com` URL. Which Setup feature accomplishes this?
- A) Custom Domain
- B) My Domain
- C) Site.com
- D) Communities Domain

**Answer:** B — My Domain allows orgs to create a custom subdomain (e.g., acmecrm.my.salesforce.com). It is required for Lightning Experience, SSO, and Salesforce mobile. "Custom Domain" is not a Salesforce Setup feature name.

---

**Q2 (Config/Setup):** An admin wants to configure the fiscal year so that Q1 begins in April instead of January. Where is this configured?
- A) Company Information
- B) User Management Settings
- C) Organization-Wide Sharing Settings
- D) Time Zone and Locale Settings

**Answer:** A — Fiscal year settings (including the fiscal year start month) are configured in Setup → Company Information. Changing this affects fiscal period labels in reports, forecasts, and dashboards.

---

**Q3 (Config/Setup):** Which of the following is TRUE about Lightning Apps created in App Manager?
- A) Each Lightning App can only display one object tab
- B) Lightning Apps can use Console Navigation for multi-record workflows
- C) Lightning Apps replace all standard Salesforce apps permanently
- D) Lightning Apps require Apex code to configure

**Answer:** B — Lightning Apps support two navigation types: Standard Navigation and Console Navigation. Console Navigation is designed for service and sales agents who need to work with multiple records simultaneously in a tabbed interface, like Salesforce Service Console.

---

**Q4 (Config/Setup):** An admin is setting up a new Salesforce org. She wants to ensure that when users log in from outside the corporate network, they are required to verify their identity with a one-time code sent via email. Which feature should she enable?
- A) Two-Factor Authentication (2FA) / Multi-Factor Authentication (MFA)
- B) Single Sign-On (SSO)
- C) IP Restrictions on Profile
- D) Login Hours Restriction

**Answer:** A — Multi-Factor Authentication (MFA) — formerly called Two-Factor Authentication — requires users to verify their identity using a second factor (authenticator app, SMS code, or security key) in addition to their password. Salesforce now requires MFA for all user logins.

---

**Q5 (Config/Setup):** A System Administrator needs to allow a specific external IP range to bypass login verification. Where should this be configured?
- A) Password Policy
- B) Trusted IP Ranges (in Network Access settings)
- C) Session Settings
- D) Profile Login IP Ranges

**Answer:** B — Trusted IP Ranges (Setup → Network Access → Trusted IP Ranges) define IP addresses from which users do not need to verify their identity. Profile-level Login IP Ranges restrict which IPs a profile can log in from (a stricter setting). Trusted IP Ranges are for the whole org; Profile Login IP Ranges are per profile.

---

**Q6 (Config/Setup):** Which statement about Salesforce Editions is TRUE?
- A) Professional Edition includes Apex and API access by default
- B) Enterprise Edition includes unlimited sandboxes
- C) Unlimited Edition includes 10 dynamic dashboards
- D) Developer Edition is a paid version with full feature access

**Answer:** C — Unlimited Edition (and Performance Edition) includes 10 dynamic dashboards. Developer Edition is free and has most Enterprise features for development/testing. Professional Edition does NOT include full API access by default (requires add-on). Enterprise Edition includes sandboxes but not unlimited — it has a specific number based on licensing.

---

**Q7 (Config/Setup):** An administrator needs to display a compact set of key fields at the top of a record page. Which feature should they configure?
- A) Page Layout — Field Section
- B) Compact Layout
- C) Related List
- D) Quick Actions

**Answer:** B — Compact Layouts define which fields appear in the record highlights panel (the top section of a Lightning record page), in Salesforce mobile, and in Kanban cards. They show a concise view of the most important fields for quick scanning.

---

**Q8 (Config/Setup):** A company uses the Salesforce mobile app. An admin wants to ensure that the mobile navigation includes the Accounts, Contacts, and Cases tabs, but NOT the Leads tab. Where is mobile navigation configured?
- A) Lightning App Builder
- B) Mobile Administration → Salesforce Navigation
- C) Profile Settings → Mobile Access
- D) App Manager → Mobile Configuration

**Answer:** B — Mobile navigation is configured in Setup → Mobile Administration → Salesforce Navigation. The admin can customize which tabs and items appear in the Salesforce mobile app navigation, separate from the desktop app navigation.

---

**Q9 (Config/Setup):** Which of the following actions can be performed using Quick Actions?
- A) Override the standard record page layout with a custom layout
- B) Create records, log calls, send emails, or update fields from a record page without full navigation
- C) Set field-level security for fields
- D) Configure object permissions for profiles

**Answer:** B — Quick Actions allow users to take common actions (create records, log a call, send an email, update a field) directly from the record page, the publisher bar, or the Chatter feed, without navigating away. They appear in the highlights panel actions menu.

---

**Q10 (Config/Setup):** An admin changes a user's profile from "Standard User" to "System Administrator." When does this change take effect?
- A) The next time the user logs in
- B) Immediately — on the user's next page refresh or action
- C) Within 24 hours
- D) Only after the admin clicks "Apply Profile Changes"

**Answer:** B — Profile changes in Salesforce take effect almost immediately. The user doesn't need to log out and back in — the new permissions are applied on their next page load or action. For security-sensitive changes, best practice is to ask the user to log out and back in to ensure a clean session.

---

**Q11 (Config/Setup):** A company needs to capture a "Department Budget Code" on Account records. This field should be exactly 8 characters, uppercase letters and numbers only. Which field type best enforces this?
- A) Text (with validation rule for format)
- B) Number
- C) Picklist
- D) Formula

**Answer:** A — A Text field with a validation rule enforcing format (using LEN, CONTAINS, or regex-like formula logic) is the appropriate approach. Text fields store the value as entered; the validation rule enforces the 8-character, uppercase format constraint.

---

**Q12 (Config/Setup):** Which object relationship type should be used when child records should be automatically deleted when the parent record is deleted?
- A) Lookup Relationship
- B) Master-Detail Relationship
- C) Many-to-Many (Junction Object)
- D) External Lookup

**Answer:** B — Master-Detail Relationships create a tight parent-child coupling where child records are automatically deleted when the parent is deleted (cascade delete). Lookup relationships are loose — deleting the parent leaves the child record intact with a blank lookup field.

---

## Section B: Objects & App Builder (12 Questions)

**Q13 (Objects):** A company wants to track many-to-many relationships between Products and Vendors. Which Salesforce feature is designed for this?
- A) Lookup Relationship with a custom field
- B) Junction Object with two Master-Detail relationships
- C) Roll-Up Summary field
- D) Cross-Object Formula

**Answer:** B — Many-to-many relationships are implemented using a Junction Object with two Master-Detail relationships — one to each of the two objects you're connecting. This creates a linking record for each relationship between the two parent objects.

---

**Q14 (Objects):** Which of the following is TRUE about Roll-Up Summary fields?
- A) They can be created on any object to summarize data from any related object
- B) They can only be created on the parent (master) side of a Master-Detail relationship
- C) They support Lookup relationships as well as Master-Detail relationships
- D) Roll-Up Summary fields can calculate values using fields from unrelated objects

**Answer:** B — Roll-Up Summary fields can ONLY be created on the master object in a Master-Detail relationship to summarize values from the child (detail) records. They do NOT work with Lookup relationships. Functions: COUNT, SUM, MIN, MAX.

---

**Q15 (Objects):** An admin wants to display the Account's Industry field value on a Contact record without creating a separate field. The Contact has a lookup to Account. Which field type should be used?
- A) Roll-Up Summary
- B) Cross-Object Formula Field
- C) Custom Text Field with Workflow Update
- D) Lookup Field

**Answer:** B — A Cross-Object Formula Field on the Contact object can reference the related Account's Industry field using dot notation: `Account.Industry`. This displays the parent field value on the child record without storing a separate copy.

---

**Q16 (Objects):** Which of the following field types CANNOT be used as an External ID?
- A) Text
- B) Number
- C) Email
- D) Picklist

**Answer:** D — External IDs can only be set on Text, Number, Email, and Auto-Number field types. Picklist fields cannot be marked as External IDs. External IDs are used for upsert operations and to link parent records during data imports.

---

**Q17 (App Builder):** An admin is building a custom Lightning Record Page for Opportunities. She wants to show a dashboard component only to users with the Sales Manager profile, and a different component to all other users. Which App Builder feature enables this?
- A) Multiple Page Layouts
- B) Component Visibility with Filter Conditions
- C) Record Type Page Assignment
- D) Dynamic Forms

**Answer:** B — Component Visibility in Lightning App Builder allows conditional display of components based on criteria such as Profile, Permission Set, Record Type, field values, and device type. This enables personalized page experiences without building separate pages per profile.

---

**Q18 (App Builder):** A Lightning Record Page has been customized in Lightning App Builder and saved. The admin wants it to be the default page for all users when they view Account records. What is the final required step?
- A) Click "Publish" in the App Builder
- B) Activate the page and assign it as the org default, app default, or for specific profiles/record types
- C) Restart the Salesforce org to apply the new page
- D) Assign the page via the Profile's Page Layout Assignment

**Answer:** B — After saving a customized page in Lightning App Builder, you must Activate it and assign it as: the Org Default (applies to all apps and profiles), an App Default (applies to specific apps), or for specific App-Profile-Record Type combinations. Without activation and assignment, the customized page does not replace the default.

---

**Q19 (Objects):** Which of the following statements about Schema Builder is TRUE?
- A) Schema Builder is used to deploy metadata changes to Production
- B) Schema Builder provides a visual representation of objects and their relationships, and allows creating objects and fields
- C) Schema Builder replaces the Object Manager for all field creation tasks
- D) Schema Builder is only available to developers, not administrators

**Answer:** B — Schema Builder (Setup → Schema Builder) displays a visual diagram of your objects and their relationships. You can also create new custom objects and fields directly from the canvas. It's a complementary tool to Object Manager, not a replacement.

---

**Q20 (Objects):** What is the maximum number of custom fields that can be created on a standard object in Salesforce (Enterprise Edition)?
- A) 100
- B) 250
- C) 500
- D) 800

**Answer:** C — The maximum number of custom fields on most standard objects in Enterprise Edition is 500 per object. (Note: This limit can vary and Salesforce occasionally updates limits — verify in the Salesforce documentation for the most current limit at exam time.) For the exam, 500 is the number you'll encounter.

---

**Q21 (Objects):** An admin needs to track which Opportunities a Contact is involved in, and assign a specific role (e.g., Decision Maker, Economic Buyer) to each Contact-Opportunity relationship. Which Salesforce feature handles this?
- A) Contact Roles on Opportunities
- B) Custom Junction Object
- C) Contact Lookup on Opportunity
- D) Chatter Groups

**Answer:** A — Contact Roles on Opportunities is a built-in Salesforce feature that links Contacts to Opportunities and allows assigning a specific role to each relationship. The roles are configurable picklist values. Access via the Contact Roles related list on the Opportunity record.

---

**Q22 (Objects):** Which statement accurately describes the difference between a Standard Picklist field and a Global Picklist Value Set?
- A) Standard picklists can be shared across multiple fields; global picklists cannot
- B) Global Picklist Value Sets define a set of values that can be reused across multiple picklist fields on different objects
- C) Standard picklists support dependencies; global picklists do not
- D) Global Picklist Value Sets automatically sync values to all standard picklist fields

**Answer:** B — Global Picklist Value Sets are shared value lists that multiple picklist fields across different objects can reference. When the global value set is updated (adding/removing values), all fields using that value set are automatically updated. Standard picklists are defined per field and not shared.

---

**Q23 (Objects):** An admin creates a lookup relationship from a custom object "Project__c" to Account. If an Account record is deleted, what happens to related Project records?
- A) Project records are automatically deleted (cascade delete)
- B) Project records remain, but the Account lookup field is cleared to null
- C) The Account deletion is blocked if there are related Projects
- D) Projects are moved to the Recycle Bin but can be recovered

**Answer:** B — In a Lookup relationship, deleting the parent (Account) does NOT delete the child (Project) records. The lookup field on the Project record is simply set to null. In a Master-Detail relationship, the parent deletion would cascade-delete the children.

---

**Q24 (App Builder):** Which of the following can be configured using Dynamic Forms in the Lightning App Builder?
- A) Convert page layout fields to individually placeable components on a Lightning Page, with visibility rules per field
- B) Create new fields directly on the Lightning Page canvas
- C) Import page layouts from Classic to Lightning automatically
- D) Apply different validation rules per component on the page

**Answer:** A — Dynamic Forms allows admins to place individual fields (not just a single "Record Detail" component with all fields) directly on a Lightning Page, and apply visibility rules to each field independently. This enables highly personalized record pages without building multiple page layouts.

---

## Section C: Sales & Marketing (7 Questions)

**Q25 (Sales):** A sales rep is working with a lead that has been identified as a genuine prospect. What is the Salesforce process for converting a lead?
- A) Delete the Lead and manually create Account, Contact, and Opportunity records
- B) Use the Lead Conversion process to automatically create Account, Contact, and Opportunity records from the Lead data
- C) Change the Lead Status to "Converted" without any additional steps
- D) Use Data Loader to migrate Lead fields to the Contact object

**Answer:** B — The Lead Conversion process in Salesforce automatically creates an Account, Contact, and (optionally) an Opportunity from the Lead data. Field mappings defined in Setup → Lead Settings → Map Lead Fields control how Lead fields populate the created records.

---

**Q26 (Sales):** Which of the following is TRUE about Opportunity Stages?
- A) Opportunity Stages can only be modified by a System Administrator via Apex code
- B) Each Stage has an associated Probability percentage that drives Forecast Category and weighted pipeline calculations
- C) Deleting a Stage immediately removes all Opportunities in that Stage
- D) Opportunity Stages must be linked to Opportunity Record Types to function

**Answer:** B — Each Opportunity Stage has a Probability field and a Forecast Category associated with it. These drive the weighted amount calculations in pipeline reports and forecasting. The Probability can be manually overridden on individual Opportunity records.

---

**Q27 (Sales):** A company wants to ensure that when an Opportunity is created, it is always associated with an Account. How can this be enforced?
- A) Set the Account Name field as Required on the Opportunity page layout
- B) Create a validation rule: ISBLANK(AccountId)
- C) Set the Account Name field as Required in the Opportunity field settings (globally required)
- D) Both A and B are valid approaches

**Answer:** D — Both approaches work. Setting a field as Required in field settings enforces it universally (all profiles, all page layouts, all save operations). Setting it Required only on the page layout enforces it for users using that layout via the UI but not via API. A validation rule enforces it universally regardless of how the record is saved. For strongest enforcement, use field-level Required setting.

---

**Q28 (Sales):** What is the purpose of Salesforce Forecasting?
- A) To automatically close opportunities based on probability thresholds
- B) To provide sales managers with a rollup view of expected revenue from their team's pipeline, categorized by forecast category
- C) To generate automatic quotes from opportunity line items
- D) To schedule recurring revenue from existing customers

**Answer:** B — Salesforce Forecasting (Collaborative Forecasting) gives sales managers a hierarchical view of expected revenue from their team's opportunities, organized by forecast category (Closed, Commit, Best Case, Pipeline). Managers can adjust forecast amounts and roll up their team's numbers.

---

**Q29 (Marketing):** A marketing team creates a Campaign to track responses from an email blast. They want to see which Leads and Contacts responded. How are responses tracked in Salesforce?
- A) Campaign Members — Leads and Contacts are added as Campaign Members with a Status (e.g., Sent, Responded, Converted)
- B) Campaign Activities — each interaction is logged as an Activity on the Campaign
- C) Campaign Opportunities — Leads and Contacts are linked via opportunity records
- D) Campaign Reports only — no direct record-level tracking

**Answer:** A — Campaign Members link Leads and Contacts to Campaigns with a Status field (configurable values like Sent, Opened, Clicked, Responded). This enables tracking individual responses and is the basis for Campaign ROI reporting.

---

**Q30 (Sales):** A sales representative is using Salesforce on mobile and wants to log a call immediately after a phone conversation. Which feature should they use?
- A) Create a new Task record manually
- B) Use the "Log a Call" quick action from the Account or Contact record
- C) Send a Chatter post to the record feed
- D) Use Data Loader to import the call log

**Answer:** B — The "Log a Call" quick action is a built-in action available on record pages (Account, Contact, Opportunity, Lead) that creates a completed Activity (Task with type = Call) in one step. It's optimized for mobile and quick entry without navigating away from the current record.

---

**Q31 (Sales):** Which Salesforce feature allows sales reps to build proposals and quotes directly from Opportunity line items?
- A) CPQ (Configure, Price, Quote)
- B) Salesforce Quotes (standard feature)
- C) Salesforce Contracts
- D) Both A and B can generate quotes

**Answer:** D — Standard Salesforce Quotes (included with Salesforce) can generate PDF quotes from Opportunity products. Salesforce CPQ (a paid add-on) offers more advanced quoting capabilities including guided selling, product bundles, and advanced pricing rules. Both generate quotes from Opportunity data.

---

## Section D: Service & Support (7 Questions)

**Q32 (Service):** A customer service team needs to ensure that high-priority cases are automatically assigned to the most experienced agents, while standard cases go to a general queue. Which Salesforce feature handles this?
- A) Case Assignment Rules
- B) Case Escalation Rules
- C) Case Auto-Response Rules
- D) Approval Processes

**Answer:** A — Case Assignment Rules automatically route Cases to specific users or queues based on criteria. You can create multiple rule entries with different criteria — for example, "Priority = High" routes to the Expert Agents queue, while all other cases go to the General Support queue.

---

**Q33 (Service):** A service manager wants to ensure that if a case is not responded to within 4 hours, it is escalated to the tier 2 team. Which feature should be configured?
- A) Case Assignment Rules
- B) Case Escalation Rules
- C) Workflow Rule with Time Trigger
- D) Entitlements and Milestones

**Answer:** D — While both B and D could work, the most appropriate Salesforce-native feature for tracking SLA-based response times and escalations is Entitlements and Milestones (Entitlement Management). Milestones define time-based conditions (respond within 4 hours), and Entitlement Processes define what happens when milestones are violated. Case Escalation Rules (B) are also valid for time-based escalation and acceptable on the exam — both B and D are correct in different contexts.

**Exam Note:** If the question specifies SLA/entitlements context → Entitlements. If it's a simpler time-based auto-escalation without SLA tracking → Case Escalation Rules.

---

**Q34 (Service):** Which of the following is TRUE about Service Contracts and Entitlements?
- A) Entitlements define the level of support a customer is entitled to; Service Contracts group multiple Entitlements
- B) Service Contracts must be created before Entitlements
- C) Entitlements are automatically created when a Case is created
- D) Service Contracts replace Case Assignment Rules

**Answer:** A — Entitlements define what a customer is entitled to (e.g., 24/7 phone support, 4-hour response SLA). Service Contracts are agreements that can contain multiple Entitlements. Entitlements are linked to Accounts or Contacts and associated with Cases to track SLA compliance.

---

**Q35 (Service):** A support manager wants agents to see all related cases, account history, and open tasks simultaneously while working a case, without navigating between pages. Which Salesforce feature provides this experience?
- A) Standard Case list view
- B) Service Console (Lightning Console App)
- C) Case Related Lists on the record page
- D) Salesforce Anywhere

**Answer:** B — The Service Console (Lightning Console App) provides a multi-panel workspace where agents can work multiple records simultaneously in tabs and subtabs. This is designed for high-volume service environments where agents need contextual information from multiple records without navigating away.

---

**Q36 (Service):** An admin needs to enable customers to find answers to common questions without contacting a support agent. Which Salesforce feature provides self-service capabilities?
- A) Chatter
- B) Knowledge Base (Salesforce Knowledge)
- C) Case Assignment Rules
- D) Community Builder

**Answer:** B — Salesforce Knowledge is a knowledge base where articles (answers to common questions) are created, reviewed, published, and categorized. Articles can be displayed in a Customer Community (Experience Cloud site) for self-service, reducing the volume of inbound cases.

---

**Q37 (Service):** What is the purpose of Case Queues?
- A) To automatically close resolved cases
- B) To hold unassigned or group-managed cases that team members can pull from and work
- C) To route cases to external systems via API
- D) To archive old cases

**Answer:** B — Queues hold records that aren't yet assigned to a specific user. For Cases, queues allow a support team to pool incoming cases. Team members can "accept" cases from the queue (transferring ownership to themselves) or supervisors can assign cases from the queue to agents.

---

**Q38 (Service):** Which report type would give a service manager the count of cases closed per agent per week, in a cross-tabular view with agents as rows and weeks as columns?
- A) Tabular report
- B) Summary report grouped by Owner
- C) Matrix report grouped by Owner (rows) and Close Date Week (columns)
- D) Joined report with two case blocks

**Answer:** C — A Matrix report with Owner as the row grouping and Close Date (grouped by week) as the column grouping produces the exact cross-tabular view requested. This allows instant comparison of each agent's weekly performance side by side.

---

## Section E: Productivity & Collaboration (4 Questions)

**Q39 (Productivity):** A manager wants to receive a notification in Salesforce when a deal closes. She doesn't want to set up an email alert — she wants an in-app notification. Which feature provides this?
- A) Process Builder Email Alert
- B) Chatter Follow + notifications
- C) Salesforce Inbox
- D) Lightning Notification Builder

**Answer:** B — Following a record in Chatter and enabling notifications means the user receives an in-app (and optionally email) notification when that record's feed is updated. When a deal closes and a feed post is made (manually or via automation), followers are notified. This is the standard approach for in-app record change notifications for managers.

---

**Q40 (Productivity):** Which of the following is NOT a standard Activity type in Salesforce?
- A) Task
- B) Event
- C) Log a Call
- D) Meeting Request

**Answer:** D — Salesforce standard Activities are Tasks (to-do items), Events (calendar events with start and end time), and Log a Call (a completed Task with type = Call). "Meeting Request" is not a standard Salesforce Activity type, though meetings can be represented as Events.

---

**Q41 (Productivity):** An admin wants to enable users to see their Salesforce Tasks and Events in their Google Calendar or Outlook Calendar. Which feature enables this integration?
- A) Einstein Activity Capture
- B) Salesforce for Outlook (Legacy)
- C) Lightning Sync or Einstein Activity Capture (depending on edition)
- D) Chatter Calendar Integration

**Answer:** C — Salesforce provides calendar synchronization through Einstein Activity Capture (syncs emails and calendar events) for newer integrations, and previously through Lightning Sync. The specific feature available depends on the Salesforce edition and add-ons. Salesforce for Outlook is the legacy tool being retired.

---

**Q42 (Productivity):** A sales manager wants to share a document with her team and ensure all team members always have access to the latest version. Which Salesforce feature is BEST for this?
- A) Attach the file to a Task record
- B) Salesforce Files (uploaded to a Library or shared in Chatter)
- C) Email the document to all team members
- D) Upload the file to the Account record's Attachments

**Answer:** B — Salesforce Files (formerly known as Content Libraries) allows files to be uploaded, versioned, and shared with groups, users, or records. When a new version is uploaded, all users with access automatically see the latest version. Libraries provide organized, permission-controlled file management.

---

## Section F: Data & Analytics (8 Questions)

**Q43 (Data/Analytics):** A user needs to create a report showing Opportunities grouped by Stage with the total Amount per stage, and feed this report into a bar chart dashboard component. Which report format should she use?
- A) Tabular
- B) Summary
- C) Matrix
- D) Joined

**Answer:** B — A Summary report with Stage as the row grouping and Amount as a SUM summary field produces the grouped subtotals needed. Summary reports (not Tabular) support chart-type dashboard components. Matrix would add unnecessary column groupings.

---

**Q44 (Data/Analytics):** Which statement about Dashboard running users is TRUE?
- A) The running user must be the person who created the dashboard
- B) Dynamic dashboards use the logged-in user as the running user; each viewer sees their own data
- C) All dashboards must have a running user — there is no dashboard without one
- D) The running user determines which FIELDS are visible, but not which RECORDS appear

**Answer:** B — Dynamic dashboards are configured to "run as logged-in user," meaning each person viewing the dashboard sees data based on their own record-level access. The running user determines which RECORDS appear (based on OWD + role hierarchy + sharing rules). Field-level security is always enforced separately regardless of the running user.

---

**Q45 (Data/Analytics):** An admin wants to import 200,000 Contact records from an external system. Some of these Contacts may already exist in Salesforce (from a prior import). The admin wants to avoid creating duplicates. Which tool and operation should be used?
- A) Data Import Wizard with duplicate detection enabled
- B) Data Loader with Insert operation and duplicate rules configured
- C) Data Loader with Upsert operation using an External ID field
- D) Data Import Wizard with Update operation

**Answer:** C — Data Loader Upsert with an External ID is the correct approach: (1) Data Import Wizard cannot import 200,000 records (50,000 limit), (2) Insert would create duplicates, (3) Upsert with External ID automatically inserts new records and updates existing ones based on the External ID match key.

---

**Q46 (Data/Analytics):** A sales director wants a dashboard showing each sales rep's individual pipeline, but the director wants each rep to only see their OWN data when they view the dashboard, not everyone's pipeline. How many dynamic dashboards are needed?
- A) One dashboard per sales rep
- B) One dynamic dashboard for all reps (configured to run as logged-in user)
- C) One static dashboard with a running user set to the highest-access user
- D) Two dashboards: one for reps and one for management

**Answer:** B — Only one dynamic dashboard is needed. When configured to run as the logged-in user, the same dashboard renders each user's own data based on their record-level access. One dynamic dashboard serves all users, each seeing personalized results.

---

**Q47 (Data/Analytics):** Which of the following is a correct statement about custom report types?
- A) They are automatically created for all custom objects
- B) They must be in "Deployed" status before users can see them in the Report Builder
- C) They can include fields from a maximum of 2 objects
- D) They replace standard report types for the same objects

**Answer:** B — Custom report types must be manually changed from "In Development" to "Deployed" status before they appear in the Report Builder for non-admin users. They support up to 4 objects (1 primary + 3 related). Salesforce does NOT automatically create them for custom objects.

---

**Q48 (Data/Analytics):** What is the maximum number of dashboard filters that can be applied to a single dashboard?
- A) 1
- B) 3
- C) 5
- D) 10

**Answer:** B — Dashboards support a maximum of 3 filters. These filters allow viewers to dynamically slice the dashboard data without editing the underlying reports. The dashboard creator defines the available filter options; viewers can then apply different combinations.

---

**Q49 (Data/Analytics):** A Full Sandbox was created on June 1. When is the earliest the admin can refresh this sandbox?
- A) July 1 (30 days)
- B) June 30 (29 days later — minimum refresh interval for Full Sandbox)
- C) June 8 (7 days)
- D) Immediately — Full Sandboxes can be refreshed at any time

**Answer:** B — Full Sandboxes have a minimum refresh interval of 29 days. If created on June 1, the earliest it can be refreshed is June 30 (29 days later). Attempting to refresh before this interval shows an error. Developer and Developer Pro Sandboxes: 1 day. Partial: 5 days.

---

**Q50 (Data/Analytics):** What data does the Data Export feature (in Setup) export, and what does it NOT export?
- A) Exports metadata (page layouts, fields) but NOT data records
- B) Exports data records from all objects but NOT metadata or configuration
- C) Exports both metadata and data records
- D) Only exports data from standard objects, not custom objects

**Answer:** B — Data Export exports data records (from all objects including custom) as CSV files. It does NOT export metadata (page layouts, field definitions, flows, etc.). For metadata, use Change Sets, the Salesforce CLI, or a backup tool. Metadata deployment is handled separately from data.

---

## Section G: Automation (10 Questions)

**Q51 (Automation):** A validation rule on the Opportunity object has the formula: `ISBLANK(CloseDate)`. When does this validation rule trigger an error?
- A) When Close Date has a value
- B) When Close Date is blank (null/empty)
- C) When Close Date is in the past
- D) When Close Date is changed

**Answer:** B — Validation rules trigger an error when the formula evaluates to TRUE. ISBLANK(CloseDate) returns TRUE when Close Date is blank (empty/null). So the rule fires (and blocks the save) whenever Close Date has no value. When Close Date has a value, ISBLANK returns FALSE, and the save proceeds.

---

**Q52 (Automation):** Which workflow rule evaluation option should be used if the automation should fire every time a record is saved AND criteria are met, including if the record was already meeting criteria from the previous save?
- A) Created only
- B) Created, and any time it's edited to subsequently meet criteria
- C) Created, and every time it's edited
- D) Edited only

**Answer:** C — "Created, and every time it's edited" fires on every save operation as long as the criteria are met at the time of save — regardless of whether the criteria were already met before. Option B only fires when the record transitions FROM not-meeting-criteria TO meeting-criteria.

---

**Q53 (Automation):** An admin builds a Record-Triggered Flow on the Opportunity object that should update a field on the related Account when the Opportunity is Closed Won. Should this be a Before-Save or After-Save flow, and why?
- A) Before-Save, because it is more efficient
- B) After-Save, because updating a related object requires DML operations that are not available in Before-Save flows
- C) Before-Save, because the Account update runs before the Opportunity is saved
- D) Either Before-Save or After-Save — both support cross-object updates

**Answer:** B — Before-Save flows can only update fields on the TRIGGERING record itself. Updating a related (parent or child) record requires performing a separate DML operation, which is only available in After-Save flows. Use Before-Save for same-record field updates; After-Save for cross-record or cross-object operations.

---

**Q54 (Automation):** A company uses an approval process for Opportunities with discounts over 15%. When a sales rep submits an Opportunity for approval, the record becomes locked. Which action set causes the record to be locked?
- A) Approval Actions
- B) Initial Submission Actions
- C) Rejection Actions
- D) The record is locked automatically by Salesforce without any configuration

**Answer:** D — When a record enters an approval process, Salesforce automatically locks the record from editing by default. This is the default behavior, not an explicitly configured Initial Submission Action. The admin CAN add an initial submission action to perform additional field updates or send emails, but the lock is automatic. (Note: The lock can be disabled, and a field update can explicitly lock it — but the default is automatic lock.)

---

**Q55 (Automation):** Which of the following automation tools supports the creation of a multi-screen guided wizard experience for end users?
- A) Record-Triggered Flow
- B) Screen Flow
- C) Process Builder
- D) Workflow Rule

**Answer:** B — Screen Flows are the only automation tool that renders an interactive user interface with multiple screens. Record-Triggered Flows, Process Builder, and Workflow Rules all run in the background without any user-facing screens.

---

**Q56 (Automation):** An admin needs automation that: (1) fires when a Lead is created, (2) checks if the Lead source is "Web," (3) if yes, creates a Task and sends an email alert, (4) if no, does nothing. Which tool is MOST appropriate for new configuration (not legacy tools)?
- A) Workflow Rule
- B) Process Builder
- C) Record-Triggered Flow (After-Save)
- D) Approval Process

**Answer:** C — A Record-Triggered Flow (After-Save, trigger: Created) with a Decision element checking Lead Source = "Web" is the modern, recommended approach. It supports all the required actions (Create Task, Send Email Alert via Action element). Workflow Rules and Process Builder are legacy tools; Approval Process requires human approval decisions.

---

**Q57 (Automation):** In which scenario is a time-dependent workflow action AUTOMATICALLY REMOVED from the Time-Based Workflow queue?
- A) When the admin manually deletes it from Setup → Time-Based Workflow
- B) When the record is deleted
- C) When the record is updated so that it no longer meets the workflow rule criteria
- D) Both B and C

**Answer:** D — Time-dependent actions are automatically removed from the queue in both cases: when the record no longer meets the workflow rule criteria (rule re-evaluates and criteria fail), AND when the record is deleted. In both cases, the pending actions are purged. The admin can also manually remove them via the Time-Based Workflow queue in Setup.

---

**Q58 (Automation):** A company needs to route a contract document through three sequential approvals: Legal, Finance, then the CEO. Each approver must approve before the record moves to the next approver. Which Approval Process configuration achieves this?
- A) A single approval step with a queue containing all three approvers, set to "Unanimous"
- B) Three sequential approval steps, each assigned to the relevant approver/role
- C) Three parallel approval steps running simultaneously
- D) One approval step with "First Response" routing to a combined queue

**Answer:** B — Three sequential approval steps is the correct approach. Sequential means Step 1 (Legal) must approve before Step 2 (Finance) is activated, and Step 2 must approve before Step 3 (CEO) is activated. Each step routes to the designated approver.

---

**Q59 (Automation):** Which statement about Salesforce Flow is TRUE regarding the difference between Schedule-Triggered Flows and Record-Triggered Flows?
- A) Schedule-Triggered Flows fire immediately when a record is created; Record-Triggered Flows run on a schedule
- B) Schedule-Triggered Flows process batches of records at a defined schedule; Record-Triggered Flows fire when individual records are created, updated, or deleted
- C) Both types require the record to meet entry criteria defined on the Start element
- D) Schedule-Triggered Flows can display screens to users; Record-Triggered Flows cannot

**Answer:** B — Schedule-Triggered Flows run on a defined schedule (e.g., daily at 9 AM) and process a batch of records meeting filter criteria. Record-Triggered Flows fire in real-time when individual records are created, updated, or deleted. Both have entry conditions, but they serve fundamentally different use cases (batch time-based vs. real-time event-based).

---

**Q60 (Automation):** ISCHANGED() is a Salesforce formula function. In which contexts can ISCHANGED() be used?
- A) In validation rule formulas only
- B) In validation rule formulas AND workflow rule criteria formulas
- C) In all formula fields, validation rules, workflow rules, and flows
- D) Only in Apex code triggers

**Answer:** B — ISCHANGED() can be used in validation rule formulas and workflow rule criteria formulas. It CANNOT be used in standard formula fields (which are calculated every time and have no concept of "previous value"). In Flows, you use a Get Records element to compare old and new values rather than using ISCHANGED directly.

---

## Score Sheet

| Section | Questions | Points Available | Your Score |
|---------|-----------|-----------------|------------|
| A: Config & Setup | Q1–Q12 | 12 | /12 |
| B: Objects & App Builder | Q13–Q24 | 12 | /12 |
| C: Sales & Marketing | Q25–Q31 | 7 | /7 |
| D: Service & Support | Q32–Q38 | 7 | /7 |
| E: Productivity & Collaboration | Q39–Q42 | 4 | /4 |
| F: Data & Analytics | Q43–Q50 | 8 | /8 |
| G: Automation | Q51–Q60 | 10 | /10 |
| **TOTAL** | | **60** | **/60** |

**Passing threshold:** 39/60 (65%) — Aim for 45+ (75%) for comfortable passing margin.

> **Review Strategy:** For any incorrect answers, return to the corresponding lecture section and re-read the relevant slides. Pay special attention to questions you got right by guessing — understanding the "why" is as important as getting the right answer.
