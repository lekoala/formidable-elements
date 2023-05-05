// @ts-ignore
import styles from "../node_modules/@melloware/coloris/dist/coloris.min.css";
import Coloris from "@melloware/coloris";
import FormidableElement from "./utils/formidable-element.js";
import injectStyles from "./utils/injectStyles.js";
import setId from "./utils/setId.js";
import isRTL from "./utils/isRTL.js";

// Example
/* <label for="primary_color-input" class="form-label">Primary color</label>
<coloris-input data-config='{"swatches": ["#fff", "#000"] }'>
    <input type="text" class="form-control" id="primary_color-input" name="primary_color">
</coloris-input> */

/**
 * @type {("light"|"dark"|"auto")}
 */
// @ts-ignore
const themeMode = document.documentElement.dataset.bsTheme || "auto";
const rtl = isRTL();
const name = "coloris-input";

// Inject styles + init once
injectStyles(
  name,
  `${styles} 
  .clr-field {display: block;width: 4em;border-radius: var(--bs-border-radius, 0.25rem);overflow: hidden;}
  .clr-field input {cursor: pointer;}
  .clr-field button {width:100%;}`
);

// Only once! after, use .set
Coloris.init();

class ColorisInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    const id = setId(this.el, name);
    this.el.autocomplete = "off";

    // el, wrap, rtl, inline, defaultColor and a11y can only be set globally
    Coloris.coloris({
      el: `#${id}`,
      rtl: rtl,
      themeMode: themeMode,
    });
    // parent, theme, themeMode, margin, format, formatToggle, focusInput, selectInput, swatchesOnly, alpha, forceAlpha, swatches
    //@ts-ignore
    Coloris.set(`#${id}`, this.config);
  }

  destroyed() {
    const id = this.el.id;
    Coloris.removeInstance(`#${id}`);
  }
}

if (!customElements.get(name)) {
  customElements.define(name, ColorisInput);
}

export default ColorisInput;
