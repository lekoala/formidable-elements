import getGlobalFn from "./getGlobalFn.js";

/**
 * @param {string|object|Function} fn
 */
export default (fn) => {
  if (typeof fn == "function") {
    return fn;
  }
  if (typeof fn == "object" && fn["__fn"]) {
    return getGlobalFn(fn["__fn"]);
  }
  return getGlobalFn(fn);
};
