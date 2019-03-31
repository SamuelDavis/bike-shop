/**
 * @property {string} namespace
 * @property {string[]} properties
 * @property {string} id
 * @property {string} createdAt
 * @property {string} updatedAt
 */
export default class Datum {
    constructor(props = {}) {
        this.namespace = this.constructor.namespace;
        if (props instanceof Array)
            this.properties.forEach((prop, i) => this[prop] = props[i]);
        else
            this.properties.forEach((prop) => this[prop] = props[prop]);
    }

    static get properties() {
        return ["id", "createdAt", "updatedAt"];
    }

    static get namespace() {
        return this.name;
    }

    get properties() {
        return this.constructor.properties;
    }

    get array() {
        return this.properties.map((prop) => this[prop]);
    }
}
