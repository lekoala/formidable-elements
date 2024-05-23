import whenParsed from "../utils/whenParsed.js";

const events = ["input"];

/**
 * Limits what can be put in the input
 * Accepts a chars attribute that will be used in the regex to filter chars
 */
class LimitedInput extends HTMLElement {
  get value() {
    return this.el.value;
  }

  connectedCallback() {
    whenParsed(this);
  }

  parsedCallback() {
    this.el = this.querySelector("input");
    if (this.hasAttribute("source")) {
      /** @type {HTMLInputElement} */
      // @ts-ignore
      this.source = document.getElementById(this.getAttribute("source"));
      if (this.source) {
        this.source.addEventListener("keyup", this);
      }
    }
    events.forEach((t) => this.addEventListener(t, this));
  }

  handleEvent = (ev = null) => {
    const el = this.el;
    if (el instanceof HTMLInputElement) {
      if (this.hasAttribute("source") && this.source) {
        el.value = this.source.value;
      }
      if (this.hasAttribute("lower")) {
        el.value = el.value.toLocaleLowerCase();
      }
      if (this.hasAttribute("upper")) {
        el.value = el.value.toLocaleUpperCase();
      }
      if (this.hasAttribute("normalize")) {
        el.value = el.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      if (this.hasAttribute("chars")) {
        const c = this.getAttribute("chars");
        const flags = c.includes("{") ? "ug" : "g";
        const regex = new RegExp("[^" + c + "]", flags);
        const replace = this.getAttribute("replace") || "";
        el.value = el.value.replace(regex, replace);
      }
    }
  };

  disconnectedCallback() {
    if (this.source) {
      this.source.removeEventListener("keydown", this);
    }
    events.forEach((t) => this.removeEventListener(t, this));
  }
}

export default LimitedInput;
