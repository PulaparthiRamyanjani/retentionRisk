import { LightningElement, track } from 'lwc';
 
export default class ColorChangerButton extends LightningElement {
    @track isClicked = false;
 
    get buttonClass() {
        return this.isClicked ? 'slds-button slds-button_success' : 'slds-button slds-button_brand';
    }
 
    handleClick() {
        this.isClicked = !this.isClicked;
    }
}