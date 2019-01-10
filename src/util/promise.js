export function promisify(cb) {
    return new Promise((res) => {
        return cb(res)
    })
}
