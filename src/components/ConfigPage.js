import store, {mutations} from "../store.js";
import {extractForm, nest} from "../util/index.js";

export default Vue.extend({
    store,
    template: "#config-page-template",
    data() {
        return {
            google: this.$store.getters.googleConfig
        };
    },
    methods: {
        handleSubmit(e) {
            const form = this.$refs.form;
            if (form.validate()) {
                const data = extractForm(e.target);
                this.$store.commit(mutations.putConfig.name, nest(data));
                alert("Config saved.");
            }
        }
    }
});
