import AppNav from "./components/AppNav.js"
import router from "./router.js"

document.addEventListener("DOMContentLoaded", () => {
    new Vue({
        el: "#app",
        template: "#app-template",
        router,
        components: {
            "app-nav": AppNav
        }
    })
})
