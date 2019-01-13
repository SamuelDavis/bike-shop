import Model from "../models/Model.js"

export const ROLES = {
    PARTICIPANT: 0,
    VOLUNTEER: 1
}

export default class User extends Model {
    constructor(data = {}) {
        super(data)
        Object.defineProperties(this, {
            role: {
                set: (role) => this.data.role = parseInt(role, 10)
            }
        })
    }

    get properties() {
        return super.properties.concat([
            "name", "phone", "email", "address", "role"
        ])
    }
}
