# Lab 3: Lightning Web Component — Account Quick View

## Objectives
- Build an LWC that displays a related Contact datatable on an Account record page
- Retrieve related Contact records using an @AuraEnabled Apex controller method
- Implement a "Create Contact" button that navigates to the standard new Contact form
- Deploy the component to a Lightning Record Page using App Builder

## Prerequisites
- A Salesforce Developer Edition org or sandbox with Lightning Experience enabled
- VS Code with **Salesforce Extension Pack** installed (recommended) OR Developer Console
- Org authorized in VS Code: `sf org login web --alias myDevOrg`
- Understanding of LWC component structure, @wire, and NavigationMixin from Lectures 18-19

## Estimated Time
45 minutes

---

## Step-by-Step Instructions

### Part 1: Create the Apex Controller

The LWC needs a server-side method to query related Contacts. We write this as an @AuraEnabled Apex method.

**If using VS Code:**

1. Open your VS Code project. Navigate to `force-app/main/default/classes/`.

2. Create a new file: `AccountContactsController.cls`

**If using Developer Console:**

1. Go to **File > New > Apex Class**, name it `AccountContactsController`.

Add the following code:

```apex
public with sharing class AccountContactsController {

    /**
     * Returns the top 5 Contacts related to the given Account,
     * ordered by most recently created.
     *
     * @param accountId  The Id of the Account record page the component is on
     * @return           List of up to 5 Contact records
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getTopContacts(Id accountId) {
        return [
            SELECT Id, Name, Title, Email, Phone, CreatedDate
            FROM Contact
            WHERE AccountId = :accountId
            ORDER BY CreatedDate DESC
            LIMIT 5
        ];
    }
}
```

Save the file.

**Why `cacheable=true`?** This tells the platform the method can be cached — it will not change data. It enables the @wire service to cache results client-side, reducing server calls. Only use `cacheable=true` on methods that perform no DML.

**If using VS Code**, also create the meta file `AccountContactsController.cls-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <status>Active</status>
</ApexClass>
```

---

### Part 2: Create the LWC Component Files

**If using VS Code** (recommended):

1. In VS Code, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
   `SFDX: Create Lightning Web Component`

2. Name the component: `accountQuickView`

3. Choose `force-app/main/default/lwc` as the target directory.

VS Code creates three files:
- `accountQuickView.html`
- `accountQuickView.js`
- `accountQuickView.js-meta.xml`

**If using Developer Console:**
Developer Console does not support LWC creation. Use VS Code or the Salesforce CLI directly:
```bash
sf lightning generate component --name accountQuickView --type lwc --output-dir force-app/main/default/lwc
```

---

### Part 3: Write the HTML Template

Open `accountQuickView.html` and replace its content with:

```html
<template>
    <lightning-card title="Top 5 Contacts" icon-name="standard:contact">

        <!-- Loading spinner while data loads -->
        <template lwc:if={isLoading}>
            <div class="slds-align_absolute-center slds-p-around_medium">
                <lightning-spinner alternative-text="Loading" size="small"></lightning-spinner>
            </div>
        </template>

        <!-- Error state -->
        <template lwc:if={error}>
            <div class="slds-m-around_medium">
                <p class="slds-text-color_error">Error loading contacts: {error}</p>
            </div>
        </template>

        <!-- Data table -->
        <template lwc:if={contacts}>
            <template lwc:if={hasContacts}>
                <lightning-datatable
                    key-field="Id"
                    data={contacts}
                    columns={columns}
                    hide-checkbox-column>
                </lightning-datatable>
            </template>

            <template lwc:if={noContacts}>
                <div class="slds-m-around_medium">
                    <p>No contacts found for this account.</p>
                </div>
            </template>
        </template>

        <!-- Footer: Create Contact button -->
        <div slot="footer">
            <lightning-button
                label="Create Contact"
                variant="brand"
                onclick={handleCreateContact}>
            </lightning-button>
        </div>

    </lightning-card>
</template>
```

---

### Part 4: Write the JavaScript Controller

Open `accountQuickView.js` and replace its content with:

