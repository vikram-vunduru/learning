# L12: Field & Record Level Security

## 🎯 Learning Objectives
- Define Field-Level Security (FLS) and configure it on profiles and permission sets
- Describe the complete record-level security stack and how each layer contributes to a user's access
- Explain the difference between FLS and page layout field visibility and why both matter

## 📊 SLIDES

### Slide 1: Two Dimensions of Security
**Visual:** A 2x2 grid: rows = "Which Records Can the User See?" and "Which Fields Can the User See?"; columns = "Controlled By" and "Tool Used"; filled in with Record-Level = OWD/Role Hierarchy/Sharing Rules and Field-Level = Profiles/Permission Sets/FLS
**Content:**
- Salesforce security operates on two dimensions: **record-level** (which records) and **field-level** (which fields)
- Record-level tools: OWD, Role Hierarchy, Sharing Rules, Manual Sharing
- Field-level tools: Profiles and Permission Sets (via Field-Level Security settings)
- Both dimensions must be addressed in a complete security design
**Speaker Notes:** Many admins focus entirely on record access and forget field security. But a user who can see a record can still be blocked from seeing sensitive fields like Social Security Number, Salary, or Credit Card details — that is what Field-Level Security controls.

### Slide 2: What Is Field-Level Security (FLS)?
**Visual:** A field settings panel showing three states: Visible (checkmark), Read-Only (lock icon), Hidden (no icon/grayed out)
**Content:**
- FLS controls whether a user can **see**, **edit**, or is **completely blocked** from a specific field
- Three states per field per profile/permission set:
  - **Visible + Editable** — user can read and write the field
  - **Visible + Read-Only** — user can see the field value but cannot change it
  - **Hidden (not visible)** — field does not appear to the user at all; value is inaccessible via UI and API
**Speaker Notes:** Hidden means truly hidden — the field value does not appear in list views, record detail pages, reports, or API responses for that user. This is the strongest data protection short of removing the field entirely. Read-Only is useful for fields users need to see but not change, like a calculated pricing field.

### Slide 3: Configuring FLS on Profiles
**Visual:** Setup path mockup — Setup > Users > Profiles > [Profile Name] > Field-Level Security > [Object] > Edit, showing a table of fields with Visible and Read-Only checkboxes
**Content:**
- Navigate to **Setup > Users > Profiles > [Profile Name]**
- Click **Field-Level Security** in the profile detail page
- Select the object and click **Edit**
- For each field, set: Visible (checked/unchecked) and Read-Only (checked/unchecked)
- Alternatively, configure FLS directly from **Setup > Object Manager > [Object] > Fields > [Field Name] > Set Field-Level Security**
**Speaker Notes:** The Object Manager path is faster when you are setting FLS for a single field across many profiles — it shows all profiles in one table. The Profile path is better when you are configuring many fields for a single profile. Both paths lead to the same settings.

### Slide 4: Configuring FLS on Permission Sets
**Visual:** Side-by-side comparison: Profile FLS configuration vs. Permission Set FLS configuration, showing that permission sets can only ADD access (make visible/editable) but cannot restrict below profile settings
**Content:**
- Permission sets can only **expand** FLS — grant visibility or editability not already on the profile
- Permission sets cannot restrict FLS — if a profile makes a field editable, a permission set cannot make it read-only
- Navigate to **Setup > Users > Permission Sets > [Permission Set] > Object Settings > [Object] > Edit**
- Best practice: keep profiles at minimum access; use permission sets to grant additional field access
**Speaker Notes:** This asymmetry is important. Profiles set the floor for field access within that profile. Permission sets only add on top. If you need to restrict a field from a subset of users in the same profile, you need separate profiles — permission sets cannot do that.

### Slide 5: The Record-Level Security Stack
**Visual:** A four-layer pyramid diagram with labels and brief descriptions at each layer, arrows showing access "opens up" at each successive layer
**Content:**
- **Layer 1 — OWD:** Baseline minimum access to records a user does not own
- **Layer 2 — Role Hierarchy:** Managers automatically get access to subordinates' records (if Grant Access Using Hierarchies is enabled)
- **Layer 3 — Sharing Rules:** Automated, criteria- or owner-based access grants for groups
- **Layer 4 — Manual Sharing / Teams / Territories:** Ad hoc or collaborative access grants
**Speaker Notes:** The exam loves questions that ask you to identify what combination of tools achieves a specific access requirement. Practice walking up this pyramid for any scenario. Ask: Does OWD alone handle it? If not, does Role Hierarchy? Still not? Sharing Rules? Still edge cases? Manual Sharing.

