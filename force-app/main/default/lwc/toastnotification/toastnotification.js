import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactForm extends LightningElement {
    @track phoneNumber = '';
    @track email = '';

    handlePhoneNumberChange(event) {
        this.phoneNumber = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleSubmit() {
        // Validate Phone Number
        const phonePattern = /^[0-9]{10}$/; // Example pattern for 10-digit phone number
        if (!phonePattern.test(this.phoneNumber)) {
            this.showToast('Error', 'Invalid phone number format. Please enter a 10-digit number.', 'error');
            return;
        }

        // Validate Email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
        if (!emailPattern.test(this.email)) {
            this.showToast('Error', 'Invalid email format. Please enter a valid email address.', 'error');
            return;
        }

        // If validation passes
        this.showToast('Success', 'Record submitted successfully.', 'success');
        // Here you would typically handle the submission, e.g., call an Apex method to save the data
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}