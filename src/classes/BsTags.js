//@ts-ignore
import Tags from "bootstrap5-tags";
//@ts-ignore
import styles from "../../node_modules/bootstrap5-tags/tags-pure.min.css";
import FormidableElement from "../utils/FormidableElement.js";
import rmElements from "../utils/rmElements.js";
import injectStyles from "../utils/injectStyles.js";
const name = "bs-tags";

// WARNING: global side effect: with this, focus styles rely only on css variables now
injectStyles(name, styles);

/**
 */
class BsTags extends FormidableElement {
  /**
   * @returns {HTMLSelectElement}
   */
  get el() {
    return this.querySelector("select");
  }

  created() {
    // Clear dropdown if elements was duplicated
    rmElements(this, "div.dropdown");
    this.tags = new Tags(this.el, this.config);
  }

  destroyed() {
    this.tags.dispose();
    this.tags = null;
  }
}

export default BsTags;
