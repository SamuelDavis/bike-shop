import Event from "../data/Event.js"
import {noop} from "../util/misc.js"

export default {
    template: "#event-card-template",
    props: {
        event: {
            type: Event,
            default: () => new Event()
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
        styles() {
            return {cursor: this.clickable ? "pointer" : undefined}
        }
    }
}