### Slide 6: Grant Access Using Hierarchies
**Visual:** A Role Hierarchy diagram with "Grant Access Using Hierarchies" checkbox highlighted at Setup > Security > Sharing Settings, showing a checkmark on and the manager above a rep
**Content:**
- **Grant Access Using Hierarchies** — a checkbox in Sharing Settings that controls whether Role Hierarchy automatically grants managers access to subordinates' records
- Enabled by default for all standard objects; **can be disabled for custom objects**
- When disabled for a custom object, managers do NOT automatically see subordinate records — sharing rules or manual sharing must compensate
- This is a critical exam distinction for custom vs. standard objects
**Speaker Notes:** Most orgs leave this enabled, but there are legitimate use cases for disabling it on custom objects — for example, an HR review object where managers should not automatically see their direct reports' self-assessments. Disabling removes the automatic upward visibility without affecting OWD.

### Slide 7: FLS vs. Page Layout — Know the Difference
**Visual:** A split slide showing FLS on the left (affects ALL surfaces: UI, API, Reports) and Page Layout on the right (affects only the record detail/edit page UI layout)
**Content:**
- **FLS** — controls field accessibility across ALL surfaces: record pages, list views, reports, API calls, Visualforce, and flows
- **Page Layout** — controls field visibility and placement on the record detail and edit pages ONLY
- A field not on the page layout but visible via FLS can still appear in reports and be accessed via API
- A field hidden via FLS but on the page layout will NOT appear — FLS always wins
- The exam often tests this distinction: "A field is on the page layout but users cannot see it — why?"
**Speaker Notes:** FLS is enforcement; page layout is presentation. If FLS says hidden, the field is hidden everywhere — no page layout can override that. If the field is visible via FLS but just not on the page layout, a savvy user can still access it through reports or the API. For true security, use FLS. Page layouts are about user experience, not access control.

### Slide 8: Field Accessibility Matrix
**Visual:** A matrix table with rows for different profile types and columns for specific fields, showing the resulting access state (Editable, Read-Only, Hidden) for each combination
**Content:**
- To audit field access across all profiles: **Setup > Security > Field Accessibility**
- Select an object and a field, then see access level for every profile in one view
- Alternatively, view by profile: select a profile and see all fields for an object
- Use this before go-live to verify sensitive fields are properly restricted
**Speaker Notes:** Field Accessibility is an underused admin tool. Instead of clicking into each profile separately, you get a bird's-eye view of who can see what. Run this audit whenever you add a sensitive field or onboard a new team. It is also useful for troubleshooting when a user cannot see a field they should be able to access.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 12 — the last lecture in our security section. We are covering Field-Level Security and tying together the full record-level security model.

Let's start with a key insight: Salesforce security has two completely separate dimensions. Record-level security controls which records a user can access. Field-level security controls which fields on those records a user can see or edit. You need both to have a complete security model.

Field-Level Security, or FLS, has three states for each field on each profile. Visible and editable means the user can read and update the field. Visible and read-only means they see the value but cannot change it. Hidden means the field does not exist for that user — it will not appear on the record page, in list views, reports, or even API responses. This is real security, not just a display trick.

To configure FLS on a profile, go to Setup, then Users, then Profiles, open the profile, click Field-Level Security, pick the object, and click Edit. You can also go the other direction from Object Manager — open the object, click Fields, pick the field, and click Set Field-Level Security. That second path shows all profiles at once, which is much more efficient when rolling out a new sensitive field.

Permission sets can extend FLS — make a field visible or editable for a user whose profile has it hidden. But permission sets cannot restrict FLS. If the profile grants edit access to a field, you cannot use a permission set to take it back. That requires a separate profile.

