import router from "../router.js"

export default {
    template: "#app-nav-template",
    router,
    props: {
        brand: {
            type: String,
            default: "Home"
        }
    },
    computed: {
        home() {
            return this.$router.options.routes[0]
        },
        routes() {
            return this.$router.options.routes.slice(1)
        }
    }
}
