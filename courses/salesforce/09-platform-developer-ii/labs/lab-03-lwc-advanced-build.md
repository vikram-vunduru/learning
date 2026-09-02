# Lab 03: LWC Advanced Build

## Lab Overview

**Estimated Time:** 3 hours  
**Prerequisites:** Salesforce CLI, Node.js (for Jest), VS Code + Salesforce Extension Pack  
**Covers:** Wire service, imperative Apex, LMS, Jest testing, error handling

---

## Scenario

Build an Account 360 dashboard with three LWC components on a record page:
1. **`accountHeader`** — displays Account name and key metrics via LDS wire (`getRecord`)
2. **`relatedRecordsList`** — displays related Contacts with filter; uses custom Apex wire
3. **`accountActions`** — buttons that trigger imperative Apex calls; communicates results to siblings via LMS

---

## Part 1: Account Header (LDS Wire)

**`accountHeader.js`:**
```javascript
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_REVENUE from '@salesforce/schema/Account.AnnualRevenue';
import ACCOUNT_RATING from '@salesforce/schema/Account.Rating';

const FIELDS = [ACCOUNT_NAME, ACCOUNT_INDUSTRY, ACCOUNT_REVENUE, ACCOUNT_RATING];

export default class AccountHeader extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    get name() { return getFieldValue(this.account.data, ACCOUNT_NAME); }
    get industry() { return getFieldValue(this.account.data, ACCOUNT_INDUSTRY); }
    get revenue() {
        const rev = getFieldValue(this.account.data, ACCOUNT_REVENUE);
        return rev ? '$' + rev.toLocaleString() : 'N/A';
    }
    get rating() { return getFieldValue(this.account.data, ACCOUNT_RATING); }

    get isLoading() { return !this.account.data && !this.account.error; }
    get hasError() { return !!this.account.error; }
    get errorMessage() {
        return this.account.error?.body?.message || 'Failed to load account';
    }
}
```

**`accountHeader.html`:**
```html
<template>
    <lightning-card title="Account Overview">
        <template if:true={isLoading}>
            <lightning-spinner alternative-text="Loading..." size="small"></lightning-spinner>
        </template>
        <template if:true={hasError}>
            <div class="slds-text-color_error slds-p-around_medium">{errorMessage}</div>
        </template>
        <template if:false={isLoading}>
            <template if:false={hasError}>
                <div class="slds-p-around_medium">
                    <h1 class="slds-text-heading_large account-name">{name}</h1>
                    <p><strong>Industry:</strong> <span class="industry-value">{industry}</span></p>
                    <p><strong>Revenue:</strong> {revenue}</p>
                    <p><strong>Rating:</strong> {rating}</p>
                </div>
            </template>
        </template>
    </lightning-card>
</template>
```

---

## Part 2: Related Records List (Custom Apex Wire)

**Apex Controller:**
```apex
public with sharing class AccountContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForAccount(Id accountId, String filter) {
        String searchTerm = filter != null ? '%' + filter + '%' : '%';
        return [
            SELECT Id, FirstName, LastName, Email, Title, Phone
            FROM Contact
            WHERE AccountId = :accountId
            AND (LastName LIKE :searchTerm OR Email LIKE :searchTerm)
            WITH SECURITY_ENFORCED
            ORDER BY LastName ASC
            LIMIT 50
        ];
    }

    @AuraEnabled
    public static void updateContactTitle(Id contactId, String newTitle) {
        if (!Schema.sObjectType.Contact.isUpdateable()) {
            throw new AuraHandledException('Insufficient permissions to update Contact');
        }
        update new Contact(Id = contactId, Title = newTitle);
    }
}
```

**`relatedRecordsList.js`:**
```javascript
import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContactsForAccount from '@salesforce/apex/AccountContactController.getContactsForAccount';
import updateContactTitle from '@salesforce/apex/AccountContactController.updateContactTitle';
import ACCOUNT_ACTIONS_CHANNEL from '@salesforce/messageChannel/Account_Actions__c';

export default class RelatedRecordsList extends LightningElement {
    @api recordId;

    @track filterText = '';
    @track isUpdating = false;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    @wire(getContactsForAccount, { accountId: '$recordId', filter: '$filterText' })
    wiredContacts;

    get contacts() { return this.wiredContacts.data; }
    get error() { return this.wiredContacts.error; }
    get hasContacts() { return this.contacts && this.contacts.length > 0; }
    get isEmpty() { return this.contacts && this.contacts.length === 0; }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_ACTIONS_CHANNEL,
            (message) => this.handleAccountAction(message)
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleFilterChange(event) {
        this.filterText = event.detail.value;
        // Wire re-executes automatically when filterText changes
    }

    async handleUpdateTitle(event) {
        const contactId = event.currentTarget.dataset.id;
        const newTitle = event.currentTarget.previousElementSibling?.value;
        if (!newTitle) return;

        this.isUpdating = true;
        try {
            await updateContactTitle({ contactId, newTitle });
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Contact title updated',
                variant: 'success'
            }));
            await refreshApex(this.wiredContacts);
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body?.message || 'Update failed',
                variant: 'error'
            }));
        } finally {
            this.isUpdating = false;
        }
    }

    handleAccountAction(message) {
        if (message.action === 'REFRESH_CONTACTS') {
            refreshApex(this.wiredContacts);
        }
    }
}
```

---

## Part 3: Account Actions (Imperative + LMS Publisher)

