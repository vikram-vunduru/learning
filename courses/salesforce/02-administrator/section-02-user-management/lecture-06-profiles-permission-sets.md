# L06: Profiles & Permission Sets

## 🎯 Learning Objectives
- Describe what a Profile controls and distinguish standard profiles from custom profiles
- Explain how Permission Sets add permissions additively without changing the Profile
- Apply the principle of least privilege using Profiles and Permission Set Groups

## 📊 SLIDES

### Slide 1: What Is a Profile?
**Visual:**
```
  ┌───────────────────────────────────────────────────────┐
  │                      PROFILE                          │
  │  ┌──────────────────┐    ┌──────────────────────────┐ │
  │  │ Object           │    │ Field Permissions        │ │
  │  │ Permissions      │    │ (Field-Level Security)   │ │
  │  └──────────────────┘    └──────────────────────────┘ │
  │  ┌──────────────────┐    ┌──────────────────────────┐ │
  │  │ App Settings     │    │ Tab Settings             │ │
  │  └──────────────────┘    └──────────────────────────┘ │
  │  ┌──────────────────┐    ┌──────────────────────────┐ │
  │  │ Login Hours      │    │ Login IP Ranges          │ │
  │  └──────────────────┘    └──────────────────────────┘ │
  │  ┌─────────────────────────────────────────────────┐  │
  │  │ Apex / Visualforce Page Access                  │  │
  │  └─────────────────────────────────────────────────┘  │
  └───────────────────────────────┬───────────────────────┘
                                  │ assigned to
                                  ▼
                            ┌───────────┐
                            │   USER    │
                            └───────────┘
```
**Content:**
- A **Profile** is a collection of settings and permissions assigned to every user
- Every user must have exactly **one Profile** assigned at all times
- Profiles control: object permissions, field permissions, app/tab settings, login hours, IP ranges
- Profiles are the **baseline** — they define the minimum (and often maximum) access a user has
- Standard profiles are provided by Salesforce; Custom profiles are copies you can modify
**Speaker Notes:** The Profile is the single most important access control assignment on a user record — a user can exist without a role, but they cannot exist without a profile. Think of the profile as the user's access blueprint. It determines what objects they can read, create, edit, or delete, what fields they can see, and when they're allowed to log in. Every setting in a profile applies equally to every user who has that profile assigned.

### Slide 2: What Profiles Control
**Visual:**
```
  ┌───────────────────────┬───────────────────────┬───────────────────────┐
  │   OBJECT PERMISSIONS  │   FIELD PERMISSIONS   │    APP SETTINGS       │
  │                       │                       │                       │
  │ Read   Create   Edit  │ Read / Edit /         │ Which Lightning apps  │
  │ Delete  View All      │ No Access per field   │ are visible to user   │
  │ Modify All            │ per object            │                       │
  ├───────────────────────┼───────────────────────┼───────────────────────┤
  │    TAB SETTINGS       │    LOGIN HOURS        │   LOGIN IP RANGES     │
  │                       │                       │                       │
  │ Default On            │ Days & times login    │ IP addresses from     │
  │ Default Off           │ is permitted for      │ which login is        │
  │ Hidden                │ this profile          │ allowed               │
  └───────────────────────┴───────────────────────┴───────────────────────┘
```
**Content:**
- **Object Permissions:** Read, Create, Edit, Delete, View All, Modify All per object
- **Field Permissions:** Read, Edit, or no access per field per object (Field-Level Security)
- **App Settings:** Which Lightning apps are visible to the user
- **Tab Settings:** Default On, Default Off, or Hidden for each tab
- **Login Hours:** Days/times users with this profile can log in
- **Login IP Ranges:** IP addresses from which login is allowed without email verification
**Speaker Notes:** Profiles are dense — they contain settings for almost every dimension of access. Object permissions control what the user can do with records. Field-level security is critical for sensitive data like Social Security numbers or salary fields. Tab settings control what shows up in the navigation bar by default. Login Hours and IP Ranges give you time-of-day and network-level security controls.

