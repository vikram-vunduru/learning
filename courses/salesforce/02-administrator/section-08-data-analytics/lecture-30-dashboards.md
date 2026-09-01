# L30: Dashboards

## 🎯 Learning Objectives
- Identify and describe each dashboard component type (chart, gauge, metric, table, Visualforce, Lightning)
- Explain the difference between a static running user dashboard and a dynamic dashboard
- Configure dashboard filters and understand how they work
- Manage dashboard folder permissions and sharing
- Add dashboards to home pages and Lightning pages
- Explain dashboard refresh behavior and scheduling

## 📊 SLIDES

### Slide 1: What Is a Salesforce Dashboard?
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  Q4 SALES DASHBOARD          Last Refreshed: Nov 15, 9:00AM │
  ├──────────────────────┬──────────────────┬────────────────────┤
  │  BAR CHART           │   METRIC         │   DONUT CHART      │
  │  (component type)    │   (component)    │   (component type) │
  │                      │                  │                    │
  │  ██                  │  Total Pipeline  │    ┌──────┐        │
  │  ██ ██               │                  │    │ /--\ │        │
  │  ██ ██ ██            │    $ 2.4 M        │    │ \__/ │        │
  │  ─────────           │  (single number) │    └──────┘        │
  │  Q1  Q2  Q3          │                  │    By Stage        │
  ├──────────────────────┴──────────────────┴────────────────────┤
  │                         TABLE  (component type)             │
  │  Rep Name    │  Open Opps  │  Amount     │  Close Date       │
  │  Smith, J    │     12      │  $480,000   │  Q4 2024          │
  │  Chen, S     │      8      │  $320,000   │  Q4 2024          │
  │  Lee, M      │      5      │  $195,000   │  Q4 2024          │
  └──────────────────────────────────────────────────────────────┘
  Each component is sourced from a single underlying report
  Up to 20 components per dashboard
```
**Content:**
- A dashboard is a visual display of key metrics and trends from Salesforce reports
- Dashboards consist of **components**, each sourced from a single report
- Up to **20 components** per dashboard
- Dashboards are stored in **Dashboard Folders** (access controlled by folder settings)
- Users must have "Run Reports" permission to view dashboards
- Users must have "View Dashboards" permission (included in most standard profiles)
**Speaker Notes:** Dashboards are the visualization layer on top of reports. Every component on a dashboard is powered by a report — you cannot put data on a dashboard without a report. This is a key point: if the underlying report doesn't return data, the component will be empty. Dashboards update their data either manually when refreshed or via a scheduled refresh.

### Slide 2: Dashboard Component Types
**Visual:**
```
  DASHBOARD COMPONENT TYPES
  ┌──────────────────────┬─────────────────────────────────────────┐
  │  Component Type      │  Description & Use Case                 │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Chart               │  Bar, column, line, pie, donut, funnel  │
  │                      │  Requires Summary or Matrix report      │
  │                      │  Cannot use Tabular as source           │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Gauge               │  Single value vs. a range               │
  │  [  |====|      ]    │  Min / Target / Max, color-coded        │
  │  red  yellow  green  │  Best for: quota attainment KPIs        │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Metric              │  One large summary number               │
  │     $ 5.2 M          │  Best for: total pipeline, open cases   │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Table               │  Top/bottom N records list              │
  │                      │  Can use Tabular or Summary source      │
  │                      │  Supports conditional highlighting      │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Visualforce Page    │  Custom VF page embedded (legacy)       │
  ├──────────────────────┼─────────────────────────────────────────┤
  │  Lightning Component │  Custom LWC/Aura component (modern)     │
  └──────────────────────┴─────────────────────────────────────────┘
