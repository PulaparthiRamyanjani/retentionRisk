import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Navigation extends NavigationMixin(LightningElement) {

    // Navigate to the Home page
    navigateHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/'  // Home URL
            }
        });
    }

    // Navigate to the Products page
    navigateProducts() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/products'  // Products URL
            }
        });
    }

    // Navigate to the Cart page
    navigateCart() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/cart'  // Cart URL
            }
        });
    }

    // Navigate to the My Orders page
    navigateMyOrders() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/myorders'  // My Orders URL
            }
        });
    }
}