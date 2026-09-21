import { LightningElement, api, track } from 'lwc';
import cancelOrder from '@salesforce/apex/NewOrderController.cancelOrder';
import getOrderDetails from '@salesforce/apex/NewOrderController.getOrderDetails';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class cancelOrderPage extends NavigationMixin(LightningElement) {
    @track errorMessage = '';
    @track order;
    @track orderLineItems = [];

   
    get orderId() {
        const orderId = sessionStorage.getItem('orderId');
        console.log('Retrieved Order ID from sessionStorage:', orderId);  
        return orderId;
    }

    
    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/order-confirmation' 
            }
        });
    }

    connectedCallback() {
        if (this.orderId) {
            getOrderDetails({ orderId: this.orderId })
                .then(result => {
                    this.order = result.order;
                    this.orderLineItems = result.orderLineItems;
                    console.log('Fetched Order:', this.order); 
                    console.log('Order Status:', this.order.Status__c);
                })
                .catch(error => {
                    console.error('Error fetching order details: ', error);
                    this.showToast('Error', 'Error fetching order details', 'error');
                });
        } else {
            console.error('Order ID not found');
            this.showToast('Error', 'Order ID not found', 'error');
        }
    }

 
    handleContinue() {
        
        if (!this.order || !this.order.Id) {
            this.showToast('Error', 'Order details not loaded yet. Please try again.', 'error');
            return;
        }

        cancelOrder({ orderId: this.order.Id })
            .then(() => {
                this.showToast('Success', 'Order cancelled successfully!', 'success');
              
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: '/products' 
                    }
                });
            })
            .catch(error => {
                console.error('Error cancelling order: ', error);
                this.showToast('Error', 'Error cancelling order', 'error');
            });
    }


    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}