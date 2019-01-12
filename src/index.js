import AppNav from "./components/AppNav.js"
import router from "./router.js"
import store from "./store.js"

export default function () {
    new Vue({
        store,
        el: "#app",
        template: "#app-template",
        router,
        components: {
            "app-nav": AppNav
        }
    })
}
