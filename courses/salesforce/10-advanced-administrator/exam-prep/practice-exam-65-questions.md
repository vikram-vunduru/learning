# Salesforce Advanced Administrator (CRT-211) — Practice Exam
## 50 Scenario-Based Questions

---

## DOMAIN 1: Security & Access (10 Questions)

---

**Question 1**
Your org has Account OWD set to Private. A Sales Rep owns an Account. Their manager (via role hierarchy) can see it, but a peer Sales Rep in a different region also needs read access. What is the MOST appropriate mechanism?

A. Change Account OWD to Public Read Only
B. Create a criteria-based sharing rule to share Accounts with the peer's role
C. Assign the peer a permission set with "View All" on Accounts
D. Manually share the record using the Sharing button

**Answer: B**
**Explanation:** Criteria-based sharing rules allow you to extend access to specific records based on field criteria without opening access to all records. Changing OWD to Public Read Only would grant every user read access, violating the principle of least privilege.

**Why the others are wrong:**
- A: OWD is the floor — changing it to Public Read Only opens every Account to every user, which is broader than required
- C: "View All" on Accounts grants access to every Account in the org, not just the specific ones needed
- D: Manual sharing works but is not scalable or repeatable; a sharing rule is the proper administrative solution

---

**Question 2**
A user can see an Opportunity record even though their role is not in the Account's role hierarchy and no sharing rule grants access. OWD for Opportunity is Private. What is the MOST likely explanation?

A. The user has the "View All Data" system permission
B. The user is a member of a public group that has a sharing rule on Opportunities
C. The user owns the Opportunity record directly
D. Opportunity visibility always follows Account visibility

**Answer: C**
**Explanation:** Record owners always have access to their own records regardless of OWD settings — OWD controls access for users who do not own the record. Ownership is the most common overlooked reason a user can see a Private record.

**Why the others are wrong:**
- A: "View All Data" would explain access but is an admin-level permission unlikely to be assigned to a regular user
- B: This would also explain access, but direct ownership is the simpler and more likely cause
- D: Opportunity visibility does not automatically follow Account visibility; they are governed by separate OWD settings

---

**Question 3**
Your org uses Territory Management. An Account is assigned to two territories. A Sales Rep in Territory A and a Sales Rep in Territory B both need to see the Account. Which statement is TRUE?

A. Only the rep in the primary territory can see the Account
B. Both reps gain access because account assignment to a territory grants access to all members of that territory
C. You must create a sharing rule to grant the second rep access
D. The Account OWD must be set to Public Read Only for both reps to see it

**Answer: B**
**Explanation:** When an Account is assigned to a territory, all active users assigned to that territory gain at least read access per the territory's configured access level. Assigning the Account to both territories grants both sets of reps access automatically.

**Why the others are wrong:**
- A: Territory Management does not designate a single "primary" territory for access purposes
- C: Sharing rules are not needed when territory assignment already grants the access
- D: OWD is the floor but territory assignment extends access above the floor without changing OWD

---

**Question 4**
A Profile gives a user Read/Edit on the Contact object. A Permission Set assigned to the same user grants Read-only on Contact. What is the effective access level?

A. Read-only, because the Permission Set is more restrictive
B. Read/Edit, because Permission Sets can only add permissions, not remove them
C. It depends on which was assigned most recently
D. The user loses all access until the conflict is resolved by an admin

**Answer: B**
**Explanation:** Permission Sets are strictly additive — they can grant permissions that the Profile does not have, but they cannot remove permissions already granted by the Profile. The Profile's Read/Edit access stands; the Permission Set adds nothing new here.

**Why the others are wrong:**
- A: This reverses how Salesforce permission layering works; Permission Sets never reduce Profile-granted permissions
- C: Assignment order has no bearing on permission evaluation
- D: There is no conflict state in Salesforce permission logic; the union of Profile + all Permission Sets is always the effective access

---

**Question 5**
Your company needs field-level security so that the "Annual Salary" field on a custom Employee object is visible ONLY to HR Managers, not to all users with the HR profile. What is the correct approach?

A. Set the field to hidden on the HR Profile, then use a Sharing Rule
B. Remove the field from the HR Profile, then grant access via a Permission Set assigned only to HR Managers
C. Use a Validation Rule to block non-managers from saving changes to the field
D. Set the field to Required on the HR Profile so only HR managers know it exists

**Answer: B**
**Explanation:** Field-Level Security is controlled at the Profile and Permission Set level. Removing visibility from the Profile and re-granting it via a Permission Set that is only assigned to the HR Manager subset allows precise control within the same Profile.

**Why the others are wrong:**
- A: Sharing Rules control record access, not field-level visibility
- C: Validation Rules prevent saves but do not hide the field from users who can view the record
- D: Making a field required does not restrict who can see it; it only enforces that it must be populated

---

**Question 6**
OWD for Case is set to Private. A support manager needs to run reports on all Cases owned by their entire team of 10 agents. What grants this access WITHOUT changing OWD?

A. Grant the manager "Modify All" on Cases via their Profile
B. Place the manager's role above the agents' roles in the Role Hierarchy
C. Create a criteria-based sharing rule sharing all Cases with the manager's role
D. Enable the "Report on All Cases" custom permission

**Answer: B**
**Explanation:** The Role Hierarchy automatically grants visibility upward — a manager whose role is above agent roles in the hierarchy can see all records owned by subordinate users. This is the intended mechanism for manager-level reporting access.

**Why the others are wrong:**
- A: "Modify All" grants full edit and delete access to every Case in the org, which is far broader than needed
- C: A sharing rule would also work but is redundant when the Role Hierarchy already provides the access; it also adds maintenance overhead
- D: "Report on All Cases" is not a standard Salesforce permission; this option is fabricated

---

**Question 7**
An admin needs to share a specific set of Accounts that meet a field criteria with an external partner community user. The community user is NOT in the internal role hierarchy. What feature should the admin use?

A. Owner-based sharing rules targeting a public group containing the community user
B. Criteria-based sharing rules targeting a portal role or public group that includes the community user
C. Manual sharing from each Account record
D. Territory Management with the community user assigned to a territory

**Answer: B**
**Explanation:** Criteria-based sharing rules can target portal roles and portal role + subordinates, or public groups that include community users, making them the scalable solution for sharing filtered sets of records with external users.

