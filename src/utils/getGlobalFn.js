export default (fn) => fn.split(".").reduce((r, p) => r[p], window);
