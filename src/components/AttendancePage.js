import store from "../store.js"
import Event from "../models/Event.js"
import EventCard from "./EventCard.js"

export default {
    template: "#attendance-page-template",
    components: {
        "event-card": EventCard
    },
    store,
    data() {
        return {
            targetEvent: undefined
        }
    },
    computed: {
        events() {
            return this.$store.getters.lookup(Event.name)
        }
    }
}
