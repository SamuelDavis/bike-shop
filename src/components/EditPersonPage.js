import store, {actions} from "../store.js";
import Person from "../models/data/Person.js";
import {extractForm} from "../util/index.js";

export default Vue.extend({
    store,
    template: "#edit-person-page",
    props: {
        personId: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            person: this.$store.getters.data(Person.namespace, this.personId) || new Person({id: this.personId})
        };
    },
    methods: {
        handleSubmit(e) {
            const form = this.$refs.form;
            if (form.validate()) {
                const person = new Person({id: this.personId, ...extractForm(e.target)});
                this.$store.dispatch(actions.putDatum.name, person);
                alert("Person saved.");
            }
        }
    }
});