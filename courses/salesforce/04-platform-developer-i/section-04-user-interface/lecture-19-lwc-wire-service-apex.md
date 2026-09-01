# LWC Wire Service and Apex

## Learning Objectives
- Use the @wire decorator with Salesforce wire adapters such as getRecord and getFieldValue to fetch record data declaratively
- Connect an @AuraEnabled(cacheable=true) Apex method to a component via @wire
- Call Apex imperatively for DML operations and handle the resulting Promise
- Use refreshApex() to invalidate and re-fetch wired data after a write operation

## Slides

### Slide 1: What Is the Wire Service?
**Visual:**
```
  ┌────────────────────────────────────────────────────────────────┐
  │                   Wire Service Data Flow                       │
  │                                                                │
  │  LDS Adapters            Wire Service         Component       │
  │  (getRecord,             ┌───────────┐        ┌───────────┐   │
  │   getObjectInfo,  ──────►│  @wire    │───────►│  { data,  │   │
  │   getRelatedList)        │ decorator │        │   error } │   │
  │                          └─────┬─────┘        └───────────┘   │
  │  Apex Methods                  │ reactive:                     │
  │  (@AuraEnabled(           re-fetches when                      │
  │   cacheable=true)) ────►  $ parameters change                  │
  └────────────────────────────────────────────────────────────────┘
  Wire = reactive reads  |  Imperative Apex = writes / triggered reads
```
**Content:**
- The Wire Service is LWC's reactive data binding mechanism to Salesforce data
- Connects component properties to data sources via wire adapters
- Data is fetched automatically on component load and re-fetched when parameters change
- Two main sources: **Salesforce wire adapters** (Lightning Data Service / LDS) and **Apex methods**
- Wired data is read-only; use imperative Apex calls for write operations
**Speaker Notes:** The wire service is what makes LWC feel reactive with respect to Salesforce data. Instead of manually calling Apex in connectedCallback and managing loading/error state, @wire handles the fetch lifecycle. When the component renders, @wire fetches the data. When parameters change, @wire automatically re-fetches. The result includes both a data property and an error property — always handle both.

### Slide 2: @wire with Salesforce Wire Adapters
**Visual:** Code import statement `import { getRecord, getFieldValue } from 'lightning/uiRecordApi'` followed by @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_NAME] }) wiredAccount
**Content:**
- Import wire adapters from `lightning/uiRecordApi`, `lightning/uiListsApi`, etc.
- `@wire(getRecord, { recordId: '$recordId', fields: [FIELD_REFERENCE] })`
- Parameters prefixed with `$` are reactive — changing the @api property triggers re-fetch
- Field references are imported: `import ACCOUNT_NAME from '@salesforce/schema/Account.Name'`
- `getFieldValue(record.data, FIELD_REFERENCE)` extracts field value from wired record
**Speaker Notes:** The `$` prefix on wire parameters is the LWC convention for reactive parameters. When the value of recordId changes (e.g., because a parent passes a new record ID), @wire automatically re-runs with the new value. Field references imported from @salesforce/schema are the type-safe way to reference fields — they prevent typos and allow the platform to validate fields at deploy time. Always use getFieldValue() to extract values from a wired getRecord result rather than accessing the nested data structure directly.

### Slide 3: @wire with Apex Methods
**Visual:** Side-by-side: Apex class with @AuraEnabled(cacheable=true) getAccountList() method, and LWC JS file with import, @wire(getAccountList) wiredAccounts
**Content:**
- Import Apex method: `import getAccountList from '@salesforce/apex/AccountController.getAccountList'`
- `@wire(getAccountList)` — wire the method to a component property
- Wired result has `{ data, error }` structure — always check both
- `@AuraEnabled(cacheable=true)` is **required** for @wire — non-cacheable methods throw an error
- Pass parameters: `@wire(getAccountList, { accountType: '$selectedType' })`
**Speaker Notes:** The import path for an Apex method follows the pattern: @salesforce/apex/ClassName.methodName. The class must be in the default namespace or the namespace must be included. When wiring with parameters, reactive parameters use the $ prefix just like LDS wire adapters. The cacheable=true annotation tells Salesforce this method is safe to cache on the client — it must not perform DML. If you try to wire a non-cacheable method, you'll get a runtime error: "Methods annotated with @AuraEnabled(cacheable=true) should not perform DML."

