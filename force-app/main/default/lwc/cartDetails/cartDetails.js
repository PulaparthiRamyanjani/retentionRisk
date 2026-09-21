import { LightningElement, wire, track } from 'lwc';
import getCartItems from '@salesforce/apex/NewCartController.getCartItems';
import removeFromCart from '@salesforce/apex/NewCartController.removeFromCart';
import applyCoupon from '@salesforce/apex/NewCartController.applyCoupon';
import removeCoupon from '@salesforce/apex/NewCartController.removeCoupon';
import updateCartItemQuantity from '@salesforce/apex/NewCartController.updateCartItemQuantity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CartDetails extends NavigationMixin(LightningElement) {
    @track cartItems = [];
    @track totalAmount = 0;
    @track isEmptyCart = false;
    @track couponCode = '';
    @track cartId = '';
    @track discountedAmount = 0;
    @track grandTotal = 0;
    @track isCouponApplied = false; 



   
    @wire(getCartItems)
    wiredCartItems({ error, data }) {
       
        if (data) {
            console.log('Cart Items:', data);
            this.cartItems = data.cartItems || []; 
            this.cartId = data.cartId; 
            this.discountedAmount = data.discountedAmount || 0; 
            this.calculateTotal();
            this.isEmptyCart = this.cartItems.length === 0;
        } else if (error) {
            console.error('Error fetching cart items: ', error);
        }
    }

    
    calculateTotal() {
  
        if (!Array.isArray(this.cartItems || this.cartItems.length ===0)) {
            console.log('No items in the cart or cartItems is not an array.');
            return;
        }
        this.totalAmount = this.cartItems.reduce(
            (total, item) =>  {return total + (item.List_Price__c * item.Quantity__c)},
            0
        );

  
        this.discountedAmount = this.discountedAmount || 0;


        this.grandTotal = this.totalAmount - this.discountedAmount;

        console.log('Total amount calculated:', this.totalAmount);
        console.log('Discounted amount:', this.discountedAmount);
        
        console.log('Grant Total:', this.grandTotal);
    
    }


    removeFromCart(event) {
        const itemId = event.target.dataset.id;
     

        removeFromCart({ cartItemId: itemId })
            .then(() => {
                this.showToast('Success', 'Item removed from cart', 'success');
               
                return this.refreshCart();
            })
            .catch(error => {
                console.error('Error removing product from cart: ', error);
                this.showToast('Error', 'Error removing product from cart', 'error');
            });
    }

   
    increaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const cartItem = this.cartItems.find(item => item.Id === itemId);
        const updatedQuantity = cartItem.Quantity__c + 1;
        console.log('Increasing quantity for item:', itemId, 'to:', updatedQuantity);
        this.updatedQuantity(itemId, updatedQuantity);
    }

   
    decreaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const cartItem = this.cartItems.find(item => item.Id === itemId);
        const updatedQuantity = cartItem.Quantity__c - 1;
        if (updatedQuantity > 0) {
            console.log('Decreasing quantity for item:', itemId, 'to:', updatedQuantity);
            this.updatedQuantity(itemId, updatedQuantity);
        } else {
            console.log('Quantity cannot be decreased below 1 for item:', itemId);
        }
    }

    
    updatedQuantity(itemId, updatedQuantity) {
        console.log('Updating quantity for item:', itemId, 'to:', updatedQuantity);
        updateCartItemQuantity({ cartItemId: itemId, newQuantity: updatedQuantity })
            .then(() => {
                this.showToast('Success', 'Quantity updated successfully', 'success');
                console.log('Quantity updated successfully for item:', itemId);
                this.refreshCart();
            })
            .catch(error => {
                console.error('Error updating cart item quantity: ', error);
                this.showToast('Error', 'Error updating cart item quantity', 'error');
            });
    }

   
    refreshCart() {
       
        return getCartItems().then(data => {
            if (data && data.cartId) { 
                this.cartItems = data.cartItems || []; 
                this.cartId = data.cartId; 
                this.discountedAmount = data.discountedAmount || 0; 
                this.calculateTotal(); 
                this.isEmptyCart = this.cartItems.length === 0; 
                
            } else {
                console.error('No cart ID found in the response.');
                throw new Error('Cart data is invalid: No cartId found.');
            }
        }).catch(error => {
            console.error('Error refreshing cart:', error);
           
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

    
    handleCheckout() {
  
        if (this.cartId) { 
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/checkout'
                }
            });
        } else {
            this.showToast('Error', 'No active cart found for checkout', 'error');
        }
    }
    

    
    handleCouponChange(event) {
        this.couponCode = event.target.value;
        
    }

    applyCoupons() {
        if (this.couponCode.trim() === '') {
            this.showToast('Error', 'Please enter a coupon code', 'error');
            console.log('No coupon code entered');
            return;
        }
    
        console.log(this.couponCode,this.cartId);
        applyCoupon({ couponCode: this.couponCode, cartId: this.cartId })
            .then(result => {
                this.showToast('Success', result, 'success');
                
                this.refreshCart();
                this.isCouponApplied = true;
            })
            .catch(error => {
                console.error('Error applying coupon:', JSON.stringify(error)); 
                const errorMessage = error.body && error.body.message ? error.body.message : 'Unknown error';
             
                this.showToast('Error', 'Invalid or expired coupon.', 'error');
            });
    }

   
    removeCoupon() {
        if (!this.cartId) {
            this.showToast('Error', 'No active cart found to remove coupon from', 'error');
            
            return;
        }

        
        removeCoupon({ cartId: this.cartId })
            .then(result => {
                this.showToast('Success', result, 'success');
                
                this.refreshCart();
                    this.isCouponApplied = false;  
            })
            .catch(error => {
                console.error('Error removing coupon:', error);
                this.showToast('Error', 'Error removing coupon: ' + error.body.message, 'error');
            });
    }
}