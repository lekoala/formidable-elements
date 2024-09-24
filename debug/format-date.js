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
    const s = "0000-01-01 00:00:00";
    while (str.length < s.length) {
      str += s[str.length];
    }
    return str;
  }
  function toDateTime(date) {
    date = asDate(date);
    return new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().split(".")[0].replace("T", " ");
  }
  function toDate(date) {
    return toDateTime(date).split(" ")[0];
  }
  function toTime(date) {
    return toDateTime(date).split(" ")[1];
  }

  // src/utils/defaultLang.js
  var lang = document.documentElement.getAttribute("lang") || navigator.language;
  var defaultLang_default = lang;

  // src/utils/reflectedProperties.js
  var reflectedProperties_default = (obj, props) => {
    for (const key of props) {
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

  // src/classes/DateFormatter.js
  var DateFormatter = class _DateFormatter extends FormidableElement_default {
    value;
    lang;
    timeStyle;
    dateStyle;
    format;
    constructor() {
      super();
      reflectedProperties_default(this, _DateFormatter.observedAttributes);
    }
    static get observedAttributes() {
      return ["value", "lang", "timeStyle", "dateStyle", "format"];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (this.formatter) {
        if (attrName != "value") {
          this.updateFormatter();
        }
        this.render();
      }
    }
    /**
     * @returns {Intl.DateTimeFormatOptions}
     */
    getOptions() {
      const defaultFormat = new Intl.DateTimeFormat();
      const options = Object.assign(defaultFormat.resolvedOptions(), this.config);
      if (this.dateStyle) {
        options.dateStyle = this.dateStyle;
      }
      if (this.timeStyle) {
        options.timeStyle = this.timeStyle;
      }
      if (options.dateStyle || options.timeStyle) {
        delete options["year"];
        delete options["month"];
        delete options["day"];
      }
      return options;
    }
    updateFormatter() {
      const lang2 = this.lang || defaultLang_default;
      this.formatter = new Intl.DateTimeFormat(lang2, this.getOptions());
    }
    render() {
      const v = new Date(this.value);
      if (isNaN(v.getTime())) {
        this.innerText = "";
        return;
      }
      let f;
      switch (this.format) {
        case "iso":
          f = v.toISOString();
          break;
        case "utc":
          f = v.toUTCString();
          break;
        case "datetime":
          f = toDateTime(v);
          break;
        case "date":
          f = toDate(v);
          break;
        case "time":
          f = toTime(v);
          break;
        default:
          f = this.formatter.format(v);
          break;
      }
      this.innerText = f;
    }
    connected() {
      if (!this.value) {
        this.value = (/* @__PURE__ */ new Date()).toString();
      }
      this.updateFormatter();
      this.render();
    }
  };
  var DateFormatter_default = DateFormatter;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/format-date.js
  defineEl_default("format-date", DateFormatter_default);
  var format_date_default = DateFormatter_default;
})();
