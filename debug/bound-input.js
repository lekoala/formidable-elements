(() => {
  // src/classes/BoundInput.js
  var BoundInput = class extends HTMLElement {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.firstElementChild;
    }
    /**
     * @returns {HTMLInputElement}
     */
    get target() {
      return document.querySelector(this.getAttribute("to"));
    }
    get value() {
      return this.el.value;
    }
    handleEvent = (ev) => {
      const target = this.target;
      const attr = this.getAttribute("attr");
      const prop = this.getAttribute("prop") || "value";
      if (target) {
        if (attr) {
          target.setAttribute(attr, this.el.value);
        } else {
          target[prop] = this.el.value;
        }
      }
    };
    connectedCallback() {
      this.addEventListener("input", this);
    }
    disconnectedCallback() {
      this.removeEventListener("input", this);
    }
  };
  var BoundInput_default = BoundInput;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/bound-input.js
  defineEl_default("bound-input", BoundInput_default);
  var bound_input_default = BoundInput_default;
})();
