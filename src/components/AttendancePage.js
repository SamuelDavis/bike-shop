import * as Google from "../util/google.js"
import store from "../store.js"

export default {
    template: "#attendance-page-template",
    store,
    data() {
        return {
            events: undefined,
            targetEvent: undefined
        }
    },
    methods: {
        loadEvents() {
            if (!this.events)
                Google.fetchCalendarEvents(this.$store.state.auth.calendarId)
                    .then((eventList) => this.events = eventList)
        }
    },
    created() {
        this.loadEvents()
    },
    activated() {
        this.loadEvents()
    }
}
