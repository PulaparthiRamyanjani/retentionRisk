import { LightningElement, wire, track } from 'lwc';
import getOpenCart from '@salesforce/apex/HomePageController.getOpenCart';
import getOpenOrders from '@salesforce/apex/HomePageController.getOpenOrders';
import getRecentOrders from '@salesforce/apex/HomePageController.getRecentOrders';
import { NavigationMixin } from 'lightning/navigation';
 
export default class HomePage extends NavigationMixin(LightningElement) {
    @track openCart;
    @track openOrder;
    @track recentOrders;
 
    
    columns = [
        { label: 'Order No', fieldName: 'Name' },  
        { label: 'Order Amount', fieldName: 'Total__c', type: 'currency' },  
        { label: 'Shipping Address', fieldName: 'ShippingAddress__c' },  
        { label: 'Payment Status', fieldName: 'Payment_Status__c' } , 
        {label:'Status', fieldName:'Status__c'}
    ];
 
    @wire(getOpenCart)
    wiredOpenCart({ error, data }) {
        if (data) {
            this.openCart = data;
        } else if (error) {
            console.error('Error fetching open cart:', error);
        }
    }
 
    @wire(getOpenOrders)
    wiredOpenOrder({ error, data }) {
        if (data) {
            this.openOrder = data[0]; 
        } else if (error) {
            console.error('Error fetching open order:', error);
        }
    }
 
    @wire(getRecentOrders)
    wiredRecentOrders({ error, data }) {
        if (data) {
            console.log('Recent Orders Data:', data); 
            this.recentOrders = data;
        } else if (error) {
            console.error('Error fetching recent orders:', error);
        }
    }
 
    navigateToProductList() {
        this[NavigationMixin.Navigate]( {
            type: 'standard__webPage',
            attributes: {
                url: '/products' 
            }
        });
    }
}