```
**Content:**
- **Chart:** Bar, column, line, pie, donut, funnel, scatter — visualizes grouped/aggregated report data
- **Gauge:** Shows a single value against a range (min/target/max) — great for KPIs like quota attainment
- **Metric:** Displays a single summary number prominently (e.g., Total Pipeline = $5.2M)
- **Table:** Shows top/bottom N records from a tabular or summary report; supports conditional highlighting
- **Visualforce Page:** Embed a custom Visualforce page as a component (legacy)
- **Custom Lightning Component:** Embed a custom LWC/Aura component (modern approach)
**Speaker Notes:** Charts require a Summary or Matrix report (must have groupings). Gauges and Metrics work well with summary reports that produce a single aggregate number. Tables can use tabular reports. On the exam, remember that tabular reports cannot source chart components — a common distractor. Visualforce and Lightning components give developers unlimited flexibility but require code.

### Slide 3: Static Running User vs. Dynamic Dashboard
**Visual:**
```
  ┌──────────────────────────────┬─────────────────────────────────┐
  │  STATIC RUNNING USER         │  DYNAMIC DASHBOARD              │
  │  DASHBOARD                   │  ("Run as logged-in user")      │
  ├──────────────────────────────┼─────────────────────────────────┤
  │                              │                                 │
  │  Running User:               │  Each user sees THEIR OWN data  │
  │  [Sarah — VP Sales]          │                                 │
  │          │                   │  [Rep A] ──▶ sees Rep A data    │
  │          ▼                   │  [Rep B] ──▶ sees Rep B data    │
  │  ┌───────────────────┐       │  [Mgr C] ──▶ sees Mgr C data   │
  │  │   ALL VIEWERS     │       │                                 │
  │  │   see Sarah's     │       │  Same dashboard — different     │
  │  │   accessible      │       │  results per logged-in user     │
  │  │   records         │       │                                 │
  │  └───────────────────┘       │  Enforces record-level          │
  │                              │  security automatically         │
  ├──────────────────────────────┼─────────────────────────────────┤
  │  Good for: org-wide views,   │  Good for: team dashboards,     │
  │  exec-level visibility       │  personal KPI tracking          │
  │  "show everyone the          │  "each person sees their own    │
  │   company-wide numbers"      │   slice of the data"            │
  └──────────────────────────────┴─────────────────────────────────┘
```
**Content:**
- **Static Running User Dashboard:**
  - Dashboard runs as one specific user (the "running user")
  - All viewers see the same data — the running user's accessible records
  - Good for: executives who want everyone to see company-wide data
  - Running user must have access to the data you want displayed
- **Dynamic Dashboard:**
  - Each user sees the dashboard from their OWN perspective
  - Data shown is what THAT logged-in user can access
  - Enforces record-level security automatically
  - Users cannot save the dashboard to their personal view
**Speaker Notes:** The running user concept is crucial for the exam. If a VP of Sales is set as the running user, every sales rep who views the dashboard sees all opportunities the VP can see — not just their own. Dynamic dashboards flip this: each user sees only their own data. This is the recommended approach for team dashboards where you want to respect data visibility settings. There's a limit on the number of dynamic dashboards per org (typically 5 for Professional, up to 10 for Enterprise/Unlimited).

### Slide 4: Dynamic Dashboard Limits and Setup
**Visual:**
```
  DYNAMIC DASHBOARD LIMITS BY SALESFORCE EDITION
  ┌──────────────────────────────────┬─────────────────────────┐
  │  Salesforce Edition              │  Max Dynamic Dashboards │
  ├──────────────────────────────────┼─────────────────────────┤
  │  Professional Edition            │  5                      │
  ├──────────────────────────────────┼─────────────────────────┤
  │  Enterprise Edition              │  10                     │
  ├──────────────────────────────────┼─────────────────────────┤
  │  Unlimited / Performance Edition │  10                     │
  └──────────────────────────────────┴─────────────────────────┘
  
  ┌────────────────────────────────────────────────────────────┐
  │  IMPORTANT: The limit is on DEFINED dynamic dashboards,   │
  │  NOT on the number of users who view them                 │
  │                                                            │
  │  50 sales reps ──▶ only 1 dynamic dashboard needed        │
  │  (it renders differently for each user who views it)      │
  └────────────────────────────────────────────────────────────┘
  
  Enable: Edit Dashboard → Settings → "Run as logged-in user"
  
  Limitation: Dynamic dashboard users cannot set "Run As" another user
  Data is cached — users may see data from the last refresh
