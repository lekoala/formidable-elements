import FlatpickrInput from "./classes/FlatpickrInput.js";
import defineEl from "./utils/defineEl.js";
// @ts-ignore
import styles from "../node_modules/flatpickr/dist/flatpickr.min.css";
// @ts-ignore
import confirmDateStyles from "../node_modules/flatpickr/dist/plugins/confirmDate/confirmDate.css";
// @ts-ignore
import monthSelectStyles from "../node_modules/flatpickr/dist/plugins/monthSelect/style.css";
import injectStyles from "./utils/injectStyles.js";

// bootstrap compat
const customStyles = `input.flatpickr-input.form-control[readonly] {
    background-color: var(--bs-body-bg, #fff);
    border-color: var(--bs-border-color, #dee2e6);
}`;

// Inject styles
injectStyles("flatpickr-input", styles + confirmDateStyles + monthSelectStyles + customStyles);

defineEl("flatpickr-input", FlatpickrInput);

export default FlatpickrInput;
