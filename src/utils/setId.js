import attr from "./attr.js";

let counter = 0;

/**
 * @param {HTMLElement} el
 * @param {string} name
 * @returns {string}
 */
export default function setId(el, name) {
  counter++;
  const id = attr(el, "id") || `${name}-${counter}`;
  attr(el, "id", id);
  return id;
}
