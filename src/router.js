import Route from "./models/Route.js"
import AttendancePage from "./components/AttendancePage.js"
import AuthPage from "./components/AuthPage.js"
import UserForm from "./components/UserForm.js"
import UserPage from "./components/UsersPage.js"

export default new VueRouter({
    routes: [
        new Route("/", "Home", AttendancePage),
        new Route("/users", "Users", UserPage),
        new Route("/user/:id?", "User", UserForm).isHidden(),
        new Route("/auth", "Auth", AuthPage)
    ]
})

