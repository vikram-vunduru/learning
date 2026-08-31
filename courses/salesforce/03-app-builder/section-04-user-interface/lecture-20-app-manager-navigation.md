# L20: App Manager & Navigation

## 🎯 Learning Objectives
- Use App Manager to create and configure Lightning apps with branding, navigation items, utility bar, and profile assignments
- Distinguish between Lightning App, Classic App, and Connected App types and their use cases
- Understand navigation styles (Standard vs. Console), tab types, and how app visibility is controlled by profiles

## 📊 SLIDES

### Slide 1: App Manager Overview
**Visual:** Setup > App Manager page screenshot showing a list of apps with columns for App Name, Developer Name, App Type, and Visible in App Launcher
**Content:**
- **App Manager:** Setup → App Manager — the single place to create and manage all app types in Salesforce
- Introduced in Lightning Experience as the unified app management interface
- Lists every app in the org: Lightning apps, Classic apps, and Connected apps
- From App Manager you can: Create, Edit, Delete, and assign profiles to apps
- **App Launcher:** the grid icon in the upper-left of Lightning Experience — users navigate between apps here
- Visibility in App Launcher is controlled by profile assignments on each app
**Speaker Notes:** App Manager replaced the older "Force.com App Menu" configuration in Classic. Knowing that it's the central hub for all app types — including Connected Apps for OAuth integrations — is important for the exam. The App Launcher itself is Lightning-only; Classic users see a dropdown app menu at the top of the page instead.

---

### Slide 2: App Types in Salesforce
**Visual:** Three-column comparison table: Lightning App | Classic App | Connected App with rows for: Where It Runs, Key Use Case, Supports Utility Bar, Supports Branding, OAuth
**Content:**
- **Lightning App:**
  - Runs in Lightning Experience
  - Supports utility bar, custom branding, console navigation
  - Created and managed in App Manager
- **Classic App:**
  - Runs in Salesforce Classic (also visible in Lightning as legacy)
  - No utility bar, no Lightning-specific features
  - Simpler tab-based navigation
- **Connected App:**
  - Enables external applications to connect to Salesforce via OAuth 2.0 / SAML
  - Used for mobile apps, third-party integrations, API access
  - Configured in Setup > App Manager or Setup > Connected Apps
**Speaker Notes:** The exam focuses heavily on Lightning Apps. Connected Apps are covered more in the Integration track but may appear in a context question. Classic Apps are rarely created today but still appear in legacy orgs; understanding the distinction prevents confusion when you see both types listed in App Manager.

---

### Slide 3: Creating a Lightning App — Step by Step
**Visual:** Lightning App Wizard showing the five steps: App Details & Branding → App Options → Utility Items → Navigation Items → User Profiles
**Content:**
1. **App Details & Branding:** Name, Description, Logo image (upload), Header color (hex value)
2. **App Options:** Navigation style — Standard Navigation or Console Navigation
3. **Utility Items (optional):** Add persistent bottom-bar tools (covered in next slide)
4. **Navigation Items:** Add objects, tabs, pages — what appears in the navigation bar
5. **User Profiles:** Assign which profiles can access this app
- All steps are reversible — edit the app anytime via App Manager → Edit
**Speaker Notes:** Walking through this wizard is something you'll do on the exam as a scenario question. Know that branding is optional but logo and color can be configured. The navigation style choice in Step 2 determines whether you get a tab-based experience or a console with workspace tabs — this choice cannot be changed later without recreating the app, so it's a critical decision.

---

### Slide 4: Navigation Items & Navigation Bar
**Visual:** A Lightning navigation bar showing icons and labels for Sales, Accounts, Contacts, Opportunities, a custom object, and a web tab
**Content:**
- Navigation items appear as tabs in the Lightning navigation bar (top or left, depending on form factor)
- Types of items you can add:
  - Standard Objects (Accounts, Contacts, Leads, etc.)
  - Custom Object tabs
  - Lightning Pages (home pages, app pages)
  - Visualforce Page tabs
  - Lightning Component tabs
  - Web Tabs (external URL)
  - Canvas Apps
- Order of items in the navigation bar is set by the admin in the app definition
- Users in Lightning Experience can **personalize** their navigation bar (add/reorder/remove items) unless personalization is disabled by the admin
**Speaker Notes:** Navigation item types are a frequent exam topic. Know the difference between a Lightning Component tab (a custom Aura/LWC component surfaced as a tab) and a Visualforce Page tab (a Classic-compatible page surfaced as a tab). Web tabs simply display an external URL in an iframe or new window. Users can personalize their nav bar unless the admin has locked it.

---

### Slide 5: Utility Bar
**Visual:** Bottom of a Lightning app showing the utility bar with icons for History, Open CTI, Recent Items, Notes, and Macros
**Content:**
- **Utility Bar:** a persistent footer bar at the bottom of every page in a Lightning app
- Available only in Lightning Apps (not Classic Apps)
- Standard utility bar items include:
  - **History** — recent page navigation
  - **Recent Items** — recently viewed records
  - **Open CTI (Softphone)** — telephony integration panel
  - **Notes** — quick note-taking panel
  - **Macros** — run macro instructions on records
  - **Flow** — launch a Flow from the utility bar
  - **Report Chart** — embed a report chart
