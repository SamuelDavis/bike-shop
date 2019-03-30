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
