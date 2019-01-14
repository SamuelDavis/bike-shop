import Model from "../models/Model.js"

export const ROLES = {
    PARTICIPANT: 0,
    VOLUNTEER: 1
}

export default class User extends Model {
    get properties() {
        return super.properties.concat([
            "name", "phone", "email", "address", "role"
        ])
    }

    set_role(role) {
        this.data.role = parseInt(role, 10)
    }
}
