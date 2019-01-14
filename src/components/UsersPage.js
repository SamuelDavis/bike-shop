import store from "../store.js"
import UserCard from "./UserCard.js"
import User from "../data/User.js"
import {fuzzySearch} from "../util/misc.js"

export default {
    template: "#users-page-template",
    components: {
        "user-card": UserCard
    },
    store,
    data() {
        return {searchTerm: ""}
    },
    computed: {
        users() {
            return fuzzySearch(
                this.searchTerm,
                [new User({name: "New User"})].concat(this.$store.getters.lookup(User.name)),
                ["name", "email", "phone", "address"]
            )
        }
    },
    methods: {
        editUser(user) {
            this.$router.push({name: 'User', params: {id: user.id}})
        }
    }
}
