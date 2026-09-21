import { LightningElement, wire } from 'lwc';
import getRecentOrders from '@salesforce/apex/RecentOrdersController.getRecentOrders';
 
export default class RecentOrders extends LightningElement {
    recentOrders;
 
    // Use the OwnerId for testing (replace with the actual Owner ID)
    ownerId = '005GC00000lBgEIYA0'; // Replace with a valid Owner ID
 
    @wire(getRecentOrders, { ownerId: '$ownerId' }) // Passing ownerId
    wiredRecentOrders({ error, data }) {
        if (data) {
            this.recentOrders = data;
            console.log('Recent Orders:', this.recentOrders); // Log the data
        } else if (error) {
            console.error('Error fetching recent orders:', error);
        }
    }
}