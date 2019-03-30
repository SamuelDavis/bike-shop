import store, {mutations} from "../store.js";
import {extractForm} from "../util/index.js";

export default Vue.extend({
    store,
    template: "#config-page-template",
    computed: {
        ...Vuex.mapGetters(["config"])
    },
    methods: {
        handleSubmit(e) {
            const form = this.$refs.form;
            if (form.validate()) {
                const data = extractForm(e.target);
                this.$store.commit(mutations.putConfig.name, data);
                alert("Config saved.");
            }
        }
    }
});
