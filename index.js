import main from "./src/main.js"
import {errorHandler} from "./src/util/misc.js"

addEventListener("error", errorHandler)
document.addEventListener("DOMContentLoaded", main)
