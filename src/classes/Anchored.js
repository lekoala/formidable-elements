import whenParsed from "../utils/whenParsed.js";

/**
 * @callback EventCallback
 * @param {Event} ev
 * @param {HTMLElement} el
 * @param {Anchored} anchored
 * @returns {void}
 */

/**
 * @typedef Coords
 * @property {Number} x
 * @property {Number} y
 */

/**
 * @typedef {('top'|'top-end'|'top-start'|'bottom'|'bottom-end'|'bottom-start'|'left'|'left-end'|'left-start'|'right'|'right-end'|'right-start')} Placement
 */

/**
 * @typedef {('x' | 'y')} Axis
 */

/**
 * @typedef {('start' | 'end')} Alignement
 */

/**
 * @typedef {('width' | 'height')} Length
 */

/**
 * @typedef {( 'top' | 'right' | 'bottom' | 'left')} Side
 */

let c = 0;
const Z_INDEX = "9999";
const Z_LOW_INDEX = "9998";
const set = new Set();

// Update position of elements on scroll or resize
let ticking = false;
const onResize = (ev) => {
  ticking = false;
  set.forEach((el) => {
    // Only position if the event
    const shouldCompute = ev.target instanceof Window || ev.target.contains(el);
    if (shouldCompute) {
      el.position();
    }
  });
};
const rafCallback = (ev) => {
  if (!ticking) {
    requestAnimationFrame(() => onResize(ev));
  }
  ticking = true;
};
document.addEventListener("scroll", rafCallback, true);
window.addEventListener("resize", rafCallback);

// auto hide as soon as anchor is not visible
let observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    /**
     * @type {Anchored}
     */
    const el = document.querySelector(`anchor-ed[to="${entry.target.id}"]`);
    if (el) {
      if (entry.intersectionRatio <= 0) {
        el.setAttribute("hidden", "");
      } else if (entry.intersectionRatio && el.hasAttribute("hidden")) {
        el.removeAttribute("hidden");
      }
      el.position();
    }
  });
});

let prevTarget;

/**
 * @param {Placement} placement
 * @returns {Side}
 */
function getSide(placement) {
  //@ts-ignore
  return placement.split("-")[0];
}

/**
 * @param {Placement} placement
 * @returns {Alignement}
 */
function getAlignment(placement) {
  //@ts-ignore
  return placement.split("-")[1];
}

/**
 * @param {Placement} placement
 * @returns {Axis}
 */
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "x" : "y";
}

/**
 * @param {Axis} axis
 * @returns {Length}
 */
function getLengthFromAxis(axis) {
  return axis === "y" ? "height" : "width";
}

/**
 * @param {Side|string} side
 * @returns {Side}
 */
function flipSide(side) {
  if (side == "top") {
    return "bottom";
  }
  if (side == "bottom") {
    return "top";
  }
  if (side == "left") {
    return "right";
  }
  if (side == "right") {
    return "left";
  }
}

/**
 * @param {Coords} coords
 * @param {Side} side
 * @param {Number} offset
 * @param {Boolean} isRTL
 */
function applyOffset(coords, side, offset, isRTL = false) {
  switch (side) {
    case "top":
      coords.y -= offset;
      break;
    case "bottom":
      coords.y += offset;
      break;
    case "left":
      coords.x += isRTL ? offset : -offset;
      break;
    case "right":
      coords.x += isRTL ? -offset : offset;
      break;
  }
}

/**
 * @link https://github.com/floating-ui/floating-ui/blob/master/packages/core/src/computeCoordsFromPlacement.ts
 * @param {DOMRect} reference
 * @param {DOMRect} floating
 * @param {Placement} placement
 * @param {Boolean} rtl
 * @returns {Coords}
 */
function computeCoordsFromPlacement(reference, floating, placement, rtl = false) {
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === "x";

  let coords;
  switch (side) {
    case "top":
      coords = { x: commonX, y: reference.y - floating.height };
      break;
    case "bottom":
      coords = { x: commonX, y: reference.y + reference.height };
      break;
    case "right":
      coords = { x: reference.x + reference.width, y: commonY };
      break;
    case "left":
      coords = { x: reference.x - floating.width, y: commonY };
      break;
    default:
      coords = { x: reference.x, y: reference.y };
  }

  switch (getAlignment(placement)) {
    case "start":
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }

  return coords;
}

/**
 * A lightweight element to position floating elements (dropdowns, tooltips, popovers...)
 * https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/
 */
