import * as google from "./util/google.js"
import {parseQuery} from "./util/str.js"
import * as faker from "./util/faker.js"
import Event from "./models/Event.js"

const MODEL_MAP = [Event].reduce((acc, Model) => ({...acc, [Model.name]: Model}), {})

export const mutations = {
    updateAuth(state, isAuthed) {
        state.auth.active = isAuthed
    },
    updateCreds(state, creds) {
        state.auth.creds = creds
    },
    saveModel(state, model) {
        const namespace = model.constructor.name
        Vue.set(state.data, namespace, state.data[namespace] || {})

        model.id = model.id === undefined ? faker.str() : model.id
        model.createdAt = model.createdAt || new Date()
        model.updatedAt = new Date()

        Vue.set(state.data[namespace], model.id, model)
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
        return (namespace) => Object.values(state.data[namespace] || {})
    },
    existingSheets(state) {
        return state.auth.spreadsheet
            ? state.auth.spreadsheet.sheets.map((sheet) => sheet.properties.title)
            : []
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
}, {deep: true})

store.watch((state) => state.auth.active, () => {
    if (!store.state.auth.active) return

    (store.state.auth.creds.spreadsheetId
        ? google
            .getSpreadsheet(store.state.auth.creds.spreadsheetId)
            .then((res) => store.commit(mutations.setSpreadsheet.name, res.result))
            .then(() => {
                google
                    .fetchSpreadsheet(store.state.auth.creds.spreadsheetId, store.getters.existingSheets)
                    .then((data) => Object.keys(data)
                        .filter((key) => key in MODEL_MAP)
                        .forEach((key) => (data[key] || [])
                            .forEach((record) => {
                                store.commit(mutations.saveModel.name, new MODEL_MAP[key]().fromArray(record))
                            })))
            })
        : google
            .createSpreadsheet("NCCDB", [])
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
    if (store.state.auth.creds.spreadsheetId) {
        const missingSheets = Object.keys(data)
            .filter((key) => !store.getters.existingSheets.includes(key));

        (missingSheets.length
            ? google.createSheets(store.state.auth.creds.spreadsheetId, missingSheets)
            : Promise.resolve())
            .then(() => google.exportSpreadsheet(store.state.auth.creds.spreadsheetId, data))
    }
}, {deep: true})

authGoogle(store, store.getters.authConfig)

export default store
