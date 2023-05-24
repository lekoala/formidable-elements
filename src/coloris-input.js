import ColorisInput from "./classes/ColorisInput.js";
import defineEl from "./utils/defineEl.js";
// @ts-ignore
import styles from "../node_modules/@melloware/coloris/dist/coloris.min.css";
import injectStyles from "./utils/injectStyles.js";

// Inject styles + init once
injectStyles(
  "coloris-input",
  `${styles} 
    .clr-field {display: block;width: 4em;border-radius: var(--bs-border-radius, 0.25rem);overflow: hidden;}
    .clr-field input {cursor: pointer;}
    .clr-field button {width:100%;}`
);

defineEl("coloris-input", ColorisInput);

export default ColorisInput;
