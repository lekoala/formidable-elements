import isString from "./isString.js";
import getGlobalFn from "./getGlobalFn.js";

/**
 * Replace functions value objects in config parsed from JSON
 * @param {Object|string} obj
 * @returns {Object}
 */
const replaceCallbacks = (obj) => {
  if (isString(obj)) {
    obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn(obj);
  }
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v == "object") {
      const fn = v["__fn"];
      if (isString(fn)) {
        obj[k] = getGlobalFn(fn);
      } else {
        replaceCallbacks(v);
      }
    }
  }
  return obj;
};

export default replaceCallbacks;
