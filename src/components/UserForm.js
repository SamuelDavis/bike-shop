import FormInput from "../models/FormInput.js"
import GenForm from "./GenForm.js"
import store, {mutations} from "../store.js"
import User, {ROLES} from "../data/User.js"
import * as faker from "../util/faker.js"

export default {
    template: "#model-form",
    components: {
        "gen-form": GenForm
    },
    store,
    data() {
        return {
            inputs: [
                new FormInput("name", "Name", `${faker.str(5)} ${faker.str(7)}`, true),
                new FormInput("phone", "Phone Number", faker.int(7)),
                new FormInput("email", "Email", `${faker.str(7)}@gmail.com`),
                new FormInput("address", "Address", faker.str()),
                new FormInput("role", "Role", faker.randFrom(Object.values(ROLES)))
            ]
        }
    },
    methods: {
        handleSubmit(data) {
            const model = new User(data)
            this.$store.commit(mutations.saveModel.name, model)
        }
    }
}
