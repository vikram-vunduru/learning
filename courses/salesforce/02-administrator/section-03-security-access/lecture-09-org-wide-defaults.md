# L09: Org-Wide Defaults (OWD)

## 🎯 Learning Objectives
- Explain what Org-Wide Defaults do and why they are the foundation of the Salesforce security model
- Identify the four OWD settings and when to apply each one
- Distinguish which objects can be set to Private and how Controlled by Parent works in master-detail relationships

## 📊 SLIDES

### Slide 1: What Are Org-Wide Defaults?
**Visual:**
```
  ┌─────────────────────────────────────────────────────────────┐
  │              SALESFORCE SHARING MODEL                       │
  │                 ("OWD sets the FLOOR")                      │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │   OWD (Org-Wide Defaults)  ──▶  Baseline for ALL users      │
  │       │  [most restrictive layer]                           │
  │       ▼                                                     │
  │   Role Hierarchy  ──▶  Opens access UP the hierarchy        │
  │       │                                                     │
  │       ▼                                                     │
  │   Sharing Rules  ──▶  Extend to peer groups/criteria        │
  │       │                                                     │
  │       ▼                                                     │
  │   Manual Sharing  ──▶  One-off record sharing               │
  │                                                             │
  │   ◀──────────────────────────────────────────────────────▶  │
  │   MORE RESTRICTIVE                          MORE OPEN       │
  └─────────────────────────────────────────────────────────────┘
```
**Content:**
- OWD defines the baseline level of access every user has to every record they do not own
- It is the most restrictive layer — other tools (Role Hierarchy, Sharing Rules, Manual Sharing) can only OPEN UP access beyond OWD
- You cannot use OWD to grant more access than a profile already allows
**Speaker Notes:** Think of OWD as the security foundation. Every other sharing mechanism sits on top of it. If OWD says Private, no one sees a record unless something else explicitly grants them access.

### Slide 2: The Four OWD Settings
**Visual:**
```
  ┌──────────────────────────┬────────────────────────────────────┐
  │  OWD SETTING             │  WHAT USERS CAN DO                 │
  ├──────────────────────────┼────────────────────────────────────┤
  │  Private         [●●●●]  │  See & edit ONLY their own records │
  │  Public Read Only [●●○○] │  View ALL records; edit only own   │
  │  Public Read/Write [●●●○]│  View AND edit ALL records         │
  │  Controlled by Parent    │  Inherits master record's OWD      │
  └──────────────────────────┴────────────────────────────────────┘

  Restrictiveness: Private > Public Read Only > Public Read/Write
```
**Content:**
- **Private** — users see and edit only records they own (most restrictive)
- **Public Read Only** — users can view all records but edit only their own
- **Public Read/Write** — users can view and edit all records
- **Controlled by Parent** — access follows the parent record's OWD (used in master-detail)
**Speaker Notes:** Private is the starting recommendation for sensitive objects like Opportunities. Public Read/Write is fine for low-sensitivity objects like Products. Controlled by Parent is automatically set on detail objects in a master-detail relationship and cannot be changed manually.

### Slide 3: Which Objects Can Be Set to Private?
**Visual:**
```
  ┌────────────────────────────────────────────────────────────┐
  │      STANDARD OBJECTS — CAN OWD BE SET TO PRIVATE?        │
  ├─────────────────────────────┬──────────────────────────────┤
  │  Object                     │  Private Available?          │
  ├─────────────────────────────┼──────────────────────────────┤
  │  Account                    │  ✔  Yes                      │
  │  Contact                    │  ✔  Yes                      │
  │  Lead                       │  ✔  Yes                      │
  │  Opportunity                │  ✔  Yes                      │
  │  Case                       │  ✔  Yes                      │
  │  Campaign                   │  ✔  Yes                      │
  │  Activity (Task / Event)    │  ✘  No Public R/W option     │
  │  User                       │  ✘  Fixed OWD (cannot change)│
  │  Custom Objects             │  ✔  All 4 settings available │
  └─────────────────────────────┴──────────────────────────────┘
```
**Content:**
- Account, Contact, Lead, Opportunity, Case, Campaign — can all be set to Private
- Activity (Task/Event) — OWD is always Controlled by Parent or Private; cannot be Public Read/Write
- Some objects like User have fixed OWD and cannot be changed
- Custom objects support all four OWD settings
**Speaker Notes:** When you navigate to Setup > Security > Sharing Settings, you will see a table listing every object and its current OWD. Not every object offers all four options — the UI only shows the settings that apply to that object.

