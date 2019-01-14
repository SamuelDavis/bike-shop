export default class Route {
    constructor(path, label, component) {
        this.path = path
        this.label = label
        this.name = label
        this.component = component
    }
}
