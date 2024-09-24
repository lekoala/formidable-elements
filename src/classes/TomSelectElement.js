import TomSelect from "../../node_modules/tom-select/src/tom-select.complete.js";
import FormidableElement from "../utils/FormidableElement.js";
import setId from "../utils/setId.js";
import localeProvider from "../utils/localeProvider.js";
import hasOverflowParent from "../utils/hasOverflowParent.js";
import getDelete from "../utils/getDelete.js";
import fetchJson from "../utils/fetchJson.js";

const name = "tom-select";

class TomSelectElement extends FormidableElement {
  /**
   * @returns {HTMLInputElement|HTMLSelectElement}
   */
  get el() {
    return this.querySelector("input,select");
  }

  get value() {
    return this.el.value;
  }

  created() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      this._handleEvent(ev);
    };

    const input = this.el;
    const id = setId(input, name);

    const config = this.config;
    const labels = localeProvider(name) || {};
    const render = config.render || {};
    // Bind labels to config
    // @link https://tom-select.js.org/examples/i18n/
    if (labels.option_create) {
      render["option_create"] = (data, escape) => {
        return labels.option_create.replace("{input}", escape(data.input));
      };
    }
    if (labels.no_results) {
      render["no_results"] = (data, escape) => {
        return labels.no_results;
      };
    }
    config.render = render;

    // Ajax wrapper
    // @link https://tom-select.js.org/examples/remote/
    const ajax = getDelete(config, "_ajax");

    if (ajax) {
      const url = ajax.url;
      const paramName = ajax.paramName || "q";
      const params = ajax.params || {};
      const fetchOptions = ajax.fetchOptions || {};
      const dataKey = ajax.dataKey || "data";

      config.load = (query, callback) => {
        params[paramName] = query;

        fetchJson(url, params, fetchOptions)
          .then((json) => {
            const data = dataKey ? json[dataKey] || json : json;
            callback(data);
          })
          .catch(() => {
            callback();
          });
      };
    }

    // Append to body if has overflow parent
    if (hasOverflowParent(this) && !config["dropdownParent"]) {
      config["dropdownParent"] = "body";
    }

    // Overflow check
    // @link https://github.com/orchidjs/tom-select/discussions/163
    config["onDropdownOpen"] =
      /**
       * @param {HTMLElement} dropdown
       */
      (dropdown) => {
        /**
         * @type {HTMLElement}
         */
        const control = this.querySelector(".ts-control");
        const rect = dropdown.getBoundingClientRect();
        const totalHeight = rect.y + rect.height;
        const clientHeight = dropdown.ownerDocument.documentElement.clientHeight;
        if (totalHeight > clientHeight) {
          // In chrome, we need 100.1% to avoid blurry text
          // @link https://stackoverflow.com/questions/32034574/font-looks-blurry-after-translate-in-chrome
          dropdown.style.transform = `translateY(calc(-100.1% - ${control.offsetHeight + 2}px))`;
        } else if (totalHeight < clientHeight - rect.height) {
          dropdown.style.transform = "unset";
        }
      };

    // https://github.com/orchidjs/tom-select/issues/544
    const form = this.closest("form");
    if (form) {
      form.addEventListener("reset", this);
    }

    this.tomselect = new TomSelect(`#${id}`, config);
    this.originalValue = this.tomselect.items.slice(0);
  }

  // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
  _handleEvent(ev) {
    this[`$${ev.type}`](ev);
  }

  $reset() {
    this.tomselect.setValue(this.originalValue, true);
  }

  destroyed() {
    const form = this.closest("form");
    if (form) {
      form.removeEventListener("reset", this);
    }
    if (this.tomselect) {
      this.tomselect.destroy();
      this.tomselect = null;
    }
  }
}

export default TomSelectElement;
