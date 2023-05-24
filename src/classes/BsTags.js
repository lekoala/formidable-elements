//@ts-ignore
import Tags from "bootstrap5-tags";
import FormidableElement from "../utils/FormidableElement.js";
import rmElements from "../utils/rmElements.js";

/**
 */
class BsTags extends FormidableElement {
  /**
   * @returns {HTMLSelectElement}
   */
  get el() {
    return this.querySelector("select");
  }

  get value() {
    return this.el.value;
  }

  created() {
    // Clear dropdown if element was duplicated
    rmElements(this, "div.dropdown");
    this.tags = new Tags(this.el, this.config);
  }

  destroyed() {
    this.tags.dispose();
    this.tags = null;
  }
}

export default BsTags;
