import insertAfter from "./insertAfter.js";
import isUndefined from "./isUndefined.js";

/**
 * Get or create a hidden element
 * @param {HTMLInputElement} input
 * @param {string} v
 * @returns {HTMLInputElement}
 */
export default function insertHiddenInput(input, v = undefined) {
  /**
   * @type {HTMLInputElement}
   */
  let h = input.parentElement.querySelector('input[type="hidden"]');
  if (!h) {
    h = document.createElement("input");
    h.type = "hidden";
    h.value = input.value; // inherit value from input
    insertAfter(h, input);
  }
  // pass a custom value
  if (!isUndefined(v)) {
    h.value = v;
  }
  // swap names, keep ids
  // keep formatted value (we use prefix for fields like name[arr][val])
  h.name = input.name;
  input.name = `formatted_${input.name}`;

  return h;
}
