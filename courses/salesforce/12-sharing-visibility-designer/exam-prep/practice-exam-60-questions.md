# Salesforce Sharing & Visibility Designer (CRT-403)
## Practice Exam — 50 Scenario-Based Questions

**Exam Blueprint Coverage:**
- Record-Level Access (35%) — Questions 1–18
- Object & Field Access (20%) — Questions 19–28
- Communities / Experience Cloud (15%) — Questions 29–36
- Performance & Scalability (15%) — Questions 37–43
- Auditing & Monitoring (15%) — Questions 44–50

---

## SECTION 1: Record-Level Access (35%)

---

**Question 1**
A company's sales reps must see all Accounts in their own region but must not see Accounts in other regions unless explicitly shared. Which OWD setting achieves the minimum necessary access as a baseline?

A. Public Read/Write
B. Public Read Only
C. Private
D. Controlled by Parent

**Answer: C**

**Explanation:** Setting Account OWD to Private ensures that by default no user can see another user's records. Sharing rules or the role hierarchy can then open up controlled access region by region, following the principle of least privilege.

**Why the others are wrong:**
- A: Public Read/Write allows all users to read and edit every Account, far exceeding the requirement
- B: Public Read Only still exposes all Accounts to every user, violating regional isolation
- D: Controlled by Parent applies to child objects (Contacts, Opportunities linked to an Account), not to Account itself

---

**Question 2**
A sales manager at the VP of Sales role can see records owned by everyone below her in the role hierarchy. A peer VP in a different division cannot see her records. Which statement best explains this behavior?

A. Sharing rules are granting access up the hierarchy
B. Role hierarchy grants access upward — managers can see subordinates' records, but peers cannot see each other's records
C. The OWD is Public Read Only, so all VPs share access
D. Manual sharing has been applied to the VP role

**Answer: B**

**Explanation:** The role hierarchy grants record visibility upward: a manager inherits access to all records owned by users below them in the hierarchy. Horizontal peers at the same level do not automatically share access, so a VP in one division cannot see a VP peer's records unless another mechanism grants it.

**Why the others are wrong:**
- A: Sharing rules extend access; they do not explain the built-in upward inheritance of the role hierarchy
- C: Public Read Only would let all VPs see all records regardless of hierarchy
- D: Manual sharing is ad hoc and record-specific; it doesn't explain consistent cross-division isolation

---

**Question 3**
A company has Opportunity OWD set to Private. Sales reps should be able to read (but not edit) all Opportunities in their territory. What is the most appropriate mechanism?

A. Change OWD to Public Read Only
B. Create an Ownership-Based Sharing Rule granting Read Only to the correct role or public group
C. Create a Criteria-Based Sharing Rule granting Read Only using a territory field filter
D. Enable the role hierarchy so managers can see subordinate records

**Answer: C**

**Explanation:** A criteria-based sharing rule evaluates field values — such as a territory field — to grant read access to a targeted group without changing the OWD or granting broader access. This is the most surgical approach when the condition driving access is a data attribute rather than record ownership.

**Why the others are wrong:**
- A: Changing OWD affects all users globally, not just a targeted territory
- B: An ownership-based rule shares based on who owns the record, not what territory it belongs to
- D: The role hierarchy only helps managers; it does not grant lateral read access across territory peers

---

**Question 4**
An admin created 350 criteria-based sharing rules for the Case object. A deployment fails with a validation error. What is the most likely cause?

A. Cases cannot have criteria-based sharing rules
B. The sharing rules reference a field that is not indexed
C. Salesforce enforces a limit of 300 sharing rules per object (ownership-based + criteria-based combined)
D. The role hierarchy must be disabled before adding more than 300 rules

**Answer: C**

**Explanation:** Salesforce imposes a hard limit of 300 sharing rules per object, counting both ownership-based and criteria-based rules together. Exceeding this limit causes a validation error at save or deployment time.

**Why the others are wrong:**
- A: Cases fully support criteria-based sharing rules
- B: Non-indexed fields can slow rule evaluation but do not cause a hard validation error
- D: There is no such relationship between role hierarchy and the 300-rule limit

---

**Question 5**
A developer writes an Apex class that inserts rows directly into the AccountShare object and sets the RowCause to a custom sharing reason. When does Salesforce automatically delete these Apex-managed share rows?

A. Every night during nightly recalculation
B. When the record owner changes
C. Never — Apex-managed shares with a custom RowCause persist until explicitly deleted by code
D. When a sharing rule that covers the same record is deleted

**Answer: C**

**Explanation:** Share rows with a custom RowCause (Apex-managed sharing) are fully under developer control and are not touched by Salesforce's automatic sharing recalculation. They persist until your code explicitly deletes them, which means ownership changes or org-wide recalculations leave them untouched.

**Why the others are wrong:**
- A: Nightly recalculation rebuilds sharing rules and role-hierarchy rows, not custom RowCause rows
- B: Ownership changes recalculate Manual and system sharing rows, not custom-RowCause rows
- D: Deleting a sharing rule removes rows with that rule's RowCause, not rows with a different custom RowCause

---

**Question 6**
A Contact is associated with an Account owned by User A. User B has Read access to the Account but does not own the Contact. The Contact OWD is set to Controlled by Parent. What level of access does User B have to the Contact?

A. No access — the Contact OWD being Controlled by Parent means only the owner can see it
B. The same access User B has on the parent Account — Read access
C. Edit access, because Account access cascades fully to child records
D. Read access only if User B is in the same role as User A

**Answer: B**

**Explanation:** "Controlled by Parent" means the Contact inherits whatever record-level access the user has on its parent Account. Because User B has Read on the Account, User B automatically has Read on all associated Contacts — this is implicit (account-contact) sharing.

**Why the others are wrong:**
- A: Controlled by Parent does not lock records to the owner; it derives access from the parent
- C: Account Read access cascades as Read on the child, not Edit; Edit on Account cascades as Edit on Contact
- D: The role of the user is irrelevant when the OWD is Controlled by Parent; access flows from the parent record's sharing

---

**Question 7**
An Opportunity is related to an Account owned by User A. User B has Read/Write on the Account through a sharing rule. The Opportunity OWD is set to Private. Can User B see the Opportunity?

A. No — Opportunity OWD Private means only the owner can see it; Account access is irrelevant
B. Yes — implicit sharing grants User B at least Read access to the related Opportunity because User B has access to the parent Account
C. Yes — but only if User B is in a role above User A
D. Yes — but only through an Apex trigger that grants access explicitly

**Answer: B**

**Explanation:** Implicit sharing (also called Account-Opportunity sharing) means that any user with access to an Account automatically gains at least Read access to the Account's related Opportunities, Cases, and Contacts — even when those child objects have a Private OWD. The parent Account's sharing drives child visibility.

