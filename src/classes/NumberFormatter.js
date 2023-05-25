import FormidableElement from "../utils/FormidableElement.js";
import defaultLang from "../utils/defaultLang.js";
import reflectedProperties from "../utils/reflectedProperties.js";

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * @link https://shoelace.style/components/format-number
 */
class NumberFormatter extends FormidableElement {
  value;
  lang;
  currency;
  percent;

  constructor() {
    super();
    reflectedProperties(this, NumberFormatter.observedAttributes);
  }

  static get observedAttributes() {
    return ["value", "lang", "currency", "percent"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.formatter) {
      if (attrName != "value") {
        this.updateFormatter();
      }
      this.render();
    }
  }

  /**
   * @returns {Intl.NumberFormatOptions}
   */
  getOptions() {
    const defaultFormat = new Intl.NumberFormat();
    const options = Object.assign(defaultFormat.resolvedOptions(), this.config);

    // Autoset style
    if (this.percent) {
      options.style = "percent";
    }
    if (this.currency) {
      options.currency = this.currency;
      options.style = "currency";
    }
    if (options.unit) {
      options.style = "unit";
    }
    return options;
  }

  updateFormatter() {
    const lang = this.lang || defaultLang;
    this.formatter = new Intl.NumberFormat(lang, this.getOptions());
  }

  render() {
    const v = this.value;
    this.innerText = isNaN(v) ? "" : this.formatter.format(v);
  }

  connected() {
    this.updateFormatter();
    this.render();
  }
}

export default NumberFormatter;
