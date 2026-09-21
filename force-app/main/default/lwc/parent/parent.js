import { LightningElement, api } from 'lwc';

export default class ParentComponent extends LightningElement {
    childOneStatus = 'Deselected';
    childTwoStatus = 'Deselected';
    childThreeStatus = 'Deselected';

    handleChildToggle(event) {
        const { childName, selected } = event.detail;

        switch (childName) {
            case 'Child One':
                this.childOneStatus = selected ? 'Selected' : 'Deselected';
                break;
            case 'Child Two':
                this.childTwoStatus = selected ? 'Selected' : 'Deselected';
                break;
            case 'Child Three':
                this.childThreeStatus = selected ? 'Selected' : 'Deselected';
                break;
        }

        const selectedChildrenCount = this.calculateSelectedChildren();
        const parentEvent = new CustomEvent('parentupdate', {
            detail: { selectedChildrenCount }
        });
        this.dispatchEvent(parentEvent);
    }

    calculateSelectedChildren() {
        let count = 0;
        if (this.childOneStatus === 'Selected') count++;
        if (this.childTwoStatus === 'Selected') count++;
        if (this.childThreeStatus === 'Selected') count++;
        return count;
    }

    @api resetParent() {
        this.childOneStatus = 'Deselected';
        this.childTwoStatus = 'Deselected';
        this.childThreeStatus = 'Deselected';

        // Reset all child components
        const children = this.template.querySelectorAll('c-child');
        children.forEach(child => {
            child.resetChild(); // Call the reset method for each child component
        });
    }
}