**Why the others are wrong:**
- A: Private OWD is the floor; implicit sharing can raise it above the floor
- C: Role hierarchy determines upward access; implicit sharing is independent of role position
- D: Implicit sharing is a built-in platform mechanism and does not require Apex

---

**Question 8**
A company wants select service agents to share individual Case records manually with their team leads on an ad hoc basis. Which feature should the admin enable?

A. Criteria-Based Sharing Rules
B. Manual Sharing (the "Sharing" button on the record)
C. Apex Sharing with a custom RowCause
D. Public Groups assigned to the Case OWD

**Answer: B**

**Explanation:** Manual Sharing allows record owners (and users with Full Access) to share individual records on demand with specific users, roles, or groups by clicking the Sharing button on the record detail page. This supports ad hoc, record-by-record sharing without code or automation.

**Why the others are wrong:**
- A: Criteria-based rules automate sharing based on field values across many records, not on a per-record ad hoc basis
- C: Apex sharing is appropriate for programmatic, rule-based sharing but is overkill and requires code for a simple ad hoc use case
- D: OWD settings apply to all records globally and cannot be used to share a single record ad hoc

---

**Question 9**
A company uses a role hierarchy with five levels. A field sales rep at level 5 owns an Account. Which users automatically gain access to that Account (assuming Private OWD)?

A. Only the rep's direct manager
B. All users at level 1, 2, 3, and 4 who are in the same branch of the hierarchy above the rep
C. All users in the entire role hierarchy regardless of branch
D. No one — Private OWD prevents even managers from seeing the record

**Answer: B**

**Explanation:** The role hierarchy grants upward access along the branch: every user in a role that is directly or indirectly above the record owner in the same reporting chain gains access. Users in a different branch of the hierarchy at the same or higher level do not inherit access.

**Why the others are wrong:**
- A: Only the direct manager is too narrow; all ancestors in the same branch gain access, not just one level up
- C: Users in different branches of the hierarchy do not receive access through the hierarchy
- D: Private OWD is the default floor; the role hierarchy explicitly overrides it for users above the owner

---

**Question 10**
Salesforce is recalculating sharing for an object after a sharing rule change. The recalculation has been running for several hours and performance is degraded. What is the most likely architectural cause?

A. The object OWD was changed from Public to Private
B. One user owns millions of records for that object, causing the sharing group for that user to be abnormally large (ownership skew)
C. There are too many permission sets assigned to users
D. The role hierarchy has more than 10 levels

**Answer: B**

**Explanation:** Ownership skew — where one user owns a disproportionately large number of records — means that any sharing recalculation must rebuild an enormous sharing group for that user. This makes the recalculation extremely slow and can degrade org performance for the duration.

**Why the others are wrong:**
- A: An OWD change triggers recalculation but is not itself the cause of slow completion; the skew is the cause
- C: Permission sets control object/field access, not record-level sharing groups, and do not affect recalculation time
- D: Role hierarchy depth has a minor impact on sharing computation; ownership skew is far more significant

---

**Question 11**
A company uses Territory Management 2.0. A sales rep is assigned to two territories. How does territory assignment affect record access for Accounts in those territories?

A. Territory assignment grants access only through the role hierarchy, not independently
B. Territory assignment creates AccountShare records with RowCause = Territory, granting access to all users assigned to the territory
C. Territory assignment grants the territory manager access only, not the assigned reps
D. Territory assignment only works when Account OWD is Public Read Only or higher

**Answer: B**

**Explanation:** Enterprise Territory Management creates AccountShare records with a RowCause of Territory (or TerritoryManual) when accounts are assigned to a territory. All users assigned to that territory receive the configured access level on those Accounts independently of the role hierarchy.

**Why the others are wrong:**
- A: Territory access is a standalone sharing mechanism; it is not routed through the role hierarchy
- C: Both territory managers and assigned users receive access based on their territory role
- D: Territory sharing works at any OWD setting; Private OWD is common precisely because territories provide targeted access

---

**Question 12**
A sharing rule is set to share Accounts owned by "Sales Team" public group with "Support Team" public group at Read Only. A sales rep is added to "Sales Team" but not "Support Team." What access does the sales rep now have to Accounts owned by other Sales Team members?

A. No change — the sharing rule only affects Support Team's access
B. The rep gains Read access to all Accounts owned by Sales Team members via the role hierarchy
C. The rep gains no access from this rule — the rule grants Support Team read access to Sales Team-owned records; it does not give Sales Team members access to each other's records
D. The rep gains Full Access because they are now part of the owning group

**Answer: C**

**Explanation:** An ownership-based sharing rule of the form "records owned by Group A shared with Group B" grants Group B access to Group A's records. It does not create mutual access within Group A, and it does not grant the owning group any additional rights beyond what they already have.

**Why the others are wrong:**
- A: The sharing rule does change access — for Support Team, not for the newly added sales rep
- B: The role hierarchy is independent of public group membership for lateral sharing
- D: Owning a record already gives Full Access to the owner; the sharing rule is about the recipient group, not the owning group's internal access

---

**Question 13**
An admin needs to grant a set of users access to records that meet a specific condition (e.g., Account Type = "Partner") without changing OWD or creating complex role structures. What is the best approach?

A. Create a public group containing those users and write a criteria-based sharing rule that evaluates Account Type = "Partner"
B. Write an Apex trigger to insert AccountShare rows whenever Account Type changes to "Partner"
C. Change the Account OWD to Public Read Only
D. Create a custom profile that grants access to Partner Accounts

**Answer: A**

**Explanation:** A criteria-based sharing rule evaluates field values and automatically grants the configured access to the target group whenever records match the criteria. This is a declarative, maintainable solution that does not require code and does not open access beyond the intended records.

**Why the others are wrong:**
- B: Apex sharing works but is more complex than needed when a declarative criteria-based rule accomplishes the same goal
- C: Changing OWD to Public Read Only gives all users read access to all Accounts, far exceeding the requirement
- D: Profiles control object-level and field-level access; they cannot restrict record visibility to a subset of records matching a field value

---

**Question 14**
A user is in Role A. Her manager is in Role B. Role B reports to Role C (the executive). The executive in Role C reassigns a record to a user in a completely separate branch of the hierarchy (Role X). What happens to the sharing access of the original manager in Role B?

A. Role B retains access because they were granted it through the role hierarchy originally
B. Role B loses access — the role hierarchy grants access based on who owns the record now, and Role B is no longer above Role X
C. Role B gains Read Only access as a consolation through manual sharing
D. Role B retains access only if a sharing rule exists for Role B

**Answer: B**

**Explanation:** Role hierarchy access is dynamic and based on current record ownership. When a record is reassigned to a user in Role X, the system recalculates which roles are above Role X. If Role B is not in the reporting chain above Role X, Role B loses the access that was previously granted via the hierarchy.

