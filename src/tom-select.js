import TomSelectElement from "./classes/TomSelectElement.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "../node_modules/tom-select/dist/css/tom-select.bootstrap5.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles("tom-select", styles.replace("/*# sourceMappingURL=tom-select.bootstrap5.min.css.map */", ""));

defineEl("tom-select", TomSelectElement);

export default TomSelectElement;
