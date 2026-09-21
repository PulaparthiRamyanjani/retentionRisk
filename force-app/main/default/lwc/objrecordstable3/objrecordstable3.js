import { LightningElement, track, wire } from 'lwc';
import getRecentRecords from '@salesforce/apex/RecordDataController.getRecentRecords';
 
export default class RecordTableComponent extends LightningElement {
    @track recordsMap = {};
    @track caseColumns = [
        { label: "Case Number", fieldName: "CaseNumber", type: "text" },
        { label: "Subject", fieldName: "Subject", type: "text" },
        { label: "Last Modified Date", fieldName: "LastModifiedDate", type: "date" }
    ];
    @track contactColumns = [
        { label: "Name", fieldName: "Name", type: "text" },
        { label: "Email", fieldName: "Email", type: "email" },
        { label: "Last Modified Date", fieldName: "LastModifiedDate", type: "date" }
    ];
    @track opportunityColumns = [
        { label: "Name", fieldName: "Name", type: "text" },
        { label: "Stage", fieldName: "StageName", type: "text" },
        { label: "Last Modified Date", fieldName: "LastModifiedDate", type: "date" }
    ];
 
    @wire(getRecentRecords)
    wiredRecords({ data, error }) {
        if (data) {
            this.recordsMap = data;
        } else if (error) {
            console.error('Error fetching records', error);
        }
    }
}