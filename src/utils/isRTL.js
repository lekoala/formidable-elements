/**
 * @param {Element} el
 * @returns {Boolean}
 */
export default (el = document.documentElement) => {
  return getComputedStyle(el).direction === "rtl";
};
