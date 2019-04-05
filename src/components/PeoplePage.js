import store from "../store.js";
import Person from "../models/data/Person.js";
import Card from "../models/Card.js";
import {routes} from "../router.js";
import CardComponent from "./util/Card.js";

export default Vue.extend({
    store,
    template: "#people-page-template",
    components: {
        "card": CardComponent
    },
    data() {
        return {
            newHref: routes.person.toString()
        };
    },
    computed: {
        cards() {
            return this.$store.getters
                .data(Person.namespace)
                .map((person) => new Card(person.name, person.address).linksTo(
                    routes.person.toString({personId: person.id})
                ));
        }
    },
});