import DataTableElement from "./classes/DataTableElement.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "../node_modules/datatables.net-bs5/css/dataTables.bootstrap5.min.css";
//@ts-ignore
import styles2 from "../node_modules/datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
//@ts-ignore https://datatables.net/extensions/fixedcolumns/
import styles3 from "../node_modules/datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
//@ts-ignore https://datatables.net/extensions/fixedheader/
import styles4 from "../node_modules/datatables.net-fixedheader-bs5/css/fixedHeader.bootstrap5.min.css";
//@ts-ignore https://datatables.net/extensions/responsive/
import styles5 from "../node_modules/datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
//@ts-ignore https://datatables.net/extensions/rowgroup/
import styles6 from "../node_modules/datatables.net-rowgroup-bs5/css/rowGroup.bootstrap5.min.css";
//@ts-ignore
import styles7 from "../node_modules/datatables.net-select-bs5/css/select.bootstrap5.min.css";
//@ts-ignore
import customStyles from "./css/datatables.min";
import injectStyles from "./utils/injectStyles.js";

injectStyles("data-table", styles + styles2 + styles3 + styles4 + styles5 + styles6 + styles7 + customStyles);

defineEl("data-table", DataTableElement);

export default DataTableElement;
