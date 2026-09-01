# L08: Delegated Administration

## 🎯 Learning Objectives
- Define delegated administration and explain its purpose
- Identify what delegated administrators can and cannot do
- Configure delegated administrator groups and understand their scope limitations

## 📊 SLIDES

### Slide 1: What Is Delegated Administration?
**Visual:**
```
         ┌───────────────────────────────┐
         │     SYSTEM ADMINISTRATOR      │
         │       (Full org access)       │
         └──────────────┬────────────────┘
                        │ grants scoped authority
                        ▼
         ┌───────────────────────────────┐
         │       DELEGATED ADMIN         │
         │     [ Limited Admin Badge ]   │
         │     (No Sys Admin profile)    │
         └───┬───────────────────────────┘
             │ can manage only
      ┌──────┴───────────────────┐
      ▼                          ▼
 ┌──────────┐              ┌──────────┐
 │ User in  │              │ User in  │
 │ Role A   │              │ Role B   │
 └──────────┘              └──────────┘
   (in scope)                (in scope)

  ✗ Users outside defined roles = out of scope
```
**Content:**
- **Delegated Administration** allows a non-System Administrator user to perform specific admin tasks
- The delegated admin does NOT have a System Administrator profile
- Scope is limited to specific roles, objects, and tasks defined by the System Admin
- Common use case: department managers who need to manage their own team's users
- Configured at: **Setup > Security > Delegated Administration**
**Speaker Notes:** Delegated Administration is Salesforce's answer to the question: "How can I let a department head manage their own team without making them a full System Administrator?" The delegated admin gets a focused set of admin powers — enough to handle day-to-day user management within their group, but not enough to change org-wide settings, security policies, or configuration outside their defined scope.

