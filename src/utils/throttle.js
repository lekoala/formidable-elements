/**
 * @param {number} timeFrame
 * @returns {Function}
 */
export default (func, timeFrame = 300) => {
  let lastTime = 0;
  return (...args) => {
    let now = Date.now();
    if (now - lastTime >= timeFrame) {
      //@ts-ignore
      func.apply(this, args);
      lastTime = now;
    }
  };
};
