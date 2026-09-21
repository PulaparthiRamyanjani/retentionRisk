import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Homedesign extends NavigationMixin(LightningElement) {

    // Method to navigate to the products page
    navigateToProductList() {
        // Using NavigationMixin to navigate to the products page
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage', // Use 'standard__webPage' for custom URL navigation
            attributes: {
                url: '/products' // Relative URL of the products page
            }
        });
    }
}