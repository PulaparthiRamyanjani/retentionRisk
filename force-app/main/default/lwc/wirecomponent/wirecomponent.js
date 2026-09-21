import { LightningElement, wire } from 'lwc';
import accrecords from '@salesforce/apex/AccountRecords.getAccounts';

export default class AccountTable extends LightningElement {
    @wire(accrecords)
    accounts;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Industry', fieldName: 'Industry' },
        { label: 'Phone', fieldName: 'Phone' }
    ];
}