### Slide 4: Wired Functions vs. Wired Properties
**Visual:** Two code blocks: one using @wire to a property (wiredAccount = {}), another using @wire to a function (wiredAccountHandler({data, error})), with notes on when each is appropriate
**Content:**
- **Wired property**: `@wire(getRecord, params) wiredAccount;` — stores result directly
- **Wired function**: `@wire(getRecord, params) wiredAccountHandler({ data, error }) { ... }` — runs a function when data arrives
- Wired functions allow side effects when data arrives (e.g., transforming data, setting other properties)
- The result object always has `data` and `error` properties — exactly one will be non-null at any time
- `refreshApex()` works with both wired properties and wired functions
**Speaker Notes:** Wired properties are simpler and work well for straightforward data display. Wired functions give you a place to put logic that runs when data arrives — processing, transforming, or setting derived properties. A common pattern is to use a wired function when you need to populate a separate list property from the wired data, because you can only pass a wired property reference (not an arbitrary property) to refreshApex(). Save the wired result to an instance variable in the function so you can pass it to refreshApex() later.

### Slide 5: Imperative Apex Calls
**Visual:** JS code showing getContactList() called inside connectedCallback as a Promise, with .then(data => { }) and .catch(error => { }) handlers
**Content:**
- Call Apex imperatively when @wire isn't appropriate: after user action (button click), for DML, conditional calls
- Import the Apex method the same way as for @wire
- Invoke like a function: `getContactList({ paramName: value })` — returns a Promise
- Handle success with `.then(result => { this.data = result; })`
- Handle errors with `.catch(error => { this.error = error; })`
- Use `async/await` syntax as an alternative: `try { this.data = await getContactList(); } catch(e) { }`
**Speaker Notes:** Imperative Apex calls are the correct choice whenever you need to control when the call happens — in response to a button click, after validating form data, or as part of a sequence of operations. For DML operations, you MUST use imperative calls — @wire only works with cacheable Apex methods, and cacheable methods cannot perform DML. The import syntax is identical to @wire imports; only the invocation pattern differs (property vs. function call).

### Slide 6: refreshApex()
**Visual:** Code sequence: wired property stored in wiredAccountsResult, a save() imperative method performs DML, then calls refreshApex(this.wiredAccountsResult) to re-fetch the fresh list
**Content:**
- After a write operation (DML via imperative Apex), wired data may be stale
- `refreshApex(wiredPropertyRef)` forces the wire service to re-fetch
- Import: `import { refreshApex } from '@salesforce/apex'`
- Must pass the exact wired property reference (the whole `{ data, error }` object), not just `data`
- If using a wired function, store the full result in an instance variable and pass that
**Speaker Notes:** This is a very common exam question and a very common real-world pattern. The typical flow is: component loads, @wire fetches a list of records, user clicks Save, an imperative Apex call does the insert/update, then refreshApex() is called with the stored wired result reference to pull fresh data. Without refreshApex(), the wired cache shows the old data even though the database has changed. Never pass just the data portion — refreshApex() needs the complete wired result object.

