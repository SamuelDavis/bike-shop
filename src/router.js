import Route from "./models/Route.js"
import AttendancePage from "./components/AttendancePage.js"
import AuthPage from "./components/AuthPage.js"
import UserForm from "./components/UserForm.js"

export default new VueRouter({
    mode: 'history',
    routes: [
        new Route("/", "Home", AttendancePage),
        new Route("/user", "User", UserForm),
        new Route("/auth", "Auth", AuthPage),
        ...["Foo", "Bar", "Qux"]
            .map((label) => new Route(label.toLowerCase(), label, {template: `<h1>${label}</h1>`}))
    ]
})

