import { LightningElement, wire, track } from 'lwc';
import getAddresses from '@salesforce/apex/AddressController.getAddresses';
import updateAddress from '@salesforce/apex/AddressController.updateAddress';
import addAddress from '@salesforce/apex/AddressController.addAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCountryPicklistValues from '@salesforce/apex/AddressController.getCountryPicklistValues';
import deleteAddress from '@salesforce/apex/AddressController.deleteAddress';
import USER_ID from '@salesforce/user/Id'; // Import the logged-in user ID
 
export default class AddressList extends LightningElement {
    @track addresses = [];
    @track showEditModal = false;
    @track showAddModal = false;
    @track selectedAddress = {};
    @track countryOptions = [];
    @track selectedCountry = '';  // Store selected country
 
    @wire(getAddresses)
    wiredAddresses({ error, data }) {
        if (data) {
            this.addresses = data;
        } else if (error) {
            this.showToast('Error', 'Failed to fetch addresses', 'error');
        }
    }
 
    // Fetch picklist values for the Country__c field
    @wire(getCountryPicklistValues)
    wiredCountryPicklist({ error, data }) {
        if (data) {
            // Map the fetched data to be used in the dropdown
            this.countryOptions = data.map(option => ({
                label: option.label,
                value: option.value
            }));
        } else if (error) {
            this.showToast('Error', 'Failed to fetch country picklist values', 'error');
        }
    }
 
    get modalTitle() {
        return this.showAddModal ? 'Add New Address' : 'Edit Address';
    }
 
    handleAddNewAddress() {
        this.selectedAddress = {
            Name: '',
            Street__c: '',
            City__c: '',
            State__c: '',
            PostalCode__c: '',
            LandMark__c: '',
            Country__c: '', // Country is now a dropdown
            Contact: USER_ID // Set the logged-in user as the contact
        };
        this.showAddModal = true;
    }
 
    handleDelete(event) {
        const addressId = event.currentTarget.dataset.id;
        if (addressId) {
            deleteAddress({ addressId })
                .then(() => {
                    this.showToast('Success', 'Address deleted successfully', 'success');
                    this.loadAddresses();
                })
                .catch(error => {
                    console.error('Error deleting address:', error);
                    this.showToast('Error', 'Failed to delete address', 'error');
                });
        } else {
            console.error('Address ID is missing');
            this.showToast('Error', 'Invalid address ID', 'error');
        }
    }
   
   
   
 
    handleEdit(event) {
        const addressId = event.currentTarget.dataset.id;
        this.selectedAddress = { ...this.addresses.find(address => address.Id === addressId) };
        this.showEditModal = true;
    }
 
    closeModal() {
        this.showEditModal = false;
        this.showAddModal = false;
    }
 
    handleFieldChange(event) {
        const field = event.target.name;
        this.selectedAddress[field] = event.target.value;
    }
 
    handleCountryChange(event) {
        // Handle country change from the dropdown
        this.selectedCountry = event.target.value;
        this.selectedAddress.Country__c = this.selectedCountry;
    }
 
    handleSave() {
        const addressData = {
            Id: this.selectedAddress.Id,
            Name: this.selectedAddress.Name,
            Street__c: this.selectedAddress.Street__c,
            City__c: this.selectedAddress.City__c,
            State__c: this.selectedAddress.State__c,
            PostalCode__c: this.selectedAddress.PostalCode__c,
            Country__c: this.selectedAddress.Country__c,
            LandMark__c: this.selectedAddress.LandMark__c,
            Contact: USER_ID // Set logged-in user as contact
        };
 
        if (this.showAddModal) {
            addAddress({ address: addressData })
                .then(() => {
                    this.showToast('Success', 'Address added successfully', 'success');
                    this.showAddModal = false;
                    return this.loadAddresses();
                })
                .catch(error => {
                    console.error('Error adding address:', error.body ? error.body.message : error);
                    this.showToast('Error', 'Failed to add address: ' + (error.body ? error.body.message : 'Unknown error'), 'error');
                });
        } else if (this.showEditModal) {
            updateAddress({ address: addressData })
                .then(() => {
                    this.showToast('Success', 'Address updated successfully', 'success');
                    this.showEditModal = false;
                    return this.loadAddresses();
                })
                .catch(error => {
                    console.error('Error updating address:', error.body ? error.body.message : error);
                    this.showToast('Error', 'Failed to update address', 'error');
                });
        }
    }
 
    loadAddresses() {
        return getAddresses()
            .then((result) => {
                this.addresses = result;
            })
            .catch((error) => {
                console.error('Error loading addresses:', error);
                this.showToast('Error', 'Failed to refresh addresses', 'error');
            });
    }
 
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}