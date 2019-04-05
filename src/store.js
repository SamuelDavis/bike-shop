import CalendarEvent from "./models/data/CalendarEvent.js";
import Person from "./models/data/Person.js";
import Attendance from "./models/data/Attendance.js";
import {parseQuery, seed} from "./util/index.js";

const DATA_MAP = [CalendarEvent, Person, Attendance].reduce((acc, dat) => ({...acc, [dat.namespace]: dat}), {});
const appNamespace = "NCCDB";
const state = _.merge({
        data: Object.keys(DATA_MAP).reduce((acc, namespace) => ({...acc, [namespace]: seed(namespace)}), {}),
        config: {
            google: {
                apiKey: undefined,
                clientId: undefined,
                calendarId: undefined,
            },
        },
        appNamespace,
    },
    JSON.parse(localStorage.getItem(appNamespace) || "{}"),
    parseQuery());

export const mutations = {
    putConfig(state, config) {
        state.config = _.merge(state.config, config);
        localStorage.setItem(state.appNamespace, JSON.stringify({config: state.config}));
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
            ...state.config.google,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: ["https://www.googleapis.com/auth/calendar.readonly"].join(" "),
        };
    },
    lastAttendanceFor(state, getters) {
        return (event, person) => {
            return getters.data(Attendance.name)
                .sort((a, b) => a.signedInAt - b.signedInAt)
                .reduce((acc, record) => ({
                    ...acc,
                    [record.eventId]: {
                        ...(acc[record.eventId] || {}),
                        [record.personId]: record
                    }
                }), {[event.id]: {}})[event.id][person.id];
        };
    }
};

export default new Vuex.Store({state, mutations, actions, getters});