import Autocomplete from "bootstrap5-autocomplete";

import FormidableElement from "../utils/FormidableElement.js";
import rmElements from "../utils/rmElements.js";

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
    // Clear dropdown if element was duplicated
    rmElements(this, "div.dropdown");

    this.config = Object.assign(
      {
        hiddenInput: true,
      },
      this.config
    );
    this.lib = new Autocomplete(this.el, this.config);
  }

  destroyed() {
    this.lib.dispose();
    this.lib = null;
  }
}

export default BsAutocomplete;
