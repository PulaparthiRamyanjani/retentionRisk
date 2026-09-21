import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {
    @api childName;
    selected = false; // To track if the child is selected or deselected

    // Dynamically change the button label based on the selection state
    get buttonLabel() {
        return this.selected ? 'Deselect' : 'Select';
    }

    // Dynamically assign the button's class for changing colors
    get buttonClass() {
        return this.selected ? 'deselect' : 'select';
    }

    // Toggles the selection state and dispatches an event to the parent component
    handleToggle() {
        this.selected = !this.selected;

        // Dispatch custom event to notify parent of child toggle
        const event = new CustomEvent('childtoggle', {
            detail: {
                childName: this.childName,
                selected: this.selected
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    // Method to reset the child state (used by parent or grandparent to reset all children)
    @api resetChild() {
        this.selected = false;
    }
}