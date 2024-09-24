(() => {
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

  // src/classes/LimitedInput.js
  var events = ["input"];
  function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/([^\w]+|\s+)/g, "-").replace(/\-\-+/g, "-").replace(/(^-+|-+$)/g, "");
  }
  var LimitedInput = class extends HTMLElement {
    get value() {
      return this.el.value;
    }
    connectedCallback() {
      whenParsed_default(this);
    }
    parsedCallback() {
      this.el = this.querySelector("input");
      if (this.hasAttribute("source")) {
        this.source = document.getElementById(this.getAttribute("source"));
        if (this.source) {
          this.source.addEventListener("keyup", this);
        }
      }
      events.forEach((t) => this.addEventListener(t, this));
    }
    handleEvent = (ev = null) => {
      const el = this.el;
      if (el instanceof HTMLInputElement) {
        if (this.hasAttribute("source") && this.source) {
          el.value = this.source.value;
        }
        if (this.hasAttribute("lower")) {
          el.value = el.value.toLocaleLowerCase();
        }
        if (this.hasAttribute("upper")) {
          el.value = el.value.toLocaleUpperCase();
        }
        if (this.hasAttribute("normalize")) {
          el.value = normalize(el.value);
        }
        if (this.hasAttribute("chars")) {
          const c = this.getAttribute("chars");
          const flags = c.includes("{") ? "ug" : "g";
          const regex = new RegExp("[^" + c + "]", flags);
          const replace = this.getAttribute("replace") || "";
          el.value = el.value.replace(regex, replace);
        }
      }
    };
    disconnectedCallback() {
      if (this.source) {
        this.source.removeEventListener("keydown", this);
      }
      events.forEach((t) => this.removeEventListener(t, this));
    }
  };
  var LimitedInput_default = LimitedInput;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/limited-input.js
  defineEl_default("limited-input", LimitedInput_default);
  var limited_input_default = LimitedInput_default;
})();