**Why the others are wrong:**
- A: There is no "historical" role-hierarchy access; it is always computed from current ownership
- C: Manual sharing is not automatically created upon reassignment
- D: Sharing rules are separate from role-hierarchy access; Role B would need an explicit rule granting access to records owned by Role X

---

**Question 15**
A company wants to prevent Apex code from bypassing sharing rules when querying records. A developer writes a class with the "without sharing" keyword. What is the effect?

A. The class runs in system context and can see and modify all records regardless of the current user's sharing access
B. The class still enforces sharing rules but ignores field-level security
C. The class enforces OWD but ignores sharing rules
D. The class honors the current user's sharing settings but ignores field-level security

**Answer: A**

**Explanation:** A class declared "without sharing" runs in system context with respect to record access, meaning it can query and DML any record regardless of the running user's sharing settings, role, or OWD. This is useful for administrative operations but must be used carefully to avoid unintended data exposure.

**Why the others are wrong:**
- B: "Without sharing" removes sharing enforcement entirely, not just field-level security
- C: OWD is part of the sharing model; "without sharing" bypasses the entire sharing model, including OWD
- D: Honoring sharing settings while ignoring FLS describes a different scenario; "with sharing" enforces sharing, and "without sharing" removes it

---

**Question 16**
A large enterprise has a Contact OWD set to Private. A service rep receives a case from a customer. The Contact on the Case is owned by a sales rep in a different role branch. Can the service rep see the Contact?

A. No — Contact OWD is Private and the service rep does not own the Contact
B. Yes — Case-Contact implicit sharing grants the service rep at least Read access to the Contact on their Case
C. Yes — but only if a sharing rule explicitly grants service reps access to all Contacts
D. Yes — because the Contact is Public Read Only through the role hierarchy

**Answer: B**

**Explanation:** Salesforce implicit sharing extends beyond Account → Contact/Opportunity/Case. A user who has access to a Case also gains Read access to the Contact on that Case, even when Contact OWD is Private. This prevents a service rep from being unable to see the caller's Contact while working a Case.

**Why the others are wrong:**
- A: Private OWD is the floor; implicit sharing from the Case raises it for the service rep
- C: A sharing rule is not required; implicit sharing is a platform-level built-in behavior
- D: The role hierarchy does not apply cross-branch; implicit sharing from Case access is the correct mechanism

---

**Question 17**
An organization's Account OWD is set to Public Read/Write. A manager asks the admin to prevent a specific competitor-sensitive Account from being edited by everyone except the account owner. What is the fastest declarative solution?

A. Change Account OWD to Private and create sharing rules for all other accounts
B. Use a permission set to remove Edit on Account for all other users
C. No declarative solution exists — OWD cannot be overridden downward for a single record; Apex sharing or a custom field-based approach is required
D. Enable Account Teams and remove edit access for non-team members

**Answer: C**

**Explanation:** OWD represents the minimum (most restrictive) access floor. When OWD is Public Read/Write, sharing rules and the role hierarchy can only grant equal or more access — they cannot restrict a specific record below the OWD. There is no standard declarative record-level mechanism to lock down a single record when OWD grants broad access.

**Why the others are wrong:**
- A: Changing OWD affects all Accounts globally, not just the one sensitive record
- B: Permission sets control object-level CRUD, removing Edit for everyone would affect all Accounts, not just the sensitive one
- D: Account Teams grant additional access; they do not restrict access on a record that is already broadly accessible via OWD

---

**Question 18**
An admin enables "Grant Access Using Hierarchies" for a custom object. What does this setting control?

A. Whether Apex sharing can be used on the object
B. Whether managers in the role hierarchy automatically inherit record access from their subordinates for this object
C. Whether sharing rules can be created for this object
D. Whether the object supports manual sharing

**Answer: B**

**Explanation:** "Grant Access Using Hierarchies" is a per-object setting that controls whether role hierarchy inheritance is active for that object. When enabled, managers gain access to subordinates' records. When disabled, only the record owner and explicitly shared users/groups have access — the hierarchy does not cascade upward.

**Why the others are wrong:**
- A: Apex sharing availability is not controlled by this setting; it depends on the object having OWD set to Private or Public Read Only
- C: Sharing rules can exist on an object regardless of this setting
- D: Manual sharing availability is independent of this setting; it requires OWD to not be Public Read/Write

---

## SECTION 2: Object & Field Access (20%)

---

**Question 19**
A support agent reports that she can open a Case record but cannot see the "Internal Notes" field, even though the field exists on the page layout assigned to her profile. What is the most likely cause?

A. The Case OWD is set to Private
B. The field's Field-Level Security is set to "Hidden" for her profile
C. A permission set has removed her access to the Case object
D. The field is missing from her search layout

**Answer: B**

**Explanation:** Field-Level Security (FLS) controls whether a field is visible, read-only, or editable for a given profile, regardless of whether the field is on the page layout. If FLS is set to Hidden for her profile, the field will not appear even if it is placed on the layout.

**Why the others are wrong:**
- A: OWD affects record-level access; it does not hide individual fields within a record the user can already open
- C: Removing object access prevents the user from accessing Cases at all; she can already open the record
- D: Search layouts affect which fields appear in list views and search results, not on the record detail page

---

**Question 20**
A developer queries a field in Apex code running "with sharing." The running user's profile has FLS set to Hidden for that field. What is returned?

A. A null value for the field, enforced by the sharing model
B. The field value — FLS is not automatically enforced by "with sharing"; it controls sharing, not FLS
C. An exception is thrown
D. The field is excluded from the query result set because the platform enforces FLS automatically in all Apex contexts

**Answer: B**

**Explanation:** "With sharing" in Apex enforces record-level sharing rules but does NOT enforce Field-Level Security. Apex code can read any field value unless the developer explicitly calls Schema.sObjectType methods to check FLS or uses the stripInaccessible method. FLS is enforced natively by Visualforce and Lightning components, not by the "with sharing" keyword.

**Why the others are wrong:**
- A: The sharing model governs record visibility, not field visibility; there is no automatic null substitution for hidden fields in Apex
- C: No exception is thrown for FLS violations in Apex; the value is returned without error
- D: FLS is not automatically enforced in Apex; it must be explicitly checked or use stripInaccessible

---

**Question 21**
A company wants to ensure that one group of users can create and edit Account records, while another group can only read them, and a third group cannot access Accounts at all. What is the primary tool for implementing this differentiation?

A. OWD settings on Account
B. Sharing rules targeting the three groups
C. Profiles (or permission sets) controlling CRUD permissions on the Account object
D. Role hierarchy with three levels

**Answer: C**

**Explanation:** CRUD permissions on an object (Create, Read, Edit, Delete) are controlled by profiles and permission sets, not by sharing rules or OWD. Object-level access is the gate that determines whether a user can interact with an object at all; sharing rules only control which specific records within the accessible set can be seen.

