import type { Resource } from "./resources";

export const ADMIN_RESOURCES: Record<string, Resource[]> = {

  // ── Overview: Salesforce Administrator Certification Course ──────────────
  "admin-overview": [
    { type: "trailhead", title: "Admin Beginner Trail — Trailhead", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "The official Trailhead starting point for every aspiring Salesforce Admin — covers navigation, data model, and security fundamentals.", duration: "~10 hr", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Salesforce Administrator Credential — Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential", description: "Official Salesforce trailmix that maps directly to the exam outline — use this as the backbone of your study plan.", duration: "~40 hr", level: "Beginner" },
    { type: "docs", title: "Salesforce Administrator Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/administrator", description: "Official exam guide with exact topic weights, prerequisite experience, and registration links. Bookmark before teaching.", level: "Beginner" },
    { type: "blog", title: "Salesforce Admin Certification Study Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Comprehensive third-party study guide from one of the most trusted Salesforce community sites — great companion for students.", level: "Beginner" },
    { type: "udemy", title: "Salesforce Administrator Certification — Udemy (Top Rated)", url: "https://www.udemy.com/courses/search/?q=salesforce+administrator+certification&sort=highest-rated", description: "Browse the highest-rated Salesforce Admin certification courses on Udemy to benchmark your curriculum against competitors.", level: "Beginner" },
  ],

  // ── L01: Salesforce Platform Navigation & Setup ──────────────────────────
  "admin-l01": [
    { type: "trailhead", title: "Admin Beginner Trail — Trailhead", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers the Lightning Experience UI, App Launcher, and basic platform navigation — essential orientation for new admins.", duration: "~10 hr", level: "Beginner" },
    { type: "docs", title: "Get Started with Salesforce Help — Salesforce Docs", url: "https://help.salesforce.com/s/articleView?id=sf.basics_nav_lex.htm&type=5", description: "Step-by-step walkthrough of Lightning Experience navigation, including the App Launcher, global search, and favorites.", level: "Beginner" },
    { type: "youtube", title: "Salesforce for Beginners — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Salesforce Ben's channel includes beginner walkthroughs of the Lightning UI and common admin workflows.", level: "Beginner" },
    { type: "blog", title: "Salesforce Lightning Experience Overview — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Overview of what changed from Classic to Lightning Experience — important context for admin candidates.", level: "Beginner" },
  ],

  // ── L02: User Setup & Management ─────────────────────────────────────────
  "admin-l02": [
    { type: "trailhead", title: "Admin Beginner — User Management Module", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers creating and deactivating users, licenses, and the difference between active and frozen users.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Manage Users — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.users_mgmt.htm&type=5", description: "Official documentation for creating, editing, deactivating, and freezing user accounts — authoritative source for exam questions.", level: "Beginner" },
    { type: "docs", title: "User Licenses Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.users_license_types_available.htm&type=5", description: "Explains Salesforce, Platform, and Community license types — an area frequently tested on the Admin exam.", level: "Beginner" },
    { type: "youtube", title: "Salesforce User Management Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical walkthroughs of user creation and management tasks directly relevant to the Admin certification exam.", level: "Beginner" },
    { type: "blog", title: "Salesforce User Management Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Study notes covering user setup, licenses, and related exam topics from a practitioner perspective.", level: "Beginner" },
  ],

  // ── L03: Profiles & Permission Sets ──────────────────────────────────────
  "admin-l03": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "Covers profiles, permission sets, and the full Salesforce security model — maps directly to exam Section on Security & Access.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Profiles — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm&type=5", description: "Official profile documentation covering object permissions, field permissions, app settings, and tab visibility.", level: "Beginner" },
    { type: "docs", title: "Permission Sets Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.perm_sets_overview.htm&type=5", description: "Explains when to use permission sets vs. profiles and how to assign permission sets to users — key exam topic.", level: "Beginner" },
    { type: "youtube", title: "Profiles vs Permission Sets Explained — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Clear visual breakdown of the difference between profiles and permission sets — a common exam question area.", level: "Beginner" },
    { type: "blog", title: "Salesforce Profiles vs Permission Sets — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Practitioner-level comparison with real org examples to help students avoid the most common misconceptions.", level: "Beginner" },
  ],

  // ── L04: Roles & Role Hierarchy ───────────────────────────────────────────
  "admin-l04": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "Includes the role hierarchy module showing how visibility rolls up and how roles interact with OWD and sharing rules.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "User Role Hierarchy — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_roles.htm&type=5", description: "Official docs for creating roles, assigning users, and understanding how records become visible up the hierarchy.", level: "Beginner" },
    { type: "docs", title: "Controlling Record-Level Access — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5", description: "The definitive guide to Salesforce's four-layer record access model: OWD, hierarchy, sharing rules, and manual sharing.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Role Hierarchy & Sharing — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Apex Hours has clear visual demos of role hierarchy and record visibility — useful for explaining the access model.", level: "Beginner" },
  ],

  // ── L05: Organization-Wide Defaults & Sharing Rules ──────────────────────
  "admin-l05": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "Dedicated section on OWD settings for each object and how sharing rules extend access beyond the hierarchy.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Setting Your Organization-Wide Sharing Defaults — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5", description: "Explains Public Read/Write, Public Read Only, Private, and Controlled by Parent settings with object-level examples.", level: "Intermediate" },
    { type: "docs", title: "Sharing Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.security_owd_sharing_rules.htm&type=5", description: "Covers criteria-based and owner-based sharing rules, including how to create and manage them in Setup.", level: "Intermediate" },
    { type: "youtube", title: "OWD & Sharing Rules Deep Dive — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Visual walkthrough of configuring OWD and adding sharing rules — great pre-class viewing for students.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Sharing Model Explained — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Comprehensive study notes on the Salesforce data access layers most frequently tested in the Admin exam.", level: "Intermediate" },
  ],

  // ── L06: Field-Level Security ─────────────────────────────────────────────
  "admin-l06": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "Covers field-level security (FLS) alongside profiles and permission sets — the full picture of access control.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Field-Level Security — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_fls.htm&type=5", description: "Official FLS documentation showing how to control field visibility and editability at the profile and permission set level.", level: "Intermediate" },
    { type: "docs", title: "Profiles — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm&type=5", description: "Profiles control FLS settings alongside object permissions — review the Field Permissions section specifically.", level: "Beginner" },
    { type: "youtube", title: "Field-Level Security Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Practical demo of setting FLS through profiles and permission sets in a scratch org.", level: "Beginner" },
  ],

  // ── L07: Password Policies, Login Hours & IP Restrictions ────────────────
  "admin-l07": [
    { type: "trailhead", title: "Admin Beginner Trail — Security Settings", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers login hours, trusted IP ranges, and password policies within the broader Admin Beginner trail.", level: "Beginner" },
    { type: "docs", title: "Set Password Policies — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_password.htm&type=5", description: "Explains org-level and profile-level password policies, expiration settings, and complexity requirements.", level: "Beginner" },
    { type: "docs", title: "Login Hours and Login IP Ranges — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_loginrestrict.htm&type=5", description: "Step-by-step guide to restricting access by time of day and IP address at the profile level.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Security Settings — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Walkthrough of the common security setup tasks that appear in Admin exam scenario questions.", level: "Beginner" },
  ],

  // ── L08: Org Setup & Company Settings ────────────────────────────────────
  "admin-l08": [
    { type: "trailhead", title: "Admin Beginner Trail — Company Setup", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers company information, fiscal year, business hours, and currency settings as part of org configuration.", level: "Beginner" },
    { type: "docs", title: "Company Information — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_company_info.htm&type=5", description: "Details on editing org name, default locale, time zone, currency, and storage limits from the Company Information page.", level: "Beginner" },
    { type: "docs", title: "Business Hours and Holidays — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_businesshours.htm&type=5", description: "Explains setting business hours and holiday schedules — required for entitlements and escalation rules in Service Cloud.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Org Setup Overview — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Quick demo of the Setup menu and essential company configuration options new admins must know.", level: "Beginner" },
  ],

  // ── L09: Licenses & Feature Licenses ─────────────────────────────────────
  "admin-l09": [
    { type: "trailhead", title: "Admin Beginner Trail — Trailhead", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Includes license types in the user management section — important for understanding what capabilities each user gets.", level: "Beginner" },
    { type: "docs", title: "Salesforce User License Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.users_license_types_available.htm&type=5", description: "Complete reference for all available license types including Salesforce, Platform, Chatter, and Community licenses.", level: "Beginner" },
    { type: "docs", title: "Feature Licenses — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.users_feature_licenses_overview.htm&type=5", description: "Explains feature licenses like Marketing User, Salesforce CRM Content, and Flow that supplement the base license.", level: "Beginner" },
    { type: "blog", title: "Salesforce License Types Explained — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Plain-language breakdown of the license landscape — students often confuse license types on the exam.", level: "Beginner" },
  ],

  // ── L10: Auditing, Monitoring & Setup Audit Trail ────────────────────────
  "admin-l10": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "Includes monitoring and auditing as part of the broader security module — covers setup audit trail and login history.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Monitor Setup Changes with Setup Audit Trail — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_monitorsetup.htm&type=5", description: "Official guide to reading the Setup Audit Trail, filtering by user and date, and downloading logs.", level: "Intermediate" },
    { type: "docs", title: "Monitor Login History — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.users_login_history.htm&type=5", description: "Shows how to access Login History to troubleshoot failed logins and identify suspicious access patterns.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Auditing & Monitoring Tools — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Demo of the Setup Audit Trail and Login History pages — practical knowledge for both the exam and day-to-day admin work.", level: "Intermediate" },
  ],

  // ── L11: Data Model — Standard Objects ───────────────────────────────────
  "admin-l11": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "The canonical Trailhead module on objects, fields, and relationships — read alongside this lecture.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Standard Objects Reference — Salesforce Docs", url: "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_list.htm", description: "Complete list of all Salesforce standard objects with field and relationship details — useful for answering 'which object stores X?' exam questions.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Data Model Explained — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Visual explanation of how standard CRM objects relate to each other — Account, Contact, Lead, Opportunity, Case.", level: "Beginner" },
    { type: "blog", title: "Salesforce Data Model Overview — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Study guide section covering standard objects and their relationships — essential pre-reading for students.", level: "Beginner" },
  ],

  // ── L12: Custom Objects & Tabs ────────────────────────────────────────────
  "admin-l12": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Walks through creating a custom object from scratch, adding fields, and setting up a tab — hands-on module.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Create Custom Objects — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_objectcreate_task_parent.htm&type=5", description: "Official walkthrough for creating a custom object including naming, plural label, and deployment status.", level: "Beginner" },
    { type: "docs", title: "Custom Object Tabs — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_tabcreate_task.htm&type=5", description: "Explains how to create a custom tab for a custom object and add it to an app — often tested in setup scenarios.", level: "Beginner" },
    { type: "youtube", title: "Create Custom Objects in Salesforce — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Step-by-step demo of creating a custom object, adding fields, and deploying it to users.", level: "Beginner" },
  ],

  // ── L13: Fields & Field Data Types ───────────────────────────────────────
  "admin-l13": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Covers all field types including text, number, picklist, formula, and roll-up summary — core exam content.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Custom Field Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.custom_field_types.htm&type=5", description: "Complete reference for all custom field types with descriptions, size limits, and use cases — must-bookmark for exam prep.", level: "Beginner" },
    { type: "docs", title: "Formula Field Operators and Functions — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_functions.htm&type=5", description: "Official reference for all formula operators and functions — students regularly see formula questions on the exam.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Field Types Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Explains when to use each field type and common gotchas — a high-value watch before recording lectures on data types.", level: "Beginner" },
    { type: "blog", title: "Salesforce Custom Field Types Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Quick-reference breakdown of field types with exam tips embedded throughout.", level: "Beginner" },
  ],

  // ── L14: Relationships — Lookup, Master-Detail & Junction Objects ─────────
  "admin-l14": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Dedicated section on lookup vs. master-detail relationships and when to use each — directly tested on the exam.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Relationship Considerations — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.relationships_considerations.htm&type=5", description: "Explains the key differences between lookup and master-detail relationships including cascade delete and roll-up summary eligibility.", level: "Beginner" },
    { type: "docs", title: "Custom Object Relationships — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_objectcreate_task_parent.htm&type=5", description: "Shows how to create relationships between objects during or after object creation.", level: "Beginner" },
    { type: "youtube", title: "Lookup vs Master-Detail Relationships — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Visual comparison of relationship types including junction objects — one of the most popular admin interview topics.", level: "Beginner" },
  ],

  // ── L15: Schema Builder ───────────────────────────────────────────────────
  "admin-l15": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Includes a hands-on section on using Schema Builder to visually create and modify objects and relationships.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Schema Builder — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Official documentation for Schema Builder including how to create objects and fields directly from the canvas.", level: "Beginner" },
    { type: "youtube", title: "Schema Builder Demo — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Quick visual demo of Schema Builder — useful to show students the drag-and-drop data model design tool.", level: "Beginner" },
    { type: "blog", title: "Salesforce Schema Builder Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Overview of when and why to use Schema Builder versus the standard Setup menu approach.", level: "Beginner" },
  ],

  // ── L16: Page Layouts & Record Types ─────────────────────────────────────
  "admin-l16": [
    { type: "trailhead", title: "Admin Beginner Trail — Page Layouts", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers how page layouts control field arrangement, related lists, and buttons on record pages.", level: "Beginner" },
    { type: "docs", title: "Page Layouts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_layoutcreate.htm&type=5", description: "Official guide for creating and customizing page layouts and assigning them to profiles.", level: "Beginner" },
    { type: "docs", title: "Record Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_recordtype.htm&type=5", description: "Explains how to create record types, assign picklist values per type, and map them to page layouts per profile.", level: "Intermediate" },
    { type: "youtube", title: "Record Types & Page Layouts Explained — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "One of the most tested admin topics — this video clarifies the relationship between record types, profiles, and page layouts.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Record Types Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Detailed walkthrough of record type use cases and common mistakes — essential pre-lecture reading.", level: "Intermediate" },
  ],

  // ── L17: Lightning App Builder & Dynamic Forms ────────────────────────────
  "admin-l17": [
    { type: "trailhead", title: "Lightning App Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder", description: "Hands-on module for building Lightning record pages, home pages, and app pages using drag-and-drop components.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Lightning App Builder — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5", description: "Overview of Lightning App Builder capabilities including standard and custom components, visibility rules, and page activation.", level: "Beginner" },
    { type: "docs", title: "Dynamic Forms — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dynamic_forms_overview.htm&type=5", description: "Explains Dynamic Forms, which allow field-level visibility rules on record pages — a newer admin feature on the exam.", level: "Intermediate" },
    { type: "youtube", title: "Lightning App Builder Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Comprehensive demo of building a custom record page with Lightning App Builder and configuring component visibility.", level: "Beginner" },
  ],

  // ── L18: List Views & Global Search ──────────────────────────────────────
  "admin-l18": [
    { type: "trailhead", title: "Admin Beginner Trail — Trailhead", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers creating and sharing list views as part of the core admin skill set in the beginner trail.", level: "Beginner" },
    { type: "docs", title: "Create and Edit List Views — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customviews.htm&type=5", description: "Official documentation for creating list views with filters, selecting columns, and sharing views with other users.", level: "Beginner" },
    { type: "docs", title: "Search in Salesforce — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.search_lex.htm&type=5", description: "Covers global search behavior, search layouts, and how search results are ordered in Lightning Experience.", level: "Beginner" },
    { type: "youtube", title: "Salesforce List Views & Search Tips — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical tips on list views and search that help students work more efficiently in the platform.", level: "Beginner" },
  ],

  // ── L19: Reports ──────────────────────────────────────────────────────────
  "admin-l19": [
    { type: "trailhead", title: "Reports & Dashboards for Lightning Experience — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards", description: "The primary Trailhead module for building reports in Lightning — covers tabular, summary, matrix, and joined report types.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Build a Report in Lightning Experience — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.reports_build_lex.htm&type=5", description: "Step-by-step guide to creating reports, adding filters, groupings, and summary formulas in the report builder.", level: "Beginner" },
    { type: "docs", title: "Report Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.reports_report_type_overview.htm&type=5", description: "Explains standard and custom report types — custom report types are a commonly tested advanced admin topic.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Reports Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Covers all four report types with demos — great for students who are visual learners preparing for the exam.", level: "Beginner" },
    { type: "blog", title: "Salesforce Reports Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Exam-focused notes on report types, groupings, filters, and formula columns — a reliable quick-reference.", level: "Beginner" },
  ],

  // ── L20: Dashboards ───────────────────────────────────────────────────────
  "admin-l20": [
    { type: "trailhead", title: "Reports & Dashboards for Lightning Experience — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards", description: "Includes dashboard creation, component types (chart, gauge, metric, table), and dynamic dashboard concepts.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Dashboards in Lightning Experience — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dashboards_create_lex.htm&type=5", description: "Official guide to building dashboards, adding components, setting running user, and scheduling refreshes.", level: "Beginner" },
    { type: "docs", title: "Dynamic Dashboards — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&type=5", description: "Explains dynamic dashboards that show data based on the logged-in user — a frequent exam scenario question.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Dashboards Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Step-by-step dashboard creation including component configuration and dynamic dashboard setup.", level: "Beginner" },
  ],

  // ── L21: Sales Cloud — Leads ──────────────────────────────────────────────
  "admin-l21": [
    { type: "trailhead", title: "Sales Cloud — Trailhead Trail", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers the Lead object, lead assignment rules, lead queues, and the lead conversion process.", level: "Beginner" },
    { type: "docs", title: "Lead Management — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.leads_def.htm&type=5", description: "Overview of how Leads work in Salesforce including lead sources, status picklist values, and conversion mapping.", level: "Beginner" },
    { type: "docs", title: "Set Up Lead Assignment Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_leadassign.htm&type=5", description: "Step-by-step guide to creating lead assignment rules that route leads to the right user or queue.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Lead Management Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Explains the lead lifecycle from capture to conversion with practical admin configuration demos.", level: "Beginner" },
  ],

  // ── L22: Sales Cloud — Accounts & Contacts ───────────────────────────────
  "admin-l22": [
    { type: "trailhead", title: "Admin Beginner Trail — Accounts & Contacts", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers the Account-Contact relationship, contact roles, account hierarchy, and person accounts.", level: "Beginner" },
    { type: "docs", title: "Accounts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.accounts.htm&type=5", description: "Official Account documentation including account ownership, account teams, and account hierarchy configuration.", level: "Beginner" },
    { type: "docs", title: "Contacts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.contacts.htm&type=5", description: "Explains Contact records, contact roles on opportunities and cases, and how contacts relate to multiple accounts.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Accounts & Contacts Overview — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical overview of the Account-Contact data model and admin configuration options.", level: "Beginner" },
  ],

  // ── L23: Sales Cloud — Opportunities, Products & Pricebooks ──────────────
  "admin-l23": [
    { type: "trailhead", title: "Admin Beginner Trail — Opportunities", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers Opportunity stages, sales processes, products, pricebooks, and opportunity teams.", level: "Beginner" },
    { type: "docs", title: "Opportunities — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.opportunities.htm&type=5", description: "Official Opportunity documentation including sales stages, probability, close date, and opportunity record types.", level: "Beginner" },
    { type: "docs", title: "Products and Price Books — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.products.htm&type=5", description: "Explains how to create products, price books, and add products to opportunities — tested in Sales Cloud scenarios.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Opportunities & Products Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Demo of the full opportunity setup including products, pricebooks, and sales stage configuration.", level: "Beginner" },
  ],

  // ── L24: Sales Cloud — Forecasting ───────────────────────────────────────
  "admin-l24": [
    { type: "trailhead", title: "Admin Beginner Trail — Forecasts", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Introduces Collaborative Forecasting, forecast categories, and the relationship between pipeline and quota.", level: "Beginner" },
    { type: "docs", title: "Collaborative Forecasts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.forecasts3_overview.htm&type=5", description: "Official guide to enabling and configuring Collaborative Forecasts including forecast types and adjustment settings.", level: "Intermediate" },
    { type: "docs", title: "Forecast Categories — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.forecasts3_categories.htm&type=5", description: "Explains Pipeline, Best Case, Commit, Closed Won, and Omitted forecast categories and how they map to opportunity stages.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Forecasting Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Plain-language explanation of how forecasting works with exam tips on what distinguishes forecast categories.", level: "Intermediate" },
  ],

  // ── L25: Sales Cloud — Activities, Tasks & Events ────────────────────────
  "admin-l25": [
    { type: "trailhead", title: "Admin Beginner Trail — Activities", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "Covers tasks, events, email activities, and how the activity timeline works in Lightning Experience.", level: "Beginner" },
    { type: "docs", title: "Activities — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.activities.htm&type=5", description: "Official documentation for Tasks and Events including shared activities, task assignment, and email-to-Salesforce.", level: "Beginner" },
    { type: "docs", title: "Email-to-Salesforce — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.email_my_email_to_salesforce.htm&type=5", description: "Explains how to configure Email-to-Salesforce to log outbound emails as activity records automatically.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Activities & Task Management — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical overview of tasks, events, and the Lightning activity timeline for admin students.", level: "Beginner" },
  ],

  // ── L26: Service Cloud — Cases ────────────────────────────────────────────
  "admin-l26": [
    { type: "trailhead", title: "Service Cloud Admin Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/service_cloud_administration", description: "The primary module for Service Cloud configuration including Cases, case assignment, escalation rules, and queues.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Cases — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.cases.htm&type=5", description: "Official Case documentation covering case creation, status settings, case assignment rules, and case queues.", level: "Beginner" },
    { type: "docs", title: "Case Assignment Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_casesupport_assign.htm&type=5", description: "Step-by-step guide to creating assignment rules that route cases to the right agent or queue based on criteria.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Cases & Service Cloud Setup — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Demo of the full case lifecycle including queues, assignment rules, and escalation configuration.", level: "Beginner" },
  ],

  // ── L27: Service Cloud — Queues & Assignment Rules ───────────────────────
  "admin-l27": [
    { type: "trailhead", title: "Service Cloud Admin Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/service_cloud_administration", description: "Covers queue setup for Cases and Leads and how assignment rules route work items to queues.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Set Up Queues — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.setting_up_queues.htm&type=5", description: "Official guide to creating queues, adding members, and associating queues with assignment rules and list views.", level: "Beginner" },
    { type: "docs", title: "Escalation Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_casesupport_escalation.htm&type=5", description: "Explains how to create escalation rules that automatically escalate cases that breach SLA timeframes.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Queues & Routing Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Clear explanation of queues, assignment rules, and escalation rules with exam scenarios included.", level: "Beginner" },
  ],

  // ── L28: Service Cloud — Entitlements & Milestones ───────────────────────
  "admin-l28": [
    { type: "trailhead", title: "Service Cloud Admin Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/service_cloud_administration", description: "Includes entitlements, milestones, and SLA management as part of the broader Service Cloud admin module.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Entitlements — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.entitlements_overview.htm&type=5", description: "Official documentation for setting up entitlements, entitlement processes, and assigning milestones to track SLAs.", level: "Intermediate" },
    { type: "docs", title: "Milestones — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.entitlements_milestones_overview.htm&type=5", description: "Explains how milestones define time-based requirements within an entitlement process and trigger alerts.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Entitlements & SLAs — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Visual walkthrough of entitlement setup including milestones and business hours — commonly tested Service Cloud topic.", level: "Intermediate" },
  ],

  // ── L29: Service Cloud — Knowledge ───────────────────────────────────────
  "admin-l29": [
    { type: "trailhead", title: "Service Cloud Admin Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/service_cloud_administration", description: "Covers Salesforce Knowledge setup including article types, data categories, and the knowledge base lifecycle.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Salesforce Knowledge — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.knowledge_whatis.htm&type=5", description: "Official Knowledge documentation covering article creation, publication, and sharing with communities and agents.", level: "Intermediate" },
    { type: "docs", title: "Data Categories — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.knowledge_data_category_overview.htm&type=5", description: "Explains how data categories control Knowledge article visibility — an important security layer for Service Cloud.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Knowledge Base Setup — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Walkthrough of setting up and maintaining a Salesforce Knowledge base — practical context for exam scenario questions.", level: "Intermediate" },
  ],

  // ── L30: Chatter & Collaboration ─────────────────────────────────────────
  "admin-l30": [
    { type: "trailhead", title: "Chatter Administration — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/chatter_admin", description: "Covers Chatter settings, groups, feeds, file sharing, and how to control Chatter access via profiles.", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Chatter Settings — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.collab_admin_intro.htm&type=5", description: "Official Chatter admin documentation including enabling/disabling Chatter, group settings, and email notification controls.", level: "Beginner" },
    { type: "docs", title: "Chatter Groups — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.collab_admin_groups.htm&type=5", description: "Explains public, private, and unlisted Chatter group types and how to set up broadcast-only groups.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Chatter Admin Setup — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Quick demo of Chatter configuration and group management relevant to the Admin certification exam.", level: "Beginner" },
  ],

  // ── L31: AppExchange ──────────────────────────────────────────────────────
  "admin-l31": [
    { type: "trailhead", title: "AppExchange Basics — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/appexchange_basics", description: "Covers how to find, evaluate, install, and manage AppExchange packages — an admin responsibility on the exam.", duration: "~45 min", level: "Beginner" },
    { type: "docs", title: "AppExchange Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.appexchangeinstall_overview.htm&type=5", description: "Official guide to installing AppExchange packages including managed vs. unmanaged and security review considerations.", level: "Beginner" },
    { type: "blog", title: "AppExchange Guide for Admins — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Overview of AppExchange evaluation criteria and best practices for admins managing installed packages.", level: "Beginner" },
    { type: "youtube", title: "Salesforce AppExchange Explained — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Explains what AppExchange is, the difference between managed and unmanaged packages, and how to install safely.", level: "Beginner" },
  ],

  // ── L32: Automation — Workflow Rules ─────────────────────────────────────
  "admin-l32": [
    { type: "trailhead", title: "Business Process Automation — Trailhead Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Covers all automation tools including Workflow Rules, Process Builder, Flow, and Approval Processes.", duration: "~8 hr", level: "Intermediate" },
    { type: "docs", title: "Workflow Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.workflow_rules_overview.htm&type=5", description: "Official documentation for Workflow Rules including evaluation criteria, rule criteria, and the four workflow actions.", level: "Beginner" },
    { type: "docs", title: "Flow Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Compares all Salesforce automation types — important context for understanding when to migrate from Workflow to Flow.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Workflow Rules Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Step-by-step demo of creating workflow rules with field updates, email alerts, and tasks — foundational automation knowledge.", level: "Beginner" },
  ],

  // ── L33: Automation — Process Builder ────────────────────────────────────
  "admin-l33": [
    { type: "trailhead", title: "Business Process Automation — Trailhead Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Includes hands-on Process Builder content within the broader automation trail — covers multi-action processes.", duration: "~8 hr", level: "Intermediate" },
    { type: "docs", title: "Process Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.process_overview.htm&type=5", description: "Official Process Builder documentation covering the visual editor, trigger options, and available actions.", level: "Intermediate" },
    { type: "docs", title: "Flow Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Context on how Process Builder fits into the broader automation landscape and Salesforce's recommendation to move to Flow.", level: "Intermediate" },
    { type: "youtube", title: "Process Builder Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical demo of building a multi-action process — understand the legacy tool before teaching the migration to Flow.", level: "Intermediate" },
  ],

  // ── L34: Automation — Flow Builder ───────────────────────────────────────
  "admin-l34": [
    { type: "trailhead", title: "Flow Builder Basics — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "The essential hands-on Trailhead module for learning Flow Builder — covers screen flows, record-triggered flows, and scheduled flows.", duration: "~2 hr", level: "Intermediate" },
    { type: "trailhead", title: "Business Process Automation — Trailhead Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "The full automation trail that includes Flow Builder in depth — the most exam-relevant automation content.", duration: "~8 hr", level: "Intermediate" },
    { type: "docs", title: "Flow Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Official reference for all flow types: Screen Flow, Record-Triggered, Scheduled, Platform Event, and Autolaunched.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Flow Builder Complete Tutorial — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Comprehensive Flow Builder tutorial covering the elements, connectors, variables, and debug tool — bookmark this.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Flow Builder Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Study notes on Flow types, elements, and common exam scenarios around the Salesforce automation tools.", level: "Intermediate" },
  ],

  // ── L35: Automation — Approval Processes ─────────────────────────────────
  "admin-l35": [
    { type: "trailhead", title: "Business Process Automation — Trailhead Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Includes a dedicated section on approval processes including steps, approvers, actions, and related email templates.", duration: "~8 hr", level: "Intermediate" },
    { type: "docs", title: "Approval Processes — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.approvals_overview.htm&type=5", description: "Official documentation for creating approval processes including entry criteria, approver assignment, and step actions.", level: "Intermediate" },
    { type: "docs", title: "Approval Process Actions — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.approvals_actions_overview.htm&type=5", description: "Covers Initial, Approval, Rejection, Recall, and Final actions available in an approval process.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Approval Process Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Step-by-step demo of building an approval process with multiple approvers and automated actions.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Approval Processes Explained — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Detailed breakdown of approval process configuration with exam tips on approver order and action types.", level: "Intermediate" },
  ],

  // ── L36: Data Management — Import, Export & Data Loader ──────────────────
  "admin-l36": [
    { type: "trailhead", title: "Data Management — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management", description: "The primary data management module covering Data Import Wizard, Data Loader, and best practices for bulk data operations.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Data Import Wizard — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.data_import_wizard.htm&type=5", description: "Official guide to using the Data Import Wizard including supported objects, field mapping, and duplicate handling.", level: "Beginner" },
    { type: "docs", title: "Data Loader — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.data_loader.htm&type=5", description: "Covers the Data Loader tool for insert, update, upsert, delete, and export operations above the 50,000 record limit.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Data Import & Data Loader Tutorial — Apex Hours", url: "https://www.youtube.com/@apexhours", description: "Side-by-side comparison of Data Import Wizard and Data Loader — helps students know which tool to use in exam scenarios.", level: "Beginner" },
    { type: "blog", title: "Data Import Wizard vs Data Loader — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Clear comparison chart of both tools including row limits, supported operations, and when to use each.", level: "Beginner" },
  ],

  // ── L37: Data Management — Data Quality & Duplicate Rules ────────────────
  "admin-l37": [
    { type: "trailhead", title: "Data Management — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management", description: "Covers duplicate management, matching rules, and duplicate rules as part of the data quality section.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Duplicate Management — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.duplicate_management_overview.htm&type=5", description: "Official guide to matching rules, duplicate rules, and the duplicate alert and blocking behavior in Salesforce.", level: "Intermediate" },
    { type: "docs", title: "Validation Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_defining_field_validation_formulas.htm&type=5", description: "Explains validation rules, error conditions, and error message placement — critical for enforcing data quality at entry.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Duplicate Rules & Validation Rules — Salesforce Ben YouTube", url: "https://www.youtube.com/@salesforceben", description: "Practical demo of configuring duplicate management and validation rules to maintain clean data.", level: "Intermediate" },
  ],

  // ── L38: Data Management — Backup, Recovery & Storage ────────────────────
  "admin-l38": [
    { type: "trailhead", title: "Data Management — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management", description: "Addresses data backup options, recycle bin, storage limits, and best practices for data preservation.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Data Export Service — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_exportdata.htm&type=5", description: "Official guide to the weekly and monthly Data Export Service for backing up org data as CSV files.", level: "Beginner" },
    { type: "docs", title: "Recycle Bin — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.home_delete.htm&type=5", description: "Explains the Recycle Bin, 15-day retention, individual vs. org recycle bins, and the hard delete permission.", level: "Beginner" },
    { type: "docs", title: "Storage Limits — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_monitorresources.htm&type=5", description: "Covers data storage, file storage, and how to monitor and manage storage usage in your org.", level: "Beginner" },
    { type: "blog", title: "Salesforce Data Backup & Recovery Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Overview of Salesforce backup options including the Data Export Service and third-party backup solutions.", level: "Beginner" },
  ],

  // ── Lab 01: Hands-On Lab — Setup, Security & User Management ─────────────
  "admin-lab01": [
    { type: "trailhead", title: "Prepare for Your Salesforce Administrator Credential — Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential", description: "Complete this official trailmix before Lab 01 — the setup and security modules provide the conceptual foundation for the lab exercises.", duration: "~40 hr", level: "Beginner" },
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "The security module students should have completed before attempting the OWD and sharing rule lab exercises.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Profiles — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm&type=5", description: "Reference documentation students need open while completing the profile and permission set lab exercises.", level: "Beginner" },
    { type: "blog", title: "Salesforce Admin Certification Study Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Review the Setup and Security sections before running this lab to ensure students are prepared for hands-on exercises.", level: "Beginner" },
  ],

  // ── Lab 02: Hands-On Lab — Data Model, Automation & Reporting ────────────
  "admin-lab02": [
    { type: "trailhead", title: "Prepare for Your Salesforce Administrator Credential — Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential", description: "Students should complete the data modeling and automation modules in this trailmix before Lab 02.", duration: "~40 hr", level: "Beginner" },
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Hands-on prerequisite for the custom object, relationship, and schema builder lab exercises in Lab 02.", duration: "~1.5 hr", level: "Beginner" },
    { type: "trailhead", title: "Flow Builder Basics — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Students who complete this module first will find the automation lab exercises in Lab 02 much more approachable.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Flow Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Quick reference for flow types needed during the automation portion of Lab 02.", level: "Intermediate" },
  ],

  // ── Lab 03: Hands-On Lab — Service Cloud, Reports & Dashboards ───────────
  "admin-lab03": [
    { type: "trailhead", title: "Prepare for Your Salesforce Administrator Credential — Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential", description: "Students should complete the Service Cloud and analytics modules in this trailmix before Lab 03.", duration: "~40 hr", level: "Beginner" },
    { type: "trailhead", title: "Service Cloud Admin Basics — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/service_cloud_administration", description: "Prerequisite for the case management, queue, and entitlement exercises in Lab 03.", duration: "~2 hr", level: "Beginner" },
    { type: "trailhead", title: "Reports & Dashboards for Lightning Experience — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards", description: "Students who complete this first will be ready for the report and dashboard building exercises in Lab 03.", duration: "~2 hr", level: "Beginner" },
    { type: "blog", title: "Salesforce Admin Certification Study Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Review the Service Cloud and Analytics sections to prepare students for the Lab 03 scenario walkthroughs.", level: "Beginner" },
  ],

  // ── Exam: Certification Exam Preparation ─────────────────────────────────
  "admin-exam": [
    { type: "trailhead", title: "Prepare for Your Salesforce Administrator Credential — Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-administrator-credential", description: "The official Salesforce-curated trailmix for exam prep — every student should complete all modules before sitting the exam.", duration: "~40 hr", level: "Beginner" },
    { type: "docs", title: "Salesforce Administrator Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/administrator", description: "Official exam outline with exact topic percentages — use this to identify and close knowledge gaps before exam day.", level: "Beginner" },
    { type: "blog", title: "Focus on Force — Salesforce Administrator Study Guide", url: "https://focusonforce.com/salesforce-certifications/", description: "Widely used third-party study guide with practice questions organized by exam topic — trusted by thousands of candidates.", level: "Beginner" },
    { type: "blog", title: "Salesforce Admin Certification Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Comprehensive community study guide covering all exam topics with tips on how to approach tricky scenario questions.", level: "Beginner" },
    { type: "udemy", title: "Salesforce Administrator Certification — Udemy (Top Rated)", url: "https://www.udemy.com/courses/search/?q=salesforce+administrator+certification&sort=highest-rated", description: "Practice exam courses on Udemy provide hundreds of scenario-based questions that closely mirror the real exam format.", level: "Beginner" },
  ],

  // ── Cheatsheet: Quick Reference ───────────────────────────────────────────
  "admin-cheatsheet": [
    { type: "docs", title: "Salesforce Administrator Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/administrator", description: "The primary reference for topic weights and exam scope — print the exam outline as a one-page study checklist.", level: "Beginner" },
    { type: "trailhead", title: "Admin Beginner Trail — Trailhead", url: "https://trailhead.salesforce.com/content/learn/trails/force_com_admin_beginner", description: "The beginner trail covers the majority of cheatsheet topics — link students here for foundational concept review.", level: "Beginner" },
    { type: "blog", title: "Salesforce Admin Certification Study Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "One of the best free community cheatsheets available — covers security model, data model, automation, and analytics in brief.", level: "Beginner" },
    { type: "blog", title: "Focus on Force — Salesforce Administrator Study Guide", url: "https://focusonforce.com/salesforce-certifications/", description: "Topic-by-topic cheatsheet content from Focus on Force — useful as a quick-review companion during final exam prep.", level: "Beginner" },
    { type: "udemy", title: "Salesforce Administrator Certification — Udemy (Top Rated)", url: "https://www.udemy.com/courses/search/?q=salesforce+administrator+certification&sort=highest-rated", description: "Top-rated Udemy courses often include downloadable PDF cheatsheets — search for courses with 'study notes' in the description.", level: "Beginner" },
  ],

};
