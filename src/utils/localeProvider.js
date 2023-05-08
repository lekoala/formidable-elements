/**
 * A simple helper for the locale-provider element
 * Expects that you already loaded it beforehand or will return a blank object
 * @returns {Object}
 */
export default function localeProvider(name, locale) {
  const el = customElements.get("locale-provider");
  if (!el) {
    return null;
  }
  //@ts-ignore
  return el.for(name, locale);
}
