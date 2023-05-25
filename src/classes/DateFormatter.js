import FormidableElement from "../utils/FormidableElement.js";
import { toTime, toDateTime, toDate } from "../utils/date.js";
import defaultLang from "../utils/defaultLang.js";
import reflectedProperties from "../utils/reflectedProperties.js";

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @link https://shoelace.style/components/format-date
 */
class DateFormatter extends FormidableElement {
  value;
  lang;
  timeStyle;
  dateStyle;
  format;

  constructor() {
    super();
    reflectedProperties(this, DateFormatter.observedAttributes);
  }

  static get observedAttributes() {
    return ["value", "lang", "timeStyle", "dateStyle", "format"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.formatter) {
      if (attrName != "value") {
        this.updateFormatter();
      }
      this.render();
    }
  }

  /**
   * @returns {Intl.DateTimeFormatOptions}
   */
  getOptions() {
    const defaultFormat = new Intl.DateTimeFormat();
    const options = Object.assign(defaultFormat.resolvedOptions(), this.config);

    // "full", "long", "medium", "short"
    if (this.dateStyle) {
      options.dateStyle = this.dateStyle;
    }
    if (this.timeStyle) {
      options.timeStyle = this.timeStyle;
    }

    // dateStyle can be used with timeStyle, but not with other options (e.g. weekday, hour, month, etc.).
    if (options.dateStyle || options.timeStyle) {
      delete options["year"];
      delete options["month"];
      delete options["day"];
    }
    return options;
  }

  updateFormatter() {
    const lang = this.lang || defaultLang;
    this.formatter = new Intl.DateTimeFormat(lang, this.getOptions());
  }

  render() {
    const v = new Date(this.value);
    if (isNaN(v.getTime())) {
      this.innerText = "";
      return;
    }
    let f;
    switch (this.format) {
      case "iso":
        f = v.toISOString();
        break;
      case "utc":
        f = v.toUTCString();
        break;
      case "datetime":
        f = toDateTime(v);
        break;
      case "date":
        f = toDate(v);
        break;
      case "time":
        f = toTime(v);
        break;
      default:
        f = this.formatter.format(v);
        break;
    }
    this.innerText = f;
  }

  connected() {
    // default to now
    if (!this.value) {
      this.value = new Date().toString();
    }
    this.updateFormatter();
    this.render();
  }
}

export default DateFormatter;
