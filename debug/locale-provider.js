(() => {
  // src/classes/LocaleProvider.js
  var dict = {};
  var LocaleProvider = class extends HTMLElement {
    /**
     * @param {string} name
     * @param {string} locale A locale name or 'default' for default locale
     * @param {Object} obj
     * @returns {void}
     */
    static set(name, locale, obj) {
      dict[name] = dict[name] || {};
      dict[name][locale] = Object.assign(dict[name][locale] || {}, obj);
    }
    /**
     * @param {string} name
     * @param {string} locale A given locale (as stored by set method) or default
     * @returns {Object}
     */
    static for(name, locale = "default") {
      const data = dict[name];
      if (data) {
        if (locale === "default") {
          let lang = navigator.language;
          if (lang) {
            if (data[lang]) {
              return data[lang];
            }
            lang = lang.split("-")[0];
            if (data[lang]) {
              return data[lang];
            }
          }
        }
        if (data[locale]) {
          return data[locale];
        }
      }
      return {};
    }
  };
  var LocaleProvider_default = LocaleProvider;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/locale-provider.js
  defineEl_default("locale-provider", LocaleProvider_default);
  var locale_provider_default = LocaleProvider_default;
})();
