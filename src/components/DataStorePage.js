import * as Google from "../util/google.js"
import {parseQuery} from "../util/str.js"
import GenericForm from "./GenForm.js"
import FormInput from "../models/FormInput.js"
import store, {mutations, namespaces} from "../store.js"

export default {
    template: "#data-store-page-template",
    components: {
        "gen-form": GenericForm
    },
    store,
    data() {
        return {
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
        auth: {
            get() {
                return this.$store.state.auth
            },
            set(auth) {
                this.$store.commit(mutations.updateAuth.name, auth)
            }
        },
        isAuthed: {
            get() {
                return this.$store.state.isAuthed
            },
            set(isAuthed) {
                this.$store.commit(mutations.setAuth.name, isAuthed)
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
                    .createDataStore("NCCDB", namespaces)
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