- Utility bar is configured per app — different apps can have different utility items
- Items open as floating panels above the utility bar without navigating away
**Speaker Notes:** The utility bar is a Lightning-only feature and a differentiator between Lightning apps and Classic apps. On the exam, you may be asked what type of app supports a utility bar — the answer is Lightning Apps only. Open CTI in the utility bar is how call center telephony integrations surface the softphone panel to agents without a pop-up window.

---

### Slide 6: Standard Navigation vs. Console Navigation
**Visual:** Side-by-side screenshot: left shows Standard Navigation with full-page tab switching; right shows Console Navigation with workspace tabs across the top and a record detail open, with subtabs for related records
**Content:**
- **Standard Navigation:**
  - Traditional tab-based experience
  - Each object opens in its own full page
  - Navigating away closes the previous context
  - Default for most Lightning apps
- **Console Navigation:**
  - Designed for high-volume agents (Service Cloud, Sales Console)
  - **Workspace Tabs:** each record or context opens as a pinned tab across the top
  - **Subtabs:** related records (e.g., Case → Contact, Account) open as subtabs within a workspace tab
  - Multiple records visible and accessible simultaneously without losing context
  - Used in Service Console and Sales Console apps
**Speaker Notes:** Console Navigation is a key feature tested in the context of Service Cloud and Sales productivity. The critical selling point is that agents can work on multiple cases simultaneously — each case is a workspace tab, and they can flip between them without losing their place. Subtabs keep the related records (contact, account, entitlements) a single click away without full-page navigation.

---

### Slide 7: Tabs — All Tab Types
**Visual:** Setup > Tabs page showing sections: Custom Object Tabs, Web Tabs, Visualforce Tabs, Lightning Component Tabs — each with an example row
**Content:**
- Tabs are managed in **Setup → Tabs** (separate from App Manager, but tabs are added to apps)
- **Custom Object Tabs:** created automatically when you create a custom object and select "Tab" as the deployment setting
- **Web Tabs:** display any URL — opens in Salesforce frame or new browser window
- **Visualforce Tabs:** surface a Visualforce Page as a navigation tab
- **Lightning Component Tabs:** surface an Aura or LWC component as a standalone tab
- Tab style (icon) can be chosen from a palette when creating a custom object tab
- Tabs must exist before they can be added to an app's navigation bar
**Speaker Notes:** Tabs are the building blocks of app navigation. An object can have a tab created for it at any time — even after the object is deployed without a tab. Removing a tab from an app doesn't delete it; the tab still exists and can be added back or to another app. This distinction matters: deleting the tab from Setup removes it everywhere, while removing it from an app's navigation only affects that app.

---

### Slide 8: App Visibility & Profile Assignments
**Visual:** App Manager list with a "Visible in App Launcher" column — some apps marked Yes, others No — and a profile assignment modal showing a checklist of profiles
**Content:**
- **App Visibility** is controlled exclusively by **Profile assignments** on the app
- When you assign a profile to an app, all users with that profile see the app in the App Launcher
- If no profiles are assigned, the app is not visible to any users (except System Administrators by default)
- Profiles can be assigned to multiple apps — users may have access to several apps and switch via the App Launcher
- **Default App per Profile:** in the profile settings, you can designate which app loads by default when a user with that profile logs in
- **Visible in App Launcher column:** in App Manager, this column indicates whether the app is currently accessible to at least one profile
**Speaker Notes:** Profile assignment is the sole mechanism controlling app access — there's no permission set for app visibility in standard Salesforce. This is a clean exam answer: if a user can't see an app in the App Launcher, the fix is to assign their profile to the app, not to change any other settings. The default app setting in the profile ensures users land in the right context immediately after login.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 20. We're covering App Manager and Navigation — the tools that let you build the actual experience your users live in every day.

Let's start at the top: App Manager. It's under Setup and it's the central control panel for every app in your org. From here you can create new apps, edit existing ones, delete them, and manage which profiles can see them. You'll see three app types listed: Lightning Apps, Classic Apps, and Connected Apps. For the exam and for modern Salesforce work, Lightning Apps are what you'll work with most.

When you create a Lightning App, Salesforce walks you through a five-step wizard. Step one is branding — give your app a name, upload a logo, and pick a header color. This is what users see in the App Launcher and at the top of the page. Step two is critical: you choose between Standard Navigation and Console Navigation. Standard is the classic tab-based experience. Console is for high-volume users like service agents who need to work on multiple records simultaneously without losing their place. Workspace tabs across the top, subtabs for related records — it's a fundamentally different paradigm. Choose wisely because you can't change this later without recreating the app.

