# L03: Lightning Experience

## 🎯 Learning Objectives
- Explain the differences between Lightning Experience and Salesforce Classic
- Navigate Lightning App Builder, App Manager, and the navigation bar
- Customize home pages and compact layouts for different user groups

## 📊 SLIDES

### Slide 1: Lightning Experience vs. Salesforce Classic
**Visual:** Side-by-side screenshots — Classic (grey/blue tab-based navigation) vs. Lightning Experience (modern card-based layout with the App Launcher) — with a "Lightning" badge on the modern side.
**Content:**
- **Salesforce Classic:** Legacy interface; tab-based navigation; limited mobile support
- **Lightning Experience:** Modern, component-based UI; introduced in 2015; default for all new orgs
- Lightning supports: Einstein features, Lightning App Builder, Dynamic Forms, Path, Kanban view
- Classic supports features Lightning does not (some older partner integrations, certain Visualforce pages)
- New Salesforce features are **only built for Lightning Experience**, not Classic
**Speaker Notes:** If you're studying for the admin exam today, Lightning Experience is the interface you need to know. Salesforce has not built new features for Classic since 2019, and the vast majority of customers have migrated. The exam will test your knowledge of Lightning-specific features like App Builder, Dynamic Forms, and Path — none of those exist in Classic.

### Slide 2: Switching Between Lightning and Classic
**Visual:** Flow diagram showing the user profile menu (avatar icon) with arrows to "Switch to Salesforce Classic" and "Switch to Lightning Experience," plus an org-level toggle in Setup.
**Content:**
- Users can switch by clicking their avatar > **Switch to Salesforce Classic / Switch to Lightning Experience**
- Admins can enable/disable Lightning Experience at the org level: **Setup > Lightning Experience**
- Admins can also **require** Lightning Experience by removing the Classic link via profile settings
- The **Lightning Experience Transition Assistant** (Setup) guides migration
**Speaker Notes:** Individual users have the ability to toggle between interfaces unless an admin restricts it. If you want to prevent users from reverting to Classic, you need to remove the Classic option at the profile level. The Lightning Experience Transition Assistant is a guided tool that helps admins understand what features are Classic-only and plan a safe migration.

### Slide 3: App Manager and Lightning Apps
**Visual:** Screenshot of Setup > App Manager showing a list of apps with columns for App Name, Developer Name, Type (Lightning / Classic / Connected), and Visibility.
**Content:**
- Path: **Setup > App Manager**
- App Manager lists all apps in the org — Lightning apps, Classic apps, and Connected apps
- **Lightning App:** Sets the navigation items, utility bar, and accessible tabs for a group of users
- Apps are assigned to users via **Profiles**
- Admins can create new Lightning Apps or edit existing ones from App Manager
**Speaker Notes:** App Manager is the central hub for managing what different groups of users see when they log in. A Lightning App defines the navigation bar items, the utility bar at the bottom, and which objects and tabs are accessible. Different teams — Sales, Service, Marketing — can have different apps with different navigation setups. App assignments are made via profiles, so users automatically get the right app based on their role.

### Slide 4: Lightning App Builder
**Visual:** Screenshot of the Lightning App Builder canvas with component panel on the left, the page layout in the center, and properties panel on the right. A "Record Page" type is shown.
**Content:**
- Path: **Setup > Lightning App Builder** (or from individual object settings)
- Used to build and customize: **App Pages**, **Record Pages**, and **Home Pages**
- Drag-and-drop interface; no code required
- Components include: standard Salesforce components + AppExchange components + custom LWC
- Pages are **activated** and assigned to apps, record types, or user profiles
**Speaker Notes:** Lightning App Builder is the admin's primary tool for customizing page layouts in Lightning Experience. You can create a completely different record page for the Sales team versus the Service team — same object, different layout, driven by app and profile assignment. The activation step is critical: building a page in App Builder doesn't show it to users until you activate it and assign it.

