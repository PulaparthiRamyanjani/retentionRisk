import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'; // Import NavigationMixin
import getProducts from '@salesforce/apex/ProductListController.getProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addToCart from '@salesforce/apex/AddToCartController.addToCart';
 
export default class ProductList extends NavigationMixin(LightningElement) {
    @track products = [];  // Stores the list of products from Apex
 
    // Wire the Apex method to fetch products
    @wire(getProducts)
    wiredProducts({ error, data }) {
    if (data) {
        this.products = data.map(product => ({
            ...product,
            stockStatus: product.inStock ? 'In Stock' : 'Out of Stock',
            quantity: 1,
            productImageId: product.productImageId // Ensure this ID is included from Apex
        }));
        console.log('Products array:', JSON.stringify(this.products));// Log products to ensure IDs are present
    } else if (error) {
        console.error('Error retrieving products:', error);
    }
   }
 
   handleProductClick(event) {
    console.log('Dataset:', event.currentTarget.dataset); // Log the entire dataset object
    const productImageId = event.currentTarget.dataset.productImageId;
    console.log('Product Image ID:', productImageId);
   
    if (productImageId) {
        console.log('Navigating to Product Details with ID:', productImageId); // Log the ID being passed
        console.log('State to navigate:', JSON.stringify({
            productImageId: productImageId // This should hold the correct ID
        }));
        console.log('Navigating to Product Details with ID:', productImageId)
        sessionStorage.setItem('productImageId', productImageId);
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',  
            attributes: {
                apiName: 'Product_Details' // Ensure this matches your tab name
            },
           
        });
       
        console.log('Navigation to productDetails component initiated.');
    } else {
        console.error('Product Image ID is undefined.');
    }
}
 
 
 
    // Increase the quantity of the product
    increaseQuantity(event) {
        const productId = event.target.dataset.id; // Ensure this is correctly set in HTML
        const product = this.products.find(prod => prod.productId === productId);
        if (product) {
            product.quantity += 1; // Increment quantity
        }
    }
 
    // Decrease the quantity of the product (but no less than 1)
    decreaseQuantity(event) {
        const productId = event.target.dataset.id; // Ensure this is correctly set in HTML
        const product = this.products.find(prod => prod.productId === productId);
        if (product && product.quantity > 1) {
            product.quantity -= 1; // Decrement quantity
        }
    }
 
    // Handles adding the product to the cart (logic to be implemented)
    addToCart(event) {
        const productId = event.target.dataset.id;  // Get the product ID from the button dataset
        const product = this.products.find(prod => prod.productId === productId);  // Find the product in the list
        const quantity = product ? product.quantity : 0;  // Get the quantity for the specific product
 
        if (productId && quantity > 0) {
            // Call Apex method to add product to cart
            addToCart({ productId: productId, quantity: quantity })
                .then(() => {
                    // Show success toast notification
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Product added to cart successfully!',
                            variant: 'success'
                        })
                    );
                })
                .catch(error => {
                    console.error('Error adding product to cart:', error);
                    // Show error toast notification
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Failed to add product to cart.',
                            variant: 'error'
                        })
                    );
                });
        } else {
            // Handle invalid quantity or missing productId
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Invalid product or quantity.',
                    variant: 'error'
                })
            );
        }
    }
}