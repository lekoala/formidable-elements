let checkDomain = (url) => {
  if (url.indexOf("//") === 0) {
    url = location.protocol + url;
  }
  return url
    .toLowerCase()
    .replace(/([a-z])?:\/\//, "$1")
    .split("/")[0];
};

/**
 * @link https://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
 * @param {string} url
 * @returns {Boolean}
 */
export default (url) => {
  return (url.indexOf(":") > -1 || url.indexOf("//") > -1) && checkDomain(location.href) !== checkDomain(url);
};
