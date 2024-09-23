import getGlobalFn from "./getGlobalFn";

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
  if (str[0] != "{" && str.includes(":")) {
    str = `{${str.replace(/([\w]*)\s*:\s*([\w"'\[\]]*)/g, (m, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
  }
  return str[0] == "{" ? JSON.parse(str) : getGlobalFn(str);
};
