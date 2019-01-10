export function promisify(cb) {
    return new Promise((res, rej) => cb(res, rej))
}
