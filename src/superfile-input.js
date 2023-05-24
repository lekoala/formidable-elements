import SuperfileElement from "./classes/SuperfileElement.js";
import defineEl from "./utils/defineEl.js";
import injectStyles from "./utils/injectStyles.js";

injectStyles(
  "superfile-input",
  `img:not([src]) {
    display: none;
  }
  .superfile:not(.superfile-ready) {
    visibility: hidden;
  }
  .superfile-drag input {
    background: var(--bs-highlight-bg, palegoldenrod);
  }`
);

defineEl("superfile-input", SuperfileElement);

export default SuperfileElement;