**Why the others are wrong:**
- A: OWD governs which records within the accessible object a user can see by default; it does not prevent a user from accessing the object entirely
- B: Sharing rules add record access; they cannot remove it or prevent object access
- D: Role hierarchy governs record inheritance; it does not control object-level CRUD

---

**Question 22**
An admin wants to give a specific set of users Edit access to a custom field on Account without changing the baseline profile. What is the recommended approach in a modern Salesforce org?

A. Create a new profile with Edit FLS for the field and reassign those users
B. Create a permission set granting Edit FLS for the field and assign it to those users
C. Use a sharing rule to open up field access
D. Use an Apex trigger to set the field value on behalf of the user

**Answer: B**

**Explanation:** Permission sets are the recommended, additive mechanism for granting elevated access to specific users beyond their baseline profile. They are stackable, do not require cloning profiles, and can target FLS on individual fields for precisely the users who need it.

**Why the others are wrong:**
- A: Creating separate profiles for every variation leads to profile sprawl and is the pattern Salesforce has deprecated in favor of permission sets
- C: Sharing rules control record visibility, not field-level edit access
- D: An Apex trigger workaround bypasses the access model and introduces maintenance complexity

---

**Question 23**
A profile has "Read" access to Opportunities (no Create, no Edit, no Delete). A sharing rule grants a public group (which includes users on this profile) "Read/Write" sharing access to a set of Opportunities. Can those users edit those Opportunities?

A. Yes — sharing rules can elevate access above what the profile allows at the record level
B. No — sharing rules cannot grant more than the object-level access defined on the profile; the user still cannot edit because their profile lacks Edit on Opportunity
C. Yes — but only if the sharing rule was created by a System Administrator
D. No — sharing rules always grant Read Only regardless of the configured access level

**Answer: B**

**Explanation:** Object-level permissions (CRUD) and record-level access (sharing) are independent but both required. A user needs both object-level Edit on the Opportunity object AND record-level access to the specific record to edit it. If the profile grants only Read at the object level, no sharing rule can grant edit capability on specific records.

**Why the others are wrong:**
- A: Sharing rules cannot override the object-level CRUD permissions set by the profile
- C: The creator of the sharing rule does not affect whether the receiving users can edit records
- D: Sharing rules can be configured for Read Only or Read/Write; the statement is incorrect, but the outcome is still blocked by the profile anyway

---

**Question 24**
A user has a standard profile with no custom permissions. A permission set granting "View All" on the Contact object is assigned to her. What is the result?

A. She can see all Contact records in the org, bypassing OWD and sharing rules for Contacts
B. She can only see Contacts she owns and those shared with her through the standard sharing model
C. "View All" on Contact only applies when Contact OWD is set to Private
D. The permission set overrides her profile but only for Contacts she has previously accessed

**Answer: A**

**Explanation:** "View All" is an object-level permission that grants full read visibility to all records of that object, completely bypassing OWD, sharing rules, and role hierarchy. It is equivalent to having View All Data for just that object and should be granted carefully.

**Why the others are wrong:**
- B: "View All" specifically bypasses the standard sharing model, unlike normal object Read access
- C: "View All" works regardless of OWD setting; it supersedes the OWD
- D: "View All" is not scoped to previously accessed records; it grants universal visibility

---

**Question 25**
An admin sets a custom field to "Read Only" in FLS on a user's profile. The user then uses the Salesforce API to submit a record update that includes a new value for that Read Only field. What happens?

A. The update fails with a field access error
B. The field value is silently ignored and the rest of the record update succeeds
C. The API enforces FLS and throws a FIELD_ACCESS_EXCEPTION
D. The API always bypasses FLS, so the field is updated successfully

**Answer: B**

**Explanation:** When a user submits a record update via the API with a value for a field they only have Read access to, Salesforce silently strips that field from the update rather than rejecting the entire operation. The rest of the DML succeeds; the restricted field retains its previous value.

**Why the others are wrong:**
- A: Salesforce does not fail the entire update due to a Read Only FLS violation; it strips the field silently
- C: A FIELD_ACCESS_EXCEPTION is not raised in this scenario through standard API behavior
- D: The API does enforce FLS for the running user; however, the enforcement behavior is silent stripping, not an error

---

**Question 26**
Two permission sets each grant "Edit" FLS on the same field but with conflicting configurations — one grants Edit, one grants Read Only. What is the effective access?

A. Read Only — the most restrictive permission set wins
B. Edit — the most permissive permission set wins; permissions are additive
C. An error is thrown and neither permission set is applied
D. The most recently assigned permission set determines access

**Answer: B**

**Explanation:** Salesforce permissions are always additive. If any profile or permission set in a user's permission stack grants Edit on a field, the user has Edit access on that field. The most permissive assignment wins; there is no "most restrictive wins" logic for FLS on permission sets.

**Why the others are wrong:**
- A: Salesforce does not use a most-restrictive model for combining permissions across permission sets
- C: No error is thrown; the platform resolves the conflict by taking the most permissive value
- D: Assignment order does not determine outcome; permissions are unioned across the stack

---

**Question 27**
An organization wants to expose a sensitive compensation field on the Employee object to HR managers only. The field must be invisible to all other users including System Administrators unless they are in the HR Manager permission set group. What is the recommended approach?

A. Create a sharing rule to hide the field from non-HR users
B. Use a separate Salesforce org for HR data
C. Set FLS to Hidden on all profiles and grant Edit FLS only via a permission set assigned to HR managers; restrict System Administrator access using a separate admin profile
D. Use record types to display different page layouts and exclude the field from non-HR layouts

**Answer: C**

**Explanation:** FLS is the correct mechanism to hide a sensitive field. Setting the field to Hidden on all profiles and granting access only through a targeted permission set ensures only HR managers see the data. System Administrators have View All Data but FLS can be restricted even for them by assigning a custom admin profile without the field visible.

**Why the others are wrong:**
- A: Sharing rules control record visibility, not field visibility
- B: A separate org is a drastic architectural decision and is rarely necessary for field-level confidentiality
- D: Removing a field from a page layout hides it visually but does not prevent API access; FLS is the secure enforcement layer

---

**Question 28**
A user has "Modify All" permission on the Account object. She deletes an Account record owned by another user. Later the account owner discovers the deletion. Was this action within normal platform behavior?

A. No — Modify All only allows editing, not deleting other users' records
B. Yes — Modify All grants full CRUD (including Delete) on all records of that object regardless of ownership or sharing settings
C. Yes — but only System Administrators can grant Modify All to non-admin users
D. No — deleting a record owned by another user requires Modify All Data, not just Modify All on the object

**Answer: B**