```
**Content:**
- **Enabling Dynamic Dashboards:** Edit dashboard → Settings → "Run as logged-in user"
- **Dynamic Dashboard Limits by Edition:**
  - Professional Edition: 5 dynamic dashboards
  - Enterprise Edition: 10 dynamic dashboards
  - Unlimited/Performance Edition: 10 dynamic dashboards
- **Limitation:** Dynamic dashboard users cannot set the dashboard to "Run As" another user
- **Dynamic Dashboard Caching:** Dashboard caches data — users may see data from last refresh, not real-time
- **Workaround:** Static dashboard with a high-access running user for org-wide visibility
**Speaker Notes:** Dynamic dashboard limits are commonly tested. If a company has 50 sales reps and needs each to see their own pipeline dashboard, they need a dynamic dashboard — but only one dynamic dashboard is needed (not 50 separate ones). The same dashboard renders differently for each user. The org limit is on the number of dynamic dashboards defined, not the number of users viewing them.

### Slide 5: Dashboard Filters
**Visual:**
```
  ┌──────────────────────────────────────────────────────────────┐
  │  Q4 Sales Dashboard                  [Filter ▼]  [Refresh]  │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │  DASHBOARD FILTER                                    │   │
  │  │  Region:  [● All   ○ West   ○ East   ○ Central ]     │   │
  │  └──────────────────────────────────────────────────────┘   │
  │                           │                                  │
  │         Applies to ALL components simultaneously             │
  │                           ▼                                  │
  ├───────────────────┬───────────────────┬──────────────────────┤
  │  Component 1      │  Component 2      │  Component 3         │
  │  (filtered by     │  (filtered by     │  (filtered by        │
  │   Region=West)    │   Region=West)    │   Region=West)       │
  └───────────────────┴───────────────────┴──────────────────────┘
  
  DASHBOARD FILTER RULES:
  ┌────────────────────────────────────────────────────────────┐
  │  • Maximum 3 dashboard filters per dashboard               │
  │  • Filter options defined by the dashboard creator         │
  │  • Applies on TOP of existing report filters               │
  │  • Filters do NOT persist between sessions                 │
  │  • Use case: share one dashboard across regions/teams      │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- **Dashboard Filters** allow viewers to slice dashboard data without editing the underlying reports
- Up to **3 dashboard filters** per dashboard
- Each filter applies to all components on the dashboard (that have the corresponding field)
- Filter options are set by the dashboard creator
- Filters are applied on top of the report's existing filters
- **Use case:** Regional manager views same dashboard filtered by their region
- Filters do NOT persist between sessions (return to default next visit)
**Speaker Notes:** Dashboard filters are different from report filters — they're an additional layer of filtering applied at the dashboard level, on top of whatever filters are already in the underlying reports. The dashboard creator defines up to three filters and their possible values. Viewers can then use those filters to dynamically slice the data. This is excellent for sharing a single dashboard across teams or regions without building separate dashboards per region.

