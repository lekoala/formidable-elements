import DataTableElement from "./classes/DataTableElement.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "../node_modules/tabulator-tables/dist/css/tabulator_bootstrap5.min.css";
//@ts-ignore
import customStyles from "./css/tabulator-grid.min.css";
import injectStyles from "./utils/injectStyles.js";

// injectStyles("data-table", styles.replace("/*# sourceMappingURL=tabulator_bootstrap5.min.css.map */", "") + customStyles);

defineEl("data-table", DataTableElement);

export default DataTableElement;
