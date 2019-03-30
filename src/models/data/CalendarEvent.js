/**
 * @property {Date} startsAt
 * @property {Date} endsAt
 * @property {string} location
 * @property {string} name
 * @property {string} description
 */
import Datum from "./Datum.js";

export default class CalendarEvent extends Datum {
    static get properties() {
        return super.properties.concat(["startsAt", "endsAt", "location", "name", "description"]);
    }
}
