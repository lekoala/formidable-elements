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
    let config = this.config;
    // Sanitizer expects a string but remote data can return numbers or null
    if (!config.sanitizer) {
      config.sanitizer = (str) => {
        if (str === null || str === undefined) {
          return "";
        }
        return String(str).replace(/[&\n\<>'"]/g, function (e) {
          return "&#" + e.charCodeAt(0) + ";";
        });
      };
    }
    this.tags = new Tags(this.el, config);
  }

  destroyed() {
    this.tags.dispose();
    this.tags = null;
  }
}

export default BsTags;
