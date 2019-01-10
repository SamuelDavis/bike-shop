import {extractForm} from "../util/form.js"
import FormControl from "./FormControl.js"

export default {
    template: "#gen-form-template",
    components: {
        "form-control": FormControl
    },
    props: {
        inputs: {
            type: Array,
            default: () => []
        },
        onSubmit: {
            type: Function,
            default: () => undefined
        }
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault()
            this.onSubmit(extractForm(e.target))
            return false
        }
    }
}