class Anchored extends HTMLElement {
  constructor() {
    super();

    this._enabled = true;

    /**
     * @type {EventCallback}
     */
    this._handler = null;
    this._events = [];
    /**
     * @type {EventCallback}
     */
    this._targetHandler = null;
    this._targetEvents = [];
  }

  /**
   * @returns {HTMLElement}
   */
  get target() {
    const v = this.to;
    if (v) {
      return document.getElementById(v);
    }
  }

  /**
   * @returns {HTMLElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  /**
   * @returns {Placement}
   */
  get placement() {
    //@ts-ignore
    return this.dataset.placement;
  }

  /**
   * @returns {HTMLElement}
   */
  get scope() {
    const v = this.getAttribute("scope");
    if (v) {
      return document.getElementById(v);
    }
  }

  get to() {
    return this.getAttribute("to");
  }

  set to(v) {
    this.setAttribute("to", v);
  }

  /**
   * @param {Array} events
   * @param {EventCallback} callback
   */
  on(events, callback) {
    this._events = this._events.concat(events);
    this._handler = callback;
    this._addRemoveEvents();
  }

  /**
   * @param {Array} events
   * @param {EventCallback} callback
   */
  onTarget(events, callback) {
    this._targetEvents = this._targetEvents.concat(events);
    this._targetHandler = callback;
    this._addRemoveEvents();
  }

  enable() {
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
  }

  _addRemoveEvents(remove = false) {
    const method = remove ? "removeEventListener" : "addEventListener";
    this._events.forEach((event) => {
      this[method](event, this);
    });
    const target = this.target;
    if (target) {
      this._targetEvents.forEach((event) => {
        target[method](event, this);
      });
    }
  }

  /**
   * Make sure the last active floating element is on top
   * Only touch dom if necessary
   */
  _updateZindex() {
    if (prevTarget && prevTarget != this && prevTarget.style.zIndex != Z_LOW_INDEX) {
      prevTarget.style.zIndex = Z_LOW_INDEX;
    }
    prevTarget = this;
    if (this.style.zIndex != Z_INDEX) {
      this.style.zIndex = Z_INDEX;
    }
  }

  connectedCallback() {
    whenParsed(this);
  }

  parsedCallback() {
    // Auto assign to prev/next element (next by default)
    if (!this.to || this.to == "_next" || this.to == "_prev") {
      const ne = this.to == "_prev" ? this.previousElementSibling : this.nextElementSibling;
      // attribute is updated based on prop
      // @link https://gomakethings.com/the-difference-between-attributes-and-properties-in-vanilla-js/
      if (!ne.id) {
        ne.id = `anchored-${++c}`;
      }
      this.to = ne.id;
    }
    const target = this.target;
    if (!target) {
      console.error(`${this.to} is an invalid target`);
      return;
    }
    set.add(this);
    this.style.position = "fixed";
    this.style.zIndex = Z_LOW_INDEX;
    this.position();
    this._addRemoveEvents();
    if (!this.dataset.keepVisible) {
      observer.observe(target);
    }
  }

  disconnectedCallback() {
    const target = this.target;
    this._addRemoveEvents(true);
    if (!this.dataset.keepVisible && target) {
      observer.unobserve(target);
    }
    if (prevTarget === this) {
      prevTarget = null;
    }
    set.delete(this);
  }

  /**
   * Event handling can be left to anchored element for proper add/remove of listeners
   * @param {Event} ev
   */
  handleEvent(ev) {
    this._updateZindex();
    if (this._handler && ev.currentTarget == this) {
      this._handler(ev, this.el, this);
    }
    if (this._targetHandler && ev.currentTarget == this.target) {
      this._targetHandler(ev, this.el, this);
    }
  }

