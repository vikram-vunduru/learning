# L17: Lightning Components Overview

## 🎯 Learning Objectives
- Identify the standard Lightning components available in App Builder and know which page types each supports
- Distinguish between standard components, custom LWC, and AppExchange components and understand when to use each
- Explain the difference between Aura and LWC and understand how components are exposed to App Builder

## 📊 SLIDES

### Slide 1: What Is a Lightning Component?
**Visual:** Annotated screenshot of a Lightning Record Page with callout arrows pointing to distinct regions — Highlights Panel, Related Lists tab, Chatter Feed, Activities Timeline — each labeled as a "component"
**Content:**
- A Lightning component is a **reusable UI widget** that does one job (display a list, show a chart, render a form)
- Components are the building blocks; a **Lightning page** is the canvas they are assembled on
- Key distinction: **component = widget**, **page = assembled collection of widgets**
- Components have configurable **properties** (set in the right panel of App Builder)
- Components can be standard (Salesforce-built), custom (developer-built LWC/Aura), or third-party (AppExchange)
**Speaker Notes:** Before diving into specific components, it's critical to lock in the conceptual distinction: a component is a single piece of UI functionality, while a page is the assembled result. Every element you drag onto the App Builder canvas is a component. The exam tests this vocabulary — "which component would you add?" versus "which page type would you create?"

---

### Slide 2: Standard Components — Record Page Specific
**Visual:** Annotated record page layout with callout boxes highlighting Highlights Panel (top), Related Lists (bottom tabs), Activities Timeline (right sidebar), Chatter Feed (feed section)
**Content:**
- **Highlights Panel:** Top band showing key fields + action buttons; configured by Compact Layout; mandatory on record pages
- **Related Lists:** Shows child records (Contacts on Account, Cases on Contact); configured via Page Layout's related list section
- **Activities Timeline:** Unified view of past and upcoming tasks, events, calls, and emails for the record
- **Chatter Feed:** Collaboration feed — posts, mentions, file shares on the record
- **Path:** Visual stage-progression bar for guided selling/service processes (requires Path feature enabled)
- **Flow:** Embeds a Screen Flow directly on the page for guided data entry or process automation
- These components are only available on **Record Pages** (cannot be placed on App or Home Pages)
**Speaker Notes:** Know which components are record-page-only — the exam regularly presents a scenario like "an admin wants to show Related Lists on a Home Page" which is impossible because Related Lists is a record-page component. The Highlights Panel is the most important — it's the action bar at the top of every record and is powered by Compact Layouts and Quick Actions.

---

### Slide 3: Standard Components — App Page & Home Page
**Visual:** Side-by-side mockup: App Page (left) showing Report Chart, List View, Recent Items, Today's Events, Today's Tasks; Home Page (right) showing similar components plus Einstein/Assistant component
**Content:**
- **Report Chart:** Embeds a chart from a saved report; requires report to have a chart; not available on phone form factor
- **List View:** Renders a list view from any object; filterable; interactive
- **Recent Items:** Shows recently accessed records for the current user
- **Today's Events / Today's Tasks:** Calendar and task summary widgets; common on Home Pages for sales reps
- **Rich Text:** Static HTML text/banner; great for announcements, navigation instructions, branding
- **Einstein News / Assistant (Home Page only):** Contextual news and recommendations widget
- App Page components also work on Home Pages in most cases
**Speaker Notes:** Report Chart is a heavily tested component — know that it requires the source report to already have a chart type configured, and that it does not work on the phone (mobile) form factor. List View components are very flexible — you can pin a specific list view to show a curated record list. Rich Text is the go-to for putting a static banner or announcement on a page without any development.

---

### Slide 4: Custom Lightning Web Components (LWC)
**Visual:** Code snippet showing LWC metadata file with `<targets>` and `<targetConfigs>` sections highlighting `lightning__AppPage`, `lightning__RecordPage`, `lightning__HomePage`
**Content:**
- Custom LWC components are built by developers and deployed via Salesforce CLI or change sets
- To appear in App Builder, the component's metadata must declare supported page targets:
  - `lightning__AppPage` — available on App Pages
  - `lightning__RecordPage` — available on Record Pages
  - `lightning__HomePage` — available on Home Pages
