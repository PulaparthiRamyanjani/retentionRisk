import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import cancelOrder from '@salesforce/apex/OrderDetailController.cancelOrder'; // Apex method for canceling the order
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import the toast event
 
export default class CancelOrder extends NavigationMixin(LightningElement) {
    @track orderId;
    @track errorMessage = '';
 
    // Retrieve the orderId from sessionStorage when the component is initialized
    connectedCallback() {
        this.orderId = sessionStorage.getItem('c__orderId');
       
        if (!this.orderId) {
            this.errorMessage = 'Order ID not found. Please go back and select an order.';
        }
    }
 
    // Handle navigation back to Order Details page
    handleBackToOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Order_Details' // Replace with your actual OrderDetails app page API name
            },
            state: {
                c__orderId: this.orderId // Pass the orderId back to the Order Details page
            }
        });
    }
 
    // Handle order cancellation logic
    handleConfirmCancelOrder() {
        if (!this.orderId) {
            this.errorMessage = 'Order ID is missing. Unable to cancel the order.';
            return;
        }
 
        cancelOrder({ orderId: this.orderId })
            .then(() => {
                // Show a success toast message
                this.showToast('Success', 'Order has been cancelled successfully', 'success');
 
                // Navigate back to the Order Details page
                this[NavigationMixin.Navigate]({
                    type: 'standard__navItemPage',
                    attributes: {
                        apiName: 'Order_Details' // Replace with your actual OrderDetails app page API name
                    },
                    state: {
                        c__orderId: this.orderId // Navigate back to Order Details page after cancellation
                    }
                });
            })
            .catch(error => {
                this.errorMessage = 'Error canceling the order: ' + error.body.message;
            });
    }
 
    // Show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}