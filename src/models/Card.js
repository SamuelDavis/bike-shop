import {noop} from "../util/index.js";

export default class Card {
    constructor(title, text) {
        this.title = title;
        this.text = text;
        this.href = undefined;
        this.clickHandler = noop;
    }


    linksTo(href) {
        this.href = href;
        return this;
    }

    onClick(handler) {
        this.clickHandler = handler;
        return this;
    }
}