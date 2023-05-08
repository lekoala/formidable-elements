/**
 * @typedef LocaleProvider
 * @property {Function} for
 */

/**
 * A simple getter for the locale-provider element
 * Expects that you already loaded it beforehand
 * @returns {LocaleProvider}
 */
export default function localeProvider() {
  //@ts-ignore
  return customElements.get("locale-provider");
}
