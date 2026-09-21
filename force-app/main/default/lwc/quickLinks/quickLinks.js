import { LightningElement } from 'lwc';
import Image_Url from '@salesforce/resourceUrl/PortfoliImages';
import { NavigationMixin } from 'lightning/navigation';
export default class QuickLinks extends NavigationMixin (LightningElement) {
    data = [
        {
            id:1,
            image: Image_Url + '/Portfoliproject/project.jpeg',
            text:'Projects',},
        {
            id:2,
            image: Image_Url + '/Portfoliproject/OIP.jpg',
            text:'Skills', },
        {
            id:3,
            image: Image_Url + '/Portfoliproject/pd1.png',
            text:'Certifications',}
    ];
handleClick(event)
{
    let selectedCard = event.currentTarget.dataset.id;
    if(selectedCard == 1){ 
        this.navigateToPages('project__c');
    }
    else if(selectedCard == 2){ 
        this.navigateToPages('skill__c');
    }
    else {
         this.navigateToPages('certification__c');}
}
navigateToPages(pageApiName)
{
    this[NavigationMixin.Navigate]
    ({
        type :'comm__namedPage',
        attributes : {name:pageApiName}
    })
}}