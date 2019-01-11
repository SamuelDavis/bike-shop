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
                Google.fetchCalendarEvents("hva040762hhngg3nerqnfc5n2s@group.calendar.google.com")
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
