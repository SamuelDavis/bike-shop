export default class Route {
    constructor(path, label, component) {
        this.path = path
        this.label = label
        this.name = label
        this.component = component
        this.hidden = false
    }

    isHidden() {
        this.hidden = true
        return this
    }
}
