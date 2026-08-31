# Visualforce Controllers

## Learning Objectives
- Write a full custom controller class with getter/setter properties and action methods
- Build a controller extension that augments a standard controller without replacing it
- Use StandardController and StandardSetController methods for single-record and list operations
- Implement PageReference for navigation and ApexPages.addMessage() for user feedback

## Slides

### Slide 1: Custom Controllers — Full Control
**Visual:** Side-by-side: a VF page with controller="MyCustomController" and the Apex class with an Account property, a constructor querying the record, and a save() method
**Content:**
- A custom controller is a plain Apex class with the `controller="ClassName"` attribute on apex:page
- No built-in behavior — developer writes all logic: data retrieval, save, delete, navigation
- Constructor is called when the page loads; query your data here
- Properties exposed to VF must have `public` getters (and setters for writable fields)
- Action methods return `PageReference` for navigation or `null` to stay on the same page
**Speaker Notes:** Custom controllers are the right choice when a page has complex data requirements that can't be satisfied by the standard controller — multiple object types, aggregated data, calculated fields, or wizard-style multi-step flows. The constructor receives no arguments; access URL parameters via ApexPages.currentPage().getParameters().get('paramName'). Every property the VF page references via {!property} must have a public getter in the controller.

### Slide 2: Getter and Setter Properties
**Visual:** Apex code showing both the verbose style (explicit getMyProp() and setMyProp() methods) and the shorthand Apex property syntax (public String myProp { get; set; })
**Content:**
- VF pages access controller data through getter methods: `public Account getAccount() { return account; }`
- Setters receive input values from form fields: `public void setAccount(Account a) { account = a; }`
- Shorthand property syntax: `public Account account { get; set; }`
- Read-only (no setter): `public String title { get; private set; }`
- Calculated properties: getter with logic, no setter needed
**Speaker Notes:** The shorthand `{ get; set; }` property syntax generates automatic getter and setter methods that Apex compiles into standard property access patterns. When a form field is bound to {!account.Name}, VF calls getAccount() to retrieve the Account object, then reads the Name field. On form submission, VF calls getAccount() to get the object reference, then sets the Name field on it. You don't need separate getters and setters for each field — one getter/setter for the SObject covers all its fields.

### Slide 3: Controller Extensions
**Visual:** VF apex:page tag with both standardController="Account" and extensions="AccountExtension", with the extension Apex class showing its constructor signature
**Content:**
- Extension class has a constructor taking `ApexPages.StandardController` as its argument
- `public AccountExtension(ApexPages.StandardController stdController) { ... }`
- Call `stdController.getRecord()` to get the record bound to the standard controller
- Call `stdController.getId()` to get the record's ID from the URL
- VF page uses `extensions="ClassName"` — can have multiple extensions comma-separated
- Extension methods are accessible in VF markup just like custom controller methods
**Speaker Notes:** The extension constructor signature is a frequent exam question — it must accept an ApexPages.StandardController argument, not the SObject type directly. Inside the constructor, you typically retrieve the record using stdController.getRecord() and cast it to the appropriate SObject type. The page still has full access to all standard controller methods like save(), delete(), and cancel() — the extension only adds new methods, it doesn't replace anything.

### Slide 4: StandardController Methods
**Visual:** Apex code calling stdController.getId(), stdController.getRecord(), stdController.save(), and showing a PageReference result from stdController.view()
**Content:**
- `getId()` — returns the ID of the record from the page URL parameter
- `getRecord()` — returns the sObject for the current record (cast to specific type as needed)
- `save()` — saves the current record; returns a PageReference to the record detail
- `delete()` — deletes the current record; returns a PageReference
- `edit()` — returns PageReference to the edit page
- `cancel()` — returns PageReference to the previous page or record detail
**Speaker Notes:** These methods are available on the ApexPages.StandardController instance in an extension, and they're also automatically available as {!save}, {!delete}, {!edit}, {!cancel} actions in VF markup when using a standard controller. In an extension, you can wrap these methods — add pre/post-processing logic before calling stdController.save() — which is the power of the extension pattern. For example, add custom validation in your extension's save() method, and only call stdController.save() if validation passes.

