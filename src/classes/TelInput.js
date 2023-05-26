import intlTelInput from "intl-tel-input";
// Include utils right away to make loading easier
import "../../node_modules/intl-tel-input/build/js/utils.js";
import FormidableElement from "../utils/FormidableElement.js";
import localeProvider from "../utils/localeProvider.js";
import Storage from "../utils/Storage.js";

const name = "tel-input";

class TelInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  get value() {
    return this.el.value;
  }

  created() {
    const input = this.el;
    const inputName = input.name;

    const systemLocale = navigator.languages ? navigator.languages[0] : "us";

    // Disable by default the flags, make it opt-in
    this.config = Object.assign(
      {
        initialCountry: "auto",
        showFlags: false,
        separateDialCode: true,
        preferredCountries: [systemLocale.split("-")[1]],
        localizedCountries: localeProvider(name),
        hiddenInput: inputName,
        // Only useful if it's not bundled
        // utilsScript : 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.5/build/js/utils.min.js'
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
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
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
