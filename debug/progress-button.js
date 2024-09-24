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

  // src/utils/EventfulElement.js
  var observer = new window.IntersectionObserver((entries, obs) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      const target = entry.target;
      obs.unobserve(target);
      target.doCreate();
    });
  });
  var EventfulElement = class extends FormidableElement_default {
    get events() {
      return [];
    }
    parsedCallback() {
      this.lazy = this.hasAttribute("lazy");
      if (!this.config) {
        if (this.lazy) {
          observer.observe(this);
        } else {
          this.doCreate();
        }
      }
      if (this.config) {
        this.connected();
      }
    }
    doCreate() {
      this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
      this.created();
    }
    connectedCallback() {
      super.connectedCallback();
      this.events.forEach((t) => this.addEventListener(t, this));
    }
    trackFocus(ev) {
      if (ev.type == "focusin") {
        this.classList.add("has-focus");
      } else if (ev.type == "focusout") {
        this.classList.remove("has-focus");
      }
    }
    // Use arrow function to make sure that the scope is always this and cannot be rebound
    // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
    handleEvent = (ev) => {
      this.trackFocus(ev);
      this[`$${ev.type}`](ev);
    };
    disconnectedCallback() {
      if (this.lazy && this.config) {
        observer.unobserve(this);
      }
      this.events.forEach((t) => this.removeEventListener(t, this));
      super.disconnectedCallback();
    }
  };
  var EventfulElement_default = EventfulElement;

  // src/utils/ce.js
  var ce_default = (tagName) => {
    return document.createElement(tagName);
  };

  // src/utils/fetchWrapper.js
  var map = /* @__PURE__ */ new Map();
  var fetchWrapper_default = (url, params = {}, options = {}) => {
    if (url instanceof URL) {
      url = url.toString();
    }
    const base = {
      method: "GET"
    };
    if (!options.signal) {
      let ctrl = map.get(url);
      if (ctrl) {
        ctrl.abort();
      }
      ctrl = new AbortController();
      map.set(url, ctrl);
      base["signal"] = ctrl.signal;
    }
    let fetchOptions = Object.assign(base, options);
    const headers = fetchOptions.headers || {};
    if (!url.includes("https://cdn.jsdelivr.net")) {
      headers["X-Requested-With"] = "XMLHttpRequest";
    }
    fetchOptions.headers = headers;
    const searchParams = new URLSearchParams(params);
    if (fetchOptions.method === "POST" && !fetchOptions.body) {
      fetchOptions.body = searchParams;
      fetchOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      url += "?" + searchParams.toString();
    }
    return fetch(url, fetchOptions);
  };

  // src/utils/fetchJson.js
  var fetchJson_default = (url, params = {}, options = {}) => {
    const headers = options.headers || {};
    headers["Accept"] = "application/json";
    if (options.body && typeof options.body != "string" && options.method == "POST") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    options.headers = headers;
    return fetchWrapper_default(url, params, options).then((response) => {
      return response.text().then((text) => {
        let data;
        let showError = !response.ok;
        try {
          data = text && JSON.parse(text);
        } catch (e) {
          showError = true;
          data = {
            message: "Invalid JSON response"
          };
        }
        if (showError) {
          const error = data && data.message || response.statusText;
          return Promise.reject(error);
        }
        return data;
      });
    });
  };

  // src/utils/formDataToObject.js
  var formDataToObject_default = (formData) => {
    let object = {};
    formData.forEach((value, key) => {
      if (!Reflect.has(object, key)) {
        object[key] = value;
        return;
      }
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    });
    return object;
  };

  // src/classes/ProgressButton.js
  function notify(text, opts = {}) {
    const pop = customElements.get("pop-notify");
    if (pop) {
      pop.notify(text, opts);
    }
  }
  function progressiveCall(inst, url, formData) {
    fetchJson_default(url, formData, {
      headers: {
        "X-Progressive": 1
      },
      method: "POST"
    }).then((data) => {
      if (data === null) {
        notify("Invalid handler");
        return;
      }
      if (data.message) {
        const opts = data.message_options || {};
        notify(data.message, opts);
      }
      const total = parseInt(data.progress_total);
      const curr = parseInt(data.progress_step);
      const isProgressComplete = total && curr >= total;
      if (data.finished || isProgressComplete) {
        inst.setProgress(100);
        if (data.label) {
          inst.setText(data.label);
        }
        if (data.reload) {
          window.location.reload();
        } else if (data.url) {
          window.location.href = data.url;
        } else if (!data.label) {
          inst.clearProgress();
        }
        return;
      }
      Object.assign(formData, data);
      if (curr && total) {
        const perc = Math.round(curr / total * 100);
        inst.setProgress(perc);
      } else {
        inst.dataset.hideTextProgress = "1";
        let perc = curr * 10;
        if (perc > 50) {
          perc = 25 + curr * 5;
        }
        if (perc > 75) {
          perc = 50 + curr * 2.5;
        }
        if (curr > 90) {
          perc = curr;
        }
        if (perc > 90) {
          perc = 90;
        }
        inst.setProgress(perc);
      }
      progressiveCall(inst, url, formData);
    }).catch((err) => {
      inst.clearProgress();
      inst.setText("Error");
      console.error(err);
    });
  }
  var ProgressButton = class extends EventfulElement_default {
    get events() {
      return ["click"];
    }
    /**
     * @returns {HTMLButtonElement|HTMLAnchorElement}
     */
    get el() {
      return this.querySelector("button,a");
    }
    /**
     * @returns {HTMLDivElement}
     */
    get progress() {
      return this.querySelector("div");
    }
    created() {
      this.style.display = "inline-block";
      this.style.position = "relative";
    }
    $click(ev) {
      ev.preventDefault();
      const el = this.el;
      if (el.classList.contains("disabled") || el.hasAttribute("disabled")) {
        return;
      }
      const msg = this.dataset.confirmMessage;
      if (msg) {
        if (!confirm(msg)) {
          return;
        }
      }
      let url = el.dataset.url;
      if (!url) {
        url = el.dataset.href || el.getAttribute("href");
      }
      let form = el.closest("form");
      if (el.hasAttribute("form")) {
        form = document.querySelector(`${el.getAttribute("form")}`);
      }
      let formData = {};
      if (form) {
        if (!url) {
          url = form.getAttribute("action");
        }
        formData = formDataToObject_default(new FormData(form));
      }
      if (el instanceof HTMLButtonElement) {
        formData[el.getAttribute("name") || "_action"] = el.value || el.innerText;
      }
      formData["progress_step"] = 0;
      const progressTotal = this.dataset.progressTotal;
      if (typeof progressTotal !== "undefined" && progressTotal !== null) {
        formData["progress_total"] = progressTotal;
      }
      el.classList.add("disabled");
      el.setAttribute("disabled", "");
      const progress = ce_default("div");
      Object.assign(progress.style, {
        position: "absolute",
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        background: "#000",
        borderRadius: window.getComputedStyle(el).borderRadius,
        zIndex: "-1",
        transition: "width 0.1s ease"
      });
      this.appendChild(progress);
      if (this.dataset.waitMessage) {
        this.setText(this.dataset.waitMessage);
      } else {
        this.setProgress(0);
      }
      progressiveCall(this, url, formData);
    }
    setProgress(perc) {
      if (!this.dataset.hideTextProgress) {
        this.setText(perc + "%");
      }
      this.el.style.opacity = "0.5";
      this.progress.style.width = `${perc}%`;
    }
    clearProgress() {
      this.restoreText();
      this.el.style.opacity = "unset";
      this.progress.remove();
      this.el.classList.remove("disabled");
      this.el.removeAttribute("disabled");
    }
    setText(str) {
      const el = this.el;
      el.style.width = `${el.getBoundingClientRect().width}px`;
      const txt = el.querySelector("span") || el;
      if (!this.original) {
        this.original = txt.innerHTML;
      }
      txt.innerHTML = str;
    }
    restoreText() {
      if (this.original) {
        this.setText(this.original);
      }
    }
  };
  var ProgressButton_default = ProgressButton;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/progress-button.js
  defineEl_default("progress-button", ProgressButton_default);
  var progress_button_default = ProgressButton_default;
})();