**Explanation:** "Modify All" on an object grants the user the ability to view, edit, transfer, and delete all records of that object regardless of ownership, OWD, or sharing rules. It is the object-level equivalent of "Modify All Data" scoped to a single object.

**Why the others are wrong:**
- A: Modify All encompasses full CRUD including Delete, not just Edit
- C: Any profile or permission set can include Modify All on a specific object; it is not restricted to System Administrators to grant
- D: "Modify All Data" is the org-wide version; "Modify All" on the object is sufficient for deleting records on that specific object

---

## SECTION 3: Communities / Experience Cloud (15%)

---

**Question 29**
An Experience Cloud site has guest users browsing public product catalog pages. The admin needs to ensure guest users can only see Account records where the Account field "Public_Facing__c" is set to True. What is the recommended approach?

A. Set Account OWD to Public Read Only for all user types
B. Use a guest user sharing rule based on the criteria Public_Facing__c = True to share matching Accounts with the Guest User profile
C. Add the guest user to a public group and create an ownership-based sharing rule
D. Grant the guest user View All on Account

**Answer: B**

**Explanation:** Criteria-based sharing rules targeting the Guest User profile (or a group associated with it) are the correct declarative mechanism to expose a specific subset of records to unauthenticated guest users. This limits guest access to only the records meeting the filter criteria, following the principle of least privilege.

**Why the others are wrong:**
- A: Setting Account OWD to Public Read Only at the org level would give all authenticated users (and potentially guests with object access) read visibility to all Accounts
- C: Guest users cannot be added to public groups, and an ownership-based rule cannot filter by field values
- D: Granting View All to the guest user profile would expose all Account records, not just the public-facing subset

---

**Question 30**
A partner community user belongs to an Account (Partner Account). The External OWD for Opportunity is set to "Private." An admin creates a Sharing Set that grants the partner user access to Opportunities related to their account. The partner attempts to access an Opportunity related to a different partner's Account. What is the result?

A. Access is granted because External OWD is configured per community, not per account
B. Access is denied — the Sharing Set scopes access to Opportunities related to the partner's own Account
C. Access is granted if the partner has the "Delegated External User Administrator" permission
D. Access is denied only if the Opportunity is owned by an internal user

**Answer: B**

**Explanation:** Sharing Sets grant Experience Cloud users access to records related to their own account or contact. The relationship used in the Sharing Set (e.g., Account lookup on Opportunity) scopes access to records that share the same Account as the partner user. Records belonging to a different partner Account are outside that scope.

**Why the others are wrong:**
- A: External OWD is set at the org level for external users; it is not scoped per account
- C: Delegated Administrator permission allows partner admins to manage users in their account, not access other companies' Opportunities
- D: Record ownership does not affect whether a Sharing Set grants cross-account access; the scope is always the partner's own account

---

**Question 31**
The External OWD for Contact is set to "Private." An Experience Cloud customer user associated with Contact record C1 attempts to view Contact record C2 belonging to the same Account. What happens?

A. The customer user can see C2 because they share the same Account
B. The customer user cannot see C2 — External OWD Private means they can only see their own Contact record by default unless a Sharing Set or sharing rule grants additional access
C. The customer user can see C2 only if they are a Delegated External User Administrator
D. External OWD Private prevents even the user's own Contact from being visible

**Answer: B**

**Explanation:** External OWD Private means each external user sees only records they own or that are explicitly shared with them. Sharing the same parent Account does not automatically grant cross-contact visibility. A Sharing Set would need to be configured to grant access to Contacts related to the same Account.

**Why the others are wrong:**
- A: Sharing the same Account parent does not override External OWD Private for Contact records
- C: Delegated Administrator access is about user management, not record visibility
- D: A user always has access to their own Contact record regardless of External OWD setting

---

**Question 32**
An admin is setting up an Experience Cloud site for customers. Customers should see their own Cases and Cases of other contacts at the same company. Which sharing mechanism best achieves this?

A. Set Case External OWD to Public Read Only
B. Create a Sharing Set on Case using the Account lookup to grant all contacts at the same Account access to all Cases associated with that Account
C. Create a criteria-based sharing rule using Account.Type = "Customer"
D. Enable the role hierarchy for the Case object

**Answer: B**

**Explanation:** A Sharing Set on Case with a relationship path through Account grants all Experience Cloud users from the same Account read (or read/write) access to Cases associated with that Account. This is the intended pattern for company-level visibility in customer communities.

**Why the others are wrong:**
- A: Public Read Only External OWD would expose all Cases to all external users across all companies, violating data boundaries
- C: Criteria-based sharing rules do not run for Experience Cloud guest users; additionally, this approach shares with all customers of type "Customer" rather than restricting to the same company
- D: The standard role hierarchy is not available for Experience Cloud users; external users do not have internal roles

---

**Question 33**
A guest user on an Experience Cloud site is submitting a web-to-lead form. The form creates a Lead record. The Guest User profile has Create on Lead enabled. An admin discovers that guest users can view all Leads in the org from the site. What setting caused this?

A. Lead OWD is set to Public Read Only, and the Guest User profile has Read on Lead
B. The Guest User profile has View All on Lead
C. A sharing rule grants the Guest User profile Read access to all Leads
D. The role hierarchy includes guest users by default

**Answer: A**

**Explanation:** If Lead OWD is Public Read Only and the Guest User profile has object-level Read on Lead, guest users can query all Lead records. The combination of Read object access and a permissive OWD is the most common accidental guest data exposure pattern.

**Why the others are wrong:**
- B: View All would also cause this but is a more explicit, deliberate configuration; Public Read Only + Read is the more common accidental cause
- C: Sharing rules targeting the Guest User profile are possible but would be a deliberate configuration; the OWD + Read combination is more likely the root cause in this scenario
- D: Guest users are not part of the role hierarchy

---

**Question 34**
A company wants partner users to be able to edit their own Account record from within the Experience Cloud site. The Account External OWD is set to Private. What must be true?

A. The partner user must be granted System Administrator profile in the community
B. The partner user must be the owner of the Account record, or the Account must be explicitly shared with them at Read/Write access through a Sharing Set or sharing rule
C. Account records can never be edited by Experience Cloud users regardless of sharing
D. The partner must be added to the Account Team with Edit access

**Answer: B**

**Explanation:** With External OWD Private on Account, a partner user can only edit their Account if they own it or if a Sharing Set or sharing rule grants them Read/Write (or higher) access. Partner users are typically associated with an Account via the Account field on their Contact, and a Sharing Set can grant them edit rights to that Account.

**Why the others are wrong:**
- A: System Administrator profile is not appropriate for partner users and would grant far more access than needed
- C: Account editing by Experience Cloud users is fully supported when access is properly configured
- D: Account Teams are an internal mechanism; they are not the standard way to grant Experience Cloud users edit rights

---

