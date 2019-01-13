export default {
    props: {
        type: {
            type: [Function, String],
            default: String
        },
        data: {},
        value: {},
        meta: {
            type: Object,
            default: () => {
            }
        }
    },
    render(createElement) {
        const type = typeof this.type === "string"
            ? this.type
            : {
                [Boolean]: "checkbox",
                [String]: "text",
                [Number]: "number",
                [Date]: "date",
                [Object]: "select",
                [Array]: "select"
            }[this.type]

        if (type === "select") {
            const attributes = {}
            let children = []
            if (this.data instanceof Array) {
                children = this.data.map(([value, label]) => createElement("option", {
                    attrs: {value, selected: this.value === value}
                }, label))
            } else if (this.data instanceof Object) {
                children = Object
                    .keys(this.data || {})
                    .map((key) => createElement("option", {
                        attrs: {value: this.data[key], selected: this.value === key}
                    }, this.data[key]))
            }
            return createElement("select", attributes, children)
        }

        if (type === "checkbox") {
            return createElement("checkbox", {attrs: {checked: this.data}}, [])
        }

        const attributes = {
            attrs: {type, value: this.value, class: ["form-control"], ...this.meta}
        }

        return createElement("input", attributes, [])
    }
}
