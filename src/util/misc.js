import * as flash from "./flash.js"

export function noop() {
    return undefined
}

export function proxy(thing = () => ({then: () => Promise.reject(new Error("Proxy fail."))})) {
    return new Proxy(thing, {
        get(src, prop) {
            if (prop in src) {
                return typeof src[prop] === "object"
                    ? proxy(src[prop])
                    : src[prop]
            }

            return proxy()
        }
    })
}

export function promisify(cb) {
    return new Promise((res) => {
        return cb(res)
    })
}

export function parseQuery(query = window.location.search.slice(1)) {
    return query
        .split("&")
        .reduce((acc, part) => {
            const [key, value] = part.split("=").map((str) => decodeURI(str))
            return {...acc, [key]: value}
        }, {})
}

export function buildQuery(obj = {}) {
    return "?" + Object.keys(obj)
        .filter((prop) => obj[prop] !== undefined)
        .map((prop) => `${encodeURI(prop)}=${encodeURI(obj[prop])}`)
        .join("&")
}

export function log(thing) {
    console.log(thing)
    return thing
}

export function extractForm(form) {
    return [...new FormData(form)]
        .reduce((acc, [key, val]) => {
            if (key in acc) {
                return (acc[key] instanceof Array)
                    ? {...acc, [key]: [...acc[key], val]}
                    : {...acc, [key]: [acc[key], val]}
            }
            return ({...acc, [key]: val})
        }, {})
}

export function errorHandler(err) {
    flash.danger(proxy(err).error.result.error.message || err.message, 0)
    console.error(err)
}

export function fuzzySearch(term = "", items = [], props = []) {
    const search = new RegExp(term.split("").reduce((acc, char) => `${acc}${char}.*`, "^.*") + "$", "i")
    return items.filter((user) => props.reduce((acc, prop) => acc || search.exec(user[prop]), false))
}
