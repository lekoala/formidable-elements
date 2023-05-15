import isUndefined from "./isUndefined.js";

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function attr(el, k, v) {
  if (isUndefined(v)) {
    return el.getAttribute(k);
  }
  el.setAttribute(k, "" + v);
  return v;
}

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function prop(el, k, v) {
  if (isUndefined(v)) {
    return el[k];
  }
  el[k] = v;
  return v;
}

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function data(el, k, v) {
  if (isUndefined(v)) {
    return el.dataset[k];
  }
  el.dataset[k] = v;
  return v;
}

/**
 * @callback AddRemoveCallback
 * @param {string|Array} v
 * @returns {void}
 */

/**
 * @callback HasCallback
 * @param {string|Array} v
 * @returns {Boolean}
 */

/**
 * @typedef ClasslistManipulator
 * @property {HasCallback} contains
 * @property {AddRemoveCallback} add
 * @property {AddRemoveCallback} remove
 */

/**
 * @param {HTMLElement} el
 * @returns {ClasslistManipulator}
 */
export function classlist(el) {
  return {
    /**
     * @param {string} v
     * @returns {Boolean}
     */
    contains: (v) => {
      return el.classList.contains(v);
    },
    /**
     * @param {string|Array} v
     * @returns {Void}
     */
    add: (v) => {
      v = typeof v === "string" ? [v] : v;
      el.classList.add(...v);
    },
    /**
     * @param {string|Array} v
     * @returns {Void}
     */
    remove: (v) => {
      v = typeof v === "string" ? [v] : v;
      el.classList.remove(...v);
    },
  };
}