### Slide 5: Navigation Bar Customization
**Visual:** Animated-style diagram showing a navigation bar with items being dragged and reordered, with a "Personalize" button highlighted and the difference between admin-set defaults and user-personalized nav bars.
**Content:**
- The navigation bar is configured in the Lightning App definition (App Manager)
- Admins set the **default** navigation items for the app
- Users can **personalize** their own navigation bar (add, remove, reorder items)
- Admins can **prevent personalization** by locking the navigation bar in the app settings
- Tab visibility (hidden/default on/default off) is still controlled by Profile
**Speaker Notes:** There are two levels of navigation bar control to understand. Admins set what appears in the navigation bar when a user first gets the app — that's the default. Users can then personalize their own view unless the admin locks the navigation bar. Even when unlocked, the tab visibility settings on the user's profile still act as a ceiling — users can't see a tab that their profile has hidden.

### Slide 6: Home Page Customization
**Visual:** Lightning App Builder canvas showing a Home Page layout with components: Today's Tasks, Performance Chart, Assistant, and a custom Rich Text banner — with an "Assign as Org Default" option highlighted.
**Content:**
- Home pages are built in **Lightning App Builder** and assigned by app and/or profile
- Standard home page components: Today's Tasks, Recent Items, Performance Chart, Assistant, News
- Custom components can be added from AppExchange or built with LWC
- Assignment options: **Org Default**, **App Default**, **App + Profile** (most targeted)
- Users cannot customize the Lightning Home Page (unlike the nav bar)
**Speaker Notes:** The home page is the first thing users see when they log in, so it's worth customizing for each major team. An executive might want a Performance Chart and news feed; a sales rep might want the Activity component and pipeline metrics. Use App + Profile assignment for the most granular targeting. Unlike the navigation bar, users cannot rearrange their own home page — only admins control it.

### Slide 7: Compact Layouts
**Visual:** Annotated screenshot of a Contact record in Lightning Experience — the record highlights (top-left card) showing four fields: Name, Phone, Email, Title — with arrows indicating these come from the Compact Layout settings.
**Content:**
- **Compact Layouts** define the fields shown in the record **highlights panel** (top of a record page)
- Also control fields shown in **mobile cards**, **lookup hover cards**, and **Activity timeline entries**
- Path: **Setup > Object Manager > [Object] > Compact Layouts**
- The **Primary** compact layout is the default; you can assign different layouts to record types
- Best practice: 4–6 fields per compact layout — phone, name, status, key date
**Speaker Notes:** Compact layouts get less attention than page layouts, but they matter a lot for usability. The highlights panel at the top of every record page is driven by the compact layout. If your sales team needs to immediately see Account Name, Phone, and Owner when they open an Opportunity, configure those fields in the Opportunity compact layout. You can also create multiple compact layouts and assign them to specific record types.

### Slide 8: Key Lightning Experience Exam Facts
**Visual:** Reference cheat-sheet card with eight bullet points.
**Content:**
- Lightning App Builder builds App Pages, Record Pages, and Home Pages
- Pages must be **activated** in App Builder to be visible to users
- Navigation bar defaults set by admin; users can personalize unless locked
- Compact layouts control the **highlights panel** at the top of record pages
- New Salesforce features are only built for Lightning, not Classic
- Apps are assigned to users via **Profiles**
**Speaker Notes:** Here are your key takeaways for the Lightning Experience lecture. Remember that activation is always required after building a page — this is a common exam scenario where a user says "I built a custom home page but users can't see it." The answer is always that the page hasn't been activated yet. Compact layouts and their relationship to the highlights panel are another reliable exam topic.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 3 — Lightning Experience. This lecture covers the modern Salesforce interface, the tools admins use to customize it, and the exam-critical details you need to know about App Manager, Lightning App Builder, and page customization.

Let's start with the big picture. Salesforce has two interfaces: Lightning Experience and Salesforce Classic. Classic is the legacy interface — tab-based, less visual, with limited mobile support. Lightning Experience is the modern interface, introduced in 2015 and now the default for all new orgs. Here's the key fact: Salesforce stopped building new features for Classic. Everything new — Einstein Analytics, Dynamic Forms, Path, Kanban views, and more — is Lightning only. If you're studying for the admin exam, you're studying Lightning.

Users can switch between interfaces by clicking their avatar in the top right and choosing "Switch to Salesforce Classic" or "Switch to Lightning Experience." Administrators can control this at the org level and can even lock users into Lightning by removing the Classic switch option at the profile level.

