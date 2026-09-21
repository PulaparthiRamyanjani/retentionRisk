import { LightningElement,api } from 'lwc';
import Image_Url from '@salesforce/resourceUrl/PortfoliImages'

export default class SkillSection extends LightningElement {


    @api skillName1;
    @api skillBarValue1 ;

    @api skillName2 ;
    @api skillBarValue2;
    
    @api skillName3;
    @api skillBarValue3;

    @api skillName4;
    @api skillBarValue4;

    skillImage = Image_Url + '/Portfoliproject/trailhead.jpg';
}