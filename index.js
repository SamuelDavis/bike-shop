import {errorHandler} from "./src/util/index.js";
import main from "./src/main.js";

Vue.config.errorHandler = errorHandler;
document.addEventListener("error", errorHandler);
document.addEventListener("DOMContentLoaded", main);
