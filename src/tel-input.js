import intlTelInput from "intl-tel-input";
// Include utils right away to make loading easier
import "../node_modules/intl-tel-input/build/js/utils.js";
//@ts-ignore
// import styles from "../node_modules/intl-tel-input/build/css/intlTelInput.min.css";
import FormidableElement from "./utils/formidable-element.js";
import injectStyles from "./utils/injectStyles.js";
import localeProvider from "./utils/localeProvider.js";
import storage from "./utils/storage.js";

const name = "tel-input";

// Opiniated styles
// No flags by default
const baseStyles = `.iti{position:relative;display:inline-block}.iti *{box-sizing:border-box}.iti__hide{display:none}.iti__v-hide{visibility:hidden}.iti input,.iti input[type=tel],.iti input[type=text]{position:relative;z-index:0;margin-top:0!important;margin-bottom:0!important;padding-right:36px;margin-right:0}.iti__flag-container{position:absolute;top:0;bottom:0;right:0;padding:1px}.iti__selected-flag{z-index:1;position:relative;display:flex;align-items:center;height:100%;padding:0 6px 0 8px}.iti__arrow{margin-left:6px;width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid #555}[dir=rtl] .iti__arrow{margin-right:6px;margin-left:0}.iti__arrow--up{border-top:none;border-bottom:4px solid #555}.iti__country-list{position:absolute;z-index:2;list-style:none;padding:0;margin:0 0 0 -1px;box-shadow:1px 1px 4px rgba(0,0,0,.2);background-color:#fff;border:1px solid #ccc;white-space:nowrap;max-height:200px;overflow-y:scroll;-webkit-overflow-scrolling:touch}.iti__country-list--dropup{bottom:100%;margin-bottom:-1px}@media (max-width:500px){.iti__country-list{white-space:normal}}.iti__flag-box{display:inline-block;width:20px}.iti__divider{padding-bottom:5px;margin-bottom:5px;border-bottom:1px solid #ccc}.iti__country{display:flex;align-items:center;padding:5px 10px;outline:0}.iti__dial-code{color:#999}.iti__country.iti__highlight{background-color:rgba(0,0,0,.05)}.iti__country-name,.iti__flag-box{margin-right:6px}[dir=rtl] .iti__country-name,[dir=rtl] .iti__flag-box{margin-right:0;margin-left:6px}.iti--allow-dropdown input,.iti--allow-dropdown input[type=tel],.iti--allow-dropdown input[type=text],.iti--separate-dial-code input,.iti--separate-dial-code input[type=tel],.iti--separate-dial-code input[type=text]{padding-right:6px;padding-left:52px;margin-left:0}[dir=rtl] .iti--allow-dropdown input,[dir=rtl] .iti--allow-dropdown input[type=tel],[dir=rtl] .iti--allow-dropdown input[type=text],[dir=rtl] .iti--separate-dial-code input,[dir=rtl] .iti--separate-dial-code input[type=tel],[dir=rtl] .iti--separate-dial-code input[type=text]{padding-right:52px;padding-left:6px;margin-right:0}.iti--allow-dropdown .iti__flag-container,.iti--separate-dial-code .iti__flag-container{right:auto;left:0}[dir=rtl] .iti--allow-dropdown .iti__flag-container,[dir=rtl] .iti--separate-dial-code .iti__flag-container{right:0;left:auto}.iti--allow-dropdown .iti__flag-container:hover{cursor:pointer}.iti--allow-dropdown .iti__flag-container:hover .iti__selected-flag{background-color:rgba(0,0,0,.05)}.iti--allow-dropdown input[disabled]+.iti__flag-container:hover,.iti--allow-dropdown input[readonly]+.iti__flag-container:hover{cursor:default}.iti--allow-dropdown input[disabled]+.iti__flag-container:hover .iti__selected-flag,.iti--allow-dropdown input[readonly]+.iti__flag-container:hover .iti__selected-flag{background-color:transparent}.iti--separate-dial-code .iti__selected-flag{background-color:rgba(0,0,0,.05)}.iti--separate-dial-code.iti--show-flags .iti__selected-dial-code{margin-left:6px}.iti--container{position:absolute;top:-1000px;left:-1000px;z-index:1060;padding:1px}.iti--container:hover{cursor:pointer}.iti-mobile .iti--container{top:30px;bottom:30px;left:30px;right:30px;position:fixed}.iti-mobile .iti__country-list{max-height:100%;width:100%}.iti-mobile .iti__country{padding:10px 10px;line-height:1.5em}`;

injectStyles(
  name,
  `${baseStyles}
.iti__selected-dial-code { min-width: 3ch }
.iti__arrow { border: none }
.input-group .iti .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0}`
);

class TelInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
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
        const result = storage.get("ipapi");
        if (result) {
          callback(result[field]);
          return;
        }
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => {
            storage.set("ipapi", data);
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
    this.iti.destroy();
    this.iti = null;
  }
}

if (!customElements.get(name)) {
  customElements.define(name, TelInput);
}

export default TelInput;
