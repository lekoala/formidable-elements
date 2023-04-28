import FormidableElement from "./utils/formidable-element.js";
import Autocomplete from "bootstrap5-autocomplete";

const name = "bs-autocomplete";

/**
 */
class BsAutocomplete extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    const dropmenu = this.querySelector("div.dropdown");
    if (dropmenu) {
      dropmenu.remove();
    }
    this.autocomplete = new Autocomplete(this.el, this.config);
  }

  destroyed() {
    this.autocomplete.dispose();
    this.autocomplete = null;
  }
}

customElements.define(name, BsAutocomplete);

export default BsAutocomplete;
