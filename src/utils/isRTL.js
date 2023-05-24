/**
 * @returns {Boolean}
 */
export default () => {
  return window.getComputedStyle(document.documentElement).direction === "rtl";
};