### Slide 3: Standard vs. Custom Profiles
**Visual:**
```
  ┌──────────────────────────────────┬──────────────────────────────────┐
  │       STANDARD PROFILES          │        CUSTOM PROFILES           │
  │              [lock]              │              [pencil]            │
  ├──────────────────────────────────┼──────────────────────────────────┤
  │ Provided by Salesforce           │ Created by cloning standard      │
  │ Limited editing options          │ Fully editable                   │
  │ Cannot be deleted                │ Can be deleted if unassigned     │
  │                                  │                                  │
  │ Examples:                        │ Best practice:                   │
  │ • System Administrator           │ Clone Standard User as base      │
  │ • Standard User                  │ for most custom profiles         │
  │ • Read Only                      │                                  │
  │ • Solution Manager               │ System Administrator profile     │
  │ • Chatter Free User              │ = full access; assign sparingly  │
  └──────────────────────────────────┴──────────────────────────────────┘
```
**Content:**
- **Standard Profiles:** Provided by Salesforce; limited editing options; cannot be deleted
- Common standard profiles: System Administrator, Standard User, Read Only, Chatter Free User, Marketing User
- **Custom Profiles:** Created by cloning a standard profile; fully editable; can be deleted if unused
- Best practice: Clone the **Standard User** profile as a starting base for most custom profiles
- System Administrator profile has all permissions on by default — treat it as a master key
**Speaker Notes:** You can never modify a standard profile the way you can a custom profile — Salesforce limits what you can change on them. That's why real-world admins almost always work with custom profiles that were cloned from a standard. The System Administrator profile is the most powerful one — users with this profile can do everything in the org. Assign it sparingly and audit who has it regularly.

### Slide 4: What Is a Permission Set?
**Visual:**
```
  ╔═════════════════════════════════════════════════════════╗
  ║       PERMISSION SET B    ──▶  additive only            ║
  ╠═════════════════════════════════════════════════════════╣
  ║       PERMISSION SET A    ──▶  additive only            ║
  ╠═════════════════════════════════════════════════════════╣
  ║                 PROFILE (foundation)                    ║
  ║        baseline permissions; cannot be removed          ║
  ╚═════════════════════════════════════════════════════════╝
                             │ assigned to
                             ▼
                       ┌───────────┐
                       │   USER    │
                       └───────────┘
  ▶ Permission Sets can only ADD permissions
  ▶ Cannot remove what the Profile already grants
```
**Content:**
- A **Permission Set** is a collection of permissions that can be assigned to users **in addition to** their Profile
- Key rule: Permission Sets can only **ADD** permissions — they cannot restrict or remove profile permissions
- A user can have many Permission Sets assigned simultaneously
- Permission Sets do NOT change the user's Profile assignment
- Path: **Setup > Permission Sets > New**
**Speaker Notes:** This is one of the most important concepts in Salesforce access control, and the exam tests it constantly. If a profile gives a user Read access to Accounts, a permission set can grant them Edit access — but you cannot use a permission set to take away the Read access the profile already grants. Permission sets are purely additive. This makes them perfect for handling exceptions: most users on a profile have the same base permissions, but a few need a little extra access — give those users a permission set rather than creating a whole new profile.

### Slide 5: Permission Set Groups
**Visual:**
```
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ Permission Set A│  │ Permission Set B│  │ Permission Set C│
  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
           │                   │                     │
           └───────────────────┼─────────────────────┘
                               │ bundled into
                               ▼
                  ┌─────────────────────────────┐
                  │    PERMISSION SET GROUP      │
                  │  "e.g. Sales Team Access"    │
                  └──────────────┬──────────────┘
                                 │ assigned to
                                 ▼
                           ┌───────────┐
                           │   USER    │
                           └───────────┘
```
**Content:**
- **Permission Set Groups** bundle multiple Permission Sets into a single assignable unit
- Introduced in Spring '20; simplifies managing complex permission combinations
- Path: **Setup > Permission Set Groups > New**
- Assign a group to a user instead of assigning each permission set individually
- **Muting Permission Sets:** Can be added to a group to suppress specific permissions within the group
**Speaker Notes:** If you have a user type that needs six different permission sets, managing those individually across hundreds of users is painful. Permission Set Groups solve this by letting you bundle permission sets into a group and assign the whole bundle at once. When a user's role changes, you remove one group and add another — much cleaner than toggling individual permission sets. Muting permission sets are an advanced feature that lets you carve out specific permissions within a group without rebuilding all the sets.

