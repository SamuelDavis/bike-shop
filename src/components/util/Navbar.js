export default Vue.extend({
    template: "#navbar-template",
    props: {
        routes: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            active: 0,
            items: this.routes
        };
    }
});