import flatpickr from "flatpickr";
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate.js";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import FormidableElement from "../utils/FormidableElement.js";
import insertHiddenInput from "../utils/insertHiddenInput.js";
import setId from "../utils/setId.js";
import waitDefined from "../utils/waitDefined.js";
import { q } from "../utils/query.js";
import { toDateTime, toDate, toTime } from "../utils/date.js";
import localeProvider from "../utils/localeProvider.js";

const events = ["change", "blur"];
const name = "flatpickr-input";

// Global localization without passing locale based on navigator language or set default
const globalLocale = localeProvider(name);
if (globalLocale) {
    flatpickr.localize(globalLocale);
}

class FlatpickrInput extends FormidableElement {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
        return this.querySelector("input");
    }

    get value() {
        if (this.hiddenInput) {
            return this.hiddenInput.value;
        }
        return this.el.value;
    }

    created() {
        const data = this.dataset;

        // keep original formatted format as display value
        this.keepFormat = !!data.keepFormat;
        /**
         * @type {('full'|'long'|'medium'|'short')}
         */
        //@ts-ignore
        const dateStyle = data.dateStyle || "long";
        /**
         * @type {('full'|'long'|'medium'|'short')}
         */
        //@ts-ignore
        const timeStyle = data.timeStyle || "short";

        // get input
        const input = this.el;
        const id = setId(input, name);

        // default config
        this.config = Object.assign(
            {
                time_24hr: true,
                // defaultDate: new Date(),
            },
            this.config,
        );

        // use locale string by default as a nice format
        if (!this.keepFormat) {
            this.config.allowInput = false; // no way to parse a nicely formatted date
            this.config.formatDate = (v) => {
                const locale = this.config.locale || [];
                /**
                 * @type {Intl.DateTimeFormatOptions}
                 */
                const opts = {
                    dateStyle: dateStyle,
                };
                const date = new Date(v);
                if (this.config.enableTime) {
                    if (this.config.time_24hr) {
                        return `${date.toLocaleDateString(locale, opts)} ${toTime(date)}`;
                    }
                    opts.timeStyle = timeStyle;
                    return date.toLocaleString(locale, opts);
                }
                return date.toLocaleDateString(locale, opts);
            };
        }

        // default to iso format
        if (!this.config.dateFormat) {
            this.config.dataFormat = this.getDefaultFormat();
        }

        // create hidden input (don't use altInput since it breaks label)
        this.hiddenInput = this.keepFormat ? null : insertHiddenInput(input);

        // make sure we don't override given value if defaultDate is set (use actual attribute, not .value)
        const originalValue = this.hiddenInput ? this.hiddenInput.value : input.value;
        if (originalValue) {
            this.config.defaultDate = originalValue;
        }

        // plugins
        const plugins = [];
        if (data.range) {
            // Range plugin is not quite there yet
            // @link https://github.com/flatpickr/flatpickr/issues/1208
            const other = q("input", data.range);
            if (other) {
                // If range is set on the first element determine the pair that will be called by set range
                this.el.dataset.rangeEnd = `${data.range}`;
                other.dataset.rangeStart = `#${id}`;
            }
        }
        // add a "ok" selector at the bottom of the popup
        if (data.confirmDate) {
            //@ts-ignore
            plugins.push(new confirmDatePlugin({}));
        }
        if (data.monthSelect) {
            //@ts-ignore
            plugins.push(new monthSelectPlugin({}));
        }
        this.config.plugins = plugins;

        // load given locale
        // wait until locale is defined
        const locale = this.config.locale;
        if (locale) {
            const labels = localeProvider(name, locale);
            if (labels && Object.keys(labels).length > 0) {
                window["flatpickr"]["l10ns"][locale] = labels;
            }
        }
        // This may be necessary due to how flatpickr handles translations
        waitDefined(
            () => {
                // return early
                if (!locale || typeof locale !== "string") {
                    return true;
                }
                //@ts-ignore
                return window.flatpickr.l10ns[locale] === undefined;
            },
            () => {
                this.init();
            },
        );
    }

    /**
     * @returns {String}
     */
    getDefaultFormat() {
        if (this.config.enableTime) {
            if (this.config.noCalendar) {
                return "H:i:S";
            }
            return "Y-m-d H:i:S";
        }
        return "Y-m-d";
    }

    convertDate(date) {
        if (this.config.enableTime) {
            if (this.config.noCalendar) {
                return toTime(date);
            }
            return toDateTime(date);
        }
        return toDate(date);
    }

    init() {
        // Use arrow function to make sure that the scope is always this
        this.handleEvent = (ev) => {
            this._handleEvent(ev);
        };

        const input = this.el;

        /**
         * @type {flatpickr.Instance}
         */
        this.flatpickr = flatpickr(input, this.config);

        if (this.el.value) {
            this._setRange(this.flatpickr.selectedDates[0]);
        }

        for (const type of events) {
            input.addEventListener(type, this);
        }
    }

    /**
     * @param {Event} ev
     */
    _handleEvent(ev) {
        const d = this.flatpickr.selectedDates[0] || null;

        let v = "";
        if (d) {
            v = this.convertDate(new Date(d));
        }

        // hidden value
        if (this.hiddenInput) {
            this.hiddenInput.value = v;
        }

        this._setRange(d);

        // This can be useful to have one source of truth for the value when updated
        this.dispatchEvent(
            new CustomEvent("valueChanged", {
                detail: v,
            }),
        );
    }

    _setRange(d) {
        let fp;
        // range management
        if (this.el.dataset.rangeStart) {
            //@ts-ignore
            fp = q(this.el.dataset.rangeStart)._flatpickr || null;
            if (fp) {
                fp.set("maxDate", d);
            }
        }
        if (this.el.dataset.rangeEnd) {
            //@ts-ignore
            fp = q(this.el.dataset.rangeEnd)._flatpickr || null;
            if (fp) {
                fp.set("minDate", d);
            }
        }
    }

    destroyed() {
        const input = this.el;

        for (const type of events) {
            input.removeEventListener(type, this);
        }
        if (this.flatpickr) {
            this.flatpickr.destroy();
            this.flatpickr = null;
        }
    }
}

export default FlatpickrInput;
