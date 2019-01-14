import {promisify} from "./promise.js"
import {proxy} from "./proxy.js"
import {noop} from "./misc.js"

function thenify(request) {
    return promisify(request.then.bind(request))
}

function getClient() {
    return proxy(gapi.client)
}

function getAuth() {
    return proxy(gapi.auth2).getAuthInstance() || proxy()
}

const google = {
    init: {
        loadLibrary(library = "client:auth2") {
            return new Promise((resolve, reject) => {
                gapi.load(library, () => {
                    gapi.client
                        ? resolve()
                        : reject(new Error("Failed to initialize gapi client."))
                })
            })
        },
        setConfig(config) {
            const request = getClient().init(config)
            return thenify(request)
        }
    },
    auth: {
        setSignInListener(cb) {
            getAuth().isSignedIn.listen(cb)
        },

        getStatus() {
            return getAuth().isSignedIn.get()
        },

        signIn() {
            const request = getAuth().signIn()
            return thenify(request)
        },

        signOut() {
            const request = getAuth().signOut()
            return thenify(request)
        }
    },
    calendar: {
        fetchEvents(calendarId, from = new Date()) {
            const request = getClient().calendar.events.list({calendarId, timeMin: from.toISOString()})

            return thenify(request)
                .then((res) => res.result.items.map((raw) => {
                    const [start, end] = [raw.start, raw.end]
                        .map((val) => val ? val.dateTime || val.date : undefined)
                    return {
                        ...raw,
                        start: start && new Date(start) || undefined,
                        end: end && new Date(end) || undefined
                    }
                }))
        }
    },
    spreadsheet: {
        create(title, namespaces = []) {
            const request = getClient().sheets.spreadsheets.create({}, {
                properties: {title},
                sheets: namespaces.map((namespace) => {
                    return {properties: {title: namespace}}
                }, [])
            })
            return thenify(request)
        },
        fetch(spreadsheetId) {
            const request = getClient().sheets.spreadsheets.get({spreadsheetId})
            return thenify(request)
                .then((res) => ({
                    spreadsheetId: res.result.spreadsheetId,
                    spreadsheetUrl: res.result.spreadsheetUrl,
                    ranges: res.result.sheets.map((sheet) => sheet.properties.title)
                }))
        },
        fetchData(spreadsheetId, ranges) {
            const request = getClient().sheets.spreadsheets.values.batchGet({spreadsheetId, ranges})
            return thenify(request)
                .then((res) => {
                    return res.result.valueRanges.reduce((acc, valueRange) => {
                        const namespace = valueRange.range.split("!")[0]
                        const records = valueRange.values || []
                        return {...acc, [namespace]: records}
                    }, {})
                })
        },
        persistSheets(spreadsheetId, names) {
            const requests = names.map((name) => ({addSheet: {properties: {title: name}}}))
            const request = getClient().sheets.spreadsheets.batchUpdate({spreadsheetId}, {requests})
            return thenify(request)
        },
        persistData(spreadsheetId, data) {
            const resource = {
                valueInputOption: "USER_ENTERED",
                data: Object.keys(data).map((key) => ({
                    range: `${key}!A1:Z99999`,
                    values: data[key]
                }))
            }
            const request = getClient().sheets.spreadsheets.values.batchUpdate({spreadsheetId, resource})
            return thenify(request)
                .then((res) => res.result.responses)
        }
    }
}

export function auth(config, listener = noop) {
    return google.init
        .loadLibrary()
        .then(() => {
            return google.init.setConfig(config)
        })
        .then(() => {
            google.auth.setSignInListener(listener)
            listener(google.auth.getStatus())
            return google.auth.getStatus()
                ? Promise.resolve()
                : google.auth.signIn()
        })
}

export function fetchSpreadsheet(spreadsheetId) {
    return google.spreadsheet
        .fetch(spreadsheetId)
        .then((spreadsheet) => google.spreadsheet
            .fetchData(spreadsheetId, spreadsheet.ranges)
            .then((data) => ({...spreadsheet, data}))
        )
}

export function persistSpreadsheetValues(spreadsheetId, data) {
    return google.spreadsheet
        .fetch(spreadsheetId)
        .then((spreadsheet) => {
            const ranges = Object.keys(data).filter((key) => !spreadsheet.ranges.includes(key))
            return ranges.length
                ? google.spreadsheet.persistSheets(spreadsheetId, ranges)
                : Promise.resolve()
        })
        .then(() => google.spreadsheet.persistData(spreadsheetId, data))
}

export const fetchEvents = google.calendar.fetchEvents.bind(google.calendar)
export const createSpreadsheet = google.spreadsheet.create.bind(google.spreadsheet)
export const signIn = google.auth.signIn.bind(google.auth)
export const signOut = google.auth.signOut.bind(google.auth)
