export function proxy(thing = () => ({then: () => Promise.reject(new Error("Proxy fail."))})) {
    return new Proxy(thing, {
        get(src, prop) {
            return prop in src ? proxy(src[prop]) : proxy()
        }
    })
}
