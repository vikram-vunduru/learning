# L11: Manual Sharing & Teams

## 🎯 Learning Objectives
- Explain when and how manual sharing is used to share individual records
- Describe Account Teams, Opportunity Teams, and Case Teams and their role in record access
- Summarize the basics of Enterprise Territory Management and how territories relate to sharing

## 📊 SLIDES

### Slide 1: What Is Manual Sharing?
**Visual:** A single record card with a "Share" button highlighted, and an arrow pointing to a user icon with a "Read/Write" badge
**Content:**
- Manual sharing allows record owners, admins, and users with Full Access to share an individual record with a specific user or group
- It is ad hoc — applied record by record, not automatically
- Grants: Read Only or Read/Write access
- Applies when automated methods (OWD, Role Hierarchy, Sharing Rules) do not cover a one-off scenario
**Speaker Notes:** Manual sharing is the last resort in the sharing stack — it handles the edge cases that rules and hierarchy cannot anticipate. It is intentional and user-driven, not automated by the system.

### Slide 2: Who Can Manually Share a Record?
**Visual:** Three icons labeled "Record Owner," "User with Full Access," and "System Administrator," each with a checkmark
**Content:**
- **Record Owner** — always has the right to manually share their own records
- **Users with Full Access** — anyone granted Full Access to a record can share it further
- **System Administrators** — can manually share any record in the org
- Manually shared access can be removed by the same users who granted it, or by an admin
**Speaker Notes:** If a user is neither the owner nor an admin, they need Full Access to share. This is important for the exam — not every user can share records they can merely see. Ownership or explicit Full Access is required.

### Slide 3: Manual Sharing UI — Where to Find It
**Visual:** Screenshot-style mockup of a record detail page showing the Sharing button in the record actions area, plus the Sharing Detail page with a "New" button
**Content:**
- Open any record → click the **Sharing** button (may be in the action menu on Lightning)
- On the Sharing Detail page, click **Add** to grant access to a user, role, or public group
- Choose access level: Read Only or Read/Write
- The sharing entry appears in the Sharing Detail list and can be removed later
**Speaker Notes:** In Lightning Experience, the Sharing button may be in the dropdown action menu rather than on the main record toolbar. It is sometimes hidden unless the admin has added it to the page layout actions. Always verify where Sharing is exposed in your org's page layout.

### Slide 4: Account Teams
**Visual:** An Account record card with a related list called "Account Team" showing multiple team member rows with their roles and access levels
**Content:**
- Account Teams let multiple users collaborate on a single Account with different access levels
- Each team member gets a **Team Role** (e.g., Account Manager, Sales Engineer, Executive Sponsor)
- Access levels per member: Account Access, Contact Access, Opportunity Access, Case Access
- Team members can be added by the record owner or an admin
**Speaker Notes:** Account Teams are about collaboration, not just visibility. A Sales Engineer on the Account Team might get Read Only on the Account but Read/Write on related Opportunities so they can update technical notes. Access is granular and role-specific.

### Slide 5: Default Account Teams
**Visual:** A user settings page showing "Default Account Team" with a list of team members and a checkbox for "Add Default Team to Accounts I Create"
**Content:**
- Users can define a **Default Account Team** in their personal settings (My Settings > Advanced User Details)
- Default teams are automatically added to new Account records the user creates
- Saves time for users who always collaborate with the same colleagues
- Admins can enable/disable Default Account Teams at Setup > Account Teams
**Speaker Notes:** Default Account Teams are a power-user feature that many reps do not know about. When you enable it in Setup, users can configure their own default team in My Settings. This removes the manual step of adding team members every time a new account is created.

### Slide 6: Opportunity Teams & Case Teams
**Visual:** Split slide — left shows an Opportunity record with Opportunity Team related list; right shows a Case record with Case Team related list
**Content:**
- **Opportunity Teams** — similar to Account Teams; add users with specific roles and access levels (Read Only or Read/Write) to a single Opportunity
- **Case Teams** — add users, roles, or contacts (including customers) to collaborate on a Case; assign Case Team Roles
- Both support default team templates that can be pre-populated
- Opportunity Teams also integrate with **Opportunity Splits** for revenue attribution
**Speaker Notes:** Case Teams are unique in that they can include customer contacts — not just internal users. This is useful for support scenarios where the customer's point of contact needs to see the case status. Opportunity Teams are common in enterprise sales where deals require a squad of specialists.

### Slide 7: Territory Management Basics
**Visual:** A geographic hierarchy diagram showing a Territory tree: US → East → Northeast / Southeast; West → Northwest / Southwest, with assignments to users and accounts
**Content:**
- **Enterprise Territory Management** assigns users and accounts to territories for segmented access
- Territories can be organized in a hierarchy — access rolls up like a role hierarchy
- Users in a territory gain access to all Accounts (and optionally Opportunities/Contacts) in that territory
- Configured at: **Setup > Users > Territory Management**
**Speaker Notes:** Territory Management is an alternative or complement to the Role Hierarchy for sales organizations that structure their business geographically or by industry segment. When a rep's territory changes, their account access updates automatically — no manual sharing needed.

