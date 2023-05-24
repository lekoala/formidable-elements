/**
 * @param {number|string} n
 * @returns {boolean}
 */
export default (n) => {
  //@ts-ignore
  return !isNaN(parseFloat(n)) && isFinite(n);
};
