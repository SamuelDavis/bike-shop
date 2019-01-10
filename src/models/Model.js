export default class Model {
    constructor(data = {}) {
        console.log({props: this.properties, data})
        Object.keys(this.properties).forEach((prop) => this[prop] = data[prop])
    }

    get properties() {
        return {
            id: String,
            createdAt: Date,
            updatedAt: Date
        }
    }
}
