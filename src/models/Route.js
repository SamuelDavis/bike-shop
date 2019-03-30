export default class Route {
    constructor(path, component) {
        this.path = path;
        this.component = component;
        this.alias = undefined;
        this.props = true;
    }

    withAlias(alias) {
        this.alias = alias;
        return this;
    }

    toString(props = {}) {
        return this.path
            .split("/")
            .map((chunk) => {
                const matches = chunk.match(/:([^:\?]+)\??/) || [];
                const prop = matches.pop() || chunk;
                return matches.length ? props[prop] : prop;
            })
            .join("/");
    }
}