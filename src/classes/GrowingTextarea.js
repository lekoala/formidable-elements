import whenParsed from "../utils/whenParsed.js";

const events = ["input", "focusout"];

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

  get value() {
    return this.el.value;
  }

  connectedCallback() {
    whenParsed(this);
  }

  parsedCallback() {
    this.handleEvent();
    events.forEach((type) => {
      this.addEventListener(type, this);
    });
  }

  handleEvent = (ev = null) => {
    const el = this.el;
    if ((!ev || ev.type == "focusout") && this.dataset.trim) {
      el.value = el.value.trim();
    }
    if (el instanceof HTMLTextAreaElement && el.scrollHeight > 0) {
      el.style.overflow = "hidden";
      el.style.height = "0";
      el.style.height = el.scrollHeight + "px";
    }
  };

  disconnectedCallback() {
    events.forEach((type) => {
      this.removeEventListener(type, this);
    });
  }
}

export default GrowingTextarea;
