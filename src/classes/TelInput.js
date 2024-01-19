import intlTelInput from "intl-tel-input";
// Include utils right away to make loading easier
import "../../node_modules/intl-tel-input/build/js/utils.js";
import EventfulElement from "../utils/EventfulElement.js";
import localeProvider from "../utils/localeProvider.js";
import Storage from "../utils/Storage.js";
import fetchJson from "../utils/fetchJson.js";
import insertHiddenInput from "../utils/insertHiddenInput.js";
import isRTL from "../utils/isRTL.js";

const name = "tel-input";

class TelInput extends EventfulElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  /**
   * @returns {HTMLDivElement}
   */
  get validationFeedback() {
    return this.querySelector(".invalid-feedback");
  }

  get value() {
    return this.el.value;
  }

  get type() {
    const name = this.el.getAttribute("name").toLowerCase();

    // Smarter default type based on field name
    let defaultType = "FIXED_LINE_OR_MOBILE";
    for (const k in intlTelInputUtils.numberType) {
      if (name.includes(k.toLowerCase())) {
        defaultType = k;
      }
    }
    let t = this.getAttribute("type") || defaultType;
    t = t.toUpperCase();
    if (t == "FIXED") {
      t = "FIXED_LINE";
    }
    return t;
  }

  get events() {
    return ["focusout", "input", "beforeinput"];
  }

  $beforeinput(e) {
    // Prevent invalid input
    // @link https://github.com/jackocnr/intl-tel-input/issues/1508
    if (e.data && e.data.replace(/[^0-9\(\)\s+-]/, "") != e.data) {
      e.preventDefault();
    }
  }

  $input() {
    if (this.dataset.updateOnInput) {
      this._updateHiddenValue();
      this._updateValidation();
    }
  }

  $focusout() {
    this._updateHiddenValue();
    this._updateValidation();

    // show formatted value
    if (this.iti.isValidNumber() && !this.dataset.keepFormat) {
      this.iti.setNumber(this.iti.getNumber(0));
    }
  }

  _updateValidation() {
    const div = this.validationFeedback;
    if (!div) {
      return;
    }
    const v = this.el.value;
    this.el.parentElement.classList.remove("is-invalid");
    if (!v) {
      return;
    }
    const spans = div.querySelectorAll("span");
    spans.forEach((span) => {
      span.setAttribute("hidden", "");
    });
    if (!this.iti.isValidNumber()) {
      const errCode = this.iti.getValidationError();
      this.el.parentElement.classList.add("is-invalid");
      let found = false;
      spans.forEach((span) => {
        if (parseInt(span.dataset.code) == errCode) {
          span.removeAttribute("hidden");
          found = true;
        }
      });
      if (!found) {
        const defaultSpan = div.querySelector(":not([data-code])");
        if (defaultSpan) {
          defaultSpan.removeAttribute("hidden");
        }
      }
    }
  }

  _updateHiddenValue() {
    let dataformat = 0;
    switch (this.dataset.dataformat) {
      case "E164":
        dataformat = 0;
        break;
      case "INTERNATIONAL":
        dataformat = 1;
        break;
      case "NATIONAL":
        dataformat = 2;
        break;
      case "RFC3966":
        dataformat = 3;
        break;
    }
    let v = "";
    if (this.iti.isValidNumber()) {
      v = this.iti.getNumber(dataformat);
    }
    this.hiddenInput.setAttribute("value", v);

    // const selectedCountry = this.iti.getSelectedCountryData().iso2;
    // if (selectedCountry != Storage.get("ipapi")) {
    //   Storage.set("ipapi", selectedCountry);
    // }
  }

  created() {
    const input = this.el;
    // const inputName = input.name;

    // Force rtl styles
    if (isRTL(this)) {
      input.dir = "rtl";
    }

    this.hiddenInput = insertHiddenInput(input);

    const systemLocale = navigator.languages ? navigator.languages[0] : "us";

    const type = this.type;

    // Disable by default the flags, make it opt-in
    this.config = Object.assign(
      {
        initialCountry: "auto",
        showFlags: false,
        countrySearch: false,
        fixDropdownWidth: false,
        showSelectedDialCode: true, // required when showFlags is false
        preferredCountries: [systemLocale.split("-")[1]],
        i18n: localeProvider(name),
        // we use or own live updating approach
        // hiddenInput: inputName,
        placeholderNumberType: type,
        // Only useful if it's not bundled
        // utilsScript : 'https://cdn.jsdelivr.net/npm/intl-tel-input@19/build/js/utils.min.js'
      },
      this.config
    );

    // Provide a cached ip lookup
    if (this.config.initialCountry == "auto" && !this.config.geoIpLookup) {
      this.config.geoIpLookup = (callback) => {
        const field = "country_code";
        const result = Storage.get("ipapi");
        if (result) {
          callback(result[field]);
          return;
        }
        fetchJson("https://ipapi.co/json")
          .then((data) => {
            Storage.set("ipapi", data);
            callback(data[field]);
          })
          .catch(() => callback("us"));
      };
    }

    this.iti = intlTelInput(input, this.config);

    if (this.config.hiddenInput) {
      input.name = `_${input.name}`;
    }

    // make sure we preserve initial styles
    const styles = window.getComputedStyle(input);
    input.parentElement.style.display = styles.display;
  }

  destroyed() {
    if (this.iti) {
      this.iti.destroy();
      this.iti = null;
    }
  }
}

export default TelInput;
