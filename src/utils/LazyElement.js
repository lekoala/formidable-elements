/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, obs) => {
  entries
    .filter((entry) => entry.isIntersecting)
    .forEach((entry) => {
      obs.unobserve(entry.target);
      //@ts-ignore
      entry.target.init();
    });
});

/**
 * A simple lazy element that auto init itself when in viewport
 */
class LazyElement extends HTMLElement {
  connectedCallback() {
    observer.observe(this);
  }
  disconnectedCallback() {
    observer.unobserve(this);
  }
}

export default LazyElement;
