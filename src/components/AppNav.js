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
        routes() {
            return this.$router.options.routes
        }
    }
}
