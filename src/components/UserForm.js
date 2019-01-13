import FormInput from "../models/FormInput.js"
import GenForm from "./GenForm.js"
import store, {mutations} from "../store.js"
import User, {ROLES} from "../data/User.js"

export default {
    template: "#model-form",
    components: {
        "gen-form": GenForm
    },
    store,
    computed: {
        user() {
            return this.$store.state.data[User.name][this.$route.params.id] || new User()
        },
        inputs() {
            return [
                new FormInput("id", "Id", this.user.id, true).isHidden(),
                new FormInput("name", "Name", this.user.name).isRequired(),
                new FormInput("phone", "Phone Number", this.user.phone),
                new FormInput("email", "Email", this.user.email).isEmail(),
                new FormInput("address", "Address", this.user.address),
                new FormInput("role", "Role", this.user.role).isSelect(ROLES)
            ]
        }
    },
    methods: {
        handleSubmit(data) {
            const model = new User(data)
            this.$store.commit(mutations.saveModels.name, [model])
        }
    }
}
