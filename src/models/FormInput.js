import * as Faker from "../util/faker.js"

export default class FormInput {
    constructor(name, label, value = undefined, required = false) {
        this.name = name
        this.label = label
        this.value = value
        this.id = `${this.name}${Faker.int()}`
        this.required = required
        this.type = "text"
    }

    hidden() {
        this.type = "hidden"
        return this
    }
}
