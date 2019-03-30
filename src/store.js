import CalendarEvent from "./models/data/CalendarEvent.js";

const DATA_MAP = [CalendarEvent].reduce((acc, dat) => ({...acc, [dat.namespace]: dat}), {});
const state = {
    data: Object.keys(DATA_MAP).reduce((acc, namespace) => ({...acc, [namespace]: {}}), {}),
    appNamespace: "NCCDB",
    config: {
        googleApiKey: undefined,
        googleClientId: undefined,
        googleCalendarId: undefined,
    }

};
state.config = {
    ...state.config,
    ...JSON.parse(localStorage.getItem(state.appNamespace) || "{}")
};

export const mutations = {
    putConfig(state, config) {
        localStorage.setItem(state.appNamespace, JSON.stringify(config));
        state.config = config;
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
    config(state) {
        return state.config;
    },
    googleConfig(state) {
        return {
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: ["https://www.googleapis.com/auth/calendar.readonly"].join(" "),
            apiKey: state.config.googleApiKey,
            clientId: state.config.googleClientId,
            calendarId: state.config.googleCalendarId,
        };
    },
};

export default new Vuex.Store({state, mutations, actions, getters});