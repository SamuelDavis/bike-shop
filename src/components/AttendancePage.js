import store from "../store.js"
import Event from "../models/Event.js"

export default {
    template: "#attendance-page-template",
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
