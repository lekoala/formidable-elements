/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function attr(el, k, v) {
  if (v === undefined) {
    return el.getAttribute(k);
  }
  el.setAttribute(k, "" + v);
  return v;
}

/**
 * @param {HTMLElement} el
 * @param {Object} obj
 * @returns {void}
 */
export function attrs(el, obj) {
  for (const [k, v] of Object.entries(obj)) {
    el.setAttribute(k, v);
  }
}

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function prop(el, k, v) {
  if (v === undefined) {
    return el[k];
  }
  el[k] = v;
  return v;
}

/**
 * @param {HTMLElement} el
 * @param {Object} obj
 * @param {string} prop Any sub property (eg: style, dataset...)
 * @returns {void}
 */
export function props(el, obj, prop = null) {
  const target = prop ? el[prop] : el;
  Object.assign(target, obj);
}

/**
 * @param {HTMLElement} el
 * @param {Object} obj
 * @returns {void}
 */
export function dataset(el, obj) {
  props(el, obj, "dataset");
}

/**
 * @param {HTMLElement} el
 * @param {Object} obj
 * @returns {void}
 */
export function styles(el, obj) {
  props(el, obj, "style");
}

/**
 * @param {HTMLElement} el
 * @param {string} k
 * @param {*} v
 * @returns {string}
 */
export function data(el, k, v) {
  if (v === undefined) {
    return el.dataset[k];
  }
  el.dataset[k] = v;
  return v;
}

/**
 * @param {HTMLElement} el
 * @param {string|Array} v
 */
export function addClass(el, v) {
  v = typeof v === "string" ? [v] : v;
  el.classList.add(...v);
}

/**
 * @param {HTMLElement} el
 * @param {string|Array} v
 */
export function removeClass(el, v) {
  v = typeof v === "string" ? [v] : v;
  el.classList.remove(...v);
}

/**
 * @param {HTMLElement} el
 * @param {string} v
 */
export function hasClass(el, v) {
  return el.classList.contains(v);
}
