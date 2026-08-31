# L03: Salesforce Security Model (App Builder Perspective)

## 🎯 Learning Objectives
- Describe the four layers of the Salesforce security model and how they interact
- Design an appropriate OWD setting for a new custom app's objects
- Explain the difference between object permissions, field-level security, and record access
- Decide when to use permission sets versus profiles for app-specific access

---

## 📊 SLIDES

### Slide 1: The Four-Layer Security Model
**Visual:** Vertical stack of four boxes, each nested inside the next (like Russian dolls or concentric rectangles). Outermost: "OWD (Organization-Wide Defaults)" — most restrictive baseline. Second: "Role Hierarchy — opens up access up the hierarchy." Third: "Sharing Rules — opens up access across hierarchy." Innermost: "Manual Sharing — one-off grants."
**Content:**
- Salesforce security is **additive** — you start with the most restrictive baseline and open up
- **Layer 1 — OWD:** Sets the floor. Minimum access any user has to records they don't own.
- **Layer 2 — Role Hierarchy:** Managers see records owned by their subordinates.
- **Layer 3 — Sharing Rules:** Automatically share records with groups or roles who don't have access via hierarchy.
- **Layer 4 — Manual Sharing:** Record owners or admins manually grant access to specific users.
- You can only **grant** access through these layers — never restrict what OWD already opens
**Speaker Notes:** The most important word in Salesforce security is "additive." You set the baseline with OWD and then add access through each layer. This means if OWD is too permissive, no lower layer can fix it — there's no "take away" mechanism below OWD. Always start restrictive and open up. This principle is the foundation of every security design decision you'll make as an app builder.

### Slide 2: Organization-Wide Defaults (OWD)
**Visual:** Table showing OWD settings for records: "Private" (owner and above in hierarchy), "Public Read Only" (everyone can read, owner can edit), "Public Read/Write" (everyone can read and edit), "Public Read/Write/Transfer" (for Leads/Cases). Callout box: "Default for new custom objects = PRIVATE."
**Content:**
- OWD defines access for records you **don't own**
- If you own a record, you always have full access regardless of OWD
- OWD options vary by object type — most have Private, Public Read Only, Public Read/Write
- **Critical exam fact:** Default OWD for new custom objects is **Private**
- Start designing with the most restrictive OWD that still allows business to function, then open up
**Speaker Notes:** The OWD exam trap is huge. When you create a new custom object, Salesforce defaults the OWD to Private. This means no one except the record owner and their hierarchy can see the record. If your users are complaining they can't see each other's records after you built a new app, the first thing to check is the OWD setting. This catches people every day in production orgs and it definitely shows up on the exam.

### Slide 3: Role Hierarchy
**Visual:** Org chart tree: CEO → VP Sales, VP Support → Regional Managers → Sales Reps. Arrows flowing upward labeled "Record visibility flows up the hierarchy." A Sales Rep's record is visible to their Regional Manager, VP Sales, and CEO.
**Content:**
- Role hierarchy grants **read, read/write, or full access** to records owned by subordinates
- Managers automatically see records below them in the hierarchy (when OWD is not Public Read/Write)
- Role hierarchy is about **data access**, not reporting structure — it's okay to have a simplified hierarchy
- The hierarchy is optional per object — controlled by the "Grant Access Using Hierarchies" setting
- Important: Role hierarchy only works when OWD is **NOT** set to Public Read/Write
**Speaker Notes:** The role hierarchy is your primary mechanism for ensuring managers can see their teams' data. Design it to reflect data visibility needs, not necessarily the organizational chart. A CEO might sit above a VP in the hierarchy even though they manage 5 other VPs — that's fine. What matters is: whose records does this person need to see? Don't over-complicate it. A flat hierarchy means almost everyone can see everyone's data, which is often fine for smaller orgs.

### Slide 4: Sharing Rules
**Visual:** Two-column diagram. Left: Role Hierarchy tree (vertical visibility). Right: Sharing Rule arrows showing cross-hierarchy sharing — East Region Sales shares with West Region Sales, Support Team shares with Management group. Label: "Sharing Rules fill the gaps the hierarchy can't cover."
**Content:**
- Sharing Rules open access **across** the role hierarchy — to users at the same level or in different branches
- **Criteria-based sharing:** Share records matching filter criteria (e.g., Industry = Technology) with a group
- **Ownership-based sharing:** Share records owned by a role/group with another role/group
- Sharing Rules can only grant access; they cannot restrict access below OWD
- Maximum recommended sharing rules per object: 300 (more gets complex to manage)
**Speaker Notes:** Here's the scenario where you need sharing rules: two sales regions should see each other's accounts for cross-sell opportunities, but neither reports to the other. The role hierarchy can't handle this — they're in separate branches. A sharing rule says "if Account Owner is in East Region, also share with West Region." Criteria-based sharing is even more powerful — you can share records based on field values, not just ownership. These are excellent tools for complex multi-team access scenarios.

