import { LightningElement } from 'lwc';

export default class SlideshowComponent extends LightningElement {
    quotes = [
        'Believe you can and you’re halfway there.',
        'The only way to do great work is to love what you do.',
        'Success is not the key to happiness. Happiness is the key to success.',
        'Your limitation—it’s only your imagination.',
        'Push yourself, because no one else is going to do it for you.'
    ];

    currentQuoteIndex = 0;

    // Getter for current quote
    get currentQuote() {
        return this.quotes[this.currentQuoteIndex];
    }

    connectedCallback() {
        this.startSlideshow();
    }

    startSlideshow() {
        setInterval(() => {
            this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        }, 3000); // Change quote every 3 seconds
    }
}