**Why the others are wrong:**
- A: Owner-based sharing rules share records owned by specific users/roles — they target the owner, not the recipient, and community users may not be record owners
- C: Manual sharing is not scalable for a criteria-driven requirement
- D: Territory Management is for Sales territory assignment and is not designed for partner community access control

---

**Question 8**
A field on a custom object is set to "Read-Only" at the Profile level. A Before Save record-triggered Flow attempts to update that field value via an Update Records element targeting the triggering record. What happens?

A. The Flow fails with a field-level security error
B. The Flow successfully updates the field because Flows run in system context and bypass FLS
C. The Flow updates the field only if the running user has edit access
D. The field is updated only on the first run; subsequent runs are blocked

**Answer: B**
**Explanation:** Record-triggered Flows run in system context (unless configured with "Run as" user context in specific scenarios), which means they bypass Field-Level Security and can update fields that the triggering user cannot directly edit. This is a common gotcha in security reviews.

**Why the others are wrong:**
- A: Flows do not throw FLS errors when running in system context — the FLS restriction applies to the user's direct input, not automation
- C: The running user's FLS access does not constrain system-context Flow operations
- D: There is no "first run" exception; the behavior is consistent across all invocations

---

**Question 9**
Your org has three profiles: Sales, Support, and Admin. The Support profile must NOT see the "Revenue" field on Opportunity. Currently "Revenue" is visible on the Support profile. What is the QUICKEST correct fix?

A. Delete the Revenue field from the Opportunity object
B. Set the Revenue field to "Hidden" under the Support Profile's Field-Level Security settings
C. Create a Validation Rule to blank out Revenue when a Support user saves the record
D. Remove the Support profile from the Opportunity Page Layout

**Answer: B**
**Explanation:** Field-Level Security on the Profile directly controls whether users with that profile can see or edit a field. Setting it to Hidden on the Support profile immediately prevents those users from seeing the field in any context — lists, reports, or record detail.

**Why the others are wrong:**
- A: Deleting the field removes it for ALL profiles, including Sales and Admin who need it
- C: Validation Rules fire on save and do not hide the field from read access
- D: Removing a field from a page layout hides it on that layout, but the field is still visible in list views, reports, and via the API

---

**Question 10**
A company has 500 users split across 20 roles. They want to ensure that when a user is transferred to a new role, any manually shared records they received in their old role are automatically revoked. Which statement is TRUE?

A. Salesforce automatically revokes manual shares when a user changes roles
B. Manual shares persist after a role change; an admin must manually remove them
C. Manual shares are automatically recalculated when OWD is updated
D. You can configure manual share recalculation in Setup under Sharing Settings

**Answer: B**
**Explanation:** Manual shares (created via the Sharing button or Apex ManualShare) persist until explicitly removed — they are not recalculated when a user's role, profile, or territory changes. Admins or automated processes must remove stale manual shares.

**Why the others are wrong:**
- A: Role changes do not trigger removal of manual shares — only sharing rules tied to roles are recalculated
- C: OWD updates trigger recalculation of sharing rules and role-hierarchy-based access, not manually created shares
- D: No such configuration option exists in standard Salesforce Sharing Settings

---

## DOMAIN 2: Process Automation (8 Questions)

---

**Question 11**
A record-triggered Flow on Opportunity fires before save. It needs to send an email alert to the Account Owner when the Opportunity Stage changes to "Closed Won." Can this be done in a Before Save flow?

A. Yes — Before Save flows can invoke email alerts via the Send Email core action
B. No — Before Save flows cannot perform any actions that interact with external systems or send emails; use After Save
C. Yes — Before Save flows can call Apex classes that send emails
D. No — email alerts require Process Builder, not Flow

**Answer: B**
**Explanation:** Before Save flows are restricted to updating fields on the triggering record only. They cannot send emails, call Apex, invoke subflows that perform DML, or interact with external services. These actions require an After Save flow.

**Why the others are wrong:**
- A: The Send Email core action is not available in Before Save flows
- C: Invoking Apex (via Apex actions) is also not supported in Before Save flows
- D: Process Builder is deprecated; After Save Flow is the correct modern replacement

---

**Question 12**
An After Save record-triggered Flow creates a Task whenever a Case is closed. In testing, the Flow intermittently fails and the Task is not created, but no error is shown to the user. What should the admin add to investigate and handle these failures?

A. A Before Save flow to validate the Case fields before closure
B. A fault path on the Create Records element that creates a log record or sends an email to the admin
C. A try-catch block in the Flow
D. An Apex trigger to replace the Flow

**Answer: B**
**Explanation:** After Save flows run asynchronously in some contexts and errors can be swallowed. Adding a fault path to the failing element (Create Records) routes execution to an error-handling path where you can log the error, send an alert, or create a fallback record. This is the standard pattern for Flow fault handling.

**Why the others are wrong:**
- A: A Before Save flow validates fields but cannot fix or log errors that occur in a separate After Save flow
- C: Flows do not have try-catch syntax; fault paths are the Flow equivalent of exception handling
- D: Replacing a Flow with Apex is unnecessary — fault paths are specifically designed for this scenario

---

**Question 13**
An approval process on a Contract record requires two sequential approvers. The first approver rejects the submission. What happens to the record by default?

A. The record is recalled and status is set to the value defined in the "Rejection Actions"
B. The record is deleted
C. The second approver is notified to make the final decision
D. The record is locked and cannot be edited until an admin unlocks it

**Answer: A**
**Explanation:** When a record is rejected at any step in an approval process, the rejection actions defined for that step execute — typically including a field update to reset the record's status and optionally an email notification. Rejection at step 1 ends the approval process immediately.

**Why the others are wrong:**
- B: Approval process rejection never deletes a record
- C: Sequential approvals mean rejection at step 1 ends the process; step 2 is not reached
- D: Records are locked DURING an approval process while pending; rejection releases the lock and executes rejection actions

---

**Question 14**
A Before Save flow on Account checks a field condition and should update the Account's "Last Reviewed Date" to today's date. The flow is also the fastest approach. What element performs this update?

A. Update Records element targeting the triggering record
B. Assignment element that sets the $Record.Last_Reviewed_Date field variable, with no Update Records element needed
C. Create Records element for a new Account
D. After Save is required — Before Save cannot update date fields

**Answer: B**
**Explanation:** In Before Save flows, the record has not yet been written to the database. You update it by assigning values to $Record fields directly using Assignment elements — no Update Records DML element is needed or allowed for the triggering record. The assigned values are committed when the record saves.

