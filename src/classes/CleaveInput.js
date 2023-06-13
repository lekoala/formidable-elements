import Cleave from "../../node_modules/cleave-es6/src/Cleave.js";
import FormidableElement from "../utils/FormidableElement.js";

/*
<label for="date-input" class="form-label">Date</label>
<cleave-input type="date">
    <input type="text" class="form-control" id="date-input" name="date">
</cleave-input>
*/

/**
 * Cleave is a lightweight alternative to input-mask
 * It might be easier/simpler to use in some cases
 */
class CleaveInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  get value() {
    return this.cleave.getRawValue(true);
  }

  get type() {
    return this.getAttribute("type");
  }

  created() {
    // Add a custom type attribute for ease of use
    const type = this.type;
    if (type === "datetime") {
      this.config.date = true;
      this.config.time = true;
    } else if (type) {
      this.config[type] = true;
    }

    this.cleave = new Cleave(this.el, this.config);
  }

  destroyed() {
    if (this.cleave) {
      this.cleave.destroy();
      this.cleave = null;
    }
  }
}

export default CleaveInput;
