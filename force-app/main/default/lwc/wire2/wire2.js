import { LightningElement, wire, api } from 'lwc';
import getContactsByAccountId from '@salesforce/apex/ContactController.getContactsByAccountId';

export default class RelatedContacts extends LightningElement {
    @api recordId; // This will get the Account ID from the Record Page

    @wire(getContactsByAccountId, { accountId: '$recordId' })
    contacts;

    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' }
    ];
}