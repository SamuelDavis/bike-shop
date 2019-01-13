import errorHandler from "./src/util/errorHandler.js"
import main from "./src/main.js"

addEventListener("error", errorHandler)
document.addEventListener("DOMContentLoaded", main)
