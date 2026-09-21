import { LightningElement, wire } from 'lwc';
import getAllObjectNames from '@salesforce/apex/ObjectController.getAllObjectNames'; // Importing the Apex method
 
export default class ObjectList extends LightningElement {
    // Use @wire to call the Apex method and store the result in the 'objects' property
    @wire(getAllObjectNames)
    objects;
}