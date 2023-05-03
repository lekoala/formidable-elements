/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element
 * @returns {HTMLElementTagNameMap[K]}
 */
export default function ce(tagName) {
  return document.createElement(tagName);
}
