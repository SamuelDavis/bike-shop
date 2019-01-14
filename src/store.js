import * as google from "./util/google.js"
import Event from "./data/Event.js"
import User from "./data/User.js"
import {parseQuery} from "./util/misc.js"
import Attendance from "./data/Attendance.js"

function signInListener(store, isAuthed) {
    store.commit(mutations.updateAuth.name, isAuthed)
}

function createSpreadsheet(spreadsheetId = undefined, name = "NCCDB") {
    return spreadsheetId
        ? Promise.resolve({spreadsheetId})
        : google.createSpreadsheet(name)
}

function fetchData(store, spreadsheetId, calendarId) {
    store.commit(mutations.updateCreds.name, {
        ...store.state.auth.creds,
        spreadsheetId
    })
    return Promise.all([
        google.fetchSpreadsheet(spreadsheetId),
        calendarId
            ? google.fetchEvents(calendarId)
            : Promise.resolve([])
    ])
}

function storeData(store, spreadsheet, events) {
    store.commit(mutations.setSpreadsheet.name, spreadsheet)
    const models = Object.keys(spreadsheet.data)
        .filter((key) => key in MODEL_MAP)
        .reduce((acc, key) => [...acc, ...spreadsheet.data[key]
            .map((record) => new MODEL_MAP[key]().fromArray(record))], [])
        .concat(events.map((event) => new Event(event)))
    store.commit(mutations.saveModels.name, models)
}

const MODELS = [Event, User]

const MODEL_MAP = MODELS.reduce((acc, Model) => ({...acc, [Model.name]: Model}), {})

export const mutations = {
    updateAuth(state, isAuthed) {
        state.auth.active = isAuthed
    },
    updateCreds(state, creds) {
        state.auth.creds = creds
    },
    saveModels(state, models) {
        const data = models.reduce((acc, model) => {
            const namespace = model.constructor.name
            model.ensureId()
            model.createdAt = model.createdAt || new Date()
            model.updatedAt = new Date()

            return {
                ...acc, [namespace]: {
                    ...(acc[namespace] || {}),
                    [model.id]: model
                }
            }
        }, state.data)

        Vue.set(state, "data", data)
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
    data: MODELS.reduce((acc, model) => ({...acc, [model.name]: {}}), {})
}

const getters = {
    authConfig(state) {
        return {...state.auth.config, ...state.auth.creds}
    },
    lookup(state) {
        return (namespace) => Object.values(state.data[namespace] || {})
    },
    isAuthed(state) {
        return state.auth.active
    },
    spreadsheetId(state) {
        return state.auth.creds.spreadsheetId
    },
    calendarId(state) {
        return state.auth.creds.calendarId
    },
    lastAttendanceFor(state, getters) {
        return (user, event) => getters
            .lookup(Attendance.name)
            .sort((a, b) => b.signedIn - a.signedIn)
            .reduce((acc, record) => acc || record.eventId === event.id && record.userId === user.id && record, undefined)
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

store.watch((state) => state.auth.creds, (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth))
    google.auth(store.getters.authConfig, signInListener.bind(signInListener, store))
}, {deep: true})

store.watch((state, getters) => getters.isAuthed, (isAuthed) => {
    if (!isAuthed) return

    createSpreadsheet(store.getters.spreadsheetId)
        .then((res) => fetchData(store, res.spreadsheetId, store.getters.calendarId))
        .then(([spreadsheet, events]) => storeData(store, spreadsheet, events))
})
store.watch((state) => state.data, (data) => {
    if (!store.getters.spreadsheetId) return

    const spreadsheetId = store.getters.spreadsheetId
    const spreadsheetData = Object.keys(data).reduce((acc, key) => ({
        ...acc,
        [key]: Object.values(data[key]).map((model) => model.toArray())
    }), {})
    google.persistSpreadsheetValues(spreadsheetId, spreadsheetData)
}, {deep: true})

google.auth(store.getters.authConfig, signInListener.bind(signInListener, store))

export default store