**Why the others are wrong:**
- A: An Update Records element in a Before Save flow targeting the triggering record causes a recursive save error; use Assignment instead
- C: Create Records creates new records, not updates the triggering record
- D: Before Save flows can absolutely update fields on the triggering record — that is their primary purpose

---

**Question 15**
A scheduled-triggered Flow runs nightly to update an "Overdue" checkbox on all open Opportunities past their Close Date. The org has 50,000 open Opportunities. What Salesforce limit is MOST likely to be a concern?

A. The 5-minute Flow execution time limit
B. The total number of records processed per scheduled transaction (governor limits on DML rows)
C. The maximum number of Flow versions allowed
D. The 24-hour delay limit for scheduled flows

**Answer: B**
**Explanation:** Scheduled-triggered flows process records in batches and are subject to Apex governor limits including the 10,000 DML rows per transaction limit. Processing 50,000 records requires the flow to be carefully designed or replaced with a batch Apex process if limits are hit.

**Why the others are wrong:**
- A: There is no 5-minute execution limit on scheduled flows; they process in batches asynchronously
- C: The number of Flow versions is a versioning concept, not a runtime governor limit
- D: Scheduled flows run at the administrator-configured time; there is no inherent 24-hour delay limit

---

**Question 16**
An admin wants to build an approval process where the approver is the Account Executive field on the Opportunity (a Lookup to User), not a static user or role. What feature enables this?

A. Dynamic approval routing using the "Automatically assign to approver field" option
B. A Flow that runs after approval submission to reassign the approver
C. A formula field that resolves the approver — approval processes cannot use Lookup fields directly
D. Delegated approver configuration on each user's record

**Answer: A**
**Explanation:** Approval processes support "Automatically assign to approver" using a user field on the record (such as a Lookup to User). This enables dynamic routing where the approver changes based on the record's data, without hardcoding a user or role.

**Why the others are wrong:**
- B: Using a Flow to reassign is a workaround; the native approval process feature handles this directly
- C: Approval processes can directly reference User Lookup fields on the record — no formula workaround is needed
- D: Delegated approvers are alternate approvers for a specific user's assignments, not a dynamic routing mechanism

---

**Question 17**
A record-triggered After Save Flow on Opportunity calls an Apex action that makes a callout to an external REST API. In testing, the callout fails with a "You have uncommitted work pending" error. What is the cause?

A. The Apex class is not properly invocable
B. Callouts cannot be made after DML operations in the same transaction; the Flow's record save constitutes uncommitted DML
C. The external API does not support Salesforce callouts
D. After Save flows do not support Apex actions

**Answer: B**
**Explanation:** Salesforce prohibits making callouts after DML in the same transaction to ensure data consistency. An After Save flow fires after the record save (DML), so any synchronous callout in the same transaction hits this restriction. The solution is to use a Queueable or Future Apex class that performs the callout asynchronously.

**Why the others are wrong:**
- A: Invocable method correctness is a different issue; the error message clearly indicates a transaction boundary problem
- C: API compatibility is unrelated to this Salesforce-side transaction error
- D: After Save flows fully support Apex actions — the restriction is on synchronous callouts post-DML, not the flow type

---

**Question 18**
An approval process has a "Final Approval Action" configured to lock the record. A user submits a record for approval and then immediately tries to edit a non-approval-controlled field. What behavior occurs?

A. The record is fully locked immediately upon submission and the user cannot edit any field
B. The record remains editable until all approvers have approved; locking only occurs at final approval
C. The record is locked during the approval process to all users except the current approver and admins
D. Locking only applies to the specific fields designated in the approval process criteria

**Answer: C**
**Explanation:** When a record enters an approval process, it is locked by default to prevent edits during the review — only the current approver and administrators can edit it. Final Approval Actions run after all steps are complete, but the lock during processing is a separate behavior controlled in the approval process settings.

**Why the others are wrong:**
- A: Records are locked to regular users during the process but the current approver retains edit access
- B: Locking occurs upon submission into the approval process, not only at final approval
- D: Record locking in approval processes is all-or-nothing at the record level, not field-by-field

---

## DOMAIN 3: Sales Cloud (5 Questions)

---

**Question 19**
A Sales Manager wants to see a forecast that shows only their direct reports' individual quotas and pipeline, not rolled-up numbers from the entire region. Which Salesforce Forecasting feature supports this?

A. Collaborative Forecasting with a custom forecast hierarchy that excludes upper management
B. The Manager role in Collaborative Forecasting automatically rolls up subordinates; there is no way to show only direct reports
C. Territory Forecasts, which scope by territory assignment rather than role
D. Customizable Forecasting with a flat forecast hierarchy

**Answer: A**
**Explanation:** Collaborative Forecasting uses a forecast hierarchy that can be configured to match the role hierarchy. A manager sees their direct reports' individual forecast rows and can drill into each rep's forecast. The hierarchy configuration determines the scope of what rolls up.

**Why the others are wrong:**
- B: Managers can indeed view individual direct report forecasts — the rolled-up view is an additional view, not the only one
- C: Territory Forecasts aggregate by territory, not by manager-direct-report relationships
- D: Customizable Forecasting is a legacy feature and is not the recommended approach in current Salesforce

---

**Question 20**
A Sales Rep generates a Quote from an Opportunity and syncs it. They then edit the Opportunity's line items directly. What happens to the synced Quote?

A. The Quote automatically updates to reflect the Opportunity line item changes
B. Salesforce prevents editing Opportunity line items when a Quote is synced; the rep must edit via the Quote
C. The Quote and Opportunity become out of sync and both show different data permanently
D. The Quote is automatically unsynced before the Opportunity line items can be edited

**Answer: B**
**Explanation:** When a Quote is synced with an Opportunity, the Opportunity's products (line items) are locked and can only be edited through the synced Quote. This ensures the Quote and Opportunity stay consistent. The sync must be stopped before Opportunity line items can be edited directly.

**Why the others are wrong:**
- A: Changes to Opportunity line items flow from the synced Quote to the Opportunity, not the reverse — and direct editing is blocked
- C: Salesforce enforces sync consistency; it does not allow a state where both diverge silently
- D: Salesforce blocks the edit rather than automatically unsyncing — the user must explicitly stop the sync

---

**Question 21**
A company uses Enterprise Territory Management. They want a specific Account to be assigned to multiple territories but with different access levels per territory (e.g., read-only in Territory A, read/edit in Territory B). Is this possible?

