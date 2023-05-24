/**
 * Replace functions value objects in config parsed from JSON
 * @param {Object} obj
 * @returns {Object}
 */
export default function replaceCallbacks(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v == "object") {
      const fn = v["__fn"];
      if (typeof fn == "string") {
        obj[k] = fn.split(".").reduce((r, p) => r[p], window);
      } else {
        replaceCallbacks(v);
      }
    }
  }
  return obj;
}