**Question 35**
An Experience Cloud site uses a high-volume portal user license. The admin attempts to add this user to a role in the portal's role hierarchy for sharing purposes. What is the result?

A. The user is added successfully and the role hierarchy grants access as expected
B. High-volume portal users (HVPUs) do not support the standard role hierarchy; access must be granted through Sharing Sets
C. High-volume portal users can use the role hierarchy only if "Grant Access Using Hierarchies" is enabled on the object
D. High-volume portal users can be added to the portal role hierarchy but not the internal role hierarchy

**Answer: B**

**Explanation:** High-Volume Portal Users (Customer Community license) are specifically architected for scale and do not participate in the role hierarchy. This is a deliberate trade-off: the role hierarchy model breaks down at very high user counts. Sharing Sets are the designated mechanism for granting record access to HVPUs.

**Why the others are wrong:**
- A: HVPUs explicitly cannot be assigned portal roles; this is a platform restriction
- C: "Grant Access Using Hierarchies" is an object-level setting for internal users; HVPUs are excluded from the hierarchy regardless
- D: HVPUs cannot be added to either the internal or portal role hierarchy

---

**Question 36**
A company's Experience Cloud site allows customers to submit Cases. The admin wants customer users to be able to view all Cases submitted by any contact from their company, but only read their own Contact record. How should the admin configure this?

A. Set Case External OWD to Public Read Only and Contact External OWD to Private; use a Sharing Set on Case scoped to the Account
B. Set both Case and Contact External OWD to Public Read Only
C. Set Case External OWD to Private; use manual sharing for each Case
D. Use Apex sharing to grant access to Cases with a custom RowCause

**Answer: A**

**Explanation:** Setting Case External OWD to Private and using a Sharing Set scoped to the Account grants all contacts at the same company read access to company Cases — without exposing Cases of other companies. Setting Contact External OWD to Private ensures users only see their own Contact record, which is the desired behavior.

**Why the others are wrong:**
- B: Public Read Only on Contact would allow customers to see all Contacts in the org, breaking data privacy
- C: Manual sharing is not scalable for large numbers of Cases; Sharing Sets are the designed declarative mechanism
- D: Apex sharing is more complex and harder to maintain than a declarative Sharing Set for this use case

---

## SECTION 4: Performance & Scalability (15%)

---

**Question 37**
One integration user owns 8 million Account records. Users across the org report that Account list views, reports, and queries are unusually slow. What is the root cause?

A. The OWD for Account is set to Private, forcing extra joins
B. Too many criteria-based sharing rules exist for Account
C. Ownership skew — one user owning a disproportionately large number of records causes the user's sharing group to become enormous, degrading query performance
D. The role hierarchy has more than 512 roles

**Answer: C**

**Explanation:** Ownership skew occurs when a single user owns an extraordinarily large number of records. Salesforce maintains an internal sharing group per user; when that group is enormous, any query that must evaluate sharing access against it becomes very slow. The recommended threshold is no more than roughly 10,000 records per user in sharing-sensitive objects.

**Why the others are wrong:**
- A: Private OWD alone does not cause this performance pattern; the skew in the sharing group is the root cause
- B: Sharing rule count contributes to recalculation time, but the primary symptom of slow queries is ownership skew
- D: Deep role hierarchies have minimal performance impact on individual queries; sharing group skew is the primary culprit

---

**Question 38**
A public group named "All Internal Users" contains 500,000 users. A sharing rule grants this group Read/Write access to a set of records. After deploying this rule, sharing recalculation runs for days and the org experiences significant degradation. What is this condition called?

A. Ownership skew
B. Lookup skew
C. Sharing group skew — a single group containing an extremely large number of users creates a massive sharing group that is expensive to compute
D. Role hierarchy depth violation

**Answer: C**

**Explanation:** Sharing group skew occurs when a sharing group (such as a public group, queue, or role) contains an abnormally large number of members. When a sharing rule targets such a group, Salesforce must create and maintain sharing entries for all those users, making recalculation extremely expensive and degrading org performance.

**Why the others are wrong:**
- A: Ownership skew is about one user owning too many records, not too many users in a group
- B: Lookup skew is a different DML performance problem related to many records sharing the same lookup target, causing row lock contention
- D: Role hierarchy depth is a separate consideration; there is no "depth violation" concept in Salesforce's role hierarchy

---

**Question 39**
A developer builds a process that updates a Lookup field on 200,000 records so that all of them point to the same parent record. Users begin reporting DML errors and timeouts on that object. What performance anti-pattern does this describe?

A. Sharing group skew
B. Ownership skew
C. Lookup skew — many records pointing to the same parent record causes row lock contention on the parent during concurrent DML operations
D. Criteria-based sharing rule overload

**Answer: C**

**Explanation:** Lookup skew occurs when a very large number of child records share the same lookup target. Salesforce uses internal locking on parent records during DML on child records; when the parent is referenced by hundreds of thousands of children, concurrent DML causes severe lock contention and timeouts.

**Why the others are wrong:**
- A: Sharing group skew involves too many users in a sharing group, not lookup field concentration
- B: Ownership skew involves too many records owned by one user, not a lookup field pointing to a shared parent
- D: Criteria-based sharing rules affect read visibility, not DML lock contention

---

**Question 40**
After enabling a territory management model for a large enterprise, sharing recalculation takes over 24 hours. An architect recommends splitting the integration user's Account portfolio. What is the architect's concern?

A. The integration user's profile grants too many permissions, slowing recalculation
B. The integration user owns too many Account records (ownership skew), making their sharing group enormous and causing recalculation to be extremely slow
C. Territory management cannot coexist with sharing rules on Account
D. The integration user is not assigned to any territory, blocking recalculation

**Answer: B**

**Explanation:** When one user (typically an integration user) owns a very high number of records, enabling or recalculating sharing for those records is extremely slow because the platform must process the user's gigantic sharing group. The architect's recommendation to split record ownership distributes the load across multiple users, reducing each individual sharing group size and accelerating recalculation.

**Why the others are wrong:**
- A: Profile permissions control access levels but do not affect recalculation speed
- C: Territory management coexists with sharing rules on Account; they are complementary mechanisms
- D: An integration user not assigned to a territory is normal; it does not block recalculation

---

**Question 41**
An admin notices that the Defer Sharing Calculations option has been enabled in Setup. What is the purpose and risk of this setting?

A. It permanently disables sharing recalculation to improve performance
B. It temporarily pauses sharing recalculation during bulk operations; records may have stale sharing until recalculation is manually resumed, creating a temporary access gap
C. It causes sharing rules to run synchronously instead of asynchronously
D. It removes the 300-sharing-rule limit while active

**Answer: B**

