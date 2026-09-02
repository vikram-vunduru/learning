# Visualforce Controllers

## Exam Domain
User Interface — 25% of exam weight

## Core Concepts

### Custom Controller — Full Apex Control
```apex
public with sharing class AccountDashboardController {
    public Account account { get; set; }  // shorthand getter/setter

    public AccountDashboardController() {
        // Constructor runs when page loads
        Id recordId = ApexPages.currentPage().getParameters().get('id');
        account = [SELECT Id, Name, Phone, AnnualRevenue FROM Account WHERE Id = :recordId];
    }

    public PageReference save() {
        try {
            update account;
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.CONFIRM, 'Account saved successfully.'));
            return null;  // stay on page and show confirmation
        } catch (DmlException e) {
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.ERROR, e.getDmlMessage(0)));
            return null;
        }
    }

    public PageReference cancel() {
        return new PageReference('/' + account.Id);
    }
}
```

### Getter and Setter Patterns
```apex
// Shorthand (preferred)
public String title { get; set; }
public Account account { get; set; }
public List<Contact> contacts { get; private set; }  // read-only externally

// Verbose (same result)
private String title;
public String getTitle() { return title; }
public void setTitle(String t) { title = t; }

// Calculated property (no setter needed)
public Integer contactCount {
    get { return contacts == null ? 0 : contacts.size(); }
}
```
VF reads `{!title}` by calling `getTitle()`. VF writes from form input by calling `setTitle()`.

### Controller Extension — Adds to Standard Controller
```apex
public with sharing class AccountExtension {

    private ApexPages.StandardController stdCtrl;
    private Account account;

    // Required constructor signature — must accept StandardController
    public AccountExtension(ApexPages.StandardController stdCtrl) {
        this.stdCtrl = stdCtrl;
        this.account = (Account) stdCtrl.getRecord();
    }

    public PageReference sendInvoice() {
        // custom logic
        // can still call stdCtrl.save() when done
        return stdCtrl.save();
    }
}
```
VF page: `<apex:page standardController="Account" extensions="AccountExtension">`

### StandardController Methods
| Method | Returns | Purpose |
|--------|---------|---------|
| `getId()` | Id | Record ID from URL |
| `getRecord()` | sObject | The record (only includes fields referenced in VF markup) |
| `save()` | PageReference | Saves and navigates to detail |
| `delete()` | PageReference | Deletes and navigates |
| `edit()` | PageReference | Navigates to edit page |
| `cancel()` | PageReference | Navigates to previous page |
| `addFields(List<String>)` | void | Add fields not in VF markup to getRecord() |

### PageReference — Navigation
```apex
// By URL
return new PageReference('/apex/MyPage');
return new PageReference('/' + account.Id);

// By VF page static reference (preferred)
PageReference ref = Page.MyPageName;
ref.getParameters().put('id', account.Id);
ref.setRedirect(true);  // browser redirect vs server forward
return ref;

// Stay on current page
return null;
```

### User Feedback — ApexPages.addMessage()
```apex
// Severity levels: CONFIRM, INFO, WARNING, ERROR
ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Required field missing'));
ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.CONFIRM, 'Saved successfully'));
```
VF page must include `<apex:messages>` or `<apex:pageMessages>` to display messages.

### StandardSetController — Paginated Lists
```apex
public ApexPages.StandardSetController setController {
    get {
        if (setController == null) {
            setController = new ApexPages.StandardSetController(
                Database.getQueryLocator([SELECT Id, Name FROM Account ORDER BY Name]));
            setController.setPageSize(20);
        }
        return setController;
    }
    set;
}
public List<Account> getAccounts() {
    return (List<Account>) setController.getRecords();
}
```
Methods: `next()`, `previous()`, `first()`, `last()`, `hasNext()`, `hasPrevious()`.

### Testing VF Controllers
```apex
@isTest
static void testExtension() {
    Account acc = new Account(Name = 'Test');
    insert acc;

    // Set page context
    PageReference pageRef = Page.MyPage;
    Test.setCurrentPageReference(pageRef);
    ApexPages.currentPage().getParameters().put('id', acc.Id);

    // Test extension
    ApexPages.StandardController sc = new ApexPages.StandardController(acc);
    AccountExtension ext = new AccountExtension(sc);

    // Call action and assert
    PageReference result = ext.sendInvoice();
    System.assertNotEquals(null, result, 'Should navigate after save');
}
```

## PTA / SA Relevance

**In partner code reviews, watch for:**
- `stdController.getRecord()` used without calling `addFields()` for fields not on the page — returns null for those fields, causes NPE
- Custom controller without sharing keyword — runs in system context, may expose data
- ApexPages.addMessage() called but no `<apex:messages>` tag in markup — messages silently disappear
- `setRedirect(false)` (or missing setRedirect) when navigating to a standard page — inconsistent behavior in Lightning Experience

