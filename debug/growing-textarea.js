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

  // src/classes/GrowingTextarea.js
  var events = ["input", "focusout"];
  var GrowingTextarea = class extends HTMLElement {
    get value() {
      return this.el.value;
    }
    connectedCallback() {
      whenParsed_default(this);
    }
    parsedCallback() {
      this.el = this.querySelector("textarea");
      this.handleEvent();
      events.forEach((t) => this.addEventListener(t, this));
    }
    handleEvent = (ev = null) => {
      const el = this.el;
      if ((!ev || ev.type == "focusout") && this.dataset.trim) {
        el.value = el.value.trim();
      }
      if (el instanceof HTMLTextAreaElement && el.scrollHeight > 0) {
        const s = el.style;
        s.overflow = "hidden";
        s.height = "0";
        s.height = el.scrollHeight + "px";
      }
    };
    disconnectedCallback() {
      events.forEach((t) => this.removeEventListener(t, this));
    }
  };
  var GrowingTextarea_default = GrowingTextarea;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/growing-textarea.js
  defineEl_default("growing-textarea", GrowingTextarea_default);
  var growing_textarea_default = GrowingTextarea_default;
})();
