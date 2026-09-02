# Visualforce Basics

## Exam Domain
User Interface — 25% of exam weight

## Core Concepts

### What Is Visualforce?
Server-side UI framework. Pages are markup + Apex controller. Server renders HTML and sends to browser. Still tested on PDI exam; still in many production orgs. LWC is the modern replacement but VF is not deprecated.

### The apex:page Tag — Controller Declaration
```xml
<!-- Standard controller (built-in CRUD for one object) -->
<apex:page standardController="Account">

<!-- Custom controller (full Apex class) -->
<apex:page controller="MyCustomController">

<!-- Standard controller + extension (most common pattern) -->
<apex:page standardController="Account" extensions="MyExtension">

<!-- List mode (StandardSetController) -->
<apex:page standardController="Account" recordSetVar="accounts">
```
Cannot use both `standardController` and `controller` on the same page.

### Core Input and Output Tags
```xml
<apex:form>  <!-- required wrapper for all inputs and command buttons -->

    <!-- SObject field — respects type, required, picklist metadata -->
    <apex:inputField value="{!account.Name}" />

    <!-- Free-form text — no field metadata awareness -->
    <apex:inputText value="{!myStringVar}" />

    <!-- Display formatted field value -->
    <apex:outputField value="{!account.Industry}" />

    <!-- Action button — must be inside apex:form -->
    <apex:commandButton action="{!save}" value="Save" />

    <!-- Action link -->
    <apex:commandLink action="{!cancel}" value="Cancel" />

</apex:form>
```

### The {!expression} Binding Syntax
- `{!property}` — reads a controller property
- `{!methodName}` — invokes a method (used in `action` attributes)
- `{!$Label.LabelName}` — Custom Label
- `{!$User.Id}` — running user global variable
- `{!$CurrentPage.parameters.paramName}` — URL query parameter

### Controller Types — Quick Reference
| Type | Declaration | Has Built-in CRUD? | Use When |
|------|-------------|---------------------|---------|
| Standard Controller | `standardController="Account"` | Yes | Simple CRUD pages |
| Custom Controller | `controller="MyClass"` | No | Complex multi-object pages |
| Extension | `extensions="MyClass"` | Adds to existing | Adding methods to standard controller |

### View State — 170 KB Limit
View state stores controller property values between server round trips (hidden form field). 170 KB max. Mark infrequently needed properties with `transient` keyword in Apex to exclude from view state.

## PTA / SA Relevance

**In partner code reviews, watch for:**
- Visualforce pages without `transient` on heavy properties — large Account/Contact graphs can easily blow 170 KB view state
- Custom controllers that reimplementing standard controller CRUD from scratch — controller extension pattern is almost always better and less code
- VF pages in Lightning Experience without `lightningStylesheets="true"` — visual inconsistency

**Enterprise-scale considerations:**
- Large orgs may have hundreds of Visualforce pages. Prioritize migration to LWC for user-facing pages that need performance improvement. Pages used only by internal admins (data entry tools) may not need migration.
- VF in mobile (Salesforce mobile app) is limited — mobile pages need LWC. Flag any customer using VF for mobile as a migration need.

**For CTO conversations:**
- "Should we migrate our Visualforce pages to LWC?" — Priority-based: high-traffic user-facing pages benefit from LWC's better performance. Admin tools and low-traffic pages can stay as VF. Estimate migration effort before committing.

## Architecture / How It Works

```
VISUALFORCE REQUEST CYCLE

  User loads page / clicks button
         │
         ▼
  Salesforce server
  ┌───────────────────────────────────────────────────────┐
  │  1. Instantiate controller (constructor runs)         │
  │  2. Evaluate {!expression} in VF markup               │
  │  3. Call getter methods for bound properties          │
  │  4. Render HTML                                       │
  │  5. Serialize view state into hidden form field       │
  └───────────────────────────────────────────────────────┘
         │
         ▼  HTML sent to browser

  User submits form (clicks commandButton):
  ┌───────────────────────────────────────────────────────┐
  │  1. Browser POSTs form + view state to server         │
  │  2. Server deserializes view state → controller state │
  │  3. Setter methods called with form field values      │
  │  4. Action method invoked (save(), etc.)              │
  │  5. Re-render or navigate (PageReference)             │
  └───────────────────────────────────────────────────────┘
```

**Limitations:**
- View state max: **170 KB** — use `transient` on large properties
- Server-side rendering = every user interaction is an HTTP round trip (slower than LWC)
- View state only exists for pages with `<apex:form>` — read-only pages have no view state

```
CONTROLLER TYPE COMPARISON

  STANDARD CONTROLLER:            CUSTOM CONTROLLER:
  ┌──────────────────────────┐    ┌──────────────────────────────┐
  │  <apex:page              │    │  <apex:page                  │
  │    standardController    │    │    controller="MyCtrl">      │
  │    ="Account">           │    │                              │
  │                          │    │  Apex class: MyCtrl          │
  │  Built-in: save(),       │    │  Write ALL logic yourself:   │
  │  delete(), edit(),       │    │  - query data (constructor)  │
  │  cancel(), getRecord()   │    │  - save() method             │
  │                          │    │  - navigation                │
  │  EXTENSION adds custom   │    │  - error handling            │
  │  methods on top          │    └──────────────────────────────┘
  └──────────────────────────┘
  
  Extension constructor signature (REQUIRED):
  public MyExtension(ApexPages.StandardController stdCtrl) { }
```

**Limitations:**
- `standardController` and `controller` cannot both appear on the same `apex:page` tag
- Extension constructor MUST accept `ApexPages.StandardController` — any other signature fails
- `stdController.getRecord()` only returns fields referenced on the VF page, not all fields

## Key Facts to Memorize
- View state max: **170 KB** — use `transient` to exclude properties
- `apex:inputField` — smart; respects field type, required, picklist
- `apex:inputText` — dumb; plain text only, no field metadata
- `{!expression}` — all dynamic content uses this syntax
- Standard controller + extension = most common pattern
- Extension constructor takes `ApexPages.StandardController` argument
- `apex:commandButton` MUST be inside `apex:form`
- Cannot use both `standardController` AND `controller` on same page

## Customer Advisory Tips
- **VF migration planning:** Use the Visualforce Usage report in Setup to identify active pages. Prioritize migration by traffic and mobile usage. Phases: immediate LWC for mobile, medium-term for high-traffic, low-priority for admin tools.
- **View state performance:** If pages are slow, view state bloat is often the cause. Audit controller properties for candidates to mark `transient`.

## Exam Traps
- `apex:commandButton` outside `apex:form` = button renders but action doesn't fire
- Both `standardController` AND `controller` on same page = compile error
- `apex:inputField` respects field metadata; `apex:inputText` does NOT — common trick question
- View state limit is **170 KB** (not 100 KB, not 200 KB)
- `{!save}` invokes the standard controller's save(); `{!myMethod}` invokes an extension method — same syntax, different context

## Practice Questions

**Q:** A developer wants to add a "Send Email" button to a standard Account VF page. Which controller architecture?
**A:** Standard controller (`standardController="Account"`) with an extension (`extensions="SendEmailExtension"`). The extension adds the custom method; the standard controller handles all existing CRUD.

**Q:** A VF page is throwing "View state size exceeded" errors. What's the fix?
**A:** Identify large controller properties (List<sObject>, Map<>) and mark them with the `transient` keyword in Apex. They will be recalculated on each request from SOQL rather than serialized into view state.

**Q:** What is the required constructor signature for a controller extension?
**A:** `public MyExtension(ApexPages.StandardController stdController) { }` — must accept exactly one `ApexPages.StandardController` argument.
