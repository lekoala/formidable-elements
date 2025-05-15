import Coloris from "@melloware/coloris";
import FormidableElement from "../utils/FormidableElement.js";
import setId from "../utils/setId.js";
import isRTL from "../utils/isRTL.js";

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

// Only once! after, use .set
Coloris.init();

class ColorisInput extends FormidableElement {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
        return this.querySelector("input");
    }

    get value() {
        return this.el.value;
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
        const config = this.config;
        // you can set a shortcut data-swatches attribute if you only want to display a few colors
        if (this.dataset.swatches) {
            config.swatchesOnly = true;
            config.swatches = this.dataset.swatches.split(",");
        }
        Coloris.setInstance(`#${id}`, config);
    }

    destroyed() {
        const id = this.el.id;
        Coloris.removeInstance(`#${id}`);
    }
}

export default ColorisInput;
