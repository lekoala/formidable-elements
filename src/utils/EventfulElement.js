import FormidableElement from "./FormidableElement.js";

/**
 * An extension of formidable element that can deal with events
 */
class EventfulElement extends FormidableElement {
  get events() {
    return [];
  }

  connectedCallback() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      this[`$${ev.type}`](ev);
    };
    super.connectedCallback();
    this.events.forEach((type) => {
      this.addEventListener(type, this);
    });
  }

  disconnectedCallback() {
    this.events.forEach((type) => {
      this.removeEventListener(type, this);
    });
    super.disconnectedCallback();
  }
}

export default EventfulElement;
