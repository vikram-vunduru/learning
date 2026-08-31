import type { Resource } from "./resources";

export const APP_BUILDER_RESOURCES: Record<string, Resource[]> = {

  // ── Overview ─────────────────────────────────────────────────────────────
  "app-builder-overview": [
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "The official Trailhead trail for the Platform App Builder credential — use this as your course roadmap", duration: "~12 hr", level: "Beginner" },
    { type: "trailhead", title: "Platform Developer I — Platform Basics Module", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Solid intro to what the Salesforce platform is and how declarative tools fit in — essential orientation for students", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Platform App Builder Credential — Official Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-app-builder-credential", description: "Official Salesforce-curated trailmix — share with students on Day 1 so they can self-pace between lectures", duration: "~20 hr total", level: "Beginner" },
    { type: "trailhead", title: "Platform App Builder Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Official exam objectives and topic weights — read before planning your lecture order", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben YouTube — App Builder Tips & Walkthroughs", url: "https://www.youtube.com/@salesforceben", description: "Salesforce Ben's channel has free App Builder exam tips, demo walkthroughs, and study guides — great supplemental content for students", duration: "Various", level: "Beginner" },
  ],

  // ── L01: What Is the Salesforce Platform ─────────────────────────────────
  "app-builder-l01": [
    { type: "trailhead", title: "Platform Developer I — Platform Basics", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Covers the Force.com platform model, metadata-driven architecture, and where declarative fits vs code — perfect pre-read for this lecture", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "The top-level App Builder trail — use the first two modules to frame the overall platform story", duration: "~12 hr trail", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Platform Overview Videos", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce platform overview' on Salesforce Ben's channel for short explainers you can reference during recording", duration: "10–20 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Third-party breakdown of all exam topics — read the Platform Basics section to see what students need to retain", level: "Beginner" },
  ],

  // ── L02: Declarative vs Programmatic Development ─────────────────────────
  "app-builder-l02": [
    { type: "trailhead", title: "Platform Developer I — Platform Basics", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Explains the declarative / programmatic distinction with platform-native examples — foundational framing for the whole course", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Trail context for where declarative tools (Flow, Schema Builder, App Builder) sit in the development model", duration: "~12 hr trail", level: "Beginner" },
    { type: "trailhead", title: "Application Lifecycle and Development Models", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Covers the development lifecycle and the difference between no-code, low-code, and pro-code approaches", duration: "~1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Declarative Tools Explained", url: "https://www.youtube.com/@salesforceben", description: "Search 'declarative vs programmatic Salesforce' for short-form video explanations good for student pre-work", duration: "10–15 min", level: "Beginner" },
  ],

  // ── L03: Security Model ───────────────────────────────────────────────────
  "app-builder-l03": [
    { type: "trailhead", title: "Data Security — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_security", description: "PRIMARY SOURCE for this lecture — covers the full security hierarchy: org, object, record, field. Exam tests this heavily.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "User Profiles — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm&type=5", description: "Official documentation on Profiles — object CRUD, field-level security, app access. Reference while recording.", level: "Beginner" },
    { type: "docs", title: "Sharing and Data Access — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.security_data_access.htm&type=5", description: "Explains org-wide defaults, sharing rules, role hierarchy, and manual sharing — the exam loves nuance here", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Ben — Security Model Explained", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce security model' on Salesforce Ben's channel for free video breakdowns of profiles vs permission sets vs sharing rules", duration: "15–25 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Security model is ~20% of the exam — study the exam guide section on this topic to calibrate depth", level: "Beginner" },
  ],

  // ── L04: Environment Strategy & Sandboxes ────────────────────────────────
  "app-builder-l04": [
    { type: "trailhead", title: "Application Lifecycle and Development Models", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Covers all sandbox types, org strategy, and release management best practices — mandatory prep for this lecture", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Create and Manage Sandboxes — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.create_test_instance.htm&type=5", description: "Official sandbox creation and management docs — covers Developer, Developer Pro, Partial, and Full sandbox types", level: "Beginner" },
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Trail context for org strategy and environment planning within the app building lifecycle", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Sandbox Types and Deployment", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce sandbox types' on Salesforce Ben's channel for short explainers on when to use each sandbox", duration: "10–20 min", level: "Beginner" },
  ],

  // ── L05: Data Modeling Overview ───────────────────────────────────────────
  "app-builder-l05": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "THE core data modeling module on Trailhead — standard vs custom objects, fields, and relationships. Do this before recording.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Create Custom Objects — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_objectcreate_task_parent.htm&type=5", description: "Step-by-step guide for creating custom objects — reference while screen-recording the demo portion", level: "Beginner" },
    { type: "docs", title: "Schema Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Visual overview of Schema Builder — use this doc to explain the drag-and-drop ERD approach to students", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Data Modeling Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce data modeling' on Salesforce Ben's channel — good model for pacing your own recording", duration: "20–30 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Top-rated App Builder prep courses on Udemy — review how others cover data modeling to differentiate your content", level: "Beginner" },
  ],

  // ── L06: Custom Objects & Fields ─────────────────────────────────────────
  "app-builder-l06": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Covers custom object creation, field types, and required vs optional fields — the foundation for this lecture", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Create Custom Objects — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_objectcreate_task_parent.htm&type=5", description: "Official step-by-step docs — open alongside your screen recording for the demo walkthrough", level: "Beginner" },
    { type: "docs", title: "Schema Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Explains the Schema Builder UI and how it visualizes object relationships — great for showing ERD-style modeling", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Custom Objects and Fields", url: "https://www.youtube.com/@salesforceben", description: "Search 'custom objects Salesforce' on Salesforce Ben's channel for hands-on field creation demos", duration: "15–25 min", level: "Beginner" },
  ],

  // ── L07: Object Relationships ─────────────────────────────────────────────
  "app-builder-l07": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Covers Lookup, Master-Detail, Many-to-Many, and Self-Join relationships — this is the exam's most-tested data model topic", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Schema Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Use Schema Builder to visually demonstrate relationship types during your demo recording", level: "Beginner" },
    { type: "docs", title: "Roll-Up Summary Fields — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_about_roll_up_summary_fields.htm&type=5", description: "Explains roll-up summary field behavior — only available on Master-Detail, which is a key exam distinction", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Lookup vs Master-Detail Explained", url: "https://www.youtube.com/@salesforceben", description: "Search 'lookup vs master detail Salesforce' on Salesforce Ben's channel — this comparison is an exam favorite", duration: "10–20 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "The data modeling section in this guide shows exactly which relationship behaviors the exam tests", level: "Beginner" },
  ],

  // ── L08: Schema Builder & Roll-Up Summary Fields ─────────────────────────
  "app-builder-l08": [
    { type: "docs", title: "Schema Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Full Schema Builder reference — covers adding objects, fields, and relationships visually. Use as your demo script.", level: "Beginner" },
    { type: "docs", title: "Roll-Up Summary Fields — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_about_roll_up_summary_fields.htm&type=5", description: "Official roll-up summary docs — covers COUNT, SUM, MIN, MAX and the Master-Detail requirement. Exam tests the limitations.", level: "Beginner" },
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Schema Builder and roll-up fields are both covered in this module — complete the badge to validate your lecture content", duration: "~1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Roll-Up Summary Fields Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'roll-up summary fields Salesforce' on Salesforce Ben's channel for a hands-on walkthrough", duration: "10–15 min", level: "Beginner" },
  ],

  // ── L09: Formula Fields ───────────────────────────────────────────────────
  "app-builder-l09": [
    { type: "docs", title: "Build Formula Fields — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_formulafields.htm&type=5", description: "Complete formula field reference — field types, operators, functions, and merge fields. Open this during recording.", level: "Beginner" },
    { type: "docs", title: "Roll-Up Summary Fields — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_about_roll_up_summary_fields.htm&type=5", description: "Use alongside formula docs — the exam tests distinguishing when to use a formula vs a roll-up summary", level: "Beginner" },
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Formula fields are a key data modeling topic on Trailhead — the badge challenges test practical formula syntax", duration: "~1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Formula Fields Examples", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce formula fields' on Salesforce Ben's channel for practical examples you can adapt in your demos", duration: "15–20 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Top Udemy courses cover formula field syntax in detail — review to see which functions competitors emphasize", level: "Beginner" },
  ],

  // ── L10: Validation Rules ─────────────────────────────────────────────────
  "app-builder-l10": [
    { type: "docs", title: "Defining Validation Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_defining_field_validation_rules.htm&type=5", description: "Official validation rule docs — formula editor, error message placement, and when rules fire. Use as your demo reference.", level: "Beginner" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Automation trail that covers validation rules in the broader context of enforcing business logic declaratively", duration: "~10 hr trail", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Validation Rules Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce validation rules' on Salesforce Ben's channel for real-world formula examples", duration: "15–20 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Review the automation section — validation rules are a frequent exam topic alongside flow and approval processes", level: "Beginner" },
  ],

  // ── L11: Automation Overview & Flow Introduction ──────────────────────────
  "app-builder-l11": [
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Official automation trail — covers Flow, approval processes, and when-to-use guidance. This is the backbone of L11-L15.", duration: "~10 hr trail", level: "Beginner" },
    { type: "trailhead", title: "Flow Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Dedicated Flow Builder module — start here before teaching any flow lecture. Covers all flow types and elements.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Official reference for all flow types (Screen, Record-Triggered, Scheduled, Platform Event, Autolaunched) — exam tests when to use each", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Flow Builder Overview", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce Flow Builder overview' on Salesforce Ben's channel for a beginner-friendly introduction to frame your lecture", duration: "20–30 min", level: "Beginner" },
  ],

  // ── L12: Screen Flows ─────────────────────────────────────────────────────
  "app-builder-l12": [
    { type: "trailhead", title: "Flow Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Screen flow creation is covered in depth here — complete the module before recording to validate your demo steps", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Reference for Screen Flow capabilities and limitations — the exam tests what screen flows can and cannot do", level: "Beginner" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Trail context for how screen flows fit into the broader automation toolkit", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Screen Flow Step by Step", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce screen flow tutorial' on Salesforce Ben's channel for a walkthrough to model your demo against", duration: "25–35 min", level: "Intermediate" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Top Udemy courses include hands-on screen flow labs — see how others structure the demo to guide your recording", level: "Beginner" },
  ],

  // ── L13: Record-Triggered Flows ───────────────────────────────────────────
  "app-builder-l13": [
    { type: "trailhead", title: "Flow Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Record-triggered flows are the most exam-tested flow type — this module covers before-save vs after-save triggers in detail", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Official distinction between record-triggered flow subtypes — before vs after save is a critical exam concept", level: "Intermediate" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Trail provides real-world automation scenarios that map directly to record-triggered flow exam questions", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Record-Triggered Flow Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'record-triggered flow Salesforce' on Salesforce Ben's channel for before-save vs after-save comparisons", duration: "20–30 min", level: "Intermediate" },
  ],

  // ── L14: Scheduled & Autolaunched Flows ──────────────────────────────────
  "app-builder-l14": [
    { type: "trailhead", title: "Flow Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Covers scheduled flows and autolaunched flows — including invocable actions and subflow patterns", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Reference table for all flow type capabilities — use this to build your comparison slide for this lecture", level: "Intermediate" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Provides context for when scheduled flows are the right tool vs other automation options", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Scheduled Flow and Batch Automation", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce scheduled flow' on Salesforce Ben's channel for timed automation examples", duration: "15–25 min", level: "Intermediate" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Review the automation comparison table in this guide — flow type selection is a frequent exam scenario question", level: "Intermediate" },
  ],

  // ── L15: Approval Processes ───────────────────────────────────────────────
  "app-builder-l15": [
    { type: "docs", title: "Getting Started with Approval Processes — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.approvals_getting_started.htm&type=5", description: "Primary approval process reference — covers setup wizard, entry criteria, approval steps, and actions. Use as your recording guide.", level: "Intermediate" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Approval processes are a standalone module in this trail — complete before recording to ensure your demo org is ready", duration: "~10 hr trail", level: "Beginner" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Helps you contrast approval processes vs flows — a scenario-based distinction the exam consistently tests", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Ben — Approval Process Walkthrough", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce approval process' on Salesforce Ben's channel for setup demos and exam tips", duration: "20–30 min", level: "Intermediate" },
  ],

  // ── L16: Lightning App Builder ────────────────────────────────────────────
  "app-builder-l16": [
    { type: "trailhead", title: "Lightning App Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder", description: "THE core module for this lecture — record pages, home pages, and app pages. Complete the badge before recording.", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Lightning App Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5", description: "Official LAB docs — covers component types, visibility rules, and activation. Use as your live demo reference.", level: "Beginner" },
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Trail places Lightning App Builder in the full app-building context — good framing for the lecture opener", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Lightning App Builder Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'Lightning App Builder tutorial' on Salesforce Ben's channel for hands-on component placement demos", duration: "20–30 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Competing Udemy courses show how instructors demo the Lightning App Builder — good prep for your own recording approach", level: "Beginner" },
  ],

  // ── L17: Page Layouts & Record Types ─────────────────────────────────────
  "app-builder-l17": [
    { type: "docs", title: "Record Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_recordtypes.htm&type=5", description: "Official record type docs — covers page layout and picklist value assignments per profile. Exam heavily tests this.", level: "Intermediate" },
    { type: "docs", title: "Create and Edit Page Layouts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_pagelayoutcreate.htm&type=5", description: "Page layout editor reference — fields, related lists, buttons, and quick actions. Use as demo guide while recording.", level: "Beginner" },
    { type: "trailhead", title: "Lightning App Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder", description: "Covers how page layouts interact with Lightning record pages — important distinction for the exam", duration: "~1.5 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Record Types and Page Layouts", url: "https://www.youtube.com/@salesforceben", description: "Search 'record types page layouts Salesforce' on Salesforce Ben's channel — the profile assignment topic is a classic exam scenario", duration: "20–30 min", level: "Intermediate" },
  ],

  // ── L18: Lightning Apps & Navigation ─────────────────────────────────────
  "app-builder-l18": [
    { type: "trailhead", title: "Lightning App Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder", description: "Covers building Lightning apps, configuring navigation, and assigning apps to profiles — core content for this lecture", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Lightning App Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5", description: "App page types and navigation bar configuration — reference while demoing app creation in your recording", level: "Beginner" },
    { type: "docs", title: "Record Types — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_recordtypes.htm&type=5", description: "Record types and app assignments go hand-in-hand — exam scenarios often combine both topics", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Ben — Building Lightning Apps", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce Lightning app navigation' on Salesforce Ben's channel for app setup walkthroughs", duration: "15–25 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "UI section of this guide covers app navigation questions that appear on the exam", level: "Beginner" },
  ],

  // ── L19: Reports & Dashboards ─────────────────────────────────────────────
  "app-builder-l19": [
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Reports and dashboards module is included in this trail — covers report types, filters, and dashboard components", level: "Beginner" },
    { type: "docs", title: "Lightning App Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5", description: "Dashboard components can be embedded in Lightning pages via App Builder — connect UI lecture to reports topic", level: "Beginner" },
    { type: "trailhead", title: "Platform Developer I — Platform Basics", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Platform Basics contextualizes report types and data access within the full platform architecture", duration: "~1 hr", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Reports and Dashboards Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce reports dashboards tutorial' on Salesforce Ben's channel for a step-by-step demo to model your recording against", duration: "20–35 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Top Udemy courses spend significant time on reports — compare coverage depth to calibrate your own lecture", level: "Beginner" },
  ],

  // ── L20: List Views, Quick Actions & Global Actions ───────────────────────
  "app-builder-l20": [
    { type: "trailhead", title: "Lightning App Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder", description: "Covers quick actions, global actions, and how they surface in Lightning pages — complete before recording", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Lightning App Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5", description: "Quick actions and dynamic forms are configured in the Lightning App Builder — reference during your demo", level: "Beginner" },
    { type: "docs", title: "Create and Edit Page Layouts — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_pagelayoutcreate.htm&type=5", description: "Quick actions are added to page layouts and Lightning pages — this doc covers the layout editor side of that setup", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Quick Actions and List Views", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce quick actions' and 'list views' on Salesforce Ben's channel for practical exam-focused demos", duration: "15–25 min", level: "Beginner" },
  ],

  // ── L21: Change Sets & Metadata Deployment ────────────────────────────────
  "app-builder-l21": [
    { type: "trailhead", title: "Application Lifecycle and Development Models", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Change sets, sandboxes, and release management — this module is the primary source for the App Deployment exam section", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Change Sets Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.changesets.htm&type=5", description: "Official change set documentation — inbound, outbound, components, and deployment connections. Use as demo reference.", level: "Intermediate" },
    { type: "docs", title: "Create and Manage Sandboxes — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.create_test_instance.htm&type=5", description: "Change sets always travel between connected orgs — understand sandbox types before teaching deployment paths", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Change Sets Tutorial", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce change sets' on Salesforce Ben's channel for a step-by-step deployment demo", duration: "20–30 min", level: "Intermediate" },
  ],

  // ── L22: AppExchange Overview ─────────────────────────────────────────────
  "app-builder-l22": [
    { type: "docs", title: "AppExchange Distribution Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.distribute_apps_overview.htm&type=5", description: "Official AppExchange publishing and distribution docs — managed vs unmanaged packages and security review requirements", level: "Intermediate" },
    { type: "trailhead", title: "Application Lifecycle and Development Models", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Covers AppExchange packages within the application lifecycle context — app distribution is a deployment model topic", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Change Sets Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.changesets.htm&type=5", description: "Understanding change sets helps frame the difference between change set deployment and package-based AppExchange distribution", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Ben — AppExchange Explained", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce AppExchange' on Salesforce Ben's channel for an admin-focused introduction to marketplace and packages", duration: "15–25 min", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "The deployment section of this guide covers AppExchange package types that appear on the exam", level: "Intermediate" },
  ],

  // ── L23: Managed & Unmanaged Packages ────────────────────────────────────
  "app-builder-l23": [
    { type: "docs", title: "AppExchange Distribution Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.distribute_apps_overview.htm&type=5", description: "Managed vs unmanaged package distinctions — this is the primary exam reference. Covers upgradability and namespace.", level: "Intermediate" },
    { type: "trailhead", title: "Application Lifecycle and Development Models", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Package types and their role in the development lifecycle — covers the full spectrum from change sets to managed packages", duration: "~1.5 hr", level: "Intermediate" },
    { type: "docs", title: "Change Sets Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.changesets.htm&type=5", description: "Context for comparing change-set-based deployments against managed packages — a frequent exam comparison scenario", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Ben — Managed vs Unmanaged Packages", url: "https://www.youtube.com/@salesforceben", description: "Search 'managed vs unmanaged packages Salesforce' on Salesforce Ben's channel for a clear exam-focused explanation", duration: "15–20 min", level: "Intermediate" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Package type comparison table in this guide directly mirrors how the exam frames deployment scenario questions", level: "Intermediate" },
  ],

  // ── Lab 01: Developer Org Setup & Navigation ──────────────────────────────
  "app-builder-lab01": [
    { type: "trailhead", title: "Platform Developer I — Platform Basics", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Teaches Setup navigation, object manager, and Salesforce UI basics — all students need this before Lab 1", duration: "~1 hr", level: "Beginner" },
    { type: "trailhead", title: "Build Applications with Force.com — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/build-applications-with-force-com", description: "Trail context for the lab environment — students should have a Developer Edition org ready before starting", level: "Beginner" },
    { type: "docs", title: "Create and Manage Sandboxes — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.create_test_instance.htm&type=5", description: "If students use a sandbox rather than Developer Edition, this doc explains setup and refresh behavior", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Setting Up a Developer Org", url: "https://www.youtube.com/@salesforceben", description: "Search 'Salesforce developer org setup' on Salesforce Ben's channel for a student-ready setup walkthrough", duration: "10–15 min", level: "Beginner" },
  ],

  // ── Lab 02: Data Model Build ───────────────────────────────────────────────
  "app-builder-lab02": [
    { type: "trailhead", title: "Data Modeling — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling", description: "Complete this module before supervising Lab 2 — students build objects, fields, and relationships hands-on", duration: "~1.5 hr", level: "Beginner" },
    { type: "docs", title: "Create Custom Objects — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.dev_objectcreate_task_parent.htm&type=5", description: "Step-by-step object creation reference — paste the URL in lab instructions so students can self-serve during the exercise", level: "Beginner" },
    { type: "docs", title: "Schema Builder Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.schema_builder.htm&type=5", description: "Students will use Schema Builder to visualize their ERD during Lab 2 — include this as a lab resource link", level: "Beginner" },
    { type: "docs", title: "Build Formula Fields — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.customize_formulafields.htm&type=5", description: "If the lab includes a formula field exercise, this is the reference students need for function syntax", level: "Beginner" },
  ],

  // ── Lab 03: Automation with Flow ──────────────────────────────────────────
  "app-builder-lab03": [
    { type: "trailhead", title: "Flow Builder — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "Complete this before supervising Lab 3 — the module's hands-on challenges are close to what students build in the lab", duration: "~2 hr", level: "Beginner" },
    { type: "trailhead", title: "Automate Your Business Processes — Trail", url: "https://trailhead.salesforce.com/content/learn/trails/automate_business_processes", description: "The full automation trail — use as a rubric for the lab exercise difficulty level", level: "Beginner" },
    { type: "docs", title: "Flow Types Overview — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.flow_concepts_type.htm&type=5", description: "Students often ask which flow type to use during the lab — paste this URL in lab instructions as a decision reference", level: "Beginner" },
    { type: "docs", title: "Defining Validation Rules — Salesforce Help", url: "https://help.salesforce.com/s/articleView?id=sf.fields_defining_field_validation_rules.htm&type=5", description: "If Lab 3 includes validation rules alongside flows, this is the reference for formula syntax and error placement", level: "Beginner" },
    { type: "youtube", title: "Salesforce Ben — Flow Builder Hands-On Demo", url: "https://www.youtube.com/@salesforceben", description: "Search 'Flow Builder tutorial Salesforce' on Salesforce Ben's channel — watch before lab to anticipate student questions", duration: "25–40 min", level: "Beginner" },
  ],

  // ── Exam Prep ─────────────────────────────────────────────────────────────
  "app-builder-exam": [
    { type: "trailhead", title: "Platform App Builder Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "PRIMARY EXAM RESOURCE — official exam objectives with topic weights. Share with students on the first day.", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Platform App Builder Credential — Official Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-app-builder-credential", description: "Official Salesforce-curated study trailmix — all required modules in one path. Assign this to students as course pre-work.", duration: "~20 hr total", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification Practice Tests — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Find top-rated practice exam courses on Udemy — drill weak areas with question banks from Sarvesh Srivastava and others", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "The most popular free study guide — topic-by-topic breakdown with exam tips. Compare against your course coverage.", level: "Beginner" },
    { type: "blog", title: "Platform App Builder Certification Study Guide — Focus on Force", url: "https://focusonforce.com/salesforce-certifications/platform-app-builder/", description: "Focus on Force offers structured study guides and practice questions — reference to see the depth competitors offer", level: "Beginner" },
  ],

  // ── Cheat Sheet ───────────────────────────────────────────────────────────
  "app-builder-cheatsheet": [
    { type: "trailhead", title: "Platform App Builder Exam Guide — Trailhead Credentials", url: "https://trailhead.salesforce.com/credentials/platformappbuilder", description: "Bookmark this — official exam objectives are the source of truth for every line of the cheat sheet", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Platform App Builder Credential — Official Trailmix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-app-builder-credential", description: "Complete all trailmix modules to earn the badge — the module summaries map directly to cheat sheet topics", duration: "~20 hr total", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform App Builder Certification — Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+app+builder+certification&sort=highest-rated", description: "Practice questions on Udemy help identify which cheat sheet topics students most need — use to prioritize content", level: "Beginner" },
    { type: "blog", title: "Salesforce Platform App Builder Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/", description: "Cross-reference this guide against your cheat sheet — Salesforce Ben's topic breakdown mirrors the official exam objectives", level: "Beginner" },
    { type: "blog", title: "Platform App Builder Certification Study Guide — Focus on Force", url: "https://focusonforce.com/salesforce-certifications/platform-app-builder/", description: "Focus on Force's structured breakdown by exam section — use to validate your cheat sheet covers all tested topics", level: "Beginner" },
  ],
};
