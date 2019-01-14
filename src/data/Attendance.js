import Model from "./Model.js"

export default class Attendance extends Model {
    get properties() {
        return super.properties.concat(["userId", "eventId", "signedIn", "signedOut"])
    }
}