### Slide 5: PageReference and Navigation
**Visual:** Code showing three PageReference construction patterns: by URL string, by ApexPages.StandardPage, and using Page.pageName static reference
**Content:**
- `new PageReference('/apex/MyPage')` — navigate to a VF page by URL
- `Page.MyPageName` — static reference to a VF page (type-safe, preferred)
- `new ApexPages.StandardController(record).view()` — navigate to a record detail
- `pageRef.getParameters().put('id', recordId)` — add URL parameters
- `pageRef.setRedirect(true)` — perform a browser redirect instead of a server-side navigation
**Speaker Notes:** The PageReference class is how you navigate users from action methods. Returning null keeps the user on the current page and refreshes it with any updated controller state. Returning a PageReference sends the user to a new page. The setRedirect(true) call is important when navigating to pages outside the VF framework — without it, some resources don't render correctly because the server tries to inline them instead of issuing a proper HTTP redirect.

### Slide 6: User Feedback with ApexPages.addMessage()
**Visual:** VF page showing apex:pageMessages tag and the Apex code calling ApexPages.addMessage() with severity CONFIRM, INFO, WARNING, and ERROR levels
**Content:**
- `ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Error text'))` adds a message
- Severity levels: `CONFIRM`, `INFO`, `WARNING`, `ERROR`
- Messages are rendered by `<apex:messages>` or `<apex:pageMessages>` tags in the VF page
- Messages are per-request — they are cleared on each new page load
- `ApexPages.hasMessages()` checks if any messages have been added
**Speaker Notes:** ApexPages.addMessage() is the standard mechanism for surface validation errors and success messages in Visualforce. The typical pattern is: perform validation in the action method, add ERROR messages for each validation failure, and return null if any errors exist (keeping the user on the page to see the errors). If validation passes, perform the DML, add a CONFIRM message for success, and return the PageReference to navigate away. Always add the apex:messages tag to your page or the messages won't appear.

### Slide 7: StandardSetController for List Pages
**Visual:** Apex class implementing a StandardSetController with SOQL backing, and a VF page showing pagination controls (First, Previous, Next, Last) bound to set controller methods
**Content:**
- `ApexPages.StandardSetController` manages a list of records with built-in pagination
- Instantiate with a list or a SOQL query: `new ApexPages.StandardSetController(Database.getQueryLocator(query))`
- `setPageSize(n)` — sets number of records per page
- `getRecords()` — returns the current page of records
- `next()`, `previous()`, `first()`, `last()` — navigation methods
- `hasNext()`, `hasPrevious()` — for conditional rendering of navigation buttons
**Speaker Notes:** StandardSetController is the list-mode companion to StandardController. Use it when building list views, search result pages, or any page that displays multiple records with pagination. The `recordSetVar` attribute on apex:page automatically wires the standard set controller for the specified object. For custom list pages, instantiate StandardSetController manually in your custom controller constructor.

### Slide 8: Testing Visualforce Controllers
**Visual:** Test class showing Test.setCurrentPageReference() setting up the VF context, followed by controller instantiation and assertion on action method behavior
**Content:**
- VF controller tests run in a test execution context
- Set the VF page context with `Test.setCurrentPageReference(new PageReference('/apex/MyPage'))`
- Pass URL parameters: `ApexPages.currentPage().getParameters().put('id', testId)`
- Instantiate the controller class directly: `MyController ctrl = new MyController()`
- For extensions: `ApexPages.StandardController sc = new ApexPages.StandardController(record); MyExtension ext = new MyExtension(sc);`
- Assert on return values, record field values, and ApexPages.getMessages()
**Speaker Notes:** Testing controller extensions requires creating an ApexPages.StandardController instance with a test record and passing it to the extension constructor. This mirrors how Salesforce instantiates it at runtime. After calling action methods, assert that the correct PageReference was returned and that the record was modified as expected. ApexPages.getMessages() lets you assert that the correct error or success messages were added.

## Recording Script

Welcome to Lecture 16 on Visualforce Controllers. In the previous lecture we covered VF page structure. Now we go deeper into the controller layer — where the real Apex logic lives.

There are three controller patterns to master. Custom controllers, controller extensions, and standard controllers. Let's go through each.

A custom controller is a plain Apex class. The page uses controller="MyClass" and your class handles everything: retrieving data in the constructor, exposing properties with getters and setters, and implementing action methods that return PageReference for navigation. The constructor runs when the page loads. Action methods like save() return null to stay on the page or a PageReference to navigate away.

Properties work via getters and setters. The shorthand is public Account account { get; set; } — Apex generates the methods. When VF reads {!account.Name}, it calls getAccount() on your controller. When a form submits, VF calls getAccount() and sets the Name field. One getter/setter for the SObject covers all its fields.

