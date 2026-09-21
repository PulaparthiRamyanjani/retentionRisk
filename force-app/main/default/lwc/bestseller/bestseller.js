import { LightningElement, wire } from 'lwc';
import getBestSellers from '@salesforce/apex/NewProductController.getBestSellers';

export default class BestSellers extends LightningElement {
    bestSellers = [];

    @wire(getBestSellers)
    wiredBestSellers({ error, data }) {
        if (data) {
            this.bestSellers = data;
        } else if (error) {
            console.error('Error fetching best sellers:', error);
        }
    }
    
}