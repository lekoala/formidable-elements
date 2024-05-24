import Superfile from "superfile";
import FormidableElement from "../utils/FormidableElement.js";

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
    this.superfile.dispose();
    this.superfile = null;
  }
}

export default SuperfileElement;
