import { LightningElement, track } from 'lwc';
import CALCULATOR from '@salesforce/label/c.Calculator';  // Import custom label

export default class Calculator extends LightningElement {
    @track currentTime;
    @track displayValue = '0'; // Default display value
    buttons = ['C', 'AC', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']; // Calculator buttons

    // Assign custom label to an object for easy referencing in the HTML
    label = {
        calculator: CALCULATOR  // Assign custom label for "Calculator"
    };

    connectedCallback() {
        this.showCurrentTime();
        // Update time every second
        setInterval(() => this.showCurrentTime(), 1000);
    }

    showCurrentTime() {
        const date = new Date();
        // Display current time
        this.currentTime = date.toLocaleTimeString();
    }

    handleButtonClick(event) {
        const buttonValue = event.target.innerText;

        if (buttonValue === '=') {
            // Evaluate the expression and update the display
            try {
                this.displayValue = eval(this.displayValue).toString(); // Warning: eval can be risky; consider a safer approach for production.
            } catch (error) {
                this.displayValue = 'Error';
            }
        } else if (buttonValue === 'C') {
            this.displayValue = this.displayValue.slice(0, -1); // Clear last character
            if (this.displayValue === '') {
                this.displayValue = '0'; // Reset to zero if empty
            }
        } else if (buttonValue === 'AC') {
            this.displayValue = '0'; // Clear display
        } else {
            // Append button value to display
            this.displayValue = this.displayValue === '0' ? buttonValue : this.displayValue + buttonValue;
        }
    }

    handleLabelChange(event) {
        this.label.calculator = event.target.value; // Update the custom label with the input value
    }
}