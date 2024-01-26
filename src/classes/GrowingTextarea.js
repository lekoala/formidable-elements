import whenParsed from "../utils/whenParsed.js";

const events = ["input", "focusout"];

/**
 * A growing text area
 * Doesn't inherit from FormidableElement since it's not configurable
 * Set rows=1 to avoid layout shift in your html
 */
class GrowingTextarea extends HTMLElement {
  get value() {
    return this.el.value;
  }

  connectedCallback() {
    whenParsed(this);
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
}

export default GrowingTextarea;
