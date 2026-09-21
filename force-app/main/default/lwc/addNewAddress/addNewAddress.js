import { LightningElement } from 'lwc';
 
export default class AddNewAddress extends LightningElement {
    handleSuccess() {
        // Dispatch event to notify parent component of new address addition
        this.dispatchEvent(new CustomEvent('addressadded'));
    }
}