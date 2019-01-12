import * as google from "../util/google.js"
import GenericForm from "./GenForm.js"
import FormInput from "../models/FormInput.js"
import store, {mutations} from "../store.js"

export default {
    template: "#data-store-page-template",
    components: {
        "gen-form": GenericForm
    },
    store,
    computed: {
        auth: {
            get() {
                return this.$store.state.auth.creds
            },
            set(auth) {
                this.$store.commit(mutations.updateCreds.name, auth)
            }
        },
        isAuthed: {
            get() {
                return this.$store.state.auth.active
            },
            set(isAuthed) {
                this.$store.commit(mutations.updateAuth.name, isAuthed)
            }
        },
        formInputs() {
            return [
                new FormInput("clientId", "google Client ID", this.auth.clientId, true),
                new FormInput("apiKey", "google API Key", this.auth.apiKey, true),
                new FormInput("spreadsheetId", "Spreadsheet ID", this.auth.spreadsheetId),
                new FormInput("calendarId", "Calendar ID", this.auth.calendarId)
            ]
        }
    },
    methods: {
        updateAuth(data) {
            this.auth = data
        },
        signIn(e) {
            google.signin()
        },
        signOut(e) {
            google.signout()
        }
    }
}
