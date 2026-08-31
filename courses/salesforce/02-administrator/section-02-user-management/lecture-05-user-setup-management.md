# L05: User Setup & Management

## 🎯 Learning Objectives
- Identify the required fields for creating a new Salesforce user
- Distinguish between freezing and deactivating a user account
- Explain the difference between user licenses and feature licenses

## 📊 SLIDES

### Slide 1: User Records in Salesforce
**Visual:** Annotated screenshot of a Salesforce user record showing key fields: First Name, Last Name, Email, Username, Alias, Profile, Role, User License, Active checkbox.
**Content:**
- Every person who accesses Salesforce needs a **user record**
- Path to create: **Setup > Users > New User**
- User records control identity, access, and authentication
- The **Active** checkbox determines whether the user can log in
- A user record can exist without being Active (frozen or deactivated records)
**Speaker Notes:** User records are the foundation of identity and access in Salesforce. Every setting that governs what a person can see and do ultimately traces back to their user record — through the profile assigned, the role selected, the license type, and the active status. Creating a user is straightforward, but knowing the required fields and their implications is what the exam tests.

### Slide 2: Required Fields for New Users
**Visual:** A "New User" form with six fields highlighted in red as required: Last Name, Email, Username, Alias, Profile, User License.
**Content:**
- **Last Name:** Required; used for display
- **Email:** Required; used for notifications, password resets, and must be a valid address
- **Username:** Required; must be unique across ALL Salesforce orgs; formatted like an email address
- **Alias:** Required; 8-character max shortname used in list views
- **Profile:** Required; determines base permissions and settings
- **User License:** Required; determines which features and objects the user can access
**Speaker Notes:** The username is a common source of confusion. It must look like an email address — but it does NOT have to be a real email address. What it must be is globally unique across every Salesforce org on the planet. A common convention is to append the org name to the email — like "jane.doe@mycompany.prod" — so it stays unique when you have multiple orgs. The exam loves to test that username uniqueness is global, not just org-wide.

### Slide 3: User Licenses vs. Feature Licenses
**Visual:** Two-tier diagram: "User License" at the top as the foundation, with "Feature Licenses" below it as add-ons. Examples listed under each tier.
**Content:**
- **User License:** The base license assigned to every user; determines core access (e.g., Salesforce, Salesforce Platform, Chatter Only)
- **Feature License:** An add-on to a user license; unlocks a specific feature (e.g., Marketing User, Knowledge User, Flow User)
- A user can have one User License + multiple Feature Licenses
- Feature licenses are assigned on the user record (checkboxes in the "Additional Information" section)
- Examples of feature licenses: Marketing User, Offline User, Knowledge User, Chatter Answers User
**Speaker Notes:** Think of the user license as the foundation and feature licenses as optional upgrades. A Salesforce license lets you use the full CRM, but if that user also needs to create campaigns and mass email, they need the Marketing User feature license checked on their record. Feature licenses don't cost extra in all cases — some are included with your edition — but they do have to be explicitly enabled per user.

### Slide 4: Active Users, Inactive Users, and Freezing
**Visual:** State diagram showing three states: Active → Frozen (temporary lock, still Active) and Active → Deactivated (cannot log in, license freed). Arrows show transitions and key differences.
**Content:**
- **Active user:** Can log in and use Salesforce normally
- **Frozen user:** Login is blocked immediately; user record stays Active; license is still consumed
- **Deactivated user:** Cannot log in; license is freed and can be reassigned; record is kept permanently
- Use **Freeze** when you need to quickly lock access (e.g., terminated employee) and haven't fully offboarded
- Use **Deactivate** after you've transferred owned records and are ready to release the license
**Speaker Notes:** This is one of the most tested user management topics on the exam. Freezing is fast and reversible — great for emergencies like an immediate termination. But because the user record stays active, you're still consuming a license. Deactivating permanently blocks login and frees the license, but it's not reversible in the same quick way. Important: you cannot delete user records in Salesforce — you can only deactivate them. Records and history remain intact.

