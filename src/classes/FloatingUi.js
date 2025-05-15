import { arrow, autoUpdate, computePosition, flip, offset, shift, limitShift, size } from "@floating-ui/dom";
import FormidableElement from "../utils/FormidableElement.js";
import { addClass, dataset, hasClass, removeClass, styles } from "../utils/props.js";
import isRTL from "../utils/isRTL.js";
import reflectedProperties from "../utils/reflectedProperties.js";

let c = 0;

/**
 * @typedef {('top'|'top-end'|'top-start'|'bottom'|'bottom-end'|'bottom-start'|'left'|'left-end'|'left-start'|'right'|'right-end'|'right-start')} Placement
 */

/**
 * Similar to anchor-ed, but using floating ui under the hood
 *
 * Follows a similar implementation as
 * @link https://github.com/shoelace-style/shoelace/blob/next/src/components/popup/popup.ts
 */
class FloatingUi extends FormidableElement {
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
        reflectedProperties(this, FloatingUi.observedAttributes);
    }

    created() {
        this.config = Object.assign(
            {
                // Use fixed to avoid overflow and offset issues
                // @link https://floating-ui.com/docs/computePosition
                // @link https://floating-ui.com/docs/platform#shadow-dom-fix
                strategy: "fixed",
                placement: this.placement || "top",
                // @link https://floating-ui.com/docs/offset
                distance: 0,
                skidding: 0,
                // @link https://floating-ui.com/docs/flip
                flip: null,
                flipPadding: 0,
                flipFallbackStrategy: "bestFit",
                flipBoundary: undefined,
                // @link https://floating-ui.com/docs/shift
                shift: false,
                shiftBoundary: undefined,
                shiftPadding: 0,
                shiftLimiter: limitShift,
                // @link https://floating-ui.com/docs/size
                match: "",
                autoSize: "",
                autoSizeBoundary: undefined,
                autoSizePadding: 0,
                // @link https://floating-ui.com/docs/arrow
                arrowSelector: "[class$='-arrow']",
                arrowPadding: 0,
                arrowPlacement: null,
                // @link https://floating-ui.com/docs/autoUpdate
                liveUpdate: false,
                autoUpdate: true,
            },
            this.config,
        );
        this.enable();
        if (this.config.flip === null) {
            // Flip by default for centered content
            this.config.flip = this.config.placement.includes("-");
        }
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
            el = v === "_prev" ? this.previousElementSibling : this.nextElementSibling;
        } else {
            el = document.getElementById(v);
        }
        if (el && !el.id) {
            el.id = `floating-${++c}`;
        }
        this._anchorEl = el;
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
        if (this.config && newVal && newVal !== oldVal) {
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

    start() {
        styles(this, {
            position: this.config.strategy,
        });

        // We can't start the positioner without an anchor
        if (!this.anchorEl) {
            return;
        }

        // Call manually
        if (!this.config.autoUpdate) {
            return;
        }

        // @link https://floating-ui.com/docs/autoUpdate
        const opts = {
            //   ancestorScroll: true,
            //   ancestorResize: true,
            //   elementResize: true,
            animationFrame: this.config.liveUpdate,
        };

        /**
         * @type {Function}
         */
        this._cleanup = autoUpdate(
            this.anchorEl,
            this,
            () => {
                this.reposition();
            },
            opts,
        );
    }

    stop() {
        if (this._cleanup) {
            this._cleanup();
            this._cleanup = undefined;
        }
        this._setDataPlacement("");
        this.style.cssText = "";
    }

    connected() {
        this.start();
    }

    disconnected() {
        this.stop();
    }

    _setDataPlacement(placement) {
        dataset(this, {
            currentPlacement: placement,
        });
        // Bootstrap rely on specific data-attr
        if (this.el && hasClass(this.el, "bs-tooltip-auto")) {
            dataset(this.el, {
                popperPlacement: placement,
            });
        }
    }

    /**
     * Forces the popup to recalculate and reposition itself.
     */
    reposition() {
        // Nothing to do if the popup is inactive or the anchor doesn't exist
        if (!hasClass(this, "is-active") || !this.anchorEl) {
            return;
        }

        const config = this.config;

        // Floating UI middlewares are order dependent: https://floating-ui.com/docs/middleware
        const middleware = [
            // The offset middleware goes first
            offset({ mainAxis: config.distance, crossAxis: config.skidding }),
        ];

        // Match width/height
        // @link https://floating-ui.com/docs/size#match-reference-width
        if (config.match) {
            middleware.push(
                size({
                    apply: ({ rects }) => {
                        const ref = rects.reference;
                        const matchWidth = config.match === "width" || config.match === "both";
                        const matchHeight = config.match === "height" || config.match === "both";
                        const wh = {};
                        wh.width = matchWidth ? `${ref.width}px` : "";
                        wh.height = matchHeight ? `${ref.height}px` : "";
                        styles(this, wh);
                    },
                }),
            );
        } else {
            styles(this, {
                width: "",
                height: "",
            });
        }

        // Then we flip
        if (config.flip) {
            middleware.push(
                flip({
                    boundary: this._scopeEl || config.flipBoundary,
                    fallbackStrategy: config.flipFallbackStrategy === "bestFit" ? "bestFit" : "initialPlacement",
                    padding: config.flipPadding,
                }),
            );
        }

        // Then we shift
        if (config.shift) {
            middleware.push(
                shift({
                    boundary: this._scopeEl || config.shiftBoundary,
                    padding: config.shiftPadding,
                    limiter: config.shiftLimiter(),
                }),
            );
        }

        // Now we adjust the size as needed
        if (config.autoSize) {
            middleware.push(
                size({
                    boundary: this._scopeEl || config.autoSizeBoundary,
                    padding: config.autoSizePadding,
                    apply: ({ availableWidth, availableHeight }) => {
                        if (config.autoSize === "vertical" || config.autoSize === "both") {
                            this.style.setProperty("--auto-size-available-height", `${availableHeight}px`);
                        } else {
                            this.style.removeProperty("--auto-size-available-height");
                        }

                        if (config.autoSize === "horizontal" || config.autoSize === "both") {
                            this.style.setProperty("--auto-size-available-width", `${availableWidth}px`);
                        } else {
                            this.style.removeProperty("--auto-size-available-width");
                        }
                    },
                }),
            );
        } else {
            styles(this, {
                maxWidth: "",
                maxHeight: "",
            });
        }

        // Finally, we add an arrow
        if (this.arrowEl) {
            styles(this.arrowEl, {
                position: "absolute",
            });
            middleware.push(
                arrow({
                    element: this.arrowEl,
                    padding: config.arrowPadding,
                }),
            );
        }

        computePosition(this.anchorEl, this, {
            placement: config.placement,
            middleware,
            strategy: config.strategy,
        }).then(({ x, y, middlewareData, placement }) => {
            const rtl = isRTL(this);
            const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[placement.split("-")[0]];

            this._setDataPlacement(placement);

            styles(this, {
                left: `${x}px`,
                top: `${y}px`,
            });

            if (this.arrowEl) {
                // Depending on the placement, either x or y will be undefined
                const arrowX = middlewareData.arrow.x;
                const arrowY = middlewareData.arrow.y;
                let top = "";
                let right = "";
                let bottom = "";
                let left = "";

                if (config.arrowPlacement === "start") {
                    // Start
                    const value = typeof arrowX === "number" ? `${config.arrowPadding}px` : "";
                    top = typeof arrowY === "number" ? `${config.arrowPadding}px` : "";
                    right = rtl ? value : "";
                    left = rtl ? "" : value;
                } else if (config.arrowPlacement === "end") {
                    // End
                    const value = typeof arrowX === "number" ? `${config.arrowPadding}px` : "";
                    right = rtl ? "" : value;
                    left = rtl ? value : "";
                    bottom = typeof arrowY === "number" ? `${config.arrowPadding}px` : "";
                } else if (config.arrowPlacement === "center") {
                    // Center
                    left = typeof arrowX === "number" ? "calc(50% - var(--arrow-width))" : "";
                    top = typeof arrowY === "number" ? "calc(50% - var(--arrow-height))" : "";
                } else {
                    // Anchor (default)
                    left = typeof arrowX === "number" ? `${arrowX}px` : "";
                    top = typeof arrowY === "number" ? `${arrowY}px` : "";
                }

                const arrowPos = {
                    top,
                    right,
                    bottom,
                    left,
                };
                // This works well with any logic similar to bootstrap
                arrowPos[staticSide] = "calc(-1 * var(--arrow-height))";
                styles(this.arrowEl, arrowPos);
            }
        });
    }
}

export default FloatingUi;
