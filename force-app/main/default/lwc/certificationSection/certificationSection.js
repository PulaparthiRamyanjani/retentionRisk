import { LightningElement } from 'lwc';
import Image_Url from '@salesforce/resourceUrl/PortfoliImages';
export default class CertificationSection extends LightningElement {
    certificateData =[
        {
            id:1,
            name:"Salesforce Admin",
            date :"10/10/2024",
            certid:"1111112345",
            image: Image_Url + '/Portfoliproject/admin.png',
        },
        {
            id:2,
            name:"Platform Developer 1",
            date :"17/06/2024",
            certid:"asdfgjkl12345",
            image: Image_Url + '/Portfoliproject/pd1.png',
        },
        {
            id:3,
            name:"AI Associate",
            date :"24/10/2024",
            certid:"qwertyuiop0987654",
            image: Image_Url + '/Portfoliproject/aia.png' ,   
        },
       
    ]
}