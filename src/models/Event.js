import Model from "./Model.js"

export default class Event extends Model {
    get properties() {
        return {
            id: String,
            summary: String,
            description: String,
            location: String,
            start: Date,
            end: Date
        }
    }
}