```javascript
import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getTopContacts from '@salesforce/apex/AccountContactsController.getTopContacts';

export default class AccountQuickView extends NavigationMixin(LightningElement) {

    // recordId is automatically set by the Lightning Record Page context
    @api recordId;

    @track contacts;
    @track error;

    // Column definitions for lightning-datatable
    columns = [
        { label: 'Name',  fieldName: 'Name',  type: 'text'  },
        { label: 'Title', fieldName: 'Title', type: 'text'  },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' }
    ];

    // Wire the Apex method — automatically re-runs when recordId changes
    @wire(getTopContacts, { accountId: '$recordId' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.error   = undefined;
        } else if (error) {
            this.error    = error.body ? error.body.message : JSON.stringify(error);
            this.contacts = undefined;
        }
    }

    // Computed getters for template conditionals
    get isLoading() {
        return !this.contacts && !this.error;
    }

    get hasContacts() {
        return this.contacts && this.contacts.length > 0;
    }

    get noContacts() {
        return this.contacts && this.contacts.length === 0;
    }

    // Navigate to new Contact form, pre-populating AccountId
    handleCreateContact() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: 'AccountId=' + this.recordId
            }
        });
    }
}
```

**Key concepts in this file:**
- `@api recordId` receives the current record's Id automatically when placed on a Record Page
- `@wire(getTopContacts, { accountId: '$recordId' })` — the `$` prefix makes `recordId` reactive; the wire re-executes whenever `recordId` changes
- `NavigationMixin` from `lightning/navigation` enables standard navigation to other pages
- The `state.defaultFieldValues` pre-populates the AccountId on the new Contact form

---

### Part 5: Configure the Component Metadata

Open `accountQuickView.js-meta.xml` and replace its content with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <objects>
                <object>Account</object>
            </objects>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

This configuration:
- `isExposed: true` — makes the component available in App Builder drag-and-drop palette
- `targets/lightning__RecordPage` — allows it to be placed on Record Pages only
- `targetConfigs/objects/Account` — restricts it to Account record pages

---

### Part 6: Deploy to the Org

**If using VS Code/CLI:**

1. Open a terminal in VS Code (`Ctrl+`` / Cmd+``).

2. Deploy all changed files:
```bash
sf project deploy start --source-dir force-app/main/default/classes/AccountContactsController.cls
sf project deploy start --source-dir force-app/main/default/lwc/accountQuickView
```

Or deploy everything at once:
```bash
sf project deploy start --source-dir force-app
```

3. Watch for any compile errors in the terminal output. Fix any issues before proceeding.

---

### Part 7: Add the Component to the Account Record Page

1. In Salesforce, navigate to any **Account** record.

2. Click the **gear icon** (top-right) and select **Edit Page**.

3. Lightning App Builder opens. In the **Components** panel on the left, scroll to find **accountQuickView** under **Custom** components (or search for it).

4. Drag the component onto the page — place it in the right column or below the record details.

5. Click **Save**.

6. Click **Activate** (if prompted) to make the page active for all users.

7. Click **Back** to return to the record page.

---

## Verification

1. On an Account record that has related Contacts, confirm:
   - The **Top 5 Contacts** card appears on the page
   - A datatable with Name, Title, Email, and Phone columns is visible
   - Up to 5 contacts are listed (most recently created first)

2. On an Account with **no Contacts**, confirm:
   - The card shows "No contacts found for this account."

3. Click the **Create Contact** button and confirm:
   - You are navigated to the standard new Contact form
   - The **Account Name** field is pre-populated with the current Account

4. Create a new Contact from this form, save it, then return to the Account record and confirm the new Contact appears in the datatable.

## Challenge Extension

Enhance the component with row-level actions:

1. Add a **View** action column to the datatable that navigates to the Contact record when clicked:
```javascript
columns = [
    // ... existing columns ...
    {
        type: 'action',
        typeAttributes: {
            rowActions: [{ label: 'View', name: 'view' }]
        }
    }
];
```

2. Add a `handleRowAction(event)` method that reads `event.detail.action.name` and `event.detail.row.Id`, then uses `NavigationMixin.Navigate` to navigate to the Contact record page.

3. Stretch goal: add a **Refresh** button that calls `refreshApex()` on the wired property to reload the contact list after a new contact is created.

**Hint:** To use `refreshApex`, import it from `@salesforce/apex` and store the wire result in a tracked property using the full `{ data, error }` pattern.
