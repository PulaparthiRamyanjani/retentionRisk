import { LightningElement, track, wire } from 'lwc';
import getCartItems from '@salesforce/apex/NewCartController.getCartItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CheckoutPage extends LightningElement {
    @track cartItems = [];
    @track totalAmount = 0;
    @track shippingAddress = '';
    @track billingAddress = '';
    @track discountedAmount = 0;
    @track grandTotal = 0;

    // Wire to fetch cart items
    @wire(getCartItems)
    wiredCartItems({ error, data }) {
        if (data) {
            this.cartItems = data.cartItems || []; 
            this.cartId = data.cartId; 
            this.discountedAmount = data.discountedAmount || 0; 
            this.calculateTotal();
        } else if (error) {
            console.error('Error fetching cart items: ', error);
        }
    }

    // Calculate totals for cart items
    calculateTotal() {
        this.totalAmount = this.cartItems.reduce((total, item) => total + (item.List_Price__c * item.Quantity__c), 0);
        this.discountedAmount = this.discountedAmount || 0;
        this.grandTotal = this.totalAmount - this.discountedAmount;
    }

    // Handle input change for Shipping and Billing Addresses
    handleInputChange(event) {
        const field = event.target.label.toLowerCase();
        if (field.includes('shipping')) {
            this.shippingAddress = event.target.value;
        } else if (field.includes('billing')) {
            this.billingAddress = event.target.value;
        }
    }

    // Utility to display toast notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}