A. Yes — each territory assignment on an Account can have its own access level configured
B. No — all territory assignments on an Account share the same access level defined at the territory model level
C. Yes — but only if Territory Management is combined with Sharing Rules for each territory
D. No — only one territory can grant edit access; all others are read-only

**Answer: A**
**Explanation:** Enterprise Territory Management allows you to configure access levels (View, Edit, All) per Account territory assignment individually. When you assign an Account to a territory, the assignment record itself specifies the access level, allowing different levels per territory for the same Account.

**Why the others are wrong:**
- B: Access levels are set per assignment record, not at a global territory model level
- C: Sharing Rules are not needed since territory assignment access level settings handle differentiated access
- D: There is no restriction to a single "edit" territory; multiple territories can grant edit access

---

**Question 22**
Which standard Opportunity forecast category represents deals that the rep is highly confident about but are NOT yet closed?

A. Pipeline
B. Best Case
C. Commit
D. Closed

**Answer: C**
**Explanation:** The "Commit" forecast category represents Opportunities the rep is highly confident will close in the period — they are committed to the number. This is distinct from "Best Case" which is less certain and "Closed" which represents already-won deals.

**Why the others are wrong:**
- A: Pipeline includes all open deals regardless of confidence level
- B: Best Case represents deals the rep thinks might close but is not fully committed to
- D: Closed represents deals already won or lost — they are no longer "not yet closed"

---

**Question 23**
A company wants to prevent Sales Reps from editing the "Discount %" field on a Quote Line Item once the Quote is in "Approved" status. What is the BEST approach?

A. Remove the "Discount %" field from the Quote Line Item page layout for Approved quotes
B. Use a Validation Rule on the Quote Line Item that fires when the parent Quote Status equals "Approved"
C. Lock the entire Quote record using the approval process final approval action
D. Use Field-Level Security to make the field read-only for the Sales Rep profile

**Answer: C**
**Explanation:** Using the approval process to lock the Quote record upon final approval prevents any user (except admins) from editing any field on the record, including line items. This is the cleanest and most enforceable approach tied directly to the approval outcome.

**Why the others are wrong:**
- A: Removing a field from a page layout does not prevent API or list-view edits
- B: A Validation Rule works but requires a cross-object formula check and fires on every save attempt — record locking via the approval process is cleaner
- D: FLS makes the field read-only for all records for that profile, including quotes that are in draft status and should be editable

---

## DOMAIN 4: Service Cloud (5 Questions)

---

**Question 24**
A Service Manager wants Cases to be automatically escalated to a senior agent if they remain open for more than 4 hours. Which feature should be configured?

A. Entitlement Process with a milestone action triggered at 4 hours
B. Case Assignment Rules with a time-based condition
C. Escalation Rules with a time-based escalation action
D. A scheduled-triggered Flow that runs every hour

**Answer: C**
**Explanation:** Escalation Rules are designed specifically to escalate Cases based on time elapsed since creation or since the case was last modified. An escalation action at 4 hours can reassign the case or send a notification to senior agents.

**Why the others are wrong:**
- A: Entitlement milestones track SLA compliance for customer-facing commitments, not internal escalation to senior agents
- B: Case Assignment Rules determine initial routing; they do not support time-based re-routing
- D: A scheduled Flow would work technically but is not the purpose-built feature — Escalation Rules are the correct and simpler solution

---

**Question 25**
An Entitlement Process has a milestone "First Response" with a 2-hour completion target. The milestone is violated (not completed within 2 hours). What happens by DEFAULT if no violation actions are configured?

A. The Case is automatically closed
B. Nothing additional happens — violation actions must be explicitly configured to trigger any behavior
C. The entitlement process stops tracking the Case
D. An email is automatically sent to the Case owner

**Answer: B**
**Explanation:** Milestone violation actions (and warning actions) must be explicitly configured — they are not automatic. If no violation actions are defined, breaching the milestone simply marks it as violated in the UI, but no automated notification or reassignment occurs.

**Why the others are wrong:**
- A: Cases are never automatically closed by a milestone violation
- C: The entitlement process continues tracking subsequent milestones even after one is violated
- D: Email notifications on violation are configured in the violation actions — without configuration, no email is sent

---

**Question 26**
A Knowledge Article needs to be visible to authenticated community users but NOT to the general public (guest users). How should this be controlled?

A. Use Article Visibility settings on the Data Category to restrict to internal users only, then share with community via a permission set
B. Set the article's "Channel" to "Customer" (not "Public Knowledge Base") in the article's visibility settings
C. Apply a sharing rule that grants community user profiles access to Knowledge Article records
D. Use a validation rule that prevents guest user profiles from viewing Knowledge records

**Answer: B**
**Explanation:** Salesforce Knowledge articles have a Channels setting that controls where an article appears — Internal App, Customer, Partner, or Public Knowledge Base. Setting Channel to "Customer" (but not "Public Knowledge Base") makes articles visible to authenticated community users but not to guest (unauthenticated) users.

**Why the others are wrong:**
- A: Data Categories control article organization and can limit visibility by category, but Channel is the primary mechanism for authenticated vs. guest access
- C: Knowledge Articles use a separate channel-and-category visibility model, not standard record sharing rules
- D: Validation rules fire on record saves, not on record reads — they cannot restrict viewing access

---

**Question 27**
Omni-Channel is configured with a routing model of "Least Active." An agent has 2 open Chat sessions. A second agent is available with 0 open sessions. A new Chat comes in. How is it routed?

A. To the first agent because they already have open chats and have proven availability
B. To the second agent because Least Active routes to the agent with the fewest active work items
C. To a queue and not assigned until an agent manually accepts
D. To the agent with the highest capacity configuration, regardless of current load

**Answer: B**
**Explanation:** The "Least Active" routing model assigns incoming work to the agent who currently has the fewest open work items (active conversations, cases, etc.), ensuring workload is distributed evenly. The second agent with 0 sessions receives the next chat.

**Why the others are wrong:**
- A: "Least Active" prioritizes agents with the lowest load, not those already handling work
- C: Least Active routing is automatic; the agent does not need to manually accept (though acceptance behavior can be configured separately)
- D: "Most Available" is the routing model based on capacity configuration, not "Least Active"

---

**Question 28**
A company wants to guarantee that their top-tier customers always receive a response within 1 hour, while standard customers get 4 hours. Both SLAs must be tracked per Case. What is the CORRECT configuration?

