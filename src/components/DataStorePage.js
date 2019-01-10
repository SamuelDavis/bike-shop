import * as Google from "../util/google.js"
import {parseQuery} from "../util/str.js"
import GenericForm from "./GenForm.js"
import FormInput from "../models/FormInput.js"

export default {
    template: "#data-store-page-template",
    components: {
        "gen-form": GenericForm
    },
    data() {
        return {
            isAuthed: false,
            auth: {
                clientId: "",
                apiKey: "",
                spreadsheetId: ""
            },
            config: {
                discoveryDocs: [
                    "https://sheets.googleapis.com/$discovery/rest?version=v4",
                    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
                ],
                scope: [
                    "https://www.googleapis.com/auth/spreadsheets",
                    "https://www.googleapis.com/auth/calendar.readonly"
                ].join(" ")
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
            this.auth = data
        },
        signIn(e) {
            Google.signin()
        },
        signOut(e) {
            Google.signout()
        }
    },
    watch: {
        auth: {
            handler(auth) {
                this.saveAuth(auth)
                Google
                    .authDataStore({...this.config, ...this.auth})
                    .then(() => {
                        Google.setSignInListener((isAuthed) => this.isAuthed = isAuthed)
                        this.isAuthed = Google.getAuthStatus()
                        if (!this.isAuthed) Google.signin()
                    })
            }
        },
        isAuthed(isAuthed) {
            if (isAuthed && !this.auth.spreadsheetId) {
                Google
                    .createDataStore("test", ["foo", "bar", "qux"])
                    .then((res) => this.updateAuth({...this.auth, spreadsheetId: res.result.spreadsheetId}))
            }
        }
    },
    created() {
        const query = parseQuery()
        const storage = this.loadAuth()
        const data = Object
            .keys(this.auth)
            .reduce((acc, key) => ({...acc, [key]: storage[key] || query[key] || acc[key]}), this.auth)
        this.updateAuth(data)
    }
}
