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
            const attributes = {
                attrs: {type, value: this.value, class: ["custom-select"], ...this.meta}
            }
            let children = []
            if (this.data instanceof Array) children = this.data.map(([value, label]) => {
                return createElement("option", {
                    attrs: {value, selected: this.value === value}
                }, label)
            })
            return createElement("select", attributes, children)
        }

        if (type === "checkbox") {
            const attributes = {
                attrs: {type, checked: this.value}
            }
            return createElement("checkbox", attributes, [])
        }

        const attributes = {
            attrs: {type, value: this.value, class: ["form-control"], ...this.meta}
        }

        return createElement("input", attributes, [])
    }
}
