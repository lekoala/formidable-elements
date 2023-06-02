/**
 * @param {URL} url
 * @returns {Object}
 */
export default (url) => {
  const o = {};
  for (const key in url) {
    if (typeof url[key] === "string") {
      o[key] = url[key];
    }
  }
  return o;
};
