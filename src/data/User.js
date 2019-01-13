import Model from "../models/Model.js"

export const ROLES = {
    PARTICIPANT: 0,
    VOLUNTEER: 1
}

export default class User extends Model {
    get properties() {
        return {
            ...super.properties,
            name: String,
            phone: String,
            email: String,
            address: String,
            role: String
        }
    }

    mut_role(role) {
        return role === undefined ? undefined : parseInt(role, 10)
    }
}
