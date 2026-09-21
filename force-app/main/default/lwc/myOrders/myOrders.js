import { LightningElement, track } from 'lwc';
import getOrders from '@salesforce/apex/NewOrderController.getOrders';
import reOrder from '@salesforce/apex/NewOrderController.reOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class MyOrders extends NavigationMixin(LightningElement) {
    @track orders = []; 
    @track filteredOrders = []; 
    @track paginatedOrders = []; 
    startDate;
    endDate;
    pageSize = 10; 
    currentPage = 1; 
    totalPages = 0;
    totalRecords = 0;



    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }
 
    connectedCallback() {
        this.loadOrders();
    }

  
    loadOrders() {
        getOrders()
        .then(result => {
            try {
                this.orders = result || [];
                this.filteredOrders = [...this.orders];
                this.totalRecords = this.filteredOrders.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                this.currentPage = 1; 
                this.updatePagination();
            } catch (error) {
                console.error('Error in processing orders:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            }
        })
        .catch(error => {
            console.error('Error fetching or processing orders:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        });
    }

  
    handleStartDateChange(event) {
        this.startDate = event.target.value;
    }

  
    handleEndDateChange(event) {
        this.endDate = event.target.value;
    }

    filterOrders() {
        this.filteredOrders = this.orders.filter(order => {
            const orderDate = new Date(order.CreatedDate);
            const start = this.startDate ? new Date(this.startDate) : null;
            const end = this.endDate ? new Date(this.endDate) : null;
            return (!start || orderDate >= start) && (!end || orderDate <= end);
        });
        this.totalRecords = this.filteredOrders.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        const startIdx = (this.currentPage - 1) * this.pageSize;
        const endIdx = this.currentPage * this.pageSize;
        this.paginatedOrders = this.filteredOrders.slice(startIdx, endIdx);
        console.log('Paginated Orders:', JSON.stringify(this.paginatedOrders));
    }

    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.updatePagination();
        }
    }

   
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.updatePagination();
        }
    }

    
    viewOrderDetails(event) {
        const orderId = event.target.dataset.id;
        console.log(orderId);
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/order-confirmation?orderId=' + orderId
            }
        });
    }

  
    reorder(event) {
        const orderId = event.target.dataset.id;
        reOrder({ orderId })
            .then(() => {
                this.showToast('Success', 'Products added to your cart!', 'success');
            })
            .catch(error => {
                console.error('Error re-ordering products:', error);
                this.showToast('Error', 'Error re-ordering products', 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}