**Explanation:** "Defer Sharing Calculations" pauses the automatic sharing recalculation queue, allowing bulk data loads or configuration changes to complete without triggering expensive recalculations after every change. The risk is that sharing is stale during the deferral period — users may see records they should not, or miss records they should see — until recalculation is manually resumed.

**Why the others are wrong:**
- A: Deferral is temporary and must be manually disabled; recalculation is not permanently disabled
- C: Deferral has the opposite effect — it queues calculations rather than forcing synchronous execution
- D: The 300-rule limit is a platform limit and cannot be overridden by any setting

---

**Question 42**
A company's reporting reveals that an Apex batch job that processes Account records for 2 million records takes 10x longer than expected. The analysis shows that 1.9 million of those records are owned by a single service account user. What is the recommended remediation?

A. Increase the Apex batch size to 2000
B. Redistribute record ownership across multiple non-person integration users to eliminate ownership skew
C. Change Account OWD from Private to Public Read Only
D. Add the service account user to the top role in the role hierarchy

**Answer: B**

**Explanation:** Redistributing record ownership across multiple users eliminates the ownership skew that makes the single user's sharing group enormous. This reduces sharing evaluation time both during the batch job and during any future sharing recalculations. Best practice is to limit any single user's record ownership to fewer than 10,000 records on sharing-sensitive objects.

**Why the others are wrong:**
- A: Increasing batch size does not address the underlying ownership skew; it may worsen lock contention
- C: Changing OWD simplifies the sharing model slightly but does not address the performance impact of the massive sharing group
- D: Placing the service account at the top role causes all records to inherit upward to users above it — but there are none — and does not reduce the sharing group size

---

**Question 43**
An architect is designing a new object that will hold 50 million records. Most users should be able to read all records; only a small subset of users need edit access. Which OWD configuration minimizes sharing calculation overhead while meeting the access requirement?

A. Private OWD with sharing rules granting Read to all users
B. Public Read Only OWD — all users can read without any sharing rules, and edit access is granted via profiles/permission sets to the subset who need it
C. Public Read/Write OWD restricted via profiles to prevent editing
D. Controlled by Parent OWD with the parent set to Public Read Only

**Answer: B**

**Explanation:** Public Read Only OWD means every user can read all records with zero sharing rule overhead. Edit access for the select subset is then handled at the object level (CRUD via permission sets), which is independent of the sharing model and imposes no sharing calculation cost.

**Why the others are wrong:**
- A: Private OWD with a broad sharing rule is functionally equivalent but carries unnecessary recalculation overhead from maintaining those rules across 50 million records
- C: Public Read/Write cannot be effectively narrowed to prevent editing via profiles alone on a per-record basis; it gives everyone edit access
- D: "Controlled by Parent" applies only to objects that have a master-detail or lookup relationship; it cannot be chosen in isolation for arbitrary objects

---

## SECTION 5: Auditing & Monitoring (15%)

---

**Question 44**
A company's security team suspects that a user logged into Salesforce from an unauthorized country outside business hours. Which Salesforce tool provides direct evidence of the login location and time?

A. Field Audit Trail
B. Setup Audit Trail
C. Login History — it records timestamp, IP address, login type, and geographic location for every login attempt
D. Event Monitoring (Login Event log file)

**Answer: C**

**Explanation:** Login History (accessible at Setup > Users > Login History) records every login attempt with the user's name, timestamp, IP address, status (Success/Failure), login type, and browser/client information. It is the first place to look for unauthorized login activity and is retained for six months.

**Why the others are wrong:**
- A: Field Audit Trail tracks changes to field values on records; it has nothing to do with login events
- B: Setup Audit Trail tracks changes made in Setup (configuration changes), not login events
- D: Event Monitoring also provides detailed login event data but requires the Event Monitoring add-on license; Login History is available in all editions without an add-on

---

**Question 45**
An admin changed a critical permission on a profile two weeks ago and cannot remember what was changed. Which tool shows the history of Setup changes with the user who made each change?

A. Login History
B. Debug Logs
C. Setup Audit Trail — it records all Setup changes including profile edits, showing who made the change, when, and what was changed, retained for up to 180 days
D. Field History Tracking on the Profile object

**Answer: C**

**Explanation:** Setup Audit Trail captures a log of up to 180 days of changes made in the Setup menu, including profile and permission set modifications, OWD changes, sharing rule additions, and many other configuration events. It shows the full name of the administrator who made the change along with the before and after values where applicable.

**Why the others are wrong:**
- A: Login History records authentication events, not configuration changes
- B: Debug Logs capture Apex/code execution details; they do not log Setup configuration changes
- D: Profile is not a standard object with Field History Tracking; Setup Audit Trail is the correct audit mechanism for profile changes

---

**Question 46**
A regulated company must retain the complete change history of a sensitive field on the Contract object for seven years. Standard field history tracking retains data for only 18 months. What feature addresses this requirement?

A. Setup Audit Trail (retained for 6 months)
B. Field Audit Trail — an add-on that can be configured to retain field change history for up to 10 years
C. Increase the number of tracked fields per object to extend retention
D. Export field history to an external system using a nightly data loader job as the only option

**Answer: B**

**Explanation:** Field Audit Trail is a premium add-on that extends field history retention from 18 months to up to 10 years (3,650 days). It integrates with the standard FieldHistoryArchive object and is purpose-built for compliance scenarios requiring long-term data lineage.

**Why the others are wrong:**
- A: Setup Audit Trail tracks configuration changes, not record field value changes, and retains only 180 days
- C: The number of tracked fields (maximum 20 per object) controls breadth, not retention duration
- D: Exporting to an external system is a valid workaround but is not a native Salesforce feature; Field Audit Trail is the native solution

---

**Question 47**
A company wants to monitor every time a user exports data from Salesforce, downloads reports, or performs a bulk export via the Data Loader. Which feature provides this visibility?

A. Login History
B. Setup Audit Trail
C. Event Monitoring — the Report Export and Data Export event log files capture who exported data, when, and what was accessed
D. Field History Tracking on the Report object

**Answer: C**

**Explanation:** Event Monitoring (available as a paid add-on) generates hourly log files including Report Export events and API usage events. These capture the user, timestamp, record count, and other metadata for every data export, enabling detection of unusual or unauthorized data extraction.

**Why the others are wrong:**
- A: Login History records authentication events, not data export activities
- B: Setup Audit Trail records configuration changes in Setup, not data access or export events
- D: Report is not a standard object with Field History Tracking; export activity is captured by Event Monitoring, not field tracking

---

**Question 48**
An admin enables field history tracking on the Opportunity Amount field. A sales rep changes the Amount from $50,000 to $75,000. Where can the admin view this change, and for how long is it available by default?

A. In the Setup Audit Trail, retained for 180 days
B. In the Opportunity History related list and via the OpportunityFieldHistory object, retained for 18 months
C. In the Event Monitoring log files, retained for 30 days
D. In Login History under the rep's user record, retained for 6 months

