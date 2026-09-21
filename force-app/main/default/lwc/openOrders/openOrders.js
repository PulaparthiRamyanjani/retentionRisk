import { LightningElement, wire } from 'lwc';
import getOpenOrders from '@salesforce/apex/OrderController.getOpenOrders';
 
export default class OpenOrders extends LightningElement {
    openOrders;
    error;
   
    // Use the OwnerId for testing (replace with the actual Owner ID)
    ownerId = '005GC00000lBgEIYA0'; // Replace with a valid Owner ID
 
    @wire(getOpenOrders, { ownerId: '005GC00000lBgEIYA0' })
    wiredOpenOrders({ error, data }) {
        if (data) {
            this.openOrders = data;
            console.log('Open Orders:', JSON.stringify(this.openOrders)); // Log the data
        } else if (error) {
            this.error = error;
            console.error('Error fetching open orders:', error);
        }
    }
}