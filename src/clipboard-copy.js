import FormidableElement from "./utils/formidable-element.js";

const name = "clipboard-copy";

/**
 * Use data-value or data-selector to select data to copy to clipboard
 * Define a globalNotifier to notify (eg: use toaster)
 * @link https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 */
class ClipboardCopy extends FormidableElement {
  /**
   * @returns {HTMLButtonElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  created() {
    this.successMessage = this.dataset.success || "Data copied to the clipboard";
    this.errorMessage = this.dataset.error || "Failed to copy data to the clipboard";

    // Use arrow function to make sure that the scope is always this
    this.handleEvent = () => {
      let text = this.dataset.value;
      // Get value from a form element instead (eg: a textarea)
      if (this.dataset.selector) {
        /**
         * @type {HTMLInputElement}
         */
        const input = document.querySelector(this.dataset.selector);
        text = input.value;
      }
      this.copyTextToClipboard(text);
    };
  }

  connected() {
    this.el.addEventListener("click", this);
  }

  disconnected() {
    this.el.removeEventListener("click", this);
  }

  /**
   * @param {string} msg
   * @param {Boolean} successful
   */
  notify(msg, successful) {
    const n = "globalNotifier";
    if (window[n]) {
      window[n](msg, {
        type: successful ? "success" : "error",
      });
    }
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.cssText = `top:0;left:0;position:fixed`;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch (err) {}

    this.notify(successful ? this.successMessage : this.errorMessage, successful);

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        this.notify(this.successMessage, true);
      },
      (err) => {
        this.notify(this.errorMessage, false);
      }
    );
  }
}

if (!customElements.get(name)) {
  customElements.define(name, ClipboardCopy);
}

export default ClipboardCopy;
