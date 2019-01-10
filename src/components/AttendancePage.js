import * as Google from "../util/google.js"

export default {
    template: "#attendance-page-template",
    data() {
        return {
            events: undefined,
            targetEvent: undefined
        }
    },
    methods: {
        loadEvents() {
            if (!this.events)
                Google.fetchCalendarEvents()
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
