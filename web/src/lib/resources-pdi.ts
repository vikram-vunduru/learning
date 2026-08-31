import type { Resource } from "./resources";

export const PDI_RESOURCES: Record<string, Resource[]> = {

  // ── Overview ──────────────────────────────────────────────────────────────
  "pdi-overview": [
    { type: "trailhead", title: "Platform Developer I — Official Exam Guide", url: "https://trailhead.salesforce.com/credentials/platformdeveloperi", description: "PRIMARY SOURCE — official exam objectives, topic weights, and registration link. Start here before building your course outline.", level: "Beginner" },
    { type: "trailhead", title: "Prepare for Your Salesforce PDI Credential — Official Trail Mix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-developer-i-credential", description: "Salesforce's official recommended study path for PDI — use this to verify your lecture sequence covers every required module.", duration: "~40 hr total", level: "Beginner" },
    { type: "udemy", title: "Salesforce Platform Developer I — Top-Rated Courses on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Browse top-rated PDI courses on Udemy to benchmark your content depth and find topic gaps before recording.", level: "Beginner" },
    { type: "blog", title: "PDI Exam Guide — Salesforce Ben", url: "https://www.salesforceben.com/salesforce-platform-developer-1-exam-guide/", description: "The most widely-read third-party PDI guide — topic-by-topic breakdown with pass-rate tips and recommended resources.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Salesforce Developer Tutorials", url: "https://www.youtube.com/@apexhours", description: "Apex Hours is the go-to free YouTube resource for PDI-level Salesforce developers. Browse their playlists before planning your lecture order.", level: "Beginner" },
  ],

  // ── L01: Developer Console & Tools ────────────────────────────────────────
  "pdi-l01": [
    { type: "trailhead", title: "Apex Basics & Database — Get Started with Apex", url: "https://trailhead.salesforce.com/content/learn/modules/apex_intro", description: "The official starting point for Apex on Trailhead — covers Developer Console basics, Anonymous Apex, and the execute window.", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Developer Console Overview — Salesforce IDE Docs", url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_ide.meta/salesforce_ide/code_tools_intro.htm", description: "Official docs for the Developer Console — logs, query editor, source control panel. Use as reference when recording the tool walkthrough.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Developer Console Walkthrough", url: "https://www.youtube.com/@apexhours", description: "Search 'Developer Console' on the Apex Hours channel for a free guided walkthrough of all console panels.", duration: "20–35 min", level: "Beginner" },
    { type: "youtube", title: "Salesforce Developers — Official Channel", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'Developer Console Salesforce' for Salesforce's own demo videos — great secondary reference.", duration: "15–25 min", level: "Beginner" },
  ],

  // ── L02: Apex Basics ──────────────────────────────────────────────────────
  "pdi-l02": [
    { type: "trailhead", title: "Apex Basics & Database — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Foundational Apex module — classes, methods, primitive types, sObjects. Complete this yourself before recording L02.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Introduction to Apex — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm", description: "Official Apex Developer Guide introduction — Apex syntax, execution contexts, and key differences from Java. The authoritative reference.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Apex Basics Series", url: "https://www.youtube.com/@apexhours", description: "Apex Hours has a full free Apex basics series — watch the first 3–4 videos to calibrate your explanation depth.", duration: "30–60 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce PDI — Apex Fundamentals on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Top-rated PDI courses on Udemy cover Apex fundamentals in depth — useful for benchmarking pacing and examples.", level: "Beginner" },
  ],

  // ── L03: Variables & Data Types ───────────────────────────────────────────
  "pdi-l03": [
    { type: "docs", title: "Apex Data Types — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm", description: "Official guide covering all Apex primitive types, sObjects, collections (List, Set, Map), and Enums. Use as the authoritative source.", level: "Beginner" },
    { type: "trailhead", title: "Apex Basics & Database — Variables Section", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Trailhead module where variables and data types are introduced with hands-on challenges — do the challenges before recording.", duration: "~45 min section", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Apex Variables and Collections", url: "https://www.youtube.com/@apexhours", description: "Free YouTube tutorial on List, Set, and Map — critical collections for PDI exam questions.", duration: "20–40 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce PDI — Top-Rated Courses (Udemy)", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Browse PDI Udemy courses to see how other instructors sequence variables vs. collections content.", level: "Beginner" },
  ],

  // ── L04: Control Flow ─────────────────────────────────────────────────────
  "pdi-l04": [
    { type: "docs", title: "Apex Control Flow Statements — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm", description: "Covers if/else, switch, for loops, while, do-while in Apex — official syntax reference for building your code examples.", level: "Beginner" },
    { type: "trailhead", title: "Apex Basics & Database — Control Flow Exercises", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Trailhead challenges that cover loops and conditionals — work through these to find common student stumbling blocks.", duration: "~30 min section", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Loops and Conditionals in Apex", url: "https://www.youtube.com/@apexhours", description: "Apex Hours covers for-each loops over collections with sObject examples — directly relevant to exam questions.", duration: "15–30 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce PDI — Udemy Course Search", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Compare how other PDI instructors on Udemy introduce control flow — useful for structuring your live coding examples.", level: "Beginner" },
  ],

  // ── L05: SOQL Basics ──────────────────────────────────────────────────────
  "pdi-l05": [
    { type: "trailhead", title: "Apex Basics & Database — SOQL Section", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Hands-on SOQL coverage in Trailhead — inline SOQL, relationship queries, and binding variables. Do the challenges before recording.", duration: "~1 hr section", level: "Beginner" },
    { type: "docs", title: "SOQL and SOSL Reference — sforce_api_calls_soql", url: "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm", description: "Complete SOQL language reference — SELECT syntax, WHERE clauses, ORDER BY, LIMIT, aggregate functions. Bookmark for recording.", level: "Beginner" },
    { type: "docs", title: "Workbench — Interactive SOQL Query Tool", url: "https://workbench.developerforce.com", description: "Use Workbench to live-demo SOQL queries during recording without switching orgs. Essential for showing relationship traversal.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — SOQL Deep Dive", url: "https://www.youtube.com/@apexhours", description: "Free YouTube series on SOQL — covers parent-child queries, aggregate functions, and common pitfalls.", duration: "30–50 min", level: "Beginner" },
  ],

  // ── L06: Advanced SOQL ────────────────────────────────────────────────────
  "pdi-l06": [
    { type: "docs", title: "SOQL and SOSL Reference — Advanced Queries", url: "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm", description: "Full reference for semi-joins, anti-joins, aggregate queries (GROUP BY, HAVING), and SOQL for loops — all testable on PDI exam.", level: "Intermediate" },
    { type: "trailhead", title: "Bulk Data Management with SOQL — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/bulk-api", description: "Covers efficient SOQL patterns for bulk data — critical context for explaining SOQL for loops vs. standard loops.", duration: "~1 hr", level: "Intermediate" },
    { type: "docs", title: "Workbench — SOQL + SOSL Query Tool", url: "https://workbench.developerforce.com", description: "Live demo relationship SOSL and advanced SOQL here during recording — no scratch org needed.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — SOQL Advanced", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'SOQL advanced Salesforce' on the official Salesforce Developers channel for relationship query demos.", duration: "20–35 min", level: "Intermediate" },
  ],

  // ── L07: DML Operations ───────────────────────────────────────────────────
  "pdi-l07": [
    { type: "trailhead", title: "Apex Basics & Database — DML Section", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Hands-on DML coverage — insert, update, upsert, delete, undelete. Includes Database.SaveResult patterns. Do challenges before recording.", duration: "~1 hr section", level: "Beginner" },
    { type: "docs", title: "DML Statements — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dml_section.htm", description: "Complete DML reference — all 6 DML operations, partial success, allOrNone flag. The authoritative source for exam-ready definitions.", level: "Beginner" },
    { type: "docs", title: "Database Class Methods — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_database.htm", description: "Database.insert(), Database.update(), SaveResult, UpsertResult — exam frequently tests the difference from DML statements.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — DML and Database Methods", url: "https://www.youtube.com/@apexhours", description: "Free tutorial comparing DML statements vs. Database class methods — the most commonly tested L07 concept.", duration: "25–40 min", level: "Beginner" },
  ],

  // ── L08: Triggers Basics ──────────────────────────────────────────────────
  "pdi-l08": [
    { type: "trailhead", title: "Apex Triggers — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers", description: "PRIMARY MODULE — covers before/after triggers, trigger events, context variables (Trigger.new, Trigger.old). Do all challenges before recording.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Apex Triggers — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers.htm", description: "Official trigger reference — all trigger events, context variable types, trigger order of execution. Authoritative source for exam definitions.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Apex Triggers Series", url: "https://www.youtube.com/@apexhours", description: "Apex Hours has a multi-part free trigger series — watch to calibrate how deep to go on context variables and recursion.", duration: "30–60 min", level: "Beginner" },
    { type: "youtube", title: "Salesforce Developers — Apex Triggers", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel trigger demos — useful as a secondary visual reference for before/after trigger flow.", duration: "20–30 min", level: "Beginner" },
  ],

  // ── L09: Trigger Patterns & Best Practices ────────────────────────────────
  "pdi-l09": [
    { type: "trailhead", title: "Apex Triggers — Advanced Patterns", url: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers", description: "Trailhead's advanced trigger challenges cover the handler pattern and recursion prevention — complete before recording L09.", duration: "~1 hr section", level: "Intermediate" },
    { type: "docs", title: "Apex Triggers — Trigger Best Practices", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers.htm", description: "Official docs section on bulkification and one-trigger-per-object pattern — exam tests this directly.", level: "Intermediate" },
    { type: "blog", title: "Apex Trigger Best Practices — Salesforce Ben", url: "https://www.salesforceben.com/apex-trigger-best-practices/", description: "Salesforce Ben's practical trigger best practices article — handler class pattern, recursion prevention, and bulkification all explained. Use examples as lecture talking points.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Trigger Handler Pattern", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on the trigger handler framework — the industry-standard pattern tested in PDI scenario questions.", duration: "30–45 min", level: "Intermediate" },
  ],

  // ── L10: Asynchronous Apex ────────────────────────────────────────────────
  "pdi-l10": [
    { type: "trailhead", title: "Asynchronous Apex — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex", description: "PRIMARY MODULE — covers Future, Batch, Scheduled, and Queueable Apex with hands-on challenges. Do all units before recording L10.", duration: "~3 hr", level: "Intermediate" },
    { type: "docs", title: "Asynchronous Apex Overview — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_async_overview.htm", description: "Authoritative reference for all 4 async types, when to use each, and governor limit implications. Essential pre-read.", level: "Intermediate" },
    { type: "docs", title: "Batch Apex Interface — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_batch_interface.htm", description: "Deep dive on Database.Batchable interface — start(), execute(), finish() methods. Batch Apex is consistently high-weight on the PDI exam.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Asynchronous Apex Series", url: "https://www.youtube.com/@apexhours", description: "Free series covering Future, Batch, Scheduled, and Queueable with code walkthroughs — watch before scripting L10 examples.", duration: "1–2 hr total", level: "Intermediate" },
    { type: "udemy", title: "Salesforce PDI — Async Apex on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Top-rated PDI courses on Udemy cover async Apex in detail — review competitor explanations of chaining Queueable jobs.", level: "Intermediate" },
  ],

  // ── L11: Governor Limits ──────────────────────────────────────────────────
  "pdi-l11": [
    { type: "docs", title: "Execution Governor and Platform Limits — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_gov_limits.htm", description: "PRIMARY SOURCE — the definitive limits table. Memorize the top 10 limits before recording: SOQL (100), DML (150), heap (6 MB), CPU (10 sec).", level: "Intermediate" },
    { type: "trailhead", title: "Apex Basics & Database — Governor Limits Section", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Trailhead's practical coverage of governor limits in the context of SOQL and DML — includes bulkification challenges.", duration: "~30 min section", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Governor Limits Explained", url: "https://www.youtube.com/@apexhours", description: "Free deep-dive on governor limits with real code examples showing how to hit and avoid each limit.", duration: "30–45 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Avoiding Governor Limits", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel content on governor limits and bulkification patterns.", duration: "20–30 min", level: "Intermediate" },
  ],

  // ── L12: Exception Handling ───────────────────────────────────────────────
  "pdi-l12": [
    { type: "docs", title: "Exception Class and Built-In Exceptions — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_exception_definition.htm", description: "Complete exception reference — built-in exception types, custom exceptions, try/catch/finally. Use as source for all code examples in L12.", level: "Intermediate" },
    { type: "trailhead", title: "Apex Basics & Database — Exception Handling", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "Trailhead covers DML exceptions and try-catch patterns in context — do the exception-related challenges before recording.", duration: "~30 min section", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Exception Handling in Apex", url: "https://www.youtube.com/@apexhours", description: "Free tutorial covering try/catch/finally, custom exceptions, and DmlException handling patterns.", duration: "20–35 min", level: "Intermediate" },
    { type: "udemy", title: "Salesforce PDI — Exception Handling on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "PDI Udemy courses cover exception handling patterns for triggers — useful for finding real-world scenario examples.", level: "Intermediate" },
  ],

  // ── L13: Object-Oriented Programming in Apex ──────────────────────────────
  "pdi-l13": [
    { type: "docs", title: "Understanding Classes and Objects — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_understanding.htm", description: "Authoritative coverage of Apex OOP — classes, interfaces, inheritance, virtual/abstract, access modifiers. Required pre-read before L13.", level: "Intermediate" },
    { type: "trailhead", title: "Object-Oriented Programming for Admins — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/object-oriented-programming-for-admins", description: "Trailhead OOP module — accessible intro to classes, objects, and inheritance with Apex examples. Good baseline even for developer-focused L13.", duration: "~2 hr", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — OOP in Apex (Classes & Interfaces)", url: "https://www.youtube.com/@apexhours", description: "Free series on Apex OOP concepts — virtual classes, abstract classes, and interfaces with real-world examples.", duration: "30–60 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Apex Classes Deep Dive", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce content on inner classes, static methods, and Apex design patterns.", duration: "25–40 min", level: "Intermediate" },
  ],

  // ── L14: Integration & HTTP Callouts ──────────────────────────────────────
  "pdi-l14": [
    { type: "trailhead", title: "Apex Integration Services — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_integration_services", description: "PRIMARY MODULE — covers REST callouts, SOAP callouts, and Apex REST/SOAP web services. Complete all units before recording L14.", duration: "~3 hr", level: "Intermediate" },
    { type: "docs", title: "HttpRequest Class — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_restful_http_httprequest.htm", description: "Full HttpRequest, HttpResponse, and Http class reference — source of truth for callout code in your live demo.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — REST Callouts in Apex", url: "https://www.youtube.com/@apexhours", description: "Free walkthrough of making REST callouts, mock frameworks, and testing callouts — critical for both L14 content and testing.", duration: "30–50 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Apex Callouts", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce demos on REST and SOAP callouts — use for secondary reference during recording.", duration: "20–35 min", level: "Intermediate" },
  ],

  // ── L15: Visualforce Basics ───────────────────────────────────────────────
  "pdi-l15": [
    { type: "trailhead", title: "Visualforce Fundamentals — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/visualforce_fundamentals", description: "PRIMARY MODULE — covers VF page markup, standard controllers, and expression language. Complete all challenges before recording L15.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "Visualforce Developer Guide — Introduction", url: "https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_intro.htm", description: "Full Visualforce Developer Guide — MVC architecture, component reference, controller types. Bookmark this as your on-screen reference.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Visualforce Basics", url: "https://www.youtube.com/@apexhours", description: "Free tutorial series on Visualforce pages with standard controllers — watch before scripting your live coding demo.", duration: "30–45 min", level: "Beginner" },
    { type: "udemy", title: "Salesforce PDI — Visualforce on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "Top PDI courses on Udemy include Visualforce sections — useful for identifying which VF concepts are most commonly tested.", level: "Beginner" },
  ],

  // ── L16: Visualforce Advanced (Custom Controllers) ────────────────────────
  "pdi-l16": [
    { type: "trailhead", title: "Visualforce Fundamentals — Custom Controller Units", url: "https://trailhead.salesforce.com/content/learn/modules/visualforce_fundamentals", description: "Advanced units cover custom controllers, controller extensions, and action methods — do these before recording L16.", duration: "~1 hr section", level: "Intermediate" },
    { type: "docs", title: "Visualforce Developer Guide — Custom Controllers", url: "https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_intro.htm", description: "Official guide on custom controller architecture, getter/setter patterns, and view state — authoritative source for L16 exam scenarios.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Visualforce Custom Controllers", url: "https://www.youtube.com/@apexhours", description: "Free deep-dive on custom controllers and extensions — covers action methods, pagination, and view state management.", duration: "30–50 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Visualforce Advanced", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce videos on advanced Visualforce patterns — controller extensions vs. custom controllers distinction is frequently tested.", duration: "20–35 min", level: "Intermediate" },
  ],

  // ── L17: LWC Basics ───────────────────────────────────────────────────────
  "pdi-l17": [
    { type: "trailhead", title: "Lightning Web Components Basics — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics", description: "PRIMARY MODULE — HTML templates, JS controllers, component lifecycle hooks, and @track/@api decorators. Complete all units before recording.", duration: "~3 hr", level: "Beginner" },
    { type: "docs", title: "LWC Developer Guide — Official Reference", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc", description: "Complete LWC developer documentation — component bundle structure, decorators, lifecycle hooks. Keep open during recording as a live reference.", level: "Beginner" },
    { type: "docs", title: "LWC Recipes — Trailhead App GitHub", url: "https://github.com/trailheadapps/lwc-recipes", description: "Official Salesforce LWC recipe collection — working code examples for every LWC pattern. Clone this before recording so you can demo real code.", level: "Beginner" },
    { type: "youtube", title: "Salesforce Developers — LWC Getting Started", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official LWC intro videos from the Salesforce Developers channel — watch the 'LWC basics' series to align your content with Salesforce's official framing.", duration: "30–50 min", level: "Beginner" },
  ],

  // ── L18: LWC Data Binding & Events ────────────────────────────────────────
  "pdi-l18": [
    { type: "trailhead", title: "Lightning Web Components Basics — Events & Properties", url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics", description: "Covers @api, @track, event dispatching, and event handling in detail — the most tested LWC area on the PDI exam.", duration: "~1 hr section", level: "Intermediate" },
    { type: "docs", title: "LWC Developer Guide — Events and Communication", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc", description: "Official documentation on CustomEvent, event bubbling, and parent-child communication patterns — reference during recording.", level: "Intermediate" },
    { type: "docs", title: "LWC Recipes — Event Patterns", url: "https://github.com/trailheadapps/lwc-recipes", description: "LWC Recipes repo includes working event examples (wireGetPicklistValues, pubsub, etc.) — demo these live in your recording.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — LWC Events Deep Dive", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Search 'LWC events Salesforce Developers' for official videos on parent-child communication patterns.", duration: "25–40 min", level: "Intermediate" },
  ],

  // ── L19: LWC Wire Service & Apex Integration ──────────────────────────────
  "pdi-l19": [
    { type: "trailhead", title: "Lightning Web Components Basics — Wire Service", url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics", description: "Covers @wire decorator, wire adapters, and calling Apex from LWC — all three patterns (wire, imperative, async) are PDI exam staples.", duration: "~1 hr section", level: "Intermediate" },
    { type: "docs", title: "LWC Developer Guide — Wire Service & Apex", url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc", description: "Official wire service reference — @AuraEnabled, cacheable=true, wire adapter syntax. Use as screen-share reference during recording.", level: "Intermediate" },
    { type: "docs", title: "LWC Recipes — Wire & Apex Examples", url: "https://github.com/trailheadapps/lwc-recipes", description: "LWC Recipes has dedicated wire and Apex examples with comments — clone and run before recording L19.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — LWC Wire Service and Apex", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on @wire vs imperative Apex calls in LWC — the #1 comparison question on PDI exams.", duration: "30–45 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — @AuraEnabled and Wire", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel content on exposing Apex to LWC and the wire service lifecycle.", duration: "25–35 min", level: "Intermediate" },
  ],

  // ── L20: Apex Testing Basics ──────────────────────────────────────────────
  "pdi-l20": [
    { type: "trailhead", title: "Apex Testing — Official Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_testing", description: "PRIMARY MODULE — @isTest, Test.startTest/stopTest, test data factories, and code coverage requirements. Complete all units before recording.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Testing Apex — Apex Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing.htm", description: "Complete testing reference — @isTest annotation, seeAllData=false, System.assert methods, and bulk testing patterns.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Writing Apex Tests", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on writing test classes, test data setup, and achieving 75% coverage — covers the most-tested exam scenarios.", duration: "30–50 min", level: "Intermediate" },
    { type: "udemy", title: "Salesforce PDI — Apex Testing on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "PDI Udemy courses cover Apex testing in depth — review how top-rated instructors sequence test data factories vs. inline setup.", level: "Intermediate" },
  ],

  // ── L21: Advanced Apex Testing ────────────────────────────────────────────
  "pdi-l21": [
    { type: "trailhead", title: "Apex Testing — Mock and Stub Patterns", url: "https://trailhead.salesforce.com/content/learn/modules/apex_testing", description: "Advanced testing units cover HttpCalloutMock, StaticResourceCalloutMock, and StubProvider — all high-weight PDI exam topics.", duration: "~1 hr section", level: "Advanced" },
    { type: "docs", title: "Testing Apex — HttpCalloutMock and System.StubProvider", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing.htm", description: "Official reference for mock interfaces — HttpCalloutMock, MultiStaticResourceCalloutMock, and stub-based testing.", level: "Advanced" },
    { type: "youtube", title: "Apex Hours — Mocking in Apex Tests", url: "https://www.youtube.com/@apexhours", description: "Free deep-dive on mocking callouts and using Test.setMock() — one of the hardest PDI topics made clear.", duration: "25–40 min", level: "Advanced" },
    { type: "youtube", title: "Salesforce Developers — Advanced Apex Testing", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce content on advanced testing patterns including mock frameworks.", duration: "20–35 min", level: "Advanced" },
  ],

  // ── L22: Debugging ────────────────────────────────────────────────────────
  "pdi-l22": [
    { type: "trailhead", title: "Apex Debugging and Testing — Trailhead Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_debugging_and_testing", description: "Covers Developer Console log inspector, debug log levels, checkpoints, and heap dump analysis. Complete before recording L22.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Developer Console Overview — Debug Logs and Checkpoints", url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_ide.meta/salesforce_ide/code_tools_intro.htm", description: "Official docs for the Developer Console debug log interface — log levels (FINEST to ERROR) and the execution overview panel.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Debugging Apex Code", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on reading debug logs, setting checkpoints, and using System.debug() efficiently.", duration: "20–35 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Debug Log Deep Dive", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel walkthrough of the Developer Console log inspector — great companion to your screen recording.", duration: "15–25 min", level: "Intermediate" },
  ],

  // ── L23: Deployment ───────────────────────────────────────────────────────
  "pdi-l23": [
    { type: "trailhead", title: "Application Lifecycle and Development Models — Trailhead", url: "https://trailhead.salesforce.com/content/learn/modules/application_lifecycle_and_development_models", description: "PRIMARY MODULE — covers change sets, SFDX source format, scratch orgs, and sandbox strategies. Complete before recording L23.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Salesforce DX Developer Guide — SFDX CLI", url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm", description: "Official SFDX developer guide — project structure, sfdx force:source:push/pull, scratch org setup. Reference during CLI demo recording.", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Salesforce DX and Deployment", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel content on SFDX, change sets, and DevOps — watch to calibrate your deployment section depth.", duration: "30–50 min", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Deployment and Change Sets", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on change sets vs. SFDX deployments — covers the decision criteria that PDI exam scenarios test.", duration: "25–40 min", level: "Intermediate" },
  ],

  // ── L24: Security in Apex ─────────────────────────────────────────────────
  "pdi-l24": [
    { type: "trailhead", title: "Secure Coding — Injection Vulnerabilities (Trailhead)", url: "https://trailhead.salesforce.com/content/learn/modules/secdev_injection_vulnerabilities", description: "PRIMARY MODULE — covers SOQL injection, String.escapeSingleQuotes(), and dynamic SOQL risks. PDI exam tests this heavily — do all units before recording.", duration: "~2 hr", level: "Intermediate" },
    { type: "docs", title: "Enforcing CRUD and FLS in Apex — Secure Coding Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_apex_enforcing_crud_flsd.htm", description: "Official secure coding reference for CRUD/FLS enforcement — with/without sharing, stripInaccessible(), Schema.DescribeFieldResult. Essential pre-read.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Apex Security (Sharing Rules & CRUD)", url: "https://www.youtube.com/@apexhours", description: "Free tutorial on with/without/inherited sharing, enforcing FLS, and avoiding SOQL injection — covers all testable security patterns.", duration: "30–45 min", level: "Intermediate" },
    { type: "youtube", title: "Salesforce Developers — Secure Coding in Apex", url: "https://www.youtube.com/@SalesforceDevelopers", description: "Official Salesforce channel content on secure Apex patterns — good secondary reference for CRUD enforcement examples.", duration: "20–35 min", level: "Intermediate" },
    { type: "udemy", title: "Salesforce PDI — Security Topics on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1&sort=highest-rated", description: "PDI Udemy courses include security sections — review how top instructors teach SOQL injection defense and sharing model.", level: "Intermediate" },
  ],

  // ── Lab 01: Developer Org Setup & Console Basics ──────────────────────────
  "pdi-lab01": [
    { type: "trailhead", title: "Apex Basics & Database — Setup and Anonymous Apex", url: "https://trailhead.salesforce.com/content/learn/modules/apex_intro", description: "The starting Trailhead module used for Lab 01 setup — walks through org setup, Developer Console, and first Apex execution.", duration: "~1 hr", level: "Beginner" },
    { type: "docs", title: "Developer Console Overview — Code Tools Intro", url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_ide.meta/salesforce_ide/code_tools_intro.htm", description: "Official docs for Developer Console navigation — open alongside your lab recording to confirm each step.", level: "Beginner" },
    { type: "youtube", title: "Apex Hours — Developer Console Setup Walkthrough", url: "https://www.youtube.com/@apexhours", description: "Free video walkthrough of Developer Console setup steps — use to verify lab instructions before recording.", duration: "15–25 min", level: "Beginner" },
    { type: "docs", title: "SFDX CLI Introduction — Developer Guide", url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm", description: "Reference for any CLI-based org setup steps in Lab 01 — useful if the lab includes VS Code / SFDX tooling.", level: "Beginner" },
  ],

  // ── Lab 02: SOQL, DML & Governor Limits ───────────────────────────────────
  "pdi-lab02": [
    { type: "trailhead", title: "Apex Basics & Database — SOQL & DML Lab", url: "https://trailhead.salesforce.com/content/learn/modules/apex_database", description: "The core Trailhead module for Lab 02 content — hands-on SOQL queries and DML operations in a real org.", duration: "~2 hr", level: "Beginner" },
    { type: "docs", title: "SOQL and SOSL Reference", url: "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm", description: "Complete SOQL syntax reference — open during lab recording to show students where to look up clause syntax.", level: "Beginner" },
    { type: "docs", title: "Workbench — Interactive SOQL Tool", url: "https://workbench.developerforce.com", description: "Use Workbench in Lab 02 to show SOQL results visually before writing Apex — reduces context-switching for students.", level: "Beginner" },
    { type: "docs", title: "Governor Limits Reference", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_gov_limits.htm", description: "Reference the limits table during Lab 02 to show students exactly which limits their code is consuming.", level: "Intermediate" },
  ],

  // ── Lab 03: Triggers & Unit Tests ─────────────────────────────────────────
  "pdi-lab03": [
    { type: "trailhead", title: "Apex Triggers — Hands-On Module", url: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers", description: "PRIMARY reference for Lab 03 — hands-on trigger challenges covering before/after events and context variables.", duration: "~2 hr", level: "Intermediate" },
    { type: "trailhead", title: "Apex Testing — Test Classes for Triggers", url: "https://trailhead.salesforce.com/content/learn/modules/apex_testing", description: "Trailhead's testing module covers writing test classes for trigger scenarios — Lab 03 combines triggers with required test coverage.", duration: "~1.5 hr", level: "Intermediate" },
    { type: "docs", title: "Apex Triggers Reference", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers.htm", description: "Official trigger docs — keep open during lab recording as a reference for context variable types and trigger events.", level: "Intermediate" },
    { type: "youtube", title: "Apex Hours — Writing Tests for Triggers", url: "https://www.youtube.com/@apexhours", description: "Free tutorial specifically on testing trigger logic — test data setup, bulk assertions, and achieving 100% branch coverage.", duration: "25–40 min", level: "Intermediate" },
  ],

  // ── Exam Prep ─────────────────────────────────────────────────────────────
  "pdi-exam": [
    { type: "trailhead", title: "Platform Developer I — Official Exam Guide", url: "https://trailhead.salesforce.com/credentials/platformdeveloperi", description: "PRIMARY EXAM RESOURCE — official exam objectives, topic weights, and registration link. Align your course outline directly to this exam guide.", level: "Intermediate" },
    { type: "trailhead", title: "Prepare for Your Salesforce PDI Credential — Official Trail Mix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-developer-i-credential", description: "Official Salesforce-curated study path — all required modules in one trail mix. Share directly with students as the companion study guide.", duration: "~40 hr total", level: "Intermediate" },
    { type: "udemy", title: "Salesforce PDI Certification — Practice Tests on Udemy", url: "https://www.udemy.com/courses/search/?q=salesforce+platform+developer+1+certification&sort=highest-rated", description: "Top-rated PDI practice exam courses on Udemy — review question banks to understand how exam questions are framed and spot coverage gaps in your lectures.", level: "Intermediate" },
    { type: "blog", title: "Focus on Force — PDI Study Guide", url: "https://focusonforce.com/salesforce-certifications/platform-developer-1/", description: "Focus on Force's structured PDI guide — topic-by-topic pass percentage data and practice questions. Most popular paid study resource among students.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Ben — PDI Exam Guide", url: "https://www.salesforceben.com/salesforce-platform-developer-1-exam-guide/", description: "Salesforce Ben's comprehensive free PDI exam guide — covers all topic areas with study recommendations and exam-day tips.", level: "Intermediate" },
  ],

  // ── Cheat Sheet ───────────────────────────────────────────────────────────
  "pdi-cheatsheet": [
    { type: "trailhead", title: "Platform Developer I — Exam Objectives (Official)", url: "https://trailhead.salesforce.com/credentials/platformdeveloperi", description: "The source of truth for your cheat sheet — download the official exam guide PDF and map every topic to a cheat sheet section.", level: "Intermediate" },
    { type: "docs", title: "Apex Governor Limits — Quick Reference", url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_gov_limits.htm", description: "The limits table is the single most cheat-sheet-worthy content in the entire PDI exam — include the top 10 limits with their values.", level: "Intermediate" },
    { type: "trailhead", title: "Prepare for PDI — Official Trail Mix", url: "https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-platform-developer-i-credential", description: "Use the trail mix topic list to verify your cheat sheet covers every Trailhead module that Salesforce recommends.", duration: "~40 hr total", level: "Intermediate" },
    { type: "blog", title: "Focus on Force — PDI Cheat Sheet Resource", url: "https://focusonforce.com/salesforce-certifications/platform-developer-1/", description: "Focus on Force organizes PDI topics by exam weight — essential input when deciding what to emphasize on each cheat sheet page.", level: "Intermediate" },
    { type: "blog", title: "Salesforce Ben — PDI Quick Reference", url: "https://www.salesforceben.com/salesforce-platform-developer-1-exam-guide/", description: "Salesforce Ben's guide has a concise summary of each topic area — cross-reference against your cheat sheet for completeness.", level: "Intermediate" },
  ],

};
