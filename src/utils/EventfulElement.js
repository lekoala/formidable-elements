import FormidableElement from "./FormidableElement.js";
import replaceCallbacks from "./replaceCallbacks.js";
import simpleConfig from "./simpleConfig.js";

/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, obs) => {
  entries
    .filter((entry) => entry.isIntersecting)
    .forEach((entry) => {
      /**
       * @type {EventfulElement}
       */
      //@ts-ignore
      const target = entry.target;
      obs.unobserve(target);
      target.isCreated = true;
      target.created();
    });
});

/**
 * An extension of formidable element that can deal with events and lazy loading
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
      this.config = replaceCallbacks(simpleConfig(this.dataset.config));
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
    super.connectedCallback();
    this.events.forEach((t) => this.addEventListener(t, this));
  }

  trackFocus(ev) {
    if (ev.type == "focusin") {
      this.classList.add("has-focus");
    } else if (ev.type == "focusout") {
      this.classList.remove("has-focus");
    }
  }

  // Use arrow function to make sure that the scope is always this and cannot be rebound
  // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
  handleEvent = (ev) => {
    this.trackFocus(ev);
    this[`$${ev.type}`](ev);
  };

  disconnectedCallback() {
    if (this.lazy && this.isCreated) {
      observer.unobserve(this);
    }
    this.events.forEach((t) => this.removeEventListener(t, this));
    super.disconnectedCallback();
  }
}

export default EventfulElement;
