import * as google from "./util/google.js"
import {parseQuery} from "./util/str.js"

export const namespaces = []

export const mutations = {
    updateAuth(state, isAuthed) {
        state.auth.active = isAuthed
    },
    updateCreds(state, creds) {
        state.auth.creds = creds
    },
    saveModel(state, model) {
        const namespace = model.constructor.name
        Vue.set(state.data, namespace, state.data[namespace] || [])

        if (model.id === undefined) {
            const id = (state.idCount[namespace] || 0) + 1
            model.id = id
            Vue.set(state.idCount, namespace, id)
        }
        model.createdAt = model.createdAt || new Date()
        model.updatedAt = new Date()

        const index = state.data[namespace].findIndex((item) => item.id === model.id)

        Vue.set(state.data[namespace], index === -1 ? state.data[namespace].length : index, model)
    },
    setSpreadsheet(state, spreadsheet) {
        state.auth.spreadsheet = spreadsheet
    }

}

function authGoogle(store, config) {
    return google
        .authDataStore(config)
        .then(() => {
            google.setSignInListener((isAuthed) => store.commit(mutations.updateAuth(isAuthed)))
            store.commit(mutations.updateAuth.name, google.getAuthStatus())
            return !store.state.auth.active ? google.signin() : Promise.resolve()
        })
}

function importSpreadsheet(store) {
    console.log("spreadsheet")
    return Promise.resolve()
}

function importCalendar(store) {
    return google
        .fetchCalendarEvents(store.state.auth.creds.calendarId)
        .then((events) => events.forEach((event) => store.commit(mutations.saveModel.name, event)))
}


const state = (() => {
    const query = parseQuery()
    const storage = JSON.parse(localStorage.getItem("auth") || "{}")
    const state = {
        auth: {
            active: false,
            spreadsheet: undefined,
            creds: {
                clientId: "",
                apiKey: "",
                spreadsheetId: "",
                calendarId: ""
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
        },
        idCount: {},
        data: {}
    }
    for (let key in state.auth.creds)
        if (state.auth.creds.hasOwnProperty(key))
            state.auth.creds[key] = storage[key] || query[key] || state.auth.creds[key]

    return state
})()

const getters = {
    authConfig(state) {
        return {...state.auth.config, ...state.auth.creds}
    },
    lookup(state) {
        return (namespace) => state.data[namespace] || []
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

store.watch((state) => state.auth.creds, (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth))
    authGoogle(store, store.getters.authConfig)
        .catch((err) => console.error({err}))
}, {deep: true})

store.watch((state) => state.auth.active, () => {
    if (!store.state.auth.active) return

    (store.state.auth.creds.spreadsheetId
        ? google
            .getSpreadsheet(store.state.auth.creds.spreadsheetId)
            .then((res) => store.commit(mutations.setSpreadsheet.name, res.result))
        : google
            .createDataStore("NCCDB", [])
            .then((res) => {
                store.commit(mutations.updateCreds.name, {
                    ...store.state.auth.creds,
                    spreadsheetId: res.result.spreadsheetId
                })
                store.commit(mutations.setSpreadsheet.name, res.result)
                return res
            }))
        .then(() => Promise.all([
            store.state.auth.creds.spreadsheetId ? importSpreadsheet(store) : Promise.resolve(),
            store.state.auth.creds.calendarId ? importCalendar(store) : Promise.resolve()
        ]))
})
store.watch((state) => state.data, (data) => {
    console.log("Sync")
}, {deep: true})

authGoogle(store, store.getters.authConfig)

export default store
