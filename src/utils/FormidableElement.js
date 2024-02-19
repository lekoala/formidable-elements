import replaceCallbacks from "./replaceCallbacks.js";
import simpleConfig from "./simpleConfig.js";
import whenParsed from "./whenParsed.js";

/**
 * A minimalistic base class for your html elements
 *
 * Provides a config objects through json with callbacks
 *
 * created() will happen only once in the lifetime of the instance
 * (unless destroyed is called)
 *
 * When a element is moved to another parent, it will call
 * disconnected then connected
 *
 * destroyed() provides a place to clean up if the dom is disconnected
 * for more than 1 second
 */
class FormidableElement extends HTMLElement {
  /**
   * This can get called multiple times
   */
  connectedCallback() {
    // Clear destroyed timeout if reconnected quickly (eg: when attaching to a new parent)
    if (this._t) {
      clearTimeout(this._t);
    }
    whenParsed(this);
  }

  disconnectedCallback() {
    this.disconnected();
    // Schedule destroyed callback
    this._t = setTimeout(() => {
      this.destroyed();
      this.config = null;
    }, 1000);
  }

  parsedCallback() {
    if (!this.config) {
      /**
       * The config object as parsed from data-config attribute
       * @type {Object}
       */
      this.config = replaceCallbacks(simpleConfig(this.dataset.config));
      this.created();
    }
    this.connected();
  }

  /**
   * Called only once in component lifecycle
   * Config is parsed again just before created is called
   */
  created() {}

  /**
   * Called if the element is not reconnected quickly after being disconnected
   * Will set config to null
   */
  destroyed() {}

  /**
   * Called each time the component is connected (inserted)
   */
  connected() {}

  /**
   * Called each time the component is disconnected (removed or destroyed)
   */
  disconnected() {}
}

export default FormidableElement;