A. Create two Case Assignment Rules with different time thresholds
B. Create two Entitlement Processes with different milestone time targets, and assign the correct process via the Entitlement record on each Case
C. Create two Escalation Rules with 1-hour and 4-hour escalation times
D. Use two separate Service Level Agreement custom objects with lookup to Case

**Answer: B**
**Explanation:** Entitlement Processes are the Salesforce feature designed for tracking customer SLAs. Each process can have different milestone targets. Assigning the appropriate entitlement (which references the correct process) to a Case determines which SLA applies to that case.

**Why the others are wrong:**
- A: Case Assignment Rules route cases to queues/users but do not track SLA compliance or response time targets
- C: Escalation Rules trigger internal escalations but do not provide customer-facing SLA tracking or milestone completion tracking
- D: A custom object approach is an unnecessary build-from-scratch solution when Entitlement Processes are purpose-built for this

---

## DOMAIN 5: Data Management (5 Questions)

---

**Question 29**
An admin wants to prevent duplicate Contacts from being created in the Salesforce UI but still allow them to be inserted via the API (for a data migration). What configuration achieves this?

A. Set the Duplicate Rule action to "Block" and check "Enforce on API"
B. Set the Duplicate Rule action to "Allow with Alert" and uncheck "Enforce on API"
C. Set the Duplicate Rule action to "Block" and leave "Enforce on API" unchecked
D. Disable the Duplicate Rule during the migration window and re-enable it after

**Answer: C**
**Explanation:** Duplicate Rules have an "Enforce on API" option. When set to "Block" with this option unchecked, the rule prevents duplicates through the UI but allows duplicate inserts via the API, Data Loader, or other integration tools — exactly what a migration scenario requires.

**Why the others are wrong:**
- A: Checking "Enforce on API" with "Block" would prevent the data migration inserts via API
- B: "Allow with Alert" only warns users; it does not block duplicates in the UI, which is the stated requirement
- D: Disabling the rule completely during migration works but is a less precise approach and leaves the UI unprotected

---

**Question 30**
A Matching Rule uses "Exact" match on the Email field and "Fuzzy" match on the Last Name field. Two records exist: email=john@acme.com / LastName=Smith, and email=john@acme.com / LastName=Smyth. Will these be flagged as duplicates?

A. Yes — exact match on Email is sufficient to flag them as potential duplicates
B. No — both Email AND Last Name must match; Smyth vs. Smith fails the fuzzy threshold
C. It depends on the fuzzy match threshold configured for the Last Name field
D. Matching Rules only use one field at a time; multi-field rules are not supported

**Answer: C**
**Explanation:** Fuzzy match algorithms (like Edit Distance or Jaro-Winkler) have configurable similarity thresholds. Whether Smyth matches Smith depends on the threshold set — at a low threshold they may match; at a high threshold they may not. The exact Email match alone is not sufficient if the rule requires both fields to match.

**Why the others are wrong:**
- A: The Matching Rule requires the full condition (Email AND Last Name) to be satisfied — a single field match is not enough in a compound rule
- B: The question asks whether they WILL be flagged — the answer depends on the fuzzy threshold, making "no" too absolute
- D: Multi-field Matching Rules are fully supported and are the standard configuration

---

**Question 31**
Which scenario requires Data Loader instead of the Data Import Wizard?

A. Importing 2,000 Contacts with a CSV file
B. Importing 60,000 Account records from an external system
C. Updating the Status field on 500 Leads
D. Deduplicating existing Contact records

**Answer: B**
**Explanation:** The Data Import Wizard supports a maximum of 50,000 records per import. For 60,000 Account records, Data Loader is required as it can handle millions of records and does not have the 50,000 record limit.

**Why the others are wrong:**
- A: 2,000 Contacts is well within the Data Import Wizard's 50,000 record limit
- C: 500 Leads is also within the Data Import Wizard's limits — either tool would work but the Wizard is sufficient
- D: Deduplicating records is handled by Duplicate Rules and Matching Rules, not primarily by Data Loader or Import Wizard

---

**Question 32**
An admin uses Data Loader to hard delete 10,000 records. What is the key difference between a hard delete and a standard delete in Data Loader?

A. Hard delete bypasses the Recycle Bin and permanently removes records immediately
B. Hard delete requires a separate permission and moves records to a special admin-only Recycle Bin
C. Hard delete is slower because it also removes all child records via cascade delete
D. Hard delete is only available for custom objects, not standard objects

**Answer: A**
**Explanation:** Data Loader's hard delete operation bypasses the Recycle Bin entirely, permanently deleting records. A standard delete in Data Loader sends records to the Recycle Bin where they can be restored within 15 days. Hard delete requires the "Bulk API Hard Delete" permission.

**Why the others are wrong:**
- B: Hard-deleted records do not go to any Recycle Bin — they are permanently and immediately removed
- C: Hard delete does not cascade to child records differently than a standard delete; cascade behavior depends on the lookup field's deletion settings
- D: Hard delete is available for both standard and custom object records via Data Loader

---

**Question 33**
A company is migrating 200,000 Opportunities from a legacy system. Several Opportunities reference Accounts that do not yet exist in Salesforce. What is the CORRECT data loading sequence?

A. Load Opportunities first, then Accounts — Salesforce auto-creates missing parent records
B. Load Accounts first, then Opportunities — parent records must exist before child records can reference them
C. Load both simultaneously using the Data Loader's parallel processing feature
D. Load Opportunities with null AccountId values, then update with Account IDs in a second pass

**Answer: B**
**Explanation:** Salesforce requires that parent records exist before child records that reference them via lookup or master-detail fields can be successfully loaded. Attempting to load Opportunities with references to non-existent Accounts results in errors.

**Why the others are wrong:**
- A: Salesforce does not auto-create missing parent records during a data load — missing references result in load errors
- C: Data Loader does not have a parallel processing feature that auto-resolves parent-child dependencies
- D: Loading with null AccountId and updating later is technically possible but results in incomplete data in the interim and is not a best practice for a migration

---

## DOMAIN 6: Reports & Dashboards (4 Questions)

---

**Question 34**
A manager wants a single report that shows Opportunities grouped by Stage in one section AND a separate section showing Cases grouped by Priority for the same Account. Which report type supports this?

A. Summary Report with a cross-object formula field
B. Matrix Report with a second grouping dimension
C. Joined Report with two report blocks
D. Dashboard component using a combined data source

**Answer: C**
**Explanation:** Joined Reports allow you to combine multiple report blocks within a single report, where each block can use a different report type and have its own groupings and filters. This is the only standard report type that can show Opportunities and Cases side-by-side.