### Slide 6: Dashboard Refresh and Scheduling
**Visual:**
```
  DASHBOARD REFRESH LIFECYCLE
  
  ┌─────────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │  LAST REFRESHED     │   │  MANUAL REFRESH  │   │  SCHEDULED       │
  │  Nov 14, 9:00 AM    │   │                  │   │  REFRESH         │
  │                     │   │  User clicks     │   │                  │
  │  Dashboard data     │   │  [Refresh]       │   │  Auto-runs at    │
  │  may be up to       │   │  button on       │   │  set time        │
  │  24 hours old       │   │  the dashboard   │   │  (daily/weekly)  │
  │  (cached)           │   │                  │   │                  │
  └──────────┬──────────┘   └────────┬─────────┘   └────────┬─────────┘
             │                       │                       │
             └──────────┬────────────┘                       │
                        ▼                                    ▼
             ┌──────────────────────┐          ┌─────────────────────┐
             │  Current data loads  │          │  Email notification │
             │  into all components │          │  (snapshot) sent    │
             └──────────────────────┘          │  to subscribers     │
                                               └─────────────────────┘
  
  Dashboard data is NOT real-time
  Always check "Last Refreshed" timestamp for data currency
  "Schedule Dashboards" permission required for scheduled refresh
```
**Content:**
- **Dashboard data is NOT real-time** — it shows data from the last refresh
- **Manual Refresh:** Click "Refresh" button on the dashboard — updates all components
- **Scheduled Refresh:** Set a time for automatic refresh (daily/weekly)
  - Configure in Dashboard → Schedule Refresh
  - Must have "Schedule Dashboards" permission
- **Caching:** Dashboard data is cached for up to 24 hours
- **Subscribe to Dashboard:** Receive email with dashboard snapshot on a schedule
  - Can configure conditions (e.g., notify when a metric exceeds a threshold)
- The "Last Refreshed" timestamp tells users how current the data is
**Speaker Notes:** This is a common source of confusion: dashboards are NOT live. They display the data as of the last time the dashboard was refreshed. If a user refreshes manually, they get current data. If no one refreshes, the data can be up to 24 hours stale. For real-time decision-making, users should run the underlying reports directly. Dashboard subscriptions are great for morning briefings — the scheduled refresh runs and an email with the dashboard snapshot goes to subscribers.

### Slide 7: Dashboard Folder Permissions
**Visual:**
```
  DASHBOARD FOLDER — Sharing & Permission Levels
  
  Sales Dashboards Folder — Sharing Settings:
  ┌────────────────────────┬──────────────────────────────────────┐
  │  Share With            │  Access Level                        │
  ├────────────────────────┼──────────────────────────────────────┤
  │  VP Sales Role         │  Manager   (full control, can share) │
  │  Sales Team Group      │  Editor    (create / edit dashboards)│
  │  All Internal Users    │  Viewer    (view and run only)       │
  └────────────────────────┴──────────────────────────────────────┘
  
  ACCESS LEVEL DETAILS:
  ┌─────────────┬──────────────────────────────────────────────┐
  │  Viewer     │  See and run dashboards in the folder        │
  ├─────────────┼──────────────────────────────────────────────┤
  │  Editor     │  Create and edit dashboards in the folder    │
  ├─────────────┼──────────────────────────────────────────────┤
  │  Manager    │  Full control: share, rename, delete folder  │
  └─────────────┴──────────────────────────────────────────────┘
  
  ┌────────────────────────────────────────────────────────────┐
  │  Personal Folders:  private to owner, cannot be shared    │
  │  "Run Reports" permission still required to view data     │
  │  Dashboard folder access ≠ Report folder access           │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- Dashboards are stored in **folders** (same concept as report folders)
- **Access Levels per folder:**
  - **Viewer:** Can see and run dashboards in the folder
  - **Editor:** Can create and edit dashboards in the folder
  - **Manager:** Full control — can share, rename, delete the folder
- **Sharing targets:** All users, specific roles, public groups, or profiles
- Users need the **"View Dashboards in Public Folders"** permission to see shared dashboards
- **Personal Folders:** Private to the owner — cannot be shared
- Dashboard folder access is separate from report folder access
**Speaker Notes:** Dashboard and report folder permissions follow the same model but are managed separately. Just because someone has access to a report folder doesn't mean they have access to the dashboard folder that sources from those reports. Exam questions often test the three permission levels: Viewer (read-only), Editor (create/edit), and Manager (full control including sharing). Also remember that even if someone has dashboard folder access, they still need the "Run Reports" permission to actually view dashboard data.

### Slide 8: Adding Dashboards to Home Page & Lightning Pages
**Visual:**
```
  LIGHTNING APP BUILDER — Home Page Layout
  ┌──────────────────────────────────────────────────────────────┐
  │  COMPONENT PALETTE           │  HOME PAGE CANVAS             │
  │  ─────────────────────       │  ──────────────────────────── │
  │  Standard Components:        │  ┌────────────────────────┐   │
  │  • Dashboard    ◀── drag ───▶│  │   Dashboard Component  │   │
  │  • Recent Items              │  │                        │   │
  │  • Tasks                     │  │  Dashboard:            │   │
  │  • Activity Timeline         │  │  [ Q4 Sales Dash ▼ ]  │   │
  │  • Rich Text Block           │  │                        │   │
  │  • ...                       │  │  [preview renders here]│   │
  │                              │  └────────────────────────┘   │
  │                              │  ┌────────────────────────┐   │
  │                              │  │   Recent Items         │   │
  │                              │  └────────────────────────┘   │
  └──────────────────────────────┴────────────────────────────────┘
  
  REQUIREMENTS & BEST PRACTICES:
  ┌────────────────────────────────────────────────────────────┐
  │  • User must have access to the dashboard folder          │
  │  • Best practice: dynamic dashboard for personalized KPIs │
  │  • Available on: Home pages, App pages, Record pages      │
  │  • Salesforce mobile app: Dashboards tab available        │
  └────────────────────────────────────────────────────────────┘
