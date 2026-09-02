# Lightning Experience & App Builder

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Lightning Experience (LEX) is the modern Salesforce UI — the one with the tabs, utility bar, and app launcher. Classic is the old interface still accessible via "Switch to Salesforce Classic" link. For the exam, know what can and can't be done in LEX vs Classic, and how to build/customize apps.

**Lightning Experience vs Salesforce Classic:**
- LEX = modern UI, required for Lightning components, Einstein features, most new features
- Classic = legacy, some features only exist here (certain customizations, Visualforce pages work in both)
- Users can switch between them unless you restrict Classic access per profile

**Salesforce Apps — two types:**
1. **Classic Apps (Tabs + Logo):** Simple collection of tabs. App Menu (grid icon in Classic). Still works in LEX but limited.
2. **Lightning Apps:** Fully configurable. Navigation bar items, utility bar, branding, console footprint. Built in Lightning App Builder.

**App Manager (Setup → App Manager):**
- Lists all Classic and Lightning apps
- Where you create, edit, and manage apps
- "Visible in App Launcher" toggle per app
- App Manager is the single source of truth for all apps in the org

**Lightning App Builder:**
- Drag-and-drop page builder
- Builds: App Pages, Record Pages, Home Pages
- Assign pages: to apps, profiles, or both
- Lightning components (standard + custom) are the building blocks

**Page types in App Builder:**
| Page Type | Purpose |
|---|---|
| App Page | Custom standalone tab (like a home dashboard for an app) |
| Record Page | Custom layout for a specific object's record detail |
| Home Page | Custom homepage per app/profile |

## PTA / SA Relevance

App Builder is a no-code architecture tool. When customers ask "how do we customize what sales reps see on an Opportunity without code?" — the answer is Record Pages in Lightning App Builder with Dynamic Forms and Dynamic Actions (Spring 2021+).

**For enterprise architecture:** The shift from page layouts to Dynamic Forms is significant. Dynamic Forms allow field-level visibility rules directly on the Lightning page without separate page layouts per record type. This simplifies the object configuration matrix considerably — instead of N page layouts × M record types, you can use a single dynamic page with conditional visibility. Worth flagging in any org assessment where you find 20+ page layouts on a single object.

**App design patterns:** A well-designed Lightning App gives a role-specific experience — a Sales app shows pipeline, activities, and accounts; a Service app shows case queues, knowledge, and a service console layout. The Navigation Items in the app are the first UX decision in any Salesforce implementation.

## Architecture / How It Works

```
Lightning Experience Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LIGHTNING APP (configured in App Manager)
  ┌────────────────────────────────────────┐
  │  App Name + Logo + Color               │
  │  Navigation Bar Items (tabs/objects)   │
  │  Utility Bar (quick actions, phone)    │
  │  Assigned User Profiles                │
  └──────────────────┬─────────────────────┘
                     │
                     ▼
  LIGHTNING PAGES (built in App Builder)
  ┌────────────────────────────────────────┐
  │  App Page   │ Record Page │ Home Page  │
  │  (tab)      │ (object)    │ (homepage) │
  │             │             │            │
  │  Components dragged onto regions       │
  │  Standard + Custom Lightning Comps     │
  └──────────────────┬─────────────────────┘
                     │ Activated for:
                     ▼
  ┌─────────────────────────────────────────┐
  │  App assignment   │  Profile assignment  │
  └─────────────────────────────────────────┘
```

**Limitations:**
- Lightning App Builder requires My Domain to be enabled
- Not all Classic features are available in Lightning Experience (some Visualforce pages need Classic)
- Dynamic Forms is only available for custom objects and select standard objects (not all standard objects)
- Utility bar is only available in Lightning apps, not Classic apps
- App Builder cannot replace traditional page layouts entirely — page layouts still control compact layouts, related list ordering, and field editability for Classic access

## Key Facts to Memorize

- App Manager = where you manage ALL apps (Classic + Lightning)
- Lightning App Builder = drag-and-drop for App Pages, Record Pages, Home Pages
- App Page = standalone tab in an app (not a record detail)
- Record Page = object record detail customization
- Lightning apps can have: navigation items, utility bar, custom branding
- Classic apps = just tabs + logo (simpler, legacy)
- Pages must be **Activated** to be visible — building a page doesn't automatically publish it
- Activation can be scoped by: App, App + Profile combination, or org default
- My Domain = required before App Builder can serve Lightning components

## Exam Traps

- **"Lightning App Builder creates apps"** — HALF TRUE. It builds *pages* inside apps. Apps themselves are created in App Manager.
- **"All Salesforce features work in Lightning Experience"** — FALSE. Some classic-only features exist. Check Lightning Experience readiness assessments for legacy orgs.
- **"A page is visible to users as soon as you save it in App Builder"** — FALSE. You must **Activate** the page.
- **"Classic apps support utility bars"** — FALSE. Utility bar is a Lightning app feature only.
- **"App Builder requires custom code to add components"** — FALSE. Standard Lightning components are available out-of-the-box in the component palette.

## Practice Questions

**Q:** An admin wants to create a customized record detail page for the Opportunity object that shows different components for different sales teams. What tool should they use?
**A:** Lightning App Builder — create a Record Page for Opportunity and activate it per App + Profile combination.

**Q:** Where does an admin go to see ALL apps (both Classic and Lightning) in a Salesforce org?
**A:** Setup → App Manager.

**Q:** An admin builds a new Lightning App Page but users report they can't see it in the App Launcher. What step did the admin likely miss?
**A:** Activating the page. A page must be activated to become visible to users.

**Q:** A company wants a navigation bar with a utility bar and custom branding for their sales team. Which type of app should they create?
**A:** Lightning App (not Classic App). Classic Apps don't support utility bars or the Lightning navigation bar.