Step three is the utility bar — the persistent footer at the bottom of every page in the app. This is a Lightning-only feature. You can add items like History, Recent Items, the Open CTI softphone for call centers, Notes, Macros, and Flow shortcuts. Each item opens as a floating panel so agents never have to navigate away from their current record.

Step four is navigation items — what appears in the navigation bar across the top or left of the app. You can add standard object tabs, custom object tabs, Lightning pages, Visualforce tabs, Lightning Component tabs, and web tabs pointing to external URLs. The order you set here is what users see first, though in Lightning Experience, users can personalize their own navigation bar unless you've locked it.

Step five is profile assignment. This is the gatekeeper for who can see the app. Assign profiles, and every user with those profiles sees the app in the App Launcher. No profile assignment means the app is invisible to regular users.

Speaking of tabs — they're configured in Setup under Tabs, separate from App Manager. Custom object tabs, Visualforce tabs, Lightning Component tabs, and web tabs are all created there. They have to exist before you can add them to an app. Removing a tab from an app doesn't delete it — it just removes it from that app's navigation.

For the exam, the high-frequency topics are: what each app type is used for, the five steps of the Lightning App wizard, what the utility bar supports and that it's Lightning-only, the difference between Standard and Console navigation, all the tab types, and how profile assignment controls app visibility. Those cover the bulk of what you'll see in this domain on the CRT-403.

## 🔔 EXAM TIPS
- **App Types:** Three types in App Manager — Lightning App (Lightning Experience), Classic App (Classic), Connected App (OAuth/API integration). Know which is which.
- **Utility Bar:** Available only in Lightning Apps, not Classic Apps. Common utility items: History, Open CTI, Recent Items, Notes, Macros, Flow.
- **Console Navigation vs Standard Navigation:** Console = workspace tabs + subtabs for simultaneous multi-record access. Standard = one full-page record at a time. Cannot be changed after app creation without recreating the app.
- **App Visibility = Profile Assignment:** The only way to control which users see an app in the App Launcher is by assigning profiles to the app in App Manager.
- **Tab Types:** Know all four — Custom Object Tab, Web Tab, Visualforce Tab, Lightning Component Tab. Tabs must exist before they can be added to an app's navigation.
- **Navigation Personalization:** Users in Lightning Experience can add/reorder their navigation bar items unless the admin has disabled personalization.
- **Default App per Profile:** Set in the profile record itself — determines which app loads immediately after login for users with that profile.
- **Connected Apps:** Used for OAuth-based integrations with external systems — not for user-facing navigation. Don't confuse with Lightning/Classic apps.

## ✅ LECTURE SUMMARY
- App Manager (Setup > App Manager) is the central hub for creating and managing Lightning Apps, Classic Apps, and Connected Apps
- Lightning App creation involves five steps: branding, navigation style, utility items, navigation items, and profile assignment
- Standard Navigation is tab-based (one page at a time); Console Navigation uses workspace tabs and subtabs for simultaneous multi-record access
- The utility bar is a Lightning-only persistent footer — supports Open CTI, History, Notes, Macros, Flow, and other items configured per app
- Navigation items can be standard/custom object tabs, Lightning pages, Visualforce tabs, Lightning Component tabs, or web tabs
- App visibility is controlled entirely by profile assignments — users only see apps whose profile assignments include their profile
- Tab types (Custom Object, Web, Visualforce, Lightning Component) are created in Setup > Tabs and must exist before being added to an app

## ❓ MINI QUIZ

**Q1:** A service manager needs agents to be able to work on multiple open cases at the same time without losing context when switching between them. Which app configuration should the admin choose?
- A) Standard Navigation with a utility bar
- B) Console Navigation with workspace tabs
- C) Standard Navigation with Split View enabled
- D) A Classic App with the Cases tab pinned

**Answer:** B — Console Navigation provides workspace tabs so agents can keep multiple records open simultaneously, with subtabs giving instant access to related records. Standard Navigation navigates away from the current record when you open a new one.

---

**Q2:** A user reports that a newly created Lightning app does not appear in their App Launcher. The app was created and saved successfully. What is the most likely cause?
- A) The app has no utility bar items configured
- B) The app uses Console Navigation, which is not visible in the App Launcher
- C) The user's profile has not been assigned to the app
- D) The app requires a custom domain to be enabled

**Answer:** C — App visibility in the App Launcher is controlled solely by profile assignments. If the user's profile is not listed in the app's profile assignments, the app will not appear in their App Launcher.

---

**Q3:** An admin wants to embed a third-party telephony panel that agents can open without navigating away from their current case. Which app feature should be configured?
- A) A Web Tab pointing to the telephony provider's URL
- B) A Lightning Component Tab for the telephony component
- C) An Open CTI utility bar item
- D) A Canvas App in the navigation bar

**Answer:** C — The utility bar's Open CTI item (softphone) is specifically designed for telephony integrations. It opens as a floating panel at the bottom of the page without navigating away from the current record, which is exactly what agents need. Web Tabs and Canvas Apps would require navigation away from the current record.
