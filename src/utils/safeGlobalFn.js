import getGlobalFn from "./getGlobalFn.js";

/**
 * @param {string|Function} fn
 */
export default (fn) => {
  if (typeof fn == "function") {
    return fn;
  }
  return getGlobalFn(fn);
};