- `targetConfigs` define configurable properties that appear in the App Builder properties panel
- Once deployed, custom components appear in the component panel alongside standard components
- Custom LWC is the **preferred modern standard** (replaces Aura for new development)
**Speaker Notes:** The exam won't ask you to write LWC code, but it may ask conceptually why a custom component doesn't appear in App Builder. The answer is always that the metadata doesn't declare the correct `targets`. An admin cannot add a custom component that a developer hasn't exposed — this is a common real-world gap. Know that deployment is required before the component is available.

---

### Slide 5: Aura Components vs Lightning Web Components
**Visual:** Comparison table — Columns: Aura (legacy) vs LWC (modern); Rows: Release era, Performance, Syntax (JavaScript framework vs web standards), Support status, Recommended for new work
**Content:**
- **Aura Components (legacy):**
  - Salesforce's original Lightning component framework (introduced 2014)
  - Proprietary event model and lifecycle hooks
  - Still fully supported; existing Aura components continue to work
  - Not recommended for new development
- **Lightning Web Components (LWC):**
  - Introduced 2019; based on modern web standards (Web Components spec)
  - Better performance, simpler syntax, easier testing
  - Standard going forward for all new Salesforce component development
  - Aura components and LWC components can coexist on the same page
- Both appear identically in App Builder — distinction is in the development model
**Speaker Notes:** From an admin perspective in App Builder, there is no visible difference between an Aura component and an LWC component — they both appear as draggable widgets. The distinction matters for developers. The exam may ask which is the "modern standard" — always answer LWC. Knowing that Aura and LWC can coexist on the same page is also useful for organizations in the middle of migrating.

---

### Slide 6: AppExchange Components
**Visual:** AppExchange website mockup with "Lightning Components" filter selected, showing example component listings (DocuSign, Conga, Map component, etc.) with Install buttons
**Content:**
- AppExchange is Salesforce's marketplace for managed packages, including Lightning components
- Components installed from AppExchange behave identically to custom LWC/Aura once installed
- Types of AppExchange component solutions:
  - **Free components:** Map, Files component variants, utility widgets
  - **Paid/ISV components:** DocuSign, Conga, Copado, CPQ add-ons
- Use AppExchange as the **second tier** in the build hierarchy: standard first, AppExchange second, custom LWC last
- Components are installed at the org level and available to all admins in App Builder immediately after install
**Speaker Notes:** AppExchange is a frequently correct answer when exam scenarios say something like "the admin needs a mapping component but cannot write code and no standard component exists." The answer is AppExchange — not custom LWC, which requires a developer. Remember the decision hierarchy: always try standard, then search AppExchange, then engage a developer for custom LWC.

---

### Slide 7: Visualforce Pages in Lightning
**Visual:** Diagram showing a Lightning Record Page with a Visualforce Page component in one region; inside that component, a VF page renders in an iframe; arrow labeled "VF component wraps VF page in iframe"
**Content:**
- Legacy **Visualforce pages** can be embedded on Lightning pages using the **Visualforce Page component**
- The Visualforce Page component acts as an iframe wrapper — VF page renders inside it
- Limitations:
  - No real-time communication between the VF page and the Lightning page context
  - Performance is slower than native Lightning components
  - Cannot use Lightning Design System styling natively inside VF unless coded explicitly
- Use case: existing Visualforce pages that haven't been migrated yet; preserve functionality during Lightning migration
- Long-term goal should always be migration to LWC
**Speaker Notes:** Visualforce embedding is a migration bridge, not a best practice. The exam tests this concept in the context of "an org has existing Visualforce pages — how can they surface them in Lightning?" The answer is the Visualforce Page component in App Builder. Know that it uses an iframe, which has implications for context (the VF page runs in a different execution context than the Lightning page around it).