**`accountActions.js`:**
```javascript
import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import syncAccountToERP from '@salesforce/apex/OMSIntegrationService.syncAccount';
import ACCOUNT_ACTIONS_CHANNEL from '@salesforce/messageChannel/Account_Actions__c';

export default class AccountActions extends LightningElement {
    @api recordId;

    @wire(MessageContext)
    messageContext;

    isSyncing = false;
    syncError = null;
    syncSuccess = false;

    async handleSyncToERP() {
        this.isSyncing = true;
        this.syncError = null;
        this.syncSuccess = false;

        try {
            const result = await syncAccountToERP({ accountId: this.recordId });
            this.syncSuccess = true;

            this.dispatchEvent(new ShowToastEvent({
                title: 'ERP Sync Complete',
                message: 'Account synced successfully. OMS ID: ' + result,
                variant: 'success'
            }));

            // Notify sibling components via LMS
            publish(this.messageContext, ACCOUNT_ACTIONS_CHANNEL, {
                action: 'REFRESH_CONTACTS',
                accountId: this.recordId
            });
        } catch (error) {
            this.syncError = error.body?.message || 'Sync failed. Please try again.';
            this.dispatchEvent(new ShowToastEvent({
                title: 'Sync Failed',
                message: this.syncError,
                variant: 'error',
                mode: 'sticky'
            }));
        } finally {
            this.isSyncing = false;
        }
    }
}
```

---

## Part 4: Jest Tests

```javascript
// accountHeader/__tests__/accountHeader.test.js
import { createElement } from 'lwc';
import AccountHeader from 'c/accountHeader';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { getRecord } from 'lightning/uiRecordApi';

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

const mockRecord = {
    fields: {
        Name: { value: 'Test Corp' },
        Industry: { value: 'Technology' },
        AnnualRevenue: { value: 5000000 },
        Rating: { value: 'Hot' }
    }
};

describe('c-account-header', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
    });

    it('renders account name and industry from wire', async () => {
        const element = createElement('c-account-header', { is: AccountHeader });
        element.recordId = '001xx000000001';
        document.body.appendChild(element);

        getRecordAdapter.emit(mockRecord);
        await Promise.resolve();

        const name = element.shadowRoot.querySelector('.account-name');
        const industry = element.shadowRoot.querySelector('.industry-value');

        expect(name.textContent).toBe('Test Corp');
        expect(industry.textContent).toBe('Technology');
    });

    it('shows loading spinner before wire resolves', () => {
        const element = createElement('c-account-header', { is: AccountHeader });
        element.recordId = '001xx000000001';
        document.body.appendChild(element);

        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).not.toBeNull();
    });

    it('shows error message when wire fails', async () => {
        const element = createElement('c-account-header', { is: AccountHeader });
        element.recordId = '001xx000000001';
        document.body.appendChild(element);

        getRecordAdapter.emitError({ body: { message: 'Record not found' } });
        await Promise.resolve();

        const error = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(error).not.toBeNull();
        expect(error.textContent).toContain('Record not found');
    });
});
```

```javascript
// accountActions/__tests__/accountActions.test.js
import { createElement } from 'lwc';
import AccountActions from 'c/accountActions';
import syncAccountToERP from '@salesforce/apex/OMSIntegrationService.syncAccount';

jest.mock(
    '@salesforce/apex/OMSIntegrationService.syncAccount',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

describe('c-account-actions', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
    });

    it('calls syncAccountToERP when sync button clicked', async () => {
        syncAccountToERP.mockResolvedValue('OMS-001');

        const element = createElement('c-account-actions', { is: AccountActions });
        element.recordId = '001xx000000001';
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('lightning-button[data-action="sync"]');
        button.dispatchEvent(new CustomEvent('click'));

        await Promise.resolve();
        await Promise.resolve();

        expect(syncAccountToERP).toHaveBeenCalledWith({ accountId: '001xx000000001' });
    });

    it('shows error state when sync fails', async () => {
        syncAccountToERP.mockRejectedValue({ body: { message: 'ERP unavailable' } });

        const element = createElement('c-account-actions', { is: AccountActions });
        element.recordId = '001xx000000001';
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('lightning-button[data-action="sync"]');
        button.dispatchEvent(new CustomEvent('click'));

        await Promise.resolve();
        await Promise.resolve();

        const errorEl = element.shadowRoot.querySelector('.sync-error');
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toContain('ERP unavailable');
    });
});
```

---

## Lab Completion Checklist

- [ ] `accountHeader` uses `getRecord` from `lightning/uiRecordApi` with schema imports
- [ ] Loading / error / data states all handled in template
- [ ] `relatedRecordsList` uses custom Apex wire with reactive `$filterText` property
- [ ] Filter input change re-triggers wire automatically
- [ ] `refreshApex` called after imperative DML in relatedRecordsList
- [ ] LMS Message Channel created in `messageChannels/`
- [ ] `accountActions` publishes to LMS on sync completion
- [ ] `relatedRecordsList` subscribes to LMS and refreshes on `REFRESH_CONTACTS`
- [ ] `disconnectedCallback` unsubscribes from LMS
- [ ] Jest tests cover: loading state, data render, error state, button click, mock Apex success/failure
- [ ] `afterEach` cleans up DOM

---

## PTA/SA Reflection

After this lab, you can speak to:
- Component design pattern: each component has one responsibility (display, list, actions)
- Why LMS instead of custom events: sibling components without common parent
- Why `refreshApex` vs `getRecordNotifyChange`: custom Apex wire vs LDS wire adapter
- Jest value: catches the "loading state missing" and "error not handled" bugs before production
