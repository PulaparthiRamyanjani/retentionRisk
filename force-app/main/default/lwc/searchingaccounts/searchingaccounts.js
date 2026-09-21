import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/LWC_Controller.getAccounts';
 
export default class serachingaccounts extends LightningElement {
 
    fetchedAccounts;
showTable = false;
 
    handleChange(event){
        getAccounts({inputName:event.target.value}).then(result=>{
            this.showTable=true;
            this.fetchedAccounts = result
        }).catch(error=>{
            console.log('error'+error);
        })
    }

}