**Enterprise-scale considerations:**
- The extension pattern is the right architecture for adding behavior to standard Record pages with VF. Custom controllers are overkill for pages that mostly use standard object CRUD.
- Testing VF controllers properly requires `Test.setCurrentPageReference()` and parameter setup — often skipped, leading to coverage gaps on controller classes.

## Architecture / How It Works

```
CONTROLLER EXTENSION PATTERN — WIRING

  VF Page (markup):
  ┌──────────────────────────────────────────────────────────┐
  │  <apex:page standardController="Account"                 │
  │             extensions="AccountExtension">               │
  │                                                          │
  │  {!account.Name}  ← from standard controller            │
  │  {!sendInvoice}   ← from extension                       │
  │  {!save}          ← from standard controller             │
  └──────────────────────────────────────────────────────────┘
           │                               │
           ▼                               ▼
  ApexPages.StandardController     AccountExtension class
  ─────────────────────────────     ────────────────────────────
  - getRecord()                     - constructor(stdCtrl)
  - save(), delete(), edit()        - sendInvoice() method
  - getId()                         - custom properties
  - Standard CRUD behaviors

  Both are instantiated when page loads.
  Extension constructor receives the StandardController instance.
```

**Limitations:**
- Extension can access standard controller's methods via the `stdCtrl` reference
- Multiple extensions: methods in first extension take precedence if there are name conflicts
- `stdController.getRecord()` only populates fields referenced in VF markup OR explicitly added via `addFields()`

```
PAGE REFERENCE NAVIGATION

  Action method returns:
  ┌───────────────────────────────────────────────────────┐
  │  null            → stay on current page, re-render    │
  │                                                       │
  │  new PageReference('/apex/OtherPage')                 │
  │                  → navigate to another VF page        │
  │                                                       │
  │  Page.OtherPage  → type-safe VF page reference        │
  │                                                       │
  │  new PageReference('/' + recordId)                    │
  │                  → standard record detail page        │
  │                                                       │
  │  (ref).setRedirect(true) → browser HTTP redirect      │
  │  (ref).setRedirect(false) → server-side forward       │
  └───────────────────────────────────────────────────────┘
  Note: setRedirect(true) recommended for navigating
  outside VF framework (standard pages, external URLs)
```

**Limitations:**
- `Page.PageName` static references resolve at compile time — page must exist in the org
- `setRedirect(false)` in Lightning Experience may cause visual inconsistencies

## Key Facts to Memorize
- Extension constructor: `public MyExtension(ApexPages.StandardController sc)` — required signature
- `stdController.getRecord()` only returns fields referenced in VF markup
- Action methods return `PageReference` (navigate) or `null` (stay)
- `ApexPages.addMessage()` requires `<apex:messages>` in markup to display
- `transient` keyword excludes property from view state (reduce view state size)
- Test VF: `Test.setCurrentPageReference()` + `ApexPages.currentPage().getParameters().put()`
- StandardSetController: `getRecords()`, `next()`, `previous()`, `hasNext()`, `hasPrevious()`

## Customer Advisory Tips
- **VF extension vs full rewrite:** For adding a button to an existing object page, extension is almost always the right answer. Saves days of work vs writing a full custom controller.
- **View state tuning:** Mark large List<sObject> or Map properties as `transient` if they can be re-queried. Add `SOQL for loop` patterns in lazy-loading getters for really large data.

## Exam Traps
- Extension constructor must take `ApexPages.StandardController` — NOT the SObject type (`Account acc`)
- `stdController.getRecord()` does NOT return all fields — only fields in VF markup
- `null` return from action method = stay on page (NOT an error condition)
- Messages added with `ApexPages.addMessage()` are invisible if `<apex:messages>` is missing from markup
- `standardController` and `controller` cannot coexist on the same `<apex:page>` tag

## Practice Questions

**Q:** In a controller extension, how do you access the bound record's Id?
**A:** `stdController.getId()` — returns the Id from the URL parameter. Or cast `stdController.getRecord()` to the specific type and access `.Id`.

**Q:** `stdController.getRecord()` is called to get an Account, but `AnnualRevenue` returns null even though the field has data. Why?
**A:** `getRecord()` only includes fields referenced in the VF page's `{!record.FieldName}` expressions. `AnnualRevenue` is not on the page. Fix: add `{!account.AnnualRevenue}` to the page (can use `apex:outputField` in a hidden panel) or call `stdController.addFields(new List<String>{'AnnualRevenue'})` in the extension constructor.

**Q:** An action method should add a success message and stay on the page. What does it return?
**A:** `null` — returning null reloads the current page. Call `ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.CONFIRM, 'Success'))` before returning null.
