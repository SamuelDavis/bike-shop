export function noop() {
    return undefined
}

export function proxy(thing = () => ({then: () => Promise.reject(new Error("Proxy fail."))})) {
    return new Proxy(thing, {
        get(src, prop) {
            return prop in src ? proxy(src[prop]) : proxy()
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

export function log(thing) {
    console.log(thing)
    return thing
}

export function extractForm(form) {
    return [...new FormData(form)]
        .reduce((acc, [key, val]) => ({...acc, [key]: val}), {})
}

export function errorHandler(err) {
    console.error(err.error && err.error.error ? err.error.error : err)
}

export function fuzzySearch(term = "", items = [], props = []) {
    const search = new RegExp(term.split("").reduce((acc, char) => `${acc}${char}.*`, "^.*") + "$", "i")
    return items.filter((user) => props.reduce((acc, prop) => acc || search.exec(user[prop]), false))
}
