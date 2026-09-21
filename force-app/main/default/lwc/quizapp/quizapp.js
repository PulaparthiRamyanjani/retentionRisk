import { LightningElement } from 'lwc';

export default class Quizapp extends LightningElement {
    myQuestions=[
        {
            id:"question1",
            question:"which one of the following is not a template loop",
            answers:{
                a:"for:each",
                b:"map loop"
            },
            correctAnswer:"b"
        },
        {
            id:"question2",
            question:"who are you",
            answers:{
                a:"human",
                b:"animal",
                c:"both",
                d:"none of the above"
            },
            correctAnswer:"d"
        },
        {
            id:"question2",
            question:"you are mad",
            answers:{
                a:"yes",
                b:"no"
               
            },
            correctAnswer:"a"
        }
    ]
}