**Answer: B**

**Explanation:** Field history tracking stores changes in the object's FieldHistory related object (e.g., OpportunityFieldHistory). Each tracked change records the old value, new value, date, and the user who made the change. Standard field history is retained for 18 months before being automatically purged, unless Field Audit Trail extends the retention.

**Why the others are wrong:**
- A: Setup Audit Trail records configuration changes, not record field value changes by end users
- C: Event Monitoring captures system-level events; individual field changes on records are captured by field history tracking
- D: Login History is unrelated to record field changes

---

**Question 49**
A security team wants to receive an alert every time a user with the "Sensitive Data Viewer" permission set accesses a record from an IP address outside the corporate range. Which combination of Salesforce features best meets this need?

A. Login History filtered by IP address + Field History Tracking
B. Transaction Security Policies (using Event Monitoring) — rules can evaluate real-time events and trigger actions such as blocking access or sending email alerts when conditions match
C. Setup Audit Trail + Debug Logs
D. OWD set to Private + IP range restrictions on the profile

**Answer: B**

**Explanation:** Transaction Security Policies, built on top of Event Monitoring, allow admins to write declarative or Apex-based rules that evaluate real-time events (including record access events) against conditions such as IP address ranges and user attributes. When conditions are met, the policy can block the action, notify an admin, or require multi-factor authentication.

**Why the others are wrong:**
- A: Login History is a historical, non-real-time log; it cannot trigger alerts during an active session
- C: Setup Audit Trail and Debug Logs are passive historical logs with no alerting or blocking capability
- D: IP range restrictions on profiles block login from outside the range but do not send alerts; they also prevent legitimate remote access if applied broadly

---

**Question 50**
A company recently enabled Field History Tracking on 25 fields across a single object. An admin then tries to add a 26th tracked field and receives an error. What is the cause?

A. The object has exceeded the maximum of 20 tracked fields per object
B. Field History Tracking cannot be enabled for more than 25 fields per org
C. The 26th field is a formula field, which cannot be tracked
D. The admin does not have the "Customize Application" permission

**Answer: A**

**Explanation:** Salesforce imposes a maximum of 20 tracked fields per object for standard field history tracking. Attempting to add a 21st (or more) tracked field on the same object will result in a validation error. To track more fields, the admin would need to evaluate which fields are most critical or leverage Field Audit Trail.

**Why the others are wrong:**
- B: There is no org-wide limit of 25 tracked fields; the per-object limit of 20 is the applicable constraint
- C: Formula fields indeed cannot be tracked, but the error in this scenario is caused by the per-object limit, not the field type
- D: Lack of the "Customize Application" permission would prevent editing field tracking settings at all, not specifically block adding a 26th field

---

## Answer Key Summary

| Q | Answer | Domain |
|---|--------|--------|
| 1 | C | Record-Level Access |
| 2 | B | Record-Level Access |
| 3 | C | Record-Level Access |
| 4 | C | Record-Level Access |
| 5 | C | Record-Level Access |
| 6 | B | Record-Level Access |
| 7 | B | Record-Level Access |
| 8 | B | Record-Level Access |
| 9 | B | Record-Level Access |
| 10 | B | Record-Level Access |
| 11 | B | Record-Level Access |
| 12 | C | Record-Level Access |
| 13 | A | Record-Level Access |
| 14 | B | Record-Level Access |
| 15 | A | Record-Level Access |
| 16 | B | Record-Level Access |
| 17 | C | Record-Level Access |
| 18 | B | Record-Level Access |
| 19 | B | Object & Field Access |
| 20 | B | Object & Field Access |
| 21 | C | Object & Field Access |
| 22 | B | Object & Field Access |
| 23 | B | Object & Field Access |
| 24 | A | Object & Field Access |
| 25 | B | Object & Field Access |
| 26 | B | Object & Field Access |
| 27 | C | Object & Field Access |
| 28 | B | Object & Field Access |
| 29 | B | Communities / Experience Cloud |
| 30 | B | Communities / Experience Cloud |
| 31 | B | Communities / Experience Cloud |
| 32 | B | Communities / Experience Cloud |
| 33 | A | Communities / Experience Cloud |
| 34 | B | Communities / Experience Cloud |
| 35 | B | Communities / Experience Cloud |
| 36 | A | Communities / Experience Cloud |
| 37 | C | Performance & Scalability |
| 38 | C | Performance & Scalability |
| 39 | C | Performance & Scalability |
| 40 | B | Performance & Scalability |
| 41 | B | Performance & Scalability |
| 42 | B | Performance & Scalability |
| 43 | B | Performance & Scalability |
| 44 | C | Auditing & Monitoring |
| 45 | C | Auditing & Monitoring |
| 46 | B | Auditing & Monitoring |
| 47 | C | Auditing & Monitoring |
| 48 | B | Auditing & Monitoring |
| 49 | B | Auditing & Monitoring |
| 50 | A | Auditing & Monitoring |

---

## Key Concepts to Remember

**Record-Level Access**
- OWD is the floor — it can never be overridden downward for individual records
- Role hierarchy flows upward only; peers have no automatic access to each other's records
- 300 sharing rules per object (ownership + criteria combined)
- Apex sharing with custom RowCause persists until code deletes it; system recalculation ignores it
- Implicit sharing: Account access → read on related Contacts, Opportunities, Cases; Case access → read on related Contact
- "With sharing" enforces record access but NOT field-level security

**Object & Field Access**
- CRUD and FLS are the gates; sharing rules can only open what the gate allows
- Permissions are additive — most permissive wins across profile + permission sets
- "View All" and "Modify All" bypass OWD and sharing entirely for that object
- FLS in Apex must be explicitly enforced via stripInaccessible or Schema checks

**Communities / Experience Cloud**
- High-Volume Portal Users cannot use role hierarchy; use Sharing Sets instead
- Guest users cannot be added to public groups
- External OWD is separate from internal OWD and applies to Experience Cloud users
- Sharing Sets scope access by the partner/customer's own Account relationship

**Performance & Scalability**
- Ownership skew: >~10,000 records per user degrades sharing group performance
- Sharing group skew: a single group with >~10,000 members is expensive to maintain
- Lookup skew: many records pointing to one parent causes DML lock contention
- Defer Sharing Calculations pauses recalculation — creates temporary access gaps

**Auditing & Monitoring**
- Login History: authentication events, 6-month retention, no add-on required
- Setup Audit Trail: configuration changes, 180-day retention, no add-on required
- Field History Tracking: record field changes, 18-month retention, max 20 fields/object
- Field Audit Trail: extended retention up to 10 years (paid add-on)
- Event Monitoring: real-time and historical event logs, data export tracking (paid add-on)
- Transaction Security Policies: real-time blocking/alerting based on event conditions