### Slide 6: Principle of Least Privilege
**Visual:**
```
       ┌──────────────────────────────────────────────┐
       │    SYSTEM ADMINISTRATOR PROFILE  [lock]      │
       │    Strictly controlled; assign sparingly      │
       └────────────────────┬─────────────────────────┘
                            │ only when truly needed
       ┌────────────────────┴─────────────────────────┐
       │    PERMISSION SETS  [lock]                   │
       │    Additional access added to individuals     │
       │    who need it; additive only                 │
       └────────────────────┬─────────────────────────┘
                            │ foundation for everyone
       ┌────────────────────┴─────────────────────────┐
       │    PROFILE (Everyone)  [lock]                │
       │    Minimal default access                     │
       │    Configured conservatively                  │
       └──────────────────────────────────────────────┘
                Principle of Least Privilege
```
**Content:**
- **Principle of Least Privilege:** Give users only the permissions they need — nothing more
- Profiles should be set to the minimum required access for the typical user in that group
- Use Permission Sets to grant additional access to individuals who need it
- Regularly audit permission assignments — profiles, permission sets, and system admin assignments
- Avoid cloning the System Administrator profile — it grants too much access to be a safe baseline
**Speaker Notes:** The principle of least privilege is the security philosophy that underlies all of Salesforce's access control design. If you build profiles that are overly permissive and then try to use permission sets to restrict access, you'll run into the problem that permission sets are additive only — they can't remove permissions. So the right approach is to configure profiles conservatively and use permission sets to elevate specific individuals. This is both a best practice and a recurring exam scenario.

### Slide 7: Profile vs. Permission Set — When to Use Which
**Visual:**
```
  START: Assign a permission setting
        │
        ▼
  Does this apply to ALL users of this type?
        │
  Yes ──┴──▶  ┌──────────────────────────────────┐
              │         USE PROFILE               │
              │ e.g., object CRUD, login hours,   │
              │ IP ranges, app/tab settings        │
              └──────────────────────────────────-┘
        │
  No   ▼
  Does it apply to only SOME users within the group?
        │
  Yes ──┴──▶  ┌──────────────────────────────────┐
              │      USE PERMISSION SET           │
              │ e.g., extra object access for     │
              │ select individuals                │
              └──────────────────────────────────-┘
        │
  No   ▼
  Is it temporary or cross-profile role-based access?
        │
  Yes ──┴──▶  ┌──────────────────────────────────┐
              │      USE PERMISSION SET           │
              │ Reusable across profiles; assign  │
              │ and remove as needed              │
              └──────────────────────────────────-┘
```
**Content:**
- Use **Profile** for: permissions every user of that type needs all the time (object CRUD, login hours, IP ranges)
- Use **Permission Set** for: permissions that only some users within a group need; temporary access; cross-cutting permissions that span multiple profiles
- Permission Sets are reusable: the same set can be assigned to users across different profiles
- Login Hours and IP Ranges: only configurable on Profiles, not Permission Sets
**Speaker Notes:** A question the exam often poses is "when should you use a permission set instead of creating a new profile?" The answer is: whenever only a subset of users within a profile group needs the extra access. Creating a new profile for one or two users is unnecessary overhead. A permission set assigned to those two users is cleaner, easier to audit, and doesn't proliferate profile clutter. Note that login hour and IP range restrictions are profile-only — you can't set those in a permission set.

### Slide 8: Key Profiles and Permission Sets Exam Facts
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │      PROFILES & PERMISSION SETS — EXAM REFERENCE               │
  ├────────────────────────┬─────────────────────────────────────────┤
  │ User ↔ Profile         │ Exactly ONE profile per user (required) │
  │ User ↔ Perm Sets       │ ZERO or MANY permission sets (optional) │
  │ Permission Sets        │ ADDITIVE ONLY — cannot remove profile   │
  │                        │ permissions                             │
  │ Login Hours            │ Profile ONLY — not in permission sets   │
  │ Login IP Ranges        │ Profile ONLY — not in permission sets   │
  │ Standard profiles      │ Cannot be deleted                       │
  │ Custom profiles        │ Can be deleted if unassigned            │
  │ Sys Admin profile      │ Full access — assign sparingly          │
  │ Perm Set Groups        │ Bundle multiple sets; assign as one     │
  └────────────────────────┴─────────────────────────────────────────┘
