function s(tagName, selector, ctx) {
  selector = selector || tagName;
  // if its an element
  //@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#value
  if (ctx.nodeType == 1) {
    selector = `:scope ${selector}`;
  }
  return selector;
}

/**
 * Query an array of elements
 *
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element, or global selector string (returns any element).
 * @param {String} selector Selector
 * @param {Document|HTMLElement} ctx Context (document by default). If a context is specified, :scope is applied
 * @returns {Array<HTMLElementTagNameMap[K]>}
 */
export function qq(tagName, selector = null, ctx = document) {
  return Array.from(ctx.querySelectorAll(s(tagName, selector, ctx)));
}

/**
 * Query an element
 *
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element, or global selector string (returns any element).
 * @param {String} selector Selector
 * @param {Document|HTMLElement} ctx Context (document by default). If a context is specified, :scope is applied
 * @returns {HTMLElementTagNameMap[K]}
 */
export function q(tagName, selector = null, ctx = document) {
  return ctx.querySelector(s(tagName, selector, ctx));
}
