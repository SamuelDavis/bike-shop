import {promisify} from "./promise.js"
import Event from "../models/Event.js"
import {proxy} from "./proxy.js"

function getClient() {
    return proxy(gapi.client)
}

function loadLibrary(library = "client:auth2") {
    return new Promise((resolve, reject) => {
        gapi.load(library, () => {
            gapi.client
                ? resolve()
                : reject(new Error("Failed to initialize gapi client."))
        })
    })
}

function setConfig(config) {
    const request = getClient().init(config)
    return promisify(request.then.bind(request))
}

export function setSignInListener(cb) {
    gapi.auth2.getAuthInstance().isSignedIn.listen(cb)
}

export function getAuthStatus() {
    return gapi.auth2.getAuthInstance().isSignedIn.get()
}

export function authDataStore(config) {
    return loadLibrary()
        .then(() => setConfig(config))
}

export function signin() {
    return gapi.auth2.getAuthInstance().signIn()
}

export function signout() {
    return gapi.auth2.getAuthInstance().signOut()
}

export function createDataStore(title, namespaces = []) {
    const request = getClient().sheets.spreadsheets.create({}, {
        properties: {title},
        sheets: namespaces.map((namespace) => {
            return {properties: {title: namespace}}
        }, [])
    })
    return promisify(request.then.bind(request))
}

export function clearDataStore(spreadsheetId, namespaces = []) {
    const requests = namespaces.map((namespace) => {
        const params = {
            spreadsheetId,
            range: namespace
        }
        const clearValuesRequestBody = {}
        const request = getClient().sheets.spreadsheets.values.clear(params, clearValuesRequestBody)
        return promisify(request.then.bind(request))
    })

    return Promise.all(requests)
}

export function exportDataStore(spreadsheetId, state) {
    const data = Object.keys(state).map((key) => {
        const range = `${key}!A1:Z99999`
        const values = state[key].map((record) => Object.values(record))
        return {range, values}
    })
    const body = {data, valueInputOption: "USER_ENTERED"}
    const request = getClient().sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        resource: body
    })
    return promisify(request.then.bind(request))
}

export function fetchDataStore() {
    const ranges = Object.keys(this.$store.state)
    const request = getClient().sheets.spreadsheets.values.batchGet({
        spreadsheetId: this.config.spreadsheetId,
        ranges
    })
    return promisify(request.then.bind(request))
        .then((response) => {
            return response.result.valueRanges.reduce((acc, valueRange) => {
                const namespace = valueRange.range.split("!")[0]
                const records = valueRange.values
                return {...acc, [namespace]: records}
            }, {})
        })
}

export function fetchCalendarEvents(calendarId = "primary", from = new Date()) {
    const request = getClient().calendar.events.list({
        calendarId: calendarId,
        timeMin: from.toISOString()
    })

    return promisify(request.then.bind(request))
        .then((res) => res.result.items.map((raw) => {
            const [start, end] = [raw.start, raw.end].map((val) => val ? val.dateTime || val.date : undefined)
            return new Event({
                ...raw,
                start: start && new Date(start) || undefined,
                end: end && new Date(end) || undefined
            })
        }))
}
