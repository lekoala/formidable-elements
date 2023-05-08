import TomSelect from "../node_modules/tom-select/src/tom-select.complete.js";
//@ts-ignore
import styles from "../node_modules/tom-select/dist/css/tom-select.bootstrap5.min.css";
import FormidableElement from "./utils/formidable-element.js";
import injectStyles from "./utils/injectStyles.js";
import setId from "./utils/setId.js";
import localeProvider from "./utils/localeProvider.js";

const name = "tom-select";

injectStyles(name, styles);

class TomSelectElement extends FormidableElement {
  /**
   * @returns {HTMLInputElement|HTMLSelectElement}
   */
  get el() {
    return this.querySelector("input,select");
  }

  created() {
    const input = this.el;
    const id = setId(input, name);

    const labels = localeProvider(name) || {};
    const render = this.config.render || {};
    // Bind labels to config
    // @link https://tom-select.js.org/examples/i18n/
    if (labels.option_create) {
      render["option_create"] = (data, escape) => {
        return labels.option_create.replace("{input}", escape(data.input));
      };
    }
    if (labels.no_results) {
      render["no_results"] = (data, escape) => {
        return labels.no_results;
      };
    }
    this.config.render = render;

    this.tomselect = new TomSelect(`#${id}`, this.config);
  }

  destroyed() {
    this.tomselect.destroy();
    this.tomselect = null;
  }
}

if (!customElements.get(name)) {
  customElements.define(name, TomSelectElement);
}

export default TomSelectElement;
