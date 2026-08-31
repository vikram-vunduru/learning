# Visualforce Basics

## Learning Objectives
- Construct a Visualforce page using core tags including apex:page, apex:form, apex:inputField, and apex:commandButton
- Explain the three controller types — standard controller, custom controller, and controller extension — and identify when to use each
- Use the {!expression} merge field syntax to bind data and invoke actions in Visualforce
- Recognize why Visualforce still appears on the PDI exam despite LWC being the modern standard

## Slides

### Slide 1: What Is Visualforce?
**Visual:** Browser rendering a classic Salesforce page layout side-by-side with a custom Visualforce page that has identical data but a completely different layout
**Content:**
- Visualforce is Salesforce's legacy UI framework, introduced in Salesforce Classic
- Still used in many orgs and still tested on the PDI exam
- Pages are markup files with Apex-backed controllers
- VF pages run server-side — the server renders HTML and sends it to the browser
- LWC (Lightning Web Components) is the modern replacement, but VF is not deprecated
**Speaker Notes:** Don't skip Visualforce even if your org is Lightning-first. The PDI exam still includes Visualforce questions, and many enterprise orgs maintain large Visualforce codebases. Understanding Visualforce also provides context for understanding how LWC improved on the model — server-side rendering vs. client-side components, view state vs. stateless wire calls, and so on.

### Slide 2: The apex:page Tag and Attributes
**Visual:** VF page markup showing apex:page with four different attribute combinations highlighted: standardController, controller, extensions, and recordSetVar
**Content:**
- Every VF page starts with `<apex:page>` as the root element
- `standardController="Account"` — uses Salesforce's built-in CRUD controller for that object
- `controller="MyCustomController"` — uses a fully custom Apex controller class
- `extensions="MyExtension"` — adds a controller extension class to standard or custom controller
- `recordSetVar="accounts"` — switches to list mode (standardSetController) for multiple records
**Speaker Notes:** The apex:page tag's attributes determine the controller architecture for the page. You can have a standard controller OR a custom controller, but not both on the same page. Extensions can be added to either and allow you to add methods without replacing the standard controller behavior. The recordSetVar attribute turns the standard controller into a standard set controller, enabling pagination and bulk operations on a list of records.

### Slide 3: Core Input and Output Tags
**Visual:** VF markup showing an apex:form containing apex:inputField tags bound to SObject fields, an apex:outputField for display, and an apex:inputText for free-form input
**Content:**
- `<apex:form>`: required wrapper for any input tags and command buttons; enables form submission
- `<apex:inputField value="{!account.Name}">`: renders the appropriate input for an SObject field, respects field metadata (type, required, picklist values)
- `<apex:outputField value="{!account.Industry}">`: renders the formatted display value
- `<apex:inputText value="{!myVariable}">`: plain text input bound to a controller property
- `<apex:inputCheckbox>`, `<apex:inputTextarea>`, `<apex:selectList>` for other input types
**Speaker Notes:** The key distinction between apex:inputField and apex:inputText is that inputField is bound to an SObject field — it automatically renders the correct HTML input type (text, checkbox, date picker, picklist) based on the field's metadata. It also respects required fields and picklist values. inputText is a plain text input bound to any string property in the controller, with no field metadata awareness. Always use inputField for SObject fields.

### Slide 4: Action Tags — apex:commandButton and apex:commandLink
**Visual:** VF form showing apex:commandButton with an action attribute pointing to a controller method, and the controller method signature returning PageReference
**Content:**
- `<apex:commandButton action="{!save}" value="Save">`: renders a button that invokes a controller method on click
- `<apex:commandLink action="{!cancel}" value="Cancel">`: same as commandButton but renders as a hyperlink
- `action` attribute points to a controller method using {!methodName} syntax
- Controller methods for actions return `PageReference` (for navigation) or `null` (stay on page)
- Must be inside `<apex:form>` to function
**Speaker Notes:** Command buttons and command links are form submission elements — they trigger a POST back to the server, which invokes the specified controller method, and then the server re-renders the page. If the controller method returns null or void, the user stays on the same page. If it returns a PageReference, the user is redirected. The value attribute on commandButton is the button label text — not to be confused with a data binding.

