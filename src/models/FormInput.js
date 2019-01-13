import * as Faker from "../util/faker.js"

export default class FormInput {
    constructor(name, label, value = undefined) {
        this.name = name
        this.label = label
        this.value = value
        this.id = `${this.name}${Faker.int()}`
        this.type = "text"
        this.data = undefined
        this.required = false
    }

    isRequired() {
        this.required = true
        return this
    }

    isHidden() {
        this.type = "hidden"
        return this
    }

    isEmail() {
        this.type = "email"
        return this
    }

    isSelect(opts) {
        if (opts instanceof Object) {
            opts = Object.keys(opts).map((label) => [opts[label], label])
        }
        this.type = Object
        this.data = opts
        return this
    }
}
