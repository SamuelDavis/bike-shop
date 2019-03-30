import CalendarEvent from "./models/data/CalendarEvent.js";
import Person from "./models/data/Person.js";

const DATA_MAP = [CalendarEvent, Person].reduce((acc, dat) => ({...acc, [dat.namespace]: dat}), {});
const appNamespace = "NCCDB";
const state = {
    data: Object.keys(DATA_MAP).reduce((acc, namespace) => ({...acc, [namespace]: {}}), {}),
    appNamespace,
    googleApiKey: undefined,
    googleClientId: undefined,
    googleCalendarId: undefined,
    ...JSON.parse(localStorage.getItem(appNamespace) || "{}")

};
new Array(3).fill(undefined).forEach((_, i) => {
    const datum = new Person({
        id: Person.namespace + i,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: `Person ${i}`,
        address: `Address ${i}`,
        phone: `Phone ${i}`
    });
    state.data[Person.namespace][datum.id] = datum;
});

export const mutations = {
    putConfig(state, config) {
        localStorage.setItem(state.appNamespace, JSON.stringify(config));
        for (let prop in config) state[prop] = config[prop];
    },
    putDatum(state, datum) {
        datum.id = datum.id || Math.random().toString(10).slice(2);
        datum.createdAt = datum.createdAt || new Date().toJSON();
        datum.updatedAt = new Date().toJSON();
        Vue.set(state.data[datum.namespace], datum.id, datum);
    },
};
export const actions = {
    putDatum(store, datum) {
        return Promise.resolve(store.commit(mutations.putDatum.name, datum));
    },
};
export const getters = {
    appNamespace(state) {
        return state.appNamespace;
    },
    data(state) {
        return function () {
            if (arguments.length === 1)
                return Object.values(state.data[arguments[0]]);
            const [namespace, id] = arguments;
            return state.data[namespace][id];
        };
    },
    googleConfig(state) {
        return {
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: ["https://www.googleapis.com/auth/calendar.readonly"].join(" "),
            apiKey: state.googleApiKey,
            clientId: state.googleClientId,
            calendarId: state.googleCalendarId,
        };
    },
};

export default new Vuex.Store({state, mutations, actions, getters});