**Why the others are wrong:**
- A: A Summary Report uses a single object type per report; it cannot show Cases in a separate section
- B: A Matrix Report organizes rows and columns from a single data set; it cannot span multiple objects in separate blocks
- D: A dashboard component displays data from a single source report — it cannot combine disparate data sets in one component

---

**Question 35**
A Joined Report has three blocks. An admin wants to add a summary formula that calculates a value ACROSS all three blocks. What is a key limitation to know?

A. Cross-block summary formulas are not supported; each block can only reference its own fields
B. Cross-block formulas are supported but can only reference numeric fields
C. Cross-block summary formulas in Joined Reports can reference summary values (totals/subtotals) from other blocks using block-specific formula syntax
D. Cross-block formulas require all blocks to share the same primary grouping field

**Answer: C**
**Explanation:** Joined Reports do support cross-block summary formulas, but they reference summary-level values (totals or subtotals) from other blocks, not individual row-level field values. The formula syntax uses block-specific prefixes to reference aggregated values from different blocks.

**Why the others are wrong:**
- A: Cross-block formulas ARE supported in Joined Reports — this is a key advanced feature of the Joined Report type
- B: The limitation is not that only numeric fields are allowed, but that you must reference aggregated summary values, not row-level fields
- D: Blocks in a Joined Report can have different groupings; they do not need to share the same primary grouping

---

**Question 36**
A Dynamic Dashboard is configured with "Run as logged-in user." A VP of Sales with "View All Data" logs in and views the dashboard. A Sales Rep logs in and views the same dashboard. What is the difference in what they see?

A. Both see the same data because Dynamic Dashboards always use a fixed running user
B. The VP sees data across all records they can access; the Sales Rep sees only records within their visibility
C. The Sales Rep sees a blank dashboard because they lack the "View Dynamic Dashboards" permission
D. Dynamic Dashboards only work for users with at least Manager-level roles

**Answer: B**
**Explanation:** Dynamic Dashboards configured to "Run as logged-in user" render data based on each viewer's own data access. The VP sees data governed by their broad permissions; the Sales Rep sees only records within their role-hierarchy and sharing access. This is the core purpose of Dynamic Dashboards.

**Why the others are wrong:**
- A: Standard (non-dynamic) dashboards use a fixed running user; Dynamic Dashboards are the opposite — they adapt per viewer
- C: There is no "View Dynamic Dashboards" permission that blocks access; the running-user context controls data, not a special permission
- D: Dynamic Dashboards are available to any user who has access to the dashboard folder — no role level restriction exists

---

**Question 37**
An admin needs a report showing the Account Name on an Opportunity report. Account Name is NOT a direct field on Opportunity — it comes from the related Account. What makes this possible WITHOUT a custom field?

A. A cross-object formula field on Opportunity that references Account.Name
B. The standard Opportunity report type already includes Account Name as a related field
C. A lookup filter on the Opportunity-Account relationship
D. A custom report type with Account as a secondary object

**Answer: B**
**Explanation:** The standard "Opportunities" report type in Salesforce already includes fields from the related Account object (like Account Name) as available columns. No custom field or formula is required — this is built into the standard report type's field layout.

**Why the others are wrong:**
- A: A cross-object formula would duplicate functionality already available in the standard report type and adds unnecessary object complexity
- C: Lookup filters control which records can be selected in a lookup field; they do not expose fields in reports
- D: A custom report type is not needed since the standard Opportunities type already exposes related Account fields

---

## DOMAIN 7: Auditing (3 Questions)

---

**Question 38**
An admin needs to determine whether a specific custom field was deleted from an object, and by whom, over the past 30 days. Which audit tool provides this information?

A. Login History
B. Field History Tracking on the affected field
C. Setup Audit Trail
D. Debug Logs

**Answer: C**
**Explanation:** The Setup Audit Trail records all configuration changes made in Setup, including the creation, modification, and deletion of fields, along with the username of who made the change and when. It retains 180 days of history.

**Why the others are wrong:**
- A: Login History tracks user authentication events (logins, login times, IP addresses), not configuration changes
- B: Field History Tracking records changes to field VALUES on records — once a field is deleted, its tracking history is also removed and cannot log its own deletion
- D: Debug Logs capture Apex execution details; they do not log administrative setup changes

---

**Question 39**
Field History Tracking is enabled on the Case "Status" field. A before-save Flow updates the Status field as part of its automation. Will this change appear in the Case History related list?

A. No — Before Save Flow changes do not trigger field history tracking
B. Yes — field history tracking captures all changes to a tracked field, regardless of the mechanism that caused the change
C. Only if the Flow is run by an admin user
D. Only for the first change per record; subsequent automated changes are suppressed

**Answer: B**
**Explanation:** Field History Tracking fires based on the field value changing on the record, not based on who or what caused the change. Whether the change came from a user, a Flow, Apex, or an API call, if the field value changes and tracking is enabled, the change is recorded in the history.

**Why the others are wrong:**
- A: The mechanism causing the change (Before Save Flow vs. user edit) does not determine whether tracking fires — only whether the value changed
- C: The running user's profile does not affect whether field history tracking captures a change
- D: There is no limit of one tracked change per record; every qualifying change is captured up to the field history retention limit

---

**Question 40**
An admin suspects a user is logging in from an unauthorized geographic location outside business hours. Which tool provides the MOST direct evidence?

A. Setup Audit Trail — shows all user activity including page views
B. Login History — shows login time, IP address, and login status per user
C. User Activity Report — provides hour-by-hour usage metrics
D. Event Monitoring — the only tool that shows geographic login data

**Answer: B**
**Explanation:** Login History is the standard tool for reviewing login events per user, including timestamp, source IP address, login status (success/failure), and login type. IP geolocation can be inferred from the IP address, and business-hours violations are visible from the timestamp.

**Why the others are wrong:**
- A: Setup Audit Trail records configuration changes, not user session login activity
- C: A standard "User Activity Report" is not a named Salesforce audit feature; no such out-of-the-box report exists with this name
- D: Event Monitoring (a premium add-on) provides additional detail, but Login History already contains IP and timestamp data sufficient for this investigation

---

## DOMAIN 8: Change Management (3 Questions)

---

**Question 41**
A developer creates new custom metadata type records in a Sandbox. They need to deploy these to Production along with the Apex code that reads those records. What is the CORRECT deployment behavior?

