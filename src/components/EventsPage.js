import store from "../store.js";
import {routes} from "../router.js";
import CalendarEvent from "../models/data/CalendarEvent.js";
import CardComponent from "./util/Card.js";

export default Vue.extend({
    store,
    template: "#events-page-template",
    components: {
        "card": CardComponent
    },
    computed: {
        events() {
            return this.$store.getters
                .data(CalendarEvent.namespace)
                .map((event) => ({
                    ...event,
                    timestamp: [
                        moment(event.startsAt).format("MMMM Do YYYY, h:mm a"),
                        moment(event.endsAt).format("h:mm a")
                    ].join(" - "),
                    href: routes.event.toString({eventId: event.id}),
                }));
        }
    }
});