### Slide 5: Deactivating Users — Key Rules
**Visual:** Checklist-style slide with a "Before Deactivating" column and a "What Happens After" column side by side.
**Content:**
- Before deactivating: transfer open tasks, cases, opportunities to another user
- A deactivated user's owned records stay in the system — records are not deleted
- Deactivated users remain visible in record history and reports
- You **cannot deactivate** a user who is the sole system administrator
- Automated processes (Workflows, Flows) created by a deactivated user may still run
**Speaker Notes:** Deactivating a user doesn't erase their footprint — their past activity, record ownership on closed records, and audit history all remain. Open records they owned need to be transferred first to avoid orphaned work. The rule about not being able to deactivate the last system admin is important — Salesforce enforces this to prevent orgs from being locked out. Always ensure at least one other active system admin exists before deactivating one.

### Slide 6: Login History and Password Management
**Visual:** Screenshot of Setup > Users > Login History page showing columns: Username, Login Date/Time, Source IP, Browser, Status (Success / Failed). Password reset button shown on the user record.
**Content:**
- **Login History:** Setup > Users > Login History; shows last 6 months of login attempts
- Shows: username, timestamp, IP address, browser, status (success, failed attempt, challenge required)
- Password Reset: Admin can click **Reset Password** on any user record to send a reset email
- **Password Policy:** Setup > Security > Password Policies — set complexity, expiry, lockout rules
- Admins with the "Reset User Passwords and Unlock Users" permission can reset and unlock
**Speaker Notes:** Login History is your first stop when a user reports trouble logging in or when security asks for an audit. You can see exactly when someone logged in, from where, and whether any failed attempts preceded a successful login. Password reset is straightforward — one button on the user record. Password policies apply org-wide and can enforce complexity requirements, expiration intervals, and maximum failed attempts before lockout.

### Slide 7: Mass User Management
**Visual:** Setup > Users page showing the list view with checkboxes selected on multiple users, and the "Mass Email Users" and bulk action dropdown menus visible.
**Content:**
- Admins can manage multiple users simultaneously from the user list view
- Available bulk actions: **Reset Passwords**, **Freeze**, **Deactivate** (when applicable)
- Use filters in the list view to find users by profile, role, license type, or active status
- **Mass Email Users:** Send a message to a group of users (e.g., announce a system change)
- **Data Export / User Reports:** Use reports to audit user data (last login, license type, profile)
**Speaker Notes:** When onboarding a new team or doing a periodic audit, bulk user actions save significant time. The user list view with filters is your tool for slicing users by any attribute. Run a report on users who haven't logged in for 90 days to identify inactive licenses that can be freed up. This is a practical admin skill and occasionally appears as a scenario question on the exam.

### Slide 8: Key User Management Exam Facts
**Visual:** Reference card with key facts highlighted.
**Content:**
- Username must be unique across **all Salesforce orgs globally**, not just your org
- Freeze = login blocked, license still consumed; Deactivate = login blocked, license freed
- You cannot delete user records — only deactivate them
- The last active System Administrator cannot be deactivated
- Required user fields: Last Name, Email, Username, Alias, Profile, User License
- Feature licenses (e.g., Marketing User) are in addition to the base user license
**Speaker Notes:** Lock in these facts before exam day. The global uniqueness of usernames is the most commonly tested user management detail. The freeze vs. deactivate distinction is a close second — especially the fact that freezing still consumes a license. And remember: user records in Salesforce are permanent. They can be deactivated but never deleted.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 5 — User Setup and Management. This is the first lecture of Section 2, and it covers the practical fundamentals of creating and managing user accounts in Salesforce.

Every person who needs to access Salesforce gets a user record. You create these at Setup > Users > New User. Several fields are required, and knowing all of them is a common exam topic. Let me walk through the key ones.

Last Name and Email are obvious requirements. Username is where it gets interesting: the username must look like an email address, but it doesn't have to be one. More importantly, it has to be globally unique — not just in your org, but across every single Salesforce org on the planet. If someone already has the username "jane.doe@mycompany.com" in any org anywhere, you can't use it. A practical workaround is to append your org name or environment to the email address: "jane.doe@mycompany.prod" for production, "jane.doe@mycompany.dev" for development. The Alias field is an eight-character shortname used in list views. And Profile and User License are required because they define what the person can do.

