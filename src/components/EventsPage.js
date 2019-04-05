import Card from "../models/Card.js";
import store, {actions} from "../store.js";
import {routes} from "../router.js";
import CalendarEvent from "../models/data/CalendarEvent.js";
import * as google from "../util/google.js";
import Anchor from "../models/Anchor.js";
import CardComponent from "./util/Card.js";

export default Vue.extend({
    store,
    template: "#events-page-template",
    components: {
        "card": CardComponent
    },
    computed: {
        cards() {
            return this.$store.getters
                .data(CalendarEvent.namespace)
                .map((event) => new Card(event.name, event.location)
                    .linksTo(routes.event.toString({eventId: event.id})));
        }
    },
    data() {
        return {
            authed: false,
            configLink: new Anchor(routes.config.toString(), "Update the Application Config"),
        };
    },
    methods: {
        fetchEvents() {
            google
                .load()
                .then(() => google.auth(this.$store.getters.googleConfig, (isAuthed) => this.authed = isAuthed))
                .then(() => this.authed ? Promise.resolve() : google.signIn())
                .then(() => google.listEvents({
                    calendarId: this.$store.getters.googleConfig.calendarId,
                    timeMin: moment().startOf("day").toISOString(),
                    timeMax: moment().endOf("day").add(2, "days").toISOString()
                }))
                .then((events) => {
                    return events.forEach((event) => {
                        const model = new CalendarEvent({
                            ...event,
                            name: event.summary,
                            startsAt: event.start,
                            endsAt: event.end,
                            updatedAt: event.updated,
                            createdAt: event.created
                        });
                        this.$store.dispatch(actions.putDatum.name, model);
                    });
                });
        }
    }
});