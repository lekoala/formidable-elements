/**
 * Any property will work with attributes instead
 *
 * @param {HTMLElement} obj
 * @param {Array} props
 */
export default (obj, props) => {
  for (const key of props) {
    Object.defineProperty(obj, key, {
      get() {
        return obj.getAttribute(key);
      },
      set(value) {
        obj.setAttribute(key, value);
      },
    });
  }
};
