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

const state = {
    auth: {
        active: false,
        spreadsheet: undefined,
        creds: {
            clientId: "",
            apiKey: "",
            spreadsheetId: "",
            calendarId: "",
            ...parseQuery(),
            ...JSON.parse(localStorage.getItem("auth") || "{}")
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

const getters = {
    authConfig(state) {
        return {...state.auth.config, ...state.auth.creds}
    },
    lookup(state) {
        return (namespace) => Object.values(state.data[namespace] || {})
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

store.watch((state) => state.auth.creds, (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth))
    google.auth(store.getters.authConfig, (isAuthed) => store.commit(mutations.updateAuth.name, isAuthed))
}, {deep: true})

store.watch((state) => state.auth.active, () => {
    if (!store.state.auth.active) return

    const createSpreadsheet = store.state.auth.creds.spreadsheetId
        ? Promise.resolve({spreadsheetId: store.state.auth.creds.spreadsheetId})
        : google.createSpreadsheet("NCCDB")
    createSpreadsheet
        .then((res) => {
            // UPDATE LOCAL SPREADSHEET ID & FETCH DATA
            store.commit(mutations.updateCreds.name, {
                ...store.state.auth.creds,
                spreadsheetId: res.spreadsheetId
            })
            return Promise.all([
                google.fetchSpreadsheet(res.spreadsheetId),
                store.state.auth.creds.calendarId
                    ? google.fetchEvents(store.state.auth.creds.calendarId)
                    : Promise.resolve([])
            ])
        })
        .then(([spreadsheet, events]) => {
            // STORE GOOGLE DATA LOCALLY
            store.commit(mutations.setSpreadsheet.name, spreadsheet)
            Object.keys(spreadsheet.data)
                .filter((key) => key in MODEL_MAP)
                .forEach((key) => spreadsheet.data[key]
                    .forEach((record) => {
                        store.commit(mutations.saveModel.name, new MODEL_MAP[key]().fromArray(record))
                    }))
            events.forEach((event) => store.commit(mutations.saveModel.name, new Event(event)))
        })
})
store.watch((state) => state.data, (data) => {
    if (!store.state.auth.creds.spreadsheetId) return

    google.persistSpreadsheetValues(store.state.auth.creds.spreadsheetId, Object.keys(data).reduce((acc, key) => ({
        ...acc,
        [key]: Object.values(data[key]).map((model) => model.toArray())
    }), {}))
}, {deep: true})

google.auth(store.getters.authConfig, (isAuthed) => store.commit(mutations.updateAuth.name, isAuthed))

export default store
