import store, {mutations} from "../store.js"
import Event from "../data/Event.js"
import EventCard from "./EventCard.js"
import {fuzzySearch} from "../util/misc.js"
import User from "../data/User.js"
import UserCard from "./UserCard.js"
import Attendance from "../data/Attendance.js"

export default {
    template: "#attendance-page-template",
    components: {
        "event-card": EventCard,
        "user-card": UserCard
    },
    store,
    data() {
        return {
            searchTerm: "",
            targetEvent: undefined
        }
    },
    computed: {
        events() {
            return this.$store.getters.lookup(Event.name)
        },
        users() {
            return fuzzySearch(this.searchTerm, this.$store.getters.lookup(User.name), ["name", "email", "phone", "address"])
                .map((user) => {
                    const lastAttendance = this.$store.getters.lastAttendanceFor(user, this.targetEvent)
                    Vue.set(user, "active", lastAttendance && lastAttendance.signedOut === undefined)
                    return user
                })
                .sort((a, b) => !!b.active - !!a.active)
        }
    },
    methods: {
        toggleAttendance(user) {
            let record = this.$store.getters.lastAttendanceFor(user, this.targetEvent)
            if (record && record.signedOut === undefined) {
                record.signedOut = new Date()
            } else {
                record = new Attendance({
                    userId: user.id,
                    eventId: this.targetEvent.id,
                    signedIn: new Date()
                })
            }
            this.$store.commit(mutations.saveModels.name, [record])
        }
    }
}
