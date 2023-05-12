import Superfile from "superfile";
import FormidableElement from "../utils/FormidableElement.js";
import injectStyles from "../utils/injectStyles.js";

const name = "superfile-input";

injectStyles(
  name,
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

class SuperfileElement extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    const input = this.el;
    this.superfile = new Superfile(input);
  }

  destroyed() {
    this.superfile = null;
  }
}

export default SuperfileElement;
