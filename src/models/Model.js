export default class Model {
    constructor(data = {}) {
        Object.keys(this.properties).forEach((prop) => this[prop] = data[prop])
    }

    get properties() {
        return {
            id: String,
            createdAt: Date,
            updatedAt: Date
        }
    }

    fromArray(arr) {
        Object.keys(this.properties).forEach((prop, i) => this[prop] = arr[i])
        return this
    }

    toArray() {
        return Object.keys(this.properties).map((prop) => this[prop])
    }
}
