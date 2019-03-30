import store from "../store.js";
import CalendarEvent from "../models/data/CalendarEvent.js";
import Person from "../models/data/Person.js";
import CardDatum from "../models/Card.js";
import CardComponent from "./util/Card.js";

export default Vue.extend({
    store,
    template: "#attendance-page-template",
    components: {
        "card": CardComponent
    },
    props: {
        eventId: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            event: this.$store.getters.data(CalendarEvent.namespace, this.eventId)
        };
    },
    computed: {
        cards() {
            return this.$store.getters
                .data(Person.namespace)
                .map((person) => new CardDatum(person.name, person.address));
        }
    },
});