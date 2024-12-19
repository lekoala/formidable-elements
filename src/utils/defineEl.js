// Alias registry for shorter js
const registry = customElements;

/**
 * Safe custom elements definitions
 * @param {string} name
 * @param {Object} cls
 */
export default (name, cls) => {
	if (!registry.get(name)) {
		registry.define(name, cls);
	}
};
