import Model from "./Model.js"

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
        Vue.set(this.data, "role", parseInt(role, 10))
    }
}
