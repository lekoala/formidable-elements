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

  // src/utils/date.js
  function changeDate(expr, dateOrTime = null) {
    if (!dateOrTime) {
      dateOrTime = /* @__PURE__ */ new Date();
    }
    let t = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
    if (expr.seconds) t += 1e3 * expr.seconds;
    if (expr.minutes) t += 1e3 * 60 * expr.minutes;
    if (expr.hours) t += 1e3 * 60 * 60 * expr.hours;
    if (expr.days) t += 1e3 * 60 * 60 * 24 * expr.days;
    return new Date(t);
  }
  function dateParts(dateOrTime) {
    const t = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
    const expr = {
      days: Math.floor(t / (1e3 * 60 * 60 * 24)),
      hours: Math.floor(t % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)),
      minutes: Math.floor(t % (1e3 * 60 * 60) / (1e3 * 60)),
      seconds: Math.floor(t % (1e3 * 60) / 1e3)
    };
    return expr;
  }
  function asDate(str = null) {
    if (!str) {
      return /* @__PURE__ */ new Date();
    }
    if (str instanceof Date) {
      return str;
    }
    return new Date(expandDate(str));
  }
  function expandDate(str) {
    const s2 = "0000-01-01 00:00:00";
    while (str.length < s2.length) {
      str += s2[str.length];
    }
    return str;
  }

  // src/utils/query.js
  function s(tagName, selector, ctx) {
    selector = selector || tagName;
    if (ctx.nodeType == 1) {
      selector = `:scope ${selector}`;
    }
    return selector;
  }
  function q(tagName, selector = null, ctx = document) {
    return ctx.querySelector(s(tagName, selector, ctx));
  }

  // src/utils/localeProvider.js
  var localeProvider_default = (name2, locale = "default", defaults = null) => {
    const el = customElements.get("locale-provider");
    if (!el) {
      return defaults;
    }
    return Object.assign(defaults || {}, el.for(name2, locale));
  };

  // src/classes/CountdownElement.js
  var name = "count-down";
  function pad(v, qt = 2) {
    return v.toString().padStart(qt, "0");
  }
  function fraction(parts, toUnit, digits = 2) {
    const units = {
      seconds: 60,
      minutes: 60,
      hours: 24,
      days: 1
    };
    let v = 0;
    let multiply = false;
    for (const [unit, factor] of Object.entries(units)) {
      const vv = parts[unit];
      if (unit == toUnit) {
        v += vv;
        multiply = true;
      } else {
        if (multiply) {
          v += vv * factor;
        } else {
          v += vv / factor;
        }
      }
    }
    return (Math.round(v * 100) / 100).toFixed(digits);
  }
  function computeData(data, inst) {
    const parts = dateParts(data.diff);
    if (inst.config.unit) {
      data[inst.config.unit] = fraction(parts, inst.config.unit, inst.config.decimalDigits);
    } else {
      const qt = inst.config.pad ? 2 : 1;
      data.days = parts.days.toString();
      data.hours = pad(parts.hours, qt);
      data.minutes = pad(parts.minutes, qt);
      data.seconds = pad(parts.seconds, qt);
    }
    for (const [name2, value] of Object.entries(inst.config.labels)) {
      const valueEl = q(`.${name2} .value`, null, inst);
      const labelEl = q(`.${name2} .label`, null, inst);
      if (valueEl && valueEl.innerHTML != data[name2]) {
        valueEl.innerHTML = data[name2];
        if (name2 === "days" && "0" == data[name2]) {
          valueEl.parentElement.setAttribute("hidden", "");
        }
      }
      if (labelEl) {
        if (labelEl.dataset.singular && (data[name2] == "1" || data[name2] == "01")) {
          labelEl.innerHTML = labelEl.dataset.singular;
        } else if (labelEl.dataset.plural) {
          labelEl.innerHTML = labelEl.dataset.plural;
        }
      }
    }
  }
  function checkFinished(data, inst) {
    if (data.diff > 0) {
      return false;
    }
    clearInterval(inst.interval);
    data.diff = 0;
    computeData(data, inst);
    if (inst.config.onComplete) {
      inst.config.onComplete(inst);
    }
    if (inst.config.reloadOnComplete) {
      window.location.reload();
    } else if (inst.config.url) {
      window.location.replace(inst.config.url);
    }
    return true;
  }
  var CountdownElement = class extends FormidableElement_default {
    created() {
      this.config = Object.assign(
        {
          locale: this.dataset.locale || "default",
          timer: true,
          pad: false,
          decimalDigits: 0,
          labels: {
            days: "d",
            hours: "h",
            minutes: "m",
            seconds: "s"
          },
          interval: 1e3
          // in ms
        },
        this.config
      );
      this.config.labels = localeProvider_default(name, this.config.locale, this.config.labels);
      ["start", "end", "url"].forEach((attr) => {
        const v = this.dataset[attr];
        if (v) {
          this.config[attr] = v;
        }
        if (typeof this.config[attr] == "object") {
          this.config[attr] = changeDate(this.config[attr]);
        }
      });
      const start = asDate(this.config.start);
      const end = asDate(this.config.end);
      if (!start || !end) {
        return;
      }
      let base = /* @__PURE__ */ new Date();
      if (!this.firstChild) {
        this.innerHTML = Object.keys(this.config.labels).reduce((pv, cv) => {
          if (this.config.unit && this.config.unit != cv) {
            return pv;
          }
          return `${pv} <span class="unit ${cv}"><span class="value"></span><span class="label">${this.config.labels[cv]}</span></span>`;
        }, "");
      }
      const initDiff = base.getTime() - start.getTime();
      const data = {};
      data.diff = end.getTime() - start.getTime();
      if (checkFinished(data, this)) {
        return;
      }
      computeData(data, this);
      if (!this.config.timer) {
        return;
      }
      if (this.config.onInit) {
        this.config.onInit(this);
      }
      this.interval = setInterval(() => {
        if (start.getTime() > (/* @__PURE__ */ new Date()).getTime()) {
          return;
        }
        if (checkFinished(data, this)) {
          return;
        }
        computeData(data, this);
        if (this.config.onTick) {
          this.config.onTick(this, data);
        }
        const now = /* @__PURE__ */ new Date();
        data.diff = end.getTime() - now.getTime() + initDiff;
      }, this.config.interval);
    }
    destroyed() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  };
  var CountdownElement_default = CountdownElement;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name2, cls) => {
    if (!registry.get(name2)) {
      registry.define(name2, cls);
    }
  };

  // src/count-down.js
  defineEl_default("count-down", CountdownElement_default);
  var count_down_default = CountdownElement_default;
})();
