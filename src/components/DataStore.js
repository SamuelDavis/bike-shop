import {parseQuery} from "../util/str.js"

export default {
    template: "#data-store-template",
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
    methods: {
        loadAuth() {
            return JSON.parse(localStorage.getItem("auth") || "{}")
        },
        saveAuth(auth) {
            localStorage.setItem("auth", JSON.stringify(auth))
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
