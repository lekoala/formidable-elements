import TomSelect from "../../node_modules/tom-select/src/tom-select.complete.js";
import FormidableElement from "../utils/FormidableElement.js";
import setId from "../utils/setId.js";
import localeProvider from "../utils/localeProvider.js";
import hasOverflowParent from "../utils/hasOverflowParent.js";
import getDelete from "../utils/getDelete.js";

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
    const url = getDelete(config, "_url");
    const urlParam = getDelete(config, "_urlParam", "q");
    if (url) {
      config.load = (query, callback) => {
        const fetchUrl = url + "?" + urlParam + "=" + encodeURIComponent(query);
        fetch(fetchUrl)
          .then((response) => response.json())
          .then((json) => {
            // autofind by sub key
            const data = json.data || json.items || json;

            // autoset key/value/search
            if (data.length) {
              const settings = this.tomselect.settings;
              const firstItem = data[0];
              if (!firstItem[settings.valueField]) {
                const lookups = ["id", "value"];
                lookups.forEach((k) => {
                  if (firstItem[k]) {
                    settings.valueField = k;
                  }
                });
              }
              if (!firstItem[settings.labelField]) {
                const lookups = ["name", "title"];
                lookups.forEach((k) => {
                  if (firstItem[k]) {
                    settings.labelField = k;
                    if (!settings.searchField.includes(k)) {
                      settings.searchField.push(k);
                    }
                  }
                });
              }
            }

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
          dropdown.style.transform = `translateY(calc(-100% - ${control.offsetHeight + 2}px))`;
        } else if (totalHeight < clientHeight - rect.height) {
          dropdown.style.transform = "unset";
        }
      };

    // https://github.com/orchidjs/tom-select/issues/544
    const form = this.closest("form");
    if (form) {
      this.handleEvent = (ev) => {
        this.tomselect.setValue(this.originalValue, true);
      };
      form.addEventListener("reset", this);
    }

    this.tomselect = new TomSelect(`#${id}`, config);
    this.originalValue = this.tomselect.items.slice(0);
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
