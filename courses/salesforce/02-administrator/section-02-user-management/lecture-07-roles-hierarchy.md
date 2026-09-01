# L07: Roles & Hierarchy

## 🎯 Learning Objectives
- Explain the role hierarchy and how it controls record visibility
- Distinguish between roles and profiles and understand when each applies
- Describe how the role hierarchy interacts with org-wide defaults and sharing rules

## 📊 SLIDES

### Slide 1: What Is a Role?
**Visual:**
```
              ┌──────────────────────┐
              │         CEO          │
              └──────────┬───────────┘
             ┌───────────┴───────────┐
             ▼                       ▼
    ┌─────────────────┐   ┌─────────────────┐
    │    VP Sales     │   │   VP Service    │
    └────────┬────────┘   └────────┬────────┘
             ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐
    │  Sales Manager  │   │ Service Manager │
    └────────┬────────┘   └────────┬────────┘
        ┌────┴────┐            ┌────┴────┐
        ▼         ▼            ▼         ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Sales Rep│ │ Sales Rep│ │Svc Agent │ │Svc Agent │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘
                      [Each node = a Role]
```
**Content:**
- A **Role** defines a user's position in the organizational hierarchy
- Roles control **record visibility** — users higher in the hierarchy can see records owned by users below them
- Roles are optional — a user can be active without a role assigned
- Unlike profiles, a user can only have **one role** at a time
- Roles are configured at: **Setup > Roles**
**Speaker Notes:** Roles and profiles are two separate concepts that serve different purposes. Profiles control what a user can do — their permissions. Roles control what records a user can see — their visibility. A user higher up in the role hierarchy gains access to records owned by everyone beneath them in the tree. This "roll up" of visibility is a fundamental design feature of Salesforce's sharing model.

### Slide 2: Roles vs. Profiles — Key Distinction
**Visual:**
```
  ┌──────────────────────┬──────────────────────────────┬──────────────────────────────┐
  │                      │          PROFILE             │           ROLE               │
  ├──────────────────────┼──────────────────────────────┼──────────────────────────────┤
  │ Controls             │ Permissions (what you DO)    │ Record visibility (what      │
  │                      │ Object CRUD, field access,   │ you SEE) based on            │
  │                      │ app/tab/login settings       │ ownership hierarchy           │
  ├──────────────────────┼──────────────────────────────┼──────────────────────────────┤
  │ Required?            │ Yes — every user needs one   │ No — optional                │
  ├──────────────────────┼──────────────────────────────┼──────────────────────────────┤
  │ One Per User?        │ Yes — exactly one            │ Yes — at most one            │
  ├──────────────────────┼──────────────────────────────┼──────────────────────────────┤
  │ Primary Purpose      │ Access control & settings    │ Data visibility & rollups    │
  └──────────────────────┴──────────────────────────────┴──────────────────────────────┘
```
**Content:**
- **Profile:** Controls permissions (what you can DO — CRUD on objects, field access, app access)
- **Role:** Controls record visibility (what records you can SEE — based on ownership hierarchy)
- Profile: **Required** for every user
- Role: **Optional** — a user can function without one
- A user has one Profile and one Role (if assigned)
- Common exam trap: confusing what profiles vs. roles control
**Speaker Notes:** This comparison is tested on virtually every practice exam and the real CRT-101. The profile defines what operations a user can perform. The role defines which records the user can access based on where they sit in the organizational tree. A sales rep could have a profile that grants Create and Edit on Opportunities, but if their OWD is Private, they can only see their own Opportunities — unless someone above them in the role hierarchy shares downward, or the sharing model opens it up.

### Slide 3: Org-Wide Defaults + Role Hierarchy = Complete Sharing Model
**Visual:**
```
  ┌────────────────────────────────────────────────────────────────┐
  │              ORG-WIDE DEFAULTS (OWD)                          │
  │   Most restrictive baseline — default access for all users    │
  └────────────────────────────────────────────────────────────────┘
                              │ opens access upward
                              ▼
       ┌──────────────────────────────────────────────────┐
       │              ROLE HIERARCHY                       │
       │   Managers see records owned by subordinates      │
       └──────────────────────────────────────────────────┘
                              │ extends access horizontally
                              ▼
            ┌────────────────────────────────────────┐
            │           SHARING RULES                 │
            │  Extend to specific groups / criteria   │
            └────────────────────────────────────────┘
                              │ one-off record exceptions
                              ▼
                  ┌──────────────────────────────┐
                  │       MANUAL SHARING          │
                  │   Individual record shares    │
                  └──────────────────────────────┘
  Each layer can only OPEN access — never restrict below OWD
```
**Content:**
- **Org-Wide Defaults (OWD):** The most restrictive baseline — defines default access for records a user doesn't own
- **Role Hierarchy:** Opens access upward — managers see records owned by subordinates
- **Sharing Rules:** Extend access to specific groups without using the hierarchy
- **Manual Sharing:** One-off record-level sharing by record owners or admins
- The sharing model is **cumulative** — access can only be opened up, never restricted beyond OWD
**Speaker Notes:** The four layers of the sharing model work together. OWD is the tightest possible baseline. The role hierarchy automatically opens access upward through the org chart. Sharing rules then extend access horizontally — across teams or to specific groups — that the hierarchy doesn't cover. Manual sharing is the last resort for individual records. Understanding that this is a one-way open model is key: you can only expand access above the OWD baseline, never restrict below it.

