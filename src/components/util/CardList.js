import Card from "./Card.js";

export default Vue.extend({
    template: "#card-list-template",
    components: {
        "card": Card
    },
    props: {
        cards: {
            type: Array,
            required: false,
            default: () => []
        }
    },
});