Let's talk about licenses. A User License is the base license — it determines the fundamental access level. Salesforce license gives you full CRM access. Salesforce Platform is for users who only need your custom apps plus Accounts and Contacts. There are also Chatter and Community licenses for collaboration and external users. Then there are Feature Licenses, which are add-ons on top of the base license. If a user needs to send mass emails and manage campaigns, you check the Marketing User box on their record. Feature licenses are granted individually per user, in addition to their base license.

Now let's cover one of the most tested user management scenarios: what do you do when an employee leaves the company? You have two options: freeze or deactivate. Freezing a user immediately blocks their login but leaves the user record in an active state — meaning the license is still being consumed. Freeze is your emergency lever when HR calls and says someone was just terminated. Deactivating a user permanently blocks login and frees up the license so it can be reassigned to someone else. Use deactivation after you've transferred their open records and you're ready to permanently remove their access.

Here's a critical detail the exam tests: you cannot delete user records in Salesforce. Period. You can deactivate them, but they persist forever. That means past activity, record history, and field audit trails stay intact. Also, you cannot deactivate the last active System Administrator in an org — Salesforce enforces this to prevent complete lockout.

For security auditing, Login History at Setup > Users > Login History shows you six months of login activity: timestamps, IP addresses, browser types, and success or failure status. When a user reports they're locked out, start here. Password resets are done directly from the user record via the Reset Password button — the user receives an email with a link to set a new password.

In the next lecture, we go deeper into Profiles and Permission Sets — the core of Salesforce's access control model.

## 🔔 EXAM TIPS
- **Username global uniqueness:** A username must be unique across all Salesforce orgs worldwide, not just within your org. This is the single most tested user management fact.
- **Freeze vs. Deactivate:** Freezing is fast but still consumes a license. Deactivating frees the license but requires you to transfer open records first.
- **Cannot delete users:** User records are permanent in Salesforce — you can only deactivate them. This is a hard rule that the exam has tested.

## ✅ LECTURE SUMMARY
- Required user fields: Last Name, Email, Username (globally unique, email format), Alias, Profile, User License
- User Licenses define base access (Salesforce, Platform, Chatter); Feature Licenses are per-user add-ons (Marketing User, Knowledge User, etc.)
- Freezing blocks login immediately but keeps the user active and the license consumed; Deactivating blocks login and frees the license
- User records cannot be deleted — only deactivated; the last System Admin cannot be deactivated
- Login History (Setup > Users > Login History) shows six months of login data for security auditing

## ❓ MINI QUIZ

**Q1:** An employee is terminated unexpectedly during the workday. The admin needs to immediately block access. The HR team will complete the formal offboarding process next week. What should the admin do?
- A) Deactivate the user record
- B) Freeze the user record
- C) Remove the user's Profile assignment
- D) Change the user's password
**Answer:** B — Freezing immediately blocks login while leaving the user record active. This is the right choice when an emergency block is needed but the full offboarding (records transfer, license release) hasn't been completed yet.

**Q2:** A Salesforce username must be unique in which scope?
- A) Within the user's department
- B) Within the current org only
- C) Within all orgs owned by the same company
- D) Across all Salesforce orgs globally
**Answer:** D — Usernames must be globally unique across all Salesforce orgs worldwide. Two users in completely different companies cannot share the same username.

**Q3:** A user needs to send mass emails to leads and manage marketing campaigns. Their current Salesforce license does not include this capability. What should the administrator do?
- A) Assign the user a new Salesforce CRM Content license
- B) Enable the Marketing User feature license on the user record
- C) Create a custom profile with campaign management permissions
- D) Upgrade the entire org to the Unlimited edition
**Answer:** B — The Marketing User feature license, enabled on the individual user record, grants access to campaign management and mass email features. It is an add-on to the existing user license, not a replacement.
