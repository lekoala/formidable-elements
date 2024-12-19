import TelInput from "./classes/TelInput.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
// import styles from "../node_modules/intl-tel-input/build/css/intlTelInput.min.css";
// Opiniated styles
// No flags by default
import styles from "./css/tel-input.min.css";
import injectStyles from "./utils/injectStyles.js";

const extraStyles = `
  .iti__selected-dial-code { padding-right: 0.5em;}
  .iti--allow-dropdown .iti__country-container .iti__selected-country { background-color: var(--bs-tertiary-bg, rgba(0,0,0,.05));}
  .iti--allow-dropdown .iti__country-container .iti__selected-country { border-top-left-radius: var(--bs-border-radius); border-bottom-left-radius: var(--bs-border-radius)}
  .input-group .iti .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0}`;

injectStyles(
    "tel-input",
    `${styles}
${extraStyles}`,
);

defineEl("tel-input", TelInput);

export default TelInput;
