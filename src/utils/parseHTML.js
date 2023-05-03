import ce from "./ce.js";

/**
 * @param {string} html
 * @returns {DocumentFragment}
 */
export default function parseHTML(html) {
  const template = ce("template");
  template.innerHTML = html;
  // somehow, template.setHTML is not working in chrome ?
  return template.content;
}
