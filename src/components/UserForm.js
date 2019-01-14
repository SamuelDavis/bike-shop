import FormInput from "../models/FormInput.js"
import GenForm from "./GenForm.js"
import store, {mutations} from "../store.js"
import User, {ROLES} from "../data/User.js"

export default {
    extends: GenForm,
    store,
    props: {
        onSubmit: {
            type: Function,
            default: function (data) {
                const model = new User(data)
                this.$store.commit(mutations.saveModels.name, [model])
                this.$router.push({name: "User", params: {id: model.id}})
            }
        }
    },
    computed: {
        user() {
            const user = this.$store.state.data[User.name][this.$route.params.id] || new User()
            console.log({user})
            return user
        },
        controls() {
            return this.inputs.concat([
                new FormInput("id", "Id", this.user.id, true).isHidden(),
                new FormInput("name", "Name", this.user.name).isRequired(),
                new FormInput("phone", "Phone Number", this.user.phone),
                new FormInput("email", "Email", this.user.email).isEmail(),
                new FormInput("address", "Address", this.user.address),
                new FormInput("role", "Role", this.user.role).isSelect(ROLES)
            ])
        }
    }
}
