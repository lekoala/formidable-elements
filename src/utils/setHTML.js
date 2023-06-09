/**
 * @link https://web.dev/sanitizer/
 * @link https://sanitizer-api.dev/
 * @param {HTMLElement} el (NOT a template element)
 * @param {string} html
 * @param {Boolean} force
 */
export default function setHTML(el, html, force = false) {
  //@ts-ignore
  if (window.Sanitizer && !force) {
    //@ts-ignore
    el.setHTML(html);
  } else if (window["DOMPurify"]) {
    el.innerHTML = window["DOMPurify"].sanitize(html, {
      WHOLE_DOCUMENT: false,
      FORCE_BODY: false,
    });
  } else {
    el.innerHTML = html;
  }
}

/**
 * Set the global DOMPurify if missing and if Sanitizer api is not available
 * Call this with await before any call to setHTML
 * @param {Boolean} force
 */
export async function loadDOMPurify(force = false) {
  //@ts-ignore
  if ((!window.Sanitizer || force) && !window["DOMPurify"]) {
    //@ts-ignore
    window["DOMPurify"] = (await import("https://cdn.jsdelivr.net/npm/dompurify@3/+esm")).default;
  }
}