### Slide 4: How Role Hierarchy Affects Record Access
**Visual:**
```
              ┌─────────────────────────────┐
              │            CEO              │ ◀── sees all records below
              └──────────────┬──────────────┘
                             │ ▲ visibility rolls up
              ┌──────────────┴──────────────┐
              │          VP Sales           │ ◀── sees Sales Mgr & Rep records
              └──────────────┬──────────────┘
                             │ ▲ visibility rolls up
              ┌──────────────┴──────────────┐
              │        Sales Manager        │ ◀── sees Sales Rep records
              └──────────────┬──────────────┘
                             │ ▲ visibility rolls up
              ┌──────────────┴──────────────┐
              │          Sales Rep          │  owns Accounts / Opportunities
              └─────────────────────────────┘

  ▶ Access flows UPWARD only
  ✗ No automatic downward access (Sales Rep cannot see Manager's records)
```
**Content:**
- Users can see records owned by everyone **below them** in the hierarchy
- Users do **NOT** automatically see records owned by peers or users above them
- Role hierarchy is enabled by default on most standard objects
- **Grant Access Using Hierarchies** (on custom objects): if unchecked, role hierarchy does NOT apply
- OWD must be set to Private or Public Read Only for the hierarchy to have visible effect
**Speaker Notes:** It's important to understand the direction of visibility in the role hierarchy. Access flows upward — managers see what their subordinates own, not the other way around. A Sales Rep cannot see their manager's private records just because of the hierarchy. Also note the "Grant Access Using Hierarchies" checkbox on custom objects — it defaults to checked, but if an admin unchecks it, the role hierarchy won't grant visibility on that object even if OWD is Private.

### Slide 5: Setting Up the Role Hierarchy
**Visual:**
```
  Setup > Roles > Set Up Roles
  ┌──────────────────────────────────────────────────────────┐
  │  ROLE HIERARCHY                          [Add Role]      │
  ├──────────────────────────────────────────────────────────┤
  │  ▼ CEO                                  [Assign Users]   │
  │    ▼ VP Sales                           [Add Sub-Role]   │
  │      ▼ Sales Manager — East             [Assign Users]   │
  │            Sales Rep — East A           [Assign Users]   │
  │            Sales Rep — East B           [Assign Users]   │
  │      ▼ Sales Manager — West             [Assign Users]   │
  │            Sales Rep — West A           [Assign Users]   │
  │    ▼ VP Service                         [Add Sub-Role]   │
  │      ▶ Service Manager                                   │
  └──────────────────────────────────────────────────────────┘
  Users can be assigned to a role from this page or the user record
```
**Content:**
- Path: **Setup > Roles > Set Up Roles**
- The hierarchy is displayed as a tree; click roles to expand and add sub-roles
- **Best practice:** Model the role hierarchy after your real org chart, but don't over-engineer it
- Assign users to roles from the role detail page or from the user record
- A user can be moved to a different role at any time with no data consequences
**Speaker Notes:** Building the role hierarchy is one of the first org setup tasks a Salesforce admin does. The tree view in Setup makes it easy to visualize the structure. The key best practice is to keep it simple — don't create a role for every possible job title. Focus on the levels that matter for record visibility: you need enough levels to give managers appropriate access, but too many levels creates a complex, hard-to-maintain structure.

