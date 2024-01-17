import { CountUp } from "countup.js";
import EventfulElement from "../utils/EventfulElement.js";
import unformatNumber from "../utils/unformatNumber.js";
import defaultLang from "../utils/defaultLang.js";
import parseBool from "../utils/parseBool.js";
import isUndefined from "../utils/isUndefined.js";

class CountUpElement extends EventfulElement {
  constructor() {
    super();
    // Lazy by default
    this.setAttribute("lazy", "lazy");
  }

  created() {
    // Allow direct usage of data attributes on top of regular data-config
    const config = Object.assign(this.config, this.dataset);
    const lang = this.getAttribute("lang") || defaultLang;

    // Ignore invalid chars
    const v = unformatNumber(this.getAttribute("value") || this.textContent);
    const vs = v.toString();

    // Auto determine . position
    if (vs.includes(".") && !config.decimalPlaces) {
      //@ts-ignore
      config.decimalPlaces = vs.split(".")[1].length;
    }

    // Format according to locale or using intl if needed
    if (this.getAttribute("lang") || this.hasAttribute("intl")) {
      this.formatter = new Intl.NumberFormat(lang);
    }

    // Currency
    if (config.currency) {
      this.formatter = new Intl.NumberFormat(lang, {
        currency: config.currency,
        style: "currency",
        currencyDisplay: config.currencyDisplay || "narrowSymbol",
      });
    }

    // format=false
    if (!isUndefined(config.format) && parseBool(config.format) == false) {
      config.formattingFn = (v) => {
        return v;
      };
    }

    // We use a formatter
    if (this.formatter) {
      //@ts-ignore
      config.formattingFn = (v) => {
        return this.formatter.format(v);
      };
    }

    this.countup = new CountUp(this, v, config);
    this.countup.start();
  }

  destroyed() {
    if (this.countup) {
      this.countup.reset();
    }
    this.countup = null;
    this.formatter = null;
  }
}

export default CountUpElement;