```
**Content:**
- Every user must have exactly one Profile; users can have zero or many Permission Sets
- Permission Sets are **additive only** — they cannot remove profile permissions
- Login Hours and Login IP Ranges: configurable on Profiles only, not Permission Sets
- Standard profiles cannot be deleted; Custom profiles can be deleted if unassigned
- System Administrator profile = full access — assign sparingly
- Permission Set Groups bundle multiple permission sets for easier assignment
**Speaker Notes:** Before the exam, make sure you can clearly articulate the additive-only rule for permission sets and where login hour/IP restrictions live. These are high-frequency topics. Also remember that the relationship between profiles and permission sets is not symmetrical — a profile is mandatory and singular; permission sets are optional and plural.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 6 — Profiles and Permission Sets. This is one of the most important lectures in the entire course because the profile and permission set system is the engine of access control in Salesforce.

Let's start with profiles. Every user in Salesforce must be assigned exactly one profile at all times. The profile is the user's access blueprint — it defines what objects they can read, create, edit, or delete; which fields they can see or modify; which apps and tabs appear in their interface; when they can log in; and from which IP addresses. It's a dense, comprehensive collection of settings.

Salesforce provides standard profiles that you cannot fully customize — things like System Administrator, Standard User, Read Only, and Marketing User. For most real-world admin work, you'll clone a standard profile to create a custom profile that you can tailor precisely. Best practice is to clone the Standard User profile as your starting point for most teams, and to be very conservative about who gets the System Administrator profile — it's essentially a master key to the entire org.

Now let's talk about permission sets — and this is where the exam really focuses. A permission set is an additional collection of permissions you assign to a user on top of their profile. The absolute key rule is this: permission sets are additive only. They can grant permissions that the profile doesn't grant, but they cannot remove or restrict permissions that the profile already grants. If a profile gives Read access to Accounts, no permission set can take that away.

Why does this matter? It shapes how you design access. Your profiles should be set to the minimum access that a user in that group needs. Then you use permission sets to add extra permissions for the individuals who need more. For example, most sales reps on the Sales profile can read and create Opportunities, but only senior reps need the ability to delete Opportunities. Give those senior reps a "Senior Sales" permission set that grants Delete on Opportunities rather than creating a whole separate profile just for them.

Permission Set Groups take this further by bundling multiple permission sets into one assignable unit. Instead of assigning six individual permission sets to a new employee, you assign one group. When their job changes, you swap groups rather than toggling six separate sets.

Two things you can only do in profiles, not permission sets: Login Hours and Login IP Ranges. If you need to restrict when or from where users can log in, that configuration lives on the profile.

The underlying philosophy for all of this is the principle of least privilege — give users only what they need. Build conservative profiles. Add access with permission sets when needed. Audit regularly. This is both the best practice answer and the right exam answer for most access control scenarios.

## 🔔 EXAM TIPS
- **Permission Sets are additive only:** They can only grant permissions, never remove them. If a question asks how to restrict something a profile already allows, the answer is not a permission set — it requires profile changes.
- **Login Hours/IP Ranges are profile-only:** These cannot be configured in permission sets. If the exam scenario involves login time restrictions, the answer will always involve the profile.
- **One Profile, many Permission Sets:** A user has exactly one profile but can have any number of permission sets. This structure is by design — the profile is the foundation, permission sets are optional add-ons.

## ✅ LECTURE SUMMARY
- A Profile is mandatory for every user; it controls object permissions, field permissions, app/tab settings, login hours, and IP ranges
- Standard profiles are provided by Salesforce and have limited editability; custom profiles are clones that are fully editable
- Permission Sets add permissions on top of a profile and are additive only — they cannot remove profile permissions
- Permission Set Groups bundle multiple permission sets for easier bulk assignment
- Apply the principle of least privilege: configure profiles conservatively, use permission sets for individual exceptions

## ❓ MINI QUIZ

**Q1:** A sales manager needs Delete permission on the Opportunity object, but the rest of the sales team should not. All sales users share the same Profile. What is the best solution?
- A) Create a separate Profile for the sales manager with Delete permission
- B) Enable Delete permission on the Opportunity object for the shared Profile
- C) Create a Permission Set with Delete permission on Opportunity and assign it to the manager
- D) Grant the sales manager the System Administrator profile temporarily
**Answer:** C — A Permission Set with Delete on Opportunity, assigned only to the manager, is the cleanest solution. It doesn't require a new profile or altering permissions for the entire sales team.

**Q2:** An administrator needs to ensure that the customer service team can only log in during business hours (Monday–Friday, 8am–6pm). Where should this restriction be configured?
- A) On each user's individual user record
- B) In a Permission Set assigned to all service team members
- C) In the customer service team's Profile (Login Hours)
- D) In Setup > Security > Session Settings
**Answer:** C — Login Hours are configured on the Profile, not on individual user records or in permission sets. All users sharing that profile will be subject to the same login hour restrictions.

**Q3:** Which of the following statements about Permission Sets is TRUE?
- A) A user can only be assigned one permission set at a time
- B) Permission sets can remove permissions that were granted by the user's profile
- C) Permission sets can only be assigned to users with a specific license type
- D) Permission sets grant additional permissions on top of what the profile already allows
**Answer:** D — Permission sets are additive. They extend a user's access beyond what the profile grants but cannot restrict or remove profile-granted permissions. A user can have any number of permission sets assigned simultaneously.
