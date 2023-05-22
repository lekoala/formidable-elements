/**
 * Wait until a given test returns a defined value
 * This can be useful if something needs to be parsed or loaded
 * @param {Function} test
 * @param {Function} cb
 * @param {Boolean} run
 * @param {Number} count
 * @returns {void}
 */
export default function waitDefined(test, cb, run = true, count = 0) {
  count++;
  // we waited long enough (325ms)
  if (count > 25) {
    // run anyway
    if (run) {
      cb();
    }
    return;
  }
  setTimeout(() => {
    if (test() === undefined) {
      waitDefined(test, cb, run, count);
    } else {
      cb();
    }
  }, count);
}
