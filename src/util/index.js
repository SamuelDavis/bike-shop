import Person from "../models/data/Person.js";
import CalendarEvent from "../models/data/CalendarEvent.js";

export function seed(namespace) {
    let models;
    switch (namespace) {
        case Person.namespace:
            models = new Array(3)
                .fill(undefined)
                .map((_, i) => new Person({
                    id: Person.namespace + i,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: `Person ${i}`,
                    address: `Address ${i}`,
                    phone: `${i}1231231234`
                }));
            break;
        case CalendarEvent.namespace:
            models = new Array(3)
                .fill(undefined)
                .map((_, i) => new CalendarEvent({
                    id: CalendarEvent.namespace + i,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: `Event ${i}`,
                    location: `Place ${i}`,
                    description: `Description ${i}`,
                    startsAt: new Date(),
                    endsAt: new Date()
                }));
            break;
        default:
            models = [];
    }
    return models.reduce((acc, model) => ({...acc, [model.id]: model}), {});
}

export function errorHandler(e) {
    alert(e.message || "Unknown error occurred. Please check the console.");
    console.error(e);
}

export function noop() {
    return undefined;
}

export function promisify(cb) {
    return new Promise((resolve, reject) => cb(resolve, reject));
}

export function extractForm(form) {
    return [...new FormData(form)]
        .reduce((acc, [key, val]) => {
            if (key in acc) {
                return (acc[key] instanceof Array)
                    ? {...acc, [key]: [...acc[key], val]}
                    : {...acc, [key]: [acc[key], val]};
            }
            return ({...acc, [key]: val});
        }, {});
}

export function parseQuery(query = window.location.search.slice(1, -1)) {
    const queryVars = query
        .split("&")
        .reduce((acc, part) => {
            const [key, value] = part.split("=").map((str) => decodeURI(str));
            return {...acc, [key]: value};
        }, {});
    return nest(queryVars);
}

export function nest(obj) {
    return Object.keys(obj).reduce((acc, nestedKey) => {
        const keys = nestedKey.split(".").reverse();
        const key = keys.shift();
        const nesting = keys.reduce((acc, key) => ({[key]: acc}), {[key]: obj[nestedKey]});
        return _.merge(acc, nesting);
    }, {});
}