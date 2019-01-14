import store from "../store.js"
import UserCard from "./UserCard.js"
import User from "../data/User.js"

export default {
    template: "#user-page-template",
    components: {
        "user-card": UserCard
    },
    store,
    computed: {
        users() {
            return [new User({name: "New User"})].concat(this.$store.getters.lookup(User.name))
        }
    },
    methods: {
        editUser(user) {
            this.$router.push({name: 'User', params: {id: user.id}})
        }
    }
}
