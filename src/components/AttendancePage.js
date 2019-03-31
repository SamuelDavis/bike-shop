import store, {actions} from "../store.js";
import CalendarEvent from "../models/data/CalendarEvent.js";
import Person from "../models/data/Person.js";
import CardComponent from "./util/Card.js";
import Attendance from "../models/data/Attendance.js";

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
        btns() {
            return this.$store.getters
                .data(Person.namespace)
                .map((person) => {
                    const lastAttendance = this.$store.getters.lastAttendanceFor(this.event, person);
                    return {
                        id: person.id,
                        text: person.name,
                        onClick: () => this.toggleAttendance(this.event, person),
                        active: lastAttendance && lastAttendance.isActive
                    };
                })
                .sort((a, b) => !!b.active - !!a.active);
        }
    },
    methods: {
        toggleAttendance(event, person) {
            const fiveMinutes = 300000;
            let record = ((existing) => {
                if (existing && existing.isActive) {
                    existing.signedOutAt = moment();
                    return existing;
                }
                if (existing && (new Date() - existing.signedOutAt) < fiveMinutes) {
                    existing.signedOutAt = undefined;
                    return existing;
                }
                return new Attendance({
                    personId: person.id,
                    eventId: event.id,
                    signedInAt: moment()
                });
            })(this.$store.getters.lastAttendanceFor(event, person));

            this.$store.dispatch(actions.putDatum.name, record);
        }
    }
});