import Model from "./Model.js"

export default class Attendance extends Model {
    get properties() {
        return super.properties.concat(["userId", "eventId", "signedIn", "signedOut"])
    }

    get isActive() {
        return this.signedOut === undefined || this.signedOut === ""
    }

    set_signedOut(date) {
        Vue.set(this.data, "signedOut", date === undefined ? "" : date)
    }
}