Now let's review the full record-level stack. At the base is OWD — the default minimum access. Above that is Role Hierarchy — managers automatically see their subordinates' records, controlled by the "Grant Access Using Hierarchies" setting in Sharing Settings. Above that are Sharing Rules — automated group-based access. At the top is Manual Sharing and Teams for ad hoc and collaborative access.

One exam nuance: Grant Access Using Hierarchies is always on for standard objects and cannot be turned off. For custom objects, you can disable it. When disabled, managers do not automatically see their reports' records — you would need sharing rules to compensate.

The most critical distinction to memorize: FLS and page layouts serve different purposes. Page layouts control the presentation of fields on the record detail page. FLS controls whether a field is accessible at all. If FLS says hidden, no page layout can make it visible. If FLS says visible but the field is not on the page layout, users can still find it in reports and via the API. For true data security, you must use FLS — page layouts alone are insufficient.

Use the Field Accessibility tool at Setup > Security > Field Accessibility to audit who can see what across your org. It is one of the most valuable pre-go-live checks you can run.

## 🔔 EXAM TIPS
- **FLS vs. page layout:** FLS is security; page layout is presentation. FLS always wins. A field hidden via FLS will not show on a page layout even if it is placed there. This is one of the top tested distinctions in the exam.
- **Permission sets expand, not restrict:** Permission sets can only grant additional FLS access on top of what the profile provides. They cannot restrict access below the profile level.
- **Hidden field = truly hidden:** A field set to hidden via FLS is inaccessible via UI, reports, list views, and API for that user. There is no workaround.
- **Grant Access Using Hierarchies:** This can be disabled for custom objects but not standard objects. Disabling means managers do not automatically see subordinates' custom object records.
- **Field Accessibility tool:** Know that Setup > Security > Field Accessibility provides a matrix view of field access across all profiles — useful for auditing and troubleshooting.

## ✅ LECTURE SUMMARY
- Field-Level Security (FLS) controls whether a user can view, edit, or is completely blocked from a specific field, across all UI and API surfaces
- FLS is configured on Profiles and Permission Sets; permission sets can only expand FLS, not restrict it below the profile's setting
- The record-level security stack runs: OWD → Role Hierarchy → Sharing Rules → Manual Sharing, with each layer potentially opening up more access
- Grant Access Using Hierarchies can be disabled for custom objects, which removes automatic manager visibility into subordinates' records
- FLS and page layouts are different: FLS is enforcement (applies everywhere), page layouts are presentation (apply only to the record detail/edit UI)

## ❓ MINI QUIZ

**Q1:** A user's profile has the "Salary__c" field on the Account object set to hidden in FLS. The page layout for that user's profile includes the Salary__c field. What does the user see when viewing an Account record?
- A) The Salary__c field with the value displayed
- B) The Salary__c field shown as blank
- C) The Salary__c field is not displayed at all
- D) An error message indicating restricted access

**Answer:** C — FLS always overrides page layout. If FLS hides a field, the field will not appear to the user regardless of whether it is included on the page layout.

**Q2:** An admin wants to give users in the "Support Tier 2" permission set the ability to edit the "Internal_Notes__c" field, which is currently read-only on their profile. What is the correct approach?
- A) Update the profile to make Internal_Notes__c editable for all users on that profile
- B) Edit the permission set's Object Settings for the relevant object and set Internal_Notes__c to editable
- C) Add the field to the page layout as an editable field
- D) Create a new sharing rule targeting the Support Tier 2 permission set

**Answer:** B — Permission sets can expand FLS access beyond the profile setting. Editing the Object Settings for the relevant object within the permission set and enabling the field as editable will grant that additional access to users who have the permission set assigned.

**Q3:** Which of the following correctly describes the relationship between the Role Hierarchy and record access?
- A) Users in higher roles automatically lose access to records owned by users in lower roles
- B) Role Hierarchy grants managers access to records owned by their subordinates, but only when OWD is Private
- C) Role Hierarchy grants managers access to records owned by their subordinates when "Grant Access Using Hierarchies" is enabled
- D) Role Hierarchy only applies to standard objects and has no effect on custom objects

**Answer:** C — Role Hierarchy grants upward visibility when Grant Access Using Hierarchies is enabled (the default). This applies to both standard and custom objects, though the setting can be disabled for custom objects specifically.
