import * as Google from "./util/google.js"
import User from "./data/User.js"

export const namespaces = ["meta", User.name]

const state = {
    idCount: {},
    isAuthed: false,
    auth: {
        clientId: "",
        apiKey: "",
        spreadsheetId: "",
        calendarId: ""
    },
    data: {}
}

export const mutations = {
    saveModel(state, model) {
        const namespace = model.constructor.name
        Vue.set(state.data, namespace, state.data[namespace] || [])

        if (model.id === undefined) {
            const id = state.idCount[namespace] || 1
            model.id = id
            Vue.set(state.idCount, namespace, id + 1)
        }
        model.createdAt = model.createdAt || new Date()
        model.updatedAt = new Date()

        const index = state.data[namespace].findIndex((item) => item.id === model.id)

        Vue.set(state.data[namespace], index === -1 ? state.data[namespace].length : index, model)
    },
    removeModel(state, model) {
        const namespace = model.constructor.name
        const index = state.data[namespace].findIndex((item) => item.id === model.id)
        delete state.data[namespace].splice(index, 1)
    },
    updateAuth(state, auth) {
        state.auth = auth
    },
    setAuth(state, isAuthed) {
        state.isAuthed = isAuthed
    }
}

const getters = {
    exportData(state) {
        return {
            ...state.data,
            meta: [{value: JSON.stringify(state.idCount)}]
        }
    }
}


export function seed(store) {
    return store
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

store.watch(function (state) {
    return state.data
}, function () {
    if (store.state.isAuthed)
        Google
            .clearDataStore(store.state.auth.spreadsheetId, namespaces)
            .then(() => Google.exportDataStore(store.state.auth.spreadsheetId, store.getters.exportData))
}, {deep: true})

export default store
