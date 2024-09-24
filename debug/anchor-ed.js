(() => {
  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn) => fn.split(".").reduce((r, p) => r[p], window);

  // src/utils/replaceCallbacks.js
  var replaceCallbacks = (obj) => {
    if (isString_default(obj)) {
      obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn_default(obj);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v == "object") {
        const fn = v["__fn"];
        if (isString_default(fn)) {
          obj[k] = getGlobalFn_default(fn);
        } else {
          replaceCallbacks(v);
        }
      }
    }
    return obj;
  };
  var replaceCallbacks_default = replaceCallbacks;

  // src/utils/simpleConfig.js
  var simpleConfig_default = (str) => {
    if (!str) {
      return {};
    }
    if (str[0] != "{" && str.includes(":")) {
      str = `{${str.replace(/([\w]*)\s*:\s*([\w"'\[\]]*)/g, (m2, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
    }
    return str[0] == "{" ? JSON.parse(str) : getGlobalFn_default(str);
  };

  // src/utils/whenParsed.js
  var whenParsed = (el) => {
    let ref = el;
    do {
      if (ref.nextSibling) {
        el.parsedCallback();
        return;
      }
      ref = ref.parentNode;
    } while (ref);
    setTimeout(() => {
      el.parsedCallback();
    });
  };
  var whenParsed_default = whenParsed;

  // src/utils/FormidableElement.js
  var ID_KEY = "__fe_id";
  window[ID_KEY] = window[ID_KEY] || 0;
  var m = /* @__PURE__ */ new Map();
  var FormidableElement = class extends HTMLElement {
    constructor() {
      super();
      this.id = this.id || `fe-${window[ID_KEY]++}`;
      const o = m.get(this.id);
      if (o) {
        if (o != this.innerHTML) {
          this.innerHTML = o;
        }
      } else {
        m.set(this.id, this.innerHTML);
      }
    }
    /**
     * This can get called multiple times
     */
    connectedCallback() {
      if (this._t) {
        clearTimeout(this._t);
      }
      whenParsed_default(this);
    }
    disconnectedCallback() {
      this.disconnected();
      this._t = setTimeout(() => {
        this.destroyed();
        this.config = null;
        if (!document.getElementById(this.id)) {
          m.delete(this.id);
        }
      }, 1e3);
    }
    parsedCallback() {
      if (!this.config) {
        this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
        this.created();
      }
      this.connected();
    }
    /**
     * Called only once in component lifecycle
     * Config is parsed again just before created is called
     */
    created() {
    }
    /**
     * Called if the element is not reconnected quickly after being disconnected
     * Will set config to null
     */
    destroyed() {
    }
    /**
     * Called each time the component is connected (inserted)
     */
    connected() {
    }
    /**
     * Called each time the component is disconnected (removed or destroyed)
     */
    disconnected() {
    }
  };
  var FormidableElement_default = FormidableElement;

  // src/utils/props.js
  function props(el, obj, prop = null) {
    const target = prop ? el[prop] : el;
    Object.assign(target, obj);
  }
  function styles(el, obj) {
    props(el, obj, "style");
  }
  function addClass(el, v) {
    v = typeof v === "string" ? [v] : v;
    el.classList.add(...v);
  }
  function removeClass(el, v) {
    v = typeof v === "string" ? [v] : v;
    el.classList.remove(...v);
  }
  function hasClass(el, v) {
    return el.classList.contains(v);
  }

  // src/utils/reflectedProperties.js
  var reflectedProperties_default = (obj, props2) => {
    for (const key of props2) {
      Object.defineProperty(obj, key, {
        get() {
          return obj.getAttribute(key);
        },
        set(value) {
          obj.setAttribute(key, value);
        }
      });
    }
  };

  // src/classes/Anchored.js
  var c = 0;
  var Z_INDEX = "9999";
  var Z_LOW_INDEX = "9998";
  var set = /* @__PURE__ */ new Set();
  var ticking = false;
  var onResize = (ev) => {
    set.forEach((el) => {
      const shouldCompute = ev.target instanceof Window || ev.target.contains(el);
      if (shouldCompute) {
        el.reposition();
      }
    });
    ticking = false;
  };
  var rafCallback = (ev) => {
    if (!ticking) {
      requestAnimationFrame(() => onResize(ev));
    }
    ticking = true;
  };
  document.addEventListener("scroll", rafCallback, true);
  window.addEventListener("resize", rafCallback);
  var observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
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
  var prevTarget;
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].includes(getSide(placement)) ? "x" : "y";
  }
  function getLengthFromAxis(axis) {
    return axis === "y" ? "height" : "width";
  }
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
  var Anchored = class _Anchored extends FormidableElement_default {
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
      reflectedProperties_default(this, _Anchored.observedAttributes);
      this._handler = null;
      this._events = [];
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
      return this._anchorEl;
    }
    /**
     * @returns {HTMLElement}
     */
    get el() {
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
          hideWithAnchor: true
        },
        this.config
      );
      this.enable();
      this._findAnchor(this.anchor);
      if (this.scope) {
        this._scopeEl = document.getElementById(this.scope);
        if (this._scopeEl) {
          this.config.shift = true;
        }
      }
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
        zIndex: Z_LOW_INDEX
      });
      this.reposition();
      this._addRemoveEvents();
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
        this.remove();
        return;
      }
      const anchorStyles = window.getComputedStyle(targetEl);
      const reference = targetEl.getBoundingClientRect();
      let arrow = null;
      const arrowEl = this.arrowEl;
      if (arrowEl) {
        arrowEl.style.position = "absolute";
        arrow = arrowEl.getBoundingClientRect();
      }
      let floating = this.getBoundingClientRect();
      if (!floating.height) {
        floating.height = this.el.offsetHeight;
      }
      if (!floating.width) {
        floating.width = this.el.offsetWidth;
      }
      const isRTL = anchorStyles.direction === "rtl";
      let placement = this.placement || "bottom";
      let side = getSide(placement);
      let alignement = getAlignment(placement);
      let axis = getMainAxisFromPlacement(placement);
      const doc = this.ownerDocument.documentElement;
      let clientWidth = doc.clientWidth;
      let clientHeight = doc.clientHeight;
      let scrollBarWidth = window.innerWidth - clientWidth;
      if (scrollBarWidth > 20) {
        clientWidth = window.innerWidth;
        clientHeight = window.innerHeight;
      }
      let startX = 0;
      let startY = 0;
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
        if (axis == "y" && doc.clientWidth - floating.width < 100) {
          side = "top";
          axis = "x";
          placementChanged = true;
        }
        if (placementChanged) {
          this.dataset.flipped = "true";
          placement = alignement ? `${side}-${alignement}` : side;
          coords = computeCoordsFromPlacement(reference, floating, placement, isRTL);
          applyOffset(coords, side, offset, isRTL);
        }
      } else if (this.dataset.flipped) {
        this.dataset.flipped = "";
      }
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
      if (el.classList.contains("tooltip")) {
        el.dataset.popperPlacement = placement;
        el.classList.add("bs-tooltip-auto");
      }
      if (el.classList.contains("popover")) {
        el.dataset.popperPlacement = placement;
        el.classList.add("bs-popover-auto");
      }
      styles(this, {
        left: `${coords.x}px`,
        top: `${coords.y}px`
      });
    }
  };
  var Anchored_default = Anchored;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/anchor-ed.js
  defineEl_default("anchor-ed", Anchored_default);
  var anchor_ed_default = Anchored_default;
})();