### Slide 8: The Sharing Stack — Putting It All Together
**Visual:** A layered pyramid with five levels: OWD (base) → Role Hierarchy → Sharing Rules → Manual Sharing → Teams/Territories (top), each layer labeled with what it does
**Content:**
- **OWD** — sets the baseline minimum access
- **Role Hierarchy** — automatically grants managers access to subordinates' records
- **Sharing Rules** — automatically extends access to groups beyond OWD
- **Manual Sharing** — ad hoc, record-by-record access grants
- **Teams/Territories** — collaborative or geographic access models
**Speaker Notes:** This pyramid is your exam cheat sheet for any security model question. Work from the bottom up. First check OWD. Then ask if Role Hierarchy handles it. Then Sharing Rules. Manual Sharing fills the gaps. Teams and Territories are specialized tools for sales orgs. No one tool does everything — the model works because they stack.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 11. We are finishing up the record-level security stack with Manual Sharing, Teams, and a brief look at Territory Management.

So far we have covered OWD, Role Hierarchy, and Sharing Rules — all automated mechanisms. Manual Sharing is different: it is intentional and ad hoc. A record owner, someone with Full Access, or an admin decides to share one specific record with one specific person or group. You open the record, click the Sharing button, add the user or group, choose Read Only or Read/Write, and save. Done.

When would you use this? Think about exceptions. Your OWD is Private, your sharing rules cover the standard groups, but a colleague in a completely different division needs to see one deal for a joint pitch. You do not want to create a permanent sharing rule for a one-time scenario. Manual sharing handles it cleanly.

Now let's talk about Teams. Salesforce has three flavors: Account Teams, Opportunity Teams, and Case Teams. The concept is the same across all three — you add multiple users to collaborate on a single record, each with their own role and access level.

Account Teams are the most commonly configured. Each team member gets a Team Role — Account Manager, Sales Engineer, Executive Sponsor, whatever roles you define. You then set their access level for the Account itself, related Contacts, Opportunities, and Cases independently. So an Engineer might get Read Only on the Account but Read/Write on Opportunities to update technical specs.

A power feature here is Default Account Teams. In My Settings, any user can define their standard team — the people they always work with. When that user creates a new Account, the default team is automatically added. This is a huge time-saver for complex enterprise sales teams.

Opportunity Teams work the same way on individual Opportunities, with the added dimension of Opportunity Splits for revenue attribution. Case Teams can even include customer contacts, not just internal users, which is valuable for high-touch support scenarios.

Territory Management deserves its own lecture, but for the exam know the basics: Enterprise Territory Management assigns users and Accounts to geographic or industry-based territories organized in a hierarchy. Access to Accounts follows territory assignment, not just record ownership. When an Account is assigned to a territory, all users in that territory can access it.

Put it all together with the sharing pyramid: OWD at the bottom sets the floor, Role Hierarchy gives managers visibility, Sharing Rules automate access for groups, Manual Sharing handles one-offs, and Teams or Territories handle collaborative or geographic models. Every security question on the exam can be answered by walking up this pyramid.

## 🔔 EXAM TIPS
- **Who can manually share:** Only record owners, users with Full Access, and admins can use manual sharing. Regular users with only Read or Edit access cannot share records they do not own.
- **Teams vs. sharing rules:** Teams grant access on a per-record basis; sharing rules operate across a whole category of records. For broad access patterns, use sharing rules. For specific record collaboration, use teams.
- **Case Team contacts:** Case Teams can include external contacts (customers), which is unique — Account and Opportunity Teams are internal users only. This distinction appears on the exam.
- **Default team behavior:** Default Account Teams are added automatically to new records the user creates — they are not retroactively added to existing records unless you run a batch update.
- **Territory Management:** Enterprise Territory Management is a paid feature available in Enterprise Edition and above. Know it assigns accounts and users to territories and that access rolls up the territory hierarchy.

## ✅ LECTURE SUMMARY
- Manual sharing allows record owners, Full Access users, and admins to share individual records on an ad hoc basis with Read Only or Read/Write access
- Account Teams, Opportunity Teams, and Case Teams let multiple users collaborate on a single record with defined team roles and granular access levels
- Default Account Teams can be configured by users in My Settings to automatically populate their standard collaborators on new Account records
- Case Teams uniquely support external contacts (customers) as team members, unlike Account and Opportunity Teams
- Enterprise Territory Management assigns users and Accounts to a hierarchy of territories for geographic or segment-based access control

## ❓ MINI QUIZ

**Q1:** A sales rep wants to share a single Opportunity with a colleague from a different team who needs to review the deal. The OWD for Opportunities is Private. No sharing rule covers this scenario. What is the best approach?
- A) Change the Opportunity OWD to Public Read Only
- B) Create a new criteria-based sharing rule for the specific Opportunity
- C) The rep manually shares the record from the Opportunity's Sharing detail page
- D) Add the colleague to the rep's role in the Role Hierarchy

**Answer:** C — Manual sharing is designed for exactly this scenario: a one-time, record-specific access grant that automated rules do not cover. Changing OWD or the role hierarchy would have broader unintended consequences.

**Q2:** Which of the following users can include external customer contacts as team members?
- A) Account Teams
- B) Opportunity Teams
- C) Case Teams
- D) All of the above

**Answer:** C — Only Case Teams support external contacts (customers) as team members. Account Teams and Opportunity Teams are restricted to internal Salesforce users.

**Q3:** A user wants their standard set of collaborators automatically added to every new Account they create. How should this be configured?
- A) The admin creates a sharing rule targeting the user's role
- B) The user configures a Default Account Team in My Settings
- C) The admin creates a workflow rule to add team members on Account creation
- D) The user manually adds team members to each new Account after creation

**Answer:** B — Default Account Teams are configured in the user's personal settings (My Settings > Advanced User Details) and are automatically applied to new Account records the user creates.