Controller extensions add to a standard controller without replacing it. The critical detail: the extension constructor must accept an ApexPages.StandardController argument. Call stdController.getRecord() to access the SObject. Call stdController.getId() for the ID. The page keeps all standard controller actions — save, delete, edit, cancel — and gains your custom methods.

Standard controller methods you need to know: getId() returns the record ID from the URL, getRecord() returns the SObject, save() saves and returns a PageReference, delete() deletes and navigates away, edit() and cancel() return navigation PageReferences.

For navigation: return a PageReference from your action method. Use Page.MyPageName (the static reference) for other VF pages. Set redirect(true) for browser-side redirects. Return null to reload the current page.

For user feedback: call ApexPages.addMessage() with a severity level and message text. The apex:messages tag on the VF page renders them. Severity levels are CONFIRM, INFO, WARNING, and ERROR.

For list pages: StandardSetController handles pagination. Give it a list or a query locator, call setPageSize(), and use getRecords() for the current page and next()/previous() for navigation.

For testing: set the page context with Test.setCurrentPageReference(), add URL parameters with ApexPages.currentPage().getParameters(), and instantiate your controller or extension directly.

## Exam Tips
- A controller extension constructor MUST take `ApexPages.StandardController` as its argument — any other constructor signature will not be recognized as an extension by Salesforce
- `stdController.getRecord()` returns the sObject bound to the page; it only contains fields referenced on the page in `{!record.FieldName}` expressions — you must query for additional fields
- `PageReference.setRedirect(true)` triggers a browser-side HTTP redirect; without it, VF performs a server-side forward, which can cause issues navigating to non-VF resources
- `ApexPages.addMessage()` messages are only visible if the VF page contains `<apex:messages>` or `<apex:pageMessages>` — forgetting this tag is a common developer mistake
- In test methods, use `new ApexPages.StandardController(sObjectInstance)` to create the standard controller needed to instantiate a controller extension

## Lecture Summary
Visualforce custom controllers are plain Apex classes that provide complete data and logic control for a page, using public getter/setter properties for data binding and action methods that return PageReference for navigation. Controller extensions augment a standard controller by accepting an ApexPages.StandardController in their constructor, gaining access to standard methods like getId() and getRecord() while adding custom behavior. User feedback uses ApexPages.addMessage() with severity levels rendered by the apex:messages tag, and StandardSetController provides built-in pagination for list-mode pages. Testing VF controllers requires setting the page context with Test.setCurrentPageReference() and instantiating controllers and extensions directly in the test class.

## Mini Quiz

**Q1:** A controller extension's constructor receives which argument?
A) The SObject type the standard controller is bound to (e.g., `Account acct`)
B) `ApexPages.StandardController stdController`
C) `String pageId`
D) No arguments — the extension constructor takes no parameters

**Answer:** B — A controller extension constructor must accept exactly one `ApexPages.StandardController` argument. This is how Salesforce passes the standard controller context to the extension. Any other constructor signature prevents Salesforce from recognizing the class as a valid extension.

**Q2:** An action method in a custom controller should keep the user on the current page and display an error message. Which return value and code achieves this?
A) Return a PageReference to the current page and call `setRedirect(false)`
B) Return `null` and call `ApexPages.addMessage()` before returning
C) Throw a custom exception and let VF catch it
D) Return `PageReference.cancel()`

**Answer:** B — Returning `null` from an action method keeps the user on the current page and re-renders it with the current controller state. Calling `ApexPages.addMessage()` before returning adds the error to the message queue, which `<apex:messages>` will display on the re-rendered page.

**Q3:** A developer uses `stdController.getRecord()` in an extension to retrieve the Account record. The VF page only has `{!account.Id}` and `{!account.Name}` on it. The developer then tries to read `account.AnnualRevenue` in the extension — what happens?
A) The field value is returned correctly because getRecord() fetches all fields
B) The field returns null because getRecord() only includes fields referenced in VF expressions
C) A QueryException is thrown because AnnualRevenue is a restricted field
D) A NullPointerException is thrown because the account object is null

**Answer:** B — `stdController.getRecord()` only populates fields that are referenced somewhere in the VF page's markup via `{!record.FieldName}` expressions. Fields not referenced on the page are not included. To access additional fields, either add them to the page markup (even if hidden) or run a separate SOQL query in the extension using the ID from `stdController.getId()`.
