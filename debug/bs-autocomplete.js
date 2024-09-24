(() => {
  // node_modules/bootstrap5-autocomplete/autocomplete.js
  var DEFAULTS = {
    showAllSuggestions: false,
    suggestionsThreshold: 1,
    maximumItems: 0,
    autoselectFirst: true,
    ignoreEnter: false,
    tabSelect: false,
    updateOnSelect: false,
    highlightTyped: false,
    highlightClass: "",
    fullWidth: false,
    fixed: false,
    fuzzy: false,
    startsWith: false,
    fillIn: false,
    preventBrowserAutocomplete: false,
    itemClass: "",
    activeClasses: ["bg-primary", "text-white"],
    labelField: "label",
    valueField: "value",
    searchFields: ["label"],
    queryParam: "query",
    items: [],
    source: null,
    hiddenInput: false,
    hiddenValue: "",
    clearControl: "",
    datalist: "",
    server: "",
    serverMethod: "GET",
    serverParams: {},
    serverDataKey: "data",
    fetchOptions: {},
    liveServer: false,
    noCache: true,
    debounceTime: 300,
    notFoundMessage: "",
    onRenderItem: (item, label, inst) => {
      return label;
    },
    onSelectItem: (item, inst) => {
    },
    onServerResponse: (response, inst) => {
      return response.json();
    },
    onServerError: (e, signal, inst) => {
      if (e.name === "AbortError" || signal.aborted) {
        return;
      }
      console.error(e);
    },
    onChange: (item, inst) => {
    },
    onBeforeFetch: (inst) => {
    },
    onAfterFetch: (inst) => {
    }
  };
  var LOADING_CLASS = "is-loading";
  var ACTIVE_CLASS = "is-active";
  var SHOW_CLASS = "show";
  var NEXT = "next";
  var PREV = "prev";
  var INSTANCE_MAP = /* @__PURE__ */ new WeakMap();
  var counter = 0;
  var activeCounter = 0;
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function normalize(str) {
    if (!str) {
      return "";
    }
    return removeDiacritics(str.toString()).toLowerCase();
  }
  function fuzzyMatch(str, lookup) {
    if (str.indexOf(lookup) >= 0) {
      return true;
    }
    let pos = 0;
    for (let i = 0; i < lookup.length; i++) {
      const c = lookup[i];
      if (c == " ") continue;
      pos = str.indexOf(c, pos) + 1;
      if (pos <= 0) {
        return false;
      }
    }
    return true;
  }
  function insertAfter(el, newEl) {
    return el.parentNode.insertBefore(newEl, el.nextSibling);
  }
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  function attrs(el, attrs2) {
    for (const [k, v] of Object.entries(attrs2)) {
      el.setAttribute(k, v);
    }
  }
  function zwijit(el) {
    el.ariaLabel = el.innerText;
    el.innerHTML = el.innerText.split("").map((char) => char + "&zwj;").join("");
  }
  function nested(str, obj = "window") {
    return str.split(".").reduce((r, p) => r[p], obj);
  }
  var Autocomplete = class {
    /**
     * @param {HTMLInputElement} el
     * @param {Config|Object} config
     */
    constructor(el, config = {}) {
      if (!(el instanceof HTMLElement)) {
        console.error("Invalid element", el);
        return;
      }
      INSTANCE_MAP.set(el, this);
      counter++;
      activeCounter++;
      this._searchInput = el;
      this._configure(config);
      this._isMouse = false;
      this._preventInput = false;
      this._keyboardNavigation = false;
      this._searchFunc = debounce(() => {
        this._loadFromServer(true);
      }, this._config.debounceTime);
      this._configureSearchInput();
      this._configureDropElement();
      if (this._config.fixed) {
        document.addEventListener("scroll", this, true);
        window.addEventListener("resize", this);
      }
      const clearControl = this._getClearControl();
      if (clearControl) {
        clearControl.addEventListener("click", this);
      }
      ["focus", "change", "blur", "input", "keydown"].forEach((type) => {
        this._searchInput.addEventListener(type, this);
      });
      ["mousemove", "mouseleave"].forEach((type) => {
        this._dropElement.addEventListener(type, this);
      });
      this._fetchData();
    }
    // #region Core
    /**
     * Attach to all elements matched by the selector
     * @param {string} selector
     * @param {Config|Object} config
     */
    static init(selector = "input.autocomplete", config = {}) {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        this.getOrCreateInstance(el, config);
      });
    }
    /**
     * @param {HTMLInputElement} el
     */
    static getInstance(el) {
      return INSTANCE_MAP.has(el) ? INSTANCE_MAP.get(el) : null;
    }
    /**
     * @param {HTMLInputElement} el
     * @param {Object} config
     */
    static getOrCreateInstance(el, config = {}) {
      return this.getInstance(el) || new this(el, config);
    }
    dispose() {
      activeCounter--;
      ["focus", "change", "blur", "input", "keydown"].forEach((type) => {
        this._searchInput.removeEventListener(type, this);
      });
      ["mousemove", "mouseleave"].forEach((type) => {
        this._dropElement.removeEventListener(type, this);
      });
      const clearControl = this._getClearControl();
      if (clearControl) {
        clearControl.removeEventListener("click", this);
      }
      if (this._config.fixed && activeCounter <= 0) {
        document.removeEventListener("scroll", this, true);
        window.removeEventListener("resize", this);
      }
      this._dropElement.parentElement.removeChild(this._dropElement);
      INSTANCE_MAP.delete(this._searchInput);
    }
    _getClearControl() {
      if (this._config.clearControl) {
        return document.querySelector(this._config.clearControl);
      }
    }
    /**
     * @link https://github.com/lifaon74/events-polyfill/issues/10
     * @link https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4#handling-events
     * @param {Event} event
     */
    handleEvent = (event) => {
      const debounced = ["scroll", "resize"];
      if (debounced.includes(event.type)) {
        if (this._timer) window.cancelAnimationFrame(this._timer);
        this._timer = window.requestAnimationFrame(() => {
          this[`on${event.type}`](event);
        });
      } else {
        this[`on${event.type}`](event);
      }
    };
    /**
     * @param {Config|Object} config
     */
    _configure(config = {}) {
      this._config = Object.assign({}, DEFAULTS);
      const o = { ...config, ...this._searchInput.dataset };
      const parseBool = (value) => ["true", "false", "1", "0", true, false].includes(value) && !!JSON.parse(value);
      for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
        if (o[key] === void 0) {
          continue;
        }
        const value = o[key];
        switch (typeof defaultValue) {
          case "number":
            this._config[key] = parseInt(value);
            break;
          case "boolean":
            this._config[key] = parseBool(value);
            break;
          case "string":
            this._config[key] = value.toString();
            break;
          case "object":
            if (Array.isArray(defaultValue)) {
              if (typeof value === "string") {
                const separator = value.includes("|") ? "|" : ",";
                this._config[key] = value.split(separator);
              } else {
                this._config[key] = value;
              }
            } else {
              this._config[key] = typeof value === "string" ? JSON.parse(value) : value;
            }
            break;
          case "function":
            this._config[key] = typeof value === "string" ? window[value] : value;
            break;
          default:
            this._config[key] = value;
            break;
        }
      }
    }
    // #endregion
    // #region Html
    _configureSearchInput() {
      this._searchInput.autocomplete = "off";
      this._searchInput.spellcheck = false;
      attrs(this._searchInput, {
        "aria-autocomplete": "list",
        "aria-haspopup": "menu",
        "aria-expanded": "false",
        role: "combobox"
      });
      if (this._searchInput.id && this._config.preventBrowserAutocomplete) {
        const label = document.querySelector(`[for="${this._searchInput.id}"]`);
        if (label) {
          zwijit(label);
        }
      }
      this._hiddenInput = null;
      if (this._config.hiddenInput) {
        this._hiddenInput = document.createElement("input");
        this._hiddenInput.type = "hidden";
        this._hiddenInput.value = this._config.hiddenValue;
        this._hiddenInput.name = this._searchInput.name;
        this._searchInput.name = "_" + this._searchInput.name;
        insertAfter(this._searchInput, this._hiddenInput);
      }
    }
    _configureDropElement() {
      this._dropElement = document.createElement("ul");
      this._dropElement.id = "ac-menu-" + counter;
      this._dropElement.classList.add(...["dropdown-menu", "autocomplete-menu", "p-0"]);
      this._dropElement.style.maxHeight = "280px";
      if (!this._config.fullWidth) {
        this._dropElement.style.maxWidth = "360px";
      }
      if (this._config.fixed) {
        this._dropElement.style.position = "fixed";
      }
      this._dropElement.style.overflowY = "auto";
      this._dropElement.style.overscrollBehavior = "contain";
      this._dropElement.style.textAlign = "unset";
      insertAfter(this._searchInput, this._dropElement);
      this._searchInput.setAttribute("aria-controls", this._dropElement.id);
    }
    // #endregion
    // #region Events
    onclick(e) {
      if (e.target.matches(this._config.clearControl)) {
        this.clear();
      }
    }
    oninput(e) {
      if (this._preventInput) {
        return;
      }
      if (this._hiddenInput) {
        this._hiddenInput.value = null;
      }
      this.showOrSearch();
    }
    onchange(e) {
      const search = this._searchInput.value;
      const item = Object.values(this._items).find((item2) => item2.label === search);
      this._config.onChange(item, this);
    }
    onblur(e) {
      const related = e.relatedTarget;
      if (this._isMouse && related && (related.classList.contains("modal") || related.classList.contains("autocomplete-menu"))) {
        this._searchInput.focus();
        return;
      }
      setTimeout(() => {
        this.hideSuggestions();
      }, 100);
    }
    onfocus(e) {
      this.showOrSearch();
    }
    /**
     * keypress doesn't send arrow keys, so we use keydown
     * @param {KeyboardEvent} e
     */
    onkeydown(e) {
      const key = e.keyCode || e.key;
      switch (key) {
        case 13:
        case "Enter":
          if (this.isDropdownVisible()) {
            const selection = this.getSelection();
            if (selection) {
              selection.click();
            }
            if (selection || !this._config.ignoreEnter) {
              e.preventDefault();
            }
          }
          break;
        case 9:
        case "Tab":
          if (this.isDropdownVisible() && this._config.tabSelect) {
            const selection = this.getSelection();
            if (selection) {
              selection.click();
              e.preventDefault();
            }
          }
          break;
        case 38:
        case "ArrowUp":
          e.preventDefault();
          this._keyboardNavigation = true;
          this._moveSelection(PREV);
          break;
        case 40:
        case "ArrowDown":
          e.preventDefault();
          this._keyboardNavigation = true;
          if (this.isDropdownVisible()) {
            this._moveSelection(NEXT);
          } else {
            this.showOrSearch(false);
          }
          break;
        case 27:
        case "Escape":
          if (this.isDropdownVisible()) {
            this._searchInput.focus();
            this.hideSuggestions();
          }
          break;
      }
    }
    onmousemove(e) {
      this._isMouse = true;
      this._keyboardNavigation = false;
    }
    onmouseleave(e) {
      this._isMouse = false;
      this.removeSelection();
    }
    onscroll(e) {
      this._positionMenu();
    }
    onresize(e) {
      this._positionMenu();
    }
    // #endregion
    // #region Api
    /**
     * @param {String} k
     * @returns {Config}
     */
    getConfig(k = null) {
      if (k !== null) {
        return this._config[k];
      }
      return this._config;
    }
    /**
     * @param {String} k
     * @param {*} v
     */
    setConfig(k, v) {
      this._config[k] = v;
    }
    setData(src) {
      this._items = {};
      this._addItems(src);
    }
    enable() {
      this._searchInput.setAttribute("disabled", "");
    }
    disable() {
      this._searchInput.removeAttribute("disabled");
    }
    /**
     * @returns {boolean}
     */
    isDisabled() {
      return this._searchInput.hasAttribute("disabled") || this._searchInput.disabled || this._searchInput.hasAttribute("readonly");
    }
    /**
     * @returns {boolean}
     */
    isDropdownVisible() {
      return this._dropElement.classList.contains(SHOW_CLASS);
    }
    clear() {
      this._searchInput.value = "";
      if (this._hiddenInput) {
        this._hiddenInput.value = "";
      }
    }
    // #endregion
    // #region Selection management
    /**
     * @returns {HTMLElement}
     */
    getSelection() {
      return this._dropElement.querySelector("a." + ACTIVE_CLASS);
    }
    removeSelection() {
      const selection = this.getSelection();
      if (selection) {
        selection.classList.remove(...this._activeClasses());
      }
    }
    /**
     * @returns {Array}
     */
    _activeClasses() {
      return [...this._config.activeClasses, ...[ACTIVE_CLASS]];
    }
    /**
     * @param {HTMLElement} li
     * @returns {Boolean}
     */
    _isItemEnabled(li) {
      if (li.style.display === "none") {
        return false;
      }
      const fc = li.firstElementChild;
      return fc.tagName === "A" && !fc.classList.contains("disabled");
    }
    /**
     * @param {String} dir
     * @param {*|HTMLElement} sel
     * @returns {HTMLElement}
     */
    _moveSelection(dir = NEXT, sel = null) {
      const active = this.getSelection();
      if (!active) {
        if (dir === PREV) {
          return sel;
        }
        if (!sel) {
          sel = this._dropElement.firstChild;
          while (sel && !this._isItemEnabled(sel)) {
            sel = sel["nextSibling"];
          }
        }
      } else {
        const sibling = dir === NEXT ? "nextSibling" : "previousSibling";
        sel = active.parentNode;
        do {
          sel = sel[sibling];
        } while (sel && !this._isItemEnabled(sel));
        if (sel) {
          active.classList.remove(...this._activeClasses());
          if (dir === PREV) {
            sel.parentNode.scrollTop = sel.offsetTop - sel.parentNode.offsetTop;
          } else {
            if (sel.offsetTop > sel.parentNode.offsetHeight - sel.offsetHeight) {
              sel.parentNode.scrollTop += sel.offsetHeight;
            }
          }
        } else if (active) {
          sel = active.parentElement;
        }
      }
      if (sel) {
        const a = sel.querySelector("a");
        a.classList.add(...this._activeClasses());
        this._searchInput.setAttribute("aria-activedescendant", a.id);
        if (this._config.updateOnSelect) {
          this._searchInput.value = a.dataset.label;
        }
      } else {
        this._searchInput.setAttribute("aria-activedescendant", "");
      }
      return sel;
    }
    // #endregion
    // #region Implementation
    /**
     * Do we have enough input to show suggestions ?
     * @returns {Boolean}
     */
    _shouldShow() {
      if (this.isDisabled()) {
        return false;
      }
      return this._searchInput.value.length >= this._config.suggestionsThreshold;
    }
    /**
     * Show suggestions or load them
     * @param {Boolean} check
     */
    showOrSearch(check = true) {
      if (check && !this._shouldShow()) {
        this.hideSuggestions();
        return;
      }
      if (this._config.liveServer) {
        this._searchFunc();
      } else if (this._config.source) {
        this._config.source(this._searchInput.value, (items) => {
          this.setData(items);
          this._showSuggestions();
        });
      } else {
        this._showSuggestions();
      }
    }
    /**
     * @param {String} name
     * @returns {HTMLElement}
     */
    _createGroup(name) {
      const newChild = this._createLi();
      const newChildSpan = document.createElement("span");
      newChild.append(newChildSpan);
      newChildSpan.classList.add(...["dropdown-header", "text-truncate"]);
      newChildSpan.innerHTML = name;
      return newChild;
    }
    /**
     * @param {String} lookup
     * @param {Object} item
     * @returns {HTMLElement}
     */
    _createItem(lookup, item) {
      let label = item.label;
      if (this._config.highlightTyped) {
        const idx = normalize(label).indexOf(lookup);
        if (idx !== -1) {
          label = label.substring(0, idx) + `<mark class="${this._config.highlightClass}">${label.substring(idx, idx + lookup.length)}</mark>` + label.substring(idx + lookup.length, label.length);
        }
      }
      label = this._config.onRenderItem(item, label, this);
      const newChild = this._createLi();
      const newChildLink = document.createElement("a");
      newChild.append(newChildLink);
      newChildLink.id = this._dropElement.id + "-" + this._dropElement.children.length;
      newChildLink.classList.add(...["dropdown-item", "text-truncate"]);
      if (this._config.itemClass) {
        newChildLink.classList.add(...this._config.itemClass.split(" "));
      }
      newChildLink.setAttribute("data-value", item.value);
      newChildLink.setAttribute("data-label", item.label);
      newChildLink.setAttribute("tabindex", "-1");
      newChildLink.setAttribute("role", "menuitem");
      newChildLink.setAttribute("href", "#");
      newChildLink.innerHTML = label;
      if (item.data) {
        for (const [key, value] of Object.entries(item.data)) {
          newChildLink.dataset[key] = value;
        }
      }
      if (this._config.fillIn) {
        const fillIn = document.createElement("button");
        fillIn.type = "button";
        fillIn.classList.add(...["btn", "btn-link", "border-0"]);
        fillIn.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H3.707l10.147 10.146a.5.5 0 0 1-.708.708L3 3.707V8.5a.5.5 0 0 1-1 0z"/>
      </svg>`;
        newChild.append(fillIn);
        newChild.classList.add(...["d-flex", "justify-content-between"]);
        fillIn.addEventListener("click", (event) => {
          this._searchInput.value = item.label;
          this._searchInput.focus();
        });
      }
      newChildLink.addEventListener("mouseenter", (event) => {
        if (this._keyboardNavigation || !this._isMouse) {
          return;
        }
        this.removeSelection();
        newChild.querySelector("a").classList.add(...this._activeClasses());
      });
      newChildLink.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
      newChildLink.addEventListener("click", (event) => {
        event.preventDefault();
        this._preventInput = true;
        this._searchInput.value = decodeHtml(item.label);
        if (this._hiddenInput) {
          this._hiddenInput.value = item.value;
        }
        this._config.onSelectItem(item, this);
        this.hideSuggestions();
        this._preventInput = false;
      });
      return newChild;
    }
    /**
     * Show drop menu with suggestions
     */
    _showSuggestions() {
      if (document.activeElement != this._searchInput) {
        return;
      }
      const lookup = normalize(this._searchInput.value);
      this._dropElement.innerHTML = "";
      const keys = Object.keys(this._items);
      let count = 0;
      let firstItem = null;
      const groups = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entry = this._items[key];
        const showAllSuggestions = this._config.showAllSuggestions || lookup.length === 0;
        let isMatched = lookup.length == 0 && this._config.suggestionsThreshold === 0;
        if (!showAllSuggestions && lookup.length > 0) {
          this._config.searchFields.forEach((sf) => {
            const text = normalize(entry[sf]);
            let found = false;
            if (this._config.fuzzy) {
              found = fuzzyMatch(text, lookup);
            } else {
              const idx = text.indexOf(lookup);
              found = this._config.startsWith ? idx === 0 : idx >= 0;
            }
            if (found) {
              isMatched = true;
            }
          });
        }
        const selectFirst = isMatched || lookup.length === 0;
        if (showAllSuggestions || isMatched) {
          count++;
          if (entry.group && !groups.includes(entry.group)) {
            const newItem2 = this._createGroup(entry.group);
            this._dropElement.appendChild(newItem2);
            groups.push(entry.group);
          }
          const newItem = this._createItem(lookup, entry);
          if (!firstItem && selectFirst) {
            firstItem = newItem;
          }
          this._dropElement.appendChild(newItem);
          if (this._config.maximumItems > 0 && count >= this._config.maximumItems) {
            break;
          }
        }
      }
      if (firstItem && this._config.autoselectFirst) {
        this.removeSelection();
        this._moveSelection(NEXT, firstItem);
      }
      if (count === 0) {
        if (this._config.notFoundMessage) {
          const newChild = this._createLi();
          newChild.innerHTML = `<span class="dropdown-item">${this._config.notFoundMessage}</span>`;
          this._dropElement.appendChild(newChild);
          this._showDropdown();
        } else {
          this.hideSuggestions();
        }
      } else {
        this._showDropdown();
      }
    }
    /**
     * @returns {HTMLLIElement}
     */
    _createLi() {
      const newChild = document.createElement("li");
      newChild.setAttribute("role", "presentation");
      return newChild;
    }
    /**
     * Show and position dropdown
     */
    _showDropdown() {
      this._dropElement.classList.add(SHOW_CLASS);
      this._dropElement.setAttribute("role", "menu");
      attrs(this._searchInput, {
        "aria-expanded": "true"
      });
      this._positionMenu();
    }
    /**
     * Show or hide suggestions
     * @param {Boolean} check
     */
    toggleSuggestions(check = true) {
      if (this._dropElement.classList.contains(SHOW_CLASS)) {
        this.hideSuggestions();
      } else {
        this.showOrSearch(check);
      }
    }
    /**
     * Hide the dropdown menu
     */
    hideSuggestions() {
      this._dropElement.classList.remove(SHOW_CLASS);
      attrs(this._searchInput, {
        "aria-expanded": "false"
      });
      this.removeSelection();
    }
    /**
     * @returns {HTMLInputElement}
     */
    getInput() {
      return this._searchInput;
    }
    /**
     * @returns {HTMLUListElement}
     */
    getDropMenu() {
      return this._dropElement;
    }
    /**
     * Position the dropdown menu
     */
    _positionMenu() {
      const styles = window.getComputedStyle(this._searchInput);
      const bounds = this._searchInput.getBoundingClientRect();
      const isRTL = styles.direction === "rtl";
      const fullWidth = this._config.fullWidth;
      const fixed = this._config.fixed;
      let left = null;
      let top = null;
      if (fixed) {
        left = bounds.x;
        top = bounds.y + bounds.height;
        if (isRTL && !fullWidth) {
          left -= this._dropElement.offsetWidth - bounds.width;
        }
      }
      this._dropElement.style.transform = "unset";
      if (fullWidth) {
        this._dropElement.style.width = this._searchInput.offsetWidth + "px";
      }
      if (left !== null) {
        this._dropElement.style.left = left + "px";
      }
      if (top !== null) {
        this._dropElement.style.top = top + "px";
      }
      const dropBounds = this._dropElement.getBoundingClientRect();
      const h = window.innerHeight;
      if (dropBounds.y + dropBounds.height > h) {
        const topOffset = fullWidth ? bounds.height + 4 : bounds.height;
        this._dropElement.style.transform = "translateY(calc(-100.1% - " + topOffset + "px))";
      }
    }
    _fetchData() {
      this._items = {};
      this._addItems(this._config.items);
      const dl = this._config.datalist;
      if (dl) {
        const datalist = document.querySelector(`#${dl}`);
        if (datalist) {
          const items = Array.from(datalist.children).map((o) => {
            const value = o.getAttribute("value") ?? o.innerHTML.toLowerCase();
            const label = o.innerHTML;
            return {
              value,
              label
            };
          });
          this._addItems(items);
        } else {
          console.error(`Datalist not found ${dl}`);
        }
      }
      this._setHiddenVal();
      if (this._config.server && !this._config.liveServer) {
        this._loadFromServer();
      }
    }
    _setHiddenVal() {
      if (this._config.hiddenInput && !this._config.hiddenValue) {
        for (const [value, entry] of Object.entries(this._items)) {
          if (entry.label == this._searchInput.value) {
            this._hiddenInput.value = value;
          }
        }
      }
    }
    /**
     * @param {Array|Object} src An array of items or a value:label object
     */
    _addItems(src) {
      const keys = Object.keys(src);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entry = src[key];
        if (entry.group && entry.items) {
          entry.items.forEach((e) => e.group = entry.group);
          this._addItems(entry.items);
          continue;
        }
        const label = typeof entry === "string" ? entry : entry.label;
        const item = typeof entry !== "object" ? {} : entry;
        item.label = entry[this._config.labelField] ?? label;
        item.value = entry[this._config.valueField] ?? key;
        if (item.label) {
          this._items[item.value] = item;
        }
      }
    }
    /**
     * @param {boolean} show
     */
    _loadFromServer(show = false) {
      if (this._abortController) {
        this._abortController.abort();
      }
      this._abortController = new AbortController();
      let extraParams = this._searchInput.dataset.serverParams || {};
      if (typeof extraParams == "string") {
        extraParams = JSON.parse(extraParams);
      }
      const params = Object.assign({}, this._config.serverParams, extraParams);
      params[this._config.queryParam] = this._searchInput.value;
      if (this._config.noCache) {
        params.t = Date.now();
      }
      if (params.related) {
        const input = document.getElementById(params.related);
        if (input) {
          params.related = input.value;
          const inputName = input.getAttribute("name");
          if (inputName) {
            params[inputName] = input.value;
          }
        }
      }
      const urlParams = new URLSearchParams(params);
      let url = this._config.server;
      let fetchOptions = Object.assign(this._config.fetchOptions, {
        method: this._config.serverMethod || "GET",
        signal: this._abortController.signal
      });
      if (fetchOptions.method === "POST") {
        fetchOptions.body = urlParams;
      } else {
        url += "?" + urlParams.toString();
      }
      this._searchInput.classList.add(LOADING_CLASS);
      this._config.onBeforeFetch(this);
      fetch(url, fetchOptions).then((r) => this._config.onServerResponse(r, this)).then((suggestions) => {
        const data = nested(this._config.serverDataKey, suggestions) || suggestions;
        this.setData(data);
        this._setHiddenVal();
        this._abortController = null;
        if (show) {
          this._showSuggestions();
        }
      }).catch((e) => {
        this._config.onServerError(e, this._abortController.signal, this);
      }).finally((e) => {
        this._searchInput.classList.remove(LOADING_CLASS);
        this._config.onAfterFetch(this);
      });
    }
    // #endregion
  };
  var autocomplete_default = Autocomplete;

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

  // src/utils/rmElements.js
  var rmElements_default = (context, selectors) => {
    selectors = typeof selectors === "string" ? [selectors] : selectors;
    selectors.forEach((selector) => {
      context.querySelectorAll(selector).forEach((element) => {
        element.remove();
      });
    });
  };

  // src/classes/BsAutocomplete.js
  var BsAutocomplete = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    get value() {
      return this.el.value;
    }
    created() {
      rmElements_default(this, "div.dropdown");
      this.config = Object.assign(
        {
          hiddenInput: true
        },
        this.config
      );
      this.lib = new autocomplete_default(this.el, this.config);
    }
    destroyed() {
      this.lib.dispose();
      this.lib = null;
    }
  };
  var BsAutocomplete_default = BsAutocomplete;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/bs-autocomplete.js
  defineEl_default("bs-autocomplete", BsAutocomplete_default);
  var bs_autocomplete_default = BsAutocomplete_default;
})();
/*! Bundled license information:

bootstrap5-autocomplete/autocomplete.js:
  (**
   * Bootstrap 5 autocomplete
   * https://github.com/lekoala/bootstrap5-autocomplete
   * @license MIT
   *)
*/