A. Custom metadata records must be deployed separately from code using the Data Loader
B. Custom metadata records deploy WITH code via Change Sets or the Metadata API — they are metadata, not data
C. Custom metadata records cannot be deployed to Production; they must be recreated manually
D. Custom metadata records are automatically synchronized between Sandbox and Production via nightly sync

**Answer: B**
**Explanation:** This is a critical gotcha: unlike custom settings (which store data and must be loaded separately), custom metadata type records ARE metadata. They can be included in Change Sets, SFDX deployments, and Metadata API packages and deploy alongside code. This is one of the key advantages of custom metadata over custom settings.

**Why the others are wrong:**
- A: Data Loader is for data records (standard and custom object records); custom metadata records deploy as metadata
- C: Custom metadata records are fully deployable via standard metadata deployment tools
- D: There is no automatic nightly synchronization between Sandboxes and Production

---

**Question 42**
A company needs a Sandbox that can be refreshed daily and supports full Apex and automation testing with realistic data volumes (up to 5GB). Which Sandbox type meets these requirements?

A. Developer Sandbox — supports daily refresh and up to 200MB
B. Developer Pro Sandbox — supports daily refresh and up to 1GB
C. Partial Copy Sandbox — supports daily refresh with up to 5GB of sampled production data
D. Full Copy Sandbox — supports daily refresh (actually every 29 days) and full production data

**Answer: C**
**Explanation:** The Partial Copy Sandbox allows daily refreshes (every 1 day), includes a template-defined sample of production data up to 5GB, and supports full Apex testing with representative data volumes. It balances data realism with refresh frequency.

**Why the others are wrong:**
- A: Developer Sandboxes support daily refresh but have only 200MB storage — not sufficient for 5GB data volumes
- B: Developer Pro Sandboxes have 1GB storage and support daily refresh, but fall short of the 5GB requirement
- D: Full Copy Sandboxes contain all production data but have a 29-day minimum refresh interval, not daily

---

**Question 43**
A Change Set deployed to Production fails because a Validation Rule references a custom field that exists in Sandbox but was not included in the Change Set. What is the BEST corrective action?

A. Delete the Validation Rule in Sandbox and redeploy without it
B. Add the missing custom field to the Change Set and redeploy
C. Manually create the custom field in Production before redeploying
D. Use the Metadata API instead of Change Sets to bypass field dependency checks

**Answer: B**
**Explanation:** Change Sets must include all dependent components. The correct fix is to add the missing custom field to the Change Set so the full dependency graph is satisfied in a single deployment. Salesforce validates component dependencies during Change Set upload and deployment.

**Why the others are wrong:**
- A: Deleting the Validation Rule removes a business requirement and is not an appropriate resolution
- C: Manually creating the field in Production bypasses the change management process and creates an uncontrolled configuration drift
- D: Metadata API deployments are also subject to dependency validation; switching tools does not bypass the missing field requirement

---

## DOMAIN 9: Custom Objects & Fields (4 Questions)

---

**Question 44**
A developer needs configuration values that: (1) can be packaged and deployed with code, (2) can be referenced in formulas and validation rules, and (3) can be accessed in Apex without SOQL queries counting against limits. Which feature should be used?

A. Custom Settings (Hierarchy type)
B. Custom Metadata Types
C. Custom Objects with a fixed set of records
D. Static Resources containing JSON configuration

**Answer: B**
**Explanation:** Custom Metadata Types satisfy all three requirements: they deploy as metadata alongside code, their fields can be referenced in formulas and validation rules, and records can be accessed in Apex using `CustomMetadataType__mdt.getInstance()` without consuming SOQL query limits.

**Why the others are wrong:**
- A: Custom Settings (List type) can be referenced in formulas, but hierarchy settings have limitations, and while they do not consume SOQL in Apex, they do NOT deploy with Change Sets as data
- C: Custom Objects store data records that cannot be referenced in formulas or validation rules natively, and they consume SOQL queries
- D: Static Resources cannot be referenced in formulas or validation rules

---

**Question 45**
A Field Dependency is configured on a custom object where "Product Category" (controlling field, picklist) controls "Product Sub-Category" (dependent field, picklist). A user selects "Hardware" in Product Category. The dependent picklist shows only Hardware sub-categories. What happens if a user CLEARS the Product Category field?

A. The dependent picklist retains the previously selected value
B. The dependent picklist is cleared automatically when the controlling field is cleared
C. The dependent picklist becomes required and blocks the save
D. All values become available in the dependent picklist since there is no controlling value

**Answer: B**
**Explanation:** When a controlling field value is cleared, Salesforce automatically clears the dependent field value as well, since the previously selected dependent value may no longer be valid without a controlling value. This prevents invalid picklist combinations from being saved.

**Why the others are wrong:**
- A: Retaining the dependent value after clearing the controller would create an invalid data state
- C: Clearing a controlling field does not make the dependent field required; it clears it
- D: Without a controlling value, the dependent picklist is cleared and may show values based on "None" mapping, not all values

---

**Question 46**
An admin needs to track up to 20 different attributes for a custom "Project" object, but each project only uses 3-5 attributes relevant to its type. Using standard custom fields would create 20 sparse, mostly-null fields. What Salesforce feature addresses this?

A. Dynamic Forms with conditional field visibility
B. Field Sets that show only relevant fields
C. Compact Layouts with field subsets
D. Page Layouts with collapsible sections

**Answer: A**
**Explanation:** Dynamic Forms allow individual fields and field sections to be conditionally shown or hidden based on record data using visibility rules. This means only the 3-5 relevant fields appear for each project type without requiring 20 persistent fields to be populated.

**Why the others are wrong:**
- B: Field Sets define a reusable group of fields for use in Visualforce or LWC, but do not provide conditional visibility on record pages
- C: Compact Layouts define fields shown in highlights panels and hover cards, not full record detail visibility logic
- D: Collapsible sections hide fields visually but the fields still exist on the layout and users can expand all sections

---

**Question 47**
Which statement correctly describes the difference between a Master-Detail and a Lookup relationship in Salesforce?

A. Master-Detail supports roll-up summary fields on the parent; Lookup does not
B. Lookup relationships are required fields; Master-Detail fields are optional
C. Master-Detail relationships can be created on standard objects; Lookups cannot
D. Both relationship types support roll-up summary fields if enabled in Setup

