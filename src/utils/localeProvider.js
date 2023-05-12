/**
 * A simple helper for the locale-provider element
 * Expects that you already loaded it beforehand or will return a blank object if not loaded/used
 *
 * @param {string} name
 * @param {string} locale
 * @param {Object|null} defaults
 * @returns {Object|null}
 */
export default function localeProvider(name, locale = "default", defaults = null) {
  const el = customElements.get("locale-provider");
  if (!el) {
    return defaults;
  }
  //@ts-ignore
  return Object.assign(defaults || {}, el.for(name, locale));
}
