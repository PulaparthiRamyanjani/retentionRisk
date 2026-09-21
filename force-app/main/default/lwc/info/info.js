import { LightningElement } from 'lwc';
 
export default class InputComponent extends LightningElement {
    firstName = '';  
    middleName = ''; 
    lastName = '';   
    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleMiddleNameChange(event) {
        this.middleName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
    get fullName() {
        return `${this.firstName} ${this.middleName} ${this.lastName}`.trim(); 
    }
}