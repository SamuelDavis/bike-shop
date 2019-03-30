export default class Card {
    constructor(title, text) {
        this.title = title;
        this.text = text;
        this.href = undefined;
    }


    linksTo(href) {
        this.href = href;
        return this;
    }
}