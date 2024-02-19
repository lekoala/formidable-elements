/**
 * Parses json like key: value strings into a proper json string
 * Does not support single quotes inside values
 * @param {string} str
 * @returns {Object}
 */
export default (str) => {
  if (!str) {
    return {};
  }
  if (str.includes(":") && str[0] != "{") {
    str = `{${str.replace(/([\w]*)\s*:\s*([\w"']*)/, (m, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
  }
  return JSON.parse(str);
};
