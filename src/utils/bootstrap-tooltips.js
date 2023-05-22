let counter = 0;

const onEvent = (ev, el, anchored) => {
  if (["mouseleave", "blur"].includes(ev.type)) {
    el.classList.remove("show");
  }
  if (["mouseenter", "focus"].includes(ev.type)) {
    el.classList.add("show");
  }
  anchored.position();
};

/**
 * A simplified yet very effective way to manage bootstrap tooltips using anchor-ed
 * It can also work with non bootstrap tooltips without bs-suffix and if you change the selector
 * but you need the same markup
 * @link https://github.com/twbs/bootstrap/blob/main/js/src/tooltip.js
 * @param {string} selector
 */
export default function tooltips(selector = '[data-bs-toggle="tooltip"]') {
  const anchoredCtor = customElements.get("anchor-ed");
  const list = document.querySelectorAll(selector);

  list.forEach(
    /**
     * @param {HTMLElement} el
     */
    (el) => {
      // Avoid multiple init
      if (el.dataset.tooltip) {
        return;
      }
      counter++;

      const placement = el.dataset.bsPlacement || el.dataset.placement;
      const title = el.dataset.bsTitle || el.dataset.title || el.title;
      const show = el.dataset.show;

      if (el.title) {
        el.dataset.originalTitle = el.title;
        el.removeAttribute("title");
      }

      // create tooltip as anchored element
      const anchored = new anchoredCtor();
      anchored.dataset.placement = placement;
      anchored.dataset.offset = el.dataset.offset !== undefined ? el.dataset.offset : "6";
      anchored.dataset.arrow = ".tooltip-arrow";
      anchored.innerHTML = `<div class="tooltip" role="tooltip"><div class='tooltip-arrow'></div><div class='tooltip-inner'>${title}</div></div>`;
      if (!el.id) {
        el.id = "tooltip-anchor-" + counter;
      }
      anchored.setAttribute("to", el.id);
      el.parentElement.insertBefore(anchored, el);
      el.dataset.tooltip = "true";

      // Always show
      if (show) {
        //@ts-ignore
        anchored.el.classList.add("show");
        //@ts-ignore
        anchored.position();
      } else {
        //@ts-ignore
        anchored.onTarget(["mouseleave", "blur", "mouseenter", "focus"], onEvent);
      }
    }
  );
}
