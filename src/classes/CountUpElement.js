import { CountUp } from "countup.js";
import EventfulElement from "../utils/EventfulElement.js";
import unformatNumber from "../utils/unformatNumber.js";
import defaultLang from "../utils/defaultLang.js";

class CountUpElement extends EventfulElement {
  constructor() {
    super();
    // Lazy by default
    this.setAttribute("lazy", "lazy");
  }

  created() {
    const config = this.config;

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
      const lang = this.getAttribute("lang") || defaultLang;
      this.formatter = new Intl.NumberFormat(lang);
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
  }
}

export default CountUpElement;
