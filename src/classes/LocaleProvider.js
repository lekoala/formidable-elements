const dict = {};

/**
 * In classes using this element, simply use localeProvider util and do not include this whole class multiple times
 */
class LocaleProvider extends HTMLElement {
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
      // Do some smart guessing if possible
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
}

export default LocaleProvider;