### Slide 6: Role Hierarchy and Reports
**Visual:**
```
  Manager: VP Sales runs "My Team's Opportunities" report
  ┌──────────────────────────────────────────────────────────────┐
  │                    VP Sales (report scope)                   │
  └──────────────────────────┬───────────────────────────────────┘
               ┌─────────────┴──────────────┐
               ▼                            ▼
      ┌─────────────────┐         ┌─────────────────┐
      │  Sales Mgr East │         │  Sales Mgr West │
      └────────┬────────┘         └────────┬────────┘
          ┌────┴────┐                 ┌────┴────┐
          ▼         ▼                 ▼         ▼
      ┌───────┐ ┌───────┐         ┌───────┐ ┌───────┐
      │ Rep A │ │ Rep B │         │ Rep C │ │ Rep D │
      └───┬───┘ └───┬───┘         └───┬───┘ └───┬───┘
          └─────────┴─────────────────┴──────────┘
                              │
                              ▼
           ┌──────────────────────────────────────┐
           │  All Opportunities from all sub-roles │
           │  roll up into VP Sales "My Team's"    │
           │  report automatically                 │
           └──────────────────────────────────────┘
```
**Content:**
- The role hierarchy powers **report rollups** — "My Team's Accounts" type reports
- A manager sees all records owned by users in their role and all subordinate roles
- Standard report filters include: **My Records**, **My Team's Records**, **All Records**
- "My Team's Records" uses the role hierarchy to determine scope
- This is a key reason why accurate role assignment matters beyond just security
**Speaker Notes:** The role hierarchy has two effects: security (who can see which records) and reporting (whose records roll up into a manager's reports). If your role hierarchy is inaccurate — for instance, a sales rep is assigned to the wrong role — their records won't roll up into the correct manager's reports. This can cause forecasting and pipeline reporting to be wrong. It's worth doing a periodic audit of role assignments to ensure the hierarchy reflects your actual org structure.

### Slide 7: Portal Roles
**Visual:**
```
  INTERNAL ROLE HIERARCHY            │   PORTAL ROLES (per Account)
  ───────────────────────────────────┼──────────────────────────────────
         CEO                         │
          │                          │   Acme Corp (Account)
    ┌─────┴──────┐                   │   ├── Customer Executive
  VP Sales   VP Service              │   └── Customer User
     │            │                  ┃
  Sales Mgr   Service Mgr            ┃   Beta Inc (Account)
     │            │           ─ ─ ─ ─╋─ ─├── Partner Manager
  Sales Reps  Service Agents         │   └── Partner User
                                     │
  ◀── Internal users ───────────────▶│◀──── External users ──────────▶
  (above portal users in hierarchy)  │ (account-scoped; isolated from
                                     │  each other)
```
**Content:**
- **Portal roles** apply to Experience Cloud (community) users — external users like customers and partners
- Portal user roles exist separately from the internal role hierarchy
- Portal users are at the **bottom** of the sharing hierarchy by default
- Portal roles are structured per account: each customer account gets its own portal role subtree
- Internal users can be above portal users in the hierarchy to see portal-submitted cases
**Speaker Notes:** If your company has an Experience Cloud site — a customer or partner portal — those external users need roles too. Portal roles are a separate subsystem within the role hierarchy, organized under each customer account. This prevents customers from seeing each other's data while allowing internal support agents to see all customer submissions. The exam occasionally tests portal role concepts, so knowing they exist and are account-scoped is useful.

### Slide 8: Key Roles and Hierarchy Exam Facts
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────────┐
  │          ROLES & HIERARCHY — EXAM REFERENCE                     │
  ├────────────────────────┬─────────────────────────────────────────┤
  │ Roles control          │ Record VISIBILITY (what you SEE)        │
  │ Profiles control       │ Permissions (what you DO)               │
  ├────────────────────────┼─────────────────────────────────────────┤
  │ Role                   │ Optional; Profile is required           │
  │ Hierarchy flow         │ UPWARD only — managers see subordinates │
  │ Custom objects         │ "Grant Access Using Hierarchies" must   │
  │                        │  be checked for hierarchy to apply      │
  │ Report rollups         │ "My Team's Records" uses role hierarchy │
  ├────────────────────────┼─────────────────────────────────────────┤
  │ Sharing layers         │ OWD → Role Hierarchy → Sharing Rules → │
  │                        │ Manual Sharing (can only open access;   │
  │                        │ never restrict below OWD)               │
  └────────────────────────┴─────────────────────────────────────────┘
```
**Content:**
- Roles control **record visibility** (what you can SEE); Profiles control **permissions** (what you can DO)
- Role is **optional**; Profile is **required**
- Access in role hierarchy flows **upward** — managers see subordinates' records, not vice versa
- "Grant Access Using Hierarchies" on custom objects controls whether hierarchy applies
- Role hierarchy impacts report rollups ("My Team's Records" filter)
- Four sharing layers: OWD → Role Hierarchy → Sharing Rules → Manual Sharing
**Speaker Notes:** Keep this comparison crisp before the exam: roles equal visibility, profiles equal permissions. The direction of access in the hierarchy — upward only — is a critical detail. And don't forget that you can disable hierarchy-based access on custom objects by unchecking "Grant Access Using Hierarchies" — that's a scenario the exam has used.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 7 — Roles and Hierarchy. In the previous lecture we covered profiles and permission sets, which control what users can do. Now we're looking at roles, which control what records users can see.

Let's nail down the fundamental distinction right away. Profiles control permissions — the actions a user can take, like creating or editing records. Roles control record visibility — which records the user can access based on their position in the organizational hierarchy. Profiles are required; every user must have one. Roles are optional; a user can exist without a role, which means they can only see records they own unless sharing rules open things up.

Now let's understand how the role hierarchy works. You set it up at Setup > Roles > Set Up Roles, and it looks like an org chart — CEO at the top, then VPs, then directors, then managers, then individual contributors at the bottom. The rule is: users higher in the hierarchy automatically gain visibility to records owned by everyone below them. A VP of Sales can see every Opportunity owned by every Sales Manager and every Sales Rep beneath them in the tree. But that visibility only flows upward — the Sales Rep cannot see the VP's private records just by virtue of being in the same hierarchy branch.

This role hierarchy is one layer of Salesforce's broader sharing model. The full model has four layers that work cumulatively. Org-Wide Defaults set the baseline — the most restrictive level of access. The role hierarchy then opens access upward. Sharing Rules extend access horizontally across groups that the hierarchy doesn't cover. And Manual Sharing handles one-off exceptions at the individual record level. Together, these layers can only open access beyond the OWD — they can never restrict below it.

There's an important detail about custom objects: each custom object has a setting called "Grant Access Using Hierarchies." By default this is checked, meaning the role hierarchy applies to that object just as it does for standard objects. If you uncheck it, the role hierarchy provides no extra access on that object, even if OWD is Private. This is a configuration option that can appear in exam scenarios.

Beyond security, the role hierarchy drives report rollups. When a manager runs a report filtered to "My Team's Records," Salesforce uses the role hierarchy to determine scope — it includes all records owned by the manager's role and every subordinate role below it. If a sales rep is assigned to the wrong role, their pipeline won't appear in the right manager's report. Accurate role assignment matters for both security and data visibility in reporting.

Finally, Experience Cloud (portal) users also have roles, but they're structured differently — organized per customer account rather than in the main internal hierarchy. This keeps customers from seeing each other's data while allowing internal support staff to oversee submissions.

In the next lecture, we'll wrap up Section 2 with Delegated Administration — a way to grant limited admin capabilities to non-admin users.

## 🔔 EXAM TIPS
- **Roles vs. Profiles distinction:** Roles = record visibility (what you SEE). Profiles = permissions (what you DO). This distinction appears on every practice exam. Know it cold.
- **Hierarchy flows upward only:** Managers gain access to subordinates' records. Subordinates do not gain access to manager records through the hierarchy alone.
- **Grant Access Using Hierarchies:** This checkbox on custom objects controls whether the role hierarchy applies to that object. If unchecked, hierarchy doesn't grant extra access even when OWD is Private.

## ✅ LECTURE SUMMARY
- Roles control record visibility (what records a user can see); Profiles control permissions (what a user can do)
- Role is optional; Profile is required; each user has at most one role
- The role hierarchy grants managers visibility to records owned by users below them; access flows upward only
- The sharing model has four layers: OWD → Role Hierarchy → Sharing Rules → Manual Sharing — each layer can only open access, never restrict it below OWD
- "Grant Access Using Hierarchies" on custom objects must be checked for the hierarchy to apply

## ❓ MINI QUIZ

**Q1:** A sales representative needs to see all Opportunities owned by users at the same level in the role hierarchy (peers). What sharing mechanism should the administrator use?
- A) Role hierarchy — peers automatically see each other's records
- B) Org-Wide Defaults set to Public Read/Write
- C) A Sharing Rule that shares records between users at the same role level
- D) Assign all reps to the same profile with View All on Opportunities
**Answer:** C — The role hierarchy only grants access upward (to managers), not sideways (to peers). A Criteria-Based or Owner-Based Sharing Rule is needed to extend access horizontally to users at the same level.

**Q2:** A Salesforce administrator creates a custom object and notices that managers cannot see records owned by their subordinates, even though the Role Hierarchy is configured correctly. What is the most likely cause?
- A) The custom object's OWD is set to Public Read/Write
- B) The "Grant Access Using Hierarchies" checkbox on the custom object is unchecked
- C) The managers do not have a Profile that grants Read access to the object
- D) Sharing Rules need to be created for the custom object
**Answer:** B — The "Grant Access Using Hierarchies" option on custom objects controls whether the role hierarchy provides automatic upward access. If unchecked, the hierarchy does not grant managers visibility to subordinates' records on that object.

**Q3:** Which of the following best describes the difference between Roles and Profiles in Salesforce?
- A) Roles control field-level access; Profiles control object-level access
- B) Roles are required; Profiles are optional
- C) Roles control record visibility through hierarchy; Profiles control user permissions
- D) Roles define login hours; Profiles define record sharing
**Answer:** C — Roles determine which records a user can see based on their position in the organizational hierarchy. Profiles determine what permissions a user has — which objects, fields, and features they can access and modify.
