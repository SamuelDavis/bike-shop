import store from "../store.js";
import Person from "../models/data/Person.js";

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
    }
});