### Slide 4: Controlled by Parent — How It Works
**Visual:**
```
  ┌──────────────────────────────────────────────────┐
  │              MASTER-DETAIL SHARING               │
  ├──────────────────────────────────────────────────┤
  │                                                  │
  │   ┌───────────────────┐                          │
  │   │     ACCOUNT       │  ← Master Record         │
  │   │  (Master Object)  │                          │
  │   │  OWD = Public     │                          │
  │   │  Read Only        │                          │
  │   └─────────┬─────────┘                          │
  │             │                                    │
  │             │  Controlled by Parent              │
  │             │  (Contact inherits Account's OWD)  │
  │             ▼                                    │
  │   ┌───────────────────┐                          │
  │   │     CONTACT       │  ← Detail Record         │
  │   │  (Detail Object)  │                          │
  │   │  OWD = Controlled │                          │
  │   │  by Parent        │                          │
  │   └───────────────────┘                          │
  │                                                  │
  │   Access to Account ──▶ Access to its Contacts   │
  └──────────────────────────────────────────────────┘
```
**Content:**
- When a detail object is set to Controlled by Parent, the detail record's access mirrors the master record's access
- A user who can view the Account can view all Contacts on that Account
- Roll-up summary fields, cascade delete, and sharing are all governed by the master
- You cannot manually set a detail object to Private when it is in a master-detail relationship
**Speaker Notes:** This setting exists because in a master-detail relationship the detail record has no independent life — it belongs to the master. Granting access to the master automatically grants access to all its detail records. This simplifies administration for tightly coupled objects.

### Slide 5: OWD Can Only RESTRICT — Never Expand Beyond Profiles
**Visual:**
```
  ╔══════════════════════════════════════════════════════════╗
  ║  ─ ─ ─ ─ ─ ─ PROFILE CEILING ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ║
  ║          (Maximum access a profile allows)              ║
  ╠══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║   Role Hierarchy  ──▶  Opens access toward ceiling       ║
  ║   Sharing Rules   ──▶  Opens access toward ceiling       ║
  ║   Manual Sharing  ──▶  Opens access toward ceiling       ║
  ║                                                          ║
  ║       ▲  (tools open access UP from OWD floor)           ║
  ║       │                                                  ║
  ╠══════════════════════════════════════════════════════════╣
  ║  ═ ═ ═ ═ ═ ═ ═ OWD FLOOR ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  ║
  ║     (Minimum default — OWD restricts DOWN to here)      ║
  ╚══════════════════════════════════════════════════════════╝

  OWD restricts ▼                  Sharing tools open up ▲
```
**Content:**
- OWD sets the minimum access floor — no user gets less access than their profile allows, but OWD can lower the default
- If a profile grants Read access to Opportunities, OWD Private still means a user only sees their own Opportunities by default
- To open up access beyond OWD, use: Role Hierarchy, Sharing Rules, or Manual Sharing
- You can never use OWD to give a user MORE access than their profile permits
**Speaker Notes:** This is one of the most tested concepts on the exam. OWD and profiles work together but in opposite directions. Profiles set the ceiling; OWD sets the floor. Everything in between is managed by the sharing tools.

### Slide 6: Where to Configure OWD in Salesforce
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  SETUP NAVIGATION PATH                                       │
  │  Setup ──▶ Security ──▶ Sharing Settings                     │
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │  ORGANIZATION-WIDE DEFAULTS                                  │
  │  ┌──────────────┬──────────────────┬──────────────────────┐  │
  │  │  Object      │  Internal Access │  External Access     │  │
  │  ├──────────────┼──────────────────┼──────────────────────┤  │
  │  │  Account     │  Private         │  Private             │  │
  │  │  Contact     │  Controlled by   │  Private             │  │
  │  │              │  Parent          │                      │  │
  │  │  Opportunity │  Private    ◄══  │  Private    ◄══      │  │
  │  │  Case        │  Private         │  Private             │  │
  │  └──────────────┴──────────────────┴──────────────────────┘  │
  │                            ▲ Default Access column           │
  │                        [Edit] button to change settings      │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- Navigate to **Setup > Security > Sharing Settings**
