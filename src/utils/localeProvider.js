/**
 * A simple helper for the locale-provider element
 * Expects that you already loaded it beforehand or will return a blank object if not loaded/used
 *
 * @param {string} name
 * @param {string} locale
 * @param {Object} defaults
 * @returns {Object|null}
 */
export default function localeProvider(name, locale = "default", defaults = null) {
  const el = customElements.get("locale-provider");
  if (!el) {
    return defaults;
  }
  //@ts-ignore
  return el.for(name, locale);
}
