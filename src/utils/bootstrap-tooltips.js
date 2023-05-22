let counter = 0;

const onEvent = (ev, el, anchored) => {
  const trigger = anchored.dataset.trigger;
  // treat hover and hover focus the same
  if (trigger == "hover") {
    if (["mouseleave", "blur"].includes(ev.type)) {
      anchored.disable();
      el.classList.remove("show");
    }
    if (["mouseenter", "focus"].includes(ev.type)) {
      anchored.enable();
      el.classList.add("show");
    }
  }
  // dismiss on next click because it loses focus
  if (trigger == "focus") {
    if (["blur"].includes(ev.type)) {
      anchored.disable();
      el.classList.remove("show");
    }
    if (["focus"].includes(ev.type)) {
      anchored.enable();
      el.classList.add("show");
    }
  }
  // click to open
  if (trigger == "click" && ["click"].includes(ev.type)) {
    el.classList.toggle("show");
  }
  anchored.position();
};

/**
 * A simplified yet very effective way to manage bootstrap tooltips and popovers using anchor-ed
 * It can also work with non bootstrap tooltips without bs-suffix and if you change the selector
 * but you need the same markup
 * @link https://github.com/twbs/bootstrap/blob/main/js/src/tooltip.js
 * @param {string} selector
 */
export default function tooltips(selector = '[data-bs-toggle="tooltip"],[data-bs-toggle="popover"]') {
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

      const title = el.dataset.bsTitle || el.dataset.title || el.title;
      const content = el.dataset.bsContent || el.dataset.content;
      const show = el.dataset.show;
      const isPopover = content !== undefined;
      const defaultPlacement = isPopover ? "right" : "top";
      const defaultOffset = isPopover ? "8" : "6";
      const defaultTrigger = isPopover ? "click" : "hover";
      const trigger = el.dataset.bsTrigger || el.dataset.trigger || defaultTrigger;
      const placement = el.dataset.bsPlacement || el.dataset.placement || defaultPlacement;

      if (el.title) {
        el.dataset.originalTitle = el.title;
        el.removeAttribute("title");
      }

      // create tooltip as anchored element
      const anchored = new anchoredCtor();
      anchored.dataset.placement = placement;
      anchored.dataset.offset = el.dataset.offset !== undefined ? el.dataset.offset : defaultOffset;
      if (isPopover) {
        anchored.dataset.arrow = ".popover-arrow";
        anchored.innerHTML = `<div class="popover fade" role="tooltip"><div class="popover-arrow"></div>
<h3 class="popover-header">${title}</h3>
<div class="popover-body">${content}</div>
</div>`;
      } else {
        anchored.dataset.arrow = ".tooltip-arrow";
        anchored.innerHTML = `<div class="tooltip fade" role="tooltip"><div class='tooltip-arrow'></div><div class='tooltip-inner'>${title}</div></div>`;
      }
      if (!el.id) {
        el.id = "tooltip-anchor-" + counter;
      }
      anchored.setAttribute("to", el.id);
      anchored.dataset.trigger = trigger.split(" ")[0]; // store trigger for event

      // TODO: maybe it would be better to put them in their own layer ?
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
        anchored.disable();
        //@ts-ignore
        anchored.onTarget(["mouseleave", "blur", "mouseenter", "focus", "click"], onEvent);
      }
    }
  );
}
