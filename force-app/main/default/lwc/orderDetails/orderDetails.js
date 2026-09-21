import { LightningElement, track } from 'lwc';
import getOrderDetails from '@salesforce/apex/OrderDetailController.getOrderDetails';
import cancelOrder from '@salesforce/apex/OrderDetailController.cancelOrder';
import reorder from '@salesforce/apex/OrderDetailController.reorder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderDetail extends NavigationMixin(LightningElement) {
    @track orderDetails = {};
    @track error;

    // Columns for the datatable
    columns = [
        { label: 'Product Name', fieldName: 'productName' },
        { label: 'Quantity', fieldName: 'quantity', type: 'number' },
        { label: 'Unit Price', fieldName: 'unitPrice', type: 'currency' },
        { label: 'Total Price', fieldName: 'totalPrice', type: 'currency' }
    ];

    // Load order details on component initialization
    connectedCallback() {
        this.loadOrderDetails();
    }

    // Fetch order details from Apex
    loadOrderDetails() {
        getOrderDetails()
            .then(result => {
                this.orderDetails = result;
            })
            .catch(error => {
                this.error = error;
                this.showToast('Error', 'Error fetching order details', 'error');
            });
    }

    // Handle re-order functionality
    handleReOrder() {
        reorder({ orderId: this.orderDetails.Id })
            .then(() => {
                this.showToast('Success', 'Order has been re-ordered', 'success');
                this.navigateToOrderDetails();
            })
            .catch(error => {
                this.error = error;
                this.showToast('Error', 'Error re-ordering the order', 'error');
            });
    }

    // Navigate to the cancel order page
    handleCancelOrder() {
        this.navigateToCancelOrder();
    }

    // Navigate to the payment details page
    handleConfirmOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Payment_Details' // Replace with actual API name
            }
        });
    }

    // Navigate to order details
    navigateToOrderDetails() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.orderDetails.Id,
                objectApiName: 'Order1__c', // Replace with actual object API name
                actionName: 'view'
            }
        });
    }

    // Navigate to cancel order tab
    navigateToCancelOrder() {
        sessionStorage.setItem('c__orderId', this.orderDetails.Id);
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Cancel_Order' // Replace with actual API name
            }
        });
    }

    // Show toast notifications
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}