---

### Slide 8: Component Properties & When to Use What
**Visual:** App Builder right-panel properties pane for a Report Chart component, showing dropdowns for selecting the Report and setting Chart Height; alongside a decision flowchart: Need UI widget? → Standard available? → Yes (use it) → No → AppExchange? → Yes → No → Custom LWC
**Content:**
- Every component has a **properties panel** in App Builder's right sidebar
- Properties are component-specific — Report Chart lets you pick the source report; Rich Text has a text editor; Flow lets you select which flow to embed
- Some properties are required for the component to function (e.g., selecting a report for Report Chart)
- **Decision hierarchy for component selection:**
  1. Use a standard Salesforce component if available
  2. Search AppExchange for a pre-built component
  3. Request custom LWC development from a developer
- This hierarchy minimizes cost, maintenance, and upgrade risk
**Speaker Notes:** The properties panel is what makes App Builder declarative — no code needed to configure most components. Exam questions sometimes present a scenario where a standard component almost meets the need — always choose the standard component if it fits, even if it requires a workaround like a different layout. Custom LWC should always be the last resort. The decision hierarchy question appears in multiple exam scenarios.

## 🎙️ RECORDING SCRIPT

Welcome back. In Lecture 17 we're diving into the actual building blocks of Lightning pages — Lightning components. By the end of this lecture you'll know what's available out of the box, what comes from developers, what comes from AppExchange, and exactly when to reach for each.

Let's start with the concept. A Lightning component is a **reusable UI widget**. It does one focused thing — display a chart, show related records, render a feed, guide a user through a process. A Lightning page is the canvas you drag these widgets onto. That distinction — component versus page — is tested vocabulary, so keep it clear.

Now let's walk through what Salesforce gives you out of the box — the **standard components**.

For **Record Pages**, the heavy hitters are: the **Highlights Panel** at the top of the record (that action bar showing key fields and buttons), **Related Lists** showing child records, the **Activities Timeline** for calls and emails, the **Chatter Feed**, the **Path** component for stage-guided processes, and **Flow** for embedding a screen flow directly in the record. These components are record-page-only — you cannot drop a Related Lists component onto a Home Page, for example.

