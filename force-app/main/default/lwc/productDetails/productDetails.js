import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductDetails from '@salesforce/apex/ProductDetailsController.getProductDetails';
import addProductToCart from '@salesforce/apex/ProductDetailsAddtoCart.addProductToCart';
 
export default class ProductDetails extends LightningElement {
    @track productImageId;
    @track product;
    @track error;
    @track quantity = 1; // Add the default quantity
 
    // Lifecycle hook to capture productImageId from session storage
    connectedCallback() {
        this.productImageId = sessionStorage.getItem('productImageId'); // Retrieve from session storage
        console.log('Captured productImageId from session storage:', this.productImageId);
 
        if (this.productImageId) {
            this.fetchProductDetails(); // Fetch product details if ID is present
        } else {
            console.error('No productImageId found!'); // Log error if ID is not found
        }
    }
 
    // Fetch product details from Apex
    fetchProductDetails() {
        getProductDetails({ productImageId: this.productImageId })
            .then(result => {
                this.product = result;
                console.log('Product details fetched:', this.product);
            })
            .catch(error => {
                this.error = error;
                console.error('Error fetching product details:', this.error);
            });
    }
 
    // Getter for stock status
    get stockStatus() {
        return this.product && this.product.inStock ? 'In Stock' : 'Out of Stock';
    }
 
    // Increase quantity handler
    increaseQuantity() {
        this.quantity += 1;
    }
 
    // Decrease quantity handler, ensuring it doesn't go below 1
    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity -= 1;
        }
    }
 
    // Add to Cart functionality
    addToCart() {
        addProductToCart({ productId: this.product.productId, quantity: this.quantity })
            .then(result => {
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: result,
                    variant: 'success'
                });
                this.dispatchEvent(event);
            })
            .catch(error => {
                // Log the error to the console for debugging
                console.error('Error adding product to cart:', error);
                console.log('Error details:', error); // Detailed logging
 
                // Show error toast notification
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error adding product to cart',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
    }
}