  position() {
    const el = this.el;
    if (!el) {
      return;
    }

    const elStyles = window.getComputedStyle(el);
    const isVisible = elStyles.display != "none" && !el.hasAttribute("hidden");
    const hasPointerEvents = this.style.pointerEvents != "none";

    // Make sure elements don't catch mouse if their child is not visible
    if (!isVisible || !this._enabled) {
      if (hasPointerEvents) {
        this.style.pointerEvents = "none";
      }
      return;
    }
    if (!hasPointerEvents) {
      this.style.pointerEvents = "unset";
    }

    const targetEl = this.target;
    if (!targetEl) {
      this.remove(); // cleanup
      return;
    }
    const styles = window.getComputedStyle(targetEl);
    const reference = targetEl.getBoundingClientRect();

    /**
     * @type {HTMLElement}
     */
    const arrowEl = this.dataset.arrow ? this.querySelector(this.dataset.arrow) : null;
    let arrow = null;
    if (arrowEl) {
      arrowEl.style.position = "absolute"; // out of flow
      arrow = arrowEl.getBoundingClientRect();
    }

    // clear coords for proper placement
    Object.assign(this.style, {
      left: `unset`,
      top: `unset`,
    });

    let floating = this.getBoundingClientRect();

    // Fix invalid width/height
    // Not sure why this happens
    if (!floating.height) {
      floating.height = this.el.offsetHeight;
    }
    if (!floating.width) {
      floating.width = this.el.offsetWidth;
    }

    const isRTL = styles.direction === "rtl";
    /**
     * @type {Placement}
     */
    let placement = this.placement || "bottom";
    let side = getSide(placement);
    let alignement = getAlignment(placement);
    let axis = getMainAxisFromPlacement(placement);

    const doc = this.ownerDocument.documentElement;

    // clientWidth = excluding scrollbar
    // on mobile, having viewport units can make window.innerX very different thant doc.clientX
    let clientWidth = Math.max(doc.clientWidth, window.innerWidth);
    let clientHeight = Math.max(doc.clientHeight, window.innerHeight);
    let startX = 0;
    let startY = 0;

    // Scoped to element
    const scope = this.scope;
    if (scope) {
      const bounds = scope.getBoundingClientRect();
      startX = bounds.x;
      startY = bounds.y;
      clientWidth = bounds.x + bounds.width;
      clientHeight = bounds.y + bounds.height;
    }

    let coords = computeCoordsFromPlacement(reference, floating, placement, isRTL);

    const offset = this.dataset.offset !== undefined ? parseInt(this.dataset.offset) : 0;
    applyOffset(coords, side, offset, isRTL);

    // Flip if it overflows on axis
    let placementChanged = false;
    if (axis == "x" && (coords.y < startY || coords.y >= clientHeight)) {
      side = flipSide(side);
      placementChanged = true;
    }
    if (axis == "y" && (coords.x < startX || coords.x >= clientWidth)) {
      side = flipSide(side);
      placementChanged = true;
    }
    // If there is not much space at all in the viewport, then it's better to use top/bottom
    if (axis == "y" && doc.clientWidth - floating.width < 100) {
      side = "top";
      axis = "x";
      placementChanged = true;
    }
    if (placementChanged) {
      this.dataset.flipped = "true";
      placement = alignement ? `${side}-${alignement}` : side;
      //@ts-ignore
      coords = computeCoordsFromPlacement(reference, floating, placement, isRTL);
      applyOffset(coords, side, offset, isRTL);
    }

    // Shift if it overflows on x axis (on y axis, we only flip)
    // Opt-in or automatic if floating is larger than anchor
    let totalShift = 0;
    if (this.dataset.shift !== undefined || floating.width > reference.width) {
      const shiftOffset = parseInt(this.dataset.shift || "0");
      if (coords.x < startX) {
        totalShift = coords.x - startX + shiftOffset;
        coords.x = startX + shiftOffset;
        if (arrowEl && axis == "y") {
          coords.x += arrow.width;
        }
      } else if (coords.x + floating.width > clientWidth) {
        totalShift = clientWidth - (coords.x + floating.width) - shiftOffset;
        coords.x += totalShift;
      }
    }

    // Arrow
    if (arrowEl) {
      let pos, posValue;
      if (axis == "x") {
        pos = reference.x > coords.x ? "right" : "left";
        posValue = floating.width / 2 - arrow.width / 2 + totalShift;
        if (posValue > floating.width - offset) {
          posValue = floating.width - offset;
        }
        if (posValue < offset) {
          posValue = offset;
        }
      }
      if (axis == "y") {
        pos = reference.y < coords.y ? "bottom" : "top";

        posValue = floating.height / 2 - arrow.height / 2;
      }
      const otherPos = flipSide(pos);
      const otherSide = flipSide(side);
      arrowEl.style[side] = `unset`;
      arrowEl.style[otherSide] = `${offset * -1}px`;
      arrowEl.style[otherPos] = "unset";
      arrowEl.style[pos] = `${posValue}px`;
    }

    // Popper compat (useful for bootstrap 5 styles for example)
    // @ts-ignore
    if (el.classList.contains("tooltip")) {
      el.dataset.popperPlacement = placement;
      el.classList.add("bs-tooltip-auto");
    }
    if (el.classList.contains("popover")) {
      el.dataset.popperPlacement = placement;
      el.classList.add("bs-popover-auto");
    }

    // Position element
    Object.assign(this.style, {
      left: `${coords.x}px`,
      top: `${coords.y}px`,
    });
  }
}

export default Anchored;
