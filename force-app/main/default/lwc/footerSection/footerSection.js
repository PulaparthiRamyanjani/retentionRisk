import { LightningElement } from 'lwc';
import Image_Url from '@salesforce/resourceUrl/PortfoliImages';
export default class FooterSection extends LightningElement {
    youtube = Image_Url+'/Portfoliproject/yt.jpg';
    instagram = Image_Url+'/Portfoliproject/Instagram.jpg';
    linkedin = Image_Url+'/Portfoliproject/linkeidn.png';
    trailhead = Image_Url+'/Portfoliproject/trailhead.jpg';
}