# Lab 3: LWC — Account Quick View Component

## What You Need to Be Able to Do

### Apex Controller
- [ ] Create `AccountContactsController` with `public with sharing`
- [ ] Write `getTopContacts(Id accountId)` annotated `@AuraEnabled(cacheable=true)` that:
  - Returns `List<Contact>` — SELECT Id, Name, Title, Email, Phone, CreatedDate
  - WHERE `AccountId = :accountId`
  - ORDER BY `CreatedDate DESC LIMIT 5`
- [ ] Understand why `cacheable=true` is required for `@wire` (non-cacheable methods can't be wired)

### Component Bundle Structure
- [ ] Create the component folder `accountQuickView/` with all files sharing the same name:
  - `accountQuickView.html` — template
  - `accountQuickView.js` — controller class extending `LightningElement`
  - `accountQuickView.js-meta.xml` — deployment config

### HTML Template
- [ ] Use a single `<template>` root with a `<lightning-card>` container
- [ ] Implement loading state with `lwc:if={isLoading}` showing `<lightning-spinner>`
- [ ] Implement error state with `lwc:if={error}` showing error message
- [ ] Implement data state with `lwc:if={contacts}` containing:
  - `<lightning-datatable>` with `key-field="Id"`, `data={contacts}`, `columns={columns}`
  - Empty state message when `lwc:if={noContacts}`
- [ ] Add a footer `<lightning-button>` with `onclick={handleCreateContact}`

### JavaScript Controller
- [ ] Import `LightningElement`, `api`, `wire`, `track` from `lwc`
- [ ] Import `NavigationMixin` from `lightning/navigation`
- [ ] Import `getTopContacts` from `@salesforce/apex/AccountContactsController.getTopContacts`
- [ ] Declare `@api recordId` — receives the record page context automatically
- [ ] Define `columns` array with label/fieldName/type for Name, Title, Email, Phone
- [ ] Wire the Apex method: `@wire(getTopContacts, { accountId: '$recordId' })` — `$` makes recordId reactive
- [ ] Handle wire result in a function (not property) to store full result and handle data/error separately
- [ ] Implement computed getters: `isLoading`, `hasContacts`, `noContacts`
- [ ] Implement `handleCreateContact()` using `NavigationMixin.Navigate` to navigate to new Contact form with `defaultFieldValues: 'AccountId=' + this.recordId`
- [ ] Extend the class as `extends NavigationMixin(LightningElement)` — not just `LightningElement`

### Deployment Config (js-meta.xml)
- [ ] Set `<isExposed>true</isExposed>` to allow App Builder drag-and-drop
- [ ] Set target to `<target>lightning__RecordPage</target>`
- [ ] Restrict to Account pages: `<targetConfig targets="lightning__RecordPage"><objects><object>Account</object></objects></targetConfig>`

### Deployment
- [ ] Deploy Apex class: `sf project deploy start --source-dir force-app/main/default/classes/AccountContactsController.cls`
- [ ] Deploy LWC: `sf project deploy start --source-dir force-app/main/default/lwc/accountQuickView`
- [ ] Or deploy everything: `sf project deploy start --source-dir force-app`

### App Builder Configuration
- [ ] Navigate to any Account record → gear icon → Edit Page
- [ ] Find `accountQuickView` under Custom components in the left panel
- [ ] Drag to the page layout and save
- [ ] Activate the page if prompted

### Verification
- [ ] Component shows Top 5 Contacts datatable on an Account with related Contacts
- [ ] Component shows "No contacts found" on an Account with no Contacts
- [ ] Loading spinner appears briefly while wire resolves
- [ ] "Create Contact" button navigates to new Contact form with Account pre-populated
- [ ] After creating a Contact, the datatable refreshes to show the new Contact

### Challenge: Row Actions and Refresh
- [ ] Add a `type: 'action'` column to the datatable with `rowActions: [{ label: 'View', name: 'view' }]`
- [ ] Add `handleRowAction(event)` that reads `event.detail.action.name` and navigates to the Contact record page using `NavigationMixin.Navigate`
- [ ] Add a Refresh button that calls `refreshApex(this.wiredResult)` to reload after new Contact creation
- [ ] For `refreshApex` to work: import from `@salesforce/apex`; store the entire wire result object (not just `.data`) in an instance variable

---

## Key Code Patterns to Remember

```javascript
// WIRE with reactive parameter
@wire(getTopContacts, { accountId: '$recordId' })  // $ = reactive
wiredContactsHandler(result) {
    this.wiredResult = result;  // store for refreshApex
    if (result.data) {
        this.contacts = result.data;
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error.body.message;
        this.contacts = undefined;
    }
}
```

```javascript
// NAVIGATIONMIXIN — requires extends NavigationMixin(LightningElement)
handleCreateContact() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: { objectApiName: 'Contact', actionName: 'new' },
        state: { defaultFieldValues: 'AccountId=' + this.recordId }
    });
}
```

```javascript
// COMPUTED GETTERS for template conditionals
get isLoading() { return !this.contacts && !this.error; }
get hasContacts() { return this.contacts && this.contacts.length > 0; }
get noContacts() { return this.contacts && this.contacts.length === 0; }
```

```xml
<!-- JS-META.XML — expose to App Builder, Account Record Pages only -->
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects><object>Account</object></objects>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```
