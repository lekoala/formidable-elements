const nf = Intl.NumberFormat;

/**
 * Parse a localized number to a float.
 * @param {string} v the localized number
 * @param {string|Array} locale [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 * @returns {Number}
 */
export default (v, locale = []) => {
  v = v.replace(/[^0-9\.,]/g, "");

  const pattern = /\p{Number}/gu;
  const ts = nf(locale).format(11111).replace(pattern, "");
  const ds = nf(locale).format(1.1).replace(pattern, "");

  return parseFloat(v.replace(new RegExp("\\" + ts, "g"), "").replace(new RegExp("\\" + ds), "."));
};