### Slide 2: What Delegated Administrators CAN Do
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │           DELEGATED ADMINS CAN DO                           │
  ├──────────────────────────────────────────────────────────────┤
  │  ✓  Create and edit users in specified roles                 │
  │  ✓  Reset passwords for users in their group                │
  │  ✓  Unlock users locked out due to failed logins            │
  │  ✓  Assign specified permission sets to users               │
  │  ✓  Manage specified custom objects                         │
  │       (create, edit, delete records; customize              │
  │        fields and layouts for those objects)                │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Create and edit users** within the specified roles (but cannot assign profiles beyond what's allowed)
- **Reset passwords** for users in the delegated group
- **Unlock users** who are locked out due to failed login attempts
- **Assign specified permission sets** to users in the delegated group
- **Manage specified custom objects** (create, edit, delete records; customize fields/layouts of those objects)
**Speaker Notes:** Delegated admins can handle the most common, day-to-day user management tasks that would otherwise require a ticket to the IT admin team. Reset a locked account, onboard a new team member, assign a permission set for a project — all of these are within scope. The custom object management capability is particularly useful for teams that own their own Salesforce objects, like a custom "Project" object managed by the PMO team.

### Slide 3: What Delegated Administrators CANNOT Do
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │           DELEGATED ADMINS CANNOT DO                        │
  ├──────────────────────────────────────────────────────────────┤
  │  ✗  Create or modify Profiles                               │
  │       (can only assign pre-approved profiles)               │
  │  ✗  Create or edit Roles in the hierarchy                   │
  │  ✗  Change Org-Wide Defaults or sharing settings            │
  │  ✗  Manage Standard Objects (Accounts, Contacts, etc.)      │
  │  ✗  Access Setup areas outside their defined scope          │
  │  ✗  Grant permissions they themselves don't have            │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Cannot create or modify Profiles** — they can only assign profiles that the System Admin has pre-approved for delegation
- **Cannot create or edit Roles** in the role hierarchy
- **Cannot change Org-Wide Defaults or sharing settings**
- **Cannot manage Standard Objects** (Accounts, Contacts, Opportunities, etc.)
- **Cannot access Setup areas outside their defined scope**
- **Cannot grant permissions they themselves don't have**
**Speaker Notes:** The limitations of delegated admins are as important as their capabilities — and the exam tests both. The principle of least privilege applies here too: a delegated admin cannot hand out permissions they don't have. They cannot change profiles, roles, or org-wide security. They're working within a carefully fenced perimeter. If they need to do something outside that perimeter, they escalate to the System Administrator.

### Slide 4: Configuring Delegated Admin Groups
**Visual:**
```
  Setup > Security > Delegated Administration
  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  Step 1 ──▶  Create Delegated Group                         │
  │              (e.g., "West Region User Admins")               │
  │                     │                                        │
  │                     ▼                                        │
  │  Step 2 ──▶  Add Delegated Admin Users to Group             │
  │              (the people who will have limited admin power)  │
  │                     │                                        │
  │                     ▼                                        │
  │  Step 3 ──▶  Specify Roles They Can Manage                  │
  │              (defines their user management territory)       │
  │                     │                                        │
  │                     ▼                                        │
  │  Step 4 ──▶  Specify Profiles They Can Assign               │
  │              (controls what user types they can create)      │
  │                     │                                        │
  │                     ▼                                        │
  │  Step 5 ──▶  (Optional) Assign Custom Objects               │
  │              (objects they can administer)                   │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- Navigate to: **Setup > Security > Delegated Administration**
- **Step 1:** Create a new Delegated Group (e.g., "West Region User Admins")
- **Step 2:** Add the users who will be delegated admins
- **Step 3:** Specify which roles' users they can manage
- **Step 4:** Specify which profiles they can assign to new users
- **Step 5 (optional):** Specify custom objects they can administer
**Speaker Notes:** The configuration is straightforward but requires thoughtful planning. When you specify which roles a delegated admin can manage, you're defining their user management territory. When you specify which profiles they can assign, you're controlling what kind of users they can create. If you don't list a profile here, the delegated admin cannot assign it — this is how you prevent them from creating users with inappropriate access levels.

### Slide 5: Delegated Admin Scope — Role-Based Limits
**Visual:**
```
  FULL ROLE HIERARCHY
  ┌──────────────────────────────────────────────────────────────┐
  │             CEO                                              │
  │              │                                               │
  │       ┌──────┴──────────┐                                   │
  │    VP East           VP West                                 │
  │       │                 │                                    │
  │    East Mgr    ╔════════╧════════════════════════╗           │
  │       │        ║  DELEGATED ADMIN SCOPE           ║           │
  │    East Reps   ║   West Region Manager ◀───────── ╬── Delegated Admin
  │    (out of     ║          │                        ║           │
  │     scope)     ║   ┌──────┴──────┐                ║           │
  │                ║  West Rep A  West Rep B           ║           │
  │                ╚═══════════════════════════════════╝           │
  └──────────────────────────────────────────────────────────────┘
  ▶ Delegated Admin can only manage users within the highlighted scope
```
**Content:**
- Delegated admins can only manage users in the **specific roles** listed in their group configuration
- If a user is in a role not included in the group, the delegated admin cannot manage them
- Delegated admins can manage users in **sub-roles** of the specified roles (configurable)
- This role-based scoping ensures clean organizational ownership of user management
**Speaker Notes:** Role-based scoping is the mechanism that prevents a delegated admin from managing users outside their organizational domain. A West Region manager should be able to manage their West Region sales reps and support agents, but not the East Region team. By specifying exactly which roles are in scope, you give each department manager just the right amount of user management authority.

### Slide 6: Delegated Admin Experience — What It Looks Like
**Visual:**
```
  ┌───────────────────────────────┐   ┌───────────────────────────────┐
  │     FULL ADMIN SETUP MENU     │   │   DELEGATED ADMIN SETUP MENU  │
  ├───────────────────────────────┤   ├───────────────────────────────┤
  │ Users                         │   │ Users (scoped to their roles) │
  │ Profiles                      │   │ Permission Sets (limited)     │
  │ Permission Sets                │   │ [Custom Object A]             │
  │ Permission Set Groups          │   │ [Custom Object B]             │
  │ Roles                         │   │                               │
  │ Security Controls             │   │  (no security settings)       │
  │ Object Manager                │   │  (no profile editing)         │
  │ Flows / Process Builder       │   │  (no role management)         │
  │ Org-Wide Defaults             │   │  (no org-wide settings)       │
  │ Sharing Rules                 │   │                               │
  │ ... (full access)             │   │  Focused & simplified         │
  └───────────────────────────────┘   └───────────────────────────────┘
```
**Content:**
- Delegated admins access their tasks via Setup — but see a **simplified Setup menu**
- They see: their delegated users list, password reset options, permission set assignment
- They do NOT see: security settings, automation tools, custom object builder (for non-delegated objects), etc.
- Their setup experience is scoped to exactly what they're authorized to manage
- This reduces risk of accidental misconfiguration by non-admin users
**Speaker Notes:** One of the underrated benefits of delegated administration is that it gives department managers just enough power to be self-sufficient without overwhelming them with the full complexity of Salesforce Setup. When a delegated admin logs into Setup, they see a focused, simplified menu. There's far less risk of someone accidentally changing a critical setting when they can't even see it.

### Slide 7: Delegated Admin Use Cases
**Visual:**
```
  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  SCENARIO 1              │  │  SCENARIO 2              │  │  SCENARIO 3              │
  │  Regional Manager        │  │  IT Help Desk            │  │  Object Owner            │
  ├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
  │ Use Case: HR / Sales     │  │ Use Case: IT Support     │  │ Use Case: Operations     │
  │                          │  │                          │  │                          │
  │ • Create/edit users      │  │ • Reset passwords        │  │ • Manage custom object   │
  │   in their region        │  │   across all roles       │  │   fields & layouts       │
  │ • Reset passwords        │  │ • Unlock locked-out      │  │ • Create, edit, delete   │
  │ • Assign regional        │  │   accounts               │  │   records for their      │
  │   permission sets        │  │ Without full admin       │  │   department object      │
  │                          │  │ access                   │  │                          │
  └──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```
**Content:**
- **Scenario 1 — Regional Manager:** Create and edit users in their region, reset passwords, assign regional permission sets
- **Scenario 2 — IT Help Desk:** Reset passwords and unlock users across all roles — without full admin access
- **Scenario 3 — Object Owner:** Manage a department's custom object fields, layouts, and records without accessing the full object manager
- Reduces bottlenecks on the System Administrator team
- Scales user management without increasing System Admin headcount
**Speaker Notes:** These three scenarios represent the most common real-world applications of delegated administration. In large organizations with dozens of departments, the System Administrator team cannot feasibly handle every password reset and new hire onboarding ticket. Delegated administration distributes that responsibility to the people who are closest to the work, while keeping the keys to the kingdom safely in the hands of the certified admin team.

### Slide 8: Key Delegated Administration Exam Facts
**Visual:**
```
  ┌──────────────────────────────────┬──────────────────────────────────┐
  │           CAN DO                 │          CANNOT DO               │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ ✓ Create/edit users in           │ ✗ Create or modify Profiles      │
  │   specified roles                │ ✗ Create or edit Roles           │
  │ ✓ Reset passwords                │ ✗ Change OWD or sharing settings │
  │ ✓ Unlock users                   │ ✗ Manage Standard Objects        │
  │ ✓ Assign specified               │ ✗ Grant permissions they         │
  │   permission sets                │   don't themselves have          │
  │ ✓ Manage specified               │ ✗ Access Setup outside scope     │
  │   custom objects                 │                                  │
  ├──────────────────────────────────┴──────────────────────────────────┤
  │  No System Administrator profile required                           │
  │  Scope defined by: roles + profiles + custom objects                │
  │  Configured at: Setup > Security > Delegated Administration         │
  └─────────────────────────────────────────────────────────────────────┘
```
**Content:**
- **CAN:** Create/edit users in specified roles; reset passwords; unlock users; assign specified permission sets; manage specified custom objects
- **CANNOT:** Modify profiles or roles; change OWD or sharing settings; manage standard objects; grant permissions they don't have
- Delegated admins do NOT have the System Administrator profile
- Configuration: Setup > Security > Delegated Administration
- Scope is defined by: roles (who they manage) + profiles (what they can assign) + custom objects (what they can configure)
**Speaker Notes:** Commit the CAN and CANNOT list to memory. The exam often presents a scenario and asks whether a delegated admin can perform a specific task. The most common trick is asking whether they can modify profiles — they cannot. They can only assign pre-approved profiles. And the "cannot grant permissions they don't have" rule is a universal principle that applies here as everywhere else in Salesforce security.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 8 — Delegated Administration. This is the final lecture in Section 2, and it covers a feature that solves a very real problem in enterprise Salesforce deployments: how do you scale user management without giving everyone System Administrator access?

The answer is Delegated Administration. This feature lets you designate specific non-admin users as delegated administrators — people who can handle a defined set of admin tasks within a specific scope. The key word is scope. A delegated admin is not a junior System Administrator with most of the powers. They have a carefully defined set of permissions for a carefully defined set of users.

Let's look at what delegated admins CAN do. They can create and edit user accounts for users in the roles assigned to their delegated group. They can reset passwords and unlock users who are locked out. They can assign permission sets that the System Administrator has pre-approved for delegation. And they can manage specified custom objects — meaning they can create, edit, and delete records, and even customize fields and layouts for those specific objects.

Now here's what they CANNOT do — and this is where the exam focuses. Delegated admins cannot create or modify profiles. They can only assign profiles that the System Admin has explicitly included in the group configuration. They cannot create or edit roles in the hierarchy. They cannot change Org-Wide Defaults or any sharing settings. They cannot manage standard objects like Accounts or Opportunities. And critically, they cannot grant permissions that they themselves don't already have — the classic security principle that prevents privilege escalation.

Setting up delegated administration is done at Setup > Security > Delegated Administration. You create a named group, add the users who will serve as delegated admins, specify which roles' users they can manage, specify which profiles they can assign, and optionally specify custom objects they're authorized to administer.

Think about the role specification step carefully. If you add the "West Sales Rep" and "West Sales Manager" roles to a group, the delegated admin can manage users in those roles but cannot touch anyone in the East region or the Corporate team. This role-based scoping is what keeps the delegated authority clean and contained.

From a user experience perspective, delegated admins who navigate to Setup see a simplified version of the Setup menu — only the areas relevant to their delegated tasks. This is intentional. It reduces the cognitive load and the risk of someone accidentally wandering into a sensitive configuration area they shouldn't touch.

The business value here is significant. In a company with dozens of departments, centralizing all user management on two or three System Admins creates bottlenecks — password resets pile up, new hire access is delayed, and the admin team drowns in tickets. Delegated Administration distributes the routine work to the people closest to it, while keeping the critical infrastructure decisions with the certified admin team.

That wraps up Section 2 — User Management. You now understand how users are created, licensed, secured through profiles and permission sets, organized through the role hierarchy, and managed through delegated administration. In Section 3, we'll go deeper into the security model with Org-Wide Defaults, sharing rules, and field-level security.

## 🔔 EXAM TIPS
- **Cannot modify profiles:** Delegated admins can only assign profiles pre-approved by the System Admin — they cannot create or edit profiles themselves. This is a frequent exam trap.
- **Role-scoped authority:** A delegated admin can only manage users in the roles specified in their group configuration. They have no authority over users outside that scope.
- **No standard object management:** Delegated admins can manage specified custom objects but NOT standard Salesforce objects (Accounts, Contacts, Leads, etc.).

## ✅ LECTURE SUMMARY
- Delegated Administration allows non-System Admin users to perform specific admin tasks within a defined scope
- Delegated admins CAN: create/edit users in specified roles, reset passwords, unlock users, assign approved permission sets, manage specified custom objects
- Delegated admins CANNOT: modify profiles or roles, change OWD or sharing settings, manage standard objects, or grant permissions they don't have themselves
- Configuration is at Setup > Security > Delegated Administration — define the group, its admin users, the roles they manage, the profiles they can assign, and optional custom objects
- Delegated administration scales user management across departments without expanding System Administrator access

## ❓ MINI QUIZ

**Q1:** A delegated administrator needs to create a new user for someone joining their team. When selecting a Profile for the new user, the delegated admin cannot find the correct profile in the picklist. What is the most likely cause?
- A) The delegated admin does not have the "Create Users" permission in their profile
- B) The profile has not been included in the delegated admin group's list of assignable profiles
- C) The System Administrator has locked the profile to prevent any edits
- D) The new user's role is not included in the org's role hierarchy
**Answer:** B — Delegated admins can only assign profiles that have been explicitly added to their group's configurable profile list by the System Administrator. If a profile isn't listed there, it won't appear as an option when the delegated admin creates a user.

**Q2:** Which of the following tasks is a delegated administrator authorized to perform?
- A) Modify the Org-Wide Default sharing settings for the Account object
- B) Create a new custom Profile by cloning the Standard User profile
- C) Reset the password for a user in one of the delegated admin's specified roles
- D) Edit the role hierarchy by adding a new sub-role
**Answer:** C — Password reset for users within the delegated admin's specified roles is an authorized task. Modifying OWD, creating profiles, and editing the role hierarchy are all outside the scope of delegated administration.

**Q3:** An administrator wants department managers to create and manage users on their own teams without gaining access to system-wide security settings. What feature should the administrator configure?
- A) Grant each manager the System Administrator profile
- B) Create custom Profiles for each manager with user management permissions
- C) Configure Delegated Administration groups for each department
- D) Enable "Manage Users" in a Permission Set and assign it to managers
**Answer:** C — Delegated Administration groups are the correct tool. They allow System Admins to grant scoped user management authority — limited to specified roles, profiles, and objects — without giving managers full admin access or system-wide permissions.