### Slide 5: Object Permissions, FLS, and Record Access — How They Work Together
**Visual:** Three-filter diagram. User request flows through: (1) Object Permissions — "Can this user access the Account object at all?" → (2) Record Access — "Can this user access this specific Account record?" → (3) FLS — "Can this user see the Phone field on this Account?" All three must pass for the user to see the field value.
**Content:**
- **Object Permissions** (on Profile/Permission Set): Can read, create, edit, delete objects of this type?
- **Record Access** (OWD + Hierarchy + Sharing): Can access this specific record?
- **Field-Level Security (FLS)**: Can see/edit this specific field?
- All three layers must allow access — the most restrictive wins at each step
- A user can have Read on Account objects, access to a specific Account record, but still not see a specific field if FLS hides it
**Speaker Notes:** Think of these as three separate gates that must all be open for data to flow through. Gate 1 is object-level — does the user have any permission on the Account object? Gate 2 is record-level — can they access this particular Account? Gate 3 is field-level — even if they can see the Account record, can they see the Annual Revenue field? All three gates are independent. When users report they can't see data, you debug by checking each gate in order: object access first, then record access, then field-level security.

### Slide 6: Profiles vs. Permission Sets for App-Specific Access
**Visual:** Two-column comparison. Left "Profile": one per user, broad baseline access, affects every object and system permission. Right "Permission Set": multiple per user, targeted additions, ideal for app-specific access. Arrow from Profile to Permission Set labeled "Baseline → Extension."
**Content:**
- **Profile:** Every user has exactly one. Sets the baseline — what they can access by default.
- **Permission Set:** Optional add-ons assigned to specific users. Grants additional access on top of the profile.
- **Best practice for custom apps:** Give users a minimal profile, then assign a permission set for your app's objects
- Permission Set Groups: Bundle multiple permission sets into one assignment for cleaner management
- When you deploy a new app, create a permission set with the object/field permissions your app needs — don't modify the profile
**Speaker Notes:** Here's the modern Salesforce security guidance: profiles are being deprecated in favor of permission sets — don't rely on profiles for everything. Use profiles for the bare minimum: what UI they see (Lightning vs. Classic — and it's all Lightning now), login hours, IP restrictions, and baseline system permissions. For everything related to your custom app, use permission sets. This way, if you need to revoke app access, you just remove the permission set. If you built app access into the profile, removing it requires editing the profile — which affects everyone on that profile.

### Slide 7: Designing Security for a New Custom App
**Visual:** Step-by-step process diagram: (1) Identify user groups who will use the app. (2) Set OWD for each custom object (default = Private; decide if that's right). (3) Design role hierarchy additions if needed. (4) Create sharing rules for cross-group access. (5) Create permission sets for object and FLS access. (6) Test as each user persona before go-live.
**Content:**
- Always start with the security design **before** building the UI
- Ask: "Who should see which records?" → OWD and sharing design
- Ask: "Who should be able to do what to records?" → Object permissions and FLS design
- Never assume security works correctly — test by logging in as each user type
- The "View Setup and Configuration" permission is broad — don't grant it to regular users
**Speaker Notes:** Security design is often treated as an afterthought — builders focus on the data model and automation and bolt security on at the end. That's backwards. Security decisions affect your data model (who owns records determines OWD choices), your role hierarchy design, and your permission sets. Design security early, document it, and test it thoroughly. Users who can see more data than they should will immediately trust your app less — and rightfully so.

### Slide 8: Common Security Design Mistakes
**Visual:** Red X list of common mistakes: (1) Setting OWD to Public Read/Write "to keep it simple." (2) Putting all permissions in profiles. (3) Not testing as non-admin users. (4) Using role hierarchy for org chart instead of data visibility. (5) Forgetting FLS — users see the record but not the field.
**Content:**
- **Mistake 1:** Public Read/Write OWD means everyone can edit everyone's records — usually too permissive
- **Mistake 2:** Modifying profiles instead of using permission sets creates maintenance nightmares
- **Mistake 3:** Admins always see everything — always test your security model as a regular user
- **Mistake 4:** Role hierarchy based on org chart instead of data visibility — these are different things
- **Mistake 5:** Setting object-level Read on a custom field but forgetting to set FLS — field invisible to user
**Speaker Notes:** Every one of these mistakes is something real app builders do, and most of them show up in exam scenarios. The most insidious is Mistake 5 — the FLS gap. You can give a user full access to an object through their profile, but if you created a new custom field and forgot to update the field-level security for their profile or permission set, they will not see that field. It just disappears from the page layout. Always check FLS when a user says "I can see the record but not a specific field."

---

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 03 — the Salesforce Security Model from an App Builder's perspective. This topic represents a significant portion of the Salesforce Fundamentals domain, and security design decisions ripple through every other part of your app.

The entire Salesforce security model, shown on Slide 1, is built around one principle: **start restrictive, then open up**. You set a floor — the minimum access anyone has — and then you use three additional layers to grant more access where the business requires it. This is the additive model. You can only add access through these layers; you can never take it away below the OWD. So if your OWD is wrong, no amount of sharing rules will fix it.

Slide 2 — here's your biggest exam trap. When you create a new custom object, the default OWD is **Private**. Not Public Read Only, not Public Read/Write — Private. This means if you build a new app with five custom objects and forget to think about OWD, every record in those objects is only visible to the record owner and their management chain. Your users will think the app is broken. It's not broken — it's working exactly as designed. Just not how you intended.

Role hierarchy on Slide 3 is your mechanism for "managers see their team's records." Design your role hierarchy based on data visibility needs, not your org chart. These two things might align, but they don't have to. A simpler hierarchy is easier to maintain. The key rule: role hierarchy only does something meaningful when OWD is Private or Public Read Only. If OWD is Public Read/Write, everyone already sees everything and the hierarchy is irrelevant.

Slide 4 covers sharing rules — your tool for cross-hierarchy access. The two scenarios where you need sharing rules: same-level collaboration (two departments that don't report to each other need shared data), and criteria-based sharing (share high-value records — say, Opportunities over $1 million — with a special review team regardless of ownership).

Slide 5 is crucial: three separate security gates must all be open for a user to see a field value. Object permissions (can they access the object type at all), record access (can they access this specific record), and field-level security (can they see this field). When a user can't see data, you debug in that order.

Slide 6 — modern Salesforce security practice: profiles for baselines, permission sets for everything else. This is especially true for custom apps. Build a permission set that packages all the object and FLS access your app needs, and assign it to the users who need app access. Clean, manageable, reversible.

Slide 7 walks you through designing security for a new app in six steps, and Slide 8 covers the mistakes every app builder eventually makes. The most important: always test your security model as a non-admin user. Admins see everything by default, which makes you think the app is working perfectly when it might be completely broken for regular users.

---

## 🔔 EXAM TIPS
- **OWD default for custom objects is Private:** This is one of the most tested facts in the security domain. When an exam scenario describes users unable to see each other's records on a new custom app, the answer almost always involves reviewing and adjusting OWD settings.
- **Additive only:** The security model only adds access — it never restricts. If OWD is Public Read/Write, no sharing rule or profile setting can restrict record access below that level.
- **Three-gate model:** Exam scenarios often describe a user who can see a record but not a specific field. The answer is FLS — field-level security is configured separately from record access.
- **Permission sets over profiles:** Exam questions asking about best practices for granting access to a new custom app will favor permission sets over modifying profiles.
- **Grant Access Using Hierarchies:** This setting controls whether the role hierarchy shares records for a given object. It can be disabled per object if you don't want managers to automatically see subordinates' records.

---

## ✅ LECTURE SUMMARY
- The Salesforce security model has four additive layers: OWD → Role Hierarchy → Sharing Rules → Manual Sharing
- OWD for new custom objects defaults to Private — always design OWD deliberately before deploying a new app
- Three separate gates govern field visibility: object permissions, record access (OWD/hierarchy/sharing), and field-level security
- Use permission sets (not profiles) to package app-specific access for custom objects and fields
- Always test security by logging in as a non-admin user — admins bypass most access restrictions

---

## ❓ MINI QUIZ

**Q1:** An App Builder creates a new custom object called Inspection__c. After deploying it to production, sales reps report they cannot see any inspection records created by their colleagues. What is the most likely cause?
- A) The App Builder forgot to add the object to the Sales App
- B) The OWD for Inspection__c is set to Private, which is the default for new custom objects
- C) The role hierarchy does not include a Sales Rep role
- D) The sales reps do not have the "View All Data" system permission

