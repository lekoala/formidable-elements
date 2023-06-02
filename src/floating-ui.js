import FloatingUi from "./classes/FloatingUi.js";
import defineEl from "./utils/defineEl.js";
import injectStyles from "./utils/injectStyles.js";

injectStyles(
  "floating-ui",
  `floating-ui:not(.is-active) {
    display: none;
}
floating-ui {
    --arrow-height: var(--bs-tooltip-arrow-height, 6px);
    --arrow-width: var(--bs-tooltip-arrow-width, 6px);
    z-index: 9999;
    isolation: isolate;
    width: max-content;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
}
`
);

defineEl("floating-ui", FloatingUi);

export default FloatingUi;
