/**
 * Bind input to other input
 */
class BoundInput extends HTMLElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    //@ts-ignore
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

  handleEvent(ev) {
    this._handleEvent(ev);
  }

  _handleEvent(ev) {
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
  }

  connectedCallback() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      this._handleEvent(ev);
    };
    this.addEventListener("input", this);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this);
  }
}

export default BoundInput;
