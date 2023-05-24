/**
 * @typedef {Object} MoneyResult
 * @property {string|number} input - Source string
 * @property {string} locale - Locale used
 * @property {string} currency - Currency used
 * @property {boolean} isValid - Is valid input
 * @property {string} string - String using fixed point notation
 * @property {Number} number - Number instance with format
 * @property {string} output - Formatted output
 */

/**
 * Parse value to currency
 * @link https://jsfiddle.net/3pg081wv/6/
 * @param {number|string} input - Given input
 * @param {string} locale - Desired locale i.e: "en-US" "hr-HR"
 * @param {string} currency - Currency to use "USD" "EUR" "HRK"
 * @return {MoneyResult} - Formatting results
 */
export default (input, locale = "en-US", currency = "USD") => {
  let fmt = String(input);
  // Check for negative numbers (using - or formatted utf8 sign)
  const neg = fmt[0] === "-" || fmt[0] === "−";
  // Remove invalid characters
  fmt = fmt.replace(/[^\d\.,]/g, "");
  // Remove thousands separators (indian included), one at a time
  do {
    fmt = fmt.replace(/(\.|,)(\d{2,3})(\.|,)/, "$2$3");
  } while (fmt.match(/(\.|,)(\d{2,3})(\.|,)/));
  // Remaining , separators are decimals separators
  fmt = fmt.replace(",", ".");

  // Deal with decimals
  const pts = fmt.split(".");
  if (pts.length > 1) {
    // If zero or blank, consider decimal, otherwise join
    if (+pts[0] === 0) fmt = pts.join(".");
    else if (pts[1].length === 3) fmt = pts.join("");
  }

  if (neg) {
    fmt = "-" + fmt;
  }
  const number = Number(fmt);
  const isValid = isFinite(number);
  const string = number.toFixed(2);
  const intlNFOpts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).resolvedOptions();
  const output = number.toLocaleString(locale, {
    ...intlNFOpts,
    style: "decimal",
  });
  return {
    input,
    locale,
    currency,
    isValid,
    string,
    number,
    output,
  };
};
