/**
 * A growing text area
 * Doesn't inherit from FormidableElement since it's not configurable
 * Set rows=1 to avoid layout shift in your html
 */
class GrowingTextarea extends HTMLElement {
  /**
   * @returns {HTMLTextAreaElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  connectedCallback() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      const target = this.el;
      if (target instanceof HTMLTextAreaElement) {
        target.style.overflow = "hidden";
        target.style.height = "0";
        target.style.height = target.scrollHeight + "px";
      }
    };
    this.addEventListener("input", this);
  }
  disconnectedCallback() {
    this.removeEventListener("input", this);
  }
}

export default GrowingTextarea;
