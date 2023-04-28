import FormidableElement from "./utils/formidable-element.js";
import flatpickr from "flatpickr";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate.js";
// @ts-ignore
import styles from "../node_modules/flatpickr/dist/flatpickr.min.css";
import injectStyles from "./utils/injectStyles.js";
import insertHiddenInput from "./utils/insertHiddenInput.js";
import setId from "./utils/setId.js";
import waitDefined from "./utils/waitDefined.js";
import isUndefined from "./utils/isUndefined.js";
import { q } from "./utils/query.js";
import { toDateTime, toDate, toTime } from "./utils/date.js";

// Example
/*            
<label for="date-input" class="form-label">Date</label>
<flatpickr-input data-config='{}'>
    <input type="text" class="form-control" id="date-input" name="date">
</flatpickr-input>
*/

const events = ["change", "blur"];
const name = "flatpickr-input";

// Inject styles
injectStyles(name, styles);

class FlatpickrInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    // keep original formatted format as display value
    this.keepFormat = !!this.dataset.keepFormat;
    /**
     * @type {('full'|'long'|'medium'|'short')}
     */
    //@ts-ignore
    const dateStyle = this.dataset.dateStyle || "long";
    /**
     * @type {('full'|'long'|'medium'|'short')}
     */
    //@ts-ignore
    const timeStyle = this.dataset.timeStyle || "short";

    // get input
    const input = this.el;
    const id = setId(input, name);

    // default config
    this.config = Object.assign(
      {
        time_24hr: true,
        // defaultDate: new Date(),
      },
      this.config
    );

    // use locale string by default as a nice format
    if (!this.keepFormat) {
      this.config.allowInput = false; // no way to parse a nicely formatted date
      this.config.formatDate = (v) => {
        const locale = this.config.locale || [];
        /**
         * @type {Intl.DateTimeFormatOptions}
         */
        const opts = {
          dateStyle: dateStyle,
        };
        const date = new Date(v);
        if (this.config.enableTime) {
          if (this.config.time_24hr) {
            return date.toLocaleDateString(locale, opts) + " " + toTime(date);
          }
          opts.timeStyle = timeStyle;
          return date.toLocaleString(locale, opts);
        }
        return date.toLocaleDateString(locale, opts);
      };
    }

    // default to iso format
    if (!this.config.dateFormat) {
      this.config.dataFormat = this.getDefaultFormat();
    }

    // create hidden input (don't use altInput since it breaks label)
    this.hiddenInput = this.keepFormat ? null : insertHiddenInput(input);

    // make sure we don't override given value if defaultDate is set (use actual attribute, not .value)
    const originalValue = this.hiddenInput ? this.hiddenInput.value : input.value;
    if (originalValue) {
      this.config.defaultDate = originalValue;
    }

    // plugins
    const plugins = [];
    if (this.dataset.range) {
      // Range plugin is not quite there yet
      // @link https://github.com/flatpickr/flatpickr/issues/1208
      const other = q("input", this.dataset.range);
      if (other) {
        this.el.dataset.rangeEnd = `${this.dataset.range}`;
        other.dataset.rangeStart = `#${id}`;
      }
    }
    // add a "ok" selector at the bottom of the popup
    if (this.dataset.confirmDate) {
      //@ts-ignore
      plugins.push(new confirmDatePlugin({}));
    }
    this.config.plugins = plugins;

    // wait until locale is defined
    const locale = this.config.locale;
    waitDefined(
      () => {
        // return early
        if (!locale || typeof locale !== "string") {
          return true;
        }
        //@ts-ignore
        return isUndefined(window.flatpickr.l10ns[locale]);
      },
      () => {
        this.init();
      }
    );
  }

  getDefaultFormat() {
    if (this.config.enableTime) {
      if (this.config.noCalendar) {
        return "H:i:S";
      }
      return "Y-m-d H:i:S";
    }
    return "Y-m-d";
  }

  convertDate(date) {
    if (this.config.enableTime) {
      if (this.config.noCalendar) {
        return toTime(date);
      }
      return toDateTime(date);
    }
    return toDate(date);
  }

  init() {
    const input = this.el;

    /**
     * @type {flatpickr.Instance}
     */
    this.flatpickr = flatpickr(input, this.config);

    this.handleEvent = (ev) => {
      const d = this.flatpickr.selectedDates[0] || null;

      // hidden value
      if (this.hiddenInput) {
        let v = "";
        if (d) {
          v = this.convertDate(new Date(d));
        }
        this.hiddenInput.value = v;
      }

      // range management
      if (this.el.dataset.rangeStart) {
        //@ts-ignore
        let fp = q(this.el.dataset.rangeStart)._flatpickr;
        fp.set("maxDate", d);
      }
      if (this.el.dataset.rangeEnd) {
        //@ts-ignore
        let fp = q(this.el.dataset.rangeEnd)._flatpickr;
        fp.set("minDate", d);
      }
    };
    events.forEach((type) => {
      input.addEventListener(type, this);
    });
  }

  destroyed() {
    const input = this.el;
    events.forEach((type) => {
      input.removeEventListener(type, this);
    });
    this.flatpickr.destroy();
  }
}

customElements.define(name, FlatpickrInput);

export default FlatpickrInput;
