import {parseQuery} from "../util/str.js"
import GenericForm from "./GenForm.js"
import FormInput from "../models/FormInput.js"

export default {
    template: "#data-store-template",
    components: {
        "gen-form": GenericForm
    },
    data() {
        return {
            auth: {
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: "https://www.googleapis.com/auth/spreadsheets",
                clientId: undefined,
                apiKey: undefined,
                spreadsheetId: undefined
            }
        }
    },
    computed: {
        formInputs() {
            return [
                new FormInput("clientId", "Google Client ID", this.auth.clientId, true),
                new FormInput("apiKey", "Google API Key", this.auth.apiKey, true),
                new FormInput("spreadsheetId", "Spreadsheet ID", this.auth.spreadsheetId)
            ]
        }
    },
    methods: {
        loadAuth() {
            return JSON.parse(localStorage.getItem("auth") || "{}")
        },
        saveAuth(auth) {
            localStorage.setItem("auth", JSON.stringify(auth))
        },
        updateAuth(data) {
            this.auth = {...this.auth, ...data}
        }
    },
    watch: {
        auth: {
            handler(auth) {
                this.saveAuth(auth)
            },
            deep: true
        }
    },
    created() {
        const query = parseQuery()
        const storage = this.loadAuth()
        Object
            .keys(this.auth)
            .forEach((key) => Vue.set(this.auth, key, storage[key] || query[key]))
    }
}
