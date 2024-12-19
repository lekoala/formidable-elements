import replaceCallbacks from "./replaceCallbacks.js";
import simpleConfig from "./simpleConfig.js";
import whenParsed from "./whenParsed.js";

// Global id counter
const ID_KEY = "__fe_id";
window[ID_KEY] = window[ID_KEY] || 0;
const m = new Map();

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
	constructor() {
		super();
		// Assign unique id to the html node
		this.id = this.id || `fe-${window[ID_KEY]++}`;

		// Restore original html state.
		// See also /demo/tel-input-solo.html
		// Fixes this : https://codepen.io/lekoalabe/pen/JjqEgxE
		const o = m.get(this.id);
		if (o) {
			// Only restore html state if necessary
			if (o !== this.innerHTML) {
				this.innerHTML = o;
			}
		} else {
			m.set(this.id, this.innerHTML);
		}
	}

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

	/**
	 * @link https://nolanlawson.com/2024/12/01/avoiding-unnecessary-cleanup-work-in-disconnectedcallback/
	 */
	disconnectedCallback() {
		this.disconnected();
		// Schedule destroyed callback
		this._t = setTimeout(() => {
			this.destroyed();
			this.config = null;
			// The dom doesn't contain this id anymore, we can clear the map
			if (!document.getElementById(this.id)) {
				m.delete(this.id);
			}
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
