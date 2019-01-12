import {promisify} from "./promise.js"
import Event from "../models/Event.js"
import {proxy} from "./proxy.js"


function thenify(request) {
    return promisify(request.then.bind(request))
}

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
    return thenify(request)
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
    const request = gapi.auth2.getAuthInstance().signIn()
    return thenify(request)
}

export function signout() {
    const request = gapi.auth2.getAuthInstance().signOut()
    return thenify(request)
}

export function createSpreadsheet(title, namespaces = []) {
    const request = getClient().sheets.spreadsheets.create({}, {
        properties: {title},
        sheets: namespaces.map((namespace) => {
            return {properties: {title: namespace}}
        }, [])
    })
    return thenify(request)
}

export function clearDataStore(spreadsheetId, namespaces = []) {
    const requests = namespaces.map((namespace) => {
        const params = {
            spreadsheetId,
            range: namespace
        }
        const clearValuesRequestBody = {}
        const request = getClient().sheets.spreadsheets.values.clear(params, clearValuesRequestBody)
        return thenify(request)
    })

    return Promise.all(requests)
}

export function createSheets(spreadsheetId, names) {
    const props = {spreadsheetId}
    const requests = names.map((name) => ({
        addSheet: {
            properties: {
                title: name
            }
        }
    }))
    const body = {requests}
    const request = getClient().sheets.spreadsheets.batchUpdate(props, body)
    return thenify(request)
}

export function exportSpreadsheet(spreadsheetId, data) {
    const resource = {
        valueInputOption: "USER_ENTERED",
        data: Object.keys(data).map((key) => ({
            range: `${key}!A1:Z99999`,
            values: Object.values(data[key]).map((record) => record.toArray())
        }))
    }
    const request = getClient().sheets.spreadsheets.values.batchUpdate({spreadsheetId, resource})
    return thenify(request)
}

export function getSpreadsheet(spreadsheetId, ranges = undefined) {
    const request = getClient().sheets.spreadsheets.get({
        spreadsheetId
    })
    return thenify(request)
}

export function fetchSpreadsheet(spreadsheetId, ranges) {
    const request = getClient().sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges
    })
    return thenify(request)
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

    return thenify(request)
        .then((res) => res.result.items.map((raw) => {
            const [start, end] = [raw.start, raw.end].map((val) => val ? val.dateTime || val.date : undefined)
            return new Event({
                ...raw,
                start: start && new Date(start) || undefined,
                end: end && new Date(end) || undefined
            })
        }))
}
