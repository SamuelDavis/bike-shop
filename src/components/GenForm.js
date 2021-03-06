import FormControl from "./FormControl.js"
import {extractForm, noop} from "../util/misc.js"

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
            default: noop
        }
    },
    computed: {
        controls() {
            return this.inputs
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
