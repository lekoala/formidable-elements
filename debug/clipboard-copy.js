(() => {
  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn) => fn.split(".").reduce((r, p) => r[p], window);

  // src/utils/replaceCallbacks.js
  var replaceCallbacks = (obj) => {
    if (isString_default(obj)) {
      obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn_default(obj);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v == "object") {
        const fn = v["__fn"];
        if (isString_default(fn)) {
          obj[k] = getGlobalFn_default(fn);
        } else {
          replaceCallbacks(v);
        }
      }
    }
    return obj;
  };
  var replaceCallbacks_default = replaceCallbacks;

  // src/utils/simpleConfig.js
  var simpleConfig_default = (str) => {
    if (!str) {
      return {};
    }
    if (str[0] != "{" && str.includes(":")) {
      str = `{${str.replace(/([\w]*)\s*:\s*([\w"'\[\]]*)/g, (m2, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
    }
    return str[0] == "{" ? JSON.parse(str) : getGlobalFn_default(str);
  };

  // src/utils/whenParsed.js
  var whenParsed = (el) => {
    let ref = el;
    do {
      if (ref.nextSibling) {
        el.parsedCallback();
        return;
      }
      ref = ref.parentNode;
    } while (ref);
    setTimeout(() => {
      el.parsedCallback();
    });
  };
  var whenParsed_default = whenParsed;

  // src/utils/FormidableElement.js
  var ID_KEY = "__fe_id";
  window[ID_KEY] = window[ID_KEY] || 0;
  var m = /* @__PURE__ */ new Map();
  var FormidableElement = class extends HTMLElement {
    constructor() {
      super();
      this.id = this.id || `fe-${window[ID_KEY]++}`;
      const o = m.get(this.id);
      if (o) {
        if (o != this.innerHTML) {
          this.innerHTML = o;
        }
      } else {
        m.set(this.id, this.innerHTML);
      }
    }
    /**
     * This can get called multiple times
     */
    connectedCallback() {
      if (this._t) {
        clearTimeout(this._t);
      }
      whenParsed_default(this);
    }
    disconnectedCallback() {
      this.disconnected();
      this._t = setTimeout(() => {
        this.destroyed();
        this.config = null;
        if (!document.getElementById(this.id)) {
          m.delete(this.id);
        }
      }, 1e3);
    }
    parsedCallback() {
      if (!this.config) {
        this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
        this.created();
      }
      this.connected();
    }
    /**
     * Called only once in component lifecycle
     * Config is parsed again just before created is called
     */
    created() {
    }
    /**
     * Called if the element is not reconnected quickly after being disconnected
     * Will set config to null
     */
    destroyed() {
    }
    /**
     * Called each time the component is connected (inserted)
     */
    connected() {
    }
    /**
     * Called each time the component is disconnected (removed or destroyed)
     */
    disconnected() {
    }
  };
  var FormidableElement_default = FormidableElement;

  // src/classes/ClipboardCopy.js
  var ClipboardCopy = class extends FormidableElement_default {
    /**
     * @returns {HTMLButtonElement}
     */
    get el() {
      return this.firstElementChild;
    }
    created() {
      this.successMessage = this.dataset.success || "Data copied to the clipboard";
      this.errorMessage = this.dataset.error || "Failed to copy data to the clipboard";
    }
    handleEvent = (ev) => {
      let text = this.dataset.value;
      if (this.dataset.selector) {
        const input = document.querySelector(this.dataset.selector);
        text = input.value;
      }
      this.copyTextToClipboard(text);
    };
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
          type: successful ? "success" : "error"
        });
      }
    }
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.cssText = `top:0;left:0;position:fixed`;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      let successful = false;
      try {
        successful = document.execCommand("copy");
      } catch (err) {
      }
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
  };
  var ClipboardCopy_default = ClipboardCopy;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/clipboard-copy.js
  defineEl_default("clipboard-copy", ClipboardCopy_default);
  var clipboard_copy_default = ClipboardCopy_default;
})();
