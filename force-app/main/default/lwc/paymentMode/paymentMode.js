import { LightningElement, track } from 'lwc';
import createPayment from '@salesforce/apex/PayPalAPI.createPayment';
 
export default class PaymentMode extends LightningElement {
    @track selectedPaymentMethod;
    @track showPayPalButton = false;
    @track paymentStatus = '';
   
    paymentOptions = [
        { label: 'Debit Card', value: 'Debit Card' },
        { label: 'PayPal', value: 'PayPal' },
        { label: 'Paytm', value: 'Paytm' },
        { label: 'Cash on Delivery', value: 'Cash on Delivery' }
    ];
 
    handlePaymentMethodChange(event) {
        this.selectedPaymentMethod = event.detail.value;
        this.showPayPalButton = (this.selectedPaymentMethod === 'PayPal');
    }
 
    handlePayWithPayPal() {
        // Set the payment amount and currency (replace with actual values as needed)
        const amount = 50.0; // Replace with the actual amount
        const currency = 'USD'; // Replace with the actual currency code
 
        createPayment({ amount: amount, currencyCode: currency })
            .then((approvalUrl) => {
                if (approvalUrl.startsWith('http')) {
                    // Redirect to PayPal approval URL for payment authorization
                    window.location.href = approvalUrl;
                } else {
                    // Display error message if approval URL is not returned
                    this.paymentStatus = approvalUrl || 'Payment failed due to missing approval URL.';
                }
            })
            .catch((error) => {
                this.paymentStatus = 'Error: ' + (error.body ? error.body.message : 'An unexpected error occurred');
                console.error('Payment error: ', error);
            });
    }
}