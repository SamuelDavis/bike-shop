import Datum from "./Datum.js";

/**
 * @property {string} eventId
 * @property {string} personId
 * @property {date} signedInAt
 * @property {date} signedOutAt
 */
export default class Attendance extends Datum {
    get properties() {
        return super.properties.concat("eventId", "personId", "signedInAt", "signedOutAt");
    }

    get isActive() {
        return this.signedOutAt === undefined;
    }
}