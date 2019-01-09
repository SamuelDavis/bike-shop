export function parseQuery(query = window.location.search.slice(1)) {
    return query
        .split("&")
        .reduce((acc, part) => {
            const [key, value] = part.split("=").map((str) => decodeURI(str))
            return {...acc, [key]: value}
        }, {})
}
