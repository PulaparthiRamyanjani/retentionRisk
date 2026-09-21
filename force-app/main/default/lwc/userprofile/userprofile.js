import { LightningElement, track, api } from 'lwc';
import getUserProfile from '@salesforce/apex/UserProfileController.getUserProfile'; // Import the Apex method

export default class UserProfileViewer extends LightningElement {
    @track username = ''; 
    @track userProfile = {}; 
    @track loading = false; 
    @track error; 

    handleInputChange(event) {
        this.username = event.target.value;
    }

    handleFetchUserProfile() {
        if (this.username) {
            this.loading = true;
            this.error = undefined; // Clear any previous errors

            getUserProfile({ username: this.username })
                .then(result => {
                    this.userProfile = result;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error.body.message;
                    this.userProfile = {}; // Clear user profile
                    this.loading = false;
                });
        }
    }
}