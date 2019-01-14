import * as faker from "../util/faker.js"

export default class Model {
    constructor(data = {}) {
        this.data = {}
        this.properties.forEach((prop) => Object.defineProperty(this, prop, {
            get: this[`get_${prop}`] || (() => this.data[prop]),
            set: this[`set_${prop}`] || ((value) => this.data[prop] = value),
            configurable: true
        }))
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) this[prop] = data[prop]
        }
        return this.ensureId()
    }

    ensureId() {
        this.id = this.id || faker.str()
        return this
    }

    get properties() {
        return ["id", "createdAt", "updatedAt"]
    }

    fromArray(arr) {
        this.properties.forEach((prop, i) => this[prop] = arr[i])
        return this
    }

    toArray() {
        return this.properties.map((prop) => this[prop])
    }
}
