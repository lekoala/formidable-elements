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
    //@ts-ignore intlTelInputUtils is a global function
    if (intlTelInputUtils) {
      //@ts-ignore
      for (const k in intlTelInputUtils.numberType) {
        if (name.includes(k.toLowerCase())) {
          defaultType = k;
        }
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
    return ["focusout", "focusin", "input", "beforeinput"];
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

  $focusin() {}

  $focusout() {
    this._updateHiddenValue();
    this._updateValidation();

    // show formatted value
    if (this._isValid()) {
      if (!this.dataset.keepFormat) {
        this.iti.setNumber(this.iti.getNumber());
      }
    }

    // Show filled
    if (this.value) {
      this.classList.add("has-value");
    } else {
      this.classList.remove("has-value");
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
    if (!this._isValid()) {
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

  _isValid() {
    // since 20.x, by default, calling isValidNumber will now default to mobile-only mode (it will only return true for valid mobile numbers),
    // which means it will be much more accurate - if you don't want this, you can pass false as an argument e.g. isValidNumber(false)

    // @ts-ignore
    return this.iti.isValidNumber(false);
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
    if (this._isValid()) {
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

    // full screen for small screens
    const fs = document.documentElement.clientWidth < 768;

    // Disable by default the flags, make it opt-in
    this.config = Object.assign(
      {
        initialCountry: "auto",
        showFlags: false,
        countrySearch: fs,
        fixDropdownWidth: false,
        useFullscreenPopup: fs,
        showSelectedDialCode: true, // required when showFlags is false
        preferredCountries: [systemLocale.split("-")[1]],
        i18n: localeProvider(name) || {},
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

    input.addEventListener("countrychange", () => {
      // Update size
      //@ts-ignore
      let width = this.querySelector(".iti__selected-country").offsetWidth;
      let parent = this.parentElement;
      parent.style.setProperty("--tel-input-floating-offset", `${width}px`);
    });

    if (this.config.hiddenInput) {
      input.name = `_${input.name}`;
    }

    // make sure we preserve initial styles
    const styles = window.getComputedStyle(input);
    input.parentElement.style.display = styles.display;

    // init value
    if (this.value) {
      this.classList.add("has-value");
    }
  }

  destroyed() {
    if (this.iti) {
      this.iti.destroy();
      this.iti = null;
    }
  }
}

export default TelInput;