**Answer: A**
**Explanation:** Roll-up Summary fields (Count, Sum, Min, Max) can only be created on the Master (parent) object in a Master-Detail relationship. Lookup relationships do not support roll-up summaries natively because the child record's lifecycle is independent of the parent.

**Why the others are wrong:**
- B: This is reversed — Master-Detail relationship fields are required on the child record; Lookup fields are optional by default
- C: Master-Detail relationships can be created where the parent is a standard object and the child is a custom object; the restriction is the reverse (custom object cannot be the master of a standard object)
- D: Roll-up summary fields do not work on Lookup relationships regardless of any Setup configuration

---

## DOMAIN 10: Content Management (3 Questions)

---

**Question 48**
A company uses Salesforce Files (ContentDocument). They want to share a file with a specific Salesforce Community user but NOT with all users in the community. What is the MOST targeted approach?

A. Post the file to a Chatter group that the community user is a member of
B. Create a ContentDocumentLink record linking the file to the specific community user's ID
C. Upload the file to a library that has the community user as a member
D. Email the file to the community user and ask them to upload it themselves

**Answer: B**
**Explanation:** ContentDocumentLink is the junction object that controls who can access a Salesforce File. Creating a ContentDocumentLink from the ContentDocument to the specific User record (with ShareType = "V" for viewer) grants that specific user access without exposing the file to anyone else.

**Why the others are wrong:**
- A: Sharing via a Chatter group grants access to ALL group members, not just the one community user
- C: Adding the user to a library grants them access to ALL files in that library, not just the specific file
- D: This is not a Salesforce platform solution and bypasses all access controls

---

**Question 49**
An admin creates a Content Library and wants Sales Reps to be able to add files but NOT delete or edit existing files added by others. Which library permission level should be assigned to the Sales Rep public group?

A. Viewer
B. Author
C. Administrator
D. Contributor

**Answer: B**
**Explanation:** The "Author" library permission level allows users to add new files to the library but restricts them from deleting or editing files uploaded by other users. This matches the requirement to allow contributions without destructive access to others' files.

**Why the others are wrong:**
- A: Viewer permission only allows reading/downloading files; it does not permit adding new files to the library
- C: Administrator permission grants full control including deleting any file and managing library membership — far broader than needed
- D: "Contributor" is not a standard Salesforce Content Library permission level name; the standard levels are Viewer, Author, and Administrator

---

**Question 50**
A company uses Salesforce Files and wants to ensure that when a file is shared with an Account, all users who have access to that Account can see the file. What linking approach accomplishes this automatically?

A. Manually share the ContentDocument with every user who has Account access
B. Create a ContentDocumentLink from the ContentDocument to the Account record — file visibility then follows the Account's sharing model
C. Upload the file to a public library so all users can access it
D. Attach the file to a Chatter post on the Account's feed

**Answer: B**
**Explanation:** When a ContentDocumentLink is created linking a file to an Account record (with LinkedEntityId = the Account Id), the file becomes visible to all users who have read access to that Account, following the Account's OWD and sharing rules automatically. This is the scalable and correct approach.

**Why the others are wrong:**
- A: Manually sharing with every user is not scalable and breaks whenever Account access changes
- C: Uploading to a public library grants access to all users in the org, not just those with Account access — this is far too broad
- D: Chatter post attachments do create a ContentDocumentLink to the record, so this actually achieves a similar effect, but it creates an unwanted Chatter post and is not the clean administrative approach — a direct ContentDocumentLink is more precise

---

## Answer Key

| Q# | Answer | Domain |
|----|--------|--------|
| 1 | B | Security & Access |
| 2 | C | Security & Access |
| 3 | B | Security & Access |
| 4 | B | Security & Access |
| 5 | B | Security & Access |
| 6 | B | Security & Access |
| 7 | B | Security & Access |
| 8 | B | Security & Access |
| 9 | B | Security & Access |
| 10 | B | Security & Access |
| 11 | B | Process Automation |
| 12 | B | Process Automation |
| 13 | A | Process Automation |
| 14 | B | Process Automation |
| 15 | B | Process Automation |
| 16 | A | Process Automation |
| 17 | B | Process Automation |
| 18 | C | Process Automation |
| 19 | A | Sales Cloud |
| 20 | B | Sales Cloud |
| 21 | A | Sales Cloud |
| 22 | C | Sales Cloud |
| 23 | C | Sales Cloud |
| 24 | C | Service Cloud |
| 25 | B | Service Cloud |
| 26 | B | Service Cloud |
| 27 | B | Service Cloud |
| 28 | B | Service Cloud |
| 29 | C | Data Management |
| 30 | C | Data Management |
| 31 | B | Data Management |
| 32 | A | Data Management |
| 33 | B | Data Management |
| 34 | C | Reports & Dashboards |
| 35 | C | Reports & Dashboards |
| 36 | B | Reports & Dashboards |
| 37 | B | Reports & Dashboards |
| 38 | C | Auditing |
| 39 | B | Auditing |
| 40 | B | Auditing |
| 41 | B | Change Management |
| 42 | C | Change Management |
| 43 | B | Change Management |
| 44 | B | Custom Objects |
| 45 | B | Custom Objects |
| 46 | A | Custom Objects |
| 47 | A | Custom Objects |
| 48 | B | Content |
| 49 | B | Content |
| 50 | B | Content |

---

## Key Gotchas Summary

| Topic | Gotcha |
|-------|--------|
| OWD Floor Rule | OWD is the MINIMUM access floor — sharing rules, role hierarchy, and territory assignments can only grant MORE access, never less than OWD |
| Before Save Flow | Can ONLY update fields on the triggering record via Assignment elements; no DML, no emails, no Apex, no callouts |
| After Save Flow | Required for DML on other objects, sending emails, calling Apex, or making callouts (use async Apex for callouts post-DML) |
| Custom Metadata | Records are METADATA — they deploy with Change Sets and SFDX; unlike Custom Settings data, which must be loaded separately |
| Joined Reports | Cross-block formulas reference AGGREGATED summary values from other blocks, not row-level field values |
| Fault Paths | Always add fault paths to After Save Flow DML elements — errors can be swallowed silently without them |
| Permission Sets | ADDITIVE only — they grant but cannot revoke permissions already on a Profile |
| Approval Locking | Records are locked DURING approval (upon submission), not only upon final approval |
| Data Loader Limit | Data Import Wizard max = 50,000 records; Data Loader handles millions |
| Sandbox Refresh | Developer/Dev Pro = 1 day; Partial Copy = 1 day; Full Copy = 29 days |
