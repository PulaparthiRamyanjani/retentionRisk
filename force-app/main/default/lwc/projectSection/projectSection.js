import { LightningElement } from 'lwc';

import Image_Url from '@salesforce/resourceUrl/PortfoliImages';
export default class ProjectSection extends LightningElement {
    Project = Image_Url + '/Portfoliproject/project.jpeg';

    projectData =[
        {id:1,
        name:'Customer Portal',
        description:'Self Service portal built in salesforce experience cloud using custom LWC, Apex logics for case management, product training,live agent support.',
        technology : 'Salesforce, LWC, Apex, Triggers, JavaScript, Experience Cloud, Integration',
        website:'www.google.com'
    },
    {
        id:2,
        name:'Portfolio Website',
        description:'Portfolio website built using react js and deployed on github pages.',
        technology : 'React, JavaScript, HTML, CSS, Bootstrap, GitHub Pages',
        website: 'www.google.com',
    },
    ]
}