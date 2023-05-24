let counter = 0;

/**
 * @param {HTMLElement} el
 * @param {string} name
 * @returns {string}
 */
export default (el, name) => {
  counter++;
  const id = el.id || `${name}-${counter}`;
  el.id = id;
  return id;
};
