import insertAfter from "./insertAfter.js";

/**
 * Get or create a hidden element
 * @param {HTMLInputElement} input
 * @param {string} v
 * @returns {HTMLInputElement}
 */
export default (input, v = undefined) => {
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
  if (v !== undefined) {
    h.value = v;
  }
  // swap names, keep ids
  // keep formatted value (we use prefix for fields like name[arr][val])
  // to string is required otherwise sometimes we end up with __ due to order of assignments when minifying
  h.name = input.name.toString();
  input.name = `_${input.name}`;

  return h;
};
