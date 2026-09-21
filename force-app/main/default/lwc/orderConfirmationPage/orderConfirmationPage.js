import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getOrderDetails from '@salesforce/apex/NewOrderController.getOrderDetails';
import reOrder from '@salesforce/apex/NewOrderController.reOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class OrderConfirmationPage extends NavigationMixin(LightningElement) {
    @track order;
    @track orderLineItems=[];
    @wire(CurrentPageReference)
    pageRef;

    // Get the Order ID from the page URL
    get orderId() {
        // Try to get the orderId from the URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdFromUrl = urlParams.get('orderId');
    
        // If orderId is available in the URL, use it
        if (orderIdFromUrl) {
            // Store it in sessionStorage for future pages
            sessionStorage.setItem('orderId', orderIdFromUrl);
            console.log('Order ID stored in sessionStorage:', orderIdFromUrl);
            return orderIdFromUrl;
        }
    
        // Otherwise, retrieve it from sessionStorage
        return sessionStorage.getItem('orderId') || '';
    }
    
    get isInProcess(){
        return this.order && this.order.Status__c === 'In Process';
    }

    // Fetch the order details from Apex
    connectedCallback() {
        if (this.orderId) {
            getOrderDetails({ orderId: this.orderId })
                .then(result => {
                    this.order = result.order;
                    this.orderLineItems = result.orderLineItems;
                    console.log('Fetched Order:', this.order); // Check order data
                    console.log('Order Status:', this.order.Status__c);
                })
                .catch(error => {
                    console.error('Error fetching order details: ', error);
                });
        }
    }
    handleCancelOrder() {
        // cancelOrder({ orderId: this.order.Id })
        //     .then(() => {
        //         this.showToast('Success', 'Order cancelled successfully!', 'success');
        //         // Update the order status to reflect the cancellation
        //         this.order.Status__c = 'Cancelled';
        //     })
        //     .catch(error => {
        //         console.error('Error cancelling order: ', error);
        //         this.showToast('Error', 'Error cancelling order', 'error');
        //     });
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/cancelorder?orderId=' 
            }
        });
    }

    handleReOrder() {
        reOrder({ orderId: this.order.Id })
            .then(() => {
                this.showToast('Success', 'Products added to your cart!', 'success');
            })
            .catch(error => {
                console.error('Error re-ordering products: ', error);
                this.showToast('Error', 'Error re-ordering products', 'error');
            });
    }

    // Utility function to show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }

}