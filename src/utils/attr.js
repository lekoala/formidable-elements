import isUndefined from "./isUndefined.js";

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export default function attr(el, k, v) {
  if (isUndefined(v)) {
    return el.getAttribute(k);
  }
  el.setAttribute(k, "" + v);
  return v;
}
