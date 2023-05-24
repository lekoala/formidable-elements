/**
 * @param {HTMLElement} context
 * @param {string|Array} selectors
 */
export default (context, selectors) => {
  selectors = typeof selectors === "string" ? [selectors] : selectors;
  selectors.forEach((selector) => {
    context.querySelectorAll(selector).forEach((element) => {
      element.remove();
    });
  });
};
