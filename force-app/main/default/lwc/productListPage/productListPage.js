import { LightningElement, api, wire } from 'lwc';
import addToCart from '@salesforce/apex/NewCartController.addToCart';
import getProductDetailsWithImage from '@salesforce/apex/NewProductListController.getProductDetailsWithImage';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductDetails extends NavigationMixin(LightningElement) {
    @api productId; 
    product;
    error;
    quantity = 1;

    connectedCallback() {
        this.setProductIdFromUrl();
    }

    setProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const productIdFromUrl = urlParams.get('productId');

        if (productIdFromUrl) {
            sessionStorage.setItem('productId', productIdFromUrl);
            console.log('Product ID stored in sessionStorage:', productIdFromUrl);
            this.productId = productIdFromUrl;
        } else {
            this.productId = sessionStorage.getItem('productId') || '';
        }
    }

    @wire(getProductDetailsWithImage, { productId: '$productId' })
    wiredProduct({ error, data }) {
        console.log('Fetched Product ID:', this.productId);
        console.log('Data:', data);

        if (data) {
            this.product = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.product = undefined;
            this.showToast('Error', 'Failed to load product details', 'error');
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }

    handleGoToCart() {
        console.log('Navigating to Cart');
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/cart'
            },
        });
    }

    handleAddToCart() {
        if (!this.product) {
            this.showToast('Error', 'Product details are not loaded', 'error');
            return;
        }

        // Check if the product is in stock
        if (this.product.RemainingQuantity__c <= 0) {
            this.showToast('Error', 'Product is out of stock', 'error');
            return;
        }

        // Call Apex method to add to cart
        addToCart({ productId: this.product.productId, quantity: this.quantity })
            .then(() => {
                this.showToast('Success', 'Product added to cart successfully', 'success');
            })
            .catch(error => {
                console.error('Error adding product to cart: ', error);
                this.showToast('Error', 'Error adding product to cart', 'error');
            });
    }
}