### Slide 5: The {!expression} Binding Syntax
**Visual:** Annotated VF markup showing {!account.Name} as a property merge field, {!save} as a method reference, {!$Label.CustomLabel} as a global reference, and {!$CurrentPage.parameters.id} as a URL parameter
**Content:**
- `{!expression}` is the merge field syntax — evaluates and renders the expression value
- `{!property}` — binds to a controller property (getter/setter)
- `{!methodName}` — invokes a controller method (used in action attributes)
- `{!$Label.LabelName}` — references a Custom Label
- `{!$CurrentPage.parameters.paramName}` — accesses URL query string parameters
- `{!$User.Id}` — accesses global variables like the running user
**Speaker Notes:** The {! } syntax is used for all dynamic content in Visualforce — data binding, action wiring, global variable access, and label references. There is no separation between property access and method invocation at the syntax level; both use the same {!name} pattern, but action attributes in tags invoke methods while value attributes bind to properties. Knowing global variable names like $Label, $User, $Profile, and $CurrentPage is useful for both the exam and real development.

### Slide 6: Standard Controller vs. Custom Controller vs. Extension
**Visual:** Three-column table showing Controller Type, Capabilities, Typical Use Case, and How to Declare for each of the three types
**Content:**
- **Standard Controller**: built-in CRUD for one SObject type; `standardController="ObjectName"` on apex:page
- **Custom Controller**: full Apex class; complete control over data and logic; `controller="ClassName"`
- **Controller Extension**: adds methods to an existing standard (or custom) controller; constructor takes `ApexPages.StandardController`
- Extensions are added with `extensions="ExtensionClass"` — can have multiple, comma-separated
- Standard controller provides: `save()`, `delete()`, `edit()`, `cancel()`, `getRecord()`, `getId()`
**Speaker Notes:** The most common architecture is a standard controller plus one or more extensions — you get all the standard CRUD behavior for free and add only the custom logic you need. Pure custom controllers give you maximum control but require you to write all save/delete/navigation logic from scratch. On the exam, if the scenario says "add a custom button to an Account page that performs additional logic on save," the answer is a controller extension, not a full custom controller.

### Slide 7: Displaying Data and Navigation
**Visual:** VF page showing apex:pageBlock with apex:pageBlockSection and apex:outputField tags generating a standard Salesforce-styled record detail layout
**Content:**
- `<apex:pageBlock>`: renders a styled container block (classic Salesforce styling)
- `<apex:pageBlockSection>`: a section within a pageBlock, two-column layout by default
- `<apex:outputField value="{!account.Name}">`: displays formatted field value
- `PageReference`: Apex class for navigation; `new PageReference('/apex/MyPage')` or `new ApexPages.StandardController(acct).view()`
- `ApexPages.addMessage(severity, message)`: adds a feedback message displayed by `<apex:messages>`
**Speaker Notes:** The apex:pageBlock and apex:pageBlockSection tags are what give Visualforce pages their classic Salesforce look — the gray-header block with two-column section layout. For Lightning-styled Visualforce pages, use the lightningStylesheets="true" attribute on apex:page instead. For user feedback, ApexPages.addMessage() populates a message queue that apex:messages or apex:pageMessages renders to the user.

### Slide 8: VF in Lightning Experience
**Visual:** Diagram showing a Visualforce page embedded in a Lightning Record Page via a Visualforce component in App Builder, with a view state warning note
**Content:**
- Visualforce pages can be embedded in Lightning record pages and app pages
- Use `<apex:includeLightning>` to use Lightning components within a VF page
- View state: maximum **170 KB** — stores form state between server round trips; only for form-backed pages
- View state affects performance; use `transient` keyword in Apex to exclude controller properties from view state
- `showHeader="false"` and `standardStylesheets="false"` for custom-styled standalone VF pages
**Speaker Notes:** The 170 KB view state limit is a specific PDI exam value. View state is the encoded form of all non-transient, non-read-only controller properties serialized into the page's hidden form field. Large object graphs in controller properties can bloat view state. Mark properties as transient in Apex if they can be recalculated on each postback and don't need to persist between requests — this reduces view state size and improves page performance.

## Recording Script

Welcome to Lecture 15 on Visualforce Basics. Before we dive in, a word on why we're covering this: the PDI exam still tests Visualforce, and many production Salesforce orgs have significant Visualforce codebases. Even if your day-to-day work is Lightning-first, you need to understand VF fundamentals.

Visualforce is Salesforce's server-side UI framework. You write markup pages — similar to HTML but with special apex: tags — that are backed by Apex controller classes. When a user loads the page, the server evaluates the markup and controller, and sends rendered HTML to the browser. This is fundamentally different from LWC, which runs a JavaScript component in the browser.

