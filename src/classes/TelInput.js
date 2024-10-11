// import intlTelInput from "intl-tel-input";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
// Include utils right away to make loading easier
// see https://github.com/jackocnr/intl-tel-input?tab=readme-ov-file#loading-the-utilities-script
// import utils from "../../node_modules/intl-tel-input/build/js/utils.js";
import EventfulElement from "../utils/EventfulElement.js";
import localeProvider from "../utils/localeProvider.js";
import Storage from "../utils/Storage.js";
import fetchJson from "../utils/fetchJson.js";
import insertHiddenInput from "../utils/insertHiddenInput.js";
import isRTL from "../utils/isRTL.js";

const name = "tel-input";

const HAS_VALUE_CLASS = "has-value";
const IS_INVALID_CLASS = "is-invalid";

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
    //see v22 Moved global variables window.intlTelInputGlobals and window.intlTelInputUtils to static variables on intlTelInput object e.g. intlTelInput.getCountryData() and intlTelInput.utils.getValidationError()
    if (window.intlTelInputUtils) {
      //@ts-ignore
      for (const k in window.intlTelInputUtils.numberType) {
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

    // This breaks ios 18
    // show formatted value
    // if (this._isValid()) {
    //   if (!this.dataset.keepFormat) {
    //     this.iti.setNumber(this.iti.getNumber());
    //   }
    // }

    // Show filled
    if (this.value) {
      this.classList.add(HAS_VALUE_CLASS);
    } else {
      this.classList.remove(HAS_VALUE_CLASS);
    }
  }

  _updateValidation() {
    const div = this.validationFeedback;
    if (!div) {
      return;
    }
    const v = this.el.value;
    this.el.parentElement.classList.remove(HAS_VALUE_CLASS);
    if (!v) {
      return;
    }
    const spans = div.querySelectorAll("span");
    spans.forEach((span) => {
      span.setAttribute("hidden", "");
    });
    if (!this._isValid()) {
      const errCode = this.iti.getValidationError();
      this.el.parentElement.classList.add(HAS_VALUE_CLASS);
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
    // New option validationNumberType which defaults to "MOBILE" -
    // this determines the number type to enforce during validation
    // with isValidNumber, as well as the number length to enforce with strictMode.
    // This replaces the mobileOnly argument which you could previously pass
    // to isValidNumber.
    return this.iti.isValidNumber();
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
    // Restore original value if could not been formatted
    if (!v && (this.el.value == this.dataset.originalValue || this.dataset.allowInvalidValue === "true")) {
      v = this.el.value;
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
        showFlags: true,
        // if false, we can prevent loading cdn asset but the globe icon is a bit ugly
        // showFlags: false,
        countrySearch: fs,
        fixDropdownWidth: false,
        useFullscreenPopup: fs,
        validationNumberType: "FIXED_LINE_OR_MOBILE",
        // see v22 Dropped showSelectedDialCode in favour of new separateDialCode option
        // showSelectedDialCode: true, // required when showFlags is false
        separateDialCode: false,
        // see v22 Dropped preferredCountries option in favour of new countryOrder option
        // preferredCountries: [systemLocale.split("-")[1]],
        countryOrder: [systemLocale.split("-")[1]],
        i18n: localeProvider(name) || {},
        // we use or own live updating approach
        // hiddenInput: inputName,
        placeholderNumberType: type,
        // Only useful if it's not bundled
        // utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24/build/js/utils.min.js",
      },
      this.config
    );

    // Check country is defined
    if (this.config.countryOrder[0] === undefined) {
      delete this.config.countryOrder[0];
    }

    // Provide a cached ip lookup
    if (this.config.initialCountry == "auto" && !this.config.geoIpLookup) {
      this.config.geoIpLookup = (success, failure) => {
        const field = "country_code";
        const result = Storage.get("ipapi");
        if (result) {
          success(result[field] || "");
        } else {
          fetchJson("https://ipapi.co/json")
            .then((data) => {
              Storage.set("ipapi", data);
              success(data[field] || "");
            })
            .catch(() => success("us"));
        }
      };
    }

    this.iti = intlTelInput(input, this.config);

    // helps placing floating labels
    const computeFloatingSize = () => {
      //@ts-ignore
      let width = this.querySelector(".iti__country-container").offsetWidth;
      this.parentElement.style.setProperty("--tel-input-floating-offset", `${width}px`);
    };
    input.addEventListener("countrychange", computeFloatingSize);
    computeFloatingSize();
    if (this.config.hiddenInput) {
      input.name = `_${input.name}`;
    }

    // make sure we preserve initial styles
    const styles = window.getComputedStyle(input);
    input.parentElement.style.display = styles.display;

    // init value
    if (this.value) {
      this.classList.add(HAS_VALUE_CLASS);
      this.dataset.originalValue = this.value;
      this._updateHiddenValue();
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
