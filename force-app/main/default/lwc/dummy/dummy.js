import { LightningElement, track } from 'lwc';
import CALCULATOR from '@salesforce/label/c.Calculator';  

export default class Calculator extends LightningElement {
    @track currentTime;
    @track displayValue = '0';
    
    // Define buttons with their corresponding classes
    buttonsWithClasses = [
        { label: 'AC', class: 'calc-button operation-button' },
        { label: 'C', class: 'calc-button operation-button' },
        { label: '%', class: 'calc-button operation-button' },
        { label: '/', class: 'calc-button operation-button' },
        { label: '7', class: 'calc-button white-button' },
        { label: '8', class: 'calc-button white-button' },
        { label: '9', class: 'calc-button white-button' },
        { label: '*', class: 'calc-button operation-button' },
        { label: '4', class: 'calc-button white-button' },
        { label: '5', class: 'calc-button white-button' },
        { label: '6', class: 'calc-button white-button' },
        { label: '-', class: 'calc-button operation-button' },
        { label: '1', class: 'calc-button white-button' },
        { label: '2', class: 'calc-button white-button' },
        { label: '3', class: 'calc-button white-button' },
        { label: '+', class: 'calc-button operation-button' },
        { label: '0', class: 'calc-button white-button' },
        { label: '00', class: 'calc-button white-button' },
        { label: '.', class: 'calc-button white-button' },
        { label: '=', class: 'calc-button operation-button' },
    ];

    label = {
        calculator: CALCULATOR  
    };

    connectedCallback() {
        this.showCurrentTime();
        setInterval(() => this.showCurrentTime(), 1000);
    }

    showCurrentTime() {
        const date = new Date();
        this.currentTime = date.toLocaleTimeString();
    }
    
    handleButtonClick(event) {
        const buttonValue = event.target.innerText;

        if (buttonValue === '=') {
            try {
                this.displayValue = eval(this.displayValue).toString(); 
            } catch (error) {
                this.displayValue = 'Error';
            }
        } else if (buttonValue === 'C') {
            this.displayValue = this.displayValue.slice(0, -1); 
            if (this.displayValue === '') {
                this.displayValue = '0'; 
            }
        } else if (buttonValue === 'AC') {
            this.displayValue = '0'; 
        } else if (buttonValue === '%') {
            const value = parseFloat(this.displayValue);
            if (!isNaN(value)) {
                this.displayValue = (value / 100).toString(); 
            }
        } else {
            this.displayValue = this.displayValue === '0' ? buttonValue : this.displayValue + buttonValue;
        }
    }

    handleDotsClick() {
        console.log('Three dots clicked'); 
    }
    
    handleMinimizeClick() {
        console.log('Minimize clicked'); 
    }
    
    handleLabelChange(event) {
        this.label.calculator = event.target.value; 
    }
}