Now let's talk about App Manager, which you'll find at Setup > App Manager. This page lists every app in your org — Lightning apps, Classic apps, and connected apps. A Lightning App defines what shows up in the navigation bar, what tabs are accessible, and what the utility bar at the bottom contains. You assign apps to users through profiles, so every user automatically sees the app that's right for their team.

Lightning App Builder — found at Setup > Lightning App Builder — is the drag-and-drop tool for creating and customizing pages. You can build three types of pages: App Pages (the home screen of a Lightning App), Record Pages (what users see when they open an Account, Contact, or any other record), and Home Pages (the first page users see after login). There's no coding required — you drag components onto the canvas and configure their properties.

One critical detail: after you build a page in Lightning App Builder, it does NOT automatically appear to users. You have to click Activate and assign it — to an app, a record type, a profile, or a combination. This activation step is a favorite exam scenario. If a question says "I built a home page but users still see the old one," the answer is almost always that it hasn't been activated.

Navigation bar customization works at two levels. Admins configure the default items that appear in the nav bar when the app is first assigned to users. Users can then add, remove, or reorder items in their own personal nav bar — unless the admin has locked navigation bar personalization. Even if personalization is allowed, tab visibility from the user's profile still acts as a ceiling.

Finally, compact layouts control the highlights panel at the very top of every record page — that row of fields you see just below the record name. You configure compact layouts at Setup > Object Manager > [Object] > Compact Layouts. Best practice is four to six fields showing the most critical information for that object.

In the next lecture, we'll explore AppExchange — Salesforce's marketplace for pre-built apps and components.

## 🔔 EXAM TIPS
- **Activation is required:** Building a page in Lightning App Builder does not make it visible. You must Activate it and assign it before users see it. This trips up many candidates.
- **Apps assign via Profiles:** A Lightning App is surfaced to users through their Profile — not via roles, permission sets, or manual assignment.
- **Compact layouts = highlights panel:** If a question mentions the "highlights panel" or the fields that appear at the top of a record, it's talking about compact layouts.

## ✅ LECTURE SUMMARY
- Lightning Experience is the modern Salesforce interface; all new features are Lightning-only
- App Manager (Setup > App Manager) manages Lightning apps which define navigation items; apps are assigned via Profiles
- Lightning App Builder builds App Pages, Record Pages, and Home Pages using drag-and-drop; pages require Activation before users see them
- Navigation bar defaults are set by admins; users can personalize unless locked by the admin
- Compact layouts (Setup > Object Manager > [Object] > Compact Layouts) control the record highlights panel

## ❓ MINI QUIZ

**Q1:** An administrator builds a new Lightning record page for Accounts using Lightning App Builder and saves it. Users report the page looks unchanged. What is the most likely cause?
- A) The page was built in Salesforce Classic, not Lightning Experience
- B) The page was not activated and assigned in Lightning App Builder
- C) The users' profiles do not have access to Accounts
- D) Compact layouts must be updated separately
**Answer:** B — Pages created in Lightning App Builder must be explicitly activated and assigned (by app, record type, or profile) before they appear to users. Saving a page does not publish it.

**Q2:** A company wants all Sales team members to see a customized Lightning navigation bar with Sales-specific tabs. How should the administrator configure this?
- A) Create a custom profile for sales users and set tab visibility
- B) Create a Lightning App with the desired navigation items and assign it to the Sales profile
- C) Edit each user record and select the preferred navigation tabs
- D) Use Lightning App Builder to add tabs to the default Home page
**Answer:** B — Lightning Apps define navigation bar content and are assigned to users through their profiles. Creating an app for sales and assigning it to the Sales profile gives all sales users the correct navigation experience.

**Q3:** Which of the following controls the fields that appear in the highlights panel at the top of a record page?
- A) Page Layout
- B) Field-Level Security
- C) Compact Layout
- D) Lightning App Builder component properties
**Answer:** C — The highlights panel (record highlights bar) is driven by the object's Compact Layout. Admins configure which fields appear there at Setup > Object Manager > [Object] > Compact Layouts.
