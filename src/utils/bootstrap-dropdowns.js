let counter = 0;

const MENU_SELECTOR = ".dropdown-menu";
const ESCAPE_KEY = "Escape";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";

const activeDropdowns = new Set();
const clearDropdowns = () => {
  activeDropdowns.forEach((anchored) => {
    anchored.el.classList.remove("show");
  });
  activeDropdowns.clear();
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list The list of elements
 * @param {HTMLElement|EventTarget} activeElement The active element
 * @param {Boolean} shouldGetNext Choose to get next or previous element
 * @param {Boolean} isCycleAllowed
 * @return {HTMLElement} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed = false) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }

  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

const onEvent = (ev, el, anchored) => {
  if (ev.type == "click") {
    el.classList.toggle("show");
    el.focus();
    const shown = el.classList.contains("show");
    const btn = anchored.target;
    btn.ariaExpanded = shown ? "true" : "false";
    anchored.position();
    if (shown) {
      activeDropdowns.add(anchored);
    } else {
      activeDropdowns.delete(anchored);
    }
  }

  onFocus(ev, el, anchored);
  onKeyDown(ev, el, anchored);
};

const onFocus = (ev, el, anchored) => {
  if (ev.type == "focusin" && anchored.focusTimeout) {
    clearTimeout(anchored.focusTimeout);
  }
  if (ev.type == "focusout") {
    const target = anchored.target;
    const autoClose = target.dataset.bsAutoClose || target.dataset.autoClose;
    if (autoClose !== "false" && autoClose !== "inside") {
      // wait a bit because it can be cleared by the next focusin event
      anchored.focusTimeout = setTimeout(() => {
        el.classList.remove("show");
        activeDropdowns.delete(anchored);
      }, 10);
    }
  }
};

const onKeyDown = (ev, el, anchored) => {
  if (ev.type != "keydown") {
    return;
  }
  const key = ev.key;
  //@ts-ignore
  const isInput = /input|textarea/i.test(ev.target.tagName);
  const isEscapeEvent = key === ESCAPE_KEY;
  const isUpOrDownEvent = [ARROW_UP_KEY, ARROW_DOWN_KEY].includes(key);

  if (!isUpOrDownEvent && !isEscapeEvent) {
    return;
  }
  if (isInput && !isEscapeEvent) {
    return;
  }

  ev.preventDefault();

  if (isEscapeEvent) {
    clearDropdowns();
  }
  if (isUpOrDownEvent) {
    const target = ev.target;
    const lastActive = [...activeDropdowns].pop();
    const items = Array.from(lastActive.querySelectorAll(".dropdown-item")).filter((element) => {
      if (element.matches(":disabled,.disabled")) {
        return false;
      }
      return true;
    });
    if (!items.length) {
      return;
    }
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
  }
};

const onMenuEvent = (ev, el, anchored) => {
  if (activeDropdowns.size == 0) {
    return;
  }
  if (ev.type == "click") {
    activeDropdowns.forEach((anchored) => {
      const target = anchored.target;
      const autoClose = target.dataset.bsAutoClose || target.dataset.autoClose;
      if (autoClose === "false" || autoClose === "outside") {
        return;
      }
      anchored.el.classList.remove("show");
      activeDropdowns.delete(anchored);
    });
  }
  onFocus(ev, el, anchored);
  onKeyDown(ev, el, anchored);
};

/**
 * A simplified yet very effective way to manage bootstrap dropdowns using anchor-ed
 * @link https://github.com/twbs/bootstrap/blob/main/js/src/dropdown.js
 * @param {string} selector
 */
export default function dropdowns(selector = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)') {
  const anchoredCtor = customElements.get("anchor-ed");
  const list = document.querySelectorAll(selector);

  list.forEach(
    /**
     * @param {HTMLElement} el
     */
    (el) => {
      // Avoid multiple init
      if (el.dataset.dropdown) {
        return;
      }
      el.dataset.dropdown = "true";
      el.ariaExpanded = "false";
      counter++;

      const parent = el.parentElement;

      // Default placement based on class name
      let defaultPlacement = "";
      const defaultPlacements = {
        "bottom-start": ["dropdown"],
        bottom: ["dropdown-center"],
        "top-start": ["dropup"],
        top: ["droup", "dropup-center"],
        right: ["dropend"],
        left: ["dropstart"],
      };
      for (const [placement, classes] of Object.entries(defaultPlacements)) {
        if (
          classes.every((token) => {
            return parent.classList.contains(token);
          })
        ) {
          defaultPlacement = placement;
        }
      }
      const placement = el.dataset.bsPlacement || el.dataset.placement || defaultPlacement;
      const menu = el.parentElement.querySelector(MENU_SELECTOR);

      // Wrap menu in anchor-ed
      const anchored = new anchoredCtor();
      anchored.dataset.placement = placement;
      if (!el.id) {
        el.id = "dropdown-anchor-" + counter;
      }
      anchored.setAttribute("to", el.id);
      anchored.dataset.offset = "2";
      parent.insertBefore(anchored, menu);
      anchored.appendChild(menu); // move into

      // We listen on both the anchor and the menu
      //@ts-ignore
      anchored.on(["click", "keydown", "focusout", "focusin"], onMenuEvent);
      //@ts-ignore
      anchored.onTarget(["click", "blur", "keydown", "focusout", "focusin"], onEvent);
    }
  );
}
