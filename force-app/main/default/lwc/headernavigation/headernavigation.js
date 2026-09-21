import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HeaderNavigation extends NavigationMixin(LightningElement) {

    navigateToHome() {
        this.navigateToPage('/');
    }

    navigateToSkills() {
        this.navigateToPage('/skills');
    }

    navigateToCertifications() {
        this.navigateToPage('/certifications');
    }

    navigateToProjects() {
        this.navigateToPage('/projects');
    }

    navigateToPage(pageUrl) {
        // Use NavigationMixin to navigate to the specific page URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: pageUrl
            }
        });
    }
}