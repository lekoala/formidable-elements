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
  .iti__arrow { border: none }
  .input-group .iti .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0}`
);

defineEl("tel-input", TelInput);

export default TelInput;
