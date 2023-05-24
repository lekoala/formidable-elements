/**
 * @param {HTMLElement} el
 * @param {Array} props
 * @returns {HTMLElement}
 */
export default (el, props = []) => {
  const n = document.createElement(el.nodeName);
  props.forEach((p) => {
    n[p] = el[p];
  });
  return n;
};
