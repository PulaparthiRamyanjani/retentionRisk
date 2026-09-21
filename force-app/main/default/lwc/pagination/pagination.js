import { LightningElement, api, track } from 'lwc';

export default class Pagination extends LightningElement {
    @api records = []; // List of all records to paginate
    @api pageSize = 10; // Default number of records per page
    @track paginatedRecords = []; // Records to display on the current page
    @track currentPage = 1;
    @track totalPages = 0;

    // Called when component initializes or when records change
    connectedCallback() {
        this.updatePagination();
    }

    // Update pagination whenever the records or page size changes
    updatePagination() {
        this.totalPages = Math.ceil(this.records.length / this.pageSize);
        this.setPageRecords();
    }

    // Set records for the current page
    setPageRecords() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedRecords = this.records.slice(startIndex, endIndex);
        this.dispatchEvent(new CustomEvent('paginationchange', {
            detail: { paginatedRecords: this.paginatedRecords }
        }));
    }

    // Handle page change
    handlePageChange(event) {
        const direction = event.target.dataset.direction;
        if (direction === 'next' && this.currentPage < this.totalPages) {
            this.currentPage++;
        } else if (direction === 'previous' && this.currentPage > 1) {
            this.currentPage--;
        }
        this.setPageRecords();
    }

    // Rendered callback to re-evaluate pagination when records change
    renderedCallback() {
        if (this.records.length && this.totalPages !== Math.ceil(this.records.length / this.pageSize)) {
            this.updatePagination();
        }
    }

    // Getters for enabling/disabling navigation buttons
    get isPreviousDisabled() {
        return this.currentPage <= 1;
    }

    get isNextDisabled() {
        return this.currentPage >= this.totalPages;
    }
}