- The Organization-Wide Defaults table lists every object with its internal and external OWD
- Internal OWD applies to internal users; External OWD can be set separately for portal/community users
- Click **Edit** to change OWD — changes trigger a recalculation of all sharing records (can take time in large orgs)
**Speaker Notes:** Changing OWD in a large org with millions of records triggers a background sharing recalculation job. Always make OWD changes during off-peak hours and warn your team. You can monitor the job under Setup > Defer Sharing Calculations.

### Slide 7: OWD Best Practices
**Visual:**
```
  ┌──────────────────────────────┬───────────────────────────────┐
  │  ✔  DO                       │  ✘  DON'T                     │
  ├──────────────────────────────┼───────────────────────────────┤
  │  Start with Private OWD and  │  Set OWD to Public R/W for    │
  │  open up as needed           │  sensitive/competitive data   │
  ├──────────────────────────────┼───────────────────────────────┤
  │  Use Public R/W only for     │  Rely on OWD alone — use      │
  │  non-sensitive reference     │  Role Hierarchy + Rules too   │
  │  objects (e.g., Products)    │                               │
  ├──────────────────────────────┼───────────────────────────────┤
  │  Plan OWD model before       │  Change OWD frequently in     │
  │  go-live                     │  production (triggers reCalc) │
  └──────────────────────────────┴───────────────────────────────┘
```
**Content:**
- **Do:** Start with the most restrictive setting (Private) and open up as needed
- **Do:** Set OWD to Public Read/Write only for non-sensitive, reference-type objects
- **Don't:** Rely on OWD alone — combine with Role Hierarchy and Sharing Rules for a complete model
- **Don't:** Change OWD frequently in production; plan the model before go-live
**Speaker Notes:** The principle of least privilege applies directly here. Always start with Private and work outward. This prevents accidental data exposure and makes audits much easier. Revisit OWD settings during major org redesigns, not as a quick fix.

### Slide 8: Exam-Relevant OWD Scenarios
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │                   OWD SCENARIO CARDS                         │
  ├──────────────────────────────────────────────────────────────┤
  │  SCENARIO 1                                                  │
  │  "Sales reps should only see Opportunities they own"         │
  │  ──▶  OWD = PRIVATE                                          │
  ├──────────────────────────────────────────────────────────────┤
  │  SCENARIO 2                                                  │
  │  "All users can read all Accounts, but only owners edit"     │
  │  ──▶  OWD = PUBLIC READ ONLY                                 │
  ├──────────────────────────────────────────────────────────────┤
  │  SCENARIO 3                                                  │
  │  "Contacts must follow Account access rules"                 │
  │  ──▶  OWD = CONTROLLED BY PARENT                             │
  ├──────────────────────────────────────────────────────────────┤
  │  SCENARIO 4                                                  │
  │  "Everyone needs full edit rights on Price Books"            │
  │  ──▶  OWD = PUBLIC READ/WRITE                                │
  └──────────────────────────────────────────────────────────────┘