**Answer:** B — New custom objects default to Private OWD. Sales reps can only see records they own or records owned by users below them in the role hierarchy. Changing OWD to Public Read Only (or creating sharing rules) would resolve this.

**Q2:** A company has three regional sales teams. Regional managers should see all records owned by their team members, but not records from other regions. Sales reps in the same region should not see each other's records. Which security configuration achieves this?
- A) OWD = Public Read Only, no sharing rules needed
- B) OWD = Private, role hierarchy with managers above their reps
- C) OWD = Public Read/Write, with sharing rules restricting cross-region access
- D) OWD = Private, sharing rules granting all reps in a region access to all regional records

**Answer:** B — OWD Private means reps cannot see each other's records by default. The role hierarchy ensures regional managers see their reps' records (records flow up the hierarchy). No cross-region sharing rules are needed because the requirement is that other regions should NOT see the records.

**Q3:** A user has Read access on the Account object through their profile. They can navigate to an Account record, but the Annual Revenue field is not visible on the page. What is the most likely cause?
- A) The Annual Revenue field does not exist on the Account object
- B) The field is hidden on the page layout for this user's record type
- C) The user's profile or permission set has "Read" access restricted on the Annual Revenue field via FLS
- D) The user's OWD setting for Account is Private

**Answer:** C — Field-Level Security (FLS) controls field visibility independently of record access. Even if a user can see the record, FLS can hide individual fields. If the field isn't visible on the record page and isn't on the page layout either, checking FLS settings on the user's profile or permission set is the next debugging step.
