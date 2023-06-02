let counter = 0;

const onEvent = (ev, el, anchored) => {
  let disable = false;
  let enable = false;
  const trigger = anchored.dataset.trigger;
  // treat hover and hover focus the same
  if (trigger == "hover") {
    if (["mouseleave", "blur"].includes(ev.type)) {
      disable = true;
    }
    if (["mouseenter", "focus"].includes(ev.type)) {
      enable = true;
    }
  }
  // dismiss on next click because it loses focus
  if (trigger == "focus") {
    if (["blur"].includes(ev.type)) {
      disable = true;
    }
    if (["focus"].includes(ev.type)) {
      enable = true;
    }
  }
  // click to open
  if (trigger == "click" && ["click"].includes(ev.type)) {
    if (el.classList.contains("show")) {
      disable = true;
    } else {
      enable = true;
    }
  }
  if (enable) {
    anchored.enable();
    el.classList.add("show");
  }
  if (disable) {
    anchored.disable();
    el.classList.remove("show");
  }
  anchored.reposition();
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
      const conf = {};
      //@ts-ignore
      anchored.placement = placement;
      //@ts-ignore
      conf.distance = el.dataset.offset !== undefined ? el.dataset.offset : defaultOffset;
      if (isPopover) {
        //@ts-ignore
        conf.arrowSelector = ".popover-arrow";
        anchored.innerHTML = `<div class="popover fade" role="tooltip"><div class="popover-arrow"></div>
<h3 class="popover-header">${title}</h3>
<div class="popover-body">${content}</div>
</div>`;
      } else {
        //@ts-ignore
        conf.arrowSelector = ".tooltip-arrow";
        anchored.innerHTML = `<div class="tooltip fade" role="tooltip"><div class='tooltip-arrow'></div><div class='tooltip-inner'>${title}</div></div>`;
      }
      if (!el.id) {
        el.id = "tooltip-anchor-" + counter;
      }

      anchored.dataset.config = JSON.stringify(conf);
      //@ts-ignore
      anchored.anchor = el.id;
      anchored.dataset.trigger = trigger.split(" ")[0]; // store trigger for event

      // TODO: maybe it would be better to put them in their own layer ?
      el.parentElement.insertBefore(anchored, el);
      el.dataset.tooltip = "true";

      // Always show
      if (show) {
        //@ts-ignore
        anchored.el.classList.add("show");
        //@ts-ignore
        anchored.reposition();
      } else {
        //@ts-ignore
        anchored.disable();
        //@ts-ignore
        anchored.onTarget(["mouseleave", "blur", "mouseenter", "focus", "click"], onEvent);
      }
    }
  );
}
