import TabulatorGrid from "./classes/TabulatorGrid.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "../node_modules/tabulator-tables/dist/css/tabulator_bootstrap5.min.css";
//@ts-ignore
import customStyles from "./css/tabulator-grid.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles("tabulator-grid", styles.replace("/*# sourceMappingURL=tabulator_bootstrap5.min.css.map */", "") + customStyles);

defineEl("tabulator-grid", TabulatorGrid);

export default TabulatorGrid;
