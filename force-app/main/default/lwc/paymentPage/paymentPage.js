import { LightningElement } from 'lwc';
import createPayment  from '@salesforce/apex/NewPayPalApi.createPayment';
import capturePayment  from '@salesforce/apex/NewPayPalApi.capturePayment';
// import createStripePayment  from '@salesforce/apex/StripeIntegration.createPayment';
export default class PaymentPage extends LightningElement {
    isPayPalProcessing = false;

    // Credit Card Payment
    handleCreditCardPayment() {
        // Redirect to or initialize Credit Card payment functionality
        console.log('Processing Credit Card Payment...');
        // Add your code for handling credit card payments here
    }

    // Stripe Payment
    handleStripePayment() {
        createStripePayment({ currency: 'usd', amount: 100.00, description: 'Test Payment', sourceToken: 'tok_visa' })
    .then(response => {
        console.log('Stripe Payment Response:', response);
    })
    .catch(error => {
        console.log("Eroro", error);
        console.error('Error in payment:', error);
    });
       
}


handlePayPalPayment() {
    console.log('Processing PayPal Payment...');
    this.isPayPalProcessing = true;

    // Call Apex to create the PayPal payment and get the approval URL and payment ID
    createPayment({ amount: 10.00, currencyCode: 'USD' })
        .then(result => {
            const approvalUrl = result.approvalUrl;
            const paymentId = result.paymentId;

            if (approvalUrl) {
                // Redirect to PayPal for payment approval
                window.location.href = approvalUrl;
            } else {
                console.error('Error: Approval URL not returned from PayPal');
                this.isPayPalProcessing = false;
            }
        })
        .catch(error => {
            console.log('Error creating PayPal payment:', error);
            this.isPayPalProcessing = false;
            this.showToast('Error', 'Failed to initiate PayPal payment.', 'error');
        });
}

connectedCallback() {
    // Extract payerId and paymentId from URL parameters after approval
    const urlParams = new URLSearchParams(window.location.search);
    const payerId = urlParams.get('PayerID');
    const paymentId = urlParams.get('paymentId'); 

    if (payerId && paymentId) {
        this.capturePayment(paymentId, "PUP87RBJV8HPU");
    }
}

capturePayment(paymentId, payerId) {
    // Call Apex to capture the payment after the buyer's approval
    capturePayment({ paymentId, payerId })
        .then(result => {
            if (result.includes('Payment Captured Successfully')) {
                console.log(result); // Log the success message
                this.showToast('Success', result, 'success');
                this.isPayPalProcessing = false;
            } else {
                console.error('Payment capture failed:', result);
                this.showToast('Error', result, 'error');
                this.isPayPalProcessing = false;
            }
        })
        .catch(error => {
            console.error('Error capturing PayPal payment:', error);
            this.showToast('Error', 'Payment capture failed.', 'error');
            this.isPayPalProcessing = false;
        });
}

  
    
    

    // Paytm Payment
    handlePaytmPayment() {
        console.log('Processing Paytm Payment...');
        // Add your code for handling Paytm payments here
    }

    // Cash on Delivery Payment
    handleCashOnDelivery() {
        console.log('Processing Cash on Delivery...');
        // Add your code for handling Cash on Delivery here
    }
}