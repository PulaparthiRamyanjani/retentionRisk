import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import addToCart from '@salesforce/apex/NewCartController.addToCart';
import getAllProducts from '@salesforce/apex/NewProductListController.getAllProducts';
import getCategoriesAndSubcategories from '@salesforce/apex/NewProductCategoryController.getCategoriesAndSubcategories';
import getProductsByCategory from '@salesforce/apex/NewProductCategoryController.getProductsByCategory';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ProductCategoryPage extends NavigationMixin(LightningElement) {
    categories;
    selectedCategory;
    @track products ;

    // Fetch categories using wire service
    @wire(getCategoriesAndSubcategories)
    wiredCategories({ error, data }) {
        if (data) {
            // Prepare the categories and their subcategories
            this.categories = data.map(parentCategory => ({
                ...parentCategory,
                subcategories: data.filter(sub => sub.ParentCategory__c === parentCategory.Id)
            }));
        } else if (error) {
            console.error('Error fetching categories: ', error);
        }
    }

    // Handle category click (either parent or subcategory)
    handleCategoryClick(event) {
        const categoryId = event.target.dataset.id;
        this.selectedCategory = categoryId;
        this.fetchProducts(categoryId);
    }

    
    fetchProducts(categoryId) {
        getProductsByCategory({ categoryId })
            .then(result => {
                this.products = result.map(product => ({
                    ...product,
                    stockStatus: product.RemainingQuantity__c > 0 ? 'In Stock' : 'Out of Stock',
                    quantity: 1 // Default quantity for each product
                }));
            })
            .catch(error => {
                console.error('Error fetching products: ', error);
            });
    }

    // Other methods like handleProductClick and handleAddToCart remain unchanged
        // Handle product click
    handleProductClick(event) {
        console.log('clicked');
        const productId = event.target.dataset.id;
        console.log(productId);
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url:'/product-list?productId=' +productId
        },
        
    });
    }

    @wire(getAllProducts)
    wiredProducts({ error, data }) {
        if (data) {
            // Add stock status and quantity to each product
            this.products = data.map(product => ({
                ...product,
                stockStatus: product.RemainingQuantity__c > 0 ? 'Out of Stock' : 'In Stock',
                quantity: 1 // Default quantity for each product
            }));
        } else if (error) {
            console.error('Error fetching products: ', error);
        }
    }


    // Placeholder for Add to Cart functionality
    handleAddToCart(event) {
        const productId = event.target.dataset.id;
        console.log('Product Id: ', productId);
        const product = this.products.find(p => p.productId === productId);

        // Check if product is out of stock
        if (product.RemainingQuantity__c <= 0) {
            this.showToast('Error', 'Product is out of stock', 'error');
            return;
        }

        // If in stock, proceed with adding to cart
        addToCart({ productId: product.productId, quantity: product.quantity })
            .then(() => {
                this.showToast('Success', 'Product added to cart successfully', 'success');
            })
            .catch(error => {
                console.error('Error adding product to cart: ', error);
                this.showToast('Error', 'Error adding product to cart', 'error');
            });
    }
    handleGoToCart(){
        console.log('clicked');
        this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url:'/cart' // Make sure the component is exposed
        },
        
    });
}
    showToast(title,message,variant){
        const event = new ShowToastEvent (
            { title,message,variant});
            this.dispatchEvent(event);
    }
}