### Slide 7: NavigationMixin
**Visual:** LWC class extending LightningElement with NavigationMixin applied, showing this[NavigationMixin.Navigate] called with a page reference object for a record detail page
**Content:**
- `NavigationMixin` provides navigation from LWC components
- Import: `import { NavigationMixin } from 'lightning/navigation'`
- Apply to class: `export default class MyComponent extends NavigationMixin(LightningElement) { }`
- Navigate: `this[NavigationMixin.Navigate]({ type: 'standard__recordPage', attributes: { ... } })`
- Generate URL without navigating: `this[NavigationMixin.GenerateUrl](pageRef).then(url => { ... })`
**Speaker Notes:** NavigationMixin is a mixin pattern — it extends LightningElement with navigation methods. The syntax this[NavigationMixin.Navigate] looks unusual but is standard JavaScript computed property access with a Symbol key. Common page reference types: standard__recordPage for record pages, standard__objectPage for object home pages, standard__namedPage for named pages like the home page or related list. For the exam, know the import path and the mixin application syntax.

### Slide 8: Lightning Data Service vs. Apex
**Visual:**
```
  Need to work with Salesforce data in LWC?
           │
           ▼
  Single record CRUD (standard fields)?
  ├─ YES ──► Lightning Data Service base components:
  │           lightning-record-form
  │           lightning-record-view-form
  │           lightning-record-edit-form
  └─ NO
           │
           ▼
  READ operation (complex query / bulk)?
  ├─ YES ──► @wire with @AuraEnabled(cacheable=true) Apex
  └─ NO (DML / user-triggered / conditional?)
           │
           ▼
           Imperative Apex call (async/await or .then/.catch)
           └─ call refreshApex() after DML to update wire cache
```
**Content:**
- **Lightning Data Service (LDS)**: handles single-record Create/Read/Update/Delete automatically; uses the platform cache
- Base components for LDS: `lightning-record-form`, `lightning-record-view-form`, `lightning-record-edit-form`
- LDS automatically updates related components when a record changes
- **Direct Apex**: required for complex queries (SOQL with WHERE, JOIN-like subqueries), bulk operations, business logic
- @wire Apex for read, imperative Apex for write — consistent pattern
**Speaker Notes:** LDS is the shortcut for standard record operations — use the base components and let Salesforce handle the data layer. For a standard record detail or edit form, lightning-record-form with a list of fields is often all you need. When requirements exceed single-record operations — aggregate queries, multi-object joins, field calculations, or processing many records at once — move to Apex. The combination of @wire for reads and imperative for writes is the standard pattern for Apex-backed LWC components.

## Recording Script

Welcome to Lecture 19 on LWC Wire Service and Apex. This lecture ties together the component framework from the previous two lectures with the Apex skills from Section 3. By the end you'll know how to get data into a component and write data back to the database.

The Wire Service is LWC's reactive data layer. You use the @wire decorator to connect a component property to a Salesforce data source. When the component loads, @wire automatically fetches the data. When parameters change, it re-fetches automatically.

There are two categories of wire adapters. First, Salesforce wire adapters like getRecord from lightning/uiRecordApi — these connect directly to Lightning Data Service and the platform cache. Import getRecord, import your field references from @salesforce/schema, and wire them up. Use the $ prefix on parameters to make them reactive.

Second, Apex methods. Import the method from @salesforce/apex/ClassName.methodName. Annotate the Apex method with @AuraEnabled(cacheable=true). Wire it to a component property with @wire(myApexMethod). The wired result has data and error properties — always handle both. cacheable=true is non-negotiable for @wire — non-cacheable methods won't work.

For write operations, you must use imperative Apex. Import the same way, but call it like a function inside an event handler. It returns a Promise — use .then() and .catch() or async/await. The Apex method performing DML must NOT have cacheable=true.

After a write, your wired data is stale. Call refreshApex() to force a re-fetch. Import it from @salesforce/apex. Pass it the entire wired result object — not just the data portion. If you used a wired function instead of a wired property, store the result in an instance variable so you can pass it to refreshApex().

NavigationMixin lets you navigate programmatically. Extend NavigationMixin(LightningElement), then call this[NavigationMixin.Navigate] with a page reference object.

