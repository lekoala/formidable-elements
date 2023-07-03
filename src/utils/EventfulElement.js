import FormidableElement from "./FormidableElement.js";
import replaceCallbacks from "./replaceCallbacks.js";

/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, observerRef) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /**
       * @type {EventfulElement}
       */
      //@ts-ignore
      const target = entry.target;
      observerRef.unobserve(target);
      target.isCreated = true;
      target.created();
    }
  });
});

/**
 * An extension of formidable element that can deal with events
 * and lazy loading
 */
class EventfulElement extends FormidableElement {
  get events() {
    return [];
  }

  parsedCallback() {
    this.lazy = this.hasAttribute("lazy");
    this.isCreated = false;
    if (!this.config) {
      /**
       * The config object as parsed from data-config attribute
       * @type {Object}
       */
      this.config = replaceCallbacks(this.dataset.config || {});
    }
    if (!this.isCreated) {
      if (this.lazy) {
        observer.observe(this);
      } else {
        this.isCreated = true;
        this.created();
      }
    }
    if (this.isCreated) {
      this.connected();
    }
  }

  connectedCallback() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      this._handleEvent(ev);
    };
    super.connectedCallback();
    this.events.forEach((type) => {
      this.addEventListener(type, this);
    });
  }

  handleEvent(ev) {
    this._handleEvent(ev);
  }

  _handleEvent(ev) {
    this[`$${ev.type}`](ev);
  }

  disconnectedCallback() {
    if (this.lazy && this.isCreated) {
      observer.unobserve(this);
    }
    this.events.forEach((type) => {
      this.removeEventListener(type, this);
    });
    super.disconnectedCallback();
  }
}

export default EventfulElement;
