/**
 * @param {string} name
 * @returns {string}
 */
export default (name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