```
**Content:**
- **Scenario 1:** Sales reps should only see their own Opportunities → OWD = **Private**
- **Scenario 2:** All users need to read all Accounts but only edit their own → OWD = **Public Read Only**
- **Scenario 3:** Contacts must follow Account access → OWD = **Controlled by Parent**
- **Scenario 4:** Everyone needs full edit rights on Price Books → OWD = **Public Read/Write**
**Speaker Notes:** These scenario-style questions are common on the CRT-101 exam. Practice mapping a business requirement to the correct OWD value. When a requirement says "users should only see their own records," that is almost always Private OWD with Role Hierarchy added for manager visibility.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 9. Today we are covering Org-Wide Defaults — the single most important concept in the Salesforce sharing and security model.

Let me start with the core idea. Every record in Salesforce has an owner. By default, the owner has full access to their own records. But what about everyone else? That is exactly what Org-Wide Defaults answer. OWD defines the baseline access every user has to records they do not own.

Here is the key rule you need to burn into your memory for the exam: OWD can only restrict access. It sets the floor. You use other tools — Role Hierarchy, Sharing Rules, Manual Sharing — to open access back up. You never use OWD to grant more access. Profiles set the ceiling. OWD sets the floor.

Now let's walk through the four settings. Private means users can only see and edit records they own. If I set Opportunity to Private, a sales rep in Chicago cannot see an Opportunity owned by a rep in Boston — unless something else explicitly shares it. Public Read Only lets everyone view all records but only edit the ones they own. This is common for reference objects like Accounts in orgs where viewing is fine but edits should be controlled. Public Read/Write means everyone can view and edit everything — only use this for low-sensitivity, non-competitive data. Controlled by Parent is special — it applies to detail objects in a master-detail relationship, and it means the detail record inherits whatever access the parent record has.

To configure OWD, go to Setup, search for Sharing Settings, and you will see the Organization-Wide Defaults table. Every object is listed with its current setting. You can also set a separate OWD for external users, which is great for Experience Cloud portals.

One critical operational note: when you change OWD in a large org, Salesforce triggers a background sharing recalculation job. This can run for hours. Always make these changes during a maintenance window.

On the exam, you will see scenario questions. A question might say: "Your company requires that sales reps only see Opportunities they own, but managers should see their team's Opportunities." The answer is Private OWD combined with Role Hierarchy — not a more permissive OWD setting.

Remember, OWD is the foundation. Get this right and everything built on top of it — sharing rules, role hierarchy, teams — will make complete sense. Let's move on to the quiz.

## 🔔 EXAM TIPS
- **OWD only restricts:** OWD cannot grant access beyond what a user's profile allows — it only sets the minimum default. This is tested frequently.
- **Controlled by Parent is automatic:** When you create a master-detail relationship, the detail object's OWD is automatically set to Controlled by Parent and cannot be manually changed to Private.
- **External OWD:** Salesforce allows a separate, more restrictive OWD for external (portal/community) users. Internal OWD must be equal to or more permissive than External OWD.
- **Sharing recalculation:** Changing OWD triggers a background job in large orgs. Know that Setup > Defer Sharing Calculations can be used to batch these changes.
- **Activities OWD:** Task and Event OWD options are limited — they cannot be set to Public Read/Write for internal users. This catches many exam takers off guard.

## ✅ LECTURE SUMMARY
- Org-Wide Defaults define the baseline record access for all users who do not own a record — they set the security floor, not the ceiling
- The four OWD settings are Private, Public Read Only, Public Read/Write, and Controlled by Parent
- OWD can only restrict access; Role Hierarchy, Sharing Rules, and Manual Sharing are used to open access up beyond OWD
- Controlled by Parent automatically applies to detail objects in master-detail relationships, giving them the same access as their parent record
- OWD is configured at Setup > Security > Sharing Settings and changes trigger a sharing recalculation in the org

## ❓ MINI QUIZ

**Q1:** A Salesforce Admin sets the Opportunity object's OWD to Private. What does this mean for a sales rep who does not own a specific Opportunity record?
- A) They can view and edit the Opportunity
- B) They can view but not edit the Opportunity
- C) They cannot see the Opportunity at all unless access is explicitly granted
- D) They can see the Opportunity only if they are in the same role

**Answer:** C — With Private OWD, users cannot access records they do not own unless another sharing mechanism (Role Hierarchy, Sharing Rule, or Manual Sharing) explicitly grants them access.

**Q2:** An admin needs all internal users to be able to read all Contact records, but only record owners should be able to edit them. Which OWD setting should be applied to Contacts?
- A) Private
- B) Public Read Only
- C) Public Read/Write
- D) Controlled by Parent

**Answer:** B — Public Read Only allows all users to view records but restricts editing to record owners, which matches the requirement exactly.

**Q3:** A Contact object is in a master-detail relationship with Account (Account is the master). What OWD setting is automatically applied to the Contact object's detail side?
- A) Private
- B) Public Read Only
- C) Public Read/Write
- D) Controlled by Parent

**Answer:** D — In a master-detail relationship, the detail object's OWD is automatically set to Controlled by Parent, meaning access to the detail record is determined by the master record's sharing settings.
