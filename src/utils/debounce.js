/**
 * Define a function that can be happily passed to addEventListener
 * @typedef {Function & EventListener | EventListenerObject} ExtendedFunction
 */

/**
 * @callback EventCallback
 * @param {Event} ev
 * @returns {void}
 */

/**
 * @param {EventCallback} handler
 * @param {Number} timeout
 * @returns {ExtendedFunction}
 */
export default (handler, timeout = 300) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      handler(...args);
    }, timeout);
  };
};
