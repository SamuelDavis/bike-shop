import router, {mainNav} from "../router.js";
import store from "../store.js";
import Navbar from "./util/Navbar.js";

export default Vue.extend({
    router,
    store,
    template: "#app-template",
    components: {
        navbar: Navbar
    },
    data() {
        return {
            appTitle: this.$store.getters.appNamespace + " - " + this.$router.currentRoute.name.split(/(?=[A-Z])/).join(" ").toUpperCase(),
            mainNav,
        };
    }
});