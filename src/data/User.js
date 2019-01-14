import Model from "./Model.js"

export const ROLES = {
    PARTICIPANT: 0,
    VOLUNTEER: 1
}

export const LANGUAGES = {
    ENGLISH: 0,
    SPANISH: 1,
    OTHER: 2
}

export default class User extends Model {
    get properties() {
        return super.properties.concat([
            "name", "phone", "email", "address", "role", "preferredLanguage", "allergies"
        ])
    }

    set_role(role) {
        Vue.set(this.data, "role", parseInt(role, 10))
    }

    set_preferredLanguage(preferredLanguage) {
        Vue.set(this.data, "preferredLanguage", parseInt(preferredLanguage, 10))
    }

    set_phone(phone) {
        Vue.set(this.data, "phone", phone ? `1${phone}`.slice(-11) : "")
    }
}
