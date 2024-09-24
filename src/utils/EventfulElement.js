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
      target.doCreate();
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
    // Observe until config is set
    if (!this.config) {
      if (this.lazy) {
        observer.observe(this);
      } else {
        this.doCreate();
      }
    }
    // Do not trigger connect until created
    if (this.config) {
      this.connected();
    }
  }

  doCreate() {
    /**
     * The config object as parsed from data-config attribute
     * @type {Object}
     */
    this.config = replaceCallbacks(simpleConfig(this.dataset.config));
    this.created();
  }

  connectedCallback() {
    // Use arrow function to make sure that the scope is always this
    this.handleEvent = (ev) => {
      this._handleEvent(ev);
    };
    // Triggers parsedCallback()
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

  // We cannot use handleEvent = (ev) => {} ... because we want to support safari 13
  // see https://caniuse.com/mdn-javascript_classes_public_class_fields
  // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
  _handleEvent(ev) {
    this.trackFocus(ev);
    this[`$${ev.type}`](ev);
  }

  disconnectedCallback() {
    if (this.lazy && this.config) {
      observer.unobserve(this);
    }
    this.events.forEach((t) => this.removeEventListener(t, this));
    super.disconnectedCallback();
  }
}

export default EventfulElement;
