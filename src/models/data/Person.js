import Datum from "./Datum.js";

/**
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 * @property {Date} dob
 */
export default class Person extends Datum {
    get properties() {
        return super.properties.concat(["name", "address", "phone", "dob"]);
    }
}