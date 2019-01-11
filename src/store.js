const state = {
    idCount: {},
    auth: {
        clientId: "",
        apiKey: "",
        spreadsheetId: "",
        calendarId: ""
    }
}

export const mutations = {
    saveModel(state, model) {
        const namespace = model.constructor.name
        Vue.set(state, namespace, state[namespace] || [])

        if (model.id === undefined) {
            const id = state.idCount[namespace] || 1
            model.id = id
            Vue.set(state.idCount, namespace, id + 1)
        }
        model.createdAt = model.createdAt || new Date()
        model.updatedAt = new Date()

        const index = state[namespace].findIndex((item) => item.id === model.id)

        Vue.set(state[namespace], index === -1 ? state[namespace].length : index, model)
    },
    removeModel(state, model) {
        const namespace = model.constructor.name
        const index = state[namespace].findIndex((item) => item.id === model.id)
        delete state[namespace].splice(index, 1)
    },
    updateAuth(state, auth) {
        state.auth = auth
    }
}

const getters = {
    lookup(state) {
        return (namespace) => state[namespace] || []
    },
    fuzzySearchTerm(state) {
        return new RegExp(state.searchTerm
            .replace(/[\s]+/g, " ")
            .trim()
            .split("")
            .reduce((acc, term) => `${acc}${term}.*`, ".*"), "i")
    },
    fuzzySearch(state, getters) {
        return function (data, props = []) {
            return Object.values(data).filter((item) => {
                const searchable = props.length
                    ? props.reduce((acc, prop) => ({...acc, [prop]: item[prop]}), {})
                    : item
                return getters.fuzzySearchTerm.exec(JSON.stringify(searchable))
            })
        }
    }
}

export function seed(store) {
    return store
}

export default new Vuex.Store({
    state,
    mutations,
    getters
})
