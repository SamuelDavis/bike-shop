import * as faker from "../util/faker.js"

export default class Model {
    constructor(data = {}) {
        this.data = data

        Object.defineProperties(this, this.properties.reduce((acc, prop) => ({
            ...acc, [prop]: {
                get: () => this.data[prop],
                set: (val) => this.data[prop] = val,
                configurable: true
            }
        }), {}))

        this.ensureId()
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