```
**Content:**
- **Dashboard component in Lightning App Builder:**
  - Add a Dashboard component to any Lightning page (Home, App, Record)
  - Select which dashboard to display directly on the page
  - Users see it embedded in the page — no need to navigate to Reports tab
- **Home Page dashboard:** Classic way to show KPIs on the org's home page
- **Salesforce mobile app:** Dashboards are available in the mobile app via the Dashboards tab
- **Requirements:** User must have access to the dashboard folder to see the embedded dashboard
- **Best practice:** Use a dynamic dashboard on Home Page for personalized KPIs
**Speaker Notes:** Embedding dashboards on the Home page or record pages is a powerful way to surface key metrics contextually. For example, on an Account record page, you could embed a dashboard filtered to that account's data. The Lightning App Builder makes this a simple drag-and-drop operation. Always remember that folder access controls whether the embedded dashboard renders or shows a "no access" message for that user.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 30 — Dashboards. If reports are the engine of Salesforce analytics, dashboards are the dashboard — the visual display that turns data into insights at a glance.

A Salesforce dashboard is a collection of visual components, each powered by an underlying report. You can have up to 20 components per dashboard. Every dashboard lives in a dashboard folder, and folder permissions control who can view, edit, or manage the dashboard.

Let's talk about component types. Charts are the most common — bar, column, line, pie, donut, funnel — and they require a Summary or Matrix report as the source. A Gauge component shows a single value against a range, perfect for showing quota attainment against a target. A Metric component shows a single number prominently — great for a "Total Pipeline" or "Open Cases" KPI. Tables show a list of records, sortable, with optional conditional highlighting. And you can also embed custom Visualforce pages or Lightning Web Components as dashboard components for highly custom visuals.

Now, the most important concept in dashboards: the running user. Every dashboard runs its data as a specific user. By default, this is the person who created or last edited the dashboard. All viewers see the same data — they see what the running user can access. This is called a static running user dashboard.

The alternative is a dynamic dashboard. When you enable "Run as logged-in user" in the dashboard settings, each person who views the dashboard sees only the data they personally have access to. So a sales rep sees their own pipeline, and their manager sees the full team's pipeline — from the same dashboard. Dynamic dashboards are limited per org: Professional Edition allows 5, and Enterprise/Unlimited allows 10. You only need one dynamic dashboard — it just renders differently per user.

Dashboard filters add another dimension. You can add up to three filters per dashboard, letting viewers slice the data — for example, filtering a sales dashboard by region. These filters layer on top of the existing report filters and don't require editing the underlying reports.

Dashboard data is NOT real-time. It shows data from the last refresh. You can refresh manually or schedule an automatic refresh. The "Last Refreshed" timestamp on the dashboard tells users how current the data is. Users can also subscribe to receive a dashboard snapshot by email on a schedule.

Finally, dashboards can be embedded on Lightning Home Pages and App pages using the Lightning App Builder. This lets you surface key metrics right where users work, without requiring them to navigate to the Reports tab.

## 🔔 EXAM TIPS
- **Running User:** Static dashboards run as one user — all viewers see that user's data. Dynamic dashboards run as the logged-in user — each viewer sees their own data.
- **Dynamic Dashboard Limits:** Professional = 5, Enterprise/Unlimited = 10 per org. This is frequently tested.
- **Component Sources:** Chart components require Summary or Matrix report (must have groupings). Table components can use Tabular reports.
- **Dashboard Filters:** Maximum 3 per dashboard. Applied on top of report filters. Don't persist between sessions.
- **Not Real-Time:** Dashboard data is cached from last refresh — up to 24 hours old unless manually refreshed.
- **Folder Permissions:** Three levels — Viewer, Editor, Manager. Separate from report folder permissions.
- **"Run Reports" Permission:** Required to view dashboards, even if the user has folder access.

## ✅ LECTURE SUMMARY
- Dashboards are visual displays of up to 20 components, each sourced from a single report
- Component types: Chart, Gauge, Metric, Table, Visualforce, Custom Lightning Component
- Static dashboards run as a fixed running user; dynamic dashboards run as each logged-in user
- Dynamic dashboard limits: Professional = 5, Enterprise/Unlimited = 10 per org
- Dashboard filters (max 3) let viewers slice data without editing underlying reports
- Dashboard data is cached — not real-time; refresh manually or on a schedule
- Dashboard folders control access with three permission levels: Viewer, Editor, Manager
- Dashboards can be embedded on Lightning pages via the Lightning App Builder

## ❓ MINI QUIZ

**Q1:** A company has 30 sales reps who all need to see their own individual pipeline on a shared dashboard. The company is on Enterprise Edition. How many dynamic dashboards are needed?
- A) 30 — one for each sales rep
- B) 1 — a single dynamic dashboard renders differently for each logged-in user
- C) 10 — the maximum allowed on Enterprise Edition
- D) 0 — dynamic dashboards are not available on Enterprise Edition

**Answer:** B — Only one dynamic dashboard is needed. When configured to "Run as logged-in user," the same dashboard shows each person their own data. The Enterprise Edition limit of 10 means you can have up to 10 different dynamic dashboards defined, but each one serves all users who can access it.

**Q2:** A sales manager sets himself as the running user on a team dashboard and shares the dashboard folder with all sales reps. When a rep views the dashboard, they see all opportunities in the region, not just their own. Why?
- A) The rep has a system administrator profile
- B) The dashboard is set as a dynamic dashboard
- C) The running user is the manager, so all viewers see the manager's accessible records
- D) The rep's sharing settings have been overridden

**Answer:** C — When a specific user is set as the running user, ALL viewers of that dashboard see the data that the running user has access to. Since the manager can see all regional opportunities, everyone viewing the dashboard sees all regional opportunities — regardless of each viewer's own record-level access.

**Q3:** Which dashboard component type is BEST suited for showing a sales rep's quota attainment percentage against a target with visual color coding (green/yellow/red)?
- A) Chart (bar chart)
- B) Metric
- C) Gauge
- D) Table

**Answer:** C — A Gauge component is specifically designed to show a single value against a defined range with minimum, target, and maximum values. It typically uses color coding (red/yellow/green) to indicate whether the value is below, meeting, or exceeding the target — perfect for quota attainment displays.
