import Route from "./models/Route.js"
import HomePage from "./components/HomePage.js"
import DataStorePage from "./components/DataStorePage.js"

export default new VueRouter({
    mode: 'history',
    routes: [
        new Route("/", "Home", HomePage),
        new Route("/data", "Data", DataStorePage),
        ...["Foo", "Bar", "Qux"]
            .map((label) => new Route(label.toLowerCase(), label, {template: `<h1>${label}</h1>`}))
    ]
})

