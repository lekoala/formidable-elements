/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element
 * @returns {HTMLElementTagNameMap[K]}
 */
export default (tagName) => {
  //@ts-ignore
  return document.createElement(tagName);
};
