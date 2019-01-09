export function extractForm(form) {
    return [...new FormData(form)]
        .reduce((acc, [key, val]) => ({...acc, [key]: val}), {})
}
