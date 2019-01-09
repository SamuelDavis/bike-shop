import Route from "./models/Route.js"

export default new VueRouter({
    mode: 'history',
    routes: ["Foo", "Bar", "Qux"]
        .map((label) => new Route(label.toLowerCase(), label, {template: `<h1>${label}</h1>`}))
})

