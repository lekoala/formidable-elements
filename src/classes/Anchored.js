import FormidableElement from "../utils/FormidableElement.js";
import { addClass, hasClass, removeClass, styles } from "../utils/props.js";
import reflectedProperties from "../utils/reflectedProperties.js";

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
  set.forEach((el) => {
    // Only position if the event contains our target
    const shouldCompute = ev.target instanceof Window || ev.target.contains(el);
    if (shouldCompute) {
      el.reposition();
    }
  });
  ticking = false;
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
    const el = document.querySelector(`[anchor="${entry.target.id}"]`);
    if (el) {
      if (entry.intersectionRatio <= 0) {
        el.setAttribute("hidden", "");
      } else if (entry.intersectionRatio && el.hasAttribute("hidden")) {
        el.removeAttribute("hidden");
      }
      el.reposition();
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
    default:
      console.warn(`Invalid side ${side}`);
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
class Anchored extends FormidableElement {
  /**
   * @type {string}
   */
  anchor;
  /**
   * @type {Placement}
   */
  placement;
  /**
   * @type {string}
   */
  scope;

  constructor() {
    super();
    reflectedProperties(this, Anchored.observedAttributes);

    /**
     * @type {EventCallback}
     */
    this._handler = null;
    this._events = [];
    /**
     * @type {EventCallback}
     */
    this._anchorHandler = null;
    this._anchorEvents = [];
  }

  enable() {
    addClass(this, "is-active");
  }

  disable() {
    removeClass(this, "is-active");
  }

  static get observedAttributes() {
    return ["anchor", "placement", "scope"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.config && newVal && newVal != oldVal) {
      switch (attrName) {
        case "anchor":
          this._findAnchor(newVal);
          break;
        case "scope":
          this._scopeEl = document.getElementById(newVal);
          break;
        case "placement":
          this.config.placement = newVal;
          break;
      }
      this.reposition();
    }
  }

  /**
   * @returns {HTMLElement}
   */
  get anchorEl() {
    //@ts-ignore
    return this._anchorEl;
  }

  /**
   * @returns {HTMLElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  /**
   * @returns {HTMLElement}
   */
  get arrowEl() {
    return this._arrowEl;
  }

  /**
   * @returns {HTMLElement}
   */
  get scopeEl() {
    return this._scopeEl;
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
    this._anchorEvents = this._anchorEvents.concat(events);
    this._anchorHandler = callback;
    this._addRemoveEvents();
  }

  _addRemoveEvents(remove = false) {
    const method = remove ? "removeEventListener" : "addEventListener";
    this._events.forEach((event) => {
      this[method](event, this);
    });
    const target = this.anchorEl;
    if (target) {
      this._anchorEvents.forEach((event) => {
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

  created() {
    // Same config options than floating-ui but simpler
    this.config = Object.assign(
      {
        placement: this.placement || "top",
        distance: 0,
        flip: true,
        shift: null,
        shiftPadding: 0,
        match: "",
        arrowSelector: "[class$='-arrow']",
        arrowPadding: 0,
        autoUpdate: true,
        hideWithAnchor: true,
      },
      this.config
    );
    this.enable();
    // Anchor
    this._findAnchor(this.anchor);
    // Scope
    if (this.scope) {
      this._scopeEl = document.getElementById(this.scope);
      if (this._scopeEl) {
        this.config.shift = true;
      }
    }
    // Arrow
    this._arrowEl = this.config.arrowSelector ? this.querySelector(this.config.arrowSelector) : null;
    if (this.arrowEl && !this.config.arrowPadding) {
      this.config.arrowPadding = parseInt(getComputedStyle(this.el).borderRadius);
    }
  }

  _findAnchor(v) {
    if (!v) {
      v = "_next";
    }
    let el = null;
    if (["_prev", "_next"].includes(v)) {
      el = v == "_prev" ? this.previousElementSibling : this.nextElementSibling;
    } else {
      el = document.getElementById(v);
    }
    if (el && !el.id) {
      el.id = `anchored-${++c}`;
    }
    this._anchorEl = el;
    this.anchor = el.id;
  }

  connected() {
    const target = this.anchorEl;
    if (!target) {
      console.error(`${this.anchor} is invalid`, this);
      return;
    }
    if (this.config.autoUpdate) {
      set.add(this);
    }
    styles(this, {
      position: "fixed",
      zIndex: Z_LOW_INDEX,
    });
    this.reposition();
    this._addRemoveEvents();
    // Hide as soon as anchor leaves the viewport
    if (this.config.hideWithAnchor) {
      observer.observe(target);
    }
  }

  disconnected() {
    const target = this.anchorEl;
    this._addRemoveEvents(true);
    if (this.config.hideWithAnchor && target) {
      observer.unobserve(target);
    }
    if (prevTarget === this) {
      prevTarget = null;
    }
    if (this.config.autoUpdate) {
      set.delete(this);
    }
  }

  /**
   * Event handling can be left to anchored element for proper add/remove of listeners
   * @param {Event} ev
   */
  handleEvent = (ev) => {
    this._updateZindex();
    if (this._handler && ev.currentTarget == this) {
      this._handler(ev, this.el, this);
    }
    if (this._anchorHandler && ev.currentTarget == this.anchorEl) {
      this._anchorHandler(ev, this.el, this);
    }
  };

  reposition() {
    const el = this.el;
    if (!el) {
      return;
    }

    const config = this.config;
    const enabled = hasClass(this, "is-active");
    const elStyles = window.getComputedStyle(el);
    const isVisible = elStyles.display != "none" && !el.hasAttribute("hidden");
    const hasPointerEvents = this.style.pointerEvents != "none";

    // Make sure elements don't catch mouse if their child is not visible or not enabled
    if (!isVisible || !enabled) {
      if (hasPointerEvents) {
        this.style.pointerEvents = "none";
      }
      return;
    }
    if (!hasPointerEvents) {
      this.style.pointerEvents = "";
    }

    const targetEl = this.anchorEl;
    if (!targetEl) {
      this.remove(); // cleanup
      return;
    }
    const anchorStyles = window.getComputedStyle(targetEl);
    const reference = targetEl.getBoundingClientRect();

    let arrow = null;
    const arrowEl = this.arrowEl;
    if (arrowEl) {
      arrowEl.style.position = "absolute"; // out of flow
      arrow = arrowEl.getBoundingClientRect();
    }

    let floating = this.getBoundingClientRect();

    // Fix invalid width/height
    // Not sure why this happens
    if (!floating.height) {
      floating.height = this.el.offsetHeight;
    }
    if (!floating.width) {
      floating.width = this.el.offsetWidth;
    }

    const isRTL = anchorStyles.direction === "rtl";
    /**
     * @type {Placement}
     */
    let placement = this.placement || "bottom";
    let side = getSide(placement);
    let alignement = getAlignment(placement);
    let axis = getMainAxisFromPlacement(placement);

    const doc = this.ownerDocument.documentElement;

    // clientWidth = excluding scrollbar
    let clientWidth = doc.clientWidth;
    let clientHeight = doc.clientHeight;

    let scrollBarWidth = window.innerWidth - clientWidth;

    // on mobile, having a viewport larger than 100% can make window.innerX very different than doc.clientX
    if (scrollBarWidth > 20) {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    }
    let startX = 0;
    let startY = 0;

    // Scoped to element
    const scope = this.scopeEl;
    if (scope) {
      const bounds = scope.getBoundingClientRect();
      startX = bounds.x;
      startY = bounds.y;
      clientWidth = bounds.x + bounds.width;
      clientHeight = bounds.y + bounds.height;
    }

    let coords = computeCoordsFromPlacement(reference, floating, placement, isRTL);
    const offset = parseInt(this.config.distance);
    applyOffset(coords, side, offset, isRTL);

    // Flip if it overflows on axis
    if (config.flip) {
      let placementChanged = false;

      let cx = Math.ceil(coords.x);
      let cy = Math.ceil(coords.y);

      if (axis == "x" && (cy < startY || cy >= clientHeight)) {
        if (cy < startY && cy >= clientHeight) {
          this.style.maxHeight = "90vh";
        } else {
          side = flipSide(side);
          placementChanged = true;
        }
      }
      if (axis == "y" && (cx < startX || cx >= clientWidth)) {
        if (cx < startX && cx >= clientWidth) {
          this.style.maxWidth = "90vw";
        } else {
          side = flipSide(side);
          placementChanged = true;
        }
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
    } else if (this.dataset.flipped) {
      this.dataset.flipped = "";
    }

    // Shift if it overflows on x axis (on y axis, we only flip)
    // Opt-in or automatic if floating is larger than anchor
    let totalShift = 0;
    if (config.shift === null || floating.width > reference.width) {
      if (coords.x < startX) {
        totalShift = coords.x - startX + config.shiftPadding;
        coords.x = startX + config.shiftPadding;
        if (arrowEl && axis == "y") {
          coords.x += arrow.width;
        }
      } else if (coords.x + floating.width > clientWidth) {
        totalShift = clientWidth - (coords.x + floating.width) - config.shiftPadding;
        coords.x += totalShift;
      }
    }

    // Arrow
    if (arrowEl) {
      const arrowPadding = config.arrowPadding || offset;
      let pos, posValue;
      if (axis == "x") {
        pos = reference.x > coords.x ? "right" : "left";
        posValue = floating.width / 2 - arrow.width / 2 + totalShift;
        if (posValue > floating.width - arrowPadding) {
          posValue = floating.width - arrowPadding;
        }
        if (posValue < arrowPadding) {
          posValue = arrowPadding;
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

    // Position element if updated
    styles(this, {
      left: `${coords.x}px`,
      top: `${coords.y}px`,
    });
  }
}

export default Anchored;
