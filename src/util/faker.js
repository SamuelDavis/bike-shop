export function int(len = 3) {
    return parseInt(new Array(len)
        .fill(undefined)
        .reduce((acc) => `${acc}${randFrom(numbers)}`, ""), 10)
}

const numbers = "0123456789"
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const chars = `${letters}${numbers}`

export function str(len = 12) {
    return new Array(len)
        .fill(undefined)
        .reduce((acc) => `${acc}${randFrom(chars)}`, "")
}

export function randFrom(set) {
    return set[Math.floor(Math.random() * set.length)]
}

export function bool() {
    return Math.random() >= 0.5
}

