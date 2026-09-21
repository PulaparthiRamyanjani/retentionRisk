import { LightningElement, track } from 'lwc';

export default class GrandParentComponent extends LightningElement {
    @track selectedChildrenCount = 0; // Ensure reactivity

    // Get the class for button based on count
    get buttonClass() {
        if (this.selectedChildrenCount > 0) {
            return 'full-select'; // Red button when any children are selected
        }
        return 'no-select'; // White button when no children are selected
    }
    

    handleParentUpdate(event) {
        this.selectedChildrenCount = event.detail.selectedChildrenCount;
    }

    resetAll() {
        this.selectedChildrenCount = 0;
        // Reset the parent component
        this.template.querySelector('c-parent').resetParent();
    }
}