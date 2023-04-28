/**
 * Only useful if not loading script using type="module" or defer
 * Those will run when readyState is interactive and before DOMContentLoaded
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
 * @param {Function} cb
 */
export default function domReady(cb) {
  if (document.readyState === "complete") {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", cb, { once: true });
  }
}
