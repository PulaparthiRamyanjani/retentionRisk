import { LightningElement, api, track } from 'lwc';
import applyCoupon from '@salesforce/apex/ApplyCouponController.applyCoupon';
 
export default class ApplyCouponComponent extends LightningElement {
    @api cartId; // Cart Id passed from the CartDetails component
    @track couponCode = ''; // Coupon code entered by the user
    @track couponMessage; // Message to show coupon application result
 
    handleCouponCodeChange(event) {
        this.couponCode = event.target.value; // Store the entered coupon code
    }
 
    applyCoupon() {
        if (!this.couponCode) {
            this.couponMessage = 'Please enter a coupon code';
            return;
        }
 
        // Call Apex to apply the coupon
        applyCoupon({ cartId: this.cartId, couponName: this.couponCode })
            .then(result => {
                // Coupon applied successfully, display a success message
                this.couponMessage = 'Coupon applied successfully!';
 
                // Dispatch a custom event to update the cart total in CartDetails component
                this.dispatchEvent(new CustomEvent('cartupdate', {
                    detail: { totalAmount: result.totalAmount }
                }));
            })
            .catch(error => {
                // Display the error message if the coupon application failed
                this.couponMessage = error.body.message;
            });
    }
}