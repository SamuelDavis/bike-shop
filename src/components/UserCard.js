import {noop} from "../util/misc.js"
import User from "../data/User.js"

export default {
    template: "#user-card-template",
    props: {
        user: {
            type: User,
            default: () => new User()
        },
        onClick: {
            type: Function,
            default: noop
        }
    },
    computed: {
        clickable() {
            return this.onClick !== noop
        },
        classes() {
            return ["card"].concat(this.user.active
                ? ["bg-light"]
                : ["text-light", "bg-secondary"])
        },
        styles() {
            return {cursor: this.clickable ? "pointer" : undefined}
        }
    }
}
