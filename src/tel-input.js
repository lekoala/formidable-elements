import TelInput from "./classes/TelInput.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
// import styles from "../node_modules/intl-tel-input/build/css/intlTelInput.min.css";
// Opiniated styles
// No flags by default
import styles from "./css/tel-input.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles(
  "tel-input",
  `${styles}
  .iti__flag + .iti__selected-dial-code { margin-inline-start: 6px }
  .iti__selected-dial-code { min-width: 3ch }
  .iti__dropdown-content { overflow: hidden }
  .iti--allow-dropdown .iti__flag-container .iti__selected-flag { background-color: var(--bs-tertiary-bg, rgba(0,0,0,.05));}
  .iti--allow-dropdown .iti__flag-container .iti__selected-flag { border-top-left-radius: var(--bs-border-radius); border-bottom-left-radius: var(--bs-border-radius)}
  .input-group .iti .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0}`
);

defineEl("tel-input", TelInput);

export default TelInput;