For simple single-record CRUD, consider using LDS base components — lightning-record-form handles the whole form without any Apex. When requirements get complex, move to Apex.

## Exam Tips
- `@wire` with an Apex method requires the method to have `@AuraEnabled(cacheable=true)` — methods without `cacheable=true` cannot be wired and will cause a runtime error
- `refreshApex()` must receive the **entire wired result object** (e.g., `this.wiredResult`), not just `wiredResult.data` — passing only the data property causes an error
- Wire parameters prefixed with `$` are reactive — a change to the underlying @api property automatically triggers a re-fetch; parameters without `$` are static
- `NavigationMixin` must be applied to the class as `extends NavigationMixin(LightningElement)` — it cannot be imported and used standalone
- The import path for Apex methods follows the pattern `'@salesforce/apex/ClassName.methodName'` — case sensitive and must match the Apex class name exactly

## Lecture Summary
The Wire Service connects LWC component properties to Salesforce data sources declaratively via the @wire decorator, using either Salesforce wire adapters (like getRecord from lightning/uiRecordApi) or @AuraEnabled(cacheable=true) Apex methods, both of which return a result object with data and error properties. Imperative Apex calls are required for DML operations and any write that cannot use a cacheable method, returning Promises handled with .then()/.catch() or async/await. After a write, refreshApex() forces the wire service to invalidate its cache and re-fetch by passing the stored wired result object reference. NavigationMixin extends LightningElement to provide this[NavigationMixin.Navigate] for programmatic page navigation, and Lightning Data Service base components handle standard single-record CRUD without any Apex.

## Mini Quiz

**Q1:** A developer wires an Apex method to a component property using `@wire(getContacts) contacts`. After a user inserts a new Contact via an imperative Apex call, the list does not update. What is the most likely fix?
A) Switch from @wire to an imperative call in connectedCallback
B) Call `refreshApex(this.contacts)` after the insert completes successfully
C) Change the Apex method from `cacheable=true` to `cacheable=false`
D) Add `bubbles: true` to the CustomEvent dispatched after the insert

**Answer:** B — After a write operation, the @wire cache may hold stale data. `refreshApex(this.contacts)` tells the wire service to invalidate the cached result and re-fetch fresh data. The wired property reference `this.contacts` (the entire `{ data, error }` object) must be passed — not just `this.contacts.data`.

**Q2:** Which Apex method annotation is required for the method to be callable via the `@wire` decorator in an LWC component?
A) `@AuraEnabled`
B) `@AuraEnabled(cacheable=true)`
C) `@RemoteAction`
D) `@AuraEnabled(callout=true)`

**Answer:** B — `@AuraEnabled(cacheable=true)` is specifically required for @wire calls. Plain `@AuraEnabled` (without cacheable=true) can only be called imperatively. `@RemoteAction` is for Visualforce Remote Objects. `@AuraEnabled(callout=true)` is not a valid annotation.

**Q3:** A developer needs to navigate a user to a specific Account record page after a successful save. Which code pattern is correct?
A) `window.location.href = '/lightning/r/Account/' + accountId + '/view';`
B) `import { NavigationMixin } from 'lightning/navigation'; ... this[NavigationMixin.Navigate]({ type: 'standard__recordPage', attributes: { recordId: accountId, actionName: 'view' } });`
C) `import { navigate } from 'lightning/navigation'; ... navigate(this, accountId);`
D) `this.dispatchEvent(new CustomEvent('navigate', { detail: { recordId: accountId } }));`

**Answer:** B — `NavigationMixin` from `lightning/navigation` is the correct way to navigate in LWC. The class must extend `NavigationMixin(LightningElement)` and navigation is triggered with `this[NavigationMixin.Navigate]()` and a properly formatted page reference object. Option A uses direct URL manipulation which bypasses the LWC navigation framework. Option C uses incorrect import and call syntax. Option D dispatches an event but doesn't actually navigate.
