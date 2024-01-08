import { CountUp } from "countup.js";
import unformatNumber from "../utils/unformatNumber";
import defaultLang from "../utils/defaultLang";

/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, observerRef) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /**
       * @type {CountUpElement}
       */
      //@ts-ignore
      const target = entry.target;
      observerRef.unobserve(target);
      target.start();
    }
  });
});

class CountUpElement extends HTMLElement {
  connectedCallback() {
    const options = Object.assign({}, this.dataset);

    // Ignore invalid chars
    const v = unformatNumber(this.getAttribute("value") || this.textContent);
    const vs = v.toString();

    // Auto determine . position
    if (vs.includes(".") && !options.decimalPlaces) {
      //@ts-ignore
      options.decimalPlaces = vs.split(".")[1].length;
    }

    // Format according to locale or using intl if needed
    if (this.getAttribute("lang") || this.hasAttribute("intl")) {
      const lang = this.getAttribute("lang") || defaultLang;
      this.formatter = new Intl.NumberFormat(lang);
      //@ts-ignore
      options.formattingFn = (v) => {
        return this.formatter.format(v);
      };
    }

    this.inst = new CountUp(this, v, options);
    observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
    if (this.inst) {
      this.inst.reset();
    }
    this.inst = null;
  }

  start() {
    if (this.inst) {
      this.inst.start();
    }
  }
}

export default CountUpElement;
