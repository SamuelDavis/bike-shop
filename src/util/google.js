import {noop, promisify} from "./index.js";

function thenify(request) {
    return promisify(request.then.bind(request));
}

function getClient() {
    if (!gapi.hasOwnProperty("client"))
        throw new Error("Google client unloaded.");
    return gapi.client;
}

function getAuth() {
    const instance = gapi.auth2.getAuthInstance();
    if (!instance) throw new Error("Google is unauthenticated.");
    return instance;
}

export function isAuthed() {
    return getAuth().isSignedIn.get();
}

export function load() {
    return typeof gapi === "undefined"
        ? new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearInterval(interval);
                clearTimeout(timeout);
                reject();
            }, 2000);
            const interval = setInterval(() => {
                if (typeof gapi === "undefined") return;
                clearInterval(interval);
                clearTimeout(timeout);
                resolve();
            });
        })
        : Promise.resolve();
}

export function auth(config, authListener = noop) {
    return new Promise((resolve, reject) => {
        gapi.load("client:auth2", {
            timeout: 3000,
            onerror: reject,
            ontimeout: reject,
            callback: () => thenify(getClient().init({...config}))
                .then(() => {
                    getAuth().isSignedIn.listen(authListener);
                    authListener(isAuthed());
                    return resolve();
                })
                .catch(reject)
        });
    });
}

export function listEvents(opts = {}) {
    const timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    const payload = {
        calendarId: "primary",
        timeMin,
        timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
        ...opts
    };
    return thenify(getClient().calendar.events.list(payload))
        .then((res) => res.result.items.map((raw) => {
            const [start, end] = [raw.start, raw.end].map((val) => val ? val.dateTime || val.date : undefined);
            return {...raw, start: start && new Date(start), end: end && new Date(end)};
        }));
}


export function signIn() {
    return getAuth().signIn();
}

export function signOut() {
    return getAuth().signOut();
}
