import Model from "./Model.js"

export default class Event extends Model {
    get properties() {
        return ["id", "summary", "description", "location", "start", "end"]
    }
}
