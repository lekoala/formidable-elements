const local = window.localStorage;

/**
 * A simple wrapper around the local storage api
 */
class Storage {
  /**
   * @param {string} k
   * @returns {string|Array|Object}
   */
  static get(k) {
    const r = local.getItem(k);
    if (r && (r[0] == "[" || r[0] == "{")) {
      return JSON.parse(r);
    }
    return r;
  }
  /**
   * @param {string} k
   * @param {string|Array|Object|null} v Pass null to remove item
   * @returns {Void}
   */
  static set(k, v) {
    if (typeof v !== "string") {
      v = JSON.stringify(v);
    }
    if (v === null) {
      local.removeItem(k);
    } else {
      local.setItem(k, v);
    }
  }
}

export default Storage;
