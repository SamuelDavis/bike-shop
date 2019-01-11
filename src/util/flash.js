const defaultTimeout = 2000
const list = {
    INFO: "info",
    SUCCESS: "success",
    DANGER: "danger"
}

function flash(type = list.INFO, text, timeout = defaultTimeout) {
    const div = document.createElement("div")
    div.setAttribute("class", `alert alert-${type} position-sticky`)
    div.setAttribute("role", "alert")
    div.innerText = text
    const remove = () => document.body.removeChild(div)

    const btn = document.createElement("button")
    btn.setAttribute("class", "close")
    btn.setAttribute("type", "button")
    btn.innerHTML = "&times;"
    btn.addEventListener("click", remove)

    div.appendChild(btn)

    document.body.prepend(div)

    if (timeout > 0) setTimeout(remove, timeout)
}

export const info = flash.bind(flash, list.INFO)
export const success = flash.bind(flash, list.SUCCESS)
export const danger = flash.bind(flash, list.DANGER)
