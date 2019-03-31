export default Vue.extend({
    template: "#card-template",
    props: {
        title: {
            type: String,
            required: false
        },
        text: {
            type: String,
            required: false
        },
        href: {
            type: String,
            required: false
        },
        clickHandler: {
            type: Function,
            required: false
        }
    }
});