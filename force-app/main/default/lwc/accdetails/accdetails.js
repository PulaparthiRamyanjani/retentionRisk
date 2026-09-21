import { LightningElement, wire } from 'lwc';
import getFilteredAccounts from '@salesforce/apex/AccountController.getFilteredAccounts';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry' }, // Example additional field
    { label: 'Phone', fieldName: 'Phone' } // Example additional field
];

export default class AccountList extends LightningElement {
    columns = COLUMNS; // Set the columns for the datatable

    @wire(getFilteredAccounts) accounts;

    get hasAccounts() {
        return this.accounts.data && this.accounts.data.length > 0;
    }
}