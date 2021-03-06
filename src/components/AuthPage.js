import * as google from "../util/google.js"
import GenericForm from "./GenForm.js"
import FormInput from "../models/FormInput.js"
import store, {mutations} from "../store.js"
import * as flash from "../util/flash.js"
import {buildQuery} from "../util/misc.js"

export default {
    template: "#auth-page-template",
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
        spreadsheet() {
            return this.$store.state.auth.spreadsheet
        },
        isAuthed() {
            return this.$store.getters.isAuthed
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
        copyUrl() {
            const textarea = document.createElement("textarea")
            textarea.value = `${window.location.host}/${buildQuery(this.auth)}`
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            flash.success("URL copied.")
        },
        signIn: google.signIn.bind(google),
        signOut: google.signOut.bind(google)
    }
}
