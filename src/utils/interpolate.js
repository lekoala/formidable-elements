/**
 * @param {string} str
 * @param {Object} data
 */
export default (str, data) => {
  return str.replace(/\{([^\}]+)?\}/g, ($1, $2) => {
    return data[$2] || "";
  });
};
