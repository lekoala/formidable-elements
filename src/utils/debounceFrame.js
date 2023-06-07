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
 * @link https://gomakethings.com/debouncing-events-with-requestanimationframe-for-better-performance/#a-better-approach
 * @param {EventCallback} handler
 * @returns {ExtendedFunction}
 */
export default (handler) => {
  let timer = null;
  return (...args) => {
    if (timer) window.cancelAnimationFrame(timer);
    timer = window.requestAnimationFrame(() => {
      timer = null;
      handler(...args);
    });
  };
};
