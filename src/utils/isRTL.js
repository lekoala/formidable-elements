/**
 * @returns {Boolean}
 */
export default function isRTL() {
  return window.getComputedStyle(document.documentElement).direction === "rtl";
}
