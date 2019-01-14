import store from "./store.js"
import router from "./router.js"
import AppNav from "./components/AppNav.js"

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
