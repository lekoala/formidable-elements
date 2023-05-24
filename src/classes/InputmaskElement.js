import "../../node_modules/inputmask/lib/extensions/inputmask.extensions.js";
import "../../node_modules/inputmask/lib/extensions/inputmask.date.extensions.js";
import "../../node_modules/inputmask/lib/extensions/inputmask.numeric.extensions.js";
// import Inputmask from "inputmask";
// use more lightweight import
import Inputmask from "../../node_modules/inputmask/lib/inputmask.js";
import FormidableElement from "../utils/FormidableElement.js";
import insertHiddenInput from "../utils/insertHiddenInput.js";

// Example
/*            
<label for="mask-input" class="form-label">Simple mask</label>
<input-mask data-config='{"mask": "aa-9999", "placeholder":"aa-9999"}'>
  <input type="text" class="form-control" id="mask-input" name="mask">
</input-mask>
*/

const events = ["keyup", "blur"];

function decimalmultiply(a, b) {
  return parseFloat((a * b).toFixed(12));
}

class InputmaskElement extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    const input = this.el;

    this.keepMask = !!this.dataset.keepMask;

    const isDecimal = !!this.dataset.decimal;
    const dataformat = this.dataset.dataformat;

    if (isDecimal) {
      input.value = "" + decimalmultiply(input.value, 100);
    }

    this.inputmask = new Inputmask(this.config);
    this.inputmask.mask(input);

    if (!this.keepMask) {
      // create hidden input
      // @ts-ignore
      this.hiddenInput = insertHiddenInput(input, this.inputmask.unmaskedvalue(input.value));

      // Use arrow function to make sure that the scope is always this
      // Replicate unmasked value to hidden field
      this.handleEvent = (ev) => {
        // @ts-ignore
        let val = this.inputmask.unmaskedvalue(input.value);
        // Apply a given formatting (similar to outputFormat)
        if (dataformat) {
          // Keep the masked input in case you want it or use dataformat
          if (dataformat != "masked") {
            val = Inputmask.format(val, {
              alias: dataformat,
            });
          }
        }
        // Decimal %
        // Useful when you store a value between 0 and 1 in the db for %
        if (isDecimal) {
          val = "" + decimalmultiply(val, 0.01);
        }
        // Otherwise unmasked value is not using proper decimal separator
        // Obviously, in the db, you want a dot as a decimal separator
        if (this.config.radixPoint === ",") {
          val = val.replace(",", ".");
        }
        this.hiddenInput.value = val;
      };
    }
  }

  connected() {
    if (!this.keepMask) {
      const input = this.el;
      events.forEach((type) => {
        input.addEventListener(type, this);
      });
    }
  }

  disconnected() {
    if (!this.keepMask) {
      const input = this.el;
      events.forEach((type) => {
        input.removeEventListener(type, this);
      });
    }
  }

  destroyed() {
    Inputmask.remove(this.el);
    this.inputmask = null;
    this.hiddenInput = null;
  }
}

export default InputmaskElement;
