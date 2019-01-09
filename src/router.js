import Route from "./models/Route.js"
import DataStore from "./components/DataStore.js"

export default new VueRouter({
    mode: 'history',
    routes: [
        new Route("/data", "Data", DataStore),
        ...["Foo", "Bar", "Qux"]
            .map((label) => new Route(label.toLowerCase(), label, {template: `<h1>${label}</h1>`}))
    ]
})

