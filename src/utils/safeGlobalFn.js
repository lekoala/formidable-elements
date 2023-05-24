export default (fn) => {
  if (typeof fn == "function") {
    return fn;
  }
  return fn.split(".").reduce((r, p) => r[p], window);
};
