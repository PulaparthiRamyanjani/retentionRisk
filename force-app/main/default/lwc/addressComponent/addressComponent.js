import { LightningElement, track, wire } from 'lwc';
import getOrderAddress from '@salesforce/apex/OpenAddressController.getOrderAddress';
import updateOrderAddress from '@salesforce/apex/OpenAddressController.updateOrderAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class OrderAddressComponent extends LightningElement {
    @track shippingAddress = '';
    @track billingAddress = '';
    @track orderId;
 
    // Fetch the existing order record (no parameters needed as OwnerId is hardcoded in Apex)
    @wire(getOrderAddress)
    wiredOrder({ data, error }) {
        if (data) {
            this.shippingAddress = data.Shipping_Address__c || '';
            this.billingAddress = data.Billing_Address__c || '';
            this.orderId = data.Id; // Store the order Id for future updates
        } else if (error) {
            console.error('Error retrieving order addresses', error);
        }
    }
 
    // Handle input changes for the addresses
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'shippingAddress') {
            this.shippingAddress = event.target.value;
        } else if (field === 'billingAddress') {
            this.billingAddress = event.target.value;
        }
    }
 
    // Handle save action
    handleSave() {
        updateOrderAddress({
            orderId: this.orderId,
            shippingAddress: this.shippingAddress,
            billingAddress: this.billingAddress
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Addresses updated successfully!',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            console.error('Error updating addresses', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating address',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}