Every Visualforce page starts with the apex:page tag. This root tag takes attributes that determine what kind of controller backs the page. standardController="ObjectName" gives you Salesforce's built-in CRUD controller for that object. controller="ClassName" uses a fully custom Apex class. extensions="ExtensionClass" adds custom methods on top of a standard controller.

For input, the key tags are apex:form — the required wrapper for all inputs and buttons — and inside it, apex:inputField for binding to SObject fields and apex:inputText for plain string properties. The apex:inputField tag is smart: it knows the field type and renders the appropriate HTML input. apex:commandButton and apex:commandLink are your action triggers — they POST back to the server and invoke a controller method.

All dynamic content uses the {!expression} syntax. This evaluates properties (data binding), invokes methods (in action attributes), and references globals like {!$Label.MyLabel} or {!$User.Id}.

For the controller architecture: standard controller plus extension is the most common pattern. The extension constructor takes an ApexPages.StandardController argument. A pure custom controller requires you to write all logic — query, save, delete, navigate — from scratch.

The view state is a 170 KB limit you must know for the exam. It's the serialized form of all controller state stored in a hidden form field. Mark infrequently needed properties as transient in Apex to keep view state small.

## Exam Tips
- The `apex:inputField` tag renders different HTML inputs based on the field's data type and respects field metadata (required, picklist values); `apex:inputText` is just a plain text input with no field-awareness
- View state maximum size is **170 KB** — mark controller properties as `transient` to exclude them from view state
- A VF page can have either `standardController` OR `controller` but NOT both on the same `apex:page` tag
- Controller extensions receive an `ApexPages.StandardController` argument in their constructor — this is what the exam uses to identify an extension vs. a custom controller
- `<apex:commandButton>` and `<apex:commandLink>` must be inside an `<apex:form>` tag to function; placing them outside the form breaks the action invocation

## Lecture Summary
Visualforce is Salesforce's server-side UI framework where pages are built with apex: tags backed by Apex controller classes, using {!expression} merge field syntax for all data binding and action wiring. The three controller types — standard controller (built-in CRUD), custom controller (full Apex class), and controller extension (adds methods to a standard controller) — each serve different scenarios, with the standard controller plus extension pattern being most common. Core input tags include apex:inputField for SObject field binding and apex:commandButton for server-side action invocation, both requiring an enclosing apex:form. View state, limited to 170 KB, stores controller property values between server round trips and should be kept small by marking non-essential properties as transient.

## Mini Quiz

**Q1:** A developer is adding a custom "Send Invoice" button to a standard Account page. The button should invoke custom logic but reuse the standard save/delete/navigation behavior. Which controller architecture is most appropriate?
A) A full custom controller with all CRUD logic written manually
B) A standard controller for Account with no controller attribute
C) A standard controller for Account combined with a controller extension
D) Two separate custom controllers on the same apex:page tag

**Answer:** C — Controller extensions add custom methods to a standard controller without replacing it. The page uses `standardController="Account"` to get built-in CRUD, and `extensions="SendInvoiceExtension"` to add the custom button logic. Option D is invalid — you cannot have two controller attributes on one apex:page.

**Q2:** Which tag attribute combination correctly creates a Visualforce page backed by a custom Apex controller class named AccountDashboardController?
A) `<apex:page standardController="AccountDashboardController">`
B) `<apex:page controller="AccountDashboardController">`
C) `<apex:page extensions="AccountDashboardController">`
D) `<apex:page class="AccountDashboardController">`

**Answer:** B — The `controller` attribute specifies a fully custom Apex controller class. `standardController` is for built-in object controllers (like "Account"). `extensions` adds supplemental methods to an existing controller. `class` is not a valid apex:page attribute.

**Q3:** A Visualforce page with a large number of properties in its controller is loading slowly. Investigation shows the view state is near 170 KB. Which approach reduces view state size?
A) Add more `<apex:form>` tags to split the state across multiple forms
B) Mark non-essential controller properties with the `transient` keyword in Apex
C) Use `without sharing` on the controller class to reduce data fetching overhead
D) Replace `apex:inputField` tags with `apex:inputText` tags

**Answer:** B — The `transient` keyword in Apex tells the VF framework to exclude a controller property from the serialized view state. Properties that can be recalculated on each postback do not need to persist in view state. The other options do not affect view state size.