For **App Pages and Home Pages**, your go-to components are: **Report Chart** (embeds a chart from a saved report — and the report must already have a chart configured), **List View** (surfaces any object's list view), **Recent Items**, **Today's Events**, **Today's Tasks**, and **Rich Text** for static announcements and banners.

Important exam note on **Report Chart**: it is not supported on the phone (mobile) form factor. If a scenario mentions mobile and reporting, this is a constraint to know.

Now, what if the standard components don't meet your needs? You have two options before writing any code.

First, check **AppExchange**. The AppExchange marketplace has Lightning components — free and paid — built by Salesforce ISV partners. Once installed, they appear in App Builder just like standard components. Map components, document signature widgets, advanced CPQ visualizations — many common needs are already solved. The exam tests this tier: if a scenario says the admin needs a feature, there's no standard component for it, and the admin cannot write code — the answer is AppExchange.

If AppExchange doesn't have it either, then you engage a developer to build a **custom Lightning Web Component**. LWC is the modern standard for Salesforce component development, built on web standards rather than Salesforce's older proprietary Aura framework. The developer deploys the component and configures its metadata to declare which page types it supports — App Page, Record Page, Home Page. Once deployed, it shows up in the App Builder component panel right alongside the standard components.

Speaking of **Aura** — Aura is the older Lightning component framework. It still works, existing Aura components still run, but all new development should be LWC. On an App Builder page, you can't visually tell the difference between an Aura component and an LWC component — they both appear as draggable widgets. The distinction is under the hood.

One more edge case: **Visualforce pages**. If your org has existing Visualforce pages, you can surface them on a Lightning page using the Visualforce Page component, which wraps the VF page in an iframe. It works, but it's a migration bridge — the goal is always to eventually replace VF with native LWC.

Finally, every component you drop on a page has a **properties panel** on the right side of App Builder. This is where you configure it — pick which report to display, choose which flow to embed, set the height of a chart. Some properties are required; the component won't work until they're set. The properties panel is the "no-code configuration" layer that makes App Builder powerful.

## 🔔 EXAM TIPS
- **Component vs Page:** Component = single reusable widget. Page = assembled canvas. Know and use this distinction consistently.
- **Record-Page-Only Components:** Related Lists, Highlights Panel, Activities Timeline, Chatter Feed, Path — these cannot be placed on App Pages or Home Pages. Exam scenarios test this boundary.
- **Report Chart Limitation:** Report Chart requires the source report to have a chart configured, and it is NOT available on the phone (mobile) form factor.
- **Decision Hierarchy:** Standard → AppExchange → Custom LWC. The exam presents "admin can't code, no standard component exists" — the answer is AppExchange, not custom LWC.
- **LWC vs Aura:** LWC is the modern standard. Aura is legacy but still supported. Both coexist on the same page. New development = LWC.
- **Why a Custom Component Doesn't Appear:** If a custom LWC isn't showing in App Builder, the component's metadata doesn't declare the correct target page type(s). This is both an exam question and a real-world troubleshooting scenario.
- **Visualforce in Lightning:** Embedded via the Visualforce Page component, which uses an iframe. Supported but not recommended long-term.
- **Flow Component:** Embeds a Screen Flow on any page type. This is how admins surface guided processes without navigation to a separate page — a common exam answer for automating inline data entry.

## ✅ LECTURE SUMMARY
- A Lightning component is a reusable UI widget; a Lightning page is the canvas they compose
- Record-page-specific components: Highlights Panel, Related Lists, Activities Timeline, Chatter Feed, Path, Flow
- App/Home page components: Report Chart (no mobile), List View, Recent Items, Today's Events/Tasks, Rich Text
- Custom LWC must declare supported page targets in metadata to appear in App Builder
- LWC is the modern standard; Aura is legacy but still supported; both coexist on the same page
- AppExchange provides third-party components that install and behave like standard components
- Decision hierarchy: Standard first, AppExchange second, custom LWC last
- Visualforce pages can be embedded via the Visualforce Page component (iframe-based bridge)
- Each component has a configurable properties panel in App Builder's right sidebar

## ❓ MINI QUIZ

**Q1:** An admin needs to add a mapping widget to a Lightning Account Record Page. No standard Salesforce component provides this capability and the admin cannot write code. What should the admin do?
- A) Embed a Visualforce page  B) Build a custom LWC  C) Search AppExchange for a mapping component  D) Use the Report Chart component
**Answer:** C — When a standard component doesn't exist and the admin cannot write code, AppExchange is the correct next step. It offers pre-built components (including mapping solutions) that install like any managed package and appear in App Builder immediately.

**Q2:** Which of the following components is ONLY available on Record Pages and cannot be placed on an App Page or Home Page?
- A) Report Chart  B) Rich Text  C) Related Lists  D) List View
**Answer:** C — Related Lists displays child records associated with a specific parent record, so it only makes sense and is only available on Record Pages. Report Chart, Rich Text, and List View are available on App Pages and Home Pages as well.

**Q3:** A developer has built a custom LWC component and deployed it to the org, but the admin cannot see it in the Lightning App Builder component panel for a Record Page. What is the most likely reason?
- A) The admin does not have the correct profile permission  B) The component's metadata does not declare `lightning__RecordPage` as a target  C) The component must be activated before it appears  D) Custom LWC components require a sandbox refresh to appear
**Answer:** B — For a custom LWC to appear in App Builder for a specific page type, the component's `.js-meta.xml` metadata file must list the corresponding target (e.g., `lightning__RecordPage`). Without this declaration, the component is invisible in the App Builder component panel for that page type.
