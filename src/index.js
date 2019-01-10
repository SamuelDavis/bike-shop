import AppNav from "./components/AppNav.js"
import router from "./router.js"

export default function () {
    new Vue({
        el: "#app",
        template: "#app-template",
        router,
        components: {
            "app-nav": AppNav
        }
    })
}
